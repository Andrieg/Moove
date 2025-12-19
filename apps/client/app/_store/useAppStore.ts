"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole } from "@moove/types";

// Keys for localStorage
const TOKEN_KEY = "moovefit-token";
const USER_KEY = "moovefit-user";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface AppState {
  // Auth state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Brand context (for members viewing coach content)
  currentBrand: string | null;

  // UI state
  toasts: Toast[];

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setCurrentBrand: (brand: string | null) => void;

  // Toast actions
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;

  // Role checks
  isCoach: () => boolean;
  isMember: () => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      currentBrand: null,
      toasts: [],

      // Auth actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        // Also store in localStorage for API client compatibility
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          currentBrand: null,
        });
        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setCurrentBrand: (currentBrand) => set({ currentBrand }),

      // Toast actions
      addToast: (type, message) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }],
        }));
        // Auto-remove after 4 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Role checks
      isCoach: () => {
        const { user } = get();
        return user?.role === "coach";
      },

      isMember: () => {
        const { user } = get();
        return user?.role === "member";
      },
    }),
    {
      name: "moove-app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        currentBrand: state.currentBrand,
      }),
      onRehydrateStorage: () => (state) => {
        // When storage is rehydrated, set loading to false
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

// Selector hooks for common patterns
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useIsCoach = () => useAppStore((state) => state.isCoach());
export const useIsMember = () => useAppStore((state) => state.isMember());
export const useToasts = () => useAppStore((state) => state.toasts);
