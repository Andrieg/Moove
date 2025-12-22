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
    links: ["/explore", "/challenges", "/videos"],
  },
  {
    id: "search",
    title: "Search",
    icon: "/icons/search.svg",
    iconActive: "/icons/search.svg",
    links: ["/search"],
  },
  {
    id: "profile",
    title: "Profile",
    icon: "/images/example-avatar-4.png",
    iconActive: "/images/example-avatar-4.png",
    links: ["/profile"],
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("forYou");

  useEffect(() => {
    const tab = tabs.find((t) => t.links.some((l) => pathname === l || pathname.startsWith(l + "/")));
    if (tab) setActiveTab(tab.id);
    else if (pathname === "/") setActiveTab("forYou");
  }, [pathname]);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab.id);
    router.push(tab.links[0]);
  };

  // Hide on certain pages
  const hideNav = pathname === "/login" || pathname === "/auth" || pathname.startsWith("/player");

  if (hideNav) return null;

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white rounded-[5rem] mx-0 mb-0 px-4 py-4"
      style={{ 
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        width: "calc(100vw - 2rem)",
        marginLeft: "1rem",
        marginBottom: "0"
      }}
    >
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isProfile = tab.id === "profile";
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center gap-1 min-w-[50px] transition-all"
            >
              {isProfile ? (
                <Image
                  src={tab.icon}
                  alt={tab.title}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
                  style={{ borderRadius: "1rem" }}
                />
              ) : (
                <Image
                  src={isActive ? tab.iconActive : tab.icon}
                  alt={tab.title}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              )}
              {isActive && (
                <span className="text-[0.8rem] font-normal text-black">
                  {tab.title}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
