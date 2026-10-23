package service

import (
	"strings"
	"testing"

	"golang.org/x/text/encoding/simplifiedchinese"
)

const csvHeader = "记录日期,晨起空腹体重(kg),睡前体重(kg),腰围(cm),睡眠时长(小时),就寝时间,起床时间,熬夜等级,运动标签,饮食运动与日记备注\n"

func TestParseCSVBasic(t *testing.T) {
	body := "\uFEFF" + csvHeader +
		"2026-10-01,76.9,78.2,78,7.2,01:00,08:10,RED,骑行,早上牛奶 200ml\n" +
		",,,,,,,,,\n" +
		"2026/10/3,300,78.5,,,23:30,07:00,,,\n" +
		"2026-13-01,70,,,,,,,,\n"

	got := ParseCSV([]byte(body))
	if got.Fatal != "" {
		t.Fatalf("不应整体失败: %s", got.Fatal)
	}
	if got.Encoding != "UTF-8 (BOM)" || got.Delimiter != "逗号" {
		t.Fatalf("编码/分隔符识别错误: %s %s", got.Encoding, got.Delimiter)
	}
	if len(got.Rows) != 3 {
		t.Fatalf("期望 3 行（空行跳过），实际 %d", len(got.Rows))
	}

	first := got.Rows[0]
	if first.Date != "2026-10-01" {
		t.Fatalf("日期解析错误: %s", first.Date)
	}
	if first.DTO.WeightAM == nil || *first.DTO.WeightAM != 76.9 {
		t.Fatalf("晨重解析错误: %+v", first.DTO.WeightAM)
	}
	if first.DTO.WeightPM == nil || *first.DTO.WeightPM != 78.2 {
		t.Fatalf("睡前体重解析错误")
	}
	if first.DTO.WaistSize == nil || *first.DTO.WaistSize != 78 {
		t.Fatalf("腰围解析错误")
	}
	if !first.HasActivityTags || first.ActivityTags != `["骑行"]` {
		t.Fatalf("运动标签应规范化为 JSON 数组: %+v", first)
	}
	if first.DTO.JournalText == nil || *first.DTO.JournalText != "早上牛奶 200ml" {
		t.Fatalf("日记解析错误")
	}

	third := got.Rows[1]
	if third.Date != "2026-10-03" {
		t.Fatalf("斜杠日期解析错误: %s", third.Date)
	}
	if len(third.Warnings) == 0 {
		t.Fatal("体重 300kg 应产生警告并放行")
	}
	if third.DTO.SleepHours == nil || *third.DTO.SleepHours != 7.5 {
		t.Fatalf("睡眠时长应由起止时间补算为 7.5，实际 %+v", third.DTO.SleepHours)
	}

	last := got.Rows[2]
	if len(last.Errors) == 0 {
		t.Fatal("非法日期应产生错误")
	}
}

func TestParseCSVGBKAndSemicolon(t *testing.T) {
	text := "日期;体重;腰围\n2026年10月2日;76.5;77\n"
	encoded, err := simplifiedchinese.GBK.NewEncoder().Bytes([]byte(text))
	if err != nil {
		t.Fatalf("构造 GBK 测试数据失败: %v", err)
	}

	got := ParseCSV(encoded)
	if got.Fatal != "" {
		t.Fatalf("GBK 文件不应整体失败: %s", got.Fatal)
	}
	if !strings.Contains(got.Encoding, "GB") {
		t.Fatalf("应回退识别为 GBK/GB18030，实际 %s", got.Encoding)
	}
	if got.Delimiter != "分号" {
		t.Fatalf("应识别为分号分隔，实际 %s", got.Delimiter)
	}
	if len(got.Rows) != 1 || got.Rows[0].Date != "2026-10-02" {
		t.Fatalf("GBK 行解析错误: %+v", got.Rows)
	}
	if got.Rows[0].DTO.WeightAM == nil || *got.Rows[0].DTO.WeightAM != 76.5 {
		t.Fatalf("体重列别名匹配失败")
	}
}

func TestParseCSVFatalWithoutDateColumn(t *testing.T) {
	got := ParseCSV([]byte("体重,腰围\n76.9,78\n"))
	if got.Fatal == "" {
		t.Fatal("缺少日期列时应整体拒绝")
	}
	if len(got.Rows) != 0 {
		t.Fatal("整体失败时不应产生任何行")
	}
}

func TestParseCSVClearMarkerAndDuplicateMerge(t *testing.T) {
	body := "记录日期,晨起空腹体重,腰围,就寝时间,起床时间,日记\n" +
		"2026-10-02,-,,,\n" +
		"2026-10-02,,79,01:30,08:00,睡前 78\n"

	got := ParseCSV([]byte(body))
	if got.Fatal != "" {
		t.Fatalf("不应整体失败: %s", got.Fatal)
	}
	if len(got.Rows) != 1 {
		t.Fatalf("同日两行应合并为 1 行，实际 %d", len(got.Rows))
	}
	row := got.Rows[0]
	if len(row.ClearFields) != 1 || row.ClearFields[0] != "weight_am" {
		t.Fatalf("应记录显式清空字段: %+v", row.ClearFields)
	}
	if row.DTO.WaistSize == nil || *row.DTO.WaistSize != 79 {
		t.Fatal("合并后应保留另一行的腰围")
	}
	if row.DTO.SleepHours == nil || *row.DTO.SleepHours != 6.5 {
		t.Fatalf("合并后应由起止时间计算时长 6.5，实际 %+v", row.DTO.SleepHours)
	}
}

func TestParseCSVInvalidTime(t *testing.T) {
	body := "记录日期,就寝时间,起床时间\n2026-10-02,25:00,08:00\n"
	got := ParseCSV([]byte(body))
	if len(got.Rows) != 1 || len(got.Rows[0].Errors) == 0 {
		t.Fatal("25:00 应产生必须修正的错误")
	}
}

func TestParseCSVNormalizesActivityTags(t *testing.T) {
	content := "记录日期,运动标签\n2026-10-01,有氧;无氧\n2026-10-02,\"[\"\"有氧\"\",\"\"无氧\"\"]\"\n"
	parsed := ParseCSV([]byte(content))
	if len(parsed.Rows) != 2 {
		t.Fatalf("应解析 2 行，实际 %d", len(parsed.Rows))
	}
	for _, row := range parsed.Rows {
		if row.ActivityTags != `["有氧","无氧"]` {
			t.Fatalf("运动标签应统一为 JSON 数组，实际 %q", row.ActivityTags)
		}
	}
}
