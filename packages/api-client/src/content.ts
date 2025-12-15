import type { Video, Challenge } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Legacy API: GET /videos
 */
export function getVideos() {
  return apiFetch<Video[]>("/videos");
}

/**
 * Legacy API: GET /videos/:id
 */
export function getVideoById(id: string) {
  return apiFetch<Video>(`/videos/${id}`);
}

/**
 * Legacy API: GET /challenges
 */
export function getChallenges() {
  return apiFetch<Challenge[]>("/challenges");
}

/**
 * Legacy API: GET /challenges/:id
 */
export function getChallengeById(id: string) {
  return apiFetch<Challenge>(`/challenges/${id}`);
}
