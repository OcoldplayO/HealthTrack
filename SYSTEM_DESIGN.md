# HealthTrack 智能健康洞察追踪系统

## 统一系统设计与工程实施规范 (Unified System Architecture & Engineering Spec)

| 文档版本             | 状态                             | 适用角色                                    | 效力说明                                                  |
| :------------------- | :------------------------------- | :------------------------------------------ | :-------------------------------------------------------- |
| **v2.0.0 (Unified)** | **Approved & Frozen (最高权威)** | AI Agent (Antigravity / Codex) / 全栈工程师 | **项目全局唯一事实源 (SSOT)**，所有代码实现与重构以此为准 |

---

## 目录（全景索引）

* **【上篇】**
  * 1. [项目愿景、核心痛点与产品定位](#一-项目愿景核心痛点与产品定位)
  * 2. [核心业务逻辑与生理算法规范](#二-核心业务逻辑与生理算法规范)
  * 3. [数据模型与持久层规范 (对齐真实工程)](#三-数据模型与持久层规范)
  * 4. [前端页面与交互组件重构规范](#四-前端页面与交互组件重构规范)
* **【下篇】（待继续输出）**
  * 5. *API 契约、统一响应与 SSE 流式协议*
  * 6. *后端特征工程与 AI 模块实现*
  * 7. *工业级因果归因提示词模板 (`prompts/insight_v1.txt`)*
  * 8. *工程构建、智能寻根路径与交付规范*
  * 9. *Agent 实施约束与“不确定即暂停提问”熔断机制*

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

---

## 二、 核心业务逻辑与生理算法规范

### 2.1 核心生理指标与差值定义

* **晨起空腹体重 (`morning_weight`)**：清晨排便后空腹测量，单位 kg，保留 1 位小数。反映基础身体质量与长期脂肪/肌肉趋势。
* **睡前体重 (`evening_weight`)**：就寝前测量，单位 kg。
* **夜间呼吸排水差值 ($\Delta W_{sleep}$)**：
  $$\Delta W_{sleep} = \text{evening\_weight} - \text{morning\_weight}$$
  *健康基准*：正常人夜间呼吸蒸发与基础代谢排水通常在 **$0.4\text{kg} \sim 0.9\text{kg}$**。若 $<0.3\text{kg}$ 通常提示前一日高钠储水或晚间消化道充盈。
* **日间体重波动差值 ($\Delta W_{day}$)**：
  $$\Delta W_{day} = \text{morning\_weight}_{今日} - \text{morning\_weight}_{昨日}$$
* **腰围 (`waist`)**：单位 cm，保留 1 位小数。排除水分干扰，作为核心内脏脂肪趋势校验器。

### 2.2 跨日睡眠 04:00 截断法则 (Cutoff Rule)

* **截断边界**：以每日**凌晨 04:00** 为业务日切换界限。
* **归属判定**：凡入睡时间处于 `当日 18:00 ~ 次日 04:00` 之间的睡眠，其所有的生理指标（睡眠时长、就寝时间、睡眠评级）**一律归属于入睡前所处的业务日期**。

### 2.3 睡眠时长双时间点自动联动算法

前端废弃繁琐的人工心算时长输入，改为**输入就寝时间与起床时间自动推导**：

* 设就寝时间为 $T_{bed}$，起床时间为 $T_{wake}$（格式均为 `HH:mm`）。
* 将时间转换为当日累计分钟数：
  $$M_{bed} = H_{bed} \times 60 + m_{bed}, \quad M_{wake} = H_{wake} \times 60 + m_{wake}$$
* 跨日判定：若 $M_{wake} \le M_{bed}$，则说明跨越午夜，$M_{wake} = M_{wake} + 1440$。
* 时长计算：
  $$\text{Duration} = \frac{M_{wake} - M_{bed}}{60} \quad (\text{四舍五入保留 1 位小数})$$
* 系统自动回填计算值，但依然保留用户直接在输入框中手动覆盖修改的自由。

### 2.4 熬夜三色分级标准 (Sleep Tag)

根据就寝时间 $T_{bed}$ 自动计算标签：

* 🟢 **GREEN（规律/未熬夜）**：$T_{bed} \le \text{24:00 (00:00)}$
* 🟡 **YELLOW（轻度熬夜）**：$\text{24:00} < T_{bed} \le \text{01:00}$
* 🔴 **RED（重度熬夜）**：$T_{bed} > \text{01:00}$

### 2.5 饮食 NOVA 加工分级与 8:2 弹性评估

用户饮食记录为纯文本，允许包含粗略预估克重（允许 $\pm 30\%$ 误差），**坚决不推算微观卡路里**。系统与 AI 基于国际 NOVA 标准识别：

* 🟢 **绿灯项（原生/微加工食材，Clean Foods）**：纯肉、蛋、水产、原生米饭、土豆、燕麦、天然蔬果。
* 🟡 **黄灯项（常规烹饪加工品）**：带油盐炒菜、调味米粉、板栗、复合主食。
* 🔴 **红灯项（超加工食品 UPF / 精制糖油混合物 / 高钠）**：月饼、含糖饮料（可乐）、糕点、深加工膨化、极高钠霉豆腐。
* **8:2 弹性维持原则**：若周期内绿灯原生食材摄入频次与体积占比达到 **$70\% \sim 80\%$**，红灯安慰性食物维持在 **$20\% \sim 30\%$**，系统判定为健康度优秀且可持续，消除断糖心理焦虑。

### 2.6 运动分类与次日肌肉水肿归因机制

* **极简运动量化**：
  * 类型：`none` (无), `cardio` (有氧), `strength` (抗阻/力量)
  * 强度（主观疲劳度 RPE）：`light` (轻松), `medium` (中等), `failure` (力竭/高负荷)
  * 时长：分钟数（如 40）
* **水肿归因锚点**：
  抗阻力量训练（尤其包含力竭大肌群训练如腿部）会引发肌纤维微损伤与急性充血修复，导致**皮质醇脉冲与炎症性水分潴留 (Water Retention)**。若次日 $\Delta W_{day}$ 暴增 $0.5 \sim 1.5\text{kg}$，系统与 AI 必须优先解释为肌肉修复储水，严禁误判为脂肪增长。

### 2.7 专注达 (Concerta) 多维药效与晚间断崖代偿

* **药动学特征**：OROS 渗透泵胶囊释放曲线维持约 10~12 小时（如 08:00 服药，17:30 药效衰退）。
* **五维自评打卡（1~5 分）**：
  1. `focus_work`：深度工作与执行力（是否克服启动拖延、沉浸编程）；
  2. `focus_study`：长文本/论文阅读工作记忆；
  3. `daily_tasks`：低多巴胺琐事耐受度（洗衣服、收桌子）；
  4. `social`：情绪平稳与倾听耐心；
  5. `gaming`：竞技反应速度与抗挫败心态。
* **晚间断崖代偿追踪**：药效消退后多巴胺受体骤降易引发 Crash，表现为极度疲劳与神经代偿。系统追踪用户是否使用 `[魔爪/咖啡因]` 续航，或诱发 `[高糖高脂暴食冲动]`（解释晚餐月饼/可乐的生理根源）。

### 2.8 冷水澡神经激活与昼夜节律影响

* **记录维度**：
  * 时段：`morning` (晨起), `post_workout` (训练后), `evening` (睡前)
  * 时长：分钟数（1~5m）
  * 即刻体感：`refreshed` (神经清爽唤醒), `neutral` (无感), `shivering` (发抖/回温困难)
* **关联分析**：
  晨起冷水澡促发去甲肾上腺素与多巴胺平缓释放，缩短专注达起效潜伏期；睡前冷水澡激活交感神经，关联分析其对入睡潜伏期及深睡时长的负面干扰。

---

## 三、 数据模型与持久层规范

> ⚠️ **强制声明**：真实工程中，核心数据表名**唯一确定为 `records`**（严禁新建或更名为 `health_records`）！持久层统一由 `internal/repository/db.go` 与 `internal/repository/record_repo.go` 实现，严禁新建 `migration/` 包！

### 3.1 实体模型定义 (`internal/model/record.go`)

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
	Enabled  bool   `json:"enabled"`  // 是否打卡
	Timing   string `json:"timing"`   // morning, post_workout, evening
	Duration int    `json:"duration"` // 时长 (分钟)
	Feeling  string `json:"feeling"`  // refreshed, neutral, shivering
}

// ConcertaDetail 专注达服药与多维效能记录
type ConcertaDetail struct {
	Taken          bool     `json:"taken"`           // 今日是否服药
	Time           string   `json:"time"`            // 服药时间点 (HH:mm)
	Dose           int      `json:"dose"`            // 剂量 (18, 36, 54)
	FocusWork      int      `json:"focus_work"`      // 工作启动力与心流 (1-5)
	FocusStudy     int      `json:"focus_study"`     // 阅读与工作记忆 (1-5)
	DailyTasks     int      `json:"daily_tasks"`     // 琐事耐受度 (1-5)
	SocialPatience int      `json:"social"`          // 社交情绪平稳度 (1-5)
	GamingReaction int      `json:"gaming"`          // 竞技反应度 (1-5)
	CrashTime      string   `json:"crash_time"`      // 断崖疲劳点 (HH:mm)
	SideEffects    []string `json:"side_effects"`    // ["appetite_loss", "thirst", "palpitation"]
	Compensations  []string `json:"compensations"`   // ["monster_energy", "sugar_craving"]
}

// Record 核心健康记录实体（对齐 SQLite 唯一 records 表）
type Record struct {
	ID            int64   `json:"id"`
	Date          string  `json:"date"`           // 业务日期 YYYY-MM-DD
	MorningWeight float64 `json:"morning_weight"` // 晨起空腹体重 (kg)
	EveningWeight float64 `json:"evening_weight"` // 睡前体重 (kg)
	Waist         float64 `json:"waist"`          // 腰围 (cm)

	// 睡眠升级字段
	SleepBedTime  string  `json:"sleep_bed_time"` // 昨晚就寝时间 (HH:mm)
	SleepWakeTime string  `json:"sleep_wake_time"`// 今晨起床时间 (HH:mm)
	SleepDuration float64 `json:"sleep_duration"` // 睡眠总时长 (h)
	SleepTag      string  `json:"sleep_tag"`      // GREEN, YELLOW, RED

	// 饮食日记 (自由文本)
	DietDiary     string  `json:"diet_diary"`

	// 生理与生物黑客结构化对象 (落盘为 TEXT JSON)
	Exercise      *ExerciseDetail   `json:"exercise"`
	ColdShower    *ColdShowerDetail `json:"cold_shower"`
	Concerta      *ConcertaDetail   `json:"concerta"`

	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
```

### 3.2 数据库连接与平滑升级 (`internal/repository/db.go`)

系统初始化时，自动执行幂等的列升级操作，**严禁使用可能会破坏现有 32KB 数据库的 DROP 或 TRUNCATE 语句**：

```go
package repository

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

type Repository struct {
	DB *sql.DB
}

// AutoMigrate 确保数据库表结构平滑演进
func (r *Repository) AutoMigrate() error {
	// 1. 确保基础表 records 存在
	baseTableSQL := `
	CREATE TABLE IF NOT EXISTS records (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		date TEXT NOT NULL UNIQUE,
		morning_weight REAL DEFAULT 0,
		evening_weight REAL DEFAULT 0,
		waist REAL DEFAULT 0,
		sleep_duration REAL DEFAULT 0,
		sleep_tag TEXT DEFAULT 'GREEN',
		diet_diary TEXT DEFAULT '',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
	`
	if _, err := r.DB.Exec(baseTableSQL); err != nil {
		return err
	}

	// 2. 平滑增量扩展字段 (忽略已存在列错误)
	alterStatements := []string{
		`ALTER TABLE records ADD COLUMN sleep_bed_time TEXT DEFAULT '';`,
		`ALTER TABLE records ADD COLUMN sleep_wake_time TEXT DEFAULT '';`,
		`ALTER TABLE records ADD COLUMN exercise_json TEXT DEFAULT '{}';`,
		`ALTER TABLE records ADD COLUMN cold_shower_json TEXT DEFAULT '{}';`,
		`ALTER TABLE records ADD COLUMN concerta_json TEXT DEFAULT '{}';`,
	}

	for _, stmt := range alterStatements {
		_, _ = r.DB.Exec(stmt)
	}
	return nil
}
```

### 3.3 数据访问层交互契约 (`internal/repository/record_repo.go`)

* **`UpsertRecord(ctx context.Context, record *model.Record) error`**：
  采用 SQLite 的 `INSERT INTO records ... ON CONFLICT(date) DO UPDATE SET ...` 原生语法，执行数值非空覆盖、文本回显追加合并。
* **`GetByDate(ctx context.Context, date string) (*model.Record, error)`**：获取指定日期的完整记录。
* **`GetRecentRecords(ctx context.Context, days int) ([]model.Record, error)`**：按日期正序提取近 $N$ 天的全部连续记录，供看板画图与 AI 上下文组装。

---

## 四、 前端页面与交互组件重构规范

文件落盘路径：**`web/static/index.html`**  
交付约束：**原生 HTML5 + 原生 CSS3 + 原生 JavaScript（由 `web/embed.go` 打包进单一二进制可执行文件，严禁引入未经构建的大体积外部框架）**。

### 4.1 录入页核心表单升级（睡眠联动计算）

将原先的单输入框替换为双时间选择器与自动计算卡片：

```html
<!-- 睡眠就寝与起床联动计算组件 -->
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
// 跨日计算与三色熬夜标签自动计算逻辑
function handleSleepCalculation() {
  const bedTime = document.getElementById('sleepBedTime').value;
  const wakeTime = document.getElementById('sleepWakeTime').value;
  if (!bedTime || !wakeTime) return;

  const [bH, bM] = bedTime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);

  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 1440; // 跨过午夜
  }

  const hours = ((wakeMinutes - bedMinutes) / 60).toFixed(1);
  document.getElementById('sleepDuration').value = hours;

  // 熬夜分级评定
  const badge = document.getElementById('sleepTagBadge');
  if (bH >= 18 || bH === 0) {
    badge.className = 'badge-green';
    badge.innerText = '🟢 未熬夜';
  } else if (bH === 1 && bM === 0) {
    badge.className = 'badge-yellow';
    badge.innerText = '🟡 轻度熬夜';
  } else {
    badge.className = 'badge-red';
    badge.innerText = '🔴 重度熬夜';
  }
}
```

### 4.2 高级生理与生物黑客追踪卡片（折叠交互）

在自由日记文本框下方，默认折叠，点击展开，**全部交互为点选胶囊与滑动条，15 秒内完成录入**：

```html
<div class="biohack-accordion">
  <div class="accordion-toggle" onclick="toggleBiohackPanel()">
    <span>🧬 高级生理与习惯打卡 (运动 / 专注达 / 冷水澡)</span>
    <span id="accordionIcon">▼</span>
  </div>
  
  <div id="biohackBody" class="accordion-body" style="display: none;">
    <!-- 1. 运动模块 -->
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

    <!-- 2. 专注达 (Concerta) 模块 -->
    <div class="tracker-block">
      <div class="switch-row">
        <span class="block-title">💊 专注达服药追踪</span>
        <input type="checkbox" id="concertaEnabled" onchange="toggleConcerta(this.checked)">
      </div>
      <div id="concertaSubForm" style="display: none;">
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
          <input type="range" id="focusWork" min="1" max="5" value="4" oninput="document.getElementById('focusWorkText').innerText = this.value + '分'">
          <span id="focusWorkText">4分</span>
        </div>
        <div class="chip-selector">
          <span class="chip-label">副作用:</span>
          <span class="chip" data-key="appetite_loss" onclick="toggleChip(this)">食欲抑制</span>
          <span class="chip" data-key="thirst" onclick="toggleChip(this)">口干</span>
          <span class="chip" data-key="crash" onclick="toggleChip(this)">晚间疲劳Crash</span>
        </div>
        <div class="chip-selector">
          <span class="chip-label">晚间代偿:</span>
          <span class="chip chip-warn" data-key="monster_energy" onclick="toggleChip(this)">魔爪/高咖啡因</span>
          <span class="chip chip-warn" data-key="sugar_craving" onclick="toggleChip(this)">高糖暴食冲动</span>
        </div>
      </div>
    </div>

    <!-- 3. 冷水澡模块 -->
    <div class="tracker-block">
      <div class="switch-row">
        <span class="block-title">🚿 冷水澡刺激</span>
        <input type="checkbox" id="coldShowerEnabled" onchange="toggleColdShower(this.checked)">
      </div>
      <div id="coldShowerSubForm" style="display: none;">
        <div class="pill-group-sm" id="csTimingPills">
          <button type="button" class="pill-sm-btn active" data-val="morning">晨起即刻</button>
          <button type="button" class="pill-sm-btn" data-val="post_workout">训练后</button>
          <button type="button" class="pill-sm-btn" data-val="evening">睡前</button>
        </div>
        <div class="pill-group-sm" id="csFeelingPills">
          <button type="button" class="pill-sm-btn active" data-val="refreshed">🟢 神清气爽 </button>
          <button type="button" class="pill-sm-btn" data-val="neutral">🟡 无明显感觉</button>
          <button type="button" class="pill-sm-btn" data-val="shivering">🔴 寒冷后轻微困倦感 </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 

以下是**【下篇】（第 5 ~ 9 模块：API 契约与 SSE 协议、后端特征工程、AI 提示词模板、智能寻径构建规范与 Agent 熔断约束）**。

与【上篇】合并后，整套文档即构成 HealthTrack 项目全局唯一的权威工程规范。

---

## 五、 API 契约、统一响应与 SSE 流式协议

### 5.1 统一 JSON 响应信封 (`internal/model/response.go`)

除 SSE 长连接与健康探针外，所有 RESTful 接口统一以以下结构返回：

```json
{
  "code": 200,             // 业务状态码 (200 表示成功)
  "message": "success",    // 文本提示
  "data": {},              // 业务数据载荷
  "timestamp": 1790611200  // 当前秒级 Unix 时间戳
}
```

#### 业务错误码定义：

* `200`：操作成功
* `40001`：请求参数非法（如数值越界、格式不合规）
* `40002`：日期格式错误（必须为 `YYYY-MM-DD`）
* `40401`：未找到对应日期的记录
* `50001`：SQLite 数据库读写或事务异常
* `50201`：上游大模型接口通信失败或网络超时

---

### 5.2 核心 RESTful 路由清单

| 请求方式 | 路由路径                  | 说明                               | 关键参数 / 载荷                              |
| :------- | :------------------------ | :--------------------------------- | :------------------------------------------- |
| `GET`    | `/api/v1/records/today`   | 获取今日已有记录，用于表单初始回显 | 无                                           |
| `POST`   | `/api/v1/records`         | 新建或幂等合并单日数据             | `Record` 完整 JSON 结构体                    |
| `GET`    | `/api/v1/records/history` | 按日期区间拉取数据，供给看板图表   | `?start_date=2026-09-01&end_date=2026-09-28` |
| `GET`    | `/api/v1/insights/stream` | **AI 深度洞察流式接口 (SSE)**      | `?days=30`（支持 7、30、60，默认 30）        |
| `GET`    | `/api/v1/export`          | 备份导出全量数据                   | 返回 `healthtrack_export.json` 文件下载      |
| `GET`    | `/healthz`                | 服务健康检查探针                   | 返回 `{"status":"ok"}`                       |

---

### 5.3 SSE (Server-Sent Events) 打字机协议规范

* **响应头设置**：

  ```http
  Content-Type: text/event-stream; charset=utf-8
  Cache-Control: no-cache
  Connection: keep-alive
  X-Accel-Buffering: no
  ```

* **流式帧协议格式**：

  * **传输中（数据块）**：透明透传标准 OpenAI SSE 数据帧：

    ```text
    data: {"choices":[{"delta":{"content":"根据您近30天的数据分析..."}}]}\n\n
    ```

  * **传输完成**：

    ```text
    data: [DONE]\n\n
    ```

  * **异常中断**：

    ```text
    data: {"error":"上游模型响应超时或网络异常，请重试"}\n\n
    ```

---

## 六、 后端特征工程与 AI 模块实现

> ⚠️ **核心工程哲学**：  
> **不要让大模型在长文本中做复杂的数值减法与统计！**  
> Go 后端必须先行计算好夜间呼吸失水差（$\Delta W_{sleep}$）、日间体重变动差（$\Delta W_{day}$）、力量力竭训练标记和饮食红绿灯特征，打包成清晰易读的上下文注入给模型。

### 6.1 特征工程实现：`internal/service/insight_service.go`

```go
package service

import (
	"context"
	"fmt"
	"strings"
	"HealthTrack/internal/model"
	"HealthTrack/internal/repository"
)

type InsightService struct {
	repo *repository.Repository
}

func NewInsightService(repo *repository.Repository) *InsightService {
	return &InsightService{repo: repo}
}

// BuildMacroAndMicroPrompt 组装“宏观生理特征 + 微观流水”提示词上下文
func (s *InsightService) BuildPromptContext(records []model.Record) string {
	if len(records) == 0 {
		return "暂无有效历史记录。"
	}

	var sb strings.Builder
	sb.WriteString("【系统预计算：宏观生理与行为特征大盘】\n")

	validCount := 0
	totalSleepLoss := 0.0
	sleepLossCount := 0
	heavyWorkoutDays := 0
	concertaDays := 0

	for _, r := range records {
		if r.MorningWeight > 0 {
			validCount++
		}
		if r.EveningWeight > 0 && r.MorningWeight > 0 {
			loss := r.EveningWeight - r.MorningWeight
			if loss > 0 && loss < 2.0 {
				totalSleepLoss += loss
				sleepLossCount++
			}
		}
		if r.Exercise != nil && r.Exercise.Intensity == "failure" {
			heavyWorkoutDays++
		}
		if r.Concerta != nil && r.Concerta.Taken {
			concertaDays++
		}
	}

	avgSleepLoss := 0.0
	if sleepLossCount > 0 {
		avgSleepLoss = totalSleepLoss / float64(sleepLossCount)
	}

	startRec := records[0]
	endRec := records[len(records)-1]
	weightNetDelta := endRec.MorningWeight - startRec.MorningWeight

	sb.WriteString(fmt.Sprintf("- 统计区间: %s 至 %s (跨度 %d 天, 有效记录 %d 天)\n", 
		startRec.Date, endRec.Date, len(records), validCount))
	sb.WriteString(fmt.Sprintf("- 期间净体重变化: %+.1f kg (起始: %.1f kg -> 结束: %.1f kg)\n", 
		weightNetDelta, startRec.MorningWeight, endRec.MorningWeight))
	sb.WriteString(fmt.Sprintf("- 平均夜间排汗排毒失水 (睡前 - 今晨): %.2f kg (正常基准: 0.4~0.9 kg)\n", avgSleepLoss))
	sb.WriteString(fmt.Sprintf("- 高负荷/力竭抗阻训练天数: %d 天 | 专注达服药天数: %d 天\n\n", heavyWorkoutDays, concertaDays))

	sb.WriteString("【逐日微观多维流水（已对齐生理差值）】\n")
	for i, r := range records {
		// 计算单日夜间排水
		sleepLossText := "无数据"
		if r.EveningWeight > 0 && r.MorningWeight > 0 {
			sleepLossText = fmt.Sprintf("%.1fkg", r.EveningWeight-r.MorningWeight)
		}

		// 计算相对前一日的晨重涨跌
		dailyDiffText := "持平"
		if i > 0 && records[i-1].MorningWeight > 0 && r.MorningWeight > 0 {
			diff := r.MorningWeight - records[i-1].MorningWeight
			dailyDiffText = fmt.Sprintf("%+.1fkg", diff)
		}

		// 格式化运动明细
		exText := "无运动"
		if r.Exercise != nil && r.Exercise.Type != "none" {
			exText = fmt.Sprintf("%s(%s/%d分钟)", r.Exercise.Type, r.Exercise.Intensity, r.Exercise.Duration)
		}

		// 格式化专注达明细
		medText := "未服药"
		if r.Concerta != nil && r.Concerta.Taken {
			medText = fmt.Sprintf("服药%dmg(时间%s, 启动力%d分, 副作用:[%s], 晚间代偿:[%s])",
				r.Concerta.Dose, r.Concerta.Time, r.Concerta.FocusWork,
				strings.Join(r.Concerta.SideEffects, ","),
				strings.Join(r.Concerta.Compensations, ","))
		}

		// 格式化冷水澡明细
		csText := "无冷水澡"
		if r.ColdShower != nil && r.ColdShower.Enabled {
			csText = fmt.Sprintf("%s(%d分钟/%s)", r.ColdShower.Timing, r.ColdShower.Duration, r.ColdShower.Feeling)
		}

		sb.WriteString(fmt.Sprintf(
			"[%s] 晨重:%.1fkg(日变化:%s, 睡前排水:%s) | 睡眠:%.1fh(就寝:%s, %s) | 运动:%s | 药物:%s | 冷水澡:%s | 饮食日记: %s\n",
			r.Date, r.MorningWeight, dailyDiffText, sleepLossText,
			r.SleepDuration, r.SleepBedTime, r.SleepTag,
			exText, medText, csText, r.DietDiary,
		))
	}

	return sb.String()
}
```

---

### 6.2 SSE 控制器实现：`internal/handler/ai_handler.go`

```go
package handler

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"HealthTrack/internal/config"
	"HealthTrack/internal/service"
)

type AIHandler struct {
	cfg     *config.Config
	insight *service.InsightService
	repoSvc *service.RecordService
}

func NewAIHandler(cfg *config.Config, insight *service.InsightService, repoSvc *service.RecordService) *AIHandler {
	return &AIHandler{cfg: cfg, insight: insight, repoSvc: repoSvc}
}

func (h *AIHandler) StreamInsight(w http.ResponseWriter, r *http.Request) {
	// 1. 设置标准 SSE 响应头
	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// 2. 解析分析天数 (默认 30 天)
	days := 30
	if daysStr := r.URL.Query().Get("days"); daysStr != "" {
		if d, err := strconv.Atoi(daysStr); err == nil && d > 0 && d <= 60 {
			days = d
		}
	}

	records, err := h.repoSvc.GetRecentRecords(r.Context(), days)
	if err != nil || len(records) == 0 {
		fmt.Fprintf(w, "data: {\"choices\":[{\"delta\":{\"content\":\"暂未检索到足够的历史健康数据，请先在【记一笔】中打卡后再生成洞察。\"}}]}\n\n")
		fmt.Fprintf(w, "data: [DONE]\n\n")
		flusher.Flush()
		return
	}

	// 3. 构建预计算特征上下文
	dataContext := h.insight.BuildPromptContext(records)

	// 4. 读取提示词模板 prompts/insight_v1.txt
	promptPath := filepath.Join(h.cfg.ProjectRoot, "prompts", "insight_v1.txt")
	promptTpl, err := os.ReadFile(promptPath)
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"未能读取 prompts/insight_v1.txt 提示词模板\"}\n\n")
		flusher.Flush()
		return
	}

	fullUserContent := fmt.Sprintf("%s\n\n%s", string(promptTpl), dataContext)

	// 5. 组装请求 Payload (完全兼容 OpenAI 协议规范)
	requestBody := map[string]interface{}{
		"model":       h.cfg.AI.Model,
		"stream":      true,
		"temperature": 0.4,
		"messages": []map[string]string{
			{"role": "user", "content": fullUserContent},
		},
	}
	jsonPayload, _ := json.Marshal(requestBody)

	// 统一在 BaseURL 后拼接 /chat/completions
	reqURL := strings.TrimRight(h.cfg.AI.BaseURL, "/") + "/chat/completions"
	req, err := http.NewRequestWithContext(r.Context(), "POST", reqURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"创建 AI 请求失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}

	req.Header.Set("Authorization", "Bearer "+h.cfg.AI.APIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 90 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Fprintf(w, "data: {\"error\":\"上游大模型通信失败: %s\"}\n\n", err.Error())
		flusher.Flush()
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		fmt.Fprintf(w, "data: {\"error\":\"上游大模型拒绝响应 (状态码 %d): %s\"}\n\n", resp.StatusCode, string(bodyBytes))
		flusher.Flush()
		return
	}

	// 6. 逐行透明转发 SSE 流
	reader := bufio.NewReader(resp.Body)
	for {
		line, err := reader.ReadBytes('\n')
		if err != nil {
			if err == io.EOF {
				break
			}
			return
		}
		w.Write(line)
		flusher.Flush()
	}
}
```

---

## 七、 工业级因果归因提示词模板 (`prompts/insight_v1.txt`)

将以下内容完整保存于 **`prompts/insight_v1.txt`**：

```text
你是一位深谙神经生物学、运动代谢机制与行为心理学的高级个人健康顾问（分析风格严谨、客观、注重科学因果归因，融合 Andrew Huberman 的神经调控理论与运动营养学实践）。
你的核心任务是根据系统预先计算好的多维生理数据流水，输出一份洞察深刻、直击痛点且极具行动指引价值的 Markdown 格式深度复盘报告。

【分析铁律（严禁违反）】
1. 绝对严禁进行虚假的“卡路里精确加减法”。用户提供的食物克重为粗略估算值（允许 ±30% 偏差）。你的核心职责是识别【食品加工程度】与【营养素密度】，而非微观算热量。
2. 尊重真实生理规律，粉碎虚假减脂焦虑：
   - 增加 1kg 纯脂肪在物理上需要约 7700 kcal 的净热量盈余。单日晨重突增 0.5~1.5kg 在生理上绝对不可能是纯脂肪！
   - 遇到体重骤增，必须结合前一日流水精准归因：
     a) 抗阻力竭训练（特别是腿部/大肌群）引发的肌纤维急性微创伤与皮质醇炎症性水分滞留 (Water Retention)；
     b) 高钠摄入（如霉豆腐、外卖重酱料）导致的细胞外液高渗透压水肿；
     c) 精制碳水化合物（月饼、含糖饮料、米粉）超额转化肌糖原时绑定的水分（1g 糖原天然结合 3~4g 水）。
3. 专注达 (Concerta) 药物动力学归因：
   - OROS 渗透泵胶囊药效通常维持 10~12 小时。重点关注 17:30 后的多巴胺断崖期 (Crash)。
   - 剖析晚餐对高糖、高碳水（可乐、甜食）的渴望或魔爪饮料代偿，是否属于多巴胺骤降后的中枢神经自我补偿，消除自控力自责。
4. 区分“相关性”与“因果性”：客观评估冷水澡对晨间多巴胺的唤醒作用，及其若在睡前进行对深度睡眠可能造成的交感神经激活干扰。

---

【输出报告格式规范】
请严格按照以下 4 个 Markdown 章节组织输出，语言干练，条理清晰，多用数据佐证：

### 🧬 一、 生理体重与代谢水滞留归因
- 评估期间平均夜间排汗排毒失水（睡前重 - 今晨重）是否处于正常基准（0.4~0.9kg）。
- 针对体重峰值与大幅反弹日，结合前一日的力竭力量训练与高钠/精制碳水流水，明确指出是水分滞留还是生理代偿，消除身材焦虑。

### 🥗 二、 饮食加工程度与 8:2 弹性评估
- 依据国际 NOVA 分类法，快速梳理用户饮食中的【绿灯原生食材】（纯肉、蛋、原生饭、果蔬）与【红灯超加工/高糖项】（月饼、含糖可乐、霉豆腐）。
- 评估全周期饮食是否达到健康的 8:2 或 7:3 弹性平衡，评价其长期可持续性。

### 💊 三、 神经调控、专注达效能与睡眠节律
- 评估服药日的工作启动力与深度工作状态。
- 深入剖析晚间断崖期（Crash）的疲劳表现与代偿手段（魔爪/高糖），评估服药时间是否延误了就寝点。
- 结合冷水澡打卡数据，评价其在晨起神经唤醒或晚间睡眠中的实际表现。

### 🎯 四、 极低阻力行动指南（严格限制 3 条）
- 给出 3 条执行成本极低、对生活侵入极小的微调建议（例如：高强度腿训后增加水分摄入以助排水、在药效衰退前 1 小时提前补充优质电解质减少对魔爪依赖、调整晚间高钠食物摄入时机等）。
```

---

## 八、 工程构建、智能寻根路径与交付规范

### 8.1 智能寻根算法：`internal/config/config.go`

为杜绝“在不同目录下执行导致数据库路径裂脑”，系统启动时必须通过以下逻辑**动态锁定项目物理根目录**：

```go
package config

import (
	"os"
	"path/filepath"
	"gopkg.in/yaml.v3"
)

type Config struct {
	ProjectRoot string `yaml:"-"`
	Server struct {
		Port    int  `yaml:"port"`
		DevMode bool `yaml:"dev_mode"`
	} `yaml:"server"`
	Database struct {
		Path      string `yaml:"path"`
		BackupDir string `yaml:"backup_dir"`
	} `yaml:"database"`
	AI struct {
		BaseURL string `yaml:"base_url"`
		APIKey  string `yaml:"api_key"`
		Model   string `yaml:"model"`
	} `yaml:"ai"`
}

// FindProjectRoot 无论在根目录、bin目录还是通过快捷方式启动，自动定位根目录
func FindProjectRoot() string {
	// 1. 优先检查当前工作目录
	if _, err := os.Stat("config.yaml"); err == nil {
		return "."
	}
	// 2. 检查上一级目录 (如果在 bin/ 下双击 exe)
	if _, err := os.Stat("../config.yaml"); err == nil {
		return ".."
	}
	// 3. 基于可执行文件自身的真实路径回溯
	if exePath, err := os.Executable(); err == nil {
		exeDir := filepath.Dir(exePath)
		if _, err := os.Stat(filepath.Join(exeDir, "config.yaml")); err == nil {
			return exeDir
		}
		if _, err := os.Stat(filepath.Join(exeDir, "..", "config.yaml")); err == nil {
			return filepath.Join(exeDir, "..")
		}
	}
	return "."
}

func LoadConfig() (*Config, error) {
	root := FindProjectRoot()
	configPath := filepath.Join(root, "config.yaml")

	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}

	cfg.ProjectRoot = root
	// 修正数据库与备份相对路径为绝对基准路径
	if !filepath.IsAbs(cfg.Database.Path) {
		cfg.Database.Path = filepath.Join(root, cfg.Database.Path)
	}
	if !filepath.IsAbs(cfg.Database.BackupDir) {
		cfg.Database.BackupDir = filepath.Join(root, cfg.Database.BackupDir)
	}

	return &cfg, nil
}
```

---

### 8.2 规范化 `Makefile`

```makefile
.PHONY: run build clean test

# 默认本地源码开发运行
run:
	go run cmd/server/main.go

# 编译 Windows 独立可执行文件到 bin/
build:
	@echo "编译 Windows amd64 交付文件到 bin/healthtrack.exe ..."
	@if not exist "bin" mkdir bin
	go build -ldflags="-s -w" -o bin/healthtrack.exe ./cmd/server/main.go

# 清理构建产物 (严禁触碰 data/ 目录！)
clean:
	@echo "正在清理 bin/ 目录下的临时构建文件..."
	@if exist "bin\healthtrack.exe" del /f /q "bin\healthtrack.exe"

test:
	go test -v ./...
```

---

### 8.3 统一 Git 忽略规则 (`.gitignore`)

包含以下配置，严格保护数据安全：

```gitignore
# 忽略编译构建二进制目录
/bin/
*.exe

# 忽略本地数据库与备份，绝不提交个人隐私
/data/*.db
/data/*.db-journal
/data/backups/
!/data/.gitkeep

# 忽略本地敏感配置
config.yaml

# IDE 与操作系统临时文件
.idea/
.vscode/
Thumbs.db
```

## 附录：版本控制与发布规范

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

## 九、 Agent 实施约束与“不确定即暂停提问”熔断机制

任何读取本规范的 AI Agent（包括 Codex、Antigravity）在落地实施本工程时，**必须无条件执行以下元准则**：

### 1. 唯一事实源原则 (Single Source of Truth)

* 所有的表名、列名、目录架构以本规范（`v2.0.0 Unified`）为**最高也是唯一裁决标准**。
* 数据库表名**必须为 `records`**，数据必须存放在 **`data/health.db`**，构建输出必须是 **`bin/healthtrack.exe`**。

### 2. 真实数据保护红线 (Data Protection)

* **严禁删除、清空、覆写 `data/` 目录！**
* 严禁执行任何 `DROP TABLE`、`TRUNCATE` 或破坏现有 32KB 数据库中已有列的操作。所有数据库升级必须走 `ALTER TABLE ... ADD COLUMN`。

### 3. “不确定即暂停提问”熔断机制 (Stop & Ask)

若遇到以下任何一种情况，**严禁自行脑补猜测或擅自执行危险操作，必须立即中断执行并向用户提问**：

1. 发现现有源码与本文档规范存在业务逻辑冲突，且代码注释中包含特定历史业务说明时；
2. 任何需要引入大体积前端框架（如 React/Vue/Tailwind 打包工具链）的场景；
3. 执行任何可能导致不可逆数据变动的 Git 重置或物理文件删除操作前。

### 4. 交付闭环标准

代码变更完成后，Agent 须在终端运行 `go build -ldflags="-s -w" -o bin/healthtrack.exe ./cmd/server/main.go`，确保 **0 Warning、0 Error 成功产出 `bin/healthtrack.exe`**，方可向用户汇报任务完成。
