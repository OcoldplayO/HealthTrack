package service

import (
	"strings"
	"testing"

	"healthtrack/internal/model"
)

func floatPtr(v float64) *float64 { return &v }
func intPtr(v int) *int           { return &v }
func boolPtr(v bool) *bool        { return &v }
func strPtr(v string) *string     { return &v }

func TestBuildPromptContextHandlesMissingBoundaryWeightsAndExtendedFeatures(t *testing.T) {
	svc := NewInsightService(nil)
	records := []*model.HealthRecord{
		{
			// 首日没有晨重（仅睡前体重/日记），不应被当成 0.0 kg 计算净体重差
			RecordDate:   "2026-11-01",
			WeightPM:     floatPtr(73.2),
			SleepTag:     "GREEN",
			MorningLight: boolPtr(true),
			Steps:        intPtr(8500),
		},
		{
			RecordDate:     "2026-11-02",
			WeightAM:       floatPtr(72.0),
			WeightPM:       floatPtr(72.6),
			WaistSize:      floatPtr(80.5),
			SleepStartTime: strPtr("23:10"),
			SleepHours:     floatPtr(7.5),
			SleepTag:       "GREEN",
			MorningLight:   boolPtr(false),
			Steps:          intPtr(10500),
			Lunch: &model.LunchDetail{
				Eaten:    "eaten",
				Protein:  []string{"chicken", "egg"},
				ProteinG: 25,
				Staple:   "grains",
				CarbG:    "20_35",
				Cooking:  "steam",
			},
			Exercise: &model.ExerciseDetail{
				Types:     []string{"strength"},
				Duration:  45,
				Intensity: "failure",
			},
		},
		{
			// 断记 4 天后再次记录
			RecordDate: "2026-11-06",
			WeightAM:   floatPtr(71.4),
			WaistSize:  floatPtr(79.8),
			SleepHours: floatPtr(6.5),
			SleepTag:   "YELLOW",
			Concerta: &model.ConcertaDetail{
				Taken:     true,
				Time:      "08:00",
				Dose:      36,
				FocusWork: 4,
				CrashTime: "17:30",
			},
		},
		{
			// 末日同样没有晨重
			RecordDate: "2026-11-07",
			SleepTag:   "RED",
			Lunch:      &model.LunchDetail{Eaten: "skipped"},
		},
	}

	ctx := svc.BuildPromptContext(records)

	// 1. 严禁因首尾缺失晨重算出 0.0 -> -72.0 kg 的失真净体重差
	if strings.Contains(ctx, "-72.0") || strings.Contains(ctx, "+72.0") || strings.Contains(ctx, "起始: 0.0") {
		t.Fatalf("首尾缺失晨重时出现失真净体重差:\n%s", ctx)
	}
	if !strings.Contains(ctx, "-0.6 kg (首条有效晨重 72.0 kg -> 末条有效晨重 71.4 kg)") {
		t.Fatalf("净体重差应按首尾有效晨重计算 (-0.6 kg):\n%s", ctx)
	}

	// 2. 宏观大盘与流水应包含腰围、步数、晨光与午餐
	checks := []string{
		"期间腰围变化: -0.7 cm (80.5 cm -> 79.8 cm, 有效 2 天)",
		"步数 日均 9500 步 (已记录 2 天)",
		"晨光 是 1 天 / 共记 2 天",
		"较4日前:-0.6kg",
		"腰围:80.5cm",
		"步数:8500",
		"晨光:是",
		"午餐:鸡胸/蛋·约25g蛋白·杂粮·碳水20-35g·蒸煮",
		"午餐:跳过",
		"Crash:17:30",
	}
	for _, want := range checks {
		if !strings.Contains(ctx, want) {
			t.Fatalf("Prompt 上下文缺少关键特征 %q:\n%s", want, ctx)
		}
	}
}
