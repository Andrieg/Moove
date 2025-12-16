"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getChallengeById } from "@moove/api-client";
import type { Challenge } from "@moove/types";
import Button from "../../_components/atoms/Button";
import Title from "../../_components/atoms/Title";
import Text from "../../_components/atoms/Text";

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!id) return;
    getChallengeById(id)
      .then(setChallenge)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <Title color="black" size="xl">
            Error
          </Title>
          <pre className="mt-2 text-red-600 whitespace-pre-wrap">{error}</pre>
          <Button
            variant="primary"
            onClick={() => router.push("/challenges")}
            className="mt-4"
          >
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  if (challenge === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const startDate = challenge.startDate
    ? new Date(challenge.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";
  const endDate = challenge.endDate
    ? new Date(challenge.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";

  const thumbnail = "/backgrounds/default-challenge.jpg";

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Content - Left Side */}
            <div className="lg:col-span-4 order-2 lg:order-1 flex items-center justify-center p-8 lg:p-12">
              <div className="max-w-md w-full">
                {/* Tag */}
                <span className="inline-block bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wider">
                  Challenge
                </span>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
                  {challenge.title}
                </h1>

                {/* Date Range */}
                <div className="mb-6">
                  <Text size="base" weight="500" className="text-gray-600">
                    {startDate} – {endDate}
                  </Text>
                </div>

                {/* Features */}
                <ul className="flex flex-wrap gap-2 mb-6 text-gray-600">
                  <li className="after:content-['|'] after:ml-2 after:text-gray-300">
                    30 Days
                  </li>
                  <li className="after:content-['|'] after:ml-2 after:text-gray-300">
                    All Levels
                  </li>
                  <li>Daily Workouts</li>
                </ul>

                {/* Stats */}
                <div className="flex gap-6 mb-8">
                  {/* Participants */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/eye.svg"
                      alt="Participants"
                      width={18}
                      height={18}
                    />
                    <Text size="sm" weight="600">
                      248 joined
                    </Text>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/clock.svg"
                      alt="Duration"
                      width={18}
                      height={18}
                    />
                    <Text size="sm" weight="600">
                      30 days
                    </Text>
                  </div>
                </div>

                {/* CTA Button */}
                {joined ? (
                  <Button
                    variant="secondary"
                    size="default"
                    fullWidth
                    onClick={() => router.push(`/challenges/${challenge.id}/progress`)}
                  >
                    VIEW PROGRESS
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="default"
                    fullWidth
                    onClick={() => setJoined(true)}
                  >
                    JOIN CHALLENGE
                  </Button>
                )}
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="lg:col-span-8 order-1 lg:order-2 relative min-h-[20rem] lg:min-h-[30rem]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${thumbnail})` }}
              >
                {/* Navigation Icons */}
                <div className="flex justify-between p-4">
                  <button
                    onClick={() => router.push("/challenges")}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition"
                  >
                    <Image
                      src="/icons/back.svg"
                      alt="Back"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    onClick={() => setLiked(!liked)}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition"
                  >
                    <Image
                      src={liked ? "/icons/likeFilled.svg" : "/icons/like.svg"}
                      alt="Like"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-8">
        {/* Challenge Details */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-3">
            About This Challenge
          </Title>
          <Text size="sm" className="text-gray-700 leading-relaxed">
            Join thousands of members in this transformative 30-day fitness
            challenge. Each day includes a curated workout designed to build
            strength, endurance, and confidence. Perfect for all fitness levels
            with modifications available for every exercise.
          </Text>
        </section>

        {/* What's Included */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-3">
            What's Included
          </Title>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-[#308FAB] mt-1">✓</span>
              <Text size="sm" className="text-gray-700">
                30 days of guided workouts
              </Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#308FAB] mt-1">✓</span>
              <Text size="sm" className="text-gray-700">
                Progress tracking and milestones
              </Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#308FAB] mt-1">✓</span>
              <Text size="sm" className="text-gray-700">
                Community support and encouragement
              </Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#308FAB] mt-1">✓</span>
              <Text size="sm" className="text-gray-700">
                Nutrition tips and guidelines
              </Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#308FAB] mt-1">✓</span>
              <Text size="sm" className="text-gray-700">
                Certificate of completion
              </Text>
            </li>
          </ul>
        </section>

        {/* Requirements */}
        <section className="py-6">
          <Title size="base" weight="600" className="mb-3">
            Requirements
          </Title>
          <Text size="sm" className="text-gray-700 leading-relaxed mb-4">
            This challenge is designed for all fitness levels. You'll need:
          </Text>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <Text size="sm" className="text-gray-700">
                Basic equipment (dumbbells, mat)
              </Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <Text size="sm" className="text-gray-700">
                20-30 minutes per day
              </Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <Text size="sm" className="text-gray-700">
                Commitment and motivation
              </Text>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
