package service

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"healthtrack/internal/model"
)

// 备忘录每行以日期开头，例如：
//
//	10.2：晨起体重 76.9，腰围 78。... 睡前 78
//	10.3：1-810（睡的还行但不足）
//
// 年份可省略，由 yearBase 决定（0 表示自动推断）。
var memoLinePattern = regexp.MustCompile(`^\s*(?:(\d{4})\s*[./年-]\s*)?(\d{1,2})\s*[.月/-]\s*(\d{1,2})\s*日?\s*[:：]?\s*(.*)$`)

var (
	// 行首即时间区间，如 "1-810（睡的还行但不足）"。
	memoRangeAtStart = regexp.MustCompile(`^\s*(\d{1,4})\s*[-~—–至]\s*(\d{1,4})\s*`)
	// 带睡眠关键词的时间区间，如 "睡眠 23-730"。
	memoRangeWithKeyword = regexp.MustCompile(`(?:睡眠|睡觉|入睡|作息|睡)\s*[:：]?\s*(\d{1,4})\s*[-~—–至]\s*(\d{1,4})\s*`)

	memoPMWeight = regexp.MustCompile(`睡前(?:体重)?\s*[:：]?\s*(\d+(?:\.\d+)?)`)
	memoAMWeight = regexp.MustCompile(`(?:(?:晨起|早起|早晨|早上|空腹)\s*)?体重\s*[:：]?\s*(\d+(?:\.\d+)?)`)
	memoWaist    = regexp.MustCompile(`腰围\s*[:：]?\s*(\d+(?:\.\d+)?)`)
)

// ParseMemo 解析手工备忘录文本。只从关键词后取数，
// 「米饭 300g」这类裸数字不会被视为体重；睡眠时间按 HMM 规则换算。
func ParseMemo(text string, yearBase int) *ParsedFile {
	result := &ParsedFile{SourceType: "memo", Encoding: "UTF-8"}

	lines := strings.Split(strings.ReplaceAll(text, "\r\n", "\n"), "\n")
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)

	for i, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}
		m := memoLinePattern.FindStringSubmatch(line)
		if m == nil {
			result.Rows = append(result.Rows, ParsedRow{
				Line: i + 1,
				Errors: []model.ImportRowIssue{{
					Line: i + 1, Level: "error", Field: "date",
					Message: "该行未以日期开头，无法定位到某一天", Raw: truncateRunes(line, 200),
				}},
				Raw: truncateRunes(line, 200),
			})
			continue
		}

		row := parseMemoLine(m, i+1, yearBase, today)
		result.Rows = append(result.Rows, row)
	}

	if len(result.Rows) == 0 {
		result.Fatal = "没有可解析的内容，请粘贴以日期开头的记录，例如：10.2：晨起体重 76.9"
		return result
	}
	result.Rows = mergeParsedRowsByDate(result.Rows)
	return result
}

func parseMemoLine(m []string, line, yearBase int, today time.Time) ParsedRow {
	row := ParsedRow{Line: line, Raw: truncateRunes(m[0], 200)}
	b := &rowBuilder{row: &row}

	month, _ := strconv.Atoi(m[2])
	day, _ := strconv.Atoi(m[3])
	year := resolveMemoYear(m[1], month, day, yearBase, today)
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.Local)
	if date.Year() != year || int(date.Month()) != month || date.Day() != day {
		b.addError("date", fmt.Sprintf("日期不存在：%d 月 %d 日", month, day))
		return row
	}
	row.Date = date.Format("2006-01-02")
	row.DTO.RecordDate = row.Date
	if date.After(today) {
		b.addWarning("date", "日期晚于今天，请确认是补记还是年份写错")
	}

	content := strings.TrimSpace(m[4])
	sleepMatched := false

	// 优先识别行首/关键词后的睡眠区间，避免把食物重量区间误判为睡眠。
	if rangeMatch := memoRangeAtStart.FindStringSubmatchIndex(content); rangeMatch != nil {
		if start, end, ok := normalizeMemoRange(content[rangeMatch[2]:rangeMatch[3]], content[rangeMatch[4]:rangeMatch[5]]); ok {
			row.DTO.SleepStartTime, row.DTO.SleepEndTime = &start, &end
			if hours, ok := sleepHoursBetween(start, end); ok {
				row.DTO.SleepHours = &hours
			}
			content = strings.TrimSpace(content[rangeMatch[1]:])
			sleepMatched = true
		}
	} else if rangeMatch := memoRangeWithKeyword.FindStringSubmatchIndex(content); rangeMatch != nil {
		if start, end, ok := normalizeMemoRange(content[rangeMatch[2]:rangeMatch[3]], content[rangeMatch[4]:rangeMatch[5]]); ok {
			row.DTO.SleepStartTime, row.DTO.SleepEndTime = &start, &end
			if hours, ok := sleepHoursBetween(start, end); ok {
				row.DTO.SleepHours = &hours
			}
			content = strings.TrimSpace(content[:rangeMatch[0]] + content[rangeMatch[1]:])
			sleepMatched = true
		}
	}

	// 睡前体重优先匹配，并从晨重搜索文本中挖掉该片段，避免「睡前体重」被当成「体重」。
	pmValue := matchNumber(memoPMWeight, content)
	if pmValue != "" {
		row.DTO.WeightPM = b.number("weight_pm", pmValue, 30, 250)
	}
	amSearch := maskMatches(content, memoPMWeight)
	if amValue := matchNumber(memoAMWeight, amSearch); amValue != "" {
		row.DTO.WeightAM = b.number("weight_am", amValue, 30, 250)
	}
	if waist := matchNumber(memoWaist, content); waist != "" {
		row.DTO.WaistSize = b.number("waist", waist, 30, 200)
	}

	remark := strings.TrimSpace(content)
	remark = strings.Trim(remark, " \t（）()")
	if sleepMatched && remark == "" {
		remark = ""
	}
	if remark != "" {
		if len([]rune(remark)) > 2000 {
			b.addError("journal_text", "单行备注超过 2000 字，请拆分后再导入")
		} else {
			row.DTO.JournalText = &remark
		}
	}

	if row.DTO.WeightAM == nil && row.DTO.WeightPM == nil && row.DTO.WaistSize == nil &&
		row.DTO.SleepHours == nil && row.DTO.JournalText == nil {
		b.addError("_row", "该行没有可识别的体重、腰围、睡眠或备注")
	}

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

// resolveMemoYear 决定省略年份的日期归属：
// 显式给了年份就用它；否则用当前年，若落在未来则归上一年。
func resolveMemoYear(explicit string, month, day, yearBase int, today time.Time) int {
	if explicit != "" {
		y, _ := strconv.Atoi(explicit)
		return y
	}
	if yearBase > 0 {
		return yearBase
	}
	year := today.Year()
	candidate := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.Local)
	if candidate.After(today) {
		year--
	}
	return year
}

// normalizeMemoRange 把 HMM 写法换算为 HH:mm：
// 1→01:00、8→08:00、130→01:30、810→08:10、1230→00:30（就寝 12 点按凌晨归一）。
func normalizeMemoRange(startTok, endTok string) (string, string, bool) {
	start, okS := normalizeMemoClock(startTok)
	end, okE := normalizeMemoClock(endTok)
	if !okS || !okE {
		return "", "", false
	}
	if strings.HasPrefix(start, "12:") {
		start = "00:" + start[3:]
	}
	return start, end, true
}

func normalizeMemoClock(tok string) (string, bool) {
	tok = strings.TrimSpace(tok)
	if len(tok) < 1 || len(tok) > 4 {
		return "", false
	}
	for _, r := range tok {
		if r < '0' || r > '9' {
			return "", false
		}
	}
	var hour, minute int
	if len(tok) <= 2 {
		hour, _ = strconv.Atoi(tok)
	} else {
		hour, _ = strconv.Atoi(tok[:len(tok)-2])
		minute, _ = strconv.Atoi(tok[len(tok)-2:])
	}
	if hour > 23 || minute > 59 {
		return "", false
	}
	return fmt.Sprintf("%02d:%02d", hour, minute), true
}

// matchNumber 返回正则第一个捕获组的内容；未命中返回空串。
func matchNumber(re *regexp.Regexp, s string) string {
	m := re.FindStringSubmatch(s)
	if len(m) < 2 {
		return ""
	}
	return m[1]
}

// maskMatches 用空格覆盖正则命中片段，保持长度不变，便于二次匹配时避开已消费的文本。
func maskMatches(s string, re *regexp.Regexp) string {
	locs := re.FindAllStringIndex(s, -1)
	if len(locs) == 0 {
		return s
	}
	var sb strings.Builder
	last := 0
	for _, loc := range locs {
		sb.WriteString(s[last:loc[0]])
		sb.WriteString(strings.Repeat(" ", loc[1]-loc[0]))
		last = loc[1]
	}
	sb.WriteString(s[last:])
	return sb.String()
}
