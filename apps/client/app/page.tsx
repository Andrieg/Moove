import { getCurrentUser, getVideos } from "@moove/api-client";
import type { User } from "@moove/types";

export default async function Home() {
  let result: unknown = null;

  try {
    result = await getCurrentUser();
  } catch (e) {
    result = { error: (e as Error).message };
  }

  // Type-only check to prove @moove/types resolves
  const _typeCheck: User | null = null;

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Moove: apps/client</h1>
      <p>
        If this page builds, monorepo workspace imports are wired correctly.
      </p>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
