import React from "react";
import { useSchool } from "../../context/SchoolContext";
import { GraduationCap } from "lucide-react";

export const FooterBar: React.FC = () => {
  const { schoolInfo } = useSchool();

  return (
    <footer className="bg-[#e2e8f0] text-slate-800 text-xs px-4 py-2 flex items-center justify-between border-t border-slate-300 shrink-0 select-none">
      {/* RIGHT SIDE (in RTL): School Logo/Badge and Motto */}
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        {schoolInfo.logoUrl ? (
          <img
            src={schoolInfo.logoUrl}
            alt={schoolInfo.schoolName || "شعار المدرسة"}
            className="w-5 h-5 object-contain rounded-xs shadow-2xs bg-white"
          />
        ) : (
          <div className="w-5 h-5 rounded-xs bg-[#0b3b60] text-white flex items-center justify-center shadow-2xs">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <span className="text-xs font-bold text-slate-900">
          {schoolInfo.motto || "بالعلم والمعرفة نبني المستقبل"}
        </span>
      </div>

      {/* LEFT SIDE (in RTL): Location / Ministry / Directorate */}
      <div className="flex items-center gap-2 text-slate-600 text-[11px] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-600 inline-block" />
        <span>{schoolInfo.location || schoolInfo.ministry || "نظام الإدارة المدرسية المتكامل"}</span>
      </div>
    </footer>
  );
};
