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
