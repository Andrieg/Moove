"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { AuthProvider } from "../../_context/AuthContext";
import GlobalToast from "../GlobalToast";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Pages that don't need any layout (but may need auth wrapper)
  const hideLayout = pathname === "/login" || 
    pathname === "/auth" || 
    pathname === "/onboarding" || 
    pathname === "/registration" || 
    pathname === "/success" ||
    pathname === "/signup";

  // Registration pages need auth provider but no layout
  const isRegister = pathname === "/register" || 
    pathname?.startsWith("/register") ||
    pathname === "/coach/register" ||
    pathname === "/client/register";

  // Dashboard pages have their own layout
  const isDashboard = pathname?.startsWith("/dashboard");

  // Coach landing pages are public - no auth wrapper needed
  const isCoachLanding = pathname?.startsWith("/coach/");

  // Payment pages are public
  const isPayment = pathname?.startsWith("/payment/");

  // Register page needs AuthProvider for useAuth hook but no layout
  if (isRegister) {
    return (
      <AuthProvider>
        {children}
        <GlobalToast />
      </AuthProvider>
    );
  }

  // Public pages - no auth wrapper but include GlobalToast
  if (hideLayout || isCoachLanding || isPayment) {
    return (
      <>
        {children}
        <GlobalToast />
      </>
    );
  }

  // Dashboard has its own layout, provide auth context
  if (isDashboard) {
    return (
      <AuthProvider>
        {children}
        <GlobalToast />
      </AuthProvider>
    );
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
      <GlobalToast />
    </AuthProvider>
  );
}
