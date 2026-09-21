package handler

import (
	"encoding/json"
	"fmt"
	"healthtrack/internal/model"
	"healthtrack/internal/service"
	"log/slog"
	"net/http"
	"time"
)

type RecordHandler struct {
	recordService *service.RecordService
	aiService     *service.AIService
}

func NewRecordHandler(recordService *service.RecordService, aiService *service.AIService) *RecordHandler {
	return &RecordHandler{
		recordService: recordService,
		aiService:     aiService,
	}
}

// GetToday 获取今日记录
func (h *RecordHandler) GetToday(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	userID := int64(1) // MVP 默认为用户 1
	record, err := h.recordService.GetTodayRecord(userID)
	if err != nil {
		slog.Error("获取今日记录失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.Success(record))
}

// SaveRecord 保存或更新记录
func (h *RecordHandler) SaveRecord(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	var dto model.SaveRecordDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "JSON 格式非法: "+err.Error()))
		return
	}

	userID := int64(1)
	saved, err := h.recordService.SaveRecord(userID, &dto)
	if err != nil {
		slog.Warn("保存健康记录参数错误", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.SuccessWithMsg("保存成功", saved))
}

// GetHistory 获取历史区间数据
func (h *RecordHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	startDate := r.URL.Query().Get("start_date")
	endDate := r.URL.Query().Get("end_date")

	userID := int64(1)
	records, err := h.recordService.GetHistoryRecords(userID, startDate, endDate)
	if err != nil {
		slog.Error("获取历史数据失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, err.Error()))
		return
	}

	writeJSON(w, http.StatusOK, model.Success(records))
}

// StreamInsight 流式 AI 洞察
func (h *RecordHandler) StreamInsight(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	startDate := r.URL.Query().Get("start_date")
	endDate := r.URL.Query().Get("end_date")

	if startDate == "" {
		startDate = time.Now().AddDate(0, 0, -29).Format("2006-01-02")
	}
	if endDate == "" {
		endDate = time.Now().Format("2006-01-02")
	}

	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	userID := int64(1)
	if err := h.aiService.StreamInsight(r.Context(), userID, startDate, endDate, w); err != nil {
		slog.Error("流式洞察处理失败", "err", err)
	}
}

// ExportData 导出全量 JSON 数据
func (h *RecordHandler) ExportData(w http.ResponseWriter, r *http.Request) {
	userID := int64(1)
	records, err := h.recordService.GetAllRecords(userID)
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=healthtrack_export_%s.json", time.Now().Format("20060102")))
	writeJSON(w, http.StatusOK, model.Success(records))
}

// Healthz 探针
func (h *RecordHandler) Healthz(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "time": time.Now().Format(time.RFC3339)})
}

func writeJSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}
