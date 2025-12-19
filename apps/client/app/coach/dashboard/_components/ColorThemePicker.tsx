"use client";

// Extended color themes with more options
const colorThemes = [
  // Row 1
  { id: "teal", color: "#308FAB" },
  { id: "cyan", color: "#06B6D4" },
  { id: "sky", color: "#0EA5E9" },
  { id: "blue", color: "#3B82F6" },
  { id: "indigo", color: "#6366F1" },
  { id: "violet", color: "#8B5CF6" },
  { id: "purple", color: "#A855F7" },
  { id: "fuchsia", color: "#D946EF" },
  // Row 2
  { id: "pink", color: "#EC4899" },
  { id: "rose", color: "#F43F5E" },
  { id: "red", color: "#EF4444" },
  { id: "orange", color: "#F97316" },
  { id: "amber", color: "#F59E0B" },
  { id: "yellow", color: "#EAB308" },
  { id: "lime", color: "#84CC16" },
  { id: "green", color: "#22C55E" },
  // Row 3
  { id: "emerald", color: "#10B981" },
  { id: "teal2", color: "#14B8A6" },
  { id: "slate", color: "#64748B" },
  { id: "gray", color: "#6B7280" },
  { id: "zinc", color: "#71717A" },
  { id: "neutral", color: "#737373" },
  { id: "stone", color: "#78716C" },
  { id: "brown", color: "#92400E" },
];

interface ColorThemePickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorThemePicker({ value, onChange }: ColorThemePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">Color Theme</label>
      <div className="grid grid-cols-8 gap-2">
        {colorThemes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.color)}
            className={`relative w-10 h-10 rounded-lg transition-all ${
              value === theme.color
                ? "ring-2 ring-offset-2 ring-slate-400"
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: theme.color }}
          >
            {value === theme.color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
