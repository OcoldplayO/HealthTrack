package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
)

func TestExportJSONV2IncludesSummariesAndExcludesPhotos(t *testing.T) {
	dir := t.TempDir()
	mgr, err := repository.InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	recordRepo := repository.NewRecordRepository(mgr.DB)
	eveningRepo := repository.NewEveningRepository(mgr.DB)

	weight := 76.0
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-10-01", WeightAM: &weight,
	}, "GREEN", ""); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}
	photoID := int64(9)
	if _, err := eveningRepo.Upsert(1, &model.SaveEveningDTO{
		RecordDate: "2026-10-01", DoneItems: []string{"完成 A"}, NoteText: "感想", Score: 7, PhotoID: &photoID,
	}); err != nil {
		t.Fatalf("预置小结失败: %v", err)
	}

	recordService := service.NewRecordService(recordRepo, config.NewRuntimeStore(&config.Config{}, ""))
	h := NewRecordHandler(recordService, nil, eveningRepo)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/export/json", nil)
	rec := httptest.NewRecorder()
	h.ExportJSON(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("导出失败: %d %s", rec.Code, rec.Body.String())
	}

	var backup model.BackupFile
	if err := json.Unmarshal(rec.Body.Bytes(), &backup); err != nil {
		t.Fatalf("备份 JSON 无法解析: %v", err)
	}
	if backup.SchemaVersion != model.BackupSchemaVersion {
		t.Fatalf("schema_version 应为 %d，实际 %d", model.BackupSchemaVersion, backup.SchemaVersion)
	}
	if backup.RecordCount != 1 || backup.SummaryCount != 1 || len(backup.EveningSummaries) != 1 {
		t.Fatalf("备份统计错误: %+v", backup)
	}
	if len(backup.Excluded) != 2 {
		t.Fatalf("应声明排除照片与 AI 洞察: %+v", backup.Excluded)
	}
	if backup.EveningSummaries[0].PhotoID != nil {
		t.Fatal("照片不进入备份，小结的 photo_id 应为空")
	}

	// 导出的备份应可直接回灌预检。
	h2, _, _ := newTestImportHandler(t)
	raw, _ := json.Marshal(backup)
	preview := previewFile(t, h2, "backup.json", string(raw))
	if preview.Fatal != "" || preview.TotalRows != 1 || preview.SummaryRows != 1 || !preview.CanConfirm {
		t.Fatalf("导出的备份应可回灌: %+v", preview)
	}
}
