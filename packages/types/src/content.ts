export interface Video {
  id: string;
  title?: string;
  coachId?: string;
  published?: boolean;
  durationSeconds?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  description?: string;
  target?: string;
  category?: string;
  fitnessGoal?: string;
  featured?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export type ChallengeStatus = "all" | "started" | "scheduled" | "completed";

export type ChallengeWorkoutItem = {
  id: string;
  title: string;
  durationMinutes?: number;
  thumbnailUrl?: string;
};

export interface Challenge {
  id: string;
  coachId?: string;
  title?: string;
  description?: string;
  status?: "started" | "scheduled" | "completed";
  startDate?: string;
  endDate?: string;
  participantsCount?: number;
  coverImageUrl?: string;
  workouts?: ChallengeWorkoutItem[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
