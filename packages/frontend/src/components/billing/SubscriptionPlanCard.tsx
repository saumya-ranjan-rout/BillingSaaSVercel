import React from 'react';
import { Button } from '@/components/ui/Button';

interface SubscriptionPlanCardProps {
  plan: {
    name: string;
    price: number;
    currency: string;
    billingPeriod: string;
    features: string[];
    isPopular?: boolean;
  };
  onSubscribe: () => void;
  loading?: boolean;
  currentPlan?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSubscribe,
  loading = false,
  currentPlan = false
}) => {
  return (
    <div className={`border rounded-lg p-6 ${
      plan.isPopular ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-200'
    } ${currentPlan ? 'bg-blue-50' : 'bg-white'}`}>
      {plan.isPopular && (
        <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
          MOST POPULAR
        </div>
      )}
      
      {currentPlan && (
        <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
          CURRENT PLAN
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      
      <div className="mb-4">
        <span className="text-3xl font-bold">₹{plan.price}</span>
        <span className="text-gray-600">/{plan.billingPeriod}</span>
      </div>

      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={onSubscribe}
        isLoading={loading}
        variant={currentPlan ? 'outline' : 'primary'}
        className="w-full"
        disabled={currentPlan}
      >
        {currentPlan ? 'Current Plan' : 'Subscribe Now'}
      </Button>
    </div>
  );
};

export default SubscriptionPlanCard;
