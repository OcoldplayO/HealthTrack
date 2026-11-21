package repository

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

type DBManager struct {
	DB *sql.DB
}

var allowedMigrationTables = map[string]bool{
	"health_records": true,
	"ai_insights":    true,
}

type columnMigration struct {
	table    string
	column   string
	alterSQL string
}

var backupFilenamePattern = regexp.MustCompile(`^health_backup_(\d{8})\.db$`)

func InitDB(dbPath, backupDir string) (*DBManager, error) {
	isMemory := dbPath == ":memory:" || strings.HasPrefix(dbPath, "file::memory:")
	if !isMemory {
		dir := filepath.Dir(dbPath)
		if dir != "." && dir != "" {
			if err := os.MkdirAll(dir, 0755); err != nil {
				return nil, fmt.Errorf("创建数据库目录失败: %w", err)
			}
		}
	}

	existedBefore := !isMemory && fileExists(dbPath)

	// 使用 pure Go sqlite 驱动连接
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("打开 SQLite 失败: %w", err)
	}

	// 针对 SQLite 单写安全，配置连接池
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(0)

	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("Ping SQLite 失败: %w", err)
	}

	if err := configureSQLitePragmas(db, isMemory); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("配置 SQLite PRAGMA 失败: %w", err)
	}

	mgr := &DBManager{DB: db}
	if err := mgr.migrate(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("初始化数据库表结构失败: %w", err)
	}

	// 在数据库完成连接、WAL 配置与表迁移后，使用 VACUUM INTO 生成事务一致且紧凑的每日冷备份
	if existedBefore && backupDir != "" {
		runAutoBackup(db, backupDir, time.Now())
	}

	slog.Info("SQLite 数据库初始化就绪", "path", dbPath)
	return mgr, nil
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func configureSQLitePragmas(db *sql.DB, isMemory bool) error {
	var pragmas []string
	if !isMemory {
		pragmas = append(pragmas, `PRAGMA journal_mode=WAL;`)
	}
	pragmas = append(pragmas,
		`PRAGMA busy_timeout=5000;`,
		`PRAGMA synchronous=NORMAL;`,
		`PRAGMA foreign_keys=ON;`,
	)
	for _, stmt := range pragmas {
		if _, err := db.Exec(stmt); err != nil {
			return fmt.Errorf("%s: %w", stmt, err)
		}
	}
	return nil
}

// AutoMigrate 确保数据库表结构平滑演进
func (m *DBManager) AutoMigrate() error {
	return m.migrate()
}

func (m *DBManager) migrate() error {
	schema := `
	CREATE TABLE IF NOT EXISTS health_records (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		record_date TEXT NOT NULL,
		weight_am REAL,
		weight_pm REAL,
		waist_size REAL,
		sleep_start_time TEXT,
		sleep_end_time TEXT,
		sleep_hours REAL,
		sleep_tag TEXT DEFAULT 'GREEN',
		journal_text TEXT,
		activity_tags TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(user_id, record_date)
	);

	CREATE INDEX IF NOT EXISTS idx_records_user_date ON health_records(user_id, record_date);

	CREATE TABLE IF NOT EXISTS ai_insights (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		range_days INTEGER NOT NULL DEFAULT 30,
		start_date TEXT,
		end_date TEXT,
		content TEXT,
		thinking TEXT,
		model TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_insights_user_id ON ai_insights(user_id, id DESC);

	CREATE TABLE IF NOT EXISTS evening_summaries (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		record_date TEXT NOT NULL,
		done_1 TEXT DEFAULT '',
		done_2 TEXT DEFAULT '',
		done_3 TEXT DEFAULT '',
		note_text TEXT DEFAULT '',
		score INTEGER NOT NULL DEFAULT 0,
		photo_id INTEGER,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(user_id, record_date)
	);

	CREATE INDEX IF NOT EXISTS idx_evening_summaries_user_date ON evening_summaries(user_id, record_date DESC);

	CREATE TABLE IF NOT EXISTS evening_photos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		record_date TEXT NOT NULL,
		mime TEXT DEFAULT '',
		data BLOB,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_evening_photos_user_date ON evening_photos(user_id, record_date);

	CREATE TABLE IF NOT EXISTS import_batches (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		source_type TEXT NOT NULL DEFAULT 'csv',
		file_name TEXT DEFAULT '',
		file_hash TEXT DEFAULT '',
		file_size INTEGER NOT NULL DEFAULT 0,
		total_rows INTEGER NOT NULL DEFAULT 0,
		inserted INTEGER NOT NULL DEFAULT 0,
		updated INTEGER NOT NULL DEFAULT 0,
		skipped INTEGER NOT NULL DEFAULT 0,
		warnings INTEGER NOT NULL DEFAULT 0,
		errors INTEGER NOT NULL DEFAULT 0,
		conflict_mode TEXT NOT NULL DEFAULT 'merge',
		skip_errors INTEGER NOT NULL DEFAULT 0,
		status TEXT NOT NULL DEFAULT 'pending',
		error_message TEXT DEFAULT '',
		detail_json TEXT DEFAULT '{}',
		cache_path TEXT DEFAULT '',
		root_batch_id INTEGER,
		attempt_no INTEGER NOT NULL DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		finished_at DATETIME
	);

	CREATE INDEX IF NOT EXISTS idx_import_batches_user_id ON import_batches(user_id, id DESC);
	CREATE INDEX IF NOT EXISTS idx_import_batches_hash ON import_batches(user_id, file_hash);
	`
	if _, err := m.DB.Exec(schema); err != nil {
		return err
	}

	// 平滑增量扩展字段（先查 table_info 再按需迁移，避免静默吞掉真实 SQL 错误）
	migrations := []columnMigration{
		{"health_records", "sleep_bed_time", `ALTER TABLE health_records ADD COLUMN sleep_bed_time TEXT DEFAULT '';`},
		{"health_records", "sleep_wake_time", `ALTER TABLE health_records ADD COLUMN sleep_wake_time TEXT DEFAULT '';`},
		{"health_records", "exercise_json", `ALTER TABLE health_records ADD COLUMN exercise_json TEXT DEFAULT '{}';`},
		{"health_records", "cold_shower_json", `ALTER TABLE health_records ADD COLUMN cold_shower_json TEXT DEFAULT '{}';`},
		{"health_records", "concerta_json", `ALTER TABLE health_records ADD COLUMN concerta_json TEXT DEFAULT '{}';`},
		// 晨光 / 步数 / 午餐：晨光与步数允许 NULL，NULL 即「当天未记录」（图表断点，不按 0 计）
		{"health_records", "morning_light", `ALTER TABLE health_records ADD COLUMN morning_light INTEGER;`},
		{"health_records", "steps", `ALTER TABLE health_records ADD COLUMN steps INTEGER;`},
		{"health_records", "lunch_json", `ALTER TABLE health_records ADD COLUMN lunch_json TEXT DEFAULT '{}';`},
		// scope 区分洞察归属：health（生理周期洞察）/ evening（睡前小结洞察）/ compare（阶段对比）
		{"ai_insights", "scope", `ALTER TABLE ai_insights ADD COLUMN scope TEXT NOT NULL DEFAULT 'health';`},
		// meta_json 保存阶段对比（scope=compare）的两月边界与七项聚合指标快照
		{"ai_insights", "meta_json", `ALTER TABLE ai_insights ADD COLUMN meta_json TEXT DEFAULT '{}';`},
	}

	for _, mig := range migrations {
		if err := ensureColumn(m.DB, mig.table, mig.column, mig.alterSQL); err != nil {
			return err
		}
	}

	return nil
}

func ensureColumn(db *sql.DB, table, column, alterSQL string) error {
	if !allowedMigrationTables[table] {
		return fmt.Errorf("非法的迁移表名: %s", table)
	}
	rows, err := db.Query(fmt.Sprintf(`PRAGMA table_info(%s);`, table))
	if err != nil {
		return fmt.Errorf("检查表结构失败 (%s): %w", table, err)
	}
	exists := false
	for rows.Next() {
		var cid int
		var name, colType string
		var notNull int
		var dfltValue sql.NullString
		var pk int
		if scanErr := rows.Scan(&cid, &name, &colType, &notNull, &dfltValue, &pk); scanErr != nil {
			_ = rows.Close()
			return fmt.Errorf("读取表字段失败 (%s): %w", table, scanErr)
		}
		if name == column {
			exists = true
			break
		}
	}
	if err := rows.Err(); err != nil {
		_ = rows.Close()
		return fmt.Errorf("遍历表结构失败 (%s): %w", table, err)
	}
	_ = rows.Close()

	if exists {
		return nil
	}
	if _, err := db.Exec(alterSQL); err != nil {
		return fmt.Errorf("新增字段失败 (%s.%s): %w", table, column, err)
	}
	return nil
}

func (m *DBManager) Close() error {
	if m.DB != nil {
		return m.DB.Close()
	}
	return nil
}

// runAutoBackup 使用 VACUUM INTO 执行事务一致且紧凑的每日冷备份，并按策略滚动清理旧备份
func runAutoBackup(db *sql.DB, backupDir string, now time.Time) {
	if err := os.MkdirAll(backupDir, 0755); err != nil {
		slog.Warn("创建备份目录失败", "err", err)
		return
	}

	today := now.Format("20060102")
	backupFile := filepath.Join(backupDir, fmt.Sprintf("health_backup_%s.db", today))

	if _, err := os.Stat(backupFile); os.IsNotExist(err) {
		tmpFile := backupFile + ".tmp"
		_ = os.Remove(tmpFile)
		if _, err := db.Exec(`VACUUM INTO ?`, tmpFile); err != nil {
			_ = os.Remove(tmpFile)
			slog.Warn("执行每日数据库冷备份失败", "err", err)
		} else if err := os.Rename(tmpFile, backupFile); err != nil {
			_ = os.Remove(tmpFile)
			slog.Warn("重命名备份文件失败", "err", err)
		} else {
			slog.Info("已执行自动每日数据库冷备份", "backup_file", backupFile)
		}
	}

	pruneOldBackups(backupDir, now)
}

type datedBackup struct {
	name string
	path string
	date time.Time
}

// pruneOldBackups 滚动保留最近 14 天日备 + 第 15~42 天内（近 4 周）每周最早 1 份，清理更早历史备份
func pruneOldBackups(backupDir string, now time.Time) {
	entries, err := os.ReadDir(backupDir)
	if err != nil {
		slog.Warn("扫描备份目录失败", "err", err)
		return
	}

	todayMidnight := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	var weeklyCandidates []datedBackup

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		// 清理超过 24 小时的残留临时文件
		if strings.HasPrefix(name, "health_backup_") && strings.HasSuffix(name, ".db.tmp") {
			if info, statErr := entry.Info(); statErr == nil && now.Sub(info.ModTime()) > 24*time.Hour {
				_ = os.Remove(filepath.Join(backupDir, name))
			}
			continue
		}

		matches := backupFilenamePattern.FindStringSubmatch(name)
		if len(matches) != 2 {
			continue
		}
		fileDate, parseErr := time.ParseInLocation("20060102", matches[1], now.Location())
		if parseErr != nil {
			continue
		}

		dayDiff := int(todayMidnight.Sub(fileDate).Hours() / 24)
		if dayDiff < 14 {
			continue // 未来日期或近 14 天日备一律保留
		}
		fullPath := filepath.Join(backupDir, name)
		if dayDiff >= 42 {
			if rmErr := os.Remove(fullPath); rmErr == nil {
				slog.Info("已清理超期数据库冷备份", "file", name)
			}
			continue
		}
		weeklyCandidates = append(weeklyCandidates, datedBackup{
			name: name,
			path: fullPath,
			date: fileDate,
		})
	}

	// 按日期升序排序，同一 ISO 周保留最早的一份
	sort.Slice(weeklyCandidates, func(i, j int) bool {
		return weeklyCandidates[i].date.Before(weeklyCandidates[j].date)
	})
	keptWeek := make(map[string]bool)
	for _, item := range weeklyCandidates {
		isoYear, isoWeek := item.date.ISOWeek()
		weekKey := fmt.Sprintf("%04d-W%02d", isoYear, isoWeek)
		if !keptWeek[weekKey] {
			keptWeek[weekKey] = true
			continue
		}
		if rmErr := os.Remove(item.path); rmErr == nil {
			slog.Info("已滚动归并周内多余数据库备份", "file", item.name, "week", weekKey)
		}
	}
}
