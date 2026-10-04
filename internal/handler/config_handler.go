package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
)

type ConfigHandler struct {
	store *config.RuntimeStore
}

type updateConfigRequest struct {
	BaseURL string  `json:"base_url"`
	Model   string  `json:"model"`
	APIKey  *string `json:"api_key"`
}

type testConfigRequest struct {
	BaseURL string  `json:"base_url"`
	Model   string  `json:"model"`
	APIKey  *string `json:"api_key"`
}

func NewConfigHandler(store *config.RuntimeStore) *ConfigHandler {
	return &ConfigHandler{store: store}
}

// Get 返回不包含真实 API Key 的配置视图。
func (h *ConfigHandler) Get(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	cfg := h.store.Snapshot()
	writeJSON(w, http.StatusOK, model.Success(map[string]any{
		"base_url":            cfg.AI.BaseURL,
		"model":               cfg.AI.Model,
		"api_key_configured":  cfg.AI.APIKey != "",
		"api_key_masked":      maskAPIKey(cfg.AI.APIKey),
		"sleep_green_before":  cfg.Sleep.GreenBefore,
		"sleep_yellow_before": cfg.Sleep.YellowBefore,
	}))
}

// Update 先将数据原子写回动态 -config 路径，再立即更新运行时配置。
func (h *ConfigHandler) Update(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	var req updateConfigRequest
	if err := decodeConfigRequest(w, r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		return
	}

	if err := h.store.UpdateAI(req.BaseURL, req.Model, req.APIKey); err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.SuccessWithMsg("配置已安全保存并立即生效", nil))
}

type updateSleepRequest struct {
	GreenBefore  string `json:"green_before"`
	YellowBefore string `json:"yellow_before"`
}

// UpdateSleep 更新熬夜三档阈值，原子写盘并立即生效。
func (h *ConfigHandler) UpdateSleep(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	var req updateSleepRequest
	if err := decodeConfigRequest(w, r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		return
	}

	if err := h.store.UpdateSleep(req.GreenBefore, req.YellowBefore); err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.SuccessWithMsg("熬夜阈值已保存并立即生效", nil))
}

// Test 使用 OpenAI 兼容接口的 /models 端点验证网络、地址和 Key，不写入配置文件。
func (h *ConfigHandler) Test(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	var req testConfigRequest
	if err := decodeConfigRequest(w, r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		return
	}

	cfg := h.store.Snapshot()
	baseURL := strings.TrimRight(strings.TrimSpace(req.BaseURL), "/")
	modelName := strings.TrimSpace(req.Model)
	apiKey := cfg.AI.APIKey
	if req.APIKey != nil {
		apiKey = strings.TrimSpace(*req.APIKey)
	}
	if err := validateTestConfig(baseURL, modelName, apiKey); err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		return
	}

	httpReq, err := http.NewRequestWithContext(r.Context(), http.MethodGet, baseURL+"/models", nil)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, "创建测试请求失败: "+err.Error()))
		return
	}
	httpReq.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, model.Error(model.CodeAIServiceErr, "连接失败，请检查网络和 API Base URL"))
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 1024))
		message := fmt.Sprintf("AI 服务返回 HTTP %d", resp.StatusCode)
		if detail := strings.TrimSpace(string(body)); detail != "" {
			message += ": " + detail
		}
		writeJSON(w, http.StatusBadGateway, model.Error(model.CodeAIServiceErr, message))
		return
	}

	writeJSON(w, http.StatusOK, model.SuccessWithMsg("连接成功，地址与 API Key 可用", nil))
}

func decodeConfigRequest(w http.ResponseWriter, r *http.Request, target any) error {
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		return fmt.Errorf("JSON 格式非法: %w", err)
	}
	return nil
}

func validateTestConfig(baseURL, model, apiKey string) error {
	if baseURL == "" || !strings.HasPrefix(baseURL, "http") {
		return fmt.Errorf("API Base URL 必须是有效的 http 或 https 地址")
	}
	if model == "" {
		return fmt.Errorf("模型名称不能为空")
	}
	if apiKey == "" {
		return fmt.Errorf("请先输入 API Key")
	}
	return nil
}

func maskAPIKey(key string) string {
	if key == "" {
		return ""
	}

	runes := []rune(key)
	if len(runes) <= 8 {
		return strings.Repeat("*", len(runes))
	}
	return string(runes[:4]) + strings.Repeat("*", len(runes)-8) + string(runes[len(runes)-4:])
}
