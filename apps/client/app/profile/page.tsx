"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCurrentUserProfile, clearToken } from "@moove/api-client";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";
import { useRouter } from "next/navigation";

type Tab = "stats" | "activity";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  useEffect(() => {
    getCurrentUserProfile()
      .then((data: any) => setUser(data.user || data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8">
        {/* Header with Avatar */}
        <div className="flex flex-col items-center py-8">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white text-4xl font-bold">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50">
              <Image src="/icons/edit.svg" alt="Edit" width={16} height={16} />
            </button>
          </div>

          {/* Name */}
          <Title size="xl" weight="600" className="mb-8">
            {user?.email || "User"}
          </Title>

          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === "stats"
                  ? "bg-[#308FAB]/20 text-[#308FAB]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Text size="base" weight="600">Stats</Text>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === "activity"
                  ? "bg-[#308FAB]/20 text-[#308FAB]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Text size="base" weight="600">Activity</Text>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "stats" ? (
          <div>
            {/* All Time Stats */}
            <Title size="base" weight="600" className="mb-4">All time stats</Title>
            <div className="flex justify-between items-start mb-8 px-4">
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-2 relative">
                  <Image src="/icons/clock.svg" alt="Minutes" width={24} height={24} className="mx-auto" />
                </div>
                <Title color="#429FBA" size="lg" className="leading-tight">2000</Title>
                <Text size="sm" color="#B0B0B0" weight="600">Minutes</Text>
              </div>

              {/* Classes */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-2 relative">
                  <Image src="/icons/fire-1.png" alt="Classes" width={24} height={24} className="mx-auto" />
                </div>
                <Title color="#429FBA" size="lg" className="leading-tight">100</Title>
                <Text size="sm" color="#B0B0B0" weight="600">Classes</Text>
              </div>

              {/* Challenges */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-2 relative">
                  <Image src="/icons/fire-2.png" alt="Challenges" width={28} height={28} className="mx-auto" />
                </div>
                <Title color="#429FBA" size="lg" className="leading-tight">50</Title>
                <Text size="sm" color="#B0B0B0" weight="600">Challenges</Text>
              </div>
            </div>

            {/* Streaks */}
            <div className="space-y-4">
              {/* Daily Streak */}
              <div className="border-b border-gray-100 pb-2">
                <div className="flex justify-between mb-1">
                  <Text size="base" weight="500">Current daily streak</Text>
                  <Text size="base" weight="500">0</Text>
                </div>
                <div className="flex justify-between">
                  <Text size="base" weight="500" color="#B0B0B0">Longest</Text>
                  <Text size="base" weight="500" color="#B0B0B0">0</Text>
                </div>
              </div>

              {/* Weekly Streak */}
              <div>
                <div className="flex justify-between mb-1">
                  <Text size="base" weight="500">Current weekly streak</Text>
                  <Text size="base" weight="500">0</Text>
                </div>
                <div className="flex justify-between">
                  <Text size="base" weight="500" color="#B0B0B0">Longest</Text>
                  <Text size="base" weight="500" color="#B0B0B0">0</Text>
                </div>
              </div>
            </div>

            {/* Settings Button */}
            <div className="mt-12">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => router.push("/profile/settings")}
              >
                Settings
              </Button>
            </div>

            {/* Logout Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* Activity Tab */}
            <Title size="base" weight="600" className="mb-4">Recent Activity</Title>
            <div className="space-y-4">
              {/* Activity Items */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Text size="base" weight="600">Full Body HIIT Workout</Text>
                  <Text size="sm" color="#B0B0B0">2 days ago</Text>
                </div>
                <Text size="sm" color="#666">Completed 30 min workout</Text>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Text size="base" weight="600">Yoga Flow</Text>
                  <Text size="sm" color="#B0B0B0">5 days ago</Text>
                </div>
                <Text size="sm" color="#666">Completed 40 min workout</Text>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Text size="base" weight="600">Joined Challenge</Text>
                  <Text size="sm" color="#B0B0B0">1 week ago</Text>
                </div>
                <Text size="sm" color="#666">30 Day Strength Challenge</Text>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <Text size="base" color="#B0B0B0">No more activity to show</Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
