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
  const response = await apiFetch<{ status: string; video: Video }>(`/videos/${id}`);
  return response.video;
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
  const response = await apiFetch<{ status: string; video?: Video }>("/videos", {
    method: "PATCH",
    body: JSON.stringify({ video, fields }),
  });
  return response;
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
 */
export async function getChallenges() {
  const response = await apiFetch<{ status: string; challenges: Challenge[] }>("/challenges");
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

