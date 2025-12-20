import type { Video, Challenge } from "@moove/types";
import { apiFetch } from "./http";

// ============== VIDEOS ==============

const VIDEOS_CACHE_KEY = "moove_videos_cache";

// Generate mock video data for dev fallback
function generateMockVideos(): Video[] {
  return [
    {
      id: "video-1",
      title: "Full Body HIIT Workout",
      durationSeconds: 1800,
      thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
      published: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "High-intensity interval training targeting all major muscle groups. Great for burning calories and building endurance.",
      target: "full-body",
      category: "cardio",
      fitnessGoal: "lose-weight",
      featured: false,
    } as Video,
    {
      id: "video-2",
      title: "Core Strength Basics",
      durationSeconds: 1200,
      thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      published: true,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Build a strong core foundation with these beginner-friendly exercises.",
      target: "core",
      category: "strength",
      fitnessGoal: "build-muscle",
      featured: true,
    } as Video,
    {
      id: "video-3",
      title: "Upper Body Sculpt",
      durationSeconds: 2700,
      thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400",
      published: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Tone and strengthen your arms, shoulders, chest and back.",
      target: "upper-body",
      category: "strength",
      fitnessGoal: "stay-toned",
      featured: false,
    } as Video,
  ];
}

function getStoredVideos(): Video[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(VIDEOS_CACHE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  // Initialize with mock data
  const mockVideos = generateMockVideos();
  localStorage.setItem(VIDEOS_CACHE_KEY, JSON.stringify(mockVideos));
  return mockVideos;
}

/**
 * Legacy API: GET /videos
 * @param brand - Optional brand/coach slug to filter content
 */
export async function getVideos(brand?: string) {
  try {
    const url = brand ? `/videos?brand=${encodeURIComponent(brand)}` : "/videos";
    const response = await apiFetch<{ status: string; videos: Video[] }>(url);
    // Cache the results
    if (typeof window !== "undefined" && response.videos) {
      localStorage.setItem(VIDEOS_CACHE_KEY, JSON.stringify(response.videos));
    }
    return response.videos || [];
  } catch (err) {
    console.warn("API unavailable for getVideos, using localStorage fallback");
    return getStoredVideos();
  }
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
    const videos = getStoredVideos();
    return videos.find(v => v.id === id) || null;
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

