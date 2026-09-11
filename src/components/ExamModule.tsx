import React, { useState, useEffect } from "react";
import { 
  Award, 
  FileText, 
  Plus, 
  Search, 
  CheckCircle, 
  Printer, 
  TrendingUp, 
  Calculator,
  User,
  BookOpen,
  Filter
} from "lucide-react";
import { Exam, Student, Subject, ExamResult } from "../types";
import { api } from "../lib/api";

interface ExamModuleProps {
  exams: Exam[];
  students: Student[];
  subjects: Subject[];
  onRefresh: () => void;
  onOpenReportCard: (studentId: string) => void;
  currentRole: string;
  studentId?: string; // If logged in student
}

export const ExamModule: React.FC<ExamModuleProps> = ({
  exams,
  students,
  subjects,
  onRefresh,
  onOpenReportCard,
  currentRole,
  studentId
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || "");
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>("233"); // Chemistry default
  const [marksState, setMarksState] = useState<Record<string, number>>({});
  const [remarksState, setRemarksState] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isNewExamOpen, setIsNewExamOpen] = useState(false);
  const [newExamData, setNewExamData] = useState<Partial<Exam>>({
    title: "",
    type: "Mid-Term",
    term: "Term 1",
    year: 2025,
    form: "Form 3"
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Filter students by selected exam form
  const examStudents = students.filter(s => !selectedExam || s.form === selectedExam.form);

  const calculateKnec = (m: number) => {
    if (m >= 80) return { grade: "A", points: 12 };
    if (m >= 75) return { grade: "A-", points: 11 };
    if (m >= 70) return { grade: "B+", points: 10 };
    if (m >= 65) return { grade: "B", points: 9 };
    if (m >= 60) return { grade: "B-", points: 8 };
    if (m >= 55) return { grade: "C+", points: 7 };
    if (m >= 50) return { grade: "C", points: 6 };
    if (m >= 45) return { grade: "C-", points: 5 };
    if (m >= 40) return { grade: "D+", points: 4 };
    if (m >= 35) return { grade: "D", points: 3 };
    if (m >= 30) return { grade: "D-", points: 2 };
    return { grade: "E", points: 1 };
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    setMarksState(prev => ({ ...prev, [studentId]: num }));
  };

  const handleRemarkChange = (studentId: string, val: string) => {
    setRemarksState(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSaveMarks = async (student: Student) => {
    if (!selectedExam) return;
    setSavingId(student.id);
    const m = marksState[student.id] !== undefined ? marksState[student.id] : 75;
    const r = remarksState[student.id] || "Good work.";
    try {
      await api.enterMarks({
        examId: selectedExam.id,
        studentId: student.id,
        subjectCode: selectedSubjectCode,
        marks: m,
        teacherRemarks: r
      });
      notify(`Saved ${selectedSubjectCode} marks for ${student.fullName}`);
    } catch (err: any) {
      alert("Failed to save marks");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createExam(newExamData);
      notify(`Created new assessment: ${newExamData.title}`);
      setIsNewExamOpen(false);
      onRefresh();
    } catch (err) {
      alert("Failed to create exam");
    }
  };

  // Student / Parent Portal Restricted View
  if (currentRole === "student" || currentRole === "parent") {
    const activeStudentId = studentId || "stu_1";
    const targetStudent = students.find(s => s.id === activeStudentId) || students[0];

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Academic Performance &amp; KNEC Results</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized results portal for <strong className="text-slate-800">{targetStudent.fullName}</strong> ({targetStudent.admissionNo})
            </p>
          </div>
          <button
            onClick={() => onOpenReportCard(targetStudent.id)}
            className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Report Form (PDF)</span>
          </button>
        </div>

        {/* Quick Result Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <span className="text-xs font-semibold text-emerald-800 block">Overall Mean Grade</span>
            <span className="text-2xl font-black text-emerald-950 font-serif">A- (11.0 Pts)</span>
            <span className="text-[11px] text-emerald-700 block mt-1">Exemplary Performance</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <span className="text-xs font-semibold text-blue-800 block">Term 1 Mean Score</span>
            <span className="text-2xl font-black text-blue-950 font-mono">78.9%</span>
            <span className="text-[11px] text-blue-700 block mt-1">Class Rank: #2 / 45</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <span className="text-xs font-semibold text-amber-800 block">Top Subject</span>
            <span className="text-xl font-bold text-amber-950">Computer Studies</span>
            <span className="text-[11px] text-amber-700 font-mono block mt-1">88% (Grade A - 12 Pts)</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-xs font-semibold text-slate-600 block">KCSE Target Mean</span>
            <span className="text-2xl font-black text-slate-900 font-serif">A (Plain)</span>
            <span className="text-[11px] text-slate-500 block mt-1">On Track for Medicine / Eng</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Subject Breakdown - Term 1 Assessment</h3>
            <span className="text-xs text-slate-500 font-medium">8 Evaluated Subjects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Mathematics (121)</span>
                <span className="text-[11px] text-slate-500 block">Teacher: Ms. F. Chelagat</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-900">84%</span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-sm text-[10px] ml-2">A</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Chemistry (233)</span>
                <span className="text-[11px] text-slate-500 block">Teacher: Mr. P. Kipkemoi</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-900">81%</span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-sm text-[10px] ml-2">A</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">English (101)</span>
                <span className="text-[11px] text-slate-500 block">Teacher: Mrs. G. Koech</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-900">78%</span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-sm text-[10px] ml-2">A-</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Biology (231)</span>
                <span className="text-[11px] text-slate-500 block">Teacher: Mr. P. Kipkemoi</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-900">76%</span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-sm text-[10px] ml-2">A-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher / Administrator Full Grading Interface
  return (
    <div className="space-y-6">
      
      {/* Module Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-800" />
            <span>Examinations &amp; KCSE Grading Engine</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official KNEC 12-point grading scale (A to E), continuous assessment mark entry, and report slips.
          </p>
        </div>
        <button
          onClick={() => setIsNewExamOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Examination / CAT</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Control Selector Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select Examination</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.title} &bull; {e.term} {e.year} ({e.form})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subject Mark Entry</label>
          <select
            value={selectedSubjectCode}
            onChange={(e) => setSelectedSubjectCode(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
          >
            {subjects.map(sub => (
              <option key={sub.id} value={sub.code}>
                {sub.code} - {sub.name} ({sub.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Entry Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 bg-slate-50/50">
          <div>
            <span>Evaluating Form: <strong className="text-emerald-900">{selectedExam?.form}</strong></span>
            <span className="mx-2">&bull;</span>
            <span>Subject: <strong className="text-slate-900">{subjects.find(s => s.code === selectedSubjectCode)?.name} ({selectedSubjectCode})</strong></span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">KNEC Grade Points: A=12, A-=11, B+=10, B=9, B-=8, C+=7... E=1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                <th className="p-3 w-28">Adm No</th>
                <th className="p-3">Student Full Name</th>
                <th className="p-3 w-24">Class</th>
                <th className="p-3 w-28">Score (100%)</th>
                <th className="p-3 w-24">Grade</th>
                <th className="p-3 w-20">Points</th>
                <th className="p-3">Subject Teacher Remarks</th>
                <th className="p-3 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examStudents.map((student) => {
                // Determine mock initial marks
                const currentVal = marksState[student.id] !== undefined ? marksState[student.id] : 75;
                const { grade, points } = calculateKnec(currentVal);
                const currentRemark = remarksState[student.id] || "Consistent effort.";

                return (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition">
                    <td className="p-3 font-mono font-bold text-emerald-900">
                      {student.admissionNo}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="p-3 text-slate-600">
                      {student.form} {student.stream}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentVal}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded-md font-mono font-bold text-slate-900 text-center focus:ring-2 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-sm font-bold text-xs ${
                        grade.startsWith("A") ? "bg-emerald-100 text-emerald-900" :
                        grade.startsWith("B") ? "bg-blue-100 text-blue-900" :
                        grade.startsWith("C") ? "bg-amber-100 text-amber-900" :
                        "bg-red-100 text-red-900"
                      }`}>
                        {grade}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700">
                      {points}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={currentRemark}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        placeholder="Remarks..."
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-700"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSaveMarks(student)}
                          disabled={savingId === student.id}
                          className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer shadow-2xs"
                        >
                          {savingId === student.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => onOpenReportCard(student.id)}
                          title="Generate Report Slip"
                          className="p-1.5 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Exam Modal */}
      {isNewExamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full my-auto p-6">
            <h3 className="text-base font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-800" />
              <span>Create New Examination Session</span>
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Form 3 Term 1 End-Term Examination"
                  value={newExamData.title}
                  onChange={(e) => setNewExamData({ ...newExamData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assessment Type</label>
                  <select
                    value={newExamData.type}
                    onChange={(e) => setNewExamData({ ...newExamData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="CAT 1">CAT 1</option>
                    <option value="CAT 2">CAT 2</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="End-Term">End-Term</option>
                    <option value="KCSE Mock">KCSE Mock</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Form</label>
                  <select
                    value={newExamData.form}
                    onChange={(e) => setNewExamData({ ...newExamData, form: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewExamOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Schedule Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
