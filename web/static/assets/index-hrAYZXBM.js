(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();function Ks(){let t=document.getElementById("toast");t||(t=document.createElement("div"),t.id="toast",t.className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 opacity-0 pointer-events-none -translate-y-4",t.innerHTML=`
      <div id="toast-body" class="bg-neutral-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-xs font-mono font-medium">
        <span id="toast-icon">✓</span>
        <span id="toast-msg">操作成功</span>
      </div>
    `,document.body.appendChild(t))}function $(t,e=!0){const n=document.getElementById("toast"),s=document.getElementById("toast-icon"),a=document.getElementById("toast-msg");!n||!s||!a||(s.innerText=e?"✓":"✕",a.innerText=t,n.classList.remove("opacity-0","-translate-y-4","pointer-events-none"),n.classList.add("opacity-100","translate-y-0"),setTimeout(()=>{n.classList.remove("opacity-100","translate-y-0"),n.classList.add("opacity-0","-translate-y-4","pointer-events-none")},2200))}const Zs="";class de extends Error{constructor(e,n=0,s=0){super(e),this.name="ApiError",this.status=n,this.code=s}}async function j(t,e={}){const n=`${Zs}${t}`,s=typeof FormData<"u"&&e.body instanceof FormData,a=typeof Blob<"u"&&e.body instanceof Blob,o={};e.headers&&typeof e.headers=="object"&&!Array.isArray(e.headers)&&Object.assign(o,e.headers);const i=Object.keys(o).some(u=>u.toLowerCase()==="content-type");!s&&!a&&!i&&e.body!==void 0&&(o["Content-Type"]="application/json");const r=await fetch(n,{...e,headers:o}),d=(r.headers.get("content-type")||"").includes("application/json");if(!r.ok){let u=`HTTP Error ${r.status}`,m=0;if(d)try{const v=await r.json();u=v.message||v.error||u,typeof v.code=="number"&&(m=v.code)}catch{}throw new de(u,r.status,m)}if(d){const u=await r.json();if(u&&typeof u=="object"&&typeof u.code=="number"&&u.code!==200)throw new de(u.message||"请求失败",r.status,u.code);return u}return await r.text()}const M={getHistoryRecords:(t,e)=>j(`/api/v1/records/history?start_date=${encodeURIComponent(t)}&end_date=${encodeURIComponent(e)}`),saveRecord:t=>j("/api/v1/records",{method:"POST",body:JSON.stringify(t)}),getConfig:()=>j("/api/config"),saveConfig:t=>j("/api/config",{method:"POST",body:JSON.stringify(t)}),testAIConfig:t=>j("/api/config/test",{method:"POST",body:JSON.stringify(t)}),saveSleepThresholds:t=>j("/api/config/sleep",{method:"POST",body:JSON.stringify(t)}),saveSummaryScoreBands:t=>j("/api/config/summary",{method:"POST",body:JSON.stringify({score_bands:t})}),checkInsightPeriod:(t,e,n=-new Date().getTimezoneOffset())=>j(`/api/v1/insights/period?range_days=${t}&end_date=${encodeURIComponent(e)}&tz_offset=${n}`),getInsightHistory:(t={})=>{const e=new URLSearchParams(t).toString();return j(`/api/v1/insights${e?"?"+e:""}`)},getInsightDetail:t=>j(`/api/v1/insights/${encodeURIComponent(String(t))}`),deleteInsight:t=>j(`/api/v1/insights/${encodeURIComponent(String(t))}`,{method:"DELETE"}),batchDeleteInsights:t=>j("/api/v1/insights/batch-delete",{method:"POST",body:JSON.stringify({ids:t})}),checkComparePeriod:(t,e,n=-new Date().getTimezoneOffset())=>j(`/api/v1/insights/compare/period?month_a=${encodeURIComponent(t)}&month_b=${encodeURIComponent(e)}&tz_offset=${n}`),getEveningSummary:t=>j(`/api/v1/evening/summary?date=${encodeURIComponent(t)}`),getEveningSummaries:()=>j("/api/v1/evening/summaries"),saveEveningSummary:t=>j("/api/v1/evening/summary",{method:"POST",body:JSON.stringify(t)}),deleteEveningSummary:t=>j(`/api/v1/evening/summary/${encodeURIComponent(t)}`,{method:"DELETE"}),uploadEveningPhoto:(t,e)=>j(`/api/v1/evening/photo?date=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":(e==null?void 0:e.type)||"image/jpeg"},body:e}),deletePhoto:t=>j(`/api/v1/evening/photo/${encodeURIComponent(String(t))}`,{method:"DELETE"}),getEveningInsight:t=>j(`/api/v1/evening/insight?date=${encodeURIComponent(t)}`),deleteEveningInsight:t=>j(`/api/v1/evening/insight?date=${encodeURIComponent(t)}`,{method:"DELETE"}),previewImportFile:t=>j("/api/v1/import/preview",{method:"POST",body:t}),previewImportMemo:(t,e)=>j("/api/v1/import/preview",{method:"POST",body:JSON.stringify({memo:t,year_base:e})}),confirmImport:t=>j("/api/v1/import/confirm",{method:"POST",body:JSON.stringify(t)}),getImportBatches:(t=20)=>j(`/api/v1/import/batches?limit=${encodeURIComponent(String(t))}`),getImportBatchDetail:t=>j(`/api/v1/import/batches/${encodeURIComponent(String(t))}`),retryImportBatch:t=>j(`/api/v1/import/batches/${encodeURIComponent(String(t))}/retry`,{method:"POST"}),fetchBlob:async t=>{const e=await fetch(t);if(!e.ok)throw new de(`HTTP ${e.status}`,e.status);return await e.blob()},probeContentLength:async t=>{try{const e=await fetch(t,{method:"HEAD"});if(!e.ok)return null;const n=Number(e.headers.get("Content-Length"));return Number.isFinite(n)&&n>0?n:null}catch{return null}}};function l(t){return document.getElementById(t)}function g(t){const e=document.getElementById(t);return e instanceof HTMLInputElement?e:null}function Kt(t){const e=document.getElementById(t);return e instanceof HTMLTextAreaElement?e:null}function Xn(t){const e=document.getElementById(t);return e instanceof HTMLSelectElement?e:null}function Y(t){const e=document.getElementById(t);return e instanceof HTMLButtonElement?e:null}function zt(t){const e=document.getElementById(t);return e instanceof HTMLCanvasElement?e:null}function jt(t){const e=document.getElementById(t);return e instanceof HTMLImageElement?e:null}function B(t,e){if(!(t instanceof Element))return null;const n=t.closest(e);return n instanceof HTMLElement?n:null}function Qs(t){var o,i,r;t.insertAdjacentHTML("beforeend",`
    <!-- AI 配置与熬夜阈值弹窗 -->
    <div id="settings-modal" class="hidden fixed inset-0 z-[60] bg-neutral-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            <h2 id="settings-title" class="font-bold text-neutral-900 text-sm">AI 服务设置</h2>
            <p class="text-[11px] font-mono text-neutral-400 mt-0.5">配置仅保存在本机私有目录</p>
          </div>
          <button id="btn-close-settings" aria-label="关闭设置" class="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors flex items-center justify-center font-mono">✕</button>
        </div>
        <div class="p-5 space-y-3.5">
          <div>
            <label for="setting-base-url" class="block text-xs font-mono font-medium text-neutral-600 mb-1">API Base URL</label>
            <input id="setting-base-url" type="url" placeholder="https://api.deepseek.com/v1" class="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
          </div>
          <div>
            <label for="setting-model" class="block text-xs font-mono font-medium text-neutral-600 mb-1">模型名称</label>
            <input id="setting-model" type="text" placeholder="deepseek-chat" class="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="setting-api-key" class="block text-xs font-mono font-medium text-neutral-600">API Key</label>
              <button type="button" id="toggle-api-key" class="text-xs font-mono text-neutral-500 hover:text-neutral-900">显示</button>
            </div>
            <input id="setting-api-key" type="password" autocomplete="off" placeholder="留空则保留当前 API Key" class="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
            <p id="api-key-status" class="text-[10px] font-mono text-neutral-400 mt-1">正在读取配置…</p>
          </div>
          <div class="pt-2 border-t border-neutral-100">
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-mono font-medium text-neutral-700">熬夜判定阈值</label>
              <span class="text-[10px] font-mono text-neutral-400">午夜 0 点填 00:00</span>
            </div>
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label for="setting-sleep-green" class="block text-[10px] font-mono text-neutral-500 mb-1">不熬夜截止线</label>
                <input id="setting-sleep-green" type="time" class="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
              </div>
              <div>
                <label for="setting-sleep-yellow" class="block text-[10px] font-mono text-neutral-500 mb-1">轻度熬夜截止线</label>
                <input id="setting-sleep-yellow" type="time" class="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
              </div>
            </div>
            <button id="save-sleep-btn" type="button" class="mt-2.5 w-full py-2 rounded-lg bg-neutral-900 text-white font-mono font-medium text-xs hover:bg-neutral-800 transition-colors">保存熬夜阈值</button>
          </div>
          <p id="settings-feedback" class="hidden text-xs font-mono rounded-lg px-3 py-2"></p>
          <div class="grid grid-cols-2 gap-2.5 pt-1">
            <button id="test-config-btn" type="button" class="py-2 rounded-lg border border-neutral-200 text-neutral-700 font-mono font-medium text-xs hover:border-neutral-400 transition-colors">测试连接</button>
            <button id="save-config-btn" type="button" class="py-2 rounded-lg bg-neutral-900 text-white font-mono font-medium text-xs hover:bg-neutral-800 transition-colors">保存配置</button>
          </div>
        </div>
      </section>
    </div>
  `);const n=document.getElementById("settings-modal"),s=document.getElementById("btn-close-settings"),a=document.getElementById("toggle-api-key");document.getElementById("setting-api-key"),n==null||n.addEventListener("click",c=>{c.target===n&&De()}),s==null||s.addEventListener("click",De),a==null||a.addEventListener("click",()=>{const c=g("setting-api-key");c&&(c.type==="password"?(c.type="text",a.innerText="隐藏"):(c.type="password",a.innerText="显示"))}),(o=document.getElementById("save-config-btn"))==null||o.addEventListener("click",na),(i=document.getElementById("test-config-btn"))==null||i.addEventListener("click",sa),(r=document.getElementById("save-sleep-btn"))==null||r.addEventListener("click",aa)}function ta(){const t=document.getElementById("settings-modal");t&&(t.classList.remove("hidden"),ea())}function De(){const t=document.getElementById("settings-modal");t==null||t.classList.add("hidden")}async function ea(){try{const t=await M.getConfig(),e=t&&t.data?t.data:t||{},n=g("setting-base-url"),s=g("setting-model"),a=l("api-key-status");n&&(n.value=e.base_url||""),s&&(s.value=e.model||""),a&&(a.innerText=e.api_key_configured?`当前 Key: ${e.api_key_masked}（留空可保留）`:"尚未配置 API Key");const o=g("setting-sleep-green"),i=g("setting-sleep-yellow");o&&(o.value=e.sleep_green_before||"23:30"),i&&(i.value=e.sleep_yellow_before||"01:00")}catch(t){const e=t instanceof Error?t.message:String(t);$("读取设置失败: "+e,!1)}}async function na(){const t=g("setting-base-url"),e=g("setting-model"),n=g("setting-api-key"),s={base_url:(t==null?void 0:t.value.trim())||"",model:(e==null?void 0:e.value.trim())||""};n&&n.value.trim()&&(s.api_key=n.value.trim());try{await M.saveConfig(s),$("AI 配置已更新"),De()}catch(a){const o=a instanceof Error?a.message:String(a);$("保存失败: "+o,!1)}}async function sa(){const t=g("setting-base-url"),e=g("setting-model"),n=g("setting-api-key"),s=l("settings-feedback"),a={base_url:(t==null?void 0:t.value.trim())||"",model:(e==null?void 0:e.value.trim())||""};n&&n.value.trim()&&(a.api_key=n.value.trim()),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 text-neutral-600 block",s.innerText="正在测试连接中…");try{await M.testAIConfig(a),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-900 text-white block",s.innerText="✓ 测试连接成功！")}catch(o){const i=o instanceof Error?o.message:String(o);s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 block",s.innerText="✕ 测试连接失败: "+i)}}async function aa(){const t=g("setting-sleep-green"),e=g("setting-sleep-yellow"),n=(t==null?void 0:t.value)||"23:30",s=(e==null?void 0:e.value)||"01:00";try{await M.saveSleepThresholds({green_before:n,yellow_before:s}),window.dispatchEvent(new CustomEvent("sleep-thresholds-updated",{detail:{green:n,yellow:s}})),$("熬夜阈值已保存并立即生效")}catch(a){const o=a instanceof Error?a.message:String(a);$("保存阈值失败: "+o,!1)}}const oa=`    <!-- 导出数据弹窗：Excel 表格与 JSON 完整备份两种方式 -->
    <div id="export-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="export-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 id="export-title" class="font-bold text-slate-900">导出数据</h2>
            <p id="export-subtitle" class="text-xs text-slate-400 mt-0.5">导出为 CSV，可用 Excel / WPS 打开</p>
          </div>
          <button type="button" data-action="export-close" aria-label="关闭导出" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <div class="grid grid-cols-3 gap-2" id="export-type-pills">
            <button type="button" data-action="export-type" data-type="excel" class="py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all">Excel</button>
            <button type="button" data-action="export-type" data-type="json" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">JSON</button>
            <button type="button" data-action="export-type" data-type="archive" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">图文归档</button>
          </div>
          <div id="export-range-panel">
            <label class="block text-xs font-mono font-medium text-neutral-600 mb-2">导出范围</label>
            <div class="grid grid-cols-3 gap-2" id="export-range-pills">
              <button type="button" data-action="export-range" data-range="7" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">最近7天</button>
              <button type="button" data-action="export-range" data-range="30" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">最近30天</button>
              <button type="button" data-action="export-range" data-range="all" class="py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all">全部</button>
            </div>
          </div>
          <div id="export-json-panel" class="hidden">
            <div class="rounded-xl bg-amber-50 border border-amber-200/70 px-3.5 py-3 text-[11px] leading-relaxed text-amber-800">
              <p class="font-bold text-xs mb-1.5">这是完整备份，不是筛选导出</p>
              <ul class="space-y-1 list-disc list-inside">
                <li>包含全部健康记录与睡前小结，不受时间范围限制</li>
                <li>不包含小结照片与 AI 洞察</li>
                <li>之后可在「导入数据」中原样回灌，用于换机或重装恢复</li>
              </ul>
            </div>
          </div>
          <div id="export-archive-panel" class="hidden">
            <div class="rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-3 text-[11px] leading-relaxed text-neutral-700">
              <p class="font-bold text-xs mb-1.5">图文小结归档（ZIP）</p>
              <ul class="space-y-1 list-disc list-inside">
                <li>包含所选范围内的小结表格与全部难忘图片</li>
                <li>解压后：summaries.csv + photos/ 日期.jpg + manifest.json</li>
                <li>图片为应用内保存的压缩版，不包含手机相册原文件</li>
              </ul>
            </div>
          </div>
          <div id="export-result" class="hidden text-xs rounded-xl px-3 py-2.5"></div>
          <button id="export-start-btn" type="button" data-action="export-run" class="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">开始导出</button>
          <button id="export-json-btn" type="button" data-action="export-run" class="hidden w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">导出 JSON 备份</button>
          <button id="export-archive-btn" type="button" data-action="export-run" class="hidden w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">导出图文归档</button>
        </div>
      </section>
    </div>

    <!-- 导入数据弹窗：选择文件 → 预检预览 → 确认写入 -->
    <div id="import-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 id="import-title" class="font-bold text-slate-900">导入数据</h2>
            <p id="import-subtitle" class="text-xs text-slate-400 mt-0.5">预检不写入数据，确认后才会导入</p>
          </div>
          <button type="button" data-action="import-close" aria-label="关闭导入" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div class="p-5 space-y-4 overflow-y-auto no-scrollbar">
          <div id="import-step-pick">
            <!-- 安卓文件选择器对 text/csv 等 MIME 支持不一致，这里放开选择范围，由服务端校验文件类型 -->
            <input id="import-file-input" type="file" accept="*/*" class="hidden">
            <button id="import-pick-btn" type="button" data-action="imp-pick" class="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">选择文件</button>
            <p class="text-[11px] text-neutral-400 mt-2 leading-relaxed">支持 CSV 模板与 HealthTrack JSON 备份，单次最多 5000 行 / 5 MB。手机端请先把文件保存到「下载」目录，xlsx 需另存为 CSV。</p>
          </div>

          <div id="import-step-preview" class="hidden space-y-3">
            <div class="rounded-xl bg-neutral-50 border border-neutral-200/70 px-3.5 py-3">
              <p id="import-file-meta" class="text-[11px] text-neutral-500 break-all"></p>
              <div class="grid grid-cols-5 gap-1.5 mt-2.5 text-center font-mono">
                <div><p class="text-[10px] text-neutral-400">总行数</p><p id="imp-stat-total" class="text-sm font-bold text-neutral-800 tabular-nums">0</p></div>
                <div><p class="text-[10px] text-neutral-400">新增</p><p id="imp-stat-inserted" class="text-sm font-bold text-emerald-600 tabular-nums">0</p></div>
                <div><p class="text-[10px] text-neutral-400">更新</p><p id="imp-stat-updated" class="text-sm font-bold text-neutral-900 tabular-nums">0</p></div>
                <div><p class="text-[10px] text-neutral-400">警告</p><p id="imp-stat-warnings" class="text-sm font-bold text-amber-600 tabular-nums">0</p></div>
                <div><p class="text-[10px] text-neutral-400">错误</p><p id="imp-stat-errors" class="text-sm font-bold text-rose-600 tabular-nums">0</p></div>
              </div>
            </div>
            <div id="import-dup-tip" class="hidden rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-[11px] leading-relaxed text-amber-800"></div>
            <div id="import-fatal" class="hidden rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5 text-[11px] leading-relaxed text-rose-700"></div>
            <div id="import-issue-wrap" class="hidden">
              <p class="text-xs font-bold text-slate-600 mb-1.5">需要关注的行 <span id="import-issue-count" class="text-slate-400 font-normal"></span></p>
              <div id="import-issue-list" class="space-y-1 max-h-36 overflow-y-auto no-scrollbar"></div>
            </div>
            <div id="import-diff-wrap" class="hidden">
              <p class="text-xs font-bold text-slate-600 mb-1.5">将要写入的日期 <span id="import-diff-count" class="text-slate-400 font-normal"></span></p>
              <div id="import-diff-list" class="space-y-1 max-h-36 overflow-y-auto no-scrollbar"></div>
            </div>
          </div>

          <div id="import-step-options" class="hidden space-y-3">
            <div>
              <p class="text-xs font-bold text-slate-600 mb-1.5">同一天已有数据时</p>
              <div class="space-y-2">
                <button type="button" data-action="imp-mode" data-mode="merge" class="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white transition-all">
                  <span class="block text-xs font-bold text-slate-800">合并（推荐）</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">只覆盖文件中填写了值的字段，空单元格保留旧数据</span>
                </button>
                <button type="button" data-action="imp-mode" data-mode="overwrite" class="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white transition-all">
                  <span class="block text-xs font-bold text-slate-800">替换</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">整行覆盖，文件中的空值会清空原有数据</span>
                </button>
              </div>
            </div>
            <label id="import-skip-wrap" class="hidden flex items-start space-x-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
              <input id="import-skip-errors" type="checkbox" class="mt-0.5 accent-amber-600">
              <span class="text-[11px] leading-relaxed text-amber-800">跳过错误行，只导入正常行。失败行可在「导入记录」中导出修正后补导。</span>
            </label>
          </div>

          <div id="import-result" class="hidden text-xs rounded-xl px-3 py-2.5"></div>
        </div>
        <div class="px-5 py-4 border-t border-neutral-100 shrink-0 flex gap-2">
          <button type="button" data-action="import-close" class="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-600 font-mono font-medium text-xs hover:bg-neutral-200 transition-colors">取消</button>
          <button id="import-confirm-btn" type="button" data-action="imp-confirm" disabled class="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs transition-colors opacity-50">确认导入</button>
        </div>
      </section>
    </div>

    <!-- 备忘录粘贴导入 -->
    <div id="memo-import-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="memo-import-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h2 id="memo-import-title" class="font-bold text-neutral-900">从备忘录导入</h2>
            <p class="text-xs text-neutral-400 mt-0.5">粘贴后先预检，确认无误再写入</p>
          </div>
          <button type="button" data-action="memo-close" aria-label="关闭备忘录导入" class="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500">✕</button>
        </div>
        <div class="p-5 space-y-3 overflow-y-auto no-scrollbar">
          <textarea id="memo-import-text" rows="10" placeholder="例如：&#10;10-01 76.9 78.2 腰78 睡23:30-7:00&#10;10-02 76.8 早上有点累" class="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-800 resize-y font-mono"></textarea>
          <div class="flex items-center justify-between">
            <label for="memo-year-base" class="text-xs font-mono font-medium text-neutral-600">年份基准</label>
            <select id="memo-year-base" class="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-neutral-700 outline-none focus:border-neutral-800"></select>
          </div>
          <p class="text-[11px] text-neutral-400 leading-relaxed">未写年份时按年份基准推断，晚于今天的日期归到上一年。</p>
        </div>
        <div class="px-5 py-4 border-t border-neutral-100 shrink-0 flex gap-2">
          <button type="button" data-action="memo-close" class="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-600 font-mono font-medium text-xs hover:bg-neutral-200 transition-colors">取消</button>
          <button id="memo-preview-btn" type="button" data-action="memo-preview" class="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">预检</button>
        </div>
      </section>
    </div>

    <!-- 导入批次历史 -->
    <div id="import-batches-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="batches-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 id="batches-title" class="font-bold text-slate-900">导入记录</h2>
            <p class="text-xs text-slate-400 mt-0.5">失败批次可重试或导出失败行</p>
          </div>
          <button type="button" data-action="batches-close" aria-label="关闭导入记录" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div id="batches-list" class="p-4 space-y-2.5 overflow-y-auto no-scrollbar">
          <p class="text-xs text-slate-400 text-center py-8">加载中…</p>
        </div>
        <div class="px-5 py-4 border-t border-slate-100 shrink-0">
          <button type="button" data-action="batches-close" class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">关闭</button>
        </div>
      </section>
    </div>

    <!-- 通用确认弹窗（替代原生 confirm，兼容安卓 WebView 与内嵌浏览器） -->
    <div id="app-confirm-modal" class="hidden fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-xs bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="app-confirm-title">
        <div class="px-5 pt-5">
          <h2 id="app-confirm-title" class="font-bold text-slate-900 text-base">请确认</h2>
          <p id="app-confirm-msg" class="text-sm text-slate-500 mt-2 leading-relaxed"></p>
        </div>
        <div class="p-5 flex gap-2">
          <button id="app-confirm-cancel" type="button" class="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">取消</button>
          <button id="app-confirm-ok" type="button" class="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">确定删除</button>
        </div>
      </section>
    </div>

    <!-- 轻量错误提示条（替代原生 alert） -->
    <div id="app-toast" class="hidden fixed left-1/2 -translate-x-1/2 bottom-24 z-[80] max-w-[90%] px-4 py-2 rounded-xl bg-neutral-900/95 text-white text-xs font-mono shadow-lg"></div>

    <!-- 小结图片全屏查看 -->
    <div id="ev-photo-viewer" class="hidden fixed inset-0 z-[85] bg-slate-950/95 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="查看小结图片">
      <img id="ev-photo-viewer-img" src="" alt="" class="w-full h-full object-contain p-4 select-none">
      <button type="button" data-action="ev-close-photo" aria-label="关闭图片" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 text-white text-lg leading-none flex items-center justify-center backdrop-blur active:scale-95 transition-transform">✕</button>
      <p class="absolute bottom-6 inset-x-0 text-center text-[11px] text-white/60">点击任意处关闭</p>
    </div>

    <!-- 核心内容切换区 -->
`;function st(t,e){const n=e||{};return new Promise(s=>{const a=document.getElementById("app-confirm-modal"),o=document.getElementById("app-confirm-title"),i=document.getElementById("app-confirm-msg"),r=document.getElementById("app-confirm-ok"),c=document.getElementById("app-confirm-cancel");if(!a){s(!1);return}o.innerText=n.title||"请确认",i.innerText=t||"",r.innerText=n.confirmText||"确定",n.danger===!1?r.className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-sm hover:bg-neutral-800 transition-colors":r.className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-mono font-semibold text-sm hover:bg-rose-700 transition-colors";const d=()=>{a.classList.add("hidden"),r.onclick=null,c.onclick=null,a.onclick=null};r.onclick=()=>{d(),s(!0)},c.onclick=()=>{d(),s(!1)},a.onclick=u=>{u.target===a&&(d(),s(!1))},a.classList.remove("hidden")})}async function ia(t){if(window.HealthTrack&&typeof window.HealthTrack.copyText=="function")try{return window.HealthTrack.copyText(t),!0}catch{}try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(t),!0}catch{}try{const e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.position="fixed",e.style.top="-2000px",e.style.opacity="0",document.body.appendChild(e),e.select(),e.setSelectionRange(0,t.length);const n=document.execCommand("copy");return document.body.removeChild(e),n}catch{return!1}}let Ke=null;function z(t){const e=document.getElementById("app-toast");e?(e.innerText=t||"",e.classList.remove("hidden"),Ke&&clearTimeout(Ke),Ke=setTimeout(()=>e.classList.add("hidden"),2600)):$(t,!0)}function T(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ht(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,'<code class="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono text-neutral-800">$1</code>')}function ra(t){return/^\s*\|[\s:|\-]+\|\s*$/.test(t)&&t.includes("-")}function kn(t){return t.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(n=>ht(n.trim()))}function we(t){if(!t)return"";const n=T(t).replace(/\r\n?/g,`
`).split(`
`);let s="",a=null;const o=()=>{a&&(s+=`</${a}>`,a=null)};for(let i=0;i<n.length;i++){const r=n[i],c=r.trim();if(/^\|.*\|$/.test(c)&&i+1<n.length&&ra(n[i+1])){o();const E=kn(c);i+=1;const _=[];for(;i+1<n.length&&/^\|.*\|$/.test(n[i+1].trim());)i+=1,_.push(kn(n[i].trim()));const b=E.map(N=>`<th class="text-left font-semibold text-neutral-700 px-2 py-1.5 border-b border-neutral-200 bg-neutral-50 whitespace-nowrap">${N}</th>`).join(""),L=_.map(N=>`<tr>${E.map((X,J)=>`<td class="px-2 py-1.5 border-b border-neutral-100 text-neutral-700 align-top">${N[J]??""}</td>`).join("")}</tr>`).join("");s+=`<div class="overflow-x-auto my-2 rounded-lg border border-neutral-200"><table class="w-full text-[11px] font-mono border-collapse"><thead><tr>${b}</tr></thead><tbody>${L}</tbody></table></div>`;continue}if(/^---+$/.test(c)){o(),s+='<hr class="my-3 border-neutral-200">';continue}const d=r.match(/^###\s+(.*)$/);if(d){o(),s+=`<h3 class="font-bold text-neutral-800 text-sm mt-3 mb-1.5 pb-1 border-b border-neutral-100">${ht(d[1])}</h3>`;continue}const u=r.match(/^##\s+(.*)$/);if(u){o(),s+=`<h2 class="font-bold text-neutral-900 text-base mt-4 mb-2">${ht(u[1])}</h2>`;continue}const m=r.match(/^#\s+(.*)$/);if(m){o(),s+=`<h1 class="font-bold text-neutral-900 text-lg mt-4 mb-2">${ht(m[1])}</h1>`;continue}const v=r.match(/^&gt;\s?(.*)$/);if(v){o(),s+=`<blockquote class="border-l-2 border-neutral-300 pl-2.5 my-2 text-xs text-neutral-500 leading-relaxed">${ht(v[1])}</blockquote>`;continue}const x=r.match(/^[*-]\s+(.*)$/);if(x){a!=="ul"&&(o(),s+='<ul class="list-disc pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">',a="ul"),s+=`<li>${ht(x[1])}</li>`;continue}const y=r.match(/^\d+\.\s+(.*)$/);if(y){a!=="ol"&&(o(),s+='<ol class="list-decimal pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">',a="ol"),s+=`<li>${ht(y[1])}</li>`;continue}o(),c&&(s+=`<p class="my-1.5 text-xs text-neutral-700 leading-relaxed">${ht(r)}</p>`)}return o(),s}let _t="all",ft="excel",ue=0,Tn=!1;function la(){if(Tn)return;const t=l("export-modal");t&&(Tn=!0,t.addEventListener("click",e=>{var a,o;if(e.target===t){tn();return}const n=B(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;s==="export-close"?tn():s==="export-type"?Kn(n):s==="export-range"?Zn(n):s==="export-run"?da():s==="open-downloads"&&((o=(a=window.HealthTrack)==null?void 0:a.openDownloads)==null||o.call(a))}))}function ca(){var n;(n=l("export-modal"))==null||n.classList.remove("hidden");const t=document.querySelector('#export-type-pills button[data-type="excel"]'),e=document.querySelector('#export-range-pills button[data-range="all"]');t instanceof HTMLElement&&Kn(t),e instanceof HTMLElement&&Zn(e)}function tn(){var t;(t=l("export-modal"))==null||t.classList.add("hidden")}function Kn(t){var a,o,i,r,c,d;if(!t)return;ft=t.getAttribute("data-type")||"excel",document.querySelectorAll("#export-type-pills button").forEach(u=>{const m=u===t;u.className=m?"py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all":"py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"});const e=ft==="json",n=ft==="archive";(a=l("export-range-panel"))==null||a.classList.toggle("hidden",e),(o=l("export-json-panel"))==null||o.classList.toggle("hidden",!e),(i=l("export-archive-panel"))==null||i.classList.toggle("hidden",!n),(r=l("export-start-btn"))==null||r.classList.toggle("hidden",e||n),(c=l("export-json-btn"))==null||c.classList.toggle("hidden",!e),(d=l("export-archive-btn"))==null||d.classList.toggle("hidden",!n);const s=l("export-subtitle");s&&(s.textContent=e?"全量备份，包含健康记录与睡前小结":n?"小结表格 + 难忘图片，打包为 ZIP":"导出为 CSV，可用 Excel / WPS 打开"),Qn()}function Zn(t){_t=t.getAttribute("data-range")||"all",document.querySelectorAll("#export-range-pills button").forEach(e=>{const n=e===t;e.className=n?"py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all":"py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"}),Qn()}function Qn(){const t=l("export-result");t&&(t.classList.add("hidden"),t.textContent="")}function da(){return ft==="json"?ma():ft==="archive"?ba():pa()}function ua(t){const e=t==="7"?"7d":t==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_export_${e}_${s}.csv`}function Ue(t,e){const n=document.createElement("a"),s=URL.createObjectURL(t);n.href=s,n.download=e,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(s),2e3)}async function pa(){const t=-new Date().getTimezoneOffset(),e=new URLSearchParams({tz_offset:String(t)});_t!=="all"&&e.set("range",_t);const n=`/api/v1/export?${e.toString()}`;if(window.HealthTrack){ue=await M.probeContentLength(n),rt(!0),window.location.href=n;return}rt(!0);try{const s=await M.fetchBlob(n),a=ua(_t);Ue(s,a),Lt(!0,{filename:a,size:s.size,location:"浏览器默认下载目录"}),$("导出成功",!0)}catch(s){const a=s instanceof Error?s.message:"网络错误";Lt(!1,{message:"导出失败："+a}),$("导出失败",!1)}finally{rt(!1)}}function fa(){const t=new Date;return`HealthTrack_backup_v2_${""+t.getFullYear()+String(t.getMonth()+1).padStart(2,"0")+String(t.getDate()).padStart(2,"0")}.json`}async function ma(){if(!await st("将导出全部健康记录与睡前小结为一个 JSON 文件（不含小结照片与 AI 洞察），不受时间范围限制。导出后可原样回灌到本应用。",{title:"导出完整备份？",confirmText:"开始导出",danger:!1}))return;const e="/api/v1/export/json";if(window.HealthTrack){ue=await M.probeContentLength(e),rt(!0),window.location.href=e;return}rt(!0);try{const n=await M.fetchBlob(e),s=fa();Ue(n,s),Lt(!0,{filename:s,size:n.size,location:"浏览器默认下载目录"}),$("备份已导出",!0)}catch(n){const s=n instanceof Error?n.message:"网络错误";Lt(!1,{message:"导出失败："+s}),$("导出失败",!1)}finally{rt(!1)}}function xa(t){const e=t==="7"?"7d":t==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_summaries_${e}_${s}.zip`}async function ba(){const t=-new Date().getTimezoneOffset(),e=new URLSearchParams({tz_offset:String(t)});_t!=="all"&&e.set("range",_t);const n=`/api/v1/export/summaries.zip?${e.toString()}`;if(window.HealthTrack){ue=await M.probeContentLength(n),rt(!0),window.location.href=n;return}rt(!0);try{const s=await M.fetchBlob(n),a=xa(_t);Ue(s,a),Lt(!0,{filename:a,size:s.size,location:"浏览器默认下载目录"}),$("导出成功",!0)}catch(s){const a=s instanceof Error?s.message:"网络错误";Lt(!1,{message:"导出失败："+a}),$("导出失败",!1)}finally{rt(!1)}}function rt(t){const n=Y(ft==="json"?"export-json-btn":ft==="archive"?"export-archive-btn":"export-start-btn");n&&(n.disabled=t,n.classList.toggle("opacity-50",t),n.textContent=t?"导出中…":ft==="json"?"导出 JSON 备份":ft==="archive"?"导出图文归档":"开始导出")}function Lt(t,e){const n=l("export-result");if(n)if(n.classList.remove("hidden"),t){const s=e.size!=null?`（${ts(e.size)}）`:"",a=window.HealthTrack?'<button type="button" data-action="open-downloads" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>':'<button type="button" data-action="export-run" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';n.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",n.innerHTML=`文件已保存：<span class="font-bold break-all">${T(e.filename)}</span>${s}<br>位置：${T(e.location)}<div>${a}</div>`}else n.className="text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600",n.textContent=e.message}function ts(t){return t<1024?t+" B":t<1024*1024?(t/1024).toFixed(1)+" KB":(t/1024/1024).toFixed(2)+" MB"}async function es(t,e,n){if(window.HealthTrack){window.location.href=t,$("已开始下载",!0);return}try{const s=await M.fetchBlob(t);Ue(s,e),$(n||"文件已下载",!0)}catch(s){const a=s instanceof Error?s.message:"网络错误";$("下载失败："+a,!1)}}window.onExportResult=function(t){rt(!1);const e=t&&t.size!=null?t.size:ue;ue=null;const n=l("export-modal"),s=!!(n&&!n.classList.contains("hidden"));if(t&&t.ok)s&&Lt(!0,{filename:t.filename,size:e,location:t.location||"下载目录 Download/"}),$(t.filename?"已保存："+t.filename:"导出成功",!0);else{const a=t&&t.message||"未知错误";s&&Lt(!1,{message:"导出失败："+a}),$("导出失败："+a,!1)}};let ns=()=>{};function ga(t){ns=typeof t=="function"?t:()=>{}}function mt(t){ns(t)}function q(t){const e=t instanceof Date?t:new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function Ct(t,e){const[n,s,a]=t.split("-").map(Number),o=new Date(n,s-1,a);return o.setDate(o.getDate()+e),q(o)}function ss(t){return Ct(t,-1)}class ha{constructor(){this._state={currentTab:"log",currentDate:q(new Date),isDirty:!1,hasSavedRecord:!1,dashRange:7,sleepThresholds:{green:"23:30",yellow:"01:00"}},this._listeners=new Set}get state(){return this._state}set(e){const n={...this._state};this._state={...this._state,...e},this._notify(this._state,n)}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(e,n){this._listeners.forEach(s=>{try{s(e,n)}catch(a){console.error("State subscriber error:",a)}})}}const tt=new ha,va=`<!-- 1. 记一笔 (Log View) 模块模板 -->
<section id="view-log" class="fade-in space-y-3">
  <!-- 日期切换行：单线药丸样式，日期数字 font-mono -->
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <input type="date" id="input-date" class="bg-white border border-neutral-200 text-neutral-800 text-xs font-mono font-medium rounded-lg px-3 py-1.5 w-[138px] outline-none focus:border-neutral-700 transition-colors">
      <span class="text-[10px] font-mono text-neutral-400">已记 <span id="log-count" class="text-neutral-600">0/6</span></span>
    </div>
    <button id="btn-today-date" class="text-[11px] font-medium text-neutral-600 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-all active:scale-95 font-mono">今日</button>
  </div>

  <!-- 晨光：极简卡，1.5px 太阳 SVG + 极简双态按钮 -->
  <div class="ht-card flex items-center justify-between">
    <div class="flex items-center gap-2.5 min-w-0">
      <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-neutral-800">晨光</p>
        <p class="text-[10px] text-neutral-400 truncate font-mono">起床后 1h 内</p>
      </div>
    </div>
    <div class="flex gap-1 shrink-0" id="morningLightPills">
      <button type="button" class="ht-seg-btn" data-val="yes">YES</button>
      <button type="button" class="ht-seg-btn" data-val="no">NO</button>
    </div>
  </div>

  <!-- 昨晚睡眠卡：通栏单线，时长等宽大数字 -->
  <div class="ht-card">
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
        <p class="text-xs font-medium text-neutral-800">昨晚睡眠</p>
      </div>
      <span id="sleepTagBadge" class="badge-green text-[9px] px-1.5 py-0.5">● 未熬夜</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-baseline gap-1 shrink-0">
        <input type="number" step="0.1" id="sleepDuration" value="6.8" class="text-3xl font-bold font-mono text-neutral-900 w-[72px] outline-none bg-transparent border-b border-neutral-200 focus:border-neutral-800 pb-0.5 transition-colors tabular-nums">
        <span class="text-sm font-mono font-medium text-neutral-400">h</span>
      </div>
      <div class="flex-1 min-w-0 flex flex-col gap-1.5">
        <label class="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
          <span class="shrink-0 w-7">入睡</span>
          <input type="time" id="sleepBedTime" value="00:30" class="flex-1 min-w-0 w-0 border-b border-neutral-200 focus:border-neutral-800 py-0.5 text-[11px] font-mono font-medium text-neutral-700 outline-none bg-transparent transition-colors">
        </label>
        <label class="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
          <span class="shrink-0 w-7">起床</span>
          <input type="time" id="sleepWakeTime" value="07:15" class="flex-1 min-w-0 w-0 border-b border-neutral-200 focus:border-neutral-800 py-0.5 text-[11px] font-mono font-medium text-neutral-700 outline-none bg-transparent transition-colors">
        </label>
      </div>
    </div>
    <div id="diff-sleep" class="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-400 font-mono font-medium">
      <span>较昨日 --</span><span class="text-neutral-300">节律</span>
    </div>
  </div>

  <!-- 睡前体重 -->
  <div class="ht-card">
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
        <p class="text-xs font-medium text-neutral-800">睡前体重</p>
      </div>
    </div>
    <div class="flex items-baseline gap-1.5">
      <input type="number" step="0.1" id="input-weight-pm" placeholder="--" class="text-2xl font-bold font-mono text-neutral-900 w-full min-w-0 outline-none bg-transparent placeholder-neutral-200 border-b border-neutral-200 focus:border-neutral-800 pb-0.5 transition-colors tabular-nums">
      <span class="text-xs font-mono font-medium text-neutral-400 shrink-0 pb-0.5">kg</span>
    </div>
    <div id="diff-weight-pm" class="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-400 font-mono font-medium">
      <span>等待今晚称重</span>
      <span class="text-neutral-300">--:--</span>
    </div>
  </div>

  <!-- 晨起数据大卡：晨起空腹体重 + 晨起腰围 2 列 -->
  <div class="ht-card">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>
        </div>
        <p class="text-xs font-medium text-neutral-800">晨起数据</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <!-- 晨起空腹体重 -->
      <div>
        <p class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2">空腹体重</p>
        <div class="flex items-baseline gap-1">
          <input type="number" step="0.1" id="input-weight-am" placeholder="--" class="text-2xl font-bold font-mono text-neutral-900 w-full min-w-0 outline-none bg-transparent placeholder-neutral-200 border-b border-neutral-200 focus:border-neutral-800 pb-0.5 transition-colors tabular-nums">
          <span class="text-xs font-mono font-medium text-neutral-400 shrink-0 pb-0.5">kg</span>
        </div>
        <div id="diff-weight-am" class="mt-1.5 text-[9px] text-neutral-400 font-mono font-medium flex items-center justify-between">
          <span>较昨日 --</span><span class="text-neutral-300">晨测</span>
        </div>
      </div>
      <!-- 晨起腰围 -->
      <div class="border-l border-neutral-100 pl-4">
        <p class="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2">腰围</p>
        <div class="flex items-baseline gap-1">
          <input type="number" step="0.1" id="input-waist" placeholder="--" class="text-2xl font-bold font-mono text-neutral-900 w-full min-w-0 outline-none bg-transparent placeholder-neutral-200 border-b border-neutral-200 focus:border-neutral-800 pb-0.5 transition-colors tabular-nums">
          <span class="text-xs font-mono font-medium text-neutral-400 shrink-0 pb-0.5">cm</span>
        </div>
        <div id="diff-waist" class="mt-1.5 text-[9px] text-neutral-400 font-mono font-medium flex items-center justify-between">
          <span>较昨日 --</span><span class="text-neutral-300">标准</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 身体感受自由记录 -->
  <div class="space-y-1.5" id="journal-section">
    <div class="flex justify-between items-center text-xs">
      <span class="font-medium text-neutral-800">身体感受与自由记录</span>
      <div class="flex items-center gap-2">
        <button type="button" id="btn-clear-journal" class="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 transition-colors hidden" title="清空内容">清空</button>
        <span class="text-[10px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">饮食已结构化</span>
      </div>
    </div>
    <div class="relative">
      <textarea id="input-journal" rows="3" class="w-full ht-card text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-neutral-700 transition-all resize-none leading-relaxed" placeholder="如：今天状态还行，下午 3 点有点困，喝了杯水走动一下缓过来了…"></textarea>
    </div>
  </div>

  <!-- 午餐：折叠卡 -->
  <div class="apple-card rounded-xl overflow-hidden">
    <div class="px-3.5 py-3 flex items-center justify-between cursor-pointer select-none" id="lunch-toggle">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-neutral-800">午餐</p>
          <p id="lunch-summary" class="text-[10px] text-neutral-400 truncate font-mono">今天还没记午餐</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" id="btn-lunch-template" class="text-[10px] font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-full active:scale-95">沿用昨天</button>
        <span id="lunch-icon" class="text-xs text-neutral-400 transform transition-transform">▼</span>
      </div>
    </div>

    <div id="lunch-body" class="hidden px-3.5 pb-3.5 pt-2.5 border-t border-neutral-100 space-y-2">
      <p class="text-[10px] text-neutral-400 font-mono">只记午饭 · 用于观察 13:00–15:00 状态，不必逐餐记账</p>
      <div class="flex items-center justify-between gap-2">
        <span class="text-[10px] font-medium text-neutral-500 shrink-0 w-[52px]">吃了吗</span>
        <div class="flex flex-1 flex-wrap gap-1.5 justify-start" id="lunch-eaten">
          <button type="button" class="pill-sm-btn" data-val="eaten">吃了</button>
          <button type="button" class="pill-sm-btn" data-val="skipped">跳过</button>
        </div>
      </div>
      <div class="flex items-start justify-between gap-2" id="lunch-protein-row">
        <span class="text-[10px] font-medium text-neutral-500 shrink-0 w-[52px] pt-1">蛋白来源</span>
        <div class="flex flex-1 flex-wrap gap-1.5 justify-start" id="lunch-protein">
          <span class="chip" data-val="chicken">鸡胸</span>
          <span class="chip" data-val="egg">蛋</span>
          <span class="chip" data-val="fish">鱼</span>
          <span class="chip" data-val="beef">牛肉</span>
          <span class="chip" data-val="soy">豆制品</span>
          <span class="chip" data-val="yogurt">酸奶</span>
          <span class="chip" data-val="other">其他</span>
        </div>
      </div>
      <div class="flex items-center justify-between gap-2" id="lunch-protein-g-row">
        <span class="text-[10px] font-medium text-neutral-500 shrink-0 w-[52px]">蛋白量</span>
        <div class="flex flex-1 flex-wrap gap-1.5 justify-start" id="lunch-protein-g">
          <button type="button" class="pill-sm-btn" data-val="15">约15g</button>
          <button type="button" class="pill-sm-btn" data-val="25">约25g</button>
          <button type="button" class="pill-sm-btn" data-val="35">约35g</button>
        </div>
      </div>
      <div class="flex items-center justify-between gap-2" id="lunch-staple-row">
        <span class="text-[10px] font-medium text-neutral-500 shrink-0 w-[52px]">主食</span>
        <div class="flex flex-1 flex-wrap gap-1.5 justify-start" id="lunch-staple">
          <button type="button" class="pill-sm-btn" data-val="rice">白米饭</button>
          <button type="button" class="pill-sm-btn" data-val="noodle">面条</button>
          <button type="button" class="pill-sm-btn" data-val="grains">杂粮</button>
          <button type="button" class="pill-sm-btn" data-val="potato">薯类</button>
          <button type="button" class="pill-sm-btn" data-val="none">无主食</button>
        </div>
      </div>
      <div class="flex items-center justify-between gap-2" id="lunch-carb-row">
        <span class="text-[10px] font-medium text-neutral-500 shrink-0 w-[52px]">碳水</span>
        <div class="flex flex-1 flex-wrap gap-1.5 justify-start" id="lunch-carb">
          <button type="button" class="pill-sm-btn" data-val="lt20">&lt;20g</button>
          <button type="button" class="pill-sm-btn" data-val="20_35">20–35g</button>
          <button type="button" class="pill-sm-btn" data-val="35_50">35–50g</button>
          <button type="button" class="pill-sm-btn" data-val="gt50">&gt;50g</button>
        </div>
      </div>
      <div class="flex items-center justify-between gap-2" id="lunch-cook-row">
        <span class="text-[10px] font-medium text-neutral-500 shrink-0 w-[52px]">烹饪</span>
        <div class="flex flex-1 flex-wrap gap-1.5 justify-start" id="lunch-cook">
          <button type="button" class="pill-sm-btn" data-val="steam">蒸煮</button>
          <button type="button" class="pill-sm-btn" data-val="stir_fry">炒</button>
          <button type="button" class="pill-sm-btn" data-val="fry">煎炸</button>
          <button type="button" class="pill-sm-btn" data-val="raw">生食</button>
          <button type="button" class="pill-sm-btn" data-val="takeout">外卖</button>
        </div>
      </div>
      <div id="lunch-yesterday" class="mt-1 pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono truncate">昨天：--</div>
    </div>
  </div>

  <!-- 步数：极客风卡，1.5px 步行 SVG，巨大等宽数字，极细滑轨 -->
  <div class="ht-card space-y-2.5">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><path d="M9 12l2 2 4-4"/><path d="M14 8l-2 4-3 2-2 4"/><path d="M10 8l3 1 2-2"/></svg>
        </div>
        <div class="flex items-center gap-1.5 min-w-0">
          <p class="text-xs font-medium text-neutral-800">步数</p>
          <span id="steps-source-badge" class="hidden text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-500 bg-neutral-50 leading-none">手机计步</span>
        </div>
      </div>
      <div class="flex items-baseline gap-1 shrink-0">
        <span id="steps-value" class="text-2xl font-bold text-neutral-900 leading-none font-mono tracking-tighter tabular-nums">--</span>
        <span class="text-[10px] font-medium text-neutral-400 font-mono">步</span>
      </div>
    </div>
    <input type="range" id="input-steps" min="0" max="20000" step="500" value="0" class="ht-range w-full cursor-pointer">
    <div class="flex justify-between text-[9px] font-mono text-neutral-300">
      <span>0</span><span>5k</span><span>10k</span><span>15k</span><span>20k</span>
    </div>
    <div class="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
      <span id="steps-meta" class="text-[11px] font-mono text-neutral-500 truncate">昨 -- · 7日均 -- 步</span>
      <div class="flex items-center gap-1.5 shrink-0 ml-2">
        <button type="button" id="btn-sync-steps" class="hidden text-[10px] font-mono text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 transition-colors">同步</button>
        <button type="button" id="btn-clear-steps" class="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200 transition-colors">留空</button>
      </div>
    </div>
  </div>

  <!-- 专项生理打卡折叠面板 -->
  <div class="apple-card rounded-xl overflow-hidden transition-all">
    <div class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/80 transition-colors" id="biohack-toggle">
      <span class="text-xs font-medium text-neutral-800 flex items-center space-x-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-500 shrink-0"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
        <span>专项生理打卡（运动 · 专注达 · 冷水澡）</span>
      </span>
      <div class="flex items-center gap-2 shrink-0">
        <span id="accordionIcon" class="text-xs text-neutral-400 transform transition-transform">▼</span>
      </div>
    </div>
    <div id="biohackBody" class="p-4 pt-1 space-y-4 border-t border-neutral-100 hidden">
      <!-- 1. 运动模块 -->
      <div class="space-y-2.5 pb-3 border-b border-neutral-100">
        <span class="text-xs font-medium text-neutral-700 block">运动训练</span>
        <div class="flex space-x-2" id="exerciseTypePills">
          <button type="button" class="pill-btn active" data-val="none">无运动</button>
          <button type="button" class="pill-btn" data-val="cardio">有氧运动</button>
          <button type="button" class="pill-btn" data-val="strength">力量抗阻</button>
        </div>
        <p class="text-[10px] text-neutral-400 font-mono">有氧与力量可同时选中；点「无运动」清空其他选择</p>
        <div id="exerciseSubForm" class="space-y-2 pt-1 hidden">
          <div class="flex items-center justify-between text-xs text-neutral-500">
            <span>强度:</span>
            <div class="flex space-x-1.5" id="exerciseIntensityPills">
              <button type="button" class="pill-sm-btn active" data-val="light">轻松</button>
              <button type="button" class="pill-sm-btn" data-val="medium">中等</button>
              <button type="button" class="pill-sm-btn" data-val="failure">力竭/过载</button>
            </div>
          </div>
          <div class="flex space-x-2 text-xs">
            <div class="flex items-center space-x-1">
              <input type="number" id="exerciseDuration" placeholder="40" class="w-16 border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2.5 py-1.5 outline-none font-bold font-mono text-center text-neutral-800 focus:border-neutral-800 transition-colors" value="40">
              <span class="text-xs text-neutral-400 font-mono">分</span>
            </div>
            <input type="text" id="exerciseItems" placeholder="备注，如 骑行3km / 腿部深蹲" class="flex-1 border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2.5 py-1.5 outline-none font-mono text-xs placeholder-neutral-400 text-neutral-800 focus:border-neutral-800 transition-colors">
          </div>
        </div>
      </div>
      <!-- 2. 专注达模块 -->
      <div class="space-y-2.5 pb-3 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-neutral-700">专注达服药追踪</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="concertaEnabled" class="sr-only peer">
            <div class="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-neutral-900"></div>
          </label>
        </div>
        <div id="concertaSubForm" class="space-y-2.5 pt-1 hidden">
          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="flex items-center space-x-1.5">
              <span class="text-neutral-500 shrink-0">时间:</span>
              <input type="time" id="concertaTime" value="08:00" class="border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-neutral-800 text-xs font-mono text-neutral-800 w-full transition-colors">
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="text-neutral-500 shrink-0">剂量:</span>
              <select id="concertaDose" class="border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-neutral-800 text-xs font-mono text-neutral-800 w-full transition-colors">
                <option value="18">18mg</option>
                <option value="36" selected>36mg</option>
                <option value="54">54mg</option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-neutral-600 font-mono">
              <span>工作启动力:</span>
              <span id="focusWorkText" class="font-bold text-neutral-900">4分</span>
            </div>
            <input type="range" id="focusWork" min="1" max="5" value="4" class="ht-range w-full cursor-pointer">
          </div>
          <div class="space-y-1">
            <span class="text-[10px] text-neutral-400 font-mono block">副作用表现:</span>
            <div class="flex flex-wrap gap-1.5" id="concertaSideEffects">
              <span class="chip" data-key="appetite_loss">食欲抑制</span>
              <span class="chip" data-key="thirst">口干</span>
              <span class="chip" data-key="crash">晚间疲劳Crash</span>
            </div>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] text-neutral-400 font-mono block">晚间代偿手段:</span>
            <div class="flex flex-wrap gap-1.5" id="concertaCompensations">
              <span class="chip chip-warn" data-key="monster_energy">魔爪/高咖啡因</span>
              <span class="chip chip-warn" data-key="sugar_craving">高糖暴食冲动</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 3. 冷水澡模块 -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-neutral-700">冷水澡刺激</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="coldShowerEnabled" class="sr-only peer">
            <div class="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-neutral-900"></div>
          </label>
        </div>
        <div id="coldShowerSubForm" class="space-y-2.5 pt-1 hidden font-mono">
          <!-- 时段：时间框 + 快捷胶囊 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs text-neutral-600">
              <span class="text-neutral-500">时段:</span>
              <input type="time" id="coldShowerTime" value="07:30" class="border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2.5 py-1 text-xs font-mono font-medium outline-none focus:border-neutral-800 transition-colors">
            </div>
            <div class="flex flex-wrap gap-1.5 justify-end" id="csQuickTimingPills">
              <button type="button" class="pill-sm-btn active" data-time="07:30">晨起 07:30</button>
              <button type="button" class="pill-sm-btn" data-time="14:00">午后 14:00</button>
              <button type="button" class="pill-sm-btn" data-time="18:30">训练后 18:30</button>
              <button type="button" class="pill-sm-btn" data-time="22:30">睡前 22:30</button>
            </div>
          </div>
          <!-- 时长：秒为单位 + 快捷阶梯 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs text-neutral-600">
              <span class="text-neutral-500">时长:</span>
              <div class="flex items-center space-x-1">
                <input type="number" id="coldShowerDuration" value="60" min="5" max="900" step="5" class="w-16 border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2 py-1 text-center font-bold text-neutral-800 outline-none focus:border-neutral-800 transition-colors">
                <span class="text-xs text-neutral-400 font-mono">秒</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 justify-end" id="csQuickDurationPills">
              <button type="button" class="pill-sm-btn" data-sec="30">30s</button>
              <button type="button" class="pill-sm-btn active" data-sec="60">60s</button>
              <button type="button" class="pill-sm-btn" data-sec="90">90s</button>
              <button type="button" class="pill-sm-btn" data-sec="120">120s</button>
            </div>
          </div>
          <!-- 水温 -->
          <div class="flex items-center justify-between text-xs text-neutral-600">
            <span class="text-neutral-500">水温(估):</span>
            <div class="flex items-center space-x-1">
              <input type="number" id="coldShowerWaterTemp" step="0.5" min="0" max="40" placeholder="--" class="w-16 border border-neutral-200 bg-neutral-50 focus:bg-white rounded-lg px-2 py-1 text-center font-bold text-neutral-800 outline-none focus:border-neutral-800 transition-colors">
              <span class="text-xs text-neutral-400 font-mono">℃</span>
            </div>
          </div>
          <!-- 即刻体感 -->
          <div class="space-y-1">
            <span class="text-[10px] text-neutral-400 font-mono block">即刻体感:</span>
            <div class="flex flex-wrap gap-1.5" id="csFeelingPills">
              <button type="button" class="pill-sm-btn active" data-val="refreshed">神清气爽</button>
              <button type="button" class="pill-sm-btn" data-val="neutral">无明显感觉</button>
              <button type="button" class="pill-sm-btn" data-val="shivering">寒冷困倦</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 吸底保存条：单线极简风格 -->
<div id="save-bar" class="shrink-0 px-4 py-2 bg-white/95 backdrop-blur-md border-t border-neutral-200/80">
  <div class="flex items-center justify-between gap-3">
    <div class="min-w-0 flex-1">
      <div id="save-status" class="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
        <span id="save-dot" class="w-2 h-2 rounded-full bg-neutral-300"></span>
        <span id="save-text" class="truncate">未修改</span>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0 font-mono">
      <button type="button" id="btn-reset-log" class="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-400 text-neutral-600 transition-colors">重置</button>
      <button type="button" id="btn-save-log" class="text-xs px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-colors">保存</button>
    </div>
  </div>
</div>
`;function as(t){const e=document.getElementById(t);return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement?e:null}function Ft(t){var e;return((e=as(t))==null?void 0:e.value)||""}let K=q(new Date),It=!1,ie=!1,je="",cn=!1,at=null,V=null,Ht=null,R={value:null,prefilled:null,autoDetected:!1},qt=null,At={touched:!1},ot={types:[],intensity:"light"},Ae={timing:"07:30",feeling:"refreshed"},Wt={green:"23:30",yellow:"01:00"};const Ln=["cardio","strength"],yt={protein:{chicken:"鸡胸",egg:"蛋",fish:"鱼",beef:"牛肉",soy:"豆制品",yogurt:"酸奶",other:"其他"},staple:{rice:"白米饭",noodle:"面条",grains:"杂粮",potato:"薯类",none:"无主食"},carb:{lt20:"<20g","20_35":"20–35g","35_50":"35–50g",gt50:">50g"},cook:{steam:"蒸煮",stir_fry:"炒",fry:"煎炸",raw:"生食",takeout:"外卖"}};async function ya(t){t.insertAdjacentHTML("beforeend",va),za(),Fa(),await wa(),await ke(K)}async function wa(){try{const t=await M.getConfig(),e=t.data||t;e.sleep_green_before&&(Wt.green=e.sleep_green_before),e.sleep_yellow_before&&(Wt.yellow=e.sleep_yellow_before),qe()}catch{}}window.addEventListener("sleep-thresholds-updated",t=>{t instanceof CustomEvent&&t.detail&&(t.detail.green&&(Wt.green=t.detail.green),t.detail.yellow&&(Wt.yellow=t.detail.yellow),qe())});async function ke(t){K=t,ie=!0;const e=g("input-date");e&&(e.value=t);let n=null;try{const s=Ct(t,-6),a=await M.getHistoryRecords(s,t),o=a&&Array.isArray(a.data)?a.data:Array.isArray(a)?a:[];V=o.find(i=>i.record_date===ss(t))||null,n=o.find(i=>i.record_date===t)||null,En(n),$a(o,t),Tt(),Da(),cn=!!n,je=n?ka(n):""}catch(s){console.error("加载单日记录失败:",s)}finally{It=!1,ie=!1,un(),Vt(),Ne();const s=Pa(t);s&&(ie=!0,En(s),Tt(),ie=!1,It=!0,Vt(),Ne(),$("已恢复上次未保存的草稿"));const a=t===q(new Date);if(a&&R.value===null&&dn()&&typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission()){const o=window.HealthTrack.getTodaySteps();o>0&&(R.value=Math.max(0,Math.min(3e4,Math.round(o))),R.autoDetected=!0,Tt(),Vt())}Gt(a)}}function ka(t){if(!t||!t.updated_at)return"";const e=new Date(t.updated_at);return isNaN(e.getTime())||e.getFullYear()<2e3?"":e.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1})}function En(t){t=t||{};const e=(y,E)=>{const _=as(y);_&&(_.value=E==null?"":String(E))};if(e("input-weight-am",t.weight_am),e("input-weight-pm",t.weight_pm),e("input-waist",t.waist_size),e("input-journal",t.journal_text||t.journal||""),nn(),en(),e("sleepBedTime",t.sleep_start_time||t.sleep_bed_time||"00:30"),e("sleepWakeTime",t.sleep_end_time||t.sleep_wake_time||"07:15"),qe(),t.sleep_hours!==null&&t.sleep_hours!==void 0){const y=g("sleepDuration");y&&(y.value=String(t.sleep_hours))}const n=t.exercise||{},s=Array.isArray(n.types)?n.types.slice():n.type&&n.type!=="none"?[n.type]:[];us(s),s.length>0?(fs(n.intensity||"light"),e("exerciseDuration",n.duration||40),e("exerciseItems",n.items||"")):(e("exerciseDuration",40),e("exerciseItems",""));const a=t.concerta,o=!!(a&&a.taken),i=g("concertaEnabled");if(i&&(i.checked=o),ms(o),o){e("concertaTime",a.time||"08:00"),e("concertaDose",String(a.dose||36)),e("focusWork",a.focus_work||4);const y=l("focusWorkText");y&&(y.innerText=(a.focus_work||4)+"分")}const r=a&&a.side_effects||[];document.querySelectorAll("#concertaSideEffects .chip").forEach(y=>{y.classList.toggle("active",r.includes(y.getAttribute("data-key")))});const c=a&&a.compensations||[];document.querySelectorAll("#concertaCompensations .chip").forEach(y=>{y.classList.toggle("active",c.includes(y.getAttribute("data-key")))});const d=t.cold_shower,u=!!(d&&d.enabled),m=g("coldShowerEnabled");m&&(m.checked=u),xs(u);let v=d&&d.timing||"07:30";v==="morning"?v="07:30":v==="post_workout"?v="18:30":v==="evening"&&(v="22:30"),sn(v),hs(d&&d.feeling||"refreshed");let x=(d&&d.duration)!==void 0&&d.duration!==null?Number(d.duration):60;x>0&&x<=10&&(x=x*60),gs(x),e("coldShowerWaterTemp",d&&d.water_temp!==null&&d.water_temp!==void 0?d.water_temp:""),Ht=t.morning_light===!0?"yes":t.morning_light===!1?"no":null,is(),R.value=t.steps===null||t.steps===void 0?null:Number(t.steps),R.autoDetected=!1,Tt(),ds(t.lunch||null)}function os(){var c,d,u;const t=K||((c=g("input-date"))==null?void 0:c.value)||q(new Date),e=Ft,n=m=>m===""||m===null||m===void 0||isNaN(parseFloat(m))?null:parseFloat(m),s=[];document.querySelectorAll("#concertaSideEffects .chip.active").forEach(m=>{const v=m.getAttribute("data-key");v&&s.push(v)});const a=[];document.querySelectorAll("#concertaCompensations .chip.active").forEach(m=>{const v=m.getAttribute("data-key");v&&a.push(v)});const i=!!((d=g("concertaEnabled"))!=null&&d.checked)?{taken:!0,time:e("concertaTime")||"08:00",dose:parseInt(e("concertaDose"),10)||36,focus_work:parseInt(e("focusWork"),10)||4,focus_study:4,daily_tasks:4,social:4,gaming:4,crash_time:"18:00",side_effects:s,compensations:a}:{taken:!1},r=e("coldShowerWaterTemp");return{record_date:t,weight_am:n(e("input-weight-am")),weight_pm:n(e("input-weight-pm")),waist_size:n(e("input-waist")),sleep_hours:n(e("sleepDuration")),sleep_start_time:e("sleepBedTime")||null,sleep_end_time:e("sleepWakeTime")||null,journal_text:e("input-journal")||"",exercise:{types:ot.types.slice(),type:ot.types[0]||"none",duration:parseInt(e("exerciseDuration"),10)||0,intensity:ot.intensity,items:e("exerciseItems")||""},cold_shower:{enabled:!!((u=g("coldShowerEnabled"))!=null&&u.checked),timing:e("coldShowerTime")||Ae.timing||"07:30",duration:parseInt(e("coldShowerDuration"),10)||60,water_temp:r===""?null:parseFloat(r),feeling:Ae.feeling},concerta:i,morning_light:Ht==="yes"?!0:Ht==="no"?!1:null,steps:R.value,lunch:Ha()}}async function Ta(){const t=os(),e=t.record_date,n=Y("btn-save-log");n&&(n.disabled=!0);try{const s=await M.saveRecord(t);s&&(s.code===200||s.status===200||!s.code)?(It=!1,cn=!0,je=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1}),at&&(clearTimeout(at),at=null),Oa(e),Ne(),$("✓ 保存成功"),ke(e)):$(s&&s.message||"保存失败",!1)}catch(s){const a=s instanceof Error?s.message:String(s);$("保存失败: "+a,!1)}finally{n&&(n.disabled=!1)}}function La(t){Ht=Ht===t?null:t,is(),W()}function is(){document.querySelectorAll("#morningLightPills button").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-val")===Ht)})}function dn(){return!!(window.HealthTrack&&typeof window.HealthTrack.isStepSensorAvailable=="function"&&window.HealthTrack.isStepSensorAvailable())}function Gt(t){const e=document.getElementById("steps-source-badge"),n=document.getElementById("btn-sync-steps");if(!t||!dn()){e&&e.classList.add("hidden"),n&&n.classList.add("hidden");return}const s=typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission();n&&(n.classList.remove("hidden"),n.innerText=s?"同步":"授权",n.title=s?"同步手机硬件计步器步数":"申请手机计步权限"),e&&(s&&R.autoDetected?e.classList.remove("hidden"):e.classList.add("hidden"))}function Sn(t=!1){if(!dn()){t&&$("当前环境未检测到计步传感器");return}if(!(K===q(new Date))){t&&$("仅支持同步当天的实时步数");return}if(!(typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission())){typeof window.HealthTrack.requestStepPermission=="function"&&(window.HealthTrack.requestStepPermission(),t&&$("正在请求手机计步权限…"));return}const s=window.HealthTrack.getTodaySteps();if(s<0){t&&$("未读取到有效步数");return}const a=Math.max(0,Math.min(3e4,Math.round(s)));R.value=a,R.autoDetected=!0,Tt(),Gt(!0),Vt(),W(),t&&$(`已同步手机计步 ${a.toLocaleString("en-US")} 步`)}function Ea(t){const e=Number(t);R.value=isNaN(e)?null:Math.max(0,Math.min(2e4,Math.round(e/500)*500)),R.autoDetected=!1,Tt(),Gt(K===q(new Date)),W()}function Sa(){R.value=null,R.autoDetected=!1,Tt(),Gt(K===q(new Date)),W()}function Tt(){const t=g("input-steps");if(!t)return;R.prefilled=R.value===null?qt:null;const e=R.value===null?qt===null?0:qt:R.value;t.value=String(Math.max(0,Math.min(2e4,Math.round(e/500)*500))),_a()}function _a(){const t=R.value,e=document.getElementById("steps-value");e&&(e.innerText=t===null?"--":t.toLocaleString("en-US"));const n=document.getElementById("steps-hint");n&&(t===null&&R.prefilled!==null?n.innerText=`拖动滑块记录 · 已预置昨天 ${R.prefilled.toLocaleString("en-US")} 步`:n.innerText="留空表示当天未记录 · 图表断点")}function $a(t,e){const n=t.find(i=>i.record_date===ss(e));qt=n&&n.steps!==null&&n.steps!==void 0?Number(n.steps):null;const s=t.filter(i=>i.record_date!==e&&i.steps!==null&&i.steps!==void 0).map(i=>Number(i.steps)),a=s.length?Math.round(s.reduce((i,r)=>i+r,0)/s.length):null,o=document.getElementById("steps-meta");if(o){const i=qt===null?"--":qt.toLocaleString("en-US"),r=a===null?"--":a.toLocaleString("en-US");o.innerHTML=`昨 <span class="font-medium text-neutral-700">${i}</span> · 7日均 <span class="font-medium text-neutral-700">${r}</span> 步`}}function Ma(){const t=document.getElementById("lunch-body"),e=document.getElementById("lunch-icon");if(!t)return;const n=t.classList.toggle("hidden");e&&(e.style.transform=n?"rotate(0deg)":"rotate(180deg)")}function _n(t){t.parentElement.querySelectorAll(".pill-sm-btn").forEach(e=>e.classList.remove("active")),t.classList.add("active"),At.touched=!0,rs()}function Ca(t){t.classList.toggle("active"),At.touched=!0,rs()}function rs(){ls(),cs(),W()}function ls(){const t=nt("lunch-eaten")==="skipped";["lunch-protein-row","lunch-protein-g-row","lunch-staple-row","lunch-carb-row","lunch-cook-row"].forEach(e=>{const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)})}function nt(t){const e=document.querySelector(`#${t} .pill-sm-btn.active`);return e?e.getAttribute("data-val"):""}function cs(){const t=document.getElementById("lunch-summary");if(!t)return;if(!At.touched){t.innerText="今天还没记午餐";return}if(nt("lunch-eaten")==="skipped"){t.innerText="今天跳过午餐";return}const e=Array.from(document.querySelectorAll("#lunch-protein .chip.active")).map(a=>yt.protein[a.getAttribute("data-val")]||""),n=nt("lunch-protein-g"),s=[e.length?e.join("、"):"未选蛋白",n?`约${n}g`:"",yt.staple[nt("lunch-staple")]||"",yt.carb[nt("lunch-carb")]||"",yt.cook[nt("lunch-cook")]||""].filter(Boolean);t.innerText=s.join(" · ")||"已记午餐（明细空白）"}function Ia(t){return t?t.eaten==="skipped"?"跳过":[(t.protein||[]).map(n=>yt.protein[n]||n).join("、"),t.protein_g?`约${t.protein_g}g`:"",yt.staple[t.staple]||"",yt.carb[t.carb_g]||"",yt.cook[t.cooking]||""].filter(Boolean).join(" · "):""}function Ha(){if(!At.touched)return null;const t=Array.from(document.querySelectorAll("#lunch-protein .chip.active")).map(e=>e.getAttribute("data-val"));return{eaten:nt("lunch-eaten")||"eaten",protein:t,protein_g:parseInt(nt("lunch-protein-g"),10)||0,staple:nt("lunch-staple"),carb_g:nt("lunch-carb"),cooking:nt("lunch-cook")}}function ds(t){if(document.querySelectorAll("#lunch-eaten .pill-sm-btn, #lunch-protein-g .pill-sm-btn, #lunch-staple .pill-sm-btn, #lunch-carb .pill-sm-btn, #lunch-cook .pill-sm-btn").forEach(e=>e.classList.remove("active")),document.querySelectorAll("#lunch-protein .chip").forEach(e=>e.classList.remove("active")),At.touched=!!t,t){const e=(n,s)=>{const a=document.querySelector(`#${n} [data-val="${s}"]`);a&&a.classList.add("active")};e("lunch-eaten",t.eaten||"eaten"),(t.protein||[]).forEach(n=>e("lunch-protein",n)),t.protein_g&&e("lunch-protein-g",String(t.protein_g)),t.staple&&e("lunch-staple",t.staple),t.carb_g&&e("lunch-carb",t.carb_g),t.cooking&&e("lunch-cook",t.cooking)}ls(),cs()}function Ba(){const t=V&&V.lunch;if(!t){$("昨天没有午餐记录，先手动记一次",!1);return}ds(t),At.touched=!0,W(),$("已沿用昨天的午餐")}function Da(){const t=document.getElementById("lunch-yesterday");if(!t)return;const e=V&&V.lunch;t.innerText="昨天："+(e?Ia(e):"--")}function en(){const t=Kt("input-journal"),e=l("btn-clear-journal");!t||!e||(t.value&&t.value.trim().length>0?e.classList.remove("hidden"):e.classList.add("hidden"))}function nn(){const t=document.getElementById("input-journal");if(!t)return;t.style.height="auto";const e=Math.min(Math.max(t.scrollHeight,68),240);t.style.height=`${e}px`}function Ze(t){if(!t)return NaN;const e=t.trim().split(":");if(e.length!==2)return NaN;const n=parseInt(e[0],10),s=parseInt(e[1],10);if(isNaN(n)||isNaN(s))return NaN;let a=n*60+s;return n>=0&&n<=6&&(a+=24*60),a}function ja(t,e,n){const s=Ze(t);if(isNaN(s))return"GREEN";let a=Ze(e),o=Ze(n);return isNaN(a)&&(a=23*60+30),isNaN(o)&&(o=25*60),s<a?"GREEN":s<o?"YELLOW":"RED"}function qe(){var m,v;const t=(m=g("sleepBedTime"))==null?void 0:m.value,e=(v=g("sleepWakeTime"))==null?void 0:v.value;if(!t||!e)return;const[n,s]=t.split(":").map(Number),[a,o]=e.split(":").map(Number);let i=n*60+s,r=a*60+o;r<=i&&(r+=1440);const c=((r-i)/60).toFixed(1),d=g("sleepDuration");d&&(d.value=c);const u=document.getElementById("sleepTagBadge");if(u){const x=ja(t,Wt.green,Wt.yellow);u.classList.remove("badge-green","badge-yellow","badge-red"),x==="YELLOW"?(u.classList.add("badge-yellow"),u.innerText="● 轻度熬夜"):x==="RED"?(u.classList.add("badge-red"),u.innerText="● 重度熬夜"):(u.classList.add("badge-green"),u.innerText="● 未熬夜")}un()}function Aa(){const t=document.getElementById("biohackBody"),e=document.getElementById("accordionIcon");if(!t)return;const n=t.classList.toggle("hidden");e&&(e.style.transform=n?"rotate(0deg)":"rotate(180deg)")}function us(t){ot.types=(t||[]).filter(e=>e&&e!=="none"),ps()}function Na(t){if(t==="none"){us([]);return}const e=ot.types.indexOf(t);e>=0?ot.types.splice(e,1):(ot.types.push(t),ot.types.sort((n,s)=>Ln.indexOf(n)-Ln.indexOf(s))),ps()}function ps(){const t=ot.types;document.querySelectorAll("#exerciseTypePills .pill-btn").forEach(n=>{const s=n.getAttribute("data-val");n.classList.toggle("active",s==="none"?t.length===0:t.includes(s))});const e=document.getElementById("exerciseSubForm");e&&e.classList.toggle("hidden",t.length===0)}function fs(t){ot.intensity=t,document.querySelectorAll("#exerciseIntensityPills .pill-sm-btn").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===t)})}function ms(t){const e=document.getElementById("concertaSubForm");e&&e.classList.toggle("hidden",!t)}function xs(t){const e=document.getElementById("coldShowerSubForm");e&&e.classList.toggle("hidden",!t)}function sn(t){Ae.timing=t;const e=g("coldShowerTime");e&&e.value!==t&&(e.value=t),document.querySelectorAll("#csQuickTimingPills .pill-sm-btn").forEach(n=>{n.classList.toggle("active",n.getAttribute("data-time")===t)})}function bs(t){document.querySelectorAll("#csQuickDurationPills .pill-sm-btn").forEach(e=>{e.classList.toggle("active",Number(e.getAttribute("data-sec"))===Number(t))})}function gs(t){const e=g("coldShowerDuration");e&&(e.value=String(t)),bs(t)}function hs(t){Ae.feeling=t,document.querySelectorAll("#csFeelingPills .pill-sm-btn").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===t)})}function un(){const t=parseFloat(Ft("input-weight-am")),e=document.getElementById("diff-weight-am");if(e)if(!isNaN(t)&&V&&V.weight_am!==null&&V.weight_am!==void 0){const c=Math.round((t-V.weight_am)*10)/10;c<0?e.innerHTML=`<span class="text-emerald-600 font-bold">↓ 较昨日 ${c.toFixed(1)}</span><span class="text-slate-300">晨测</span>`:c>0?e.innerHTML=`<span class="text-rose-500 font-bold">↑ 较昨日 +${c.toFixed(1)}</span><span class="text-slate-300">晨测</span>`:e.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晨测</span>'}else e.innerHTML='<span>较昨日 --</span><span class="text-slate-300">晨测</span>';const n=parseFloat(Ft("input-weight-pm")),s=document.getElementById("diff-weight-pm");if(s)if(isNaN(n))s.innerHTML='<span>等待今晚称重</span><span class="text-slate-300">--:--</span>';else if(V&&V.weight_pm!==null&&V.weight_pm!==void 0){const c=Math.round((n-V.weight_pm)*10)/10;c<0?s.innerHTML=`<span class="text-emerald-600 font-bold">↓ 较昨日 ${c.toFixed(1)}</span><span class="text-slate-300">晚测</span>`:c>0?s.innerHTML=`<span class="text-rose-500 font-bold">↑ 较昨日 +${c.toFixed(1)}</span><span class="text-slate-300">晚测</span>`:s.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晚测</span>'}else s.innerHTML='<span>今晚已记录</span><span class="text-slate-300">晚测</span>';const a=parseFloat(Ft("input-waist")),o=document.getElementById("diff-waist");if(o)if(!isNaN(a)&&V&&V.waist_size!==null&&V.waist_size!==void 0){const c=Math.round((a-V.waist_size)*10)/10;c<0?o.innerHTML=`<span class="text-indigo-600 font-bold">较昨日 ${c.toFixed(1)}</span><span class="text-slate-300">紧实</span>`:c>0?o.innerHTML=`<span class="text-amber-600 font-bold">较昨日 +${c.toFixed(1)}</span><span class="text-slate-300">略增</span>`:o.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">稳定</span>'}else o.innerHTML='<span>平稳区间</span><span class="text-slate-300">标准</span>';const i=parseFloat(Ft("sleepDuration")),r=document.getElementById("diff-sleep");if(r)if(!isNaN(i)&&V&&V.sleep_hours!==null&&V.sleep_hours!==void 0){const c=Math.round((i-V.sleep_hours)*10)/10;c<0?r.innerHTML=`<span class="text-amber-600 font-bold">较前日 ${c.toFixed(1)}h</span><span class="text-slate-300">偏短</span>`:c>0?r.innerHTML=`<span class="text-emerald-600 font-bold">较前日 +${c.toFixed(1)}h</span><span class="text-slate-300">充足</span>`:r.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较前日 持平</span><span class="text-neutral-300 font-mono">规律</span>'}else r.innerHTML='<span>较昨日 --</span><span class="text-slate-300">节律</span>'}function Vt(){const t=s=>Ft(s).trim()!=="";let e=0;(t("input-weight-am")||t("input-weight-pm"))&&e++,t("input-waist")&&e++,t("sleepDuration")&&e++,Ht!==null&&e++,R.value!==null&&e++,At.touched&&e++;const n=document.getElementById("log-count");n&&(n.innerText=`${e}/6`,n.className=e>=6?"text-emerald-600":"text-slate-600")}function W(){if(ie)return;It=!0,Vt(),Ne(),at&&clearTimeout(at);const t=K;at=setTimeout(()=>{at=null,vs(t)},400)}function Ra(){at&&(clearTimeout(at),at=null),It&&vs(K)}function Ne(){const t=document.getElementById("save-text"),e=document.getElementById("save-dot");!t||!e||(It?(e.className="w-2 h-2 rounded-full bg-amber-400 animate-pulse",t.innerText="未保存"):cn?(e.className="w-2 h-2 rounded-full bg-emerald-500",t.innerText=`已同步落库${je?" ("+je+")":""}`):(e.className="w-2 h-2 rounded-full bg-neutral-300",t.innerText="未修改"))}function pn(t){return`ht_log_draft_${t}`}function vs(t){if(t=t||K,!!t)try{localStorage.setItem(pn(t),JSON.stringify(os()))}catch{}}function Pa(t){try{const e=localStorage.getItem(pn(t));if(!e)return null;const n=JSON.parse(e);return n&&n.record_date===t?n:null}catch{return null}}function Oa(t){try{localStorage.removeItem(pn(t))}catch{}}function za(t=14){try{const e=Ct(q(new Date),-t),n=[];for(let s=0;s<localStorage.length;s++){const a=localStorage.key(s);if(!a)continue;const o=/^ht_log_draft_(\d{4}-\d{2}-\d{2})$/.exec(a);o&&o[1]<e&&n.push(a)}n.forEach(s=>localStorage.removeItem(s))}catch{}}async function $n(t){if(t&&t!==K){if(It){if(!await st(`当前日期还有未保存的改动（草稿已自动保存），确定切换到 ${t}？`,{title:"未保存改动",confirmText:"仍然切换",danger:!1})){const n=g("input-date");n&&(n.value=K);return}Ra()}await ke(t)}}function Fa(){var a,o,i,r,c,d,u,m,v,x,y,E,_,b,L,N,P,X,J,Rt,Et,Pt,ne;const t=g("input-date");t&&t.addEventListener("change",h=>{h.currentTarget instanceof HTMLInputElement&&$n(h.currentTarget.value)}),(a=l("btn-today-date"))==null||a.addEventListener("click",()=>{const h=q(new Date);$n(h)}),(o=l("morningLightPills"))==null||o.addEventListener("click",h=>{const S=B(h.target,"button[data-val]");S&&La(S.getAttribute("data-val"))}),(i=g("input-steps"))==null||i.addEventListener("input",h=>{h.currentTarget instanceof HTMLInputElement&&Ea(h.currentTarget.value)}),(r=l("btn-clear-steps"))==null||r.addEventListener("click",Sa),(c=l("btn-sync-steps"))==null||c.addEventListener("click",()=>Sn(!0)),window.onStepPermissionResult=h=>{h?($("已授权手机计步"),Sn(!1)):$("未获得计步权限"),Gt(K===q(new Date))},window.onNativeStepsUpdated=h=>{if(!(K===q(new Date))||typeof h!="number"||h<=0||R.value!==null&&!R.autoDetected)return;const et=Math.max(0,Math.min(3e4,Math.round(h)));R.value!==et&&(R.value=et,R.autoDetected=!0,Tt(),Gt(!0),Vt())},["input-weight-am","input-weight-pm","input-waist","sleepBedTime","sleepWakeTime","sleepDuration","input-journal","exerciseDuration","exerciseItems","concertaTime","concertaDose","focusWork","coldShowerTime","coldShowerDuration","coldShowerWaterTemp"].forEach(h=>{const S=document.getElementById(h);S&&S.addEventListener("input",()=>{h==="sleepBedTime"||h==="sleepWakeTime"?qe():un(),W()})});const n=document.getElementById("input-journal"),s=document.getElementById("main-content");n&&(n.addEventListener("focus",()=>{s&&(s.style.paddingBottom="96px"),setTimeout(()=>{n.scrollIntoView({behavior:"smooth",block:"center"})},120)}),n.addEventListener("blur",()=>{s&&(s.style.paddingBottom="")}),n.addEventListener("input",()=>{nn(),en()})),(d=document.getElementById("btn-clear-journal"))==null||d.addEventListener("click",async()=>{const h=Kt("input-journal");if(!h||!h.value)return;await st("确定清空自由记录吗？",{title:"清空自由记录",confirmText:"清空",danger:!0})&&(h.value="",nn(),en(),W())}),(u=l("lunch-toggle"))==null||u.addEventListener("click",h=>{B(h.target,"#btn-lunch-template")||Ma()}),(m=l("btn-lunch-template"))==null||m.addEventListener("click",h=>{h.stopPropagation(),Ba()}),(v=l("lunch-eaten"))==null||v.addEventListener("click",h=>{const S=B(h.target,".pill-sm-btn");S&&_n(S)}),(x=l("lunch-protein"))==null||x.addEventListener("click",h=>{const S=B(h.target,".chip");S&&Ca(S)}),["lunch-protein-g","lunch-staple","lunch-carb","lunch-cook"].forEach(h=>{var S;(S=l(h))==null||S.addEventListener("click",et=>{const ut=B(et.target,".pill-sm-btn");ut&&_n(ut)})}),(y=l("biohack-toggle"))==null||y.addEventListener("click",Aa),(E=l("exerciseTypePills"))==null||E.addEventListener("click",h=>{const S=B(h.target,".pill-btn");S&&(Na(S.getAttribute("data-val")),W())}),(_=l("exerciseIntensityPills"))==null||_.addEventListener("click",h=>{const S=B(h.target,".pill-sm-btn");S&&(fs(S.getAttribute("data-val")),W())}),(b=g("concertaEnabled"))==null||b.addEventListener("change",h=>{h.currentTarget instanceof HTMLInputElement&&(ms(h.currentTarget.checked),W())}),(L=g("focusWork"))==null||L.addEventListener("input",h=>{const S=l("focusWorkText");h.currentTarget instanceof HTMLInputElement&&S&&(S.innerText=h.currentTarget.value+"分"),W()}),["concertaSideEffects","concertaCompensations"].forEach(h=>{var S;(S=l(h))==null||S.addEventListener("click",et=>{const ut=B(et.target,".chip");ut&&(ut.classList.toggle("active"),W())})}),(N=g("coldShowerEnabled"))==null||N.addEventListener("change",h=>{h.currentTarget instanceof HTMLInputElement&&(xs(h.currentTarget.checked),W())}),(P=g("coldShowerTime"))==null||P.addEventListener("change",h=>{h.currentTarget instanceof HTMLInputElement&&(sn(h.currentTarget.value),W())}),(X=l("csQuickTimingPills"))==null||X.addEventListener("click",h=>{const S=B(h.target,".pill-sm-btn");S&&(sn(S.getAttribute("data-time")),W())}),(J=g("coldShowerDuration"))==null||J.addEventListener("input",h=>{h.currentTarget instanceof HTMLInputElement&&(bs(h.currentTarget.value),W())}),(Rt=l("csQuickDurationPills"))==null||Rt.addEventListener("click",h=>{const S=B(h.target,".pill-sm-btn");S&&(gs(Number(S.getAttribute("data-sec"))),W())}),(Et=l("csFeelingPills"))==null||Et.addEventListener("click",h=>{const S=B(h.target,".pill-sm-btn");S&&(hs(S.getAttribute("data-val")),W())}),(Pt=document.getElementById("btn-save-log"))==null||Pt.addEventListener("click",Ta),(ne=document.getElementById("btn-reset-log"))==null||ne.addEventListener("click",()=>ke(K))}const D={token:null,preview:null,mode:"merge",skipErrors:!1,busy:!1};let Mn=!1;function Ua(){if(Mn)return;const t=l("import-modal"),e=l("memo-import-modal");if(!t&&!e)return;Mn=!0,t==null||t.addEventListener("click",a=>{if(a.target===t){an();return}const o=B(a.target,"[data-action]");if(!o)return;const i=o.dataset.action;i==="import-close"?an():i==="imp-pick"?Wa():i==="imp-reselect"?Ve():i==="imp-mode"?ys(o):i==="imp-confirm"&&Za()});const n=g("import-file-input");n==null||n.addEventListener("change",a=>{a.currentTarget instanceof HTMLInputElement&&Ga(a.currentTarget)});const s=g("import-skip-errors");s==null||s.addEventListener("change",a=>{a.currentTarget instanceof HTMLInputElement&&Ka(a.currentTarget)}),e==null||e.addEventListener("click",a=>{if(a.target===e){Pe();return}const o=B(a.target,"[data-action]");if(!o)return;const i=o.dataset.action;i==="memo-close"?Pe():i==="memo-preview"&&eo()})}function U(t,e){var n;(n=l(t))==null||n.classList.toggle("hidden",!e)}function Ve(){D.token=null,D.preview=null,D.mode="merge",D.skipErrors=!1,D.busy=!1;const t=g("import-file-input");t&&(t.value=""),U("import-step-pick",!0),U("import-step-preview",!1),U("import-step-options",!1),U("import-fatal",!1),U("import-dup-tip",!1),U("import-issue-wrap",!1),U("import-diff-wrap",!1),U("import-result",!1),U("import-skip-wrap",!1),U("import-pick-btn",!0);const e=g("import-skip-errors");e&&(e.checked=!1);const n=l("import-result");n&&(n.textContent="");const s=l("import-subtitle");s&&(s.textContent="预检不写入数据，确认后才会导入"),pe(!1),Bt(!1);const a=document.querySelector('#import-step-options button[data-mode="merge"]');a instanceof HTMLElement&&ys(a)}function Bt(t){D.busy=t;const e=Y("import-pick-btn");e&&(e.disabled=t,e.classList.toggle("opacity-50",t),e.textContent=t?"预检中…":"选择文件");const n=Y("memo-preview-btn");n&&(n.disabled=t,n.classList.toggle("opacity-50",t),n.textContent=t?"预检中…":"预检");const s=Y("import-confirm-btn");s&&t&&(s.disabled=!0,s.classList.add("opacity-50"))}function pe(t,e){const n=Y("import-confirm-btn");n&&(n.disabled=!t,n.classList.toggle("opacity-50",!t),n.textContent=e||(D.preview&&D.preview.errors>0&&D.skipErrors?"跳过错误行并导入":"确认导入"))}function qa(){var t;Ve(),(t=l("import-modal"))==null||t.classList.remove("hidden")}function an(){var t;(t=l("import-modal"))==null||t.classList.add("hidden")}function Va(t){var e;Ve(),(e=l("import-modal"))==null||e.classList.remove("hidden"),fn(t)}function Wa(){var t;D.busy||(t=g("import-file-input"))==null||t.click()}function Ga(t){const e=t.files&&t.files[0];if(e){if(e.size>5*1024*1024){$("文件超过 5 MB，请按年份拆分后导入",!1),t.value="";return}Ja(e)}}async function Ja(t){Bt(!0);try{const e=new FormData;e.append("file",t),e.append("file_name",t.name||"");const n=await M.previewImportFile(e);if(!n||!n.data){Re("预检失败：服务端返回异常");return}fn(n.data)}catch(e){const n=e instanceof Error?e.message:"网络错误";Re("预检失败："+n)}finally{Bt(!1)}}function Re(t){U("import-step-pick",!0),U("import-step-preview",!1),U("import-result",!0);const e=l("import-result");e&&(e.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",e.textContent=t)}function fn(t){D.preview=t,D.token=t.token||null,D.skipErrors=!1,U("import-step-pick",!1),U("import-step-preview",!0),U("import-step-options",!0),U("import-result",!1);const e=t.source_type==="json"?"JSON 备份":t.source_type==="memo"?"备忘录粘贴":"CSV 文件",n=t.file_size?ts(t.file_size):"",s=t.source_type==="memo"?"":' · <button type="button" data-action="imp-reselect" class="text-neutral-900 font-semibold underline underline-offset-2">重新选择</button>',a=l("import-file-meta");a&&(a.innerHTML=`<span class="font-bold text-slate-700">${T(t.file_name||e)}</span> · ${e}${n?" · "+n:""} · 编码 ${T(t.encoding||"—")}${s}`);const o=l("imp-stat-total"),i=l("imp-stat-inserted"),r=l("imp-stat-updated"),c=l("imp-stat-warnings"),d=l("imp-stat-errors");o&&(o.textContent=String(t.total_rows||0)),i&&(i.textContent=String(t.inserted||0)),r&&(r.textContent=String(t.updated||0)),c&&(c.textContent=String(t.warnings||0)),d&&(d.textContent=String(t.errors||0));const u=l("import-dup-tip");u&&(t.duplicate?(u.classList.remove("hidden"),u.innerHTML=`这个文件在 ${T((t.duplicate.created_at||"").slice(0,10))} 已导入过一次（新增 ${t.duplicate.inserted} / 更新 ${t.duplicate.updated}），请确认不是重复操作。`):u.classList.add("hidden"));const m=l("import-fatal");m&&(t.fatal?(m.classList.remove("hidden"),m.textContent=t.fatal):m.classList.add("hidden")),Ya(t),Xa(t);const v=(t.errors||0)>0;U("import-skip-wrap",v&&!t.fatal);const x=g("import-skip-errors");x&&(x.checked=!1),pe(!!t.token&&!t.fatal&&(!v||D.skipErrors))}function Ya(t){const e=l("import-issue-wrap"),n=l("import-issue-list"),s=l("import-issue-count");if(!e||!n)return;const a=(t.issues||[]).filter(o=>o.level==="error"||o.level==="warning");if(!a.length){e.classList.add("hidden");return}e.classList.remove("hidden"),s&&(s.textContent=`共 ${t.errors||0} 条错误 / ${t.warnings||0} 条警告`+(t.issues_truncated?"（仅显示前 500 条）":"")),n.innerHTML=a.slice(0,50).map(o=>{const i=o.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${i?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${i?"错误":"警告"}</span>
      <span class="text-[11px] text-slate-600 leading-snug break-all">第 ${o.line} 行${o.date?" · "+T(o.date):""}：${T(o.message)}</span>
    </div>`}).join("")}function Xa(t){const e=l("import-diff-wrap"),n=l("import-diff-list"),s=l("import-diff-count");if(!e||!n)return;const a=t.row_diffs||[];if(!a.length){e.classList.add("hidden");return}e.classList.remove("hidden"),s&&(s.textContent=`前 ${a.length} 条`+(t.diffs_truncated?"（还有更多）":"")),n.innerHTML=a.slice(0,30).map(o=>{const i=o.action==="insert",r=(o.changes||[]).slice(0,4).map(c=>{const d=c.old===""?"空":c.old,u=c.new===""?"空":c.new;return`${c.label} ${d}→${u}`}).join("，");return`<div class="rounded-lg bg-white border border-slate-100 px-2.5 py-1.5">
      <div class="flex items-center justify-between text-[11px]">
        <span class="font-bold text-slate-700">${T(o.date)}</span>
        <span class="${i?"text-emerald-600":"text-neutral-900 font-semibold"}">${i?"新增":"更新"}</span>
      </div>
      ${r?`<p class="text-[10px] text-slate-400 mt-0.5 break-all">${T(r)}</p>`:""}
    </div>`}).join("")}function ys(t){t&&(D.mode=t.getAttribute("data-mode")||"merge",document.querySelectorAll("#import-step-options button[data-mode]").forEach(e=>{const n=e===t;e.className=n?"w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50 transition-all":"w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white transition-all"}))}function Ka(t){D.skipErrors=!!(t&&t.checked);const e=D.preview,n=!!(e&&(e.errors||0)>0);pe(!!(e&&e.token&&!e.fatal&&(!n||D.skipErrors)))}async function Za(){if(D.busy)return;if(!D.token){$("预检已失效，请重新选择文件",!1);return}const t=D.preview||{};if((t.errors||0)>0&&!D.skipErrors){$("存在错误行：请勾选「跳过错误行」，或修正文件后重新导入",!1);return}const e=D.mode==="overwrite"?"替换（空值会清空旧数据）":"合并（空单元格保留旧值）";if(!await st(`将写入 ${t.inserted||0} 条新增记录、更新 ${t.updated||0} 条已有记录，冲突处理方式：${e}${D.skipErrors?"，并跳过 "+(t.errors||0)+" 条错误行":""}。写入过程为单个事务，失败会整体回滚。`,{title:"确认导入？",confirmText:"开始导入",danger:!1}))return;Bt(!0);const s=l("import-result");try{const a=await M.confirmImport({token:D.token,conflict_mode:D.mode,skip_errors:D.skipErrors}),o=a&&a.data;if(!o)throw new Error("导入失败：返回数据异常");s&&(s.classList.remove("hidden"),s.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",s.innerHTML=`<span class="font-bold">导入完成</span><br>新增 ${o.inserted||0} 条 · 更新 ${o.updated||0} 条${o.skipped?" · 跳过 "+o.skipped+" 行":""}<br>可在「导入记录」中查看本次明细。`),U("import-step-options",!1),U("import-skip-wrap",!1),D.token=null,pe(!1,"已完成"),$("导入完成",!0),Qa()}catch(a){if(s){s.classList.remove("hidden"),s.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600";const o=a instanceof de&&a.status===409?"预检已过期，请重新选择文件：":"导入失败：";s.textContent=o+(a instanceof Error?a.message:"网络错误")}a instanceof de&&a.status&&pe(!1),$("导入失败",!1)}finally{Bt(!1)}}function Qa(){var e;const t=tt.state.currentTab||"log";if(t==="log"){const n=(e=g("input-date"))==null?void 0:e.value;n&&ke(n)}else mt(t)}function to(){var e;const t=Xn("memo-year-base");if(t){const n=new Date().getFullYear();t.innerHTML=[n,n-1,n-2].map(s=>`<option value="${s}">${s} 年</option>`).join("")}(e=l("memo-import-modal"))==null||e.classList.remove("hidden")}function Pe(){var t;(t=l("memo-import-modal"))==null||t.classList.add("hidden")}async function eo(){var s,a,o;const t=((s=Kt("memo-import-text"))==null?void 0:s.value)||"";if(!t.trim()){$("请先粘贴备忘录内容",!1);return}const e=Number((a=Xn("memo-year-base"))==null?void 0:a.value)||new Date().getFullYear();Pe(),Ve(),(o=l("import-modal"))==null||o.classList.remove("hidden"),U("import-step-pick",!1);const n=l("import-subtitle");n&&(n.textContent="正在预检粘贴内容…"),Bt(!0);try{const i=await M.previewImportMemo(t,e);if(n&&(n.textContent="预检不写入数据，确认后才会导入"),!i||!i.data){U("import-step-pick",!0);const r=l("import-pick-btn");r&&(r.textContent="选择文件"),Re("预检失败：服务端返回异常")}else fn(i.data)}catch(i){n&&(n.textContent="预检不写入数据，确认后才会导入"),U("import-step-pick",!0);const r=l("import-pick-btn");r&&(r.textContent="选择文件");const c=i instanceof Error?i.message:"网络错误";Re("预检失败："+c)}finally{Bt(!1)}}const no={success:{label:"成功",cls:"bg-emerald-50 text-emerald-600"},partial:{label:"部分成功",cls:"bg-amber-50 text-amber-700"},failed:{label:"失败",cls:"bg-rose-50 text-rose-600"},interrupted:{label:"中断",cls:"bg-rose-50 text-rose-600"},pending:{label:"进行中",cls:"bg-slate-100 text-slate-500"}};let Cn=!1;function so(){if(Cn)return;const t=l("import-batches-modal");t&&(Cn=!0,t.addEventListener("click",e=>{if(e.target===t){fe();return}const n=B(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="batches-close"){fe();return}const a=Number(n.dataset.id);a&&(s==="batch-detail"?ro(a):s==="batch-failed"?co(a):s==="batch-retry"&&lo(a))}))}function ao(){var t;(t=l("import-batches-modal"))==null||t.classList.remove("hidden"),oo()}function fe(){var t;(t=l("import-batches-modal"))==null||t.classList.add("hidden")}async function oo(){const t=l("batches-list");if(t){t.innerHTML='<p class="text-xs text-slate-400 text-center py-8">加载中…</p>';try{const e=await M.getImportBatches(20),n=e&&Array.isArray(e.data)?e.data:[];io(n)}catch(e){const n=e instanceof Error?e.message:"网络错误";t.innerHTML=`<p class="text-xs text-rose-500 text-center py-8">加载失败：${T(n)}</p>`}}}function io(t){const e=l("batches-list");if(e){if(!t.length){e.innerHTML='<p class="text-xs text-slate-400 text-center py-8">还没有导入记录</p>';return}e.innerHTML=t.map(n=>{const s=no[n.status]||{label:n.status,cls:"bg-slate-100 text-slate-500"},a=n.source_type==="json"?"JSON 备份":n.source_type==="memo"?"备忘录":"CSV",o=String(n.created_at||"").replace("T"," ").slice(0,16),i=[];return i.push(`<button type="button" data-action="batch-detail" data-id="${n.id}" class="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200">详情</button>`),n.has_cache&&n.errors>0&&i.push(`<button type="button" data-action="batch-failed" data-id="${n.id}" class="px-2.5 py-1 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 hover:bg-amber-200">失败行</button>`),n.retryable&&i.push(`<button type="button" data-action="batch-retry" data-id="${n.id}" class="px-2.5 py-1 rounded-lg bg-neutral-900 text-[11px] font-mono font-medium text-white hover:bg-neutral-800">重试</button>`),`<div class="rounded-xl border border-neutral-200 px-3.5 py-3">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-bold text-slate-800 truncate">${T(n.file_name||a)}</p>
        <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}">${s.label}</span>
      </div>
      <p class="text-[10px] text-slate-400 mt-0.5">${a} · ${T(o)} · 共 ${n.total_rows||0} 行${n.attempt_no>1?" · 第 "+n.attempt_no+" 次尝试":""}</p>
      <p class="text-[11px] text-slate-500 mt-1">新增 ${n.inserted||0} · 更新 ${n.updated||0} · 跳过 ${n.skipped||0} · 警告 ${n.warnings||0} · 错误 ${n.errors||0}</p>
      ${n.error_message?`<p class="text-[10px] text-rose-500 mt-1 break-all">${T(n.error_message)}</p>`:""}
      <div class="flex flex-wrap gap-1.5 mt-2">${i.join("")}</div>
      <div id="batch-issues-${n.id}" class="hidden mt-2 space-y-1"></div>
    </div>`}).join("")}}async function ro(t){const e=l("batch-issues-"+t);if(e){if(!e.classList.contains("hidden")){e.classList.add("hidden");return}if(e.classList.remove("hidden"),e.dataset.loaded!=="1"){e.dataset.loaded="1",e.innerHTML='<p class="text-[11px] text-slate-400">加载中…</p>';try{const n=await M.getImportBatchDetail(t),s=n&&n.data&&n.data.issues?n.data.issues:[];if(!s.length){e.innerHTML='<p class="text-[11px] text-slate-400">没有行级问题</p>';return}e.innerHTML=s.slice(0,50).map(a=>{const o=a.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2 py-1">
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${o?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${o?"错误":"警告"}</span>
        <span class="text-[10px] text-slate-600 leading-snug break-all">第 ${a.line} 行${a.date?" · "+T(a.date):""}：${T(a.message)}</span>
      </div>`}).join("")}catch{e.innerHTML='<p class="text-[11px] text-rose-500">明细加载失败</p>'}}}}async function lo(t){try{const e=await M.retryImportBatch(t);if(!e||!e.data){$("重试失败",!1);return}fe(),Va(e.data),$("已重新预检，请确认后写入",!0)}catch(e){const n=e instanceof Error?e.message:"网络错误";$("重试失败："+n,!1)}}function co(t){fe(),es(`/api/v1/import/batches/${t}/failed-rows`,`HealthTrack_failed_rows_${t}.csv`,"失败行已下载，可修正后重新导入")}function uo(t){t.insertAdjacentHTML("beforeend",oa),la(),Ua(),so()}function po(t){var a,o,i,r,c;t.insertAdjacentHTML("beforeend",`
    <!-- 数据管理底部面板：导入与导出的统一入口 -->
    <div id="data-sheet" class="hidden fixed inset-0 z-[60] bg-neutral-950/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <section class="w-full max-w-md sm:max-w-sm bg-white rounded-t-xl sm:rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="data-sheet-title">
        <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-100">
          <div>
            <h2 id="data-sheet-title" class="font-bold text-neutral-900 text-sm">数据管理</h2>
            <p class="text-[11px] font-mono text-neutral-400 mt-0.5">历史数据导入与安全备份</p>
          </div>
          <button id="btn-close-datasheet" aria-label="关闭数据管理" class="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500 font-mono flex items-center justify-center">✕</button>
        </div>
        <div class="px-5 py-4 space-y-3 font-mono">
          <div>
            <p class="text-[10px] font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">导入</p>
            <div class="space-y-1.5">
              <button id="btn-open-file-import" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all text-left">
                <span class="flex items-center space-x-2.5">
                  <svg class="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                  <span>
                    <span class="block text-xs font-medium text-neutral-800">从文件导入</span>
                    <span class="block text-[10px] text-neutral-400 mt-0.5">CSV 模板 / JSON 备份</span>
                  </span>
                </span>
                <span class="text-neutral-400 text-xs">›</span>
              </button>
              <button id="btn-open-memo-import" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all text-left">
                <span class="flex items-center space-x-2.5">
                  <svg class="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  <span>
                    <span class="block text-xs font-medium text-neutral-800">便签文本导入</span>
                    <span class="block text-[10px] text-neutral-400 mt-0.5">多日自然语言快速解析</span>
                  </span>
                </span>
                <span class="text-neutral-400 text-xs">›</span>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <button id="btn-open-batches" class="py-2 rounded-lg border border-neutral-200 hover:border-neutral-400 text-[11px] font-medium text-neutral-600 transition-colors">导入记录</button>
              <button id="btn-dl-template" class="py-2 rounded-lg border border-neutral-200 hover:border-neutral-400 text-[11px] font-medium text-neutral-600 transition-colors">下载模板</button>
            </div>
          </div>
          <div class="pt-2 border-t border-neutral-100">
            <p class="text-[10px] font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">导出</p>
            <button id="btn-open-export" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all text-left">
              <span class="flex items-center space-x-2.5">
                <svg class="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                <span>
                  <span class="block text-xs font-medium text-neutral-800">导出数据备份</span>
                  <span class="block text-[10px] text-neutral-400 mt-0.5">支持 Excel / JSON 完整包</span>
                </span>
              </span>
              <span class="text-neutral-400 text-xs">›</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  `);const n=document.getElementById("data-sheet"),s=document.getElementById("btn-close-datasheet");n==null||n.addEventListener("click",d=>{d.target===n&&vt()}),s==null||s.addEventListener("click",vt),(a=document.getElementById("btn-open-file-import"))==null||a.addEventListener("click",()=>{vt(),qa()}),(o=document.getElementById("btn-open-memo-import"))==null||o.addEventListener("click",()=>{vt(),to()}),(i=document.getElementById("btn-open-batches"))==null||i.addEventListener("click",()=>{vt(),ao()}),(r=document.getElementById("btn-dl-template"))==null||r.addEventListener("click",()=>{vt(),es("/api/v1/import/template","HealthTrack_import_template.csv","模板已下载")}),(c=document.getElementById("btn-open-export"))==null||c.addEventListener("click",()=>{vt(),ca()})}function fo(){var t;(t=document.getElementById("data-sheet"))==null||t.classList.remove("hidden")}function vt(){var t;(t=document.getElementById("data-sheet"))==null||t.classList.add("hidden")}function mo(t){var n,s;t.insertAdjacentHTML("afterbegin",`
    <header class="pt-4 pb-3 px-5 bg-white border-b border-neutral-200/80 flex justify-between items-center shrink-0 z-10">
      <div class="flex items-center space-x-2.5">
        <!-- HT 极简黑色单线圆环标识 -->
        <div class="w-8 h-8 rounded-lg border border-neutral-900 text-neutral-900 flex items-center justify-center font-black text-[11px] tracking-tight">HT</div>
        <div>
          <h1 class="text-sm font-bold text-neutral-900 leading-none tracking-tight">HealthTrack</h1>
          <p class="text-[10px] font-medium text-neutral-400 mt-0.5 tracking-wide font-mono">HEALTH · TRACK</p>
        </div>
      </div>
      <div class="flex items-center space-x-1.5">
        <!-- 设置按钮：1.5px 极细齿轮 SVG -->
        <button id="btn-open-settings" title="AI 设置" aria-label="AI 设置" class="w-8 h-8 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 text-neutral-500 transition-all flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <!-- 数据按钮：1.5px 极细盒子 SVG + 文字 -->
        <button id="btn-open-data" title="数据管理：导入与导出" class="h-8 px-2.5 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 text-neutral-600 rounded-lg transition-all flex items-center space-x-1.5 text-[11px] font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>数据</span>
        </button>
      </div>
    </header>
  `),(n=document.getElementById("btn-open-settings"))==null||n.addEventListener("click",()=>{ta()}),(s=document.getElementById("btn-open-data"))==null||s.addEventListener("click",()=>{fo()})}function xo(t,e){t.insertAdjacentHTML("beforeend",`
    <nav class="shrink-0 flex border-t border-neutral-200/80 bg-white pb-5 pt-2 px-2 justify-between z-10" id="bottom-nav">
      <button data-tab="log" id="tab-log" class="ht-nav-btn active flex flex-col items-center flex-1 text-neutral-900 transition-all active:scale-95">
        <svg class="w-[18px] h-[18px] mb-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        <span class="text-[10px] font-medium font-mono">记一笔</span>
      </button>
      <button data-tab="dash" id="tab-dash" class="ht-nav-btn flex flex-col items-center flex-1 text-neutral-400 hover:text-neutral-700 transition-all active:scale-95">
        <svg class="w-[18px] h-[18px] mb-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="8" width="4" height="13"/><rect x="17" y="4" width="4" height="17"/></svg>
        <span class="text-[10px] font-medium font-mono">看板</span>
      </button>
      <button data-tab="insight" id="tab-insight" class="ht-nav-btn flex flex-col items-center flex-1 text-neutral-400 hover:text-neutral-700 transition-all active:scale-95 relative">
        <svg class="w-[18px] h-[18px] mb-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        <span class="text-[10px] font-medium font-mono">洞察</span>
      </button>
      <button data-tab="evening" id="tab-evening" class="ht-nav-btn flex flex-col items-center flex-1 text-neutral-400 hover:text-neutral-700 transition-all active:scale-95">
        <svg class="w-[18px] h-[18px] mb-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span class="text-[10px] font-medium font-mono">睡前</span>
      </button>
    </nav>
  `);const s=document.getElementById("bottom-nav");s==null||s.addEventListener("click",a=>{const o=B(a.target,"button[data-tab]");if(!o)return;const i=o.getAttribute("data-tab");typeof e=="function"&&e(i)}),tt.subscribe(a=>{const o=a.currentTab,i=o==="history"||o==="compare"?"insight":o==="trend"||o==="trend-detail"?"dash":o;["log","dash","insight","evening"].forEach(r=>{const c=document.getElementById(`tab-${r}`);c&&(r===i?(c.classList.add("active","text-neutral-900"),c.classList.remove("text-neutral-400")):(c.classList.remove("active","text-neutral-900"),c.classList.add("text-neutral-400")))})})}const bo=`      <section id="view-dash" class="fade-in space-y-4 hidden">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold text-slate-900">数据趋势看板</h2>
          <div class="flex bg-slate-200/70 p-0.5 rounded-xl text-xs font-semibold">
            <button type="button" data-action="dash-range" data-days="7" id="btn-range-7" class="px-3 py-1 rounded-lg bg-white shadow-sm text-blue-600 transition-all">近7天</button>
            <button type="button" data-action="dash-range" data-days="30" id="btn-range-30" class="px-3 py-1 rounded-lg text-slate-600 transition-all">近30天</button>
            <button type="button" data-action="dash-range" data-days="60" id="btn-range-60" class="px-3 py-1 rounded-lg text-slate-600 transition-all">近60天</button>
          </div>
        </div>

        <!-- 60天详情入口（独立视图，逐日；与周平均趋势互补） -->
        <button type="button" data-action="open-trend-detail" class="w-full flex items-center justify-between apple-card hover:border-blue-300 rounded-2xl px-4 py-3 transition-all active:scale-[0.99]">
          <span class="flex items-center space-x-2.5 min-w-0">
            <svg class="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span class="text-xs font-medium text-neutral-800 shrink-0">60 天详情</span>
            <span class="text-[10px] text-slate-400 truncate">四指标 · 逐日全量跟踪</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- 周平均趋势分析入口（独立视图，不占用底部导航） -->
        <button type="button" data-action="open-trend" class="w-full flex items-center justify-between apple-card hover:border-emerald-300 rounded-2xl px-4 py-3 transition-all active:scale-[0.99]">
          <span class="flex items-center space-x-2.5 min-w-0">
            <svg class="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span class="text-xs font-medium text-neutral-800 shrink-0">周平均趋势分析</span>
            <span class="text-[10px] text-slate-400 truncate">近 12 周 · 周均值 + 区间带</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- 体重趋势图卡片 -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400">体重变化趋势 (kg)</p>
              <p id="dash-weight-stat" class="text-xl font-black text-slate-900 tracking-tight mt-0.5">--</p>
            </div>
            <div class="flex items-center space-x-3 text-[10px] text-slate-500 font-medium">
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #f59e0b"></span>睡前</span>
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #1e293b"></span>晨起空腹</span>
            </div>
          </div>
          <div class="h-44 w-full">
            <canvas id="chart-weight"></canvas>
          </div>
          <p id="dash-weight-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日睡前重 / 晨重</span>
          </p>
        </div>

        <!-- 腰围趋势图卡片（模板同体重折线图） -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400">腰围变化趋势 (cm)</p>
              <p id="dash-waist-stat" class="text-xl font-black text-slate-900 tracking-tight mt-0.5">--</p>
            </div>
            <div class="flex items-center space-x-3 text-[10px] text-slate-500 font-medium">
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #7c3aed"></span>腰围</span>
            </div>
          </div>
          <div class="h-44 w-full">
            <canvas id="chart-waist"></canvas>
          </div>
          <p id="dash-waist-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>
          </p>
        </div>

        <!-- 睡眠时长与熬夜分级柱状图 -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400">睡眠作息与质量 (小时)</p>
              <p id="dash-sleep-stat" class="text-xl font-black text-slate-900 tracking-tight mt-0.5">--</p>
            </div>
            <div class="flex items-center space-x-2 text-[10px] text-slate-500 font-medium">
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #34c759"></span>正常</span>
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #fbbf24"></span>轻度</span>
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #f43f5e"></span>熬夜</span>
            </div>
          </div>
          <div class="h-36 w-full">
            <canvas id="chart-sleep"></canvas>
          </div>
          <p id="dash-sleep-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>
          </p>
        </div>

        <!-- 步数趋势图卡片（缺失日断点，不补 0） -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400">步数趋势 (步)</p>
              <p id="dash-steps-stat" class="text-xl font-black text-slate-900 tracking-tight mt-0.5">--</p>
            </div>
            <div class="flex items-center space-x-3 text-[10px] text-slate-500 font-medium">
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full" style="background-color: #ea580c"></span>每日步数</span>
            </div>
          </div>
          <div class="h-44 w-full">
            <canvas id="chart-steps"></canvas>
          </div>
          <p id="dash-steps-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>
          </p>
        </div>

        <!-- 历史流水与运动标签列表 -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <p class="text-xs font-bold text-slate-800">近期活动打卡流水</p>
          <div id="dash-activities-list" class="space-y-2 text-xs max-h-48 overflow-y-auto no-scrollbar">
            <!-- 动态注入 -->
          </div>
        </div>
      </section>

      <!-- 2.1 周平均趋势分析（独立视图，看板入口进入，不占用底部导航） -->
      <section id="view-trend" class="fade-in space-y-4 hidden">
        <div class="flex justify-between items-center">
          <button type="button" data-action="back-dash" class="flex items-center space-x-0.5 text-slate-500 hover:text-slate-800 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span class="text-xs font-bold">返回</span>
          </button>
          <h2 class="text-sm font-bold text-neutral-900">周平均趋势</h2>
          <span class="w-12"></span>
        </div>

        <!-- 指标切换：体重 / 腰围 / 睡眠 / 步数，各一条周平均曲线 -->
        <div class="flex space-x-1.5">
          <button type="button" data-action="trend-metric" data-metric="weight" id="trend-tab-weight" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all">体重</button>
          <button type="button" data-action="trend-metric" data-metric="waist" id="trend-tab-waist" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">腰围</button>
          <button type="button" data-action="trend-metric" data-metric="sleep" id="trend-tab-sleep" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">睡眠</button>
          <button type="button" data-action="trend-metric" data-metric="steps" id="trend-tab-steps" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">步数</button>
        </div>

        <!-- 周均值折线 + 周内 min/max 区间带 -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <p id="trend-metric-label" class="text-[10px] uppercase font-bold text-slate-400">体重周均值 (kg)</p>
              <p id="trend-metric-stat" class="text-xl font-black text-slate-900 tracking-tight mt-0.5">--</p>
            </div>
            <div id="trend-metric-note" class="text-[10px] text-slate-500 text-right leading-relaxed">近 12 周</div>
          </div>
          <div class="h-56 w-full">
            <canvas id="chart-trend"></canvas>
          </div>
          <p id="trend-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>
          </p>
        </div>

        <!-- 图例与口径说明 -->
        <div class="apple-card p-3.5 text-[11px] text-slate-500 leading-relaxed space-y-1.5">
          <p><span class="inline-block w-4 h-2.5 rounded bg-slate-300/70 align-middle mr-1.5"></span>区间带 = 该周内所有日值的 min ~ max（非标准差）</p>
          <p><span class="inline-block w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-white align-middle mr-1.5"></span>空心节点 + 虚线 = 该周仅 1~3 天数据，均值置信偏低</p>
          <p><span class="inline-block w-4 h-0.5 bg-slate-300 align-middle mr-1.5"></span>某周 0 天数据时折线断开、区间带留空（不按 0 计）</p>
        </div>
      </section>

      <!-- 2b. 60天详情独立视图（方案 A：单一总入口 → 独立视图，逐日折线） -->
      <section id="view-trend-detail" class="fade-in space-y-4 hidden">
        <div id="td-topbar" class="space-y-4">
          <div id="td-header" class="flex justify-between items-center">
            <button type="button" data-action="back-dash" class="flex items-center space-x-0.5 text-slate-500 hover:text-slate-800 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              <span class="text-xs font-bold">返回</span>
            </button>
            <h2 class="text-sm font-bold text-neutral-900">60天详情</h2>
            <span id="td-header-spacer" class="w-12"></span>
          </div>

          <!-- 指标切换：体重 / 腰围 / 睡眠 / 步数 -->
          <div id="td-tabs" class="flex space-x-1.5">
            <button type="button" data-action="td-metric" data-metric="weight" id="td-tab-weight" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all">体重</button>
            <button type="button" data-action="td-metric" data-metric="waist" id="td-tab-waist" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">腰围</button>
            <button type="button" data-action="td-metric" data-metric="sleep" id="td-tab-sleep" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">睡眠</button>
            <button type="button" data-action="td-metric" data-metric="steps" id="td-tab-steps" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">步数</button>
          </div>
        </div>

        <!-- 逐日折线：竖屏固定日宽横向滚动 / 横屏自适应压进一屏 -->
        <div id="td-card" class="apple-card p-4 rounded-2xl space-y-3">
          <div id="td-metric-head" class="flex justify-between items-start">
            <div>
              <p id="td-metric-label" class="text-[10px] uppercase font-bold text-slate-400">体重逐日 (kg)</p>
              <p id="td-metric-stat" class="text-xl font-black text-slate-900 tracking-tight mt-0.5">--</p>
            </div>
            <div id="td-metric-note" class="text-[10px] text-slate-500 text-right leading-relaxed">近 60 天逐日</div>
          </div>
          <div id="td-chart-scroll" class="w-full overflow-x-auto no-scrollbar">
            <div id="td-chart-box" style="width:1560px;height:220px;">
              <canvas id="chart-trend-detail"></canvas>
            </div>
          </div>
          <p id="td-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>
          </p>
        </div>

        <!-- 口径说明 -->
        <div id="td-legend-card" class="apple-card p-3.5 text-[11px] text-slate-500 leading-relaxed space-y-1.5">
          <p><span class="inline-block w-4 h-0.5 bg-slate-300 align-middle mr-1.5"></span>缺失日折线断开（不按 0 计），可横向拖动逐日查看</p>
          <p><span class="inline-block w-4 h-2 bg-slate-200 align-middle mr-1.5"></span>横屏时图表自动压进一屏，x 轴约每 3 天一个刻度</p>
        </div>
      </section>

      <!-- 3. AI 洞察页 (Insight View) -->`,go=12,ws={weight:{label:"体重周均值 (kg)",field:"weight_am",unit:"kg",color:"#1e293b",band:"rgba(30, 41, 59, 0.08)"},waist:{label:"腰围周均值 (cm)",field:"waist_size",unit:"cm",color:"#7c3aed",band:"rgba(124, 58, 237, 0.08)"},sleep:{label:"睡眠周均值 (小时)",field:"sleep_hours",unit:"小时",color:"#4f46e5",band:"rgba(79, 70, 229, 0.12)"},steps:{label:"步数周均值 (步)",field:"steps",unit:"步",color:"#ea580c",band:"rgba(234, 88, 12, 0.08)",int:!0}},wt={metric:"weight",records:[],buckets:[],aggs:[]};let _e=null,In=!1;function ho(t){const e=new Date(t.getFullYear(),t.getMonth(),t.getDate());return e.setDate(e.getDate()-(e.getDay()+6)%7),e}function ks(t=new Date){const e=ho(t),n=[];for(let s=go-1;s>=0;s--){const a=new Date(e);a.setDate(e.getDate()-s*7);const o=new Date(a);o.setDate(a.getDate()+6),n.push({start:q(a),end:q(o)})}return n}function vo(t,e,n){return e.map(s=>{const a=[];return t.forEach(i=>{if(i.record_date>=s.start&&i.record_date<=s.end){const r=i[n];r!=null&&r!==""&&!isNaN(Number(r))&&a.push(Number(r))}}),a.length===0?{avg:null,min:null,max:null,n:0}:{avg:a.reduce((i,r)=>i+r,0)/a.length,min:Math.min(...a),max:Math.max(...a),n:a.length}})}function yo(){if(In)return;const t=l("view-trend");t&&(In=!0,t.addEventListener("click",e=>{const n=B(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="back-dash")mt("dash");else if(s==="trend-metric"){const a=n.dataset.metric;a&&Ts(a)}}))}function wo(){Ts(wt.metric),mt("trend")}function Ts(t){ws[t]&&(wt.metric=t,["weight","waist","sleep","steps"].forEach(e=>{const n=l(`trend-tab-${e}`);n&&(n.className=e===t?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),tt.state.currentTab==="trend"&&Ls())}async function ko(){await To()}async function To(){const e=ks()[0].start,n=q(new Date);try{const s=await M.getHistoryRecords(e,n);wt.records=s&&s.data?s.data:Array.isArray(s)?s:[]}catch{wt.records=[]}Ls()}function Ls(){const t=ws[wt.metric],e=b=>t.int?Math.round(b).toLocaleString("en-US"):b.toFixed(1),n=ks(),s=vo(wt.records,n,t.field);wt.buckets=n,wt.aggs=s;const a=n.map(b=>b.start.slice(5)),o=s.map(b=>b.max),i=s.map(b=>b.min),r=s.map(b=>b.avg),c=s.map(b=>b.n>=1&&b.n<=3),d=l("trend-metric-label");d&&(d.innerText=t.label);const u=l("trend-metric-stat"),m=l("trend-metric-note");let v=-1;for(let b=s.length-1;b>=0;b--)if(s[b].n>0){v=b;break}if(v>=0){const b=s[v],L=n[v];u&&(u.innerText=`${e(b.avg)} ${t.unit}`),m&&(m.innerHTML=`${L.start.slice(5)}~${L.end.slice(5)} 周均值<br>${b.n} 天数据${b.n<=3?"（低置信）":""}`)}else u&&(u.innerText="--"),m&&(m.innerHTML="近 12 周暂无数据");const x=l("trend-detail");x&&(x.innerHTML=v>=0?'<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>':'<span class="font-mono text-[10px] text-neutral-400">近 12 周暂无该指标数据，记录几天后再来看看</span>');const y=zt("chart-trend");if(!y)return;_e&&(_e.destroy(),_e=null);const E=typeof Chart<"u"&&Chart.getChart?Chart.getChart(y):null;E&&E.destroy();const _=y.getContext("2d");_&&(_e=new Chart(_,{type:"line",data:{labels:a,datasets:[{label:"周内最大",data:o,borderColor:"transparent",backgroundColor:t.band,pointRadius:0,pointHoverRadius:0,fill:{target:1},spanGaps:!1,tension:.25},{label:"周内最小",data:i,borderColor:"transparent",backgroundColor:"transparent",pointRadius:0,pointHoverRadius:0,spanGaps:!1,tension:.25},{label:"周均值",data:r,borderColor:t.color,backgroundColor:t.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:b=>c[b.dataIndex]?4:3,pointBackgroundColor:b=>c[b.dataIndex]?"#ffffff":t.color,pointBorderColor:t.color,pointBorderWidth:b=>c[b.dataIndex]?2:0,segment:{borderDash:b=>c[b.p1DataIndex]||c[b.p0DataIndex]?[5,4]:void 0}}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{filter:b=>b.datasetIndex===2,displayColors:!1,callbacks:{title:b=>{const L=n[b[0].dataIndex];return`${L.start} ~ ${L.end}`},label:b=>{const L=s[b.dataIndex];return!L||L.n===0?"该周无数据":[`周均值：${e(L.avg)} ${t.unit}`,`区间：${e(L.min)} ~ ${e(L.max)}`,`样本：${L.n} 天${L.n<=3?"（低置信）":""}`]}}}},scales:{y:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:6}}},onClick:(b,L)=>{let N=-1;if((L||[]).forEach(J=>{J.datasetIndex===2&&(N=J.index)}),N<0||!x)return;const P=s[N],X=n[N];!P||P.n===0||(x.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${X.start} ~ ${X.end}</b>　均值 ${e(P.avg)} ${t.unit} · 区间 ${e(P.min)}~${e(P.max)} · ${P.n} 天${P.n<=3?"（低置信）":""}</span>`)}}}))}const Oe=60,Lo=26,Eo=Oe*Lo,So=560,Es={weight:{label:"体重逐日 (kg)",field:"weight_am",unit:"kg",color:"#1e293b"},waist:{label:"腰围逐日 (cm)",field:"waist_size",unit:"cm",color:"#7c3aed"},sleep:{label:"睡眠时长逐日 (小时)",field:"sleep_hours",unit:"小时",color:"#4f46e5",avg:!0},steps:{label:"步数逐日 (步)",field:"steps",unit:"步",color:"#ea580c",avg:!0,yMax:2e4,yStep:5e3,fmt:t=>t.toLocaleString("en-US")}},kt={metric:"weight",records:[]};let Ut=null,Hn=!1;function Ss(t=new Date){const e=[];for(let n=Oe-1;n>=0;n--){const s=new Date(t.getFullYear(),t.getMonth(),t.getDate());s.setDate(s.getDate()-n),e.push(q(s))}return e}function _o(){return window.matchMedia("(orientation: landscape) and (max-height: 600px)").matches}function $o(){const t=l("app-frame");t&&t.classList.toggle("frame-wide",tt.state.currentTab==="trend-detail"&&_o())}function Mo(){const t=l("td-chart-box"),e=l("td-chart-scroll");if(!t||!e)return;const n=e.clientWidth>=So;t.style.width=n?"100%":`${Eo}px`,t.style.height=n?"150px":"220px",Ut&&Ut.resize()}function _s(){$o(),Mo()}function Co(){const t=()=>{tt.state.currentTab==="trend-detail"&&_s()};window.addEventListener("resize",t);const e=window.matchMedia("(orientation: landscape) and (max-height: 600px)");e.addEventListener?e.addEventListener("change",t):e.addListener&&e.addListener(t)}function Io(){if(Hn)return;const t=l("view-trend-detail");t&&(Hn=!0,t.addEventListener("click",e=>{const n=B(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="back-dash")mt("dash");else if(s==="td-metric"){const a=n.dataset.metric;a&&$s(a)}}),Co())}function Ho(){$s(kt.metric),mt("trend-detail")}function $s(t){Es[t]&&(kt.metric=t,["weight","waist","sleep","steps"].forEach(e=>{const n=l(`td-tab-${e}`);n&&(n.className=e===t?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),tt.state.currentTab==="trend-detail"&&Ms())}async function Bo(){await Do()}async function Do(){const t=Ss(),e=t[0],n=t[t.length-1];try{const s=await M.getHistoryRecords(e,n);kt.records=s&&s.data?s.data:Array.isArray(s)?s:[]}catch{kt.records=[]}Ms()}function jo(t,e){if(t==="weight"){const a=c=>c==null?"--":`${c} kg`,o=e.weight_am,i=e.weight_pm;let r="";return o!=null&&i!==null&&i!==void 0&&(r=` · 夜间排水 <b class="text-slate-700">${(Math.round((i-o)*10)/10).toFixed(1)} kg</b>`),`<b class="text-slate-700">${e.record_date}</b>　睡前 ${a(i)} · 晨起 ${a(o)}${r}`}if(t==="waist"){const a=e.waist_size===null||e.waist_size===void 0?"--":`${e.waist_size} cm`;return`<b class="text-slate-700">${e.record_date}</b>　腰围 ${a}`}if(t==="steps"){const a=e.steps===null||e.steps===void 0?"--":`${Number(e.steps).toLocaleString("en-US")} 步`;return`<b class="text-slate-700">${e.record_date}</b>　步数 ${a}${e.morning_light===!0?" · 已见晨光":""}`}const n=e.sleep_tag==="RED"?"熬夜":e.sleep_tag==="YELLOW"?"轻度":"正常",s=e.sleep_hours===null||e.sleep_hours===void 0?"--":`${e.sleep_hours} 小时`;return`<b class="text-slate-700">${e.record_date}</b>　就寝 ${e.sleep_start_time||"--"} · 起床 ${e.sleep_end_time||"--"} · ${s} · ${n}`}function Ms(){const t=Es[kt.metric],e=Ss(),n={};kt.records.forEach(x=>{x&&x.record_date&&(n[x.record_date]=x)});const s=e.map(x=>{const y=n[x];if(!y)return null;const E=y[t.field];return E==null||E===""||isNaN(Number(E))?null:Number(E)}),a=e.map(x=>x.slice(5)),o=l("td-detail");o&&(o.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>');const i=l("td-metric-label");i&&(i.innerText=t.label);const r=l("td-metric-stat"),c=l("td-metric-note"),d=s.filter(x=>x!==null);if(d.length>0){if(r)if(t.avg){const x=d.reduce((y,E)=>y+E,0)/d.length;r.innerText=kt.metric==="sleep"?`${x.toFixed(1)} 小时 (均值)`:`${Math.round(x).toLocaleString("en-US")} 步 (均值)`}else r.innerText=`${d[d.length-1]} ${t.unit}`;c&&(c.innerHTML=`近 ${Oe} 天逐日<br>有效 ${d.length} 天`)}else r&&(r.innerText="--"),c&&(c.innerHTML=`近 ${Oe} 天暂无数据`);const u=zt("chart-trend-detail");if(!u)return;Ut&&(Ut.destroy(),Ut=null);const m=typeof Chart<"u"&&Chart.getChart?Chart.getChart(u):null;m&&m.destroy();const v=u.getContext("2d");v&&(Ut=new Chart(v,{type:"line",data:{labels:a,datasets:[{label:t.label,data:s,borderColor:t.color,backgroundColor:t.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:3,pointBackgroundColor:t.color}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{displayColors:!1,callbacks:{title:x=>e[x[0].dataIndex],label:x=>{const y=s[x.dataIndex];return y===null?"当日无数据":`数值：${t.fmt?t.fmt(y):y} ${t.unit}`}}}},scales:{y:t.yMax?{beginAtZero:!0,max:t.yMax,ticks:{font:{size:10},stepSize:t.yStep,callback:x=>x===0?"0":`${x/1e4}万`}}:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:20}}},onClick:(x,y)=>{if(!y||!y.length||!o)return;const E=y[0].index,_=e[E],b=n[_];!b||s[E]===null||(o.innerHTML=`<span class="font-mono text-neutral-400">·</span><span>${jo(kt.metric,b)}</span>`)}}}),_s())}let me=7,$e=null,Me=null,Ce=null,Ie=null;function Ao(){typeof Chart<"u"&&Chart.defaults&&(Chart.defaults.font.family="'JetBrains Mono', 'Cascadia Code', monospace",Chart.defaults.font.size=10,Chart.defaults.color="#a3a3a3",Chart.defaults.plugins.tooltip.backgroundColor="#171717",Chart.defaults.plugins.tooltip.titleColor="#ffffff",Chart.defaults.plugins.tooltip.bodyColor="#d4d4d4",Chart.defaults.plugins.tooltip.padding=10,Chart.defaults.plugins.tooltip.cornerRadius=8,Chart.defaults.plugins.tooltip.titleFont={family:"'JetBrains Mono', monospace",weight:"600",size:11},Chart.defaults.plugins.tooltip.bodyFont={family:"'JetBrains Mono', monospace",size:10})}function No(t){if(!t)return[];let e=Array.isArray(t.types)?t.types.slice():[];return e.length===0&&t.type&&(e=[t.type]),e.filter(n=>n&&n!=="none")}function Ro(t){t.insertAdjacentHTML("beforeend",bo),Ao(),Po(),yo(),Io()}function Po(){const t=l("view-dash");t&&t.addEventListener("click",e=>{const n=B(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="dash-range"){const a=Number(n.dataset.days);(a===7||a===30||a===60)&&Cs(a)}else s==="open-trend-detail"?Ho():s==="open-trend"&&wo()})}function Oo(){Cs(me)}function Cs(t){me=t,tt.set({dashRange:t}),["7","30","60"].forEach(e=>{const n=l("btn-range-"+e);n&&(n.className=Number(e)===t?"px-3 py-1 rounded-md bg-white border border-neutral-200 text-neutral-900 font-mono font-medium shadow-sm transition-all":"px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-900 font-mono font-medium transition-all")}),zo(t)}async function zo(t=me){me=t;const e=q(new Date),n=Ct(e,-(t-1));try{const s=await M.getHistoryRecords(n,e),a=s&&s.data?s.data:Array.isArray(s)?s:[];Fo(a,n,t)}catch(s){console.error("加载看板数据失败:",s)}}function Fo(t,e,n){const s=Object.create(null);t.forEach(p=>{p&&p.record_date&&(s[p.record_date]=p)});const a=n||me||7,o=e||Ct(q(new Date),-(a-1)),i=[];for(let p=0;p<a;p++)i.push(Ct(o,p));const r=i.map(p=>s[p]||{record_date:p}),c=i.map(p=>p.slice(5)),d=r.map(p=>p.weight_am===null||p.weight_am===void 0?null:p.weight_am),u=r.map(p=>p.weight_pm===null||p.weight_pm===void 0?null:p.weight_pm),m=r.map(p=>p.waist_size===null||p.waist_size===void 0?null:p.waist_size),v=r.map(p=>p.sleep_hours===null||p.sleep_hours===void 0?null:p.sleep_hours),x=r.map(p=>p.sleep_hours===null||p.sleep_hours===void 0?"transparent":p.sleep_tag==="RED"?"#f43f5e":p.sleep_tag==="YELLOW"?"#fbbf24":"#34c759"),y=d.filter(p=>p!=null),E=l("dash-weight-stat");E&&(E.innerText=y.length>0?`${y[y.length-1]} kg`:"--");const _=v.filter(p=>p!=null),b=l("dash-sleep-stat");if(b)if(_.length>0){const p=(_.reduce((O,H)=>O+H,0)/_.length).toFixed(1);b.innerText=`${p} 小时 (均值)`}else b.innerText="--";const L=l("dash-weight-detail");L&&(L.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日睡前重 / 晨重</span>');const N=zt("chart-weight");if(N){$e&&($e.destroy(),$e=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(N):null;p&&p.destroy();const O=N.getContext("2d");if(O){const H=O.createLinearGradient(0,0,0,160);H.addColorStop(0,"rgba(245, 158, 11, 0.08)"),H.addColorStop(1,"rgba(245, 158, 11, 0.00)");const I=O.createLinearGradient(0,0,0,160);I.addColorStop(0,"rgba(30, 41, 59, 0.06)"),I.addColorStop(1,"rgba(30, 41, 59, 0.00)"),$e=new Chart(O,{type:"line",data:{labels:c,datasets:[{label:"睡前体重",data:u,borderColor:"#f59e0b",borderWidth:2,backgroundColor:H,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#f59e0b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16},{label:"晨起体重",data:d,borderColor:"#1e293b",borderWidth:2.2,backgroundColor:I,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#1e293b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{itemSort:(C,F)=>C.datasetIndex-F.datasetIndex}},onClick:(C,F)=>{if(!F||!F.length||!L)return;const Z=r[F[0].index];if(!Z||Z.weight_am==null&&Z.weight_pm==null)return;const Le=xt=>xt==null?"--":`${xt} kg`,Ee=Z.weight_am,Se=Z.weight_pm;let wn="";if(Ee!=null&&Se!==null&&Se!==void 0){const xt=Math.round((Se-Ee)*10)/10;let se;xt<.3?se="偏低，可能高钠储水":xt<.4?se="偏低":xt<=.9?se="正常":se="偏高",wn=` · 夜间排水 <b class="text-slate-700">${xt.toFixed(1)} kg</b>（${se}）`}L.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${Z.record_date}</b>　睡前 ${Le(Se)} · 晨起 ${Le(Ee)}${wn}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}}const P=m.filter(p=>p!=null),X=l("dash-waist-stat");X&&(X.innerText=P.length>0?`${P[P.length-1]} cm`:"--");const J=l("dash-waist-detail");J&&(J.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>');const Rt=zt("chart-waist");if(Rt){Me&&(Me.destroy(),Me=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(Rt):null;p&&p.destroy();const O=Rt.getContext("2d");if(O){const H=O.createLinearGradient(0,0,0,160);H.addColorStop(0,"rgba(124, 58, 237, 0.10)"),H.addColorStop(1,"rgba(124, 58, 237, 0.00)"),Me=new Chart(O,{type:"line",data:{labels:c,datasets:[{label:"腰围",data:m,borderColor:"#7c3aed",borderWidth:2.2,backgroundColor:H,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#7c3aed",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(I,C)=>{if(!C||!C.length||!J)return;const F=r[C[0].index];if(!F||F.waist_size==null)return;const Z=F.waist_size===null||F.waist_size===void 0?"--":`${F.waist_size} cm`;J.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${F.record_date}</b>　腰围 ${Z}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}}const Et=l("dash-sleep-detail");Et&&(Et.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>');const Pt=zt("chart-sleep");if(Pt){Ce&&(Ce.destroy(),Ce=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(Pt):null;p&&p.destroy();const O=Pt.getContext("2d");O&&(Ce=new Chart(O,{type:"bar",data:{labels:c,datasets:[{data:v,backgroundColor:x,borderRadius:8,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},onHover:(H,I)=>{H.native&&H.native.target instanceof HTMLElement&&(H.native.target.style.cursor=I.length?"pointer":"default")},onClick:(H,I)=>{if(!I||!I.length||!Et)return;const C=r[I[0].index];if(!C||C.sleep_hours==null&&!C.sleep_start_time)return;const F=C.sleep_tag==="RED"?"熬夜":C.sleep_tag==="YELLOW"?"轻度":"正常",Z=C.sleep_hours===null||C.sleep_hours===void 0?"--":`${C.sleep_hours} 小时`;Et.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${C.record_date}</b>　就寝 ${C.sleep_start_time||"--"} · 起床 ${C.sleep_end_time||"--"} · ${Z} · ${F}</span>`},scales:{y:{beginAtZero:!0,max:12,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}}))}const ne=r.map(p=>p.steps===null||p.steps===void 0?null:Number(p.steps)),h=ne.filter(p=>p!==null),S=l("dash-steps-stat");if(S)if(h.length>0){const p=Math.round(h.reduce((O,H)=>O+H,0)/h.length);S.innerText=`${p.toLocaleString("en-US")} 步 (均值)`}else S.innerText="--";const et=l("dash-steps-detail");et&&(et.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>');const ut=zt("chart-steps");if(ut){Ie&&(Ie.destroy(),Ie=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(ut):null;p&&p.destroy();const O=ut.getContext("2d");if(O){const H=O.createLinearGradient(0,0,0,160);H.addColorStop(0,"rgba(234, 88, 12, 0.16)"),H.addColorStop(1,"rgba(234, 88, 12, 0.00)"),Ie=new Chart(O,{type:"line",data:{labels:c,datasets:[{label:"步数",data:ne,borderColor:"#ea580c",borderWidth:2.2,backgroundColor:H,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#ea580c",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onHover:(I,C)=>{I.native&&I.native.target instanceof HTMLElement&&(I.native.target.style.cursor=C.length?"pointer":"default")},onClick:(I,C)=>{if(!C||!C.length||!et)return;const F=r[C[0].index];if(!F||F.steps===null||F.steps===void 0)return;const Z=`${Number(F.steps).toLocaleString("en-US")} 步`,Le=F.morning_light===!0?" · 已见晨光":"";et.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${F.record_date}</b>　步数 ${Z}${Le}</span>`},scales:{y:{beginAtZero:!0,max:2e4,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#94a3b8",stepSize:5e3,callback:I=>I===0?"0":`${I/1e4}万`}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}}const Ye=l("dash-activities-list");if(!Ye)return;if(t.length===0){Ye.innerHTML='<p class="text-slate-400 text-center py-2">暂无记录</p>';return}const Xe=[];t.slice().reverse().forEach(p=>{const O=No(p.exercise);if(p.journal_text||p.activity_tags||O.length>0||p.concerta&&p.concerta.taken||p.cold_shower&&p.cold_shower.enabled){let H="";if(p.activity_tags)try{const I=JSON.parse(p.activity_tags);Array.isArray(I)&&(H+=I.map(C=>`<span class="bg-neutral-100 text-neutral-700 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono mr-1">${T(C)}</span>`).join(""))}catch{}if(O.length>0&&(O.includes("strength")&&(H+='<span class="bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">无氧</span>'),O.includes("cardio")&&(H+='<span class="bg-sky-50 text-sky-700 border border-sky-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">有氧</span>'),O.filter(I=>I!=="strength"&&I!=="cardio").forEach(I=>{H+=`<span class="bg-slate-100 text-slate-700 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">${T(I)}</span>`})),p.cold_shower&&p.cold_shower.enabled){const I=p.cold_shower.water_temp===null||p.cold_shower.water_temp===void 0?"":` ${p.cold_shower.water_temp}℃`;let C=p.cold_shower.duration,F="";C!=null&&C>0&&(C<=10&&(C=C*60),F=` · ${C}s`),H+=`<span class="bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">冷水澡${T(I)}${F}</span>`}if(p.concerta&&p.concerta.taken){const I=p.concerta.dose?` ${T(p.concerta.dose)}mg`:"";H+=`<span class="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">专注达${I}</span>`}Xe.push(`
        <div class="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div class="flex justify-between items-start gap-2 mb-1.5">
            <span class="font-bold text-neutral-800 font-mono text-xs shrink-0">${T(p.record_date||"")}</span>
            <div class="flex flex-wrap gap-1 items-center justify-end">${H}</div>
          </div>
          <p class="text-neutral-600 line-clamp-2">${T(p.journal_text||"无文字备注")}</p>
        </div>
      `)}}),Ye.innerHTML=Xe.length>0?Xe.join(""):'<p class="text-neutral-400 text-center py-2 font-mono text-xs">暂无活动记录</p>'}const Uo=`      <!-- 3. AI 洞察页 (Insight View) -->
      <section id="view-insight" class="fade-in space-y-3.5 hidden">
        <!-- 顶部标题栏：1.5px 极细 Sparkle 图标 + 极客状态小标 + 中性功能胶囊 -->
        <div class="flex justify-between items-center gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <h2 class="text-sm font-bold text-neutral-900 leading-none truncate">AI 深度洞察</h2>
              <span class="text-[10px] font-mono text-neutral-400">CAUSAL REVIEW</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 font-mono">
            <button type="button" data-action="open-compare" class="h-8 px-2.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg text-[11px] text-neutral-600 font-medium transition-all active:scale-95 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/></svg>
              <span>阶段对比</span>
            </button>
            <button type="button" data-action="open-history" class="h-8 px-2.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg text-[11px] text-neutral-600 font-medium transition-all active:scale-95 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>历史</span>
            </button>
          </div>
        </div>

        <!-- 分析参数控制卡 (ht-card)：整合分析周期与截止日 -->
        <div class="ht-card space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">分析周期</span>
            <div class="flex gap-1">
              <button type="button" data-action="insight-days" data-days="7" id="pill-7" class="ht-seg-btn">近7天</button>
              <button type="button" data-action="insight-days" data-days="30" id="pill-30" class="ht-seg-btn active">近30天</button>
              <button type="button" data-action="insight-days" data-days="60" id="pill-60" class="ht-seg-btn">近60天</button>
            </div>
          </div>
          <div class="pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">截止日期</span>
            <div class="flex items-center gap-1.5 font-mono">
              <button type="button" data-action="insight-end-mode" data-mode="today" id="endpill-today" class="ht-seg-btn active">今日</button>
              <button type="button" data-action="insight-end-mode" data-mode="yesterday" id="endpill-yesterday" class="ht-seg-btn">昨日</button>
              <input type="date" id="insight-end-date"
                     class="bg-white border border-neutral-200 text-[11px] font-mono text-neutral-700 rounded-lg px-2 py-1 outline-none w-[138px] focus:border-neutral-800 transition-colors" />
            </div>
          </div>
        </div>

        <!-- 主操作按钮：高质感深色极客大按钮 -->
        <button type="button" data-action="insight-generate" id="btn-generate-insight" class="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>生成阶段深度洞察</span>
        </button>

        <!-- 洞察渲染卡片 (SSE 流式输出，纯净中性单线卡片) -->
        <div class="ht-card space-y-3 min-h-[300px]">
          <div class="flex items-center justify-between pb-2.5 border-b border-neutral-100 font-mono text-[10px]">
            <span class="text-neutral-900 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
              <span>归因分析与复盘结论</span>
            </span>
            <span id="insight-status-tag" class="text-neutral-400">点击上方按钮开始</span>
          </div>

          <div id="insight-content" class="text-xs text-neutral-700 leading-relaxed markdown-body">
            <p>系统将自动提取选定周期内的晨起/睡前体重、夜间失水、熬夜红黄绿分布、运动与饮食打卡，由大模型进行深度因果归因与复盘。</p>
          </div>
        </div>
      </section>

      <!-- 4. AI 洞察历史页 (Insight History View) -->
      <section id="view-history" class="fade-in space-y-3.5 hidden">
        <div class="flex justify-between items-center">
          <button type="button" data-action="back-insight" class="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            <span class="text-xs font-mono font-medium">返回</span>
          </button>
          <h2 class="text-sm font-bold text-neutral-900 font-mono">洞察历史存档</h2>
          <button type="button" data-action="history-manage" id="history-manage-btn" class="text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition-colors">管理</button>
        </div>

        <!-- 关键词搜索 -->
        <div class="relative">
          <input id="history-search" type="text" placeholder="搜索洞察内容关键词…"
            class="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors">
          <svg class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>

        <!-- 档位筛选 -->
        <div class="flex gap-1.5 font-mono">
          <button type="button" data-action="history-filter" data-days="0" id="hfilter-0" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-900 text-white transition-all">全部</button>
          <button type="button" data-action="history-filter" data-days="7" id="hfilter-7" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">近7天</button>
          <button type="button" data-action="history-filter" data-days="30" id="hfilter-30" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">近30天</button>
          <button type="button" data-action="history-filter" data-days="60" id="hfilter-60" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">近60天</button>
          <button type="button" data-action="history-filter-compare" id="hfilter-compare" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">对比</button>
        </div>

        <!-- 历史列表 -->
        <div id="history-list" class="space-y-2.5"></div>

        <!-- 加载更多（游标分页，每批 10 条） -->
        <button type="button" data-action="history-load-more" id="history-loadmore" class="hidden w-full py-2.5 rounded-xl ht-card text-xs font-mono font-medium text-neutral-600 hover:bg-neutral-50 transition-all">加载更多</button>

        <!-- 管理模式底部操作条 -->
        <div id="history-delete-bar" class="hidden sticky bottom-2 z-10 flex items-center justify-between bg-neutral-900/95 backdrop-blur-md text-white rounded-xl px-4 py-2.5 shadow-lg border border-neutral-800">
          <button type="button" data-action="history-select-all" id="history-selectall-btn" class="text-xs font-mono font-medium text-neutral-300 hover:text-white transition-colors">全选</button>
          <span id="history-selected-count" class="text-xs font-mono text-neutral-400">已选 0 项</span>
          <button type="button" data-action="history-delete" id="history-delete-btn" class="text-xs font-mono font-medium bg-neutral-700 text-neutral-400 px-3.5 py-1.5 rounded-lg cursor-not-allowed transition-colors" disabled>删除所选</button>
        </div>
      </section>

      <!-- 5. 阶段对比独立视图 (Compare View) -->
      <section id="view-compare" class="fade-in space-y-3.5 hidden">
        <!-- topbar -->
        <div class="flex justify-between items-center">
          <button type="button" data-action="cmp-back" class="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            <span class="text-xs font-mono font-medium">返回</span>
          </button>
          <h2 class="text-sm font-bold text-neutral-900 font-mono">阶段对比</h2>
          <span class="w-12"></span>
        </div>

        <!-- 两月选择器 (ht-card) -->
        <div class="ht-card p-3.5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0 flex items-center justify-center space-x-1">
              <button type="button" data-action="cmp-step" data-which="a" data-delta="-1" id="cmp-a-prev" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">‹</button>
              <div class="text-center min-w-0 px-2">
                <p class="text-[9px] font-mono uppercase text-neutral-400">对比月 A</p>
                <p id="cmp-a-label" class="text-sm font-bold font-mono text-neutral-900 whitespace-nowrap tabular-nums">—</p>
              </div>
              <button type="button" data-action="cmp-step" data-which="a" data-delta="1" id="cmp-a-next" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">›</button>
            </div>
            <span class="px-2 text-[10px] font-mono font-bold text-neutral-300 shrink-0">VS</span>
            <div class="flex-1 min-w-0 flex items-center justify-center space-x-1">
              <button type="button" data-action="cmp-step" data-which="b" data-delta="-1" id="cmp-b-prev" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">‹</button>
              <div class="text-center min-w-0 px-2">
                <p class="text-[9px] font-mono uppercase text-neutral-400">对比月 B</p>
                <p id="cmp-b-label" class="text-sm font-bold font-mono text-neutral-900 whitespace-nowrap tabular-nums">—</p>
              </div>
              <button type="button" data-action="cmp-step" data-which="b" data-delta="1" id="cmp-b-next" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">›</button>
            </div>
          </div>
          <p class="text-[10px] text-neutral-400 text-center font-mono">默认「上月 vs 上上月」· 独立两月 · 支持跨年对比</p>
        </div>

        <!-- 未过完 / 数据不足 提示条 -->
        <div id="cmp-warn" class="hidden bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-[11px] font-mono leading-relaxed"></div>

        <!-- 生成按钮 -->
        <button type="button" data-action="cmp-generate" id="compare-gen-btn" class="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>生成阶段对比综述</span>
        </button>

        <!-- 指标对比表 (ht-card) -->
        <div class="ht-card space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span class="text-xs font-bold text-neutral-900 font-mono">指标对比快照</span>
            <span id="cmp-table-meta" class="text-[10px] font-mono text-neutral-400"></span>
          </div>
          <table class="w-full text-xs">
            <thead>
              <tr class="text-[10px] font-mono text-neutral-400 border-b border-neutral-100">
                <th class="text-left font-medium pb-2">指标</th>
                <th id="cmp-col-a" class="text-right font-medium pb-2">月 A</th>
                <th id="cmp-col-b" class="text-right font-medium pb-2">月 B</th>
                <th class="text-right font-medium pb-2">Δ</th>
              </tr>
            </thead>
            <tbody id="compare-table-body" class="font-mono divide-y divide-neutral-100"></tbody>
          </table>
        </div>

        <!-- AI 阶段对比综述卡片 (ht-card) -->
        <div class="ht-card space-y-3 min-h-[300px]">
          <div class="flex items-center justify-between pb-2.5 border-b border-neutral-100 font-mono text-[10px]">
            <span class="text-neutral-900 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
              <span>阶段对比综述</span>
            </span>
            <span id="cmp-status-tag" class="text-neutral-400">点击上方按钮开始</span>
          </div>
          <div id="compare-insight-card" class="text-xs text-neutral-700 leading-relaxed markdown-body">
            <p>选择两个月份，点击「生成阶段对比综述」，AI 将对两期的体重、腰围、睡眠、运动与服药情况进行横向对比与综合归因。</p>
          </div>
        </div>
      </section>
`;async function mn({url:t,signal:e,onUpdate:n,onDone:s,onError:a}){let o="",i="",r=!1,c=0,d=!1;const u=()=>{c=0,!d&&typeof n=="function"&&n({thinking:o,content:i,hasError:r})},m=()=>{c||(typeof requestAnimationFrame=="function"?c=requestAnimationFrame(u):u())},v=x=>{const y=x.trim();if(!y||!y.startsWith("data:"))return;const E=y.slice(5).trim();if(!(!E||E==="[DONE]"))try{const _=JSON.parse(E);if(_.error)i+=`
> **服务提示**: ${_.error}
`,r=!0,m();else if(_.choices&&_.choices.length>0){const b=_.choices[0].delta||{};let L=!1;b.reasoning_content&&(o+=b.reasoning_content,L=!0),b.content&&(i+=b.content,L=!0),L&&m()}}catch{}};try{const x=await fetch(t,{signal:e});if(!x.ok)throw new Error(`HTTP ${x.status}`);if(!x.body||typeof x.body.getReader!="function")throw new Error("当前环境不支持流式响应读取");const y=x.body.getReader(),E=new TextDecoder("utf-8");let _="";for(;;){const{done:b,value:L}=await y.read();if(b)break;_+=E.decode(L,{stream:!0});const N=_.split(`
`);_=N.pop()||"";for(const P of N)v(P)}return _.trim()&&v(_),c&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(c),c=0),!d&&typeof n=="function"&&n({thinking:o,content:i,hasError:r}),!d&&typeof s=="function"&&s({thinking:o,content:i,hasError:r}),{aborted:!1,thinking:o,content:i,hasError:r}}catch(x){return c&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(c),c=0),x&&x.name==="AbortError"?(d=!0,{aborted:!0,thinking:o,content:i,hasError:r}):(typeof a=="function"&&a(x,{thinking:o,content:i,hasError:r}),{aborted:!1,error:x,thinking:o,content:i,hasError:!0})}}function Is(t){t.innerHTML="";const e=document.createElement("div"),n=document.createElement("div");t.appendChild(e),t.appendChild(n);let s=null,a=null,o=null,i=!1,r="";return({thinking:c,content:d})=>{c&&(s||(s=document.createElement("details"),s.className="mb-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-500",s.open=!0,a=document.createElement("summary"),a.className="cursor-pointer font-mono font-medium text-neutral-600 select-none hover:text-neutral-900 transition-colors",o=document.createElement("div"),o.className="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600",s.appendChild(a),s.appendChild(o),e.appendChild(s)),a&&(a.textContent=`思维链推导 (${c.length} 字)`),o&&(o.textContent=c),d&&!i&&s&&(s.open=!1,i=!0)),d&&d!==r&&(r=d,n.innerHTML=we(d))}}function Hs(t,e){let n="";const s=(e||"").trim();return s&&(n+=`
      <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
        <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${s.length} 字)</summary>
        <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${T(s)}</div>
      </details>`),t&&t.trim()?n+=we(t):n+='<p class="text-slate-400 text-xs">该洞察没有正文内容。</p>',n}const w={monthA:"",monthB:"",metricsA:null,metricsB:null,generated:!1,busy:!1,loadSeq:0,returnTab:"insight"};let ae=null,Bn=!1;function qo(){if(Bn)return;const t=l("view-compare");t&&(Bn=!0,t.addEventListener("click",e=>{const n=B(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="cmp-back")As();else if(s==="cmp-step"){const a=n.dataset.which,o=Number(n.dataset.delta);(a==="a"||a==="b")&&(o===-1||o===1)&&Jo(a,o)}else s==="cmp-generate"&&Ko()}))}function xe(t){const e=new Date;return e.setDate(1),e.setMonth(e.getMonth()+t),`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Dn(t){const[e,n]=t.split("-").map(Number);return e*12+(n-1)}function Vo(){return xe(0)}function Bs(t,e){const[n,s]=t.split("-").map(Number),a=new Date(n,s-1+e,1);return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`}function dt(t){if(!t)return"—";const[e,n]=t.split("-");return`${e} 年 ${parseInt(n,10)} 月`}function Ds(t){return Dn(t)>Dn(Vo())}function js(t,e,n){w.returnTab=n==="history"?"history":"insight",t&&e?(w.monthA=t,w.monthB=e):(w.monthA||(w.monthA=xe(-1)),w.monthB||(w.monthB=xe(-2))),mt("compare")}function Wo(t,e){js(t,e,"history")}function As(){mt(w.returnTab==="history"?"history":"insight")}function Go(){Ps()}function xn(){const t=l("cmp-a-label"),e=l("cmp-b-label");t&&(t.innerText=dt(w.monthA)),e&&(e.innerText=dt(w.monthB)),["a","b"].forEach(n=>{const s=n==="a"?w.monthA:w.monthB,a=Y(`cmp-${n}-next`);if(!a)return;const o=!s||Ds(Bs(s,1));a.disabled=o||w.busy,a.classList.toggle("opacity-40",o||w.busy),a.classList.toggle("cursor-not-allowed",o||w.busy)})}function jn(t){["cmp-a-prev","cmp-a-next","cmp-b-prev","cmp-b-next"].forEach(e=>{const n=Y(e);n&&(n.disabled=t,n.classList.toggle("opacity-40",t),n.classList.toggle("pointer-events-none",t),n.classList.toggle("cursor-not-allowed",t))}),t||xn()}function Jo(t,e){if(w.busy)return;const n=t==="a"?w.monthA:w.monthB,s=Bs(n,e);if(Ds(s)){z("不能选择未来的月份"),xn();return}t==="a"?w.monthA=s:w.monthB=s,Yo(),Ps()}function Yo(){const t=l("compare-insight-card"),e=l("cmp-status-tag");t&&(t.innerHTML='<p class="text-slate-400 text-xs">加载该月份对的对比数据…</p>'),e&&(e.innerText="加载中…")}function G(t,e){return t==null||t===""||isNaN(Number(t))?"—":Number(t).toFixed(e)}function Xo(t,e){if(t==null||e===null||e===void 0||t===""||e==="")return null;const n=Number(t),s=Number(e);return isNaN(n)||isNaN(s)?null:n-s}function bt(t,e,n,s){const a=Xo(t,e);if(a===null)return'<span class="text-slate-300">—</span>';const o=(a>0?"+":"")+a.toFixed(n);let i="text-neutral-500";return s==="down"?i=a<0?"text-emerald-600":a>0?"text-red-500":"text-neutral-400":s==="up"&&(i=a>0?"text-emerald-600":a<0?"text-red-500":"text-neutral-400"),`<span class="font-bold font-mono ${i}">${o}</span>`}function pt(t,e,n,s){return`<tr class="border-b border-neutral-100 last:border-0">
    <td class="py-2 pr-2 text-neutral-500 font-sans align-top">${t}</td>
    <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${e}</td>
    <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${n}</td>
    <td class="py-2 text-right font-mono whitespace-nowrap">${s}</td>
  </tr>`}function An(t){if(!t)return"—";const e=G(t.green_days,0),n=G(t.yellow_days,0),s=G(t.red_days,0);return e==="—"&&n==="—"&&s==="—"?"—":`${e} / ${n} / ${s}`}function Nn(t){if(!t)return"—";const e=G(t.workout_days,0);if(e==="—")return"—";const n=[];return t.workout_light!==null&&t.workout_light!==void 0&&n.push(`轻 ${t.workout_light}`),t.workout_medium!==null&&t.workout_medium!==void 0&&n.push(`中 ${t.workout_medium}`),t.workout_failure!==null&&t.workout_failure!==void 0&&n.push(`力竭 ${t.workout_failure}`),n.length?`${e} <span class="text-[10px] text-slate-400 font-normal">(${n.join(" / ")})</span>`:e}function Rn(){const t=l("compare-table-body");if(!t)return;const e=l("cmp-col-a"),n=l("cmp-col-b"),s=l("cmp-table-meta");e&&(e.innerText=dt(w.monthA)),n&&(n.innerText=dt(w.monthB));const a=w.metricsA,o=w.metricsB;if(!a&&!o){t.innerHTML='<tr><td colspan="4" class="py-6 text-center text-slate-400">暂无数据</td></tr>',s&&(s.innerText="");return}if(s){const c=[a,o].filter(d=>d&&d.record_days!==null&&d.record_days!==void 0).map(d=>`${d.month} ${d.record_days} 天`);s.innerText=c.join(" · ")}const i=(c,d)=>c?c[d]:null,r=[pt("体重均值 (kg)",G(i(a,"weight_avg"),1),G(i(o,"weight_avg"),1),bt(i(a,"weight_avg"),i(o,"weight_avg"),1,"down")),pt("体重净变化 (kg)",G(i(a,"weight_delta"),1),G(i(o,"weight_delta"),1),bt(i(a,"weight_delta"),i(o,"weight_delta"),1,"down")),pt("腰围均值 (cm)",G(i(a,"waist_avg"),1),G(i(o,"waist_avg"),1),bt(i(a,"waist_avg"),i(o,"waist_avg"),1,"down")),pt("腰围净变化 (cm)",G(i(a,"waist_delta"),1),G(i(o,"waist_delta"),1),bt(i(a,"waist_delta"),i(o,"waist_delta"),1,"down")),pt("平均睡眠时长 (小时)",G(i(a,"sleep_avg_hours"),1),G(i(o,"sleep_avg_hours"),1),bt(i(a,"sleep_avg_hours"),i(o,"sleep_avg_hours"),1,"up")),pt("熬夜分布 (绿/黄/红 天数)",An(a),An(o),'<span class="text-slate-300">—</span>'),pt("有运动天数",Nn(a),Nn(o),bt(i(a,"workout_days"),i(o,"workout_days"),0,"up")),pt("专注达服药天数 (天)",G(i(a,"concerta_days"),0),G(i(o,"concerta_days"),0),bt(i(a,"concerta_days"),i(o,"concerta_days"),0,null)),pt("平均夜间排水 (kg)",G(i(a,"night_loss_avg"),2),G(i(o,"night_loss_avg"),2),bt(i(a,"night_loss_avg"),i(o,"night_loss_avg"),2,"down"))];t.innerHTML=r.join("")}function Pn(){const t=l("cmp-warn");if(!t)return;const e=[];[{ym:w.monthA,m:w.metricsA},{ym:w.monthB,m:w.metricsB}].forEach(({ym:n,m:s})=>{s&&(s.incomplete_month?e.push(`提示：${dt(n)}尚未过完，结论置信度低`):s.data_insufficient&&e.push(`提示：${dt(n)}数据不足，结论置信度低`))}),e.length?(t.innerHTML=e.join("<br>"),t.classList.remove("hidden")):(t.innerHTML="",t.classList.add("hidden"))}function Ns(){w.generated=!1;const t=l("compare-insight-card"),e=l("cmp-status-tag"),n=l("compare-gen-btn");t&&(t.innerHTML="<p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>"),e&&(e.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段对比综述</span>')}function Rs(t,e,n){w.generated=!0;const s=l("compare-insight-card"),a=l("cmp-status-tag"),o=l("compare-gen-btn"),i=n instanceof Date?n:new Date(n),r=String(i.getHours()).padStart(2,"0"),c=String(i.getMinutes()).padStart(2,"0");s&&(s.innerHTML=Hs(t,e)),a&&(a.innerText=`${dt(w.monthA)} vs ${dt(w.monthB)} · 生成于 ${r}:${c}`),o&&(o.innerHTML='<span class="font-mono">重新生成阶段对比</span>')}async function Ps(){w.monthA||(w.monthA=xe(-1)),w.monthB||(w.monthB=xe(-2)),xn();const t=++w.loadSeq,e=w.monthA,n=w.monthB,s=-new Date().getTimezoneOffset();try{const a=await M.checkComparePeriod(e,n,s);if(t!==w.loadSeq)return;const o=a&&a.data;if(!o)throw new Error("加载失败");w.metricsA=o.metrics_a||null,w.metricsB=o.metrics_b||null,Rn(),Pn(),o.exists&&o.insight?Rs(o.insight.content||"",o.insight.thinking||"",o.insight.created_at):Ns()}catch(a){if(t!==w.loadSeq)return;w.metricsA=null,w.metricsB=null,Rn(),Pn();const o=a instanceof Error?a.message:String(a),i=l("compare-insight-card");i&&(i.innerHTML=`<p class="text-red-500 text-xs">加载对比数据失败：${T(o)}</p>`);const r=l("cmp-status-tag");r&&(r.innerText="加载失败"),z("加载对比数据失败："+o)}}async function Ko(){if(ae){ae.abort();return}if(w.busy)return;const t=l("compare-insight-card"),e=l("cmp-status-tag"),n=l("compare-gen-btn");if(!t||!n||!e||w.generated&&!await st(`「${dt(w.monthA)} vs ${dt(w.monthB)}」已生成过阶段对比综述，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成阶段对比",confirmText:"确定重新生成",danger:!1}))return;const s=n.className;w.busy=!0,n.className="w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",n.innerHTML="<span>停止生成</span>",jn(!0),w.loadSeq++,t.classList.add("typing-cursor"),e.innerText="AI 正在推导两月差异...";const a=Is(t),o=-new Date().getTimezoneOffset(),i=new AbortController;ae=i;let r={aborted:!1,thinking:"",content:"",hasError:!1};try{r=await mn({url:`/api/v1/insights/compare/stream?month_a=${w.monthA}&month_b=${w.monthB}&tz_offset=${o}`,signal:i.signal,onUpdate:a,onDone:({thinking:c,content:d,hasError:u})=>{u?e.innerText="分析失败":d||c?Rs(d,c,new Date):(t.innerHTML='<p class="text-slate-400">未能获取到对比内容，请检查后端大模型连接。</p>',e.innerText="暂无对比内容")},onError:(c,{thinking:d,content:u})=>{if(u||d)a({thinking:d,content:u+`

> **注意**: 网络连接已完成或阶段传输结束`}),e.innerText="分析完成(部分)";else if(c instanceof TypeError)t.innerHTML=`<p class="text-red-500">无法连接本地服务（${T(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,e.innerText="本地服务未连接";else{const m=c instanceof Error?c.message:String(c);t.innerHTML=`<p class="text-red-500">连接 AI 对比服务失败: ${T(m)}</p>`,e.innerText="生成异常"}}}),r.aborted&&(r.content||r.thinking?(a({thinking:r.thinking,content:r.content+`

> **已手动停止生成**`}),e.innerText="已手动停止"):(Ns(),e.innerText="已取消生成"))}finally{ae===i&&(ae=null),t.classList.remove("typing-cursor"),w.busy=!1,jn(!1),n.className=s,!r.aborted&&!r.hasError&&(r.content||r.thinking)||w.generated?n.innerHTML='<span class="font-mono">重新生成阶段对比</span>':n.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段对比综述</span>'}}const f={items:[],beforeId:0,hasMore:!1,loading:!1,rangeDays:0,compareMode:!1,q:"",error:"",expanded:{},details:{},manageMode:!1,selected:{}};let Os=()=>{},He=null,Ot=null,ze=!1,On=!1;function Zo(t={}){if(typeof t.onDeleted=="function"&&(Os=t.onDeleted),On)return;const e=l("view-history");if(!e)return;On=!0,e.addEventListener("click",a=>{const o=B(a.target,"[data-action]");if(!o)return;switch(o.dataset.action){case"back-insight":mt("insight");break;case"history-manage":ai();break;case"history-filter":{const r=Number(o.dataset.days);Number.isNaN(r)||ti(r);break}case"history-filter-compare":ei();break;case"history-load-more":Te(!1);break;case"history-select-all":ii();break;case"history-delete":ri();break;case"history-item-click":{const r=Number(o.dataset.id);r>0&&si(r);break}}});const n=g("history-search");n==null||n.addEventListener("input",ni);const s=l("history-list");if(s){let a=-1,o=0,i=0;const r=()=>{Ot&&(clearTimeout(Ot),Ot=null),a=-1};s.addEventListener("pointerdown",c=>{if(f.manageMode)return;const d=B(c.target,"[data-hp-id]");if(!d)return;const u=Number(d.dataset.hpId);u&&(r(),ze=!1,a=c.pointerId,o=c.clientX,i=c.clientY,Ot=setTimeout(()=>{Ot=null,ze=!0,f.manageMode=!0,f.selected={[u]:!0},Ge(),lt()},500))}),s.addEventListener("pointermove",c=>{c.pointerId!==a||!Ot||Math.hypot(c.clientX-o,c.clientY-i)>10&&r()}),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r),s.addEventListener("contextmenu",c=>{B(c.target,"[data-hp-id]")&&c.preventDefault()})}}function Qo(){f.rangeDays=0,f.compareMode=!1,f.q="",We();const t=g("history-search");t&&(t.value=""),bn(0),mt("history"),Te(!0)}function ti(t){f.rangeDays=t,f.compareMode=!1,We(),bn(t),tt.state.currentTab==="history"&&Te(!0)}function ei(){f.rangeDays=0,f.compareMode=!0,We(),bn("compare"),tt.state.currentTab==="history"&&Te(!0)}function bn(t){[0,7,30,60].forEach(n=>{const s=l(`hfilter-${n}`);s&&(s.className=n===t?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all")});const e=l("hfilter-compare");e&&(e.className=t==="compare"?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all")}function ni(){He&&clearTimeout(He),He=setTimeout(()=>{var t;He=null,We(),f.q=(((t=g("history-search"))==null?void 0:t.value)||"").trim(),Te(!0)},300)}async function Te(t){if(f.loading)return;f.loading=!0,t&&(f.items=[],f.beforeId=0,f.hasMore=!1,f.error="",f.expanded={},f.details={}),lt();const e={limit:"10"};f.beforeId>0&&(e.before_id=String(f.beforeId)),f.compareMode?e.scope="compare":f.rangeDays>0&&(e.range_days=String(f.rangeDays)),f.q&&(e.q=f.q);try{const n=await M.getInsightHistory(e),s=n&&n.data||{},a=s.items||[];f.items=f.items.concat(a),f.hasMore=!!s.has_more,a.length>0&&(f.beforeId=a[a.length-1].id)}catch(n){f.error=n instanceof Error?n.message:String(n)}finally{f.loading=!1,lt()}}function lt(){const t=l("history-list"),e=l("history-loadmore"),n=l("history-manage-btn");if(t){if(!f.items.length){f.loading?t.innerHTML='<p class="text-center text-xs text-slate-400 py-8">加载中…</p>':f.error?t.innerHTML=`<p class="text-center text-xs text-red-500 py-8">加载失败：${T(f.error)}</p>`:t.innerHTML='<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>',e&&e.classList.add("hidden"),n&&n.classList.toggle("hidden",!f.manageMode),on();return}t.innerHTML=f.items.map(s=>{const a=!!f.expanded[s.id],o=!!f.selected[s.id],i=new Date(s.created_at),r=isNaN(i.getTime())?"":`${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")} ${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`,c=(s.content||"").replace(/[#*`>|\-]/g," ").replace(/\s+/g," ").trim().slice(0,90)||"（无正文）",d=s.scope==="compare",u=s.meta||{},m=u.month_a&&u.month_b?`${T(u.month_a)} vs ${T(u.month_b)}`:`${T(s.start_date)} ~ ${T(s.end_date)}`,v=d?m:`${T(s.start_date)} ~ ${T(s.end_date)}`,x=d?"阶段对比":`近 ${s.range_days} 天`,y=`
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-bold text-neutral-900 font-mono">${v}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600 font-mono font-medium">${x}</span>
      </div>
      <p class="text-xs text-neutral-500 leading-relaxed ${a&&!f.manageMode?"":"line-clamp-2"}">${T(c)}</p>
      <div class="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100 font-mono text-[10px]">
        <span class="text-neutral-400">${r}${s.model?" · "+T(s.model):""}</span>
        ${f.manageMode?"":d?'<span class="text-neutral-900 font-medium hover:underline">查看对比 ›</span>':`<span class="text-neutral-900 font-medium hover:underline">${a?"收起 ▴":"展开 ▾"}</span>`}
      </div>`;if(f.manageMode)return`
        <div data-hp-id="${s.id}" data-action="history-item-click" data-id="${s.id}" class="cursor-pointer select-none flex items-start space-x-3 ht-card transition-colors ${o?"border-neutral-900 ring-1 ring-neutral-900":""}">
          <div class="mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${o?"bg-neutral-900 border-neutral-900 text-white":"border-neutral-300 bg-white"}">
            ${o?'<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>':""}
          </div>
          <div class="flex-1 min-w-0">${y}</div>
        </div>`;let E="";if(a){const _=f.details[s.id];if(!_)E='<p class="text-[11px] font-mono text-neutral-400 mt-2">加载全文…</p>';else{const b=(_.thinking||"").trim();E=`${b?`
          <details class="mt-2.5 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-600">
            <summary class="cursor-pointer font-mono font-medium text-neutral-700 select-none hover:text-neutral-900 transition-colors">思维链推导 (${b.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600 text-[11px]">${T(b)}</div>
          </details>`:""}
          <div class="mt-2 text-xs text-neutral-700 leading-relaxed markdown-body">${we(_.content||"")}</div>`}}return`
      <div data-hp-id="${s.id}" class="ht-card">
        <div class="cursor-pointer select-none" data-action="history-item-click" data-id="${s.id}">${y}</div>
        ${E}
      </div>`}).join(""),e&&e.classList.toggle("hidden",!f.hasMore),n&&n.classList.toggle("hidden",!f.items.length&&!f.manageMode),on()}}function si(t){if(ze){ze=!1;return}if(f.manageMode){oi(t);return}const e=f.items.find(n=>n.id===t);if(e&&e.scope==="compare"){const n=e.meta||{},s=n.month_a||(e.start_date||"").slice(0,7),a=n.month_b||(e.end_date||"").slice(0,7);if(s&&a){Wo(s,a);return}}li(t)}function ai(){f.manageMode=!f.manageMode,f.manageMode||(f.selected={}),Ge(),lt()}function We(){f.manageMode&&(f.manageMode=!1,f.selected={},Ge())}function Ge(){const t=l("history-manage-btn");t&&(t.innerText=f.manageMode?"完成":"管理",t.className=f.manageMode?"text-xs font-mono font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-lg transition-colors":"text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition-colors"),on()}function oi(t){f.selected[t]?delete f.selected[t]:f.selected[t]=!0,lt()}function ii(){const t=f.items.map(n=>n.id);if(t.filter(n=>f.selected[n]).length===t.length)f.selected={};else{const n={};t.forEach(s=>{n[s]=!0}),f.selected=n}lt()}function on(){const t=l("history-delete-bar");if(!t)return;const e=f.manageMode&&f.items.length>0;if(t.classList.toggle("hidden",!e),!e)return;const n=f.items.map(r=>r.id),s=n.filter(r=>f.selected[r]).length,a=l("history-selected-count");a&&(a.innerText=`已选 ${s} 项`);const o=l("history-selectall-btn");o&&(o.innerText=n.length>0&&s===n.length?"取消全选":"全选");const i=Y("history-delete-btn");i&&(i.disabled=s===0,i.innerText=s>0?`删除所选 (${s})`:"删除所选",i.className=s>0?"text-xs font-mono font-medium bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg transition-colors":"text-xs font-mono font-medium bg-neutral-700 text-neutral-400 px-3.5 py-1.5 rounded-lg cursor-not-allowed transition-colors")}async function ri(){const t=f.items.map(n=>n.id).filter(n=>f.selected[n]);if(!(!t.length||!await st(`确定删除所选 ${t.length} 条洞察存档？删除后不可恢复。`,{title:"删除洞察存档",confirmText:"确定删除"})))try{await M.batchDeleteInsights(t),f.items=f.items.filter(n=>!f.selected[n.id]),Object.keys(f.selected).forEach(n=>{const s=Number(n);delete f.expanded[s],delete f.details[s]}),f.selected={},f.items.length||(f.manageMode=!1),Ge(),lt(),Os()}catch(n){const s=n instanceof Error?n.message:String(n);z("删除失败："+s)}}async function li(t){if(f.expanded[t]){f.expanded[t]=!1,lt();return}if(f.expanded[t]=!0,lt(),!f.details[t]){try{const e=await M.getInsightDetail(t);f.details[t]=e&&e.data?e.data:{content:"加载失败",thinking:""}}catch(e){const n=e instanceof Error?e.message:String(e);f.details[t]={content:"加载失败："+n,thinking:""}}lt()}}let Jt=30,Q=q(new Date),$t="today",Fe=!1,rn=0,oe=null,zn=!1;const Fn="ht-seg-btn active",Un="ht-seg-btn",ci="<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>";function di(t){t.insertAdjacentHTML("beforeend",Uo),ui(),Zo({onDeleted:Zt}),qo()}function ui(){if(zn)return;const t=l("view-insight");if(!t)return;zn=!0,t.addEventListener("click",s=>{const a=B(s.target,"[data-action]");if(!a)return;switch(a.dataset.action){case"open-compare":js();break;case"open-history":Qo();break;case"insight-days":{const i=Number(a.dataset.days);(i===7||i===30||i===60)&&fi(i);break}case"insight-end-mode":{const i=a.dataset.mode;(i==="today"||i==="yesterday")&&mi(i);break}case"insight-generate":bi();break}});const e=g("insight-end-date");e==null||e.addEventListener("change",s=>{const a=s.currentTarget;a instanceof HTMLInputElement&&xi(a.value)});const n=()=>{document.visibilityState==="visible"&&tt.state.currentTab==="insight"&&Zt()};document.addEventListener("visibilitychange",n),window.addEventListener("pageshow",n)}function pi(){Zt()}function fi(t){Jt=t,["7","30","60"].forEach(e=>{const n=l(`pill-${e}`);n&&(n.className=parseInt(e,10)===t?"ht-seg-btn active":"ht-seg-btn")}),Yt(),Zt()}function gn(){return $t==="yesterday"?Ct(q(new Date),-1):$t==="custom"&&Q?Q:q(new Date)}function be(){const t=q(new Date),e=l("endpill-today"),n=l("endpill-yesterday");e&&(e.className=$t==="today"?Fn:Un),n&&(n.className=$t==="yesterday"?Fn:Un);const s=g("insight-end-date");s&&(s.max=t,s.value=Q||t,s.classList.toggle("border-neutral-900",$t==="custom"))}function mi(t){$t=t,Q=gn(),be(),Yt(),Zt()}function xi(t){const e=q(new Date);if(!t||t>e){be(),z("截止日不能晚于今天");return}$t="custom",Q=t,be(),Yt(),Zt()}function qn(t){["7","30","60"].forEach(n=>{const s=Y(`pill-${n}`);s&&(s.disabled=t,s.classList.toggle("opacity-50",t),s.classList.toggle("cursor-not-allowed",t),s.classList.toggle("pointer-events-none",t))}),["endpill-today","endpill-yesterday"].forEach(n=>{const s=Y(n);s&&(s.disabled=t,s.classList.toggle("pointer-events-none",t),s.classList.toggle("opacity-50",t))});const e=g("insight-end-date");e&&(e.disabled=t,e.classList.toggle("opacity-50",t))}async function bi(){const t=l("insight-content"),e=l("insight-status-tag"),n=Y("btn-generate-insight");if(!t||!e||!n)return;if(oe){oe.abort();return}if(Q=gn(),be(),Fe&&!await st(`截至 ${Q} 的近 ${Jt} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成洞察",confirmText:"确定重新生成",danger:!1}))return;const s=n.className;n.className="w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",n.innerHTML="<span>停止生成</span>",rn++,qn(!0),t.classList.add("typing-cursor"),e.innerText="AI 正在推导生理因果...";const a=Is(t),o=-new Date().getTimezoneOffset(),i=new AbortController;oe=i;let r={aborted:!1,thinking:"",content:"",hasError:!1};try{r=await mn({url:`/api/v1/insights/stream?days=${Jt}&end_date=${Q}&tz_offset=${o}`,signal:i.signal,onUpdate:a,onDone:({thinking:c,content:d,hasError:u})=>{u?e.innerText="分析失败":d||c?zs(d,c,new Date):(t.innerHTML='<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>',e.innerText="暂无分析内容")},onError:(c,{thinking:d,content:u})=>{if(u||d)a({thinking:d,content:u+`

> **注意**: 网络连接已完成或阶段传输结束`}),e.innerText="分析完成(部分)";else if(c instanceof TypeError)t.innerHTML=`<p class="text-red-500">无法连接本地服务（${T(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,e.innerText="本地服务未连接";else{const m=c instanceof Error?c.message:String(c);t.innerHTML=`<p class="text-red-500">连接 AI 洞察服务失败: ${T(m)}</p>`,e.innerText="生成异常"}}}),r.aborted&&(r.content||r.thinking?(a({thinking:r.thinking,content:r.content+`

> **已手动停止生成**`}),e.innerText="已手动停止"):(Yt(),e.innerText="已取消生成"))}finally{oe===i&&(oe=null),t.classList.remove("typing-cursor"),qn(!1),n.className=s,!r.aborted&&!r.hasError&&(r.content||r.thinking)||Fe?n.innerHTML='<span class="font-mono">重新生成</span>':n.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段深度洞察</span>'}}function Yt(){Fe=!1;const t=l("insight-content"),e=l("insight-status-tag"),n=l("btn-generate-insight");t&&(t.innerHTML=ci),e&&(e.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段深度洞察</span>')}function zs(t,e,n){Fe=!0;const s=l("insight-content"),a=l("insight-status-tag"),o=l("btn-generate-insight"),i=n instanceof Date?n:new Date(n),r=String(i.getHours()).padStart(2,"0"),c=String(i.getMinutes()).padStart(2,"0");s&&(s.innerHTML=Hs(t,e)),a&&(a.innerHTML=`近 ${Jt} 天（截至 ${Q}）· 生成于 ${r}:${c} · <button type="button" data-action="open-history" class="text-blue-600 cursor-pointer font-bold">点击查看</button>`),o&&(o.innerHTML='<span class="font-mono">重新生成</span>')}async function Zt(){const t=l("insight-content"),e=l("insight-status-tag"),n=l("btn-generate-insight");if(!e||!n||!t)return;Q=gn(),be();const s=Jt,a=Q,o=++rn,i=()=>o!==rn||s!==Jt||a!==Q,r=-new Date().getTimezoneOffset();try{const c=await M.checkInsightPeriod(s,a,r);if(i())return;const d=c&&c.data;if(!d||!d.exists||!d.insight){Yt();return}const u=d.insight;zs(u.content||"",u.thinking||"",u.created_at)}catch{if(i())return;Yt()}}const gi=`      <!-- 4. 睡前小结 (Evening View) -->
      <section id="view-evening" class="fade-in space-y-3.5 hidden">
        <!-- 顶部标题栏：1.5px 极细月亮图标 + 极客状态小标 + 日期切换与今日快捷按钮 -->
        <div class="flex justify-between items-center gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <h2 class="text-sm font-bold text-neutral-900 leading-none truncate">睡前小结</h2>
              <span class="text-[10px] font-mono text-neutral-400">EVENING REVIEW</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 font-mono">
            <input type="date" id="summary-date" class="bg-white border border-neutral-200 text-neutral-800 text-xs font-mono font-medium rounded-lg px-2 py-1 w-[138px] outline-none focus:border-neutral-800 transition-colors">
            <button type="button" data-action="ev-today" class="h-8 px-2.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg text-[11px] text-neutral-600 font-medium transition-all active:scale-95">今日</button>
          </div>
        </div>

        <!-- ── 主卡：今日最难忘的一张图 + 感想 ── -->
        <div class="ht-card space-y-3">
          <div class="flex items-center justify-between pb-1">
            <span class="text-xs font-bold text-neutral-900">今日最难忘的一张图</span>
            <span class="text-[9px] font-mono text-neutral-400">1 PHOTO · LOCAL ONLY</span>
          </div>

          <!-- 空态 -->
          <label id="photo-empty" for="photo-input" class="block cursor-pointer">
            <div class="border border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/50 hover:bg-neutral-100/60 rounded-xl py-7 flex flex-col items-center justify-center transition-all active:scale-[0.99]">
              <div class="w-10 h-10 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 shadow-sm mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <span class="text-xs font-medium text-neutral-700">选择今天的这一张</span>
              <span class="text-[10px] font-mono text-neutral-400 mt-0.5">自动压缩后仅存本机</span>
            </div>
          </label>

          <!-- 已选 -->
          <div id="photo-filled" class="hidden">
            <div class="relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img id="photo-preview" alt="今日图片" data-action="ev-open-photo" class="w-full h-48 object-cover cursor-zoom-in">
              <div class="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-neutral-900/60 to-transparent"></div>
              <span class="absolute top-2 left-2 text-[10px] font-mono font-medium text-white bg-neutral-900/60 backdrop-blur px-2 py-0.5 rounded-md">TODAY PHOTO</span>
              <div class="absolute bottom-2 right-2 flex space-x-1.5 font-mono">
                <label for="photo-input" class="text-[10px] font-medium text-neutral-800 bg-white/90 hover:bg-white px-2.5 py-1 rounded-md cursor-pointer active:scale-95 transition-transform shadow-sm">替换</label>
                <button type="button" data-action="ev-remove-photo" class="text-[10px] font-medium text-rose-600 bg-white/90 hover:bg-white px-2.5 py-1 rounded-md active:scale-95 transition-transform shadow-sm">删除</button>
              </div>
            </div>
            <p id="photo-meta" class="pt-1.5 text-[10px] font-mono text-neutral-400"></p>
          </div>
          <input type="file" id="photo-input" accept="image/*" class="hidden">

          <!-- 感想 -->
          <div class="pt-2 border-t border-dashed border-neutral-200">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">那一刻的感想</span>
              <span class="text-[10px] font-mono text-neutral-400"><span id="note-len">0</span> 字</span>
            </div>
            <textarea id="note-text" rows="3" class="evo-selectable w-full bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-lg p-2.5 text-xs outline-none focus:border-neutral-800 focus:bg-white transition-all resize-none leading-relaxed placeholder:text-neutral-400" placeholder="记录下为什么这张图值得被记住…"></textarea>
          </div>
        </div>

        <!-- ── 今日完成的三件事 ── -->
        <div class="ht-card space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-neutral-900">今日完成的三件事</span>
            <span id="done-count" class="text-[10px] font-mono font-bold text-neutral-400 tabular-nums transition-colors">0 / 3</span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center space-x-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg px-2.5 py-2 focus-within:border-neutral-500 focus-within:bg-white transition-all">
              <span class="evo-seq-dot" id="seq-1">1</span>
              <input type="text" id="done-1" maxlength="200" placeholder="最有成就感的那件事" class="evo-selectable flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400">
            </div>
            <div class="flex items-center space-x-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg px-2.5 py-2 focus-within:border-neutral-500 focus-within:bg-white transition-all">
              <span class="evo-seq-dot" id="seq-2">2</span>
              <input type="text" id="done-2" maxlength="200" placeholder="其次推进的一件事" class="evo-selectable flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400">
            </div>
            <div class="flex items-center space-x-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg px-2.5 py-2 focus-within:border-neutral-500 focus-within:bg-white transition-all">
              <span class="evo-seq-dot" id="seq-3">3</span>
              <input type="text" id="done-3" maxlength="200" placeholder="哪怕很小，也算（可留空）" class="evo-selectable flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400">
            </div>
          </div>
        </div>

        <!-- ── 今日对自己的打分 ── -->
        <div class="ht-card space-y-2">
          <div class="flex items-end justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-neutral-900">今日自评分</span>
              <button type="button" data-action="ev-toggle-bands" class="text-[10px] font-mono text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all active:scale-95">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>文案</span>
              </button>
            </div>
            <div class="flex items-baseline space-x-1 font-mono">
              <span id="score-value" class="text-3xl font-black text-neutral-900 tabular-nums leading-none">7</span>
              <span class="text-xs text-neutral-400">/ 10</span>
            </div>
          </div>
          <div class="pt-1">
            <input type="range" id="score-range" min="1" max="10" step="1" value="7" class="ht-range w-full">
            <div class="flex justify-between text-[10px] font-mono text-neutral-400 px-0.5 mt-1 tabular-nums">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
          </div>
          <div id="score-text" class="mt-2 text-center text-xs font-mono font-medium rounded-lg py-2 bg-neutral-50 border border-neutral-200/80 text-neutral-700 transition-colors">还不错，稳住了节奏</div>

          <!-- 分档文案配置 -->
          <div id="band-editor" class="evo-collapsible">
            <div class="mt-3 pt-3 border-t border-dashed border-neutral-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">评分文案设置</span>
                <button type="button" data-action="ev-reset-bands" class="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 active:scale-95 transition-transform">恢复默认</button>
              </div>
              <div id="band-rows" class="space-y-1.5"></div>
              <div class="flex items-center justify-between mt-3">
                <p class="text-[10px] text-neutral-400 leading-relaxed font-mono">改动保存后立即生效并同步历史小结。</p>
                <button type="button" data-action="ev-save-bands" id="band-save-btn" class="shrink-0 ml-2 text-[11px] font-mono font-semibold text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg active:scale-95 transition-all">保存设置</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── 保存按钮 ── -->
        <button type="button" data-action="ev-save" id="ev-save-btn" class="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          <span>保存今日小结</span>
        </button>

        <!-- ── 小结深度洞察 (ht-card，与「AI 洞察」页面统一风格) ── -->
        <div class="ht-card space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xs font-bold text-neutral-900 leading-none">小结深度洞察</h3>
                <span class="text-[9px] font-mono text-neutral-400">SUMMARY INSIGHT</span>
              </div>
            </div>
            <span class="text-[10px] font-mono text-neutral-400">独立于全周期洞察</span>
          </div>

          <!-- 关联生理数据窗口：7 / 30 天 -->
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">关联生理数据</span>
            <div class="flex gap-1" id="ev-insight-range">
              <button type="button" class="ht-seg-btn active" data-action="ev-insight-range" data-val="7">近7天</button>
              <button type="button" class="ht-seg-btn" data-action="ev-insight-range" data-val="30">近30天</button>
            </div>
          </div>

          <div id="insight-empty" class="pt-1">
            <p class="text-xs text-neutral-500 leading-relaxed">从小结的<b class="text-neutral-800">自评与文字</b>出发，结合所选区间内的体重、睡眠与打卡趋势，深度解读心理状态与成就感。</p>
            <button type="button" data-action="ev-insight-generate" id="ev-insight-btn" class="mt-3 w-full h-10 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>生成小结深度洞察</span>
            </button>
          </div>

          <div id="insight-panel" class="hidden space-y-2.5 pt-1">
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span id="insight-meta" class="text-neutral-400"></span>
              <div class="flex items-center gap-1.5">
                <button type="button" id="ev-insight-stop-btn" data-action="ev-insight-stop" class="hidden text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono transition-colors">停止生成</button>
                <button type="button" id="ev-insight-reset-btn" data-action="ev-insight-reset" class="text-neutral-400 hover:text-neutral-800 px-1 font-mono transition-colors">清除</button>
              </div>
            </div>

            <!-- 思维链推导折叠面板 -->
            <div class="pb-2 border-b border-neutral-100">
              <button type="button" data-action="ev-toggle-thinking" class="text-[10px] font-mono text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
                <span id="think-arrow" class="inline-block transform transition-transform text-[9px]">▶</span>
                <span>思维链推导 (REASONING)</span>
              </button>
              <div id="think-body" class="evo-collapsible">
                <p id="think-text" class="mt-2 text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 leading-relaxed font-mono whitespace-pre-line"></p>
              </div>
            </div>

            <div id="insight-body" class="markdown-body text-xs text-neutral-700 leading-relaxed"></div>
          </div>
        </div>

        <!-- ── 往期回顾 ── -->
        <div class="pt-2 space-y-3">
          <div class="flex items-center justify-between px-0.5">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-neutral-900">往期回顾</span>
              <span id="ev-history-total" class="text-[10px] font-mono font-bold text-neutral-400 tabular-nums">0 篇</span>
            </div>
            <span class="text-[10px] font-mono text-neutral-400">左滑卡片可删除</span>
          </div>

          <!-- 筛选面板 -->
          <div class="ht-card p-3 space-y-2.5">
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 w-8 shrink-0">日期</span>
              <div class="flex flex-wrap gap-1.5" id="ev-filter-date">
                <button type="button" class="ht-seg-btn active" data-action="ev-filter-date" data-val="all">全部</button>
                <button type="button" class="ht-seg-btn" data-action="ev-filter-date" data-val="7">近 7 天</button>
                <button type="button" class="ht-seg-btn" data-action="ev-filter-date" data-val="30">近 30 天</button>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 w-8 shrink-0">评分</span>
              <div class="flex flex-wrap gap-1.5" id="ev-filter-score">
                <button type="button" class="ht-seg-btn active" data-action="ev-filter-score" data-val="all">全部</button>
                <button type="button" class="ht-seg-btn" data-action="ev-filter-score" data-val="high">9-10</button>
                <button type="button" class="ht-seg-btn" data-action="ev-filter-score" data-val="good">7-8</button>
                <button type="button" class="ht-seg-btn" data-action="ev-filter-score" data-val="mid">5-6</button>
                <button type="button" class="ht-seg-btn" data-action="ev-filter-score" data-val="low">1-4</button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between px-0.5 text-[10px] font-mono">
            <span class="text-neutral-400">筛选结果 <b id="ev-filter-count" class="text-neutral-800 tabular-nums">0</b> 篇</span>
            <button type="button" id="ev-filter-reset" data-action="ev-filter-reset" class="hidden text-neutral-600 hover:text-neutral-900 active:scale-95 transition-transform">清除筛选</button>
          </div>

          <div id="ev-history-list" class="space-y-0"></div>

          <div id="ev-history-empty" class="hidden ht-card p-8 text-center space-y-1">
            <p class="font-mono text-xs text-neutral-400">NO DATA</p>
            <p class="text-xs font-semibold text-neutral-700">没有符合条件的小结</p>
            <p class="text-[10px] font-mono text-neutral-400">试着放宽日期或评分范围</p>
          </div>

          <div class="pt-1 pb-3 text-center">
            <button type="button" id="ev-load-more" data-action="ev-load-more" class="hidden px-4 py-1.5 bg-white border border-neutral-200 hover:border-neutral-400 rounded-lg text-xs font-mono text-neutral-600 transition-all active:scale-95">
              加载更多（剩 <span id="ev-remain-count">0</span> 篇）
            </button>
            <p id="ev-load-done" class="hidden text-[10px] font-mono text-neutral-400">ALL SUMMARIES LOADED</p>
          </div>
        </div>
      </section>
`,Qt=6,A={summaries:[],dateFilter:"all",scoreFilter:"all",visible:Qt},Mt={W:84,drag:null,suppressClick:0};let ct={bandOf:()=>({range:[7,8],label:"还不错",tone:"indigo"}),toneOf:()=>({chip:"text-indigo-700 bg-indigo-50 border-indigo-200",dot:"#6366f1",band:""}),todayStr:()=>"",getCurrentDate:()=>"",onDeletedCurrentDate:()=>{},openPhoto:()=>{}},Vn=!1;function hi(t){if(ct={...ct,...t},Vn)return;const e=l("ev-history-list");e&&(Vn=!0,e.addEventListener("click",n=>{const s=B(n.target,"[data-action]");if(s){const u=s.dataset.action;if(u==="ev-open-photo"){n.stopPropagation(),s instanceof HTMLImageElement&&s.getAttribute("src")&&ct.openPhoto(s.src,s.dataset.alt||s.alt||"小结图片");return}if(u==="ev-delete"){n.stopPropagation();const m=s.dataset.date;m&&Hi(m);return}if(u==="ev-copy"){n.stopPropagation();const m=s.dataset.date;m&&_i(m);return}}const a=B(n.target,".evo-entry-head");if(!a||Date.now()-Mt.suppressClick<320)return;const o=a.closest(".evo-swipe");if(o&&o.classList.contains("open")){o.classList.remove("open");return}qs();const i=a.closest(".ht-card")||a.parentElement;if(!i)return;const r=i.querySelector(".evo-collapsible"),c=a.querySelector(".evo-entry-arrow");if(!r)return;const d=!r.classList.contains("open");r.classList.toggle("open",d),c instanceof HTMLElement&&(c.style.transform=d?"rotate(180deg)":"rotate(0deg)")}))}function Fs(t){const e=["周日","周一","周二","周三","周四","周五","周六"],n=new Date(t+"T00:00:00");return isNaN(n.getTime())?"":e[n.getDay()]}function vi(t){const e=new Date(ct.todayStr()+"T00:00:00"),n=new Date(t+"T00:00:00");return Math.round((e.getTime()-n.getTime())/864e5)}function ce(t){return t?t.slice(5):""}function Wn(t){return t?t.slice(0,7):""}function yi(t){const e=t.split("-");return e[0]+" 年 "+Number(e[1])+" 月"}async function Us(){try{const t=await M.getEveningSummaries();A.summaries=t&&t.data&&t.data.items||[]}catch(t){const e=t instanceof Error?t.message:String(t);z("加载往期小结失败："+e),A.summaries=[]}A.visible=Math.max(A.visible,Qt),te()}function Je(){document.querySelectorAll("#ev-history-list .evo-score-chip").forEach(t=>{if(!(t instanceof HTMLElement))return;const e=Number(t.dataset.score)||7,n=ct.bandOf(e);t.className="evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border "+ct.toneOf(n.tone).chip})}function wi(t){document.querySelectorAll("#ev-filter-date button").forEach(e=>e.classList.remove("active")),t.classList.add("active"),A.dateFilter=t.dataset.val||"all",A.visible=Qt,te()}function ki(t){document.querySelectorAll("#ev-filter-score button").forEach(e=>e.classList.remove("active")),t.classList.add("active"),A.scoreFilter=t.dataset.val||"all",A.visible=Qt,te()}function Ti(){document.querySelectorAll("#ev-filter-date button, #ev-filter-score button").forEach(t=>{t.classList.toggle("active",t instanceof HTMLElement&&t.dataset.val==="all")}),A.dateFilter="all",A.scoreFilter="all",A.visible=Qt,te()}function Li(){A.visible+=Qt,te()}function Ei(){return A.summaries.filter(t=>{if(A.dateFilter!=="all"&&vi(t.record_date)>Number(A.dateFilter)-1)return!1;const e=t.score||0;return!(A.scoreFilter==="high"&&e<9||A.scoreFilter==="good"&&(e<7||e>8)||A.scoreFilter==="mid"&&(e<5||e>6)||A.scoreFilter==="low"&&e>4)})}function Si(t){const e=(t.done_items||[]).filter(s=>s&&s.trim()),n=[`${t.record_date} ${Fs(t.record_date)} · ${t.score} 分`,"","【完成事项】"];return e.length?e.forEach((s,a)=>n.push(`${a+1}. ${s}`)):n.push("（未填写）"),n.push("","【当时的感想】",t.note_text&&t.note_text.trim()?t.note_text:"（未填写）"),n.join(`
`)}async function _i(t){const e=(A.summaries||[]).find(s=>s.record_date===t);if(!e)return;const n=await ia(Si(e));z(n?"已复制 "+ce(t)+" 的小结":"复制失败，请长按文字手动复制")}function $i(t,e){const n=t.score!=null&&t.score>0?t.score:7,s=ct.toneOf(ct.bandOf(n).tone),a=ce(t.record_date),o=t.photo_id?`<img src="/api/v1/evening/photo/${t.photo_id}" alt="${T(a)}" data-action="ev-open-photo" data-alt="${T(a)} 小结图片" class="rounded-lg object-cover shrink-0 border border-neutral-200 bg-neutral-100 cursor-zoom-in" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">`:'<span class="rounded-lg shrink-0 border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-400 font-mono font-bold" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">无图</span>',i=(t.done_items||[]).filter(u=>u&&u.trim()),r=i.length?i[0]:"（未填完成事项）",c=[0,1,2].map(u=>{const m=t.done_items&&t.done_items[u]||"";return m&&m.trim()?`<li class="flex items-start space-x-1.5 text-xs text-neutral-700 leading-relaxed"><span class="text-neutral-400 font-mono text-[10px] mt-0.5">${u+1}.</span><span>${T(m)}</span></li>`:`<li class="flex items-start space-x-1.5 text-xs text-neutral-300 leading-relaxed"><span class="font-mono text-[10px] mt-0.5">${u+1}.</span><span>未记录</span></li>`}).join(""),d=T(t.record_date);return`
  <div class="evo-tl-item ev-rise" style="animation-delay:${Math.min(e,7)*40}ms">
    <span class="evo-tl-node"></span><span class="evo-tl-line"></span>
    <div class="evo-swipe" data-date="${d}">
      <div class="evo-swipe-action">
        <button type="button" class="evo-swipe-del" data-action="ev-delete" data-date="${d}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <span>删除</span>
        </button>
      </div>
      <div class="evo-swipe-panel">
        <div class="ht-card p-0 overflow-hidden">
          <div class="evo-entry-head p-2 px-3 flex items-center gap-2.5 cursor-pointer hover:bg-neutral-50/70 active:bg-neutral-100 transition-colors">
            ${o}
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1.5">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-xs font-bold font-mono text-neutral-900 tabular-nums">${T(a)}</span>
                  <span class="text-[10px] text-neutral-400 font-mono">${Fs(t.record_date)}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${s.chip}" data-score="${n}">${n} 分</span>
                  <span class="evo-entry-arrow text-neutral-400 transform transition-transform duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </div>
              <p class="text-xs text-neutral-500 truncate mt-0.5 font-sans">${T(r)}</p>
            </div>
          </div>
          <div class="evo-collapsible">
            <div class="px-3 pb-3 pt-2.5 border-t border-neutral-100 space-y-2.5">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">完成事项</p>
                  <button type="button" class="evo-copy-btn" data-action="ev-copy" data-date="${d}" aria-label="复制这天的记录">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <span>复制</span>
                  </button>
                </div>
                <ol class="space-y-1 evo-selectable">${c}</ol>
              </div>
              <div class="bg-neutral-50 border border-neutral-200/60 rounded-lg p-2.5">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">当时的感想</p>
                  <span class="font-mono text-[10px] text-neutral-500">自评：${n} / 10 分</span>
                </div>
                <p class="text-xs text-neutral-600 leading-relaxed evo-selectable">${t.note_text?T(t.note_text):"（未填写）"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`}function te(){const t=Ei(),e=t.slice(0,A.visible),n=l("ev-history-list"),s=l("ev-history-empty"),a=l("ev-load-more"),o=l("ev-load-done"),i=l("ev-filter-reset"),r=l("ev-filter-count");r&&(r.innerText=String(t.length));const c=l("ev-history-total");if(c&&(c.innerText=A.summaries.length+" 篇"),i&&i.classList.toggle("hidden",A.dateFilter==="all"&&A.scoreFilter==="all"),!n)return;if(!t.length){n.innerHTML="",s==null||s.classList.remove("hidden"),a==null||a.classList.add("hidden"),o==null||o.classList.add("hidden");return}s==null||s.classList.add("hidden");let d="",u="";e.forEach((v,x)=>{const y=Wn(v.record_date);if(y!==u){const E=t.filter(_=>Wn(_.record_date)===y).length;d+=`<div class="flex items-center space-x-2 pt-2 pb-2.5 pl-6 font-mono text-[10px]">
                 <span class="font-bold text-neutral-500 tracking-wider">${yi(y)}</span>
                 <span class="flex-1 h-px bg-neutral-200"></span>
                 <span class="text-neutral-400 tabular-nums">${E} 篇</span>
               </div>`,u=y}d+=$i(v,x)}),n.innerHTML=d,Mi();const m=t.length-e.length;if(m>0){a==null||a.classList.remove("hidden"),o==null||o.classList.add("hidden");const v=l("ev-remain-count");v&&(v.innerText=String(m))}else a==null||a.classList.add("hidden"),o==null||o.classList.remove("hidden")}function Mi(){document.querySelectorAll("#ev-history-list .evo-swipe-panel").forEach(t=>{t instanceof HTMLElement&&(t.addEventListener("pointerdown",Ci),t.addEventListener("pointermove",Ii),t.addEventListener("pointerup",Gn),t.addEventListener("pointercancel",Gn))})}function Ci(t){if(!(t instanceof PointerEvent))return;const e=t.currentTarget;if(!(e instanceof HTMLElement))return;const n=e.closest(".evo-swipe");if(!(n instanceof HTMLElement)||n.classList.contains("removing")||t.pointerType==="mouse"&&t.button!==0)return;const s=window.getSelection&&window.getSelection();s&&!s.isCollapsed&&s.anchorNode&&e.contains(s.anchorNode)||(qs(n),Mt.drag={panel:e,swipe:n,id:t.pointerId,x0:t.clientX,y0:t.clientY,axis:null,base:n.classList.contains("open")?-84:0,off:0})}function Ii(t){if(!(t instanceof PointerEvent))return;const e=Mt.drag;if(!e||t.pointerId!==e.id)return;const n=t.clientX-e.x0,s=t.clientY-e.y0;if(!e.axis){if(Math.abs(n)<6&&Math.abs(s)<6)return;if(e.axis=Math.abs(n)>Math.abs(s)?"x":"y",e.axis==="x"){e.panel.classList.add("dragging");try{e.panel.setPointerCapture(t.pointerId)}catch{}}}if(e.axis!=="x")return;let a=e.base+n;a>0?a*=.28:a<-84&&(a=-84-(Math.abs(a)-Mt.W)*.25),e.off=a,e.panel.style.transform="translateX("+a+"px)",t.cancelable&&t.preventDefault()}function Gn(t){if(!(t instanceof PointerEvent))return;const e=Mt.drag;if(!e||t.pointerId!==e.id)return;const n=e.panel,s=e.swipe;n.classList.remove("dragging"),n.style.transform="",e.axis==="x"&&(s.classList.toggle("open",e.off<-42),Mt.suppressClick=Date.now()),Mt.drag=null}function qs(t){document.querySelectorAll("#ev-history-list .evo-swipe.open").forEach(e=>{e!==t&&e.classList.remove("open")})}async function Hi(t){const e=A.summaries.find(o=>o.record_date===t),n=await st(`${ce(t)}${e?" · "+e.score+" 分":""}，删除后不可恢复。`,{title:"删除这篇小结？",confirmText:"删除"}),s=document.querySelector(`.evo-swipe[data-date="${t}"]`);if(!n){s&&s.classList.remove("open");return}try{await M.deleteEveningSummary(t)}catch(o){const i=o instanceof Error?o.message:String(o);z("删除失败："+i),s&&s.classList.remove("open");return}const a=()=>{A.summaries=A.summaries.filter(o=>o.record_date!==t),te(),ct.getCurrentDate()===t&&ct.onDeletedCurrentDate()};s?(s.classList.add("removing"),setTimeout(()=>{a(),z("已删除 "+ce(t)+" 的小结")},260)):(a(),z("已删除 "+ce(t)+" 的小结"))}const Nt=[{range:[1,2],label:"很低落",tone:"rose"},{range:[3,4],label:"有点钝",tone:"amber"},{range:[5,6],label:"平平",tone:"emerald"},{range:[7,8],label:"还不错，稳住了节奏",tone:"indigo"},{range:[9,10],label:"满分的一天",tone:"violet"}],Jn={rose:{dot:"#f43f5e",chip:"text-rose-700 bg-rose-50 border-rose-200",band:"bg-rose-50 text-rose-700 border border-rose-200"},amber:{dot:"#f59e0b",chip:"text-amber-700 bg-amber-50 border-amber-200",band:"bg-amber-50 text-amber-700 border border-amber-200"},emerald:{dot:"#10b981",chip:"text-emerald-700 bg-emerald-50 border-emerald-200",band:"bg-emerald-50 text-emerald-700 border border-emerald-200"},indigo:{dot:"#6366f1",chip:"text-indigo-700 bg-indigo-50 border-indigo-200",band:"bg-neutral-50 text-neutral-800 border border-neutral-200"},violet:{dot:"#8b5cf6",chip:"text-violet-700 bg-violet-50 border-violet-200",band:"bg-violet-50 text-violet-700 border border-violet-200"}},Qe=["rose","amber","emerald","indigo","violet"];let it=null;const k={date:"",photoId:null,pendingBlob:null,dirty:!1,insightBusy:!1,insightRange:7};let ge=0,St=null,Xt=!1,Yn=!1;function Bi(t){t.insertAdjacentHTML("beforeend",gi),hi({bandOf:Vs,toneOf:hn,todayStr:Dt,getCurrentDate:()=>k.date,onDeletedCurrentDate:()=>{k.dirty=!1,k.date=Dt();const e=g("summary-date");e&&(e.value=k.date),vn()},openPhoto:Ys}),ji()}function Di(){Ni()}function ji(){var e,n,s,a,o,i;if(Yn)return;const t=l("view-evening");t&&(Yn=!0,t.addEventListener("click",r=>{const c=B(r.target,"[data-action]");if(!c)return;switch(c.dataset.action){case"ev-today":Pi();break;case"ev-open-photo":{if(c.id!=="photo-preview")break;const u=jt("photo-preview"),m=u==null?void 0:u.getAttribute("src");u&&m&&Ys(u.src,"今日图片");break}case"ev-remove-photo":Ui();break;case"ev-toggle-bands":qi();break;case"ev-reset-bands":Gi();break;case"ev-save-bands":Ji();break;case"ev-cycle-tone":{const u=Number(c.dataset.idx);Number.isNaN(u)||Wi(u);break}case"ev-save":Yi();break;case"ev-insight-range":Xi(c);break;case"ev-insight-generate":tr();break;case"ev-insight-stop":ve();break;case"ev-insight-reset":er();break;case"ev-toggle-thinking":nr();break;case"ev-filter-date":wi(c);break;case"ev-filter-score":ki(c);break;case"ev-filter-reset":Ti();break;case"ev-load-more":Li();break}}),(e=g("summary-date"))==null||e.addEventListener("change",r=>{r.currentTarget instanceof HTMLInputElement&&Oi(r.currentTarget.value)}),(n=g("photo-input"))==null||n.addEventListener("change",zi),(s=Kt("note-text"))==null||s.addEventListener("input",r=>{const c=l("note-len");r.currentTarget instanceof HTMLTextAreaElement&&c&&(c.innerText=String(r.currentTarget.value.length)),k.dirty=!0}),["done-1","done-2","done-3"].forEach(r=>{var c;(c=g(r))==null||c.addEventListener("input",()=>{Gs(),k.dirty=!0})}),(a=g("score-range"))==null||a.addEventListener("input",r=>{r.currentTarget instanceof HTMLInputElement&&(ln(r.currentTarget.value),k.dirty=!0)}),(o=l("band-rows"))==null||o.addEventListener("input",r=>{const c=B(r.target,'[data-action="ev-band-label"]');if(c instanceof HTMLInputElement){const d=Number(c.dataset.idx);Number.isNaN(d)||Vi(d,c.value)}}),(i=l("ev-photo-viewer"))==null||i.addEventListener("click",()=>{Be()}),window.addEventListener("popstate",()=>{Xt&&(Xt=!1,Be(!0))}),document.addEventListener("keydown",r=>{r.key==="Escape"&&Be()}))}function Vs(t){const e=it||Nt;return e.find(n=>t>=n.range[0]&&t<=n.range[1])||e[e.length-1]}function hn(t){return Jn[t]||Jn.indigo}function Dt(){const t=new Date,e=n=>String(n).padStart(2,"0");return t.getFullYear()+"-"+e(t.getMonth()+1)+"-"+e(t.getDate())}function re(t){return t?t.slice(5):""}function Ai(t){return String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function Ni(){k.date||(k.date=Dt());const t=g("summary-date");t&&(t.value=k.date),await Promise.all([Ri(),vn()]),await Us()}async function Ri(){var t;if(it){he();return}try{const e=await M.getConfig(),n=e&&e.data&&e.data.summary_score_bands;Array.isArray(n)&&n.length&&(it=n.map(s=>({range:[s.range[0],s.range[1]],label:s.label,tone:s.tone})))}catch{}it||(it=Nt.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone}))),he(),ee(Number((t=g("score-range"))==null?void 0:t.value)||7)}async function vn(){const t=k.date,e=++ge,n=()=>e!==ge||t!==k.date;k.dirty=!1,Js();try{const s=await M.getEveningSummary(t);if(n())return;const a=s?s.data:null,o=g("done-1"),i=g("done-2"),r=g("done-3"),c=Kt("note-text"),d=l("note-len");a?(o&&(o.value=a.done_items&&a.done_items[0]||""),i&&(i.value=a.done_items&&a.done_items[1]||""),r&&(r.value=a.done_items&&a.done_items[2]||""),c&&(c.value=a.note_text||""),d&&(d.innerText=String((a.note_text||"").length)),ln(a.score||7),a.photo_id&&(k.photoId=a.photo_id,yn(`/api/v1/evening/photo/${a.photo_id}`,""))):(o&&(o.value=""),i&&(i.value=""),r&&(r.value=""),c&&(c.value=""),d&&(d.innerText="0"),ln(7)),Gs(),k.dirty=!1}catch(s){if(n())return;const a=s instanceof Error?s.message:String(s);z("读取该日小结失败："+a)}n()||Zi(t,e)}async function Ws(t){if(!t||t===k.date)return!1;if(k.dirty&&!await st(`当前日期的小结有未保存改动，切换到 ${t} 后未保存内容将会丢失，确定切换吗？`,{title:"未保存改动",confirmText:"仍然切换",danger:!1})){const s=g("summary-date");return s&&(s.value=k.date),!1}k.date=t;const e=g("summary-date");return e&&(e.value=t),await vn(),!0}async function Pi(){const t=Dt();if(k.date===t){z("已在今日");return}await Ws(t)&&z("已回到今日")}async function Oi(t){t&&await Ws(t)}function Gs(){let t=0;[1,2,3].forEach(n=>{const s=g("done-"+n),a=!!(s&&s.value.trim()),o=l("seq-"+n);o&&(a?(o.classList.contains("filled")||(o.classList.add("filled","ev-pop"),setTimeout(()=>o.classList.remove("ev-pop"),340)),t++):o.classList.remove("filled"))});const e=l("done-count");e&&(e.innerText=t+" / 3",e.className="font-mono text-[10px] font-bold tabular-nums transition-colors "+(t===0?"text-neutral-400":"text-neutral-900"))}function yn(t,e){var a,o;const n=jt("photo-preview");n&&(t?n.src=t:n.removeAttribute("src")),(a=l("photo-empty"))==null||a.classList.add("hidden"),(o=l("photo-filled"))==null||o.classList.remove("hidden");const s=l("photo-meta");s&&(s.innerText=e||"")}function Js(){var s,a;k.photoId=null,k.pendingBlob=null;const t=g("photo-input");t&&(t.value="");const e=jt("photo-preview");e&&e.removeAttribute("src"),(s=l("photo-filled"))==null||s.classList.add("hidden"),(a=l("photo-empty"))==null||a.classList.remove("hidden");const n=l("photo-meta");n&&(n.innerText="")}function Ys(t,e){if(!t)return;const n=l("ev-photo-viewer"),s=jt("ev-photo-viewer-img");!n||!s||(s.src=t,s.alt=e||"小结图片",n.classList.contains("hidden")&&(n.classList.remove("hidden"),Xt||(history.pushState({evPhoto:1},""),Xt=!0)))}function Be(t){const e=l("ev-photo-viewer"),n=jt("ev-photo-viewer-img");!e||e.classList.contains("hidden")||(e.classList.add("hidden"),n==null||n.removeAttribute("src"),Xt&&!t&&(Xt=!1,history.back()))}async function zi(t){var s;const e=t.target;if(!(e instanceof HTMLInputElement))return;const n=e.files&&e.files[0];if(n){if(!n.type.startsWith("image/")){z("请选择图片文件");return}try{const a=await Fi(n),o=k.pendingBlob&&((s=jt("photo-preview"))==null?void 0:s.src);o&&o.startsWith("blob:")&&URL.revokeObjectURL(o),k.pendingBlob=a,k.dirty=!0,yn(URL.createObjectURL(a),`原图 ${Math.round(n.size/1024)} KB · 压缩后约 ${Math.round(a.size/1024)} KB（长边 ≤1600px, JPEG q0.8）`),z("图片已就绪，保存小结时上传")}catch(a){const o=a instanceof Error?a.message:String(a);z("图片处理失败："+o)}}}function Fi(t){return new Promise((e,n)=>{const s=new FileReader;s.onerror=()=>n(new Error("读取文件失败")),s.onload=a=>{var r;const o=new Image;o.onerror=()=>n(new Error("图片解码失败")),o.onload=()=>{let d=o.width,u=o.height;(d>1600||u>1600)&&(d>=u?(u=Math.round(u*1600/d),d=1600):(d=Math.round(d*1600/u),u=1600));const m=document.createElement("canvas");m.width=d,m.height=u;const v=m.getContext("2d");if(!v){n(new Error("画布初始化失败"));return}v.fillStyle="#fff",v.fillRect(0,0,d,u),v.drawImage(o,0,0,d,u),m.toBlob(x=>x?e(x):n(new Error("压缩失败")),"image/jpeg",.8)};const i=(r=a.target)==null?void 0:r.result;typeof i=="string"?o.src=i:n(new Error("读取图片失败"))},s.readAsDataURL(t)})}async function Ui(){if(await st("删除今天这张图片？删除后不可恢复。",{title:"删除图片",confirmText:"删除"})){if(k.photoId)try{await M.deletePhoto(k.photoId)}catch(e){const n=e instanceof Error?e.message:String(e);z("删除图片失败："+n);return}Js(),z("已删除今日图片")}}function ln(t){const e=Number(t),n=l("score-value");n&&(n.innerText=String(e),n.classList.remove("ev-pop"),n.offsetWidth,n.classList.add("ev-pop"));const s=g("score-range");s&&s.value!==String(e)&&(s.value=String(e)),ee(e)}function ee(t){const e=Vs(t),n=l("score-text");n&&(n.innerText=e.label,n.className="mt-2 text-center text-xs font-mono font-medium rounded-lg py-2 transition-colors "+hn(e.tone).band)}function qi(){const t=l("band-editor");t&&(t.classList.toggle("open"),t.classList.contains("open")&&he())}function he(){const t=it||Nt,e=l("band-rows");e&&(e.innerHTML=t.map((n,s)=>`
    <div class="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5">
      <span class="text-[11px] font-bold font-mono text-neutral-500 tabular-nums w-9 shrink-0">${n.range[0]}-${n.range[1]}</span>
      <button type="button" data-action="ev-cycle-tone" data-idx="${s}" title="点击切换配色"
              class="w-3.5 h-3.5 rounded-full shrink-0 border border-neutral-200 shadow-sm active:scale-90 transition-transform"
              style="background:${hn(n.tone).dot}"></button>
      <input type="text" data-action="ev-band-label" data-idx="${s}" value="${Ai(n.label)}" maxlength="20"
             class="flex-1 min-w-0 bg-transparent text-xs text-neutral-800 outline-none font-sans">
    </div>`).join(""))}function Vi(t,e){var s;const n=it||Nt;n[t]&&(n[t].label=e,Je(),ee(Number((s=g("score-range"))==null?void 0:s.value)||7))}function Wi(t){var s;const e=it||Nt;if(!e[t])return;const n=Qe.indexOf(e[t].tone);e[t].tone=Qe[(n+1)%Qe.length],he(),Je(),ee(Number((s=g("score-range"))==null?void 0:s.value)||7)}function Gi(){var t;it=Nt.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone})),he(),Je(),ee(Number((t=g("score-range"))==null?void 0:t.value)||7),z("已恢复默认文案，点击「保存设置」生效")}async function Ji(){var n;const t=it||Nt,e=Y("band-save-btn");e&&(e.disabled=!0,e.classList.add("opacity-60"));try{await M.saveSummaryScoreBands(t.map(s=>({range:[s.range[0],s.range[1]],label:s.label,tone:s.tone}))),z("评分文案已保存并生效"),Je(),ee(Number((n=g("score-range"))==null?void 0:n.value)||7)}catch(s){const a=s instanceof Error?s.message:String(s);z("保存失败："+a)}finally{e&&(e.disabled=!1,e.classList.remove("opacity-60"))}}async function Yi(){var i,r,c;const t=Y("ev-save-btn"),e=k.date||Dt(),n=[1,2,3].map(d=>{var u;return((u=g("done-"+d))==null?void 0:u.value.trim())||""}).filter(Boolean),s=((i=Kt("note-text"))==null?void 0:i.value.trim())||"",a=Number((r=g("score-range"))==null?void 0:r.value)||7,o=!!k.pendingBlob||!!k.photoId;if(!n.length&&!s&&!o){z("至少填写三件事、图片或感想中的一项");return}t&&(t.disabled=!0,t.classList.add("opacity-60"));try{let d=k.photoId;if(k.pendingBlob){const u=await M.uploadEveningPhoto(e,k.pendingBlob);d=u.data&&u.data.photo_id?u.data.photo_id:null}if(await M.saveEveningSummary({record_date:e,done_items:n,note_text:s,score:a,photo_id:d||null}),k.photoId=d,k.pendingBlob&&d){const u=(c=jt("photo-preview"))==null?void 0:c.src;u&&u.startsWith("blob:")&&URL.revokeObjectURL(u),yn(`/api/v1/evening/photo/${d}`,"已保存 · 长边 ≤1600px, JPEG q0.8")}k.pendingBlob=null,k.dirty=!1,z("今日小结已保存"),await Us()}catch(d){const u=d instanceof Error?d.message:String(d);z("保存失败："+u)}finally{t&&(t.disabled=!1,t.classList.remove("opacity-60"))}}function le(t){return t===30?"近 30 天":"近 7 天"}function Xi(t){document.querySelectorAll("#ev-insight-range button").forEach(e=>e.classList.remove("active")),t.classList.add("active"),k.insightRange=Number(t.dataset.val)||7}function Ki(t){t!==7&&t!==30||(k.insightRange=t,document.querySelectorAll("#ev-insight-range button").forEach(e=>{e.classList.toggle("active",e instanceof HTMLElement&&Number(e.dataset.val)===t)}))}async function Zi(t,e=ge){var r,c;const n=()=>e!==ge||t!==k.date;ve();const s=l("insight-empty"),a=l("insight-panel");(r=l("think-body"))==null||r.classList.remove("open"),(c=l("think-arrow"))==null||c.classList.remove("rotate-90");const o=l("think-text");o&&(o.innerText="");const i=l("insight-body");i&&(i.innerHTML=""),a==null||a.classList.add("hidden"),s==null||s.classList.remove("hidden");try{const d=await M.getEveningInsight(t);if(n())return;const u=d?d.data:null;u&&u.content&&Qi(u)}catch{}}function Xs(t){if(!t)return"";const e=new Date(t);if(isNaN(e.getTime()))return"";const n=s=>String(s).padStart(2,"0");return n(e.getHours())+":"+n(e.getMinutes())}function Qi(t){var o,i;(o=l("insight-empty"))==null||o.classList.add("hidden"),(i=l("insight-panel"))==null||i.classList.remove("hidden"),Ki(Number(t.range_days));const e=t.range_days===7||t.range_days===30?le(t.range_days)+" · ":"",n=l("insight-meta");n&&(n.innerText=`${re(t.start_date||k.date)} · ${e}生成于 ${Xs(t.created_at)}`);const s=l("insight-body");s&&(s.innerHTML=we(t.content||""));const a=l("think-text");a&&(a.innerText=t.thinking||"")}function ve(){var t;if(St){try{St.abort()}catch{}St=null}(t=l("insight-body"))==null||t.classList.remove("typing-cursor")}async function tr(){var E,_;if(St){ve();return}if(k.insightBusy)return;const t=k.date||Dt(),e=Y("ev-insight-btn"),n=l("insight-empty"),s=l("insight-panel"),a=l("insight-body");ve(),ge++,k.insightBusy=!0;const o=e?e.className:"";e&&(e.className="mt-3 w-full h-10 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",e.innerHTML="<span>停止生成</span>"),n==null||n.classList.add("hidden"),s==null||s.classList.remove("hidden"),s==null||s.classList.add("ev-rise"),a&&(a.innerHTML='<p class="text-neutral-400 font-mono text-xs">（正在推导…）</p>',a.classList.add("typing-cursor"));const i=l("insight-meta");i&&(i.innerText=`${re(t)} · ${le(k.insightRange)} · 生成中…`);const r=l("think-text");r&&(r.innerText=""),(E=l("think-body"))==null||E.classList.remove("open"),(_=l("think-arrow"))==null||_.classList.remove("rotate-90");let c=!1,d="";const u=({thinking:b,content:L})=>{var N,P,X,J;a&&L&&L!==d&&(d=L,a.innerHTML=we(L)),b&&r&&(r.innerText=b,L?c||(c=!0,(X=l("think-body"))==null||X.classList.remove("open"),(J=l("think-arrow"))==null||J.classList.remove("rotate-90")):((N=l("think-body"))==null||N.classList.add("open"),(P=l("think-arrow"))==null||P.classList.add("rotate-90")))},m=new AbortController;St=m;const v=-new Date().getTimezoneOffset(),x=l("ev-insight-stop-btn"),y=l("ev-insight-reset-btn");x==null||x.classList.remove("hidden"),y==null||y.classList.add("hidden");try{const b=await mn({url:`/api/v1/evening/insight/stream?date=${encodeURIComponent(t)}&days=${k.insightRange}&tz_offset=${v}`,signal:m.signal,onUpdate:u,onDone:({thinking:L,content:N,hasError:P})=>{P?i&&(i.innerText=`${re(t)} · ${le(k.insightRange)} · 生成失败`):N||L?i&&(i.innerText=`${re(t)} · ${le(k.insightRange)} · 生成于 ${Xs(new Date)}`):a&&(a.innerHTML='<p class="text-neutral-400 text-xs">未能获取到分析内容，请检查大模型配置。</p>')},onError:(L,{thinking:N,content:P})=>{if(P||N)u({thinking:N,content:P+`

> **注意**: 网络连接中断`});else if(L instanceof TypeError)a&&(a.innerHTML='<p class="text-rose-500 text-xs font-mono">无法连接本地服务，请确认 HealthTrack 正在运行。</p>');else if(a){const X=L instanceof Error?L.message:String(L);a.innerHTML='<p class="text-rose-500 text-xs font-mono">生成失败：'+T(X)+"</p>"}}});b.aborted&&(b.content||b.thinking?(u({thinking:b.thinking,content:b.content+`

> **已手动停止生成**`}),i&&(i.innerText=`${re(t)} · ${le(k.insightRange)} · 已停止`)):(s==null||s.classList.add("hidden"),n==null||n.classList.remove("hidden")))}finally{St===m&&(St=null),a==null||a.classList.remove("typing-cursor"),k.insightBusy=!1,x==null||x.classList.add("hidden"),y==null||y.classList.remove("hidden"),e&&(e.className=o,e.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成小结深度洞察</span>')}}async function er(){var n,s,a,o;if(!await st("清除这一天的小结洞察？清除后可重新生成。",{title:"清除洞察",confirmText:"清除"}))return;const e=k.date||Dt();try{await M.deleteEveningInsight(e),ve(),(n=l("insight-panel"))==null||n.classList.add("hidden"),(s=l("insight-empty"))==null||s.classList.remove("hidden");const i=l("insight-body");i&&(i.innerHTML="");const r=l("think-text");r&&(r.innerText=""),(a=l("think-body"))==null||a.classList.remove("open"),(o=l("think-arrow"))==null||o.classList.remove("rotate-90"),z("已清除该日小结洞察")}catch(i){const r=i instanceof Error?i.message:String(i);z("清除失败："+r)}}function nr(){const t=l("think-body"),e=l("think-arrow");if(!t)return;const n=!t.classList.contains("open");t.classList.toggle("open",n),e&&e.classList.toggle("rotate-90",n)}function ye(t){tt.set({currentTab:t}),["log","dash","trend","trend-detail","insight","history","compare","evening"].forEach(a=>{const o=document.getElementById(`view-${a}`);o&&(a===t?o.classList.remove("hidden"):o.classList.add("hidden"))});const n=document.getElementById("save-bar");n&&n.classList.toggle("hidden",t!=="log");const s=document.getElementById("app-frame");s&&t!=="trend-detail"&&s.classList.remove("frame-wide"),t==="dash"?Oo():t==="trend"?ko():t==="trend-detail"?Bo():t==="insight"?pi():t==="compare"?Go():t==="evening"&&Di()}ga(ye);function gt(t){const e=document.getElementById(t);return!!(e&&!e.classList.contains("hidden"))}function sr(){var e;if(gt("ev-photo-viewer"))return Be(),!0;if(gt("app-confirm-modal"))return(e=document.getElementById("app-confirm-cancel"))==null||e.click(),!0;if(gt("settings-modal"))return De(),!0;if(gt("data-sheet"))return vt(),!0;if(gt("export-modal"))return tn(),!0;if(gt("import-modal"))return an(),!0;if(gt("memo-import-modal"))return Pe(),!0;if(gt("import-batches-modal"))return fe(),!0;const t=tt.state.currentTab||"log";return t==="compare"?(As(),!0):t==="history"?(ye("insight"),!0):t==="trend"||t==="trend-detail"?(ye("dash"),!0):!1}window.handleNativeBack=sr;document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("app-frame"),e=document.getElementById("main-content");Ks(),mo(t),xo(t,n=>ye(n)),Qs(document.body),po(document.body),uo(document.body),ya(e),Ro(e),di(e),Bi(e),ye("log")});
