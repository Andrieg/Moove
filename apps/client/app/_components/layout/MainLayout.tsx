"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { AuthProvider } from "../../_context/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Pages that don't need any layout
  const hideLayout = pathname === "/login" || 
    pathname === "/auth" || 
    pathname === "/onboarding" || 
    pathname === "/registration" || 
    pathname === "/success";

  // Dashboard pages have their own layout
  const isDashboard = pathname?.startsWith("/dashboard");

  // Wrap everything in AuthProvider
  if (hideLayout) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  // Dashboard has its own layout, just provide auth context
  if (isDashboard) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  // Check if page has bottom tabs (Explore section)
  const hasBottomTabs = pathname === "/explore" || 
    pathname === "/community" || 
    pathname === "/challenges" || 
    pathname === "/videos";

  return (
    <AuthProvider>
      <Header />
      <main className={`pb-[6rem] md:pb-0 ${hasBottomTabs ? "pt-[9rem]" : "pt-[5.5rem]"}`}>
        {children}
      </main>
      <BottomNav />
    </AuthProvider>
  );
}
