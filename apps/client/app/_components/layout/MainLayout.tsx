"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/auth";

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-[5.5rem] pb-[6rem] md:pb-0">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
