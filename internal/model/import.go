package model

import "time"

// 导入批次状态。写入阶段使用单事务，任何异常都会整体回滚，
// 因此 failed / interrupted 的批次一定对应 0 行写入。
const (
	ImportStatusPending     = "pending"
	ImportStatusSuccess     = "success"
	ImportStatusPartial     = "partial"
	ImportStatusFailed      = "failed"
	ImportStatusInterrupted = "interrupted"
)

// ImportRowIssue 行级问题，供预览与失败明细展示。
// Level 为 warning 时照常写入；为 error 时该行不写入。
type ImportRowIssue struct {
	Line    int    `json:"line"`            // 文件行号，从 1 开始（含表头）
	Date    string `json:"date,omitempty"`  // 该行解析出的日期，可能为空
	Level   string `json:"level"`           // warning / error
	Field   string `json:"field,omitempty"` // 出问题的字段
	Message string `json:"message"`         // 人类可读的原因
	Raw     string `json:"raw,omitempty"`   // 原始片段，便于用户定位
}

// ImportBatch 一次导入尝试的审计记录。
// 每次重试都会新增一条记录，通过 RootBatchID + AttemptNo 关联到同一次导入。
type ImportBatch struct {
	ID           int64      `json:"id"`
	UserID       int64      `json:"user_id"`
	SourceType   string     `json:"source_type"` // csv / json / memo
	FileName     string     `json:"file_name"`
	FileHash     string     `json:"file_hash"` // SHA-256，用于重复导入提醒
	FileSize     int64      `json:"file_size"`
	TotalRows    int        `json:"total_rows"`
	Inserted     int        `json:"inserted"`
	Updated      int        `json:"updated"`
	Skipped      int        `json:"skipped"`
	Warnings     int        `json:"warnings"`
	Errors       int        `json:"errors"`
	ConflictMode string     `json:"conflict_mode"` // merge / overwrite
	SkipErrors   bool       `json:"skip_errors"`
	Status       string     `json:"status"`
	ErrorMessage string     `json:"error_message"`
	DetailJSON   string     `json:"-"` // 行级问题明细，由接口按需解析
	CachePath    string     `json:"-"` // 失败原文件缓存路径，禁止下发到客户端
	RootBatchID  *int64     `json:"root_batch_id"`
	AttemptNo    int        `json:"attempt_no"`
	CreatedAt    time.Time  `json:"created_at"`
	FinishedAt   *time.Time `json:"finished_at"`
}
