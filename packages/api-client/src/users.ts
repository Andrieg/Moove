import type { User } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Legacy API: GET /users/me (protected)
 */
export function getCurrentUserProfile() {
  return apiFetch<User>("/users/me");
}

/**
 * Legacy API: GET /users/:userID
 * Keep for later; adjust if backend differs.
 */
export function getUserById(userId: string) {
  return apiFetch<User>(`/users/${userId}`);
}
