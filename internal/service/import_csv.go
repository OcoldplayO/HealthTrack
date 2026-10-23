package service

import (
	"encoding/csv"
	"io"
	"regexp"
	"strings"

	"healthtrack/internal/model"
)

// CSV 表头别名：按名称匹配而非列顺序，导出模板改动顺序也不影响导入。
var csvHeaderAliases = map[string][]string{
	"date":          {"记录日期", "日期", "date", "record_date", "recorddate"},
	"weight_am":     {"晨起空腹体重", "晨起体重", "晨重", "体重", "weight_am", "weightam"},
	"weight_pm":     {"睡前体重", "睡前", "weight_pm", "weightpm"},
	"waist":         {"腰围", "waist", "waistsize"},
	"sleep_hours":   {"睡眠时长", "睡眠小时", "sleep_hours", "sleephours"},
	"sleep_start":   {"就寝时间", "入睡时间", "就寝", "入睡", "sleep_start_time", "sleepbedtime"},
	"sleep_end":     {"起床时间", "醒来时间", "起床", "醒来", "sleep_end_time", "sleepwaketime"},
	"sleep_tag":     {"熬夜等级", "sleep_tag"},
	"activity_tags": {"运动标签", "activity_tags"},
	"journal":       {"饮食运动与日记备注", "日记备注", "日记", "备注", "journal_text", "饮食运动"},
}

var headerAliasToField = map[string]string{}

func init() {
	for field, aliases := range csvHeaderAliases {
		for _, alias := range aliases {
			headerAliasToField[normalizeHeader(alias)] = field
		}
	}
}

var headerParenPattern = regexp.MustCompile(`[（(][^）)]*[）)]`)

// normalizeHeader 去掉空格、括号内的单位说明、大小写与常见分隔符，便于别名匹配。
func normalizeHeader(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, " ", "")
	s = strings.ReplaceAll(s, "　", "")
	s = strings.ToLower(s)
	s = headerParenPattern.ReplaceAllString(s, "")
	s = strings.NewReplacer("kg", "", "cm", "", "小时", "", "_", "", "-", "").Replace(s)
	return s
}

type csvColumns struct {
	date, weightAM, weightPM, waist, sleepHours, sleepStart, sleepEnd int
	activityTags, journal                                             int
}

func newCSVColumns() csvColumns {
	return csvColumns{-1, -1, -1, -1, -1, -1, -1, -1, -1}
}

func (c *csvColumns) bind(headerIndex int, header string) {
	field, ok := headerAliasToField[normalizeHeader(header)]
	if !ok {
		return
	}
	switch field {
	case "date":
		c.date = headerIndex
	case "weight_am":
		c.weightAM = headerIndex
	case "weight_pm":
		c.weightPM = headerIndex
	case "waist":
		c.waist = headerIndex
	case "sleep_hours":
		c.sleepHours = headerIndex
	case "sleep_start":
		c.sleepStart = headerIndex
	case "sleep_end":
		c.sleepEnd = headerIndex
	case "activity_tags":
		c.activityTags = headerIndex
	case "journal":
		c.journal = headerIndex
	}
}

func (c *csvColumns) hasDataColumn() bool {
	return c.weightAM >= 0 || c.weightPM >= 0 || c.waist >= 0 || c.sleepHours >= 0 ||
		c.sleepStart >= 0 || c.sleepEnd >= 0 || c.journal >= 0 || c.activityTags >= 0
}

func cell(record []string, index int) string {
	if index < 0 || index >= len(record) {
		return ""
	}
	return strings.TrimSpace(record[index])
}

// ParseCSV 解析 CSV：内容嗅探编码 → 分隔符投票 → 表头按名称映射 → 逐行校验。
// 无法整体识别时返回带 Fatal 的结果，不产生任何行。
func ParseCSV(src []byte) *ParsedFile {
	result := &ParsedFile{SourceType: "csv"}

	text, encoding, err := decodeText(src)
	if err != nil {
		result.Fatal = err.Error()
		return result
	}
	result.Encoding = encoding

	firstLine := text
	if idx := strings.IndexAny(firstLine, "\r\n"); idx >= 0 {
		firstLine = firstLine[:idx]
	}
	delimiter, delimiterLabel := detectDelimiter(firstLine)
	result.Delimiter = delimiterLabel

	reader := csv.NewReader(strings.NewReader(text))
	reader.Comma = delimiter
	reader.FieldsPerRecord = -1
	reader.LazyQuotes = true
	reader.TrimLeadingSpace = true

	header, err := reader.Read()
	if err == io.EOF {
		result.Fatal = "文件内容为空"
		return result
	}
	if err != nil {
		result.Fatal = "表头无法解析，请确认文件为标准的 CSV 格式"
		return result
	}

	columns := newCSVColumns()
	for i, name := range header {
		columns.bind(i, name)
	}
	if columns.date < 0 {
		result.Fatal = "未找到「记录日期」列，请确认表头或下载导入模板"
		return result
	}
	if !columns.hasDataColumn() {
		result.Fatal = "除日期外未识别到任何数据列，请确认表头或下载导入模板"
		return result
	}

	recordNo := 1 // 表头占第 1 行
	for {
		record, readErr := reader.Read()
		if readErr == io.EOF {
			break
		}
		recordNo++
		if readErr != nil {
			result.Rows = append(result.Rows, ParsedRow{
				Line: recordNo,
				Errors: []model.ImportRowIssue{{
					Line: recordNo, Level: "error", Message: "该行格式错误，请检查引号或分隔符",
				}},
				Raw: truncateRunes(readErr.Error(), 200),
			})
			continue
		}

		if isBlankRecord(record) {
			continue
		}

		result.Rows = append(result.Rows, parseCSVRecord(record, recordNo, &columns))
	}

	if len(result.Rows) == 0 {
		result.Fatal = "文件中没有可导入的数据行"
		return result
	}

	result.Rows = mergeParsedRowsByDate(result.Rows)
	return result
}

func isBlankRecord(record []string) bool {
	for _, c := range record {
		if strings.TrimSpace(c) != "" {
			return false
		}
	}
	return true
}

func parseCSVRecord(record []string, line int, columns *csvColumns) ParsedRow {
	row := ParsedRow{
		Line: line,
		Raw:  truncateRunes(strings.Join(record, ","), 200),
	}
	b := &rowBuilder{row: &row}

	rawDate := cell(record, columns.date)
	if rawDate == "" {
		b.addError("date", "记录日期为空")
	} else if normalized, err := normalizeDate(rawDate); err != nil {
		b.addError("date", err.Error())
	} else {
		row.Date = normalized
		row.DTO.RecordDate = normalized
		// 行级问题在日期确定后补上日期，方便前端按天定位。
		for i := range row.Errors {
			row.Errors[i].Date = normalized
		}
	}

	row.DTO.WeightAM = b.number("weight_am", cell(record, columns.weightAM), 30, 250)
	row.DTO.WeightPM = b.number("weight_pm", cell(record, columns.weightPM), 30, 250)
	row.DTO.WaistSize = b.number("waist", cell(record, columns.waist), 30, 200)
	row.DTO.SleepHours = b.number("sleep_hours", cell(record, columns.sleepHours), 0, 24)
	row.DTO.SleepStartTime = b.clock("sleep_start_time", cell(record, columns.sleepStart))
	row.DTO.SleepEndTime = b.clock("sleep_end_time", cell(record, columns.sleepEnd))

	journalRaw := cell(record, columns.journal)
	row.DTO.JournalText = b.text("journal_text", journalRaw)
	if row.DTO.JournalText != nil && len([]rune(*row.DTO.JournalText)) > 2000 {
		b.addError("journal_text", "日记文本超过 2000 字，请拆分后再导入")
		row.DTO.JournalText = nil
	}

	tagsRaw := cell(record, columns.activityTags)
	if tagsRaw != "" {
		if isClearMarker(tagsRaw) {
			b.clear("activity_tags")
		} else {
			row.ActivityTags = tagsRaw
			row.HasActivityTags = true
		}
	}

	// 睡眠时长缺失时由起止时间补算；只有一端时提示无法计算。
	if row.DTO.SleepStartTime != nil && row.DTO.SleepEndTime != nil {
		if row.DTO.SleepHours == nil {
			if hours, ok := sleepHoursBetween(*row.DTO.SleepStartTime, *row.DTO.SleepEndTime); ok {
				row.DTO.SleepHours = &hours
			} else {
				b.addWarning("sleep_hours", "起止时间无法计算睡眠时长")
			}
		}
	} else if (row.DTO.SleepStartTime != nil) != (row.DTO.SleepEndTime != nil) {
		b.addWarning("sleep_hours", "只填写了就寝或起床时间，无法计算睡眠时长")
	}

	if row.DTO.WeightAM == nil && row.DTO.WeightPM == nil && row.DTO.WaistSize == nil &&
		row.DTO.SleepHours == nil && row.DTO.SleepStartTime == nil && row.DTO.SleepEndTime == nil &&
		row.DTO.JournalText == nil && !row.HasActivityTags && len(row.ClearFields) == 0 {
		b.addError("_row", "整行无有效字段，已跳过")
	}

	// 日期确认后再补一遍，覆盖数值字段产生的 warning。
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
	return row
}

func truncateRunes(s string, max int) string {
	r := []rune(strings.TrimSpace(s))
	if len(r) <= max {
		return string(r)
	}
	return string(r[:max]) + "…"
}
