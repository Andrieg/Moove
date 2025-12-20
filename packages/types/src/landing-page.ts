export type LandingPageConfig = {
  id: string;
  coachId: string;

  hero: {
    coverImageUrl: string;        // required
    title: string;                // required
    description: string;          // required
    about: string;                // required
    trailerVideoUrl?: string;     // optional
  };

  access: {
    coverImageUrl: string;        // required
    title: string;                // required
    description: string;          // required
    showReviews: boolean;         // default true
    showMembership: boolean;      // default true
  };

  updatedAt?: string;
  createdAt?: string;
};
