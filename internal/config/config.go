package config

import (
	"fmt"
	"os"
	"path/filepath"

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

// FindProjectRoot 智能寻径定位项目根目录
// 优先级 1：当前工作目录是否存在 config.yaml
// 优先级 2：上一级目录是否存在 ../config.yaml（如在 bin/ 目录下运行）
// 优先级 3：通过 os.Executable() 推导上级目录
func FindProjectRoot() string {
	// 优先级 1：检查当前工作目录是否存在 config.yaml
	if _, err := os.Stat("config.yaml"); err == nil {
		if abs, err := filepath.Abs("."); err == nil {
			return abs
		}
		return "."
	}

	// 优先级 2：检查上一级目录是否存在 ../config.yaml
	if _, err := os.Stat(filepath.Join("..", "config.yaml")); err == nil {
		if abs, err := filepath.Abs(".."); err == nil {
			return abs
		}
		return ".."
	}

	// 优先级 3：通过可执行文件绝对路径推导上级目录
	if exePath, err := os.Executable(); err == nil {
		exeDir := filepath.Dir(exePath)
		// 如果可执行文件位于 bin/ 目录下，则父目录为项目根目录
		if filepath.Base(exeDir) == "bin" {
			return filepath.Dir(exeDir)
		}
		// 检查 exe 所在目录下是否存在 config.yaml
		if _, err := os.Stat(filepath.Join(exeDir, "config.yaml")); err == nil {
			return exeDir
		}
		// 检查 exe 所在目录的上一级是否存在 config.yaml
		parentDir := filepath.Dir(exeDir)
		if _, err := os.Stat(filepath.Join(parentDir, "config.yaml")); err == nil {
			return parentDir
		}
		return exeDir
	}

	return "."
}

// LoadConfig 读取并解析配置文件，并实现路径绝对锚定
func LoadConfig(configName string) (*Config, error) {
	root := FindProjectRoot()

	// 默认配置（相对路径以 data/ 为基准）
	cfg := &Config{
		Server: ServerConfig{
			Port:    8080,
			DevMode: false,
		},
		Database: DatabaseConfig{
			Path:      "data/health.db",
			BackupDir: "data/backups",
		},
		AI: AIConfig{
			BaseURL: "https://open.bigmodel.cn/api/paas/v4",
			APIKey:  "",
			Model:   "glm-4-flash",
		},
	}

	configPath := configName
	if !filepath.IsAbs(configPath) {
		configPath = filepath.Join(root, configName)
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			// 未找到配置文件，将默认路径转换为绝对路径后返回
			if !filepath.IsAbs(cfg.Database.Path) {
				cfg.Database.Path = filepath.Join(root, cfg.Database.Path)
			}
			if !filepath.IsAbs(cfg.Database.BackupDir) {
				cfg.Database.BackupDir = filepath.Join(root, cfg.Database.BackupDir)
			}
			return cfg, nil
		}
		return nil, fmt.Errorf("读取配置文件失败 (%s): %w", configPath, err)
	}

	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	// 环境变量优先级覆盖（适合容器化/CI 部署）
	if envKey := os.Getenv("AI_API_KEY"); envKey != "" {
		cfg.AI.APIKey = envKey
	}
	if envBase := os.Getenv("AI_BASE_URL"); envBase != "" {
		cfg.AI.BaseURL = envBase
	}
	if envModel := os.Getenv("AI_MODEL"); envModel != "" {
		cfg.AI.Model = envModel
	}

	// 关键路径修正：相对路径统一转换为基于 ProjectRoot 的绝对/规范路径
	if !filepath.IsAbs(cfg.Database.Path) {
		cfg.Database.Path = filepath.Join(root, cfg.Database.Path)
	}
	if !filepath.IsAbs(cfg.Database.BackupDir) {
		cfg.Database.BackupDir = filepath.Join(root, cfg.Database.BackupDir)
	}

	return cfg, nil
}
