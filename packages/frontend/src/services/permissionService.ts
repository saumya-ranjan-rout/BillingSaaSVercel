// src/services/permissionService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const permissionService = {
  async getResourcePermissions(tenantId: string, resourceType: string, resourceId: string) {
    const { data } = await axios.get(
      `${API_BASE_URL}/permissions/${tenantId}/${resourceType}/${resourceId}`
    );
    return data;
  },

  async getAvailableUsers(tenantId: string) {
    const { data } = await axios.get(`${API_BASE_URL}/permissions/${tenantId}/users`);
    return data;
  },

  async addPermission(
    tenantId: string,
    payload: { resourceType: string; resourceId: string; userId: string; role: string }
  ) {
    const { data } = await axios.post(`${API_BASE_URL}/permissions/${tenantId}`, payload);
    return data;
  },

  async updatePermission(
    tenantId: string,
    permissionId: string,
    payload: { role: string }
  ) {
    const { data } = await axios.put(
      `${API_BASE_URL}/permissions/${tenantId}/${permissionId}`,
      payload
    );
    return data;
  },

  async removePermission(tenantId: string, permissionId: string) {
    const { data } = await axios.delete(`${API_BASE_URL}/permissions/${tenantId}/${permissionId}`);
    return data;
  },
};
