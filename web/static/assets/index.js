(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();function ln(){let e=document.getElementById("toast");e||(e=document.createElement("div"),e.id="toast",e.className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 opacity-0 pointer-events-none -translate-y-4",e.innerHTML=`
      <div id="toast-body" class="bg-neutral-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-xs font-mono font-medium">
        <span id="toast-icon">✓</span>
        <span id="toast-msg">操作成功</span>
      </div>
    `,document.body.appendChild(e))}function w(e,t=!0){const n=document.getElementById("toast"),s=document.getElementById("toast-icon"),o=document.getElementById("toast-msg");!n||!s||!o||(s.innerText=t?"✓":"✕",o.innerText=e,n.classList.remove("opacity-0","-translate-y-4","pointer-events-none"),n.classList.add("opacity-100","translate-y-0"),setTimeout(()=>{n.classList.remove("opacity-100","translate-y-0"),n.classList.add("opacity-0","-translate-y-4","pointer-events-none")},2200))}window.showToast=w;function rn(e){var n,s;e.insertAdjacentHTML("afterbegin",`
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
  `),(n=document.getElementById("btn-open-settings"))==null||n.addEventListener("click",()=>{typeof window.openSettings=="function"&&window.openSettings()}),(s=document.getElementById("btn-open-data"))==null||s.addEventListener("click",()=>{typeof window.openDataSheet=="function"&&window.openDataSheet()})}function R(e){const t=e instanceof Date?e:new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function dn(e,t){const[n,s,o]=e.split("-").map(Number),a=new Date(n,s-1,o);return a.setDate(a.getDate()+t),R(a)}function cn(e,t){if(!e||!t)return{duration:0,bedMinutes:0};const[n,s]=e.split(":").map(Number),[o,a]=t.split(":").map(Number);let l=n*60+s,i=o*60+a;return i<=l&&(i+=1440),{duration:Number(((i-l)/60).toFixed(1)),bedMinutes:l}}class pn{constructor(){this._state={currentTab:"log",currentDate:R(new Date),isDirty:!1,hasSavedRecord:!1,dashRange:7,sleepThresholds:{green:"23:30",yellow:"01:00"}},this._listeners=new Set}get state(){return this._state}set(t){const n={...this._state};this._state={...this._state,...t},this._notify(this._state,n)}subscribe(t){return this._listeners.add(t),()=>this._listeners.delete(t)}_notify(t,n){this._listeners.forEach(s=>{try{s(t,n)}catch(o){console.error("State subscriber error:",o)}})}}const ce=new pn;try{Object.defineProperty(window,"currentTab",{get(){return ce.state.currentTab||"log"},set(e){ce.set({currentTab:e})},configurable:!0})}catch{window.currentTab="log"}function un(e,t){e.insertAdjacentHTML("beforeend",`
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
  `);const s=document.getElementById("bottom-nav");s==null||s.addEventListener("click",o=>{const a=o.target.closest("button[data-tab]");if(!a)return;const l=a.getAttribute("data-tab");typeof t=="function"&&t(l)}),ce.subscribe(o=>{const a=o.currentTab,l=a==="history"||a==="compare"?"insight":a==="trend"||a==="trend-detail"?"dash":a;["log","dash","insight","evening"].forEach(i=>{const r=document.getElementById(`tab-${i}`);r&&(i===l?(r.classList.add("active","text-neutral-900"),r.classList.remove("text-neutral-400")):(r.classList.remove("active","text-neutral-900"),r.classList.add("text-neutral-400")))})})}const Tt="";async function D(e,t={}){const n=`${Tt}${e}`,s=await fetch(n,{headers:{"Content-Type":"application/json",...t.headers},...t});if(!s.ok){let a=`HTTP Error ${s.status}`;try{const l=await s.json();a=l.message||l.error||a}catch{}throw new Error(a)}const o=s.headers.get("content-type");return o&&o.includes("application/json")?await s.json():await s.text()}const ne={getRecordByDate:e=>D(`/api/v1/records/by-date?date=${encodeURIComponent(e)}`),saveRecord:e=>D("/api/v1/records",{method:"POST",body:JSON.stringify(e)}),getHistoryRecords:(e,t)=>D(`/api/v1/records/history?start=${encodeURIComponent(e)}&end=${encodeURIComponent(t)}`),getConfig:()=>D("/api/config"),saveConfig:e=>D("/api/config",{method:"POST",body:JSON.stringify(e)}),testAIConfig:e=>D("/api/config/test",{method:"POST",body:JSON.stringify(e)}),getSleepThresholds:()=>D("/api/config/sleep-thresholds"),saveSleepThresholds:e=>D("/api/config/sleep-thresholds",{method:"POST",body:JSON.stringify(e)}),checkInsightPeriod:(e,t)=>D(`/api/v1/insights/period?days=${e}&end_date=${encodeURIComponent(t)}`),getInsightHistory:(e={})=>{const t=new URLSearchParams(e).toString();return D(`/api/v1/insights${t?"?"+t:""}`)},deleteInsight:e=>D(`/api/v1/insights/${e}`,{method:"DELETE"}),getEveningSummary:e=>D(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`),saveEveningSummary:e=>D("/api/v1/evening/summary",{method:"POST",body:JSON.stringify(e)}),deleteEveningSummary:e=>D(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`,{method:"DELETE"}),uploadPhoto:async e=>{const t=await fetch(`${Tt}/api/v1/evening/photo`,{method:"POST",body:e});if(!t.ok)throw new Error("上传图片失败");return await t.json()},deletePhoto:e=>D(`/api/v1/evening/photo/${e}`,{method:"DELETE"})};function mn(e){var l,i,r;e.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("settings-modal"),s=document.getElementById("btn-close-settings"),o=document.getElementById("toggle-api-key"),a=document.getElementById("setting-api-key");n==null||n.addEventListener("click",d=>{d.target===n&&Me()}),s==null||s.addEventListener("click",Me),o==null||o.addEventListener("click",()=>{a.type==="password"?(a.type="text",o.innerText="隐藏"):(a.type="password",o.innerText="显示")}),(l=document.getElementById("save-config-btn"))==null||l.addEventListener("click",gn),(i=document.getElementById("test-config-btn"))==null||i.addEventListener("click",bn),(r=document.getElementById("save-sleep-btn"))==null||r.addEventListener("click",hn)}function xn(){const e=document.getElementById("settings-modal");e&&(e.classList.remove("hidden"),fn())}function Me(){const e=document.getElementById("settings-modal");e==null||e.classList.add("hidden")}async function fn(){try{const e=await ne.getConfig(),t=document.getElementById("setting-base-url"),n=document.getElementById("setting-model"),s=document.getElementById("api-key-status");t&&(t.value=e.base_url||""),n&&(n.value=e.model||""),s&&(s.innerText=e.has_api_key?"✓ 当前已配置有效 API Key":"⚠️ 尚未配置 API Key");const o=await ne.getSleepThresholds(),a=document.getElementById("setting-sleep-green"),l=document.getElementById("setting-sleep-yellow");a&&(a.value=o.green||"23:30"),l&&(l.value=o.yellow||"01:00")}catch(e){w("读取设置失败: "+e.message,!1)}}async function gn(){const e=document.getElementById("setting-base-url"),t=document.getElementById("setting-model"),n=document.getElementById("setting-api-key"),s={base_url:(e==null?void 0:e.value.trim())||"",model:(t==null?void 0:t.value.trim())||""};n&&n.value.trim()&&(s.api_key=n.value.trim());try{await ne.saveConfig(s),w("AI 配置已更新"),Me()}catch(o){w("保存失败: "+o.message,!1)}}async function bn(){const e=document.getElementById("setting-base-url"),t=document.getElementById("setting-model"),n=document.getElementById("setting-api-key"),s=document.getElementById("settings-feedback"),o={base_url:(e==null?void 0:e.value.trim())||"",model:(t==null?void 0:t.value.trim())||""};n&&n.value.trim()&&(o.api_key=n.value.trim()),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 text-neutral-600 block",s.innerText="正在测试连接中…");try{await ne.testAIConfig(o),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-900 text-white block",s.innerText="✓ 测试连接成功！")}catch(a){s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 block",s.innerText="✕ 测试连接失败: "+a.message)}}async function hn(){const e=document.getElementById("setting-sleep-green"),t=document.getElementById("setting-sleep-yellow");try{await ne.saveSleepThresholds({green:(e==null?void 0:e.value)||"23:30",yellow:(t==null?void 0:t.value)||"01:00"}),w("熬夜阈值已保存")}catch(n){w("保存阈值失败: "+n.message,!1)}}window.openSettings=xn;window.closeSettings=Me;function vn(e){var o,a,l,i,r;e.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("data-sheet"),s=document.getElementById("btn-close-datasheet");n==null||n.addEventListener("click",d=>{d.target===n&&Q()}),s==null||s.addEventListener("click",Q),(o=document.getElementById("btn-open-file-import"))==null||o.addEventListener("click",()=>{Q(),typeof window.openImportModal=="function"&&window.openImportModal()}),(a=document.getElementById("btn-open-memo-import"))==null||a.addEventListener("click",()=>{Q(),typeof window.openMemoImportModal=="function"&&window.openMemoImportModal()}),(l=document.getElementById("btn-open-batches"))==null||l.addEventListener("click",()=>{Q(),typeof window.openImportBatchesModal=="function"&&window.openImportBatchesModal()}),(i=document.getElementById("btn-dl-template"))==null||i.addEventListener("click",()=>{window.location.href="/api/v1/import/template"}),(r=document.getElementById("btn-open-export"))==null||r.addEventListener("click",()=>{Q(),typeof window.openExportModal=="function"&&window.openExportModal()})}function yn(){var e;(e=document.getElementById("data-sheet"))==null||e.classList.remove("hidden")}function Q(){var e;(e=document.getElementById("data-sheet"))==null||e.classList.add("hidden")}window.openDataSheet=yn;window.closeDataSheet=Q;const wn=`    <!-- 导出数据弹窗：Excel 表格与 JSON 完整备份两种方式 -->
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
            <button type="button" data-type="excel" onclick="selectExportType(this)" class="py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition-all">Excel</button>
            <button type="button" data-type="json" onclick="selectExportType(this)" class="py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">JSON</button>
            <button type="button" data-type="archive" onclick="selectExportType(this)" class="py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">图文归档</button>
          </div>
          <div id="export-range-panel">
            <label class="block text-xs font-bold text-slate-600 mb-2">导出范围</label>
            <div class="grid grid-cols-3 gap-2" id="export-range-pills">
              <button data-range="7" onclick="selectExportRange(this)" class="py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">最近7天</button>
              <button data-range="30" onclick="selectExportRange(this)" class="py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">最近30天</button>
              <button data-range="all" onclick="selectExportRange(this)" class="py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition-all">全部</button>
            </div>
          </div>
          <div id="export-json-panel" class="hidden">
            <div class="rounded-2xl bg-amber-50 border border-amber-100 px-3.5 py-3 text-[11px] leading-relaxed text-amber-800">
              <p class="font-bold text-xs mb-1.5">这是完整备份，不是筛选导出</p>
              <ul class="space-y-1 list-disc list-inside">
                <li>包含全部健康记录与睡前小结，不受时间范围限制</li>
                <li>不包含小结照片与 AI 洞察</li>
                <li>之后可在「导入数据」中原样回灌，用于换机或重装恢复</li>
              </ul>
            </div>
          </div>
          <div id="export-archive-panel" class="hidden">
            <div class="rounded-2xl bg-indigo-50 border border-indigo-100 px-3.5 py-3 text-[11px] leading-relaxed text-indigo-800">
              <p class="font-bold text-xs mb-1.5">图文小结归档（ZIP）</p>
              <ul class="space-y-1 list-disc list-inside">
                <li>包含所选范围内的小结表格与全部难忘图片</li>
                <li>解压后：summaries.csv + photos/ 日期.jpg + manifest.json</li>
                <li>图片为应用内保存的压缩版，不包含手机相册原文件</li>
              </ul>
            </div>
          </div>
          <div id="export-result" class="hidden text-xs rounded-xl px-3 py-2.5"></div>
          <button id="export-start-btn" type="button" onclick="exportCurrent()" class="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">开始导出</button>
          <button id="export-json-btn" type="button" onclick="exportCurrent()" class="hidden w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">导出 JSON 备份</button>
          <button id="export-archive-btn" type="button" onclick="exportCurrent()" class="hidden w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">导出图文归档</button>
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
            <button id="import-pick-btn" type="button" onclick="impPickFile()" class="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">选择文件</button>
            <p class="text-[11px] text-slate-400 mt-2 leading-relaxed">支持 CSV 模板与 HealthTrack JSON 备份，单次最多 5000 行 / 5 MB。手机端请先把文件保存到「下载」目录，xlsx 需另存为 CSV。</p>
          </div>

          <div id="import-step-preview" class="hidden space-y-3">
            <div class="rounded-2xl bg-slate-50 px-3.5 py-3">
              <p id="import-file-meta" class="text-[11px] text-slate-500 break-all"></p>
              <div class="grid grid-cols-5 gap-1.5 mt-2.5 text-center">
                <div><p class="text-[10px] text-slate-400">总行数</p><p id="imp-stat-total" class="text-sm font-bold text-slate-800">0</p></div>
                <div><p class="text-[10px] text-slate-400">新增</p><p id="imp-stat-inserted" class="text-sm font-bold text-emerald-600">0</p></div>
                <div><p class="text-[10px] text-slate-400">更新</p><p id="imp-stat-updated" class="text-sm font-bold text-blue-600">0</p></div>
                <div><p class="text-[10px] text-slate-400">警告</p><p id="imp-stat-warnings" class="text-sm font-bold text-amber-600">0</p></div>
                <div><p class="text-[10px] text-slate-400">错误</p><p id="imp-stat-errors" class="text-sm font-bold text-rose-600">0</p></div>
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
        <div class="px-5 py-4 border-t border-slate-100 shrink-0 flex gap-2">
          <button type="button" onclick="closeImport()" class="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">取消</button>
          <button id="import-confirm-btn" type="button" onclick="impConfirm()" disabled class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm transition-colors opacity-50">确认导入</button>
        </div>
      </section>
    </div>

    <!-- 备忘录粘贴导入 -->
    <div id="memo-import-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm p-4 flex items-center justify-center" onclick="closeMemoOnBackdrop(event)">
      <section class="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="memo-import-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 id="memo-import-title" class="font-bold text-slate-900">从备忘录导入</h2>
            <p class="text-xs text-slate-400 mt-0.5">粘贴后先预检，确认无误再写入</p>
          </div>
          <button onclick="closeMemo()" aria-label="关闭备忘录导入" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div class="p-5 space-y-3 overflow-y-auto no-scrollbar">
          <textarea id="memo-import-text" rows="10" placeholder="例如：&#10;10-01 76.9 78.2 腰78 睡23:30-7:00&#10;10-02 76.8 早上有点累" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"></textarea>
          <div class="flex items-center justify-between">
            <label for="memo-year-base" class="text-xs font-bold text-slate-600">年份基准</label>
            <select id="memo-year-base" class="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"></select>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">未写年份时按年份基准推断，晚于今天的日期归到上一年。</p>
        </div>
        <div class="px-5 py-4 border-t border-slate-100 shrink-0 flex gap-2">
          <button type="button" onclick="closeMemo()" class="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">取消</button>
          <button id="memo-preview-btn" type="button" onclick="impPreviewMemo()" class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">预检</button>
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
    <div id="app-toast" class="hidden fixed left-1/2 -translate-x-1/2 bottom-24 z-[80] max-w-[90%] px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white text-xs shadow-xl"></div>

    <!-- 小结图片全屏查看 -->
    <div id="ev-photo-viewer" class="hidden fixed inset-0 z-[85] bg-slate-950/95 flex items-center justify-center" onclick="evoClosePhoto()" role="dialog" aria-modal="true" aria-label="查看小结图片">
      <img id="ev-photo-viewer-img" src="" alt="" class="w-full h-full object-contain p-4 select-none">
      <button type="button" onclick="event.stopPropagation(); evoClosePhoto()" aria-label="关闭图片" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 text-white text-lg leading-none flex items-center justify-center backdrop-blur active:scale-95 transition-transform">✕</button>
      <p class="absolute bottom-6 inset-x-0 text-center text-[11px] text-white/60">点击任意处关闭</p>
    </div>

    <!-- 核心内容切换区 -->`;function W(e,t){const n=t||{};return new Promise(s=>{const o=document.getElementById("app-confirm-modal"),a=document.getElementById("app-confirm-title"),l=document.getElementById("app-confirm-msg"),i=document.getElementById("app-confirm-ok"),r=document.getElementById("app-confirm-cancel");if(!o){s(!1);return}a.innerText=n.title||"请确认",l.innerText=e||"",i.innerText=n.confirmText||"确定",n.danger===!1?i.className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors":i.className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors";const d=()=>{o.classList.add("hidden"),i.onclick=null,r.onclick=null,o.onclick=null};i.onclick=()=>{d(),s(!0)},r.onclick=()=>{d(),s(!1)},o.onclick=p=>{p.target===o&&(d(),s(!1))},o.classList.remove("hidden")})}async function kn(e){if(window.HealthTrack&&typeof window.HealthTrack.copyText=="function")try{return window.HealthTrack.copyText(e),!0}catch{}try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(e),!0}catch{}try{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-2000px",t.style.opacity="0",document.body.appendChild(t),t.select(),t.setSelectionRange(0,e.length);const n=document.execCommand("copy");return document.body.removeChild(t),n}catch{return!1}}let ze=null;function L(e){const t=document.getElementById("app-toast");t?(t.innerText=e||"",t.classList.remove("hidden"),ze&&clearTimeout(ze),ze=setTimeout(()=>t.classList.add("hidden"),2600)):w(e,!0)}window.appConfirm=W;window.appCopyText=kn;window.appToast=L;let ee="all",q="excel",ge=0;function En(e){e.insertAdjacentHTML("beforeend",wn)}function In(){var e;(e=document.getElementById("export-modal"))==null||e.classList.remove("hidden"),Lt(document.querySelector('#export-type-pills button[data-type="excel"]')),$t(document.querySelector('#export-range-pills button[data-range="all"]'))}function Lt(e){var o,a,l,i,r,d;if(!e)return;q=e.getAttribute("data-type"),document.querySelectorAll("#export-type-pills button").forEach(p=>{const g=p===e;p.className=g?"py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition-all":"py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"});const t=q==="json",n=q==="archive";(o=document.getElementById("export-range-panel"))==null||o.classList.toggle("hidden",t),(a=document.getElementById("export-json-panel"))==null||a.classList.toggle("hidden",!t),(l=document.getElementById("export-archive-panel"))==null||l.classList.toggle("hidden",!n),(i=document.getElementById("export-start-btn"))==null||i.classList.toggle("hidden",t||n),(r=document.getElementById("export-json-btn"))==null||r.classList.toggle("hidden",!t),(d=document.getElementById("export-archive-btn"))==null||d.classList.toggle("hidden",!n);const s=document.getElementById("export-subtitle");s&&(s.textContent=t?"全量备份，包含健康记录与睡前小结":n?"小结表格 + 难忘图片，打包为 ZIP":"导出为 CSV，可用 Excel / WPS 打开"),St()}function Bn(){return q==="json"?_n():q==="archive"?jn():$n()}function Xe(){document.getElementById("export-modal").classList.add("hidden")}function Tn(e){e.target===e.currentTarget&&Xe()}function $t(e){ee=e.getAttribute("data-range"),document.querySelectorAll("#export-range-pills button").forEach(t=>{const n=t===e;t.className=n?"py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition-all":"py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"}),St()}function St(){const e=document.getElementById("export-result");e.classList.add("hidden"),e.textContent=""}function Ln(e){const t=e==="7"?"7d":e==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_export_${t}_${s}.csv`}async function $n(){const e="/api/v1/export"+(ee==="all"?"":`?range=${ee}`);if(window.HealthTrack){ge=await Ze(e),P(!0),window.location.href=e;return}P(!0);try{const t=await fetch(e);if(!t.ok)throw new Error("HTTP "+t.status);const n=await t.blob(),s=Ln(ee),o=document.createElement("a"),a=URL.createObjectURL(n);o.href=a,o.download=s,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),2e3),X(!0,{filename:s,size:n.size,location:"浏览器默认下载目录"}),w("导出成功",!0)}catch(t){X(!1,{message:"导出失败："+(t.message||"网络错误")}),w("导出失败",!1)}finally{P(!1)}}function Sn(){const e=new Date;return`HealthTrack_backup_v2_${""+e.getFullYear()+String(e.getMonth()+1).padStart(2,"0")+String(e.getDate()).padStart(2,"0")}.json`}async function _n(){if(!await W("将导出全部健康记录与睡前小结为一个 JSON 文件（不含小结照片与 AI 洞察），不受时间范围限制。导出后可原样回灌到本应用。",{title:"导出完整备份？",confirmText:"开始导出",danger:!1}))return;const t="/api/v1/export/json";if(window.HealthTrack){ge=await Ze(t),P(!0),window.location.href=t;return}P(!0);try{const n=await fetch(t);if(!n.ok)throw new Error("HTTP "+n.status);const s=await n.blob(),o=Sn(),a=document.createElement("a"),l=URL.createObjectURL(s);a.href=l,a.download=o,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(l),2e3),X(!0,{filename:o,size:s.size,location:"浏览器默认下载目录"}),w("备份已导出",!0)}catch(n){X(!1,{message:"导出失败："+(n.message||"网络错误")}),w("导出失败",!1)}finally{P(!1)}}function Mn(e){const t=e==="7"?"7d":e==="30"?"30d":"all",n=new Date,s=""+n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0");return`HealthTrack_summaries_${t}_${s}.zip`}async function jn(){const e="/api/v1/export/summaries.zip"+(ee==="all"?"":`?range=${ee}`);if(window.HealthTrack){ge=await Ze(e),P(!0),window.location.href=e;return}P(!0);try{const t=await fetch(e);if(!t.ok)throw new Error("HTTP "+t.status);const n=await t.blob(),s=Mn(ee),o=document.createElement("a"),a=URL.createObjectURL(n);o.href=a,o.download=s,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),2e3),X(!0,{filename:s,size:n.size,location:"浏览器默认下载目录"}),w("导出成功",!0)}catch(t){X(!1,{message:"导出失败："+(t.message||"网络错误")}),w("导出失败",!1)}finally{P(!1)}}function P(e){const t=q==="json"?"export-json-btn":q==="archive"?"export-archive-btn":"export-start-btn",n=document.getElementById(t);n&&(n.disabled=e,n.classList.toggle("opacity-50",e),n.textContent=e?"导出中…":q==="json"?"导出 JSON 备份":q==="archive"?"导出图文归档":"开始导出")}function X(e,t){const n=document.getElementById("export-result");if(n.classList.remove("hidden"),e){const s=t.size!=null?`（${_t(t.size)}）`:"",o=window.HealthTrack?'<button onclick="window.HealthTrack.openDownloads()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>':'<button onclick="exportCurrent()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';n.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",n.innerHTML=`文件已保存：<span class="font-bold break-all">${t.filename}</span>${s}<br>位置：${t.location}<div>${o}</div>`}else n.className="text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600",n.textContent=t.message}function _t(e){return e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/1024/1024).toFixed(2)+" MB"}async function Ze(e){try{const t=await fetch(e,{method:"HEAD"});if(!t.ok)return null;const n=Number(t.headers.get("Content-Length"));return Number.isFinite(n)&&n>0?n:null}catch{return null}}window.onExportResult=function(e){P(!1);const t=e&&e.size!=null?e.size:ge;ge=null;const n=document.getElementById("export-modal"),s=n&&!n.classList.contains("hidden");e&&e.ok?(s&&X(!0,{filename:e.filename,size:t,location:e.location||"下载目录 Download/"}),w(e.filename?"已保存："+e.filename:"导出成功",!0)):(s&&X(!1,{message:"导出失败："+(e&&e.message||"未知错误")}),w("导出失败："+(e&&e.message||"未知错误"),!1))};let T={token:null,preview:null,mode:"merge",skipErrors:!1,busy:!1};function N(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",!t)}function Qe(){T={token:null,preview:null,mode:"merge",skipErrors:!1,busy:!1};const e=document.getElementById("import-file-input");e&&(e.value=""),$("import-step-pick",!0),$("import-step-preview",!1),$("import-step-options",!1),$("import-fatal",!1),$("import-dup-tip",!1),$("import-issue-wrap",!1),$("import-diff-wrap",!1),$("import-result",!1),$("import-skip-wrap",!1),$("import-pick-btn",!0),document.getElementById("import-skip-errors").checked=!1,document.getElementById("import-result").textContent="",document.getElementById("import-subtitle").textContent="预检不写入数据，确认后才会导入",be(!1),se(!1),jt(document.querySelector('#import-step-options button[data-mode="merge"]'))}function se(e){T.busy=e;const t=document.getElementById("import-pick-btn");t&&(t.disabled=e,t.classList.toggle("opacity-50",e),t.textContent=e?"预检中…":"选择文件");const n=document.getElementById("memo-preview-btn");n&&(n.disabled=e,n.classList.toggle("opacity-50",e),n.textContent=e?"预检中…":"预检");const s=document.getElementById("import-confirm-btn");s&&e&&(s.disabled=!0,s.classList.add("opacity-50"))}function be(e,t){const n=document.getElementById("import-confirm-btn");n&&(n.disabled=!e,n.classList.toggle("opacity-50",!e),n.textContent=t||(T.preview&&T.preview.errors>0&&T.skipErrors?"跳过错误行并导入":"确认导入"))}function Mt(){closeDataSheet(),Qe(),document.getElementById("import-modal").classList.remove("hidden")}function et(){document.getElementById("import-modal").classList.add("hidden")}function Cn(e){e.target===e.currentTarget&&et()}function Dn(){T.busy||document.getElementById("import-file-input").click()}function Hn(e){const t=e.files&&e.files[0];if(t){if(t.size>5*1024*1024){w("文件超过 5 MB，请按年份拆分后导入",!1),e.value="";return}An(t)}}async function An(e){se(!0);try{const t=new FormData;t.append("file",e),t.append("file_name",e.name||"");const n=await fetch("/api/v1/import/preview",{method:"POST",body:t});let s=null;try{s=await n.json()}catch{s=null}if(!s||s.code!==200||!s.data){const o=s&&s.message||"HTTP "+n.status;je("预检失败："+o);return}tt(s.data)}catch(t){je("预检失败："+(t.message||"网络错误"))}finally{se(!1)}}function je(e){$("import-step-pick",!0),$("import-step-preview",!1),$("import-result",!0);const t=document.getElementById("import-result");t.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",t.textContent=e}function tt(e){T.preview=e,T.token=e.token||null,T.skipErrors=!1,$("import-step-pick",!1),$("import-step-preview",!0),$("import-step-options",!0),$("import-result",!1);const t=e.source_type==="json"?"JSON 备份":e.source_type==="memo"?"备忘录粘贴":"CSV 文件",n=e.file_size?_t(e.file_size):"",s=e.source_type==="memo"?"":' · <button type="button" onclick="impReselectFile()" class="text-blue-600 underline underline-offset-2">重新选择</button>';document.getElementById("import-file-meta").innerHTML=`<span class="font-bold text-slate-700">${N(e.file_name||t)}</span> · ${t}${n?" · "+n:""} · 编码 ${N(e.encoding||"—")}${s}`,document.getElementById("imp-stat-total").textContent=e.total_rows||0,document.getElementById("imp-stat-inserted").textContent=e.inserted||0,document.getElementById("imp-stat-updated").textContent=e.updated||0,document.getElementById("imp-stat-warnings").textContent=e.warnings||0,document.getElementById("imp-stat-errors").textContent=e.errors||0;const o=document.getElementById("import-dup-tip");e.duplicate?(o.classList.remove("hidden"),o.innerHTML=`这个文件在 ${N((e.duplicate.created_at||"").slice(0,10))} 已导入过一次（新增 ${e.duplicate.inserted} / 更新 ${e.duplicate.updated}），请确认不是重复操作。`):o.classList.add("hidden");const a=document.getElementById("import-fatal");e.fatal?(a.classList.remove("hidden"),a.textContent=e.fatal):a.classList.add("hidden"),Rn(e),Nn(e);const l=(e.errors||0)>0;$("import-skip-wrap",l&&!e.fatal),document.getElementById("import-skip-errors").checked=!1,be(!!e.token&&!e.fatal&&(!l||T.skipErrors))}function Rn(e){const t=document.getElementById("import-issue-wrap"),n=document.getElementById("import-issue-list"),s=(e.issues||[]).filter(o=>o.level==="error"||o.level==="warning");if(!s.length){t.classList.add("hidden");return}t.classList.remove("hidden"),document.getElementById("import-issue-count").textContent=`共 ${e.errors||0} 条错误 / ${e.warnings||0} 条警告`+(e.issues_truncated?"（仅显示前 500 条）":""),n.innerHTML=s.slice(0,50).map(o=>{const a=o.level==="error";return`<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${a?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}">${a?"错误":"警告"}</span>
          <span class="text-[11px] text-slate-600 leading-snug break-all">第 ${o.line} 行${o.date?" · "+N(o.date):""}：${N(o.message)}</span>
        </div>`}).join("")}function Nn(e){const t=document.getElementById("import-diff-wrap"),n=document.getElementById("import-diff-list"),s=e.row_diffs||[];if(!s.length){t.classList.add("hidden");return}t.classList.remove("hidden"),document.getElementById("import-diff-count").textContent=`前 ${s.length} 条`+(e.diffs_truncated?"（还有更多）":""),n.innerHTML=s.slice(0,30).map(o=>{const a=o.action==="insert",l=(o.changes||[]).slice(0,4).map(i=>{const r=i.old===""?"空":i.old,d=i.new===""?"空":i.new;return`${i.label} ${r}→${d}`}).join("，");return`<div class="rounded-lg bg-white border border-slate-100 px-2.5 py-1.5">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-slate-700">${N(o.date)}</span>
            <span class="${a?"text-emerald-600":"text-blue-600"}">${a?"新增":"更新"}</span>
          </div>
          ${l?`<p class="text-[10px] text-slate-400 mt-0.5 break-all">${N(l)}</p>`:""}
        </div>`}).join("")}function jt(e){e&&(T.mode=e.getAttribute("data-mode"),document.querySelectorAll("#import-step-options button[data-mode]").forEach(t=>{const n=t===e;t.className=n?"w-full text-left px-3.5 py-2.5 rounded-xl border-2 border-blue-500 bg-blue-50 transition-all":"w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white transition-all"}))}function On(e){T.skipErrors=!!(e&&e.checked);const t=T.preview,n=!!(t&&(t.errors||0)>0);be(!!(t&&t.token&&!t.fatal&&(!n||T.skipErrors)))}async function Pn(){if(T.busy)return;if(!T.token){w("预检已失效，请重新选择文件",!1);return}const e=T.preview||{};if((e.errors||0)>0&&!T.skipErrors){w("存在错误行：请勾选「跳过错误行」，或修正文件后重新导入",!1);return}const t=T.mode==="overwrite"?"替换（空值会清空旧数据）":"合并（空单元格保留旧值）";if(!await W(`将写入 ${e.inserted||0} 条新增记录、更新 ${e.updated||0} 条已有记录，冲突处理方式：${t}${T.skipErrors?"，并跳过 "+(e.errors||0)+" 条错误行":""}。写入过程为单个事务，失败会整体回滚。`,{title:"确认导入？",confirmText:"开始导入",danger:!1}))return;se(!0);const s=document.getElementById("import-result");try{const o=await fetch("/api/v1/import/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:T.token,conflict_mode:T.mode,skip_errors:T.skipErrors})});let a=null;try{a=await o.json()}catch{a=null}const l=a&&a.data?a.data:null,i=a&&a.code===200&&l;if(s.classList.remove("hidden"),!i){const r=a&&a.message||"HTTP "+o.status;s.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",s.textContent=(o.status===409?"预检已过期，请重新选择文件：":"导入失败：")+r,be(!1),w("导入失败",!1);return}s.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",s.innerHTML=`<span class="font-bold">导入完成</span><br>新增 ${l.inserted||0} 条 · 更新 ${l.updated||0} 条${l.skipped?" · 跳过 "+l.skipped+" 行":""}<br>可在「导入记录」中查看本次明细。`,$("import-step-options",!1),$("import-skip-wrap",!1),T.token=null,be(!1,"已完成"),w("导入完成",!0),Fn()}catch(o){s.classList.remove("hidden"),s.className="text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600",s.textContent="导入失败："+(o.message||"网络错误"),w("导入失败",!1)}finally{se(!1)}}function Fn(){currentTab==="log"?loadRecordForDate(document.getElementById("input-date").value):switchTab(currentTab)}function Ct(){closeDataSheet();const e=document.getElementById("memo-year-base");if(e){const t=new Date().getFullYear();e.innerHTML=[t,t-1,t-2].map(n=>`<option value="${n}">${n} 年</option>`).join("")}document.getElementById("memo-import-modal").classList.remove("hidden")}function we(){document.getElementById("memo-import-modal").classList.add("hidden")}function zn(e){e.target===e.currentTarget&&we()}async function Un(){const e=document.getElementById("memo-import-text").value||"";if(!e.trim()){w("请先粘贴备忘录内容",!1);return}const t=Number(document.getElementById("memo-year-base").value)||new Date().getFullYear();we(),Qe(),document.getElementById("import-modal").classList.remove("hidden"),$("import-step-pick",!1),document.getElementById("import-subtitle").textContent="正在预检粘贴内容…",se(!0);try{const n=await fetch("/api/v1/import/preview",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memo:e,year_base:t})});let s=null;try{s=await n.json()}catch{s=null}if(document.getElementById("import-subtitle").textContent="预检不写入数据，确认后才会导入",!s||s.code!==200||!s.data){const o=s&&s.message||"HTTP "+n.status;$("import-step-pick",!0),document.getElementById("import-pick-btn").textContent="选择文件",je("预检失败："+o)}else tt(s.data)}catch(n){document.getElementById("import-subtitle").textContent="预检不写入数据，确认后才会导入",$("import-step-pick",!0),document.getElementById("import-pick-btn").textContent="选择文件",je("预检失败："+(n.message||"网络错误"))}finally{se(!1)}}const Vn={success:{label:"成功",cls:"bg-emerald-50 text-emerald-600"},partial:{label:"部分成功",cls:"bg-amber-50 text-amber-700"},failed:{label:"失败",cls:"bg-rose-50 text-rose-600"},interrupted:{label:"中断",cls:"bg-rose-50 text-rose-600"},pending:{label:"进行中",cls:"bg-slate-100 text-slate-500"}};function Dt(){closeDataSheet(),document.getElementById("import-batches-modal").classList.remove("hidden"),Wn()}function ke(){document.getElementById("import-batches-modal").classList.add("hidden")}function qn(e){e.target===e.currentTarget&&ke()}async function Wn(){const e=document.getElementById("batches-list");e.innerHTML='<p class="text-xs text-slate-400 text-center py-8">加载中…</p>';try{const n=await(await fetch("/api/v1/import/batches?limit=20")).json(),s=n&&n.code===200&&Array.isArray(n.data)?n.data:[];Gn(s)}catch(t){e.innerHTML=`<p class="text-xs text-rose-500 text-center py-8">加载失败：${N(t.message||"网络错误")}</p>`}}function Gn(e){const t=document.getElementById("batches-list");if(!e.length){t.innerHTML='<p class="text-xs text-slate-400 text-center py-8">还没有导入记录</p>';return}t.innerHTML=e.map(n=>{const s=Vn[n.status]||{label:n.status,cls:"bg-slate-100 text-slate-500"},o=n.source_type==="json"?"JSON 备份":n.source_type==="memo"?"备忘录":"CSV",a=String(n.created_at||"").replace("T"," ").slice(0,16),l=[];return l.push(`<button type="button" onclick="impToggleBatchDetail(${n.id})" class="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200">详情</button>`),n.has_cache&&n.errors>0&&l.push(`<button type="button" onclick="downloadFailedRows(${n.id})" class="px-2.5 py-1 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 hover:bg-amber-200">失败行</button>`),n.retryable&&l.push(`<button type="button" onclick="impRetryBatch(${n.id})" class="px-2.5 py-1 rounded-lg bg-blue-600 text-[11px] font-bold text-white hover:bg-blue-700">重试</button>`),`<div class="rounded-2xl border border-slate-100 px-3.5 py-3">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-bold text-slate-800 truncate">${N(n.file_name||o)}</p>
            <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}">${s.label}</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">${o} · ${N(a)} · 共 ${n.total_rows||0} 行${n.attempt_no>1?" · 第 "+n.attempt_no+" 次尝试":""}</p>
          <p class="text-[11px] text-slate-500 mt-1">新增 ${n.inserted||0} · 更新 ${n.updated||0} · 跳过 ${n.skipped||0} · 警告 ${n.warnings||0} · 错误 ${n.errors||0}</p>
          ${n.error_message?`<p class="text-[10px] text-rose-500 mt-1 break-all">${N(n.error_message)}</p>`:""}
          <div class="flex flex-wrap gap-1.5 mt-2">${l.join("")}</div>
          <div id="batch-issues-${n.id}" class="hidden mt-2 space-y-1"></div>
        </div>`}).join("")}async function Ht(e){try{const n=await(await fetch(`/api/v1/import/batches/${e}/retry`,{method:"POST"})).json();if(!n||n.code!==200||!n.data){w(n&&n.message||"重试失败",!1);return}ke(),Qe(),document.getElementById("import-modal").classList.remove("hidden"),tt(n.data),w("已重新预检，请确认后写入",!0)}catch(t){w("重试失败："+(t.message||"网络错误"),!1)}}function Jn(e){ke(),At(`/api/v1/import/batches/${e}/failed-rows`,`HealthTrack_failed_rows_${e}.csv`,"失败行已下载，可修正后重新导入")}function Yn(){closeDataSheet(),At("/api/v1/import/template","HealthTrack_import_template.csv","模板已下载")}async function At(e,t,n){if(window.HealthTrack){window.location.href=e,w("已开始下载",!0);return}try{const s=await fetch(e);if(!s.ok)throw new Error("HTTP "+s.status);const o=await s.blob(),a=document.createElement("a"),l=URL.createObjectURL(o);a.href=l,a.download=t,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(l),2e3),w(n||"文件已下载",!0)}catch(s){w("下载失败："+(s.message||"网络错误"),!1)}}const Kn=Mt,Xn=Ct,Zn=Dt,Qn=et,es=ke;window.openExportModal=In;window.closeExport=Xe;window.closeExportModal=Xe;window.closeExportOnBackdrop=Tn;window.selectExportType=Lt;window.selectExportRange=$t;window.exportCurrent=Bn;window.openImportModal=Kn;window.openImportFromSheet=Mt;window.closeImport=et;window.closeImportModal=Qn;window.closeImportOnBackdrop=Cn;window.impPickFile=Dn;window.impFileSelected=Hn;window.impSelectMode=jt;window.impToggleSkipErrors=On;window.impConfirm=Pn;window.openMemoImportModal=Xn;window.openMemoFromSheet=Ct;window.closeMemo=we;window.closeMemoModal=we;window.closeMemoImportModal=we;window.closeMemoOnBackdrop=zn;window.impPreviewMemo=Un;window.openImportBatchesModal=Zn;window.openImportBatchesFromSheet=Dt;window.closeBatches=ke;window.closeImportBatchesModal=es;window.closeBatchesOnBackdrop=qn;window.impRetryBatch=Ht;window.retryBatch=Ht;window.downloadFailedRows=Jn;window.downloadImportTemplate=Yn;window.evoClosePhoto=function(){var e;(e=document.getElementById("ev-photo-viewer"))==null||e.classList.add("hidden")};const ts=`<!-- 1. 记一笔 (Log View) 模块模板 -->
<section id="view-log" class="fade-in space-y-3">
  <!-- 日期切换行：单线药丸样式，日期数字 font-mono -->
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <input type="date" id="input-date" class="bg-white border border-neutral-200 text-neutral-800 text-xs font-mono font-medium rounded-lg px-3 py-1.5 w-[128px] outline-none focus:border-neutral-700 transition-colors">
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

  <!-- 步数：极客风卡，1.5px 步行 SVG，巨大等宽数字，极细滑轨 -->
  <div class="ht-card space-y-2.5">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><path d="M9 12l2 2 4-4"/><path d="M14 8l-2 4-3 2-2 4"/><path d="M10 8l3 1 2-2"/></svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-neutral-800">步数</p>
          <p id="steps-meta" class="text-[10px] text-neutral-400 truncate font-mono">昨 -- · 7d均 --</p>
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
    <div class="pt-2 border-t border-neutral-100 flex items-center justify-between">
      <span id="steps-hint" class="text-[10px] text-neutral-400 truncate font-mono">留空 = 断点（不补 0）</span>
      <button type="button" id="btn-clear-steps" class="text-[10px] font-medium text-neutral-400 hover:text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 hover:border-neutral-400 ml-2 shrink-0 transition-colors">留空</button>
    </div>
  </div>

  <!-- 晚间卡：睡前体重 -->
  <div class="ht-card">
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
        <span class="text-[10px] font-medium text-neutral-500 uppercase tracking-widest font-mono">Evening</span>
      </div>
      <span class="text-[10px] text-neutral-400 font-mono">睡前体重</span>
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

  <!-- Morning Metrics 大卡：晨起空腹体重 + 晨起腰围 2 列 -->
  <div class="ht-card">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>
        </div>
        <span class="text-[10px] font-medium text-neutral-500 uppercase tracking-widest font-mono">Morning Metrics</span>
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

  <!-- 昨晚睡眠卡：通栏单线，时长等宽大数字 -->
  <div class="ht-card">
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
        <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">昨晚睡眠</span>
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

  <!-- 身体感受自由记录 -->
  <div class="space-y-1.5">
    <div class="flex justify-between items-center text-xs">
      <span class="font-medium text-neutral-700">身体感受与自由记录</span>
      <span class="text-[10px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">饮食已结构化</span>
    </div>
    <textarea id="input-journal" rows="3" class="w-full ht-card text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-neutral-700 transition-all resize-none leading-relaxed" placeholder="如：今天状态还行，下午 3 点有点困，喝了杯水走动一下缓过来了…"></textarea>
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
            <input type="number" id="exerciseDuration" placeholder="时长(分)" class="w-24 border border-neutral-200 bg-neutral-50 rounded-lg px-2.5 py-1.5 outline-none font-bold font-mono" value="40">
            <input type="text" id="exerciseItems" placeholder="备注，如 骑行3km / 腿部深蹲" class="flex-1 border border-neutral-200 bg-neutral-50 rounded-lg px-2.5 py-1.5 outline-none font-mono">
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
              <span class="text-neutral-500">时间:</span>
              <input type="time" id="concertaTime" value="08:00" class="border border-neutral-200 rounded-lg px-2 py-1 outline-none">
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="text-neutral-500">剂量:</span>
              <select id="concertaDose" class="border border-neutral-200 rounded-lg px-2 py-1 outline-none bg-white">
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
        <div id="coldShowerSubForm" class="space-y-2 pt-1 hidden font-mono">
          <div class="flex items-center justify-between text-xs text-neutral-500">
            <span>时段:</span>
            <div class="flex space-x-1.5" id="csTimingPills">
              <button type="button" class="pill-sm-btn active" data-val="morning">晨起即刻</button>
              <button type="button" class="pill-sm-btn" data-val="post_workout">训练后</button>
              <button type="button" class="pill-sm-btn" data-val="evening">睡前</button>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs text-neutral-500">
            <span>时长:</span>
            <div class="flex items-center space-x-1">
              <input type="number" id="coldShowerDuration" value="2" class="w-14 border border-neutral-200 rounded-lg px-2 py-1 text-center font-bold">
              <span>分钟</span>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs text-neutral-500">
            <span>水温(估):</span>
            <div class="flex items-center space-x-1">
              <input type="number" id="coldShowerWaterTemp" step="0.5" min="0" max="40" placeholder="--" class="w-14 border border-neutral-200 rounded-lg px-2 py-1 text-center font-bold">
              <span>℃</span>
            </div>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] text-neutral-400 block">即刻体感:</span>
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
`;let B={date:R(new Date),morningLight:null,steps:null,prevSteps:null,isDirty:!1,hasRecord:!1},Z={types:[]};function ns(e){e.insertAdjacentHTML("beforeend",ts),ss(),$e(B.date)}function ss(){var n,s,o,a,l,i,r,d,p,g,h;const e=document.getElementById("input-date");e&&(e.value=B.date,e.addEventListener("change",b=>{$e(b.target.value)})),(n=document.getElementById("btn-today-date"))==null||n.addEventListener("click",()=>{const b=R(new Date);e&&(e.value=b),$e(b)}),(s=document.getElementById("morningLightPills"))==null||s.addEventListener("click",b=>{const c=b.target.closest("button[data-val]");if(!c)return;const y=c.getAttribute("data-val");B.morningLight=B.morningLight===y?null:y,Rt(),U()});const t=document.getElementById("input-steps");t==null||t.addEventListener("input",b=>{const c=Number(b.target.value);B.steps=isNaN(c)?null:Math.max(0,Math.min(2e4,Math.round(c/500)*500)),qe(),U()}),(o=document.getElementById("btn-clear-steps"))==null||o.addEventListener("click",()=>{B.steps=null,qe(),U()}),["input-weight-pm","input-weight-am","input-waist","sleepDuration"].forEach(b=>{var c;(c=document.getElementById(b))==null||c.addEventListener("input",()=>{Ot(),U()})}),["sleepBedTime","sleepWakeTime"].forEach(b=>{var c;(c=document.getElementById(b))==null||c.addEventListener("input",()=>{Nt(),U()})}),(a=document.getElementById("lunch-toggle"))==null||a.addEventListener("click",()=>{const b=document.getElementById("lunch-body"),c=document.getElementById("lunch-icon");b==null||b.classList.toggle("hidden"),c==null||c.classList.toggle("rotate-180")}),(l=document.getElementById("biohack-toggle"))==null||l.addEventListener("click",()=>{const b=document.getElementById("biohackBody"),c=document.getElementById("accordionIcon");b==null||b.classList.toggle("hidden"),c==null||c.classList.toggle("rotate-180")}),(i=document.getElementById("exerciseTypePills"))==null||i.addEventListener("click",b=>{const c=b.target.closest("button[data-val]");if(!c)return;const y=c.getAttribute("data-val");os(y),U()}),(r=document.getElementById("concertaEnabled"))==null||r.addEventListener("change",b=>{var c;(c=document.getElementById("concertaSubForm"))==null||c.classList.toggle("hidden",!b.target.checked),U()}),(d=document.getElementById("coldShowerEnabled"))==null||d.addEventListener("change",b=>{var c;(c=document.getElementById("coldShowerSubForm"))==null||c.classList.toggle("hidden",!b.target.checked),U()}),(p=document.getElementById("btn-save-log"))==null||p.addEventListener("click",as),(g=document.getElementById("btn-reset-log"))==null||g.addEventListener("click",()=>$e(B.date)),(h=document.getElementById("input-journal"))==null||h.addEventListener("input",U)}async function $e(e){B.date=e,ce.set({currentDate:e}),nt(!1);try{const t=await ne.getRecordByDate(e),n=t.record||{};B.hasRecord=!!t.record;const s=document.getElementById("input-weight-am"),o=document.getElementById("input-weight-pm"),a=document.getElementById("input-waist"),l=document.getElementById("input-journal");s&&(s.value=n.weight_am!==null&&n.weight_am!==void 0?n.weight_am:""),o&&(o.value=n.weight_pm!==null&&n.weight_pm!==void 0?n.weight_pm:""),a&&(a.value=n.waist_size!==null&&n.waist_size!==void 0?n.waist_size:""),l&&(l.value=n.journal||""),B.morningLight=n.morning_light===!0?"yes":n.morning_light===!1?"no":null,Rt(),B.steps=n.steps!==null&&n.steps!==void 0?Number(n.steps):null,qe();const i=document.getElementById("sleepBedTime"),r=document.getElementById("sleepWakeTime"),d=document.getElementById("sleepDuration");i&&(i.value=n.sleep_start_time||n.sleep_bed_time||"00:30"),r&&(r.value=n.sleep_end_time||n.sleep_wake_time||"07:15"),d&&(d.value=n.sleep_hours!==null&&n.sleep_hours!==void 0?n.sleep_hours:"6.8"),Nt(),Ot(),Pt()}catch(t){console.error("加载记录失败:",t)}}function Rt(){document.querySelectorAll("#morningLightPills button").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===B.morningLight)})}function qe(){const e=document.getElementById("steps-value"),t=document.getElementById("input-steps"),n=document.getElementById("steps-hint");e&&(e.innerText=B.steps===null?"--":B.steps.toLocaleString("en-US")),t&&(t.value=B.steps===null?0:B.steps),n&&(n.innerText=B.steps===null?"留空 = 断点（不补 0）":`已设定 ${B.steps.toLocaleString("en-US")} 步`)}function Nt(){var o,a;const e=(o=document.getElementById("sleepBedTime"))==null?void 0:o.value,t=(a=document.getElementById("sleepWakeTime"))==null?void 0:a.value;if(!e||!t)return;const{duration:n}=cn(e,t),s=document.getElementById("sleepDuration");s&&document.activeElement!==s&&(s.value=n)}function Ot(){var s,o;const e=parseFloat((s=document.getElementById("input-weight-am"))==null?void 0:s.value),t=parseFloat((o=document.getElementById("input-weight-pm"))==null?void 0:o.value),n=document.getElementById("diff-weight-pm");if(n)if(!isNaN(t)&&!isNaN(e)){const a=(t-e).toFixed(1);n.innerHTML=`<span>较晨重 ${a>=0?"+":""}${a}kg</span><span class="text-neutral-400">已测</span>`}else n.innerHTML='<span>等待今晚称重</span><span class="text-neutral-300">--:--</span>'}function os(e){var t;if(e==="none")Z.types=[];else{const n=Z.types.indexOf(e);n>=0?Z.types.splice(n,1):Z.types.push(e)}document.querySelectorAll("#exerciseTypePills button").forEach(n=>{const s=n.getAttribute("data-val");s==="none"?n.classList.toggle("active",Z.types.length===0):n.classList.toggle("active",Z.types.includes(s))}),(t=document.getElementById("exerciseSubForm"))==null||t.classList.toggle("hidden",Z.types.length===0)}function Pt(){var n,s,o,a;let e=0;(n=document.getElementById("input-weight-am"))!=null&&n.value&&e++,(s=document.getElementById("input-weight-pm"))!=null&&s.value&&e++,(o=document.getElementById("input-waist"))!=null&&o.value&&e++,B.morningLight!==null&&e++,B.steps!==null&&e++,(a=document.getElementById("input-journal"))!=null&&a.value&&e++;const t=document.getElementById("log-count");t&&(t.innerText=`${e}/6`)}function U(){nt(!0),Pt()}function nt(e){B.isDirty=e,ce.set({isDirty:e});const t=document.getElementById("save-dot"),n=document.getElementById("save-text");t&&n&&(e?(t.className="w-2 h-2 rounded-full bg-neutral-900",n.innerText="有未保存改动"):(t.className="w-2 h-2 rounded-full bg-neutral-300",n.innerText="已同步落库"))}async function as(){var a,l,i,r,d,p,g;const e=parseFloat((a=document.getElementById("input-weight-am"))==null?void 0:a.value),t=parseFloat((l=document.getElementById("input-weight-pm"))==null?void 0:l.value),n=parseFloat((i=document.getElementById("input-waist"))==null?void 0:i.value),s=parseFloat((r=document.getElementById("sleepDuration"))==null?void 0:r.value),o={record_date:B.date,weight_am:isNaN(e)?null:e,weight_pm:isNaN(t)?null:t,waist_size:isNaN(n)?null:n,sleep_hours:isNaN(s)?null:s,sleep_start_time:((d=document.getElementById("sleepBedTime"))==null?void 0:d.value)||null,sleep_end_time:((p=document.getElementById("sleepWakeTime"))==null?void 0:p.value)||null,morning_light:B.morningLight==="yes"?!0:B.morningLight==="no"?!1:null,steps:B.steps,journal:((g=document.getElementById("input-journal"))==null?void 0:g.value)||""};try{await ne.saveRecord(o),nt(!1),w("记录已保存")}catch(h){w("保存失败: "+h.message,!1)}}const ls=`      <section id="view-dash" class="fade-in space-y-4 hidden">
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
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>晨起空腹</span>
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>睡前</span>
            </div>
          </div>
          <div class="h-44 w-full">
            <canvas id="chart-weight"></canvas>
          </div>
          <p id="dash-weight-detail" class="text-[11px] text-slate-500 flex items-start space-x-1 pt-1 border-t border-slate-100">
            <span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日晨重 / 睡前重</span>
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
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>腰围</span>
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
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>正常</span>
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>轻度</span>
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>熬夜</span>
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
              <span class="flex items-center gap-1 font-mono text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>每日步数</span>
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

      <!-- 3. AI 洞察页 (Insight View) -->`;function is(e){e.insertAdjacentHTML("beforeend",ls),rs()}function rs(){var e,t,n;(e=document.getElementById("btn-range-7"))==null||e.addEventListener("click",()=>Se(7)),(t=document.getElementById("btn-range-30"))==null||t.addEventListener("click",()=>Se(30)),(n=document.getElementById("btn-range-60"))==null||n.addEventListener("click",()=>Se(60))}function ds(){Ft(dashRange)}function Se(e){dashRange=e,["7","30","60"].forEach(t=>{const n=document.getElementById("btn-range-"+t);n&&(n.className=Number(t)===e?"px-3 py-1 rounded-md bg-white border border-neutral-200 text-neutral-900 font-mono font-medium shadow-sm transition-all":"px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-900 font-mono font-medium transition-all")}),Ft(e)}async function Ft(e){const t=new Date,n=new Date;n.setDate(t.getDate()-(e-1));const s=n.toISOString().split("T")[0],o=t.toISOString().split("T")[0],l=await(await fetch(`/api/v1/records/history?start_date=${s}&end_date=${o}`)).json();if(l.code!==200)return;const i=l.data||[];cs(i)}function cs(e){const t=e.map(m=>m.record_date.slice(5)),n=e.map(m=>m.weight_am),s=e.map(m=>m.weight_pm),o=e.map(m=>m.waist_size),a=e.map(m=>m.sleep_hours),l=e.map(m=>m.sleep_tag==="RED"?"#d4d4d4":m.sleep_tag==="YELLOW"?"#737373":"#171717"),i=n.filter(m=>m!=null);if(i.length>0){const m=i[i.length-1];document.getElementById("dash-weight-stat").innerText=`${m} kg`}else document.getElementById("dash-weight-stat").innerText="--";const r=a.filter(m=>m!=null);if(r.length>0){const m=(r.reduce((E,v)=>E+v,0)/r.length).toFixed(1);document.getElementById("dash-sleep-stat").innerText=`${m} 小时 (均值)`}else document.getElementById("dash-sleep-stat").innerText="--";const d=document.getElementById("dash-weight-detail");d.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日晨重 / 睡前重</span>';const p=document.getElementById("chart-weight").getContext("2d");weightChart&&weightChart.destroy();const g=p.createLinearGradient(0,0,0,160);g.addColorStop(0,"rgba(0, 0, 0, 0.04)"),g.addColorStop(1,"rgba(0, 0, 0, 0.00)");const h=p.createLinearGradient(0,0,0,160);h.addColorStop(0,"rgba(0, 0, 0, 0.02)"),h.addColorStop(1,"rgba(0, 0, 0, 0.00)"),weightChart=new Chart(p,{type:"line",data:{labels:t,datasets:[{label:"晨起体重",data:n,borderColor:"#171717",borderWidth:2.2,backgroundColor:g,fill:!0,tension:.35,spanGaps:!0,pointBackgroundColor:"#ffffff",pointBorderColor:"#171717",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16},{label:"睡前体重",data:s,borderColor:"#f59e0b",borderWidth:2,backgroundColor:h,fill:!0,tension:.35,spanGaps:!0,pointBackgroundColor:"#ffffff",pointBorderColor:"#f59e0b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(m,E)=>{if(!E||!E.length)return;const v=e[E[0].index];if(!v)return;const H=G=>G==null?"--":`${G} kg`,O=v.weight_am,Le=v.weight_pm;let ut="";if(O!=null&&Le!==null&&Le!==void 0){const G=Math.round((Le-O)*10)/10;let xe;G<.3?xe="偏低，可能高钠储水":G<.4?xe="偏低":G<=.9?xe="正常":xe="偏高",ut=` · 夜间排水 <b class="text-slate-700">${G.toFixed(1)} kg</b>（${xe}）`}d.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${v.record_date}</b>　晨起 ${H(O)} · 睡前 ${H(Le)}${ut}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const b=o.filter(m=>m!=null);b.length>0?document.getElementById("dash-waist-stat").innerText=`${b[b.length-1]} cm`:document.getElementById("dash-waist-stat").innerText="--";const c=document.getElementById("dash-waist-detail");c.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>';const y=document.getElementById("chart-waist").getContext("2d");waistChart&&waistChart.destroy();const k=y.createLinearGradient(0,0,0,160);k.addColorStop(0,"rgba(0, 0, 0, 0.03)"),k.addColorStop(1,"rgba(0, 0, 0, 0.00)"),waistChart=new Chart(y,{type:"line",data:{labels:t,datasets:[{label:"腰围",data:o,borderColor:"#525252",borderWidth:2.2,backgroundColor:k,fill:!0,tension:.35,spanGaps:!0,pointBackgroundColor:"#ffffff",pointBorderColor:"#525252",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(m,E)=>{if(!E||!E.length)return;const v=e[E[0].index];if(!v)return;const H=v.waist_size===null||v.waist_size===void 0?"--":`${v.waist_size} cm`;c.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${v.record_date}</b>　腰围 ${H}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const I=document.getElementById("dash-sleep-detail");I.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>';const S=document.getElementById("chart-sleep").getContext("2d");sleepChart&&sleepChart.destroy(),sleepChart=new Chart(S,{type:"bar",data:{labels:t,datasets:[{data:a,backgroundColor:l,borderRadius:8,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},onHover:(m,E)=>{m.native.target.style.cursor=E.length?"pointer":"default"},onClick:(m,E)=>{if(!E||!E.length)return;const v=e[E[0].index];if(!v)return;const H=v.sleep_tag==="RED"?"熬夜":v.sleep_tag==="YELLOW"?"轻度":"正常",O=v.sleep_hours===null||v.sleep_hours===void 0?"--":`${v.sleep_hours} 小时`;I.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${v.record_date}</b>　就寝 ${v.sleep_start_time||"--"} · 起床 ${v.sleep_end_time||"--"} · ${O} · ${H}</span>`},scales:{y:{beginAtZero:!0,max:12,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const _=e.map(m=>m.steps===null||m.steps===void 0?null:Number(m.steps)),C=_.filter(m=>m!==null);if(C.length>0){const m=Math.round(C.reduce((E,v)=>E+v,0)/C.length);document.getElementById("dash-steps-stat").innerText=`${m.toLocaleString("en-US")} 步 (均值)`}else document.getElementById("dash-steps-stat").innerText="--";const ct=document.getElementById("dash-steps-detail");ct.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>';const pt=document.getElementById("chart-steps").getContext("2d");stepsChart&&stepsChart.destroy();const Pe=pt.createLinearGradient(0,0,0,160);Pe.addColorStop(0,"rgba(14, 165, 233, 0.18)"),Pe.addColorStop(1,"rgba(14, 165, 233, 0.00)"),stepsChart=new Chart(pt,{type:"line",data:{labels:t,datasets:[{label:"步数",data:_,borderColor:"#737373",borderWidth:2.2,backgroundColor:Pe,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#737373",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onHover:(m,E)=>{m.native.target.style.cursor=E.length?"pointer":"default"},onClick:(m,E)=>{if(!E||!E.length)return;const v=e[E[0].index];if(!v)return;const H=v.steps===null||v.steps===void 0?"--":`${Number(v.steps).toLocaleString("en-US")} 步`,O=v.morning_light===!0?" · 已见晨光":"";ct.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${v.record_date}</b>　步数 ${H}${O}</span>`},scales:{y:{beginAtZero:!0,max:2e4,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#94a3b8",stepSize:5e3,callback:m=>m===0?"0":`${m/1e4}万`}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const Fe=document.getElementById("dash-activities-list");Fe.innerHTML="",e.length===0?Fe.innerHTML='<p class="text-slate-400 text-center py-2">暂无记录</p>':e.slice().reverse().forEach(m=>{const E=exerciseTypesOf(m.exercise);if(m.journal_text||m.activity_tags||E.length>0||m.concerta&&m.concerta.taken||m.cold_shower&&m.cold_shower.enabled){let v="";if(m.activity_tags)try{const H=JSON.parse(m.activity_tags);v+=H.map(O=>`<span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">${O}</span>`).join("")}catch{}if(E.length>0&&(v+=`<span class="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">${E.join(" + ")}</span>`),m.concerta&&m.concerta.taken&&(v+=`<span class="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">专注达 ${m.concerta.dose}mg</span>`),m.cold_shower&&m.cold_shower.enabled){const H=m.cold_shower.water_temp===null||m.cold_shower.water_temp===void 0?"":` ${m.cold_shower.water_temp}℃`;v+=`<span class="bg-cyan-50 text-cyan-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">冷水澡 ${H}</span>`}Fe.innerHTML+=`
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-800">${m.record_date}</span>
                  <div>${v}</div>
                </div>
                <p class="text-slate-600 line-clamp-2">${m.journal_text||"无文字备注"}</p>
              </div>
            `}})}const ps=12,us={weight:{label:"体重周均值 (kg)",field:"weight_am",unit:"kg",color:"#171717",band:"rgba(0, 0, 0, 0.06)"},waist:{label:"腰围周均值 (cm)",field:"waist_size",unit:"cm",color:"#525252",band:"rgba(0, 0, 0, 0.04)"},sleep:{label:"睡眠周均值 (小时)",field:"sleep_hours",unit:"小时",color:"#10b981",band:"rgba(16, 185, 129, 0.13)"},steps:{label:"步数周均值 (步)",field:"steps",unit:"步",color:"#737373",band:"rgba(0, 0, 0, 0.04)",int:!0}};let ie={metric:"weight",records:[],buckets:[],aggs:[]},Ue=null;function ms(e){const t=new Date(e.getFullYear(),e.getMonth(),e.getDate());return t.setDate(t.getDate()-(t.getDay()+6)%7),t}function xs(){const e=ms(new Date),t=[];for(let n=ps-1;n>=0;n--){const s=new Date(e);s.setDate(e.getDate()-n*7);const o=new Date(s);o.setDate(s.getDate()+6),t.push({start:R(s),end:R(o)})}return t}function fs(e,t,n){return t.map(s=>{const o=[];return e.forEach(l=>{if(l.record_date>=s.start&&l.record_date<=s.end){const i=l[n];i!=null&&i!==""&&!isNaN(Number(i))&&o.push(Number(i))}}),o.length===0?{avg:null,min:null,max:null,n:0}:{avg:o.reduce((l,i)=>l+i,0)/o.length,min:Math.min(...o),max:Math.max(...o),n:o.length}})}function gs(){zt(ie.metric),switchTab("trend")}function zt(e){ie.metric=e,["weight","waist","sleep","steps"].forEach(t=>{const n=document.getElementById(`trend-tab-${t}`);n&&(n.className=t===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),currentTab==="trend"&&bs()}function bs(){const e=us[ie.metric],t=c=>e.int?Math.round(c).toLocaleString("en-US"):c.toFixed(1),n=xs(),s=fs(ie.records,n,e.field);ie.buckets=n,ie.aggs=s;const o=n.map(c=>c.start.slice(5)),a=s.map(c=>c.max),l=s.map(c=>c.min),i=s.map(c=>c.avg),r=s.map(c=>c.n>=1&&c.n<=3);document.getElementById("trend-metric-label").innerText=e.label;const d=document.getElementById("trend-metric-stat"),p=document.getElementById("trend-metric-note");let g=-1;for(let c=s.length-1;c>=0;c--)if(s[c].n>0){g=c;break}if(g>=0){const c=s[g],y=n[g];d.innerText=`${t(c.avg)} ${e.unit}`,p.innerHTML=`${y.start.slice(5)}~${y.end.slice(5)} 周均值<br>${c.n} 天数据${c.n<=3?"（低置信）":""}`}else d.innerText="--",p.innerHTML="近 12 周暂无数据";const h=document.getElementById("trend-detail");h.innerHTML=g>=0?'<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>':"<span>ℹ️</span><span>近 12 周暂无该指标数据，记录几天后再来看看</span>";const b=document.getElementById("chart-trend").getContext("2d");Ue&&Ue.destroy(),Ue=new Chart(b,{type:"line",data:{labels:o,datasets:[{label:"周内最大",data:a,borderColor:"transparent",backgroundColor:e.band,pointRadius:0,pointHoverRadius:0,fill:{target:1},spanGaps:!1,tension:.25},{label:"周内最小",data:l,borderColor:"transparent",backgroundColor:"transparent",pointRadius:0,pointHoverRadius:0,spanGaps:!1,tension:.25},{label:"周均值",data:i,borderColor:e.color,backgroundColor:e.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:c=>r[c.dataIndex]?4:3,pointBackgroundColor:c=>r[c.dataIndex]?"#ffffff":e.color,pointBorderColor:e.color,pointBorderWidth:c=>r[c.dataIndex]?2:0,segment:{borderDash:c=>r[c.p1DataIndex]||r[c.p0DataIndex]?[5,4]:void 0}}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{filter:c=>c.datasetIndex===2,displayColors:!1,callbacks:{title:c=>{const y=n[c[0].dataIndex];return`${y.start} ~ ${y.end}`},label:c=>{const y=s[c.dataIndex];return!y||y.n===0?"该周无数据":[`周均值：${t(y.avg)} ${e.unit}`,`区间：${t(y.min)} ~ ${t(y.max)}`,`样本：${y.n} 天${y.n<=3?"（低置信）":""}`]}}}},scales:{y:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:6}}},onClick:(c,y)=>{let k=-1;if((y||[]).forEach(_=>{_.datasetIndex===2&&(k=_.index)}),k<0)return;const I=s[k],S=n[k];!I||I.n===0||(h.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-slate-700">${S.start} ~ ${S.end}</b>　均值 ${I.avg.toFixed(1)} ${e.unit} · 区间 ${I.min.toFixed(1)}~${I.max.toFixed(1)} · ${I.n} 天${I.n<=3?"（低置信）":""}</span>`)}}})}const Ce=60,hs=26,vs=Ce*hs,ys=560,ws={weight:{label:"体重逐日 (kg)",field:"weight_am",unit:"kg",color:"#171717"},waist:{label:"腰围逐日 (cm)",field:"waist_size",unit:"cm",color:"#525252"},sleep:{label:"睡眠时长逐日 (小时)",field:"sleep_hours",unit:"小时",color:"#10b981",avg:!0},steps:{label:"步数逐日 (步)",field:"steps",unit:"步",color:"#737373",avg:!0,yMax:2e4,yStep:5e3,fmt:e=>e.toLocaleString("en-US")}};let re={metric:"weight",records:[]},fe=null;function ks(){const e=[],t=new Date;for(let n=Ce-1;n>=0;n--){const s=new Date(t.getFullYear(),t.getMonth(),t.getDate());s.setDate(s.getDate()-n),e.push(R(s))}return e}function Es(){return window.matchMedia("(orientation: landscape) and (max-height: 600px)").matches}function Is(){const e=document.getElementById("app-frame");e&&e.classList.toggle("frame-wide",currentTab==="trend-detail"&&Es())}function Bs(){const e=document.getElementById("td-chart-box"),t=document.getElementById("td-chart-scroll");if(!e||!t)return;const n=t.clientWidth>=ys;e.style.width=n?"100%":`${vs}px`,e.style.height=n?"150px":"220px",fe&&fe.resize()}function Ut(){Is(),Bs()}function Ts(){const e=()=>{currentTab==="trend-detail"&&Ut()};window.addEventListener("resize",e);const t=window.matchMedia("(orientation: landscape) and (max-height: 600px)");t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}function Ls(){Vt(re.metric),switchTab("trend-detail")}function Vt(e){re.metric=e,["weight","waist","sleep","steps"].forEach(t=>{const n=document.getElementById(`td-tab-${t}`);n&&(n.className=t===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),currentTab==="trend-detail"&&Ss()}function $s(e,t){if(e==="weight"){const o=r=>r==null?"--":`${r} kg`,a=t.weight_am,l=t.weight_pm;let i="";return a!=null&&l!==null&&l!==void 0&&(i=` · 夜间排水 <b class="text-slate-700">${(Math.round((l-a)*10)/10).toFixed(1)} kg</b>`),`<b class="text-slate-700">${t.record_date}</b>　晨起 ${o(a)} · 睡前 ${o(l)}${i}`}if(e==="waist"){const o=t.waist_size===null||t.waist_size===void 0?"--":`${t.waist_size} cm`;return`<b class="text-slate-700">${t.record_date}</b>　腰围 ${o}`}if(e==="steps"){const o=t.steps===null||t.steps===void 0?"--":`${Number(t.steps).toLocaleString("en-US")} 步`;return`<b class="text-slate-700">${t.record_date}</b>　步数 ${o}${t.morning_light===!0?" · 已见晨光":""}`}const n=t.sleep_tag==="RED"?"熬夜":t.sleep_tag==="YELLOW"?"轻度":"正常",s=t.sleep_hours===null||t.sleep_hours===void 0?"--":`${t.sleep_hours} 小时`;return`<b class="text-slate-700">${t.record_date}</b>　就寝 ${t.sleep_start_time||"--"} · 起床 ${t.sleep_end_time||"--"} · ${s} · ${n}`}function Ss(){const e=ws[re.metric],t=ks(),n={};re.records.forEach(p=>{n[p.record_date]=p});const s=t.map(p=>{const g=n[p];if(!g)return null;const h=g[e.field];return h==null||h===""||isNaN(Number(h))?null:Number(h)}),o=t.map(p=>p.slice(5)),a=document.getElementById("td-detail");a.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>',document.getElementById("td-metric-label").innerText=e.label;const l=document.getElementById("td-metric-stat"),i=document.getElementById("td-metric-note"),r=s.filter(p=>p!==null);if(r.length>0){if(e.avg){const p=r.reduce((g,h)=>g+h,0)/r.length;l.innerText=re.metric==="sleep"?`${p.toFixed(1)} 小时 (均值)`:`${Math.round(p).toLocaleString("en-US")} 步 (均值)`}else l.innerText=`${r[r.length-1]} ${e.unit}`;i.innerHTML=`近 ${Ce} 天逐日<br>有效 ${r.length} 天`}else l.innerText="--",i.innerHTML=`近 ${Ce} 天暂无数据`;const d=document.getElementById("chart-trend-detail").getContext("2d");fe&&fe.destroy(),fe=new Chart(d,{type:"line",data:{labels:o,datasets:[{label:e.label,data:s,borderColor:e.color,backgroundColor:e.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:3,pointBackgroundColor:e.color}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{displayColors:!1,callbacks:{title:p=>t[p[0].dataIndex],label:p=>{const g=s[p.dataIndex];return g===null?"当日无数据":`数值：${e.fmt?e.fmt(g):g} ${e.unit}`}}}},scales:{y:e.yMax?{beginAtZero:!0,max:e.yMax,ticks:{font:{size:10},stepSize:e.yStep,callback:p=>p===0?"0":`${p/1e4}万`}}:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:20}}},onClick:(p,g)=>{if(!g||!g.length)return;const h=g[0].index,b=t[h],c=n[b];!c||s[h]===null||(a.innerHTML=`<span class="font-mono text-neutral-400">·</span><span>${$s(re.metric,c)}</span>`)}}}),Ut()}Ts();window.switchDashRange=Se;window.openTrendView=gs;window.openTrendDetailView=Ls;window.setTrendMetric=zt;window.setTrendDetailMetric=Vt;const _s=`      <section id="view-insight" class="fade-in space-y-4 hidden">
        <div class="flex justify-between items-center gap-2">
          <div class="flex items-center space-x-1.5 min-w-0 shrink">
            <span class="text-lg shrink-0">✨</span>
            <h2 class="text-base font-bold text-slate-900 truncate">AI 智能健康复盘</h2>
          </div>
          <div class="flex items-center space-x-1.5 shrink-0">
            <button onclick="openCompareView()" class="flex items-center space-x-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors">
              <span class="font-mono text-xs font-medium">阶段对比</span>
            </button>
            <button onclick="openInsightHistory()" class="flex items-center space-x-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors">
              <span class="font-mono text-xs font-medium">历史</span>
            </button>
          </div>
        </div>

        <!-- 分析周期选择胶囊 -->
        <div class="flex space-x-2">
          <button onclick="setInsightDays(7)" id="pill-7" class="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">近 7 天</button>
          <button onclick="setInsightDays(30)" id="pill-30" class="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all">近 30 天</button>
          <button onclick="setInsightDays(60)" id="pill-60" class="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">近 60 天</button>
        </div>

        <!-- 分析窗口截止日：默认跟随今天；选昨天或手选日期即可回溯补生成 -->
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold text-slate-500 shrink-0">截止日</span>
          <button onclick="setInsightEndMode('today')" id="endpill-today" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all">今天</button>
          <button onclick="setInsightEndMode('yesterday')" id="endpill-yesterday" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">昨天</button>
          <input type="date" id="insight-end-date" onchange="setInsightEndDate(this.value)"
                 class="flex-1 min-w-0 px-2 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>

        <button onclick="generateInsightStream()" id="btn-generate-insight" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center space-x-2">
          <span class="font-mono">生成阶段深度洞察</span>
        </button>

        <!-- 洞察渲染卡片 (SSE 流式输出，Apple Health 浅蓝微渐变柔和卡片) -->
        <div class="apple-card p-5 space-y-3 min-h-[300px]">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="text-xs font-bold text-blue-600 flex items-center space-x-1.5">
              <span class="font-mono text-xs">AI</span>
              <span>关联分析与归因结论</span>
            </span>
            <span id="insight-status-tag" class="text-[10px] text-slate-400">点击上方按钮开始</span>
          </div>

          <div id="insight-content" class="text-sm text-slate-700 leading-relaxed markdown-body">
            <p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>
          </div>
        </div>
      </section>

      <!-- 4. AI 洞察历史页 (Insight History View) -->
      <section id="view-history" class="fade-in space-y-4 hidden">
        <div class="flex justify-between items-center">
          <button onclick="switchTab('insight')" class="flex items-center space-x-0.5 text-slate-500 hover:text-slate-800 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span class="text-xs font-bold">返回</span>
          </button>
          <h2 class="text-sm font-bold text-neutral-900">洞察历史</h2>
          <button onclick="toggleHistoryManage()" id="history-manage-btn" class="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">管理</button>
        </div>

        <!-- 关键词搜索 -->
        <div class="relative">
          <input id="history-search" oninput="onHistorySearchInput()" type="text" placeholder="搜索洞察内容关键词…"
            class="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm transition-all">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"></path></svg>
        </div>

        <!-- 档位筛选 -->
        <div class="flex space-x-2">
          <button onclick="setHistoryFilter(0)" id="hfilter-0" class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white transition-all">全部</button>
          <button onclick="setHistoryFilter(7)" id="hfilter-7" class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">近 7 天</button>
          <button onclick="setHistoryFilter(30)" id="hfilter-30" class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">近 30 天</button>
          <button onclick="setHistoryFilter(60)" id="hfilter-60" class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">近 60 天</button>
          <button onclick="setHistoryFilterCompare()" id="hfilter-compare" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">⇄ 阶段对比</button>
        </div>

        <!-- 历史列表 -->
        <div id="history-list" class="space-y-2.5"></div>

        <!-- 加载更多（游标分页，每批 10 条） -->
        <button onclick="loadHistory(false)" id="history-loadmore" class="hidden w-full py-2.5 rounded-xl apple-card text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">加载更多</button>

        <!-- 管理模式底部操作条 -->
        <div id="history-delete-bar" class="hidden sticky bottom-2 z-10 flex items-center justify-between bg-slate-900/95 backdrop-blur-md text-white rounded-2xl px-4 py-2.5 shadow-xl">
          <button onclick="toggleHistorySelectAll()" id="history-selectall-btn" class="text-xs font-bold text-slate-200 hover:text-white transition-colors">全选</button>
          <span id="history-selected-count" class="text-xs text-slate-300">已选 0 项</span>
          <button onclick="deleteSelectedInsights()" id="history-delete-btn" class="text-xs font-bold bg-slate-600/60 text-slate-300 px-3.5 py-1.5 rounded-xl cursor-not-allowed transition-colors" disabled>删除所选</button>
        </div>
      </section>

      <!-- 5. 阶段对比独立视图 (Compare View) -->
      <section id="view-compare" class="fade-in space-y-4 hidden">
        <!-- topbar -->
        <div class="flex justify-between items-center">
          <button onclick="cmpBack()" class="flex items-center space-x-0.5 text-slate-500 hover:text-slate-800 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span class="text-xs font-bold">返回</span>
          </button>
          <h2 class="text-base font-bold text-slate-900">⇄ 阶段对比</h2>
          <span class="w-12"></span>
        </div>

        <!-- 两月选择器 -->
        <div class="apple-card p-3 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0 flex items-center justify-center space-x-0.5">
              <button onclick="cmpStepMonth('a',-1)" id="cmp-a-prev" class="w-6 h-6 shrink-0 flex items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-base font-bold leading-none transition-colors">‹</button>
              <div class="text-center min-w-0">
                <p class="text-[9px] uppercase font-bold text-slate-400">对比月 A</p>
                <p id="cmp-a-label" class="text-[13px] font-black text-slate-900 whitespace-nowrap">—</p>
              </div>
              <button onclick="cmpStepMonth('a',1)" id="cmp-a-next" class="w-6 h-6 shrink-0 flex items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-base font-bold leading-none transition-colors">›</button>
            </div>
            <span class="px-1 text-[9px] font-black text-slate-300 shrink-0">vs</span>
            <div class="flex-1 min-w-0 flex items-center justify-center space-x-0.5">
              <button onclick="cmpStepMonth('b',-1)" id="cmp-b-prev" class="w-6 h-6 shrink-0 flex items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-base font-bold leading-none transition-colors">‹</button>
              <div class="text-center min-w-0">
                <p class="text-[9px] uppercase font-bold text-slate-400">对比月 B</p>
                <p id="cmp-b-label" class="text-[13px] font-black text-slate-900 whitespace-nowrap">—</p>
              </div>
              <button onclick="cmpStepMonth('b',1)" id="cmp-b-next" class="w-6 h-6 shrink-0 flex items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-base font-bold leading-none transition-colors">›</button>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 text-center">默认「上月 vs 上上个月」· 两月互不重叠 · 支持跨年对比</p>
        </div>

        <!-- 未过完 / 数据不足 提示条 -->
        <div id="cmp-warn" class="hidden bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-3 py-2 text-[11px] leading-relaxed"></div>

        <!-- 生成按钮 -->
        <button onclick="cmpGenerateStream()" id="compare-gen-btn" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center space-x-2">
          <span class="font-mono">生成阶段对比综述</span>
        </button>

        <!-- 指标对比表 -->
        <div class="apple-card p-4 rounded-2xl space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="text-xs font-medium text-neutral-700 font-mono">指标对比</span>
            <span id="cmp-table-meta" class="text-[10px] text-slate-400"></span>
          </div>
          <table class="w-full text-xs">
            <thead>
              <tr class="text-[10px] text-slate-400">
                <th class="text-left font-bold pb-2">指标</th>
                <th id="cmp-col-a" class="text-right font-bold pb-2">月 A</th>
                <th id="cmp-col-b" class="text-right font-bold pb-2">月 B</th>
                <th class="text-right font-bold pb-2">Δ</th>
              </tr>
            </thead>
            <tbody id="compare-table-body"></tbody>
          </table>
        </div>

        <!-- AI 阶段对比综述卡片 -->
        <div class="apple-card p-5 space-y-3 min-h-[300px]">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="text-xs font-bold text-indigo-600 flex items-center space-x-1">
              <span class="font-mono text-xs font-medium">阶段对比综述</span>
            </span>
            <span id="cmp-status-tag" class="text-[10px] text-slate-400">点击上方按钮开始</span>
          </div>
          <div id="compare-insight-card" class="text-sm text-slate-700 leading-relaxed markdown-body">
            <p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>
          </div>
        </div>
      </section>

      <!-- 4. 睡前小结 (Evening Summary View) -->`;function j(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ae(e){if(!e)return"";const n=j(e).split(`
`);let s="",o=!1;for(let a=0;a<n.length;a++){let l=n[a];if(l=l.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),l=l.replace(/`([^`]+)`/g,'<code class="bg-slate-100 px-1 py-0.5 rounded text-xs text-indigo-600">$1</code>'),/^### (.*$)/.test(l)){o&&(s+="</ul>",o=!1),s+=l.replace(/^### (.*$)/,'<h3 class="font-bold text-slate-800 text-sm mt-3 mb-1.5 pb-1 border-b border-slate-100">$1</h3>');continue}if(/^## (.*$)/.test(l)){o&&(s+="</ul>",o=!1),s+=l.replace(/^## (.*$)/,'<h2 class="font-bold text-slate-900 text-base mt-4 mb-2">$1</h2>');continue}if(/^# (.*$)/.test(l)){o&&(s+="</ul>",o=!1),s+=l.replace(/^# (.*$)/,'<h1 class="font-bold text-slate-900 text-lg mt-4 mb-2">$1</h1>');continue}if(/^---$/.test(l.trim())){o&&(s+="</ul>",o=!1),s+='<hr class="my-3 border-slate-200">';continue}if(/^[*-]\s+(.*$)/.test(l)){o||(s+='<ul class="list-disc pl-5 my-1.5 space-y-1 text-slate-700 text-xs leading-relaxed">',o=!0),s+=l.replace(/^[*-]\s+(.*$)/,"<li>$1</li>");continue}o&&(s+="</ul>",o=!1),l.trim()&&(s+=`<p class="my-1.5 text-xs text-slate-700 leading-relaxed">${l}</p>`)}return o&&(s+="</ul>"),s}window.escapeHtml=j;window.renderMarkdown=ae;let pe=30,A=R(new Date),Y="today",st=!1,u={items:[],beforeId:0,hasMore:!1,loading:!1,rangeDays:0,compareMode:!1,q:"",error:"",expanded:{},details:{},manageMode:!1,selected:{}};function Ms(e){e.insertAdjacentHTML("beforeend",_s)}function js(){typeof oe=="function"&&oe()}function Cs(e){pe=e,["7","30","60"].forEach(t=>{const n=document.getElementById(`pill-${t}`);n&&(parseInt(t)===e?n.className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all":n.className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all")}),ve(),oe()}function ot(){return Y==="yesterday"?dn(R(new Date),-1):Y==="custom"&&A?A:R(new Date)}const mt="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all",xt="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all";function he(){const e=R(new Date),t=document.getElementById("endpill-today"),n=document.getElementById("endpill-yesterday");t&&(t.className=Y==="today"?mt:xt),n&&(n.className=Y==="yesterday"?mt:xt);const s=document.getElementById("insight-end-date");s&&(s.max=e,s.value=A||e,s.classList.toggle("ring-2",Y==="custom"),s.classList.toggle("ring-blue-500/40",Y==="custom"))}function Ds(e){Y=e,A=ot(),he(),ve(),oe()}function Hs(e){const t=R(new Date);if(!e||e>t){he(),L("截止日不能晚于今天");return}Y="custom",A=e,he(),ve(),oe()}function ft(e){["7","30","60"].forEach(n=>{const s=document.getElementById(`pill-${n}`);s&&(s.disabled=e,s.classList.toggle("opacity-50",e),s.classList.toggle("cursor-not-allowed",e),s.classList.toggle("pointer-events-none",e))}),["endpill-today","endpill-yesterday"].forEach(n=>{const s=document.getElementById(n);s&&(s.disabled=e,s.classList.toggle("pointer-events-none",e),s.classList.toggle("opacity-50",e))});const t=document.getElementById("insight-end-date");t&&(t.disabled=e,t.classList.toggle("opacity-50",e))}async function As(){const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");if(A=ot(),he(),st&&!await W(`截至 ${A} 的近 ${pe} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成洞察",confirmText:"确定重新生成",danger:!1}))return;const s=n.innerHTML;n.disabled=!0,n.classList.add("opacity-50","cursor-not-allowed"),n.innerHTML="<span>⏳ AI 正在全盘深度分析中...</span>",Ge++,ft(!0),e.innerHTML="",e.classList.add("typing-cursor"),t.innerText="AI 正在推导生理因果...";let o="",a="",l=!1;function i(){let d="";o&&(d+=`
            <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500" ${a?"":"open"}>
              <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">
                思维链推导 (${o.length} 字)
              </summary>
              <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${o}</div>
            </details>
          `),a&&(d+=ae(a)),e.innerHTML=d}const r=-new Date().getTimezoneOffset();try{const d=await fetch(`/api/v1/insights/stream?days=${pe}&end_date=${A}&tz_offset=${r}`);if(!d.ok)throw new Error(`HTTP ${d.status}`);const p=d.body.getReader(),g=new TextDecoder("utf-8");let h="";for(;;){const{done:b,value:c}=await p.read();if(b)break;h+=g.decode(c,{stream:!0});const y=h.split(`
`);h=y.pop();for(let k of y){if(k=k.trim(),!k||!k.startsWith("data:"))continue;const I=k.slice(5).trim();if(I==="[DONE]"){t.innerText="复盘完成";continue}try{const S=JSON.parse(I);if(S.error)a+=`
> ⚠️ **服务提示**: ${S.error}
`,l=!0,i();else if(S.choices&&S.choices.length>0){const _=S.choices[0].delta||{};let C=!1;_.reasoning_content&&(o+=_.reasoning_content,C=!0),_.content&&(a+=_.content,C=!0),C&&i()}}catch{}}}l?(i(),t.innerText="分析失败"):a||o?Wt(a,o,new Date):(e.innerHTML='<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>',t.innerText="暂无分析内容")}catch(d){a||o?(a+=`

> ⚠️ *[网络连接已完成或阶段传输结束]*`,i(),t.innerText="分析完成(部分)"):d instanceof TypeError?(e.innerHTML=`<p class="text-red-500">无法连接本地服务（${location.host}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,t.innerText="本地服务未连接"):(e.innerHTML=`<p class="text-red-500">连接 AI 洞察服务失败: ${d.message}</p>`,t.innerText="生成异常")}finally{e.classList.remove("typing-cursor"),n.disabled=!1,n.classList.remove("opacity-50","cursor-not-allowed"),ft(!1),n.innerHTML=a||o?'<span class="font-mono">重新生成</span>':s}}function Rs(){u.rangeDays=0,u.compareMode=!1,u.q="",He();const e=document.getElementById("history-search");e&&(e.value=""),at(0),switchTab("history"),Ee(!0)}function Ns(e){u.rangeDays=e,u.compareMode=!1,He(),at(e),currentTab==="history"&&Ee(!0)}function Os(){u.rangeDays=0,u.compareMode=!0,He(),at("compare"),currentTab==="history"&&Ee(!0)}function at(e){[0,7,30,60].forEach(n=>{const s=document.getElementById(`hfilter-${n}`);s&&(n===e?s.className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white transition-all":s.className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all")});const t=document.getElementById("hfilter-compare");t&&(t.className=e==="compare"?"flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-blue-600 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all")}let gt=null;function Ps(){clearTimeout(gt),gt=setTimeout(()=>{He(),u.q=(document.getElementById("history-search").value||"").trim(),Ee(!0)},300)}async function Ee(e){if(u.loading)return;u.loading=!0,e&&(u.items=[],u.beforeId=0,u.hasMore=!1,u.error="",u.expanded={},u.details={}),ue();const t=new URLSearchParams;t.set("limit","10"),u.beforeId>0&&t.set("before_id",String(u.beforeId)),u.compareMode?t.set("scope","compare"):u.rangeDays>0&&t.set("range_days",String(u.rangeDays)),u.q&&t.set("q",u.q);try{const s=await(await fetch("/api/v1/insights?"+t.toString())).json();if(s.code!==200)throw new Error(s.message||"查询失败");const o=s.data||{},a=o.items||[];u.items=u.items.concat(a),u.hasMore=!!o.has_more,a.length>0&&(u.beforeId=a[a.length-1].id)}catch(n){u.error=n.message}finally{u.loading=!1,ue()}}function ue(){const e=document.getElementById("history-list"),t=document.getElementById("history-loadmore"),n=document.getElementById("history-manage-btn");if(e){if(!u.items.length){u.loading?e.innerHTML='<p class="text-center text-xs text-slate-400 py-8">加载中…</p>':u.error?e.innerHTML=`<p class="text-center text-xs text-red-500 py-8">加载失败：${j(u.error)}</p>`:e.innerHTML='<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>',t&&t.classList.add("hidden"),n&&n.classList.toggle("hidden",!u.manageMode),We();return}e.innerHTML=u.items.map(s=>{const o=!!u.expanded[s.id],a=!!u.selected[s.id],l=new Date(s.created_at),i=isNaN(l.getTime())?"":`${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")} ${String(l.getHours()).padStart(2,"0")}:${String(l.getMinutes()).padStart(2,"0")}`,r=(s.content||"").replace(/[#*`>|\-]/g," ").replace(/\s+/g," ").trim().slice(0,90)||"（无正文）",d=s.scope==="compare",p=s.meta||{},g=p.month_a&&p.month_b?`${j(p.month_a)} vs ${j(p.month_b)}`:`${j(s.start_date)} ~ ${j(s.end_date)}`,h=d?g:`${j(s.start_date)} ~ ${j(s.end_date)}`,b=d?"阶段对比":`近 ${s.range_days} 天`,c=`
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-xs font-bold text-slate-800">${h}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold">${b}</span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed ${o&&!u.manageMode?"":"line-clamp-2"}">${j(r)}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[10px] text-slate-400">${i}${s.model?" · "+j(s.model):""}</span>
            ${u.manageMode?"":d?'<span class="text-[10px] text-blue-600 font-bold">查看对比 ›</span>':`<span class="text-[10px] text-blue-600 font-bold">${o?"收起 ▴":"展开 ▾"}</span>`}
          </div>`;if(u.manageMode)return`
            <div data-hp-id="${s.id}" onclick="onHistoryItemClick(${s.id})" class="cursor-pointer select-none flex items-start space-x-3 bg-white border rounded-2xl p-3.5 shadow-sm transition-colors ${a?"border-blue-400 ring-1 ring-blue-300":"border-slate-100"}">
              <div class="mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${a?"bg-blue-600 border-blue-600":"border-slate-300 bg-white"}">
                ${a?'<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>':""}
              </div>
              <div class="flex-1 min-w-0">${c}</div>
            </div>`;let y="";if(o){const k=u.details[s.id];if(!k)y='<p class="text-[11px] text-slate-400 mt-2">加载全文…</p>';else{const I=(k.thinking||"").trim();y=`${I?`
              <details class="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
                <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${I.length} 字)</summary>
                <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${j(I)}</div>
              </details>`:""}
              <div class="mt-2 text-sm text-slate-700 leading-relaxed markdown-body">${ae(k.content||"")}</div>`}}return`
          <div data-hp-id="${s.id}" class="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm">
            <div class="cursor-pointer select-none" onclick="onHistoryItemClick(${s.id})">${c}</div>
            ${y}
          </div>`}).join(""),t&&t.classList.toggle("hidden",!u.hasMore),n&&n.classList.toggle("hidden",!u.items.length&&!u.manageMode),We(),Fs()}}let Ve=null;function Fs(){const e=document.getElementById("history-list");e&&e.querySelectorAll("[data-hp-id]").forEach(t=>{const n=parseInt(t.getAttribute("data-hp-id"),10),s=()=>{u.manageMode||(clearTimeout(Ve),Ve=setTimeout(()=>{u.manageMode=!0,u.selected={[n]:!0},Ae(),ue()},500))},o=()=>clearTimeout(Ve);t.addEventListener("pointerdown",s),t.addEventListener("pointerup",o),t.addEventListener("pointerleave",o),t.addEventListener("pointercancel",o),t.addEventListener("contextmenu",a=>a.preventDefault())})}function zs(){u.manageMode=!u.manageMode,u.manageMode||(u.selected={}),Ae(),ue()}function He(){u.manageMode&&(u.manageMode=!1,u.selected={},Ae())}function Ae(){const e=document.getElementById("history-manage-btn");e&&(e.innerText=u.manageMode?"完成":"管理",e.className=u.manageMode?"text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors":"text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"),We()}function Us(){const e=u.items.map(n=>n.id);if(e.filter(n=>u.selected[n]).length===e.length)u.selected={};else{const n={};e.forEach(s=>{n[s]=!0}),u.selected=n}ue()}function We(){const e=document.getElementById("history-delete-bar");if(!e)return;const t=u.manageMode&&u.items.length>0;if(e.classList.toggle("hidden",!t),!t)return;const n=u.items.map(i=>i.id),s=n.filter(i=>u.selected[i]).length,o=document.getElementById("history-selected-count");o&&(o.innerText=`已选 ${s} 项`);const a=document.getElementById("history-selectall-btn");a&&(a.innerText=n.length>0&&s===n.length?"取消全选":"全选");const l=document.getElementById("history-delete-btn");l&&(l.disabled=s===0,l.innerText=s>0?`删除所选 (${s})`:"删除所选",l.className=s>0?"text-xs font-bold bg-red-500 hover:bg-red-600 px-3.5 py-1.5 rounded-xl transition-colors":"text-xs font-bold bg-slate-600/60 text-slate-300 px-3.5 py-1.5 rounded-xl cursor-not-allowed transition-colors")}async function Vs(){const e=u.items.map(n=>n.id).filter(n=>u.selected[n]);if(!(!e.length||!await W(`确定删除所选 ${e.length} 条洞察存档？删除后不可恢复。`,{title:"删除洞察存档",confirmText:"确定删除"})))try{const s=await(await fetch("/api/v1/insights/batch-delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids:e})})).json();if(s.code!==200)throw new Error(s.message||"删除失败");u.items=u.items.filter(o=>!u.selected[o.id]),Object.keys(u.selected).forEach(o=>{delete u.expanded[o],delete u.details[o]}),u.selected={},u.items.length||(u.manageMode=!1),Ae(),ue(),oe()}catch(n){L("删除失败："+n.message)}}const qs="<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>";function qt(e,t){let n="";const s=(t||"").trim();return s&&(n+=`
          <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${s.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${j(s)}</div>
          </details>`),e&&e.trim()?n+=ae(e):n+='<p class="text-slate-400 text-xs">该洞察没有正文内容。</p>',n}function ve(){st=!1;const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");e&&(e.innerHTML=qs),t&&(t.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段深度洞察</span>')}function Wt(e,t,n){st=!0;const s=document.getElementById("insight-content"),o=document.getElementById("insight-status-tag"),a=document.getElementById("btn-generate-insight"),l=n instanceof Date?n:new Date(n),i=String(l.getHours()).padStart(2,"0"),r=String(l.getMinutes()).padStart(2,"0");s&&(s.innerHTML=qt(e,t)),o&&(o.innerHTML=`近 ${pe} 天（截至 ${A}）· 生成于 ${i}:${r} · <span onclick="openInsightHistory()" class="text-blue-600 cursor-pointer font-bold">点击查看</span>`),a&&(a.innerHTML='<span class="font-mono">重新生成</span>')}let Ge=0;async function oe(){const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");if(!t||!n||!e)return;A=ot(),he();const s=pe,o=A,a=++Ge,l=()=>a!==Ge||s!==pe||o!==A,i=-new Date().getTimezoneOffset();try{const r=await fetch(`/api/v1/insights/period?range_days=${s}&end_date=${o}&tz_offset=${i}`);if(l())return;const d=await r.json();if(l())return;const p=d.code===200&&d.data?d.data:null;if(!p||!p.exists||!p.insight){ve();return}const g=p.insight;Wt(g.content||"",g.thinking||"",g.created_at)}catch{if(l())return;ve()}}function Gt(){document.visibilityState==="visible"&&currentTab==="insight"&&oe()}document.addEventListener("visibilitychange",Gt);window.addEventListener("pageshow",Gt);let f={monthA:"",monthB:"",metricsA:null,metricsB:null,generated:!1,busy:!1,loadSeq:0,returnTab:"insight"};function ye(e){const t=new Date;return t.setDate(1),t.setMonth(t.getMonth()+e),`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function bt(e){const[t,n]=e.split("-").map(Number);return t*12+(n-1)}function Ws(){return ye(0)}function Jt(e,t){const[n,s]=e.split("-").map(Number),o=new Date(n,s-1+t,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function z(e){if(!e)return"—";const[t,n]=e.split("-");return`${t} 年 ${parseInt(n,10)} 月`}function Yt(e){return bt(e)>bt(Ws())}function Gs(e,t,n){f.returnTab=n==="history"?"history":"insight",e&&t?(f.monthA=e,f.monthB=t):(f.monthA||(f.monthA=ye(-1)),f.monthB||(f.monthB=ye(-2))),switchTab("compare")}function Js(){switchTab(f.returnTab==="history"?"history":"insight")}function lt(){const e=document.getElementById("cmp-a-label"),t=document.getElementById("cmp-b-label");e&&(e.innerText=z(f.monthA)),t&&(t.innerText=z(f.monthB)),["a","b"].forEach(n=>{const s=n==="a"?f.monthA:f.monthB,o=document.getElementById(`cmp-${n}-next`);if(!o)return;const a=!s||Yt(Jt(s,1));o.disabled=a||f.busy,o.classList.toggle("opacity-40",a||f.busy),o.classList.toggle("cursor-not-allowed",a||f.busy)})}function ht(e){["cmp-a-prev","cmp-a-next","cmp-b-prev","cmp-b-next"].forEach(t=>{const n=document.getElementById(t);n&&(n.disabled=e,n.classList.toggle("opacity-40",e),n.classList.toggle("pointer-events-none",e),n.classList.toggle("cursor-not-allowed",e))}),e||lt()}function Ys(e,t){if(f.busy)return;const n=e==="a"?f.monthA:f.monthB,s=Jt(n,t);if(Yt(s)){L("不能选择未来的月份"),lt();return}e==="a"?f.monthA=s:f.monthB=s,Ks(),Qs()}function Ks(){const e=document.getElementById("compare-insight-card"),t=document.getElementById("cmp-status-tag");e&&(e.innerHTML='<p class="text-slate-400 text-xs">加载该月份对的对比数据…</p>'),t&&(t.innerText="加载中…")}function M(e,t){return e==null||e===""||isNaN(Number(e))?"—":Number(e).toFixed(t)}function Xs(e,t){if(e==null||t===null||t===void 0||e===""||t==="")return null;const n=Number(e),s=Number(t);return isNaN(n)||isNaN(s)?null:n-s}function J(e,t,n,s){const o=Xs(e,t);if(o===null)return'<span class="text-slate-300">—</span>';const a=(o>0?"+":"")+o.toFixed(n);let l="text-slate-500";return s==="down"?l=o<0?"text-emerald-600":o>0?"text-red-500":"text-slate-400":s==="up"&&(l=o>0?"text-emerald-600":o<0?"text-red-500":"text-slate-400"),`<span class="font-bold ${l}">${a}</span>`}function V(e,t,n,s){return`<tr class="border-b border-slate-50 last:border-0">
        <td class="py-2 pr-2 text-slate-500 align-top">${e}</td>
        <td class="py-2 text-right font-bold text-slate-800 tabular-nums">${t}</td>
        <td class="py-2 text-right font-bold text-slate-800 tabular-nums">${n}</td>
        <td class="py-2 text-right whitespace-nowrap">${s}</td>
      </tr>`}function vt(e){if(!e)return"—";const t=M(e.green_days,0),n=M(e.yellow_days,0),s=M(e.red_days,0);return t==="—"&&n==="—"&&s==="—"?"—":`${t} / ${n} / ${s}`}function yt(e){if(!e)return"—";const t=M(e.workout_days,0);if(t==="—")return"—";const n=[];return e.workout_light!==null&&e.workout_light!==void 0&&n.push(`轻 ${e.workout_light}`),e.workout_medium!==null&&e.workout_medium!==void 0&&n.push(`中 ${e.workout_medium}`),e.workout_failure!==null&&e.workout_failure!==void 0&&n.push(`力竭 ${e.workout_failure}`),n.length?`${t} <span class="text-[10px] text-slate-400 font-normal">(${n.join(" / ")})</span>`:t}function wt(){const e=document.getElementById("compare-table-body");if(!e)return;const t=document.getElementById("cmp-col-a"),n=document.getElementById("cmp-col-b"),s=document.getElementById("cmp-table-meta");t&&(t.innerText=z(f.monthA)),n&&(n.innerText=z(f.monthB));const o=f.metricsA,a=f.metricsB;if(!o&&!a){e.innerHTML='<tr><td colspan="4" class="py-6 text-center text-slate-400">暂无数据</td></tr>',s&&(s.innerText="");return}if(s){const r=[o,a].filter(d=>d&&d.record_days!==null&&d.record_days!==void 0).map(d=>`${d.month} ${d.record_days} 天`);s.innerText=r.join(" · ")}const l=(r,d)=>r?r[d]:null,i=[V("体重均值 (kg)",M(l(o,"weight_avg"),1),M(l(a,"weight_avg"),1),J(l(o,"weight_avg"),l(a,"weight_avg"),1,"down")),V("体重净变化 (kg)",M(l(o,"weight_delta"),1),M(l(a,"weight_delta"),1),J(l(o,"weight_delta"),l(a,"weight_delta"),1,"down")),V("腰围均值 (cm)",M(l(o,"waist_avg"),1),M(l(a,"waist_avg"),1),J(l(o,"waist_avg"),l(a,"waist_avg"),1,"down")),V("腰围净变化 (cm)",M(l(o,"waist_delta"),1),M(l(a,"waist_delta"),1),J(l(o,"waist_delta"),l(a,"waist_delta"),1,"down")),V("平均睡眠时长 (小时)",M(l(o,"sleep_avg_hours"),1),M(l(a,"sleep_avg_hours"),1),J(l(o,"sleep_avg_hours"),l(a,"sleep_avg_hours"),1,"up")),V("熬夜分布 (绿/黄/红 天数)",vt(o),vt(a),'<span class="text-slate-300">—</span>'),V("有运动天数",yt(o),yt(a),J(l(o,"workout_days"),l(a,"workout_days"),0,"up")),V("专注达服药天数 (天)",M(l(o,"concerta_days"),0),M(l(a,"concerta_days"),0),J(l(o,"concerta_days"),l(a,"concerta_days"),0,null)),V("平均夜间排水 (kg)",M(l(o,"night_loss_avg"),2),M(l(a,"night_loss_avg"),2),J(l(o,"night_loss_avg"),l(a,"night_loss_avg"),2,"down"))];e.innerHTML=i.join("")}function kt(){const e=document.getElementById("cmp-warn");if(!e)return;const t=[];[["a",f.monthA,f.metricsA],["b",f.monthB,f.metricsB]].forEach(n=>{const s=n[1],o=n[2];o&&(o.incomplete_month?t.push(`⚠️ ${z(s)}尚未过完，结论置信度低`):o.data_insufficient&&t.push(`⚠️ ${z(s)}数据不足，结论置信度低`))}),t.length?(e.innerHTML=t.join("<br>"),e.classList.remove("hidden")):(e.innerHTML="",e.classList.add("hidden"))}function Zs(){f.generated=!1;const e=document.getElementById("compare-insight-card"),t=document.getElementById("cmp-status-tag"),n=document.getElementById("compare-gen-btn");e&&(e.innerHTML="<p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>"),t&&(t.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段对比综述</span>')}function Kt(e,t,n){f.generated=!0;const s=document.getElementById("compare-insight-card"),o=document.getElementById("cmp-status-tag"),a=document.getElementById("compare-gen-btn"),l=n instanceof Date?n:new Date(n),i=String(l.getHours()).padStart(2,"0"),r=String(l.getMinutes()).padStart(2,"0");s&&(s.innerHTML=qt(e,t)),o&&(o.innerText=`${z(f.monthA)} vs ${z(f.monthB)} · 生成于 ${i}:${r}`),a&&(a.innerHTML='<span class="font-mono">重新生成阶段对比</span>')}async function Qs(){f.monthA||(f.monthA=ye(-1)),f.monthB||(f.monthB=ye(-2)),lt();const e=++f.loadSeq,t=f.monthA,n=f.monthB,s=-new Date().getTimezoneOffset();try{const o=await fetch(`/api/v1/insights/compare/period?month_a=${t}&month_b=${n}&tz_offset=${s}`);if(e!==f.loadSeq)return;const a=await o.json();if(e!==f.loadSeq)return;if(a.code!==200||!a.data)throw new Error(a.message||"加载失败");const l=a.data;if(e!==f.loadSeq)return;f.metricsA=l.metrics_a||null,f.metricsB=l.metrics_b||null,wt(),kt(),l.exists&&l.insight?Kt(l.insight.content||"",l.insight.thinking||"",l.insight.created_at):Zs()}catch(o){if(e!==f.loadSeq)return;f.metricsA=null,f.metricsB=null,wt(),kt();const a=document.getElementById("compare-insight-card");a&&(a.innerHTML=`<p class="text-red-500 text-xs">加载对比数据失败：${j(o.message)}</p>`);const l=document.getElementById("cmp-status-tag");l&&(l.innerText="加载失败"),L("加载对比数据失败："+o.message)}}async function eo(){if(f.busy)return;const e=document.getElementById("compare-insight-card"),t=document.getElementById("cmp-status-tag"),n=document.getElementById("compare-gen-btn");if(!e||!n||f.generated&&!await W(`「${z(f.monthA)} vs ${z(f.monthB)}」已生成过阶段对比综述，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成阶段对比",confirmText:"确定重新生成",danger:!1}))return;const s=n.innerHTML;f.busy=!0,n.disabled=!0,n.classList.add("opacity-50","cursor-not-allowed"),n.innerHTML="<span>⏳ AI 正在对比分析中...</span>",ht(!0),f.loadSeq++,e.innerHTML="",e.classList.add("typing-cursor"),t.innerText="AI 正在推导两月差异...";let o="",a="",l=!1;function i(){let d="";o&&(d+=`
            <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500" ${a?"":"open"}>
              <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">
                思维链推导 (${o.length} 字)
              </summary>
              <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${o}</div>
            </details>
          `),a&&(d+=ae(a)),e.innerHTML=d}const r=-new Date().getTimezoneOffset();try{const d=await fetch(`/api/v1/insights/compare/stream?month_a=${f.monthA}&month_b=${f.monthB}&tz_offset=${r}`);if(!d.ok)throw new Error(`HTTP ${d.status}`);const p=d.body.getReader(),g=new TextDecoder("utf-8");let h="";for(;;){const{done:b,value:c}=await p.read();if(b)break;h+=g.decode(c,{stream:!0});const y=h.split(`
`);h=y.pop();for(let k of y){if(k=k.trim(),!k||!k.startsWith("data:"))continue;const I=k.slice(5).trim();if(I==="[DONE]"){t.innerText="对比完成";continue}try{const S=JSON.parse(I);if(S.error)a+=`
> ⚠️ **服务提示**: ${S.error}
`,l=!0,i();else if(S.choices&&S.choices.length>0){const _=S.choices[0].delta||{};let C=!1;_.reasoning_content&&(o+=_.reasoning_content,C=!0),_.content&&(a+=_.content,C=!0),C&&i()}}catch{}}}l?(i(),t.innerText="分析失败"):a||o?Kt(a,o,new Date):(e.innerHTML='<p class="text-slate-400">未能获取到对比内容，请检查后端大模型连接。</p>',t.innerText="暂无对比内容")}catch(d){a||o?(a+=`

> ⚠️ *[网络连接已完成或阶段传输结束]*`,i(),t.innerText="分析完成(部分)"):d instanceof TypeError?(e.innerHTML=`<p class="text-red-500">无法连接本地服务（${location.host}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,t.innerText="本地服务未连接"):(e.innerHTML=`<p class="text-red-500">连接 AI 对比服务失败: ${d.message}</p>`,t.innerText="生成异常")}finally{e.classList.remove("typing-cursor"),f.busy=!1,ht(!1),n.disabled=!1,n.classList.remove("opacity-50","cursor-not-allowed"),n.innerHTML=!l&&(a||o)?'<span class="font-mono">重新生成阶段对比</span>':s}}window.setInsightDays=Cs;window.setInsightEndDate=Hs;window.setInsightEndMode=Ds;window.generateInsightStream=As;window.openInsightHistory=Rs;window.setHistoryFilter=Ns;window.setHistoryFilterCompare=Os;window.onHistorySearchInput=Ps;window.loadHistory=Ee;window.toggleHistoryManage=zs;window.toggleHistorySelectAll=Us;window.deleteSelectedInsights=Vs;window.openCompareView=Gs;window.cmpBack=Js;window.cmpStepMonth=Ys;window.cmpGenerateStream=eo;const to=`      <section id="view-evening" class="fade-in hidden -m-5">

        <!-- 头部：夜色渐变，建立页面情绪 -->
        <div class="relative overflow-hidden px-5 pt-5 pb-6 rounded-b-[2rem] evo-accent-grad-soft border-b border-indigo-100/60">
          <span class="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-indigo-200/40 blur-3xl"></span>
          <span class="absolute -left-6 top-6 w-24 h-24 rounded-full bg-violet-200/40 blur-3xl"></span>

          <div class="relative flex items-start justify-between">
            <div>
              <p class="evo-eyebrow">EVENING REVIEW</p>
              <h1 class="text-xl font-black text-slate-900 tracking-tight mt-0.5">睡前小结</h1>
            </div>
            <div class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>
          </div>

          <div class="relative flex items-center justify-between mt-4">
            <label class="flex items-center space-x-1.5 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <input type="date" id="summary-date" class="bg-transparent text-xs font-bold text-slate-700 outline-none w-[6.6rem]" onchange="evOnDateChange(this.value)">
            </label>
            <button onclick="evSetToday()" class="text-[11px] font-bold text-indigo-600 bg-white/80 backdrop-blur hover:bg-white px-3 py-1.5 rounded-full border border-indigo-100 transition-colors active:scale-[.96]">回到今日</button>
          </div>
        </div>

        <div class="px-4 pt-4 pb-6 space-y-3.5">

          <!-- ── 主卡：图片 + 感想 ── -->
          <div class="evo-card evo-card-hero overflow-hidden ev-rise" style="animation-delay:.04s">
            <div class="px-4 pt-4 pb-3 flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500">今日最难忘的一张图</span>
              <span class="text-[10px] font-semibold text-indigo-400">一天一张</span>
            </div>

            <!-- 空态 -->
            <label id="photo-empty" for="photo-input" class="block cursor-pointer px-4">
              <div class="border-2 border-dashed border-indigo-200/80 bg-indigo-50/30 hover:bg-indigo-50/70 hover:border-indigo-300 rounded-2xl py-8 flex flex-col items-center justify-center transition-all active:scale-[.99]">
                <span class="w-11 h-11 rounded-2xl evo-accent-grad flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </span>
                <span class="text-xs font-bold text-slate-600 mt-2.5">选择今天的这一张</span>
                <span class="text-[10px] text-slate-400 mt-0.5">自动压缩后仅存本机</span>
              </div>
            </label>

            <!-- 已选 -->
            <div id="photo-filled" class="hidden">
              <div class="relative mx-4 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                <img id="photo-preview" src="" alt="今日图片" onclick="evoOpenPhoto(this.src, '今日图片')" class="w-full h-52 object-cover cursor-zoom-in">
                <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/55 to-transparent"></div>
                <span class="absolute top-2.5 left-2.5 text-[10px] font-bold text-white bg-slate-900/45 backdrop-blur px-2 py-0.5 rounded-full">今日一张</span>
                <div class="absolute bottom-2.5 right-2.5 flex space-x-1.5">
                  <label for="photo-input" class="text-[10px] font-bold text-slate-700 bg-white/95 px-2.5 py-1 rounded-full cursor-pointer active:scale-[.95] transition-transform">替换</label>
                  <button onclick="evRemovePhoto()" class="text-[10px] font-bold text-red-600 bg-white/95 px-2.5 py-1 rounded-full active:scale-[.95] transition-transform">删除</button>
                </div>
              </div>
              <p id="photo-meta" class="px-4 pt-2 text-[10px] text-slate-400"></p>
            </div>
            <input type="file" id="photo-input" accept="image/*" class="hidden" onchange="evOnPhotoPick(event)">

            <!-- 感想 -->
            <div class="px-4 pt-3 pb-4 mt-3 border-t border-dashed" style="border-color:#eef2f7">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-bold text-slate-500">那一刻的感想</span>
                <span class="text-[10px] text-slate-400"><span id="note-len">0</span> 字</span>
              </div>
              <textarea id="note-text" rows="3" oninput="document.getElementById('note-len').innerText=this.value.length" class="evo-selectable w-full bg-slate-50 text-slate-700 border border-transparent rounded-xl p-3 text-[13px] outline-none focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none leading-relaxed placeholder:text-slate-400" placeholder="为什么这张图值得被记住…"></textarea>
            </div>
          </div>

          <!-- ── 今日完成的三件事 ── -->
          <div class="evo-card p-4 ev-rise" style="animation-delay:.08s">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-slate-500">今日完成的三件事</span>
              <span id="done-count" class="text-[10px] font-black text-slate-300 tabular-nums transition-colors">0 / 3</span>
            </div>
            <div class="space-y-2">
              <div class="evo-done-row flex items-center space-x-2.5 bg-slate-50/80 border border-transparent rounded-xl px-2.5 py-2">
                <span class="evo-seq-dot" id="seq-1">1</span>
                <input type="text" id="done-1" maxlength="200" oninput="evUpdateDoneCount()" placeholder="最有成就感的那件事" class="evo-selectable flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400">
              </div>
              <div class="evo-done-row flex items-center space-x-2.5 bg-slate-50/80 border border-transparent rounded-xl px-2.5 py-2">
                <span class="evo-seq-dot" id="seq-2">2</span>
                <input type="text" id="done-2" maxlength="200" oninput="evUpdateDoneCount()" placeholder="其次推进的一件事" class="evo-selectable flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400">
              </div>
              <div class="evo-done-row flex items-center space-x-2.5 bg-slate-50/80 border border-transparent rounded-xl px-2.5 py-2">
                <span class="evo-seq-dot" id="seq-3">3</span>
                <input type="text" id="done-3" maxlength="200" oninput="evUpdateDoneCount()" placeholder="哪怕很小，也算（可留空）" class="evo-selectable flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400">
              </div>
            </div>
          </div>

          <!-- ── 今日对自己的打分 ── -->
          <div class="evo-card p-4 ev-rise" style="animation-delay:.12s">
            <div class="flex items-end justify-between mb-1">
              <div class="mb-1 flex items-center space-x-1.5">
                <span class="text-[11px] font-bold text-slate-500">今日对自己的打分</span>
                <button onclick="evToggleBandEditor()" class="text-[10px] font-bold text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded-full active:scale-[.95] transition-all">⚙ 文案</button>
              </div>
              <div class="flex items-baseline space-x-1">
                <span id="score-value" class="text-[2.6rem] leading-none font-black evo-grad-text tabular-nums">7</span>
                <span class="text-[11px] font-bold text-slate-300">/ 10</span>
              </div>
            </div>
            <input type="range" id="score-range" min="1" max="10" step="1" value="7" oninput="evUpdateScore(this.value)" class="evo-score-slider mt-1">
            <div class="flex justify-between text-[10px] font-bold text-slate-300 px-1 -mt-0.5 tabular-nums">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
            <div id="score-text" class="mt-3 text-center text-[11px] font-bold rounded-xl py-2 bg-indigo-50 text-indigo-600 transition-colors">还不错，稳住了节奏</div>

            <!-- 分档文案配置：读写 config.yaml 的 summary.score_bands -->
            <div id="band-editor" class="evo-collapsible">
              <div class="mt-3 pt-3 border-t border-dashed border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="evo-eyebrow">评分文案设置</span>
                  <button onclick="evResetBands()" class="text-[10px] font-bold text-slate-400 hover:text-slate-600 active:scale-[.95] transition-transform">恢复默认</button>
                </div>
                <div id="band-rows" class="space-y-1.5"></div>
                <div class="flex items-center justify-between mt-3">
                  <p class="text-[10px] text-slate-400 leading-relaxed">改动保存后立即生效，历史小结评分文案同步更新。</p>
                  <button onclick="evSaveBands()" id="band-save-btn" class="shrink-0 ml-2 text-[11px] font-bold text-white evo-accent-grad px-3 py-1.5 rounded-xl shadow-md shadow-indigo-500/25 active:scale-[.96] transition-all">保存文案</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── 保存 ── -->
          <button onclick="evSave()" id="ev-save-btn" class="w-full py-3.5 rounded-2xl evo-accent-grad text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[.985] transition-all ev-rise" style="animation-delay:.16s">保存今日小结</button>

          <!-- ── 小结洞察（深色卡，独立身份） ── -->
          <div class="evo-ai-card p-4 ev-rise" style="animation-delay:.2s">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-white flex items-center space-x-1.5"><span class="font-mono text-[11px] font-medium">小结洞察</span></span>
              <span class="text-[9px] font-bold text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full">独立于「洞察」页</span>
            </div>

            <!-- 关联生理数据的窗口长度：7 / 30 天 -->
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-[9px] font-bold text-slate-500 shrink-0">关联生理数据</span>
              <div class="flex space-x-1" id="ev-insight-range">
                <button class="evo-fchip-dark active" data-val="7" onclick="evSetInsightRange(this)">近 7 天</button>
                <button class="evo-fchip-dark" data-val="30" onclick="evSetInsightRange(this)">近 30 天</button>
              </div>
            </div>

            <div id="insight-empty">
              <p class="text-[11px] text-slate-400 leading-relaxed">从小结的<b class="text-slate-200">自评与文字</b>出发，结合所选区间内的体重 / 睡眠 / 运动趋势，重点解读你的心理状态与成就感。</p>
              <button onclick="evGenerateInsight()" id="ev-insight-btn" class="mt-3 w-full py-2.5 rounded-xl evo-accent-grad text-white font-bold text-xs shadow-lg shadow-indigo-500/25 active:scale-[.98] transition-transform">✨ 生成小结洞察</button>
            </div>

            <div id="insight-panel" class="hidden space-y-2.5">
              <div class="flex items-center justify-between">
                <span id="insight-meta" class="text-[10px] font-bold text-slate-500"></span>
                <button onclick="evResetInsight()" class="text-[10px] font-bold text-slate-500 hover:text-slate-300 px-1">清除</button>
              </div>
              <!-- 与「洞察」页一致：思维链在上，正文在下 -->
              <div class="pb-2.5 border-b border-white/10">
                <button onclick="evToggleThinking()" class="text-[10px] font-bold text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 active:scale-[.97] transition-transform">
                  <span id="think-arrow" class="transform transition-transform text-[8px]">▶</span><span>思维链推导</span>
                </button>
                <div id="think-body" class="evo-collapsible">
                  <p id="think-text" class="mt-2 text-[10px] text-slate-400 bg-white/5 rounded-xl p-3 leading-relaxed whitespace-pre-line"></p>
                </div>
              </div>
              <div id="insight-body" class="evo-md-dark"></div>
            </div>
          </div>

          <!-- ── 往期回顾 ── -->
          <div class="pt-1.5 ev-rise" style="animation-delay:.24s">
            <div class="flex items-center justify-between px-1 mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-[11px] font-bold text-slate-500">往期回顾</span>
                <span id="ev-history-total" class="text-[10px] font-black text-slate-300 tabular-nums">0 篇</span>
              </div>
              <span class="text-[10px] text-slate-300 font-semibold">左滑卡片可删除</span>
            </div>

            <!-- 筛选 -->
            <div class="evo-card evo-card-lite p-3 space-y-2.5">
              <div class="flex items-center space-x-2">
                <span class="evo-eyebrow w-8 shrink-0">日期</span>
                <div class="flex flex-wrap gap-1.5" id="ev-filter-date">
                  <button class="evo-fchip active" data-val="all" onclick="evSetDateFilter(this)">全部</button>
                  <button class="evo-fchip" data-val="7" onclick="evSetDateFilter(this)">近 7 天</button>
                  <button class="evo-fchip" data-val="30" onclick="evSetDateFilter(this)">近 30 天</button>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="evo-eyebrow w-8 shrink-0">评分</span>
                <div class="flex flex-wrap gap-1.5" id="ev-filter-score">
                  <button class="evo-fchip active" data-val="all" onclick="evSetScoreFilter(this)">全部</button>
                  <button class="evo-fchip" data-val="high" onclick="evSetScoreFilter(this)">9-10</button>
                  <button class="evo-fchip" data-val="good" onclick="evSetScoreFilter(this)">7-8</button>
                  <button class="evo-fchip" data-val="mid" onclick="evSetScoreFilter(this)">5-6</button>
                  <button class="evo-fchip" data-val="low" onclick="evSetScoreFilter(this)">1-4</button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between px-1 pt-3 pb-2">
              <span class="text-[10px] text-slate-400">筛选结果 <b id="ev-filter-count" class="text-slate-600 tabular-nums">0</b> 篇</span>
              <button id="ev-filter-reset" onclick="evResetFilters()" class="hidden text-[10px] font-bold text-indigo-500 active:scale-[.95] transition-transform">清除筛选</button>
            </div>

            <div id="ev-history-list" class="space-y-0"></div>

            <div id="ev-history-empty" class="hidden evo-card p-8 text-center">
              <p class="font-mono text-xs text-neutral-400">NO DATA</p>
              <p class="text-xs font-bold text-slate-600 mt-2">没有符合条件的小结</p>
              <p class="text-[10px] text-slate-400 mt-1">试着放宽日期或评分范围</p>`;function no(e){e.insertAdjacentHTML("beforeend",to),Co()}function so(){typeof Je=="function"&&Je()}const Ie=[{range:[1,2],label:"很低落",tone:"rose"},{range:[3,4],label:"有点钝",tone:"amber"},{range:[5,6],label:"平平",tone:"emerald"},{range:[7,8],label:"还不错，稳住了节奏",tone:"indigo"},{range:[9,10],label:"满分的一天",tone:"violet"}],Et={rose:{dot:"#f43f5e",chip:"text-rose-600 bg-rose-50 border-rose-100",band:"bg-rose-50 text-rose-600"},amber:{dot:"#f59e0b",chip:"text-amber-600 bg-amber-50 border-amber-100",band:"bg-amber-50 text-amber-700"},emerald:{dot:"#10b981",chip:"text-emerald-600 bg-emerald-50 border-emerald-100",band:"bg-emerald-50 text-emerald-700"},indigo:{dot:"#6366f1",chip:"text-indigo-600 bg-indigo-50 border-indigo-100",band:"bg-indigo-50 text-indigo-600"},violet:{dot:"#8b5cf6",chip:"text-violet-600 bg-violet-50 border-violet-100",band:"bg-violet-50 text-violet-600"}},Be=6;let K=null,x={date:"",photoId:null,pendingBlob:null,summaries:[],dateFilter:"all",scoreFilter:"all",visible:Be,insightBusy:!1,insightRange:7},te={W:84,drag:null,suppressClick:0};function it(e){const t=K||Ie;return t.find(n=>e>=n.range[0]&&e<=n.range[1])||t[t.length-1]}function Re(e){return Et[e]||Et.indigo}function le(){const e=new Date,t=n=>String(n).padStart(2,"0");return e.getFullYear()+"-"+t(e.getMonth()+1)+"-"+t(e.getDate())}function oo(e){const t=["周日","周一","周二","周三","周四","周五","周六"],n=new Date(e+"T00:00:00");return isNaN(n.getTime())?"":t[n.getDay()]}function ao(e){const t=new Date(le()+"T00:00:00"),n=new Date(e+"T00:00:00");return Math.round((t-n)/864e5)}function F(e){return e?e.slice(5):""}function It(e){return e?e.slice(0,7):""}function lo(e){const t=e.split("-");return t[0]+" 年 "+Number(t[1])+" 月"}function io(e){return String(e??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function Je(){x.date||(x.date=le()),document.getElementById("summary-date").value=x.date,await Promise.all([ro(),Ne()]),await on()}async function ro(){if(K){De();return}try{const t=await(await fetch("/api/config")).json(),n=t&&t.data&&t.data.summary_score_bands;Array.isArray(n)&&n.length&&(K=n.map(s=>({range:[s.range[0],s.range[1]],label:s.label,tone:s.tone})))}catch{}K||(K=Ie.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone}))),De(),Oe(Number(document.getElementById("score-range").value)||7)}async function Ne(){const e=x.date;Zt();try{const n=await(await fetch(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`)).json(),s=n&&n.code===200?n.data:null;s?(document.getElementById("done-1").value=s.done_items&&s.done_items[0]||"",document.getElementById("done-2").value=s.done_items&&s.done_items[1]||"",document.getElementById("done-3").value=s.done_items&&s.done_items[2]||"",document.getElementById("note-text").value=s.note_text||"",document.getElementById("note-len").innerText=(s.note_text||"").length,Ye(s.score||7),s.photo_id&&(x.photoId=s.photo_id,rt(`/api/v1/evening/photo/${s.photo_id}`,""))):(document.getElementById("done-1").value="",document.getElementById("done-2").value="",document.getElementById("done-3").value="",document.getElementById("note-text").value="",document.getElementById("note-len").innerText="0",Ye(7)),Xt()}catch(t){L("读取该日小结失败："+t.message)}wo(e)}function co(){x.date=le(),document.getElementById("summary-date").value=x.date,Ne(),L("已回到今日")}function po(e){e&&(x.date=e,Ne())}function Xt(){let e=0;[1,2,3].forEach(n=>{const s=!!document.getElementById("done-"+n).value.trim(),o=document.getElementById("seq-"+n);s?(o.classList.contains("filled")||(o.classList.add("filled","ev-pop"),setTimeout(()=>o.classList.remove("ev-pop"),340)),e++):o.classList.remove("filled")});const t=document.getElementById("done-count");t.innerText=e+" / 3",t.className="text-[10px] font-black tabular-nums transition-colors "+(e===0?"text-slate-300":"text-indigo-500")}function rt(e,t){document.getElementById("photo-preview").src=e||"",document.getElementById("photo-empty").classList.add("hidden"),document.getElementById("photo-filled").classList.remove("hidden"),document.getElementById("photo-meta").innerText=t||""}function Zt(){x.photoId=null,x.pendingBlob=null;const e=document.getElementById("photo-input");e&&(e.value=""),document.getElementById("photo-preview").src="",document.getElementById("photo-filled").classList.add("hidden"),document.getElementById("photo-empty").classList.remove("hidden"),document.getElementById("photo-meta").innerText=""}let me=!1;function uo(e,t){if(!e)return;const n=document.getElementById("ev-photo-viewer"),s=document.getElementById("ev-photo-viewer-img");!n||!s||(s.src=e,s.alt=t||"小结图片",n.classList.contains("hidden")&&(n.classList.remove("hidden"),me||(history.pushState({evPhoto:1},""),me=!0)))}function Qt(e){const t=document.getElementById("ev-photo-viewer"),n=document.getElementById("ev-photo-viewer-img");!t||t.classList.contains("hidden")||(t.classList.add("hidden"),n.removeAttribute("src"),me&&!e&&(me=!1,history.back()))}window.addEventListener("popstate",()=>{me&&(me=!1,Qt(!0))});document.addEventListener("keydown",e=>{e.key==="Escape"&&Qt()});async function mo(e){const t=e.target.files&&e.target.files[0];if(t){if(!t.type.startsWith("image/")){L("请选择图片文件");return}try{const n=await xo(t),s=x.pendingBlob&&document.getElementById("photo-preview").src;s&&s.startsWith("blob:")&&URL.revokeObjectURL(s),x.pendingBlob=n,rt(URL.createObjectURL(n),`原图 ${Math.round(t.size/1024)} KB · 压缩后约 ${Math.round(n.size/1024)} KB（长边 ≤1600px, JPEG q0.8）`),L("图片已就绪，保存小结时上传")}catch(n){L("图片处理失败："+n.message)}}}function xo(e){return new Promise((t,n)=>{const s=new FileReader;s.onerror=()=>n(new Error("读取文件失败")),s.onload=o=>{const a=new Image;a.onerror=()=>n(new Error("图片解码失败")),a.onload=()=>{let i=a.width,r=a.height;(i>1600||r>1600)&&(i>=r?(r=Math.round(r*1600/i),i=1600):(i=Math.round(i*1600/r),r=1600));const d=document.createElement("canvas");d.width=i,d.height=r;const p=d.getContext("2d");p.fillStyle="#fff",p.fillRect(0,0,i,r),p.drawImage(a,0,0,i,r),d.toBlob(g=>g?t(g):n(new Error("压缩失败")),"image/jpeg",.8)},a.src=o.target.result},s.readAsDataURL(e)})}async function fo(){if(await W("删除今天这张图片？删除后不可恢复。",{title:"删除图片",confirmText:"删除"})){if(x.photoId)try{const n=await(await fetch(`/api/v1/evening/photo/${x.photoId}`,{method:"DELETE"})).json();if(n.code!==200)throw new Error(n.message||"删除失败")}catch(t){L("删除图片失败："+t.message);return}Zt(),L("已删除今日图片")}}function Ye(e){const t=Number(e),n=document.getElementById("score-value");n.innerText=t,n.classList.remove("ev-pop"),n.offsetWidth,n.classList.add("ev-pop"),document.getElementById("score-range").style.setProperty("--pct",((t-1)/9*100).toFixed(1)+"%"),Oe(t)}function Oe(e){const t=it(e),n=document.getElementById("score-text");n.innerText=t.label,n.className="mt-3 text-center text-[11px] font-bold rounded-xl py-2 transition-colors "+Re(t.tone).band}function go(){const e=document.getElementById("band-editor");e.classList.toggle("open"),e.classList.contains("open")&&De()}function De(){const e=K||Ie;document.getElementById("band-rows").innerHTML=e.map((t,n)=>`
        <div class="flex items-center space-x-2 bg-slate-50/80 border border-slate-100 rounded-xl px-2.5 py-2">
          <span class="text-[10px] font-black text-slate-400 tabular-nums w-9 shrink-0">${t.range[0]}-${t.range[1]}</span>
          <button onclick="evCycleTone(${n})" title="点击切换配色"
                  class="w-4 h-4 rounded-full shrink-0 border-2 border-white shadow ring-1 ring-slate-200 active:scale-90 transition-transform"
                  style="background:${Re(t.tone).dot}"></button>
          <input type="text" value="${io(t.label)}" maxlength="20" oninput="evSetBandLabel(${n}, this.value)"
                 class="flex-1 min-w-0 bg-transparent text-[12px] text-slate-700 outline-none">
        </div>`).join("")}function bo(){K=Ie.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone})),De(),en(),Oe(Number(document.getElementById("score-range").value)),L("已恢复默认文案，点击「保存文案」生效")}function en(){document.querySelectorAll("#ev-history-list .evo-score-chip").forEach(e=>{const t=it(Number(e.dataset.score));e.className="evo-score-chip text-[10px] font-black px-1.5 py-0.5 rounded-full border "+Re(t.tone).chip})}async function ho(){const e=K||Ie,t=document.getElementById("band-save-btn");t.disabled=!0,t.classList.add("opacity-60");try{const s=await(await fetch("/api/config/summary",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({score_bands:e.map(o=>({range:[o.range[0],o.range[1]],label:o.label,tone:o.tone}))})})).json();if(s.code!==200)throw new Error(s.message||"保存失败");L("评分文案已保存并生效"),en(),Oe(Number(document.getElementById("score-range").value))}catch(n){L("保存失败："+n.message)}finally{t.disabled=!1,t.classList.remove("opacity-60")}}async function tn(){const e=document.getElementById("ev-save-btn"),t=x.date||le(),n=[1,2,3].map(l=>document.getElementById("done-"+l).value.trim()).filter(Boolean),s=document.getElementById("note-text").value.trim(),o=Number(document.getElementById("score-range").value),a=!!x.pendingBlob||!!x.photoId;if(!n.length&&!s&&!a){L("至少填写三件事、图片或感想中的一项");return}e.disabled=!0,e.classList.add("opacity-60");try{let l=x.photoId;if(x.pendingBlob){const p=await(await fetch(`/api/v1/evening/photo?date=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":"image/jpeg"},body:x.pendingBlob})).json();if(p.code!==200)throw new Error(p.message||"图片上传失败");l=p.data&&p.data.photo_id?p.data.photo_id:null}const r=await(await fetch("/api/v1/evening/summary",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({record_date:t,done_items:n,note_text:s,score:o,photo_id:l||null})})).json();if(r.code!==200)throw new Error(r.message||"保存失败");if(x.photoId=l,x.pendingBlob&&l){const d=document.getElementById("photo-preview").src;d&&d.startsWith("blob:")&&URL.revokeObjectURL(d),rt(`/api/v1/evening/photo/${l}`,"已保存 · 长边 ≤1600px, JPEG q0.8")}x.pendingBlob=null,L("今日小结已保存"),await on()}catch(l){L("保存失败："+l.message)}finally{e.disabled=!1,e.classList.remove("opacity-60")}}let de=null;function _e(e){return e===30?"近 30 天":"近 7 天"}function vo(e){document.querySelectorAll("#ev-insight-range .evo-fchip-dark").forEach(t=>t.classList.remove("active")),e.classList.add("active"),x.insightRange=Number(e.dataset.val)||7}function yo(e){e!==7&&e!==30||(x.insightRange=e,document.querySelectorAll("#ev-insight-range .evo-fchip-dark").forEach(t=>{t.classList.toggle("active",Number(t.dataset.val)===e)}))}async function wo(e){dt();const t=document.getElementById("insight-empty"),n=document.getElementById("insight-panel");document.getElementById("think-body").classList.remove("open"),document.getElementById("think-arrow").classList.remove("rotate-90"),document.getElementById("think-text").innerText="",document.getElementById("insight-body").innerHTML="",n.classList.add("hidden"),t.classList.remove("hidden");try{const o=await(await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(e)}`)).json(),a=o&&o.code===200?o.data:null;a&&a.content&&ko(a)}catch{}}function nn(e){if(!e)return"";const t=new Date(e);if(isNaN(t.getTime()))return"";const n=s=>String(s).padStart(2,"0");return n(t.getHours())+":"+n(t.getMinutes())}function ko(e){document.getElementById("insight-empty").classList.add("hidden"),document.getElementById("insight-panel").classList.remove("hidden"),yo(Number(e.range_days));const n=e.range_days===7||e.range_days===30?_e(e.range_days)+" · ":"";document.getElementById("insight-meta").innerText=`${F(e.start_date||x.date)} 小结洞察 · ${n}生成于 ${nn(e.created_at)}`,document.getElementById("insight-body").innerHTML=ae(e.content||""),document.getElementById("think-text").innerText=e.thinking||""}function dt(){if(de){try{de.abort()}catch{}de=null}const e=document.getElementById("insight-body");e&&e.classList.remove("typing-cursor")}async function sn(){if(x.insightBusy)return;const e=x.date||le(),t=document.getElementById("ev-insight-btn"),n=document.getElementById("insight-empty"),s=document.getElementById("insight-panel"),o=document.getElementById("insight-body");dt(),x.insightBusy=!0,t&&(t.disabled=!0,t.classList.add("opacity-60"),t.innerText="⏳ 正在生成…"),n.classList.add("hidden"),s.classList.remove("hidden"),s.classList.add("ev-rise"),o.innerHTML='<p class="text-slate-500 text-[11px]">（正在推导…）</p>',o.classList.add("typing-cursor"),document.getElementById("insight-meta").innerText=`${F(e)} 小结洞察 · ${_e(x.insightRange)} · 生成中…`,document.getElementById("think-text").innerText="",document.getElementById("think-body").classList.remove("open"),document.getElementById("think-arrow").classList.remove("rotate-90");let a="",l="",i=!1;function r(){if(o.innerHTML=l?ae(l):'<p class="text-slate-500 text-[11px]">（正在推导…）</p>',a){document.getElementById("think-text").innerText=a;const p=!l;document.getElementById("think-body").classList.toggle("open",p),document.getElementById("think-arrow").classList.toggle("rotate-90",p)}}const d=new AbortController;de=d;try{const p=await fetch(`/api/v1/evening/insight/stream?date=${encodeURIComponent(e)}&days=${x.insightRange}`,{signal:d.signal});if(!p.ok)throw new Error("HTTP "+p.status);const g=p.body.getReader(),h=new TextDecoder("utf-8");let b="";for(;;){const{done:c,value:y}=await g.read();if(c)break;b+=h.decode(y,{stream:!0});const k=b.split(`
`);b=k.pop();for(let I of k){if(I=I.trim(),!I||!I.startsWith("data:"))continue;const S=I.slice(5).trim();if(S!=="[DONE]")try{const _=JSON.parse(S);if(_.error)l+=`
> ⚠️ **服务提示**: `+_.error+`
`,i=!0;else if(_.choices&&_.choices.length){const C=_.choices[0].delta||{};C.reasoning_content&&(a+=C.reasoning_content),C.content&&(l+=C.content)}r()}catch{}}}i?document.getElementById("insight-meta").innerText=`${F(e)} 小结洞察 · ${_e(x.insightRange)} · 生成失败`:l||a?document.getElementById("insight-meta").innerText=`${F(e)} 小结洞察 · ${_e(x.insightRange)} · 生成于 ${nn(new Date)}`:o.innerHTML='<p class="text-slate-500 text-[11px]">未能获取到分析内容，请检查大模型配置。</p>'}catch(p){p&&p.name==="AbortError"||(l||a?(l+=`

> ⚠️ *[网络连接中断]*`,r()):p instanceof TypeError?o.innerHTML='<p class="text-rose-400 text-[11px]">无法连接本地服务，请确认 HealthTrack 正在运行。</p>':o.innerHTML='<p class="text-rose-400 text-[11px]">生成失败：'+j(p.message)+"</p>")}finally{de===d&&(de=null),o.classList.remove("typing-cursor"),x.insightBusy=!1,t&&(t.disabled=!1,t.classList.remove("opacity-60"),t.innerText="✨ 生成小结洞察")}}async function Eo(){if(!await W("清除这一天的小结洞察？清除后可重新生成。",{title:"清除洞察",confirmText:"清除"}))return;const t=x.date||le();try{const s=await(await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(t)}`,{method:"DELETE"})).json();if(s.code!==200)throw new Error(s.message||"清除失败");dt(),document.getElementById("insight-panel").classList.add("hidden"),document.getElementById("insight-empty").classList.remove("hidden"),document.getElementById("insight-body").innerHTML="",document.getElementById("think-text").innerText="",document.getElementById("think-body").classList.remove("open"),document.getElementById("think-arrow").classList.remove("rotate-90"),L("已清除该日小结洞察")}catch(n){L("清除失败："+n.message)}}function Io(){const e=document.getElementById("think-body"),t=document.getElementById("think-arrow"),n=!e.classList.contains("open");e.classList.toggle("open",n),t.classList.toggle("rotate-90",n)}async function on(){try{const t=await(await fetch("/api/v1/evening/summaries")).json();if(t.code!==200)throw new Error(t.message||"加载失败");x.summaries=t.data&&t.data.items||[]}catch(e){L("加载往期小结失败："+e.message),x.summaries=[]}x.visible=Math.max(x.visible,Be),Te()}function Bo(){return x.summaries.filter(e=>{if(x.dateFilter!=="all"&&ao(e.record_date)>Number(x.dateFilter)-1)return!1;const t=e.score||0;return!(x.scoreFilter==="high"&&t<9||x.scoreFilter==="good"&&(t<7||t>8)||x.scoreFilter==="mid"&&(t<5||t>6)||x.scoreFilter==="low"&&t>4)})}function To(e,t){const n=Re(it(e.score||0).tone),s=e.photo_id?`<img src="/api/v1/evening/photo/${e.photo_id}" alt="${F(e.record_date)}" onclick="event.stopPropagation(); evoOpenPhoto(this.src, '${F(e.record_date)} 小结图片')" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-50 cursor-zoom-in">`:'<span class="w-14 h-14 rounded-xl shrink-0 border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-300 font-bold">无图</span>',o=(e.done_items||[]).filter(i=>i&&i.trim()),a=o.length?o[0]:"（未填完成事项）",l=[0,1,2].map(i=>{const r=e.done_items&&e.done_items[i]||"";return r&&r.trim()?`<li class="flex items-start space-x-1.5 text-[11px] text-slate-600 leading-relaxed"><span class="text-indigo-400 font-black">·</span><span>${j(r)}</span></li>`:'<li class="flex items-start space-x-1.5 text-[11px] text-slate-300 leading-relaxed"><span class="font-black">·</span><span>未记录</span></li>'}).join("");return`
      <div class="evo-tl-item ev-rise" style="animation-delay:${Math.min(t,7)*40}ms">
        <span class="evo-tl-node"></span><span class="evo-tl-line"></span>
        <div class="evo-swipe" data-date="${e.record_date}">
          <div class="evo-swipe-action">
            <button class="evo-swipe-del" onclick="evAskDelete('${e.record_date}')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              <span>删除</span>
            </button>
          </div>
          <div class="evo-swipe-panel">
            <div class="evo-card overflow-hidden">
              <div class="evo-entry-head p-3 flex items-center space-x-3 cursor-pointer active:bg-slate-50/80 transition-colors">
                ${s}
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-black text-slate-800 tabular-nums">${F(e.record_date)}</span>
                    <span class="text-[10px] text-slate-400">${oo(e.record_date)}</span>
                    <span class="evo-score-chip text-[10px] font-black px-1.5 py-0.5 rounded-full border ${n.chip}" data-score="${e.score}">${e.score} 分</span>
                  </div>
                  <p class="text-[11px] text-slate-400 truncate mt-1">${j(a)}</p>
                </div>
                <span class="evo-entry-arrow text-[9px] text-slate-300 transform transition-transform duration-300">▼</span>
              </div>
              <div class="evo-collapsible">
                <div class="px-3 pb-3 pt-2.5 border-t border-slate-100 space-y-2.5">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <p class="evo-eyebrow">完成事项</p>
                      <button type="button" class="evo-copy-btn" onclick="evCopyEntry('${e.record_date}', event)" aria-label="复制这天的记录">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <span>复制</span>
                      </button>
                    </div>
                    <ol class="space-y-1 evo-selectable">${l}</ol>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-2.5">
                    <p class="evo-eyebrow mb-1">当时的感想</p>
                    <p class="text-[11px] text-slate-500 leading-relaxed evo-selectable">${e.note_text?j(e.note_text):"（未填写）"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`}function Te(){const e=Bo(),t=e.slice(0,x.visible),n=document.getElementById("ev-history-list"),s=document.getElementById("ev-history-empty"),o=document.getElementById("ev-load-more"),a=document.getElementById("ev-load-done"),l=document.getElementById("ev-filter-reset");if(document.getElementById("ev-filter-count").innerText=e.length,document.getElementById("ev-history-total").innerText=x.summaries.length+" 篇",l.classList.toggle("hidden",x.dateFilter==="all"&&x.scoreFilter==="all"),!e.length){n.innerHTML="",s.classList.remove("hidden"),o.classList.add("hidden"),a.classList.add("hidden");return}s.classList.add("hidden");let i="",r="";t.forEach((p,g)=>{const h=It(p.record_date);if(h!==r){const b=e.filter(c=>It(c.record_date)===h).length;i+=`<div class="flex items-center space-x-2 pt-2 pb-3 pl-7">
                     <span class="text-[10px] font-black tracking-wider text-slate-400">${lo(h)}</span>
                     <span class="flex-1 h-px bg-slate-200"></span>
                     <span class="text-[10px] text-slate-400 tabular-nums">${b} 篇</span>
                   </div>`,r=h}i+=To(p,g)}),n.innerHTML=i,_o();const d=e.length-t.length;d>0?(o.classList.remove("hidden"),a.classList.add("hidden"),document.getElementById("ev-remain-count").innerText=d):(o.classList.add("hidden"),a.classList.remove("hidden"))}function Lo(e){document.querySelectorAll("#ev-filter-date .evo-fchip").forEach(t=>t.classList.remove("active")),e.classList.add("active"),x.dateFilter=e.dataset.val,x.visible=Be,Te()}function $o(e){document.querySelectorAll("#ev-filter-score .evo-fchip").forEach(t=>t.classList.remove("active")),e.classList.add("active"),x.scoreFilter=e.dataset.val,x.visible=Be,Te()}function So(){document.querySelectorAll("#ev-filter-date .evo-fchip, #ev-filter-score .evo-fchip").forEach(e=>{e.classList.toggle("active",e.dataset.val==="all")}),x.dateFilter="all",x.scoreFilter="all",x.visible=Be,Te()}function _o(){document.querySelectorAll("#ev-history-list .evo-swipe-panel").forEach(e=>{e.addEventListener("pointerdown",Mo),e.addEventListener("pointermove",jo),e.addEventListener("pointerup",Bt),e.addEventListener("pointercancel",Bt)})}function Mo(e){const t=e.currentTarget,n=t.closest(".evo-swipe");if(!n||n.classList.contains("removing")||e.pointerType==="mouse"&&e.button!==0)return;const s=window.getSelection&&window.getSelection();s&&!s.isCollapsed&&s.anchorNode&&t.contains(s.anchorNode)||(an(n),te.drag={panel:t,swipe:n,id:e.pointerId,x0:e.clientX,y0:e.clientY,axis:null,base:n.classList.contains("open")?-84:0,off:0})}function jo(e){const t=te.drag;if(!t||e.pointerId!==t.id)return;const n=e.clientX-t.x0,s=e.clientY-t.y0;if(!t.axis){if(Math.abs(n)<6&&Math.abs(s)<6)return;if(t.axis=Math.abs(n)>Math.abs(s)?"x":"y",t.axis==="x"){t.panel.classList.add("dragging");try{t.panel.setPointerCapture(e.pointerId)}catch{}}}if(t.axis!=="x")return;let o=t.base+n;o>0?o*=.28:o<-84&&(o=-84-(Math.abs(o)-te.W)*.25),t.off=o,t.panel.style.transform="translateX("+o+"px)",e.cancelable&&e.preventDefault()}function Bt(e){const t=te.drag;if(!t||e.pointerId!==t.id)return;const n=t.panel,s=t.swipe;n.classList.remove("dragging"),n.style.transform="",t.axis==="x"&&(s.classList.toggle("open",t.off<-42),te.suppressClick=Date.now()),te.drag=null}function an(e){document.querySelectorAll("#ev-history-list .evo-swipe.open").forEach(t=>{t!==e&&t.classList.remove("open")})}function Co(){var e;(e=document.getElementById("ev-history-list"))==null||e.addEventListener("click",t=>{const n=t.target.closest(".evo-entry-head");if(!n||Date.now()-te.suppressClick<320)return;const s=n.closest(".evo-swipe");if(s&&s.classList.contains("open")){s.classList.remove("open");return}an();const a=n.parentElement.querySelector(".evo-collapsible"),l=n.querySelector(".evo-entry-arrow"),i=!a.classList.contains("open");a.classList.toggle("open",i),l&&(l.style.transform=i?"rotate(180deg)":"rotate(0deg)")})}async function Do(e){const t=x.summaries.find(a=>a.record_date===e),n=await W(`${F(e)}${t?" · "+t.score+" 分":""}，删除后不可恢复。`,{title:"删除这篇小结？",confirmText:"删除"}),s=document.querySelector(`.evo-swipe[data-date="${e}"]`);if(!n){s&&s.classList.remove("open");return}try{const l=await(await fetch(`/api/v1/evening/summary/${encodeURIComponent(e)}`,{method:"DELETE"})).json();if(l.code!==200)throw new Error(l.message||"删除失败")}catch(a){L("删除失败："+a.message),s&&s.classList.remove("open");return}const o=()=>{x.summaries=x.summaries.filter(a=>a.record_date!==e),Te(),x.date===e&&(x.date=le(),document.getElementById("summary-date").value=x.date,Ne())};s?(s.classList.add("removing"),setTimeout(()=>{o(),L("已删除 "+F(e)+" 的小结")},260)):(o(),L("已删除 "+F(e)+" 的小结"))}window.loadEveningTab=Je;window.evSetToday=co;window.evOnDateChange=po;window.evUpdateDoneCount=Xt;window.evoOpenPhoto=uo;window.evOnPhotoPick=mo;window.evRemovePhoto=fo;window.evUpdateScore=Ye;window.evToggleBandEditor=go;window.evResetBands=bo;window.evSaveBands=ho;window.evSave=tn;window.evoSubmit=tn;window.evSetInsightRange=vo;window.evGenerateInsight=sn;window.evoGenerateInsight=sn;window.evResetInsight=Eo;window.evToggleThinking=Io;window.evSetDateFilter=Lo;window.evSetScoreFilter=$o;window.evResetFilters=So;window.evAskDelete=Do;function Ke(e){ce.set({currentTab:e}),["log","dash","trend","trend-detail","insight","history","compare","evening"].forEach(s=>{const o=document.getElementById(`view-${s}`);o&&(s===e?o.classList.remove("hidden"):o.classList.add("hidden"))});const n=document.getElementById("save-bar");n&&n.classList.toggle("hidden",e!=="log"),e==="dash"?ds():e==="insight"?js():e==="evening"&&so()}window.switchTab=Ke;document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("app-frame"),t=document.getElementById("main-content");ln(),rn(e),un(e,n=>Ke(n)),mn(document.body),vn(document.body),En(document.body),ns(t),is(t),Ms(t),no(t),Ke("log")});
