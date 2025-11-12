import axios from 'axios';
import {store} from '../store/store';
import { logout, refreshToken } from '../features/auth/authSlice';
import { toast } from 'sonner';
 
// ✅ Base URL setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.29.17:3001/api';
 
// ✅ Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
 
// ✅ Attach Authorization header dynamically
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// ✅ Handle 401 Unauthorized errors
let isRefreshing = false;
let failedQueue: any[] = [];
 
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
 
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
 
    // When access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue up requests until refresh completes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
 
      originalRequest._retry = true;
      isRefreshing = true;
 
      try {
        const newToken = await store.dispatch(refreshToken()).unwrap();
        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        toast.error('Session expired, please login again.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
 
    // Other API errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
 
    return Promise.reject(error);
  }
);
 
export default apiClient;
 



