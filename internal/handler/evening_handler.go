package handler

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"strconv"

	"healthtrack/internal/model"
	"healthtrack/internal/service"
)

// EveningHandler 睡前小结接口
type EveningHandler struct {
	svc *service.EveningService
}

func NewEveningHandler(svc *service.EveningService) *EveningHandler {
	return &EveningHandler{svc: svc}
}

// GetSummary 查询某日小结：GET /api/v1/evening/summary?date=YYYY-MM-DD
func (h *EveningHandler) GetSummary(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	summary, err := h.svc.GetByDate(1, r.URL.Query().Get("date"))
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.Success(summary))
}

// SaveSummary 保存/覆盖某日小结：POST /api/v1/evening/summary
func (h *EveningHandler) SaveSummary(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var dto model.SaveEveningDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "JSON 格式非法: "+err.Error()))
		return
	}

	saved, err := h.svc.Save(1, &dto)
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.SuccessWithMsg("保存成功", saved))
}

// List 查询全部小结：GET /api/v1/evening/summaries
func (h *EveningHandler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	items, err := h.svc.List(1)
	if err != nil {
		slog.Error("查询睡前小结列表失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.Success(map[string]any{
		"items": items,
		"total": len(items),
	}))
}

// Delete 删除某日小结：DELETE /api/v1/evening/summary/{date}
func (h *EveningHandler) Delete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	date := r.PathValue("date")
	if err := h.svc.Delete(1, date); err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.SuccessWithMsg("删除成功", nil))
}

// UploadPhoto 上传/替换某日图片：POST /api/v1/evening/photo?date=YYYY-MM-DD
// 请求体为压缩后的图片原始二进制，Content-Type 为图片类型。
func (h *EveningHandler) UploadPhoto(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, (9<<20))
	data, err := io.ReadAll(r.Body)
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "读取图片失败: "+err.Error()))
		return
	}

	id, err := h.svc.SavePhoto(1, r.URL.Query().Get("date"), r.Header.Get("Content-Type"), data)
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.SuccessWithMsg("图片已保存", map[string]int64{"photo_id": id}))
}

// GetPhoto 读取图片：GET /api/v1/evening/photo/{id}
func (h *EveningHandler) GetPhoto(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		http.NotFound(w, r)
		return
	}

	mime, data, err := h.svc.GetPhoto(1, id)
	if err != nil {
		slog.Error("读取小结图片失败", "err", err)
		http.Error(w, "读取图片失败", http.StatusInternalServerError)
		return
	}
	if len(data) == 0 {
		http.NotFound(w, r)
		return
	}

	w.Header().Set("Content-Type", mime)
	w.Header().Set("Cache-Control", "private, max-age=31536000")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(data)
}

// DeletePhoto 删除图片：DELETE /api/v1/evening/photo/{id}
func (h *EveningHandler) DeletePhoto(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "非法的图片 ID"))
		return
	}

	if _, err := h.svc.DeletePhoto(1, id); err != nil {
		slog.Error("删除小结图片失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.SuccessWithMsg("图片已删除", nil))
}
