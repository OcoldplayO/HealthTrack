/**
 * 批量导入弹窗与备忘录解析导入弹窗 (ImportModal)
 */
import { ApiError, api } from '../../services/api.js';
import { navigateTab } from '../../services/router.js';
import { store } from '../../services/state.js';
import { showToast } from '../Toast.js';
import { appConfirm } from '../../utils/dialog.js';
import { buttonById, byId, closestEl, inputById, selectById, textareaById } from '../../utils/dom.js';
import { escapeHtml } from '../../utils/format.js';
import { loadRecordForDate } from '../../views/log/log-controller.js';
import { formatBytes } from './ExportModal.js';

const impState = {
  token: /** @type {string | null} */ (null),
  preview: /** @type {Record<string, any> | null} */ (null),
  mode: 'merge',
  skipErrors: false,
  busy: false,
};

let importBound = false;

export function initImportModal() {
  if (importBound) return;
  const modal = byId('import-modal');
  const memoModal = byId('memo-import-modal');
  if (!modal && !memoModal) return;
  importBound = true;

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeImport();
      return;
    }
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'import-close') {
      closeImport();
    } else if (action === 'imp-pick') {
      impPickFile();
    } else if (action === 'imp-reselect') {
      impResetState();
    } else if (action === 'imp-mode') {
      impSelectMode(target);
    } else if (action === 'imp-confirm') {
      impConfirm();
    }
  });

  const fileInput = inputById('import-file-input');
  fileInput?.addEventListener('change', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      impFileSelected(e.currentTarget);
    }
  });

  const skipErrors = inputById('import-skip-errors');
  skipErrors?.addEventListener('change', (e) => {
    if (e.currentTarget instanceof HTMLInputElement) {
      impToggleSkipErrors(e.currentTarget);
    }
  });

  memoModal?.addEventListener('click', (e) => {
    if (e.target === memoModal) {
      closeMemo();
      return;
    }
    const target = closestEl(e.target, '[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'memo-close') {
      closeMemo();
    } else if (action === 'memo-preview') {
      impPreviewMemo();
    }
  });
}

function impShow(elId, visible) {
  byId(elId)?.classList.toggle('hidden', !visible);
}

function impResetState() {
  impState.token = null;
  impState.preview = null;
  impState.mode = 'merge';
  impState.skipErrors = false;
  impState.busy = false;

  const input = inputById('import-file-input');
  if (input) input.value = '';
  impShow('import-step-pick', true);
  impShow('import-step-preview', false);
  impShow('import-step-options', false);
  impShow('import-fatal', false);
  impShow('import-dup-tip', false);
  impShow('import-issue-wrap', false);
  impShow('import-diff-wrap', false);
  impShow('import-result', false);
  impShow('import-skip-wrap', false);
  impShow('import-pick-btn', true);

  const skipCb = inputById('import-skip-errors');
  if (skipCb) skipCb.checked = false;
  const resultEl = byId('import-result');
  if (resultEl) resultEl.textContent = '';
  const subEl = byId('import-subtitle');
  if (subEl) subEl.textContent = '预检不写入数据，确认后才会导入';

  impSetConfirm(false);
  impSetBusy(false);
  const mergeBtn = document.querySelector('#import-step-options button[data-mode="merge"]');
  if (mergeBtn instanceof HTMLElement) impSelectMode(mergeBtn);
}

function impSetBusy(busy) {
  impState.busy = busy;
  const btn = buttonById('import-pick-btn');
  if (btn) {
    btn.disabled = busy;
    btn.classList.toggle('opacity-50', busy);
    btn.textContent = busy ? '预检中…' : '选择文件';
  }
  const memoBtn = buttonById('memo-preview-btn');
  if (memoBtn) {
    memoBtn.disabled = busy;
    memoBtn.classList.toggle('opacity-50', busy);
    memoBtn.textContent = busy ? '预检中…' : '预检';
  }
  const confirm = buttonById('import-confirm-btn');
  if (confirm && busy) {
    confirm.disabled = true;
    confirm.classList.add('opacity-50');
  }
}

function impSetConfirm(enabled, label) {
  const btn = buttonById('import-confirm-btn');
  if (!btn) return;
  btn.disabled = !enabled;
  btn.classList.toggle('opacity-50', !enabled);
  btn.textContent = label || (impState.preview && impState.preview.errors > 0 && impState.skipErrors ? '跳过错误行并导入' : '确认导入');
}

export function openImportModal() {
  impResetState();
  byId('import-modal')?.classList.remove('hidden');
}

export function closeImport() {
  byId('import-modal')?.classList.add('hidden');
}

/**
 * 供导入批次弹窗在重试成功后直接打开预检结果
 * @param {Record<string, any>} previewData
 */
export function openImportPreviewFromRetry(previewData) {
  impResetState();
  byId('import-modal')?.classList.remove('hidden');
  impRenderPreview(previewData);
}

function impPickFile() {
  if (impState.busy) return;
  inputById('import-file-input')?.click();
}

function impFileSelected(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('文件超过 5 MB，请按年份拆分后导入', false);
    input.value = '';
    return;
  }
  impSendPreview(file);
}

async function impSendPreview(file) {
  impSetBusy(true);
  try {
    const form = new FormData();
    form.append('file', file);
    form.append('file_name', file.name || '');
    const json = await api.previewImportFile(form);
    if (!json || !json.data) {
      impShowPreviewError('预检失败：服务端返回异常');
      return;
    }
    impRenderPreview(json.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误';
    impShowPreviewError('预检失败：' + msg);
  } finally {
    impSetBusy(false);
  }
}

function impShowPreviewError(message) {
  impShow('import-step-pick', true);
  impShow('import-step-preview', false);
  impShow('import-result', true);
  const el = byId('import-result');
  if (!el) return;
  el.className = 'text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600';
  el.textContent = message;
}

function impRenderPreview(data) {
  impState.preview = data;
  impState.token = data.token || null;
  impState.skipErrors = false;

  impShow('import-step-pick', false);
  impShow('import-step-preview', true);
  impShow('import-step-options', true);
  impShow('import-result', false);

  const sourceLabel = data.source_type === 'json' ? 'JSON 备份' : (data.source_type === 'memo' ? '备忘录粘贴' : 'CSV 文件');
  const size = data.file_size ? formatBytes(data.file_size) : '';
  const reselect = data.source_type === 'memo' ? '' :
    ' · <button type="button" data-action="imp-reselect" class="text-neutral-900 font-semibold underline underline-offset-2">重新选择</button>';
  const metaEl = byId('import-file-meta');
  if (metaEl) {
    metaEl.innerHTML = `<span class="font-bold text-slate-700">${escapeHtml(data.file_name || sourceLabel)}</span> · ${sourceLabel}${size ? ' · ' + size : ''} · 编码 ${escapeHtml(data.encoding || '—')}${reselect}`;
  }

  const statTotal = byId('imp-stat-total');
  const statInserted = byId('imp-stat-inserted');
  const statUpdated = byId('imp-stat-updated');
  const statWarnings = byId('imp-stat-warnings');
  const statErrors = byId('imp-stat-errors');
  if (statTotal) statTotal.textContent = String(data.total_rows || 0);
  if (statInserted) statInserted.textContent = String(data.inserted || 0);
  if (statUpdated) statUpdated.textContent = String(data.updated || 0);
  if (statWarnings) statWarnings.textContent = String(data.warnings || 0);
  if (statErrors) statErrors.textContent = String(data.errors || 0);

  const dup = byId('import-dup-tip');
  if (dup) {
    if (data.duplicate) {
      dup.classList.remove('hidden');
      dup.innerHTML = `这个文件在 ${escapeHtml((data.duplicate.created_at || '').slice(0, 10))} 已导入过一次（新增 ${data.duplicate.inserted} / 更新 ${data.duplicate.updated}），请确认不是重复操作。`;
    } else {
      dup.classList.add('hidden');
    }
  }

  const fatal = byId('import-fatal');
  if (fatal) {
    if (data.fatal) {
      fatal.classList.remove('hidden');
      fatal.textContent = data.fatal;
    } else {
      fatal.classList.add('hidden');
    }
  }

  impRenderIssues(data);
  impRenderDiffs(data);

  const hasErrors = (data.errors || 0) > 0;
  impShow('import-skip-wrap', hasErrors && !data.fatal);
  const skipCb = inputById('import-skip-errors');
  if (skipCb) skipCb.checked = false;
  impSetConfirm(!!data.token && !data.fatal && (!hasErrors || impState.skipErrors));
}

function impRenderIssues(data) {
  const wrap = byId('import-issue-wrap');
  const list = byId('import-issue-list');
  const countEl = byId('import-issue-count');
  if (!wrap || !list) return;
  const issues = (data.issues || []).filter((i) => i.level === 'error' || i.level === 'warning');
  if (!issues.length) {
    wrap.classList.add('hidden');
    return;
  }
  wrap.classList.remove('hidden');
  if (countEl) {
    countEl.textContent = `共 ${data.errors || 0} 条错误 / ${data.warnings || 0} 条警告` + (data.issues_truncated ? '（仅显示前 500 条）' : '');
  }
  list.innerHTML = issues.slice(0, 50).map((i) => {
    const isErr = i.level === 'error';
    const chip = isErr ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700';
    return `<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${chip}">${isErr ? '错误' : '警告'}</span>
      <span class="text-[11px] text-slate-600 leading-snug break-all">第 ${i.line} 行${i.date ? ' · ' + escapeHtml(i.date) : ''}：${escapeHtml(i.message)}</span>
    </div>`;
  }).join('');
}

function impRenderDiffs(data) {
  const wrap = byId('import-diff-wrap');
  const list = byId('import-diff-list');
  const countEl = byId('import-diff-count');
  if (!wrap || !list) return;
  const diffs = data.row_diffs || [];
  if (!diffs.length) {
    wrap.classList.add('hidden');
    return;
  }
  wrap.classList.remove('hidden');
  if (countEl) {
    countEl.textContent = `前 ${diffs.length} 条` + (data.diffs_truncated ? '（还有更多）' : '');
  }
  list.innerHTML = diffs.slice(0, 30).map((d) => {
    const isInsert = d.action === 'insert';
    const changes = (d.changes || []).slice(0, 4).map((c) => {
      const oldV = c.old === '' ? '空' : c.old;
      const newV = c.new === '' ? '空' : c.new;
      return `${c.label} ${oldV}→${newV}`;
    }).join('，');
    return `<div class="rounded-lg bg-white border border-slate-100 px-2.5 py-1.5">
      <div class="flex items-center justify-between text-[11px]">
        <span class="font-bold text-slate-700">${escapeHtml(d.date)}</span>
        <span class="${isInsert ? 'text-emerald-600' : 'text-neutral-900 font-semibold'}">${isInsert ? '新增' : '更新'}</span>
      </div>
      ${changes ? `<p class="text-[10px] text-slate-400 mt-0.5 break-all">${escapeHtml(changes)}</p>` : ''}
    </div>`;
  }).join('');
}

/**
 * @param {HTMLElement} btn
 */
function impSelectMode(btn) {
  if (!btn) return;
  impState.mode = btn.getAttribute('data-mode') || 'merge';
  document.querySelectorAll('#import-step-options button[data-mode]').forEach((b) => {
    const active = b === btn;
    b.className = active
      ? 'w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50 transition-all'
      : 'w-full text-left px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white transition-all';
  });
}

function impToggleSkipErrors(cb) {
  impState.skipErrors = !!(cb && cb.checked);
  const p = impState.preview;
  const hasErrors = !!(p && (p.errors || 0) > 0);
  impSetConfirm(!!(p && p.token && !p.fatal && (!hasErrors || impState.skipErrors)));
}

async function impConfirm() {
  if (impState.busy) return;
  if (!impState.token) {
    showToast('预检已失效，请重新选择文件', false);
    return;
  }
  const p = impState.preview || {};
  if ((p.errors || 0) > 0 && !impState.skipErrors) {
    showToast('存在错误行：请勾选「跳过错误行」，或修正文件后重新导入', false);
    return;
  }

  const modeLabel = impState.mode === 'overwrite' ? '替换（空值会清空旧数据）' : '合并（空单元格保留旧值）';
  const ok = await appConfirm(
    `将写入 ${p.inserted || 0} 条新增记录、更新 ${p.updated || 0} 条已有记录，冲突处理方式：${modeLabel}${impState.skipErrors ? '，并跳过 ' + (p.errors || 0) + ' 条错误行' : ''}。写入过程为单个事务，失败会整体回滚。`,
    { title: '确认导入？', confirmText: '开始导入', danger: false }
  );
  if (!ok) return;

  impSetBusy(true);
  const resultEl = byId('import-result');
  try {
    const json = await api.confirmImport({
      token: impState.token,
      conflict_mode: impState.mode,
      skip_errors: impState.skipErrors,
    });
    const data = json && json.data;
    if (!data) throw new Error('导入失败：返回数据异常');
    if (resultEl) {
      resultEl.classList.remove('hidden');
      resultEl.className = 'text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700';
      resultEl.innerHTML = `<span class="font-bold">导入完成</span><br>新增 ${data.inserted || 0} 条 · 更新 ${data.updated || 0} 条${data.skipped ? ' · 跳过 ' + data.skipped + ' 行' : ''}<br>可在「导入记录」中查看本次明细。`;
    }
    impShow('import-step-options', false);
    impShow('import-skip-wrap', false);
    impState.token = null;
    impSetConfirm(false, '已完成');
    showToast('导入完成', true);
    impRefreshData();
  } catch (e) {
    if (resultEl) {
      resultEl.classList.remove('hidden');
      resultEl.className = 'text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600';
      const prefix = (e instanceof ApiError && e.status === 409) ? '预检已过期，请重新选择文件：' : '导入失败：';
      resultEl.textContent = prefix + (e instanceof Error ? e.message : '网络错误');
    }
    if (e instanceof ApiError && e.status) impSetConfirm(false);
    showToast('导入失败', false);
  } finally {
    impSetBusy(false);
  }
}

function impRefreshData() {
  const tab = store.state.currentTab || 'log';
  if (tab === 'log') {
    const dateVal = inputById('input-date')?.value;
    if (dateVal) loadRecordForDate(dateVal);
  } else {
    navigateTab(tab);
  }
}

// ── 备忘录粘贴导入 ──

export function openMemoImportModal() {
  const sel = selectById('memo-year-base');
  if (sel) {
    const year = new Date().getFullYear();
    sel.innerHTML = [year, year - 1, year - 2].map((y) => `<option value="${y}">${y} 年</option>`).join('');
  }
  byId('memo-import-modal')?.classList.remove('hidden');
}

export function closeMemo() {
  byId('memo-import-modal')?.classList.add('hidden');
}

async function impPreviewMemo() {
  const text = textareaById('memo-import-text')?.value || '';
  if (!text.trim()) {
    showToast('请先粘贴备忘录内容', false);
    return;
  }
  const yearBase = Number(selectById('memo-year-base')?.value) || new Date().getFullYear();
  closeMemo();
  impResetState();
  byId('import-modal')?.classList.remove('hidden');
  impShow('import-step-pick', false);
  const subEl = byId('import-subtitle');
  if (subEl) subEl.textContent = '正在预检粘贴内容…';
  impSetBusy(true);

  try {
    const json = await api.previewImportMemo(text, yearBase);
    if (subEl) subEl.textContent = '预检不写入数据，确认后才会导入';
    if (!json || !json.data) {
      impShow('import-step-pick', true);
      const pickBtn = byId('import-pick-btn');
      if (pickBtn) pickBtn.textContent = '选择文件';
      impShowPreviewError('预检失败：服务端返回异常');
    } else {
      impRenderPreview(json.data);
    }
  } catch (e) {
    if (subEl) subEl.textContent = '预检不写入数据，确认后才会导入';
    impShow('import-step-pick', true);
    const pickBtn = byId('import-pick-btn');
    if (pickBtn) pickBtn.textContent = '选择文件';
    const msg = e instanceof Error ? e.message : '网络错误';
    impShowPreviewError('预检失败：' + msg);
  } finally {
    impSetBusy(false);
  }
}
