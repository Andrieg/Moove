import Stripe from "stripe";
import logger from "../../utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const generateSessionCheckout = async (request: any, reply: any) => {
  const { data } = request.body.parsed || request.body;

  if (!data?.price_id || !data?.acc_stripe_id) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "price_id and acc_stripe_id are required", code: 1001 },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: data.price_id,
            quantity: 1,
          },
        ],
        subscription_data: {
          application_fee_percent: 10,
        },
        metadata: {
          acc_stripe_id: data.acc_stripe_id,
          id: data.id,
        },
        success_url: `https://${data.id}.moove.fit?status=success`,
        cancel_url: `https://${data.id}.moove.fit?status=fail`,
      },
      { stripeAccount: data.acc_stripe_id }
    );

    return reply.send({
      status: "SUCCESS",
      session,
    });
  } catch (err: any) {
    logger.error("[generateSessionCheckout error]", { error: err });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: err.message, code: 1002 },
    });
  }
};

export { generateSessionCheckout };
