export interface User {
  id: string;
  email?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
