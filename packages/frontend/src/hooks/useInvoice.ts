import { useState, useEffect } from 'react';
import { Invoice } from '../types';
import  apiClient  from '../services/apiClient';

export const useInvoice = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await apiClient.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      const response = await apiClient.post('/invoices', invoiceData);
      setInvoices([...invoices, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      const response = await apiClient.put(`/invoices/${id}`, invoiceData);
      setInvoices(invoices.map(inv => (inv.id === id ? response.data : inv)));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await apiClient.delete(`/invoices/${id}`);
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (error) {
      throw error;
    }
  };

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refreshInvoices: loadInvoices
  };
};
