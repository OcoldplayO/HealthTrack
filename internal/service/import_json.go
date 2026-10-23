package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	"healthtrack/internal/model"
)

// ParseJSONBackup 解析 JSON 备份，兼容三种结构：
//   - v2 自描述对象：{schema_version, health_records, evening_summaries}
//   - v1 接口包裹：{code, data:[...]}
//   - v1 裸数组：[...]
//
// 照片与 AI 洞察不参与导入；无法识别的结构直接整体失败。
func ParseJSONBackup(src []byte) *ParsedFile {
	result := &ParsedFile{SourceType: "json", Encoding: "UTF-8"}

	trimmed := bytes.TrimSpace(src)
	if len(trimmed) == 0 {
		result.Fatal = "文件内容为空"
		return result
	}

	var records []*model.HealthRecord
	var summaries []*model.EveningSummary

	switch trimmed[0] {
	case '[':
		if err := json.Unmarshal(trimmed, &records); err != nil {
			result.Fatal = "备份数组无法解析：" + err.Error()
			return result
		}
	case '{':
		var probe map[string]json.RawMessage
		if err := json.Unmarshal(trimmed, &probe); err != nil {
			result.Fatal = "JSON 格式错误：" + err.Error()
			return result
		}
		_, hasRecords := probe["health_records"]
		_, hasSchema := probe["schema_version"]
		switch {
		case hasRecords || hasSchema:
			var backup model.BackupFile
			if err := json.Unmarshal(trimmed, &backup); err != nil {
				result.Fatal = "备份文件无法解析：" + err.Error()
				return result
			}
			records = backup.HealthRecords
			summaries = backup.EveningSummaries
		case probe["data"] != nil:
			if err := json.Unmarshal(probe["data"], &records); err != nil {
				result.Fatal = "旧版备份的 data 字段不是记录数组"
				return result
			}
		default:
			result.Fatal = "未识别的 JSON 结构，请使用本应用导出的备份文件"
			return result
		}
	default:
		result.Fatal = "不是有效的 JSON 文件"
		return result
	}

	for i, rec := range records {
		result.Rows = append(result.Rows, buildJSONRow(rec, i))
	}
	result.Rows = mergeParsedRowsByDate(result.Rows)
	result.Summaries = buildJSONSummaries(summaries)

	if len(result.Rows) == 0 && len(result.Summaries) == 0 {
		result.Fatal = "备份中没有可导入的数据"
	}
	return result
}

// buildJSONRow 把导出的健康记录还原为可落库的一行，校验口径与 CSV 导入一致。
func buildJSONRow(rec *model.HealthRecord, index int) ParsedRow {
	row := ParsedRow{Line: index + 1, Raw: fmt.Sprintf("第 %d 条记录", index+1)}
	b := &rowBuilder{row: &row}

	if rec == nil {
		b.addError("_row", "记录为空")
		return row
	}

	rawDate := strings.TrimSpace(rec.RecordDate)
	if rawDate == "" {
		b.addError("date", "记录日期为空")
	} else if normalized, err := normalizeDate(rawDate); err != nil {
		b.addError("date", err.Error())
	} else {
		row.Date = normalized
		row.DTO.RecordDate = normalized
	}

	row.DTO.WeightAM = jsonNumber(b, "weight_am", rec.WeightAM, 30, 250)
	row.DTO.WeightPM = jsonNumber(b, "weight_pm", rec.WeightPM, 30, 250)
	row.DTO.WaistSize = jsonNumber(b, "waist_size", rec.WaistSize, 30, 200)
	row.DTO.SleepHours = jsonNumber(b, "sleep_hours", rec.SleepHours, 0, 24)
	row.DTO.SleepStartTime = jsonClock(b, "sleep_start_time", rec.SleepStartTime)
	row.DTO.SleepEndTime = jsonClock(b, "sleep_end_time", rec.SleepEndTime)

	if journal := strings.TrimSpace(rec.JournalText); journal != "" {
		if len([]rune(journal)) > 2000 {
			b.addError("journal_text", "日记文本超过 2000 字，请拆分后再导入")
		} else {
			row.DTO.JournalText = &journal
		}
	}

	if tags := strings.TrimSpace(rec.ActivityTags); tags != "" {
		row.ActivityTags = tags
		row.HasActivityTags = true
	}

	// 结构化扩展字段随 JSON 备份原样恢复；CSV / 备忘录不含这些字段。
	row.DTO.Exercise = rec.Exercise
	if row.DTO.Exercise != nil {
		row.DTO.Exercise.SyncLegacyType()
	}
	row.DTO.ColdShower = rec.ColdShower
	row.DTO.Concerta = rec.Concerta

	if row.DTO.SleepStartTime != nil && row.DTO.SleepEndTime != nil && row.DTO.SleepHours == nil {
		if hours, ok := sleepHoursBetween(*row.DTO.SleepStartTime, *row.DTO.SleepEndTime); ok {
			row.DTO.SleepHours = &hours
		} else {
			b.addWarning("sleep_hours", "起止时间无法计算睡眠时长")
		}
	}

	if row.DTO.WeightAM == nil && row.DTO.WeightPM == nil && row.DTO.WaistSize == nil &&
		row.DTO.SleepHours == nil && row.DTO.SleepStartTime == nil && row.DTO.SleepEndTime == nil &&
		row.DTO.JournalText == nil && !row.HasActivityTags && len(row.ClearFields) == 0 {
		b.addError("_row", "整行无有效字段，已跳过")
	}

	fillIssueDate(&row)
	return row
}

// buildJSONSummaries 还原睡前小结，并合并同日期重复项（后出现的覆盖先出现的）。
func buildJSONSummaries(items []*model.EveningSummary) []ParsedSummary {
	byDate := make(map[string]int)
	result := make([]ParsedSummary, 0, len(items))

	for i, item := range items {
		s := buildJSONSummary(item, i)
		if s.Date == "" {
			result = append(result, s)
			continue
		}
		if idx, exists := byDate[s.Date]; exists {
			result[idx] = s
			continue
		}
		byDate[s.Date] = len(result)
		result = append(result, s)
	}
	return result
}

func buildJSONSummary(item *model.EveningSummary, index int) ParsedSummary {
	s := ParsedSummary{DoneItems: []string{}, Raw: fmt.Sprintf("第 %d 篇小结", index+1)}
	line := index + 1
	addError := func(field, msg string) {
		s.Errors = append(s.Errors, model.ImportRowIssue{
			Line: line, Date: s.Date, Level: "error", Field: field,
			Message: "睡前小结：" + msg, Raw: fmt.Sprintf("第 %d 篇小结", index+1),
		})
	}
	addWarning := func(field, msg string) {
		s.Warnings = append(s.Warnings, model.ImportRowIssue{
			Line: line, Date: s.Date, Level: "warning", Field: field,
			Message: "睡前小结：" + msg, Raw: fmt.Sprintf("第 %d 篇小结", index+1),
		})
	}

	if item == nil {
		addError("_row", "内容为空")
		return s
	}

	rawDate := strings.TrimSpace(item.RecordDate)
	if rawDate == "" {
		addError("date", "日期为空")
	} else if normalized, err := normalizeDate(rawDate); err != nil {
		addError("date", err.Error())
	} else {
		s.Date = normalized
	}

	for _, it := range item.DoneItems {
		v := strings.TrimSpace(it)
		if v == "" {
			continue
		}
		if len([]rune(v)) > 200 {
			addError("done_items", "单条完成事项超过 200 字")
			continue
		}
		s.DoneItems = append(s.DoneItems, v)
	}
	if len(s.DoneItems) > 3 {
		s.DoneItems = s.DoneItems[:3]
		addWarning("done_items", "完成事项超过 3 条，仅保留前 3 条")
	}

	note := strings.TrimSpace(item.NoteText)
	if len([]rune(note)) > 2000 {
		addError("note_text", "感想超过 2000 字")
	} else {
		s.NoteText = note
	}

	if item.Score < 1 || item.Score > 10 {
		addError("score", fmt.Sprintf("自评分数 %d 需在 1~10 之间", item.Score))
	} else {
		s.Score = item.Score
	}

	return s
}

// jsonNumber 校验 JSON 数值字段：空值不修改，越界只警告（与 CSV 口径一致）。
func jsonNumber(b *rowBuilder, field string, v *float64, min, max float64) *float64 {
	if v == nil {
		return nil
	}
	if *v < min || *v > max {
		b.addWarning(field, fmt.Sprintf("数值 %.1f 超出合理范围 %.0f~%.0f，已放行，请自行核对", *v, min, max))
	}
	return v
}

// jsonClock 校验并规范化时间字段，格式非法视为必须修正的错误。
func jsonClock(b *rowBuilder, field string, v *string) *string {
	if v == nil || strings.TrimSpace(*v) == "" {
		return nil
	}
	normalized, ok := normalizeClock(*v)
	if !ok {
		b.addError(field, fmt.Sprintf("%q 不是有效时间，需为 HH:mm", *v))
		return nil
	}
	return &normalized
}

// fillIssueDate 日期确认后统一补齐行级问题的日期，便于前端按天定位。
func fillIssueDate(row *ParsedRow) {
	for i := range row.Warnings {
		if row.Warnings[i].Date == "" {
			row.Warnings[i].Date = row.Date
		}
	}
	for i := range row.Errors {
		if row.Errors[i].Date == "" {
			row.Errors[i].Date = row.Date
		}
	}
}
