"use client";

import { badges } from "./design-system";

type BadgeVariant = keyof typeof badges.variants;

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span className={`${badges.base} ${badges.variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
