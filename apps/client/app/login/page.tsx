"use client";

import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen w-full flex items-center justify-center"
          style={{
            backgroundImage: "url(/backgrounds/onboarding.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
          <div className="relative z-10 text-center">
            <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
