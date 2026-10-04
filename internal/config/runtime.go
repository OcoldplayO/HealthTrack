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
