import { SubscriptionPlan, PlanType } from '../types';

export const professionalOnboardingService = {
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    // ✅ Type-safe structured data
    return [
      {
        id: 'basic',
        name: 'Basic Plan',
        description: 'For freelancers and individuals',
        price: 499,
        planType: PlanType.BASIC,
        features: {
          maxUsers: 1,
          maxStorage: 5,
          gstFiling: false,
          taxFiling: false,
          advancedReporting: false,
        },
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        description: 'For growing teams and small businesses',
        price: 999,
        planType: PlanType.PREMIUM,
        features: {
          maxUsers: 5,
          maxStorage: 50,
          gstFiling: true,
          taxFiling: true,
          advancedReporting: false,
        },
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations and enterprises',
        price: 2499,
        planType: PlanType.ENTERPRISE,
        features: {
          maxUsers: 999,
          maxStorage: 1000,
          gstFiling: true,
          taxFiling: true,
          advancedReporting: true,
        },
      },
    ];
  },

  async onboardTenant({
    tenantData,
    planId,
    paymentMethodId,
  }: {
    tenantData: any;
    planId: string;
    paymentMethodId: string;
  }) {
    console.log('🟢 Onboarding Tenant:', { tenantData, planId, paymentMethodId });

    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1000));

    // In a real app, replace with a POST request to your backend API
    // Example:
    // return api.post('/onboard', { tenantData, planId, paymentMethodId });

    return { success: true };
  },
};
