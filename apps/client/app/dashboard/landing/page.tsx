"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "../_components/ui/Card";
import Button from "../_components/ui/Button";
import { useToast } from "../_components/ui/Toast";

interface LandingPageSettings {
  brand_name: string;
  brand_slug: string;
  theme_color: string;
  about: string;
  hero_title: string;
  hero_description: string;
  hero_image: string;
  access_title: string;
  access_description: string;
  access_image: string;
  plan_title: string;
  plan_price: number;
  plan_benefits: string[];
  reviews: { name: string; text: string; rating: number }[];
}

const defaultSettings: LandingPageSettings = {
  brand_name: "My Fitness",
  brand_slug: "myfitness",
  theme_color: "#308FAB",
  about: "Welcome to my fitness program! I'm here to help you achieve your health and fitness goals.",
  hero_title: "Transform Your Body, Transform Your Life",
  hero_description: "Join my exclusive fitness program and get access to personalized workouts, nutrition plans, and 24/7 support.",
  hero_image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
  access_title: "What You'll Get Access To",
  access_description: "Unlimited access to workout videos, live classes, meal plans, and a supportive community.",
  access_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
  plan_title: "Monthly Membership",
  plan_price: 29.99,
  plan_benefits: ["100+ workout videos", "Weekly live classes", "Personalized meal plans", "Private community access", "7-day free trial"],
  reviews: [],
};

export default function LandingPageEditor() {
  const router = useRouter();
  const toast = useToast();
  const [settings, setSettings] = useState<LandingPageSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "content" | "pricing">("general");

  useEffect(() => {
    // Load existing settings from localStorage or API
    const saved = localStorage.getItem("coach-landing-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for dev mode
      localStorage.setItem("coach-landing-settings", JSON.stringify(settings));
      toast.success("Landing page saved successfully!");
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setSettings({ ...settings, plan_benefits: [...settings.plan_benefits, newBenefit.trim()] });
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setSettings({ ...settings, plan_benefits: settings.plan_benefits.filter((_, i) => i !== index) });
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "hero", label: "Hero Section" },
    { id: "content", label: "Content" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Landing Page</h1>
          <p className="text-sm text-slate-500 mt-1">Customize your public landing page</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.open(`/coach/${settings.brand_slug}`, "_blank")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Brand Name</label>
              <input
                type="text"
                value={settings.brand_name}
                onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL Slug</label>
              <div className="flex items-center">
                <span className="text-slate-500 text-sm mr-2">moove.com/coach/</span>
                <input
                  type="text"
                  value={settings.brand_slug}
                  onChange={(e) => setSettings({ ...settings, brand_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.theme_color}
                  onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.theme_color}
                  onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                  className="w-32 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">About Section</label>
              <textarea
                value={settings.about}
                onChange={(e) => setSettings({ ...settings, about: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Hero Section */}
      {activeTab === "hero" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Headline</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={settings.hero_description}
                onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hero Image URL</label>
              <input
                type="url"
                value={settings.hero_image}
                onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
              {settings.hero_image && (
                <img src={settings.hero_image} alt="Preview" className="mt-3 rounded-lg w-full max-w-sm h-48 object-cover" />
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Content Section */}
      {activeTab === "content" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">"What You Get" Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
              <input
                type="text"
                value={settings.access_title}
                onChange={(e) => setSettings({ ...settings, access_title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={settings.access_description}
                onChange={(e) => setSettings({ ...settings, access_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Section Image URL</label>
              <input
                type="url"
                value={settings.access_image}
                onChange={(e) => setSettings({ ...settings, access_image: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
              {settings.access_image && (
                <img src={settings.access_image} alt="Preview" className="mt-3 rounded-lg w-full max-w-sm h-48 object-cover" />
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Pricing Section */}
      {activeTab === "pricing" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Pricing</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plan Name</label>
              <input
                type="text"
                value={settings.plan_title}
                onChange={(e) => setSettings({ ...settings, plan_title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Price (£)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.plan_price}
                onChange={(e) => setSettings({ ...settings, plan_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Benefits</label>
              <div className="space-y-2 mb-3">
                {settings.plan_benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-1 px-4 py-2 bg-slate-50 rounded-lg text-sm">{benefit}</span>
                    <button onClick={() => removeBenefit(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addBenefit()}
                  placeholder="Add a benefit..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                />
                <Button variant="secondary" onClick={addBenefit}>Add</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <toast.ToastContainer />
    </div>
  );
}
