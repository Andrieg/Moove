"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "./_components/layout/DashboardLayout";
import Card from "./_components/ui/Card";
import Button from "./_components/ui/Button";
import { getVideos, getChallenges } from "@moove/api-client";
import type { Video, Challenge } from "@moove/types";

export default function DashboardHome() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVideos(), getChallenges()])
      .then(([videosData, challengesData]) => {
        setVideos(videosData);
        setChallenges(challengesData);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Videos", value: videos.length, icon: "play", color: "bg-blue-500" },
    { label: "Active Challenges", value: challenges.length, icon: "fire", color: "bg-orange-500" },
    { label: "Total Members", value: 156, icon: "users", color: "bg-green-500" },
    { label: "Live Classes", value: 12, icon: "live", color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  {stat.icon === "play" && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  )}
                  {stat.icon === "fire" && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  )}
                  {stat.icon === "users" && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {stat.icon === "live" && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push("/videos/new")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Video
            </Button>
            <Button variant="secondary" onClick={() => router.push("/challenges/new")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Challenge
            </Button>
            <Button variant="outline" onClick={() => router.push("/live/new")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Schedule Live Class
            </Button>
          </div>
        </Card>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Videos */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Videos</h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/videos")}>
                View All
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No videos yet</div>
            ) : (
              <div className="space-y-3">
                {videos.slice(0, 5).map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                    onClick={() => router.push(`/videos/${video.id}`)}
                  >
                    <div className="w-16 h-10 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                      {/* Video thumbnail placeholder */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">{video.title}</p>
                      <p className="text-xs text-slate-500">
                        {Math.floor((video.durationSeconds || 0) / 60)} min
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      video.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {video.published ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Challenges */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Challenges</h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/challenges")}>
                View All
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No challenges yet</div>
            ) : (
              <div className="space-y-3">
                {challenges.slice(0, 5).map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                    onClick={() => router.push(`/challenges/${challenge.id}`)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">{challenge.title}</p>
                      <p className="text-xs text-slate-500">
                        {challenge.startDate ? new Date(challenge.startDate).toLocaleDateString() : "No date"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
