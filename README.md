# HealthTrack 智能健康洞察追踪系统 🏃‍♂️📊

> 一款专为解决“多维度健康数据孤岛”而生的极简健康追踪与 AI 关联分析系统。

---

## ✨ 核心特性

### 录入与记录
- **极简录入，顺应习惯**：晨起空腹体重、睡前体重、腰围、睡眠时长 4 个数字 + 自由文本日记，免除繁琐搜索。
- **专项生理与习惯打卡**：运动（有氧 / 无氧多选）、专注达、冷水澡等标记，运动记录支持同时勾选多种类型。
- **跨日睡眠 04:00 截断**：符合生物节律，自动评定 🟢 未熬夜 / 🟡 轻度熬夜 / 🔴 重度熬夜，判定阈值可在 `config.yaml` 自定义。

### 可视化分析
- **生理归因分析**：晨起空腹 vs 睡前体重差（$\Delta W$）监测，智能归因高糖碳水与代谢消耗、夜间排水。
- **周平均趋势**：以自然周（周一至周日）为节点，默认展示最近 12 周均值走势与 min/max 区间带；当周仅 1~3 条记录时标注低置信，0 条记录直接断点。
- **60 天趋势详情**：独立视图按 Tab 切换体重 / 腰围 / 睡眠三类数据，竖屏横向滚动、横屏自适应铺满一屏。
- **阶段对比**：默认「上月 vs 上上个月」，支持任意两个互不重叠的自然月（含跨年）；自动聚合九项指标（体重均值与净变化、腰围均值与净变化、平均睡眠时长、熬夜绿/黄/红分布、有运动天数与强度、专注达天数、夜间排水均值）并生成 AI 对比综述。

### AI 洞察
- **AI 智能深度复盘**：自选 7 / 30 / 60 天分析跨度与截止日，SSE 流式打字机响应，思维链与正文分区展示，指出异常并输出微调建议。
- **睡前小结洞察**：结合当晚小结（自评分 / 三件事 / 感想 / 照片）与自选 7 或 30 天生理数据窗口，从心理状态与成就感角度解读。
- **洞察历史存档**：按分析窗口独立回显，支持关键词搜索、档位筛选、单条删除、左滑删除与批量管理；同档位洞察可多条共存，重新生成前二次确认。
- **输出可控**：思考链与正文强制简体中文，总输出长度由 `ai.max_tokens` 硬封顶，避免 token 失控。

### 工程与交付
- **单一可执行文件交付**：基于 Go Embed 技术，前端网页与后端服务一体化打包，零环境依赖，秒级启动。
- **前端库自托管**：Tailwind、Chart.js 落 `web/static/vendor` 目录随二进制打包，无公网 CDN 依赖，离线可用。
- **自动化冷备份**：启动自动备份 SQLite 数据库，数据永不丢失。
- **手机端 APP**：Android WebView 壳 + 交叉编译的内嵌服务端，覆盖安装即可保留手机本地数据。

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

### 方式三：手机端打包（本地免 CI）
```powershell
# 自动：重连无线 adb → versionCode 取手机已装版本 +1 → 交叉编译服务端 → Gradle 打包
#      → adb install -r 覆盖安装（保留手机数据）→ 拉起 App
powershell -ExecutionPolicy Bypass -File scripts\build-android.ps1 -DeviceAddress <手机IP>:5555
```

---

## ⚙️ 配置说明 (`config.yaml`)

```yaml
server:
  port: 8080
  dev_mode: false          # 生产部署设为 false

database:
  path: "./data/health.db"
  backup_dir: "./data/backups"

ai:
  base_url: "https://api.deepseek.com/v1"   # 兼容 DeepSeek / 智谱 GLM / Gemini / OpenAI
  api_key: "sk-xxxxxxxx"                    # 填入你的 API Key
  model: "deepseek-chat"
  max_tokens: 10000        # 思考 + 正文总输出硬封顶，0 表示不限制

sleep:
  green_before: "01:00"    # 未熬夜截止时间
  yellow_before: "02:00"   # 轻度熬夜截止时间

summary:
  score_bands:             # 睡前小结评分的文案分档（区间 + 标签 + 色调）
    - range: [1, 2]
      label: 很低落
      tone: rose
    - range: [3, 4]
      label: 有点钝
      tone: amber
    - range: [5, 6]
      label: 平平
      tone: emerald
    - range: [7, 8]
      label: 还不错，稳住了节奏
      tone: indigo
    - range: [9, 10]
      label: 满分的一天
      tone: violet
```

---

## 📂 项目架构

```text
├── cmd/server/main.go              # 程序入口、路由注册与优雅停机
├── internal/
│   ├── config/                     # 配置解析与热加载
│   ├── handler/                    # 控制器 (RESTful API & SSE 流式接口)
│   ├── service/                    # 业务逻辑、两月指标聚合与提示词装配
│   │   └── default_*_prompt.txt    # 内嵌提示词兜底副本（Android 端走此份）
│   ├── repository/                 # SQLite 持久层与自动备份
│   └── model/                      # 数据实体与状态码
├── prompts/
│   ├── insight_v1.txt              # 周期洞察提示词模板
│   ├── evening_insight_v1.txt      # 睡前小结洞察提示词模板
│   └── compare_v1.txt              # 阶段对比提示词模板
├── web/static/
│   ├── index.html                  # 响应式单页前端（电脑端 / 手机端共用）
│   └── vendor/                     # 自托管 Tailwind 与 Chart.js
├── android/                        # Android WebView 壳工程（Gradle）
├── scripts/build-android.ps1       # 本地一键打包 + 无线覆盖安装脚本
├── .github/workflows/              # CI：APK 构建与 Release 发布
├── SYSTEM_DESIGN.md                # 系统设计与工程规范说明书
└── ADB_GUIDE.md                    # 无线调试与真机调试指引
```

---

## 📌 工程约定（摘要）

- 数据库结构变更仅允许 `ALTER TABLE ... ADD COLUMN`，严禁 `DROP` / `TRUNCATE`，避免历史数据丢失。
- 手机端一律 `adb install -r` 覆盖安装，严禁卸载重装或清除应用数据。
- 测量类数据（体重 / 腰围 / 睡眠）缺失周期以断点展示，严禁以 0 填充。
- 其余规范详见 [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)。
