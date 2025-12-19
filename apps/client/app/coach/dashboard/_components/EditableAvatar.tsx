"use client";

import Image from "next/image";

interface EditableAvatarProps {
  src?: string;
  alt?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  onEdit?: () => void;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export default function EditableAvatar({
  src,
  alt = "Avatar",
  placeholder = "?",
  size = "md",
  onEdit,
}: EditableAvatarProps) {
  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses[size]} rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200`}
      >
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : (
          <span className="text-slate-400 text-sm font-medium">{placeholder}</span>
        )}
      </div>
      <button
        onClick={onEdit}
        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition"
      >
        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>
  );
}
