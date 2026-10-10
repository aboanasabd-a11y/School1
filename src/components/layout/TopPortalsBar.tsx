import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Users,
  GraduationCap,
  Bus,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  Sun,
  Moon,
  Columns,
  Plus,
  Sparkles,
  School,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";
import { AddCustomGradeModal } from "../school/AddCustomGradeModal";

export const TopPortalsBar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    currentUser,
    switchUserRole,
    openSmartLinksModal,
    students,
    staff,
    busRoutes,
    activeCohort,
    setActiveCohort,
    morningCohortStats,
    eveningCohortStats,
    studentsInCohort1,
    studentsInCohort2,
  } = useSchool();

  const [showAddGradeModal, setShowAddGradeModal] = useState(false);

  // If inside any dedicated isolated portal, hide TopPortalsBar completely so only that portal is visible!
  if (
    activeModule === "portal_parent" ||
    activeModule === "portal_teacher" ||
    activeModule === "portal_bus_supervisor" ||
    activeModule === "portal_hub"
  ) {
    return null;
  }

  const handleExitToPortalHub = () => {
    setActiveModule("portal_hub");
  };

  const morningCount = studentsInCohort1.length;
  const eveningCount = studentsInCohort2.length;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0b2844] border-b border-slate-700/80 text-white shadow-md select-none">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* RIGHT SIDE (RTL): PROMINENT COHORT TABS (تبويب الفوج الصباحي والمسائي بالأعلى) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold shadow-inner">
                {/* 1. الفوج الأول (صباحي) */}
                <button
                  type="button"
                  onClick={() => setActiveCohort("morning")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCohort === "morning" || activeCohort === "cohort_1"
                      ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300/60"
                      : "text-emerald-300 hover:text-white hover:bg-emerald-600/30"
                  }`}
                  title="التركيز على بيانات الفوج الصباحي بالكامل"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span>الفوج الصباحي</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10.5px] font-mono">
                    {morningCount}
                  </span>
                </button>

                {/* 2. الفوج الثاني (مسائي) */}
                <button
                  type="button"
                  onClick={() => setActiveCohort("evening")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCohort === "evening" || activeCohort === "cohort_2"
                      ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300/60"
                      : "text-indigo-300 hover:text-white hover:bg-indigo-600/30"
                  }`}
                  title="التركيز على بيانات الفوج المسائي بالكامل"
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-200" />
                  <span>الفوج المسائي</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10.5px] font-mono">
                    {eveningCount}
                  </span>
                </button>

                {/* 3. كلا الفوجين (الكل) */}
                <button
                  type="button"
                  onClick={() => setActiveCohort("all")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] ${
                    activeCohort === "all"
                      ? "bg-white/20 text-white font-black"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="عرض شامل لكلا الفوجين بدون تصفية"
                >
                  كلا الفوجين ({students.length})
                </button>

                {/* 4. لوحة التحكم الثنائية (Dual Dashboard) */}
                <button
                  type="button"
                  onClick={() => setActiveModule("dashboard")}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="عرض لوحة التحكم الثنائية والمقارنة بين الفوجين"
                >
                  <ArrowRightLeft className="w-3 h-3 text-sky-300" />
                  <span>لوحة ثنائية (Dual)</span>
                </button>
              </div>

              {/* Status Badge */}
              <div className="hidden 2xl:flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  الفوج المعتمد:{" "}
                  <strong className="text-amber-300 font-bold">
                    {activeCohort === "morning" || activeCohort === "cohort_1"
                      ? "الأول (صباحي)"
                      : activeCohort === "evening" || activeCohort === "cohort_2"
                      ? "الثاني (مسائي)"
                      : "شامل الفوجين"}
                  </strong>
                </span>
              </div>
            </div>

            {/* LEFT SIDE (RTL): QUICK ACTION BUTTONS (إضافة صف مفتوح، طلاب، كادر، روابط) */}
            <div className="flex flex-wrap items-center gap-1.5 justify-end">
              {/* BUTTON: + إضافة صف مفتوح (السابع... البكالوريا) */}
              <button
                type="button"
                onClick={() => setShowAddGradeModal(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-102"
                title="إضافة الصفوف المطلوبة (السابع، الثامن، التاسع، العاشر، الحادي عشر، البكالوريا) أو صفوف مخصصة"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ إضافة صف مفتوح (السابع... البكالوريا)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule("students")}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="إضافة طالب وتوليد رقم خاص به"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>+ تسجيل طالب</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule("staff")}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="إضافة وتوكيل المعلمين"
              >
                <Users className="w-3.5 h-3.5" />
                <span>+ توكيل معلم</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule("subjects")}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="إدارة وإضافة مواد تعليمية مفتوحة"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ مناهج ومواد</span>
              </button>

              <button
                type="button"
                onClick={() => openSmartLinksModal()}
                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="إنشاء وإرسال روابط وأرقام الدخول المباشرة"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>الروابط الذكية (واتساب)</span>
              </button>

              <button
                type="button"
                onClick={handleExitToPortalHub}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="الانتقال إلى بوابات الدخول الأربعة المستقلة"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>البوابات الأربعة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Grade Modal */}
      <AddCustomGradeModal
        isOpen={showAddGradeModal}
        onClose={() => setShowAddGradeModal(false)}
      />
    </>
  );
};
