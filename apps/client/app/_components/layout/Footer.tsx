"use client";

import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function Footer({ variant = "light", className = "" }: FooterProps) {
  const isDark = variant === "dark";
  
  return (
    <footer className={`py-8 border-t ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} ${className}`}>
      <div className="px-4 text-center">
        <p className={`text-xs mb-3 ${isDark ? "text-slate-400" : "text-slate-400"}`}>
          Powered by
        </p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Image 
            src={isDark ? "/images/logo.svg" : "/images/logo-dark.svg"} 
            alt="Moove" 
            width={80} 
            height={28}
            className={isDark ? "" : "opacity-60"}
          />
        </div>
        <div className="flex items-center justify-center gap-4 text-xs">
          <Link 
            href="#" 
            className={`hover:underline transition ${isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
          >
            Terms
          </Link>
          <span className={`w-1 h-1 rounded-full ${isDark ? "bg-slate-600" : "bg-slate-300"}`}></span>
          <Link 
            href="#" 
            className={`hover:underline transition ${isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
