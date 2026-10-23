package repository

import (
	"path/filepath"
	"testing"

	"healthtrack/internal/model"
)

func newTestImportRepo(t *testing.T) (*ImportRepository, *DBManager) {
	t.Helper()
	dir := t.TempDir()
	mgr, err := InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })
	return NewImportRepository(mgr.DB), mgr
}

func TestImportBatchLifecycle(t *testing.T) {
	repo, _ := newTestImportRepo(t)

	b := &model.ImportBatch{
		UserID:       1,
		SourceType:   "csv",
		FileName:     "HealthTrack_export_all_20261022.csv",
		FileHash:     "abc123",
		FileSize:     12697,
		TotalRows:    46,
		ConflictMode: "merge",
		Status:       model.ImportStatusPending,
		AttemptNo:    1,
		DetailJSON:   "{}",
	}
	if err := repo.Create(b); err != nil {
		t.Fatalf("创建批次失败: %v", err)
	}
	if b.ID == 0 {
		t.Fatal("期望回填自增 ID")
	}

	got, err := repo.GetByID(1, b.ID)
	if err != nil {
		t.Fatalf("查询批次失败: %v", err)
	}
	if got == nil || got.FileHash != "abc123" || got.Status != model.ImportStatusPending {
		t.Fatalf("批次字段不符: %+v", got)
	}

	b.Inserted = 12
	b.Updated = 28
	b.Skipped = 2
	b.Warnings = 4
	b.Errors = 2
	b.Status = model.ImportStatusPartial
	b.ErrorMessage = ""
	if err := repo.UpdateResult(b); err != nil {
		t.Fatalf("更新批次结果失败: %v", err)
	}

	got, _ = repo.GetByID(1, b.ID)
	if got.Status != model.ImportStatusPartial || got.Inserted != 12 || got.Updated != 28 || got.Skipped != 2 {
		t.Fatalf("结果统计未落库: %+v", got)
	}
	if got.FinishedAt == nil {
		t.Fatal("期望写入完成时间")
	}

	// 同一批次不允许被重复更新，避免重试覆盖历史。
	if err := repo.UpdateResult(b); err == nil {
		t.Fatal("已结束的批次不应再次更新")
	}

	latest, err := repo.FindLatestByHash(1, "abc123")
	if err != nil || latest == nil || latest.ID != b.ID {
		t.Fatalf("按哈希查询最近批次失败: %v %+v", err, latest)
	}
}

func TestMarkPendingInterrupted(t *testing.T) {
	repo, _ := newTestImportRepo(t)

	done := &model.ImportBatch{UserID: 1, SourceType: "csv", FileHash: "done", Status: model.ImportStatusPending, ConflictMode: "merge", DetailJSON: "{}"}
	if err := repo.Create(done); err != nil {
		t.Fatalf("创建批次失败: %v", err)
	}
	done.Status = model.ImportStatusSuccess
	if err := repo.UpdateResult(done); err != nil {
		t.Fatalf("更新批次失败: %v", err)
	}

	pending := &model.ImportBatch{UserID: 1, SourceType: "csv", FileHash: "pending", Status: model.ImportStatusPending, ConflictMode: "merge", DetailJSON: "{}"}
	if err := repo.Create(pending); err != nil {
		t.Fatalf("创建批次失败: %v", err)
	}

	n, err := repo.MarkPendingInterrupted(1)
	if err != nil {
		t.Fatalf("标记中断失败: %v", err)
	}
	if n != 1 {
		t.Fatalf("期望标记 1 条，实际 %d", n)
	}

	got, _ := repo.GetByID(1, pending.ID)
	if got.Status != model.ImportStatusInterrupted {
		t.Fatalf("期望 interrupted，实际 %s", got.Status)
	}
	finished, _ := repo.GetByID(1, done.ID)
	if finished.Status != model.ImportStatusSuccess {
		t.Fatalf("已结束批次不应被改动，实际 %s", finished.Status)
	}
}

func TestListImportBatches(t *testing.T) {
	repo, _ := newTestImportRepo(t)

	for i := 0; i < 3; i++ {
		b := &model.ImportBatch{UserID: 1, SourceType: "memo", Status: model.ImportStatusPending, ConflictMode: "merge", DetailJSON: "{}"}
		if err := repo.Create(b); err != nil {
			t.Fatalf("创建批次失败: %v", err)
		}
	}

	list, err := repo.List(1, 2)
	if err != nil {
		t.Fatalf("查询列表失败: %v", err)
	}
	if len(list) != 2 {
		t.Fatalf("期望 2 条，实际 %d", len(list))
	}
	if list[0].ID <= list[1].ID {
		t.Fatal("期望按 ID 倒序返回")
	}
}
