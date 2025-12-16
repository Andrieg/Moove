import { Suspense } from "react";
import AuthClient from "./AuthClient";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720 }}>
          <h1>Auth</h1>
          <p>Loading…</p>
        </main>
      }
    >
      <AuthClient />
    </Suspense>
  );
}