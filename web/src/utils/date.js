/**
 * HealthTrack 极简日期与时间工具函数集
 */

/**
 * 获取本地 YYYY-MM-DD 字符串（避免时区 offset 偏离）
 * @param {Date} [d]
 * @returns {string}
 */
export function localDateStr(d) {
  const dt = d instanceof Date ? d : new Date();
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

/**
 * 相对日期偏移 (天数)
 * @param {string} dateStr YYYY-MM-DD
 * @param {number} deltaDays
 * @returns {string}
 */
export function shiftDateStr(dateStr, deltaDays) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const t = new Date(y, m - 1, d);
  t.setDate(t.getDate() + deltaDays);
  return localDateStr(t);
}

/**
 * 获取前一天日期字符串
 * @param {string} dateStr YYYY-MM-DD
 * @returns {string}
 */
export function getPrevDateStr(dateStr) {
  return shiftDateStr(dateStr, -1);
}

/**
 * 跨日睡眠时长计算算法
 * @param {string} bedTime HH:mm
 * @param {string} wakeTime HH:mm
 * @returns {{ duration: number, bedMinutes: number }}
 */
export function calculateSleepDuration(bedTime, wakeTime) {
  if (!bedTime || !wakeTime) return { duration: 0, bedMinutes: 0 };
  const [bH, bM] = bedTime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);

  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 1440; // 跨过午夜
  }
  const duration = Number(((wakeMinutes - bedMinutes) / 60).toFixed(1));
  return { duration, bedMinutes };
}
