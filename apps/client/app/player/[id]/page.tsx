"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getVideoById } from "@moove/api-client";
import type { Video } from "@moove/types";
import VideoPlayer from "../../_components/blocks/VideoPlayer";

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getVideoById(id)
      .then(setVideo)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-white mb-4">Error loading video: {error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#308FAB] text-white rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading video...</p>
        </div>
      </div>
    );
  }

  const cover = video.cover as { url?: string } | undefined;
  const thumbnailUrl = cover?.url || "/backgrounds/default-workout.jpg";
  const videoUrl = (video as any).video?.url || undefined;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition"
        >
          <Image src="/icons/back.svg" alt="Back" width={20} height={20} />
        </button>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl px-4">
          <VideoPlayer
            videoUrl={videoUrl}
            thumbnailUrl={thumbnailUrl}
            title={video.title}
            onClose={() => router.back()}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent">
        <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
        <p className="text-gray-400">
          {Math.floor((video.durationSeconds || 0) / 60)} minutes
        </p>
      </div>
    </div>
  );
}
