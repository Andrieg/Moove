"use client";

import ProfileTabs from "../_components/ProfileTabs";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <ProfileTabs />
      {children}
    </div>
  );
}
