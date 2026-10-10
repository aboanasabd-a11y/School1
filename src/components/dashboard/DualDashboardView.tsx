import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Sun,
  Moon,
  Columns,
  Users,
  GraduationCap,
  Bus,
  CheckCircle2,
  TrendingUp,
  Percent,
  Clock,
  ArrowRightLeft,
  ChevronLeft,
  Calendar,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";
import { TabType } from "../layout/Sidebar";

interface DualDashboardViewProps {
  onNavigate?: (tab: TabType) => void;
}

export const DualDashboardView: React.FC<DualDashboardViewProps> = ({ onNavigate }) => {
  const {
    activeCohort,
    setActiveCohort,
    morningCohortStats,
    eveningCohortStats,
    combinedCohortStats,
    studentsInCohort1,
    studentsInCohort2,
    teachersInCohort1,
    teachersInCohort2,
    busRoutesInCohort1,
    busRoutesInCohort2,
    setActiveModule,
  } = useSchool();

  // Mode: "dual" (side by side comparison) | "morning" (focused morning) | "evening" (focused evening)
  const [viewMode, setViewMode] = useState<"dual" | "morning" | "evening">("dual");
  const [showExportModal, setShowExportModal] = useState(false);

  const handleApplyToSystem = (cohort: "morning" | "evening" | "all") => {
    setActiveCohort(cohort);
  };

  const handleGoToModule = (tab: TabType, cohortTarget?: "morning" | "evening") => {
    if (cohortTarget) {
      setActiveCohort(cohortTarget);
    }
    if (onNavigate) {
      onNavigate(tab);
    } else {
      setActiveModule(tab);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Top Header & Cohort Switcher Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0b3b60] to-slate-900 text-white p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <Columns className="w-5 h-5 text-sky-300" />
                <span>لوحة التحكم الثنائية (Dual-Dashboard)</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-sky-200 border border-white/15 text-[11px] font-bold">
                نظام الفوجين المستقلين
              </span>
            </div>
            <p className="text-xs text-sky-150/80 mt-1">
              إشراف ومتابعة مستقلة وشاملة لكل فوج (الصباحي والمسائي) في واجهة واحدة لتسهيل المقارنة الإدارية
            </p>
          </div>

          {/* Quick Switcher Controls */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            {/* View Mode Tabs */}
            <div className="bg-black/30 p-1 rounded-xl flex items-center gap-1 border border-white/10 text-xs font-bold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode("dual")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === "dual"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="عرض المقارنة الثنائية جنباً إلى جنب"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                <span>مقارنة ثنائية (Dual)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("morning");
                  handleApplyToSystem("morning");
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === "morning"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="التركيز على الفوج الصباحي"
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>الفوج الصباحي ({morningCohortStats.totalStudents})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("evening");
                  handleApplyToSystem("evening");
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === "evening"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="التركيز على الفوج المسائي"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-200" />
                <span>الفوج المسائي ({eveningCohortStats.totalStudents})</span>
              </button>
            </div>

            {/* Active System Cohort Badge & Reset */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
              <span className="text-[11px] text-sky-200">النظام مفلتر حالياً على:</span>
              <span className="font-black text-amber-300">
                {activeCohort === "morning" || activeCohort === "cohort_1"
                  ? "الفوج الأول (صباحي)"
                  : activeCohort === "evening" || activeCohort === "cohort_2"
                  ? "الفوج الثاني (مسائي)"
                  : "كلا الفوجين"}
              </span>
              {activeCohort !== "all" && (
                <button
                  type="button"
                  onClick={() => handleApplyToSystem("all")}
                  className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[10px] text-white font-bold cursor-pointer transition-colors"
                  title="عرض بيانات كلا الفوجين في النظام"
                >
                  إلغاء الفرز (الكل)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Dashboard Content */}
      <div className="p-4 sm:p-6 bg-slate-50/50">
        {/* VIEW 1: DUAL COMPARISON VIEW (Side by Side) */}
        {viewMode === "dual" && (
          <div className="space-y-6">
            {/* Top Comparative Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">إجمالي طلاب المدرستين بالفوجين</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {combinedCohortStats.totalStudents}{" "}
                    <span className="text-xs font-normal text-slate-400">طالب وطالبة</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">كادر المعلمين الموزع على الفوجين</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {teachersInCohort1.length + teachersInCohort2.length}{" "}
                    <span className="text-xs font-normal text-slate-400">معلم ومعلمة</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">أسطول الحافلات وسائقي الفوجين</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    2 <span className="text-xs font-normal text-slate-400">حافلات مستقلة ومساران</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Side-by-Side Dual Cohort Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* ========================================================
                  COLUMN 1: الفوج الأول (صباحي)
                  ======================================================== */}
              <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Cohort Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-xs">
                        <Sun className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-base text-white">الفوج الأول (صباحي)</h3>
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                            الدوام الصباحي
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-100 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            07:30 ص - 12:30 م
                          </span>
                          <span>•</span>
                          <span>{morningCohortStats.totalStudents} طالب مسجل</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyToSystem("morning")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                        activeCohort === "morning" || activeCohort === "cohort_1"
                          ? "bg-white text-emerald-800 ring-2 ring-emerald-300"
                          : "bg-emerald-500 hover:bg-emerald-400 text-white"
                      }`}
                      title="تفعيل فلترة النظام بالكامل على الفوج الصباحي"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeCohort === "morning" || activeCohort === "cohort_1" ? "مفعّل بالنظام" : "تفعيل الفوج"}</span>
                    </button>
                  </div>

                  {/* Cohort Metrics Grid */}
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-emerald-800">الطلاب المسجلين</div>
                        <div className="text-xl font-black text-emerald-950 mt-0.5">
                          {morningCohortStats.totalStudents}
                        </div>
                        <div className="text-[9.5px] text-emerald-600 mt-0.5">
                          {morningCohortStats.maleStudents} بنين / {morningCohortStats.femaleStudents} بنات
                        </div>
                      </div>

                      <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-sky-800">الكادر التدريسي</div>
                        <div className="text-xl font-black text-sky-950 mt-0.5">
                          {teachersInCohort1.length}
                        </div>
                        <div className="text-[9.5px] text-sky-600 mt-0.5">معلمين معتمدين</div>
                      </div>

                      <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-purple-800">نسبة الحضور</div>
                        <div className="text-xl font-black text-purple-950 mt-0.5">
                          {morningCohortStats.attendanceRate}%
                        </div>
                        <div className="text-[9.5px] text-purple-600 mt-0.5">التزام ممتاز</div>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-amber-800">النقل والحافلات</div>
                        <div className="text-xl font-black text-amber-950 mt-0.5">
                          {busRoutesInCohort1.length}
                        </div>
                        <div className="text-[9.5px] text-amber-700 mt-0.5">باص 01 (سائق 1)</div>
                      </div>
                    </div>

                    {/* Dedicated Transportation & Driver Card */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Bus className="w-3.5 h-3.5 text-amber-600" />
                          <span>نقل ومواصلات الفوج الصباحي:</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          باص 01 - رقم السائق: 1
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>السائق المسؤول:</span>
                          <span className="font-bold text-slate-900">أبو بكر سالم الدوسري (+966 50 123 4567)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>المسار والحافلة:</span>
                          <span className="font-bold text-slate-900">مسار النرجس والياسمين (30 راكب)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>الطلاب المشتركون بالباص:</span>
                          <span className="font-black text-emerald-700">
                            {studentsInCohort1.filter((s) => s.transportation?.usesBus).length} طالب وطالبة
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sample Teachers in Morning Cohort */}
                    <div>
                      <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                          <span>أعضاء كادر الفوج الصباحي:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGoToModule("staff", "morning")}
                          className="text-[10.5px] text-sky-700 hover:text-sky-900 font-bold hover:underline cursor-pointer"
                        >
                          عرض الكادر ({teachersInCohort1.length})
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {teachersInCohort1.slice(0, 3).map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={t.photo}
                                alt={t.fullName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-bold text-slate-800">{t.fullName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{t.specialization}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cohort Card Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleGoToModule("students", "morning")}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>إدارة طلاب الفوج الأول</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoToModule("transport", "morning")}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>مسار باص 01</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ========================================================
                  COLUMN 2: الفوج الثاني (مسائي)
                  ======================================================== */}
              <div className="bg-white rounded-2xl border-2 border-indigo-300 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Cohort Header */}
                  <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-xs">
                        <Moon className="w-5 h-5 text-indigo-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-base text-white">الفوج الثاني (مسائي)</h3>
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                            الدوام المسائي
                          </span>
                        </div>
                        <div className="text-[11px] text-indigo-100 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            12:45 م - 05:30 م
                          </span>
                          <span>•</span>
                          <span>{eveningCohortStats.totalStudents} طالب مسجل</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyToSystem("evening")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                        activeCohort === "evening" || activeCohort === "cohort_2"
                          ? "bg-white text-indigo-900 ring-2 ring-indigo-300"
                          : "bg-indigo-500 hover:bg-indigo-400 text-white"
                      }`}
                      title="تفعيل فلترة النظام بالكامل على الفوج المسائي"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeCohort === "evening" || activeCohort === "cohort_2" ? "مفعّل بالنظام" : "تفعيل الفوج"}</span>
                    </button>
                  </div>

                  {/* Cohort Metrics Grid */}
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-indigo-800">الطلاب المسجلين</div>
                        <div className="text-xl font-black text-indigo-950 mt-0.5">
                          {eveningCohortStats.totalStudents}
                        </div>
                        <div className="text-[9.5px] text-indigo-600 mt-0.5">
                          {eveningCohortStats.maleStudents} بنين / {eveningCohortStats.femaleStudents} بنات
                        </div>
                      </div>

                      <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-sky-800">الكادر التدريسي</div>
                        <div className="text-xl font-black text-sky-950 mt-0.5">
                          {teachersInCohort2.length}
                        </div>
                        <div className="text-[9.5px] text-sky-600 mt-0.5">معلمين معتمدين</div>
                      </div>

                      <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-purple-800">نسبة الحضور</div>
                        <div className="text-xl font-black text-purple-950 mt-0.5">
                          {eveningCohortStats.attendanceRate}%
                        </div>
                        <div className="text-[9.5px] text-purple-600 mt-0.5">التزام ممتاز</div>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-bold text-amber-800">النقل والحافلات</div>
                        <div className="text-xl font-black text-amber-950 mt-0.5">
                          {busRoutesInCohort2.length}
                        </div>
                        <div className="text-[9.5px] text-amber-700 mt-0.5">باص 02 (سائق 2)</div>
                      </div>
                    </div>

                    {/* Dedicated Transportation & Driver Card */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Bus className="w-3.5 h-3.5 text-amber-600" />
                          <span>نقل ومواصلات الفوج المسائي:</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                          باص 02 - رقم السائق: 2
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>السائق المسؤول:</span>
                          <span className="font-bold text-slate-900">خالد سعيد الغامدي (+966 54 111 9900)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>المسار والحافلة:</span>
                          <span className="font-bold text-slate-900">مسار الصحافة والعقيق (26 راكب)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>الطلاب المشتركون بالباص:</span>
                          <span className="font-black text-indigo-700">
                            {studentsInCohort2.filter((s) => s.transportation?.usesBus).length} طالب وطالبة
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sample Teachers in Evening Cohort */}
                    <div>
                      <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                          <span>أعضاء كادر الفوج المسائي:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGoToModule("staff", "evening")}
                          className="text-[10.5px] text-sky-700 hover:text-sky-900 font-bold hover:underline cursor-pointer"
                        >
                          عرض الكادر ({teachersInCohort2.length})
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {teachersInCohort2.slice(0, 3).map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={t.photo}
                                alt={t.fullName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-bold text-slate-800">{t.fullName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{t.specialization}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cohort Card Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleGoToModule("students", "evening")}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>إدارة طلاب الفوج الثاني</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoToModule("transport", "evening")}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>مسار باص 02</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Cohort Comparison Matrix */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-black text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>مصفوفة المقارنة المباشرة بين الفوجين (Cohort Comparative Matrix):</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2.5">المعيار والمؤشر</th>
                      <th className="p-2.5 text-emerald-800">الفوج الأول (صباحي)</th>
                      <th className="p-2.5 text-indigo-800">الفوج الثاني (مسائي)</th>
                      <th className="p-2.5 text-slate-600">الإجمالي الشامل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">عدد الطلاب المسجلين</td>
                      <td className="p-2.5 font-black text-emerald-700">{morningCohortStats.totalStudents} طالب</td>
                      <td className="p-2.5 font-black text-indigo-700">{eveningCohortStats.totalStudents} طالب</td>
                      <td className="p-2.5 font-bold text-slate-900">{combinedCohortStats.totalStudents} طالب</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">توزيع الطلاب (ذكور / إناث)</td>
                      <td className="p-2.5 text-slate-700">
                        {morningCohortStats.maleStudents} بنين / {morningCohortStats.femaleStudents} بنات
                      </td>
                      <td className="p-2.5 text-slate-700">
                        {eveningCohortStats.maleStudents} بنين / {eveningCohortStats.femaleStudents} بنات
                      </td>
                      <td className="p-2.5 text-slate-700">
                        {combinedCohortStats.maleStudents} بنين / {combinedCohortStats.femaleStudents} بنات
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">عدد معلمي الفوج</td>
                      <td className="p-2.5 font-bold text-slate-700">{teachersInCohort1.length} معلم</td>
                      <td className="p-2.5 font-bold text-slate-700">{teachersInCohort2.length} معلم</td>
                      <td className="p-2.5 font-bold text-slate-700">{teachersInCohort1.length + teachersInCohort2.length} معلم</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">حافلة النقل والسائق</td>
                      <td className="p-2.5 text-emerald-700 font-bold">باص 01 (سائق 1 - أبو بكر الدوسري)</td>
                      <td className="p-2.5 text-indigo-700 font-bold">باص 02 (سائق 2 - خالد الغامدي)</td>
                      <td className="p-2.5 text-slate-700 font-bold">2 حافلات مستقلة تماماً</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">نسبة الالتزام بالحضور</td>
                      <td className="p-2.5 font-black text-emerald-600">{morningCohortStats.attendanceRate}%</td>
                      <td className="p-2.5 font-black text-indigo-600">{eveningCohortStats.attendanceRate}%</td>
                      <td className="p-2.5 font-black text-slate-800">96.5%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">متوسط الدرجات والتحصيل</td>
                      <td className="p-2.5 font-black text-emerald-600">{morningCohortStats.gradeAverage} / 100</td>
                      <td className="p-2.5 font-black text-indigo-600">{eveningCohortStats.gradeAverage} / 100</td>
                      <td className="p-2.5 font-black text-slate-800">{combinedCohortStats.gradeAverage} / 100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FOCUSED MORNING COHORT VIEW */}
        {viewMode === "morning" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Sun className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-emerald-950">الفوج الأول (صباحي) - عرض تحليلي مركز</h3>
                  <p className="text-xs text-emerald-800">
                    تم تعميم فلترة الفوج الصباحي على كافة أقسام النظام (الطلاب، الكادر، النقل، الحضور، الدرجات)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGoToModule("students", "morning")}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  كشف طلاب الفوج ({morningCohortStats.totalStudents})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("dual")}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  العودة للوحة الثنائية
                </button>
              </div>
            </div>

            {/* List of Morning Students Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-xs font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>قائمة طلاب الفوج الصباحي (المرقمة تسلسلياً):</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  يفتح حساب كل طالب برقم قيده التسلسلي مباشرة
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {studentsInCohort1.slice(0, 9).map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-[11px]">
                        {s.studentNumber}
                      </span>
                      <span className="font-bold text-slate-800">{s.fullName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-100">
                      صباحي
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FOCUSED EVENING COHORT VIEW */}
        {viewMode === "evening" && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-bold">
                  <Moon className="w-6 h-6 text-indigo-200" />
                </div>
                <div>
                  <h3 className="font-black text-base text-indigo-950">الفوج الثاني (مسائي) - عرض تحليلي مركز</h3>
                  <p className="text-xs text-indigo-800">
                    تم تعميم فلترة الفوج المسائي على كافة أقسام النظام (الطلاب، الكادر، النقل، الحضور، الدرجات)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGoToModule("students", "evening")}
                  className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  كشف طلاب الفوج ({eveningCohortStats.totalStudents})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("dual")}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  العودة للوحة الثنائية
                </button>
              </div>
            </div>

            {/* List of Evening Students Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-xs font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>قائمة طلاب الفوج المسائي (المرقمة تسلسلياً):</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  يفتح حساب كل طالب برقم قيده التسلسلي مباشرة
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {studentsInCohort2.slice(0, 9).map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-700 text-white font-mono font-bold flex items-center justify-center text-[11px]">
                        {s.studentNumber}
                      </span>
                      <span className="font-bold text-slate-800">{s.fullName}</span>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-bold px-1.5 py-0.5 rounded bg-indigo-100">
                      مسائي
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
