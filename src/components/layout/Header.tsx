import React, { useState, useEffect, useRef } from "react";
import { useSchool } from "../../context/SchoolContext";
import { UserRole } from "../../types";
import {
  Bell,
  Menu,
  ChevronDown,
  Edit3,
  Youtube,
  Send,
  Camera,
  Plus,
  Sparkles,
  Building2,
  GraduationCap,
} from "lucide-react";
import { EditSchoolModal } from "../common/EditSchoolModal";
import { PushNotificationCenter } from "../common/PushNotificationCenter";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    switchRole,
    userProfiles,
    schoolInfo,
    updateSchoolInfo,
    unreadPushCount,
    activeModule,
    setActiveModule,
  } = useSchool();

  const isPortalIsolated =
    activeModule === "portal_parent" ||
    activeModule === "portal_teacher" ||
    activeModule === "portal_bus_supervisor" ||
    activeModule === "portal_hub";

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false);
  const [modalTab, setModalTab] = useState<"school" | "branding" | "developer">("branding");
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const quickLogoInputRef = useRef<HTMLInputElement>(null);

  // Live real-time clock: 10:24 ص | الأحد 2025/09/21
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const isPm = hours >= 12;
      hours = hours % 12 || 12;
      const ampm = isPm ? "م" : "ص";
      setCurrentTimeStr(`${hours}:${minutes} ${ampm}`);

      const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const dayName = days[now.getDay()];
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      setCurrentDateStr(`${dayName} ${year}/${month}/${day}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateSchoolInfo({ logoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const openModal = (tab: "school" | "branding" | "developer" = "branding") => {
    setModalTab(tab);
    setShowEditSchoolModal(true);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "المدير العام";
      case "principal":
        return "مدير المدرسة";
      case "teacher":
        return "الكادر التدريسي";
      case "parent":
        return "ولي أمر الطالب";
      case "accountant":
        return "المحاسب المالي";
      case "bus_supervisor":
        return "مشرف الحافلات والنقل";
      default:
        return "مستخدم النظام";
    }
  };

  // Clean Ministry name to avoid legacy Iraqi defaults
  const displayMinistry =
    schoolInfo.ministry?.replace("جمهورية العراق - ", "") || "وزارة التربية والتعليم";
  const displayDirectorate =
    schoolInfo.directorate === "المديرية العامة لتربية بغداد"
      ? "إدارة التعليم الأهلي والخاص"
      : schoolInfo.directorate || "إدارة التعليم الأهلي والخاص";

  return (
    <>
      {/* Hidden file input for fast logo upload */}
      <input
        type="file"
        ref={quickLogoInputRef}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
        onChange={handleQuickLogoUpload}
        className="hidden"
        id="quick-header-logo-upload"
      />

      <header className="bg-[#0b3b60] text-white shrink-0 shadow-md select-none border-b border-[#082a45]">
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* RIGHT SIDE (in RTL): Menu Toggle + School Name & Badge */}
          <div className="flex items-center gap-3 sm:gap-4 order-1">
            {!isPortalIsolated && (
              <button
                onClick={onToggleSidebar}
                className="p-1 rounded text-white/90 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
                title="القائمة الجانبية"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* School / System Identity */}
            <div className="flex items-center gap-2 group">
              <div
                onClick={() => openModal("branding")}
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors shadow-xs"
                title="تخصيص لوغو وهوية المدرسة"
              >
                {schoolInfo.logoUrl ? (
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.schoolName || "اللوغو"}
                    className="w-7 h-7 object-contain rounded-xs"
                  />
                ) : (
                  <GraduationCap className="w-5 h-5 text-sky-200" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-white drop-shadow-xs">
                    {schoolInfo.schoolName || "المدرسة النموذجية الأهلية"}
                  </span>
                  <button
                    onClick={() => openModal("school")}
                    className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10 cursor-pointer"
                    title="تعديل اسم المدرسة وبياناتها"
                  >
                    <Edit3 className="w-3 h-3 text-sky-200" />
                  </button>
                </div>

                {/* Social icons row */}
                <div className="flex items-center gap-1.5 text-white/70 text-[11px] mt-0.5">
                  {schoolInfo.developerSocials?.youtube && (
                    <a
                      href={schoolInfo.developerSocials.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      title="YouTube"
                    >
                      <Youtube className="w-3 h-3" />
                    </a>
                  )}
                  {schoolInfo.developerSocials?.facebook && (
                    <a
                      href={schoolInfo.developerSocials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      title="Facebook"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                      </svg>
                    </a>
                  )}
                  {schoolInfo.developerSocials?.telegram && (
                    <a
                      href={schoolInfo.developerSocials.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      title="Telegram"
                    >
                      <Send className="w-3 h-3" />
                    </a>
                  )}
                  <span className="text-[10px] text-sky-200/80">
                    {schoolInfo.motto || "بالعلم والمعرفة نبني المستقبل"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Live Date & Time + Notification Badge */}
          <div className="flex items-center gap-3 order-3 sm:order-2 mx-auto sm:mx-0">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationCenter(true)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors relative cursor-pointer"
                title="مركز تنبيهات الدفع (Push Notifications)"
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadPushCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#0b3b60] animate-pulse">
                    {unreadPushCount}
                  </span>
                )}
              </button>
            </div>

            {/* Live Time & Date Display */}
            <div className="text-right text-xs leading-tight font-medium text-white/90">
              <div className="font-bold tracking-wider">{currentTimeStr || "10:24 ص"}</div>
              <div className="text-[11px] text-sky-200">{currentDateStr || "الأحد 2025/09/21"}</div>
            </div>
          </div>

          {/* LEFT SIDE: School Official Logo + Ministry + User Profile */}
          <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-3">
            {/* School Logo & Ministry / Directorate Info */}
            <div className="flex items-center gap-2.5 text-left text-xs">
              <div className="hidden md:block leading-tight text-right">
                <div className="font-bold text-white tracking-wide">
                  {displayMinistry}
                </div>
                <div className="text-[11px] text-sky-200 font-medium">
                  {displayDirectorate}
                </div>
                <div className="text-[10px] text-sky-300/90">
                  {schoolInfo.location || "الإدارة العامة للتعليم"}
                </div>
              </div>

              {/* School Logo Box (with click-to-upload or edit) */}
              {schoolInfo.logoUrl ? (
                <div
                  onClick={() => openModal("branding")}
                  className="relative group cursor-pointer"
                  title="لوغو المدرسة المعتمد - انقر للتعديل أو تغيير الشعار"
                >
                  <div className="w-11 h-11 rounded-xl bg-white p-1 border-2 border-white/80 shadow-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                    <img
                      src={schoolInfo.logoUrl}
                      alt={schoolInfo.schoolName || "لوغو المدرسة"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      quickLogoInputRef.current?.click();
                    }}
                    className="absolute -bottom-1 -left-1 w-5 h-5 bg-sky-600 hover:bg-sky-500 text-white rounded-full flex items-center justify-center shadow-md border border-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="تغيير الشعار من جهازك مباشرة"
                  >
                    <Camera className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openModal("branding")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-dashed border-sky-300/60 bg-sky-500/10 hover:bg-sky-500/20 text-white cursor-pointer transition-all hover:scale-102 group"
                  title="انقر لإضافة ورفع شعار / لوغو المدرسة"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-600/70 flex items-center justify-center text-white border border-sky-400/40 shrink-0">
                    <Plus className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="hidden sm:block text-right leading-tight">
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      <span>إضافة اللوغو</span>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    </div>
                    <div className="text-[9.5px] text-sky-200">رفع شعار المدرسة</div>
                  </div>
                </button>
              )}
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-white/20 hidden sm:block" />

            {/* Principal Profile Box */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 text-right p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {currentUser.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-bold text-white">
                    {currentUser.role === "principal" || currentUser.role === "super_admin"
                      ? "مدير المدرسة"
                      : currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-sky-200">
                    {getRoleLabel(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {/* Role switch dropdown */}
              {showRoleMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-800">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                    <div className="text-[10.5px] text-slate-500">{getRoleLabel(currentUser.role)}</div>
                  </div>

                  <div className="py-1">
                    {isPortalIsolated ? (
                      <button
                        onClick={() => {
                          setActiveModule("portal_hub");
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-right px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>تسجيل الخروج من البوابة</span>
                        <span>🚪</span>
                      </button>
                    ) : (
                      userProfiles.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchRole(user.role);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-right px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                            currentUser.role === user.role
                              ? "bg-sky-50 text-sky-900 font-bold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="truncate">{user.fullName}</span>
                        </button>
                      ))
                    )}
                  </div>

                  {!isPortalIsolated && (
                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          openModal("branding");
                        }}
                        className="w-full text-right px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 hover:bg-sky-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>تغيير لوغو وشعار المدرسة</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          openModal("school");
                        }}
                        className="w-full text-right px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل بيانات المدرسة والتربية</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Edit School Modal */}
      <EditSchoolModal
        isOpen={showEditSchoolModal}
        onClose={() => setShowEditSchoolModal(false)}
        defaultTab={modalTab}
      />

      {/* Push Notification Drawer Center */}
      <PushNotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </>
  );
};
