/**
 * 睡前小结 (Evening View) 业务控制器
 * 包含打卡评分滑块、三件事、往期列表左滑删除、小结深度洞察
 */
import templateHtml from './evening-view.html?raw';
import { api } from '../../services/api.js';
import { store } from '../../services/state.js';
import { localDateStr } from '../../utils/date.js';
import { showToast } from '../../components/Toast.js';
import { appConfirm, appCopyText, appToast } from '../../utils/dialog.js';

export function initEveningView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
  initEveningHistoryDelegation();
}

export function activateEvening() {
  if (typeof loadEveningTab === 'function') {
    loadEveningTab();
  }
}

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
    async function loadEveningTab() {
      if (!evoState.date) evoState.date = evoToday();
      document.getElementById('summary-date').value = evoState.date;
      await Promise.all([evoEnsureBands(), evoLoadCurrentSummary()]);
      await evoLoadList();
    }

    async function evoEnsureBands() {
      if (evoBands) { evoRenderBandRows(); return; }
      try {
        const resp = await fetch('/api/config');
        const json = await resp.json();
        const bands = json && json.data && json.data.summary_score_bands;
        if (Array.isArray(bands) && bands.length) {
          evoBands = bands.map(b => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone }));
        }
      } catch (e) { /* 回退默认 */ }
      if (!evoBands) evoBands = EVO_DEFAULT_BANDS.map(b => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone }));
      evoRenderBandRows();
      evoPaintScoreBand(Number(document.getElementById('score-range').value) || 7);
    }

    async function evoLoadCurrentSummary() {
      const date = evoState.date;
      evoResetPhotoUI();
      try {
        const resp = await fetch(`/api/v1/evening/summary?date=${encodeURIComponent(date)}`);
        const json = await resp.json();
        const data = (json && json.code === 200) ? json.data : null;
        if (data) {
          document.getElementById('done-1').value = (data.done_items && data.done_items[0]) || '';
          document.getElementById('done-2').value = (data.done_items && data.done_items[1]) || '';
          document.getElementById('done-3').value = (data.done_items && data.done_items[2]) || '';
          document.getElementById('note-text').value = data.note_text || '';
          document.getElementById('note-len').innerText = (data.note_text || '').length;
          evUpdateScore(data.score || 7);
          if (data.photo_id) {
            evoState.photoId = data.photo_id;
            evoShowPhoto(`/api/v1/evening/photo/${data.photo_id}`, '');
          }
        } else {
          document.getElementById('done-1').value = '';
          document.getElementById('done-2').value = '';
          document.getElementById('done-3').value = '';
          document.getElementById('note-text').value = '';
          document.getElementById('note-len').innerText = '0';
          evUpdateScore(7);
        }
        evUpdateDoneCount();
      } catch (e) {
        appToast('读取该日小结失败：' + e.message);
      }
      evoLoadInsight(date);
    }

    // ---------- 日期 ----------
    function evSetToday() {
      evoState.date = evoToday();
      document.getElementById('summary-date').value = evoState.date;
      evoLoadCurrentSummary();
      appToast('已回到今日');
    }
    function evOnDateChange(v) {
      if (!v) return;
      evoState.date = v;
      evoLoadCurrentSummary();
    }

    // ---------- 三件事 ----------
    function evUpdateDoneCount() {
      let n = 0;
      [1, 2, 3].forEach(i => {
        const filled = !!document.getElementById('done-' + i).value.trim();
        const dot = document.getElementById('seq-' + i);
        if (filled) {
          if (!dot.classList.contains('filled')) {
            dot.classList.add('filled', 'ev-pop');
            setTimeout(() => dot.classList.remove('ev-pop'), 340);
          }
          n++;
        } else {
          dot.classList.remove('filled');
        }
      });
      const badge = document.getElementById('done-count');
      badge.innerText = n + ' / 3';
      badge.className = 'text-[10px] font-black tabular-nums transition-colors ' + (n === 0 ? 'text-slate-300' : 'text-indigo-500');
    }

    // ---------- 图片 ----------
    function evoShowPhoto(src, meta) {
      document.getElementById('photo-preview').src = src || '';
      document.getElementById('photo-empty').classList.add('hidden');
      const filled = document.getElementById('photo-filled');
      filled.classList.remove('hidden');
      document.getElementById('photo-meta').innerText = meta || '';
    }
    function evoResetPhotoUI() {
      evoState.photoId = null;
      evoState.pendingBlob = null;
      const input = document.getElementById('photo-input');
      if (input) input.value = '';
      document.getElementById('photo-preview').src = '';
      document.getElementById('photo-filled').classList.add('hidden');
      document.getElementById('photo-empty').classList.remove('hidden');
      document.getElementById('photo-meta').innerText = '';
    }

    // 全屏查看图片：点击缩略图或今日图片放大到整屏，点击任意处/返回键关闭
    let evPhotoHistoryPushed = false;
    function evoOpenPhoto(src, alt) {
      if (!src) return;
      const viewer = document.getElementById('ev-photo-viewer');
      const img = document.getElementById('ev-photo-viewer-img');
      if (!viewer || !img) return;
      img.src = src;
      img.alt = alt || '小结图片';
      if (viewer.classList.contains('hidden')) {
        viewer.classList.remove('hidden');
        // 让手机返回键关闭大图，而不是直接退出 App
        if (!evPhotoHistoryPushed) {
          history.pushState({ evPhoto: 1 }, '');
          evPhotoHistoryPushed = true;
        }
      }
    }
    function evoClosePhoto(fromPop) {
      const viewer = document.getElementById('ev-photo-viewer');
      const img = document.getElementById('ev-photo-viewer-img');
      if (!viewer || viewer.classList.contains('hidden')) return;
      viewer.classList.add('hidden');
      img.removeAttribute('src');
      if (evPhotoHistoryPushed && !fromPop) {
        evPhotoHistoryPushed = false;
        history.back();
      }
    }
    window.addEventListener('popstate', () => {
      if (!evPhotoHistoryPushed) return;
      evPhotoHistoryPushed = false;
      evoClosePhoto(true);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') evoClosePhoto(); });
    async function evOnPhotoPick(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { appToast('请选择图片文件'); return; }
      try {
        const blob = await evoCompressImage(file);
        const prevUrl = evoState.pendingBlob && document.getElementById('photo-preview').src;
        if (prevUrl && prevUrl.startsWith('blob:')) URL.revokeObjectURL(prevUrl);
        evoState.pendingBlob = blob;
        evoShowPhoto(URL.createObjectURL(blob), `原图 ${Math.round(file.size / 1024)} KB · 压缩后约 ${Math.round(blob.size / 1024)} KB（长边 ≤1600px, JPEG q0.8）`);
        appToast('图片已就绪，保存小结时上传');
      } catch (e) {
        appToast('图片处理失败：' + e.message);
      }
    }
    // canvas 压缩：长边 ≤1600px，输出 JPEG q0.8
    function evoCompressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('读取文件失败'));
        reader.onload = e => {
          const img = new Image();
          img.onerror = () => reject(new Error('图片解码失败'));
          img.onload = () => {
            const MAX = 1600;
            let w = img.width, h = img.height;
            if (w > MAX || h > MAX) {
              if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
              else { w = Math.round(w * MAX / h); h = MAX; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(b => b ? resolve(b) : reject(new Error('压缩失败')), 'image/jpeg', 0.8);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
    async function evRemovePhoto() {
      const ok = await appConfirm('删除今天这张图片？删除后不可恢复。', { title: '删除图片', confirmText: '删除' });
      if (!ok) return;
      if (evoState.photoId) {
        try {
          const resp = await fetch(`/api/v1/evening/photo/${evoState.photoId}`, { method: 'DELETE' });
          const json = await resp.json();
          if (json.code !== 200) throw new Error(json.message || '删除失败');
        } catch (e) {
          appToast('删除图片失败：' + e.message);
          return;
        }
      }
      evoResetPhotoUI();
      appToast('已删除今日图片');
    }

    // ---------- 评分 ----------
    function evUpdateScore(v) {
      const n = Number(v);
      const num = document.getElementById('score-value');
      num.innerText = n;
      num.classList.remove('ev-pop'); void num.offsetWidth; num.classList.add('ev-pop');
      document.getElementById('score-range').style.setProperty('--pct', ((n - 1) / 9 * 100).toFixed(1) + '%');
      evoPaintScoreBand(n);
    }
    function evoPaintScoreBand(n) {
      const b = evoBandOf(n);
      const el = document.getElementById('score-text');
      el.innerText = b.label;
      el.className = 'mt-3 text-center text-[11px] font-bold rounded-xl py-2 transition-colors ' + evoTone(b.tone).band;
    }

    function evToggleBandEditor() {
      const panel = document.getElementById('band-editor');
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) evoRenderBandRows();
    }
    function evoRenderBandRows() {
      const bands = evoBands || EVO_DEFAULT_BANDS;
      document.getElementById('band-rows').innerHTML = bands.map((b, i) => `
        <div class="flex items-center space-x-2 bg-slate-50/80 border border-slate-100 rounded-xl px-2.5 py-2">
          <span class="text-[10px] font-black text-slate-400 tabular-nums w-9 shrink-0">${b.range[0]}-${b.range[1]}</span>
          <button onclick="evCycleTone(${i})" title="点击切换配色"
                  class="w-4 h-4 rounded-full shrink-0 border-2 border-white shadow ring-1 ring-slate-200 active:scale-90 transition-transform"
                  style="background:${evoTone(b.tone).dot}"></button>
          <input type="text" value="${evoAttr(b.label)}" maxlength="20" oninput="evSetBandLabel(${i}, this.value)"
                 class="flex-1 min-w-0 bg-transparent text-[12px] text-slate-700 outline-none">
        </div>`).join('');
    }
    function evSetBandLabel(i, v) {
      (evoBands || EVO_DEFAULT_BANDS)[i].label = v;
      evoRefreshScoreChips();
      evoPaintScoreBand(Number(document.getElementById('score-range').value));
    }
    function evCycleTone(i) {
      const bands = evoBands || EVO_DEFAULT_BANDS;
      const cur = EVO_TONE_CYCLE.indexOf(bands[i].tone);
      bands[i].tone = EVO_TONE_CYCLE[(cur + 1) % EVO_TONE_CYCLE.length];
      evoRenderBandRows();
      evoRefreshScoreChips();
      evoPaintScoreBand(Number(document.getElementById('score-range').value));
    }
    function evResetBands() {
      evoBands = EVO_DEFAULT_BANDS.map(b => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone }));
      evoRenderBandRows();
      evoRefreshScoreChips();
      evoPaintScoreBand(Number(document.getElementById('score-range').value));
      appToast('已恢复默认文案，点击「保存文案」生效');
    }
    function evoRefreshScoreChips() {
      document.querySelectorAll('#ev-history-list .evo-score-chip').forEach(el => {
        const b = evoBandOf(Number(el.dataset.score));
        el.className = 'evo-score-chip text-[10px] font-black px-1.5 py-0.5 rounded-full border ' + evoTone(b.tone).chip;
      });
    }
    async function evSaveBands() {
      const bands = evoBands || EVO_DEFAULT_BANDS;
      const btn = document.getElementById('band-save-btn');
      btn.disabled = true; btn.classList.add('opacity-60');
      try {
        const resp = await fetch('/api/config/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score_bands: bands.map(b => ({ range: [b.range[0], b.range[1]], label: b.label, tone: b.tone })) })
        });
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '保存失败');
        appToast('评分文案已保存并生效');
        evoRefreshScoreChips();
        evoPaintScoreBand(Number(document.getElementById('score-range').value));
      } catch (e) {
        appToast('保存失败：' + e.message);
      } finally {
        btn.disabled = false; btn.classList.remove('opacity-60');
      }
    }

    // ---------- 保存小结 ----------
    async function evSave() {
      const btn = document.getElementById('ev-save-btn');
      const date = evoState.date || evoToday();
      const done = [1, 2, 3].map(i => document.getElementById('done-' + i).value.trim()).filter(Boolean);
      const note = document.getElementById('note-text').value.trim();
      const score = Number(document.getElementById('score-range').value);
      const hasPhoto = !!evoState.pendingBlob || !!evoState.photoId;
      if (!done.length && !note && !hasPhoto) {
        appToast('至少填写三件事、图片或感想中的一项');
        return;
      }
      btn.disabled = true; btn.classList.add('opacity-60');
      try {
        let photoId = evoState.photoId;
        if (evoState.pendingBlob) {
          const up = await fetch(`/api/v1/evening/photo?date=${encodeURIComponent(date)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'image/jpeg' },
            body: evoState.pendingBlob
          });
          const upJson = await up.json();
          if (upJson.code !== 200) throw new Error(upJson.message || '图片上传失败');
          photoId = (upJson.data && upJson.data.photo_id) ? upJson.data.photo_id : null;
        }
        const resp = await fetch('/api/v1/evening/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record_date: date, done_items: done, note_text: note, score: score, photo_id: photoId || null })
        });
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '保存失败');

        evoState.photoId = photoId;
        if (evoState.pendingBlob && photoId) {
          const prevUrl = document.getElementById('photo-preview').src;
          if (prevUrl && prevUrl.startsWith('blob:')) URL.revokeObjectURL(prevUrl);
          evoShowPhoto(`/api/v1/evening/photo/${photoId}`, '已保存 · 长边 ≤1600px, JPEG q0.8');
        }
        evoState.pendingBlob = null;
        appToast('今日小结已保存');
        await evoLoadList();
      } catch (e) {
        appToast('保存失败：' + e.message);
      } finally {
        btn.disabled = false; btn.classList.remove('opacity-60');
      }
    }

    // ---------- 小结洞察 ----------
    let evoInsightAbort = null;
    function evoRangeLabel(n) { return (n === 30) ? '近 30 天' : '近 7 天'; }
    // 切换关联生理数据窗口；已生成的洞察不自动重跑，由用户点「清除」后重新生成
    function evSetInsightRange(btn) {
      document.querySelectorAll('#ev-insight-range .evo-fchip-dark').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      evoState.insightRange = Number(btn.dataset.val) || 7;
    }
    function evoSyncRangeChips(n) {
      if (n !== 7 && n !== 30) return;
      evoState.insightRange = n;
      document.querySelectorAll('#ev-insight-range .evo-fchip-dark').forEach(b => {
        b.classList.toggle('active', Number(b.dataset.val) === n);
      });
    }
    async function evoLoadInsight(date) {
      evoStopInsight();
      const emptyEl = document.getElementById('insight-empty');
      const panel = document.getElementById('insight-panel');
      document.getElementById('think-body').classList.remove('open');
      document.getElementById('think-arrow').classList.remove('rotate-90');
      document.getElementById('think-text').innerText = '';
      document.getElementById('insight-body').innerHTML = '';
      panel.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      try {
        const resp = await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(date)}`);
        const json = await resp.json();
        const data = (json && json.code === 200) ? json.data : null;
        if (data && data.content) evoRenderInsight(data);
      } catch (e) { /* 静默失败，不打扰用户 */ }
    }
    function evoFmtTime(ts) {
      if (!ts) return '';
      const d = new Date(ts);
      if (isNaN(d.getTime())) return '';
      const p = n => String(n).padStart(2, '0');
      return p(d.getHours()) + ':' + p(d.getMinutes());
    }
    function evoRenderInsight(data) {
      document.getElementById('insight-empty').classList.add('hidden');
      const panel = document.getElementById('insight-panel');
      panel.classList.remove('hidden');
      evoSyncRangeChips(Number(data.range_days));
      const rangeText = (data.range_days === 7 || data.range_days === 30) ? evoRangeLabel(data.range_days) + ' · ' : '';
      document.getElementById('insight-meta').innerText = `${evoMmdd(data.start_date || evoState.date)} 小结洞察 · ${rangeText}生成于 ${evoFmtTime(data.created_at)}`;
      document.getElementById('insight-body').innerHTML = renderMarkdown(data.content || '');
      document.getElementById('think-text').innerText = data.thinking || '';
    }
    function evoStopInsight() {
      if (evoInsightAbort) { try { evoInsightAbort.abort(); } catch (_) {} evoInsightAbort = null; }
      const b = document.getElementById('insight-body');
      if (b) b.classList.remove('typing-cursor');
    }
    async function evGenerateInsight() {
      if (evoState.insightBusy) return;
      const date = evoState.date || evoToday();
      const btn = document.getElementById('ev-insight-btn');
      const emptyEl = document.getElementById('insight-empty');
      const panel = document.getElementById('insight-panel');
      const body = document.getElementById('insight-body');

      evoStopInsight();
      evoState.insightBusy = true;
      if (btn) { btn.disabled = true; btn.classList.add('opacity-60'); btn.innerText = '⏳ 正在生成…'; }

      emptyEl.classList.add('hidden');
      panel.classList.remove('hidden');
      panel.classList.add('ev-rise');
      body.innerHTML = '<p class="text-slate-500 text-[11px]">（正在推导…）</p>';
      body.classList.add('typing-cursor');
      document.getElementById('insight-meta').innerText = `${evoMmdd(date)} 小结洞察 · ${evoRangeLabel(evoState.insightRange)} · 生成中…`;
      document.getElementById('think-text').innerText = '';
      document.getElementById('think-body').classList.remove('open');
      document.getElementById('think-arrow').classList.remove('rotate-90');

      let thinkingText = '', responseText = '', hasError = false;
      function updateUI() {
        body.innerHTML = responseText
          ? renderMarkdown(responseText)
          : '<p class="text-slate-500 text-[11px]">（正在推导…）</p>';
        if (thinkingText) {
          document.getElementById('think-text').innerText = thinkingText;
          // 与「洞察」页一致：正文尚未输出时展开思维链，正文一开始输出就自动收起
          const open = !responseText;
          document.getElementById('think-body').classList.toggle('open', open);
          document.getElementById('think-arrow').classList.toggle('rotate-90', open);
        }
      }

      const controller = new AbortController();
      evoInsightAbort = controller;
      try {
        const response = await fetch(`/api/v1/evening/insight/stream?date=${encodeURIComponent(date)}&days=${evoState.insightRange}`, { signal: controller.signal });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();
          for (let line of lines) {
            line = line.trim();
            if (!line || !line.startsWith('data:')) continue;
            const dataStr = line.slice(5).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                responseText += '\n> ⚠️ **服务提示**: ' + parsed.error + '\n';
                hasError = true;
              } else if (parsed.choices && parsed.choices.length) {
                const delta = parsed.choices[0].delta || {};
                if (delta.reasoning_content) thinkingText += delta.reasoning_content;
                if (delta.content) responseText += delta.content;
              }
              updateUI();
            } catch (e) { /* 忽略心跳等非 JSON 帧 */ }
          }
        }
        if (hasError) {
          document.getElementById('insight-meta').innerText = `${evoMmdd(date)} 小结洞察 · ${evoRangeLabel(evoState.insightRange)} · 生成失败`;
        } else if (responseText || thinkingText) {
          document.getElementById('insight-meta').innerText = `${evoMmdd(date)} 小结洞察 · ${evoRangeLabel(evoState.insightRange)} · 生成于 ${evoFmtTime(new Date())}`;
        } else {
          body.innerHTML = '<p class="text-slate-500 text-[11px]">未能获取到分析内容，请检查大模型配置。</p>';
        }
      } catch (err) {
        if (err && err.name === 'AbortError') {
          // 主动中止（切换日期/Tab），不提示
        } else if (responseText || thinkingText) {
          responseText += '\n\n> ⚠️ *[网络连接中断]*';
          updateUI();
        } else if (err instanceof TypeError) {
          body.innerHTML = '<p class="text-rose-400 text-[11px]">无法连接本地服务，请确认 HealthTrack 正在运行。</p>';
        } else {
          body.innerHTML = '<p class="text-rose-400 text-[11px]">生成失败：' + escapeHtml(err.message) + '</p>';
        }
      } finally {
        if (evoInsightAbort === controller) evoInsightAbort = null;
        body.classList.remove('typing-cursor');
        evoState.insightBusy = false;
        if (btn) { btn.disabled = false; btn.classList.remove('opacity-60'); btn.innerText = '✨ 生成小结洞察'; }
      }
    }
    async function evResetInsight() {
      const ok = await appConfirm('清除这一天的小结洞察？清除后可重新生成。', { title: '清除洞察', confirmText: '清除' });
      if (!ok) return;
      const date = evoState.date || evoToday();
      try {
        const resp = await fetch(`/api/v1/evening/insight?date=${encodeURIComponent(date)}`, { method: 'DELETE' });
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '清除失败');
        evoStopInsight();
        document.getElementById('insight-panel').classList.add('hidden');
        document.getElementById('insight-empty').classList.remove('hidden');
        document.getElementById('insight-body').innerHTML = '';
        document.getElementById('think-text').innerText = '';
        document.getElementById('think-body').classList.remove('open');
        document.getElementById('think-arrow').classList.remove('rotate-90');
        appToast('已清除该日小结洞察');
      } catch (e) {
        appToast('清除失败：' + e.message);
      }
    }
    function evToggleThinking() {
      const wrap = document.getElementById('think-body');
      const arrow = document.getElementById('think-arrow');
      const open = !wrap.classList.contains('open');
      wrap.classList.toggle('open', open);
      arrow.classList.toggle('rotate-90', open);
    }

    // ---------- 往期回顾 ----------
    async function evoLoadList() {
      try {
        const resp = await fetch('/api/v1/evening/summaries');
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '加载失败');
        evoState.summaries = (json.data && json.data.items) || [];
      } catch (e) {
        appToast('加载往期小结失败：' + e.message);
        evoState.summaries = [];
      }
      evoState.visible = Math.max(evoState.visible, EVO_PAGE_SIZE);
      evoRenderHistory();
    }

    function evoFiltered() {
      return evoState.summaries.filter(r => {
        // 与后端「近 N 天」口径对齐：窗口为 今天-(N-1) 起
        if (evoState.dateFilter !== 'all' && evoDaysAgo(r.record_date) > Number(evoState.dateFilter) - 1) return false;
        const s = r.score || 0;
        if (evoState.scoreFilter === 'high' && s < 9) return false;
        if (evoState.scoreFilter === 'good' && (s < 7 || s > 8)) return false;
        if (evoState.scoreFilter === 'mid'  && (s < 5 || s > 6)) return false;
        if (evoState.scoreFilter === 'low'  && s > 4) return false;
        return true;
      });
    }

    // 一键复制某天小结（日期 + 评分 + 三件事 + 感想）
    function evoEntryCopyText(r) {
      const items = (r.done_items || []).filter(d => d && d.trim());
      const lines = [`${r.record_date} ${evoWeekday(r.record_date)} · ${r.score} 分`, '', '【完成事项】'];
      if (items.length) items.forEach((d, i) => lines.push(`${i + 1}. ${d}`));
      else lines.push('（未填写）');
      lines.push('', '【当时的感想】', (r.note_text && r.note_text.trim()) ? r.note_text : '（未填写）');
      return lines.join('\n');
    }
    async function evCopyEntry(date, ev) {
      if (ev) ev.stopPropagation();
      const r = (evoState.summaries || []).find(x => x.record_date === date);
      if (!r) return;
      const ok = await appCopyText(evoEntryCopyText(r));
      appToast(ok ? '已复制 ' + evoMmdd(date) + ' 的小结' : '复制失败，请长按文字手动复制');
    }

    function evoEntryHTML(r, idx) {
      const tone = evoTone(evoBandOf(r.score || 0).tone);
      const thumb = r.photo_id
        ? `<img src="/api/v1/evening/photo/${r.photo_id}" alt="${evoMmdd(r.record_date)}" onclick="event.stopPropagation(); evoOpenPhoto(this.src, '${evoMmdd(r.record_date)} 小结图片')" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-50 cursor-zoom-in">`
        : `<span class="w-14 h-14 rounded-xl shrink-0 border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-300 font-bold">无图</span>`;
      const items = (r.done_items || []).filter(d => d && d.trim());
      const preview = items.length ? items[0] : '（未填完成事项）';
      const doneHtml = [0, 1, 2].map(i => {
        const v = (r.done_items && r.done_items[i]) || '';
        return (v && v.trim())
          ? `<li class="flex items-start space-x-1.5 text-[11px] text-slate-600 leading-relaxed"><span class="text-indigo-400 font-black">·</span><span>${escapeHtml(v)}</span></li>`
          : `<li class="flex items-start space-x-1.5 text-[11px] text-slate-300 leading-relaxed"><span class="font-black">·</span><span>未记录</span></li>`;
      }).join('');
      return `
      <div class="evo-tl-item ev-rise" style="animation-delay:${Math.min(idx, 7) * 40}ms">
        <span class="evo-tl-node"></span><span class="evo-tl-line"></span>
        <div class="evo-swipe" data-date="${r.record_date}">
          <div class="evo-swipe-action">
            <button class="evo-swipe-del" onclick="evAskDelete('${r.record_date}')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              <span>删除</span>
            </button>
          </div>
          <div class="evo-swipe-panel">
            <div class="evo-card overflow-hidden">
              <div class="evo-entry-head p-3 flex items-center space-x-3 cursor-pointer active:bg-slate-50/80 transition-colors">
                ${thumb}
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-black text-slate-800 tabular-nums">${evoMmdd(r.record_date)}</span>
                    <span class="text-[10px] text-slate-400">${evoWeekday(r.record_date)}</span>
                    <span class="evo-score-chip text-[10px] font-black px-1.5 py-0.5 rounded-full border ${tone.chip}" data-score="${r.score}">${r.score} 分</span>
                  </div>
                  <p class="text-[11px] text-slate-400 truncate mt-1">${escapeHtml(preview)}</p>
                </div>
                <span class="evo-entry-arrow text-[9px] text-slate-300 transform transition-transform duration-300">▼</span>
              </div>
              <div class="evo-collapsible">
                <div class="px-3 pb-3 pt-2.5 border-t border-slate-100 space-y-2.5">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <p class="evo-eyebrow">完成事项</p>
                      <button type="button" class="evo-copy-btn" onclick="evCopyEntry('${r.record_date}', event)" aria-label="复制这天的记录">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <span>复制</span>
                      </button>
                    </div>
                    <ol class="space-y-1 evo-selectable">${doneHtml}</ol>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-2.5">
                    <p class="evo-eyebrow mb-1">当时的感想</p>
                    <p class="text-[11px] text-slate-500 leading-relaxed evo-selectable">${r.note_text ? escapeHtml(r.note_text) : '（未填写）'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }

    function evoRenderHistory() {
      const list = evoFiltered();
      const shown = list.slice(0, evoState.visible);
      const wrap = document.getElementById('ev-history-list');
      const empty = document.getElementById('ev-history-empty');
      const moreBtn = document.getElementById('ev-load-more');
      const doneTip = document.getElementById('ev-load-done');
      const resetBtn = document.getElementById('ev-filter-reset');

      document.getElementById('ev-filter-count').innerText = list.length;
      document.getElementById('ev-history-total').innerText = evoState.summaries.length + ' 篇';
      resetBtn.classList.toggle('hidden', evoState.dateFilter === 'all' && evoState.scoreFilter === 'all');

      if (!list.length) {
        wrap.innerHTML = '';
        empty.classList.remove('hidden');
        moreBtn.classList.add('hidden');
        doneTip.classList.add('hidden');
        return;
      }
      empty.classList.add('hidden');

      let html = '', lastMonth = '';
      shown.forEach((r, i) => {
        const mk = evoMonthKey(r.record_date);
        if (mk !== lastMonth) {
          const cnt = list.filter(x => evoMonthKey(x.record_date) === mk).length;
          html += `<div class="flex items-center space-x-2 pt-2 pb-3 pl-7">
                     <span class="text-[10px] font-black tracking-wider text-slate-400">${evoMonthLabel(mk)}</span>
                     <span class="flex-1 h-px bg-slate-200"></span>
                     <span class="text-[10px] text-slate-400 tabular-nums">${cnt} 篇</span>
                   </div>`;
          lastMonth = mk;
        }
        html += evoEntryHTML(r, i);
      });
      wrap.innerHTML = html;
      evoBindSwipes();

      const remain = list.length - shown.length;
      if (remain > 0) {
        moreBtn.classList.remove('hidden');
        doneTip.classList.add('hidden');
        document.getElementById('ev-remain-count').innerText = remain;
      } else {
        moreBtn.classList.add('hidden');
        doneTip.classList.remove('hidden');
      }
    }

    function evLoadMore() { evoState.visible += EVO_PAGE_SIZE; evoRenderHistory(); }
    function evSetDateFilter(btn) {
      document.querySelectorAll('#ev-filter-date .evo-fchip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      evoState.dateFilter = btn.dataset.val;
      evoState.visible = EVO_PAGE_SIZE;
      evoRenderHistory();
    }
    function evSetScoreFilter(btn) {
      document.querySelectorAll('#ev-filter-score .evo-fchip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      evoState.scoreFilter = btn.dataset.val;
      evoState.visible = EVO_PAGE_SIZE;
      evoRenderHistory();
    }
    function evResetFilters() {
      document.querySelectorAll('#ev-filter-date .evo-fchip, #ev-filter-score .evo-fchip').forEach(b => {
        b.classList.toggle('active', b.dataset.val === 'all');
      });
      evoState.dateFilter = 'all';
      evoState.scoreFilter = 'all';
      evoState.visible = EVO_PAGE_SIZE;
      evoRenderHistory();
    }

    // ---------- 左滑删除（Pointer Events：触摸与鼠标同一套逻辑） ----------
    function evoBindSwipes() {
      document.querySelectorAll('#ev-history-list .evo-swipe-panel').forEach(panel => {
        panel.addEventListener('pointerdown', evoOnSwipeDown);
        panel.addEventListener('pointermove', evoOnSwipeMove);
        panel.addEventListener('pointerup', evoOnSwipeUp);
        panel.addEventListener('pointercancel', evoOnSwipeUp);
      });
    }
    function evoOnSwipeDown(e) {
      const panel = e.currentTarget;
      const swipe = panel.closest('.evo-swipe');
      if (!swipe || swipe.classList.contains('removing')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // 已选中文字时不启动左滑，避免打断长按复制
      const sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed && sel.anchorNode && panel.contains(sel.anchorNode)) return;
      evoCloseAllSwipe(swipe);
      evoSwipe.drag = {
        panel: panel, swipe: swipe, id: e.pointerId,
        x0: e.clientX, y0: e.clientY, axis: null,
        base: swipe.classList.contains('open') ? -evoSwipe.W : 0, off: 0
      };
    }
    function evoOnSwipeMove(e) {
      const drag = evoSwipe.drag;
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (drag.axis === 'x') {
          drag.panel.classList.add('dragging');
          try { drag.panel.setPointerCapture(e.pointerId); } catch (_) {}
        }
      }
      if (drag.axis !== 'x') return;
      let off = drag.base + dx;
      if (off > 0) off *= 0.28;
      else if (off < -evoSwipe.W) off = -evoSwipe.W - (Math.abs(off) - evoSwipe.W) * 0.25;
      drag.off = off;
      drag.panel.style.transform = 'translateX(' + off + 'px)';
      if (e.cancelable) e.preventDefault();
    }
    function evoOnSwipeUp(e) {
      const drag = evoSwipe.drag;
      if (!drag || e.pointerId !== drag.id) return;
      const panel = drag.panel, swipe = drag.swipe;
      panel.classList.remove('dragging');
      panel.style.transform = '';
      if (drag.axis === 'x') {
        swipe.classList.toggle('open', drag.off < -42);
        evoSwipe.suppressClick = Date.now();
      }
      evoSwipe.drag = null;
    }
    function evoCloseAllSwipe(except) {
      document.querySelectorAll('#ev-history-list .evo-swipe.open').forEach(s => { if (s !== except) s.classList.remove('open'); });
    }
    // 事件委托：点卡片头展开/收起；已滑开的卡片点一下先收起
    function initEveningHistoryDelegation() {
      document.getElementById('ev-history-list')?.addEventListener('click', e => {
        const head = e.target.closest('.evo-entry-head');
        if (!head || Date.now() - evoSwipe.suppressClick < 320) return;
        const swipe = head.closest('.evo-swipe');
        if (swipe && swipe.classList.contains('open')) { swipe.classList.remove('open'); return; }
        evoCloseAllSwipe();
        const card = head.parentElement;
        const bodyEl = card.querySelector('.evo-collapsible');
        const arrow = head.querySelector('.evo-entry-arrow');
        const open = !bodyEl.classList.contains('open');
        bodyEl.classList.toggle('open', open);
        if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    }

    async function evAskDelete(date) {
      const r = evoState.summaries.find(x => x.record_date === date);
      const ok = await appConfirm(`${evoMmdd(date)}${r ? ' · ' + r.score + ' 分' : ''}，删除后不可恢复。`, { title: '删除这篇小结？', confirmText: '删除' });
      const swipe = document.querySelector(`.evo-swipe[data-date="${date}"]`);
      if (!ok) { if (swipe) swipe.classList.remove('open'); return; }
      try {
        const resp = await fetch(`/api/v1/evening/summary/${encodeURIComponent(date)}`, { method: 'DELETE' });
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '删除失败');
      } catch (e) {
        appToast('删除失败：' + e.message);
        if (swipe) swipe.classList.remove('open');
        return;
      }
      const afterRemove = () => {
        evoState.summaries = evoState.summaries.filter(x => x.record_date !== date);
        evoRenderHistory();
        if (evoState.date === date) {
          evoState.date = evoToday();
          document.getElementById('summary-date').value = evoState.date;
          evoLoadCurrentSummary();
        }
      };
      if (swipe) {
        swipe.classList.add('removing');
        setTimeout(() => { afterRemove(); appToast('已删除 ' + evoMmdd(date) + ' 的小结'); }, 260);
      } else {
        afterRemove();
        appToast('已删除 ' + evoMmdd(date) + ' 的小结');
      }
    }

// 挂载到 window 供模板内联事件监听使用
window.loadEveningTab = loadEveningTab;
window.evSetToday = evSetToday;
window.evOnDateChange = evOnDateChange;
window.evUpdateDoneCount = evUpdateDoneCount;
window.evoOpenPhoto = evoOpenPhoto;
window.evOnPhotoPick = evOnPhotoPick;
window.evRemovePhoto = evRemovePhoto;
window.evUpdateScore = evUpdateScore;
window.evToggleBandEditor = evToggleBandEditor;
window.evResetBands = evResetBands;
window.evSaveBands = evSaveBands;
window.evSave = evSave;
window.evoSubmit = evSave;
window.evSetInsightRange = evSetInsightRange;
window.evGenerateInsight = evGenerateInsight;
window.evoGenerateInsight = evGenerateInsight;
window.evResetInsight = evResetInsight;
window.evToggleThinking = evToggleThinking;
window.evSetDateFilter = evSetDateFilter;
window.evSetScoreFilter = evSetScoreFilter;
window.evResetFilters = evResetFilters;
window.evAskDelete = evAskDelete;
