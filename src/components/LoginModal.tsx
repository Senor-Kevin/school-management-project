import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2,
  GraduationCap,
  Users,
  Wallet,
  BookOpen,
  Briefcase
} from "lucide-react";
import { SchoolCrest } from "./SchoolCrest";
import { api } from "../lib/api";
import { User, UserRole } from "../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  presetRole?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  presetRole
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState("admin@kaplonghigh.sc.ke");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Quick Persona Presets for Kenyan School Roles
  const presets: { role: UserRole; title: string; email: string; pass: string; desc: string; icon: any }[] = [
    {
      role: "super_admin",
      title: "Super Administrator",
      email: "admin@kaplonghigh.sc.ke",
      pass: "Admin@123",
      desc: "Full system configuration, user accounts, audit logs & settings",
      icon: ShieldCheck
    },
    {
      role: "principal",
      title: "Chief Principal",
      email: "principal@kaplonghigh.sc.ke",
      pass: "Principal@123",
      desc: "School-wide KPI overview, staff, academic means & reports",
      icon: Briefcase
    },
    {
      role: "deputy_principal",
      title: "Deputy Principal",
      email: "deputy@kaplonghigh.sc.ke",
      pass: "Deputy@123",
      desc: "Discipline records, attendance logs, timetables & teachers",
      icon: Users
    },
    {
      role: "bursar",
      title: "Bursar / Finance Officer",
      email: "bursar@kaplonghigh.sc.ke",
      pass: "Bursar@123",
      desc: "Fee collections, M-Pesa receipts, fee structures & statements",
      icon: Wallet
    },
    {
      role: "teacher",
      title: "Subject Teacher",
      email: "teacher@kaplonghigh.sc.ke",
      pass: "Teacher@123",
      desc: "Enter marks, student lists, attendance roll-call & remarks",
      icon: BookOpen
    },
    {
      role: "student",
      title: "Student Portal",
      email: "student@kaplonghigh.sc.ke",
      pass: "Student@123",
      desc: "View academic report form, fee balance, timetable & classes",
      icon: GraduationCap
    },
    {
      role: "parent",
      title: "Parent / Guardian",
      email: "parent@kaplonghigh.sc.ke",
      pass: "Parent@123",
      desc: "Student progress, fee statements, M-Pesa Paybill & alerts",
      icon: Users
    }
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setUsername(p.email);
    setPassword(p.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(username, password);
      onLoginSuccess(response.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setLoading(true);
    try {
      const res = await api.resetPassword(resetEmail);
      setResetSuccess(res.message);
    } catch (err) {
      setResetSuccess("Password reset instructions dispatched.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full my-auto overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Role Selector Presets */}
        <div className="bg-slate-900 text-white p-6 md:p-8 md:w-5/12 border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <SchoolCrest size="md" withText={true} />
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                Official User Roles
              </span>
              <h3 className="text-lg font-bold text-white font-serif">
                Select a Test Persona
              </h3>
              <p className="text-xs text-slate-400">
                Click any role to load demo credentials for authentic Kenyan secondary school testing:
              </p>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {presets.map((p) => {
                const Icon = p.icon;
                const isSelected = username === p.email;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-900/80 border-amber-400 text-white shadow-xs"
                        : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                      isSelected ? "bg-amber-400 text-slate-950" : "bg-slate-700 text-emerald-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{p.title}</span>
                        {isSelected && <span className="text-[10px] text-amber-300 font-mono">SELECTED</span>}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Kaplong High School &bull; Republic of Kenya
          </div>
        </div>

        {/* Right Side: Sign-In Form */}
        <div className="p-6 md:p-8 md:w-7/12 bg-white flex flex-col justify-between relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {!resetMode ? (
              <>
                <div className="mb-6">
                  <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider block">
                    Security Authorization
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                    Sign in to Portal
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your staff ID, admission number, or email credentials.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Username / Email / Admission No
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                        placeholder="e.g. admin@kaplonghigh.sc.ke or KHS/2023/0412"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 uppercase">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setResetMode(true); setResetSuccess(null); }}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Authenticate &amp; Access Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                    Credential Recovery
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                    Reset Portal Password
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered email address to receive recovery instructions.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{resetSuccess}</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      You may now log in with the demo reset password.
                    </p>
                    <button
                      onClick={() => setResetMode(false)}
                      className="text-xs font-bold text-emerald-950 underline pt-1 cursor-pointer"
                    >
                      Return to Sign In &rarr;
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Registered Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        placeholder="e.g. principal@kaplonghigh.sc.ke"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetMode(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Role-Based Access Control
            </span>
            <span>KNEC Security Standard</span>
          </div>
        </div>

      </div>
    </div>
  );
};
