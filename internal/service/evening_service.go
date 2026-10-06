package service

import (
	"fmt"
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
