# HealthTrack 智能健康洞察追踪系统

## 统一系统架构与工程实施规范 (Unified System Architecture & Engineering Spec)

| 文档版本 | 状态 | 适用角色 | 效力说明 |
| :--- | :--- | :--- | :--- |
| **v3.4.0 (Current SSOT)** | **Approved & Frozen (最高权威)** | AI Agent / 全栈工程师 | **项目全局唯一事实源 (SSOT)**，所有代码实现与重构以此为准 |
| **v3.3.0 (Reconciled)** | Archived | AI Agent / 全栈工程师 | 趋势看板周平均 + 60 天横滑详情 |
| **v3.2.0 (Reconciled)** | Archived | AI Agent / 全栈工程师 | 运动类型独立多选 + AI 洞察自选截止日 |
| **v3.1.0 (Reconciled)** | Archived | AI Agent / 全栈工程师 | 睡前小结独立模块落地 |
| **v3.0.0 (Reconciled)** | Archived | AI Agent / 全栈工程师 | 纯 Go SQLite 免 CGO 架构重构 |

> **v3.4.0 修订说明**：
> 1. **全站极简极客设计体系（Design System v3.0）**：记一笔、数据看板、AI 深度洞察、睡前小结全站收敛至 Linear / Raycast 1px 工业单线风格（`.ht-card`、`.ht-seg-btn`、`.ht-range`），彻底淘汰彩色 Emoji 与浮夸深色渐变卡片，全站等宽数字排版（`JetBrains Mono` + `.tabular-nums`）。
> 2. **前端工程架构演进**：正式确立 `web/src/`（Vite + 原生 ES Modules）为唯一源码开发入口，`web/static/` 仅作为生产打包产物，严禁直接手改 `web/static/`。
> 3. **功能闭环归档**：阶段对比（`view-compare`，双月自然月对比 + 7 项预计算指标快照 + 阶段综述）与批量数据导入（CSV/JSON/备忘录预检 + 单事务提交 + 批次重试）全链路已实现并完成双端验收，正式从待办移入已完成归档。
> 4. **睡前小结与洞察细节调优**：往期回顾统一 40x40px 紧凑防拉伸微缩略图；操作按钮全面中文化；彻底移除违和的沙漏等待图标；顶部日期输入框扩宽适配移动端防截断。

---

## 目录（全景索引）

1. [项目愿景、核心痛点与产品定位](#一-项目愿景核心痛点与产品定位)
2. [核心业务逻辑与生理算法规范](#二-核心业务逻辑与生理算法规范)
3. [数据模型与持久层规范](#三-数据模型与持久层规范)
4. [前端工程与 HealthTrack 3.0 设计规范](#四-前端工程与-healthtrack-30-设计规范)
5. [API 契约、统一响应与 SSE 流式协议](#五-api-契约统一响应与-sse-流式协议)
6. [后端特征工程与 AI 模块实现](#六-后端特征工程与-ai-模块实现)
7. [提示词模板契约](#七-提示词模板契约)
8. [工程构建、配置与交付规范](#八-工程构建配置与交付规范)
9. [Agent 实施约束与熔断机制](#九-agent-实施约束与熔断机制)
10. [需求状态清单 (Backlog)](#十-需求状态清单-backlog)
附录：[语义化提交规范](#附录-语义化提交规范)

---

## 一、 项目愿景、核心痛点与产品定位

### 1.1 核心痛点
* **市面产品的数据孤岛**：传统健身 App 将睡眠、饮食、体重、运动完全隔离开，无法建立有机因果联动。
* **精细化称重算卡路里反人性**：商业软件强迫用户称重食材、搜索食物库计算三大营养素，生熟重与烹饪油误差巨大（实际误差常超 30%），执行阻力极高，导致用户迅速弃坑。
* **纯备忘录记录的局限**：备忘录纯文本输入门槛虽低，但长期趋势难以可视化，月末人工复盘成本极高，无法洞察深层生理关联。

### 1.2 产品定位与生物黑客闭环
一款**极简录入、开箱即用、以 AI 深度因果归因为核心**的个人健康管理 Web 系统：
* **零称重负担**：顺应备忘录自由文本习惯，引入 **NOVA 食品加工程度与 8:2 弹性评估**，抓大放小；
* **生理学真实归因**：引入抗阻训练引起的肌肉微创伤水肿（Water Retention）、高钠渗透压水滞留识别，消除虚假减脂焦虑；
* **神经与药物动力学追踪**：专设专注达（Concerta）服药多维效能、晚间多巴胺断崖（Crash）代偿机制与冷水澡神经唤醒追踪。

### 1.3 产品形态（双端同构与本地优先）
* **电脑端**：Go 单一二进制 `bin/HealthTrack.exe`，内嵌前端静态资源，监听 `127.0.0.1:8080`。
* **手机端**：Android WebView 外壳 APK（包名 `com.healthtrack.app`），同样加载本机 `http://127.0.0.1:8080`；Go 服务端以交叉编译的 `libhealthtrack.so` 形式随 APK 分发。
* **数据本地优先**：所有数据存放于本地 `data/health.db`（桌面）或 App 私有 `filesDir`（Android），不上传云端，无中心化数据库。

---

## 二、 核心业务逻辑与生理算法规范

### 2.1 核心生理指标与差值定义
* **晨起空腹体重 (weight_am)**：清晨排便后空腹测量，单位 kg，保留 1 位小数。反映基础身体质量与长期脂肪/肌肉趋势。
* **睡前体重 (weight_pm)**：就寝前测量，单位 kg。
* **夜间呼吸排水差值 ($\Delta W_{sleep}$)**：
  $$\Delta W_{sleep} = \text{weight\_pm} - \text{weight\_am}$$
  *健康基准*：正常人夜间呼吸蒸发与基础代谢排水通常在 **$0.4\text{kg} \sim 0.9\text{kg}$**。若 $<0.3\text{kg}$ 通常提示前一日高钠储水或晚间消化道充盈。
* **日间体重波动差值 ($\Delta W_{day}$)**：
  $$\Delta W_{day} = \text{weight\_am}_{今日} - \text{weight\_am}_{昨日}$$
* **腰围 (waist_size)**：单位 cm，保留 1 位小数。排除水分干扰，作为核心内脏脂肪趋势校验器。

### 2.2 跨日睡眠 04:00 截断法则 (Cutoff Rule)
* **截断边界**：以每日**凌晨 04:00** 为业务日切换界限。
* **归属判定**：凡入睡时间处于 `当日 18:00 ~ 次日 04:00` 之间的睡眠，其所有的生理指标（睡眠时长、就寝时间、睡眠评级）**一律归属于入睡前所处的业务日期**。
* **工程实现**：时间解析统一走 `model.parseSleepTimeMinutes`，对 `00:00~04:00` 的小时数 `+24h` 归一化，避免跨日比较出错。

### 2.3 睡眠时长双时间点自动联动推导算法
前端废弃繁琐的人工心算时长输入，改为**输入就寝时间与起床时间自动推导**：
* 设就寝时间为 $T_{bed}$，起床时间为 $T_{wake}$（格式均为 `HH:mm`）。
* 将时间转换为当日累计分钟数：
  $$M_{bed} = H_{bed} \times 60 + m_{bed}, \quad M_{wake} = H_{wake} \times 60 + m_{wake}$$
* 跨日判定：若 $M_{wake} \le M_{bed}$，则说明跨越午夜，$M_{wake} = M_{wake} + 1440$。
* 时长计算：
  $$\text{Duration} = \frac{M_{wake} - M_{bed}}{60} \quad (\text{四舍五入保留 1 位小数})$$
* 系统自动回填计算值，但依然保留用户直接在输入框中手动覆盖修改的自由。

### 2.4 熬夜三色分级标准（阈值可配置，读时实时计算）
熬夜阈值通过配置文件 `config.yaml` 的 `sleep` 段落自定义；`sleep_tag` **在接口返回前按当前阈值实时计算**，而非依赖数据库历史存储值——修改阈值后，历史数据无需重算即按新规则显示。
* 配置项（`internal/config/config.go` 的 `SleepConfig`）：
  * `sleep.green_before`（默认 `23:00`）：早于该值为未熬夜（绿灯项）。
  * `sleep.yellow_before`（默认 `00:00`）：在 `[green_before, yellow_before)` 为轻度熬夜（黄灯项）；`>= yellow_before` 为重度熬夜（红灯项）。
* 判定函数：`model.CalculateSleepTagWithThresholds(startTime, greenBefore, yellowBefore) string`
  * 阈值与就寝时间均按 `HH:mm` 解析，凌晨 `00:00~04:00` 按跨日 `+24h` 归一化；解析失败时回退 `green=23:00`、`yellow=24:00`。

### 2.5 饮食 NOVA 加工分级与 8:2 弹性评估
用户饮食记录为纯文本（落库字段 `journal_text`），允许包含粗略预估克重（允许 $\pm 30\%$ 误差），**坚决不推算微观卡路里**。系统与 AI 基于国际 NOVA 标准识别：
* **绿灯项（原生/微加工食材，Clean Foods）**：纯肉、蛋、水产、原生米饭、土豆、燕麦、天然蔬果。
* **黄灯项（常规烹饪加工品）**：带油盐炒菜、调味米粉、板栗、复合主食。
* **红灯项（超加工食品 UPF / 精制糖油混合物 / 高钠）**：糕点、含糖饮料、深加工膨化、极高钠调味品、薯片、炸鸡等。
* **8:2 弹性维持原则**：若周期内绿灯原生食材摄入频次与体积占比达到 **$70\% \sim 80\%$**，红灯安慰性食物维持在 **$20\% \sim 30\%$**，系统判定为健康度优秀且可持续，消除断糖心理焦虑。

### 2.6 运动分类与次日肌肉微创伤水肿归因机制
* **极简运动量化**（`ExerciseDetail`）：
  * 类型 `types`（**多选**）：`cardio` (有氧) 与 `strength` (力量抗阻) **可同时选中**；空数组表示无运动。兼容旧单值字段 `type`（写入时同步为首个类型，读取旧记录时回退解析）。
  * 强度 `intensity`（主观疲劳度 RPE）：`light` (轻松), `medium` (中等), `failure` (力竭/高负荷)。
  * 时长 `duration`：分钟数。
  * 备注 `items`：自由文本，如 "骑行 10km" 或 "腿部力量"。
* **水肿归因锚点**：
  抗阻力量训练（尤其包含力竭大肌群训练）会引发肌纤维微损伤与急性充血修复，导致**皮质醇脉冲与炎症性水分潴留 (Water Retention)**。若次日 $\Delta W_{day}$ 突增 $0.5 \sim 1.5\text{kg}$，系统与 AI 必须优先解释为肌肉修复储水，严禁误判为脂肪增长。

### 2.7 专注达 (Concerta) 多维药效与晚间断崖代偿
* **药动学特征**：OROS 渗透泵胶囊释放曲线维持约 10~12 小时（如 08:00 服药，17:30 药效衰退）。
* **五维自评打卡（1~5 分）**：
  1. `focus_work`：深度工作与执行力（是否克服启动拖延、沉浸编程）；
  2. `focus_study`：长文本/阅读工作记忆；
  3. `daily_tasks`：低多巴胺琐事耐受度（洗衣服、收桌子）；
  4. `social`：情绪平稳与倾听耐心；
  5. `gaming`：反应速度与抗挫败心态。
* **晚间断崖代偿追踪**：药效消退后多巴胺受体骤降易引发 Crash，表现为极度疲劳与神经代偿。系统追踪用户是否使用魔爪/高咖啡因续航，或诱发高糖高脂暴食冲动。

### 2.8 冷水澡神经激活与昼夜节律影响
* **记录维度**（`ColdShowerDetail`）：
  * `enabled`：是否打卡；
  * `timing`：`morning` (晨起), `post_workout` (训练后), `evening` (睡前)；
  * `duration`：时长（分钟）；
  * `feeling`：`refreshed` (清爽唤醒), `neutral` (无明显感), `shivering` (轻微发抖/回温迟缓)；
  * `water_temp`：预估体感水温（℃，可空，范围 `0~40`）。
* **关联分析**：
  水温下降时冷刺激强度指数级提升，AI 建立「水温变化 → 唤醒强度 → 时长建议」量化关联。晨起冷水澡促发多巴胺平缓释放，睡前冷水澡激活交感神经可能干扰深睡，需结合睡眠曲线对比。

### 2.9 低负担行为三项（晨光 / 步数 / 午餐）
* **设计目标**：ADHD 场景下每日打卡摩擦降到最低——单项 $\le 2$ 次点击，允许留空，缺项不产生补录压力。
* **晨光 `morning_light`**：布尔三态（`true` / `false` / `NULL` 未记录），默认不打卡。语义为起床后 1 小时内接触自然光。
* **步数 `steps`**：整数，**`NULL` = 当天未记录（图表必须断点，严禁补 0）**。录入范围 `0 ~ 20000`（500 一档极细滑块）。
* **午餐 `lunch_detail`**：结构化点选，**只记午饭、不记全天**。包含 `eaten`、`protein`（多选）、`protein_g`、`staple`、`carb_g`、`cooking`，支持一键「沿用昨天」与「跳过」。

---

## 三、 数据模型与持久层规范

### 3.1 实体模型定义（`internal/model/`）
```go
package model

import "time"

// ExerciseDetail 运动明细
type ExerciseDetail struct {
	Types     []string `json:"types,omitempty"` // 运动类型（多选）：cardio / strength
	Type      string   `json:"type"`            // 兼容旧数据：none, cardio, strength
	Duration  int      `json:"duration"`        // 时长 (分钟)
	Intensity string   `json:"intensity"`       // light, medium, failure
	Items     string   `json:"items"`           // 备注
}

// ColdShowerDetail 冷水澡记录
type ColdShowerDetail struct {
	Enabled   bool     `json:"enabled"`
	Timing    string   `json:"timing"`     // morning, post_workout, evening
	Duration  int      `json:"duration"`   // 分钟
	WaterTemp *float64 `json:"water_temp"` // 预估水温 (℃)，可空，0~40
	Feeling   string   `json:"feeling"`    // refreshed, neutral, shivering
}

// ConcertaDetail 专注达服药与多维效能记录
type ConcertaDetail struct {
	Taken          bool     `json:"taken"`
	Time           string   `json:"time"`         // HH:mm
	Dose           int      `json:"dose"`         // 18, 36, 54
	FocusWork      int      `json:"focus_work"`   // 1-5
	FocusStudy     int      `json:"focus_study"`  // 1-5
	DailyTasks     int      `json:"daily_tasks"`  // 1-5
	SocialPatience int      `json:"social"`       // 1-5
	GamingReaction int      `json:"gaming"`       // 1-5
	CrashTime      string   `json:"crash_time"`   // HH:mm
	SideEffects    []string `json:"side_effects"`
	Compensations  []string `json:"compensations"`
}

// LunchDetail 午餐结构化记录
type LunchDetail struct {
	Eaten    string   `json:"eaten"`               // eaten / skipped
	Protein  []string `json:"protein,omitempty"`   // 多选: chicken, egg, fish, beef, soy, yogurt, other
	ProteinG int      `json:"protein_g,omitempty"` // 15 / 25 / 35
	Staple   string   `json:"staple,omitempty"`    // rice / noodle / grains / potato / none
	CarbG    string   `json:"carb_g,omitempty"`    // lt20 / 20_35 / 35_50 / gt50
	Cooking  string   `json:"cooking,omitempty"`   // steam / stir_fry / fry / raw / takeout
}

// HealthRecord 核心健康记录实体 (对齐 health_records 表)
type HealthRecord struct {
	ID             int64    `json:"id"`
	UserID         int64    `json:"user_id"`
	RecordDate     string   `json:"record_date"`      // YYYY-MM-DD
	WeightAM       *float64 `json:"weight_am"`        // 晨起空腹体重 (kg)
	WeightPM       *float64 `json:"weight_pm"`        // 睡前体重 (kg)
	WaistSize      *float64 `json:"waist_size"`       // 腰围 (cm)
	SleepStartTime *string  `json:"sleep_start_time"` // 昨晚就寝 "HH:mm"
	SleepEndTime   *string  `json:"sleep_end_time"`   // 今晨起床 "HH:mm"
	SleepHours     *float64 `json:"sleep_hours"`      // 睡眠总时长 (h)
	SleepTag       string   `json:"sleep_tag"`        // GREEN / YELLOW / RED（读时重算）
	JournalText    string   `json:"journal_text"`     // 自由记录
	ActivityTags   string   `json:"activity_tags"`

	Exercise   *ExerciseDetail   `json:"exercise,omitempty"`
	ColdShower *ColdShowerDetail `json:"cold_shower,omitempty"`
	Concerta   *ConcertaDetail   `json:"concerta,omitempty"`

	MorningLight *bool        `json:"morning_light,omitempty"` // true/false/nil
	Steps        *int         `json:"steps,omitempty"`         // 步数，nil 为断点
	Lunch        *LunchDetail `json:"lunch,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
```

### 3.2 数据库表结构与平滑升级（`internal/repository/db.go`）
系统初始化时执行幂等升级，**严禁使用可能破坏现有数据库的 `DROP` 或 `TRUNCATE` 语句**。SQLite 驱动使用**纯 Go 实现 `modernc.org/sqlite`**（非 CGO），这是 Android `CGO_ENABLED=0` 交叉编译与单二进制交付的前提。

```sql
-- 核心生理数据表
CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    record_date TEXT NOT NULL,
    weight_am REAL,
    weight_pm REAL,
    waist_size REAL,
    sleep_start_time TEXT,
    sleep_end_time TEXT,
    sleep_hours REAL,
    sleep_tag TEXT DEFAULT 'GREEN',
    journal_text TEXT,
    activity_tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, record_date)
);
CREATE INDEX IF NOT EXISTS idx_records_user_date ON health_records(user_id, record_date);

-- AI 洞察存档表
CREATE TABLE IF NOT EXISTS ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    range_days INTEGER NOT NULL DEFAULT 30,
    start_date TEXT,
    end_date TEXT,
    content TEXT,        -- Markdown 正文
    thinking TEXT,       -- 大模型思维链 (reasoning_content)
    model TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON ai_insights(user_id, id DESC);

-- 睡前小结表
CREATE TABLE IF NOT EXISTS evening_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    record_date TEXT NOT NULL,
    done_1 TEXT DEFAULT '',
    done_2 TEXT DEFAULT '',
    done_3 TEXT DEFAULT '',
    note_text TEXT DEFAULT '',
    score INTEGER NOT NULL DEFAULT 0,
    photo_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, record_date)
);
CREATE INDEX IF NOT EXISTS idx_evening_summaries_user_date ON evening_summaries(user_id, record_date DESC);

-- 小结照片 BLOB 存储表
CREATE TABLE IF NOT EXISTS evening_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    record_date TEXT NOT NULL,
    mime TEXT DEFAULT '',
    data BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_evening_photos_user_date ON evening_photos(user_id, record_date);

-- 数据导入批次记录表
CREATE TABLE IF NOT EXISTS import_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    source_type TEXT NOT NULL DEFAULT 'csv',
    file_name TEXT DEFAULT '',
    file_hash TEXT DEFAULT '',
    file_size INTEGER NOT NULL DEFAULT 0,
    total_rows INTEGER NOT NULL DEFAULT 0,
    inserted INTEGER NOT NULL DEFAULT 0,
    updated INTEGER NOT NULL DEFAULT 0,
    skipped INTEGER NOT NULL DEFAULT 0,
    warnings INTEGER NOT NULL DEFAULT 0,
    errors INTEGER NOT NULL DEFAULT 0,
    conflict_mode TEXT NOT NULL DEFAULT 'merge',
    skip_errors INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT DEFAULT '',
    detail_json TEXT DEFAULT '{}',
    cache_path TEXT DEFAULT '',
    root_batch_id INTEGER,
    attempt_no INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_import_batches_user_id ON import_batches(user_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_import_batches_hash ON import_batches(user_id, file_hash);
```

**平滑增量扩展字段清单（`alterStatements`）**：
```sql
ALTER TABLE health_records ADD COLUMN sleep_bed_time TEXT DEFAULT '';
ALTER TABLE health_records ADD COLUMN sleep_wake_time TEXT DEFAULT '';
ALTER TABLE health_records ADD COLUMN exercise_json TEXT DEFAULT '{}';
ALTER TABLE health_records ADD COLUMN cold_shower_json TEXT DEFAULT '{}';
ALTER TABLE health_records ADD COLUMN concerta_json TEXT DEFAULT '{}';
ALTER TABLE health_records ADD COLUMN morning_light INTEGER;
ALTER TABLE health_records ADD COLUMN steps INTEGER;
ALTER TABLE health_records ADD COLUMN lunch_json TEXT DEFAULT '{}';
ALTER TABLE ai_insights ADD COLUMN scope TEXT NOT NULL DEFAULT 'health';
ALTER TABLE ai_insights ADD COLUMN meta_json TEXT DEFAULT '{}';
```

---

## 四、 前端工程与 HealthTrack 3.0 设计规范

### 4.1 现代前端工程架构
* **源码工程目录**：`web/src/`（开发与功能重构的唯一入口）。
* **生产落盘路径**：`web/static/`（由 Vite 构建生成的纯静态 Bundle，供 Go `embed.go` 打包）。
* **开发约束红线**：**严禁直接修改 `web/static/` 目录下的任何产物**。每次前端源码或样式变更后，必须在**项目根目录**执行 `npm run typecheck && npm test && npm run build` 重新验证并编译，确保 Go 二进制与 Android APK 包含最新前端代码。
* **工程架构分层**：
  * `web/src/views/`：4 大业务区控制器与子模块（`log/log-controller.js`、`dash/{dash-controller,trend-weekly,trend-detail}.js`、`insight/{insight-controller,insight-history,compare-controller,stream-renderer}.js`、`evening/{evening-controller,evening-history}.js`）；
  * `web/src/components/`：通用交互组件（`BottomNav.js`、`Header.js`、`Toast.js`、`modals/{SettingsModal,DataSheetModal,ExportModal,ImportModal,ImportBatchesModal,OtherModals}.js`）；
  * `web/src/services/`：API 抽象层、SSE 流式消费、视图路由与轻量状态管理（`api.js`、`sse.js`、`router.js`、`state.js`）；
  * `web/src/utils/`：DOM 类型窄化、日期处理、弹窗确认、Markdown 渲染与格式化工具（`dom.js`、`date.js`、`dialog.js`、`format.js`）；
  * `web/src/types/`：TypeScript `checkJs` 全局类型与 Vite `?raw` 声明；
  * `web/src/css/app.css`：HealthTrack 3.0 构建期 Tailwind CSS v3 + `@fontsource/jetbrains-mono` + 极简极客 Design Tokens。

### 4.2 HealthTrack 3.0 Linear 1px 工业单线设计系统
* **视觉范式**：**Linear / Raycast 1px 工业单线极简极客美学**。淘汰夸张大圆角（`rounded-3xl`）、粗笨投影（`shadow-2xl`）与深色渐变卡片，全站统一收敛至标准 12px 圆角单线容器（`.ht-card`：`rounded-xl border border-neutral-200/80 bg-white`）。
* **排版系统**：
  * **主字体**：`Inter`, `-apple-system`, `system-ui`, sans-serif。
  * **等宽数字体系**：所有测量数值、差值、时间点、百分比与单位微标签强制绑定 **`JetBrains Mono`**（`.font-mono` + `.tabular-nums`），保障跨端数值严整对齐。
* **图标规范**：全面淘汰原生彩色 Emoji，全站统一采用 1.5px 极细线性内联 SVG（Lucide 规范）。
* **通用交互原子 Tokens**：
  * **单线分段切换胶囊（`.ht-seg-btn`）**：灰白底色配 1px 微边框，选态纯净加亮，替代过时的浮夸圆钮；
  * **极细交互滑轨（`.ht-range`）**：2px 极细轨道配 14px 紧凑圆滑块，支持步数（0~20000）与自评分（1~10）；
  * **非阻塞交互反馈**：弹窗一律走 Promise 化应用内弹窗 `#app-confirm-modal`（`appConfirm()`）与轻量提示 `#app-toast`，**严禁使用原生 `confirm()` / `alert()`**。

### 4.3 记一笔 Tab (`view-log`) 规范
* **指标录入顺序**：顺应生理称重逻辑，排布为「睡前体重 $\to$ 晨起空腹 $\to$ 腰围」。
* **睡眠智能联动**：输入昨晚就寝时间与今晨起床时间，自动推导睡眠时长；结合服务端动态配置的熬夜阈值，实时渲染状态徽章（未熬夜 / 轻度熬夜 / 重度熬夜）。
* **低负担行为三项**：
  * **晨光**：一键 YES/NO 点选，默认留空；
  * **步数**：0~20000 极细滑块（500 一档），支持一键「留空」保持断点；
  * **午餐**：独立折叠卡，支持「沿用昨天」与 6 行极简结构化点选。
* **生物黑客折叠卡**：
  * **运动**：`types` 独立多选（有氧 / 抗阻可同时勾选，「无运动」互斥清空），记录疲劳强度与时长；
  * **专注达**：服药时间、剂量（18/36/54mg）、1~5 分启动力打卡与晚间 Crash 追踪；
  * **冷水澡**：刺激时机、预估体感水温（0~40℃）与神经唤醒体感。
* **吸底保存条**：固定在底部 Tab 上方，具备本地草稿自动缓存与切页/离开未保存确认拦截防护。

### 4.4 数据趋势看板 Tab (`view-dash`) 规范
* **核心看板卡片**：体重、腰围、睡眠时长、每日步数 4 张核心趋势图。
* **全局测量断点铁律**：**测量类缺失一律以断点呈现（`spanGaps: false`），严禁以 0 填充**；计数类指标缺失即 0。
* **独立周期档位**：`近7天 / 近30天 / 近60天`，看板档位与 AI 洞察档位完全独立，互不联动。
* **独立周平均视图 (`view-trend-weekly`)**：
  * 分桶口径：自然周（周一至周日），展示最近 12 周；
  * 曲线特征：周均值折线 + 周内 min/max 波动区间带；
  * 置信度规则：当周 0 天记录断点留空；1~3 天标记低置信（虚线/空心点）；$\ge 4$ 天为正常置信。
* **独立 60 天详情横滑视图 (`view-trend-detail`)**：
  * 竖屏/窄窗口：固定日宽横向滚动（约 26px/点），不压缩节点；
  * 横屏自适应：容器宽 $\ge 560\text{px}$ 时自适应整屏铺满，x 轴每 3 天一刻度，紧凑布局。

### 4.5 AI 深度洞察 Tab (`view-insight`) 规范
* **分析周期与自选截止日**：周期档位（`近7天`、`近30天`、`近60天`、`全部`），支持自选分析截止日（不允许未来日期），存在性判定收归后端精确匹配。
* **极简交互流**：主操作按钮纯中文化（「生成阶段深度洞察」），彻底去除沙漏等待 Emoji；打字机流式输出，思维链在上、正文在下。
* **阶段对比独立视图 (`view-compare`，已实现)**：
  * 入口：洞察页头部「阶段对比」按钮进入独立全屏视图；
  * 窗口模型：两个自然月双窗口（`对比月 A` vs `对比月 B`），互不重叠；
  * 聚合先行：Go 后端直接预计算 7 项聚合指标快照并在页面渲染对比表，AI 模型只负责趋势解读与阶段综述。
* **洞察历史与管理模式 (`view-history`)**：
  * 游标分页（10条/批），关键词搜索，全周期筛选（近7天、近30天、近60天、全部、对比）；
  * 管理模式：头部中性工业风「管理」按钮，展开批量勾选框与底部删除操作条。

### 4.6 睡前小结 Tab (`view-evening`) 规范
* **顶部日期选择器**：显式宽度 138px，彻底解决 Android 移动端日期末位数字被遮挡问题。
* **心理与成就感复盘**：
  * 1~10 分自评分滑块，实时联动可配置分档文案与状态徽章；
  * 今日完成三件事（结构化 3 行）与自由感悟；
  * 当日照片上传（Canvas 客户端压缩 $\to$ 原生二进制 POST 存储）。
* **小结深度洞察卡片**：
  * 关联生理数据窗口（`近7天` / `近30天`）；
  * 纯中文操作「生成小结深度洞察」，白底中性单线卡片承载，思维链自适应折叠。
* **往期回顾时间轴**：
  * 日期 $\times$ 评分组合筛选与分页加载；
  * 紧凑微缩略图约束为 40px $\times$ 40px，卡片头部严整对齐；
  * 右上角清晰展示当日自评分徽章；
  * 左滑露出删除按钮（42px 吸附阈值）。

---

## 五、 API 契约、统一响应与 SSE 流式协议

### 5.1 统一 JSON 响应信封（`internal/model/response.go`）
除 SSE 长连接与静态资源外，所有 RESTful 接口统一以以下结构返回：
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1790611200
}
```

**业务错误码规范**：
* `200`（`CodeSuccess`）：操作成功；
* `40001`（`CodeParamError`）：参数非法；
* `40002`（`CodeDateInvalid`）：日期格式错误（须 YYYY-MM-DD）；
* `40401`（`CodeNotFound`）：未找到对应记录；
* `50001`（`CodeDBError`）：SQLite 读写或事务异常；
* `50201`（`CodeAIServiceErr`）：上游大模型通信失败或超时。

### 5.2 核心 RESTful 路由清单
| 方式 | 路由路径 | 说明 | 关键参数 / 载荷 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/records/today` | 获取今日已有记录 | 无 |
| `POST` | `/api/v1/records` | 新建或幂等合并单日数据 | `SaveRecordDTO` JSON |
| `GET` | `/api/v1/records/history` | 按日期区间拉取数据 | `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` |
| `GET` | `/api/v1/insights/stream` | **AI 深度洞察流式接口 (SSE)** | `?days=7\|30\|60&end_date=YYYY-MM-DD&tz_offset=<分钟>` |
| `GET` | `/api/v1/insights/period` | 判定分析窗口是否已存在洞察 | `?range_days=7\|30\|60&end_date=YYYY-MM-DD&tz_offset=<分钟>` |
| `GET` | `/api/v1/insights` | AI 洞察历史列表（游标分页） | `?limit=10&before_id=<id>&range_days=&scope=health\|compare&q=` |
| `GET` | `/api/v1/insights/{id}` | 读取单条洞察存档详情 | 路径参数 `id` |
| `DELETE` | `/api/v1/insights/{id}` | 删除单条洞察存档 | 路径参数 `id` |
| `POST` | `/api/v1/insights/batch-delete` | 批量删除洞察存档 | `{"ids":[1,2,3]}` |
| `GET` | `/api/v1/insights/compare/stream` | **阶段对比流式生成 (SSE)** | `?month_a=YYYY-MM&month_b=YYYY-MM&tz_offset=<分钟>` |
| `GET` | `/api/v1/insights/compare/period` | 校验月份对并返回预计算快照 | `?month_a=YYYY-MM&month_b=YYYY-MM` |
| `GET` | `/api/v1/evening/summary` | 读取指定日期的睡前小结 | `?date=YYYY-MM-DD` |
| `POST` | `/api/v1/evening/summary` | 新建或覆盖当日睡前小结 | `{record_date, done_items[], note_text, score}` |
| `GET` | `/api/v1/evening/summaries` | 睡前小结全量列表 | 返回 `{items, total}` |
| `DELETE` | `/api/v1/evening/summary/{date}` | 删除某日睡前小结（连同照片） | 路径参数 `date` |
| `POST` | `/api/v1/evening/photo` | 上传/替换小结照片（二进制） | `?date=YYYY-MM-DD`，Body 为二进制字节流 |
| `GET` | `/api/v1/evening/photo/{id}` | 读取小结照片（BLOB 回吐） | 路径参数 `id` |
| `DELETE` | `/api/v1/evening/photo/{id}` | 删除小结照片 | 路径参数 `id` |
| `GET` | `/api/v1/evening/insight/stream` | **睡前小结洞察流式生成 (SSE)** | `?date=YYYY-MM-DD&days=7\|30` |
| `GET` | `/api/v1/evening/insight` | 读取某日小结洞察存档 | `?date=YYYY-MM-DD` |
| `DELETE` | `/api/v1/evening/insight` | 清除某日小结洞察 | `?date=YYYY-MM-DD` |
| `POST` | `/api/v1/import/preview` | **数据导入预检（不落库）** | Multipart 表单（文件或粘贴文本，$\le 5\text{MB}$） |
| `POST` | `/api/v1/import/confirm` | **确认导入（单事务原子落库）** | `{batch_id, conflict_mode, skip_errors}` |
| `GET` | `/api/v1/import/batches` | 获取导入批次历史列表 | `?limit=20` |
| `POST` | `/api/v1/import/batches/{id}/retry` | 重试失败批次 | 路径参数 `id` |
| `GET` | `/api/v1/import/batches/{id}/failed-rows` | 导出失败行 CSV | 路径参数 `id` |
| `GET` | `/api/v1/import/template` | 下载标准 CSV 导入模板 | 无 |
| `GET` | `/api/v1/export` | 导出 CSV 数据文件 | `?range=7\|30\|all` |
| `GET` | `/api/v1/export/json` | 导出全量 JSON 备份 | 无 |
| `GET` | `/api/config` | 读取运行时配置（脱敏） | 返回 base_url, model, sleep_*, summary |
| `POST` | `/api/config` | 更新 AI 配置（即时生效） | `{base_url, model, api_key?}` |
| `POST` | `/api/config/sleep` | 更新熬夜阈值配置 | `{green_before, yellow_before}` |

### 5.3 SSE 打字机流式协议
服务端通过透明转发 OpenAI 兼容接口的标准事件流帧，前端区分 `choices[0].delta.content` 与 `delta.reasoning_content` 双通道渲染：
```http
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: *
```
* **正文通道**：累积到正文展示区，触发 Markdown 实时增量渲染；
* **思维链通道**：累积到独立的推导容器，正文开始吐字时自动折叠。

---

## 六、 后端特征工程与 AI 模块实现

### 6.1 特征工程预计算哲学
> **核心工程红线**：
> **严禁让大模型在长上下文中做复杂的数值减法与多日统计！**
> Go 后端必须先行计算好 $\Delta W_{sleep}$、$\Delta W_{day}$、力竭抗阻训练日、熬夜天数等特征，组装成结构化上下文直接注入。

`InsightService.BuildPromptContext` 将记录数组转化为两段式结构化文本：
1. **系统预计算：宏观生理与行为特征大盘**（有效天数、净体重变化、平均夜间失水、力竭训练天数、专注达天数等）；
2. **逐日微观多维流水**（日增减、排水、睡眠标签、运动、专注达、体感水温、饮食日记）。

### 6.2 AI 洞察流式实现（`internal/handler/ai_handler.go`）
* **双消息下发策略**：
  * `system`：硬性约束常量 `systemInstruction`（思维链与正文必须全程简体中文，绝不允许英文思考）；
  * `user`：装载提示词模板 + 预计算数据上下文。
* **模板双轨加载机制**：
  * **磁盘优先**：优先读取 `prompts/insight_v1.txt`（桌面端改动即时生效，无需重新编译）；
  * **内嵌兜底**：磁盘缺失时回退到 `internal/service/default_prompt.txt`（`go:embed` 保证 Android APK 离线可用，**严禁删除**）。

### 6.3 睡前小结洞察流式实现
* 以指定小结日期为锚点向前回溯 7 天或 30 天，关联生理特征；
* 模板侧重**心理状态与成就感**解读，生理数据仅作为辅助佐证；
* 同一日期的小结洞察以 `scope='evening'` 保持唯一，重新生成时先清理同日旧记录。

### 6.4 阶段对比聚合与流式实现（`internal/service/compare_service.go`）
* **两月聚合先行**：Go 后端先行聚合计算 7 项核心指标（体重均值与净变化、腰围均值与净变化、平均睡眠时长、熬夜天数分布、运动天数与强度分布、专注达天数、平均夜间排水量）；
* **不足月标注**：单月有效记录天数 $<7$ 天或为当前未过完月份时，显式标明「数据不足 / 不足月」，提示降低置信度；
* 存储与存档：生成完成后落库 `ai_insights`（`scope='compare'`, `range_days=0`，两月边界与指标快照存入 `meta_json`）。

### 6.5 运行时配置热更新（`internal/config/runtime.go`）
`RuntimeStore` 持有当前配置的内存快照，通过 `UpdateAI` 与 `UpdateSleep` 原子写回 `config.yaml` 并即时刷新快照，全站请求即时生效，无需重启服务。

---

## 七、 提示词模板契约

### 7.1 生理洞察模板（`prompts/insight_v1.txt`）
* **文件位置**：磁盘 `prompts/insight_v1.txt`；兜底 `internal/service/default_prompt.txt`。
* **角色定位**：精通神经生物学、运动代谢与行为心理学的健康顾问。
* **分析原则**：
  1. 尊重生理规律消除虚假减脂焦虑（单日晨重突增优先归因于肌肉微创伤水分潴留、高钠水滞留或糖原结合水，严禁误判为脂肪增长）；
  2. 专注达 17:30 药效衰退与晚间 Crash 代偿机制识别；
  3. 区分冷水澡晨起唤醒与睡前交感激活的双面作用；
  4. 绝不推算微观卡路里，仅评估 NOVA 加工分级与 8:2 弹性维持。
* **输出结构**：4 段式 Markdown（代谢与水分归因 / 饮食加工程度 / 神经调控与节律 / 3条低阻力行动建议）。

### 7.2 睡前小结洞察模板（`prompts/evening_insight_v1.txt`）
* **文件位置**：磁盘 `prompts/evening_insight_v1.txt`；兜底 `internal/service/default_evening_prompt.txt`。
* **角色定位**：温和务实的个人成长教练，聚焦心理状态与微小成就感。
* **输出结构**：今日状态概览 / 成就感与心理归因 / 值得留意的信号 / 明日一件小事（仅 1 条极低成本建议）。

### 7.3 阶段对比模板（`prompts/compare_v1.txt`）
* **文件位置**：磁盘 `prompts/compare_v1.txt`；兜底 `internal/service/default_compare_prompt.txt`。
* **角色定位**：长期健康趋势与生理演进分析顾问。
* **输出结构**：两月总览（指标对比核心要点）/ 关键变化与归因（体重·腰围·作息·运动·用药）/ 下一阶段 1~3 条低成本建议。

---

## 八、 工程构建、配置与交付规范

### 8.1 配置文件规范（`config.yaml`）
```yaml
server:
  port: 8080
  dev_mode: false

database:
  path: "data/health.db"
  backup_dir: "data/backups"

ai:
  base_url: "https://api.deepseek.com/v1"
  api_key: "sk-..."
  model: "deepseek-reasoner"
  max_tokens: 4096
  thinking: "enabled"

sleep:
  green_before: "23:00"
  yellow_before: "00:00"

summary:
  score_bands:
    - range: "1-2"
      label: "很低落"
      tone: "gray"
    - range: "3-4"
      label: "有点钝"
      tone: "blue"
    - range: "5-6"
      label: "平平"
      tone: "green"
    - range: "7-8"
      label: "还不错，稳住了节奏"
      tone: "purple"
    - range: "9-10"
      label: "满分的一天"
      tone: "orange"
```

### 8.2 多通道构建与交付流水线
任何涉及前端的改动，必须先在**项目根目录**执行 `npm run typecheck && npm test && npm run build`，再进行后续构建：

| 通道 | 触发方式 | 前置命令 | 核心构建命令 / 产物 |
| :--- | :--- | :--- | :--- |
| **前端验证与编译** | 前端开发改动后 | 无 | `npm run typecheck && npm test && npm run build`（产物落入 `web/static/`） |
| **桌面本地** | `git commit` 或手动 | 前端已编译 | `go build -o bin/HealthTrack.exe ./cmd/server` |
| **手机本地** | 手动执行脚本 | 脚本自动执行前端编译 | `.\scripts\build-android.ps1`（自动检测手机版本号、编译 .so、Gradle 打包、无线 `adb install -r` 覆盖安装） |
| **手机 CI** | 推送 `main` 分支 | CI 流程自动执行 | `.github/workflows/build-apk.yml`（debug 测试包）与 `release-apk.yml`（`assembleRelease` 正式包） |

**移动端关键约束**：
* 必须统一使用固定签名密钥（根目录 `healthtrack-release.jks`，别名 `healthtrack`）；
* 移动端 HTML 响应（`/` 及 `*.html`）一律注入 `Cache-Control: no-cache, must-revalidate`，避免 WebView 强缓存旧页面导致功能不更新；
* `versionCode` 必须持续递增，CI 统一按 `1000 + git rev-list --count HEAD` 注入，本地脚本基于手机已安装版本号自动 `+1`。

### 8.3 统一 Git 忽略规则（`.gitignore`）
* 严禁提交个人数据库与备份（`data/*.db`, `data/backups/`）；
* 严禁提交真实配置文件与密钥（`config.yaml`, `.env`）；
* 严禁提交含本机签名密钥口令的脚本（`scripts/build-android.ps1`）。

---

## 九、 Agent 实施约束与熔断机制

任何在此工程工作的 AI Agent 必须无条件遵守以下纪律：

### 9.1 唯一事实源原则 (SSOT)
本规范文档（`v3.4.0`）是项目架构、表结构、接口协议与业务逻辑的最高权威。代码与文档冲突时，以本文档为准。

### 9.2 真实数据保护红线
* **严禁清空、删除或改写 `data/` 目录！**
* **数据库结构变更仅允许使用 `ALTER TABLE ... ADD COLUMN`**，严禁使用 `DROP TABLE`、`TRUNCATE` 或任何破坏性操作；
* 启动时必须自动执行当日冷备份。

### 9.3 移动端覆盖安装红线
* 手机端必须通过 `adb install -r` 覆盖安装，**严禁执行 `adb uninstall` 或清除应用数据**，防止手机端已积累的历史数据丢失。

### 9.4 前端源码开发红线
* 所有前端页面、样式、交互的开发与修复必须在 `web/src/` 中完成；
* 严禁直接手改 `web/static/` 内的打包文件；
* 修改前端后必须执行 `npm run build` 生成最新 Bundle 并验证。

### 9.5 "不确定即暂停提问"熔断机制 (Stop & Ask)
遇到业务逻辑存疑、可能引发数据丢失、或需引入大型侵入式重型框架时，**必须立即暂停并向用户提问**，严禁擅自做主。

---

## 十、 需求状态清单 (Backlog)

### 10.1 已完成特性归档
* **[已完成] 1. 冷水澡记录增加体感水温字段**：`ColdShowerDetail.WaterTemp`（0~40℃）与 AI 刺激强度量化关联。
* **[已完成] 2. AI 洞察历史存档与自选截止日**：`ai_insights` 表持久化、游标分页、按截止日回溯周期窗口、重复生成提醒与批量删除。
* **[已完成] 3. 睡前小结独立模块**：底部第 4 个 Tab，包含自评分、今日三件事、感想、照片上传与独立小结深度洞察。
* **[已完成] 4. 看板交互优化与录入顺序对齐**：点击节点查看当日排水与时间；新增独立腰围趋势卡；录入顺序对齐为「睡前体重 $\to$ 晨起空腹 $\to$ 腰围」。
* **[已完成] 5. 运动训练多选支持**：`types` 支持同时勾选有氧与抗阻，向后兼容旧单值。
* **[已完成] 6. 数据趋势看板 60 天横滑详情**：总入口进入独立全屏横滑视图，移动端横屏自适应一屏。
* **[已完成] 7. 趋势分析页 · 周平均趋势**：自然周 12 周聚合、均值折线 + min/max 区间带、置信度分级（0天断点、1~3天低置信）。
* **[已完成] 8. 洞察 · 阶段对比独立视图**：自然月双窗口选择、7 项核心生理与行为指标 Go 端预计算快照表、AI 阶段对比综述。
* **[已完成] 9. 批量数据导入预检与原子提交**：CSV/JSON/手写备忘录导入，先预检、逐行展示变更差异、单事务原子提交、批次历史与失败重试。
* **[已完成] 10. HealthTrack 3.0 Linear 极简极客设计体系落地**：全站 1px 工业单线收敛（`.ht-card`）、`JetBrains Mono` 等宽数字排版、1.5px 线性矢量图标、彻底清除 Emoji。

### 10.2 待办需求清单
| # | 需求 | 涉及范围 | 状态与说明 |
| :--- | :--- | :--- | :--- |
| 1 | 统一 CI 与本地 `versionCode` 基线 | `.github/workflows/{build,release}-apk.yml` | **[已完成]**：CI 统一以 `1000 + git rev-list --count HEAD` 注入且 `release-apk.yml` 使用 `assembleRelease` 构建 |
| 2 | 睡前小结手写签名功能 | 前端 Canvas 画板 + 后端存储 | 暂缓：用户提出后评估交互复杂度，待后续排期 |
| 3 | 启动困难任务阻滞量表打卡 | 前端独立卡片 + 模型字段 | 暂缓：当前暂以 `Concerta.FocusWork`（1~5分）作为代理指标 |

---

## 附录：语义化提交规范

提交信息统一采用英文小写前缀 + 中文说明：
* `feat:` 新增功能
* `fix:` 缺陷修复
* `ui:` 样式与界面优化
* `refactor:` 代码重构
* `chore:` 构建、脚本、配置依赖调整
* `docs:` 文档更新
