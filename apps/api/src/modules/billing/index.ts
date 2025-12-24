import Stripe from "stripe";
import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const stripe = new Stripe(process.env.STRIPE_API_KEY || process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const createCheckoutSession = async (request: any, reply: any) => {
  const { membershipId, originUrl, brandSlug, email } = request.body.parsed || request.body;

  if (!membershipId && !brandSlug) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "Membership ID or brand slug required", code: 1001 },
    });
  }

  let membership: any = null;
  let coach: any = null;

  if (membershipId) {
    const { data } = await supabaseAdmin
      .from("memberships")
      .select("*, coaches(*)")
      .eq("id", membershipId)
      .maybeSingle();
    membership = data;
    coach = data?.coaches;
  } else if (brandSlug) {
    const { data: coachData } = await supabaseAdmin
      .from("coaches")
      .select("*, memberships(*)")
      .eq("brand_slug", brandSlug)
      .maybeSingle();

    if (coachData?.memberships?.length) {
      coach = coachData;
      membership = coachData.memberships.find((m: any) => m.status === "active") || coachData.memberships[0];
    }
  }

  if (!membership || !coach) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Membership not found", code: 1002 },
    });
  }

  try {
    const successUrl = `${originUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${originUrl}/coach/${coach.brand_slug}`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: membership.currency || "GBP",
            product_data: {
              name: membership.title,
              description: membership.description || undefined,
            },
            unit_amount: Math.round(membership.price_monthly * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        membership_id: membership.id,
        coach_id: coach.id,
        brand_slug: coach.brand_slug,
        email,
      },
    };

    if (coach.stripe_account_id) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(membership.price_monthly * 10),
        transfer_data: {
          destination: coach.stripe_account_id,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return reply.send({
      status: "SUCCESS",
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    logger.error("[createCheckoutSession error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: error.message, code: 1003 },
    });
  }
};

const getCheckoutStatus = async (request: any, reply: any) => {
  const { sessionId } = request.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return reply.send({
      status: "SUCCESS",
      payment_status: session.payment_status,
      checkout_status: session.status,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
    });
  } catch (error: any) {
    logger.error("[getCheckoutStatus error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: error.message, code: 1001 },
    });
  }
};

const handleWebhook = async (request: any, reply: any) => {
  const sig = request.headers["stripe-signature"];
  const body = request.body.raw || request.body;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.warn("[handleWebhook] No webhook secret configured");
      return reply.send({ received: true });
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        if (metadata.coach_id && session.customer_email) {
          const { data: existingMember } = await supabaseAdmin
            .from("members")
            .select("id")
            .eq("email", session.customer_email)
            .eq("coach_id", metadata.coach_id)
            .maybeSingle();

          if (!existingMember) {
            logger.info("[handleWebhook] Member will be created via auth flow");
          }

          await supabaseAdmin.from("subscriptions").insert({
            member_id: existingMember?.id || null,
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

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      default:
        logger.info(`[handleWebhook] Unhandled event type: ${event.type}`);
    }

    return reply.send({ received: true });
  } catch (error: any) {
    logger.error("[handleWebhook error]", { error });
    return reply.code(400).send({ error: error.message });
  }
};

const getBilling = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can view billing", code: 1001 },
    });
  }

  const { data: coach, error } = await supabaseAdmin
    .from("coaches")
    .select("stripe_account_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    logger.error("[getBilling error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch billing info", code: 1002 },
    });
  }

  return reply.send({
    status: "SUCCESS",
    billing: {
      stripeAccountId: coach?.stripe_account_id || null,
      connected: !!coach?.stripe_account_id,
    },
  });
};

const getMembershipPlan = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can view memberships", code: 1001 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("memberships")
    .select("*")
    .eq("coach_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("[getMembershipPlan error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch memberships", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", memberships: data || [] });
};

const createMembership = async (request: any, reply: any) => {
  const { user } = request;
  const { membership } = request.body.parsed || request.body;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can create memberships", code: 1001 },
    });
  }

  const membershipData = {
    coach_id: user.id,
    title: membership.title,
    description: membership.description || null,
    price_monthly: membership.priceMonthly || membership.price_monthly,
    currency: membership.currency || "GBP",
    status: membership.status || "active",
    features: membership.features || [],
  };

  const { data, error } = await supabaseAdmin
    .from("memberships")
    .insert(membershipData)
    .select()
    .single();

  if (error) {
    logger.error("[createMembership error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to create membership", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", membership: data });
};

const updateMembership = async (request: any, reply: any) => {
  const { user } = request;
  const { membershipId, updates } = request.body.parsed || request.body;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can update memberships", code: 1001 },
    });
  }

  const updateData: Record<string, any> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.priceMonthly !== undefined) updateData.price_monthly = updates.priceMonthly;
  if (updates.price_monthly !== undefined) updateData.price_monthly = updates.price_monthly;
  if (updates.currency !== undefined) updateData.currency = updates.currency;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.features !== undefined) updateData.features = updates.features;

  if (Object.keys(updateData).length === 0) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "No valid updates provided", code: 1002 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("memberships")
    .update(updateData)
    .eq("id", membershipId)
    .eq("coach_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateMembership error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update membership", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS", membership: data });
};

const cancelMembership = async (request: any, reply: any) => {
  const { user } = request;
  const { membershipId } = request.body.parsed || request.body || request.query;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can cancel memberships", code: 1001 },
    });
  }

  const { error } = await supabaseAdmin
    .from("memberships")
    .update({ status: "inactive" })
    .eq("id", membershipId)
    .eq("coach_id", user.id);

  if (error) {
    logger.error("[cancelMembership error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to cancel membership", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS" });
};

export {
  createCheckoutSession,
  getCheckoutStatus,
  handleWebhook,
  getBilling,
  getMembershipPlan,
  createMembership,
  updateMembership,
  cancelMembership,
};
