"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clearToken,
  getCurrentUserProfile,
  requestLoginLink,
  setToken,
} from "@moove/api-client";
import Nav from "./_components/Nav";

type DevLoginResponse = {
  status: "SUCCESS" | "FAIL";
  user?: string;
  token?: string;
  link?: string;
  error?: string;
  code?: number;
};

export default function Home() {
  const [origin, setOrigin] = useState<string>("");
  const [tokenInLocalStorage, setTokenInLocalStorage] = useState<string | null>(null);

  const [loginResponse, setLoginResponse] = useState<DevLoginResponse | null>(null);
  const [meResponse, setMeResponse] = useState<unknown>(null);
  const [err, setErr] = useState<string | null>(null);

  const [manualToken, setManualToken] = useState("");

  // Only read window/localStorage on the client
  useEffect(() => {
    setOrigin(window.location.origin);
    setTokenInLocalStorage(localStorage.getItem("token"));
  }, []);

  const authStatus = useMemo(
    () => ({ origin, tokenInLocalStorage }),
    [origin, tokenInLocalStorage]
  );

  async function devLogin() {
    setErr(null);
    setLoginResponse(null);

    try {
      const res = (await requestLoginLink({
        email: "test@example.com",
        client: true,
        target: window.location.origin,
      })) as unknown as DevLoginResponse;

      setLoginResponse(res);

      // If backend returned a link in dev, go there
      if (res?.link) {
        window.location.href = res.link;
        return;
      }
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function callMe() {
    setErr(null);
    setMeResponse(null);

    try {
      const res = await getCurrentUserProfile();
      setMeResponse(res);
    } catch (e) {
      setErr((e as Error).message);
      setMeResponse({ error: (e as Error).message });
    } finally {
      setTokenInLocalStorage(localStorage.getItem("token"));
    }
  }

  function logout() {
    clearToken();
    setTokenInLocalStorage(null);
    setMeResponse(null);
    setLoginResponse(null);
  }

  function saveManualToken() {
    const t = manualToken.trim();
    if (!t) return;
    setToken(t);
    setTokenInLocalStorage(t);
    setManualToken("");
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 820 }}>
        <h1>Moove: apps/client</h1>
      <p>If this page builds, workspace imports are correct.</p>

      <h2>Auth status</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(authStatus, null, 2)}</pre>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={devLogin}>Dev login as test@example.com</button>
        <button onClick={callMe}>Call /users/me</button>
        <button onClick={logout}>Log out (clear token)</button>
      </div>

      <h2 style={{ marginTop: 20 }}>Manual token paste (fallback)</h2>
      <textarea
        value={manualToken}
        onChange={(e) => setManualToken(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: 12, fontFamily: "monospace" }}
        placeholder="Paste JWT token here…"
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={saveManualToken}>Save token</button>
      </div>

      {err ? (
        <>
          <h2 style={{ marginTop: 20 }}>Error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{err}</pre>
        </>
      ) : null}

      <h2 style={{ marginTop: 20 }}>Login response</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(loginResponse, null, 2)}</pre>

      <h2 style={{ marginTop: 20 }}>/users/me response</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(meResponse, null, 2)}</pre>
      </main>
    </>
  );
}