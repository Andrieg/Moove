"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface LandingPageData {
  brand: string;
  brand_name: string;
  logo: string;
  theme_color: string;
  about: string;
  hero: {
    title: string;
    description: string;
    cover: { url: string };
    video?: { url: string; thumbnail: string } | null;
  };
  access: {
    title: string;
    description: string;
    cover: { url: string };
  };
  membership: boolean;
  plan: {
    title: string;
    price: number;
    price_id: string;
    benefits: string[];
  };
  currency: string;
}

interface Props {
  data: LandingPageData;
  brandSlug: string;
}

const STORAGE_KEY = "moove_landing_page_config";

export default function LandingPageClient({ data, brandSlug }: Props) {
  const [localConfig, setLocalConfig] = useState<any>(null);
  const themeColor = data.theme_color || "#308FAB";

  // Load config from localStorage on client side
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocalConfig(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load local config:", err);
    }
  }, []);

  // Merge local config with default data
  const mergedData = {
    ...data,
    brand_name: localConfig?.hero?.title || data.brand_name,
    about: localConfig?.hero?.about || data.about,
    hero: {
      ...data.hero,
      title: localConfig?.hero?.title || data.hero.title,
      description: localConfig?.hero?.description || data.hero.description,
      cover: { url: localConfig?.hero?.coverImageUrl || data.hero.cover.url },
      video: localConfig?.hero?.trailerVideoUrl ? { url: localConfig.hero.trailerVideoUrl, thumbnail: "" } : data.hero.video,
    },
    access: {
      ...data.access,
      title: localConfig?.access?.title || data.access.title,
      description: localConfig?.access?.description || data.access.description,
      cover: { url: localConfig?.access?.coverImageUrl || data.access.cover.url },
    },
  };

  const handleJoinClick = () => {
    window.location.href = `/client/register?coach=${brandSlug}`;
  };

  const handleFreeTrialClick = () => {
    window.location.href = `/client/register?coach=${brandSlug}&trial=true`;
  };

  const currencySymbol = data.currency === "GBP" ? "£" : data.currency === "USD" ? "$" : "€";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/coach/${brandSlug}`} className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">moove</span>
            </Link>
            <Link
              href={`/client/login?coach=${brandSlug}`}
              className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                {mergedData.brand_name}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {mergedData.hero.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleFreeTrialClick}
                  style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
                  className="px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-sm text-base uppercase tracking-wide"
                >
                  Free Trial
                </button>
                {mergedData.hero.video && (
                  <button className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                      style={{ borderColor: themeColor }}
                    >
                      <svg className="w-5 h-5 ml-1" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="font-medium">WATCH TRAILER</span>
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <img
                src={mergedData.hero.cover.url}
                alt={mergedData.hero.title}
                className="rounded-xl shadow-lg w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">About</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{mergedData.about}</p>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                {/* Device mockups placeholder - showing multi-device access */}
                <img
                  src={mergedData.access.cover.url}
                  alt={mergedData.access.title}
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {mergedData.access.title}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {mergedData.access.description}
              </p>
              <button
                onClick={handleFreeTrialClick}
                style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
                className="px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-sm text-base uppercase tracking-wide"
              >
                Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Join Now / Membership Section */}
      {data.membership && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Join Now</h2>
              <p className="text-gray-500 mb-8">We are glad that you have decided to join us.</p>
              
              <div
                className="rounded-2xl p-8 border-2"
                style={{ borderColor: `${themeColor}40` }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{data.plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {currencySymbol}{data.plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {data.plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleJoinClick}
                  style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
                  className="w-full py-4 text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg text-base uppercase tracking-wide"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-gray-400">Powered by</p>
            <span className="text-3xl font-bold text-gray-900">moove</span>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700 underline">
                Terms and Conditions
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700 underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
