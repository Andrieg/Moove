"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "../../_components/ui/Button";
import { useToast } from "../../_components/ui/Toast";
import CoverImageDropzone from "../_components/CoverImageDropzone";
import WorkoutsList from "../_components/WorkoutsList";
import AddVideoDrawer from "../_components/AddVideoDrawer";
import { challengesService } from "@/lib/supabase-services";

interface ChallengeWorkoutItem {
  id: string;
  title: string;
  durationMinutes?: number;
}

interface FormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImageUrl: string;
  workouts: ChallengeWorkoutItem[];
}

interface FormErrors {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverImageUrl?: string;
}

export default function NewChallengePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    coverImageUrl: "",
    workouts: [],
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (!formData.coverImageUrl) {
      newErrors.coverImageUrl = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const challenge = await challengesService.create({
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        cover_image_url: formData.coverImageUrl,
        status: "scheduled",
      });

      if (formData.workouts.length > 0) {
        const videoIds = formData.workouts.map(w => w.id);
        await challengesService.addVideos(challenge.id, videoIds);
      }

      toast.success("Challenge created successfully!");
      setTimeout(() => router.push("/coach/dashboard/challenges"), 1500);
    } catch (err) {
      console.error("Failed to create challenge:", err);
      toast.error("Failed to create challenge");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideos = (videos: ChallengeWorkoutItem[]) => {
    setFormData({
      ...formData,
      workouts: [...formData.workouts, ...videos],
    });
  };

  const handleRemoveWorkout = (id: string) => {
    setFormData({
      ...formData,
      workouts: formData.workouts.filter((w) => w.id !== id),
    });
  };

  // Format date for input
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <button
        onClick={() => router.push("/coach/dashboard/challenges")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Back to challenges</span>
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">
        Add New Challenge
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter your Class Name"
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
          <label className="block text-sm font-medium text-slate-400 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Details about your Class"
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.description ? "border-red-300" : "border-slate-200"
            } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none`}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Start *</label>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(formData.startDate)}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.startDate ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
            />
          </div>
          {errors.startDate && (
            <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">End *</label>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(formData.endDate)}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.endDate ? "border-red-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]`}
            />
          </div>
          {errors.endDate && (
            <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>
          )}
        </div>

        {/* Cover Image */}
        <CoverImageDropzone
          value={formData.coverImageUrl}
          onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
          error={errors.coverImageUrl}
        />

        {/* Workouts */}
        <WorkoutsList
          workouts={formData.workouts}
          onRemove={handleRemoveWorkout}
          onAddClick={() => setShowDrawer(true)}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} fullWidth size="lg">
          {isLoading ? "CREATING..." : "ADD CHALLENGE"}
        </Button>
      </form>

      {/* Add Video Drawer */}
      <AddVideoDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onAdd={handleAddVideos}
        existingIds={formData.workouts.map((w) => w.id)}
      />

      <toast.ToastContainer />
    </div>
  );
}
