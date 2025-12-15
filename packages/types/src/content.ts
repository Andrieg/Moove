export interface Video {
  id: string;
  title?: string;
  coachId?: string;
  published?: boolean;
  durationSeconds?: number;
  [key: string]: unknown;
}

export interface Challenge {
  id: string;
  title?: string;
  coachId?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}
