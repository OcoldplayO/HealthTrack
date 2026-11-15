/**
 * 数据看板 (Dash View) 业务控制器
 * 包含 4 大单色阶图表、60天详情、周平均趋势
 */
import templateHtml from './dash-view.html?raw';
import { api } from '../../services/api.js';
import { store } from '../../services/state.js';
import { localDateStr, shiftDateStr, getPrevDateStr } from '../../utils/date.js';
import { escapeHtml } from '../../utils/format.js';

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

// 从记录中取出运动类型列表，兼容早期单值 type 字段
function exerciseTypesOf(ex) {
  if (!ex) return [];
  let list = Array.isArray(ex.types) ? ex.types.slice() : [];
  if (list.length === 0 && ex.type) list = [ex.type];
  return list.filter(t => t && t !== 'none');
}

export function initDashView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  initChartDefaults();
  bindEvents();
}

function bindEvents() {
  document.getElementById('btn-range-7')?.addEventListener('click', () => switchDashRange(7));
  document.getElementById('btn-range-30')?.addEventListener('click', () => switchDashRange(30));
  document.getElementById('btn-range-60')?.addEventListener('click', () => switchDashRange(60));
}

export function activateDash() {
  switchDashRange(dashRange);
}

export function switchDashRange(days) {
  dashRange = days;
  store.set({ dashRange: days });
  ['7', '30', '60'].forEach(d => {
    const btn = document.getElementById('btn-range-' + d);
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
    renderDashboardCharts(records);
  } catch (err) {
    console.error('加载看板数据失败:', err);
  }
}

    function renderDashboardCharts(records) {
      const labels = records.map(r => r.record_date.slice(5));
      const weightAmData = records.map(r => r.weight_am);
      const weightPmData = records.map(r => r.weight_pm);
      const waistData = records.map(r => r.waist_size);
      const sleepHoursData = records.map(r => r.sleep_hours);
      const sleepColors = records.map(r => {
        if (r.sleep_tag === 'RED') return '#f43f5e';
        if (r.sleep_tag === 'YELLOW') return '#fbbf24';
        return '#34c759';
      });

      // 统计均值
      const validWeights = weightAmData.filter(v => v !== null && v !== undefined);
      if (validWeights.length > 0) {
        const latest = validWeights[validWeights.length - 1];
        document.getElementById('dash-weight-stat').innerText = `${latest} kg`;
      } else {
        document.getElementById('dash-weight-stat').innerText = '--';
      }

      const validSleeps = sleepHoursData.filter(v => v !== null && v !== undefined);
      if (validSleeps.length > 0) {
        const avgSleep = (validSleeps.reduce((a, b) => a + b, 0) / validSleeps.length).toFixed(1);
        document.getElementById('dash-sleep-stat').innerText = `${avgSleep} 小时 (均值)`;
      } else {
        document.getElementById('dash-sleep-stat').innerText = '--';
      }

      // 1. 体重趋势图（点击某天查看睡前 / 晨起体重与夜间排水差值）
      const weightDetailEl = document.getElementById('dash-weight-detail');
      if (weightDetailEl) {
        weightDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日睡前重 / 晨重</span>';
      }
      const canvasWeight = document.getElementById('chart-weight');
      if (canvasWeight) {
        if (weightChart) {
          weightChart.destroy();
          weightChart = null;
        }
        const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasWeight) : null;
        if (existingChart) existingChart.destroy();

        const ctxWeight = canvasWeight.getContext('2d');
        const weightGradPm = ctxWeight.createLinearGradient(0, 0, 0, 160);
        weightGradPm.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
        weightGradPm.addColorStop(1, 'rgba(245, 158, 11, 0.00)');

        const weightGradAm = ctxWeight.createLinearGradient(0, 0, 0, 160);
        weightGradAm.addColorStop(0, 'rgba(30, 41, 59, 0.06)');
        weightGradAm.addColorStop(1, 'rgba(30, 41, 59, 0.00)');

        weightChart = new Chart(ctxWeight, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '睡前体重',
              data: weightPmData,
              borderColor: '#f59e0b',
              borderWidth: 2.0,
              backgroundColor: weightGradPm,
              fill: true,
              tension: 0.35,
              spanGaps: true,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#f59e0b',
              pointBorderWidth: 2,
              pointRadius: 3.5,
              pointHoverRadius: 5.5,
              pointHitRadius: 16
            },
            {
              label: '晨起体重',
              data: weightAmData,
              borderColor: '#1e293b',
              borderWidth: 2.2,
              backgroundColor: weightGradAm,
              fill: true,
              tension: 0.35,
              spanGaps: true,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#1e293b',
              pointBorderWidth: 2,
              pointRadius: 3.5,
              pointHoverRadius: 5.5,
              pointHitRadius: 16
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              itemSort: (a, b) => a.datasetIndex - b.datasetIndex
            }
          },
          onClick: (evt, elements) => {
            if (!elements || !elements.length) return;
            const r = records[elements[0].index];
            if (!r) return;
            const fmtW = (v) => (v === null || v === undefined) ? '--' : `${v} kg`;
            const am = r.weight_am, pm = r.weight_pm;
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
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } }
          }
        }
      });
    }

      // 2. 腰围趋势图（点击某天查看当日腰围）
      const validWaists = waistData.filter(v => v !== null && v !== undefined);
      if (validWaists.length > 0) {
        document.getElementById('dash-waist-stat').innerText = `${validWaists[validWaists.length - 1]} cm`;
      } else {
        document.getElementById('dash-waist-stat').innerText = '--';
      }
      const waistDetailEl = document.getElementById('dash-waist-detail');
      if (waistDetailEl) {
        waistDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日腰围</span>';
      }
      const canvasWaist = document.getElementById('chart-waist');
      if (canvasWaist) {
        if (waistChart) {
          waistChart.destroy();
          waistChart = null;
        }
        const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasWaist) : null;
        if (existingChart) existingChart.destroy();

        const ctxWaist = canvasWaist.getContext('2d');
        const waistGrad = ctxWaist.createLinearGradient(0, 0, 0, 160);
        waistGrad.addColorStop(0, 'rgba(124, 58, 237, 0.10)');
        waistGrad.addColorStop(1, 'rgba(124, 58, 237, 0.00)');

        waistChart = new Chart(ctxWaist, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: '腰围',
            data: waistData,
            borderColor: '#7c3aed',
            borderWidth: 2.2,
            backgroundColor: waistGrad,
            fill: true,
            tension: 0.35,
            spanGaps: true,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#7c3aed',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 5.5,
            pointHitRadius: 16
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          onClick: (evt, elements) => {
            if (!elements || !elements.length) return;
            const r = records[elements[0].index];
            if (!r) return;
            const waistText = (r.waist_size === null || r.waist_size === undefined) ? '--' : `${r.waist_size} cm`;
            waistDetailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${r.record_date}</b>　腰围 ${waistText}</span>`;
          },
          scales: {
            y: { beginAtZero: false, grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } }
          }
        }
      });
    }

      // 3. 睡眠柱状图（点击某根柱子查看当日就寝 / 起床时间）
      const sleepDetailEl = document.getElementById('dash-sleep-detail');
      if (sleepDetailEl) {
        sleepDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击柱图查看就寝 / 起床时间</span>';
      }
      const canvasSleep = document.getElementById('chart-sleep');
      if (canvasSleep) {
        if (sleepChart) {
          sleepChart.destroy();
          sleepChart = null;
        }
        const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasSleep) : null;
        if (existingChart) existingChart.destroy();

        const ctxSleep = canvasSleep.getContext('2d');
        sleepChart = new Chart(ctxSleep, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: sleepHoursData,
            backgroundColor: sleepColors,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          onHover: (evt, elements) => {
            evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
          },
          onClick: (evt, elements) => {
            if (!elements || !elements.length) return;
            const r = records[elements[0].index];
            if (!r) return;
            const tagText = r.sleep_tag === 'RED' ? '熬夜' : (r.sleep_tag === 'YELLOW' ? '轻度' : '正常');
            const hours = (r.sleep_hours === null || r.sleep_hours === undefined) ? '--' : `${r.sleep_hours} 小时`;
            sleepDetailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-neutral-800 font-mono">${r.record_date}</b>　就寝 ${r.sleep_start_time || '--'} · 起床 ${r.sleep_end_time || '--'} · ${hours} · ${tagText}</span>`;
          },
          scales: {
            y: { beginAtZero: true, max: 12, grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } }
          }
        }
      });
    }

      // 4. 步数趋势图（缺失日断点，不补 0；纵轴封顶 2 万）
      const stepsData = records.map(r => (r.steps === null || r.steps === undefined) ? null : Number(r.steps));
      const validSteps = stepsData.filter(v => v !== null);
      if (validSteps.length > 0) {
        const avgSteps = Math.round(validSteps.reduce((a, b) => a + b, 0) / validSteps.length);
        document.getElementById('dash-steps-stat').innerText = `${avgSteps.toLocaleString('en-US')} 步 (均值)`;
      } else {
        document.getElementById('dash-steps-stat').innerText = '--';
      }
      const stepsDetailEl = document.getElementById('dash-steps-detail');
      if (stepsDetailEl) {
        stepsDetailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↑ 点击折线查看当日步数</span>';
      }
      const canvasSteps = document.getElementById('chart-steps');
      if (canvasSteps) {
        if (stepsChart) {
          stepsChart.destroy();
          stepsChart = null;
        }
        const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvasSteps) : null;
        if (existingChart) existingChart.destroy();

        const ctxSteps = canvasSteps.getContext('2d');
        const stepsGrad = ctxSteps.createLinearGradient(0, 0, 0, 160);
        stepsGrad.addColorStop(0, 'rgba(234, 88, 12, 0.16)');
        stepsGrad.addColorStop(1, 'rgba(234, 88, 12, 0.00)');

        stepsChart = new Chart(ctxSteps, {
        type: 'line',
        data: {
          labels: labels,
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
            pointHitRadius: 16
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          onHover: (evt, elements) => {
            evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
          },
          onClick: (evt, elements) => {
            if (!elements || !elements.length) return;
            const r = records[elements[0].index];
            if (!r) return;
            const v = (r.steps === null || r.steps === undefined) ? '--' : `${Number(r.steps).toLocaleString('en-US')} 步`;
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
                callback: v => v === 0 ? '0' : `${v / 10000}万`
              }
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } }
          }
        }
      });
    }

      // 5. 活动流水
      const listEl = document.getElementById('dash-activities-list');
      listEl.innerHTML = '';
      if (records.length === 0) {
        listEl.innerHTML = '<p class="text-slate-400 text-center py-2">暂无记录</p>';
      } else {
        records.slice().reverse().forEach(r => {
          const rowExTypes = exerciseTypesOf(r.exercise);
          if (r.journal_text || r.activity_tags || rowExTypes.length > 0 || (r.concerta && r.concerta.taken) || (r.cold_shower && r.cold_shower.enabled)) {
            let tagsHtml = '';
            if (r.activity_tags) {
              try {
                const tags = JSON.parse(r.activity_tags);
                if (Array.isArray(tags)) {
                  tagsHtml += tags.map(t => `<span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">${escapeHtml(t)}</span>`).join('');
                }
              } catch(e){}
            }
            if (rowExTypes.length > 0) {
              if (rowExTypes.includes('strength')) {
                tagsHtml += '<span class="bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">无氧</span>';
              }
              if (rowExTypes.includes('cardio')) {
                tagsHtml += '<span class="bg-sky-50 text-sky-700 border border-sky-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">有氧</span>';
              }
              rowExTypes.filter(t => t !== 'strength' && t !== 'cardio').forEach(t => {
                tagsHtml += `<span class="bg-slate-100 text-slate-700 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">${escapeHtml(t)}</span>`;
              });
            }
            if (r.cold_shower && r.cold_shower.enabled) {
              const csTemp = (r.cold_shower.water_temp === null || r.cold_shower.water_temp === undefined) ? '' : ` ${r.cold_shower.water_temp}℃`;
              tagsHtml += `<span class="bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">冷水澡${escapeHtml(csTemp)}</span>`;
            }
            if (r.concerta && r.concerta.taken) {
              const cDose = r.concerta.dose ? ` ${escapeHtml(r.concerta.dose)}mg` : '';
              tagsHtml += `<span class="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">专注达${cDose}</span>`;
            }

            listEl.innerHTML += `
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex justify-between items-start gap-2 mb-1.5">
                  <span class="font-bold text-slate-800 font-mono text-xs shrink-0">${escapeHtml(r.record_date || '')}</span>
                  <div class="flex flex-wrap gap-1 items-center justify-end">${tagsHtml}</div>
                </div>
                <p class="text-slate-600 line-clamp-2">${escapeHtml(r.journal_text || '无文字备注')}</p>
              </div>
            `;
          }
        });
      }
    }

    // ===== 周平均趋势分析（独立视图，前端按自然周聚合，不改后端接口） =====
    // 口径固定写死如下，改动需同步 SYSTEM_DESIGN.md §4.4.2：
    //  - 自然周 = 周一 ~ 周日；共 12 周（含当前未满周），由旧到新。
    //  - 均值线 = 该周内所有日值的算术平均；某周 0 天数据 → 断点（不按 0 计）。
    //  - 区间带 = 该周内所有日值的 min ~ max（非标准差）。
    //  - 置信：1~3 天 → 低置信（空心节点 + 虚线 + tooltip 标注）；>= 4 天 → 正常。
    const TREND_WEEKS = 12;
    const TREND_METRICS = {
      weight: { label: '体重周均值 (kg)', field: 'weight_am', unit: 'kg', color: '#1e293b', band: 'rgba(30, 41, 59, 0.08)' },
      waist: { label: '腰围周均值 (cm)', field: 'waist_size', unit: 'cm', color: '#7c3aed', band: 'rgba(124, 58, 237, 0.08)' },
      sleep: { label: '睡眠周均值 (小时)', field: 'sleep_hours', unit: '小时', color: '#4f46e5', band: 'rgba(79, 70, 229, 0.12)' },
      steps: { label: '步数周均值 (步)', field: 'steps', unit: '步', color: '#ea580c', band: 'rgba(234, 88, 12, 0.08)', int: true }
    };
    let trendState = { metric: 'weight', records: [], buckets: [], aggs: [] };
    let trendChart = null;

    // 取本地日期所在自然周的周一（周一=0 … 周日=6）
    function trendMondayOf(d) {
      const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
      return x;
    }

    // 构造近 12 个自然周桶（由旧到新，末桶为当前周）
    function trendBuildBuckets() {
      const monday = trendMondayOf(new Date());
      const buckets = [];
      for (let i = TREND_WEEKS - 1; i >= 0; i--) {
        const s = new Date(monday); s.setDate(monday.getDate() - i * 7);
        const e = new Date(s); e.setDate(s.getDate() + 6);
        buckets.push({ start: localDateStr(s), end: localDateStr(e) });
      }
      return buckets;
    }

    function trendAggregate(records, buckets, field) {
      return buckets.map(b => {
        const vals = [];
        records.forEach(r => {
          if (r.record_date >= b.start && r.record_date <= b.end) {
            const v = r[field];
            if (v !== null && v !== undefined && v !== '' && !isNaN(Number(v))) vals.push(Number(v));
          }
        });
        if (vals.length === 0) return { avg: null, min: null, max: null, n: 0 };
        const sum = vals.reduce((a, c) => a + c, 0);
        return { avg: sum / vals.length, min: Math.min(...vals), max: Math.max(...vals), n: vals.length };
      });
    }

    function openTrendView() {
      setTrendMetric(trendState.metric);
      if (typeof window.switchTab === 'function') window.switchTab('trend');
    }

    function setTrendMetric(metric) {
      trendState.metric = metric;
      ['weight', 'waist', 'sleep', 'steps'].forEach(m => {
        const el = document.getElementById(`trend-tab-${m}`);
        if (!el) return;
        el.className = m === metric
          ? 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all'
          : 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all';
      });
      if (store.state.currentTab === 'trend') renderTrendChart();
    }

    async function loadTrendData() {
      const buckets = trendBuildBuckets();
      const startStr = buckets[0].start;
      const endStr = localDateStr(new Date());
      try {
        const res = await api.getHistoryRecords(startStr, endStr);
        trendState.records = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (e) {
        trendState.records = [];
      }
      renderTrendChart();
    }

    function renderTrendChart() {
      const cfg = TREND_METRICS[trendState.metric];
      const fmtTrend = v => cfg.int ? Math.round(v).toLocaleString('en-US') : v.toFixed(1);
      const buckets = trendBuildBuckets();
      const aggs = trendAggregate(trendState.records, buckets, cfg.field);
      trendState.buckets = buckets;
      trendState.aggs = aggs;

      const labels = buckets.map(b => b.start.slice(5)); // MM-DD（该周周一）
      const maxData = aggs.map(a => a.max);
      const minData = aggs.map(a => a.min);
      const avgData = aggs.map(a => a.avg);
      const lowConf = aggs.map(a => a.n >= 1 && a.n <= 3);

      // 顶部统计：取最近一个有数据的自然周
      const labelEl = document.getElementById('trend-metric-label');
      if (labelEl) labelEl.innerText = cfg.label;
      const statEl = document.getElementById('trend-metric-stat');
      const noteEl = document.getElementById('trend-metric-note');
      let lastIdx = -1;
      for (let i = aggs.length - 1; i >= 0; i--) { if (aggs[i].n > 0) { lastIdx = i; break; } }
      if (lastIdx >= 0) {
        const a = aggs[lastIdx], b = buckets[lastIdx];
        if (statEl) statEl.innerText = `${fmtTrend(a.avg)} ${cfg.unit}`;
        if (noteEl) noteEl.innerHTML = `${b.start.slice(5)}~${b.end.slice(5)} 周均值<br>${a.n} 天数据${a.n <= 3 ? '（低置信）' : ''}`;
      } else {
        if (statEl) statEl.innerText = '--';
        if (noteEl) noteEl.innerHTML = '近 12 周暂无数据';
      }

      const detailEl = document.getElementById('trend-detail');
      if (detailEl) {
        detailEl.innerHTML = lastIdx >= 0
          ? '<span class="font-mono text-[10px] text-neutral-400">↑ 点击节点查看该周均值与区间</span>'
          : '<span>ℹ️</span><span>近 12 周暂无该指标数据，记录几天后再来看看</span>';
      }

      const canvas = document.getElementById('chart-trend');
      if (!canvas) return;
      if (trendChart) {
        trendChart.destroy();
        trendChart = null;
      }
      const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvas) : null;
      if (existingChart) existingChart.destroy();
      const ctx = canvas.getContext('2d');
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
              tension: 0.25
            },
            {
              label: '周内最小',
              data: minData,
              borderColor: 'transparent',
              backgroundColor: 'transparent',
              pointRadius: 0,
              pointHoverRadius: 0,
              spanGaps: false,
              tension: 0.25
            },
            {
              label: '周均值',
              data: avgData,
              borderColor: cfg.color,
              backgroundColor: cfg.color,
              tension: 0.25,
              spanGaps: false,
              pointHitRadius: 16,
              pointRadius: c => lowConf[c.dataIndex] ? 4 : 3,
              pointBackgroundColor: c => lowConf[c.dataIndex] ? '#ffffff' : cfg.color,
              pointBorderColor: cfg.color,
              pointBorderWidth: c => lowConf[c.dataIndex] ? 2 : 0,
              segment: { borderDash: c => (lowConf[c.p1DataIndex] || lowConf[c.p0DataIndex]) ? [5, 4] : undefined }
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              filter: item => item.datasetIndex === 2,
              displayColors: false,
              callbacks: {
                title: items => {
                  const b = buckets[items[0].dataIndex];
                  return `${b.start} ~ ${b.end}`;
                },
                label: item => {
                  const a = aggs[item.dataIndex];
                  if (!a || a.n === 0) return '该周无数据';
                  return [
                    `周均值：${fmtTrend(a.avg)} ${cfg.unit}`,
                    `区间：${fmtTrend(a.min)} ~ ${fmtTrend(a.max)}`,
                    `样本：${a.n} 天${a.n <= 3 ? '（低置信）' : ''}`
                  ];
                }
              }
            }
          },
          scales: {
            y: { beginAtZero: false, ticks: { font: { size: 10 } } },
            x: { ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } }
          },
          onClick: (evt, elements) => {
            let idx = -1;
            (elements || []).forEach(e => { if (e.datasetIndex === 2) idx = e.index; });
            if (idx < 0) return;
            const a = aggs[idx], b = buckets[idx];
            if (!a || a.n === 0) return;
            detailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span><b class="text-slate-700">${b.start} ~ ${b.end}</b>　均值 ${a.avg.toFixed(1)} ${cfg.unit} · 区间 ${a.min.toFixed(1)}~${a.max.toFixed(1)} · ${a.n} 天${a.n <= 3 ? '（低置信）' : ''}</span>`;
          }
        }
      });
    }

    // ===== 60天详情（独立视图，方案 A；前端按日聚合，不改后端接口） =====
    // 口径固定写死如下，改动需同步 SYSTEM_DESIGN.md §4.4.1：
    //  - 近 60 个自然日逐日（含今天），由旧到新。
    //  - 缺失日 = 断点（spanGaps:false），严禁以 0 填充。
    //  - 竖屏手机 / 桌面窄列：固定日宽（每点 26px）横向滚动；
    //    手机横屏：临时放宽手机框，60 点压进一屏（x 轴约每 3 天一刻度）。
    const TD_DAYS = 60;
    const TD_POINT_PX = 26;                       // 竖屏每点固定宽度
    const TD_PORTRAIT_W = TD_DAYS * TD_POINT_PX;  // 竖屏图宽 1560px
    const TD_FIT_MIN_W = 560;                     // 容器宽于此值即视为「够宽」，60 点压进一屏
    const TD_METRICS = {
      weight: { label: '体重逐日 (kg)', field: 'weight_am', unit: 'kg', color: '#1e293b' },
      waist: { label: '腰围逐日 (cm)', field: 'waist_size', unit: 'cm', color: '#7c3aed' },
      sleep: { label: '睡眠时长逐日 (小时)', field: 'sleep_hours', unit: '小时', color: '#4f46e5', avg: true },
      // 步数：纵轴封顶 2 万（特殊情况也够用），缺失日断点
      steps: { label: '步数逐日 (步)', field: 'steps', unit: '步', color: '#ea580c', avg: true, yMax: 20000, yStep: 5000, fmt: v => v.toLocaleString('en-US') }
    };
    let trendDetailState = { metric: 'weight', records: [] };
    let trendDetailChart = null;

    // 构造近 60 个自然日（由旧到新，含今天）
    function tdBuildDays() {
      const days = [];
      const now = new Date();
      for (let i = TD_DAYS - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        d.setDate(d.getDate() - i);
        days.push(localDateStr(d));
      }
      return days;
    }

    // 手机横屏（且屏幕较矮，排除桌面宽窗口）：这是「60天详情」能整屏铺满的前提
    function tdIsPhoneLandscape() {
      return window.matchMedia('(orientation: landscape) and (max-height: 600px)').matches;
    }

    // 仅在「60天详情」视图 + 手机横屏时临时放宽手机框；其余情况一律维持原样
    function tdSyncFrame() {
      const frame = document.getElementById('app-frame');
      if (!frame) return;
      frame.classList.toggle('frame-wide', store.state.currentTab === 'trend-detail' && tdIsPhoneLandscape());
    }

    // 依当前容器可用宽度设定图表宽度：够宽（手机横屏整屏铺满）→ 60 点压进一屏；
    // 否则（竖屏手机 / 桌面窄列）→ 固定日宽横向滚动。测量的是容器实测宽度，可自我校正。
    function tdApplyWidth() {
      const box = document.getElementById('td-chart-box');
      const scroll = document.getElementById('td-chart-scroll');
      if (!box || !scroll) return;
      const fit = scroll.clientWidth >= TD_FIT_MIN_W;
      box.style.width = fit ? '100%' : `${TD_PORTRAIT_W}px`;
      // 横屏竖向空间紧张，图高收窄以免被底部导航裁切
      box.style.height = fit ? '150px' : '220px';
      if (trendDetailChart) trendDetailChart.resize();
    }

    // 方向 / 尺寸变化后重排（先同步手机框宽度，再按新容器宽度重绘图表）
    function tdRelayout() {
      tdSyncFrame();
      tdApplyWidth();
    }

    // 方向变化监听（MediaQueryList.addEventListener 在旧 WebView 上不可用，回退 addListener）
    function tdWatchOrientation() {
      const handler = () => { if (store.state.currentTab === 'trend-detail') tdRelayout(); };
      window.addEventListener('resize', handler);
      const mq = window.matchMedia('(orientation: landscape) and (max-height: 600px)');
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener) mq.addListener(handler);
    }

    export function openTrendDetailView() {
      setTrendDetailMetric(trendDetailState.metric);
      if (typeof window.switchTab === 'function') window.switchTab('trend-detail');
    }

    export function setTrendDetailMetric(metric) {
      trendDetailState.metric = metric;
      ['weight', 'waist', 'sleep', 'steps'].forEach(m => {
        const el = document.getElementById(`td-tab-${m}`);
        if (!el) return;
        el.className = m === metric
          ? 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-neutral-900 text-white transition-all'
          : 'flex-1 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 transition-all';
      });
      if (store.state.currentTab === 'trend-detail') renderTrendDetailChart();
    }

    export async function loadTrendDetailData() {
      const days = tdBuildDays();
      const startStr = days[0];
      const endStr = days[days.length - 1];
      try {
        const res = await api.getHistoryRecords(startStr, endStr);
        trendDetailState.records = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (e) {
        trendDetailState.records = [];
      }
      renderTrendDetailChart();
    }

    // 当日详情文案（体重→晨重/睡前/夜间排水；腰围→当日腰围；睡眠→就寝/起床/时长/档位）
    function tdDetailText(metric, r) {
      if (metric === 'weight') {
        const fmtW = v => (v === null || v === undefined) ? '--' : `${v} kg`;
        const am = r.weight_am, pm = r.weight_pm;
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
      const byDate = {};
      trendDetailState.records.forEach(r => { byDate[r.record_date] = r; });

      // 逐日取值：缺失日 = null（断点，不按 0 计）
      const values = days.map(ds => {
        const r = byDate[ds];
        if (!r) return null;
        const v = r[cfg.field];
        if (v === null || v === undefined || v === '' || isNaN(Number(v))) return null;
        return Number(v);
      });
      const labels = days.map(ds => ds.slice(5));

      const detailEl = document.getElementById('td-detail');
      detailEl.innerHTML = '<span class="font-mono text-[10px] text-neutral-400">↔ 拖动看全 60 天 · 点击节点看当日详情</span>';

      document.getElementById('td-metric-label').innerText = cfg.label;
      const statEl = document.getElementById('td-metric-stat');
      const noteEl = document.getElementById('td-metric-note');
      const valid = values.filter(v => v !== null);
      if (valid.length > 0) {
        if (cfg.avg) {
          const avg = valid.reduce((a, c) => a + c, 0) / valid.length;
          statEl.innerText = trendDetailState.metric === 'sleep'
            ? `${avg.toFixed(1)} 小时 (均值)`
            : `${Math.round(avg).toLocaleString('en-US')} 步 (均值)`;
        } else {
          statEl.innerText = `${valid[valid.length - 1]} ${cfg.unit}`;
        }
        noteEl.innerHTML = `近 ${TD_DAYS} 天逐日<br>有效 ${valid.length} 天`;
      } else {
        statEl.innerText = '--';
        noteEl.innerHTML = `近 ${TD_DAYS} 天暂无数据`;
      }

      const canvas = document.getElementById('chart-trend-detail');
      if (!canvas) return;
      if (trendDetailChart) {
        trendDetailChart.destroy();
        trendDetailChart = null;
      }
      const existingChart = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(canvas) : null;
      if (existingChart) existingChart.destroy();
      const ctx = canvas.getContext('2d');
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
            spanGaps: false,        // 缺失日断点，严禁以 0 填充
            pointHitRadius: 16,
            pointRadius: 3,
            pointBackgroundColor: cfg.color
          }]
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
                title: items => days[items[0].dataIndex],
                label: item => {
                  const v = values[item.dataIndex];
                  if (v === null) return '当日无数据';
                  return `数值：${cfg.fmt ? cfg.fmt(v) : v} ${cfg.unit}`;
                }
              }
            }
          },
          scales: {
            y: cfg.yMax ? {
              beginAtZero: true,
              max: cfg.yMax,
              ticks: {
                font: { size: 10 },
                stepSize: cfg.yStep,
                callback: v => v === 0 ? '0' : `${v / 10000}万`
              }
            } : { beginAtZero: false, ticks: { font: { size: 10 } } },
            // 60 点，x 轴约每 3 天一个刻度（maxTicksLimit = 20）；横屏更窄时由 autoSkip 自动稀疏
            x: { ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 20 } }
          },
          onClick: (evt, elements) => {
            if (!elements || !elements.length) return;
            const idx = elements[0].index;
            const ds = days[idx];
            const r = byDate[ds];
            if (!r || values[idx] === null) return;
            detailEl.innerHTML = `<span class="font-mono text-neutral-400">·</span><span>${tdDetailText(trendDetailState.metric, r)}</span>`;
          }
        }
      });

      // 应用当前容器宽度对应的模式（先同步手机框宽度，再设定图表宽度）
      tdRelayout();
    }

    tdWatchOrientation();

export function activateTrend() {
  loadTrendData();
}

export function activateTrendDetail() {
  loadTrendDetailData();
}

// 导出与全局挂载
window.switchDashRange = switchDashRange;
window.openTrendView = openTrendView;
window.openTrendDetailView = openTrendDetailView;
window.setTrendMetric = setTrendMetric;
window.setTrendDetailMetric = setTrendDetailMetric;
