import React from "react";
import { useSchool } from "../../context/SchoolContext";
import { ActiveModule } from "../../types";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Award,
  CalendarCheck,
  Bus,
  Megaphone,
  CalendarDays,
  FileText,
  CreditCard,
  Settings,
  Sparkles,
  ShieldCheck,
  X,
  School,
} from "lucide-react";

export type TabType = ActiveModule;

interface SidebarProps {
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  isOpen,
  onClose,
}) => {
  const {
    activeModule,
    setActiveModule,
    students,
    staff,
    exams,
    busRoutes,
    announcements,
  } = useSchool();

  const currentActive = propActiveTab || activeModule || "dashboard";
  const handleSelect = (tab: TabType) => {
    if (propSetActiveTab) propSetActiveTab(tab);
    setActiveModule(tab);
    onClose();
  };

  const navigationItems = [
    {
      id: "dashboard" as TabType,
      label: "لوحة التحكم",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "students" as TabType,
      label: "الطلاب والملفات",
      icon: Users,
      badge: students.length,
      badgeColor: "bg-blue-900/60 text-blue-300",
    },
    {
      id: "staff" as TabType,
      label: "الكادر التعليمي",
      icon: GraduationCap,
      badge: staff.length,
      badgeColor: "bg-emerald-950/70 text-emerald-300",
    },
    {
      id: "school" as TabType,
      label: "الفصول والشعب",
      icon: Building2,
      badge: null,
    },
    {
      id: "exams" as TabType,
      label: "الامتحانات والعلامات",
      icon: Award,
      badge: exams.length,
      badgeColor: "bg-purple-950/70 text-purple-300",
    },
    {
      id: "attendance" as TabType,
      label: "الحضور والسلوك",
      icon: CalendarCheck,
      badge: null,
    },
    {
      id: "transport" as TabType,
      label: "النقل المدرسي GPS",
      icon: Bus,
      badge: `${busRoutes.length}`,
      badgeColor: "bg-amber-950/70 text-amber-300",
    },
    {
      id: "communication" as TabType,
      label: "الإعلانات والمراسلة",
      icon: Megaphone,
      badge: announcements.length,
      badgeColor: "bg-rose-950/70 text-rose-300",
    },
    {
      id: "timetable" as TabType,
      label: "الجدول والدوام",
      icon: CalendarDays,
      badge: null,
    },
    {
      id: "reports" as TabType,
      label: "التقارير والكشوفات",
      icon: FileText,
      badge: null,
    },
    {
      id: "finance" as TabType,
      label: "المالية والأقساط",
      icon: CreditCard,
      badge: null,
    },
    {
      id: "settings" as TabType,
      label: "إعدادات النظام والأمان",
      icon: Settings,
      badge: "Azure",
      badgeColor: "bg-sky-950/70 text-sky-300",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-56 bg-slate-800 text-slate-200 border-l border-slate-700 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <School className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">
                إتقان <span className="text-sky-400">التعليمي</span>
              </div>
              <div className="text-[10px] text-slate-400">نظام إدارة المدارس</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            الوحدات الأساسية
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white font-semibold shadow-xs"
                    : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-sky-400" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                      isActive
                        ? "bg-sky-500/20 text-sky-300"
                        : item.badgeColor || "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Cloud Status */}
        <div className="p-2.5 border-t border-slate-700 bg-slate-800/80 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              سحابة Azure
            </span>
            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              متصل
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
