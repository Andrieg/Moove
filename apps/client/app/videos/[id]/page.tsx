"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getVideoById } from "@moove/api-client";
import type { Video } from "@moove/types";
import Button from "../../_components/atoms/Button";
import Title from "../../_components/atoms/Title";
import Text from "../../_components/atoms/Text";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    getVideoById(id)
      .then(setVideo)
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
            onClick={() => router.push("/videos")}
            className="mt-4"
          >
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  if (video === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  const duration = video.durationSeconds
    ? Math.floor(video.durationSeconds / 60)
    : 0;
  const cover = video.cover as { url?: string } | undefined;
  const thumbnail = cover?.url || "/backgrounds/default-workout.jpg";

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
                {video.published && (
                  <span className="inline-block bg-[#308FAB]/10 text-[#308FAB] text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wider">
                    Available Now
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
                  {video.title}
                </h1>

                {/* Features List */}
                <ul className="flex flex-wrap gap-2 mb-6 text-gray-600">
                  <li className="after:content-['|'] after:ml-2 after:text-gray-300">
                    Full Body
                  </li>
                  <li className="after:content-['|'] after:ml-2 after:text-gray-300">
                    Strength
                  </li>
                  <li>HIIT</li>
                </ul>

                {/* Icons Row */}
                <div className="flex gap-6 mb-8">
                  {/* Views */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/eye.svg"
                      alt="Views"
                      width={18}
                      height={18}
                    />
                    <Text size="sm" weight="600">
                      0
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
                      {duration} min
                    </Text>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/filledStar.svg"
                      alt="Rating"
                      width={18}
                      height={18}
                    />
                    <Text size="sm" weight="600">
                      4.9
                    </Text>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="default"
                  fullWidth
                  onClick={() => router.push(`/player/${video.id}`)}
                >
                  WATCH NOW
                </Button>
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
                    onClick={() => router.push("/")}
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
        {/* Class Details */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-3">
            Class Details
          </Title>
          <Text size="sm" className="text-gray-700 leading-relaxed">
            {video.description ||
              `This ${duration}-minute workout is designed to push your limits and help you achieve your fitness goals. Perfect for all fitness levels, this class combines strength training with cardio intervals for maximum results.`}
          </Text>
        </section>

        {/* Disclaimer */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-3">
            Disclaimer
          </Title>
          <div className="space-y-2">
            <Text
              size="sm"
              weight="600"
              color="#429FBA"
              className="cursor-pointer hover:underline"
            >
              Booking and Cancellation Policy
            </Text>
            <br />
            <Text
              size="sm"
              weight="600"
              color="#429FBA"
              className="cursor-pointer hover:underline"
            >
              Waiver
            </Text>
          </div>
        </section>

        {/* Notes (if available) */}
        <section className="py-6">
          <Title size="base" weight="600" className="mb-3">
            Notes
          </Title>
          <Text size="sm" className="text-gray-700 leading-relaxed">
            Please ensure you have adequate space and proper equipment before
            starting this workout. Stay hydrated and listen to your body
            throughout the session.
          </Text>
        </section>
      </div>
    </div>
  );
}
