import Stripe from 'stripe';
import logger from '../../utils/logger';
import DB from '../../services/dynamodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

const webhook = async (request: any, reply: any) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body.raw, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    logger.error('webhookerror', { err });
    reply.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkout = event.data.object;
      const billingResult: any = await DB.BILLING.get(checkout?.metadata?.acc_stripe_id);
      if (!!billingResult?.Items?.length) {
        const billing: any = billingResult.Items[0];

        const member = {
          email: checkout?.customer_details.email,
          coach_email: billing.email,
          id: checkout?.metadata.id,
        }

        const result = await DB.MEMBERS.put(member);
        if (result) {
          const user = {
            email: checkout?.customer_details.email,
            role: 'member',
            brands: [checkout?.metadata.id],
            id: checkout?.customer,
            coach_email: billing.email,
          };
          const payment = {
            email: checkout?.customer_details.email,
            id: checkout?.customer,
            status: checkout?.payment_status,
            type: checkout?.mode,
            coach_email: billing.email,
          }
          
          await DB.USERS.put(user);
          await DB.PAYMENTS.put(payment);
        }
      }
      break;
    case 'account.updated':
      const data = event.data.object;
      logger.info(`Handled event type ${event.type}`, { data })
      const resultBilling = await DB.BILLING.get(data.id);
      if (!!resultBilling?.Items?.length) {
        const billing: any = resultBilling.Items[0];
        const result = await DB.USERS.get(billing.email);

        if (!!result?.Items?.length) {
          const user: any = result?.Items[0];
          user.stripe_connected = true;
          await DB.USERS.update(user, ['stripe_connected']);

          billing.connected = true;
          await DB.BILLING.update(billing, ['connected']);
        }
      }
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      logger.info(`Handled event type ${event.type}`, { event, paymentIntent })
      break;
    // case 'customer.subscription.created':
    //   const customerCreated = event.data.object;
    //   // logger.info(`Handled event type ${event.type}`, { customerCreated })
    //   break;
    case 'customer.subscription.updated':
      const customerUpdated = event.data.object;
      const paymentResult = await DB.PAYMENTS.get(customerUpdated.customer);
      if (!!paymentResult?.Items?.length) {
        const payment: any = paymentResult.Items[0];
        const userResult = await DB.MEMBERS.get(payment.coach_email, payment.email);
        if (!!userResult?.Items?.length) {
          const member: any = userResult.Items[0];
          member.status = customerUpdated.status || 'active';
          DB.MEMBERS.update(member, ['status']);
        }
      }
      break;
    case 'customer.subscription.deleted':
      const customerDeleted = event.data.object;
      logger.info(`Handled event type ${event.type}`, { event });
      const paymentDeletedResult = await DB.PAYMENTS.get(customerDeleted.customer);

      if (!!paymentDeletedResult?.Items?.length) {
        const payment: any = paymentDeletedResult.Items[0];
        const userResult = await DB.MEMBERS.get(payment.coach_email, payment.email);
        if (!!userResult?.Items?.length) {
          const member: any = userResult.Items[0];
          member.status = 'cancel';
          DB.MEMBERS.update(member, ['status']);
        }
      }
      break;
    default:
      // logger.info(`Unhandled event type ${event.type}`, { event })
      console.log(`Unhandled event type ${event.type}`);
  }

  reply.send({});
};

export {
  webhook
}

// // Handle the event
// switch (event.type) {
//   case 'account.updated':
//     const account = event.data.object;
//     // Then define and call a function to handle the event account.updated
//     break;
//   case 'application_fee.created':
//     const applicationFee = event.data.object;
//     // Then define and call a function to handle the event application_fee.created
//     break;
//   case 'application_fee.refunded':
//     const applicationFee = event.data.object;
//     // Then define and call a function to handle the event application_fee.refunded
//     break;
//   case 'application_fee.refund.updated':
//     const applicationFeeApplication = event.data.object;
//     // Then define and call a function to handle the event application_fee.refund.updated
//     break;
//   case 'charge.captured':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.captured
//     break;
//   case 'charge.expired':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.expired
//     break;
//   case 'charge.failed':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.failed
//     break;
//   case 'charge.pending':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.pending
//     break;
//   case 'charge.refunded':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.refunded
//     break;
//   case 'charge.succeeded':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.succeeded
//     break;
//   case 'charge.updated':
//     const charge = event.data.object;
//     // Then define and call a function to handle the event charge.updated
//     break;
//   case 'checkout.session.async_payment_failed':
//     const checkout = event.data.object;
//     // Then define and call a function to handle the event checkout.session.async_payment_failed
//     break;
//   case 'checkout.session.async_payment_succeeded':
//     const checkout = event.data.object;
//     // Then define and call a function to handle the event checkout.session.async_payment_succeeded
//     break;
//   case 'checkout.session.completed':
//     const checkout = event.data.object;
//     // Then define and call a function to handle the event checkout.session.completed
//     break;
//   case 'checkout.session.expired':
//     const checkout = event.data.object;
//     // Then define and call a function to handle the event checkout.session.expired
//     break;
//   case 'customer.created':
//     const customer = event.data.object;
//     // Then define and call a function to handle the event customer.created
//     break;
//   case 'customer.deleted':
//     const customer = event.data.object;
//     // Then define and call a function to handle the event customer.deleted
//     break;
//   case 'customer.updated':
//     const customer = event.data.object;
//     // Then define and call a function to handle the event customer.updated
//     break;
//   case 'customer.subscription.created':
//     const customer = event.data.object;
//     // Then define and call a function to handle the event customer.subscription.created
//     break;
//   case 'customer.subscription.deleted':
//     const customer = event.data.object;
//     // Then define and call a function to handle the event customer.subscription.deleted
//     break;
//   case 'customer.subscription.updated':
//     const customer = event.data.object;
//     // Then define and call a function to handle the event customer.subscription.updated
//     break;
//   case 'payment_intent.created':
//     const paymentIntent = event.data.object;
//     // Then define and call a function to handle the event payment_intent.created
//     break;
//   case 'payment_intent.payment_failed':
//     const paymentIntent = event.data.object;
//     // Then define and call a function to handle the event payment_intent.payment_failed
//     break;
//   case 'payment_intent.processing':
//     const paymentIntent = event.data.object;
//     // Then define and call a function to handle the event payment_intent.processing
//     break;
//   case 'payment_intent.requires_action':
//     const paymentIntent = event.data.object;
//     // Then define and call a function to handle the event payment_intent.requires_action
//     break;
//   case 'payment_intent.succeeded':
//     const paymentIntent = event.data.object;
//     // Then define and call a function to handle the event payment_intent.succeeded
//     break;
//   case 'payout.canceled':
//     const payout = event.data.object;
//     // Then define and call a function to handle the event payout.canceled
//     break;
//   case 'payout.created':
//     const payout = event.data.object;
//     // Then define and call a function to handle the event payout.created
//     break;
//   case 'payout.failed':
//     const payout = event.data.object;
//     // Then define and call a function to handle the event payout.failed
//     break;
//   case 'payout.paid':
//     const payout = event.data.object;
//     // Then define and call a function to handle the event payout.paid
//     break;
//   case 'payout.updated':
//     const payout = event.data.object;
//     // Then define and call a function to handle the event payout.updated
//     break;
//   case 'plan.created':
//     const plan = event.data.object;
//     // Then define and call a function to handle the event plan.created
//     break;
//   case 'plan.deleted':
//     const plan = event.data.object;
//     // Then define and call a function to handle the event plan.deleted
//     break;
//   case 'plan.updated':
//     const plan = event.data.object;
//     // Then define and call a function to handle the event plan.updated
//     break;
//   case 'price.created':
//     const price = event.data.object;
//     // Then define and call a function to handle the event price.created
//     break;
//   case 'price.deleted':
//     const price = event.data.object;
//     // Then define and call a function to handle the event price.deleted
//     break;
//   case 'price.updated':
//     const price = event.data.object;
//     // Then define and call a function to handle the event price.updated
//     break;
//   case 'product.created':
//     const product = event.data.object;
//     // Then define and call a function to handle the event product.created
//     break;
//   case 'product.deleted':
//     const product = event.data.object;
//     // Then define and call a function to handle the event product.deleted
//     break;
//   case 'product.updated':
//     const product = event.data.object;
//     // Then define and call a function to handle the event product.updated
//     break;
//   // ... handle other event types
//   default:
//     console.log(`Unhandled event type ${event.type}`);
// }