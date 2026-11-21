package handler

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type RecordHandler struct {
	recordService *service.RecordService
	aiService     *service.AIService
	eveningRepo   *repository.EveningRepository
}

func NewRecordHandler(recordService *service.RecordService, aiService *service.AIService, eveningRepo *repository.EveningRepository) *RecordHandler {
	return &RecordHandler{
		recordService: recordService,
		aiService:     aiService,
		eveningRepo:   eveningRepo,
	}
}

// GetToday 获取今日记录（传入 tz_offset 时按客户端本地日期查询）
func (h *RecordHandler) GetToday(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	userID := int64(1)
	var (
		record *model.HealthRecord
		err    error
	)
	if today, ok := resolveClientToday(r); ok {
		record, err = h.recordService.GetRecordByDate(userID, today)
	} else {
		record, err = h.recordService.GetTodayRecord(userID)
	}
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

// ExportCSV 导出 Excel / WPS 友好的 CSV 表格 (带 UTF-8 BOM，防止乱码与公式注入)
func (h *RecordHandler) ExportCSV(w http.ResponseWriter, r *http.Request) {
	userID := int64(1)
	today, hasClientTZ := resolveClientToday(r)
	if !hasClientTZ {
		today = time.Now().Format("2006-01-02")
	}

	// 导出范围：range=7 / range=30 / 缺省(全部)
	rangeParam := r.URL.Query().Get("range")
	var records []*model.HealthRecord
	var err error
	rangeKey := "all"
	switch rangeParam {
	case "7":
		records, err = h.recordService.GetRecentRecordsEndingAt(userID, today, 7)
		rangeKey = "7d"
	case "30":
		records, err = h.recordService.GetRecentRecordsEndingAt(userID, today, 30)
		rangeKey = "30d"
	default:
		records, err = h.recordService.GetAllRecords(userID)
	}
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	var buf bytes.Buffer
	// 写入 UTF-8 BOM，确保 Excel/WPS 打开中文不乱码
	buf.WriteString("\xef\xbb\xbf")

	writer := csv.NewWriter(&buf)
	// 保留前 10 列原名以兼容导回，并追加结构化生物黑客列
	_ = writer.Write([]string{
		"记录日期", "晨起空腹体重(kg)", "睡前体重(kg)", "腰围(cm)",
		"睡眠时长(小时)", "就寝时间", "起床时间", "熬夜等级", "运动标签", "饮食运动与日记备注",
		"运动类型", "运动时长(分)", "运动强度", "冷水澡", "专注达", "晨光", "步数", "午餐",
	})

	for _, rec := range records {
		wAm := ""
		if rec.WeightAM != nil {
			wAm = fmt.Sprintf("%.1f", *rec.WeightAM)
		}
		wPm := ""
		if rec.WeightPM != nil {
			wPm = fmt.Sprintf("%.1f", *rec.WeightPM)
		}
		waist := ""
		if rec.WaistSize != nil {
			waist = fmt.Sprintf("%.1f", *rec.WaistSize)
		}
		sh := ""
		if rec.SleepHours != nil {
			sh = fmt.Sprintf("%.1f", *rec.SleepHours)
		}
		sStart := ""
		if rec.SleepStartTime != nil {
			sStart = *rec.SleepStartTime
		}
		sEnd := ""
		if rec.SleepEndTime != nil {
			sEnd = *rec.SleepEndTime
		}

		exTypes, exDur, exIntensity := "", "", ""
		if rec.Exercise != nil {
			if types := rec.Exercise.NormalizeTypes(); len(types) > 0 {
				exTypes = strings.Join(types, "+")
				if rec.Exercise.Duration > 0 {
					exDur = strconv.Itoa(rec.Exercise.Duration)
				}
				exIntensity = rec.Exercise.Intensity
			}
		}

		coldShowerStr := ""
		if rec.ColdShower != nil && rec.ColdShower.Enabled {
			tempStr := ""
			if rec.ColdShower.WaterTemp != nil {
				tempStr = fmt.Sprintf("/%.1f℃", *rec.ColdShower.WaterTemp)
			}
			dur := rec.ColdShower.Duration
			if dur > 0 && dur <= 10 {
				dur *= 60
			}
			coldShowerStr = fmt.Sprintf("%s/%ds%s/%s", rec.ColdShower.Timing, dur, tempStr, rec.ColdShower.Feeling)
		}

		concertaStr := ""
		if rec.Concerta != nil && rec.Concerta.Taken {
			concertaStr = fmt.Sprintf("%dmg@%s(启动力%d)", rec.Concerta.Dose, rec.Concerta.Time, rec.Concerta.FocusWork)
		}

		morningLightStr := ""
		if rec.MorningLight != nil {
			if *rec.MorningLight {
				morningLightStr = "是"
			} else {
				morningLightStr = "否"
			}
		}

		stepsStr := ""
		if rec.Steps != nil {
			stepsStr = strconv.Itoa(*rec.Steps)
		}

		lunchStr := service.FormatLunchSummary(rec.Lunch)

		_ = writer.Write([]string{
			rec.RecordDate, wAm, wPm, waist,
			sh, sStart, sEnd, rec.SleepTag,
			sanitizeCSVCell(rec.ActivityTags),
			sanitizeCSVCell(rec.JournalText),
			sanitizeCSVCell(exTypes), exDur, sanitizeCSVCell(exIntensity),
			sanitizeCSVCell(coldShowerStr), sanitizeCSVCell(concertaStr),
			morningLightStr, stepsStr, sanitizeCSVCell(lunchStr),
		})
	}
	writer.Flush()

	fileYMD := strings.ReplaceAll(today, "-", "")
	fileName := fmt.Sprintf("HealthTrack_export_%s_%s.csv", rangeKey, fileYMD)
	w.Header().Set("Content-Type", "text/csv; charset=utf-8")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
	data := buf.Bytes()
	// 显式带上 Content-Length，前端才能显示文件大小、下载管理器也能显示进度。
	w.Header().Set("Content-Length", strconv.Itoa(len(data)))
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(data)
}

func resolveClientToday(r *http.Request) (string, bool) {
	raw := strings.TrimSpace(r.URL.Query().Get("tz_offset"))
	if raw == "" {
		return "", false
	}
	tzOffset, err := strconv.Atoi(raw)
	if err != nil || tzOffset < -720 || tzOffset > 840 {
		return "", false
	}
	return clientToday(tzOffset), true
}

// sanitizeCSVCell 防止以 =, +, -, @, \t, \r 开头的文本在 Excel/WPS 中被当成公式执行。
func sanitizeCSVCell(s string) string {
	if s == "" {
		return s
	}
	switch s[0] {
	case '=', '+', '-', '@', '\t', '\r':
		return "'" + s
	}
	return s
}

// ExportJSON 导出全量 JSON 备份（v2）：健康记录 + 睡前小结。
// 照片与 AI 洞察不进入备份，由 excluded 字段显式声明。
func (h *RecordHandler) ExportJSON(w http.ResponseWriter, r *http.Request) {
	// HEAD 用于前端探测文件大小，与 GET 走同一条路径。
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}
	userID := int64(1)
	records, err := h.recordService.GetAllRecords(userID)
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	summaries, err := h.eveningRepo.ListAll(userID)
	if err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}
	// 小结照片不导出，清空引用避免恢复后指向不存在的图片。
	for _, item := range summaries {
		item.PhotoID = nil
	}

	backup := model.BackupFile{
		SchemaVersion:    model.BackupSchemaVersion,
		App:              "HealthTrack",
		ExportedAt:       time.Now().Format(time.RFC3339),
		RecordCount:      len(records),
		SummaryCount:     len(summaries),
		HealthRecords:    records,
		EveningSummaries: summaries,
		Excluded:         model.BackupExcluded,
	}

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetIndent("", "  ")
	if err := enc.Encode(backup); err != nil {
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=HealthTrack_backup_v2_%s.json", time.Now().Format("20060102")))
	w.Header().Set("Content-Length", strconv.Itoa(buf.Len()))
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(buf.Bytes())
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
