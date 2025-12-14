type ApiError = {
  status: number;
  message: string;
  body?: unknown;
};

function getBaseUrl() {
  // Client-side: Next exposes NEXT_PUBLIC_* vars
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "https://api.moove.fit";
  }
  // Server-side fallback:
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.moove.fit";
}

function getToken() {
  // Simple starter strategy: token in localStorage
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: typeof body === "string" ? body : "API request failed",
      body
    };
    throw new Error(JSON.stringify(err));
  }

  return body as T;
}
