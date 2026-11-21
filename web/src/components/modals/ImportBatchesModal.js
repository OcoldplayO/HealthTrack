/**
 * 导入批次历史弹窗 (ImportBatchesModal)
 */
import { api } from '../../services/api.js';
import { showToast } from '../Toast.js';
import { byId, closestEl } from '../../utils/dom.js';
import { escapeHtml } from '../../utils/format.js';
import { downloadFile } from './ExportModal.js';
import { openImportPreviewFromRetry } from './ImportModal.js';

const IMP_BATCH_STATUS = {
  success: { label: '成功', cls: 'bg-emerald-50 text-emerald-600' },
  partial: { label: '部分成功', cls: 'bg-amber-50 text-amber-700' },
  failed: { label: '失败', cls: 'bg-rose-50 text-rose-600' },
  interrupted: { label: '中断', cls: 'bg-rose-50 text-rose-600' },
  pending: { label: '进行中', cls: 'bg-slate-100 text-slate-500' },
};

let batchesBound = false;

export function initImportBatchesModal() {
  if (batchesBound) return;
  const modal = byId('import-batches-modal');
  if (!modal) return;
  batchesBound = true;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBatches();
      return;
    }
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'batches-close') {
      closeBatches();
      return;
    }
    const id = Number(target.dataset.id);
    if (!id) return;
    if (action === 'batch-detail') {
      impToggleBatchDetail(id);
    } else if (action === 'batch-failed') {
      downloadFailedRows(id);
    } else if (action === 'batch-retry') {
      impRetryBatch(id);
    }
  });
}

export function openImportBatchesModal() {
  byId('import-batches-modal')?.classList.remove('hidden');
  impLoadBatches();
}

export function closeBatches() {
  byId('import-batches-modal')?.classList.add('hidden');
}

async function impLoadBatches() {
  const box = byId('batches-list');
  if (!box) return;
  box.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">加载中…</p>';
  try {
    const json = await api.getImportBatches(20);
    const list = (json && Array.isArray(json.data)) ? json.data : [];
    impRenderBatches(list);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    box.innerHTML = `<p class="text-xs text-rose-500 text-center py-8">加载失败：${escapeHtml(msg)}</p>`;
  }
}

function impRenderBatches(list) {
  const box = byId('batches-list');
  if (!box) return;
  if (!list.length) {
    box.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">还没有导入记录</p>';
    return;
  }
  box.innerHTML = list.map((b) => {
    const st = IMP_BATCH_STATUS[b.status] || { label: b.status, cls: 'bg-slate-100 text-slate-500' };
    const source = b.source_type === 'json' ? 'JSON 备份' : (b.source_type === 'memo' ? '备忘录' : 'CSV');
    const when = String(b.created_at || '').replace('T', ' ').slice(0, 16);
    /** @type {string[]} */
    const actions = [];
    actions.push(`<button type="button" data-action="batch-detail" data-id="${b.id}" class="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200">详情</button>`);
    if (b.has_cache && b.errors > 0) {
      actions.push(`<button type="button" data-action="batch-failed" data-id="${b.id}" class="px-2.5 py-1 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 hover:bg-amber-200">失败行</button>`);
    }
    if (b.retryable) {
      actions.push(`<button type="button" data-action="batch-retry" data-id="${b.id}" class="px-2.5 py-1 rounded-lg bg-neutral-900 text-[11px] font-mono font-medium text-white hover:bg-neutral-800">重试</button>`);
    }
    return `<div class="rounded-xl border border-neutral-200 px-3.5 py-3">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-bold text-slate-800 truncate">${escapeHtml(b.file_name || source)}</p>
        <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}">${st.label}</span>
      </div>
      <p class="text-[10px] text-slate-400 mt-0.5">${source} · ${escapeHtml(when)} · 共 ${b.total_rows || 0} 行${b.attempt_no > 1 ? ' · 第 ' + b.attempt_no + ' 次尝试' : ''}</p>
      <p class="text-[11px] text-slate-500 mt-1">新增 ${b.inserted || 0} · 更新 ${b.updated || 0} · 跳过 ${b.skipped || 0} · 警告 ${b.warnings || 0} · 错误 ${b.errors || 0}</p>
      ${b.error_message ? `<p class="text-[10px] text-rose-500 mt-1 break-all">${escapeHtml(b.error_message)}</p>` : ''}
      <div class="flex flex-wrap gap-1.5 mt-2">${actions.join('')}</div>
      <div id="batch-issues-${b.id}" class="hidden mt-2 space-y-1"></div>
    </div>`;
  }).join('');
}

async function impToggleBatchDetail(id) {
  const box = byId('batch-issues-' + id);
  if (!box) return;
  if (!box.classList.contains('hidden')) {
    box.classList.add('hidden');
    return;
  }
  box.classList.remove('hidden');
  if (box.dataset.loaded === '1') return;
  box.dataset.loaded = '1';
  box.innerHTML = '<p class="text-[11px] text-slate-400">加载中…</p>';
  try {
    const json = await api.getImportBatchDetail(id);
    const issues = (json && json.data && json.data.issues) ? json.data.issues : [];
    if (!issues.length) {
      box.innerHTML = '<p class="text-[11px] text-slate-400">没有行级问题</p>';
      return;
    }
    box.innerHTML = issues.slice(0, 50).map((i) => {
      const isErr = i.level === 'error';
      const chip = isErr ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700';
      return `<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2 py-1">
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${chip}">${isErr ? '错误' : '警告'}</span>
        <span class="text-[10px] text-slate-600 leading-snug break-all">第 ${i.line} 行${i.date ? ' · ' + escapeHtml(i.date) : ''}：${escapeHtml(i.message)}</span>
      </div>`;
    }).join('');
  } catch (_) {
    box.innerHTML = '<p class="text-[11px] text-rose-500">明细加载失败</p>';
  }
}

async function impRetryBatch(id) {
  try {
    const json = await api.retryImportBatch(id);
    if (!json || !json.data) {
      showToast('重试失败', false);
      return;
    }
    closeBatches();
    openImportPreviewFromRetry(json.data);
    showToast('已重新预检，请确认后写入', true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    showToast('重试失败：' + msg, false);
  }
}

function downloadFailedRows(id) {
  closeBatches();
  downloadFile(`/api/v1/import/batches/${id}/failed-rows`, `HealthTrack_failed_rows_${id}.csv`, '失败行已下载，可修正后重新导入');
}
