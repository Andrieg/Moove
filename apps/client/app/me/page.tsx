"use client";

import { useEffect, useState } from "react";
import { getCurrentUserProfile, clearToken } from "@moove/api-client";

export default function MePage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserProfile()
      .then(setData)
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>/users/me</h1>

      <button
        onClick={() => {
          clearToken();
          window.location.href = "/";
        }}
        style={{ marginBottom: 16 }}
      >
        Log out (clear token)
      </button>

      {error ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
