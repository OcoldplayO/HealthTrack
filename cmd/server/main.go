package main

import (
	"context"
	"fmt"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/handler"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
	"healthtrack/web"
)

func main() {
	// 1. 初始化结构化日志
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	slog.Info("HealthTrack 智能健康系统正在启动...")

	// 2. 加载配置
	cfg, err := config.LoadConfig("config.yaml")
	if err != nil {
		slog.Warn("未找到外部 config.yaml，使用默认内置配置", "err", err)
	}

	// 3. 初始化 SQLite 数据库与自动备份
	dbMgr, err := repository.InitDB(cfg.Database.Path, cfg.Database.BackupDir)
	if err != nil {
		slog.Error("初始化数据库失败", "err", err)
		os.Exit(1)
	}
	defer dbMgr.Close()

	// 4. 依赖注入与分层装配
	recordRepo := repository.NewRecordRepository(dbMgr.DB)
	recordService := service.NewRecordService(recordRepo)
	aiService := service.NewAIService(&cfg.AI, recordRepo)
	recordHandler := handler.NewRecordHandler(recordService, aiService)

	// 5. 路由注册
	mux := http.NewServeMux()

	// RESTful API 路由
	mux.HandleFunc("/api/v1/records/today", recordHandler.GetToday)
	mux.HandleFunc("/api/v1/records", recordHandler.SaveRecord)
	mux.HandleFunc("/api/v1/records/history", recordHandler.GetHistory)
	mux.HandleFunc("/api/v1/insights/stream", recordHandler.StreamInsight)
	mux.HandleFunc("/api/v1/export", recordHandler.ExportCSV)      // 默认导出 Excel 友好的 CSV
	mux.HandleFunc("/api/v1/export/json", recordHandler.ExportJSON) // 备份专用的 JSON 导出
	mux.HandleFunc("/healthz", recordHandler.Healthz)

	// 前端静态页面分发（安全自适应：优先磁盘，若无磁盘文件则无缝走内存内嵌）
	var staticHandler http.Handler
	if cfg.Server.DevMode {
		if _, err := os.Stat("web/static/index.html"); err == nil {
			slog.Info("运行于开发模式: 从本地磁盘实时读取 web/static")
			staticHandler = http.FileServer(http.Dir("web/static"))
		}
	}

	if staticHandler == nil {
		slog.Info("运行于单二进制内嵌模式: 从内存二进制直接加载静态页面")
		staticSub, err := fs.Sub(web.StaticFS, "static")
		if err != nil {
			slog.Error("加载内嵌静态资源失败", "err", err)
			os.Exit(1)
		}
		staticHandler = http.FileServer(http.FS(staticSub))
	}

	mux.Handle("/", staticHandler)

	// 6. HTTP 服务与优雅停机
	serverAddr := fmt.Sprintf(":%d", cfg.Server.Port)
	server := &http.Server{
		Addr:         serverAddr,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 60 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		slog.Info("服务已成功启动", "url", fmt.Sprintf("http://localhost:%d", cfg.Server.Port))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("HTTP 服务异常退出", "err", err)
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	slog.Info("接收到停机信号，正在优雅关闭服务...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		slog.Error("服务关闭时发生异常", "err", err)
	}

	slog.Info("HealthTrack 服务已安全停止")
}
