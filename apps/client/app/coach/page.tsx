"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "../_store/useAppStore";

export default function CoachRedirectPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAppStore();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated and is a coach
    const isCoach = isAuthenticated && user?.role === "coach";

    if (isCoach) {
      router.replace("/coach/dashboard");
    } else {
      router.replace("/coach/register");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking auth
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
