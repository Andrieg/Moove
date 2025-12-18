"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../_components/layout/DashboardLayout";
import Card from "../_components/ui/Card";
import Button from "../_components/ui/Button";
import Table from "../_components/ui/Table";
import { getChallenges } from "@moove/api-client";
import type { Challenge } from "@moove/types";

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .finally(() => setLoading(false));
  }, []);

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "title",
      header: "Challenge",
      render: (challenge: Challenge) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-900">{challenge.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Duration",
      render: (challenge: Challenge) => {
        const start = challenge.startDate ? new Date(challenge.startDate).toLocaleDateString() : "--";
        const end = challenge.endDate ? new Date(challenge.endDate).toLocaleDateString() : "--";
        return <span className="text-slate-600">{start} - {end}</span>;
      },
    },
    {
      key: "participants",
      header: "Participants",
      width: "120px",
      render: () => (
        <span className="text-slate-600">{Math.floor(Math.random() * 200) + 50}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "100px",
      render: (challenge: Challenge) => {
        const now = new Date();
        const start = challenge.startDate ? new Date(challenge.startDate) : null;
        const end = challenge.endDate ? new Date(challenge.endDate) : null;
        
        let status = "Draft";
        let className = "bg-slate-100 text-slate-600";
        
        if (start && end) {
          if (now < start) {
            status = "Upcoming";
            className = "bg-blue-100 text-blue-700";
          } else if (now >= start && now <= end) {
            status = "Active";
            className = "bg-green-100 text-green-700";
          } else {
            status = "Ended";
            className = "bg-slate-100 text-slate-600";
          }
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${className}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "120px",
      render: (challenge: Challenge) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/challenges/${challenge.id}`);
            }}
            className="p-2 hover:bg-slate-100 rounded transition"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete handler
            }}
            className="p-2 hover:bg-red-50 rounded transition"
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card padding="none">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">
              {filteredChallenges.length} challenges
            </span>
          </div>
          <Button onClick={() => router.push("/challenges/new")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Challenge
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-slate-500">Loading challenges...</p>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredChallenges}
            onRowClick={(challenge) => router.push(`/challenges/${challenge.id}`)}
            emptyMessage="No challenges found. Create your first challenge!"
          />
        )}
      </Card>
    </DashboardLayout>
  );
}
