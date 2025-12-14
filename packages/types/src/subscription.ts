export interface Subscription {
  id: string;
  memberId: string;
  coachId: string;
  status: "active" | "paused" | "cancelled";
  stripeSubscriptionId: string;
}
