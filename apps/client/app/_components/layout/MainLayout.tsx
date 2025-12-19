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

  // Registration and login pages need auth provider but no layout
  const isAuthPage = pathname === "/register" || 
    pathname?.startsWith("/register") ||
    pathname === "/coach/register" ||
    pathname === "/coach/login" ||
    pathname === "/client/register" ||
    pathname === "/client/login";

  // Dashboard pages have their own layout (now under /coach/dashboard)
  const isDashboard = pathname?.startsWith("/coach/dashboard");

  // Coach landing pages are public - but exclude dashboard, login, register
  const isCoachLanding = pathname?.startsWith("/coach/") && 
    !pathname?.startsWith("/coach/dashboard") &&
    !pathname?.startsWith("/coach/login") &&
    !pathname?.startsWith("/coach/register");

  // Payment pages are public
  const isPayment = pathname?.startsWith("/payment/");

  // Auth pages (register/login) need AuthProvider for useAuth hook but no layout
  if (isAuthPage) {
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
