"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";
import { createVideo } from "@moove/api-client";
import { useToast } from "../../_components/ui/Toast";

export default function NewVideoPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", category: "", target: "full-body", published: false });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createVideo({ title: formData.title, description: formData.description, durationSeconds: parseInt(formData.duration) * 60 || 0, category: formData.category, target: formData.target, published: formData.published });
      if (response.status === "SUCCESS") { toast.success("Video created!"); setTimeout(() => router.push("/dashboard/videos"), 1500); }
      else toast.error("Failed to create video");
    } catch { toast.error("Failed to create video"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">Upload Video</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Video Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter video title" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter video description" rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="30" min="1" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Video File</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-[#308FAB] transition cursor-pointer">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-slate-600 mb-2">Drop your video here or click to browse</p>
              <p className="text-slate-400 text-sm">MP4, MOV up to 2GB</p>
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-[#308FAB] focus:ring-[#308FAB]" />
              <span className="text-sm font-medium text-slate-700">Publish immediately</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Video"}</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
      <toast.ToastContainer />
    </div>
  );
}
