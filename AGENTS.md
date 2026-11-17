# HealthTrack 工程实施与前端开发规范

本文件是 HealthTrack 项目代码开发与界面重构的强制性指引，所有 Agent 与工程师必须严格遵守。

## 1. 前端工程化与源码红线
* **开发源码目录**：所有前端页面、组件、样式改动必须在 `web/src/` 中完成。
* **禁止修改产物**：严禁直接手改 `web/static/` 目录下的任何 JS/CSS/HTML 构建文件。
* **编译闭环**：修改前端代码后，在编译 Go 服务端或执行 Android 打包前，必须执行 `cd web && npm run build`。
* **Vite 相对路径**：`vite.config.js` 必须维持 `base: './'`，确保在 Android WebView 离线环境与单二进制内嵌中正常加载，防止白屏。
* **ES Module 作用域防坑**：动态模板字符串中内联的 `onclick` 处理函数，必须显式挂载至 `window`（如 `window.onHistoryItemClick = onHistoryItemClick`），或使用事件委托。

## 2. HealthTrack 3.0 Linear 工业单线设计系统
* **单线容器**：统一使用 `.ht-card`（`rounded-xl border border-neutral-200/80 bg-white`），严禁使用夸张大圆角（`rounded-3xl`）、深色渐变底或厚重投影。
* **零 Emoji 铁律**：严禁在 UI 界面中使用彩色 Emoji 图标。统一采用 1.5px 极细线性矢量 SVG（Lucide 规范）。
* **等宽排版体系**：所有数值测量、差值、时间点、百分比与单位标签，强制绑定 `JetBrains Mono`（`.font-mono` + `.tabular-nums`）。
* **交互原子规范**：
  * 分段切换器使用 `.ht-seg-btn`；
  * 连续滑动条使用 `.ht-range`（2px 细轨道 + 14px 紧凑滑块）；
  * 破坏性确认一律调用 `appConfirm()`（`#app-confirm-modal`），严禁使用原生 `confirm()` 或 `alert()`。
  * 按钮文案一律使用清晰的纯中文动宾搭配（如「保存今日记录」、「生成阶段深度洞察」）。

## 3. Android WebView 移动端防踩坑约束
* **图片与媒体必须显式约束尺寸**：严禁使用非标准的 Tailwind 宽度（如 `w-13`）。列表缩略图必须显式约束固定像素与填充模式（如 `style="width:40px;height:40px;min-width:40px;min-height:40px;object-fit:cover;"`），防止破坏卡片高度与滑动删除条。
* **原生日期输入宽度**：`<input type="date">` 宽度不得小于 138px（`w-[138px]`），防止 Android 内置日历图标遮挡日期最后一位。
* **缓存失效策略**：Go 服务端 HTML 响应必须带有 `Cache-Control: no-cache, must-revalidate`。

## 4. 数据安全与覆盖安装红线
* **数据库平滑迁移**：仅允许 `ALTER TABLE ... ADD COLUMN`，严禁 `DROP TABLE` / `TRUNCATE`。
* **覆盖安装**：手机端一律使用 `adb install -r` 覆盖安装，严禁卸载重装或清空应用数据，保护用户手工录入的真实历史数据。
