import Stripe from "stripe";
import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const webhook = async (request: any, reply: any) => {
  const sig = request.headers["stripe-signature"];

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.warn("[webhook] No webhook secret configured");
      return reply.send({});
    }

    const event = stripe.webhooks.constructEvent(
      request.body.raw,
      sig,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        if (metadata.coach_id && session.customer_email) {
          await supabaseAdmin.from("subscriptions").insert({
            coach_id: metadata.coach_id,
            membership_id: metadata.membership_id || null,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: "active",
            current_period_start: new Date().toISOString(),
          });
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        if (account.id) {
          await supabaseAdmin
            .from("coaches")
            .update({ stripe_account_id: account.id })
            .eq("stripe_account_id", account.id);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .select("member_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (sub?.member_id) {
          await supabaseAdmin
            .from("members")
            .update({
              status: subscription.status === "active" ? "active" : "inactive",
            })
            .eq("id", sub.member_id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .select("member_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (sub?.member_id) {
          await supabaseAdmin
            .from("members")
            .update({ status: "inactive" })
            .eq("id", sub.member_id);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info("[webhook] Payment succeeded", {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
        });
        break;
      }

      default:
        logger.info(`[webhook] Unhandled event type: ${event.type}`);
    }

    return reply.send({});
  } catch (err: any) {
    logger.error("[webhook] Error", { error: err.message });
    return reply.code(400).send({ error: err.message });
  }
};

export { webhook };
