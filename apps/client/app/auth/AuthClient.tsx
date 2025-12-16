// apps/client/app/auth/AuthClient.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@moove/api-client";

function readTokenFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash || ""; // e.g. "#token=abc&x=1"
  if (!hash.startsWith("#")) return null;

  const params = new URLSearchParams(hash.slice(1)); // remove "#"
  return params.get("token");
}

export default function AuthClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryToken = useMemo(() => searchParams.get("token"), [searchParams]);
  const [hashToken, setHashToken] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState("");
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    setHashToken(readTokenFromHash());
  }, []);

  const token = queryToken || hashToken || (manualToken.trim() || null);

  useEffect(() => {
    setStatus(
      `queryToken=${queryToken ? "YES" : "NO"} | hashToken=${hashToken ? "YES" : "NO"} | tokenChosen=${
        token ? "YES" : "NO"
      }`
    );

    if (!token) return;

    // If token came from hash, clear it so it doesn't linger in the URL
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    setToken(token);
    setStatus("Token saved. Redirecting…");
    router.replace("/me");
  }, [token, queryToken, hashToken, router]);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720 }}>
      <h1>Auth</h1>
      <p>{status}</p>

      <hr style={{ margin: "16px 0" }} />

      <h2>Manual token paste (fallback)</h2>
      <textarea
        value={manualToken}
        onChange={(e) => setManualToken(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 12, fontFamily: "monospace" }}
        placeholder="Paste JWT token here…"
      />
    </main>
  );
}