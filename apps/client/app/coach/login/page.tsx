"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";
import type { User } from "@moove/types";

type Step = "login" | "link-sent";

function CoachLoginForm() {
  const router = useRouter();
  const { login, showToast } = useAuth();

  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Consistent styling classes
  const inputClasses = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm text-slate-900 placeholder-slate-400 bg-white transition-colors";
  const buttonClasses = "w-full py-3 bg-[#308FAB] text-white font-semibold rounded-lg hover:bg-[#217E9A] transition disabled:opacity-50 text-sm uppercase";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-2";

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep("link-sent");
  };

  // Handle OK click (simulate clicking magic link for dev)
  const handleOk = () => {
    const user: User = {
      id: "coach-" + Date.now(),
      email: email,
      firstName: "Coach",
      lastName: "User",
      role: "coach",
      brandSlug: "mybrand",
      brand: "My Brand",
      createdAt: new Date().toISOString(),
    };

    const token = `dev-token-coach-${Date.now()}`;
    login(user, token);
    showToast("success", `Welcome back!`);
    router.push("/coach/dashboard");
  };

  // Screen 1: Login Form
  if (step === "login") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="p-6">
          <Image src="/images/logo.svg" alt="Moove" width={100} height={32} />
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-xl p-8">
              <h1 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                Sign In
              </h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className={labelClasses}>Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="forexample@gmail.com"
                    className={inputClasses}
                  />
                </div>

                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-600">Keep me logged in</span>
                </label>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isLoading} className={buttonClasses}>
                  {isLoading ? "Sending..." : "Send me a login link"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{" "}
                <Link href="/coach/register" className="text-[#308FAB] font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center">
          <p className="text-xs text-slate-500 mb-2">Powered by</p>
          <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto opacity-50" />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-700 transition">Terms and Conditions</Link>
            <span>|</span>
            <Link href="#" className="hover:text-slate-700 transition">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    );
  }

  // Screen 2: Login Link Sent
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6">
        <Image src="/images/logo.svg" alt="Moove" width={100} height={32} />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-[#308FAB] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#308FAB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              Login link sent
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              Please check your email inbox for your login link.
            </p>

            <button onClick={handleOk} className={buttonClasses}>
              OK
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-slate-500 mb-2">Powered by</p>
        <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto opacity-50" />
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
          <Link href="#" className="hover:text-slate-700 transition">Terms and Conditions</Link>
          <span>|</span>
          <Link href="#" className="hover:text-slate-700 transition">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default function CoachLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CoachLoginForm />
    </Suspense>
  );
}
