import React from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  ShieldAlert,
  GraduationCap,
  Users,
  Bus,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Navigation,
  School,
} from "lucide-react";

export const PortalsGatewayHub: React.FC = () => {
  const {
    setActiveModule,
    switchUserRole,
    students,
    staff,
    busRoutes,
    openSmartLinksModal,
  } = useSchool();

  const handleEnterPortal = (
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

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-3 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Grand Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-sky-300 text-xs font-bold border border-slate-700 shadow-xs">
          <School className="w-3.5 h-3.5 text-sky-400" />
          <span>منظومة بوابات مدرسة إتقان الأهلية</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          بوابات الدخول الأربعة المستقلة
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          اختر بوابتك المخصصة للدخول؛ يتم فور الدخول عزل البوابة بالكامل وتقديم واجهة عمل خاصة بصلاحياتك ودورك المعتمد.
        </p>
      </div>

      {/* The 4 Distinct Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* 1. المدير العام */}
        <div
          onClick={() => handleEnterPortal("super_admin")}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                👑
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                صلاحيات كاملة وشاملة
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-2">
                <span>1. بوابة المدير العام (إدارة المدرسة)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                لوحة القيادة العليا والتحكم المركزي بجميع بوابات وأقسام المدرسة: إضافة المعلمين وتوكيلهم بصفوف ومواد محددة، إضافة الطلاب، إضافة السائقين، وإصدار الروابط وأرقام الدخول المباشرة.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">إدارة الكادر والتوكيل</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">المناهج المفتوحة</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">الرقابة المالية والتقارير</span>
            </div>
          </div>

          <div className="relative pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
            <span>دخول لوحة القيادة العليا للمدير</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 2. ولي الأمر */}
        <div
          onClick={() => handleEnterPortal("parent")}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-purple-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />

          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                👨‍👩‍👧
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                برقم الطالب أو الرابط الذكي
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors flex items-center gap-2">
                <span>2. بوابة ولي الأمر</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                متابعة شاملة ومباشرة لكل ما يرسله المعلم أو إدارة المدرسة: الدرجات والاختبارات، الحضور والغياب اليومي، بطاقات التقييم والملاحظات السلوكية، وسداد الرسوم وتتبع حافلة المدرسة بالـ GPS.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">سجل الدرجات الفوري</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">تتبع باص المدرسة GPS</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">الملاحظات والواجبات</span>
            </div>
          </div>

          <div className="relative pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-800">
            <span>دخول بوابة ولي الأمر ومتابعة الطالب</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 3. المعلم */}
        <div
          onClick={() => handleEnterPortal("teacher")}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                👨‍🏫
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                برقم المعلم / الصفوف الموكلة
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                <span>3. بوابة المعلم</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                يفتح المعلم بوابته برقم سري مخصص يحدده وينشئه المدير؛ يرى المعلم حصراً كشوف وأسماء طلاب الصفوف والمواد الموكل بتدريسها مع إمكانية رصد الدرجات وتسجيل الغياب والملاحظات السلوكية والواجبات.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">الصفوف الموكلة فقط</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">رصد الدرجات والتقييمات</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">كشف الغياب اليومي</span>
            </div>
          </div>

          <div className="relative pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
            <span>دخول بوابة المعلم واستعراض الصفوف</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 4. السائق */}
        <div
          onClick={() => handleEnterPortal("driver")}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />

          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                🚌
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                تحديد آلي للموقع ومسار الطلاب
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-2">
                <span>4. بوابة السائق (النقل المدرسي)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                تحديد موقع الحافلة الجغرافي آلياً عبر نظام GPS Live Telemetry، مع استعراض كشف وعناوين ومواقع منازل الطلاب الموكل بنقلهم على الخريطة، وتسجيل صعودهم ونزولهم وإرسال تنبيهات فورية.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">تتبع آلي لحظي GPS</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">مواقع وعناوين الطلاب</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">إشعارات صعود ونزول</span>
            </div>
          </div>

          <div className="relative pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
            <span>دخول كابينة السائق وبدء الرحلة</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links dispatch shortcut for administrator */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <div className="flex items-center gap-2 justify-center sm:justify-start font-bold text-sm text-white">
            <LinkIcon className="w-4 h-4 text-sky-400" />
            <span>نظام إرسال وتوليد الروابط وأرقام الدخول المباشرة (واتساب)</span>
          </div>
          <p className="text-xs text-slate-400">
            يمكن لمدير المدرسة توليد ومشاركة الروابط المباشرة وأرقام الدخول الخاصة بأولياء الأمور والمعلمين بنقرة زر واحدة.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openSmartLinksModal()}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>مركز مشاركة الروابط وأرقام الدخول</span>
        </button>
      </div>
    </div>
  );
};
