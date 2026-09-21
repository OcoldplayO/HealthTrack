# HealthTrack (智能健康洞察追踪系统)
## 系统设计与工程规范说明书 (System Architecture & Technical Design Document)

| 文档版本 | 状态 | 编制角色 | 适用范围 |
| :--- | :--- | :--- | :--- |
| **v1.0.0** | **Approved & Frozen (已冻结)** | Product Lead / System Architect / Tech Lead | 全栈工程落地实施 |

---

## 目录
1. [项目愿景与核心痛点](#一-项目愿景与核心痛点)
2. [模块一：数据模型与业务边界规范](#二-模块一数据模型与业务边界规范)
3. [模块二：API 契约与统一错误规范](#三-模块二api-契约与统一错误规范)
4. [模块三：AI 模块工程化与长周期分析规范](#四-模块三ai-模块工程化与长周期分析规范)
5. [模块四：数据库生命周期与版本演进](#五-模块四数据库生命周期与版本演进)
6. [模块五：可观测性与服务生命周期](#六-模块五可观测性与服务生命周期)
7. [模块六：工程构建、目录骨架与交付规范](#七-模块六工程构建目录骨架与交付规范)
8. [附录：版本控制与发布规范](#八-附录版本控制与发布规范)

---

## 一、 项目愿景与核心痛点

### 1.1 核心痛点
* **市面产品的数据孤岛**：现有健康应用将睡眠、饮食、体重、运动完全隔离开，无法建立有机因果联动。
* **备忘录随手记的局限**：纯文本记录虽然输入门槛低，但难以追踪长期趋势，月末人工复盘成本极高，长文本滚动查找体验差。
* **商业软件过度复杂**：商业健身 App 食物库搜索录入极其繁琐，反人性，导致难以长期坚持。

### 1.2 产品定位
一款**极简录入、开箱即用、以 AI 关联分析为核心**的个人健康管理 Web App。顺应用户在备忘录写自由文本的习惯，利用大语言模型（LLM）实现跨维度生理归因与长周期目标复盘。

---

## 二、 模块一：数据模型与业务边界规范

### 2.1 核心指标定义
* **晨起空腹体重 (`weight_am`)**：清晨排便后空腹测量，反映基础代谢与前日晚间能量平衡。
* **睡前体重 (`weight_pm`)**：入睡前测量，与晨起体重配合计算日间代谢差值 $\Delta W = W_{pm} - W_{am}$。
* **腰围 (`waist_size`)**：单位 cm，保留 1 位小数，追踪体脂与维度变化。
* **睡眠时间与时长 (`sleep_start_time`, `sleep_end_time`, `sleep_hours`)**：精确到分钟，记录睡眠生理周期。
* **自由文本日记 (`journal_text`)**：包含早中晚三餐、加餐糖分、运动明细及身体主观感受。

### 2.2 跨日睡眠归属算法 (Cutoff Rule)
* **截断时间点**：以每日**凌晨 04:00** 为界。
* **归属规则**：凡入睡时间处于 `当日 18:00 ~ 次日 04:00` 之间的睡眠，其所有数据（时长、就寝时间）**一律归属于当日的业务日期**。

### 2.3 熬夜三色分级标准 (Sleep Tag)
后端在接收到入睡时间后，自动计算并打标：
* 🟢 **GREEN（健康/未熬夜）**：入睡时间 $\le$ 24:00 (00:00)
* 🟡 **YELLOW（轻度熬夜）**：24:00 $<$ 入睡时间 $\le$ 01:00
* 🔴 **RED（重度熬夜）**：入睡时间 $>$ 01:00
* **展示点**：看板页睡眠柱状图柱体颜色、日历打卡徽标、录入页顶部昨日状态卡片。

### 2.4 幂等性与增量合并 (Incremental Merge) 策略
用户在同一天内会进行多次碎片化录入（如饭后随手记、早晚称重）：
* **数值字段**：非空覆盖。若提交参数为 `null`，保持数据库已有历史值不变。
* **文本字段**：前端打开页面时自动回显当天已有日记文本，用户追加内容后整段提交，后端执行安全 UPSERT。

### 2.5 数据校验与边界约束 (Validation)
* `weight_am`, `weight_pm`：$30.0 \le \text{weight} \le 250.0$ (kg)，保留 1 位小数。
* `waist_size`：$30.0 \le \text{waist} \le 200.0$ (cm)。
* `sleep_hours`：$0.0 \le \text{hours} \le 24.0$ (h)。
* `journal_text`：长度限制 $0 \le \text{len} \le 2000$ 字符，禁止 XSS 恶意脚本。

### 2.6 SQLite DDL 定义（前瞻支持多用户）
```sql
CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,     -- 预留多用户ID，MVP阶段默认为 1
    record_date TEXT NOT NULL,              -- 业务日期，格式 YYYY-MM-DD
    
    -- 体重与维度
    weight_am REAL CHECK(weight_am IS NULL OR (weight_am >= 30.0 AND weight_am <= 250.0)),
    weight_pm REAL CHECK(weight_pm IS NULL OR (weight_pm >= 30.0 AND weight_pm <= 250.0)),
    waist_size REAL CHECK(waist_size IS NULL OR (waist_size >= 30.0 AND waist_size <= 200.0)),
    
    -- 睡眠指标
    sleep_start_time TEXT,                  -- 例如 "01:00"
    sleep_end_time TEXT,                    -- 例如 "07:50"
    sleep_hours REAL CHECK(sleep_hours IS NULL OR (sleep_hours >= 0.0 AND sleep_hours <= 24.0)),
    sleep_tag TEXT DEFAULT 'GREEN' CHECK(sleep_tag IN ('GREEN', 'YELLOW', 'RED')),
    
    -- 文本与语义
    journal_text TEXT CHECK(length(journal_text) <= 2000),
    activity_tags TEXT,                     -- 自动提取的运动标签 JSON，如 ["🏀 篮球30m", "🚴 骑行3km"]
    
    -- 时间戳
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- 联合唯一约束：同一用户每天仅一条聚合主记录
    UNIQUE(user_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_records_user_date ON health_records(user_id, record_date);
```

---

## 三、 模块二：API 契约与统一错误规范

### 3.1 统一 JSON 响应信封 (Response Envelope)
```json
{
  "code": 200,             // 业务状态码
  "message": "success",    // 提示信息
  "data": {},              // 业务数据负载
  "timestamp": 1726927200  // Unix 时间戳 (秒)
}
```

### 3.2 业务状态码规范 (Error Codes)
* `200`：操作成功
* `40001`：请求参数校验失败（如体重超出合理范围）
* `40002`：日期格式非法（非 YYYY-MM-DD）
* `40401`：所查询的记录不存在
* `50001`：数据库内部读写异常
* `50201`：上游 AI 服务通信异常 / 超时

### 3.3 核心 RESTful 路由定义
1. `GET /api/v1/records/today`
   * **描述**：获取当天已有记录，供前端自动回显表单。
2. `POST /api/v1/records`
   * **描述**：保存或增量合并单日记录。
   * **请求体**：
     ```json
     {
       "record_date": "2026-09-10",
       "weight_am": 76.5,
       "weight_pm": 77.7,
       "waist_size": 78.0,
       "sleep_start_time": "01:00",
       "sleep_end_time": "07:50",
       "journal_text": "早上一杯安慕希..."
     }
     ```
3. `GET /api/v1/records/history?start_date=2026-09-01&end_date=2026-09-10`
   * **描述**：拉取指定日期区间的数据列表，供看板画图。
4. `GET /api/v1/insights/stream?start_date=2026-09-01&end_date=2026-09-30`
   * **描述**：AI 洞察分析流式接口（SSE）。
5. `GET /api/v1/export`
   * **描述**：一键导出用户全量健康历史数据（JSON 文件下载）。
6. `GET /healthz`
   * **描述**：服务探针与健康检查，返回 `{"status":"ok"}`。

### 3.4 前端交互反馈规范
* **保存操作**：提交成功后必须弹出显著的 **Toast 提示卡片（或弹窗）**，绿色勾选图标，持续 2 秒后自动淡出。
* **数据校验拦截**：前端在提交前做基础拦截，非法输入框显示红色高亮警示。

---

## 四、 模块三：AI 模块工程化与长周期分析规范

### 4.1 统一 OpenAI 兼容架构
采用标准 OpenAI 协议（`v1/chat/completions`），通过配置文件无缝切换模型：
* **支持厂商**：DeepSeek (推荐 `deepseek-chat`)、智谱 GLM (`glm-4-flash`)、阿里通义千问、Google Gemini。
* **切换成本**：仅需变更 `config.yaml` 的 `base_url`、`api_key` 和 `model`。

### 4.2 范围选择与 Token 预算策略
* **前端控件**：提供快捷胶囊按钮 `[近7天]`、`[近30天 (默认)]`、`[近60天]`，支持自定义日期区间（最大跨度限制为 60 天）。
* **Token 预算与成本模型**：
  * 单日数据开销：$\approx 180 \text{ Tokens}$。
  * 60 天满载数据：$\approx 11,500 \text{ Tokens}$（仅占模型窗口的 $0.008\%$，单次费用低于 0.015 元）。
* **超时防线**：Go 后端设置 `context.WithTimeout(45 * time.Second)`。

### 4.3 “宏观统计 + 微观流水”防幻觉 Prompt 架构
为防止大模型长周期数学计算失真，Go 后端先行计算宏观指标注入 Prompt：
```text
[系统指令]
你是一位严谨、专业且富有同理心的运动营养学与生理健康顾问。

[宏观统计基线 (Go 后端预计算)]
- 统计周期: {{.StartDate}} 至 {{.EndDate}} (共 {{.TotalDays}} 天，有效记录 {{.ValidDays}} 天)
- 体重趋势: 初始 {{.StartWeight}}kg -> 最新 {{.EndWeight}}kg (净变化: {{.WeightDelta}}kg)
- 睡眠达标统计: 正常(绿) {{.GreenDays}}天，轻度熬夜(黄) {{.YellowDays}}天，重度熬夜(红) {{.RedDays}}天
- 运动打卡频次: {{.WorkoutDays}} 天

[每日微观流水]
{{range .Records}}
- 日期: {{.Date}} | 晨重: {{.WeightAM}}kg, 晚重: {{.WeightPM}}kg | 睡眠: {{.SleepHours}}h ({{.SleepTag}})
  记录: {{.JournalText}}
{{end}}

[输出要求]
1. 核心因果归因：分析饮食中的糖分/高碳水、运动类型与体重/睡眠波动的内在联系；
2. 异常点指出：重点分析红档熬夜与体重反弹日的行为特征；
3. 针对性行动清单：给出 2~3 条简单易行、不增加心理压力的具体改进建议；
4. 语言风格亲切、客观、注重正向激励，使用清晰的 Markdown 排版。
```

### 4.4 SSE 流式打字机协议契约
* **协议头**：`Content-Type: text/event-stream; charset=utf-8`
* **事件流规范**：
  * 传输中：`data: {"delta": "分析显示...", "status": "streaming"}\n\n`
  * 完成：`data: {"status": "done"}\n\n`
  * 异常：`data: {"status": "error", "message": "上游大模型服务繁忙，请稍后重试"}\n\n`

---

## 五、 模块四：数据库生命周期与版本演进

### 5.1 轻量级 Migration 机制
* 内部维护 `schema_migrations` 表：
  ```sql
  CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
* 启动流程：服务启动时检测版本，在单一数据库事务中顺序执行补丁 SQL，平滑支持未来新增字段（如血压、心率），不丢失历史数据。

### 5.2 自动化冷备份策略 (Fail-Safe)
* **执行时机**：服务端每次启动、或每日凌晨 04:00 定时触发。
* **备份逻辑**：将 `health.db` 复制归档为 `backups/health_backup_YYYYMMDD.db`。
* **滚动清理**：保留最近 7 份历史备份，自动清理过期旧文件，确保数据零丢失且磁盘占用受控。

---

## 六、 模块五：可观测性与服务生命周期

### 6.1 统一结构化日志 (`log/slog`)
* 使用 Go 1.21+ 标准库 `slog`。
* 开发环境输出彩色高亮文本，生产环境输出标准 JSON 日志：
  ```json
  {"time":"2026-09-21T22:30:00Z","level":"INFO","module":"record","msg":"record merged","user_id":1,"date":"2026-09-10","latency_ms":8}
  ```

### 6.2 优雅停机 (Graceful Shutdown)
* 捕获操作系统信号：`os.Interrupt`, `syscall.SIGTERM`。
* 接收到终止信号后，开启 5 秒排空窗口：
  1. 拒绝新的 HTTP 请求；
  2. 等待正在进行的 SQLite 事务与 AI SSE 长连接正常传输结束；
  3. 安全关闭 SQLite 连接池，彻底防止数据库文件死锁损坏。

---

## 七、 模块六：工程构建、目录骨架与交付规范

### 7.1 标准目录骨架
```text
HealthTrack/
├── cmd/
│   └── server/
│       └── main.go              # 程序入口、依赖注入、优雅停机
├── internal/
│   ├── config/                  # 配置管理 (config.yaml & 环境变量读取)
│   ├── handler/                 # HTTP 控制器 (参数校验、统一响应包装、SSE 转发)
│   ├── service/                 # 核心业务层 (数据合并、Prompt 组装、AI 客户端)
│   ├── repository/              # 数据持久层 (Pure Go SQLite 操作)
│   ├── model/                   # 实体类、DTO 与业务状态码定义
│   └── migration/               # 轻量级数据库版本迁移执行器
├── prompts/
│   └── insight_v1.txt           # AI 分析提示词模板
├── web/
│   ├── embed.go                 # //go:embed 静态资源打包指令
│   └── static/
│       └── index.html           # 包含全部 UI 交互的单文件网页 (Tailwind + Chart.js)
├── config.yaml.example          # 配置文件模板
├── Makefile                     # 自动化编译、跨平台构建脚本
└── go.mod
```

### 7.2 `//go:embed` 单二进制交付机制
* **开发模式 (`dev_mode: true`)**：前端直接读取本地磁盘文件，修改 HTML 后浏览器刷新即生效，无需重启程序。
* **生产模式 (`dev_mode: false`)**：通过 `//go:embed static/*` 将所有 HTML/CSS/JS 静态字节打入二进制文件的只读数据段，产出**单一独立可执行文件**。

### 7.3 跨平台一键构建 (Makefile)
```makefile
.PHONY: run build-win build-linux test clean

run:
	go run cmd/server/main.go

build-win:
	@echo "Building Windows amd64 executable..."
	go build -ldflags="-s -w" -o bin/healthtrack.exe cmd/server/main.go

build-linux:
	@echo "Building Linux amd64 executable (Zero CGO)..."
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/healthtrack cmd/server/main.go

test:
	go test -v ./...

clean:
	rm -rf bin/
```

---

## 八、 附录：版本控制与发布规范

1. **分支策略**：个人/小团队采用 Trunk-Based 开发，主线为 `main`。
2. **提交信息规范 (Semantic Commits)**：
   * `feat:` 新增功能（如新增运动标签提取）
   * `fix:` 缺陷修复（如修复跨日睡眠归属问题）
   * `ui:` 界面与交互样式调整
   * `docs:` 文档更新
3. **版本里程碑打 Tag**：
   * `v0.1.0-mvp`：基础录入 + SQLite 存储 + 历史看板
   * `v0.2.0-ai`：AI 接入 + SSE 流式洞察
   * `v1.0.0-release`：单二进制跨平台打包正式版
