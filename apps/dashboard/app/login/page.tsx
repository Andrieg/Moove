"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestLoginLink } from "@moove/api-client";
import Button from "../_components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("moovefit-token");
    if (token) {
      router.push("/");
    }
  }, [router]);

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
        client: false, // Coach login
        target: window.location.origin,
      });

      if (result.status === "SUCCESS") {
        localStorage.setItem("moovefit-member", result.user);

        // DEV: If token is returned directly, auto-login
        if (result.token) {
          localStorage.setItem("moovefit-token", result.token);
          router.push("/");
          return;
        }

        alert("Login link sent! Check your email.");
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.svg"
            alt="Moove"
            width={120}
            height={40}
            className="mx-auto brightness-0 invert mb-2"
          />
          <p className="text-slate-400 text-sm">Coach Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-6">Sign in to your coach account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@example.com"
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-300" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] transition`}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Login Link"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Need help?{" "}
          <a href="#" className="text-[#308FAB] hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
