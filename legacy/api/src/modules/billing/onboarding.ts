import Stripe from 'stripe';
import DB from '../../services/dynamodb';
import { uploadLogo } from '../../services/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});


const generateAccountLink = (stripe_id: string) => stripe.accountLinks
  .create({
    type: "account_onboarding",
    account: stripe_id,
    refresh_url: `${process.env.APP_URL}/payment/refresh`,
    return_url: `${process.env.APP_URL}/payment`,
  })
  .then((link) => link.url);



const onBoarding = async (request: any, reply: any) => {
  const { user } = request;

  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];
      if (!!exists.acc_stripe_id && typeof exists.acc_stripe_id === 'string') {
        const accountLinkURL = await generateAccountLink(exists.acc_stripe_id);

        return reply.send({
          status: 'SUCCESS',
          url: accountLinkURL,
          connected: exists.stripe_connected,
        });
      }

      let account: any;

      if (!!exists.brand_logo && typeof exists.brand_logo === 'string') {
        const stripe_logo_id = await uploadLogo(exists.brand_logo, exists.acc_stripe_id);

        const branding = {
          logo: stripe_logo_id,
          secondary_color: exists.theme_color as string,
        };


        account = await stripe.accounts.create({type: "standard", settings: {branding}});
      } else {
        account = await stripe.accounts.create({type: "standard"});
      }

      const accountLinkURL = await generateAccountLink(account.id);

      const billing = {
        id: account.id,
        email: exists.email,
        connected: false
      }
      exists.acc_stripe_id = account.id;
      exists.stripe_connected = false

      await DB.BILLING.put(billing);
      await DB.USERS.update(exists, ['acc_stripe_id', 'stripe_connected']);

      return reply.send({
        status: 'SUCCESS',
        url: accountLinkURL,
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }
};

const onBoardingRefresh = async (request: any, reply: any) => {
  const { user } = request;

  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const exists: any = result.Items[0];
      const accountLinkURL = await generateAccountLink(exists.acc_stripe_id);

      return reply.send({
        status: 'SUCCESS',
        url: accountLinkURL,
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }
};

export {
  onBoarding,
  onBoardingRefresh
}