package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server   ServerConfig   `yaml:"server"`
	Database DatabaseConfig `yaml:"database"`
	AI       AIConfig       `yaml:"ai"`
}

type ServerConfig struct {
	Port    int  `yaml:"port"`
	DevMode bool `yaml:"dev_mode"`
}

type DatabaseConfig struct {
	Path      string `yaml:"path"`
	BackupDir string `yaml:"backup_dir"`
}

type AIConfig struct {
	BaseURL string `yaml:"base_url"`
	APIKey  string `yaml:"api_key"`
	Model   string `yaml:"model"`
}

func LoadConfig(path string) (*Config, error) {
	// 默认配置
	cfg := &Config{
		Server: ServerConfig{
			Port:    8080,
			DevMode: true,
		},
		Database: DatabaseConfig{
			Path:      "./health.db",
			BackupDir: "./backups",
		},
		AI: AIConfig{
			BaseURL: "https://api.deepseek.com/v1",
			APIKey:  "",
			Model:   "deepseek-chat",
		},
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return cfg, nil // 配置文件不存在时使用默认值
		}
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}

	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	// 环境变量优先级覆盖（适合 Docker / CI 部署）
	if envKey := os.Getenv("AI_API_KEY"); envKey != "" {
		cfg.AI.APIKey = envKey
	}
	if envBase := os.Getenv("AI_BASE_URL"); envBase != "" {
		cfg.AI.BaseURL = envBase
	}
	if envModel := os.Getenv("AI_MODEL"); envModel != "" {
		cfg.AI.Model = envModel
	}

	return cfg, nil
}
