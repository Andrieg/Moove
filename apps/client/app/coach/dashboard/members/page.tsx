"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "../_components/ui/Card";
import { useToast } from "../_components/ui/Toast";
import MemberTable from "./_components/MemberTable";
import StatusFilter from "./_components/StatusFilter";
import { listMembers } from "@moove/api-client";
import type { Member } from "@moove/types";

export default function MembersPage() {
  const router = useRouter();
  const toast = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const data = await listMembers();
        setMembers(data);
      } catch (err) {
        console.error("Failed to load members:", err);
        toast.error("Failed to load members");
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, []);

  // Client-side filtering for search and status
  const filteredMembers = useMemo(() => {
    let result = members;

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.firstName?.toLowerCase().includes(searchLower) ||
          m.lastName?.toLowerCase().includes(searchLower) ||
          m.email?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter);
    }

    return result;
  }, [members, search, statusFilter]);

  const handleMemberClick = (member: Member) => {
    router.push(`/coach/dashboard/members/${member.id}`);
  };

  const handleMessage = (member: Member) => {
    toast.info("Messaging coming soon");
  };

  return (
    <div className="max-w-6xl">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        All Members ({filteredMembers.length})
      </h1>

      {/* Filters Row */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Members Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#308FAB] mx-auto mb-4"></div>
              <p className="text-slate-500">Loading members...</p>
            </div>
          </div>
        ) : (
          <MemberTable
            members={filteredMembers}
            onMemberClick={handleMemberClick}
            onMessage={handleMessage}
          />
        )}
      </Card>

      <toast.ToastContainer />
    </div>
  );
}
