import  apiClient  from './apiClient';

export const authService = {
  async login(email: string, password: string, tenantId: string) {
    const response = await apiClient.post('/auth/login', { email, password, tenantId });
    return response.data;
  },


  async register(userData: any) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async getTenantsForUser(email: string) {
    const response = await apiClient.get(`/auth/tenants/${email}`);
    return response.data;
  }
};
