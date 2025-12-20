"use client";

import type { Member } from "@moove/types";

interface MemberRowProps {
  member: Member;
  onClick: () => void;
  onMessage: (e: React.MouseEvent) => void;
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function formatJoinDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `Joined ${date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`;
}

export default function MemberRow({ member, onClick, onMessage }: MemberRowProps) {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || "Unknown";
  
  return (
    <tr
      onClick={onClick}
      className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
    >
      {/* Name with Avatar */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
                {member.firstName?.[0] || "?"}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-slate-900">{fullName}</p>
            <p className="text-xs text-slate-400">{formatJoinDate(member.createdAt)}</p>
          </div>
        </div>
      </td>
      
      {/* Last Activity */}
      <td className="px-4 py-4 text-sm text-slate-600">
        {formatTimeAgo(member.lastActivityAt)}
      </td>
      
      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
            member.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {member.status === "active" ? "Active" : "Inactive"}
        </span>
      </td>
      
      {/* Action */}
      <td className="px-4 py-4">
        <button
          onClick={onMessage}
          className="p-2 text-slate-400 hover:text-[#308FAB] hover:bg-[#308FAB]/10 rounded-lg transition"
          title="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
