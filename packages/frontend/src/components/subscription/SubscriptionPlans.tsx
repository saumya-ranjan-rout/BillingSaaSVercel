'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

export function SubscriptionPlans({ plans, currentPlan, history = [], isLoading }: any) {
  const { post } = useApi<any>();
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      toast.info('Creating order...');
      const res = await post('/api/subscriptions/create-order', { planId });

      if (res?.success) {
          if (res.data.freeTrial) {
    toast.success(res.data.message || 'Free trial activated successfully');
      setTimeout(() => {
    window.location.reload();
  }, 1500);
    return; // ✅ Stop here — don’t open Razorpay modal
  }
        setOrder({
          id: res.data.orderId,
          amount: res.data.amount,
          currency: res.data.currency,
        });
        setPaymentId(res.data.paymentId);
        setPaymentOpen(true); // ✅ Open payment modal now
      } else {
        toast.error(res?.message || 'Failed to create order');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Error creating order');
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentOpen(false);
    toast.success('Subscription activated!');
      setTimeout(() => {
    window.location.reload();
  }, 1500);
    // optional: refresh subscription state
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
    <div>
        <h2 className="text-2xl font-semibold mb-4">Your Subscription</h2>
        {currentPlan ? (
          <Card className="mb-6">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>{currentPlan.planName}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Expires: {currentPlan.endDate ? new Date(currentPlan.endDate).toLocaleDateString() : '—'}
                </div>
              </div>
              <div>
                <Badge>
                 Current Active Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Started: {currentPlan.startDate ? new Date(currentPlan.startDate).toLocaleDateString() : '—'}</div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-sm text-muted-foreground mb-6">You do not have an active subscription.</div>
        )}
      </div>

      

      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <Card key={plan.id} className="border p-4">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground ml-2">
                    /{
  plan.billingCycle === 'yearly' ? 'year' :
  plan.billingCycle === 'monthly' ? 'month' :
  plan.billingCycle === 'weekly' ? 'week' :
  plan.billingCycle === '5days' ? '5 days' :
  ''
}

                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((f: string, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
     

<Button
  className="w-full"
  size="lg"
  onClick={() => handleSubscribe(plan.id)}
  disabled={
    isLoading ||
    currentPlan?.planId === plan.id ||
    (Number(plan.price) === 0 && (history?.length ?? 0) > 0)
  }
>
  {currentPlan?.planId === plan.id
    ? 'Current Plan'
    : Number(plan.price) === 0 && (history?.length ?? 0) > 0
      ? 'Free Trial Unavailable'
      : 'Subscribe Now'}
</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* ✅ Razorpay Payment Modal */}
      {isPaymentOpen && order && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
          order={order}
          paymentId={paymentId!}
        />
      )}

           
            

      {/* History */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Subscription History</h2>
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground">No subscription history found.</div>
        ) : (
          <div className="space-y-3">
{history.map((entry: any) => (
  <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4 bg-white">
    <div>
      <div className="font-semibold">{entry.planName}</div>
      <div className="text-sm text-muted-foreground">
        {entry.startDate ? new Date(entry.startDate).toLocaleDateString() : '—'} — {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : '—'}
      </div>
    </div>
    <div className="flex items-center gap-4">
<Badge
  variant={
    entry.status === 'active'
      ? 'success'
      : entry.status === 'expired'
      ? 'danger'
      : 'warning' // ✅ replaced 'secondary' with valid variant
  }
>
  {entry.status?.toString().toUpperCase()}
</Badge>

    </div>
  </div>
))}

          </div>
        )}
      </div>
    </div>
  );
}














 {/* <Button
  className="w-full"
  size="lg"
  onClick={() => handleSubscribe(plan.id)}
  disabled={
    isLoading || 
    currentPlan?.planId === plan.id || 
    (plan.price === 0 && history.length > 0) // ✅ disable free trial if already subscribed before
  }
>
  {currentPlan?.planId === plan.id
    ? 'Current Plan'
    : plan.price === 0 && history.length > 0
      ? 'Free Trial Unavailable'
      : 'Subscribe Now'}
</Button> */}



// import React from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/badge';
// import { Check } from 'lucide-react';

// interface Plan {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   billingCycle: string;
//   maxTenants: number;
//   maxBusinesses: number;
//   maxUsers: number;
//   features: string[];
//   isActive: boolean;
// }

// interface SubscriptionEntry {
//   id: string;
//   planId: string;
//   planName: string;
//   status: 'active' | 'expired' | 'pending' | 'trial' | string;
//   startDate?: string;
//   endDate?: string;
//   createdAt?: string;
//   metadata?: Record<string, any>;
// }

// interface SubscriptionPlansProps {
//   plans: Plan[];
//   currentPlan?: SubscriptionEntry;
//   history?: SubscriptionEntry[];
//   onSubscribe: (planId: string) => void;
//   isLoading?: boolean;
// }

// export function SubscriptionPlans({ plans, currentPlan, history = [], onSubscribe, isLoading }: SubscriptionPlansProps) {
//   const basicPlan = plans.find(plan => plan.name.toLowerCase().includes('basic'));

//   return (
//     <div className="max-w-6xl mx-auto space-y-8">
//       {/* Current subscription summary */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Your Subscription</h2>
//         {currentPlan ? (
//           <Card className="mb-6">
//             <CardHeader className="flex items-center justify-between">
//               <div>
//                 <CardTitle>{currentPlan.planName}</CardTitle>
//                 <div className="text-sm text-muted-foreground">
//                   Expires: {currentPlan.endDate ? new Date(currentPlan.endDate).toLocaleDateString() : '—'}
//                 </div>
//               </div>
//               <div>
//                 <Badge variant={currentPlan.status === 'active' ? 'default' : currentPlan.status === 'expired' ? 'outline' : 'secondary'}>
//                   {currentPlan.status?.toString().toUpperCase()}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-sm text-muted-foreground">Started: {currentPlan.startDate ? new Date(currentPlan.startDate).toLocaleDateString() : '—'}</div>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="text-sm text-muted-foreground mb-6">You do not have an active subscription.</div>
//         )}
//       </div>

//       {/* History */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Subscription History</h2>
//         {history.length === 0 ? (
//           <div className="text-sm text-muted-foreground">No subscription history found.</div>
//         ) : (
//           <div className="space-y-3">
//             {history.map(entry => (
//               <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4 bg-white">
//                 <div>
//                   <div className="font-semibold">{entry.planName}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {entry.startDate ? new Date(entry.startDate).toLocaleDateString() : '—'} — {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : '—'}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Badge variant={entry.status === 'active' ? 'default' : entry.status === 'expired' ? 'outline' : 'secondary'}>
//                     {entry.status?.toString().toUpperCase()}
//                   </Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Available plans grid */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <Card 
//               key={plan.id} 
//               className={`relative ${plan.name.toLowerCase().includes('basic') ? 'border-2 border-primary shadow-lg scale-105' : 'border'}`}
//             >
//               {plan.name.toLowerCase().includes('basic') && (
//                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                   <Badge variant="default" className="px-3 py-1 text-sm">
//                     Most Popular
//                   </Badge>
//                 </div>
//               )}
              
//               <CardHeader className="text-center pb-4">
//                 <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
//                 <p className="text-muted-foreground mt-2">{plan.description}</p>
                
//                 <div className="mt-4">
//                   <span className="text-4xl font-bold">₹{plan.price}</span>
//                   <span className="text-muted-foreground ml-2">
//                     /{plan.billingCycle === 'yearly' ? 'year' : 'month'}
//                   </span>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="text-center p-3 bg-muted rounded-lg">
//                     <div className="font-semibold">{plan.maxTenants}</div>
//                     <div className="text-muted-foreground">Tenants</div>
//                   </div>
//                   <div className="text-center p-3 bg-muted rounded-lg">
//                     <div className="font-semibold">{plan.maxBusinesses}</div>
//                     <div className="text-muted-foreground">Businesses</div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {plan.features.map((feature, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
//                       <span className="text-sm">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>

//               <CardFooter>
//                 <Button
//                   className="w-full"
//                   size="lg"
//                   onClick={() => onSubscribe(plan.id)}
//                   disabled={isLoading || (typeof currentPlan !== 'undefined' && currentPlan?.planId === plan.id)}
//                   variant={plan.name.toLowerCase().includes('basic') ? 'default' : 'outline'}
//                 >
//                   {currentPlan?.planId === plan.id ? 'Current Plan' : 'Subscribe Now'}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }











