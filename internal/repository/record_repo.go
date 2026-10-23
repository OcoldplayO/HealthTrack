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

// ImportUpsertSummary 睡前小结的写入单元。照片不参与导入，PhotoID 保持为空。
type ImportUpsertSummary struct {
	Date      string
	DoneItems []string
	NoteText  string
	Score     int
}

// ImportWriteCounts 批量写入的实际行数。
type ImportWriteCounts struct {
	Inserted        int
	Updated         int
	SummaryInserted int
	SummaryUpdated  int
}

// importExisting 事务内读取的既有记录，只取导入涉及的字段。
type importExisting struct {
	recordDate     string
	weightAM       *float64
	weightPM       *float64
	waistSize      *float64
	sleepStart     *string
	sleepEnd       *string
	sleepHours     *float64
	sleepTag       string
	journalText    string
	activityTags   string
	exerciseJSON   string
	coldShowerJSON string
	concertaJSON   string
}

// importExistingSummary 事务内读取的既有睡前小结。
type importExistingSummary struct {
	done  [3]string
	note  string
	score int
}

// ImportUpsertBatch 在单个事务内批量写入导入数据（健康记录 + 睡前小结）。
// 事务内先读既有记录再写，任何一步失败都会整体回滚（保证 0 行写入）。
// conflictMode 决定缺失字段的处理：merge 保留旧值，overwrite 清空；
// 运动 / 冷水澡 / 专注达等结构化扩展字段仅在导入数据中携带时覆盖，不会被清空。
func (r *RecordRepository) ImportUpsertBatch(userID int64, rows []ImportUpsertRow, summaries []ImportUpsertSummary, conflictMode string) (ImportWriteCounts, error) {
	var counts ImportWriteCounts
	if len(rows) == 0 && len(summaries) == 0 {
		return counts, nil
	}

	tx, err := r.db.Begin()
	if err != nil {
		return counts, fmt.Errorf("开启导入事务失败: %w", err)
	}
	defer func() { _ = tx.Rollback() }()

	minDate, maxDate := "", ""
	extendRange := func(date string) {
		if date == "" {
			return
		}
		if minDate == "" || date < minDate {
			minDate = date
		}
		if maxDate == "" || date > maxDate {
			maxDate = date
		}
	}
	for i := range rows {
		extendRange(rows[i].Date)
	}
	for i := range summaries {
		extendRange(summaries[i].Date)
	}

	existing, err := importExistingRecords(tx, userID, minDate, maxDate)
	if err != nil {
		return counts, err
	}
	existingSummaries, err := importExistingSummaries(tx, userID, minDate, maxDate)
	if err != nil {
		return counts, err
	}

	for i := range rows {
		row := &rows[i]
		old := existing[row.Date]
		if old == nil {
			if err := importInsertRecord(tx, userID, row); err != nil {
				return ImportWriteCounts{}, err
			}
			counts.Inserted++
			continue
		}
		if err := importUpdateRecord(tx, userID, row, old, conflictMode); err != nil {
			return ImportWriteCounts{}, err
		}
		counts.Updated++
	}

	counts.SummaryInserted, counts.SummaryUpdated, err = importWriteSummaries(tx, userID, summaries, existingSummaries, conflictMode)
	if err != nil {
		return ImportWriteCounts{}, err
	}

	if err := tx.Commit(); err != nil {
		return ImportWriteCounts{}, fmt.Errorf("提交导入事务失败: %w", err)
	}
	return counts, nil
}

// importExistingRecords 事务内取出日期区间内的既有记录，按日期建索引。
func importExistingRecords(tx *sql.Tx, userID int64, minDate, maxDate string) (map[string]*importExisting, error) {
	if minDate == "" {
		return map[string]*importExisting{}, nil
	}
	query := `
	SELECT record_date, weight_am, weight_pm, waist_size,
	       COALESCE(NULLIF(sleep_start_time, ''), NULLIF(sleep_bed_time, '')),
	       COALESCE(NULLIF(sleep_end_time, ''), NULLIF(sleep_wake_time, '')),
	       sleep_hours, COALESCE(sleep_tag, ''),
	       COALESCE(journal_text, ''), COALESCE(activity_tags, ''),
	       COALESCE(exercise_json, '{}'), COALESCE(cold_shower_json, '{}'), COALESCE(concerta_json, '{}')
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
			&rec.exerciseJSON, &rec.coldShowerJSON, &rec.concertaJSON,
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

// importExistingSummaries 事务内取出日期区间内的既有睡前小结。
func importExistingSummaries(tx *sql.Tx, userID int64, minDate, maxDate string) (map[string]*importExistingSummary, error) {
	result := make(map[string]*importExistingSummary)
	if minDate == "" {
		return result, nil
	}
	rows, err := tx.Query(`
		SELECT record_date, COALESCE(done_1, ''), COALESCE(done_2, ''), COALESCE(done_3, ''),
		       COALESCE(note_text, ''), COALESCE(score, 0)
		FROM evening_summaries
		WHERE user_id = ? AND record_date >= ? AND record_date <= ?
	`, userID, minDate, maxDate)
	if err != nil {
		return nil, fmt.Errorf("读取导入目标小结失败: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		rec := &importExistingSummary{}
		var date string
		if err := rows.Scan(&date, &rec.done[0], &rec.done[1], &rec.done[2], &rec.note, &rec.score); err != nil {
			return nil, fmt.Errorf("扫描导入目标小结失败: %w", err)
		}
		result[date] = rec
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历导入目标小结失败: %w", err)
	}
	return result, nil
}

// importWriteSummaries 写入睡前小结，返回新增与更新数量。
func importWriteSummaries(tx *sql.Tx, userID int64, summaries []ImportUpsertSummary, existing map[string]*importExistingSummary, mode string) (int, int, error) {
	inserted, updated := 0, 0
	for i := range summaries {
		s := &summaries[i]
		done := summaryDoneItems(s.DoneItems)
		old := existing[s.Date]
		if old == nil {
			if _, err := tx.Exec(`
				INSERT INTO evening_summaries (user_id, record_date, done_1, done_2, done_3, note_text, score, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
			`, userID, s.Date, done[0], done[1], done[2], s.NoteText, s.Score); err != nil {
				return 0, 0, fmt.Errorf("导入新增小结 %s 失败: %w", s.Date, err)
			}
			inserted++
			continue
		}

		finalDone, finalNote, finalScore := old.done, old.note, old.score
		if mode == model.ImportConflictOverwrite {
			finalDone, finalNote, finalScore = done, s.NoteText, s.Score
		} else {
			if hasDoneItems(done) {
				finalDone = done
			}
			if s.NoteText != "" {
				finalNote = s.NoteText
			}
			if s.Score > 0 {
				finalScore = s.Score
			}
		}

		if _, err := tx.Exec(`
			UPDATE evening_summaries SET
				done_1 = ?, done_2 = ?, done_3 = ?, note_text = ?, score = ?,
				updated_at = CURRENT_TIMESTAMP
			WHERE user_id = ? AND record_date = ?
		`, finalDone[0], finalDone[1], finalDone[2], finalNote, finalScore, userID, s.Date); err != nil {
			return 0, 0, fmt.Errorf("导入更新小结 %s 失败: %w", s.Date, err)
		}
		updated++
	}
	return inserted, updated, nil
}

// summaryDoneItems 把完成事项裁剪为固定 3 个槽位。
func summaryDoneItems(items []string) [3]string {
	var done [3]string
	for i := 0; i < len(items) && i < 3; i++ {
		done[i] = items[i]
	}
	return done
}

func hasDoneItems(done [3]string) bool {
	return done[0] != "" || done[1] != "" || done[2] != ""
}

const importInsertSQL = `
INSERT INTO health_records (
	user_id, record_date, weight_am, weight_pm, waist_size,
	sleep_start_time, sleep_end_time, sleep_hours, sleep_tag,
	journal_text, activity_tags,
	sleep_bed_time, sleep_wake_time, exercise_json, cold_shower_json, concerta_json,
	updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`

// importInsertRecord 新增一行；结构化扩展字段仅在备份携带时写入。
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
		marshalImportExt(row.DTO.Exercise, "{}"),
		marshalImportExt(row.DTO.ColdShower, "{}"),
		marshalImportExt(row.DTO.Concerta, "{}"),
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
	exercise_json = ?, cold_shower_json = ?, concerta_json = ?,
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
		marshalImportExt(row.DTO.Exercise, old.exerciseJSON),
		marshalImportExt(row.DTO.ColdShower, old.coldShowerJSON),
		marshalImportExt(row.DTO.Concerta, old.concertaJSON),
		userID, row.Date,
	)
	if err != nil {
		return fmt.Errorf("导入更新 %s 失败: %w", row.Date, err)
	}
	return nil
}

// marshalImportExt 序列化结构化扩展字段；导入数据未携带时沿用旧值，避免误清空。
func marshalImportExt(v any, fallback string) string {
	if v == nil {
		if fallback == "" {
			return "{}"
		}
		return fallback
	}
	b, err := json.Marshal(v)
	if err != nil {
		return fallback
	}
	return string(b)
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
