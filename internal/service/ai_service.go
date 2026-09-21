package service

import (
	"bufio"
	"bytes"
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"io"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"
)

//go:embed default_prompt.txt
var defaultPromptTemplate string

type AIService struct {
	cfg  *config.AIConfig
	repo *repository.RecordRepository
}

func NewAIService(cfg *config.AIConfig, repo *repository.RecordRepository) *AIService {
	return &AIService{
		cfg:  cfg,
		repo: repo,
	}
}

// StreamInsight 流式生成 AI 洞察并实时写入 http 响应
func (s *AIService) StreamInsight(ctx context.Context, userID int64, startDate, endDate string, w http.ResponseWriter) error {
	flusher, ok := w.(http.Flusher)
	if !ok {
		return fmt.Errorf("当前连接不支持流式输出 (Streaming not supported)")
	}

	// 1. 获取区间内的所有数据记录
	records, err := s.repo.GetRange(userID, startDate, endDate)
	if err != nil {
		return fmt.Errorf("读取历史记录失败: %w", err)
	}

	if len(records) == 0 {
		sendSSEEvent(w, flusher, "抱歉，在选定日期区间内尚未找到任何健康记录，请先在【记一笔】中录入数据后再尝试分析。", "done")
		return nil
	}

	// 2. 在 Go 后端预先计算宏观基线指标 (杜绝 AI 算术幻觉)
	stats := calculateStats(startDate, endDate, records)

	// 3. 组装 Prompt
	promptContent, err := s.buildPrompt(stats, records)
	if err != nil {
		return fmt.Errorf("构建分析提示词失败: %w", err)
	}

	// 4. 若未配置 API Key，输出本地智能分析与配置提示
	if s.cfg.APIKey == "" || strings.Contains(s.cfg.APIKey, "your_api_key") {
		return s.streamDemoInsight(promptContent, stats, w, flusher)
	}

	// 5. 调用外部大模型 API (兼容 DeepSeek / GLM / OpenAI)
	return s.callOpenAIStream(ctx, promptContent, w, flusher)
}

type MacroStats struct {
	StartDate   string
	EndDate     string
	TotalDays   int
	ValidDays   int
	StartWeight string
	EndWeight   string
	WeightDelta string
	GreenDays   int
	YellowDays  int
	RedDays     int
	WorkoutDays int
}

func calculateStats(startDate, endDate string, records []*model.HealthRecord) *MacroStats {
	t1, _ := time.Parse("2006-01-02", startDate)
	t2, _ := time.Parse("2006-01-02", endDate)
	totalDays := int(t2.Sub(t1).Hours()/24) + 1

	stats := &MacroStats{
		StartDate:   startDate,
		EndDate:     endDate,
		TotalDays:   totalDays,
		ValidDays:   len(records),
		StartWeight: "--",
		EndWeight:   "--",
		WeightDelta: "--",
	}

	var firstWeight, lastWeight *float64
	for _, r := range records {
		w := r.WeightAM
		if w == nil {
			w = r.WeightPM
		}
		if w != nil {
			if firstWeight == nil {
				firstWeight = w
			}
			lastWeight = w
		}

		switch r.SleepTag {
		case "GREEN":
			stats.GreenDays++
		case "YELLOW":
			stats.YellowDays++
		case "RED":
			stats.RedDays++
		default:
			stats.GreenDays++
		}

		if r.ActivityTags != "" && r.ActivityTags != "[]" {
			stats.WorkoutDays++
		}
	}

	if firstWeight != nil && lastWeight != nil {
		stats.StartWeight = fmt.Sprintf("%.1f", *firstWeight)
		stats.EndWeight = fmt.Sprintf("%.1f", *lastWeight)
		delta := *lastWeight - *firstWeight
		if delta > 0 {
			stats.WeightDelta = fmt.Sprintf("+%.1f", delta)
		} else {
			stats.WeightDelta = fmt.Sprintf("%.1f", delta)
		}
	}

	return stats
}

func (s *AIService) buildPrompt(stats *MacroStats, records []*model.HealthRecord) (string, error) {
	var tpl string
	// 优先读取磁盘文件，若无则使用内置内嵌模板
	if data, err := os.ReadFile("prompts/insight_v1.txt"); err == nil {
		tpl = string(data)
	} else {
		tpl = defaultPromptTemplate
	}

	tpl = strings.ReplaceAll(tpl, "{{.StartDate}}", stats.StartDate)
	tpl = strings.ReplaceAll(tpl, "{{.EndDate}}", stats.EndDate)
	tpl = strings.ReplaceAll(tpl, "{{.TotalDays}}", fmt.Sprintf("%d", stats.TotalDays))
	tpl = strings.ReplaceAll(tpl, "{{.ValidDays}}", fmt.Sprintf("%d", stats.ValidDays))
	tpl = strings.ReplaceAll(tpl, "{{.StartWeight}}", stats.StartWeight)
	tpl = strings.ReplaceAll(tpl, "{{.EndWeight}}", stats.EndWeight)
	tpl = strings.ReplaceAll(tpl, "{{.WeightDelta}}", stats.WeightDelta)
	tpl = strings.ReplaceAll(tpl, "{{.GreenDays}}", fmt.Sprintf("%d", stats.GreenDays))
	tpl = strings.ReplaceAll(tpl, "{{.YellowDays}}", fmt.Sprintf("%d", stats.YellowDays))
	tpl = strings.ReplaceAll(tpl, "{{.RedDays}}", fmt.Sprintf("%d", stats.RedDays))
	tpl = strings.ReplaceAll(tpl, "{{.WorkoutDays}}", fmt.Sprintf("%d", stats.WorkoutDays))

	var logBuilder strings.Builder
	for _, r := range records {
		am := "--"
		if r.WeightAM != nil {
			am = fmt.Sprintf("%.1f", *r.WeightAM)
		}
		pm := "--"
		if r.WeightPM != nil {
			pm = fmt.Sprintf("%.1f", *r.WeightPM)
		}
		sh := "--"
		if r.SleepHours != nil {
			sh = fmt.Sprintf("%.1f", *r.SleepHours)
		}

		logBuilder.WriteString(fmt.Sprintf("- 日期: %s | 晨重: %skg, 晚重: %skg | 睡眠: %sh (%s)\n",
			r.RecordDate, am, pm, sh, r.SleepTag))
		if r.JournalText != "" {
			logBuilder.WriteString(fmt.Sprintf("  记录: %s\n", r.JournalText))
		}
	}
	tpl = strings.ReplaceAll(tpl, "{{.DailyLogs}}", logBuilder.String())

	return tpl, nil
}

func (s *AIService) callOpenAIStream(ctx context.Context, prompt string, w http.ResponseWriter, flusher http.Flusher) error {
	baseURL := strings.TrimRight(s.cfg.BaseURL, "/")
	apiURL := baseURL + "/chat/completions"

	reqBody := map[string]any{
		"model": s.cfg.Model,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"stream":      true,
		"temperature": 0.7,
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", apiURL, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.cfg.APIKey)

	client := &http.Client{Timeout: 45 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		slog.Error("请求 AI API 失败", "err", err)
		sendSSEEvent(w, flusher, "连接 AI 接口超时，请检查网络或 API Key 设置。", "error")
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		slog.Error("AI API 返回错误", "status", resp.StatusCode, "body", string(body))
		sendSSEEvent(w, flusher, fmt.Sprintf("AI 服务返回错误 (HTTP %d): %s", resp.StatusCode, string(body)), "error")
		return fmt.Errorf("AI upstream error: %s", string(body))
	}

	reader := bufio.NewReader(resp.Body)
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				break
			}
			return err
		}

		line = strings.TrimSpace(line)
		if line == "" || !strings.HasPrefix(line, "data:") {
			continue
		}

		dataStr := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if dataStr == "[DONE]" {
			sendSSEEvent(w, flusher, "", "done")
			break
		}

		var chunk struct {
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
		}

		if err := json.Unmarshal([]byte(dataStr), &chunk); err == nil {
			if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.Content != "" {
				sendSSEEvent(w, flusher, chunk.Choices[0].Delta.Content, "streaming")
			}
		}
	}

	return nil
}

func (s *AIService) streamDemoInsight(prompt string, stats *MacroStats, w http.ResponseWriter, flusher http.Flusher) error {
	demoText := fmt.Sprintf(`### 💡 周期健康分析报告 (%s ~ %s)

**宏观基准**：本次分析覆盖 %d 天（有效记录 %d 天）。阶段体重变化: %s kg，正常作息 %d 天，轻度熬夜 %d 天，重度熬夜 %d 天，运动打卡 %d 天。

#### 1. 🔍 因果归因与代谢观察
* **高糖/高碳水与次日体重**：在记录中出现晚餐摄入重度碳水（如大碗炒饭+高糖饮料）的日期，睡前体重通常出现明显上浮（+1.0kg 以上），且次日晨间空腹体重未能完全回落，表明短时间内糖原充盈伴随水分滞留。
* **晚间刺激饮品对入睡的延迟效应**：高糖能量饮料（如魔爪等）在晚间饮用时，神经系统兴奋度增加，直接导致入睡时间推迟至凌晨 1 点以后（红档熬夜）。

#### 2. 🌟 针对性调整建议
1. **替换晚间饮品**：将睡前的含糖/含咖啡因饮料替换为温水或无糖电解质水，观察就寝时间能否提前至 23:30 前。
2. **平稳晚餐升糖指数**：晚餐可适当降低精制碳水比例，增加绿叶蔬菜与优质蛋白，利于夜间代谢与更深度的睡眠修复。

*(提示: 当前为本地演示分析。若要体验实时大模型深度分析，请在 `+"`config.yaml`"+` 中填入你的 DeepSeek 或 GLM 的 API Key)*`,
		stats.StartDate, stats.EndDate, stats.TotalDays, stats.ValidDays, stats.WeightDelta, stats.GreenDays, stats.YellowDays, stats.RedDays, stats.WorkoutDays)

	runes := []rune(demoText)
	chunkSize := 4
	for i := 0; i < len(runes); i += chunkSize {
		end := i + chunkSize
		if end > len(runes) {
			end = len(runes)
		}
		sendSSEEvent(w, flusher, string(runes[i:end]), "streaming")
		time.Sleep(30 * time.Millisecond)
	}
	sendSSEEvent(w, flusher, "", "done")
	return nil
}

func sendSSEEvent(w http.ResponseWriter, flusher http.Flusher, delta, status string) {
	payload := map[string]string{
		"delta":  delta,
		"status": status,
	}
	bytes, _ := json.Marshal(payload)
	fmt.Fprintf(w, "data: %s\n\n", string(bytes))
	flusher.Flush()
}
