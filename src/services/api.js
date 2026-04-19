import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const aiAPI = {
  generate: (data) => api.post('/ai/generate', data),
};

export const historyAPI = {
  getAll: (params) => api.get('/history', { params }),
  getOne: (id) => api.get(`/history/${id}`),
  delete: (id) => api.delete(`/history/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  upgrade: () => api.post('/user/upgrade'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  updatePlan: (id, plan) => api.patch(`/admin/users/${id}/plan`, { plan }),
};

export default api;
