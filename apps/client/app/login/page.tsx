"use client";

import { useState } from "react";
import { requestLoginLink } from "@moove/api-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const res = await requestLoginLink({ email, client: true, target: window.location.origin });
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
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

      {error ? <pre>{error}</pre> : null}
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}

      <p style={{ marginTop: 16 }}>
        After clicking the emailed link, you’ll land on <code>/auth?token=...</code>.
      </p>
    </main>
  );
}
