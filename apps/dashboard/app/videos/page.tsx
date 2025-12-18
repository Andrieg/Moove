"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../_components/layout/DashboardLayout";
import Card from "../_components/ui/Card";
import Button from "../_components/ui/Button";
import Table from "../_components/ui/Table";
import { getVideos } from "@moove/api-client";
import type { Video } from "@moove/types";

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .finally(() => setLoading(false));
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (video: Video) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-10 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
            {/* Thumbnail */}
          </div>
          <div>
            <p className="font-medium text-slate-900">{video.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      width: "100px",
      render: (video: Video) => (
        <span>{Math.floor((video.durationSeconds || 0) / 60)} min</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "100px",
      render: (video: Video) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          video.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}>
          {video.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "120px",
      render: (video: Video) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/videos/${video.id}`);
            }}
            className="p-2 hover:bg-slate-100 rounded transition"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete handler
            }}
            className="p-2 hover:bg-red-50 rounded transition"
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card padding="none">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">
              {filteredVideos.length} videos
            </span>
          </div>
          <Button onClick={() => router.push("/videos/new")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Video
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-slate-500">Loading videos...</p>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredVideos}
            onRowClick={(video) => router.push(`/videos/${video.id}`)}
            emptyMessage="No videos found. Upload your first video!"
          />
        )}
      </Card>
    </DashboardLayout>
  );
}
