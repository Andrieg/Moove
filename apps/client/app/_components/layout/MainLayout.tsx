"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || 
    pathname === "/auth" || 
    pathname === "/onboarding" || 
    pathname === "/registration" || 
    pathname === "/success";

  if (hideLayout) {
    return <>{children}</>;
  }

  // Check if page has bottom tabs (Explore section)
  const hasBottomTabs = pathname === "/explore" || 
    pathname === "/community" || 
    pathname === "/challenges" || 
    pathname === "/videos";

  return (
    <>
      <Header />
      <main className={`pb-[6rem] md:pb-0 ${hasBottomTabs ? "pt-[9rem]" : "pt-[5.5rem]"}`}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}
