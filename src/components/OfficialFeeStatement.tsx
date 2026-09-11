import React from "react";
import { Printer, X, FileText, Smartphone } from "lucide-react";
import { SchoolCrest } from "./SchoolCrest";

interface OfficialFeeStatementProps {
  statementData: any;
  onClose?: () => void;
}

export const OfficialFeeStatement: React.FC<OfficialFeeStatementProps> = ({
  statementData,
  onClose
}) => {
  if (!statementData) return null;

  const { school, student, invoices, payments, summary, dateGenerated, currentTerm, academicYear } = statementData;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full my-auto overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Action Bar */}
        <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">
              Official Fee Statement &bull; {student.fullName} ({student.admissionNo})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Statement
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* PRINTABLE BODY */}
        <div className="p-6 sm:p-10 text-slate-800 text-xs sm:text-sm font-sans leading-normal">
          
          {/* Header */}
          <div className="border-b-2 border-emerald-900 pb-4 mb-5 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <SchoolCrest size="md" withText={false} />
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 uppercase font-serif">
                  {school.schoolName || "Kaplong High School"}
                </h2>
                <p className="text-xs text-slate-600">
                  {school.poBox}, {school.town} &bull; County: {school.county}
                </p>
                <p className="text-[11px] text-slate-500">
                  Accounts Office &bull; Paybill: <strong>{school.mpesaPaybill}</strong>
                </p>
              </div>
            </div>
            <div className="mt-2 bg-emerald-900 text-white py-1 px-4 text-center font-bold text-xs uppercase tracking-wider rounded-sm">
              Official Student Fee Statement & Ledger &bull; {currentTerm} {academicYear}
            </div>
          </div>

          {/* Student Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name:</span>
              <strong className="text-slate-900">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission Number:</span>
              <strong className="text-emerald-800 font-mono">{student.admissionNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Form / Stream:</span>
              <strong className="text-slate-900">{student.form} {student.stream}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Statement Date:</span>
              <strong className="text-slate-900">{dateGenerated}</strong>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Date</th>
                  <th className="p-2 border-r border-slate-300">Description / Ref</th>
                  <th className="p-2 border-r border-slate-300 text-right">Debit (Billed)</th>
                  <th className="p-2 border-r border-slate-300 text-right">Credit (Paid)</th>
                  <th className="p-2 text-right">Balance (KES)</th>
                </tr>
              </thead>
              <tbody>
                {invoices && invoices.map((inv: any, idx: number) => (
                  <tr key={`inv_${idx}`} className="bg-white border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-slate-600 font-mono">{inv.date}</td>
                    <td className="p-2 border-r border-slate-200 font-medium text-slate-900">{inv.description}</td>
                    <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-900">
                      {inv.debit ? inv.debit.toLocaleString() : "-"}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-600">-</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">
                      {inv.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {payments && payments.map((p: any, idx: number) => (
                  <tr key={`pay_${idx}`} className="bg-emerald-50/40 border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-slate-600 font-mono">{p.date}</td>
                    <td className="p-2 border-r border-slate-200">
                      <span className="font-semibold text-emerald-900">{p.method} Payment</span>
                      <span className="block text-[10px] text-slate-500">Ref: {p.reference} &bull; Rec: {p.receiptNo}</span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-400">-</td>
                    <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-emerald-700">
                      {p.amount.toLocaleString()}
                    </td>
                    <td className="p-2 text-right font-mono text-slate-600">
                      Receipt Logged
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td colSpan={2} className="p-2.5 text-right uppercase border-r border-slate-300">
                    Net Balance Summary:
                  </td>
                  <td className="p-2.5 text-right font-mono border-r border-slate-300">
                    KES {summary.totalBilled.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right font-mono text-emerald-700 border-r border-slate-300">
                    KES {summary.totalPaid.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right font-mono text-base font-extrabold text-red-600">
                    KES {summary.outstandingBalance.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] uppercase font-bold text-slate-600 block mb-1">Payment Status:</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-sm font-bold text-xs uppercase ${
                  summary.outstandingBalance === 0
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900"
                }`}>
                  {summary.paymentStatus}
                </span>
                <span className="text-xs text-slate-600">
                  Current Term Balance: <strong>KES {summary.outstandingBalance.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-lg border border-emerald-200">
              <span className="text-[11px] uppercase font-bold text-emerald-900 flex items-center gap-1 mb-1">
                <Smartphone className="w-3.5 h-3.5" />
                M-Pesa Paybill Instructions:
              </span>
              <p className="text-xs text-emerald-950">
                1. Lipa na M-Pesa &rarr; Paybill: <strong>{school.mpesaPaybill}</strong><br />
                2. Account Number: <strong>{student.admissionNo}</strong> (Adm No)<br />
                3. Enter Amount &amp; PIN. Retain M-Pesa SMS for instant verification.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-slate-200 pt-4 text-xs">
            <div>
              <p className="text-slate-500">Prepared by:</p>
              <p className="font-semibold text-slate-800">{school.bursarName}</p>
              <p className="text-[10px] text-slate-400">Accounts &amp; Finance Office</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Approved by:</p>
              <p className="font-semibold text-slate-800">{school.principalName}</p>
              <p className="text-[10px] text-slate-400">Chief Principal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
