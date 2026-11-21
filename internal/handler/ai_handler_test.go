package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
)

func newTestAIHandler(t *testing.T, baseURL, apiKey string) (*AIHandler, *repository.RecordRepository, *repository.InsightRepository, *repository.EveningRepository) {
	t.Helper()
	dir := t.TempDir()
	mgr, err := repository.InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	recordRepo := repository.NewRecordRepository(mgr.DB)
	insightRepo := repository.NewInsightRepository(mgr.DB)
	eveningRepo := repository.NewEveningRepository(mgr.DB)

	cfg := config.DefaultConfig()
	cfg.AI.BaseURL = baseURL
	cfg.AI.APIKey = apiKey
	cfg.AI.Model = "test-model"
	cfgPath := filepath.Join(dir, "config.yaml")
	runtimeCfg := config.NewRuntimeStore(cfg, cfgPath)

	recordSvc := service.NewRecordService(recordRepo, runtimeCfg)
	insightSvc := service.NewInsightService(recordRepo)
	compareSvc := service.NewCompareService(recordSvc)

	h := NewAIHandler(runtimeCfg, insightSvc, recordSvc, compareSvc, insightRepo, eveningRepo)
	return h, recordRepo, insightRepo, eveningRepo
}

func sseErrorMessages(t *testing.T, body string) []string {
	t.Helper()
	var errs []string
	for _, line := range strings.Split(body, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		payload := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if payload == "" || payload == "[DONE]" {
			continue
		}
		var obj map[string]any
		if err := json.Unmarshal([]byte(payload), &obj); err != nil {
			t.Fatalf("SSE data 帧不是合法 JSON (%q): %v", payload, err)
		}
		if msg, ok := obj["error"].(string); ok && msg != "" {
			errs = append(errs, msg)
		}
	}
	return errs
}

func TestAIHandlerStreamInsightPersistsCompletedStream(t *testing.T) {
	mockLLM := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v1/chat/completions" {
			http.NotFound(w, r)
			return
		}
		if r.Header.Get("Authorization") != "Bearer sk-test-secret" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, "data: {\"choices\":[{\"delta\":{\"reasoning_content\":\"先检查体重差\"}}]}\n\n")
		fmt.Fprint(w, "data: {\"choices\":[{\"delta\":{\"content\":\"体重平稳\"}}]}\n\n")
		fmt.Fprint(w, "data: {\"choices\":[{\"delta\":{\"content\":\"下降。\"}}]}\n\n")
		fmt.Fprint(w, "data: [DONE]\n\n")
	}))
	defer mockLLM.Close()

	h, recordRepo, insightRepo, _ := newTestAIHandler(t, mockLLM.URL+"/v1", "sk-test-secret")
	today := time.Now().UTC().Format("2006-01-02")
	wAM := 72.1
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: today,
		WeightAM:   &wAM,
	}, "GREEN", ""); err != nil {
		t.Fatalf("预置记录失败: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/insights/stream?days=7&end_date=%s&tz_offset=0", today), nil)
	rec := httptest.NewRecorder()
	h.StreamInsight(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("StreamInsight 状态码异常: %d", rec.Code)
	}
	if errs := sseErrorMessages(t, rec.Body.String()); len(errs) > 0 {
		t.Fatalf("StreamInsight 不应输出错误帧: %v", errs)
	}
	if !strings.Contains(rec.Body.String(), "体重平稳") || !strings.Contains(rec.Body.String(), "先检查体重差") {
		t.Fatalf("StreamInsight 未转发完整 SSE 内容:\n%s", rec.Body.String())
	}

	startDate := time.Now().UTC().AddDate(0, 0, -6).Format("2006-01-02")
	saved, err := insightRepo.GetByPeriod(1, "health", 7, startDate, today)
	if err != nil {
		t.Fatalf("查询落库洞察失败: %v", err)
	}
	if saved == nil || saved.Content != "体重平稳下降。" || saved.Thinking != "先检查体重差" || saved.Model != "test-model" {
		t.Fatalf("持久化洞察内容异常: %+v", saved)
	}
}

func TestAIHandlerStreamInsightErrorCasesDoNotPersist(t *testing.T) {
	mockFailLLM := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, `{"error":"rate limit"}`, http.StatusTooManyRequests)
	}))
	defer mockFailLLM.Close()

	today := time.Now().UTC().Format("2006-01-02")
	wAM := 71.8

	t.Run("invalid end_date", func(t *testing.T) {
		h, _, insightRepo, _ := newTestAIHandler(t, mockFailLLM.URL, "sk-test")
		req := httptest.NewRequest(http.MethodGet, "/api/v1/insights/stream?days=7&end_date=bad-date&tz_offset=0", nil)
		rec := httptest.NewRecorder()
		h.StreamInsight(rec, req)

		errs := sseErrorMessages(t, rec.Body.String())
		if len(errs) != 1 || !strings.Contains(errs[0], "截止日参数非法") {
			t.Fatalf("非法日期应返回 JSON SSE 错误帧，实际 %v", errs)
		}
		items, _, _ := insightRepo.List(1, "health", 10, 0, 0, "")
		if len(items) != 0 {
			t.Fatalf("错误请求不应落库: %+v", items)
		}
	})

	t.Run("no records in window", func(t *testing.T) {
		h, _, insightRepo, _ := newTestAIHandler(t, mockFailLLM.URL, "sk-test")
		req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/insights/stream?days=7&end_date=%s&tz_offset=0", today), nil)
		rec := httptest.NewRecorder()
		h.StreamInsight(rec, req)

		errs := sseErrorMessages(t, rec.Body.String())
		if len(errs) != 1 || !strings.Contains(errs[0], "暂未检索到健康数据") {
			t.Fatalf("无数据时应返回 JSON SSE 错误帧，实际 %v", errs)
		}
		items, _, _ := insightRepo.List(1, "health", 10, 0, 0, "")
		if len(items) != 0 {
			t.Fatalf("无数据错误不应落库: %+v", items)
		}
	})

	t.Run("missing API key", func(t *testing.T) {
		h, recordRepo, insightRepo, _ := newTestAIHandler(t, mockFailLLM.URL, "")
		_, _ = recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{RecordDate: today, WeightAM: &wAM}, "GREEN", "")
		req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/insights/stream?days=7&end_date=%s&tz_offset=0", today), nil)
		rec := httptest.NewRecorder()
		h.StreamInsight(rec, req)

		errs := sseErrorMessages(t, rec.Body.String())
		if len(errs) != 1 || !strings.Contains(errs[0], "API Key") {
			t.Fatalf("缺失 API Key 应返回 JSON SSE 错误帧，实际 %v", errs)
		}
		items, _, _ := insightRepo.List(1, "health", 10, 0, 0, "")
		if len(items) != 0 {
			t.Fatalf("未配置 API Key 不应落库: %+v", items)
		}
	})

	t.Run("upstream HTTP 429", func(t *testing.T) {
		h, recordRepo, insightRepo, _ := newTestAIHandler(t, mockFailLLM.URL, "sk-test")
		_, _ = recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{RecordDate: today, WeightAM: &wAM}, "GREEN", "")
		req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/insights/stream?days=7&end_date=%s&tz_offset=0", today), nil)
		rec := httptest.NewRecorder()
		h.StreamInsight(rec, req)

		errs := sseErrorMessages(t, rec.Body.String())
		if len(errs) != 1 || !strings.Contains(errs[0], "429") {
			t.Fatalf("上游失败应返回包含状态码的 JSON SSE 错误帧，实际 %v", errs)
		}
		items, _, _ := insightRepo.List(1, "health", 10, 0, 0, "")
		if len(items) != 0 {
			t.Fatalf("上游失败不应落库: %+v", items)
		}
	})
}

func TestAIHandlerStreamEveningInsightPersistsAndReplacesSameDate(t *testing.T) {
	replyText := "第一次小结回应"
	mockLLM := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":%q}}]}\n\n", replyText)
		fmt.Fprint(w, "data: [DONE]\n\n")
	}))
	defer mockLLM.Close()

	h, _, insightRepo, eveningRepo := newTestAIHandler(t, mockLLM.URL, "sk-test")
	today := time.Now().UTC().Format("2006-01-02")
	if _, err := eveningRepo.Upsert(1, &model.SaveEveningDTO{
		RecordDate: today,
		DoneItems:  []string{"完成单元测试"},
		NoteText:   "节奏稳定",
		Score:      8,
	}); err != nil {
		t.Fatalf("预置睡前小结失败: %v", err)
	}

	req1 := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/evening/insight/stream?date=%s&days=7&tz_offset=0", today), nil)
	rec1 := httptest.NewRecorder()
	h.StreamEveningInsight(rec1, req1)

	saved1, err := insightRepo.GetByDateScope(1, "evening", today)
	if err != nil || saved1 == nil || saved1.Content != "第一次小结回应" {
		t.Fatalf("首次睡前小结洞察落库异常: rec=%+v err=%v", saved1, err)
	}

	// 同日第二次生成应覆盖旧记录（仅保留最新 1 条）
	replyText = "第二次小结回应"
	req2 := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/evening/insight/stream?date=%s&days=30&tz_offset=0", today), nil)
	rec2 := httptest.NewRecorder()
	h.StreamEveningInsight(rec2, req2)

	saved2, err := insightRepo.GetByDateScope(1, "evening", today)
	if err != nil || saved2 == nil || saved2.Content != "第二次小结回应" || saved2.RangeDays != 30 {
		t.Fatalf("二次睡前小结洞察应更新为最新内容: rec=%+v err=%v", saved2, err)
	}
	items, _, _ := insightRepo.List(1, "evening", 10, 0, 0, "")
	if len(items) != 1 {
		t.Fatalf("同一天应只保留最新 1 条小结洞察，实际 %d 条", len(items))
	}
}

func TestAIHandlerComparePeriodAndStreamCompare(t *testing.T) {
	mockLLM := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, "data: {\"choices\":[{\"delta\":{\"reasoning_content\":\"对比两月体重\"}}]}\n\n")
		fmt.Fprint(w, "data: {\"choices\":[{\"delta\":{\"content\":\"本月较上月体重稳步下降。\"}}]}\n\n")
		fmt.Fprint(w, "data: [DONE]\n\n")
	}))
	defer mockLLM.Close()

	h, recordRepo, _, _ := newTestAIHandler(t, mockLLM.URL, "sk-test")

	now := time.Now().UTC()
	firstOfThisMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
	monthA := firstOfThisMonth.AddDate(0, -1, 0).Format("2006-01")
	monthB := firstOfThisMonth.AddDate(0, -2, 0).Format("2006-01")

	wA := 71.2
	wB := 73.0
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{RecordDate: monthA + "-10", WeightAM: &wA}, "GREEN", ""); err != nil {
		t.Fatalf("预置 monthA 记录失败: %v", err)
	}
	if _, err := recordRepo.SaveOrMerge(1, &model.SaveRecordDTO{RecordDate: monthB + "-10", WeightAM: &wB}, "YELLOW", ""); err != nil {
		t.Fatalf("预置 monthB 记录失败: %v", err)
	}

	// 生成前：ComparePeriod 返回 exists=false 与两月指标快照
	probeReq := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/insights/compare/period?month_a=%s&month_b=%s&tz_offset=0", monthA, monthB), nil)
	probeRec := httptest.NewRecorder()
	h.ComparePeriod(probeRec, probeReq)

	var beforeResp struct {
		Code int `json:"code"`
		Data struct {
			Exists   bool                  `json:"exists"`
			MetricsA *model.CompareMetrics `json:"metrics_a"`
			MetricsB *model.CompareMetrics `json:"metrics_b"`
		} `json:"data"`
	}
	if err := json.Unmarshal(probeRec.Body.Bytes(), &beforeResp); err != nil {
		t.Fatalf("解析 ComparePeriod 失败: %v", err)
	}
	if beforeResp.Code != 200 || beforeResp.Data.Exists {
		t.Fatalf("生成前 exists 应为 false: %+v", beforeResp)
	}
	if beforeResp.Data.MetricsA == nil || beforeResp.Data.MetricsA.RecordDays != 1 || beforeResp.Data.MetricsB == nil || beforeResp.Data.MetricsB.RecordDays != 1 {
		t.Fatalf("阶段对比指标快照异常: A=%+v B=%+v", beforeResp.Data.MetricsA, beforeResp.Data.MetricsB)
	}

	// 流式生成并存档
	streamReq := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/insights/compare/stream?month_a=%s&month_b=%s&tz_offset=0", monthA, monthB), nil)
	streamRec := httptest.NewRecorder()
	h.StreamCompare(streamRec, streamReq)
	if errs := sseErrorMessages(t, streamRec.Body.String()); len(errs) > 0 {
		t.Fatalf("StreamCompare 不应输出错误帧: %v", errs)
	}

	// 再次探测：ComparePeriod 应返回 exists=true 且含完整正文与思维链
	probeRec2 := httptest.NewRecorder()
	h.ComparePeriod(probeRec2, probeReq)
	var afterResp struct {
		Code int `json:"code"`
		Data struct {
			Exists  bool             `json:"exists"`
			Insight *model.AIInsight `json:"insight"`
		} `json:"data"`
	}
	if err := json.Unmarshal(probeRec2.Body.Bytes(), &afterResp); err != nil {
		t.Fatalf("解析第二次 ComparePeriod 失败: %v", err)
	}
	if !afterResp.Data.Exists || afterResp.Data.Insight == nil || afterResp.Data.Insight.Content != "本月较上月体重稳步下降。" || afterResp.Data.Insight.Thinking != "对比两月体重" {
		t.Fatalf("生成后 ComparePeriod 回显异常: %+v", afterResp)
	}
}
