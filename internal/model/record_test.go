package model

import (
	"strings"
	"testing"
)

func TestParseSleepTimeMinutes(t *testing.T) {
	cases := []struct {
		in     string
		want   int
		wantOK bool
	}{
		{in: "23:00", want: 23 * 60, wantOK: true},
		{in: " 22:45 ", want: 22*60 + 45, wantOK: true},
		{in: "00:00", want: 24 * 60, wantOK: true},
		{in: "01:30", want: 25*60 + 30, wantOK: true},
		{in: "06:00", want: 30 * 60, wantOK: true},
		{in: "07:00", want: 7 * 60, wantOK: true},
		{in: "21:59", want: 21*60 + 59, wantOK: true},
		{in: "", want: 0, wantOK: false},
		{in: "24:00", want: 0, wantOK: false},
		{in: "-1:10", want: 0, wantOK: false},
		{in: "23:60", want: 0, wantOK: false},
		{in: "abc", want: 0, wantOK: false},
		{in: "23-00", want: 0, wantOK: false},
	}

	for _, tc := range cases {
		got, ok := ParseSleepTimeMinutes(tc.in)
		if ok != tc.wantOK || got != tc.want {
			t.Fatalf("ParseSleepTimeMinutes(%q) = (%d, %v), want (%d, %v)", tc.in, got, ok, tc.want, tc.wantOK)
		}
	}
}

func TestCalculateSleepTagWithThresholds(t *testing.T) {
	// 自定义跨夜阈值：23:30 前为 GREEN，[23:30, 01:00) 为 YELLOW，>= 01:00 为 RED
	cases := []struct {
		sleep  string
		green  string
		yellow string
		want   string
	}{
		{sleep: "22:59", green: "23:30", yellow: "01:00", want: "GREEN"},
		{sleep: "23:29", green: "23:30", yellow: "01:00", want: "GREEN"},
		{sleep: "23:30", green: "23:30", yellow: "01:00", want: "YELLOW"},
		{sleep: "00:30", green: "23:30", yellow: "01:00", want: "YELLOW"},
		{sleep: "01:00", green: "23:30", yellow: "01:00", want: "RED"},
		{sleep: "03:15", green: "23:30", yellow: "01:00", want: "RED"},
		// 非法阈值回退默认 (23:00 / 00:00)
		{sleep: "22:50", green: "invalid", yellow: "invalid", want: "GREEN"},
		{sleep: "23:15", green: "invalid", yellow: "invalid", want: "YELLOW"},
		{sleep: "00:10", green: "invalid", yellow: "invalid", want: "RED"},
		// 非法入睡时间兜底 GREEN
		{sleep: "bad", green: "23:30", yellow: "01:00", want: "GREEN"},
	}

	for _, tc := range cases {
		got := CalculateSleepTagWithThresholds(tc.sleep, tc.green, tc.yellow)
		if got != tc.want {
			t.Fatalf("CalculateSleepTagWithThresholds(%q, %q, %q) = %q, want %q",
				tc.sleep, tc.green, tc.yellow, got, tc.want)
		}
	}
}

func TestExerciseDetailNormalizeAndSync(t *testing.T) {
	var nilEx *ExerciseDetail
	if got := nilEx.NormalizeTypes(); got != nil {
		t.Fatalf("nil NormalizeTypes 应返回 nil，实际 %v", got)
	}
	nilEx.SyncLegacyType() // 不应 panic

	// 旧单值 Type 回退
	legacy := &ExerciseDetail{Type: "strength"}
	if got := legacy.NormalizeTypes(); len(got) != 1 || got[0] != "strength" {
		t.Fatalf("旧字段回退错误: %v", got)
	}

	// 去重并剔除 none/空串，同时同步兼容字段 Type
	multi := &ExerciseDetail{
		Types: []string{"none", "cardio", "", "strength", "cardio"},
		Type:  "none",
	}
	multi.SyncLegacyType()
	if len(multi.Types) != 2 || multi.Types[0] != "cardio" || multi.Types[1] != "strength" || multi.Type != "cardio" {
		t.Fatalf("SyncLegacyType 多选同步异常: %+v", multi)
	}

	// 无有效运动类型时兼容字段重置为 none
	empty := &ExerciseDetail{Types: []string{"none", ""}}
	empty.SyncLegacyType()
	if len(empty.Types) != 0 || empty.Type != "none" {
		t.Fatalf("空运动同步异常: %+v", empty)
	}
}

func TestSaveRecordDTOValidate(t *testing.T) {
	fPtr := func(v float64) *float64 { return &v }
	iPtr := func(v int) *int { return &v }
	sPtr := func(v string) *string { return &v }

	valid := SaveRecordDTO{
		RecordDate:  "2026-11-21",
		WeightAM:    fPtr(72.5),
		WeightPM:    fPtr(73.2),
		WaistSize:   fPtr(80.0),
		SleepHours:  fPtr(7.5),
		JournalText: sPtr("状态良好"),
		Steps:       iPtr(8500),
		ColdShower:  &ColdShowerDetail{Enabled: true, WaterTemp: fPtr(18.5)},
	}
	if err := valid.Validate(); err != nil {
		t.Fatalf("合法载荷校验不应失败: %v", err)
	}

	cases := []struct {
		name string
		dto  SaveRecordDTO
	}{
		{name: "empty date", dto: SaveRecordDTO{}},
		{name: "bad date format", dto: SaveRecordDTO{RecordDate: "2026/11/21"}},
		{name: "weight_am too low", dto: SaveRecordDTO{RecordDate: "2026-11-21", WeightAM: fPtr(29.9)}},
		{name: "weight_pm too high", dto: SaveRecordDTO{RecordDate: "2026-11-21", WeightPM: fPtr(250.1)}},
		{name: "waist out of range", dto: SaveRecordDTO{RecordDate: "2026-11-21", WaistSize: fPtr(201)}},
		{name: "sleep_hours negative", dto: SaveRecordDTO{RecordDate: "2026-11-21", SleepHours: fPtr(-0.5)}},
		{name: "sleep_hours > 24", dto: SaveRecordDTO{RecordDate: "2026-11-21", SleepHours: fPtr(24.1)}},
		{name: "journal > 2000 runes", dto: SaveRecordDTO{RecordDate: "2026-11-21", JournalText: sPtr(strings.Repeat("字", 2001))}},
		{name: "cold shower temp > 40", dto: SaveRecordDTO{RecordDate: "2026-11-21", ColdShower: &ColdShowerDetail{WaterTemp: fPtr(40.1)}}},
		{name: "steps < 0", dto: SaveRecordDTO{RecordDate: "2026-11-21", Steps: iPtr(-1)}},
		{name: "steps > 30000", dto: SaveRecordDTO{RecordDate: "2026-11-21", Steps: iPtr(30001)}},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if err := tc.dto.Validate(); err == nil {
				t.Fatalf("%s 预期返回校验错误，实际 nil", tc.name)
			}
		})
	}
}
