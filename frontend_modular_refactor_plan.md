# HealthTrack 前端模块化重构方案与落地规范 (Vite + Vanilla ESM)

> **目标**：将当前近 6,000 行、超过 300KB 的巨石单文件 `web/static/index.html`，平滑重构为基于 **轻量现代构建管道（Vite） + 原生 ES Modules + 组件/视图目录化** 的工业级前端工程体系。彻底消除 AI 上下文过载与多模块冲突问题，同时保持对 Go `//go:embed` 二进制以及 Android 本地 WebView 的 **零侵入与零回归**。

---

## 一、 现状瓶颈与改造动因

1. **巨石单文件认知超载**：当前 `web/static/index.html` 混杂了 4 个 Tab 视图、7 个弹窗、几千行 JS 逻辑与图表配置，单次修改极易破坏全局状态。
2. **缺乏状态作用域**：大量全局变量直接悬挂在 `window`，如 `currentTab`, `stepsState`, `historyState`，容易产生变量污染。
3. **富 UI 与复杂图表扩展受阻**：手写内联 SVG 与单体 UMD Chart.js 导致代码冗长，难以引入模块化现代图表与微交互。
4. **业界标准对齐**：Docker Desktop、Tauri、Wails 等轻量跨平台桌面/移动应用均统一遵循“**Go/Rust 系统内核 + 现代前端轻量构建（Vite）输出单包嵌入**”的标准范式。

---

## 二、 架构演进全景

```
【重构前：巨石单文件】
web/static/index.html (5,700+ 行 HTML + JS + 样式)  ===>  Go embed 打包

【重构后：源码拆分 + 自动构建打包】
web/src/                                   # 源码开发目录（人类与 AI 维护）
├── index.html                             # 干净的框架入口（< 80 行）
├── main.js                                # 应用初始化与路由装载
├── css/
│   ├── tokens.css                         # JetBrains Mono, 1px 工业单线规范
│   └── app.css                            # 布局与基础样式
├── utils/
│   ├── date.js                            # 日期、农历、跨日计算
│   └── dom.js                             # 极简 DOM 辅助
├── services/
│   ├── api.js                             # 统一后端 API 请求
│   └── state.js                           # 极简发布-订阅响应式状态
├── components/                            # 全局通用组件
│   ├── Header.js                          # 顶部状态栏与 HT 徽章
│   ├── BottomNav.js                       # 底部极细线条导航
│   ├── Toast.js                           # 全局轻提示
│   └── modals/                            # 独立弹窗组件
│       ├── SettingsModal.js               # AI 服务设置
│       ├── DataSheetModal.js              # 数据管理面板
│       └── ImportModal.js                 # 导入与导出
└── views/                                 # 4 大业务 Tab 独立视图
    ├── log/                               # 1. 记一笔
    │   ├── template.html                  # 晨光、步数、两列身体指标卡
    │   ├── morning-light.js               # 晨光打卡逻辑
    │   ├── steps-slider.js                # 步数滑块与断点
    │   └── log-controller.js              # 记一笔总控
    ├── dash/                              # 2. 数据看板
    │   ├── template.html
    │   ├── chart-manager.js               # Chart.js 单色阶图表封装
    │   └── dash-controller.js
    ├── insight/                           # 3. AI 洞察
    │   ├── template.html
    │   └── insight-controller.js
    └── evening/                           # 4. 睡前小结
        ├── template.html
        └── evening-controller.js
                    │
                    ▼ (通过 Vite 零配置高速编译)
web/static/                                # 编译生成目录（由 Go embed 打包进 exe/apk）
├── index.html                             # 自动注入压缩包后的生产文件
├── assets/                                # 自动哈希与 Tree-shaking 后的 js/css
└── vendor/                                # 离线第三方库 (Tailwind, Chart.js)
```

---

## 三、 详细实施计划与里程碑

### 里程碑 1：工程基建与双轨配置
- **任务目标**：建立 Vite 构建环境，输出目录指向 `web/static/`，并确保生成产物采用相对路径 `./`，完美契合 Android 本地 WebView 与 Go `embed.FS`。
- **关键交付物**：
  - `package.json`：配置极简构建脚本；
  - `vite.config.js`：指定 `root: 'web/src'`, `outDir: '../static'`, `base: './'`；
  - 保持现有 `web/static/` 不变，双轨推进。

### 里程碑 2：基础支撑层解耦（Utils & Services）
- **任务目标**：提取日期计算、网络请求与状态管理，消除对全局隐式依赖。
- **关键交付物**：
  - `web/src/utils/date.js`：抽取跨日睡眠计算（04:00截断）、日期格式化；
  - `web/src/services/api.js`：集中封装 `/api/v1/records`, `/api/v1/insights`, `/api/config` 等接口；
  - `web/src/services/state.js`：轻量全局状态派发。

### 里程碑 3：全局通用组件与弹窗解耦
- **任务目标**：将 Header、BottomNav、Toast 及各类 Modal（设置、导入导出）移入 `components/`。
- **关键交付物**：
  - `web/src/components/Header.js`
  - `web/src/components/BottomNav.js`
  - `web/src/components/modals/*`

### 里程碑 4：四大业务视图逐个模块化迁入
- **任务目标**：将主内容区按照 Tab 拆分为 4 个自治模块：
  1. `views/log/`：晨光 Switch、步数滑轨、身体指征两列大卡、昨晚睡眠联动；
  2. `views/dash/`：单色阶图表初始化、60天详情、周平均趋势；
  3. `views/insight/`：AI 深度因果分析、历史记录、阶段对比；
  4. `views/evening/`：睡前小结打卡、自评滑块、思维链折叠。

### 里程碑 5：构建流水线集成与全量验收
- **任务目标**：将 Vite build 无缝融入 `scripts/build-android.ps1` 和 `.githooks/post-commit`。
- **验证项**：
  - Go 后端测试（`go test ./...`）100% 通过；
  - 执行 `npm run build` 产物正常生成在 `web/static/`；
  - Go 单二进制编译测试正常；
  - Android APK 离线加载正常，无任何跨域或白屏报错。

---

## 四、 兼容性与安全红线（必须严格遵守）

1. **绝对离线可用**：所有字体（包括 JetBrains Mono 兜底 monospace）、样式、脚本必须能在断网模式下正常启动与交互。
2. **WebView file:// 协议安全性**：资源引用严禁使用绝对根路径 `/assets/`，必须使用相对路径 `./assets/`。
3. **原生无框架约束**：不引入 React / Vue 等带有巨大 Runtime 的框架，维持轻量高性能的 Vanilla JS / ES Modules 模式。
4. **单步功能点提交**：每个子模块迁移完成且通过验证后，必须执行 Git commit，杜绝大爆炸式一次性修改。
