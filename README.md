# HealthTrack 智能健康洞察追踪系统

> 一款专为解决“多维度健康数据孤岛”而生的极简健康追踪与 AI 关联分析系统。

**技术栈**：Go 1.25（`net/http` + `modernc.org/sqlite`，纯 Go 免 CGO）· Vite · Tailwind CSS · Chart.js · Android WebView 壳

---

## 核心特性

### 极简极客设计体系（Design System v3.0）
- **Linear / Raycast 1px 工业单线美学**：全站 4 个核心 Tab 页面（记一笔、数据看板、AI 深度洞察、睡前小结）全面收敛为精致的 12px 圆角单线容器（`.ht-card`），彻底淘汰浮夸渐变、粗笨投影与大圆角。
- **等宽数字排版体系**：所有数值、时间、单位、指标对比与微标签强制绑定 `JetBrains Mono` 等宽字体（`.font-mono` + `.tabular-nums`），保障跨端数据严整对齐。
- **矢量化无干扰图标**：全面淘汰原生彩色 Emoji，统一采用 1.5px 极细线性内联 SVG（Lucide 风格规范）。
- **中性灰阶基调**：Neutral 50~900 极简灰阶，搭配克制的单线分段切换胶囊（`.ht-seg-btn`）与 2px 极细滑轨（`.ht-range`）。

### 录入与生理追踪
- **极简录入，顺应习惯**：晨起空腹体重、睡前体重、腰围、睡眠时长 4 个数字 + 自由文本日记，免除繁琐搜索。
- **专项生理与生物黑客打卡**：运动（有氧 / 抗阻独立多选）、专注达（服药时间、剂量、启动力、副作用）、冷水澡（刺激时机、体感感觉、预估水温录入）。
- **低负担行为三项**：晨光（一键 YES/NO）、步数（0–20000 极细滑块，500 一档，可留空）、午餐结构化点选（支持「沿用昨天」）——单项 ≤ 2 次点击，允许当天不记。
- **智能草稿与跨日核算**：按日期自动存本地草稿，未保存离开弹窗防护；跨日睡眠 04:00 截断，自动评定未熬夜 / 轻度熬夜 / 重度熬夜（阈值可在 `config.yaml` 自定义）。

### 数据导入与导出
- **文件导入（CSV / JSON）**：先预检、不落库，逐行给出「新增 / 更新」以及旧值 → 新值的字段差异；确认后以单事务原子写入，中途失败整体回滚。单次上限 5000 行 / 5 MB。
- **备忘录导入**：直接粘贴手写行（如「10.2：晨起体重 76.9，腰围 78，睡前 78」），按关键词精准取数，裸数字（如「米饭 300g」）不会误判为体重，年份自动推断。
- **批次历史与失败重试**：每次导入留有批次记录，失败行可导出修正后重新补导。
- **导出与全量备份**：按时间范围导出 CSV；提供 JSON 全量备份，可原样回灌，用于换机或重装恢复（小结照片存储于本地）。

### 多维可视化分析
- **生理归因分析**：晨起空腹 vs 睡前体重差（$\Delta W$）监测，智能归因高糖碳水与代谢消耗、夜间排水。
- **周平均趋势**：以自然周（周一至周日）为节点，默认展示最近 12 周均值走势与 min/max 区间带，支持体重 / 腰围 / 睡眠 / 步数四个 Tab；当周仅 1~3 条记录时标注低置信，0 条记录直接断点。
- **60 天趋势详情**：独立视图按 Tab 切换四类数据，竖屏横向滚动、横屏自适应铺满一屏；缺失日断点不补 0。
- **阶段对比（Compare View）**：双自然月独立横向对比（默认「上月 vs 上上个月」，支持跨年对比）；自动聚合九项指标差异快照（体重均值与净变化、腰围均值与净变化、平均睡眠时长、熬夜分布、运动天数与强度、专注达天数、夜间排水均值），并由 AI 生成阶段对比复盘综述。

### AI 深度洞察与睡前小结
- **全周期深度复盘**：自选近 7 天 / 近 30 天 / 近 60 天分析跨度与自定义截止日，SSE 流式打字机响应，思维链与正文分区展示。
- **睡前小结深度洞察**：纯白底单线卡片，结合当晚小结（1-10 自评分、三件事、那一刻感想、难忘照片）与关联生理数据窗口（近 7 天 / 近 30 天），从心理状态与成就感角度深度解读。
- **洞察历史存档**：按分析窗口独立回显，支持关键词搜索、周期档位筛选、单条删除、左滑删除与多选批量管理；同档位洞察支持多条共存，重新生成前二次确认。
- **输出可控**：思考链与正文强制中文输出，总输出长度由 `ai.max_tokens` 硬封顶，去除一切干扰 Emoji。

### 工程与交付
- **单一可执行文件交付**：基于 Go Embed 技术，前端静态产物与后端服务一体化打包，零环境依赖，秒级启动。
- **前端自托管与离线可用**：自托管 Tailwind 与 Chart.js，无任何公网 CDN 依赖，完全支持离线环境。
- **仅监听本机回环**：服务固定绑定 `127.0.0.1`，API Key 与 SQLite 数据库不对外暴露。
- **自动化冷备份**：服务启动自动备份 SQLite 数据库，数据安全持久。
- **手机端 APP**：Android WebView 壳 + 交叉编译的内嵌服务端（arm64-v8a），覆盖安装平滑保留手机本地数据。

---

## 快速启动

### 前端开发与构建（Vite 工程）
```bash
# 1. 进入前端源码目录
cd web

# 2. 安装依赖（首次运行）
npm install

# 3. 编译生产产物（将 web/src/ 构建输出到 web/static/）
npm run build

# 4. 本地前端开发调试（支持热重载，连接本机运行的服务端）
npm run dev
```

### 方式一：本地源码运行
```bash
# 1. 运行服务（默认监听 127.0.0.1:8080）
go run cmd/server/main.go

# 可选参数：-port 指定端口、-config 指定配置文件、-data-dir 指定数据库目录
go run cmd/server/main.go -port 8080 -data-dir ./data

# 2. 浏览器访问
http://localhost:8080
```

> 首次启动会自动生成不含 API Key 的 `config.yaml`（权限 0600）。在本地开发前端且希望实时调试产物时，可将 `server.dev_mode` 设为 `true`。

### 方式二：编译单二进制文件
```bash
# 编译前确保已执行 npm run build 完成前端落盘
go build -ldflags="-s -w" -o bin/healthtrack.exe cmd/server/main.go

# 编译 Linux 独立可执行文件 (零 CGO 依赖)
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/healthtrack cmd/server/main.go
```

### 方式三：手机端打包（本地免 CI 无线覆盖安装）
```powershell
# 自动流程：确认无线连接 → 自动读取手机已装版本并递增 versionCode → 交叉编译 arm64 内核 → Gradle 打包 → adb install -r 覆盖安装（保留手机全部数据）→ 拉起 App
powershell -ExecutionPolicy Bypass -File scripts\build-android.ps1 -DeviceAddress <手机IP>:5555

# 手动指定版本号（必须大于手机已装 versionCode，否则无法覆盖安装）
powershell -ExecutionPolicy Bypass -File scripts\build-android.ps1 -DeviceAddress <手机IP>:5555 -VersionCode 121
```

> 该脚本包含本机签名口令与路径，已被 `.gitignore` 排除。仓库侧另提供 GitHub Actions：推送 `main` 分支触发 `build-apk.yml` 自动打包，推送 `v*` tag 触发 `release-apk.yml` 发布 Release。无线调试排查指引见 [ADB_GUIDE.md](ADB_GUIDE.md)。

---

## 配置说明 (`config.yaml`)

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
  thinking: ""             # 思维链开关：enabled / disabled；留空则不传该参数

sleep:
  green_before: "23:00"    # 早于此时间入睡为未熬夜（绿）
  yellow_before: "00:00"   # [23:00, 00:00) 为轻度熬夜（黄）；0 点及以后为重度（红）

summary:
  score_bands:             # 睡前小结评分的文案分档（区间 + 标签 + 配色）
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

> API Key 也可用环境变量覆盖，优先级高于 `config.yaml`：`AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL`，适合容器化或 CI 部署。

---

## 项目架构

```text
├── cmd/server/main.go              # 程序入口、路由注册、静态缓存控制与优雅停机
├── internal/
│   ├── config/                     # 配置解析、默认模板生成与运行时热更新
│   ├── handler/                    # 控制器（记录、洞察、睡前小结、导入导出、配置）
│   ├── service/                    # 业务逻辑、两月指标聚合、提示词装配、导入解析
│   │   └── default_*_prompt.txt    # 内嵌提示词兜底副本（Android 端走此份）
│   ├── repository/                 # SQLite 持久层、导入批次与启动冷备份
│   ├── model/                      # 数据实体与状态码契约
│   └── netutil/                    # Android 端 DNS 解析修复
├── prompts/
│   ├── insight_v1.txt              # 周期洞察提示词模板
│   ├── evening_insight_v1.txt      # 睡前小结洞察提示词模板
│   └── compare_v1.txt              # 阶段对比提示词模板
├── web/
│   ├── src/                        # 前端源码工程（模块化开发入口）
│   │   ├── views/                  # 4 大业务视图（log / dash / insight / evening）
│   │   ├── components/             # 通用交互组件（BottomNav / Modals / Toast）
│   │   ├── services/               # API 抽象层与轻量状态管理
│   │   ├── utils/                  # 日期、Markdown 渲染、对话框与格式化工具
│   │   ├── css/app.css             # HealthTrack 3.0 极简单线 Design Tokens
│   │   ├── index.html              # 移动端适配单页主入口
│   │   └── main.js                 # 前端应用引导与模块装载
│   ├── static/                     # Vite 生产编译产物（由 npm run build 生成）
│   │   ├── assets/                 # 编译后的压缩 Bundle（index.js / index.css）
│   │   ├── vendor/                 # 自托管离线库（Tailwind 3.4.17 / Chart.js 4.5.1）
│   │   └── index.html              # 编译后的单页模板
│   ├── package.json                # 前端开发依赖与构建脚本
│   ├── vite.config.js              # Vite 构建配置（相对路径基准 ./）
│   └── embed.go                    # go:embed 静态资源打包声明
├── android/                        # Android WebView 壳工程（Gradle，arm64-v8a）
├── scripts/build-android.ps1       # 本地一键打包 + 无线覆盖安装脚本（已加入 .gitignore）
├── .github/workflows/              # CI：build-apk.yml 推 main 自动打包；release-apk.yml 推 tag 发 Release
├── config.yaml.example             # 配置模板（Android 打包时复制进 assets）
├── SYSTEM_DESIGN.md                # 系统架构、工程规范与实施指南（权威单源）
└── ADB_GUIDE.md                    # 无线调试与真机调试指引
```

---

## 工程约定（摘要）

- **数据绝对安全**：数据库结构变更仅允许 `ALTER TABLE ... ADD COLUMN`，严禁 `DROP` / `TRUNCATE`，避免历史数据丢失。
- **平滑覆盖安装**：手机端必须使用 `adb install -r` 覆盖安装，严禁卸载重装或清除应用数据。
- **真假缺失分离**：测量类数据（体重 / 腰围 / 睡眠）缺失周期以断点展示，严禁以 0 填充。
- **严密导入预检**：数据导入必须走「预检 → 用户确认 → 单事务写入」，预检阶段严禁落库；失败行保留原文件缓存，便于修正后重试。
- **前端开发约束**：严禁直接修改 `web/static/` 下的构建产物。所有前端功能和样式改动必须在 `web/src/` 中完成，并在编译 Go 服务端或打包 APK 前执行 `npm run build`。
- 其余规范详见 [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)。
