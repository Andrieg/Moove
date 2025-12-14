import { AuthUser } from "@moove/types";
import { apiFetch } from "./http";

export function getCurrentUser() {
  return apiFetch<AuthUser>("/auth/me");
}

