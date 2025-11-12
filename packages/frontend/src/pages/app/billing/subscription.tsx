import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
// import Button from '../../../components/common/Button';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '../../../store/hooks';
import { useGetSubscriptionQuery, useUpdateSubscriptionMutation } from '../../../services/endpoints/billingApi';
import { formatCurrency } from '../../../lib/utils';

const Subscription: React.FC = () => {
  const currentTenant = useAppSelector(state => state.auth.currentTenant);
  const { data: subscription, isLoading, error } = useGetSubscriptionQuery();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    if (subscription) {
      setSelectedPlan(subscription.plan);
    }
  }, [subscription]);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
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

  const handlePlanChange = async (planId: string) => {
    try {
      await updateSubscription({ plan: planId }).unwrap();
      setSelectedPlan(planId);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Plan</h1>
          <p className="text-gray-600 mb-8">
            Manage your subscription plan and billing preferences
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Failed to load subscription details. Please try again.
            </div>
          )}

          {subscription && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Plan</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                  </p>
                  <p className="text-gray-600">
                    {formatCurrency(subscription.amount)} per {subscription.interval}
                  </p>
                  {subscription.status === 'active' && (
                    <p className="text-green-600 text-sm mt-1">
                      Active until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={selectedPlan === plan.id || isUpdating}
                    className="w-full"
                    variant={selectedPlan === plan.id ? 'secondary' : 'primary'}
                  >
                    {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Usage Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Users</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription?.usage?.users || 0} / {subscription?.limits?.users || 'Unlimited'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Invoices This Month</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription?.usage?.invoices || 0} / {subscription?.limits?.invoices || 'Unlimited'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Storage Used</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {(subscription?.usage?.storage || 0).toFixed(2)} GB / {subscription?.limits?.storage || 'Unlimited'} GB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
