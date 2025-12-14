import type { AuthUser } from "@moove/types";
import { apiFetch } from "./http";

/**
 * Get the currently authenticated user.
 * You already used this in apps/client to prove wiring.
 */
export function getCurrentUser() {
  return apiFetch<AuthUser>("/auth/me");
}

/**
 * Request a magic link for passwordless login.
 * NOTE: endpoint path/body might differ in legacy API.
 * We'll align once we confirm actual routes.
 */
export function requestMagicLink(email: string) {
  return apiFetch<{ ok: boolean }>(`/auth/magic-link`, {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

/**
 * Verify the magic link token and receive a JWT (or session).
 * NOTE: response shape may differ; adjust to match legacy.
 */
export function verifyMagicLink(token: string) {
  return apiFetch<{ jwt: string }>(`/auth/verify`, {
    method: "POST",
    body: JSON.stringify({ token })
  });
}
