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

