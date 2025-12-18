"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Tab {
  id: string;
  title: string;
  link: string;
  bottomTabs?: { id: string; title: string; link: string }[];
}

const mainTabs: Tab[] = [
  { id: "for_you", title: "For You", link: "/" },
  {
    id: "explore",
    title: "Explore",
    link: "/explore",
    bottomTabs: [
      { id: "workouts", title: "Workouts", link: "/explore" },
      { id: "community", title: "Community", link: "/community" },
      { id: "challenges", title: "Challenges", link: "/challenges" },
      { id: "videos", title: "Videos", link: "/videos" },
    ],
  },
  { id: "book", title: "Book", link: "/book" },
  { id: "profile", title: "Profile", link: "/profile" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("for_you");
  const [activeBottomTab, setActiveBottomTab] = useState("");

  const currentTab = mainTabs.find(
    (t) => t.id === activeTab || t.bottomTabs?.some((bt) => bt.link === pathname)
  );
  const bottomTabs = currentTab?.bottomTabs || [];

  useEffect(() => {
    const tab = mainTabs.find(
      (t) => t.link === pathname || t.bottomTabs?.some((bt) => bt.link === pathname)
    );
    if (tab) {
      setActiveTab(tab.id);
      const bottomTab = tab.bottomTabs?.find((bt) => bt.link === pathname);
      if (bottomTab) setActiveBottomTab(bottomTab.id);
    }
  }, [pathname]);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    router.push(tab.link);
  };

  const handleBottomTabClick = (tab: { id: string; title: string; link: string }) => {
    setActiveBottomTab(tab.id);
    router.push(tab.link);
  };

  // Get right icon based on current page
  const getRightIcon = () => {
    if (pathname === "/" || pathname === "/explore" || pathname.startsWith("/community") || pathname.startsWith("/challenges") || pathname.startsWith("/videos")) {
      return { icon: "/icons/search.svg", link: "/search", alt: "Search" };
    }
    if (pathname === "/book") {
      return { icon: "/icons/calendar-add.svg", link: "/book/appointment", alt: "Add Booking" };
    }
    if (pathname === "/profile" || pathname.startsWith("/profile")) {
      return { icon: "/icons/header-settings-icon.svg", link: "/profile/settings", alt: "Settings" };
    }
    return { icon: "/icons/search.svg", link: "/search", alt: "Search" };
  };

  const rightIcon = getRightIcon();

  return (
    <>
      {/* Main Header - 5rem height to match legacy */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#E6E5E5] h-[5rem]">
        <div className="flex items-center h-full">
          {/* Logo */}
          <div className="flex-1 flex items-center pl-8 h-full">
            <Image
              src="/images/logo-black.png"
              alt="Moove"
              width={100}
              height={32}
              className="cursor-pointer"
              onClick={() => router.push("/")}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Main Tabs - Hidden on mobile, flex-5 equivalent */}
          <nav className="hidden md:flex flex-[5] justify-center items-center h-full">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`h-full px-8 font-semibold text-[1rem] transition-colors relative ${
                  activeTab === tab.id
                    ? "text-[#308FAB]"
                    : "text-black hover:text-[#308FAB]"
                }`}
              >
                {tab.title}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#308FAB] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex-1 flex justify-end items-center pr-8 gap-2">
            {/* Coach Dashboard Link */}
            <a
              href={typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://localhost:3001'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-50 rounded-full transition flex items-center gap-2 text-sm font-medium text-[#308FAB] border border-[#308FAB] px-3"
              title="Open Coach Dashboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span className="hidden lg:inline">Coach</span>
            </a>
            <button
              onClick={() => router.push(rightIcon.link)}
              className="p-2 hover:bg-gray-50 rounded-full transition"
            >
              <Image
                src={rightIcon.icon}
                alt={rightIcon.alt}
                width={28}
                height={28}
                className="cursor-pointer"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Tabs - 3.5rem height to match legacy */}
      {bottomTabs.length > 0 && (
        <div className="fixed top-[calc(5rem+1px)] left-0 right-0 z-20 bg-white h-[3.5rem] hidden md:flex items-center justify-center">
          <nav className="flex gap-2 overflow-x-auto hide-scrollbar px-4">
            {bottomTabs.map((tab) => {
              const isActive = activeBottomTab === tab.id || pathname === tab.link;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleBottomTabClick(tab)}
                  className={`px-6 py-2 rounded-full text-[1rem] font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[rgba(48,143,171,0.2)] text-[#308FAB]"
                      : "bg-[#F8F8F8] text-black hover:bg-gray-200"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
