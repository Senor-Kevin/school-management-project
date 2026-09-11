import React, { useState, useEffect } from "react";
import { api } from "./lib/api";
import { 
  User, 
  UserRole, 
  Student, 
  Staff, 
  FeePayment, 
  FeeStructure, 
  Exam, 
  AttendanceRecord, 
  DisciplineRecord, 
  TimetableSlot, 
  Announcement, 
  SchoolEvent, 
  AuditLog, 
  SchoolSettings 
} from "./types";

// Components
import { LandingPage } from "./components/LandingPage";
import { LoginModal } from "./components/LoginModal";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./components/DashboardOverview";
import { StudentModule } from "./components/StudentModule";
import { StaffModule } from "./components/StaffModule";
import { TimetableModule } from "./components/TimetableModule";
import { ExamModule } from "./components/ExamModule";
import { FinanceModule } from "./components/FinanceModule";
import { AttendanceModule } from "./components/AttendanceModule";
import { DisciplineModule } from "./components/DisciplineModule";
import { AnnouncementsModule } from "./components/AnnouncementsModule";
import { ReportsModule } from "./components/ReportsModule";
import { SettingsModule } from "./components/SettingsModule";

// Printables / Modals
import { OfficialReportCard } from "./components/OfficialReportCard";
import { OfficialFeeReceipt } from "./components/OfficialFeeReceipt";
import { OfficialFeeStatement } from "./components/OfficialFeeStatement";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [presetRoleForLogin, setPresetRoleForLogin] = useState<string | undefined>(undefined);
  const [activeModule, setActiveModule] = useState<string>("overview");

  // Application Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>({
    schoolName: "Kaplong High School",
    motto: "Labor Vincit Omnia - Strive for Excellence",
    poBox: "P.O. Box 15 - 20406",
    town: "Sotik",
    county: "Bomet County",
    phone1: "+254 722 000 111",
    phone2: "+254 733 000 222",
    email: "info@kaplonghigh.sc.ke",
    knecCode: "36611002",
    principalName: "Mr. Kenneth Cheruiyot",
    bursarName: "Mr. David Sang",
    deputyName: "Mr. Wilson Langat",
    mpesaPaybill: "522123",
    currentTerm: "Term 1",
    currentYear: 2025
  });

  const [isLoading, setIsLoading] = useState(true);

  // Active Report/Printable states
  const [activeReportData, setActiveReportData] = useState<any | null>(null);
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<FeePayment | null>(null);
  const [activeStatementData, setActiveStatementData] = useState<any | null>(null);

  // Load All Core Data from Backend
  const loadAllData = async () => {
    try {
      const [
        studentsRes,
        staffRes,
        feesRes,
        examsRes,
        attRes,
        discRes,
        timeRes,
        annRes,
        eventsRes,
        subRes,
        setRes,
        auditRes
      ] = await Promise.all([
        api.getStudents(),
        api.getStaff(),
        api.getFeeData(),
        api.getExams(),
        api.getAttendance(),
        api.getDiscipline(),
        api.getTimetable(),
        api.getAnnouncements(),
        api.getEvents(),
        api.getSubjects(),
        api.getSettings(),
        api.getAuditLogs()
      ]);

      setStudents(studentsRes);
      setStaff(staffRes);
      setFeePayments(feesRes.payments);
      setFeeStructures(feesRes.structures);
      setExams(examsRes);
      setAttendanceRecords(attRes);
      setDisciplineRecords(discRes);
      setTimetableSlots(timeRes);
      setAnnouncements(annRes);
      setEvents(eventsRes);
      setSubjects(subRes);
      setSettings(setRes);
      setAuditLogs(auditRes);
    } catch (err) {
      console.error("Failed to load school data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Quick Role Switching (Super Admin, Principal, Deputy, Bursar, Teacher, Student, Parent)
  const handleSwitchRole = async (targetRole: UserRole) => {
    const roleMap: Record<UserRole, { email: string; name: string }> = {
      super_admin: { email: "admin@kaplonghigh.sc.ke", name: "System Administrator" },
      principal: { email: "principal@kaplonghigh.sc.ke", name: "Mr. Kenneth Cheruiyot (Chief Principal)" },
      deputy_principal: { email: "deputy@kaplonghigh.sc.ke", name: "Mr. Wilson Langat (Deputy Principal)" },
      bursar: { email: "bursar@kaplonghigh.sc.ke", name: "Mr. David Sang (Bursar)" },
      teacher: { email: "teacher@kaplonghigh.sc.ke", name: "Mr. Peter Kipkemoi (Chemistry Teacher)" },
      student: { email: "student@kaplonghigh.sc.ke", name: "Kiprono Brian" },
      parent: { email: "parent@kaplonghigh.sc.ke", name: "Mzee Wilson Langat (Guardian)" },
    };

    const target = roleMap[targetRole] || roleMap.super_admin;
    const dummyUser: User = {
      id: `usr_${targetRole}`,
      username: target.email.split("@")[0],
      email: target.email,
      fullName: target.name,
      name: target.name,
      role: targetRole
    };
    setCurrentUser(dummyUser);
    setActiveModule("overview");
  };

  const handleOpenLogin = (preset?: string) => {
    setPresetRoleForLogin(preset);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveModule("overview");
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveModule("overview");
  };

  // Open Official Printable Report Card
  const handleOpenReportCard = async (studentId: string) => {
    try {
      const data = await api.getReportCard(studentId);
      setActiveReportData(data);
    } catch (err) {
      alert("Failed to load report card");
    }
  };

  // Open Official Fee Statement
  const handleOpenFeeStatement = async (studentId: string) => {
    try {
      const data = await api.getFeeStatement(studentId);
      setActiveStatementData(data);
    } catch (err) {
      alert("Failed to load fee statement");
    }
  };

  // Open Official Fee Receipt
  const handleOpenFeeReceipt = (payment: FeePayment) => {
    setActiveReceiptPayment(payment);
  };

  // If loading initially
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="font-serif font-bold text-lg text-emerald-400">Kaplong High School</h2>
        <p className="text-xs text-slate-400 mt-1">Initializing School Management System...</p>
      </div>
    );
  }

  // 1. PUBLIC WEBSITE (when not logged in)
  if (!currentUser) {
    return (
      <>
        <LandingPage
          settings={settings}
          announcements={announcements}
          events={events}
          onOpenLogin={handleOpenLogin}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          presetRole={presetRoleForLogin}
        />
      </>
    );
  }

  // 2. AUTHENTICATED DASHBOARD (when logged in)
  return (
    <>
      <DashboardLayout
        user={currentUser}
        activeModule={activeModule}
        onNavigate={(mod) => setActiveModule(mod)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenPublicSite={() => setCurrentUser(null)}
      >
        {activeModule === "overview" && (
          <DashboardOverview
            user={currentUser}
            students={students}
            staff={staff}
            feePayments={feePayments}
            exams={exams}
            announcements={announcements}
            onNavigate={(mod) => setActiveModule(mod)}
            onOpenReportCard={handleOpenReportCard}
            onOpenFeeStatement={handleOpenFeeStatement}
          />
        )}

        {activeModule === "students" && (
          <StudentModule
            students={students}
            onRefresh={loadAllData}
            onViewReportCard={handleOpenReportCard}
            onViewFeeStatement={handleOpenFeeStatement}
          />
        )}

        {activeModule === "staff" && (
          <StaffModule
            staff={staff}
            onRefresh={loadAllData}
          />
        )}

        {activeModule === "timetable" && (
          <TimetableModule
            slots={timetableSlots}
            subjects={subjects}
            currentRole={currentUser.role}
          />
        )}

        {activeModule === "exams" && (
          <ExamModule
            exams={exams}
            students={students}
            subjects={subjects}
            onRefresh={loadAllData}
            onOpenReportCard={handleOpenReportCard}
            currentRole={currentUser.role}
          />
        )}

        {activeModule === "finance" && (
          <FinanceModule
            feePayments={feePayments}
            feeStructures={feeStructures}
            students={students}
            settings={settings}
            onRefresh={loadAllData}
            onOpenReceipt={handleOpenFeeReceipt}
            onOpenStatement={handleOpenFeeStatement}
            currentRole={currentUser.role}
          />
        )}

        {activeModule === "attendance" && (
          <AttendanceModule
            students={students}
            records={attendanceRecords}
            onRefresh={loadAllData}
            currentRole={currentUser.role}
          />
        )}

        {activeModule === "discipline" && (
          <DisciplineModule
            records={disciplineRecords}
            students={students}
            onRefresh={loadAllData}
            currentRole={currentUser.role}
          />
        )}

        {activeModule === "announcements" && (
          <AnnouncementsModule
            announcements={announcements}
            onRefresh={loadAllData}
            currentRole={currentUser.role}
          />
        )}

        {activeModule === "reports" && (
          <ReportsModule
            students={students}
            staff={staff}
            feePayments={feePayments}
            exams={exams}
            onOpenReportCard={handleOpenReportCard}
            onOpenStatement={handleOpenFeeStatement}
          />
        )}

        {activeModule === "settings" && (
          <SettingsModule
            settings={settings}
            auditLogs={auditLogs}
            onRefresh={loadAllData}
          />
        )}
      </DashboardLayout>

      {/* PRINTABLE MODALS */}
      {activeReportData && (
        <OfficialReportCard
          reportData={activeReportData}
          onClose={() => setActiveReportData(null)}
        />
      )}

      {activeReceiptPayment && (
        <OfficialFeeReceipt
          payment={activeReceiptPayment}
          school={settings}
          onClose={() => setActiveReceiptPayment(null)}
        />
      )}

      {activeStatementData && (
        <OfficialFeeStatement
          statementData={activeStatementData}
          onClose={() => setActiveStatementData(null)}
        />
      )}
    </>
  );
}
