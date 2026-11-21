package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
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
	h := NewRecordHandler(recordService, eveningRepo)

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

func TestExportCSVIncludesExtendedColumnsAndSanitizesFormulas(t *testing.T) {
	dir := t.TempDir()
	mgr, err := repository.InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	recordRepo := repository.NewRecordRepository(mgr.DB)
	eveningRepo := repository.NewEveningRepository(mgr.DB)

	weight := 71.5
	steps := 9200
	light := true
	journal := "=CMD('calc')"
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate:   "2026-11-20",
		WeightAM:     &weight,
		JournalText:  &journal,
		Steps:        &steps,
		MorningLight: &light,
		Exercise: &model.ExerciseDetail{
			Types:     []string{"cardio", "strength"},
			Duration:  50,
			Intensity: "failure",
		},
		Lunch: &model.LunchDetail{
			Eaten:    "eaten",
			Protein:  []string{"chicken"},
			ProteinG: 25,
			Staple:   "rice",
			CarbG:    "20_35",
			Cooking:  "steam",
		},
	}, "GREEN", ""); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	recordService := service.NewRecordService(recordRepo, config.NewRuntimeStore(&config.Config{}, ""))
	h := NewRecordHandler(recordService, eveningRepo)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/export?tz_offset=480", nil)
	rec := httptest.NewRecorder()
	h.ExportCSV(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("CSV 导出失败: %d", rec.Code)
	}
	body := rec.Body.Bytes()
	if !bytes.HasPrefix(body, []byte{0xEF, 0xBB, 0xBF}) {
		t.Fatal("CSV 导出缺少 UTF-8 BOM")
	}
	csvText := string(body)
	for _, want := range []string{
		"运动类型", "冷水澡", "专注达", "晨光", "步数", "午餐",
		"'=CMD('calc')", "cardio+strength", "9200", "鸡胸·约25g蛋白·白米饭·碳水20-35g·蒸煮",
	} {
		if !strings.Contains(csvText, want) {
			t.Fatalf("导出的 CSV 缺少期望内容 %q:\n%s", want, csvText)
		}
	}

	// 验证追加列后的 CSV 依然能够通过 ImportHandler 预检导回
	h2, _, _ := newTestImportHandler(t)
	preview := previewFile(t, h2, "export.csv", csvText)
	if preview.Fatal != "" || preview.TotalRows != 1 || !preview.CanConfirm {
		t.Fatalf("导出的 CSV 应可被预检导回: %+v", preview)
	}
}
