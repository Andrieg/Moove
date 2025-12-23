import React from "react";

interface TitleProps {
  children: React.ReactNode;
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | string;
  weight?: "400" | "500" | "600" | "700";
  color?: "primary" | "secondary" | "muted" | "inverse" | string;
  center?: boolean;
  noWrap?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Title({
  children,
  size = "xl",
  weight = "700",
  color,
  center = false,
  noWrap = false,
  className = "",
  onClick,
}: TitleProps) {
  const sizeClasses: Record<string, string> = {
    sm: "text-base",
    base: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-3xl",
    "3xl": "text-4xl",
  };

  const weightClasses: Record<string, string> = {
    "400": "font-normal",
    "500": "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
  };

  const colorClasses: Record<string, string> = {
    primary: "text-slate-900",
    secondary: "text-slate-600",
    muted: "text-slate-500",
    inverse: "text-white",
  };

  const centerClass = center ? "text-center" : "";
  const nowrapClass = noWrap ? "whitespace-nowrap" : "";
  const clickClass = onClick ? "cursor-pointer" : "";
  const sizeClass = sizeClasses[size] || sizeClasses.xl;
  const weightClass = weightClasses[weight] || "font-bold";

  // Determine color - use preset or custom
  const isPresetColor = color && colorClasses[color];
  const colorClass = isPresetColor ? colorClasses[color] : "";
  const colorStyle = color && !isPresetColor ? { color } : {};

  // Custom size support
  const isCustomSize = size && !sizeClasses[size];
  const customSizeStyle = isCustomSize ? { fontSize: size } : {};

  return (
    <span
      className={`font-sans ${sizeClass} ${weightClass} ${colorClass} ${centerClass} ${nowrapClass} ${clickClass} ${className}`}
      style={{ ...colorStyle, ...customSizeStyle }}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
