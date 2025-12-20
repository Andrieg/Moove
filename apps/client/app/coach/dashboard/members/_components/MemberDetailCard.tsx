"use client";

import type { Member } from "@moove/types";

interface MemberDetailCardProps {
  member: Member;
}

export default function MemberDetailCard({ member }: MemberDetailCardProps) {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || "Member";

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-4xl font-medium">
              {member.firstName?.[0] || "?"}
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">First name</label>
          <input
            type="text"
            value={member.firstName || ""}
            readOnly
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Last name</label>
          <input
            type="text"
            value={member.lastName || ""}
            readOnly
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">DOB</label>
          <div className="relative">
            <input
              type="text"
              value={member.dob ? new Date(member.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 pr-10"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
          <div className="relative">
            <input
              type="text"
              value={member.gender || ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 pr-10"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Fitness Goal */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fitness goal</label>
          <div className="relative">
            <input
              type="text"
              value={member.fitnessGoal || ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 pr-10"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            type="email"
            value={member.email || ""}
            readOnly
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
          <div className="relative">
            <input
              type="text"
              value={member.weightKg ? String(member.weightKg) : ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 pr-10"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
          <div className="relative">
            <input
              type="text"
              value={member.heightCm ? String(member.heightCm) : ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 pr-10"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
