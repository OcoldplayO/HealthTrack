package service

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
)

func newTestImportService(t *testing.T) (*ImportService, *repository.ImportRepository) {
	t.Helper()
	dir := t.TempDir()
	dbPath := filepath.Join(dir, "health.db")
	mgr, err := repository.InitDB(dbPath, filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	recordRepo := repository.NewRecordRepository(mgr.DB)
	eveningRepo := repository.NewEveningRepository(mgr.DB)
	importRepo := repository.NewImportRepository(mgr.DB)
	cfg := config.NewRuntimeStore(&config.Config{Database: config.DatabaseConfig{Path: dbPath}}, "")
	return NewImportService(recordRepo, eveningRepo, importRepo, cfg), importRepo
}

// seedFailedBatch 模拟一次失败批次：原文件已缓存、状态为 failed。
func seedFailedBatch(t *testing.T, svc *ImportService, repo *repository.ImportRepository, content string) *model.ImportBatch {
	t.Helper()
	cachePath := svc.saveImportCache("csv", []byte(content))
	if cachePath == "" {
		t.Fatal("写入缓存失败")
	}
	b := &model.ImportBatch{
		UserID: 1, SourceType: "csv", FileName: "retry.csv",
		FileHash: shortHash([]byte(content)), FileSize: int64(len(content)),
		TotalRows: 1, ConflictMode: model.ImportConflictMerge,
		Status: model.ImportStatusPending, DetailJSON: "{}", CachePath: cachePath, AttemptNo: 1,
	}
	if err := repo.Create(b); err != nil {
		t.Fatalf("创建批次失败: %v", err)
	}
	b.Status = model.ImportStatusFailed
	b.ErrorMessage = "模拟写入失败"
	if err := repo.UpdateResult(b); err != nil {
		t.Fatalf("更新批次状态失败: %v", err)
	}
	return b
}

func TestPreviewCachesFileAndRemovesOnSuccess(t *testing.T) {
	svc, _ := newTestImportService(t)

	preview, err := svc.Preview(1, ImportPreviewInput{
		FileName: "data.csv",
		Data:     []byte("记录日期,晨起空腹体重(kg)\n2026-10-01,76.9\n"),
	})
	if err != nil {
		t.Fatalf("预检失败: %v", err)
	}
	if !preview.CanConfirm {
		t.Fatalf("预检应可确认: %+v", preview)
	}

	entries, err := os.ReadDir(svc.importCacheDir())
	if err != nil || len(entries) != 1 {
		t.Fatalf("预检应缓存原文件: %v %d", err, len(entries))
	}

	if _, err := svc.Confirm(1, ImportConfirmInput{Token: preview.Token, ConflictMode: model.ImportConflictMerge}); err != nil {
		t.Fatalf("确认失败: %v", err)
	}
	entries, _ = os.ReadDir(svc.importCacheDir())
	if len(entries) != 0 {
		t.Fatalf("全部写入成功后应清理缓存，实际剩余 %d 个", len(entries))
	}
}

func TestRetryReturnsPreviewAndKeepsCache(t *testing.T) {
	svc, repo := newTestImportService(t)
	b := seedFailedBatch(t, svc, repo, "记录日期,晨起空腹体重(kg)\n2026-10-05,77.2\n")

	preview, err := svc.Retry(1, b.ID)
	if err != nil {
		t.Fatalf("重试失败: %v", err)
	}
	if preview.Fatal != "" || !preview.CanConfirm || preview.Token == "" {
		t.Fatalf("重试应回到可确认的预检: %+v", preview)
	}
	if _, err := os.Stat(b.CachePath); err != nil {
		t.Fatal("重试后原文件缓存应继续保留")
	}

	batches, err := svc.ListBatches(1, 10)
	if err != nil || len(batches) != 1 {
		t.Fatalf("批次列表错误: %v %d", err, len(batches))
	}
	if !batches[0].HasCache || !batches[0].Retryable {
		t.Fatalf("失败批次应标记可重试: %+v", batches[0])
	}
}

func TestRetryRejectsNonFailedBatch(t *testing.T) {
	svc, repo := newTestImportService(t)
	success := &model.ImportBatch{
		UserID: 1, SourceType: "csv", Status: model.ImportStatusSuccess,
		ConflictMode: model.ImportConflictMerge, DetailJSON: "{}", AttemptNo: 1,
	}
	if err := repo.Create(success); err != nil {
		t.Fatalf("创建成功批次失败: %v", err)
	}
	if _, err := svc.Retry(1, success.ID); !errors.Is(err, ErrImportBatchNotRetryable) {
		t.Fatalf("成功批次不应可重试: %v", err)
	}
}

func TestRetryReportsExpiredCache(t *testing.T) {
	svc, repo := newTestImportService(t)
	b := seedFailedBatch(t, svc, repo, "记录日期,晨起空腹体重(kg)\n2026-10-05,77.2\n")
	if err := os.Remove(b.CachePath); err != nil {
		t.Fatalf("删除缓存失败: %v", err)
	}
	if _, err := svc.Retry(1, b.ID); !errors.Is(err, ErrImportCacheExpired) {
		t.Fatalf("缓存缺失应提示过期: %v", err)
	}
}

func TestFailedRowsCSVExportsErrorRows(t *testing.T) {
	svc, repo := newTestImportService(t)
	b := seedFailedBatch(t, svc, repo, "记录日期,晨起空腹体重(kg)\n2026-13-01,77\n2026-10-06,78\n")

	filename, data, err := svc.FailedRowsCSV(1, b.ID)
	if err != nil {
		t.Fatalf("导出失败行失败: %v", err)
	}
	if !strings.HasPrefix(filename, "HealthTrack_failed_rows_") {
		t.Fatalf("文件名不符合约定: %s", filename)
	}
	text := string(data)
	if !strings.HasPrefix(text, "\ufeff") {
		t.Fatal("CSV 应带 UTF-8 BOM")
	}
	if !strings.Contains(text, "问题") || !strings.Contains(text, "原始内容") {
		t.Fatalf("应包含问题与原始内容列: %s", text)
	}
	if !strings.Contains(text, "2026-13-01") {
		t.Fatalf("应保留错误行原始内容: %s", text)
	}
	if strings.Contains(text, "2026-10-06") {
		t.Fatalf("不应导出有效行: %s", text)
	}
}

func TestImportTemplateCSV(t *testing.T) {
	data := ImportTemplateCSV()
	if !strings.HasPrefix(string(data), "\ufeff") {
		t.Fatal("模板应带 UTF-8 BOM")
	}
	if !strings.Contains(string(data), "记录日期,晨起空腹体重(kg)") {
		t.Fatalf("模板表头不符: %s", data)
	}

	// 模板本身应能被解析且没有错误。
	parsed := ParseCSV(data)
	if parsed.Fatal != "" || len(parsed.Rows) != 2 {
		t.Fatalf("模板应可直接解析: %+v", parsed)
	}
	for _, row := range parsed.Rows {
		if len(row.Errors) > 0 {
			t.Fatalf("模板示例行不应有错误: %+v", row.Errors)
		}
	}
}
