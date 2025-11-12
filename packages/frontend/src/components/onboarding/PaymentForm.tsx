import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert
} from '@mui/material';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  amount: number;
  onSubmit: (paymentMethodId: string) => void;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSubmit,
  isLoading = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      return;
    }

    if (paymentMethod) {
      onSubmit(paymentMethod.id);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Total Amount: ₹{amount.toFixed(2)}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!stripe || isLoading}
          >
            {isLoading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
