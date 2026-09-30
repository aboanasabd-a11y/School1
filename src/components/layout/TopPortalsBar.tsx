import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Users,
  GraduationCap,
  Bus,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  LogOut,
  Sliders,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

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
    activeDirectStudentId,
    activeDirectTeacherId,
  } = useSchool();

  const [isManagerQuickOpen, setIsManagerQuickOpen] = useState(false);

  // If on the portal hub selection page, hide the top portal bar to keep the page ultra-clean
  if (activeModule === "portal_hub") {
    return null;
  }

  // Determine current active portal
  const isParentPortal = activeModule === "portal_parent";
  const isTeacherPortal = activeModule === "portal_teacher";
  const isDriverPortal = activeModule === "portal_bus_supervisor";
  const isManagerPortal =
    activeModule === "portal_super_admin" ||
    currentUser.role === "super_admin" ||
    currentUser.role === "principal";

  // Resolve active student for parent view
  const currentStudent =
    (activeDirectStudentId && students.find((s) => s.id === activeDirectStudentId)) ||
    (currentUser.linkedStudentId && students.find((s) => s.id === currentUser.linkedStudentId)) ||
    students[0];

  // Resolve active teacher for teacher view
  const currentTeacher =
    (activeDirectTeacherId && staff.find((s) => s.id === activeDirectTeacherId)) ||
    staff.find((s) => s.role === "teacher") ||
    staff[1];

  // Resolve current bus route for driver view
  const currentRoute = busRoutes[0];

  const handleExitToPortalHub = () => {
    setActiveModule("portal_hub");
  };

  /* ========================================================
     1. PARENT PORTAL TOP BAR (All other 3 portals hidden)
     ======================================================== */
  if (isParentPortal) {
    return (
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 border-b border-purple-800/60 text-white shadow-md select-none">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              👨‍👩‍👧
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-purple-200">
                  بوابة ولي الأمر
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-bold">
                  متابعة الطالب المعتمدة
                </span>
              </div>
              <p className="text-[11px] text-purple-200/90 truncate mt-0.5">
                الطالب: <strong className="text-white">{currentStudent?.fullName}</strong> • رقم القيد: <span className="font-mono text-purple-100">{currentStudent?.studentNumber}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExitToPortalHub}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            title="الرجوع إلى بوابات الدخول الرئيسية"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تبديل البوابة / خروج</span>
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================
     2. TEACHER PORTAL TOP BAR (All other 3 portals hidden)
     ======================================================== */
  if (isTeacherPortal) {
    return (
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 border-b border-blue-800/60 text-white shadow-md select-none">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              👨‍🏫
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-blue-200">
                  بوابة المعلم
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">
                  الصفوف والمواد الموكلة فقط
                </span>
              </div>
              <p className="text-[11px] text-blue-200/90 truncate mt-0.5">
                المعلم: <strong className="text-white">{currentTeacher?.fullName}</strong> • المواد الموكلة: <span className="text-blue-100">{currentTeacher?.teachingSubjects?.join("، ") || "معلم معتمد"}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExitToPortalHub}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            title="الرجوع إلى بوابات الدخول الرئيسية"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تبديل البوابة / خروج</span>
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================
     3. DRIVER PORTAL TOP BAR (All other 3 portals hidden)
     ======================================================== */
  if (isDriverPortal) {
    return (
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-600/40 text-white shadow-md select-none">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              🚌
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-amber-300">
                  بوابة السائق والنقل المدرسي
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>تحديد الموقع آلياً GPS</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                المسار: <strong className="text-white">{currentRoute?.name}</strong> • رقم الحافلة: <span className="font-mono text-amber-200">{currentRoute?.busPlate || "104"}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExitToPortalHub}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            title="الرجوع إلى بوابات الدخول الرئيسية"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تبديل البوابة / خروج</span>
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================
     4. GENERAL MANAGER / SUPER ADMIN TOP BAR
     (Clean command strip, other 3 portals hidden)
     ======================================================== */
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-700/80 text-white shadow-md select-none">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          {/* Identity & Status */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm text-amber-300">
                  بوابة المدير العام (إدارة المدرسة)
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 font-bold">
                  تحكم كامل بجميع الصلاحيات
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.2">
                إضافة الكادر وتوكيل الصفوف والمواد، تسجيل الطلاب، النقل، وإصدار الروابط
              </p>
            </div>
          </div>

          {/* Action buttons (Clean, no repetition) */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
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
              onClick={() => setActiveModule("students")}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              title="إضافة طالب وتوليد رقم خاص به"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>+ إضافة طالب</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModule("subjects")}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              title="إدارة وإضافة مواد تعليمية مفتوحة"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>+ مواد مفتوحة</span>
            </button>

            <button
              type="button"
              onClick={() => openSmartLinksModal()}
              className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              title="إنشاء وإرسال روابط وأرقام الدخول المباشرة"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>إرسال الروابط (واتساب)</span>
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
  );
};
