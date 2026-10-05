package handler

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

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
}

func NewAIHandler(configs *config.RuntimeStore, insight *service.InsightService, repoSvc *service.RecordService, insightRepo *repository.InsightRepository) *AIHandler {
	return &AIHandler{configs: configs, insight: insight, repoSvc: repoSvc, insightRepo: insightRepo}
}

// systemInstruction 以 system 角色下发硬性约束。
// 推理模型的思维链（reasoning_content）语言主要由 system 角色决定；同类约束若只写在
// user 消息里（见提示词模板），遵循度不稳定，会出现同一模板时而中文、时而英文思考。
const systemInstruction = "你是严谨的中文健康分析顾问。硬性要求：你的全部思考过程（reasoning_content）与最终回答必须始终使用简体中文，严禁使用英文进行推理、自问自答或中英夹杂。"

func (h *AIHandler) StreamInsight(w http.ResponseWriter, r *http.Request) {
	cfg := h.configs.Snapshot()
	// 1. 设置标准 SSE 响应头
	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// 2. 解析分析天数 (支持 7、30、60，默认 30 天)
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

	// 3. 构建预计算特征上下文（同时记录该期数据实际起止日期，用于存档）
	dataContext := h.insight.BuildPromptContext(records)
	startDate := records[0].RecordDate
	endDate := records[len(records)-1].RecordDate

	// 4. 读取提示词模板 prompts/insight_v1.txt。
	// 磁盘读取失败（例如 Android 端 prompts 目录未打包进 APK）时，回退到内嵌的默认模板，避免报“模板文件不存在”。
	promptPath := filepath.Join(config.FindProjectRoot(), "prompts", "insight_v1.txt")
	promptTpl, err := os.ReadFile(promptPath)
	if err != nil {
		promptTpl = []byte(service.DefaultPrompt())
	}

	fullUserContent := fmt.Sprintf("%s\n\n%s", string(promptTpl), dataContext)

	// 如果未配置 API Key 或为占位符，输出提示
	if cfg.AI.APIKey == "" || strings.Contains(cfg.AI.APIKey, "your_api_key") {
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":\"未检测到有效的大模型 API Key，请在 config.yaml 中配置 AI.APIKey。\"}}]}\n\n")
		fmt.Fprintf(w, "data: [DONE]\n\n")
		flusher.Flush()
		return
	}

	// 5. 组装请求 Payload (完全兼容 OpenAI 协议规范)
	requestBody := map[string]interface{}{
		"model":       cfg.AI.Model,
		"stream":      true,
		"temperature": 0.4,
		"messages": []map[string]string{
			{"role": "system", "content": systemInstruction},
			{"role": "user", "content": fullUserContent},
		},
	}
	// 5.1 按配置给思维链封顶：max_tokens 对推理模型的思考+正文总输出生效
	if cfg.AI.MaxTokens > 0 {
		requestBody["max_tokens"] = cfg.AI.MaxTokens
	}
	// 5.2 思维链开关；留空则不传，保持服务端默认
	if cfg.AI.Thinking == "enabled" || cfg.AI.Thinking == "disabled" {
		requestBody["thinking"] = map[string]string{"type": cfg.AI.Thinking}
	}
	jsonPayload, err := json.Marshal(requestBody)
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"序列化 AI 请求失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}

	// 统一在 BaseURL 后安全拼接 /chat/completions
	reqURL := strings.TrimRight(cfg.AI.BaseURL, "/") + "/chat/completions"
	req, err := http.NewRequestWithContext(r.Context(), "POST", reqURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"创建 AI 请求失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}

	req.Header.Set("Authorization", "Bearer "+cfg.AI.APIKey)
	req.Header.Set("Content-Type", "application/json")

	// 核心修复：长连接 SSE 流式转发不能设死客户端全局超时，设为 0 由大模型自然传输结束
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

	// 6. 逐行透明转发 SSE 流，同时累积正文与思维链，供传输结束后落库存档
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

	// 7. 仅在流完整结束且确有内容时落库；客户端中途断开会在上面的 return 处提前退出，不会存半截内容
	if strings.TrimSpace(contentBuf.String()) != "" || strings.TrimSpace(thinkingBuf.String()) != "" {
		saved := &model.AIInsight{
			UserID:    userID,
			RangeDays: days,
			StartDate: startDate,
			EndDate:   endDate,
			Content:   contentBuf.String(),
			Thinking:  thinkingBuf.String(),
			Model:     cfg.AI.Model,
		}
		if _, err := h.insightRepo.Insert(saved); err != nil {
			slog.Error("保存 AI 洞察存档失败", "err", err)
		} else {
			slog.Info("AI 洞察已存档", "range_days", days, "start", startDate, "end", endDate)
		}
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
