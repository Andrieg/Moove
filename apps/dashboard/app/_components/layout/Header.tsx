"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/videos": "Videos",
  "/videos/new": "Upload Video",
  "/challenges": "Challenges",
  "/challenges/new": "Create Challenge",
  "/live": "Live Classes",
  "/members": "Members",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();
  
  // Get title from path
  let title = pageTitles[pathname || "/"] || "Dashboard";
  
  // Handle dynamic routes
  if (pathname?.startsWith("/videos/") && pathname !== "/videos/new") {
    title = "Edit Video";
  }
  if (pathname?.startsWith("/challenges/") && pathname !== "/challenges/new") {
    title = "Edit Challenge";
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
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

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-slate-100 transition relative">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white text-sm font-semibold">
            C
          </div>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
