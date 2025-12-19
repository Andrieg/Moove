"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";
import type { User } from "@moove/types";

// Extended color themes (same as dashboard/profile/brand)
const colorThemes = [
  // Row 1
  { id: "teal", color: "#308FAB" },
  { id: "cyan", color: "#06B6D4" },
  { id: "sky", color: "#0EA5E9" },
  { id: "blue", color: "#3B82F6" },
  { id: "indigo", color: "#6366F1" },
  { id: "violet", color: "#8B5CF6" },
  { id: "purple", color: "#A855F7" },
  { id: "fuchsia", color: "#D946EF" },
  // Row 2
  { id: "pink", color: "#EC4899" },
  { id: "rose", color: "#F43F5E" },
  { id: "red", color: "#EF4444" },
  { id: "orange", color: "#F97316" },
  { id: "amber", color: "#F59E0B" },
  { id: "yellow", color: "#EAB308" },
  { id: "lime", color: "#84CC16" },
  { id: "green", color: "#22C55E" },
  // Row 3
  { id: "emerald", color: "#10B981" },
  { id: "teal2", color: "#14B8A6" },
  { id: "slate", color: "#64748B" },
  { id: "gray", color: "#6B7280" },
  { id: "zinc", color: "#71717A" },
  { id: "neutral", color: "#737373" },
  { id: "stone", color: "#78716C" },
  { id: "brown", color: "#92400E" },
];

function CoachOnboardingForm() {
  const router = useRouter();
  const { login, showToast } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    brandName: "",
  });
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0].color);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName.trim()) {
      setError("Please enter your first name");
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Please enter your last name");
      return;
    }
    if (!formData.brandName.trim()) {
      setError("Please enter your brand name");
      return;
    }

    setIsLoading(true);

    // Get email from localStorage (set during registration step 1-2)
    const savedEmail = localStorage.getItem("moove-onboarding-email") || "coach@example.com";

    const brandSlug = formData.brandName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "")
      .substring(0, 20);

    const user: User = {
      id: "user-" + Date.now(),
      email: savedEmail,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: "coach",
      brandSlug: brandSlug,
      brand: formData.brandName,
      themeColor: selectedTheme,
      createdAt: new Date().toISOString(),
    };

    const token = `dev-token-coach-${Date.now()}`;

    // Save theme color separately for easy access
    localStorage.setItem("moove_theme_color", selectedTheme);
    
    // Save brand data
    localStorage.setItem("moove_brand", JSON.stringify({
      brandName: formData.brandName,
      brandSlug: brandSlug,
      currency: "GBP",
      themeColor: selectedTheme,
    }));

    // Login the user
    login(user, token);
    showToast("success", `Welcome, ${formData.firstName}! Your coach account has been created.`);
    setIsLoading(false);
    router.push("/coach/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6">
        <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-8 text-center">
              Let's get to know you
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* First Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>

                {/* Brand Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="Brand Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>

                {/* Color Theme */}
                <div>
                  <label className="block text-sm text-gray-600 mb-3">Color Theme</label>
                  <div className="grid grid-cols-8 gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.color)}
                        className={`relative w-9 h-9 rounded-lg transition-all ${
                          selectedTheme === theme.color
                            ? "ring-2 ring-offset-2 ring-slate-400"
                            : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: theme.color }}
                      >
                        {selectedTheme === theme.color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit Button - uses selected theme color */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm uppercase"
                  style={{ backgroundColor: selectedTheme }}
                >
                  {isLoading ? "SAVING..." : "SAVE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-gray-500 mb-2">Powered by</p>
        <Image src="/images/logo.svg" alt="Moove" width={80} height={24} className="mx-auto opacity-50" />
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
          <Link href="#" className="hover:text-gray-700">Terms and Conditions</Link>
          <span>|</span>
          <Link href="#" className="hover:text-gray-700">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default function CoachOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CoachOnboardingForm />
    </Suspense>
  );
}
