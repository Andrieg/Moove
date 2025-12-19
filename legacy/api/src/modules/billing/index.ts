import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

// Initialize Stripe with test key
const stripe = new Stripe(process.env.STRIPE_API_KEY || 'sk_test_emergent', {
  apiVersion: '2024-12-18.acacia',
});

// In-memory store for payment transactions (in production, use database)
const paymentTransactions: Map<string, any> = new Map();

// Define membership packages (prices are in smallest currency unit - pence for GBP)
const PACKAGES = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Membership',
    price: 29.99,
    currency: 'gbp',
    interval: 'month',
    trialDays: 7,
  },
};

/**
 * Create a Stripe Checkout Session for subscription
 */
const createCheckoutSession = async (request: any, reply: any) => {
  const { packageId, originUrl, brand, email } = request.body;

  // ✅ DEV BYPASS: Return mock checkout URL
  if (process.env.NODE_ENV !== "production") {
    const sessionId = 'cs_test_' + uuidv4();
    const mockUrl = `${originUrl}/payment/success?session_id=${sessionId}`;
    
    // Store transaction
    paymentTransactions.set(sessionId, {
      id: sessionId,
      status: 'pending',
      payment_status: 'unpaid',
      amount: PACKAGES.monthly.price,
      currency: PACKAGES.monthly.currency,
      brand,
      email,
      created_at: new Date().toISOString(),
    });

    return reply.send({
      status: 'SUCCESS',
      url: mockUrl,
      sessionId,
    });
  }

  try {
    // Get package details (server-side only)
    const pkg = PACKAGES[packageId as keyof typeof PACKAGES] || PACKAGES.monthly;

    // Build URLs from frontend origin
    const successUrl = `${originUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${originUrl}/coach/${brand}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: pkg.currency,
            product_data: {
              name: pkg.name,
            },
            unit_amount: Math.round(pkg.price * 100), // Convert to pence
            recurring: {
              interval: pkg.interval as Stripe.Price.Recurring.Interval,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: pkg.trialDays,
        metadata: {
          brand,
          email,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        brand,
        email,
        package_id: packageId,
      },
    });

    // Store transaction record
    paymentTransactions.set(session.id, {
      id: session.id,
      status: 'pending',
      payment_status: 'unpaid',
      amount: pkg.price,
      currency: pkg.currency,
      brand,
      email,
      created_at: new Date().toISOString(),
    });

    return reply.send({
      status: 'SUCCESS',
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return reply.status(500).send({
      status: 'FAIL',
      error: error.message,
    });
  }
};

/**
 * Get checkout session status
 */
const getCheckoutStatus = async (request: any, reply: any) => {
  const { sessionId } = request.params;

  // ✅ DEV BYPASS: Return mock success status
  if (process.env.NODE_ENV !== "production") {
    const transaction = paymentTransactions.get(sessionId);
    
    // Simulate successful payment
    if (transaction) {
      transaction.status = 'complete';
      transaction.payment_status = 'paid';
      paymentTransactions.set(sessionId, transaction);
    }

    return reply.send({
      status: 'SUCCESS',
      payment_status: 'paid',
      checkout_status: 'complete',
      amount: transaction?.amount || 29.99,
      currency: transaction?.currency || 'gbp',
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Update stored transaction
    const transaction = paymentTransactions.get(sessionId);
    if (transaction) {
      transaction.status = session.status;
      transaction.payment_status = session.payment_status;
      paymentTransactions.set(sessionId, transaction);
    }

    return reply.send({
      status: 'SUCCESS',
      payment_status: session.payment_status,
      checkout_status: session.status,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
    });
  } catch (error: any) {
    return reply.status(500).send({
      status: 'FAIL',
      error: error.message,
    });
  }
};

/**
 * Handle Stripe webhook
 */
const handleWebhook = async (request: any, reply: any) => {
  const sig = request.headers['stripe-signature'];
  const body = request.body;

  // ✅ DEV BYPASS: Just acknowledge
  if (process.env.NODE_ENV !== "production") {
    return reply.send({ received: true });
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful:', session.id);
        
        // Update transaction
        const transaction = paymentTransactions.get(session.id);
        if (transaction) {
          transaction.status = 'complete';
          transaction.payment_status = 'paid';
          paymentTransactions.set(session.id, transaction);
        }
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription cancelled');
        break;
    }

    return reply.send({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return reply.status(400).send({ error: error.message });
  }
};

export {
  createCheckoutSession,
  getCheckoutStatus,
  handleWebhook,
};
