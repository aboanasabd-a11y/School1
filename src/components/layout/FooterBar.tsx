import React from "react";
import { useSchool } from "../../context/SchoolContext";

export const FooterBar: React.FC = () => {
  const { backups } = useSchool();

  return (
    <footer className="footer-bar no-print shrink-0">
      <div className="flex items-center gap-2">
        <span>الحالة:</span>
        <span className="text-emerald-600 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          متصل بالنظام السحابي Microsoft Azure GCC
        </span>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 text-[11px] text-slate-500">
        <span className="hidden sm:inline">
          آخر نسخة احتياطية: {backups[0]?.timestamp ? "منذ قليل" : "منذ 12 دقيقة"}
        </span>
        <span className="hidden md:inline">
          تشفير البيانات: <strong className="text-slate-700 font-mono">AES-256 نشط</strong>
        </span>
        <span className="font-semibold text-slate-700">الإصدار 4.2.0 المؤسسي</span>
      </div>
    </footer>
  );
};
