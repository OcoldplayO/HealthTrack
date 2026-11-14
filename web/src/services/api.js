/**
 * HealthTrack API 服务统一封装
 */

const BASE_URL = '';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      errMsg = errData.message || errData.error || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

export const api = {
  // ── 记录相关 (Records) ──
  getHistoryRecords: (startDate, endDate) => request(`/api/v1/records/history?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`),
  saveRecord: (payload) => request('/api/v1/records', { method: 'POST', body: JSON.stringify(payload) }),

  // ── 配置相关 (Config) ──
  getConfig: () => request('/api/config'),
  saveConfig: (cfg) => request('/api/config', { method: 'POST', body: JSON.stringify(cfg) }),
  testAIConfig: (cfg) => request('/api/config/test', { method: 'POST', body: JSON.stringify(cfg) }),
  saveSleepThresholds: (thresholds) => request('/api/config/sleep', { method: 'POST', body: JSON.stringify(thresholds) }),

  // ── AI 洞察相关 (Insights) ──
  checkInsightPeriod: (days, endDate) => request(`/api/v1/insights/period?days=${days}&end_date=${encodeURIComponent(endDate)}`),
  getInsightHistory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/v1/insights${qs ? '?' + qs : ''}`);
  },
  deleteInsight: (id) => request(`/api/v1/insights/${id}`, { method: 'DELETE' }),

  // ── 睡前小结相关 (Evening) ──
  getEveningSummary: (dateStr) => request(`/api/v1/evening/summary?date=${encodeURIComponent(dateStr)}`),
  saveEveningSummary: (payload) => request('/api/v1/evening/summary', { method: 'POST', body: JSON.stringify(payload) }),
  deleteEveningSummary: (dateStr) => request(`/api/v1/evening/summary?date=${encodeURIComponent(dateStr)}`, { method: 'DELETE' }),
  uploadPhoto: async (formData) => {
    const res = await fetch(`${BASE_URL}/api/v1/evening/photo`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('上传图片失败');
    return await res.json();
  },
  deletePhoto: (photoId) => request(`/api/v1/evening/photo/${photoId}`, { method: 'DELETE' }),
};
