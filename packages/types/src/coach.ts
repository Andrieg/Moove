import type { User } from "./user";

export interface Coach extends User {
  brandId: string;
  displayName: string;
  stripeAccountId?: string;
}
