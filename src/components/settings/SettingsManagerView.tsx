import React, { useState, useRef } from "react";
import { useSchool } from "../../context/SchoolContext";
import { UserRole, SystemBackup } from "../../types";
import {
  Settings,
  Shield,
  CheckCircle,
  Cloud,
  Database,
  Download,
  Upload,
  RefreshCw,
  Key,
  Lock,
  Building2,
  Save,
  Check,
  AlertTriangle,
  Code2,
  Image,
  Globe,
  Bell,
  Volume2,
  VolumeX,
  FileCheck,
  HardDrive,
  Trash2,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const SettingsManagerView: React.FC = () => {
  const {
    currentUser,
    userProfiles,
    switchRole,
    backups,
    schoolInfo,
    updateSchoolInfo,
    createEncryptedBackup,
    exportDatabaseJson,
    importDatabaseJson,
    restoreFromBackup,
    deleteBackup,
    resetToDefaultData,
    notificationSettings,
    updateNotificationSettings,
    requestPushPermission,
    triggerPushNotification,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<
    "school_info" | "users_rbac" | "developer_brand" | "push_notifications" | "security_cloud"
  >("school_info");

  // School general settings synced directly with context
  const [schoolSettings, setSchoolSettings] = useState({ ...schoolInfo });
  const [saveAlert, setSaveAlert] = useState(false);

  // Backup & Restore states
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<SystemBackup["cloudProvider"]>(
    "Microsoft Azure Cloud (Blob Storage)"
  );
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSchoolInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(schoolSettings);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  const handleCloudSync = () => {
    setIsSyncingCloud(true);
    setSyncStatus(null);
    createEncryptedBackup(selectedCloudProvider);
    setTimeout(() => {
      setIsSyncingCloud(false);
      setSyncStatus(`تم تصدير وتأمين النسخة بنجاح على ${selectedCloudProvider}!`);
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
    triggerPushNotification({
      title: "تم تصدير نسخة قاعدة البيانات",
      body: "تم إنشاء وتنزيل ملف JSON يحتوي على سجلات المدرسة بالكامل.",
      type: "system",
      priority: "normal",
    });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importDatabaseJson(content);
        if (success) {
          setImportStatus({
            success: true,
            message: `تم استيراد قاعدة البيانات بنجاح من الملف (${file.name})!`,
          });
        } else {
          setImportStatus({
            success: false,
            message: "فشل استيراد الملف: تنسيق JSON غير مطابق لقالب قاعدة بيانات المدرسة.",
          });
        }
      } catch (err) {
        setImportStatus({
          success: false,
          message: "حدث خطأ أثناء قراءة الملف. تأكد من صحة الملف وصيغة JSON.",
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRestoreClick = (backupId: string) => {
    const success = restoreFromBackup(backupId);
    if (success) {
      setRestoreConfirmId(null);
      setSyncStatus("تمت استعادة نقطة النسخ بنجاح وتحديث كافة البيانات!");
    }
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
      modules: ["الرئيسية", "الصفوف والشعب", "الطلاب", "الكادر التعليمي", "الامتحانات", "التقارير"],
    },
    {
      role: "teacher" as UserRole,
      title: "معلم / كادر تعليمي",
      description: "رصد درجات المقررات المكلف بها، تسجيل الحضور اليومي، إرسال الواجبات والتواصل مع أولياء الأمور.",
      modules: ["الجدول الأسبوعي", "رصد الدرجات", "تحضير الحصص", "سجل السلوك", "الواجبات"],
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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0b3b60] text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              إعدادات المنظومة، هوية المدرسة والتنبيهات
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            تخصيص كامل لمعلومات المدرسة، التنبيهات الفورية (Push)، استيراد وتصدير قاعدة البيانات والنسخ الاحتياطي.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("school_info")}
            className={`px-3 py-1.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "school_info"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            معلومات المدرسة والشعار
          </button>
          <button
            onClick={() => setActiveTab("developer_brand")}
            className={`px-3 py-1.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "developer_brand"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            هوية المطور (Ahmedpc)
          </button>
          <button
            onClick={() => setActiveTab("push_notifications")}
            className={`px-3 py-1.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "push_notifications"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-sky-600" />
            <span>نظام إشعارات الدفع (Push)</span>
          </button>
          <button
            onClick={() => setActiveTab("users_rbac")}
            className={`px-3 py-1.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "users_rbac"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المستخدمين والصلاحيات
          </button>
          <button
            onClick={() => setActiveTab("security_cloud")}
            className={`px-3 py-1.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "security_cloud"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>النسخ الاحتياطي والبيانات</span>
          </button>
        </div>
      </div>

      {saveAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ التعديلات وتحديثها بنجاح عبر كامل التطبيق والهيدر والفوتر!</span>
        </div>
      )}

      {/* TAB 1: School Official Info & Logo */}
      {activeTab === "school_info" && (
        <form onSubmit={handleSaveSchoolInfo} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>بيانات المدرسة والشعار والموقع</span>
            </h3>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ البيانات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المدرسة الرسمي</label>
              <input
                type="text"
                required
                value={schoolSettings.schoolName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">المديرية العامة للتربية</label>
              <input
                type="text"
                required
                value={schoolSettings.directorate}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, directorate: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الوزارة والدولة</label>
              <input
                type="text"
                required
                value={schoolSettings.ministry}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, ministry: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الموقع الجغرافي / المدينة</label>
              <input
                type="text"
                value={schoolSettings.location}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, location: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم مدير المدرسة</label>
              <input
                type="text"
                value={schoolSettings.principalName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, principalName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">هاتف المدرسة</label>
              <input
                type="text"
                value={schoolSettings.phone}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={schoolSettings.email}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رابط الشعار المخصص (Logo URL)</label>
              <input
                type="url"
                placeholder="اتركه فارغاً لاعتماد شعار النسر وشعار المدرسة التلقائي"
                value={schoolSettings.logoUrl || ""}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, logoUrl: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Developer Info & Social Links */}
      {activeTab === "developer_brand" && (
        <form onSubmit={handleSaveSchoolInfo} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-600" />
              <span>بيانات المطور وروابط منصات التواصل الاجتماعي (Ahmedpc)</span>
            </h3>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التعديلات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المطور الرسمي</label>
              <input
                type="text"
                required
                value={schoolSettings.developerName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, developerName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رابط موقع المطور</label>
              <input
                type="url"
                value={schoolSettings.developerUrl}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, developerUrl: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">منصات التواصل الاجتماعي (المعروضة بالفوتر والهيدر):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">يوتيوب YouTube:</span>
                <input
                  type="text"
                  value={schoolSettings.developerSocials?.youtube || ""}
                  onChange={(e) =>
                    setSchoolSettings({
                      ...schoolSettings,
                      developerSocials: {
                        ...schoolSettings.developerSocials,
                        youtube: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">فيسبوك Facebook:</span>
                <input
                  type="text"
                  value={schoolSettings.developerSocials?.facebook || ""}
                  onChange={(e) =>
                    setSchoolSettings({
                      ...schoolSettings,
                      developerSocials: {
                        ...schoolSettings.developerSocials,
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">تيليغرام Telegram:</span>
                <input
                  type="text"
                  value={schoolSettings.developerSocials?.telegram || ""}
                  onChange={(e) =>
                    setSchoolSettings({
                      ...schoolSettings,
                      developerSocials: {
                        ...schoolSettings.developerSocials,
                        telegram: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">تيك توك TikTok:</span>
                <input
                  type="text"
                  value={schoolSettings.developerSocials?.tiktok || ""}
                  onChange={(e) =>
                    setSchoolSettings({
                      ...schoolSettings,
                      developerSocials: {
                        ...schoolSettings.developerSocials,
                        tiktok: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Push Notifications Configuration */}
      {activeTab === "push_notifications" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-600" />
                  <span>إعدادات تنبيهات الدفع الفورية (Web Push Notifications)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  إرسال إشعارات صوتية ومرئية للمستخدمين فور استلام رسائل في بوابة التواصل أو رصد غياب وتأخر في الحضور.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await requestPushPermission();
                  }}
                  className="px-3 py-1.5 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>طلب إذن إشعارات المتصفح</span>
                </button>
              </div>
            </div>

            {/* Permission status card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">إذن متصفح النظام (OS Permission)</span>
                  <span className="text-[11px] text-slate-500">
                    {notificationSettings.browserPermission === "granted"
                      ? "مصرح به (ستظهر النوافذ المنبثقة من نظام التشغيل)"
                      : "غير مفعل أو بانتظار الإذن"}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    notificationSettings.browserPermission === "granted"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {notificationSettings.browserPermission === "granted" ? "مفعل ومصرح" : "غير مصرح"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">نغمات التنبيه الصوتية (Web Audio)</span>
                  <span className="text-[11px] text-slate-500">
                    تشغيل رنة مميزة لكل نوع إشعار (رسالة، غياب، تنبيه)
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateNotificationSettings({ soundEnabled: !notificationSettings.soundEnabled })
                  }
                  className={`p-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    notificationSettings.soundEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {notificationSettings.soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>صوت مفعل</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>صامت</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notification triggers toggle list */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-900 text-xs">أحداث تنبيهات الدفع التلقائية:</h4>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      رسائل جديدة في بوابة التواصل والمراسلات
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إرسال إشعار فوري عند ورود رسالة أو رد من معلم أو ولي أمر أو إدارة المدرسة
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.notifyOnMessages}
                    onChange={(e) =>
                      updateNotificationSettings({ notifyOnMessages: e.target.checked })
                    }
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      تنبيهات الغياب والتأخر في الحضور اليومي
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إرسال إشعار عاجل فور رصد غياب الطالب أو تأخره الصباحي لإخطار الإدارة والولي
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.notifyOnAttendanceAlerts}
                    onChange={(e) =>
                      updateNotificationSettings({ notifyOnAttendanceAlerts: e.target.checked })
                    }
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      التعاميم المدرسية والإعلانات الرسمية
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إرسال إشعار عند نشر إعلان رسمي أو تعميم وزاري جديد
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.notifyOnAnnouncements}
                    onChange={(e) =>
                      updateNotificationSettings({ notifyOnAnnouncements: e.target.checked })
                    }
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      تنبيهات وصول الحافلة والموقع الحي
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إرسال إشعار باقتراب باص المدرسة من المحطة المحددة
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.notifyOnBusArrivals}
                    onChange={(e) =>
                      updateNotificationSettings({ notifyOnBusArrivals: e.target.checked })
                    }
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Test push trigger button */}
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-sky-950 block text-xs">اختبار محاكاة التنبيهات الفورية</span>
                <span className="text-[11px] text-sky-800">
                  يمكنك النقر للتأكد من عمل الصوت والنوافذ المنبثقة اللحظية.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerPushNotification({
                      title: "اختبار إشعار رسالة واردة",
                      body: "هذا إشعار تجريبي يوضح كيفية ظهور رسائل أولياء الأمور والمعلمين مع النغمة الصوتية.",
                      type: "message",
                      priority: "important",
                    });
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  تجربة إشعار رسالة
                </button>
                <button
                  onClick={() => {
                    triggerPushNotification({
                      title: "اختبار إشعار غياب طالب",
                      body: "تنبيه عاجل: تم رصد غياب تجريبي للتحقق من وصول إشعارات الحضور لولي الأمر والإدارة.",
                      type: "attendance",
                      priority: "urgent",
                    });
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  تجربة إشعار غياب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Users & RBAC */}
      {activeTab === "users_rbac" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">سجل حسابات المستخدمين المسجلة بالنظام</h3>
              <span className="text-[11px] text-slate-500">{userProfiles.length} مستخدم نشط</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">المستخدم</th>
                    <th className="p-2.5">اسم الدخول / البريد</th>
                    <th className="p-2.5">الدور الوظيفي</th>
                    <th className="p-2.5">حالة الحساب</th>
                    <th className="p-2.5 text-center">التبديل للمنظور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {userProfiles.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold flex items-center gap-2">
                        <img src={user.avatar} className="w-7 h-7 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="text-slate-900">{user.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{user.username}</div>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">{user.email}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> نشط
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => switchRole(user.role)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            currentUser.id === user.id
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200"
                          }`}
                        >
                          {currentUser.id === user.id ? "الحالي" : "تبديل المنظور"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Backup and Data Import/Export */}
      {activeTab === "security_cloud" && (
        <div className="space-y-4">
          {/* Export & Import Action Center */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>تصدير واستيراد قاعدة بيانات المدرسة والنسخ الاحتياطي</span>
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  حفظ نسخة شاملة من بيانات الطلاب، المعلمين، الدرجات، الحضور، الإعلانات والحسابات واستعادتها بأي وقت.
                </p>
              </div>

              {/* Cloud Provider selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">مزود النسخ السحابي:</span>
                <select
                  value={selectedCloudProvider}
                  onChange={(e) =>
                    setSelectedCloudProvider(e.target.value as SystemBackup["cloudProvider"])
                  }
                  className="p-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-bold"
                >
                  <option value="Microsoft Azure Cloud (Blob Storage)">Microsoft Azure Blob Storage</option>
                  <option value="Google Cloud Storage (GCS)">Google Cloud Storage (GCS)</option>
                  <option value="Amazon Web Services (AWS S3)">Amazon Web Services (AWS S3)</option>
                  <option value="Local Encrypted Vault">مخزن محلي مشفر (Local Vault)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export Panel */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-xs">تصدير قاعدة البيانات (Export JSON)</h4>
                    <span className="text-[11px] text-emerald-800">تنزيل ملف كامل بصيغة JSON إلى جهازك</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  يحتوي الملف على كافة السجلات الحالية بالمدرسة ويمكن حفظه في فلاشة أو أرشيف المدرسة للرجوع إليه عند الحاجة.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleExport}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل نسخة JSON الآن</span>
                  </button>

                  <button
                    onClick={handleCloudSync}
                    disabled={isSyncingCloud}
                    className="px-3.5 py-2 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{isSyncingCloud ? "جاري الحفظ المشفر..." : "حفظ لقطة سحابية مشفرة"}</span>
                  </button>
                </div>
              </div>

              {/* Import Panel */}
              <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-950 text-xs">استيراد قاعدة البيانات (Import JSON)</h4>
                    <span className="text-[11px] text-sky-800">استعادة البيانات من ملف تم تصديره مسبقاً</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  اختر ملف نسخة سابقة بتنسيق JSON ليتم دمجها وتحديث السجلات والدرجات والبيانات بالكامل فوراً.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json,application/json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>اختيار ملف JSON للاستيراد</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("هل أنت متأكد من رغبتك في استعادة البيانات النموذجية الافتراضية؟")) {
                        resetToDefaultData();
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط المصنع</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Status alerts */}
            {syncStatus && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{syncStatus}</span>
                </div>
                <button
                  onClick={() => setSyncStatus(null)}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  ✕
                </button>
              </div>
            )}

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between ${
                  importStatus.success
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {importStatus.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
                <button
                  onClick={() => setImportStatus(null)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Historical Backups Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-sky-700" />
                  <span>سجل نقاط النسخ الاحتياطي المشفرة (Snapshots Vault)</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  كافة النقاط المحفوظة مشفرة بمعيار AES-256 مع فحص تجزئة SHA-256
                </span>
              </div>
              <span className="text-xs font-bold text-sky-800">{backups.length} نقاط محفوظة</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">اسم النسخة الاحتياطية</th>
                    <th className="p-2.5">تاريخ الإنشاء</th>
                    <th className="p-2.5">المزود السحابي</th>
                    <th className="p-2.5">الحجم / السجلات</th>
                    <th className="p-2.5">التشفير والتحقق</th>
                    <th className="p-2.5 text-center">إجراءات الاستعادة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {backups.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-mono text-slate-900">{bk.filename}</span>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">{bk.timestamp}</td>
                      <td className="p-2.5">
                        <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {bk.cloudProvider}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-700">{bk.size}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {bk.recordsCount} سجل
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <Lock className="w-3 h-3" />
                          <span>AES-256</span>
                        </div>
                        <span className="font-mono text-[9px] text-slate-400 block truncate max-w-[120px]">
                          {bk.checksum}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {bk.dataPayload ? (
                            restoreConfirmId === bk.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleRestoreClick(bk.id)}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  تأكيد الاستعادة
                                </button>
                                <button
                                  onClick={() => setRestoreConfirmId(null)}
                                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setRestoreConfirmId(bk.id)}
                                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded font-bold border border-sky-200 cursor-pointer text-[11px]"
                              >
                                استعادة
                              </button>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400">أرشيف سحابي</span>
                          )}

                          <button
                            onClick={() => deleteBackup(bk.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="حذف النسخة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
