/**
 * 通用弹窗组件 (导出、导入、批次、便签导入、通用确认框)
 */
import modalsHtml from './other-modals.html?raw';
import { api } from '../../services/api.js';
import { showToast } from '../Toast.js';

let exportRange = 'all';
let exportType = 'excel';
let pendingExportSize = 0;

export function renderOtherModals(container) {
  container.insertAdjacentHTML('beforeend', modalsHtml);
}



    function closeExport() {
      document.getElementById('export-modal').classList.add('hidden');
    }

    function closeExportOnBackdrop(event) {
      if (event.target === event.currentTarget) closeExport();
    }

    function selectExportRange(btn) {
      exportRange = btn.getAttribute('data-range');
      document.querySelectorAll('#export-range-pills button').forEach(p => {
        const active = p === btn;
        p.className = active
          ? 'py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition-all'
          : 'py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all';
      });
      resetExportResult();
    }

    function resetExportResult() {
      const el = document.getElementById('export-result');
      el.classList.add('hidden');
      el.textContent = '';
    }

    function buildExportFilename(range) {
      // 与后端 Content-Disposition 保持一致，采用 ASCII 文件名，避免跨平台/跨设备中文文件名乱码。
      const key = range === '7' ? '7d' : range === '30' ? '30d' : 'all';
      const d = new Date();
      const ymd = '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
      return `HealthTrack_export_${key}_${ymd}.csv`;
    }

    async function startExport() {
      const url = '/api/v1/export' + (exportRange === 'all' ? '' : `?range=${exportRange}`);

      // 手机 App：交给原生 DownloadListener → DownloadManager 下载，结果由原生回调 onExportResult
      if (window.HealthTrack) {
        pendingExportSize = await probeContentLength(url);
        setExportBusy(true);
        window.location.href = url;
        return;
      }

      // PC 浏览器：fetch → blob → 触发下载
      setExportBusy(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const filename = buildExportFilename(exportRange);

        const a = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

        showExportResult(true, { filename, size: blob.size, location: '浏览器默认下载目录' });
        showToast('导出成功', true);
      } catch (e) {
        showExportResult(false, { message: '导出失败：' + (e.message || '网络错误') });
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

    // JSON 完整备份：二次确认后直接下载，不做范围筛选。
    async function startJSONExport() {
      const ok = await appConfirm(
        '将导出全部健康记录与睡前小结为一个 JSON 文件（不含小结照片与 AI 洞察），不受时间范围限制。导出后可原样回灌到本应用。',
        { title: '导出完整备份？', confirmText: '开始导出', danger: false }
      );
      if (!ok) return;

      const url = '/api/v1/export/json';

      // 手机 App：同样交给原生 DownloadListener → DownloadManager 下载
      if (window.HealthTrack) {
        pendingExportSize = await probeContentLength(url);
        setExportBusy(true);
        window.location.href = url;
        return;
      }

      setExportBusy(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const filename = buildBackupFilename();

        const a = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

        showExportResult(true, { filename, size: blob.size, location: '浏览器默认下载目录' });
        showToast('备份已导出', true);
      } catch (e) {
        showExportResult(false, { message: '导出失败：' + (e.message || '网络错误') });
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

    // 图文归档：所选范围内的小结表格 + 全部难忘图片，服务端流式打包为 ZIP。
    async function startArchiveExport() {
      const url = '/api/v1/export/summaries.zip' + (exportRange === 'all' ? '' : `?range=${exportRange}`);

      // 手机 App：交给原生 DownloadListener → DownloadManager 下载
      if (window.HealthTrack) {
        pendingExportSize = await probeContentLength(url);
        setExportBusy(true);
        window.location.href = url;
        return;
      }

      setExportBusy(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const filename = buildArchiveFilename(exportRange);

        const a = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

        showExportResult(true, { filename, size: blob.size, location: '浏览器默认下载目录' });
        showToast('导出成功', true);
      } catch (e) {
        showExportResult(false, { message: '导出失败：' + (e.message || '网络错误') });
        showToast('导出失败', false);
      } finally {
        setExportBusy(false);
      }
    }

    function setExportBusy(busy) {
      const btnID = exportType === 'json'
        ? 'export-json-btn'
        : exportType === 'archive' ? 'export-archive-btn' : 'export-start-btn';
      const btn = document.getElementById(btnID);
      if (!btn) return;
      btn.disabled = busy;
      btn.classList.toggle('opacity-50', busy);
      btn.textContent = busy
        ? '导出中…'
        : exportType === 'json' ? '导出 JSON 备份' : exportType === 'archive' ? '导出图文归档' : '开始导出';
    }

    function showExportResult(ok, info) {
      const el = document.getElementById('export-result');
      el.classList.remove('hidden');
      if (ok) {
        const sizeText = info.size != null ? `（${formatBytes(info.size)}）` : '';
        const openAction = window.HealthTrack
          ? '<button onclick="window.HealthTrack.openDownloads()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">打开下载目录</button>'
          : '<button onclick="exportCurrent()" class="mt-1.5 text-emerald-700 underline underline-offset-2 font-bold">重新下载</button>';
        el.className = 'text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700';
        el.innerHTML = `文件已保存：<span class="font-bold break-all">${info.filename}</span>${sizeText}<br>位置：${info.location}<div>${openAction}</div>`;
      } else {
        el.className = 'text-xs rounded-xl px-3 py-2.5 bg-red-50 text-red-600';
        el.textContent = info.message;
      }
    }

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }

    // HEAD 请求读取 Content-Length；失败返回 null，结果提示里就不显示大小。
    async function probeContentLength(url) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) return null;
        const len = Number(res.headers.get('Content-Length'));
        return Number.isFinite(len) && len > 0 ? len : null;
      } catch (e) {
        return null;
      }
    }

    // 原生 Android 下载完成/失败回调（由 MainActivity.evaluateJavascript 调用）
    window.onExportResult = function (result) {
      setExportBusy(false);
      const size = (result && result.size != null) ? result.size : pendingExportSize;
      pendingExportSize = null;
      const modal = document.getElementById('export-modal');
      const panelVisible = modal && !modal.classList.contains('hidden');
      if (result && result.ok) {
        // 模板 / 失败行下载也会走原生下载回调，此时导出弹窗未打开，只提示不写面板
        if (panelVisible) showExportResult(true, { filename: result.filename, size, location: result.location || '下载目录 Download/' });
        showToast(result.filename ? '已保存：' + result.filename : '导出成功', true);
      } else {
        if (panelVisible) showExportResult(false, { message: '导出失败：' + ((result && result.message) || '未知错误') });
        showToast('导出失败：' + ((result && result.message) || '未知错误'), false);
      }
    };

    /* ============================================================
       批量导入：文件 / 备忘录 → 预检 → 原子写入 → 批次历史
       ============================================================ */
    let impState = { token: null, preview: null, mode: 'merge', skipErrors: false, busy: false };

    function impEsc(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function impShow(el, visible) {
      const node = document.getElementById(el);
      if (node) node.classList.toggle('hidden', !visible);
    }

    function impResetState() {
      impState = { token: null, preview: null, mode: 'merge', skipErrors: false, busy: false };
      const input = document.getElementById('import-file-input');
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
      document.getElementById('import-skip-errors').checked = false;
      document.getElementById('import-result').textContent = '';
      document.getElementById('import-subtitle').textContent = '预检不写入数据，确认后才会导入';
      impSetConfirm(false);
      impSetBusy(false);
      impSelectMode(document.querySelector('#import-step-options button[data-mode="merge"]'));
    }

    function impSetBusy(busy) {
      impState.busy = busy;
      const btn = document.getElementById('import-pick-btn');
      if (btn) {
        btn.disabled = busy;
        btn.classList.toggle('opacity-50', busy);
        btn.textContent = busy ? '预检中…' : '选择文件';
      }
      const memoBtn = document.getElementById('memo-preview-btn');
      if (memoBtn) {
        memoBtn.disabled = busy;
        memoBtn.classList.toggle('opacity-50', busy);
        memoBtn.textContent = busy ? '预检中…' : '预检';
      }
      const confirm = document.getElementById('import-confirm-btn');
      if (confirm && busy) {
        confirm.disabled = true;
        confirm.classList.add('opacity-50');
      }
    }

    function impSetConfirm(enabled, label) {
      const btn = document.getElementById('import-confirm-btn');
      if (!btn) return;
      btn.disabled = !enabled;
      btn.classList.toggle('opacity-50', !enabled);
      btn.textContent = label || (impState.preview && impState.preview.errors > 0 && impState.skipErrors ? '跳过错误行并导入' : '确认导入');
    }

    function openImportFromSheet() {
      closeDataSheet();
      impResetState();
      document.getElementById('import-modal').classList.remove('hidden');
    }

    function closeImport() {
      document.getElementById('import-modal').classList.add('hidden');
    }

    function closeImportOnBackdrop(event) {
      if (event.target === event.currentTarget) closeImport();
    }

    function impPickFile() {
      if (impState.busy) return;
      document.getElementById('import-file-input').click();
    }

    function impReselectFile() {
      impResetState();
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

    // 文件预检：multipart 上传，后端只解析不落库。
    async function impSendPreview(file) {
      impSetBusy(true);
      try {
        const form = new FormData();
        form.append('file', file);
        form.append('file_name', file.name || '');
        const resp = await fetch('/api/v1/import/preview', { method: 'POST', body: form });
        let json = null;
        try { json = await resp.json(); } catch (e) { json = null; }
        if (!json || json.code !== 200 || !json.data) {
          const msg = (json && json.message) || ('HTTP ' + resp.status);
          impShowPreviewError('预检失败：' + msg);
          return;
        }
        impRenderPreview(json.data);
      } catch (e) {
        impShowPreviewError('预检失败：' + (e.message || '网络错误'));
      } finally {
        impSetBusy(false);
      }
    }

    function impShowPreviewError(message) {
      impShow('import-step-pick', true);
      impShow('import-step-preview', false);
      impShow('import-result', true);
      const el = document.getElementById('import-result');
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
        ' · <button type="button" onclick="impReselectFile()" class="text-blue-600 underline underline-offset-2">重新选择</button>';
      document.getElementById('import-file-meta').innerHTML =
        `<span class="font-bold text-slate-700">${impEsc(data.file_name || sourceLabel)}</span> · ${sourceLabel}${size ? ' · ' + size : ''} · 编码 ${impEsc(data.encoding || '—')}${reselect}`;

      document.getElementById('imp-stat-total').textContent = data.total_rows || 0;
      document.getElementById('imp-stat-inserted').textContent = data.inserted || 0;
      document.getElementById('imp-stat-updated').textContent = data.updated || 0;
      document.getElementById('imp-stat-warnings').textContent = data.warnings || 0;
      document.getElementById('imp-stat-errors').textContent = data.errors || 0;

      const dup = document.getElementById('import-dup-tip');
      if (data.duplicate) {
        dup.classList.remove('hidden');
        dup.innerHTML = `这个文件在 ${impEsc((data.duplicate.created_at || '').slice(0, 10))} 已导入过一次（新增 ${data.duplicate.inserted} / 更新 ${data.duplicate.updated}），请确认不是重复操作。`;
      } else {
        dup.classList.add('hidden');
      }

      const fatal = document.getElementById('import-fatal');
      if (data.fatal) {
        fatal.classList.remove('hidden');
        fatal.textContent = data.fatal;
      } else {
        fatal.classList.add('hidden');
      }

      impRenderIssues(data);
      impRenderDiffs(data);

      const hasErrors = (data.errors || 0) > 0;
      // 错误行默认阻断写入；用户勾选「跳过错误行」后才允许确认。
      impShow('import-skip-wrap', hasErrors && !data.fatal);
      document.getElementById('import-skip-errors').checked = false;
      impSetConfirm(!!data.token && !data.fatal && (!hasErrors || impState.skipErrors));
    }

    function impRenderIssues(data) {
      const wrap = document.getElementById('import-issue-wrap');
      const list = document.getElementById('import-issue-list');
      const issues = (data.issues || []).filter(i => i.level === 'error' || i.level === 'warning');
      if (!issues.length) { wrap.classList.add('hidden'); return; }
      wrap.classList.remove('hidden');
      document.getElementById('import-issue-count').textContent =
        `共 ${data.errors || 0} 条错误 / ${data.warnings || 0} 条警告` + (data.issues_truncated ? '（仅显示前 500 条）' : '');
      list.innerHTML = issues.slice(0, 50).map(i => {
        const isErr = i.level === 'error';
        const chip = isErr ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700';
        return `<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${chip}">${isErr ? '错误' : '警告'}</span>
          <span class="text-[11px] text-slate-600 leading-snug break-all">第 ${i.line} 行${i.date ? ' · ' + impEsc(i.date) : ''}：${impEsc(i.message)}</span>
        </div>`;
      }).join('');
    }

    function impRenderDiffs(data) {
      const wrap = document.getElementById('import-diff-wrap');
      const list = document.getElementById('import-diff-list');
      const diffs = data.row_diffs || [];
      if (!diffs.length) { wrap.classList.add('hidden'); return; }
      wrap.classList.remove('hidden');
      document.getElementById('import-diff-count').textContent =
        `前 ${diffs.length} 条` + (data.diffs_truncated ? '（还有更多）' : '');
      list.innerHTML = diffs.slice(0, 30).map(d => {
        const isInsert = d.action === 'insert';
        const changes = (d.changes || []).slice(0, 4).map(c => {
          const oldV = c.old === '' ? '空' : c.old;
          const newV = c.new === '' ? '空' : c.new;
          return `${c.label} ${oldV}→${newV}`;
        }).join('，');
        return `<div class="rounded-lg bg-white border border-slate-100 px-2.5 py-1.5">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-slate-700">${impEsc(d.date)}</span>
            <span class="${isInsert ? 'text-emerald-600' : 'text-blue-600'}">${isInsert ? '新增' : '更新'}</span>
          </div>
          ${changes ? `<p class="text-[10px] text-slate-400 mt-0.5 break-all">${impEsc(changes)}</p>` : ''}
        </div>`;
      }).join('');
    }

    function impSelectMode(btn) {
      if (!btn) return;
      impState.mode = btn.getAttribute('data-mode');
      document.querySelectorAll('#import-step-options button[data-mode]').forEach(b => {
        const active = b === btn;
        b.className = active
          ? 'w-full text-left px-3.5 py-2.5 rounded-xl border-2 border-blue-500 bg-blue-50 transition-all'
          : 'w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white transition-all';
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
      const resultEl = document.getElementById('import-result');
      try {
        const resp = await fetch('/api/v1/import/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: impState.token,
            conflict_mode: impState.mode,
            skip_errors: impState.skipErrors
          })
        });
        let json = null;
        try { json = await resp.json(); } catch (e) { json = null; }
        const data = json && json.data ? json.data : null;
        const okResult = json && json.code === 200 && data;
        resultEl.classList.remove('hidden');
        if (!okResult) {
          const msg = (json && json.message) || ('HTTP ' + resp.status);
          resultEl.className = 'text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600';
          resultEl.textContent = (resp.status === 409 ? '预检已过期，请重新选择文件：' : '导入失败：') + msg;
          impSetConfirm(false);
          showToast('导入失败', false);
          return;
        }
        resultEl.className = 'text-xs rounded-xl px-3 py-2.5 bg-emerald-50 text-emerald-700';
        resultEl.innerHTML = `<span class="font-bold">导入完成</span><br>新增 ${data.inserted || 0} 条 · 更新 ${data.updated || 0} 条${data.skipped ? ' · 跳过 ' + data.skipped + ' 行' : ''}<br>可在「导入记录」中查看本次明细。`;
        impShow('import-step-options', false);
        impShow('import-skip-wrap', false);
        impState.token = null;
        impSetConfirm(false, '已完成');
        showToast('导入完成', true);
        impRefreshData();
      } catch (e) {
        resultEl.classList.remove('hidden');
        resultEl.className = 'text-xs rounded-xl px-3 py-2.5 bg-rose-50 text-rose-600';
        resultEl.textContent = '导入失败：' + (e.message || '网络错误');
        showToast('导入失败', false);
      } finally {
        impSetBusy(false);
      }
    }

    // 导入后刷新当前视图，让看板/趋势/洞察立即反映新数据。
    function impRefreshData() {
      if (currentTab === 'log') {
        loadRecordForDate(document.getElementById('input-date').value);
      } else {
        switchTab(currentTab);
      }
    }

    /* ---------- 备忘录粘贴导入 ---------- */
    function openMemoFromSheet() {
      closeDataSheet();
      const sel = document.getElementById('memo-year-base');
      if (sel) {
        const year = new Date().getFullYear();
        sel.innerHTML = [year, year - 1, year - 2].map(y => `<option value="${y}">${y} 年</option>`).join('');
      }
      document.getElementById('memo-import-modal').classList.remove('hidden');
    }

    function closeMemo() {
      document.getElementById('memo-import-modal').classList.add('hidden');
    }

    function closeMemoOnBackdrop(event) {
      if (event.target === event.currentTarget) closeMemo();
    }

    async function impPreviewMemo() {
      const text = document.getElementById('memo-import-text').value || '';
      if (!text.trim()) {
        showToast('请先粘贴备忘录内容', false);
        return;
      }
      const yearBase = Number(document.getElementById('memo-year-base').value) || new Date().getFullYear();
      closeMemo();
      impResetState();
      document.getElementById('import-modal').classList.remove('hidden');
      impShow('import-step-pick', false);
      document.getElementById('import-subtitle').textContent = '正在预检粘贴内容…';
      impSetBusy(true);

      try {
        const resp = await fetch('/api/v1/import/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memo: text, year_base: yearBase })
        });
        let json = null;
        try { json = await resp.json(); } catch (e) { json = null; }
        document.getElementById('import-subtitle').textContent = '预检不写入数据，确认后才会导入';
        if (!json || json.code !== 200 || !json.data) {
          const msg = (json && json.message) || ('HTTP ' + resp.status);
          impShow('import-step-pick', true);
          document.getElementById('import-pick-btn').textContent = '选择文件';
          impShowPreviewError('预检失败：' + msg);
        } else {
          impRenderPreview(json.data);
        }
      } catch (e) {
        document.getElementById('import-subtitle').textContent = '预检不写入数据，确认后才会导入';
        impShow('import-step-pick', true);
        document.getElementById('import-pick-btn').textContent = '选择文件';
        impShowPreviewError('预检失败：' + (e.message || '网络错误'));
      } finally {
        impSetBusy(false);
      }
    }

    /* ---------- 导入批次历史 ---------- */
    const IMP_BATCH_STATUS = {
      success: { label: '成功', cls: 'bg-emerald-50 text-emerald-600' },
      partial: { label: '部分成功', cls: 'bg-amber-50 text-amber-700' },
      failed: { label: '失败', cls: 'bg-rose-50 text-rose-600' },
      interrupted: { label: '中断', cls: 'bg-rose-50 text-rose-600' },
      pending: { label: '进行中', cls: 'bg-slate-100 text-slate-500' }
    };

    function openImportBatchesFromSheet() {
      closeDataSheet();
      document.getElementById('import-batches-modal').classList.remove('hidden');
      impLoadBatches();
    }

    function closeBatches() {
      document.getElementById('import-batches-modal').classList.add('hidden');
    }

    function closeBatchesOnBackdrop(event) {
      if (event.target === event.currentTarget) closeBatches();
    }

    async function impLoadBatches() {
      const box = document.getElementById('batches-list');
      box.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">加载中…</p>';
      try {
        const resp = await fetch('/api/v1/import/batches?limit=20');
        const json = await resp.json();
        const list = (json && json.code === 200 && Array.isArray(json.data)) ? json.data : [];
        impRenderBatches(list);
      } catch (e) {
        box.innerHTML = `<p class="text-xs text-rose-500 text-center py-8">加载失败：${impEsc(e.message || '网络错误')}</p>`;
      }
    }

    function impRenderBatches(list) {
      const box = document.getElementById('batches-list');
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">还没有导入记录</p>';
        return;
      }
      box.innerHTML = list.map(b => {
        const st = IMP_BATCH_STATUS[b.status] || { label: b.status, cls: 'bg-slate-100 text-slate-500' };
        const source = b.source_type === 'json' ? 'JSON 备份' : (b.source_type === 'memo' ? '备忘录' : 'CSV');
        const when = String(b.created_at || '').replace('T', ' ').slice(0, 16);
        const actions = [];
        actions.push(`<button type="button" onclick="impToggleBatchDetail(${b.id})" class="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200">详情</button>`);
        if (b.has_cache && b.errors > 0) {
          actions.push(`<button type="button" onclick="downloadFailedRows(${b.id})" class="px-2.5 py-1 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 hover:bg-amber-200">失败行</button>`);
        }
        if (b.retryable) {
          actions.push(`<button type="button" onclick="impRetryBatch(${b.id})" class="px-2.5 py-1 rounded-lg bg-blue-600 text-[11px] font-bold text-white hover:bg-blue-700">重试</button>`);
        }
        return `<div class="rounded-2xl border border-slate-100 px-3.5 py-3">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-bold text-slate-800 truncate">${impEsc(b.file_name || source)}</p>
            <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}">${st.label}</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">${source} · ${impEsc(when)} · 共 ${b.total_rows || 0} 行${b.attempt_no > 1 ? ' · 第 ' + b.attempt_no + ' 次尝试' : ''}</p>
          <p class="text-[11px] text-slate-500 mt-1">新增 ${b.inserted || 0} · 更新 ${b.updated || 0} · 跳过 ${b.skipped || 0} · 警告 ${b.warnings || 0} · 错误 ${b.errors || 0}</p>
          ${b.error_message ? `<p class="text-[10px] text-rose-500 mt-1 break-all">${impEsc(b.error_message)}</p>` : ''}
          <div class="flex flex-wrap gap-1.5 mt-2">${actions.join('')}</div>
          <div id="batch-issues-${b.id}" class="hidden mt-2 space-y-1"></div>
        </div>`;
      }).join('');
    }

    function impToggleBatchDetail(id) {
      const box = document.getElementById('batch-issues-' + id);
      if (!box) return;
      if (!box.classList.contains('hidden')) {
        box.classList.add('hidden');
        return;
      }
      box.classList.remove('hidden');
      if (box.dataset.loaded === '1') return;
      box.dataset.loaded = '1';
      box.innerHTML = '<p class="text-[11px] text-slate-400">加载中…</p>';
      fetch(`/api/v1/import/batches/${id}`).then(r => r.json()).then(json => {
        const issues = (json && json.code === 200 && json.data && json.data.issues) ? json.data.issues : [];
        if (!issues.length) {
          box.innerHTML = '<p class="text-[11px] text-slate-400">没有行级问题</p>';
          return;
        }
        box.innerHTML = issues.slice(0, 50).map(i => {
          const isErr = i.level === 'error';
          const chip = isErr ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700';
          return `<div class="flex items-start space-x-1.5 rounded-lg bg-slate-50 px-2 py-1">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${chip}">${isErr ? '错误' : '警告'}</span>
            <span class="text-[10px] text-slate-600 leading-snug break-all">第 ${i.line} 行${i.date ? ' · ' + impEsc(i.date) : ''}：${impEsc(i.message)}</span>
          </div>`;
        }).join('');
      }).catch(() => {
        box.innerHTML = '<p class="text-[11px] text-rose-500">明细加载失败</p>';
      });
    }

    async function impRetryBatch(id) {
      try {
        const resp = await fetch(`/api/v1/import/batches/${id}/retry`, { method: 'POST' });
        const json = await resp.json();
        if (!json || json.code !== 200 || !json.data) {
          showToast((json && json.message) || '重试失败', false);
          return;
        }
        closeBatches();
        impResetState();
        document.getElementById('import-modal').classList.remove('hidden');
        impRenderPreview(json.data);
        showToast('已重新预检，请确认后写入', true);
      } catch (e) {
        showToast('重试失败：' + (e.message || '网络错误'), false);
      }
    }

    function downloadFailedRows(id) {
      closeBatches();
      downloadFile(`/api/v1/import/batches/${id}/failed-rows`, `HealthTrack_failed_rows_${id}.csv`, '失败行已下载，可修正后重新导入');
    }

    function downloadImportTemplate() {
      closeDataSheet();
      downloadFile('/api/v1/import/template', 'HealthTrack_import_template.csv', '模板已下载');
    }

    // 统一下载：手机端交给原生 DownloadManager，PC 端 fetch 成 blob 触发下载。
    async function downloadFile(url, filename, okMessage) {
      if (window.HealthTrack) {
        window.location.href = url;
        showToast('已开始下载', true);
        return;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const a = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        showToast(okMessage || '文件已下载', true);
      } catch (e) {
        showToast('下载失败：' + (e.message || '网络错误'), false);
      }
    }

    /* ============================================================
       睡前小结（第 4 个 Tab）：今日填写 + 往期回顾 + 小结洞察
       ============================================================ */
    const EVO_DEFAULT_BANDS = [
      { range: [1, 2],  label: '很低落',             tone: 'rose'    },
      { range: [3, 4],  label: '有点钝',             tone: 'amber'   },
      { range: [5, 6],  label: '平平',               tone: 'emerald' },
      { range: [7, 8],  label: '还不错，稳住了节奏', tone: 'indigo'  },
      { range: [9, 10], label: '满分的一天',         tone: 'violet'  }
    ];
    const EVO_TONE = {
      rose:    { dot: '#f43f5e', chip: 'text-rose-600 bg-rose-50 border-rose-100',          band: 'bg-rose-50 text-rose-600' },
      amber:   { dot: '#f59e0b', chip: 'text-amber-600 bg-amber-50 border-amber-100',       band: 'bg-amber-50 text-amber-700' },
      emerald: { dot: '#10b981', chip: 'text-emerald-600 bg-emerald-50 border-emerald-100', band: 'bg-emerald-50 text-emerald-700' },
      indigo:  { dot: '#6366f1', chip: 'text-indigo-600 bg-indigo-50 border-indigo-100',    band: 'bg-indigo-50 text-indigo-600' },
      violet:  { dot: '#8b5cf6', chip: 'text-violet-600 bg-violet-50 border-violet-100',    band: 'bg-violet-50 text-violet-600' }
    };
    const EVO_TONE_CYCLE = ['rose', 'amber', 'emerald', 'indigo', 'violet'];
    const EVO_PAGE_SIZE = 6;

    let evoBands = null; // null = 尚未从 /api/config 载入
    let evoState = {
      date: '',
      photoId: null,     // 当前日期已保存的图片 ID
      pendingBlob: null, // 本地新选、尚未上传的压缩图
      summaries: [],     // 全部小结（后端按 record_date 倒序）
      dateFilter: 'all',
      scoreFilter: 'all',
      visible: EVO_PAGE_SIZE,
      insightBusy: false,
      insightRange: 7,   // 小结洞察关联的生理数据窗口（7 / 30 天）
    };
    let evoSwipe = { W: 84, drag: null, suppressClick: 0 };

    function evoBandOf(score) {
      const bands = evoBands || EVO_DEFAULT_BANDS;
      return bands.find(b => score >= b.range[0] && score <= b.range[1]) || bands[bands.length - 1];
    }
    function evoTone(tone) { return EVO_TONE[tone] || EVO_TONE.indigo; }
    function evoToday() {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }
    function evoWeekday(dateStr) {
      const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const d = new Date(dateStr + 'T00:00:00');
      return isNaN(d.getTime()) ? '' : names[d.getDay()];
    }
    function evoDaysAgo(dateStr) {
      const today = new Date(evoToday() + 'T00:00:00');
      const target = new Date(dateStr + 'T00:00:00');
      return Math.round((today - target) / 86400000);
    }
    function evoMmdd(d) { return d ? d.slice(5) : ''; }
    function evoMonthKey(d) { return d ? d.slice(0, 7) : ''; }
    function evoMonthLabel(k) { const parts = k.split('-'); return parts[0] + ' 年 ' + Number(parts[1]) + ' 月'; }
    function evoAttr(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ---------- 载入 ----------

window.appConfirm = appConfirm;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.openImportModal = openImportModal;
window.closeImportModal = closeImportModal;
window.openMemoImportModal = openMemoImportModal;
window.closeMemoImportModal = closeMemoImportModal;
window.openImportBatchesModal = openImportBatchesModal;
window.closeImportBatchesModal = closeImportBatchesModal;
window.evoClosePhoto = function() {
  document.getElementById('ev-photo-viewer')?.classList.add('hidden');
};
