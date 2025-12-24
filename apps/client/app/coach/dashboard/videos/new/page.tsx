"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "../../_components/ui/Button";
import { useToast } from "../../_components/ui/Toast";
import { videosService } from "@/lib/supabase-services";

const TARGET_AREAS = [
  { id: "upper-body", label: "Upper body" },
  { id: "full-body", label: "Full body" },
  { id: "core", label: "Core" },
  { id: "lower-body", label: "Lower body" },
];

const FITNESS_GOALS = [
  { id: "be-more-active", label: "Be more active" },
  { id: "lose-weight", label: "Lose weight" },
  { id: "stay-toned", label: "Stay toned" },
  { id: "build-muscle", label: "Build muscle" },
  { id: "reduce-stress", label: "Reduce stress" },
  { id: "improve-flexibility", label: "Improve flexibility" },
  { id: "increase-strength", label: "Increase strength" },
];

const TYPES = [
  { id: "cardio", label: "Cardio" },
  { id: "strength", label: "Strength" },
  { id: "calm", label: "Calm" },
];

const DURATION_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
];

interface FormData {
  title: string;
  description: string;
  maxLength: string;
  videoUrl: string;
  thumbnailUrl: string;
  targetArea: string;
  fitnessGoal: string;
  type: string;
  visibility: "draft" | "publish";
  featured: boolean;
}

export default function NewVideoPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    maxLength: "45",
    videoUrl: "",
    thumbnailUrl: "",
    targetArea: "full-body",
    fitnessGoal: "lose-weight",
    type: "strength",
    visibility: "draft",
    featured: true,
  });

  const validateUrl = (url: string, type: 'video' | 'image'): boolean => {
    try {
      new URL(url);
      if (type === 'video') {
        return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    if (!validateUrl(formData.videoUrl, 'video')) {
      toast.error("Please enter a valid YouTube or Vimeo URL");
      return;
    }

    if (formData.thumbnailUrl && !validateUrl(formData.thumbnailUrl, 'image')) {
      toast.error("Please enter a valid thumbnail URL");
      return;
    }

    setIsLoading(true);
    try {
      await videosService.create({
        title: formData.title,
        description: formData.description,
        video_url: formData.videoUrl,
        thumbnail_url: formData.thumbnailUrl || undefined,
        duration_seconds: parseInt(formData.maxLength) * 60 || 0,
        category: formData.type,
        target: formData.targetArea,
        fitness_goal: formData.fitnessGoal,
        published: formData.visibility === "publish",
        featured: formData.featured,
      });
      toast.success("Video created successfully!");
      setTimeout(() => router.push("/coach/dashboard/videos"), 1500);
    } catch (err) {
      console.error("Failed to create video:", err);
      toast.error("Failed to create video");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter your Class Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Details about your Class"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none"
          />
        </div>

        {/* Max Length */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Max length *</label>
          <div className="relative">
            <select
              value={formData.maxLength}
              onChange={(e) => setFormData({ ...formData, maxLength: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] bg-white appearance-none cursor-pointer"
            >
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Video URL *</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
          />
          <p className="text-xs text-slate-400 mt-1">
            Enter a YouTube or Vimeo video URL
          </p>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Thumbnail URL (Optional)</label>
          <input
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
          />
          <p className="text-xs text-slate-400 mt-1">
            If not provided, the video platform's default thumbnail will be used
          </p>
          {formData.thumbnailUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
              <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-40 object-cover" />
            </div>
          )}
        </div>

        {/* Target Area */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">Target area *</label>
          <div className="flex flex-wrap gap-2">
            {TARGET_AREAS.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => setFormData({ ...formData, targetArea: area.id })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  formData.targetArea === area.id
                    ? "bg-[#308FAB] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fitness Goal */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">Fitness goal *</label>
          <div className="flex flex-wrap gap-2">
            {FITNESS_GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setFormData({ ...formData, fitnessGoal: goal.id })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  formData.fitnessGoal === goal.id
                    ? "bg-[#308FAB] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">Type *</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.id })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  formData.type === t.id
                    ? "bg-[#308FAB] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">Visibility *</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={formData.visibility === "draft"}
                onChange={() => setFormData({ ...formData, visibility: "draft" })}
                className="w-4 h-4 text-[#308FAB] border-slate-300 focus:ring-[#308FAB]"
              />
              <span className="text-sm text-slate-600">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={formData.visibility === "publish"}
                onChange={() => setFormData({ ...formData, visibility: "publish" })}
                className="w-4 h-4 text-[#308FAB] border-slate-300 focus:ring-[#308FAB]"
              />
              <span className="text-sm text-slate-600">Publish</span>
            </label>
          </div>
        </div>

        {/* Additional - Featured */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">Additional</label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFormData({ ...formData, featured: !formData.featured })}
              className={`w-5 h-5 rounded flex items-center justify-center transition cursor-pointer ${
                formData.featured ? "bg-[#308FAB]" : "border-2 border-slate-300"
              }`}
            >
              {formData.featured && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-600">Featured</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} fullWidth size="lg">
          {isLoading ? "CREATING..." : "CREATE VIDEO"}
        </Button>
      </form>

      <toast.ToastContainer />
    </div>
  );
}
