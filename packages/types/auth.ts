export interface AuthUser {
  id: string;
  email: string;
  role: "coach" | "member" | "admin";
}
