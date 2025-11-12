import  apiClient  from './apiClient';

export interface AdvancedSettings {
  invoiceNumberPrefix: string;
  invoiceNumberSequence: number;
  defaultDueDays: number;
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
invoiceCustomization: {
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
  termsAndConditions?: string;
};
notificationSettings: {
  invoiceCreated: boolean;
  invoicePaid: boolean;
  invoiceOverdue: boolean;
  monthlyReports: boolean;
  marketingEmails: boolean;
};

}

export interface CustomField {
  id: string;
  name: string;
  type: string;
  entityType: string;
  isRequired: boolean;
  options: string[];
  defaultValue: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const settingsService = {
  async getAdvancedSettings(tenantId: string): Promise<AdvancedSettings> {
    try {
      const response = await apiClient.get(`/settings/${tenantId}/advanced`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch advanced settings:', error);
      throw error;
    }
  },

  async updateAdvancedSettings(tenantId: string, settings: Partial<AdvancedSettings>): Promise<AdvancedSettings> {
    try {
      const response = await apiClient.put(`/settings/${tenantId}/advanced`, settings);
      return response.data;
    } catch (error) {
      console.error('Failed to update advanced settings:', error);
      throw error;
    }
  },

  async getCustomFields(tenantId: string, entityType?: string): Promise<CustomField[]> {
    try {
      const url = entityType 
        ? `/settings/${tenantId}/custom-fields?entityType=${entityType}`
        : `/settings/${tenantId}/custom-fields`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch custom fields:', error);
      throw error;
    }
  },

  async createCustomField(tenantId: string, field: Partial<CustomField>): Promise<CustomField> {
    try {
      const response = await apiClient.post(`/settings/${tenantId}/custom-fields`, field);
      return response.data;
    } catch (error) {
      console.error('Failed to create custom field:', error);
      throw error;
    }
  },

  async updateCustomField(tenantId: string, fieldId: string, field: Partial<CustomField>): Promise<CustomField> {
    try {
      const response = await apiClient.put(`/settings/${tenantId}/custom-fields/${fieldId}`, field);
      return response.data;
    } catch (error) {
      console.error('Failed to update custom field:', error);
      throw error;
    }
  },

  async deleteCustomField(tenantId: string, fieldId: string): Promise<void> {
    try {
      await apiClient.delete(`/settings/${tenantId}/custom-fields/${fieldId}`);
    } catch (error) {
      console.error('Failed to delete custom field:', error);
      throw error;
    }
  },

  async getApiKeys(tenantId: string): Promise<ApiKey[]> {
    try {
      const response = await apiClient.get(`/settings/${tenantId}/api-keys`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      throw error;
    }
  },

  async createApiKey(tenantId: string, apiKey: Partial<ApiKey>): Promise<ApiKey> {
    try {
      const response = await apiClient.post(`/settings/${tenantId}/api-keys`, apiKey);
      return response.data;
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  },

  async updateApiKey(tenantId: string, keyId: string, apiKey: Partial<ApiKey>): Promise<ApiKey> {
    try {
      const response = await apiClient.put(`/settings/${tenantId}/api-keys/${keyId}`, apiKey);
      return response.data;
    } catch (error) {
      console.error('Failed to update API key:', error);
      throw error;
    }
  },

  async deleteApiKey(tenantId: string, keyId: string): Promise<void> {
    try {
      await apiClient.delete(`/settings/${tenantId}/api-keys/${keyId}`);
    } catch (error) {
      console.error('Failed to delete API key:', error);
      throw error;
    }
  },

  async getAuditLogs(tenantId: string, page = 1, limit = 50): Promise<any[]> {
    try {
      const response = await apiClient.get(`/settings/${tenantId}/audit-logs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error;
    }
  },

  async exportData(tenantId: string, format: 'json' | 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/settings/${tenantId}/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  },

  async importData(tenantId: string, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await apiClient.post(`/settings/${tenantId}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  },
};
