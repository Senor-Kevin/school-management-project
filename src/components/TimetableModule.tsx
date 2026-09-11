import React, { useState } from "react";
import { 
  Clock, 
  Calendar, 
  Printer, 
  BookOpen, 
  Users, 
  CheckCircle,
  Filter
} from "lucide-react";
import { TimetableSlot, Subject } from "../types";

interface TimetableModuleProps {
  slots: TimetableSlot[];
  subjects: Subject[];
  currentRole: string;
}

export const TimetableModule: React.FC<TimetableModuleProps> = ({
  slots,
  subjects,
  currentRole
}) => {
  const [selectedForm, setSelectedForm] = useState("Form 3");
  const [selectedStream, setSelectedStream] = useState("East");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const periods = [
    { no: 1, time: "08:00 - 08:40", isBreak: false, label: "Period 1" },
    { no: 2, time: "08:40 - 09:20", isBreak: false, label: "Period 2" },
    { no: 3, time: "09:20 - 10:00", isBreak: false, label: "Period 3" },
    { no: 0, time: "10:00 - 10:40", isBreak: true, label: "Morning Break / Tea" },
    { no: 4, time: "10:40 - 11:20", isBreak: false, label: "Period 4" },
    { no: 5, time: "11:20 - 12:00", isBreak: false, label: "Period 5" },
    { no: 6, time: "12:00 - 12:40", isBreak: false, label: "Period 6" },
    { no: 0, time: "12:40 - 14:00", isBreak: true, label: "Lunch & Rest" },
    { no: 7, time: "14:00 - 14:40", isBreak: false, label: "Period 7" },
    { no: 8, time: "14:40 - 15:20", isBreak: false, label: "Period 8" },
    { no: 0, time: "15:20 - 16:30", isBreak: true, label: "Games & Clubs" },
  ];

  // Default subject schedule generator for realistic view
  const getSlot = (day: string, periodNo: number) => {
    const found = slots.find(s => s.form === selectedForm && s.stream === selectedStream && s.day === day && s.periodNumber === periodNo);
    if (found) return found;

    // Fallback schedule pattern
    const mockSchedule: Record<number, { name: string; teacher: string; room: string }> = {
      1: { name: "Mathematics", teacher: "Ms. F. Chelagat", room: "Room 14" },
      2: { name: "English", teacher: "Mrs. G. Koech", room: "Room 14" },
      3: { name: "Chemistry", teacher: "Mr. P. Kipkemoi", room: "Science Lab 1" },
      4: { name: "Biology", teacher: "Mr. P. Kipkemoi", room: "Bio Lab" },
      5: { name: "Kiswahili", teacher: "Mrs. G. Koech", room: "Room 14" },
      6: { name: "Physics", teacher: "Mr. B. Mutai", room: "Physics Lab" },
      7: { name: "History / CRE", teacher: "Mr. D. Sang", room: "Room 14" },
      8: { name: "Computer / Agri", teacher: "Mr. B. Mutai", room: "Comp Lab" },
    };

    return {
      id: `${day}_${periodNo}`,
      form: selectedForm,
      stream: selectedStream,
      day,
      periodNumber: periodNo,
      startTime: "",
      endTime: "",
      subjectName: mockSchedule[periodNo]?.name || "Prep",
      teacherName: mockSchedule[periodNo]?.teacher || "Staff",
      room: mockSchedule[periodNo]?.room || "Main Class"
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-800" />
            <span>Master Timetable &amp; Bell Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official Kenyan secondary 8-period teaching schedule with laboratory, games, and tea break allocations.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Class Timetable</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Class:</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
          >
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Stream:</label>
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
          >
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="Central">Central</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium ml-auto">
          Term 1 2025 &bull; Form Teacher: <strong className="text-slate-800">Mr. Peter Kipkemoi</strong>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-white font-bold">
                <th className="p-3 border-r border-emerald-900 w-28 text-left">Period / Time</th>
                {days.map(day => (
                  <th key={day} className="p-3 border-r border-emerald-900 min-w-[120px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p, idx) => {
                if (p.isBreak) {
                  return (
                    <tr key={`break_${idx}`} className="bg-amber-50/80 border-b border-amber-200 text-amber-950 font-bold">
                      <td className="p-2 text-left font-mono text-[11px] bg-amber-100/80 border-r border-amber-200">
                        {p.time}
                      </td>
                      <td colSpan={5} className="p-2 tracking-widest uppercase text-[11px] text-amber-900">
                        &bull;&bull;&bull; {p.label} &bull;&bull;&bull;
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`period_${p.no}`} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3 text-left border-r border-slate-200 bg-slate-50 font-medium">
                      <div className="font-bold text-slate-900">{p.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.time}</div>
                    </td>

                    {days.map(day => {
                      const slot = getSlot(day, p.no);
                      return (
                        <td key={`${day}_${p.no}`} className="p-2.5 border-r border-slate-200 align-top text-left">
                          <div className="font-bold text-slate-900 text-xs">{slot.subjectName}</div>
                          <div className="text-[10px] text-emerald-800 font-medium">{slot.teacherName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{slot.room}</div>
                        </td>
                      );
                    })}
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
