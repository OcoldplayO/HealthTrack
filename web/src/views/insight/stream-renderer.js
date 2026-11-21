/**
 * AI 洞察与阶段对比共享流式/归档渲染器
 */
import { escapeHtml, renderMarkdown } from '../../utils/format.js';

/**
 * 构建思维链与正文分离的流式容器：避免每次更新重写整个 innerHTML 重置 <details> 折叠态
 * @param {HTMLElement} contentEl
 * @returns {(state: { thinking?: string, content?: string }) => void}
 */
export function createStreamRenderers(contentEl) {
  contentEl.innerHTML = '';
  const thinkHost = document.createElement('div');
  const bodyHost = document.createElement('div');
  contentEl.appendChild(thinkHost);
  contentEl.appendChild(bodyHost);

  /** @type {HTMLDetailsElement | null} */
  let detailsEl = null;
  /** @type {HTMLElement | null} */
  let summaryEl = null;
  /** @type {HTMLDivElement | null} */
  let thinkBodyEl = null;
  let autoCollapsed = false;
  let lastRenderedContent = '';

  return ({ thinking, content }) => {
    if (thinking) {
      if (!detailsEl) {
        detailsEl = document.createElement('details');
        detailsEl.className = 'mb-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-500';
        detailsEl.open = true;

        summaryEl = document.createElement('summary');
        summaryEl.className = 'cursor-pointer font-mono font-medium text-neutral-600 select-none hover:text-neutral-900 transition-colors';

        thinkBodyEl = document.createElement('div');
        thinkBodyEl.className = 'mt-2 whitespace-pre-wrap font-mono leading-relaxed border-t border-neutral-200 pt-2 text-neutral-600';

        detailsEl.appendChild(summaryEl);
        detailsEl.appendChild(thinkBodyEl);
        thinkHost.appendChild(detailsEl);
      }
      if (summaryEl) summaryEl.textContent = `思维链推导 (${thinking.length} 字)`;
      if (thinkBodyEl) thinkBodyEl.textContent = thinking;
      if (content && !autoCollapsed && detailsEl) {
        detailsEl.open = false;
        autoCollapsed = true;
      }
    }
    if (content && content !== lastRenderedContent) {
      lastRenderedContent = content;
      bodyHost.innerHTML = renderMarkdown(content);
    }
  };
}

/**
 * 将存档的洞察渲染进卡片：思维链折叠卡在上、正文在下
 * @param {string} content
 * @param {string} thinking
 * @returns {string}
 */
export function renderInsightArchive(content, thinking) {
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
