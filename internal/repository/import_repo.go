package repository

import (
	"database/sql"
	"fmt"
	"healthtrack/internal/model"
	"time"
)

// ImportRepository 负责批量导入批次的审计与状态流转。
type ImportRepository struct {
	db *sql.DB
}

func NewImportRepository(db *sql.DB) *ImportRepository {
	return &ImportRepository{db: db}
}

const importBatchColumns = `
	id, user_id, source_type, file_name, file_hash, file_size,
	total_rows, inserted, updated, skipped, warnings, errors,
	conflict_mode, skip_errors, status, error_message, detail_json, cache_path,
	root_batch_id, attempt_no, created_at, finished_at
`

// Create 新增一条 pending 批次，并回填自增 ID。
func (r *ImportRepository) Create(b *model.ImportBatch) error {
	res, err := r.db.Exec(`
		INSERT INTO import_batches (
			user_id, source_type, file_name, file_hash, file_size,
			total_rows, inserted, updated, skipped, warnings, errors,
			conflict_mode, skip_errors, status, error_message, detail_json, cache_path,
			root_batch_id, attempt_no
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		b.UserID, b.SourceType, b.FileName, b.FileHash, b.FileSize,
		b.TotalRows, b.Inserted, b.Updated, b.Skipped, b.Warnings, b.Errors,
		b.ConflictMode, b.SkipErrors, b.Status, b.ErrorMessage, b.DetailJSON, b.CachePath,
		b.RootBatchID, b.AttemptNo,
	)
	if err != nil {
		return fmt.Errorf("创建导入批次失败: %w", err)
	}
	id, err := res.LastInsertId()
	if err != nil {
		return fmt.Errorf("获取导入批次 ID 失败: %w", err)
	}
	b.ID = id
	return nil
}

// UpdateResult 写入最终状态与统计结果。只在 pending 状态下生效，避免重试覆盖历史。
func (r *ImportRepository) UpdateResult(b *model.ImportBatch) error {
	res, err := r.db.Exec(`
		UPDATE import_batches SET
			total_rows = ?, inserted = ?, updated = ?, skipped = ?, warnings = ?, errors = ?,
			status = ?, error_message = ?, detail_json = ?, cache_path = ?,
			finished_at = CURRENT_TIMESTAMP
		WHERE id = ? AND user_id = ? AND status = ?
	`,
		b.TotalRows, b.Inserted, b.Updated, b.Skipped, b.Warnings, b.Errors,
		b.Status, b.ErrorMessage, b.DetailJSON, b.CachePath,
		b.ID, b.UserID, model.ImportStatusPending,
	)
	if err != nil {
		return fmt.Errorf("更新导入批次失败: %w", err)
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("读取导入批次更新结果失败: %w", err)
	}
	if affected == 0 {
		return fmt.Errorf("导入批次 %d 不存在或已结束", b.ID)
	}
	return nil
}

// SetCachePath 记录失败原文件的缓存路径，供一键重试使用。
func (r *ImportRepository) SetCachePath(id int64, path string) error {
	if _, err := r.db.Exec(`UPDATE import_batches SET cache_path = ? WHERE id = ?`, path, id); err != nil {
		return fmt.Errorf("更新导入批次缓存路径失败: %w", err)
	}
	return nil
}

// GetByID 按 ID 查询批次；不存在时返回 nil, nil。
func (r *ImportRepository) GetByID(userID, id int64) (*model.ImportBatch, error) {
	row := r.db.QueryRow(`
		SELECT `+importBatchColumns+`
		FROM import_batches WHERE id = ? AND user_id = ? LIMIT 1
	`, id, userID)
	b, err := scanImportBatch(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("查询导入批次失败: %w", err)
	}
	return b, nil
}

// FindLatestByHash 查询同一文件哈希下最近一次导入，用于重复导入提醒与失败重试。
func (r *ImportRepository) FindLatestByHash(userID int64, hash string) (*model.ImportBatch, error) {
	if hash == "" {
		return nil, nil
	}
	row := r.db.QueryRow(`
		SELECT `+importBatchColumns+`
		FROM import_batches WHERE user_id = ? AND file_hash = ?
		ORDER BY id DESC LIMIT 1
	`, userID, hash)
	b, err := scanImportBatch(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("查询重复导入批次失败: %w", err)
	}
	return b, nil
}

// List 倒序返回最近的导入批次。
func (r *ImportRepository) List(userID int64, limit int) ([]*model.ImportBatch, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	rows, err := r.db.Query(`
		SELECT `+importBatchColumns+`
		FROM import_batches WHERE user_id = ?
		ORDER BY id DESC LIMIT ?
	`, userID, limit)
	if err != nil {
		return nil, fmt.Errorf("查询导入批次列表失败: %w", err)
	}
	defer rows.Close()

	batches := make([]*model.ImportBatch, 0, limit)
	for rows.Next() {
		b, err := scanImportBatch(rows)
		if err != nil {
			return nil, fmt.Errorf("扫描导入批次失败: %w", err)
		}
		batches = append(batches, b)
	}
	return batches, nil
}

// MarkPendingInterrupted 服务启动时调用：上次进程退出时仍处于 pending 的批次，
// 其事务已被 SQLite 回滚，统一标记为中断，便于用户重试。
func (r *ImportRepository) MarkPendingInterrupted(userID int64) (int64, error) {
	res, err := r.db.Exec(`
		UPDATE import_batches SET
			status = ?, error_message = ?, finished_at = CURRENT_TIMESTAMP
		WHERE user_id = ? AND status = ?
	`, model.ImportStatusInterrupted, "服务重启，导入中断（事务已回滚，未写入任何数据）", userID, model.ImportStatusPending)
	if err != nil {
		return 0, fmt.Errorf("标记中断导入批次失败: %w", err)
	}
	affected, _ := res.RowsAffected()
	return affected, nil
}

// scanImportBatch 统一扫描批次字段，兼容 SQLite 的时间文本格式与可空时间。
func scanImportBatch(scanner interface {
	Scan(dest ...any) error
}) (*model.ImportBatch, error) {
	b := &model.ImportBatch{}
	var createdAt string
	var finishedAt sql.NullString
	var rootID sql.NullInt64
	var skipErrors int

	err := scanner.Scan(
		&b.ID, &b.UserID, &b.SourceType, &b.FileName, &b.FileHash, &b.FileSize,
		&b.TotalRows, &b.Inserted, &b.Updated, &b.Skipped, &b.Warnings, &b.Errors,
		&b.ConflictMode, &skipErrors, &b.Status, &b.ErrorMessage, &b.DetailJSON, &b.CachePath,
		&rootID, &b.AttemptNo, &createdAt, &finishedAt,
	)
	if err != nil {
		return nil, err
	}

	b.SkipErrors = skipErrors != 0
	if rootID.Valid {
		val := rootID.Int64
		b.RootBatchID = &val
	}
	b.CreatedAt = parseSQLiteTime(createdAt)
	if finishedAt.Valid {
		if t := parseSQLiteTime(finishedAt.String); !t.IsZero() {
			b.FinishedAt = &t
		}
	}
	return b, nil
}

// parseSQLiteTime 兼容驱动可能返回的两种时间文本：
// RFC3339（modernc 会把 DATETIME 解析为 time.Time 再转字符串）与 SQLite 默认格式。
func parseSQLiteTime(s string) time.Time {
	if s == "" {
		return time.Time{}
	}
	layouts := []string{
		"2006-01-02 15:04:05",
		time.RFC3339Nano,
		"2006-01-02T15:04:05",
	}
	for _, layout := range layouts {
		if t, err := time.Parse(layout, s); err == nil {
			return t
		}
	}
	return time.Time{}
}
