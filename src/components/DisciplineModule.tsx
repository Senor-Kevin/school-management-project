import React, { useState } from "react";
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  User, 
  Calendar,
  Clock,
  HeartHandshake
} from "lucide-react";
import { DisciplineRecord, Student } from "../types";
import { api } from "../lib/api";

interface DisciplineModuleProps {
  records: DisciplineRecord[];
  students: Student[];
  onRefresh: () => void;
  currentRole: string;
}

export const DisciplineModule: React.FC<DisciplineModuleProps> = ({
  records,
  students,
  onRefresh,
  currentRole
}) => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: students[0]?.id || "",
    incidentDate: new Date().toISOString().split("T")[0],
    category: "Lateness & Prep Absence",
    description: "",
    actionTaken: "Guidance & Counseling Referral",
    status: "Open" as const,
    reportedBy: "Deputy Principal"
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredRecords = records.filter(r => {
    const matchStatus = selectedStatus === "All" || r.status === selectedStatus;
    const q = search.toLowerCase();
    const matchSearch = !search || 
      r.studentName.toLowerCase().includes(q) || 
      r.admissionNo.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.actionTaken.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createDisciplineRecord(formData);
      notify("Discipline incident recorded and forwarded to Deputy Principal's office.");
      setIsRecordModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert("Failed to log incident");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (record: DisciplineRecord, newStatus: "Open" | "Resolved" | "Under Counseling") => {
    try {
      await api.updateDisciplineRecord(record.id, { status: newStatus });
      notify(`Status updated to ${newStatus}`);
      onRefresh();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-800" />
            <span>Discipline, Behavior &amp; Guidance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official student conduct logs, corrective interventions, guidance &amp; counseling sessions, and parent summons.
          </p>
        </div>
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record Conduct Incident</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, admission number, category, or action taken..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold"
          >
            <option value="All">All Resolution States</option>
            <option value="Open">Open / Pending Action</option>
            <option value="Under Counseling">Under Counseling</option>
            <option value="Resolved">Resolved / Completed</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">
            Showing <strong className="text-slate-900">{filteredRecords.length}</strong> discipline incident logs
          </span>
          <span className="text-[11px] text-slate-400">Deputy Principal's Office Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="p-3">Date</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Action / Intervention</th>
                <th className="p-3">Reported By</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-slate-500 text-[11px]">{r.incidentDate}</td>
                  <td className="p-3 font-bold text-slate-900">
                    <div>{r.studentName}</div>
                    <div className="text-[10px] text-emerald-800 font-mono">{r.admissionNo} &bull; {r.form}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-sm font-medium">
                      {r.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs">{r.description}</td>
                  <td className="p-3 font-semibold text-slate-800">
                    <div className="flex items-center gap-1">
                      {r.actionTaken.includes("Counseling") && <HeartHandshake className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                      <span>{r.actionTaken}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{r.reportedBy}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                      r.status === "Resolved" ? "bg-emerald-100 text-emerald-900" :
                      r.status === "Under Counseling" ? "bg-blue-100 text-blue-900" :
                      "bg-amber-100 text-amber-900"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status !== "Resolved" && (
                        <button
                          onClick={() => handleUpdateStatus(r, "Resolved")}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                      {r.status === "Open" && (
                        <button
                          onClick={() => handleUpdateStatus(r, "Under Counseling")}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-2 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer"
                        >
                          Counseling
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Incident Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full my-auto p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-serif flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-800" />
                <span>Log Conduct Incident</span>
              </h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.admissionNo}) - {s.form} {s.stream}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Incident Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Lateness & Prep Absence">Lateness &amp; Prep Absence</option>
                    <option value="Uniform Infraction">Uniform Infraction</option>
                    <option value="Academic Dishonesty">Academic Dishonesty</option>
                    <option value="Insubordination">Insubordination</option>
                    <option value="Dormitory Misconduct">Dormitory Misconduct</option>
                    <option value="Bullying">Bullying</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Incident</label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="Provide precise factual details of the occurrence..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corrective Action / Intervention</label>
                <select
                  value={formData.actionTaken}
                  onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Guidance & Counseling Referral">Guidance &amp; Counseling Referral</option>
                  <option value="Verbal Caution & Written Apology">Verbal Caution &amp; Written Apology</option>
                  <option value="Official Parent Summons">Official Parent Summons</option>
                  <option value="School Compound Community Service">School Compound Community Service</option>
                  <option value="1-Week Suspension (Disciplinary Board)">1-Week Suspension (Disciplinary Board)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  {loading ? "Recording..." : "Log Incident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
