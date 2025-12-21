"use client";

import { cards, spacing } from "./design-system";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = "", 
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const hoverClass = hover || onClick ? "hover:shadow-md transition-shadow" : "";
  const cursorClass = onClick ? "cursor-pointer" : "";
  
  return (
    <div 
      className={`${cards.base} ${spacing.card[padding]} ${hoverClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
