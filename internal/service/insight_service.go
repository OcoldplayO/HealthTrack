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

// BuildPromptContext 组装“宏观生理特征 + 微观流水”提示词上下文
func (s *InsightService) BuildPromptContext(records []*model.HealthRecord) string {
	if len(records) == 0 {
		return "暂无有效历史记录。"
	}

	var sb strings.Builder
	sb.WriteString("【系统预计算：宏观生理与行为特征大盘】\n")

	validCount := 0
	totalSleepLoss := 0.0
	sleepLossCount := 0
	heavyWorkoutDays := 0
	concertaDays := 0

	for _, r := range records {
		if r.WeightAM != nil && *r.WeightAM > 0 {
			validCount++
		}
		if r.WeightPM != nil && r.WeightAM != nil && *r.WeightPM > 0 && *r.WeightAM > 0 {
			loss := *r.WeightPM - *r.WeightAM
			if loss > 0 && loss < 2.0 {
				totalSleepLoss += loss
				sleepLossCount++
			}
		}
		if r.Exercise != nil && r.Exercise.Intensity == "failure" {
			heavyWorkoutDays++
		}
		if r.Concerta != nil && r.Concerta.Taken {
			concertaDays++
		}
	}

	avgSleepLoss := 0.0
	if sleepLossCount > 0 {
		avgSleepLoss = totalSleepLoss / float64(sleepLossCount)
	}

	startRec := records[0]
	endRec := records[len(records)-1]

	var startWeight, endWeight float64
	if startRec.WeightAM != nil {
		startWeight = *startRec.WeightAM
	} else if startRec.WeightPM != nil {
		startWeight = *startRec.WeightPM
	}
	if endRec.WeightAM != nil {
		endWeight = *endRec.WeightAM
	} else if endRec.WeightPM != nil {
		endWeight = *endRec.WeightPM
	}
	weightNetDelta := endWeight - startWeight

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
		startRec.RecordDate, endRec.RecordDate, spanDays, len(records), validCount))
	sb.WriteString(fmt.Sprintf("- 期间净体重变化: %+.1f kg (起始: %.1f kg -> 结束: %.1f kg)\n",
		weightNetDelta, startWeight, endWeight))
	sb.WriteString(fmt.Sprintf("- 平均夜间排汗排毒失水 (睡前 - 今晨): %.2f kg (正常基准: 0.4~0.9 kg)\n", avgSleepLoss))
	sb.WriteString(fmt.Sprintf("- 高负荷/力竭抗阻训练天数: %d 天 | 专注达服药天数: %d 天\n\n", heavyWorkoutDays, concertaDays))

	sb.WriteString("【逐日微观多维流水（已对齐生理差值）】\n")
	for i, r := range records {
		// 计算单日夜间排水
		sleepLossText := "无数据"
		if r.WeightPM != nil && r.WeightAM != nil && *r.WeightPM > 0 && *r.WeightAM > 0 {
			sleepLossText = fmt.Sprintf("%.1fkg", *r.WeightPM-*r.WeightAM)
		}

		// 计算相对前一日的晨重涨跌
		dailyDiffText := "持平"
		if i > 0 && records[i-1].WeightAM != nil && r.WeightAM != nil && *records[i-1].WeightAM > 0 && *r.WeightAM > 0 {
			diff := *r.WeightAM - *records[i-1].WeightAM
			dailyDiffText = fmt.Sprintf("%+.1fkg", diff)
		}

		// 格式化晨重
		amWeightText := "--"
		if r.WeightAM != nil && *r.WeightAM > 0 {
			amWeightText = fmt.Sprintf("%.1fkg", *r.WeightAM)
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

		// 格式化运动明细
		exText := "无运动"
		if r.Exercise != nil && r.Exercise.Type != "none" {
			exText = fmt.Sprintf("%s(%s/%d分钟)", r.Exercise.Type, r.Exercise.Intensity, r.Exercise.Duration)
		}

		// 格式化专注达明细
		medText := "未服药"
		if r.Concerta != nil && r.Concerta.Taken {
			medText = fmt.Sprintf("服药%dmg(时间%s, 启动力%d分, 副作用:[%s], 晚间代偿:[%s])",
				r.Concerta.Dose, r.Concerta.Time, r.Concerta.FocusWork,
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
			csText = fmt.Sprintf("%s(%s%d分钟/%s)", r.ColdShower.Timing, tempText, r.ColdShower.Duration, r.ColdShower.Feeling)
		}

		sb.WriteString(fmt.Sprintf(
			"[%s] 晨重:%s(日变化:%s, 睡前排水:%s) | 睡眠:%sh(就寝:%s, %s) | 运动:%s | 药物:%s | 冷水澡:%s | 饮食日记: %s\n",
			r.RecordDate, amWeightText, dailyDiffText, sleepLossText,
			sleepDurationText, sleepBedText, r.SleepTag,
			exText, medText, csText, r.JournalText,
		))
	}

	return sb.String()
}