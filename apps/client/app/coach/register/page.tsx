"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";
import type { User } from "@moove/types";

// Color theme options
const colorThemes = [
  { id: "teal", colors: ["#308FAB", "#4BA3BD", "#6BB7CF"] },
  { id: "purple", colors: ["#7C3AED", "#8B5CF6", "#A78BFA"] },
  { id: "pink", colors: ["#EC4899", "#F472B6", "#F9A8D4"] },
  { id: "blue", colors: ["#2563EB", "#3B82F6", "#60A5FA"] },
  { id: "green", colors: ["#059669", "#10B981", "#34D399"] },
  { id: "orange", colors: ["#EA580C", "#F97316", "#FB923C"] },
  { id: "red", colors: ["#DC2626", "#EF4444", "#F87171"] },
  { id: "yellow", colors: ["#CA8A04", "#EAB308", "#FACC15"] },
];

type Step = "email" | "link-sent" | "profile";

function CoachRegisterForm() {
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
    brandName: "",
  });
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);

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

    if (!profileData.brandName) {
      setError("Please enter your brand name");
      return;
    }

    setIsLoading(true);

    const brandSlug = profileData.brandName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "")
      .substring(0, 20);

    const user: User = {
      id: "user-" + Date.now(),
      email: email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      role: "coach",
      brandSlug: brandSlug,
      brand: profileData.brandName,
      themeColor: selectedTheme.colors[0],
      createdAt: new Date().toISOString(),
    };

    const token = `dev-token-coach-${Date.now()}`;
    login(user, token);
    showToast("success", `Welcome, ${profileData.firstName}! Your coach account has been created.`);
    setIsLoading(false);
    router.push("/coach/dashboard");
  };

  // Screen 1: Email Input
  if (step === "email") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="p-6">
          <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="" />
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
                <Link href="/coach/login" className="text-[#308FAB] font-medium">Sign in</Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Powered by</p>
          <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto opacity-50" />
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
      <div className="min-h-screen bg-white flex flex-col">
        <header className="p-6">
          <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="" />
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#308FAB]/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#308FAB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-2">Create account link sent!</h1>
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
          <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto opacity-50" />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-400">Terms and Conditions</Link>
            <span>|</span>
            <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    );
  }

  // Screen 3: Profile Setup
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6">
        <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="" />
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

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={profileData.brandName}
                    onChange={(e) => setProfileData({ ...profileData, brandName: e.target.value })}
                    placeholder="Brand Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>
              </div>

              {/* Color Theme Picker */}
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-3">Color Theme</label>
                <div className="grid grid-cols-4 gap-3">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme)}
                      className={`relative p-1 rounded-lg transition ${
                        selectedTheme.id === theme.id
                          ? "ring-2 ring-[#308FAB] ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-200"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {theme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-5 h-8 first:rounded-l last:rounded-r"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {selectedTheme.id === theme.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                            <svg className="w-3 h-3 text-[#308FAB]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
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
        <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto opacity-50" />
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
          <Link href="#" className="hover:text-gray-400">Terms and Conditions</Link>
          <span>|</span>
          <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default function CoachRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CoachRegisterForm />
    </Suspense>
  );
}
