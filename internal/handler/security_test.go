package handler

import (
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

func TestSetupSSELoopbackOriginWhitelist(t *testing.T) {
	h := &AIHandler{}

	cases := []struct {
		name       string
		origin     string
		wantOrigin string
	}{
		{name: "no origin", origin: "", wantOrigin: ""},
		{name: "localhost port", origin: "http://localhost:5173", wantOrigin: "http://localhost:5173"},
		{name: "ipv4 loopback", origin: "http://127.0.0.1:8080", wantOrigin: "http://127.0.0.1:8080"},
		{name: "ipv6 loopback", origin: "http://[::1]:8080", wantOrigin: "http://[::1]:8080"},
		{name: "evil external origin", origin: "https://evil.example.com", wantOrigin: ""},
		{name: "localhost prefix spoof", origin: "https://localhost.evil.com", wantOrigin: ""},
		{name: "non-http scheme", origin: "file://localhost", wantOrigin: ""},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/api/v1/insights/stream", nil)
			if tc.origin != "" {
				req.Header.Set("Origin", tc.origin)
			}
			rec := httptest.NewRecorder()
			_, ok := h.setupSSE(rec, req)
			if !ok {
				t.Fatal("httptest.ResponseRecorder 应支持 http.Flusher")
			}
			got := rec.Header().Get("Access-Control-Allow-Origin")
			if got != tc.wantOrigin {
				t.Fatalf("Origin=%q 时 Access-Control-Allow-Origin 预期 %q，实际 %q", tc.origin, tc.wantOrigin, got)
			}
		})
	}
}

func TestHandlersEnforceMaxBytesReader(t *testing.T) {
	dir := t.TempDir()
	mgr, err := repository.InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	recordRepo := repository.NewRecordRepository(mgr.DB)
	eveningRepo := repository.NewEveningRepository(mgr.DB)
	insightRepo := repository.NewInsightRepository(mgr.DB)
	recordService := service.NewRecordService(recordRepo, config.NewRuntimeStore(&config.Config{}, ""))

	recordHandler := NewRecordHandler(recordService, eveningRepo)
	insightHandler := NewInsightHandler(insightRepo)

	t.Run("SaveRecord rejects body > 256KiB", func(t *testing.T) {
		oversized := `{"record_date":"2026-11-21","journal_text":"` + strings.Repeat("a", (256<<10)+1024) + `"}`
		req := httptest.NewRequest(http.MethodPost, "/api/v1/records", strings.NewReader(oversized))
		rec := httptest.NewRecorder()
		recordHandler.SaveRecord(rec, req)

		var resp model.Response
		if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
			t.Fatalf("解析响应失败: %v", err)
		}
		if resp.Code != model.CodeParamError {
			t.Fatalf("超大请求体应返回 CodeParamError(%d)，实际 %d (%s)", model.CodeParamError, resp.Code, resp.Message)
		}
	})

	t.Run("BatchDelete rejects body > 64KiB", func(t *testing.T) {
		// 构造超过 64KiB 的 JSON 数组
		ids := make([]string, 0, 12000)
		for i := 1; i <= 12000; i++ {
			ids = append(ids, "100000")
		}
		oversized := `{"ids":[` + strings.Join(ids, ",") + `]}`
		req := httptest.NewRequest(http.MethodPost, "/api/v1/insights/batch-delete", strings.NewReader(oversized))
		rec := httptest.NewRecorder()
		insightHandler.BatchDelete(rec, req)

		var resp model.Response
		if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
			t.Fatalf("解析响应失败: %v", err)
		}
		if resp.Code != model.CodeParamError {
			t.Fatalf("超大批量删除请求体应返回 CodeParamError(%d)，实际 %d (%s)", model.CodeParamError, resp.Code, resp.Message)
		}
	})
}
