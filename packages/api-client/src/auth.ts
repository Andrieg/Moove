import { apiFetch } from "./http";

export type LoginRequest = {
  email: string;
  client?: boolean;
  target?: string;
  brand?: string;
};

export type LoginResponse =
  | { status: "SUCCESS"; user: string }
  | { status: "FAIL"; error: string; code?: number };

/**
 * Legacy API: POST /users/login
 * - Sends an email containing `${APP_URL}/auth?token=<JWT>`
 * - Returns { status: "SUCCESS", user: "<userId>" } (NOT the JWT)
 */
export function requestLoginLink(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
