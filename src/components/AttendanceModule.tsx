import React, { useState } from "react";
import { 
  CalendarCheck, 
  Check, 
  X as XIcon, 
  Clock, 
  AlertCircle, 
  Search, 
  CheckCircle,
  Users,
  Filter,
  BarChart2
} from "lucide-react";
import { Student, AttendanceRecord } from "../types";
import { api } from "../lib/api";

interface AttendanceModuleProps {
  students: Student[];
  records: AttendanceRecord[];
  onRefresh: () => void;
  currentRole: string;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  records,
  onRefresh,
  currentRole
}) => {
  const [selectedDate, setSelectedDate] = useState("2025-04-11");
  const [selectedForm, setSelectedForm] = useState("Form 3");
  const [selectedStream, setSelectedStream] = useState("East");
  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent" | "Late" | "Excused">>({});
  const [reasonState, setReasonState] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const classStudents = students.filter(s => s.form === selectedForm && s.stream === selectedStream);

  const markAll = (status: "Present" | "Absent" | "Late" | "Excused") => {
    const updated: Record<string, any> = {};
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceState(prev => ({ ...prev, ...updated }));
  };

  const setStudentStatus = (studentId: string, status: "Present" | "Absent" | "Late" | "Excused") => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      // Save for each student
      for (const student of classStudents) {
        const status = attendanceState[student.id] || "Present";
        const reason = reasonState[student.id] || "";
        await api.recordAttendance({
          date: selectedDate,
          studentId: student.id,
          status,
          reason,
          recordedBy: "Teacher On Duty"
        });
      }
      notify(`Attendance roster saved for ${selectedForm} ${selectedStream} on ${selectedDate}`);
      onRefresh();
    } catch (err) {
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = classStudents.filter(s => (attendanceState[s.id] || "Present") === "Present").length;
  const attendanceRate = classStudents.length > 0 ? ((presentCount / classStudents.length) * 100).toFixed(0) : "100";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-800" />
            <span>Daily Attendance &amp; Roll-Call</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official Kenyan class registry for morning and evening roll-calls with reason logging.
          </p>
        </div>
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? "Saving Roster..." : "Save Daily Roll-Call"}</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Selector & Quick Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select Form</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
          >
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select Stream</label>
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
          >
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="Central">Central</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Roll-Call Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="sm:col-span-3 flex gap-2">
          <button
            type="button"
            onClick={() => markAll("Present")}
            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-2 rounded-lg text-xs font-bold cursor-pointer transition"
          >
            All Present
          </button>
          <button
            type="button"
            onClick={() => markAll("Absent")}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 py-2 rounded-lg text-xs font-bold cursor-pointer transition"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Class Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-slate-500 text-[11px] block">Class Enrollment</span>
          <span className="text-xl font-bold text-slate-900">{classStudents.length} Students</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-emerald-700 text-[11px] block font-semibold">Present Today</span>
          <span className="text-xl font-bold text-emerald-900">{presentCount} Present</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-red-700 text-[11px] block font-semibold">Absent / Excused</span>
          <span className="text-xl font-bold text-red-900">{classStudents.length - presentCount} Absent</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-blue-700 text-[11px] block font-semibold">Attendance Rate</span>
          <span className="text-xl font-bold text-blue-900">{attendanceRate}%</span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Roll Call &bull; {selectedForm} {selectedStream} &bull; {selectedDate}
          </span>
          <span className="text-slate-500 text-[11px]">Click status pill to toggle student attendance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="p-3 w-28">Adm No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Status Toggles</th>
                <th className="p-3">Reason / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map(s => {
                const currentStatus = attendanceState[s.id] || "Present";
                return (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-emerald-900">{s.admissionNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-400">{s.houseOrDorm}</div>
                    </td>
                    <td className="p-3">
                      <div className="inline-flex rounded-md shadow-2xs border border-slate-200 overflow-hidden text-[11px]">
                        <button
                          type="button"
                          onClick={() => setStudentStatus(s.id, "Present")}
                          className={`px-3 py-1 font-semibold transition cursor-pointer ${
                            currentStatus === "Present"
                              ? "bg-emerald-700 text-white"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentStatus(s.id, "Absent")}
                          className={`px-3 py-1 font-semibold transition cursor-pointer ${
                            currentStatus === "Absent"
                              ? "bg-red-600 text-white"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentStatus(s.id, "Late")}
                          className={`px-3 py-1 font-semibold transition cursor-pointer ${
                            currentStatus === "Late"
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentStatus(s.id, "Excused")}
                          className={`px-3 py-1 font-semibold transition cursor-pointer ${
                            currentStatus === "Excused"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="e.g. In Sanatorium, Sick sheet, School trip..."
                        value={reasonState[s.id] || ""}
                        onChange={(e) => setReasonState({ ...reasonState, [s.id]: e.target.value })}
                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
