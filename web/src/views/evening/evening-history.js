/**
 * 睡前小结 - 往期回顾子模块 (Evening History)
 * 负责往期列表渲染、日期/评分筛选、分页、复制及 Pointer Events 左滑删除
 */
import { api } from '../../services/api.js';
import { appConfirm, appCopyText, appToast } from '../../utils/dialog.js';
import { byId, closestEl, imgById } from '../../utils/dom.js';
import { escapeHtml } from '../../utils/format.js';

const EVO_PAGE_SIZE = 6;

const historyState = {
  summaries: /** @type {Array<Record<string, any>>} */ ([]),
  dateFilter: 'all',
  scoreFilter: 'all',
  visible: EVO_PAGE_SIZE,
};

/** @type {{ W: number, drag: { panel: HTMLElement, swipe: HTMLElement, id: number, x0: number, y0: number, axis: 'x' | 'y' | null, base: number, off: number } | null, suppressClick: number }} */
const evoSwipe = { W: 84, drag: null, suppressClick: 0 };

/** @type {{ bandOf: (score: number) => any, toneOf: (tone: string) => any, todayStr: () => string, getCurrentDate: () => string, onDeletedCurrentDate: () => void, openPhoto: (src: string, alt?: string) => void }} */
let deps = {
  bandOf: () => ({ range: [7, 8], label: '还不错', tone: 'indigo' }),
  toneOf: () => ({ chip: 'text-indigo-700 bg-indigo-50 border-indigo-200', dot: '#6366f1', band: '' }),
  todayStr: () => '',
  getCurrentDate: () => '',
  onDeletedCurrentDate: () => {},
  openPhoto: () => {},
};

let historyBound = false;

/**
 * 初始化往期回顾列表与滑动/点击委托
 * @param {typeof deps} options
 */
export function initEveningHistory(options) {
  deps = { ...deps, ...options };
  if (historyBound) return;
  const listEl = byId('ev-history-list');
  if (!listEl) return;
  historyBound = true;

  listEl.addEventListener('click', (e) => {
    const actionTarget = closestEl(e.target, '[data-action]');
    if (actionTarget) {
      const action = actionTarget.dataset.action;
      if (action === 'ev-open-photo') {
        e.stopPropagation();
        if (actionTarget instanceof HTMLImageElement) {
          const src = actionTarget.getAttribute('src');
          if (src) {
            deps.openPhoto(actionTarget.src, actionTarget.dataset.alt || actionTarget.alt || '小结图片');
          }
        }
        return;
      }
      if (action === 'ev-delete') {
        e.stopPropagation();
        const date = actionTarget.dataset.date;
        if (date) evAskDelete(date);
        return;
      }
      if (action === 'ev-copy') {
        e.stopPropagation();
        const date = actionTarget.dataset.date;
        if (date) evCopyEntry(date);
        return;
      }
    }

    const head = closestEl(e.target, '.evo-entry-head');
    if (!head || Date.now() - evoSwipe.suppressClick < 320) return;
    const swipe = head.closest('.evo-swipe');
    if (swipe && swipe.classList.contains('open')) {
      swipe.classList.remove('open');
      return;
    }
    evoCloseAllSwipe();
    const card = head.closest('.ht-card') || head.parentElement;
    if (!card) return;
    const bodyEl = card.querySelector('.evo-collapsible');
    const arrow = head.querySelector('.evo-entry-arrow');
    if (!bodyEl) return;
    const open = !bodyEl.classList.contains('open');
    bodyEl.classList.toggle('open', open);
    if (arrow instanceof HTMLElement) {
      arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  });
}

function evoWeekday(dateStr) {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const d = new Date(dateStr + 'T00:00:00');
  return isNaN(d.getTime()) ? '' : names[d.getDay()];
}

function evoDaysAgo(dateStr) {
  const today = new Date(deps.todayStr() + 'T00:00:00');
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((today.getTime() - target.getTime()) / 86400000);
}

function evoMmdd(d) {
  return d ? d.slice(5) : '';
}

function evoMonthKey(d) {
  return d ? d.slice(0, 7) : '';
}

function evoMonthLabel(k) {
  const parts = k.split('-');
  return parts[0] + ' 年 ' + Number(parts[1]) + ' 月';
}

export async function evoLoadList() {
  try {
    const json = await api.getEveningSummaries();
    historyState.summaries = (json && json.data && json.data.items) || [];
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('加载往期小结失败：' + msg);
    historyState.summaries = [];
  }
  historyState.visible = Math.max(historyState.visible, EVO_PAGE_SIZE);
  evoRenderHistory();
}

export function evoRefreshScoreChips() {
  document.querySelectorAll('#ev-history-list .evo-score-chip').forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const s = Number(el.dataset.score) || 7;
    const b = deps.bandOf(s);
    el.className = 'evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ' + deps.toneOf(b.tone).chip;
  });
}

export function evSetDateFilter(btn) {
  document.querySelectorAll('#ev-filter-date button').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  historyState.dateFilter = btn.dataset.val || 'all';
  historyState.visible = EVO_PAGE_SIZE;
  evoRenderHistory();
}

export function evSetScoreFilter(btn) {
  document.querySelectorAll('#ev-filter-score button').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  historyState.scoreFilter = btn.dataset.val || 'all';
  historyState.visible = EVO_PAGE_SIZE;
  evoRenderHistory();
}

export function evResetFilters() {
  document.querySelectorAll('#ev-filter-date button, #ev-filter-score button').forEach((b) => {
    b.classList.toggle('active', b instanceof HTMLElement && b.dataset.val === 'all');
  });
  historyState.dateFilter = 'all';
  historyState.scoreFilter = 'all';
  historyState.visible = EVO_PAGE_SIZE;
  evoRenderHistory();
}

export function evLoadMore() {
  historyState.visible += EVO_PAGE_SIZE;
  evoRenderHistory();
}

function evoFiltered() {
  return historyState.summaries.filter((r) => {
    if (historyState.dateFilter !== 'all' && evoDaysAgo(r.record_date) > Number(historyState.dateFilter) - 1) return false;
    const s = r.score || 0;
    if (historyState.scoreFilter === 'high' && s < 9) return false;
    if (historyState.scoreFilter === 'good' && (s < 7 || s > 8)) return false;
    if (historyState.scoreFilter === 'mid' && (s < 5 || s > 6)) return false;
    if (historyState.scoreFilter === 'low' && s > 4) return false;
    return true;
  });
}

function evoEntryCopyText(r) {
  const items = (r.done_items || []).filter((d) => d && d.trim());
  const lines = [`${r.record_date} ${evoWeekday(r.record_date)} · ${r.score} 分`, '', '【完成事项】'];
  if (items.length) items.forEach((d, i) => lines.push(`${i + 1}. ${d}`));
  else lines.push('（未填写）');
  lines.push('', '【当时的感想】', (r.note_text && r.note_text.trim()) ? r.note_text : '（未填写）');
  return lines.join('\n');
}

async function evCopyEntry(date) {
  const r = (historyState.summaries || []).find((x) => x.record_date === date);
  if (!r) return;
  const ok = await appCopyText(evoEntryCopyText(r));
  appToast(ok ? '已复制 ' + evoMmdd(date) + ' 的小结' : '复制失败，请长按文字手动复制');
}

function evoEntryHTML(r, idx) {
  const scoreVal = (r.score != null && r.score > 0) ? r.score : 7;
  const tone = deps.toneOf(deps.bandOf(scoreVal).tone);
  const mmdd = evoMmdd(r.record_date);
  const thumb = r.photo_id
    ? `<img src="/api/v1/evening/photo/${r.photo_id}" alt="${escapeHtml(mmdd)}" data-action="ev-open-photo" data-alt="${escapeHtml(mmdd)} 小结图片" class="rounded-lg object-cover shrink-0 border border-neutral-200 bg-neutral-100 cursor-zoom-in" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">`
    : `<span class="rounded-lg shrink-0 border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-400 font-mono font-bold" style="width:40px;height:40px;min-width:40px;min-height:40px;max-width:40px;max-height:40px;">无图</span>`;
  const items = (r.done_items || []).filter((d) => d && d.trim());
  const preview = items.length ? items[0] : '（未填完成事项）';
  const doneHtml = [0, 1, 2].map((i) => {
    const v = (r.done_items && r.done_items[i]) || '';
    return (v && v.trim())
      ? `<li class="flex items-start space-x-1.5 text-xs text-neutral-700 leading-relaxed"><span class="text-neutral-400 font-mono text-[10px] mt-0.5">${i + 1}.</span><span>${escapeHtml(v)}</span></li>`
      : `<li class="flex items-start space-x-1.5 text-xs text-neutral-300 leading-relaxed"><span class="font-mono text-[10px] mt-0.5">${i + 1}.</span><span>未记录</span></li>`;
  }).join('');
  const safeDate = escapeHtml(r.record_date);
  return `
  <div class="evo-tl-item ev-rise" style="animation-delay:${Math.min(idx, 7) * 40}ms">
    <span class="evo-tl-node"></span><span class="evo-tl-line"></span>
    <div class="evo-swipe" data-date="${safeDate}">
      <div class="evo-swipe-action">
        <button type="button" class="evo-swipe-del" data-action="ev-delete" data-date="${safeDate}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <span>删除</span>
        </button>
      </div>
      <div class="evo-swipe-panel">
        <div class="ht-card p-0 overflow-hidden">
          <div class="evo-entry-head p-2 px-3 flex items-center gap-2.5 cursor-pointer hover:bg-neutral-50/70 active:bg-neutral-100 transition-colors">
            ${thumb}
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1.5">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-xs font-bold font-mono text-neutral-900 tabular-nums">${escapeHtml(mmdd)}</span>
                  <span class="text-[10px] text-neutral-400 font-mono">${evoWeekday(r.record_date)}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="evo-score-chip font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${tone.chip}" data-score="${scoreVal}">${scoreVal} 分</span>
                  <span class="evo-entry-arrow text-neutral-400 transform transition-transform duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </div>
              <p class="text-xs text-neutral-500 truncate mt-0.5 font-sans">${escapeHtml(preview)}</p>
            </div>
          </div>
          <div class="evo-collapsible">
            <div class="px-3 pb-3 pt-2.5 border-t border-neutral-100 space-y-2.5">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">完成事项</p>
                  <button type="button" class="evo-copy-btn" data-action="ev-copy" data-date="${safeDate}" aria-label="复制这天的记录">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <span>复制</span>
                  </button>
                </div>
                <ol class="space-y-1 evo-selectable">${doneHtml}</ol>
              </div>
              <div class="bg-neutral-50 border border-neutral-200/60 rounded-lg p-2.5">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">当时的感想</p>
                  <span class="font-mono text-[10px] text-neutral-500">自评：${scoreVal} / 10 分</span>
                </div>
                <p class="text-xs text-neutral-600 leading-relaxed evo-selectable">${r.note_text ? escapeHtml(r.note_text) : '（未填写）'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function evoRenderHistory() {
  const list = evoFiltered();
  const shown = list.slice(0, historyState.visible);
  const wrap = byId('ev-history-list');
  const empty = byId('ev-history-empty');
  const moreBtn = byId('ev-load-more');
  const doneTip = byId('ev-load-done');
  const resetBtn = byId('ev-filter-reset');

  const filterCountEl = byId('ev-filter-count');
  if (filterCountEl) filterCountEl.innerText = String(list.length);
  const totalEl = byId('ev-history-total');
  if (totalEl) totalEl.innerText = historyState.summaries.length + ' 篇';
  if (resetBtn) resetBtn.classList.toggle('hidden', historyState.dateFilter === 'all' && historyState.scoreFilter === 'all');

  if (!wrap) return;
  if (!list.length) {
    wrap.innerHTML = '';
    empty?.classList.remove('hidden');
    moreBtn?.classList.add('hidden');
    doneTip?.classList.add('hidden');
    return;
  }
  empty?.classList.add('hidden');

  let html = '';
  let lastMonth = '';
  shown.forEach((r, i) => {
    const mk = evoMonthKey(r.record_date);
    if (mk !== lastMonth) {
      const cnt = list.filter((x) => evoMonthKey(x.record_date) === mk).length;
      html += `<div class="flex items-center space-x-2 pt-2 pb-2.5 pl-6 font-mono text-[10px]">
                 <span class="font-bold text-neutral-500 tracking-wider">${evoMonthLabel(mk)}</span>
                 <span class="flex-1 h-px bg-neutral-200"></span>
                 <span class="text-neutral-400 tabular-nums">${cnt} 篇</span>
               </div>`;
      lastMonth = mk;
    }
    html += evoEntryHTML(r, i);
  });
  wrap.innerHTML = html;
  evoBindSwipes();

  const remain = list.length - shown.length;
  if (remain > 0) {
    moreBtn?.classList.remove('hidden');
    doneTip?.classList.add('hidden');
    const remainEl = byId('ev-remain-count');
    if (remainEl) remainEl.innerText = String(remain);
  } else {
    moreBtn?.classList.add('hidden');
    doneTip?.classList.remove('hidden');
  }
}

function evoBindSwipes() {
  document.querySelectorAll('#ev-history-list .evo-swipe-panel').forEach((panel) => {
    if (!(panel instanceof HTMLElement)) return;
    panel.addEventListener('pointerdown', evoOnSwipeDown);
    panel.addEventListener('pointermove', evoOnSwipeMove);
    panel.addEventListener('pointerup', evoOnSwipeUp);
    panel.addEventListener('pointercancel', evoOnSwipeUp);
  });
}

function evoOnSwipeDown(e) {
  if (!(e instanceof PointerEvent)) return;
  const panel = e.currentTarget;
  if (!(panel instanceof HTMLElement)) return;
  const swipe = panel.closest('.evo-swipe');
  if (!(swipe instanceof HTMLElement) || swipe.classList.contains('removing')) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const sel = window.getSelection && window.getSelection();
  if (sel && !sel.isCollapsed && sel.anchorNode && panel.contains(sel.anchorNode)) return;
  evoCloseAllSwipe(swipe);
  evoSwipe.drag = {
    panel,
    swipe,
    id: e.pointerId,
    x0: e.clientX,
    y0: e.clientY,
    axis: null,
    base: swipe.classList.contains('open') ? -evoSwipe.W : 0,
    off: 0,
  };
}

function evoOnSwipeMove(e) {
  if (!(e instanceof PointerEvent)) return;
  const drag = evoSwipe.drag;
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x0;
  const dy = e.clientY - drag.y0;
  if (!drag.axis) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
    drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (drag.axis === 'x') {
      drag.panel.classList.add('dragging');
      try { drag.panel.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }
  if (drag.axis !== 'x') return;
  let off = drag.base + dx;
  if (off > 0) off *= 0.28;
  else if (off < -evoSwipe.W) off = -evoSwipe.W - (Math.abs(off) - evoSwipe.W) * 0.25;
  drag.off = off;
  drag.panel.style.transform = 'translateX(' + off + 'px)';
  if (e.cancelable) e.preventDefault();
}

function evoOnSwipeUp(e) {
  if (!(e instanceof PointerEvent)) return;
  const drag = evoSwipe.drag;
  if (!drag || e.pointerId !== drag.id) return;
  const panel = drag.panel;
  const swipe = drag.swipe;
  panel.classList.remove('dragging');
  panel.style.transform = '';
  if (drag.axis === 'x') {
    swipe.classList.toggle('open', drag.off < -42);
    evoSwipe.suppressClick = Date.now();
  }
  evoSwipe.drag = null;
}

function evoCloseAllSwipe(except) {
  document.querySelectorAll('#ev-history-list .evo-swipe.open').forEach((s) => {
    if (s !== except) s.classList.remove('open');
  });
}

async function evAskDelete(date) {
  const r = historyState.summaries.find((x) => x.record_date === date);
  const ok = await appConfirm(`${evoMmdd(date)}${r ? ' · ' + r.score + ' 分' : ''}，删除后不可恢复。`, { title: '删除这篇小结？', confirmText: '删除' });
  const swipe = document.querySelector(`.evo-swipe[data-date="${date}"]`);
  if (!ok) {
    if (swipe) swipe.classList.remove('open');
    return;
  }
  try {
    await api.deleteEveningSummary(date);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('删除失败：' + msg);
    if (swipe) swipe.classList.remove('open');
    return;
  }
  const afterRemove = () => {
    historyState.summaries = historyState.summaries.filter((x) => x.record_date !== date);
    evoRenderHistory();
    if (deps.getCurrentDate() === date) {
      deps.onDeletedCurrentDate();
    }
  };
  if (swipe) {
    swipe.classList.add('removing');
    setTimeout(() => {
      afterRemove();
      appToast('已删除 ' + evoMmdd(date) + ' 的小结');
    }, 260);
  } else {
    afterRemove();
    appToast('已删除 ' + evoMmdd(date) + ' 的小结');
  }
}
