export interface Coach extends User {
  brandId: string;
  displayName: string;
  stripeAccountId?: string;
}
