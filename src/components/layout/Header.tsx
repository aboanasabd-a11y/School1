import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { UserRole } from "../../types";
import {
  Bell,
  Search,
  Sparkles,
  Calendar,
  ChevronDown,
  CheckCircle,
  Menu,
  Share2,
  Link as LinkIcon,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenGlobalSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    switchRole,
    userProfiles,
    academicYears,
    selectedYear,
    setSelectedYear,
    announcements,
    setActiveModule,
    openSmartLinksModal,
  } = useSchool();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showYearMenu, setShowYearMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "المدير العام / المشرف";
      case "principal":
        return "مدير المدرسة";
      case "teacher":
        return "معلم / كادر تعليمي";
      case "parent":
        return "ولي أمر الطالب";
      case "accountant":
        return "المحاسب المالي";
      case "bus_supervisor":
        return "مشرف الحافلات";
    }
  };

  const currentYearObj = academicYears.find((y) => y.id === selectedYear) || academicYears[0];

  return (
    <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0 px-4 flex items-center justify-between gap-3 shadow-2xs">
      {/* Right Side (RTL): Sidebar trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          title="تبديل القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar matching High Density design */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث سريع عن طالب، معلم، شعبة، أو سجل..."
            className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-md pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Left Side (RTL): Quick Actions, Year Selector, AI button & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Academic Year Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowYearMenu(!showYearMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11.5px]">{currentYearObj?.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showYearMenu && (
            <div className="absolute left-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                العام الدراسي النشط
              </div>
              {academicYears.map((y) => (
                <button
                  key={y.id}
                  onClick={() => {
                    setSelectedYear(y.id);
                    setShowYearMenu(false);
                  }}
                  className={`w-full text-right px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    selectedYear === y.id ? "text-blue-600 font-bold bg-blue-50/50" : "text-slate-700"
                  }`}
                >
                  <span>{y.name}</span>
                  {selectedYear === y.id && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Smart Links Modal Trigger */}
        <button
          onClick={() => openSmartLinksModal()}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold shadow-xs transition-all"
          title="إرسال رابط مباشر للمعلم أو لولي الأمر حسب رقم الطالب"
        >
          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">مشاركة الروابط المباشرة</span>
        </button>

        {/* AI Action Button matching High Density design */}
        <button
          onClick={() => setActiveModule("reports")}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <span className="ai-badge">AI</span>
          <span className="hidden sm:inline">إنشاء تقرير ذكي</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setActiveModule("communication")}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 relative transition-colors"
            title="الإعلانات والتنبيهات"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1 rounded-md border border-slate-200 hover:bg-slate-50 transition-all text-right"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-7 h-7 rounded object-cover ring-1 ring-slate-200"
            />
            <div className="hidden sm:block text-right">
              <div className="text-[12px] font-bold text-slate-900 leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-slate-500">
                {getRoleLabel(currentUser.role)}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute left-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-800">{currentUser.fullName}</div>
                <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                <div className="mt-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                  تبديل الصلاحية والمنظور:
                </div>
              </div>

              <div className="space-y-0.5">
                {userProfiles.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchRole(user.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-right p-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                      currentUser.role === user.role
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <div className="flex-1 truncate">
                      <div className="truncate text-[11.5px] font-medium">{user.fullName}</div>
                      <div className="text-[9.5px] text-slate-500">{getRoleLabel(user.role)}</div>
                    </div>
                    {currentUser.role === user.role && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
