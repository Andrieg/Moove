"use client";

import React, { useEffect, useState } from "react";
import { buttons, colors } from "./design-system";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const [themeColor, setThemeColor] = useState("#308FAB");

  useEffect(() => {
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

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "" : "cursor-pointer";

  // Dynamic styles for primary variant
  const getVariantStyles = () => {
    if (variant === "primary") {
      return { backgroundColor: themeColor, color: "white" };
    }
    return undefined;
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${buttons.base} ${buttons.variants[variant]} ${buttons.sizes[size]} ${widthClass} ${disabledClass} ${className}`}
      style={getVariantStyles()}
    >
      {children}
    </button>
  );
}
