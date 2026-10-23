package handler

import (
	"encoding/json"
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
