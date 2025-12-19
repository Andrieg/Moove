"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";
import { createChallenge } from "@moove/api-client";
import { useToast } from "../../_components/ui/Toast";

export default function NewChallengePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", startDate: "", endDate: "", type: "daily", visibility: "public" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createChallenge({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        type: formData.type,
        visibility: formData.visibility,
      });
      if (response.status === "SUCCESS") { toast.success("Challenge created!"); setTimeout(() => router.push("/coach/dashboard/challenges"), 1500); }
      else toast.error("Failed to create challenge");
    } catch { toast.error("Failed to create challenge"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">Create Challenge</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Challenge Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Challenge Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., 30 Day Strength Challenge" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what participants will achieve..." rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date *</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Challenge Type</label>
            <div className="flex flex-wrap gap-2">
              {[{ value: "daily", label: "Daily Workout" }, { value: "weekly", label: "Weekly Goals" }, { value: "steps", label: "Step Challenge" }, { value: "streak", label: "Streak Challenge" }].map((type) => (
                <button key={type.value} type="button" onClick={() => setFormData({ ...formData, type: type.value })} className={`px-4 py-2 rounded-full text-sm font-medium transition ${formData.type === type.value ? "bg-[#308FAB] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
            <div className="flex gap-4">
              {["public", "members", "invite"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="visibility" value={v} checked={formData.visibility === v} onChange={(e) => setFormData({ ...formData, visibility: e.target.value })} className="w-4 h-4 text-[#308FAB] focus:ring-[#308FAB]" />
                  <span className="text-sm text-slate-700 capitalize">{v === "members" ? "Members Only" : v === "invite" ? "Invite Only" : "Public"}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Challenge"}</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
      <toast.ToastContainer />
    </div>
  );
}
