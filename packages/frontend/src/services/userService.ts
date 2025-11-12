import  apiClient  from './apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  hasAcceptedInvitation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserInvitation {
  email: string;
  role: string;
  permissions: string[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  user?: User;
}

export const userService = {
  async getUsers(tenantId: string): Promise<User[]> {
    try {
      const response = await apiClient.get(`/users/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  async getUser(tenantId: string, userId: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${tenantId}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  async createUser(tenantId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.post(`/users/${tenantId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async updateUser(tenantId: string, userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put(`/users/${tenantId}/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  async deleteUser(tenantId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${tenantId}/${userId}`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },

  async inviteUser(tenantId: string, invitation: UserInvitation): Promise<void> {
    try {
      await apiClient.post(`/users/${tenantId}/invite`, invitation);
    } catch (error) {
      console.error('Failed to invite user:', error);
      throw error;
    }
  },

  async resendInvitation(tenantId: string, userId: string): Promise<void> {
    try {
      await apiClient.post(`/users/${tenantId}/${userId}/resend-invitation`);
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      throw error;
    }
  },

  async getActivityLogs(tenantId: string, page = 1, limit = 50): Promise<ActivityLog[]> {
    try {
      const response = await apiClient.get(`/users/${tenantId}/activity-logs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      throw error;
    }
  },

  async updateUserPermissions(tenantId: string, userId: string, permissions: string[]): Promise<User> {
    try {
      const response = await apiClient.put(`/users/${tenantId}/${userId}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      console.error('Failed to update user permissions:', error);
      throw error;
    }
  },
};
