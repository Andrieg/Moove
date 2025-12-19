"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../../_context/AuthContext";

const pageTitles: Record<string, string> = {
  "/coach/dashboard": "Dashboard",
  "/coach/dashboard/videos": "Videos",
  "/coach/dashboard/videos/new": "Upload Video",
  "/coach/dashboard/challenges": "Challenges",
  "/coach/dashboard/challenges/new": "Create Challenge",
  "/coach/dashboard/live": "Live Classes",
  "/coach/dashboard/members": "Members",
  "/coach/dashboard/settings": "Settings",
  "/coach/dashboard/landing": "Landing Page",
  "/coach/dashboard/profile": "Profile",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [themeColor, setThemeColor] = useState("#308FAB");

  useEffect(() => {
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) {
      setThemeColor(savedColor);
    } else {
      const savedUser = localStorage.getItem("moovefit-user");
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          if (userObj.themeColor) {
            setThemeColor(userObj.themeColor);
          }
        } catch (e) {}
      }
    }
  }, []);
  
  // Show personalized welcome on main dashboard
  const isHome = pathname === "/coach/dashboard";
  const title = isHome 
    ? `Welcome, ${user?.firstName || "Coach"}!`
    : (pageTitles[pathname || ""] || "Dashboard");

  // Get user initials
  const initials = user?.firstName 
    ? user.firstName.charAt(0).toUpperCase()
    : "C";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Messages */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        {/* Profile Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: themeColor }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
