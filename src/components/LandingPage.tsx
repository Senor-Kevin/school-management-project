import React, { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Bell, 
  Award, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Trophy, 
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Building
} from "lucide-react";
import { SchoolCrest } from "./SchoolCrest";
import { SchoolSettings, Announcement, SchoolEvent } from "../types";

interface LandingPageProps {
  onOpenLogin: (rolePreset?: string) => void;
  settings: SchoolSettings;
  announcements: Announcement[];
  events: SchoolEvent[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  settings,
  announcements,
  events
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "academics" | "activities" | "contact">("about");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Banner with Official Notice */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 sm:px-8 flex items-center justify-between border-b border-emerald-900/60">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-xs text-[10px] uppercase">
            Notice
          </span>
          <span className="hidden sm:inline">
            Term 1 2025 Academic Session Ongoing &bull; Form 4 KCSE Preparations &bull; Admissions Open
          </span>
          <span className="sm:hidden">Term 1 2025 Ongoing &bull; Admissions Open</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] flex-shrink-0">
          <span className="hidden md:inline font-mono">KNEC Code: {settings.knecCode}</span>
          <button
            onClick={() => onOpenLogin()}
            className="text-amber-300 hover:text-white font-semibold underline underline-offset-4 cursor-pointer"
          >
            Portal Login &rarr;
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolCrest size="md" withText={true} />
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="#about" className="hover:text-emerald-700 transition">About Us</a>
            <a href="#academics" className="hover:text-emerald-700 transition">Academics</a>
            <a href="#activities" className="hover:text-emerald-700 transition">Co-Curricular</a>
            <a href="#notices" className="hover:text-emerald-700 transition">Notices</a>
            <a href="#events" className="hover:text-emerald-700 transition">Events</a>
            <a href="#contact" className="hover:text-emerald-700 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLogin()}
              className="bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-emerald-900/20 transition flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Sign In to Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-20 lg:py-28">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Premier Secondary Institution in Bomet County, Kenya</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-serif leading-tight">
                Nurturing Visionaries, <span className="text-amber-400 italic">Scholars &amp; Leaders</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Welcome to <strong className="text-white">Kaplong High School</strong>, situated along the Sotik corridor. Guided by our enduring motto <em>"Labor Vincit Omnia - Strive for Excellence"</em>, we provide holistic Christian values, scientific exploration, and outstanding KCSE academic outcomes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenLogin()}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-lg font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Student &amp; Staff Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#about"
                  className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-white px-6 py-3.5 rounded-lg font-semibold text-sm sm:text-base transition flex items-center gap-2"
                >
                  <span>Explore School Ethos</span>
                </a>
              </div>

              {/* Trust Badge Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/50">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">1,250+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Enrolled Students</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">54+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">TSC Teaching Staff</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">100%</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">University Qualification Ethos</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/30 shadow-2xl bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                  alt="Kaplong High School Students"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                {/* Floating Quick Role Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-bold text-amber-300 uppercase tracking-wider">Quick Portal Access</span>
                    <span>Direct Sign-in</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenLogin("student")}
                      className="bg-emerald-950 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 py-1.5 px-2 rounded-sm text-left transition font-medium cursor-pointer"
                    >
                      &rarr; Student Portal
                    </button>
                    <button
                      onClick={() => onOpenLogin("parent")}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-1.5 px-2 rounded-sm text-left transition font-medium cursor-pointer"
                    >
                      &rarr; Parent Portal
                    </button>
                    <button
                      onClick={() => onOpenLogin("teacher")}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-1.5 px-2 rounded-sm text-left transition font-medium cursor-pointer"
                    >
                      &rarr; Teacher Dashboard
                    </button>
                    <button
                      onClick={() => onOpenLogin("super_admin")}
                      className="bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 py-1.5 px-2 rounded-sm text-left transition font-medium cursor-pointer"
                    >
                      &rarr; Admin / Principal
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* School Core Pillars & About Section */}
      <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              About Kaplong High School
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              A Legacy of Academic Integrity and Character
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Situated in the fertile highlands of Bomet County, Kaplong High School stands as a beacon of educational excellence in the South Rift region. We foster an environment where students not only achieve commendable KCSE grades, but also cultivate discipline and moral fortitude.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl relative hover:border-emerald-500 transition group">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5 group-hover:bg-emerald-800 group-hover:text-white transition">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">Uncompromising Discipline</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We believe discipline is the bedrock of achievement. From morning preps to sports fields, our students embody respect, time consciousness, and personal accountability.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl relative hover:border-emerald-500 transition group">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">KCSE Academic Rigor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Structured continuous assessment tests, dedicated science practical laboratories, and expert teacher guidance drive our students towards top competitive university degrees.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl relative hover:border-emerald-500 transition group">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-5 group-hover:bg-blue-700 group-hover:text-white transition">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">Holistic Co-Curricular</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Proud champions in Rift Valley athletics, rugby, drama, Christian Union mentorship, and national Science Congress innovations that enrich the full secondary school experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Departments Section */}
      <section id="academics" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest block mb-2">
                Curriculum &amp; Instruction
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Academic Departments
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Following the 8-4-4 secondary curriculum and Kenya Institute of Curriculum Development (KICD) guidelines across all Forms 1 through 4.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                SC
              </div>
              <h4 className="font-bold text-slate-900 text-base">Sciences &amp; STEM</h4>
              <p className="text-xs text-slate-600">
                Chemistry, Biology, and Physics taught with state-of-the-art wet laboratories and interactive experiments.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 pt-2 border-t border-slate-100">
                HOD: Mr. Peter Kipkemoi
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                MA
              </div>
              <h4 className="font-bold text-slate-900 text-base">Mathematics</h4>
              <p className="text-xs text-slate-600">
                Developing rigorous problem-solving, calculus, trigonometry, and statistical analysis for engineering minds.
              </p>
              <div className="text-[11px] font-semibold text-blue-800 pt-2 border-t border-slate-100">
                HOD: Ms. Faith Chelagat
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                LA
              </div>
              <h4 className="font-bold text-slate-900 text-base">Languages &amp; Lit</h4>
              <p className="text-xs text-slate-600">
                English Language, Literature in English, and Kiswahili fostering communicative confidence and oratorical skills.
              </p>
              <div className="text-[11px] font-semibold text-amber-800 pt-2 border-t border-slate-100">
                HOD: Mrs. Grace Koech
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                TA
              </div>
              <h4 className="font-bold text-slate-900 text-base">Applied &amp; ICT</h4>
              <p className="text-xs text-slate-600">
                Computer Studies, Business Studies, and Modern Agriculture providing practical, market-ready competencies.
              </p>
              <div className="text-[11px] font-semibold text-purple-800 pt-2 border-t border-slate-100">
                HOD: Mr. Bernard Mutai
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Announcements & Events Preview */}
      <section id="notices" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Announcements */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest block">Official Noticeboard</span>
                  <h3 className="text-2xl font-bold text-slate-900 font-serif">School Announcements</h3>
                </div>
                <button
                  onClick={() => onOpenLogin()}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All in Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {announcements && announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="p-5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 transition space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-sm font-bold uppercase ${
                        ann.priority === "Urgent" ? "bg-red-100 text-red-800" :
                        ann.priority === "Important" ? "bg-amber-100 text-amber-800" :
                        "bg-emerald-100 text-emerald-800"
                      }`}>
                        {ann.priority} Notice
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ann.date}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                    <div className="text-[11px] text-slate-500 pt-1 font-medium">
                      By: {ann.author} &bull; Target: <strong className="text-slate-700">{ann.targetAudience}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Calendar Events */}
            <div id="events" className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest block">Calendar</span>
                <h3 className="text-2xl font-bold text-slate-900 font-serif">Term 1 Key Events</h3>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                {events && events.slice(0, 4).map((ev) => (
                  <div key={ev.id} className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                    <div className="bg-emerald-800 text-white rounded-lg p-2.5 text-center min-w-[54px]">
                      <span className="block text-[10px] uppercase font-bold text-amber-300">
                        {new Date(ev.date).toLocaleString("default", { month: "short" })}
                      </span>
                      <span className="text-lg font-black font-mono leading-none">
                        {new Date(ev.date).getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-xs">
                          {ev.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{ev.location}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">{ev.title}</h5>
                      <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="contact" className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block">
                Official Inquiries &amp; Administration
              </span>
              <h2 className="text-3xl font-extrabold text-white font-serif">
                Reach Kaplong High School
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                For admissions inquiries, student academic verification, or administrative appointments, please contact the Principal's office during standard school hours (Monday to Friday, 8:00 AM – 5:00 PM).
              </p>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>{settings.poBox}, {settings.town}, {settings.county}, Kenya</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>{settings.phone1} (Main Office) / {settings.phone2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>{settings.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Official Paybill: <strong className="text-white font-mono">{settings.mpesaPaybill}</strong></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/80 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Authorized School Portal Access</span>
              </h3>
              <p className="text-xs text-slate-300">
                Access your personalized school dashboard to review examination marks, attendance records, school fee statements, and announcements.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenLogin()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span>Log In to School Management System</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400">
                  Demo credentials for all 7 Kenyan secondary school roles are pre-configured for review.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SchoolCrest size="sm" withText={false} />
            <div>
              <span className="text-white font-bold uppercase font-serif block">
                {settings.schoolName}
              </span>
              <span className="text-[11px] text-slate-500">
                &copy; {new Date().getFullYear()} Republic of Kenya &bull; All Rights Reserved
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500">
            <div>Designed for Kenyan Secondary Education &bull; KNEC Center: {settings.knecCode}</div>
            <div className="text-slate-600">Sample/Demo Data clearly marked for administrative trial</div>
          </div>
        </div>
      </footer>

    </div>
  );
};
