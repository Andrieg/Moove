"use client";

import UploadDropzone from "./UploadDropzone";

interface HeroValue {
  coverImageUrl: string;
  title: string;
  description: string;
  about: string;
  trailerVideoUrl?: string;
}

interface HeroSectionProps {
  value: HeroValue;
  onChange: (value: HeroValue) => void;
  errors: Partial<Record<keyof HeroValue, string>>;
}

export default function HeroSection({ value, onChange, errors }: HeroSectionProps) {
  const updateField = <K extends keyof HeroValue>(field: K, fieldValue: HeroValue[K]) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Hero:</h2>
      
      {/* Cover Image */}
      <UploadDropzone
        type="image"
        label="Cover image"
        value={value.coverImageUrl}
        onChange={(url) => updateField("coverImageUrl", url)}
        subtext="If no image is provided, the first frame of the video will be used."
        error={errors.coverImageUrl}
        required
      />

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Enter your Hero Name"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.title ? "border-red-300" : "border-slate-200"
          } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description *
        </label>
        <input
          type="text"
          value={value.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Enter your Hero Name"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description ? "border-red-300" : "border-slate-200"
          } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* About */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          About *
        </label>
        <textarea
          value={value.about}
          onChange={(e) => updateField("about", e.target.value)}
          placeholder="Details about your brand"
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.about ? "border-red-300" : "border-slate-200"
          } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none`}
        />
        {errors.about && (
          <p className="text-sm text-red-500 mt-1">{errors.about}</p>
        )}
      </div>

      {/* Trailer Video */}
      <UploadDropzone
        type="video"
        label="Trailer video"
        value={value.trailerVideoUrl || ""}
        onChange={(url) => updateField("trailerVideoUrl", url)}
        subtext="We accept any and all video files, most commonly .mp4, .mov and .avi."
      />
    </div>
  );
}
