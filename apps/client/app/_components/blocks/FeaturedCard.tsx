"use client";

import { useRouter } from "next/navigation";
import Title from "../atoms/Title";
import Button from "../atoms/Button";

interface FeaturedCardProps {
  classroom: {
    id: string;
    title: string;
    cover?: { url: string };
    description?: string;
  };
  tag?: string;
  type?: "class" | "challenge";
}

export default function FeaturedCard({
  classroom,
  tag = "FEATURED",
  type = "class",
}: FeaturedCardProps) {
  const router = useRouter();
  const thumbnail = classroom.cover?.url || "/backgrounds/default-featured.jpg";

  const handleClick = () => {
    if (type === "challenge") {
      router.push(`/challenges/${classroom.id}`);
    } else {
      router.push(`/videos/${classroom.id}`);
    }
  };

  return (
    <div
      className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer mx-auto mb-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${thumbnail})` }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/90 p-6 md:p-8 flex flex-col justify-end">
        {/* Tag */}
        <span className="inline-block bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white text-xs font-bold px-4 py-2 rounded-full mb-4 w-fit uppercase tracking-wider">
          {tag}
        </span>

        {/* Title */}
        <Title color="white" size="3xl" weight="700" className="mb-4">
          {classroom.title}
        </Title>

        {/* Description */}
        {classroom.description && (
          <p className="text-white/90 text-base mb-6 max-w-2xl">
            {classroom.description}
          </p>
        )}

        {/* CTA Button */}
        <Button
          variant="primary"
          size="default"
          onClick={handleClick}
          className="w-fit"
        >
          {type === "challenge" ? "Join Challenge" : "Watch Now"}
        </Button>
      </div>
    </div>
  );
}
