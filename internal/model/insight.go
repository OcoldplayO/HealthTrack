package model

import "time"

// AIInsight AI 洞察历史存档实体（对齐 SQLite ai_insights 表）
type AIInsight struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Scope     string    `json:"scope"`      // 归属：health（生理周期洞察）/ evening（睡前小结洞察）
	RangeDays int       `json:"range_days"` // 生成时选择的档位：7/30/60（evening 为 0）
	StartDate string    `json:"start_date"` // 该期数据起始日期 (YYYY-MM-DD)
	EndDate   string    `json:"end_date"`   // 该期数据结束日期 (YYYY-MM-DD)
	Content   string    `json:"content"`    // 复盘正文 (Markdown)
	Thinking  string    `json:"thinking"`   // 大模型思维链推导原文
	Model     string    `json:"model"`      // 生成所用模型
	CreatedAt time.Time `json:"created_at"` // 生成时间
}
