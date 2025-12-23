import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

function extractVideoInfo(url: string): { platform: string | null; videoId: string | null } {
  if (!url) return { platform: null, videoId: null };

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return { platform: "youtube", videoId: youtubeMatch[1] };
  }

  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return { platform: "vimeo", videoId: vimeoMatch[1] };
  }

  return { platform: null, videoId: null };
}

const createVideo = async (request: any, reply: any) => {
  const { user } = request;
  const { video } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can create videos", code: 1001 },
    });
  }

  const { platform, videoId } = extractVideoInfo(video.videoUrl);

  const videoData = {
    coach_id: user.id,
    title: video.title,
    description: video.description || null,
    video_url: video.videoUrl,
    video_platform: platform,
    video_id: videoId,
    thumbnail_url: video.thumbnailUrl || null,
    duration_seconds: video.durationSeconds || null,
    category: video.category || null,
    target: video.target || null,
    fitness_goal: video.fitnessGoal || null,
    published: video.published ?? false,
    featured: video.featured ?? false,
  };

  const { data, error } = await supabaseAdmin
    .from("videos")
    .insert(videoData)
    .select()
    .single();

  if (error) {
    logger.error("[createVideo error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to create video", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", video: data });
};

const updateVideo = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;
  const { updates } = request.body.parsed;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can update videos", code: 1001 },
    });
  }

  const updateData: Record<string, any> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url = updates.thumbnailUrl;
  if (updates.durationSeconds !== undefined) updateData.duration_seconds = updates.durationSeconds;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.target !== undefined) updateData.target = updates.target;
  if (updates.fitnessGoal !== undefined) updateData.fitness_goal = updates.fitnessGoal;
  if (updates.published !== undefined) updateData.published = updates.published;
  if (updates.featured !== undefined) updateData.featured = updates.featured;

  if (updates.videoUrl !== undefined) {
    updateData.video_url = updates.videoUrl;
    const { platform, videoId } = extractVideoInfo(updates.videoUrl);
    updateData.video_platform = platform;
    updateData.video_id = videoId;
  }

  if (Object.keys(updateData).length === 0) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "No valid updates provided", code: 1002 },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("videos")
    .update(updateData)
    .eq("id", id)
    .eq("coach_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error("[updateVideo error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to update video", code: 1003 },
    });
  }

  if (!data) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Video not found or access denied", code: 1004 },
    });
  }

  return reply.send({ status: "SUCCESS", video: data });
};

const getVideos = async (request: any, reply: any) => {
  const { user } = request;
  const { brandSlug, published } = request.query || {};

  if (!user?.id) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized", code: 1001 },
    });
  }

  let query = supabaseAdmin.from("videos").select("*");

  if (user.role === "coach") {
    query = query.eq("coach_id", user.id);
  } else if (user.role === "member") {
    query = query.eq("coach_id", user.coachId).eq("published", true);
  } else if (brandSlug) {
    const { data: coach } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("brand_slug", brandSlug)
      .maybeSingle();

    if (!coach) {
      return reply.send({ status: "SUCCESS", videos: [] });
    }
    query = query.eq("coach_id", coach.id).eq("published", true);
  }

  if (published !== undefined && user.role === "coach") {
    query = query.eq("published", published === "true");
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    logger.error("[getVideos error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch videos", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS", videos: data || [] });
};

const getVideoById = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;

  if (!user?.id) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized", code: 1001 },
    });
  }

  let query = supabaseAdmin.from("videos").select("*").eq("id", id);

  if (user.role === "coach") {
    query = query.eq("coach_id", user.id);
  } else if (user.role === "member") {
    query = query.eq("coach_id", user.coachId).eq("published", true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    logger.error("[getVideoById error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to fetch video", code: 1002 },
    });
  }

  if (!data) {
    return reply.code(404).send({
      status: "FAILED",
      error: { message: "Video not found", code: 1003 },
    });
  }

  return reply.send({ status: "SUCCESS", video: data });
};

const deleteVideo = async (request: any, reply: any) => {
  const { user } = request;
  const { id } = request.params;

  if (user?.role !== "coach") {
    return reply.code(403).send({
      status: "FAILED",
      error: { message: "Only coaches can delete videos", code: 1001 },
    });
  }

  const { error } = await supabaseAdmin
    .from("videos")
    .delete()
    .eq("id", id)
    .eq("coach_id", user.id);

  if (error) {
    logger.error("[deleteVideo error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to delete video", code: 1002 },
    });
  }

  return reply.send({ status: "SUCCESS" });
};

export { createVideo, updateVideo, getVideos, getVideoById, deleteVideo };
