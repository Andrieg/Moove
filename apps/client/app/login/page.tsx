"use client";

import { useState } from "react";
import { requestLoginLink } from "@moove/api-client";
import type { LoginResponse } from "@moove/api-client";
import Nav from "../_components/Nav";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<LoginResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const target =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const res = await requestLoginLink({
        email,
        client: true,
        target,
      });

      setResult(res);

      // If backend returns FAIL, treat it like an error in the UI
      if (res.status === "FAIL") {
        setError(
          res.code ? `${res.error} (code ${res.code})` : res.error
        );
        return;
      }

      // Dev convenience: redirect immediately if link exists
      if (res.link) {
        window.location.assign(res.link);
        return;
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720 }}>
        <h1>Login</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <button type="submit">Send login link</button>
      </form>

      {error ? (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{error}</pre>
      ) : null}

      {result ? (
        <div style={{ marginTop: 16 }}>
          <h2>Response</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>

          {"link" in result && result.link ? (
            <p style={{ marginTop: 12 }}>
              If you weren’t redirected automatically, click:{" "}
              <a href={result.link}>Open auth link</a>
            </p>
          ) : null}

          {"token" in result && result.token ? (
            <p style={{ marginTop: 12 }}>
              Token returned (dev): <code>{result.token.slice(0, 30)}…</code>
            </p>
          ) : null}
        </div>
      ) : null}

      <p style={{ marginTop: 16 }}>
        After clicking the link you’ll land on <code>/auth?token=...</code>.
      </p>
      </main>
    </>
  );
}
