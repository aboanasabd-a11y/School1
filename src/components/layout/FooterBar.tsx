import React from "react";
import { useSchool } from "../../context/SchoolContext";

export const FooterBar: React.FC = () => {
  const { schoolInfo } = useSchool();

  return (
    <footer className="bg-[#e2e8f0] text-slate-800 text-xs px-4 py-2 flex items-center justify-between border-t border-slate-300 shrink-0 select-none">
      {/* RIGHT SIDE (in RTL): Iraqi Flag and Motto */}
      <div className="flex items-center gap-2 font-bold text-slate-800">
        {/* Iraqi Flag representation matching image */}
        <div className="w-6 h-4 border border-slate-400 rounded-[2px] overflow-hidden flex flex-col shadow-2xs">
          <div className="h-1/3 bg-[#dc2626]" />
          <div className="h-1/3 bg-white flex items-center justify-center">
            <span className="text-[6px] font-black text-[#16a34a] leading-none">★</span>
          </div>
          <div className="h-1/3 bg-[#0f172a]" />
        </div>
        <span className="text-xs font-bold text-slate-900">
          {schoolInfo.motto || "بالعلم نبني المستقبل"}
        </span>
      </div>

      {/* LEFT SIDE (in RTL): Location / Ministry / Directorate */}
      <div className="flex items-center gap-2 text-slate-600 text-[11px] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-600 inline-block" />
        <span>{schoolInfo.location || "وزارة التربية - بغداد"}</span>
      </div>
    </footer>
  );
};
