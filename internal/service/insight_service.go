package service

import (
	"fmt"
	"strings"
	"time"

	"healthtrack/internal/model"
	"healthtrack/internal/repository"
)

type InsightService struct {
	repo *repository.RecordRepository
}

func NewInsightService(repo *repository.RecordRepository) *InsightService {
	return &InsightService{repo: repo}
}

var lunchProteinLabels = map[string]string{
	"chicken": "鸡胸",
	"egg":     "蛋",
	"fish":    "鱼",
	"beef":    "牛肉",
	"soy":     "豆制品",
	"yogurt":  "酸奶",
	"other":   "其他",
}

var lunchStapleLabels = map[string]string{
	"rice":   "白米饭",
	"noodle": "面条",
	"grains": "杂粮",
	"potato": "薯类",
	"none":   "无主食",
}

var lunchCarbLabels = map[string]string{
	"lt20":  "<20g",
	"<20":   "<20g",
	"20_35": "20-35g",
	"35_50": "35-50g",
	"gt50":  ">50g",
	">50":   ">50g",
}

var lunchCookLabels = map[string]string{
	"steam":    "蒸煮",
	"stir_fry": "炒",
	"fry":      "煎炸",
	"raw":      "生食",
	"takeout":  "外卖",
}

// FormatLunchSummary 将结构化午餐实体格式化为简洁中文摘要；未记录返回空串。
func FormatLunchSummary(l *model.LunchDetail) string {
	if l == nil {
		return ""
	}
	if l.Eaten == "skipped" {
		return "跳过"
	}
	var parts []string
	if len(l.Protein) > 0 {
		names := make([]string, 0, len(l.Protein))
		for _, p := range l.Protein {
			if label, ok := lunchProteinLabels[p]; ok {
				names = append(names, label)
			} else if p != "" {
				names = append(names, p)
			}
		}
		if len(names) > 0 {
			parts = append(parts, strings.Join(names, "/"))
		}
	}
	if l.ProteinG > 0 {
		parts = append(parts, fmt.Sprintf("约%dg蛋白", l.ProteinG))
	}
	if label, ok := lunchStapleLabels[l.Staple]; ok {
		parts = append(parts, label)
	} else if l.Staple != "" {
		parts = append(parts, l.Staple)
	}
	if label, ok := lunchCarbLabels[l.CarbG]; ok {
		parts = append(parts, "碳水"+label)
	} else if l.CarbG != "" {
		parts = append(parts, "碳水"+l.CarbG)
	}
	if label, ok := lunchCookLabels[l.Cooking]; ok {
		parts = append(parts, label)
	} else if l.Cooking != "" {
		parts = append(parts, l.Cooking)
	}
	if len(parts) == 0 {
		if l.Eaten == "eaten" {
			return "已吃(明细空白)"
		}
		return ""
	}
	return strings.Join(parts, "·")
}

// BuildPromptContext 组装“宏观生理特征 + 微观流水”提示词上下文
func (s *InsightService) BuildPromptContext(records []*model.HealthRecord) string {
	if len(records) == 0 {
		return "暂无有效历史记录。"
	}

	var sb strings.Builder
	sb.WriteString("【系统预计算：宏观生理与行为特征大盘】\n")

	validWeightCount := 0
	var firstWeight, lastWeight *float64

	validWaistCount := 0
	var firstWaist, lastWaist *float64

	totalSleepLoss := 0.0
	sleepLossCount := 0

	sleepHoursSum := 0.0
	sleepHoursCount := 0
	greenDays, yellowDays, redDays := 0, 0, 0

	stepsSum := 0
	stepsCount := 0

	morningLightRecorded := 0
	morningLightYes := 0

	workoutDays := 0
	heavyWorkoutDays := 0
	concertaDays := 0

	for _, r := range records {
		if r.WeightAM != nil && *r.WeightAM > 0 {
			validWeightCount++
			if firstWeight == nil {
				firstWeight = r.WeightAM
			}
			lastWeight = r.WeightAM
		}
		if r.WaistSize != nil && *r.WaistSize > 0 {
			validWaistCount++
			if firstWaist == nil {
				firstWaist = r.WaistSize
			}
			lastWaist = r.WaistSize
		}
		if r.WeightPM != nil && r.WeightAM != nil && *r.WeightPM > 0 && *r.WeightAM > 0 {
			loss := *r.WeightPM - *r.WeightAM
			if loss > 0 && loss < 2.0 {
				totalSleepLoss += loss
				sleepLossCount++
			}
		}
		if r.SleepHours != nil && *r.SleepHours > 0 {
			sleepHoursSum += *r.SleepHours
			sleepHoursCount++
		}
		switch r.SleepTag {
		case "YELLOW":
			yellowDays++
		case "RED":
			redDays++
		default:
			greenDays++
		}
		if r.Steps != nil {
			stepsSum += *r.Steps
			stepsCount++
		}
		if r.MorningLight != nil {
			morningLightRecorded++
			if *r.MorningLight {
				morningLightYes++
			}
		}

		hasStructuredWorkout := r.Exercise != nil && len(r.Exercise.NormalizeTypes()) > 0
		hasLegacyTag := strings.TrimSpace(r.ActivityTags) != "" && strings.TrimSpace(r.ActivityTags) != "[]"
		if hasStructuredWorkout || hasLegacyTag {
			workoutDays++
		}
		if r.Exercise != nil && r.Exercise.Intensity == "failure" {
			heavyWorkoutDays++
		}
		if r.Concerta != nil && r.Concerta.Taken {
			concertaDays++
		}
	}

	startRec := records[0]
	endRec := records[len(records)-1]

	// 日历跨度按首尾记录日期计算（含首尾）；记录条数单独列出，
	// 避免把"记录条数"当成"天数"（例如 09-01~10-05 实际跨 35 天，但只有 30 条记录）。
	spanDays := len(records)
	if sd, errS := time.Parse("2006-01-02", startRec.RecordDate); errS == nil {
		if ed, errE := time.Parse("2006-01-02", endRec.RecordDate); errE == nil {
			if d := int(ed.Sub(sd).Hours()/24) + 1; d > 0 {
				spanDays = d
			}
		}
	}

	sb.WriteString(fmt.Sprintf("- 数据实际覆盖区间: %s 至 %s (日历跨度 %d 天, 共 %d 条记录, 其中 %d 条含有效晨重)\n",
		startRec.RecordDate, endRec.RecordDate, spanDays, len(records), validWeightCount))

	if validWeightCount >= 2 && firstWeight != nil && lastWeight != nil {
		weightNetDelta := *lastWeight - *firstWeight
		sb.WriteString(fmt.Sprintf("- 期间净体重变化: %+.1f kg (首条有效晨重 %.1f kg -> 末条有效晨重 %.1f kg)\n",
			weightNetDelta, *firstWeight, *lastWeight))
	} else if validWeightCount == 1 && firstWeight != nil {
		sb.WriteString(fmt.Sprintf("- 期间净体重变化: 数据不足 (仅 1 天有效晨重 %.1f kg)\n", *firstWeight))
	} else {
		sb.WriteString("- 期间净体重变化: 数据不足 (无有效晨重记录)\n")
	}

	if validWaistCount >= 2 && firstWaist != nil && lastWaist != nil {
		waistNetDelta := *lastWaist - *firstWaist
		sb.WriteString(fmt.Sprintf("- 期间腰围变化: %+.1f cm (%.1f cm -> %.1f cm, 有效 %d 天)\n",
			waistNetDelta, *firstWaist, *lastWaist, validWaistCount))
	} else if validWaistCount == 1 && firstWaist != nil {
		sb.WriteString(fmt.Sprintf("- 期间腰围变化: 数据不足 (仅 1 天有效腰围 %.1f cm)\n", *firstWaist))
	} else {
		sb.WriteString("- 期间腰围变化: 暂无有效腰围记录\n")
	}

	if sleepLossCount > 0 {
		sb.WriteString(fmt.Sprintf("- 平均夜间呼吸排水 (睡前 - 今晨): %.2f kg (正常基准: 0.4~0.9 kg, 有效 %d 天)\n",
			totalSleepLoss/float64(sleepLossCount), sleepLossCount))
	} else {
		sb.WriteString("- 平均夜间呼吸排水: 暂无同时含睡前/晨重数据\n")
	}

	if sleepHoursCount > 0 {
		sb.WriteString(fmt.Sprintf("- 睡眠节律: 平均 %.1f 小时 (有效 %d 天) | 正常 %d 天 / 轻度熬夜 %d 天 / 重度熬夜 %d 天\n",
			sleepHoursSum/float64(sleepHoursCount), sleepHoursCount, greenDays, yellowDays, redDays))
	} else {
		sb.WriteString(fmt.Sprintf("- 睡眠节律: 正常 %d 天 / 轻度熬夜 %d 天 / 重度熬夜 %d 天\n", greenDays, yellowDays, redDays))
	}

	stepsAvgText := "暂无记录"
	if stepsCount > 0 {
		stepsAvgText = fmt.Sprintf("日均 %d 步 (已记录 %d 天)", stepsSum/stepsCount, stepsCount)
	}
	lightText := "暂无记录"
	if morningLightRecorded > 0 {
		lightText = fmt.Sprintf("是 %d 天 / 共记 %d 天", morningLightYes, morningLightRecorded)
	}
	sb.WriteString(fmt.Sprintf("- 行为与节律: 步数 %s | 晨光 %s | 运动 %d 天 (含力竭 %d 天) | 专注达服药 %d 天\n\n",
		stepsAvgText, lightText, workoutDays, heavyWorkoutDays, concertaDays))

	sb.WriteString("【逐日微观多维流水（已对齐生理差值）】\n")
	for i, r := range records {
		// 计算单日夜间排水
		sleepLossText := "无数据"
		if r.WeightPM != nil && r.WeightAM != nil && *r.WeightPM > 0 && *r.WeightAM > 0 {
			sleepLossText = fmt.Sprintf("%.1fkg", *r.WeightPM-*r.WeightAM)
		}

		// 计算相对上一条记录的晨重变化（区分连日 vs 断记多日）
		dailyDiffText := "--"
		if i > 0 && records[i-1].WeightAM != nil && r.WeightAM != nil && *records[i-1].WeightAM > 0 && *r.WeightAM > 0 {
			diff := *r.WeightAM - *records[i-1].WeightAM
			gapDays := dateGapDays(records[i-1].RecordDate, r.RecordDate)
			prefix := "日变化"
			if gapDays > 1 {
				prefix = fmt.Sprintf("较%d日前", gapDays)
			}
			if diff == 0 {
				dailyDiffText = fmt.Sprintf("%s:持平", prefix)
			} else {
				dailyDiffText = fmt.Sprintf("%s:%+.1fkg", prefix, diff)
			}
		}

		// 格式化晨重与腰围
		amWeightText := "--"
		if r.WeightAM != nil && *r.WeightAM > 0 {
			amWeightText = fmt.Sprintf("%.1fkg", *r.WeightAM)
		}
		waistText := "--"
		if r.WaistSize != nil && *r.WaistSize > 0 {
			waistText = fmt.Sprintf("%.1fcm", *r.WaistSize)
		}

		// 格式化步数、晨光与午餐
		stepsText := "未记"
		if r.Steps != nil {
			stepsText = fmt.Sprintf("%d", *r.Steps)
		}
		lightFlag := "未记"
		if r.MorningLight != nil {
			if *r.MorningLight {
				lightFlag = "是"
			} else {
				lightFlag = "否"
			}
		}
		lunchText := FormatLunchSummary(r.Lunch)
		if lunchText == "" {
			lunchText = "未记"
		}

		// 格式化睡眠
		sleepDurationText := "--"
		if r.SleepHours != nil {
			sleepDurationText = fmt.Sprintf("%.1f", *r.SleepHours)
		}
		sleepBedText := "--"
		if r.SleepStartTime != nil && *r.SleepStartTime != "" {
			sleepBedText = *r.SleepStartTime
		}

		// 格式化运动明细（运动类型支持多选，如 cardio+strength）
		exText := "无运动"
		if r.Exercise != nil {
			if types := r.Exercise.NormalizeTypes(); len(types) > 0 {
				exText = fmt.Sprintf("%s(%s/%d分钟)", strings.Join(types, "+"), r.Exercise.Intensity, r.Exercise.Duration)
				if strings.TrimSpace(r.Exercise.Items) != "" {
					exText += " " + strings.TrimSpace(r.Exercise.Items)
				}
			}
		}

		// 格式化专注达明细
		medText := "未服药"
		if r.Concerta != nil && r.Concerta.Taken {
			crashPart := ""
			if strings.TrimSpace(r.Concerta.CrashTime) != "" {
				crashPart = ", Crash:" + strings.TrimSpace(r.Concerta.CrashTime)
			}
			medText = fmt.Sprintf("服药%dmg(时间%s, 启动力%d分%s, 副作用:[%s], 晚间代偿:[%s])",
				r.Concerta.Dose, r.Concerta.Time, r.Concerta.FocusWork, crashPart,
				strings.Join(r.Concerta.SideEffects, ","),
				strings.Join(r.Concerta.Compensations, ","))
		}

		// 格式化冷水澡明细（含预估体感水温，便于模型分析水温变化对唤醒强度的影响）
		csText := "无冷水澡"
		if r.ColdShower != nil && r.ColdShower.Enabled {
			tempText := ""
			if r.ColdShower.WaterTemp != nil {
				tempText = fmt.Sprintf("%.1f℃/", *r.ColdShower.WaterTemp)
			}
			dur := r.ColdShower.Duration
			if dur > 0 && dur <= 10 {
				dur = dur * 60 // 兼容历史分钟单位
			}
			csText = fmt.Sprintf("%s(%s%d秒/%s)", r.ColdShower.Timing, tempText, dur, r.ColdShower.Feeling)
		}

		sb.WriteString(fmt.Sprintf(
			"[%s] 晨重:%s(%s, 睡前排水:%s) | 腰围:%s | 睡眠:%sh(就寝:%s, %s) | 步数:%s | 晨光:%s | 午餐:%s | 运动:%s | 药物:%s | 冷水澡:%s | 日记: %s\n",
			r.RecordDate, amWeightText, dailyDiffText, sleepLossText, waistText,
			sleepDurationText, sleepBedText, r.SleepTag,
			stepsText, lightFlag, lunchText, exText, medText, csText, r.JournalText,
		))
	}

	return sb.String()
}

func dateGapDays(prevDate, curDate string) int {
	t1, err1 := time.Parse("2006-01-02", prevDate)
	t2, err2 := time.Parse("2006-01-02", curDate)
	if err1 != nil || err2 != nil {
		return 1
	}
	days := int(t2.Sub(t1).Hours() / 24)
	if days < 1 {
		return 1
	}
	return days
}
