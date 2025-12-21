"use client";

import type { ChallengeWorkoutItem } from "@moove/types";

interface WorkoutsListProps {
  workouts: ChallengeWorkoutItem[];
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

export default function WorkoutsList({ workouts, onRemove, onAddClick }: WorkoutsListProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-3">
        Workouts * ({workouts.length})
      </label>
      
      <div className="space-y-3">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
          >
            {/* Drag Handle */}
            <button type="button" className="text-slate-400 hover:text-slate-600 cursor-grab">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
            
            {/* Thumbnail */}
            <div className="w-16 h-12 rounded overflow-hidden bg-slate-200 flex-shrink-0">
              {workout.thumbnailUrl ? (
                <img
                  src={workout.thumbnailUrl}
                  alt={workout.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-900 truncate">{workout.title}</p>
              {workout.durationMinutes && (
                <p className="text-xs text-slate-500">{workout.durationMinutes} minutes</p>
              )}
            </div>
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onRemove(workout.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        
        {/* Add Video Link */}
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-2 text-[#308FAB] hover:text-[#267a91] text-sm font-medium transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Video
        </button>
      </div>
    </div>
  );
}
