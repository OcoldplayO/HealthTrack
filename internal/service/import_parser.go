package service

import (
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"golang.org/x/text/encoding/simplifiedchinese"
	"healthtrack/internal/model"
)

// ParsedRow 一行解析结果。DTO 承载可直接落库的字段；
// ClearFields 记录显式清空标记（- / null），与“空单元格=不修改”区分开。
type ParsedRow struct {
	Line            int                    `json:"line"`
	Date            string                 `json:"date"`
	DTO             model.SaveRecordDTO    `json:"dto"`
	ClearFields     []string               `json:"clear_fields,omitempty"`
	ActivityTags    string                 `json:"activity_tags,omitempty"`
	HasActivityTags bool                   `json:"has_activity_tags"`
	Warnings        []model.ImportRowIssue `json:"warnings,omitempty"`
	Errors          []model.ImportRowIssue `json:"errors,omitempty"`
	Raw             string                 `json:"raw,omitempty"`
}

// ParsedFile 一份导入文件的解析结果。
// Fatal 非空表示整份文件不可用（找不到日期列、编码无法识别等），此时不产生任何行。
type ParsedFile struct {
	SourceType string      `json:"source_type"`
	Encoding   string      `json:"encoding"`
	Delimiter  string      `json:"delimiter"`
	Rows       []ParsedRow `json:"rows"`
	Fatal      string      `json:"fatal,omitempty"`
}

var clearMarkers = map[string]bool{"-": true, "null": true, "nil": true}

func isClearMarker(s string) bool {
	return clearMarkers[strings.ToLower(strings.TrimSpace(s))]
}

// decodeText 解码文本：优先 UTF-8（含 BOM），无效时回退 GB18030（Excel 中文另存 CSV 的默认编码）。
func decodeText(src []byte) (string, string, error) {
	if len(src) >= 3 && src[0] == 0xEF && src[1] == 0xBB && src[2] == 0xBF {
		body := src[3:]
		if !utf8.Valid(body) {
			return "", "", fmt.Errorf("文件声明为 UTF-8 BOM，但内容包含非法 UTF-8 字节")
		}
		return string(body), "UTF-8 (BOM)", nil
	}
	if utf8.Valid(src) {
		return string(src), "UTF-8", nil
	}
	decoded, err := simplifiedchinese.GB18030.NewDecoder().Bytes(src)
	if err != nil || !utf8.Valid(decoded) {
		return "", "", fmt.Errorf("文件编码无法识别，请另存为 UTF-8 或 GBK 后重试")
	}
	return string(decoded), "GB18030", nil
}

// detectDelimiter 统计首行引号外的候选分隔符出现次数，取最大值。
func detectDelimiter(line string) (rune, string) {
	counts := map[rune]int{',': 0, ';': 0, '\t': 0}
	inQuotes := false
	for _, r := range line {
		if r == '"' {
			inQuotes = !inQuotes
			continue
		}
		if inQuotes {
			continue
		}
		if _, ok := counts[r]; ok {
			counts[r]++
		}
	}
	best, bestCount := ',', counts[',']
	for _, r := range []rune{';', '\t'} {
		if counts[r] > bestCount {
			best, bestCount = r, counts[r]
		}
	}
	label := "逗号"
	if best == ';' {
		label = "分号"
	} else if best == '\t' {
		label = "制表符"
	}
	return best, label
}

var datePattern = regexp.MustCompile(`^\s*(\d{4})\s*[-/.年]\s*(\d{1,2})\s*[-/.月]\s*(\d{1,2})\s*日?`)

// normalizeDate 兼容 2026-10-02 / 2026/10/2 / 2026.10.2 / 2026年10月2日，
// 并忽略日期后面的时间部分。无法解析时返回错误。
func normalizeDate(raw string) (string, error) {
	m := datePattern.FindStringSubmatch(raw)
	if m == nil {
		return "", fmt.Errorf("日期需为 YYYY-MM-DD 格式")
	}
	year, _ := strconv.Atoi(m[1])
	month, _ := strconv.Atoi(m[2])
	day, _ := strconv.Atoi(m[3])
	t := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.Local)
	if t.Year() != year || int(t.Month()) != month || t.Day() != day {
		return "", fmt.Errorf("日期不存在：%s", strings.TrimSpace(raw))
	}
	return t.Format("2006-01-02"), nil
}

var clockPattern = regexp.MustCompile(`^(\d{1,2}):(\d{1,2})$`)

// normalizeClock 把 1:5 / 01:05 统一为 HH:mm；24 点或分钟越界视为非法。
func normalizeClock(raw string) (string, bool) {
	m := clockPattern.FindStringSubmatch(strings.TrimSpace(raw))
	if m == nil {
		return "", false
	}
	hour, _ := strconv.Atoi(m[1])
	minute, _ := strconv.Atoi(m[2])
	if hour < 0 || hour > 23 || minute < 0 || minute > 59 {
		return "", false
	}
	return fmt.Sprintf("%02d:%02d", hour, minute), true
}

// sleepHoursBetween 由就寝/起床时间计算时长（跨零点自动 +24h），保留 1 位小数。
func sleepHoursBetween(start, end string) (float64, bool) {
	hs, ms, okS := splitClock(start)
	he, me, okE := splitClock(end)
	if !okS || !okE {
		return 0, false
	}
	startMin, endMin := hs*60+ms, he*60+me
	if endMin <= startMin {
		endMin += 24 * 60
	}
	diff := endMin - startMin
	if diff <= 0 || diff > 24*60 {
		return 0, false
	}
	return math.Round(float64(diff)/60.0*10) / 10, true
}

func splitClock(s string) (int, int, bool) {
	parts := strings.Split(s, ":")
	if len(parts) != 2 {
		return 0, 0, false
	}
	h, errH := strconv.Atoi(parts[0])
	m, errM := strconv.Atoi(parts[1])
	if errH != nil || errM != nil {
		return 0, 0, false
	}
	return h, m, true
}

// rowBuilder 逐字段解析并累积行级问题，避免在每个字段上重复写校验代码。
type rowBuilder struct {
	row *ParsedRow
}

func (b *rowBuilder) addError(field, msg string) {
	b.row.Errors = append(b.row.Errors, model.ImportRowIssue{
		Line: b.row.Line, Date: b.row.Date, Level: "error", Field: field, Message: msg, Raw: b.row.Raw,
	})
}

func (b *rowBuilder) addWarning(field, msg string) {
	b.row.Warnings = append(b.row.Warnings, model.ImportRowIssue{
		Line: b.row.Line, Date: b.row.Date, Level: "warning", Field: field, Message: msg, Raw: b.row.Raw,
	})
}

func (b *rowBuilder) clear(field string) {
	b.row.ClearFields = append(b.row.ClearFields, field)
}

// number 解析可选数值：空=不修改；- / null=清空；越界只警告（按约定放行）。
func (b *rowBuilder) number(field, raw string, min, max float64) *float64 {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	if isClearMarker(raw) {
		b.clear(field)
		return nil
	}
	value, err := strconv.ParseFloat(strings.TrimSpace(strings.TrimSuffix(strings.TrimSuffix(raw, "kg"), "cm")), 64)
	if err != nil {
		b.addError(field, fmt.Sprintf("%q 不是有效数字", raw))
		return nil
	}
	if value < min || value > max {
		b.addWarning(field, fmt.Sprintf("数值 %.1f 超出合理范围 %.0f~%.0f，已放行，请自行核对", value, min, max))
	}
	return &value
}

// clock 解析可选时间：空=不修改；- / null=清空；格式错误视为必须修正的错误。
func (b *rowBuilder) clock(field, raw string) *string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	if isClearMarker(raw) {
		b.clear(field)
		return nil
	}
	normalized, ok := normalizeClock(raw)
	if !ok {
		b.addError(field, fmt.Sprintf("%q 不是有效时间，需为 HH:mm", raw))
		return nil
	}
	return &normalized
}

// text 解析可选文本：空=不修改；- / null=清空。
func (b *rowBuilder) text(field, raw string) *string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	if isClearMarker(raw) {
		b.clear(field)
		return nil
	}
	return &raw
}

// mergeParsedRowsByDate 合并文件内同一天的多次记录（备忘录常见：体重一条、睡眠一条）。
// 带错误的行不参与合并，避免把错误扩散到原本有效的那一天。
func mergeParsedRowsByDate(rows []ParsedRow) []ParsedRow {
	merged := make([]ParsedRow, 0, len(rows))
	indexByDate := map[string]int{}

	for _, row := range rows {
		if row.Date == "" || len(row.Errors) > 0 {
			merged = append(merged, row)
			continue
		}
		idx, exists := indexByDate[row.Date]
		if !exists {
			indexByDate[row.Date] = len(merged)
			merged = append(merged, row)
			continue
		}
		dst := &merged[idx]
		dst.Warnings = append(dst.Warnings, model.ImportRowIssue{
			Line: row.Line, Date: row.Date, Level: "warning", Field: "date",
			Message: fmt.Sprintf("与第 %d 行同日，已合并为一条记录", dst.Line), Raw: row.Raw,
		})
		mergeRowInto(dst, &row)
	}
	return merged
}

func mergeRowInto(dst, src *ParsedRow) {
	if dst.DTO.WeightAM == nil {
		dst.DTO.WeightAM = src.DTO.WeightAM
	}
	if dst.DTO.WeightPM == nil {
		dst.DTO.WeightPM = src.DTO.WeightPM
	}
	if dst.DTO.WaistSize == nil {
		dst.DTO.WaistSize = src.DTO.WaistSize
	}
	if dst.DTO.SleepStartTime == nil {
		dst.DTO.SleepStartTime = src.DTO.SleepStartTime
	}
	if dst.DTO.SleepEndTime == nil {
		dst.DTO.SleepEndTime = src.DTO.SleepEndTime
	}
	if dst.DTO.SleepHours == nil {
		dst.DTO.SleepHours = src.DTO.SleepHours
	}
	if dst.DTO.JournalText == nil {
		dst.DTO.JournalText = src.DTO.JournalText
	} else if src.DTO.JournalText != nil && *src.DTO.JournalText != "" {
		combined := strings.TrimSpace(*dst.DTO.JournalText + "\n" + *src.DTO.JournalText)
		dst.DTO.JournalText = &combined
	}
	if !dst.HasActivityTags && src.HasActivityTags {
		dst.ActivityTags, dst.HasActivityTags = src.ActivityTags, true
	}
	dst.ClearFields = append(dst.ClearFields, src.ClearFields...)
	dst.Warnings = append(dst.Warnings, src.Warnings...)
	dst.Raw = strings.TrimSpace(dst.Raw + " | " + src.Raw)
}
