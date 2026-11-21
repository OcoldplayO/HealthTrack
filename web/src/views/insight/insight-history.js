/**
 * AI 洞察历史存档（独立视图）：游标分页、关键词检索、长按多选与批量删除
 */
import { api } from '../../services/api.js';
import { navigateTab } from '../../services/router.js';
import { store } from '../../services/state.js';
import { appConfirm, appToast } from '../../utils/dialog.js';
import { buttonById, byId, closestEl, inputById } from '../../utils/dom.js';
import { escapeHtml, renderMarkdown } from '../../utils/format.js';
import { cmpOpenFromHistory } from './compare-controller.js';

const historyState = {
  items: /** @type {Array<Record<string, any>>} */ ([]),
  beforeId: 0,
  hasMore: false,
  loading: false,
  rangeDays: 0,
  compareMode: false,
  q: '',
  error: '',
  expanded: /** @type {Record<number, boolean>} */ ({}),
  details: /** @type {Record<number, { content?: string, thinking?: string }>} */ ({}),
  manageMode: false,
  selected: /** @type {Record<number, boolean>} */ ({}),
};

/** @type {() => void} */
let onHistoryDeleted = () => {};
/** @type {ReturnType<typeof setTimeout> | null} */
let historySearchTimer = null;
/** @type {ReturnType<typeof setTimeout> | null} */
let historyLongPressTimer = null;
let historyLongPressFired = false;
let historyBound = false;

/**
 * 初始化历史存档视图事件委托
 * @param {{ onDeleted?: () => void }} [opts]
 */
export function initInsightHistory(opts = {}) {
  if (typeof opts.onDeleted === 'function') {
    onHistoryDeleted = opts.onDeleted;
  }
  if (historyBound) return;
  const view = byId('view-history');
  if (!view) return;
  historyBound = true;

  view.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    switch (action) {
      case 'back-insight':
        navigateTab('insight');
        break;
      case 'history-manage':
        toggleHistoryManage();
        break;
      case 'history-filter': {
        const days = Number(target.dataset.days);
        if (!Number.isNaN(days)) setHistoryFilter(days);
        break;
      }
      case 'history-filter-compare':
        setHistoryFilterCompare();
        break;
      case 'history-load-more':
        loadHistory(false);
        break;
      case 'history-select-all':
        toggleHistorySelectAll();
        break;
      case 'history-delete':
        deleteSelectedInsights();
        break;
      case 'history-item-click': {
        const id = Number(target.dataset.id);
        if (id > 0) onHistoryItemClick(id);
        break;
      }
      default:
        break;
    }
  });

  const searchInput = inputById('history-search');
  searchInput?.addEventListener('input', onHistorySearchInput);

  // 容器级长按进入管理模式（位移 > 10px 时取消）
  const listEl = byId('history-list');
  if (listEl) {
    let activePointerId = -1;
    let startX = 0;
    let startY = 0;
    const cancelPress = () => {
      if (historyLongPressTimer) {
        clearTimeout(historyLongPressTimer);
        historyLongPressTimer = null;
      }
      activePointerId = -1;
    };

    listEl.addEventListener('pointerdown', (e) => {
      if (historyState.manageMode) return;
      const card = closestEl(e.target, '[data-hp-id]');
      if (!card) return;
      const id = Number(card.dataset.hpId);
      if (!id) return;
      cancelPress();
      historyLongPressFired = false;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      historyLongPressTimer = setTimeout(() => {
        historyLongPressTimer = null;
        historyLongPressFired = true;
        historyState.manageMode = true;
        historyState.selected = { [id]: true };
        syncHistoryManageUI();
        renderHistoryList();
      }, 500);
    });

    listEl.addEventListener('pointermove', (e) => {
      if (e.pointerId !== activePointerId || !historyLongPressTimer) return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 10) {
        cancelPress();
      }
    });
    listEl.addEventListener('pointerup', cancelPress);
    listEl.addEventListener('pointercancel', cancelPress);
    listEl.addEventListener('contextmenu', (e) => {
      if (closestEl(e.target, '[data-hp-id]')) e.preventDefault();
    });
  }
}

export function openInsightHistory() {
  historyState.rangeDays = 0;
  historyState.compareMode = false;
  historyState.q = '';
  exitHistoryManage();
  const searchEl = inputById('history-search');
  if (searchEl) searchEl.value = '';
  setHistoryFilterPills(0);
  navigateTab('history');
  loadHistory(true);
}

function setHistoryFilter(days) {
  historyState.rangeDays = days;
  historyState.compareMode = false;
  exitHistoryManage();
  setHistoryFilterPills(days);
  if (store.state.currentTab === 'history') loadHistory(true);
}

function setHistoryFilterCompare() {
  historyState.rangeDays = 0;
  historyState.compareMode = true;
  exitHistoryManage();
  setHistoryFilterPills('compare');
  if (store.state.currentTab === 'history') loadHistory(true);
}

/**
 * @param {number | 'compare'} active
 */
function setHistoryFilterPills(active) {
  [0, 7, 30, 60].forEach((d) => {
    const el = byId(`hfilter-${d}`);
    if (!el) return;
    el.className = (d === active)
      ? 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all'
      : 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all';
  });
  const cEl = byId('hfilter-compare');
  if (cEl) {
    cEl.className = (active === 'compare')
      ? 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all'
      : 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all';
  }
}

function onHistorySearchInput() {
  if (historySearchTimer) clearTimeout(historySearchTimer);
  historySearchTimer = setTimeout(() => {
    historySearchTimer = null;
    exitHistoryManage();
    historyState.q = (inputById('history-search')?.value || '').trim();
    loadHistory(true);
  }, 300);
}

export async function loadHistory(reset) {
  if (historyState.loading) return;
  historyState.loading = true;
  if (reset) {
    historyState.items = [];
    historyState.beforeId = 0;
    historyState.hasMore = false;
    historyState.error = '';
    historyState.expanded = {};
    historyState.details = {};
  }
  renderHistoryList();

  /** @type {Record<string, string>} */
  const params = { limit: '10' };
  if (historyState.beforeId > 0) params.before_id = String(historyState.beforeId);
  if (historyState.compareMode) params.scope = 'compare';
  else if (historyState.rangeDays > 0) params.range_days = String(historyState.rangeDays);
  if (historyState.q) params.q = historyState.q;

  try {
    const json = await api.getInsightHistory(params);
    const data = (json && json.data) || {};
    const items = data.items || [];
    historyState.items = historyState.items.concat(items);
    historyState.hasMore = !!data.has_more;
    if (items.length > 0) historyState.beforeId = items[items.length - 1].id;
  } catch (e) {
    historyState.error = e instanceof Error ? e.message : String(e);
  } finally {
    historyState.loading = false;
    renderHistoryList();
  }
}

function renderHistoryList() {
  const listEl = byId('history-list');
  const moreBtn = byId('history-loadmore');
  const manageBtn = byId('history-manage-btn');
  if (!listEl) return;

  if (!historyState.items.length) {
    if (historyState.loading) {
      listEl.innerHTML = '<p class="text-center text-xs text-slate-400 py-8">加载中…</p>';
    } else if (historyState.error) {
      listEl.innerHTML = `<p class="text-center text-xs text-red-500 py-8">加载失败：${escapeHtml(historyState.error)}</p>`;
    } else {
      listEl.innerHTML = '<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>';
    }
    if (moreBtn) moreBtn.classList.add('hidden');
    if (manageBtn) manageBtn.classList.toggle('hidden', !historyState.manageMode);
    updateHistoryDeleteBar();
    return;
  }

  listEl.innerHTML = historyState.items.map((it) => {
    const isOpen = !!historyState.expanded[it.id];
    const selected = !!historyState.selected[it.id];
    const d = new Date(it.created_at);
    const timeStr = isNaN(d.getTime()) ? '' :
      `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const preview = (it.content || '').replace(/[#*`>|\-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) || '（无正文）';

    const isCompare = it.scope === 'compare';
    const m = it.meta || {};
    const cmpTitle = (m.month_a && m.month_b)
      ? `${escapeHtml(m.month_a)} vs ${escapeHtml(m.month_b)}`
      : `${escapeHtml(it.start_date)} ~ ${escapeHtml(it.end_date)}`;
    const headTitle = isCompare ? cmpTitle : `${escapeHtml(it.start_date)} ~ ${escapeHtml(it.end_date)}`;
    const headBadge = isCompare ? '阶段对比' : `近 ${it.range_days} 天`;

    const head = `
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-bold text-neutral-900 font-mono">${headTitle}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600 font-mono font-medium">${headBadge}</span>
      </div>
      <p class="text-xs text-neutral-500 leading-relaxed ${(isOpen && !historyState.manageMode) ? '' : 'line-clamp-2'}">${escapeHtml(preview)}</p>
      <div class="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100 font-mono text-[10px]">
        <span class="text-neutral-400">${timeStr}${it.model ? ' · ' + escapeHtml(it.model) : ''}</span>
        ${historyState.manageMode ? '' : (isCompare ? '<span class="text-neutral-900 font-medium hover:underline">查看对比 ›</span>' : `<span class="text-neutral-900 font-medium hover:underline">${isOpen ? '收起 ▴' : '展开 ▾'}</span>`)}
      </div>`;

    if (historyState.manageMode) {
      return `
        <div data-hp-id="${it.id}" data-action="history-item-click" data-id="${it.id}" class="cursor-pointer select-none flex items-start space-x-3 ht-card transition-colors ${selected ? 'border-neutral-900 ring-1 ring-neutral-900' : ''}">
          <div class="mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${selected ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300 bg-white'}">
            ${selected ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </div>
          <div class="flex-1 min-w-0">${head}</div>
        </div>`;
    }

    let detail = '';
    if (isOpen) {
      const full = historyState.details[it.id];
      if (!full) {
        detail = '<p class="text-[11px] font-mono text-neutral-400 mt-2">加载全文…</p>';
      } else {
        const think = (full.thinking || '').trim();
        const thinkHtml = think ? `
          <details class="mt-2.5 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-600">
            <summary class="cursor-pointer font-mono font-medium text-neutral-700 select-none hover:text-neutral-900 transition-colors">思维链推导 (${think.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600 text-[11px]">${escapeHtml(think)}</div>
          </details>` : '';
        detail = `${thinkHtml}
          <div class="mt-2 text-xs text-neutral-700 leading-relaxed markdown-body">${renderMarkdown(full.content || '')}</div>`;
      }
    }

    return `
      <div data-hp-id="${it.id}" class="ht-card">
        <div class="cursor-pointer select-none" data-action="history-item-click" data-id="${it.id}">${head}</div>
        ${detail}
      </div>`;
  }).join('');

  if (moreBtn) moreBtn.classList.toggle('hidden', !historyState.hasMore);
  if (manageBtn) manageBtn.classList.toggle('hidden', !historyState.items.length && !historyState.manageMode);
  updateHistoryDeleteBar();
}

function onHistoryItemClick(id) {
  if (historyLongPressFired) {
    historyLongPressFired = false;
    return;
  }
  if (historyState.manageMode) {
    toggleHistorySelect(id);
    return;
  }
  const it = historyState.items.find((x) => x.id === id);
  if (it && it.scope === 'compare') {
    const meta = it.meta || {};
    const ma = meta.month_a || (it.start_date || '').slice(0, 7);
    const mb = meta.month_b || (it.end_date || '').slice(0, 7);
    if (ma && mb) {
      cmpOpenFromHistory(ma, mb);
      return;
    }
  }
  toggleHistoryItem(id);
}

function toggleHistoryManage() {
  historyState.manageMode = !historyState.manageMode;
  if (!historyState.manageMode) historyState.selected = {};
  syncHistoryManageUI();
  renderHistoryList();
}

function exitHistoryManage() {
  if (!historyState.manageMode) return;
  historyState.manageMode = false;
  historyState.selected = {};
  syncHistoryManageUI();
}

function syncHistoryManageUI() {
  const btn = byId('history-manage-btn');
  if (btn) {
    btn.innerText = historyState.manageMode ? '完成' : '管理';
    btn.className = historyState.manageMode
      ? 'text-xs font-mono font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-lg transition-colors'
      : 'text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition-colors';
  }
  updateHistoryDeleteBar();
}

function toggleHistorySelect(id) {
  if (historyState.selected[id]) delete historyState.selected[id];
  else historyState.selected[id] = true;
  renderHistoryList();
}

function toggleHistorySelectAll() {
  const ids = historyState.items.map((i) => i.id);
  const selectedCount = ids.filter((id) => historyState.selected[id]).length;
  if (selectedCount === ids.length) {
    historyState.selected = {};
  } else {
    /** @type {Record<number, boolean>} */
    const sel = {};
    ids.forEach((id) => { sel[id] = true; });
    historyState.selected = sel;
  }
  renderHistoryList();
}

function updateHistoryDeleteBar() {
  const bar = byId('history-delete-bar');
  if (!bar) return;
  const show = historyState.manageMode && historyState.items.length > 0;
  bar.classList.toggle('hidden', !show);
  if (!show) return;

  const ids = historyState.items.map((i) => i.id);
  const count = ids.filter((id) => historyState.selected[id]).length;

  const countEl = byId('history-selected-count');
  if (countEl) countEl.innerText = `已选 ${count} 项`;

  const selAllBtn = byId('history-selectall-btn');
  if (selAllBtn) selAllBtn.innerText = (ids.length > 0 && count === ids.length) ? '取消全选' : '全选';

  const delBtn = buttonById('history-delete-btn');
  if (delBtn) {
    delBtn.disabled = count === 0;
    delBtn.innerText = count > 0 ? `删除所选 (${count})` : '删除所选';
    delBtn.className = count > 0
      ? 'text-xs font-mono font-medium bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg transition-colors'
      : 'text-xs font-mono font-medium bg-neutral-700 text-neutral-400 px-3.5 py-1.5 rounded-lg cursor-not-allowed transition-colors';
  }
}

async function deleteSelectedInsights() {
  const ids = historyState.items.map((i) => i.id).filter((id) => historyState.selected[id]);
  if (!ids.length) return;
  const ok = await appConfirm(`确定删除所选 ${ids.length} 条洞察存档？删除后不可恢复。`, { title: '删除洞察存档', confirmText: '确定删除' });
  if (!ok) return;
  try {
    await api.batchDeleteInsights(ids);
    historyState.items = historyState.items.filter((x) => !historyState.selected[x.id]);
    Object.keys(historyState.selected).forEach((key) => {
      const id = Number(key);
      delete historyState.expanded[id];
      delete historyState.details[id];
    });
    historyState.selected = {};
    if (!historyState.items.length) historyState.manageMode = false;
    syncHistoryManageUI();
    renderHistoryList();
    onHistoryDeleted();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('删除失败：' + msg);
  }
}

async function toggleHistoryItem(id) {
  if (historyState.expanded[id]) {
    historyState.expanded[id] = false;
    renderHistoryList();
    return;
  }
  historyState.expanded[id] = true;
  renderHistoryList();
  if (!historyState.details[id]) {
    try {
      const json = await api.getInsightDetail(id);
      historyState.details[id] = (json && json.data) ? json.data : { content: '加载失败', thinking: '' };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      historyState.details[id] = { content: '加载失败：' + msg, thinking: '' };
    }
    renderHistoryList();
  }
}
