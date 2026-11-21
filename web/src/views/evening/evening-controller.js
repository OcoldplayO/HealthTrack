/**
 * 睡前小结 (Evening View) 业务控制器
 * 包含照片压缩上传、三件事、自评滑块/分档文案编辑、小结深度洞察 SSE、日期切换竞态保护与未保存确认
 */
import templateHtml from './evening-view.html?raw';
import { api } from '../../services/api.js';
import { streamChatSSE } from '../../services/sse.js';
import { appConfirm, appToast } from '../../utils/dialog.js';
import { buttonById, byId, closestEl, imgById, inputById, textareaById } from '../../utils/dom.js';
import { escapeHtml, renderMarkdown } from '../../utils/format.js';
import {
  evLoadMore,
  evResetFilters,
  evSetDateFilter,
  evSetScoreFilter,
  evoLoadList,
  evoRefreshScoreChips,
  initEveningHistory,
} from './evening-history.js';

const EVO_DEFAULT_BANDS = [
  { range: [1, 2], label: '很低落', tone: 'rose' },
  { range: [3, 4], label: '有点钝', tone: 'amber' },
  { range: [5, 6], label: '平平', tone: 'emerald' },
  { range: [7, 8], label: '还不错，稳住了节奏', tone: 'indigo' },
  { range: [9, 10], label: '满分的一天', tone: 'violet' },
];

const EVO_TONE = {
  rose: { dot: '#f43f5e', chip: 'text-rose-700 bg-rose-50 border-rose-200', band: 'bg-rose-50 text-rose-700 border border-rose-200' },
  amber: { dot: '#f59e0b', chip: 'text-amber-700 bg-amber-50 border-amber-200', band: 'bg-amber-50 text-amber-700 border border-amber-200' },
  emerald: { dot: '#10b981', chip: 'text-emerald-700 bg-emerald-50 border-emerald-200', band: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  indigo: { dot: '#6366f1', chip: 'text-indigo-700 bg-indigo-50 border-indigo-200', band: 'bg-neutral-50 text-neutral-800 border border-neutral-200' },
  violet: { dot: '#8b5cf6', chip: 'text-violet-700 bg-violet-50 border-violet-200', band: 'bg-violet-50 text-violet-700 border border-violet-200' },
};
const EVO_TONE_CYCLE = ['rose', 'amber', 'emerald', 'indigo', 'violet'];

/** @type {Array<{ range: number[], label: string, tone: string }> | null} */
let evoBands = null;

const evoState = {
  date: '',
  photoId: /** @type {number | null} */ (null),
  pendingBlob: /** @type {Blob | null} */ (null),
  dirty: false,
  insightBusy: false,
  insightRange: 7,
};

let evoLoadSeq = 0;
/** @type {AbortController | null} */
let evoInsightAbort = null;
let evPhotoHistoryPushed = false;
let eveningBound = false;

export function initEveningView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  initEveningHistory({
    bandOf: evoBandOf,
    toneOf: evoTone,
    todayStr: evoToday,
    getCurrentDate: () => evoState.date,
    onDeletedCurrentDate: () => {
      evoState.dirty = false;
      evoState.date = evoToday();
      const dateInput = inputById('summary-date');
      if (dateInput) dateInput.value = evoState.date;
      evoLoadCurrentSummary();
    },
    openPhoto: evoOpenPhoto,
  });
  bindEveningEvents();
}

export function activateEvening() {
  loadEveningTab();
}

function bindEveningEvents() {
  if (eveningBound) return;
  const view = byId('view-evening');
  if (!view) return;
  eveningBound = true;

  view.addEventListener('click', (e) => {
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    switch (action) {
      case 'ev-today':
        evSetToday();
        break;
      case 'ev-open-photo': {
        const preview = imgById('photo-preview');
        if (preview) evoOpenPhoto(preview.src, '今日图片');
        break;
      }
      case 'ev-remove-photo':
        evRemovePhoto();
        break;
      case 'ev-toggle-bands':
        evToggleBandEditor();
        break;
      case 'ev-reset-bands':
        evResetBands();
        break;
      case 'ev-save-bands':
        evSaveBands();
        break;
      case 'ev-cycle-tone': {
        const idx = Number(target.dataset.idx);
        if (!Number.isNaN(idx)) evCycleTone(idx);
        break;
      }
      case 'ev-save':
        evSave();
        break;
      case 'ev-insight-range':
        evSetInsightRange(target);
        break;
      case 'ev-insight-generate':
        evGenerateInsight();
        break;
      case 'ev-insight-stop':
        evoStopInsight();
        break;
      case 'ev-insight-reset':
        evResetInsight();
        break;
      case 'ev-toggle-thinking':
        evToggleThinking();
        break;
      case 'ev-filter-date':
        evSetDateFilter(target);
        break;
      case 'ev-filter-score':
        evSetScoreFilter(target);
        break;
      case 'ev-filter-reset':
        evResetFilters();
        break;
      case 'ev-load-more':
        evLoadMore();
        break;
      default:
        break;
    }
  });

  inputById('summary-date')?.addEventListener('change', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      evOnDateChange(e.currentTarget.value);
    }
  });

  inputById('photo-input')?.addEventListener('change', evOnPhotoPick);

  textareaById('note-text')?.addEventListener('input', (e) => {
    const lenEl = byId('note-len');
    if (e.currentTarget instanceof HTMLTextAreaElement && lenEl) {
      lenEl.innerText = String(e.currentTarget.value.length);
    }
    evoState.dirty = true;
  });

  ['done-1', 'done-2', 'done-3'].forEach((id) => {
    inputById(id)?.addEventListener('input', () => {
      evUpdateDoneCount();
      evoState.dirty = true;
    });
  });

  inputById('score-range')?.addEventListener('input', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      evUpdateScore(e.currentTarget.value);
      evoState.dirty = true;
    }
  });

  byId('band-rows')?.addEventListener('input', (e) => {
    const target = closestEl(e.target, '[data-action="ev-band-label"]');
    if (target instanceof HTMLInputElement) {
      const idx = Number(target.dataset.idx);
      if (!Number.isNaN(idx)) evSetBandLabel(idx, target.value);
    }
  });

  // 全屏看图容器关闭委托（支持点击背景 / 关闭按钮 / Escape / popstate）
  byId('ev-photo-viewer')?.addEventListener('click', () => {
    closeEveningPhoto();
  });

  window.addEventListener('popstate', () => {
    if (!evPhotoHistoryPushed) return;
    evPhotoHistoryPushed = false;
    closeEveningPhoto(true);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEveningPhoto();
  });
}

function evoBandOf(score) {
  const bands = evoBands || EVO_DEFAULT_BANDS;
  return bands.find((b) => score >= b.range[0] && score <= b.range[1]) || bands[bands.length - 1];
}

function evoTone(tone) {
  return EVO_TONE[tone] || EVO_TONE.indigo;
}

function evoToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function evoMmdd(d) {
  return d ? d.slice(5) : '';
}

function evoAttr(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── 载入 ──

async function loadEveningTab() {
  if (!evoState.date) evoState.date = evoToday();
  const dateInput = inputById('summary-date');
  if (dateInput) dateInput.value = evoState.date;
  await Promise.all([evoEnsureBands(), evoLoadCurrentSummary()]);
  await evoLoadList();
}

async function evoEnsureBands() {
  if (evoBands) {
    evoRenderBandRows();
    return;
  }
  try {
    const json = await api.getConfig();
    const bands = json && json.data && json.data.summary_score_bands;
    if (Array.isArray(bands) && bands.length) {
      evoBands = bands.map((b) => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone }));
    }
  } catch (_) {}
  if (!evoBands) {
    evoBands = EVO_DEFAULT_BANDS.map((b) => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone }));
  }
  evoRenderBandRows();
  evoPaintScoreBand(Number(inputById('score-range')?.value) || 7);
}

async function evoLoadCurrentSummary() {
  const date = evoState.date;
  const seq = ++evoLoadSeq;
  const isStale = () => seq !== evoLoadSeq || date !== evoState.date;

  evoState.dirty = false;
  evoResetPhotoUI();
  try {
    const json = await api.getEveningSummary(date);
    if (isStale()) return;
    const data = json ? json.data : null;
    const done1 = inputById('done-1');
    const done2 = inputById('done-2');
    const done3 = inputById('done-3');
    const noteText = textareaById('note-text');
    const noteLen = byId('note-len');

    if (data) {
      if (done1) done1.value = (data.done_items && data.done_items[0]) || '';
      if (done2) done2.value = (data.done_items && data.done_items[1]) || '';
      if (done3) done3.value = (data.done_items && data.done_items[2]) || '';
      if (noteText) noteText.value = data.note_text || '';
      if (noteLen) noteLen.innerText = String((data.note_text || '').length);
      evUpdateScore(data.score || 7);
      if (data.photo_id) {
        evoState.photoId = data.photo_id;
        evoShowPhoto(`/api/v1/evening/photo/${data.photo_id}`, '');
      }
    } else {
      if (done1) done1.value = '';
      if (done2) done2.value = '';
      if (done3) done3.value = '';
      if (noteText) noteText.value = '';
      if (noteLen) noteLen.innerText = '0';
      evUpdateScore(7);
    }
    evUpdateDoneCount();
    evoState.dirty = false;
  } catch (e) {
    if (isStale()) return;
    const msg = e instanceof Error ? e.message : String(e);
    appToast('读取该日小结失败：' + msg);
  }
  if (!isStale()) {
    evoLoadInsight(date, seq);
  }
}

// ── 日期切换（含未保存修改确认） ──

async function switchEveningDate(target) {
  if (!target) return false;
  if (target === evoState.date) return false;
  if (evoState.dirty) {
    const ok = await appConfirm(`当前日期的小结有未保存改动，切换到 ${target} 后未保存内容将会丢失，确定切换吗？`, {
      title: '未保存改动',
      confirmText: '仍然切换',
      danger: false,
    });
    if (!ok) {
      const dateInput = inputById('summary-date');
      if (dateInput) dateInput.value = evoState.date;
      return false;
    }
  }
  evoState.date = target;
  const dateInput = inputById('summary-date');
  if (dateInput) dateInput.value = target;
  await evoLoadCurrentSummary();
  return true;
}

async function evSetToday() {
  const today = evoToday();
  if (evoState.date === today) {
    appToast('已在今日');
    return;
  }
  const switched = await switchEveningDate(today);
  if (switched) appToast('已回到今日');
}

async function evOnDateChange(v) {
  if (!v) return;
  await switchEveningDate(v);
}

// ── 三件事 ──

function evUpdateDoneCount() {
  let n = 0;
  [1, 2, 3].forEach((i) => {
    const input = inputById('done-' + i);
    const filled = !!(input && input.value.trim());
    const dot = byId('seq-' + i);
    if (dot) {
      if (filled) {
        if (!dot.classList.contains('filled')) {
          dot.classList.add('filled', 'ev-pop');
          setTimeout(() => dot.classList.remove('ev-pop'), 340);
        }
        n++;
      } else {
        dot.classList.remove('filled');
      }
    }
  });
  const badge = byId('done-count');
  if (badge) {
    badge.innerText = n + ' / 3';
    badge.className = 'font-mono text-[10px] font-bold tabular-nums transition-colors ' + (n === 0 ? 'text-neutral-400' : 'text-neutral-900');
  }
}

// ── 图片处理与全屏预览 ──

function evoShowPhoto(src, meta) {
  const preview = imgById('photo-preview');
  if (preview) preview.src = src || '';
  byId('photo-empty')?.classList.add('hidden');
  byId('photo-filled')?.classList.remove('hidden');
  const metaEl = byId('photo-meta');
  if (metaEl) metaEl.innerText = meta || '';
}

function evoResetPhotoUI() {
  evoState.photoId = null;
  evoState.pendingBlob = null;
  const input = inputById('photo-input');
  if (input) input.value = '';
  const preview = imgById('photo-preview');
  if (preview) preview.src = '';
  byId('photo-filled')?.classList.add('hidden');
  byId('photo-empty')?.classList.remove('hidden');
  const metaEl = byId('photo-meta');
  if (metaEl) metaEl.innerText = '';
}

function evoOpenPhoto(src, alt) {
  if (!src) return;
  const viewer = byId('ev-photo-viewer');
  const img = imgById('ev-photo-viewer-img');
  if (!viewer || !img) return;
  img.src = src;
  img.alt = alt || '小结图片';
  if (viewer.classList.contains('hidden')) {
    viewer.classList.remove('hidden');
    if (!evPhotoHistoryPushed) {
      history.pushState({ evPhoto: 1 }, '');
      evPhotoHistoryPushed = true;
    }
  }
}

export function closeEveningPhoto(fromPop) {
  const viewer = byId('ev-photo-viewer');
  const img = imgById('ev-photo-viewer-img');
  if (!viewer || viewer.classList.contains('hidden')) return;
  viewer.classList.add('hidden');
  img?.removeAttribute('src');
  if (evPhotoHistoryPushed && !fromPop) {
    evPhotoHistoryPushed = false;
    history.back();
  }
}

async function evOnPhotoPick(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    appToast('请选择图片文件');
    return;
  }
  try {
    const blob = await evoCompressImage(file);
    const prevUrl = evoState.pendingBlob && imgById('photo-preview')?.src;
    if (prevUrl && prevUrl.startsWith('blob:')) URL.revokeObjectURL(prevUrl);
    evoState.pendingBlob = blob;
    evoState.dirty = true;
    evoShowPhoto(URL.createObjectURL(blob), `原图 ${Math.round(file.size / 1024)} KB · 压缩后约 ${Math.round(blob.size / 1024)} KB（长边 ≤1600px, JPEG q0.8）`);
    appToast('图片已就绪，保存小结时上传');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('图片处理失败：' + msg);
  }
}

function evoCompressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片解码失败'));
      img.onload = () => {
        const MAX = 1600;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w >= h) {
            h = Math.round((h * MAX) / w);
            w = MAX;
          } else {
            w = Math.round((w * MAX) / h);
            h = MAX;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('画布初始化失败'));
          return;
        }
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('压缩失败'))), 'image/jpeg', 0.8);
      };
      const result = e.target?.result;
      if (typeof result === 'string') img.src = result;
      else reject(new Error('读取图片失败'));
    };
    reader.readAsDataURL(file);
  });
}

async function evRemovePhoto() {
  const ok = await appConfirm('删除今天这张图片？删除后不可恢复。', { title: '删除图片', confirmText: '删除' });
  if (!ok) return;
  if (evoState.photoId) {
    try {
      await api.deletePhoto(evoState.photoId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      appToast('删除图片失败：' + msg);
      return;
    }
  }
  evoResetPhotoUI();
  appToast('已删除今日图片');
}

// ── 评分与文案分档编辑 ──

function evUpdateScore(v) {
  const n = Number(v);
  const num = byId('score-value');
  if (num) {
    num.innerText = String(n);
    num.classList.remove('ev-pop');
    void num.offsetWidth;
    num.classList.add('ev-pop');
  }
  const slider = inputById('score-range');
  if (slider && slider.value !== String(n)) slider.value = String(n);
  evoPaintScoreBand(n);
}

function evoPaintScoreBand(n) {
  const b = evoBandOf(n);
  const el = byId('score-text');
  if (el) {
    el.innerText = b.label;
    el.className = 'mt-2 text-center text-xs font-mono font-medium rounded-lg py-2 transition-colors ' + evoTone(b.tone).band;
  }
}

function evToggleBandEditor() {
  const panel = byId('band-editor');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) evoRenderBandRows();
}

function evoRenderBandRows() {
  const bands = evoBands || EVO_DEFAULT_BANDS;
  const container = byId('band-rows');
  if (!container) return;
  container.innerHTML = bands.map((b, i) => `
    <div class="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5">
      <span class="text-[11px] font-bold font-mono text-neutral-500 tabular-nums w-9 shrink-0">${b.range[0]}-${b.range[1]}</span>
      <button type="button" data-action="ev-cycle-tone" data-idx="${i}" title="点击切换配色"
              class="w-3.5 h-3.5 rounded-full shrink-0 border border-neutral-200 shadow-sm active:scale-90 transition-transform"
              style="background:${evoTone(b.tone).dot}"></button>
      <input type="text" data-action="ev-band-label" data-idx="${i}" value="${evoAttr(b.label)}" maxlength="20"
             class="flex-1 min-w-0 bg-transparent text-xs text-neutral-800 outline-none font-sans">
    </div>`).join('');
}

function evSetBandLabel(i, v) {
  const bands = evoBands || EVO_DEFAULT_BANDS;
  if (!bands[i]) return;
  bands[i].label = v;
  evoRefreshScoreChips();
  evoPaintScoreBand(Number(inputById('score-range')?.value) || 7);
}

function evCycleTone(i) {
  const bands = evoBands || EVO_DEFAULT_BANDS;
  if (!bands[i]) return;
  const cur = EVO_TONE_CYCLE.indexOf(bands[i].tone);
  bands[i].tone = EVO_TONE_CYCLE[(cur + 1) % EVO_TONE_CYCLE.length];
  evoRenderBandRows();
  evoRefreshScoreChips();
  evoPaintScoreBand(Number(inputById('score-range')?.value) || 7);
}

function evResetBands() {
  evoBands = EVO_DEFAULT_BANDS.map((b) => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone }));
  evoRenderBandRows();
  evoRefreshScoreChips();
  evoPaintScoreBand(Number(inputById('score-range')?.value) || 7);
  appToast('已恢复默认文案，点击「保存设置」生效');
}

async function evSaveBands() {
  const bands = evoBands || EVO_DEFAULT_BANDS;
  const btn = buttonById('band-save-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-60');
  }
  try {
    await api.saveSummaryScoreBands(bands.map((b) => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone })));
    appToast('评分文案已保存并生效');
    evoRefreshScoreChips();
    evoPaintScoreBand(Number(inputById('score-range')?.value) || 7);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('保存失败：' + msg);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-60');
    }
  }
}

// ── 保存小结 ──

async function evSave() {
  const btn = buttonById('ev-save-btn');
  const date = evoState.date || evoToday();
  const done = [1, 2, 3].map((i) => inputById('done-' + i)?.value.trim() || '').filter(Boolean);
  const note = textareaById('note-text')?.value.trim() || '';
  const score = Number(inputById('score-range')?.value) || 7;
  const hasPhoto = !!evoState.pendingBlob || !!evoState.photoId;
  if (!done.length && !note && !hasPhoto) {
    appToast('至少填写三件事、图片或感想中的一项');
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-60');
  }
  try {
    let photoId = evoState.photoId;
    if (evoState.pendingBlob) {
      const upJson = await api.uploadEveningPhoto(date, evoState.pendingBlob);
      photoId = (upJson.data && upJson.data.photo_id) ? upJson.data.photo_id : null;
    }
    await api.saveEveningSummary({ record_date: date, done_items: done, note_text: note, score, photo_id: photoId || null });

    evoState.photoId = photoId;
    if (evoState.pendingBlob && photoId) {
      const prevUrl = imgById('photo-preview')?.src;
      if (prevUrl && prevUrl.startsWith('blob:')) URL.revokeObjectURL(prevUrl);
      evoShowPhoto(`/api/v1/evening/photo/${photoId}`, '已保存 · 长边 ≤1600px, JPEG q0.8');
    }
    evoState.pendingBlob = null;
    evoState.dirty = false;
    appToast('今日小结已保存');
    await evoLoadList();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('保存失败：' + msg);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-60');
    }
  }
}

// ── 小结洞察 ──

function evoRangeLabel(n) {
  return (n === 30) ? '近 30 天' : '近 7 天';
}

function evSetInsightRange(btn) {
  document.querySelectorAll('#ev-insight-range button').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  evoState.insightRange = Number(btn.dataset.val) || 7;
}

function evoSyncRangeChips(n) {
  if (n !== 7 && n !== 30) return;
  evoState.insightRange = n;
  document.querySelectorAll('#ev-insight-range button').forEach((b) => {
    b.classList.toggle('active', b instanceof HTMLElement && Number(b.dataset.val) === n);
  });
}

async function evoLoadInsight(date, seq = evoLoadSeq) {
  const isStale = () => seq !== evoLoadSeq || date !== evoState.date;
  evoStopInsight();
  const emptyEl = byId('insight-empty');
  const panel = byId('insight-panel');
  byId('think-body')?.classList.remove('open');
  byId('think-arrow')?.classList.remove('rotate-90');
  const thinkText = byId('think-text');
  if (thinkText) thinkText.innerText = '';
  const insightBody = byId('insight-body');
  if (insightBody) insightBody.innerHTML = '';
  panel?.classList.add('hidden');
  emptyEl?.classList.remove('hidden');
  try {
    const json = await api.getEveningInsight(date);
    if (isStale()) return;
    const data = json ? json.data : null;
    if (data && data.content) evoRenderInsight(data);
  } catch (_) {}
}

function evoFmtTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return p(d.getHours()) + ':' + p(d.getMinutes());
}

function evoRenderInsight(data) {
  byId('insight-empty')?.classList.add('hidden');
  byId('insight-panel')?.classList.remove('hidden');
  evoSyncRangeChips(Number(data.range_days));
  const rangeText = (data.range_days === 7 || data.range_days === 30) ? evoRangeLabel(data.range_days) + ' · ' : '';
  const metaEl = byId('insight-meta');
  if (metaEl) metaEl.innerText = `${evoMmdd(data.start_date || evoState.date)} · ${rangeText}生成于 ${evoFmtTime(data.created_at)}`;
  const bodyEl = byId('insight-body');
  if (bodyEl) bodyEl.innerHTML = renderMarkdown(data.content || '');
  const thinkEl = byId('think-text');
  if (thinkEl) thinkEl.innerText = data.thinking || '';
}

function evoStopInsight() {
  if (evoInsightAbort) {
    try { evoInsightAbort.abort(); } catch (_) {}
    evoInsightAbort = null;
  }
  byId('insight-body')?.classList.remove('typing-cursor');
}

async function evGenerateInsight() {
  if (evoInsightAbort) {
    evoStopInsight();
    return;
  }
  if (evoState.insightBusy) return;
  const date = evoState.date || evoToday();
  const btn = buttonById('ev-insight-btn');
  const emptyEl = byId('insight-empty');
  const panel = byId('insight-panel');
  const body = byId('insight-body');

  evoStopInsight();
  evoLoadSeq++;
  evoState.insightBusy = true;
  const originalBtnClass = btn ? btn.className : '';
  if (btn) {
    btn.className = 'mt-3 w-full h-10 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]';
    btn.innerHTML = '<span>停止生成</span>';
  }

  emptyEl?.classList.add('hidden');
  panel?.classList.remove('hidden');
  panel?.classList.add('ev-rise');
  if (body) {
    body.innerHTML = '<p class="text-neutral-400 font-mono text-xs">（正在推导…）</p>';
    body.classList.add('typing-cursor');
  }
  const metaEl = byId('insight-meta');
  if (metaEl) metaEl.innerText = `${evoMmdd(date)} · ${evoRangeLabel(evoState.insightRange)} · 生成中…`;
  const thinkTextEl = byId('think-text');
  if (thinkTextEl) thinkTextEl.innerText = '';
  byId('think-body')?.classList.remove('open');
  byId('think-arrow')?.classList.remove('rotate-90');

  let autoCollapsed = false;
  let lastContent = '';
  const updateUI = ({ thinking, content }) => {
    if (body && content && content !== lastContent) {
      lastContent = content;
      body.innerHTML = renderMarkdown(content);
    }
    if (thinking && thinkTextEl) {
      thinkTextEl.innerText = thinking;
      if (!content) {
        byId('think-body')?.classList.add('open');
        byId('think-arrow')?.classList.add('rotate-90');
      } else if (!autoCollapsed) {
        autoCollapsed = true;
        byId('think-body')?.classList.remove('open');
        byId('think-arrow')?.classList.remove('rotate-90');
      }
    }
  };

  const controller = new AbortController();
  evoInsightAbort = controller;
  const tzOffset = -new Date().getTimezoneOffset();
  const stopBtn = byId('ev-insight-stop-btn');
  const resetBtn = byId('ev-insight-reset-btn');
  stopBtn?.classList.remove('hidden');
  resetBtn?.classList.add('hidden');

  try {
    const res = await streamChatSSE({
      url: `/api/v1/evening/insight/stream?date=${encodeURIComponent(date)}&days=${evoState.insightRange}&tz_offset=${tzOffset}`,
      signal: controller.signal,
      onUpdate: updateUI,
      onDone: ({ thinking, content, hasError }) => {
        if (hasError) {
          if (metaEl) metaEl.innerText = `${evoMmdd(date)} · ${evoRangeLabel(evoState.insightRange)} · 生成失败`;
        } else if (content || thinking) {
          if (metaEl) metaEl.innerText = `${evoMmdd(date)} · ${evoRangeLabel(evoState.insightRange)} · 生成于 ${evoFmtTime(new Date())}`;
        } else if (body) {
          body.innerHTML = '<p class="text-neutral-400 text-xs">未能获取到分析内容，请检查大模型配置。</p>';
        }
      },
      onError: (err, { thinking, content }) => {
        if (content || thinking) {
          updateUI({ thinking, content: content + '\n\n> **注意**: 网络连接中断' });
        } else if (err instanceof TypeError) {
          if (body) body.innerHTML = '<p class="text-rose-500 text-xs font-mono">无法连接本地服务，请确认 HealthTrack 正在运行。</p>';
        } else if (body) {
          const msg = err instanceof Error ? err.message : String(err);
          body.innerHTML = '<p class="text-rose-500 text-xs font-mono">生成失败：' + escapeHtml(msg) + '</p>';
        }
      },
    });
    if (res.aborted) {
      if (res.content || res.thinking) {
        updateUI({ thinking: res.thinking, content: res.content + '\n\n> **已手动停止生成**' });
        if (metaEl) metaEl.innerText = `${evoMmdd(date)} · ${evoRangeLabel(evoState.insightRange)} · 已停止`;
      } else {
        panel?.classList.add('hidden');
        emptyEl?.classList.remove('hidden');
      }
    }
  } finally {
    if (evoInsightAbort === controller) evoInsightAbort = null;
    body?.classList.remove('typing-cursor');
    evoState.insightBusy = false;
    stopBtn?.classList.add('hidden');
    resetBtn?.classList.remove('hidden');
    if (btn) {
      btn.className = originalBtnClass;
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>生成小结深度洞察</span>';
    }
  }
}

async function evResetInsight() {
  const ok = await appConfirm('清除这一天的小结洞察？清除后可重新生成。', { title: '清除洞察', confirmText: '清除' });
  if (!ok) return;
  const date = evoState.date || evoToday();
  try {
    await api.deleteEveningInsight(date);
    evoStopInsight();
    byId('insight-panel')?.classList.add('hidden');
    byId('insight-empty')?.classList.remove('hidden');
    const b = byId('insight-body');
    if (b) b.innerHTML = '';
    const t = byId('think-text');
    if (t) t.innerText = '';
    byId('think-body')?.classList.remove('open');
    byId('think-arrow')?.classList.remove('rotate-90');
    appToast('已清除该日小结洞察');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appToast('清除失败：' + msg);
  }
}

function evToggleThinking() {
  const wrap = byId('think-body');
  const arrow = byId('think-arrow');
  if (!wrap) return;
  const open = !wrap.classList.contains('open');
  wrap.classList.toggle('open', open);
  if (arrow) arrow.classList.toggle('rotate-90', open);
}
