"use client";

import type { Challenge } from "@moove/types";

interface ChallengesTableProps {
  challenges: Challenge[];
  onRowClick?: (challenge: Challenge) => void;
  onMenuClick?: (challenge: Challenge, e: React.MouseEvent) => void;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }).replace(/\//g, ".");
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "started":
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Started</span>;
    case "scheduled":
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Scheduled</span>;
    case "completed":
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">Completed</span>;
    default:
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500">Draft</span>;
  }
}

export default function ChallengesTable({ challenges, onRowClick, onMenuClick }: ChallengesTableProps) {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
        <h3 className="text-lg font-medium text-slate-700 mb-1">No challenges yet</h3>
        <p className="text-sm text-slate-500">Create your first challenge to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Name
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Start
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                End
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Participants
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge) => (
            <tr
              key={challenge.id}
              onClick={() => onRowClick?.(challenge)}
              className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
            >
              {/* Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                    {challenge.coverImageUrl ? (
                      <img
                        src={challenge.coverImageUrl}
                        alt={challenge.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{challenge.title || "Untitled"}</p>
                    <p className="text-xs text-slate-400">{challenge.workouts?.length || 0} Workouts</p>
                  </div>
                </div>
              </td>
              
              {/* Status */}
              <td className="px-4 py-4">{getStatusBadge(challenge.status)}</td>
              
              {/* Start */}
              <td className="px-4 py-4 text-sm text-slate-600">{formatDate(challenge.startDate)}</td>
              
              {/* End */}
              <td className="px-4 py-4 text-sm text-slate-600">{formatDate(challenge.endDate)}</td>
              
              {/* Participants */}
              <td className="px-4 py-4 text-sm text-slate-600">{challenge.participantsCount || 0}</td>
              
              {/* Actions Menu */}
              <td className="px-4 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenuClick?.(challenge, e);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
