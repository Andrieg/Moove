"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@moove/api-client";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [status, setStatus] = useState<string>("Loading…");

  useEffect(() => {
    const existing = localStorage.getItem("token");
    setStatus(
      `token_in_url=${token ? "YES" : "NO"} | token_in_storage=${
        existing ? "YES" : "NO"
      }`
    );

    if (!token) return;

    setToken(token);

    const after = localStorage.getItem("token");
    setStatus(
      `SAVED | token_in_url=YES | token_in_storage=${after ? "YES" : "NO"} | redirecting…`
    );

    router.replace("/me");
  }, [token, router]);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Auth</h1>
      <p>{status}</p>
      <p>
        URL token (first 20 chars):{" "}
        <code>{token ? token.slice(0, 20) : "null"}</code>
      </p>
    </main>
  );
}
