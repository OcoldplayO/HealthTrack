package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"healthtrack/internal/model"
)

// InsightRepository AI 洞察历史存档持久层
type InsightRepository struct {
	db *sql.DB
}

func NewInsightRepository(db *sql.DB) *InsightRepository {
	return &InsightRepository{db: db}
}

// Insert 新增一条洞察存档，返回自增主键
func (r *InsightRepository) Insert(in *model.AIInsight) (int64, error) {
	res, err := r.db.Exec(`
		INSERT INTO ai_insights (user_id, range_days, start_date, end_date, content, thinking, model)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		in.UserID, in.RangeDays, in.StartDate, in.EndDate, in.Content, in.Thinking, in.Model,
	)
	if err != nil {
		return 0, fmt.Errorf("写入洞察存档失败: %w", err)
	}
	return res.LastInsertId()
}

// List 游标分页查询（按 id 倒序）。为避免列表载荷过大，正文只返回预览片段，思维链不下发。
// 返回 (列表, 是否还有更多, 错误)。
func (r *InsightRepository) List(userID int64, limit int, beforeID int64, rangeDays int, keyword string) ([]*model.AIInsight, bool, error) {
	if limit <= 0 || limit > 50 {
		limit = 10
	}

	var sb strings.Builder
	sb.WriteString(`SELECT id, user_id, range_days, start_date, end_date, content, model, created_at
		FROM ai_insights WHERE user_id = ?`)
	args := []any{userID}

	if beforeID > 0 {
		sb.WriteString(" AND id < ?")
		args = append(args, beforeID)
	}
	if rangeDays > 0 {
		sb.WriteString(" AND range_days = ?")
		args = append(args, rangeDays)
	}
	if keyword = strings.TrimSpace(keyword); keyword != "" {
		sb.WriteString(" AND content LIKE ?")
		args = append(args, "%"+keyword+"%")
	}
	sb.WriteString(" ORDER BY id DESC LIMIT ?")
	args = append(args, limit+1) // 多取一条用于判断 has_more

	rows, err := r.db.Query(sb.String(), args...)
	if err != nil {
		return nil, false, fmt.Errorf("查询洞察列表失败: %w", err)
	}
	defer rows.Close()

	items := make([]*model.AIInsight, 0, limit)
	for rows.Next() {
		it := &model.AIInsight{}
		var startDate, endDate, content, modelName sql.NullString
		var createdAt sql.NullTime
		if err := rows.Scan(&it.ID, &it.UserID, &it.RangeDays, &startDate, &endDate, &content, &modelName, &createdAt); err != nil {
			return nil, false, fmt.Errorf("扫描洞察数据失败: %w", err)
		}
		it.StartDate = startDate.String
		it.EndDate = endDate.String
		it.Content = previewText(content.String, 120)
		it.Model = modelName.String
		if createdAt.Valid {
			it.CreatedAt = createdAt.Time
		}
		items = append(items, it)
	}
	if err := rows.Err(); err != nil {
		return nil, false, fmt.Errorf("遍历洞察数据失败: %w", err)
	}

	hasMore := len(items) > limit
	if hasMore {
		items = items[:limit]
	}
	return items, hasMore, nil
}

// Get 查询单条洞察全文（含思维链）
func (r *InsightRepository) Get(userID, id int64) (*model.AIInsight, error) {
	row := r.db.QueryRow(`
		SELECT id, user_id, range_days, start_date, end_date, content, thinking, model, created_at
		FROM ai_insights WHERE user_id = ? AND id = ? LIMIT 1`, userID, id)

	it := &model.AIInsight{}
	var startDate, endDate, content, thinking, modelName sql.NullString
	var createdAt sql.NullTime
	if err := row.Scan(&it.ID, &it.UserID, &it.RangeDays, &startDate, &endDate, &content, &thinking, &modelName, &createdAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("查询洞察详情失败: %w", err)
	}
	it.StartDate = startDate.String
	it.EndDate = endDate.String
	it.Content = content.String
	it.Thinking = thinking.String
	it.Model = modelName.String
	if createdAt.Valid {
		it.CreatedAt = createdAt.Time
	}
	return it, nil
}

// Delete 删除单条洞察，返回受影响行数
func (r *InsightRepository) Delete(userID, id int64) (int64, error) {
	res, err := r.db.Exec(`DELETE FROM ai_insights WHERE user_id = ? AND id = ?`, userID, id)
	if err != nil {
		return 0, fmt.Errorf("删除洞察失败: %w", err)
	}
	return res.RowsAffected()
}

// DeleteMany 批量删除洞察，返回受影响行数
func (r *InsightRepository) DeleteMany(userID int64, ids []int64) (int64, error) {
	if len(ids) == 0 {
		return 0, nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, 0, len(ids)+1)
	args = append(args, userID)
	for i, id := range ids {
		placeholders[i] = "?"
		args = append(args, id)
	}

	query := fmt.Sprintf("DELETE FROM ai_insights WHERE user_id = ? AND id IN (%s)", strings.Join(placeholders, ","))
	res, err := r.db.Exec(query, args...)
	if err != nil {
		return 0, fmt.Errorf("批量删除洞察失败: %w", err)
	}
	return res.RowsAffected()
}

// previewText 截取正文前 n 个字符作为列表预览
func previewText(s string, n int) string {
	runes := []rune(s)
	if len(runes) <= n {
		return s
	}
	return string(runes[:n])
}
