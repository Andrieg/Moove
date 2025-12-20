"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../_components/ui/Toast";
import Button from "../../_components/ui/Button";
import HeroSection from "./_components/HeroSection";
import AccessSection from "./_components/AccessSection";
import type { LandingPageConfig } from "@moove/types";

const STORAGE_KEY = "moove_landing_page_config";

const defaultConfig: Omit<LandingPageConfig, "id" | "coachId"> = {
  hero: {
    coverImageUrl: "",
    title: "",
    description: "",
    about: "",
    trailerVideoUrl: "",
  },
  access: {
    coverImageUrl: "",
    title: "",
    description: "",
    showReviews: true,
    showMembership: true,
  },
};

type HeroErrors = Partial<Record<keyof LandingPageConfig["hero"], string>>;
type AccessErrors = Partial<Record<keyof LandingPageConfig["access"], string>>;

export default function LandingPageEditor() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<Omit<LandingPageConfig, "id" | "coachId">>(defaultConfig);
  const [heroErrors, setHeroErrors] = useState<HeroErrors>({});
  const [accessErrors, setAccessErrors] = useState<AccessErrors>({});

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first (future-ready)
        // For now, fallback to localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setConfig({
            hero: { ...defaultConfig.hero, ...parsed.hero },
            access: { ...defaultConfig.access, ...parsed.access },
          });
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  const validateForm = (): boolean => {
    const newHeroErrors: HeroErrors = {};
    const newAccessErrors: AccessErrors = {};
    let isValid = true;

    // Validate Hero section
    if (!config.hero.coverImageUrl) {
      newHeroErrors.coverImageUrl = "Cover image is required";
      isValid = false;
    }
    if (!config.hero.title.trim()) {
      newHeroErrors.title = "Title is required";
      isValid = false;
    }
    if (!config.hero.description.trim()) {
      newHeroErrors.description = "Description is required";
      isValid = false;
    }
    if (!config.hero.about.trim()) {
      newHeroErrors.about = "About is required";
      isValid = false;
    }

    // Validate Access section
    if (!config.access.coverImageUrl) {
      newAccessErrors.coverImageUrl = "Cover image is required";
      isValid = false;
    }
    if (!config.access.title.trim()) {
      newAccessErrors.title = "Title is required";
      isValid = false;
    }
    if (!config.access.description.trim()) {
      newAccessErrors.description = "Description is required";
      isValid = false;
    }

    setHeroErrors(newHeroErrors);
    setAccessErrors(newAccessErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage (dev fallback)
      const configToSave = {
        ...config,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      
      // Simulate API call delay for better UX feedback
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      toast.success("Saved");
    } catch (err) {
      console.error("Failed to save:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#308FAB] mx-auto mb-4"></div>
            <p className="text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-slate-900 text-center mb-8">
        Landing Page
      </h1>

      <div className="space-y-10">
        {/* Hero Section */}
        <HeroSection
          value={config.hero}
          onChange={(hero) => setConfig({ ...config, hero })}
          errors={heroErrors}
        />

        {/* Access Section */}
        <AccessSection
          value={config.access}
          onChange={(access) => setConfig({ ...config, access })}
          errors={accessErrors}
        />

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          fullWidth
          size="lg"
        >
          {isSaving ? "SAVING..." : "SAVE"}
        </Button>
      </div>

      <toast.ToastContainer />
    </div>
  );
}
