import  apiClient  from './apiClient';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  gstRate: number;
  gstType: 'cgst_sgst' | 'igst';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },

  async createProduct(productData: any): Promise<Product> {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: any): Promise<Product> {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
};
