/**
 * 文本与 HTML 格式化工具 (escapeHtml, renderMarkdown)
 */

export function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMarkdown(md) {
  if (!md) return '';

  // 1. 转义基础 HTML 字符
  const safe = escapeHtml(md);

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
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += line.replace(/^### (.*$)/, '<h3 class="font-bold text-slate-800 text-sm mt-3 mb-1.5 pb-1 border-b border-slate-100">$1</h3>');
      continue;
    }
    if (/^## (.*$)/.test(line)) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += line.replace(/^## (.*$)/, '<h2 class="font-bold text-slate-900 text-base mt-4 mb-2">$1</h2>');
      continue;
    }
    if (/^# (.*$)/.test(line)) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += line.replace(/^# (.*$)/, '<h1 class="font-bold text-slate-900 text-lg mt-4 mb-2">$1</h1>');
      continue;
    }

    // 分割线
    if (/^---$/.test(line.trim())) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
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

    // 普通段落
    if (inList) {
      html += '</ul>';
      inList = false;
    }
    if (line.trim()) {
      html += `<p class="my-1.5 text-xs text-slate-700 leading-relaxed">${line}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}

// 挂载到 window 供全局与内联使用
window.escapeHtml = escapeHtml;
window.renderMarkdown = renderMarkdown;
