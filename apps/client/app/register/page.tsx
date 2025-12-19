"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import type { User } from "@moove/types";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, showToast } = useAuth();
  
  // Check if registering as coach
  const type = searchParams.get("type");
  const isCoachRegistration = type === "coach";
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    brandName: "",
    brandSlug: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate brand slug from brand name
  const handleBrandNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "")
      .substring(0, 20);
    setFormData({ ...formData, brandName: name, brandSlug: slug });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    if (isCoachRegistration && !formData.brandName) {
      setError("Please enter your brand name");
      return;
    }

    setIsLoading(true);

    try {
      // Create user with appropriate role
      const user: User = {
        id: "user-" + Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: isCoachRegistration ? "coach" : "member",
        ...(isCoachRegistration && {
          brandSlug: formData.brandSlug || formData.brandName.toLowerCase().replace(/\s+/g, ""),
          brand: formData.brandName,
        }),
        createdAt: new Date().toISOString(),
      };

      const token = `dev-token-${user.role}-${Date.now()}`;

      // Login the user
      login(user, token);

      // Show success message
      showToast("success", `Welcome, ${formData.firstName}! Your ${isCoachRegistration ? "coach" : ""} account has been created.`);

      // Redirect based on role
      if (isCoachRegistration) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-block">
          <Image src="/images/logo.svg" alt="Moove" width={100} height={32} />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isCoachRegistration ? "Create Your Coach Account" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {isCoachRegistration
                ? "Start sharing your fitness expertise with the world"
                : "Join Moove and start your fitness journey"}
            </p>
          </div>

          {/* Coach/Member Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <Link
              href="/register"
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-center transition ${
                !isCoachRegistration
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Member
            </Link>
            <Link
              href="/register?type=coach"
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-center transition ${
                isCoachRegistration
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Coach
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                    placeholder="Anna"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                    placeholder="Martin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                  placeholder="you@example.com"
                />
              </div>

              {/* Coach-specific fields */}
              {isCoachRegistration && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => handleBrandNameChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                      placeholder="Anna Martin Fitness"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand URL
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">moove.fit/coach/</span>
                      <input
                        type="text"
                        value={formData.brandSlug}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brandSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                        placeholder="annamartin"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#308FAB] focus:ring-[#308FAB]"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-[#308FAB] underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#308FAB] underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#308FAB] text-white font-semibold rounded-full hover:bg-[#217E9A] transition disabled:opacity-50"
              >
                {isLoading
                  ? "Creating account..."
                  : isCoachRegistration
                  ? "Create Coach Account"
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-[#308FAB] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
