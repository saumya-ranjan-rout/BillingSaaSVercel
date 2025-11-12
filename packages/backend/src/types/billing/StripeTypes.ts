export enum PlanType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export interface SubscriptionPlan {
  planType: PlanType;
  price: number; // monthly/annual price
  billingCycle: 'month' | 'year'; // or Stripe’s `interval` type
}
