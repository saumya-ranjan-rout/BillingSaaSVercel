// packages/frontend/src/pages/app/billing/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubscriptionPlanCard from '../../../components/billing/SubscriptionPlanCard';
import PaymentForm from '../../../components/billing/PaymentForm';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  isPopular?: boolean;
}

const BillingPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

const fetchPlans = async () => {
  try {
    setLoadingPlans(true);
    const response = await axios.get('/api/subscription-plans');
//console.log("response",response.data);
    // Use API data if available, otherwise fallback to default plans
    const plans = (response.data && response.data.plans && response.data.plans.length > 0)
      ? response.data.plans
      : [
          {
            id: 'basic',
            name: 'Basic',
            price: 29,
            currency: 'INR',
            billingPeriod: 'month',
            features: [
              'Up to 10 users',
              '100 invoices per month',
              'Basic reporting',
              'Email support',
              '1GB storage'
            ]
          },
          {
            id: 'professional',
            name: 'Professional',
            price: 79,
            currency: 'INR',
            billingPeriod: 'month',
            features: [
              'Up to 50 users',
              'Unlimited invoices',
              'Advanced reporting',
              'Priority support',
              '10GB storage',
              'API access',
              'Custom branding'
            ]
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 199,
            currency: 'INR',
            billingPeriod: 'month',
            features: [
              'Unlimited users',
              'Unlimited invoices',
              'Advanced analytics',
              '24/7 dedicated support',
              '50GB storage',
              'Full API access',
              'White-label solution',
              'SAML SSO'
            ]
          }
        ];

    setPlans(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    // If API fails, also use default plans
    setPlans([
      {
        id: 'basic',
        name: 'Basic',
        price: 29,
        currency: 'INR',
        billingPeriod: 'month',
        features: [
          'Up to 10 users',
          '100 invoices per month',
          'Basic reporting',
          'Email support',
          '1GB storage'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 79,
        currency: 'INR',
        billingPeriod: 'month',
        features: [
          'Up to 50 users',
          'Unlimited invoices',
          'Advanced reporting',
          'Priority support',
          '10GB storage',
          'API access',
          'Custom branding'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199,
        currency: 'INR',
        billingPeriod: 'month',
        features: [
          'Unlimited users',
          'Unlimited invoices',
          'Advanced analytics',
          '24/7 dedicated support',
          '50GB storage',
          'Full API access',
          'White-label solution',
          'SAML SSO'
        ]
      }
    ]);
  } finally {
    setLoadingPlans(false);
  }
};


  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!selectedPlan) return;

    try {
      setPaymentLoading(true);

      const response = await axios.post('/api/billing/subscriptions', {
        planType: 'tenant', // or professional depending on logged-in user
        entityId: 'current-entity-id', // fetch current tenant/professional ID
        paymentMethod: 'card'
      });

      console.log('Subscription created:', response.data);
      setPaymentSuccess(true);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Payment success handling error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
    setSelectedPlan(null);
  };

  return (
      <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscriptions</h1>

      {loadingPlans ? (
        <p>Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              onSubscribe={() => handleSubscribe(plan)}
              loading={paymentLoading && selectedPlan?.id === plan.id}
            />
          ))}
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedPlan(null)}
            >
              &times;
            </button>
            <PaymentForm
              amount={selectedPlan.price}
              currency={selectedPlan.currency}
              description={`Subscription: ${selectedPlan.name}`}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              loading={paymentLoading}
            />
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div className="mt-6 bg-green-100 text-green-800 p-4 rounded">
          Payment successful! Your subscription is now active.
        </div>
      )}
    </div>
    </DashboardLayout>
  );
 
};

export default BillingPage;
