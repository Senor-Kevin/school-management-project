import React, { useState } from "react";
import { 
  Wallet, 
  Smartphone, 
  CreditCard, 
  FileText, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  Building,
  TrendingUp,
  X
} from "lucide-react";
import { FeePayment, FeeStructure, Student, SchoolSettings } from "../types";
import { api } from "../lib/api";

interface FinanceModuleProps {
  feePayments: FeePayment[];
  feeStructures: FeeStructure[];
  students: Student[];
  settings: SchoolSettings;
  onRefresh: () => void;
  onOpenReceipt: (payment: FeePayment) => void;
  onOpenStatement: (studentId: string) => void;
  currentRole: string;
  studentId?: string;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  feePayments,
  feeStructures,
  students,
  settings,
  onRefresh,
  onOpenReceipt,
  onOpenStatement,
  currentRole,
  studentId
}) => {
  const [activeTab, setActiveTab] = useState<"payments" | "structures" | "defaulters">("payments");
  const [search, setSearch] = useState("");
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Payment Form
  const [payData, setPayData] = useState({
    studentId: students[0]?.id || "",
    amount: 15000,
    paymentMethod: "M-Pesa Paybill" as const,
    referenceNo: "QK" + Math.floor(10000000 + Math.random() * 90000000),
    term: "Term 1",
    year: 2025,
    remarks: "Tuition & Boarding Fee"
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Metrics
  const totalCollected = feePayments.reduce((acc, p) => acc + p.amount, 0);
  const totalBilled = students.reduce((acc, s) => acc + s.termFeesDue, 0);
  const totalDebt = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : "0";

  // Filtered lists
  const filteredPayments = feePayments.filter(p => {
    const q = search.toLowerCase();
    return !search || 
      p.studentName.toLowerCase().includes(q) || 
      p.admissionNo.toLowerCase().includes(q) || 
      p.referenceNo.toLowerCase().includes(q) ||
      p.receiptNo.toLowerCase().includes(q);
  });

  const defaulters = students.filter(s => s.termFeesPaid < s.termFeesDue);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.recordPayment(payData);
      notify(`Payment receipt ${res.receiptNo} generated for ${res.studentName}!`);
      setIsRecordOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  // Student / Parent Portal Restricted View
  if (currentRole === "student" || currentRole === "parent") {
    const activeStudentId = studentId || "stu_1";
    const targetStudent = students.find(s => s.id === activeStudentId) || students[0];
    const myPayments = feePayments.filter(p => p.admissionNo === targetStudent.admissionNo);
    const balance = Math.max(0, targetStudent.termFeesDue - targetStudent.termFeesPaid);

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-800" />
              <span>School Fees Account &amp; Receipts</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Account Ledger for <strong className="text-slate-800">{targetStudent.fullName}</strong> ({targetStudent.admissionNo}) &bull; {targetStudent.form} {targetStudent.stream}
            </p>
          </div>
          <button
            onClick={() => onOpenStatement(targetStudent.id)}
            className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Fee Statement (PDF)</span>
          </button>
        </div>

        {/* Balance Card & Paybill Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
            <span className="text-xs font-semibold text-emerald-800 uppercase block">Term 1 Billed Fee</span>
            <span className="text-2xl font-black text-emerald-950 font-mono">KES {targetStudent.termFeesDue.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-700 block mt-1">Full Term Tuition &amp; Boarding</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
            <span className="text-xs font-semibold text-blue-800 uppercase block">Total Fees Paid</span>
            <span className="text-2xl font-black text-blue-950 font-mono">KES {targetStudent.termFeesPaid.toLocaleString()}</span>
            <span className="text-[11px] text-blue-700 block mt-1">Verified and Credited</span>
          </div>
          <div className={`p-5 rounded-xl border ${balance === 0 ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-200"}`}>
            <span className="text-xs font-semibold uppercase block text-slate-700">Outstanding Balance</span>
            <span className={`text-2xl font-black font-mono ${balance === 0 ? "text-emerald-900" : "text-red-700"}`}>
              KES {balance.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-600 block mt-1">
              {balance === 0 ? "Fee Cleared for Term 1" : "Due before Mid-Term break"}
            </span>
          </div>
        </div>

        {/* M-Pesa Instructions */}
        <div className="bg-emerald-950 text-white p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Smartphone className="w-5 h-5" />
            <span>Official M-Pesa Paybill Payment Procedure</span>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            School fees can be settled via our official Safaricom Paybill:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-emerald-900/60 p-4 rounded-lg border border-emerald-800">
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase">Business Number:</span>
              <strong className="text-lg font-mono text-white">{settings.mpesaPaybill}</strong>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase">Account Number:</span>
              <strong className="text-lg font-mono text-white">{targetStudent.admissionNo}</strong>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase">Recipient Name:</span>
              <strong className="text-base text-white">Kaplong High School</strong>
            </div>
          </div>
        </div>

        {/* Receipts Ledger */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
            Payment Receipts History
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">M-Pesa / Bank Ref</th>
                  <th className="p-3 text-right">Amount (KES)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">No payment records logged yet.</td>
                  </tr>
                ) : (
                  myPayments.map(p => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-900">{p.receiptNo}</td>
                      <td className="p-3 text-slate-600">{p.paymentDate}</td>
                      <td className="p-3">{p.paymentMethod}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{p.referenceNo}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-800">
                        {p.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onOpenReceipt(p)}
                          className="bg-emerald-100 text-emerald-900 hover:bg-emerald-200 px-2.5 py-1 rounded-sm text-xs font-semibold cursor-pointer"
                        >
                          Print Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Bursar & Administrator View
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-800" />
            <span>School Fees &amp; Bursary Accounts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile M-Pesa Paybill collections, bank deposits, fee defaulters, and official receipts.
          </p>
        </div>
        <button
          onClick={() => setIsRecordOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Fee Payment</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Expected Term Billing</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">KES {totalBilled.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Total across all Forms</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Collected Revenue</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">KES {totalCollected.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">Collection Rate: {collectionRate}%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-red-700 uppercase block">Total Fee Arrears</span>
          <span className="text-xl sm:text-2xl font-black text-red-600 font-mono">KES {totalDebt.toLocaleString()}</span>
          <span className="text-[11px] text-red-500 font-medium block mt-1">{defaulters.length} students with balance</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase block">M-Pesa Paybill</span>
          <span className="text-xl sm:text-2xl font-black text-blue-900 font-mono">{settings.mpesaPaybill}</span>
          <span className="text-[11px] text-blue-600 font-medium block mt-1">KCB &bull; Equity Bank Linked</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-2 transition cursor-pointer ${
            activeTab === "payments" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Recent Payments Ledger ({feePayments.length})
        </button>
        <button
          onClick={() => setActiveTab("defaulters")}
          className={`pb-2 transition cursor-pointer ${
            activeTab === "defaulters" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Fee Balances &amp; Defaulters ({defaulters.length})
        </button>
        <button
          onClick={() => setActiveTab("structures")}
          className={`pb-2 transition cursor-pointer ${
            activeTab === "structures" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Official Fee Structures (Form 1 - 4)
        </button>
      </div>

      {/* TAB 1: PAYMENTS LEDGER */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search payment by ref, name, or adm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <span className="text-xs text-slate-500">Showing {filteredPayments.length} transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Adm No</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Method &amp; Ref</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-emerald-900">{p.receiptNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{p.studentName}</td>
                    <td className="p-3 font-mono text-slate-700">{p.admissionNo}</td>
                    <td className="p-3 text-slate-600">{p.form}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">{p.paymentMethod}</span>
                      <span className="block text-[10px] text-emerald-800 font-mono">{p.referenceNo}</span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{p.paymentDate}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-800">
                      KES {p.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenReceipt(p)}
                        className="p-1.5 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition cursor-pointer"
                        title="Print Official Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEFAULTERS & BALANCES */}
      {activeTab === "defaulters" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold text-red-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{defaulters.length} students have outstanding fee balances</span>
            </span>
            <span className="text-[11px] text-slate-400">Total Arrears: KES {totalDebt.toLocaleString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="p-3">Adm No</th>
                  <th className="p-3">Student Full Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Parent Phone</th>
                  <th className="p-3 text-right">Term Billed</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Arrears / Balance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map(s => {
                  const bal = s.termFeesDue - s.termFeesPaid;
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-900">{s.admissionNo}</td>
                      <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                      <td className="p-3">{s.form} {s.stream}</td>
                      <td className="p-3 font-mono text-slate-600">{s.parentPhone}</td>
                      <td className="p-3 text-right font-mono">KES {s.termFeesDue.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-emerald-700">KES {s.termFeesPaid.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-red-600">KES {bal.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onOpenStatement(s.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-sm text-xs font-semibold cursor-pointer"
                        >
                          Statement
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FEE STRUCTURES */}
      {activeTab === "structures" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feeStructures.map(fs => (
            <div key={fs.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-serif">{fs.form} Fee Structure</h3>
                  <span className="text-xs text-emerald-800 font-medium">{fs.academicYear} &bull; Boarding &amp; Tuition</span>
                </div>
                <span className="text-lg font-extrabold text-slate-950 font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
                  KES {fs.totalAnnual.toLocaleString()} / Yr
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Term 1 (50%)</span>
                  <strong className="font-mono text-slate-900">KES {fs.term1.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Term 2 (30%)</span>
                  <strong className="font-mono text-slate-900">KES {fs.term2.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Term 3 (20%)</span>
                  <strong className="font-mono text-slate-900">KES {fs.term3.toLocaleString()}</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">Itemized Breakdown:</span>
                {fs.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                    <span>{item.category}</span>
                    <span className="font-mono font-medium text-slate-800">KES {item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full my-auto p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-serif flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-800" />
                <span>Record Fee Payment</span>
              </h3>
              <button onClick={() => setIsRecordOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={payData.studentId}
                  onChange={(e) => setPayData({ ...payData, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.admissionNo}) - {s.form}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    value={payData.amount}
                    onChange={(e) => setPayData({ ...payData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={payData.paymentMethod}
                    onChange={(e) => setPayData({ ...payData, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="M-Pesa Paybill">M-Pesa Paybill</option>
                    <option value="Bank Deposit Slip">Bank Deposit Slip</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Code / M-Pesa Transaction ID</label>
                <input
                  type="text"
                  required
                  value={payData.referenceNo}
                  onChange={(e) => setPayData({ ...payData, referenceNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  placeholder="e.g. QK89127834"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Remarks</label>
                <input
                  type="text"
                  value={payData.remarks}
                  onChange={(e) => setPayData({ ...payData, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="e.g. Term 1 Tuition balance"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  {loading ? "Processing..." : "Generate Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
