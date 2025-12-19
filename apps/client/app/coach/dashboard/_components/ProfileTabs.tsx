"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "account", label: "Account", href: "/coach/dashboard/profile/account" },
  { id: "brand", label: "Brand", href: "/coach/dashboard/profile/brand" },
];

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-8 border-b border-slate-200 mb-8">
      {tabs.map((tab) => {
        const isActive = pathname?.includes(tab.id);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              isActive
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#308FAB]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
