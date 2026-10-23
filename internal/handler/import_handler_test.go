package handler

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
)

func newTestImportHandler(t *testing.T) (*ImportHandler, *repository.RecordRepository) {
	t.Helper()
	dir := t.TempDir()
	mgr, err := repository.InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	recordRepo := repository.NewRecordRepository(mgr.DB)
	importRepo := repository.NewImportRepository(mgr.DB)
	return NewImportHandler(service.NewImportService(recordRepo, importRepo, nil)), recordRepo
}

func previewCSV(t *testing.T, h *ImportHandler, content string) service.ImportPreview {
	t.Helper()
	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)
	fw, err := w.CreateFormFile("file", "test.csv")
	if err != nil {
		t.Fatalf("构造上传内容失败: %v", err)
	}
	if _, err := fw.Write([]byte(content)); err != nil {
		t.Fatalf("写入上传内容失败: %v", err)
	}
	if err := w.Close(); err != nil {
		t.Fatalf("关闭 multipart 失败: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/import/preview", body)
	req.Header.Set("Content-Type", w.FormDataContentType())
	rec := httptest.NewRecorder()
	h.Preview(rec, req)

	var resp struct {
		Code int                   `json:"code"`
		Data service.ImportPreview `json:"data"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("解析响应失败: %v，原文 %s", err, rec.Body.String())
	}
	if resp.Code != model.CodeSuccess {
		t.Fatalf("预检接口返回错误: %s", rec.Body.String())
	}
	return resp.Data
}

func TestPreviewCSVCountsInsertAndUpdate(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	weight := 76.0
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-10-01", WeightAM: &weight,
	}, "GREEN", ""); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	content := "记录日期,晨起空腹体重(kg),腰围(cm)\n" +
		"2026-10-01,76.9,78\n" +
		"2026-10-02,77.1,\n"

	got := previewCSV(t, h, content)
	if got.Fatal != "" {
		t.Fatalf("不应整体失败: %s", got.Fatal)
	}
	if got.TotalRows != 2 || got.ValidRows != 2 {
		t.Fatalf("行数统计错误: %+v", got)
	}
	if got.Inserted != 1 || got.Updated != 1 {
		t.Fatalf("新增/更新统计错误: 新增 %d 更新 %d", got.Inserted, got.Updated)
	}
	if !got.CanConfirm || got.RequiresFix {
		t.Fatal("无错误时应允许确认")
	}
	if got.Token == "" || got.ExpiresAt == nil {
		t.Fatal("应返回确认令牌与过期时间")
	}
	if len(got.RowDiffs) != 2 {
		t.Fatalf("应返回 2 行变更摘要，实际 %d", len(got.RowDiffs))
	}
	foundWeightChange := false
	for _, d := range got.RowDiffs {
		if d.Date == "2026-10-01" {
			for _, c := range d.Changes {
				if c.Field == "weight_am" && c.Old == "76" && c.New == "76.9" {
					foundWeightChange = true
				}
			}
		}
	}
	if !foundWeightChange {
		t.Fatalf("更新行应给出「旧值 → 新值」: %+v", got.RowDiffs)
	}
}

func TestPreviewCSVBlocksOnError(t *testing.T) {
	h, _ := newTestImportHandler(t)

	content := "记录日期,晨起空腹体重(kg)\n" +
		"2026-10-01,76.9\n" +
		"2026-13-01,77\n"

	got := previewCSV(t, h, content)
	if got.Errors == 0 || !got.RequiresFix || got.CanConfirm {
		t.Fatalf("存在错误行时应阻断确认: %+v", got)
	}
	if len(got.Issues) == 0 {
		t.Fatal("应返回行级问题用于定位")
	}
	foundLine := false
	for _, issue := range got.Issues {
		if issue.Line == 3 && issue.Level == "error" {
			foundLine = true
		}
	}
	if !foundLine {
		t.Fatalf("错误应定位到第 3 行: %+v", got.Issues)
	}
}

func TestPreviewMemoJSONBody(t *testing.T) {
	h, _ := newTestImportHandler(t)

	body, _ := json.Marshal(map[string]any{
		"memo":      "10.2：晨起体重 76.9，腰围 78\n10.3：1-810（睡的还行但不足）",
		"year_base": 2026,
	})
	req := httptest.NewRequest(http.MethodPost, "/api/v1/import/preview", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	h.Preview(rec, req)

	var resp struct {
		Data service.ImportPreview `json:"data"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("解析响应失败: %v", err)
	}
	if resp.Data.Fatal != "" {
		t.Fatalf("备忘录不应整体失败: %s", resp.Data.Fatal)
	}
	if resp.Data.SourceType != "memo" || resp.Data.TotalRows != 2 {
		t.Fatalf("备忘录统计错误: %+v", resp.Data)
	}
	if resp.Data.Inserted != 2 || !resp.Data.CanConfirm {
		t.Fatalf("备忘录应可确认: %+v", resp.Data)
	}
}

func TestPreviewRejectsOversizeFile(t *testing.T) {
	h, _ := newTestImportHandler(t)

	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)
	fw, _ := w.CreateFormFile("file", "big.csv")
	_, _ = fw.Write(bytes.Repeat([]byte("a"), (5<<20)+10))
	_ = w.Close()

	req := httptest.NewRequest(http.MethodPost, "/api/v1/import/preview", body)
	req.Header.Set("Content-Type", w.FormDataContentType())
	rec := httptest.NewRecorder()
	h.Preview(rec, req)

	var resp struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &resp)
	if resp.Code == model.CodeSuccess {
		t.Fatal("超过 5 MB 应被拒绝")
	}
}

// confirmImport 调用确认接口，返回 HTTP 状态码、提示语与业务数据。
func confirmImport(t *testing.T, h *ImportHandler, token, mode string, skipErrors bool) (int, string, service.ImportConfirmResult) {
	t.Helper()
	payload, _ := json.Marshal(map[string]any{
		"token":         token,
		"conflict_mode": mode,
		"skip_errors":   skipErrors,
	})
	req := httptest.NewRequest(http.MethodPost, "/api/v1/import/confirm", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	h.Confirm(rec, req)

	var resp struct {
		Code    int                         `json:"code"`
		Message string                      `json:"message"`
		Data    service.ImportConfirmResult `json:"data"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("解析确认响应失败: %v，原文 %s", err, rec.Body.String())
	}
	return rec.Code, resp.Message, resp.Data
}

func TestConfirmMergeWritesAtomically(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	weightAM, weightPM := 76.0, 80.0
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-10-01", WeightAM: &weightAM, WeightPM: &weightPM,
	}, "GREEN", `["cardio"]`); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	content := "记录日期,晨起空腹体重(kg),腰围(cm)\n" +
		"2026-10-01,76.9,78\n" +
		"2026-10-02,77.1,80\n"
	preview := previewCSV(t, h, content)
	if !preview.CanConfirm {
		t.Fatalf("预检应可确认: %+v", preview)
	}

	status, msg, result := confirmImport(t, h, preview.Token, model.ImportConflictMerge, false)
	if status != http.StatusOK {
		t.Fatalf("确认接口失败: %d %s", status, msg)
	}
	if result.Status != model.ImportStatusSuccess || result.Inserted != 1 || result.Updated != 1 {
		t.Fatalf("写入统计错误: %+v", result)
	}

	merged, err := recordRepo.GetByDate(1, "2026-10-01")
	if err != nil || merged == nil {
		t.Fatalf("合并后应存在记录: %v", err)
	}
	if merged.WeightAM == nil || *merged.WeightAM != 76.9 {
		t.Fatalf("晨重应更新为 76.9: %+v", merged.WeightAM)
	}
	if merged.WeightPM == nil || *merged.WeightPM != 80 {
		t.Fatal("merge 模式下未提供的睡前体重应保留旧值")
	}
	if merged.ActivityTags != `["cardio"]` {
		t.Fatalf("merge 模式下未提供的运动标签应保留旧值: %q", merged.ActivityTags)
	}

	inserted, err := recordRepo.GetByDate(1, "2026-10-02")
	if err != nil || inserted == nil || inserted.WeightAM == nil || *inserted.WeightAM != 77.1 {
		t.Fatalf("新增行未正确写入: %+v %v", inserted, err)
	}

	// 令牌一次性使用：重复确认应被拒绝，避免重复写入。
	if code, _, _ := confirmImport(t, h, preview.Token, model.ImportConflictMerge, false); code != http.StatusConflict {
		t.Fatalf("重复确认应返回 409，实际 %d", code)
	}
}

func TestConfirmRejectsErrorRowsWithoutSkip(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	content := "记录日期,晨起空腹体重(kg)\n" +
		"2026-10-01,76.9\n" +
		"2026-13-01,77\n"
	preview := previewCSV(t, h, content)

	status, msg, _ := confirmImport(t, h, preview.Token, model.ImportConflictMerge, false)
	if status != http.StatusBadRequest {
		t.Fatalf("存在错误行时应返回 400，实际 %d %s", status, msg)
	}
	if rec, _ := recordRepo.GetByDate(1, "2026-10-01"); rec != nil {
		t.Fatal("被拒绝时不得写入任何数据")
	}
}

func TestConfirmSkipErrorsWritesPartial(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	content := "记录日期,晨起空腹体重(kg)\n" +
		"2026-10-01,76.9\n" +
		"2026-13-01,77\n"
	preview := previewCSV(t, h, content)

	status, msg, result := confirmImport(t, h, preview.Token, model.ImportConflictMerge, true)
	if status != http.StatusOK {
		t.Fatalf("跳过错误行后应成功: %d %s", status, msg)
	}
	if result.Status != model.ImportStatusPartial || result.Inserted != 1 || result.Skipped != 1 {
		t.Fatalf("部分写入统计错误: %+v", result)
	}
	if rec, _ := recordRepo.GetByDate(1, "2026-10-01"); rec == nil || rec.WeightAM == nil || *rec.WeightAM != 76.9 {
		t.Fatal("有效行应写入")
	}
}

func TestConfirmOverwriteClearsMissingFields(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	weightAM, weightPM := 76.0, 80.0
	journal := "旧日记"
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-10-01", WeightAM: &weightAM, WeightPM: &weightPM, JournalText: &journal,
	}, "GREEN", `["cardio"]`); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	content := "记录日期,晨起空腹体重(kg)\n2026-10-01,76.9\n"
	preview := previewCSV(t, h, content)
	if _, msg, result := confirmImport(t, h, preview.Token, model.ImportConflictOverwrite, false); result.Status != model.ImportStatusSuccess {
		t.Fatalf("覆盖写入应成功: %s %+v", msg, result)
	}

	rec, err := recordRepo.GetByDate(1, "2026-10-01")
	if err != nil || rec == nil {
		t.Fatalf("覆盖后应存在记录: %v", err)
	}
	if rec.WeightAM == nil || *rec.WeightAM != 76.9 {
		t.Fatalf("晨重应更新: %+v", rec.WeightAM)
	}
	if rec.WeightPM != nil || rec.JournalText != "" || rec.ActivityTags != "" {
		t.Fatalf("overwrite 应清空未提供的字段: 睡前体重 %v 日记 %q 标签 %q", rec.WeightPM, rec.JournalText, rec.ActivityTags)
	}
}

func TestConfirmExplicitClearMarker(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	weightAM := 76.0
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-10-01", WeightAM: &weightAM,
	}, "GREEN", ""); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	content := "记录日期,晨起空腹体重(kg)\n2026-10-01,-\n"
	preview := previewCSV(t, h, content)
	if _, msg, result := confirmImport(t, h, preview.Token, model.ImportConflictMerge, false); result.Status != model.ImportStatusSuccess {
		t.Fatalf("显式清空应成功: %s %+v", msg, result)
	}

	rec, _ := recordRepo.GetByDate(1, "2026-10-01")
	if rec == nil || rec.WeightAM != nil {
		t.Fatalf("`-` 应清空晨重: %+v", rec)
	}
}

func TestConfirmRecomputesSleepTag(t *testing.T) {
	h, recordRepo := newTestImportHandler(t)

	weightAM := 76.0
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-10-01", WeightAM: &weightAM,
	}, "GREEN", ""); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	content := "记录日期,就寝时间,起床时间\n2026-10-01,01:00,08:00\n"
	preview := previewCSV(t, h, content)
	if _, msg, result := confirmImport(t, h, preview.Token, model.ImportConflictMerge, false); result.Status != model.ImportStatusSuccess {
		t.Fatalf("导入睡眠时间应成功: %s %+v", msg, result)
	}

	rec, _ := recordRepo.GetByDate(1, "2026-10-01")
	if rec == nil || rec.SleepHours == nil || *rec.SleepHours != 7 {
		t.Fatalf("应由起止时间补算睡眠时长: %+v", rec)
	}
	if rec.SleepTag != "RED" {
		t.Fatalf("01:00 就寝按默认阈值应为 RED，实际 %s", rec.SleepTag)
	}
}
