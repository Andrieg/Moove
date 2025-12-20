"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "../../_components/ui/Button";
import { useToast } from "../../_components/ui/Toast";
import MemberDetailCard from "../_components/MemberDetailCard";
import { getMember } from "@moove/api-client";
import type { Member } from "@moove/types";

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const memberId = params.memberId as string;

  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      if (!memberId) return;
      setIsLoading(true);
      try {
        const data = await getMember(memberId);
        setMember(data);
      } catch (err) {
        console.error("Failed to load member:", err);
        toast.error("Failed to load member details");
      } finally {
        setIsLoading(false);
      }
    };
    loadMember();
  }, [memberId]);

  const handleMessage = () => {
    toast.info("Messaging coming soon");
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#308FAB] mx-auto mb-4"></div>
            <p className="text-slate-500">Loading member...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-700 mb-1">Member not found</h3>
          <p className="text-sm text-slate-500 mb-4">The member you're looking for doesn't exist.</p>
          <Button variant="outline" onClick={() => router.push("/coach/dashboard/members")}>
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  const firstName = member.firstName || "Member";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <button
        onClick={() => router.push("/coach/dashboard/members")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Back to members</span>
      </button>

      {/* Welcome Header */}
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">
        Welcome {firstName}!
      </h1>

      {/* Member Detail Card */}
      <MemberDetailCard member={member} />

      {/* Message Button */}
      <div className="mt-8">
        <Button onClick={handleMessage} fullWidth size="lg">
          MESSAGE
        </Button>
      </div>

      <toast.ToastContainer />
    </div>
  );
}
