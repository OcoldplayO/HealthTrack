/**
 * 类型安全的 DOM 查询与事件委托辅助函数
 * 用于替代松散的强制类型转换，满足 checkJs 静态类型检查
 */

/**
 * @param {string} id
 * @returns {HTMLElement | null}
 */
export function byId(id) {
  return document.getElementById(id);
}

/**
 * @param {string} id
 * @returns {HTMLInputElement | null}
 */
export function inputById(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLInputElement ? el : null;
}

/**
 * @param {string} id
 * @returns {HTMLTextAreaElement | null}
 */
export function textareaById(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLTextAreaElement ? el : null;
}

/**
 * @param {string} id
 * @returns {HTMLSelectElement | null}
 */
export function selectById(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLSelectElement ? el : null;
}

/**
 * @param {string} id
 * @returns {HTMLButtonElement | null}
 */
export function buttonById(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLButtonElement ? el : null;
}

/**
 * @param {string} id
 * @returns {HTMLCanvasElement | null}
 */
export function canvasById(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLCanvasElement ? el : null;
}

/**
 * @param {string} id
 * @returns {HTMLImageElement | null}
 */
export function imgById(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLImageElement ? el : null;
}

/**
 * 从事件 target 安全向上查找匹配的 Element
 * @param {EventTarget | null} target
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
export function closestEl(target, selector) {
  if (!(target instanceof Element)) return null;
  const matched = target.closest(selector);
  return matched instanceof HTMLElement ? matched : null;
}
