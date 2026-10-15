package service

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"healthtrack/internal/model"
)

// CompareService 「阶段对比」的两月聚合服务（口径见 SYSTEM_DESIGN.md §6.5）。
//
// 设计铁律：七项指标一律由 Go 后端先行聚合，前端只负责渲染、模型只负责读表与归因，
// 严禁把跨月数值减法交给大模型（避免算错、也避免模型把「记录条数」当成「时间跨度」）。
type CompareService struct {
	records *RecordService
}

// NewCompareService 构造阶段对比聚合服务
func NewCompareService(records *RecordService) *CompareService {
	return &CompareService{records: records}
}

// minReliableDays 单月有效记录天数低于该值即判定「数据不足」，对比结论置信度需显式标注。
const minReliableDays = 7

// MonthWindow 校验 YYYY-MM 并返回该自然月的首末日（未过完的月截止到 clientToday）。
// ok=false 表示月份格式非法，或该月完全落在 clientToday 之后（不允许对比未来的月）。
func MonthWindow(month, clientToday string) (startDate, endDate string, incomplete bool, ok bool) {
	t, err := time.Parse("2006-01", strings.TrimSpace(month))
	if err != nil {
		return "", "", false, false
	}
	start := time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, -1)
	startDate = start.Format("2006-01-02")
	endDate = end.Format("2006-01-02")

	if clientToday == "" {
		return startDate, endDate, false, true
	}
	if clientToday < startDate {
		return "", "", false, false
	}
	if clientToday < endDate {
		return startDate, clientToday, true, true
	}
	return startDate, endDate, false, true
}

// PrevMonth 返回 YYYY-MM 的上一个月（用于默认「上月 vs 上上个月」）
func PrevMonth(month string) string {
	t, err := time.Parse("2006-01", strings.TrimSpace(month))
	if err != nil {
		return ""
	}
	return t.AddDate(0, -1, 0).Format("2006-01")
}

// BuildMonthMetrics 聚合单个月份的七项指标快照。
// 缺失项一律留空（指针为 nil / 0），由上层渲染成「—」，严禁以 0 填充。
func (s *CompareService) BuildMonthMetrics(userID int64, month, clientToday string) (*model.CompareMetrics, error) {
	startDate, endDate, incomplete, ok := MonthWindow(month, clientToday)
	if !ok {
		return nil, fmt.Errorf("非法的对比月份: %s", month)
	}

	records, err := s.records.GetHistoryRecords(userID, startDate, endDate)
	if err != nil {
		return nil, err
	}

	m := &model.CompareMetrics{
		Month:           month,
		StartDate:       startDate,
		EndDate:         endDate,
		RecordDays:      len(records),
		IncompleteMonth: incomplete,
	}
	if len(records) == 0 {
		m.DataInsufficient = true
		return m, nil
	}

	// 记录按日期升序排列后再统计「净变化」，避免依赖数据库返回顺序
	ordered := make([]*model.HealthRecord, 0, len(records))
	ordered = append(ordered, records...)
	sort.SliceStable(ordered, func(i, j int) bool { return ordered[i].RecordDate < ordered[j].RecordDate })

	var weightSum, waistSum, sleepSum, lossSum float64
	var weightN, waistN, sleepN, lossN int
	var firstWeight, lastWeight, firstWaist, lastWaist *float64

	for _, r := range ordered {
		if r.WeightAM != nil && *r.WeightAM > 0 {
			weightSum += *r.WeightAM
			weightN++
			if firstWeight == nil {
				firstWeight = r.WeightAM
			}
			lastWeight = r.WeightAM
		}
		if r.WaistSize != nil && *r.WaistSize > 0 {
			waistSum += *r.WaistSize
			waistN++
			if firstWaist == nil {
				firstWaist = r.WaistSize
			}
			lastWaist = r.WaistSize
		}
		if r.SleepHours != nil && *r.SleepHours > 0 {
			sleepSum += *r.SleepHours
			sleepN++
		}

		// 睡眠档位天数：sleep_tag 已由 RecordService 按「当前阈值」实时算好，非数据库历史值
		switch r.SleepTag {
		case "YELLOW":
			m.YellowDays++
		case "RED":
			m.RedDays++
		default:
			m.GreenDays++
		}

		// 运动天数：优先看结构化 Exercise（可细分负荷），旧数据回落到活动标签
		switch {
		case r.Exercise != nil && len(r.Exercise.NormalizeTypes()) > 0:
			m.WorkoutDays++
			switch r.Exercise.Intensity {
			case "light":
				m.WorkoutLight++
			case "medium":
				m.WorkoutMedium++
			case "failure":
				m.WorkoutFailure++
			}
		case strings.TrimSpace(r.ActivityTags) != "" && strings.TrimSpace(r.ActivityTags) != "[]":
			m.WorkoutDays++
		}

		if r.Concerta != nil && r.Concerta.Taken {
			m.ConcertaDays++
		}

		// 夜间排水：仅晨重与睡前重都有值的天参与
		if r.WeightAM != nil && r.WeightPM != nil && *r.WeightAM > 0 && *r.WeightPM > 0 {
			lossSum += *r.WeightPM - *r.WeightAM
			lossN++
		}
	}

	if weightN > 0 {
		v := roundTo(weightSum/float64(weightN), 1)
		m.WeightAvg = &v
	}
	if weightN >= 2 && firstWeight != nil && lastWeight != nil {
		v := roundTo(*lastWeight-*firstWeight, 1)
		m.WeightDelta = &v
	}
	if waistN > 0 {
		v := roundTo(waistSum/float64(waistN), 1)
		m.WaistAvg = &v
	}
	if waistN >= 2 && firstWaist != nil && lastWaist != nil {
		v := roundTo(*lastWaist-*firstWaist, 1)
		m.WaistDelta = &v
	}
	if sleepN > 0 {
		v := roundTo(sleepSum/float64(sleepN), 1)
		m.SleepAvgHours = &v
	}
	if lossN > 0 {
		v := roundTo(lossSum/float64(lossN), 2)
		m.NightLossAvg = &v
	}

	m.DataInsufficient = m.RecordDays < minReliableDays
	return m, nil
}

// roundTo 四舍五入到指定小数位
func roundTo(v float64, digits int) float64 {
	p := math.Pow(10, float64(digits))
	return math.Round(v*p) / p
}

// ComparePromptContext 构造阶段对比 user 消息的数据块：两月指标表 + 已生成洞察结论摘要。
// 注意：只给「表」，不给任何跨月差值结论——所有 Δ 由模型自己基于表中数值判断方向，
// 但数值本身一律引用表内，不得自行重算。
func ComparePromptContext(mA, mB *model.CompareMetrics, notesA, notesB []string) string {
	var sb strings.Builder

	sb.WriteString("【本次对比窗口】\n")
	writeMonthLine(&sb, "对比月 A", mA)
	writeMonthLine(&sb, "对比月 B", mB)
	sb.WriteString("\n")

	sb.WriteString("【两月指标对比表】（后端已聚合，数值直接引用，严禁自行重算）\n")
	sb.WriteString("| 指标 | ")
	sb.WriteString(monthLabel(mA))
	sb.WriteString(" | ")
	sb.WriteString(monthLabel(mB))
	sb.WriteString(" |\n|---|---|---|\n")
	writeTableRow(&sb, "体重(晨重)均值", fmtPtr(mA.WeightAvg, "kg", 1), fmtPtr(mB.WeightAvg, "kg", 1))
	writeTableRow(&sb, "体重净变化", fmtDelta(mA.WeightDelta, "kg", 1), fmtDelta(mB.WeightDelta, "kg", 1))
	writeTableRow(&sb, "腰围均值", fmtPtr(mA.WaistAvg, "cm", 1), fmtPtr(mB.WaistAvg, "cm", 1))
	writeTableRow(&sb, "腰围净变化", fmtDelta(mA.WaistDelta, "cm", 1), fmtDelta(mB.WaistDelta, "cm", 1))
	writeTableRow(&sb, "平均睡眠时长", fmtPtr(mA.SleepAvgHours, "小时", 1), fmtPtr(mB.SleepAvgHours, "小时", 1))
	writeTableRow(&sb, "熬夜分布(绿/黄/红)", sleepDistribution(mA), sleepDistribution(mB))
	writeTableRow(&sb, "有运动天数", workoutSummary(mA), workoutSummary(mB))
	writeTableRow(&sb, "专注达服药天数", fmtInt(mA.ConcertaDays, "天"), fmtInt(mB.ConcertaDays, "天"))
	writeTableRow(&sb, "平均夜间排水", fmtPtr(mA.NightLossAvg, "kg", 2), fmtPtr(mB.NightLossAvg, "kg", 2))
	sb.WriteString("\n")

	writeNotes(&sb, monthLabel(mA), notesA)
	writeNotes(&sb, monthLabel(mB), notesB)

	sb.WriteString("【口径说明】\n")
	sb.WriteString("- 熬夜分布的分母是该月「有记录天数」，不是自然天数；「—」表示该月无该项数据。\n")
	sb.WriteString("- 体重净变化 = 该月最后一条晨重 − 第一条晨重；仅在当月中旬以下无记录时可能失真。\n")
	return sb.String()
}

func writeMonthLine(sb *strings.Builder, title string, m *model.CompareMetrics) {
	if m == nil {
		return
	}
	sb.WriteString(fmt.Sprintf("%s：%s（数据覆盖 %s 至 %s，共 %d 条记录",
		title, monthLabel(m), m.StartDate, m.EndDate, m.RecordDays))
	if m.IncompleteMonth {
		sb.WriteString("，该月尚未过完")
	}
	if m.DataInsufficient {
		sb.WriteString("，数据不足")
	}
	sb.WriteString("）\n")
}

func monthLabel(m *model.CompareMetrics) string {
	if m == nil {
		return "—"
	}
	t, err := time.Parse("2006-01", m.Month)
	if err != nil {
		return m.Month
	}
	return fmt.Sprintf("%d 年 %d 月", t.Year(), int(t.Month()))
}

func writeTableRow(sb *strings.Builder, name, a, b string) {
	sb.WriteString("| ")
	sb.WriteString(name)
	sb.WriteString(" | ")
	sb.WriteString(a)
	sb.WriteString(" | ")
	sb.WriteString(b)
	sb.WriteString(" |\n")
}

func writeNotes(sb *strings.Builder, label string, notes []string) {
	if len(notes) == 0 {
		sb.WriteString(fmt.Sprintf("【%s 区间内已生成的生理洞察结论】：无\n\n", label))
		return
	}
	sb.WriteString(fmt.Sprintf("【%s 区间内已生成的生理洞察结论】（仅作结论引用，与指标表冲突时以指标表为准）：\n", label))
	for i, n := range notes {
		sb.WriteString(fmt.Sprintf("%d) %s\n", i+1, strings.TrimSpace(n)))
	}
	sb.WriteString("\n")
}

func fmtPtr(v *float64, unit string, digits int) string {
	if v == nil {
		return "—"
	}
	return fmt.Sprintf("%.*f %s", digits, *v, unit)
}

func fmtDelta(v *float64, unit string, digits int) string {
	if v == nil {
		return "—"
	}
	sign := "+"
	if *v < 0 {
		sign = ""
	}
	return fmt.Sprintf("%s%.*f %s", sign, digits, *v, unit)
}

func fmtInt(v int, unit string) string {
	return fmt.Sprintf("%d %s", v, unit)
}

func sleepDistribution(m *model.CompareMetrics) string {
	if m == nil || m.RecordDays == 0 {
		return "—"
	}
	return fmt.Sprintf("%d / %d / %d 天", m.GreenDays, m.YellowDays, m.RedDays)
}

func workoutSummary(m *model.CompareMetrics) string {
	if m == nil || m.RecordDays == 0 {
		return "—"
	}
	if m.WorkoutDays == 0 {
		return "0 天"
	}
	return fmt.Sprintf("%d 天（轻 %d / 中 %d / 力竭 %d）", m.WorkoutDays, m.WorkoutLight, m.WorkoutMedium, m.WorkoutFailure)
}
