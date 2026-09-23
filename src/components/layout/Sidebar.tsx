import React from "react";
import { useSchool } from "../../context/SchoolContext";
import { ActiveModule } from "../../types";
import {
  Home,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart2,
  FolderLock,
  Settings,
  X,
  Bus,
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
  const { activeModule, setActiveModule } = useSchool();

  const currentActive = propActiveTab || activeModule || "dashboard";

  const handleSelect = (tab: TabType) => {
    if (propSetActiveTab) propSetActiveTab(tab);
    setActiveModule(tab);
    onClose();
  };

  // Vertical navigation menu items matching the image right sidebar exactly:
  // 1. الرئيسية (Home)
  // 2. الدرجات (Grades)
  // 3. الطلاب (Students)
  // 4. الكادر التدريسي (Staff / Teachers)
  // 5. الجدول الأسبوعي (Weekly Timetable)
  // 6. الغياب والحضور (Attendance)
  // 7. التقارير والإحصائيات (Reports & Stats)
  // 8. الملفات والإعدادات (Files & Settings / School)
  // 9. الإعدادات (Settings)
  // 10. المواصلات وحافلات GPS (Transportation)
  const menuItems = [
    {
      id: "dashboard" as TabType,
      label: "الرئيسية",
      icon: Home,
    },
    {
      id: "exams" as TabType,
      label: "الدرجات",
      icon: BookOpen,
    },
    {
      id: "students" as TabType,
      label: "الطلاب",
      icon: Users,
    },
    {
      id: "staff" as TabType,
      label: "الكادر التدريسي",
      icon: GraduationCap,
    },
    {
      id: "timetable" as TabType,
      label: "الجدول الأسبوعي",
      icon: Calendar,
    },
    {
      id: "attendance" as TabType,
      label: "الغياب والحضور",
      icon: ClipboardCheck,
    },
    {
      id: "reports" as TabType,
      label: "التقارير والإحصائيات",
      icon: BarChart2,
    },
    {
      id: "school" as TabType,
      label: "الملفات والإعدادات",
      icon: FolderLock,
    },
    {
      id: "transport" as TabType,
      label: "المواصلات وحافلات GPS",
      icon: Bus,
    },
    {
      id: "settings" as TabType,
      label: "الإعدادات",
      icon: Settings,
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

      {/* Vertical Sidebar matching the deep navy background #0a2540 / #0b3b60 */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-52 sm:w-56 bg-[#0a2744] text-white flex flex-col shrink-0 border-l border-[#071d33] transition-transform duration-200 ease-in-out select-none ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile close bar */}
        <div className="h-10 px-3 flex items-center justify-between border-b border-white/10 lg:hidden">
          <span className="text-xs font-bold text-sky-200">القائمة الرئيسية</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items List */}
        <nav className="flex-1 py-2 overflow-y-auto space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-colors cursor-pointer text-right group ${
                  isActive
                    ? "bg-[#0284c7] text-white shadow-inner font-extrabold"
                    : "text-slate-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-sky-300/80"
                    }`}
                  />
                  <span className="text-[12.5px] leading-tight">{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom subtle watermark */}
        <div className="p-3 border-t border-white/10 text-center text-[10px] text-white/40">
          <span>نظام الإدارة المدرسية الموحد</span>
        </div>
      </aside>
    </>
  );
};
