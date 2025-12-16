// /app/packages/api-client/src/http.ts

function normalizeBase(base: string) {
  // Ensure leading slash for relative base paths like "/legacy"
  // Remove trailing slash to avoid double slashes when joining
  if (!base) return "";
  const withLeading = base.startsWith("http") || base.startsWith("/") ? base : `/${base}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

function normalizePath(path: string) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function getBaseUrl() {
  // In Emergent preview the working proxy is /legacy (NOT /api/legacy)
  // So default to "/legacy" in the browser.
  if (typeof window !== "undefined") {
    return normalizeBase(process.env.NEXT_PUBLIC_API_URL || "/legacy");
  }

  // Server-side (safe default): use same-origin too
  return normalizeBase(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000/legacy");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getToken();
  const url = `${baseUrl}${normalizePath(path)}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const err = {
      status: res.status,
      url,
      body,
    };
    throw new Error(JSON.stringify(err));
  }

  return body as T;
}