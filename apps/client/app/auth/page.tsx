"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@moove/api-client";

function readTokenFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash || "";
  // supports: #token=XYZ or #/auth?token=XYZ
  const m = hash.match(/token=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function AuthPage() {
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
      `queryToken=${queryToken ? "YES" : "NO"} | hashToken=${
        hashToken ? "YES" : "NO"
      } | tokenChosen=${token ? "YES" : "NO"}`
    );

    if (!token) return;

    setToken(token);
    setStatus("Token saved. Redirecting to /me…");
    router.replace("/me");
  }, [token, queryToken, hashToken, router]);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720 }}>
      <h1>Auth</h1>
      <p>{status}</p>

      <p>
        Current URL:{" "}
        <code>{typeof window !== "undefined" ? window.location.href : ""}</code>
      </p>

      <hr style={{ margin: "16px 0" }} />

      <h2>Manual token paste (fallback)</h2>
      <p>
        If your email link isn’t including <code>?token=</code>, copy the token
        (JWT) and paste it here.
      </p>

      <textarea
        value={manualToken}
        onChange={(e) => setManualToken(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 12, fontFamily: "monospace" }}
        placeholder="Paste JWT token here…"
      />

      <p style={{ marginTop: 12 }}>
        Tip: a JWT usually looks like <code>xxxxx.yyyyy.zzzzz</code>.
      </p>
    </main>
  );
}
