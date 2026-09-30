import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Bus,
  Link as LinkIcon,
  Plus,
  BookOpen,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Key,
  MapPin,
  CheckCircle2,
  Send,
  Sliders,
  Layers,
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
    subjects,
  } = useSchool();

  const [isQuickControlOpen, setIsQuickControlOpen] = useState(false);

  // Active portal determination
  const isSuperAdmin =
    activeModule === "portal_super_admin" ||
    (currentUser.role === "super_admin" && activeModule === "dashboard");
  const isParent =
    activeModule === "portal_parent" || currentUser.role === "parent";
  const isTeacher =
    activeModule === "portal_teacher" || currentUser.role === "teacher";
  const isDriver =
    activeModule === "portal_bus_supervisor" || currentUser.role === "bus_supervisor";

  const handleSelectPortal = (
    portal: "super_admin" | "parent" | "teacher" | "driver"
  ) => {
    switch (portal) {
      case "super_admin":
        switchUserRole("super_admin");
        setActiveModule("portal_super_admin");
        break;
      case "parent":
        switchUserRole("parent");
        setActiveModule("portal_parent");
        break;
      case "teacher":
        switchUserRole("teacher");
        setActiveModule("portal_teacher");
        break;
      case "driver":
        switchUserRole("bus_supervisor");
        setActiveModule("portal_bus_supervisor");
        break;
    }
  };

  const isManagerUser =
    currentUser.role === "super_admin" ||
    currentUser.role === "principal" ||
    isSuperAdmin;

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-b border-slate-700/80 shadow-lg text-white select-none">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-2">
        {/* Main 4 Portals Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Label & Indicator */}
          <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200">
                بوابات النظام الأربعة:
              </span>
            </div>

            {isManagerUser && (
              <button
                type="button"
                onClick={() => setIsQuickControlOpen(!isQuickControlOpen)}
                className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                  isQuickControlOpen
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs"
                    : "bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700"
                }`}
                title="إظهار لوحة التحكم السريعة للمدير"
              >
                <Sliders className="w-3 h-3" />
                <span>تحكم المدير</span>
                {isQuickControlOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {/* Four Portals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 flex-1">
            {/* 1. Portal: Manager / Principal */}
            <button
              type="button"
              onClick={() => handleSelectPortal("super_admin")}
              className={`group relative text-right p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSuperAdmin
                  ? "bg-gradient-to-r from-amber-600/30 to-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50"
                  : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-amber-400/50 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isSuperAdmin
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "bg-slate-700 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors"
                    }`}
                  >
                    👑
                  </div>
                  <span
                    className={`text-xs font-black truncate ${
                      isSuperAdmin ? "text-amber-300" : "text-white"
                    }`}
                  >
                    1. بوابة المدير
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isSuperAdmin
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                      : "bg-slate-700/60 text-slate-400"
                  }`}
                >
                  تحكم شامل
                </span>
              </div>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                صلاحيات كاملة وتوكيل الكادر
              </p>
            </button>

            {/* 2. Portal: Parent */}
            <button
              type="button"
              onClick={() => handleSelectPortal("parent")}
              className={`group relative text-right p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isParent
                  ? "bg-gradient-to-r from-purple-600/30 to-purple-500/20 border-purple-400 shadow-md shadow-purple-500/10 ring-1 ring-purple-400/50"
                  : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-purple-400/50 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isParent
                        ? "bg-purple-500 text-white shadow-xs"
                        : "bg-slate-700 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors"
                    }`}
                  >
                    👨‍👩‍👧
                  </div>
                  <span
                    className={`text-xs font-black truncate ${
                      isParent ? "text-purple-300" : "text-white"
                    }`}
                  >
                    2. بوابة ولي الأمر
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isParent
                      ? "bg-purple-400/20 text-purple-200 border border-purple-400/40"
                      : "bg-slate-700/60 text-slate-400"
                  }`}
                >
                  برقم الطالب
                </span>
              </div>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                متابعة الدرجات والغياب والباص
              </p>
            </button>

            {/* 3. Portal: Teacher */}
            <button
              type="button"
              onClick={() => handleSelectPortal("teacher")}
              className={`group relative text-right p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isTeacher
                  ? "bg-gradient-to-r from-blue-600/30 to-blue-500/20 border-blue-400 shadow-md shadow-blue-500/10 ring-1 ring-blue-400/50"
                  : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-blue-400/50 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isTeacher
                        ? "bg-blue-500 text-white shadow-xs"
                        : "bg-slate-700 text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-colors"
                    }`}
                  >
                    👨‍🏫
                  </div>
                  <span
                    className={`text-xs font-black truncate ${
                      isTeacher ? "text-blue-300" : "text-white"
                    }`}
                  >
                    3. بوابة المعلم
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isTeacher
                      ? "bg-blue-400/20 text-blue-200 border border-blue-400/40"
                      : "bg-slate-700/60 text-slate-400"
                  }`}
                >
                  صفوفه الموكلة
                </span>
              </div>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                دخول برمز المعلم ورصد الدرجات
              </p>
            </button>

            {/* 4. Portal: Driver */}
            <button
              type="button"
              onClick={() => handleSelectPortal("driver")}
              className={`group relative text-right p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isDriver
                  ? "bg-gradient-to-r from-amber-600/30 to-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50"
                  : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-amber-400/50 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isDriver
                        ? "bg-amber-400 text-slate-950 shadow-xs"
                        : "bg-slate-700 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors"
                    }`}
                  >
                    🚌
                  </div>
                  <span
                    className={`text-xs font-black truncate ${
                      isDriver ? "text-amber-300" : "text-white"
                    }`}
                  >
                    4. بوابة السائق
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isDriver
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                      : "bg-slate-700/60 text-slate-400"
                  }`}
                >
                  GPS آلي
                </span>
              </div>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                مواقع الطلاب والتتبع الملاحي
              </p>
            </button>
          </div>
        </div>

        {/* Manager Quick Command Bar (Accessible when toggled or in Manager Mode) */}
        {isQuickControlOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-700/80 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-800/90 p-2 sm:p-2.5 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  ⚙️
                </span>
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>صلاحيات المدير الكاملة للتحكم بالبوابات</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      Super Admin
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-300">
                    أضف كادراً ووكلهم بصفوف ومواد، أضف طلاباً وسائقين، وولد أرقام وروابط الدخول المباشرة.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
                {/* 1. Add/Assign Teacher */}
                <button
                  type="button"
                  onClick={() => {
                    switchUserRole("super_admin");
                    setActiveModule("staff");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="إضافة معلم وتوكيله بصفوف ومواد محددة"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>+ توكيل معلم بصفوف ومواد</span>
                </button>

                {/* 2. Add Student */}
                <button
                  type="button"
                  onClick={() => {
                    switchUserRole("super_admin");
                    setActiveModule("students");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="إضافة طالب وتوليد رقمه الخاص"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>+ إضافة طالب ورقم خاص</span>
                </button>

                {/* 3. Add Driver */}
                <button
                  type="button"
                  onClick={() => {
                    switchUserRole("super_admin");
                    setActiveModule("transport");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="إضافة سائق ومسار حافلة"
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>+ إضافة سائق وحافلة</span>
                </button>

                {/* 4. Open Subjects Management */}
                <button
                  type="button"
                  onClick={() => {
                    switchUserRole("super_admin");
                    setActiveModule("subjects");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="إدارة وإضافة مواد تعليمية مفتوحة"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>+ مواد تعليمية مفتوحة</span>
                </button>

                {/* 5. Dispatch Links & Numbers */}
                <button
                  type="button"
                  onClick={() => openSmartLinksModal()}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="إنشاء وإرسال روابط وأرقام الدخول لأولياء الأمور والمعلمين"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>إرسال أرقام وروابط الدخول (واتساب)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
