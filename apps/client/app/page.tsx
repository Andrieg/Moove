"use client";

import { useEffect, useState } from "react";
import { getVideos, getChallenges } from "@moove/api-client";
import type { Video, Challenge } from "@moove/types";
import ClassCard from "./_components/blocks/ClassCard";
import Category from "./_components/blocks/Category";
import FeaturedCard from "./_components/blocks/FeaturedCard";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coachName, setCoachName] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from localStorage to find their coach
    let coachBrand: string | undefined;
    try {
      const userData = localStorage.getItem("moovefit-user");
      if (userData) {
        const user = JSON.parse(userData);
        coachBrand = user.coachSlug || user.brand;
        // For coach users, use their own brand
        if (user.role === "coach") {
          coachBrand = user.brand;
        }
        if (coachBrand) {
          setCoachName(coachBrand);
        }
      }
    } catch (e) {
      console.error("Error reading user data:", e);
    }

    // Fetch content - if member has a coach, filter by their coach
    Promise.all([
      getVideos(coachBrand).catch(() => []),
      getChallenges(coachBrand).catch(() => []),
    ])
      .then(([videosData, challengesData]) => {
        setVideos(videosData);
        setChallenges(challengesData);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your content...</p>
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

  // Get featured content (first video if available)
  const featured = videos.length > 0 && videos[0].title ? videos[0] : null;

  // Categorize videos by category (mock categories for now)
  const categories = [
    { name: "HIIT", videos: videos.filter((v) => v.title?.toLowerCase().includes("hiit")) },
    { name: "Strength", videos: videos.filter((v) => v.title?.toLowerCase().includes("strength")) },
    { name: "Yoga", videos: videos.filter((v) => v.title?.toLowerCase().includes("yoga")) },
    { name: "Cardio", videos: videos.filter((v) => v.title?.toLowerCase().includes("cardio")) },
  ].filter((cat) => cat.videos.length > 0);

  // If no specific categories, show all videos as "Workouts"
  const hasCategories = categories.length > 0;
  const allVideos = videos;

  return (
    <div className="pb-8">
      {/* Featured Section */}
      {featured && (
        <div className="container mx-auto px-4 pt-4">
          <FeaturedCard
            classroom={{
              id: featured.id,
              title: featured.title || "Featured Workout",
              cover: (featured as any).cover || { url: "" },
              description: `${Math.floor((featured.durationSeconds || 0) / 60)} minutes of intense workout`,
            }}
            tag="FEATURED"
            type="class"
          />
        </div>
      )}

      {/* Challenges Section */}
      {challenges.length > 0 && (
        <Category withBorder title="Your Challenges" link="View all">
          {challenges.map((challenge) => (
            <ClassCard
              key={challenge.id}
              type="challenge"
              classroom={{
                id: challenge.id,
                title: challenge.title || "Untitled Challenge",
                cover: { url: "" },
              }}
            />
          ))}
        </Category>
      )}

      {/* Categories or All Videos */}
      {hasCategories ? (
        categories.map((category) => (
          <Category
            key={category.name}
            withBorder
            title={category.name}
            link="View all"
          >
            {category.videos.map((video) => (
              <ClassCard
                key={video.id}
                type="withBottom"
                classroom={{
                  id: video.id,
                  title: video.title || "Untitled Video",
                  cover: video.cover as { url?: string } | undefined,
                  duration: Math.floor((video.durationSeconds || 0) / 60),
                  target: "Full Body",
                }}
              />
            ))}
          </Category>
        ))
      ) : allVideos.length > 0 ? (
        <Category withBorder title="Workouts" link="View all">
          {allVideos.map((video) => (
            <ClassCard
              key={video.id}
              type="withBottom"
              classroom={{
                id: video.id,
                title: video.title || "Untitled Video",
                cover: video.cover as { url?: string } | undefined,
                duration: Math.floor((video.durationSeconds || 0) / 60),
                target: "Full Body",
              }}
            />
          ))}
        </Category>
      ) : (
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 text-lg">No content available yet.</p>
          <p className="text-gray-400 mt-2">Check back soon for new workouts and challenges!</p>
        </div>
      )}
    </div>
  );
}
