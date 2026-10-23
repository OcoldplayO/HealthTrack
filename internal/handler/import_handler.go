package handler

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	"healthtrack/internal/model"
	"healthtrack/internal/service"
)

// ImportHandler 批量导入接口。
type ImportHandler struct {
	svc *service.ImportService
}

func NewImportHandler(svc *service.ImportService) *ImportHandler {
	return &ImportHandler{svc: svc}
}

// Preview 预检：POST /api/v1/import/preview
// 支持 multipart/form-data（file / memo / year_base / file_name）与 JSON（memo / year_base）。
// 预检阶段不写任何数据，只返回统计、行级问题与 10 分钟有效的确认令牌。
func (h *ImportHandler) Preview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 6<<20)
	var in service.ImportPreviewInput

	if strings.HasPrefix(r.Header.Get("Content-Type"), "multipart/form-data") {
		if err := r.ParseMultipartForm(6 << 20); err != nil {
			writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "读取上传内容失败: "+err.Error()))
			return
		}
		in.Memo = r.FormValue("memo")
		in.FileName = r.FormValue("file_name")
		in.YearBase, _ = strconv.Atoi(r.FormValue("year_base"))

		if file, header, err := r.FormFile("file"); err == nil {
			defer file.Close()
			data, readErr := io.ReadAll(io.LimitReader(file, importUploadLimit+1))
			if readErr != nil {
				writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "读取文件失败: "+readErr.Error()))
				return
			}
			if len(data) > importUploadLimit {
				writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "文件超过 5 MB，请按年份拆分后导入"))
				return
			}
			in.Data = data
			if in.FileName == "" {
				in.FileName = header.Filename
			}
		}
	} else {
		var body struct {
			Memo     string `json:"memo"`
			YearBase int    `json:"year_base"`
			FileName string `json:"file_name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "JSON 格式非法: "+err.Error()))
			return
		}
		in.Memo, in.YearBase, in.FileName = body.Memo, body.YearBase, body.FileName
	}

	preview, err := h.svc.Preview(1, in)
	if err != nil {
		slog.Error("导入预检失败", "err", err)
		writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		return
	}
	writeJSON(w, http.StatusOK, model.Success(preview))
}

const importUploadLimit = 5 << 20

// Confirm 确认写入：POST /api/v1/import/confirm
// 请求体为 JSON（token / conflict_mode / skip_errors），也兼容表单字段。
// 写入在单事务内完成：全部成功，或回滚为 0 行；错误行必须显式 skip_errors 才会跳过。
func (h *ImportHandler) Confirm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, model.Error(http.StatusMethodNotAllowed, "Method Not Allowed"))
		return
	}

	var in service.ImportConfirmInput
	if strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
		body := http.MaxBytesReader(w, r.Body, 64<<10)
		if err := json.NewDecoder(body).Decode(&in); err != nil {
			writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "JSON 格式非法: "+err.Error()))
			return
		}
	} else {
		if err := r.ParseForm(); err != nil {
			writeJSON(w, http.StatusOK, model.Error(model.CodeParamError, "读取请求参数失败: "+err.Error()))
			return
		}
		in.Token = r.FormValue("token")
		in.ConflictMode = r.FormValue("conflict_mode")
		in.SkipErrors = isTruthy(r.FormValue("skip_errors"))
	}

	result, err := h.svc.Confirm(1, in)
	if err != nil {
		var invalid *service.ImportRowsInvalidError
		switch {
		case errors.As(err, &invalid),
			errors.Is(err, service.ErrImportConflictModeInvalid),
			errors.Is(err, service.ErrImportNoValidRows):
			writeJSON(w, http.StatusBadRequest, model.Error(model.CodeParamError, err.Error()))
		case errors.Is(err, service.ErrImportPreviewExpired):
			writeJSON(w, http.StatusConflict, model.Error(model.CodeParamError, err.Error()))
		default:
			slog.Error("导入写入失败", "err", err)
			writeJSON(w, http.StatusOK, model.Error(model.CodeDBError, err.Error()))
		}
		return
	}
	writeJSON(w, http.StatusOK, model.Success(result))
}

func isTruthy(s string) bool {
	switch strings.ToLower(strings.TrimSpace(s)) {
	case "1", "true", "yes", "on":
		return true
	}
	return false
}
