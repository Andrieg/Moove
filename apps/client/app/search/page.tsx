"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getVideos, getChallenges } from "@moove/api-client";
import type { Video, Challenge } from "@moove/types";
import ClassCard from "../_components/blocks/ClassCard";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

type FilterCategory = {
  id: string;
  title: string;
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [videos, setVideos] = useState<Video[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Filter options
  const targets: FilterCategory[] = [
    { id: "fb", title: "Full Body" },
    { id: "co", title: "Core" },
    { id: "lb", title: "Lower Body" },
    { id: "ub", title: "Upper Body" },
  ];

  const categories: FilterCategory[] = [
    { id: "cardio", title: "Cardio" },
    { id: "hiit", title: "HIIT" },
    { id: "strength", title: "Strength" },
    { id: "yoga", title: "Yoga" },
  ];

  const durations: FilterCategory[] = [
    { id: "5_10", title: "5-10 min" },
    { id: "10_20", title: "10-20 min" },
    { id: "20_30", title: "20-30 min" },
    { id: "30", title: "30+ min" },
  ];

  const goals: FilterCategory[] = [
    { id: "active", title: "Be More Active" },
    { id: "weight", title: "Lose Weight" },
    { id: "toned", title: "Stay Toned" },
    { id: "muscle", title: "Build Muscle" },
    { id: "stress", title: "Reduce Stress" },
    { id: "flex", title: "Improve Flexibility" },
  ];

  useEffect(() => {
    Promise.all([getVideos(), getChallenges()])
      .then(([videosData, challengesData]) => {
        setVideos(videosData);
        setChallenges(challengesData);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (
    value: string,
    selected: string[],
    setter: (val: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  // Filter results
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      !searchQuery ||
      video.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) =>
        video.title?.toLowerCase().includes(cat.toLowerCase())
      );

    const duration = Math.floor((video.durationSeconds || 0) / 60);
    const matchesDuration =
      selectedDurations.length === 0 ||
      selectedDurations.some((dur) => {
        if (dur === "5_10") return duration >= 5 && duration <= 10;
        if (dur === "10_20") return duration >= 10 && duration <= 20;
        if (dur === "20_30") return duration >= 20 && duration <= 30;
        if (dur === "30") return duration >= 30;
        return true;
      });

    return matchesSearch && matchesCategory && matchesDuration;
  });

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      !searchQuery ||
      challenge.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const clearFilters = () => {
    setSelectedTargets([]);
    setSelectedCategories([]);
    setSelectedDurations([]);
    setSelectedGoals([]);
  };

  const hasActiveFilters =
    selectedTargets.length > 0 ||
    selectedCategories.length > 0 ||
    selectedDurations.length > 0 ||
    selectedGoals.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Image src="/icons/back.svg" alt="Back" width={20} height={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search workouts, challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-full border border-gray-200 focus:border-[#308FAB] focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <Image
                  src="/icons/closeButton.svg"
                  alt="Clear"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Title size="base" weight="600">
              Filters
            </Title>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[#308FAB] text-sm font-semibold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Target Area */}
          <div className="mb-4">
            <Text size="sm" weight="600" className="mb-2 text-gray-700">
              Target Area
            </Text>
            <div className="flex flex-wrap gap-2">
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={() =>
                    toggleFilter(target.id, selectedTargets, setSelectedTargets)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedTargets.includes(target.id)
                      ? "bg-[#308FAB] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#308FAB]"
                  }`}
                >
                  {target.title}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <Text size="sm" weight="600" className="mb-2 text-gray-700">
              Category
            </Text>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    toggleFilter(
                      category.id,
                      selectedCategories,
                      setSelectedCategories
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedCategories.includes(category.id)
                      ? "bg-[#308FAB] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#308FAB]"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <Text size="sm" weight="600" className="mb-2 text-gray-700">
              Duration
            </Text>
            <div className="flex flex-wrap gap-2">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() =>
                    toggleFilter(
                      duration.id,
                      selectedDurations,
                      setSelectedDurations
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedDurations.includes(duration.id)
                      ? "bg-[#308FAB] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#308FAB]"
                  }`}
                >
                  {duration.title}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-4">
            <Text size="sm" weight="600" className="mb-2 text-gray-700">
              Goals
            </Text>
            <div className="flex flex-wrap gap-2">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() =>
                    toggleFilter(goal.id, selectedGoals, setSelectedGoals)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedGoals.includes(goal.id)
                      ? "bg-[#308FAB] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#308FAB]"
                  }`}
                >
                  {goal.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <Text size="base" weight="600" className="text-gray-700">
                {filteredVideos.length + filteredChallenges.length} results
                {searchQuery && ` for "${searchQuery}"`}
              </Text>
            </div>

            {/* Videos */}
            {filteredVideos.length > 0 && (
              <div className="mb-8">
                <Title size="lg" weight="600" className="mb-4">
                  Workouts
                </Title>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="flex justify-center">
                      <ClassCard
                        type="withBottom"
                        classroom={{
                          id: video.id,
                          title: video.title || "Untitled",
                          cover: video.cover,
                          duration: Math.floor(
                            (video.durationSeconds || 0) / 60
                          ),
                          target: "Full Body",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {filteredChallenges.length > 0 && (
              <div className="mb-8">
                <Title size="lg" weight="600" className="mb-4">
                  Challenges
                </Title>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredChallenges.map((challenge) => (
                    <div key={challenge.id} className="flex justify-center">
                      <ClassCard
                        type="challenge"
                        classroom={{
                          id: challenge.id,
                          title: challenge.title || "Untitled",
                          cover: { url: "" },
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredVideos.length === 0 && filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Title size="lg" className="mb-2 text-gray-700">
                  No results found
                </Title>
                <Text size="base" color="#B0B0B0" className="mb-6">
                  Try adjusting your search or filters
                </Text>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
