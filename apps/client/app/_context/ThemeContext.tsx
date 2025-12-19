"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME_COLOR = "#308FAB";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState(DEFAULT_THEME_COLOR);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme color from localStorage
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) {
      setThemeColorState(savedColor);
    } else {
      // Try to get from user data
      const savedUser = localStorage.getItem("moovefit-user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user.themeColor) {
            setThemeColorState(user.themeColor);
          }
        } catch (e) {
          console.error("Failed to parse user data");
        }
      }
    }
  }, []);

  // Update CSS variable when theme color changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty("--theme-color", themeColor);
      // Also set a lighter variant for hover states
      document.documentElement.style.setProperty("--theme-color-light", `${themeColor}20`);
    }
  }, [themeColor, mounted]);

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem("moove_theme_color", color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Hook to get theme color with SSR safety
export function useThemeColor() {
  const { themeColor } = useTheme();
  return themeColor;
}
