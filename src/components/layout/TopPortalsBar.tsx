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

  /* ========================================================
     GENERAL MANAGER / SUPER ADMIN TOP BAR
     (Clean command strip, other portals hidden)
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
