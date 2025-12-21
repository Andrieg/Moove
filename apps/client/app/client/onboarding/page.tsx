"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";
import type { User } from "@moove/types";

const FITNESS_GOALS = [
  "Be more active",
  "Stay toned",
  "Lose weight",
  "Build muscle",
  "Reduce stress",
  "Improve flexibility",
  "Increase strength",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  weight: string;
  height: string;
  weightUnit: "kg" | "lbs";
  heightUnit: "cm" | "ft";
  gender: string;
  fitnessGoal: string;
}

export default function ClientOnboardingPage() {
  const router = useRouter();
  const { login, showToast } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dob: "",
    weight: "",
    height: "",
    weightUnit: "kg",
    heightUnit: "cm",
    gender: "",
    fitnessGoal: "",
  });

  // Load email from localStorage on mount
  useEffect(() => {
    const pendingEmail = localStorage.getItem("moove_pending_email");
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  // Get weight label based on unit
  const getWeightLabel = () => {
    return formData.weightUnit === "kg" ? "Weight (kg)" : "Weight (lbs)";
  };

  // Get height label based on unit
  const getHeightLabel = () => {
    return formData.heightUnit === "cm" ? "Height (cm)" : "Height (ft)";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showToast("error", "Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      // Create user object
      const user: User = {
        id: "user-" + Date.now(),
        email: email || `user${Date.now()}@example.com`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "member",
        createdAt: new Date().toISOString(),
      };

      // Save profile data to localStorage
      const profileData = {
        ...user,
        dob: formData.dob,
        weight: formData.weight,
        weightUnit: formData.weightUnit,
        height: formData.height,
        heightUnit: formData.heightUnit,
        gender: formData.gender,
        fitnessGoal: formData.fitnessGoal,
        onboardingComplete: true,
      };
      localStorage.setItem("moove_client_profile", JSON.stringify(profileData));

      // Clean up pending email
      localStorage.removeItem("moove_pending_email");

      // Log in the user
      const token = `dev-token-member-${Date.now()}`;
      login(user, token);
      showToast("success", `Welcome, ${formData.firstName}! Your profile has been created.`);

      // Redirect to home
      router.push("/");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showToast("error", "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Same as register page */}
      <header className="p-6">
        <Image src="/images/logo.svg" alt="Moove" width={100} height={32} className="" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">First name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="Your real name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Last name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Your real last name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">DOB</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                />
              </div>

              {/* Weight and Height Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Weight */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-600">{getWeightLabel()}</label>
                    <button
                      type="button"
                      onClick={() => updateField("weightUnit", formData.weightUnit === "kg" ? "lbs" : "kg")}
                      className="text-xs text-[#308FAB] font-medium hover:underline"
                    >
                      {formData.weightUnit === "kg" ? "lbs" : "kg"}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                    placeholder={formData.weightUnit === "kg" ? "60" : "132"}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>

                {/* Height */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-600">{getHeightLabel()}</label>
                    <button
                      type="button"
                      onClick={() => updateField("heightUnit", formData.heightUnit === "cm" ? "ft" : "cm")}
                      className="text-xs text-[#308FAB] font-medium hover:underline"
                    >
                      {formData.heightUnit === "cm" ? "ft" : "cm"}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateField("height", e.target.value)}
                    placeholder={formData.heightUnit === "cm" ? "169" : "5.5"}
                    step={formData.heightUnit === "ft" ? "0.1" : "1"}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Gender</label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm appearance-none cursor-pointer bg-white"
                  >
                    <option value="" disabled>Select gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Fitness goal</label>
                <div className="relative">
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => updateField("fitnessGoal", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm appearance-none cursor-pointer bg-white"
                  >
                    <option value="" disabled>Select fitness goal</option>
                    {FITNESS_GOALS.map((goal) => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#308FAB] text-white font-medium rounded-lg hover:bg-[#217E9A] transition disabled:opacity-50 text-sm mt-2"
              >
                {isLoading ? "SAVING..." : "CONTINUE"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer - Same as register page */}
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
