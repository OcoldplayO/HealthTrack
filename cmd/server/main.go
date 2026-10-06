package main

import (
	"context"
	"flag"
	"fmt"
	"io/fs"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"healthtrack/internal/config"
	"healthtrack/internal/handler"
	"healthtrack/internal/netutil"
	"healthtrack/internal/repository"
	"healthtrack/internal/service"
	"healthtrack/web"
)

func main() {
	// 必须在任何网络请求之前执行：修复 Android 上的 DNS 解析。
	netutil.ConfigureResolver()

	var (
		configPath string
		dataDir    string
		port       int
	)

	flag.StringVar(&configPath, "config", "", "配置文件路径；未指定时使用项目根目录的 config.yaml")
	flag.StringVar(&dataDir, "data-dir", "", "数据库和备份数据目录；指定后数据库固定为 <data-dir>/health.db")
	flag.IntVar(&port, "port", 0, "HTTP 监听端口；0 表示使用 config.yaml 中的 server.port")
	flag.Parse()

	// 1. 初始化结构化日志
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	slog.Info("HealthTrack 智能健康系统正在启动...")

	// 2. 加载配置；不存在时会自动创建不含 API Key 的模板。
	cfg, err := config.LoadConfig(configPath, dataDir)
	if err != nil {
		slog.Error("加载配置失败", "err", err)
		os.Exit(1)
	}

	if port > 0 {
		cfg.Server.Port = port
	}
	if cfg.Server.Port <= 0 || cfg.Server.Port > 65535 {
		slog.Error("无效的 HTTP 端口", "port", cfg.Server.Port)
		os.Exit(1)
	}

	resolvedConfigPath, err := config.ResolveConfigPath(configPath)
	if err != nil {
		slog.Error("解析配置文件路径失败", "err", err)
		os.Exit(1)
	}
	slog.Info("配置加载完成", "config", resolvedConfigPath, "database", cfg.Database.Path, "backup_dir", cfg.Database.BackupDir, "port", cfg.Server.Port)
	runtimeConfigs := config.NewRuntimeStore(cfg, resolvedConfigPath)

	// 3. 初始化 SQLite 数据库与自动备份
	dbMgr, err := repository.InitDB(cfg.Database.Path, cfg.Database.BackupDir)
	if err != nil {
		slog.Error("初始化数据库失败", "err", err)
		os.Exit(1)
	}
	defer dbMgr.Close()

	// 4. 依赖注入与分层装配
	recordRepo := repository.NewRecordRepository(dbMgr.DB)
	insightRepo := repository.NewInsightRepository(dbMgr.DB)
	eveningRepo := repository.NewEveningRepository(dbMgr.DB)
	recordService := service.NewRecordService(recordRepo, runtimeConfigs)
	insightService := service.NewInsightService(recordRepo)
	eveningService := service.NewEveningService(eveningRepo, runtimeConfigs)
	aiService := service.NewAIService(runtimeConfigs, recordRepo)
	aiHandler := handler.NewAIHandler(runtimeConfigs, insightService, recordService, insightRepo, eveningRepo)
	insightHandler := handler.NewInsightHandler(insightRepo)
	configHandler := handler.NewConfigHandler(runtimeConfigs)
	recordHandler := handler.NewRecordHandler(recordService, aiService)
	eveningHandler := handler.NewEveningHandler(eveningService)

	// 5. 路由注册
	mux := http.NewServeMux()

	// RESTful API 路由
	mux.HandleFunc("/api/v1/records/today", recordHandler.GetToday)
	mux.HandleFunc("/api/v1/records", recordHandler.SaveRecord)
	mux.HandleFunc("/api/v1/records/history", recordHandler.GetHistory)
	mux.HandleFunc("GET /api/v1/insights/stream", aiHandler.StreamInsight)
	mux.HandleFunc("GET /api/v1/insights", insightHandler.List)
	mux.HandleFunc("GET /api/v1/insights/{id}", insightHandler.Detail)
	mux.HandleFunc("DELETE /api/v1/insights/{id}", insightHandler.Delete)
	mux.HandleFunc("POST /api/v1/insights/batch-delete", insightHandler.BatchDelete)

	// 睡前小结
	mux.HandleFunc("GET /api/v1/evening/summary", eveningHandler.GetSummary)
	mux.HandleFunc("POST /api/v1/evening/summary", eveningHandler.SaveSummary)
	mux.HandleFunc("GET /api/v1/evening/summaries", eveningHandler.List)
	mux.HandleFunc("DELETE /api/v1/evening/summary/{date}", eveningHandler.Delete)
	mux.HandleFunc("POST /api/v1/evening/photo", eveningHandler.UploadPhoto)
	mux.HandleFunc("GET /api/v1/evening/photo/{id}", eveningHandler.GetPhoto)
	mux.HandleFunc("DELETE /api/v1/evening/photo/{id}", eveningHandler.DeletePhoto)
	mux.HandleFunc("GET /api/v1/evening/insight/stream", aiHandler.StreamEveningInsight)
	mux.HandleFunc("GET /api/v1/evening/insight", insightHandler.EveningDetail)
	mux.HandleFunc("DELETE /api/v1/evening/insight", insightHandler.EveningDelete)

	mux.HandleFunc("/api/v1/export", recordHandler.ExportCSV)
	mux.HandleFunc("/api/v1/export/json", recordHandler.ExportJSON)
	mux.HandleFunc("/healthz", recordHandler.Healthz)
	mux.HandleFunc("/api/config", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			configHandler.Get(w, r)
		case http.MethodPost:
			configHandler.Update(w, r)
		default:
			configHandler.Get(w, r)
		}
	})
	mux.HandleFunc("/api/config/test", configHandler.Test)
	mux.HandleFunc("/api/config/sleep", configHandler.UpdateSleep)
	mux.HandleFunc("/api/config/summary", configHandler.UpdateSummary)

	// 前端静态页面分发（开发模式读取磁盘，生产模式走内嵌内存）。
	var staticHandler http.Handler
	if cfg.Server.DevMode {
		staticDir := filepath.Join(cfg.ProjectRoot, "web", "static")
		if _, err := os.Stat(filepath.Join(staticDir, "index.html")); err == nil {
			slog.Info("运行于开发模式: 从本地磁盘实时读取 web/static", "dir", staticDir)
			staticHandler = http.FileServer(http.Dir(staticDir))
		} else {
			slog.Warn("开发模式静态资源不存在，回退到内嵌资源", "dir", staticDir)
		}
	}

	if staticHandler == nil {
		slog.Info("运行于单二进制内嵌模式: 从内存直接加载静态页面")
		staticSub, err := fs.Sub(web.StaticFS, "static")
		if err != nil {
			slog.Error("加载内嵌静态资源失败", "err", err)
			os.Exit(1)
		}
		staticHandler = http.FileServer(http.FS(staticSub))
	}

	// 内嵌前端随二进制更新，HTML 必须禁用客户端缓存。否则浏览器 / Android WebView
	// 可能复用旧 index.html，导致 App 覆盖安装后仍渲染上一版页面（新功能「看不见」）。
	staticHandler = noCacheHTML(staticHandler)
	mux.Handle("/", staticHandler)

	// 6. HTTP 服务启动
	// 配置接口包含敏感信息，服务仅监听本机回环地址。
	// Android WebView 与桌面浏览器均通过 127.0.0.1 访问。
	serverAddr := fmt.Sprintf("127.0.0.1:%d", cfg.Server.Port)
	server := &http.Server{
		Addr:    serverAddr,
		Handler: mux,
		//读取客户端请求超时
		ReadTimeout: 15 * time.Second,
		//写入响应超时，0 表示不设置写超时，长连接 SSE 由客户端主动断开或传输完毕为止
		WriteTimeout: 0,
		//空闲连接复用超时
		IdleTimeout: 60 * time.Second,
	}

	// 先显式绑定端口，再宣告启动成功。否则端口被占用时会先打出「服务已成功启动」
	// 紧接着异常退出，让人误以为服务是好的，只是功能坏了。
	listener, err := net.Listen("tcp", serverAddr)
	if err != nil {
		slog.Error("HTTP 服务启动失败，端口可能已被占用", "addr", serverAddr, "err", err)
		reportStartupFailure(fmt.Sprintf("HTTP 服务启动失败 (%s): %v", serverAddr, err))
		os.Exit(1)
	}
	slog.Info("服务已成功启动", "url", fmt.Sprintf("http://127.0.0.1:%d", cfg.Server.Port))

	go func() {
		if err := server.Serve(listener); err != nil && err != http.ErrServerClosed {
			slog.Error("HTTP 服务异常退出", "err", err)
			os.Exit(1)
		}
	}()

	// 7. 优雅停机信号捕获
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

// noCacheHTML 给 HTML 文档响应加上禁止缓存的响应头。
// 前端内嵌在二进制里，每次重新编译都会变化；若客户端缓存了旧页面，
// 用户在浏览器或 Android WebView 中会看到上一版界面，误以为新功能没做出来。
func noCacheHTML(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if p := r.URL.Path; p == "/" || strings.HasSuffix(p, ".html") {
			w.Header().Set("Cache-Control", "no-cache, must-revalidate")
		}
		next.ServeHTTP(w, r)
	})
}

// reportStartupFailure 把启动失败原因写入可执行文件同目录的日志文件。
// 双击运行时控制台窗口会随进程退出瞬间关闭，用户看不到任何错误信息，
// 落盘一份日志才能事后排查。
func reportStartupFailure(reason string) {
	fmt.Fprintln(os.Stderr, reason)

	exePath, err := os.Executable()
	if err != nil {
		return
	}

	logPath := filepath.Join(filepath.Dir(exePath), "healthtrack-startup-error.log")
	entry := fmt.Sprintf("%s %s\n", time.Now().Format(time.RFC3339), reason)
	if err := os.WriteFile(logPath, []byte(entry), 0600); err != nil {
		return
	}
	fmt.Fprintf(os.Stderr, "详情已写入: %s\n", logPath)
}
