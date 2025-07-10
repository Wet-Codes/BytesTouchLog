import axios from 'axios';
import store from '@/store';

const api = axios.create({
  baseURL: 'http://192.168.1.6:2002'
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = store.state.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.dispatch('logout');
    }
    return Promise.reject(error);
  }
);

export default api;
