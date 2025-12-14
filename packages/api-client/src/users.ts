import type { User } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Fetch a user by ID (admin/coach use cases).
 */
export function getUserById(userId: string) {
  return apiFetch<User>(`/users/${userId}`);
}

