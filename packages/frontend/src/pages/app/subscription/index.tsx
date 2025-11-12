'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { SubscriptionPlans } from '../../../components/subscription/SubscriptionPlans';
import { PaymentModal } from '../../../components/subscription/PaymentModal';
import { useApi } from '../../../hooks/useApi';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxTenants: number;
  maxBusinesses: number;
  maxUsers: number;
  features: string[];
  isActive: boolean;
}

export default function SubscriptionPage() {
  const { get, post } = useApi<any>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [order, setOrder] = useState<{ id: string; amount: number; currency: string } | null>(null);
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);

  // Load plans + history
const fetchPlans = async () => {
  try {
    const response = await get('/api/subscriptions/plans');

    if (response?.success) {
      console.log('data', response);

      const result = response.data || {};

      setPlans(result.plans || []);
      setHistory(result.history || []);
      setCurrentPlan(result.currentPlan || null);
    } else {
      toast.error(response?.message || 'Failed to load subscription plans');
    }
  } catch (error: any) {
    console.error('Failed to load subscription plans:', error);
    toast.error(error?.message || 'Failed to load subscription plans');
  }
};


  useEffect(() => {
    fetchPlans();
  }, [get]);

  // Subscribe handler -> create-order
  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      setSelectedPlanId(planId);

 
      const data = await post('/api/subscriptions/create-order', { planId });

      if (!data?.orderId) throw new Error('Invalid order response');

      setOrder({
        id: data.orderId,
        amount: data.amount,
        currency: data.currency,
      });

      setPaymentId(data.paymentId || '');
      setIsPaymentOpen(true);
    } catch (error: any) {
      console.error('Error starting payment:', error);
      // toast.error(error?.message || 'Failed to start payment');
      toast.error(error?.response?.data?.error || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // On payment success: refresh plans & history
  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);
    toast.success('Payment successful!');
    await fetchPlans();
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>

        <SubscriptionPlans
          plans={plans}
          currentPlan={currentPlan || undefined}
          history={history}
          onSubscribe={handleSubscribe}
          isLoading={loading}
        />

        {order && (
          <PaymentModal
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            onSuccess={handlePaymentSuccess}
            order={order}
            paymentId={paymentId}
          />
        )}
      </div>
    </DashboardLayout>
  );
}














