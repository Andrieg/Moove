import Stripe from 'stripe';
import DB from '../../services/dynamodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});


const getBilling  = async (request: any, reply: any) => {
  const { user } = request;

  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];

      if (!!exists.acc_stripe_id && typeof exists.acc_stripe_id === 'string') {
        const billingResult = await DB.BILLING.get(exists.acc_stripe_id);

        if (billingResult?.Items?.length) {
          return reply.send({
            status: 'SUCCESS',
            data:  billingResult.Items[0],
          });
        }

        return reply.send({
          status: 'SUCCESS',
          data: {}
        });
      }
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }
};

const createMembership = async (request: any, reply: any) => {
  const { user } = request;
  const { price, title, benefits } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];

      if (!!exists.acc_stripe_id && typeof exists.acc_stripe_id === 'string') {
        const billingResult: any = await DB.BILLING.get(exists.acc_stripe_id);

        if (!!billingResult?.Items?.length) {
          const billing: any = billingResult.Items[0];

          if (!billing?.membership) {
            const stripe_price = await stripe.prices.create({
              nickname: title,
              product_data: {
                name: title
              },
              unit_amount_decimal: `${parseFloat(price) * 100}`,
              currency: exists.currency,
              recurring: {
                interval: 'month',
                usage_type: 'licensed',
              },
            }, { stripeAccount: exists.acc_stripe_id });
  
            if (!!stripe_price) {
              const membership = {
                title,
                benefits,
                price: price,
                price_id: stripe_price.id,
                product_id: stripe_price.product,
              }
  
              billing.membership = membership;
              await DB.BILLING.update(billing, ['membership']);
  
              return reply.send({
                status: 'SUCCESS',
                data: billing
              });
            }
          }
        }
      }
    }
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001,
  });
}

const updateMembership = async (request: any, reply: any) => {
  const { user } = request;
  const { price, title, benefits } = request.body.parsed;

  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];

      if (!!exists.acc_stripe_id && typeof exists.acc_stripe_id === 'string') {
        const billingResult: any = await DB.BILLING.get(exists.acc_stripe_id);

        if (!!billingResult?.Items?.length) {
          const billing: any = billingResult.Items[0];

          if (!!billing?.membership) {
            await stripe.prices.update(billing.membership.price_id, { active: false }, { stripeAccount: exists.acc_stripe_id}); 
            const stripe_price = await stripe.prices.create({
              nickname: title,
              product: billing.membership.product_id,
              unit_amount_decimal: `${parseFloat(price) * 100}`,
              currency: exists.currency,
              recurring: {
                interval: 'month',
                usage_type: 'licensed',
              },
            }, { stripeAccount: exists.acc_stripe_id });
  
            if (!!stripe_price) {
              const membership = {
                title,
                benefits,
                price: price,
                price_id: stripe_price.id,
                product_id: stripe_price.product,
              }
  
              billing.membership = membership;
              await DB.BILLING.update(billing, ['membership']);
  
              return reply.send({
                status: 'SUCCESS',
                data: billing
              });
            }
          }
        }
      }
    }
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001,
  });
};

const getMembershipPlan = async (request: any, reply: any) => {
  const { user } = request;
  const { email } = request.query;

  if (!user) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong',
      code: 1001,
    });
  }

  if (!!email) {
    const result = await DB.USERS.get(email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];

      if (!!exists.acc_stripe_id && typeof exists.acc_stripe_id === 'string') {
        const billingResult = await DB.BILLING.get(exists.acc_stripe_id);

        if (billingResult?.Items?.length) {
          return reply.send({
            status: 'SUCCESS',
            data:  {
              ...billingResult.Items[0].membership,
              acc_stripe_id: exists.acc_stripe_id,
              currency: exists?.currency,
            }
          });
        }

        return reply.send({
          status: 'SUCCESS',
          data: {}
        });
      }
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }
};

const cancelMembership = async (request: any, reply: any) => {
  const { user } = request;

  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];

      if (!!exists) {
        const resultCoach = await DB.USERS.get(exists.coach_email);
        if (!!resultCoach?.Items?.length) {
          const existsCoach: any = resultCoach.Items[0];
          const customer: any = await stripe.customers.retrieve(
            exists.id,
            { expand: ['subscriptions'] },
            { stripeAccount: existsCoach.acc_stripe_id }
          );


          const subscription = customer.subscriptions.data.find(sub => sub.status === 'active')
          console.log('s', subscription);
          if (subscription) {
            const result = await stripe.subscriptions.del(subscription.id, { stripeAccount: existsCoach.acc_stripe_id });
            console.log('result', result);
          }

          const memberResult = await DB.MEMBERS.get(exists.coach_email, exists.email);
          if (!!memberResult?.Items?.length) {
            const member: any = memberResult.Items[0];
            member.status = 'cancel';
            await DB.USERS.update(member, ['status']);
          }

          return reply.send({
            status: 'SUCCESS',
            data: {
              user: result
            }
          });
        } 
      }
    }
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong'
  });
};


export {
  getBilling,
  createMembership,
  updateMembership,
  getMembershipPlan,
  cancelMembership,
};
