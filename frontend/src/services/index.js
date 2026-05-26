import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  getMe: () => api.get('/auth/me'),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  getStores: (params) => api.get('/admin/stores', { params }),
  createStore: (data) => api.post('/admin/stores', data),
};

export const storeService = {
  getStores: (params) => api.get('/stores', { params }),
};

export const ratingService = {
  createRating: (data) => api.post('/ratings', data),
  updateRating: (id, data) => api.put(`/ratings/${id}`, data),
};

export const ownerService = {
  getDashboard: () => api.get('/owner/dashboard'),
};
