import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});


const uploadLogo = async (logo: string, stripeAccount: string) => {
  const { data } = await axios.get(logo, {
      responseType: 'arraybuffer' 
  });

  const upload = await stripe.files.create({
    file: {
      data,
      name: 'logo.png',
      type: 'image/png',
    },
    purpose: 'business_logo',
  }, { stripeAccount });

  return upload.id;
}


export {
  uploadLogo
}