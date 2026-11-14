/**
 * HealthTrack 主入口文件 (main.js)
 */
import './css/app.css';
import { initToast } from './components/Toast.js';
import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderSettingsModal } from './components/modals/SettingsModal.js';
import { renderDataSheetModal } from './components/modals/DataSheetModal.js';
import { initLogView } from './views/log/log-controller.js';
import { store } from './services/state.js';

document.addEventListener('DOMContentLoaded', () => {
  const frame = document.getElementById('app-frame');
  const main = document.getElementById('main-content');

  // 1. 初始化全局 Toast 与弹窗
  initToast();
  renderHeader(frame);
  renderBottomNav(frame, (tab) => {
    store.set({ currentTab: tab });
    // 切换视图逻辑
  });
  renderSettingsModal(document.body);
  renderDataSheetModal(document.body);

  // 2. 默认加载「记一笔」核心视图
  initLogView(main);
});
