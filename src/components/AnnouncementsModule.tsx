import React, { useState } from "react";
import { 
  Bell, 
  Send, 
  Smartphone, 
  Mail, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Filter,
  X
} from "lucide-react";
import { Announcement } from "../types";
import { api } from "../lib/api";

interface AnnouncementsModuleProps {
  announcements: Announcement[];
  onRefresh: () => void;
  currentRole: string;
}

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({
  announcements,
  onRefresh,
  currentRole
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Announcement Form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "Normal" as const,
    targetAudience: "All" as const,
    category: "General",
    author: "Chief Principal's Office"
  });

  // SMS Simulator Form
  const [smsData, setSmsData] = useState({
    targetGroup: "All Parents (Forms 1 - 4)",
    message: "Dear Parent/Guardian, Kaplong High School wishes to notify you that the Term 1 AGM & Academic Day is scheduled for Friday 25th April 2025 at 9:00 AM. Please clear all fee balances. Principal.",
    senderId: "KAPLONG_HS"
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createAnnouncement(formData);
      notify("Announcement posted successfully to selected school channels.");
      setIsCreateOpen(false);
      onRefresh();
    } catch (err: any) {
      alert("Failed to publish announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSmsOpen(false);
      notify(`Dispatched SMS broadcast to ${smsData.targetGroup} via Safaricom SMS Gateway!`);
    }, 1200);
  };

  const canPublish = currentRole === "super_admin" || currentRole === "principal" || currentRole === "deputy_principal" || currentRole === "bursar";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <span>School Communication &amp; Broadcast Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official announcements, circulars, and Safaricom SMS broadcasts to parents, staff, and students.
          </p>
        </div>
        
        {canPublish && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSmsOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Parent SMS</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Post Circular / Notice</span>
            </button>
          </div>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-sm font-bold uppercase text-[10px] ${
                  ann.priority === "Urgent" ? "bg-red-100 text-red-800" :
                  ann.priority === "Important" ? "bg-amber-100 text-amber-800" :
                  "bg-emerald-100 text-emerald-800"
                }`}>
                  {ann.priority} Priority
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {ann.date}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base font-serif">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{ann.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Audience: <strong className="text-emerald-900">{ann.targetAudience}</strong></span>
              <span>Issued By: <strong className="text-slate-700">{ann.author}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full my-auto p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-serif flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-800" />
                <span>Publish Official School Circular</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Form 4 KCSE Science Practical Briefing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="All">All (School-Wide)</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents / Guardians</option>
                    <option value="Teachers">Teaching Staff</option>
                    <option value="Form 4">Form 4 Candidates</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="Enter full details of the circular..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  {loading ? "Publishing..." : "Publish Circular"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMS Gateway Broadcast Simulator Modal */}
      {isSmsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full my-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-serif flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Kenyan Bulk SMS Gateway Simulator</span>
              </h3>
              <button onClick={() => setIsSmsOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="space-y-4 text-xs">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-emerald-700">Sender Alpha-Tag</span>
                  <span className="font-mono font-bold">{smsData.senderId}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-emerald-700">SMS Balance</span>
                  <span className="font-mono font-bold">14,280 Units</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Recipient Group</label>
                <select
                  value={smsData.targetGroup}
                  onChange={(e) => setSmsData({ ...smsData, targetGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="All Parents (Forms 1 - 4)">All Parents (Forms 1 - 4) &bull; ~1,250 Contacts</option>
                  <option value="Fee Defaulters Parents Only">Fee Defaulters Parents Only &bull; ~180 Contacts</option>
                  <option value="Form 4 Candidate Parents">Form 4 Candidate Parents &bull; ~280 Contacts</option>
                  <option value="All Teaching Faculty">All Teaching Faculty &bull; ~54 Contacts</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  SMS Text Message ({smsData.message.length}/160 Chars)
                </label>
                <textarea
                  required
                  rows={4}
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSmsOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Sending SMS..." : "Dispatch Broadcast"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
