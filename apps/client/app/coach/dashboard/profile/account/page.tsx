"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../_context/AuthContext";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";
import EditableAvatar from "../../_components/EditableAvatar";
import { useToast } from "../../_components/ui/Toast";

interface AccountFormData {
  firstName: string;
  lastName: string;
  about: string;
  dob: string;
  gender: string;
  email: string;
  weightUnit: "KG" | "LBS";
  heightUnit: "CM" | "FT";
  avatar?: string;
}

const STORAGE_KEY = "moove_profile";

export default function AccountPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<AccountFormData>({
    firstName: "",
    lastName: "",
    about: "",
    dob: "",
    gender: "",
    email: "",
    weightUnit: "KG",
    heightUnit: "CM",
    avatar: "",
  });

  // Load saved data on mount
  useEffect(() => {
    // First try to load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved profile data");
      }
    }

    // Then override with user context data (from registration)
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName || "",
        lastName: user.lastName || prev.lastName || "",
        email: user.email || prev.email || "",
      }));
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.about.trim()) {
      newErrors.about = "About is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Save to localStorage (API fallback)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

      // Also update the user in auth store
      const savedUser = localStorage.getItem("moovefit-user");
      if (savedUser) {
        const userObj = JSON.parse(savedUser);
        userObj.firstName = formData.firstName;
        userObj.lastName = formData.lastName;
        userObj.email = formData.email;
        localStorage.setItem("moovefit-user", JSON.stringify(userObj));
      }

      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarEdit = () => {
    // Stub for avatar upload
    toast.info("Avatar upload coming soon");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <EditableAvatar
            src={formData.avatar}
            placeholder={formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "?"}
            size="lg"
            onEdit={handleAvatarEdit}
          />
        </div>

        <div className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.firstName ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.lastName ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              About <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.about ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none`}
              placeholder="Tell us about yourself..."
            />
            {errors.about && (
              <p className="mt-1 text-sm text-red-500">{errors.about}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">DOB</label>
            <div className="relative">
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] bg-slate-50`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Units Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Units</h3>
            
            {/* Weight Unit */}
            <div className="mb-4">
              <label className="block text-sm text-slate-600 mb-2">Weight</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="weightUnit"
                    value="KG"
                    checked={formData.weightUnit === "KG"}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as "KG" | "LBS" })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">KG</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="weightUnit"
                    value="LBS"
                    checked={formData.weightUnit === "LBS"}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as "KG" | "LBS" })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">LBS</span>
                </label>
              </div>
            </div>

            {/* Height Unit */}
            <div>
              <label className="block text-sm text-slate-600 mb-2">Height</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="heightUnit"
                    value="CM"
                    checked={formData.heightUnit === "CM"}
                    onChange={(e) => setFormData({ ...formData, heightUnit: e.target.value as "CM" | "FT" })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">CM</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="heightUnit"
                    value="FT"
                    checked={formData.heightUnit === "FT"}
                    onChange={(e) => setFormData({ ...formData, heightUnit: e.target.value as "CM" | "FT" })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">FT & IN</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "SAVING..." : "SAVE CHANGES"}
            </Button>
          </div>
        </div>
      </form>

      <toast.ToastContainer />
    </Card>
  );
}
