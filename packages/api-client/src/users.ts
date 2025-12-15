import type { User } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Legacy API: GET /users/me (protected)
 */
export function getCurrentUserProfile() {
  return apiFetch<User>("/users/me");
}

/**
 * Legacy API: GET /users/:userID (if exists)
 * Keep this if used later; adjust if the API uses a different path.
 */
export function getUserById(userId: string) {
  return apiFetch<User>(`/users/${userId}`);
}
