"use client";

import { useEffect, useState } from "react";
import { getChallenges } from "@moove/api-client";
import type { Challenge } from "@moove/types";
import Nav from "../_components/Nav";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <>
      <Nav />
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>Challenges</h1>

        {error ? (
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{error}</pre>
        ) : challenges === null ? (
          <p>Loading…</p>
        ) : challenges.length === 0 ? (
          <p>No challenges available yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h2 style={{ margin: 0, marginBottom: 8 }}>
                  <a href={`/challenges/${challenge.id}`}>{challenge.title}</a>
                </h2>
                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                  {new Date(challenge.startDate).toLocaleDateString()} –{" "}
                  {new Date(challenge.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
