package service

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
)

const (
	importMaxRows    = 5000
	importMaxBytes   = 5 << 20
	importPreviewTTL = 10 * time.Minute
	importMaxIssues  = 500
	importMaxDiffs   = 100
)

// ImportPreviewInput 预检入参：文件与备忘录文本二选一。
type ImportPreviewInput struct {
	FileName string
	Data     []byte
	Memo     string
	YearBase int
}

// ImportFieldChange 单个字段的变更，用于预览中的「旧值 → 新值」。
type ImportFieldChange struct {
	Field string `json:"field"`
	Label string `json:"label"`
	Old   string `json:"old"`
	New   string `json:"new"`
}

// ImportRowDiff 预览中的行级摘要，最多返回前 100 行。
type ImportRowDiff struct {
	Line    int                 `json:"line"`
	Date    string              `json:"date"`
	Action  string              `json:"action"` // insert / update
	Changes []ImportFieldChange `json:"changes"`
}

// ImportDuplicate 同哈希文件的最近一次成功导入，用于重复导入提醒。
type ImportDuplicate struct {
	BatchID   int64  `json:"batch_id"`
	CreatedAt string `json:"created_at"`
	Status    string `json:"status"`
	Inserted  int    `json:"inserted"`
	Updated   int    `json:"updated"`
	Skipped   int    `json:"skipped"`
}

// ImportPreview 预检结果。Fatal 非空时不可确认。
type ImportPreview struct {
	Token           string                 `json:"token,omitempty"`
	Fatal           string                 `json:"fatal,omitempty"`
	SourceType      string                 `json:"source_type"`
	FileName        string                 `json:"file_name"`
	FileHash        string                 `json:"file_hash"`
	FileSize        int64                  `json:"file_size"`
	Encoding        string                 `json:"encoding"`
	Delimiter       string                 `json:"delimiter"`
	TotalRows       int                    `json:"total_rows"`
	ValidRows       int                    `json:"valid_rows"`
	Inserted        int                    `json:"inserted"`
	Updated         int                    `json:"updated"`
	Warnings        int                    `json:"warnings"`
	Errors          int                    `json:"errors"`
	Issues          []model.ImportRowIssue `json:"issues"`
	IssuesTruncated bool                   `json:"issues_truncated"`
	RowDiffs        []ImportRowDiff        `json:"row_diffs"`
	DiffsTruncated  bool                   `json:"diffs_truncated"`
	Duplicate       *ImportDuplicate       `json:"duplicate,omitempty"`
	CanConfirm      bool                   `json:"can_confirm"`
	RequiresFix     bool                   `json:"requires_fix"`
	ExpiresAt       *time.Time             `json:"expires_at,omitempty"`
}

type cachedPreview struct {
	userID    int64
	source    string
	fileName  string
	fileHash  string
	fileSize  int64
	encoding  string
	delimiter string
	rows      []ParsedRow
	expiresAt time.Time
}

// ImportService 负责预检、重复检测与后续的原子写入。
type ImportService struct {
	recordRepo *repository.RecordRepository
	importRepo *repository.ImportRepository
	configs    *config.RuntimeStore

	mu       sync.Mutex
	previews map[string]*cachedPreview
}

func NewImportService(recordRepo *repository.RecordRepository, importRepo *repository.ImportRepository, configs *config.RuntimeStore) *ImportService {
	return &ImportService{
		recordRepo: recordRepo,
		importRepo: importRepo,
		configs:    configs,
		previews:   make(map[string]*cachedPreview),
	}
}

// Preview 解析并全量校验，不写数据库。成功时返回 10 分钟有效的确认令牌。
func (s *ImportService) Preview(userID int64, in ImportPreviewInput) (*ImportPreview, error) {
	preview := &ImportPreview{Issues: []model.ImportRowIssue{}, RowDiffs: []ImportRowDiff{}}
	now := time.Now()
	s.cleanupExpired(now)

	var parsed *ParsedFile
	switch {
	case strings.TrimSpace(in.Memo) != "":
		text := in.Memo
		if len([]byte(text)) > importMaxBytes {
			preview.Fatal = "粘贴内容超过 5 MB，请分批导入"
			return preview, nil
		}
		parsed = ParseMemo(text, in.YearBase)
		preview.SourceType = "memo"
		preview.FileName = "备忘录粘贴"
		preview.FileSize = int64(len([]byte(text)))
		preview.Encoding = "UTF-8"
		preview.FileHash = hashBytes([]byte(text))
	case len(in.Data) > 0:
		if len(in.Data) > importMaxBytes {
			preview.Fatal = "文件超过 5 MB，请按年份拆分后导入"
			return preview, nil
		}
		trimmed := strings.TrimSpace(string(in.Data))
		if strings.HasPrefix(trimmed, "{") || strings.HasPrefix(trimmed, "[") {
			preview.SourceType = "json"
			preview.FileName = in.FileName
			preview.Fatal = "JSON 备份导入将在备份 v2 完成后启用，当前请使用 CSV 或备忘录文本"
			return preview, nil
		}
		parsed = ParseCSV(in.Data)
		preview.SourceType = "csv"
		preview.FileName = in.FileName
		preview.FileSize = int64(len(in.Data))
		preview.FileHash = hashBytes(in.Data)
	default:
		preview.Fatal = "请选择要导入的文件，或粘贴备忘录文本"
		return preview, nil
	}

	preview.SourceType = parsed.SourceType
	preview.Encoding = parsed.Encoding
	preview.Delimiter = parsed.Delimiter
	if parsed.Fatal != "" {
		preview.Fatal = parsed.Fatal
		return preview, nil
	}
	if len(parsed.Rows) > importMaxRows {
		preview.Fatal = fmt.Sprintf("共 %d 行，超过单次 %d 行上限，请按年份拆分后导入", len(parsed.Rows), importMaxRows)
		return preview, nil
	}

	preview.TotalRows = len(parsed.Rows)

	// 一次性取出日期范围内的现有记录，避免逐行查库。
	existing, err := s.existingRecords(userID, parsed.Rows)
	if err != nil {
		return nil, err
	}

	issues := make([]model.ImportRowIssue, 0)
	var diffs []ImportRowDiff
	errorRows := 0

	for i := range parsed.Rows {
		row := &parsed.Rows[i]
		preview.Warnings += len(row.Warnings)
		issues = append(issues, row.Warnings...)

		if len(row.Errors) > 0 {
			errorRows++
			preview.Errors += len(row.Errors)
			issues = append(issues, row.Errors...)
			continue
		}
		preview.ValidRows++

		action := "insert"
		old := existing[row.Date]
		if old != nil {
			action = "update"
			preview.Updated++
		} else {
			preview.Inserted++
		}
		if len(diffs) < importMaxDiffs {
			diffs = append(diffs, ImportRowDiff{
				Line: row.Line, Date: row.Date, Action: action, Changes: diffFields(row, old),
			})
		} else {
			preview.DiffsTruncated = true
		}
	}

	sort.SliceStable(issues, func(i, j int) bool {
		if issues[i].Line == issues[j].Line {
			return issues[i].Level == "error" && issues[j].Level != "error"
		}
		return issues[i].Line < issues[j].Line
	})
	if len(issues) > importMaxIssues {
		issues = issues[:importMaxIssues]
		preview.IssuesTruncated = true
	}
	preview.Issues = issues
	preview.RowDiffs = diffs

	preview.RequiresFix = preview.Errors > 0
	preview.CanConfirm = preview.Errors == 0

	if dup, err := s.findDuplicate(userID, preview.FileHash); err != nil {
		return nil, err
	} else {
		preview.Duplicate = dup
	}

	token, err := newToken()
	if err != nil {
		return nil, fmt.Errorf("生成预览令牌失败: %w", err)
	}
	expiresAt := now.Add(importPreviewTTL)
	s.mu.Lock()
	s.previews[token] = &cachedPreview{
		userID:    userID,
		source:    parsed.SourceType,
		fileName:  preview.FileName,
		fileHash:  preview.FileHash,
		fileSize:  preview.FileSize,
		encoding:  parsed.Encoding,
		delimiter: parsed.Delimiter,
		rows:      parsed.Rows,
		expiresAt: expiresAt,
	}
	s.mu.Unlock()
	preview.Token = token
	preview.ExpiresAt = &expiresAt
	return preview, nil
}

// existingRecords 取出行日期范围内的现有记录，按日期建索引。
func (s *ImportService) existingRecords(userID int64, rows []ParsedRow) (map[string]*model.HealthRecord, error) {
	minDate, maxDate := "", ""
	for i := range rows {
		d := rows[i].Date
		if d == "" {
			continue
		}
		if minDate == "" || d < minDate {
			minDate = d
		}
		if maxDate == "" || d > maxDate {
			maxDate = d
		}
	}
	result := make(map[string]*model.HealthRecord)
	if minDate == "" {
		return result, nil
	}
	records, err := s.recordRepo.GetRange(userID, minDate, maxDate)
	if err != nil {
		return nil, fmt.Errorf("读取现有记录失败: %w", err)
	}
	for _, rec := range records {
		result[rec.RecordDate] = rec
	}
	return result, nil
}

func (s *ImportService) findDuplicate(userID int64, hash string) (*ImportDuplicate, error) {
	if hash == "" {
		return nil, nil
	}
	b, err := s.importRepo.FindLatestByHash(userID, hash)
	if err != nil {
		return nil, err
	}
	if b == nil || (b.Status != model.ImportStatusSuccess && b.Status != model.ImportStatusPartial) {
		return nil, nil
	}
	return &ImportDuplicate{
		BatchID:   b.ID,
		CreatedAt: b.CreatedAt.Format("2006-01-02 15:04"),
		Status:    b.Status,
		Inserted:  b.Inserted,
		Updated:   b.Updated,
		Skipped:   b.Skipped,
	}, nil
}

func (s *ImportService) cleanupExpired(now time.Time) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for token, cached := range s.previews {
		if now.After(cached.expiresAt) {
			delete(s.previews, token)
		}
	}
}

func hashBytes(data []byte) string {
	sum := sha256.Sum256(data)
	return hex.EncodeToString(sum[:])
}

func newToken() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

// diffFields 计算预览中的字段变更；新增行给出全部有值字段。
func diffFields(row *ParsedRow, old *model.HealthRecord) []ImportFieldChange {
	changes := make([]ImportFieldChange, 0)

	weight := func(field, label string, newVal *float64, oldVal *float64) {
		if newVal == nil {
			return
		}
		if oldVal != nil && *oldVal == *newVal && old != nil {
			return
		}
		changes = append(changes, ImportFieldChange{Field: field, Label: label, Old: formatFloatPtr(oldVal), New: formatFloat(*newVal)})
	}
	text := func(field, label string, newVal *string, oldVal string, isOldValid bool) {
		if newVal == nil {
			return
		}
		if isOldValid && oldVal == *newVal {
			return
		}
		changes = append(changes, ImportFieldChange{Field: field, Label: label, Old: truncateRunes(oldVal, 40), New: truncateRunes(*newVal, 40)})
	}

	if old != nil {
		weight("weight_am", "晨重", row.DTO.WeightAM, old.WeightAM)
		weight("weight_pm", "睡前体重", row.DTO.WeightPM, old.WeightPM)
		weight("waist_size", "腰围", row.DTO.WaistSize, old.WaistSize)
		weight("sleep_hours", "睡眠时长", row.DTO.SleepHours, old.SleepHours)
		text("sleep_start_time", "就寝", row.DTO.SleepStartTime, valueOrEmpty(old.SleepStartTime), true)
		text("sleep_end_time", "起床", row.DTO.SleepEndTime, valueOrEmpty(old.SleepEndTime), true)
		text("journal_text", "日记", row.DTO.JournalText, old.JournalText, true)
		if row.HasActivityTags && row.ActivityTags != old.ActivityTags {
			changes = append(changes, ImportFieldChange{Field: "activity_tags", Label: "运动标签", Old: truncateRunes(old.ActivityTags, 40), New: truncateRunes(row.ActivityTags, 40)})
		}
	} else {
		weight("weight_am", "晨重", row.DTO.WeightAM, nil)
		weight("weight_pm", "睡前体重", row.DTO.WeightPM, nil)
		weight("waist_size", "腰围", row.DTO.WaistSize, nil)
		weight("sleep_hours", "睡眠时长", row.DTO.SleepHours, nil)
		text("sleep_start_time", "就寝", row.DTO.SleepStartTime, "", false)
		text("sleep_end_time", "起床", row.DTO.SleepEndTime, "", false)
		text("journal_text", "日记", row.DTO.JournalText, "", false)
		if row.HasActivityTags {
			changes = append(changes, ImportFieldChange{Field: "activity_tags", Label: "运动标签", Old: "", New: truncateRunes(row.ActivityTags, 40)})
		}
	}

	for _, field := range row.ClearFields {
		changes = append(changes, ImportFieldChange{
			Field: field, Label: fieldLabel(field), Old: "已有值", New: "清空",
		})
	}
	return changes
}

func fieldLabel(field string) string {
	switch field {
	case "weight_am":
		return "晨重"
	case "weight_pm":
		return "睡前体重"
	case "waist_size":
		return "腰围"
	case "sleep_hours":
		return "睡眠时长"
	case "sleep_start_time":
		return "就寝"
	case "sleep_end_time":
		return "起床"
	case "journal_text":
		return "日记"
	case "activity_tags":
		return "运动标签"
	}
	return field
}

func formatFloat(v float64) string {
	return strconv.FormatFloat(v, 'f', -1, 64)
}

func formatFloatPtr(v *float64) string {
	if v == nil {
		return ""
	}
	return formatFloat(*v)
}

func valueOrEmpty(v *string) string {
	if v == nil {
		return ""
	}
	return *v
}
