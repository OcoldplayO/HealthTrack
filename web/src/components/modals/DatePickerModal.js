/**
 * HealthTrack 3.0 极简黑白日历选择器 (DatePickerModal)
 * 拦截全站 <input type="date">，替代 Android System WebView 不可换肤的原生绿色弹窗。
 */
import { localDateStr } from '../../utils/date.js';
import { byId, closestEl } from '../../utils/dom.js';

const MODAL_ID = 'ht-date-picker-modal';
const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** @type {HTMLInputElement | null} */
let activeInput = null;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
let selectedYmd = localDateStr(new Date());
let initialized = false;

/**
 * 生成指定年月的 6×7 日历网格（周日为首列）
 * @param {number} year
 * @param {number} monthIndex 0-11
 * @returns {Array<{ ymd: string, day: number, inMonth: boolean }>}
 */
export function buildMonthGrid(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  /** @type {Array<{ ymd: string, day: number, inMonth: boolean }>} */
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(year, monthIndex, 1 - startOffset + i);
    cells.push({
      ymd: localDateStr(d),
      day: d.getDate(),
      inMonth: d.getFullYear() === year && d.getMonth() === monthIndex,
    });
  }
  return cells;
}

/**
 * @param {string} ymd
 * @returns {{ year: number, monthIndex: number, day: number } | null}
 */
function parseYmd(ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd || '')) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  return { year: y, monthIndex: m - 1, day: d };
}

/**
 * @param {string} ymd
 * @param {string} minYmd
 * @param {string} maxYmd
 * @returns {boolean}
 */
function isOutOfRange(ymd, minYmd, maxYmd) {
  if (minYmd && ymd < minYmd) return true;
  if (maxYmd && ymd > maxYmd) return true;
  return false;
}

function modalMarkup() {
  return `
    <div id="${MODAL_ID}" class="hidden fixed inset-0 z-[70] bg-neutral-950/40 backdrop-blur-[2px] p-4 flex items-center justify-center">
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
  `;
}

function renderCalendar() {
  const labelEl = byId('ht-dp-selected-label');
  const ymEl = byId('ht-dp-ym');
  const gridEl = byId('ht-dp-grid');
  if (!labelEl || !ymEl || !gridEl) return;

  const parsedSel = parseYmd(selectedYmd);
  if (parsedSel) {
    const dt = new Date(parsedSel.year, parsedSel.monthIndex, parsedSel.day);
    labelEl.innerText = `${selectedYmd} · ${WEEKDAY_NAMES[dt.getDay()]}`;
  } else {
    labelEl.innerText = '选择日期';
  }

  ymEl.innerText = `${viewYear}年 ${String(viewMonth + 1).padStart(2, '0')}月`;

  const todayYmd = localDateStr(new Date());
  const minYmd = activeInput?.min || '';
  const maxYmd = activeInput?.max || '';
  const cells = buildMonthGrid(viewYear, viewMonth);

  gridEl.innerHTML = cells.map((cell) => {
    const disabled = isOutOfRange(cell.ymd, minYmd, maxYmd);
    const isSelected = cell.ymd === selectedYmd;
    const isToday = cell.ymd === todayYmd;

    let cls = 'h-9 rounded-lg flex items-center justify-center transition-colors ';
    if (disabled) {
      cls += 'text-neutral-200 cursor-not-allowed';
    } else if (isSelected) {
      cls += 'bg-neutral-900 text-white font-bold';
    } else if (isToday) {
      cls += 'border border-neutral-400 text-neutral-900 font-semibold hover:bg-neutral-100';
    } else if (cell.inMonth) {
      cls += 'text-neutral-800 hover:bg-neutral-100';
    } else {
      cls += 'text-neutral-300 hover:bg-neutral-50';
    }

    return `<button type="button" data-action="dp-pick" data-ymd="${cell.ymd}" class="${cls}"${disabled ? ' disabled' : ''}>${cell.day}</button>`;
  }).join('');
}

/**
 * @param {number} deltaMonths
 */
function shiftMonth(deltaMonths) {
  const dt = new Date(viewYear, viewMonth + deltaMonths, 1);
  viewYear = dt.getFullYear();
  viewMonth = dt.getMonth();
  renderCalendar();
}

/**
 * 仅在弹窗内预选日期（支持跨月自动翻页预览），不直接关闭或提交
 * @param {string} ymd
 */
function previewDate(ymd) {
  const minYmd = activeInput?.min || '';
  const maxYmd = activeInput?.max || '';
  if (isOutOfRange(ymd, minYmd, maxYmd)) return;

  selectedYmd = ymd;
  const parsed = parseYmd(ymd);
  if (parsed && (parsed.year !== viewYear || parsed.monthIndex !== viewMonth)) {
    viewYear = parsed.year;
    viewMonth = parsed.monthIndex;
  }
  renderCalendar();
}

function commitSelection() {
  const minYmd = activeInput?.min || '';
  const maxYmd = activeInput?.max || '';
  if (isOutOfRange(selectedYmd, minYmd, maxYmd)) return;

  const target = activeInput;
  const ymd = selectedYmd;
  closeDatePicker();

  if (target) {
    const changed = target.value !== ymd;
    target.value = ymd;
    if (changed) {
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

/**
 * @param {HTMLInputElement} input
 */
export function openDatePicker(input) {
  const modal = byId(MODAL_ID);
  if (!modal) return;

  activeInput = input;
  const parsed = parseYmd(input.value) || parseYmd(localDateStr(new Date()));
  if (parsed) {
    viewYear = parsed.year;
    viewMonth = parsed.monthIndex;
    selectedYmd = `${parsed.year}-${String(parsed.monthIndex + 1).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
  }
  renderCalendar();
  modal.classList.remove('hidden');
}

export function closeDatePicker() {
  const modal = byId(MODAL_ID);
  if (modal) modal.classList.add('hidden');
  activeInput = null;
}

/**
 * @param {ParentNode} root
 */
function markDateInputsReadonly(root) {
  root.querySelectorAll('input[type="date"]').forEach((el) => {
    if (el instanceof HTMLInputElement) {
      el.readOnly = true;
    }
  });
}

/**
 * @param {HTMLElement} container
 */
export function initDatePickerModal(container) {
  if (!container) return;
  if (!byId(MODAL_ID)) {
    container.insertAdjacentHTML('beforeend', modalMarkup());
  }
  markDateInputsReadonly(document);

  if (initialized) return;
  initialized = true;

  const modal = byId(MODAL_ID);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeDatePicker();
      return;
    }
    const btn = closestEl(e.target, '[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'dp-prev-year') shiftMonth(-12);
    else if (action === 'dp-prev-month') shiftMonth(-1);
    else if (action === 'dp-next-month') shiftMonth(1);
    else if (action === 'dp-next-year') shiftMonth(12);
    else if (action === 'dp-cancel') closeDatePicker();
    else if (action === 'dp-confirm') commitSelection();
    else if (action === 'dp-pick') {
      const ymd = btn.getAttribute('data-ymd');
      if (ymd) previewDate(ymd);
    }
  });

  // 捕获阶段拦截全站 <input type="date"> 点击与键盘唤起，阻止 WebView 弹出原生绿色日历
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'date' && !target.disabled) {
      e.preventDefault();
      e.stopPropagation();
      target.readOnly = true;
      target.blur();
      openDatePicker(target);
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const m = byId(MODAL_ID);
      if (m && !m.classList.contains('hidden')) {
        closeDatePicker();
      }
      return;
    }
    const target = e.target;
    if (
      target instanceof HTMLInputElement
      && target.type === 'date'
      && !target.disabled
      && (e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault();
      e.stopPropagation();
      target.readOnly = true;
      target.blur();
      openDatePicker(target);
    }
  }, true);
}
