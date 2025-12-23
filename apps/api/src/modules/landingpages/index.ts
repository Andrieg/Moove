import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const getLandingpage = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can view their landing page", code: 1001 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("landing_pages")
    .select("*")
    .eq("coach_id", user.id)
    .maybeSingle();

  if (error) {
    logger.error("[getLandingpage error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch landing page", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", landingpage: data });
};

const getLandingpageByBrand = async (request: any, reply: any) => {
  const { id: brandSlug } = request.params;

  if (!brandSlug) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "Brand slug is required", code: 1001 },
    });
  }

  const { data: coach, error: coachError } = await supabaseAdmin
    .from("coaches")
    .select(`
      id,
      email,
      display_name,
      brand_slug,
      avatar_url,
      stripe_account_id,
      landing_pages(*),
      memberships(*)
    `)
    .eq("brand_slug", brandSlug)
    .maybeSingle();

  if (coachError) {
    logger.error("[getLandingpageByBrand error]", { error: coachError });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch landing page", code: 1002 },
    });
  }

  if (!coach) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Coach not found", code: 1003 },
    });
  }

  const landingpage = {
    ...coach.landing_pages,
    coachId: coach.id,
    brandSlug: coach.brand_slug,
    displayName: coach.display_name,
    avatarUrl: coach.avatar_url,
    stripeAccountId: coach.stripe_account_id,
    memberships: coach.memberships,
  };

  return reply.send({ status: "SUCCESS", landingpage });
};

const createLandingpage = async (request: any, reply: any) => {
  const { user } = request;
  const { landingpage } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can create landing pages", code: 1001 },
    });
  }

  const landingpageData = {
    coach_id: user.id,
    hero_cover_image_url: landingpage.heroCoverImageUrl || null,
    hero_title: landingpage.heroTitle || null,
    hero_description: landingpage.heroDescription || null,
    hero_about: landingpage.heroAbout || null,
    hero_trailer_video_url: landingpage.heroTrailerVideoUrl || null,
    access_cover_image_url: landingpage.accessCoverImageUrl || null,
    access_title: landingpage.accessTitle || null,
    access_description: landingpage.accessDescription || null,
    show_reviews: landingpage.showReviews ?? true,
    show_membership: landingpage.showMembership ?? true,
  };

  const { data, error } = await supabaseAdmin
    .from("landing_pages")
    .upsert(landingpageData, { onConflict: "coach_id" })
    .select()
    .single();

  if (error) {
    logger.error("[createLandingpage error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to create landing page", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", landingpage: data });
};

const updateLandingpage = async (request: any, reply: any) => {
  const { user } = request;
  const { updates } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can update landing pages", code: 1001 },
    });
  }

  const updateData: Record<string, any> = {};
  if (updates.heroCoverImageUrl !== undefined) updateData.hero_cover_image_url = updates.heroCoverImageUrl;
  if (updates.heroTitle !== undefined) updateData.hero_title = updates.heroTitle;
  if (updates.heroDescription !== undefined) updateData.hero_description = updates.heroDescription;
  if (updates.heroAbout !== undefined) updateData.hero_about = updates.heroAbout;
  if (updates.heroTrailerVideoUrl !== undefined) updateData.hero_trailer_video_url = updates.heroTrailerVideoUrl;
  if (updates.accessCoverImageUrl !== undefined) updateData.access_cover_image_url = updates.accessCoverImageUrl;
  if (updates.accessTitle !== undefined) updateData.access_title = updates.accessTitle;
  if (updates.accessDescription !== undefined) updateData.access_description = updates.accessDescription;
  if (updates.showReviews !== undefined) updateData.show_reviews = updates.showReviews;
  if (updates.showMembership !== undefined) updateData.show_membership = updates.showMembership;

  if (Object.keys(updateData).length === 0) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "No valid updates provided", code: 1002 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("landing_pages")
    .update(updateData)
    .eq("coach_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateLandingpage error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update landing page", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS", landingpage: data });
};

export { getLandingpage, updateLandingpage, createLandingpage, getLandingpageByBrand };
