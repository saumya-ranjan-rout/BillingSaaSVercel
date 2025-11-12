// src/types/razorpay.d.ts
declare module "razorpay" {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  // ---------- Order ----------
  interface OrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    payment_capture?: 1 | 0;
    notes?: Record<string, any>;
  }

  interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number | string;
    currency: string;
    receipt: string;
    status: string;
  }

  // ---------- Subscription ----------
  interface SubscriptionOptions {
    plan_id: string;
    customer_notify?: 1 | 0;
    total_count: number;
    notes?: Record<string, any>;
  }

  interface RazorpaySubscription {
    id: string;
    plan_id: string;
    status: string;
    current_start?: number;
    current_end?: number;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);

    orders: {
      create(options: OrderOptions): Promise<RazorpayOrder>;
    };

    payments: {
      capture(paymentId: string, amount: number, currency: string): Promise<any>;
    };

    subscriptions: {
      create(options: SubscriptionOptions): Promise<RazorpaySubscription>;
    };
  }

  export = Razorpay;
}
