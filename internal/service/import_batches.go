package service

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"healthtrack/internal/model"
)

// 批次历史与重试相关错误。
var (
	ErrImportBatchNotFound     = errors.New("导入批次不存在")
	ErrImportBatchNotRetryable = errors.New("只有失败或中断的批次可以重试")
	ErrImportCacheExpired      = errors.New("原文件已超过 7 天保留期，请重新选择文件导入")
)

// ListBatches 返回最近的导入批次，并补充缓存可用性与行级明细。
func (s *ImportService) ListBatches(userID int64, limit int) ([]*model.ImportBatch, error) {
	batches, err := s.importRepo.List(userID, limit)
	if err != nil {
		return nil, err
	}
	for _, b := range batches {
		s.decorateBatch(b)
	}
	return batches, nil
}

// GetBatch 返回单个批次详情。
func (s *ImportService) GetBatch(userID, id int64) (*model.ImportBatch, error) {
	b, err := s.importRepo.GetByID(userID, id)
	if err != nil {
		return nil, err
	}
	if b == nil {
		return nil, ErrImportBatchNotFound
	}
	s.decorateBatch(b)
	return b, nil
}

// Retry 重新解析失败批次的原文件，回到预检阶段；不会直接写库。
func (s *ImportService) Retry(userID, id int64) (*ImportPreview, error) {
	b, err := s.importRepo.GetByID(userID, id)
	if err != nil {
		return nil, err
	}
	if b == nil {
		return nil, ErrImportBatchNotFound
	}
	if b.Status != model.ImportStatusFailed && b.Status != model.ImportStatusInterrupted {
		return nil, ErrImportBatchNotRetryable
	}
	raw, err := s.readImportCache(b)
	if err != nil {
		return nil, err
	}

	in := ImportPreviewInput{cachePath: b.CachePath, attemptNo: b.AttemptNo + 1, rootBatchID: b.ID}
	if b.RootBatchID != nil {
		in.rootBatchID = *b.RootBatchID
	}
	if b.SourceType == "memo" {
		in.Memo = string(raw)
		in.YearBase = b.CreatedAt.Year()
		if in.YearBase == 0 {
			in.YearBase = time.Now().Year()
		}
	} else {
		in.Data = raw
		in.FileName = b.FileName
	}
	return s.Preview(userID, in)
}

// importCSVHeader 导入模板与失败行导出共用的列定义。
const importCSVHeader = "记录日期,晨起空腹体重(kg),睡前体重(kg),腰围(cm),就寝时间,起床时间,睡眠时长(小时),运动标签,日记备注"

// ImportTemplateCSV 返回带 BOM 的导入模板，含一行示例。
func ImportTemplateCSV() []byte {
	return buildBOMCSV(importCSVHeader + "\n" +
		"2026-10-01,76.9,78.2,78,23:30,07:00,7.5,\"[\"\"有氧\"\",\"\"无氧\"\"]\",今天状态不错\n" +
		"2026-10-02,76.8,,,,,,,早上有点累\n")
}

// FailedRowsCSV 导出批次中未写入的行（错误行），表头与模板一致并附加「问题」列，
// 用户修正后可直接重新导入，日期唯一键保证补导幂等。
func (s *ImportService) FailedRowsCSV(userID, id int64) (string, []byte, error) {
	b, err := s.importRepo.GetByID(userID, id)
	if err != nil {
		return "", nil, err
	}
	if b == nil {
		return "", nil, ErrImportBatchNotFound
	}
	raw, err := s.readImportCache(b)
	if err != nil {
		return "", nil, err
	}

	yearBase := b.CreatedAt.Year()
	if yearBase == 0 {
		yearBase = time.Now().Year()
	}
	parsed := parseImportPayload(b.SourceType, raw, b.FileName, yearBase)

	var buf bytes.Buffer
	w := csv.NewWriter(&buf)
	_ = w.Write(strings.Split(importCSVHeader+",问题,原始内容", ","))

	failed := 0
	for i := range parsed.Rows {
		row := &parsed.Rows[i]
		if len(row.Errors) == 0 {
			continue
		}
		failed++
		_ = w.Write([]string{
			row.Date,
			csvFloat(row, "weight_am"),
			csvFloat(row, "weight_pm"),
			csvFloat(row, "waist_size"),
			csvString(row, "sleep_start_time"),
			csvString(row, "sleep_end_time"),
			csvFloat(row, "sleep_hours"),
			csvRawOrClear(row, "activity_tags"),
			csvString(row, "journal_text"),
			joinIssueMessages(row.Errors),
			row.Raw,
		})
	}
	for i := range parsed.Summaries {
		summary := &parsed.Summaries[i]
		if len(summary.Errors) == 0 {
			continue
		}
		failed++
		_ = w.Write([]string{
			summary.Date, "", "", "", "", "", "", "", "",
			joinIssueMessages(summary.Errors), summary.Raw,
		})
	}
	w.Flush()
	if err := w.Error(); err != nil {
		return "", nil, fmt.Errorf("生成失败行 CSV 失败: %w", err)
	}
	if failed == 0 {
		return "", nil, fmt.Errorf("该批次没有失败行可导出")
	}

	filename := fmt.Sprintf("HealthTrack_failed_rows_%d_%s.csv", b.ID, time.Now().Format("20060102"))
	return filename, buildBOMCSV(buf.String()), nil
}

// decorateBatch 计算缓冲可用性与可重试状态，并解析行级明细。
func (s *ImportService) decorateBatch(b *model.ImportBatch) {
	hasCache := false
	if b.CachePath != "" {
		if info, err := os.Stat(b.CachePath); err == nil && time.Since(info.ModTime()) <= importCacheTTL {
			hasCache = true
		}
	}
	b.HasCache = hasCache
	b.Retryable = hasCache &&
		(b.Status == model.ImportStatusFailed || b.Status == model.ImportStatusInterrupted)
	if b.DetailJSON != "" {
		var detail importBatchDetail
		if err := json.Unmarshal([]byte(b.DetailJSON), &detail); err == nil {
			b.Issues = detail.Issues
		}
	}
}

// parseImportPayload 按来源类型解析原始数据，供重试失败的失败行导出复用。
func parseImportPayload(source string, raw []byte, fileName string, yearBase int) *ParsedFile {
	switch source {
	case "memo":
		return ParseMemo(string(raw), yearBase)
	case "json":
		return ParseJSONBackup(raw)
	default:
		return ParseCSV(raw)
	}
}

// buildBOMCSV 拼接 UTF-8 BOM，确保 Excel 直接打开不乱码。
func buildBOMCSV(content string) []byte {
	return []byte("\ufeff" + content)
}

func csvFloat(row *ParsedRow, field string) string {
	if hasClearField(row, field) {
		return "-"
	}
	var v *float64
	switch field {
	case "weight_am":
		v = row.DTO.WeightAM
	case "weight_pm":
		v = row.DTO.WeightPM
	case "waist_size":
		v = row.DTO.WaistSize
	case "sleep_hours":
		v = row.DTO.SleepHours
	}
	if v == nil {
		return ""
	}
	return strconv.FormatFloat(*v, 'f', -1, 64)
}

func csvString(row *ParsedRow, field string) string {
	if hasClearField(row, field) {
		return "-"
	}
	var v *string
	switch field {
	case "sleep_start_time":
		v = row.DTO.SleepStartTime
	case "sleep_end_time":
		v = row.DTO.SleepEndTime
	case "journal_text":
		v = row.DTO.JournalText
	}
	if v == nil {
		return ""
	}
	return *v
}

func csvRawOrClear(row *ParsedRow, field string) string {
	if hasClearField(row, field) {
		return "-"
	}
	if field == "activity_tags" && row.HasActivityTags {
		return row.ActivityTags
	}
	return ""
}

func hasClearField(row *ParsedRow, field string) bool {
	for _, f := range row.ClearFields {
		if f == field {
			return true
		}
	}
	return false
}

func joinIssueMessages(issues []model.ImportRowIssue) string {
	msgs := make([]string, 0, len(issues))
	for _, issue := range issues {
		msgs = append(msgs, issue.Message)
	}
	return strings.Join(msgs, "；")
}
