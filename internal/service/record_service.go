package service

import (
	"encoding/json"
	"fmt"
	"healthtrack/internal/config"
	"healthtrack/internal/model"
	"healthtrack/internal/repository"
	"regexp"
	"strings"
	"time"
)

type RecordService struct {
	repo    *repository.RecordRepository
	configs *config.RuntimeStore
}

func NewRecordService(repo *repository.RecordRepository, configs *config.RuntimeStore) *RecordService {
	return &RecordService{repo: repo, configs: configs}
}

// GetTodayRecord 获取今日记录
func (s *RecordService) GetTodayRecord(userID int64) (*model.HealthRecord, error) {
	today := time.Now().Format("2006-01-02")
	rec, err := s.repo.GetByDate(userID, today)
	if err != nil || rec == nil {
		return rec, err
	}
	s.applySleepTag(rec)
	return rec, nil
}

// SaveRecord 保存或合并记录
func (s *RecordService) SaveRecord(userID int64, dto *model.SaveRecordDTO) (*model.HealthRecord, error) {
	if err := dto.Validate(); err != nil {
		return nil, err
	}

	// 1. 按当前阈值实时计算熬夜颜色等级（落库仅作向前兼容与导出用）
	sleepTag := "GREEN"
	if dto.SleepStartTime != nil && *dto.SleepStartTime != "" {
		sleepTag = s.calcSleepTag(*dto.SleepStartTime)
	}

	// 2. 自动从日记文本中提取运动胶囊标签
	var activityTags string
	if dto.JournalText != nil && *dto.JournalText != "" {
		tags := extractActivityTags(*dto.JournalText)
		if len(tags) > 0 {
			tagBytes, _ := json.Marshal(tags)
			activityTags = string(tagBytes)
		}
	}

	return s.repo.SaveOrMerge(userID, dto, sleepTag, activityTags)
}

// GetHistoryRecords 获取指定区间历史数据
func (s *RecordService) GetHistoryRecords(userID int64, startDate, endDate string) ([]*model.HealthRecord, error) {
	if startDate == "" {
		startDate = time.Now().AddDate(0, 0, -6).Format("2006-01-02")
	}
	if endDate == "" {
		endDate = time.Now().Format("2006-01-02")
	}

	if startDate > endDate {
		return nil, fmt.Errorf("开始日期不能晚于结束日期")
	}

	records, err := s.repo.GetRange(userID, startDate, endDate)
	if err != nil {
		return nil, err
	}
	s.applySleepTags(records)
	return records, nil
}

// GetRecentRecords 按天数获取近 N 天的历史记录 (升序排列)
func (s *RecordService) GetRecentRecords(userID int64, days int) ([]*model.HealthRecord, error) {
	if days <= 0 {
		days = 30
	}
	endDate := time.Now().Format("2006-01-02")
	startDate := time.Now().AddDate(0, 0, -(days - 1)).Format("2006-01-02")
	records, err := s.repo.GetRange(userID, startDate, endDate)
	if err != nil {
		return nil, err
	}
	s.applySleepTags(records)
	return records, nil
}

// GetAllRecords 导出全量数据
func (s *RecordService) GetAllRecords(userID int64) ([]*model.HealthRecord, error) {
	records, err := s.repo.GetAll(userID)
	if err != nil {
		return nil, err
	}
	s.applySleepTags(records)
	return records, nil
}

// calcSleepTag 按当前配置的熬夜阈值实时计算等级。
func (s *RecordService) calcSleepTag(startTime string) string {
	cfg := s.configs.Snapshot()
	return model.CalculateSleepTagWithThresholds(startTime, cfg.Sleep.GreenBefore, cfg.Sleep.YellowBefore)
}

// applySleepTag 对单条记录按当前阈值重算 SleepTag。
func (s *RecordService) applySleepTag(r *model.HealthRecord) {
	if r == nil || r.SleepStartTime == nil || *r.SleepStartTime == "" {
		return
	}
	r.SleepTag = s.calcSleepTag(*r.SleepStartTime)
}

// applySleepTags 对多条记录按当前阈值重算 SleepTag。
func (s *RecordService) applySleepTags(records []*model.HealthRecord) {
	for _, r := range records {
		s.applySleepTag(r)
	}
}

// extractActivityTags 智能关键词运动标签提取
func extractActivityTags(text string) []string {
	var tags []string
	lower := strings.ToLower(text)

	// 规则库：关键词与对应图标标签
	rules := []struct {
		pattern string
		tag     string
	}{
		{`篮球`, "🏀 篮球"},
		{`骑车|骑行|单车`, "🚴 骑行"},
		{`跑步|慢跑|夜跑`, "🏃 跑步"},
		{`散步|快走|走步|步`, "🚶 散步/步行"},
		{`健身|无氧|举铁|哑铃|深蹲|卧推|硬拉`, "🏋️ 力量训练"},
		{`俯卧撑|引体向上|卷腹|平板支撑`, "💪 徒手抗阻"},
		{`游泳`, "🏊 游泳"},
		{`羽毛球`, "🏸 羽毛球"},
		{`乒乓球`, "🏓 乒乓球"},
		{`跳绳`, "🪢 跳绳"},
		{`瑜伽|拉伸`, "🧘 瑜伽/拉伸"},
		{`足球`, "⚽ 足球"},
	}

	// 尝试提取时间/距离后缀 (如 "打篮球半小时", "骑车 3km")
	for _, rule := range rules {
		re := regexp.MustCompile(rule.pattern)
		if re.MatchString(lower) {
			tags = append(tags, rule.tag)
		}
	}

	return tags
}
