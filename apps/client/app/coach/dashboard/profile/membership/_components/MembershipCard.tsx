"use client";

import { useEffect, useState } from "react";
import type { Membership } from "@moove/types";

interface MembershipCardProps {
  membership: Membership;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  const [themeColor, setThemeColor] = useState("#308FAB");

  useEffect(() => {
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);

  const currencySymbols: Record<string, string> = {
    GBP: "£",
    USD: "$",
    EUR: "€",
    AUD: "A$",
    CAD: "C$",
    NZD: "NZ$",
  };

  const symbol = currencySymbols[membership.currency] || "£";

  const defaultBenefits = [
    "Access to all workout videos",
    "Weekly live classes",
    "Community support",
  ];

  const benefits = membership.benefits?.length ? membership.benefits : defaultBenefits;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {membership.title}
      </h3>
      <p className="text-2xl font-bold text-slate-900 mb-4">
        {symbol}{membership.priceMonthly.toFixed(2)}
        <span className="text-sm font-normal text-slate-500">/month</span>
      </p>

      {membership.description && (
        <p className="text-sm text-slate-600 mb-4">{membership.description}</p>
      )}

      <ul className="space-y-2 mb-6">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              style={{ color: themeColor }}
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button
        className="w-full py-3 text-white font-semibold rounded-lg transition hover:opacity-90"
        style={{ backgroundColor: themeColor }}
      >
        JOIN
      </button>
    </div>
  );
}
