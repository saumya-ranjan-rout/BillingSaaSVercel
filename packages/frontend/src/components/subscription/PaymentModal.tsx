import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentModal({ isOpen, onClose, onSuccess, order, paymentId }: any) {
  const { post } = useApi<any>();
  const openedRef = useRef(false);

  useEffect(() => {
    if (isOpen && order && !openedRef.current) {
      openedRef.current = true;
      loadRazorpayScript();
    }
  }, [isOpen, order]);

  const loadRazorpayScript = () => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      initializeRazorpay();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = initializeRazorpay;
    document.body.appendChild(script);
  };

  const initializeRazorpay = () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'BillingSoftware SaaS',
      description: 'Subscription Payment',
      order_id: order.id,
      handler: async (response: any) => {
        try {
          const result = await post('/api/subscriptions/payment/success', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            payment_id: paymentId,
          });

          if (result?.success) {
            toast.success('Payment successful!');
            onSuccess();
          } else {
            toast.error(result?.message || 'Payment verification failed');
          }
        } catch (err: any) {
          toast.error('Error processing payment');
        }
      },
      modal: {
        ondismiss: () => {
          onClose();
        },
      },
      theme: { color: '#4f46e5' },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

return (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Redirecting to Razorpay...</DialogTitle>
      </DialogHeader>
      <div className="text-center py-6">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Preparing secure payment of ₹{(order.amount / 100).toFixed(2)}</p>
      </div>
    </DialogContent>
  </Dialog>
);

}

















// import React, { useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/Button';
// import { Loader2 } from 'lucide-react';
// import { useApi } from '@/hooks/useApi'; // ✅ Import useApi
// import { toast } from 'sonner';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   order: {
//     id: string;
//     amount: number; // in paise
//     currency: string;
//   };
//   paymentId: string;
// }

// export function PaymentModal({
//   isOpen,
//   onClose,
//   onSuccess,
//   order,
//   paymentId,
// }: PaymentModalProps) {
//   const { post } = useApi<any>(); // ✅ useApi hook

//   useEffect(() => {
//     if (isOpen && order) {
//       loadRazorpayScript();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOpen, order]);

//   const loadRazorpayScript = () => {
//     if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
//       initializeRazorpay();
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     script.onload = initializeRazorpay;
//     document.body.appendChild(script);
//   };

//   const initializeRazorpay = () => {
//     if (!window.Razorpay) {
//       console.error('Razorpay SDK failed to load');
//       return;
//     }

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: 'BillingSoftware SaaS',
//       description: 'Subscription Payment',
//       order_id: order.id,
//       handler: async function (response: any) {
//         try {
//           // ✅ Use useApi POST method instead of fetch
//           const result = await post('/api/subscriptions/payment/success', {
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature,
//             payment_id: paymentId,
//           });

//           if (result?.success) {
//             toast.success('Payment successful!');
//             onSuccess();
//           } else {
//             toast.error(result?.message || 'Payment verification failed');
//             console.error('Payment verification failed:', result);
//           }
//         } catch (error: any) {
//           console.error('Error processing payment:', error);
//           toast.error(error?.message || 'Error processing payment');
//         }
//       },
//       modal: {
//         ondismiss: function () {
//           onClose();
//         },
//       },
//     };

//     try {
//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       console.error('Error opening Razorpay:', err);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Complete Your Payment</DialogTitle>
//         </DialogHeader>

//         <div className="text-center py-8">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-lg font-semibold mb-2">Redirecting to Payment Gateway</p>
//           <p className="text-muted-foreground">
//             You will be redirected to Razorpay to complete your payment of{' '}
//             <strong>₹{(order.amount / 100).toFixed(2)}</strong>
//           </p>

//           <Button variant="outline" onClick={onClose} className="mt-4">
//             Cancel Payment
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

