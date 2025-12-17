"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Text from "../atoms/Text";
import Title from "../atoms/Title";
import Button from "../atoms/Button";

interface ClassroomData {
  id: string;
  title: string;
  cover?: { url?: string };
  duration?: number;
  target?: string;
  views?: number;
  rating?: number;
  end?: string;
  description?: string;
}

interface ClassCardProps {
  classroom: ClassroomData;
  type: "upcoming" | "plan" | "challenge" | "withBottom" | "only_title" | "duration";
  tag?: string;
  buttonText?: string;
  liked?: boolean;
  progress?: boolean;
  onLikeToggle?: () => void;
}

export default function ClassCard({
  classroom,
  type,
  tag,
  buttonText,
  liked = false,
  progress = false,
  onLikeToggle,
}: ClassCardProps) {
  const router = useRouter();

  const cover = classroom.cover as { url?: string } | undefined;
  const thumbnail = cover?.url || "/images/cardBackground.png";

  const handleClick = () => {
    if (type === "challenge") {
      router.push(`/challenges/${classroom.id}`);
    } else {
      router.push(`/videos/${classroom.id}`);
    }
  };

  // Size classes based on type - matching legacy exactly
  const sizeClasses: Record<string, string> = {
    challenge: "min-w-[18rem] h-56",
    withBottom: "min-w-[18rem] h-48",
    plan: "min-w-[18rem] h-56",
    upcoming: "min-w-[20rem] h-64",
    only_title: "min-w-[16rem] h-48",
    duration: "min-w-[16rem] h-40",
  };

  // Challenge Card
  if (type === "challenge") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 cursor-pointer relative overflow-hidden bg-cover bg-center transition-all hover:scale-[1.02]`}
        style={{ 
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "56rem",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
        }}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,27,27,0.1)] to-[rgba(27,27,27,0.75)] p-4 flex flex-col">
          <div className="flex-1 flex flex-col justify-end items-start">
            <span className="bg-gradient-to-r from-[#429FBA] to-[#217E9A] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase">
              CHALLENGE
            </span>
            <Title color="white" size="1.3rem" weight="700" className="mb-2">
              {classroom.title}
            </Title>
            <div className="w-full flex justify-between items-end">
              <Text color="white" size="0.9rem">
                {classroom.end || "Join now"}
              </Text>
              <Button variant="primary" size="small" className="text-[0.7rem] px-4 py-1">
                JOIN
              </Button>
            </div>
          </div>
          {progress && (
            <div className="mt-3">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "45%" }} />
              </div>
              <Text color="white" size="0.7rem" className="mt-1">45% complete</Text>
            </div>
          )}
        </div>
      </div>
    );
  }

  // WithBottom Card (most common - workouts)
  if (type === "withBottom") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 cursor-pointer relative overflow-hidden transition-all hover:scale-[1.02]`}
        style={{ 
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
        }}
        onClick={handleClick}
      >
        {/* Image Section */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all"
          style={{ 
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: "56rem",
            bottom: "4rem"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,27,27,0.1)] to-[rgba(27,27,27,0.75)]">
            {/* Like Button */}
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLikeToggle?.();
                }}
                className="p-1"
              >
                <Image
                  src={liked ? "/icons/likeFilled.svg" : "/icons/like.svg"}
                  alt="Like"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* Tag and Title */}
            <div className="absolute bottom-3 left-3">
              {tag && (
                <span className="bg-gradient-to-r from-[#429FBA] to-[#217E9A] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block uppercase">
                  {tag}
                </span>
              )}
              <Title color="white" size="1.3rem" weight="700">
                {classroom.title}
              </Title>
            </div>
          </div>
        </div>

        {/* Bottom White Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-white px-3 py-2 flex justify-between items-end rounded-b-lg">
          <div className="flex flex-col">
            <Text color="#636363" size="0.8rem" className="mb-1">
              {classroom.target || "Full Body"}
            </Text>
            <div className="flex items-center gap-3">
              {classroom.views && (
                <div className="flex items-center gap-1">
                  <Image src="/icons/eye.svg" alt="Views" width={14} height={14} />
                  <Text size="0.7rem" weight="500">{classroom.views}</Text>
                </div>
              )}
              {classroom.duration && (
                <div className="flex items-center gap-1">
                  <Image src="/icons/clock.svg" alt="Duration" width={14} height={14} />
                  <Text size="0.7rem" weight="500">{classroom.duration} min</Text>
                </div>
              )}
              {classroom.rating && (
                <div className="flex items-center gap-1">
                  <Image src="/icons/filledStar.svg" alt="Rating" width={14} height={14} />
                  <Text size="0.7rem" weight="500">{classroom.rating}</Text>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="primary"
            size="small"
            className="text-[0.7rem] px-4 py-1"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {buttonText || "START"}
          </Button>
        </div>
      </div>
    );
  }

  // Plan Card
  if (type === "plan") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 cursor-pointer relative overflow-hidden bg-cover bg-center transition-all hover:scale-[1.02]`}
        style={{ 
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "56rem",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
        }}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,27,27,0.1)] to-[rgba(27,27,27,0.75)] p-4 flex flex-col items-center justify-center text-center">
          <span className="bg-gradient-to-r from-[#429FBA] to-[#217E9A] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase">
            PLAN
          </span>
          <Title color="white" size="1.3rem" weight="700" className="mb-2">
            {classroom.title}
          </Title>
          {classroom.description && (
            <Text color="white" size="0.9rem" className="mb-4">
              {classroom.description}
            </Text>
          )}
          {progress ? (
            <div className="w-full px-8">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "60%" }} />
              </div>
              <Text color="white" size="0.7rem" className="mt-1">60% complete</Text>
            </div>
          ) : (
            <Button variant="primary" size="small" className="text-[0.8rem] px-6">
              START
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Only Title Card
  if (type === "only_title") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 cursor-pointer relative overflow-hidden bg-cover bg-center transition-all hover:scale-[1.02]`}
        style={{ 
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "35rem",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
        }}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,27,27,0.1)] to-[rgba(27,27,27,0.75)] flex items-center justify-center">
          <Title color="white" size="1.3rem" weight="700" className="text-center px-4">
            {classroom.title}
          </Title>
        </div>
      </div>
    );
  }

  // Duration Card (outlined)
  if (type === "duration") {
    return (
      <div
        className={`${sizeClasses[type]} rounded-lg m-4 cursor-pointer relative overflow-hidden bg-white border-2 border-[#217E9A] transition-all hover:scale-[1.02] flex items-center justify-center`}
        style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}
        onClick={handleClick}
      >
        <Title color="#217E9A" size="1.3rem" weight="700" className="text-center px-4">
          {classroom.title}
        </Title>
      </div>
    );
  }

  // Default/Upcoming Card
  return (
    <div
      className={`${sizeClasses[type] || sizeClasses.upcoming} rounded-lg m-4 cursor-pointer relative overflow-hidden bg-cover bg-center transition-all hover:scale-[1.02]`}
      style={{ 
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "56rem",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
      }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,27,27,0.1)] to-[rgba(27,27,27,0.75)] p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Image src="/icons/clockWhite.svg" alt="Duration" width={16} height={16} />
            <Text color="white" size="0.9rem">{classroom.duration || 45} min</Text>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Title color="white" size="1rem" weight="500">Starting soon...</Title>
        </div>
        <div className="flex justify-between items-end">
          <Text color="white" size="1.1rem" weight="500">{classroom.title}</Text>
          <Button variant="secondary" size="small" className="text-[0.8rem] px-4">
            {progress ? "JOINED" : "JOIN"}
          </Button>
        </div>
      </div>
    </div>
  );
}
