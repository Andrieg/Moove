"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import DashboardSidebar from "./_components/layout/DashboardSidebar";
import DashboardHeader from "./_components/layout/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, isCoach, showToast } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/onboarding");
      return;
    }

    // Check if user has coach role
    if (!isCoach) {
      showToast("warning", "Access denied. This area is for coaches only.");
      router.push("/");
      return;
    }

    setIsAuthorized(true);
  }, [user, isLoading, isAuthenticated, isCoach, router, showToast]);

  // Show loading while checking authorization
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
