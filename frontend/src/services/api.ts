import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const logsAPI = {
  upload: (file?: File, rawLogs?: string) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (rawLogs) formData.append('raw_logs', rawLogs);
    return api.post('/logs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  generateSample: () => api.post('/logs/sample'),
  getLogs: (limit?: number) => api.get('/logs', { params: { limit } }),
};

export const analyzeAPI = {
  analyze: (logs: any[]) => api.post('/analyze', logs),
  quickAnalyze: () => api.get('/analyze/quick'),
};

export const threatsAPI = {
  getThreats: () => api.get('/threats'),
  getStats: () => api.get('/threats/stats'),
};

export const reportsAPI = {
  getReports: () => api.get('/reports'),
  downloadReport: () => api.get('/reports/download', { responseType: 'blob' }),
};

export default api;
