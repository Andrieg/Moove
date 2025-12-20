"use client";

interface StatusFilterProps {
  value: "all" | "active" | "inactive";
  onChange: (value: "all" | "active" | "inactive") => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "all" | "active" | "inactive")}
        className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] cursor-pointer min-w-[120px]"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
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
  );
}
