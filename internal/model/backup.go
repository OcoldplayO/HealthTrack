package model

// BackupSchemaVersion 备份文件结构版本。
// v1 为早期导出的裸数组 / 接口包裹数组；v2 为自描述对象，额外包含睡前小结。
const BackupSchemaVersion = 2

// BackupFile 备份文件 v2 结构。
// 照片与 AI 洞察体积大且可重新生成，不进入备份，由 Excluded 明确声明。
type BackupFile struct {
	SchemaVersion    int               `json:"schema_version"`
	App              string            `json:"app"`
	ExportedAt       string            `json:"exported_at"`
	RecordCount      int               `json:"record_count"`
	SummaryCount     int               `json:"summary_count"`
	HealthRecords    []*HealthRecord   `json:"health_records"`
	EveningSummaries []*EveningSummary `json:"evening_summaries"`
	Excluded         []string          `json:"excluded"`
}

// BackupExcluded 备份中不包含的数据类型，导入时也不会读取。
var BackupExcluded = []string{"evening_photos", "ai_insights"}
