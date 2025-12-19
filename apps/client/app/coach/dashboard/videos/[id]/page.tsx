"use client";

import { useState, useEffect, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";
import Modal from "../../_components/ui/Modal";
import { getVideoById, updateVideo, deleteVideo } from "@moove/api-client";
import { useToast } from "../../_components/ui/Toast";

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", durationSeconds: 0, category: "", target: "full-body", published: false });

  useEffect(() => {
    getVideoById(id).then((video) => {
      if (video) setFormData({ title: video.title || "", description: (video as any).description || "", durationSeconds: video.durationSeconds || 0, category: (video as any).category || "", target: (video as any).target || "full-body", published: video.published || false });
    }).catch(() => toast.error("Failed to load video")).finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateVideo({ id, ...formData }, Object.keys(formData));
      toast.success("Video updated!");
      setTimeout(() => router.push("/coach/dashboard/videos"), 1500);
    } catch { toast.error("Failed to update video"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVideo(id);
      toast.success("Video deleted!");
      setTimeout(() => router.push("/coach/dashboard/videos"), 1500);
    } catch { toast.error("Failed to delete video"); }
    finally { setIsDeleting(false); setShowDeleteModal(false); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Video</h1>
        </div>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Delete
        </Button>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Video Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
              <input type="number" value={Math.floor(formData.durationSeconds / 60)} onChange={(e) => setFormData({ ...formData, durationSeconds: parseInt(e.target.value) * 60 })} min="1" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] bg-white">
                <option value="">Select category</option>
                <option value="HIIT">HIIT</option>
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Yoga">Yoga</option>
                <option value="Pilates">Pilates</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Area</label>
            <div className="flex flex-wrap gap-2">
              {["full-body", "upper-body", "lower-body", "core", "arms", "legs"].map((target) => (
                <button key={target} type="button" onClick={() => setFormData({ ...formData, target })} className={`px-4 py-2 rounded-full text-sm font-medium transition ${formData.target === target ? "bg-[#308FAB] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {target.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-[#308FAB] focus:ring-[#308FAB]" />
              <span className="text-sm font-medium text-slate-700">Published</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Video" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h4>
          <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete Video"}</Button>
          </div>
        </div>
      </Modal>
      <toast.ToastContainer />
    </div>
  );
}
