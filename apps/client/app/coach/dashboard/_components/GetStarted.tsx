"use client";

import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";

interface SetupItem {
  title: string;
  description?: string;
  action: string;
  href: string;
  completed?: boolean;
  missing?: boolean;
}

export default function GetStarted() {
  const { user } = useAuth();
  
  const brandSlug = (user as any)?.brandSlug || "brandname";
  const studioUrl = `https://www.moove.fit/${brandSlug}`;

  const setupItems: SetupItem[] = [
    {
      title: "Your studio",
      description: studioUrl,
      action: "Copy",
      href: "#",
    },
    {
      title: "Complete profile",
      action: "Edit profile",
      href: "/dashboard/profile",
    },
    {
      title: "Branding",
      action: "Customise",
      href: "/dashboard/landing",
    },
    {
      title: "Payment provider",
      action: "Connect payment",
      href: "/dashboard/payments",
      missing: true,
    },
    {
      title: "Add first on demand activity",
      action: "Add class",
      href: "/dashboard/videos/new",
    },
    {
      title: "Schedule class",
      action: "Add class",
      href: "/dashboard/live/new",
    },
    {
      title: "Create membership",
      action: "Add membership",
      href: "/dashboard/memberships/new",
    },
    {
      title: "Your Website",
      action: "Set up your website",
      href: "/dashboard/landing",
    },
  ];

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(studioUrl);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Get started</h2>
      
      <div className="space-y-4">
        {setupItems.map((item, index) => (
          <div key={index} className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {item.title}
                {item.missing && (
                  <span className="text-red-500 ml-2 font-normal">Missing</span>
                )}
              </p>
              {item.description && (
                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
              )}
            </div>
            
            {item.title === "Your studio" ? (
              <button
                onClick={handleCopyUrl}
                className="text-sm text-[#308FAB] hover:underline"
              >
                {item.action}
              </button>
            ) : item.title === "Add first on demand activity" ? (
              <div className="flex gap-3">
                <Link href={item.href} className="text-sm text-[#308FAB] hover:underline">
                  Add class
                </Link>
                <Link href="/coach/dashboard/videos/new" className="text-sm text-[#308FAB] hover:underline">
                  Add video
                </Link>
              </div>
            ) : (
              <Link href={item.href} className="text-sm text-[#308FAB] hover:underline">
                {item.action}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
