/**
 * 底部导航栏组件 (Bottom Navigation)
 * 18px 极细线条 SVG，JetBrains Mono 紧凑标签，单线顶边
 */
import { store } from '../services/state.js';

export function renderBottomNav(container, onTabSwitch) {
  const html = `
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
  `;
  container.insertAdjacentHTML('beforeend', html);

  const navEl = document.getElementById('bottom-nav');
  navEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    const targetTab = btn.getAttribute('data-tab');
    if (typeof onTabSwitch === 'function') {
      onTabSwitch(targetTab);
    }
  });

  // 响应式更新 Tab 高亮状态
  store.subscribe((state) => {
    const currentTab = state.currentTab;
    const navKey = (currentTab === 'history' || currentTab === 'compare') ? 'insight' : ((currentTab === 'trend' || currentTab === 'trend-detail') ? 'dash' : currentTab);

    ['log', 'dash', 'insight', 'evening'].forEach((t) => {
      const btn = document.getElementById(`tab-${t}`);
      if (!btn) return;
      if (t === navKey) {
        btn.classList.add('active', 'text-neutral-900');
        btn.classList.remove('text-neutral-400');
      } else {
        btn.classList.remove('active', 'text-neutral-900');
        btn.classList.add('text-neutral-400');
      }
    });
  });
}
