"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

const slides = [
  {
    title: "ON-DEMAND AND LIVE CLASSES",
    description:
      "Get access to unlimited on-demand and live classes tailored to your goals. Take individual classes at your convenience or schedule classes with your friends.",
  },
  {
    title: "PERSONALIZED WORKOUT PLANS",
    description:
      "Create custom workout routines based on your fitness level and goals. Track your progress and see real results.",
  },
  {
    title: "JOIN THE COMMUNITY",
    description:
      "Connect with fellow fitness enthusiasts, share achievements, and motivate each other to reach new heights.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("moovefit-token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between relative"
      style={{
        backgroundImage: "url(/backgrounds/onboarding.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-lg px-6 py-8">
        {/* Header with Logo */}
        <header className="flex items-center justify-center pt-8 pb-4" style={{ height: "16vh" }}>
          <Image
            src="/images/logo.svg"
            alt="Moove"
            width={120}
            height={60}
            className="h-16 w-auto"
          />
        </header>

        {/* Slider */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full px-4">
          {/* Arrows - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className="hidden lg:block absolute left-[-5rem] bottom-24 cursor-pointer hover:opacity-80 transition"
          >
            <Image
              src="/icons/swiper_arrow.svg"
              alt="Previous"
              width={32}
              height={32}
              className="rotate-180"
            />
          </button>
          <button
            onClick={nextSlide}
            className="hidden lg:block absolute right-[-5rem] bottom-24 cursor-pointer hover:opacity-80 transition"
          >
            <Image
              src="/icons/swiper_arrow.svg"
              alt="Next"
              width={32}
              height={32}
            />
          </button>

          {/* Slide Content */}
          <div
            className={`text-center transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            <Title color="white" size="1.5rem" weight="700" center className="mb-4">
              {slides[currentSlide].title}
            </Title>
            <Text color="white" size="1rem" center className="leading-relaxed">
              {slides[currentSlide].description}
            </Text>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-4 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full mt-8">
          <Link href="/registration" className="w-full">
            <Button variant="primary" fullWidth>
              GET STARTED
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="outline" fullWidth>
              LOG IN
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center mt-8 pb-4">
          <Text color="white" size="0.8rem" className="mb-2">
            Powered by
          </Text>
          <Image
            src="/images/logo.png"
            alt="Moove"
            width={80}
            height={24}
            className="opacity-80"
          />
        </footer>
      </div>
    </div>
  );
}
