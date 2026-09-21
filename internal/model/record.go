package model

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

// HealthRecord 对应 SQLite 数据库实体
type HealthRecord struct {
	ID             int64      `json:"id"`
	UserID         int64      `json:"user_id"`
	RecordDate     string     `json:"record_date"` // YYYY-MM-DD
	WeightAM       *float64   `json:"weight_am"`   // 晨起空腹体重 (kg)
	WeightPM       *float64   `json:"weight_pm"`   // 睡前体重 (kg)
	WaistSize      *float64   `json:"waist_size"`  // 腰围 (cm)
	SleepStartTime *string    `json:"sleep_start_time"` // "01:00"
	SleepEndTime   *string    `json:"sleep_end_time"`   // "07:50"
	SleepHours     *float64   `json:"sleep_hours"`      // 睡眠时长 (小时)
	SleepTag       string     `json:"sleep_tag"`        // 'GREEN', 'YELLOW', 'RED'
	JournalText    string     `json:"journal_text"`     // 饮食、运动日记
	ActivityTags   string     `json:"activity_tags"`    // 提取的标签 JSON
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// SaveRecordDTO 前端提交的请求载荷
type SaveRecordDTO struct {
	RecordDate     string   `json:"record_date"`
	WeightAM       *float64 `json:"weight_am"`
	WeightPM       *float64 `json:"weight_pm"`
	WaistSize      *float64 `json:"waist_size"`
	SleepStartTime *string  `json:"sleep_start_time"`
	SleepEndTime   *string  `json:"sleep_end_time"`
	SleepHours     *float64 `json:"sleep_hours"`
	JournalText    *string  `json:"journal_text"`
}

// CalculateSleepTag 根据入睡时间计算熬夜等级 (GREEN <= 24:00, YELLOW <= 01:00, RED > 01:00)
func CalculateSleepTag(startTimeStr string) string {
	if startTimeStr == "" {
		return "GREEN"
	}

	parts := strings.Split(strings.TrimSpace(startTimeStr), ":")
	if len(parts) == 0 {
		return "GREEN"
	}

	hour, err := strconv.Atoi(parts[0])
	if err != nil {
		return "GREEN"
	}

	var minute int
	if len(parts) > 1 {
		minute, _ = strconv.Atoi(parts[1])
	}

	// 时间折算为分钟: 凌晨时间 (00:00 - 04:00) 对应于跨日后的 24:00 - 28:00
	totalMinutes := hour * 60 + minute
	if hour >= 0 && hour <= 4 {
		totalMinutes += 24 * 60
	}

	// 24:00 对应 1440 分钟, 01:00 对应 1500 分钟 (25*60)
	if totalMinutes <= 24*60 {
		return "GREEN"
	} else if totalMinutes <= 25*60 {
		return "YELLOW"
	}
	return "RED"
}

// Validate 参数边界校验
func (dto *SaveRecordDTO) Validate() error {
	if dto.RecordDate == "" {
		return fmt.Errorf("记录日期不能为空")
	}
	if _, err := time.Parse("2006-01-02", dto.RecordDate); err != nil {
		return fmt.Errorf("日期格式非法，需为 YYYY-MM-DD")
	}

	if dto.WeightAM != nil && (*dto.WeightAM < 30.0 || *dto.WeightAM > 250.0) {
		return fmt.Errorf("晨间体重需在 30.0 ~ 250.0 kg 之间")
	}
	if dto.WeightPM != nil && (*dto.WeightPM < 30.0 || *dto.WeightPM > 250.0) {
		return fmt.Errorf("晚间体重需在 30.0 ~ 250.0 kg 之间")
	}
	if dto.WaistSize != nil && (*dto.WaistSize < 30.0 || *dto.WaistSize > 200.0) {
		return fmt.Errorf("腰围需在 30.0 ~ 200.0 cm 之间")
	}
	if dto.SleepHours != nil && (*dto.SleepHours < 0.0 || *dto.SleepHours > 24.0) {
		return fmt.Errorf("睡眠时长需在 0.0 ~ 24.0 小时之间")
	}
	if dto.JournalText != nil && len([]rune(*dto.JournalText)) > 2000 {
		return fmt.Errorf("日记文本不能超过 2000 个字符")
	}
	return nil
}
