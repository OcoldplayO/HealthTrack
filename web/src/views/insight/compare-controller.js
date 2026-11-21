/**
 * 阶段对比（独立视图）：两月选择 + 指标对比表 + AI 对比综述（SSE 流式）
 */
import { api } from '../../services/api.js';
import { navigateTab } from '../../services/router.js';
import { streamChatSSE } from '../../services/sse.js';
import { appConfirm, appToast } from '../../utils/dialog.js';
import { buttonById, byId, closestEl } from '../../utils/dom.js';
import { escapeHtml } from '../../utils/format.js';
import { createStreamRenderers, renderInsightArchive } from './stream-renderer.js';

const cmpState = {
  monthA: '',
  monthB: '',
  metricsA: /** @type {Record<string, any> | null} */ (null),
  metricsB: /** @type {Record<string, any> | null} */ (null),
  generated: false,
  busy: false,
  loadSeq: 0,
  returnTab: 'insight',
};

/** @type {AbortController | null} */
let cmpAbortController = null;
let cmpBound = false;

export function initCompareView() {
  if (cmpBound) return;
  const view = byId('view-compare');
  if (!view) return;
  cmpBound = true;

  view.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'cmp-back') {
      cmpBack();
    } else if (action === 'cmp-step') {
      const which = target.dataset.which;
      const delta = Number(target.dataset.delta);
      if ((which === 'a' || which === 'b') && (delta === -1 || delta === 1)) {
        cmpStepMonth(which, delta);
      }
    } else if (action === 'cmp-generate') {
      cmpGenerateStream();
    }
  });
}

function cmpMonthStr(offset) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function cmpMonthIndex(ym) {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
}

function cmpCurrentMonth() {
  return cmpMonthStr(0);
}

function cmpShiftMonth(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function cmpMonthLabel(ym) {
  if (!ym) return '—';
  const [y, m] = ym.split('-');
  return `${y} 年 ${parseInt(m, 10)} 月`;
}

function cmpIsFuture(ym) {
  return cmpMonthIndex(ym) > cmpMonthIndex(cmpCurrentMonth());
}

/**
 * 入口：可选月份参数（从历史页带月份进来）；无参数时用已选月份，首次取「上月 vs 上上个月」
 * @param {string} [monthA]
 * @param {string} [monthB]
 * @param {string} [fromTab]
 */
export function openCompareView(monthA, monthB, fromTab) {
  cmpState.returnTab = fromTab === 'history' ? 'history' : 'insight';
  if (monthA && monthB) {
    cmpState.monthA = monthA;
    cmpState.monthB = monthB;
  } else {
    if (!cmpState.monthA) cmpState.monthA = cmpMonthStr(-1);
    if (!cmpState.monthB) cmpState.monthB = cmpMonthStr(-2);
  }
  navigateTab('compare');
}

export function cmpOpenFromHistory(monthA, monthB) {
  openCompareView(monthA, monthB, 'history');
}

export function cmpBack() {
  navigateTab(cmpState.returnTab === 'history' ? 'history' : 'insight');
}

export function activateCompare() {
  cmpRefreshPeriod();
}

function cmpSyncMonthUI() {
  const la = byId('cmp-a-label');
  const lb = byId('cmp-b-label');
  if (la) la.innerText = cmpMonthLabel(cmpState.monthA);
  if (lb) lb.innerText = cmpMonthLabel(cmpState.monthB);
  ['a', 'b'].forEach((k) => {
    const ym = k === 'a' ? cmpState.monthA : cmpState.monthB;
    const nextEl = buttonById(`cmp-${k}-next`);
    if (!nextEl) return;
    const atMax = !ym || cmpIsFuture(cmpShiftMonth(ym, 1));
    nextEl.disabled = atMax || cmpState.busy;
    nextEl.classList.toggle('opacity-40', atMax || cmpState.busy);
    nextEl.classList.toggle('cursor-not-allowed', atMax || cmpState.busy);
  });
}

function cmpSetControlsDisabled(disabled) {
  ['cmp-a-prev', 'cmp-a-next', 'cmp-b-prev', 'cmp-b-next'].forEach((id) => {
    const el = buttonById(id);
    if (!el) return;
    el.disabled = disabled;
    el.classList.toggle('opacity-40', disabled);
    el.classList.toggle('pointer-events-none', disabled);
    el.classList.toggle('cursor-not-allowed', disabled);
  });
  if (!disabled) cmpSyncMonthUI();
}

function cmpStepMonth(which, delta) {
  if (cmpState.busy) return;
  const cur = which === 'a' ? cmpState.monthA : cmpState.monthB;
  const next = cmpShiftMonth(cur, delta);
  if (cmpIsFuture(next)) {
    appToast('不能选择未来的月份');
    cmpSyncMonthUI();
    return;
  }
  if (which === 'a') cmpState.monthA = next;
  else cmpState.monthB = next;
  cmpClearInsightCard();
  cmpRefreshPeriod();
}

function cmpClearInsightCard() {
  const contentEl = byId('compare-insight-card');
  const statusTag = byId('cmp-status-tag');
  if (contentEl) contentEl.innerHTML = '<p class="text-slate-400 text-xs">加载该月份对的对比数据…</p>';
  if (statusTag) statusTag.innerText = '加载中…';
}

function cmpCell(v, digits) {
  if (v === null || v === undefined || v === '' || isNaN(Number(v))) return '—';
  return Number(v).toFixed(digits);
}

function cmpDeltaVal(a, b) {
  if (a === null || a === undefined || b === null || b === undefined || a === '' || b === '') return null;
  const na = Number(a);
  const nb = Number(b);
  if (isNaN(na) || isNaN(nb)) return null;
  return na - nb;
}

function cmpDeltaCell(a, b, digits, dir) {
  const d = cmpDeltaVal(a, b);
  if (d === null) return '<span class="text-slate-300">—</span>';
  const txt = (d > 0 ? '+' : '') + d.toFixed(digits);
  let cls = 'text-neutral-500';
  if (dir === 'down') cls = d < 0 ? 'text-emerald-600' : (d > 0 ? 'text-red-500' : 'text-neutral-400');
  else if (dir === 'up') cls = d > 0 ? 'text-emerald-600' : (d < 0 ? 'text-red-500' : 'text-neutral-400');
  return `<span class="font-bold font-mono ${cls}">${txt}</span>`;
}

function cmpMetricRow(label, aHtml, bHtml, deltaHtml) {
  return `<tr class="border-b border-neutral-100 last:border-0">
    <td class="py-2 pr-2 text-neutral-500 font-sans align-top">${label}</td>
    <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${aHtml}</td>
    <td class="py-2 text-right font-bold text-neutral-900 font-mono tabular-nums">${bHtml}</td>
    <td class="py-2 text-right font-mono whitespace-nowrap">${deltaHtml}</td>
  </tr>`;
}

function cmpSleepDistText(m) {
  if (!m) return '—';
  const g = cmpCell(m.green_days, 0);
  const y = cmpCell(m.yellow_days, 0);
  const r = cmpCell(m.red_days, 0);
  if (g === '—' && y === '—' && r === '—') return '—';
  return `${g} / ${y} / ${r}`;
}

function cmpWorkoutText(m) {
  if (!m) return '—';
  const days = cmpCell(m.workout_days, 0);
  if (days === '—') return '—';
  const sub = [];
  if (m.workout_light !== null && m.workout_light !== undefined) sub.push(`轻 ${m.workout_light}`);
  if (m.workout_medium !== null && m.workout_medium !== undefined) sub.push(`中 ${m.workout_medium}`);
  if (m.workout_failure !== null && m.workout_failure !== undefined) sub.push(`力竭 ${m.workout_failure}`);
  return sub.length ? `${days} <span class="text-[10px] text-slate-400 font-normal">(${sub.join(' / ')})</span>` : days;
}

function cmpRenderTable() {
  const body = byId('compare-table-body');
  if (!body) return;
  const colA = byId('cmp-col-a');
  const colB = byId('cmp-col-b');
  const metaEl = byId('cmp-table-meta');
  if (colA) colA.innerText = cmpMonthLabel(cmpState.monthA);
  if (colB) colB.innerText = cmpMonthLabel(cmpState.monthB);

  const a = cmpState.metricsA;
  const b = cmpState.metricsB;
  if (!a && !b) {
    body.innerHTML = '<tr><td colspan="4" class="py-6 text-center text-slate-400">暂无数据</td></tr>';
    if (metaEl) metaEl.innerText = '';
    return;
  }
  if (metaEl) {
    const rows = [a, b].filter((m) => m && m.record_days !== null && m.record_days !== undefined).map((m) => `${m.month} ${m.record_days} 天`);
    metaEl.innerText = rows.join(' · ');
  }

  const g = (m, f) => (m ? m[f] : null);
  const html = [
    cmpMetricRow('体重均值 (kg)', cmpCell(g(a, 'weight_avg'), 1), cmpCell(g(b, 'weight_avg'), 1), cmpDeltaCell(g(a, 'weight_avg'), g(b, 'weight_avg'), 1, 'down')),
    cmpMetricRow('体重净变化 (kg)', cmpCell(g(a, 'weight_delta'), 1), cmpCell(g(b, 'weight_delta'), 1), cmpDeltaCell(g(a, 'weight_delta'), g(b, 'weight_delta'), 1, 'down')),
    cmpMetricRow('腰围均值 (cm)', cmpCell(g(a, 'waist_avg'), 1), cmpCell(g(b, 'waist_avg'), 1), cmpDeltaCell(g(a, 'waist_avg'), g(b, 'waist_avg'), 1, 'down')),
    cmpMetricRow('腰围净变化 (cm)', cmpCell(g(a, 'waist_delta'), 1), cmpCell(g(b, 'waist_delta'), 1), cmpDeltaCell(g(a, 'waist_delta'), g(b, 'waist_delta'), 1, 'down')),
    cmpMetricRow('平均睡眠时长 (小时)', cmpCell(g(a, 'sleep_avg_hours'), 1), cmpCell(g(b, 'sleep_avg_hours'), 1), cmpDeltaCell(g(a, 'sleep_avg_hours'), g(b, 'sleep_avg_hours'), 1, 'up')),
    cmpMetricRow('熬夜分布 (绿/黄/红 天数)', cmpSleepDistText(a), cmpSleepDistText(b), '<span class="text-slate-300">—</span>'),
    cmpMetricRow('有运动天数', cmpWorkoutText(a), cmpWorkoutText(b), cmpDeltaCell(g(a, 'workout_days'), g(b, 'workout_days'), 0, 'up')),
    cmpMetricRow('专注达服药天数 (天)', cmpCell(g(a, 'concerta_days'), 0), cmpCell(g(b, 'concerta_days'), 0), cmpDeltaCell(g(a, 'concerta_days'), g(b, 'concerta_days'), 0, null)),
    cmpMetricRow('平均夜间排水 (kg)', cmpCell(g(a, 'night_loss_avg'), 2), cmpCell(g(b, 'night_loss_avg'), 2), cmpDeltaCell(g(a, 'night_loss_avg'), g(b, 'night_loss_avg'), 2, 'down')),
  ];
  body.innerHTML = html.join('');
}

function cmpRenderWarn() {
  const el = byId('cmp-warn');
  if (!el) return;
  /** @type {string[]} */
  const parts = [];
  [
    { ym: cmpState.monthA, m: cmpState.metricsA },
    { ym: cmpState.monthB, m: cmpState.metricsB },
  ].forEach(({ ym, m }) => {
    if (!m) return;
    if (m.incomplete_month) parts.push(`提示：${cmpMonthLabel(ym)}尚未过完，结论置信度低`);
    else if (m.data_insufficient) parts.push(`提示：${cmpMonthLabel(ym)}数据不足，结论置信度低`);
  });
  if (parts.length) {
    el.innerHTML = parts.join('<br>');
    el.classList.remove('hidden');
  } else {
    el.innerHTML = '';
    el.classList.add('hidden');
  }
}

function cmpApplyEmptyUI() {
  cmpState.generated = false;
  const contentEl = byId('compare-insight-card');
  const statusTag = byId('cmp-status-tag');
  const btn = byId('compare-gen-btn');
  if (contentEl) contentEl.innerHTML = '<p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>';
  if (statusTag) statusTag.innerText = '点击上方按钮开始';
  if (btn) btn.innerHTML = '<span class="font-mono">生成阶段对比综述</span>';
}

function cmpApplyInsightUI(content, thinking, createdAt) {
  cmpState.generated = true;
  const contentEl = byId('compare-insight-card');
  const statusTag = byId('cmp-status-tag');
  const btn = byId('compare-gen-btn');
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (contentEl) contentEl.innerHTML = renderInsightArchive(content, thinking);
  if (statusTag) statusTag.innerText = `${cmpMonthLabel(cmpState.monthA)} vs ${cmpMonthLabel(cmpState.monthB)} · 生成于 ${hh}:${mm}`;
  if (btn) btn.innerHTML = '<span class="font-mono">重新生成阶段对比</span>';
}

async function cmpRefreshPeriod() {
  if (!cmpState.monthA) cmpState.monthA = cmpMonthStr(-1);
  if (!cmpState.monthB) cmpState.monthB = cmpMonthStr(-2);
  cmpSyncMonthUI();
  const seq = ++cmpState.loadSeq;
  const a = cmpState.monthA;
  const b = cmpState.monthB;
  const tzOffset = -new Date().getTimezoneOffset();
  try {
    const json = await api.checkComparePeriod(a, b, tzOffset);
    if (seq !== cmpState.loadSeq) return;
    const data = json && json.data;
    if (!data) throw new Error('加载失败');
    cmpState.metricsA = data.metrics_a || null;
    cmpState.metricsB = data.metrics_b || null;
    cmpRenderTable();
    cmpRenderWarn();
    if (data.exists && data.insight) {
      cmpApplyInsightUI(data.insight.content || '', data.insight.thinking || '', data.insight.created_at);
    } else {
      cmpApplyEmptyUI();
    }
  } catch (e) {
    if (seq !== cmpState.loadSeq) return;
    cmpState.metricsA = null;
    cmpState.metricsB = null;
    cmpRenderTable();
    cmpRenderWarn();
    const msg = e instanceof Error ? e.message : String(e);
    const contentEl = byId('compare-insight-card');
    if (contentEl) contentEl.innerHTML = `<p class="text-red-500 text-xs">加载对比数据失败：${escapeHtml(msg)}</p>`;
    const statusTag = byId('cmp-status-tag');
    if (statusTag) statusTag.innerText = '加载失败';
    appToast('加载对比数据失败：' + msg);
  }
}

async function cmpGenerateStream() {
  if (cmpAbortController) {
    cmpAbortController.abort();
    return;
  }
  if (cmpState.busy) return;
  const contentEl = byId('compare-insight-card');
  const statusTag = byId('cmp-status-tag');
  const btn = byId('compare-gen-btn');
  if (!contentEl || !btn || !statusTag) return;

  if (cmpState.generated) {
    const ok = await appConfirm(
      `「${cmpMonthLabel(cmpState.monthA)} vs ${cmpMonthLabel(cmpState.monthB)}」已生成过阶段对比综述，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,
      { title: '重新生成阶段对比', confirmText: '确定重新生成', danger: false }
    );
    if (!ok) return;
  }

  const originalBtnClass = btn.className;
  cmpState.busy = true;
  btn.className = 'w-full h-11 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]';
  btn.innerHTML = '<span>停止生成</span>';
  cmpSetControlsDisabled(true);

  cmpState.loadSeq++;
  contentEl.classList.add('typing-cursor');
  statusTag.innerText = 'AI 正在推导两月差异...';
  const updateStreamUI = createStreamRenderers(contentEl);

  const tzOffset = -new Date().getTimezoneOffset();
  const controller = new AbortController();
  cmpAbortController = controller;

  let finalState = { aborted: false, thinking: '', content: '', hasError: false };
  try {
    finalState = await streamChatSSE({
      url: `/api/v1/insights/compare/stream?month_a=${cmpState.monthA}&month_b=${cmpState.monthB}&tz_offset=${tzOffset}`,
      signal: controller.signal,
      onUpdate: updateStreamUI,
      onDone: ({ thinking, content, hasError }) => {
        if (hasError) {
          statusTag.innerText = '分析失败';
        } else if (content || thinking) {
          cmpApplyInsightUI(content, thinking, new Date());
        } else {
          contentEl.innerHTML = '<p class="text-slate-400">未能获取到对比内容，请检查后端大模型连接。</p>';
          statusTag.innerText = '暂无对比内容';
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
          contentEl.innerHTML = `<p class="text-red-500">连接 AI 对比服务失败: ${escapeHtml(msg)}</p>`;
          statusTag.innerText = '生成异常';
        }
      },
    });
    if (finalState.aborted) {
      if (finalState.content || finalState.thinking) {
        updateStreamUI({ thinking: finalState.thinking, content: finalState.content + '\n\n> **已手动停止生成**' });
        statusTag.innerText = '已手动停止';
      } else {
        cmpApplyEmptyUI();
        statusTag.innerText = '已取消生成';
      }
    }
  } finally {
    if (cmpAbortController === controller) cmpAbortController = null;
    contentEl.classList.remove('typing-cursor');
    cmpState.busy = false;
    cmpSetControlsDisabled(false);
    btn.className = originalBtnClass;
    const hasSaved = !finalState.aborted && !finalState.hasError && (finalState.content || finalState.thinking);
    if (hasSaved || cmpState.generated) {
      btn.innerHTML = '<span class="font-mono">重新生成阶段对比</span>';
    } else {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成阶段对比综述</span>';
    }
  }
}
