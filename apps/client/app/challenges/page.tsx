"use client";

import { useEffect, useState } from "react";
import { getChallenges } from "@moove/api-client";
import type { Challenge } from "@moove/types";
import ClassCard from "../_components/blocks/ClassCard";
import Title from "../_components/atoms/Title";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .catch((e) => setError((e as Error).message));
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <Title color="black" size="xl">Error</Title>
          <pre className="mt-2 text-red-600 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }

  if (challenges === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Title color="black" size="2xl" className="mb-6">All Challenges</Title>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No challenges available yet.</p>
          <p className="text-gray-400 mt-2">Check back soon for new challenges to join!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex justify-center">
              <ClassCard
                type="challenge"
                classroom={{
                  id: challenge.id,
                  title: challenge.title,
                  cover: { url: "" },
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
