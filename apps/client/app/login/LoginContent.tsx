"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestLoginLink } from "@moove/api-client";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for token in URL (magic link callback)
  useEffect(() => {
    const token = searchParams?.get("token");
    if (token) {
      localStorage.setItem("moovefit-token", token);
      router.push("/auth");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestLoginLink({
        email,
        client: true,
        target: window.location.origin,
      });

      if (result.status === "SUCCESS") {
        // Store user ID for verification
        localStorage.setItem("moovefit-member", result.user);

        // DEV: If token is returned directly, auto-login
        if (result.token) {
          localStorage.setItem("moovefit-token", result.token);
          router.push("/auth");
          return;
        }

        // Production: Redirect to success page
        router.push("/success");
      } else {
        setError("Invalid email address or user not found");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/backgrounds/onboarding.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Back Button */}
        <Link
          href="/onboarding"
          className="absolute top-8 left-6 p-2 hover:bg-white/10 rounded-full transition"
        >
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} />
        </Link>

        {/* Logo */}
        <Image
          src="/images/logo.svg"
          alt="Moove"
          width={100}
          height={50}
          className="mb-12"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <Title color="white" size="1.8rem" weight="700" center className="mb-6">
            Log In
          </Title>

          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full px-4 py-4 rounded-lg bg-white/10 border ${
                error ? "border-red-400" : "border-white/20"
              } text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition`}
            />
            {error && (
              <Text color="#ff6b6b" size="0.8rem" className="mt-2">
                {error}
              </Text>
            )}
          </div>

          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={isLoading}
            className="mt-4 mb-6"
          >
            {isLoading ? "SENDING..." : "SEND ME A LOGIN LINK"}
          </Button>
        </form>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <Text color="white/60" size="0.8rem">
            Don't have an account?{" "}
            <Link href="/registration" className="text-white underline">
              Create one
            </Link>
          </Text>
        </footer>
      </div>
    </div>
  );
}
