import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // ✅ If you want, verify your token here (optional)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const { priceId, customerId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    };

    // If we have a customer ID, use it; otherwise, rely on Stripe to create one
    if (customerId) {
      params.customer = customerId;
    }

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return res.status(200).json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'An error occurred while creating checkout session',
    });
  }
}
