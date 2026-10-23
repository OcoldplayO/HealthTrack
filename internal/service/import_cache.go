package service

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"time"

	"healthtrack/internal/model"
)

// 失败批次原文件保留策略：7 天、最多 10 个、总量 20 MB。
const (
	importCacheTTL      = 7 * 24 * time.Hour
	importCacheMaxFiles = 10
	importCacheMaxBytes = 20 << 20
)

// importCacheDir 返回原文件缓存目录；与数据库同盘，配置缺失时回落到系统临时目录。
func (s *ImportService) importCacheDir() string {
	if s.configs != nil {
		if p := s.configs.Snapshot().Database.Path; p != "" {
			return filepath.Join(filepath.Dir(p), "import_cache")
		}
	}
	return filepath.Join(os.TempDir(), "healthtrack_import_cache")
}

// saveImportCache 把原始数据落盘，供失败批次重试与失败行导出。写盘失败不阻断导入。
func (s *ImportService) saveImportCache(source string, data []byte) string {
	dir := s.importCacheDir()
	if err := os.MkdirAll(dir, 0700); err != nil {
		slog.Warn("创建导入缓存目录失败，失败重试不可用", "err", err)
		return ""
	}
	ext := ".csv"
	switch source {
	case "json":
		ext = ".json"
	case "memo":
		ext = ".txt"
	}
	name := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), shortHash(data), ext)
	path := filepath.Join(dir, name)
	if err := os.WriteFile(path, data, 0600); err != nil {
		slog.Warn("写入导入缓存失败，失败重试不可用", "err", err)
		return ""
	}
	s.CleanupImportCache()
	return path
}

// readImportCache 读取仍在保留期内的原文件；过期或缺失时返回 ErrImportCacheExpired。
func (s *ImportService) readImportCache(batch *model.ImportBatch) ([]byte, error) {
	if batch.CachePath == "" {
		return nil, ErrImportCacheExpired
	}
	info, err := os.Stat(batch.CachePath)
	if err != nil {
		return nil, ErrImportCacheExpired
	}
	if time.Since(info.ModTime()) > importCacheTTL {
		return nil, ErrImportCacheExpired
	}
	data, err := os.ReadFile(batch.CachePath)
	if err != nil {
		return nil, ErrImportCacheExpired
	}
	return data, nil
}

// removeImportCache 删除已成功写入、不再需要重试的原文件。
func (s *ImportService) removeImportCache(path string) {
	if path == "" {
		return
	}
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		slog.Warn("清理导入缓存失败", "path", path, "err", err)
	}
}

// shortHash 取 SHA-256 前 12 位，用于生成不重复的缓存文件名。
func shortHash(data []byte) string {
	h := hashBytes(data)
	if len(h) > 12 {
		return h[:12]
	}
	return h
}

// CleanupImportCache 清理过期或超出配额的原文件缓存，服务启动时与每次落盘后调用。
func (s *ImportService) CleanupImportCache() int {
	dir := s.importCacheDir()
	entries, err := os.ReadDir(dir)
	if err != nil {
		return 0
	}

	type cacheItem struct {
		path string
		size int64
		mod  time.Time
	}
	items := make([]cacheItem, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			continue
		}
		items = append(items, cacheItem{
			path: filepath.Join(dir, entry.Name()),
			size: info.Size(),
			mod:  info.ModTime(),
		})
	}
	// 新文件优先保留。
	sort.Slice(items, func(i, j int) bool { return items[i].mod.After(items[j].mod) })

	removed, total := 0, int64(0)
	for i, item := range items {
		expired := time.Since(item.mod) > importCacheTTL
		overCount := i >= importCacheMaxFiles
		overBytes := total+item.size > importCacheMaxBytes
		if expired || overCount || overBytes {
			if err := os.Remove(item.path); err == nil {
				removed++
			}
			continue
		}
		total += item.size
	}
	return removed
}
