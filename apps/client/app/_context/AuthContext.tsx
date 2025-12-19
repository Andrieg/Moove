"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@moove/types";
import { useAppStore } from "../_store/useAppStore";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCoach: boolean;
  isMember: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  showToast: (type: "success" | "error" | "info" | "warning", message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "moovefit-token";
const USER_KEY = "moovefit-user";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/onboarding",
  "/login",
  "/auth",
  "/registration",
  "/register",
  "/success",
  "/coach",
  "/client",
  "/signup",
  "/payment",
];

// Routes that require coach role
const COACH_ROUTES = ["/dashboard"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Use Zustand store
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser: storeSetUser,
    setToken,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    addToast,
    isCoach,
    isMember,
  } = useAppStore();

  // Initial auth check - sync with localStorage if Zustand hasn't hydrated yet
  useEffect(() => {
    const checkAuth = () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser && !user) {
        try {
          const parsedUser = JSON.parse(savedUser);
          storeLogin(parsedUser, savedToken);
        } catch {
          // Invalid data, clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Route protection logic
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(route + "/")
    );

    const isCoachRoute = COACH_ROUTES.some(
      (route) => pathname?.startsWith(route)
    );

    // Not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/onboarding");
      return;
    }

    // Authenticated but trying to access coach-only route without coach role
    if (isAuthenticated && isCoachRoute && !isCoach()) {
      addToast("warning", "Access denied. This area is for coaches only.");
      router.push("/");
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, isCoach, addToast]);

  const login = (newUser: User, newToken: string) => {
    storeLogin(newUser, newToken);
  };

  const logout = () => {
    storeLogout();
    router.push("/onboarding");
  };

  const handleSetUser = (newUser: User) => {
    storeSetUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isCoach: isCoach(),
        isMember: isMember(),
        login,
        logout,
        setUser: handleSetUser,
        showToast: addToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
