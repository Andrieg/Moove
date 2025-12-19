export interface Membership {
  id: string;
  coachId: string;
  title: string;
  description: string;
  priceMonthly: number;
  currency: string; // "GBP" default
  benefits?: string[];
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}
