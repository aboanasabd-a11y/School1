import React from "react";
import { useSchool } from "../../context/SchoolContext";
import { TabType } from "../layout/Sidebar";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Bus,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Award,
  PlusCircle,
  Megaphone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardOverviewProps {
  setActiveTab?: (tab: TabType) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const {
    students,
    staff,
    grades,
    attendanceRecords,
    busRoutes,
    payments,
    announcements,
    timetableSlots,
    setActiveModule,
  } = useSchool();

  const handleNavigate = (tab: TabType) => {
    if (setActiveTab) {
      setActiveTab(tab);
    } else {
      setActiveModule(tab);
    }
  };

  // Metrics calculations
  const totalStudents = students.length;
  const totalStaff = staff.length;

  const todayStr = "2026-02-28";
  const todayAttendance = attendanceRecords.filter((r) => r.date === todayStr);
  const presentCount = todayAttendance.filter((r) => r.status === "present").length;
  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round((presentCount / todayAttendance.length) * 100)
      : 96;

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpectedTuition = students.reduce(
    (acc, s) => acc + s.finance.netAmount,
    0
  );
  const collectionPercentage =
    totalExpectedTuition > 0
      ? Math.round((totalCollected / totalExpectedTuition) * 100)
      : 88;

  // Grade Distribution Chart data
  const gradeDistributionData = grades.map((g) => ({
    name: g.code,
    fullName: g.name,
    طلاب: students.filter((s) => s.gradeId === g.id).length,
    سعة: g.sectionsCount * 28,
  }));

  // Recent students
  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* Top 4 Stat Cards Row (High Density) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Students */}
        <div
          onClick={() => handleNavigate("students")}
          className="stat-card hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="stat-label">إجمالي الطلاب</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="stat-value mt-1">
            {totalStudents} <span className="text-xs text-slate-500 font-normal">طالب</span>
          </div>
          <div className="text-[10.5px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +4.2% مقارنة بالعام السابق
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div
          onClick={() => handleNavigate("attendance")}
          className="stat-card hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="stat-label">نسبة حضور اليوم</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="stat-value text-emerald-600 mt-1">
            {attendanceRate}%
          </div>
          <div className="text-[10.5px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {presentCount} حاضر من إجمالي الشعب
          </div>
        </div>

        {/* Tuition Collections */}
        <div
          onClick={() => handleNavigate("finance")}
          className="stat-card hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="stat-label">الأقساط المحصلة</span>
            <CreditCard className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="stat-value text-slate-900 mt-1">
            {totalCollected.toLocaleString()}{" "}
            <span className="text-xs text-slate-500 font-normal">ر.س</span>
          </div>
          <div className="text-[10.5px] text-blue-600 font-medium mt-1">
            نسبة التحصيل: {collectionPercentage}% من المستهدف
          </div>
        </div>

        {/* Active Bus Fleet */}
        <div
          onClick={() => handleNavigate("transport")}
          className="stat-card hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="stat-label">أسطول الحافلات GPS</span>
            <Bus className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="stat-value text-amber-600 mt-1">
            {busRoutes.length} / {busRoutes.length}{" "}
            <span className="text-xs text-slate-500 font-normal">حافلات نشطة</span>
          </div>
          <div className="text-[10.5px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            تتبع الأقمار الصناعية متصل
          </div>
        </div>
      </div>

      {/* Main High Density Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left Column (2 Cols wide on desktop): Recent Students & Schedule */}
        <div className="lg:col-span-2 space-y-3.5">
          {/* Recent Students Table Card */}
          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>أحدث ملفات الطلاب المسجلين</span>
              </div>
              <button
                onClick={() => handleNavigate("students")}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
              >
                عرض كل الطلاب <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الطالب</th>
                    <th>الرقم الأكاديمي</th>
                    <th>المرحلة / الصف</th>
                    <th>الشعبة</th>
                    <th>الحالة المالية</th>
                    <th>حالة القيد</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="font-semibold text-slate-900 flex items-center gap-2">
                        <img
                          src={st.photo || (st as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                          alt={st.fullName}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span>{st.fullName}</span>
                      </td>
                      <td className="font-mono text-slate-600">{st.studentNumber}</td>
                      <td className="text-slate-700">{st.gradeName}</td>
                      <td>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10.5px]">
                          {st.sectionName}
                        </span>
                      </td>
                      <td>
                        {(st.finance?.balance ?? 0) === 0 ? (
                          <span className="status-pill bg-success">مسدد بالكامل</span>
                        ) : (
                          <span className="status-pill bg-warning">
                            متبقي {(st.finance?.balance ?? 0).toLocaleString()} ر.س
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="status-pill bg-success">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          منتظم
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Capacity & Grade Distribution Bar Chart */}
          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>إشغال الفصول والطاقة الاستيعابية للمراحل</span>
              </div>
              <button
                onClick={() => handleNavigate("school")}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                هيكلية الصفوف
              </button>
            </div>

            <div className="p-3">
              <div className="h-48 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={gradeDistributionData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        color: "#fff",
                        borderRadius: "6px",
                        fontSize: "11px",
                        border: "none",
                        padding: "6px 10px",
                      }}
                    />
                    <Bar dataKey="سعة" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="السعة القصوى" />
                    <Bar dataKey="طلاب" fill="#2563eb" radius={[4, 4, 0, 0]} name="الطلاب المقيدين" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live GPS Radar, Quick Actions, Announcements */}
        <div className="space-y-3.5">
          {/* Live GPS Radar Widget */}
          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>رادار النقل المدرسي المباشر</span>
              </div>
              <button
                onClick={() => handleNavigate("transport")}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                الخريطة الكاملة
              </button>
            </div>

            <div className="p-3 space-y-2.5">
              {/* Mini visual radar simulation box */}
              <div className="gps-widget flex items-center justify-center p-2 relative bg-slate-900 border-slate-700">
                {/* Simulated map grid lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated Bus Position Dots */}
                <div
                  className="dot dot-pulse"
                  style={{ top: "28%", left: "35%", backgroundColor: "#38bdf8" }}
                  title="حافلة الشمال #01"
                />
                <div
                  className="dot dot-pulse"
                  style={{ top: "62%", left: "70%", backgroundColor: "#10b981" }}
                  title="حافلة الروضة #03"
                />
                <div
                  className="dot dot-pulse"
                  style={{ top: "45%", left: "50%", backgroundColor: "#f59e0b" }}
                  title="حافلة الشرق #02"
                />

                <div className="relative z-10 text-center text-white text-xs bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700">
                  <span className="text-[10px] text-sky-400 font-mono font-bold block">
                    GPS SATELLITE RADAR
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200">
                    3 حافلات في المسار الصباحي
                  </span>
                </div>
              </div>

              {/* Bus Route Quick Status Items */}
              <div className="space-y-1.5">
                {busRoutes.slice(0, 2).map((route) => (
                  <div
                    key={route.id}
                    className="p-2 rounded bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{route.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        السائق: {route.driverName} • {route.studentsCount} طالب
                      </div>
                    </div>
                    <span className="status-pill bg-success text-[9.5px]">
                      {route.status === "in_transit" ? "في الطريق" : "مكتمل"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Matrix */}
          <div className="wide-card">
            <div className="card-header">
              <span className="font-semibold">إجراءات سريعة</span>
              <span className="text-[10.5px] text-slate-400">وصول فوري</span>
            </div>

            <div className="p-2.5 grid grid-cols-1 gap-1.5">
              <button
                onClick={() => handleNavigate("attendance")}
                className="w-full flex items-center justify-between p-2 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-800 transition-colors text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CalendarCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>تسجيل الحضور اليومي</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavigate("exams")}
                className="w-full flex items-center justify-between p-2 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-800 transition-colors text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span>رصد درجات الامتحانات</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavigate("reports")}
                className="w-full flex items-center justify-between p-2 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-800 transition-colors text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>توليد تقرير الذكاء الاصطناعي</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavigate("settings")}
                className="w-full flex items-center justify-between p-2 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-800 transition-colors text-right"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-sky-100 text-sky-700 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>إدارة الصلاحيات والنسخ السحابي</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* School Announcements */}
          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-rose-600" />
                <span>التعاميم المدرسية</span>
              </div>
              <button
                onClick={() => handleNavigate("communication")}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                المزيد
              </button>
            </div>

            <div className="p-2.5 space-y-2">
              {announcements.slice(0, 2).map((ann) => (
                <div
                  key={ann.id}
                  className="p-2 rounded bg-slate-50 border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ann.title}</span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
