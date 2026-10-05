package handler

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"healthtrack/internal/model"
	"healthtrack/internal/repository"
)

// InsightHandler AI 洞察历史存档接口
type InsightHandler struct {
	repo *repository.InsightRepository
}

func NewInsightHandler(repo *repository.InsightRepository) *InsightHandler {
	return &InsightHandler{repo: repo}
}

// List 游标分页查询历史洞察：GET /api/v1/insights?limit=10&before_id=&range_days=&q=
func (h *InsightHandler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	q := r.URL.Query()
	limit := atoiDefault(q.Get("limit"), 10)
	beforeID := int64(atoiDefault(q.Get("before_id"), 0))
	rangeDays := atoiDefault(q.Get("range_days"), 0)

	items, hasMore, err := h.repo.List(1, limit, beforeID, rangeDays, q.Get("q"))
	if err != nil {
		slog.Error("查询洞察历史失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.Success(map[string]any{
		"items":    items,
		"has_more": hasMore,
	}))
}

// Detail 查询单条洞察全文：GET /api/v1/insights/{id}
func (h *InsightHandler) Detail(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "非法的洞察 ID"))
		return
	}

	item, err := h.repo.Get(1, id)
	if err != nil {
		slog.Error("查询洞察详情失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}
	if item == nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeNotFound, "洞察存档不存在"))
		return
	}

	writeJSON(w, http.StatusOK, model.Success(item))
}

// Delete 删除单条洞察：DELETE /api/v1/insights/{id}
func (h *InsightHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "非法的洞察 ID"))
		return
	}

	affected, err := h.repo.Delete(1, id)
	if err != nil {
		slog.Error("删除洞察失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}
	if affected == 0 {
		writeJSON(w, http.StatusOK, model.Error(model.CodeNotFound, "洞察存档不存在"))
		return
	}

	writeJSON(w, http.StatusOK, model.SuccessWithMsg("删除成功", nil))
}

// BatchDelete 批量删除洞察：POST /api/v1/insights/batch-delete
func (h *InsightHandler) BatchDelete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	var body struct {
		IDs []int64 `json:"ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "JSON 格式非法: "+err.Error()))
		return
	}

	// 过滤非法 id 并去重
	seen := make(map[int64]bool, len(body.IDs))
	ids := make([]int64, 0, len(body.IDs))
	for _, id := range body.IDs {
		if id <= 0 || seen[id] {
			continue
		}
		seen[id] = true
		ids = append(ids, id)
	}
	if len(ids) == 0 {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "请选择要删除的洞察"))
		return
	}

	affected, err := h.repo.DeleteMany(1, ids)
	if err != nil {
		slog.Error("批量删除洞察失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.SuccessWithMsg(
		fmt.Sprintf("已删除 %d 条", affected),
		map[string]int64{"deleted": affected},
	))
}

// atoiDefault 解析整数，失败时返回默认值
func atoiDefault(s string, def int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}
