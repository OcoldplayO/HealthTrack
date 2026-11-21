/**
 * 数据导出与通用下载弹窗 (ExportModal)
 */
import { api } from '../../services/api.js';
import { showToast } from '../Toast.js';
import { appConfirm } from '../../utils/dialog.js';
import { buttonById, byId, closestEl } from '../../utils/dom.js';
import { escapeHtml } from '../../utils/format.js';

let exportRange = 'all';
let exportType = 'excel';
/** @type {number | null} */
let pendingExportSize = 0;
let exportBound = false;

export function initExportModal() {
  if (exportBound) return;
  const modal = byId('export-modal');
  if (!modal) return;
  exportBound = true;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeExport();
      return;
    }
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'export-close') {
      closeExport();
    } else if (action === 'export-type') {
      selectExportType(target);
    } else if (action === 'export-range') {
      selectExportRange(target);
    } else if (action === 'export-run') {
      exportCurrent();
    } else if (action === 'open-downloads') {
      window.HealthTrack?.openDownloads?.();
    }
  });
}

export function openExportModal() {
  byId('export-modal')?.classList.remove('hidden');
  const defaultTypeBtn = document.querySelector('#export-type-pills button[data-type="excel"]');
  const defaultRangeBtn = document.querySelector('#export-range-pills button[data-range="all"]');
  if (defaultTypeBtn instanceof HTMLElement) selectExportType(defaultTypeBtn);
  if (defaultRangeBtn instanceof HTMLElement) selectExportRange(defaultRangeBtn);
}

export function closeExport() {
  byId('export-modal')?.classList.add('hidden');
}

/**
 * @param {HTMLElement} btn
 */
function selectExportType(btn) {
  if (!btn) return;
  exportType = btn.getAttribute('data-type') || 'excel';
  document.querySelectorAll('#export-type-pills button').forEach((p) => {
    const active = p === btn;
    p.className = active
      ? 'py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all'
      : 'py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all';
  });
  const isJSON = exportType === 'json';
  const isArchive = exportType === 'archive';
  byId('export-range-panel')?.classList.toggle('hidden', isJSON);
  byId('export-json-panel')?.classList.toggle('hidden', !isJSON);
  byId('export-archive-panel')?.classList.toggle('hidden', !isArchive);
  byId('export-start-btn')?.classList.toggle('hidden', isJSON || isArchive);
  byId('export-json-btn')?.classList.toggle('hidden', !isJSON);
  byId('export-archive-btn')?.classList.toggle('hidden', !isArchive);
  const sub = byId('export-subtitle');
  if (sub) {
    sub.textContent = isJSON
      ? '全量备份，包含健康记录与睡前小结'
      : isArchive
        ? '小结表格 + 难忘图片，打包为 ZIP'
        : '导出为 CSV，可用 Excel / WPS 打开';
  }
  resetExportResult();
}

/**
 * @param {HTMLElement} btn
 */
function selectExportRange(btn) {
  exportRange = btn.getAttribute('data-range') || 'all';
  document.querySelectorAll('#export-range-pills button').forEach((p) => {
    const active = p === btn;
    p.className = active
      ? 'py-2 rounded-lg text-xs font-mono font-semibold bg-neutral-900 text-white transition-all'
      : 'py-2 rounded-lg text-xs font-mono font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all';
  });
  resetExportResult();
}

function resetExportResult() {
  const el = byId('export-result');
  if (!el) return;
  el.classList.add('hidden');
  el.textContent = '';
}

function exportCurrent() {
  if (exportType === 'json') return startJSONExport();
  if (exportType === 'archive') return startArchiveExport();
  return startExport();
}

function buildExportFilename(range) {
  const key = range === '7' ? '7d' : range === '30' ? '30d' : 'all';
  const d = new Date();
  const ymd = '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return `HealthTrack_export_${key}_${ymd}.csv`;
}

function triggerBrowserBlobDownload(blob, filename) {
  const a = document.createElement('a');
  const blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
}

async function startExport() {
  const tzOffset = -new Date().getTimezoneOffset();
  const qs = new URLSearchParams({ tz_offset: String(tzOffset) });
  if (exportRange !== 'all') qs.set('range', exportRange);
  const url = `/api/v1/export?${qs.toString()}`;

  if (window.HealthTrack) {
    pendingExportSize = await api.probeContentLength(url);
    setExportBusy(true);
    window.location.href = url;
    return;
  }

  setExportBusy(true);
  try {
    const blob = await api.fetchBlob(url);
    const filename = buildExportFilename(exportRange);
    triggerBrowserBlobDownload(blob, filename);
    showExportResult(true, { filename, size: blob.size, location: '浏览器默认下载目录' });
    showToast('导出成功', true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    showExportResult(false, { message: '导出失败：' + msg });
    showToast('导出失败', false);
  } finally {
    setExportBusy(false);
  }
}

function buildBackupFilename() {
  const d = new Date();
  const ymd = '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return `HealthTrack_backup_v2_${ymd}.json`;
}

async function startJSONExport() {
  const ok = await appConfirm(
    '将导出全部健康记录与睡前小结为一个 JSON 文件（不含小结照片与 AI 洞察），不受时间范围限制。导出后可原样回灌到本应用。',
    { title: '导出完整备份？', confirmText: '开始导出', danger: false }
  );
  if (!ok) return;

  const url = '/api/v1/export/json';

  if (window.HealthTrack) {
    pendingExportSize = await api.probeContentLength(url);
    setExportBusy(true);
    window.location.href = url;
    return;
  }

  setExportBusy(true);
  try {
    const blob = await api.fetchBlob(url);
    const filename = buildBackupFilename();
    triggerBrowserBlobDownload(blob, filename);
    showExportResult(true, { filename, size: blob.size, location: '浏览器默认下载目录' });
    showToast('备份已导出', true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    showExportResult(false, { message: '导出失败：' + msg });
    showToast('导出失败', false);
  } finally {
    setExportBusy(false);
  }
}

function buildArchiveFilename(range) {
  const key = range === '7' ? '7d' : range === '30' ? '30d' : 'all';
  const d = new Date();
  const ymd = '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return `HealthTrack_summaries_${key}_${ymd}.zip`;
}

async function startArchiveExport() {
  const tzOffset = -new Date().getTimezoneOffset();
  const qs = new URLSearchParams({ tz_offset: String(tzOffset) });
  if (exportRange !== 'all') qs.set('range', exportRange);
  const url = `/api/v1/export/summaries.zip?${qs.toString()}`;

  if (window.HealthTrack) {
    pendingExportSize = await api.probeContentLength(url);
    setExportBusy(true);
    window.location.href = url;
    return;
  }

  setExportBusy(true);
  try {
    const blob = await api.fetchBlob(url);
    const filename = buildArchiveFilename(exportRange);
    triggerBrowserBlobDownload(blob, filename);
    showExportResult(true, { filename, size: blob.size, location: '浏览器默认下载目录' });
    showToast('导出成功', true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    showExportResult(false, { message: '导出失败：' + msg });
    showToast('导出失败', false);
  } finally {
    setExportBusy(false);
  }
}

function setExportBusy(busy) {
  const btnID = exportType === 'json'
    ? 'export-json-btn'
    : exportType === 'archive' ? 'export-archive-btn' : 'export-start-btn';
  const btn = buttonById(btnID);
  if (!btn) return;
  btn.disabled = busy;
  btn.classList.toggle('opacity-50', busy);
  btn.textContent = busy
    ? '导出中…'
    : exportType === 'json' ? '导出 JSON 备份' : exportType === 'archive' ? '导出图文归档' : '开始导出';
}

function showExportResult(ok, info) {
  const el = byId('export-result');
  if (!el) return;
  el.classList.remove('hidden');
  if (ok) {
    const sizeText = info.size != null ? `（${formatBytes(info.size)}）` : '';
    const openAction = window.HealthTrack
      ? '<button type="button" data-action="open-downloads" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>'
      : '<button type="button" data-action="export-run" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';
    el.className = 'text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700';
    el.innerHTML = `文件已保存：<span class="font-bold break-all">${escapeHtml(info.filename)}</span>${sizeText}<br>位置：${escapeHtml(info.location)}<div>${openAction}</div>`;
  } else {
    el.className = 'text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600';
    el.textContent = info.message;
  }
}

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

/**
 * 统一下载：手机端交给原生 DownloadManager，PC 端 fetch 成 blob 触发下载
 * @param {string} url
 * @param {string} filename
 * @param {string} [okMessage]
 */
export async function downloadFile(url, filename, okMessage) {
  if (window.HealthTrack) {
    window.location.href = url;
    showToast('已开始下载', true);
    return;
  }
  try {
    const blob = await api.fetchBlob(url);
    triggerBrowserBlobDownload(blob, filename);
    showToast(okMessage || '文件已下载', true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    showToast('下载失败：' + msg, false);
  }
}

// 原生 Android 下载完成/失败回调（由 MainActivity.evaluateJavascript 调用）
window.onExportResult = function (result) {
  setExportBusy(false);
  const size = (result && result.size != null) ? result.size : pendingExportSize;
  pendingExportSize = null;
  const modal = byId('export-modal');
  const panelVisible = !!(modal && !modal.classList.contains('hidden'));
  if (result && result.ok) {
    if (panelVisible) {
      showExportResult(true, {
        filename: result.filename,
        size,
        location: result.location || '下载目录 Download/',
      });
    }
    showToast(result.filename ? '已保存：' + result.filename : '导出成功', true);
  } else {
    const errMsg = (result && result.message) || '未知错误';
    if (panelVisible) showExportResult(false, { message: '导出失败：' + errMsg });
    showToast('导出失败：' + errMsg, false);
  }
};
