(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();function pa(){let t=document.getElementById("toast");t||(t=document.createElement("div"),t.id="toast",t.className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 opacity-0 pointer-events-none -translate-y-4",t.innerHTML=`
      <div id="toast-body" class="bg-neutral-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-xs font-mono font-medium">
        <span id="toast-icon">✓</span>
        <span id="toast-msg">操作成功</span>
      </div>
    `,document.body.appendChild(t))}function $(t,e=!0){const n=document.getElementById("toast"),s=document.getElementById("toast-icon"),a=document.getElementById("toast-msg");!n||!s||!a||(s.innerText=e?"✓":"✕",a.innerText=t,n.classList.remove("opacity-0","-translate-y-4","pointer-events-none"),n.classList.add("opacity-100","translate-y-0"),setTimeout(()=>{n.classList.remove("opacity-100","translate-y-0"),n.classList.add("opacity-0","-translate-y-4","pointer-events-none")},2200))}const fa="";class he extends Error{constructor(e,n=0,s=0){super(e),this.name="ApiError",this.status=n,this.code=s}}async function j(t,e={}){const n=`${fa}${t}`,s=typeof FormData<"u"&&e.body instanceof FormData,a=typeof Blob<"u"&&e.body instanceof Blob,o={};e.headers&&typeof e.headers=="object"&&!Array.isArray(e.headers)&&Object.assign(o,e.headers);const i=Object.keys(o).some(u=>u.toLowerCase()==="content-type");!s&&!a&&!i&&e.body!==void 0&&(o["Content-Type"]="application/json");const r=await fetch(n,{...e,headers:o}),c=(r.headers.get("content-type")||"").includes("application/json");if(!r.ok){let u=`HTTP Error ${r.status}`,m=0;if(c)try{const g=await r.json();u=g.message||g.error||u,typeof g.code=="number"&&(m=g.code)}catch{}throw new he(u,r.status,m)}if(c){const u=await r.json();if(u&&typeof u=="object"&&typeof u.code=="number"&&u.code!==200)throw new he(u.message||"请求失败",r.status,u.code);return u}return await r.text()}const M={getHistoryRecords:(t,e)=>j(`/api/v1/records/history?start_date=${encodeURIComponent(t)}&end_date=${encodeURIComponent(e)}`),saveRecord:t=>j("/api/v1/records",{method:"POST",body:JSON.stringify(t)}),getConfig:()=>j("/api/config"),saveConfig:t=>j("/api/config",{method:"POST",body:JSON.stringify(t)}),testAIConfig:t=>j("/api/config/test",{method:"POST",body:JSON.stringify(t)}),saveSleepThresholds:t=>j("/api/config/sleep",{method:"POST",body:JSON.stringify(t)}),saveSummaryScoreBands:t=>j("/api/config/summary",{method:"POST",body:JSON.stringify({score_bands:t})}),checkInsightPeriod:(t,e,n=-new Date().getTimezoneOffset())=>j(`/api/v1/insights/period?range_days=${t}&end_date=${encodeURIComponent(e)}&tz_offset=${n}`),getInsightHistory:(t={})=>{const e=new URLSearchParams(t).toString();return j(`/api/v1/insights${e?"?"+e:""}`)},getInsightDetail:t=>j(`/api/v1/insights/${encodeURIComponent(String(t))}`),deleteInsight:t=>j(`/api/v1/insights/${encodeURIComponent(String(t))}`,{method:"DELETE"}),batchDeleteInsights:t=>j("/api/v1/insights/batch-delete",{method:"POST",body:JSON.stringify({ids:t})}),checkComparePeriod:(t,e,n=-new Date().getTimezoneOffset())=>j(`/api/v1/insights/compare/period?month_a=${encodeURIComponent(t)}&month_b=${encodeURIComponent(e)}&tz_offset=${n}`),getEveningSummary:t=>j(`/api/v1/evening/summary?date=${encodeURIComponent(t)}`),getEveningSummaries:()=>j("/api/v1/evening/summaries"),saveEveningSummary:t=>j("/api/v1/evening/summary",{method:"POST",body:JSON.stringify(t)}),deleteEveningSummary:t=>j(`/api/v1/evening/summary/${encodeURIComponent(t)}`,{method:"DELETE"}),uploadEveningPhoto:(t,e)=>j(`/api/v1/evening/photo?date=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":(e==null?void 0:e.type)||"image/jpeg"},body:e}),deletePhoto:t=>j(`/api/v1/evening/photo/${encodeURIComponent(String(t))}`,{method:"DELETE"}),getEveningInsight:t=>j(`/api/v1/evening/insight?date=${encodeURIComponent(t)}`),deleteEveningInsight:t=>j(`/api/v1/evening/insight?date=${encodeURIComponent(t)}`,{method:"DELETE"}),previewImportFile:t=>j("/api/v1/import/preview",{method:"POST",body:t}),previewImportMemo:(t,e)=>j("/api/v1/import/preview",{method:"POST",body:JSON.stringify({memo:t,year_base:e})}),confirmImport:t=>j("/api/v1/import/confirm",{method:"POST",body:JSON.stringify(t)}),getImportBatches:(t=20)=>j(`/api/v1/import/batches?limit=${encodeURIComponent(String(t))}`),getImportBatchDetail:t=>j(`/api/v1/import/batches/${encodeURIComponent(String(t))}`),retryImportBatch:t=>j(`/api/v1/import/batches/${encodeURIComponent(String(t))}/retry`,{method:"POST"}),fetchBlob:async t=>{const e=await fetch(t);if(!e.ok)throw new he(`HTTP ${e.status}`,e.status);return await e.blob()},probeContentLength:async t=>{try{const e=await fetch(t,{method:"HEAD"});if(!e.ok)return null;const n=Number(e.headers.get("Content-Length"));return Number.isFinite(n)&&n>0?n:null}catch{return null}}};function l(t){return document.getElementById(t)}function h(t){const e=document.getElementById(t);return e instanceof HTMLInputElement?e:null}function se(t){const e=document.getElementById(t);return e instanceof HTMLTextAreaElement?e:null}function us(t){const e=document.getElementById(t);return e instanceof HTMLSelectElement?e:null}function K(t){const e=document.getElementById(t);return e instanceof HTMLButtonElement?e:null}function Wt(t){const e=document.getElementById(t);return e instanceof HTMLCanvasElement?e:null}function Ot(t){const e=document.getElementById(t);return e instanceof HTMLImageElement?e:null}function D(t,e){if(!(t instanceof Element))return null;const n=t.closest(e);return n instanceof HTMLElement?n:null}function ma(t){var o,i,r;t.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("settings-modal"),s=document.getElementById("btn-close-settings"),a=document.getElementById("toggle-api-key");document.getElementById("setting-api-key"),n==null||n.addEventListener("click",d=>{d.target===n&&Ue()}),s==null||s.addEventListener("click",Ue),a==null||a.addEventListener("click",()=>{const d=h("setting-api-key");d&&(d.type==="password"?(d.type="text",a.innerText="隐藏"):(d.type="password",a.innerText="显示"))}),(o=document.getElementById("save-config-btn"))==null||o.addEventListener("click",ga),(i=document.getElementById("test-config-btn"))==null||i.addEventListener("click",ha),(r=document.getElementById("save-sleep-btn"))==null||r.addEventListener("click",va)}function xa(){const t=document.getElementById("settings-modal");t&&(t.classList.remove("hidden"),ba())}function Ue(){const t=document.getElementById("settings-modal");t==null||t.classList.add("hidden")}async function ba(){try{const t=await M.getConfig(),e=t&&t.data?t.data:t||{},n=h("setting-base-url"),s=h("setting-model"),a=l("api-key-status");n&&(n.value=e.base_url||""),s&&(s.value=e.model||""),a&&(a.innerText=e.api_key_configured?`当前 Key: ${e.api_key_masked}（留空可保留）`:"尚未配置 API Key");const o=h("setting-sleep-green"),i=h("setting-sleep-yellow");o&&(o.value=e.sleep_green_before||"23:30"),i&&(i.value=e.sleep_yellow_before||"01:00")}catch(t){const e=t instanceof Error?t.message:String(t);$("读取设置失败: "+e,!1)}}async function ga(){const t=h("setting-base-url"),e=h("setting-model"),n=h("setting-api-key"),s={base_url:(t==null?void 0:t.value.trim())||"",model:(e==null?void 0:e.value.trim())||""};n&&n.value.trim()&&(s.api_key=n.value.trim());try{await M.saveConfig(s),$("AI 配置已更新"),Ue()}catch(a){const o=a instanceof Error?a.message:String(a);$("保存失败: "+o,!1)}}async function ha(){const t=h("setting-base-url"),e=h("setting-model"),n=h("setting-api-key"),s=l("settings-feedback"),a={base_url:(t==null?void 0:t.value.trim())||"",model:(e==null?void 0:e.value.trim())||""};n&&n.value.trim()&&(a.api_key=n.value.trim()),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 text-neutral-600 block",s.innerText="正在测试连接中…");try{await M.testAIConfig(a),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-900 text-white block",s.innerText="✓ 测试连接成功！")}catch(o){const i=o instanceof Error?o.message:String(o);s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 block",s.innerText="✕ 测试连接失败: "+i)}}async function va(){const t=h("setting-sleep-green"),e=h("setting-sleep-yellow"),n=(t==null?void 0:t.value)||"23:30",s=(e==null?void 0:e.value)||"01:00";try{await M.saveSleepThresholds({green_before:n,yellow_before:s}),window.dispatchEvent(new CustomEvent("sleep-thresholds-updated",{detail:{green:n,yellow:s}})),$("熬夜阈值已保存并立即生效")}catch(a){const o=a instanceof Error?a.message:String(a);$("保存阈值失败: "+o,!1)}}const ya=`    <!-- 导出数据弹窗：Excel 表格与 JSON 完整备份两种方式 -->
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
`;function at(t,e){const n=e||{};return new Promise(s=>{const a=document.getElementById("app-confirm-modal"),o=document.getElementById("app-confirm-title"),i=document.getElementById("app-confirm-msg"),r=document.getElementById("app-confirm-ok"),d=document.getElementById("app-confirm-cancel");if(!a){s(!1);return}o.innerText=n.title||"请确认",i.innerText=t||"",r.innerText=n.confirmText||"确定",n.danger===!1?r.className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-sm hover:bg-neutral-800 transition-colors":r.className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-mono font-semibold text-sm hover:bg-rose-700 transition-colors";const c=()=>{a.classList.add("hidden"),r.onclick=null,d.onclick=null,a.onclick=null};r.onclick=()=>{c(),s(!0)},d.onclick=()=>{c(),s(!1)},a.onclick=u=>{u.target===a&&(c(),s(!1))},a.classList.remove("hidden")})}async function wa(t){if(window.HealthTrack&&typeof window.HealthTrack.copyText=="function")try{return window.HealthTrack.copyText(t),!0}catch{}try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(t),!0}catch{}try{const e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.position="fixed",e.style.top="-2000px",e.style.opacity="0",document.body.appendChild(e),e.select(),e.setSelectionRange(0,t.length);const n=document.execCommand("copy");return document.body.removeChild(e),n}catch{return!1}}let ln=null;function F(t){const e=document.getElementById("app-toast");e?(e.innerText=t||"",e.classList.remove("hidden"),ln&&clearTimeout(ln),ln=setTimeout(()=>e.classList.add("hidden"),2600)):$(t,!0)}function T(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function vt(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,'<code class="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono text-neutral-800">$1</code>')}function ka(t){return/^\s*\|[\s:|\-]+\|\s*$/.test(t)&&t.includes("-")}function jn(t){return t.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(n=>vt(n.trim()))}function Me(t){if(!t)return"";const n=T(t).replace(/\r\n?/g,`
`).split(`
`);let s="",a=null;const o=()=>{a&&(s+=`</${a}>`,a=null)};for(let i=0;i<n.length;i++){const r=n[i],d=r.trim();if(/^\|.*\|$/.test(d)&&i+1<n.length&&ka(n[i+1])){o();const S=jn(d);i+=1;const _=[];for(;i+1<n.length&&/^\|.*\|$/.test(n[i+1].trim());)i+=1,_.push(jn(n[i].trim()));const b=S.map(R=>`<th class="text-left font-semibold text-neutral-700 px-2 py-1.5 border-b border-neutral-200 bg-neutral-50 whitespace-nowrap">${R}</th>`).join(""),L=_.map(R=>`<tr>${S.map((X,J)=>`<td class="px-2 py-1.5 border-b border-neutral-100 text-neutral-700 align-top">${R[J]??""}</td>`).join("")}</tr>`).join("");s+=`<div class="overflow-x-auto my-2 rounded-lg border border-neutral-200"><table class="w-full text-[11px] font-mono border-collapse"><thead><tr>${b}</tr></thead><tbody>${L}</tbody></table></div>`;continue}if(/^---+$/.test(d)){o(),s+='<hr class="my-3 border-neutral-200">';continue}const c=r.match(/^###\s+(.*)$/);if(c){o(),s+=`<h3 class="font-bold text-neutral-800 text-sm mt-3 mb-1.5 pb-1 border-b border-neutral-100">${vt(c[1])}</h3>`;continue}const u=r.match(/^##\s+(.*)$/);if(u){o(),s+=`<h2 class="font-bold text-neutral-900 text-base mt-4 mb-2">${vt(u[1])}</h2>`;continue}const m=r.match(/^#\s+(.*)$/);if(m){o(),s+=`<h1 class="font-bold text-neutral-900 text-lg mt-4 mb-2">${vt(m[1])}</h1>`;continue}const g=r.match(/^&gt;\s?(.*)$/);if(g){o(),s+=`<blockquote class="border-l-2 border-neutral-300 pl-2.5 my-2 text-xs text-neutral-500 leading-relaxed">${vt(g[1])}</blockquote>`;continue}const x=r.match(/^[*-]\s+(.*)$/);if(x){a!=="ul"&&(o(),s+='<ul class="list-disc pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">',a="ul"),s+=`<li>${vt(x[1])}</li>`;continue}const y=r.match(/^\d+\.\s+(.*)$/);if(y){a!=="ol"&&(o(),s+='<ol class="list-decimal pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">',a="ol"),s+=`<li>${vt(y[1])}</li>`;continue}o(),d&&(s+=`<p class="my-1.5 text-xs text-neutral-700 leading-relaxed">${vt(r)}</p>`)}return o(),s}let Mt="all",xt="excel",ve=0,An=!1;function Ta(){if(An)return;const t=l("export-modal");t&&(An=!0,t.addEventListener("click",e=>{var a,o;if(e.target===t){un();return}const n=D(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;s==="export-close"?un():s==="export-type"?ps(n):s==="export-range"?fs(n):s==="export-run"?Ea():s==="open-downloads"&&((o=(a=window.HealthTrack)==null?void 0:a.openDownloads)==null||o.call(a))}))}function La(){var n;(n=l("export-modal"))==null||n.classList.remove("hidden");const t=document.querySelector('#export-type-pills button[data-type="excel"]'),e=document.querySelector('#export-range-pills button[data-range="all"]');t instanceof HTMLElement&&ps(t),e instanceof HTMLElement&&fs(e)}function un(){var t;(t=l("export-modal"))==null||t.classList.add("hidden")}function ps(t){var a,o,i,r,d,c;if(!t)return;xt=t.getAttribute("data-type")||"excel",document.querySelectorAll("#export-type-pills button").forEach(u=>{const m=u===t;u.className=m?"py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all":"py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"});const e=xt==="json",n=xt==="archive";(a=l("export-range-panel"))==null||a.classList.toggle("hidden",e),(o=l("export-json-panel"))==null||o.classList.toggle("hidden",!e),(i=l("export-archive-panel"))==null||i.classList.toggle("hidden",!n),(r=l("export-start-btn"))==null||r.classList.toggle("hidden",e||n),(d=l("export-json-btn"))==null||d.classList.toggle("hidden",!e),(c=l("export-archive-btn"))==null||c.classList.toggle("hidden",!n);const s=l("export-subtitle");s&&(s.textContent=e?"全量备份，包含健康记录与睡前小结":n?"小结表格 + 难忘图片，打包为 ZIP":"导出为 CSV，可用 Excel / WPS 打开"),ms()}function fs(t){Mt=t.getAttribute("data-range")||"all",document.querySelectorAll("#export-range-pills button").forEach(e=>{const n=e===t;e.className=n?"py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all":"py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"}),ms()}function ms(){const t=l("export-result");t&&(t.classList.add("hidden"),t.textContent="")}function Ea(){return xt==="json"?Ma():xt==="archive"?Ia():_a()}function Sa(t){const e=t==="7"?"7d":t==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_export_${e}_${s}.csv`}function Qe(t,e){const n=document.createElement("a"),s=URL.createObjectURL(t);n.href=s,n.download=e,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(s),2e3)}async function _a(){const t=-new Date().getTimezoneOffset(),e=new URLSearchParams({tz_offset:String(t)});Mt!=="all"&&e.set("range",Mt);const n=`/api/v1/export?${e.toString()}`;if(window.HealthTrack){ve=await M.probeContentLength(n),lt(!0),window.location.href=n;return}lt(!0);try{const s=await M.fetchBlob(n),a=Sa(Mt);Qe(s,a),Et(!0,{filename:a,size:s.size,location:"浏览器默认下载目录"}),$("导出成功",!0)}catch(s){const a=s instanceof Error?s.message:"网络错误";Et(!1,{message:"导出失败："+a}),$("导出失败",!1)}finally{lt(!1)}}function $a(){const t=new Date;return`HealthTrack_backup_v2_${""+t.getFullYear()+String(t.getMonth()+1).padStart(2,"0")+String(t.getDate()).padStart(2,"0")}.json`}async function Ma(){if(!await at("将导出全部健康记录与睡前小结为一个 JSON 文件（不含小结照片与 AI 洞察），不受时间范围限制。导出后可原样回灌到本应用。",{title:"导出完整备份？",confirmText:"开始导出",danger:!1}))return;const e="/api/v1/export/json";if(window.HealthTrack){ve=await M.probeContentLength(e),lt(!0),window.location.href=e;return}lt(!0);try{const n=await M.fetchBlob(e),s=$a();Qe(n,s),Et(!0,{filename:s,size:n.size,location:"浏览器默认下载目录"}),$("备份已导出",!0)}catch(n){const s=n instanceof Error?n.message:"网络错误";Et(!1,{message:"导出失败："+s}),$("导出失败",!1)}finally{lt(!1)}}function Ca(t){const e=t==="7"?"7d":t==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_summaries_${e}_${s}.zip`}async function Ia(){const t=-new Date().getTimezoneOffset(),e=new URLSearchParams({tz_offset:String(t)});Mt!=="all"&&e.set("range",Mt);const n=`/api/v1/export/summaries.zip?${e.toString()}`;if(window.HealthTrack){ve=await M.probeContentLength(n),lt(!0),window.location.href=n;return}lt(!0);try{const s=await M.fetchBlob(n),a=Ca(Mt);Qe(s,a),Et(!0,{filename:a,size:s.size,location:"浏览器默认下载目录"}),$("导出成功",!0)}catch(s){const a=s instanceof Error?s.message:"网络错误";Et(!1,{message:"导出失败："+a}),$("导出失败",!1)}finally{lt(!1)}}function lt(t){const n=K(xt==="json"?"export-json-btn":xt==="archive"?"export-archive-btn":"export-start-btn");n&&(n.disabled=t,n.classList.toggle("opacity-50",t),n.textContent=t?"导出中…":xt==="json"?"导出 JSON 备份":xt==="archive"?"导出图文归档":"开始导出")}function Et(t,e){const n=l("export-result");if(n)if(n.classList.remove("hidden"),t){const s=e.size!=null?`（${xs(e.size)}）`:"",a=window.HealthTrack?'<button type="button" data-action="open-downloads" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>':'<button type="button" data-action="export-run" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';n.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",n.innerHTML=`文件已保存：<span class="font-bold break-all">${T(e.filename)}</span>${s}<br>位置：${T(e.location)}<div>${a}</div>`}else n.className="text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600",n.textContent=e.message}function xs(t){return t<1024?t+" B":t<1024*1024?(t/1024).toFixed(1)+" KB":(t/1024/1024).toFixed(2)+" MB"}async function bs(t,e,n){if(window.HealthTrack){window.location.href=t,$("已开始下载",!0);return}try{const s=await M.fetchBlob(t);Qe(s,e),$(n||"文件已下载",!0)}catch(s){const a=s instanceof Error?s.message:"网络错误";$("下载失败："+a,!1)}}window.onExportResult=function(t){lt(!1);const e=t&&t.size!=null?t.size:ve;ve=null;const n=l("export-modal"),s=!!(n&&!n.classList.contains("hidden"));if(t&&t.ok)s&&Et(!0,{filename:t.filename,size:e,location:t.location||"下载目录 Download/"}),$(t.filename?"已保存："+t.filename:"导出成功",!0);else{const a=t&&t.message||"未知错误";s&&Et(!1,{message:"导出失败："+a}),$("导出失败："+a,!1)}};let gs=()=>{};function Da(t){gs=typeof t=="function"?t:()=>{}}function bt(t){gs(t)}function N(t){const e=t instanceof Date?t:new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function Ht(t,e){const[n,s,a]=t.split("-").map(Number),o=new Date(n,s-1,a);return o.setDate(o.getDate()+e),N(o)}function hs(t){return Ht(t,-1)}class Ha{constructor(){this._state={currentTab:"log",currentDate:N(new Date),isDirty:!1,hasSavedRecord:!1,dashRange:7,sleepThresholds:{green:"23:30",yellow:"01:00"}},this._listeners=new Set}get state(){return this._state}set(e){const n={...this._state};this._state={...this._state,...e},this._notify(this._state,n)}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(e,n){this._listeners.forEach(s=>{try{s(e,n)}catch(a){console.error("State subscriber error:",a)}})}}const et=new Ha,Ba=`<!-- 1. 记一笔 (Log View) 模块模板 -->
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
`;function vs(t){const e=document.getElementById(t);return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement?e:null}function Yt(t){var e;return((e=vs(t))==null?void 0:e.value)||""}let Z=N(new Date),Bt=!1,pe=!1,qe="",yn=!1,ot=null,V=null,jt=null,P={value:null,prefilled:null,autoDetected:!1},Jt=null,xe=!1,_t=null,zt={touched:!1},it={types:[],intensity:"light"},Ve={timing:"07:30",feeling:"refreshed"},Zt={green:"23:30",yellow:"01:00"};const Nn=["cardio","strength"],wt={protein:{chicken:"鸡胸",egg:"蛋",fish:"鱼",beef:"牛肉",soy:"豆制品",yogurt:"酸奶",other:"其他"},staple:{rice:"白米饭",noodle:"面条",grains:"杂粮",potato:"薯类",none:"无主食"},carb:{lt20:"<20g","20_35":"20–35g","35_50":"35–50g",gt50:">50g"},cook:{steam:"蒸煮",stir_fry:"炒",fry:"煎炸",raw:"生食",takeout:"外卖"}};async function ja(t){t.insertAdjacentHTML("beforeend",Ba),no(),so(),await Aa(),await Ce(Z)}async function Aa(){try{const t=await M.getConfig(),e=t.data||t;e.sleep_green_before&&(Zt.green=e.sleep_green_before),e.sleep_yellow_before&&(Zt.yellow=e.sleep_yellow_before),tn()}catch{}}window.addEventListener("sleep-thresholds-updated",t=>{t instanceof CustomEvent&&t.detail&&(t.detail.green&&(Zt.green=t.detail.green),t.detail.yellow&&(Zt.yellow=t.detail.yellow),tn())});async function Ce(t){Z=t,pe=!0;const e=h("input-date");e&&(e.value=t);let n=null;try{const s=Ht(t,-6),a=await M.getHistoryRecords(s,t),o=a&&Array.isArray(a.data)?a.data:Array.isArray(a)?a:[];V=o.find(i=>i.record_date===hs(t))||null,n=o.find(i=>i.record_date===t)||null,Rn(n),Ua(o,t),Lt(),Ja(),yn=!!n,qe=n?Na(n):""}catch(s){console.error("加载单日记录失败:",s)}finally{Bt=!1,pe=!1,kn(),Kt(),We();const s=to(t);s&&(pe=!0,Rn(s),Lt(),pe=!1,Bt=!0,Kt(),We(),$("已恢复上次未保存的草稿"));const a=t===N(new Date);if(a&&P.value===null&&wn()&&typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission()){const o=window.HealthTrack.getTodaySteps();o>0&&(P.value=Math.max(0,Math.min(3e4,Math.round(o))),P.autoDetected=!0,Lt(),Kt())}Qt(a)}}function Na(t){if(!t||!t.updated_at)return"";const e=new Date(t.updated_at);return isNaN(e.getTime())||e.getFullYear()<2e3?"":e.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1})}function Rn(t){t=t||{};const e=(y,S)=>{const _=vs(y);_&&(_.value=S==null?"":String(S))};if(e("input-weight-am",t.weight_am),e("input-weight-pm",t.weight_pm),e("input-waist",t.waist_size),e("input-journal",t.journal_text||t.journal||""),mn(),fn(),e("sleepBedTime",t.sleep_start_time||t.sleep_bed_time||"00:30"),e("sleepWakeTime",t.sleep_end_time||t.sleep_wake_time||"07:15"),tn(),t.sleep_hours!==null&&t.sleep_hours!==void 0){const y=h("sleepDuration");y&&(y.value=String(t.sleep_hours))}const n=t.exercise||{},s=Array.isArray(n.types)?n.types.slice():n.type&&n.type!=="none"?[n.type]:[];Ss(s),s.length>0?($s(n.intensity||"light"),e("exerciseDuration",n.duration||40),e("exerciseItems",n.items||"")):(e("exerciseDuration",40),e("exerciseItems",""));const a=t.concerta,o=!!(a&&a.taken),i=h("concertaEnabled");if(i&&(i.checked=o),Ms(o),o){e("concertaTime",a.time||"08:00"),e("concertaDose",String(a.dose||36)),e("focusWork",a.focus_work||4);const y=l("focusWorkText");y&&(y.innerText=(a.focus_work||4)+"分")}const r=a&&a.side_effects||[];document.querySelectorAll("#concertaSideEffects .chip").forEach(y=>{y.classList.toggle("active",r.includes(y.getAttribute("data-key")))});const d=a&&a.compensations||[];document.querySelectorAll("#concertaCompensations .chip").forEach(y=>{y.classList.toggle("active",d.includes(y.getAttribute("data-key")))});const c=t.cold_shower,u=!!(c&&c.enabled),m=h("coldShowerEnabled");m&&(m.checked=u),Cs(u);let g=c&&c.timing||"07:30";g==="morning"?g="07:30":g==="post_workout"?g="18:30":g==="evening"&&(g="22:30"),xn(g),Hs(c&&c.feeling||"refreshed");let x=(c&&c.duration)!==void 0&&c.duration!==null?Number(c.duration):60;x>0&&x<=10&&(x=x*60),Ds(x),e("coldShowerWaterTemp",c&&c.water_temp!==null&&c.water_temp!==void 0?c.water_temp:""),jt=t.morning_light===!0?"yes":t.morning_light===!1?"no":null,ws(),P.value=t.steps===null||t.steps===void 0?null:Number(t.steps),P.autoDetected=!1,Lt(),Es(t.lunch||null)}function ys(){var d,c,u;const t=Z||((d=h("input-date"))==null?void 0:d.value)||N(new Date),e=Yt,n=m=>m===""||m===null||m===void 0||isNaN(parseFloat(m))?null:parseFloat(m),s=[];document.querySelectorAll("#concertaSideEffects .chip.active").forEach(m=>{const g=m.getAttribute("data-key");g&&s.push(g)});const a=[];document.querySelectorAll("#concertaCompensations .chip.active").forEach(m=>{const g=m.getAttribute("data-key");g&&a.push(g)});const i=!!((c=h("concertaEnabled"))!=null&&c.checked)?{taken:!0,time:e("concertaTime")||"08:00",dose:parseInt(e("concertaDose"),10)||36,focus_work:parseInt(e("focusWork"),10)||4,focus_study:4,daily_tasks:4,social:4,gaming:4,crash_time:"18:00",side_effects:s,compensations:a}:{taken:!1},r=e("coldShowerWaterTemp");return{record_date:t,weight_am:n(e("input-weight-am")),weight_pm:n(e("input-weight-pm")),waist_size:n(e("input-waist")),sleep_hours:n(e("sleepDuration")),sleep_start_time:e("sleepBedTime")||null,sleep_end_time:e("sleepWakeTime")||null,journal_text:e("input-journal")||"",exercise:{types:it.types.slice(),type:it.types[0]||"none",duration:parseInt(e("exerciseDuration"),10)||0,intensity:it.intensity,items:e("exerciseItems")||""},cold_shower:{enabled:!!((u=h("coldShowerEnabled"))!=null&&u.checked),timing:e("coldShowerTime")||Ve.timing||"07:30",duration:parseInt(e("coldShowerDuration"),10)||60,water_temp:r===""?null:parseFloat(r),feeling:Ve.feeling},concerta:i,morning_light:jt==="yes"?!0:jt==="no"?!1:null,steps:P.value,lunch:Ya()}}async function Ra(){const t=ys(),e=t.record_date,n=K("btn-save-log");n&&(n.disabled=!0);try{const s=await M.saveRecord(t);s&&(s.code===200||s.status===200||!s.code)?(Bt=!1,yn=!0,qe=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1}),ot&&(clearTimeout(ot),ot=null),eo(e),We(),$("✓ 保存成功"),Ce(e)):$(s&&s.message||"保存失败",!1)}catch(s){const a=s instanceof Error?s.message:String(s);$("保存失败: "+a,!1)}finally{n&&(n.disabled=!1)}}function Pa(t){jt=jt===t?null:t,ws(),Y()}function ws(){document.querySelectorAll("#morningLightPills button").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-val")===jt)})}function wn(){return!!(window.HealthTrack&&typeof window.HealthTrack.isStepSensorAvailable=="function"&&window.HealthTrack.isStepSensorAvailable())}function Qt(t){const e=document.getElementById("steps-source-badge"),n=document.getElementById("btn-sync-steps");if(!t||!wn()){e&&e.classList.add("hidden"),n&&n.classList.add("hidden");return}const s=typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission();n&&(n.classList.remove("hidden"),n.innerText=s?"同步":"授权",n.title=s?"同步手机硬件计步器步数":"申请手机计步权限"),e&&(s&&P.autoDetected?e.classList.remove("hidden"):e.classList.add("hidden"))}function pn(t,e){if(typeof t!="number"||t<0){e&&$("未读取到有效步数");return}const n=Math.max(0,Math.min(3e4,Math.round(t)));P.value=n,P.autoDetected=!0,Lt(),Qt(!0),Kt(),Y(),e&&$(`已同步手机计步 ${n.toLocaleString("en-US")} 步`)}function Pn(t=!1){if(!wn()){t&&$("当前环境未检测到计步传感器");return}if(!(Z===N(new Date))){t&&$("仅支持同步当天的实时步数");return}if(!(typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission())){typeof window.HealthTrack.requestStepPermission=="function"&&(window.HealthTrack.requestStepPermission(),t&&$("正在请求手机计步权限…"));return}if(t&&typeof window.HealthTrack.refreshSteps=="function"){xe=!0,_t&&clearTimeout(_t),_t=setTimeout(()=>{if(!xe)return;xe=!1,_t=null;const a=typeof window.HealthTrack.getTodaySteps=="function"?window.HealthTrack.getTodaySteps():-1;pn(a,!0)},1500),window.HealthTrack.refreshSteps();return}const s=window.HealthTrack.getTodaySteps();pn(s,t)}function Oa(t){const e=Number(t);P.value=isNaN(e)?null:Math.max(0,Math.min(2e4,Math.round(e/500)*500)),P.autoDetected=!1,Lt(),Qt(Z===N(new Date)),Y()}function za(){P.value=null,P.autoDetected=!1,Lt(),Qt(Z===N(new Date)),Y()}function Lt(){const t=h("input-steps");if(!t)return;P.prefilled=P.value===null?Jt:null;const e=P.value===null?Jt===null?0:Jt:P.value;t.value=String(Math.max(0,Math.min(2e4,Math.round(e/500)*500))),Fa()}function Fa(){const t=P.value,e=document.getElementById("steps-value");e&&(e.innerText=t===null?"--":t.toLocaleString("en-US"));const n=document.getElementById("steps-hint");n&&(t===null&&P.prefilled!==null?n.innerText=`拖动滑块记录 · 已预置昨天 ${P.prefilled.toLocaleString("en-US")} 步`:n.innerText="留空表示当天未记录 · 图表断点")}function Ua(t,e){const n=t.find(i=>i.record_date===hs(e));Jt=n&&n.steps!==null&&n.steps!==void 0?Number(n.steps):null;const s=t.filter(i=>i.record_date!==e&&i.steps!==null&&i.steps!==void 0).map(i=>Number(i.steps)),a=s.length?Math.round(s.reduce((i,r)=>i+r,0)/s.length):null,o=document.getElementById("steps-meta");if(o){const i=Jt===null?"--":Jt.toLocaleString("en-US"),r=a===null?"--":a.toLocaleString("en-US");o.innerHTML=`昨 <span class="font-medium text-neutral-700">${i}</span> · 7日均 <span class="font-medium text-neutral-700">${r}</span> 步`}}function qa(){const t=document.getElementById("lunch-body"),e=document.getElementById("lunch-icon");if(!t)return;const n=t.classList.toggle("hidden");e&&(e.style.transform=n?"rotate(0deg)":"rotate(180deg)")}function On(t){t.parentElement.querySelectorAll(".pill-sm-btn").forEach(e=>e.classList.remove("active")),t.classList.add("active"),zt.touched=!0,ks()}function Va(t){t.classList.toggle("active"),zt.touched=!0,ks()}function ks(){Ts(),Ls(),Y()}function Ts(){const t=st("lunch-eaten")==="skipped";["lunch-protein-row","lunch-protein-g-row","lunch-staple-row","lunch-carb-row","lunch-cook-row"].forEach(e=>{const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)})}function st(t){const e=document.querySelector(`#${t} .pill-sm-btn.active`);return e?e.getAttribute("data-val"):""}function Ls(){const t=document.getElementById("lunch-summary");if(!t)return;if(!zt.touched){t.innerText="今天还没记午餐";return}if(st("lunch-eaten")==="skipped"){t.innerText="今天跳过午餐";return}const e=Array.from(document.querySelectorAll("#lunch-protein .chip.active")).map(a=>wt.protein[a.getAttribute("data-val")]||""),n=st("lunch-protein-g"),s=[e.length?e.join("、"):"未选蛋白",n?`约${n}g`:"",wt.staple[st("lunch-staple")]||"",wt.carb[st("lunch-carb")]||"",wt.cook[st("lunch-cook")]||""].filter(Boolean);t.innerText=s.join(" · ")||"已记午餐（明细空白）"}function Wa(t){return t?t.eaten==="skipped"?"跳过":[(t.protein||[]).map(n=>wt.protein[n]||n).join("、"),t.protein_g?`约${t.protein_g}g`:"",wt.staple[t.staple]||"",wt.carb[t.carb_g]||"",wt.cook[t.cooking]||""].filter(Boolean).join(" · "):""}function Ya(){if(!zt.touched)return null;const t=Array.from(document.querySelectorAll("#lunch-protein .chip.active")).map(e=>e.getAttribute("data-val"));return{eaten:st("lunch-eaten")||"eaten",protein:t,protein_g:parseInt(st("lunch-protein-g"),10)||0,staple:st("lunch-staple"),carb_g:st("lunch-carb"),cooking:st("lunch-cook")}}function Es(t){if(document.querySelectorAll("#lunch-eaten .pill-sm-btn, #lunch-protein-g .pill-sm-btn, #lunch-staple .pill-sm-btn, #lunch-carb .pill-sm-btn, #lunch-cook .pill-sm-btn").forEach(e=>e.classList.remove("active")),document.querySelectorAll("#lunch-protein .chip").forEach(e=>e.classList.remove("active")),zt.touched=!!t,t){const e=(n,s)=>{const a=document.querySelector(`#${n} [data-val="${s}"]`);a&&a.classList.add("active")};e("lunch-eaten",t.eaten||"eaten"),(t.protein||[]).forEach(n=>e("lunch-protein",n)),t.protein_g&&e("lunch-protein-g",String(t.protein_g)),t.staple&&e("lunch-staple",t.staple),t.carb_g&&e("lunch-carb",t.carb_g),t.cooking&&e("lunch-cook",t.cooking)}Ts(),Ls()}function Ga(){const t=V&&V.lunch;if(!t){$("昨天没有午餐记录，先手动记一次",!1);return}Es(t),zt.touched=!0,Y(),$("已沿用昨天的午餐")}function Ja(){const t=document.getElementById("lunch-yesterday");if(!t)return;const e=V&&V.lunch;t.innerText="昨天："+(e?Wa(e):"--")}function fn(){const t=se("input-journal"),e=l("btn-clear-journal");!t||!e||(t.value&&t.value.trim().length>0?e.classList.remove("hidden"):e.classList.add("hidden"))}function mn(){const t=document.getElementById("input-journal");if(!t)return;t.style.height="auto";const e=Math.min(Math.max(t.scrollHeight,68),240);t.style.height=`${e}px`}function dn(t){if(!t)return NaN;const e=t.trim().split(":");if(e.length!==2)return NaN;const n=parseInt(e[0],10),s=parseInt(e[1],10);if(isNaN(n)||isNaN(s))return NaN;let a=n*60+s;return n>=0&&n<=6&&(a+=24*60),a}function Ka(t,e,n){const s=dn(t);if(isNaN(s))return"GREEN";let a=dn(e),o=dn(n);return isNaN(a)&&(a=23*60+30),isNaN(o)&&(o=25*60),s<a?"GREEN":s<o?"YELLOW":"RED"}function tn(){var m,g;const t=(m=h("sleepBedTime"))==null?void 0:m.value,e=(g=h("sleepWakeTime"))==null?void 0:g.value;if(!t||!e)return;const[n,s]=t.split(":").map(Number),[a,o]=e.split(":").map(Number);let i=n*60+s,r=a*60+o;r<=i&&(r+=1440);const d=((r-i)/60).toFixed(1),c=h("sleepDuration");c&&(c.value=d);const u=document.getElementById("sleepTagBadge");if(u){const x=Ka(t,Zt.green,Zt.yellow);u.classList.remove("badge-green","badge-yellow","badge-red"),x==="YELLOW"?(u.classList.add("badge-yellow"),u.innerText="● 轻度熬夜"):x==="RED"?(u.classList.add("badge-red"),u.innerText="● 重度熬夜"):(u.classList.add("badge-green"),u.innerText="● 未熬夜")}kn()}function Xa(){const t=document.getElementById("biohackBody"),e=document.getElementById("accordionIcon");if(!t)return;const n=t.classList.toggle("hidden");e&&(e.style.transform=n?"rotate(0deg)":"rotate(180deg)")}function Ss(t){it.types=(t||[]).filter(e=>e&&e!=="none"),_s()}function Za(t){if(t==="none"){Ss([]);return}const e=it.types.indexOf(t);e>=0?it.types.splice(e,1):(it.types.push(t),it.types.sort((n,s)=>Nn.indexOf(n)-Nn.indexOf(s))),_s()}function _s(){const t=it.types;document.querySelectorAll("#exerciseTypePills .pill-btn").forEach(n=>{const s=n.getAttribute("data-val");n.classList.toggle("active",s==="none"?t.length===0:t.includes(s))});const e=document.getElementById("exerciseSubForm");e&&e.classList.toggle("hidden",t.length===0)}function $s(t){it.intensity=t,document.querySelectorAll("#exerciseIntensityPills .pill-sm-btn").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===t)})}function Ms(t){const e=document.getElementById("concertaSubForm");e&&e.classList.toggle("hidden",!t)}function Cs(t){const e=document.getElementById("coldShowerSubForm");e&&e.classList.toggle("hidden",!t)}function xn(t){Ve.timing=t;const e=h("coldShowerTime");e&&e.value!==t&&(e.value=t),document.querySelectorAll("#csQuickTimingPills .pill-sm-btn").forEach(n=>{n.classList.toggle("active",n.getAttribute("data-time")===t)})}function Is(t){document.querySelectorAll("#csQuickDurationPills .pill-sm-btn").forEach(e=>{e.classList.toggle("active",Number(e.getAttribute("data-sec"))===Number(t))})}function Ds(t){const e=h("coldShowerDuration");e&&(e.value=String(t)),Is(t)}function Hs(t){Ve.feeling=t,document.querySelectorAll("#csFeelingPills .pill-sm-btn").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===t)})}function kn(){const t=parseFloat(Yt("input-weight-am")),e=document.getElementById("diff-weight-am");if(e)if(!isNaN(t)&&V&&V.weight_am!==null&&V.weight_am!==void 0){const d=Math.round((t-V.weight_am)*10)/10;d<0?e.innerHTML=`<span class="text-emerald-600 font-bold">↓ 较昨日 ${d.toFixed(1)}</span><span class="text-slate-300">晨测</span>`:d>0?e.innerHTML=`<span class="text-rose-500 font-bold">↑ 较昨日 +${d.toFixed(1)}</span><span class="text-slate-300">晨测</span>`:e.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晨测</span>'}else e.innerHTML='<span>较昨日 --</span><span class="text-slate-300">晨测</span>';const n=parseFloat(Yt("input-weight-pm")),s=document.getElementById("diff-weight-pm");if(s)if(isNaN(n))s.innerHTML='<span>等待今晚称重</span><span class="text-slate-300">--:--</span>';else if(V&&V.weight_pm!==null&&V.weight_pm!==void 0){const d=Math.round((n-V.weight_pm)*10)/10;d<0?s.innerHTML=`<span class="text-emerald-600 font-bold">↓ 较昨日 ${d.toFixed(1)}</span><span class="text-slate-300">晚测</span>`:d>0?s.innerHTML=`<span class="text-rose-500 font-bold">↑ 较昨日 +${d.toFixed(1)}</span><span class="text-slate-300">晚测</span>`:s.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晚测</span>'}else s.innerHTML='<span>今晚已记录</span><span class="text-slate-300">晚测</span>';const a=parseFloat(Yt("input-waist")),o=document.getElementById("diff-waist");if(o)if(!isNaN(a)&&V&&V.waist_size!==null&&V.waist_size!==void 0){const d=Math.round((a-V.waist_size)*10)/10;d<0?o.innerHTML=`<span class="text-indigo-600 font-bold">较昨日 ${d.toFixed(1)}</span><span class="text-slate-300">紧实</span>`:d>0?o.innerHTML=`<span class="text-amber-600 font-bold">较昨日 +${d.toFixed(1)}</span><span class="text-slate-300">略增</span>`:o.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">稳定</span>'}else o.innerHTML='<span>平稳区间</span><span class="text-slate-300">标准</span>';const i=parseFloat(Yt("sleepDuration")),r=document.getElementById("diff-sleep");if(r)if(!isNaN(i)&&V&&V.sleep_hours!==null&&V.sleep_hours!==void 0){const d=Math.round((i-V.sleep_hours)*10)/10;d<0?r.innerHTML=`<span class="text-amber-600 font-bold">较前日 ${d.toFixed(1)}h</span><span class="text-slate-300">偏短</span>`:d>0?r.innerHTML=`<span class="text-emerald-600 font-bold">较前日 +${d.toFixed(1)}h</span><span class="text-slate-300">充足</span>`:r.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较前日 持平</span><span class="text-neutral-300 font-mono">规律</span>'}else r.innerHTML='<span>较昨日 --</span><span class="text-slate-300">节律</span>'}function Kt(){const t=s=>Yt(s).trim()!=="";let e=0;(t("input-weight-am")||t("input-weight-pm"))&&e++,t("input-waist")&&e++,t("sleepDuration")&&e++,jt!==null&&e++,P.value!==null&&e++,zt.touched&&e++;const n=document.getElementById("log-count");n&&(n.innerText=`${e}/6`,n.className=e>=6?"text-emerald-600":"text-slate-600")}function Y(){if(pe)return;Bt=!0,Kt(),We(),ot&&clearTimeout(ot);const t=Z;ot=setTimeout(()=>{ot=null,Bs(t)},400)}function Qa(){ot&&(clearTimeout(ot),ot=null),Bt&&Bs(Z)}function We(){const t=document.getElementById("save-text"),e=document.getElementById("save-dot");!t||!e||(Bt?(e.className="w-2 h-2 rounded-full bg-amber-400 animate-pulse",t.innerText="未保存"):yn?(e.className="w-2 h-2 rounded-full bg-emerald-500",t.innerText=`已同步落库${qe?" ("+qe+")":""}`):(e.className="w-2 h-2 rounded-full bg-neutral-300",t.innerText="未修改"))}function Tn(t){return`ht_log_draft_${t}`}function Bs(t){if(t=t||Z,!!t)try{localStorage.setItem(Tn(t),JSON.stringify(ys()))}catch{}}function to(t){try{const e=localStorage.getItem(Tn(t));if(!e)return null;const n=JSON.parse(e);return n&&n.record_date===t?n:null}catch{return null}}function eo(t){try{localStorage.removeItem(Tn(t))}catch{}}function no(t=14){try{const e=Ht(N(new Date),-t),n=[];for(let s=0;s<localStorage.length;s++){const a=localStorage.key(s);if(!a)continue;const o=/^ht_log_draft_(\d{4}-\d{2}-\d{2})$/.exec(a);o&&o[1]<e&&n.push(a)}n.forEach(s=>localStorage.removeItem(s))}catch{}}async function zn(t){if(t&&t!==Z){if(Bt){if(!await at(`当前日期还有未保存的改动（草稿已自动保存），确定切换到 ${t}？`,{title:"未保存改动",confirmText:"仍然切换",danger:!1})){const n=h("input-date");n&&(n.value=Z);return}Qa()}await Ce(t)}}function so(){var a,o,i,r,d,c,u,m,g,x,y,S,_,b,L,R,O,X,J,Ut,St,qt,le;const t=h("input-date");t&&t.addEventListener("change",v=>{v.currentTarget instanceof HTMLInputElement&&zn(v.currentTarget.value)}),(a=l("btn-today-date"))==null||a.addEventListener("click",()=>{const v=N(new Date);zn(v)}),(o=l("morningLightPills"))==null||o.addEventListener("click",v=>{const E=D(v.target,"button[data-val]");E&&Pa(E.getAttribute("data-val"))}),(i=h("input-steps"))==null||i.addEventListener("input",v=>{v.currentTarget instanceof HTMLInputElement&&Oa(v.currentTarget.value)}),(r=l("btn-clear-steps"))==null||r.addEventListener("click",za),(d=l("btn-sync-steps"))==null||d.addEventListener("click",()=>Pn(!0)),window.onStepPermissionResult=v=>{v?($("已授权手机计步"),Pn(!1)):$("未获得计步权限"),Qt(Z===N(new Date))},window.onNativeStepsUpdated=v=>{const E=Z===N(new Date);if(xe){if(xe=!1,_t&&(clearTimeout(_t),_t=null),!E)return;pn(v,!0);return}if(!E||typeof v!="number"||v<=0||P.value!==null&&!P.autoDetected)return;const nt=Math.max(0,Math.min(3e4,Math.round(v)));P.value!==nt&&(P.value=nt,P.autoDetected=!0,Lt(),Qt(!0),Kt())},["input-weight-am","input-weight-pm","input-waist","sleepBedTime","sleepWakeTime","sleepDuration","input-journal","exerciseDuration","exerciseItems","concertaTime","concertaDose","focusWork","coldShowerTime","coldShowerDuration","coldShowerWaterTemp"].forEach(v=>{const E=document.getElementById(v);E&&E.addEventListener("input",()=>{v==="sleepBedTime"||v==="sleepWakeTime"?tn():kn(),Y()})});const n=document.getElementById("input-journal"),s=document.getElementById("main-content");n&&(n.addEventListener("focus",()=>{s&&(s.style.paddingBottom="96px"),setTimeout(()=>{n.scrollIntoView({behavior:"smooth",block:"center"})},120)}),n.addEventListener("blur",()=>{s&&(s.style.paddingBottom="")}),n.addEventListener("input",()=>{mn(),fn()})),(c=document.getElementById("btn-clear-journal"))==null||c.addEventListener("click",async()=>{const v=se("input-journal");if(!v||!v.value)return;await at("确定清空自由记录吗？",{title:"清空自由记录",confirmText:"清空",danger:!0})&&(v.value="",mn(),fn(),Y())}),(u=l("lunch-toggle"))==null||u.addEventListener("click",v=>{D(v.target,"#btn-lunch-template")||qa()}),(m=l("btn-lunch-template"))==null||m.addEventListener("click",v=>{v.stopPropagation(),Ga()}),(g=l("lunch-eaten"))==null||g.addEventListener("click",v=>{const E=D(v.target,".pill-sm-btn");E&&On(E)}),(x=l("lunch-protein"))==null||x.addEventListener("click",v=>{const E=D(v.target,".chip");E&&Va(E)}),["lunch-protein-g","lunch-staple","lunch-carb","lunch-cook"].forEach(v=>{var E;(E=l(v))==null||E.addEventListener("click",nt=>{const pt=D(nt.target,".pill-sm-btn");pt&&On(pt)})}),(y=l("biohack-toggle"))==null||y.addEventListener("click",Xa),(S=l("exerciseTypePills"))==null||S.addEventListener("click",v=>{const E=D(v.target,".pill-btn");E&&(Za(E.getAttribute("data-val")),Y())}),(_=l("exerciseIntensityPills"))==null||_.addEventListener("click",v=>{const E=D(v.target,".pill-sm-btn");E&&($s(E.getAttribute("data-val")),Y())}),(b=h("concertaEnabled"))==null||b.addEventListener("change",v=>{v.currentTarget instanceof HTMLInputElement&&(Ms(v.currentTarget.checked),Y())}),(L=h("focusWork"))==null||L.addEventListener("input",v=>{const E=l("focusWorkText");v.currentTarget instanceof HTMLInputElement&&E&&(E.innerText=v.currentTarget.value+"分"),Y()}),["concertaSideEffects","concertaCompensations"].forEach(v=>{var E;(E=l(v))==null||E.addEventListener("click",nt=>{const pt=D(nt.target,".chip");pt&&(pt.classList.toggle("active"),Y())})}),(R=h("coldShowerEnabled"))==null||R.addEventListener("change",v=>{v.currentTarget instanceof HTMLInputElement&&(Cs(v.currentTarget.checked),Y())}),(O=h("coldShowerTime"))==null||O.addEventListener("change",v=>{v.currentTarget instanceof HTMLInputElement&&(xn(v.currentTarget.value),Y())}),(X=l("csQuickTimingPills"))==null||X.addEventListener("click",v=>{const E=D(v.target,".pill-sm-btn");E&&(xn(E.getAttribute("data-time")),Y())}),(J=h("coldShowerDuration"))==null||J.addEventListener("input",v=>{v.currentTarget instanceof HTMLInputElement&&(Is(v.currentTarget.value),Y())}),(Ut=l("csQuickDurationPills"))==null||Ut.addEventListener("click",v=>{const E=D(v.target,".pill-sm-btn");E&&(Ds(Number(E.getAttribute("data-sec"))),Y())}),(St=l("csFeelingPills"))==null||St.addEventListener("click",v=>{const E=D(v.target,".pill-sm-btn");E&&(Hs(E.getAttribute("data-val")),Y())}),(qt=document.getElementById("btn-save-log"))==null||qt.addEventListener("click",Ra),(le=document.getElementById("btn-reset-log"))==null||le.addEventListener("click",()=>Ce(Z))}const B={token:null,preview:null,mode:"merge",skipErrors:!1,busy:!1};let Fn=!1;function ao(){if(Fn)return;const t=l("import-modal"),e=l("memo-import-modal");if(!t&&!e)return;Fn=!0,t==null||t.addEventListener("click",a=>{if(a.target===t){bn();return}const o=D(a.target,"[data-action]");if(!o)return;const i=o.dataset.action;i==="import-close"?bn():i==="imp-pick"?ro():i==="imp-reselect"?en():i==="imp-mode"?js(o):i==="imp-confirm"&&mo()});const n=h("import-file-input");n==null||n.addEventListener("change",a=>{a.currentTarget instanceof HTMLInputElement&&lo(a.currentTarget)});const s=h("import-skip-errors");s==null||s.addEventListener("change",a=>{a.currentTarget instanceof HTMLInputElement&&fo(a.currentTarget)}),e==null||e.addEventListener("click",a=>{if(a.target===e){Ge();return}const o=D(a.target,"[data-action]");if(!o)return;const i=o.dataset.action;i==="memo-close"?Ge():i==="memo-preview"&&go()})}function q(t,e){var n;(n=l(t))==null||n.classList.toggle("hidden",!e)}function en(){B.token=null,B.preview=null,B.mode="merge",B.skipErrors=!1,B.busy=!1;const t=h("import-file-input");t&&(t.value=""),q("import-step-pick",!0),q("import-step-preview",!1),q("import-step-options",!1),q("import-fatal",!1),q("import-dup-tip",!1),q("import-issue-wrap",!1),q("import-diff-wrap",!1),q("import-result",!1),q("import-skip-wrap",!1),q("import-pick-btn",!0);const e=h("import-skip-errors");e&&(e.checked=!1);const n=l("import-result");n&&(n.textContent="");const s=l("import-subtitle");s&&(s.textContent="预检不写入数据，确认后才会导入"),ye(!1),At(!1);const a=document.querySelector('#import-step-options button[data-mode="merge"]');a instanceof HTMLElement&&js(a)}function At(t){B.busy=t;const e=K("import-pick-btn");e&&(e.disabled=t,e.classList.toggle("opacity-50",t),e.textContent=t?"预检中…":"选择文件");const n=K("memo-preview-btn");n&&(n.disabled=t,n.classList.toggle("opacity-50",t),n.textContent=t?"预检中…":"预检");const s=K("import-confirm-btn");s&&t&&(s.disabled=!0,s.classList.add("opacity-50"))}function ye(t,e){const n=K("import-confirm-btn");n&&(n.disabled=!t,n.classList.toggle("opacity-50",!t),n.textContent=e||(B.preview&&B.preview.errors>0&&B.skipErrors?"跳过错误行并导入":"确认导入"))}function oo(){var t;en(),(t=l("import-modal"))==null||t.classList.remove("hidden")}function bn(){var t;(t=l("import-modal"))==null||t.classList.add("hidden")}function io(t){var e;en(),(e=l("import-modal"))==null||e.classList.remove("hidden"),Ln(t)}function ro(){var t;B.busy||(t=h("import-file-input"))==null||t.click()}function lo(t){const e=t.files&&t.files[0];if(e){if(e.size>5*1024*1024){$("文件超过 5 MB，请按年份拆分后导入",!1),t.value="";return}co(e)}}async function co(t){At(!0);try{const e=new FormData;e.append("file",t),e.append("file_name",t.name||"");const n=await M.previewImportFile(e);if(!n||!n.data){Ye("预检失败：服务端返回异常");return}Ln(n.data)}catch(e){const n=e instanceof Error?e.message:"网络错误";Ye("预检失败："+n)}finally{At(!1)}}function Ye(t){q("import-step-pick",!0),q("import-step-preview",!1),q("import-result",!0);const e=l("import-result");e&&(e.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",e.textContent=t)}function Ln(t){B.preview=t,B.token=t.token||null,B.skipErrors=!1,q("import-step-pick",!1),q("import-step-preview",!0),q("import-step-options",!0),q("import-result",!1);const e=t.source_type==="json"?"JSON 备份":t.source_type==="memo"?"备忘录粘贴":"CSV 文件",n=t.file_size?xs(t.file_size):"",s=t.source_type==="memo"?"":' · <button type="button" data-action="imp-reselect" class="text-neutral-900 font-semibold underline underline-offset-2">重新选择</button>',a=l("import-file-meta");a&&(a.innerHTML=`<span class="font-bold text-slate-700">${T(t.file_name||e)}</span> · ${e}${n?" · "+n:""} · 编码 ${T(t.encoding||"—")}${s}`);const o=l("imp-stat-total"),i=l("imp-stat-inserted"),r=l("imp-stat-updated"),d=l("imp-stat-warnings"),c=l("imp-stat-errors");o&&(o.textContent=String(t.total_rows||0)),i&&(i.textContent=String(t.inserted||0)),r&&(r.textContent=String(t.updated||0)),d&&(d.textContent=String(t.warnings||0)),c&&(c.textContent=String(t.errors||0));const u=l("import-dup-tip");u&&(t.duplicate?(u.classList.remove("hidden"),u.innerHTML=`这个文件在 ${T((t.duplicate.created_at||"").slice(0,10))} 已导入过一次（新增 ${t.duplicate.inserted} / 更新 ${t.duplicate.updated}），请确认不是重复操作。`):u.classList.add("hidden"));const m=l("import-fatal");m&&(t.fatal?(m.classList.remove("hidden"),m.textContent=t.fatal):m.classList.add("hidden")),uo(t),po(t);const g=(t.errors||0)>0;q("import-skip-wrap",g&&!t.fatal);const x=h("import-skip-errors");x&&(x.checked=!1),ye(!!t.token&&!t.fatal&&(!g||B.skipErrors))}function uo(t){const e=l("import-issue-wrap"),n=l("import-issue-list"),s=l("import-issue-count");if(!e||!n)return;const a=(t.issues||[]).filter(o=>o.level==="error"||o.level==="warning");if(!a.length){e.classList.add("hidden");return}e.classList.remove("hidden"),s&&(s.textContent=`共 ${t.errors||0} 条错误 / ${t.warnings||0} 条警告`+(t.issues_truncated?"（仅显示前 500 条）":"")),n.innerHTML=a.slice(0,50).map(o=>{const i=o.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${i?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${i?"错误":"警告"}</span>
      <span class="text-[11px] text-slate-600 leading-snug break-all">第 ${o.line} 行${o.date?" · "+T(o.date):""}：${T(o.message)}</span>
    </div>`}).join("")}function po(t){const e=l("import-diff-wrap"),n=l("import-diff-list"),s=l("import-diff-count");if(!e||!n)return;const a=t.row_diffs||[];if(!a.length){e.classList.add("hidden");return}e.classList.remove("hidden"),s&&(s.textContent=`前 ${a.length} 条`+(t.diffs_truncated?"（还有更多）":"")),n.innerHTML=a.slice(0,30).map(o=>{const i=o.action==="insert",r=(o.changes||[]).slice(0,4).map(d=>{const c=d.old===""?"空":d.old,u=d.new===""?"空":d.new;return`${d.label} ${c}→${u}`}).join("，");return`<div class="rounded-lg bg-white border border-slate-100 px-2.5 py-1.5">
      <div class="flex items-center justify-between text-[11px]">
        <span class="font-bold text-slate-700">${T(o.date)}</span>
        <span class="${i?"text-emerald-600":"text-neutral-900 font-semibold"}">${i?"新增":"更新"}</span>
      </div>
      ${r?`<p class="text-[10px] text-slate-400 mt-0.5 break-all">${T(r)}</p>`:""}
    </div>`}).join("")}function js(t){t&&(B.mode=t.getAttribute("data-mode")||"merge",document.querySelectorAll("#import-step-options button[data-mode]").forEach(e=>{const n=e===t;e.className=n?"w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50 transition-all":"w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white transition-all"}))}function fo(t){B.skipErrors=!!(t&&t.checked);const e=B.preview,n=!!(e&&(e.errors||0)>0);ye(!!(e&&e.token&&!e.fatal&&(!n||B.skipErrors)))}async function mo(){if(B.busy)return;if(!B.token){$("预检已失效，请重新选择文件",!1);return}const t=B.preview||{};if((t.errors||0)>0&&!B.skipErrors){$("存在错误行：请勾选「跳过错误行」，或修正文件后重新导入",!1);return}const e=B.mode==="overwrite"?"替换（空值会清空旧数据）":"合并（空单元格保留旧值）";if(!await at(`将写入 ${t.inserted||0} 条新增记录、更新 ${t.updated||0} 条已有记录，冲突处理方式：${e}${B.skipErrors?"，并跳过 "+(t.errors||0)+" 条错误行":""}。写入过程为单个事务，失败会整体回滚。`,{title:"确认导入？",confirmText:"开始导入",danger:!1}))return;At(!0);const s=l("import-result");try{const a=await M.confirmImport({token:B.token,conflict_mode:B.mode,skip_errors:B.skipErrors}),o=a&&a.data;if(!o)throw new Error("导入失败：返回数据异常");s&&(s.classList.remove("hidden"),s.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",s.innerHTML=`<span class="font-bold">导入完成</span><br>新增 ${o.inserted||0} 条 · 更新 ${o.updated||0} 条${o.skipped?" · 跳过 "+o.skipped+" 行":""}<br>可在「导入记录」中查看本次明细。`),q("import-step-options",!1),q("import-skip-wrap",!1),B.token=null,ye(!1,"已完成"),$("导入完成",!0),xo()}catch(a){if(s){s.classList.remove("hidden"),s.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600";const o=a instanceof he&&a.status===409?"预检已过期，请重新选择文件：":"导入失败：";s.textContent=o+(a instanceof Error?a.message:"网络错误")}a instanceof he&&a.status&&ye(!1),$("导入失败",!1)}finally{At(!1)}}function xo(){var e;const t=et.state.currentTab||"log";if(t==="log"){const n=(e=h("input-date"))==null?void 0:e.value;n&&Ce(n)}else bt(t)}function bo(){var e;const t=us("memo-year-base");if(t){const n=new Date().getFullYear();t.innerHTML=[n,n-1,n-2].map(s=>`<option value="${s}">${s} 年</option>`).join("")}(e=l("memo-import-modal"))==null||e.classList.remove("hidden")}function Ge(){var t;(t=l("memo-import-modal"))==null||t.classList.add("hidden")}async function go(){var s,a,o;const t=((s=se("memo-import-text"))==null?void 0:s.value)||"";if(!t.trim()){$("请先粘贴备忘录内容",!1);return}const e=Number((a=us("memo-year-base"))==null?void 0:a.value)||new Date().getFullYear();Ge(),en(),(o=l("import-modal"))==null||o.classList.remove("hidden"),q("import-step-pick",!1);const n=l("import-subtitle");n&&(n.textContent="正在预检粘贴内容…"),At(!0);try{const i=await M.previewImportMemo(t,e);if(n&&(n.textContent="预检不写入数据，确认后才会导入"),!i||!i.data){q("import-step-pick",!0);const r=l("import-pick-btn");r&&(r.textContent="选择文件"),Ye("预检失败：服务端返回异常")}else Ln(i.data)}catch(i){n&&(n.textContent="预检不写入数据，确认后才会导入"),q("import-step-pick",!0);const r=l("import-pick-btn");r&&(r.textContent="选择文件");const d=i instanceof Error?i.message:"网络错误";Ye("预检失败："+d)}finally{At(!1)}}const ho={success:{label:"成功",cls:"bg-emerald-50 text-emerald-600"},partial:{label:"部分成功",cls:"bg-amber-50 text-amber-700"},failed:{label:"失败",cls:"bg-rose-50 text-rose-600"},interrupted:{label:"中断",cls:"bg-rose-50 text-rose-600"},pending:{label:"进行中",cls:"bg-slate-100 text-slate-500"}};let Un=!1;function vo(){if(Un)return;const t=l("import-batches-modal");t&&(Un=!0,t.addEventListener("click",e=>{if(e.target===t){we();return}const n=D(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="batches-close"){we();return}const a=Number(n.dataset.id);a&&(s==="batch-detail"?To(a):s==="batch-failed"?Eo(a):s==="batch-retry"&&Lo(a))}))}function yo(){var t;(t=l("import-batches-modal"))==null||t.classList.remove("hidden"),wo()}function we(){var t;(t=l("import-batches-modal"))==null||t.classList.add("hidden")}async function wo(){const t=l("batches-list");if(t){t.innerHTML='<p class="text-xs text-slate-400 text-center py-8">加载中…</p>';try{const e=await M.getImportBatches(20),n=e&&Array.isArray(e.data)?e.data:[];ko(n)}catch(e){const n=e instanceof Error?e.message:"网络错误";t.innerHTML=`<p class="text-xs text-rose-500 text-center py-8">加载失败：${T(n)}</p>`}}}function ko(t){const e=l("batches-list");if(e){if(!t.length){e.innerHTML='<p class="text-xs text-slate-400 text-center py-8">还没有导入记录</p>';return}e.innerHTML=t.map(n=>{const s=ho[n.status]||{label:n.status,cls:"bg-slate-100 text-slate-500"},a=n.source_type==="json"?"JSON 备份":n.source_type==="memo"?"备忘录":"CSV",o=String(n.created_at||"").replace("T"," ").slice(0,16),i=[];return i.push(`<button type="button" data-action="batch-detail" data-id="${n.id}" class="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200">详情</button>`),n.has_cache&&n.errors>0&&i.push(`<button type="button" data-action="batch-failed" data-id="${n.id}" class="px-2.5 py-1 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 hover:bg-amber-200">失败行</button>`),n.retryable&&i.push(`<button type="button" data-action="batch-retry" data-id="${n.id}" class="px-2.5 py-1 rounded-lg bg-neutral-900 text-[11px] font-mono font-medium text-white hover:bg-neutral-800">重试</button>`),`<div class="rounded-xl border border-neutral-200 px-3.5 py-3">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-bold text-slate-800 truncate">${T(n.file_name||a)}</p>
        <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}">${s.label}</span>
      </div>
      <p class="text-[10px] text-slate-400 mt-0.5">${a} · ${T(o)} · 共 ${n.total_rows||0} 行${n.attempt_no>1?" · 第 "+n.attempt_no+" 次尝试":""}</p>
      <p class="text-[11px] text-slate-500 mt-1">新增 ${n.inserted||0} · 更新 ${n.updated||0} · 跳过 ${n.skipped||0} · 警告 ${n.warnings||0} · 错误 ${n.errors||0}</p>
      ${n.error_message?`<p class="text-[10px] text-rose-500 mt-1 break-all">${T(n.error_message)}</p>`:""}
      <div class="flex flex-wrap gap-1.5 mt-2">${i.join("")}</div>
      <div id="batch-issues-${n.id}" class="hidden mt-2 space-y-1"></div>
    </div>`}).join("")}}async function To(t){const e=l("batch-issues-"+t);if(e){if(!e.classList.contains("hidden")){e.classList.add("hidden");return}if(e.classList.remove("hidden"),e.dataset.loaded!=="1"){e.dataset.loaded="1",e.innerHTML='<p class="text-[11px] text-slate-400">加载中…</p>';try{const n=await M.getImportBatchDetail(t),s=n&&n.data&&n.data.issues?n.data.issues:[];if(!s.length){e.innerHTML='<p class="text-[11px] text-slate-400">没有行级问题</p>';return}e.innerHTML=s.slice(0,50).map(a=>{const o=a.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2 py-1">
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${o?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${o?"错误":"警告"}</span>
        <span class="text-[10px] text-slate-600 leading-snug break-all">第 ${a.line} 行${a.date?" · "+T(a.date):""}：${T(a.message)}</span>
      </div>`}).join("")}catch{e.innerHTML='<p class="text-[11px] text-rose-500">明细加载失败</p>'}}}}async function Lo(t){try{const e=await M.retryImportBatch(t);if(!e||!e.data){$("重试失败",!1);return}we(),io(e.data),$("已重新预检，请确认后写入",!0)}catch(e){const n=e instanceof Error?e.message:"网络错误";$("重试失败："+n,!1)}}function Eo(t){we(),bs(`/api/v1/import/batches/${t}/failed-rows`,`HealthTrack_failed_rows_${t}.csv`,"失败行已下载，可修正后重新导入")}function So(t){t.insertAdjacentHTML("beforeend",ya),Ta(),ao(),vo()}function _o(t){var a,o,i,r,d;t.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("data-sheet"),s=document.getElementById("btn-close-datasheet");n==null||n.addEventListener("click",c=>{c.target===n&&yt()}),s==null||s.addEventListener("click",yt),(a=document.getElementById("btn-open-file-import"))==null||a.addEventListener("click",()=>{yt(),oo()}),(o=document.getElementById("btn-open-memo-import"))==null||o.addEventListener("click",()=>{yt(),bo()}),(i=document.getElementById("btn-open-batches"))==null||i.addEventListener("click",()=>{yt(),yo()}),(r=document.getElementById("btn-dl-template"))==null||r.addEventListener("click",()=>{yt(),bs("/api/v1/import/template","HealthTrack_import_template.csv","模板已下载")}),(d=document.getElementById("btn-open-export"))==null||d.addEventListener("click",()=>{yt(),La()})}function $o(){var t;(t=document.getElementById("data-sheet"))==null||t.classList.remove("hidden")}function yt(){var t;(t=document.getElementById("data-sheet"))==null||t.classList.add("hidden")}function Mo(t){var n,s;t.insertAdjacentHTML("afterbegin",`
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
  `),(n=document.getElementById("btn-open-settings"))==null||n.addEventListener("click",()=>{xa()}),(s=document.getElementById("btn-open-data"))==null||s.addEventListener("click",()=>{$o()})}function Co(t,e){t.insertAdjacentHTML("beforeend",`
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
  `);const s=document.getElementById("bottom-nav");s==null||s.addEventListener("click",a=>{const o=D(a.target,"button[data-tab]");if(!o)return;const i=o.getAttribute("data-tab");typeof e=="function"&&e(i)}),et.subscribe(a=>{const o=a.currentTab,i=o==="history"||o==="compare"?"insight":o==="trend"||o==="trend-detail"?"dash":o;["log","dash","insight","evening"].forEach(r=>{const d=document.getElementById(`tab-${r}`);d&&(r===i?(d.classList.add("active","text-neutral-900"),d.classList.remove("text-neutral-400")):(d.classList.remove("active","text-neutral-900"),d.classList.add("text-neutral-400")))})})}const Xt="ht-date-picker-modal",Io=["周日","周一","周二","周三","周四","周五","周六"];let W=null,Nt=new Date().getFullYear(),Rt=new Date().getMonth(),Ct=N(new Date),qn=!1;function Do(t,e){const s=new Date(t,e,1).getDay(),a=[];for(let o=0;o<42;o++){const i=new Date(t,e,1-s+o);a.push({ymd:N(i),day:i.getDate(),inMonth:i.getFullYear()===t&&i.getMonth()===e})}return a}function Je(t){if(!/^\d{4}-\d{2}-\d{2}$/.test(t||""))return null;const[e,n,s]=t.split("-").map(Number),a=new Date(e,n-1,s);return a.getFullYear()!==e||a.getMonth()!==n-1||a.getDate()!==s?null:{year:e,monthIndex:n-1,day:s}}function En(t,e,n){return!!(e&&t<e||n&&t>n)}function Ho(){return`
    <div id="${Xt}" class="hidden fixed inset-0 z-[70] bg-neutral-950/40 backdrop-blur-[2px] p-4 flex items-center justify-center">
      <section class="w-full max-w-[320px] bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="ht-dp-selected-label">
        <div class="bg-neutral-900 text-white px-4 py-3">
          <p id="ht-dp-selected-label" class="text-sm font-bold font-mono tracking-tight tabular-nums leading-none"></p>
        </div>

        <div class="px-3 py-2.5 flex items-center justify-between border-b border-neutral-100">
          <div class="flex items-center gap-0.5">
            <button type="button" data-action="dp-prev-year" aria-label="上一年" class="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
            </button>
            <button type="button" data-action="dp-prev-month" aria-label="上一月" class="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </div>
          <span id="ht-dp-ym" class="text-xs font-mono font-semibold text-neutral-900 tabular-nums"></span>
          <div class="flex items-center gap-0.5">
            <button type="button" data-action="dp-next-month" aria-label="下一月" class="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <button type="button" data-action="dp-next-year" aria-label="下一年" class="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 text-center text-[10px] font-mono text-neutral-400 px-3 pt-2.5 pb-1">
          <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
        </div>
        <div id="ht-dp-grid" class="grid grid-cols-7 gap-1 px-3 pb-3 font-mono text-xs tabular-nums"></div>

        <div class="px-3.5 py-3 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-between font-mono">
          <button type="button" data-action="dp-confirm" class="min-w-[80px] py-1.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all active:scale-95">确定</button>
          <button type="button" data-action="dp-cancel" class="min-w-[80px] py-1.5 px-4 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 text-xs font-medium transition-all active:scale-95">取消</button>
        </div>
      </section>
    </div>
  `}function Sn(){const t=l("ht-dp-selected-label"),e=l("ht-dp-ym"),n=l("ht-dp-grid");if(!t||!e||!n)return;const s=Je(Ct);if(s){const d=new Date(s.year,s.monthIndex,s.day);t.innerText=`${Ct} · ${Io[d.getDay()]}`}else t.innerText="选择日期";e.innerText=`${Nt}年 ${String(Rt+1).padStart(2,"0")}月`;const a=N(new Date),o=(W==null?void 0:W.min)||"",i=(W==null?void 0:W.max)||"",r=Do(Nt,Rt);n.innerHTML=r.map(d=>{const c=En(d.ymd,o,i),u=d.ymd===Ct,m=d.ymd===a;let g="h-9 rounded-lg flex items-center justify-center transition-colors ";return c?g+="text-neutral-200 cursor-not-allowed":u?g+="bg-neutral-900 text-white font-bold":m?g+="border border-neutral-400 text-neutral-900 font-semibold hover:bg-neutral-100":d.inMonth?g+="text-neutral-800 hover:bg-neutral-100":g+="text-neutral-300 hover:bg-neutral-50",`<button type="button" data-action="dp-pick" data-ymd="${d.ymd}" class="${g}"${c?" disabled":""}>${d.day}</button>`}).join("")}function je(t){const e=new Date(Nt,Rt+t,1);Nt=e.getFullYear(),Rt=e.getMonth(),Sn()}function Bo(t){const e=(W==null?void 0:W.min)||"",n=(W==null?void 0:W.max)||"";if(En(t,e,n))return;Ct=t;const s=Je(t);s&&(s.year!==Nt||s.monthIndex!==Rt)&&(Nt=s.year,Rt=s.monthIndex),Sn()}function jo(){const t=(W==null?void 0:W.min)||"",e=(W==null?void 0:W.max)||"";if(En(Ct,t,e))return;const n=W,s=Ct;if(be(),n){const a=n.value!==s;n.value=s,a&&(n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0})))}}function Vn(t){const e=l(Xt);if(!e)return;W=t;const n=Je(t.value)||Je(N(new Date));n&&(Nt=n.year,Rt=n.monthIndex,Ct=`${n.year}-${String(n.monthIndex+1).padStart(2,"0")}-${String(n.day).padStart(2,"0")}`),Sn(),e.classList.remove("hidden")}function be(){const t=l(Xt);t&&t.classList.add("hidden"),W=null}function Ao(t){t.querySelectorAll('input[type="date"]').forEach(e=>{e instanceof HTMLInputElement&&(e.readOnly=!0)})}function No(t){if(!t||(l(Xt)||t.insertAdjacentHTML("beforeend",Ho()),Ao(document),qn))return;qn=!0;const e=l(Xt);e==null||e.addEventListener("click",n=>{if(n.target===e){be();return}const s=D(n.target,"[data-action]");if(!s)return;const a=s.dataset.action;if(a==="dp-prev-year")je(-12);else if(a==="dp-prev-month")je(-1);else if(a==="dp-next-month")je(1);else if(a==="dp-next-year")je(12);else if(a==="dp-cancel")be();else if(a==="dp-confirm")jo();else if(a==="dp-pick"){const o=s.getAttribute("data-ymd");o&&Bo(o)}}),document.addEventListener("click",n=>{const s=n.target;s instanceof HTMLInputElement&&s.type==="date"&&!s.disabled&&(n.preventDefault(),n.stopPropagation(),s.readOnly=!0,s.blur(),Vn(s))},!0),document.addEventListener("keydown",n=>{if(n.key==="Escape"){const a=l(Xt);a&&!a.classList.contains("hidden")&&be();return}const s=n.target;s instanceof HTMLInputElement&&s.type==="date"&&!s.disabled&&(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),n.stopPropagation(),s.readOnly=!0,s.blur(),Vn(s))},!0)}const Ro=`      <section id="view-dash" class="fade-in space-y-4 hidden">
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

      <!-- 3. AI 洞察页 (Insight View) -->`,Po=12,As={weight:{label:"体重周均值 (kg)",field:"weight_am",unit:"kg",color:"#1e293b",band:"rgba(30, 41, 59, 0.08)"},waist:{label:"腰围周均值 (cm)",field:"waist_size",unit:"cm",color:"#7c3aed",band:"rgba(124, 58, 237, 0.08)"},sleep:{label:"睡眠周均值 (小时)",field:"sleep_hours",unit:"小时",color:"#4f46e5",band:"rgba(79, 70, 229, 0.12)"},steps:{label:"步数周均值 (步)",field:"steps",unit:"步",color:"#ea580c",band:"rgba(234, 88, 12, 0.08)",int:!0}},kt={metric:"weight",records:[],buckets:[],aggs:[]};let Ae=null,Wn=!1;function Oo(t){const e=new Date(t.getFullYear(),t.getMonth(),t.getDate());return e.setDate(e.getDate()-(e.getDay()+6)%7),e}function Ns(t=new Date){const e=Oo(t),n=[];for(let s=Po-1;s>=0;s--){const a=new Date(e);a.setDate(e.getDate()-s*7);const o=new Date(a);o.setDate(a.getDate()+6),n.push({start:N(a),end:N(o)})}return n}function zo(t,e,n){return e.map(s=>{const a=[];return t.forEach(i=>{if(i.record_date>=s.start&&i.record_date<=s.end){const r=i[n];r!=null&&r!==""&&!isNaN(Number(r))&&a.push(Number(r))}}),a.length===0?{avg:null,min:null,max:null,n:0}:{avg:a.reduce((i,r)=>i+r,0)/a.length,min:Math.min(...a),max:Math.max(...a),n:a.length}})}function Fo(){if(Wn)return;const t=l("view-trend");t&&(Wn=!0,t.addEventListener("click",e=>{const n=D(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="back-dash")bt("dash");else if(s==="trend-metric"){const a=n.dataset.metric;a&&Rs(a)}}))}function Uo(){Rs(kt.metric),bt("trend")}function Rs(t){As[t]&&(kt.metric=t,["weight","waist","sleep","steps"].forEach(e=>{const n=l(`trend-tab-${e}`);n&&(n.className=e===t?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),et.state.currentTab==="trend"&&Ps())}async function qo(){await Vo()}async function Vo(){const e=Ns()[0].start,n=N(new Date);try{const s=await M.getHistoryRecords(e,n);kt.records=s&&s.data?s.data:Array.isArray(s)?s:[]}catch{kt.records=[]}Ps()}function Ps(){const t=As[kt.metric],e=b=>t.int?Math.round(b).toLocaleString("en-US"):b.toFixed(1),n=Ns(),s=zo(kt.records,n,t.field);kt.buckets=n,kt.aggs=s;const a=n.map(b=>b.start.slice(5)),o=s.map(b=>b.max),i=s.map(b=>b.min),r=s.map(b=>b.avg),d=s.map(b=>b.n>=1&&b.n<=3),c=l("trend-metric-label");c&&(c.innerText=t.label);const u=l("trend-metric-stat"),m=l("trend-metric-note");let g=-1;for(let b=s.length-1;b>=0;b--)if(s[b].n>0){g=b;break}if(g>=0){const b=s[g],L=n[g];u&&(u.innerText=`${e(b.avg)} ${t.unit}`),m&&(m.innerHTML=`${L.start.slice(5)}~${L.end.slice(5)} 周均值<br>${b.n} 天数据${b.n<=3?"（低置信）":""}`)}else u&&(u.innerText="--"),m&&(m.innerHTML="近 12 周暂无数据");const x=l("trend-detail");x&&(x.innerHTML=g>=0?'<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>':'<span class="font-mono text-[10px] text-neutral-400">近 12 周暂无该指标数据，记录几天后再来看看</span>');const y=Wt("chart-trend");if(!y)return;Ae&&(Ae.destroy(),Ae=null);const S=typeof Chart<"u"&&Chart.getChart?Chart.getChart(y):null;S&&S.destroy();const _=y.getContext("2d");_&&(Ae=new Chart(_,{type:"line",data:{labels:a,datasets:[{label:"周内最大",data:o,borderColor:"transparent",backgroundColor:t.band,pointRadius:0,pointHoverRadius:0,fill:{target:1},spanGaps:!1,tension:.25},{label:"周内最小",data:i,borderColor:"transparent",backgroundColor:"transparent",pointRadius:0,pointHoverRadius:0,spanGaps:!1,tension:.25},{label:"周均值",data:r,borderColor:t.color,backgroundColor:t.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:b=>d[b.dataIndex]?4:3,pointBackgroundColor:b=>d[b.dataIndex]?"#ffffff":t.color,pointBorderColor:t.color,pointBorderWidth:b=>d[b.dataIndex]?2:0,segment:{borderDash:b=>d[b.p1DataIndex]||d[b.p0DataIndex]?[5,4]:void 0}}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{filter:b=>b.datasetIndex===2,displayColors:!1,callbacks:{title:b=>{const L=n[b[0].dataIndex];return`${L.start} ~ ${L.end}`},label:b=>{const L=s[b.dataIndex];return!L||L.n===0?"该周无数据":[`周均值：${e(L.avg)} ${t.unit}`,`区间：${e(L.min)} ~ ${e(L.max)}`,`样本：${L.n} 天${L.n<=3?"（低置信）":""}`]}}}},scales:{y:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:6}}},onClick:(b,L)=>{let R=-1;if((L||[]).forEach(J=>{J.datasetIndex===2&&(R=J.index)}),R<0||!x)return;const O=s[R],X=n[R];!O||O.n===0||(x.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${X.start} ~ ${X.end}</b>　均值 ${e(O.avg)} ${t.unit} · 区间 ${e(O.min)}~${e(O.max)} · ${O.n} 天${O.n<=3?"（低置信）":""}</span>`)}}}))}const Ke=60,Wo=26,Yo=Ke*Wo,Go=560,Os={weight:{label:"体重逐日 (kg)",field:"weight_am",unit:"kg",color:"#1e293b"},waist:{label:"腰围逐日 (cm)",field:"waist_size",unit:"cm",color:"#7c3aed"},sleep:{label:"睡眠时长逐日 (小时)",field:"sleep_hours",unit:"小时",color:"#4f46e5",avg:!0},steps:{label:"步数逐日 (步)",field:"steps",unit:"步",color:"#ea580c",avg:!0,yMax:2e4,yStep:5e3,fmt:t=>t.toLocaleString("en-US")}},Tt={metric:"weight",records:[]};let Gt=null,Yn=!1;function zs(t=new Date){const e=[];for(let n=Ke-1;n>=0;n--){const s=new Date(t.getFullYear(),t.getMonth(),t.getDate());s.setDate(s.getDate()-n),e.push(N(s))}return e}function Jo(){return window.matchMedia("(orientation: landscape) and (max-height: 600px)").matches}function Ko(){const t=l("app-frame");t&&t.classList.toggle("frame-wide",et.state.currentTab==="trend-detail"&&Jo())}function Xo(){const t=l("td-chart-box"),e=l("td-chart-scroll");if(!t||!e)return;const n=e.clientWidth>=Go;t.style.width=n?"100%":`${Yo}px`,t.style.height=n?"150px":"220px",Gt&&Gt.resize()}function Fs(){Ko(),Xo()}function Zo(){const t=()=>{et.state.currentTab==="trend-detail"&&Fs()};window.addEventListener("resize",t);const e=window.matchMedia("(orientation: landscape) and (max-height: 600px)");e.addEventListener?e.addEventListener("change",t):e.addListener&&e.addListener(t)}function Qo(){if(Yn)return;const t=l("view-trend-detail");t&&(Yn=!0,t.addEventListener("click",e=>{const n=D(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="back-dash")bt("dash");else if(s==="td-metric"){const a=n.dataset.metric;a&&Us(a)}}),Zo())}function ti(){Us(Tt.metric),bt("trend-detail")}function Us(t){Os[t]&&(Tt.metric=t,["weight","waist","sleep","steps"].forEach(e=>{const n=l(`td-tab-${e}`);n&&(n.className=e===t?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),et.state.currentTab==="trend-detail"&&qs())}async function ei(){await ni()}async function ni(){const t=zs(),e=t[0],n=t[t.length-1];try{const s=await M.getHistoryRecords(e,n);Tt.records=s&&s.data?s.data:Array.isArray(s)?s:[]}catch{Tt.records=[]}qs()}function si(t,e){if(t==="weight"){const a=d=>d==null?"--":`${d} kg`,o=e.weight_am,i=e.weight_pm;let r="";return o!=null&&i!==null&&i!==void 0&&(r=` · 夜间排水 <b class="text-slate-700">${(Math.round((i-o)*10)/10).toFixed(1)} kg</b>`),`<b class="text-slate-700">${e.record_date}</b>　睡前 ${a(i)} · 晨起 ${a(o)}${r}`}if(t==="waist"){const a=e.waist_size===null||e.waist_size===void 0?"--":`${e.waist_size} cm`;return`<b class="text-slate-700">${e.record_date}</b>　腰围 ${a}`}if(t==="steps"){const a=e.steps===null||e.steps===void 0?"--":`${Number(e.steps).toLocaleString("en-US")} 步`;return`<b class="text-slate-700">${e.record_date}</b>　步数 ${a}${e.morning_light===!0?" · 已见晨光":""}`}const n=e.sleep_tag==="RED"?"熬夜":e.sleep_tag==="YELLOW"?"轻度":"正常",s=e.sleep_hours===null||e.sleep_hours===void 0?"--":`${e.sleep_hours} 小时`;return`<b class="text-slate-700">${e.record_date}</b>　就寝 ${e.sleep_start_time||"--"} · 起床 ${e.sleep_end_time||"--"} · ${s} · ${n}`}function qs(){const t=Os[Tt.metric],e=zs(),n={};Tt.records.forEach(x=>{x&&x.record_date&&(n[x.record_date]=x)});const s=e.map(x=>{const y=n[x];if(!y)return null;const S=y[t.field];return S==null||S===""||isNaN(Number(S))?null:Number(S)}),a=e.map(x=>x.slice(5)),o=l("td-detail");o&&(o.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>');const i=l("td-metric-label");i&&(i.innerText=t.label);const r=l("td-metric-stat"),d=l("td-metric-note"),c=s.filter(x=>x!==null);if(c.length>0){if(r)if(t.avg){const x=c.reduce((y,S)=>y+S,0)/c.length;r.innerText=Tt.metric==="sleep"?`${x.toFixed(1)} 小时 (均值)`:`${Math.round(x).toLocaleString("en-US")} 步 (均值)`}else r.innerText=`${c[c.length-1]} ${t.unit}`;d&&(d.innerHTML=`近 ${Ke} 天逐日<br>有效 ${c.length} 天`)}else r&&(r.innerText="--"),d&&(d.innerHTML=`近 ${Ke} 天暂无数据`);const u=Wt("chart-trend-detail");if(!u)return;Gt&&(Gt.destroy(),Gt=null);const m=typeof Chart<"u"&&Chart.getChart?Chart.getChart(u):null;m&&m.destroy();const g=u.getContext("2d");g&&(Gt=new Chart(g,{type:"line",data:{labels:a,datasets:[{label:t.label,data:s,borderColor:t.color,backgroundColor:t.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:3,pointBackgroundColor:t.color}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{displayColors:!1,callbacks:{title:x=>e[x[0].dataIndex],label:x=>{const y=s[x.dataIndex];return y===null?"当日无数据":`数值：${t.fmt?t.fmt(y):y} ${t.unit}`}}}},scales:{y:t.yMax?{beginAtZero:!0,max:t.yMax,ticks:{font:{size:10},stepSize:t.yStep,callback:x=>x===0?"0":`${x/1e4}万`}}:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:20}}},onClick:(x,y)=>{if(!y||!y.length||!o)return;const S=y[0].index,_=e[S],b=n[_];!b||s[S]===null||(o.innerHTML=`<span class="font-mono text-neutral-400">·</span><span>${si(Tt.metric,b)}</span>`)}}}),Fs())}let ke=7,Ne=null,Re=null,Pe=null,Oe=null;function ai(){typeof Chart<"u"&&Chart.defaults&&(Chart.defaults.font.family="'JetBrains Mono', 'Cascadia Code', monospace",Chart.defaults.font.size=10,Chart.defaults.color="#a3a3a3",Chart.defaults.plugins.tooltip.backgroundColor="#171717",Chart.defaults.plugins.tooltip.titleColor="#ffffff",Chart.defaults.plugins.tooltip.bodyColor="#d4d4d4",Chart.defaults.plugins.tooltip.padding=10,Chart.defaults.plugins.tooltip.cornerRadius=8,Chart.defaults.plugins.tooltip.titleFont={family:"'JetBrains Mono', monospace",weight:"600",size:11},Chart.defaults.plugins.tooltip.bodyFont={family:"'JetBrains Mono', monospace",size:10})}function oi(t){if(!t)return[];let e=Array.isArray(t.types)?t.types.slice():[];return e.length===0&&t.type&&(e=[t.type]),e.filter(n=>n&&n!=="none")}function ii(t){t.insertAdjacentHTML("beforeend",Ro),ai(),ri(),Fo(),Qo()}function ri(){const t=l("view-dash");t&&t.addEventListener("click",e=>{const n=D(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="dash-range"){const a=Number(n.dataset.days);(a===7||a===30||a===60)&&Vs(a)}else s==="open-trend-detail"?ti():s==="open-trend"&&Uo()})}function li(){Vs(ke)}function Vs(t){ke=t,et.set({dashRange:t}),["7","30","60"].forEach(e=>{const n=l("btn-range-"+e);n&&(n.className=Number(e)===t?"px-3 py-1 rounded-md bg-white border border-neutral-200 text-neutral-900 font-mono font-medium shadow-sm transition-all":"px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-900 font-mono font-medium transition-all")}),di(t)}async function di(t=ke){ke=t;const e=N(new Date),n=Ht(e,-(t-1));try{const s=await M.getHistoryRecords(n,e),a=s&&s.data?s.data:Array.isArray(s)?s:[];ci(a,n,t)}catch(s){console.error("加载看板数据失败:",s)}}function ci(t,e,n){const s=Object.create(null);t.forEach(p=>{p&&p.record_date&&(s[p.record_date]=p)});const a=n||ke||7,o=e||Ht(N(new Date),-(a-1)),i=[];for(let p=0;p<a;p++)i.push(Ht(o,p));const r=i.map(p=>s[p]||{record_date:p}),d=i.map(p=>p.slice(5)),c=r.map(p=>p.weight_am===null||p.weight_am===void 0?null:p.weight_am),u=r.map(p=>p.weight_pm===null||p.weight_pm===void 0?null:p.weight_pm),m=r.map(p=>p.waist_size===null||p.waist_size===void 0?null:p.waist_size),g=r.map(p=>p.sleep_hours===null||p.sleep_hours===void 0?null:p.sleep_hours),x=r.map(p=>p.sleep_hours===null||p.sleep_hours===void 0?"transparent":p.sleep_tag==="RED"?"#f43f5e":p.sleep_tag==="YELLOW"?"#fbbf24":"#34c759"),y=c.filter(p=>p!=null),S=l("dash-weight-stat");S&&(S.innerText=y.length>0?`${y[y.length-1]} kg`:"--");const _=g.filter(p=>p!=null),b=l("dash-sleep-stat");if(b)if(_.length>0){const p=(_.reduce((z,H)=>z+H,0)/_.length).toFixed(1);b.innerText=`${p} 小时 (均值)`}else b.innerText="--";const L=l("dash-weight-detail");L&&(L.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日睡前重 / 晨重</span>');const R=Wt("chart-weight");if(R){Ne&&(Ne.destroy(),Ne=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(R):null;p&&p.destroy();const z=R.getContext("2d");if(z){const H=z.createLinearGradient(0,0,0,160);H.addColorStop(0,"rgba(245, 158, 11, 0.08)"),H.addColorStop(1,"rgba(245, 158, 11, 0.00)");const I=z.createLinearGradient(0,0,0,160);I.addColorStop(0,"rgba(30, 41, 59, 0.06)"),I.addColorStop(1,"rgba(30, 41, 59, 0.00)"),Ne=new Chart(z,{type:"line",data:{labels:d,datasets:[{label:"睡前体重",data:u,borderColor:"#f59e0b",borderWidth:2,backgroundColor:H,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#f59e0b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16},{label:"晨起体重",data:c,borderColor:"#1e293b",borderWidth:2.2,backgroundColor:I,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#1e293b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{itemSort:(C,U)=>C.datasetIndex-U.datasetIndex}},onClick:(C,U)=>{if(!U||!U.length||!L)return;const Q=r[U[0].index];if(!Q||Q.weight_am==null&&Q.weight_pm==null)return;const De=gt=>gt==null?"--":`${gt} kg`,He=Q.weight_am,Be=Q.weight_pm;let Bn="";if(He!=null&&Be!==null&&Be!==void 0){const gt=Math.round((Be-He)*10)/10;let de;gt<.3?de="偏低，可能高钠储水":gt<.4?de="偏低":gt<=.9?de="正常":de="偏高",Bn=` · 夜间排水 <b class="text-slate-700">${gt.toFixed(1)} kg</b>（${de}）`}L.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${Q.record_date}</b>　睡前 ${De(Be)} · 晨起 ${De(He)}${Bn}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}}const O=m.filter(p=>p!=null),X=l("dash-waist-stat");X&&(X.innerText=O.length>0?`${O[O.length-1]} cm`:"--");const J=l("dash-waist-detail");J&&(J.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>');const Ut=Wt("chart-waist");if(Ut){Re&&(Re.destroy(),Re=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(Ut):null;p&&p.destroy();const z=Ut.getContext("2d");if(z){const H=z.createLinearGradient(0,0,0,160);H.addColorStop(0,"rgba(124, 58, 237, 0.10)"),H.addColorStop(1,"rgba(124, 58, 237, 0.00)"),Re=new Chart(z,{type:"line",data:{labels:d,datasets:[{label:"腰围",data:m,borderColor:"#7c3aed",borderWidth:2.2,backgroundColor:H,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#7c3aed",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(I,C)=>{if(!C||!C.length||!J)return;const U=r[C[0].index];if(!U||U.waist_size==null)return;const Q=U.waist_size===null||U.waist_size===void 0?"--":`${U.waist_size} cm`;J.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${U.record_date}</b>　腰围 ${Q}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}}const St=l("dash-sleep-detail");St&&(St.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>');const qt=Wt("chart-sleep");if(qt){Pe&&(Pe.destroy(),Pe=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(qt):null;p&&p.destroy();const z=qt.getContext("2d");z&&(Pe=new Chart(z,{type:"bar",data:{labels:d,datasets:[{data:g,backgroundColor:x,borderRadius:8,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},onHover:(H,I)=>{H.native&&H.native.target instanceof HTMLElement&&(H.native.target.style.cursor=I.length?"pointer":"default")},onClick:(H,I)=>{if(!I||!I.length||!St)return;const C=r[I[0].index];if(!C||C.sleep_hours==null&&!C.sleep_start_time)return;const U=C.sleep_tag==="RED"?"熬夜":C.sleep_tag==="YELLOW"?"轻度":"正常",Q=C.sleep_hours===null||C.sleep_hours===void 0?"--":`${C.sleep_hours} 小时`;St.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${C.record_date}</b>　就寝 ${C.sleep_start_time||"--"} · 起床 ${C.sleep_end_time||"--"} · ${Q} · ${U}</span>`},scales:{y:{beginAtZero:!0,max:12,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}}))}const le=r.map(p=>p.steps===null||p.steps===void 0?null:Number(p.steps)),v=le.filter(p=>p!==null),E=l("dash-steps-stat");if(E)if(v.length>0){const p=Math.round(v.reduce((z,H)=>z+H,0)/v.length);E.innerText=`${p.toLocaleString("en-US")} 步 (均值)`}else E.innerText="--";const nt=l("dash-steps-detail");nt&&(nt.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>');const pt=Wt("chart-steps");if(pt){Oe&&(Oe.destroy(),Oe=null);const p=typeof Chart<"u"&&Chart.getChart?Chart.getChart(pt):null;p&&p.destroy();const z=pt.getContext("2d");if(z){const H=z.createLinearGradient(0,0,0,160);H.addColorStop(0,"rgba(234, 88, 12, 0.16)"),H.addColorStop(1,"rgba(234, 88, 12, 0.00)"),Oe=new Chart(z,{type:"line",data:{labels:d,datasets:[{label:"步数",data:le,borderColor:"#ea580c",borderWidth:2.2,backgroundColor:H,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#ea580c",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onHover:(I,C)=>{I.native&&I.native.target instanceof HTMLElement&&(I.native.target.style.cursor=C.length?"pointer":"default")},onClick:(I,C)=>{if(!C||!C.length||!nt)return;const U=r[C[0].index];if(!U||U.steps===null||U.steps===void 0)return;const Q=`${Number(U.steps).toLocaleString("en-US")} 步`,De=U.morning_light===!0?" · 已见晨光":"";nt.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${U.record_date}</b>　步数 ${Q}${De}</span>`},scales:{y:{beginAtZero:!0,max:2e4,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#94a3b8",stepSize:5e3,callback:I=>I===0?"0":`${I/1e4}万`}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}}const on=l("dash-activities-list");if(!on)return;if(t.length===0){on.innerHTML='<p class="text-slate-400 text-center py-2">暂无记录</p>';return}const rn=[];t.slice().reverse().forEach(p=>{const z=oi(p.exercise);if(p.journal_text||p.activity_tags||z.length>0||p.concerta&&p.concerta.taken||p.cold_shower&&p.cold_shower.enabled){let H="";if(p.activity_tags)try{const I=JSON.parse(p.activity_tags);Array.isArray(I)&&(H+=I.map(C=>`<span class="bg-neutral-100 text-neutral-700 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono mr-1">${T(C)}</span>`).join(""))}catch{}if(z.length>0&&(z.includes("strength")&&(H+='<span class="bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">无氧</span>'),z.includes("cardio")&&(H+='<span class="bg-sky-50 text-sky-700 border border-sky-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">有氧</span>'),z.filter(I=>I!=="strength"&&I!=="cardio").forEach(I=>{H+=`<span class="bg-slate-100 text-slate-700 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">${T(I)}</span>`})),p.cold_shower&&p.cold_shower.enabled){const I=p.cold_shower.water_temp===null||p.cold_shower.water_temp===void 0?"":` ${p.cold_shower.water_temp}℃`;let C=p.cold_shower.duration,U="";C!=null&&C>0&&(C<=10&&(C=C*60),U=` · ${C}s`),H+=`<span class="bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">冷水澡${T(I)}${U}</span>`}if(p.concerta&&p.concerta.taken){const I=p.concerta.dose?` ${T(p.concerta.dose)}mg`:"";H+=`<span class="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">专注达${I}</span>`}rn.push(`
        <div class="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div class="flex justify-between items-start gap-2 mb-1.5">
            <span class="font-bold text-neutral-800 font-mono text-xs shrink-0">${T(p.record_date||"")}</span>
            <div class="flex flex-wrap gap-1 items-center justify-end">${H}</div>
          </div>
          <p class="text-neutral-600 line-clamp-2">${T(p.journal_text||"无文字备注")}</p>
        </div>
      `)}}),on.innerHTML=rn.length>0?rn.join(""):'<p class="text-neutral-400 text-center py-2 font-mono text-xs">暂无活动记录</p>'}const ui=`      <!-- 3. AI 洞察页 (Insight View) -->
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
`;async function _n({url:t,signal:e,onUpdate:n,onDone:s,onError:a}){let o="",i="",r=!1,d=0,c=!1;const u=()=>{d=0,!c&&typeof n=="function"&&n({thinking:o,content:i,hasError:r})},m=()=>{d||(typeof requestAnimationFrame=="function"?d=requestAnimationFrame(u):u())},g=x=>{const y=x.trim();if(!y||!y.startsWith("data:"))return;const S=y.slice(5).trim();if(!(!S||S==="[DONE]"))try{const _=JSON.parse(S);if(_.error)i+=`
> **服务提示**: ${_.error}
`,r=!0,m();else if(_.choices&&_.choices.length>0){const b=_.choices[0].delta||{};let L=!1;b.reasoning_content&&(o+=b.reasoning_content,L=!0),b.content&&(i+=b.content,L=!0),L&&m()}}catch{}};try{const x=await fetch(t,{signal:e});if(!x.ok)throw new Error(`HTTP ${x.status}`);if(!x.body||typeof x.body.getReader!="function")throw new Error("当前环境不支持流式响应读取");const y=x.body.getReader(),S=new TextDecoder("utf-8");let _="";for(;;){const{done:b,value:L}=await y.read();if(b)break;_+=S.decode(L,{stream:!0});const R=_.split(`
`);_=R.pop()||"";for(const O of R)g(O)}return _.trim()&&g(_),d&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(d),d=0),!c&&typeof n=="function"&&n({thinking:o,content:i,hasError:r}),!c&&typeof s=="function"&&s({thinking:o,content:i,hasError:r}),{aborted:!1,thinking:o,content:i,hasError:r}}catch(x){return d&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(d),d=0),x&&x.name==="AbortError"?(c=!0,{aborted:!0,thinking:o,content:i,hasError:r}):(typeof a=="function"&&a(x,{thinking:o,content:i,hasError:r}),{aborted:!1,error:x,thinking:o,content:i,hasError:!0})}}function Ws(t){t.innerHTML="";const e=document.createElement("div"),n=document.createElement("div");t.appendChild(e),t.appendChild(n);let s=null,a=null,o=null,i=!1,r="";return({thinking:d,content:c})=>{d&&(s||(s=document.createElement("details"),s.className="mb-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-500",s.open=!0,a=document.createElement("summary"),a.className="cursor-pointer font-mono font-medium text-neutral-600 select-none hover:text-neutral-900 transition-colors",o=document.createElement("div"),o.className="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600",s.appendChild(a),s.appendChild(o),e.appendChild(s)),a&&(a.textContent=`思维链推导 (${d.length} 字)`),o&&(o.textContent=d),c&&!i&&s&&(s.open=!1,i=!0)),c&&c!==r&&(r=c,n.innerHTML=Me(c))}}function Ys(t,e){let n="";const s=(e||"").trim();return s&&(n+=`
      <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
        <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${s.length} 字)</summary>
        <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${T(s)}</div>
      </details>`),t&&t.trim()?n+=Me(t):n+='<p class="text-slate-400 text-xs">该洞察没有正文内容。</p>',n}const w={monthA:"",monthB:"",metricsA:null,metricsB:null,generated:!1,busy:!1,loadSeq:0,returnTab:"insight"};let ce=null,Gn=!1;function pi(){if(Gn)return;const t=l("view-compare");t&&(Gn=!0,t.addEventListener("click",e=>{const n=D(e.target,"[data-action]");if(!n)return;const s=n.dataset.action;if(s==="cmp-back")Xs();else if(s==="cmp-step"){const a=n.dataset.which,o=Number(n.dataset.delta);(a==="a"||a==="b")&&(o===-1||o===1)&&bi(a,o)}else s==="cmp-generate"&&vi()}))}function Te(t){const e=new Date;return e.setDate(1),e.setMonth(e.getMonth()+t),`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Jn(t){const[e,n]=t.split("-").map(Number);return e*12+(n-1)}function fi(){return Te(0)}function Gs(t,e){const[n,s]=t.split("-").map(Number),a=new Date(n,s-1+e,1);return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`}function ut(t){if(!t)return"—";const[e,n]=t.split("-");return`${e} 年 ${parseInt(n,10)} 月`}function Js(t){return Jn(t)>Jn(fi())}function Ks(t,e,n){w.returnTab=n==="history"?"history":"insight",t&&e?(w.monthA=t,w.monthB=e):(w.monthA||(w.monthA=Te(-1)),w.monthB||(w.monthB=Te(-2))),bt("compare")}function mi(t,e){Ks(t,e,"history")}function Xs(){bt(w.returnTab==="history"?"history":"insight")}function xi(){ta()}function $n(){const t=l("cmp-a-label"),e=l("cmp-b-label");t&&(t.innerText=ut(w.monthA)),e&&(e.innerText=ut(w.monthB)),["a","b"].forEach(n=>{const s=n==="a"?w.monthA:w.monthB,a=K(`cmp-${n}-next`);if(!a)return;const o=!s||Js(Gs(s,1));a.disabled=o||w.busy,a.classList.toggle("opacity-40",o||w.busy),a.classList.toggle("cursor-not-allowed",o||w.busy)})}function Kn(t){["cmp-a-prev","cmp-a-next","cmp-b-prev","cmp-b-next"].forEach(e=>{const n=K(e);n&&(n.disabled=t,n.classList.toggle("opacity-40",t),n.classList.toggle("pointer-events-none",t),n.classList.toggle("cursor-not-allowed",t))}),t||$n()}function bi(t,e){if(w.busy)return;const n=t==="a"?w.monthA:w.monthB,s=Gs(n,e);if(Js(s)){F("不能选择未来的月份"),$n();return}t==="a"?w.monthA=s:w.monthB=s,gi(),ta()}function gi(){const t=l("compare-insight-card"),e=l("cmp-status-tag");t&&(t.innerHTML='<p class="text-slate-400 text-xs">加载该月份对的对比数据…</p>'),e&&(e.innerText="加载中…")}function G(t,e){return t==null||t===""||isNaN(Number(t))?"—":Number(t).toFixed(e)}function hi(t,e){if(t==null||e===null||e===void 0||t===""||e==="")return null;const n=Number(t),s=Number(e);return isNaN(n)||isNaN(s)?null:n-s}function ht(t,e,n,s){const a=hi(t,e);if(a===null)return'<span class="text-slate-300">—</span>';const o=(a>0?"+":"")+a.toFixed(n);let i="text-neutral-500";return s==="down"?i=a<0?"text-emerald-600":a>0?"text-red-500":"text-neutral-400":s==="up"&&(i=a>0?"text-emerald-600":a<0?"text-red-500":"text-neutral-400"),`<span class="font-bold font-mono ${i}">${o}</span>`}function ft(t,e,n,s){return`<tr class="border-b border-neutral-100 last:border-0">
    <td class="py-2 pr-2 text-neutral-500 font-sans align-top">${t}</td>
    <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${e}</td>
    <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${n}</td>
    <td class="py-2 text-right font-mono whitespace-nowrap">${s}</td>
  </tr>`}function Xn(t){if(!t)return"—";const e=G(t.green_days,0),n=G(t.yellow_days,0),s=G(t.red_days,0);return e==="—"&&n==="—"&&s==="—"?"—":`${e} / ${n} / ${s}`}function Zn(t){if(!t)return"—";const e=G(t.workout_days,0);if(e==="—")return"—";const n=[];return t.workout_light!==null&&t.workout_light!==void 0&&n.push(`轻 ${t.workout_light}`),t.workout_medium!==null&&t.workout_medium!==void 0&&n.push(`中 ${t.workout_medium}`),t.workout_failure!==null&&t.workout_failure!==void 0&&n.push(`力竭 ${t.workout_failure}`),n.length?`${e} <span class="text-[10px] text-slate-400 font-normal">(${n.join(" / ")})</span>`:e}function Qn(){const t=l("compare-table-body");if(!t)return;const e=l("cmp-col-a"),n=l("cmp-col-b"),s=l("cmp-table-meta");e&&(e.innerText=ut(w.monthA)),n&&(n.innerText=ut(w.monthB));const a=w.metricsA,o=w.metricsB;if(!a&&!o){t.innerHTML='<tr><td colspan="4" class="py-6 text-center text-slate-400">暂无数据</td></tr>',s&&(s.innerText="");return}if(s){const d=[a,o].filter(c=>c&&c.record_days!==null&&c.record_days!==void 0).map(c=>`${c.month} ${c.record_days} 天`);s.innerText=d.join(" · ")}const i=(d,c)=>d?d[c]:null,r=[ft("体重均值 (kg)",G(i(a,"weight_avg"),1),G(i(o,"weight_avg"),1),ht(i(a,"weight_avg"),i(o,"weight_avg"),1,"down")),ft("体重净变化 (kg)",G(i(a,"weight_delta"),1),G(i(o,"weight_delta"),1),ht(i(a,"weight_delta"),i(o,"weight_delta"),1,"down")),ft("腰围均值 (cm)",G(i(a,"waist_avg"),1),G(i(o,"waist_avg"),1),ht(i(a,"waist_avg"),i(o,"waist_avg"),1,"down")),ft("腰围净变化 (cm)",G(i(a,"waist_delta"),1),G(i(o,"waist_delta"),1),ht(i(a,"waist_delta"),i(o,"waist_delta"),1,"down")),ft("平均睡眠时长 (小时)",G(i(a,"sleep_avg_hours"),1),G(i(o,"sleep_avg_hours"),1),ht(i(a,"sleep_avg_hours"),i(o,"sleep_avg_hours"),1,"up")),ft("熬夜分布 (绿/黄/红 天数)",Xn(a),Xn(o),'<span class="text-slate-300">—</span>'),ft("有运动天数",Zn(a),Zn(o),ht(i(a,"workout_days"),i(o,"workout_days"),0,"up")),ft("专注达服药天数 (天)",G(i(a,"concerta_days"),0),G(i(o,"concerta_days"),0),ht(i(a,"concerta_days"),i(o,"concerta_days"),0,null)),ft("平均夜间排水 (kg)",G(i(a,"night_loss_avg"),2),G(i(o,"night_loss_avg"),2),ht(i(a,"night_loss_avg"),i(o,"night_loss_avg"),2,"down"))];t.innerHTML=r.join("")}function ts(){const t=l("cmp-warn");if(!t)return;const e=[];[{ym:w.monthA,m:w.metricsA},{ym:w.monthB,m:w.metricsB}].forEach(({ym:n,m:s})=>{s&&(s.incomplete_month?e.push(`提示：${ut(n)}尚未过完，结论置信度低`):s.data_insufficient&&e.push(`提示：${ut(n)}数据不足，结论置信度低`))}),e.length?(t.innerHTML=e.join("<br>"),t.classList.remove("hidden")):(t.innerHTML="",t.classList.add("hidden"))}function Zs(){w.generated=!1;const t=l("compare-insight-card"),e=l("cmp-status-tag"),n=l("compare-gen-btn");t&&(t.innerHTML="<p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>"),e&&(e.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段对比综述</span>')}function Qs(t,e,n){w.generated=!0;const s=l("compare-insight-card"),a=l("cmp-status-tag"),o=l("compare-gen-btn"),i=n instanceof Date?n:new Date(n),r=String(i.getHours()).padStart(2,"0"),d=String(i.getMinutes()).padStart(2,"0");s&&(s.innerHTML=Ys(t,e)),a&&(a.innerText=`${ut(w.monthA)} vs ${ut(w.monthB)} · 生成于 ${r}:${d}`),o&&(o.innerHTML='<span class="font-mono">重新生成阶段对比</span>')}async function ta(){w.monthA||(w.monthA=Te(-1)),w.monthB||(w.monthB=Te(-2)),$n();const t=++w.loadSeq,e=w.monthA,n=w.monthB,s=-new Date().getTimezoneOffset();try{const a=await M.checkComparePeriod(e,n,s);if(t!==w.loadSeq)return;const o=a&&a.data;if(!o)throw new Error("加载失败");w.metricsA=o.metrics_a||null,w.metricsB=o.metrics_b||null,Qn(),ts(),o.exists&&o.insight?Qs(o.insight.content||"",o.insight.thinking||"",o.insight.created_at):Zs()}catch(a){if(t!==w.loadSeq)return;w.metricsA=null,w.metricsB=null,Qn(),ts();const o=a instanceof Error?a.message:String(a),i=l("compare-insight-card");i&&(i.innerHTML=`<p class="text-red-500 text-xs">加载对比数据失败：${T(o)}</p>`);const r=l("cmp-status-tag");r&&(r.innerText="加载失败"),F("加载对比数据失败："+o)}}async function vi(){if(ce){ce.abort();return}if(w.busy)return;const t=l("compare-insight-card"),e=l("cmp-status-tag"),n=l("compare-gen-btn");if(!t||!n||!e||w.generated&&!await at(`「${ut(w.monthA)} vs ${ut(w.monthB)}」已生成过阶段对比综述，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成阶段对比",confirmText:"确定重新生成",danger:!1}))return;const s=n.className;w.busy=!0,n.className="w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",n.innerHTML="<span>停止生成</span>",Kn(!0),w.loadSeq++,t.classList.add("typing-cursor"),e.innerText="AI 正在推导两月差异...";const a=Ws(t),o=-new Date().getTimezoneOffset(),i=new AbortController;ce=i;let r={aborted:!1,thinking:"",content:"",hasError:!1};try{r=await _n({url:`/api/v1/insights/compare/stream?month_a=${w.monthA}&month_b=${w.monthB}&tz_offset=${o}`,signal:i.signal,onUpdate:a,onDone:({thinking:d,content:c,hasError:u})=>{u?e.innerText="分析失败":c||d?Qs(c,d,new Date):(t.innerHTML='<p class="text-slate-400">未能获取到对比内容，请检查后端大模型连接。</p>',e.innerText="暂无对比内容")},onError:(d,{thinking:c,content:u})=>{if(u||c)a({thinking:c,content:u+`

> **注意**: 网络连接已完成或阶段传输结束`}),e.innerText="分析完成(部分)";else if(d instanceof TypeError)t.innerHTML=`<p class="text-red-500">无法连接本地服务（${T(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,e.innerText="本地服务未连接";else{const m=d instanceof Error?d.message:String(d);t.innerHTML=`<p class="text-red-500">连接 AI 对比服务失败: ${T(m)}</p>`,e.innerText="生成异常"}}}),r.aborted&&(r.content||r.thinking?(a({thinking:r.thinking,content:r.content+`

> **已手动停止生成**`}),e.innerText="已手动停止"):(Zs(),e.innerText="已取消生成"))}finally{ce===i&&(ce=null),t.classList.remove("typing-cursor"),w.busy=!1,Kn(!1),n.className=s,!r.aborted&&!r.hasError&&(r.content||r.thinking)||w.generated?n.innerHTML='<span class="font-mono">重新生成阶段对比</span>':n.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段对比综述</span>'}}const f={items:[],beforeId:0,hasMore:!1,loading:!1,rangeDays:0,compareMode:!1,q:"",error:"",expanded:{},details:{},manageMode:!1,selected:{}};let ea=()=>{},ze=null,Vt=null,Xe=!1,es=!1;function yi(t={}){if(typeof t.onDeleted=="function"&&(ea=t.onDeleted),es)return;const e=l("view-history");if(!e)return;es=!0,e.addEventListener("click",a=>{const o=D(a.target,"[data-action]");if(!o)return;switch(o.dataset.action){case"back-insight":bt("insight");break;case"history-manage":Si();break;case"history-filter":{const r=Number(o.dataset.days);Number.isNaN(r)||ki(r);break}case"history-filter-compare":Ti();break;case"history-load-more":Ie(!1);break;case"history-select-all":$i();break;case"history-delete":Mi();break;case"history-item-click":{const r=Number(o.dataset.id);r>0&&Ei(r);break}}});const n=h("history-search");n==null||n.addEventListener("input",Li);const s=l("history-list");if(s){let a=-1,o=0,i=0;const r=()=>{Vt&&(clearTimeout(Vt),Vt=null),a=-1};s.addEventListener("pointerdown",d=>{if(f.manageMode)return;const c=D(d.target,"[data-hp-id]");if(!c)return;const u=Number(c.dataset.hpId);u&&(r(),Xe=!1,a=d.pointerId,o=d.clientX,i=d.clientY,Vt=setTimeout(()=>{Vt=null,Xe=!0,f.manageMode=!0,f.selected={[u]:!0},sn(),dt()},500))}),s.addEventListener("pointermove",d=>{d.pointerId!==a||!Vt||Math.hypot(d.clientX-o,d.clientY-i)>10&&r()}),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r),s.addEventListener("contextmenu",d=>{D(d.target,"[data-hp-id]")&&d.preventDefault()})}}function wi(){f.rangeDays=0,f.compareMode=!1,f.q="",nn();const t=h("history-search");t&&(t.value=""),Mn(0),bt("history"),Ie(!0)}function ki(t){f.rangeDays=t,f.compareMode=!1,nn(),Mn(t),et.state.currentTab==="history"&&Ie(!0)}function Ti(){f.rangeDays=0,f.compareMode=!0,nn(),Mn("compare"),et.state.currentTab==="history"&&Ie(!0)}function Mn(t){[0,7,30,60].forEach(n=>{const s=l(`hfilter-${n}`);s&&(s.className=n===t?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all")});const e=l("hfilter-compare");e&&(e.className=t==="compare"?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all")}function Li(){ze&&clearTimeout(ze),ze=setTimeout(()=>{var t;ze=null,nn(),f.q=(((t=h("history-search"))==null?void 0:t.value)||"").trim(),Ie(!0)},300)}async function Ie(t){if(f.loading)return;f.loading=!0,t&&(f.items=[],f.beforeId=0,f.hasMore=!1,f.error="",f.expanded={},f.details={}),dt();const e={limit:"10"};f.beforeId>0&&(e.before_id=String(f.beforeId)),f.compareMode?e.scope="compare":f.rangeDays>0&&(e.range_days=String(f.rangeDays)),f.q&&(e.q=f.q);try{const n=await M.getInsightHistory(e),s=n&&n.data||{},a=s.items||[];f.items=f.items.concat(a),f.hasMore=!!s.has_more,a.length>0&&(f.beforeId=a[a.length-1].id)}catch(n){f.error=n instanceof Error?n.message:String(n)}finally{f.loading=!1,dt()}}function dt(){const t=l("history-list"),e=l("history-loadmore"),n=l("history-manage-btn");if(t){if(!f.items.length){f.loading?t.innerHTML='<p class="text-center text-xs text-slate-400 py-8">加载中…</p>':f.error?t.innerHTML=`<p class="text-center text-xs text-red-500 py-8">加载失败：${T(f.error)}</p>`:t.innerHTML='<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>',e&&e.classList.add("hidden"),n&&n.classList.toggle("hidden",!f.manageMode),gn();return}t.innerHTML=f.items.map(s=>{const a=!!f.expanded[s.id],o=!!f.selected[s.id],i=new Date(s.created_at),r=isNaN(i.getTime())?"":`${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")} ${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`,d=(s.content||"").replace(/[#*`>|\-]/g," ").replace(/\s+/g," ").trim().slice(0,90)||"（无正文）",c=s.scope==="compare",u=s.meta||{},m=u.month_a&&u.month_b?`${T(u.month_a)} vs ${T(u.month_b)}`:`${T(s.start_date)} ~ ${T(s.end_date)}`,g=c?m:`${T(s.start_date)} ~ ${T(s.end_date)}`,x=c?"阶段对比":`近 ${s.range_days} 天`,y=`
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-bold text-neutral-900 font-mono">${g}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600 font-mono font-medium">${x}</span>
      </div>
      <p class="text-xs text-neutral-500 leading-relaxed ${a&&!f.manageMode?"":"line-clamp-2"}">${T(d)}</p>
      <div class="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100 font-mono text-[10px]">
        <span class="text-neutral-400">${r}${s.model?" · "+T(s.model):""}</span>
        ${f.manageMode?"":c?'<span class="text-neutral-900 font-medium hover:underline">查看对比 ›</span>':`<span class="text-neutral-900 font-medium hover:underline">${a?"收起 ▴":"展开 ▾"}</span>`}
      </div>`;if(f.manageMode)return`
        <div data-hp-id="${s.id}" data-action="history-item-click" data-id="${s.id}" class="cursor-pointer select-none flex items-start space-x-3 ht-card transition-colors ${o?"border-neutral-900 ring-1 ring-neutral-900":""}">
          <div class="mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${o?"bg-neutral-900 border-neutral-900 text-white":"border-neutral-300 bg-white"}">
            ${o?'<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>':""}
          </div>
          <div class="flex-1 min-w-0">${y}</div>
        </div>`;let S="";if(a){const _=f.details[s.id];if(!_)S='<p class="text-[11px] font-mono text-neutral-400 mt-2">加载全文…</p>';else{const b=(_.thinking||"").trim();S=`${b?`
          <details class="mt-2.5 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-600">
            <summary class="cursor-pointer font-mono font-medium text-neutral-700 select-none hover:text-neutral-900 transition-colors">思维链推导 (${b.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600 text-[11px]">${T(b)}</div>
          </details>`:""}
          <div class="mt-2 text-xs text-neutral-700 leading-relaxed markdown-body">${Me(_.content||"")}</div>`}}return`
      <div data-hp-id="${s.id}" class="ht-card">
        <div class="cursor-pointer select-none" data-action="history-item-click" data-id="${s.id}">${y}</div>
        ${S}
      </div>`}).join(""),e&&e.classList.toggle("hidden",!f.hasMore),n&&n.classList.toggle("hidden",!f.items.length&&!f.manageMode),gn()}}function Ei(t){if(Xe){Xe=!1;return}if(f.manageMode){_i(t);return}const e=f.items.find(n=>n.id===t);if(e&&e.scope==="compare"){const n=e.meta||{},s=n.month_a||(e.start_date||"").slice(0,7),a=n.month_b||(e.end_date||"").slice(0,7);if(s&&a){mi(s,a);return}}Ci(t)}function Si(){f.manageMode=!f.manageMode,f.manageMode||(f.selected={}),sn(),dt()}function nn(){f.manageMode&&(f.manageMode=!1,f.selected={},sn())}function sn(){const t=l("history-manage-btn");t&&(t.innerText=f.manageMode?"完成":"管理",t.className=f.manageMode?"text-xs font-mono font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-lg transition-colors":"text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition-colors"),gn()}function _i(t){f.selected[t]?delete f.selected[t]:f.selected[t]=!0,dt()}function $i(){const t=f.items.map(n=>n.id);if(t.filter(n=>f.selected[n]).length===t.length)f.selected={};else{const n={};t.forEach(s=>{n[s]=!0}),f.selected=n}dt()}function gn(){const t=l("history-delete-bar");if(!t)return;const e=f.manageMode&&f.items.length>0;if(t.classList.toggle("hidden",!e),!e)return;const n=f.items.map(r=>r.id),s=n.filter(r=>f.selected[r]).length,a=l("history-selected-count");a&&(a.innerText=`已选 ${s} 项`);const o=l("history-selectall-btn");o&&(o.innerText=n.length>0&&s===n.length?"取消全选":"全选");const i=K("history-delete-btn");i&&(i.disabled=s===0,i.innerText=s>0?`删除所选 (${s})`:"删除所选",i.className=s>0?"text-xs font-mono font-medium bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg transition-colors":"text-xs font-mono font-medium bg-neutral-700 text-neutral-400 px-3.5 py-1.5 rounded-lg cursor-not-allowed transition-colors")}async function Mi(){const t=f.items.map(n=>n.id).filter(n=>f.selected[n]);if(!(!t.length||!await at(`确定删除所选 ${t.length} 条洞察存档？删除后不可恢复。`,{title:"删除洞察存档",confirmText:"确定删除"})))try{await M.batchDeleteInsights(t),f.items=f.items.filter(n=>!f.selected[n.id]),Object.keys(f.selected).forEach(n=>{const s=Number(n);delete f.expanded[s],delete f.details[s]}),f.selected={},f.items.length||(f.manageMode=!1),sn(),dt(),ea()}catch(n){const s=n instanceof Error?n.message:String(n);F("删除失败："+s)}}async function Ci(t){if(f.expanded[t]){f.expanded[t]=!1,dt();return}if(f.expanded[t]=!0,dt(),!f.details[t]){try{const e=await M.getInsightDetail(t);f.details[t]=e&&e.data?e.data:{content:"加载失败",thinking:""}}catch(e){const n=e instanceof Error?e.message:String(e);f.details[t]={content:"加载失败："+n,thinking:""}}dt()}}let te=30,tt=N(new Date),It="today",Ze=!1,hn=0,ue=null,ns=!1;const ss="ht-seg-btn active",as="ht-seg-btn",Ii="<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>";function Di(t){t.insertAdjacentHTML("beforeend",ui),Hi(),yi({onDeleted:ae}),pi()}function Hi(){if(ns)return;const t=l("view-insight");if(!t)return;ns=!0,t.addEventListener("click",s=>{const a=D(s.target,"[data-action]");if(!a)return;switch(a.dataset.action){case"open-compare":Ks();break;case"open-history":wi();break;case"insight-days":{const i=Number(a.dataset.days);(i===7||i===30||i===60)&&ji(i);break}case"insight-end-mode":{const i=a.dataset.mode;(i==="today"||i==="yesterday")&&Ai(i);break}case"insight-generate":Ri();break}});const e=h("insight-end-date");e==null||e.addEventListener("change",s=>{const a=s.currentTarget;a instanceof HTMLInputElement&&Ni(a.value)});const n=()=>{document.visibilityState==="visible"&&et.state.currentTab==="insight"&&ae()};document.addEventListener("visibilitychange",n),window.addEventListener("pageshow",n)}function Bi(){ae()}function ji(t){te=t,["7","30","60"].forEach(e=>{const n=l(`pill-${e}`);n&&(n.className=parseInt(e,10)===t?"ht-seg-btn active":"ht-seg-btn")}),ee(),ae()}function Cn(){return It==="yesterday"?Ht(N(new Date),-1):It==="custom"&&tt?tt:N(new Date)}function Le(){const t=N(new Date),e=l("endpill-today"),n=l("endpill-yesterday");e&&(e.className=It==="today"?ss:as),n&&(n.className=It==="yesterday"?ss:as);const s=h("insight-end-date");s&&(s.max=t,s.value=tt||t,s.classList.toggle("border-neutral-900",It==="custom"))}function Ai(t){It=t,tt=Cn(),Le(),ee(),ae()}function Ni(t){const e=N(new Date);if(!t||t>e){Le(),F("截止日不能晚于今天");return}It="custom",tt=t,Le(),ee(),ae()}function os(t){["7","30","60"].forEach(n=>{const s=K(`pill-${n}`);s&&(s.disabled=t,s.classList.toggle("opacity-50",t),s.classList.toggle("cursor-not-allowed",t),s.classList.toggle("pointer-events-none",t))}),["endpill-today","endpill-yesterday"].forEach(n=>{const s=K(n);s&&(s.disabled=t,s.classList.toggle("pointer-events-none",t),s.classList.toggle("opacity-50",t))});const e=h("insight-end-date");e&&(e.disabled=t,e.classList.toggle("opacity-50",t))}async function Ri(){const t=l("insight-content"),e=l("insight-status-tag"),n=K("btn-generate-insight");if(!t||!e||!n)return;if(ue){ue.abort();return}if(tt=Cn(),Le(),Ze&&!await at(`截至 ${tt} 的近 ${te} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成洞察",confirmText:"确定重新生成",danger:!1}))return;const s=n.className;n.className="w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",n.innerHTML="<span>停止生成</span>",hn++,os(!0),t.classList.add("typing-cursor"),e.innerText="AI 正在推导生理因果...";const a=Ws(t),o=-new Date().getTimezoneOffset(),i=new AbortController;ue=i;let r={aborted:!1,thinking:"",content:"",hasError:!1};try{r=await _n({url:`/api/v1/insights/stream?days=${te}&end_date=${tt}&tz_offset=${o}`,signal:i.signal,onUpdate:a,onDone:({thinking:d,content:c,hasError:u})=>{u?e.innerText="分析失败":c||d?na(c,d,new Date):(t.innerHTML='<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>',e.innerText="暂无分析内容")},onError:(d,{thinking:c,content:u})=>{if(u||c)a({thinking:c,content:u+`

> **注意**: 网络连接已完成或阶段传输结束`}),e.innerText="分析完成(部分)";else if(d instanceof TypeError)t.innerHTML=`<p class="text-red-500">无法连接本地服务（${T(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,e.innerText="本地服务未连接";else{const m=d instanceof Error?d.message:String(d);t.innerHTML=`<p class="text-red-500">连接 AI 洞察服务失败: ${T(m)}</p>`,e.innerText="生成异常"}}}),r.aborted&&(r.content||r.thinking?(a({thinking:r.thinking,content:r.content+`

> **已手动停止生成**`}),e.innerText="已手动停止"):(ee(),e.innerText="已取消生成"))}finally{ue===i&&(ue=null),t.classList.remove("typing-cursor"),os(!1),n.className=s,!r.aborted&&!r.hasError&&(r.content||r.thinking)||Ze?n.innerHTML='<span class="font-mono">重新生成</span>':n.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段深度洞察</span>'}}function ee(){Ze=!1;const t=l("insight-content"),e=l("insight-status-tag"),n=l("btn-generate-insight");t&&(t.innerHTML=Ii),e&&(e.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段深度洞察</span>')}function na(t,e,n){Ze=!0;const s=l("insight-content"),a=l("insight-status-tag"),o=l("btn-generate-insight"),i=n instanceof Date?n:new Date(n),r=String(i.getHours()).padStart(2,"0"),d=String(i.getMinutes()).padStart(2,"0");s&&(s.innerHTML=Ys(t,e)),a&&(a.innerHTML=`近 ${te} 天（截至 ${tt}）· 生成于 ${r}:${d} · <button type="button" data-action="open-history" class="text-blue-600 cursor-pointer font-bold">点击查看</button>`),o&&(o.innerHTML='<span class="font-mono">重新生成</span>')}async function ae(){const t=l("insight-content"),e=l("insight-status-tag"),n=l("btn-generate-insight");if(!e||!n||!t)return;tt=Cn(),Le();const s=te,a=tt,o=++hn,i=()=>o!==hn||s!==te||a!==tt,r=-new Date().getTimezoneOffset();try{const d=await M.checkInsightPeriod(s,a,r);if(i())return;const c=d&&d.data;if(!c||!c.exists||!c.insight){ee();return}const u=c.insight;na(u.content||"",u.thinking||"",u.created_at)}catch{if(i())return;ee()}}const Pi=`      <!-- 4. 睡前小结 (Evening View) -->
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
`,oe=6,A={summaries:[],dateFilter:"all",scoreFilter:"all",visible:oe},Dt={W:84,drag:null,suppressClick:0};let ct={bandOf:()=>({range:[7,8],label:"还不错",tone:"indigo"}),toneOf:()=>({chip:"text-indigo-700 bg-indigo-50 border-indigo-200",dot:"#6366f1",band:""}),todayStr:()=>"",getCurrentDate:()=>"",onDeletedCurrentDate:()=>{},openPhoto:()=>{}},is=!1;function Oi(t){if(ct={...ct,...t},is)return;const e=l("ev-history-list");e&&(is=!0,e.addEventListener("click",n=>{const s=D(n.target,"[data-action]");if(s){const u=s.dataset.action;if(u==="ev-open-photo"){n.stopPropagation(),s instanceof HTMLImageElement&&s.getAttribute("src")&&ct.openPhoto(s.src,s.dataset.alt||s.alt||"小结图片");return}if(u==="ev-delete"){n.stopPropagation();const m=s.dataset.date;m&&tr(m);return}if(u==="ev-copy"){n.stopPropagation();const m=s.dataset.date;m&&Ji(m);return}}const a=D(n.target,".evo-entry-head");if(!a||Date.now()-Dt.suppressClick<320)return;const o=a.closest(".evo-swipe");if(o&&o.classList.contains("open")){o.classList.remove("open");return}oa();const i=a.closest(".ht-card")||a.parentElement;if(!i)return;const r=i.querySelector(".evo-collapsible"),d=a.querySelector(".evo-entry-arrow");if(!r)return;const c=!r.classList.contains("open");r.classList.toggle("open",c),d instanceof HTMLElement&&(d.style.transform=c?"rotate(180deg)":"rotate(0deg)")}))}function sa(t){const e=["周日","周一","周二","周三","周四","周五","周六"],n=new Date(t+"T00:00:00");return isNaN(n.getTime())?"":e[n.getDay()]}function zi(t){const e=new Date(ct.todayStr()+"T00:00:00"),n=new Date(t+"T00:00:00");return Math.round((e.getTime()-n.getTime())/864e5)}function ge(t){return t?t.slice(5):""}function rs(t){return t?t.slice(0,7):""}function Fi(t){const e=t.split("-");return e[0]+" 年 "+Number(e[1])+" 月"}async function aa(){try{const t=await M.getEveningSummaries();A.summaries=t&&t.data&&t.data.items||[]}catch(t){const e=t instanceof Error?t.message:String(t);F("加载往期小结失败："+e),A.summaries=[]}A.visible=Math.max(A.visible,oe),ie()}function an(){document.querySelectorAll("#ev-history-list .evo-score-chip").forEach(t=>{if(!(t instanceof HTMLElement))return;const e=Number(t.dataset.score)||7,n=ct.bandOf(e);t.className="evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border "+ct.toneOf(n.tone).chip})}function Ui(t){document.querySelectorAll("#ev-filter-date button").forEach(e=>e.classList.remove("active")),t.classList.add("active"),A.dateFilter=t.dataset.val||"all",A.visible=oe,ie()}function qi(t){document.querySelectorAll("#ev-filter-score button").forEach(e=>e.classList.remove("active")),t.classList.add("active"),A.scoreFilter=t.dataset.val||"all",A.visible=oe,ie()}function Vi(){document.querySelectorAll("#ev-filter-date button, #ev-filter-score button").forEach(t=>{t.classList.toggle("active",t instanceof HTMLElement&&t.dataset.val==="all")}),A.dateFilter="all",A.scoreFilter="all",A.visible=oe,ie()}function Wi(){A.visible+=oe,ie()}function Yi(){return A.summaries.filter(t=>{if(A.dateFilter!=="all"&&zi(t.record_date)>Number(A.dateFilter)-1)return!1;const e=t.score||0;return!(A.scoreFilter==="high"&&e<9||A.scoreFilter==="good"&&(e<7||e>8)||A.scoreFilter==="mid"&&(e<5||e>6)||A.scoreFilter==="low"&&e>4)})}function Gi(t){const e=(t.done_items||[]).filter(s=>s&&s.trim()),n=[`${t.record_date} ${sa(t.record_date)} · ${t.score} 分`,"","【完成事项】"];return e.length?e.forEach((s,a)=>n.push(`${a+1}. ${s}`)):n.push("（未填写）"),n.push("","【当时的感想】",t.note_text&&t.note_text.trim()?t.note_text:"（未填写）"),n.join(`
`)}async function Ji(t){const e=(A.summaries||[]).find(s=>s.record_date===t);if(!e)return;const n=await wa(Gi(e));F(n?"已复制 "+ge(t)+" 的小结":"复制失败，请长按文字手动复制")}function Ki(t,e){const n=t.score!=null&&t.score>0?t.score:7,s=ct.toneOf(ct.bandOf(n).tone),a=ge(t.record_date),o=t.photo_id?`<img src="/api/v1/evening/photo/${t.photo_id}" alt="${T(a)}" data-action="ev-open-photo" data-alt="${T(a)} 小结图片" class="rounded-lg object-cover shrink-0 border border-neutral-200 bg-neutral-100 cursor-zoom-in" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">`:'<span class="rounded-lg shrink-0 border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-400 font-mono font-bold" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">无图</span>',i=(t.done_items||[]).filter(u=>u&&u.trim()),r=i.length?i[0]:"（未填完成事项）",d=[0,1,2].map(u=>{const m=t.done_items&&t.done_items[u]||"";return m&&m.trim()?`<li class="flex items-start space-x-1.5 text-xs text-neutral-700 leading-relaxed"><span class="text-neutral-400 font-mono text-[10px] mt-0.5">${u+1}.</span><span>${T(m)}</span></li>`:`<li class="flex items-start space-x-1.5 text-xs text-neutral-300 leading-relaxed"><span class="font-mono text-[10px] mt-0.5">${u+1}.</span><span>未记录</span></li>`}).join(""),c=T(t.record_date);return`
  <div class="evo-tl-item ev-rise" style="animation-delay:${Math.min(e,7)*40}ms">
    <span class="evo-tl-node"></span><span class="evo-tl-line"></span>
    <div class="evo-swipe" data-date="${c}">
      <div class="evo-swipe-action">
        <button type="button" class="evo-swipe-del" data-action="ev-delete" data-date="${c}">
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
                  <span class="text-[10px] text-neutral-400 font-mono">${sa(t.record_date)}</span>
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
                  <button type="button" class="evo-copy-btn" data-action="ev-copy" data-date="${c}" aria-label="复制这天的记录">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <span>复制</span>
                  </button>
                </div>
                <ol class="space-y-1 evo-selectable">${d}</ol>
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
  </div>`}function ie(){const t=Yi(),e=t.slice(0,A.visible),n=l("ev-history-list"),s=l("ev-history-empty"),a=l("ev-load-more"),o=l("ev-load-done"),i=l("ev-filter-reset"),r=l("ev-filter-count");r&&(r.innerText=String(t.length));const d=l("ev-history-total");if(d&&(d.innerText=A.summaries.length+" 篇"),i&&i.classList.toggle("hidden",A.dateFilter==="all"&&A.scoreFilter==="all"),!n)return;if(!t.length){n.innerHTML="",s==null||s.classList.remove("hidden"),a==null||a.classList.add("hidden"),o==null||o.classList.add("hidden");return}s==null||s.classList.add("hidden");let c="",u="";e.forEach((g,x)=>{const y=rs(g.record_date);if(y!==u){const S=t.filter(_=>rs(_.record_date)===y).length;c+=`<div class="flex items-center space-x-2 pt-2 pb-2.5 pl-6 font-mono text-[10px]">
                 <span class="font-bold text-neutral-500 tracking-wider">${Fi(y)}</span>
                 <span class="flex-1 h-px bg-neutral-200"></span>
                 <span class="text-neutral-400 tabular-nums">${S} 篇</span>
               </div>`,u=y}c+=Ki(g,x)}),n.innerHTML=c,Xi();const m=t.length-e.length;if(m>0){a==null||a.classList.remove("hidden"),o==null||o.classList.add("hidden");const g=l("ev-remain-count");g&&(g.innerText=String(m))}else a==null||a.classList.add("hidden"),o==null||o.classList.remove("hidden")}function Xi(){document.querySelectorAll("#ev-history-list .evo-swipe-panel").forEach(t=>{t instanceof HTMLElement&&(t.addEventListener("pointerdown",Zi),t.addEventListener("pointermove",Qi),t.addEventListener("pointerup",ls),t.addEventListener("pointercancel",ls))})}function Zi(t){if(!(t instanceof PointerEvent))return;const e=t.currentTarget;if(!(e instanceof HTMLElement))return;const n=e.closest(".evo-swipe");if(!(n instanceof HTMLElement)||n.classList.contains("removing")||t.pointerType==="mouse"&&t.button!==0)return;const s=window.getSelection&&window.getSelection();s&&!s.isCollapsed&&s.anchorNode&&e.contains(s.anchorNode)||(oa(n),Dt.drag={panel:e,swipe:n,id:t.pointerId,x0:t.clientX,y0:t.clientY,axis:null,base:n.classList.contains("open")?-84:0,off:0})}function Qi(t){if(!(t instanceof PointerEvent))return;const e=Dt.drag;if(!e||t.pointerId!==e.id)return;const n=t.clientX-e.x0,s=t.clientY-e.y0;if(!e.axis){if(Math.abs(n)<6&&Math.abs(s)<6)return;if(e.axis=Math.abs(n)>Math.abs(s)?"x":"y",e.axis==="x"){e.panel.classList.add("dragging");try{e.panel.setPointerCapture(t.pointerId)}catch{}}}if(e.axis!=="x")return;let a=e.base+n;a>0?a*=.28:a<-84&&(a=-84-(Math.abs(a)-Dt.W)*.25),e.off=a,e.panel.style.transform="translateX("+a+"px)",t.cancelable&&t.preventDefault()}function ls(t){if(!(t instanceof PointerEvent))return;const e=Dt.drag;if(!e||t.pointerId!==e.id)return;const n=e.panel,s=e.swipe;n.classList.remove("dragging"),n.style.transform="",e.axis==="x"&&(s.classList.toggle("open",e.off<-42),Dt.suppressClick=Date.now()),Dt.drag=null}function oa(t){document.querySelectorAll("#ev-history-list .evo-swipe.open").forEach(e=>{e!==t&&e.classList.remove("open")})}async function tr(t){const e=A.summaries.find(o=>o.record_date===t),n=await at(`${ge(t)}${e?" · "+e.score+" 分":""}，删除后不可恢复。`,{title:"删除这篇小结？",confirmText:"删除"}),s=document.querySelector(`.evo-swipe[data-date="${t}"]`);if(!n){s&&s.classList.remove("open");return}try{await M.deleteEveningSummary(t)}catch(o){const i=o instanceof Error?o.message:String(o);F("删除失败："+i),s&&s.classList.remove("open");return}const a=()=>{A.summaries=A.summaries.filter(o=>o.record_date!==t),ie(),ct.getCurrentDate()===t&&ct.onDeletedCurrentDate()};s?(s.classList.add("removing"),setTimeout(()=>{a(),F("已删除 "+ge(t)+" 的小结")},260)):(a(),F("已删除 "+ge(t)+" 的小结"))}const Ft=[{range:[1,2],label:"很低落",tone:"rose"},{range:[3,4],label:"有点钝",tone:"amber"},{range:[5,6],label:"平平",tone:"emerald"},{range:[7,8],label:"还不错，稳住了节奏",tone:"indigo"},{range:[9,10],label:"满分的一天",tone:"violet"}],ds={rose:{dot:"#f43f5e",chip:"text-rose-700 bg-rose-50 border-rose-200",band:"bg-rose-50 text-rose-700 border border-rose-200"},amber:{dot:"#f59e0b",chip:"text-amber-700 bg-amber-50 border-amber-200",band:"bg-amber-50 text-amber-700 border border-amber-200"},emerald:{dot:"#10b981",chip:"text-emerald-700 bg-emerald-50 border-emerald-200",band:"bg-emerald-50 text-emerald-700 border border-emerald-200"},indigo:{dot:"#6366f1",chip:"text-indigo-700 bg-indigo-50 border-indigo-200",band:"bg-neutral-50 text-neutral-800 border border-neutral-200"},violet:{dot:"#8b5cf6",chip:"text-violet-700 bg-violet-50 border-violet-200",band:"bg-violet-50 text-violet-700 border border-violet-200"}},cn=["rose","amber","emerald","indigo","violet"];let rt=null;const k={date:"",photoId:null,pendingBlob:null,dirty:!1,insightBusy:!1,insightRange:7};let Ee=0,$t=null,ne=!1,cs=!1;function er(t){t.insertAdjacentHTML("beforeend",Pi),Oi({bandOf:ia,toneOf:In,todayStr:Pt,getCurrentDate:()=>k.date,onDeletedCurrentDate:()=>{k.dirty=!1,k.date=Pt();const e=h("summary-date");e&&(e.value=k.date),Dn()},openPhoto:ca}),sr()}function nr(){or()}function sr(){var e,n,s,a,o,i;if(cs)return;const t=l("view-evening");t&&(cs=!0,t.addEventListener("click",r=>{const d=D(r.target,"[data-action]");if(!d)return;switch(d.dataset.action){case"ev-today":rr();break;case"ev-open-photo":{if(d.id!=="photo-preview")break;const u=Ot("photo-preview"),m=u==null?void 0:u.getAttribute("src");u&&m&&ca(u.src,"今日图片");break}case"ev-remove-photo":ur();break;case"ev-toggle-bands":pr();break;case"ev-reset-bands":xr();break;case"ev-save-bands":br();break;case"ev-cycle-tone":{const u=Number(d.dataset.idx);Number.isNaN(u)||mr(u);break}case"ev-save":gr();break;case"ev-insight-range":hr(d);break;case"ev-insight-generate":kr();break;case"ev-insight-stop":_e();break;case"ev-insight-reset":Tr();break;case"ev-toggle-thinking":Lr();break;case"ev-filter-date":Ui(d);break;case"ev-filter-score":qi(d);break;case"ev-filter-reset":Vi();break;case"ev-load-more":Wi();break}}),(e=h("summary-date"))==null||e.addEventListener("change",r=>{r.currentTarget instanceof HTMLInputElement&&lr(r.currentTarget.value)}),(n=h("photo-input"))==null||n.addEventListener("change",dr),(s=se("note-text"))==null||s.addEventListener("input",r=>{const d=l("note-len");r.currentTarget instanceof HTMLTextAreaElement&&d&&(d.innerText=String(r.currentTarget.value.length)),k.dirty=!0}),["done-1","done-2","done-3"].forEach(r=>{var d;(d=h(r))==null||d.addEventListener("input",()=>{la(),k.dirty=!0})}),(a=h("score-range"))==null||a.addEventListener("input",r=>{r.currentTarget instanceof HTMLInputElement&&(vn(r.currentTarget.value),k.dirty=!0)}),(o=l("band-rows"))==null||o.addEventListener("input",r=>{const d=D(r.target,'[data-action="ev-band-label"]');if(d instanceof HTMLInputElement){const c=Number(d.dataset.idx);Number.isNaN(c)||fr(c,d.value)}}),(i=l("ev-photo-viewer"))==null||i.addEventListener("click",()=>{Fe()}),window.addEventListener("popstate",()=>{ne&&(ne=!1,Fe(!0))}),document.addEventListener("keydown",r=>{r.key==="Escape"&&Fe()}))}function ia(t){const e=rt||Ft;return e.find(n=>t>=n.range[0]&&t<=n.range[1])||e[e.length-1]}function In(t){return ds[t]||ds.indigo}function Pt(){const t=new Date,e=n=>String(n).padStart(2,"0");return t.getFullYear()+"-"+e(t.getMonth()+1)+"-"+e(t.getDate())}function fe(t){return t?t.slice(5):""}function ar(t){return String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function or(){k.date||(k.date=Pt());const t=h("summary-date");t&&(t.value=k.date),await Promise.all([ir(),Dn()]),await aa()}async function ir(){var t;if(rt){Se();return}try{const e=await M.getConfig(),n=e&&e.data&&e.data.summary_score_bands;Array.isArray(n)&&n.length&&(rt=n.map(s=>({range:[s.range[0],s.range[1]],label:s.label,tone:s.tone})))}catch{}rt||(rt=Ft.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone}))),Se(),re(Number((t=h("score-range"))==null?void 0:t.value)||7)}async function Dn(){const t=k.date,e=++Ee,n=()=>e!==Ee||t!==k.date;k.dirty=!1,da();try{const s=await M.getEveningSummary(t);if(n())return;const a=s?s.data:null,o=h("done-1"),i=h("done-2"),r=h("done-3"),d=se("note-text"),c=l("note-len");a?(o&&(o.value=a.done_items&&a.done_items[0]||""),i&&(i.value=a.done_items&&a.done_items[1]||""),r&&(r.value=a.done_items&&a.done_items[2]||""),d&&(d.value=a.note_text||""),c&&(c.innerText=String((a.note_text||"").length)),vn(a.score||7),a.photo_id&&(k.photoId=a.photo_id,Hn(`/api/v1/evening/photo/${a.photo_id}`,""))):(o&&(o.value=""),i&&(i.value=""),r&&(r.value=""),d&&(d.value=""),c&&(c.innerText="0"),vn(7)),la(),k.dirty=!1}catch(s){if(n())return;const a=s instanceof Error?s.message:String(s);F("读取该日小结失败："+a)}n()||yr(t,e)}async function ra(t){if(!t||t===k.date)return!1;if(k.dirty&&!await at(`当前日期的小结有未保存改动，切换到 ${t} 后未保存内容将会丢失，确定切换吗？`,{title:"未保存改动",confirmText:"仍然切换",danger:!1})){const s=h("summary-date");return s&&(s.value=k.date),!1}k.date=t;const e=h("summary-date");return e&&(e.value=t),await Dn(),!0}async function rr(){const t=Pt();if(k.date===t){F("已在今日");return}await ra(t)&&F("已回到今日")}async function lr(t){t&&await ra(t)}function la(){let t=0;[1,2,3].forEach(n=>{const s=h("done-"+n),a=!!(s&&s.value.trim()),o=l("seq-"+n);o&&(a?(o.classList.contains("filled")||(o.classList.add("filled","ev-pop"),setTimeout(()=>o.classList.remove("ev-pop"),340)),t++):o.classList.remove("filled"))});const e=l("done-count");e&&(e.innerText=t+" / 3",e.className="font-mono text-[10px] font-bold tabular-nums transition-colors "+(t===0?"text-neutral-400":"text-neutral-900"))}function Hn(t,e){var a,o;const n=Ot("photo-preview");n&&(t?n.src=t:n.removeAttribute("src")),(a=l("photo-empty"))==null||a.classList.add("hidden"),(o=l("photo-filled"))==null||o.classList.remove("hidden");const s=l("photo-meta");s&&(s.innerText=e||"")}function da(){var s,a;k.photoId=null,k.pendingBlob=null;const t=h("photo-input");t&&(t.value="");const e=Ot("photo-preview");e&&e.removeAttribute("src"),(s=l("photo-filled"))==null||s.classList.add("hidden"),(a=l("photo-empty"))==null||a.classList.remove("hidden");const n=l("photo-meta");n&&(n.innerText="")}function ca(t,e){if(!t)return;const n=l("ev-photo-viewer"),s=Ot("ev-photo-viewer-img");!n||!s||(s.src=t,s.alt=e||"小结图片",n.classList.contains("hidden")&&(n.classList.remove("hidden"),ne||(history.pushState({evPhoto:1},""),ne=!0)))}function Fe(t){const e=l("ev-photo-viewer"),n=Ot("ev-photo-viewer-img");!e||e.classList.contains("hidden")||(e.classList.add("hidden"),n==null||n.removeAttribute("src"),ne&&!t&&(ne=!1,history.back()))}async function dr(t){var s;const e=t.target;if(!(e instanceof HTMLInputElement))return;const n=e.files&&e.files[0];if(n){if(!n.type.startsWith("image/")){F("请选择图片文件");return}try{const a=await cr(n),o=k.pendingBlob&&((s=Ot("photo-preview"))==null?void 0:s.src);o&&o.startsWith("blob:")&&URL.revokeObjectURL(o),k.pendingBlob=a,k.dirty=!0,Hn(URL.createObjectURL(a),`原图 ${Math.round(n.size/1024)} KB · 压缩后约 ${Math.round(a.size/1024)} KB（长边 ≤1600px, JPEG q0.8）`),F("图片已就绪，保存小结时上传")}catch(a){const o=a instanceof Error?a.message:String(a);F("图片处理失败："+o)}}}function cr(t){return new Promise((e,n)=>{const s=new FileReader;s.onerror=()=>n(new Error("读取文件失败")),s.onload=a=>{var r;const o=new Image;o.onerror=()=>n(new Error("图片解码失败")),o.onload=()=>{let c=o.width,u=o.height;(c>1600||u>1600)&&(c>=u?(u=Math.round(u*1600/c),c=1600):(c=Math.round(c*1600/u),u=1600));const m=document.createElement("canvas");m.width=c,m.height=u;const g=m.getContext("2d");if(!g){n(new Error("画布初始化失败"));return}g.fillStyle="#fff",g.fillRect(0,0,c,u),g.drawImage(o,0,0,c,u),m.toBlob(x=>x?e(x):n(new Error("压缩失败")),"image/jpeg",.8)};const i=(r=a.target)==null?void 0:r.result;typeof i=="string"?o.src=i:n(new Error("读取图片失败"))},s.readAsDataURL(t)})}async function ur(){if(await at("删除今天这张图片？删除后不可恢复。",{title:"删除图片",confirmText:"删除"})){if(k.photoId)try{await M.deletePhoto(k.photoId)}catch(e){const n=e instanceof Error?e.message:String(e);F("删除图片失败："+n);return}da(),F("已删除今日图片")}}function vn(t){const e=Number(t),n=l("score-value");n&&(n.innerText=String(e),n.classList.remove("ev-pop"),n.offsetWidth,n.classList.add("ev-pop"));const s=h("score-range");s&&s.value!==String(e)&&(s.value=String(e)),re(e)}function re(t){const e=ia(t),n=l("score-text");n&&(n.innerText=e.label,n.className="mt-2 text-center text-xs font-mono font-medium rounded-lg py-2 transition-colors "+In(e.tone).band)}function pr(){const t=l("band-editor");t&&(t.classList.toggle("open"),t.classList.contains("open")&&Se())}function Se(){const t=rt||Ft,e=l("band-rows");e&&(e.innerHTML=t.map((n,s)=>`
    <div class="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5">
      <span class="text-[11px] font-bold font-mono text-neutral-500 tabular-nums w-9 shrink-0">${n.range[0]}-${n.range[1]}</span>
      <button type="button" data-action="ev-cycle-tone" data-idx="${s}" title="点击切换配色"
              class="w-3.5 h-3.5 rounded-full shrink-0 border border-neutral-200 shadow-sm active:scale-90 transition-transform"
              style="background:${In(n.tone).dot}"></button>
      <input type="text" data-action="ev-band-label" data-idx="${s}" value="${ar(n.label)}" maxlength="20"
             class="flex-1 min-w-0 bg-transparent text-xs text-neutral-800 outline-none font-sans">
    </div>`).join(""))}function fr(t,e){var s;const n=rt||Ft;n[t]&&(n[t].label=e,an(),re(Number((s=h("score-range"))==null?void 0:s.value)||7))}function mr(t){var s;const e=rt||Ft;if(!e[t])return;const n=cn.indexOf(e[t].tone);e[t].tone=cn[(n+1)%cn.length],Se(),an(),re(Number((s=h("score-range"))==null?void 0:s.value)||7)}function xr(){var t;rt=Ft.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone})),Se(),an(),re(Number((t=h("score-range"))==null?void 0:t.value)||7),F("已恢复默认文案，点击「保存设置」生效")}async function br(){var n;const t=rt||Ft,e=K("band-save-btn");e&&(e.disabled=!0,e.classList.add("opacity-60"));try{await M.saveSummaryScoreBands(t.map(s=>({range:[s.range[0],s.range[1]],label:s.label,tone:s.tone}))),F("评分文案已保存并生效"),an(),re(Number((n=h("score-range"))==null?void 0:n.value)||7)}catch(s){const a=s instanceof Error?s.message:String(s);F("保存失败："+a)}finally{e&&(e.disabled=!1,e.classList.remove("opacity-60"))}}async function gr(){var i,r,d;const t=K("ev-save-btn"),e=k.date||Pt(),n=[1,2,3].map(c=>{var u;return((u=h("done-"+c))==null?void 0:u.value.trim())||""}).filter(Boolean),s=((i=se("note-text"))==null?void 0:i.value.trim())||"",a=Number((r=h("score-range"))==null?void 0:r.value)||7,o=!!k.pendingBlob||!!k.photoId;if(!n.length&&!s&&!o){F("至少填写三件事、图片或感想中的一项");return}t&&(t.disabled=!0,t.classList.add("opacity-60"));try{let c=k.photoId;if(k.pendingBlob){const u=await M.uploadEveningPhoto(e,k.pendingBlob);c=u.data&&u.data.photo_id?u.data.photo_id:null}if(await M.saveEveningSummary({record_date:e,done_items:n,note_text:s,score:a,photo_id:c||null}),k.photoId=c,k.pendingBlob&&c){const u=(d=Ot("photo-preview"))==null?void 0:d.src;u&&u.startsWith("blob:")&&URL.revokeObjectURL(u),Hn(`/api/v1/evening/photo/${c}`,"已保存 · 长边 ≤1600px, JPEG q0.8")}k.pendingBlob=null,k.dirty=!1,F("今日小结已保存"),await aa()}catch(c){const u=c instanceof Error?c.message:String(c);F("保存失败："+u)}finally{t&&(t.disabled=!1,t.classList.remove("opacity-60"))}}function me(t){return t===30?"近 30 天":"近 7 天"}function hr(t){document.querySelectorAll("#ev-insight-range button").forEach(e=>e.classList.remove("active")),t.classList.add("active"),k.insightRange=Number(t.dataset.val)||7}function vr(t){t!==7&&t!==30||(k.insightRange=t,document.querySelectorAll("#ev-insight-range button").forEach(e=>{e.classList.toggle("active",e instanceof HTMLElement&&Number(e.dataset.val)===t)}))}async function yr(t,e=Ee){var r,d;const n=()=>e!==Ee||t!==k.date;_e();const s=l("insight-empty"),a=l("insight-panel");(r=l("think-body"))==null||r.classList.remove("open"),(d=l("think-arrow"))==null||d.classList.remove("rotate-90");const o=l("think-text");o&&(o.innerText="");const i=l("insight-body");i&&(i.innerHTML=""),a==null||a.classList.add("hidden"),s==null||s.classList.remove("hidden");try{const c=await M.getEveningInsight(t);if(n())return;const u=c?c.data:null;u&&u.content&&wr(u)}catch{}}function ua(t){if(!t)return"";const e=new Date(t);if(isNaN(e.getTime()))return"";const n=s=>String(s).padStart(2,"0");return n(e.getHours())+":"+n(e.getMinutes())}function wr(t){var o,i;(o=l("insight-empty"))==null||o.classList.add("hidden"),(i=l("insight-panel"))==null||i.classList.remove("hidden"),vr(Number(t.range_days));const e=t.range_days===7||t.range_days===30?me(t.range_days)+" · ":"",n=l("insight-meta");n&&(n.innerText=`${fe(t.start_date||k.date)} · ${e}生成于 ${ua(t.created_at)}`);const s=l("insight-body");s&&(s.innerHTML=Me(t.content||""));const a=l("think-text");a&&(a.innerText=t.thinking||"")}function _e(){var t;if($t){try{$t.abort()}catch{}$t=null}(t=l("insight-body"))==null||t.classList.remove("typing-cursor")}async function kr(){var S,_;if($t){_e();return}if(k.insightBusy)return;const t=k.date||Pt(),e=K("ev-insight-btn"),n=l("insight-empty"),s=l("insight-panel"),a=l("insight-body");_e(),Ee++,k.insightBusy=!0;const o=e?e.className:"";e&&(e.className="mt-3 w-full h-10 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",e.innerHTML="<span>停止生成</span>"),n==null||n.classList.add("hidden"),s==null||s.classList.remove("hidden"),s==null||s.classList.add("ev-rise"),a&&(a.innerHTML='<p class="text-neutral-400 font-mono text-xs">（正在推导…）</p>',a.classList.add("typing-cursor"));const i=l("insight-meta");i&&(i.innerText=`${fe(t)} · ${me(k.insightRange)} · 生成中…`);const r=l("think-text");r&&(r.innerText=""),(S=l("think-body"))==null||S.classList.remove("open"),(_=l("think-arrow"))==null||_.classList.remove("rotate-90");let d=!1,c="";const u=({thinking:b,content:L})=>{var R,O,X,J;a&&L&&L!==c&&(c=L,a.innerHTML=Me(L)),b&&r&&(r.innerText=b,L?d||(d=!0,(X=l("think-body"))==null||X.classList.remove("open"),(J=l("think-arrow"))==null||J.classList.remove("rotate-90")):((R=l("think-body"))==null||R.classList.add("open"),(O=l("think-arrow"))==null||O.classList.add("rotate-90")))},m=new AbortController;$t=m;const g=-new Date().getTimezoneOffset(),x=l("ev-insight-stop-btn"),y=l("ev-insight-reset-btn");x==null||x.classList.remove("hidden"),y==null||y.classList.add("hidden");try{const b=await _n({url:`/api/v1/evening/insight/stream?date=${encodeURIComponent(t)}&days=${k.insightRange}&tz_offset=${g}`,signal:m.signal,onUpdate:u,onDone:({thinking:L,content:R,hasError:O})=>{O?i&&(i.innerText=`${fe(t)} · ${me(k.insightRange)} · 生成失败`):R||L?i&&(i.innerText=`${fe(t)} · ${me(k.insightRange)} · 生成于 ${ua(new Date)}`):a&&(a.innerHTML='<p class="text-neutral-400 text-xs">未能获取到分析内容，请检查大模型配置。</p>')},onError:(L,{thinking:R,content:O})=>{if(O||R)u({thinking:R,content:O+`

> **注意**: 网络连接中断`});else if(L instanceof TypeError)a&&(a.innerHTML='<p class="text-rose-500 text-xs font-mono">无法连接本地服务，请确认 HealthTrack 正在运行。</p>');else if(a){const X=L instanceof Error?L.message:String(L);a.innerHTML='<p class="text-rose-500 text-xs font-mono">生成失败：'+T(X)+"</p>"}}});b.aborted&&(b.content||b.thinking?(u({thinking:b.thinking,content:b.content+`

> **已手动停止生成**`}),i&&(i.innerText=`${fe(t)} · ${me(k.insightRange)} · 已停止`)):(s==null||s.classList.add("hidden"),n==null||n.classList.remove("hidden")))}finally{$t===m&&($t=null),a==null||a.classList.remove("typing-cursor"),k.insightBusy=!1,x==null||x.classList.add("hidden"),y==null||y.classList.remove("hidden"),e&&(e.className=o,e.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成小结深度洞察</span>')}}async function Tr(){var n,s,a,o;if(!await at("清除这一天的小结洞察？清除后可重新生成。",{title:"清除洞察",confirmText:"清除"}))return;const e=k.date||Pt();try{await M.deleteEveningInsight(e),_e(),(n=l("insight-panel"))==null||n.classList.add("hidden"),(s=l("insight-empty"))==null||s.classList.remove("hidden");const i=l("insight-body");i&&(i.innerHTML="");const r=l("think-text");r&&(r.innerText=""),(a=l("think-body"))==null||a.classList.remove("open"),(o=l("think-arrow"))==null||o.classList.remove("rotate-90"),F("已清除该日小结洞察")}catch(i){const r=i instanceof Error?i.message:String(i);F("清除失败："+r)}}function Lr(){const t=l("think-body"),e=l("think-arrow");if(!t)return;const n=!t.classList.contains("open");t.classList.toggle("open",n),e&&e.classList.toggle("rotate-90",n)}function $e(t){et.set({currentTab:t}),["log","dash","trend","trend-detail","insight","history","compare","evening"].forEach(a=>{const o=document.getElementById(`view-${a}`);o&&(a===t?o.classList.remove("hidden"):o.classList.add("hidden"))});const n=document.getElementById("save-bar");n&&n.classList.toggle("hidden",t!=="log");const s=document.getElementById("app-frame");s&&t!=="trend-detail"&&s.classList.remove("frame-wide"),t==="dash"?li():t==="trend"?qo():t==="trend-detail"?ei():t==="insight"?Bi():t==="compare"?xi():t==="evening"&&nr()}Da($e);function mt(t){const e=document.getElementById(t);return!!(e&&!e.classList.contains("hidden"))}function Er(){var e;if(mt("ht-date-picker-modal"))return be(),!0;if(mt("ev-photo-viewer"))return Fe(),!0;if(mt("app-confirm-modal"))return(e=document.getElementById("app-confirm-cancel"))==null||e.click(),!0;if(mt("settings-modal"))return Ue(),!0;if(mt("data-sheet"))return yt(),!0;if(mt("export-modal"))return un(),!0;if(mt("import-modal"))return bn(),!0;if(mt("memo-import-modal"))return Ge(),!0;if(mt("import-batches-modal"))return we(),!0;const t=et.state.currentTab||"log";return t==="compare"?(Xs(),!0):t==="history"?($e("insight"),!0):t==="trend"||t==="trend-detail"?($e("dash"),!0):!1}window.handleNativeBack=Er;document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("app-frame"),e=document.getElementById("main-content");pa(),Mo(t),Co(t,n=>$e(n)),ma(document.body),_o(document.body),So(document.body),ja(e),ii(e),Di(e),er(e),No(document.body),$e("log")});
