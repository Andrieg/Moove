"use client";

import { useState, useEffect } from "react";
import type { Membership } from "@moove/types";
import Card from "../../_components/ui/Card";
import EmptyState from "./_components/EmptyState";
import MembershipCard from "./_components/MembershipCard";
import AddMembershipModal from "./_components/AddMembershipModal";
import { useToast } from "../../_components/ui/Toast";

const STORAGE_KEY = "moove_membership";

export default function MembershipPage() {
  const toast = useToast();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState("GBP");
  const [themeColor, setThemeColor] = useState("#308FAB");

  // Load data on mount
  useEffect(() => {
    // Get theme color
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) {
      setThemeColor(savedColor);
    }

    // Get currency from brand settings
    const brandData = localStorage.getItem("moove_brand");
    if (brandData) {
      try {
        const brand = JSON.parse(brandData);
        if (brand.currency) {
          setCurrency(brand.currency);
        }
      } catch (e) {}
    }

    // Load membership from localStorage
    const savedMembership = localStorage.getItem(STORAGE_KEY);
    if (savedMembership) {
      try {
        setMembership(JSON.parse(savedMembership));
      } catch (e) {
        console.error("Failed to parse saved membership");
      }
    }

    setIsLoading(false);
  }, []);

  const handleMembershipCreated = (newMembership: Membership) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMembership));
    setMembership(newMembership);
    setIsModalOpen(false);
    toast.success("Membership created successfully!");
  };

  const handleAddClick = () => {
    if (membership) {
      // Already has membership - show confirmation or disable
      toast.info("You already have an active membership");
      return;
    }
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#308FAB] rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Membership</h2>
          <button
            onClick={handleAddClick}
            disabled={!!membership}
            className={`px-4 py-2 text-white text-sm font-semibold rounded-full transition ${
              membership ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            style={{ backgroundColor: themeColor }}
            title={membership ? "You already have an active membership" : "Add membership"}
          >
            + ADD MEMBERSHIP
          </button>
        </div>

        {/* Content */}
        {membership ? (
          <MembershipCard membership={membership} />
        ) : (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        )}
      </Card>

      {/* Modal */}
      <AddMembershipModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleMembershipCreated}
        currency={currency}
      />

      <toast.ToastContainer />
    </>
  );
}
