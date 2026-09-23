import React, { useState, useEffect } from "react";
import { useSchool } from "../../context/SchoolContext";
import { UserRole } from "../../types";
import {
  Bell,
  Menu,
  ChevronDown,
  Edit3,
  Youtube,
  Send,
  ExternalLink,
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
    unreadPushCount,
    setActiveModule,
  } = useSchool();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  // Live real-time clock matching the image: 10:24 ص | الأحد 2025/09/21
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Arabic 12-hour: 10:24 ص
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const isPm = hours >= 12;
      hours = hours % 12 || 12;
      const ampm = isPm ? "م" : "ص";
      setCurrentTimeStr(`${hours}:${minutes} ${ampm}`);

      // Format date in Arabic: الأحد 2025/09/21
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
        return "مشرف الحافلات";
    }
  };

  return (
    <>
      <header className="bg-[#0b3b60] text-white shrink-0 shadow-md select-none border-b border-[#082a45]">
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* RIGHT SIDE (in RTL): Menu Toggle + Developer Branding + Socials */}
          <div className="flex items-center gap-3 sm:gap-4 order-1">
            <button
              onClick={onToggleSidebar}
              className="p-1 rounded text-white/90 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
              title="القائمة الجانبية"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Developer Identity Block matching Ahmedpc */}
            <div className="flex items-center gap-2 group">
              {/* Graduation Cap Logo Icon */}
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
                <svg
                  className="w-5 h-5 fill-current text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-white drop-shadow-xs">
                    {schoolInfo.developerName || "Ahmedpc"}
                  </span>
                  <button
                    onClick={() => setShowEditSchoolModal(true)}
                    className="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10"
                    title="تعديل معلومات المدرسة والمطور"
                  >
                    <Edit3 className="w-3 h-3 text-sky-200" />
                  </button>
                </div>

                {/* Social icons row: Youtube, Facebook, Telegram, TikTok */}
                <div className="flex items-center gap-1.5 text-white/70 text-[11px] mt-0.5">
                  {/* YouTube */}
                  <a
                    href={schoolInfo.developerSocials?.youtube || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="w-3 h-3" />
                  </a>
                  {/* Facebook */}
                  <a
                    href={schoolInfo.developerSocials?.facebook || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                    title="Facebook"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                    </svg>
                  </a>
                  {/* Telegram */}
                  <a
                    href={schoolInfo.developerSocials?.telegram || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                    title="Telegram"
                  >
                    <Send className="w-3 h-3" />
                  </a>
                  {/* TikTok */}
                  <a
                    href={schoolInfo.developerSocials?.tiktok || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                    title="TikTok"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Live Date & Time + Notification Badge (matching image) */}
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

          {/* LEFT SIDE: Iraqi Emblem & Ministry + Directorate + User Avatar */}
          <div className="flex items-center gap-3 sm:gap-5 order-2 sm:order-3">
            {/* Republic of Iraq & Ministry of Education */}
            <div className="flex items-center gap-2.5 text-left text-xs">
              <div className="hidden md:block leading-tight text-right">
                <div className="font-bold text-white tracking-wide">
                  {schoolInfo.country || "جمهورية العراق"}
                </div>
                <div className="text-[11px] text-sky-200 font-medium">
                  {schoolInfo.ministry.replace("جمهورية العراق - ", "") || "وزارة التربية"}
                </div>
                <div className="text-[10.5px] text-sky-300/90">
                  {schoolInfo.directorate || "المديرية العامة لتربية بغداد"}
                </div>
              </div>

              {/* Iraqi Republic Golden Coat of Arms (Eagle Emblem) */}
              <div
                onClick={() => setShowEditSchoolModal(true)}
                className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/30 border border-amber-300/40 p-1 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                title="تعديل بيانات وشعار المدرسة والتربية"
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Golden Eagle stylized silhouette representing Iraq's emblem */}
                  <path
                    d="M50 8 C40 18 30 25 20 30 C25 45 28 65 35 78 C40 85 45 88 50 92 C55 88 60 85 65 78 C72 65 75 45 80 30 C70 25 60 18 50 8 Z"
                    fill="#eab308"
                    stroke="#ca8a04"
                    strokeWidth="2"
                  />
                  {/* Iraq Flag center Shield */}
                  <rect x="42" y="38" width="16" height="32" rx="2" fill="#dc2626" />
                  <rect x="42" y="48" width="16" height="11" fill="#ffffff" />
                  <rect x="42" y="59" width="16" height="11" fill="#0f172a" />
                  {/* Green stars / Takbir */}
                  <circle cx="50" cy="53.5" r="2" fill="#16a34a" />
                </svg>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-white/20 hidden sm:block" />

            {/* Principal Profile Box (matching image top-left) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 text-right p-1 rounded-lg hover:bg-white/10 transition-colors"
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
                    {userProfiles.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchRole(user.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-right px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
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
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        setShowEditSchoolModal(true);
                      }}
                      className="w-full text-right px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 hover:bg-sky-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل اللوغو ومعلومات المدرسة</span>
                    </button>
                  </div>
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
      />

      {/* Push Notification Drawer Center */}
      <PushNotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </>
  );
};
