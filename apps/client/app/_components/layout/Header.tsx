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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-20">
        <div className="flex items-center h-full px-4 md:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-[#308FAB]">Moove</span>
          </div>

          {/* Main Tabs - Hidden on mobile */}
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`font-medium text-base transition-colors ${
                  activeTab === tab.id
                    ? "text-[#308FAB] border-b-2 border-[#308FAB]"
                    : "text-gray-600 hover:text-[#308FAB]"
                } pb-1`}
              >
                {tab.title}
              </button>
            ))}
          </nav>

          {/* Search Icon */}
          <div className="ml-auto">
            <Image
              src="/icons/search.svg"
              alt="Search"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Bottom Tabs */}
      {bottomTabs.length > 0 && (
        <div className="fixed top-20 left-0 right-0 z-20 bg-white h-14 border-b border-gray-100 hidden md:flex items-center justify-center">
          <nav className="flex gap-4">
            {bottomTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleBottomTabClick(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeBottomTab === tab.id || pathname === tab.link
                    ? "bg-[#308FAB] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
