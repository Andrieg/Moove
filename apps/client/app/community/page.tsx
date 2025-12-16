"use client";

import { useState } from "react";
import Image from "next/image";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

interface Post {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: { name: "Sarah Johnson" },
      content:
        "Just finished the 30 Day Strength Challenge! 💪 Feeling stronger than ever. Thanks for the amazing workouts!",
      likes: 24,
      comments: 5,
      timestamp: "2 hours ago",
      liked: false,
    },
    {
      id: "2",
      user: { name: "Mike Chen" },
      content:
        "Week 2 of HIIT training complete! The progress is real. Who else is doing this challenge?",
      likes: 18,
      comments: 3,
      timestamp: "5 hours ago",
      liked: true,
    },
    {
      id: "3",
      user: { name: "Emma Wilson" },
      content:
        "Morning yoga session was exactly what I needed. Starting the day right! 🧘‍♀️",
      likes: 31,
      comments: 8,
      timestamp: "1 day ago",
      liked: false,
    },
  ]);

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6">
        {/* Page Title */}
        <Title color="black" size="2xl" weight="700" className="mb-6">
          Community
        </Title>

        {/* Create Post */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white font-bold flex-shrink-0">
              U
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Share your fitness journey..."
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:border-[#308FAB] focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20"
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button variant="primary" size="small">
              Post
            </Button>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white font-bold">
                  {post.user.name[0]}
                </div>
                <div>
                  <Title size="base" weight="600">
                    {post.user.name}
                  </Title>
                  <Text size="sm" color="#B0B0B0">
                    {post.timestamp}
                  </Text>
                </div>
              </div>

              {/* Content */}
              <Text size="base" className="mb-4 leading-relaxed">
                {post.content}
              </Text>

              {/* Image (if exists) */}
              {post.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full object-cover"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Image
                    src={
                      post.liked ? "/icons/likeFilled.svg" : "/icons/like.svg"
                    }
                    alt="Like"
                    width={20}
                    height={20}
                  />
                  <Text
                    size="sm"
                    weight="600"
                    color={post.liked ? "#308FAB" : "#636363"}
                  >
                    {post.likes}
                  </Text>
                </button>

                <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <Image
                    src="/icons/comment.svg"
                    alt="Comment"
                    width={20}
                    height={20}
                  />
                  <Text size="sm" weight="600" color="#636363">
                    {post.comments}
                  </Text>
                </button>

                <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors ml-auto">
                  <Image
                    src="/icons/share.svg"
                    alt="Share"
                    width={20}
                    height={20}
                  />
                  <Text size="sm" weight="600" color="#636363">
                    Share
                  </Text>
                </button>
              </div>
            </div>
          ))}

          {/* Load More */}
          <div className="text-center py-6">
            <Button variant="secondary">Load More Posts</Button>
          </div>
        </div>

        {/* Empty State (if no posts) */}
        {posts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Title size="lg" className="mb-2 text-gray-700">
              No posts yet
            </Title>
            <Text size="base" color="#B0B0B0" className="mb-6">
              Be the first to share your fitness journey!
            </Text>
            <Button variant="primary">Create Post</Button>
          </div>
        )}
      </div>
    </div>
  );
}
