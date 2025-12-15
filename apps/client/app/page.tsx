import { getCurrentUserProfile } from "@moove/api-client";
import type { User } from "@moove/types";

export default async function Home() {
  let result: unknown = null;

  try {
    result = await getCurrentUserProfile();
  } catch (e) {
    result = { error: (e as Error).message };
  }

  const _typeCheck: User | null = null;

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Moove: apps/client</h1>
      <p>If this page builds, workspace imports are correct.</p>

      <h2>/users/me test</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </main>
  );
}
