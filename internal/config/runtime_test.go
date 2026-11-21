package config

import (
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
