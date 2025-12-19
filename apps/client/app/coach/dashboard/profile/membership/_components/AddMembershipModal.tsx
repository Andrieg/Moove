"use client";

import { useState, useEffect } from "react";
import type { Membership } from "@moove/types";

interface AddMembershipModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (membership: Membership) => void;
  currency: string;
}

export default function AddMembershipModal({
  open,
  onClose,
  onCreated,
  currency,
}: AddMembershipModalProps) {
  const [themeColor, setThemeColor] = useState("#308FAB");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceMonthly: "",
  });

  useEffect(() => {
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({ title: "", description: "", priceMonthly: "" });
      setErrors({});
    }
  }, [open]);

  const currencySymbols: Record<string, string> = {
    GBP: "£",
    USD: "$",
    EUR: "€",
    AUD: "A$",
    CAD: "C$",
    NZD: "NZ$",
  };

  const symbol = currencySymbols[currency] || "£";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.priceMonthly) {
      newErrors.priceMonthly = "Price is required";
    } else {
      const price = parseFloat(formData.priceMonthly);
      if (isNaN(price) || price <= 0) {
        newErrors.priceMonthly = "Price must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Create membership object
    const membership: Membership = {
      id: "membership-" + Date.now(),
      coachId: "coach-" + Date.now(),
      title: formData.title,
      description: formData.description,
      priceMonthly: parseFloat(parseFloat(formData.priceMonthly).toFixed(2)),
      currency: currency,
      benefits: [],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
    onCreated(membership);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Add Membership</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Monthly Membership"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title ? "border-red-300" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what's included in this membership..."
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description ? "border-red-300" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price per month <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {symbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceMonthly}
                  onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                    errors.priceMonthly ? "border-red-300" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
                />
              </div>
              {errors.priceMonthly && (
                <p className="mt-1 text-sm text-red-500">{errors.priceMonthly}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 text-white font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            {isLoading ? "SAVING..." : "ADD"}
          </button>
        </form>
      </div>
    </div>
  );
}
