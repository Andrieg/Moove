"use client";

import { useState, useEffect, useMemo } from "react";
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

type SearchTab = "all" | "workouts" | "challenges";

// Recent searches (mock - would normally come from localStorage)
const recentSearches = ["HIIT", "Yoga", "30 min workout", "Core"];
const popularSearches = ["Full Body", "Cardio Blast", "Morning Routine", "Abs Challenge"];

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [videos, setVideos] = useState<Video[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  // Filter options
  const targets: FilterCategory[] = [
    { id: "full-body", title: "Full Body" },
    { id: "core", title: "Core" },
    { id: "lower-body", title: "Lower Body" },
    { id: "upper-body", title: "Upper Body" },
  ];

  const categories: FilterCategory[] = [
    { id: "cardio", title: "Cardio" },
    { id: "hiit", title: "HIIT" },
    { id: "strength", title: "Strength" },
    { id: "yoga", title: "Yoga" },
  ];

  const durations: FilterCategory[] = [
    { id: "0-15", title: "0-15 min" },
    { id: "15-30", title: "15-30 min" },
    { id: "30-45", title: "30-45 min" },
    { id: "45+", title: "45+ min" },
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
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Search query match
      const matchesSearch = !searchQuery ||
        video.title?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.some((cat) =>
          video.title?.toLowerCase().includes(cat.toLowerCase())
        );

      // Duration match
      const duration = Math.floor((video.durationSeconds || 0) / 60);
      const matchesDuration = selectedDurations.length === 0 ||
        selectedDurations.some((dur) => {
          if (dur === "0-15") return duration >= 0 && duration <= 15;
          if (dur === "15-30") return duration > 15 && duration <= 30;
          if (dur === "30-45") return duration > 30 && duration <= 45;
          if (dur === "45+") return duration > 45;
          return true;
        });

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [videos, searchQuery, selectedCategories, selectedDurations]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      return !searchQuery ||
        challenge.title?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [challenges, searchQuery]);

  const clearFilters = () => {
    setSelectedTargets([]);
    setSelectedCategories([]);
    setSelectedDurations([]);
  };

  const hasActiveFilters = selectedTargets.length > 0 ||
    selectedCategories.length > 0 ||
    selectedDurations.length > 0;

  const totalResults = filteredVideos.length + filteredChallenges.length;
  const isSearching = searchQuery.length > 0 || hasActiveFilters;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6">
        {/* Search Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <Image src="/icons/back.svg" alt="Back" width={20} height={20} />
          </button>
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/icons/search.svg" alt="Search" width={18} height={18} />
            </div>
            <input
              type="text"
              placeholder="Search workouts, challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-10 py-3 rounded-full border border-gray-200 focus:border-[#308FAB] focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <Image src="/icons/closeButton.svg" alt="Clear" width={16} height={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
              hasActiveFilters ? "bg-[#308FAB] text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Image
              src="/icons/tune.svg"
              alt="Filters"
              width={20}
              height={20}
              className={hasActiveFilters ? "brightness-0 invert" : ""}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <Title size="base" weight="600">Filters</Title>
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
              <Text size="sm" weight="600" className="mb-2 text-gray-700">Target Area</Text>
              <div className="flex flex-wrap gap-2">
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => toggleFilter(target.id, selectedTargets, setSelectedTargets)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedTargets.includes(target.id)
                        ? "bg-[#308FAB] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {target.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <Text size="sm" weight="600" className="mb-2 text-gray-700">Category</Text>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleFilter(category.id, selectedCategories, setSelectedCategories)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategories.includes(category.id)
                        ? "bg-[#308FAB] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Text size="sm" weight="600" className="mb-2 text-gray-700">Duration</Text>
              <div className="flex flex-wrap gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => toggleFilter(duration.id, selectedDurations, setSelectedDurations)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedDurations.includes(duration.id)
                        ? "bg-[#308FAB] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {duration.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Not Searching - Show Suggestions */}
        {!isSearching && (
          <div className="space-y-6">
            {/* Recent Searches */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Title size="base" weight="600">Recent Searches</Title>
                <button className="text-sm text-[#308FAB] font-semibold hover:underline">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition"
                  >
                    <Image src="/icons/clock.svg" alt="Recent" width={14} height={14} className="opacity-50" />
                    <Text size="sm" weight="500">{term}</Text>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <Title size="base" weight="600" className="mb-3">Popular Searches</Title>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#429FBA]/10 to-[#217E9A]/10 rounded-full hover:from-[#429FBA]/20 hover:to-[#217E9A]/20 transition"
                  >
                    <Image src="/icons/fire-1.png" alt="Popular" width={14} height={14} />
                    <Text size="sm" weight="500" color="#308FAB">{term}</Text>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Category */}
            <div>
              <Title size="base" weight="600" className="mb-3">Browse by Category</Title>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategories([cat.id]);
                      setShowFilters(true);
                    }}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-[#429FBA] to-[#217E9A] rounded-full flex items-center justify-center">
                      <Text size="lg" className="text-white">{cat.title[0]}</Text>
                    </div>
                    <Text size="sm" weight="600">{cat.title}</Text>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Searching - Show Results */}
        {isSearching && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {(["all", "workouts", "challenges"] as SearchTab[]).map((tab) => {
                let count = 0;
                if (tab === "all") count = totalResults;
                else if (tab === "workouts") count = filteredVideos.length;
                else if (tab === "challenges") count = filteredChallenges.length;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "bg-[#308FAB]/20 text-[#308FAB]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Searching...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Workouts */}
                {(activeTab === "all" || activeTab === "workouts") && filteredVideos.length > 0 && (
                  <div className="mb-8">
                    {activeTab === "all" && (
                      <div className="flex justify-between items-center mb-4">
                        <Title size="lg" weight="600">Workouts</Title>
                        <button
                          onClick={() => setActiveTab("workouts")}
                          className="text-sm text-[#308FAB] font-semibold hover:underline"
                        >
                          See all ({filteredVideos.length})
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(activeTab === "all" ? filteredVideos.slice(0, 3) : filteredVideos).map((video) => (
                        <div key={video.id} className="flex justify-center">
                          <ClassCard
                            type="withBottom"
                            classroom={{
                              id: video.id,
                              title: video.title || "Untitled",
                              cover: video.cover as { url?: string } | undefined,
                              duration: Math.floor((video.durationSeconds || 0) / 60),
                              target: "Full Body",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenges */}
                {(activeTab === "all" || activeTab === "challenges") && filteredChallenges.length > 0 && (
                  <div className="mb-8">
                    {activeTab === "all" && (
                      <div className="flex justify-between items-center mb-4">
                        <Title size="lg" weight="600">Challenges</Title>
                        <button
                          onClick={() => setActiveTab("challenges")}
                          className="text-sm text-[#308FAB] font-semibold hover:underline"
                        >
                          See all ({filteredChallenges.length})
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(activeTab === "all" ? filteredChallenges.slice(0, 3) : filteredChallenges).map((challenge) => (
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
                {totalResults === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image src="/icons/search.svg" alt="No results" width={32} height={32} className="opacity-30" />
                    </div>
                    <Title size="lg" className="mb-2 text-gray-700">No results found</Title>
                    <Text size="base" color="#B0B0B0" className="mb-6">
                      Try adjusting your search or filters
                    </Text>
                    <Button variant="primary" onClick={() => { setSearchQuery(""); clearFilters(); }}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
