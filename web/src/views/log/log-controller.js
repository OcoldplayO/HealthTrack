/**
 * 记一笔 (Log View) 业务控制器
 * 完全解耦的模块化状态与事件管理
 */
import templateHtml from './log-view.html?raw';
import { api } from '../../services/api.js';
import { store } from '../../services/state.js';
import { localDateStr, getPrevDateStr, calculateSleepDuration } from '../../utils/date.js';
import { showToast } from '../../components/Toast.js';

let state = {
  date: localDateStr(new Date()),
  morningLight: null, // 'yes' | 'no' | null
  steps: null,        // number | null
  prevSteps: null,    // number | null
  isDirty: false,
  hasRecord: false,
};

let exerciseState = {
  types: [],
  intensity: 'light',
};

let coldShowerState = {
  timing: 'morning',
  feeling: 'refreshed',
};

export function initLogView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  bindEvents();
  loadDateRecord(state.date);
}

function bindEvents() {
  const dateInput = document.getElementById('input-date');
  if (dateInput) {
    dateInput.value = state.date;
    dateInput.addEventListener('change', (e) => {
      loadDateRecord(e.target.value);
    });
  }

  document.getElementById('btn-today-date')?.addEventListener('click', () => {
    const today = localDateStr(new Date());
    if (dateInput) dateInput.value = today;
    loadDateRecord(today);
  });

  // 晨光
  document.getElementById('morningLightPills')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-val]');
    if (!btn) return;
    const val = btn.getAttribute('data-val');
    state.morningLight = state.morningLight === val ? null : val;
    syncMorningLightUI();
    markDirty();
  });

  // 步数
  const stepsInput = document.getElementById('input-steps');
  stepsInput?.addEventListener('input', (e) => {
    const raw = Number(e.target.value);
    state.steps = isNaN(raw) ? null : Math.max(0, Math.min(20000, Math.round(raw / 500) * 500));
    syncStepsDisplay();
    markDirty();
  });

  document.getElementById('btn-clear-steps')?.addEventListener('click', () => {
    state.steps = null;
    syncStepsDisplay();
    markDirty();
  });

  // 体重与腰围输入
  ['input-weight-pm', 'input-weight-am', 'input-waist', 'sleepDuration'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      updateDiffDisplay();
      markDirty();
    });
  });

  // 睡眠时间联动
  ['sleepBedTime', 'sleepWakeTime'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      handleSleepCalc();
      markDirty();
    });
  });

  // 午餐折叠
  document.getElementById('lunch-toggle')?.addEventListener('click', () => {
    const body = document.getElementById('lunch-body');
    const icon = document.getElementById('lunch-icon');
    body?.classList.toggle('hidden');
    icon?.classList.toggle('rotate-180');
  });

  // 专项打卡折叠
  document.getElementById('biohack-toggle')?.addEventListener('click', () => {
    const body = document.getElementById('biohackBody');
    const icon = document.getElementById('accordionIcon');
    body?.classList.toggle('hidden');
    icon?.classList.toggle('rotate-180');
  });

  // 运动多选
  document.getElementById('exerciseTypePills')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-val]');
    if (!btn) return;
    const val = btn.getAttribute('data-val');
    toggleExerciseType(val);
    markDirty();
  });

  // 专注达开关
  document.getElementById('concertaEnabled')?.addEventListener('change', (e) => {
    document.getElementById('concertaSubForm')?.classList.toggle('hidden', !e.target.checked);
    markDirty();
  });

  // 冷水澡开关
  document.getElementById('coldShowerEnabled')?.addEventListener('change', (e) => {
    document.getElementById('coldShowerSubForm')?.classList.toggle('hidden', !e.target.checked);
    markDirty();
  });

  // 保存与重置
  document.getElementById('btn-save-log')?.addEventListener('click', saveRecord);
  document.getElementById('btn-reset-log')?.addEventListener('click', () => loadDateRecord(state.date));

  // 自由文本日记
  document.getElementById('input-journal')?.addEventListener('input', markDirty);
}

export async function loadDateRecord(dateStr) {
  state.date = dateStr;
  store.set({ currentDate: dateStr });
  setDirty(false);

  try {
    const res = await api.getRecordByDate(dateStr);
    const r = res.record || {};
    state.hasRecord = !!res.record;

    // 回显基础字段
    const amEl = document.getElementById('input-weight-am');
    const pmEl = document.getElementById('input-weight-pm');
    const waistEl = document.getElementById('input-waist');
    const journalEl = document.getElementById('input-journal');

    if (amEl) amEl.value = r.weight_am !== null && r.weight_am !== undefined ? r.weight_am : '';
    if (pmEl) pmEl.value = r.weight_pm !== null && r.weight_pm !== undefined ? r.weight_pm : '';
    if (waistEl) waistEl.value = r.waist_size !== null && r.waist_size !== undefined ? r.waist_size : '';
    if (journalEl) journalEl.value = r.journal || '';

    // 晨光
    state.morningLight = r.morning_light === true ? 'yes' : (r.morning_light === false ? 'no' : null);
    syncMorningLightUI();

    // 步数
    state.steps = (r.steps !== null && r.steps !== undefined) ? Number(r.steps) : null;
    syncStepsDisplay();

    // 睡眠
    const bedEl = document.getElementById('sleepBedTime');
    const wakeEl = document.getElementById('sleepWakeTime');
    const durEl = document.getElementById('sleepDuration');

    if (bedEl) bedEl.value = r.sleep_start_time || r.sleep_bed_time || '00:30';
    if (wakeEl) wakeEl.value = r.sleep_end_time || r.sleep_wake_time || '07:15';
    if (durEl) durEl.value = r.sleep_hours !== null && r.sleep_hours !== undefined ? r.sleep_hours : '6.8';

    handleSleepCalc();
    updateDiffDisplay();
    updateCountBadge();
  } catch (err) {
    console.error('加载记录失败:', err);
  }
}

function syncMorningLightUI() {
  document.querySelectorAll('#morningLightPills button').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-val') === state.morningLight);
  });
}

function syncStepsDisplay() {
  const valueEl = document.getElementById('steps-value');
  const slider = document.getElementById('input-steps');
  const hintEl = document.getElementById('steps-hint');

  if (valueEl) valueEl.innerText = state.steps === null ? '--' : state.steps.toLocaleString('en-US');
  if (slider) slider.value = state.steps === null ? 0 : state.steps;
  if (hintEl) {
    hintEl.innerText = state.steps === null ? '留空 = 断点（不补 0）' : `已设定 ${state.steps.toLocaleString('en-US')} 步`;
  }
}

function handleSleepCalc() {
  const bed = document.getElementById('sleepBedTime')?.value;
  const wake = document.getElementById('sleepWakeTime')?.value;
  if (!bed || !wake) return;

  const { duration } = calculateSleepDuration(bed, wake);
  const durEl = document.getElementById('sleepDuration');
  if (durEl && document.activeElement !== durEl) {
    durEl.value = duration;
  }
}

function updateDiffDisplay() {
  // 极简对比文字更新
  const am = parseFloat(document.getElementById('input-weight-am')?.value);
  const pm = parseFloat(document.getElementById('input-weight-pm')?.value);
  const diffPm = document.getElementById('diff-weight-pm');

  if (diffPm) {
    if (!isNaN(pm) && !isNaN(am)) {
      const d = (pm - am).toFixed(1);
      diffPm.innerHTML = `<span>较晨重 ${d >= 0 ? '+' : ''}${d}kg</span><span class="text-neutral-400">已测</span>`;
    } else {
      diffPm.innerHTML = `<span>等待今晚称重</span><span class="text-neutral-300">--:--</span>`;
    }
  }
}

function toggleExerciseType(val) {
  if (val === 'none') {
    exerciseState.types = [];
  } else {
    const idx = exerciseState.types.indexOf(val);
    if (idx >= 0) exerciseState.types.splice(idx, 1);
    else exerciseState.types.push(val);
  }

  document.querySelectorAll('#exerciseTypePills button').forEach((btn) => {
    const v = btn.getAttribute('data-val');
    if (v === 'none') {
      btn.classList.toggle('active', exerciseState.types.length === 0);
    } else {
      btn.classList.toggle('active', exerciseState.types.includes(v));
    }
  });

  document.getElementById('exerciseSubForm')?.classList.toggle('hidden', exerciseState.types.length === 0);
}

function updateCountBadge() {
  let count = 0;
  if (document.getElementById('input-weight-am')?.value) count++;
  if (document.getElementById('input-weight-pm')?.value) count++;
  if (document.getElementById('input-waist')?.value) count++;
  if (state.morningLight !== null) count++;
  if (state.steps !== null) count++;
  if (document.getElementById('input-journal')?.value) count++;

  const badge = document.getElementById('log-count');
  if (badge) badge.innerText = `${count}/6`;
}

function markDirty() {
  setDirty(true);
  updateCountBadge();
}

function setDirty(isDirty) {
  state.isDirty = isDirty;
  store.set({ isDirty });

  const dot = document.getElementById('save-dot');
  const text = document.getElementById('save-text');
  if (dot && text) {
    if (isDirty) {
      dot.className = 'w-2 h-2 rounded-full bg-neutral-900';
      text.innerText = '有未保存改动';
    } else {
      dot.className = 'w-2 h-2 rounded-full bg-neutral-300';
      text.innerText = '已同步落库';
    }
  }
}

async function saveRecord() {
  const am = parseFloat(document.getElementById('input-weight-am')?.value);
  const pm = parseFloat(document.getElementById('input-weight-pm')?.value);
  const waist = parseFloat(document.getElementById('input-waist')?.value);
  const dur = parseFloat(document.getElementById('sleepDuration')?.value);

  const payload = {
    record_date: state.date,
    weight_am: isNaN(am) ? null : am,
    weight_pm: isNaN(pm) ? null : pm,
    waist_size: isNaN(waist) ? null : waist,
    sleep_hours: isNaN(dur) ? null : dur,
    sleep_start_time: document.getElementById('sleepBedTime')?.value || null,
    sleep_end_time: document.getElementById('sleepWakeTime')?.value || null,
    morning_light: state.morningLight === 'yes' ? true : (state.morningLight === 'no' ? false : null),
    steps: state.steps,
    journal: document.getElementById('input-journal')?.value || '',
  };

  try {
    await api.saveRecord(payload);
    setDirty(false);
    showToast('记录已保存');
  } catch (err) {
    showToast('保存失败: ' + err.message, false);
  }
}
