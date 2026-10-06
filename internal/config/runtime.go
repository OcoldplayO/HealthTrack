package config

import (
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"gopkg.in/yaml.v3"
)

// RuntimeStore 持有运行中的配置快照，并保证读取、热更新和落盘互不竞争。
type RuntimeStore struct {
	mu         sync.RWMutex
	cfg        Config
	configPath string
}

func NewRuntimeStore(cfg *Config, configPath string) *RuntimeStore {
	return &RuntimeStore{
		cfg:        *cfg,
		configPath: configPath,
	}
}

// Snapshot 返回一个可安全供请求使用的配置副本。
func (s *RuntimeStore) Snapshot() Config {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.cfg
}

// UpdateAI 验证、原子持久化并立即应用新的 AI 配置。
// apiKey 为 nil 时保留已保存的 Key；传入空字符串可明确清空 Key。
func (s *RuntimeStore) UpdateAI(baseURL, model string, apiKey *string) error {
	baseURL = strings.TrimRight(strings.TrimSpace(baseURL), "/")
	model = strings.TrimSpace(model)

	if baseURL == "" {
		return fmt.Errorf("API Base URL 不能为空")
	}
	parsedURL, err := url.ParseRequestURI(baseURL)
	if err != nil || (parsedURL.Scheme != "http" && parsedURL.Scheme != "https") || parsedURL.Host == "" {
		return fmt.Errorf("API Base URL 必须是有效的 http 或 https 地址")
	}
	if model == "" {
		return fmt.Errorf("模型名称不能为空")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	next := s.cfg
	next.AI.BaseURL = baseURL
	next.AI.Model = model
	if apiKey != nil {
		next.AI.APIKey = strings.TrimSpace(*apiKey)
	}

	if err := writeConfigAtomically(s.configPath, &next); err != nil {
		return err
	}

	s.cfg = next
	return nil
}

// UpdateSleep 校验、原子持久化并立即应用新的熬夜阈值配置。
func (s *RuntimeStore) UpdateSleep(greenBefore, yellowBefore string) error {
	greenBefore = strings.TrimSpace(greenBefore)
	yellowBefore = strings.TrimSpace(yellowBefore)
	if err := validateSleepTimes(greenBefore, yellowBefore); err != nil {
		return err
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	next := s.cfg
	next.Sleep.GreenBefore = greenBefore
	next.Sleep.YellowBefore = yellowBefore

	if err := writeConfigAtomically(s.configPath, &next); err != nil {
		return err
	}

	s.cfg = next
	return nil
}

// UpdateScoreBands 校验、原子持久化并立即应用新的评分分档文案。
func (s *RuntimeStore) UpdateScoreBands(bands []ScoreBandConfig) error {
	if err := validateScoreBands(bands); err != nil {
		return err
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	next := s.cfg
	next.Summary.ScoreBands = bands

	if err := writeConfigAtomically(s.configPath, &next); err != nil {
		return err
	}

	s.cfg = next
	return nil
}

// validateScoreBands 校验分档：必须完整覆盖 1~10、区间不重叠且递增，文案非空、配色合法。
func validateScoreBands(bands []ScoreBandConfig) error {
	if len(bands) == 0 {
		return fmt.Errorf("评分分档不能为空")
	}

	expected := 1
	for i, b := range bands {
		if len(b.Range) != 2 {
			return fmt.Errorf("第 %d 档的 range 必须为 [起始, 结束]", i+1)
		}
		low, high := b.Range[0], b.Range[1]
		if low < 1 || high > 10 || low > high {
			return fmt.Errorf("第 %d 档的分数区间非法，需在 1~10 内且起始不大于结束", i+1)
		}
		if low != expected {
			return fmt.Errorf("评分分档需从 1 到 10 连续且不重叠（第 %d 档应从 %d 开始）", i+1, expected)
		}
		expected = high + 1
		if strings.TrimSpace(b.Label) == "" {
			return fmt.Errorf("第 %d 档的文案不能为空", i+1)
		}
		if len([]rune(b.Label)) > 20 {
			return fmt.Errorf("第 %d 档的文案不能超过 20 个字符", i+1)
		}
		if !isValidTone(b.Tone) {
			return fmt.Errorf("第 %d 档的配色非法，可选：rose/amber/emerald/indigo/violet", i+1)
		}
	}
	if expected != 11 {
		return fmt.Errorf("评分分档必须完整覆盖 1~10 分")
	}
	return nil
}

func isValidTone(tone string) bool {
	for _, t := range ValidScoreTones {
		if t == tone {
			return true
		}
	}
	return false
}

// validateSleepTimes 校验熬夜阈值为合法 HH:mm 且未熬夜截止早于轻度截止。
func validateSleepTimes(greenBefore, yellowBefore string) error {
	g, okG := parseHHMM(greenBefore)
	y, okY := parseHHMM(yellowBefore)
	if !okG || !okY {
		return fmt.Errorf("熬夜阈值必须是 HH:mm 格式")
	}
	if g >= y {
		return fmt.Errorf("轻度熬夜截止时间必须晚于未熬夜截止时间")
	}
	return nil
}

// parseHHMM 将 HH:mm 折算为分钟；凌晨(00:00-04:00)视为跨日后 +24h。
func parseHHMM(s string) (int, bool) {
	parts := strings.Split(s, ":")
	if len(parts) != 2 {
		return 0, false
	}
	hour, err := strconv.Atoi(parts[0])
	if err != nil {
		return 0, false
	}
	minute, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, false
	}
	if minute < 0 || minute > 59 {
		return 0, false
	}
	total := hour*60 + minute
	if hour >= 0 && hour <= 4 {
		total += 24 * 60
	}
	return total, true
}

func writeConfigAtomically(configPath string, cfg *Config) error {
	content, err := yaml.Marshal(cfg)
	if err != nil {
		return fmt.Errorf("序列化配置失败: %w", err)
	}

	dir := filepath.Dir(configPath)
	tempFile, err := os.CreateTemp(dir, ".config-*.yaml")
	if err != nil {
		return fmt.Errorf("创建临时配置文件失败: %w", err)
	}
	tempPath := tempFile.Name()
	defer os.Remove(tempPath)

	if err := tempFile.Chmod(0600); err != nil {
		tempFile.Close()
		return fmt.Errorf("设置配置文件权限失败: %w", err)
	}
	if _, err := tempFile.Write(content); err != nil {
		tempFile.Close()
		return fmt.Errorf("写入临时配置文件失败: %w", err)
	}
	if err := tempFile.Close(); err != nil {
		return fmt.Errorf("关闭临时配置文件失败: %w", err)
	}
	if err := os.Rename(tempPath, configPath); err != nil {
		return fmt.Errorf("替换配置文件失败: %w", err)
	}

	return nil
}
