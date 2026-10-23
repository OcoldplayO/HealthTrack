package service

import (
	"strings"
	"testing"
	"time"
)

const memoSample = `10.2：晨起体重 76.9，腰围 78。早上一瓶牛奶🥛200ml。米饭 300g，炒豆豉 50g，炒牛肉 100g，牛肉饼🫓 60g，莲藕 100g。下午柚子 300g。晚餐米饭 200g，炒牛肉+牛肉 150g，炒小瓜 100g，莲藕 100g，睡前 78
10.3：1-810（睡的还行但不足）
10.4：130-8
10.5：1230-750`

func TestParseMemoSample(t *testing.T) {
	got := ParseMemo(memoSample, 0)
	if got.Fatal != "" {
		t.Fatalf("不应整体失败: %s", got.Fatal)
	}
	if len(got.Rows) != 4 {
		t.Fatalf("期望 4 天，实际 %d", len(got.Rows))
	}

	day1 := got.Rows[0]
	if !strings.HasSuffix(day1.Date, "-10-02") {
		t.Fatalf("日期推断错误: %s", day1.Date)
	}
	if day1.DTO.WeightAM == nil || *day1.DTO.WeightAM != 76.9 {
		t.Fatalf("晨重应为 76.9，实际 %+v", day1.DTO.WeightAM)
	}
	if day1.DTO.WeightPM == nil || *day1.DTO.WeightPM != 78 {
		t.Fatalf("睡前体重应为 78，实际 %+v", day1.DTO.WeightPM)
	}
	if day1.DTO.WaistSize == nil || *day1.DTO.WaistSize != 78 {
		t.Fatalf("腰围应为 78，实际 %+v", day1.DTO.WaistSize)
	}
	if day1.DTO.JournalText == nil || *day1.DTO.JournalText == "" {
		t.Fatal("食物清单应保留到日记")
	}
	if !strings.Contains(*day1.DTO.JournalText, "睡前 78") {
		t.Fatal("日记应保留原文，不能丢信息")
	}

	day2 := got.Rows[1]
	if day2.DTO.SleepStartTime == nil || *day2.DTO.SleepStartTime != "01:00" {
		t.Fatalf("1-810 应解析为 01:00，实际 %+v", day2.DTO.SleepStartTime)
	}
	if day2.DTO.SleepEndTime == nil || *day2.DTO.SleepEndTime != "08:10" {
		t.Fatalf("1-810 应解析为 08:10，实际 %+v", day2.DTO.SleepEndTime)
	}
	if day2.DTO.SleepHours == nil || *day2.DTO.SleepHours != 7.2 {
		t.Fatalf("睡眠时长应为 7.2，实际 %+v", day2.DTO.SleepHours)
	}
	if day2.DTO.JournalText == nil || *day2.DTO.JournalText != "睡的还行但不足" {
		t.Fatalf("备注应保留且去掉时间与括号，实际 %+v", day2.DTO.JournalText)
	}

	day3 := got.Rows[2]
	if day3.DTO.SleepStartTime == nil || *day3.DTO.SleepStartTime != "01:30" {
		t.Fatalf("130-8 应解析为 01:30，实际 %+v", day3.DTO.SleepStartTime)
	}
	if day3.DTO.SleepEndTime == nil || *day3.DTO.SleepEndTime != "08:00" {
		t.Fatalf("130-8 应解析为 08:00，实际 %+v", day3.DTO.SleepEndTime)
	}
	if day3.DTO.SleepHours == nil || *day3.DTO.SleepHours != 6.5 {
		t.Fatalf("睡眠时长应为 6.5，实际 %+v", day3.DTO.SleepHours)
	}

	day4 := got.Rows[3]
	if day4.DTO.SleepStartTime == nil || *day4.DTO.SleepStartTime != "00:30" {
		t.Fatalf("1230-750 应把 12 点归零为 00:30，实际 %+v", day4.DTO.SleepStartTime)
	}
	if day4.DTO.SleepEndTime == nil || *day4.DTO.SleepEndTime != "07:50" {
		t.Fatalf("1230-750 应解析为 07:50，实际 %+v", day4.DTO.SleepEndTime)
	}
	if day4.DTO.SleepHours == nil || *day4.DTO.SleepHours != 7.3 {
		t.Fatalf("睡眠时长应为 7.3，实际 %+v", day4.DTO.SleepHours)
	}
}

func TestParseMemoAutoYearAndKeyword(t *testing.T) {
	got := ParseMemo("12.31：睡眠 23-730", 0)
	if got.Fatal != "" {
		t.Fatalf("不应整体失败: %s", got.Fatal)
	}
	row := got.Rows[0]
	if year, _, _ := parseDateParts(row.Date); year >= time.Now().Year() {
		t.Fatalf("落在未来的日期应归上一年，实际 %s", row.Date)
	}
	if row.DTO.SleepStartTime == nil || *row.DTO.SleepStartTime != "23:00" {
		t.Fatalf("睡眠关键词区间解析错误: %+v", row.DTO.SleepStartTime)
	}
	if row.DTO.SleepHours == nil || *row.DTO.SleepHours != 8.5 {
		t.Fatalf("23-730 应为 8.5 小时，实际 %+v", row.DTO.SleepHours)
	}
}

func TestParseMemoExplicitYear(t *testing.T) {
	got := ParseMemo("10.2：晨起体重 76.9", 2025)
	if got.Fatal != "" {
		t.Fatalf("不应整体失败: %s", got.Fatal)
	}
	if got.Rows[0].Date != "2025-10-02" {
		t.Fatalf("年份基准应生效，实际 %s", got.Rows[0].Date)
	}
}

func TestParseMemoInvalidLine(t *testing.T) {
	got := ParseMemo("今天感觉不错\n10.2：体重 76.9", 2026)
	if len(got.Rows) != 2 {
		t.Fatalf("无日期行应保留为错误行，实际 %d", len(got.Rows))
	}
	if len(got.Rows[0].Errors) == 0 {
		t.Fatal("无日期行应产生错误")
	}
	if got.Rows[1].Date != "2026-10-02" {
		t.Fatalf("有效行仍应解析: %+v", got.Rows[1])
	}
}

func parseDateParts(s string) (int, int, int) {
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return 0, 0, 0
	}
	return t.Year(), int(t.Month()), t.Day()
}
