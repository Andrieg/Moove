"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../_context/AuthContext";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";
import EditableAvatar from "../../_components/EditableAvatar";
import ColorThemePicker from "../../_components/ColorThemePicker";
import { useToast } from "../../_components/ui/Toast";

interface BrandFormData {
  brandName: string;
  currency: string;
  themeColor: string;
  logo?: string;
}

const STORAGE_KEY = "moove_brand";

const currencies = [
  { code: "GBP", label: "GBP - British Pound" },
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "AUD", label: "AUD - Australian Dollar" },
  { code: "CAD", label: "CAD - Canadian Dollar" },
  { code: "NZD", label: "NZD - New Zealand Dollar" },
];

export default function BrandPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BrandFormData>({
    brandName: "",
    currency: "GBP",
    themeColor: "#308FAB",
    logo: "",
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
        console.error("Failed to parse saved brand data");
      }
    }

    // Then override with user context data (from registration)
    if (user) {
      const userAny = user as any;
      setFormData((prev) => ({
        ...prev,
        brandName: userAny.brand || prev.brandName || "",
        themeColor: userAny.themeColor || prev.themeColor || "#308FAB",
      }));
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
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
        userObj.brand = formData.brandName;
        userObj.themeColor = formData.themeColor;
        localStorage.setItem("moovefit-user", JSON.stringify(userObj));
      }

      toast.success("Brand settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save brand settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoEdit = () => {
    // Stub for logo upload
    toast.info("Logo upload coming soon");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Edit Brand</h2>

      <form onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <EditableAvatar
            src={formData.logo}
            placeholder="Your logo"
            size="lg"
            onEdit={handleLogoEdit}
          />
        </div>

        <div className="space-y-5">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.brandName ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
              placeholder="Your brand name"
            />
            {errors.brandName && (
              <p className="mt-1 text-sm text-red-500">{errors.brandName}</p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.currency ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] bg-white`}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.label}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-500">{errors.currency}</p>
            )}
          </div>

          {/* Color Theme */}
          <div className="pt-2">
            <ColorThemePicker
              value={formData.themeColor}
              onChange={(color) => setFormData({ ...formData, themeColor: color })}
            />
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
