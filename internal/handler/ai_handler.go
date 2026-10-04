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
	"healthtrack/internal/service"
)

type AIHandler struct {
	configs *config.RuntimeStore
	insight *service.InsightService
	repoSvc *service.RecordService
}

func NewAIHandler(configs *config.RuntimeStore, insight *service.InsightService, repoSvc *service.RecordService) *AIHandler {
	return &AIHandler{configs: configs, insight: insight, repoSvc: repoSvc}
}

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

	// 3. 构建预计算特征上下文
	dataContext := h.insight.BuildPromptContext(records)

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
			{"role": "user", "content": fullUserContent},
		},
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

	// 6. 逐行透明转发 SSE 流
	reader := bufio.NewReader(resp.Body)
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
	}
}
