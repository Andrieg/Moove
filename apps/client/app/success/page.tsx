"use client";

import Image from "next/image";
import Link from "next/link";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

export default function SuccessPage() {
  const handleOpenEmail = () => {
    // Try to open default email app
    window.location.href = "mailto:";
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/backgrounds/onboarding.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <Image
            src="/images/success.svg"
            alt="Success"
            width={80}
            height={80}
          />
        </div>

        <Title color="white" size="1.8rem" weight="700" center className="mb-4">
          Login link sent
        </Title>

        <Text color="white" size="1rem" center className="mb-8 leading-relaxed">
          Please check your email inbox for your login link.
        </Text>

        <Button variant="primary" fullWidth onClick={handleOpenEmail}>
          OPEN EMAIL APP
        </Button>

        {/* Footer */}
        <footer className="mt-12">
          <Text color="white/60" size="0.8rem">
            Didn't receive the email?{" "}
            <Link href="/login" className="text-white underline">
              Try again
            </Link>
          </Text>
        </footer>
      </div>
    </div>
  );
}
