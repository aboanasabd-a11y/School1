import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  GraduationCap,
  Plus,
  CheckCircle2,
  X,
  Sparkles,
  School,
  Layers,
  BookOpen,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Grade } from "../../types";

interface AddCustomGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomGradeModal: React.FC<AddCustomGradeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { grades, addGrade, addSection, addAuditLog } = useSchool();

  // Custom grade form
  const [gradeName, setGradeName] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [stage, setStage] = useState<Grade["stage"]>("middle");
  const [annualTuition, setAnnualTuition] = useState<number>(20000);
  const [sectionsCount, setSectionsCount] = useState<number>(2);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // The requested presets
  const requestedPresets = [
    {
      id: "preset-g7",
      name: "الصف السابع (الأول المتوسط / الإعدادي)",
      code: "G7",
      stage: "middle" as Grade["stage"],
      tuition: 19000,
      label: "السابع",
    },
    {
      id: "preset-g8",
      name: "الصف الثامن (الثاني المتوسط / الإعدادي)",
      code: "G8",
      stage: "middle" as Grade["stage"],
      tuition: 19500,
      label: "الثامن",
    },
    {
      id: "preset-g9",
      name: "الصف التاسع (الثالث المتوسط / شهادة الأساسي)",
      code: "G9",
      stage: "middle" as Grade["stage"],
      tuition: 20500,
      label: "التاسع",
    },
    {
      id: "preset-g10",
      name: "الصف العاشر (الأول الثانوي)",
      code: "G10",
      stage: "high" as Grade["stage"],
      tuition: 24000,
      label: "العاشر",
    },
    {
      id: "preset-g11",
      name: "الصف الحادي عشر (الثاني الثانوي)",
      code: "G11",
      stage: "high" as Grade["stage"],
      tuition: 25000,
      label: "الحادي عشر",
    },
    {
      id: "preset-g12",
      name: "الصف الثاني عشر (البكالوريا / الثانوية العامة)",
      code: "BAC",
      stage: "high" as Grade["stage"],
      tuition: 27000,
      label: "البكالوريا",
    },
  ];

  const handleAddPreset = (preset: typeof requestedPresets[0]) => {
    // Check if already exists by name or code
    const exists = grades.some(
      (g) =>
        g.name.includes(preset.label) ||
        g.code.toLowerCase() === preset.code.toLowerCase() ||
        g.name === preset.name
    );

    if (exists) {
      setSuccessMessage(`الصف (${preset.name}) موجود بالفعل في هيكل المدرسة!`);
      setTimeout(() => setSuccessMessage(null), 3500);
      return;
    }

    addGrade({
      name: preset.name,
      code: preset.code,
      stage: preset.stage,
      annualTuition: preset.tuition,
      sectionsCount: 2,
      studentsCount: 0,
      academicYearId: "year-2025-2026",
    });

    setSuccessMessage(`تمت إضافة وتفعيل (${preset.name}) مع إنشاء شعبه بنجاح!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleAddAllPresets = () => {
    let addedCount = 0;
    requestedPresets.forEach((p) => {
      const exists = grades.some(
        (g) =>
          g.name.includes(p.label) ||
          g.code.toLowerCase() === p.code.toLowerCase() ||
          g.name === p.name
      );
      if (!exists) {
        addGrade({
          name: p.name,
          code: p.code,
          stage: p.stage,
          annualTuition: p.tuition,
          sectionsCount: 2,
          studentsCount: 0,
          academicYearId: "year-2025-2026",
        });
        addedCount++;
      }
    });

    setSuccessMessage(`تمت إضافة وتفعيل حزمة الصفوف المطلوبة (${addedCount} صفوف جديدة) بنجاح!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeName.trim()) return;

    const code =
      gradeCode.trim().toUpperCase() ||
      `G-${Math.floor(100 + Math.random() * 900)}`;

    addGrade({
      name: gradeName.trim(),
      code,
      stage,
      annualTuition: Number(annualTuition) || 18000,
      sectionsCount: Number(sectionsCount) || 1,
      studentsCount: 0,
      academicYearId: "year-2025-2026",
    });

    setSuccessMessage(`تم إنشاء الصف المفتوح "${gradeName}" بنجاح!`);
    setGradeName("");
    setGradeCode("");
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <span>إضافة صفوف دراسية مفتوحة ومراحل متقدمة</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold">
                  السابع حتى البكالوريا
                </span>
              </h3>
              <p className="text-[11px] text-indigo-200/80">
                إضافة صفوف جاهزة بضغطة زر أو إنشاء صف مفتوح مخصص بأي مسمى
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Section 1: 1-Click Requested Presets */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-black text-slate-900 text-xs">
                  الصفوف المطلوبة للإضافة السريعة (بنقرة واحدة):
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddAllPresets}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>إضافة كل الصفوف الستة دفعة واحدة ⚡</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {requestedPresets.map((preset) => {
                const isAlreadyAdded = grades.some(
                  (g) =>
                    g.name.includes(preset.label) ||
                    g.code.toLowerCase() === preset.code.toLowerCase() ||
                    g.name === preset.name
                );
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                      isAlreadyAdded
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                        : "bg-white hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {preset.code}
                      </span>
                      {isAlreadyAdded ? (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          مفعّل
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-indigo-600">+ إضافة</span>
                      )}
                    </div>
                    <div className="font-black text-xs text-slate-900 line-clamp-1">
                      {preset.name}
                    </div>
                    <div className="text-[10.5px] text-slate-500 mt-1">
                      {preset.stage === "high" ? "مرحلة ثانوية" : "مرحلة متوسطة / إعدادية"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Custom Open Grade Form */}
          <form onSubmit={handleSubmitCustom} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span className="font-black text-slate-900 text-xs">
                إضافة صف مفتوح مخصص (Custom Open Grade):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  اسم الصف الدراسي *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الصف التاسع المتقدم أو بكالوريا أدبي"
                  value={gradeName}
                  onChange={(e) => setGradeName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  كود الصف الأكاديمي (Code)
                </label>
                <input
                  type="text"
                  placeholder="مثال: G9-ADV أو BAC-LIT"
                  value={gradeCode}
                  onChange={(e) => setGradeCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  المرحلة التعليمية
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as Grade["stage"])}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="middle">المرحلة الإعدادية / المتوسطة (7 - 9)</option>
                  <option value="high">المرحلة الثانوية / البكالوريا (10 - 12)</option>
                  <option value="primary">المرحلة الابتدائية (1 - 6)</option>
                  <option value="kg">مرحلة رياض الأطفال (KG)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  الرسوم الدراسية السنوية (ر.س)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={annualTuition}
                  onChange={(e) => setAnnualTuition(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                * يتم تلقائياً إنشاء شعبة (أ) الافتراضية مع الصف لإمكانية تسجيل الطلاب فوراً.
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وإنشاء الصف المفتوح</span>
              </button>
            </div>
          </form>

          {/* Current Active Grades Summary */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 text-[11px]">
                الصفوف المعتمدة حالياً في النظام ({grades.length} صفوف):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {grades.map((g) => (
                <span
                  key={g.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200/80"
                >
                  {g.name} <span className="font-mono text-indigo-700">({g.code})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
