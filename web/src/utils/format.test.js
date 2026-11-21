import { describe, it, expect } from 'vitest';
import { escapeHtml, renderMarkdown } from './format.js';

describe('escapeHtml', () => {
  it('escapes HTML meta characters and handles nullish inputs', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(`<script>alert("x&'y'")</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&amp;&#39;y&#39;&quot;)&lt;/script&gt;'
    );
  });
});

describe('renderMarkdown', () => {
  it('returns empty string for empty markdown', () => {
    expect(renderMarkdown('')).toBe('');
  });

  it('renders headings, emphasis, inline code, lists, blockquotes, and hr', () => {
    const md = [
      '# 一级标题',
      '## 二级标题',
      '### 三级标题',
      '普通 **加粗** 和 `code_1` 段落',
      '> 引用说明',
      '---',
      '- 无序一',
      '* 无序二',
      '1. 有序一',
      '2. 有序二',
    ].join('\n');

    const html = renderMarkdown(md);
    expect(html).toContain('<h1 ');
    expect(html).toContain('<h2 ');
    expect(html).toContain('<h3 ');
    expect(html).toContain('<strong>加粗</strong>');
    expect(html).toContain('<code ');
    expect(html).toContain('code_1</code>');
    expect(html).toContain('<blockquote ');
    expect(html).toContain('引用说明</blockquote>');
    expect(html).toContain('<hr ');
    expect(html).toContain('<ul ');
    expect(html).toContain('<li>无序一</li>');
    expect(html).toContain('<ol ');
    expect(html).toContain('<li>有序二</li>');
  });

  it('renders GFM tables with header alignment and inline formatting', () => {
    const md = [
      '| 指标 | 数值 |',
      '| :--- | ---: |',
      '| 体重 | **72.1** kg |',
      '| 步数 | `8500` |',
    ].join('\n');

    const html = renderMarkdown(md);
    expect(html).toContain('<table ');
    expect(html).toContain('<th ');
    expect(html).toContain('指标</th>');
    expect(html).toContain('<strong>72.1</strong> kg');
    expect(html).toContain('8500</code>');
  });

  it('prevents raw HTML script injection inside markdown', () => {
    const html = renderMarkdown('测试 <img src=x onerror="alert(1)">');
    expect(html).not.toContain('<img ');
    expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});
