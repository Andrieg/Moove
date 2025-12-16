function normalizeBaseUrl(raw: string) {
  // Ensure no trailing slash
  return raw.replace(/\/+$/, "");
}

function normalizePath(path: string) {
  // Ensure leading slash
  let normalized = path.startsWith("/") ? path : `/${path}`;
  
  // GUARD: Prevent double-prefixing bugs
  // Remove any accidental /api/legacy or /legacy prefix from the path
  // since the baseUrl already includes /legacy
  normalized = normalized.replace(/^\/api\/legacy/, "");
  normalized = normalized.replace(/^\/legacy\/legacy/, "/legacy");
  
  return normalized;
}

function getBaseUrl() {
  // Browser: always same-origin.
  // IMPORTANT: In Emergent preview we want to hit the Next.js proxy route at /legacy
  if (typeof window !== "undefined") {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || "/legacy");
  }

  // Server: also use same-origin proxy by default (safe)
  return normalizeBaseUrl(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000/legacy");
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

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    throw new Error(
      JSON.stringify({
        status: res.status,
        url,
        body,
      })
    );
  }

  return body as T;
}