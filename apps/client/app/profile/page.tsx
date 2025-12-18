"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCurrentUserProfile, getVideos } from "@moove/api-client";
import { clearToken } from "../_context/AuthContext";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";
import ClassCard from "../_components/blocks/ClassCard";
import { useRouter } from "next/navigation";
import type { Video } from "@moove/types";

type Tab = "stats" | "activity" | "favorites";

// Mock activity data
const mockActivity = [
  { id: 1, title: "Full Body HIIT Workout", type: "workout", date: "2 days ago", duration: 30 },
  { id: 2, title: "Yoga Flow", type: "workout", date: "5 days ago", duration: 40 },
  { id: 3, title: "30 Day Strength Challenge", type: "challenge", date: "1 week ago" },
  { id: 4, title: "Cardio Blast", type: "workout", date: "2 weeks ago", duration: 25 },
];

// Mock stats
const mockStats = {
  totalMinutes: 2450,
  totalClasses: 127,
  challengesCompleted: 8,
  currentDailyStreak: 5,
  longestDailyStreak: 21,
  currentWeeklyStreak: 3,
  longestWeeklyStreak: 12,
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [favorites, setFavorites] = useState<Video[]>([]);

  useEffect(() => {
    Promise.all([
      getCurrentUserProfile().catch(() => ({ email: "dev@moove.test" })),
      getVideos().catch(() => []),
    ])
      .then(([userData, videosData]) => {
        const userObj = userData as any;
        setUser(userObj?.user || userObj);
        // Mock: first 2 videos as favorites
        setFavorites(videosData.slice(0, 2));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8">
        {/* Header with Avatar */}
        <div className="flex flex-col items-center py-8">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {userInitial}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 transition">
              <Image src="/icons/edit-button.svg" alt="Edit" width={16} height={16} />
            </button>
          </div>

          {/* Name */}
          <Title size="xl" weight="600" className="mb-2 capitalize">
            {userName}
          </Title>
          <Text size="sm" color="#666" className="mb-6">
            {user?.email}
          </Text>

          {/* Tab Switcher */}
          <div className="flex gap-2 flex-wrap justify-center">
            {(["stats", "activity", "favorites"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-[#308FAB]/20 text-[#308FAB]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Text size="base" weight="600">{tab}</Text>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "stats" && (
          <div className="animate-fadeIn">
            {/* All Time Stats */}
            <Title size="base" weight="600" className="mb-6">All time stats</Title>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Minutes */}
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#308FAB]/10 rounded-full flex items-center justify-center">
                  <Image src="/icons/clock.svg" alt="Minutes" width={24} height={24} />
                </div>
                <Title color="#429FBA" size="xl" className="leading-tight">{mockStats.totalMinutes.toLocaleString()}</Title>
                <Text size="sm" color="#B0B0B0" weight="600">Minutes</Text>
              </div>

              {/* Classes */}
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#308FAB]/10 rounded-full flex items-center justify-center">
                  <Image src="/icons/fire-1.png" alt="Classes" width={24} height={24} />
                </div>
                <Title color="#429FBA" size="xl" className="leading-tight">{mockStats.totalClasses}</Title>
                <Text size="sm" color="#B0B0B0" weight="600">Classes</Text>
              </div>

              {/* Challenges */}
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#308FAB]/10 rounded-full flex items-center justify-center">
                  <Image src="/icons/fire-2.png" alt="Challenges" width={24} height={24} />
                </div>
                <Title color="#429FBA" size="xl" className="leading-tight">{mockStats.challengesCompleted}</Title>
                <Text size="sm" color="#B0B0B0" weight="600">Challenges</Text>
              </div>
            </div>

            {/* Streaks */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <Title size="base" weight="600" className="mb-4">🔥 Streaks</Title>
              <div className="space-y-4">
                {/* Daily Streak */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <Text size="base" weight="500">Daily streak</Text>
                    <Text size="sm" color="#B0B0B0">Longest: {mockStats.longestDailyStreak} days</Text>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white px-4 py-2 rounded-full">
                    <span className="font-bold">{mockStats.currentDailyStreak}</span>
                    <span>days</span>
                  </div>
                </div>

                {/* Weekly Streak */}
                <div className="flex justify-between items-center">
                  <div>
                    <Text size="base" weight="500">Weekly streak</Text>
                    <Text size="sm" color="#B0B0B0">Longest: {mockStats.longestWeeklyStreak} weeks</Text>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white px-4 py-2 rounded-full">
                    <span className="font-bold">{mockStats.currentWeeklyStreak}</span>
                    <span>weeks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => router.push("/profile/settings")}
              >
                Settings
              </Button>
              <Button
                variant="transparent"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="animate-fadeIn">
            <Title size="base" weight="600" className="mb-4">Recent Activity</Title>
            <div className="space-y-3">
              {mockActivity.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "challenge" 
                        ? "bg-gradient-to-br from-[#429FBA] to-[#217E9A]" 
                        : "bg-[#308FAB]/10"
                    }`}>
                      {activity.type === "challenge" ? (
                        <Image src="/icons/fire-2.png" alt="Challenge" width={24} height={24} />
                      ) : (
                        <Image src="/icons/play.svg" alt="Workout" width={20} height={20} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Text size="base" weight="600" className="truncate">{activity.title}</Text>
                      <div className="flex items-center gap-2 mt-1">
                        {activity.duration && (
                          <Text size="sm" color="#666">{activity.duration} min completed</Text>
                        )}
                        {activity.type === "challenge" && (
                          <Text size="sm" color="#308FAB">Joined challenge</Text>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <Text size="sm" color="#B0B0B0" className="flex-shrink-0">{activity.date}</Text>
                  </div>
                </div>
              ))}

              {/* Load More */}
              <div className="text-center py-6">
                <Text size="sm" color="#B0B0B0">No more activity to show</Text>
              </div>
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="animate-fadeIn">
            <Title size="base" weight="600" className="mb-4">Saved Workouts</Title>
            
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((video) => (
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
                      liked={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image src="/icons/heart.svg" alt="No favorites" width={32} height={32} className="opacity-50" />
                </div>
                <Title size="lg" className="mb-2 text-gray-600">No favorites yet</Title>
                <Text size="base" color="#B0B0B0" className="mb-6">
                  Save your favorite workouts by tapping the heart icon
                </Text>
                <Button variant="primary" onClick={() => router.push("/videos")}>
                  Browse Workouts
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
