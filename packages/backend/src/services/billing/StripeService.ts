import Stripe from 'stripe';
// import { BadRequestError } from '../../utils/errors';
import { BadRequestError } from '../../errors/ApplicationError'; // fixed path
import { SubscriptionPlan, PlanType } from '../../types/billing/StripeTypes'; 
type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription;
};
export class StripeService {
  private stripe: Stripe;

  // constructor() {
  //   this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  //     apiVersion: '2023-10-16',
  //   });
  // }


    constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
    }

    // this.stripe = new Stripe(secretKey, {
    //   apiVersion: "2023-10-16",
    // });

    this.stripe = new Stripe(secretKey, {}); // no apiVersion needed

  }

  async createCustomer(data: {
    email?: string;
    name?: string;
    metadata: Record<string, string>;
  }): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.create(data);
    } 
    // catch (error) {
    //   throw new BadRequestError(`Failed to create Stripe customer: ${error.message}`);
    // }
    catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(
          `Failed to create Stripe customer: ${error.message}`
        );
      }
      throw new BadRequestError("Failed to create Stripe customer: Unknown error");
    }
  }

  // async createSubscription(data: {
  //   customerId: string;
  //   priceId: string;
  //   metadata: Record<string, string>;
  // }): Promise<Stripe.Subscription> {
  //   try {
  //     return await this.stripe.subscriptions.create({
  //       customer: data.customerId,
  //       items: [{ price: data.priceId }],
  //       metadata: data.metadata,
  //       payment_behavior: 'default_incomplete',
  //       expand: ['latest_invoice.payment_intent'],
  //     });
  //     } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       throw new BadRequestError(
  //         `Failed to create Stripe subscription: ${error.message}`
  //       );
  //     }
  //     throw new BadRequestError("Failed to create Stripe subscription: Unknown error");
  //   }

  //   // } catch (error) {
  //   //   throw new BadRequestError(`Failed to create Stripe subscription: ${error.message}`);
  //   // }
  // }

  async createSubscription(
  customerId: string,
  plan: SubscriptionPlan,
  paymentMethodId: string
): Promise<Stripe.Subscription> {
  try {
    // Attach payment method to customer
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price_data: {
            currency: 'inr',
            product: this.getStripeProductId(plan.planType),
            recurring: {
              interval: plan.billingCycle,
            },
            unit_amount: Math.round(plan.price * 100), // convert to paise
          },
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new BadRequestError(
        `Failed to create Stripe subscription: ${error.message}`
      );
    }
    throw new BadRequestError(
      'Failed to create Stripe subscription: Unknown error'
    );
  }
}
  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    customerId: string;
    metadata: Record<string, string>;
  }): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        customer: data.customerId,
        metadata: data.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    // } catch (error) {
    //   throw new BadRequestError(`Failed to create payment intent: ${error.message}`);
    // }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(
          `Failed to create payment intent: ${error.message}`
        );
      }
      throw new BadRequestError("Failed to create payment intent: Unknown error");
    }
  }

  async constructEvent(
    payload: Buffer,
    signature: string,
    secret: string
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, secret);
    // } catch (error) {
    //   throw new BadRequestError(`Webhook signature verification failed: ${error.message}`);
    // }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(
          `Webhook signature verification failed: ${error.message}`
        );
      }
      throw new BadRequestError("Webhook signature verification failed: Unknown error");
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      // Add more event handlers as needed
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update invoice status in database
    // const invoiceId = paymentIntent.metadata.invoiceId;
    // const tenantId = paymentIntent.metadata.tenantId;
    const invoiceId = paymentIntent.metadata?.invoiceId ?? null;
    const tenantId = paymentIntent.metadata?.tenantId ?? null;

    // Implementation would update the invoice status
  }



private async handleInvoicePaymentFailed(invoice: InvoiceWithSubscription): Promise<void> {
  const subscriptionId = typeof invoice.subscription === "string"
    ? invoice.subscription
    : invoice.subscription?.id;

  const tenantId = invoice.metadata?.tenantId ?? null;

  // Implementation would handle the failed payment
}


  // private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  //   // Handle failed payment
  //   const subscriptionId = invoice.subscription as string;
  //   const tenantId = invoice.metadata.tenantId;

  //   // Implementation would handle the failed payment
  // }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Handle subscription cancellation
    // const tenantId = subscription.metadata.tenantId;
     const tenantId = subscription.metadata?.tenantId ?? null;

    // Implementation would update the subscription status in database
  }

    async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(
          `Failed to cancel Stripe subscription: ${error.message}`
        );
      }
      throw new BadRequestError("Failed to cancel Stripe subscription: Unknown error");
    }
  }

  //new

async updateSubscription(
  subscriptionId: string,
  newPlan: SubscriptionPlan
): Promise<Stripe.Subscription> {
  try {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

    return this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      items: [
        {
          id: subscription.items.data[0].id,
          price_data: {
            currency: 'inr',
            product: this.getStripeProductId(newPlan.planType),
            recurring: {
              interval: newPlan.billingCycle,
            },
            unit_amount: Math.round(newPlan.price * 100),
          },
        },
      ],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new BadRequestError(
        `Failed to update Stripe subscription: ${error.message}`
      );
    }
    throw new BadRequestError(
      'Failed to update Stripe subscription: Unknown error'
    );
  }
}

private getStripeProductId(planType: PlanType): string {
  const productIds: Record<PlanType, string | undefined> = {
    [PlanType.BASIC]: process.env.STRIPE_BASIC_PRODUCT_ID,
    [PlanType.PREMIUM]: process.env.STRIPE_PREMIUM_PRODUCT_ID,
    [PlanType.ENTERPRISE]: process.env.STRIPE_ENTERPRISE_PRODUCT_ID,
  };

  const productId = productIds[planType];
  if (!productId) {
    throw new BadRequestError(`Missing Stripe product ID for plan: ${planType}`);
  }

  return productId;
}

    

}
