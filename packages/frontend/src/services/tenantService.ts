import  apiClient  from './apiClient';

export const tenantService = {
  async getCurrentTenant() {
    const response = await apiClient.get('/tenant');
    return response.data;
  },

  async updateTenant(data: any) {
    const response = await apiClient.put('/tenant', data);
    return response.data;
  },

  async getBillingInfo() {
    const response = await apiClient.get('/tenant/billing');
    return response.data;
  },

  async updateBillingInfo(data: any) {
    const response = await apiClient.put('/tenant/billing', data);
    return response.data;
  },

  async getSubscription() {
    const response = await apiClient.get('/tenant/subscription');
    return response.data;
  },

  async updateSubscription(plan: string) {
    const response = await apiClient.put('/tenant/subscription', { plan });
    return response.data;
  }
};
