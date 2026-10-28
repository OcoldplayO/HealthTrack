# HealthTrack 智能健康洞察追踪系统 🏃‍♂️📊

> 一款专为解决“多维度健康数据孤岛”而生的极简健康追踪与 AI 关联分析系统。

**技术栈**：Go 1.25（`net/http` + `modernc.org/sqlite`，纯 Go 免 CGO）· Tailwind CSS · Chart.js · Android WebView 壳

---

## ✨ 核心特性

### 录入与记录
- **极简录入，顺应习惯**：晨起空腹体重、睡前体重、腰围、睡眠时长 4 个数字 + 自由文本日记，免除繁琐搜索。
- **专项生理与习惯打卡**：运动（有氧 / 无氧多选）、专注达、冷水澡等标记，运动记录支持同时勾选多种类型。
- **低负担行为三项**：晨光（一键 是/否）、步数（0–20000 滑块，500 一档，可留空）、午餐（折叠卡，蛋白/主食/碳水/烹饪六行结构化点选，支持「沿用昨天」）——单项 ≤ 2 次点击，允许当天不记。
- **吸底保存条**：固定在 Tab 栏上方，有改动显示蓝色「保存今日记录 · 未保存」、保存后变绿色「✓ 今日已保存 HH:MM」；按日期自动存本地草稿，切日期或离开前未保存会弹应用内确认框。
- **跨日睡眠 04:00 截断**：符合生物节律，自动评定 🟢 未熬夜 / 🟡 轻度熬夜 / 🔴 重度熬夜，判定阈值可在 `config.yaml` 自定义。

### 数据导入与导出
- **文件导入（CSV / JSON）**：先预检、不落库，逐行给出「新增 / 更新」以及旧值 → 新值的字段差异；确认后以单事务原子写入，中途失败整体回滚。单次上限 5000 行 / 5 MB。
- **备忘录导入**：直接粘贴「`10.2：晨起体重 76.9，腰围 78，睡前 78`」这类手写行，按关键词取数，裸数字（如「米饭 300g」）不会被误判成体重；年份可省略并自动推断。
- **批次历史与失败重试**：每次导入留有批次记录，失败行可导出修正后重新补导；同一文件重复导入会提示上次导入结果。
- **导出**：按时间范围导出 CSV（Excel / WPS 可直接打开）；另提供 JSON 全量备份，可原样回灌，用于换机或重装恢复（不含小结照片与 AI 洞察）。

### 可视化分析
- **生理归因分析**：晨起空腹 vs 睡前体重差（$\Delta W$）监测，智能归因高糖碳水与代谢消耗、夜间排水。
- **周平均趋势**：以自然周（周一至周日）为节点，默认展示最近 12 周均值走势与 min/max 区间带，支持体重 / 腰围 / 睡眠 / 步数四个 Tab；当周仅 1~3 条记录时标注低置信，0 条记录直接断点。
- **60 天趋势详情**：独立视图按 Tab 切换体重 / 腰围 / 睡眠 / 步数四类数据，竖屏横向滚动、横屏自适应铺满一屏；步数纵轴封顶 2 万，缺失日断点不补 0。
- **看板步数趋势卡**：与体重 / 腰围 / 睡眠三张图卡并列，逐日折线、点击节点看当日步数，随「近7天 / 近30天 / 近60天」切换重绘。
- **阶段对比**：默认「上月 vs 上上个月」，支持任意两个互不重叠的自然月（含跨年）；自动聚合九项指标（体重均值与净变化、腰围均值与净变化、平均睡眠时长、熬夜绿/黄/红分布、有运动天数与强度、专注达天数、夜间排水均值）并生成 AI 对比综述。

### AI 洞察
- **AI 智能深度复盘**：自选 7 / 30 / 60 天分析跨度与截止日，SSE 流式打字机响应，思维链与正文分区展示，指出异常并输出微调建议。
- **睡前小结洞察**：结合当晚小结（自评分 / 三件事 / 感想 / 照片）与自选 7 或 30 天生理数据窗口，从心理状态与成就感角度解读。
- **洞察历史存档**：按分析窗口独立回显，支持关键词搜索、档位筛选、单条删除、左滑删除与批量管理；同档位洞察可多条共存，重新生成前二次确认。
- **输出可控**：思考链与正文强制简体中文，总输出长度由 `ai.max_tokens` 硬封顶，避免 token 失控。

### 工程与交付
- **单一可执行文件交付**：基于 Go Embed 技术，前端网页与后端服务一体化打包，零环境依赖，秒级启动。
- **前端库自托管**：Tailwind、Chart.js 落 `web/static/vendor` 目录随二进制打包，无公网 CDN 依赖，离线可用；自定义组件样式集中在 `web/static/css/app.css`。
- **仅监听本机回环**：服务固定绑定 `127.0.0.1`，含 API Key 的配置接口与数据库不对局域网暴露。
- **自动化冷备份**：启动自动备份 SQLite 数据库，数据永不丢失。
- **手机端 APP**：Android WebView 壳 + 交叉编译的内嵌服务端（arm64-v8a），覆盖安装即可保留手机本地数据。

---

## 🚀 快速启动

### 方式一：本地源码运行
```bash
# 1. 运行服务（默认监听 127.0.0.1:8080）
go run cmd/server/main.go

# 可选参数：-port 指定端口、-config 指定配置文件、-data-dir 指定数据库目录
go run cmd/server/main.go -port 8080 -data-dir ./data

# 2. 浏览器访问
http://localhost:8080
```

> 首次启动会自动生成不含 API Key 的 `config.yaml`（权限 0600）。调整前端时把 `server.dev_mode` 设为 `true`，静态资源将从 `web/static` 实时读取，改动无需重新编译。

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

# 也可手动指定版本号（必须大于手机已装 versionCode，否则无法覆盖安装）
powershell -ExecutionPolicy Bypass -File scripts\build-android.ps1 -DeviceAddress <手机IP>:5555 -VersionCode 120
```

> 该脚本含本机签名口令与绝对路径，已被 `.gitignore` 排除，只存在于本地。仓库侧提供 GitHub Actions：推送 `main` 由 `build-apk.yml` 自动打包并通过邮件发送 APK，推送 `v*` tag 由 `release-apk.yml` 发布 Release 附件。无线 adb 连不上的排查步骤见 [ADB_GUIDE.md](ADB_GUIDE.md)。

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
  thinking: ""             # 思维链开关：enabled / disabled；留空则不传该参数

sleep:
  green_before: "23:00"    # 早于此时间入睡为未熬夜（绿），默认值
  yellow_before: "00:00"   # [23:00, 00:00) 为轻度熬夜（黄）；0 点及以后为重度（红）

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

> API Key 也可用环境变量覆盖，优先级高于 `config.yaml`：`AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL`，适合容器化或 CI 部署。

---

## 📂 项目架构

```text
├── cmd/server/main.go              # 程序入口、路由注册、静态资源缓存策略与优雅停机
├── internal/
│   ├── config/                     # 配置解析、默认模板生成与运行时热更新
│   ├── handler/                    # 控制器（记录、洞察、睡前小结、导入导出、配置）
│   ├── service/                    # 业务逻辑、两月指标聚合、提示词装配、CSV/JSON/备忘录导入
│   │   └── default_*_prompt.txt    # 内嵌提示词兜底副本（Android 端走此份）
│   ├── repository/                 # SQLite 持久层、导入批次与启动冷备份
│   ├── model/                      # 数据实体与状态码
│   └── netutil/                    # Android 端 DNS 解析修复
├── prompts/
│   ├── insight_v1.txt              # 周期洞察提示词模板
│   ├── evening_insight_v1.txt      # 睡前小结洞察提示词模板
│   └── compare_v1.txt              # 阶段对比提示词模板
├── web/
│   ├── embed.go                    # go:embed 静态资源
│   └── static/
│       ├── index.html              # 响应式单页前端（电脑端 / 手机端共用）
│       ├── css/app.css             # 自定义组件样式（卡片、徽章、睡眠行等）
│       └── vendor/                 # 自托管 Tailwind 与 Chart.js
├── android/                        # Android WebView 壳工程（Gradle，arm64-v8a）
├── scripts/build-android.ps1       # 本地一键打包 + 无线覆盖安装（含本机签名口令，已被 .gitignore 排除）
├── .github/workflows/              # CI：build-apk.yml 推 main 自动打包并邮件分发；release-apk.yml 推 tag 发 Release
├── config.yaml.example             # 配置模板（Android 打包时复制进 assets）
├── SYSTEM_DESIGN.md                # 系统设计与工程规范说明书
└── ADB_GUIDE.md                    # 无线调试与真机调试指引
```

---

## 📌 工程约定（摘要）

- 数据库结构变更仅允许 `ALTER TABLE ... ADD COLUMN`，严禁 `DROP` / `TRUNCATE`，避免历史数据丢失。
- 手机端一律 `adb install -r` 覆盖安装，严禁卸载重装或清除应用数据。
- 测量类数据（体重 / 腰围 / 睡眠）缺失周期以断点展示，严禁以 0 填充。
- 数据导入必须走「预检 → 用户确认 → 单事务写入」，预检阶段严禁落库；失败行保留原文件缓存，便于修正后重试。
- 前端以 Tailwind 工具类为主，组件级样式统一放在 `web/static/css/app.css`，页面内不再写 `<style>` 块。
- 其余规范详见 [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)。
