/**
 * 文本与 HTML 格式化工具 (escapeHtml, renderMarkdown)
 */

export function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(safeText) {
  return safeText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono text-neutral-800">$1</code>');
}

function isTableDivider(safeLine) {
  return /^\s*\|[\s:|\-]+\|\s*$/.test(safeLine) && safeLine.includes('-');
}

function splitTableCells(safeLine) {
  const trimmed = safeLine.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => renderInline(cell.trim()));
}

export function renderMarkdown(md) {
  if (!md) return '';

  const safe = escapeHtml(md).replace(/\r\n?/g, '\n');
  const lines = safe.split('\n');
  let html = '';
  let listTag = null; // 'ul' | 'ol' | null

  const closeList = () => {
    if (listTag) {
      html += `</${listTag}>`;
      listTag = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Markdown 表格检测（表头 + 分隔行）
    if (
      /^\|.*\|$/.test(trimmed) &&
      i + 1 < lines.length &&
      isTableDivider(lines[i + 1])
    ) {
      closeList();
      const headers = splitTableCells(trimmed);
      i += 1; // 跳过分隔行
      const rows = [];
      while (i + 1 < lines.length && /^\|.*\|$/.test(lines[i + 1].trim())) {
        i += 1;
        rows.push(splitTableCells(lines[i].trim()));
      }
      const thHtml = headers
        .map((h) => `<th class="text-left font-semibold text-neutral-700 px-2 py-1.5 border-b border-neutral-200 bg-neutral-50 whitespace-nowrap">${h}</th>`)
        .join('');
      const bodyHtml = rows
        .map((cells) => {
          const tdHtml = headers
            .map((_, idx) => `<td class="px-2 py-1.5 border-b border-neutral-100 text-neutral-700 align-top">${cells[idx] ?? ''}</td>`)
            .join('');
          return `<tr>${tdHtml}</tr>`;
        })
        .join('');
      html += `<div class="overflow-x-auto my-2 rounded-lg border border-neutral-200"><table class="w-full text-[11px] font-mono border-collapse"><thead><tr>${thHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
      continue;
    }

    // 分割线
    if (/^---+$/.test(trimmed)) {
      closeList();
      html += '<hr class="my-3 border-neutral-200">';
      continue;
    }

    // 标题
    const h3 = rawLine.match(/^###\s+(.*)$/);
    if (h3) {
      closeList();
      html += `<h3 class="font-bold text-neutral-800 text-sm mt-3 mb-1.5 pb-1 border-b border-neutral-100">${renderInline(h3[1])}</h3>`;
      continue;
    }
    const h2 = rawLine.match(/^##\s+(.*)$/);
    if (h2) {
      closeList();
      html += `<h2 class="font-bold text-neutral-900 text-base mt-4 mb-2">${renderInline(h2[1])}</h2>`;
      continue;
    }
    const h1 = rawLine.match(/^#\s+(.*)$/);
    if (h1) {
      closeList();
      html += `<h1 class="font-bold text-neutral-900 text-lg mt-4 mb-2">${renderInline(h1[1])}</h1>`;
      continue;
    }

    // 引用块（已经过 escapeHtml，'>' 已转为 '&gt;'）
    const quote = rawLine.match(/^&gt;\s?(.*)$/);
    if (quote) {
      closeList();
      html += `<blockquote class="border-l-2 border-neutral-300 pl-2.5 my-2 text-xs text-neutral-500 leading-relaxed">${renderInline(quote[1])}</blockquote>`;
      continue;
    }

    // 无序列表项 (- 或 *)
    const ul = rawLine.match(/^[*-]\s+(.*)$/);
    if (ul) {
      if (listTag !== 'ul') {
        closeList();
        html += '<ul class="list-disc pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">';
        listTag = 'ul';
      }
      html += `<li>${renderInline(ul[1])}</li>`;
      continue;
    }

    // 有序列表项 (1. 2. ...)
    const ol = rawLine.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      if (listTag !== 'ol') {
        closeList();
        html += '<ol class="list-decimal pl-5 my-1.5 space-y-1 text-neutral-700 text-xs leading-relaxed">';
        listTag = 'ol';
      }
      html += `<li>${renderInline(ol[1])}</li>`;
      continue;
    }

    // 普通段落
    closeList();
    if (trimmed) {
      html += `<p class="my-1.5 text-xs text-neutral-700 leading-relaxed">${renderInline(rawLine)}</p>`;
    }
  }

  closeList();
  return html;
}

