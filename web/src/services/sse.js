/**
 * 统一 OpenAI 兼容 SSE 流式消费器
 * 支持 AbortController 主动中止与 requestAnimationFrame 合帧防抖渲染
 */

export async function streamChatSSE({ url, signal, onUpdate, onDone, onError }) {
  let thinkingText = '';
  let responseText = '';
  let hasError = false;
  let rafId = 0;
  let aborted = false;

  const emitUpdate = () => {
    rafId = 0;
    if (aborted) return;
    if (typeof onUpdate === 'function') {
      onUpdate({ thinking: thinkingText, content: responseText, hasError });
    }
  };

  const scheduleUpdate = () => {
    if (rafId) return;
    if (typeof requestAnimationFrame === 'function') {
      rafId = requestAnimationFrame(emitUpdate);
    } else {
      emitUpdate();
    }
  };

  const processLine = (rawLine) => {
    const line = rawLine.trim();
    if (!line || !line.startsWith('data:')) return;
    const dataStr = line.slice(5).trim();
    if (!dataStr || dataStr === '[DONE]') return;

    try {
      const parsed = JSON.parse(dataStr);
      if (parsed.error) {
        responseText += `\n> **服务提示**: ${parsed.error}\n`;
        hasError = true;
        scheduleUpdate();
      } else if (parsed.choices && parsed.choices.length > 0) {
        const delta = parsed.choices[0].delta || {};
        let dirty = false;
        if (delta.reasoning_content) {
          thinkingText += delta.reasoning_content;
          dirty = true;
        }
        if (delta.content) {
          responseText += delta.content;
          dirty = true;
        }
        if (dirty) scheduleUpdate();
      }
    } catch (_) {
      // 忽略心跳等非 JSON 帧
    }
  };

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    if (!response.body || typeof response.body.getReader !== 'function') {
      throw new Error('当前环境不支持流式响应读取');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        processLine(line);
      }
    }
    if (buffer.trim()) {
      processLine(buffer);
    }

    if (rafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (!aborted && typeof onUpdate === 'function') {
      onUpdate({ thinking: thinkingText, content: responseText, hasError });
    }
    if (!aborted && typeof onDone === 'function') {
      onDone({ thinking: thinkingText, content: responseText, hasError });
    }
    return { aborted: false, thinking: thinkingText, content: responseText, hasError };
  } catch (err) {
    if (rafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (err && err.name === 'AbortError') {
      aborted = true;
      return { aborted: true, thinking: thinkingText, content: responseText, hasError };
    }
    if (typeof onError === 'function') {
      onError(err, { thinking: thinkingText, content: responseText, hasError });
    }
    return { aborted: false, error: err, thinking: thinkingText, content: responseText, hasError: true };
  }
}
