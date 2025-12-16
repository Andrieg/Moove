"use client";

import { useEffect, useState } from "react";
import { getVideos } from "@moove/api-client";
import type { Video } from "@moove/types";
import Nav from "../_components/Nav";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <>
      <Nav />
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>Videos</h1>

        {error ? (
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{error}</pre>
        ) : videos === null ? (
          <p>Loading…</p>
        ) : videos.length === 0 ? (
          <p>No videos available yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {videos.map((video) => (
              <div
                key={video.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h2 style={{ margin: 0, marginBottom: 8 }}>
                  <a href={`/videos/${video.id}`}>{video.title}</a>
                </h2>
                <p style={{ margin: 0, color: "#666" }}>
                  Duration: {video.durationSeconds ? `${Math.floor(video.durationSeconds / 60)} min ${video.durationSeconds % 60} sec` : "Unknown"}
                </p>
                {video.published ? (
                  <span style={{ color: "green", fontSize: 12 }}>Published</span>
                ) : (
                  <span style={{ color: "gray", fontSize: 12 }}>Draft</span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
