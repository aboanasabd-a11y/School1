import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  FolderLock,
  ClipboardCheck,
  BarChart2,
  Megaphone,
  Clock,
  Building2,
  Edit3,
  Sparkles,
  Link as LinkIcon,
  ChevronLeft,
} from "lucide-react";
import { TabType } from "../layout/Sidebar";
import { EditSchoolModal } from "../common/EditSchoolModal";

interface DashboardOverviewProps {
  setActiveTab?: (tab: TabType) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const {
    students,
    staff,
    grades,
    sections,
    schoolInfo,
    announcements,
    timetableSlots,
    setActiveModule,
    openSmartLinksModal,
  } = useSchool();

  const [showEditModal, setShowEditModal] = useState(false);

  const handleNavigate = (tab: TabType) => {
    if (setActiveTab) {
      setActiveTab(tab);
    } else {
      setActiveModule(tab);
    }
  };

  // Metrics matching bottom quick stats:
  // عدد الشعب: 16 (or dynamically computed)
  // عدد الكادر التدريسي: 36 (or staff.length)
  // عدد الطلاب الكلي: 482 (or students.length)
  const totalClassesCount = sections.length > 0 ? sections.length : 16;
  const totalStaffCount = staff.length > 0 ? staff.length : 36;
  const totalStudentsCount = students.length > 0 ? students.length : 482;

  // Primary 8 Grid Cards matching image exactly:
  // Row 1:
  // 1. الجدول الأسبوعي (مواعيد الدروس) - Red Calendar icon
  // 2. الكادر التدريسي (إدارة الكادر التعليمي) - Blue Teacher icon
  // 3. الطلاب (بيانات الطلاب والتسجيل) - Teal/Blue Students icon
  // 4. الدرجات (إدخال ومتابعة الدرجات) - Blue Grades Document icon
  // Row 2:
  // 5. الإعدادات (ضبط النظام والتطبيق) - Dark slate gear icon
  // 6. الملفات والإعدادات (إدارة الملفات المدرسية) - Orange folder icon
  // 7. الغياب والحضور (متابعة حضور الطلاب) - Green attendance document icon
  // 8. التقارير والإحصائيات (تقارير شاملة للمدرسة) - Blue bar chart icon
  const actionCards = [
    {
      id: "timetable" as TabType,
      title: "الجدول الأسبوعي",
      subtitle: "مواعيد الدروس",
      iconBg: "bg-rose-50 text-rose-600 border-rose-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex flex-col items-center justify-center p-1.5 shadow-sm">
          <div className="w-full flex justify-between px-1 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
          <div className="grid grid-cols-3 gap-0.5 w-full flex-1 bg-white/20 p-0.5 rounded">
            <span className="bg-white rounded-[2px]" />
            <span className="bg-white rounded-[2px]" />
            <span className="bg-white rounded-[2px]" />
            <span className="bg-white rounded-[2px]" />
            <span className="bg-white rounded-[2px]" />
            <span className="bg-white rounded-[2px]" />
          </div>
        </div>
      ),
    },
    {
      id: "staff" as TabType,
      title: "الكادر التدريسي",
      subtitle: "إدارة الكادر التعليمي",
      iconBg: "bg-sky-50 text-sky-600 border-sky-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a5 5 0 105 5 5 5 0 00-5-5zm0 8a3 3 0 113-3 3 3 0 01-3 3zm9 11v-1a7 7 0 00-7-7h-4a7 7 0 00-7 7v1h18z" />
          </svg>
        </div>
      ),
    },
    {
      id: "students" as TabType,
      title: "الطلاب",
      subtitle: "بيانات الطلاب والتسجيل",
      iconBg: "bg-blue-50 text-blue-600 border-blue-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-sm">
          <Users className="w-7 h-7" />
        </div>
      ),
    },
    {
      id: "exams" as TabType,
      title: "الدرجات",
      subtitle: "إدخال ومتابعة الدرجات",
      iconBg: "bg-blue-50 text-blue-600 border-blue-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
          <svg className="w-7 h-7 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h4" />
          </svg>
        </div>
      ),
    },
    {
      id: "settings" as TabType,
      title: "الإعدادات",
      subtitle: "ضبط النظام والتطبيق",
      iconBg: "bg-slate-50 text-slate-700 border-slate-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-slate-600 text-white flex items-center justify-center shadow-sm">
          <Settings className="w-7 h-7" />
        </div>
      ),
    },
    {
      id: "school" as TabType,
      title: "الملفات والإعدادات",
      subtitle: "إدارة الملفات المدرسية",
      iconBg: "bg-amber-50 text-amber-600 border-amber-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
          <FolderLock className="w-7 h-7" />
        </div>
      ),
    },
    {
      id: "attendance" as TabType,
      title: "الغياب والحضور",
      subtitle: "متابعة حضور الطلاب",
      iconBg: "bg-teal-50 text-teal-600 border-teal-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
          <div className="relative">
            <svg className="w-7 h-7 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
              ✓
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "reports" as TabType,
      title: "التقارير والإحصائيات",
      subtitle: "تقارير شاملة للمدرسة",
      iconBg: "bg-blue-50 text-blue-600 border-blue-200",
      customIcon: (
        <div className="w-12 h-12 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center shadow-sm">
          <BarChart2 className="w-7 h-7" />
        </div>
      ),
    },
  ];

  // Daily timetable table data matching the image:
  // الدرس | الصف | الوقت
  // اللغة العربية | الأول المتوسط | 08:00 - 08:45
  // الرياضيات | الأول المتوسط | 08:50 - 09:35
  // اللغة الإنكليزية | الأول المتوسط | 09:50 - 10:35
  // العلوم | الأول المتوسط | 10:40 - 11:25
  const todayScheduleRows = [
    {
      subject: "اللغة العربية",
      grade: "الأول المتوسط",
      time: "08:00 - 08:45",
    },
    {
      subject: "الرياضيات",
      grade: "الأول المتوسط",
      time: "08:50 - 09:35",
    },
    {
      subject: "اللغة الإنكليزية",
      grade: "الأول المتوسط",
      time: "09:50 - 10:35",
    },
    {
      subject: "العلوم",
      grade: "الأول المتوسط",
      time: "10:40 - 11:25",
    },
  ];

  // Announcements & Notifications list matching image:
  // تم إضافة درجات الامتحان الشهري الأول - 2025/09/21
  // مراجعة بيانات الطلاب قبل إغلاق السنة الدراسية - 2025/09/18
  // اجتماع الهيئة التدريسية يوم الإثنين القادم - 2025/09/15
  // تحديث بيانات الكادر التدريسي في النظام - 2025/09/12
  const announcementsList = [
    {
      id: "ann-1",
      title: "تم إضافة درجات الامتحان الشهري الأول",
      date: "2025/09/21",
      iconBg: "bg-sky-500",
      iconText: "📝",
    },
    {
      id: "ann-2",
      title: "مراجعة بيانات الطلاب قبل إغلاق السنة الدراسية",
      date: "2025/09/18",
      iconBg: "bg-emerald-500",
      iconText: "👥",
    },
    {
      id: "ann-3",
      title: "اجتماع الهيئة التدريسية يوم الإثنين القادم",
      date: "2025/09/15",
      iconBg: "bg-rose-500",
      iconText: "📅",
    },
    {
      id: "ann-4",
      title: "تحديث بيانات الكادر التدريسي في النظام",
      date: "2025/09/12",
      iconBg: "bg-purple-600",
      iconText: "👤",
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* TOP HEADER BARS: Welcome box (Right) & School Title Badge (Left) matching image */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* RIGHT (RTL): Welcome User Card */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b3b60] text-white flex items-center justify-center shadow-xs shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">أهلاً وسهلاً</div>
            <div className="text-sm font-black text-slate-900 leading-tight">
              {schoolInfo.developerName || "Ahmedpc"}
            </div>
            <div className="text-[10.5px] text-slate-400">في لوحة التحكم</div>
          </div>
        </div>

        {/* Action quick links button: Direct Links & Edit School */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openSmartLinksModal()}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>روابط مباشرة للمعلمين وأولياء الأمور</span>
          </button>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-sky-600" />
            <span>تعديل اللوغو والمعلومات</span>
          </button>
        </div>

        {/* LEFT (RTL): School Title & Directorate Box */}
        <div
          onClick={() => setShowEditModal(true)}
          className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-sky-400 transition-colors group"
          title="اضغط لتعديل معلومات المدرسة والشعار"
        >
          <div className="text-right">
            <div className="text-sm font-black text-slate-900 group-hover:text-sky-700 transition-colors flex items-center gap-1.5">
              <span>{schoolInfo.schoolName || "متوسطة الرافدين للبنين"}</span>
              <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-sky-600" />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {schoolInfo.directorate || "المديرية العامة لتربية بغداد"}
            </div>
          </div>

          {/* School Building Logo Illustration matching image */}
          <div className="w-12 h-10 rounded-lg bg-sky-100/80 border border-sky-300/60 p-1 flex items-center justify-center shrink-0">
            {schoolInfo.logoUrl ? (
              <img
                src={schoolInfo.logoUrl}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <svg className="w-8 h-8 text-sky-600" viewBox="0 0 64 64" fill="currentColor">
                {/* Triangular roof & school tower with bell */}
                <polygon points="32,4 12,20 52,20" fill="#0284c7" />
                <rect x="26" y="8" width="12" height="10" fill="#0369a1" />
                <circle cx="32" cy="13" r="2.5" fill="#fef08a" />
                {/* Main Building Body */}
                <rect x="16" y="20" width="32" height="38" rx="2" fill="#38bdf8" />
                {/* Windows */}
                <rect x="20" y="26" width="6" height="8" rx="1" fill="#ffffff" />
                <rect x="38" y="26" width="6" height="8" rx="1" fill="#ffffff" />
                <rect x="20" y="40" width="6" height="8" rx="1" fill="#ffffff" />
                <rect x="38" y="40" width="6" height="8" rx="1" fill="#ffffff" />
                {/* School Door */}
                <rect x="28" y="44" width="8" height="14" rx="1" fill="#0f172a" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* 8 BIG ACTION TILES (4 columns x 2 rows) matching the screenshot layout exactly */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actionCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleNavigate(card.id)}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[140px]"
          >
            {/* Custom Icon Container */}
            <div className="mb-2.5 group-hover:scale-105 transition-transform">
              {card.customIcon}
            </div>

            <div className="font-black text-slate-800 text-sm sm:text-base leading-tight group-hover:text-sky-700 transition-colors">
              {card.title}
            </div>

            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
              {card.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION: 2 COLUMNS
          Left column: الإعلانات والتنبيهات (Announcements with 'عرض الكل')
          Right column: الجدول الأسبوعي اليوم (Weekly Schedule Table) + إحصائية سريعة (Bottom 3 counters) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* RIGHT COLUMN (Lg: 7 cols): Schedule Table & Quick Stats */}
        <div className="lg:col-span-7 space-y-3">
          {/* Table: الجدول الأسبوعي اليوم */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3 bg-white border-b border-slate-100 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-xs">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-black text-xs sm:text-sm text-slate-900">
                الجدول الأسبوعي اليوم
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-sky-50/70 text-slate-700 font-bold border-b border-sky-100 text-[11px]">
                    <th className="py-2.5 px-3">الدرس</th>
                    <th className="py-2.5 px-3">الصف</th>
                    <th className="py-2.5 px-3">الوقت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {todayScheduleRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-sky-50/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {row.subject}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {row.grade}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]" dir="ltr">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats: إحصائية سريعة matching bottom-right of image */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-3">
              <Users className="w-4 h-4 text-sky-600" />
              <span>إحصائية سريعة</span>
            </div>

            {/* 3 Metrics Cards Row matching image: عدد الشعب / عدد الكادر التدريسي / عدد الطلاب الكلي */}
            <div className="grid grid-cols-3 gap-2">
              {/* عدد الشعب */}
              <div
                onClick={() => handleNavigate("school")}
                className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-center cursor-pointer hover:bg-purple-100/80 transition-colors"
              >
                <div className="w-6 h-6 mx-auto rounded-full bg-purple-600 text-white flex items-center justify-center mb-1 text-[11px]">
                  ⊞
                </div>
                <div className="text-[10px] text-purple-900 font-bold">عدد الشعب</div>
                <div className="text-base sm:text-lg font-black text-purple-950 mt-0.5">
                  {totalClassesCount}
                </div>
              </div>

              {/* عدد الكادر التدريسي */}
              <div
                onClick={() => handleNavigate("staff")}
                className="bg-sky-50/70 border border-sky-100 rounded-xl p-2.5 text-center cursor-pointer hover:bg-sky-100/80 transition-colors"
              >
                <div className="w-6 h-6 mx-auto rounded-full bg-sky-600 text-white flex items-center justify-center mb-1 text-[11px]">
                  🎓
                </div>
                <div className="text-[10px] text-sky-900 font-bold">عدد الكادر التدريسي</div>
                <div className="text-base sm:text-lg font-black text-sky-950 mt-0.5">
                  {totalStaffCount}
                </div>
              </div>

              {/* عدد الطلاب الكلي */}
              <div
                onClick={() => handleNavigate("students")}
                className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 text-center cursor-pointer hover:bg-emerald-100/80 transition-colors"
              >
                <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 text-[11px]">
                  👥
                </div>
                <div className="text-[10px] text-emerald-900 font-bold">عدد الطلاب الكلي</div>
                <div className="text-base sm:text-lg font-black text-emerald-950 mt-0.5">
                  {totalStudentsCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN (Lg: 5 cols): Announcements & Notifications matching image */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 h-full flex flex-col justify-between">
            <div>
              {/* Header: الإعلانات والتنبيهات with عرض الكل */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <button
                  onClick={() => handleNavigate("communication")}
                  className="text-xs text-sky-700 hover:text-sky-900 font-bold hover:underline cursor-pointer"
                >
                  عرض الكل
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm text-slate-900">
                    الإعلانات والتنبيهات
                  </span>
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                    <Megaphone className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Announcements List matching screenshot items */}
              <div className="space-y-2.5">
                {announcementsList.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => handleNavigate("communication")}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-200 bg-slate-50/40 hover:bg-sky-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="text-[10.5px] text-slate-400 font-mono shrink-0">
                      {ann.date}
                    </div>

                    <div className="flex items-center gap-2 font-bold text-slate-800 text-right flex-1 justify-end">
                      <span className="line-clamp-1">{ann.title}</span>
                      <div
                        className={`w-6 h-6 rounded-md ${ann.iconBg} text-white flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                      >
                        {ann.iconText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Transport Status Banner on Dashboard */}
            <div
              onClick={() => handleNavigate("transport")}
              className="mt-4 p-2.5 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent border border-amber-300/40 rounded-lg flex items-center justify-between cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  🚌
                </div>
                <div>
                  <div className="font-bold text-amber-950">نظام المواصلات وتتبع GPS الحي</div>
                  <div className="text-[10px] text-amber-700">3 حافلات نشطة في خط السير الصباحي</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit School Modal */}
      <EditSchoolModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};
