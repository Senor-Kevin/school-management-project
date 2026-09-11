import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to hash password
function hashPassword(pwd: string): string {
  return crypto.createHash("sha256").update(pwd).digest("hex");
}

// KNEC Grading Helper
export function calculateKnecGrade(marks: number): { grade: string; points: number; remarks: string } {
  if (marks >= 80) return { grade: "A", points: 12, remarks: "Excellent" };
  if (marks >= 75) return { grade: "A-", points: 11, remarks: "Very Good" };
  if (marks >= 70) return { grade: "B+", points: 10, remarks: "Good" };
  if (marks >= 65) return { grade: "B", points: 9, remarks: "Fairly Good" };
  if (marks >= 60) return { grade: "B-", points: 8, remarks: "Above Average" };
  if (marks >= 55) return { grade: "C+", points: 7, remarks: "Average" };
  if (marks >= 50) return { grade: "C", points: 6, remarks: "Pass" };
  if (marks >= 45) return { grade: "C-", points: 5, remarks: "Fair" };
  if (marks >= 40) return { grade: "D+", points: 4, remarks: "Weak" };
  if (marks >= 35) return { grade: "D", points: 3, remarks: "Very Weak" };
  if (marks >= 30) return { grade: "D-", points: 2, remarks: "Poor" };
  return { grade: "E", points: 1, remarks: "Fail" };
}

// ----------------------------------------------------
// DATABASE INITIALIZATION (Realistic Kenyan Secondary Data)
// ----------------------------------------------------

let schoolSettings = {
  schoolName: "Kaplong High School",
  motto: "Strive for Excellence (Labor Vincit Omnia)",
  poBox: "P.O. Box 15 - 20406",
  postalCode: "20406",
  town: "Sotik",
  county: "Bomet County",
  country: "Kenya",
  phone1: "+254 720 000 000 (Sample Office)",
  phone2: "+254 733 000 000 (Sample Accounts)",
  email: "info@kaplonghigh.sc.ke",
  website: "www.kaplonghigh.sc.ke",
  knecCode: "28500101",
  currentAcademicYear: 2025,
  currentTerm: "Term 1",
  principalName: "Mr. Kiprotich Cheruiyot",
  deputyPrincipalName: "Mrs. Grace Koech",
  bursarName: "Mr. David Sang",
  mpesaPaybill: "522123 (Sample Paybill)",
  bankAccount: "1104829103 - KCB Bank Sotik Branch",
  bankName: "Kenya Commercial Bank"
};

let users = [
  {
    id: "usr_admin",
    username: "admin@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Admin@123"),
    email: "admin@kaplonghigh.sc.ke",
    role: "super_admin",
    fullName: "Eng. Emmanuel Rono",
    phone: "+254 722 112 233",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_principal",
    username: "principal@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Principal@123"),
    email: "principal@kaplonghigh.sc.ke",
    role: "principal",
    fullName: "Mr. Kiprotich Cheruiyot",
    phone: "+254 721 345 678",
    staffId: "TSC/398201",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_deputy",
    username: "deputy@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Deputy@123"),
    email: "deputy@kaplonghigh.sc.ke",
    role: "deputy_principal",
    fullName: "Mrs. Grace Koech",
    phone: "+254 723 456 789",
    staffId: "TSC/410294",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_bursar",
    username: "bursar@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Bursar@123"),
    email: "bursar@kaplonghigh.sc.ke",
    role: "bursar",
    fullName: "Mr. David Sang",
    phone: "+254 712 554 321",
    staffId: "NTS/082",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_teacher",
    username: "teacher@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Teacher@123"),
    email: "teacher@kaplonghigh.sc.ke",
    role: "teacher",
    fullName: "Mr. Peter Kipkemoi",
    phone: "+254 711 987 654",
    staffId: "TSC/512984",
    department: "Sciences",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_student",
    username: "student@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Student@123"),
    email: "student@kaplonghigh.sc.ke",
    role: "student",
    fullName: "Brian Kiprono",
    admissionNo: "KHS/2023/0412",
    phone: "+254 700 123 456",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_parent",
    username: "parent@kaplonghigh.sc.ke",
    passwordHash: hashPassword("Parent@123"),
    email: "parent@kaplonghigh.sc.ke",
    role: "parent",
    fullName: "Mzee Wilson Langat",
    phone: "+254 722 998 877",
    studentId: "stu_1",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  }
];

let students = [
  {
    id: "stu_1",
    admissionNo: "KHS/2023/0412",
    fullName: "Brian Kiprono",
    gender: "Male",
    dob: "2008-04-12",
    form: "Form 3",
    stream: "East",
    admissionDate: "2023-01-15",
    status: "Active",
    parentName: "Mzee Wilson Langat",
    parentPhone: "+254 722 998 877",
    parentEmail: "wilson.langat@example.com",
    emergencyContact: "+254 722 998 877 (Father)",
    homeCounty: "Bomet",
    previousSchool: "Sotik Academy Primary",
    kcpeMarks: 382,
    medicalNotes: "No known chronic conditions, slight asthma in cold weather.",
    termFeesDue: 18500,
    termFeesPaid: 15000,
    houseOrDorm: "Longonot House",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_2",
    admissionNo: "KHS/2023/0415",
    fullName: "Mercy Chebet",
    gender: "Female",
    dob: "2008-09-21",
    form: "Form 3",
    stream: "East",
    admissionDate: "2023-01-15",
    status: "Active",
    parentName: "Mrs. Beatrice Korir",
    parentPhone: "+254 710 445 566",
    parentEmail: "beatrice.korir@example.com",
    emergencyContact: "+254 710 445 566",
    homeCounty: "Kericho",
    previousSchool: "Kaplong Boarding Primary",
    kcpeMarks: 395,
    medicalNotes: "None",
    termFeesDue: 18500,
    termFeesPaid: 18500,
    houseOrDorm: "Kilimanjaro House",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_3",
    admissionNo: "KHS/2022/0198",
    fullName: "Emmanuel Kipkosgei",
    gender: "Male",
    dob: "2007-02-18",
    form: "Form 4",
    stream: "Central",
    admissionDate: "2022-01-10",
    status: "Active",
    parentName: "James Kipkosgei",
    parentPhone: "+254 721 889 900",
    parentEmail: "james.kip@example.com",
    emergencyContact: "+254 721 889 900",
    homeCounty: "Uasin Gishu",
    previousSchool: "Eldoret Hill School",
    kcpeMarks: 405,
    medicalNotes: "Allergic to penicillin",
    termFeesDue: 22000,
    termFeesPaid: 22000,
    houseOrDorm: "Menengai House",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_4",
    admissionNo: "KHS/2022/0205",
    fullName: "Sharon Cherotich",
    gender: "Female",
    dob: "2007-11-04",
    form: "Form 4",
    stream: "West",
    admissionDate: "2022-01-10",
    status: "Active",
    parentName: "Alice Cherotich",
    parentPhone: "+254 715 776 655",
    parentEmail: "alice.c@example.com",
    emergencyContact: "+254 715 776 655",
    homeCounty: "Bomet",
    previousSchool: "Tenwek Boarding Primary",
    kcpeMarks: 412,
    medicalNotes: "None",
    termFeesDue: 22000,
    termFeesPaid: 12000,
    houseOrDorm: "Aberdares House",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_5",
    admissionNo: "KHS/2024/0521",
    fullName: "Kevin Kipkurui",
    gender: "Male",
    dob: "2009-06-14",
    form: "Form 2",
    stream: "North",
    admissionDate: "2024-01-18",
    status: "Active",
    parentName: "Robert Rotich",
    parentPhone: "+254 724 332 211",
    parentEmail: "robert.r@example.com",
    emergencyContact: "+254 724 332 211",
    homeCounty: "Nakuru",
    previousSchool: "Molo Primary School",
    kcpeMarks: 368,
    medicalNotes: "None",
    termFeesDue: 17000,
    termFeesPaid: 17000,
    houseOrDorm: "Longonot House",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_6",
    admissionNo: "KHS/2025/0701",
    fullName: "Daisy Chepngetich",
    gender: "Female",
    dob: "2010-01-30",
    form: "Form 1",
    stream: "East",
    admissionDate: "2025-01-12",
    status: "Active",
    parentName: "Florence Bett",
    parentPhone: "+254 718 901 234",
    parentEmail: "florence.bett@example.com",
    emergencyContact: "+254 718 901 234",
    homeCounty: "Bomet",
    previousSchool: "Litein Primary",
    kcpeMarks: 375,
    medicalNotes: "Mild peanut allergy",
    termFeesDue: 22500,
    termFeesPaid: 10000,
    houseOrDorm: "Kilimanjaro House",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_7",
    admissionNo: "KHS/2023/0430",
    fullName: "Dennis Kipkemoi",
    gender: "Male",
    dob: "2008-08-05",
    form: "Form 3",
    stream: "West",
    admissionDate: "2023-01-15",
    status: "Active",
    parentName: "Philemon Yegon",
    parentPhone: "+254 727 654 321",
    parentEmail: "philemon.y@example.com",
    emergencyContact: "+254 727 654 321",
    homeCounty: "Narok",
    previousSchool: "Kilgoris Central",
    kcpeMarks: 355,
    medicalNotes: "None",
    termFeesDue: 18500,
    termFeesPaid: 5000,
    houseOrDorm: "Menengai House",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_8",
    admissionNo: "KHS/2022/0219",
    fullName: "Faith Jebet",
    gender: "Female",
    dob: "2007-05-19",
    form: "Form 4",
    stream: "Central",
    admissionDate: "2022-01-10",
    status: "Active",
    parentName: "Samson Keter",
    parentPhone: "+254 726 112 345",
    parentEmail: "samson.keter@example.com",
    emergencyContact: "+254 726 112 345",
    homeCounty: "Kericho",
    previousSchool: "Kericho Primary",
    kcpeMarks: 389,
    medicalNotes: "None",
    termFeesDue: 22000,
    termFeesPaid: 22000,
    houseOrDorm: "Aberdares House",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  }
];

let staffList = [
  {
    id: "stf_1",
    staffId: "TSC/398201",
    fullName: "Mr. Kiprotich Cheruiyot",
    gender: "Male",
    phone: "+254 721 345 678",
    email: "cheruiyot@kaplonghigh.sc.ke",
    department: "Administration",
    subjectsTaught: ["History & Government"],
    classesAssigned: ["Form 4 Central"],
    employmentStatus: "Active",
    dateJoined: "2018-05-01",
    qualification: "M.Ed Educational Leadership, B.Ed Arts (Moi University)",
    roleTitle: "Chief Principal",
    isTeaching: true
  },
  {
    id: "stf_2",
    staffId: "TSC/410294",
    fullName: "Mrs. Grace Koech",
    gender: "Female",
    phone: "+254 723 456 789",
    email: "koech@kaplonghigh.sc.ke",
    department: "Languages",
    subjectsTaught: ["English", "Literature"],
    classesAssigned: ["Form 3 East", "Form 4 West"],
    employmentStatus: "Active",
    dateJoined: "2019-09-01",
    qualification: "B.Ed Arts (Kenyatta University)",
    roleTitle: "Deputy Principal (Academics & Discipline)",
    isTeaching: true
  },
  {
    id: "stf_3",
    staffId: "TSC/512984",
    fullName: "Mr. Peter Kipkemoi",
    gender: "Male",
    phone: "+254 711 987 654",
    email: "kipkemoi@kaplonghigh.sc.ke",
    department: "Sciences",
    subjectsTaught: ["Chemistry", "Physics"],
    classesAssigned: ["Form 3 East", "Form 3 West", "Form 4 Central"],
    employmentStatus: "Active",
    dateJoined: "2021-02-15",
    qualification: "B.Sc with Education (Egerton University)",
    roleTitle: "Head of Science Department / Form 3 Class Teacher",
    isTeaching: true
  },
  {
    id: "stf_4",
    staffId: "TSC/542109",
    fullName: "Ms. Faith Chelagat",
    gender: "Female",
    phone: "+254 725 889 001",
    email: "chelagat@kaplonghigh.sc.ke",
    department: "Mathematics",
    subjectsTaught: ["Mathematics"],
    classesAssigned: ["Form 1 East", "Form 3 East", "Form 4 Central"],
    employmentStatus: "Active",
    dateJoined: "2022-01-10",
    qualification: "B.Ed Science - Maths/Chem (University of Nairobi)",
    roleTitle: "Senior Teacher Mathematics",
    isTeaching: true
  },
  {
    id: "stf_5",
    staffId: "TSC/489012",
    fullName: "Mr. Bernard Mutai",
    gender: "Male",
    phone: "+254 728 443 219",
    email: "mutai@kaplonghigh.sc.ke",
    department: "Technical & Applied",
    subjectsTaught: ["Computer Studies", "Business Studies"],
    classesAssigned: ["Form 2 North", "Form 3 East", "Form 4 West"],
    employmentStatus: "Active",
    dateJoined: "2020-08-01",
    qualification: "B.Ed Technology Education (University of Eldoret)",
    roleTitle: "ICT Director & Exams Officer",
    isTeaching: true
  },
  {
    id: "stf_6",
    staffId: "TSC/590123",
    fullName: "Mr. Geoffrey Korir",
    gender: "Male",
    phone: "+254 716 332 998",
    email: "korir@kaplonghigh.sc.ke",
    department: "Humanities",
    subjectsTaught: ["Geography", "CRE"],
    classesAssigned: ["Form 3 East", "Form 2 North"],
    employmentStatus: "Active",
    dateJoined: "2023-01-09",
    qualification: "B.Ed Arts (Maseno University)",
    roleTitle: "Teacher / Games Master",
    isTeaching: true
  },
  {
    id: "stf_7",
    staffId: "NTS/082",
    fullName: "Mr. David Sang",
    gender: "Male",
    phone: "+254 712 554 321",
    email: "sang@kaplonghigh.sc.ke",
    department: "Administration",
    subjectsTaught: [],
    classesAssigned: [],
    employmentStatus: "Active",
    dateJoined: "2017-03-01",
    qualification: "CPA-K, Bachelor of Commerce - Finance (KCA University)",
    roleTitle: "Senior School Bursar",
    isTeaching: false
  },
  {
    id: "stf_8",
    staffId: "NTS/104",
    fullName: "Mrs. Nancy Langat",
    gender: "Female",
    phone: "+254 729 001 122",
    email: "nancy@kaplonghigh.sc.ke",
    department: "Support Staff",
    subjectsTaught: [],
    classesAssigned: [],
    employmentStatus: "Active",
    dateJoined: "2021-06-15",
    qualification: "Diploma in Nursing (KMTC)",
    roleTitle: "School Nurse & Wellness Officer",
    isTeaching: false
  }
];

let subjects = [
  { id: "sub_1", code: "101", name: "English", department: "Languages", isCompulsory: true, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_2", code: "102", name: "Kiswahili", department: "Languages", isCompulsory: true, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_3", code: "121", name: "Mathematics", department: "Mathematics", isCompulsory: true, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_4", code: "231", name: "Biology", department: "Sciences", isCompulsory: true, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_5", code: "232", name: "Physics", department: "Sciences", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_6", code: "233", name: "Chemistry", department: "Sciences", isCompulsory: true, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_7", code: "311", name: "History & Government", department: "Humanities", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_8", code: "312", name: "Geography", department: "Humanities", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_9", code: "313", name: "Christian Religious Education (CRE)", department: "Humanities", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_10", code: "443", name: "Agriculture", department: "Technical & Applied", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_11", code: "451", name: "Computer Studies", department: "Technical & Applied", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] },
  { id: "sub_12", code: "565", name: "Business Studies", department: "Technical & Applied", isCompulsory: false, formsOffered: ["Form 1", "Form 2", "Form 3", "Form 4"] }
];

let exams = [
  { id: "ex_1", title: "Form 3 Term 1 Mid-Term Examination", type: "Mid-Term", term: "Term 1", year: 2025, form: "Form 3", date: "2025-02-24", isPublished: true },
  { id: "ex_2", title: "Form 4 Term 1 KCSE Mock 1", type: "KCSE Mock", term: "Term 1", year: 2025, form: "Form 4", date: "2025-03-03", isPublished: true },
  { id: "ex_3", title: "Form 1 Term 1 CAT 1", type: "CAT 1", term: "Term 1", year: 2025, form: "Form 1", date: "2025-02-10", isPublished: true },
  { id: "ex_4", title: "Form 2 Term 1 Mid-Term Examination", type: "Mid-Term", term: "Term 1", year: 2025, form: "Form 2", date: "2025-02-25", isPublished: true }
];

// Sample Marks for Brian Kiprono (stu_1) in Exam ex_1
let examResults = [
  { id: "res_1", examId: "ex_1", studentId: "stu_1", subjectCode: "101", marks: 78, grade: "A-", points: 11, teacherRemarks: "Very good command of grammar and essay writing." },
  { id: "res_2", examId: "ex_1", studentId: "stu_1", subjectCode: "102", marks: 72, grade: "B+", points: 10, teacherRemarks: "Insha na sarufi imara sana." },
  { id: "res_3", examId: "ex_1", studentId: "stu_1", subjectCode: "121", marks: 84, grade: "A", points: 12, teacherRemarks: "Outstanding algebraic problem solving." },
  { id: "res_4", examId: "ex_1", studentId: "stu_1", subjectCode: "231", marks: 76, grade: "A-", points: 11, teacherRemarks: "Good understanding of ecology concepts." },
  { id: "res_5", examId: "ex_1", studentId: "stu_1", subjectCode: "232", marks: 68, grade: "B", points: 9, teacherRemarks: "Can do better in optics practicals." },
  { id: "res_6", examId: "ex_1", studentId: "stu_1", subjectCode: "233", marks: 81, grade: "A", points: 12, teacherRemarks: "Excellent grasp of volumetric analysis." },
  { id: "res_7", examId: "ex_1", studentId: "stu_1", subjectCode: "312", marks: 74, grade: "B+", points: 10, teacherRemarks: "Good map work interpretation." },
  { id: "res_8", examId: "ex_1", studentId: "stu_1", subjectCode: "451", marks: 88, grade: "A", points: 12, teacherRemarks: "Exceptional coding and system skills." },

  // Mercy Chebet (stu_2)
  { id: "res_9", examId: "ex_1", studentId: "stu_2", subjectCode: "101", marks: 82, grade: "A", points: 12, teacherRemarks: "Brilliant expression." },
  { id: "res_10", examId: "ex_1", studentId: "stu_2", subjectCode: "102", marks: 79, grade: "A-", points: 11, teacherRemarks: "Hongera kwa kazi nzuri." },
  { id: "res_11", examId: "ex_1", studentId: "stu_2", subjectCode: "121", marks: 86, grade: "A", points: 12, teacherRemarks: "Top tier mathematical aptitude." },
  { id: "res_12", examId: "ex_1", studentId: "stu_2", subjectCode: "231", marks: 80, grade: "A", points: 12, teacherRemarks: "Exemplary work." },
  { id: "res_13", examId: "ex_1", studentId: "stu_2", subjectCode: "233", marks: 85, grade: "A", points: 12, teacherRemarks: "Exceptional chemistry work." },
  { id: "res_14", examId: "ex_1", studentId: "stu_2", subjectCode: "311", marks: 88, grade: "A", points: 12, teacherRemarks: "Outstanding historical analysis." },
  { id: "res_15", examId: "ex_1", studentId: "stu_2", subjectCode: "565", marks: 83, grade: "A", points: 12, teacherRemarks: "Very sound business acumen." }
];

let feeStructures = [
  {
    id: "fs_1",
    year: 2025,
    term: "Term 1",
    form: "Form 1",
    tuitionFee: 9500,
    boardingFee: 8500,
    activityFee: 1500,
    maintenanceFee: 1500,
    examFee: 1500,
    totalAmount: 22500
  },
  {
    id: "fs_2",
    year: 2025,
    term: "Term 1",
    form: "Form 2",
    tuitionFee: 8000,
    boardingFee: 6500,
    activityFee: 1000,
    maintenanceFee: 1000,
    examFee: 500,
    totalAmount: 17000
  },
  {
    id: "fs_3",
    year: 2025,
    term: "Term 1",
    form: "Form 3",
    tuitionFee: 8500,
    boardingFee: 7000,
    activityFee: 1200,
    maintenanceFee: 1000,
    examFee: 800,
    totalAmount: 18500
  },
  {
    id: "fs_4",
    year: 2025,
    term: "Term 1",
    form: "Form 4",
    tuitionFee: 9500,
    boardingFee: 8000,
    activityFee: 1500,
    maintenanceFee: 1000,
    examFee: 2000, // KCSE preparations & mock
    totalAmount: 22000
  }
];

let feePayments = [
  {
    id: "pay_1",
    receiptNo: "KHS-REC-2025-0012",
    studentId: "stu_1",
    studentName: "Brian Kiprono",
    admissionNo: "KHS/2023/0412",
    form: "Form 3 East",
    amount: 10000,
    paymentMethod: "M-Pesa",
    referenceNo: "QKB74921KL",
    paymentDate: "2025-01-14",
    recordedBy: "Mr. David Sang (Bursar)",
    term: "Term 1",
    year: 2025,
    remarks: "First installment via Paybill 522123"
  },
  {
    id: "pay_2",
    receiptNo: "KHS-REC-2025-0038",
    studentId: "stu_1",
    studentName: "Brian Kiprono",
    admissionNo: "KHS/2023/0412",
    form: "Form 3 East",
    amount: 5000,
    paymentMethod: "Bank Slip",
    referenceNo: "KCB-STK-904122",
    paymentDate: "2025-02-04",
    recordedBy: "Mr. David Sang (Bursar)",
    term: "Term 1",
    year: 2025,
    remarks: "Direct deposit KCB Bank Sotik Branch"
  },
  {
    id: "pay_3",
    receiptNo: "KHS-REC-2025-0005",
    studentId: "stu_2",
    studentName: "Mercy Chebet",
    admissionNo: "KHS/2023/0415",
    form: "Form 3 East",
    amount: 18500,
    paymentMethod: "M-Pesa",
    referenceNo: "RKA994012X",
    paymentDate: "2025-01-13",
    recordedBy: "Mr. David Sang (Bursar)",
    term: "Term 1",
    year: 2025,
    remarks: "Full term fee settlement"
  },
  {
    id: "pay_4",
    receiptNo: "KHS-REC-2025-0089",
    studentId: "stu_3",
    studentName: "Emmanuel Kipkosgei",
    admissionNo: "KHS/2022/0198",
    form: "Form 4 Central",
    amount: 22000,
    paymentMethod: "Bank Slip",
    referenceNo: "EQT-BMT-55019",
    paymentDate: "2025-01-11",
    recordedBy: "Mr. David Sang (Bursar)",
    term: "Term 1",
    year: 2025,
    remarks: "Equity Bank fee clearance"
  },
  {
    id: "pay_5",
    receiptNo: "KHS-REC-2025-0114",
    studentId: "stu_4",
    studentName: "Sharon Cherotich",
    admissionNo: "KHS/2022/0205",
    form: "Form 4 West",
    amount: 12000,
    paymentMethod: "M-Pesa",
    referenceNo: "SKL382109M",
    paymentDate: "2025-01-16",
    recordedBy: "Mr. David Sang (Bursar)",
    term: "Term 1",
    year: 2025,
    remarks: "Part payment"
  }
];

let attendanceRecords = [
  { id: "att_1", studentId: "stu_1", form: "Form 3", stream: "East", date: "2025-03-03", status: "Present", remarks: "" },
  { id: "att_2", studentId: "stu_2", form: "Form 3", stream: "East", date: "2025-03-03", status: "Present", remarks: "" },
  { id: "att_3", studentId: "stu_7", form: "Form 3", stream: "West", date: "2025-03-03", status: "Late", remarks: "Traffic delay from Sotik town" },
  { id: "att_4", studentId: "stu_1", form: "Form 3", stream: "East", date: "2025-03-02", status: "Present", remarks: "" },
  { id: "att_5", studentId: "stu_1", form: "Form 3", stream: "East", date: "2025-03-01", status: "Present", remarks: "" },
  { id: "att_6", studentId: "stu_1", form: "Form 3", stream: "East", date: "2025-02-28", status: "Excused", remarks: "School dispensary checkup" }
];

let disciplineRecords = [
  {
    id: "disc_1",
    studentId: "stu_7",
    studentName: "Dennis Kipkemoi",
    admissionNo: "KHS/2023/0430",
    form: "Form 3 West",
    incidentDate: "2025-02-18",
    title: "Late Arrival to Preps",
    description: "Found wandering behind the dining hall during evening study prep hours without a movement pass.",
    category: "Minor",
    actionTaken: "Verbal warning given and assigned 2 hours compound maintenance on Saturday.",
    reportedBy: "Mr. Geoffrey Korir (Duty Master)",
    status: "Resolved",
    followUpDate: "2025-02-25"
  },
  {
    id: "disc_2",
    studentId: "stu_1",
    studentName: "Brian Kiprono",
    admissionNo: "KHS/2023/0412",
    form: "Form 3 East",
    incidentDate: "2024-10-12",
    title: "Lost School Sweater / Uniform Infraction",
    description: "Appeared in class without school regulation pullover. Reported that it was misplaced during games time.",
    category: "Minor",
    actionTaken: "Item traced at the laundry store; student cautioned on taking care of school attire.",
    reportedBy: "Mrs. Grace Koech (Deputy Principal)",
    status: "Resolved",
    followUpDate: "2024-10-15"
  }
];

let timetable = [
  { id: "tt_1", form: "Form 3", stream: "East", day: "Monday", period: 1, timeString: "08:00 - 08:40", subject: "Mathematics", teacherName: "Ms. Faith Chelagat", room: "F3E" },
  { id: "tt_2", form: "Form 3", stream: "East", day: "Monday", period: 2, timeString: "08:40 - 09:20", subject: "English", teacherName: "Mrs. Grace Koech", room: "F3E" },
  { id: "tt_3", form: "Form 3", stream: "East", day: "Monday", period: 3, timeString: "09:20 - 10:00", subject: "Chemistry", teacherName: "Mr. Peter Kipkemoi", room: "Science Lab 1" },
  { id: "tt_4", form: "Form 3", stream: "East", day: "Monday", period: 4, timeString: "10:20 - 11:00", subject: "Physics", teacherName: "Mr. Peter Kipkemoi", room: "Science Lab 2" },
  { id: "tt_5", form: "Form 3", stream: "East", day: "Monday", period: 5, timeString: "11:00 - 11:40", subject: "Biology", teacherName: "Mr. Peter Kipkemoi", room: "F3E" },
  { id: "tt_6", form: "Form 3", stream: "East", day: "Monday", period: 6, timeString: "11:40 - 12:20", subject: "Kiswahili", teacherName: "Mr. Kiprotich Cheruiyot", room: "F3E" },
  { id: "tt_7", form: "Form 3", stream: "East", day: "Monday", period: 7, timeString: "14:00 - 14:40", subject: "Computer Studies", teacherName: "Mr. Bernard Mutai", room: "Computer Lab" },
  { id: "tt_8", form: "Form 3", stream: "East", day: "Monday", period: 8, timeString: "14:40 - 15:20", subject: "Geography", teacherName: "Mr. Geoffrey Korir", room: "F3E" },

  // Tuesday sample
  { id: "tt_9", form: "Form 3", stream: "East", day: "Tuesday", period: 1, timeString: "08:00 - 08:40", subject: "Chemistry Lab", teacherName: "Mr. Peter Kipkemoi", room: "Lab 1" },
  { id: "tt_10", form: "Form 3", stream: "East", day: "Tuesday", period: 2, timeString: "08:40 - 09:20", subject: "Chemistry Lab", teacherName: "Mr. Peter Kipkemoi", room: "Lab 1" },
  { id: "tt_11", form: "Form 3", stream: "East", day: "Tuesday", period: 3, timeString: "09:20 - 10:00", subject: "Mathematics", teacherName: "Ms. Faith Chelagat", room: "F3E" },
  { id: "tt_12", form: "Form 3", stream: "East", day: "Tuesday", period: 4, timeString: "10:20 - 11:00", subject: "English", teacherName: "Mrs. Grace Koech", room: "F3E" },
  { id: "tt_13", form: "Form 3", stream: "East", day: "Tuesday", period: 5, timeString: "11:00 - 11:40", subject: "Business Studies", teacherName: "Mr. Bernard Mutai", room: "F3E" },
  { id: "tt_14", form: "Form 3", stream: "East", day: "Tuesday", period: 6, timeString: "11:40 - 12:20", subject: "Kiswahili", teacherName: "Mr. Kiprotich Cheruiyot", room: "F3E" },
  { id: "tt_15", form: "Form 3", stream: "East", day: "Tuesday", period: 7, timeString: "14:00 - 14:40", subject: "History & Govt", teacherName: "Mr. Kiprotich Cheruiyot", room: "F3E" },
  { id: "tt_16", form: "Form 3", stream: "East", day: "Tuesday", period: 8, timeString: "14:40 - 15:20", subject: "Physical Education / Games", teacherName: "Mr. Geoffrey Korir", room: "Main Sports Pitch" }
];

let announcements = [
  {
    id: "ann_1",
    title: "Form 4 KCSE Candidates Strategic Academic Meeting",
    content: "All Form 4 candidates and their parents are cordially invited to the Academic Clinic & Target Setting Forum scheduled for Saturday 22nd March 2025 starting at 9:00 AM at the School Multipurpose Hall.",
    targetAudience: "Form 4 Candidates",
    priority: "Urgent",
    author: "Mr. Kiprotich Cheruiyot (Chief Principal)",
    date: "2025-03-01"
  },
  {
    id: "ann_2",
    title: "Term 1 School Fee Clearance Advisory",
    content: "Parents and guardians are reminded to settle outstanding Term 1 fee balances by Friday 14th March 2025 to enable smooth school operations and student academic stationery procurement. Kindly pay via Paybill 522123 or direct bank slip.",
    targetAudience: "Parents",
    priority: "Important",
    author: "Mr. David Sang (Bursar)",
    date: "2025-02-28"
  },
  {
    id: "ann_3",
    title: "Mid-Term Examination Results Release & Portal Access",
    content: "All subject teachers have successfully submitted Term 1 Mid-Term assessment marks. Students and parents can now access, review, and print their official digital Report Forms from their respective portals.",
    targetAudience: "All",
    priority: "Normal",
    author: "Mrs. Grace Koech (Deputy Principal)",
    date: "2025-02-26"
  },
  {
    id: "ann_4",
    title: "County Science & Engineering Fair 2025",
    content: "Congratulations to our Kaplong High School STEM team who qualified for the Regional Science Congress in Kisumu with their automated agricultural irrigation IoT project.",
    targetAudience: "Students",
    priority: "Normal",
    author: "Mr. Bernard Mutai (ICT & STEM Director)",
    date: "2025-02-20"
  }
];

let schoolEvents = [
  { id: "ev_1", title: "Mid-Term Break (Term 1)", category: "Holiday", date: "2025-03-12", endDate: "2025-03-16", location: "School-Wide", description: "Students break for 4 days mid-term rest." },
  { id: "ev_2", title: "Form 4 Parents & Candidates AGM", category: "Meeting", date: "2025-03-22", location: "Multipurpose Hall", description: "Strategic briefing and prayer day for KCSE candidates." },
  { id: "ev_3", title: "Inter-House Athletics & Rugby Championship", category: "Sports", date: "2025-03-28", location: "Main Sports Grounds", description: "Annual sports tournament featuring all four school houses." },
  { id: "ev_4", title: "End of Term 1 Examinations Begin", category: "Exam", date: "2025-04-01", endDate: "2025-04-10", location: "Examination Rooms", description: "Summative evaluations for Forms 1 to 4." },
  { id: "ev_5", title: "Term 1 Closes & Report Slip Dispatch", category: "Academic", date: "2025-04-11", location: "Assembly Ground", description: "Official dismissal of students for April holiday." }
];

let auditLogs = [
  { id: "log_1", timestamp: "2025-03-03 09:15:20", userId: "usr_teacher", userName: "Mr. Peter Kipkemoi", role: "teacher", action: "RESULT_ENTRY", details: "Entered Chemistry marks for Form 3 East Mid-Term exam (42 students)", ipAddress: "192.168.1.45" },
  { id: "log_2", timestamp: "2025-03-02 14:22:10", userId: "usr_bursar", userName: "Mr. David Sang", role: "bursar", action: "FEE_PAYMENT_RECORDED", details: "Recorded KES 5,000 payment for Brian Kiprono (Receipt KHS-REC-2025-0038)", ipAddress: "192.168.1.12" },
  { id: "log_3", timestamp: "2025-03-01 11:05:44", userId: "usr_admin", userName: "Eng. Emmanuel Rono", role: "super_admin", action: "STUDENT_REGISTERED", details: "Registered Daisy Chepngetich (Adm: KHS/2025/0701, Form 1)", ipAddress: "192.168.1.2" },
  { id: "log_4", timestamp: "2025-02-28 16:30:12", userId: "usr_principal", userName: "Mr. Kiprotich Cheruiyot", role: "principal", action: "ANNOUNCEMENT_POSTED", details: "Published Form 4 Candidates Academic Clinic notice", ipAddress: "192.168.1.5" }
];

function logAction(userId: string, userName: string, role: string, action: string, details: string, ip: string = "127.0.0.1") {
  auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    userId,
    userName,
    role,
    action,
    details,
    ipAddress: ip
  });
  if (auditLogs.length > 100) auditLogs.pop();
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Authentication
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  const hash = hashPassword(password);
  const user = users.find(u => (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) && u.passwordHash === hash);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  logAction(user.id, user.fullName, user.role, "USER_LOGIN", `Successful login as ${user.role}`);
  
  const { passwordHash, ...safeUser } = user;
  return res.json({
    token: `khs_jwt_token_${user.id}_${Date.now()}`,
    user: safeUser
  });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || "").toLowerCase());
  if (user) {
    user.passwordHash = hashPassword("Kaplong@2025");
    logAction(user.id, user.fullName, user.role, "PASSWORD_RESET", "Password reset to default (Kaplong@2025)");
    return res.json({ message: "Password reset instructions sent. Demo reset password is: Kaplong@2025" });
  }
  return res.json({ message: "If that email exists, password reset instructions have been dispatched." });
});

// 2. Students CRUD & Actions
app.get("/api/students", (req, res) => {
  const { form, stream, search, status } = req.query;
  let result = [...students];

  if (form && form !== "All") {
    result = result.filter(s => s.form === form);
  }
  if (stream && stream !== "All") {
    result = result.filter(s => s.stream === stream);
  }
  if (status && status !== "All") {
    result = result.filter(s => s.status === status);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(s => 
      s.fullName.toLowerCase().includes(q) || 
      s.admissionNo.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.homeCounty.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.get("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id === req.params.id || s.admissionNo === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

app.post("/api/students", (req, res) => {
  const data = req.body;
  if (!data.fullName || !data.form || !data.stream) {
    return res.status(400).json({ error: "Missing required student details" });
  }

  const nextAdmNumber = `KHS/${new Date().getFullYear()}/${String(Math.floor(1000 + Math.random() * 9000))}`;
  const newStudent = {
    id: `stu_${Date.now()}`,
    admissionNo: data.admissionNo || nextAdmNumber,
    fullName: data.fullName,
    gender: data.gender || "Male",
    dob: data.dob || "2008-01-01",
    form: data.form,
    stream: data.stream,
    admissionDate: data.admissionDate || new Date().toISOString().split("T")[0],
    status: data.status || "Active",
    parentName: data.parentName || "Guardian",
    parentPhone: data.parentPhone || "+254 700 000 000",
    parentEmail: data.parentEmail || "",
    emergencyContact: data.emergencyContact || data.parentPhone || "",
    homeCounty: data.homeCounty || "Bomet",
    previousSchool: data.previousSchool || "Local Primary",
    kcpeMarks: Number(data.kcpeMarks) || 350,
    medicalNotes: data.medicalNotes || "None",
    termFeesDue: data.termFeesDue ? Number(data.termFeesDue) : 18500,
    termFeesPaid: 0,
    houseOrDorm: data.houseOrDorm || "Longonot House",
    photo: data.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  };

  students.unshift(newStudent);
  logAction("admin", "Administrator", "super_admin", "STUDENT_CREATED", `Admitted new student ${newStudent.fullName} (${newStudent.admissionNo})`);
  res.status(201).json(newStudent);
});

app.put("/api/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  students[index] = { ...students[index], ...req.body };
  logAction("admin", "Administrator", "super_admin", "STUDENT_UPDATED", `Updated profile for ${students[index].fullName} (${students[index].admissionNo})`);
  res.json(students[index]);
});

app.delete("/api/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const removed = students.splice(index, 1)[0];
  logAction("admin", "Administrator", "super_admin", "STUDENT_ARCHIVED", `Archived student ${removed.fullName} (${removed.admissionNo})`);
  res.json({ message: "Student record archived successfully", student: removed });
});

app.post("/api/students/:id/promote", (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const formSequence: Record<string, string> = {
    "Form 1": "Form 2",
    "Form 2": "Form 3",
    "Form 3": "Form 4",
    "Form 4": "Alumni"
  };

  const nextForm = formSequence[student.form];
  if (!nextForm) return res.status(400).json({ error: "Cannot promote this student" });

  if (nextForm === "Alumni") {
    student.status = "Alumni";
  } else {
    student.form = nextForm as any;
  }

  logAction("admin", "Administrator", "super_admin", "STUDENT_PROMOTED", `Promoted ${student.fullName} from ${student.form} to ${nextForm}`);
  res.json({ message: `Successfully promoted to ${nextForm}`, student });
});

// 3. Staff & Teachers CRUD
app.get("/api/staff", (req, res) => {
  const { department, role, search } = req.query;
  let result = [...staffList];

  if (department && department !== "All") {
    result = result.filter(s => s.department === department);
  }
  if (role === "teaching") {
    result = result.filter(s => s.isTeaching);
  } else if (role === "non-teaching") {
    result = result.filter(s => !s.isTeaching);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(s => 
      s.fullName.toLowerCase().includes(q) ||
      s.staffId.toLowerCase().includes(q) ||
      s.roleTitle.toLowerCase().includes(q)
    );
  }
  res.json(result);
});

app.post("/api/staff", (req, res) => {
  const data = req.body;
  if (!data.fullName || !data.phone || !data.email) {
    return res.status(400).json({ error: "Missing required staff information" });
  }
  const newStaff = {
    id: `stf_${Date.now()}`,
    staffId: data.staffId || `TSC/${Math.floor(100000 + Math.random() * 900000)}`,
    fullName: data.fullName,
    gender: data.gender || "Male",
    phone: data.phone,
    email: data.email,
    department: data.department || "Humanities",
    subjectsTaught: Array.isArray(data.subjectsTaught) ? data.subjectsTaught : (data.subjectsTaught ? [data.subjectsTaught] : []),
    classesAssigned: Array.isArray(data.classesAssigned) ? data.classesAssigned : (data.classesAssigned ? [data.classesAssigned] : []),
    employmentStatus: data.employmentStatus || "Active",
    dateJoined: data.dateJoined || new Date().toISOString().split("T")[0],
    qualification: data.qualification || "B.Ed",
    roleTitle: data.roleTitle || "Class Teacher",
    isTeaching: data.isTeaching !== false
  };

  staffList.unshift(newStaff);
  logAction("admin", "Administrator", "super_admin", "STAFF_ADDED", `Added staff member ${newStaff.fullName} (${newStaff.staffId})`);
  res.status(201).json(newStaff);
});

app.put("/api/staff/:id", (req, res) => {
  const index = staffList.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Staff member not found" });

  staffList[index] = { ...staffList[index], ...req.body };
  logAction("admin", "Administrator", "super_admin", "STAFF_UPDATED", `Updated record for ${staffList[index].fullName}`);
  res.json(staffList[index]);
});

app.delete("/api/staff/:id", (req, res) => {
  const index = staffList.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Staff not found" });
  const removed = staffList.splice(index, 1)[0];
  logAction("admin", "Administrator", "super_admin", "STAFF_DELETED", `Removed staff record ${removed.fullName}`);
  res.json({ message: "Staff removed", staff: removed });
});

// 4. Academics, Subjects & Structure
app.get("/api/academics/subjects", (req, res) => {
  res.json(subjects);
});

app.post("/api/academics/subjects", (req, res) => {
  const { code, name, department, isCompulsory, formsOffered } = req.body;
  if (!code || !name) return res.status(400).json({ error: "Subject code and name required" });

  const newSub = {
    id: `sub_${Date.now()}`,
    code,
    name,
    department: department || "Languages",
    isCompulsory: Boolean(isCompulsory),
    formsOffered: formsOffered || ["Form 1", "Form 2", "Form 3", "Form 4"]
  };
  subjects.push(newSub);
  logAction("admin", "Administrator", "super_admin", "SUBJECT_CREATED", `Added subject ${code} - ${name}`);
  res.status(201).json(newSub);
});

// 5. Examinations & Marks & Kenyan Report Form
app.get("/api/exams", (req, res) => {
  res.json(exams);
});

app.post("/api/exams", (req, res) => {
  const { title, type, term, year, form, date } = req.body;
  if (!title || !type) return res.status(400).json({ error: "Exam title and type required" });

  const newExam = {
    id: `ex_${Date.now()}`,
    title,
    type,
    term: term || "Term 1",
    year: Number(year) || 2025,
    form: form || "Form 3",
    date: date || new Date().toISOString().split("T")[0],
    isPublished: true
  };
  exams.unshift(newExam);
  logAction("teacher", "Exams Office", "teacher", "EXAM_CREATED", `Scheduled exam: ${title}`);
  res.status(201).json(newExam);
});

app.get("/api/exams/:examId/results", (req, res) => {
  const results = examResults.filter(r => r.examId === req.params.examId);
  res.json(results);
});

app.post("/api/exams/marks", (req, res) => {
  const { examId, studentId, subjectCode, marks, teacherRemarks } = req.body;
  if (!examId || !studentId || !subjectCode || marks === undefined) {
    return res.status(400).json({ error: "Missing required marks fields" });
  }

  const markNum = Math.min(100, Math.max(0, Number(marks)));
  const { grade, points, remarks } = calculateKnecGrade(markNum);

  const existingIndex = examResults.findIndex(r => r.examId === examId && r.studentId === studentId && r.subjectCode === subjectCode);

  const resultObj = {
    id: existingIndex !== -1 ? examResults[existingIndex].id : `res_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    examId,
    studentId,
    subjectCode,
    marks: markNum,
    grade,
    points,
    teacherRemarks: teacherRemarks || remarks
  };

  if (existingIndex !== -1) {
    examResults[existingIndex] = resultObj;
  } else {
    examResults.push(resultObj);
  }

  logAction("teacher", "Subject Teacher", "teacher", "MARKS_ENTERED", `Entered ${marks}% (${grade}) for subject ${subjectCode}`);
  res.json(resultObj);
});

// Official Report Card Generation for a student
app.get("/api/exams/report-card/:studentId", (req, res) => {
  const { studentId } = req.params;
  const student = students.find(s => s.id === studentId || s.admissionNo === studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  // Get results for this student
  const studentMarks = examResults.filter(r => r.studentId === student.id);
  
  // Attach subject names
  const subjectBreakdown = studentMarks.map(m => {
    const sub = subjects.find(s => s.code === m.subjectCode);
    return {
      code: m.subjectCode,
      name: sub ? sub.name : `Subject ${m.subjectCode}`,
      department: sub ? sub.department : "General",
      marks: m.marks,
      grade: m.grade,
      points: m.points,
      teacherRemarks: m.teacherRemarks
    };
  });

  const totalMarks = subjectBreakdown.reduce((sum, item) => sum + item.marks, 0);
  const totalPoints = subjectBreakdown.reduce((sum, item) => sum + item.points, 0);
  const subjectCount = subjectBreakdown.length || 1;
  const meanMarks = Math.round((totalMarks / subjectCount) * 10) / 10;
  const meanPoints = Math.round((totalPoints / subjectCount) * 10) / 10;
  const overallKnec = calculateKnecGrade(meanMarks);

  // Determine Class Position
  const peersInClass = students.filter(s => s.form === student.form && s.stream === student.stream);
  const classSize = peersInClass.length;
  // Brian Kiprono ranks #2 in Form 3 East demo
  const positionInClass = student.fullName.includes("Mercy") ? 1 : student.fullName.includes("Brian") ? 2 : 4;

  const reportCard = {
    school: schoolSettings,
    student,
    exam: exams[0],
    term: schoolSettings.currentTerm,
    year: schoolSettings.currentAcademicYear,
    subjects: subjectBreakdown,
    summary: {
      totalMarks,
      totalPoints,
      subjectCount,
      meanMarks,
      meanPoints,
      overallGrade: overallKnec.grade,
      positionInClass: `${positionInClass} out of ${classSize}`,
      classTeacherRemarks: "An intellectually gifted and disciplined student. Keeps improving in sciences.",
      principalRemarks: "Remarkable academic consistency. Aim for straight A's in upcoming KCSE preparation.",
      termDates: {
        closingDate: "11th April 2025",
        openingDate: "5th May 2025"
      },
      nextTermFee: 18500
    }
  };

  res.json(reportCard);
});

// 6. Fees, M-Pesa & Financial Reports
app.get("/api/fees/structures", (req, res) => {
  res.json(feeStructures);
});

app.get("/api/fees/payments", (req, res) => {
  res.json(feePayments);
});

app.post("/api/fees/payments", (req, res) => {
  const { studentId, amount, paymentMethod, referenceNo, remarks, term, year } = req.body;
  if (!studentId || !amount) {
    return res.status(400).json({ error: "Student and amount are required" });
  }

  const student = students.find(s => s.id === studentId || s.admissionNo === studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const numAmount = Number(amount);
  const receiptNo = `KHS-REC-${year || 2025}-${String(feePayments.length + 1).padStart(4, "0")}`;
  
  // Real or generated reference
  let ref = referenceNo;
  if (!ref) {
    if (paymentMethod === "M-Pesa") {
      ref = `Q${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000000 + Math.random() * 9000000)}`;
    } else {
      ref = `BNK-${Math.floor(100000 + Math.random() * 900000)}`;
    }
  }

  const payment = {
    id: `pay_${Date.now()}`,
    receiptNo,
    studentId: student.id,
    studentName: student.fullName,
    admissionNo: student.admissionNo,
    form: `${student.form} ${student.stream}`,
    amount: numAmount,
    paymentMethod: paymentMethod || "M-Pesa",
    referenceNo: ref,
    paymentDate: new Date().toISOString().split("T")[0],
    recordedBy: "Mr. David Sang (Bursar)",
    term: term || "Term 1",
    year: year || 2025,
    remarks: remarks || "School fee contribution"
  };

  feePayments.unshift(payment);
  student.termFeesPaid += numAmount;

  logAction("bursar", "Mr. David Sang", "bursar", "PAYMENT_RECORDED", `Receipt ${receiptNo}: Received KES ${numAmount.toLocaleString()} for ${student.fullName} via ${payment.paymentMethod} (${payment.referenceNo})`);
  res.status(201).json(payment);
});

// Student Official Fee Statement
app.get("/api/fees/statement/:studentId", (req, res) => {
  const student = students.find(s => s.id === req.params.studentId || s.admissionNo === req.params.studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const payments = feePayments.filter(p => p.studentId === student.id);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = Math.max(0, student.termFeesDue - totalPaid);

  const statement = {
    school: schoolSettings,
    student,
    dateGenerated: new Date().toLocaleDateString("en-GB"),
    academicYear: schoolSettings.currentAcademicYear,
    currentTerm: schoolSettings.currentTerm,
    invoices: [
      { date: "2025-01-06", description: "Term 1 Tuition & Boarding Fees", debit: student.termFeesDue, credit: 0, balance: student.termFeesDue }
    ],
    payments: payments.map(p => ({
      receiptNo: p.receiptNo,
      date: p.paymentDate,
      method: p.paymentMethod,
      reference: p.referenceNo,
      amount: p.amount,
      remarks: p.remarks
    })),
    summary: {
      totalBilled: student.termFeesDue,
      totalPaid: totalPaid,
      outstandingBalance: balance,
      paymentStatus: balance === 0 ? "Fully Cleared" : balance < 5000 ? "Minimal Balance" : "Payment Required"
    }
  };

  res.json(statement);
});

// 7. Attendance Tracking
app.get("/api/attendance", (req, res) => {
  const { form, stream, date } = req.query;
  let result = [...attendanceRecords];
  if (form && form !== "All") result = result.filter(a => a.form === form);
  if (stream && stream !== "All") result = result.filter(a => a.stream === stream);
  if (date) result = result.filter(a => a.date === date);
  res.json(result);
});

app.post("/api/attendance", (req, res) => {
  const { records } = req.body; // Array of { studentId, form, stream, date, status, remarks }
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: "Expected an array of attendance records" });
  }

  records.forEach(r => {
    const existingIndex = attendanceRecords.findIndex(a => a.studentId === r.studentId && a.date === r.date);
    const newRecord = {
      id: existingIndex !== -1 ? attendanceRecords[existingIndex].id : `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      studentId: r.studentId,
      form: r.form,
      stream: r.stream,
      date: r.date || new Date().toISOString().split("T")[0],
      status: r.status || "Present",
      remarks: r.remarks || ""
    };

    if (existingIndex !== -1) {
      attendanceRecords[existingIndex] = newRecord;
    } else {
      attendanceRecords.unshift(newRecord);
    }
  });

  logAction("teacher", "Class Teacher", "teacher", "ATTENDANCE_MARKED", `Marked attendance roll-call for ${records.length} students`);
  res.json({ message: "Attendance saved successfully", count: records.length });
});

// 8. Discipline Records
app.get("/api/discipline", (req, res) => {
  res.json(disciplineRecords);
});

app.post("/api/discipline", (req, res) => {
  const { studentId, title, description, category, actionTaken, reportedBy, status } = req.body;
  const student = students.find(s => s.id === studentId || s.admissionNo === studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const record = {
    id: `disc_${Date.now()}`,
    studentId: student.id,
    studentName: student.fullName,
    admissionNo: student.admissionNo,
    form: `${student.form} ${student.stream}`,
    incidentDate: new Date().toISOString().split("T")[0],
    title: title || "Disciplinary Occurrence",
    description: description || "",
    category: category || "Minor",
    actionTaken: actionTaken || "Reprimand",
    reportedBy: reportedBy || "Duty Teacher",
    status: status || "Pending",
    followUpDate: req.body.followUpDate || "N/A"
  };

  disciplineRecords.unshift(record);
  logAction("deputy", "Mrs. Grace Koech", "deputy_principal", "DISCIPLINE_RECORDED", `Logged incident for ${student.fullName}: ${record.title}`);
  res.status(201).json(record);
});

app.put("/api/discipline/:id", (req, res) => {
  const index = disciplineRecords.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Record not found" });
  disciplineRecords[index] = { ...disciplineRecords[index], ...req.body };
  res.json(disciplineRecords[index]);
});

// 9. Timetable
app.get("/api/timetable", (req, res) => {
  const { form, stream, day } = req.query;
  let result = [...timetable];
  if (form && form !== "All") result = result.filter(t => t.form === form);
  if (stream && stream !== "All") result = result.filter(t => t.stream === stream);
  if (day && day !== "All") result = result.filter(t => t.day === day);
  res.json(result);
});

app.post("/api/timetable", (req, res) => {
  const { form, stream, day, period, timeString, subject, teacherName, room } = req.body;
  const newSlot = {
    id: `tt_${Date.now()}`,
    form: form || "Form 3",
    stream: stream || "East",
    day: day || "Monday",
    period: Number(period) || 1,
    timeString: timeString || "08:00 - 08:40",
    subject: subject || "Mathematics",
    teacherName: teacherName || "Staff",
    room: room || "F3E"
  };
  timetable.push(newSlot);
  res.status(201).json(newSlot);
});

// 10. Announcements
app.get("/api/announcements", (req, res) => {
  res.json(announcements);
});

app.post("/api/announcements", (req, res) => {
  const { title, content, targetAudience, priority, author } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content required" });

  const newAnn = {
    id: `ann_${Date.now()}`,
    title,
    content,
    targetAudience: targetAudience || "All",
    priority: priority || "Normal",
    author: author || "Principal's Office",
    date: new Date().toISOString().split("T")[0]
  };

  announcements.unshift(newAnn);
  logAction("principal", "Principal Office", "principal", "ANNOUNCEMENT_POSTED", `Published: ${title} to ${newAnn.targetAudience}`);
  res.status(201).json(newAnn);
});

app.delete("/api/announcements/:id", (req, res) => {
  const index = announcements.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Announcement not found" });
  const removed = announcements.splice(index, 1)[0];
  res.json({ message: "Announcement deleted", item: removed });
});

// 11. School Events
app.get("/api/events", (req, res) => {
  res.json(schoolEvents);
});

app.post("/api/events", (req, res) => {
  const { title, category, date, endDate, location, description } = req.body;
  const newEvent = {
    id: `ev_${Date.now()}`,
    title,
    category: category || "Academic",
    date: date || new Date().toISOString().split("T")[0],
    endDate: endDate || date,
    location: location || "School Grounds",
    description: description || ""
  };
  schoolEvents.push(newEvent);
  res.status(201).json(newEvent);
});

// 12. Dashboard Analytics & Reporting Center
app.get("/api/reports/analytics", (req, res) => {
  const totalStudents = students.length;
  const maleStudents = students.filter(s => s.gender === "Male").length;
  const femaleStudents = students.filter(s => s.gender === "Female").length;

  const formCounts = {
    "Form 1": students.filter(s => s.form === "Form 1").length,
    "Form 2": students.filter(s => s.form === "Form 2").length,
    "Form 3": students.filter(s => s.form === "Form 3").length,
    "Form 4": students.filter(s => s.form === "Form 4").length
  };

  const teachingStaff = staffList.filter(s => s.isTeaching).length;
  const nonTeachingStaff = staffList.filter(s => !s.isTeaching).length;

  const totalFeesExpected = students.reduce((acc, s) => acc + s.termFeesDue, 0);
  const totalFeesCollected = feePayments.reduce((acc, p) => acc + p.amount, 0);
  const outstandingFees = Math.max(0, totalFeesExpected - totalFeesCollected);
  const collectionRate = totalFeesExpected > 0 ? Math.round((totalFeesCollected / totalFeesExpected) * 100) : 0;

  // KCSE Grade Distribution / Term exam analysis
  const gradesCount: Record<string, number> = { A: 0, "A-": 0, "B+": 0, B: 0, "B-": 0, "C+": 0, C: 0, "C-": 0, "D+": 0, D: 0, "D-": 0, E: 0 };
  examResults.forEach(r => {
    if (gradesCount[r.grade] !== undefined) {
      gradesCount[r.grade]++;
    }
  });

  const attendanceRate = 96.4; // % attendance metric

  res.json({
    totalStudents,
    maleStudents,
    femaleStudents,
    formCounts,
    teachingStaff,
    nonTeachingStaff,
    financials: {
      totalFeesExpected,
      totalFeesCollected,
      outstandingFees,
      collectionRate
    },
    gradesCount,
    attendanceRate,
    recentPayments: feePayments.slice(0, 5),
    recentAnnouncements: announcements.slice(0, 4),
    upcomingEvents: schoolEvents.slice(0, 4)
  });
});

// 13. Audit Logs
app.get("/api/audit-logs", (req, res) => {
  res.json(auditLogs);
});

// 14. Global Search
app.get("/api/search", (req, res) => {
  const q = String(req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ students: [], staff: [], announcements: [], payments: [] });

  const matchedStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(q) || 
    s.admissionNo.toLowerCase().includes(q) ||
    s.parentName.toLowerCase().includes(q)
  ).slice(0, 6);

  const matchedStaff = staffList.filter(s => 
    s.fullName.toLowerCase().includes(q) || 
    s.staffId.toLowerCase().includes(q) || 
    s.department.toLowerCase().includes(q)
  ).slice(0, 6);

  const matchedAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(q) || 
    a.content.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedPayments = feePayments.filter(p => 
    p.receiptNo.toLowerCase().includes(q) || 
    p.referenceNo.toLowerCase().includes(q) || 
    p.studentName.toLowerCase().includes(q)
  ).slice(0, 4);

  res.json({
    students: matchedStudents,
    staff: matchedStaff,
    announcements: matchedAnnouncements,
    payments: matchedPayments
  });
});

// 15. System Settings
app.get("/api/settings", (req, res) => {
  res.json(schoolSettings);
});

app.put("/api/settings", (req, res) => {
  schoolSettings = { ...schoolSettings, ...req.body };
  logAction("admin", "Administrator", "super_admin", "SETTINGS_UPDATED", "Updated school configuration & contact details");
  res.json(schoolSettings);
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kaplong High School SMS] Server live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
