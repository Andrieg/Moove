"use client";

import { useEffect, useState } from "react";
import { memberProgressService } from "@/lib/supabase-services";

interface MemberProgressTrackerProps {
  videoId: string;
  videoDuration?: number;
  onProgressUpdate?: (progress: number) => void;
}

export default function MemberProgressTracker({
  videoId,
  videoDuration,
  onProgressUpdate,
}: MemberProgressTrackerProps) {
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [videoId]);

  const loadProgress = async () => {
    try {
      const data = await memberProgressService.getVideoProgress(videoId);
      if (data) {
        setProgress(data.progress_seconds || 0);
        setCompleted(data.completed || false);
      }
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (seconds: number) => {
    try {
      const isCompleted = videoDuration ? seconds >= videoDuration * 0.9 : false;

      await memberProgressService.createOrUpdate({
        video_id: videoId,
        progress_seconds: seconds,
        completed: isCompleted,
      });

      setProgress(seconds);
      setCompleted(isCompleted);

      if (onProgressUpdate) {
        onProgressUpdate(seconds);
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const markAsComplete = async () => {
    try {
      await memberProgressService.createOrUpdate({
        video_id: videoId,
        completed: true,
        progress_seconds: videoDuration || 0,
      });

      setCompleted(true);
    } catch (err) {
      console.error("Failed to mark as complete:", err);
    }
  };

  if (loading) {
    return null;
  }

  const progressPercentage = videoDuration
    ? Math.min((progress / videoDuration) * 100, 100)
    : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {completed ? "Completed" : "In Progress"}
        </span>
        {videoDuration && (
          <span className="text-slate-500">
            {Math.floor(progress / 60)} / {Math.floor(videoDuration / 60)} min
          </span>
        )}
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            completed ? "bg-green-500" : "bg-[#308FAB]"
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {!completed && (
        <button
          onClick={markAsComplete}
          className="w-full py-2 px-4 bg-[#308FAB] text-white rounded-lg font-medium hover:bg-[#267A92] transition"
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
}
