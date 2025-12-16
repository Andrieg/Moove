import type { Video, Challenge } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Legacy API: GET /videos
 */
export async function getVideos() {
  const response = await apiFetch<{ status: string; videos: Video[] }>("/videos");
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

