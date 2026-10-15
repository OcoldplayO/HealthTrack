package repository

import (
	"database/sql"
	"encoding/json"
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
	scope := in.Scope
	if scope == "" {
		scope = "health"
	}
	metaJSON := strings.TrimSpace(in.MetaJSON)
	if metaJSON == "" {
		metaJSON = "{}"
	}
	res, err := r.db.Exec(`
		INSERT INTO ai_insights (user_id, scope, range_days, start_date, end_date, content, thinking, model, meta_json)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		in.UserID, scope, in.RangeDays, in.StartDate, in.EndDate, in.Content, in.Thinking, in.Model, metaJSON,
	)
	if err != nil {
		return 0, fmt.Errorf("写入洞察存档失败: %w", err)
	}
	return res.LastInsertId()
}

// List 游标分页查询（按 id 倒序）。为避免列表载荷过大，正文只返回预览片段，思维链不下发。
// scope 为空时默认 "health"，避免睡前小结洞察混入「洞察」页历史列表。
// 返回 (列表, 是否还有更多, 错误)。
func (r *InsightRepository) List(userID int64, scope string, limit int, beforeID int64, rangeDays int, keyword string) ([]*model.AIInsight, bool, error) {
	if limit <= 0 || limit > 50 {
		limit = 10
	}
	if scope == "" {
		scope = "health"
	}

	var sb strings.Builder
	sb.WriteString(`SELECT id, user_id, scope, range_days, start_date, end_date, content, model, created_at, meta_json
		FROM ai_insights WHERE user_id = ? AND scope = ?`)
	args := []any{userID, scope}

	if beforeID > 0 {
		sb.WriteString(" AND id < ?")
		args = append(args, beforeID)
	}
	// 阶段对比记录的 range_days 恒为 0，不参与 7/30/60 档位筛选（其窗口以 meta_json 的月 A/月 B 为准）
	if rangeDays > 0 && scope != "compare" {
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
		var scopeVal, startDate, endDate, content, modelName, metaJSON sql.NullString
		var createdAt sql.NullTime
		if err := rows.Scan(&it.ID, &it.UserID, &scopeVal, &it.RangeDays, &startDate, &endDate, &content, &modelName, &createdAt, &metaJSON); err != nil {
			return nil, false, fmt.Errorf("扫描洞察数据失败: %w", err)
		}
		it.Scope = scopeVal.String
		it.StartDate = startDate.String
		it.EndDate = endDate.String
		it.Content = previewText(content.String, 120)
		it.Model = modelName.String
		it.MetaJSON = metaJSON.String
		it.Meta = parseCompareMeta(metaJSON.String)
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

// GetByPeriod 查询指定档位 + 指定分析周期（窗口首日 ~ 截止日）下最新生成的一条洞察（含全文）。
// startDate/endDate 为该周期的窗口边界，二者由上层按档位换算后传入。
// 同时校验 start_date 与 end_date：一是精确锁定周期，避免不同档位互相串扰；
// 二是天然排除按旧规则（end_date 存"最后一条记录日期"）落库的历史数据。
// 同一周期允许存在多条（重新生成即新增），此处只取最新一条用于洞察页回显。
// 不存在时返回 (nil, nil)，供上层直接判定「该周期尚未生成」。
func (r *InsightRepository) GetByPeriod(userID int64, scope string, rangeDays int, startDate, endDate string) (*model.AIInsight, error) {
	if scope == "" {
		scope = "health"
	}

	row := r.db.QueryRow(`
		SELECT id, user_id, scope, range_days, start_date, end_date, content, thinking, model, created_at
		FROM ai_insights
		WHERE user_id = ? AND scope = ? AND range_days = ?
		  AND start_date = ? AND end_date = ?
		ORDER BY id DESC LIMIT 1`, userID, scope, rangeDays, startDate, endDate)

	it := &model.AIInsight{}
	var scopeVal, startDateVal, endDateVal, content, thinking, modelName sql.NullString
	var createdAt sql.NullTime
	if err := row.Scan(&it.ID, &it.UserID, &scopeVal, &it.RangeDays, &startDateVal, &endDateVal, &content, &thinking, &modelName, &createdAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("查询周期洞察失败: %w", err)
	}
	it.Scope = scopeVal.String
	it.StartDate = startDateVal.String
	it.EndDate = endDateVal.String
	it.Content = content.String
	it.Thinking = thinking.String
	it.Model = modelName.String
	if createdAt.Valid {
		it.CreatedAt = createdAt.Time
	}
	return it, nil
}

// Get 查询单条洞察全文（含思维链）
func (r *InsightRepository) Get(userID, id int64) (*model.AIInsight, error) {
	row := r.db.QueryRow(`
		SELECT id, user_id, range_days, start_date, end_date, content, thinking, model, created_at, meta_json
		FROM ai_insights WHERE user_id = ? AND id = ? LIMIT 1`, userID, id)

	it := &model.AIInsight{}
	var startDate, endDate, content, thinking, modelName, metaJSON sql.NullString
	var createdAt sql.NullTime
	if err := row.Scan(&it.ID, &it.UserID, &it.RangeDays, &startDate, &endDate, &content, &thinking, &modelName, &createdAt, &metaJSON); err != nil {
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
	it.MetaJSON = metaJSON.String
	it.Meta = parseCompareMeta(metaJSON.String)
	if createdAt.Valid {
		it.CreatedAt = createdAt.Time
	}
	return it, nil
}

// GetByCompareMonths 查询「月 A + 月 B」这一对窗口下最新生成的一条阶段对比洞察（含全文）。
// 两月月份存于 meta_json（见 model.CompareMeta），故按序列化后的固定片段精确匹配；
// 命中后再解析 JSON 二次校验月份完全一致，避免 LIKE 误匹配。
// 不存在时返回 (nil, nil)，供上层直接判定「该月份对尚未生成」。
func (r *InsightRepository) GetByCompareMonths(userID int64, monthA, monthB string) (*model.AIInsight, error) {
	patternA := fmt.Sprintf(`%%"month_a":"%s","month_b":"%s"%%`, monthA, monthB)

	row := r.db.QueryRow(`
		SELECT id, user_id, scope, range_days, start_date, end_date, content, thinking, model, created_at, meta_json
		FROM ai_insights
		WHERE user_id = ? AND scope = 'compare' AND meta_json LIKE ?
		ORDER BY id DESC LIMIT 1`, userID, patternA)

	it := &model.AIInsight{}
	var scopeVal, startDate, endDate, content, thinking, modelName, metaJSON sql.NullString
	var createdAt sql.NullTime
	if err := row.Scan(&it.ID, &it.UserID, &scopeVal, &it.RangeDays, &startDate, &endDate, &content, &thinking, &modelName, &createdAt, &metaJSON); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("查询阶段对比洞察失败: %w", err)
	}
	meta := parseCompareMeta(metaJSON.String)
	if meta == nil || meta.MonthA != monthA || meta.MonthB != monthB {
		return nil, nil
	}
	it.Scope = scopeVal.String
	it.StartDate = startDate.String
	it.EndDate = endDate.String
	it.Content = content.String
	it.Thinking = thinking.String
	it.Model = modelName.String
	it.MetaJSON = metaJSON.String
	it.Meta = meta
	if createdAt.Valid {
		it.CreatedAt = createdAt.Time
	}
	return it, nil
}

// ListHealthByWindow 查询与给定区间存在重叠的生理洞察（scope=health），按 id 倒序取前 limit 条。
// 供阶段对比引用「用户已生成过的洞察结论」——阶段对比以聚合数据为主，历史洞察只作结论引用。
// 只返回正文预览，思维链不下发（提示词不需要）。
func (r *InsightRepository) ListHealthByWindow(userID int64, startDate, endDate string, limit int) ([]*model.AIInsight, error) {
	if limit <= 0 || limit > 10 {
		limit = 2
	}

	rows, err := r.db.Query(`
		SELECT id, range_days, start_date, end_date, content
		FROM ai_insights
		WHERE user_id = ? AND scope = 'health' AND start_date <= ? AND end_date >= ?
		ORDER BY id DESC LIMIT ?`, userID, endDate, startDate, limit)
	if err != nil {
		return nil, fmt.Errorf("查询区间内洞察失败: %w", err)
	}
	defer rows.Close()

	items := make([]*model.AIInsight, 0, limit)
	for rows.Next() {
		it := &model.AIInsight{}
		var startDateVal, endDateVal, content sql.NullString
		if err := rows.Scan(&it.ID, &it.RangeDays, &startDateVal, &endDateVal, &content); err != nil {
			return nil, fmt.Errorf("扫描区间洞察失败: %w", err)
		}
		it.StartDate = startDateVal.String
		it.EndDate = endDateVal.String
		it.Content = previewText(content.String, 400)
		items = append(items, it)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历区间洞察失败: %w", err)
	}
	return items, nil
}

// parseCompareMeta 解析 meta_json；空值、非 JSON 或缺少两月信息时返回 nil（非 compare 记录即走此分支）。
func parseCompareMeta(raw string) *model.CompareMeta {
	raw = strings.TrimSpace(raw)
	if raw == "" || raw == "{}" {
		return nil
	}
	meta := &model.CompareMeta{}
	if err := json.Unmarshal([]byte(raw), meta); err != nil {
		return nil
	}
	if meta.MonthA == "" || meta.MonthB == "" {
		return nil
	}
	return meta
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

// GetByDateScope 查询某归属下、指定日期的最近一条洞察全文（用于睡前小结洞察回显）。
func (r *InsightRepository) GetByDateScope(userID int64, scope, date string) (*model.AIInsight, error) {
	row := r.db.QueryRow(`
		SELECT id, user_id, scope, range_days, start_date, end_date, content, thinking, model, created_at
		FROM ai_insights
		WHERE user_id = ? AND scope = ? AND start_date = ? AND end_date = ?
		ORDER BY id DESC LIMIT 1`, userID, scope, date, date)

	it := &model.AIInsight{}
	var scopeVal, startDate, endDate, content, thinking, modelName sql.NullString
	var createdAt sql.NullTime
	if err := row.Scan(&it.ID, &it.UserID, &scopeVal, &it.RangeDays, &startDate, &endDate, &content, &thinking, &modelName, &createdAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("查询小结洞察失败: %w", err)
	}
	it.Scope = scopeVal.String
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

// DeleteByDateScope 删除某归属下、指定日期的全部洞察，返回受影响行数。
func (r *InsightRepository) DeleteByDateScope(userID int64, scope, date string) (int64, error) {
	res, err := r.db.Exec(
		`DELETE FROM ai_insights WHERE user_id = ? AND scope = ? AND start_date = ? AND end_date = ?`,
		userID, scope, date, date,
	)
	if err != nil {
		return 0, fmt.Errorf("删除小结洞察失败: %w", err)
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
