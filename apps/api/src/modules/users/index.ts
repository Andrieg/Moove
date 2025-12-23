import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const whoAmI = async (request: any, reply: any) => {
  const { user } = request;

  if (!user?.id) {
    return reply.code(401).send({
      status: "FAILED",
      error: {
        message: "Unauthorized",
        code: 1001,
      },
    });
  }

  if (user.role === "coach") {
    const { data: coach, error } = await supabaseAdmin
      .from("coaches")
      .select(`
        *,
        landing_pages(*),
        memberships(*)
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      logger.error("[/users/me coach error]", { error });
      return reply.code(500).send({
        status: "FAILED",
        error: { message: "Failed to fetch user data", code: 1002 },
      });
    }

    if (!coach) {
      return reply.code(404).send({
        status: "FAILED",
        error: { message: "Coach not found", code: 1003 },
      });
    }

    const { data: videos } = await supabaseAdmin
      .from("videos")
      .select("*")
      .eq("coach_id", user.id);

    const { data: challenges } = await supabaseAdmin
      .from("challenges")
      .select("*, challenge_videos(*, videos(*))")
      .eq("coach_id", user.id);

    const response = {
      id: coach.id,
      email: coach.email,
      role: "coach",
      firstName: coach.first_name,
      lastName: coach.last_name,
      displayName: coach.display_name,
      brandSlug: coach.brand_slug,
      avatarUrl: coach.avatar_url,
      stripeAccountId: coach.stripe_account_id,
      landingPage: coach.landing_pages,
      memberships: coach.memberships,
      createdAt: coach.created_at,
      updatedAt: coach.updated_at,
      content: {
        videos: videos || [],
        challenges: challenges || [],
      },
    };

    logger.info("[/users/me coach]", { userId: user.id });
    return reply.send({ status: "SUCCESS", user: response });
  }

  if (user.role === "member") {
    const { data: member, error } = await supabaseAdmin
      .from("members")
      .select(`
        *,
        coaches(
          id,
          email,
          display_name,
          brand_slug,
          avatar_url
        )
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      logger.error("[/users/me member error]", { error });
      return reply.code(500).send({
        status: "FAILED",
        error: { message: "Failed to fetch user data", code: 1002 },
      });
    }

    if (!member) {
      return reply.code(404).send({
        status: "FAILED",
        error: { message: "Member not found", code: 1003 },
      });
    }

    const { data: videos } = await supabaseAdmin
      .from("videos")
      .select("*")
      .eq("coach_id", member.coach_id)
      .eq("published", true);

    const { data: challenges } = await supabaseAdmin
      .from("challenges")
      .select("*, challenge_videos(*, videos(*))")
      .eq("coach_id", member.coach_id);

    const { data: progress } = await supabaseAdmin
      .from("member_progress")
      .select("*")
      .eq("member_id", user.id);

    const response = {
      id: member.id,
      email: member.email,
      role: "member",
      firstName: member.first_name,
      lastName: member.last_name,
      avatarUrl: member.avatar_url,
      status: member.status,
      coachId: member.coach_id,
      coach: member.coaches,
      brandSlug: member.coaches?.brand_slug,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
      content: {
        videos: videos || [],
        challenges: challenges || [],
      },
      progress: progress || [],
    };

    logger.info("[/users/me member]", { userId: user.id });
    return reply.send({ status: "SUCCESS", user: response });
  }

  return reply.code(400).send({
    status: "FAILED",
    error: { message: "Unknown user role", code: 1004 },
  });
};

const updateUser = async (request: any, reply: any) => {
  const { user } = request;
  const { updates } = request.body.parsed;

  if (!user?.id || !updates) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "Invalid request", code: 1001 },
    });
  }

  const table = user.role === "coach" ? "coaches" : "members";

  const updateData: Record<string, any> = {};
  if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
  if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
  if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
  if (updates.brandSlug !== undefined) updateData.brand_slug = updates.brandSlug;
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;

  if (user.role === "member") {
    if (updates.dob !== undefined) updateData.dob = updates.dob;
    if (updates.gender !== undefined) updateData.gender = updates.gender;
    if (updates.fitnessGoal !== undefined) updateData.fitness_goal = updates.fitnessGoal;
    if (updates.weightKg !== undefined) updateData.weight_kg = updates.weightKg;
    if (updates.heightCm !== undefined) updateData.height_cm = updates.heightCm;
  }

  if (Object.keys(updateData).length === 0) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "No valid updates provided", code: 1002 },
    });
  }

  if (updates.brandSlug && user.role === "coach") {
    const { data: existing } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("brand_slug", updates.brandSlug)
      .neq("id", user.id)
      .maybeSingle();

    if (existing) {
      return reply.code(400).send({
        status: "FAILED",
        error: {
          field: "brandSlug",
          message: "This brand slug is already taken",
          code: 1003,
        },
      });
    }
  }

  const { data, error } = await supabaseAdmin
    .from(table)
    .update(updateData)
    .eq("id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateUser error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update user", code: 1004 },
    });
  }

  return reply.send({ status: "SUCCESS", user: data });
};

const createTrainer = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Trainer functionality not yet implemented in Supabase", code: 5001 },
  });
};

const getTrainersbyCoach = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Trainer functionality not yet implemented in Supabase", code: 5001 },
  });
};

export { whoAmI, updateUser, createTrainer, getTrainersbyCoach };
