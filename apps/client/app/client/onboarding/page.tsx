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

  useEffect(() => {
    const pendingEmail = localStorage.getItem("moove_pending_email");
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  const getWeightLabel = () => formData.weightUnit === "kg" ? "Weight (kg)" : "Weight (lbs)";
  const getHeightLabel = () => formData.heightUnit === "cm" ? "Height (cm)" : "Height (ft)";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showToast("error", "Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      const user: User = {
        id: "user-" + Date.now(),
        email: email || `user${Date.now()}@example.com`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "member",
        createdAt: new Date().toISOString(),
      };

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
      localStorage.removeItem("moove_pending_email");

      const token = `dev-token-member-${Date.now()}`;
      login(user, token);
      showToast("success", `Welcome, ${formData.firstName}! Your profile has been created.`);
      router.push("/");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showToast("error", "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 transition-all";
  const selectClasses = "w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm appearance-none cursor-pointer bg-slate-50/50 text-slate-900 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Image src="/images/logo-dark.svg" alt="Moove" width={120} height={40} priority />
      </header>

      {/* Progress indicator */}
      <div className="px-6 pb-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 rounded-full bg-[#308FAB]"></div>
            <div className="flex-1 h-1 rounded-full bg-[#308FAB]"></div>
            <div className="flex-1 h-1 rounded-full bg-slate-200"></div>
          </div>
          <p className="text-xs text-slate-400 text-center">Step 2 of 3</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
              <p className="text-slate-500 text-sm">Help us personalize your fitness experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="John"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Doe"
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className={labelClasses}>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  className={inputClasses}
                />
              </div>

              {/* Weight and Height Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">{getWeightLabel()}</label>
                    <button
                      type="button"
                      onClick={() => updateField("weightUnit", formData.weightUnit === "kg" ? "lbs" : "kg")}
                      className="text-xs text-[#308FAB] font-medium hover:underline"
                    >
                      Switch to {formData.weightUnit === "kg" ? "lbs" : "kg"}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                    placeholder={formData.weightUnit === "kg" ? "70" : "154"}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">{getHeightLabel()}</label>
                    <button
                      type="button"
                      onClick={() => updateField("heightUnit", formData.heightUnit === "cm" ? "ft" : "cm")}
                      className="text-xs text-[#308FAB] font-medium hover:underline"
                    >
                      Switch to {formData.heightUnit === "cm" ? "ft" : "cm"}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateField("height", e.target.value)}
                    placeholder={formData.heightUnit === "cm" ? "175" : "5.9"}
                    step={formData.heightUnit === "ft" ? "0.1" : "1"}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className={labelClasses}>Gender</label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>Select gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className={labelClasses}>What&apos;s your main fitness goal?</label>
                <div className="relative">
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => updateField("fitnessGoal", e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>Select your goal</option>
                    {FITNESS_GOALS.map((goal) => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#308FAB] text-white font-semibold rounded-xl hover:bg-[#217E9A] transition-all disabled:opacity-50 shadow-lg shadow-[#308FAB]/25 hover:shadow-xl hover:shadow-[#308FAB]/30 text-sm uppercase tracking-wide mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
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
