"use client";

import { useState, useEffect, FormEvent, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "../../_components/ui/Button";
import Modal from "../../_components/ui/Modal";
import { getVideoById, updateVideo, deleteVideo } from "@moove/api-client";
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

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    featured: false,
  });

  useEffect(() => {
    getVideoById(id)
      .then((video) => {
        if (video) {
          const v = video as any;
          setFormData({
            title: video.title || "",
            description: v.description || "",
            maxLength: String(Math.floor((video.durationSeconds || 0) / 60)) || "45",
            videoFile: v.videoUrl || "",
            coverImage: video.thumbnailUrl || "",
            targetArea: v.target || "full-body",
            fitnessGoal: v.fitnessGoal || "lose-weight",
            type: v.category || v.type || "strength",
            visibility: video.published ? "publish" : "draft",
            featured: v.featured || false,
          });
        }
      })
      .catch(() => toast.error("Failed to load video"))
      .finally(() => setIsLoading(false));
  }, [id]);

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

    setIsSaving(true);
    try {
      await updateVideo(
        {
          id,
          title: formData.title,
          description: formData.description,
          durationSeconds: parseInt(formData.maxLength) * 60 || 0,
          category: formData.type,
          target: formData.targetArea,
          published: formData.visibility === "publish",
          thumbnailUrl: formData.coverImage,
          videoUrl: formData.videoFile,
          fitnessGoal: formData.fitnessGoal,
          featured: formData.featured,
        },
        ["title", "description", "durationSeconds", "category", "target", "published", "thumbnailUrl", "videoUrl", "fitnessGoal", "featured"]
      );
      toast.success("Class updated successfully!");
      setTimeout(() => router.push("/coach/dashboard/videos"), 1500);
    } catch {
      toast.error("Failed to update class");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVideo(id);
      toast.success("Class deleted!");
      setTimeout(() => router.push("/coach/dashboard/videos"), 1500);
    } catch {
      toast.error("Failed to delete class");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#308FAB] mx-auto mb-4"></div>
          <p className="text-slate-500">Loading class...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/coach/dashboard/videos")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to library</span>
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

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
        <Button type="submit" disabled={isSaving} fullWidth size="lg">
          {isSaving ? "SAVING..." : "SAVE CHANGES"}
        </Button>
      </form>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Class" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h4>
          <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The class will be permanently deleted.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Class"}
            </Button>
          </div>
        </div>
      </Modal>

      <toast.ToastContainer />
    </div>
  );
}
