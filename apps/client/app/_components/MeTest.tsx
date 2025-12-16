"use client";

import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "@moove/api-client";

export default function MeTest() {
  const [result, setResult] = useState<unknown>("Loading…");

  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUserProfile();
        setResult(me);
      } catch (e) {
        setResult({ error: (e as Error).message });
      }
    })();
  }, []);

  return (
    <>
      <h2>/users/me test</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
}
