package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"healthtrack/internal/model"
	"time"
)

type RecordRepository struct {
	db *sql.DB
}

func NewRecordRepository(db *sql.DB) *RecordRepository {
	return &RecordRepository{db: db}
}

// GetByDate 根据用户ID和日期查询单条记录
func (r *RecordRepository) GetByDate(userID int64, dateStr string) (*model.HealthRecord, error) {
	query := `
	SELECT id, user_id, record_date, weight_am, weight_pm, waist_size,
	       sleep_start_time, sleep_end_time, sleep_hours, sleep_tag,
	       journal_text, activity_tags,
	       sleep_bed_time, sleep_wake_time, exercise_json, cold_shower_json, concerta_json,
	       created_at, updated_at
	FROM health_records
	WHERE user_id = ? AND record_date = ?
	LIMIT 1
	`
	row := r.db.QueryRow(query, userID, dateStr)

	rec := &model.HealthRecord{}
	var journalText, activityTags sql.NullString
	var sleepBedTime, sleepWakeTime, exerciseJSON, coldShowerJSON, concertaJSON sql.NullString
	var createdAt, updatedAt string

	err := row.Scan(
		&rec.ID, &rec.UserID, &rec.RecordDate,
		&rec.WeightAM, &rec.WeightPM, &rec.WaistSize,
		&rec.SleepStartTime, &rec.SleepEndTime, &rec.SleepHours,
		&rec.SleepTag, &journalText, &activityTags,
		&sleepBedTime, &sleepWakeTime, &exerciseJSON, &coldShowerJSON, &concertaJSON,
		&createdAt, &updatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // 记录不存在
		}
		return nil, fmt.Errorf("查询记录失败: %w", err)
	}

	if journalText.Valid {
		rec.JournalText = journalText.String
	}
	if activityTags.Valid {
		rec.ActivityTags = activityTags.String
	}

	// 映射就寝与起床时间
	if rec.SleepStartTime == nil && sleepBedTime.Valid && sleepBedTime.String != "" {
		val := sleepBedTime.String
		rec.SleepStartTime = &val
	}
	if rec.SleepEndTime == nil && sleepWakeTime.Valid && sleepWakeTime.String != "" {
		val := sleepWakeTime.String
		rec.SleepEndTime = &val
	}

	// 解析生物黑客 JSON
	if exerciseJSON.Valid && exerciseJSON.String != "" && exerciseJSON.String != "{}" {
		var ex model.ExerciseDetail
		if err := json.Unmarshal([]byte(exerciseJSON.String), &ex); err == nil {
			rec.Exercise = &ex
		}
	}
	if coldShowerJSON.Valid && coldShowerJSON.String != "" && coldShowerJSON.String != "{}" {
		var cs model.ColdShowerDetail
		if err := json.Unmarshal([]byte(coldShowerJSON.String), &cs); err == nil {
			rec.ColdShower = &cs
		}
	}
	if concertaJSON.Valid && concertaJSON.String != "" && concertaJSON.String != "{}" {
		var con model.ConcertaDetail
		if err := json.Unmarshal([]byte(concertaJSON.String), &con); err == nil {
			rec.Concerta = &con
		}
	}

	rec.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
	rec.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)

	return rec, nil
}

// SaveOrMerge 保存或增量合并单日记录 (UPSERT)
func (r *RecordRepository) SaveOrMerge(userID int64, dto *model.SaveRecordDTO, sleepTag string, activityTags string) (*model.HealthRecord, error) {
	existing, err := r.GetByDate(userID, dto.RecordDate)
	if err != nil {
		return nil, err
	}

	// 序列化扩展 JSON
	exerciseJSONStr := "{}"
	if dto.Exercise != nil {
		// 落库前把多选类型规范化为 Types 并把兼容字段 Type 同步为首个类型
		dto.Exercise.SyncLegacyType()
		if b, err := json.Marshal(dto.Exercise); err == nil {
			exerciseJSONStr = string(b)
		}
	}

	coldShowerJSONStr := "{}"
	if dto.ColdShower != nil {
		if b, err := json.Marshal(dto.ColdShower); err == nil {
			coldShowerJSONStr = string(b)
		}
	}

	concertaJSONStr := "{}"
	if dto.Concerta != nil {
		if b, err := json.Marshal(dto.Concerta); err == nil {
			concertaJSONStr = string(b)
		}
	}

	bedTimeStr := ""
	if dto.SleepStartTime != nil {
		bedTimeStr = *dto.SleepStartTime
	}
	wakeTimeStr := ""
	if dto.SleepEndTime != nil {
		wakeTimeStr = *dto.SleepEndTime
	}

	if existing == nil {
		// 插入新记录
		insertSQL := `
		INSERT INTO health_records (
			user_id, record_date, weight_am, weight_pm, waist_size,
			sleep_start_time, sleep_end_time, sleep_hours, sleep_tag,
			journal_text, activity_tags,
			sleep_bed_time, sleep_wake_time, exercise_json, cold_shower_json, concerta_json,
			updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		`
		var journal string
		if dto.JournalText != nil {
			journal = *dto.JournalText
		}

		_, err := r.db.Exec(insertSQL,
			userID, dto.RecordDate, dto.WeightAM, dto.WeightPM, dto.WaistSize,
			dto.SleepStartTime, dto.SleepEndTime, dto.SleepHours, sleepTag,
			journal, activityTags,
			bedTimeStr, wakeTimeStr, exerciseJSONStr, coldShowerJSONStr, concertaJSONStr,
		)
		if err != nil {
			return nil, fmt.Errorf("新增记录失败: %w", err)
		}
	} else {
		// 增量合并更新 (非空字段覆盖，空字段保留旧值)
		weightAM := existing.WeightAM
		if dto.WeightAM != nil {
			weightAM = dto.WeightAM
		}

		weightPM := existing.WeightPM
		if dto.WeightPM != nil {
			weightPM = dto.WeightPM
		}

		waistSize := existing.WaistSize
		if dto.WaistSize != nil {
			waistSize = dto.WaistSize
		}

		sleepStart := existing.SleepStartTime
		if dto.SleepStartTime != nil {
			sleepStart = dto.SleepStartTime
		}

		sleepEnd := existing.SleepEndTime
		if dto.SleepEndTime != nil {
			sleepEnd = dto.SleepEndTime
		}

		sleepHours := existing.SleepHours
		if dto.SleepHours != nil {
			sleepHours = dto.SleepHours
		}

		tag := existing.SleepTag
		if dto.SleepStartTime != nil {
			tag = sleepTag
		}

		journal := existing.JournalText
		if dto.JournalText != nil {
			journal = *dto.JournalText
		}

		actTags := existing.ActivityTags
		if activityTags != "" {
			actTags = activityTags
		}

		if dto.SleepStartTime != nil {
			bedTimeStr = *dto.SleepStartTime
		} else if existing.SleepStartTime != nil {
			bedTimeStr = *existing.SleepStartTime
		}

		if dto.SleepEndTime != nil {
			wakeTimeStr = *dto.SleepEndTime
		} else if existing.SleepEndTime != nil {
			wakeTimeStr = *existing.SleepEndTime
		}

		if dto.Exercise == nil && existing.Exercise != nil {
			if b, err := json.Marshal(existing.Exercise); err == nil {
				exerciseJSONStr = string(b)
			}
		}
		if dto.ColdShower == nil && existing.ColdShower != nil {
			if b, err := json.Marshal(existing.ColdShower); err == nil {
				coldShowerJSONStr = string(b)
			}
		}
		if dto.Concerta == nil && existing.Concerta != nil {
			if b, err := json.Marshal(existing.Concerta); err == nil {
				concertaJSONStr = string(b)
			}
		}

		updateSQL := `
		UPDATE health_records SET
			weight_am = ?, weight_pm = ?, waist_size = ?,
			sleep_start_time = ?, sleep_end_time = ?, sleep_hours = ?, sleep_tag = ?,
			journal_text = ?, activity_tags = ?,
			sleep_bed_time = ?, sleep_wake_time = ?, exercise_json = ?, cold_shower_json = ?, concerta_json = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE user_id = ? AND record_date = ?
		`
		_, err := r.db.Exec(updateSQL,
			weightAM, weightPM, waistSize,
			sleepStart, sleepEnd, sleepHours, tag,
			journal, actTags,
			bedTimeStr, wakeTimeStr, exerciseJSONStr, coldShowerJSONStr, concertaJSONStr,
			userID, dto.RecordDate,
		)
		if err != nil {
			return nil, fmt.Errorf("更新记录失败: %w", err)
		}
	}

	return r.GetByDate(userID, dto.RecordDate)
}

// GetRange 查询指定日期区间内的所有记录 (升序排列便于图表绘制)
func (r *RecordRepository) GetRange(userID int64, startDate, endDate string) ([]*model.HealthRecord, error) {
	query := `
	SELECT id, user_id, record_date, weight_am, weight_pm, waist_size,
	       sleep_start_time, sleep_end_time, sleep_hours, sleep_tag,
	       journal_text, activity_tags,
	       sleep_bed_time, sleep_wake_time, exercise_json, cold_shower_json, concerta_json,
	       created_at, updated_at
	FROM health_records
	WHERE user_id = ? AND record_date >= ? AND record_date <= ?
	ORDER BY record_date ASC
	`
	rows, err := r.db.Query(query, userID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("查询历史记录失败: %w", err)
	}
	defer rows.Close()

	var records []*model.HealthRecord
	for rows.Next() {
		rec := &model.HealthRecord{}
		var journalText, activityTags sql.NullString
		var sleepBedTime, sleepWakeTime, exerciseJSON, coldShowerJSON, concertaJSON sql.NullString
		var createdAt, updatedAt string

		if err := rows.Scan(
			&rec.ID, &rec.UserID, &rec.RecordDate,
			&rec.WeightAM, &rec.WeightPM, &rec.WaistSize,
			&rec.SleepStartTime, &rec.SleepEndTime, &rec.SleepHours,
			&rec.SleepTag, &journalText, &activityTags,
			&sleepBedTime, &sleepWakeTime, &exerciseJSON, &coldShowerJSON, &concertaJSON,
			&createdAt, &updatedAt,
		); err != nil {
			return nil, fmt.Errorf("扫描记录数据失败: %w", err)
		}

		if journalText.Valid {
			rec.JournalText = journalText.String
		}
		if activityTags.Valid {
			rec.ActivityTags = activityTags.String
		}

		if rec.SleepStartTime == nil && sleepBedTime.Valid && sleepBedTime.String != "" {
			val := sleepBedTime.String
			rec.SleepStartTime = &val
		}
		if rec.SleepEndTime == nil && sleepWakeTime.Valid && sleepWakeTime.String != "" {
			val := sleepWakeTime.String
			rec.SleepEndTime = &val
		}

		if exerciseJSON.Valid && exerciseJSON.String != "" && exerciseJSON.String != "{}" {
			var ex model.ExerciseDetail
			if err := json.Unmarshal([]byte(exerciseJSON.String), &ex); err == nil {
				rec.Exercise = &ex
			}
		}
		if coldShowerJSON.Valid && coldShowerJSON.String != "" && coldShowerJSON.String != "{}" {
			var cs model.ColdShowerDetail
			if err := json.Unmarshal([]byte(coldShowerJSON.String), &cs); err == nil {
				rec.ColdShower = &cs
			}
		}
		if concertaJSON.Valid && concertaJSON.String != "" && concertaJSON.String != "{}" {
			var con model.ConcertaDetail
			if err := json.Unmarshal([]byte(concertaJSON.String), &con); err == nil {
				rec.Concerta = &con
			}
		}

		rec.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
		rec.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)
		records = append(records, rec)
	}

	return records, nil
}

// GetAll 导出全量数据
func (r *RecordRepository) GetAll(userID int64) ([]*model.HealthRecord, error) {
	return r.GetRange(userID, "1970-01-01", "2099-12-31")
}

// ImportUpsertRow 批量导入的写入单元：已完成预检、可直接落库的一行。
// ClearFields 为显式清空标记（CSV 中的 - / null），两种冲突模式下都会清空对应字段。
type ImportUpsertRow struct {
	Date            string
	DTO             model.SaveRecordDTO
	ClearFields     []string
	ActivityTags    string
	HasActivityTags bool
	SleepTag        string
}

// importExisting 事务内读取的既有记录，只取导入涉及的字段。
type importExisting struct {
	recordDate   string
	weightAM     *float64
	weightPM     *float64
	waistSize    *float64
	sleepStart   *string
	sleepEnd     *string
	sleepHours   *float64
	sleepTag     string
	journalText  string
	activityTags string
}

// ImportUpsertBatch 在单个事务内批量写入导入数据。
// 事务内先读既有记录再写，任何一步失败都会整体回滚（保证 0 行写入）。
// conflictMode 决定缺失字段的处理：merge 保留旧值，overwrite 清空；
// 运动 / 冷水澡 / 专注达等结构化扩展字段不参与导入，两种模式下均原样保留。
func (r *RecordRepository) ImportUpsertBatch(userID int64, rows []ImportUpsertRow, conflictMode string) (int, int, error) {
	if len(rows) == 0 {
		return 0, 0, nil
	}

	tx, err := r.db.Begin()
	if err != nil {
		return 0, 0, fmt.Errorf("开启导入事务失败: %w", err)
	}
	defer func() { _ = tx.Rollback() }()

	minDate, maxDate := rows[0].Date, rows[0].Date
	for i := range rows {
		if rows[i].Date < minDate {
			minDate = rows[i].Date
		}
		if rows[i].Date > maxDate {
			maxDate = rows[i].Date
		}
	}

	existing, err := importExistingRecords(tx, userID, minDate, maxDate)
	if err != nil {
		return 0, 0, err
	}

	inserted, updated := 0, 0
	for i := range rows {
		row := &rows[i]
		old := existing[row.Date]
		if old == nil {
			if err := importInsertRecord(tx, userID, row); err != nil {
				return 0, 0, err
			}
			inserted++
			continue
		}
		if err := importUpdateRecord(tx, userID, row, old, conflictMode); err != nil {
			return 0, 0, err
		}
		updated++
	}

	if err := tx.Commit(); err != nil {
		return 0, 0, fmt.Errorf("提交导入事务失败: %w", err)
	}
	return inserted, updated, nil
}

// importExistingRecords 事务内取出日期区间内的既有记录，按日期建索引。
func importExistingRecords(tx *sql.Tx, userID int64, minDate, maxDate string) (map[string]*importExisting, error) {
	query := `
	SELECT record_date, weight_am, weight_pm, waist_size,
	       COALESCE(NULLIF(sleep_start_time, ''), NULLIF(sleep_bed_time, '')),
	       COALESCE(NULLIF(sleep_end_time, ''), NULLIF(sleep_wake_time, '')),
	       sleep_hours, COALESCE(sleep_tag, ''),
	       COALESCE(journal_text, ''), COALESCE(activity_tags, '')
	FROM health_records
	WHERE user_id = ? AND record_date >= ? AND record_date <= ?
	`
	rows, err := tx.Query(query, userID, minDate, maxDate)
	if err != nil {
		return nil, fmt.Errorf("读取导入目标记录失败: %w", err)
	}
	defer rows.Close()

	result := make(map[string]*importExisting)
	for rows.Next() {
		rec := &importExisting{}
		var start, end sql.NullString
		if err := rows.Scan(
			&rec.recordDate, &rec.weightAM, &rec.weightPM, &rec.waistSize,
			&start, &end, &rec.sleepHours, &rec.sleepTag,
			&rec.journalText, &rec.activityTags,
		); err != nil {
			return nil, fmt.Errorf("扫描导入目标记录失败: %w", err)
		}
		if start.Valid {
			v := start.String
			rec.sleepStart = &v
		}
		if end.Valid {
			v := end.String
			rec.sleepEnd = &v
		}
		result[rec.recordDate] = rec
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历导入目标记录失败: %w", err)
	}
	return result, nil
}

const importInsertSQL = `
INSERT INTO health_records (
	user_id, record_date, weight_am, weight_pm, waist_size,
	sleep_start_time, sleep_end_time, sleep_hours, sleep_tag,
	journal_text, activity_tags,
	sleep_bed_time, sleep_wake_time, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`

// importInsertRecord 新增一行；扩展字段保持默认空值，不覆盖任何既有结构化数据。
func importInsertRecord(tx *sql.Tx, userID int64, row *ImportUpsertRow) error {
	tag := row.SleepTag
	if tag == "" {
		tag = "GREEN"
	}
	activityTags := ""
	if row.HasActivityTags {
		activityTags = row.ActivityTags
	}
	_, err := tx.Exec(importInsertSQL,
		userID, row.Date, row.DTO.WeightAM, row.DTO.WeightPM, row.DTO.WaistSize,
		row.DTO.SleepStartTime, row.DTO.SleepEndTime, row.DTO.SleepHours, tag,
		stringValue(row.DTO.JournalText), activityTags,
		stringValue(row.DTO.SleepStartTime), stringValue(row.DTO.SleepEndTime),
	)
	if err != nil {
		return fmt.Errorf("导入新增 %s 失败: %w", row.Date, err)
	}
	return nil
}

const importUpdateSQL = `
UPDATE health_records SET
	weight_am = ?, weight_pm = ?, waist_size = ?,
	sleep_start_time = ?, sleep_end_time = ?, sleep_hours = ?, sleep_tag = ?,
	journal_text = ?, activity_tags = ?,
	sleep_bed_time = ?, sleep_wake_time = ?,
	updated_at = CURRENT_TIMESTAMP
WHERE user_id = ? AND record_date = ?
`

// importUpdateRecord 按冲突模式合并既有行。
func importUpdateRecord(tx *sql.Tx, userID int64, row *ImportUpsertRow, old *importExisting, mode string) error {
	cleared := make(map[string]bool, len(row.ClearFields))
	for _, field := range row.ClearFields {
		cleared[field] = true
	}

	weightAM := resolveImportFloat(mode, row.DTO.WeightAM, old.weightAM, cleared["weight_am"])
	weightPM := resolveImportFloat(mode, row.DTO.WeightPM, old.weightPM, cleared["weight_pm"])
	waistSize := resolveImportFloat(mode, row.DTO.WaistSize, old.waistSize, cleared["waist_size"])
	sleepHours := resolveImportFloat(mode, row.DTO.SleepHours, old.sleepHours, cleared["sleep_hours"])
	sleepStart := resolveImportString(mode, row.DTO.SleepStartTime, old.sleepStart, cleared["sleep_start_time"])
	sleepEnd := resolveImportString(mode, row.DTO.SleepEndTime, old.sleepEnd, cleared["sleep_end_time"])
	journal := resolveImportString(mode, row.DTO.JournalText, stringPtr(old.journalText, old.journalText != ""), cleared["journal_text"])

	activityTags := old.activityTags
	if cleared["activity_tags"] {
		activityTags = ""
	} else if row.HasActivityTags {
		activityTags = row.ActivityTags
	} else if mode == model.ImportConflictOverwrite {
		activityTags = ""
	}

	_, err := tx.Exec(importUpdateSQL,
		weightAM, weightPM, waistSize,
		sleepStart, sleepEnd, sleepHours, resolveImportSleepTag(mode, row, old, cleared),
		stringValue(journal), activityTags,
		stringValue(sleepStart), stringValue(sleepEnd),
		userID, row.Date,
	)
	if err != nil {
		return fmt.Errorf("导入更新 %s 失败: %w", row.Date, err)
	}
	return nil
}

// resolveImportFloat 计算数值字段的最终值：显式清空优先；缺失字段 merge 保留旧值、overwrite 清空。
func resolveImportFloat(mode string, newVal, oldVal *float64, cleared bool) *float64 {
	if cleared {
		return nil
	}
	if newVal != nil {
		return newVal
	}
	if mode == model.ImportConflictOverwrite {
		return nil
	}
	return oldVal
}

// resolveImportString 同 resolveImportFloat，用于文本与时间字段。
func resolveImportString(mode string, newVal, oldVal *string, cleared bool) *string {
	if cleared {
		return nil
	}
	if newVal != nil {
		return newVal
	}
	if mode == model.ImportConflictOverwrite {
		return nil
	}
	return oldVal
}

// resolveImportSleepTag 就寝时间变化时按阈值重算；清空或覆盖缺失时回落到 GREEN。
func resolveImportSleepTag(mode string, row *ImportUpsertRow, old *importExisting, cleared map[string]bool) string {
	if row.DTO.SleepStartTime != nil && row.SleepTag != "" {
		return row.SleepTag
	}
	if cleared["sleep_start_time"] || mode == model.ImportConflictOverwrite {
		return "GREEN"
	}
	if old.sleepTag != "" {
		return old.sleepTag
	}
	return "GREEN"
}

func stringValue(p *string) string {
	if p == nil {
		return ""
	}
	return *p
}

func stringPtr(v string, valid bool) *string {
	if !valid {
		return nil
	}
	return &v
}
