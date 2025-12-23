import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const createChallange = async (request: any, reply: any) => {
  const { user } = request;
  const { challenge } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can create challenges", code: 1001 },
    });
  }

  const challengeData = {
    coach_id: user.id,
    title: challenge.title,
    description: challenge.description || null,
    cover_image_url: challenge.coverImageUrl || null,
    status: challenge.status || "scheduled",
    start_date: challenge.startDate || null,
    end_date: challenge.endDate || null,
  };

  const { data, error } = await supabaseAdmin
    .from("challenges")
    .insert(challengeData)
    .select()
    .single();

  if (error) {
    logger.error("[createChallenge error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to create challenge", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", challenge: data });
};

const updateChallange = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;
  const { updates } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can update challenges", code: 1001 },
    });
  }

  const updateData: Record<string, any> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate;

  if (Object.keys(updateData).length === 0) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "No valid updates provided", code: 1002 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("challenges")
    .update(updateData)
    .eq("id", id)
    .eq("coach_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateChallenge error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update challenge", code: 1003 },
    });
  }

  if (!data) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Challenge not found or access denied", code: 1004 },
    });
  }

  return reply.send({ status: "SUCCESS", challenge: data });
};

const getAllChallanges = async (request: any, reply: any) => {
  const { user } = request;
  const { brandSlug } = request.query || {};

  if (!user?.id) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized", code: 1001 },
    });
  }

  let query = supabaseAdmin
    .from("challenges")
    .select("*, challenge_videos(*, videos(*))");

  if (user.role === "coach") {
    query = query.eq("coach_id", user.id);
  } else if (user.role === "member") {
    query = query.eq("coach_id", user.coachId);
  } else if (brandSlug) {
    const { data: coach } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("brand_slug", brandSlug)
      .maybeSingle();

    if (!coach) {
      return reply.send({ status: "SUCCESS", challenges: [] });
    }
    query = query.eq("coach_id", coach.id);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    logger.error("[getChallenges error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch challenges", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", challenges: data || [] });
};

const getChallangeById = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;

  if (!user?.id) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized", code: 1001 },
    });
  }

  let query = supabaseAdmin
    .from("challenges")
    .select("*, challenge_videos(*, videos(*))")
    .eq("id", id);

  if (user.role === "coach") {
    query = query.eq("coach_id", user.id);
  } else if (user.role === "member") {
    query = query.eq("coach_id", user.coachId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    logger.error("[getChallengeById error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch challenge", code: 1002 },
    });
  }

  if (!data) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Challenge not found", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS", challenge: data });
};

const deleteChallange = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can delete challenges", code: 1001 },
    });
  }

  const { error } = await supabaseAdmin
    .from("challenges")
    .delete()
    .eq("id", id)
    .eq("coach_id", user.id);

  if (error) {
    logger.error("[deleteChallenge error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to delete challenge", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS" });
};

const addVideoToChallenge = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;
  const { videoId, dayNumber, sortOrder } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can modify challenges", code: 1001 },
    });
  }

  const { data: challenge } = await supabaseAdmin
    .from("challenges")
    .select("id")
    .eq("id", id)
    .eq("coach_id", user.id)
    .maybeSingle();

  if (!challenge) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Challenge not found or access denied", code: 1002 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("challenge_videos")
    .insert({
      challenge_id: id,
      video_id: videoId,
      day_number: dayNumber || 1,
      sort_order: sortOrder || 0,
    })
    .select("*, videos(*)")
    .single();

  if (error) {
    logger.error("[addVideoToChallenge error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to add video to challenge", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS", challengeVideo: data });
};

const removeVideoFromChallenge = async (request: any, reply: any) => {
  const { user } = request;
  const { id, videoId } = request.params;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can modify challenges", code: 1001 },
    });
  }

  const { data: challenge } = await supabaseAdmin
    .from("challenges")
    .select("id")
    .eq("id", id)
    .eq("coach_id", user.id)
    .maybeSingle();

  if (!challenge) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Challenge not found or access denied", code: 1002 },
    });
  }

  const { error } = await supabaseAdmin
    .from("challenge_videos")
    .delete()
    .eq("challenge_id", id)
    .eq("video_id", videoId);

  if (error) {
    logger.error("[removeVideoFromChallenge error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to remove video from challenge", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS" });
};

export {
  createChallange,
  updateChallange,
  getAllChallanges,
  getChallangeById,
  deleteChallange,
  addVideoToChallenge,
  removeVideoFromChallenge,
};
