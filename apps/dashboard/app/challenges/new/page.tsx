"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../_components/layout/DashboardLayout";
import Card from "../../_components/ui/Card";
import Button from "../../_components/ui/Button";

export default function NewChallengePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "daily",
    visibility: "public",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement challenge creation API call
      console.log("Creating challenge:", formData);
      
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("Challenge created successfully!");
      router.push("/challenges");
    } catch (err) {
      alert("Failed to create challenge");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <Card>
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Challenge Details</h2>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Challenge Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 30 Day Strength Challenge"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what participants will achieve..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB] resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date *
                </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Challenge Type
              </label>
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

            {/* Cover Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-[#308FAB] transition cursor-pointer">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-600 mb-2">Drop your image here or click to browse</p>
                <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Visibility
              </label>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Challenge"}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
