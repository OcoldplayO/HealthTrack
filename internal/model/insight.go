package model

import "time"

// AIInsight AI 洞察历史存档实体（对齐 SQLite ai_insights 表）
type AIInsight struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Scope     string    `json:"scope"`      // 归属：health（生理周期洞察）/ evening（睡前小结洞察）/ compare（阶段对比）
	RangeDays int       `json:"range_days"` // 生成时选择的档位：7/30/60（evening 与 compare 均为 0）
	StartDate string    `json:"start_date"` // 该期数据起始日期 (YYYY-MM-DD)
	EndDate   string    `json:"end_date"`   // 该期数据结束日期 (YYYY-MM-DD)
	Content   string    `json:"content"`    // 复盘正文 (Markdown)
	Thinking  string    `json:"thinking"`   // 大模型思维链推导原文
	Model     string    `json:"model"`      // 生成所用模型
	CreatedAt time.Time `json:"created_at"` // 生成时间

	// MetaJSON 仅阶段对比（scope=compare）使用：原始快照文本，直接对应 ai_insights.meta_json 列
	MetaJSON string `json:"-"`
	// Meta 阶段对比的解析结果（两月边界 + 两月指标快照），供列表与详情直接回显；非 compare 记录为 nil
	Meta *CompareMeta `json:"meta,omitempty"`
}

// CompareMetrics 阶段对比中单个自然月的七项聚合指标快照（口径见 SYSTEM_DESIGN.md §6.5）。
// 全部由 Go 后端先行聚合：前端只渲染、模型只读表，严禁让模型做跨月数值减法。
type CompareMetrics struct {
	Month      string `json:"month"`      // 自然月 YYYY-MM
	StartDate  string `json:"start_date"` // 该月首日
	EndDate    string `json:"end_date"`   // 该月末日（未过完的月取客户端今天）
	RecordDays int    `json:"record_days"` // 该月有记录天数（非自然天数）

	WeightAvg   *float64 `json:"weight_avg"`   // 体重(晨重)均值 kg
	WeightDelta *float64 `json:"weight_delta"` // 体重净变化 = 月末最后一条晨重 − 月初第一条晨重
	WaistAvg    *float64 `json:"waist_avg"`    // 腰围均值 cm
	WaistDelta  *float64 `json:"waist_delta"`  // 腰围净变化

	SleepAvgHours *float64 `json:"sleep_avg_hours"` // 平均睡眠时长 (小时)

	GreenDays  int `json:"green_days"`  // 未熬夜天数
	YellowDays int `json:"yellow_days"` // 轻度熬夜天数
	RedDays    int `json:"red_days"`    // 重度熬夜天数

	WorkoutDays    int `json:"workout_days"`    // 有运动的天数
	WorkoutLight   int `json:"workout_light"`   // 其中轻负荷天数
	WorkoutMedium  int `json:"workout_medium"`  // 其中中负荷天数
	WorkoutFailure int `json:"workout_failure"` // 其中力竭天数

	ConcertaDays int      `json:"concerta_days"`  // 专注达服药天数
	NightLossAvg *float64 `json:"night_loss_avg"` // 平均夜间排水量 kg（晨重与睡前重都有值的天）

	IncompleteMonth  bool `json:"incomplete_month"`  // 该月尚未过完
	DataInsufficient bool `json:"data_insufficient"` // 有效记录天数不足，结论置信度低
}

// CompareMeta 阶段对比落 ai_insights.meta_json 的完整快照。
// 字段顺序即 json.Marshal 的输出顺序，供按「月 A + 月 B」精确检索（见 InsightRepository.GetByCompareMonths）。
type CompareMeta struct {
	MonthA   string          `json:"month_a"` // 对比月 A（YYYY-MM）
	MonthB   string          `json:"month_b"` // 对比月 B（YYYY-MM）
	MetricsA *CompareMetrics `json:"metrics_a"`
	MetricsB *CompareMetrics `json:"metrics_b"`
}

