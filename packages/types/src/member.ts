import type { User } from "./user";

export interface Member extends User {
  coachId: string;
  subscriptionId?: string;
  
  // Profile fields
  dob?: string;          // ISO date
  gender?: string;       // e.g. "Female"
  fitnessGoal?: string;  // e.g. "Be more active"
  weightKg?: number;
  heightCm?: number;
  
  // Status and activity
  status?: "active" | "inactive";
  lastActivityAt?: string; // ISO timestamp
  
  avatarUrl?: string;
}
