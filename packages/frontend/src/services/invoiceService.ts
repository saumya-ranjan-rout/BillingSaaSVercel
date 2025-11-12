import  apiClient  from './apiClient';
import { Customer } from '../types';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  price: number;
  gstRate: number;
  gstType: 'cgst_sgst' | 'igst';
  amount: number;
  taxAmount: number;
}

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await apiClient.get('/invoices');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  },

  async getInvoice(id: string): Promise<Invoice> {
    try {
      const response = await apiClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  async createInvoice(invoiceData: any): Promise<Invoice> {
    try {
      const response = await apiClient.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  },

  async updateInvoice(id: string, invoiceData: any): Promise<Invoice> {
    try {
      const response = await apiClient.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    try {
      await apiClient.delete(`/invoices/${id}`);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  },

  async sendInvoice(id: string): Promise<void> {
    try {
      await apiClient.post(`/invoices/${id}/send`);
    } catch (error) {
      console.error('Failed to send invoice:', error);
      throw error;
    }
  },
};
