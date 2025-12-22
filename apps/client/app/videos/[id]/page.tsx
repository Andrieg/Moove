"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getVideoById } from "@moove/api-client";
import type { Video } from "@moove/types";
import Button from "../../_components/atoms/Button";
import Title from "../../_components/atoms/Title";
import Text from "../../_components/atoms/Text";
import VideoPlayer from "../../_components/blocks/VideoPlayer";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

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
  const videoUrl = (video as any).video?.url || undefined;

  // Mock data for demonstration
  const category = "Full Body";
  const intensity = "Strength";
  const style = "HIIT";
  const views = Math.floor(Math.random() * 1000) + 100;
  const rating = (Math.random() * 1 + 4).toFixed(1);

  return (
    <div className="bg-gray-50 min-h-screen">
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
                    {category}
                  </li>
                  <li className="after:content-['|'] after:ml-2 after:text-gray-300">
                    {intensity}
                  </li>
                  <li>{style}</li>
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
                      {views}
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
                      {rating}
                    </Text>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="default"
                    fullWidth
                    onClick={() => setShowPlayer(true)}
                  >
                    START WORKOUT
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant={favorited ? "primary" : "transparent"}
                      size="default"
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => setFavorited(!favorited)}
                    >
                      <Image
                        src={favorited ? "/icons/star.svg" : "/icons/star.svg"}
                        alt="Favorite"
                        width={18}
                        height={18}
                      />
                      {favorited ? "SAVED" : "SAVE"}
                    </Button>
                    <Button
                      variant={liked ? "primary" : "transparent"}
                      size="default"
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => setLiked(!liked)}
                    >
                      <Image
                        src={liked ? "/icons/likeFilled.svg" : "/icons/like.svg"}
                        alt="Like"
                        width={18}
                        height={18}
                      />
                      {liked ? "LIKED" : "LIKE"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Video - Right Side */}
            <div className="lg:col-span-8 order-1 lg:order-2 relative min-h-[20rem] lg:min-h-[30rem]">
              {showPlayer ? (
                <div className="absolute inset-0 bg-black">
                  <VideoPlayer
                    videoUrl={videoUrl}
                    thumbnailUrl={thumbnail}
                    title={video.title}
                    onClose={() => setShowPlayer(false)}
                  />
                </div>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${thumbnail})` }}
                >
                  {/* Navigation Icons */}
                  <div className="flex justify-between p-4">
                    <button
                      onClick={() => router.back()}
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

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setShowPlayer(true)}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition hover:scale-110"
                    >
                      <Image
                        src="/icons/play.svg"
                        alt="Play"
                        width={32}
                        height={32}
                        className="ml-1"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 py-8">
        {/* Class Details */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-4">
            Class Details
          </Title>
          <p className="text-sm text-gray-700 leading-relaxed">
            {(video.description as string) ||
              `This ${duration}-minute workout is designed to push your limits and help you achieve your fitness goals. Perfect for all fitness levels, this class combines strength training with cardio intervals for maximum results.`}
          </p>
        </section>

        {/* Equipment Needed */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-4">
            Equipment Needed
          </Title>
          <div className="flex flex-wrap gap-2">
            {["Dumbbells", "Mat", "Water Bottle"].map((item) => (
              <span
                key={item}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-6 border-b border-gray-200">
          <Title size="base" weight="600" className="mb-4">
            Disclaimer
          </Title>
          <div className="space-y-3">
            <a href="#" className="text-sm font-medium text-[#429FBA] hover:underline block">
              Booking and Cancellation Policy
            </a>
            <a href="#" className="text-sm font-medium text-[#429FBA] hover:underline block">
              Waiver
            </a>
          </div>
        </section>

        {/* Notes */}
        <section className="py-6">
          <Title size="base" weight="600" className="mb-4">
            Notes
          </Title>
          <p className="text-sm text-gray-700 leading-relaxed">
            Please ensure you have adequate space and proper equipment before
            starting this workout. Stay hydrated and listen to your body
            throughout the session.
          </p>
        </section>
      </div>
    </div>
  );
}
