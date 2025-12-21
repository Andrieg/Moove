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
      const videos = getStoredVideos();
      const index = videos.findIndex(v => v.id === video.id);
      if (index >= 0) {
        videos[index] = { ...videos[index], ...video };
        localStorage.setItem(VIDEOS_CACHE_KEY, JSON.stringify(videos));
      }
    }
    return { status: "SUCCESS" };
  }
}

/**
 * Legacy API: DELETE /videos/:id
 */
export async function deleteVideo(id: string) {
  try {
    const response = await apiFetch<{ status: string }>(`/videos/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (err) {
    console.warn("API unavailable for deleteVideo, using localStorage fallback");
    // Fallback: delete from localStorage
    if (typeof window !== "undefined") {
      const videos = getStoredVideos();
      const filtered = videos.filter(v => v.id !== id);
      localStorage.setItem(VIDEOS_CACHE_KEY, JSON.stringify(filtered));
    }
    return { status: "SUCCESS" };
  }
}

// ============== CHALLENGES ==============

const CHALLENGES_CACHE_KEY = "moove_challenges_cache";

// Generate mock challenge data for dev fallback
function generateMockChallenges(): Challenge[] {
  return [
    {
      id: "challenge-1",
      coachId: "coach-1",
      title: "Cardio Blast",
      description: "A 30-day cardio challenge to improve your endurance.",
      status: "started",
      startDate: "2024-10-02",
      endDate: "2024-11-01",
      participantsCount: 50,
      coverImageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
      workouts: [
        { id: "video-1", title: "Full Body HIIT", durationMinutes: 45 },
        { id: "video-2", title: "Core Strength", durationMinutes: 30 },
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "challenge-2",
      coachId: "coach-1",
      title: "Strength Builder",
      description: "Build muscle and increase strength over 4 weeks.",
      status: "scheduled",
      startDate: "2024-12-01",
      endDate: "2024-12-28",
      participantsCount: 25,
      coverImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      workouts: [
        { id: "video-3", title: "Upper Body Sculpt", durationMinutes: 45 },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "challenge-3",
      coachId: "coach-1",
      title: "Flexibility Focus",
      description: "Improve your flexibility and mobility.",
      status: "completed",
      startDate: "2024-08-01",
      endDate: "2024-08-31",
      participantsCount: 35,
      coverImageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      workouts: [],
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function getStoredChallenges(): Challenge[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CHALLENGES_CACHE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  // Initialize with mock data
  const mockChallenges = generateMockChallenges();
  localStorage.setItem(CHALLENGES_CACHE_KEY, JSON.stringify(mockChallenges));
  return mockChallenges;
}

/**
 * Legacy API: GET /challenges
 * @param brand - Optional brand/coach slug to filter content
 */
export async function getChallenges(brand?: string) {
  try {
    const url = brand ? `/challenges?brand=${encodeURIComponent(brand)}` : "/challenges";
    const response = await apiFetch<{ status: string; challenges: Challenge[] }>(url);
    // Cache the results
    if (typeof window !== "undefined" && response.challenges) {
      localStorage.setItem(CHALLENGES_CACHE_KEY, JSON.stringify(response.challenges));
    }
    return response.challenges || [];
  } catch (err) {
    console.warn("API unavailable for getChallenges, using localStorage fallback");
    return getStoredChallenges();
  }
}

/**
 * Legacy API: GET /challenges/:id
 */
export async function getChallengeById(id: string) {
  try {
    const response = await apiFetch<{ status: string; challenge: Challenge }>(`/challenges/${id}`);
    return response.challenge;
  } catch (err) {
    console.warn("API unavailable for getChallengeById, using localStorage fallback");
    const challenges = getStoredChallenges();
    return challenges.find(c => c.id === id) || null;
  }
}

/**
 * Legacy API: POST /challenges
 */
export async function createChallenge(challenge: Partial<Challenge>) {
  try {
    const response = await apiFetch<{ status: string; challenge?: Challenge }>("/challenges", {
      method: "POST",
      body: JSON.stringify({ challenge }),
    });
    return response;
  } catch (err) {
    console.warn("API unavailable for createChallenge, using localStorage fallback");
    // Fallback: create in localStorage
    if (typeof window !== "undefined") {
      const challenges = getStoredChallenges();
      const newChallenge: Challenge = {
        ...challenge,
        id: `challenge-${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as Challenge;
      challenges.unshift(newChallenge);
      localStorage.setItem(CHALLENGES_CACHE_KEY, JSON.stringify(challenges));
    }
    return { status: "SUCCESS" };
  }
}

/**
 * Legacy API: PATCH /challenges
 */
export async function updateChallenge(challenge: Partial<Challenge>, fields: string[]) {
  try {
    const response = await apiFetch<{ status: string; challenge?: Challenge }>("/challenges", {
      method: "PATCH",
      body: JSON.stringify({ challenge, fields }),
    });
    return response;
  } catch (err) {
    console.warn("API unavailable for updateChallenge, using localStorage fallback");
    // Fallback: update in localStorage
    if (typeof window !== "undefined") {
      const challenges = getStoredChallenges();
      const index = challenges.findIndex(c => c.id === challenge.id);
      if (index >= 0) {
        challenges[index] = { ...challenges[index], ...challenge };
        localStorage.setItem(CHALLENGES_CACHE_KEY, JSON.stringify(challenges));
      }
    }
    return { status: "SUCCESS" };
  }
}

/**
 * Legacy API: DELETE /challenges/:id
 */
export async function deleteChallenge(id: string) {
  try {
    const response = await apiFetch<{ status: string }>(`/challenges/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (err) {
    console.warn("API unavailable for deleteChallenge, using localStorage fallback");
    // Fallback: delete from localStorage
    if (typeof window !== "undefined") {
      const challenges = getStoredChallenges();
      const filtered = challenges.filter(c => c.id !== id);
      localStorage.setItem(CHALLENGES_CACHE_KEY, JSON.stringify(filtered));
    }
    return { status: "SUCCESS" };
  }
}

