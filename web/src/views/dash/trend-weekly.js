/**
 * 周平均趋势分析（独立视图，前端按自然周聚合，不改后端接口）
 * 口径：自然周 = 周一 ~ 周日，共 12 周（含当前未满周），由旧到新；
 * 均值线 = 周内算术平均（0 天断点）；区间带 = min ~ max；1~3 天低置信。
 */
import { api } from '../../services/api.js';
import { navigateTab } from '../../services/router.js';
import { store } from '../../services/state.js';
import { localDateStr } from '../../utils/date.js';
import { byId, canvasById, closestEl } from '../../utils/dom.js';

export const TREND_WEEKS = 12;

const TREND_METRICS = {
  weight: { label: '体重周均值 (kg)', field: 'weight_am', unit: 'kg', color: '#1e293b', band: 'rgba(30, 41, 59, 0.08)' },
  waist: { label: '腰围周均值 (cm)', field: 'waist_size', unit: 'cm', color: '#7c3aed', band: 'rgba(124, 58, 237, 0.08)' },
  sleep: { label: '睡眠周均值 (小时)', field: 'sleep_hours', unit: '小时', color: '#4f46e5', band: 'rgba(79, 70, 229, 0.12)' },
  steps: { label: '步数周均值 (步)', field: 'steps', unit: '步', color: '#ea580c', band: 'rgba(234, 88, 12, 0.08)', int: true },
};

const trendState = { metric: 'weight', records: [], buckets: [], aggs: [] };
let trendChart = null;
let trendBound = false;

/**
 * 取本地日期所在自然周的周一（周一=0 ... 周日=6）
 * @param {Date} d
 * @returns {Date}
 */
export function trendMondayOf(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

/**
 * 构造近 12 个自然周桶（由旧到新，末桶为当前周）
 * @param {Date} [anchorDate]
 * @returns {Array<{ start: string, end: string }>}
 */
export function trendBuildBuckets(anchorDate = new Date()) {
  const monday = trendMondayOf(anchorDate);
  const buckets = [];
  for (let i = TREND_WEEKS - 1; i >= 0; i--) {
    const s = new Date(monday);
    s.setDate(monday.getDate() - i * 7);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    buckets.push({ start: localDateStr(s), end: localDateStr(e) });
  }
  return buckets;
}

/**
 * 按周桶聚合指标均值与 min/max 区间
 * @param {Array<Record<string, any>>} records
 * @param {Array<{ start: string, end: string }>} buckets
 * @param {string} field
 */
export function trendAggregate(records, buckets, field) {
  return buckets.map((b) => {
    /** @type {number[]} */
    const vals = [];
    records.forEach((r) => {
      if (r.record_date >= b.start && r.record_date <= b.end) {
        const v = r[field];
        if (v !== null && v !== undefined && v !== '' && !isNaN(Number(v))) {
          vals.push(Number(v));
        }
      }
    });
    if (vals.length === 0) return { avg: null, min: null, max: null, n: 0 };
    const sum = vals.reduce((a, c) => a + c, 0);
    return { avg: sum / vals.length, min: Math.min(...vals), max: Math.max(...vals), n: vals.length };
  });
}

export function initTrendWeekly() {
  if (trendBound) return;
  const view = byId('view-trend');
  if (!view) return;
  trendBound = true;

  view.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back-dash') {
      navigateTab('dash');
    } else if (action === 'trend-metric') {
      const metric = target.dataset.metric;
      if (metric) setTrendMetric(metric);
    }
  });
}

export function openTrendView() {
  setTrendMetric(trendState.metric);
  navigateTab('trend');
}

/**
 * @param {string} metric
 */
export function setTrendMetric(metric) {
  if (!TREND_METRICS[metric]) return;
  trendState.metric = metric;
  ['weight', 'waist', 'sleep', 'steps'].forEach((m) => {
    const el = byId(`trend-tab-${m}`);
    if (!el) return;
    el.className = m === metric
      ? 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all'
      : 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all';
  });
  if (store.state.currentTab === 'trend') renderTrendChart();
}

export async function activateTrend() {
  await loadTrendData();
}

async function loadTrendData() {
  const buckets = trendBuildBuckets();
  const startStr = buckets[0].start;
  const endStr = localDateStr(new Date());
  try {
    const res = await api.getHistoryRecords(startStr, endStr);
    trendState.records = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
  } catch (_) {
    trendState.records = [];
  }
  renderTrendChart();
}

function renderTrendChart() {
  const cfg = TREND_METRICS[trendState.metric];
  /** @param {number} v */
  const fmtTrend = (v) => (cfg.int ? Math.round(v).toLocaleString('en-US') : v.toFixed(1));
  const buckets = trendBuildBuckets();
  const aggs = trendAggregate(trendState.records, buckets, cfg.field);
  trendState.buckets = buckets;
  trendState.aggs = aggs;

  const labels = buckets.map((b) => b.start.slice(5));
  const maxData = aggs.map((a) => a.max);
  const minData = aggs.map((a) => a.min);
  const avgData = aggs.map((a) => a.avg);
  const lowConf = aggs.map((a) => a.n >= 1 && a.n <= 3);

  const labelEl = byId('trend-metric-label');
  if (labelEl) labelEl.innerText = cfg.label;
  const statEl = byId('trend-metric-stat');
  const noteEl = byId('trend-metric-note');
  let lastIdx = -1;
  for (let i = aggs.length - 1; i >= 0; i--) {
    if (aggs[i].n > 0) {
      lastIdx = i;
      break;
    }
  }
  if (lastIdx >= 0) {
    const a = aggs[lastIdx];
    const b = buckets[lastIdx];
    if (statEl) statEl.innerText = `${fmtTrend(a.avg)} ${cfg.unit}`;
    if (noteEl) noteEl.innerHTML = `${b.start.slice(5)}~${b.end.slice(5)} 周均值<br>${a.n} 天数据${a.n <= 3 ? '（低置信）' : ''}`;
  } else {
    if (statEl) statEl.innerText = '--';
    if (noteEl) noteEl.innerHTML = '近 12 周暂无数据';
  }

  const detailEl = byId('trend-detail');
  if (detailEl) {
    detailEl.innerHTML = lastIdx >= 0
      ? '<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>'
      : '<span class="font-mono text-[10px] text-neutral-400">近 12 周暂无该指标数据，记录几天后再来看看</span>';
  }

  const canvas = canvasById('chart-trend');
  if (!canvas) return;
  if (trendChart) {
    trendChart.destroy();
    trendChart = null;
  }
  const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvas) : null;
  if (existingChart) existingChart.destroy();
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '周内最大',
          data: maxData,
          borderColor: 'transparent',
          backgroundColor: cfg.band,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: { target: 1 },
          spanGaps: false,
          tension: 0.25,
        },
        {
          label: '周内最小',
          data: minData,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          pointRadius: 0,
          pointHoverRadius: 0,
          spanGaps: false,
          tension: 0.25,
        },
        {
          label: '周均值',
          data: avgData,
          borderColor: cfg.color,
          backgroundColor: cfg.color,
          tension: 0.25,
          spanGaps: false,
          pointHitRadius: 16,
          pointRadius: (c) => (lowConf[c.dataIndex] ? 4 : 3),
          pointBackgroundColor: (c) => (lowConf[c.dataIndex] ? '#ffffff' : cfg.color),
          pointBorderColor: cfg.color,
          pointBorderWidth: (c) => (lowConf[c.dataIndex] ? 2 : 0),
          segment: {
            borderDash: (c) => ((lowConf[c.p1DataIndex] || lowConf[c.p0DataIndex]) ? [5, 4] : undefined),
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (item) => item.datasetIndex === 2,
          displayColors: false,
          callbacks: {
            title: (items) => {
              const b = buckets[items[0].dataIndex];
              return `${b.start} ~ ${b.end}`;
            },
            label: (item) => {
              const a = aggs[item.dataIndex];
              if (!a || a.n === 0) return '该周无数据';
              return [
                `周均值：${fmtTrend(a.avg)} ${cfg.unit}`,
                `区间：${fmtTrend(a.min)} ~ ${fmtTrend(a.max)}`,
                `样本：${a.n} 天${a.n <= 3 ? '（低置信）' : ''}`,
              ];
            },
          },
        },
      },
      scales: {
        y: { beginAtZero: false, ticks: { font: { size: 10 } } },
        x: { ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
      },
      onClick: (_evt, elements) => {
        let idx = -1;
        (elements || []).forEach((el) => {
          if (el.datasetIndex === 2) idx = el.index;
        });
        if (idx < 0 || !detailEl) return;
        const a = aggs[idx];
        const b = buckets[idx];
        if (!a || a.n === 0) return;
        detailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${b.start} ~ ${b.end}</b>　均值 ${fmtTrend(a.avg)} ${cfg.unit} · 区间 ${fmtTrend(a.min)}~${fmtTrend(a.max)} · ${a.n} 天${a.n <= 3 ? '（低置信）' : ''}</span>`;
      },
    },
  });
}
