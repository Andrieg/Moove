"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVideoById } from "@moove/api-client";
import type { Video } from "@moove/types";
import Nav from "../../_components/Nav";

export default function VideoDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getVideoById(id)
      .then(setVideo)
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
              <a href="/videos">← Back to videos</a>
            </p>
          </>
        ) : video === null ? (
          <p>Loading video…</p>
        ) : (
          <>
            <p>
              <a href="/videos">← Back to videos</a>
            </p>
            <h1>{video.title}</h1>
            <p style={{ color: "#666" }}>
              Duration: {Math.floor(video.durationSeconds / 60)} min{" "}
              {video.durationSeconds % 60} sec
            </p>
            {video.published ? (
              <span style={{ color: "green", fontSize: 14 }}>Published</span>
            ) : (
              <span style={{ color: "gray", fontSize: 14 }}>Draft</span>
            )}

            <div
              style={{
                marginTop: 24,
                padding: 24,
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <p style={{ margin: 0, color: "#666" }}>
                Video player placeholder (ID: {video.id})
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
