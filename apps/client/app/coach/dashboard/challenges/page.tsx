"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "../_components/ui/Card";
import Button from "../_components/ui/Button";
import { useToast } from "../_components/ui/Toast";
import ChallengesTable from "./_components/ChallengesTable";
import { challengesService } from "@/lib/supabase-services";

type ChallengeStatus = 'all' | 'scheduled' | 'started' | 'completed';

interface Challenge {
  id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'started' | 'completed';
  start_date?: string;
  end_date?: string;
  cover_image_url?: string;
  created_at: string;
}

export default function ChallengesPage() {
  const router = useRouter();
  const toast = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus>("all");

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await challengesService.getAll();
      setChallenges(data);
    } catch (err) {
      console.error("Failed to load challenges:", err);
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = useMemo(() => {
    let result = challenges;

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((c) =>
        c.title?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [challenges, search, statusFilter]);

  const handleRowClick = (challenge: Challenge) => {
    router.push(`/coach/dashboard/challenges/${challenge.id}`);
  };

  const handleMenuClick = (challenge: Challenge, e: React.MouseEvent) => {
    // Placeholder for context menu
    toast.info("Actions menu coming soon");
  };

  return (
    <div className="max-w-6xl">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] text-sm"
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

      {/* Title and Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          All Challenges ({filteredChallenges.length})
        </h1>

        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ChallengeStatus)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] cursor-pointer min-w-[130px]"
            >
              <option value="all">All</option>
              <option value="started">Started</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
            <svg
              className="absolute right-3 top-[34px] w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Add New Button */}
          <div className="pt-5">
            <Button onClick={() => router.push("/coach/dashboard/challenges/new")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ADD NEW CHALLENGE
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#308FAB] mx-auto mb-4"></div>
              <p className="text-slate-500">Loading challenges...</p>
            </div>
          </div>
        ) : (
          <ChallengesTable
            challenges={filteredChallenges}
            onRowClick={handleRowClick}
            onMenuClick={handleMenuClick}
          />
        )}
      </Card>

      <toast.ToastContainer />
    </div>
  );
}
