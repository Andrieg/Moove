export type UserRole = "coach" | "member";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  brand?: string; // For members: the coach's brand they subscribed to
  brandSlug?: string; // For coaches: their own brand slug
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
