/**
 * 视图路由分发器：解耦子视图 / 弹窗与 main.js 的循环依赖，替代 window.switchTab
 */

/** @type {(tab: string) => void} */
let tabSwitcher = () => {};

/**
 * 注册总入口的标签切换处理器
 * @param {(tab: string) => void} fn
 */
export function registerTabSwitcher(fn) {
  tabSwitcher = typeof fn === 'function' ? fn : () => {};
}

/**
 * 跳转到指定视图标签页
 * @param {string} tab
 */
export function navigateTab(tab) {
  tabSwitcher(tab);
}
