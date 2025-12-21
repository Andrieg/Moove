"use client";

import { loading } from "./design-system";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${loading.spinner} ${loading.spinnerSizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="lg" />
      <p className="text-slate-500 mt-4 text-sm">{message}</p>
    </div>
  );
}
