(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();function Ts(){let e=document.getElementById("toast");e||(e=document.createElement("div"),e.id="toast",e.className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 opacity-0 pointer-events-none -translate-y-4",e.innerHTML=`
      <div id="toast-body" class="bg-neutral-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-xs font-mono font-medium">
        <span id="toast-icon">✓</span>
        <span id="toast-msg">操作成功</span>
      </div>
    `,document.body.appendChild(e))}function E(e,t=!0){const n=document.getElementById("toast"),s=document.getElementById("toast-icon"),o=document.getElementById("toast-msg");!n||!s||!o||(s.innerText=t?"✓":"✕",o.innerText=e,n.classList.remove("opacity-0","-translate-y-4","pointer-events-none"),n.classList.add("opacity-100","translate-y-0"),setTimeout(()=>{n.classList.remove("opacity-100","translate-y-0"),n.classList.add("opacity-0","-translate-y-4","pointer-events-none")},2200))}window.showToast=E;function Bs(e){var n,s;e.insertAdjacentHTML("afterbegin",`
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
  `),(n=document.getElementById("btn-open-settings"))==null||n.addEventListener("click",()=>{typeof window.openSettings=="function"&&window.openSettings()}),(s=document.getElementById("btn-open-data"))==null||s.addEventListener("click",()=>{typeof window.openDataSheet=="function"&&window.openDataSheet()})}function R(e){const t=e instanceof Date?e:new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function Ce(e,t){const[n,s,o]=e.split("-").map(Number),a=new Date(n,s-1,o);return a.setDate(a.getDate()+t),R(a)}function Tn(e){return Ce(e,-1)}class Ls{constructor(){this._state={currentTab:"log",currentDate:R(new Date),isDirty:!1,hasSavedRecord:!1,dashRange:7,sleepThresholds:{green:"23:30",yellow:"01:00"}},this._listeners=new Set}get state(){return this._state}set(t){const n={...this._state};this._state={...this._state,...t},this._notify(this._state,n)}subscribe(t){return this._listeners.add(t),()=>this._listeners.delete(t)}_notify(t,n){this._listeners.forEach(s=>{try{s(t,n)}catch(o){console.error("State subscriber error:",o)}})}}const ie=new Ls;try{Object.defineProperty(window,"currentTab",{get(){return ie.state.currentTab||"log"},set(e){ie.set({currentTab:e})},configurable:!0})}catch{window.currentTab="log"}function Ss(e,t){e.insertAdjacentHTML("beforeend",`
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
  `);const s=document.getElementById("bottom-nav");s==null||s.addEventListener("click",o=>{const a=o.target.closest("button[data-tab]");if(!a)return;const i=a.getAttribute("data-tab");typeof t=="function"&&t(i)}),ie.subscribe(o=>{const a=o.currentTab,i=a==="history"||a==="compare"?"insight":a==="trend"||a==="trend-detail"?"dash":a;["log","dash","insight","evening"].forEach(l=>{const r=document.getElementById(`tab-${l}`);r&&(l===i?(r.classList.add("active","text-neutral-900"),r.classList.remove("text-neutral-400")):(r.classList.remove("active","text-neutral-900"),r.classList.add("text-neutral-400")))})})}const Bn="";async function q(e,t={}){const n=`${Bn}${e}`,s=await fetch(n,{headers:{"Content-Type":"application/json",...t.headers},...t});if(!s.ok){let a=`HTTP Error ${s.status}`;try{const i=await s.json();a=i.message||i.error||a}catch{}throw new Error(a)}const o=s.headers.get("content-type");return o&&o.includes("application/json")?await s.json():await s.text()}const se={getHistoryRecords:(e,t)=>q(`/api/v1/records/history?start_date=${encodeURIComponent(e)}&end_date=${encodeURIComponent(t)}`),saveRecord:e=>q("/api/v1/records",{method:"POST",body:JSON.stringify(e)}),getConfig:()=>q("/api/config"),saveConfig:e=>q("/api/config",{method:"POST",body:JSON.stringify(e)}),testAIConfig:e=>q("/api/config/test",{method:"POST",body:JSON.stringify(e)}),saveSleepThresholds:e=>q("/api/config/sleep",{method:"POST",body:JSON.stringify(e)}),checkInsightPeriod:(e,t,n=-new Date().getTimezoneOffset())=>q(`/api/v1/insights/period?range_days=${e}&end_date=${encodeURIComponent(t)}&tz_offset=${n}`),getInsightHistory:(e={})=>{const t=new URLSearchParams(e).toString();return q(`/api/v1/insights${t?"?"+t:""}`)},deleteInsight:e=>q(`/api/v1/insights/${e}`,{method:"DELETE"}),getEveningSummary:e=>q(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`),saveEveningSummary:e=>q("/api/v1/evening/summary",{method:"POST",body:JSON.stringify(e)}),deleteEveningSummary:e=>q(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`,{method:"DELETE"}),uploadPhoto:async e=>{const t=await fetch(`${Bn}/api/v1/evening/photo`,{method:"POST",body:e});if(!t.ok)throw new Error("上传图片失败");return await t.json()},deletePhoto:e=>q(`/api/v1/evening/photo/${e}`,{method:"DELETE"})};function _s(e){var i,l,r;e.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("settings-modal"),s=document.getElementById("btn-close-settings"),o=document.getElementById("toggle-api-key"),a=document.getElementById("setting-api-key");n==null||n.addEventListener("click",d=>{d.target===n&&xt()}),s==null||s.addEventListener("click",xt),o==null||o.addEventListener("click",()=>{a.type==="password"?(a.type="text",o.innerText="隐藏"):(a.type="password",o.innerText="显示")}),(i=document.getElementById("save-config-btn"))==null||i.addEventListener("click",Cs),(l=document.getElementById("test-config-btn"))==null||l.addEventListener("click",js),(r=document.getElementById("save-sleep-btn"))==null||r.addEventListener("click",Ds)}function $s(){const e=document.getElementById("settings-modal");e&&(e.classList.remove("hidden"),Ms())}function xt(){const e=document.getElementById("settings-modal");e==null||e.classList.add("hidden")}async function Ms(){try{const e=await se.getConfig(),t=e&&e.data?e.data:e||{},n=document.getElementById("setting-base-url"),s=document.getElementById("setting-model"),o=document.getElementById("api-key-status");n&&(n.value=t.base_url||""),s&&(s.value=t.model||""),o&&(o.innerText=t.api_key_configured?`当前 Key: ${t.api_key_masked}（留空可保留）`:"尚未配置 API Key");const a=document.getElementById("setting-sleep-green"),i=document.getElementById("setting-sleep-yellow");a&&(a.value=t.sleep_green_before||"23:30"),i&&(i.value=t.sleep_yellow_before||"01:00")}catch(e){E("读取设置失败: "+e.message,!1)}}async function Cs(){const e=document.getElementById("setting-base-url"),t=document.getElementById("setting-model"),n=document.getElementById("setting-api-key"),s={base_url:(e==null?void 0:e.value.trim())||"",model:(t==null?void 0:t.value.trim())||""};n&&n.value.trim()&&(s.api_key=n.value.trim());try{await se.saveConfig(s),E("AI 配置已更新"),xt()}catch(o){E("保存失败: "+o.message,!1)}}async function js(){const e=document.getElementById("setting-base-url"),t=document.getElementById("setting-model"),n=document.getElementById("setting-api-key"),s=document.getElementById("settings-feedback"),o={base_url:(e==null?void 0:e.value.trim())||"",model:(t==null?void 0:t.value.trim())||""};n&&n.value.trim()&&(o.api_key=n.value.trim()),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 text-neutral-600 block",s.innerText="正在测试连接中…");try{await se.testAIConfig(o),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-900 text-white block",s.innerText="✓ 测试连接成功！")}catch(a){s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 block",s.innerText="✕ 测试连接失败: "+a.message)}}async function Ds(){const e=document.getElementById("setting-sleep-green"),t=document.getElementById("setting-sleep-yellow"),n=(e==null?void 0:e.value)||"23:30",s=(t==null?void 0:t.value)||"01:00";try{await se.saveSleepThresholds({green_before:n,yellow_before:s}),window.dispatchEvent(new CustomEvent("sleep-thresholds-updated",{detail:{green:n,yellow:s}})),E("熬夜阈值已保存并立即生效")}catch(o){E("保存阈值失败: "+o.message,!1)}}window.openSettings=$s;window.closeSettings=xt;function Hs(e){var o,a,i,l,r;e.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("data-sheet"),s=document.getElementById("btn-close-datasheet");n==null||n.addEventListener("click",d=>{d.target===n&&fe()}),s==null||s.addEventListener("click",fe),(o=document.getElementById("btn-open-file-import"))==null||o.addEventListener("click",()=>{fe(),typeof window.openImportModal=="function"&&window.openImportModal()}),(a=document.getElementById("btn-open-memo-import"))==null||a.addEventListener("click",()=>{fe(),typeof window.openMemoImportModal=="function"&&window.openMemoImportModal()}),(i=document.getElementById("btn-open-batches"))==null||i.addEventListener("click",()=>{fe(),typeof window.openImportBatchesModal=="function"&&window.openImportBatchesModal()}),(l=document.getElementById("btn-dl-template"))==null||l.addEventListener("click",()=>{window.location.href="/api/v1/import/template"}),(r=document.getElementById("btn-open-export"))==null||r.addEventListener("click",()=>{fe(),typeof window.openExportModal=="function"&&window.openExportModal()})}function As(){var e;(e=document.getElementById("data-sheet"))==null||e.classList.remove("hidden")}function fe(){var e;(e=document.getElementById("data-sheet"))==null||e.classList.add("hidden")}window.openDataSheet=As;window.closeDataSheet=fe;const Ns=`    <!-- 导出数据弹窗：Excel 表格与 JSON 完整备份两种方式 -->
    <div id="export-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center" onclick="closeExportOnBackdrop(event)">
      <section class="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="export-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 id="export-title" class="font-bold text-slate-900">导出数据</h2>
            <p id="export-subtitle" class="text-xs text-slate-400 mt-0.5">导出为 CSV，可用 Excel / WPS 打开</p>
          </div>
          <button onclick="closeExport()" aria-label="关闭导出" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <div class="grid grid-cols-3 gap-2" id="export-type-pills">
            <button type="button" data-type="excel" onclick="selectExportType(this)" class="py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all">Excel</button>
            <button type="button" data-type="json" onclick="selectExportType(this)" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">JSON</button>
            <button type="button" data-type="archive" onclick="selectExportType(this)" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">图文归档</button>
          </div>
          <div id="export-range-panel">
            <label class="block text-xs font-mono font-medium text-neutral-600 mb-2">导出范围</label>
            <div class="grid grid-cols-3 gap-2" id="export-range-pills">
              <button data-range="7" onclick="selectExportRange(this)" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">最近7天</button>
              <button data-range="30" onclick="selectExportRange(this)" class="py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">最近30天</button>
              <button data-range="all" onclick="selectExportRange(this)" class="py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all">全部</button>
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
          <button id="export-start-btn" type="button" onclick="exportCurrent()" class="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">开始导出</button>
          <button id="export-json-btn" type="button" onclick="exportCurrent()" class="hidden w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">导出 JSON 备份</button>
          <button id="export-archive-btn" type="button" onclick="exportCurrent()" class="hidden w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">导出图文归档</button>
        </div>
      </section>
    </div>

    <!-- 导入数据弹窗：选择文件 → 预检预览 → 确认写入 -->
    <div id="import-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center" onclick="closeImportOnBackdrop(event)">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 id="import-title" class="font-bold text-slate-900">导入数据</h2>
            <p id="import-subtitle" class="text-xs text-slate-400 mt-0.5">预检不写入数据，确认后才会导入</p>
          </div>
          <button onclick="closeImport()" aria-label="关闭导入" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div class="p-5 space-y-4 overflow-y-auto no-scrollbar">
          <div id="import-step-pick">
            <!-- 安卓文件选择器对 text/csv 等 MIME 支持不一致，这里放开选择范围，由服务端校验文件类型 -->
            <input id="import-file-input" type="file" accept="*/*" class="hidden" onchange="impFileSelected(this)">
            <button id="import-pick-btn" type="button" onclick="impPickFile()" class="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">选择文件</button>
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
                <button type="button" data-mode="merge" onclick="impSelectMode(this)" class="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white transition-all">
                  <span class="block text-xs font-bold text-slate-800">合并（推荐）</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">只覆盖文件中填写了值的字段，空单元格保留旧数据</span>
                </button>
                <button type="button" data-mode="overwrite" onclick="impSelectMode(this)" class="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white transition-all">
                  <span class="block text-xs font-bold text-slate-800">替换</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">整行覆盖，文件中的空值会清空原有数据</span>
                </button>
              </div>
            </div>
            <label id="import-skip-wrap" class="hidden flex items-start space-x-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
              <input id="import-skip-errors" type="checkbox" class="mt-0.5 accent-amber-600" onchange="impToggleSkipErrors(this)">
              <span class="text-[11px] leading-relaxed text-amber-800">跳过错误行，只导入正常行。失败行可在「导入记录」中导出修正后补导。</span>
            </label>
          </div>

          <div id="import-result" class="hidden text-xs rounded-xl px-3 py-2.5"></div>
        </div>
        <div class="px-5 py-4 border-t border-neutral-100 shrink-0 flex gap-2">
          <button type="button" onclick="closeImport()" class="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-600 font-mono font-medium text-xs hover:bg-neutral-200 transition-colors">取消</button>
          <button id="import-confirm-btn" type="button" onclick="impConfirm()" disabled class="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs transition-colors opacity-50">确认导入</button>
        </div>
      </section>
    </div>

    <!-- 备忘录粘贴导入 -->
    <div id="memo-import-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center" onclick="closeMemoOnBackdrop(event)">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="memo-import-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h2 id="memo-import-title" class="font-bold text-neutral-900">从备忘录导入</h2>
            <p class="text-xs text-neutral-400 mt-0.5">粘贴后先预检，确认无误再写入</p>
          </div>
          <button onclick="closeMemo()" aria-label="关闭备忘录导入" class="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500">✕</button>
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
          <button type="button" onclick="closeMemo()" class="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-600 font-mono font-medium text-xs hover:bg-neutral-200 transition-colors">取消</button>
          <button id="memo-preview-btn" type="button" onclick="impPreviewMemo()" class="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-xs hover:bg-neutral-800 transition-colors">预检</button>
        </div>
      </section>
    </div>

    <!-- 导入批次历史 -->
    <div id="import-batches-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center" onclick="closeBatchesOnBackdrop(event)">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="batches-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 id="batches-title" class="font-bold text-slate-900">导入记录</h2>
            <p class="text-xs text-slate-400 mt-0.5">失败批次可重试或导出失败行</p>
          </div>
          <button onclick="closeBatches()" aria-label="关闭导入记录" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div id="batches-list" class="p-4 space-y-2.5 overflow-y-auto no-scrollbar">
          <p class="text-xs text-slate-400 text-center py-8">加载中…</p>
        </div>
        <div class="px-5 py-4 border-t border-slate-100 shrink-0">
          <button type="button" onclick="closeBatches()" class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">关闭</button>
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
    <div id="ev-photo-viewer" class="hidden fixed inset-0 z-[85] bg-slate-950/95 flex items-center justify-center" onclick="evoClosePhoto()" role="dialog" aria-modal="true" aria-label="查看小结图片">
      <img id="ev-photo-viewer-img" src="" alt="" class="w-full h-full object-contain p-4 select-none">
      <button type="button" onclick="event.stopPropagation(); evoClosePhoto()" aria-label="关闭图片" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 text-white text-lg leading-none flex items-center justify-center backdrop-blur active:scale-95 transition-transform">✕</button>
      <p class="absolute bottom-6 inset-x-0 text-center text-[11px] text-white/60">点击任意处关闭</p>
    </div>

    <!-- 核心内容切换区 -->`;function K(e,t){const n=t||{};return new Promise(s=>{const o=document.getElementById("app-confirm-modal"),a=document.getElementById("app-confirm-title"),i=document.getElementById("app-confirm-msg"),l=document.getElementById("app-confirm-ok"),r=document.getElementById("app-confirm-cancel");if(!o){s(!1);return}a.innerText=n.title||"请确认",i.innerText=e||"",l.innerText=n.confirmText||"确定",n.danger===!1?l.className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-mono font-semibold text-sm hover:bg-neutral-800 transition-colors":l.className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-mono font-semibold text-sm hover:bg-rose-700 transition-colors";const d=()=>{o.classList.add("hidden"),l.onclick=null,r.onclick=null,o.onclick=null};l.onclick=()=>{d(),s(!0)},r.onclick=()=>{d(),s(!1)},o.onclick=m=>{m.target===o&&(d(),s(!1))},o.classList.remove("hidden")})}async function Ln(e){if(window.HealthTrack&&typeof window.HealthTrack.copyText=="function")try{return window.HealthTrack.copyText(e),!0}catch{}try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(e),!0}catch{}try{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-2000px",t.style.opacity="0",document.body.appendChild(t),t.select(),t.setSelectionRange(0,e.length);const n=document.execCommand("copy");return document.body.removeChild(t),n}catch{return!1}}let $t=null;function C(e){const t=document.getElementById("app-toast");t?(t.innerText=e||"",t.classList.remove("hidden"),$t&&clearTimeout($t),$t=setTimeout(()=>t.classList.add("hidden"),2600)):E(e,!0)}window.appConfirm=K;window.appCopyText=Ln;window.appToast=C;const Rs=`<!-- 1. 记一笔 (Log View) 模块模板 -->
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
`;let W=R(new Date),ye=!1,Ve=!1,gt="",Ut=!1,X=null,A=null,we=null,N={value:null,prefilled:null,autoDetected:!1},Me=null,Ie={touched:!1},Z={types:[],intensity:"light"},ht={timing:"07:30",feeling:"refreshed"},je={green:"23:30",yellow:"01:00"};const an=["cardio","strength"],ce={protein:{chicken:"鸡胸",egg:"蛋",fish:"鱼",beef:"牛肉",soy:"豆制品",yogurt:"酸奶",other:"其他"},staple:{rice:"白米饭",noodle:"面条",grains:"杂粮",potato:"薯类",none:"无主食"},carb:{lt20:"<20g","20_35":"20–35g","35_50":"35–50g",gt50:">50g"},cook:{steam:"蒸煮",stir_fry:"炒",fry:"煎炸",raw:"生食",takeout:"外卖"}};async function Os(e){e.insertAdjacentHTML("beforeend",Rs),io(),await Ps(),await nt(W)}async function Ps(){try{const e=await se.getConfig(),t=e.data||e;t.sleep_green_before&&(je.green=t.sleep_green_before),t.sleep_yellow_before&&(je.yellow=t.sleep_yellow_before),Et()}catch{}}window.addEventListener("sleep-thresholds-updated",e=>{e.detail&&(e.detail.green&&(je.green=e.detail.green),e.detail.yellow&&(je.yellow=e.detail.yellow),Et())});async function nt(e){W=e,Ve=!0;const t=document.getElementById("input-date");t&&(t.value=e);let n=null;try{const s=Ce(e,-6),o=await se.getHistoryRecords(s,e),a=o&&Array.isArray(o.data)?o.data:Array.isArray(o)?o:[];A=a.find(i=>i.record_date===Tn(e))||null,n=a.find(i=>i.record_date===e)||null,ln(n),Gs(a,e),ge(),Qs(),Ut=!!n,gt=n?Fs(n):""}catch(s){console.error("加载单日记录失败:",s)}finally{ye=!1,Ve=!1,Vt(),Ge(),bt();const s=oo(e);s&&(Ve=!0,ln(s),ge(),Ve=!1,ye=!0,Ge(),bt(),E("已恢复上次未保存的草稿"));const o=e===R(new Date);if(o&&N.value===null&&qt()&&typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission()){const a=window.HealthTrack.getTodaySteps();a>0&&(N.value=Math.max(0,Math.min(2e4,Math.round(a/500)*500)),N.autoDetected=!0,ge(),Ge())}st(o)}}function Fs(e){if(!e||!e.updated_at)return"";const t=new Date(e.updated_at);return isNaN(t.getTime())||t.getFullYear()<2e3?"":t.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1})}function ln(e){e=e||{};const t=(b,B)=>{const I=document.getElementById(b);I&&(I.value=B??"")};if(t("input-weight-am",e.weight_am),t("input-weight-pm",e.weight_pm),t("input-waist",e.waist_size),t("input-journal",e.journal_text||e.journal||""),Ht(),Dt(),t("sleepBedTime",e.sleep_start_time||e.sleep_bed_time||"00:30"),t("sleepWakeTime",e.sleep_end_time||e.sleep_wake_time||"07:15"),Et(),e.sleep_hours!==null&&e.sleep_hours!==void 0){const b=document.getElementById("sleepDuration");b&&(b.value=e.sleep_hours)}const n=e.exercise||{},s=Array.isArray(n.types)?n.types.slice():n.type&&n.type!=="none"?[n.type]:[];Dn(s),s.length>0?(An(n.intensity||"light"),t("exerciseDuration",n.duration||40),t("exerciseItems",n.items||"")):(t("exerciseDuration",40),t("exerciseItems",""));const o=e.concerta,a=!!(o&&o.taken),i=document.getElementById("concertaEnabled");if(i&&(i.checked=a),Nn(a),a){t("concertaTime",o.time||"08:00"),t("concertaDose",String(o.dose||36)),t("focusWork",o.focus_work||4);const b=document.getElementById("focusWorkText");b&&(b.innerText=(o.focus_work||4)+"分")}const l=o&&o.side_effects||[];document.querySelectorAll("#concertaSideEffects .chip").forEach(b=>{b.classList.toggle("active",l.includes(b.getAttribute("data-key")))});const r=o&&o.compensations||[];document.querySelectorAll("#concertaCompensations .chip").forEach(b=>{b.classList.toggle("active",r.includes(b.getAttribute("data-key")))});const d=e.cold_shower,m=!!(d&&d.enabled),h=document.getElementById("coldShowerEnabled");h&&(h.checked=m),Rn(m);let u=d&&d.timing||"07:30";u==="morning"?u="07:30":u==="post_workout"?u="18:30":u==="evening"&&(u="22:30"),At(u),Fn(d&&d.feeling||"refreshed");let g=(d&&d.duration)!==void 0&&d.duration!==null?Number(d.duration):60;g>0&&g<=10&&(g=g*60),Pn(g),t("coldShowerWaterTemp",d&&d.water_temp!==null&&d.water_temp!==void 0?d.water_temp:""),we=e.morning_light===!0?"yes":e.morning_light===!1?"no":null,_n(),N.value=e.steps===null||e.steps===void 0?null:Number(e.steps),N.autoDetected=!1,ge(),jn(e.lunch||null)}function Sn(){var r,d,m;const e=W||((r=document.getElementById("input-date"))==null?void 0:r.value)||R(new Date),t=h=>{var u;return((u=document.getElementById(h))==null?void 0:u.value)||""},n=h=>h===""||h===null||h===void 0||isNaN(parseFloat(h))?null:parseFloat(h),s=[];document.querySelectorAll("#concertaSideEffects .chip.active").forEach(h=>{const u=h.getAttribute("data-key");u&&s.push(u)});const o=[];document.querySelectorAll("#concertaCompensations .chip.active").forEach(h=>{const u=h.getAttribute("data-key");u&&o.push(u)});const i=!!((d=document.getElementById("concertaEnabled"))!=null&&d.checked)?{taken:!0,time:t("concertaTime")||"08:00",dose:parseInt(t("concertaDose"),10)||36,focus_work:parseInt(t("focusWork"),10)||4,focus_study:4,daily_tasks:4,social:4,gaming:4,crash_time:"18:00",side_effects:s,compensations:o}:{taken:!1},l=t("coldShowerWaterTemp");return{record_date:e,weight_am:n(t("input-weight-am")),weight_pm:n(t("input-weight-pm")),waist_size:n(t("input-waist")),sleep_hours:n(t("sleepDuration")),sleep_start_time:t("sleepBedTime")||null,sleep_end_time:t("sleepWakeTime")||null,journal_text:t("input-journal")||"",exercise:{types:Z.types.slice(),type:Z.types[0]||"none",duration:parseInt(t("exerciseDuration"),10)||0,intensity:Z.intensity,items:t("exerciseItems")||""},cold_shower:{enabled:!!((m=document.getElementById("coldShowerEnabled"))!=null&&m.checked),timing:t("coldShowerTime")||ht.timing||"07:30",duration:parseInt(t("coldShowerDuration"),10)||60,water_temp:l===""?null:parseFloat(l),feeling:ht.feeling},concerta:i,morning_light:we==="yes"?!0:we==="no"?!1:null,steps:N.value,lunch:Xs()}}async function zs(){const e=Sn(),t=e.record_date,n=document.getElementById("btn-save-log");n&&(n.disabled=!0);try{const s=await se.saveRecord(e);s&&(s.code===200||s.status===200||!s.code)?(ye=!1,Ut=!0,gt=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1}),X&&(clearTimeout(X),X=null),ao(t),bt(),E("✓ 保存成功"),nt(t)):E(s&&s.message||"保存失败",!1)}catch(s){E("保存失败: "+s.message,!1)}finally{n&&(n.disabled=!1)}}function Us(e){we=we===e?null:e,_n(),O()}function _n(){document.querySelectorAll("#morningLightPills button").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===we)})}function qt(){return!!(window.HealthTrack&&typeof window.HealthTrack.isStepSensorAvailable=="function"&&window.HealthTrack.isStepSensorAvailable())}function st(e){const t=document.getElementById("steps-source-badge"),n=document.getElementById("btn-sync-steps");if(!e||!qt()){t&&t.classList.add("hidden"),n&&n.classList.add("hidden");return}const s=typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission();n&&(n.classList.remove("hidden"),n.innerText=s?"同步":"授权",n.title=s?"同步手机硬件计步器步数":"申请手机计步权限"),t&&(s&&N.autoDetected?t.classList.remove("hidden"):t.classList.add("hidden"))}function rn(e=!1){if(!qt()){e&&E("当前环境未检测到计步传感器");return}if(!(W===R(new Date))){e&&E("仅支持同步当天的实时步数");return}if(!(typeof window.HealthTrack.hasStepPermission=="function"&&window.HealthTrack.hasStepPermission())){typeof window.HealthTrack.requestStepPermission=="function"&&(window.HealthTrack.requestStepPermission(),e&&E("正在请求手机计步权限…"));return}const s=window.HealthTrack.getTodaySteps();if(s<0){e&&E("未读取到有效步数");return}const o=Math.max(0,Math.min(2e4,Math.round(s/500)*500));N.value=o,N.autoDetected=!0,ge(),st(!0),Ge(),O(),e&&E(`已同步手机计步 ${s.toLocaleString("en-US")} 步`)}function qs(e){const t=Number(e);N.value=isNaN(t)?null:Math.max(0,Math.min(2e4,Math.round(t/500)*500)),N.autoDetected=!1,ge(),st(W===R(new Date)),O()}function Vs(){N.value=null,N.autoDetected=!1,ge(),st(W===R(new Date)),O()}function ge(){const e=document.getElementById("input-steps");e&&(N.prefilled=N.value===null?Me:null,e.value=N.value===null?Me===null?0:Me:N.value,Ws())}function Ws(){const e=N.value,t=document.getElementById("steps-value");t&&(t.innerText=e===null?"--":e.toLocaleString("en-US"));const n=document.getElementById("steps-hint");n&&(e===null&&N.prefilled!==null?n.innerText=`拖动滑块记录 · 已预置昨天 ${N.prefilled.toLocaleString("en-US")} 步`:n.innerText="留空表示当天未记录 · 图表断点")}function Gs(e,t){const n=e.find(i=>i.record_date===Tn(t));Me=n&&n.steps!==null&&n.steps!==void 0?Number(n.steps):null;const s=e.filter(i=>i.record_date!==t&&i.steps!==null&&i.steps!==void 0).map(i=>Number(i.steps)),o=s.length?Math.round(s.reduce((i,l)=>i+l,0)/s.length):null,a=document.getElementById("steps-meta");if(a){const i=Me===null?"--":Me.toLocaleString("en-US"),l=o===null?"--":o.toLocaleString("en-US");a.innerHTML=`昨 <span class="font-medium text-neutral-700">${i}</span> · 7日均 <span class="font-medium text-neutral-700">${l}</span> 步`}}function Js(){const e=document.getElementById("lunch-body"),t=document.getElementById("lunch-icon");if(!e)return;const n=e.classList.toggle("hidden");t&&(t.style.transform=n?"rotate(0deg)":"rotate(180deg)")}function dn(e){e.parentElement.querySelectorAll(".pill-sm-btn").forEach(t=>t.classList.remove("active")),e.classList.add("active"),Ie.touched=!0,$n()}function Ys(e){e.classList.toggle("active"),Ie.touched=!0,$n()}function $n(){Mn(),Cn(),O()}function Mn(){const e=Y("lunch-eaten")==="skipped";["lunch-protein-row","lunch-protein-g-row","lunch-staple-row","lunch-carb-row","lunch-cook-row"].forEach(t=>{const n=document.getElementById(t);n&&n.classList.toggle("hidden",e)})}function Y(e){const t=document.querySelector(`#${e} .pill-sm-btn.active`);return t?t.getAttribute("data-val"):""}function Cn(){const e=document.getElementById("lunch-summary");if(!e)return;if(!Ie.touched){e.innerText="今天还没记午餐";return}if(Y("lunch-eaten")==="skipped"){e.innerText="今天跳过午餐";return}const t=Array.from(document.querySelectorAll("#lunch-protein .chip.active")).map(o=>ce.protein[o.getAttribute("data-val")]||""),n=Y("lunch-protein-g"),s=[t.length?t.join("、"):"未选蛋白",n?`约${n}g`:"",ce.staple[Y("lunch-staple")]||"",ce.carb[Y("lunch-carb")]||"",ce.cook[Y("lunch-cook")]||""].filter(Boolean);e.innerText=s.join(" · ")||"已记午餐（明细空白）"}function Ks(e){return e?e.eaten==="skipped"?"跳过":[(e.protein||[]).map(n=>ce.protein[n]||n).join("、"),e.protein_g?`约${e.protein_g}g`:"",ce.staple[e.staple]||"",ce.carb[e.carb_g]||"",ce.cook[e.cooking]||""].filter(Boolean).join(" · "):""}function Xs(){if(!Ie.touched)return null;const e=Array.from(document.querySelectorAll("#lunch-protein .chip.active")).map(t=>t.getAttribute("data-val"));return{eaten:Y("lunch-eaten")||"eaten",protein:e,protein_g:parseInt(Y("lunch-protein-g"),10)||0,staple:Y("lunch-staple"),carb_g:Y("lunch-carb"),cooking:Y("lunch-cook")}}function jn(e){if(document.querySelectorAll("#lunch-eaten .pill-sm-btn, #lunch-protein-g .pill-sm-btn, #lunch-staple .pill-sm-btn, #lunch-carb .pill-sm-btn, #lunch-cook .pill-sm-btn").forEach(t=>t.classList.remove("active")),document.querySelectorAll("#lunch-protein .chip").forEach(t=>t.classList.remove("active")),Ie.touched=!!e,e){const t=(n,s)=>{const o=document.querySelector(`#${n} [data-val="${s}"]`);o&&o.classList.add("active")};t("lunch-eaten",e.eaten||"eaten"),(e.protein||[]).forEach(n=>t("lunch-protein",n)),e.protein_g&&t("lunch-protein-g",String(e.protein_g)),e.staple&&t("lunch-staple",e.staple),e.carb_g&&t("lunch-carb",e.carb_g),e.cooking&&t("lunch-cook",e.cooking)}Mn(),Cn()}function Zs(){const e=A&&A.lunch;if(!e){E("昨天没有午餐记录，先手动记一次",!1);return}jn(e),Ie.touched=!0,O(),E("已沿用昨天的午餐")}function Qs(){const e=document.getElementById("lunch-yesterday");if(!e)return;const t=A&&A.lunch;e.innerText="昨天："+(t?Ks(t):"--")}function Dt(){const e=document.getElementById("input-journal"),t=document.getElementById("btn-clear-journal");!e||!t||(e.value&&e.value.trim().length>0?t.classList.remove("hidden"):t.classList.add("hidden"))}function Ht(){const e=document.getElementById("input-journal");if(!e)return;e.style.height="auto";const t=Math.min(Math.max(e.scrollHeight,68),240);e.style.height=`${t}px`}function Mt(e){if(!e)return NaN;const t=e.trim().split(":");if(t.length!==2)return NaN;const n=parseInt(t[0],10),s=parseInt(t[1],10);if(isNaN(n)||isNaN(s))return NaN;let o=n*60+s;return n>=0&&n<=6&&(o+=24*60),o}function eo(e,t,n){const s=Mt(e);if(isNaN(s))return"GREEN";let o=Mt(t),a=Mt(n);return isNaN(o)&&(o=23*60+30),isNaN(a)&&(a=25*60),s<o?"GREEN":s<a?"YELLOW":"RED"}function Et(){var h,u;const e=(h=document.getElementById("sleepBedTime"))==null?void 0:h.value,t=(u=document.getElementById("sleepWakeTime"))==null?void 0:u.value;if(!e||!t)return;const[n,s]=e.split(":").map(Number),[o,a]=t.split(":").map(Number);let i=n*60+s,l=o*60+a;l<=i&&(l+=1440);const r=((l-i)/60).toFixed(1),d=document.getElementById("sleepDuration");d&&(d.value=r);const m=document.getElementById("sleepTagBadge");if(m){const g=eo(e,je.green,je.yellow);m.classList.remove("badge-green","badge-yellow","badge-red"),g==="YELLOW"?(m.classList.add("badge-yellow"),m.innerText="● 轻度熬夜"):g==="RED"?(m.classList.add("badge-red"),m.innerText="● 重度熬夜"):(m.classList.add("badge-green"),m.innerText="● 未熬夜")}Vt()}function to(){const e=document.getElementById("biohackBody"),t=document.getElementById("accordionIcon");if(!e)return;const n=e.classList.toggle("hidden");t&&(t.style.transform=n?"rotate(0deg)":"rotate(180deg)")}function Dn(e){Z.types=(e||[]).filter(t=>t&&t!=="none"),Hn()}function no(e){if(e==="none"){Dn([]);return}const t=Z.types.indexOf(e);t>=0?Z.types.splice(t,1):(Z.types.push(e),Z.types.sort((n,s)=>an.indexOf(n)-an.indexOf(s))),Hn()}function Hn(){const e=Z.types;document.querySelectorAll("#exerciseTypePills .pill-btn").forEach(n=>{const s=n.getAttribute("data-val");n.classList.toggle("active",s==="none"?e.length===0:e.includes(s))});const t=document.getElementById("exerciseSubForm");t&&t.classList.toggle("hidden",e.length===0)}function An(e){Z.intensity=e,document.querySelectorAll("#exerciseIntensityPills .pill-sm-btn").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-val")===e)})}function Nn(e){const t=document.getElementById("concertaSubForm");t&&t.classList.toggle("hidden",!e)}function Rn(e){const t=document.getElementById("coldShowerSubForm");t&&t.classList.toggle("hidden",!e)}function At(e){ht.timing=e;const t=document.getElementById("coldShowerTime");t&&t.value!==e&&(t.value=e),document.querySelectorAll("#csQuickTimingPills .pill-sm-btn").forEach(n=>{n.classList.toggle("active",n.getAttribute("data-time")===e)})}function On(e){document.querySelectorAll("#csQuickDurationPills .pill-sm-btn").forEach(t=>{t.classList.toggle("active",Number(t.getAttribute("data-sec"))===Number(e))})}function Pn(e){const t=document.getElementById("coldShowerDuration");t&&(t.value=e),On(e)}function Fn(e){ht.feeling=e,document.querySelectorAll("#csFeelingPills .pill-sm-btn").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-val")===e)})}function Vt(){var r,d,m,h;const e=parseFloat((r=document.getElementById("input-weight-am"))==null?void 0:r.value),t=document.getElementById("diff-weight-am");if(t)if(!isNaN(e)&&A&&A.weight_am!==null&&A.weight_am!==void 0){const u=Math.round((e-A.weight_am)*10)/10;u<0?t.innerHTML=`<span class="text-emerald-600 font-bold">↓ 较昨日 ${u.toFixed(1)}</span><span class="text-slate-300">晨测</span>`:u>0?t.innerHTML=`<span class="text-rose-500 font-bold">↑ 较昨日 +${u.toFixed(1)}</span><span class="text-slate-300">晨测</span>`:t.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晨测</span>'}else t.innerHTML='<span>较昨日 --</span><span class="text-slate-300">晨测</span>';const n=parseFloat((d=document.getElementById("input-weight-pm"))==null?void 0:d.value),s=document.getElementById("diff-weight-pm");if(s)if(isNaN(n))s.innerHTML='<span>等待今晚称重</span><span class="text-slate-300">--:--</span>';else if(A&&A.weight_pm!==null&&A.weight_pm!==void 0){const u=Math.round((n-A.weight_pm)*10)/10;u<0?s.innerHTML=`<span class="text-emerald-600 font-bold">↓ 较昨日 ${u.toFixed(1)}</span><span class="text-slate-300">晚测</span>`:u>0?s.innerHTML=`<span class="text-rose-500 font-bold">↑ 较昨日 +${u.toFixed(1)}</span><span class="text-slate-300">晚测</span>`:s.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晚测</span>'}else s.innerHTML='<span>今晚已记录</span><span class="text-slate-300">晚测</span>';const o=parseFloat((m=document.getElementById("input-waist"))==null?void 0:m.value),a=document.getElementById("diff-waist");if(a)if(!isNaN(o)&&A&&A.waist_size!==null&&A.waist_size!==void 0){const u=Math.round((o-A.waist_size)*10)/10;u<0?a.innerHTML=`<span class="text-indigo-600 font-bold">较昨日 ${u.toFixed(1)}</span><span class="text-slate-300">紧实</span>`:u>0?a.innerHTML=`<span class="text-amber-600 font-bold">较昨日 +${u.toFixed(1)}</span><span class="text-slate-300">略增</span>`:a.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">稳定</span>'}else a.innerHTML='<span>平稳区间</span><span class="text-slate-300">标准</span>';const i=parseFloat((h=document.getElementById("sleepDuration"))==null?void 0:h.value),l=document.getElementById("diff-sleep");if(l)if(!isNaN(i)&&A&&A.sleep_hours!==null&&A.sleep_hours!==void 0){const u=Math.round((i-A.sleep_hours)*10)/10;u<0?l.innerHTML=`<span class="text-amber-600 font-bold">较前日 ${u.toFixed(1)}h</span><span class="text-slate-300">偏短</span>`:u>0?l.innerHTML=`<span class="text-emerald-600 font-bold">较前日 +${u.toFixed(1)}h</span><span class="text-slate-300">充足</span>`:l.innerHTML='<span class="text-neutral-800 font-mono font-semibold">较前日 持平</span><span class="text-neutral-300 font-mono">规律</span>'}else l.innerHTML='<span>较昨日 --</span><span class="text-slate-300">节律</span>'}function Ge(){const e=s=>{var o;return String(((o=document.getElementById(s))==null?void 0:o.value)||"").trim()!==""};let t=0;(e("input-weight-am")||e("input-weight-pm"))&&t++,e("input-waist")&&t++,e("sleepDuration")&&t++,we!==null&&t++,N.value!==null&&t++,Ie.touched&&t++;const n=document.getElementById("log-count");n&&(n.innerText=`${t}/6`,n.className=t>=6?"text-emerald-600":"text-slate-600")}function O(){if(Ve)return;ye=!0,Ge(),bt(),X&&clearTimeout(X);const e=W;X=setTimeout(()=>{X=null,zn(e)},400)}function so(){X&&(clearTimeout(X),X=null),ye&&zn(W)}function bt(){const e=document.getElementById("save-text"),t=document.getElementById("save-dot");!e||!t||(ye?(t.className="w-2 h-2 rounded-full bg-amber-400 animate-pulse",e.innerText="未保存"):Ut?(t.className="w-2 h-2 rounded-full bg-emerald-500",e.innerText=`已同步落库${gt?" ("+gt+")":""}`):(t.className="w-2 h-2 rounded-full bg-neutral-300",e.innerText="未修改"))}function Wt(e){return`ht_log_draft_${e}`}function zn(e){if(e=e||W,!!e)try{localStorage.setItem(Wt(e),JSON.stringify(Sn()))}catch{}}function oo(e){try{const t=localStorage.getItem(Wt(e));if(!t)return null;const n=JSON.parse(t);return n&&n.record_date===e?n:null}catch{return null}}function ao(e){try{localStorage.removeItem(Wt(e))}catch{}}async function cn(e){if(e&&e!==W){if(ye){if(!await K(`当前日期还有未保存的改动（草稿已自动保存），确定切换到 ${e}？`,{title:"未保存改动",confirmText:"仍然切换",danger:!1})){const n=document.getElementById("input-date");n&&(n.value=W);return}so()}await nt(e)}}function io(){var o,a,i,l,r,d,m,h,u,g,b,B,I,f,w,$,M,U,z,Fe,Le,Se,_e;const e=document.getElementById("input-date");e&&e.addEventListener("change",y=>cn(y.target.value)),(o=document.getElementById("btn-today-date"))==null||o.addEventListener("click",()=>{const y=R(new Date);cn(y)}),(a=document.getElementById("morningLightPills"))==null||a.addEventListener("click",y=>{const c=y.target.closest("button[data-val]");c&&Us(c.getAttribute("data-val"))}),(i=document.getElementById("input-steps"))==null||i.addEventListener("input",y=>qs(y.target.value)),(l=document.getElementById("btn-clear-steps"))==null||l.addEventListener("click",Vs),(r=document.getElementById("btn-sync-steps"))==null||r.addEventListener("click",()=>rn(!0)),window.onStepPermissionResult=y=>{y?(E("已授权手机计步"),rn(!1)):E("未获得计步权限"),st(W===R(new Date))},["input-weight-am","input-weight-pm","input-waist","sleepBedTime","sleepWakeTime","sleepDuration","input-journal","exerciseDuration","exerciseItems","concertaTime","concertaDose","focusWork","coldShowerTime","coldShowerDuration","coldShowerWaterTemp"].forEach(y=>{const c=document.getElementById(y);c&&c.addEventListener("input",()=>{y==="sleepBedTime"||y==="sleepWakeTime"?Et():Vt(),O()})});const n=document.getElementById("input-journal"),s=document.getElementById("main-content");n&&(n.addEventListener("focus",()=>{s&&(s.style.paddingBottom="320px"),setTimeout(()=>{n.scrollIntoView({behavior:"smooth",block:"center"})},120)}),n.addEventListener("blur",()=>{s&&(s.style.paddingBottom="")}),n.addEventListener("input",()=>{Ht(),Dt()})),(d=document.getElementById("btn-clear-journal"))==null||d.addEventListener("click",async()=>{const y=document.getElementById("input-journal");if(!y||!y.value)return;await K("确定清空自由记录吗？",{title:"清空自由记录",confirmText:"清空",danger:!0})&&(y.value="",Ht(),Dt(),O())}),(m=document.getElementById("lunch-toggle"))==null||m.addEventListener("click",y=>{y.target.closest("#btn-lunch-template")||Js()}),(h=document.getElementById("btn-lunch-template"))==null||h.addEventListener("click",y=>{y.stopPropagation(),Zs()}),(u=document.getElementById("lunch-eaten"))==null||u.addEventListener("click",y=>{const c=y.target.closest(".pill-sm-btn");c&&dn(c)}),(g=document.getElementById("lunch-protein"))==null||g.addEventListener("click",y=>{const c=y.target.closest(".chip");c&&Ys(c)}),["lunch-protein-g","lunch-staple","lunch-carb","lunch-cook"].forEach(y=>{var c;(c=document.getElementById(y))==null||c.addEventListener("click",k=>{const S=k.target.closest(".pill-sm-btn");S&&dn(S)})}),(b=document.getElementById("biohack-toggle"))==null||b.addEventListener("click",to),(B=document.getElementById("exerciseTypePills"))==null||B.addEventListener("click",y=>{const c=y.target.closest(".pill-btn");c&&(no(c.getAttribute("data-val")),O())}),(I=document.getElementById("exerciseIntensityPills"))==null||I.addEventListener("click",y=>{const c=y.target.closest(".pill-sm-btn");c&&(An(c.getAttribute("data-val")),O())}),(f=document.getElementById("concertaEnabled"))==null||f.addEventListener("change",y=>{Nn(y.target.checked),O()}),(w=document.getElementById("focusWork"))==null||w.addEventListener("input",y=>{const c=document.getElementById("focusWorkText");c&&(c.innerText=y.target.value+"分"),O()}),["concertaSideEffects","concertaCompensations"].forEach(y=>{var c;(c=document.getElementById(y))==null||c.addEventListener("click",k=>{const S=k.target.closest(".chip");S&&(S.classList.toggle("active"),O())})}),($=document.getElementById("coldShowerEnabled"))==null||$.addEventListener("change",y=>{Rn(y.target.checked),O()}),(M=document.getElementById("coldShowerTime"))==null||M.addEventListener("change",y=>{At(y.target.value),O()}),(U=document.getElementById("csQuickTimingPills"))==null||U.addEventListener("click",y=>{const c=y.target.closest(".pill-sm-btn");c&&(At(c.getAttribute("data-time")),O())}),(z=document.getElementById("coldShowerDuration"))==null||z.addEventListener("input",y=>{On(y.target.value),O()}),(Fe=document.getElementById("csQuickDurationPills"))==null||Fe.addEventListener("click",y=>{const c=y.target.closest(".pill-sm-btn");c&&(Pn(Number(c.getAttribute("data-sec"))),O())}),(Le=document.getElementById("csFeelingPills"))==null||Le.addEventListener("click",y=>{const c=y.target.closest(".pill-sm-btn");c&&(Fn(c.getAttribute("data-val")),O())}),(Se=document.getElementById("btn-save-log"))==null||Se.addEventListener("click",zs),(_e=document.getElementById("btn-reset-log"))==null||_e.addEventListener("click",()=>nt(W))}let he="all",ae="excel",Ye=0;function lo(e){e.insertAdjacentHTML("beforeend",Ns)}function ro(){var e;(e=document.getElementById("export-modal"))==null||e.classList.remove("hidden"),Un(document.querySelector('#export-type-pills button[data-type="excel"]')),qn(document.querySelector('#export-range-pills button[data-range="all"]'))}function Un(e){var o,a,i,l,r,d;if(!e)return;ae=e.getAttribute("data-type"),document.querySelectorAll("#export-type-pills button").forEach(m=>{const h=m===e;m.className=h?"py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all":"py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"});const t=ae==="json",n=ae==="archive";(o=document.getElementById("export-range-panel"))==null||o.classList.toggle("hidden",t),(a=document.getElementById("export-json-panel"))==null||a.classList.toggle("hidden",!t),(i=document.getElementById("export-archive-panel"))==null||i.classList.toggle("hidden",!n),(l=document.getElementById("export-start-btn"))==null||l.classList.toggle("hidden",t||n),(r=document.getElementById("export-json-btn"))==null||r.classList.toggle("hidden",!t),(d=document.getElementById("export-archive-btn"))==null||d.classList.toggle("hidden",!n);const s=document.getElementById("export-subtitle");s&&(s.textContent=t?"全量备份，包含健康记录与睡前小结":n?"小结表格 + 难忘图片，打包为 ZIP":"导出为 CSV，可用 Excel / WPS 打开"),Vn()}function co(){return ae==="json"?xo():ae==="archive"?ho():mo()}function Gt(){document.getElementById("export-modal").classList.add("hidden")}function uo(e){e.target===e.currentTarget&&Gt()}function qn(e){he=e.getAttribute("data-range"),document.querySelectorAll("#export-range-pills button").forEach(t=>{const n=t===e;t.className=n?"py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all":"py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"}),Vn()}function Vn(){const e=document.getElementById("export-result");e.classList.add("hidden"),e.textContent=""}function po(e){const t=e==="7"?"7d":e==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_export_${t}_${s}.csv`}async function mo(){const e=-new Date().getTimezoneOffset(),t=new URLSearchParams({tz_offset:String(e)});he!=="all"&&t.set("range",he);const n=`/api/v1/export?${t.toString()}`;if(window.HealthTrack){Ye=await Jt(n),ee(!0),window.location.href=n;return}ee(!0);try{const s=await fetch(n);if(!s.ok)throw new Error("HTTP "+s.status);const o=await s.blob(),a=po(he),i=document.createElement("a"),l=URL.createObjectURL(o);i.href=l,i.download=a,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(l),2e3),me(!0,{filename:a,size:o.size,location:"浏览器默认下载目录"}),E("导出成功",!0)}catch(s){me(!1,{message:"导出失败："+(s.message||"网络错误")}),E("导出失败",!1)}finally{ee(!1)}}function fo(){const e=new Date;return`HealthTrack_backup_v2_${""+e.getFullYear()+String(e.getMonth()+1).padStart(2,"0")+String(e.getDate()).padStart(2,"0")}.json`}async function xo(){if(!await K("将导出全部健康记录与睡前小结为一个 JSON 文件（不含小结照片与 AI 洞察），不受时间范围限制。导出后可原样回灌到本应用。",{title:"导出完整备份？",confirmText:"开始导出",danger:!1}))return;const t="/api/v1/export/json";if(window.HealthTrack){Ye=await Jt(t),ee(!0),window.location.href=t;return}ee(!0);try{const n=await fetch(t);if(!n.ok)throw new Error("HTTP "+n.status);const s=await n.blob(),o=fo(),a=document.createElement("a"),i=URL.createObjectURL(s);a.href=i,a.download=o,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3),me(!0,{filename:o,size:s.size,location:"浏览器默认下载目录"}),E("备份已导出",!0)}catch(n){me(!1,{message:"导出失败："+(n.message||"网络错误")}),E("导出失败",!1)}finally{ee(!1)}}function go(e){const t=e==="7"?"7d":e==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_summaries_${t}_${s}.zip`}async function ho(){const e=-new Date().getTimezoneOffset(),t=new URLSearchParams({tz_offset:String(e)});he!=="all"&&t.set("range",he);const n=`/api/v1/export/summaries.zip?${t.toString()}`;if(window.HealthTrack){Ye=await Jt(n),ee(!0),window.location.href=n;return}ee(!0);try{const s=await fetch(n);if(!s.ok)throw new Error("HTTP "+s.status);const o=await s.blob(),a=go(he),i=document.createElement("a"),l=URL.createObjectURL(o);i.href=l,i.download=a,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(l),2e3),me(!0,{filename:a,size:o.size,location:"浏览器默认下载目录"}),E("导出成功",!0)}catch(s){me(!1,{message:"导出失败："+(s.message||"网络错误")}),E("导出失败",!1)}finally{ee(!1)}}function ee(e){const t=ae==="json"?"export-json-btn":ae==="archive"?"export-archive-btn":"export-start-btn",n=document.getElementById(t);n&&(n.disabled=e,n.classList.toggle("opacity-50",e),n.textContent=e?"导出中…":ae==="json"?"导出 JSON 备份":ae==="archive"?"导出图文归档":"开始导出")}function me(e,t){const n=document.getElementById("export-result");if(n.classList.remove("hidden"),e){const s=t.size!=null?`（${Wn(t.size)}）`:"",o=window.HealthTrack?'<button onclick="window.HealthTrack.openDownloads()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>':'<button onclick="exportCurrent()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';n.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",n.innerHTML=`文件已保存：<span class="font-bold break-all">${t.filename}</span>${s}<br>位置：${t.location}<div>${o}</div>`}else n.className="text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600",n.textContent=t.message}function Wn(e){return e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/1024/1024).toFixed(2)+" MB"}async function Jt(e){try{const t=await fetch(e,{method:"HEAD"});if(!t.ok)return null;const n=Number(t.headers.get("Content-Length"));return Number.isFinite(n)&&n>0?n:null}catch{return null}}window.onExportResult=function(e){ee(!1);const t=e&&e.size!=null?e.size:Ye;Ye=null;const n=document.getElementById("export-modal"),s=n&&!n.classList.contains("hidden");e&&e.ok?(s&&me(!0,{filename:e.filename,size:t,location:e.location||"下载目录 Download/"}),E(e.filename?"已保存："+e.filename:"导出成功",!0)):(s&&me(!1,{message:"导出失败："+(e&&e.message||"未知错误")}),E("导出失败："+(e&&e.message||"未知错误"),!1))};let D={token:null,preview:null,mode:"merge",skipErrors:!1,busy:!1};function V(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function H(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",!t)}function It(){D={token:null,preview:null,mode:"merge",skipErrors:!1,busy:!1};const e=document.getElementById("import-file-input");e&&(e.value=""),H("import-step-pick",!0),H("import-step-preview",!1),H("import-step-options",!1),H("import-fatal",!1),H("import-dup-tip",!1),H("import-issue-wrap",!1),H("import-diff-wrap",!1),H("import-result",!1),H("import-skip-wrap",!1),H("import-pick-btn",!0),document.getElementById("import-skip-errors").checked=!1,document.getElementById("import-result").textContent="",document.getElementById("import-subtitle").textContent="预检不写入数据，确认后才会导入",Ke(!1),ke(!1),Jn(document.querySelector('#import-step-options button[data-mode="merge"]'))}function ke(e){D.busy=e;const t=document.getElementById("import-pick-btn");t&&(t.disabled=e,t.classList.toggle("opacity-50",e),t.textContent=e?"预检中…":"选择文件");const n=document.getElementById("memo-preview-btn");n&&(n.disabled=e,n.classList.toggle("opacity-50",e),n.textContent=e?"预检中…":"预检");const s=document.getElementById("import-confirm-btn");s&&e&&(s.disabled=!0,s.classList.add("opacity-50"))}function Ke(e,t){const n=document.getElementById("import-confirm-btn");n&&(n.disabled=!e,n.classList.toggle("opacity-50",!e),n.textContent=t||(D.preview&&D.preview.errors>0&&D.skipErrors?"跳过错误行并导入":"确认导入"))}function Gn(){closeDataSheet(),It(),document.getElementById("import-modal").classList.remove("hidden")}function Yt(){document.getElementById("import-modal").classList.add("hidden")}function bo(e){e.target===e.currentTarget&&Yt()}function vo(){D.busy||document.getElementById("import-file-input").click()}function yo(){It()}function wo(e){const t=e.files&&e.files[0];if(t){if(t.size>5*1024*1024){E("文件超过 5 MB，请按年份拆分后导入",!1),e.value="";return}ko(t)}}async function ko(e){ke(!0);try{const t=new FormData;t.append("file",e),t.append("file_name",e.name||"");const n=await fetch("/api/v1/import/preview",{method:"POST",body:t});let s=null;try{s=await n.json()}catch{s=null}if(!s||s.code!==200||!s.data){const o=s&&s.message||"HTTP "+n.status;vt("预检失败："+o);return}Kt(s.data)}catch(t){vt("预检失败："+(t.message||"网络错误"))}finally{ke(!1)}}function vt(e){H("import-step-pick",!0),H("import-step-preview",!1),H("import-result",!0);const t=document.getElementById("import-result");t.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",t.textContent=e}function Kt(e){D.preview=e,D.token=e.token||null,D.skipErrors=!1,H("import-step-pick",!1),H("import-step-preview",!0),H("import-step-options",!0),H("import-result",!1);const t=e.source_type==="json"?"JSON 备份":e.source_type==="memo"?"备忘录粘贴":"CSV 文件",n=e.file_size?Wn(e.file_size):"",s=e.source_type==="memo"?"":' · <button type="button" onclick="impReselectFile()" class="text-neutral-900 font-semibold underline underline-offset-2">重新选择</button>';document.getElementById("import-file-meta").innerHTML=`<span class="font-bold text-slate-700">${V(e.file_name||t)}</span> · ${t}${n?" · "+n:""} · 编码 ${V(e.encoding||"—")}${s}`,document.getElementById("imp-stat-total").textContent=e.total_rows||0,document.getElementById("imp-stat-inserted").textContent=e.inserted||0,document.getElementById("imp-stat-updated").textContent=e.updated||0,document.getElementById("imp-stat-warnings").textContent=e.warnings||0,document.getElementById("imp-stat-errors").textContent=e.errors||0;const o=document.getElementById("import-dup-tip");e.duplicate?(o.classList.remove("hidden"),o.innerHTML=`这个文件在 ${V((e.duplicate.created_at||"").slice(0,10))} 已导入过一次（新增 ${e.duplicate.inserted} / 更新 ${e.duplicate.updated}），请确认不是重复操作。`):o.classList.add("hidden");const a=document.getElementById("import-fatal");e.fatal?(a.classList.remove("hidden"),a.textContent=e.fatal):a.classList.add("hidden"),Eo(e),Io(e);const i=(e.errors||0)>0;H("import-skip-wrap",i&&!e.fatal),document.getElementById("import-skip-errors").checked=!1,Ke(!!e.token&&!e.fatal&&(!i||D.skipErrors))}function Eo(e){const t=document.getElementById("import-issue-wrap"),n=document.getElementById("import-issue-list"),s=(e.issues||[]).filter(o=>o.level==="error"||o.level==="warning");if(!s.length){t.classList.add("hidden");return}t.classList.remove("hidden"),document.getElementById("import-issue-count").textContent=`共 ${e.errors||0} 条错误 / ${e.warnings||0} 条警告`+(e.issues_truncated?"（仅显示前 500 条）":""),n.innerHTML=s.slice(0,50).map(o=>{const a=o.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${a?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${a?"错误":"警告"}</span>
          <span class="text-[11px] text-slate-600 leading-snug break-all">第 ${o.line} 行${o.date?" · "+V(o.date):""}：${V(o.message)}</span>
        </div>`}).join("")}function Io(e){const t=document.getElementById("import-diff-wrap"),n=document.getElementById("import-diff-list"),s=e.row_diffs||[];if(!s.length){t.classList.add("hidden");return}t.classList.remove("hidden"),document.getElementById("import-diff-count").textContent=`前 ${s.length} 条`+(e.diffs_truncated?"（还有更多）":""),n.innerHTML=s.slice(0,30).map(o=>{const a=o.action==="insert",i=(o.changes||[]).slice(0,4).map(l=>{const r=l.old===""?"空":l.old,d=l.new===""?"空":l.new;return`${l.label} ${r}→${d}`}).join("，");return`<div class="rounded-lg bg-white border border-slate-100 px-2.5 py-1.5">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-slate-700">${V(o.date)}</span>
            <span class="${a?"text-emerald-600":"text-neutral-900 font-semibold"}">${a?"新增":"更新"}</span>
          </div>
          ${i?`<p class="text-[10px] text-slate-400 mt-0.5 break-all">${V(i)}</p>`:""}
        </div>`}).join("")}function Jn(e){e&&(D.mode=e.getAttribute("data-mode"),document.querySelectorAll("#import-step-options button[data-mode]").forEach(t=>{const n=t===e;t.className=n?"w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50 transition-all":"w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white transition-all"}))}function To(e){D.skipErrors=!!(e&&e.checked);const t=D.preview,n=!!(t&&(t.errors||0)>0);Ke(!!(t&&t.token&&!t.fatal&&(!n||D.skipErrors)))}async function Bo(){if(D.busy)return;if(!D.token){E("预检已失效，请重新选择文件",!1);return}const e=D.preview||{};if((e.errors||0)>0&&!D.skipErrors){E("存在错误行：请勾选「跳过错误行」，或修正文件后重新导入",!1);return}const t=D.mode==="overwrite"?"替换（空值会清空旧数据）":"合并（空单元格保留旧值）";if(!await K(`将写入 ${e.inserted||0} 条新增记录、更新 ${e.updated||0} 条已有记录，冲突处理方式：${t}${D.skipErrors?"，并跳过 "+(e.errors||0)+" 条错误行":""}。写入过程为单个事务，失败会整体回滚。`,{title:"确认导入？",confirmText:"开始导入",danger:!1}))return;ke(!0);const s=document.getElementById("import-result");try{const o=await fetch("/api/v1/import/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:D.token,conflict_mode:D.mode,skip_errors:D.skipErrors})});let a=null;try{a=await o.json()}catch{a=null}const i=a&&a.data?a.data:null,l=a&&a.code===200&&i;if(s.classList.remove("hidden"),!l){const r=a&&a.message||"HTTP "+o.status;s.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",s.textContent=(o.status===409?"预检已过期，请重新选择文件：":"导入失败：")+r,Ke(!1),E("导入失败",!1);return}s.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",s.innerHTML=`<span class="font-bold">导入完成</span><br>新增 ${i.inserted||0} 条 · 更新 ${i.updated||0} 条${i.skipped?" · 跳过 "+i.skipped+" 行":""}<br>可在「导入记录」中查看本次明细。`,H("import-step-options",!1),H("import-skip-wrap",!1),D.token=null,Ke(!1,"已完成"),E("导入完成",!0),Lo()}catch(o){s.classList.remove("hidden"),s.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",s.textContent="导入失败："+(o.message||"网络错误"),E("导入失败",!1)}finally{ke(!1)}}function Lo(){var e;if(currentTab==="log"){const t=(e=document.getElementById("input-date"))==null?void 0:e.value;t&&nt(t)}else switchTab(currentTab)}function Yn(){closeDataSheet();const e=document.getElementById("memo-year-base");if(e){const t=new Date().getFullYear();e.innerHTML=[t,t-1,t-2].map(n=>`<option value="${n}">${n} 年</option>`).join("")}document.getElementById("memo-import-modal").classList.remove("hidden")}function ot(){document.getElementById("memo-import-modal").classList.add("hidden")}function So(e){e.target===e.currentTarget&&ot()}async function _o(){const e=document.getElementById("memo-import-text").value||"";if(!e.trim()){E("请先粘贴备忘录内容",!1);return}const t=Number(document.getElementById("memo-year-base").value)||new Date().getFullYear();ot(),It(),document.getElementById("import-modal").classList.remove("hidden"),H("import-step-pick",!1),document.getElementById("import-subtitle").textContent="正在预检粘贴内容…",ke(!0);try{const n=await fetch("/api/v1/import/preview",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memo:e,year_base:t})});let s=null;try{s=await n.json()}catch{s=null}if(document.getElementById("import-subtitle").textContent="预检不写入数据，确认后才会导入",!s||s.code!==200||!s.data){const o=s&&s.message||"HTTP "+n.status;H("import-step-pick",!0),document.getElementById("import-pick-btn").textContent="选择文件",vt("预检失败："+o)}else Kt(s.data)}catch(n){document.getElementById("import-subtitle").textContent="预检不写入数据，确认后才会导入",H("import-step-pick",!0),document.getElementById("import-pick-btn").textContent="选择文件",vt("预检失败："+(n.message||"网络错误"))}finally{ke(!1)}}const $o={success:{label:"成功",cls:"bg-emerald-50 text-emerald-600"},partial:{label:"部分成功",cls:"bg-amber-50 text-amber-700"},failed:{label:"失败",cls:"bg-rose-50 text-rose-600"},interrupted:{label:"中断",cls:"bg-rose-50 text-rose-600"},pending:{label:"进行中",cls:"bg-slate-100 text-slate-500"}};function Kn(){closeDataSheet(),document.getElementById("import-batches-modal").classList.remove("hidden"),Co()}function at(){document.getElementById("import-batches-modal").classList.add("hidden")}function Mo(e){e.target===e.currentTarget&&at()}async function Co(){const e=document.getElementById("batches-list");e.innerHTML='<p class="text-xs text-slate-400 text-center py-8">加载中…</p>';try{const n=await(await fetch("/api/v1/import/batches?limit=20")).json(),s=n&&n.code===200&&Array.isArray(n.data)?n.data:[];jo(s)}catch(t){e.innerHTML=`<p class="text-xs text-rose-500 text-center py-8">加载失败：${V(t.message||"网络错误")}</p>`}}function jo(e){const t=document.getElementById("batches-list");if(!e.length){t.innerHTML='<p class="text-xs text-slate-400 text-center py-8">还没有导入记录</p>';return}t.innerHTML=e.map(n=>{const s=$o[n.status]||{label:n.status,cls:"bg-slate-100 text-slate-500"},o=n.source_type==="json"?"JSON 备份":n.source_type==="memo"?"备忘录":"CSV",a=String(n.created_at||"").replace("T"," ").slice(0,16),i=[];return i.push(`<button type="button" onclick="impToggleBatchDetail(${n.id})" class="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200">详情</button>`),n.has_cache&&n.errors>0&&i.push(`<button type="button" onclick="downloadFailedRows(${n.id})" class="px-2.5 py-1 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 hover:bg-amber-200">失败行</button>`),n.retryable&&i.push(`<button type="button" onclick="impRetryBatch(${n.id})" class="px-2.5 py-1 rounded-lg bg-neutral-900 text-[11px] font-mono font-medium text-white hover:bg-neutral-800">重试</button>`),`<div class="rounded-xl border border-neutral-200 px-3.5 py-3">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-bold text-slate-800 truncate">${V(n.file_name||o)}</p>
            <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}">${s.label}</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">${o} · ${V(a)} · 共 ${n.total_rows||0} 行${n.attempt_no>1?" · 第 "+n.attempt_no+" 次尝试":""}</p>
          <p class="text-[11px] text-slate-500 mt-1">新增 ${n.inserted||0} · 更新 ${n.updated||0} · 跳过 ${n.skipped||0} · 警告 ${n.warnings||0} · 错误 ${n.errors||0}</p>
          ${n.error_message?`<p class="text-[10px] text-rose-500 mt-1 break-all">${V(n.error_message)}</p>`:""}
          <div class="flex flex-wrap gap-1.5 mt-2">${i.join("")}</div>
          <div id="batch-issues-${n.id}" class="hidden mt-2 space-y-1"></div>
        </div>`}).join("")}function Do(e){const t=document.getElementById("batch-issues-"+e);if(t){if(!t.classList.contains("hidden")){t.classList.add("hidden");return}t.classList.remove("hidden"),t.dataset.loaded!=="1"&&(t.dataset.loaded="1",t.innerHTML='<p class="text-[11px] text-slate-400">加载中…</p>',fetch(`/api/v1/import/batches/${e}`).then(n=>n.json()).then(n=>{const s=n&&n.code===200&&n.data&&n.data.issues?n.data.issues:[];if(!s.length){t.innerHTML='<p class="text-[11px] text-slate-400">没有行级问题</p>';return}t.innerHTML=s.slice(0,50).map(o=>{const a=o.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2 py-1">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${a?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${a?"错误":"警告"}</span>
            <span class="text-[10px] text-slate-600 leading-snug break-all">第 ${o.line} 行${o.date?" · "+V(o.date):""}：${V(o.message)}</span>
          </div>`}).join("")}).catch(()=>{t.innerHTML='<p class="text-[11px] text-rose-500">明细加载失败</p>'}))}}async function Xn(e){try{const n=await(await fetch(`/api/v1/import/batches/${e}/retry`,{method:"POST"})).json();if(!n||n.code!==200||!n.data){E(n&&n.message||"重试失败",!1);return}at(),It(),document.getElementById("import-modal").classList.remove("hidden"),Kt(n.data),E("已重新预检，请确认后写入",!0)}catch(t){E("重试失败："+(t.message||"网络错误"),!1)}}function Ho(e){at(),Zn(`/api/v1/import/batches/${e}/failed-rows`,`HealthTrack_failed_rows_${e}.csv`,"失败行已下载，可修正后重新导入")}function Ao(){closeDataSheet(),Zn("/api/v1/import/template","HealthTrack_import_template.csv","模板已下载")}async function Zn(e,t,n){if(window.HealthTrack){window.location.href=e,E("已开始下载",!0);return}try{const s=await fetch(e);if(!s.ok)throw new Error("HTTP "+s.status);const o=await s.blob(),a=document.createElement("a"),i=URL.createObjectURL(o);a.href=i,a.download=t,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3),E(n||"文件已下载",!0)}catch(s){E("下载失败："+(s.message||"网络错误"),!1)}}const No=Gn,Ro=Yn,Oo=Kn,Po=Yt,Fo=at;window.openExportModal=ro;window.closeExport=Gt;window.closeExportModal=Gt;window.closeExportOnBackdrop=uo;window.selectExportType=Un;window.selectExportRange=qn;window.exportCurrent=co;window.openImportModal=No;window.openImportFromSheet=Gn;window.closeImport=Yt;window.closeImportModal=Po;window.closeImportOnBackdrop=bo;window.impPickFile=vo;window.impReselectFile=yo;window.impFileSelected=wo;window.impSelectMode=Jn;window.impToggleSkipErrors=To;window.impConfirm=Bo;window.openMemoImportModal=Ro;window.openMemoFromSheet=Yn;window.closeMemo=ot;window.closeMemoModal=ot;window.closeMemoImportModal=ot;window.closeMemoOnBackdrop=So;window.impPreviewMemo=_o;window.openImportBatchesModal=Oo;window.openImportBatchesFromSheet=Kn;window.closeBatches=at;window.closeImportBatchesModal=Fo;window.closeBatchesOnBackdrop=Mo;window.impToggleBatchDetail=Do;window.impRetryBatch=Xn;window.retryBatch=Xn;window.downloadFailedRows=Ho;window.downloadImportTemplate=Ao;const zo=`      <section id="view-dash" class="fade-in space-y-4 hidden">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold text-slate-900">数据趋势看板</h2>
          <div class="flex bg-slate-200/70 p-0.5 rounded-xl text-xs font-semibold">
            <button onclick="switchDashRange(7)" id="btn-range-7" class="px-3 py-1 rounded-lg bg-white shadow-sm text-blue-600 transition-all">近7天</button>
            <button onclick="switchDashRange(30)" id="btn-range-30" class="px-3 py-1 rounded-lg text-slate-600 transition-all">近30天</button>
            <button onclick="switchDashRange(60)" id="btn-range-60" class="px-3 py-1 rounded-lg text-slate-600 transition-all">近60天</button>
          </div>
        </div>

        <!-- 60天详情入口（独立视图，逐日；与周平均趋势互补） -->
        <button onclick="openTrendDetailView()" class="w-full flex items-center justify-between apple-card hover:border-blue-300 rounded-2xl px-4 py-3 transition-all active:scale-[0.99]">
          <span class="flex items-center space-x-2.5 min-w-0">
            <svg class="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span class="text-xs font-medium text-neutral-800 shrink-0">60 天详情</span>
            <span class="text-[10px] text-slate-400 truncate">四指标 · 逐日全量跟踪</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- 周平均趋势分析入口（独立视图，不占用底部导航） -->
        <button onclick="openTrendView()" class="w-full flex items-center justify-between apple-card hover:border-emerald-300 rounded-2xl px-4 py-3 transition-all active:scale-[0.99]">
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
          <button onclick="switchTab('dash')" class="flex items-center space-x-0.5 text-slate-500 hover:text-slate-800 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span class="text-xs font-bold">返回</span>
          </button>
          <h2 class="text-sm font-bold text-neutral-900">周平均趋势</h2>
          <span class="w-12"></span>
        </div>

        <!-- 指标切换：体重 / 腰围 / 睡眠 / 步数，各一条周平均曲线 -->
        <div class="flex space-x-1.5">
          <button onclick="setTrendMetric('weight')" id="trend-tab-weight" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all">体重</button>
          <button onclick="setTrendMetric('waist')" id="trend-tab-waist" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">腰围</button>
          <button onclick="setTrendMetric('sleep')" id="trend-tab-sleep" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">睡眠</button>
          <button onclick="setTrendMetric('steps')" id="trend-tab-steps" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">步数</button>
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
            <button onclick="switchTab('dash')" class="flex items-center space-x-0.5 text-slate-500 hover:text-slate-800 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              <span class="text-xs font-bold">返回</span>
            </button>
            <h2 class="text-sm font-bold text-neutral-900">60天详情</h2>
            <span id="td-header-spacer" class="w-12"></span>
          </div>

          <!-- 指标切换：体重 / 腰围 / 睡眠 / 步数 -->
          <div id="td-tabs" class="flex space-x-1.5">
            <button onclick="setTrendDetailMetric('weight')" id="td-tab-weight" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all">体重</button>
            <button onclick="setTrendDetailMetric('waist')" id="td-tab-waist" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">腰围</button>
            <button onclick="setTrendDetailMetric('sleep')" id="td-tab-sleep" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">睡眠</button>
            <button onclick="setTrendDetailMetric('steps')" id="td-tab-steps" class="flex-1 py-2 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">步数</button>
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

      <!-- 3. AI 洞察页 (Insight View) -->`;function _(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function de(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,'<code class="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono text-neutral-800">$1</code>')}function Uo(e){return/^\s*\|[\s:|\-]+\|\s*$/.test(e)&&e.includes("-")}function un(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(n=>de(n.trim()))}function Ne(e){if(!e)return"";const n=_(e).replace(/\r\n?/g,`
`).split(`
`);let s="",o=null;const a=()=>{o&&(s+=`</${o}>`,o=null)};for(let i=0;i<n.length;i++){const l=n[i],r=l.trim();if(/^\|.*\|$/.test(r)&&i+1<n.length&&Uo(n[i+1])){a();const B=un(r);i+=1;const I=[];for(;i+1<n.length&&/^\|.*\|$/.test(n[i+1].trim());)i+=1,I.push(un(n[i].trim()));const f=B.map($=>`<th class="text-left font-semibold text-neutral-700 px-2 py-1.5 border-b border-neutral-200 bg-neutral-50 whitespace-nowrap">${$}</th>`).join(""),w=I.map($=>`<tr>${B.map((U,z)=>`<td class="px-2 py-1.5 border-b border-neutral-100 text-neutral-700 align-top">${$[z]??""}</td>`).join("")}</tr>`).join("");s+=`<div class="overflow-x-auto my-2 rounded-lg border border-neutral-200"><table class="w-full text-[11px] font-mono border-collapse"><thead><tr>${f}</tr></thead><tbody>${w}</tbody></table></div>`;continue}if(/^---+$/.test(r)){a(),s+='<hr class="my-3 border-neutral-200">';continue}const d=l.match(/^###\s+(.*)$/);if(d){a(),s+=`<h3 class="font-bold text-neutral-800 text-sm mt-3 mb-1.5 pb-1 border-b border-neutral-100">${de(d[1])}</h3>`;continue}const m=l.match(/^##\s+(.*)$/);if(m){a(),s+=`<h2 class="font-bold text-neutral-900 text-base mt-4 mb-2">${de(m[1])}</h2>`;continue}const h=l.match(/^#\s+(.*)$/);if(h){a(),s+=`<h1 class="font-bold text-neutral-900 text-lg mt-4 mb-2">${de(h[1])}</h1>`;continue}const u=l.match(/^&gt;\s?(.*)$/);if(u){a(),s+=`<blockquote class="border-l-2 border-neutral-300 pl-2.5 my-2 text-xs text-neutral-500 leading-relaxed">${de(u[1])}</blockquote>`;continue}const g=l.match(/^[*-]\s+(.*)$/);if(g){o!=="ul"&&(a(),s+='<ul class="list-disc pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">',o="ul"),s+=`<li>${de(g[1])}</li>`;continue}const b=l.match(/^\d+\.\s+(.*)$/);if(b){o!=="ol"&&(a(),s+='<ol class="list-decimal pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">',o="ol"),s+=`<li>${de(b[1])}</li>`;continue}a(),r&&(s+=`<p class="my-1.5 text-xs text-neutral-700 leading-relaxed">${de(l)}</p>`)}return a(),s}window.escapeHtml=_;window.renderMarkdown=Ne;let Xe=7,ct=null,ut=null,pt=null,mt=null;function qo(){typeof Chart<"u"&&Chart.defaults&&(Chart.defaults.font.family="'JetBrains Mono', 'Cascadia Code', monospace",Chart.defaults.font.size=10,Chart.defaults.color="#a3a3a3",Chart.defaults.plugins.tooltip.backgroundColor="#171717",Chart.defaults.plugins.tooltip.titleColor="#ffffff",Chart.defaults.plugins.tooltip.bodyColor="#d4d4d4",Chart.defaults.plugins.tooltip.padding=10,Chart.defaults.plugins.tooltip.cornerRadius=8,Chart.defaults.plugins.tooltip.titleFont={family:"'JetBrains Mono', monospace",weight:"600",size:11},Chart.defaults.plugins.tooltip.bodyFont={family:"'JetBrains Mono', monospace",size:10})}function Vo(e){if(!e)return[];let t=Array.isArray(e.types)?e.types.slice():[];return t.length===0&&e.type&&(t=[e.type]),t.filter(n=>n&&n!=="none")}function Wo(e){e.insertAdjacentHTML("beforeend",zo),qo(),Go()}function Go(){var e,t,n;(e=document.getElementById("btn-range-7"))==null||e.addEventListener("click",()=>Je(7)),(t=document.getElementById("btn-range-30"))==null||t.addEventListener("click",()=>Je(30)),(n=document.getElementById("btn-range-60"))==null||n.addEventListener("click",()=>Je(60))}function Jo(){Je(Xe)}function Je(e){Xe=e,ie.set({dashRange:e}),["7","30","60"].forEach(t=>{const n=document.getElementById("btn-range-"+t);n&&(n.className=Number(t)===e?"px-3 py-1 rounded-md bg-white border border-neutral-200 text-neutral-900 font-mono font-medium shadow-sm transition-all":"px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-900 font-mono font-medium transition-all")}),Yo(e)}async function Yo(e=Xe){Xe=e;const t=R(new Date),n=Ce(t,-(e-1));try{const s=await se.getHistoryRecords(n,t),o=s&&s.data?s.data:Array.isArray(s)?s:[];Ko(o,n,e)}catch(s){console.error("加载看板数据失败:",s)}}function Ko(e,t,n){const s=Object.create(null);e.forEach(c=>{c&&c.record_date&&(s[c.record_date]=c)});const o=n||Xe||7,a=t||Ce(R(new Date),-(o-1)),i=[];for(let c=0;c<o;c++)i.push(Ce(a,c));const l=i.map(c=>s[c]||{record_date:c}),r=i.map(c=>c.slice(5)),d=l.map(c=>c.weight_am===null||c.weight_am===void 0?null:c.weight_am),m=l.map(c=>c.weight_pm===null||c.weight_pm===void 0?null:c.weight_pm),h=l.map(c=>c.waist_size===null||c.waist_size===void 0?null:c.waist_size),u=l.map(c=>c.sleep_hours===null||c.sleep_hours===void 0?null:c.sleep_hours),g=l.map(c=>c.sleep_hours===null||c.sleep_hours===void 0?"transparent":c.sleep_tag==="RED"?"#f43f5e":c.sleep_tag==="YELLOW"?"#fbbf24":"#34c759"),b=d.filter(c=>c!=null);if(b.length>0){const c=b[b.length-1];document.getElementById("dash-weight-stat").innerText=`${c} kg`}else document.getElementById("dash-weight-stat").innerText="--";const B=u.filter(c=>c!=null);if(B.length>0){const c=(B.reduce((k,S)=>k+S,0)/B.length).toFixed(1);document.getElementById("dash-sleep-stat").innerText=`${c} 小时 (均值)`}else document.getElementById("dash-sleep-stat").innerText="--";const I=document.getElementById("dash-weight-detail");I&&(I.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日睡前重 / 晨重</span>');const f=document.getElementById("chart-weight");if(f){ct&&(ct.destroy(),ct=null);const c=typeof Chart<"u"&&Chart.getChart?Chart.getChart(f):null;c&&c.destroy();const k=f.getContext("2d"),S=k.createLinearGradient(0,0,0,160);S.addColorStop(0,"rgba(245, 158, 11, 0.08)"),S.addColorStop(1,"rgba(245, 158, 11, 0.00)");const j=k.createLinearGradient(0,0,0,160);j.addColorStop(0,"rgba(30, 41, 59, 0.06)"),j.addColorStop(1,"rgba(30, 41, 59, 0.00)"),ct=new Chart(k,{type:"line",data:{labels:r,datasets:[{label:"睡前体重",data:m,borderColor:"#f59e0b",borderWidth:2,backgroundColor:S,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#f59e0b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16},{label:"晨起体重",data:d,borderColor:"#1e293b",borderWidth:2.2,backgroundColor:j,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#1e293b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{itemSort:(T,L)=>T.datasetIndex-L.datasetIndex}},onClick:(T,L)=>{if(!L||!L.length)return;const F=l[L[0].index];if(!F||F.weight_am==null&&F.weight_pm==null)return;const lt=le=>le==null?"--":`${le} kg`,rt=F.weight_am,dt=F.weight_pm;let on="";if(rt!=null&&dt!==null&&dt!==void 0){const le=Math.round((dt-rt)*10)/10;let ze;le<.3?ze="偏低，可能高钠储水":le<.4?ze="偏低":le<=.9?ze="正常":ze="偏高",on=` · 夜间排水 <b class="text-slate-700">${le.toFixed(1)} kg</b>（${ze}）`}I.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${F.record_date}</b>　睡前 ${lt(dt)} · 晨起 ${lt(rt)}${on}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}const w=h.filter(c=>c!=null);w.length>0?document.getElementById("dash-waist-stat").innerText=`${w[w.length-1]} cm`:document.getElementById("dash-waist-stat").innerText="--";const $=document.getElementById("dash-waist-detail");$&&($.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>');const M=document.getElementById("chart-waist");if(M){ut&&(ut.destroy(),ut=null);const c=typeof Chart<"u"&&Chart.getChart?Chart.getChart(M):null;c&&c.destroy();const k=M.getContext("2d"),S=k.createLinearGradient(0,0,0,160);S.addColorStop(0,"rgba(124, 58, 237, 0.10)"),S.addColorStop(1,"rgba(124, 58, 237, 0.00)"),ut=new Chart(k,{type:"line",data:{labels:r,datasets:[{label:"腰围",data:h,borderColor:"#7c3aed",borderWidth:2.2,backgroundColor:S,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#7c3aed",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(j,T)=>{if(!T||!T.length)return;const L=l[T[0].index];if(!L||L.waist_size==null)return;const F=L.waist_size===null||L.waist_size===void 0?"--":`${L.waist_size} cm`;$.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${L.record_date}</b>　腰围 ${F}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}const U=document.getElementById("dash-sleep-detail");U&&(U.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>');const z=document.getElementById("chart-sleep");if(z){pt&&(pt.destroy(),pt=null);const c=typeof Chart<"u"&&Chart.getChart?Chart.getChart(z):null;c&&c.destroy();const k=z.getContext("2d");pt=new Chart(k,{type:"bar",data:{labels:r,datasets:[{data:u,backgroundColor:g,borderRadius:8,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},onHover:(S,j)=>{S.native.target.style.cursor=j.length?"pointer":"default"},onClick:(S,j)=>{if(!j||!j.length)return;const T=l[j[0].index];if(!T||T.sleep_hours==null&&!T.sleep_start_time)return;const L=T.sleep_tag==="RED"?"熬夜":T.sleep_tag==="YELLOW"?"轻度":"正常",F=T.sleep_hours===null||T.sleep_hours===void 0?"--":`${T.sleep_hours} 小时`;U.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${T.record_date}</b>　就寝 ${T.sleep_start_time||"--"} · 起床 ${T.sleep_end_time||"--"} · ${F} · ${L}</span>`},scales:{y:{beginAtZero:!0,max:12,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}const Fe=l.map(c=>c.steps===null||c.steps===void 0?null:Number(c.steps)),Le=Fe.filter(c=>c!==null);if(Le.length>0){const c=Math.round(Le.reduce((k,S)=>k+S,0)/Le.length);document.getElementById("dash-steps-stat").innerText=`${c.toLocaleString("en-US")} 步 (均值)`}else document.getElementById("dash-steps-stat").innerText="--";const Se=document.getElementById("dash-steps-detail");Se&&(Se.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>');const _e=document.getElementById("chart-steps");if(_e){mt&&(mt.destroy(),mt=null);const c=typeof Chart<"u"&&Chart.getChart?Chart.getChart(_e):null;c&&c.destroy();const k=_e.getContext("2d"),S=k.createLinearGradient(0,0,0,160);S.addColorStop(0,"rgba(234, 88, 12, 0.16)"),S.addColorStop(1,"rgba(234, 88, 12, 0.00)"),mt=new Chart(k,{type:"line",data:{labels:r,datasets:[{label:"步数",data:Fe,borderColor:"#ea580c",borderWidth:2.2,backgroundColor:S,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#ea580c",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onHover:(j,T)=>{j.native.target.style.cursor=T.length?"pointer":"default"},onClick:(j,T)=>{if(!T||!T.length)return;const L=l[T[0].index];if(!L||L.steps===null||L.steps===void 0)return;const F=`${Number(L.steps).toLocaleString("en-US")} 步`,lt=L.morning_light===!0?" · 已见晨光":"";Se.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${L.record_date}</b>　步数 ${F}${lt}</span>`},scales:{y:{beginAtZero:!0,max:2e4,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#94a3b8",stepSize:5e3,callback:j=>j===0?"0":`${j/1e4}万`}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}})}const y=document.getElementById("dash-activities-list");if(e.length===0)y.innerHTML='<p class="text-slate-400 text-center py-2">暂无记录</p>';else{const c=[];e.slice().reverse().forEach(k=>{const S=Vo(k.exercise);if(k.journal_text||k.activity_tags||S.length>0||k.concerta&&k.concerta.taken||k.cold_shower&&k.cold_shower.enabled){let j="";if(k.activity_tags)try{const T=JSON.parse(k.activity_tags);Array.isArray(T)&&(j+=T.map(L=>`<span class="bg-neutral-100 text-neutral-700 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono mr-1">${_(L)}</span>`).join(""))}catch{}if(S.length>0&&(S.includes("strength")&&(j+='<span class="bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">无氧</span>'),S.includes("cardio")&&(j+='<span class="bg-sky-50 text-sky-700 border border-sky-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">有氧</span>'),S.filter(T=>T!=="strength"&&T!=="cardio").forEach(T=>{j+=`<span class="bg-slate-100 text-slate-700 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">${_(T)}</span>`})),k.cold_shower&&k.cold_shower.enabled){const T=k.cold_shower.water_temp===null||k.cold_shower.water_temp===void 0?"":` ${k.cold_shower.water_temp}℃`;let L=k.cold_shower.duration,F="";L!=null&&L>0&&(L<=10&&(L=L*60),F=` · ${L}s`),j+=`<span class="bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">冷水澡${_(T)}${F}</span>`}if(k.concerta&&k.concerta.taken){const T=k.concerta.dose?` ${_(k.concerta.dose)}mg`:"";j+=`<span class="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">专注达${T}</span>`}c.push(`
              <div class="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
                <div class="flex justify-between items-start gap-2 mb-1.5">
                  <span class="font-bold text-neutral-800 font-mono text-xs shrink-0">${_(k.record_date||"")}</span>
                  <div class="flex flex-wrap gap-1 items-center justify-end">${j}</div>
                </div>
                <p class="text-neutral-600 line-clamp-2">${_(k.journal_text||"无文字备注")}</p>
              </div>
            `)}}),y.innerHTML=c.length>0?c.join(""):'<p class="text-neutral-400 text-center py-2 font-mono text-xs">暂无活动记录</p>'}}const Xo=12,Zo={weight:{label:"体重周均值 (kg)",field:"weight_am",unit:"kg",color:"#1e293b",band:"rgba(30, 41, 59, 0.08)"},waist:{label:"腰围周均值 (cm)",field:"waist_size",unit:"cm",color:"#7c3aed",band:"rgba(124, 58, 237, 0.08)"},sleep:{label:"睡眠周均值 (小时)",field:"sleep_hours",unit:"小时",color:"#4f46e5",band:"rgba(79, 70, 229, 0.12)"},steps:{label:"步数周均值 (步)",field:"steps",unit:"步",color:"#ea580c",band:"rgba(234, 88, 12, 0.08)",int:!0}};let ue={metric:"weight",records:[],buckets:[],aggs:[]},ft=null;function Qo(e){const t=new Date(e.getFullYear(),e.getMonth(),e.getDate());return t.setDate(t.getDate()-(t.getDay()+6)%7),t}function Qn(){const e=Qo(new Date),t=[];for(let n=Xo-1;n>=0;n--){const s=new Date(e);s.setDate(e.getDate()-n*7);const o=new Date(s);o.setDate(s.getDate()+6),t.push({start:R(s),end:R(o)})}return t}function ea(e,t,n){return t.map(s=>{const o=[];return e.forEach(i=>{if(i.record_date>=s.start&&i.record_date<=s.end){const l=i[n];l!=null&&l!==""&&!isNaN(Number(l))&&o.push(Number(l))}}),o.length===0?{avg:null,min:null,max:null,n:0}:{avg:o.reduce((i,l)=>i+l,0)/o.length,min:Math.min(...o),max:Math.max(...o),n:o.length}})}function ta(){es(ue.metric),typeof window.switchTab=="function"&&window.switchTab("trend")}function es(e){ue.metric=e,["weight","waist","sleep","steps"].forEach(t=>{const n=document.getElementById(`trend-tab-${t}`);n&&(n.className=t===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),ie.state.currentTab==="trend"&&ts()}async function na(){const t=Qn()[0].start,n=R(new Date);try{const s=await se.getHistoryRecords(t,n);ue.records=s&&s.data?s.data:Array.isArray(s)?s:[]}catch{ue.records=[]}ts()}function ts(){const e=Zo[ue.metric],t=f=>e.int?Math.round(f).toLocaleString("en-US"):f.toFixed(1),n=Qn(),s=ea(ue.records,n,e.field);ue.buckets=n,ue.aggs=s;const o=n.map(f=>f.start.slice(5)),a=s.map(f=>f.max),i=s.map(f=>f.min),l=s.map(f=>f.avg),r=s.map(f=>f.n>=1&&f.n<=3),d=document.getElementById("trend-metric-label");d&&(d.innerText=e.label);const m=document.getElementById("trend-metric-stat"),h=document.getElementById("trend-metric-note");let u=-1;for(let f=s.length-1;f>=0;f--)if(s[f].n>0){u=f;break}if(u>=0){const f=s[u],w=n[u];m&&(m.innerText=`${t(f.avg)} ${e.unit}`),h&&(h.innerHTML=`${w.start.slice(5)}~${w.end.slice(5)} 周均值<br>${f.n} 天数据${f.n<=3?"（低置信）":""}`)}else m&&(m.innerText="--"),h&&(h.innerHTML="近 12 周暂无数据");const g=document.getElementById("trend-detail");g&&(g.innerHTML=u>=0?'<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>':'<span class="font-mono text-[10px] text-neutral-400">近 12 周暂无该指标数据，记录几天后再来看看</span>');const b=document.getElementById("chart-trend");if(!b)return;ft&&(ft.destroy(),ft=null);const B=typeof Chart<"u"&&Chart.getChart?Chart.getChart(b):null;B&&B.destroy();const I=b.getContext("2d");ft=new Chart(I,{type:"line",data:{labels:o,datasets:[{label:"周内最大",data:a,borderColor:"transparent",backgroundColor:e.band,pointRadius:0,pointHoverRadius:0,fill:{target:1},spanGaps:!1,tension:.25},{label:"周内最小",data:i,borderColor:"transparent",backgroundColor:"transparent",pointRadius:0,pointHoverRadius:0,spanGaps:!1,tension:.25},{label:"周均值",data:l,borderColor:e.color,backgroundColor:e.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:f=>r[f.dataIndex]?4:3,pointBackgroundColor:f=>r[f.dataIndex]?"#ffffff":e.color,pointBorderColor:e.color,pointBorderWidth:f=>r[f.dataIndex]?2:0,segment:{borderDash:f=>r[f.p1DataIndex]||r[f.p0DataIndex]?[5,4]:void 0}}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{filter:f=>f.datasetIndex===2,displayColors:!1,callbacks:{title:f=>{const w=n[f[0].dataIndex];return`${w.start} ~ ${w.end}`},label:f=>{const w=s[f.dataIndex];return!w||w.n===0?"该周无数据":[`周均值：${t(w.avg)} ${e.unit}`,`区间：${t(w.min)} ~ ${t(w.max)}`,`样本：${w.n} 天${w.n<=3?"（低置信）":""}`]}}}},scales:{y:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:6}}},onClick:(f,w)=>{let $=-1;if((w||[]).forEach(z=>{z.datasetIndex===2&&($=z.index)}),$<0)return;const M=s[$],U=n[$];!M||M.n===0||(g.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${U.start} ~ ${U.end}</b>　均值 ${t(M.avg)} ${e.unit} · 区间 ${t(M.min)}~${t(M.max)} · ${M.n} 天${M.n<=3?"（低置信）":""}</span>`)}}})}const yt=60,sa=26,oa=yt*sa,aa=560,ia={weight:{label:"体重逐日 (kg)",field:"weight_am",unit:"kg",color:"#1e293b"},waist:{label:"腰围逐日 (cm)",field:"waist_size",unit:"cm",color:"#7c3aed"},sleep:{label:"睡眠时长逐日 (小时)",field:"sleep_hours",unit:"小时",color:"#4f46e5",avg:!0},steps:{label:"步数逐日 (步)",field:"steps",unit:"步",color:"#ea580c",avg:!0,yMax:2e4,yStep:5e3,fmt:e=>e.toLocaleString("en-US")}};let pe={metric:"weight",records:[]},$e=null;function ns(){const e=[],t=new Date;for(let n=yt-1;n>=0;n--){const s=new Date(t.getFullYear(),t.getMonth(),t.getDate());s.setDate(s.getDate()-n),e.push(R(s))}return e}function la(){return window.matchMedia("(orientation: landscape) and (max-height: 600px)").matches}function ra(){const e=document.getElementById("app-frame");e&&e.classList.toggle("frame-wide",ie.state.currentTab==="trend-detail"&&la())}function da(){const e=document.getElementById("td-chart-box"),t=document.getElementById("td-chart-scroll");if(!e||!t)return;const n=t.clientWidth>=aa;e.style.width=n?"100%":`${oa}px`,e.style.height=n?"150px":"220px",$e&&$e.resize()}function ss(){ra(),da()}function ca(){const e=()=>{ie.state.currentTab==="trend-detail"&&ss()};window.addEventListener("resize",e);const t=window.matchMedia("(orientation: landscape) and (max-height: 600px)");t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}function ua(){os(pe.metric),typeof window.switchTab=="function"&&window.switchTab("trend-detail")}function os(e){pe.metric=e,["weight","waist","sleep","steps"].forEach(t=>{const n=document.getElementById(`td-tab-${t}`);n&&(n.className=t===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),ie.state.currentTab==="trend-detail"&&as()}async function pa(){const e=ns(),t=e[0],n=e[e.length-1];try{const s=await se.getHistoryRecords(t,n);pe.records=s&&s.data?s.data:Array.isArray(s)?s:[]}catch{pe.records=[]}as()}function ma(e,t){if(e==="weight"){const o=r=>r==null?"--":`${r} kg`,a=t.weight_am,i=t.weight_pm;let l="";return a!=null&&i!==null&&i!==void 0&&(l=` · 夜间排水 <b class="text-slate-700">${(Math.round((i-a)*10)/10).toFixed(1)} kg</b>`),`<b class="text-slate-700">${t.record_date}</b>　睡前 ${o(i)} · 晨起 ${o(a)}${l}`}if(e==="waist"){const o=t.waist_size===null||t.waist_size===void 0?"--":`${t.waist_size} cm`;return`<b class="text-slate-700">${t.record_date}</b>　腰围 ${o}`}if(e==="steps"){const o=t.steps===null||t.steps===void 0?"--":`${Number(t.steps).toLocaleString("en-US")} 步`;return`<b class="text-slate-700">${t.record_date}</b>　步数 ${o}${t.morning_light===!0?" · 已见晨光":""}`}const n=t.sleep_tag==="RED"?"熬夜":t.sleep_tag==="YELLOW"?"轻度":"正常",s=t.sleep_hours===null||t.sleep_hours===void 0?"--":`${t.sleep_hours} 小时`;return`<b class="text-slate-700">${t.record_date}</b>　就寝 ${t.sleep_start_time||"--"} · 起床 ${t.sleep_end_time||"--"} · ${s} · ${n}`}function as(){const e=ia[pe.metric],t=ns(),n={};pe.records.forEach(u=>{n[u.record_date]=u});const s=t.map(u=>{const g=n[u];if(!g)return null;const b=g[e.field];return b==null||b===""||isNaN(Number(b))?null:Number(b)}),o=t.map(u=>u.slice(5)),a=document.getElementById("td-detail");a.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>',document.getElementById("td-metric-label").innerText=e.label;const i=document.getElementById("td-metric-stat"),l=document.getElementById("td-metric-note"),r=s.filter(u=>u!==null);if(r.length>0){if(e.avg){const u=r.reduce((g,b)=>g+b,0)/r.length;i.innerText=pe.metric==="sleep"?`${u.toFixed(1)} 小时 (均值)`:`${Math.round(u).toLocaleString("en-US")} 步 (均值)`}else i.innerText=`${r[r.length-1]} ${e.unit}`;l.innerHTML=`近 ${yt} 天逐日<br>有效 ${r.length} 天`}else i.innerText="--",l.innerHTML=`近 ${yt} 天暂无数据`;const d=document.getElementById("chart-trend-detail");if(!d)return;$e&&($e.destroy(),$e=null);const m=typeof Chart<"u"&&Chart.getChart?Chart.getChart(d):null;m&&m.destroy();const h=d.getContext("2d");$e=new Chart(h,{type:"line",data:{labels:o,datasets:[{label:e.label,data:s,borderColor:e.color,backgroundColor:e.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:3,pointBackgroundColor:e.color}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{displayColors:!1,callbacks:{title:u=>t[u[0].dataIndex],label:u=>{const g=s[u.dataIndex];return g===null?"当日无数据":`数值：${e.fmt?e.fmt(g):g} ${e.unit}`}}}},scales:{y:e.yMax?{beginAtZero:!0,max:e.yMax,ticks:{font:{size:10},stepSize:e.yStep,callback:u=>u===0?"0":`${u/1e4}万`}}:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:20}}},onClick:(u,g)=>{if(!g||!g.length)return;const b=g[0].index,B=t[b],I=n[B];!I||s[b]===null||(a.innerHTML=`<span class="font-mono text-neutral-400">·</span><span>${ma(pe.metric,I)}</span>`)}}}),ss()}ca();function fa(){na()}function xa(){pa()}window.switchDashRange=Je;window.openTrendView=ta;window.openTrendDetailView=ua;window.setTrendMetric=es;window.setTrendDetailMetric=os;const ga=`      <!-- 3. AI 洞察页 (Insight View) -->
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
            <button onclick="openCompareView()" class="h-8 px-2.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg text-[11px] text-neutral-600 font-medium transition-all active:scale-95 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/></svg>
              <span>阶段对比</span>
            </button>
            <button onclick="openInsightHistory()" class="h-8 px-2.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg text-[11px] text-neutral-600 font-medium transition-all active:scale-95 flex items-center gap-1">
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
              <button onclick="setInsightDays(7)" id="pill-7" class="ht-seg-btn">近7天</button>
              <button onclick="setInsightDays(30)" id="pill-30" class="ht-seg-btn active">近30天</button>
              <button onclick="setInsightDays(60)" id="pill-60" class="ht-seg-btn">近60天</button>
            </div>
          </div>
          <div class="pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">截止日期</span>
            <div class="flex items-center gap-1.5 font-mono">
              <button onclick="setInsightEndMode('today')" id="endpill-today" class="ht-seg-btn active">今日</button>
              <button onclick="setInsightEndMode('yesterday')" id="endpill-yesterday" class="ht-seg-btn">昨日</button>
              <input type="date" id="insight-end-date" onchange="setInsightEndDate(this.value)"
                     class="bg-white border border-neutral-200 text-[11px] font-mono text-neutral-700 rounded-lg px-2 py-1 outline-none w-[138px] focus:border-neutral-800 transition-colors" />
            </div>
          </div>
        </div>

        <!-- 主操作按钮：高质感深色极客大按钮 -->
        <button onclick="generateInsightStream()" id="btn-generate-insight" class="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
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
          <button onclick="switchTab('insight')" class="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            <span class="text-xs font-mono font-medium">返回</span>
          </button>
          <h2 class="text-sm font-bold text-neutral-900 font-mono">洞察历史存档</h2>
          <button onclick="toggleHistoryManage()" id="history-manage-btn" class="text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition-colors">管理</button>
        </div>

        <!-- 关键词搜索 -->
        <div class="relative">
          <input id="history-search" oninput="onHistorySearchInput()" type="text" placeholder="搜索洞察内容关键词…"
            class="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors">
          <svg class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>

        <!-- 档位筛选 -->
        <div class="flex gap-1.5 font-mono">
          <button onclick="setHistoryFilter(0)" id="hfilter-0" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-900 text-white transition-all">全部</button>
          <button onclick="setHistoryFilter(7)" id="hfilter-7" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">近7天</button>
          <button onclick="setHistoryFilter(30)" id="hfilter-30" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">近30天</button>
          <button onclick="setHistoryFilter(60)" id="hfilter-60" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">近60天</button>
          <button onclick="setHistoryFilterCompare()" id="hfilter-compare" class="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">对比</button>
        </div>

        <!-- 历史列表 -->
        <div id="history-list" class="space-y-2.5"></div>

        <!-- 加载更多（游标分页，每批 10 条） -->
        <button onclick="loadHistory(false)" id="history-loadmore" class="hidden w-full py-2.5 rounded-xl ht-card text-xs font-mono font-medium text-neutral-600 hover:bg-neutral-50 transition-all">加载更多</button>

        <!-- 管理模式底部操作条 -->
        <div id="history-delete-bar" class="hidden sticky bottom-2 z-10 flex items-center justify-between bg-neutral-900/95 backdrop-blur-md text-white rounded-xl px-4 py-2.5 shadow-lg border border-neutral-800">
          <button onclick="toggleHistorySelectAll()" id="history-selectall-btn" class="text-xs font-mono font-medium text-neutral-300 hover:text-white transition-colors">全选</button>
          <span id="history-selected-count" class="text-xs font-mono text-neutral-400">已选 0 项</span>
          <button onclick="deleteSelectedInsights()" id="history-delete-btn" class="text-xs font-mono font-medium bg-neutral-700 text-neutral-400 px-3.5 py-1.5 rounded-lg cursor-not-allowed transition-colors" disabled>删除所选</button>
        </div>
      </section>

      <!-- 5. 阶段对比独立视图 (Compare View) -->
      <section id="view-compare" class="fade-in space-y-3.5 hidden">
        <!-- topbar -->
        <div class="flex justify-between items-center">
          <button onclick="cmpBack()" class="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 transition-colors">
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
              <button onclick="cmpStepMonth('a',-1)" id="cmp-a-prev" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">‹</button>
              <div class="text-center min-w-0 px-2">
                <p class="text-[9px] font-mono uppercase text-neutral-400">对比月 A</p>
                <p id="cmp-a-label" class="text-sm font-bold font-mono text-neutral-900 whitespace-nowrap tabular-nums">—</p>
              </div>
              <button onclick="cmpStepMonth('a',1)" id="cmp-a-next" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">›</button>
            </div>
            <span class="px-2 text-[10px] font-mono font-bold text-neutral-300 shrink-0">VS</span>
            <div class="flex-1 min-w-0 flex items-center justify-center space-x-1">
              <button onclick="cmpStepMonth('b',-1)" id="cmp-b-prev" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">‹</button>
              <div class="text-center min-w-0 px-2">
                <p class="text-[9px] font-mono uppercase text-neutral-400">对比月 B</p>
                <p id="cmp-b-label" class="text-sm font-bold font-mono text-neutral-900 whitespace-nowrap tabular-nums">—</p>
              </div>
              <button onclick="cmpStepMonth('b',1)" id="cmp-b-next" class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 text-sm font-mono font-bold leading-none transition-colors">›</button>
            </div>
          </div>
          <p class="text-[10px] text-neutral-400 text-center font-mono">默认「上月 vs 上上月」· 独立两月 · 支持跨年对比</p>
        </div>

        <!-- 未过完 / 数据不足 提示条 -->
        <div id="cmp-warn" class="hidden bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-[11px] font-mono leading-relaxed"></div>

        <!-- 生成按钮 -->
        <button onclick="cmpGenerateStream()" id="compare-gen-btn" class="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
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
`;async function Xt({url:e,signal:t,onUpdate:n,onDone:s,onError:o}){let a="",i="",l=!1,r=0,d=!1;const m=()=>{r=0,!d&&typeof n=="function"&&n({thinking:a,content:i,hasError:l})},h=()=>{r||(typeof requestAnimationFrame=="function"?r=requestAnimationFrame(m):m())},u=g=>{const b=g.trim();if(!b||!b.startsWith("data:"))return;const B=b.slice(5).trim();if(!(!B||B==="[DONE]"))try{const I=JSON.parse(B);if(I.error)i+=`
> **服务提示**: ${I.error}
`,l=!0,h();else if(I.choices&&I.choices.length>0){const f=I.choices[0].delta||{};let w=!1;f.reasoning_content&&(a+=f.reasoning_content,w=!0),f.content&&(i+=f.content,w=!0),w&&h()}}catch{}};try{const g=await fetch(e,{signal:t});if(!g.ok)throw new Error(`HTTP ${g.status}`);if(!g.body||typeof g.body.getReader!="function")throw new Error("当前环境不支持流式响应读取");const b=g.body.getReader(),B=new TextDecoder("utf-8");let I="";for(;;){const{done:f,value:w}=await b.read();if(f)break;I+=B.decode(w,{stream:!0});const $=I.split(`
`);I=$.pop()||"";for(const M of $)u(M)}return I.trim()&&u(I),r&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(r),r=0),!d&&typeof n=="function"&&n({thinking:a,content:i,hasError:l}),!d&&typeof s=="function"&&s({thinking:a,content:i,hasError:l}),{aborted:!1,thinking:a,content:i,hasError:l}}catch(g){return r&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(r),r=0),g&&g.name==="AbortError"?(d=!0,{aborted:!0,thinking:a,content:i,hasError:l}):(typeof o=="function"&&o(g,{thinking:a,content:i,hasError:l}),{aborted:!1,error:g,thinking:a,content:i,hasError:!0})}}let De=30,J=R(new Date),be="today",wt=!1,p={items:[],beforeId:0,hasMore:!1,loading:!1,rangeDays:0,compareMode:!1,q:"",error:"",expanded:{},details:{},manageMode:!1,selected:{}};function ha(e){e.insertAdjacentHTML("beforeend",ga)}function ba(){typeof Ee=="function"&&Ee()}function va(){typeof Ot=="function"&&Ot()}function ya(e){De=e,["7","30","60"].forEach(t=>{const n=document.getElementById(`pill-${t}`);n&&(n.className=parseInt(t)===e?"ht-seg-btn active":"ht-seg-btn")}),He(),Ee()}function Zt(){return be==="yesterday"?Ce(R(new Date),-1):be==="custom"&&J?J:R(new Date)}const pn="ht-seg-btn active",mn="ht-seg-btn";function Ze(){const e=R(new Date),t=document.getElementById("endpill-today"),n=document.getElementById("endpill-yesterday");t&&(t.className=be==="today"?pn:mn),n&&(n.className=be==="yesterday"?pn:mn);const s=document.getElementById("insight-end-date");s&&(s.max=e,s.value=J||e,s.classList.toggle("border-neutral-900",be==="custom"))}function wa(e){be=e,J=Zt(),Ze(),He(),Ee()}function ka(e){const t=R(new Date);if(!e||e>t){Ze(),C("截止日不能晚于今天");return}be="custom",J=e,Ze(),He(),Ee()}function fn(e){["7","30","60"].forEach(n=>{const s=document.getElementById(`pill-${n}`);s&&(s.disabled=e,s.classList.toggle("opacity-50",e),s.classList.toggle("cursor-not-allowed",e),s.classList.toggle("pointer-events-none",e))}),["endpill-today","endpill-yesterday"].forEach(n=>{const s=document.getElementById(n);s&&(s.disabled=e,s.classList.toggle("pointer-events-none",e),s.classList.toggle("opacity-50",e))});const t=document.getElementById("insight-end-date");t&&(t.disabled=e,t.classList.toggle("opacity-50",e))}let Ue=null;function is(e){e.innerHTML="";const t=document.createElement("div"),n=document.createElement("div");e.appendChild(t),e.appendChild(n);let s=null,o=null,a=null,i=!1,l="";return({thinking:r,content:d})=>{r&&(s||(s=document.createElement("details"),s.className="mb-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-500",s.open=!0,o=document.createElement("summary"),o.className="cursor-pointer font-mono font-medium text-neutral-600 select-none hover:text-neutral-900 transition-colors",a=document.createElement("div"),a.className="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600",s.appendChild(o),s.appendChild(a),t.appendChild(s)),o.textContent=`思维链推导 (${r.length} 字)`,a.textContent=r,d&&!i&&(s.open=!1,i=!0)),d&&d!==l&&(l=d,n.innerHTML=Ne(d))}}async function Ea(){const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");if(Ue){Ue.abort();return}if(J=Zt(),Ze(),wt&&!await K(`截至 ${J} 的近 ${De} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成洞察",confirmText:"确定重新生成",danger:!1}))return;const s=n.className;n.className="w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",n.innerHTML="<span>停止生成</span>",Rt++,fn(!0),e.classList.add("typing-cursor"),t.innerText="AI 正在推导生理因果...";const o=is(e),a=-new Date().getTimezoneOffset(),i=new AbortController;Ue=i;let l={aborted:!1,thinking:"",content:"",hasError:!1};try{l=await Xt({url:`/api/v1/insights/stream?days=${De}&end_date=${J}&tz_offset=${a}`,signal:i.signal,onUpdate:o,onDone:({thinking:r,content:d,hasError:m})=>{m?t.innerText="分析失败":d||r?cs(d,r,new Date):(e.innerHTML='<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>',t.innerText="暂无分析内容")},onError:(r,{thinking:d,content:m})=>{m||d?(o({thinking:d,content:m+`

> **注意**: 网络连接已完成或阶段传输结束`}),t.innerText="分析完成(部分)"):r instanceof TypeError?(e.innerHTML=`<p class="text-red-500">无法连接本地服务（${_(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,t.innerText="本地服务未连接"):(e.innerHTML=`<p class="text-red-500">连接 AI 洞察服务失败: ${_(r.message)}</p>`,t.innerText="生成异常")}}),l.aborted&&(l.content||l.thinking?(o({thinking:l.thinking,content:l.content+`

> **已手动停止生成**`}),t.innerText="已手动停止"):(He(),t.innerText="已取消生成"))}finally{Ue===i&&(Ue=null),e.classList.remove("typing-cursor"),fn(!1),n.className=s,!l.aborted&&!l.hasError&&(l.content||l.thinking)||wt?n.innerHTML='<span class="font-mono">重新生成</span>':n.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段深度洞察</span>'}}function Ia(){p.rangeDays=0,p.compareMode=!1,p.q="",Tt();const e=document.getElementById("history-search");e&&(e.value=""),Qt(0),switchTab("history"),it(!0)}function Ta(e){p.rangeDays=e,p.compareMode=!1,Tt(),Qt(e),currentTab==="history"&&it(!0)}function Ba(){p.rangeDays=0,p.compareMode=!0,Tt(),Qt("compare"),currentTab==="history"&&it(!0)}function Qt(e){[0,7,30,60].forEach(n=>{const s=document.getElementById(`hfilter-${n}`);s&&(s.className=n===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all")});const t=document.getElementById("hfilter-compare");t&&(t.className=e==="compare"?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all")}let xn=null;function La(){clearTimeout(xn),xn=setTimeout(()=>{Tt(),p.q=(document.getElementById("history-search").value||"").trim(),it(!0)},300)}async function it(e){if(p.loading)return;p.loading=!0,e&&(p.items=[],p.beforeId=0,p.hasMore=!1,p.error="",p.expanded={},p.details={}),te();const t=new URLSearchParams;t.set("limit","10"),p.beforeId>0&&t.set("before_id",String(p.beforeId)),p.compareMode?t.set("scope","compare"):p.rangeDays>0&&t.set("range_days",String(p.rangeDays)),p.q&&t.set("q",p.q);try{const s=await(await fetch("/api/v1/insights?"+t.toString())).json();if(s.code!==200)throw new Error(s.message||"查询失败");const o=s.data||{},a=o.items||[];p.items=p.items.concat(a),p.hasMore=!!o.has_more,a.length>0&&(p.beforeId=a[a.length-1].id)}catch(n){p.error=n.message}finally{p.loading=!1,te()}}function te(){const e=document.getElementById("history-list"),t=document.getElementById("history-loadmore"),n=document.getElementById("history-manage-btn");if(e){if(!p.items.length){p.loading?e.innerHTML='<p class="text-center text-xs text-slate-400 py-8">加载中…</p>':p.error?e.innerHTML=`<p class="text-center text-xs text-red-500 py-8">加载失败：${_(p.error)}</p>`:e.innerHTML='<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>',t&&t.classList.add("hidden"),n&&n.classList.toggle("hidden",!p.manageMode),Nt();return}e.innerHTML=p.items.map(s=>{const o=!!p.expanded[s.id],a=!!p.selected[s.id],i=new Date(s.created_at),l=isNaN(i.getTime())?"":`${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")} ${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`,r=(s.content||"").replace(/[#*`>|\-]/g," ").replace(/\s+/g," ").trim().slice(0,90)||"（无正文）",d=s.scope==="compare",m=s.meta||{},h=m.month_a&&m.month_b?`${_(m.month_a)} vs ${_(m.month_b)}`:`${_(s.start_date)} ~ ${_(s.end_date)}`,u=d?h:`${_(s.start_date)} ~ ${_(s.end_date)}`,g=d?"阶段对比":`近 ${s.range_days} 天`,b=`
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-xs font-bold text-neutral-900 font-mono">${u}</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600 font-mono font-medium">${g}</span>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed ${o&&!p.manageMode?"":"line-clamp-2"}">${_(r)}</p>
          <div class="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100 font-mono text-[10px]">
            <span class="text-neutral-400">${l}${s.model?" · "+_(s.model):""}</span>
            ${p.manageMode?"":d?'<span class="text-neutral-900 font-medium hover:underline">查看对比 ›</span>':`<span class="text-neutral-900 font-medium hover:underline">${o?"收起 ▴":"展开 ▾"}</span>`}
          </div>`;if(p.manageMode)return`
            <div data-hp-id="${s.id}" onclick="onHistoryItemClick(${s.id})" class="cursor-pointer select-none flex items-start space-x-3 ht-card transition-colors ${a?"border-neutral-900 ring-1 ring-neutral-900":""}">
              <div class="mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${a?"bg-neutral-900 border-neutral-900 text-white":"border-neutral-300 bg-white"}">
                ${a?'<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>':""}
              </div>
              <div class="flex-1 min-w-0">${b}</div>
            </div>`;let B="";if(o){const I=p.details[s.id];if(!I)B='<p class="text-[11px] font-mono text-neutral-400 mt-2">加载全文…</p>';else{const f=(I.thinking||"").trim();B=`${f?`
              <details class="mt-2.5 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-600">
                <summary class="cursor-pointer font-mono font-medium text-neutral-700 select-none hover:text-neutral-900 transition-colors">思维链推导 (${f.length} 字)</summary>
                <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600 text-[11px]">${_(f)}</div>
              </details>`:""}
              <div class="mt-2 text-xs text-neutral-700 leading-relaxed markdown-body">${Ne(I.content||"")}</div>`}}return`
          <div data-hp-id="${s.id}" class="ht-card">
            <div class="cursor-pointer select-none" onclick="onHistoryItemClick(${s.id})">${b}</div>
            ${B}
          </div>`}).join(""),t&&t.classList.toggle("hidden",!p.hasMore),n&&n.classList.toggle("hidden",!p.items.length&&!p.manageMode),Nt(),_a()}}function Sa(e){if(kt){kt=!1;return}if(p.manageMode){ls(e);return}const t=p.items.find(n=>n.id===e);if(t&&t.scope==="compare"){const n=t.meta||{},s=n.month_a||(t.start_date||"").slice(0,7),o=n.month_b||(t.end_date||"").slice(0,7);if(s&&o){Ha(s,o);return}}rs(e)}let Ct=null,kt=!1;function _a(){const e=document.getElementById("history-list");e&&e.querySelectorAll("[data-hp-id]").forEach(t=>{const n=parseInt(t.getAttribute("data-hp-id"),10),s=()=>{p.manageMode||(kt=!1,clearTimeout(Ct),Ct=setTimeout(()=>{kt=!0,p.manageMode=!0,p.selected={[n]:!0},Bt(),te()},500))},o=()=>clearTimeout(Ct);t.addEventListener("pointerdown",s),t.addEventListener("pointerup",o),t.addEventListener("pointerleave",o),t.addEventListener("pointercancel",o),t.addEventListener("contextmenu",a=>a.preventDefault())})}function $a(){p.manageMode=!p.manageMode,p.manageMode||(p.selected={}),Bt(),te()}function Tt(){p.manageMode&&(p.manageMode=!1,p.selected={},Bt())}function Bt(){const e=document.getElementById("history-manage-btn");e&&(e.innerText=p.manageMode?"完成":"管理",e.className=p.manageMode?"text-xs font-mono font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-lg transition-colors":"text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition-colors"),Nt()}function ls(e){p.selected[e]?delete p.selected[e]:p.selected[e]=!0,te()}function Ma(){const e=p.items.map(n=>n.id);if(e.filter(n=>p.selected[n]).length===e.length)p.selected={};else{const n={};e.forEach(s=>{n[s]=!0}),p.selected=n}te()}function Nt(){const e=document.getElementById("history-delete-bar");if(!e)return;const t=p.manageMode&&p.items.length>0;if(e.classList.toggle("hidden",!t),!t)return;const n=p.items.map(l=>l.id),s=n.filter(l=>p.selected[l]).length,o=document.getElementById("history-selected-count");o&&(o.innerText=`已选 ${s} 项`);const a=document.getElementById("history-selectall-btn");a&&(a.innerText=n.length>0&&s===n.length?"取消全选":"全选");const i=document.getElementById("history-delete-btn");i&&(i.disabled=s===0,i.innerText=s>0?`删除所选 (${s})`:"删除所选",i.className=s>0?"text-xs font-mono font-medium bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg transition-colors":"text-xs font-mono font-medium bg-neutral-700 text-neutral-400 px-3.5 py-1.5 rounded-lg cursor-not-allowed transition-colors")}async function Ca(){const e=p.items.map(n=>n.id).filter(n=>p.selected[n]);if(!(!e.length||!await K(`确定删除所选 ${e.length} 条洞察存档？删除后不可恢复。`,{title:"删除洞察存档",confirmText:"确定删除"})))try{const s=await(await fetch("/api/v1/insights/batch-delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids:e})})).json();if(s.code!==200)throw new Error(s.message||"删除失败");p.items=p.items.filter(o=>!p.selected[o.id]),Object.keys(p.selected).forEach(o=>{delete p.expanded[o],delete p.details[o]}),p.selected={},p.items.length||(p.manageMode=!1),Bt(),te(),Ee()}catch(n){C("删除失败："+n.message)}}async function rs(e){if(p.expanded[e]){p.expanded[e]=!1,te();return}if(p.expanded[e]=!0,te(),!p.details[e]){try{const n=await(await fetch(`/api/v1/insights/${e}`)).json();p.details[e]=n.code===200&&n.data?n.data:{content:"加载失败",thinking:""}}catch(t){p.details[e]={content:"加载失败："+t.message,thinking:""}}te()}}const ja="<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>";function ds(e,t){let n="";const s=(t||"").trim();return s&&(n+=`
          <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${s.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${_(s)}</div>
          </details>`),e&&e.trim()?n+=Ne(e):n+='<p class="text-slate-400 text-xs">该洞察没有正文内容。</p>',n}function He(){wt=!1;const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");e&&(e.innerHTML=ja),t&&(t.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段深度洞察</span>')}function cs(e,t,n){wt=!0;const s=document.getElementById("insight-content"),o=document.getElementById("insight-status-tag"),a=document.getElementById("btn-generate-insight"),i=n instanceof Date?n:new Date(n),l=String(i.getHours()).padStart(2,"0"),r=String(i.getMinutes()).padStart(2,"0");s&&(s.innerHTML=ds(e,t)),o&&(o.innerHTML=`近 ${De} 天（截至 ${J}）· 生成于 ${l}:${r} · <span onclick="openInsightHistory()" class="text-blue-600 cursor-pointer font-bold">点击查看</span>`),a&&(a.innerHTML='<span class="font-mono">重新生成</span>')}let Rt=0;async function Ee(){const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");if(!t||!n||!e)return;J=Zt(),Ze();const s=De,o=J,a=++Rt,i=()=>a!==Rt||s!==De||o!==J,l=-new Date().getTimezoneOffset();try{const r=await fetch(`/api/v1/insights/period?range_days=${s}&end_date=${o}&tz_offset=${l}`);if(i())return;const d=await r.json();if(i())return;const m=d.code===200&&d.data?d.data:null;if(!m||!m.exists||!m.insight){He();return}const h=m.insight;cs(h.content||"",h.thinking||"",h.created_at)}catch{if(i())return;He()}}function us(){document.visibilityState==="visible"&&currentTab==="insight"&&Ee()}document.addEventListener("visibilitychange",us);window.addEventListener("pageshow",us);let v={monthA:"",monthB:"",metricsA:null,metricsB:null,generated:!1,busy:!1,loadSeq:0,returnTab:"insight"};function Qe(e){const t=new Date;return t.setDate(1),t.setMonth(t.getMonth()+e),`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function gn(e){const[t,n]=e.split("-").map(Number);return t*12+(n-1)}function Da(){return Qe(0)}function ps(e,t){const[n,s]=e.split("-").map(Number),o=new Date(n,s-1+t,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function ne(e){if(!e)return"—";const[t,n]=e.split("-");return`${t} 年 ${parseInt(n,10)} 月`}function ms(e){return gn(e)>gn(Da())}function fs(e,t,n){v.returnTab=n==="history"?"history":"insight",e&&t?(v.monthA=e,v.monthB=t):(v.monthA||(v.monthA=Qe(-1)),v.monthB||(v.monthB=Qe(-2))),switchTab("compare")}function Ha(e,t){fs(e,t,"history")}function Aa(){switchTab(v.returnTab==="history"?"history":"insight")}function en(){const e=document.getElementById("cmp-a-label"),t=document.getElementById("cmp-b-label");e&&(e.innerText=ne(v.monthA)),t&&(t.innerText=ne(v.monthB)),["a","b"].forEach(n=>{const s=n==="a"?v.monthA:v.monthB,o=document.getElementById(`cmp-${n}-next`);if(!o)return;const a=!s||ms(ps(s,1));o.disabled=a||v.busy,o.classList.toggle("opacity-40",a||v.busy),o.classList.toggle("cursor-not-allowed",a||v.busy)})}function hn(e){["cmp-a-prev","cmp-a-next","cmp-b-prev","cmp-b-next"].forEach(t=>{const n=document.getElementById(t);n&&(n.disabled=e,n.classList.toggle("opacity-40",e),n.classList.toggle("pointer-events-none",e),n.classList.toggle("cursor-not-allowed",e))}),e||en()}function Na(e,t){if(v.busy)return;const n=e==="a"?v.monthA:v.monthB,s=ps(n,t);if(ms(s)){C("不能选择未来的月份"),en();return}e==="a"?v.monthA=s:v.monthB=s,Ra(),Ot()}function Ra(){const e=document.getElementById("compare-insight-card"),t=document.getElementById("cmp-status-tag");e&&(e.innerHTML='<p class="text-slate-400 text-xs">加载该月份对的对比数据…</p>'),t&&(t.innerText="加载中…")}function P(e,t){return e==null||e===""||isNaN(Number(e))?"—":Number(e).toFixed(t)}function Oa(e,t){if(e==null||t===null||t===void 0||e===""||t==="")return null;const n=Number(e),s=Number(t);return isNaN(n)||isNaN(s)?null:n-s}function re(e,t,n,s){const o=Oa(e,t);if(o===null)return'<span class="text-slate-300">—</span>';const a=(o>0?"+":"")+o.toFixed(n);let i="text-neutral-500";return s==="down"?i=o<0?"text-emerald-600":o>0?"text-red-500":"text-neutral-400":s==="up"&&(i=o>0?"text-emerald-600":o<0?"text-red-500":"text-neutral-400"),`<span class="font-bold font-mono ${i}">${a}</span>`}function oe(e,t,n,s){return`<tr class="border-b border-neutral-100 last:border-0">
        <td class="py-2 pr-2 text-neutral-500 font-sans align-top">${e}</td>
        <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${t}</td>
        <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${n}</td>
        <td class="py-2 text-right font-mono whitespace-nowrap">${s}</td>
      </tr>`}function bn(e){if(!e)return"—";const t=P(e.green_days,0),n=P(e.yellow_days,0),s=P(e.red_days,0);return t==="—"&&n==="—"&&s==="—"?"—":`${t} / ${n} / ${s}`}function vn(e){if(!e)return"—";const t=P(e.workout_days,0);if(t==="—")return"—";const n=[];return e.workout_light!==null&&e.workout_light!==void 0&&n.push(`轻 ${e.workout_light}`),e.workout_medium!==null&&e.workout_medium!==void 0&&n.push(`中 ${e.workout_medium}`),e.workout_failure!==null&&e.workout_failure!==void 0&&n.push(`力竭 ${e.workout_failure}`),n.length?`${t} <span class="text-[10px] text-slate-400 font-normal">(${n.join(" / ")})</span>`:t}function yn(){const e=document.getElementById("compare-table-body");if(!e)return;const t=document.getElementById("cmp-col-a"),n=document.getElementById("cmp-col-b"),s=document.getElementById("cmp-table-meta");t&&(t.innerText=ne(v.monthA)),n&&(n.innerText=ne(v.monthB));const o=v.metricsA,a=v.metricsB;if(!o&&!a){e.innerHTML='<tr><td colspan="4" class="py-6 text-center text-slate-400">暂无数据</td></tr>',s&&(s.innerText="");return}if(s){const r=[o,a].filter(d=>d&&d.record_days!==null&&d.record_days!==void 0).map(d=>`${d.month} ${d.record_days} 天`);s.innerText=r.join(" · ")}const i=(r,d)=>r?r[d]:null,l=[oe("体重均值 (kg)",P(i(o,"weight_avg"),1),P(i(a,"weight_avg"),1),re(i(o,"weight_avg"),i(a,"weight_avg"),1,"down")),oe("体重净变化 (kg)",P(i(o,"weight_delta"),1),P(i(a,"weight_delta"),1),re(i(o,"weight_delta"),i(a,"weight_delta"),1,"down")),oe("腰围均值 (cm)",P(i(o,"waist_avg"),1),P(i(a,"waist_avg"),1),re(i(o,"waist_avg"),i(a,"waist_avg"),1,"down")),oe("腰围净变化 (cm)",P(i(o,"waist_delta"),1),P(i(a,"waist_delta"),1),re(i(o,"waist_delta"),i(a,"waist_delta"),1,"down")),oe("平均睡眠时长 (小时)",P(i(o,"sleep_avg_hours"),1),P(i(a,"sleep_avg_hours"),1),re(i(o,"sleep_avg_hours"),i(a,"sleep_avg_hours"),1,"up")),oe("熬夜分布 (绿/黄/红 天数)",bn(o),bn(a),'<span class="text-slate-300">—</span>'),oe("有运动天数",vn(o),vn(a),re(i(o,"workout_days"),i(a,"workout_days"),0,"up")),oe("专注达服药天数 (天)",P(i(o,"concerta_days"),0),P(i(a,"concerta_days"),0),re(i(o,"concerta_days"),i(a,"concerta_days"),0,null)),oe("平均夜间排水 (kg)",P(i(o,"night_loss_avg"),2),P(i(a,"night_loss_avg"),2),re(i(o,"night_loss_avg"),i(a,"night_loss_avg"),2,"down"))];e.innerHTML=l.join("")}function wn(){const e=document.getElementById("cmp-warn");if(!e)return;const t=[];[["a",v.monthA,v.metricsA],["b",v.monthB,v.metricsB]].forEach(n=>{const s=n[1],o=n[2];o&&(o.incomplete_month?t.push(`提示：${ne(s)}尚未过完，结论置信度低`):o.data_insufficient&&t.push(`提示：${ne(s)}数据不足，结论置信度低`))}),t.length?(e.innerHTML=t.join("<br>"),e.classList.remove("hidden")):(e.innerHTML="",e.classList.add("hidden"))}function xs(){v.generated=!1;const e=document.getElementById("compare-insight-card"),t=document.getElementById("cmp-status-tag"),n=document.getElementById("compare-gen-btn");e&&(e.innerHTML="<p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>"),t&&(t.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段对比综述</span>')}function gs(e,t,n){v.generated=!0;const s=document.getElementById("compare-insight-card"),o=document.getElementById("cmp-status-tag"),a=document.getElementById("compare-gen-btn"),i=n instanceof Date?n:new Date(n),l=String(i.getHours()).padStart(2,"0"),r=String(i.getMinutes()).padStart(2,"0");s&&(s.innerHTML=ds(e,t)),o&&(o.innerText=`${ne(v.monthA)} vs ${ne(v.monthB)} · 生成于 ${l}:${r}`),a&&(a.innerHTML='<span class="font-mono">重新生成阶段对比</span>')}async function Ot(){v.monthA||(v.monthA=Qe(-1)),v.monthB||(v.monthB=Qe(-2)),en();const e=++v.loadSeq,t=v.monthA,n=v.monthB,s=-new Date().getTimezoneOffset();try{const o=await fetch(`/api/v1/insights/compare/period?month_a=${t}&month_b=${n}&tz_offset=${s}`);if(e!==v.loadSeq)return;const a=await o.json();if(e!==v.loadSeq)return;if(a.code!==200||!a.data)throw new Error(a.message||"加载失败");const i=a.data;if(e!==v.loadSeq)return;v.metricsA=i.metrics_a||null,v.metricsB=i.metrics_b||null,yn(),wn(),i.exists&&i.insight?gs(i.insight.content||"",i.insight.thinking||"",i.insight.created_at):xs()}catch(o){if(e!==v.loadSeq)return;v.metricsA=null,v.metricsB=null,yn(),wn();const a=document.getElementById("compare-insight-card");a&&(a.innerHTML=`<p class="text-red-500 text-xs">加载对比数据失败：${_(o.message)}</p>`);const i=document.getElementById("cmp-status-tag");i&&(i.innerText="加载失败"),C("加载对比数据失败："+o.message)}}let qe=null;async function Pa(){if(qe){qe.abort();return}if(v.busy)return;const e=document.getElementById("compare-insight-card"),t=document.getElementById("cmp-status-tag"),n=document.getElementById("compare-gen-btn");if(!e||!n||v.generated&&!await K(`「${ne(v.monthA)} vs ${ne(v.monthB)}」已生成过阶段对比综述，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成阶段对比",confirmText:"确定重新生成",danger:!1}))return;const s=n.className;v.busy=!0,n.className="w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",n.innerHTML="<span>停止生成</span>",hn(!0),v.loadSeq++,e.classList.add("typing-cursor"),t.innerText="AI 正在推导两月差异...";const o=is(e),a=-new Date().getTimezoneOffset(),i=new AbortController;qe=i;let l={aborted:!1,thinking:"",content:"",hasError:!1};try{l=await Xt({url:`/api/v1/insights/compare/stream?month_a=${v.monthA}&month_b=${v.monthB}&tz_offset=${a}`,signal:i.signal,onUpdate:o,onDone:({thinking:r,content:d,hasError:m})=>{m?t.innerText="分析失败":d||r?gs(d,r,new Date):(e.innerHTML='<p class="text-slate-400">未能获取到对比内容，请检查后端大模型连接。</p>',t.innerText="暂无对比内容")},onError:(r,{thinking:d,content:m})=>{m||d?(o({thinking:d,content:m+`

> **注意**: 网络连接已完成或阶段传输结束`}),t.innerText="分析完成(部分)"):r instanceof TypeError?(e.innerHTML=`<p class="text-red-500">无法连接本地服务（${_(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,t.innerText="本地服务未连接"):(e.innerHTML=`<p class="text-red-500">连接 AI 对比服务失败: ${_(r.message)}</p>`,t.innerText="生成异常")}}),l.aborted&&(l.content||l.thinking?(o({thinking:l.thinking,content:l.content+`

> **已手动停止生成**`}),t.innerText="已手动停止"):(xs(),t.innerText="已取消生成"))}finally{qe===i&&(qe=null),e.classList.remove("typing-cursor"),v.busy=!1,hn(!1),n.className=s,!l.aborted&&!l.hasError&&(l.content||l.thinking)||v.generated?n.innerHTML='<span class="font-mono">重新生成阶段对比</span>':n.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段对比综述</span>'}}window.setInsightDays=ya;window.setInsightEndDate=ka;window.setInsightEndMode=wa;window.generateInsightStream=Ea;window.openInsightHistory=Ia;window.setHistoryFilter=Ta;window.setHistoryFilterCompare=Ba;window.onHistorySearchInput=La;window.loadHistory=it;window.toggleHistoryManage=$a;window.toggleHistorySelectAll=Ma;window.deleteSelectedInsights=Ca;window.onHistoryItemClick=Sa;window.toggleHistorySelect=ls;window.toggleHistoryItem=rs;window.openCompareView=fs;window.cmpBack=Aa;window.cmpStepMonth=Na;window.cmpGenerateStream=Pa;const Fa=`      <!-- 4. 睡前小结 (Evening View) -->
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
            <input type="date" id="summary-date" class="bg-white border border-neutral-200 text-neutral-800 text-xs font-mono font-medium rounded-lg px-2 py-1 w-[138px] outline-none focus:border-neutral-800 transition-colors" onchange="evOnDateChange(this.value)">
            <button onclick="evSetToday()" class="h-8 px-2.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg text-[11px] text-neutral-600 font-medium transition-all active:scale-95">今日</button>
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
              <img id="photo-preview" src="" alt="今日图片" onclick="evoOpenPhoto(this.src, '今日图片')" class="w-full h-48 object-cover cursor-zoom-in">
              <div class="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-neutral-900/60 to-transparent"></div>
              <span class="absolute top-2 left-2 text-[10px] font-mono font-medium text-white bg-neutral-900/60 backdrop-blur px-2 py-0.5 rounded-md">TODAY PHOTO</span>
              <div class="absolute bottom-2 right-2 flex space-x-1.5 font-mono">
                <label for="photo-input" class="text-[10px] font-medium text-neutral-800 bg-white/90 hover:bg-white px-2.5 py-1 rounded-md cursor-pointer active:scale-95 transition-transform shadow-sm">替换</label>
                <button onclick="evRemovePhoto()" class="text-[10px] font-medium text-rose-600 bg-white/90 hover:bg-white px-2.5 py-1 rounded-md active:scale-95 transition-transform shadow-sm">删除</button>
              </div>
            </div>
            <p id="photo-meta" class="pt-1.5 text-[10px] font-mono text-neutral-400"></p>
          </div>
          <input type="file" id="photo-input" accept="image/*" class="hidden" onchange="evOnPhotoPick(event)">

          <!-- 感想 -->
          <div class="pt-2 border-t border-dashed border-neutral-200">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">那一刻的感想</span>
              <span class="text-[10px] font-mono text-neutral-400"><span id="note-len">0</span> 字</span>
            </div>
            <textarea id="note-text" rows="3" oninput="document.getElementById('note-len').innerText=this.value.length" class="evo-selectable w-full bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-lg p-2.5 text-xs outline-none focus:border-neutral-800 focus:bg-white transition-all resize-none leading-relaxed placeholder:text-neutral-400" placeholder="记录下为什么这张图值得被记住…"></textarea>
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
              <input type="text" id="done-1" maxlength="200" oninput="evUpdateDoneCount()" placeholder="最有成就感的那件事" class="evo-selectable flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400">
            </div>
            <div class="flex items-center space-x-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg px-2.5 py-2 focus-within:border-neutral-500 focus-within:bg-white transition-all">
              <span class="evo-seq-dot" id="seq-2">2</span>
              <input type="text" id="done-2" maxlength="200" oninput="evUpdateDoneCount()" placeholder="其次推进的一件事" class="evo-selectable flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400">
            </div>
            <div class="flex items-center space-x-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg px-2.5 py-2 focus-within:border-neutral-500 focus-within:bg-white transition-all">
              <span class="evo-seq-dot" id="seq-3">3</span>
              <input type="text" id="done-3" maxlength="200" oninput="evUpdateDoneCount()" placeholder="哪怕很小，也算（可留空）" class="evo-selectable flex-1 bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400">
            </div>
          </div>
        </div>

        <!-- ── 今日对自己的打分 ── -->
        <div class="ht-card space-y-2">
          <div class="flex items-end justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-neutral-900">今日自评分</span>
              <button onclick="evToggleBandEditor()" class="text-[10px] font-mono text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all active:scale-95">
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
            <input type="range" id="score-range" min="1" max="10" step="1" value="7" oninput="evUpdateScore(this.value)" class="ht-range w-full">
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
                <button onclick="evResetBands()" class="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 active:scale-95 transition-transform">恢复默认</button>
              </div>
              <div id="band-rows" class="space-y-1.5"></div>
              <div class="flex items-center justify-between mt-3">
                <p class="text-[10px] text-neutral-400 leading-relaxed font-mono">改动保存后立即生效并同步历史小结。</p>
                <button onclick="evSaveBands()" id="band-save-btn" class="shrink-0 ml-2 text-[11px] font-mono font-semibold text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg active:scale-95 transition-all">保存设置</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── 保存按钮 ── -->
        <button onclick="evSave()" id="ev-save-btn" class="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
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
              <button class="ht-seg-btn active" data-val="7" onclick="evSetInsightRange(this)">近7天</button>
              <button class="ht-seg-btn" data-val="30" onclick="evSetInsightRange(this)">近30天</button>
            </div>
          </div>

          <div id="insight-empty" class="pt-1">
            <p class="text-xs text-neutral-500 leading-relaxed">从小结的<b class="text-neutral-800">自评与文字</b>出发，结合所选区间内的体重、睡眠与打卡趋势，深度解读心理状态与成就感。</p>
            <button onclick="evGenerateInsight()" id="ev-insight-btn" class="mt-3 w-full h-10 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>生成小结深度洞察</span>
            </button>
          </div>

          <div id="insight-panel" class="hidden space-y-2.5 pt-1">
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span id="insight-meta" class="text-neutral-400"></span>
              <div class="flex items-center gap-1.5">
                <button id="ev-insight-stop-btn" onclick="evStopInsight()" class="hidden text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono transition-colors">停止生成</button>
                <button id="ev-insight-reset-btn" onclick="evResetInsight()" class="text-neutral-400 hover:text-neutral-800 px-1 font-mono transition-colors">清除</button>
              </div>
            </div>

            <!-- 思维链推导折叠面板 -->
            <div class="pb-2 border-b border-neutral-100">
              <button onclick="evToggleThinking()" class="text-[10px] font-mono text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
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
                <button class="ht-seg-btn active" data-val="all" onclick="evSetDateFilter(this)">全部</button>
                <button class="ht-seg-btn" data-val="7" onclick="evSetDateFilter(this)">近 7 天</button>
                <button class="ht-seg-btn" data-val="30" onclick="evSetDateFilter(this)">近 30 天</button>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 w-8 shrink-0">评分</span>
              <div class="flex flex-wrap gap-1.5" id="ev-filter-score">
                <button class="ht-seg-btn active" data-val="all" onclick="evSetScoreFilter(this)">全部</button>
                <button class="ht-seg-btn" data-val="high" onclick="evSetScoreFilter(this)">9-10</button>
                <button class="ht-seg-btn" data-val="good" onclick="evSetScoreFilter(this)">7-8</button>
                <button class="ht-seg-btn" data-val="mid" onclick="evSetScoreFilter(this)">5-6</button>
                <button class="ht-seg-btn" data-val="low" onclick="evSetScoreFilter(this)">1-4</button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between px-0.5 text-[10px] font-mono">
            <span class="text-neutral-400">筛选结果 <b id="ev-filter-count" class="text-neutral-800 tabular-nums">0</b> 篇</span>
            <button id="ev-filter-reset" onclick="evResetFilters()" class="hidden text-neutral-600 hover:text-neutral-900 active:scale-95 transition-transform">清除筛选</button>
          </div>

          <div id="ev-history-list" class="space-y-0"></div>

          <div id="ev-history-empty" class="hidden ht-card p-8 text-center space-y-1">
            <p class="font-mono text-xs text-neutral-400">NO DATA</p>
            <p class="text-xs font-semibold text-neutral-700">没有符合条件的小结</p>
            <p class="text-[10px] font-mono text-neutral-400">试着放宽日期或评分范围</p>
          </div>

          <div class="pt-1 pb-3 text-center">
            <button id="ev-load-more" onclick="evLoadMore()" class="hidden px-4 py-1.5 bg-white border border-neutral-200 hover:border-neutral-400 rounded-lg text-xs font-mono text-neutral-600 transition-all active:scale-95">
              加载更多（剩 <span id="ev-remain-count">0</span> 篇）
            </button>
            <p id="ev-load-done" class="hidden text-[10px] font-mono text-neutral-400">ALL SUMMARIES LOADED</p>
          </div>
        </div>
      </section>
`;function za(e){e.insertAdjacentHTML("beforeend",Fa),ki()}function Ua(){typeof Pt=="function"&&Pt()}const Te=[{range:[1,2],label:"很低落",tone:"rose"},{range:[3,4],label:"有点钝",tone:"amber"},{range:[5,6],label:"平平",tone:"emerald"},{range:[7,8],label:"还不错，稳住了节奏",tone:"indigo"},{range:[9,10],label:"满分的一天",tone:"violet"}],kn={rose:{dot:"#f43f5e",chip:"text-rose-700 bg-rose-50 border-rose-200",band:"bg-rose-50 text-rose-700 border border-rose-200"},amber:{dot:"#f59e0b",chip:"text-amber-700 bg-amber-50 border-amber-200",band:"bg-amber-50 text-amber-700 border border-amber-200"},emerald:{dot:"#10b981",chip:"text-emerald-700 bg-emerald-50 border-emerald-200",band:"bg-emerald-50 text-emerald-700 border border-emerald-200"},indigo:{dot:"#6366f1",chip:"text-indigo-700 bg-indigo-50 border-indigo-200",band:"bg-neutral-50 text-neutral-800 border border-neutral-200"},violet:{dot:"#8b5cf6",chip:"text-violet-700 bg-violet-50 border-violet-200",band:"bg-violet-50 text-violet-700 border border-violet-200"}},jt=["rose","amber","emerald","indigo","violet"],Re=6;let Q=null,x={date:"",photoId:null,pendingBlob:null,summaries:[],dateFilter:"all",scoreFilter:"all",visible:Re,insightBusy:!1,insightRange:7},ve={W:84,drag:null,suppressClick:0};function tn(e){const t=Q||Te;return t.find(n=>e>=n.range[0]&&e<=n.range[1])||t[t.length-1]}function Lt(e){return kn[e]||kn.indigo}function Be(){const e=new Date,t=n=>String(n).padStart(2,"0");return e.getFullYear()+"-"+t(e.getMonth()+1)+"-"+t(e.getDate())}function hs(e){const t=["周日","周一","周二","周三","周四","周五","周六"],n=new Date(e+"T00:00:00");return isNaN(n.getTime())?"":t[n.getDay()]}function qa(e){const t=new Date(Be()+"T00:00:00"),n=new Date(e+"T00:00:00");return Math.round((t-n)/864e5)}function G(e){return e?e.slice(5):""}function En(e){return e?e.slice(0,7):""}function Va(e){const t=e.split("-");return t[0]+" 年 "+Number(t[1])+" 月"}function Wa(e){return String(e??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function Pt(){x.date||(x.date=Be());const e=document.getElementById("summary-date");e&&(e.value=x.date),await Promise.all([Ga(),St()]),await Es()}async function Ga(){var e;if(Q){et();return}try{const n=await(await fetch("/api/config")).json(),s=n&&n.data&&n.data.summary_score_bands;Array.isArray(s)&&s.length&&(Q=s.map(o=>({range:[o.range[0],o.range[1]],label:o.label,tone:o.tone})))}catch{}Q||(Q=Te.map(t=>({range:[t.range[0],t.range[1]],label:t.label,tone:t.tone}))),et(),Oe(Number((e=document.getElementById("score-range"))==null?void 0:e.value)||7)}async function St(){const e=x.date;vs();try{const n=await(await fetch(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`)).json(),s=n&&n.code===200?n.data:null;s?(document.getElementById("done-1").value=s.done_items&&s.done_items[0]||"",document.getElementById("done-2").value=s.done_items&&s.done_items[1]||"",document.getElementById("done-3").value=s.done_items&&s.done_items[2]||"",document.getElementById("note-text").value=s.note_text||"",document.getElementById("note-len").innerText=(s.note_text||"").length,Ft(s.score||7),s.photo_id&&(x.photoId=s.photo_id,nn(`/api/v1/evening/photo/${s.photo_id}`,""))):(document.getElementById("done-1").value="",document.getElementById("done-2").value="",document.getElementById("done-3").value="",document.getElementById("note-text").value="",document.getElementById("note-len").innerText="0",Ft(7)),bs()}catch(t){C("读取该日小结失败："+t.message)}li(e)}function Ja(){x.date=Be();const e=document.getElementById("summary-date");e&&(e.value=x.date),St(),C("已回到今日")}function Ya(e){e&&(x.date=e,St())}function bs(){let e=0;[1,2,3].forEach(n=>{const s=document.getElementById("done-"+n),o=!!(s&&s.value.trim()),a=document.getElementById("seq-"+n);a&&(o?(a.classList.contains("filled")||(a.classList.add("filled","ev-pop"),setTimeout(()=>a.classList.remove("ev-pop"),340)),e++):a.classList.remove("filled"))});const t=document.getElementById("done-count");t&&(t.innerText=e+" / 3",t.className="font-mono text-[10px] font-bold tabular-nums transition-colors "+(e===0?"text-neutral-400":"text-neutral-900"))}function nn(e,t){var a;const n=document.getElementById("photo-preview");n&&(n.src=e||""),(a=document.getElementById("photo-empty"))==null||a.classList.add("hidden");const s=document.getElementById("photo-filled");s==null||s.classList.remove("hidden");const o=document.getElementById("photo-meta");o&&(o.innerText=t||"")}function vs(){var s,o;x.photoId=null,x.pendingBlob=null;const e=document.getElementById("photo-input");e&&(e.value="");const t=document.getElementById("photo-preview");t&&(t.src=""),(s=document.getElementById("photo-filled"))==null||s.classList.add("hidden"),(o=document.getElementById("photo-empty"))==null||o.classList.remove("hidden");const n=document.getElementById("photo-meta");n&&(n.innerText="")}let Ae=!1;function Ka(e,t){if(!e)return;const n=document.getElementById("ev-photo-viewer"),s=document.getElementById("ev-photo-viewer-img");!n||!s||(s.src=e,s.alt=t||"小结图片",n.classList.contains("hidden")&&(n.classList.remove("hidden"),Ae||(history.pushState({evPhoto:1},""),Ae=!0)))}function sn(e){const t=document.getElementById("ev-photo-viewer"),n=document.getElementById("ev-photo-viewer-img");!t||t.classList.contains("hidden")||(t.classList.add("hidden"),n.removeAttribute("src"),Ae&&!e&&(Ae=!1,history.back()))}window.addEventListener("popstate",()=>{Ae&&(Ae=!1,sn(!0))});document.addEventListener("keydown",e=>{e.key==="Escape"&&sn()});async function Xa(e){var n;const t=e.target.files&&e.target.files[0];if(t){if(!t.type.startsWith("image/")){C("请选择图片文件");return}try{const s=await Za(t),o=x.pendingBlob&&((n=document.getElementById("photo-preview"))==null?void 0:n.src);o&&o.startsWith("blob:")&&URL.revokeObjectURL(o),x.pendingBlob=s,nn(URL.createObjectURL(s),`原图 ${Math.round(t.size/1024)} KB · 压缩后约 ${Math.round(s.size/1024)} KB（长边 ≤1600px, JPEG q0.8）`),C("图片已就绪，保存小结时上传")}catch(s){C("图片处理失败："+s.message)}}}function Za(e){return new Promise((t,n)=>{const s=new FileReader;s.onerror=()=>n(new Error("读取文件失败")),s.onload=o=>{const a=new Image;a.onerror=()=>n(new Error("图片解码失败")),a.onload=()=>{let l=a.width,r=a.height;(l>1600||r>1600)&&(l>=r?(r=Math.round(r*1600/l),l=1600):(l=Math.round(l*1600/r),r=1600));const d=document.createElement("canvas");d.width=l,d.height=r;const m=d.getContext("2d");m.fillStyle="#fff",m.fillRect(0,0,l,r),m.drawImage(a,0,0,l,r),d.toBlob(h=>h?t(h):n(new Error("压缩失败")),"image/jpeg",.8)},a.src=o.target.result},s.readAsDataURL(e)})}async function Qa(){if(await K("删除今天这张图片？删除后不可恢复。",{title:"删除图片",confirmText:"删除"})){if(x.photoId)try{const n=await(await fetch(`/api/v1/evening/photo/${x.photoId}`,{method:"DELETE"})).json();if(n.code!==200)throw new Error(n.message||"删除失败")}catch(t){C("删除图片失败："+t.message);return}vs(),C("已删除今日图片")}}function Ft(e){const t=Number(e),n=document.getElementById("score-value");n&&(n.innerText=t,n.classList.remove("ev-pop"),n.offsetWidth,n.classList.add("ev-pop"));const s=document.getElementById("score-range");s&&s.value!==String(t)&&(s.value=t),Oe(t)}function Oe(e){const t=tn(e),n=document.getElementById("score-text");n&&(n.innerText=t.label,n.className="mt-2 text-center text-xs font-mono font-medium rounded-lg py-2 transition-colors "+Lt(t.tone).band)}function ei(){const e=document.getElementById("band-editor");e&&(e.classList.toggle("open"),e.classList.contains("open")&&et())}function et(){const e=Q||Te,t=document.getElementById("band-rows");t&&(t.innerHTML=e.map((n,s)=>`
    <div class="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5">
      <span class="text-[11px] font-bold font-mono text-neutral-500 tabular-nums w-9 shrink-0">${n.range[0]}-${n.range[1]}</span>
      <button onclick="evCycleTone(${s})" title="点击切换配色"
              class="w-3.5 h-3.5 rounded-full shrink-0 border border-neutral-200 shadow-sm active:scale-90 transition-transform"
              style="background:${Lt(n.tone).dot}"></button>
      <input type="text" value="${Wa(n.label)}" maxlength="20" oninput="evSetBandLabel(${s}, this.value)"
             class="flex-1 min-w-0 bg-transparent text-xs text-neutral-800 outline-none font-sans">
    </div>`).join(""))}function ti(e,t){var n;(Q||Te)[e].label=t,_t(),Oe(Number((n=document.getElementById("score-range"))==null?void 0:n.value)||7)}function ni(e){var s;const t=Q||Te,n=jt.indexOf(t[e].tone);t[e].tone=jt[(n+1)%jt.length],et(),_t(),Oe(Number((s=document.getElementById("score-range"))==null?void 0:s.value)||7)}function si(){var e;Q=Te.map(t=>({range:[t.range[0],t.range[1]],label:t.label,tone:t.tone})),et(),_t(),Oe(Number((e=document.getElementById("score-range"))==null?void 0:e.value)||7),C("已恢复默认文案，点击「保存设置」生效")}function _t(){document.querySelectorAll("#ev-history-list .evo-score-chip").forEach(e=>{const t=Number(e.dataset.score)||7,n=tn(t);e.className="evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border "+Lt(n.tone).chip})}async function oi(){var n;const e=Q||Te,t=document.getElementById("band-save-btn");t&&(t.disabled=!0,t.classList.add("opacity-60"));try{const o=await(await fetch("/api/config/summary",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({score_bands:e.map(a=>({range:[a.range[0],a.range[1]],label:a.label,tone:a.tone}))})})).json();if(o.code!==200)throw new Error(o.message||"保存失败");C("评分文案已保存并生效"),_t(),Oe(Number((n=document.getElementById("score-range"))==null?void 0:n.value)||7)}catch(s){C("保存失败："+s.message)}finally{t&&(t.disabled=!1,t.classList.remove("opacity-60"))}}async function ys(){var i,l,r;const e=document.getElementById("ev-save-btn"),t=x.date||Be(),n=[1,2,3].map(d=>{var m;return((m=document.getElementById("done-"+d))==null?void 0:m.value.trim())||""}).filter(Boolean),s=((i=document.getElementById("note-text"))==null?void 0:i.value.trim())||"",o=Number((l=document.getElementById("score-range"))==null?void 0:l.value)||7,a=!!x.pendingBlob||!!x.photoId;if(!n.length&&!s&&!a){C("至少填写三件事、图片或感想中的一项");return}e&&(e.disabled=!0,e.classList.add("opacity-60"));try{let d=x.photoId;if(x.pendingBlob){const g=await(await fetch(`/api/v1/evening/photo?date=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":"image/jpeg"},body:x.pendingBlob})).json();if(g.code!==200)throw new Error(g.message||"图片上传失败");d=g.data&&g.data.photo_id?g.data.photo_id:null}const h=await(await fetch("/api/v1/evening/summary",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({record_date:t,done_items:n,note_text:s,score:o,photo_id:d||null})})).json();if(h.code!==200)throw new Error(h.message||"保存失败");if(x.photoId=d,x.pendingBlob&&d){const u=(r=document.getElementById("photo-preview"))==null?void 0:r.src;u&&u.startsWith("blob:")&&URL.revokeObjectURL(u),nn(`/api/v1/evening/photo/${d}`,"已保存 · 长边 ≤1600px, JPEG q0.8")}x.pendingBlob=null,C("今日小结已保存"),await Es()}catch(d){C("保存失败："+d.message)}finally{e&&(e.disabled=!1,e.classList.remove("opacity-60"))}}let xe=null;function We(e){return e===30?"近 30 天":"近 7 天"}function ai(e){document.querySelectorAll("#ev-insight-range button").forEach(t=>t.classList.remove("active")),e.classList.add("active"),x.insightRange=Number(e.dataset.val)||7}function ii(e){e!==7&&e!==30||(x.insightRange=e,document.querySelectorAll("#ev-insight-range button").forEach(t=>{t.classList.toggle("active",Number(t.dataset.val)===e)}))}async function li(e){var a,i;tt();const t=document.getElementById("insight-empty"),n=document.getElementById("insight-panel");(a=document.getElementById("think-body"))==null||a.classList.remove("open"),(i=document.getElementById("think-arrow"))==null||i.classList.remove("rotate-90");const s=document.getElementById("think-text");s&&(s.innerText="");const o=document.getElementById("insight-body");o&&(o.innerHTML=""),n==null||n.classList.add("hidden"),t==null||t.classList.remove("hidden");try{const r=await(await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(e)}`)).json(),d=r&&r.code===200?r.data:null;d&&d.content&&ri(d)}catch{}}function ws(e){if(!e)return"";const t=new Date(e);if(isNaN(t.getTime()))return"";const n=s=>String(s).padStart(2,"0");return n(t.getHours())+":"+n(t.getMinutes())}function ri(e){var i;(i=document.getElementById("insight-empty"))==null||i.classList.add("hidden");const t=document.getElementById("insight-panel");t==null||t.classList.remove("hidden"),ii(Number(e.range_days));const n=e.range_days===7||e.range_days===30?We(e.range_days)+" · ":"",s=document.getElementById("insight-meta");s&&(s.innerText=`${G(e.start_date||x.date)} · ${n}生成于 ${ws(e.created_at)}`);const o=document.getElementById("insight-body");o&&(o.innerHTML=Ne(e.content||""));const a=document.getElementById("think-text");a&&(a.innerText=e.thinking||"")}function tt(){if(xe){try{xe.abort()}catch{}xe=null}const e=document.getElementById("insight-body");e&&e.classList.remove("typing-cursor")}async function ks(){var B,I;if(xe){tt();return}if(x.insightBusy)return;const e=x.date||Be(),t=document.getElementById("ev-insight-btn"),n=document.getElementById("insight-empty"),s=document.getElementById("insight-panel"),o=document.getElementById("insight-body");tt(),x.insightBusy=!0;const a=t?t.className:"";t&&(t.className="mt-3 w-full h-10 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]",t.innerHTML="<span>停止生成</span>"),n==null||n.classList.add("hidden"),s==null||s.classList.remove("hidden"),s==null||s.classList.add("ev-rise"),o&&(o.innerHTML='<p class="text-neutral-400 font-mono text-xs">（正在推导…）</p>',o.classList.add("typing-cursor"));const i=document.getElementById("insight-meta");i&&(i.innerText=`${G(e)} · ${We(x.insightRange)} · 生成中…`);const l=document.getElementById("think-text");l&&(l.innerText=""),(B=document.getElementById("think-body"))==null||B.classList.remove("open"),(I=document.getElementById("think-arrow"))==null||I.classList.remove("rotate-90");let r=!1,d="";const m=({thinking:f,content:w})=>{var $,M,U,z;o&&w&&w!==d&&(d=w,o.innerHTML=Ne(w)),f&&l&&(l.innerText=f,w?r||(r=!0,(U=document.getElementById("think-body"))==null||U.classList.remove("open"),(z=document.getElementById("think-arrow"))==null||z.classList.remove("rotate-90")):(($=document.getElementById("think-body"))==null||$.classList.add("open"),(M=document.getElementById("think-arrow"))==null||M.classList.add("rotate-90")))},h=new AbortController;xe=h;const u=-new Date().getTimezoneOffset(),g=document.getElementById("ev-insight-stop-btn"),b=document.getElementById("ev-insight-reset-btn");g==null||g.classList.remove("hidden"),b==null||b.classList.add("hidden");try{const f=await Xt({url:`/api/v1/evening/insight/stream?date=${encodeURIComponent(e)}&days=${x.insightRange}&tz_offset=${u}`,signal:h.signal,onUpdate:m,onDone:({thinking:w,content:$,hasError:M})=>{M?i&&(i.innerText=`${G(e)} · ${We(x.insightRange)} · 生成失败`):$||w?i&&(i.innerText=`${G(e)} · ${We(x.insightRange)} · 生成于 ${ws(new Date)}`):o&&(o.innerHTML='<p class="text-neutral-400 text-xs">未能获取到分析内容，请检查大模型配置。</p>')},onError:(w,{thinking:$,content:M})=>{M||$?m({thinking:$,content:M+`

> **注意**: 网络连接中断`}):w instanceof TypeError?o&&(o.innerHTML='<p class="text-rose-500 text-xs font-mono">无法连接本地服务，请确认 HealthTrack 正在运行。</p>'):o&&(o.innerHTML='<p class="text-rose-500 text-xs font-mono">生成失败：'+_(w.message)+"</p>")}});f.aborted&&(f.content||f.thinking?(m({thinking:f.thinking,content:f.content+`

> **已手动停止生成**`}),i&&(i.innerText=`${G(e)} · ${We(x.insightRange)} · 已停止`)):(s==null||s.classList.add("hidden"),n==null||n.classList.remove("hidden")))}finally{xe===h&&(xe=null),o&&o.classList.remove("typing-cursor"),x.insightBusy=!1,g==null||g.classList.add("hidden"),b==null||b.classList.remove("hidden"),t&&(t.className=a,t.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成小结深度洞察</span>')}}async function di(){var n,s,o,a;if(!await K("清除这一天的小结洞察？清除后可重新生成。",{title:"清除洞察",confirmText:"清除"}))return;const t=x.date||Be();try{const l=await(await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(t)}`,{method:"DELETE"})).json();if(l.code!==200)throw new Error(l.message||"清除失败");tt(),(n=document.getElementById("insight-panel"))==null||n.classList.add("hidden"),(s=document.getElementById("insight-empty"))==null||s.classList.remove("hidden");const r=document.getElementById("insight-body");r&&(r.innerHTML="");const d=document.getElementById("think-text");d&&(d.innerText=""),(o=document.getElementById("think-body"))==null||o.classList.remove("open"),(a=document.getElementById("think-arrow"))==null||a.classList.remove("rotate-90"),C("已清除该日小结洞察")}catch(i){C("清除失败："+i.message)}}function ci(){const e=document.getElementById("think-body"),t=document.getElementById("think-arrow");if(!e)return;const n=!e.classList.contains("open");e.classList.toggle("open",n),t&&t.classList.toggle("rotate-90",n)}async function Es(){try{const t=await(await fetch("/api/v1/evening/summaries")).json();if(t.code!==200)throw new Error(t.message||"加载失败");x.summaries=t.data&&t.data.items||[]}catch(e){C("加载往期小结失败："+e.message),x.summaries=[]}x.visible=Math.max(x.visible,Re),Pe()}function ui(){return x.summaries.filter(e=>{if(x.dateFilter!=="all"&&qa(e.record_date)>Number(x.dateFilter)-1)return!1;const t=e.score||0;return!(x.scoreFilter==="high"&&t<9||x.scoreFilter==="good"&&(t<7||t>8)||x.scoreFilter==="mid"&&(t<5||t>6)||x.scoreFilter==="low"&&t>4)})}function pi(e){const t=(e.done_items||[]).filter(s=>s&&s.trim()),n=[`${e.record_date} ${hs(e.record_date)} · ${e.score} 分`,"","【完成事项】"];return t.length?t.forEach((s,o)=>n.push(`${o+1}. ${s}`)):n.push("（未填写）"),n.push("","【当时的感想】",e.note_text&&e.note_text.trim()?e.note_text:"（未填写）"),n.join(`
`)}async function mi(e,t){t&&t.stopPropagation();const n=(x.summaries||[]).find(o=>o.record_date===e);if(!n)return;const s=await Ln(pi(n));C(s?"已复制 "+G(e)+" 的小结":"复制失败，请长按文字手动复制")}function fi(e,t){const n=e.score!=null&&e.score>0?e.score:7,s=Lt(tn(n).tone),o=e.photo_id?`<img src="/api/v1/evening/photo/${e.photo_id}" alt="${G(e.record_date)}" onclick="event.stopPropagation(); evoOpenPhoto(this.src, '${G(e.record_date)} 小结图片')" class="rounded-lg object-cover shrink-0 border border-neutral-200 bg-neutral-100 cursor-zoom-in" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">`:'<span class="rounded-lg shrink-0 border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-400 font-mono font-bold" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">无图</span>',a=(e.done_items||[]).filter(r=>r&&r.trim()),i=a.length?a[0]:"（未填完成事项）",l=[0,1,2].map(r=>{const d=e.done_items&&e.done_items[r]||"";return d&&d.trim()?`<li class="flex items-start space-x-1.5 text-xs text-neutral-700 leading-relaxed"><span class="text-neutral-400 font-mono text-[10px] mt-0.5">${r+1}.</span><span>${_(d)}</span></li>`:`<li class="flex items-start space-x-1.5 text-xs text-neutral-300 leading-relaxed"><span class="font-mono text-[10px] mt-0.5">${r+1}.</span><span>未记录</span></li>`}).join("");return`
  <div class="evo-tl-item ev-rise" style="animation-delay:${Math.min(t,7)*40}ms">
    <span class="evo-tl-node"></span><span class="evo-tl-line"></span>
    <div class="evo-swipe" data-date="${e.record_date}">
      <div class="evo-swipe-action">
        <button class="evo-swipe-del" onclick="evAskDelete('${e.record_date}')">
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
                  <span class="text-xs font-bold font-mono text-neutral-900 tabular-nums">${G(e.record_date)}</span>
                  <span class="text-[10px] text-neutral-400 font-mono">${hs(e.record_date)}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${s.chip}" data-score="${n}">${n} 分</span>
                  <span class="evo-entry-arrow text-neutral-400 transform transition-transform duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </div>
              <p class="text-xs text-neutral-500 truncate mt-0.5 font-sans">${_(i)}</p>
            </div>
          </div>
          <div class="evo-collapsible">
            <div class="px-3 pb-3 pt-2.5 border-t border-neutral-100 space-y-2.5">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">完成事项</p>
                  <button type="button" class="evo-copy-btn" onclick="evCopyEntry('${e.record_date}', event)" aria-label="复制这天的记录">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <span>复制</span>
                  </button>
                </div>
                <ol class="space-y-1 evo-selectable">${l}</ol>
              </div>
              <div class="bg-neutral-50 border border-neutral-200/60 rounded-lg p-2.5">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">当时的感想</p>
                  <span class="font-mono text-[10px] text-neutral-500">自评：${n} / 10 分</span>
                </div>
                <p class="text-xs text-neutral-600 leading-relaxed evo-selectable">${e.note_text?_(e.note_text):"（未填写）"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`}function Pe(){const e=ui(),t=e.slice(0,x.visible),n=document.getElementById("ev-history-list"),s=document.getElementById("ev-history-empty"),o=document.getElementById("ev-load-more"),a=document.getElementById("ev-load-done"),i=document.getElementById("ev-filter-reset"),l=document.getElementById("ev-filter-count");l&&(l.innerText=e.length);const r=document.getElementById("ev-history-total");if(r&&(r.innerText=x.summaries.length+" 篇"),i&&i.classList.toggle("hidden",x.dateFilter==="all"&&x.scoreFilter==="all"),!n)return;if(!e.length){n.innerHTML="",s==null||s.classList.remove("hidden"),o==null||o.classList.add("hidden"),a==null||a.classList.add("hidden");return}s==null||s.classList.add("hidden");let d="",m="";t.forEach((u,g)=>{const b=En(u.record_date);if(b!==m){const B=e.filter(I=>En(I.record_date)===b).length;d+=`<div class="flex items-center space-x-2 pt-2 pb-2.5 pl-6 font-mono text-[10px]">
                 <span class="font-bold text-neutral-500 tracking-wider">${Va(b)}</span>
                 <span class="flex-1 h-px bg-neutral-200"></span>
                 <span class="text-neutral-400 tabular-nums">${B} 篇</span>
               </div>`,m=b}d+=fi(u,g)}),n.innerHTML=d,vi();const h=e.length-t.length;if(h>0){o==null||o.classList.remove("hidden"),a==null||a.classList.add("hidden");const u=document.getElementById("ev-remain-count");u&&(u.innerText=h)}else o==null||o.classList.add("hidden"),a==null||a.classList.remove("hidden")}function xi(){x.visible+=Re,Pe()}function gi(e){document.querySelectorAll("#ev-filter-date button").forEach(t=>t.classList.remove("active")),e.classList.add("active"),x.dateFilter=e.dataset.val,x.visible=Re,Pe()}function hi(e){document.querySelectorAll("#ev-filter-score button").forEach(t=>t.classList.remove("active")),e.classList.add("active"),x.scoreFilter=e.dataset.val,x.visible=Re,Pe()}function bi(){document.querySelectorAll("#ev-filter-date button, #ev-filter-score button").forEach(e=>{e.classList.toggle("active",e.dataset.val==="all")}),x.dateFilter="all",x.scoreFilter="all",x.visible=Re,Pe()}function vi(){document.querySelectorAll("#ev-history-list .evo-swipe-panel").forEach(e=>{e.addEventListener("pointerdown",yi),e.addEventListener("pointermove",wi),e.addEventListener("pointerup",In),e.addEventListener("pointercancel",In)})}function yi(e){const t=e.currentTarget,n=t.closest(".evo-swipe");if(!n||n.classList.contains("removing")||e.pointerType==="mouse"&&e.button!==0)return;const s=window.getSelection&&window.getSelection();s&&!s.isCollapsed&&s.anchorNode&&t.contains(s.anchorNode)||(Is(n),ve.drag={panel:t,swipe:n,id:e.pointerId,x0:e.clientX,y0:e.clientY,axis:null,base:n.classList.contains("open")?-84:0,off:0})}function wi(e){const t=ve.drag;if(!t||e.pointerId!==t.id)return;const n=e.clientX-t.x0,s=e.clientY-t.y0;if(!t.axis){if(Math.abs(n)<6&&Math.abs(s)<6)return;if(t.axis=Math.abs(n)>Math.abs(s)?"x":"y",t.axis==="x"){t.panel.classList.add("dragging");try{t.panel.setPointerCapture(e.pointerId)}catch{}}}if(t.axis!=="x")return;let o=t.base+n;o>0?o*=.28:o<-84&&(o=-84-(Math.abs(o)-ve.W)*.25),t.off=o,t.panel.style.transform="translateX("+o+"px)",e.cancelable&&e.preventDefault()}function In(e){const t=ve.drag;if(!t||e.pointerId!==t.id)return;const n=t.panel,s=t.swipe;n.classList.remove("dragging"),n.style.transform="",t.axis==="x"&&(s.classList.toggle("open",t.off<-42),ve.suppressClick=Date.now()),ve.drag=null}function Is(e){document.querySelectorAll("#ev-history-list .evo-swipe.open").forEach(t=>{t!==e&&t.classList.remove("open")})}function ki(){var e;(e=document.getElementById("ev-history-list"))==null||e.addEventListener("click",t=>{const n=t.target.closest(".evo-entry-head");if(!n||Date.now()-ve.suppressClick<320)return;const s=n.closest(".evo-swipe");if(s&&s.classList.contains("open")){s.classList.remove("open");return}Is();const a=(n.closest(".ht-card")||n.parentElement).querySelector(".evo-collapsible"),i=n.querySelector(".evo-entry-arrow");if(!a)return;const l=!a.classList.contains("open");a.classList.toggle("open",l),i&&(i.style.transform=l?"rotate(180deg)":"rotate(0deg)")})}async function Ei(e){const t=x.summaries.find(a=>a.record_date===e),n=await K(`${G(e)}${t?" · "+t.score+" 分":""}，删除后不可恢复。`,{title:"删除这篇小结？",confirmText:"删除"}),s=document.querySelector(`.evo-swipe[data-date="${e}"]`);if(!n){s&&s.classList.remove("open");return}try{const i=await(await fetch(`/api/v1/evening/summary/${encodeURIComponent(e)}`,{method:"DELETE"})).json();if(i.code!==200)throw new Error(i.message||"删除失败")}catch(a){C("删除失败："+a.message),s&&s.classList.remove("open");return}const o=()=>{if(x.summaries=x.summaries.filter(a=>a.record_date!==e),Pe(),x.date===e){x.date=Be();const a=document.getElementById("summary-date");a&&(a.value=x.date),St()}};s?(s.classList.add("removing"),setTimeout(()=>{o(),C("已删除 "+G(e)+" 的小结")},260)):(o(),C("已删除 "+G(e)+" 的小结"))}window.loadEveningTab=Pt;window.evSetToday=Ja;window.evOnDateChange=Ya;window.evUpdateDoneCount=bs;window.evoOpenPhoto=Ka;window.evoClosePhoto=sn;window.evOnPhotoPick=Xa;window.evRemovePhoto=Qa;window.evUpdateScore=Ft;window.evToggleBandEditor=ei;window.evCycleTone=ni;window.evSetBandLabel=ti;window.evResetBands=si;window.evSaveBands=oi;window.evSave=ys;window.evoSubmit=ys;window.evSetInsightRange=ai;window.evGenerateInsight=ks;window.evoGenerateInsight=ks;window.evStopInsight=tt;window.evResetInsight=di;window.evToggleThinking=ci;window.evSetDateFilter=gi;window.evSetScoreFilter=hi;window.evResetFilters=bi;window.evAskDelete=Ei;window.evCopyEntry=mi;window.evLoadMore=xi;function zt(e){ie.set({currentTab:e}),["log","dash","trend","trend-detail","insight","history","compare","evening"].forEach(o=>{const a=document.getElementById(`view-${o}`);a&&(o===e?a.classList.remove("hidden"):a.classList.add("hidden"))});const n=document.getElementById("save-bar");n&&n.classList.toggle("hidden",e!=="log");const s=document.getElementById("app-frame");s&&e!=="trend-detail"&&s.classList.remove("frame-wide"),e==="dash"?Jo():e==="trend"?fa():e==="trend-detail"?xa():e==="insight"?ba():e==="compare"?va():e==="evening"&&Ua()}window.switchTab=zt;document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("app-frame"),t=document.getElementById("main-content");Ts(),Bs(e),Ss(e,n=>zt(n)),_s(document.body),Hs(document.body),lo(document.body),Os(t),Wo(t),ha(t),za(t),zt("log")});
