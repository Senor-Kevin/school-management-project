import React, { useState } from "react";
import { 
  Briefcase, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Award,
  CheckCircle,
  X,
  Clock
} from "lucide-react";
import { Staff } from "../types";
import { api } from "../lib/api";

interface StaffModuleProps {
  staff: Staff[];
  onRefresh: () => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({ staff, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Staff>>({
    fullName: "",
    gender: "Male",
    phone: "+254 7",
    email: "",
    department: "Sciences",
    subjectsTaught: ["Chemistry"],
    classesAssigned: ["Form 3 East"],
    employmentStatus: "Active",
    qualification: "B.Ed Science",
    roleTitle: "Subject Teacher",
    isTeaching: true
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredStaff = staff.filter(s => {
    const matchDept = selectedDept === "All" || s.department === selectedDept;
    const matchType = selectedType === "all" || (selectedType === "teaching" ? s.isTeaching : !s.isTeaching);
    const q = search.toLowerCase();
    const matchSearch = !search || 
      s.fullName.toLowerCase().includes(q) || 
      s.staffId.toLowerCase().includes(q) || 
      s.department.toLowerCase().includes(q) ||
      s.roleTitle.toLowerCase().includes(q);
    return matchDept && matchType && matchSearch;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && selectedStaff) {
        await api.updateStaff(selectedStaff.id, formData);
        notify(`Updated details for ${formData.fullName}`);
      } else {
        await api.createStaff(formData);
        notify(`Added new staff member ${formData.fullName}`);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (s: Staff) => {
    if (!window.confirm(`Are you sure you want to remove staff member ${s.fullName}?`)) return;
    try {
      await api.deleteStaff(s.id);
      notify(`Staff record for ${s.fullName} removed.`);
      onRefresh();
      setSelectedStaff(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const openCreate = () => {
    setFormData({
      fullName: "",
      gender: "Male",
      phone: "+254 7",
      email: "",
      department: "Mathematics",
      subjectsTaught: ["Mathematics"],
      classesAssigned: ["Form 1 East"],
      employmentStatus: "Active",
      qualification: "B.Ed (Kenyatta University)",
      roleTitle: "Assistant Teacher",
      isTeaching: true
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEdit = (s: Staff) => {
    setSelectedStaff(s);
    setFormData(s);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-800" />
            <span>Staff &amp; Teacher Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain TSC records, subject combinations, assigned classes, and non-teaching support personnel.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
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
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by staff name, TSC number, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="All">All Departments</option>
            <option value="Sciences">Sciences</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Languages">Languages</option>
            <option value="Humanities">Humanities</option>
            <option value="Technical & Applied">Technical &amp; Applied</option>
            <option value="Administration">Administration</option>
            <option value="Support Staff">Support Staff</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">Teaching &amp; Non-Teaching</option>
            <option value="teaching">Teaching Faculty (TSC)</option>
            <option value="non-teaching">Non-Teaching Staff</option>
          </select>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm font-serif">
                    {s.fullName.replace("Mr. ", "").replace("Mrs. ", "").replace("Ms. ", "").charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{s.fullName}</h3>
                    <p className="text-[11px] text-emerald-800 font-mono font-medium">{s.staffId}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                  s.isTeaching ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}>
                  {s.isTeaching ? "Teaching" : "Support"}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>{s.roleTitle}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Dept: <strong className="text-slate-700">{s.department}</strong>
                </div>
                {s.subjectsTaught.length > 0 && (
                  <div className="text-[11px] text-slate-600">
                    Subjects: <span className="font-medium text-emerald-900">{s.subjectsTaught.join(", ")}</span>
                  </div>
                )}
                {s.classesAssigned.length > 0 && (
                  <div className="text-[11px] text-slate-600">
                    Classes: <span className="font-medium text-slate-800">{s.classesAssigned.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                {s.phone}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition cursor-pointer"
                  title="Edit Staff"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full my-auto overflow-hidden">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 font-serif">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>{isEdit ? "Update Staff Information" : "Register Staff Member"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name with Title</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Mr. Peter Kipkemoi"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Staff / TSC ID</label>
                  <input
                    type="text"
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. TSC/512984"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="+254 711 000 000"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="teacher@kaplonghigh.sc.ke"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Technical & Applied">Technical &amp; Applied</option>
                    <option value="Administration">Administration</option>
                    <option value="Support Staff">Support Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation / Role Title</label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Head of Sciences / Form 3 Teacher"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subjects Taught (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.subjectsTaught?.join(", ")}
                    onChange={(e) => setFormData({ ...formData, subjectsTaught: e.target.value.split(",").map(x => x.trim()) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Chemistry, Physics"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Classes</label>
                  <input
                    type="text"
                    value={formData.classesAssigned?.join(", ")}
                    onChange={(e) => setFormData({ ...formData, classesAssigned: e.target.value.split(",").map(x => x.trim()) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Form 3 East, Form 4 Central"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic &amp; Professional Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="e.g. B.Ed Science (Egerton University)"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : isEdit ? "Update Staff" : "Add to Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
