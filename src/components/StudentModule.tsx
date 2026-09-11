import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Student } from "../types";
import { api } from "../lib/api";

interface StudentModuleProps {
  students: Student[];
  onRefresh: () => void;
  onViewReportCard: (studentId: string) => void;
  onViewFeeStatement: (studentId: string) => void;
}

export const StudentModule: React.FC<StudentModuleProps> = ({
  students,
  onRefresh,
  onViewReportCard,
  onViewFeeStatement
}) => {
  const [search, setSearch] = useState("");
  const [selectedForm, setSelectedForm] = useState("All");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: "",
    gender: "Male",
    dob: "2008-05-15",
    form: "Form 3",
    stream: "East",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    emergencyContact: "",
    homeCounty: "Bomet",
    previousSchool: "",
    kcpeMarks: 360,
    medicalNotes: "None",
    termFeesDue: 18500,
    houseOrDorm: "Longonot House"
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredStudents = students.filter(s => {
    const matchForm = selectedForm === "All" || s.form === selectedForm;
    const matchStream = selectedStream === "All" || s.stream === selectedStream;
    const q = search.toLowerCase();
    const matchSearch = !search || 
      s.fullName.toLowerCase().includes(q) || 
      s.admissionNo.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.homeCounty.toLowerCase().includes(q);
    return matchForm && matchStream && matchSearch;
  });

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditOpen && selectedStudent) {
        await api.updateStudent(selectedStudent.id, formData);
        notify(`Updated record for ${formData.fullName}`);
      } else {
        await api.createStudent(formData);
        notify(`Registered new student ${formData.fullName}`);
      }
      setIsRegisterOpen(false);
      setIsEditOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (student: Student) => {
    if (!window.confirm(`Are you sure you want to promote ${student.fullName} from ${student.form} to the next academic level?`)) return;
    try {
      const res = await api.promoteStudent(student.id);
      notify(res.message);
      onRefresh();
      if (selectedStudent && selectedStudent.id === student.id) {
        setSelectedStudent(res.student);
      }
    } catch (err: any) {
      alert(err.message || "Promotion failed");
    }
  };

  const handleArchive = async (student: Student) => {
    if (!window.confirm(`Archive student record for ${student.fullName} (${student.admissionNo})?`)) return;
    try {
      await api.deleteStudent(student.id);
      notify(`Student record for ${student.fullName} archived.`);
      onRefresh();
      setSelectedStudent(null);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const openEdit = (s: Student) => {
    setSelectedStudent(s);
    setFormData(s);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>Student Management &amp; Enrollment</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Register, search, promote, and manage official student academic profiles across Forms 1 to 4.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              fullName: "",
              gender: "Male",
              dob: "2009-01-01",
              form: "Form 1",
              stream: "East",
              parentName: "",
              parentPhone: "+254 7",
              parentEmail: "",
              emergencyContact: "",
              homeCounty: "Bomet",
              previousSchool: "",
              kcpeMarks: 360,
              medicalNotes: "None",
              termFeesDue: 22500,
              houseOrDorm: "Longonot House"
            });
            setIsRegisterOpen(true);
          }}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, admission number, county, or guardian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="All">All Forms (Form 1 - 4)</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="All">All Streams</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="Central">Central</option>
          </select>
        </div>
      </div>

      {/* Student Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">
            Showing <strong className="text-slate-900">{filteredStudents.length}</strong> enrolled students
          </span>
          <span className="text-[11px] text-slate-400">Kaplong High School Student Roll</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="p-3">Adm No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class &amp; Stream</th>
                <th className="p-3">KCPE</th>
                <th className="p-3">County</th>
                <th className="p-3">Fee Status</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-slate-400">
                    No students matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const feeCleared = s.termFeesPaid >= s.termFeesDue;
                  const balance = Math.max(0, s.termFeesDue - s.termFeesPaid);
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition">
                      <td className="p-3 font-mono font-bold text-emerald-900">
                        {s.admissionNo}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{s.fullName}</div>
                        <div className="text-[11px] text-slate-500">{s.parentName} ({s.parentPhone})</div>
                      </td>
                      <td className="p-3 font-medium">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-sm">
                          {s.form} {s.stream}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-700">
                        {s.kcpeMarks || "360"}
                      </td>
                      <td className="p-3 text-slate-700">{s.homeCounty}</td>
                      <td className="p-3">
                        {feeCleared ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                            Cleared
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm font-mono">
                            Bal: KES {balance.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                          s.status === "Active" ? "bg-emerald-100 text-emerald-900" :
                          s.status === "Suspended" ? "bg-red-100 text-red-900" :
                          "bg-slate-200 text-slate-700"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            title="View Full Profile"
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(s)}
                            title="Edit Student Info"
                            className="p-1.5 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePromote(s)}
                            title="Promote to Next Form"
                            className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-md transition cursor-pointer"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleArchive(s)}
                            title="Archive / Delete"
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={selectedStudent.fullName}
                  className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover"
                />
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-emerald-200 font-mono">Adm No: {selectedStudent.admissionNo} &bull; {selectedStudent.form} {selectedStudent.stream}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[10px]">Gender &amp; DOB</span>
                  <strong className="text-slate-800">{selectedStudent.gender} &bull; {selectedStudent.dob}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[10px]">Home County</span>
                  <strong className="text-slate-800">{selectedStudent.homeCounty}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[10px]">KCPE Score</span>
                  <strong className="text-emerald-800 font-bold">{selectedStudent.kcpeMarks || "380"} / 500</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[10px]">House / Dormitory</span>
                  <strong className="text-slate-800">{selectedStudent.houseOrDorm || "Longonot"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[10px]">Admission Date</span>
                  <strong className="text-slate-800">{selectedStudent.admissionDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-semibold text-[10px]">Academic Status</span>
                  <strong className="text-emerald-800 uppercase">{selectedStudent.status}</strong>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-lg space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-950">
                  Parent / Guardian &amp; Emergency Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>Guardian: <strong>{selectedStudent.parentName}</strong></div>
                  <div>Phone: <strong>{selectedStudent.parentPhone}</strong></div>
                  <div>Email: <strong>{selectedStudent.parentEmail || "Not specified"}</strong></div>
                  <div>Emergency: <strong>{selectedStudent.emergencyContact}</strong></div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  Medical Notes: <span className="italic">{selectedStudent.medicalNotes || "No medical alerts logged"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onViewReportCard(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Official Report Card</span>
                  </button>
                  <button
                    onClick={() => {
                      onViewFeeStatement(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Fee Statement</span>
                  </button>
                </div>

                <button
                  onClick={() => openEdit(selectedStudent)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  Edit Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Registration / Edit Modal */}
      {(isRegisterOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 font-serif">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>{isEditOpen ? "Update Student Information" : "Register New Student (Form 1 - 4)"}</span>
              </h3>
              <button
                onClick={() => { setIsRegisterOpen(false); setIsEditOpen(false); }}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (as per Birth Cert)</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Kiprono Brian"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Form / Level</label>
                  <select
                    value={formData.form}
                    onChange={(e) => setFormData({ ...formData, form: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stream</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Home County</label>
                  <input
                    type="text"
                    value={formData.homeCounty}
                    onChange={(e) => setFormData({ ...formData, homeCounty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Bomet / Kericho"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KCPE Score</label>
                  <input
                    type="number"
                    value={formData.kcpeMarks}
                    onChange={(e) => setFormData({ ...formData, kcpeMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. 382"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">House / Dormitory</label>
                  <select
                    value={formData.houseOrDorm}
                    onChange={(e) => setFormData({ ...formData, houseOrDorm: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Longonot House">Longonot House</option>
                    <option value="Kilimanjaro House">Kilimanjaro House</option>
                    <option value="Menengai House">Menengai House</option>
                    <option value="Aberdares House">Aberdares House</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Mzee Wilson Langat"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Phone (SMS / Paybill)</label>
                  <input
                    type="text"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="+254 722 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical / Emergency Notes</label>
                <input
                  type="text"
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="e.g. Allergies, asthma, or none"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsRegisterOpen(false); setIsEditOpen(false); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : isEditOpen ? "Update Student" : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
