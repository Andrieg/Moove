import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const updateMember = async (request: any, reply: any) => {
  const { user } = request;
  const { memberId, updates } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can update members", code: 1001 },
    });
  }

  const { data: member } = await supabaseAdmin
    .from("members")
    .select("id, coach_id")
    .eq("id", memberId)
    .eq("coach_id", user.id)
    .maybeSingle();

  if (!member) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Member not found or access denied", code: 1002 },
    });
  }

  const updateData: Record<string, any> = {};
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.fitnessGoal !== undefined) updateData.fitness_goal = updates.fitnessGoal;

  if (Object.keys(updateData).length === 0) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "No valid updates provided", code: 1003 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("members")
    .update(updateData)
    .eq("id", memberId)
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateMember error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update member", code: 1004 },
    });
  }

  return reply.send({ status: "SUCCESS", member: data });
};

const getMembersByCoach = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can view their members", code: 1001 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("members")
    .select(`
      *,
      subscriptions(*)
    `)
    .eq("coach_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("[getMembersByCoach error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch members", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", members: data || [] });
};

const getMemberById = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can view member details", code: 1001 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("members")
    .select(`
      *,
      subscriptions(*),
      member_progress(*, videos(*), challenges(*))
    `)
    .eq("id", id)
    .eq("coach_id", user.id)
    .maybeSingle();

  if (error) {
    logger.error("[getMemberById error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch member", code: 1002 },
    });
  }

  if (!data) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Member not found", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS", member: data });
};

const getMemberProgress = async (request: any, reply: any) => {
  const { user } = request;

  if (user?.role !== "member") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only members can view their progress", code: 1001 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("member_progress")
    .select("*, videos(*), challenges(*)")
    .eq("member_id", user.id);

  if (error) {
    logger.error("[getMemberProgress error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch progress", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", progress: data || [] });
};

const updateMemberProgress = async (request: any, reply: any) => {
  const { user } = request;
  const { videoId, challengeId, completed, watchedSeconds } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only members can update their progress", code: 1001 },
    });
  }

  const progressData: Record<string, any> = {
    member_id: user.id,
    video_id: videoId || null,
    challenge_id: challengeId || null,
    completed: completed ?? false,
    watched_seconds: watchedSeconds || 0,
  };

  const { data, error } = await supabaseAdmin
    .from("member_progress")
    .upsert(progressData, {
      onConflict: "member_id,video_id,challenge_id",
    })
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateMemberProgress error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update progress", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", progress: data });
};

export {
  updateMember,
  getMembersByCoach,
  getMemberById,
  getMemberProgress,
  updateMemberProgress,
};
