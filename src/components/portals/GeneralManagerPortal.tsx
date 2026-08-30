import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  ShieldAlert,
  Users,
  GraduationCap,
  DollarSign,
  Bus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Settings,
  UserCheck,
  Building,
  Calendar,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  Plus,
  Printer,
  Sliders,
} from "lucide-react";

export const GeneralManagerPortal: React.FC = () => {
  const {
    currentUser,
    students,
    staff,
    payments,
    busRoutes,
    grades,
    setActiveModule,
    switchUserRole,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "portals_control" | "audit_logs">("overview");

  // Key metrics
  const totalStudents = students.length;
  const totalStaff = staff.length;
  const totalTuition = students.reduce((acc, s) => acc + (s.finance?.netAmount || 0), 0);
  const collectedTuition = students.reduce((acc, s) => acc + (s.finance?.paidAmount || 0), 0);
  const collectionPercentage = totalTuition > 0 ? Math.round((collectedTuition / totalTuition) * 100) : 0;
  const totalBuses = busRoutes.length;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">بوابة المدير العام والإشراف الشامل</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                صلاحيات المدير العام (كاملة)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مرحباً {currentUser.fullName} • لوحة القيادة العليا والتحكم المركزي بجميع بوابات وأقسام المدرسة
            </p>
          </div>
        </div>

        {/* Quick Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>المؤشرات الاستراتيجية</span>
          </button>

          <button
            onClick={() => setActiveTab("portals_control")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "portals_control"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>التحكم بالبوابات الـ 5</span>
          </button>

          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "approvals"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>الاعتمادات والقرارات</span>
          </button>

          <button
            onClick={() => setActiveTab("audit_logs")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "audit_logs"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>سجل العمليات والرقابة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card cursor-pointer" onClick={() => setActiveModule("students")}>
          <span className="stat-label">إجمالي الطلاب المسجلين</span>
          <div className="stat-value text-slate-900">{totalStudents} طالب</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">نسبة الحضور اليومية: 97.8%</div>
        </div>

        <div className="stat-card cursor-pointer" onClick={() => setActiveModule("staff")}>
          <span className="stat-label">الكادر التعليمي والإداري</span>
          <div className="stat-value text-blue-700">{totalStaff} موظف</div>
          <div className="text-[10px] text-slate-500 mt-1">100% نسبة التغطية الصفية</div>
        </div>

        <div className="stat-card cursor-pointer" onClick={() => setActiveModule("finance")}>
          <span className="stat-label">إجمالي التحصيل المالي</span>
          <div className="stat-value text-emerald-700">{collectedTuition.toLocaleString()} ر.س</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">نسبة الإنجاز المالي: {collectionPercentage}%</div>
        </div>

        <div className="stat-card cursor-pointer" onClick={() => setActiveModule("transportation")}>
          <span className="stat-label">أسطول الحافلات المدرسية</span>
          <div className="stat-value text-amber-600">{totalBuses} حافلات</div>
          <div className="text-[10px] text-slate-500 mt-1">تتبع GPS نشط بنسبة 100%</div>
        </div>
      </div>

      {/* TAB 1: STRATEGIC OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Access to Portals */}
            <div className="lg:col-span-2 wide-card">
              <div className="card-header">
                <span className="font-bold text-slate-800">الانتقال المباشر للبوابات المستقلة حسب الصلاحيات</span>
                <span className="text-[11px] text-slate-500">المدير العام يمتلك صلاحية الدخول لكل بوابة</span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => switchUserRole("teacher")}
                  className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
                      <GraduationCap className="w-4 h-4 text-blue-700" />
                      <span>1. بوابة المعلم</span>
                    </div>
                    <span className="text-[10px] bg-blue-200/80 text-blue-800 px-2 py-0.5 rounded font-bold">دخول</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    رصد الحضور، تسجيل الدرجات، السلوك، الواجبات، والتواصل مع الطلاب.
                  </p>
                </div>

                <div
                  onClick={() => switchUserRole("accountant")}
                  className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-indigo-900 text-xs">
                      <DollarSign className="w-4 h-4 text-indigo-700" />
                      <span>2. بوابة المحاسب المالي</span>
                    </div>
                    <span className="text-[10px] bg-indigo-200/80 text-indigo-800 px-2 py-0.5 rounded font-bold">دخول</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    متابعة الأقساط، إصدار سندات القبض، الخصومات، والذمم المالية.
                  </p>
                </div>

                <div
                  onClick={() => switchUserRole("parent")}
                  className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-purple-900 text-xs">
                      <Users className="w-4 h-4 text-purple-700" />
                      <span>3. بوابة ولي الأمر</span>
                    </div>
                    <span className="text-[10px] bg-purple-200/80 text-purple-800 px-2 py-0.5 rounded font-bold">دخول</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    متابعة مستوى الابن، كشف الدرجات، تتبع الباص، وإرسال ملاحظات للإدارة.
                  </p>
                </div>

                <div
                  onClick={() => switchUserRole("bus_supervisor")}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                      <Bus className="w-4 h-4 text-amber-700" />
                      <span>4. بوابة مشرف الحافلات</span>
                    </div>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">دخول</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    تتبع خطوط السير، صعود ونزول الطلاب، الرادار اللحظي، وتنبيهات الطوارئ.
                  </p>
                </div>
              </div>
            </div>

            {/* School Status & Alerts */}
            <div className="wide-card">
              <div className="card-header">
                <span className="font-bold text-slate-800">التنبيهات الإدارية العاجلة</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>

              <div className="p-3 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 space-y-0.5">
                  <div className="font-bold text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>سداد أقساط معلقة</span>
                  </div>
                  <p className="text-[10.5px] text-amber-800">
                    هناك 4 طلاب تجاوزت ذممهم موعد الاستحقاق بأكثر من 15 يوماً.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 space-y-0.5">
                  <div className="font-bold text-[11px] flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>اعتماد درجات الاختبار النصفي</span>
                  </div>
                  <p className="text-[10.5px] text-blue-800">
                    تم رصد 95% من نتائج الاختبارات الشهرية بانتظار الاعتماد النهائي.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 space-y-0.5">
                  <div className="font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>اكتمال رحلات الحافلات الصباحية</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-800">
                    جميع الحافلات وصلت إلى حرم المدرسة بسلام وفي المواعيد المحددة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PORTALS CONTROL & PERMISSIONS MATRIX */}
      {activeTab === "portals_control" && (
        <div className="wide-card">
          <div className="card-header">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Sliders className="w-4 h-4 text-slate-900" />
              <span>مصفوفة الصلاحيات والبوابات الخمس المستقلة</span>
            </div>
            <span className="text-[11px] text-slate-500">تم تكوينها حسب متطلبات النظام</span>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>البوابة والمستخدم</th>
                  <th>صلاحية الوصول</th>
                  <th>الميزات المتاحة</th>
                  <th>الحالة</th>
                  <th>التبديل الفوري</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">
                        👑
                      </div>
                      <div>
                        <div>1. بوابة المدير العام (Super Admin)</div>
                        <div className="text-[10px] text-slate-400">الإدارة العليا والإشراف</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill bg-success text-[10px]">كاملة (Full Access)</span>
                  </td>
                  <td className="text-xs text-slate-600">
                    جميع الوحدات، إعدادات النظام، التقارير المالية والإدارية، اعتماد القرارات
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">نشطة 🟢</span>
                  </td>
                  <td>
                    <button
                      onClick={() => switchUserRole("super_admin")}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded font-bold"
                    >
                      البوابة الحالية
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                        👨‍🏫
                      </div>
                      <div>
                        <div>2. بوابة المعلم (Teacher Portal)</div>
                        <div className="text-[10px] text-slate-400">الكادر الأكاديمي</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">أكاديمية وسلوكية</span>
                  </td>
                  <td className="text-xs text-slate-600">
                    مشاهدة أسماء الطلاب، رصد الغياب والحضور، إدخال الدرجات، تسجيل الملاحظات السلوكية، والواجبات
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">نشطة 🟢</span>
                  </td>
                  <td>
                    <button
                      onClick={() => switchUserRole("teacher")}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded font-bold"
                    >
                      تجربة كمعلم
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
                        💼
                      </div>
                      <div>
                        <div>3. بوابة المحاسب المالي (Accountant)</div>
                        <div className="text-[10px] text-slate-400">الإدارة المالية</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill bg-warning text-[10px]">مالية ومحاسبية</span>
                  </td>
                  <td className="text-xs text-slate-600">
                    متابعة الأقساط، إصدار سندات القبض الإلكترونية، متابعة الذمم، إرسال مطالبات السداد، الخصومات
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">نشطة 🟢</span>
                  </td>
                  <td>
                    <button
                      onClick={() => switchUserRole("accountant")}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold"
                    >
                      تجربة كمحاسب
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">
                        👨‍👩‍👧
                      </div>
                      <div>
                        <div>4. بوابة ولي الأمر (Parent Portal)</div>
                        <div className="text-[10px] text-slate-400">أولياء الأمور</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">متابعة خاصة بالطالب</span>
                  </td>
                  <td className="text-xs text-slate-600">
                    متابعة مستوى الابن، الدرجات، الحضور، تتبع باص المدرسة GPS، سداد الرسوم، إرسال ملاحظات للإدارة
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">نشطة 🟢</span>
                  </td>
                  <td>
                    <button
                      onClick={() => switchUserRole("parent")}
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded font-bold"
                    >
                      تجربة كولي أمر
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs">
                        🚌
                      </div>
                      <div>
                        <div>5. بوابة مشرف الحافلات (Bus Supervisor)</div>
                        <div className="text-[10px] text-slate-400">النقل المدرسي</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">النقل والمسارات</span>
                  </td>
                  <td className="text-xs text-slate-600">
                    متابعة خطوط السير، صعود ونزول الطلاب لحظياً، رادار GPS، التواصل مع أولياء الأمور وتنبيهات الطوارئ
                  </td>
                  <td>
                    <span className="status-pill bg-info text-[10px]">نشطة 🟢</span>
                  </td>
                  <td>
                    <button
                      onClick={() => switchUserRole("bus_supervisor")}
                      className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded font-bold"
                    >
                      تجربة كمشرف باص
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVALS */}
      {activeTab === "approvals" && (
        <div className="wide-card">
          <div className="card-header">
            <span className="font-bold text-slate-800">طلبات الاعتماد المرفوعة للمدير العام</span>
            <span className="text-[11px] text-slate-500">3 طلبات بانتظار الموافقة</span>
          </div>

          <div className="p-3 space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-slate-900">طلب خصم استثنائي (خصم التفوق الأكاديمي 15%)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  الطالب: يوسف عمر عبد الرحيم • مقدم الطلب: المحاسب المالي • التاريخ: 2026-02-28
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("تم اعتماد الخصم بنجاح.")}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                >
                  اعتماد ✓
                </button>
                <button
                  onClick={() => alert("تم رفض الطلب وإعادته للمحاسب.")}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold"
                >
                  رفض
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-slate-900">طلب تعديل مسار الحافلة #104 (إضافة نقطة توقف جديدة)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  مقدم الطلب: مشرف الحافلات (سالم المري) • المسار: حي الروضة
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("تمت الموافقة وتحديث مسار الحافلة.")}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                >
                  اعتماد ✓
                </button>
                <button
                  onClick={() => alert("تم رفض الطلب.")}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold"
                >
                  رفض
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit_logs" && (
        <div className="wide-card">
          <div className="card-header">
            <span className="font-bold text-slate-800">سجل العمليات والرقابة الأمنية (Audit Logs)</span>
            <span className="text-[11px] text-slate-500">توثيق العمليات بالوقت والمستخدم</span>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { user: "المحاسب المالي (خالد المنصور)", action: "إصدار سند قبض رقم REC-994411 بمبلغ 12,000 ر.س", time: "منذ 15 دقيقة", tag: "مالية" },
              { user: "المعلمة (فاطمة الشامي)", action: "رصد درجات الاختبار النصفي لمادة لغتي الجميلة", time: "منذ ساعة", tag: "أكاديمية" },
              { user: "مشرف الحافلات (سالم المري)", action: "تأكيد صعود 18 طالباً في الرحلة الصباحية لحافلة #104", time: "منذ ساعتين", tag: "نقل" },
              { user: "ولي الأمر (عمر عبد الرحيم)", action: "إرسال استفسار بخصوص مشروع العلوم", time: "منذ 3 ساعات", tag: "رسائل" },
            ].map((log, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50/50 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{log.action}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">بواسطة: {log.user} • {log.time}</div>
                </div>
                <span className="status-pill bg-info text-[10px]">{log.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
