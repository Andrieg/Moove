"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";
import type { User } from "@moove/types";

type Step = "email" | "link-sent" | "profile";

function ClientRegisterForm() {
  const router = useRouter();
  const { login, showToast } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep("link-sent");
  };

  const handleLinkSentOk = () => {
    localStorage.setItem("moove_pending_email", email);
    router.push("/client/onboarding");
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!profileData.firstName || !profileData.lastName) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);

    const user: User = {
      id: "user-" + Date.now(),
      email: email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      role: "member",
      createdAt: new Date().toISOString(),
    };

    const token = `dev-token-member-${Date.now()}`;
    login(user, token);
    showToast("success", `Welcome, ${profileData.firstName}! Your account has been created.`);
    setIsLoading(false);
    router.push("/");
  };

  // Screen 1: Email Input
  if (step === "email") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <header className="p-6">
          <Image src="/images/logo-dark.svg" alt="Moove" width={120} height={40} priority />
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Create an Account</h1>
                <p className="text-slate-500 text-sm">Join thousands of fitness enthusiasts</p>
              </div>

              <form onSubmit={handleEmailSubmit}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 transition-all"
                  />
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded-md border-slate-300 text-[#308FAB] focus:ring-[#308FAB] cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="#" className="text-[#308FAB] font-medium hover:underline">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#308FAB] font-medium hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                {error && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#308FAB] text-white font-semibold rounded-xl hover:bg-[#217E9A] transition-all disabled:opacity-50 shadow-lg shadow-[#308FAB]/25 hover:shadow-xl hover:shadow-[#308FAB]/30 text-sm uppercase tracking-wide"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Me a Login Link"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href="/client/login" className="text-[#308FAB] font-semibold hover:underline">Sign in</Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Are you a coach?{" "}
                <Link href="/coach/register" className="text-[#308FAB] font-semibold hover:underline">Register here</Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="py-8 text-center">
          <p className="text-xs text-slate-400 mb-3">Powered by</p>
          <Image src="/images/logo-dark.svg" alt="Moove" width={80} height={28} className="mx-auto opacity-40" />
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
            <Link href="#" className="hover:text-slate-600 transition">Terms</Link>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <Link href="#" className="hover:text-slate-600 transition">Privacy</Link>
          </div>
        </footer>
      </div>
    );
  }

  // Screen 2: Link Sent Confirmation
  if (step === "link-sent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <header className="p-6">
          <Image src="/images/logo-dark.svg" alt="Moove" width={120} height={40} priority />
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#308FAB] to-[#217E9A] flex items-center justify-center shadow-lg shadow-[#308FAB]/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h1>
              <p className="text-slate-500 mb-8">We&apos;ve sent a login link to <span className="font-medium text-slate-700">{email}</span></p>

              <button
                onClick={handleLinkSentOk}
                className="w-full py-4 bg-[#308FAB] text-white font-semibold rounded-xl hover:bg-[#217E9A] transition-all shadow-lg shadow-[#308FAB]/25 hover:shadow-xl hover:shadow-[#308FAB]/30 text-sm uppercase tracking-wide"
              >
                Continue
              </button>

              <p className="mt-6 text-sm text-slate-400">
                Didn&apos;t receive it?{" "}
                <button onClick={() => setStep("email")} className="text-[#308FAB] font-medium hover:underline">
                  Try again
                </button>
              </p>
            </div>
          </div>
        </main>

        <footer className="py-8 text-center">
          <p className="text-xs text-slate-400 mb-3">Powered by</p>
          <Image src="/images/logo-dark.svg" alt="Moove" width={80} height={28} className="mx-auto opacity-40" />
        </footer>
      </div>
    );
  }

  // Screen 3: Profile Setup
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="p-6">
        <Image src="/images/logo-dark.svg" alt="Moove" width={120} height={40} priority />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Let&apos;s Get Started</h1>
              <p className="text-slate-500 text-sm">Tell us a bit about yourself</p>
            </div>

            <form onSubmit={handleProfileSave}>
              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#308FAB] text-white font-semibold rounded-xl hover:bg-[#217E9A] transition-all disabled:opacity-50 shadow-lg shadow-[#308FAB]/25 text-sm uppercase tracking-wide"
              >
                {isLoading ? "Saving..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-xs text-slate-400 mb-3">Powered by</p>
        <Image src="/images/logo-dark.svg" alt="Moove" width={80} height={28} className="mx-auto opacity-40" />
      </footer>
    </div>
  );
}

export default function ClientRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ClientRegisterForm />
    </Suspense>
  );
}
