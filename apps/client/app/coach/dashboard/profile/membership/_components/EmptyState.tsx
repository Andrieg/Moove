"use client";

export default function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Empty document icon */}
      <div className="w-20 h-20 mb-6 text-slate-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="text-slate-600 text-center mb-2">You don't have any memberships</p>
      <button
        onClick={onAddClick}
        className="text-[#308FAB] hover:underline font-medium"
      >
        Please Add Membership
      </button>
    </div>
  );
}
