package repository

import (
	"path/filepath"
	"testing"

	"healthtrack/internal/model"
)

func TestSaveOrMergeTransactionalMergeClearAndGetRange(t *testing.T) {
	dir := t.TempDir()
	mgr, err := InitDB(filepath.Join(dir, "health.db"), filepath.Join(dir, "backup"))
	if err != nil {
		t.Fatalf("初始化测试数据库失败: %v", err)
	}
	t.Cleanup(func() { _ = mgr.Close() })

	repo := NewRecordRepository(mgr.DB)
	wAM := 72.4
	wPM := 73.1
	steps := 8600
	light := true
	sleepStart := "23:15"
	sleepEnd := "07:05"
	sleepHours := 7.8

	first, err := repo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate:     "2026-11-19",
		WeightAM:       &wAM,
		WeightPM:       &wPM,
		SleepStartTime: &sleepStart,
		SleepEndTime:   &sleepEnd,
		SleepHours:     &sleepHours,
		Steps:          &steps,
		MorningLight:   &light,
		Exercise: &model.ExerciseDetail{
			Types:     []string{"cardio", "strength"},
			Duration:  45,
			Intensity: "medium",
		},
		Lunch: &model.LunchDetail{
			Eaten:   "eaten",
			Protein: []string{"chicken"},
		},
	}, "GREEN", `["有氧","无氧"]`)
	if err != nil {
		t.Fatalf("首次保存失败: %v", err)
	}
	if first == nil || first.WeightAM == nil || *first.WeightAM != 72.4 {
		t.Fatalf("首次写入结果异常: %+v", first)
	}
	if first.Steps == nil || *first.Steps != 8600 || first.MorningLight == nil || !*first.MorningLight {
		t.Fatalf("步数或晨光字段写入异常: %+v", first)
	}
	if first.Exercise == nil || first.Exercise.Type != "cardio" {
		t.Fatalf("运动兼容字段未同步: %+v", first.Exercise)
	}

	// 二次增量更新：仅改睡前体重，留空晨光/步数/午餐，应保留旧晨重/睡眠/运动并清空晨光/步数/午餐
	wPM2 := 72.8
	merged, err := repo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-11-19",
		WeightPM:   &wPM2,
	}, "", "")
	if err != nil {
		t.Fatalf("增量合并失败: %v", err)
	}
	if merged.WeightAM == nil || *merged.WeightAM != 72.4 {
		t.Fatalf("增量合并应保留原晨重，实际: %+v", merged.WeightAM)
	}
	if merged.WeightPM == nil || *merged.WeightPM != 72.8 {
		t.Fatalf("增量合并应更新睡前重，实际: %+v", merged.WeightPM)
	}
	if merged.SleepTag != "GREEN" || merged.Exercise == nil || merged.Exercise.Duration != 45 {
		t.Fatalf("增量合并应保留睡眠与运动扩展字段: %+v", merged)
	}
	if merged.Steps != nil || merged.MorningLight != nil || merged.Lunch != nil {
		t.Fatalf("提交 nil 的步数/晨光/午餐应被清空，实际 steps=%v light=%v lunch=%v", merged.Steps, merged.MorningLight, merged.Lunch)
	}

	// 另存一条记录并验证 GetRange 与 GetByDate 扫描一致性
	wAM2 := 71.9
	if _, err := repo.SaveOrMerge(1, &model.SaveRecordDTO{
		RecordDate: "2026-11-20",
		WeightAM:   &wAM2,
	}, "YELLOW", ""); err != nil {
		t.Fatalf("写入第二条记录失败: %v", err)
	}

	list, err := repo.GetRange(1, "2026-11-19", "2026-11-20")
	if err != nil {
		t.Fatalf("GetRange 查询失败: %v", err)
	}
	if len(list) != 2 || list[0].RecordDate != "2026-11-19" || list[1].RecordDate != "2026-11-20" {
		t.Fatalf("GetRange 返回数量或顺序错误: %+v", list)
	}
	if list[0].WeightAM == nil || *list[0].WeightAM != 72.4 || list[1].SleepTag != "YELLOW" {
		t.Fatalf("GetRange 扫描字段不一致: %+v / %+v", list[0], list[1])
	}

	missing, err := repo.GetByDate(1, "2026-01-01")
	if err != nil || missing != nil {
		t.Fatalf("不存在日期应返回 nil, nil，实际 rec=%+v err=%v", missing, err)
	}
}
