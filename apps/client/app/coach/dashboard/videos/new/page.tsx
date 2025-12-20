"use client";

import { useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "../../_components/ui/Button";
import { createVideo } from "@moove/api-client";
import { useToast } from "../../_components/ui/Toast";
import { uploadFile, isValidVideoFile, isValidImageFile } from "@/lib/upload";

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
  videoFile: string;
  coverImage: string;
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
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    maxLength: "45",
    videoFile: "",
    coverImage: "",
    targetArea: "full-body",
    fitnessGoal: "lose-weight",
    type: "strength",
    visibility: "draft",
    featured: true,
  });

  const handleVideoUpload = async (file: File) => {
    if (!isValidVideoFile(file)) {
      toast.error("Please upload a valid video file (MP4, MOV, or AVI)");
      return;
    }
    setIsUploadingVideo(true);
    try {
      const url = await uploadFile(file);
      setFormData({ ...formData, videoFile: url });
      toast.success("Video uploaded");
    } catch {
      toast.error("Failed to upload video");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!isValidImageFile(file)) {
      toast.error("Please upload a valid image file (PNG, JPG, or WebP)");
      return;
    }
    setIsUploadingImage(true);
    try {
      const url = await uploadFile(file);
      setFormData({ ...formData, coverImage: url });
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = useCallback(
    (type: "video" | "image") => (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        if (type === "video") handleVideoUpload(file);
        else handleImageUpload(file);
      }
    },
    [formData]
  );

  const handleFileClick = (type: "video" | "image") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "video" ? "video/mp4,video/mov,video/avi,video/quicktime" : "image/png,image/jpeg,image/webp";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (type === "video") handleVideoUpload(file);
        else handleImageUpload(file);
      }
    };
    input.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createVideo({
        title: formData.title,
        description: formData.description,
        durationSeconds: parseInt(formData.maxLength) * 60 || 0,
        category: formData.type,
        target: formData.targetArea,
        published: formData.visibility === "publish",
      });
      if (response.status === "SUCCESS") {
        toast.success("Class uploaded successfully!");
        setTimeout(() => router.push("/coach/dashboard/videos"), 1500);
      } else {
        toast.error("Failed to upload class");
      }
    } catch {
      toast.error("Failed to upload class");
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

        {/* Video File */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Video file *</label>
          {formData.videoFile ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
              <video src={formData.videoFile} className="w-full h-40 object-cover" controls />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, videoFile: "" })}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-slate-100 transition"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => handleFileClick("video")}
              onDrop={handleDrop("video")}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#308FAB] transition cursor-pointer"
            >
              {isUploadingVideo ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#308FAB] mb-2"></div>
                  <p className="text-sm text-slate-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600">
                    Drag your video, <span className="text-[#308FAB] font-medium">click to upload</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    We accept any and all video files, most commonly .mp4, .mov and .avi.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Cover image</label>
          {formData.coverImage ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <img src={formData.coverImage} alt="Cover" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: "" })}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-slate-100 transition"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => handleFileClick("image")}
              onDrop={handleDrop("image")}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#308FAB] transition cursor-pointer"
            >
              {isUploadingImage ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#308FAB] mb-2"></div>
                  <p className="text-sm text-slate-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600">
                    Drag your image here, or <span className="text-[#308FAB] font-medium">click to upload</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    If no image is provided, the first frame of the video will be used.
                  </p>
                </>
              )}
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
          {isLoading ? "UPLOADING..." : "UPLOAD CLASS"}
        </Button>
      </form>

      <toast.ToastContainer />
    </div>
  );
}
