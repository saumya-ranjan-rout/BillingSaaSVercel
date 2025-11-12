import axios from 'axios';
import { SubscriptionPlan } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const tenantOnboardingService = {
  // Fetch all available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscription-plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Create tenant + assign subscription plan + payment
  async createTenantWithSubscription(data: {
    tenantData: any;
    planId: string;
    paymentMethodId: string;
    professionalId?: string | null;
  }): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/tenant/onboard`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }
};
