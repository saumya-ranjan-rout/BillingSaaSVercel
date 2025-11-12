import apiClient  from './apiClient';

export interface TaxSettings {
  defaultGstRate: number;
  igstEnabled: boolean;
  hsnCodes: HsnCode[];
}

export interface HsnCode {
  id: string;
  code: string;
  description: string;
  gstRate: number;
  createdAt: string;
  updatedAt: string;
}

export const taxService = {
  async getTaxSettings(tenantId: string): Promise<TaxSettings> {
    try {
      const response = await apiClient.get(`/tax/settings/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tax settings:', error);
      throw error;
    }
  },

  async updateTaxSettings(tenantId: string, settings: Partial<TaxSettings>): Promise<TaxSettings> {
    try {
      const response = await apiClient.put(`/tax/settings/${tenantId}`, settings);
      return response.data;
    } catch (error) {
      console.error('Failed to update tax settings:', error);
      throw error;
    }
  },

  async getHsnCodes(tenantId: string): Promise<HsnCode[]> {
    try {
      const response = await apiClient.get(`/tax/hsn-codes/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch HSN codes:', error);
      throw error;
    }
  },

  async addHsnCode(tenantId: string, hsnCode: Omit<HsnCode, 'id' | 'createdAt' | 'updatedAt'>): Promise<HsnCode> {
    try {
      const response = await apiClient.post(`/tax/hsn-codes/${tenantId}`, hsnCode);
      return response.data;
    } catch (error) {
      console.error('Failed to add HSN code:', error);
      throw error;
    }
  },

  async updateHsnCode(tenantId: string, codeId: string, hsnCode: Partial<HsnCode>): Promise<HsnCode> {
    try {
      const response = await apiClient.put(`/tax/hsn-codes/${tenantId}/${codeId}`, hsnCode);
      return response.data;
    } catch (error) {
      console.error('Failed to update HSN code:', error);
      throw error;
    }
  },

  async deleteHsnCode(tenantId: string, codeId: string): Promise<void> {
    try {
      await apiClient.delete(`/tax/hsn-codes/${tenantId}/${codeId}`);
    } catch (error) {
      console.error('Failed to delete HSN code:', error);
      throw error;
    }
  },
};
