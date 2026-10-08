# HealthTrack 智能健康洞察追踪系统

## 统一系统设计与工程实施规范 (Unified System Architecture & Engineering Spec)

| 文档版本               | 状态                             | 适用角色                                    | 效力说明                                                  |
| :--------------------- | :------------------------------- | :------------------------------------------ | :-------------------------------------------------------- |
| **v3.1.0 (Reconciled)** | **Approved & Frozen (最高权威)** | AI Agent / 全栈工程师                       | **项目全局唯一事实源 (SSOT)**，所有代码实现与重构以此为准 |

> **v3.1.0 修订说明**：新增【睡前小结】模块（第 4 个底部导航）与侧重心理解读的小结洞察（独立提示词模板、思维链展示、图片存取、评分文案可配置、左滑删除），补齐正文 §3.4 / §4.3 / §5.2 / §5.3 / §6.3 / §7.2 / §8.1 / §8.2；并回填【第十章】Backlog 状态（原 10.2 的第 1~4、6 项已实现，移入 10.1 归档）。
>
> **v3.0.0 修订说明**：本节版对齐了工程实际实现（表名、字段、驱动、接口、构建方式），修正了 v2.0.0 中已失效的内容，并新增【第十章 待办需求清单 (Backlog)】。凡本文档与代码冲突之处，以本文档为准；如发现新的偏差，须更新本文档而非放任代码偏离。

---

## 目录（全景索引）

* 1. [项目愿景、核心痛点与产品定位](#一-项目愿景核心痛点与产品定位)
* 2. [核心业务逻辑与生理算法规范](#二-核心业务逻辑与生理算法规范)
* 3. [数据模型与持久层规范（对齐真实工程）](#三-数据模型与持久层规范)
* 4. [前端页面与交互组件规范](#四-前端页面与交互组件规范)
* 5. [API 契约、统一响应与 SSE 流式协议](#五-api-契约统一响应与-sse-流式协议)
* 6. [后端特征工程与 AI 模块实现](#六-后端特征工程与-ai-模块实现)
* 7. [提示词模板契约](#七-提示词模板契约)
* 8. [工程构建、配置与交付规范](#八-工程构建配置与交付规范)
* 9. [Agent 实施约束与"不确定即暂停提问"熔断机制](#九-agent-实施约束与不确定即暂停提问熔断机制)
* 10. [**待办需求清单 (Backlog)**](#十-待办需求清单-backlog)
* 附录：[版本控制与提交规范](#附录版本控制与提交规范)

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

### 1.3 产品形态（双端同构）

* **电脑端**：Go 单二进制约 `bin/HealthTrack.exe`，内嵌前端静态资源，监听 `127.0.0.1:8080`。
* **手机端**：Android WebView 外壳 APK（包名 `com.healthtrack.app`），同样加载本机 `http://127.0.0.1:8080`；Go 服务端以交叉编译的 `libhealthtrack.so` 形式随 APK 分发。
* **数据本地优先**：所有数据存放于本地 `data/health.db`（桌面）或 App 私有 `filesDir`（Android），不上传云端。

---

## 二、 核心业务逻辑与生理算法规范

### 2.1 核心生理指标与差值定义

> 字段名以第三章实体模型为准（`weight_am` / `weight_pm` / `waist_size`）。

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
* 工程实现：时间解析统一走 `model.parseSleepTimeMinutes`，对 `00:00~04:00` 的小时数 `+24h` 归一化，避免跨日比较出错。

### 2.3 睡眠时长双时间点自动联动算法

前端废弃繁琐的人工心算时长输入，改为**输入就寝时间与起床时间自动推导**：

* 设就寝时间为 $T_{bed}$，起床时间为 $T_{wake}$（格式均为 `HH:mm`）。
* 将时间转换为当日累计分钟数：
  $$M_{bed} = H_{bed} \times 60 + m_{bed}, \quad M_{wake} = H_{wake} \times 60 + m_{wake}$$
* 跨日判定：若 $M_{wake} \le M_{bed}$，则说明跨越午夜，$M_{wake} = M_{wake} + 1440$。
* 时长计算：
  $$\text{Duration} = \frac{M_{wake} - M_{bed}}{60} \quad (\text{四舍五入保留 1 位小数})$$
* 系统自动回填计算值，但依然保留用户直接在输入框中手动覆盖修改的自由。

### 2.4 熬夜三色分级标准（阈值可配置，读时实时计算）

> ⚠️ **重要变更（对齐实际实现）**：熬夜阈值**不再是硬编码的 24:00 / 01:00**，而是通过配置文件 `config.yaml` 的 `sleep` 段落自定义；且 `sleep_tag` **在接口返回前按当前阈值实时计算**，而非依赖数据库历史存储值——修改阈值后，历史数据无需重算即按新规则显示。

* 配置项（`internal/config/config.go` 的 `SleepConfig`）：

  | 配置键                    | 默认值   | 含义                                                         |
  | :------------------------ | :------- | :----------------------------------------------------------- |
  | `sleep.green_before`      | `23:00`  | 就寝时间早于该值为未熬夜(绿)                                 |
  | `sleep.yellow_before`     | `00:00`  | 就寝时间在 `[green_before, yellow_before)` 为轻度熬夜(黄)；`>= yellow_before` 为重度熬夜(红) |

* 判定函数：`model.CalculateSleepTagWithThresholds(startTime, greenBefore, yellowBefore) string`
  * `total < green` → `GREEN`
  * `green <= total < yellow` → `YELLOW`
  * `total >= yellow` → `RED`
  * 阈值与就寝时间均按 `HH:mm` 解析，凌晨 `00:00~04:00` 按跨日 `+24h` 归一化；阈值解析失败时回退 `green=23:00`、`yellow=24:00`。

### 2.5 饮食 NOVA 加工分级与 8:2 弹性评估

用户饮食记录为纯文本（落库字段 `journal_text`），允许包含粗略预估克重（允许 $\pm 30\%$ 误差），**坚决不推算微观卡路里**。系统与 AI 基于国际 NOVA 标准识别：

* 🟢 **绿灯项（原生/微加工食材，Clean Foods）**：纯肉、蛋、水产、原生米饭、土豆、燕麦、天然蔬果。
* 🟡 **黄灯项（常规烹饪加工品）**：带油盐炒菜、调味米粉、板栗、复合主食。
* 🔴 **红灯项（超加工食品 UPF / 精制糖油混合物 / 高钠）**：月饼、含糖饮料（可乐）、糕点、深加工膨化、极高钠霉豆腐、薯片、辣条、汉堡等。
* **8:2 弹性维持原则**：若周期内绿灯原生食材摄入频次与体积占比达到 **$70\% \sim 80\%$**，红灯安慰性食物维持在 **$20\% \sim 30\%$**，系统判定为健康度优秀且可持续，消除断糖心理焦虑。

### 2.6 运动分类与次日肌肉水肿归因机制

* **极简运动量化**（`ExerciseDetail`）：
  * 类型 `type`：`none` (无), `cardio` (有氧), `strength` (抗阻/力量)
  * 强度 `intensity`（主观疲劳度 RPE）：`light` (轻松), `medium` (中等), `failure` (力竭/高负荷)
  * 时长 `duration`：分钟数（如 40）
  * 备注 `items`：自由文本，如 "骑行 3km" 或 "腿部深蹲"
* **水肿归因锚点**：
  抗阻力量训练（尤其包含力竭大肌群训练如腿部）会引发肌纤维微损伤与急性充血修复，导致**皮质醇脉冲与炎症性水分潴留 (Water Retention)**。若次日 $\Delta W_{day}$ 暴增 $0.5 \sim 1.5\text{kg}$，系统与 AI 必须优先解释为肌肉修复储水，严禁误判为脂肪增长。
* **待办**：目前 `type` 为单值，无法同时记录"有氧 + 无氧"，见第十章 Backlog 第 1 条。

### 2.7 专注达 (Concerta) 多维药效与晚间断崖代偿

* **药动学特征**：OROS 渗透泵胶囊释放曲线维持约 10~12 小时（如 08:00 服药，17:30 药效衰退）。
* **五维自评打卡（1~5 分）**：
  1. `focus_work`：深度工作与执行力（是否克服启动拖延、沉浸编程）；
  2. `focus_study`：长文本/论文阅读工作记忆；
  3. `daily_tasks`：低多巴胺琐事耐受度（洗衣服、收桌子）；
  4. `social`：情绪平稳与倾听耐心；
  5. `gaming`：竞技反应速度与抗挫败心态。
* **晚间断崖代偿追踪**：药效消退后多巴胺受体骤降易引发 Crash，表现为极度疲劳与神经代偿。系统追踪用户是否使用 `[monster_energy / 魔爪/咖啡因]` 续航，或诱发 `[sugar_craving / 高糖高脂暴食冲动]`（解释晚餐月饼/可乐的生理根源）。

### 2.8 冷水澡神经激活与昼夜节律影响

* **记录维度**（`ColdShowerDetail`）：
  * `enabled`：是否打卡
  * `timing`：`morning` (晨起), `post_workout` (训练后), `evening` (睡前)
  * `duration`：时长（分钟，1~5m）
  * `feeling`：`refreshed` (神经清爽唤醒), `neutral` (无感), `shivering` (发抖/回温困难)
* **关联分析**：
  晨起冷水澡促发去甲肾上腺素与多巴胺平缓释放，缩短专注达起效潜伏期；睡前冷水澡激活交感神经，关联分析其对入睡潜伏期及深睡时长的负面干扰。
* **预估体感水温 `water_temp`（已实现）**：单位 ℃，可空，录入范围 `0~40`。10 月天气转凉、持续降雨，水温较夏季大幅下降，冷刺激强度显著提升（主观上接近短效专注达）。记录水温后，AI 可建立"水温变化 → 唤醒强度 → 时长需求"的量化关联，据此给出冷水澡时长调整建议；`BuildPromptContext` 输出的冷水澡明细形如 `morning(16.0℃/2分钟/refreshed)`。

---

## 三、 数据模型与持久层规范

> ⚠️ **强制声明（对齐真实工程）**：
> * 真实工程核心表名**唯一确定为 `health_records`**（v2.0.0 中记载的 `records` 已作废）。
> * SQLite 驱动使用**纯 Go 实现 `modernc.org/sqlite`**（非 CGO 的 `mattn/go-sqlite3`），这是 Android `CGO_ENABLED=0` 交叉编译与单二进制交付的前提。
> * 持久层统一由 `internal/repository/db.go` 与 `internal/repository/record_repo.go` 实现，**严禁新建 `migration/` 包**。

### 3.1 实体模型定义（`internal/model/record.go`）

> 注意：Go 模块名为 `healthtrack`（见 `go.mod`），导入路径为 `healthtrack/internal/...`。

```go
package model

import "time"

// ExerciseDetail 运动明细
type ExerciseDetail struct {
	Type      string `json:"type"`      // none, cardio, strength
	Duration  int    `json:"duration"`  // 时长 (分钟)
	Intensity string `json:"intensity"` // light, medium, failure
	Items     string `json:"items"`     // 备注，如 "骑行 3km" 或 "腿部深蹲"
}

// ColdShowerDetail 冷水澡记录
type ColdShowerDetail struct {
	Enabled   bool     `json:"enabled"`    // 是否打卡
	Timing    string   `json:"timing"`     // morning, post_workout, evening
	Duration  int      `json:"duration"`   // 时长 (分钟)
	WaterTemp *float64 `json:"water_temp"` // 预估体感水温 (℃)，可空，0~40
	Feeling   string   `json:"feeling"`    // refreshed, neutral, shivering
}

// ConcertaDetail 专注达服药与多维效能记录
type ConcertaDetail struct {
	Taken          bool     `json:"taken"`        // 今日是否服药
	Time           string   `json:"time"`         // 服药时间点 (HH:mm)
	Dose           int      `json:"dose"`         // 剂量 (18, 36, 54)
	FocusWork      int      `json:"focus_work"`   // 工作启动力与心流 (1-5)
	FocusStudy     int      `json:"focus_study"`  // 阅读与工作记忆 (1-5)
	DailyTasks     int      `json:"daily_tasks"`  // 琐事耐受度 (1-5)
	SocialPatience int      `json:"social"`       // 社交情绪平稳度 (1-5)
	GamingReaction int      `json:"gaming"`       // 竞技反应度 (1-5)
	CrashTime      string   `json:"crash_time"`   // 断崖疲劳点 (HH:mm)
	SideEffects    []string `json:"side_effects"` // ["appetite_loss", "thirst", "palpitation"]
	Compensations  []string `json:"compensations"`// ["monster_energy", "sugar_craving"]
}

// HealthRecord 核心健康记录实体（对齐 SQLite health_records 表）
type HealthRecord struct {
	ID             int64    `json:"id"`
	UserID         int64    `json:"user_id"`
	RecordDate     string   `json:"record_date"`      // 业务日期 YYYY-MM-DD
	WeightAM       *float64 `json:"weight_am"`        // 晨起空腹体重 (kg)，可空
	WeightPM       *float64 `json:"weight_pm"`        // 睡前体重 (kg)，可空
	WaistSize      *float64 `json:"waist_size"`       // 腰围 (cm)，可空
	SleepStartTime *string  `json:"sleep_start_time"` // 昨晚就寝时间 "HH:mm"，可空
	SleepEndTime   *string  `json:"sleep_end_time"`   // 今晨起床时间 "HH:mm"，可空
	SleepHours     *float64 `json:"sleep_hours"`      // 睡眠总时长 (h)，可空
	SleepTag       string   `json:"sleep_tag"`        // GREEN / YELLOW / RED（读时重算）
	JournalText    string   `json:"journal_text"`     // 饮食与运动自由日记
	ActivityTags   string   `json:"activity_tags"`    // 由日记提取的标签 JSON

	// 生物黑客结构化对象（落盘为 TEXT JSON）
	Exercise   *ExerciseDetail   `json:"exercise,omitempty"`
	ColdShower *ColdShowerDetail `json:"cold_shower,omitempty"`
	Concerta   *ConcertaDetail   `json:"concerta,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Record 别名，历史文档/代码中沿用的旧名，等价于 HealthRecord
type Record = HealthRecord

// SaveRecordDTO 前端提交的请求载荷（指针字段语义：nil = 不修改）
type SaveRecordDTO struct {
	RecordDate     string            `json:"record_date"`
	WeightAM       *float64          `json:"weight_am"`
	WeightPM       *float64          `json:"weight_pm"`
	WaistSize      *float64          `json:"waist_size"`
	SleepStartTime *string           `json:"sleep_start_time"`
	SleepEndTime   *string           `json:"sleep_end_time"`
	SleepHours     *float64          `json:"sleep_hours"`
	JournalText    *string           `json:"journal_text"`
	Exercise       *ExerciseDetail   `json:"exercise"`
	ColdShower     *ColdShowerDetail `json:"cold_shower"`
	Concerta       *ConcertaDetail   `json:"concerta"`
}
```

**参数边界校验**（`SaveRecordDTO.Validate()`）：
* `record_date` 必须为 `YYYY-MM-DD`；
* `weight_am` / `weight_pm` ∈ `[30.0, 250.0]` kg；
* `waist_size` ∈ `[30.0, 200.0]` cm；
* `sleep_hours` ∈ `[0.0, 24.0]` h；
* `journal_text` ≤ 2000 字符。

### 3.2 数据库表结构与平滑升级（`internal/repository/db.go`）

系统初始化时执行幂等升级，**严禁使用可能破坏现有数据库的 `DROP` 或 `TRUNCATE` 语句**（见第九章红线）。

```go
package repository

import (
	"database/sql"
	_ "modernc.org/sqlite" // 纯 Go SQLite 驱动，支持 CGO_ENABLED=0
)

func InitDB(dbPath, backupDir string) (*DBManager, error) {
	// 1) 确保数据库目录存在
	// 2) 启动时执行一次当日冷备份 runAutoBackup(dbPath, backupDir)
	// 3) sql.Open("sqlite", dbPath)；因 SQLite 单写特性，连接池固定为 1
	// 4) Ping + migrate()
}

func (m *DBManager) migrate() error {
	schema := `
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

	CREATE TABLE IF NOT EXISTS ai_insights (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		range_days INTEGER NOT NULL DEFAULT 30,
		start_date TEXT,
		end_date TEXT,
		content TEXT,        -- 洞察正文 (Markdown)
		thinking TEXT,       -- 大模型思维链 (reasoning_content) 原文
		model TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_insights_user_id ON ai_insights(user_id, id DESC);

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

	CREATE TABLE IF NOT EXISTS evening_photos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL DEFAULT 1,
		record_date TEXT NOT NULL,
		mime TEXT DEFAULT '',
		data BLOB,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_evening_photos_user_date ON evening_photos(user_id, record_date);
	`

	// 平滑增量扩展字段（忽略"列已存在"错误，保证向后兼容）
	alterStatements := []string{
		`ALTER TABLE health_records ADD COLUMN sleep_bed_time TEXT DEFAULT '';`,
		`ALTER TABLE health_records ADD COLUMN sleep_wake_time TEXT DEFAULT '';`,
		`ALTER TABLE health_records ADD COLUMN exercise_json TEXT DEFAULT '{}';`,
		`ALTER TABLE health_records ADD COLUMN cold_shower_json TEXT DEFAULT '{}';`,
		`ALTER TABLE health_records ADD COLUMN concerta_json TEXT DEFAULT '{}';`,
		// scope 区分洞察归属：health（生理周期洞察）/ evening（睡前小结洞察）
		`ALTER TABLE ai_insights ADD COLUMN scope TEXT NOT NULL DEFAULT 'health';`,
	}
	// ...
}
```

**关键约束与说明**：

* **多用户预留**：所有读写均带 `user_id` 条件，当前单机版固定 `userID = 1`；唯一键为 `UNIQUE(user_id, record_date)`。
* **历史遗留列**：`sleep_start_time` / `sleep_end_time` 为主用字段；`sleep_bed_time` / `sleep_wake_time` 为兼容早期前端而保留的冗余列，写入时二者同步维护，读取时若主用字段为空则回退读取遗留列。
* **结构化对象 JSON 列**：`exercise_json` / `cold_shower_json` / `concerta_json` 存 `TEXT`，空值约定为 `"{}"`，读取时忽略空对象。
* **AI 洞察存档表 `ai_insights`**：独立于 `health_records`，持久化每次生成的洞察。`content` 存正文 Markdown、`thinking` 存思维链原文，`range_days` 记录档位（7/30/60），`start_date` / `end_date` 为该期数据实际起止日期；游标分页按 `id DESC`。
  * **`scope` 列区分归属**：`health`（生理周期洞察，默认值）与 `evening`（睡前小结洞察）。列表查询默认只取 `health`，两类洞察互不串页；`evening` 洞察按 `record_date` 唯一，重新生成时先删除同日旧条。
* **睡前小结两表**：`evening_summaries` 存小结主体（`done_1` / `done_2` / `done_3` 三列在模型层聚合为 `done_items` 数组，`score` 为 1~10 自评，`photo_id` 可空）；`evening_photos` 以 `BLOB` 直接存图并记录 `mime`（不经文件系统，规避 Android 路径与权限问题）。
* **自动冷备份**：每次启动若当日尚无备份，则复制一份到 `data/backups/health_backup_YYYYMMDD.db`。

### 3.3 数据访问层交互契约（`internal/repository/record_repo.go`）

`RecordRepository` 对外方法（实际签名）：

* **`GetByDate(userID int64, dateStr string) (*model.HealthRecord, error)`**：查询单日记录；不存在时返回 `nil, nil`。
* **`SaveOrMerge(userID int64, dto *model.SaveRecordDTO, sleepTag, activityTags string) (*model.HealthRecord, error)`**：
  * 记录不存在 → `INSERT`；
  * 记录已存在 → **增量合并更新**：数值/时间/文本字段"非空覆盖、空保留旧值"，`sleep_tag` 仅在提交了就寝时间时重算覆盖。
* **`GetRange(userID int64, startDate, endDate string) ([]*model.HealthRecord, error)`**：按日期升序取区间记录，供看板画图与 AI 上下文组装。
* **`GetAll(userID int64)`**：等价于 `GetRange(userID, "1970-01-01", "2099-12-31")`，用于全量导出。

上层 `internal/service/record_service.go` 负责在返回前用当前配置阈值**实时重算** `sleep_tag`。

### 3.4 睡前小结数据层（`internal/model/evening.go`、`internal/repository/evening_repo.go`）

* **实体**：`EveningSummary`（`record_date` 唯一、`done_items` 最多 3 条、`note_text`、`score` 1~10、`photo_id` 可空）与 `SaveEveningDTO`（入参校验：日期格式、评分区间、三件事条数上限）。
* **图片 MIME 校验**：服务端对上传字节做**魔数嗅探**，仅接受 jpeg / png / webp / gif；上传体积上限 9 MB（`http.MaxBytesReader`），响应经 `GET /api/v1/evening/photo/{id}` 回吐并携带正确 `Content-Type`。
* **引用一致性（严禁悬空引用）**：`DeleteByDate` 同步删除该日图片；`SavePhoto` 在事务内先删旧图、再插新图并回填 `photo_id`；`DeletePhoto` 删除图片记录并将引用它的 `photo_id` 置 `NULL`。

---

## 四、 前端页面与交互组件规范

文件落盘路径：**`web/static/index.html`**
交付约束：**原生 HTML5 + 原生 CSS3 + 原生 JavaScript（由 `web/embed.go` 的 `go:embed` 打包进单一二进制；开发模式可读磁盘），严禁引入未经构建的大体积外部框架**。

### 4.1 录入页核心表单（睡眠联动计算）

将原先的单输入框替换为双时间选择器与自动计算卡片（就寝 / 起床 / 自动时长 / 三色标签）：

```html
<div class="metric-card sleep-card">
  <div class="time-picker-row">
    <div class="picker-item">
      <label class="field-label">🌙 昨晚就寝</label>
      <input type="time" id="sleepBedTime" class="standard-time-input" value="00:30">
    </div>
    <div class="picker-item">
      <label class="field-label">☀️ 今晨起床</label>
      <input type="time" id="sleepWakeTime" class="standard-time-input" value="07:15">
    </div>
  </div>
  <div class="duration-result-row">
    <span class="calc-label">睡眠时长 (自动核算):</span>
    <div class="duration-input-wrapper">
      <input type="number" step="0.1" id="sleepDuration" class="duration-number-input">
      <span class="unit">小时</span>
    </div>
    <span id="sleepTagBadge" class="badge-green">未熬夜</span>
  </div>
</div>
```

```javascript
// 跨日时长计算 + 按当前配置阈值渲染三色标签
function handleSleepCalculation() {
  const bedTime = document.getElementById('sleepBedTime').value;
  const wakeTime = document.getElementById('sleepWakeTime').value;
  if (!bedTime || !wakeTime) return;

  const [bH, bM] = bedTime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);

  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;
  if (wakeMinutes <= bedMinutes) wakeMinutes += 1440; // 跨过午夜

  document.getElementById('sleepDuration').value = ((wakeMinutes - bedMinutes) / 60).toFixed(1);
  renderSleepTag(bedMinutes); // 阈值取自 /api/config 返回的 sleep_green_before / sleep_yellow_before
}
```

> ⚠️ 前端**不得硬编码** 24:00 / 01:00 阈值，须使用接口下发的 `sleep_green_before` / `sleep_yellow_before`，与后端 2.4 章的可配置规则保持一致。

### 4.2 高级生理与生物黑客追踪卡片（折叠交互）

在自由日记文本框下方，默认折叠、点击展开，**全部交互为点选胶囊与滑动条，15 秒内完成录入**。三大模块：**运动训练 / 专注达（Concerta）/ 冷水澡**。

```html
<div class="biohack-accordion">
  <div class="accordion-toggle" onclick="toggleBiohackPanel()">
    <span>🧬 高级生理与习惯打卡 (运动 / 专注达 / 冷水澡)</span>
    <span id="accordionIcon">▼</span>
  </div>

  <div id="biohackBody" class="accordion-body" style="display:none;">
    <!-- 1. 运动 -->
    <div class="tracker-block">
      <div class="block-title">🏋️ 运动训练</div>
      <div class="pill-group" id="exerciseTypePills">
        <button type="button" class="pill-btn active" data-val="none">无运动</button>
        <button type="button" class="pill-btn" data-val="cardio">有氧运动</button>
        <button type="button" class="pill-btn" data-val="strength">力量抗阻</button>
      </div>
      <div class="sub-row">
        <label>强度: </label>
        <div class="pill-group-sm" id="exerciseIntensityPills">
          <button type="button" class="pill-sm-btn active" data-val="light">轻松</button>
          <button type="button" class="pill-sm-btn" data-val="medium">中等</button>
          <button type="button" class="pill-sm-btn" data-val="failure">力竭/过载</button>
        </div>
      </div>
    </div>

    <!-- 2. 专注达 -->
    <div class="tracker-block">
      <div class="switch-row">
        <span class="block-title">💊 专注达服药追踪</span>
        <input type="checkbox" id="concertaEnabled" onchange="toggleConcerta(this.checked)">
      </div>
      <div id="concertaSubForm" style="display:none;">
        <div class="inline-inputs">
          <label>服药时间: <input type="time" id="concertaTime" value="08:00"></label>
          <label>剂量:
            <select id="concertaDose">
              <option value="18">18mg</option>
              <option value="36" selected>36mg</option>
              <option value="54">54mg</option>
            </select>
          </label>
        </div>
        <div class="slider-row">
          <span>深度工作启动力:</span>
          <input type="range" id="focusWork" min="1" max="5" value="4">
          <span id="focusWorkText">4分</span>
        </div>
        <div class="chip-selector">
          <span class="chip-label">副作用:</span>
          <span class="chip" data-key="appetite_loss" onclick="toggleChip(this)">食欲抑制</span>
          <span class="chip" data-key="thirst" onclick="toggleChip(this)">口干</span>
        </div>
        <div class="chip-selector">
          <span class="chip-label">晚间代偿:</span>
          <span class="chip chip-warn" data-key="monster_energy" onclick="toggleChip(this)">魔爪/高咖啡因</span>
          <span class="chip chip-warn" data-key="sugar_craving" onclick="toggleChip(this)">高糖暴食冲动</span>
        </div>
      </div>
    </div>

    <!-- 3. 冷水澡 -->
    <div class="tracker-block">
      <div class="switch-row">
        <span class="block-title">🚿 冷水澡刺激</span>
        <input type="checkbox" id="coldShowerEnabled" onchange="toggleColdShower(this.checked)">
      </div>
      <div id="coldShowerSubForm" style="display:none;">
        <div class="pill-group-sm" id="csTimingPills">
          <button type="button" class="pill-sm-btn active" data-val="morning">晨起即刻</button>
          <button type="button" class="pill-sm-btn" data-val="post_workout">训练后</button>
          <button type="button" class="pill-sm-btn" data-val="evening">睡前</button>
        </div>
        <div class="pill-group-sm" id="csFeelingPills">
          <button type="button" class="pill-sm-btn active" data-val="refreshed">🟢 神清气爽</button>
          <button type="button" class="pill-sm-btn" data-val="neutral">🟡 无明显感觉</button>
          <button type="button" class="pill-sm-btn" data-val="shivering">🔴 寒冷后轻微困倦感</button>
        </div>
        <!-- 预估体感水温：number 输入 (id=coldShowerWaterTemp，单位 ℃，0~40，可空)，随 cold_shower.water_temp 提交 -->
      </div>
    </div>
  </div>
</div>
```

---

### 4.3 睡前小结 Tab（第 4 个底部导航）

* **今日填写**：自评分滑块（1~10，实时联动分档文案徽章）、今日完成的三件事（最多 3 条，带序号圆点）、那一刻的感想、当日照片（`<input type="file">` 选取 → canvas 压缩 → 以图片原始二进制 POST，`Content-Type` 为图片类型；安卓端由 `MainActivity.onShowFileChooser` 走 SAF 选文件，Android 10+ 免存储权限）。
* **往期回顾**：`GET /api/v1/evening/summaries` 一次拉全量，**前端本地**做「日期（全部 / 近 7 天 / 近 30 天）× 评分（全部 / 9-10 / 7-8 / 5-6 / 1-4）」组合筛选与分批渲染（每批 10 条 + 「加载更多」）；卡片支持**左滑删除**（Pointer Events 统一触摸与鼠标，`touch-action: pan-y` 保证竖向滚动不受影响，`-42px` 吸附阈值，右侧露出红色删除按钮）。
* **小结洞察卡片**：深色独立卡片，手动生成 / 清除；「关联生理数据」窗口可在「近 7 天 / 近 30 天」间切换（默认近 7 天）；布局**思维链在上、正文在下**，正文未输出时思维链自动展开、正文一开始输出即自动收起（与「洞察」页行为一致）。
* **评分文案可配置**：5 个分档（1-2 / 3-4 / 5-6 / 7-8 / 9-10），每档含 `label` + `tone`；落 `config.yaml` 的 `summary.score_bands`（见 §8.1）。打分卡「⚙ 文案」按钮展开编辑器，改动即时联动打分徽章与往期列表的评分 chip。
* **破坏性操作红线**：删除一律走应用内确认弹窗 `#app-confirm-modal`（Promise 化 `appConfirm()`）与轻量提示条 `#app-toast`，**严禁使用原生 `confirm()` / `alert()`**——会打断 IDE 内嵌浏览器的宿主组件树，且安卓 WebView 下 `confirm()` 恒返回 `false`。

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

**业务错误码常量**：

| 常量               | 值      | 含义                           |
| :----------------- | :------ | :----------------------------- |
| `CodeSuccess`      | `200`   | 操作成功                       |
| `CodeParamError`   | `40001` | 请求参数非法                   |
| `CodeDateInvalid`  | `40002` | 日期格式错误（须 `YYYY-MM-DD`）|
| `CodeNotFound`     | `40401` | 未找到对应记录                 |
| `CodeDBError`      | `50001` | SQLite 读写或事务异常          |
| `CodeAIServiceErr` | `50201` | 上游大模型通信失败或超时       |

### 5.2 核心 RESTful 路由清单（`cmd/server/main.go`）

| 方式   | 路由路径                  | 说明                                   | 关键参数 / 载荷                                   |
| :----- | :------------------------ | :------------------------------------- | :------------------------------------------------ |
| `GET`  | `/api/v1/records/today`   | 获取今日已有记录，用于表单初始回显     | 无                                                |
| `POST` | `/api/v1/records`         | 新建或幂等合并单日数据                 | `SaveRecordDTO` 完整 JSON                         |
| `GET`  | `/api/v1/records/history` | 按日期区间拉取数据，供给看板图表       | `?start_date=2026-09-01&end_date=2026-09-28`      |
| `GET`  | `/api/v1/insights/stream` | **AI 深度洞察流式接口 (SSE)**          | `?days=7` / `?days=30`（缺省） / `?days=60`       |
| `GET`  | `/api/v1/insights`        | AI 洞察历史列表（游标分页）             | `?limit=10&before_id=<id>&range_days=7\|30\|60&q=<关键词>` |
| `GET`  | `/api/v1/insights/{id}`   | AI 洞察历史详情（含思维链原文）         | 路径参数 `id`                                     |
| `DELETE` | `/api/v1/insights/{id}` | 删除单条洞察存档                        | 路径参数 `id`                                     |
| `POST` | `/api/v1/insights/batch-delete` | 批量删除洞察存档（历史页管理模式）  | JSON Body `{"ids":[1,2,3]}`（服务端过滤非法值并去重） |
| `GET`  | `/api/v1/evening/summary` | 读取指定日期的睡前小结                 | `?date=YYYY-MM-DD`（缺省为今天）                  |
| `POST` | `/api/v1/evening/summary` | 新建或覆盖当日睡前小结                 | `{record_date, done_items[], note_text, score}`   |
| `GET`  | `/api/v1/evening/summaries` | 睡前小结全量列表（日期倒序）         | 无参数；返回 `{items, total}`，筛选与分页在前端完成 |
| `DELETE` | `/api/v1/evening/summary/{date}` | 删除某日睡前小结（连同其照片） | 路径参数 `date`                                   |
| `POST` | `/api/v1/evening/photo`   | 上传 / 替换小结照片（原始二进制）      | `?date=YYYY-MM-DD`；Body 为图片字节，`Content-Type` 为图片类型（≤9MB，魔数嗅探） |
| `GET`  | `/api/v1/evening/photo/{id}` | 读取小结照片（BLOB 回吐）           | 路径参数 `id`；响应带真实 `Content-Type`          |
| `DELETE` | `/api/v1/evening/photo/{id}` | 删除小结照片                       | 路径参数 `id`                                     |
| `GET`  | `/api/v1/evening/insight/stream` | **睡前小结洞察流式生成 (SSE)**  | `?date=YYYY-MM-DD&days=7\|30`（白名单，缺省 7）    |
| `GET`  | `/api/v1/evening/insight` | 读取某日已存档的小结洞察               | `?date=YYYY-MM-DD`                                |
| `DELETE` | `/api/v1/evening/insight` | 清除某日的小结洞察                    | `?date=YYYY-MM-DD`                                |
| `GET`  | `/api/v1/export`          | **导出 CSV（UTF-8 BOM，Excel/WPS 友好）** | `?range=7` / `?range=30` / 缺省为全部             |
| `GET`  | `/api/v1/export/json`     | 导出全量 JSON 备份                     | 无                                                |
| `GET`  | `/healthz`                | 服务健康检查探针                       | 返回 `{"status":"ok","time":...}`                 |
| `GET`  | `/api/config`             | 读取 AI 与熬夜阈值配置（API Key 脱敏） | 返回 `base_url`/`model`/`api_key_masked`/`sleep_*` |
| `POST` | `/api/config`             | 保存 AI 配置（原子写盘并即时生效）     | `{base_url, model, api_key?}`                     |
| `POST` | `/api/config/test`        | 测试 AI 连通性（走 `/models`，不落盘） | `{base_url, model, api_key?}`                     |
| `POST` | `/api/config/sleep`       | 保存熬夜三档阈值并即时生效             | `{green_before, yellow_before}`                   |

**导出文件命名规范**：`HealthTrack_export_<range>d_<yyyymmdd>.csv`，其中 `<range>` 为 `7` / `30` / `all`（默认全部）。

> 服务仅监听 `127.0.0.1`（回环），因为配置接口涉及敏感信息；Android WebView 与桌面浏览器均通过回环访问。

### 5.3 SSE (Server-Sent Events) 打字机协议规范

* **响应头**：

  ```http
  Content-Type: text/event-stream; charset=utf-8
  Cache-Control: no-cache
  Connection: keep-alive
  Access-Control-Allow-Origin: *
  ```

* **流式帧协议格式**（下列为早期 `AIService` 路径使用的自定义 `{delta, status}` 帧；当前线上洞察入口 `AIHandler` 系列为**透明转发上游原始 OpenAI 帧**，前端据 `choices[0].delta.content` 与 `delta.reasoning_content` 双通道分别渲染正文与思维链）：

  ```text
  data: {"delta":"根据您近30天的数据...","status":"streaming"}\n\n
  ```

  * `status = "done"`：传输完成（`delta` 为空串）；
  * `status = "error"`：异常中断，`delta` 内为可读错误信息。

---

## 六、 后端特征工程与 AI 模块实现

> ⚠️ **核心工程哲学**：
> **不要让大模型在长文本中做复杂的数值减法与统计！**
> Go 后端必须先行计算好夜间呼吸失水差（$\Delta W_{sleep}$）、日间体重变动差（$\Delta W_{day}$）、力量力竭训练标记等特征，再组装成清晰易读的上下文注入给模型。

### 6.1 特征工程：`internal/service/insight_service.go`

`InsightService.BuildPromptContext(records []*model.HealthRecord) string` 负责把记录数组压成两段式文本：

1. **【系统预计算：宏观生理与行为特征大盘】**：统计区间、有效记录天数、期间净体重变化、平均夜间失水（对比 0.4~0.9kg 基准）、力竭抗阻训练天数、专注达服药天数。
2. **【逐日微观多维流水】**：按日输出晨重（含日变化、睡前排水）、睡眠（时长 / 就寝 / 标签）、运动、药物、冷水澡（含预估体感水温）、饮食日记。

### 6.2 AI 流式实现：`internal/service/ai_service.go`

`AIService.StreamInsight(ctx, userID, startDate, endDate, w)` 的关键流程：

1. `repo.GetRange` 取区间记录；为空则直接回一句"暂无记录"并以 `done` 结束。
2. `calculateStats` 计算 `MacroStats`（宏观基线）。
3. `buildPrompt` 组装提示词：
   * **优先读取磁盘** `prompts/insight_v1.txt`；
   * **磁盘不可用时回退到内嵌模板**（`//go:embed default_prompt.txt`，经 `service.DefaultPrompt()` 暴露）。此兜底是解决 Android 端 APK 未打包 `prompts/` 目录导致模板读取失败的关键机制，**严禁删除**。
   * 通过占位符替换注入统计数据（见第七章）。
4. **未配置 API Key 时**：走 `streamDemoInsight` 本地演示分析（逐字流式输出，明确标注"本地演示分析"），而非报错。
5. **已配置时**：`callOpenAIStream` 请求 `{base_url}/chat/completions`，`temperature=0.7`、`stream=true`、超时 45s；逐行解析上游 `data:` 帧，抽取 `choices[0].delta.content` 后以本项目 `{delta,status}` 帧转发。

> `cmd/server/main.go` 中 `/api/v1/insights/stream` 与 `/api/v1/evening/insight/stream` 均由 `AIHandler` 直接实现（装载模板 → `proxyChat` 转发上游），**不经过 `AIService.StreamInsight`**；后者为早期实现（含无 Key 时的本地演示分析），保留 `buildPrompt` 与内嵌模板兜底能力。

### 6.3 睡前小结洞察流式实现（`internal/handler/ai_handler.go`）

`AIHandler.StreamEveningInsight(w, r)` 的关键流程：

1. **参数解析**：`date`（缺省为今天）与 `days`——**白名单 `{7, 30}`**，缺省 7。
2. **取小结**：`eveningRepo.GetByDate`；该日无小结则直接回一句提示并以 `done` 结束，不调用大模型、不落库。
3. **关联生理数据**：以**小结日期为终点向前回溯 `days - 1` 天**（起点 = `date - (days-1)`），`RecordService.GetHistoryRecords` 取区间记录后交 `InsightService.BuildPromptContext` 压成宏观特征 + 逐日流水文本。注意此处区间为"以小结日为终点的近 N 天"，与「洞察」页"以今天为终点的近 N 天"口径不同。
4. **双消息下发**：`system` = `eveningSystemInstruction`（在通用中文硬约束 `systemInstruction` 之上追加"侧重心理状态与成就感、生理数据仅作辅助佐证"的角色定位）；`user` = 模板固定指令段 + 动态数据块（小结日期 / 关联范围 / 自评 / 三件事 / 感想 / 生理上下文）。
5. **流结束落库**：以 `scope='evening'` + `record_date` **唯一**，落库前先 `DeleteByDateScope` 清理同日旧条，保证同一天只保留最新一条小结洞察（与「洞察」页"追加保留"策略不同）。
6. `proxyChat` 统一承担请求组装（`temperature=0.4`、`ai.max_tokens` 封顶、`ai.thinking` 开关）、SSE 透明转发与正文 / 思维链双缓冲累积。

### 6.4 运行时配置热更新（`internal/config/runtime.go`）

`config.RuntimeStore` 持有当前 `Config` 快照与 `-config` 解析后的绝对路径，提供 `Snapshot()` / `UpdateAI(...)` / `UpdateSleep(...)`：先原子写回配置文件，再更新内存快照，实现"保存即生效"，无需重启进程。AI 洞察每次请求开始时调用 `Snapshot()` 取最新配置。

---

## 七、 提示词模板契约

### 7.1 生理洞察模板（`prompts/insight_v1.txt`）

* **权威文件**：`prompts/insight_v1.txt`（桌面/源码环境优先读取）。
* **兜底文件**：`internal/service/default_prompt.txt`（通过 `go:embed` 编译进二进制，Android 等无 `prompts/` 目录环境使用）。
* **消息角色**：线上生成入口 `GET /api/v1/insights/stream`（`AIHandler.StreamInsight`）以 **`system` + `user` 双消息**下发：`system` 固定承载硬性约束（思维链与正文必须全程简体中文，常量 `systemInstruction`），`user` 承载提示词模板 + 预计算数据上下文。**思维链语言由 `system` 角色主导**——同类约束若只写在 `user` 消息里遵循度不稳定，会出现同一模板时而中文、时而英文思考。
* **占位符契约**（由 `AIService.buildPrompt` 替换，模板须包含以下 token）：

  | 占位符             | 含义                     |
  | :----------------- | :----------------------- |
  | `{{.StartDate}}`   | 统计起始日期             |
  | `{{.EndDate}}`     | 统计结束日期             |
  | `{{.TotalDays}}`   | 区间自然天数             |
  | `{{.ValidDays}}`   | 有效记录天数             |
  | `{{.StartWeight}}` | 期初体重                 |
  | `{{.EndWeight}}`   | 期末体重                 |
  | `{{.WeightDelta}}` | 期间净体重变化           |
  | `{{.GreenDays}}`   | 正常作息天数             |
  | `{{.YellowDays}}`  | 轻度熬夜天数             |
  | `{{.RedDays}}`     | 重度熬夜天数             |
  | `{{.WorkoutDays}}` | 运动打卡天数             |
  | `{{.DailyLogs}}`   | 逐日明细流水（多行文本） |

* **角色与分析铁律**：AI 扮演精通神经生物学、运动代谢与行为心理学的健康顾问，必须遵守：
  1. 严禁虚假的"卡路里精确加减法"，只识别**食品加工程度**与营养密度；
  2. 尊重生理规律粉碎减脂焦虑 —— 单日晨重突增 0.5~1.5kg 必先归因于**抗阻力竭训练水分潴留 / 高钠水肿 / 糖原结合水**，而非脂肪；
  3. 专注达药动学归因 —— 关注 17:30 后的多巴胺断崖期 (Crash) 与晚间高糖/咖啡因代偿；
  4. 区分相关性与因果性 —— 客观评估冷水澡对晨间唤醒与睡前交感激活的双面影响。
* **输出结构**：固定 4 段 Markdown（① 生理体重与代谢水滞留归因；② 饮食加工程度与 8:2 弹性评估；③ 神经调控、专注达效能与睡眠节律；④ 极低阻力行动指南，严格限制 3 条）。

### 7.2 睡前小结洞察模板（`prompts/evening_insight_v1.txt`）

* **权威文件**：`prompts/evening_insight_v1.txt`；**兜底文件**：`internal/service/default_evening_prompt.txt`（`//go:embed`，经 `service.DefaultEveningPrompt()` 暴露，供 Android 等无 `prompts/` 目录环境使用）。
* **装载时机**：`loadEveningPromptTemplate()` 在**每次请求**时读磁盘（读不到或内容为空则回退内嵌），因此桌面端调整措辞只需改 txt、**无需重新编译**；Android 端固定使用内嵌版，改文案必须重新打包。
* **组装方式**：`模板固定指令段 + "\n\n" + 动态数据块`（无占位符替换，这与 §7.1 的 `{{.Xxx}}` 契约不同）。
* **模板结构**（基础版，可后续迭代）：
  1. **【思考与推演硬性约束】**：思考过程必须全程简体中文（严禁英文自问自答或罗列英文小标题）、思考预算上限 300 字。**该段与 `system` 消息的中文约束必须同时存在**——只靠 `system` 不足以稳定约束思维链语言。
  2. **【角色与任务设定】**：温和务实的个人成长教练，输出侧重**心理状态与成就感**的洞察。
  3. **【分析原则】**：先理解后归因；成就感为主线且必须落到细节；生理数据仅作辅助佐证、不作医学诊断；只使用给定数据、信息不足须明说"数据不足"；总篇幅 ≤400 字。
  4. **【输出格式规范】**：固定 4 小节 —— 🌙 今日状态概览 / 🌟 成就感与心理归因 / ⚠️ 值得留意的信号 / 🌤️ 明日一件小事（仅 1 条低成本建议）。
* **与生理洞察的差异**：生理洞察以代谢归因与 NOVA 饮食评估为主；小结洞察以心理与成就感解读为主，生理数据退为佐证。两份模板**不共用**，各自独立迭代。

---

## 八、 工程构建、配置与交付规范

### 8.1 配置加载与运行参数（`internal/config/config.go`）

```go
type Config struct {
	ProjectRoot string         `yaml:"-"`
	Server      ServerConfig   `yaml:"server"`   // port, dev_mode
	Database    DatabaseConfig `yaml:"database"` // path, backup_dir
	AI          AIConfig       `yaml:"ai"`       // base_url, api_key, model, max_tokens, thinking
	Sleep       SleepConfig    `yaml:"sleep"`    // green_before, yellow_before
	Summary     SummaryConfig  `yaml:"summary"`  // score_bands：睡前小结评分文案分档
}

func LoadConfig(configPath, dataDir string) (*Config, error)
func ResolveConfigPath(configPath string) (string, error)
func FindProjectRoot() string
```

**关键行为**：

* **配置文件缺失时自动创建**安全模板（`DefaultConfigTemplate`，不含真实 Key，权限 `0600`），**绝不覆盖已有配置**。
* **启动参数**：`-config <路径>`（未指定时沿用项目根 `config.yaml`）、`-data-dir <目录>`（指定后数据库与备份强制放入该目录，Android 传入 `filesDir`）、`-port <端口>`（覆盖 `server.port`）。
* **环境变量覆盖**（容器/CI 场景）：`AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL` 优先级高于配置文件。
* **思维链长度封顶（`ai.max_tokens` / `ai.thinking`）**：推理模型的思考过程不受提示词中"500 字以内"约束（该约束写在 user 消息里，对原生 reasoning 通道无效），故改由请求参数硬性封顶。`ai.max_tokens` 为单次响应最大 token 数（含思维链+正文），`>0` 时注入请求体 `max_tokens`，`<=0` 表示不限制（交由服务端默认值）；`ai.thinking` 取 `enabled` / `disabled`，仅在这两个非空值时注入 `thinking: {"type": ...}`，留空则不传、保持服务端默认（即思维链默认开启）。二者均只影响请求参数，前端思维链展示不受影响。
* **路径解析**：未使用 `-data-dir` 时，`database.path` / `backup_dir` 的相对路径基于 `config.yaml` 所在目录；`FindProjectRoot` 依次尝试"当前目录 → 上一级 → 可执行文件所在目录（含 `bin/` 特判）"，杜绝"不同目录启动导致数据库路径裂脑"。
* **睡前小结评分文案（`summary.score_bands`）**：为 5 个分档模型，每档含 `range`（如 `"1-2"`）、`label`（文案）、`tone`（色点，取值受 `ValidScoreTones` 白名单约束）。配置缺失时回退 `DefaultScoreBands()`（很低落 / 有点钝 / 平平 / 还不错，稳住了节奏 / 满分的一天）。保存时校验各档区间首尾相接且覆盖 `1~10`，非法则返回 `400`。该配置经 `GET /api/config` 下发，前端打分徽章与往期列表评分 chip 即时联动（详见 §4.3）。
* **Android DNS 修复**：`main` 启动首行调用 `netutil.ConfigureResolver()`，必须在任何网络请求之前执行。

### 8.2 构建与发布（三种通道）

> ⚠️ v2.0.0 中记载的 `Makefile` 在真实工程中**并不存在**，以下为实际构建通道。

| 通道               | 触发方式                        | 产物                                       | 说明                                                                 |
| :----------------- | :------------------------------ | :----------------------------------------- | :------------------------------------------------------------------- |
| 桌面本地（钩子）   | `git commit` 成功后自动         | `bin/HealthTrack.exe`                      | 由 `.githooks/post-commit` 执行，`core.hooksPath=.githooks`；**不加 `-s -w`**（避免 Windows Defender 误报），编译失败不影响提交本身 |
| 手机 CI            | 推送触发 `.github/workflows/build-apk.yml` | `app-debug.apk`（含 `libhealthtrack.so`） | JDK 17 (temurin)、`VERSION_CODE=${{ github.run_number }}`、从 `secrets.ANDROID_KEYSTORE_BASE64` 还原 keystore、`CGO_ENABLED=0 GOOS=android GOARCH=arm64 go build -o jniLibs/arm64-v8a/libhealthtrack.so ./cmd/server` → `./gradlew assembleDebug` |
| 手机本地（免 CI）  | 手动运行 `scripts/build-android.ps1` | 本地签名 APK，可覆盖安装      | 脚本已加入 `.gitignore`（含本机签名口令）；自动重连无线 adb → `versionCode` 取手机已装版本 +1 → 交叉编译 `.so` → Gradle 打包 → `adb install -r` → 拉起 App。支持 `-SkipGoBuild` / `-VersionCode` / `-DeviceAddress` |

**Android 工程约束**：

* `AGP 8.5.2` + `Gradle 8.7`；`compileSdk/targetSdk 34`、`minSdk 26`；`sourceCompatibility/targetCompatibility = JavaVersion.VERSION_17`。
* `versionCode` 取自环境变量 `VERSION_CODE`：**CI 用 `github.run_number`，本地脚本用"手机已装版本 + 1"**（两者的基线差异见下方说明）。
* `packaging { jniLibs { useLegacyPackaging = true } }`（应对 Android 10+ `filesDir` noexec，需解压 JNI 库）。
* 本地与 CI **必须使用同一把签名密钥**（项目根 `healthtrack-release.jks`，alias `healthtrack`），否则无法覆盖安装、会清空手机数据。
* WebView 需注册 `DownloadListener` 与 JS 桥（`window.HealthTrack.openDownloads()`）才能处理导出文件下载，否则手机端点击导出无反应。
* 内嵌前端的 HTML 响应（`/` 与 `*.html`）统一加 `Cache-Control: no-cache, must-revalidate`（`noCacheHTML` 中间件）：否则浏览器 / Android WebView 会启发式缓存旧 `index.html`，导致覆盖安装后仍渲染上一版页面、新功能"看不见"。

**版本号基线差异说明（CI 与本地，已知问题，暂不修改）**：

* **两套计数器无共同基线**：CI 的 `github.run_number` 只随仓库 CI 运行次数递增，与代码提交无关；本地脚本取"手机已装 versionCode + 1"，随本地安装持续上爬。因此本地包通常领先 CI 包若干档，两者的 `versionCode` 天然对不上。
* **签名不受影响**：CI 与本地共用同一把固定密钥（项目根 `healthtrack-release.jks`，alias `healthtrack`），证书指纹一致，不会触发 `INSTALL_FAILED_UPDATE_INCOMPATIBLE`。
* **覆盖安装后果**：目标设备**从未装过** HealthTrack，或已装包的 `versionCode` **更低**时，CI 包可正常覆盖安装；若已装包 `versionCode` **更高**（例如你自己的开发机上装的本地包），则会报 `INSTALL_FAILED_VERSION_DOWNGRADE`。临时绕过用 `adb install -r -d`（允许降级）；**卸载会清空本地数据库，严禁使用**。
* **结论**：CI 包仍适用于**全新设备/他人设备安装**与**按提交归档**（文件名带日期与短哈希、随邮件与 artifact 分发），但不保证能覆盖你自己开发机上的更新包。
* **拟修复方案（方案 A，尚未实施）**：两端统一以仓库提交数 `git rev-list --count HEAD` 作为 `versionCode` 基线，本地脚本取 `max(已装 + 1, 提交数)`。同一提交在 CI 与本地算出的 `versionCode` 相同（相等允许覆盖安装），新提交自动 +1，跨端永远一致。前提：`main` 分支不重写历史（`reset`/`rebase` 会使提交数回退）。详见 §10.2 第 3 条。

### 8.3 统一 Git 忽略规则（`.gitignore`）

```gitignore
# 编译产物
/bin/
*.exe
*.dll
*.so
*.dylib

# 本地数据库与备份（严禁提交个人隐私）
/data/*.db
/data/*.db-journal
/data/*.db-wal
/data/*.db-shm
/data/backups/
!/data/.gitkeep
*.db
*.db-journal
*.db-wal
*.db-shm
backups/

# 敏感配置
config.yaml
.env
*.local.yaml

# 编辑器与系统缓存
.idea/
.vscode/
*.swp
*~
.DS_Store
Thumbs.db

# Android 签名与构建缓存
*.jks
*.keystore
.gradle/
android/.gradle/
android/build/
android/app/build/
android/local.properties
*.log

# 本地打包/安装脚本（含本机签名口令与绝对路径，严禁提交）
scripts/build-android.ps1
```

---

## 九、 Agent 实施约束与"不确定即暂停提问"熔断机制

任何读取本规范的 AI Agent 在落地实施本工程时，**必须无条件执行以下元准则**：

### 1. 唯一事实源原则 (Single Source of Truth)

* 表名、列名、目录架构以本规范（`v3.0.0 Reconciled`）为**最高也是唯一裁决标准**。
* 核心表名**为 `health_records`**；数据存放于 **`data/health.db`**（Android 为 App 私有 `filesDir`）；桌面构建输出为 **`bin/HealthTrack.exe`**；Android 输出为 `app-debug.apk`。
* SQLite 驱动**固定为 `modernc.org/sqlite`**，以维持 `CGO_ENABLED=0` 的跨平台/交叉编译能力。

### 2. 真实数据保护红线 (Data Protection)

* **严禁删除、清空、覆写 `data/` 目录！**
* 严禁执行任何 `DROP TABLE`、`TRUNCATE` 或破坏现有数据库已有列的操作。所有数据库升级**必须走 `ALTER TABLE ... ADD COLUMN`**。
* 手机端历史数据为用户手工录入的真实数据，任何安装/覆盖操作不得清空。
* **只允许覆盖安装，严禁卸载重装（在「批量导入」功能实现并双端验收通过之前）**：手机端一律通过 `adb install -r`（replace）覆盖安装，以保留 App 私有目录 `filesDir` 下的 `health.db`；严禁 `adb uninstall`、`pm clear`，或删除 / 移动构建产物后另行安装等任何会导致重装的动作。手机历史数据均由用户逐条手工录入，一旦清空无法恢复，只能全部重新录入。

### 3. 交付闭环标准（双端验收）

* 每个需求点实现完成后，须**先在本机验证**（电脑端 Web + 手机端 App）。
* 手机端验收优先使用本地打包脚本 `scripts/build-android.ps1`（免 CI、免发版消耗）完成"编译 → 打包 → 无线安装"。
* 双端测试通过并经用户确认后，方可执行 `git commit`，确保可及时回滚问题代码。
* **提交时效性（未启用 worktree 时）**：在未开启 `git worktree` 独立工作区的常规开发中，每完成一项新增或修复功能，**双端验证通过后必须立即执行一次 `git commit`**，严禁把多个功能点的改动积压在工作区；积压会使提交失去粒度，一旦出问题将无法单独回滚某一功能。

### 4. "不确定即暂停提问"熔断机制 (Stop & Ask)

遇到以下任一情况，**严禁自行脑补猜测或擅自执行危险操作，必须立即中断并向用户提问**：

1. 发现现有源码与本文档规范存在业务逻辑冲突，且代码注释中包含特定历史业务说明时；
2. 任何需要引入大体积前端框架（如 React/Vue/Tailwind 打包工具链）的场景；
3. 执行任何可能导致不可逆数据变动的 Git 重置或物理文件删除操作前。

---

## 十、 待办需求清单 (Backlog)

> 本章记录**已确认**的需求：标注 ✅ 者已实现并同步进正文，其余为待办；实现顺序由用户指定。

### 10.1 补增需求

**✅ ① 冷水澡记录增加「预估体感水温」字段（已实现）**
* **背景**：10 月初天气转凉、持续降雨，水温较夏季大幅下降，冷刺激显著增强（主观体验接近"短效专注达"）。
* **实现**：`ColdShowerDetail` 新增 `water_temp`（`*float64`，单位 ℃，可空，入参校验 `0~40`）；随 `cold_shower_json` 落库，无需新增数据库列。前端冷水澡子表单新增「水温(估)」输入，历史列表标签展示 `🚿 冷水澡 16℃`；`BuildPromptContext` 输出 `morning(16.0℃/2分钟/refreshed)`；提示词模板同步补充"水温 → 刺激强度 → 时长建议"分析指引。详见 §2.8 / §3.1 / §4.2。

**✅ ② AI 洞察历史存档 + 重复生成提醒（已实现）**
* **背景**：此前每次点击 AI 洞察都重新调用大模型，既浪费 token，又看不到历史生成的洞察内容。
* **实现（混合形态：A 入口 + C 页面）**：
  1. **历史存档**：新增 `ai_insights` 表（见 §3.2）。SSE 流正常结束且确有产出时，服务端自动落库，**同时保存正文 Markdown 与思维链（`reasoning_content`）原文**；客户端中途断开不落库，避免存入半截内容。
  2. **同天重复生成**：采用**追加保留**（不覆盖），每次生成均为新增一条存档，列表按时间倒序、同天多条可区分。
  3. **入口与页面**：洞察面板标题栏右侧「🕘 历史」按钮进入独立视图 `view-history`；页面含关键词搜索、档位筛选（全部/近7天/近30天/近60天）、历史列表与「加载更多」。
  4. **分页**：**游标分页**（`id DESC` + `before_id`），每批 **10 条**，不做页码翻页。
  5. **重复生成提醒（文字，按档位独立）**：进入洞察页或切换档位时，仅按**当前档位**判断今日是否已生成该档位洞察——若有则状态标签显示「今日已生成过（HH:mm）· 点击查看」、按钮文案改为「重新生成」；若该档位今日未生成过（即使其他档位已生成）则显示「点击上方按钮开始」与默认按钮文案。各档位（7/30/60）状态互不影响。生成完成后状态显示「复盘完成 · 已存档」。
* **详情**：点击列表项内联展开全文（含可折叠的「💭 思维链推导」区块）。
* **删除（管理模式）**：历史页头部「管理」按钮进入管理模式——条目左侧出现复选框，支持逐条勾选、全选/取消全选，底部浮出「删除所选 (n)」操作条并二次确认后调用 `POST /api/v1/insights/batch-delete`。移动端额外支持**长按条目**直接进入管理模式并选中该项；切换搜索/筛选会自动退出管理模式。展开区不再提供单条删除入口（避免可发现性差）。
* **说明**：按用户要求**不内置演示数据**，首次进入历史页为空态。

**✅ ③ 睡前小总结（已实现）**
* **背景**：在生理数据之外，补一层"心理与成就感"的自我复盘，帮助用户看见每天的进展。
* **实现**：新增底部第 4 个 Tab「睡前小结」（段落详见 §4.3），含今日填写（自评分滑块 / 完成的三件事 / 感想 / 照片）、往期回顾（日期 + 评分组合筛选、分页加载、左滑删除）与小结洞察卡片。数据层新增 `evening_summaries` / `evening_photos` 两表、`ai_insights` 增加 `scope` 列（见 §3.2 / §3.4），后端 `EveningHandler` 提供 summary / summaries / photo / insight 系列接口（见 §5.2）。小结洞察复用了「磁盘模板 → 内嵌兜底」的双轨提示词机制，但模板**侧重心理状态与成就感**、生理数据仅作辅助佐证（见 §7.2）；`system` 硬约束与模板顶部【思考与推演硬性约束】双重保证思维链为简体中文；前端思维链在上、正文在下，正文未输出时思维链自动展开、正文开始输出即自动收起。评分文案落 `config.yaml` 的 `summary.score_bands`，可自定义（见 §8.1）。提交：`ab7e1f1`。
* **待办**：手写签名尚未实现（见 10.2 第 4 条）。

**✅ ④ 看板交互与录入顺序（已实现）**
* **睡眠看板点击查看**：点击某天显示当日就寝 / 起床时间（数据后端已具备 `sleep_start_time` / `sleep_end_time`）。提交 `3e7e386`。
* **体重看板点击查看**：点击单日查看晨起体重 + 睡前体重，并展示夜间排水差值；顺带优化了移动端折线图节点触点命中不灵敏的问题。提交 `3e40383`。
* **腰围趋势**：未采用原计划的"体重 + 腰围双 Y 轴双折线"（对不同数据跨度用户不友好），改为**新增独立卡片「腰围变化趋势 (cm)」**，与体重卡片结构一致（紫色折线、点击查看当日腰围、缺值显示 `--`）。提交 `3e397a5`。
* **录入顺序**：记一笔顶部输入框顺序调整为「睡前体重 → 晨起空腹 → 腰围」（仅调整 DOM 顺序，相关 `id` 与取值逻辑未变）。提交 `3e7e386`。
* **通用基建**：为 `/` 与 `*.html` 增加 `Cache-Control: no-cache, must-revalidate`，避免覆盖安装后 WebView 复用旧页面（见 §8.2）。

### 10.2 历史遗留待办（尚未实现）

| # | 需求                                         | 涉及范围                       | 备注                                                     |
| :- | :------------------------------------------- | :----------------------------- | :------------------------------------------------------- |
| 1 | 运动训练允许"有氧 + 无氧"同时选择记录         | `ExerciseDetail` 结构 + 前后端 | 需将单值 `type` 扩展为多值（如 `types []string`）或并列记录，注意 JSON 兼容 |
| 2 | 批量导入历史数据功能                         | 后端导入接口 + 前端上传         | 用户有大量手工录入的历史数据需要一次性导入               |
| 3 | 统一 CI 与本地 `versionCode` 基线（方案 A：改用仓库提交数） | `.github/workflows/build-apk.yml` + `scripts/build-android.ps1` | 解决 CI 包落后于本地包、无法覆盖安装（`INSTALL_FAILED_VERSION_DOWNGRADE`）问题，详见 §8.2「版本号基线差异说明」 |
| 4 | 睡前小结支持手写签名                         | 前端画板 + 后端存储             | 用户已提出、**暂缓**；方案待研究（关联 §10.1 ✅③）        |

---

## 附录：版本控制与发布规范

1. **分支策略**：个人/小团队采用 Trunk-Based 开发，主线为 `main`。
2. **提交信息规范 (Semantic Commits)**，前缀统一使用英文小写 + 中文描述：
   * `feat:` 新增功能（如新增运动标签提取）
   * `fix:` 缺陷修复（如修复跨日睡眠归属问题）
   * `ui:` 界面与交互样式调整
   * `chore:` 构建 / 配置 / 依赖等杂项（如调整 `.gitignore`）
   * `docs:` 文档更新
3. **版本里程碑打 Tag**：
   * `v0.1.0-mvp`：基础录入 + SQLite 存储 + 历史看板
   * `v0.2.0-ai`：AI 接入 + SSE 流式洞察
   * `v1.0.0-release`：单二进制跨平台打包正式版
