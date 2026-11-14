(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();function Je(){let e=document.getElementById("toast");e||(e=document.createElement("div"),e.id="toast",e.className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 opacity-0 pointer-events-none -translate-y-4",e.innerHTML=`
      <div id="toast-body" class="bg-neutral-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-xs font-mono font-medium">
        <span id="toast-icon">✓</span>
        <span id="toast-msg">操作成功</span>
      </div>
    `,document.body.appendChild(e))}function S(e,t=!0){const n=document.getElementById("toast"),s=document.getElementById("toast-icon"),a=document.getElementById("toast-msg");!n||!s||!a||(s.innerText=t?"✓":"✕",a.innerText=e,n.classList.remove("opacity-0","-translate-y-4","pointer-events-none"),n.classList.add("opacity-100","translate-y-0"),setTimeout(()=>{n.classList.remove("opacity-100","translate-y-0"),n.classList.add("opacity-0","-translate-y-4","pointer-events-none")},2200))}window.showToast=S;function Ye(e){var n,s;e.insertAdjacentHTML("afterbegin",`
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
  `),(n=document.getElementById("btn-open-settings"))==null||n.addEventListener("click",()=>{typeof window.openSettings=="function"&&window.openSettings()}),(s=document.getElementById("btn-open-data"))==null||s.addEventListener("click",()=>{typeof window.openDataSheet=="function"&&window.openDataSheet()})}function j(e){const t=e instanceof Date?e:new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function Ke(e,t){if(!e||!t)return{duration:0,bedMinutes:0};const[n,s]=e.split(":").map(Number),[a,o]=t.split(":").map(Number);let l=n*60+s,r=a*60+o;return r<=l&&(r+=1440),{duration:Number(((r-l)/60).toFixed(1)),bedMinutes:l}}class Ze{constructor(){this._state={currentTab:"log",currentDate:j(new Date),isDirty:!1,hasSavedRecord:!1,dashRange:7,sleepThresholds:{green:"23:30",yellow:"01:00"}},this._listeners=new Set}get state(){return this._state}set(t){const n={...this._state};this._state={...this._state,...t},this._notify(this._state,n)}subscribe(t){return this._listeners.add(t),()=>this._listeners.delete(t)}_notify(t,n){this._listeners.forEach(s=>{try{s(t,n)}catch(a){console.error("State subscriber error:",a)}})}}const Q=new Ze;function Xe(e,t){e.insertAdjacentHTML("beforeend",`
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
  `);const s=document.getElementById("bottom-nav");s==null||s.addEventListener("click",a=>{const o=a.target.closest("button[data-tab]");if(!o)return;const l=o.getAttribute("data-tab");typeof t=="function"&&t(l)}),Q.subscribe(a=>{const o=a.currentTab,l=o==="history"||o==="compare"?"insight":o==="trend"||o==="trend-detail"?"dash":o;["log","dash","insight","evening"].forEach(r=>{const c=document.getElementById(`tab-${r}`);c&&(r===l?(c.classList.add("active","text-neutral-900"),c.classList.remove("text-neutral-400")):(c.classList.remove("active","text-neutral-900"),c.classList.add("text-neutral-400")))})})}const Se="";async function I(e,t={}){const n=`${Se}${e}`,s=await fetch(n,{headers:{"Content-Type":"application/json",...t.headers},...t});if(!s.ok){let o=`HTTP Error ${s.status}`;try{const l=await s.json();o=l.message||l.error||o}catch{}throw new Error(o)}const a=s.headers.get("content-type");return a&&a.includes("application/json")?await s.json():await s.text()}const P={getRecordByDate:e=>I(`/api/v1/records/by-date?date=${encodeURIComponent(e)}`),saveRecord:e=>I("/api/v1/records",{method:"POST",body:JSON.stringify(e)}),getHistoryRecords:(e,t)=>I(`/api/v1/records/history?start=${encodeURIComponent(e)}&end=${encodeURIComponent(t)}`),getConfig:()=>I("/api/config"),saveConfig:e=>I("/api/config",{method:"POST",body:JSON.stringify(e)}),testAIConfig:e=>I("/api/config/test",{method:"POST",body:JSON.stringify(e)}),getSleepThresholds:()=>I("/api/config/sleep-thresholds"),saveSleepThresholds:e=>I("/api/config/sleep-thresholds",{method:"POST",body:JSON.stringify(e)}),checkInsightPeriod:(e,t)=>I(`/api/v1/insights/period?days=${e}&end_date=${encodeURIComponent(t)}`),getInsightHistory:(e={})=>{const t=new URLSearchParams(e).toString();return I(`/api/v1/insights${t?"?"+t:""}`)},deleteInsight:e=>I(`/api/v1/insights/${e}`,{method:"DELETE"}),getEveningSummary:e=>I(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`),saveEveningSummary:e=>I("/api/v1/evening/summary",{method:"POST",body:JSON.stringify(e)}),deleteEveningSummary:e=>I(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`,{method:"DELETE"}),uploadPhoto:async e=>{const t=await fetch(`${Se}/api/v1/evening/photo`,{method:"POST",body:e});if(!t.ok)throw new Error("上传图片失败");return await t.json()},deletePhoto:e=>I(`/api/v1/evening/photo/${e}`,{method:"DELETE"})};function Qe(e){var l,r,c;e.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("settings-modal"),s=document.getElementById("btn-close-settings"),a=document.getElementById("toggle-api-key"),o=document.getElementById("setting-api-key");n==null||n.addEventListener("click",x=>{x.target===n&&Z()}),s==null||s.addEventListener("click",Z),a==null||a.addEventListener("click",()=>{o.type==="password"?(o.type="text",a.innerText="隐藏"):(o.type="password",a.innerText="显示")}),(l=document.getElementById("save-config-btn"))==null||l.addEventListener("click",nt),(r=document.getElementById("test-config-btn"))==null||r.addEventListener("click",st),(c=document.getElementById("save-sleep-btn"))==null||c.addEventListener("click",at)}function et(){const e=document.getElementById("settings-modal");e&&(e.classList.remove("hidden"),tt())}function Z(){const e=document.getElementById("settings-modal");e==null||e.classList.add("hidden")}async function tt(){try{const e=await P.getConfig(),t=document.getElementById("setting-base-url"),n=document.getElementById("setting-model"),s=document.getElementById("api-key-status");t&&(t.value=e.base_url||""),n&&(n.value=e.model||""),s&&(s.innerText=e.has_api_key?"✓ 当前已配置有效 API Key":"⚠️ 尚未配置 API Key");const a=await P.getSleepThresholds(),o=document.getElementById("setting-sleep-green"),l=document.getElementById("setting-sleep-yellow");o&&(o.value=a.green||"23:30"),l&&(l.value=a.yellow||"01:00")}catch(e){S("读取设置失败: "+e.message,!1)}}async function nt(){const e=document.getElementById("setting-base-url"),t=document.getElementById("setting-model"),n=document.getElementById("setting-api-key"),s={base_url:(e==null?void 0:e.value.trim())||"",model:(t==null?void 0:t.value.trim())||""};n&&n.value.trim()&&(s.api_key=n.value.trim());try{await P.saveConfig(s),S("AI 配置已更新"),Z()}catch(a){S("保存失败: "+a.message,!1)}}async function st(){const e=document.getElementById("setting-base-url"),t=document.getElementById("setting-model"),n=document.getElementById("setting-api-key"),s=document.getElementById("settings-feedback"),a={base_url:(e==null?void 0:e.value.trim())||"",model:(t==null?void 0:t.value.trim())||""};n&&n.value.trim()&&(a.api_key=n.value.trim()),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 text-neutral-600 block",s.innerText="正在测试连接中…");try{await P.testAIConfig(a),s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-900 text-white block",s.innerText="✓ 测试连接成功！")}catch(o){s&&(s.className="text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 block",s.innerText="✕ 测试连接失败: "+o.message)}}async function at(){const e=document.getElementById("setting-sleep-green"),t=document.getElementById("setting-sleep-yellow");try{await P.saveSleepThresholds({green:(e==null?void 0:e.value)||"23:30",yellow:(t==null?void 0:t.value)||"01:00"}),S("熬夜阈值已保存")}catch(n){S("保存阈值失败: "+n.message,!1)}}window.openSettings=et;window.closeSettings=Z;function ot(e){var a,o,l,r,c;e.insertAdjacentHTML("beforeend",`
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
  `);const n=document.getElementById("data-sheet"),s=document.getElementById("btn-close-datasheet");n==null||n.addEventListener("click",x=>{x.target===n&&R()}),s==null||s.addEventListener("click",R),(a=document.getElementById("btn-open-file-import"))==null||a.addEventListener("click",()=>{R(),typeof window.openImportModal=="function"&&window.openImportModal()}),(o=document.getElementById("btn-open-memo-import"))==null||o.addEventListener("click",()=>{R(),typeof window.openMemoImportModal=="function"&&window.openMemoImportModal()}),(l=document.getElementById("btn-open-batches"))==null||l.addEventListener("click",()=>{R(),typeof window.openImportBatchesModal=="function"&&window.openImportBatchesModal()}),(r=document.getElementById("btn-dl-template"))==null||r.addEventListener("click",()=>{window.location.href="/api/v1/import/template"}),(c=document.getElementById("btn-open-export"))==null||c.addEventListener("click",()=>{R(),typeof window.openExportModal=="function"&&window.openExportModal()})}function lt(){var e;(e=document.getElementById("data-sheet"))==null||e.classList.remove("hidden")}function R(){var e;(e=document.getElementById("data-sheet"))==null||e.classList.add("hidden")}window.openDataSheet=lt;window.closeDataSheet=R;const it=`    <!-- 导出数据弹窗：Excel 表格与 JSON 完整备份两种方式 -->
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

    <!-- 核心内容切换区 -->`;let ve=0;function rt(e){e.insertAdjacentHTML("beforeend",it)}function dt(e){const n=document.getElementById("export-start-btn");n&&(n.disabled=e,n.classList.toggle("opacity-50",e),n.textContent="开始导出")}function ye(e,t){const n=document.getElementById("export-result");if(n.classList.remove("hidden"),e){const s=t.size!=null?`（${ct(t.size)}）`:"",a=window.HealthTrack?'<button onclick="window.HealthTrack.openDownloads()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>':'<button onclick="exportCurrent()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';n.className="text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700",n.innerHTML=`文件已保存：<span class="font-bold break-all">${t.filename}</span>${s}<br>位置：${t.location}<div>${a}</div>`}else n.className="text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600",n.textContent=t.message}function ct(e){return e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/1024/1024).toFixed(2)+" MB"}window.onExportResult=function(e){dt(!1);const t=e&&e.size!=null?e.size:ve;ve=null;const n=document.getElementById("export-modal"),s=n&&!n.classList.contains("hidden");e&&e.ok?(s&&ye(!0,{filename:e.filename,size:t,location:e.location||"下载目录 Download/"}),S(e.filename?"已保存："+e.filename:"导出成功",!0)):(s&&ye(!1,{message:"导出失败："+(e&&e.message||"未知错误")}),S("导出失败："+(e&&e.message||"未知错误"),!1))};window.appConfirm=appConfirm;window.openExportModal=openExportModal;window.closeExportModal=closeExportModal;window.openImportModal=openImportModal;window.closeImportModal=closeImportModal;window.openMemoImportModal=openMemoImportModal;window.closeMemoImportModal=closeMemoImportModal;window.openImportBatchesModal=openImportBatchesModal;window.closeImportBatchesModal=closeImportBatchesModal;window.evoClosePhoto=function(){var e;(e=document.getElementById("ev-photo-viewer"))==null||e.classList.add("hidden")};const pt=`<!-- 1. 记一笔 (Log View) 模块模板 -->
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
`;let y={date:j(new Date),morningLight:null,steps:null,prevSteps:null,isDirty:!1,hasRecord:!1},A={types:[]};function ut(e){e.insertAdjacentHTML("beforeend",pt),xt(),J(y.date)}function xt(){var n,s,a,o,l,r,c,x,u,b,g;const e=document.getElementById("input-date");e&&(e.value=y.date,e.addEventListener("change",m=>{J(m.target.value)})),(n=document.getElementById("btn-today-date"))==null||n.addEventListener("click",()=>{const m=j(new Date);e&&(e.value=m),J(m)}),(s=document.getElementById("morningLightPills"))==null||s.addEventListener("click",m=>{const i=m.target.closest("button[data-val]");if(!i)return;const h=i.getAttribute("data-val");y.morningLight=y.morningLight===h?null:h,_e(),_()});const t=document.getElementById("input-steps");t==null||t.addEventListener("input",m=>{const i=Number(m.target.value);y.steps=isNaN(i)?null:Math.max(0,Math.min(2e4,Math.round(i/500)*500)),ae(),_()}),(a=document.getElementById("btn-clear-steps"))==null||a.addEventListener("click",()=>{y.steps=null,ae(),_()}),["input-weight-pm","input-weight-am","input-waist","sleepDuration"].forEach(m=>{var i;(i=document.getElementById(m))==null||i.addEventListener("input",()=>{Ce(),_()})}),["sleepBedTime","sleepWakeTime"].forEach(m=>{var i;(i=document.getElementById(m))==null||i.addEventListener("input",()=>{je(),_()})}),(o=document.getElementById("lunch-toggle"))==null||o.addEventListener("click",()=>{const m=document.getElementById("lunch-body"),i=document.getElementById("lunch-icon");m==null||m.classList.toggle("hidden"),i==null||i.classList.toggle("rotate-180")}),(l=document.getElementById("biohack-toggle"))==null||l.addEventListener("click",()=>{const m=document.getElementById("biohackBody"),i=document.getElementById("accordionIcon");m==null||m.classList.toggle("hidden"),i==null||i.classList.toggle("rotate-180")}),(r=document.getElementById("exerciseTypePills"))==null||r.addEventListener("click",m=>{const i=m.target.closest("button[data-val]");if(!i)return;const h=i.getAttribute("data-val");mt(h),_()}),(c=document.getElementById("concertaEnabled"))==null||c.addEventListener("change",m=>{var i;(i=document.getElementById("concertaSubForm"))==null||i.classList.toggle("hidden",!m.target.checked),_()}),(x=document.getElementById("coldShowerEnabled"))==null||x.addEventListener("change",m=>{var i;(i=document.getElementById("coldShowerSubForm"))==null||i.classList.toggle("hidden",!m.target.checked),_()}),(u=document.getElementById("btn-save-log"))==null||u.addEventListener("click",bt),(b=document.getElementById("btn-reset-log"))==null||b.addEventListener("click",()=>J(y.date)),(g=document.getElementById("input-journal"))==null||g.addEventListener("input",_)}async function J(e){y.date=e,Q.set({currentDate:e}),pe(!1);try{const t=await P.getRecordByDate(e),n=t.record||{};y.hasRecord=!!t.record;const s=document.getElementById("input-weight-am"),a=document.getElementById("input-weight-pm"),o=document.getElementById("input-waist"),l=document.getElementById("input-journal");s&&(s.value=n.weight_am!==null&&n.weight_am!==void 0?n.weight_am:""),a&&(a.value=n.weight_pm!==null&&n.weight_pm!==void 0?n.weight_pm:""),o&&(o.value=n.waist_size!==null&&n.waist_size!==void 0?n.waist_size:""),l&&(l.value=n.journal||""),y.morningLight=n.morning_light===!0?"yes":n.morning_light===!1?"no":null,_e(),y.steps=n.steps!==null&&n.steps!==void 0?Number(n.steps):null,ae();const r=document.getElementById("sleepBedTime"),c=document.getElementById("sleepWakeTime"),x=document.getElementById("sleepDuration");r&&(r.value=n.sleep_start_time||n.sleep_bed_time||"00:30"),c&&(c.value=n.sleep_end_time||n.sleep_wake_time||"07:15"),x&&(x.value=n.sleep_hours!==null&&n.sleep_hours!==void 0?n.sleep_hours:"6.8"),je(),Ce(),De()}catch(t){console.error("加载记录失败:",t)}}function _e(){document.querySelectorAll("#morningLightPills button").forEach(e=>{e.classList.toggle("active",e.getAttribute("data-val")===y.morningLight)})}function ae(){const e=document.getElementById("steps-value"),t=document.getElementById("input-steps"),n=document.getElementById("steps-hint");e&&(e.innerText=y.steps===null?"--":y.steps.toLocaleString("en-US")),t&&(t.value=y.steps===null?0:y.steps),n&&(n.innerText=y.steps===null?"留空 = 断点（不补 0）":`已设定 ${y.steps.toLocaleString("en-US")} 步`)}function je(){var a,o;const e=(a=document.getElementById("sleepBedTime"))==null?void 0:a.value,t=(o=document.getElementById("sleepWakeTime"))==null?void 0:o.value;if(!e||!t)return;const{duration:n}=Ke(e,t),s=document.getElementById("sleepDuration");s&&document.activeElement!==s&&(s.value=n)}function Ce(){var s,a;const e=parseFloat((s=document.getElementById("input-weight-am"))==null?void 0:s.value),t=parseFloat((a=document.getElementById("input-weight-pm"))==null?void 0:a.value),n=document.getElementById("diff-weight-pm");if(n)if(!isNaN(t)&&!isNaN(e)){const o=(t-e).toFixed(1);n.innerHTML=`<span>较晨重 ${o>=0?"+":""}${o}kg</span><span class="text-neutral-400">已测</span>`}else n.innerHTML='<span>等待今晚称重</span><span class="text-neutral-300">--:--</span>'}function mt(e){var t;if(e==="none")A.types=[];else{const n=A.types.indexOf(e);n>=0?A.types.splice(n,1):A.types.push(e)}document.querySelectorAll("#exerciseTypePills button").forEach(n=>{const s=n.getAttribute("data-val");s==="none"?n.classList.toggle("active",A.types.length===0):n.classList.toggle("active",A.types.includes(s))}),(t=document.getElementById("exerciseSubForm"))==null||t.classList.toggle("hidden",A.types.length===0)}function De(){var n,s,a,o;let e=0;(n=document.getElementById("input-weight-am"))!=null&&n.value&&e++,(s=document.getElementById("input-weight-pm"))!=null&&s.value&&e++,(a=document.getElementById("input-waist"))!=null&&a.value&&e++,y.morningLight!==null&&e++,y.steps!==null&&e++,(o=document.getElementById("input-journal"))!=null&&o.value&&e++;const t=document.getElementById("log-count");t&&(t.innerText=`${e}/6`)}function _(){pe(!0),De()}function pe(e){y.isDirty=e,Q.set({isDirty:e});const t=document.getElementById("save-dot"),n=document.getElementById("save-text");t&&n&&(e?(t.className="w-2 h-2 rounded-full bg-neutral-900",n.innerText="有未保存改动"):(t.className="w-2 h-2 rounded-full bg-neutral-300",n.innerText="已同步落库"))}async function bt(){var o,l,r,c,x,u,b;const e=parseFloat((o=document.getElementById("input-weight-am"))==null?void 0:o.value),t=parseFloat((l=document.getElementById("input-weight-pm"))==null?void 0:l.value),n=parseFloat((r=document.getElementById("input-waist"))==null?void 0:r.value),s=parseFloat((c=document.getElementById("sleepDuration"))==null?void 0:c.value),a={record_date:y.date,weight_am:isNaN(e)?null:e,weight_pm:isNaN(t)?null:t,waist_size:isNaN(n)?null:n,sleep_hours:isNaN(s)?null:s,sleep_start_time:((x=document.getElementById("sleepBedTime"))==null?void 0:x.value)||null,sleep_end_time:((u=document.getElementById("sleepWakeTime"))==null?void 0:u.value)||null,morning_light:y.morningLight==="yes"?!0:y.morningLight==="no"?!1:null,steps:y.steps,journal:((b=document.getElementById("input-journal"))==null?void 0:b.value)||""};try{await P.saveRecord(a),pe(!1),S("记录已保存")}catch(g){S("保存失败: "+g.message,!1)}}const ft=`      <section id="view-dash" class="fade-in space-y-4 hidden">
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

      <!-- 3. AI 洞察页 (Insight View) -->`;function gt(e){e.insertAdjacentHTML("beforeend",ft),ht()}function ht(){var e,t,n;(e=document.getElementById("btn-range-7"))==null||e.addEventListener("click",()=>Y(7)),(t=document.getElementById("btn-range-30"))==null||t.addEventListener("click",()=>Y(30)),(n=document.getElementById("btn-range-60"))==null||n.addEventListener("click",()=>Y(60))}function vt(){He(dashRange)}function Y(e){dashRange=e,["7","30","60"].forEach(t=>{const n=document.getElementById("btn-range-"+t);n&&(n.className=Number(t)===e?"px-3 py-1 rounded-md bg-white border border-neutral-200 text-neutral-900 font-mono font-medium shadow-sm transition-all":"px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-900 font-mono font-medium transition-all")}),He(e)}async function He(e){const t=new Date,n=new Date;n.setDate(t.getDate()-(e-1));const s=n.toISOString().split("T")[0],a=t.toISOString().split("T")[0],l=await(await fetch(`/api/v1/records/history?start_date=${s}&end_date=${a}`)).json();if(l.code!==200)return;const r=l.data||[];yt(r)}function yt(e){const t=e.map(d=>d.record_date.slice(5)),n=e.map(d=>d.weight_am),s=e.map(d=>d.weight_pm),a=e.map(d=>d.waist_size),o=e.map(d=>d.sleep_hours),l=e.map(d=>d.sleep_tag==="RED"?"#d4d4d4":d.sleep_tag==="YELLOW"?"#737373":"#171717"),r=n.filter(d=>d!=null);if(r.length>0){const d=r[r.length-1];document.getElementById("dash-weight-stat").innerText=`${d} kg`}else document.getElementById("dash-weight-stat").innerText="--";const c=o.filter(d=>d!=null);if(c.length>0){const d=(c.reduce((v,f)=>v+f,0)/c.length).toFixed(1);document.getElementById("dash-sleep-stat").innerText=`${d} 小时 (均值)`}else document.getElementById("dash-sleep-stat").innerText="--";const x=document.getElementById("dash-weight-detail");x.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日晨重 / 睡前重</span>';const u=document.getElementById("chart-weight").getContext("2d");weightChart&&weightChart.destroy();const b=u.createLinearGradient(0,0,0,160);b.addColorStop(0,"rgba(0, 0, 0, 0.04)"),b.addColorStop(1,"rgba(0, 0, 0, 0.00)");const g=u.createLinearGradient(0,0,0,160);g.addColorStop(0,"rgba(0, 0, 0, 0.02)"),g.addColorStop(1,"rgba(0, 0, 0, 0.00)"),weightChart=new Chart(u,{type:"line",data:{labels:t,datasets:[{label:"晨起体重",data:n,borderColor:"#171717",borderWidth:2.2,backgroundColor:b,fill:!0,tension:.35,spanGaps:!0,pointBackgroundColor:"#ffffff",pointBorderColor:"#171717",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16},{label:"睡前体重",data:s,borderColor:"#f59e0b",borderWidth:2,backgroundColor:g,fill:!0,tension:.35,spanGaps:!0,pointBackgroundColor:"#ffffff",pointBorderColor:"#f59e0b",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(d,v)=>{if(!v||!v.length)return;const f=e[v[0].index];if(!f)return;const B=C=>C==null?"--":`${C} kg`,$=f.weight_am,q=f.weight_pm;let he="";if($!=null&&q!==null&&q!==void 0){const C=Math.round((q-$)*10)/10;let W;C<.3?W="偏低，可能高钠储水":C<.4?W="偏低":C<=.9?W="正常":W="偏高",he=` · 夜间排水 <b class="text-slate-700">${C.toFixed(1)} kg</b>（${W}）`}x.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${f.record_date}</b>　晨起 ${B($)} · 睡前 ${B(q)}${he}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const m=a.filter(d=>d!=null);m.length>0?document.getElementById("dash-waist-stat").innerText=`${m[m.length-1]} cm`:document.getElementById("dash-waist-stat").innerText="--";const i=document.getElementById("dash-waist-detail");i.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>';const h=document.getElementById("chart-waist").getContext("2d");waistChart&&waistChart.destroy();const w=h.createLinearGradient(0,0,0,160);w.addColorStop(0,"rgba(0, 0, 0, 0.03)"),w.addColorStop(1,"rgba(0, 0, 0, 0.00)"),waistChart=new Chart(h,{type:"line",data:{labels:t,datasets:[{label:"腰围",data:a,borderColor:"#525252",borderWidth:2.2,backgroundColor:w,fill:!0,tension:.35,spanGaps:!0,pointBackgroundColor:"#ffffff",pointBorderColor:"#525252",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onClick:(d,v)=>{if(!v||!v.length)return;const f=e[v[0].index];if(!f)return;const B=f.waist_size===null||f.waist_size===void 0?"--":`${f.waist_size} cm`;i.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${f.record_date}</b>　腰围 ${B}</span>`},scales:{y:{beginAtZero:!1,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const k=document.getElementById("dash-sleep-detail");k.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>';const T=document.getElementById("chart-sleep").getContext("2d");sleepChart&&sleepChart.destroy(),sleepChart=new Chart(T,{type:"bar",data:{labels:t,datasets:[{data:o,backgroundColor:l,borderRadius:8,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},onHover:(d,v)=>{d.native.target.style.cursor=v.length?"pointer":"default"},onClick:(d,v)=>{if(!v||!v.length)return;const f=e[v[0].index];if(!f)return;const B=f.sleep_tag==="RED"?"熬夜":f.sleep_tag==="YELLOW"?"轻度":"正常",$=f.sleep_hours===null||f.sleep_hours===void 0?"--":`${f.sleep_hours} 小时`;k.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${f.record_date}</b>　就寝 ${f.sleep_start_time||"--"} · 起床 ${f.sleep_end_time||"--"} · ${$} · ${B}</span>`},scales:{y:{beginAtZero:!0,max:12,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#a3a3a3"}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const M=e.map(d=>d.steps===null||d.steps===void 0?null:Number(d.steps)),H=M.filter(d=>d!==null);if(H.length>0){const d=Math.round(H.reduce((v,f)=>v+f,0)/H.length);document.getElementById("dash-steps-stat").innerText=`${d.toLocaleString("en-US")} 步 (均值)`}else document.getElementById("dash-steps-stat").innerText="--";const fe=document.getElementById("dash-steps-detail");fe.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>';const ge=document.getElementById("chart-steps").getContext("2d");stepsChart&&stepsChart.destroy();const ee=ge.createLinearGradient(0,0,0,160);ee.addColorStop(0,"rgba(14, 165, 233, 0.18)"),ee.addColorStop(1,"rgba(14, 165, 233, 0.00)"),stepsChart=new Chart(ge,{type:"line",data:{labels:t,datasets:[{label:"步数",data:M,borderColor:"#737373",borderWidth:2.2,backgroundColor:ee,fill:!0,tension:.35,spanGaps:!1,pointBackgroundColor:"#ffffff",pointBorderColor:"#737373",pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5.5,pointHitRadius:16}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1}},onHover:(d,v)=>{d.native.target.style.cursor=v.length?"pointer":"default"},onClick:(d,v)=>{if(!v||!v.length)return;const f=e[v[0].index];if(!f)return;const B=f.steps===null||f.steps===void 0?"--":`${Number(f.steps).toLocaleString("en-US")} 步`,$=f.morning_light===!0?" · 已见晨光":"";fe.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${f.record_date}</b>　步数 ${B}${$}</span>`},scales:{y:{beginAtZero:!0,max:2e4,grid:{color:"#f5f5f5"},ticks:{font:{size:10},color:"#94a3b8",stepSize:5e3,callback:d=>d===0?"0":`${d/1e4}万`}},x:{grid:{display:!1},ticks:{font:{size:10},color:"#a3a3a3"}}}}});const te=document.getElementById("dash-activities-list");te.innerHTML="",e.length===0?te.innerHTML='<p class="text-slate-400 text-center py-2">暂无记录</p>':e.slice().reverse().forEach(d=>{const v=exerciseTypesOf(d.exercise);if(d.journal_text||d.activity_tags||v.length>0||d.concerta&&d.concerta.taken||d.cold_shower&&d.cold_shower.enabled){let f="";if(d.activity_tags)try{const B=JSON.parse(d.activity_tags);f+=B.map($=>`<span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">${$}</span>`).join("")}catch{}if(v.length>0&&(f+=`<span class="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">${v.join(" + ")}</span>`),d.concerta&&d.concerta.taken&&(f+=`<span class="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">专注达 ${d.concerta.dose}mg</span>`),d.cold_shower&&d.cold_shower.enabled){const B=d.cold_shower.water_temp===null||d.cold_shower.water_temp===void 0?"":` ${d.cold_shower.water_temp}℃`;f+=`<span class="bg-cyan-50 text-cyan-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">冷水澡 ${B}</span>`}te.innerHTML+=`
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-800">${d.record_date}</span>
                  <div>${f}</div>
                </div>
                <p class="text-slate-600 line-clamp-2">${d.journal_text||"无文字备注"}</p>
              </div>
            `}})}const wt=12,kt={weight:{label:"体重周均值 (kg)",field:"weight_am",unit:"kg",color:"#171717",band:"rgba(0, 0, 0, 0.06)"},waist:{label:"腰围周均值 (cm)",field:"waist_size",unit:"cm",color:"#525252",band:"rgba(0, 0, 0, 0.04)"},sleep:{label:"睡眠周均值 (小时)",field:"sleep_hours",unit:"小时",color:"#10b981",band:"rgba(16, 185, 129, 0.13)"},steps:{label:"步数周均值 (步)",field:"steps",unit:"步",color:"#737373",band:"rgba(0, 0, 0, 0.04)",int:!0}};let O={metric:"weight",records:[],buckets:[],aggs:[]},ne=null;function Et(e){const t=new Date(e.getFullYear(),e.getMonth(),e.getDate());return t.setDate(t.getDate()-(t.getDay()+6)%7),t}function It(){const e=Et(new Date),t=[];for(let n=wt-1;n>=0;n--){const s=new Date(e);s.setDate(e.getDate()-n*7);const a=new Date(s);a.setDate(s.getDate()+6),t.push({start:j(s),end:j(a)})}return t}function Bt(e,t,n){return t.map(s=>{const a=[];return e.forEach(l=>{if(l.record_date>=s.start&&l.record_date<=s.end){const r=l[n];r!=null&&r!==""&&!isNaN(Number(r))&&a.push(Number(r))}}),a.length===0?{avg:null,min:null,max:null,n:0}:{avg:a.reduce((l,r)=>l+r,0)/a.length,min:Math.min(...a),max:Math.max(...a),n:a.length}})}function Tt(){Ae(O.metric),switchTab("trend")}function Ae(e){O.metric=e,["weight","waist","sleep","steps"].forEach(t=>{const n=document.getElementById(`trend-tab-${t}`);n&&(n.className=t===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),currentTab==="trend"&&Lt()}function Lt(){const e=kt[O.metric],t=i=>e.int?Math.round(i).toLocaleString("en-US"):i.toFixed(1),n=It(),s=Bt(O.records,n,e.field);O.buckets=n,O.aggs=s;const a=n.map(i=>i.start.slice(5)),o=s.map(i=>i.max),l=s.map(i=>i.min),r=s.map(i=>i.avg),c=s.map(i=>i.n>=1&&i.n<=3);document.getElementById("trend-metric-label").innerText=e.label;const x=document.getElementById("trend-metric-stat"),u=document.getElementById("trend-metric-note");let b=-1;for(let i=s.length-1;i>=0;i--)if(s[i].n>0){b=i;break}if(b>=0){const i=s[b],h=n[b];x.innerText=`${t(i.avg)} ${e.unit}`,u.innerHTML=`${h.start.slice(5)}~${h.end.slice(5)} 周均值<br>${i.n} 天数据${i.n<=3?"（低置信）":""}`}else x.innerText="--",u.innerHTML="近 12 周暂无数据";const g=document.getElementById("trend-detail");g.innerHTML=b>=0?'<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>':"<span>ℹ️</span><span>近 12 周暂无该指标数据，记录几天后再来看看</span>";const m=document.getElementById("chart-trend").getContext("2d");ne&&ne.destroy(),ne=new Chart(m,{type:"line",data:{labels:a,datasets:[{label:"周内最大",data:o,borderColor:"transparent",backgroundColor:e.band,pointRadius:0,pointHoverRadius:0,fill:{target:1},spanGaps:!1,tension:.25},{label:"周内最小",data:l,borderColor:"transparent",backgroundColor:"transparent",pointRadius:0,pointHoverRadius:0,spanGaps:!1,tension:.25},{label:"周均值",data:r,borderColor:e.color,backgroundColor:e.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:i=>c[i.dataIndex]?4:3,pointBackgroundColor:i=>c[i.dataIndex]?"#ffffff":e.color,pointBorderColor:e.color,pointBorderWidth:i=>c[i.dataIndex]?2:0,segment:{borderDash:i=>c[i.p1DataIndex]||c[i.p0DataIndex]?[5,4]:void 0}}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{filter:i=>i.datasetIndex===2,displayColors:!1,callbacks:{title:i=>{const h=n[i[0].dataIndex];return`${h.start} ~ ${h.end}`},label:i=>{const h=s[i.dataIndex];return!h||h.n===0?"该周无数据":[`周均值：${t(h.avg)} ${e.unit}`,`区间：${t(h.min)} ~ ${t(h.max)}`,`样本：${h.n} 天${h.n<=3?"（低置信）":""}`]}}}},scales:{y:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:6}}},onClick:(i,h)=>{let w=-1;if((h||[]).forEach(M=>{M.datasetIndex===2&&(w=M.index)}),w<0)return;const k=s[w],T=n[w];!k||k.n===0||(g.innerHTML=`<span class="font-mono text-neutral-400">·</span><span><b class="text-slate-700">${T.start} ~ ${T.end}</b>　均值 ${k.avg.toFixed(1)} ${e.unit} · 区间 ${k.min.toFixed(1)}~${k.max.toFixed(1)} · ${k.n} 天${k.n<=3?"（低置信）":""}</span>`)}}})}const X=60,Mt=26,$t=X*Mt,St=560,_t={weight:{label:"体重逐日 (kg)",field:"weight_am",unit:"kg",color:"#171717"},waist:{label:"腰围逐日 (cm)",field:"waist_size",unit:"cm",color:"#525252"},sleep:{label:"睡眠时长逐日 (小时)",field:"sleep_hours",unit:"小时",color:"#10b981",avg:!0},steps:{label:"步数逐日 (步)",field:"steps",unit:"步",color:"#737373",avg:!0,yMax:2e4,yStep:5e3,fmt:e=>e.toLocaleString("en-US")}};let F={metric:"weight",records:[]},U=null;function jt(){const e=[],t=new Date;for(let n=X-1;n>=0;n--){const s=new Date(t.getFullYear(),t.getMonth(),t.getDate());s.setDate(s.getDate()-n),e.push(j(s))}return e}function Ct(){return window.matchMedia("(orientation: landscape) and (max-height: 600px)").matches}function Dt(){const e=document.getElementById("app-frame");e&&e.classList.toggle("frame-wide",currentTab==="trend-detail"&&Ct())}function Ht(){const e=document.getElementById("td-chart-box"),t=document.getElementById("td-chart-scroll");if(!e||!t)return;const n=t.clientWidth>=St;e.style.width=n?"100%":`${$t}px`,e.style.height=n?"150px":"220px",U&&U.resize()}function Ne(){Dt(),Ht()}function At(){const e=()=>{currentTab==="trend-detail"&&Ne()};window.addEventListener("resize",e);const t=window.matchMedia("(orientation: landscape) and (max-height: 600px)");t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}function Nt(){Re(F.metric),switchTab("trend-detail")}function Re(e){F.metric=e,["weight","waist","sleep","steps"].forEach(t=>{const n=document.getElementById(`td-tab-${t}`);n&&(n.className=t===e?"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all":"flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all")}),currentTab==="trend-detail"&&zt()}function Rt(e,t){if(e==="weight"){const a=c=>c==null?"--":`${c} kg`,o=t.weight_am,l=t.weight_pm;let r="";return o!=null&&l!==null&&l!==void 0&&(r=` · 夜间排水 <b class="text-slate-700">${(Math.round((l-o)*10)/10).toFixed(1)} kg</b>`),`<b class="text-slate-700">${t.record_date}</b>　晨起 ${a(o)} · 睡前 ${a(l)}${r}`}if(e==="waist"){const a=t.waist_size===null||t.waist_size===void 0?"--":`${t.waist_size} cm`;return`<b class="text-slate-700">${t.record_date}</b>　腰围 ${a}`}if(e==="steps"){const a=t.steps===null||t.steps===void 0?"--":`${Number(t.steps).toLocaleString("en-US")} 步`;return`<b class="text-slate-700">${t.record_date}</b>　步数 ${a}${t.morning_light===!0?" · 已见晨光":""}`}const n=t.sleep_tag==="RED"?"熬夜":t.sleep_tag==="YELLOW"?"轻度":"正常",s=t.sleep_hours===null||t.sleep_hours===void 0?"--":`${t.sleep_hours} 小时`;return`<b class="text-slate-700">${t.record_date}</b>　就寝 ${t.sleep_start_time||"--"} · 起床 ${t.sleep_end_time||"--"} · ${s} · ${n}`}function zt(){const e=_t[F.metric],t=jt(),n={};F.records.forEach(u=>{n[u.record_date]=u});const s=t.map(u=>{const b=n[u];if(!b)return null;const g=b[e.field];return g==null||g===""||isNaN(Number(g))?null:Number(g)}),a=t.map(u=>u.slice(5)),o=document.getElementById("td-detail");o.innerHTML='<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>',document.getElementById("td-metric-label").innerText=e.label;const l=document.getElementById("td-metric-stat"),r=document.getElementById("td-metric-note"),c=s.filter(u=>u!==null);if(c.length>0){if(e.avg){const u=c.reduce((b,g)=>b+g,0)/c.length;l.innerText=F.metric==="sleep"?`${u.toFixed(1)} 小时 (均值)`:`${Math.round(u).toLocaleString("en-US")} 步 (均值)`}else l.innerText=`${c[c.length-1]} ${e.unit}`;r.innerHTML=`近 ${X} 天逐日<br>有效 ${c.length} 天`}else l.innerText="--",r.innerHTML=`近 ${X} 天暂无数据`;const x=document.getElementById("chart-trend-detail").getContext("2d");U&&U.destroy(),U=new Chart(x,{type:"line",data:{labels:a,datasets:[{label:e.label,data:s,borderColor:e.color,backgroundColor:e.color,tension:.25,spanGaps:!1,pointHitRadius:16,pointRadius:3,pointBackgroundColor:e.color}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!1},tooltip:{displayColors:!1,callbacks:{title:u=>t[u[0].dataIndex],label:u=>{const b=s[u.dataIndex];return b===null?"当日无数据":`数值：${e.fmt?e.fmt(b):b} ${e.unit}`}}}},scales:{y:e.yMax?{beginAtZero:!0,max:e.yMax,ticks:{font:{size:10},stepSize:e.yStep,callback:u=>u===0?"0":`${u/1e4}万`}}:{beginAtZero:!1,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:0,autoSkip:!0,maxTicksLimit:20}}},onClick:(u,b)=>{if(!b||!b.length)return;const g=b[0].index,m=t[g],i=n[m];!i||s[g]===null||(o.innerHTML=`<span class="font-mono text-neutral-400">·</span><span>${Rt(F.metric,i)}</span>`)}}}),Ne()}At();window.switchDashRange=Y;window.openTrendView=Tt;window.openTrendDetailView=Nt;window.setTrendMetric=Ae;window.setTrendDetailMetric=Re;const Pt=`      <section id="view-insight" class="fade-in space-y-4 hidden">
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

      <!-- 4. 睡前小结 (Evening Summary View) -->`;let G=30,D=j(new Date),we="today",ue=!1,p={items:[],beforeId:0,hasMore:!1,loading:!1,rangeDays:0,compareMode:!1,q:"",error:"",expanded:{},details:{},manageMode:!1,selected:{}};function Ot(e){e.insertAdjacentHTML("beforeend",Pt)}function Ft(){typeof re=="function"&&re()}function ze(){return j(new Date)}const Vt="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all",Wt="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all";function Pe(){const e=j(new Date),t=document.getElementById("endpill-today"),n=document.getElementById("endpill-yesterday");t&&(t.className=Vt),n&&(n.className=Wt);const s=document.getElementById("insight-end-date");s&&(s.max=e,s.value=D||e,s.classList.toggle("ring-2",we==="custom"),s.classList.toggle("ring-blue-500/40",we==="custom"))}function ke(e){["7","30","60"].forEach(n=>{const s=document.getElementById(`pill-${n}`);s&&(s.disabled=e,s.classList.toggle("opacity-50",e),s.classList.toggle("cursor-not-allowed",e),s.classList.toggle("pointer-events-none",e))}),["endpill-today","endpill-yesterday"].forEach(n=>{const s=document.getElementById(n);s&&(s.disabled=e,s.classList.toggle("pointer-events-none",e),s.classList.toggle("opacity-50",e))});const t=document.getElementById("insight-end-date");t&&(t.disabled=e,t.classList.toggle("opacity-50",e))}function xe(e){if(!e)return"";const n=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`);let s="",a=!1;for(let o=0;o<n.length;o++){let l=n[o];if(l=l.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),l=l.replace(/`([^`]+)`/g,'<code class="bg-slate-100 px-1 py-0.5 rounded text-xs text-indigo-600">$1</code>'),/^### (.*$)/.test(l)){a&&(s+="</ul>",a=!1),s+=l.replace(/^### (.*$)/,'<h3 class="font-bold text-slate-800 text-sm mt-3 mb-1.5 pb-1 border-b border-slate-100">$1</h3>');continue}if(/^## (.*$)/.test(l)){a&&(s+="</ul>",a=!1),s+=l.replace(/^## (.*$)/,'<h2 class="font-bold text-slate-900 text-base mt-4 mb-2">$1</h2>');continue}if(/^# (.*$)/.test(l)){a&&(s+="</ul>",a=!1),s+=l.replace(/^# (.*$)/,'<h1 class="font-bold text-slate-900 text-lg mt-4 mb-2">$1</h1>');continue}if(/^---$/.test(l.trim())){a&&(s+="</ul>",a=!1),s+='<hr class="my-3 border-slate-200">';continue}if(/^[*-]\s+(.*$)/.test(l)){a||(s+='<ul class="list-disc pl-5 my-1.5 space-y-1 text-slate-700 text-xs leading-relaxed">',a=!0),s+=l.replace(/^[*-]\s+(.*$)/,"<li>$1</li>");continue}a&&(s+="</ul>",a=!1),l.trim()!==""&&(s+=`<p class="my-1.5 text-slate-700 text-xs leading-relaxed">${l}</p>`)}return a&&(s+="</ul>"),s}async function Ut(){const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");if(D=ze(),Pe(),ue&&!await Zt(`截至 ${D} 的近 ${G} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,{title:"重新生成洞察",confirmText:"确定重新生成",danger:!1}))return;const s=n.innerHTML;n.disabled=!0,n.classList.add("opacity-50","cursor-not-allowed"),n.innerHTML="<span>⏳ AI 正在全盘深度分析中...</span>",ie++,ke(!0),e.innerHTML="",e.classList.add("typing-cursor"),t.innerText="AI 正在推导生理因果...";let a="",o="",l=!1;function r(){let x="";a&&(x+=`
            <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500" ${o?"":"open"}>
              <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">
                思维链推导 (${a.length} 字)
              </summary>
              <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${a}</div>
            </details>
          `),o&&(x+=xe(o)),e.innerHTML=x}const c=-new Date().getTimezoneOffset();try{const x=await fetch(`/api/v1/insights/stream?days=${G}&end_date=${D}&tz_offset=${c}`);if(!x.ok)throw new Error(`HTTP ${x.status}`);const u=x.body.getReader(),b=new TextDecoder("utf-8");let g="";for(;;){const{done:m,value:i}=await u.read();if(m)break;g+=b.decode(i,{stream:!0});const h=g.split(`
`);g=h.pop();for(let w of h){if(w=w.trim(),!w||!w.startsWith("data:"))continue;const k=w.slice(5).trim();if(k==="[DONE]"){t.innerText="复盘完成";continue}try{const T=JSON.parse(k);if(T.error)o+=`
> ⚠️ **服务提示**: ${T.error}
`,l=!0,r();else if(T.choices&&T.choices.length>0){const M=T.choices[0].delta||{};let H=!1;M.reasoning_content&&(a+=M.reasoning_content,H=!0),M.content&&(o+=M.content,H=!0),H&&r()}}catch{}}}l?(r(),t.innerText="分析失败"):o||a?Fe(o,a,new Date):(e.innerHTML='<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>',t.innerText="暂无分析内容")}catch(x){o||a?(o+=`

> ⚠️ *[网络连接已完成或阶段传输结束]*`,r(),t.innerText="分析完成(部分)"):x instanceof TypeError?(e.innerHTML=`<p class="text-red-500">无法连接本地服务（${location.host}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`,t.innerText="本地服务未连接"):(e.innerHTML=`<p class="text-red-500">连接 AI 洞察服务失败: ${x.message}</p>`,t.innerText="生成异常")}finally{e.classList.remove("typing-cursor"),n.disabled=!1,n.classList.remove("opacity-50","cursor-not-allowed"),ke(!1),n.innerHTML=o||a?'<span class="font-mono">重新生成</span>':s}}function Gt(){p.rangeDays=0,p.compareMode=!1,p.q="",Kt();const e=document.getElementById("history-search");e&&(e.value=""),qt(0),switchTab("history"),Jt()}function qt(e){[0,7,30,60].forEach(n=>{const s=document.getElementById(`hfilter-${n}`);s&&(n===e?s.className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white transition-all":s.className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all")});const t=document.getElementById("hfilter-compare");t&&(t.className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all")}async function Jt(e){if(p.loading)return;p.loading=!0,p.items=[],p.beforeId=0,p.hasMore=!1,p.error="",p.expanded={},p.details={},oe();const t=new URLSearchParams;t.set("limit","10"),p.beforeId>0&&t.set("before_id",String(p.beforeId)),p.compareMode?t.set("scope","compare"):p.rangeDays>0&&t.set("range_days",String(p.rangeDays)),p.q&&t.set("q",p.q);try{const s=await(await fetch("/api/v1/insights?"+t.toString())).json();if(s.code!==200)throw new Error(s.message||"查询失败");const a=s.data||{},o=a.items||[];p.items=p.items.concat(o),p.hasMore=!!a.has_more,o.length>0&&(p.beforeId=o[o.length-1].id)}catch(n){p.error=n.message}finally{p.loading=!1,oe()}}function oe(){const e=document.getElementById("history-list"),t=document.getElementById("history-loadmore"),n=document.getElementById("history-manage-btn");if(e){if(!p.items.length){p.loading?e.innerHTML='<p class="text-center text-xs text-slate-400 py-8">加载中…</p>':p.error?e.innerHTML=`<p class="text-center text-xs text-red-500 py-8">加载失败：${L(p.error)}</p>`:e.innerHTML='<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>',t&&t.classList.add("hidden"),n&&n.classList.toggle("hidden",!p.manageMode),le();return}e.innerHTML=p.items.map(s=>{const a=!!p.expanded[s.id],o=!!p.selected[s.id],l=new Date(s.created_at),r=isNaN(l.getTime())?"":`${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")} ${String(l.getHours()).padStart(2,"0")}:${String(l.getMinutes()).padStart(2,"0")}`,c=(s.content||"").replace(/[#*`>|\-]/g," ").replace(/\s+/g," ").trim().slice(0,90)||"（无正文）",x=s.scope==="compare",u=s.meta||{},b=u.month_a&&u.month_b?`${L(u.month_a)} vs ${L(u.month_b)}`:`${L(s.start_date)} ~ ${L(s.end_date)}`,g=x?b:`${L(s.start_date)} ~ ${L(s.end_date)}`,m=x?"阶段对比":`近 ${s.range_days} 天`,i=`
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-xs font-bold text-slate-800">${g}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold">${m}</span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed ${a&&!p.manageMode?"":"line-clamp-2"}">${L(c)}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[10px] text-slate-400">${r}${s.model?" · "+L(s.model):""}</span>
            ${p.manageMode?"":x?'<span class="text-[10px] text-blue-600 font-bold">查看对比 ›</span>':`<span class="text-[10px] text-blue-600 font-bold">${a?"收起 ▴":"展开 ▾"}</span>`}
          </div>`;if(p.manageMode)return`
            <div data-hp-id="${s.id}" onclick="onHistoryItemClick(${s.id})" class="cursor-pointer select-none flex items-start space-x-3 bg-white border rounded-2xl p-3.5 shadow-sm transition-colors ${o?"border-blue-400 ring-1 ring-blue-300":"border-slate-100"}">
              <div class="mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${o?"bg-blue-600 border-blue-600":"border-slate-300 bg-white"}">
                ${o?'<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>':""}
              </div>
              <div class="flex-1 min-w-0">${i}</div>
            </div>`;let h="";if(a){const w=p.details[s.id];if(!w)h='<p class="text-[11px] text-slate-400 mt-2">加载全文…</p>';else{const k=(w.thinking||"").trim();h=`${k?`
              <details class="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
                <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${k.length} 字)</summary>
                <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${L(k)}</div>
              </details>`:""}
              <div class="mt-2 text-sm text-slate-700 leading-relaxed markdown-body">${xe(w.content||"")}</div>`}}return`
          <div data-hp-id="${s.id}" class="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm">
            <div class="cursor-pointer select-none" onclick="onHistoryItemClick(${s.id})">${i}</div>
            ${h}
          </div>`}).join(""),t&&t.classList.toggle("hidden",!p.hasMore),n&&n.classList.toggle("hidden",!p.items.length&&!p.manageMode),le(),Yt()}}let se=null;function Yt(){const e=document.getElementById("history-list");e&&e.querySelectorAll("[data-hp-id]").forEach(t=>{const n=parseInt(t.getAttribute("data-hp-id"),10),s=()=>{p.manageMode||(clearTimeout(se),se=setTimeout(()=>{p.manageMode=!0,p.selected={[n]:!0},Oe(),oe()},500))},a=()=>clearTimeout(se);t.addEventListener("pointerdown",s),t.addEventListener("pointerup",a),t.addEventListener("pointerleave",a),t.addEventListener("pointercancel",a),t.addEventListener("contextmenu",o=>o.preventDefault())})}function Kt(){p.manageMode&&(p.manageMode=!1,p.selected={},Oe())}function Oe(){const e=document.getElementById("history-manage-btn");e&&(e.innerText=p.manageMode?"完成":"管理",e.className=p.manageMode?"text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors":"text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"),le()}function le(){const e=document.getElementById("history-delete-bar");if(!e)return;const t=p.manageMode&&p.items.length>0;if(e.classList.toggle("hidden",!t),!t)return;const n=p.items.map(r=>r.id),s=n.filter(r=>p.selected[r]).length,a=document.getElementById("history-selected-count");a&&(a.innerText=`已选 ${s} 项`);const o=document.getElementById("history-selectall-btn");o&&(o.innerText=n.length>0&&s===n.length?"取消全选":"全选");const l=document.getElementById("history-delete-btn");l&&(l.disabled=s===0,l.innerText=s>0?`删除所选 (${s})`:"删除所选",l.className=s>0?"text-xs font-bold bg-red-500 hover:bg-red-600 px-3.5 py-1.5 rounded-xl transition-colors":"text-xs font-bold bg-slate-600/60 text-slate-300 px-3.5 py-1.5 rounded-xl cursor-not-allowed transition-colors")}function Zt(e,t){const n=t||{};return new Promise(s=>{const a=document.getElementById("app-confirm-modal"),o=document.getElementById("app-confirm-title"),l=document.getElementById("app-confirm-msg"),r=document.getElementById("app-confirm-ok"),c=document.getElementById("app-confirm-cancel");if(!a){s(!1);return}o.innerText=n.title||"请确认",l.innerText=e||"",r.innerText=n.confirmText||"确定",n.danger===!1?r.className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors":r.className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors";const x=()=>{a.classList.add("hidden"),r.onclick=null,c.onclick=null,a.onclick=null};r.onclick=()=>{x(),s(!0)},c.onclick=()=>{x(),s(!1)},a.onclick=u=>{u.target===a&&(x(),s(!1))},a.classList.remove("hidden")})}function L(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const Xt="<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>";function Qt(e,t){let n="";const s=(t||"").trim();return s&&(n+=`
          <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${s.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${L(s)}</div>
          </details>`),e&&e.trim()?n+=xe(e):n+='<p class="text-slate-400 text-xs">该洞察没有正文内容。</p>',n}function Ee(){ue=!1;const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");e&&(e.innerHTML=Xt),t&&(t.innerText="点击上方按钮开始"),n&&(n.innerHTML='<span class="font-mono">生成阶段深度洞察</span>')}function Fe(e,t,n){ue=!0;const s=document.getElementById("insight-content"),a=document.getElementById("insight-status-tag"),o=document.getElementById("btn-generate-insight"),l=n instanceof Date?n:new Date(n),r=String(l.getHours()).padStart(2,"0"),c=String(l.getMinutes()).padStart(2,"0");s&&(s.innerHTML=Qt(e,t)),a&&(a.innerHTML=`近 ${G} 天（截至 ${D}）· 生成于 ${r}:${c} · <span onclick="openInsightHistory()" class="text-blue-600 cursor-pointer font-bold">点击查看</span>`),o&&(o.innerHTML='<span class="font-mono">重新生成</span>')}let ie=0;async function re(){const e=document.getElementById("insight-content"),t=document.getElementById("insight-status-tag"),n=document.getElementById("btn-generate-insight");if(!t||!n||!e)return;D=ze(),Pe();const s=G,a=D,o=++ie,l=()=>o!==ie||s!==G||a!==D,r=-new Date().getTimezoneOffset();try{const c=await fetch(`/api/v1/insights/period?range_days=${s}&end_date=${a}&tz_offset=${r}`);if(l())return;const x=await c.json();if(l())return;const u=x.code===200&&x.data?x.data:null;if(!u||!u.exists||!u.insight){Ee();return}const b=u.insight;Fe(b.content||"",b.thinking||"",b.created_at)}catch{if(l())return;Ee()}}function Ve(){document.visibilityState==="visible"&&currentTab==="insight"&&re()}document.addEventListener("visibilitychange",Ve);window.addEventListener("pageshow",Ve);let N={monthA:"",monthB:"",returnTab:"insight"};function Ie(e){const t=new Date;return t.setDate(1),t.setMonth(t.getMonth()+e),`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function en(e,t,n){N.returnTab=n==="history"?"history":"insight",e&&t?(N.monthA=e,N.monthB=t):(N.monthA||(N.monthA=Ie(-1)),N.monthB||(N.monthB=Ie(-2))),switchTab("compare")}window.openInsightHistory=Gt;window.generateInsightStream=Ut;window.switchInsightRange=switchInsightRange;window.openCompareView=en;const tn=`      <section id="view-evening" class="fade-in hidden -m-5">

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
              <p class="text-[10px] text-slate-400 mt-1">试着放宽日期或评分范围</p>`;function nn(e){e.insertAdjacentHTML("beforeend",tn)}function sn(){typeof de=="function"&&de()}const me=[{range:[1,2],label:"很低落",tone:"rose"},{range:[3,4],label:"有点钝",tone:"amber"},{range:[5,6],label:"平平",tone:"emerald"},{range:[7,8],label:"还不错，稳住了节奏",tone:"indigo"},{range:[9,10],label:"满分的一天",tone:"violet"}],Be={rose:{dot:"#f43f5e",chip:"text-rose-600 bg-rose-50 border-rose-100",band:"bg-rose-50 text-rose-600"},amber:{dot:"#f59e0b",chip:"text-amber-600 bg-amber-50 border-amber-100",band:"bg-amber-50 text-amber-700"},emerald:{dot:"#10b981",chip:"text-emerald-600 bg-emerald-50 border-emerald-100",band:"bg-emerald-50 text-emerald-700"},indigo:{dot:"#6366f1",chip:"text-indigo-600 bg-indigo-50 border-indigo-100",band:"bg-indigo-50 text-indigo-600"},violet:{dot:"#8b5cf6",chip:"text-violet-600 bg-violet-50 border-violet-100",band:"bg-violet-50 text-violet-600"}},We=6;let V=null,E={date:"",photoId:null,pendingBlob:null,summaries:[],dateFilter:"all",scoreFilter:"all",visible:We,insightBusy:!1,insightRange:7},z={W:84,drag:null,suppressClick:0};function Ue(e){const t=V||me;return t.find(n=>e>=n.range[0]&&e<=n.range[1])||t[t.length-1]}function be(e){return Be[e]||Be.indigo}function an(){const e=new Date,t=n=>String(n).padStart(2,"0");return e.getFullYear()+"-"+t(e.getMonth()+1)+"-"+t(e.getDate())}function on(e){const t=["周日","周一","周二","周三","周四","周五","周六"],n=new Date(e+"T00:00:00");return isNaN(n.getTime())?"":t[n.getDay()]}function K(e){return e?e.slice(5):""}function Te(e){return e?e.slice(0,7):""}function ln(e){const t=e.split("-");return t[0]+" 年 "+Number(t[1])+" 月"}function rn(e){return String(e??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function de(){E.date||(E.date=an()),document.getElementById("summary-date").value=E.date,await Promise.all([dn(),cn()]),await wn()}async function dn(){if(V){Me();return}try{const t=await(await fetch("/api/config")).json(),n=t&&t.data&&t.data.summary_score_bands;Array.isArray(n)&&n.length&&(V=n.map(s=>({range:[s.range[0],s.range[1]],label:s.label,tone:s.tone})))}catch{}V||(V=me.map(e=>({range:[e.range[0],e.range[1]],label:e.label,tone:e.tone}))),Me(),Ge(Number(document.getElementById("score-range").value)||7)}async function cn(){const e=E.date;xn();try{const n=await(await fetch(`/api/v1/evening/summary?date=${encodeURIComponent(e)}`)).json(),s=n&&n.code===200?n.data:null;s?(document.getElementById("done-1").value=s.done_items&&s.done_items[0]||"",document.getElementById("done-2").value=s.done_items&&s.done_items[1]||"",document.getElementById("done-3").value=s.done_items&&s.done_items[2]||"",document.getElementById("note-text").value=s.note_text||"",document.getElementById("note-len").innerText=(s.note_text||"").length,Le(s.score||7),s.photo_id&&(E.photoId=s.photo_id,un(`/api/v1/evening/photo/${s.photo_id}`,""))):(document.getElementById("done-1").value="",document.getElementById("done-2").value="",document.getElementById("done-3").value="",document.getElementById("note-text").value="",document.getElementById("note-len").innerText="0",Le(7)),pn()}catch(t){appToast("读取该日小结失败："+t.message)}gn(e)}function pn(){let e=0;[1,2,3].forEach(n=>{const s=!!document.getElementById("done-"+n).value.trim(),a=document.getElementById("seq-"+n);s?(a.classList.contains("filled")||(a.classList.add("filled","ev-pop"),setTimeout(()=>a.classList.remove("ev-pop"),340)),e++):a.classList.remove("filled")});const t=document.getElementById("done-count");t.innerText=e+" / 3",t.className="text-[10px] font-black tabular-nums transition-colors "+(e===0?"text-slate-300":"text-indigo-500")}function un(e,t){document.getElementById("photo-preview").src=e||"",document.getElementById("photo-empty").classList.add("hidden"),document.getElementById("photo-filled").classList.remove("hidden"),document.getElementById("photo-meta").innerText=""}function xn(){E.photoId=null,E.pendingBlob=null;const e=document.getElementById("photo-input");e&&(e.value=""),document.getElementById("photo-preview").src="",document.getElementById("photo-filled").classList.add("hidden"),document.getElementById("photo-empty").classList.remove("hidden"),document.getElementById("photo-meta").innerText=""}function mn(e){const t=document.getElementById("ev-photo-viewer"),n=document.getElementById("ev-photo-viewer-img");!t||t.classList.contains("hidden")||(t.classList.add("hidden"),n.removeAttribute("src"))}window.addEventListener("popstate",()=>{});document.addEventListener("keydown",e=>{e.key==="Escape"&&mn()});function Le(e){const t=Number(e),n=document.getElementById("score-value");n.innerText=t,n.classList.remove("ev-pop"),n.offsetWidth,n.classList.add("ev-pop"),document.getElementById("score-range").style.setProperty("--pct",((t-1)/9*100).toFixed(1)+"%"),Ge(t)}function Ge(e){const t=Ue(e),n=document.getElementById("score-text");n.innerText=t.label,n.className="mt-3 text-center text-[11px] font-bold rounded-xl py-2 transition-colors "+be(t.tone).band}function Me(){const e=V||me;document.getElementById("band-rows").innerHTML=e.map((t,n)=>`
        <div class="flex items-center space-x-2 bg-slate-50/80 border border-slate-100 rounded-xl px-2.5 py-2">
          <span class="text-[10px] font-black text-slate-400 tabular-nums w-9 shrink-0">${t.range[0]}-${t.range[1]}</span>
          <button onclick="evCycleTone(${n})" title="点击切换配色"
                  class="w-4 h-4 rounded-full shrink-0 border-2 border-white shadow ring-1 ring-slate-200 active:scale-90 transition-transform"
                  style="background:${be(t.tone).dot}"></button>
          <input type="text" value="${rn(t.label)}" maxlength="20" oninput="evSetBandLabel(${n}, this.value)"
                 class="flex-1 min-w-0 bg-transparent text-[12px] text-slate-700 outline-none">
        </div>`).join("")}function bn(e){return e===30?"近 30 天":"近 7 天"}function fn(e){e!==7&&e!==30||(E.insightRange=e,document.querySelectorAll("#ev-insight-range .evo-fchip-dark").forEach(t=>{t.classList.toggle("active",Number(t.dataset.val)===e)}))}async function gn(e){yn();const t=document.getElementById("insight-empty"),n=document.getElementById("insight-panel");document.getElementById("think-body").classList.remove("open"),document.getElementById("think-arrow").classList.remove("rotate-90"),document.getElementById("think-text").innerText="",document.getElementById("insight-body").innerHTML="",n.classList.add("hidden"),t.classList.remove("hidden");try{const a=await(await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(e)}`)).json(),o=a&&a.code===200?a.data:null;o&&o.content&&vn(o)}catch{}}function hn(e){if(!e)return"";const t=new Date(e);if(isNaN(t.getTime()))return"";const n=s=>String(s).padStart(2,"0");return n(t.getHours())+":"+n(t.getMinutes())}function vn(e){document.getElementById("insight-empty").classList.add("hidden"),document.getElementById("insight-panel").classList.remove("hidden"),fn(Number(e.range_days));const n=e.range_days===7||e.range_days===30?bn(e.range_days)+" · ":"";document.getElementById("insight-meta").innerText=`${K(e.start_date||E.date)} 小结洞察 · ${n}生成于 ${hn(e.created_at)}`,document.getElementById("insight-body").innerHTML=renderMarkdown(e.content||""),document.getElementById("think-text").innerText=e.thinking||""}function yn(){const e=document.getElementById("insight-body");e&&e.classList.remove("typing-cursor")}async function wn(){try{const t=await(await fetch("/api/v1/evening/summaries")).json();if(t.code!==200)throw new Error(t.message||"加载失败");E.summaries=t.data&&t.data.items||[]}catch(e){appToast("加载往期小结失败："+e.message),E.summaries=[]}E.visible=Math.max(E.visible,We),In()}function kn(){return E.summaries.filter(e=>(e.score,!0))}function En(e,t){const n=be(Ue(e.score||0).tone),s=e.photo_id?`<img src="/api/v1/evening/photo/${e.photo_id}" alt="${K(e.record_date)}" onclick="event.stopPropagation(); evoOpenPhoto(this.src, '${K(e.record_date)} 小结图片')" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-50 cursor-zoom-in">`:'<span class="w-14 h-14 rounded-xl shrink-0 border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-300 font-bold">无图</span>',a=(e.done_items||[]).filter(r=>r&&r.trim()),o=a.length?a[0]:"（未填完成事项）",l=[0,1,2].map(r=>{const c=e.done_items&&e.done_items[r]||"";return c&&c.trim()?`<li class="flex items-start space-x-1.5 text-[11px] text-slate-600 leading-relaxed"><span class="text-indigo-400 font-black">·</span><span>${escapeHtml(c)}</span></li>`:'<li class="flex items-start space-x-1.5 text-[11px] text-slate-300 leading-relaxed"><span class="font-black">·</span><span>未记录</span></li>'}).join("");return`
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
                    <span class="text-xs font-black text-slate-800 tabular-nums">${K(e.record_date)}</span>
                    <span class="text-[10px] text-slate-400">${on(e.record_date)}</span>
                    <span class="evo-score-chip text-[10px] font-black px-1.5 py-0.5 rounded-full border ${n.chip}" data-score="${e.score}">${e.score} 分</span>
                  </div>
                  <p class="text-[11px] text-slate-400 truncate mt-1">${escapeHtml(o)}</p>
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
                    <p class="text-[11px] text-slate-500 leading-relaxed evo-selectable">${e.note_text?escapeHtml(e.note_text):"（未填写）"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`}function In(){const e=kn(),t=e.slice(0,E.visible),n=document.getElementById("ev-history-list"),s=document.getElementById("ev-history-empty"),a=document.getElementById("ev-load-more"),o=document.getElementById("ev-load-done"),l=document.getElementById("ev-filter-reset");if(document.getElementById("ev-filter-count").innerText=e.length,document.getElementById("ev-history-total").innerText=E.summaries.length+" 篇",l.classList.toggle("hidden",E.scoreFilter==="all"),!e.length){n.innerHTML="",s.classList.remove("hidden"),a.classList.add("hidden"),o.classList.add("hidden");return}s.classList.add("hidden");let r="",c="";t.forEach((u,b)=>{const g=Te(u.record_date);if(g!==c){const m=e.filter(i=>Te(i.record_date)===g).length;r+=`<div class="flex items-center space-x-2 pt-2 pb-3 pl-7">
                     <span class="text-[10px] font-black tracking-wider text-slate-400">${ln(g)}</span>
                     <span class="flex-1 h-px bg-slate-200"></span>
                     <span class="text-[10px] text-slate-400 tabular-nums">${m} 篇</span>
                   </div>`,c=g}r+=En(u,b)}),n.innerHTML=r,Bn();const x=e.length-t.length;x>0?(a.classList.remove("hidden"),o.classList.add("hidden"),document.getElementById("ev-remain-count").innerText=x):(a.classList.add("hidden"),o.classList.remove("hidden"))}function Bn(){document.querySelectorAll("#ev-history-list .evo-swipe-panel").forEach(e=>{e.addEventListener("pointerdown",Tn),e.addEventListener("pointermove",Ln),e.addEventListener("pointerup",$e),e.addEventListener("pointercancel",$e)})}function Tn(e){const t=e.currentTarget,n=t.closest(".evo-swipe");if(!n||n.classList.contains("removing")||e.pointerType==="mouse"&&e.button!==0)return;const s=window.getSelection&&window.getSelection();s&&!s.isCollapsed&&s.anchorNode&&t.contains(s.anchorNode)||(qe(n),z.drag={panel:t,swipe:n,id:e.pointerId,x0:e.clientX,y0:e.clientY,axis:null,base:n.classList.contains("open")?-84:0,off:0})}function Ln(e){const t=z.drag;if(!t||e.pointerId!==t.id)return;const n=e.clientX-t.x0,s=e.clientY-t.y0;if(!t.axis){if(Math.abs(n)<6&&Math.abs(s)<6)return;if(t.axis=Math.abs(n)>Math.abs(s)?"x":"y",t.axis==="x"){t.panel.classList.add("dragging");try{t.panel.setPointerCapture(e.pointerId)}catch{}}}if(t.axis!=="x")return;let a=t.base+n;a>0?a*=.28:a<-84&&(a=-84-(Math.abs(a)-z.W)*.25),t.off=a,t.panel.style.transform="translateX("+a+"px)",e.cancelable&&e.preventDefault()}function $e(e){const t=z.drag;if(!t||e.pointerId!==t.id)return;const n=t.panel,s=t.swipe;n.classList.remove("dragging"),n.style.transform="",t.axis==="x"&&(s.classList.toggle("open",t.off<-42),z.suppressClick=Date.now()),z.drag=null}function qe(e){document.querySelectorAll("#ev-history-list .evo-swipe.open").forEach(t=>{t!==e&&t.classList.remove("open")})}document.getElementById("ev-history-list").addEventListener("click",e=>{const t=e.target.closest(".evo-entry-head");if(!t||Date.now()-z.suppressClick<320)return;const n=t.closest(".evo-swipe");if(n&&n.classList.contains("open")){n.classList.remove("open");return}qe();const a=t.parentElement.querySelector(".evo-collapsible"),o=t.querySelector(".evo-entry-arrow"),l=!a.classList.contains("open");a.classList.toggle("open",l),o&&(o.style.transform=l?"rotate(180deg)":"rotate(0deg)")});window.loadEveningTab=de;window.evoSubmit=evoSubmit;window.evoGenerateInsight=evoGenerateInsight;function ce(e){Q.set({currentTab:e}),["log","dash","trend","trend-detail","insight","history","compare","evening"].forEach(s=>{const a=document.getElementById(`view-${s}`);a&&(s===e?a.classList.remove("hidden"):a.classList.add("hidden"))});const n=document.getElementById("save-bar");n&&n.classList.toggle("hidden",e!=="log"),e==="dash"?vt():e==="insight"?Ft():e==="evening"&&sn()}window.switchTab=ce;document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("app-frame"),t=document.getElementById("main-content");Je(),Ye(e),Xe(e,n=>ce(n)),Qe(document.body),ot(document.body),rt(document.body),ut(t),gt(t),Ot(t),nn(t),ce("log")});
