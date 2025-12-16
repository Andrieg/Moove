// /app/packages/api-client/src/users.ts

import type { User } from "@moove/types";
import { apiFetch } from "./http";

type WhoAmIResponse =
  | { status: "SUCCESS"; user: User }
  | { status: "FAIL"; error: string; code?: number };

export async function getCurrentUserProfile(): Promise<User> {
  const res = await apiFetch<WhoAmIResponse>("/users/me");

  if (res.status === "SUCCESS") return res.user;

  throw new Error(res.error || "Unknown /users/me failure");
}

export function getUserById(userId: string) {
  return apiFetch<User>(`/users/${userId}`);
}