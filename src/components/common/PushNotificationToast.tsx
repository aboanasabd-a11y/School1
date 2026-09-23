import React, { useState, useEffect } from "react";
import { useSchool } from "../../context/SchoolContext";
import { PushNotificationItem } from "../../types";
import {
  Bell,
  MessageSquare,
  AlertTriangle,
  Megaphone,
  Bus,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  Settings,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export const PushNotificationToast: React.FC = () => {
  const {
    pushNotifications,
    markPushAsRead,
    clearPushNotification,
    setActiveModule,
    notificationSettings,
    updateNotificationSettings,
  } = useSchool();

  // Floating banner for the most recent unread push notification
  const [activeToast, setActiveToast] = useState<PushNotificationItem | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // When a new push arrives, show toast for 6 seconds
  useEffect(() => {
    if (pushNotifications.length > 0) {
      const latest = pushNotifications[0];
      if (!latest.isRead) {
        setActiveToast(latest);
        setIsDismissed(false);

        const timer = setTimeout(() => {
          setIsDismissed(true);
        }, 6500);

        return () => clearTimeout(timer);
      }
    }
  }, [pushNotifications]);

  if (!activeToast || isDismissed) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case "attendance":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "announcement":
        return <Megaphone className="w-5 h-5 text-emerald-400" />;
      case "bus":
        return <Bus className="w-5 h-5 text-cyan-400" />;
      case "system":
        return <CheckCircle className="w-5 h-5 text-indigo-400" />;
      default:
        return <Bell className="w-5 h-5 text-sky-400" />;
    }
  };

  const handleClickToast = () => {
    markPushAsRead(activeToast.id);
    if (activeToast.actionModule) {
      setActiveModule(activeToast.actionModule);
    }
    setIsDismissed(true);
  };

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-50 max-w-sm sm:max-w-md w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3.5 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Type Icon Badge */}
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClickToast}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {activeToast.type === "message"
                ? "بوابة التواصل"
                : activeToast.type === "attendance"
                ? "تنبيه الحضور والغياب"
                : activeToast.type === "announcement"
                ? "إعلان وزاري"
                : "تنبيه نظام"}
            </span>
            <span className="text-[10.5px] text-slate-400">{activeToast.timestamp}</span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-1">
            {activeToast.title}
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
            {activeToast.body}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-sky-400 hover:text-sky-300">
            <span>انقر للانتقال والمعاينة</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsDismissed(true);
            markPushAsRead(activeToast.id);
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
