import { User, Student, Staff, Subject, Exam, ExamResult, FeeStructure, FeePayment, AttendanceRecord, DisciplineRecord, TimetableSlot, Announcement, SchoolEvent, AuditLog, SchoolSettings } from "../types";

export const api = {
  // Auth
  async login(username: string, password: string):Promise<{ token: string; user: User }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Login failed" }));
      throw new Error(err.error || "Invalid credentials");
    }
    return res.json();
  },

  async resetPassword(email: string): Promise<{ message: string }> {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  // Students
  async getStudents(params?: { form?: string; stream?: string; search?: string; status?: string }): Promise<Student[]> {
    const query = new URLSearchParams();
    if (params?.form) query.set("form", params.form);
    if (params?.stream) query.set("stream", params.stream);
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    const res = await fetch(`/api/students?${query.toString()}`);
    return res.json();
  },

  async getStudent(id: string): Promise<Student> {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) throw new Error("Student not found");
    return res.json();
  },

  async createStudent(data: Partial<Student>): Promise<Student> {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create student");
    }
    return res.json();
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteStudent(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    return res.json();
  },

  async promoteStudent(id: string): Promise<{ message: string; student: Student }> {
    const res = await fetch(`/api/students/${id}/promote`, { method: "POST" });
    return res.json();
  },

  // Staff
  async getStaff(params?: { department?: string; role?: string; search?: string }): Promise<Staff[]> {
    const query = new URLSearchParams();
    if (params?.department) query.set("department", params.department);
    if (params?.role) query.set("role", params.role);
    if (params?.search) query.set("search", params.search);
    const res = await fetch(`/api/staff?${query.toString()}`);
    return res.json();
  },

  async createStaff(data: Partial<Staff>): Promise<Staff> {
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    const res = await fetch(`/api/staff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteStaff(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
    return res.json();
  },

  // Academics & Subjects
  async getSubjects(): Promise<Subject[]> {
    const res = await fetch("/api/academics/subjects");
    return res.json();
  },

  async createSubject(data: Partial<Subject>): Promise<Subject> {
    const res = await fetch("/api/academics/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Exams & Results
  async getExams(): Promise<Exam[]> {
    const res = await fetch("/api/exams");
    return res.json();
  },

  async createExam(data: Partial<Exam>): Promise<Exam> {
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getExamResults(examId: string): Promise<ExamResult[]> {
    const res = await fetch(`/api/exams/${examId}/results`);
    return res.json();
  },

  async enterMarks(data: { examId: string; studentId: string; subjectCode: string; marks: number; teacherRemarks?: string }): Promise<ExamResult> {
    const res = await fetch("/api/exams/marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getReportCard(studentId: string): Promise<any> {
    const res = await fetch(`/api/exams/report-card/${studentId}`);
    if (!res.ok) throw new Error("Report card not found");
    return res.json();
  },

  // Fees & Payments
  async getFeeStructures(): Promise<FeeStructure[]> {
    const res = await fetch("/api/fees/structures");
    return res.json();
  },

  async getFeePayments(): Promise<FeePayment[]> {
    const res = await fetch("/api/fees/payments");
    return res.json();
  },

  async getFeeData(): Promise<{ structures: FeeStructure[]; payments: FeePayment[] }> {
    const [structures, payments] = await Promise.all([
      this.getFeeStructures(),
      this.getFeePayments()
    ]);
    return { structures, payments };
  },

  async recordFeePayment(data: {
    studentId: string;
    amount: number;
    paymentMethod: string;
    referenceNo?: string;
    remarks?: string;
    term?: string;
    year?: number;
  }): Promise<FeePayment> {
    const res = await fetch("/api/fees/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Payment recording failed");
    }
    return res.json();
  },

  async recordPayment(data: any): Promise<FeePayment> {
    return this.recordFeePayment(data);
  },

  async getFeeStatement(studentId: string): Promise<any> {
    const res = await fetch(`/api/fees/statement/${studentId}`);
    if (!res.ok) throw new Error("Fee statement not found");
    return res.json();
  },

  // Attendance
  async getAttendance(params?: { form?: string; stream?: string; date?: string }): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams();
    if (params?.form) query.set("form", params.form);
    if (params?.stream) query.set("stream", params.stream);
    if (params?.date) query.set("date", params.date);
    const res = await fetch(`/api/attendance?${query.toString()}`);
    return res.json();
  },

  async submitAttendance(records: Partial<AttendanceRecord>[]): Promise<{ message: string; count: number }> {
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records })
    });
    return res.json();
  },

  async recordAttendance(record: Partial<AttendanceRecord>): Promise<any> {
    return this.submitAttendance([record]);
  },

  // Discipline
  async getDiscipline(): Promise<DisciplineRecord[]> {
    const res = await fetch("/api/discipline");
    return res.json();
  },

  async createDiscipline(data: Partial<DisciplineRecord>): Promise<DisciplineRecord> {
    const res = await fetch("/api/discipline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createDisciplineRecord(data: Partial<DisciplineRecord>): Promise<DisciplineRecord> {
    return this.createDiscipline(data);
  },

  async updateDiscipline(id: string, data: Partial<DisciplineRecord>): Promise<DisciplineRecord> {
    const res = await fetch(`/api/discipline/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateDisciplineRecord(id: string, data: Partial<DisciplineRecord>): Promise<DisciplineRecord> {
    return this.updateDiscipline(id, data);
  },

  // Timetable
  async getTimetable(params?: { form?: string; stream?: string; day?: string }): Promise<TimetableSlot[]> {
    const query = new URLSearchParams();
    if (params?.form) query.set("form", params.form);
    if (params?.stream) query.set("stream", params.stream);
    if (params?.day) query.set("day", params.day);
    const res = await fetch(`/api/timetable?${query.toString()}`);
    return res.json();
  },

  async addTimetableSlot(slot: Partial<TimetableSlot>): Promise<TimetableSlot> {
    const res = await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slot)
    });
    return res.json();
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch("/api/announcements");
    return res.json();
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAnnouncement(id: string): Promise<any> {
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    return res.json();
  },

  // Events
  async getEvents(): Promise<SchoolEvent[]> {
    const res = await fetch("/api/events");
    return res.json();
  },

  async createEvent(data: Partial<SchoolEvent>): Promise<SchoolEvent> {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Analytics & Logs
  async getAnalytics(): Promise<any> {
    const res = await fetch("/api/reports/analytics");
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch("/api/audit-logs");
    return res.json();
  },

  // Global Search
  async search(query: string): Promise<{
    students: Student[];
    staff: Staff[];
    announcements: Announcement[];
    payments: FeePayment[];
  }> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SchoolSettings> {
    const res = await fetch("/api/settings");
    return res.json();
  },

  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};
