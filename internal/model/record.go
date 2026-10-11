package model

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

// ExerciseDetail 运动明细
// 运动类型支持多选：「有氧 + 力量」可同时记录。
// Types 为主用字段（取值 none/cardio/strength 的子集，不含 none）；
// Type 为早期单值字段，仅作向后兼容保留——写入前由 SyncLegacyType 同步为首个类型，
// 读取旧记录时由 NormalizeTypes 回退使用，避免出现"两个事实来源"。
type ExerciseDetail struct {
	Types     []string `json:"types,omitempty"` // 运动类型（多选）：cardio / strength
	Type      string   `json:"type"`            // 兼容旧数据：none, cardio, strength
	Duration  int      `json:"duration"`        // 时长 (分钟)
	Intensity string   `json:"intensity"`       // light, medium, failure
	Items     string   `json:"items"`           // 备注，如 "骑行 3km" 或 "腿部深蹲"
}

// NormalizeTypes 归一化运动类型：Types 非空时以其为准，否则回退到旧单值 Type；
// 剔除 none / 空值并去重。读取端（AI 特征工程、列表标签）统一用它判定口径。
func (e *ExerciseDetail) NormalizeTypes() []string {
	if e == nil {
		return nil
	}
	src := e.Types
	if len(src) == 0 && e.Type != "" {
		src = []string{e.Type}
	}
	out := make([]string, 0, len(src))
	seen := make(map[string]bool, len(src))
	for _, t := range src {
		if t == "" || t == "none" || seen[t] {
			continue
		}
		seen[t] = true
		out = append(out, t)
	}
	return out
}

// SyncLegacyType 写入前调用：把多选结果写回 Types（去重后的规范值），
// 并让兼容字段 Type 跟随首个类型（无运动时为 none），保证旧读取方拿到的仍是单值语义。
func (e *ExerciseDetail) SyncLegacyType() {
	if e == nil {
		return
	}
	types := e.NormalizeTypes()
	e.Types = types
	if len(types) > 0 {
		e.Type = types[0]
	} else {
		e.Type = "none"
	}
}

// ColdShowerDetail 冷水澡记录
type ColdShowerDetail struct {
	Enabled   bool     `json:"enabled"`    // 是否打卡
	Timing    string   `json:"timing"`     // morning, post_workout, evening
	Duration  int      `json:"duration"`   // 时长 (分钟)
	WaterTemp *float64 `json:"water_temp"` // 预估体感水温 (℃)，可空
	Feeling   string   `json:"feeling"`    // refreshed, neutral, shivering
}

// ConcertaDetail 专注达服药与多维效能记录
type ConcertaDetail struct {
	Taken          bool     `json:"taken"`           // 今日是否服药
	Time           string   `json:"time"`            // 服药时间点 (HH:mm)
	Dose           int      `json:"dose"`            // 剂量 (18, 36, 54)
	FocusWork      int      `json:"focus_work"`      // 工作启动力与心流 (1-5)
	FocusStudy     int      `json:"focus_study"`     // 阅读与工作记忆 (1-5)
	DailyTasks     int      `json:"daily_tasks"`     // 琐事耐受度 (1-5)
	SocialPatience int      `json:"social"`          // 社交情绪平稳度 (1-5)
	GamingReaction int      `json:"gaming"`          // 竞技反应度 (1-5)
	CrashTime      string   `json:"crash_time"`      // 断崖疲劳点 (HH:mm)
	SideEffects    []string `json:"side_effects"`    // ["appetite_loss", "thirst", "palpitation"]
	Compensations  []string `json:"compensations"`   // ["monster_energy", "sugar_craving"]
}

// HealthRecord 核心健康记录实体（对齐 SQLite 数据库实体）
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

	// 扩展生物黑客结构化对象
	Exercise   *ExerciseDetail   `json:"exercise,omitempty"`
	ColdShower *ColdShowerDetail `json:"cold_shower,omitempty"`
	Concerta   *ConcertaDetail   `json:"concerta,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Record 别名对齐 SYSTEM_DESIGN.md
type Record = HealthRecord

// SaveRecordDTO 前端提交的请求载荷
type SaveRecordDTO struct {
	RecordDate     string            `json:"record_date"`
	WeightAM       *float64          `json:"weight_am"`
	WeightPM       *float64          `json:"weight_pm"`
	WaistSize      *float64          `json:"waist_size"`
	SleepStartTime *string           `json:"sleep_start_time"` // 昨晚就寝时间 (sleep_bed_time)
	SleepEndTime   *string           `json:"sleep_end_time"`   // 今晨起床时间 (sleep_wake_time)
	SleepHours     *float64          `json:"sleep_hours"`      // 睡眠时长 (sleep_duration)
	JournalText    *string           `json:"journal_text"`     // 饮食日记
	Exercise       *ExerciseDetail   `json:"exercise"`
	ColdShower     *ColdShowerDetail `json:"cold_shower"`
	Concerta       *ConcertaDetail   `json:"concerta"`
}

// CalculateSleepTagWithThresholds 根据入睡时间与自定义阈值计算熬夜等级。
// 就寝时间 < greenBefore 为 GREEN；[greenBefore, yellowBefore) 为 YELLOW；>= yellowBefore 为 RED。
// 阈值与就寝时间均按 HH:mm 解析，凌晨(00:00-04:00)按跨日 +24h 归一化。
func CalculateSleepTagWithThresholds(startTimeStr, greenBefore, yellowBefore string) string {
	total, ok := parseSleepTimeMinutes(startTimeStr)
	if !ok {
		return "GREEN"
	}
	green, okG := parseSleepTimeMinutes(greenBefore)
	yellow, okY := parseSleepTimeMinutes(yellowBefore)
	if !okG {
		green = 23 * 60
	}
	if !okY {
		yellow = 24 * 60
	}

	if total < green {
		return "GREEN"
	}
	if total < yellow {
		return "YELLOW"
	}
	return "RED"
}

// parseSleepTimeMinutes 将 HH:mm 折算为分钟；凌晨(00:00-04:00)按跨日后 +24h。
func parseSleepTimeMinutes(s string) (int, bool) {
	s = strings.TrimSpace(s)
	parts := strings.Split(s, ":")
	if len(parts) != 2 {
		return 0, false
	}
	hour, err := strconv.Atoi(parts[0])
	if err != nil {
		return 0, false
	}
	minute, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, false
	}
	if minute < 0 || minute > 59 {
		return 0, false
	}
	total := hour*60 + minute
	if hour >= 0 && hour <= 4 {
		total += 24 * 60
	}
	return total, true
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
	if dto.ColdShower != nil && dto.ColdShower.WaterTemp != nil {
		if *dto.ColdShower.WaterTemp < 0.0 || *dto.ColdShower.WaterTemp > 40.0 {
			return fmt.Errorf("冷水澡水温需在 0.0 ~ 40.0 ℃ 之间")
		}
	}
	return nil
}

