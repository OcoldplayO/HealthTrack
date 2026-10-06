package model

import (
	"fmt"
	"strings"
	"time"
)

// EveningSummary 睡前小结实体（独立表，按业务日期唯一，与 health_records 解耦）
type EveningSummary struct {
	ID         int64     `json:"id"`
	UserID     int64     `json:"user_id"`
	RecordDate string    `json:"record_date"` // YYYY-MM-DD
	DoneItems  []string  `json:"done_items"`  // 今日完成的三件事（最多 3 条）
	NoteText   string    `json:"note_text"`   // 对图片/今日的感想
	Score      int       `json:"score"`       // 今日自评 1-10
	PhotoID    *int64    `json:"photo_id"`    // 关联图片 ID，可空
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// SaveEveningDTO 前端提交的睡前小结载荷
type SaveEveningDTO struct {
	RecordDate string   `json:"record_date"`
	DoneItems  []string `json:"done_items"`
	NoteText   string   `json:"note_text"`
	Score      int      `json:"score"`
	PhotoID    *int64   `json:"photo_id"`
}

const (
	eveningDoneItemMaxRunes = 200
	eveningNoteMaxRunes     = 2000
)

// Normalize 裁剪三件事至最多 3 条并去除首尾空白。
func (dto *SaveEveningDTO) Normalize() {
	items := make([]string, 0, 3)
	for i := 0; i < len(dto.DoneItems) && i < 3; i++ {
		items = append(items, strings.TrimSpace(dto.DoneItems[i]))
	}
	dto.DoneItems = items
	dto.NoteText = strings.TrimSpace(dto.NoteText)
}

// Validate 参数边界校验
func (dto *SaveEveningDTO) Validate() error {
	if dto.RecordDate == "" {
		return fmt.Errorf("小结日期不能为空")
	}
	if _, err := time.Parse("2006-01-02", dto.RecordDate); err != nil {
		return fmt.Errorf("日期格式非法，需为 YYYY-MM-DD")
	}
	if dto.Score < 1 || dto.Score > 10 {
		return fmt.Errorf("自评分数需在 1 ~ 10 之间")
	}
	if len(dto.DoneItems) > 3 {
		return fmt.Errorf("今日完成事项最多 3 条")
	}
	for _, it := range dto.DoneItems {
		if len([]rune(it)) > eveningDoneItemMaxRunes {
			return fmt.Errorf("单条完成事项不能超过 %d 个字符", eveningDoneItemMaxRunes)
		}
	}
	if len([]rune(dto.NoteText)) > eveningNoteMaxRunes {
		return fmt.Errorf("感想不能超过 %d 个字符", eveningNoteMaxRunes)
	}
	if dto.PhotoID != nil && *dto.PhotoID <= 0 {
		return fmt.Errorf("图片 ID 非法")
	}
	return nil
}
