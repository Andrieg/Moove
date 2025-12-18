"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/videos": "Videos",
  "/dashboard/videos/new": "Upload Video",
  "/dashboard/challenges": "Challenges",
  "/dashboard/challenges/new": "Create Challenge",
  "/dashboard/live": "Live Classes",
  "/dashboard/members": "Members",
  "/dashboard/settings": "Settings",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname || ""] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-[#308FAB] rounded-full flex items-center justify-center text-white text-sm font-semibold">
          C
        </div>
      </div>
    </header>
  );
}
