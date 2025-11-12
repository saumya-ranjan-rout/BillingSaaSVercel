import React, { useState } from 'react';
import { loadRazorpay } from '../../utils/razorpay';
// import Button from '../common/Button';
import { Button } from '@/components/ui/Button';

interface PaymentFormProps {
  amount: number;
  currency: string;
  description: string;
  onSuccess: (paymentData: any) => void;
  onFailure: (error: any) => void;
  loading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  description,
  onSuccess,
  onFailure,
  loading = false
}) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
   // alert(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    setProcessing(true);
    
    try {
      // Load Razorpay script
      await loadRazorpay();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency,
        name: 'Billing Software SaaS',
        description,
        handler: async function(response: any) {
          onSuccess(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          description
        },
        theme: {
          color: '#2563eb'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      onFailure(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">₹{amount}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <Button
        onClick={handlePayment}
        isLoading={processing || loading}
        className="w-full"
        size="lg"
      >
        Pay ₹{amount}
      </Button>

      <div className="mt-4 text-center text-xs text-gray-500">
        Secure payment powered by Razorpay
      </div>
    </div>
  );
};

export default PaymentForm;
