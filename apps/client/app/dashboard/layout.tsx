"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import DashboardSidebar from "./_components/layout/DashboardSidebar";
import DashboardHeader from "./_components/layout/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/onboarding");
      return;
    }

    // Check if user is a coach (for now, allow all authenticated users in dev mode)
    // In production, check user.role === 'coach' or similar
    const isCoach = user?.email?.includes("coach") || 
                    (user as any)?.role === "coach" || 
                    process.env.NODE_ENV !== "production";

    if (!isCoach) {
      // Not a coach, redirect to member home
      router.push("/home");
      return;
    }

    setIsAuthorized(true);
  }, [user, isLoading, isAuthenticated, router]);

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
