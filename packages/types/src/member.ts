import type { User } from "./user";
export interface Member extends User {
  coachId: string;
  subscriptionId?: string;
}
