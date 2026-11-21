/**
 * HealthTrack API 服务统一封装
 */

const BASE_URL = '';

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [status=0]
   * @param {number} [code=0]
   */
  constructor(message, status = 0, code = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * 统一请求封装：处理 JSON 信封错误码、FormData/二进制请求头与 HTTP 状态码
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const isBlob = typeof Blob !== 'undefined' && options.body instanceof Blob;

  /** @type {Record<string, string>} */
  const headers = {};
  if (options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)) {
    Object.assign(headers, options.headers);
  }
  const hasContentType = Object.keys(headers).some((k) => k.toLowerCase() === 'content-type');
  if (!isFormData && !isBlob && !hasContentType && options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');

  if (!response.ok) {
    let errMsg = `HTTP Error ${response.status}`;
    let errCode = 0;
    if (isJSON) {
      try {
        const errData = await response.json();
        errMsg = errData.message || errData.error || errMsg;
        if (typeof errData.code === 'number') errCode = errData.code;
      } catch (_) {}
    }
    throw new ApiError(errMsg, response.status, errCode);
  }

  if (isJSON) {
    const data = await response.json();
    if (data && typeof data === 'object' && typeof data.code === 'number' && data.code !== 200) {
      throw new ApiError(data.message || '请求失败', response.status, data.code);
    }
    return data;
  }
  return await response.text();
}

export const api = {
  // ── 记录相关 (Records) ──
  getHistoryRecords: (startDate, endDate) =>
    request(`/api/v1/records/history?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`),
  saveRecord: (payload) =>
    request('/api/v1/records', { method: 'POST', body: JSON.stringify(payload) }),

  // ── 配置相关 (Config) ──
  getConfig: () => request('/api/config'),
  saveConfig: (cfg) => request('/api/config', { method: 'POST', body: JSON.stringify(cfg) }),
  testAIConfig: (cfg) => request('/api/config/test', { method: 'POST', body: JSON.stringify(cfg) }),
  saveSleepThresholds: (thresholds) =>
    request('/api/config/sleep', { method: 'POST', body: JSON.stringify(thresholds) }),
  saveSummaryScoreBands: (scoreBands) =>
    request('/api/config/summary', { method: 'POST', body: JSON.stringify({ score_bands: scoreBands }) }),

  // ── AI 洞察与阶段对比 (Insights & Compare) ──
  checkInsightPeriod: (rangeDays, endDate, tzOffset = -new Date().getTimezoneOffset()) =>
    request(`/api/v1/insights/period?range_days=${rangeDays}&end_date=${encodeURIComponent(endDate)}&tz_offset=${tzOffset}`),
  getInsightHistory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/v1/insights${qs ? '?' + qs : ''}`);
  },
  getInsightDetail: (id) => request(`/api/v1/insights/${encodeURIComponent(String(id))}`),
  deleteInsight: (id) => request(`/api/v1/insights/${encodeURIComponent(String(id))}`, { method: 'DELETE' }),
  batchDeleteInsights: (ids) =>
    request('/api/v1/insights/batch-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
  checkComparePeriod: (monthA, monthB, tzOffset = -new Date().getTimezoneOffset()) =>
    request(`/api/v1/insights/compare/period?month_a=${encodeURIComponent(monthA)}&month_b=${encodeURIComponent(monthB)}&tz_offset=${tzOffset}`),

  // ── 睡前小结相关 (Evening) ──
  getEveningSummary: (dateStr) =>
    request(`/api/v1/evening/summary?date=${encodeURIComponent(dateStr)}`),
  getEveningSummaries: () => request('/api/v1/evening/summaries'),
  saveEveningSummary: (payload) =>
    request('/api/v1/evening/summary', { method: 'POST', body: JSON.stringify(payload) }),
  deleteEveningSummary: (dateStr) =>
    request(`/api/v1/evening/summary/${encodeURIComponent(dateStr)}`, { method: 'DELETE' }),
  uploadEveningPhoto: (dateStr, blob) =>
    request(`/api/v1/evening/photo?date=${encodeURIComponent(dateStr)}`, {
      method: 'POST',
      headers: { 'Content-Type': blob?.type || 'image/jpeg' },
      body: blob,
    }),
  deletePhoto: (photoId) => request(`/api/v1/evening/photo/${encodeURIComponent(String(photoId))}`, { method: 'DELETE' }),
  getEveningInsight: (dateStr) =>
    request(`/api/v1/evening/insight?date=${encodeURIComponent(dateStr)}`),
  deleteEveningInsight: (dateStr) =>
    request(`/api/v1/evening/insight?date=${encodeURIComponent(dateStr)}`, { method: 'DELETE' }),

  // ── 批量导入相关 (Import) ──
  previewImportFile: (formData) =>
    request('/api/v1/import/preview', { method: 'POST', body: formData }),
  previewImportMemo: (memo, yearBase) =>
    request('/api/v1/import/preview', { method: 'POST', body: JSON.stringify({ memo, year_base: yearBase }) }),
  confirmImport: (payload) =>
    request('/api/v1/import/confirm', { method: 'POST', body: JSON.stringify(payload) }),
  getImportBatches: (limit = 20) =>
    request(`/api/v1/import/batches?limit=${encodeURIComponent(String(limit))}`),
  getImportBatchDetail: (id) =>
    request(`/api/v1/import/batches/${encodeURIComponent(String(id))}`),
  retryImportBatch: (id) =>
    request(`/api/v1/import/batches/${encodeURIComponent(String(id))}/retry`, { method: 'POST' }),

  // ── 二进制下载辅助 ──
  fetchBlob: async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new ApiError(`HTTP ${res.status}`, res.status);
    return await res.blob();
  },
  probeContentLength: async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) return null;
      const len = Number(res.headers.get('Content-Length'));
      return Number.isFinite(len) && len > 0 ? len : null;
    } catch (_) {
      return null;
    }
  },
};
