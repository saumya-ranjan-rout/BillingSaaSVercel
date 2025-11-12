import  apiClient  from './apiClient';

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string;
  phone: string;
  email: string;
  website: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  createdAt: string;
  updatedAt: string;
}

export const companyService = {
  async getCompany(tenantId: string): Promise<Company> {
    try {
      const response = await apiClient.get(`/company/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company details:', error);
      throw error;
    }
  },

  async updateCompany(tenantId: string, companyData: Partial<Company>): Promise<Company> {
    try {
      const response = await apiClient.put(`/company/${tenantId}`, companyData);
      return response.data;
    } catch (error) {
      console.error('Failed to update company details:', error);
      throw error;
    }
  },
};
