import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

const generateSessionCheckout = async (request: any, reply: any) => {
  const { data } = request.body.parsed;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: data.price_id,
      quantity: 1,
    }],
    subscription_data: {
      application_fee_percent: 10,
    },
    metadata: {
      acc_stripe_id: data.acc_stripe_id,
      id: data.id,
    },
    success_url: `https://${data.id}.moove.fit?status=success`,
    cancel_url: `https://${data.id}.moove.fit?status=fail`,
  }, { stripeAccount: data.acc_stripe_id }).catch(err => console.error(err));

  return reply.send({
    status: 'SUCCESS',
    session,
  });
};

export { generateSessionCheckout }
