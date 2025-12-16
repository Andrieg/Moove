"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getChallengeById } from "@moove/api-client";
import type { Challenge } from "@moove/types";
import Nav from "../../_components/Nav";

export default function ChallengeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getChallengeById(id)
      .then(setChallenge)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  return (
    <>
      <Nav />
      <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 820 }}>
        {error ? (
          <>
            <h1>Error</h1>
            <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{error}</pre>
            <p>
              <a href="/challenges">← Back to challenges</a>
            </p>
          </>
        ) : challenge === null ? (
          <p>Loading challenge…</p>
        ) : (
          <>
            <p>
              <a href="/challenges">← Back to challenges</a>
            </p>
            <h1>{challenge.title}</h1>
            <p style={{ color: "#666" }}>
              {new Date(challenge.startDate).toLocaleDateString()} –{" "}
              {new Date(challenge.endDate).toLocaleDateString()}
            </p>

            <div
              style={{
                marginTop: 24,
                padding: 24,
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <p style={{ margin: 0 }}>Challenge details and progress would appear here.</p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
