import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Bell,
  MessageSquare,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  Volume2,
  VolumeX,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";

interface PushNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationCenter: React.FC<PushNotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    pushNotifications,
    unreadPushCount,
    markPushAsRead,
    markAllPushAsRead,
    clearPushNotification,
    clearAllPushNotifications,
    setActiveModule,
    notificationSettings,
    updateNotificationSettings,
    requestPushPermission,
    triggerPushNotification,
    currentUser,
  } = useSchool();

  const [filterType, setFilterType] = useState<string>("all");
  const [testMsgContent, setTestMsgContent] = useState("");
  const [showTestPanel, setShowTestPanel] = useState(false);

  if (!isOpen) return null;

  const filteredNotifications = pushNotifications.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "unread") return !n.isRead;
    return n.type === filterType;
  });

  const handleEnableWebPush = async () => {
    const perm = await requestPushPermission();
    if (perm === "granted") {
      triggerPushNotification({
        title: "تم تفعيل إشعارات الدفع (Push) بنجاح!",
        body: "ستتلقى الآن التنبيهات الفورية حتى عند تشغيل المتصفح في الخلفية.",
        type: "system",
        priority: "normal",
      });
    }
  };

  const handleSimulateMessageAlert = () => {
    triggerPushNotification({
      title: "رسالة جديدة في بوابة التواصل",
      body: `أ. هشام أحمد التميمي (المحاسب): "يرجى اعتماد إيصالات تسديد الأقساط للفصل الثاني."`,
      type: "message",
      priority: "important",
      senderName: "أ. هشام أحمد التميمي",
      actionModule: "communication",
    });
  };

  const handleSimulateAttendanceAlert = () => {
    triggerPushNotification({
      title: "تنبيه غياب طالب في الحضور اليومي",
      body: "تم رصد غياب الطالب حيدر مصطفى جواد عن الدوام لليوم الثاني على التوالي.",
      type: "attendance",
      priority: "urgent",
      senderName: "نظام الغياب والحضور",
      actionModule: "attendance",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] mt-12 sm:mt-14"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 bg-[#0b3b60] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center relative">
              <Bell className="w-4 h-4 text-white" />
              {unreadPushCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadPushCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm">مركز تنبيهات الدفع (Push)</h3>
              <p className="text-[11px] text-sky-200">
                {unreadPushCount > 0 ? `${unreadPushCount} تنبيهات غير مقروءة` : "كافة التنبيهات مقروءة"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                updateNotificationSettings({ soundEnabled: !notificationSettings.soundEnabled })
              }
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title={notificationSettings.soundEnabled ? "كتم الصوت" : "تشغيل نغمات التنبيه"}
            >
              {notificationSettings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-300" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="إغلاق النافذة"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Web Push Browser Permission Banner */}
        {notificationSettings.browserPermission !== "granted" && (
          <div className="p-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-sky-900">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>تفعيل إشعارات المتصفح الفورية في نظام التشغيل</span>
            </div>
            <button
              onClick={handleEnableWebPush}
              className="px-2.5 py-1 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-md font-bold text-[11px] cursor-pointer whitespace-nowrap"
            >
              السماح بالإشعارات
            </button>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-white text-sky-800 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الكل ({pushNotifications.length})
          </button>
          <button
            onClick={() => setFilterType("unread")}
            className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === "unread"
                ? "bg-white text-sky-800 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            غير مقروء ({unreadPushCount})
          </button>
          <button
            onClick={() => setFilterType("message")}
            className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === "message"
                ? "bg-white text-sky-800 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الرسائل
          </button>
          <button
            onClick={() => setFilterType("attendance")}
            className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === "attendance"
                ? "bg-white text-sky-800 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الغياب والحضور
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={markAllPushAsRead}
              className="text-sky-700 hover:text-sky-900 font-bold hover:underline cursor-pointer"
            >
              تحديد الكل كمقروء
            </button>
            <span>•</span>
            <button
              onClick={clearAllPushNotifications}
              className="text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
            >
              مسح الكل
            </button>
          </div>
          <button
            onClick={() => setShowTestPanel(!showTestPanel)}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>تجربة التنبيه</span>
          </button>
        </div>

        {/* Simulator Panel */}
        {showTestPanel && (
          <div className="p-3 bg-indigo-50/60 border-b border-indigo-100 text-xs space-y-2">
            <span className="font-bold text-indigo-900 block text-[11px]">
              محاكاة إشعارات الدفع (Push Simulation):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateMessageAlert}
                className="p-2 bg-white hover:bg-slate-50 border border-indigo-200 rounded-lg text-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>إشعار رسالة جديدة</span>
              </button>
              <button
                onClick={handleSimulateAttendanceAlert}
                className="p-2 bg-white hover:bg-slate-50 border border-indigo-200 rounded-lg text-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>إشعار غياب طالب</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold text-slate-500">لا توجد إشعارات مطابقة</p>
              <p className="text-[11px] text-slate-400 mt-1">
                ستظهر التنبيهات الفورية هنا فور ورود رسالة جديدة أو رصد غياب
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUrgent = notif.priority === "urgent";
              const isImportant = notif.priority === "important";

              return (
                <div
                  key={notif.id}
                  className={`p-3 transition-colors flex items-start gap-3 text-xs ${
                    notif.isRead ? "bg-white hover:bg-slate-50" : "bg-sky-50/50 hover:bg-sky-50"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.type === "message"
                        ? "bg-sky-100 text-sky-700"
                        : notif.type === "attendance"
                        ? "bg-amber-100 text-amber-700"
                        : notif.type === "announcement"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {notif.type === "message" ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : notif.type === "attendance" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : notif.type === "announcement" ? (
                      <Megaphone className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                        )}
                        {isUrgent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                            عاجل
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>

                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                      {notif.body}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 text-[10.5px]">
                      <button
                        onClick={() => {
                          markPushAsRead(notif.id);
                          if (notif.actionModule) {
                            setActiveModule(notif.actionModule);
                            onClose();
                          }
                        }}
                        className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>فتح القسم المعني</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <button
                            onClick={() => markPushAsRead(notif.id)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            تحديد كمقروء
                          </button>
                        )}
                        <button
                          onClick={() => clearPushNotification(notif.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Settings Row */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <span>حالة صوت التنبيه:</span>
            <span
              className={`font-bold ${
                notificationSettings.soundEnabled ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              {notificationSettings.soundEnabled ? "مفعل (Web Audio)" : "معطل"}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveModule("settings");
              onClose();
            }}
            className="text-[11px] font-bold text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>إعدادات الإشعارات والنسخ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
