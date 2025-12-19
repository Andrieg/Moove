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

  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
  });

  // Step 1: Handle email submission
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

  // Step 2: Handle "OK" click
  const handleLinkSentOk = () => {
    setStep("profile");
  };

  // Step 3: Handle profile save
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
      <div className="min-h-screen bg-black flex flex-col">
        <header className="p-6">
          <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="invert" />
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl p-8">
              <h1 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Create an Account
              </h1>

              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="forexample@gmail.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I confirm that I have read and agree to the{" "}
                    <Link href="#" className="text-[#308FAB] font-medium">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#308FAB] font-medium">Privacy Policy</Link>
                  </span>
                </label>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#308FAB] text-white font-medium rounded-lg hover:bg-[#217E9A] transition disabled:opacity-50 text-sm"
                >
                  {isLoading ? "SENDING..." : "SEND ME A LOGIN LINK"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-[#308FAB] font-medium">Sign in</Link>
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Are you a coach?{" "}
                  <Link href="/coach/register" className="text-[#308FAB] font-medium">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Powered by</p>
          <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto invert opacity-50" />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-400">Terms and Conditions</Link>
            <span>|</span>
            <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    );
  }

  // Screen 2: Link Sent Confirmation
  if (step === "link-sent") {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <header className="p-6">
          <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="invert" />
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#308FAB]/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#308FAB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-2">Account link sent!</h1>
              <p className="text-sm text-gray-500 mb-6">Please check your email inbox for your login link.</p>

              <button
                onClick={handleLinkSentOk}
                className="w-full py-3 bg-[#308FAB] text-white font-medium rounded-lg hover:bg-[#217E9A] transition text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Powered by</p>
          <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto invert opacity-50" />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-400">Terms and Conditions</Link>
            <span>|</span>
            <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    );
  }

  // Screen 3: Profile Setup (simpler for clients - no brand/color)
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="p-6">
        <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="invert" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-6 text-center">Let's get to know you</h1>

            <form onSubmit={handleProfileSave}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#308FAB] text-white font-medium rounded-lg hover:bg-[#217E9A] transition disabled:opacity-50 text-sm"
              >
                {isLoading ? "SAVING..." : "SAVE"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-gray-500 mb-2">Powered by</p>
        <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto invert opacity-50" />
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
          <Link href="#" className="hover:text-gray-400">Terms and Conditions</Link>
          <span>|</span>
          <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default function ClientRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ClientRegisterForm />
    </Suspense>
  );
}
