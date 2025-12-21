"use client";

import { useState, useEffect } from "react";
import type { Video, ChallengeWorkoutItem } from "@moove/types";
import { getVideos } from "@moove/api-client";
import Button from "../../_components/ui/Button";

interface AddVideoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (videos: ChallengeWorkoutItem[]) => void;
  existingIds: string[];
}

export default function AddVideoDrawer({ isOpen, onClose, onAdd, existingIds }: AddVideoDrawerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadVideos();
      setSelectedIds(new Set());
      setSearch("");
    }
  }, [isOpen]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((v) => {
    // Filter out already added videos
    if (existingIds.includes(v.id)) return false;
    // Filter by search
    if (search.trim()) {
      return v.title?.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const toggleVideo = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = () => {
    const selected = videos
      .filter((v) => selectedIds.has(v.id))
      .map((v) => ({
        id: v.id,
        title: v.title || "Untitled",
        durationMinutes: v.durationSeconds ? Math.floor(v.durationSeconds / 60) : undefined,
        thumbnailUrl: v.thumbnailUrl,
      }));
    onAdd(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Add Video</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
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
        </div>
        
        {/* Videos List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#308FAB]"></div>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No videos available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredVideos.map((video) => (
                <label
                  key={video.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(video.id)}
                    onChange={() => toggleVideo(video.id)}
                    className="w-5 h-5 rounded border-slate-300 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <div className="w-12 h-9 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{video.title || "Video"}</p>
                    {video.durationSeconds && (
                      <p className="text-xs text-slate-500">{Math.floor(video.durationSeconds / 60)} minutes</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <Button onClick={handleAdd} fullWidth disabled={selectedIds.size === 0}>
            ADD {selectedIds.size > 0 && `(${selectedIds.size})`}
          </Button>
        </div>
      </div>
    </>
  );
}
