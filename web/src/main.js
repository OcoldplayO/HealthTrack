/**
 * HealthTrack 现代化模块架构总入口 (main.js)
 * 极简极客风、JetBrains Mono、单线美学
 */
import './css/app.css';
import { initToast } from './components/Toast.js';
import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderSettingsModal } from './components/modals/SettingsModal.js';
import { renderDataSheetModal } from './components/modals/DataSheetModal.js';
import { renderOtherModals } from './components/modals/OtherModals.js';
import { initLogView } from './views/log/log-controller.js';
import { initDashView, activateDash } from './views/dash/dash-controller.js';
import { initInsightView, activateInsight } from './views/insight/insight-controller.js';
import { initEveningView, activateEvening } from './views/evening/evening-controller.js';
import { store } from './services/state.js';

export function switchTab(tab) {
  store.set({ currentTab: tab });

  // 视图显隐切换
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

  // 激活对应视图的数据加载
  if (tab === 'dash') activateDash();
  else if (tab === 'insight') activateInsight();
  else if (tab === 'evening') activateEvening();
}

window.switchTab = switchTab;

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
