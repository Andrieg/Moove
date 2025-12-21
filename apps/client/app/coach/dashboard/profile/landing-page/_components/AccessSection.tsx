"use client";

import UploadDropzone from "./UploadDropzone";

interface AccessValue {
  coverImageUrl: string;
  title: string;
  description: string;
  showReviews: boolean;
  showMembership: boolean;
}

interface AccessSectionProps {
  value: AccessValue;
  onChange: (value: AccessValue) => void;
  errors: Partial<Record<keyof AccessValue, string>>;
}

export default function AccessSection({ value, onChange, errors }: AccessSectionProps) {
  const updateField = <K extends keyof AccessValue>(field: K, fieldValue: AccessValue[K]) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Access:</h2>
      
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
          placeholder="Enter Title"
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
        <textarea
          value={value.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Details about your Access"
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description ? "border-red-300" : "border-slate-200"
          } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none`}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Membership Toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Membership
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="showMembership"
              checked={value.showMembership === true}
              onChange={() => updateField("showMembership", true)}
              className="w-4 h-4 text-[#308FAB] border-slate-300 focus:ring-[#308FAB]"
            />
            <span className="text-sm text-slate-700">Show</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="showMembership"
              checked={value.showMembership === false}
              onChange={() => updateField("showMembership", false)}
              className="w-4 h-4 text-[#308FAB] border-slate-300 focus:ring-[#308FAB]"
            />
            <span className="text-sm text-slate-700">Hide</span>
          </label>
        </div>
      </div>
    </div>
  );
}
