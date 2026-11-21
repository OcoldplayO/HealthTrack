/**
 * 记一笔 (Log View) 业务控制器
 * 完整实现：晨起/睡前体重、腰围、睡眠计算、运动、专注达、冷水澡、午餐结构化、草稿及较昨日变化(Δ)
 */
import templateHtml from './log-view.html?raw';
import { api } from '../../services/api.js';
import { localDateStr, shiftDateStr, getPrevDateStr } from '../../utils/date.js';
import { showToast } from '../../components/Toast.js';
import { appConfirm } from '../../utils/dialog.js';
import { buttonById, byId, closestEl, inputById, textareaById } from '../../utils/dom.js';

/**
 * 查询可读写 .value 的表单控件（input / textarea / select）
 * @param {string} id
 * @returns {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null}
 */
function controlById(id) {
  const el = document.getElementById(id);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    return el;
  }
  return null;
}

/**
 * @param {string} id
 * @returns {string}
 */
function controlVal(id) {
  return controlById(id)?.value || '';
}

let loadedDate = localDateStr(new Date());
let logDirty = false;
let suppressDirty = false;
let logSavedAt = '';
let logHasRecord = false;
let draftTimer = null;
let yesterdayRecord = null;

let morningLightState = null;
let stepsState = { value: null, prefilled: null, autoDetected: false };
let prevStepsValue = null;
let lunchState = { touched: false };

let exerciseState = {
  types: [],
  intensity: 'light',
};

let coldShowerState = {
  timing: '07:30',
  feeling: 'refreshed',
};

let sleepThresholds = {
  green: '23:30',
  yellow: '01:00',
};

const EXERCISE_TYPE_ORDER = ['cardio', 'strength'];

const LUNCH_TEXT = {
  protein: { chicken: '鸡胸', egg: '蛋', fish: '鱼', beef: '牛肉', soy: '豆制品', yogurt: '酸奶', other: '其他' },
  staple: { rice: '白米饭', noodle: '面条', grains: '杂粮', potato: '薯类', none: '无主食' },
  carb: { lt20: '<20g', '20_35': '20–35g', '35_50': '35–50g', gt50: '>50g' },
  cook: { steam: '蒸煮', stir_fry: '炒', fry: '煎炸', raw: '生食', takeout: '外卖' },
};

export async function initLogView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  pruneStaleDrafts();
  bindEvents();
  await loadSleepThresholds();
  await loadRecordForDate(loadedDate);
}

async function loadSleepThresholds() {
  try {
    const res = await api.getConfig();
    const d = res.data || res;
    if (d.sleep_green_before) sleepThresholds.green = d.sleep_green_before;
    if (d.sleep_yellow_before) sleepThresholds.yellow = d.sleep_yellow_before;
    handleSleepCalculation();
  } catch (_) {}
}

window.addEventListener('sleep-thresholds-updated', (e) => {
  if (e instanceof CustomEvent && e.detail) {
    if (e.detail.green) sleepThresholds.green = e.detail.green;
    if (e.detail.yellow) sleepThresholds.yellow = e.detail.yellow;
    handleSleepCalculation();
  }
});

export async function loadRecordForDate(dateStr) {
  loadedDate = dateStr;
  suppressDirty = true;
  const dateInput = inputById('input-date');
  if (dateInput) dateInput.value = dateStr;

  let rec = null;
  try {
    const weekStart = shiftDateStr(dateStr, -6);
    const res = await api.getHistoryRecords(weekStart, dateStr);
    const weekRecords = (res && Array.isArray(res.data)) ? res.data : (Array.isArray(res) ? res : []);

    yesterdayRecord = weekRecords.find((r) => r.record_date === getPrevDateStr(dateStr)) || null;
    rec = weekRecords.find((r) => r.record_date === dateStr) || null;

    applyLogState(rec);
    updateStepsMeta(weekRecords, dateStr);
    syncStepsSlider();
    updateLunchYesterdayNote();
    logHasRecord = !!rec;
    logSavedAt = rec ? timeFromRecord(rec) : '';
  } catch (err) {
    console.error('加载单日记录失败:', err);
  } finally {
    logDirty = false;
    suppressDirty = false;
    updateDiffDisplay();
    updateLogCompleteness();
    renderSaveBar();

    const draft = readDraft(dateStr);
    if (draft) {
      suppressDirty = true;
      applyLogState(draft);
      syncStepsSlider();
      suppressDirty = false;
      logDirty = true;
      updateLogCompleteness();
      renderSaveBar();
      showToast('已恢复上次未保存的草稿');
    }

    const isToday = (dateStr === localDateStr(new Date()));
    if (isToday && stepsState.value === null) {
      if (hasNativeStepBridge() && typeof window.HealthTrack.hasStepPermission === 'function' && window.HealthTrack.hasStepPermission()) {
        const rawSteps = window.HealthTrack.getTodaySteps();
        if (rawSteps > 0) {
          stepsState.value = Math.max(0, Math.min(30000, Math.round(rawSteps)));
          stepsState.autoDetected = true;
          syncStepsSlider();
          updateLogCompleteness();
        }
      }
    }
    updateStepsSourceUI(isToday);
  }
}

function timeFromRecord(rec) {
  if (!rec || !rec.updated_at) return '';
  const d = new Date(rec.updated_at);
  if (isNaN(d.getTime()) || d.getFullYear() < 2000) return '';
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function applyLogState(s) {
  s = s || {};
  const setVal = (id, v) => {
    const el = controlById(id);
    if (el) el.value = v === null || v === undefined ? '' : String(v);
  };

  setVal('input-weight-am', s.weight_am);
  setVal('input-weight-pm', s.weight_pm);
  setVal('input-waist', s.waist_size);
  setVal('input-journal', s.journal_text || s.journal || '');
  autoResizeJournal();
  syncJournalClearBtn();

  setVal('sleepBedTime', s.sleep_start_time || s.sleep_bed_time || '00:30');
  setVal('sleepWakeTime', s.sleep_end_time || s.sleep_wake_time || '07:15');
  handleSleepCalculation();
  if (s.sleep_hours !== null && s.sleep_hours !== undefined) {
    const durEl = inputById('sleepDuration');
    if (durEl) durEl.value = String(s.sleep_hours);
  }

  // 运动
  const ex = s.exercise || {};
  const exTypes = Array.isArray(ex.types) ? ex.types.slice() : (ex.type && ex.type !== 'none' ? [ex.type] : []);
  setExerciseTypes(exTypes);
  if (exTypes.length > 0) {
    setExerciseIntensity(ex.intensity || 'light');
    setVal('exerciseDuration', ex.duration || 40);
    setVal('exerciseItems', ex.items || '');
  } else {
    setVal('exerciseDuration', 40);
    setVal('exerciseItems', '');
  }

  // 专注达
  const con = s.concerta;
  const conTaken = !!(con && con.taken);
  const conCheck = inputById('concertaEnabled');
  if (conCheck) conCheck.checked = conTaken;
  toggleConcerta(conTaken);
  if (conTaken) {
    setVal('concertaTime', con.time || '08:00');
    setVal('concertaDose', String(con.dose || 36));
    setVal('focusWork', con.focus_work || 4);
    const fwEl = byId('focusWorkText');
    if (fwEl) fwEl.innerText = (con.focus_work || 4) + '分';
  }
  const seKeys = (con && con.side_effects) || [];
  document.querySelectorAll('#concertaSideEffects .chip').forEach((c) => {
    c.classList.toggle('active', seKeys.includes(c.getAttribute('data-key')));
  });
  const compKeys = (con && con.compensations) || [];
  document.querySelectorAll('#concertaCompensations .chip').forEach((c) => {
    c.classList.toggle('active', compKeys.includes(c.getAttribute('data-key')));
  });

  // 冷水澡
  const cs = s.cold_shower;
  const csOn = !!(cs && cs.enabled);
  const csCheck = inputById('coldShowerEnabled');
  if (csCheck) csCheck.checked = csOn;
  toggleColdShower(csOn);

  // 兼容旧版 timing: 'morning' -> '07:30', 'post_workout' -> '18:30', 'evening' -> '22:30'
  let csTime = (cs && cs.timing) || '07:30';
  if (csTime === 'morning') csTime = '07:30';
  else if (csTime === 'post_workout') csTime = '18:30';
  else if (csTime === 'evening') csTime = '22:30';
  setColdShowerTiming(csTime);
  setColdShowerFeeling((cs && cs.feeling) || 'refreshed');

  // 时长：秒为单位，兼容历史以“分钟”存储的记录 (<= 10 视为分钟转为秒)
  let csDur = (cs && cs.duration) !== undefined && cs.duration !== null ? Number(cs.duration) : 60;
  if (csDur > 0 && csDur <= 10) {
    csDur = csDur * 60;
  }
  setColdShowerDuration(csDur);
  setVal('coldShowerWaterTemp', cs && cs.water_temp !== null && cs.water_temp !== undefined ? cs.water_temp : '');

  // 晨光 / 步数 / 午餐
  morningLightState = s.morning_light === true ? 'yes' : (s.morning_light === false ? 'no' : null);
  syncMorningLightUI();
  stepsState.value = s.steps === null || s.steps === undefined ? null : Number(s.steps);
  stepsState.autoDetected = false;
  syncStepsSlider();
  applyLunch(s.lunch || null);
}

function collectLogState() {
  const dateStr = loadedDate || inputById('input-date')?.value || localDateStr(new Date());
  const val = controlVal;
  const numOrNull = (v) => (v === '' || v === null || v === undefined || isNaN(parseFloat(v)) ? null : parseFloat(v));

  const sideEffects = [];
  document.querySelectorAll('#concertaSideEffects .chip.active').forEach((c) => {
    const k = c.getAttribute('data-key');
    if (k) sideEffects.push(k);
  });
  const compensations = [];
  document.querySelectorAll('#concertaCompensations .chip.active').forEach((c) => {
    const k = c.getAttribute('data-key');
    if (k) compensations.push(k);
  });

  const concertaTaken = !!inputById('concertaEnabled')?.checked;
  const concerta = concertaTaken
    ? {
        taken: true,
        time: val('concertaTime') || '08:00',
        dose: parseInt(val('concertaDose'), 10) || 36,
        focus_work: parseInt(val('focusWork'), 10) || 4,
        focus_study: 4,
        daily_tasks: 4,
        social: 4,
        gaming: 4,
        crash_time: '18:00',
        side_effects: sideEffects,
        compensations: compensations,
      }
    : { taken: false };

  const tempRaw = val('coldShowerWaterTemp');
  return {
    record_date: dateStr,
    weight_am: numOrNull(val('input-weight-am')),
    weight_pm: numOrNull(val('input-weight-pm')),
    waist_size: numOrNull(val('input-waist')),
    sleep_hours: numOrNull(val('sleepDuration')),
    sleep_start_time: val('sleepBedTime') || null,
    sleep_end_time: val('sleepWakeTime') || null,
    journal_text: val('input-journal') || '',
    exercise: {
      types: exerciseState.types.slice(),
      type: exerciseState.types[0] || 'none',
      duration: parseInt(val('exerciseDuration'), 10) || 0,
      intensity: exerciseState.intensity,
      items: val('exerciseItems') || '',
    },
    cold_shower: {
      enabled: !!inputById('coldShowerEnabled')?.checked,
      timing: val('coldShowerTime') || coldShowerState.timing || '07:30',
      duration: parseInt(val('coldShowerDuration'), 10) || 60,
      water_temp: tempRaw === '' ? null : parseFloat(tempRaw),
      feeling: coldShowerState.feeling,
    },
    concerta: concerta,
    morning_light: morningLightState === 'yes' ? true : (morningLightState === 'no' ? false : null),
    steps: stepsState.value,
    lunch: lunchPayload(),
  };
}

async function saveCurrentRecord() {
  const payload = collectLogState();
  const dateStr = payload.record_date;
  const btn = buttonById('btn-save-log');
  if (btn) btn.disabled = true;

  try {
    const res = await api.saveRecord(payload);
    if (res && (res.code === 200 || res.status === 200 || !res.code)) {
      logDirty = false;
      logHasRecord = true;
      logSavedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
      if (draftTimer) {
        clearTimeout(draftTimer);
        draftTimer = null;
      }
      clearDraft(dateStr);
      renderSaveBar();
      showToast('✓ 保存成功');
      loadRecordForDate(dateStr);
    } else {
      showToast((res && res.message) || '保存失败', false);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showToast('保存失败: ' + msg, false);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ---------- 晨光 ----------
function setMorningLight(val) {
  morningLightState = morningLightState === val ? null : val;
  syncMorningLightUI();
  markDirty();
}

function syncMorningLightUI() {
  document.querySelectorAll('#morningLightPills button').forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-val') === morningLightState);
  });
}

// ---------- 步数 ----------
function hasNativeStepBridge() {
  return !!(window.HealthTrack && typeof window.HealthTrack.isStepSensorAvailable === 'function' && window.HealthTrack.isStepSensorAvailable());
}

function updateStepsSourceUI(isToday) {
  const badge = document.getElementById('steps-source-badge');
  const syncBtn = document.getElementById('btn-sync-steps');
  if (!isToday || !hasNativeStepBridge()) {
    if (badge) badge.classList.add('hidden');
    if (syncBtn) syncBtn.classList.add('hidden');
    return;
  }

  const hasPerm = typeof window.HealthTrack.hasStepPermission === 'function' && window.HealthTrack.hasStepPermission();
  if (syncBtn) {
    syncBtn.classList.remove('hidden');
    syncBtn.innerText = hasPerm ? '同步' : '授权';
    syncBtn.title = hasPerm ? '同步手机硬件计步器步数' : '申请手机计步权限';
  }

  if (badge) {
    if (hasPerm && stepsState.autoDetected) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

function syncNativeSteps(interactive = false) {
  if (!hasNativeStepBridge()) {
    if (interactive) showToast('当前环境未检测到计步传感器');
    return;
  }

  const isToday = (loadedDate === localDateStr(new Date()));
  if (!isToday) {
    if (interactive) showToast('仅支持同步当天的实时步数');
    return;
  }

  const hasPerm = typeof window.HealthTrack.hasStepPermission === 'function' && window.HealthTrack.hasStepPermission();
  if (!hasPerm) {
    if (typeof window.HealthTrack.requestStepPermission === 'function') {
      window.HealthTrack.requestStepPermission();
      if (interactive) showToast('正在请求手机计步权限…');
    }
    return;
  }

  const rawSteps = window.HealthTrack.getTodaySteps();
  if (rawSteps < 0) {
    if (interactive) showToast('未读取到有效步数');
    return;
  }

  const exactSteps = Math.max(0, Math.min(30000, Math.round(rawSteps)));
  stepsState.value = exactSteps;
  stepsState.autoDetected = true;
  syncStepsSlider();
  updateStepsSourceUI(true);
  updateLogCompleteness();
  markDirty();
  if (interactive) {
    showToast(`已同步手机计步 ${exactSteps.toLocaleString('en-US')} 步`);
  }
}

function onStepsInput(raw) {
  const v = Number(raw);
  stepsState.value = isNaN(v) ? null : Math.max(0, Math.min(20000, Math.round(v / 500) * 500));
  stepsState.autoDetected = false;
  syncStepsSlider();
  updateStepsSourceUI(loadedDate === localDateStr(new Date()));
  markDirty();
}

function clearSteps() {
  stepsState.value = null;
  stepsState.autoDetected = false;
  syncStepsSlider();
  updateStepsSourceUI(loadedDate === localDateStr(new Date()));
  markDirty();
}

function syncStepsSlider() {
  const slider = inputById('input-steps');
  if (!slider) return;
  stepsState.prefilled = stepsState.value === null ? prevStepsValue : null;
  const rawDisplay = stepsState.value === null ? (prevStepsValue === null ? 0 : prevStepsValue) : stepsState.value;
  slider.value = String(Math.max(0, Math.min(20000, Math.round(rawDisplay / 500) * 500)));
  updateStepsDisplay();
}

function updateStepsDisplay() {
  const v = stepsState.value;
  const valueEl = document.getElementById('steps-value');
  if (valueEl) valueEl.innerText = v === null ? '--' : v.toLocaleString('en-US');
  const hint = document.getElementById('steps-hint');
  if (!hint) return;
  if (v === null && stepsState.prefilled !== null) {
    hint.innerText = `拖动滑块记录 · 已预置昨天 ${stepsState.prefilled.toLocaleString('en-US')} 步`;
  } else {
    hint.innerText = '留空表示当天未记录 · 图表断点';
  }
}

function updateStepsMeta(weekRecords, dateStr) {
  const prev = weekRecords.find((r) => r.record_date === getPrevDateStr(dateStr));
  prevStepsValue = prev && prev.steps !== null && prev.steps !== undefined ? Number(prev.steps) : null;
  const valid = weekRecords
    .filter((r) => r.record_date !== dateStr && r.steps !== null && r.steps !== undefined)
    .map((r) => Number(r.steps));
  const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
  const meta = document.getElementById('steps-meta');
  if (meta) {
    const prevText = prevStepsValue === null ? '--' : prevStepsValue.toLocaleString('en-US');
    const avgText = avg === null ? '--' : avg.toLocaleString('en-US');
    meta.innerHTML = `昨 <span class="font-medium text-neutral-700">${prevText}</span> · 7日均 <span class="font-medium text-neutral-700">${avgText}</span> 步`;
  }
}

// ---------- 午餐 ----------
function toggleLunch() {
  const body = document.getElementById('lunch-body');
  const icon = document.getElementById('lunch-icon');
  if (!body) return;
  const nowHidden = body.classList.toggle('hidden');
  if (icon) icon.style.transform = nowHidden ? 'rotate(0deg)' : 'rotate(180deg)';
}

function setLunchPill(el) {
  el.parentElement.querySelectorAll('.pill-sm-btn').forEach((p) => p.classList.remove('active'));
  el.classList.add('active');
  lunchState.touched = true;
  afterLunchChange();
}

function toggleLunchChip(el) {
  el.classList.toggle('active');
  lunchState.touched = true;
  afterLunchChange();
}

function afterLunchChange() {
  syncLunchSkipUI();
  updateLunchSummary();
  markDirty();
}

function syncLunchSkipUI() {
  const skipped = lunchPick('lunch-eaten') === 'skipped';
  ['lunch-protein-row', 'lunch-protein-g-row', 'lunch-staple-row', 'lunch-carb-row', 'lunch-cook-row'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', skipped);
  });
}

function lunchPick(id) {
  const el = document.querySelector(`#${id} .pill-sm-btn.active`);
  return el ? el.getAttribute('data-val') : '';
}

function updateLunchSummary() {
  const out = document.getElementById('lunch-summary');
  if (!out) return;
  if (!lunchState.touched) {
    out.innerText = '今天还没记午餐';
    return;
  }
  if (lunchPick('lunch-eaten') === 'skipped') {
    out.innerText = '今天跳过午餐';
    return;
  }
  const proteins = Array.from(document.querySelectorAll('#lunch-protein .chip.active')).map(
    (c) => LUNCH_TEXT.protein[c.getAttribute('data-val')] || ''
  );
  const proteinG = lunchPick('lunch-protein-g');
  const parts = [
    proteins.length ? proteins.join('、') : '未选蛋白',
    proteinG ? `约${proteinG}g` : '',
    LUNCH_TEXT.staple[lunchPick('lunch-staple')] || '',
    LUNCH_TEXT.carb[lunchPick('lunch-carb')] || '',
    LUNCH_TEXT.cook[lunchPick('lunch-cook')] || '',
  ].filter(Boolean);
  out.innerText = parts.join(' · ') || '已记午餐（明细空白）';
}

function lunchText(d) {
  if (!d) return '';
  if (d.eaten === 'skipped') return '跳过';
  const proteins = (d.protein || []).map((v) => LUNCH_TEXT.protein[v] || v);
  return [
    proteins.join('、'),
    d.protein_g ? `约${d.protein_g}g` : '',
    LUNCH_TEXT.staple[d.staple] || '',
    LUNCH_TEXT.carb[d.carb_g] || '',
    LUNCH_TEXT.cook[d.cooking] || '',
  ]
    .filter(Boolean)
    .join(' · ');
}

function lunchPayload() {
  if (!lunchState.touched) return null;
  const proteins = Array.from(document.querySelectorAll('#lunch-protein .chip.active')).map((c) =>
    c.getAttribute('data-val')
  );
  return {
    eaten: lunchPick('lunch-eaten') || 'eaten',
    protein: proteins,
    protein_g: parseInt(lunchPick('lunch-protein-g'), 10) || 0,
    staple: lunchPick('lunch-staple'),
    carb_g: lunchPick('lunch-carb'),
    cooking: lunchPick('lunch-cook'),
  };
}

function applyLunch(detail) {
  document
    .querySelectorAll(
      '#lunch-eaten .pill-sm-btn, #lunch-protein-g .pill-sm-btn, #lunch-staple .pill-sm-btn, #lunch-carb .pill-sm-btn, #lunch-cook .pill-sm-btn'
    )
    .forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('#lunch-protein .chip').forEach((c) => c.classList.remove('active'));
  lunchState.touched = !!detail;
  if (detail) {
    const mark = (id, val) => {
      const el = document.querySelector(`#${id} [data-val="${val}"]`);
      if (el) el.classList.add('active');
    };
    mark('lunch-eaten', detail.eaten || 'eaten');
    (detail.protein || []).forEach((v) => mark('lunch-protein', v));
    if (detail.protein_g) mark('lunch-protein-g', String(detail.protein_g));
    if (detail.staple) mark('lunch-staple', detail.staple);
    if (detail.carb_g) mark('lunch-carb', detail.carb_g);
    if (detail.cooking) mark('lunch-cook', detail.cooking);
  }
  syncLunchSkipUI();
  updateLunchSummary();
}

function applyLunchTemplate() {
  const prev = yesterdayRecord && yesterdayRecord.lunch;
  if (!prev) {
    showToast('昨天没有午餐记录，先手动记一次', false);
    return;
  }
  applyLunch(prev);
  lunchState.touched = true;
  markDirty();
  showToast('已沿用昨天的午餐');
}

function updateLunchYesterdayNote() {
  const el = document.getElementById('lunch-yesterday');
  if (!el) return;
  const d = yesterdayRecord && yesterdayRecord.lunch;
  el.innerText = '昨天：' + (d ? lunchText(d) : '--');
}

// ---------- 身体感受输入框交互增强 ----------
function syncJournalClearBtn() {
  const journalEl = textareaById('input-journal');
  const btnClear = byId('btn-clear-journal');
  if (!journalEl || !btnClear) return;
  if (journalEl.value && journalEl.value.trim().length > 0) {
    btnClear.classList.remove('hidden');
  } else {
    btnClear.classList.add('hidden');
  }
}

function autoResizeJournal() {
  const journalEl = document.getElementById('input-journal');
  if (!journalEl) return;
  journalEl.style.height = 'auto';
  const newH = Math.min(Math.max(journalEl.scrollHeight, 68), 240);
  journalEl.style.height = `${newH}px`;
}

// ---------- 睡眠与折叠 ----------
function parseTimeMinutes(str) {
  if (!str) return NaN;
  const parts = str.trim().split(':');
  if (parts.length !== 2) return NaN;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return NaN;
  let total = h * 60 + m;
  // 跨日归一化：凌晨 00:00 - 06:00 入睡按跨日（+24h）算，如 00:30 -> 24:30
  if (h >= 0 && h <= 6) {
    total += 24 * 60;
  }
  return total;
}

function calcSleepTag(bedTime, green, yellow) {
  const total = parseTimeMinutes(bedTime);
  if (isNaN(total)) return 'GREEN';
  let g = parseTimeMinutes(green);
  let y = parseTimeMinutes(yellow);
  if (isNaN(g)) g = 23 * 60 + 30; // 默认 23:30
  if (isNaN(y)) y = 25 * 60;      // 默认 01:00 (跨日 25:00)
  if (total < g) return 'GREEN';
  if (total < y) return 'YELLOW';
  return 'RED';
}

function handleSleepCalculation() {
  const bedTime = inputById('sleepBedTime')?.value;
  const wakeTime = inputById('sleepWakeTime')?.value;
  if (!bedTime || !wakeTime) return;

  const [bH, bM] = bedTime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);

  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 1440;
  }

  const hours = ((wakeMinutes - bedMinutes) / 60).toFixed(1);
  const durEl = inputById('sleepDuration');
  if (durEl) durEl.value = hours;

  const badge = document.getElementById('sleepTagBadge');
  if (badge) {
    const tag = calcSleepTag(bedTime, sleepThresholds.green, sleepThresholds.yellow);
    badge.classList.remove('badge-green', 'badge-yellow', 'badge-red');
    if (tag === 'YELLOW') {
      badge.classList.add('badge-yellow');
      badge.innerText = '● 轻度熬夜';
    } else if (tag === 'RED') {
      badge.classList.add('badge-red');
      badge.innerText = '● 重度熬夜';
    } else {
      badge.classList.add('badge-green');
      badge.innerText = '● 未熬夜';
    }
  }

  updateDiffDisplay();
}

function toggleBiohackPanel() {
  const body = document.getElementById('biohackBody');
  const icon = document.getElementById('accordionIcon');
  if (!body) return;
  const hidden = body.classList.toggle('hidden');
  if (icon) icon.style.transform = hidden ? 'rotate(0deg)' : 'rotate(180deg)';
}

function setExerciseTypes(types) {
  exerciseState.types = (types || []).filter((t) => t && t !== 'none');
  syncExerciseTypeUI();
}

function toggleExerciseType(val) {
  if (val === 'none') {
    setExerciseTypes([]);
    return;
  }
  const i = exerciseState.types.indexOf(val);
  if (i >= 0) {
    exerciseState.types.splice(i, 1);
  } else {
    exerciseState.types.push(val);
    exerciseState.types.sort((a, b) => EXERCISE_TYPE_ORDER.indexOf(a) - EXERCISE_TYPE_ORDER.indexOf(b));
  }
  syncExerciseTypeUI();
}

function syncExerciseTypeUI() {
  const selected = exerciseState.types;
  document.querySelectorAll('#exerciseTypePills .pill-btn').forEach((p) => {
    const val = p.getAttribute('data-val');
    p.classList.toggle('active', val === 'none' ? selected.length === 0 : selected.includes(val));
  });
  const sub = document.getElementById('exerciseSubForm');
  if (sub) sub.classList.toggle('hidden', selected.length === 0);
}

function setExerciseIntensity(intensity) {
  exerciseState.intensity = intensity;
  document.querySelectorAll('#exerciseIntensityPills .pill-sm-btn').forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-val') === intensity);
  });
}

function toggleConcerta(enabled) {
  const sub = document.getElementById('concertaSubForm');
  if (sub) sub.classList.toggle('hidden', !enabled);
}

function toggleColdShower(enabled) {
  const sub = document.getElementById('coldShowerSubForm');
  if (sub) sub.classList.toggle('hidden', !enabled);
}

function setColdShowerTiming(timing) {
  coldShowerState.timing = timing;
  const timeInput = inputById('coldShowerTime');
  if (timeInput && timeInput.value !== timing) {
    timeInput.value = timing;
  }
  document.querySelectorAll('#csQuickTimingPills .pill-sm-btn').forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-time') === timing);
  });
}

function syncColdShowerQuickDurationUI(secVal) {
  document.querySelectorAll('#csQuickDurationPills .pill-sm-btn').forEach((p) => {
    p.classList.toggle('active', Number(p.getAttribute('data-sec')) === Number(secVal));
  });
}

function setColdShowerDuration(sec) {
  const durInput = inputById('coldShowerDuration');
  if (durInput) durInput.value = String(sec);
  syncColdShowerQuickDurationUI(sec);
}

function setColdShowerFeeling(feeling) {
  coldShowerState.feeling = feeling;
  document.querySelectorAll('#csFeelingPills .pill-sm-btn').forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-val') === feeling);
  });
}

// ---------- 较昨日变化 (Δ) ----------
function updateDiffDisplay() {
  // 1. 晨起体重
  const amVal = parseFloat(controlVal('input-weight-am'));
  const diffAmEl = document.getElementById('diff-weight-am');
  if (diffAmEl) {
    if (!isNaN(amVal) && yesterdayRecord && yesterdayRecord.weight_am !== null && yesterdayRecord.weight_am !== undefined) {
      const diff = Math.round((amVal - yesterdayRecord.weight_am) * 10) / 10;
      if (diff < 0) {
        diffAmEl.innerHTML = `<span class="text-emerald-600 font-bold">↓ 较昨日 ${diff.toFixed(1)}</span><span class="text-slate-300">晨测</span>`;
      } else if (diff > 0) {
        diffAmEl.innerHTML = `<span class="text-rose-500 font-bold">↑ 较昨日 +${diff.toFixed(1)}</span><span class="text-slate-300">晨测</span>`;
      } else {
        diffAmEl.innerHTML = `<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晨测</span>`;
      }
    } else {
      diffAmEl.innerHTML = `<span>较昨日 --</span><span class="text-slate-300">晨测</span>`;
    }
  }

  // 2. 睡前体重
  const pmVal = parseFloat(controlVal('input-weight-pm'));
  const diffPmEl = document.getElementById('diff-weight-pm');
  if (diffPmEl) {
    if (!isNaN(pmVal)) {
      if (yesterdayRecord && yesterdayRecord.weight_pm !== null && yesterdayRecord.weight_pm !== undefined) {
        const diff = Math.round((pmVal - yesterdayRecord.weight_pm) * 10) / 10;
        if (diff < 0) {
          diffPmEl.innerHTML = `<span class="text-emerald-600 font-bold">↓ 较昨日 ${diff.toFixed(1)}</span><span class="text-slate-300">晚测</span>`;
        } else if (diff > 0) {
          diffPmEl.innerHTML = `<span class="text-rose-500 font-bold">↑ 较昨日 +${diff.toFixed(1)}</span><span class="text-slate-300">晚测</span>`;
        } else {
          diffPmEl.innerHTML = `<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">晚测</span>`;
        }
      } else {
        diffPmEl.innerHTML = `<span>今晚已记录</span><span class="text-slate-300">晚测</span>`;
      }
    } else {
      diffPmEl.innerHTML = `<span>等待今晚称重</span><span class="text-slate-300">--:--</span>`;
    }
  }

  // 3. 晨起腰围
  const waistVal = parseFloat(controlVal('input-waist'));
  const diffWaistEl = document.getElementById('diff-waist');
  if (diffWaistEl) {
    if (!isNaN(waistVal) && yesterdayRecord && yesterdayRecord.waist_size !== null && yesterdayRecord.waist_size !== undefined) {
      const diff = Math.round((waistVal - yesterdayRecord.waist_size) * 10) / 10;
      if (diff < 0) {
        diffWaistEl.innerHTML = `<span class="text-indigo-600 font-bold">较昨日 ${diff.toFixed(1)}</span><span class="text-slate-300">紧实</span>`;
      } else if (diff > 0) {
        diffWaistEl.innerHTML = `<span class="text-amber-600 font-bold">较昨日 +${diff.toFixed(1)}</span><span class="text-slate-300">略增</span>`;
      } else {
        diffWaistEl.innerHTML = `<span class="text-neutral-800 font-mono font-semibold">较昨日 持平</span><span class="text-neutral-300 font-mono">稳定</span>`;
      }
    } else {
      diffWaistEl.innerHTML = `<span>平稳区间</span><span class="text-slate-300">标准</span>`;
    }
  }

  // 4. 睡眠时长
  const sleepVal = parseFloat(controlVal('sleepDuration'));
  const diffSleepEl = document.getElementById('diff-sleep');
  if (diffSleepEl) {
    if (!isNaN(sleepVal) && yesterdayRecord && yesterdayRecord.sleep_hours !== null && yesterdayRecord.sleep_hours !== undefined) {
      const diff = Math.round((sleepVal - yesterdayRecord.sleep_hours) * 10) / 10;
      if (diff < 0) {
        diffSleepEl.innerHTML = `<span class="text-amber-600 font-bold">较前日 ${diff.toFixed(1)}h</span><span class="text-slate-300">偏短</span>`;
      } else if (diff > 0) {
        diffSleepEl.innerHTML = `<span class="text-emerald-600 font-bold">较前日 +${diff.toFixed(1)}h</span><span class="text-slate-300">充足</span>`;
      } else {
        diffSleepEl.innerHTML = `<span class="text-neutral-800 font-mono font-semibold">较前日 持平</span><span class="text-neutral-300 font-mono">规律</span>`;
      }
    } else {
      diffSleepEl.innerHTML = `<span>较昨日 --</span><span class="text-slate-300">节律</span>`;
    }
  }
}

function updateLogCompleteness() {
  const has = (id) => controlVal(id).trim() !== '';
  let n = 0;
  if (has('input-weight-am') || has('input-weight-pm')) n++;
  if (has('input-waist')) n++;
  if (has('sleepDuration')) n++;
  if (morningLightState !== null) n++;
  if (stepsState.value !== null) n++;
  if (lunchState.touched) n++;

  const el = document.getElementById('log-count');
  if (el) {
    el.innerText = `${n}/6`;
    el.className = n >= 6 ? 'text-emerald-600' : 'text-slate-600';
  }
}

function markDirty() {
  if (suppressDirty) return;
  logDirty = true;
  updateLogCompleteness();
  renderSaveBar();
  if (draftTimer) clearTimeout(draftTimer);
  const draftDate = loadedDate;
  draftTimer = setTimeout(() => {
    draftTimer = null;
    saveDraftNow(draftDate);
  }, 400);
}

function flushDraft() {
  if (draftTimer) {
    clearTimeout(draftTimer);
    draftTimer = null;
  }
  if (logDirty) saveDraftNow(loadedDate);
}

function renderSaveBar() {
  const saveText = document.getElementById('save-text');
  const saveDot = document.getElementById('save-dot');
  if (!saveText || !saveDot) return;
  if (logDirty) {
    saveDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
    saveText.innerText = '未保存';
  } else if (logHasRecord) {
    saveDot.className = 'w-2 h-2 rounded-full bg-emerald-500';
    saveText.innerText = `已同步落库${logSavedAt ? ' (' + logSavedAt + ')' : ''}`;
  } else {
    saveDot.className = 'w-2 h-2 rounded-full bg-neutral-300';
    saveText.innerText = '未修改';
  }
}

function draftKey(dateStr) {
  return `ht_log_draft_${dateStr}`;
}

function saveDraftNow(dateStr) {
  dateStr = dateStr || loadedDate;
  if (!dateStr) return;
  try {
    localStorage.setItem(draftKey(dateStr), JSON.stringify(collectLogState()));
  } catch (_) {}
}

function readDraft(dateStr) {
  try {
    const raw = localStorage.getItem(draftKey(dateStr));
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj && obj.record_date === dateStr ? obj : null;
  } catch (_) {
    return null;
  }
}

function clearDraft(dateStr) {
  try {
    localStorage.removeItem(draftKey(dateStr));
  } catch (_) {}
}

/**
 * 清理超过 maxAgeDays 天的过期日志草稿，避免长期积累占用 localStorage
 * @param {number} [maxAgeDays=14]
 */
function pruneStaleDrafts(maxAgeDays = 14) {
  try {
    const cutoff = shiftDateStr(localDateStr(new Date()), -maxAgeDays);
    /** @type {string[]} */
    const staleKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const m = /^ht_log_draft_(\d{4}-\d{2}-\d{2})$/.exec(k);
      if (m && m[1] < cutoff) {
        staleKeys.push(k);
      }
    }
    staleKeys.forEach((k) => localStorage.removeItem(k));
  } catch (_) {}
}

async function handleDateChange(target) {
  if (!target) return;
  if (target === loadedDate) return;
  if (logDirty) {
    const ok = await appConfirm(`当前日期还有未保存的改动（草稿已自动保存），确定切换到 ${target}？`, {
      title: '未保存改动',
      confirmText: '仍然切换',
      danger: false,
    });
    if (!ok) {
      const input = inputById('input-date');
      if (input) input.value = loadedDate;
      return;
    }
    flushDraft();
  }
  await loadRecordForDate(target);
}

function bindEvents() {
  const dateInput = inputById('input-date');
  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      if (e.currentTarget instanceof HTMLInputElement) {
        handleDateChange(e.currentTarget.value);
      }
    });
  }

  byId('btn-today-date')?.addEventListener('click', () => {
    const today = localDateStr(new Date());
    handleDateChange(today);
  });

  // 晨光
  byId('morningLightPills')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, 'button[data-val]');
    if (!btn) return;
    setMorningLight(btn.getAttribute('data-val'));
  });

  // 步数
  inputById('input-steps')?.addEventListener('input', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      onStepsInput(e.currentTarget.value);
    }
  });
  byId('btn-clear-steps')?.addEventListener('click', clearSteps);
  byId('btn-sync-steps')?.addEventListener('click', () => syncNativeSteps(true));

  window.onStepPermissionResult = (granted) => {
    if (granted) {
      showToast('已授权手机计步');
      syncNativeSteps(false);
    } else {
      showToast('未获得计步权限');
    }
    updateStepsSourceUI(loadedDate === localDateStr(new Date()));
  };

  window.onNativeStepsUpdated = (rawSteps) => {
    const isToday = (loadedDate === localDateStr(new Date()));
    if (!isToday || typeof rawSteps !== 'number' || rawSteps <= 0) return;
    if (stepsState.value !== null && !stepsState.autoDetected) return;
    const exactSteps = Math.max(0, Math.min(30000, Math.round(rawSteps)));
    if (stepsState.value === exactSteps) return;
    stepsState.value = exactSteps;
    stepsState.autoDetected = true;
    syncStepsSlider();
    updateStepsSourceUI(true);
    updateLogCompleteness();
  };

  // 输入监听标记脏状态
  const inputIds = [
    'input-weight-am',
    'input-weight-pm',
    'input-waist',
    'sleepBedTime',
    'sleepWakeTime',
    'sleepDuration',
    'input-journal',
    'exerciseDuration',
    'exerciseItems',
    'concertaTime',
    'concertaDose',
    'focusWork',
    'coldShowerTime',
    'coldShowerDuration',
    'coldShowerWaterTemp',
  ];
  inputIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (id === 'sleepBedTime' || id === 'sleepWakeTime') handleSleepCalculation();
        else updateDiffDisplay();
        markDirty();
      });
    }
  });

  // 身体感受增强事件（防软键盘遮挡 + 自动高度 + 快捷清空）
  const journalEl = document.getElementById('input-journal');
  const mainContent = document.getElementById('main-content');
  if (journalEl) {
    journalEl.addEventListener('focus', () => {
      if (mainContent) {
        mainContent.style.paddingBottom = '96px';
      }
      setTimeout(() => {
        journalEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    });
    journalEl.addEventListener('blur', () => {
      if (mainContent) {
        mainContent.style.paddingBottom = '';
      }
    });
    journalEl.addEventListener('input', () => {
      autoResizeJournal();
      syncJournalClearBtn();
    });
  }

  document.getElementById('btn-clear-journal')?.addEventListener('click', async () => {
    const jEl = textareaById('input-journal');
    if (!jEl || !jEl.value) return;
    const ok = await appConfirm('确定清空自由记录吗？', {
      title: '清空自由记录',
      confirmText: '清空',
      danger: true,
    });
    if (ok) {
      jEl.value = '';
      autoResizeJournal();
      syncJournalClearBtn();
      markDirty();
    }
  });

  // 午餐折叠与选择
  byId('lunch-toggle')?.addEventListener('click', (e) => {
    if (closestEl(e.target, '#btn-lunch-template')) return;
    toggleLunch();
  });
  byId('btn-lunch-template')?.addEventListener('click', (e) => {
    e.stopPropagation();
    applyLunchTemplate();
  });
  byId('lunch-eaten')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, '.pill-sm-btn');
    if (btn) setLunchPill(btn);
  });
  byId('lunch-protein')?.addEventListener('click', (e) => {
    const chip = closestEl(e.target, '.chip');
    if (chip) toggleLunchChip(chip);
  });
  ['lunch-protein-g', 'lunch-staple', 'lunch-carb', 'lunch-cook'].forEach((id) => {
    byId(id)?.addEventListener('click', (e) => {
      const btn = closestEl(e.target, '.pill-sm-btn');
      if (btn) setLunchPill(btn);
    });
  });

  // 生物黑客折叠与多选
  byId('biohack-toggle')?.addEventListener('click', toggleBiohackPanel);
  byId('exerciseTypePills')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, '.pill-btn');
    if (btn) {
      toggleExerciseType(btn.getAttribute('data-val'));
      markDirty();
    }
  });
  byId('exerciseIntensityPills')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, '.pill-sm-btn');
    if (btn) {
      setExerciseIntensity(btn.getAttribute('data-val'));
      markDirty();
    }
  });

  // 专注达
  inputById('concertaEnabled')?.addEventListener('change', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      toggleConcerta(e.currentTarget.checked);
      markDirty();
    }
  });
  inputById('focusWork')?.addEventListener('input', (e) => {
    const fwEl = byId('focusWorkText');
    if (e.currentTarget instanceof HTMLInputElement && fwEl) {
      fwEl.innerText = e.currentTarget.value + '分';
    }
    markDirty();
  });
  ['concertaSideEffects', 'concertaCompensations'].forEach((id) => {
    byId(id)?.addEventListener('click', (e) => {
      const chip = closestEl(e.target, '.chip');
      if (chip) {
        chip.classList.toggle('active');
        markDirty();
      }
    });
  });

  // 冷水澡
  inputById('coldShowerEnabled')?.addEventListener('change', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      toggleColdShower(e.currentTarget.checked);
      markDirty();
    }
  });
  inputById('coldShowerTime')?.addEventListener('change', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      setColdShowerTiming(e.currentTarget.value);
      markDirty();
    }
  });
  byId('csQuickTimingPills')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, '.pill-sm-btn');
    if (btn) {
      setColdShowerTiming(btn.getAttribute('data-time'));
      markDirty();
    }
  });
  inputById('coldShowerDuration')?.addEventListener('input', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      syncColdShowerQuickDurationUI(e.currentTarget.value);
      markDirty();
    }
  });
  byId('csQuickDurationPills')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, '.pill-sm-btn');
    if (btn) {
      setColdShowerDuration(Number(btn.getAttribute('data-sec')));
      markDirty();
    }
  });
  byId('csFeelingPills')?.addEventListener('click', (e) => {
    const btn = closestEl(e.target, '.pill-sm-btn');
    if (btn) {
      setColdShowerFeeling(btn.getAttribute('data-val'));
      markDirty();
    }
  });

  // 保存与重置
  document.getElementById('btn-save-log')?.addEventListener('click', saveCurrentRecord);
  document.getElementById('btn-reset-log')?.addEventListener('click', () => loadRecordForDate(loadedDate));
}
