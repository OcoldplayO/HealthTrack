package repository

import (
	"database/sql"
	"fmt"
	"io"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

type DBManager struct {
	DB *sql.DB
}

func InitDB(dbPath, backupDir string) (*DBManager, error) {
	// 确保数据库所在目录存在
	dir := filepath.Dir(dbPath)
	if dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return nil, fmt.Errorf("创建数据库目录失败: %w", err)
		}
	}

	// 启动时自动执行冷备份
	runAutoBackup(dbPath, backupDir)

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
		return nil, fmt.Errorf("Ping SQLite 失败: %w", err)
	}

	mgr := &DBManager{DB: db}
	if err := mgr.migrate(); err != nil {
		return nil, fmt.Errorf("初始化数据库表结构失败: %w", err)
	}

	slog.Info("SQLite 数据库初始化就绪", "path", dbPath)
	return mgr, nil
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
	`
	if _, err := m.DB.Exec(schema); err != nil {
		return err
	}

	// 平滑增量扩展字段 (忽略已存在列错误，保证向后兼容)
	alterStatements := []string{
		`ALTER TABLE health_records ADD COLUMN sleep_bed_time TEXT DEFAULT '';`,
		`ALTER TABLE health_records ADD COLUMN sleep_wake_time TEXT DEFAULT '';`,
		`ALTER TABLE health_records ADD COLUMN exercise_json TEXT DEFAULT '{}';`,
		`ALTER TABLE health_records ADD COLUMN cold_shower_json TEXT DEFAULT '{}';`,
		`ALTER TABLE health_records ADD COLUMN concerta_json TEXT DEFAULT '{}';`,
	}

	for _, stmt := range alterStatements {
		_, _ = m.DB.Exec(stmt)
	}

	return nil
}


func (m *DBManager) Close() error {
	if m.DB != nil {
		return m.DB.Close()
	}
	return nil
}

// runAutoBackup 自动冷备份与滚动归档
func runAutoBackup(dbPath, backupDir string) {
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		return
	}
	if err := os.MkdirAll(backupDir, 0755); err != nil {
		slog.Warn("创建备份目录失败", "err", err)
		return
	}

	today := time.Now().Format("20060102")
	backupFile := filepath.Join(backupDir, fmt.Sprintf("health_backup_%s.db", today))

	if _, err := os.Stat(backupFile); err == nil {
		return // 今日已备份
	}

	src, err := os.Open(dbPath)
	if err != nil {
		return
	}
	defer src.Close()

	dst, err := os.Create(backupFile)
	if err != nil {
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err == nil {
		slog.Info("已执行自动每日数据库冷备份", "backup_file", backupFile)
	}
}
