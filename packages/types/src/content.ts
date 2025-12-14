export interface Video {
  id: string;
  coachId: string;
  title: string;
  durationSeconds: number;
  published: boolean;
}

export interface Challenge {
  id: string;
  coachId: string;
  title: string;
  startDate: string;
  endDate: string;
}
