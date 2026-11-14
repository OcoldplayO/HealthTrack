/**
 * HealthTrack 极简状态管理中心 (Pub/Sub Store)
 */
import { localDateStr } from '../utils/date.js';

class AppStore {
  constructor() {
    this._state = {
      currentTab: 'log',
      currentDate: localDateStr(new Date()),
      isDirty: false,
      hasSavedRecord: false,
      dashRange: 7,
      sleepThresholds: {
        green: '23:30',
        yellow: '01:00',
      },
    };
    this._listeners = new Set();
  }

  get state() {
    return this._state;
  }

  set(partial) {
    const prevState = { ...this._state };
    this._state = { ...this._state, ...partial };
    this._notify(this._state, prevState);
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify(newState, prevState) {
    this._listeners.forEach((fn) => {
      try {
        fn(newState, prevState);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    });
  }
}

export const store = new AppStore();

// 全局响应式 currentTab 属性，兼容老代码中的裸 currentTab 访问
try {
  Object.defineProperty(window, 'currentTab', {
    get() {
      return store.state.currentTab || 'log';
    },
    set(v) {
      store.set({ currentTab: v });
    },
    configurable: true,
  });
} catch (e) {
  window.currentTab = 'log';
}
