"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

// Default landing page data
const defaultLandingPageData = {
  brand_name: "My Fitness",
  about: "Transform your body and mind with personalized training programs designed to help you achieve your goals. Whether you're just starting out or looking to take your fitness to the next level, I'm here to guide you every step of the way.",
  hero: {
    title: "Transform Your Body",
    description: "Join my exclusive fitness program and unlock your full potential with personalized workouts, nutrition guidance, and 24/7 support.",
    cover: {
      url: "/images/example-avatar-1.png",
    },
    video: null,
  },
  access: {
    title: "Train Anywhere, Anytime",
    description: "Get unlimited access to my entire library of workout videos, live classes, and exclusive content. Available on all your devices.",
    cover: {
      url: "/images/landing-devices.png",
    },
  },
  membership: true,
};

const defaultPlanData = {
  title: "Premium Membership",
  price: 29.99,
  currency: "USD",
  benefits: [
    "Unlimited access to all workout videos",
    "Weekly live training sessions",
    "Personalized nutrition plans",
    "Private community access",
    "Direct messaging with coach",
  ],
};

interface LandingPageClientProps {
  brandSlug: string;
}

export default function LandingPageClient({ brandSlug }: LandingPageClientProps) {
  const router = useRouter();
  const [themeColor, setThemeColor] = useState("#308FAB");
  const [data, setData] = useState({
    ...defaultLandingPageData,
    plan: defaultPlanData,
  });

  useEffect(() => {
    // Try to load saved landing page config from localStorage
    const savedConfig = localStorage.getItem(`moove_landing_${brandSlug}`);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setData((prev) => ({
          ...prev,
          ...config,
          hero: { ...prev.hero, ...config.hero },
          access: { ...prev.access, ...config.access },
          plan: { ...prev.plan, ...config.plan },
        }));
        if (config.themeColor) {
          setThemeColor(config.themeColor);
        }
      } catch (e) {
        console.error("Failed to parse landing page config:", e);
      }
    }

    // Load theme color
    const savedColor = localStorage.getItem("moove_theme_color");
    if (savedColor) setThemeColor(savedColor);
  }, [brandSlug]);

  const mergedData = {
    ...defaultLandingPageData,
    ...data,
    hero: { ...defaultLandingPageData.hero, ...data.hero },
    access: { ...defaultLandingPageData.access, ...data.access },
  };

  const currencySymbol = data.plan?.currency === "EUR" ? "€" : data.plan?.currency === "GBP" ? "£" : "$";

  const handleFreeTrialClick = () => {
    router.push(`/client/register?coach=${brandSlug}`);
  };

  const handleJoinClick = async () => {
    try {
      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
      const stripe = await stripePromise;
      if (!stripe) {
        router.push(`/client/register?coach=${brandSlug}`);
        return;
      }
      router.push(`/client/register?coach=${brandSlug}`);
    } catch (error) {
      router.push(`/client/register?coach=${brandSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/coach/${brandSlug}`} className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">moove</span>
            </Link>
            <Link
              href={`/client/login?coach=${brandSlug}`}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <div 
                className="inline-flex px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
              >
                ✨ Start your transformation today
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                {mergedData.brand_name}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {mergedData.hero.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleFreeTrialClick}
                  style={{ backgroundColor: themeColor }}
                  className="px-8 py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg text-base"
                >
                  Start Free Trial
                </button>
                {mergedData.hero.video && (
                  <button className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition group">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center border-2 group-hover:scale-105 transition-transform"
                      style={{ borderColor: themeColor, backgroundColor: `${themeColor}10` }}
                    >
                      <svg className="w-5 h-5 ml-1" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="font-medium">Watch Trailer</span>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>7-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div 
                className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl"
                style={{ backgroundColor: themeColor }}
              ></div>
              <img
                src={mergedData.hero.cover.url}
                alt={mergedData.hero.title}
                className="relative rounded-2xl shadow-2xl w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">About</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{mergedData.about}</p>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div 
                  className="absolute -inset-4 rounded-3xl opacity-10 blur-2xl"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <img
                  src={mergedData.access.cover.url}
                  alt={mergedData.access.title}
                  className="relative rounded-2xl shadow-xl w-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {mergedData.access.title}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {mergedData.access.description}
              </p>

              <ul className="space-y-4 mb-8">
                {["On-demand workouts", "Live classes", "Progress tracking", "Community support"].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${themeColor}15` }}
                    >
                      <svg className="w-4 h-4" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleFreeTrialClick}
                style={{ backgroundColor: themeColor }}
                className="px-8 py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg text-base"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {data.membership && (
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-slate-500">Start your fitness journey today</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div
                className="bg-white rounded-2xl p-8 shadow-xl border-2 relative overflow-hidden"
                style={{ borderColor: themeColor }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: themeColor }}
                ></div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{data.plan.title}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-slate-900">
                      {currencySymbol}{data.plan.price}
                    </span>
                    <span className="text-slate-500 text-lg">/ month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {data.plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleJoinClick}
                  style={{ backgroundColor: themeColor }}
                  className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg text-base"
                >
                  Start 7-Day Free Trial
                </button>

                <p className="text-center text-sm text-slate-400 mt-4">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-slate-400">Powered by</p>
            <span className="text-3xl font-bold text-slate-900">moove</span>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-slate-500 hover:text-slate-700 transition">
                Terms and Conditions
              </Link>
              <Link href="#" className="text-slate-500 hover:text-slate-700 transition">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
