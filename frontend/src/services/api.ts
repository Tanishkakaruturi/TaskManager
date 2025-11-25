import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then(res => res.data),
};

export const employeesAPI = {
  getAll: () => api.get('/employees').then(res => res.data),
  getById: (id: number) => api.get(`/employees/${id}`).then(res => res.data),
  create: (data: any) => api.post('/employees', data).then(res => res.data),
  update: (id: number, data: any) => api.put(`/employees/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

export const tasksAPI = {
  getAll: (filters?: any) => api.get('/tasks', { params: filters }).then(res => res.data),
  getById: (id: number) => api.get(`/tasks/${id}`).then(res => res.data),
  create: (data: any) => api.post('/tasks', data).then(res => res.data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

export default api;
