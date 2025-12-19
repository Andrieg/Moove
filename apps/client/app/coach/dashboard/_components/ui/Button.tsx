"use client";

import React, { useEffect, useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children, onClick, variant = "primary", size = "md", fullWidth = false, disabled = false, type = "button", className = "",
}: ButtonProps) {
  const [themeColor, setThemeColor] = useState("#308FAB");

  useEffect(() => {
    // Load theme color from localStorage
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) {
      setThemeColor(savedColor);
    } else {
      const savedUser = localStorage.getItem("moovefit-user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user.themeColor) {
            setThemeColor(user.themeColor);
          }
        } catch (e) {}
      }
    }
  }, []);

  const baseClasses = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2";
  const sizeClasses = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  // Dynamic styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return { backgroundColor: themeColor, color: "white" };
      case "secondary":
        return {};
      case "outline":
        return {};
      case "danger":
        return {};
      default:
        return { backgroundColor: themeColor, color: "white" };
    }
  };

  const variantClasses = {
    primary: "text-white hover:opacity-90 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      style={variant === "primary" ? getVariantStyles() : undefined}
    >
      {children}
    </button>
  );
}
