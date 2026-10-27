package service

import (
	"archive/zip"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
)

// maxPhotoBytes 单张图片上限（前端已做 canvas 压缩，此处兜底防超大文件）。
const maxPhotoBytes = 8 << 20 // 8MB

// EveningService 睡前小结业务层
type EveningService struct {
	repo    *repository.EveningRepository
	configs *config.RuntimeStore
}

func NewEveningService(repo *repository.EveningRepository, configs *config.RuntimeStore) *EveningService {
	return &EveningService{repo: repo, configs: configs}
}

// Today 返回今日日期（YYYY-MM-DD）。
func (s *EveningService) Today() string {
	return time.Now().Format("2006-01-02")
}

// GetByDate 查询某日小结，date 为空时取今日。
func (s *EveningService) GetByDate(userID int64, date string) (*model.EveningSummary, error) {
	if strings.TrimSpace(date) == "" {
		date = s.Today()
	}
	if _, err := time.Parse("2006-01-02", date); err != nil {
		return nil, fmt.Errorf("日期格式非法，需为 YYYY-MM-DD")
	}
	return s.repo.GetByDate(userID, date)
}

// List 查询全部小结（日期倒序）。
func (s *EveningService) List(userID int64) ([]*model.EveningSummary, error) {
	items, err := s.repo.ListAll(userID)
	if err != nil {
		return nil, err
	}
	if items == nil {
		items = []*model.EveningSummary{}
	}
	return items, nil
}

// Save 保存或覆盖某日小结。
func (s *EveningService) Save(userID int64, dto *model.SaveEveningDTO) (*model.EveningSummary, error) {
	dto.Normalize()
	if err := dto.Validate(); err != nil {
		return nil, err
	}
	return s.repo.Upsert(userID, dto)
}

// Delete 删除某日小结（含其图片）。
func (s *EveningService) Delete(userID int64, date string) error {
	if _, err := time.Parse("2006-01-02", date); err != nil {
		return fmt.Errorf("日期格式非法，需为 YYYY-MM-DD")
	}
	_, err := s.repo.DeleteByDate(userID, date)
	return err
}

// SavePhoto 校验并保存/替换某日图片，返回图片 ID。
func (s *EveningService) SavePhoto(userID int64, date, contentType string, data []byte) (int64, error) {
	if _, err := time.Parse("2006-01-02", date); err != nil {
		return 0, fmt.Errorf("日期格式非法，需为 YYYY-MM-DD")
	}
	if len(data) == 0 {
		return 0, fmt.Errorf("图片内容为空")
	}
	if len(data) > maxPhotoBytes {
		return 0, fmt.Errorf("图片过大，请压缩后重试（上限 8MB）")
	}
	mime := normalizeImageMime(contentType, data)
	if mime == "" {
		return 0, fmt.Errorf("仅支持 JPEG / PNG / WebP 图片")
	}
	return s.repo.SavePhoto(userID, date, mime, data)
}

// GetPhoto 读取图片二进制。
func (s *EveningService) GetPhoto(userID, id int64) (string, []byte, error) {
	return s.repo.GetPhoto(userID, id)
}

// DeletePhoto 删除图片。
func (s *EveningService) DeletePhoto(userID, id int64) (int64, error) {
	return s.repo.DeletePhoto(userID, id)
}

// archiveManifest 图文归档的清单文件，便于用户/工具识别导出范围与数量。
type archiveManifest struct {
	App           string `json:"app"`
	SchemaVersion int    `json:"schema_version"`
	ExportedAt    string `json:"exported_at"`
	RangeDays     int    `json:"range_days,omitempty"`
	StartDate     string `json:"start_date,omitempty"`
	EndDate       string `json:"end_date"`
	SummaryCount  int    `json:"summary_count"`
	PhotoCount    int    `json:"photo_count"`
}

// WriteArchive 将小结与照片打包为 ZIP 流式写入 w；days<=0 表示全量。
// 目录结构：photos/YYYY-MM-DD.jpg + summaries.csv + manifest.json。
func (s *EveningService) WriteArchive(w io.Writer, userID int64, days int) error {
	endDate := s.Today()
	startDate := ""
	if days > 0 {
		startDate = time.Now().AddDate(0, 0, -(days - 1)).Format("2006-01-02")
	}

	summaries, err := s.repo.ListAll(userID)
	if err != nil {
		return err
	}
	// ListAll 为倒序，这里反转为升序，导出文件按时间顺序更易阅读。
	items := make([]*model.EveningSummary, 0, len(summaries))
	for i := len(summaries) - 1; i >= 0; i-- {
		item := summaries[i]
		if startDate != "" && (item.RecordDate < startDate || item.RecordDate > endDate) {
			continue
		}
		items = append(items, item)
	}

	zw := zip.NewWriter(w)
	photoCount := 0

	// 图片已在前端压缩过，用 Store 直接存储，避免重复压缩消耗 CPU。
	err = s.repo.IteratePhotos(userID, startDate, endDate, func(p repository.PhotoRecord) error {
		entry, err := zw.CreateHeader(&zip.FileHeader{
			Name:   "photos/" + p.Date + photoExt(p.Mime),
			Method: zip.Store,
		})
		if err != nil {
			return err
		}
		if _, err := entry.Write(p.Data); err != nil {
			return err
		}
		photoCount++
		return nil
	})
	if err != nil {
		return err
	}

	// summaries.csv 带 UTF-8 BOM，Excel / WPS 直接打开中文不乱码。
	csvEntry, err := zw.CreateHeader(&zip.FileHeader{Name: "summaries.csv", Method: zip.Deflate})
	if err != nil {
		return err
	}
	if _, err := csvEntry.Write([]byte{0xEF, 0xBB, 0xBF}); err != nil {
		return err
	}
	cw := csv.NewWriter(csvEntry)
	if err := cw.Write([]string{"记录日期", "自评分", "完成事项1", "完成事项2", "完成事项3", "感想", "含图片"}); err != nil {
		return err
	}
	for _, item := range items {
		done := [3]string{}
		for i := 0; i < 3 && i < len(item.DoneItems); i++ {
			done[i] = item.DoneItems[i]
		}
		hasPhoto := "否"
		if item.PhotoID != nil {
			hasPhoto = "是"
		}
		if err := cw.Write([]string{
			item.RecordDate, strconv.Itoa(item.Score), done[0], done[1], done[2], item.NoteText, hasPhoto,
		}); err != nil {
			return err
		}
	}
	cw.Flush()
	if err := cw.Error(); err != nil {
		return err
	}

	manifest := archiveManifest{
		App:           "HealthTrack",
		SchemaVersion: 1,
		ExportedAt:    time.Now().Format(time.RFC3339),
		RangeDays:     days,
		StartDate:     startDate,
		EndDate:       endDate,
		SummaryCount:  len(items),
		PhotoCount:    photoCount,
	}
	body, err := json.MarshalIndent(manifest, "", "  ")
	if err != nil {
		return err
	}
	manifestEntry, err := zw.CreateHeader(&zip.FileHeader{Name: "manifest.json", Method: zip.Deflate})
	if err != nil {
		return err
	}
	if _, err := manifestEntry.Write(body); err != nil {
		return err
	}

	return zw.Close()
}

// photoExt 按 MIME 推断归档内图片扩展名。
func photoExt(mime string) string {
	switch mime {
	case "image/png":
		return ".png"
	case "image/webp":
		return ".webp"
	default:
		return ".jpg"
	}
}

// normalizeImageMime 归一化图片 MIME；Content-Type 不可信时按魔数嗅探。
func normalizeImageMime(contentType string, data []byte) string {
	ct := strings.ToLower(strings.TrimSpace(strings.Split(contentType, ";")[0]))
	switch ct {
	case "image/jpeg", "image/jpg":
		return "image/jpeg"
	case "image/png":
		return "image/png"
	case "image/webp":
		return "image/webp"
	}

	// 回退：按文件头魔数嗅探
	if len(data) >= 3 && data[0] == 0xFF && data[1] == 0xD8 && data[2] == 0xFF {
		return "image/jpeg"
	}
	if len(data) >= 8 && data[0] == 0x89 && string(data[1:4]) == "PNG" {
		return "image/png"
	}
	if len(data) >= 12 && string(data[0:4]) == "RIFF" && string(data[8:12]) == "WEBP" {
		return "image/webp"
	}
	return ""
}
