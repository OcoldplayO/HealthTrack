# HealthTrack 智能健康洞察追踪系统 🏃‍♂️📊

> 一款专为解决“多维度健康数据孤岛”而生的极简健康追踪与 AI 关联分析系统。

---

## ✨ 核心特性

- **极简录入，顺应习惯**：4 快捷数字（晨起/睡前体重、腰围、睡眠）+ 自由文本日记，免除繁琐搜索。
- **生理归因分析**：晨起空腹 vs 睡前体重差（$\Delta W$）监测，智能归因高糖碳水与代谢消耗。
- **跨日睡眠 04:00 截断**：符合生物节律，自动评定 🟢未熬夜 / 🟡轻度熬夜 / 🔴重度熬夜。
- **AI 智能深度复盘**：自选 7~60 天分析跨度，SSE 流式打字机秒级响应，指出异常并输出微调建议。
- **单一可执行文件交付**：基于 Go Embed 技术，前端网页与后端服务一体化打包，零环境依赖，秒级启动。
- **自动化冷备份**：启动自动备份 SQLite 数据库，数据永不丢失。

---

## 🚀 快速启动

### 方式一：本地源码运行
```bash
# 1. 运行服务 (默认监听 8080 端口)
go run cmd/server/main.go

# 2. 浏览器访问
http://localhost:8080
```

### 方式二：编译单二进制文件
```bash
# 编译 Windows 可执行文件 (生成 bin/healthtrack.exe)
go build -ldflags="-s -w" -o bin/healthtrack.exe cmd/server/main.go

# 编译 Linux 独立可执行文件 (零 CGO 依赖)
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/healthtrack cmd/server/main.go
```

---

## ⚙️ 大模型配置 (`config.yaml`)

编辑 `config.yaml` 填入你的大模型 API Key（兼容 DeepSeek / 智谱 GLM / Gemini / OpenAI）：

```yaml
server:
  port: 8080
  dev_mode: false # 生产部署设为 false

database:
  path: "./health.db"
  backup_dir: "./backups"

ai:
  base_url: "https://api.deepseek.com/v1"
  api_key: "sk-xxxxxxxx" # 填入你的 API Key
  model: "deepseek-chat"
```

---

## 📂 项目架构

```text
├── cmd/server/main.go          # 程序入口与优雅停机
├── internal/
│   ├── config/                 # 配置解析
│   ├── handler/                # 控制器 (RESTful API & SSE 流式接口)
│   ├── service/                # 业务逻辑与 AI 提示词装配
│   ├── repository/             # SQLite 持久层与自动备份
│   └── model/                  # 数据实体与状态码
├── prompts/insight_v1.txt      # AI 提示词模板
├── web/static/index.html       # 响应式移动端前端
├── SYSTEM_DESIGN.md            # 系统设计与工程规范说明书
└── Makefile                    # 一键构建脚本
```
