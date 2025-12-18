import { Metadata } from "next";
import LandingPageClient from "./_components/LandingPageClient";

interface PageProps {
  params: Promise<{ brandSlug: string }>;
}

// Mock data for development - will be replaced with API call
async function getCoachData(brandSlug: string) {
  // In dev, return mock data
  const mockData = {
    brand: brandSlug,
    brand_name: "Anna Martin Fitness",
    logo: "/images/logo.svg",
    theme_color: "#308FAB",
    about: "I'm Anna Martin, a certified personal trainer with over 10 years of experience helping people transform their lives through fitness. My approach combines effective workout routines with sustainable nutrition guidance to help you achieve lasting results.",
    hero: {
      title: "Transform Your Body, Transform Your Life",
      description: "Join my exclusive fitness program and get access to personalized workouts, nutrition plans, and 24/7 support to help you reach your goals.",
      cover: { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800" },
      video: null,
    },
    access: {
      title: "What You'll Get Access To",
      description: "Unlimited access to 100+ workout videos, weekly live classes, personalized meal plans, and a supportive community of like-minded individuals.",
      cover: { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" },
    },
    membership: true,
    plan: {
      title: "Monthly Membership",
      price: 29.99,
      price_id: "price_test123",
      benefits: [
        "100+ workout videos",
        "Weekly live classes",
        "Personalized meal plans",
        "Private community access",
        "Monthly check-ins",
        "7-day free trial",
      ],
    },
    currency: "GBP",
    reviews: [
      { name: "Sarah K.", text: "Anna's program completely changed my life! I've lost 20 pounds and feel stronger than ever.", rating: 5 },
      { name: "Mike T.", text: "The workouts are challenging but doable. Great variety and Anna is so supportive!", rating: 5 },
      { name: "Emma L.", text: "Best investment I've made in my health. The community is amazing!", rating: 5 },
    ],
  };

  return mockData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const data = await getCoachData(brandSlug);
  return {
    title: data.brand_name,
    description: data.about,
  };
}

export default async function CoachLandingPage({ params }: PageProps) {
  const { brandSlug } = await params;
  const data = await getCoachData(brandSlug);
  return <LandingPageClient data={data} brandSlug={brandSlug} />;
}
