"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User as AuthUser, Session } from "@supabase/supabase-js";
import type { User } from "@moove/types";
import { useAppStore } from "../_store/useAppStore";
import { supabase } from "../../lib/supabase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCoach: boolean;
  isMember: boolean;
  signUp: (email: string, password: string, role: "coach" | "member", metadata?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User) => void;
  showToast: (type: "success" | "error" | "info" | "warning", message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/registration",
  "/register",
  "/success",
  "/coach",
  "/client",
  "/signup",
  "/payment",
];

const COACH_ROUTES = ["/coach/dashboard"];

async function fetchUserProfile(authUser: AuthUser): Promise<User | null> {
  const { data: coach } = await supabase
    .from("coaches")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (coach) {
    return {
      id: coach.id,
      email: coach.email,
      firstName: coach.first_name,
      lastName: coach.last_name,
      role: "coach",
      brandSlug: coach.brand_slug,
      brand: coach.display_name,
      createdAt: coach.created_at,
      updatedAt: coach.updated_at,
    };
  }

  const { data: member } = await supabase
    .from("members")
    .select("*, coaches(brand_slug, display_name)")
    .eq("id", authUser.id)
    .maybeSingle();

  if (member) {
    return {
      id: member.id,
      email: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      role: "member",
      brand: member.coaches?.display_name,
      brandSlug: member.coaches?.brand_slug,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    };
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
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

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        if (profile) {
          storeLogin(profile, session.access_token);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (event === "SIGNED_IN" && session?.user) {
            const profile = await fetchUserProfile(session.user);
            if (profile) {
              storeLogin(profile, session.access_token);
            }
          } else if (event === "SIGNED_OUT") {
            storeLogout();
          }
        })();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(route + "/")
    );

    const isCoachRoute = COACH_ROUTES.some(
      (route) => pathname?.startsWith(route)
    );

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/coach/login");
      return;
    }

    if (isAuthenticated && isCoachRoute && !isCoach()) {
      addToast("warning", "Access denied. This area is for coaches only.");
      router.push("/");
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, isCoach, addToast]);

  const signUp = async (
    email: string,
    password: string,
    role: "coach" | "member",
    metadata?: Record<string, unknown>
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          ...metadata,
        },
      },
    });

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  };

  const signOut = async () => {
    const wasCoach = user?.role === "coach";
    await supabase.auth.signOut();
    storeLogout();

    if (wasCoach) {
      router.push("/coach/login");
    } else {
      router.push("/client/login");
    }
  };

  const handleSetUser = (newUser: User) => {
    storeSetUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isCoach: isCoach(),
        isMember: isMember(),
        signUp,
        signIn,
        signOut,
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

export { supabase };
