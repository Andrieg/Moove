"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

interface NavTab {
  id: string;
  title: string;
  icon: string;
  iconActive: string;
  links: string[];
}

const tabs: NavTab[] = [
  {
    id: "forYou",
    title: "For you",
    icon: "/icons/home.svg",
    iconActive: "/icons/homeFilled.svg",
    links: ["/"],
  },
  {
    id: "explore",
    title: "Explore",
    icon: "/icons/explore.svg",
    iconActive: "/icons/exploreFilled.svg",
    links: ["/explore", "/community", "/challenges", "/videos"],
  },
  {
    id: "book",
    title: "Book",
    icon: "/icons/book.svg",
    iconActive: "/icons/bookFilled.svg",
    links: ["/book"],
  },
  {
    id: "profile",
    title: "Profile",
    icon: "/icons/profile.svg",
    iconActive: "/icons/profile.svg",
    links: ["/profile", "/me"],
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("forYou");

  useEffect(() => {
    const tab = tabs.find((t) => t.links.some((l) => pathname === l || pathname.startsWith(l)));
    if (tab) setActiveTab(tab.id);
  }, [pathname]);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab.id);
    router.push(tab.links[0]);
  };

  const hideNav = pathname === "/login" || pathname === "/auth";

  if (hideNav) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-[3rem] px-4 py-3">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <Image
                src={isActive ? tab.iconActive : tab.icon}
                alt={tab.title}
                width={24}
                height={24}
                className="h-6 w-6"
              />
              {isActive && (
                <span className="text-xs font-normal text-gray-700">{tab.title}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
