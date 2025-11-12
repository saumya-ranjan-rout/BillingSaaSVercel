import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check if token is about to expire and refresh if needed
    if (authService.isTokenExpiringSoon()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await authService.refreshAuthToken();
          if (newToken) {
            processQueue(null, newToken);
          } else {
            processQueue(new Error('Token refresh failed'), null);
            // Redirect to login if refresh fails
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
          }
        } catch (error) {
          processQueue(error, null);
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        } finally {
          isRefreshing = false;
        }
      }

      // Wait for token refresh if currently refreshing
      return new Promise((resolve, reject) => {
        failedQueue.push({ 
          resolve: (token) => {
            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            resolve(config);
          }, 
          reject 
        });
      });
    }

    // Add current token to request
    const token = authService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshAuthToken();
        if (newToken) {
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          authService.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
