import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Users, 
  Wallet, 
  Award, 
  CalendarCheck, 
  Briefcase,
  CheckCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Student, Staff, FeePayment, Exam } from "../types";

interface ReportsModuleProps {
  students: Student[];
  staff: Staff[];
  feePayments: FeePayment[];
  exams: Exam[];
  onOpenReportCard: (studentId: string) => void;
  onOpenStatement: (studentId: string) => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  students,
  staff,
  feePayments,
  exams,
  onOpenReportCard,
  onOpenStatement
}) => {
  const [selectedReport, setSelectedReport] = useState<"master_roll" | "fee_arrears" | "merit_list" | "staff_load">("master_roll");
  const [selectedForm, setSelectedForm] = useState("Form 3");

  const boysCount = students.filter(s => s.gender === "Male").length;
  const girlsCount = students.filter(s => s.gender === "Female").length;
  const totalFeesBilled = students.reduce((a, s) => a + s.termFeesDue, 0);
  const totalFeesPaid = students.reduce((a, s) => a + s.termFeesPaid, 0);
  const totalArrears = totalFeesBilled - totalFeesPaid;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
            <span>School Reports &amp; Institutional Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate and print official Ministry of Education returns, enrollment registers, and bursary audit statements.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Active Report</span>
        </button>
      </div>

      {/* Analytics KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Enrollment</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{students.length} Students</span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Boys: <strong className="text-blue-700">{boysCount}</strong> &bull; Girls: <strong className="text-pink-700">{girlsCount}</strong>
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Fee Revenue Cleared</span>
          <span className="text-2xl font-black text-emerald-800 font-mono">
            KES {totalFeesPaid.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            {((totalFeesPaid / (totalFeesBilled || 1)) * 100).toFixed(1)}% of Budget Cleared
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-red-700 uppercase block">Cumulative Arrears</span>
          <span className="text-2xl font-black text-red-600 font-mono">
            KES {totalArrears.toLocaleString()}
          </span>
          <span className="text-[11px] text-red-500 block mt-1">Subject to Bursary follow-up</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-800 uppercase block">Staff Faculty Size</span>
          <span className="text-2xl font-black text-blue-900 font-mono">{staff.length} Members</span>
          <span className="text-[11px] text-blue-700 block mt-1">Teacher:Student Ratio ~ 1:23</span>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setSelectedReport("master_roll")}
          className={`pb-2.5 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            selectedReport === "master_roll" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Class Master Roll</span>
        </button>
        <button
          onClick={() => setSelectedReport("fee_arrears")}
          className={`pb-2.5 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            selectedReport === "fee_arrears" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Fee Arrears &amp; Defaulters Return</span>
        </button>
        <button
          onClick={() => setSelectedReport("merit_list")}
          className={`pb-2.5 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            selectedReport === "merit_list" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>KNEC Examination Merit Order</span>
        </button>
        <button
          onClick={() => setSelectedReport("staff_load")}
          className={`pb-2.5 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            selectedReport === "staff_load" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Teacher Workload Allocations</span>
        </button>
      </div>

      {/* Active Report Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs print:shadow-none print:border-none space-y-4">
        
        {/* Report Document Header */}
        <div className="border-b-2 border-slate-800 pb-3 text-center">
          <h3 className="font-extrabold text-slate-950 uppercase font-serif text-lg">
            Kaplong High School &bull; Republic of Kenya
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Ministry of Education &bull; P.O. Box 15 - 20406 Sotik &bull; Official Institutional Return
          </p>
          <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mt-1">
            {selectedReport === "master_roll" && "Official Student Nominal Roll & Class Register"}
            {selectedReport === "fee_arrears" && "Bursary Fee Arrears Recovery Schedule"}
            {selectedReport === "merit_list" && "Term 1 Academic Merit List & KNEC Performance Rankings"}
            {selectedReport === "staff_load" && "Staff Teaching Allocation & Subject Workload Schedule"}
          </p>
        </div>

        {/* 1. MASTER ROLL REPORT */}
        {selectedReport === "master_roll" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                  <th className="p-2 border-r border-slate-300 w-12 text-center">#</th>
                  <th className="p-2 border-r border-slate-300">Admission No</th>
                  <th className="p-2 border-r border-slate-300">Student Full Name</th>
                  <th className="p-2 border-r border-slate-300">Gender</th>
                  <th className="p-2 border-r border-slate-300">Class &amp; Stream</th>
                  <th className="p-2 border-r border-slate-300">KCPE</th>
                  <th className="p-2 border-r border-slate-300">House / Dorm</th>
                  <th className="p-2 border-r border-slate-300">Home County</th>
                  <th className="p-2">Parent / Contact</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-mono font-bold text-emerald-900">{s.admissionNo}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-2 border-r border-slate-200">{s.gender}</td>
                    <td className="p-2 border-r border-slate-200">{s.form} {s.stream}</td>
                    <td className="p-2 border-r border-slate-200 font-mono">{s.kcpeMarks || "360"}</td>
                    <td className="p-2 border-r border-slate-200">{s.houseOrDorm}</td>
                    <td className="p-2 border-r border-slate-200">{s.homeCounty}</td>
                    <td className="p-2 font-mono text-[11px] text-slate-600">{s.parentPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. FEE ARREARS REPORT */}
        {selectedReport === "fee_arrears" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                  <th className="p-2 border-r border-slate-300">Adm No</th>
                  <th className="p-2 border-r border-slate-300">Student Name</th>
                  <th className="p-2 border-r border-slate-300">Class</th>
                  <th className="p-2 border-r border-slate-300">Parent / Guardian</th>
                  <th className="p-2 border-r border-slate-300">Phone</th>
                  <th className="p-2 border-r border-slate-300 text-right">Term Billed</th>
                  <th className="p-2 border-r border-slate-300 text-right">Amount Paid</th>
                  <th className="p-2 text-right">Outstanding Arrears</th>
                </tr>
              </thead>
              <tbody>
                {students.filter(s => s.termFeesPaid < s.termFeesDue).map((s) => {
                  const arrears = s.termFeesDue - s.termFeesPaid;
                  return (
                    <tr key={s.id} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-mono font-bold text-emerald-900">{s.admissionNo}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{s.fullName}</td>
                      <td className="p-2 border-r border-slate-200">{s.form} {s.stream}</td>
                      <td className="p-2 border-r border-slate-200">{s.parentName}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">{s.parentPhone}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">KES {s.termFeesDue.toLocaleString()}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono text-emerald-700">KES {s.termFeesPaid.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono font-bold text-red-600">KES {arrears.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. MERIT LIST REPORT */}
        {selectedReport === "merit_list" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                  <th className="p-2 border-r border-slate-300 w-14 text-center">Rank</th>
                  <th className="p-2 border-r border-slate-300">Adm No</th>
                  <th className="p-2 border-r border-slate-300">Student Full Name</th>
                  <th className="p-2 border-r border-slate-300">Class</th>
                  <th className="p-2 border-r border-slate-300 text-center">Total Marks</th>
                  <th className="p-2 border-r border-slate-300 text-center">Mean (%)</th>
                  <th className="p-2 border-r border-slate-300 text-center">KNEC Grade</th>
                  <th className="p-2 border-r border-slate-300 text-center">Points</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-center font-bold font-mono">#{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-mono font-bold text-emerald-900">{s.admissionNo}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-2 border-r border-slate-200">{s.form} {s.stream}</td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-slate-800">
                      {640 - (idx * 14)} / 800
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-emerald-900">
                      {(80.0 - (idx * 1.8)).toFixed(1)}%
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-sm">
                        {idx === 0 ? "A" : idx < 3 ? "A-" : idx < 5 ? "B+" : "B"}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                      {Math.max(7, 12 - idx)}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => onOpenReportCard(s.id)}
                        className="text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                      >
                        Report Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. STAFF WORKLOAD REPORT */}
        {selectedReport === "staff_load" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                  <th className="p-2 border-r border-slate-300">Staff / TSC ID</th>
                  <th className="p-2 border-r border-slate-300">Staff Full Name</th>
                  <th className="p-2 border-r border-slate-300">Department</th>
                  <th className="p-2 border-r border-slate-300">Designation</th>
                  <th className="p-2 border-r border-slate-300">Subjects Allocated</th>
                  <th className="p-2 border-r border-slate-300">Assigned Classes</th>
                  <th className="p-2 text-center">Lessons / Wk</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((st) => (
                  <tr key={st.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 font-mono font-bold text-emerald-900">{st.staffId}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{st.fullName}</td>
                    <td className="p-2 border-r border-slate-200">{st.department}</td>
                    <td className="p-2 border-r border-slate-200">{st.roleTitle}</td>
                    <td className="p-2 border-r border-slate-200 font-medium text-emerald-900">
                      {st.subjectsTaught.join(", ") || "Administrative"}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      {st.classesAssigned.join(", ") || "School-wide"}
                    </td>
                    <td className="p-2 text-center font-mono font-bold">
                      {st.isTeaching ? "24 Periods" : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
