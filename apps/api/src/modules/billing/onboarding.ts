import Stripe from "stripe";
import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const generateAccountLink = (stripeId: string) =>
  stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: stripeId,
      refresh_url: `${process.env.APP_URL || "http://localhost:3000"}/payment/refresh`,
      return_url: `${process.env.APP_URL || "http://localhost:3000"}/payment`,
    })
    .then((link) => link.url);

const onBoarding = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can onboard to Stripe", code: 1001 },
    });
  }

  try {
    const { data: coach, error } = await supabaseAdmin
      .from("coaches")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !coach) {
      return reply.code(404).send({
        status: "FAILED",
        error: { message: "Coach not found", code: 1002 },
      });
    }

    if (coach.stripe_account_id) {
      const accountLinkURL = await generateAccountLink(coach.stripe_account_id);
      return reply.send({
        status: "SUCCESS",
        url: accountLinkURL,
        connected: true,
      });
    }

    const account = await stripe.accounts.create({ type: "standard" });

    await supabaseAdmin
      .from("coaches")
      .update({ stripe_account_id: account.id })
      .eq("id", user.id);

    const accountLinkURL = await generateAccountLink(account.id);

    return reply.send({
      status: "SUCCESS",
      url: accountLinkURL,
      connected: false,
    });
  } catch (err: any) {
    logger.error("[onBoarding error]", { error: err });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: err.message, code: 1003 },
    });
  }
};

const onBoardingRefresh = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can refresh Stripe onboarding", code: 1001 },
    });
  }

  try {
    const { data: coach, error } = await supabaseAdmin
      .from("coaches")
      .select("stripe_account_id")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !coach?.stripe_account_id) {
      return reply.code(404).send({
        status: "FAILED",
        error: { message: "No Stripe account found", code: 1002 },
      });
    }

    const accountLinkURL = await generateAccountLink(coach.stripe_account_id);

    return reply.send({
      status: "SUCCESS",
      url: accountLinkURL,
    });
  } catch (err: any) {
    logger.error("[onBoardingRefresh error]", { error: err });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: err.message, code: 1003 },
    });
  }
};

export { onBoarding, onBoardingRefresh };
