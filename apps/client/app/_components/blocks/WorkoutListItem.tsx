"use client";

import Image from "next/image";
import Text from "../atoms/Text";

interface WorkoutListItemProps {
  day: number;
  title: string;
  duration: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
}

export default function WorkoutListItem({
  day,
  title,
  duration,
  isCompleted = false,
  isLocked = false,
  isCurrent = false,
  onClick,
}: WorkoutListItemProps) {
  return (
    <div
      onClick={isLocked ? undefined : onClick}
      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
        isLocked
          ? "bg-gray-100 opacity-60 cursor-not-allowed"
          : isCurrent
          ? "bg-[#308FAB]/10 border-2 border-[#308FAB] cursor-pointer hover:bg-[#308FAB]/20"
          : isCompleted
          ? "bg-green-50 cursor-pointer hover:bg-green-100"
          : "bg-white border border-gray-200 cursor-pointer hover:border-[#308FAB] hover:shadow-sm"
      }`}
    >
      {/* Day Number / Status Icon */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted
            ? "bg-green-500"
            : isCurrent
            ? "bg-[#308FAB]"
            : isLocked
            ? "bg-gray-300"
            : "bg-gray-200"
        }`}
      >
        {isCompleted ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : isLocked ? (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <span className={`font-bold ${isCurrent ? "text-white" : "text-gray-600"}`}>
            {day}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Text size="base" weight="600" className={isLocked ? "text-gray-400" : ""}>
            Day {day}: {title}
          </Text>
          {isCurrent && (
            <span className="px-2 py-0.5 bg-[#308FAB] text-white text-xs font-semibold rounded-full">
              TODAY
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Image src="/icons/clock.svg" alt="Duration" width={14} height={14} className={isLocked ? "opacity-50" : ""} />
          <Text size="sm" className={isLocked ? "text-gray-400" : "text-gray-500"}>
            {duration} min
          </Text>
        </div>
      </div>

      {/* Arrow */}
      {!isLocked && (
        <div className="flex-shrink-0">
          <Image src="/icons/arrow-right.svg" alt="Go" width={16} height={16} />
        </div>
      )}
    </div>
  );
}
