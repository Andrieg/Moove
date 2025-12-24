"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../_components/ui/Card";
import Button from "../_components/ui/Button";
import Table from "../_components/ui/Table";
import Modal from "../_components/ui/Modal";
import { videosService } from "@/lib/supabase-services";
import { useToast } from "../_components/ui/Toast";

interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  category?: string;
  published: boolean;
  created_at: string;
}

export default function VideosPage() {
  const router = useRouter();
  const toast = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; video?: Video }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { loadVideos(); }, []);

  const loadVideos = async () => {
    try {
      const data = await videosService.getAll();
      setVideos(data);
    } catch (err) {
      console.error("Failed to load videos:", err);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.video) return;
    setIsDeleting(true);
    try {
      await videosService.delete(deleteModal.video.id);
      toast.success("Video deleted successfully!");
      setVideos((prev) => prev.filter((v) => v.id !== deleteModal.video?.id));
    } catch (err) {
      console.error("Failed to delete video:", err);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false });
    }
  };

  const filteredVideos = videos.filter((video) => video.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const columns = [
    {
      key: "title", header: "Title",
      render: (video: Video) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-10 bg-slate-200 rounded flex-shrink-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="font-medium text-slate-900">{video.title}</p>
        </div>
      ),
    },
    { key: "duration", header: "Duration", width: "100px", render: (video: Video) => <span>{Math.floor((video.duration_seconds || 0) / 60)} min</span> },
    {
      key: "status", header: "Status", width: "100px",
      render: (video: Video) => <span className={`px-2 py-1 text-xs rounded-full font-medium ${video.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{video.published ? "Published" : "Draft"}</span>,
    },
    {
      key: "actions", header: "Actions", width: "120px",
      render: (video: Video) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); router.push(`/coach/dashboard/videos/${video.id}`); }} className="p-2 hover:bg-slate-100 rounded transition" title="Edit">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ open: true, video }); }} className="p-2 hover:bg-red-50 rounded transition" title="Delete">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card padding="none">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-900">Videos</h1>
            <div className="relative">
              <input type="text" placeholder="Search videos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <span className="text-sm text-slate-500">{filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}</span>
          </div>
          <Button onClick={() => router.push("/coach/dashboard/videos/new")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Upload Video
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Table columns={columns} data={filteredVideos} onRowClick={(video) => router.push(`/coach/dashboard/videos/${video.id}`)} emptyMessage="No videos found. Upload your first video!" />
        )}
      </Card>
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false })} title="Delete Video" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Delete "{deleteModal.video?.title}"?</h4>
          <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</Button>
          </div>
        </div>
      </Modal>
      <toast.ToastContainer />
    </>
  );
}
