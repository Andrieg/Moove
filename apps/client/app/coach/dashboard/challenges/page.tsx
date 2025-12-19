"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../_components/ui/Card";
import Button from "../_components/ui/Button";
import Table from "../_components/ui/Table";
import Modal from "../_components/ui/Modal";
import { getChallenges, deleteChallenge } from "@moove/api-client";
import type { Challenge } from "@moove/types";
import { useToast } from "../_components/ui/Toast";

export default function ChallengesPage() {
  const router = useRouter();
  const toast = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; challenge?: Challenge }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { loadChallenges(); }, []);

  const loadChallenges = async () => {
    try { setChallenges(await getChallenges()); }
    catch { toast.error("Failed to load challenges"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteModal.challenge) return;
    setIsDeleting(true);
    try {
      await deleteChallenge(deleteModal.challenge.id);
      toast.success("Challenge deleted!");
      setChallenges((prev) => prev.filter((c) => c.id !== deleteModal.challenge?.id));
    } catch { toast.error("Failed to delete challenge"); }
    finally { setIsDeleting(false); setDeleteModal({ open: false }); }
  };

  const filteredChallenges = challenges.filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const columns = [
    {
      key: "title", header: "Challenge",
      render: (challenge: Challenge) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
          </div>
          <p className="font-medium text-slate-900">{challenge.title}</p>
        </div>
      ),
    },
    {
      key: "dates", header: "Duration",
      render: (c: Challenge) => <span className="text-slate-600">{c.startDate ? new Date(c.startDate).toLocaleDateString() : "--"} - {c.endDate ? new Date(c.endDate).toLocaleDateString() : "--"}</span>,
    },
    {
      key: "status", header: "Status", width: "100px",
      render: (c: Challenge) => {
        const now = new Date(), start = c.startDate ? new Date(c.startDate) : null, end = c.endDate ? new Date(c.endDate) : null;
        let status = "Draft", className = "bg-slate-100 text-slate-600";
        if (start && end) {
          if (now < start) { status = "Upcoming"; className = "bg-blue-100 text-blue-700"; }
          else if (now >= start && now <= end) { status = "Active"; className = "bg-green-100 text-green-700"; }
          else { status = "Ended"; className = "bg-slate-100 text-slate-600"; }
        }
        return <span className={`px-2 py-1 text-xs rounded-full font-medium ${className}`}>{status}</span>;
      },
    },
    {
      key: "actions", header: "Actions", width: "120px",
      render: (c: Challenge) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/challenges/${c.id}`); }} className="p-2 hover:bg-slate-100 rounded transition" title="Edit">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ open: true, challenge: c }); }} className="p-2 hover:bg-red-50 rounded transition" title="Delete">
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
            <h1 className="text-xl font-semibold text-slate-900">Challenges</h1>
            <div className="relative">
              <input type="text" placeholder="Search challenges..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#308FAB]/20 focus:border-[#308FAB]" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <span className="text-sm text-slate-500">{filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? "s" : ""}</span>
          </div>
          <Button onClick={() => router.push("/dashboard/challenges/new")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Challenge
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="inline-block w-8 h-8 border-4 border-[#308FAB] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <Table columns={columns} data={filteredChallenges} onRowClick={(c) => router.push(`/dashboard/challenges/${c.id}`)} emptyMessage="No challenges found. Create your first challenge!" />
        )}
      </Card>
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false })} title="Delete Challenge" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Delete "{deleteModal.challenge?.title}"?</h4>
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
