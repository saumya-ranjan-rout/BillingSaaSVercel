import { authService } from './auth';

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = authService.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    let response: Response;

    try {
      response = await fetch(url, config);
    } catch (error) {
      console.error('Network error:', error);
      throw new Error('Network error occurred');
    }

    // Handle token expiration
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      const newToken = await authService.refreshAuthToken();

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...config, headers });
      } else {
        authService.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login?session_expired=true';
        }
        throw new Error('Authentication required');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient();
























// import axios from 'axios';

// // Create axios instance with optimized settings
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api',
//   timeout: 10000,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for auth tokens
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Add cache busting for GET requests
//     if (config.method === 'get') {
//       config.params = {
//         ...config.params,
//         _: Date.now(), // Cache busting
//       };
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling and caching
// api.interceptors.response.use(
//   (response) => {
//     // Cache successful GET responses
//     if (response.config.method === 'get' && response.status === 200) {
//       const url = response.config.url;
//       if (url) {
//         const cacheKey = `api_cache_${btoa(url)}`;
//         const data = {
//           data: response.data,
//           timestamp: Date.now(),
//         };
//         localStorage.setItem(cacheKey, JSON.stringify(data));
//       }
//     }

//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }
    
//     if (error.response?.status === 429) {
//       // Handle rate limiting
//       console.warn('Rate limit exceeded, retrying...');
//     }

//     return Promise.reject(error);
//   }
// );

// // Cache wrapper function
// const withCache = async (key: string, fn: () => Promise<any>, ttl: number = 300000) => {
//   const cacheKey = `api_cache_${btoa(key)}`;
//   const cached = localStorage.getItem(cacheKey);
  
//   if (cached) {
//     const { data, timestamp } = JSON.parse(cached);
//     if (Date.now() - timestamp < ttl) {
//       return data;
//     }
//   }

//   const freshData = await fn();
//   return freshData;
// };

// export { api, withCache };
