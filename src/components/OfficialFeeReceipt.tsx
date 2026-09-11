import React from "react";
import { Printer, X, CheckCircle, ShieldCheck } from "lucide-react";
import { SchoolCrest } from "./SchoolCrest";
import { FeePayment, SchoolSettings } from "../types";

interface OfficialFeeReceiptProps {
  payment: FeePayment;
  school: SchoolSettings;
  onClose?: () => void;
}

export const OfficialFeeReceipt: React.FC<OfficialFeeReceiptProps> = ({
  payment,
  school,
  onClose
}) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Modal Action Bar */}
        <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">
              Official School Fee Receipt &bull; {payment.receiptNo}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
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

        {/* PRINTABLE RECEIPT BODY */}
        <div className="p-6 sm:p-8 text-slate-800 text-xs sm:text-sm font-sans leading-relaxed relative">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-emerald-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <SchoolCrest size="md" withText={false} />
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-emerald-950 uppercase font-serif">
                  {school?.schoolName || "Kaplong High School"}
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">
                  {school?.poBox}, {school?.town} &bull; County: {school?.county}
                </p>
                <p className="text-[10px] text-slate-500">
                  Tel: {school?.phone1} &bull; KNEC: {school?.knecCode}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-sm text-xs font-mono">
                OFFICIAL RECEIPT
              </span>
              <p className="text-emerald-800 font-mono font-bold text-xs mt-1">
                {payment.receiptNo}
              </p>
              <p className="text-[11px] text-slate-500">Date: {payment.paymentDate}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Student Name:</span>
                <strong className="text-slate-900 text-sm font-bold">{payment.studentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Admission Number:</span>
                <strong className="text-emerald-800 font-mono font-bold">{payment.admissionNo}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Class / Stream:</span>
                <strong className="text-slate-800">{payment.form}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Academic Term:</span>
                <strong className="text-slate-800">{payment.term} - {payment.year}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Payment Mode:</span>
                <strong className="text-slate-800 flex items-center gap-1">
                  {payment.paymentMethod}
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded-sm">Verified</span>
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Reference / M-Pesa Code:</span>
                <strong className="text-emerald-900 font-mono font-bold">{payment.referenceNo}</strong>
              </div>
            </div>
          </div>

          {/* Payment Amount Highlight */}
          <div className="border border-emerald-200 bg-emerald-50/70 p-4 rounded-lg flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider block">
                Amount Received in Kenyan Shillings
              </span>
              <span className="text-2xl font-extrabold text-emerald-950 font-mono">
                KES {payment.amount.toLocaleString()}.00
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-700 block italic">Particulars:</span>
              <span className="text-xs font-medium text-emerald-900">{payment.remarks || "Term Tuition & Boarding"}</span>
            </div>
          </div>

          {/* Signatures & Stamp */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-200 relative">
            <div>
              <p className="text-[11px] text-slate-500">Issued by:</p>
              <p className="font-semibold text-slate-800">{payment.recordedBy}</p>
              <p className="text-[10px] text-slate-400">School Bursary Department</p>
            </div>

            {/* School Stamp Seal Graphic */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-700/50 flex items-center justify-center rotate-[-10deg] pointer-events-none select-none">
              <div className="text-center text-emerald-800/70 font-bold text-[8px] uppercase">
                <div>Kaplong High School</div>
                <div className="text-[11px] font-extrabold">&#9733; PAID &#9733;</div>
                <div>BURSAR'S OFFICE</div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-slate-500">Official Signature:</p>
              <p className="font-serif italic font-bold text-slate-800 text-sm">D. Sang (Bursar)</p>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-6 print:mt-10">
            Fees once paid are non-refundable. Please preserve this official computer-generated receipt for clearance.
          </p>
        </div>
      </div>
    </div>
  );
};
