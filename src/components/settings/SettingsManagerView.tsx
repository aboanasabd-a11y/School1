import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { UserAccount, UserRole } from "../../types";
import {
  Settings,
  Shield,
  Users,
  Database,
  Cloud,
  Lock,
  Key,
  CheckCircle,
  Plus,
  RefreshCw,
  Building,
  Save,
  X,
  FileCode,
} from "lucide-react";

export const SettingsManagerView: React.FC = () => {
  const {
    userProfiles,
    currentUser,
    switchRole,
    backups,
    createEncryptedBackup,
    exportDatabaseJson,
    importDatabaseJson,
    resetToDefaultData,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<"users_rbac" | "school_info" | "security_cloud">("users_rbac");

  // School general settings
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: "مدارس رواد الغد الأهلية النموذجية",
    licenseNumber: "MOE-SA-884920",
    principalName: "د. عبد الرحمن بن فهد السليمان",
    contactEmail: "info@rowad-school.edu.sa",
    phone: "011-4567890",
    address: "الرياض - طريق الملك عبد العزيز - حي النخيل",
    currentAcademicYear: "2025/2026",
    currentSemester: "الفصل الدراسي الثاني",
  });

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleCloudSync = () => {
    setIsSyncingCloud(true);
    setSyncStatus(null);
    createEncryptedBackup();
    setTimeout(() => {
      setIsSyncingCloud(false);
      setSyncStatus("تمت المزامنة المشفرة وإنشاء نقطة استعادة سحابية بنجاح على Azure Blob Storage!");
    }, 1200);
  };

  const handleExport = () => {
    const json = exportDatabaseJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `School_Database_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const rbacRoles = [
    {
      role: "super_admin" as UserRole,
      title: "المدير العام / المسؤول التقني",
      description: "صلاحيات مطلقة لإدارة المنظومة، التحكم بالمستخدمين، النسخ الاحتياطي وإعدادات السحابة.",
      modules: ["كافة الشاشات", "إدارة النظام", "التقارير المتقدمة", "المالية", "قواعد البيانات"],
    },
    {
      role: "principal" as UserRole,
      title: "مدير / مديرة المدرسة",
      description: "الإشراف الأكاديمي الشامل، متابعة الكادر والطلاب، اعتماد الخطط والجداول والنتائج.",
      modules: ["لوحة التحكم", "الصفوف والشعب", "الطلاب", "الكادر التعليمي", "الامتحانات", "التقارير"],
    },
    {
      role: "teacher" as UserRole,
      title: "معلم / كادر تعليمي",
      description: "رصد درجات المقررات المكلف بها، تسجيل الحضور اليومي، إرسال الواجبات والتواصل مع أولياء الأمور.",
      modules: ["البرنامج الأسبوعي", "رصد الدرجات", "تحضير الحصص", "سجل السلوك", "الواجبات"],
    },
    {
      role: "accountant" as UserRole,
      title: "المحاسب المالي",
      description: "إصدار الرسوم، تسجيل المدفوعات وسندات القبض، متابعة الذمم والأقساط المتأخرة.",
      modules: ["الشؤون المالية", "سندات القبض", "تقارير الإيرادات", "الخصومات"],
    },
    {
      role: "bus_supervisor" as UserRole,
      title: "مشرف النقل والمواصلات",
      description: "متابعة مسارات الحافلات، التتبع الحي بنظام GPS، وحضور وصعود الطلاب في الباصات.",
      modules: ["إدارة الحافلات", "تتبع GPS الحي", "قوائم ركاب المسار"],
    },
    {
      role: "parent" as UserRole,
      title: "ولي أمر الطالب",
      description: "الاطلاع على الملف الدراسي والسلوكي للأبناء، متابعة الحافلة مباشرة وسداد الرسوم المدرسية.",
      modules: ["بطاقة الطالب", "الدرجات والشهادات", "موقع الباص المباشر", "الرسوم المدرسية"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              إدارة النظام، المستخدمين، والصلاحيات والأمان
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة حسابات المستخدمين وصلاحيات الأدوار (RBAC)، إعدادات المنشأة، والنسخ الاحتياطي السحابي المشفر.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("users_rbac")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "users_rbac"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المستخدمين والصلاحيات
          </button>
          <button
            onClick={() => setActiveTab("school_info")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "school_info"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            بيانات المنشأة
          </button>
          <button
            onClick={() => setActiveTab("security_cloud")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "security_cloud"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الأمان والسحابة المشفرة
          </button>
        </div>
      </div>

      {/* TAB 1: Users & RBAC */}
      {activeTab === "users_rbac" && (
        <div className="space-y-6">
          {/* User accounts list */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">سجل حسابات المستخدمين المسجلة بالنظام</h3>
              <span className="text-xs text-slate-500">{userProfiles.length} مستخدم نشط</span>
            </div>

            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">المستخدم</th>
                  <th className="p-3.5">اسم الدخول / البريد</th>
                  <th className="p-3.5">الدور الوظيفي</th>
                  <th className="p-3.5">الصلاحيات</th>
                  <th className="p-3.5">حالة الحساب</th>
                  <th className="p-3.5">تبديل المنظور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {userProfiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold flex items-center gap-2">
                      <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <div>
                        <div className="text-slate-900">{user.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.username}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{user.email}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 3).map((perm, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px]"
                          >
                            {perm}
                          </span>
                        ))}
                        {user.permissions.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{user.permissions.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> نشط ومفعل
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => switchRole(user.role)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentUser.id === user.id
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {currentUser.id === user.id ? "المستخدم الحالي" : "تجربة المنظور"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Permissions Matrix */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">مصفوفة الصلاحيات حسب الأدوار (RBAC Matrix)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rbacRoles.map((rp) => (
                <div key={rp.role} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{rp.title}</span>
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{rp.description}</div>
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
                    {rp.modules.map((mod) => (
                      <span key={mod} className="px-2 py-0.5 rounded bg-white text-indigo-700 border border-slate-200 text-[10px] font-bold">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: School Official Info */}
      {activeTab === "school_info" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2">بيانات المنشأة التعليمية والاعتماد الوزاري</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المدرسة الرسمي</label>
              <input
                type="text"
                value={schoolSettings.schoolName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الترخيص الوزاري</label>
              <input
                type="text"
                value={schoolSettings.licenseNumber}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, licenseNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">مدير / مديرة المدرسة</label>
              <input
                type="text"
                value={schoolSettings.principalName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, principalName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">هاتف التواصل المباشر</label>
              <input
                type="text"
                value={schoolSettings.phone}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">العنوان والموقع الجغرافي</label>
            <input
              type="text"
              value={schoolSettings.address}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => alert("تم حفظ الإعدادات المدرسية بنجاح!")}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ التعديلات
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Security & Cloud Infrastructure */}
      {activeTab === "security_cloud" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cloud className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-black">حالة المزامنة السحابية المشفرة (Azure Cloud GCC)</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                قاعدة البيانات متصلة وجاهزة للمزامنة المشفرة بمعيار AES-256 مع التوافق التام مع ضوابط الأمن السيبراني وحماية البيانات الشخصية.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCloudSync}
                disabled={isSyncingCloud}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-600/30"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? "animate-spin" : ""}`} />
                {isSyncingCloud ? "جارِ المزامنة المشفرة..." : "بدء المزامنة السحابية الآن"}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700"
              >
                <FileCode className="w-4 h-4 text-emerald-400" />
                تصدير نسخة JSON
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Backup snapshots list */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">سجل النسخ الاحتياطية السحابية المعتمدة</h3>
            <div className="space-y-2">
              {backups.map((bk) => (
                <div
                  key={bk.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{bk.filename}</div>
                      <div className="text-[10px] text-slate-500">
                        {bk.timestamp} • الحجم: {bk.size} • السحابة: {bk.cloudProvider}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                    مشفر ومحفوظ بنجاح
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
