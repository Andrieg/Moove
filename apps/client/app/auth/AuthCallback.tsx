"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUserProfile } from "@moove/api-client";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      // Check for token in URL
      const urlToken = searchParams?.get("token");
      if (urlToken) {
        localStorage.setItem("moovefit-token", urlToken);
      }

      // Get token from storage
      const token = localStorage.getItem("moovefit-token");

      if (!token) {
        setError("No authentication token found");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // Verify token by fetching user profile
        const user = await getCurrentUserProfile();

        if (user) {
          // Store user data
          localStorage.setItem("moovefit-user", JSON.stringify(user));
          // Redirect to home
          router.push("/");
        } else {
          throw new Error("Invalid user");
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication failed. Please try again.");
        localStorage.removeItem("moovefit-token");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    authenticate();
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/backgrounds/onboarding.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {error ? (
          <>
            <Title color="white" size="1.5rem" weight="600" center className="mb-4">
              Authentication Error
            </Title>
            <Text color="white/80" size="1rem" center>
              {error}
            </Text>
            <Text color="white/60" size="0.9rem" center className="mt-4">
              Redirecting to login...
            </Text>
          </>
        ) : (
          <>
            <Title color="white" size="1.5rem" weight="600" center className="mb-6">
              Logging in...
            </Title>
            <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </>
        )}
      </div>
    </div>
  );
}
