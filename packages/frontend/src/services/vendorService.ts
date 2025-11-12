// import api from './api';
import  apiClient  from './apiClient';
import { Vendor, PaginatedResponse } from '../types';

export const vendorService = {
  async getVendors(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    isActive?: boolean
  ): Promise<PaginatedResponse<Vendor>> {
    const params: any = { page, limit };
    if (search) params.search = search;
    if (isActive !== undefined) params.isActive = isActive;
    
    const response = await apiClient.get('/purchases/vendors', { params });
    return response.data;
  },

  async getVendor(id: string): Promise<Vendor> {
    const response = await apiClient.get(`/purchases/vendors/${id}`);
    return response.data;
  },

  async createVendor(vendorData: any): Promise<Vendor> {
    const response = await apiClient.post('/purchases/vendors', vendorData);
    return response.data;
  },

  async updateVendor(id: string, vendorData: any): Promise<Vendor> {
    const response = await apiClient.put(`/purchases/vendors/${id}`, vendorData);
    return response.data;
  },

  async deleteVendor(id: string): Promise<void> {
    await apiClient.delete(`/purchases/vendors/${id}`);
  }
};
