package handler

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
)

type AIHandler struct {
	configs     *config.RuntimeStore
	insight     *service.InsightService
	repoSvc     *service.RecordService
	insightRepo *repository.InsightRepository
	eveningRepo *repository.EveningRepository
}

func NewAIHandler(configs *config.RuntimeStore, insight *service.InsightService, repoSvc *service.RecordService, insightRepo *repository.InsightRepository, eveningRepo *repository.EveningRepository) *AIHandler {
	return &AIHandler{configs: configs, insight: insight, repoSvc: repoSvc, insightRepo: insightRepo, eveningRepo: eveningRepo}
}

// systemInstruction 以 system 角色下发硬性约束。
// 推理模型的思维链（reasoning_content）语言主要由 system 角色决定；同类约束若只写在
// user 消息里（见提示词模板），遵循度不稳定，会出现同一模板时而中文、时而英文思考。
const systemInstruction = "你是严谨的中文健康分析顾问。硬性要求：你的全部思考过程（reasoning_content）与最终回答必须始终使用简体中文，严禁使用英文进行推理、自问自答或中英夹杂。"

// eveningSystemInstruction 睡前小结洞察的 system 硬约束（中文思考 + 角色定位）。
const eveningSystemInstruction = systemInstruction + " 你正在解读用户当晚写下的「睡前小结」，重点是用户的心理状态、成就感与自我评价，生理数据仅作为辅助佐证；语气温和、具体、不评判，多肯定真实的努力，不喊空泛口号。若数据不足以支撑某个结论，须明确说明而不是强行归因。"

// setupSSE 写入标准 SSE 响应头并返回 flusher。
func (h *AIHandler) setupSSE(w http.ResponseWriter) (http.Flusher, bool) {
	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	flusher, ok := w.(http.Flusher)
	return flusher, ok
}

// StreamInsight 生理周期洞察：GET /api/v1/insights/stream?days=7|30|60
func (h *AIHandler) StreamInsight(w http.ResponseWriter, r *http.Request) {
	cfg := h.configs.Snapshot()
	flusher, ok := h.setupSSE(w)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// 解析分析天数 (支持 7、30、60，默认 30 天)
	days := 30
	if daysStr := r.URL.Query().Get("days"); daysStr != "" {
		if d, err := strconv.Atoi(daysStr); err == nil && d > 0 && d <= 60 {
			days = d
		}
	}

	userID := int64(1)
	records, err := h.repoSvc.GetRecentRecords(userID, days)
	if err != nil || len(records) == 0 {
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":\"暂未检索到足够的历史健康数据，请先在【记一笔】中打卡后再生成洞察。\"}}]}\n\n")
		fmt.Fprintf(w, "data: [DONE]\n\n")
		flusher.Flush()
		return
	}

	// 构建预计算特征上下文（同时记录该期数据实际起止日期，用于存档）
	dataContext := h.insight.BuildPromptContext(records)
	startDate := records[0].RecordDate
	endDate := records[len(records)-1].RecordDate

	// 读取提示词模板 prompts/insight_v1.txt。
	// 磁盘读取失败（例如 Android 端 prompts 目录未打包进 APK）时，回退到内嵌的默认模板，避免报“模板文件不存在”。
	promptPath := filepath.Join(config.FindProjectRoot(), "prompts", "insight_v1.txt")
	promptTpl, err := os.ReadFile(promptPath)
	if err != nil {
		promptTpl = []byte(service.DefaultPrompt())
	}

	// 显式声明本次分析周期。数据上下文只反映"实际有记录的区间"，
	// 若不声明请求窗口，模型会把"数据覆盖了多少天"误当成"本次分析的是多少天"。
	windowStart := time.Now().AddDate(0, 0, -(days - 1)).Format("2006-01-02")
	windowEnd := time.Now().Format("2006-01-02")
	windowLine := fmt.Sprintf("【本次分析周期】近 %d 天（请求窗口 %s 至 %s）\n\n", days, windowStart, windowEnd)

	fullUserContent := fmt.Sprintf("%s\n\n%s%s", string(promptTpl), windowLine, dataContext)

	if cfg.AI.APIKey == "" || strings.Contains(cfg.AI.APIKey, "your_api_key") {
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":\"未检测到有效的大模型 API Key，请在 config.yaml 中配置 AI.APIKey。\"}}]}\n\n")
		fmt.Fprintf(w, "data: [DONE]\n\n")
		flusher.Flush()
		return
	}

	h.proxyChat(r.Context(), w, flusher, cfg.AI, systemInstruction, fullUserContent, func(content, thinking string) {
		saved := &model.AIInsight{
			UserID:    userID,
			Scope:     "health",
			RangeDays: days,
			StartDate: startDate,
			EndDate:   endDate,
			Content:   content,
			Thinking:  thinking,
			Model:     cfg.AI.Model,
		}
		if _, err := h.insightRepo.Insert(saved); err != nil {
			slog.Error("保存 AI 洞察存档失败", "err", err)
		} else {
			slog.Info("AI 洞察已存档", "range_days", days, "start", startDate, "end", endDate)
		}
	})
}

// StreamEveningInsight 睡前小结洞察：GET /api/v1/evening/insight/stream?date=YYYY-MM-DD
func (h *AIHandler) StreamEveningInsight(w http.ResponseWriter, r *http.Request) {
	cfg := h.configs.Snapshot()
	flusher, ok := h.setupSSE(w)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	date := r.URL.Query().Get("date")
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}
	// 关联生理数据的窗口长度：前端可选 7 / 30 天，默认 7 天。
	days := 7
	if ds := r.URL.Query().Get("days"); ds != "" {
		if d, err := strconv.Atoi(ds); err == nil && (d == 7 || d == 30) {
			days = d
		}
	}
	userID := int64(1)

	summary, err := h.eveningRepo.GetByDate(userID, date)
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"读取睡前小结失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}
	if summary == nil {
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":\"这一天还没有写下睡前小结，请先保存小结后再生成洞察。\"}}]}\n\n")
		fmt.Fprintf(w, "data: [DONE]\n\n")
		flusher.Flush()
		return
	}

	// 关联生理数据：以小结日期为终点向前回溯 days 天的 health_record（可能为空）
	startDate := date
	if t, err := time.Parse("2006-01-02", date); err == nil {
		startDate = t.AddDate(0, 0, -(days - 1)).Format("2006-01-02")
	}
	records, _ := h.repoSvc.GetHistoryRecords(userID, startDate, date)
	physioContext := h.insight.BuildPromptContext(records)

	userContent := buildEveningInsightPrompt(loadEveningPromptTemplate(), date, days, startDate, summary, physioContext)

	if cfg.AI.APIKey == "" || strings.Contains(cfg.AI.APIKey, "your_api_key") {
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":\"未检测到有效的大模型 API Key，请在 config.yaml 中配置 AI.APIKey。\"}}]}\n\n")
		fmt.Fprintf(w, "data: [DONE]\n\n")
		flusher.Flush()
		return
	}

	h.proxyChat(r.Context(), w, flusher, cfg.AI, eveningSystemInstruction, userContent, func(content, thinking string) {
		// 同一日期仅保留最新一条小结洞察
		if _, err := h.insightRepo.DeleteByDateScope(userID, "evening", date); err != nil {
			slog.Error("清理旧小结洞察失败", "err", err)
		}
		saved := &model.AIInsight{
			UserID:    userID,
			Scope:     "evening",
			RangeDays: days,
			StartDate: date,
			EndDate:   date,
			Content:   content,
			Thinking:  thinking,
			Model:     cfg.AI.Model,
		}
		if _, err := h.insightRepo.Insert(saved); err != nil {
			slog.Error("保存小结洞察失败", "err", err)
		} else {
			slog.Info("小结洞察已存档", "date", date)
		}
	})
}

// loadEveningPromptTemplate 读取睡前小结洞察的提示词模板。
// 与「洞察」页同一套策略：优先读取磁盘 prompts/evening_insight_v1.txt，
// 读取失败或内容为空时（例如 Android 端未打包 prompts 目录）回退到内嵌模板。
func loadEveningPromptTemplate() string {
	path := filepath.Join(config.FindProjectRoot(), "prompts", "evening_insight_v1.txt")
	if data, err := os.ReadFile(path); err == nil && strings.TrimSpace(string(data)) != "" {
		return string(data)
	}
	return service.DefaultEveningPrompt()
}

// buildEveningInsightPrompt 组装睡前小结洞察的 user 消息内容。
// tpl 为固定指令段（来自模板文件），其后拼接本次的动态数据块。
func buildEveningInsightPrompt(tpl, date string, days int, startDate string, s *model.EveningSummary, physioContext string) string {
	var sb strings.Builder
	sb.WriteString(strings.TrimRight(tpl, "\n"))
	sb.WriteString("\n\n")
	sb.WriteString(fmt.Sprintf("【小结日期】%s\n", date))
	sb.WriteString(fmt.Sprintf("【关联生理数据范围】近 %d 天（%s 至 %s）\n", days, startDate, date))
	sb.WriteString(fmt.Sprintf("【今日自评】%d / 10 分\n", s.Score))

	sb.WriteString("【今日完成的三件事】\n")
	printed := false
	for i, it := range s.DoneItems {
		if strings.TrimSpace(it) == "" {
			continue
		}
		printed = true
		sb.WriteString(fmt.Sprintf("  %d. %s\n", i+1, it))
	}
	if !printed {
		sb.WriteString("  （未填写）\n")
	}

	if strings.TrimSpace(s.NoteText) != "" {
		sb.WriteString(fmt.Sprintf("【那一刻的感想】%s\n", s.NoteText))
	} else {
		sb.WriteString("【那一刻的感想】（未填写）\n")
	}

	sb.WriteString("\n")
	sb.WriteString(physioContext)
	return sb.String()
}

// proxyChat 组装并转发上游大模型的 OpenAI 兼容流式响应，累积正文与思维链后回调落库。
func (h *AIHandler) proxyChat(ctx context.Context, w http.ResponseWriter, flusher http.Flusher, aiCfg config.AIConfig, systemPrompt, userContent string, onDone func(content, thinking string)) {
	requestBody := map[string]interface{}{
		"model":       aiCfg.Model,
		"stream":      true,
		"temperature": 0.4,
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": userContent},
		},
	}
	// 按配置给思维链封顶：max_tokens 对推理模型的思考+正文总输出生效
	if aiCfg.MaxTokens > 0 {
		requestBody["max_tokens"] = aiCfg.MaxTokens
	}
	// 思维链开关；留空则不传，保持服务端默认
	if aiCfg.Thinking == "enabled" || aiCfg.Thinking == "disabled" {
		requestBody["thinking"] = map[string]string{"type": aiCfg.Thinking}
	}

	jsonPayload, err := json.Marshal(requestBody)
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"序列化 AI 请求失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}

	reqURL := strings.TrimRight(aiCfg.BaseURL, "/") + "/chat/completions"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, reqURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"创建 AI 请求失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}
	req.Header.Set("Authorization", "Bearer "+aiCfg.APIKey)
	req.Header.Set("Content-Type", "application/json")

	// 长连接 SSE 流式转发不能设死客户端全局超时，设为 0 由大模型自然传输结束
	client := &http.Client{Timeout: 0}
	resp, err := client.Do(req)
	if err != nil {
		slog.Error("上游大模型通信失败", "err", err)
		fmt.Fprintf(w, "data: {\"error\":\"上游大模型通信失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		slog.Error("上游大模型拒绝响应", "status", resp.StatusCode, "body", string(bodyBytes))
		fmt.Fprintf(w, "data: {\"error\":\"上游大模型拒绝响应 (状态码 %d): %s\"}\n\n", resp.StatusCode, string(bodyBytes))
		flusher.Flush()
		return
	}

	// 逐行透明转发 SSE 流，同时累积正文与思维链，供传输结束后落库存档
	reader := bufio.NewReader(resp.Body)
	var contentBuf, thinkingBuf strings.Builder
	for {
		line, err := reader.ReadBytes('\n')
		if err != nil {
			if err == io.EOF {
				break
			}
			return
		}
		w.Write(line)
		flusher.Flush()

		if payload := extractSSEData(line); payload != "" {
			var chunk struct {
				Choices []struct {
					Delta struct {
						Content          string `json:"content"`
						ReasoningContent string `json:"reasoning_content"`
					} `json:"delta"`
				} `json:"choices"`
			}
			if json.Unmarshal([]byte(payload), &chunk) == nil && len(chunk.Choices) > 0 {
				contentBuf.WriteString(chunk.Choices[0].Delta.Content)
				thinkingBuf.WriteString(chunk.Choices[0].Delta.ReasoningContent)
			}
		}
	}

	// 仅在流完整结束且确有内容时落库；客户端中途断开会在上面的 return 处提前退出，不会存半截内容
	if onDone != nil && (strings.TrimSpace(contentBuf.String()) != "" || strings.TrimSpace(thinkingBuf.String()) != "") {
		onDone(contentBuf.String(), thinkingBuf.String())
	}
}

// extractSSEData 从单行 SSE 文本中提取 data 载荷；非 data 行或 [DONE] 返回空串。
func extractSSEData(line []byte) string {
	s := strings.TrimSpace(string(line))
	if !strings.HasPrefix(s, "data:") {
		return ""
	}
	payload := strings.TrimSpace(s[len("data:"):])
	if payload == "" || payload == "[DONE]" {
		return ""
	}
	return payload
}
