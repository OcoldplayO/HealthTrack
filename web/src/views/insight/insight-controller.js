/**
 * AI 洞察 (Insight View) 业务控制器
 * 包含阶段深度洞察、历史存档列表、阶段对比
 */
import templateHtml from './insight-view.html?raw';
import { api } from '../../services/api.js';
import { store } from '../../services/state.js';
import { localDateStr, shiftDateStr } from '../../utils/date.js';
import { showToast } from '../../components/Toast.js';

let insightDays = 30;
let insightEndDate = localDateStr(new Date());
let insightEndMode = 'today';
let insightPeriodGenerated = false;

let historyState = {
  items: [],
  beforeId: 0,
  hasMore: false,
  loading: false,
  rangeDays: 0,
  compareMode: false,
  q: '',
  error: '',
  expanded: {},
  details: {},
  manageMode: false,
  selected: {}
};

export function initInsightView(container) {
  container.insertAdjacentHTML('beforeend', templateHtml);
}

export function activateInsight() {
  if (typeof checkPeriodInsight === 'function') {
    checkPeriodInsight();
  }
}

    function resolveInsightEndDate() {
      if (insightEndMode === 'yesterday') return shiftDateStr(localDateStr(new Date()), -1);
      if (insightEndMode === 'custom' && insightEndDate) return insightEndDate;
      return localDateStr(new Date());
    }

    const INSIGHT_PILL_ON  = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all';
    const INSIGHT_PILL_OFF = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all';

    // 同步截止日控件的选中态；日期框上限恒为本地今天（不允许选未来日期）
    function syncInsightEndUI() {
      const today = localDateStr(new Date());
      const pt = document.getElementById('endpill-today');
      const py = document.getElementById('endpill-yesterday');
      if (pt) pt.className = insightEndMode === 'today' ? INSIGHT_PILL_ON : INSIGHT_PILL_OFF;
      if (py) py.className = insightEndMode === 'yesterday' ? INSIGHT_PILL_ON : INSIGHT_PILL_OFF;

      const input = document.getElementById('insight-end-date');
      if (!input) return;
      input.max = today;
      input.value = insightEndDate || today;
      input.classList.toggle('ring-2', insightEndMode === 'custom');
      input.classList.toggle('ring-blue-500/40', insightEndMode === 'custom');
    }

    function setInsightEndMode(mode) {
      insightEndMode = mode;
      insightEndDate = resolveInsightEndDate();
      syncInsightEndUI();
      applyEmptyInsightUI();
      checkPeriodInsight();
    }

    // 手选日期：非法或未来日期直接回滚，不改变当前窗口
    function setInsightEndDate(value) {
      const today = localDateStr(new Date());
      if (!value || value > today) {
        syncInsightEndUI();
        appToast('截止日不能晚于今天');
        return;
      }
      insightEndMode = 'custom';
      insightEndDate = value;
      syncInsightEndUI();
      applyEmptyInsightUI();
      checkPeriodInsight();
    }

    // 生成期间禁用档位胶囊与截止日控件，避免流式写卡片时切换窗口导致内容错位
    function setInsightPillsDisabled(disabled) {
      ['7', '30', '60'].forEach(d => {
        const el = document.getElementById(`pill-${d}`);
        if (!el) return;
        el.disabled = disabled;
        el.classList.toggle('opacity-50', disabled);
        el.classList.toggle('cursor-not-allowed', disabled);
        el.classList.toggle('pointer-events-none', disabled);
      });
      ['endpill-today', 'endpill-yesterday'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.disabled = disabled;
        el.classList.toggle('pointer-events-none', disabled);
        el.classList.toggle('opacity-50', disabled);
      });
      const endInput = document.getElementById('insight-end-date');
      if (endInput) {
        endInput.disabled = disabled;
        endInput.classList.toggle('opacity-50', disabled);
      }
    }

    // 轻量原生 Markdown 解析器 (支持标题、列表、粗体、分割线、行内强调与段落)
    function renderMarkdown(md) {
      if (!md) return '';

      // 1. 转义基础 HTML 字符
      let safe = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const lines = safe.split('\n');
      let html = '';
      let inList = false;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // 粗体
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // 行内代码
        line = line.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-xs text-indigo-600">$1</code>');

        // 标题
        if (/^### (.*$)/.test(line)) {
          if (inList) { html += '</ul>'; inList = false; }
          html += line.replace(/^### (.*$)/, '<h3 class="font-bold text-slate-800 text-sm mt-3 mb-1.5 pb-1 border-b border-slate-100">$1</h3>');
          continue;
        }
        if (/^## (.*$)/.test(line)) {
          if (inList) { html += '</ul>'; inList = false; }
          html += line.replace(/^## (.*$)/, '<h2 class="font-bold text-slate-900 text-base mt-4 mb-2">$1</h2>');
          continue;
        }
        if (/^# (.*$)/.test(line)) {
          if (inList) { html += '</ul>'; inList = false; }
          html += line.replace(/^# (.*$)/, '<h1 class="font-bold text-slate-900 text-lg mt-4 mb-2">$1</h1>');
          continue;
        }

        // 分割线
        if (/^---$/.test(line.trim())) {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<hr class="my-3 border-slate-200">';
          continue;
        }

        // 无序列表项 (- 或 *)
        if (/^[*-]\s+(.*$)/.test(line)) {
          if (!inList) {
            html += '<ul class="list-disc pl-5 my-1.5 space-y-1 text-slate-700 text-xs leading-relaxed">';
            inList = true;
          }
          html += line.replace(/^[*-]\s+(.*$)/, '<li>$1</li>');
          continue;
        }

        // 普通文本或空行
        if (inList) {
          html += '</ul>';
          inList = false;
        }

        if (line.trim() === '') {
          continue;
        }

        html += `<p class="my-1.5 text-slate-700 text-xs leading-relaxed">${line}</p>`;
      }

      if (inList) {
        html += '</ul>';
      }

      return html;
    }

    async function generateInsightStream() {
      const contentEl = document.getElementById('insight-content');
      const statusTag = document.getElementById('insight-status-tag');
      const btn = document.getElementById('btn-generate-insight');

      // 生成前按模式重算一次截止日（mode=today 在跨午夜后会自动滚动到新的今天）
      insightEndDate = resolveInsightEndDate();
      syncInsightEndUI();

      // 该窗口已生成过时，新增前先二次确认，避免误触重复生成
      if (insightPeriodGenerated) {
        const ok = await appConfirm(
          `截至 ${insightEndDate} 的近 ${insightDays} 天已生成过洞察，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,
          { title: '重新生成洞察', confirmText: '确定重新生成', danger: false }
        );
        if (!ok) return;
      }

      const originalBtnText = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
      btn.innerHTML = `<span>⏳ AI 正在全盘深度分析中...</span>`;

      // 作废可能在途的回显请求，防止其覆盖本次流式内容；并锁定档位胶囊
      insightLoadSeq++;
      setInsightPillsDisabled(true);

      contentEl.innerHTML = '';
      contentEl.classList.add('typing-cursor');
      statusTag.innerText = 'AI 正在推导生理因果...';

      // 双通道分离状态
      let thinkingText = '';
      let responseText = '';
      let hasError = false;

      // 核心渲染函数：合并调度思考流与正文流
      function updateUI() {
        let fullHTML = '';

        // 1. 如果存在思考内容，渲染可折叠的灰色现代卡片
        if (thinkingText) {
          // 正文未输出时默认展开思考过程；正文一旦开始输出，自动收起折叠框
          const isOpen = !responseText ? 'open' : '';
          fullHTML += `
            <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500" ${isOpen}>
              <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">
                思维链推导 (${thinkingText.length} 字)
              </summary>
              <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${thinkingText}</div>
            </details>
          `;
        }

        // 2. 如果存在正文，通过 Markdown 渲染引擎输出排版
        if (responseText) {
          fullHTML += renderMarkdown(responseText);
        }

        contentEl.innerHTML = fullHTML;
      }

      // getTimezoneOffset() 返回"本地落后 UTC 的分钟数"（东八区为 -480），取反得到东向偏移。
      const tzOffset = -new Date().getTimezoneOffset();

      try {
        const response = await fetch(`/api/v1/insights/stream?days=${insightDays}&end_date=${insightEndDate}&tz_offset=${tzOffset}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // 保留未完整的最后一行

          for (let line of lines) {
            line = line.trim();
            if (!line || !line.startsWith('data:')) continue;

            const dataStr = line.slice(5).trim();
            if (dataStr === '[DONE]') {
              statusTag.innerText = '复盘完成';
              continue;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                responseText += `\n> ⚠️ **服务提示**: ${parsed.error}\n`;
                hasError = true;
                updateUI();
              } else if (parsed.choices && parsed.choices.length > 0) {
                const delta = parsed.choices[0].delta || {};

                let hasUpdate = false;
                // 分流 1：提取思考链
                if (delta.reasoning_content) {
                  thinkingText += delta.reasoning_content;
                  hasUpdate = true;
                }
                // 分流 2：提取正式正文
                if (delta.content) {
                  responseText += delta.content;
                  hasUpdate = true;
                }

                if (hasUpdate) {
                  updateUI();
                }
              }
            } catch (e) {
              // 忽略个别心跳非 JSON 帧
            }
          }
        }

        // 流式正常传输结束判断
        if (hasError) {
          updateUI();
          statusTag.innerText = '分析失败';
        } else if (responseText || thinkingText) {
          // 生成即已按「档位 + 截止日」存档一条：卡片、状态栏、按钮统一为该窗口的口径
          applyInsightPeriodUI(responseText, thinkingText, new Date());
        } else {
          contentEl.innerHTML = '<p class="text-slate-400">未能获取到分析内容，请检查后端大模型连接。</p>';
          statusTag.innerText = '暂无分析内容';
        }
      } catch (err) {
        // 保护性容错：只要已经有文字打出，就不抹除内容报大红字，只在末尾优雅追加提示
        if (responseText || thinkingText) {
          responseText += `\n\n> ⚠️ *[网络连接已完成或阶段传输结束]*`;
          updateUI();
          statusTag.innerText = '分析完成(部分)';
        } else if (err instanceof TypeError) {
          // TypeError 表示请求在传输层就失败了（本地服务未启动/连接被拒），
          // 与"服务端返回了错误"是两回事，分开提示避免误导。
          contentEl.innerHTML = `<p class="text-red-500">无法连接本地服务（${location.host}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`;
          statusTag.innerText = '本地服务未连接';
        } else {
          contentEl.innerHTML = `<p class="text-red-500">连接 AI 洞察服务失败: ${err.message}</p>`;
          statusTag.innerText = '生成异常';
        }
      } finally {
        contentEl.classList.remove('typing-cursor');
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        setInsightPillsDisabled(false);
        // 有产出即说明已自动存档，按钮语义转为「重新生成」（同天同档位为追加保留）
        btn.innerHTML = (responseText || thinkingText) ? '<span class="font-mono">重新生成</span>' : originalBtnText;
      }
    }

    // ===== AI 洞察历史（入口按钮 + 独立视图 + 游标分页） =====

    // 进入历史页：重置筛选与搜索后加载首批
    function openInsightHistory() {
      historyState.rangeDays = 0;
      historyState.compareMode = false;
      historyState.q = '';
      exitHistoryManage();
      const searchEl = document.getElementById('history-search');
      if (searchEl) searchEl.value = '';
      setHistoryFilterPills(0);
      switchTab('history');
      loadHistory(true);
    }

    function setHistoryFilter(days) {
      historyState.rangeDays = days;
      historyState.compareMode = false;
      exitHistoryManage();
      setHistoryFilterPills(days);
      if (currentTab === 'history') loadHistory(true);
    }

    // 第 5 档：阶段对比存档（scope=compare，不传 range_days）
    function setHistoryFilterCompare() {
      historyState.rangeDays = 0;
      historyState.compareMode = true;
      exitHistoryManage();
      setHistoryFilterPills('compare');
      if (currentTab === 'history') loadHistory(true);
    }

    function setHistoryFilterPills(days) {
      [0, 7, 30, 60].forEach(d => {
        const el = document.getElementById(`hfilter-${d}`);
        if (!el) return;
        if (d === days) {
          el.className = 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white transition-all';
        } else {
          el.className = 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all';
        }
      });
      const cEl = document.getElementById('hfilter-compare');
      if (cEl) {
        cEl.className = days === 'compare'
          ? 'flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-blue-600 text-white transition-all'
          : 'flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all';
      }
    }

    let historySearchTimer = null;
    function onHistorySearchInput() {
      clearTimeout(historySearchTimer);
      historySearchTimer = setTimeout(() => {
        exitHistoryManage();
        historyState.q = (document.getElementById('history-search').value || '').trim();
        loadHistory(true);
      }, 300);
    }

    // 加载历史：reset=true 重置游标重新拉取；false 加载下一批（每批 10 条）
    async function loadHistory(reset) {
      if (historyState.loading) return;
      historyState.loading = true;
      if (reset) {
        historyState.items = [];
        historyState.beforeId = 0;
        historyState.hasMore = false;
        historyState.error = '';
        historyState.expanded = {};
        historyState.details = {};
      }
      renderHistoryList();

      const params = new URLSearchParams();
      params.set('limit', '10');
      if (historyState.beforeId > 0) params.set('before_id', String(historyState.beforeId));
      if (historyState.compareMode) params.set('scope', 'compare');
      else if (historyState.rangeDays > 0) params.set('range_days', String(historyState.rangeDays));
      if (historyState.q) params.set('q', historyState.q);

      try {
        const resp = await fetch('/api/v1/insights?' + params.toString());
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '查询失败');
        const data = json.data || {};
        const items = data.items || [];
        historyState.items = historyState.items.concat(items);
        historyState.hasMore = !!data.has_more;
        if (items.length > 0) historyState.beforeId = items[items.length - 1].id;
      } catch (e) {
        historyState.error = e.message;
      } finally {
        historyState.loading = false;
        renderHistoryList();
      }
    }

    function renderHistoryList() {
      const listEl = document.getElementById('history-list');
      const moreBtn = document.getElementById('history-loadmore');
      const manageBtn = document.getElementById('history-manage-btn');
      if (!listEl) return;

      if (!historyState.items.length) {
        if (historyState.loading) {
          listEl.innerHTML = '<p class="text-center text-xs text-slate-400 py-8">加载中…</p>';
        } else if (historyState.error) {
          listEl.innerHTML = `<p class="text-center text-xs text-red-500 py-8">加载失败：${escapeHtml(historyState.error)}</p>`;
        } else {
          listEl.innerHTML = '<div class="bg-white border border-dashed border-slate-200 rounded-2xl py-10 text-center text-xs text-slate-400">暂无洞察存档<br><span class="text-[11px]">在洞察页生成后会自动存档到这里</span></div>';
        }
        if (moreBtn) moreBtn.classList.add('hidden');
        if (manageBtn) manageBtn.classList.toggle('hidden', !historyState.manageMode);
        updateHistoryDeleteBar();
        return;
      }

      listEl.innerHTML = historyState.items.map(it => {
        const isOpen = !!historyState.expanded[it.id];
        const selected = !!historyState.selected[it.id];
        const d = new Date(it.created_at);
        const timeStr = isNaN(d.getTime()) ? '' :
          `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const preview = (it.content || '').replace(/[#*`>|\-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) || '（无正文）';

        // 阶段对比存档：标题用 meta 里的两个月份，缺失则回退到起止日期
        const isCompare = it.scope === 'compare';
        const m = it.meta || {};
        const cmpTitle = (m.month_a && m.month_b)
          ? `${escapeHtml(m.month_a)} vs ${escapeHtml(m.month_b)}`
          : `${escapeHtml(it.start_date)} ~ ${escapeHtml(it.end_date)}`;
        const headTitle = isCompare ? cmpTitle : `${escapeHtml(it.start_date)} ~ ${escapeHtml(it.end_date)}`;
        const headBadge = isCompare ? '阶段对比' : `近 ${it.range_days} 天`;

        const head = `
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-xs font-bold text-slate-800">${headTitle}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold">${headBadge}</span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed ${(isOpen && !historyState.manageMode) ? '' : 'line-clamp-2'}">${escapeHtml(preview)}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[10px] text-slate-400">${timeStr}${it.model ? ' · ' + escapeHtml(it.model) : ''}</span>
            ${historyState.manageMode ? '' : (isCompare ? '<span class="text-[10px] text-blue-600 font-bold">查看对比 ›</span>' : `<span class="text-[10px] text-blue-600 font-bold">${isOpen ? '收起 ▴' : '展开 ▾'}</span>`)}
          </div>`;

        // 管理模式：整卡作为勾选热区，不展开详情
        if (historyState.manageMode) {
          return `
            <div data-hp-id="${it.id}" onclick="onHistoryItemClick(${it.id})" class="cursor-pointer select-none flex items-start space-x-3 bg-white border rounded-2xl p-3.5 shadow-sm transition-colors ${selected ? 'border-blue-400 ring-1 ring-blue-300' : 'border-slate-100'}">
              <div class="mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${selected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}">
                ${selected ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
              </div>
              <div class="flex-1 min-w-0">${head}</div>
            </div>`;
        }

        let detail = '';
        if (isOpen) {
          const full = historyState.details[it.id];
          if (!full) {
            detail = '<p class="text-[11px] text-slate-400 mt-2">加载全文…</p>';
          } else {
            const think = (full.thinking || '').trim();
            const thinkHtml = think ? `
              <details class="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
                <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${think.length} 字)</summary>
                <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${escapeHtml(think)}</div>
              </details>` : '';
            detail = `${thinkHtml}
              <div class="mt-2 text-sm text-slate-700 leading-relaxed markdown-body">${renderMarkdown(full.content || '')}</div>`;
          }
        }

        return `
          <div data-hp-id="${it.id}" class="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm">
            <div class="cursor-pointer select-none" onclick="onHistoryItemClick(${it.id})">${head}</div>
            ${detail}
          </div>`;
      }).join('');

      if (moreBtn) moreBtn.classList.toggle('hidden', !historyState.hasMore);
      if (manageBtn) manageBtn.classList.toggle('hidden', !historyState.items.length && !historyState.manageMode);
      updateHistoryDeleteBar();
      bindHistoryLongPress();
    }

    // 条目点击分发：长按触发后抑制本次点击；管理模式=勾选；普通模式=展开/收起
    function onHistoryItemClick(id) {
      if (historyLongPressFired) { historyLongPressFired = false; return; }
      if (historyState.manageMode) { toggleHistorySelect(id); return; }
      // 阶段对比存档：点击直接进入对比独立视图并带上两月（返回时回到历史页）
      const it = historyState.items.find(x => x.id === id);
      if (it && it.scope === 'compare') {
        const meta = it.meta || {};
        const ma = meta.month_a || (it.start_date || '').slice(0, 7);
        const mb = meta.month_b || (it.end_date || '').slice(0, 7);
        if (ma && mb) { cmpOpenFromHistory(ma, mb); return; }
      }
      toggleHistoryItem(id);
    }

    // ===== 管理模式（批量删除） =====
    let historyLongPressTimer = null;
    let historyLongPressFired = false;

    // 长按条目（移动端最佳实践）直接进入管理模式并选中该项
    function bindHistoryLongPress() {
      const listEl = document.getElementById('history-list');
      if (!listEl) return;
      listEl.querySelectorAll('[data-hp-id]').forEach(el => {
        const id = parseInt(el.getAttribute('data-hp-id'), 10);
        const start = () => {
          if (historyState.manageMode) return;
          historyLongPressFired = false;
          clearTimeout(historyLongPressTimer);
          historyLongPressTimer = setTimeout(() => {
            historyLongPressFired = true;
            historyState.manageMode = true;
            historyState.selected = { [id]: true };
            syncHistoryManageUI();
            renderHistoryList();
          }, 500);
        };
        const cancel = () => clearTimeout(historyLongPressTimer);
        el.addEventListener('pointerdown', start);
        el.addEventListener('pointerup', cancel);
        el.addEventListener('pointerleave', cancel);
        el.addEventListener('pointercancel', cancel);
        el.addEventListener('contextmenu', e => e.preventDefault());
      });
    }

    function toggleHistoryManage() {
      historyState.manageMode = !historyState.manageMode;
      if (!historyState.manageMode) historyState.selected = {};
      syncHistoryManageUI();
      renderHistoryList();
    }

    function exitHistoryManage() {
      if (!historyState.manageMode) return;
      historyState.manageMode = false;
      historyState.selected = {};
      syncHistoryManageUI();
    }

    function syncHistoryManageUI() {
      const btn = document.getElementById('history-manage-btn');
      if (btn) {
        btn.innerText = historyState.manageMode ? '完成' : '管理';
        btn.className = historyState.manageMode
          ? 'text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors'
          : 'text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors';
      }
      updateHistoryDeleteBar();
    }

    function toggleHistorySelect(id) {
      if (historyState.selected[id]) delete historyState.selected[id];
      else historyState.selected[id] = true;
      renderHistoryList();
    }

    function toggleHistorySelectAll() {
      const ids = historyState.items.map(i => i.id);
      const selectedCount = ids.filter(id => historyState.selected[id]).length;
      if (selectedCount === ids.length) {
        historyState.selected = {};
      } else {
        const sel = {};
        ids.forEach(id => { sel[id] = true; });
        historyState.selected = sel;
      }
      renderHistoryList();
    }

    function updateHistoryDeleteBar() {
      const bar = document.getElementById('history-delete-bar');
      if (!bar) return;
      const show = historyState.manageMode && historyState.items.length > 0;
      bar.classList.toggle('hidden', !show);
      if (!show) return;

      const ids = historyState.items.map(i => i.id);
      const count = ids.filter(id => historyState.selected[id]).length;

      const countEl = document.getElementById('history-selected-count');
      if (countEl) countEl.innerText = `已选 ${count} 项`;

      const selAllBtn = document.getElementById('history-selectall-btn');
      if (selAllBtn) selAllBtn.innerText = (ids.length > 0 && count === ids.length) ? '取消全选' : '全选';

      const delBtn = document.getElementById('history-delete-btn');
      if (delBtn) {
        delBtn.disabled = count === 0;
        delBtn.innerText = count > 0 ? `删除所选 (${count})` : '删除所选';
        delBtn.className = count > 0
          ? 'text-xs font-bold bg-red-500 hover:bg-red-600 px-3.5 py-1.5 rounded-xl transition-colors'
          : 'text-xs font-bold bg-slate-600/60 text-slate-300 px-3.5 py-1.5 rounded-xl cursor-not-allowed transition-colors';
      }
    }

    // 通用确认弹窗：返回 Promise<boolean>。用于替代原生 confirm()，
    // 原生对话框在安卓 WebView（未实现 onJsConfirm）恒返回 false，且在 IDE 内嵌浏览器会打断宿主组件树。
    function appConfirm(message, options) {
      const opts = options || {};
      return new Promise(resolve => {
        const modal = document.getElementById('app-confirm-modal');
        const titleEl = document.getElementById('app-confirm-title');
        const msgEl = document.getElementById('app-confirm-msg');
        const okBtn = document.getElementById('app-confirm-ok');
        const cancelBtn = document.getElementById('app-confirm-cancel');
        if (!modal) { resolve(false); return; }

        titleEl.innerText = opts.title || '请确认';
        msgEl.innerText = message || '';
        okBtn.innerText = opts.confirmText || '确定';
        if (opts.danger === false) {
          okBtn.className = 'flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors';
        } else {
          okBtn.className = 'flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors';
        }

        const cleanup = () => {
          modal.classList.add('hidden');
          okBtn.onclick = null;
          cancelBtn.onclick = null;
          modal.onclick = null;
        };
        okBtn.onclick = () => { cleanup(); resolve(true); };
        cancelBtn.onclick = () => { cleanup(); resolve(false); };
        modal.onclick = (e) => { if (e.target === modal) { cleanup(); resolve(false); } };

        modal.classList.remove('hidden');
      });
    }

    // 复制文本：安卓端优先走原生剪贴板桥，其次 Clipboard API，最后 textarea + execCommand。
    async function appCopyText(text) {
      if (window.HealthTrack && typeof window.HealthTrack.copyText === 'function') {
        try {
          window.HealthTrack.copyText(text);
          return true;
        } catch (e) { /* 继续走 Web API */ }
      }
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (e) { /* 回退到 execCommand */ }
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-2000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (e) {
        return false;
      }
    }

    // 轻量提示条：替代原生 alert()，避免安卓端静默无提示。
    let appToastTimer = null;
    function appToast(message) {
      const el = document.getElementById('app-toast');
      if (!el) return;
      el.innerText = message || '';
      el.classList.remove('hidden');
      if (appToastTimer) clearTimeout(appToastTimer);
      appToastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
    }

    async function deleteSelectedInsights() {
      const ids = historyState.items.map(i => i.id).filter(id => historyState.selected[id]);
      if (!ids.length) return;
      const ok = await appConfirm(`确定删除所选 ${ids.length} 条洞察存档？删除后不可恢复。`, { title: '删除洞察存档', confirmText: '确定删除' });
      if (!ok) return;
      try {
        const resp = await fetch('/api/v1/insights/batch-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        const json = await resp.json();
        if (json.code !== 200) throw new Error(json.message || '删除失败');
        historyState.items = historyState.items.filter(x => !historyState.selected[x.id]);
        Object.keys(historyState.selected).forEach(id => {
          delete historyState.expanded[id];
          delete historyState.details[id];
        });
        historyState.selected = {};
        if (!historyState.items.length) historyState.manageMode = false;
        syncHistoryManageUI();
        renderHistoryList();
        checkPeriodInsight(); // 同步刷新洞察页当前窗口的已生成状态
      } catch (e) {
        appToast('删除失败：' + e.message);
      }
    }

    async function toggleHistoryItem(id) {
      if (historyState.expanded[id]) {
        historyState.expanded[id] = false;
        renderHistoryList();
        return;
      }
      historyState.expanded[id] = true;
      renderHistoryList();
      if (!historyState.details[id]) {
        try {
          const resp = await fetch(`/api/v1/insights/${id}`);
          const json = await resp.json();
          historyState.details[id] = (json.code === 200 && json.data) ? json.data : { content: '加载失败', thinking: '' };
        } catch (e) {
          historyState.details[id] = { content: '加载失败：' + e.message, thinking: '' };
        }
        renderHistoryList();
      }
    }

    function escapeHtml(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    // 洞察页默认欢迎介绍词（该档位今天未生成时展示）
    const DEFAULT_INSIGHT_WELCOME = '<p>欢迎来到 AI 洞察页面！系统会自动提取你在选定周期内的体重走势、夜间呼吸失水、熬夜红黄绿分布、以及饮食运动日记，并由大模型进行深度因果归因与复盘。</p>';

    // 将存档的洞察渲染进卡片：思维链折叠卡在上、正文在下（与历史页展开态一致）
    function renderInsightArchive(content, thinking) {
      let html = '';
      const think = (thinking || '').trim();
      if (think) {
        html += `
          <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">思维链推导 (${think.length} 字)</summary>
            <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${escapeHtml(think)}</div>
          </details>`;
      }
      if (content && content.trim()) {
        html += renderMarkdown(content);
      } else {
        html += '<p class="text-slate-400 text-xs">该洞察没有正文内容。</p>';
      }
      return html;
    }

    // 默认空态（卡片 + 状态栏 + 按钮三处统一）
    function applyEmptyInsightUI() {
      insightPeriodGenerated = false;
      const contentEl = document.getElementById('insight-content');
      const statusTag = document.getElementById('insight-status-tag');
      const btn = document.getElementById('btn-generate-insight');
      if (contentEl) contentEl.innerHTML = DEFAULT_INSIGHT_WELCOME;
      if (statusTag) statusTag.innerText = '点击上方按钮开始';
      if (btn) btn.innerHTML = '<span class="font-mono">生成阶段深度洞察</span>';
    }

    // 该窗口已生成的回显态（卡片 + 状态栏 + 按钮三处统一）
    function applyInsightPeriodUI(content, thinking, createdAt) {
      insightPeriodGenerated = true;
      const contentEl = document.getElementById('insight-content');
      const statusTag = document.getElementById('insight-status-tag');
      const btn = document.getElementById('btn-generate-insight');
      const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      if (contentEl) contentEl.innerHTML = renderInsightArchive(content, thinking);
      if (statusTag) statusTag.innerHTML = `近 ${insightDays} 天（截至 ${insightEndDate}）· 生成于 ${hh}:${mm} · <span onclick="openInsightHistory()" class="text-blue-600 cursor-pointer font-bold">点击查看</span>`;
      if (btn) btn.innerHTML = '<span class="font-mono">重新生成</span>';
    }

    // 洞察页回显：按"当前档位 + 截止日"这一分析窗口判断并渲染。
    // 报告的身份是窗口本身（档位 × 截止日），而不是"生成时刻"——因此可以回溯补生成昨天的窗口。
    // 窗口换算与"是否已生成"完全由后端判定（GET /insights/period）：前端只上报截止日与时区偏移，
    // 后端返回 {exists, insight}；exists=false（含"生成过但已删除"）一律显示默认空态。
    let insightLoadSeq = 0;
    async function checkPeriodInsight() {
      const contentEl = document.getElementById('insight-content');
      const statusTag = document.getElementById('insight-status-tag');
      const btn = document.getElementById('btn-generate-insight');
      if (!statusTag || !btn || !contentEl) return;

      // 每次判定前重算窗口：mode=today 时跨午夜会自动跟随到新的今天
      insightEndDate = resolveInsightEndDate();
      syncInsightEndUI();

      const range = insightDays; // 记录本次查询窗口，防止快速切换导致的过期响应
      const end = insightEndDate;
      const seq = ++insightLoadSeq;
      const isStale = () => seq !== insightLoadSeq || range !== insightDays || end !== insightEndDate;

      // getTimezoneOffset() 返回"本地落后 UTC 的分钟数"（东八区为 -480），取反得到东向偏移。
      const tzOffset = -new Date().getTimezoneOffset();

      try {
        const resp = await fetch(`/api/v1/insights/period?range_days=${range}&end_date=${end}&tz_offset=${tzOffset}`);
        if (isStale()) return;
        const json = await resp.json();
        if (isStale()) return;

        const data = (json.code === 200 && json.data) ? json.data : null;
        if (!data || !data.exists || !data.insight) {
          applyEmptyInsightUI();
          return;
        }
        const item = data.insight;
        applyInsightPeriodUI(item.content || '', item.thinking || '', item.created_at);
      } catch (e) {
        if (isStale()) return;
        applyEmptyInsightUI();
      }
    }

    // App 长时间挂在后台（手机端覆盖安装后 WebView/JS 内存状态不会重建）或被系统杀进程前的
    // 页面往返缓存恢复时，时间可能已经跨天。此时必须重新判定一次窗口，
    // 否则会残留昨天的「重新生成 + 洞察正文」，被误当成当前窗口已生成过洞察。
    function refreshInsightOnResume() {
      if (document.visibilityState !== 'visible') return;
      if (currentTab !== 'insight') return;
      checkPeriodInsight();
    }
    document.addEventListener('visibilitychange', refreshInsightOnResume);
    window.addEventListener('pageshow', refreshInsightOnResume);


    /* ============================================================
       阶段对比（独立视图）：两月选择 + 指标对比表 + AI 对比综述（SSE 流式）
       命名统一用 cmp 前缀，与既有函数隔离，避免被 try/catch 吞掉。
       ============================================================ */
    let cmpState = {
      monthA: '',        // 对比月 A（YYYY-MM），默认上月
      monthB: '',        // 对比月 B（YYYY-MM），默认上上个月
      metricsA: null,    // 单月指标快照
      metricsB: null,
      generated: false,  // 当前月份对是否已生成过综述
      busy: false,       // SSE 生成中
      loadSeq: 0,        // 作废在途回显
      returnTab: 'insight' // 返回目标：insight / history
    };

    // offset=0 当前月，-1 上月，-2 上上个月…
    function cmpMonthStr(offset) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() + offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function cmpMonthIndex(ym) {
      const [y, m] = ym.split('-').map(Number);
      return y * 12 + (m - 1);
    }

    // 当前本地月，作为「不允许选未来」的边界
    function cmpCurrentMonth() { return cmpMonthStr(0); }

    function cmpShiftMonth(ym, delta) {
      const [y, m] = ym.split('-').map(Number);
      const d = new Date(y, m - 1 + delta, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function cmpMonthLabel(ym) {
      if (!ym) return '—';
      const [y, m] = ym.split('-');
      return `${y} 年 ${parseInt(m, 10)} 月`;
    }

    function cmpIsFuture(ym) {
      return cmpMonthIndex(ym) > cmpMonthIndex(cmpCurrentMonth());
    }

    // 入口：可选月份参数（从历史页带月份进来）；无参数时用已选月份，首次取「上月 vs 上上个月」
    function openCompareView(monthA, monthB, fromTab) {
      cmpState.returnTab = fromTab === 'history' ? 'history' : 'insight';
      if (monthA && monthB) {
        cmpState.monthA = monthA;
        cmpState.monthB = monthB;
      } else {
        if (!cmpState.monthA) cmpState.monthA = cmpMonthStr(-1);
        if (!cmpState.monthB) cmpState.monthB = cmpMonthStr(-2);
      }
      switchTab('compare'); // 进入后由 switchTab 触发 cmpRefreshPeriod()
    }

    // 历史页卡片入口：记住来源为历史页，返回时回到历史列表
    function cmpOpenFromHistory(monthA, monthB) {
      openCompareView(monthA, monthB, 'history');
    }

    function cmpBack() {
      switchTab(cmpState.returnTab === 'history' ? 'history' : 'insight');
    }

    // 同步月份标签与步进按钮可用态（到边界时禁用「下一月」，避免选到未来）
    function cmpSyncMonthUI() {
      const la = document.getElementById('cmp-a-label');
      const lb = document.getElementById('cmp-b-label');
      if (la) la.innerText = cmpMonthLabel(cmpState.monthA);
      if (lb) lb.innerText = cmpMonthLabel(cmpState.monthB);
      ['a', 'b'].forEach(k => {
        const ym = k === 'a' ? cmpState.monthA : cmpState.monthB;
        const nextEl = document.getElementById(`cmp-${k}-next`);
        if (!nextEl) return;
        const atMax = !ym || cmpIsFuture(cmpShiftMonth(ym, 1));
        nextEl.disabled = atMax || cmpState.busy;
        nextEl.classList.toggle('opacity-40', atMax || cmpState.busy);
        nextEl.classList.toggle('cursor-not-allowed', atMax || cmpState.busy);
      });
    }

    // 生成期间锁定两个月份胶囊与生成按钮
    function cmpSetControlsDisabled(disabled) {
      ['cmp-a-prev', 'cmp-a-next', 'cmp-b-prev', 'cmp-b-next'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.disabled = disabled;
        el.classList.toggle('opacity-40', disabled);
        el.classList.toggle('pointer-events-none', disabled);
        el.classList.toggle('cursor-not-allowed', disabled);
      });
      if (!disabled) cmpSyncMonthUI();
    }

    function cmpStepMonth(which, delta) {
      if (cmpState.busy) return;
      const cur = which === 'a' ? cmpState.monthA : cmpState.monthB;
      const next = cmpShiftMonth(cur, delta);
      if (cmpIsFuture(next)) { appToast('不能选择未来的月份'); cmpSyncMonthUI(); return; }
      if (which === 'a') cmpState.monthA = next; else cmpState.monthB = next;
      cmpClearInsightCard();
      cmpRefreshPeriod();
    }

    // 切换月份后先清空综述卡片残留，再由 cmpRefreshPeriod 按新月份回显
    function cmpClearInsightCard() {
      const contentEl = document.getElementById('compare-insight-card');
      const statusTag = document.getElementById('cmp-status-tag');
      if (contentEl) contentEl.innerHTML = '<p class="text-slate-400 text-xs">加载该月份对的对比数据…</p>';
      if (statusTag) statusTag.innerText = '加载中…';
    }

    // 数值格式化：缺失（null/undefined/空/NaN）一律显示 —，严禁填 0
    function cmpCell(v, digits) {
      if (v === null || v === undefined || v === '' || isNaN(Number(v))) return '—';
      return Number(v).toFixed(digits);
    }

    // 任一侧缺失则 Δ 为 null
    function cmpDeltaVal(a, b) {
      if (a === null || a === undefined || b === null || b === undefined || a === '' || b === '') return null;
      const na = Number(a), nb = Number(b);
      if (isNaN(na) || isNaN(nb)) return null;
      return na - nb; // A - B：正=上升，负=下降
    }

    function cmpDeltaCell(a, b, digits, dir) {
      const d = cmpDeltaVal(a, b);
      if (d === null) return '<span class="text-slate-300">—</span>';
      const txt = (d > 0 ? '+' : '') + d.toFixed(digits);
      let cls = 'text-slate-500';
      if (dir === 'down') cls = d < 0 ? 'text-emerald-600' : (d > 0 ? 'text-red-500' : 'text-slate-400');
      else if (dir === 'up') cls = d > 0 ? 'text-emerald-600' : (d < 0 ? 'text-red-500' : 'text-slate-400');
      return `<span class="font-bold ${cls}">${txt}</span>`;
    }

    function cmpMetricRow(label, aHtml, bHtml, deltaHtml) {
      return `<tr class="border-b border-slate-50 last:border-0">
        <td class="py-2 pr-2 text-slate-500 align-top">${label}</td>
        <td class="py-2 text-right font-bold text-slate-800 tabular-nums">${aHtml}</td>
        <td class="py-2 text-right font-bold text-slate-800 tabular-nums">${bHtml}</td>
        <td class="py-2 text-right whitespace-nowrap">${deltaHtml}</td>
      </tr>`;
    }

    function cmpSleepDistText(m) {
      if (!m) return '—';
      const g = cmpCell(m.green_days, 0), y = cmpCell(m.yellow_days, 0), r = cmpCell(m.red_days, 0);
      if (g === '—' && y === '—' && r === '—') return '—';
      return `${g} / ${y} / ${r}`;
    }

    function cmpWorkoutText(m) {
      if (!m) return '—';
      const days = cmpCell(m.workout_days, 0);
      if (days === '—') return '—';
      const sub = [];
      if (m.workout_light !== null && m.workout_light !== undefined) sub.push(`轻 ${m.workout_light}`);
      if (m.workout_medium !== null && m.workout_medium !== undefined) sub.push(`中 ${m.workout_medium}`);
      if (m.workout_failure !== null && m.workout_failure !== undefined) sub.push(`力竭 ${m.workout_failure}`);
      return sub.length ? `${days} <span class="text-[10px] text-slate-400 font-normal">(${sub.join(' / ')})</span>` : days;
    }

    function cmpRenderTable() {
      const body = document.getElementById('compare-table-body');
      if (!body) return;
      const colA = document.getElementById('cmp-col-a');
      const colB = document.getElementById('cmp-col-b');
      const metaEl = document.getElementById('cmp-table-meta');
      if (colA) colA.innerText = cmpMonthLabel(cmpState.monthA);
      if (colB) colB.innerText = cmpMonthLabel(cmpState.monthB);

      const a = cmpState.metricsA;
      const b = cmpState.metricsB;
      if (!a && !b) {
        body.innerHTML = '<tr><td colspan="4" class="py-6 text-center text-slate-400">暂无数据</td></tr>';
        if (metaEl) metaEl.innerText = '';
        return;
      }
      if (metaEl) {
        const rows = [a, b].filter(m => m && m.record_days !== null && m.record_days !== undefined).map(m => `${m.month} ${m.record_days} 天`);
        metaEl.innerText = rows.join(' · ');
      }

      const g = (m, f) => m ? m[f] : null;
      const html = [
        // 体重
        cmpMetricRow('体重均值 (kg)', cmpCell(g(a, 'weight_avg'), 1), cmpCell(g(b, 'weight_avg'), 1), cmpDeltaCell(g(a, 'weight_avg'), g(b, 'weight_avg'), 1, 'down')),
        cmpMetricRow('体重净变化 (kg)', cmpCell(g(a, 'weight_delta'), 1), cmpCell(g(b, 'weight_delta'), 1), cmpDeltaCell(g(a, 'weight_delta'), g(b, 'weight_delta'), 1, 'down')),
        // 腰围
        cmpMetricRow('腰围均值 (cm)', cmpCell(g(a, 'waist_avg'), 1), cmpCell(g(b, 'waist_avg'), 1), cmpDeltaCell(g(a, 'waist_avg'), g(b, 'waist_avg'), 1, 'down')),
        cmpMetricRow('腰围净变化 (cm)', cmpCell(g(a, 'waist_delta'), 1), cmpCell(g(b, 'waist_delta'), 1), cmpDeltaCell(g(a, 'waist_delta'), g(b, 'waist_delta'), 1, 'down')),
        // 睡眠
        cmpMetricRow('平均睡眠时长 (小时)', cmpCell(g(a, 'sleep_avg_hours'), 1), cmpCell(g(b, 'sleep_avg_hours'), 1), cmpDeltaCell(g(a, 'sleep_avg_hours'), g(b, 'sleep_avg_hours'), 1, 'up')),
        // 熬夜分布（无单一 Δ）
        cmpMetricRow('熬夜分布 (绿/黄/红 天数)', cmpSleepDistText(a), cmpSleepDistText(b), '<span class="text-slate-300">—</span>'),
        // 运动
        cmpMetricRow('有运动天数', cmpWorkoutText(a), cmpWorkoutText(b), cmpDeltaCell(g(a, 'workout_days'), g(b, 'workout_days'), 0, 'up')),
        // 服药
        cmpMetricRow('专注达服药天数 (天)', cmpCell(g(a, 'concerta_days'), 0), cmpCell(g(b, 'concerta_days'), 0), cmpDeltaCell(g(a, 'concerta_days'), g(b, 'concerta_days'), 0, null)),
        // 夜间排水
        cmpMetricRow('平均夜间排水 (kg)', cmpCell(g(a, 'night_loss_avg'), 2), cmpCell(g(b, 'night_loss_avg'), 2), cmpDeltaCell(g(a, 'night_loss_avg'), g(b, 'night_loss_avg'), 2, 'down'))
      ];
      body.innerHTML = html.join('');
    }

    // 未过完 / 数据不足 提示条
    function cmpRenderWarn() {
      const el = document.getElementById('cmp-warn');
      if (!el) return;
      const parts = [];
      [['a', cmpState.monthA, cmpState.metricsA], ['b', cmpState.monthB, cmpState.metricsB]].forEach(pair => {
        const ym = pair[1], m = pair[2];
        if (!m) return;
        if (m.incomplete_month) parts.push(`⚠️ ${cmpMonthLabel(ym)}尚未过完，结论置信度低`);
        else if (m.data_insufficient) parts.push(`⚠️ ${cmpMonthLabel(ym)}数据不足，结论置信度低`);
      });
      if (parts.length) {
        el.innerHTML = parts.join('<br>');
        el.classList.remove('hidden');
      } else {
        el.innerHTML = '';
        el.classList.add('hidden');
      }
    }

    // 空态 / 回显态（卡片 + 状态栏 + 按钮三处统一）
    function cmpApplyEmptyUI() {
      cmpState.generated = false;
      const contentEl = document.getElementById('compare-insight-card');
      const statusTag = document.getElementById('cmp-status-tag');
      const btn = document.getElementById('compare-gen-btn');
      if (contentEl) contentEl.innerHTML = '<p>选择两个月，点击「生成阶段对比综述」，AI 将对两个自然月的体重、腰围、睡眠、运动与服药情况做横向对比与归因分析。</p>';
      if (statusTag) statusTag.innerText = '点击上方按钮开始';
      if (btn) btn.innerHTML = '<span class="font-mono">生成阶段对比综述</span>';
    }

    function cmpApplyInsightUI(content, thinking, createdAt) {
      cmpState.generated = true;
      const contentEl = document.getElementById('compare-insight-card');
      const statusTag = document.getElementById('cmp-status-tag');
      const btn = document.getElementById('compare-gen-btn');
      const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      if (contentEl) contentEl.innerHTML = renderInsightArchive(content, thinking);
      if (statusTag) statusTag.innerText = `${cmpMonthLabel(cmpState.monthA)} vs ${cmpMonthLabel(cmpState.monthB)} · 生成于 ${hh}:${mm}`;
      if (btn) btn.innerHTML = '<span class="font-mono">重新生成阶段对比</span>';
    }

    // 拉取两月指标快照 + 是否已生成（无论是否已生成都先渲染对比表）
    async function cmpRefreshPeriod() {
      if (!cmpState.monthA) cmpState.monthA = cmpMonthStr(-1);
      if (!cmpState.monthB) cmpState.monthB = cmpMonthStr(-2);
      cmpSyncMonthUI();
      const seq = ++cmpState.loadSeq;
      const a = cmpState.monthA, b = cmpState.monthB;
      const tzOffset = -new Date().getTimezoneOffset(); // 与洞察页同一算法：东向偏移
      try {
        const resp = await fetch(`/api/v1/insights/compare/period?month_a=${a}&month_b=${b}&tz_offset=${tzOffset}`);
        if (seq !== cmpState.loadSeq) return;
        const json = await resp.json();
        if (seq !== cmpState.loadSeq) return;
        if (json.code !== 200 || !json.data) throw new Error(json.message || '加载失败');
        const data = json.data;
        if (seq !== cmpState.loadSeq) return;
        cmpState.metricsA = data.metrics_a || null;
        cmpState.metricsB = data.metrics_b || null;
        cmpRenderTable();
        cmpRenderWarn();
        if (data.exists && data.insight) {
          cmpApplyInsightUI(data.insight.content || '', data.insight.thinking || '', data.insight.created_at);
        } else {
          cmpApplyEmptyUI();
        }
      } catch (e) {
        if (seq !== cmpState.loadSeq) return;
        cmpState.metricsA = null;
        cmpState.metricsB = null;
        cmpRenderTable();
        cmpRenderWarn();
        const contentEl = document.getElementById('compare-insight-card');
        if (contentEl) contentEl.innerHTML = `<p class="text-red-500 text-xs">加载对比数据失败：${escapeHtml(e.message)}</p>`;
        const statusTag = document.getElementById('cmp-status-tag');
        if (statusTag) statusTag.innerText = '加载失败';
        appToast('加载对比数据失败：' + e.message);
      }
    }

    // 生成阶段对比综述（SSE，复用洞察页的消费写法：思维链折叠在上、正文在下）
    async function cmpGenerateStream() {
      if (cmpState.busy) return;
      const contentEl = document.getElementById('compare-insight-card');
      const statusTag = document.getElementById('cmp-status-tag');
      const btn = document.getElementById('compare-gen-btn');
      if (!contentEl || !btn) return;

      if (cmpState.generated) {
        const ok = await appConfirm(
          `「${cmpMonthLabel(cmpState.monthA)} vs ${cmpMonthLabel(cmpState.monthB)}」已生成过阶段对比综述，重新生成会新增一条存档并重新消耗大模型额度，确定继续吗？`,
          { title: '重新生成阶段对比', confirmText: '确定重新生成', danger: false }
        );
        if (!ok) return;
      }

      const originalBtnText = btn.innerHTML;
      cmpState.busy = true;
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
      btn.innerHTML = '<span>⏳ AI 正在对比分析中...</span>';
      cmpSetControlsDisabled(true);

      cmpState.loadSeq++; // 作废在途回显请求，防止覆盖本次流式内容
      contentEl.innerHTML = '';
      contentEl.classList.add('typing-cursor');
      statusTag.innerText = 'AI 正在推导两月差异...';

      let thinkingText = '';
      let responseText = '';
      let hasError = false;

      function updateUI() {
        let fullHTML = '';
        if (thinkingText) {
          // 正文未输出时默认展开思维链；正文一开始输出就自动收起
          const isOpen = !responseText ? 'open' : '';
          fullHTML += `
            <details class="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500" ${isOpen}>
              <summary class="cursor-pointer font-medium text-slate-600 select-none hover:text-slate-800 transition-colors">
                思维链推导 (${thinkingText.length} 字)
              </summary>
              <div class="mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-slate-200 pt-2 text-slate-600">${thinkingText}</div>
            </details>
          `;
        }
        if (responseText) fullHTML += renderMarkdown(responseText);
        contentEl.innerHTML = fullHTML;
      }

      const tzOffset = -new Date().getTimezoneOffset();
      try {
        const response = await fetch(`/api/v1/insights/compare/stream?month_a=${cmpState.monthA}&month_b=${cmpState.monthB}&tz_offset=${tzOffset}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

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
            if (dataStr === '[DONE]') { statusTag.innerText = '对比完成'; continue; }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                responseText += `\n> ⚠️ **服务提示**: ${parsed.error}\n`;
                hasError = true;
                updateUI();
              } else if (parsed.choices && parsed.choices.length > 0) {
                const delta = parsed.choices[0].delta || {};
                let hasUpdate = false;
                if (delta.reasoning_content) { thinkingText += delta.reasoning_content; hasUpdate = true; }
                if (delta.content) { responseText += delta.content; hasUpdate = true; }
                if (hasUpdate) updateUI();
              }
            } catch (e) { /* 忽略心跳等非 JSON 帧 */ }
          }
        }

        if (hasError) {
          updateUI();
          statusTag.innerText = '分析失败';
        } else if (responseText || thinkingText) {
          cmpApplyInsightUI(responseText, thinkingText, new Date());
        } else {
          contentEl.innerHTML = '<p class="text-slate-400">未能获取到对比内容，请检查后端大模型连接。</p>';
          statusTag.innerText = '暂无对比内容';
        }
      } catch (err) {
        if (responseText || thinkingText) {
          responseText += `\n\n> ⚠️ *[网络连接已完成或阶段传输结束]*`;
          updateUI();
          statusTag.innerText = '分析完成(部分)';
        } else if (err instanceof TypeError) {
          contentEl.innerHTML = `<p class="text-red-500">无法连接本地服务（${location.host}）。请确认 HealthTrack 程序正在运行，然后重试。</p>`;
          statusTag.innerText = '本地服务未连接';
        } else {
          contentEl.innerHTML = `<p class="text-red-500">连接 AI 对比服务失败: ${err.message}</p>`;
          statusTag.innerText = '生成异常';
        }
      } finally {
        contentEl.classList.remove('typing-cursor');
        cmpState.busy = false;
        cmpSetControlsDisabled(false);
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        // 仅在「确实产出且无错误」时才说明已自动存档，按钮语义才转为「重新生成」
        btn.innerHTML = (!hasError && (responseText || thinkingText)) ? '<span class="font-mono">重新生成阶段对比</span>' : originalBtnText;
      }
    }

window.openInsightHistory = openInsightHistory;
window.generateInsightStream = generateInsightStream;
window.switchInsightRange = switchInsightRange;
window.openCompareView = openCompareView;
