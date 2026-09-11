import React from "react";
import { 
  Users, 
  GraduationCap, 
  Wallet, 
  CalendarCheck, 
  Award, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  Smartphone, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Briefcase
} from "lucide-react";
import { User, Student, Staff, FeePayment, Exam, Announcement } from "../types";

interface DashboardOverviewProps {
  user: User;
  students: Student[];
  staff: Staff[];
  feePayments: FeePayment[];
  exams: Exam[];
  announcements: Announcement[];
  onNavigate: (module: string) => void;
  onOpenReportCard: (studentId: string) => void;
  onOpenFeeStatement: (studentId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  students,
  staff,
  feePayments,
  exams,
  announcements,
  onNavigate,
  onOpenReportCard,
  onOpenFeeStatement
}) => {
  const role = user.role;

  // Global calculations
  const totalBilled = students.reduce((acc, s) => acc + s.termFeesDue, 0);
  const totalPaid = students.reduce((acc, s) => acc + s.termFeesPaid, 0);
  const totalDebt = Math.max(0, totalBilled - totalPaid);
  const myStudent = students[0]; // For student & parent views

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800/70 border border-emerald-600/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <span>Kaplong High School &bull; Term 1 Academic Session 2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {role === "super_admin" && "Super Administrator Console. Complete operational control over academic registries, finance modules, and system security."}
            {role === "principal" && "Chief Principal's Executive Dashboard. High-level KPI monitoring over institutional academic means, fee collections, and TSC staff governance."}
            {role === "deputy_principal" && "Deputy Principal's Office. Student behavioral discipline, daily attendance roll-calls, class schedules, and teacher rosters."}
            {role === "bursar" && "Bursary & Accounts Directorate. Reconcile Safaricom M-Pesa Paybill entries, fee defaulters, and official receipts."}
            {role === "teacher" && "Faculty Portal. Record student continuous assessment test marks, conduct daily roll-calls, and access your 8-period teaching timetable."}
            {role === "student" && "Student Portal. Access your Term 1 academic progress report form, class timetable, and fee statement clearance status."}
            {role === "parent" && "Parent & Guardian Gateway. Monitor your student's KNEC scores, attendance records, school circulars, and M-Pesa fee payments."}
          </p>
        </div>
      </div>

      {/* 1. SUPER ADMIN / PRINCIPAL METRICS */}
      {(role === "super_admin" || role === "principal") && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate("students")}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Total Students</span>
              <Users className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">{students.length}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">Active Enrollment &bull; Forms 1-4</div>
          </div>

          <div 
            onClick={() => onNavigate("staff")}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Teaching Faculty</span>
              <Briefcase className="w-4 h-4 text-blue-800" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">{staff.length}</div>
            <div className="text-[11px] text-blue-700 font-medium mt-1">TSC Staff &bull; 100% Deployed</div>
          </div>

          <div 
            onClick={() => onNavigate("finance")}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Fee Collection</span>
              <Wallet className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              KES {totalPaid.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Collection: {((totalPaid / (totalBilled || 1)) * 100).toFixed(0)}%
            </div>
          </div>

          <div 
            onClick={() => onNavigate("exams")}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Projected KCSE Mean</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">9.42 B+</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Target 9.8 A- &bull; Form 4</div>
          </div>
        </div>
      )}

      {/* 2. DEPUTY PRINCIPAL METRICS */}
      {role === "deputy_principal" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => onNavigate("attendance")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Today's Attendance</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">96.8%</span>
            <span className="text-[11px] text-emerald-600 block mt-1">Morning Roll-Call Reconciled</span>
          </div>
          <div onClick={() => onNavigate("discipline")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Discipline Logs</span>
            <span className="text-2xl font-black text-amber-600 font-mono">2 Open</span>
            <span className="text-[11px] text-slate-500 block mt-1">Referred to Guidance</span>
          </div>
          <div onClick={() => onNavigate("timetable")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Daily Schedule</span>
            <span className="text-2xl font-black text-slate-900 font-mono">8 Periods</span>
            <span className="text-[11px] text-slate-500 block mt-1">All Labs Active</span>
          </div>
          <div onClick={() => onNavigate("staff")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Teachers on Duty</span>
            <span className="text-2xl font-black text-blue-900 font-mono">3 Staff</span>
            <span className="text-[11px] text-slate-500 block mt-1">Week 6 Supervision</span>
          </div>
        </div>
      )}

      {/* 3. BURSAR METRICS */}
      {role === "bursar" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => onNavigate("finance")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Term Collections</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">KES {totalPaid.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-600 block mt-1">M-Pesa &amp; Equity Bank</span>
          </div>
          <div onClick={() => onNavigate("finance")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Fee Arrears</span>
            <span className="text-2xl font-black text-red-600 font-mono">KES {totalDebt.toLocaleString()}</span>
            <span className="text-[11px] text-red-500 block mt-1">Active Debt Follow-up</span>
          </div>
          <div onClick={() => onNavigate("finance")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Today's Transactions</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{feePayments.length} Rec</span>
            <span className="text-[11px] text-slate-500 block mt-1">All Receipts Logged</span>
          </div>
          <div onClick={() => onNavigate("announcements")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Parent SMS Reminders</span>
            <span className="text-2xl font-black text-blue-900 font-mono">Sent</span>
            <span className="text-[11px] text-blue-600 block mt-1">Paybill: 522123</span>
          </div>
        </div>
      )}

      {/* 4. TEACHER METRICS */}
      {role === "teacher" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => onNavigate("timetable")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Lessons Today</span>
            <span className="text-2xl font-black text-emerald-900 font-mono">4 Periods</span>
            <span className="text-[11px] text-slate-500 block mt-1">Chemistry &bull; Lab 1</span>
          </div>
          <div onClick={() => onNavigate("exams")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Marks Submission</span>
            <span className="text-2xl font-black text-blue-900 font-mono">Form 3 East</span>
            <span className="text-[11px] text-emerald-600 block mt-1">Mid-Term CAT Active</span>
          </div>
          <div onClick={() => onNavigate("attendance")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Daily Roll-Call</span>
            <span className="text-2xl font-black text-slate-900 font-mono">Marked</span>
            <span className="text-[11px] text-slate-500 block mt-1">Form 3 East Registry</span>
          </div>
          <div onClick={() => onNavigate("students")} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-500">
            <span className="text-xs font-bold uppercase text-slate-500 block">Assigned Students</span>
            <span className="text-2xl font-black text-slate-900 font-mono">45 Students</span>
            <span className="text-[11px] text-slate-500 block mt-1">Class Teacher Assigned</span>
          </div>
        </div>
      )}

      {/* 5. STUDENT & PARENT SPECIFIC OVERVIEW */}
      {(role === "student" || role === "parent") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Academic Standing</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-serif">A- (11.0 Pts)</div>
            <p className="text-xs text-slate-600">
              Rank: <strong>#2 in Form 3 East</strong> &bull; Term 1 Mean: <strong>78.9%</strong>
            </p>
            <button
              onClick={() => onOpenReportCard(myStudent.id)}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Official Student Report Form (PDF)</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Fees &amp; Clearance</span>
              <Wallet className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="text-3xl font-black text-emerald-800 font-mono">
              KES {Math.max(0, myStudent.termFeesDue - myStudent.termFeesPaid).toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">
              Paid: <strong>KES {myStudent.termFeesPaid.toLocaleString()}</strong> of KES {myStudent.termFeesDue.toLocaleString()}
            </p>
            <button
              onClick={() => onOpenFeeStatement(myStudent.id)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Fee Statement (PDF)</span>
            </button>
          </div>

          <div className="bg-emerald-950 text-white p-6 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-300">Lipa na M-Pesa</span>
              <Smartphone className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-300 block">Paybill Business Number</span>
              <span className="text-xl font-bold font-mono text-white">522123</span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-300 block">Account Number (Adm No)</span>
              <span className="text-base font-bold font-mono text-amber-300">{myStudent.admissionNo}</span>
            </div>
            <div className="text-[10px] text-emerald-300 pt-1">
              Payments reflect instantly upon Safaricom SMS confirmation.
            </div>
          </div>
        </div>
      )}

      {/* Main Content Split: Quick Modules & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Launch Action Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-serif">Quick System Navigation</h3>
            <span className="text-xs text-slate-400">Select a module to manage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => onNavigate("students")}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">Student Enrollment</div>
                <div className="text-xs text-slate-500 truncate">Admission rolls, bio-data &amp; promotions</div>
              </div>
            </div>

            <div
              onClick={() => onNavigate("exams")}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">Exams &amp; KNEC Grading</div>
                <div className="text-xs text-slate-500 truncate">Mark entry, 12-point grading &amp; report forms</div>
              </div>
            </div>

            <div
              onClick={() => onNavigate("finance")}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">Bursary &amp; M-Pesa Fees</div>
                <div className="text-xs text-slate-500 truncate">Paybill receipts, invoices &amp; fee structures</div>
              </div>
            </div>

            <div
              onClick={() => onNavigate("attendance")}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">Daily Attendance</div>
                <div className="text-xs text-slate-500 truncate">Class morning roll-call &amp; excuse notes</div>
              </div>
            </div>

            <div
              onClick={() => onNavigate("timetable")}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">8-Period Bell Timetable</div>
                <div className="text-xs text-slate-500 truncate">Classroom and laboratory periods</div>
              </div>
            </div>

            <div
              onClick={() => onNavigate("reports")}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">Ministry Returns &amp; Reports</div>
                <div className="text-xs text-slate-500 truncate">Merit lists, master rolls &amp; debt audits</div>
              </div>
            </div>
          </div>
        </div>

        {/* School Circulars / Noticeboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-serif">Official Circulars</h3>
            <button
              onClick={() => onNavigate("announcements")}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            {announcements && announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded-xs font-bold uppercase ${
                    ann.priority === "Urgent" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="text-slate-400">{ann.date}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
