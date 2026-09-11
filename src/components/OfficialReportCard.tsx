import React from "react";
import { Printer, Download, X, CheckCircle, Award } from "lucide-react";
import { SchoolCrest } from "./SchoolCrest";

interface OfficialReportCardProps {
  reportData: any;
  onClose?: () => void;
}

export const OfficialReportCard: React.FC<OfficialReportCardProps> = ({
  reportData,
  onClose
}) => {
  if (!reportData) return null;

  const { school, student, subjects, summary, term, year } = reportData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-auto overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden on Print) */}
        <div className="bg-slate-800 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm sm:text-base">
              Official Student Report Form &bull; {student.fullName} ({student.admissionNo})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
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

        {/* PRINTABLE REPORT CARD SHEET */}
        <div className="p-6 sm:p-10 bg-white text-slate-800 font-sans leading-normal">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-emerald-900 pb-5 mb-5 text-center relative">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
              <SchoolCrest size="lg" withText={false} />
              <div>
                <p className="text-xs tracking-widest text-slate-600 font-bold uppercase">
                  Republic of Kenya &bull; Ministry of Education
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif uppercase tracking-tight">
                  {school.schoolName || "Kaplong High School"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {school.poBox}, {school.town} &bull; County: {school.county}
                </p>
                <p className="text-xs text-slate-500">
                  KNEC Code: <strong className="text-slate-700">{school.knecCode}</strong> &bull; Email: {school.email}
                </p>
              </div>
            </div>

            <div className="inline-block bg-amber-50 border border-amber-300 px-4 py-1 rounded-full text-xs font-bold text-amber-900 uppercase tracking-wide mt-1">
              Motto: {school.motto}
            </div>

            <div className="mt-4 bg-emerald-900 text-white py-1 px-4 text-center font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm">
              Official Student Academic Progress Report &bull; {term} {year}
            </div>
          </div>

          {/* Student Particulars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">Student Name:</span>
              <strong className="text-slate-900 font-bold">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">Admission Number:</span>
              <strong className="text-emerald-800 font-mono font-bold">{student.admissionNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">Class / Stream:</span>
              <strong className="text-slate-900 font-bold">{student.form} {student.stream}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">KCPE Entry Marks:</span>
              <strong className="text-slate-900 font-bold">{student.kcpeMarks || "380"} / 500</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">House / Dormitory:</span>
              <strong className="text-slate-900">{student.houseOrDorm || "Longonot House"}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">Class Position:</span>
              <strong className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-sm font-bold">
                {summary.positionInClass}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">Overall Mean Grade:</span>
              <strong className="text-white bg-emerald-800 px-2.5 py-0.5 rounded-sm font-extrabold text-sm">
                {summary.overallGrade} ({summary.meanPoints} Pts)
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-semibold">Term Mean Marks:</span>
              <strong className="text-slate-900 font-bold">{summary.meanMarks}%</strong>
            </div>
          </div>

          {/* Subject Performance Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-center font-bold">
                  <th className="p-2 border-r border-slate-300 text-left w-12">Code</th>
                  <th className="p-2 border-r border-slate-300 text-left">Subject Title</th>
                  <th className="p-2 border-r border-slate-300 w-16">Marks (%)</th>
                  <th className="p-2 border-r border-slate-300 w-16">Grade</th>
                  <th className="p-2 border-r border-slate-300 w-14">Points</th>
                  <th className="p-2 border-r border-slate-300 text-left">Subject Teacher Remarks</th>
                  <th className="p-2 w-16">Sign</th>
                </tr>
              </thead>
              <tbody>
                {subjects && subjects.map((sub: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="p-2 border-r border-b border-slate-200 font-mono font-medium text-center">{sub.code}</td>
                    <td className="p-2 border-r border-b border-slate-200 font-semibold text-slate-900">{sub.name}</td>
                    <td className="p-2 border-r border-b border-slate-200 text-center font-bold text-slate-800">{sub.marks}</td>
                    <td className="p-2 border-r border-b border-slate-200 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-xs ${
                        sub.grade.startsWith("A") ? "bg-emerald-100 text-emerald-900" :
                        sub.grade.startsWith("B") ? "bg-blue-100 text-blue-900" :
                        sub.grade.startsWith("C") ? "bg-amber-100 text-amber-900" :
                        "bg-red-100 text-red-900"
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="p-2 border-r border-b border-slate-200 text-center font-medium">{sub.points}</td>
                    <td className="p-2 border-r border-b border-slate-200 text-slate-700 italic text-[11px]">{sub.teacherRemarks}</td>
                    <td className="p-2 border-b border-slate-200 text-center font-serif text-slate-400">P.K</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50 font-bold border-t-2 border-emerald-900 text-slate-900">
                  <td colSpan={2} className="p-2.5 text-right font-extrabold uppercase border-r border-slate-300">
                    Grand Totals & Overall Evaluation:
                  </td>
                  <td className="p-2.5 text-center font-extrabold text-emerald-900 border-r border-slate-300">
                    {summary.totalMarks}
                  </td>
                  <td className="p-2.5 text-center font-extrabold text-emerald-900 border-r border-slate-300">
                    {summary.overallGrade}
                  </td>
                  <td className="p-2.5 text-center font-extrabold text-emerald-900 border-r border-slate-300">
                    {summary.totalPoints}
                  </td>
                  <td colSpan={2} className="p-2.5 text-xs text-emerald-950">
                    Mean Mark: <strong>{summary.meanMarks}%</strong> &bull; Average Points: <strong>{summary.meanPoints} / 12.0</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Remarks and Stamp Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 p-4 rounded-lg bg-slate-50 text-xs mb-6 relative">
            
            {/* Watermark Official Stamp simulation */}
            <div className="absolute right-12 bottom-4 w-28 h-28 rounded-full border-4 border-dashed border-emerald-700/40 flex items-center justify-center rotate-[-12deg] pointer-events-none select-none">
              <div className="text-center text-emerald-800/60 font-bold text-[9px] uppercase tracking-wider">
                <div>Kaplong High School</div>
                <div className="text-[14px]">&#9733; OFFICE &#9733;</div>
                <div>APPROVED</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase block tracking-wider">Class Teacher's Remarks:</span>
              <p className="italic text-slate-700 bg-white p-2.5 rounded-sm border border-slate-200 min-h-[48px]">
                "{summary.classTeacherRemarks}"
              </p>
              <div className="flex justify-between items-end pt-1">
                <span>Signature: <strong className="font-serif italic">P. Kipkemoi</strong></span>
                <span>Date: <strong>11th April 2025</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase block tracking-wider">Chief Principal's Comments:</span>
              <p className="italic text-slate-700 bg-white p-2.5 rounded-sm border border-slate-200 min-h-[48px]">
                "{summary.principalRemarks}"
              </p>
              <div className="flex justify-between items-end pt-1">
                <span>Signature: <strong className="font-serif italic font-bold">K. Cheruiyot</strong></span>
                <span>Date: <strong>11th April 2025</strong></span>
              </div>
            </div>
          </div>

          {/* Next Term Dates & Fee Notice */}
          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-md text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <strong>Next Term Schedule:</strong>
              <span className="ml-2">School Opens: <strong>{summary.termDates.openingDate}</strong></span>
              <span className="ml-3">School Closes: <strong>{summary.termDates.closingDate}</strong></span>
            </div>
            <div>
              <span>Next Term Fee: <strong className="text-emerald-900 font-bold font-mono">KES {summary.nextTermFee.toLocaleString()}</strong></span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 mt-6 print:mt-12">
            This document is an authentic digital academic report issued by Kaplong High School Management Information System &bull; Verified by Principal's Office
          </div>
        </div>
      </div>
    </div>
  );
};
