/**
 * 数据看板 (Dash View) 业务控制器
 * 包含 4 大图表与近期活动打卡流水，并装配周平均趋势、60 天逐日详情两个子视图
 */
import templateHtml from './dash-view.html?raw';
import { api } from '../../services/api.js';
import { store } from '../../services/state.js';
import { localDateStr, shiftDateStr } from '../../utils/date.js';
import { escapeHtml } from '../../utils/format.js';
import { byId, canvasById, closestEl } from '../../utils/dom.js';
import { initTrendWeekly, openTrendView, setTrendMetric, activateTrend } from './trend-weekly.js';
import { initTrendDetail, openTrendDetailView, setTrendDetailMetric, activateTrendDetail } from './trend-detail.js';

let dashRange = 7;
let weightChart = null;
let waistChart = null;
let sleepChart = null;
let stepsChart = null;

function initChartDefaults() {
  if (typeof Chart !== 'undefined' && Chart.defaults) {
    Chart.defaults.font.family = "'JetBrains Mono', 'Cascadia Code', monospace";
    Chart.defaults.font.size = 10;
    Chart.defaults.color = '#a3a3a3';
    Chart.defaults.plugins.tooltip.backgroundColor = '#171717';
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#d4d4d4';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleFont = { family: "'JetBrains Mono', monospace", weight: '600', size: 11 };
    Chart.defaults.plugins.tooltip.bodyFont = { family: "'JetBrains Mono', monospace", size: 10 };
  }
}

/**
 * 从记录中取出运动类型列表，兼容早期单值 type 字段
 * @param {any} ex
 * @returns {string[]}
 */
function exerciseTypesOf(ex) {
  if (!ex) return [];
  let list = Array.isArray(ex.types) ? ex.types.slice() : [];
  if (list.length === 0 && ex.type) list = [ex.type];
  return list.filter((t) => t && t !== 'none');
}

export function initDashView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  initChartDefaults();
  bindEvents();
  initTrendWeekly();
  initTrendDetail();
}

function bindEvents() {
  const dashView = byId('view-dash');
  if (!dashView) return;
  dashView.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'dash-range') {
      const days = Number(target.dataset.days);
      if (days === 7 || days === 30 || days === 60) {
        switchDashRange(days);
      }
    } else if (action === 'open-trend-detail') {
      openTrendDetailView();
    } else if (action === 'open-trend') {
      openTrendView();
    }
  });
}

export function activateDash() {
  switchDashRange(dashRange);
}

/**
 * @param {number} days
 */
export function switchDashRange(days) {
  dashRange = days;
  store.set({ dashRange: days });
  ['7', '30', '60'].forEach((d) => {
    const btn = byId('btn-range-' + d);
    if (!btn) return;
    btn.className = (Number(d) === days)
      ? 'px-3 py-1 rounded-md bg-white border border-neutral-200 text-neutral-900 font-mono font-medium shadow-sm transition-all'
      : 'px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-900 font-mono font-medium transition-all';
  });
  loadDashboardData(days);
}

export async function loadDashboardData(days = dashRange) {
  dashRange = days;
  const endStr = localDateStr(new Date());
  const startStr = shiftDateStr(endStr, -(days - 1));

  try {
    const res = await api.getHistoryRecords(startStr, endStr);
    const records = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
    renderDashboardCharts(records, startStr, days);
  } catch (err) {
    console.error('加载看板数据失败:', err);
  }
}

/**
 * @param {Array<Record<string, any>>} records
 * @param {string} startStr
 * @param {number} days
 */
function renderDashboardCharts(records, startStr, days) {
  /** @type {Record<string, any>} */
  const byDate = Object.create(null);
  records.forEach((r) => {
    if (r && r.record_date) byDate[r.record_date] = r;
  });
  const span = days || dashRange || 7;
  const anchorStart = startStr || shiftDateStr(localDateStr(new Date()), -(span - 1));
  const daysList = [];
  for (let i = 0; i < span; i++) {
    daysList.push(shiftDateStr(anchorStart, i));
  }
  const seriesRecords = daysList.map((ds) => byDate[ds] || { record_date: ds });

  const labels = daysList.map((ds) => ds.slice(5));
  const weightAmData = seriesRecords.map((r) => (r.weight_am === null || r.weight_am === undefined) ? null : r.weight_am);
  const weightPmData = seriesRecords.map((r) => (r.weight_pm === null || r.weight_pm === undefined) ? null : r.weight_pm);
  const waistData = seriesRecords.map((r) => (r.waist_size === null || r.waist_size === undefined) ? null : r.waist_size);
  const sleepHoursData = seriesRecords.map((r) => (r.sleep_hours === null || r.sleep_hours === undefined) ? null : r.sleep_hours);
  const sleepColors = seriesRecords.map((r) => {
    if (r.sleep_hours === null || r.sleep_hours === undefined) return 'transparent';
    if (r.sleep_tag === 'RED') return '#f43f5e';
    if (r.sleep_tag === 'YELLOW') return '#fbbf24';
    return '#34c759';
  });

  // 统计均值
  const validWeights = weightAmData.filter((v) => v !== null && v !== undefined);
  const dashWeightStat = byId('dash-weight-stat');
  if (dashWeightStat) {
    dashWeightStat.innerText = validWeights.length > 0 ? `${validWeights[validWeights.length - 1]} kg` : '--';
  }

  const validSleeps = sleepHoursData.filter((v) => v !== null && v !== undefined);
  const dashSleepStat = byId('dash-sleep-stat');
  if (dashSleepStat) {
    if (validSleeps.length > 0) {
      const avgSleep = (validSleeps.reduce((a, b) => a + b, 0) / validSleeps.length).toFixed(1);
      dashSleepStat.innerText = `${avgSleep} 小时 (均值)`;
    } else {
      dashSleepStat.innerText = '--';
    }
  }

  // 1. 体重趋势图
  const weightDetailEl = byId('dash-weight-detail');
  if (weightDetailEl) {
    weightDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日睡前重 / 晨重</span>';
  }
  const canvasWeight = canvasById('chart-weight');
  if (canvasWeight) {
    if (weightChart) {
      weightChart.destroy();
      weightChart = null;
    }
    const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasWeight) : null;
    if (existingChart) existingChart.destroy();

    const ctxWeight = canvasWeight.getContext('2d');
    if (ctxWeight) {
      const weightGradPm = ctxWeight.createLinearGradient(0, 0, 0, 160);
      weightGradPm.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      weightGradPm.addColorStop(1, 'rgba(245, 158, 11, 0.00)');

      const weightGradAm = ctxWeight.createLinearGradient(0, 0, 0, 160);
      weightGradAm.addColorStop(0, 'rgba(30, 41, 59, 0.06)');
      weightGradAm.addColorStop(1, 'rgba(30, 41, 59, 0.00)');

      weightChart = new Chart(ctxWeight, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '睡前体重',
              data: weightPmData,
              borderColor: '#f59e0b',
              borderWidth: 2.0,
              backgroundColor: weightGradPm,
              fill: true,
              tension: 0.35,
              spanGaps: false,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#f59e0b',
              pointBorderWidth: 2,
              pointRadius: 3.5,
              pointHoverRadius: 5.5,
              pointHitRadius: 16,
            },
            {
              label: '晨起体重',
              data: weightAmData,
              borderColor: '#1e293b',
              borderWidth: 2.2,
              backgroundColor: weightGradAm,
              fill: true,
              tension: 0.35,
              spanGaps: false,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#1e293b',
              pointBorderWidth: 2,
              pointRadius: 3.5,
              pointHoverRadius: 5.5,
              pointHitRadius: 16,
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
              itemSort: (a, b) => a.datasetIndex - b.datasetIndex,
            },
          },
          onClick: (_evt, elements) => {
            if (!elements || !elements.length || !weightDetailEl) return;
            const r = seriesRecords[elements[0].index];
            if (!r || (r.weight_am == null && r.weight_pm == null)) return;
            const fmtW = (v) => (v === null || v === undefined) ? '--' : `${v} kg`;
            const am = r.weight_am;
            const pm = r.weight_pm;
            let diffHtml = '';
            if (am !== null && am !== undefined && pm !== null && pm !== undefined) {
              const d = Math.round((pm - am) * 10) / 10;
              let note;
              if (d < 0.3) note = '偏低，可能高钠储水';
              else if (d < 0.4) note = '偏低';
              else if (d <= 0.9) note = '正常';
              else note = '偏高';
              diffHtml = ` · 夜间排水 <b class="text-slate-700">${d.toFixed(1)} kg</b>（${note}）`;
            }
            weightDetailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${r.record_date}</b>　睡前 ${fmtW(pm)} · 晨起 ${fmtW(am)}${diffHtml}</span>`;
          },
          scales: {
            y: { beginAtZero: false, grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
          },
        },
      });
    }
  }

  // 2. 腰围趋势图
  const validWaists = waistData.filter((v) => v !== null && v !== undefined);
  const dashWaistStat = byId('dash-waist-stat');
  if (dashWaistStat) {
    dashWaistStat.innerText = validWaists.length > 0 ? `${validWaists[validWaists.length - 1]} cm` : '--';
  }
  const waistDetailEl = byId('dash-waist-detail');
  if (waistDetailEl) {
    waistDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>';
  }
  const canvasWaist = canvasById('chart-waist');
  if (canvasWaist) {
    if (waistChart) {
      waistChart.destroy();
      waistChart = null;
    }
    const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasWaist) : null;
    if (existingChart) existingChart.destroy();

    const ctxWaist = canvasWaist.getContext('2d');
    if (ctxWaist) {
      const waistGrad = ctxWaist.createLinearGradient(0, 0, 0, 160);
      waistGrad.addColorStop(0, 'rgba(124, 58, 237, 0.10)');
      waistGrad.addColorStop(1, 'rgba(124, 58, 237, 0.00)');

      waistChart = new Chart(ctxWaist, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: '腰围',
            data: waistData,
            borderColor: '#7c3aed',
            borderWidth: 2.2,
            backgroundColor: waistGrad,
            fill: true,
            tension: 0.35,
            spanGaps: false,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#7c3aed',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 5.5,
            pointHitRadius: 16,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          onClick: (_evt, elements) => {
            if (!elements || !elements.length || !waistDetailEl) return;
            const r = seriesRecords[elements[0].index];
            if (!r || r.waist_size == null) return;
            const waistText = (r.waist_size === null || r.waist_size === undefined) ? '--' : `${r.waist_size} cm`;
            waistDetailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${r.record_date}</b>　腰围 ${waistText}</span>`;
          },
          scales: {
            y: { beginAtZero: false, grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
          },
        },
      });
    }
  }

  // 3. 睡眠柱状图
  const sleepDetailEl = byId('dash-sleep-detail');
  if (sleepDetailEl) {
    sleepDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>';
  }
  const canvasSleep = canvasById('chart-sleep');
  if (canvasSleep) {
    if (sleepChart) {
      sleepChart.destroy();
      sleepChart = null;
    }
    const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasSleep) : null;
    if (existingChart) existingChart.destroy();

    const ctxSleep = canvasSleep.getContext('2d');
    if (ctxSleep) {
      sleepChart = new Chart(ctxSleep, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: sleepHoursData,
            backgroundColor: sleepColors,
            borderRadius: 8,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          onHover: (evt, elements) => {
            if (evt.native && evt.native.target instanceof HTMLElement) {
              evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            }
          },
          onClick: (_evt, elements) => {
            if (!elements || !elements.length || !sleepDetailEl) return;
            const r = seriesRecords[elements[0].index];
            if (!r || (r.sleep_hours == null && !r.sleep_start_time)) return;
            const tagText = r.sleep_tag === 'RED' ? '熬夜' : (r.sleep_tag === 'YELLOW' ? '轻度' : '正常');
            const hours = (r.sleep_hours === null || r.sleep_hours === undefined) ? '--' : `${r.sleep_hours} 小时`;
            sleepDetailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${r.record_date}</b>　就寝 ${r.sleep_start_time || '--'} · 起床 ${r.sleep_end_time || '--'} · ${hours} · ${tagText}</span>`;
          },
          scales: {
            y: { beginAtZero: true, max: 12, grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
          },
        },
      });
    }
  }

  // 4. 步数趋势图
  const stepsData = seriesRecords.map((r) => (r.steps === null || r.steps === undefined) ? null : Number(r.steps));
  const validSteps = /** @type {number[]} */ (stepsData.filter((v) => v !== null));
  const dashStepsStat = byId('dash-steps-stat');
  if (dashStepsStat) {
    if (validSteps.length > 0) {
      const avgSteps = Math.round(validSteps.reduce((a, b) => a + b, 0) / validSteps.length);
      dashStepsStat.innerText = `${avgSteps.toLocaleString('en-US')} 步 (均值)`;
    } else {
      dashStepsStat.innerText = '--';
    }
  }
  const stepsDetailEl = byId('dash-steps-detail');
  if (stepsDetailEl) {
    stepsDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>';
  }
  const canvasSteps = canvasById('chart-steps');
  if (canvasSteps) {
    if (stepsChart) {
      stepsChart.destroy();
      stepsChart = null;
    }
    const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasSteps) : null;
    if (existingChart) existingChart.destroy();

    const ctxSteps = canvasSteps.getContext('2d');
    if (ctxSteps) {
      const stepsGrad = ctxSteps.createLinearGradient(0, 0, 0, 160);
      stepsGrad.addColorStop(0, 'rgba(234, 88, 12, 0.16)');
      stepsGrad.addColorStop(1, 'rgba(234, 88, 12, 0.00)');

      stepsChart = new Chart(ctxSteps, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: '步数',
            data: stepsData,
            borderColor: '#ea580c',
            borderWidth: 2.2,
            backgroundColor: stepsGrad,
            fill: true,
            tension: 0.35,
            spanGaps: false,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#ea580c',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 5.5,
            pointHitRadius: 16,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          onHover: (evt, elements) => {
            if (evt.native && evt.native.target instanceof HTMLElement) {
              evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            }
          },
          onClick: (_evt, elements) => {
            if (!elements || !elements.length || !stepsDetailEl) return;
            const r = seriesRecords[elements[0].index];
            if (!r || (r.steps === null || r.steps === undefined)) return;
            const v = `${Number(r.steps).toLocaleString('en-US')} 步`;
            const ml = r.morning_light === true ? ' · 已见晨光' : '';
            stepsDetailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${r.record_date}</b>　步数 ${v}${ml}</span>`;
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 20000,
              grid: { color: '#f5f5f5' },
              ticks: {
                font: { size: 10 },
                color: '#94a3b8',
                stepSize: 5000,
                callback: (v) => (v === 0 ? '0' : `${v / 10000}万`),
              },
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
          },
        },
      });
    }
  }

  // 5. 活动流水（一次性拼接挂载，避免多次 DOM 重排）
  const listEl = byId('dash-activities-list');
  if (!listEl) return;
  if (records.length === 0) {
    listEl.innerHTML = '<p class="text-slate-400 text-center py-2">暂无记录</p>';
    return;
  }

  /** @type {string[]} */
  const cardsHtml = [];
  records.slice().reverse().forEach((r) => {
    const rowExTypes = exerciseTypesOf(r.exercise);
    if (r.journal_text || r.activity_tags || rowExTypes.length > 0 || (r.concerta && r.concerta.taken) || (r.cold_shower && r.cold_shower.enabled)) {
      let tagsHtml = '';
      if (r.activity_tags) {
        try {
          const tags = JSON.parse(r.activity_tags);
          if (Array.isArray(tags)) {
            tagsHtml += tags.map((t) => `<span class="bg-neutral-100 text-neutral-700 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono mr-1">${escapeHtml(t)}</span>`).join('');
          }
        } catch (_) {}
      }
      if (rowExTypes.length > 0) {
        if (rowExTypes.includes('strength')) {
          tagsHtml += '<span class="bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">无氧</span>';
        }
        if (rowExTypes.includes('cardio')) {
          tagsHtml += '<span class="bg-sky-50 text-sky-700 border border-sky-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">有氧</span>';
        }
        rowExTypes.filter((t) => t !== 'strength' && t !== 'cardio').forEach((t) => {
          tagsHtml += `<span class="bg-slate-100 text-slate-700 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">${escapeHtml(t)}</span>`;
        });
      }
      if (r.cold_shower && r.cold_shower.enabled) {
        const csTemp = (r.cold_shower.water_temp === null || r.cold_shower.water_temp === undefined) ? '' : ` ${r.cold_shower.water_temp}℃`;
        let csDur = r.cold_shower.duration;
        let csDurText = '';
        if (csDur !== null && csDur !== undefined && csDur > 0) {
          if (csDur <= 10) csDur = csDur * 60;
          csDurText = ` · ${csDur}s`;
        }
        tagsHtml += `<span class="bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">冷水澡${escapeHtml(csTemp)}${csDurText}</span>`;
      }
      if (r.concerta && r.concerta.taken) {
        const cDose = r.concerta.dose ? ` ${escapeHtml(r.concerta.dose)}mg` : '';
        tagsHtml += `<span class="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">专注达${cDose}</span>`;
      }

      cardsHtml.push(`
        <div class="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <div class="flex justify-between items-start gap-2 mb-1.5">
            <span class="font-bold text-neutral-800 font-mono text-xs shrink-0">${escapeHtml(r.record_date || '')}</span>
            <div class="flex flex-wrap gap-1 items-center justify-end">${tagsHtml}</div>
          </div>
          <p class="text-neutral-600 line-clamp-2">${escapeHtml(r.journal_text || '无文字备注')}</p>
        </div>
      `);
    }
  });
  listEl.innerHTML = cardsHtml.length > 0
    ? cardsHtml.join('')
    : '<p class="text-neutral-400 text-center py-2 font-mono text-xs">暂无活动记录</p>';
}

export {
  openTrendView,
  openTrendDetailView,
  setTrendMetric,
  setTrendDetailMetric,
  activateTrend,
  activateTrendDetail,
};
