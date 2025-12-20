import type { Video, Challenge } from "@moove/types";
import { apiFetch } from "./http";

// ============== VIDEOS ==============

/**
 * Legacy API: GET /videos
 * @param brand - Optional brand/coach slug to filter content
 */
export async function getVideos(brand?: string) {
  const url = brand ? `/videos?brand=${encodeURIComponent(brand)}` : "/videos";
  const response = await apiFetch<{ status: string; videos: Video[] }>(url);
  return response.videos || [];
}

/**
 * Legacy API: GET /videos/:id
 */
export async function getVideoById(id: string) {
  try {
    const response = await apiFetch<{ status: string; video: Video }>(`/videos/${id}`);
    return response.video;
  } catch (err) {
    console.warn("API unavailable for getVideoById, using localStorage fallback");
    // Fallback: get from localStorage cache
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("moove_videos_cache");
      if (stored) {
        try {
          const videos = JSON.parse(stored) as Video[];
          return videos.find(v => v.id === id) || null;
        } catch {}
      }
    }
    return null;
  }
}

/**
 * Legacy API: POST /videos
 */
export async function createVideo(video: Partial<Video>) {
  const response = await apiFetch<{ status: string; video?: Video }>("/videos", {
    method: "POST",
    body: JSON.stringify({ video }),
  });
  return response;
}

/**
 * Legacy API: PATCH /videos
 */
export async function updateVideo(video: Partial<Video>, fields: string[]) {
  try {
    const response = await apiFetch<{ status: string; video?: Video }>("/videos", {
      method: "PATCH",
      body: JSON.stringify({ video, fields }),
    });
    return response;
  } catch (err) {
    console.warn("API unavailable for updateVideo, using localStorage fallback");
    // Fallback: update in localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("moove_videos_cache");
      if (stored) {
        try {
          const videos = JSON.parse(stored) as Video[];
          const index = videos.findIndex(v => v.id === video.id);
          if (index >= 0) {
            videos[index] = { ...videos[index], ...video };
            localStorage.setItem("moove_videos_cache", JSON.stringify(videos));
          }
        } catch {}
      }
    }
    return { status: "SUCCESS" };
  }
}

/**
 * Legacy API: DELETE /videos/:id
 */
export async function deleteVideo(id: string) {
  const response = await apiFetch<{ status: string }>(`/videos/${id}`, {
    method: "DELETE",
  });
  return response;
}

// ============== CHALLENGES ==============

/**
 * Legacy API: GET /challenges
 * @param brand - Optional brand/coach slug to filter content
 */
export async function getChallenges(brand?: string) {
  const url = brand ? `/challenges?brand=${encodeURIComponent(brand)}` : "/challenges";
  const response = await apiFetch<{ status: string; challenges: Challenge[] }>(url);
  return response.challenges || [];
}

/**
 * Legacy API: GET /challenges/:id
 */
export async function getChallengeById(id: string) {
  const response = await apiFetch<{ status: string; challenge: Challenge }>(`/challenges/${id}`);
  return response.challenge;
}

/**
 * Legacy API: POST /challenges
 */
export async function createChallenge(challenge: Partial<Challenge>) {
  const response = await apiFetch<{ status: string; challenge?: Challenge }>("/challenges", {
    method: "POST",
    body: JSON.stringify({ challenge }),
  });
  return response;
}

/**
 * Legacy API: PATCH /challenges
 */
export async function updateChallenge(challenge: Partial<Challenge>, fields: string[]) {
  const response = await apiFetch<{ status: string; challenge?: Challenge }>("/challenges", {
    method: "PATCH",
    body: JSON.stringify({ challenge, fields }),
  });
  return response;
}

/**
 * Legacy API: DELETE /challenges/:id
 */
export async function deleteChallenge(id: string) {
  const response = await apiFetch<{ status: string }>(`/challenges/${id}`, {
    method: "DELETE",
  });
  return response;
}

