"use client";

import { useEffect, useState } from "react";
import { getVideos } from "@moove/api-client";
import type { Video } from "@moove/types";
import ClassCard from "../_components/blocks/ClassCard";
import Title from "../_components/atoms/Title";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch((e) => setError((e as Error).message));
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <Title color="black" size="xl">Error</Title>
          <pre className="mt-2 text-red-600 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }

  if (videos === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Title color="black" size="2xl" className="mb-6">All Videos</Title>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No videos available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="flex justify-center">
              <ClassCard
                type="withBottom"
                classroom={{
                  id: video.id,
                  title: video.title || "Untitled Video",
                  cover: video.cover as { url?: string } | undefined,
                  duration: Math.floor((video.durationSeconds || 0) / 60),
                  target: "Full Body",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
