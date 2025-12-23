import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const getContent = async (request: any, reply: any) => {
  const { user } = request;
  const { coachId, brandSlug } = request.query;

  if (!user?.id) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized", code: 1001 },
    });
  }

  let targetCoachId = coachId;

  if (!targetCoachId && brandSlug) {
    const { data: coach } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("brand_slug", brandSlug)
      .maybeSingle();

    if (!coach) {
      return reply.code(404).send({
        status: "FAILED",
        error: { message: "Coach not found", code: 1002 },
      });
    }
    targetCoachId = coach.id;
  }

  if (!targetCoachId && user.role === "member") {
    targetCoachId = user.coachId;
  }

  if (!targetCoachId && user.role === "coach") {
    targetCoachId = user.id;
  }

  if (!targetCoachId) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "Coach ID or brand slug required", code: 1003 },
    });
  }

  const { data: videos, error: videosError } = await supabaseAdmin
    .from("videos")
    .select("*")
    .eq("coach_id", targetCoachId)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (videosError) {
    logger.error("[getContent videos error]", { error: videosError });
  }

  const { data: challenges, error: challengesError } = await supabaseAdmin
    .from("challenges")
    .select("*, challenge_videos(*, videos(*))")
    .eq("coach_id", targetCoachId)
    .order("created_at", { ascending: false });

  if (challengesError) {
    logger.error("[getContent challenges error]", { error: challengesError });
  }

  let progress: any[] = [];
  let totalViewTime = 0;

  if (user.role === "member") {
    const { data: memberProgress } = await supabaseAdmin
      .from("member_progress")
      .select("*")
      .eq("member_id", user.id);

    if (memberProgress) {
      progress = memberProgress;
      totalViewTime = memberProgress.reduce(
        (acc, p) => acc + (p.watched_seconds || 0),
        0
      );
    }
  }

  const videosWithProgress = videos?.map((video) => {
    const videoProgress = progress.find((p) => p.video_id === video.id);
    return {
      ...video,
      userProgress: videoProgress || null,
    };
  });

  const challengesWithProgress = challenges?.map((challenge) => {
    const challengeProgress = progress.find(
      (p) => p.challenge_id === challenge.id
    );
    return {
      ...challenge,
      userProgress: challengeProgress || null,
    };
  });

  return reply.send({
    status: "SUCCESS",
    data: {
      videos: videosWithProgress || [],
      challenges: challengesWithProgress || [],
      totalViewTime,
    },
  });
};

const postViewContent = async (request: any, reply: any) => {
  const { user } = request;
  const { videoId, challengeId } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const progressData: Record<string, any> = {
    member_id: user.id,
    video_id: videoId || null,
    challenge_id: challengeId || null,
  };

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("id")
    .eq("member_id", user.id)
    .eq("video_id", videoId || null)
    .eq("challenge_id", challengeId || null)
    .maybeSingle();

  if (!existing) {
    await supabaseAdmin.from("member_progress").insert(progressData);
  }

  return reply.send({ status: "SUCCESS" });
};

const postViewContentTime = async (request: any, reply: any) => {
  const { user } = request;
  const { videoId, challengeId, watchedSeconds } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("*")
    .eq("member_id", user.id)
    .eq("video_id", videoId || null)
    .eq("challenge_id", challengeId || null)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("member_progress")
      .update({
        watched_seconds: (existing.watched_seconds || 0) + (watchedSeconds || 0),
      })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("member_progress").insert({
      member_id: user.id,
      video_id: videoId || null,
      challenge_id: challengeId || null,
      watched_seconds: watchedSeconds || 0,
    });
  }

  return reply.send({ status: "SUCCESS" });
};

const postFavourite = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Favorites not yet implemented", code: 5001 },
  });
};

const postViewEnded = async (request: any, reply: any) => {
  const { user } = request;
  const { videoId, challengeId } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("*")
    .eq("member_id", user.id)
    .eq("video_id", videoId || null)
    .eq("challenge_id", challengeId || null)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("member_progress")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("member_progress").insert({
      member_id: user.id,
      video_id: videoId || null,
      challenge_id: challengeId || null,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  }

  return reply.send({ status: "SUCCESS" });
};

const postChallangeCompleted = async (request: any, reply: any) => {
  const { user } = request;
  const { challengeId } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("*")
    .eq("member_id", user.id)
    .eq("challenge_id", challengeId)
    .is("video_id", null)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("member_progress")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("member_progress").insert({
      member_id: user.id,
      challenge_id: challengeId,
      video_id: null,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  }

  return reply.send({ status: "SUCCESS" });
};

const postChallangeViewEnded = async (request: any, reply: any) => {
  const { user } = request;
  const { challengeId, videoId } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("*")
    .eq("member_id", user.id)
    .eq("challenge_id", challengeId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("member_progress")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("member_progress").insert({
      member_id: user.id,
      challenge_id: challengeId,
      video_id: videoId,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  }

  return reply.send({ status: "SUCCESS" });
};

const postChallangeViewStarted = async (request: any, reply: any) => {
  const { user } = request;
  const { challengeId, videoId } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("id")
    .eq("member_id", user.id)
    .eq("challenge_id", challengeId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (!existing) {
    await supabaseAdmin.from("member_progress").insert({
      member_id: user.id,
      challenge_id: challengeId,
      video_id: videoId,
      completed: false,
    });
  }

  return reply.send({ status: "SUCCESS" });
};

const postJoinLiveClass = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Live classes not yet implemented", code: 5001 },
  });
};

const postJoinChallange = async (request: any, reply: any) => {
  const { user } = request;
  const { challengeId } = request.body.parsed;

  if (user?.role !== "member") {
    return reply.send({ status: "SUCCESS" });
  }

  const { data: existing } = await supabaseAdmin
    .from("member_progress")
    .select("id")
    .eq("member_id", user.id)
    .eq("challenge_id", challengeId)
    .is("video_id", null)
    .maybeSingle();

  if (!existing) {
    await supabaseAdmin.from("member_progress").insert({
      member_id: user.id,
      challenge_id: challengeId,
      video_id: null,
      completed: false,
    });
  }

  return reply.send({ status: "SUCCESS" });
};

export {
  getContent,
  postViewContent,
  postFavourite,
  postViewContentTime,
  postViewEnded,
  postJoinLiveClass,
  postJoinChallange,
  postChallangeViewEnded,
  postChallangeViewStarted,
  postChallangeCompleted,
};
