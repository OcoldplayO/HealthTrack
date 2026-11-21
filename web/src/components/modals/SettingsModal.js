/**
 * AI 服务与熬夜阈值设置弹窗组件 (SettingsModal)
 */
import { api } from '../../services/api.js';
import { showToast } from '../Toast.js';

export function renderSettingsModal(container) {
  const html = `
    <!-- AI 配置与熬夜阈值弹窗 -->
    <div id="settings-modal" class="hidden fixed inset-0 z-[60] bg-neutral-950/40 backdrop-blur-sm p-4 flex items-center justify-center">
      <section class="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            <h2 id="settings-title" class="font-bold text-neutral-900 text-sm">AI 服务设置</h2>
            <p class="text-[11px] font-mono text-neutral-400 mt-0.5">配置仅保存在本机私有目录</p>
          </div>
          <button id="btn-close-settings" aria-label="关闭设置" class="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors flex items-center justify-center font-mono">✕</button>
        </div>
        <div class="p-5 space-y-3.5">
          <div>
            <label for="setting-base-url" class="block text-xs font-mono font-medium text-neutral-600 mb-1">API Base URL</label>
            <input id="setting-base-url" type="url" placeholder="https://api.deepseek.com/v1" class="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
          </div>
          <div>
            <label for="setting-model" class="block text-xs font-mono font-medium text-neutral-600 mb-1">模型名称</label>
            <input id="setting-model" type="text" placeholder="deepseek-chat" class="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="setting-api-key" class="block text-xs font-mono font-medium text-neutral-600">API Key</label>
              <button type="button" id="toggle-api-key" class="text-xs font-mono text-neutral-500 hover:text-neutral-900">显示</button>
            </div>
            <input id="setting-api-key" type="password" autocomplete="off" placeholder="留空则保留当前 API Key" class="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
            <p id="api-key-status" class="text-[10px] font-mono text-neutral-400 mt-1">正在读取配置…</p>
          </div>
          <div class="pt-2 border-t border-neutral-100">
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-mono font-medium text-neutral-700">熬夜判定阈值</label>
              <span class="text-[10px] font-mono text-neutral-400">午夜 0 点填 00:00</span>
            </div>
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label for="setting-sleep-green" class="block text-[10px] font-mono text-neutral-500 mb-1">不熬夜截止线</label>
                <input id="setting-sleep-green" type="time" class="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
              </div>
              <div>
                <label for="setting-sleep-yellow" class="block text-[10px] font-mono text-neutral-500 mb-1">轻度熬夜截止线</label>
                <input id="setting-sleep-yellow" type="time" class="w-full border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-neutral-800 transition-colors">
              </div>
            </div>
            <button id="save-sleep-btn" type="button" class="mt-2.5 w-full py-2 rounded-lg bg-neutral-900 text-white font-mono font-medium text-xs hover:bg-neutral-800 transition-colors">保存熬夜阈值</button>
          </div>
          <p id="settings-feedback" class="hidden text-xs font-mono rounded-lg px-3 py-2"></p>
          <div class="grid grid-cols-2 gap-2.5 pt-1">
            <button id="test-config-btn" type="button" class="py-2 rounded-lg border border-neutral-200 text-neutral-700 font-mono font-medium text-xs hover:border-neutral-400 transition-colors">测试连接</button>
            <button id="save-config-btn" type="button" class="py-2 rounded-lg bg-neutral-900 text-white font-mono font-medium text-xs hover:bg-neutral-800 transition-colors">保存配置</button>
          </div>
        </div>
      </section>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  const modal = document.getElementById('settings-modal');
  const closeBtn = document.getElementById('btn-close-settings');
  const toggleKeyBtn = document.getElementById('toggle-api-key');
  const apiKeyInput = document.getElementById('setting-api-key');

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeSettings();
  });
  closeBtn?.addEventListener('click', closeSettings);

  toggleKeyBtn?.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      toggleKeyBtn.innerText = '隐藏';
    } else {
      apiKeyInput.type = 'password';
      toggleKeyBtn.innerText = '显示';
    }
  });

  document.getElementById('save-config-btn')?.addEventListener('click', saveConfig);
  document.getElementById('test-config-btn')?.addEventListener('click', testConfig);
  document.getElementById('save-sleep-btn')?.addEventListener('click', saveSleepThresholds);
}

export function openSettings() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  loadConfig();
}

export function closeSettings() {
  const modal = document.getElementById('settings-modal');
  modal?.classList.add('hidden');
}

async function loadConfig() {
  try {
    const res = await api.getConfig();
    const cfg = (res && res.data) ? res.data : (res || {});
    const urlEl = document.getElementById('setting-base-url');
    const modelEl = document.getElementById('setting-model');
    const statusEl = document.getElementById('api-key-status');

    if (urlEl) urlEl.value = cfg.base_url || '';
    if (modelEl) modelEl.value = cfg.model || '';
    if (statusEl) {
      statusEl.innerText = cfg.api_key_configured
        ? `当前 Key: ${cfg.api_key_masked}（留空可保留）`
        : '尚未配置 API Key';
    }

    const greenEl = document.getElementById('setting-sleep-green');
    const yellowEl = document.getElementById('setting-sleep-yellow');
    if (greenEl) greenEl.value = cfg.sleep_green_before || '23:30';
    if (yellowEl) yellowEl.value = cfg.sleep_yellow_before || '01:00';
  } catch (err) {
    showToast('读取设置失败: ' + err.message, false);
  }
}

async function saveConfig() {
  const urlEl = document.getElementById('setting-base-url');
  const modelEl = document.getElementById('setting-model');
  const keyEl = document.getElementById('setting-api-key');

  const payload = {
    base_url: urlEl?.value.trim() || '',
    model: modelEl?.value.trim() || '',
  };
  if (keyEl && keyEl.value.trim()) {
    payload.api_key = keyEl.value.trim();
  }

  try {
    await api.saveConfig(payload);
    showToast('AI 配置已更新');
    closeSettings();
  } catch (err) {
    showToast('保存失败: ' + err.message, false);
  }
}

async function testConfig() {
  const urlEl = document.getElementById('setting-base-url');
  const modelEl = document.getElementById('setting-model');
  const keyEl = document.getElementById('setting-api-key');
  const feedback = document.getElementById('settings-feedback');

  const payload = {
    base_url: urlEl?.value.trim() || '',
    model: modelEl?.value.trim() || '',
  };
  if (keyEl && keyEl.value.trim()) {
    payload.api_key = keyEl.value.trim();
  }

  if (feedback) {
    feedback.className = 'text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 text-neutral-600 block';
    feedback.innerText = '正在测试连接中…';
  }

  try {
    await api.testAIConfig(payload);
    if (feedback) {
      feedback.className = 'text-xs font-mono rounded-lg px-3 py-2 bg-neutral-900 text-white block';
      feedback.innerText = '✓ 测试连接成功！';
    }
  } catch (err) {
    if (feedback) {
      feedback.className = 'text-xs font-mono rounded-lg px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 block';
      feedback.innerText = '✕ 测试连接失败: ' + err.message;
    }
  }
}

async function saveSleepThresholds() {
  const greenEl = document.getElementById('setting-sleep-green');
  const yellowEl = document.getElementById('setting-sleep-yellow');
  const green = greenEl?.value || '23:30';
  const yellow = yellowEl?.value || '01:00';
  try {
    await api.saveSleepThresholds({
      green_before: green,
      yellow_before: yellow,
    });
    window.dispatchEvent(new CustomEvent('sleep-thresholds-updated', {
      detail: { green, yellow }
    }));
    showToast('熬夜阈值已保存并立即生效');
  } catch (err) {
    showToast('保存阈值失败: ' + err.message, false);
  }
}

// 挂载全局方法
window.openSettings = openSettings;
window.closeSettings = closeSettings;
