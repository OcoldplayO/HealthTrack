/**
 * HealthTrack 现代化模块架构总入口 (main.js)
 * 极简极客风、JetBrains Mono、单线美学
 */
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './css/app.css';
import { initToast } from './components/Toast.js';
import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderSettingsModal, closeSettings } from './components/modals/SettingsModal.js';
import { renderDataSheetModal, closeDataSheet } from './components/modals/DataSheetModal.js';
import {
  renderOtherModals,
  closeExport,
  closeImport,
  closeMemo,
  closeBatches,
} from './components/modals/OtherModals.js';
import { initLogView } from './views/log/log-controller.js';
import {
  initDashView,
  activateDash,
  activateTrend,
  activateTrendDetail,
} from './views/dash/dash-controller.js';
import {
  initInsightView,
  activateInsight,
  activateCompare,
  cmpBack,
} from './views/insight/insight-controller.js';
import {
  initEveningView,
  activateEvening,
  closeEveningPhoto,
} from './views/evening/evening-controller.js';
import { registerTabSwitcher } from './services/router.js';
import { store } from './services/state.js';

export function switchTab(tab) {
  store.set({ currentTab: tab });

  const allViews = ['log', 'dash', 'trend', 'trend-detail', 'insight', 'history', 'compare', 'evening'];
  allViews.forEach((t) => {
    const el = document.getElementById(`view-${t}`);
    if (el) {
      if (t === tab) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // 吸底保存条只在「记一笔」出现
  const saveBar = document.getElementById('save-bar');
  if (saveBar) {
    saveBar.classList.toggle('hidden', tab !== 'log');
  }

  // 离开「60天详情」时收回手机框的放宽态
  const frame = document.getElementById('app-frame');
  if (frame && tab !== 'trend-detail') {
    frame.classList.remove('frame-wide');
  }

  // 激活对应视图的数据加载
  if (tab === 'dash') activateDash();
  else if (tab === 'trend') activateTrend();
  else if (tab === 'trend-detail') activateTrendDetail();
  else if (tab === 'insight') activateInsight();
  else if (tab === 'compare') activateCompare();
  else if (tab === 'evening') activateEvening();
}

registerTabSwitcher(switchTab);

function isVisibleModal(id) {
  const el = document.getElementById(id);
  return !!(el && !el.classList.contains('hidden'));
}

export function handleNativeBack() {
  if (isVisibleModal('ev-photo-viewer')) {
    closeEveningPhoto();
    return true;
  }
  if (isVisibleModal('app-confirm-modal')) {
    document.getElementById('app-confirm-cancel')?.click();
    return true;
  }
  if (isVisibleModal('settings-modal')) {
    closeSettings();
    return true;
  }
  if (isVisibleModal('data-sheet')) {
    closeDataSheet();
    return true;
  }
  if (isVisibleModal('export-modal')) {
    closeExport();
    return true;
  }
  if (isVisibleModal('import-modal')) {
    closeImport();
    return true;
  }
  if (isVisibleModal('memo-import-modal')) {
    closeMemo();
    return true;
  }
  if (isVisibleModal('import-batches-modal')) {
    closeBatches();
    return true;
  }

  const tab = store.state.currentTab || 'log';
  if (tab === 'compare') {
    cmpBack();
    return true;
  }
  if (tab === 'history') {
    switchTab('insight');
    return true;
  }
  if (tab === 'trend' || tab === 'trend-detail') {
    switchTab('dash');
    return true;
  }
  return false;
}

// 原生 Android 返回键桥接回调
window.handleNativeBack = handleNativeBack;

document.addEventListener('DOMContentLoaded', () => {
  const frame = document.getElementById('app-frame');
  const main = document.getElementById('main-content');

  // 1. 初始化 Toast 与全域通用弹窗
  initToast();
  renderHeader(frame);
  renderBottomNav(frame, (tab) => switchTab(tab));
  renderSettingsModal(document.body);
  renderDataSheetModal(document.body);
  renderOtherModals(document.body);

  // 2. 初始化 4 大核心视图
  initLogView(main);
  initDashView(main);
  initInsightView(main);
  initEveningView(main);

  // 3. 初始展示「记一笔」
  switchTab('log');
});
