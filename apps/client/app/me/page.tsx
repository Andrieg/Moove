"use client";

import { useEffect, useState } from "react";
import { getCurrentUserProfile, clearToken } from "@moove/api-client";
import Nav from "../_components/Nav";

export default function MePage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenPreview, setTokenPreview] = useState<string>("(checking…)");

  useEffect(() => {
    const t = localStorage.getItem("token");
    setTokenPreview(t ? `${t.slice(0, 20)}…` : "null");

    getCurrentUserProfile()
      .then(setData)
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <>
      <Nav />
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>/users/me</h1>
      <p>
        localStorage token: <code>{tokenPreview}</code>
      </p>

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
