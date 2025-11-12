import Razorpay from 'razorpay';
import { Payment } from '../../entities/Payment';
import logger from '../../utils/logger';

export class RazorpayService {
  private razorpay: any;

  constructor() {
    // require prevents issues if library not installed in some contexts
    // but since you installed razorpay, import above should work
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    });
  }

async createOrder(payment: Payment): Promise<{
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}> {
  try {
    const shortReceipt = `rcpt_${String(payment.id).slice(0, 30)}`; // ✅ keep <40 chars

    const options = {
      amount: Math.round(payment.amount * 100), // amount in paise
      currency: payment.currency || 'INR',
      receipt: shortReceipt,
      payment_capture: 1,
      notes: {
        paymentId: payment.id,
        subscriptionId: payment.subscriptionId,
        userId: payment.userId
      }
    };

    logger.info('🧾 Razorpay createOrder options:', options);

    const order = await this.razorpay.orders.create(options);

    logger.info(`✅ Razorpay order created successfully: ${order.id}`);

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt ?? '',
      status: order.status
    };
  } catch (error: any) {
    logger.error('❌ Failed to create Razorpay order:', error);
    if (error.error) {
      logger.error('🔎 Razorpay Error Response:', error.error);
    }
    throw new Error(error.error?.description || 'Failed to create payment order');
  }
}



  async verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(orderId + '|' + paymentId)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error('Error verifying payment signature:', error);
      return false;
    }
  }

  async capturePayment(paymentId: string, amount: number): Promise<any> {
    try {
      const capture = await this.razorpay.payments.capture(
        paymentId,
        Math.round(amount * 100),
        'INR'
      );

      logger.info(`Payment captured successfully: ${paymentId}`);
      return capture;
    } catch (error) {
      logger.error('Failed to capture payment:', error);
      throw error;
    }
  }

  async createSubscription(
    planId: string,
    totalCount: number = 1
  ): Promise<any> {
    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        total_count: totalCount,
        notes: {
          description: 'Yearly subscription for BillingSoftware SaaS'
        }
      });

      return subscription;
    } catch (error) {
      logger.error('Failed to create Razorpay subscription:', error);
      throw error;
    }
  }
}


// import Razorpay from 'razorpay';
// import { Payment } from '../../entities/Payment';
// import logger from '../../utils/logger';

// export class RazorpayService {
//   private razorpay: Razorpay;

//   constructor() {
//     this.razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID!,
//       key_secret: process.env.RAZORPAY_KEY_SECRET!
//     });
//   }

//   async createOrder(payment: Payment): Promise<{
//     id: string;
//     amount: number;
//     currency: string;
//     receipt: string;
//     status: string;
//   }> {
//     try {
//       const options = {
//         amount: Math.round(payment.amount * 100), // Convert to paise
//         currency: payment.currency,
//         receipt: `receipt_${payment.id}`,
//         payment_capture: 1, // Auto capture
//         notes: {
//           paymentId: payment.id,
//           subscriptionId: payment.subscriptionId,
//           userId: payment.userId
//         }
//       };

//       const order = await this.razorpay.orders.create(options);

//       logger.info(`Razorpay order created: ${order.id} for payment ${payment.id}`);

// return {
//   id: order.id,
//   amount: Number(order.amount), // ensure it's a number
//   currency: order.currency,
//   receipt: order.receipt ?? '', // fallback to empty string if undefined
//   status: order.status,
// };
//     } catch (error) {
//       logger.error('Failed to create Razorpay order:', error);
//       throw new Error('Failed to create payment order');
//     }
//   }

//   async verifyPaymentSignature(
//     orderId: string,
//     paymentId: string,
//     signature: string
//   ): Promise<boolean> {
//     try {
//       const crypto = require('crypto');
//       const expectedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//         .update(orderId + '|' + paymentId)
//         .digest('hex');

//       return expectedSignature === signature;
//     } catch (error) {
//       logger.error('Error verifying payment signature:', error);
//       return false;
//     }
//   }

//   async capturePayment(paymentId: string, amount: number): Promise<any> {
//     try {
//       const capture = await this.razorpay.payments.capture(
//         paymentId,
//         Math.round(amount * 100),
//         'INR'
//       );

//       logger.info(`Payment captured successfully: ${paymentId}`);
//       return capture;
//     } catch (error) {
//       logger.error('Failed to capture payment:', error);
//       throw error;
//     }
//   }

//   async createSubscription(
//     planId: string,
//     customerId: string,
//     totalCount: number = 1 // 1 for yearly
//   ): Promise<any> {
//     try {
//     const subscription = await this.razorpay.subscriptions.create({
//   plan_id: planId,
//   total_count: totalCount,
//   notes: {
//     description: 'Yearly subscription for BillingSoftware SaaS',
//   },
// });

// return subscription;
//     } catch (error) {
//       logger.error('Failed to create Razorpay subscription:', error);
//       throw error;
//     }
//   }
// }
