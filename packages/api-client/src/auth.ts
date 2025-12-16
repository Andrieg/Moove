import { apiFetch } from "./http";

export type LoginRequest = {
  email: string;
  client?: boolean;
  target?: string;
  brand?: string;
};

export type LoginSuccessResponse = {
  status: "SUCCESS";
  user: string;

  /**
   * DEV-only convenience:
   * If the legacy API is patched to return the signed JWT, this will be present.
   */
  token?: string;

  /**
   * DEV-only convenience:
   * A fully-formed URL to send the browser to:
   *   `${target}/auth?token=${token}`
   */
  link?: string;
};

export type LoginFailResponse = {
  status: "FAIL";
  error: string;
  code?: number;
};

export type LoginResponse =
  | { status: "SUCCESS"; user: string; token?: string; link?: string }
  | { status: "FAIL"; error: string; code?: number };


/**
 * Legacy API: POST /users/login
 *
 * Production behavior: sends email with login link
 * Dev behavior (optional patch): returns { token, link } to allow local login without email
 */
export function requestLoginLink(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/api/legacy/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
