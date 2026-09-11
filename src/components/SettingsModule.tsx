import React, { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Save, 
  History, 
  Building, 
  Calendar, 
  CheckCircle, 
  Lock,
  Smartphone,
  Info
} from "lucide-react";
import { SchoolSettings, AuditLog } from "../types";
import { api } from "../lib/api";

interface SettingsModuleProps {
  settings: SchoolSettings;
  auditLogs: AuditLog[];
  onRefresh: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  auditLogs,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "audit">("general");
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateSettings(formData);
      notify("School settings updated successfully!");
      onRefresh();
    } catch (err: any) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-800" />
            <span>School Configuration &amp; Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure official school letterhead, KNEC center registration, Safaricom Paybill, and inspect system audit logs.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "general" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>School Profile &amp; Letterhead</span>
        </button>
        <button
          onClick={() => setActiveTab("academic")}
          className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "academic" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Academic Sessions &amp; Terms</span>
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "audit" ? "border-b-2 border-emerald-800 text-emerald-900" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "general" && (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-emerald-950 mb-4 pb-2 border-b border-slate-100">
              Institutional Identity &amp; Ministry Accreditation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">School Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">KNEC Examination Center Code</label>
                <input
                  type="text"
                  required
                  value={formData.knecCode}
                  onChange={(e) => setFormData({ ...formData, knecCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">School Motto</label>
              <input
                type="text"
                required
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs italic"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chief Principal's Name</label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-emerald-950 mb-4 pb-2 border-b border-slate-100">
              Address &amp; Contacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Postal Address</label>
                <input
                  type="text"
                  value={formData.poBox}
                  onChange={(e) => setFormData({ ...formData, poBox: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Town</label>
                <input
                  type="text"
                  value={formData.town}
                  onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">County</label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Telephone</label>
              <input
                type="text"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Safaricom M-Pesa Paybill</label>
              <input
                type="text"
                value={formData.mpesaPaybill}
                onChange={(e) => setFormData({ ...formData, mpesaPaybill: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ACADEMIC CALENDAR */}
      {activeTab === "academic" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-emerald-950 mb-4 pb-2 border-b border-slate-100">
              Active Academic Year &amp; Ministry Term Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Academic Year</label>
                <input
                  type="number"
                  value={formData.currentYear}
                  onChange={(e) => setFormData({ ...formData, currentYear: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Active Academic Term</label>
                <select
                  value={formData.currentTerm}
                  onChange={(e) => setFormData({ ...formData, currentTerm: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                >
                  <option value="Term 1">Term 1 (January - April)</option>
                  <option value="Term 2">Term 2 (May - August)</option>
                  <option value="Term 3">Term 3 (September - November / KCSE)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Ministry of Education 2025 Term Schedule Active</span>
            </div>
            <p className="text-xs text-emerald-800">
              Term 1: 6th January 2025 – 11th April 2025 (Mid-Term: 26th Feb – 2nd March 2025).<br />
              Term 2: 5th May 2025 – 8th August 2025.<br />
              Term 3 &amp; KCSE Rehearsals: 25th August 2025 – 24th October 2025.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Immutable System Audit Trail</span>
            </span>
            <span className="text-slate-500">Records security logins, mark alterations &amp; fee receipts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="p-3 w-40">Timestamp</th>
                  <th className="p-3 w-36">Authorized User</th>
                  <th className="p-3 w-28">Role</th>
                  <th className="p-3 w-36">Action</th>
                  <th className="p-3">Audit Details &amp; Records</th>
                  <th className="p-3 w-28">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-slate-900">{log.userName}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-emerald-900">{log.action}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{log.details}</td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
