package repository

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestInitDBEnablesWALForeignKeysAndCreatesVacuumBackup(t *testing.T) {
	dir := t.TempDir()
	dbPath := filepath.Join(dir, "health.db")
	backupDir := filepath.Join(dir, "backups")

	// 首次建库并写入一条记录
	mgr, err := InitDB(dbPath, backupDir)
	if err != nil {
		t.Fatalf("首次初始化数据库失败: %v", err)
	}

	var journalMode string
	if err := mgr.DB.QueryRow(`PRAGMA journal_mode;`).Scan(&journalMode); err != nil {
		t.Fatalf("读取 journal_mode 失败: %v", err)
	}
	if journalMode != "wal" {
		t.Fatalf("预期 journal_mode 为 wal，实际为 %q", journalMode)
	}

	var foreignKeys int
	if err := mgr.DB.QueryRow(`PRAGMA foreign_keys;`).Scan(&foreignKeys); err != nil {
		t.Fatalf("读取 foreign_keys 失败: %v", err)
	}
	if foreignKeys != 1 {
		t.Fatalf("预期 foreign_keys 为 1，实际为 %d", foreignKeys)
	}

	if _, err := mgr.DB.Exec(`INSERT INTO health_records (user_id, record_date, weight_am) VALUES (1, '2026-11-20', 72.5)`); err != nil {
		t.Fatalf("插入测试数据失败: %v", err)
	}
	if err := mgr.Close(); err != nil {
		t.Fatalf("关闭数据库失败: %v", err)
	}

	// 二次打开已有库，应通过 VACUUM INTO 生成事务一致的每日冷备份
	mgr2, err := InitDB(dbPath, backupDir)
	if err != nil {
		t.Fatalf("二次初始化数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr2.Close() })

	// 幂等重复迁移验证
	if err := mgr2.AutoMigrate(); err != nil {
		t.Fatalf("幂等 AutoMigrate 失败: %v", err)
	}

	todayBackup := filepath.Join(backupDir, fmt.Sprintf("health_backup_%s.db", time.Now().Format("20060102")))
	if _, err := os.Stat(todayBackup); err != nil {
		t.Fatalf("未生成当日备份文件 %s: %v", todayBackup, err)
	}

	backupDB, err := sql.Open("sqlite", todayBackup)
	if err != nil {
		t.Fatalf("打开备份库失败: %v", err)
	}
	t.Cleanup(func() { _ = backupDB.Close() })

	var weight float64
	if err := backupDB.QueryRow(`SELECT weight_am FROM health_records WHERE record_date = '2026-11-20'`).Scan(&weight); err != nil {
		t.Fatalf("从备份库读取记录失败: %v", err)
	}
	if weight != 72.5 {
		t.Fatalf("备份库数据不一致，预期 72.5，实际 %v", weight)
	}
}

func TestPruneOldBackupsKeeps14DailyAnd4Weekly(t *testing.T) {
	dir := t.TempDir()
	now := time.Date(2026, 11, 21, 9, 0, 0, 0, time.Local)
	todayMidnight := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	// 创建过去 60 天的每日假备份文件 + 一个无关文件
	for d := 0; d < 60; d++ {
		name := fmt.Sprintf("health_backup_%s.db", todayMidnight.AddDate(0, 0, -d).Format("20060102"))
		if err := os.WriteFile(filepath.Join(dir, name), []byte("stub"), 0644); err != nil {
			t.Fatalf("写入测试备份文件失败: %v", err)
		}
	}
	unrelated := filepath.Join(dir, "manual_note.txt")
	if err := os.WriteFile(unrelated, []byte("keep"), 0644); err != nil {
		t.Fatalf("写入无关文件失败: %v", err)
	}

	pruneOldBackups(dir, now)

	// 验证无关文件未被误删
	if _, err := os.Stat(unrelated); err != nil {
		t.Fatalf("无关文件不应被清理: %v", err)
	}

	// 验证近 14 天 (d = 0..13) 全部保留
	for d := 0; d < 14; d++ {
		name := fmt.Sprintf("health_backup_%s.db", todayMidnight.AddDate(0, 0, -d).Format("20060102"))
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Fatalf("近 14 天日备 %s 应保留: %v", name, err)
		}
	}

	// 验证超过 42 天 (d = 42..59) 全部删除
	for d := 42; d < 60; d++ {
		name := fmt.Sprintf("health_backup_%s.db", todayMidnight.AddDate(0, 0, -d).Format("20060102"))
		if _, err := os.Stat(filepath.Join(dir, name)); !os.IsNotExist(err) {
			t.Fatalf("超过 42 天旧备份 %s 应已被清理", name)
		}
	}

	// 验证 14..41 天区间每个 ISO 周最多保留 1 份
	entries, err := os.ReadDir(dir)
	if err != nil {
		t.Fatalf("读取备份目录失败: %v", err)
	}
	weekCount := make(map[string]int)
	for _, entry := range entries {
		m := backupFilenamePattern.FindStringSubmatch(entry.Name())
		if len(m) != 2 {
			continue
		}
		dt, _ := time.ParseInLocation("20060102", m[1], now.Location())
		dayDiff := int(todayMidnight.Sub(dt).Hours() / 24)
		if dayDiff >= 14 && dayDiff < 42 {
			y, w := dt.ISOWeek()
			key := fmt.Sprintf("%04d-W%02d", y, w)
			weekCount[key]++
			if weekCount[key] > 1 {
				t.Fatalf("周备 %s 在同一周保留了多份: %d", key, weekCount[key])
			}
		}
	}
	if len(weekCount) == 0 {
		t.Fatal("第 15~42 天区间应至少保留周备快照")
	}
}
