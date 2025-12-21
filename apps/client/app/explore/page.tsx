"use client";

import { useEffect, useState } from "react";
import { getVideos } from "@moove/api-client";
import type { Video } from "@moove/types";
import ClassCard from "../_components/blocks/ClassCard";
import Category from "../_components/blocks/Category";
import Title from "../_components/atoms/Title";

export default function ExplorePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState("all");

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Filter by duration
  const filteredVideos =
    selectedDuration === "all"
      ? videos
      : videos.filter((v) => {
          const duration = Math.floor((v.durationSeconds || 0) / 60);
          if (selectedDuration === "5-10") return duration >= 5 && duration <= 10;
          if (selectedDuration === "10-20") return duration >= 10 && duration <= 20;
          if (selectedDuration === "20-30") return duration >= 20 && duration <= 30;
          if (selectedDuration === "30+") return duration >= 30;
          return true;
        });

  // Group videos by type
  const hiitVideos = videos.filter((v) => v.title?.toLowerCase().includes("hiit"));
  const yogaVideos = videos.filter((v) => v.title?.toLowerCase().includes("yoga"));
  const strengthVideos = videos.filter((v) => v.title?.toLowerCase().includes("strength"));

  const durationOptions = [
    { id: "all", label: "All" },
    { id: "5-10", label: "5-10 min" },
    { id: "10-20", label: "10-20 min" },
    { id: "20-30", label: "20-30 min" },
    { id: "30+", label: "30+ min" },
  ];

  return (
    <div className="pb-8">
      {/* Page Title */}
      <div className="container mx-auto px-4 pt-4 pb-2">
        <Title color="black" size="2xl" weight="700">
          Explore Workouts
        </Title>
      </div>

      {/* On-Demand Section */}
      {videos.length > 0 && (
        <Category
          withBorder
          title="On-Demand"
          subtitle="Start anytime, workout anywhere"
        >
          {videos.slice(0, 8).map((video) => (
            <ClassCard
              key={video.id}
              type="only_title"
              classroom={{
                id: video.id,
                title: video.title || "Untitled Workout",
                cover: video.cover as { url?: string } | undefined,
              }}
            />
          ))}
        </Category>
      )}

      {/* Duration Filter Section */}
      <Category withBorder title="By Duration">
        <div className="flex gap-3 p-4">
          {durationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedDuration(option.id)}
              className={`min-w-[8rem] h-32 rounded-lg shadow-md transition-all hover:scale-105 flex items-center justify-center text-lg font-bold ${
                selectedDuration === option.id
                  ? "bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white"
                  : "bg-white border-2 border-[#217E9A] text-[#217E9A]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Category>

      {/* Filtered Results */}
      {selectedDuration !== "all" && filteredVideos.length > 0 && (
        <Category title={`${selectedDuration} Workouts`} withBorder>
          {filteredVideos.map((video) => (
            <ClassCard
              key={video.id}
              type="withBottom"
              classroom={{
                id: video.id,
                title: video.title || "Untitled Workout",
                cover: video.cover as { url?: string } | undefined,
                duration: Math.floor((video.durationSeconds || 0) / 60),
                target: "Full Body",
              }}
            />
          ))}
        </Category>
      )}

      {/* HIIT Workouts */}
      {hiitVideos.length > 0 && (
        <Category withBorder title="HIIT" link="View all">
          {hiitVideos.map((video) => (
            <ClassCard
              key={video.id}
              type="withBottom"
              classroom={{
                id: video.id,
                title: video.title || "HIIT Workout",
                cover: video.cover as { url?: string } | undefined,
                duration: Math.floor((video.durationSeconds || 0) / 60),
                target: "Full Body",
              }}
            />
          ))}
        </Category>
      )}

      {/* Yoga Workouts */}
      {yogaVideos.length > 0 && (
        <Category withBorder title="Yoga" link="View all">
          {yogaVideos.map((video) => (
            <ClassCard
              key={video.id}
              type="withBottom"
              classroom={{
                id: video.id,
                title: video.title || "Yoga Workout",
                cover: video.cover as { url?: string } | undefined,
                duration: Math.floor((video.durationSeconds || 0) / 60),
                target: "Full Body",
              }}
            />
          ))}
        </Category>
      )}

      {/* Strength Workouts */}
      {strengthVideos.length > 0 && (
        <Category title="Strength" link="View all">
          {strengthVideos.map((video) => (
            <ClassCard
              key={video.id}
              type="withBottom"
              classroom={{
                id: video.id,
                title: video.title || "Strength Workout",
                cover: video.cover as { url?: string } | undefined,
                duration: Math.floor((video.durationSeconds || 0) / 60),
                target: "Full Body",
              }}
            />
          ))}
        </Category>
      )}

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-slate-500 text-lg">No workouts available yet.</p>
          <p className="text-slate-400 mt-2">
            Check back soon for new content!
          </p>
        </div>
      )}
    </div>
  );
}
