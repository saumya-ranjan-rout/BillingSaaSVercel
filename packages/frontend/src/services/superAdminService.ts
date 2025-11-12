import apiClient from './apiClient'; // your existing axios instance

export const superAdminService = {
  // Dashboard summary
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/super-admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching super admin dashboard stats:', error);
      throw error;
    }
  },

  // Fetch Users with filters
  async getUsersWithFilters(params: any) {
    const response = await apiClient.get('/super-admin/users', { params });
    return response.data;
  },

  // Fetch Tenants with filters
  async getTenantsWithFilters(params: any) {
    const response = await apiClient.get('/super-admin/tenants', { params });
    return response.data;
  },

  // Fetch Professionals with filters
  async getProfessionalsWithFilters(params: any) {
    const response = await apiClient.get('/super-admin/professionals', { params });
    return response.data;
  },

  // Export data for given resource
  async exportData(resource: string, format: 'csv' | 'json', filters: any) {
    const response = await apiClient.get(`/super-admin/${resource}/export`, {
      params: { ...filters, format },
      responseType: 'blob', // so you can download the file
    });
    return response.data;
  },

  // Fetch Audit Logs with filters
async getAuditLogsWithFilters(params: any) {
  const response = await apiClient.get('/super-admin/audit-logs', { params });
  return response.data;
},

};
