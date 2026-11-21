package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestRuntimeStoreSnapshotDeepCopiesScoreBands(t *testing.T) {
	cfg := DefaultConfig()
	store := NewRuntimeStore(cfg, filepath.Join(t.TempDir(), "config.yaml"))

	// 修改构造时传入的原始 cfg，不应影响 store 内部状态
	cfg.Summary.ScoreBands[0].Label = "外部篡改"
	cfg.Summary.ScoreBands[0].Range[0] = 99

	snap1 := store.Snapshot()
	if snap1.Summary.ScoreBands[0].Label == "外部篡改" || snap1.Summary.ScoreBands[0].Range[0] == 99 {
		t.Fatalf("NewRuntimeStore 未深拷贝输入配置: %+v", snap1.Summary.ScoreBands[0])
	}

	// 修改 Snapshot 返回切片与 Range，不应污染后续 Snapshot
	snap1.Summary.ScoreBands[0].Label = "被调用方改写"
	snap1.Summary.ScoreBands[0].Range[1] = 88

	snap2 := store.Snapshot()
	if snap2.Summary.ScoreBands[0].Label == "被调用方改写" || snap2.Summary.ScoreBands[0].Range[1] == 88 {
		t.Fatalf("Snapshot 未深拷贝 ScoreBands，导致内部状态被污染: %+v", snap2.Summary.ScoreBands[0])
	}

	// UpdateScoreBands 同样应隔离调用方传入的切片
	bands := DefaultScoreBands()
	if err := store.UpdateScoreBands(bands); err != nil {
		t.Fatalf("UpdateScoreBands 失败: %v", err)
	}
	bands[1].Label = "更新后篡改"
	bands[1].Range[0] = 77

	snap3 := store.Snapshot()
	if snap3.Summary.ScoreBands[1].Label == "更新后篡改" || snap3.Summary.ScoreBands[1].Range[0] == 77 {
		t.Fatalf("UpdateScoreBands 未克隆入参切片: %+v", snap3.Summary.ScoreBands[1])
	}
}

func TestLoadConfigCreatesTemplateAndAppliesEnvOverrides(t *testing.T) {
	dir := t.TempDir()
	cfgPath := filepath.Join(dir, "config.yaml")
	dataDir := filepath.Join(dir, "custom-data")

	t.Setenv("AI_API_KEY", "sk-env-override")
	t.Setenv("AI_BASE_URL", "https://example.com/v1")
	t.Setenv("AI_MODEL", "custom-model")

	cfg, err := LoadConfig(cfgPath, dataDir)
	if err != nil {
		t.Fatalf("LoadConfig 失败: %v", err)
	}

	if _, err := os.Stat(cfgPath); err != nil {
		t.Fatalf("LoadConfig 未自动生成配置模板: %v", err)
	}
	if cfg.AI.APIKey != "sk-env-override" || cfg.AI.BaseURL != "https://example.com/v1" || cfg.AI.Model != "custom-model" {
		t.Fatalf("环境变量覆盖未生效: %+v", cfg.AI)
	}
	if cfg.Database.Path != filepath.Join(dataDir, "health.db") || cfg.Database.BackupDir != filepath.Join(dataDir, "backups") {
		t.Fatalf("dataDir 路径重定向异常: %+v", cfg.Database)
	}
	if len(cfg.Summary.ScoreBands) != 5 {
		t.Fatalf("默认评分分档应为 5 档，实际 %d", len(cfg.Summary.ScoreBands))
	}
}

func TestRuntimeStoreUpdateAIValidationAndPersistence(t *testing.T) {
	cfgPath := filepath.Join(t.TempDir(), "config.yaml")
	cfg, err := LoadConfig(cfgPath, "")
	if err != nil {
		t.Fatalf("初始化配置失败: %v", err)
	}
	store := NewRuntimeStore(cfg, cfgPath)

	if err := store.UpdateAI("", "deepseek-chat", nil); err == nil {
		t.Fatal("空 BaseURL 应被拒绝")
	}
	if err := store.UpdateAI("ftp://bad.example.com", "deepseek-chat", nil); err == nil {
		t.Fatal("非 http/https 地址应被拒绝")
	}
	if err := store.UpdateAI("https://api.deepseek.com/v1", "", nil); err == nil {
		t.Fatal("空模型名称应被拒绝")
	}

	key1 := "sk-first-secret"
	if err := store.UpdateAI("https://api.deepseek.com/v1/", "deepseek-reasoner", &key1); err != nil {
		t.Fatalf("UpdateAI 写入失败: %v", err)
	}
	if snap := store.Snapshot(); snap.AI.BaseURL != "https://api.deepseek.com/v1" || snap.AI.APIKey != "sk-first-secret" {
		t.Fatalf("UpdateAI 未正确规范化或更新: %+v", snap.AI)
	}

	// apiKey 为 nil 时保留原 Key
	if err := store.UpdateAI("https://api.openai.com/v1", "gpt-4o-mini", nil); err != nil {
		t.Fatalf("保留 Key 更新失败: %v", err)
	}
	if snap := store.Snapshot(); snap.AI.APIKey != "sk-first-secret" || snap.AI.Model != "gpt-4o-mini" {
		t.Fatalf("apiKey=nil 时未保留原密钥: %+v", snap.AI)
	}

	// 显式传空字符串清空 Key，并验证原子落盘
	empty := "   "
	if err := store.UpdateAI("https://api.openai.com/v1", "gpt-4o-mini", &empty); err != nil {
		t.Fatalf("清空 Key 失败: %v", err)
	}
	reloaded, err := LoadConfig(cfgPath, "")
	if err != nil {
		t.Fatalf("重读持久化配置失败: %v", err)
	}
	if reloaded.AI.APIKey != "" || reloaded.AI.Model != "gpt-4o-mini" {
		t.Fatalf("落盘配置与内存状态不一致: %+v", reloaded.AI)
	}
}

func TestRuntimeStoreUpdateSleepValidation(t *testing.T) {
	cfgPath := filepath.Join(t.TempDir(), "config.yaml")
	cfg, _ := LoadConfig(cfgPath, "")
	store := NewRuntimeStore(cfg, cfgPath)

	if err := store.UpdateSleep("25:00", "00:30"); err == nil {
		t.Fatal("非法时间格式应被拒绝")
	}
	if err := store.UpdateSleep("00:30", "23:30"); err == nil {
		t.Fatal("跨日归一化后轻度截止早于未熬夜截止应被拒绝")
	}
	if err := store.UpdateSleep("23:30", "23:30"); err == nil {
		t.Fatal("两个截止时间相等应被拒绝")
	}

	if err := store.UpdateSleep("23:30", "01:00"); err != nil {
		t.Fatalf("合法跨夜熬夜阈值应通过: %v", err)
	}
	if snap := store.Snapshot(); snap.Sleep.GreenBefore != "23:30" || snap.Sleep.YellowBefore != "01:00" {
		t.Fatalf("熬夜阈值未生效: %+v", snap.Sleep)
	}
}

func TestRuntimeStoreUpdateScoreBandsValidation(t *testing.T) {
	cfgPath := filepath.Join(t.TempDir(), "config.yaml")
	cfg, _ := LoadConfig(cfgPath, "")
	store := NewRuntimeStore(cfg, cfgPath)

	badCases := []struct {
		name  string
		bands []ScoreBandConfig
	}{
		{name: "empty", bands: nil},
		{name: "gap", bands: []ScoreBandConfig{{Range: []int{1, 4}, Label: "a", Tone: "rose"}, {Range: []int{6, 10}, Label: "b", Tone: "emerald"}}},
		{name: "overlap", bands: []ScoreBandConfig{{Range: []int{1, 5}, Label: "a", Tone: "rose"}, {Range: []int{5, 10}, Label: "b", Tone: "emerald"}}},
		{name: "not up to 10", bands: []ScoreBandConfig{{Range: []int{1, 9}, Label: "a", Tone: "rose"}}},
		{name: "empty label", bands: []ScoreBandConfig{{Range: []int{1, 10}, Label: "  ", Tone: "rose"}}},
		{name: "label > 20 runes", bands: []ScoreBandConfig{{Range: []int{1, 10}, Label: "超过二十个字符的评分文案长度限制测试一二三", Tone: "rose"}}},
		{name: "invalid tone", bands: []ScoreBandConfig{{Range: []int{1, 10}, Label: "ok", Tone: "neon"}}},
	}

	for _, tc := range badCases {
		t.Run(tc.name, func(t *testing.T) {
			if err := store.UpdateScoreBands(tc.bands); err == nil {
				t.Fatalf("%s 预期失败，实际成功", tc.name)
			}
		})
	}

	valid := DefaultScoreBands()
	valid[4].Label = "状态极佳"
	if err := store.UpdateScoreBands(valid); err != nil {
		t.Fatalf("合法评分分档更新失败: %v", err)
	}
	if got := store.Snapshot().Summary.ScoreBands[4].Label; got != "状态极佳" {
		t.Fatalf("评分分档更新未生效: %q", got)
	}
}
