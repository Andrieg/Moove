"use client";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
}

export default function ProgressIndicator({
  current,
  total,
  label,
  size = "md",
  showPercentage = true,
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-[#308FAB]">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${sizeClasses[size]} bg-gradient-to-r from-[#429FBA] to-[#217E9A] rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          {current} of {total} completed
        </span>
      </div>
    </div>
  );
}
