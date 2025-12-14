import type { Video } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Fetch list of videos accessible to current user (member/coach).
 */
export function getVideos() {
  return apiFetch<Video[]>(`/videos`);
}

/**
 * Fetch a single video by id.
 */
export function getVideoById(videoId: string) {
  return apiFetch<Video>(`/videos/${videoId}`);
}

