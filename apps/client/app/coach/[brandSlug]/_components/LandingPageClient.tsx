"use client";

import { useState } from "react";
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
  reviews?: { name: string; text: string; rating: number }[];
}

interface Props {
  data: LandingPageData;
  brandSlug: string;
}

export default function LandingPageClient({ data, brandSlug }: Props) {
  const [isLoggedIn] = useState(false);
  const themeColor = data.theme_color || "#308FAB";

  const handleJoinClick = () => {
    // Redirect to signup with brand context
    window.location.href = `/signup?coach=${brandSlug}`;
  };

  const currencySymbol = data.currency === "GBP" ? "£" : data.currency === "USD" ? "$" : "€";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/coach/${brandSlug}`} className="flex items-center gap-2">
              <div className="relative w-32 h-10">
                <Image src={data.logo} alt={data.brand_name} fill className="object-contain" />
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={isLoggedIn ? "/home" : `/login?coach=${brandSlug}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                {isLoggedIn ? "Dashboard" : "Sign In"}
              </Link>
              <button
                onClick={handleJoinClick}
                style={{ backgroundColor: themeColor }}
                className="px-5 py-2.5 text-white text-sm font-semibold rounded-full hover:opacity-90 transition shadow-lg"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {data.hero.title}
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {data.hero.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleJoinClick}
                  style={{ backgroundColor: themeColor }}
                  className="px-8 py-4 text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg text-lg"
                >
                  Start Free Trial
                </button>
                {data.hero.video && (
                  <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Trailer
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-4">✓ 7-day free trial • Cancel anytime</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                  style={{ backgroundColor: themeColor }}
                />
                <img
                  src={data.hero.cover.url}
                  alt={data.hero.title}
                  className="relative rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{data.about}</p>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                style={{ backgroundColor: themeColor }}
              />
              <img
                src={data.access.cover.url}
                alt={data.access.title}
                className="relative rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {data.access.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {data.access.description}
              </p>
              <button
                onClick={handleJoinClick}
                style={{ backgroundColor: themeColor }}
                className="px-8 py-4 text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg"
              >
                Get Access Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {data.reviews && data.reviews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Members Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {data.reviews.map((review, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{review.text}"</p>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Membership/Pricing Section */}
      {data.membership && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Join Now</h2>
              <p className="text-lg text-gray-600">Start your transformation today with a 7-day free trial</p>
            </div>
            <div className="max-w-lg mx-auto">
              <div
                className="rounded-3xl p-8 shadow-xl border-2"
                style={{ borderColor: themeColor }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.plan.title}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold" style={{ color: themeColor }}>
                    {currencySymbol}{data.plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {data.plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: themeColor }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleJoinClick}
                  style={{ backgroundColor: themeColor }}
                  className="w-full py-4 text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg text-lg"
                >
                  Start 7-Day Free Trial
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">No credit card required to start</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-24 h-8">
                <Image src={data.logo} alt={data.brand_name} fill className="object-contain" />
              </div>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} {data.brand_name}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
