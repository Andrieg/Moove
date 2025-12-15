"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@moove/api-client";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const [message, setMessage] = useState("Reading token…");

  useEffect(() => {
    if (!token) {
      setMessage("No token found in the URL. Please use the link from your email.");
      return;
    }

    setToken(token);
    setMessage("Token saved. Redirecting to /me…");

    const t = setTimeout(() => router.replace("/me"), 500);
    return () => clearTimeout(t);
  }, [token, router]);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Auth</h1>
      <p>{message}</p>
    </main>
  );
}
