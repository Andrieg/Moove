"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestLoginLink } from "@moove/api-client";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

export default function RegistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
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
        localStorage.setItem("moovefit-member", result.user);

        // DEV: If token is returned directly, auto-login
        if (result.token) {
          localStorage.setItem("moovefit-token", result.token);
          router.push("/auth");
          return;
        }

        router.push("/success");
      } else {
        setError("Could not create account. Please try again.");
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
            Create Account
          </Title>

          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full px-4 py-4 rounded-lg bg-white/10 border ${
                error && !email ? "border-red-400" : "border-white/20"
              } text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition`}
            />
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-[#308FAB] focus:ring-[#308FAB]"
            />
            <Text color="white" size="0.85rem" className="leading-relaxed">
              I confirm that I have read and agree to the{" "}
              <a href="#" className="underline hover:text-white/80">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-white/80">
                Privacy Policy
              </a>
            </Text>
          </label>

          {error && (
            <Text color="#ff6b6b" size="0.8rem" className="mb-4 text-center">
              {error}
            </Text>
          )}

          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "CREATING..." : "SEND ME A LOGIN LINK"}
          </Button>
        </form>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <Text color="white/60" size="0.8rem">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline">
              Log in
            </Link>
          </Text>
        </footer>
      </div>
    </div>
  );
}
