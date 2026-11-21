/**
 * AI 洞察 (Insight View) 主控制器
 * 并装配历史存档与阶段对比子模块
 */
import templateHtml from './insight-view.html?raw';
import { api } from '../../services/api.js';
import { streamChatSSE } from '../../services/sse.js';
import { store } from '../../services/state.js';
import { localDateStr, shiftDateStr } from '../../utils/date.js';
import { appConfirm, appToast } from '../../utils/dialog.js';
import { buttonById, byId, closestEl, inputById } from '../../utils/dom.js';
import { escapeHtml } from '../../utils/format.js';
import { createStreamRenderers, renderInsightArchive } from './stream-renderer.js';
import { initCompareView, openCompareView, cmpBack, activateCompare } from './compare-controller.js';
import { initInsightHistory, openInsightHistory } from './insight-history.js';

let insightDays = 30;
let insightEndDate = localDateStr(new Date());
let insightEndMode = 'today';
let insightPeriodGenerated = false;
let insightLoadSeq = 0;
/** @type {AbortController | null} */
let insightAbortController = null;
let insightBound = false;

const INSIGHT_PILL_ON = 'ht-seg-btn active';
const INSIGHT_PILL_OFF = 'ht-seg-btn';
const DEFAULT_INSIGHT_WELCOME = '<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>';

export function initInsightView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  bindInsightEvents();
  initInsightHistory({ onDeleted: checkPeriodInsight });
  initCompareView();
}

function bindInsightEvents() {
  if (insightBound) return;
  const view = byId('view-insight');
  if (!view) return;
  insightBound = true;

  view.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    switch (action) {
      case 'open-compare':
        openCompareView();
        break;
      case 'open-history':
        openInsightHistory();
        break;
      case 'insight-days': {
        const days = Number(target.dataset.days);
        if (days === 7 || days === 30 || days === 60) setInsightDays(days);
        break;
      }
      case 'insight-end-mode': {
        const mode = target.dataset.mode;
        if (mode === 'today' || mode === 'yesterday') setInsightEndMode(mode);
        break;
      }
      case 'insight-generate':
        generateInsightStream();
        break;
      default:
        break;
    }
  });

  const endDateInput = inputById('insight-end-date');
  endDateInput?.addEventListener('change', (e) => {
    const el = e.currentTarget;
    if (el instanceof HTMLInputElement) setInsightEndDate(el.value);
  });

  const refreshInsightOnResume = () => {
    if (document.visibilityState !== 'visible') return;
    if (store.state.currentTab !== 'insight') return;
    checkPeriodInsight();
  };
  document.addEventListener('visibilitychange', refreshInsightOnResume);
  window.addEventListener('pageshow', refreshInsightOnResume);
}

export function activateInsight() {
  checkPeriodInsight();
}

export function setInsightDays(days) {
  insightDays = days;
  ['7', '30', '60'].forEach((d) => {
    const el = byId(`pill-${d}`);
    if (!el) return;
    el.className = (parseInt(d, 10) === days) ? 'ht-seg-btn active' : 'ht-seg-btn';
  });
  applyEmptyInsightUI();
  checkPeriodInsight();
}

function resolveInsightEndDate() {
  if (insightEndMode === 'yesterday') return shiftDateStr(localDateStr(new Date()), -1);
  if (insightEndMode === 'custom' && insightEndDate) return insightEndDate;
  return localDateStr(new Date());
}

function syncInsightEndUI() {
  const today = localDateStr(new Date());
  const pt = byId('endpill-today');
  const py = byId('endpill-yesterday');
  if (pt) pt.className = insightEndMode === 'today' ? INSIGHT_PILL_ON : INSIGHT_PILL_OFF;
  if (py) py.className = insightEndMode === 'yesterday' ? INSIGHT_PILL_ON : INSIGHT_PILL_OFF;

  const input = inputById('insight-end-date');
  if (!input) return;
  input.max = today;
  input.value = insightEndDate || today;
  input.classList.toggle('border-neutral-900', insightEndMode === 'custom');
}

function setInsightEndMode(mode) {
  insightEndMode = mode;
  insightEndDate = resolveInsightEndDate();
  syncInsightEndUI();
  applyEmptyInsightUI();
  checkPeriodInsight();
}

function setInsightEndDate(value) {
  const today = localDateStr(new Date());
  if (!value || value > today) {
    syncInsightEndUI();
    appToast('截止日不能晚于今天');
    return;
  }
  insightEndMode = 'custom';
  insightEndDate = value;
  syncInsightEndUI();
  applyEmptyInsightUI();
  checkPeriodInsight();
}

function setInsightPillsDisabled(disabled) {
  ['7', '30', '60'].forEach((d) => {
    const el = buttonById(`pill-${d}`);
    if (!el) return;
    el.disabled = disabled;
    el.classList.toggle('opacity-50', disabled);
    el.classList.toggle('cursor-not-allowed', disabled);
    el.classList.toggle('pointer-events-none', disabled);
  });
  ['endpill-today', 'endpill-yesterday'].forEach((id) => {
    const el = buttonById(id);
    if (!el) return;
    el.disabled = disabled;
    el.classList.toggle('pointer-events-none', disabled);
    el.classList.toggle('opacity-50', disabled);
  });
  const endInput = inputById('insight-end-date');
  if (endInput) {
    endInput.disabled = disabled;
    endInput.classList.toggle('opacity-50', disabled);
  }
}

async function generateInsightStream() {
  const contentEl = byId('insight-content');
  const statusTag = byId('insight-status-tag');
  const btn = buttonById('btn-generate-insight');
  if (!contentEl || !statusTag || !btn) return;

  if (insightAbortController) {
    insightAbortController.abort();
    return;
  }

  insightEndDate = resolveInsightEndDate();
  syncInsightEndUI();

  if (insightPeriodGenerated) {
    const ok = await appConfirm(
      `截至 ${insightEndDate} 的近 ${insightDays} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,
      { title: '重新生成洞察', confirmText: '确定重新生成', danger: false }
    );
    if (!ok) return;
  }

  const originalBtnClass = btn.className;
  btn.className = 'w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]';
  btn.innerHTML = '<span>停止生成</span>';

  insightLoadSeq++;
  setInsightPillsDisabled(true);

  contentEl.classList.add('typing-cursor');
  statusTag.innerText = 'AI 正在推导生理因果...';
  const updateStreamUI = createStreamRenderers(contentEl);

  const tzOffset = -new Date().getTimezoneOffset();
  const controller = new AbortController();
  insightAbortController = controller;

  let finalState = { aborted: false, thinking: '', content: '', hasError: false };
  try {
    finalState = await streamChatSSE({
      url: `/api/v1/insights/stream?days=${insightDays}&end_date=${insightEndDate}&tz_offset=${tzOffset}`,
      signal: controller.signal,
      onUpdate: updateStreamUI,
      onDone: ({ thinking, content, hasError }) => {
        if (hasError) {
          statusTag.innerText = '分析失败';
        } else if (content || thinking) {
          applyInsightPeriodUI(content, thinking, new Date());
        } else {
          contentEl.innerHTML = '<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>';
          statusTag.innerText = '暂无分析内容';
        }
      },
      onError: (err, { thinking, content }) => {
        if (content || thinking) {
          updateStreamUI({ thinking, content: content + '\n\n> **注意**: 网络连接已完成或阶段传输结束' });
          statusTag.innerText = '分析完成(部分)';
        } else if (err instanceof TypeError) {
          contentEl.innerHTML = `<p class="text-red-500">无法连接本地服务（${escapeHtml(location.host)}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`;
          statusTag.innerText = '本地服务未连接';
        } else {
          const msg = err instanceof Error ? err.message : String(err);
          contentEl.innerHTML = `<p class="text-red-500">连接 AI 洞察服务失败: ${escapeHtml(msg)}</p>`;
          statusTag.innerText = '生成异常';
        }
      },
    });
    if (finalState.aborted) {
      if (finalState.content || finalState.thinking) {
        updateStreamUI({ thinking: finalState.thinking, content: finalState.content + '\n\n> **已手动停止生成**' });
        statusTag.innerText = '已手动停止';
      } else {
        applyEmptyInsightUI();
        statusTag.innerText = '已取消生成';
      }
    }
  } finally {
    if (insightAbortController === controller) insightAbortController = null;
    contentEl.classList.remove('typing-cursor');
    setInsightPillsDisabled(false);
    btn.className = originalBtnClass;
    const hasSaved = !finalState.aborted && !finalState.hasError && (finalState.content || finalState.thinking);
    if (hasSaved || insightPeriodGenerated) {
      btn.innerHTML = '<span class="font-mono">重新生成</span>';
    } else {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段深度洞察</span>';
    }
  }
}

function applyEmptyInsightUI() {
  insightPeriodGenerated = false;
  const contentEl = byId('insight-content');
  const statusTag = byId('insight-status-tag');
  const btn = byId('btn-generate-insight');
  if (contentEl) contentEl.innerHTML = DEFAULT_INSIGHT_WELCOME;
  if (statusTag) statusTag.innerText = '点击上方按钮开始';
  if (btn) btn.innerHTML = '<span class="font-mono">生成阶段深度洞察</span>';
}

function applyInsightPeriodUI(content, thinking, createdAt) {
  insightPeriodGenerated = true;
  const contentEl = byId('insight-content');
  const statusTag = byId('insight-status-tag');
  const btn = byId('btn-generate-insight');
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (contentEl) contentEl.innerHTML = renderInsightArchive(content, thinking);
  if (statusTag) {
    statusTag.innerHTML = `近 ${insightDays} 天（截至 ${insightEndDate}）· 生成于 ${hh}:${mm} · <button type="button" data-action="open-history" class="text-blue-600 cursor-pointer font-bold">点击查看</button>`;
  }
  if (btn) btn.innerHTML = '<span class="font-mono">重新生成</span>';
}

async function checkPeriodInsight() {
  const contentEl = byId('insight-content');
  const statusTag = byId('insight-status-tag');
  const btn = byId('btn-generate-insight');
  if (!statusTag || !btn || !contentEl) return;

  insightEndDate = resolveInsightEndDate();
  syncInsightEndUI();

  const range = insightDays;
  const end = insightEndDate;
  const seq = ++insightLoadSeq;
  const isStale = () => seq !== insightLoadSeq || range !== insightDays || end !== insightEndDate;

  const tzOffset = -new Date().getTimezoneOffset();

  try {
    const json = await api.checkInsightPeriod(range, end, tzOffset);
    if (isStale()) return;
    const data = json && json.data;
    if (!data || !data.exists || !data.insight) {
      applyEmptyInsightUI();
      return;
    }
    const item = data.insight;
    applyInsightPeriodUI(item.content || '', item.thinking || '', item.created_at);
  } catch (_) {
    if (isStale()) return;
    applyEmptyInsightUI();
  }
}

export { activateCompare, cmpBack };
