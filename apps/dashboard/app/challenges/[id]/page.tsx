"use client";

import { useState, useEffect, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../_components/layout/DashboardLayout";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";
import { getChallengeById, updateChallenge, deleteChallenge } from "@moove/api-client";
import type { Challenge } from "@moove/types";
import Modal from "../../_components/ui/Modal";
import { useToast } from "../../_components/ui/Toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditChallengePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "daily",
    visibility: "public",
  });

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    try {
      const challenge = await getChallengeById(id);
      if (challenge) {
        setFormData({
          title: challenge.title || "",
          description: (challenge as any).description || "",
          startDate: challenge.startDate ? new Date(challenge.startDate).toISOString().split("T")[0] : "",
          endDate: challenge.endDate ? new Date(challenge.endDate).toISOString().split("T")[0] : "",
          type: (challenge as any).type || "daily",
          visibility: (challenge as any).visibility || "public",
        });
      }
    } catch (err) {
      toast.error("Failed to load challenge");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const challengeData = {
        id,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        type: formData.type,
        visibility: formData.visibility,
      };

      await updateChallenge(challengeData, Object.keys(formData));
      toast.success("Challenge updated successfully!");
      setTimeout(() => router.push("/challenges"), 1500);
    } catch (err) {
      toast.error("Failed to update challenge");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChallenge(id);
      toast.success("Challenge deleted successfully!");
      setTimeout(() => router.push("/challenges"), 1500);
    } catch (err) {
      toast.error("Failed to delete challenge");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-slate-500">Loading challenge...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Challenge</h1>
          </div>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Challenge Details</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter challenge title"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter challenge description"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                />
              </div>
            </div>

            {/* Challenge Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Challenge Type</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "daily", label: "Daily Workout" },
                  { value: "weekly", label: "Weekly Goals" },
                  { value: "steps", label: "Step Challenge" },
                  { value: "streak", label: "Streak Challenge" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      formData.type === type.value
                        ? "bg-[#308FAB] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">Public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="members"
                    checked={formData.visibility === "members"}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">Members Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="invite"
                    checked={formData.visibility === "invite"}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]"
                  />
                  <span className="text-sm text-slate-700">Invite Only</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Challenge"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h4>
          <p className="text-sm text-slate-500 mb-6">
            This action cannot be undone. The challenge and all participant data will be permanently deleted.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Challenge"}
            </Button>
          </div>
        </div>
      </Modal>

      <toast.ToastContainer />
    </DashboardLayout>
  );
}
