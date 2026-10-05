package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

type Config struct {
	ProjectRoot string         `yaml:"-"`
	Server      ServerConfig   `yaml:"server"`
	Database    DatabaseConfig `yaml:"database"`
	AI          AIConfig       `yaml:"ai"`
	Sleep       SleepConfig    `yaml:"sleep"`
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
	// MaxTokens 单次响应最大 token 数（含思维链），<=0 时不向服务端传递该参数，由服务端默认值决定。
	MaxTokens int `yaml:"max_tokens"`
	// Thinking 控制推理模型思维链开关："enabled" 开启、"disabled" 关闭，空字符串表示不传递该参数。
	Thinking string `yaml:"thinking"`
}

// SleepConfig 熬夜三档分界阈值。就寝时间 < GreenBefore 为未熬夜(绿)；
// [GreenBefore, YellowBefore) 为轻度熬夜(黄)；>= YellowBefore 为重度熬夜(红)。
type SleepConfig struct {
	GreenBefore  string `yaml:"green_before"`
	YellowBefore string `yaml:"yellow_before"`
}

// DefaultConfig 返回完整默认配置。
// APIKey 有意保持为空，不能在代码仓库中内置真实密钥。
func DefaultConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Port:    8080,
			DevMode: false,
		},
		Database: DatabaseConfig{
			Path:      "data/health.db",
			BackupDir: "data/backups",
		},
		AI: AIConfig{
			BaseURL:   "https://api.deepseek.com/v1",
			APIKey:    "",
			Model:     "deepseek-chat",
			MaxTokens: 10000,
			Thinking:  "",
		},
		Sleep: SleepConfig{
			GreenBefore:  "23:00",
			YellowBefore: "00:00",
		},
	}
}

// DefaultConfigTemplate 是首次启动时自动写入的安全配置模板。
const DefaultConfigTemplate = `# HealthTrack 配置文件
# 请填写自己的 AI 服务商配置。不要将填写了真实 api_key 的 config.yaml 提交到 GitHub。

server:
  # Android 外壳默认轮询 http://127.0.0.1:8080，请保持为 8080。
  port: 8080
  dev_mode: false

database:
  # 不使用 -data-dir 时，相对路径基于本配置文件所在目录。
  path: "data/health.db"
  backup_dir: "data/backups"

ai:
  base_url: "https://api.deepseek.com/v1"
  api_key: ""
  model: "deepseek-chat"
  # 单次响应最大 token 数（含思维链），用于给推理模型的思考长度封顶；<=0 表示不限制（交由服务端默认值）。
  max_tokens: 10000
  # 思维链开关：enabled 开启、disabled 关闭；留空表示不传递该参数（保持服务端默认）。
  thinking: ""

sleep:
  # 熬夜三档分界：就寝时间 < green_before 为未熬夜(绿)；
  # [green_before, yellow_before) 为轻度熬夜(黄)；>= yellow_before 为重度熬夜(红)。
  # 阈值采用 HH:mm，凌晨时间按跨日 +24h 归一化；"00:00" 表示次日 0 点。
  green_before: "23:00"
  yellow_before: "00:00"
`

// FindProjectRoot 是没有显式传入 -config 时的旧版兼容逻辑。
// Android 启动时必须传入绝对 -config 路径，因此不会依赖该函数。
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

// ResolveConfigPath 将配置路径转换为绝对路径。
// 未传入 -config 时，沿用桌面版项目根目录的 config.yaml。
func ResolveConfigPath(configPath string) (string, error) {
	if configPath == "" {
		configPath = filepath.Join(FindProjectRoot(), "config.yaml")
	}

	absPath, err := filepath.Abs(configPath)
	if err != nil {
		return "", fmt.Errorf("解析配置文件路径失败: %w", err)
	}

	return filepath.Clean(absPath), nil
}

// LoadConfig 读取配置；配置文件不存在时自动写入安全模板后继续加载。
// dataDir 非空时，数据库和备份目录会强制放入此目录，适用于 Android filesDir。
func LoadConfig(configPath, dataDir string) (*Config, error) {
	resolvedConfigPath, err := ResolveConfigPath(configPath)
	if err != nil {
		return nil, err
	}

	configDir := filepath.Dir(resolvedConfigPath)
	if err := ensureConfigFile(resolvedConfigPath); err != nil {
		return nil, err
	}

	cfg := DefaultConfig()
	data, err := os.ReadFile(resolvedConfigPath)
	if err != nil {
		return nil, fmt.Errorf("读取配置文件失败 (%s): %w", resolvedConfigPath, err)
	}

	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件失败 (%s): %w", resolvedConfigPath, err)
	}

	cfg.ProjectRoot = configDir

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

	if dataDir != "" {
		resolvedDataDir, err := filepath.Abs(dataDir)
		if err != nil {
			return nil, fmt.Errorf("解析数据目录失败: %w", err)
		}

		resolvedDataDir = filepath.Clean(resolvedDataDir)
		cfg.Database.Path = filepath.Join(resolvedDataDir, "health.db")
		cfg.Database.BackupDir = filepath.Join(resolvedDataDir, "backups")
	} else {
		// 未使用 -data-dir 时，相对路径相对于 config.yaml 所在目录。
		cfg.Database.Path = resolvePath(configDir, cfg.Database.Path)
		cfg.Database.BackupDir = resolvePath(configDir, cfg.Database.BackupDir)
	}

	return cfg, nil
}

func resolvePath(baseDir, path string) string {
	if filepath.IsAbs(path) {
		return filepath.Clean(path)
	}

	return filepath.Clean(filepath.Join(baseDir, path))
}

// ensureConfigFile 只在文件不存在时创建模板，绝不会覆盖用户配置。
// 0600 可避免 Unix/Android 上同机其他用户读取含 API Key 的配置。
func ensureConfigFile(configPath string) error {
	if _, err := os.Stat(configPath); err == nil {
		return nil
	} else if !errors.Is(err, os.ErrNotExist) {
		return fmt.Errorf("检查配置文件失败 (%s): %w", configPath, err)
	}

	if err := os.MkdirAll(filepath.Dir(configPath), 0700); err != nil {
		return fmt.Errorf("创建配置目录失败: %w", err)
	}

	file, err := os.OpenFile(configPath, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0600)
	if err != nil {
		if errors.Is(err, os.ErrExist) {
			return nil
		}
		return fmt.Errorf("创建默认配置文件失败 (%s): %w", configPath, err)
	}
	defer file.Close()

	if _, err := file.WriteString(DefaultConfigTemplate); err != nil {
		return fmt.Errorf("写入默认配置文件失败 (%s): %w", configPath, err)
	}

	return nil
}
