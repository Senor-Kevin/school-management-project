export type UserRole = 
  | 'super_admin' 
  | 'principal' 
  | 'deputy_principal' 
  | 'bursar' 
  | 'teacher' 
  | 'student' 
  | 'parent';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  name?: string;
  phone?: string;
  avatar?: string;
  admissionNo?: string; // If student
  studentId?: string;   // If parent linked to student
  staffId?: string;     // If staff
  department?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  form: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';
  stream: 'East' | 'West' | 'North' | 'Central';
  admissionDate: string;
  status: 'Active' | 'Suspended' | 'Transferred' | 'Alumni';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyContact: string;
  homeCounty: string;
  previousSchool: string; // e.g. KCPE primary school
  kcpeMarks?: number;
  medicalNotes?: string;
  photo?: string;
  termFeesDue: number;
  termFeesPaid: number;
  houseOrDorm?: string;
}

export interface Staff {
  id: string;
  staffId: string;
  fullName: string;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  department: 'Mathematics' | 'Sciences' | 'Languages' | 'Humanities' | 'Technical & Applied' | 'Administration' | 'Support Staff';
  subjectsTaught: string[];
  classesAssigned: string[];
  employmentStatus: 'Active' | 'On Leave' | 'Contract';
  dateJoined: string;
  qualification: string;
  roleTitle: string;
  isTeaching: boolean;
  avatar?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  isCompulsory: boolean;
  formsOffered: string[];
}

export interface Exam {
  id: string;
  title: string;
  type: 'CAT 1' | 'CAT 2' | 'Mid-Term' | 'End-Term' | 'KCSE Mock';
  term: 'Term 1' | 'Term 2' | 'Term 3';
  year: number;
  form: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';
  date: string;
  isPublished: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  subjectCode: string;
  marks: number;
  grade: string;
  points: number;
  teacherRemarks: string;
}

export interface FeeStructure {
  id: string;
  year: number;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  form: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';
  tuitionFee: number;
  boardingFee: number;
  activityFee: number;
  maintenanceFee: number;
  examFee: number;
  totalAmount: number;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  form: string;
  amount: number;
  paymentMethod: 'M-Pesa' | 'Bank Slip' | 'Cash' | 'Direct Deposit';
  referenceNo: string;
  paymentDate: string;
  recordedBy: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  year: number;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  form: string;
  stream: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  reason?: string;
  recordedBy?: string;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  form: string;
  incidentDate: string;
  title?: string;
  description: string;
  category: string;
  actionTaken: string;
  reportedBy: string;
  status: 'Pending' | 'Resolved' | 'Parent Summoned' | 'Suspension' | 'Open' | 'Under Counseling';
  followUpDate?: string;
}

export interface TimetableSlot {
  id: string;
  form: string;
  stream: string;
  day: string;
  period?: number;
  periodNumber?: number;
  timeString?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  subjectName?: string;
  teacherName: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'All' | 'Students' | 'Parents' | 'Teachers' | 'Form 4 Candidates' | 'Form 4';
  priority: 'Normal' | 'Important' | 'Urgent';
  author: string;
  date: string;
  category?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'Academic' | 'Sports' | 'Meeting' | 'Exam' | 'Holiday';
  date: string;
  endDate?: string;
  location: string;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  poBox: string;
  postalCode?: string;
  town: string;
  county: string;
  phone1: string;
  phone2?: string;
  email: string;
  website?: string;
  knecCode: string;
  currentAcademicYear?: number;
  currentYear?: number;
  currentTerm: 'Term 1' | 'Term 2' | 'Term 3';
  principalName: string;
  deputyPrincipalName?: string;
  deputyName?: string;
  bursarName?: string;
  mpesaPaybill: string;
  bankAccount?: string;
  bankName?: string;
}
