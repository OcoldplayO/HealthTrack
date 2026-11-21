/**
 * 60天详情（独立视图，逐日折线，支持竖屏横向滚动与横屏整屏压缩）
 */
import { api } from '../../services/api.js';
import { navigateTab } from '../../services/router.js';
import { store } from '../../services/state.js';
import { localDateStr } from '../../utils/date.js';
import { byId, canvasById, closestEl } from '../../utils/dom.js';

export const TD_DAYS = 60;
const TD_POINT_PX = 26;
const TD_PORTRAIT_W = TD_DAYS * TD_POINT_PX; // 1560px
const TD_FIT_MIN_W = 560;

const TD_METRICS = {
  weight: { label: '体重逐日 (kg)', field: 'weight_am', unit: 'kg', color: '#1e293b' },
  waist: { label: '腰围逐日 (cm)', field: 'waist_size', unit: 'cm', color: '#7c3aed' },
  sleep: { label: '睡眠时长逐日 (小时)', field: 'sleep_hours', unit: '小时', color: '#4f46e5', avg: true },
  steps: {
    label: '步数逐日 (步)',
    field: 'steps',
    unit: '步',
    color: '#ea580c',
    avg: true,
    yMax: 20000,
    yStep: 5000,
    /** @param {number} v */
    fmt: (v) => v.toLocaleString('en-US'),
  },
};

const trendDetailState = { metric: 'weight', records: [] };
let trendDetailChart = null;
let trendDetailBound = false;

/**
 * 构造近 60 个自然日（由旧到新，含基准日）
 * @param {Date} [anchorDate]
 * @returns {string[]}
 */
export function tdBuildDays(anchorDate = new Date()) {
  const days = [];
  for (let i = TD_DAYS - 1; i >= 0; i--) {
    const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
    d.setDate(d.getDate() - i);
    days.push(localDateStr(d));
  }
  return days;
}

function tdIsPhoneLandscape() {
  return window.matchMedia('(orientation: landscape) and (max-height: 600px)').matches;
}

function tdSyncFrame() {
  const frame = byId('app-frame');
  if (!frame) return;
  frame.classList.toggle('frame-wide', store.state.currentTab === 'trend-detail' && tdIsPhoneLandscape());
}

function tdApplyWidth() {
  const box = byId('td-chart-box');
  const scroll = byId('td-chart-scroll');
  if (!box || !scroll) return;
  const fit = scroll.clientWidth >= TD_FIT_MIN_W;
  box.style.width = fit ? '100%' : `${TD_PORTRAIT_W}px`;
  box.style.height = fit ? '150px' : '220px';
  if (trendDetailChart) trendDetailChart.resize();
}

function tdRelayout() {
  tdSyncFrame();
  tdApplyWidth();
}

function tdWatchOrientation() {
  const handler = () => {
    if (store.state.currentTab === 'trend-detail') tdRelayout();
  };
  window.addEventListener('resize', handler);
  const mq = window.matchMedia('(orientation: landscape) and (max-height: 600px)');
  if (mq.addEventListener) mq.addEventListener('change', handler);
  else if (mq.addListener) mq.addListener(handler);
}

export function initTrendDetail() {
  if (trendDetailBound) return;
  const view = byId('view-trend-detail');
  if (!view) return;
  trendDetailBound = true;

  view.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'back-dash') {
      navigateTab('dash');
    } else if (action === 'td-metric') {
      const metric = target.dataset.metric;
      if (metric) setTrendDetailMetric(metric);
    }
  });

  tdWatchOrientation();
}

export function openTrendDetailView() {
  setTrendDetailMetric(trendDetailState.metric);
  navigateTab('trend-detail');
}

/**
 * @param {string} metric
 */
export function setTrendDetailMetric(metric) {
  if (!TD_METRICS[metric]) return;
  trendDetailState.metric = metric;
  ['weight', 'waist', 'sleep', 'steps'].forEach((m) => {
    const el = byId(`td-tab-${m}`);
    if (!el) return;
    el.className = m === metric
      ? 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all'
      : 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all';
  });
  if (store.state.currentTab === 'trend-detail') renderTrendDetailChart();
}

export async function activateTrendDetail() {
  await loadTrendDetailData();
}

export async function loadTrendDetailData() {
  const days = tdBuildDays();
  const startStr = days[0];
  const endStr = days[days.length - 1];
  try {
    const res = await api.getHistoryRecords(startStr, endStr);
    trendDetailState.records = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
  } catch (_) {
    trendDetailState.records = [];
  }
  renderTrendDetailChart();
}

/**
 * 当日详情文案
 * @param {string} metric
 * @param {Record<string, any>} r
 */
function tdDetailText(metric, r) {
  if (metric === 'weight') {
    const fmtW = (v) => (v === null || v === undefined) ? '--' : `${v} kg`;
    const am = r.weight_am;
    const pm = r.weight_pm;
    let diffHtml = '';
    if (am !== null && am !== undefined && pm !== null && pm !== undefined) {
      const d = Math.round((pm - am) * 10) / 10;
      diffHtml = ` · 夜间排水 <b class="text-slate-700">${d.toFixed(1)} kg</b>`;
    }
    return `<b class="text-slate-700">${r.record_date}</b>　睡前 ${fmtW(pm)} · 晨起 ${fmtW(am)}${diffHtml}`;
  }
  if (metric === 'waist') {
    const w = (r.waist_size === null || r.waist_size === undefined) ? '--' : `${r.waist_size} cm`;
    return `<b class="text-slate-700">${r.record_date}</b>　腰围 ${w}`;
  }
  if (metric === 'steps') {
    const v = (r.steps === null || r.steps === undefined) ? '--' : `${Number(r.steps).toLocaleString('en-US')} 步`;
    return `<b class="text-slate-700">${r.record_date}</b>　步数 ${v}${r.morning_light === true ? ' · 已见晨光' : ''}`;
  }
  const tagText = r.sleep_tag === 'RED' ? '熬夜' : (r.sleep_tag === 'YELLOW' ? '轻度' : '正常');
  const hours = (r.sleep_hours === null || r.sleep_hours === undefined) ? '--' : `${r.sleep_hours} 小时`;
  return `<b class="text-slate-700">${r.record_date}</b>　就寝 ${r.sleep_start_time || '--'} · 起床 ${r.sleep_end_time || '--'} · ${hours} · ${tagText}`;
}

function renderTrendDetailChart() {
  const cfg = TD_METRICS[trendDetailState.metric];
  const days = tdBuildDays();
  /** @type {Record<string, any>} */
  const byDate = {};
  trendDetailState.records.forEach((r) => {
    if (r && r.record_date) byDate[r.record_date] = r;
  });

  const values = days.map((ds) => {
    const r = byDate[ds];
    if (!r) return null;
    const v = r[cfg.field];
    if (v === null || v === undefined || v === '' || isNaN(Number(v))) return null;
    return Number(v);
  });
  const labels = days.map((ds) => ds.slice(5));

  const detailEl = byId('td-detail');
  if (detailEl) {
    detailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>';
  }

  const labelEl = byId('td-metric-label');
  if (labelEl) labelEl.innerText = cfg.label;
  const statEl = byId('td-metric-stat');
  const noteEl = byId('td-metric-note');
  const valid = /** @type {number[]} */ (values.filter((v) => v !== null));
  if (valid.length > 0) {
    if (statEl) {
      if (cfg.avg) {
        const avg = valid.reduce((a, c) => a + c, 0) / valid.length;
        statEl.innerText = trendDetailState.metric === 'sleep'
          ? `${avg.toFixed(1)} 小时 (均值)`
          : `${Math.round(avg).toLocaleString('en-US')} 步 (均值)`;
      } else {
        statEl.innerText = `${valid[valid.length - 1]} ${cfg.unit}`;
      }
    }
    if (noteEl) noteEl.innerHTML = `近 ${TD_DAYS} 天逐日<br>有效 ${valid.length} 天`;
  } else {
    if (statEl) statEl.innerText = '--';
    if (noteEl) noteEl.innerHTML = `近 ${TD_DAYS} 天暂无数据`;
  }

  const canvas = canvasById('chart-trend-detail');
  if (!canvas) return;
  if (trendDetailChart) {
    trendDetailChart.destroy();
    trendDetailChart = null;
  }
  const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvas) : null;
  if (existingChart) existingChart.destroy();
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  trendDetailChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: cfg.label,
        data: values,
        borderColor: cfg.color,
        backgroundColor: cfg.color,
        tension: 0.25,
        spanGaps: false,
        pointHitRadius: 16,
        pointRadius: 3,
        pointBackgroundColor: cfg.color,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (items) => days[items[0].dataIndex],
            label: (item) => {
              const v = values[item.dataIndex];
              if (v === null) return '当日无数据';
              return `数值：${cfg.fmt ? cfg.fmt(v) : v} ${cfg.unit}`;
            },
          },
        },
      },
      scales: {
        y: cfg.yMax
          ? {
              beginAtZero: true,
              max: cfg.yMax,
              ticks: {
                font: { size: 10 },
                stepSize: cfg.yStep,
                callback: (v) => (v === 0 ? '0' : `${v / 10000}万`),
              },
            }
          : { beginAtZero: false, ticks: { font: { size: 10 } } },
        x: { ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 20 } },
      },
      onClick: (_evt, elements) => {
        if (!elements || !elements.length || !detailEl) return;
        const idx = elements[0].index;
        const ds = days[idx];
        const r = byDate[ds];
        if (!r || values[idx] === null) return;
        detailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span>${tdDetailText(trendDetailState.metric, r)}</span>`;
      },
    },
  });

  tdRelayout();
}
