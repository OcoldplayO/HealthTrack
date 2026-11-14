/**
 * 全局通用对话框与反馈工具 (appConfirm, appCopyText, appToast)
 * 替代原生 window.confirm/alert，兼容安卓 WebView 原生环境与桌面浏览器
 */
import { showToast } from '../components/Toast.js';

/**
 * 通用确认弹窗：返回 Promise<boolean>。用于替代原生 confirm()，
 * 原生对话框在安卓 WebView（未实现 onJsConfirm）恒返回 false，且在 IDE 内嵌浏览器会打断宿主组件树。
 */
export function appConfirm(message, options) {
  const opts = options || {};
  return new Promise((resolve) => {
    const modal = document.getElementById('app-confirm-modal');
    const titleEl = document.getElementById('app-confirm-title');
    const msgEl = document.getElementById('app-confirm-msg');
    const okBtn = document.getElementById('app-confirm-ok');
    const cancelBtn = document.getElementById('app-confirm-cancel');
    if (!modal) {
      resolve(false);
      return;
    }

    titleEl.innerText = opts.title || '请确认';
    msgEl.innerText = message || '';
    okBtn.innerText = opts.confirmText || '确定';
    if (opts.danger === false) {
      okBtn.className =
        'flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors';
    } else {
      okBtn.className =
        'flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors';
    }

    const cleanup = () => {
      modal.classList.add('hidden');
      okBtn.onclick = null;
      cancelBtn.onclick = null;
      modal.onclick = null;
    };
    okBtn.onclick = () => {
      cleanup();
      resolve(true);
    };
    cancelBtn.onclick = () => {
      cleanup();
      resolve(false);
    };
    modal.onclick = (e) => {
      if (e.target === modal) {
        cleanup();
        resolve(false);
      }
    };

    modal.classList.remove('hidden');
  });
}

/**
 * 复制文本：安卓端优先走原生剪贴板桥，其次 Clipboard API，最后 textarea + execCommand。
 */
export async function appCopyText(text) {
  if (window.HealthTrack && typeof window.HealthTrack.copyText === 'function') {
    try {
      window.HealthTrack.copyText(text);
      return true;
    } catch (e) {
      /* 继续走 Web API */
    }
  }
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* 回退到 execCommand */
  }
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

/**
 * 轻量提示条：替代原生 alert()，避免安卓端静默无提示。
 */
let appToastTimer = null;
export function appToast(message) {
  const el = document.getElementById('app-toast');
  if (el) {
    el.innerText = message || '';
    el.classList.remove('hidden');
    if (appToastTimer) clearTimeout(appToastTimer);
    appToastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
  } else {
    showToast(message, true);
  }
}

// 兼容挂载到 window，确保全局和模板内联可用
window.appConfirm = appConfirm;
window.appCopyText = appCopyText;
window.appToast = appToast;
