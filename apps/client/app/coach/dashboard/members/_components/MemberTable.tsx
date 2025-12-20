"use client";

import type { Member } from "@moove/types";
import MemberRow from "./MemberRow";

interface MemberTableProps {
  members: Member[];
  onMemberClick: (member: Member) => void;
  onMessage: (member: Member) => void;
}

export default function MemberTable({ members, onMemberClick, onMessage }: MemberTableProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-medium text-slate-700 mb-1">No members yet</h3>
        <p className="text-sm text-slate-500">Members who subscribe to your program will appear here.</p>
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
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Last activity
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Status
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th className="w-16"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onClick={() => onMemberClick(member)}
              onMessage={(e) => {
                e.stopPropagation();
                onMessage(member);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
