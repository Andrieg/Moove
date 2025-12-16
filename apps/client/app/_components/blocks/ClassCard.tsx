"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Title from "../atoms/Title";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

interface ClassCardProps {
  classroom: {
    id: string;
    title: string;
    cover?: { url: string };
    duration?: number;
    durationSeconds?: number;
    target?: string;
    category?: string;
  };
  type?: "upcoming" | "plan" | "challenge" | "withBottom" | "only_title" | "duration";
  tag?: string;
  liked?: boolean;
  onLikeToggle?: () => void;
}

export default function ClassCard({
  classroom,
  type = "withBottom",
  tag,
  liked = false,
  onLikeToggle,
}: ClassCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (type === "challenge") {
      router.push(`/challenges/${classroom.id}`);
    } else {
      router.push(`/videos/${classroom.id}`);
    }
  };

  const thumbnail = classroom.cover?.url || "/backgrounds/default-workout.jpg";
  const duration = classroom.duration || (classroom.durationSeconds ? Math.floor(classroom.durationSeconds / 60) : 0);

  // Card size variants
  const sizeClasses = {
    upcoming: "min-w-[20rem] h-64",
    plan: "min-w-[18rem] h-56",
    challenge: "min-w-[18rem] h-56",
    withBottom: "min-w-[18rem] h-48",
    only_title: "min-w-[16rem] h-48",
    duration: "min-w-[16rem] h-40 bg-white border-2 border-[#217E9A]",
  };

  if (type === "only_title") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 shadow-md cursor-pointer relative overflow-hidden bg-cover bg-center transition-all hover:scale-105`}
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/75 flex items-center justify-center p-4">
          <Title color="white" center size="lg">
            {classroom.title}
          </Title>
        </div>
      </div>
    );
  }

  if (type === "duration") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 shadow-md cursor-pointer flex items-center justify-center transition-all hover:scale-105`}
        onClick={handleClick}
      >
        <Title color="#217E9A" center size="lg">
          {classroom.title}
        </Title>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[type]} rounded-lg m-4 shadow-md cursor-pointer relative overflow-hidden bg-cover bg-center transition-all hover:scale-105`}
      style={{ backgroundImage: `url(${thumbnail})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/75 p-4 flex flex-col">
        {/* Like Button */}
        {onLikeToggle && (
          <div className="flex justify-end mb-2">
            <button onClick={onLikeToggle} className="p-2">
              <Image
                src={liked ? "/icons/likeFilled.svg" : "/icons/like.svg"}
                alt="Like"
                width={20}
                height={20}
              />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-end">
          {tag && (
            <span className="inline-block bg-white/90 text-[#308FAB] text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit">
              {tag}
            </span>
          )}
          <Title color="white" size="lg">
            {classroom.title}
          </Title>
        </div>

        {/* Bottom Info */}
        {type === "withBottom" && (
          <div className="bg-white rounded-lg p-3 mt-3 flex justify-between items-center">
            <div>
              {classroom.target && (
                <Text size="xs" color="#636363" className="mb-1">
                  {classroom.target}
                </Text>
              )}
              <div className="flex gap-3 items-center">
                {duration > 0 && (
                  <div className="flex items-center gap-1">
                    <Image src="/icons/clock.svg" alt="Duration" width={14} height={14} />
                    <Text size="xs">{duration} min</Text>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={handleClick}
              className="text-[0.7rem] py-1.5 px-4"
            >
              START
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
