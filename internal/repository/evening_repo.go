package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"healthtrack/internal/model"
)

// EveningRepository 睡前小结与图片持久层
type EveningRepository struct {
	db *sql.DB
}

func NewEveningRepository(db *sql.DB) *EveningRepository {
	return &EveningRepository{db: db}
}

const eveningSummaryColumns = `id, user_id, record_date, done_1, done_2, done_3, note_text, score, photo_id, created_at, updated_at`

// scanEveningSummary 将一行扫描结果映射为实体。
func scanEveningSummary(scanner interface{ Scan(dest ...any) error }) (*model.EveningSummary, error) {
	s := &model.EveningSummary{}
	var done1, done2, done3, note sql.NullString
	var photoID sql.NullInt64
	var createdAt, updatedAt sql.NullString

	if err := scanner.Scan(
		&s.ID, &s.UserID, &s.RecordDate,
		&done1, &done2, &done3, &note,
		&s.Score, &photoID, &createdAt, &updatedAt,
	); err != nil {
		return nil, err
	}

	s.DoneItems = []string{done1.String, done2.String, done3.String}
	s.NoteText = note.String
	if photoID.Valid {
		id := photoID.Int64
		s.PhotoID = &id
	}
	s.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt.String)
	s.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt.String)
	return s, nil
}

// GetByDate 按日期查询单篇小结，不存在返回 (nil, nil)。
func (r *EveningRepository) GetByDate(userID int64, date string) (*model.EveningSummary, error) {
	row := r.db.QueryRow(
		`SELECT `+eveningSummaryColumns+` FROM evening_summaries WHERE user_id = ? AND record_date = ? LIMIT 1`,
		userID, date,
	)
	s, err := scanEveningSummary(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("查询睡前小结失败: %w", err)
	}
	return s, nil
}

// ListAll 查询全部小结，按日期倒序（列表载荷很小，一次性返回由前端筛选分页）。
func (r *EveningRepository) ListAll(userID int64) ([]*model.EveningSummary, error) {
	rows, err := r.db.Query(
		`SELECT `+eveningSummaryColumns+` FROM evening_summaries WHERE user_id = ? ORDER BY record_date DESC`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("查询小结列表失败: %w", err)
	}
	defer rows.Close()

	items := make([]*model.EveningSummary, 0)
	for rows.Next() {
		s, err := scanEveningSummary(rows)
		if err != nil {
			return nil, fmt.Errorf("扫描小结数据失败: %w", err)
		}
		items = append(items, s)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历小结数据失败: %w", err)
	}
	return items, nil
}

// Upsert 按日期插入或整体覆盖更新一篇小结。
func (r *EveningRepository) Upsert(userID int64, dto *model.SaveEveningDTO) (*model.EveningSummary, error) {
	done := func(i int) any {
		if i < len(dto.DoneItems) {
			return dto.DoneItems[i]
		}
		return ""
	}

	var photoID any
	if dto.PhotoID != nil {
		photoID = *dto.PhotoID
	}

	_, err := r.db.Exec(`
		INSERT INTO evening_summaries (user_id, record_date, done_1, done_2, done_3, note_text, score, photo_id, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(user_id, record_date) DO UPDATE SET
			done_1 = excluded.done_1,
			done_2 = excluded.done_2,
			done_3 = excluded.done_3,
			note_text = excluded.note_text,
			score = excluded.score,
			photo_id = excluded.photo_id,
			updated_at = CURRENT_TIMESTAMP`,
		userID, dto.RecordDate, done(0), done(1), done(2), dto.NoteText, dto.Score, photoID,
	)
	if err != nil {
		return nil, fmt.Errorf("保存睡前小结失败: %w", err)
	}
	return r.GetByDate(userID, dto.RecordDate)
}

// DeleteByDate 删除某日小结，并同步清理该日图片（一天一张）。返回删除的小结行数。
func (r *EveningRepository) DeleteByDate(userID int64, date string) (int64, error) {
	res, err := r.db.Exec(`DELETE FROM evening_summaries WHERE user_id = ? AND record_date = ?`, userID, date)
	if err != nil {
		return 0, fmt.Errorf("删除睡前小结失败: %w", err)
	}
	affected, _ := res.RowsAffected()

	if _, err := r.db.Exec(`DELETE FROM evening_photos WHERE user_id = ? AND record_date = ?`, userID, date); err != nil {
		return affected, fmt.Errorf("清理小结图片失败: %w", err)
	}
	return affected, nil
}

// SavePhoto 保存/替换某日图片（一天一张），并同步已存在小结的 photo_id 指向。
func (r *EveningRepository) SavePhoto(userID int64, date, mime string, data []byte) (int64, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return 0, fmt.Errorf("开启事务失败: %w", err)
	}
	defer tx.Rollback()

	// 替换语义：先删除该日旧图
	if _, err := tx.Exec(`DELETE FROM evening_photos WHERE user_id = ? AND record_date = ?`, userID, date); err != nil {
		return 0, fmt.Errorf("替换旧图片失败: %w", err)
	}

	res, err := tx.Exec(
		`INSERT INTO evening_photos (user_id, record_date, mime, data) VALUES (?, ?, ?, ?)`,
		userID, date, mime, data,
	)
	if err != nil {
		return 0, fmt.Errorf("写入图片失败: %w", err)
	}
	newID, err := res.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("获取图片 ID 失败: %w", err)
	}

	if _, err := tx.Exec(
		`UPDATE evening_summaries SET photo_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND record_date = ?`,
		newID, userID, date,
	); err != nil {
		return 0, fmt.Errorf("关联小结图片失败: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return 0, fmt.Errorf("提交图片事务失败: %w", err)
	}
	return newID, nil
}

// GetPhoto 读取图片二进制，不存在返回 (("", nil, nil))。
func (r *EveningRepository) GetPhoto(userID, id int64) (string, []byte, error) {
	var mime string
	var data []byte
	err := r.db.QueryRow(
		`SELECT mime, data FROM evening_photos WHERE user_id = ? AND id = ?`, userID, id,
	).Scan(&mime, &data)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", nil, nil
		}
		return "", nil, fmt.Errorf("读取图片失败: %w", err)
	}
	return mime, data, nil
}

// DeletePhoto 删除图片，并解除小结对该图的引用。返回删除行数。
func (r *EveningRepository) DeletePhoto(userID, id int64) (int64, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return 0, fmt.Errorf("开启事务失败: %w", err)
	}
	defer tx.Rollback()

	res, err := tx.Exec(`DELETE FROM evening_photos WHERE user_id = ? AND id = ?`, userID, id)
	if err != nil {
		return 0, fmt.Errorf("删除图片失败: %w", err)
	}
	affected, _ := res.RowsAffected()

	if _, err := tx.Exec(`UPDATE evening_summaries SET photo_id = NULL WHERE user_id = ? AND photo_id = ?`, userID, id); err != nil {
		return 0, fmt.Errorf("解除小结图片引用失败: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return 0, fmt.Errorf("提交删除事务失败: %w", err)
	}
	return affected, nil
}
