"use client";

import { useState } from "react";
import Image from "next/image";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

type PostType = "text" | "completed" | "poll";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Comment {
  id: string;
  user: { name: string; avatar?: string };
  text: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  type: PostType;
  user: { name: string; avatar?: string };
  content?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  liked?: boolean;
  // For completed posts
  workout?: { title: string; duration: number };
  // For poll posts
  poll?: { question: string; options: PollOption[]; endsIn: string; voted?: string };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      type: "completed",
      user: { name: "Sarah Johnson" },
      workout: { title: "Cardio Blast", duration: 45 },
      likes: 1892,
      comments: [
        { id: "c1", user: { name: "Mike Chen" }, text: "Amazing work! 🔥", timestamp: "2h ago", likes: 12 },
      ],
      timestamp: "Just now",
      liked: false,
    },
    {
      id: "2",
      type: "poll",
      user: { name: "Coach Emma" },
      poll: {
        question: "What challenge do you want next?",
        options: [
          { id: "1", text: "Abs Challenge", votes: 156 },
          { id: "2", text: "Water Challenge", votes: 98 },
          { id: "3", text: "Step Challenge", votes: 45 },
        ],
        endsIn: "6 days left",
      },
      likes: 324,
      comments: [],
      timestamp: "4 hours ago",
      liked: true,
    },
    {
      id: "3",
      type: "text",
      user: { name: "Mike Chen" },
      content: "Week 2 of HIIT training complete! The progress is real. Who else is doing this challenge? 💪",
      likes: 18,
      comments: [],
      timestamp: "5 hours ago",
      liked: false,
    },
    {
      id: "4",
      type: "completed",
      user: { name: "Laura Martinez" },
      workout: { title: "Yoga Flow", duration: 30 },
      likes: 76,
      comments: [],
      timestamp: "1 day ago",
      liked: false,
    },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "posts" | "workouts" | "polls">("all");

  const toggleLike = (postId: string) => {
    setPosts(posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts(posts.map((post) => {
      if (post.id === postId && post.poll && !post.poll.voted) {
        return {
          ...post,
          poll: {
            ...post.poll,
            voted: optionId,
            options: post.poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          },
        };
      }
      return post;
    }));
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      type: "text",
      user: { name: "You" },
      content: newPostText,
      likes: 0,
      comments: [],
      timestamp: "Just now",
      liked: false,
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "posts") return post.type === "text";
    if (filter === "workouts") return post.type === "completed";
    if (filter === "polls") return post.type === "poll";
    return true;
  });

  const getTotalVotes = (options: PollOption[]) => options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["all", "posts", "workouts", "polls"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === f
                    ? "bg-[#308FAB]/20 text-[#308FAB]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="primary" size="small" onClick={() => setShowCreateModal(true)}>
            Post
          </Button>
        </div>

        {/* Create Post Input */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white font-bold flex-shrink-0">
              U
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share your fitness journey..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#308FAB] focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 resize-none"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#308FAB] transition">
                <Image src="/icons/image.svg" alt="Image" width={20} height={20} />
                <Text size="sm" weight="500">Photo</Text>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#308FAB] transition">
                <Image src="/icons/poll.svg" alt="Poll" width={20} height={20} />
                <Text size="sm" weight="500">Poll</Text>
              </button>
            </div>
            <Button variant="primary" size="small" onClick={handlePost} disabled={!newPostText.trim()}>
              Post
            </Button>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white font-bold">
                  {post.user.name[0]}
                </div>
                <div className="flex-1">
                  <Title size="base" weight="600">{post.user.name}</Title>
                  <Text size="sm" color="#B0B0B0">{post.timestamp}</Text>
                </div>
                {post.type === "completed" && (
                  <Button variant="primary" size="small">START CLASS</Button>
                )}
              </div>

              {/* Post Body */}
              <div className="p-4">
                {/* Completed Card */}
                {post.type === "completed" && post.workout && (
                  <div className="relative rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] h-64 flex flex-col items-center justify-center">
                    <Title size="2xl" weight="700" className="text-white mb-2">Completed</Title>
                    <Title size="xl" weight="500" className="text-white/90 mb-3">{post.workout.title}</Title>
                    <div className="flex items-center gap-2 text-white/80">
                      <Image src="/icons/clockWhite.svg" alt="Duration" width={16} height={16} />
                      <Text size="base" className="text-white">{post.workout.duration} min</Text>
                    </div>
                  </div>
                )}

                {/* Poll */}
                {post.type === "poll" && post.poll && (
                  <div className="mb-4">
                    <Title size="lg" weight="600" className="text-center mb-6">{post.poll.question}</Title>
                    <div className="space-y-3">
                      {post.poll.options.map((option) => {
                        const totalVotes = getTotalVotes(post.poll!.options);
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isVoted = post.poll?.voted === option.id;

                        return (
                          <button
                            key={option.id}
                            onClick={() => votePoll(post.id, option.id)}
                            disabled={!!post.poll?.voted}
                            className={`w-full relative overflow-hidden rounded-lg p-3 text-left transition ${
                              post.poll?.voted
                                ? "cursor-default"
                                : "hover:bg-[#308FAB]/5 cursor-pointer"
                            } ${isVoted ? "ring-2 ring-[#308FAB]" : "bg-gray-50"}`}
                          >
                            {/* Progress Bar */}
                            {post.poll?.voted && (
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-[#429FBA]/20 to-[#217E9A]/20 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            )}
                            <div className="relative flex justify-between items-center">
                              <Text size="base" weight={isVoted ? "600" : "500"}>{option.text}</Text>
                              {post.poll?.voted && (
                                <Text size="sm" weight="600" color="#308FAB">{percentage}%</Text>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <Text size="sm" color="#B0B0B0" className="text-center mt-4">{post.poll.endsIn}</Text>
                  </div>
                )}

                {/* Text Content */}
                {post.type === "text" && post.content && (
                  <Text size="base" className="leading-relaxed">{post.content}</Text>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Image
                    src={post.liked ? "/icons/likeFilled.svg" : "/icons/like.svg"}
                    alt="Like"
                    width={20}
                    height={20}
                  />
                  <Text size="sm" weight="600" color={post.liked ? "#308FAB" : "#636363"}>
                    {post.likes.toLocaleString()}
                  </Text>
                </button>

                <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <Image src="/icons/comment.svg" alt="Comment" width={20} height={20} />
                  <Text size="sm" weight="600" color="#636363">{post.comments.length}</Text>
                </button>

                <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors ml-auto">
                  <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
                </button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#429FBA] to-[#217E9A] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {comment.user.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl px-3 py-2">
                          <Text size="sm" weight="600" color="#308FAB">{comment.user.name}</Text>
                          <Text size="sm">{comment.text}</Text>
                        </div>
                        <div className="flex gap-4 mt-1 px-2">
                          <Text size="xs" color="#B0B0B0">{comment.timestamp}</Text>
                          <button className="text-xs font-semibold text-gray-500 hover:text-[#308FAB]">Like</button>
                          <button className="text-xs font-semibold text-gray-500 hover:text-[#308FAB]">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Comment Input */}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20"
                    />
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                      <Image src="/icons/send.svg" alt="Send" width={18} height={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center py-6">
              <Button variant="transparent">Load More Posts</Button>
            </div>
          )}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Image src="/icons/community.svg" alt="Community" width={28} height={28} className="opacity-50" />
              </div>
              <Title size="lg" className="mb-2 text-gray-700">No posts yet</Title>
              <Text size="base" color="#B0B0B0" className="mb-6">
                Be the first to share your fitness journey!
              </Text>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Post</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
