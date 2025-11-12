// import api from './api';
import apiClient  from './apiClient';
import { PurchaseOrder, PaginatedResponse, PurchaseOrderStatus } from '../types';

export const purchaseOrderService = {
  async getPurchaseOrders(
    page: number = 1, 
    limit: number = 10, 
    status?: PurchaseOrderStatus,
    vendorId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<PaginatedResponse<PurchaseOrder>> {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (vendorId) params.vendorId = vendorId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    const response = await apiClient.get('/purchases/purchase-orders', { params });
    return response.data;
  },

  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.get(`/purchases/purchase-orders/${id}`);
    return response.data;
  },

  async createPurchaseOrder(poData: any): Promise<PurchaseOrder> {
    const response = await apiClient.post('/purchases/purchase-orders', poData);
    return response.data;
  },

  async updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus): Promise<PurchaseOrder> {
    const response = await apiClient.patch(`/purchases/purchase-orders/${id}/status`, { status });
    return response.data;
  },

  async deletePurchaseOrder(id: string): Promise<void> {
    await apiClient.delete(`/purchases/purchase-orders/${id}`);
  }
};
