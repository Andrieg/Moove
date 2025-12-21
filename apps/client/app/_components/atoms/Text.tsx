import React from "react";

interface TextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg";
  weight?: "300" | "400" | "500" | "600" | "700";
  color?: "primary" | "secondary" | "muted" | "inverse" | string;
  center?: boolean;
  noWrap?: boolean;
  className?: string;
  mb?: string;
}

export default function Text({
  children,
  size = "sm",
  weight = "400",
  color,
  center = false,
  noWrap = false,
  className = "",
  mb,
}: TextProps) {
  const sizeClasses: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  const weightClasses: Record<string, string> = {
    "300": "font-light",
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
  const sizeClass = sizeClasses[size] || sizeClasses.sm;
  const weightClass = weightClasses[weight] || "font-normal";
  
  // Determine color - use preset or custom
  const isPresetColor = color && colorClasses[color];
  const colorClass = isPresetColor ? colorClasses[color] : "";
  const colorStyle = color && !isPresetColor ? { color } : {};
  const marginStyle = mb ? { marginBottom: mb } : {};

  return (
    <span
      className={`font-sans ${sizeClass} ${weightClass} ${colorClass} ${centerClass} ${nowrapClass} ${className}`}
      style={{ ...colorStyle, ...marginStyle }}
    >
      {children}
    </span>
  );
}
