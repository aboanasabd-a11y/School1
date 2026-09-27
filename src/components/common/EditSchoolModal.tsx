import React, { useState, useRef } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Building2,
  Image as ImageIcon,
  MapPin,
  Phone,
  Mail,
  User,
  Code2,
  Globe,
  Save,
  X,
  Sparkles,
  CheckCircle,
  RotateCcw,
  Upload,
  Trash2,
  Camera,
  Check,
} from "lucide-react";

interface EditSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "school" | "branding" | "developer";
}

const PRESET_LOGOS = [
  {
    name: "درع التميز الأكاديمي",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230369a1"/></linearGradient></defs><path d="M50 5 L88 20 C88 60 50 95 50 95 C50 95 12 60 12 20 Z" fill="url(%23g1)" stroke="%2338bdf8" stroke-width="3"/><path d="M50 25 L65 33 L50 41 L35 33 Z" fill="%23f8fafc"/><path d="M42 38 L42 50 C42 55 58 55 58 50 L58 38" fill="none" stroke="%23f8fafc" stroke-width="2"/><circle cx="50" cy="68" r="8" fill="%23f59e0b"/><path d="M50 63 L52 67 L56 68 L53 71 L54 75 L50 73 L46 75 L47 71 L44 68 L48 67 Z" fill="%23ffffff"/></svg>`,
  },
  {
    name: "صرح المعرفة الذهبي",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23d97706"/><stop offset="100%" stop-color="%23b45309"/></linearGradient></defs><circle cx="50" cy="50" r="44" fill="%230f172a" stroke="url(%23g2)" stroke-width="4"/><path d="M28 65 C38 58 48 60 50 64 C52 60 62 58 72 65 L72 38 C62 31 52 33 50 37 C48 33 38 31 28 38 Z" fill="%23f8fafc"/><path d="M50 37 L50 64" stroke="%230f172a" stroke-width="2"/><path d="M50 18 L53 26 L62 26 L55 31 L57 39 L50 34 L43 39 L45 31 L38 26 L47 26 Z" fill="%23fbbf24"/></svg>`,
  },
  {
    name: "شعلة التفوق والريادة",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234f46e5"/><stop offset="100%" stop-color="%23312e81"/></linearGradient></defs><rect x="8" y="8" width="84" height="84" rx="22" fill="url(%23g3)" stroke="%23818cf8" stroke-width="3"/><path d="M50 20 C42 35 40 45 44 55 C46 48 50 44 52 46 C56 50 54 62 48 68 C58 66 64 56 62 46 C60 36 54 28 50 20 Z" fill="%23f59e0b"/><rect x="42" y="68" width="16" height="12" rx="3" fill="%23e0e7ff"/></svg>`,
  },
  {
    name: "النخبة الأكاديمية الحديث",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23059669"/><stop offset="100%" stop-color="%23064e3b"/></linearGradient></defs><circle cx="50" cy="50" r="44" fill="url(%23g4)" stroke="%2334d399" stroke-width="3"/><path d="M30 45 L50 35 L70 45 L50 55 Z" fill="%23ffffff"/><path d="M38 51 L38 63 C38 68 62 68 62 63 L62 51" fill="none" stroke="%23ffffff" stroke-width="3"/><path d="M68 46 L74 54 L74 65" fill="none" stroke="%23fbbf24" stroke-width="2.5"/></svg>`,
  },
];

export const EditSchoolModal: React.FC<EditSchoolModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "school",
}) => {
  const { schoolInfo, updateSchoolInfo } = useSchool();

  const [form, setForm] = useState({ ...schoolInfo });
  const [activeTab, setActiveTab] = useState<"school" | "branding" | "developer">(defaultTab);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("حجم الصورة كبير جداً، الحد الأقصى المسموح 5 ميغابايت");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setForm((prev) => ({ ...prev, logoUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({ ...prev, logoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetToStandardDefault = () => {
    setForm({
      schoolName: "المدرسة النموذجية الأهلية",
      directorate: "إدارة التعليم الأهلي والخاص",
      ministry: "وزارة التربية والتعليم",
      country: "",
      location: "الإدارة العامة للتعليم",
      logoUrl: "",
      principalName: "د. عبد العزيز بن إبراهيم الراجحي",
      phone: "+966 11 234 5678",
      email: "info@school-model.edu",
      address: "حي النرجس، شارع الملك سلمان",
      motto: "بالعلم والمعرفة نبني أجيال المستقبل",
      developerName: "نظام الإدارة المدرسية الموحد",
      developerUrl: "",
      developerSocials: {
        youtube: "",
        facebook: "",
        telegram: "",
        tiktok: "",
        instagram: "",
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0b3b60] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                تعديل معلومات المدرسة وهوية اللوغو والشعار
              </h2>
              <p className="text-[11px] text-sky-200">
                إضافة لوغو المدرسة وتخصيص الترويسة والبيانات الرسمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("branding")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "branding"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>لوغو المدرسة والهوية البصرية</span>
            {form.logoUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("school")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "school"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>بيانات المدرسة والتربية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("developer")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "developer"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>بيانات المطور والنظام</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ وتحديث اللوغو وبيانات المدرسة بنجاح في كامل النظام!</span>
            </div>
          )}

          {/* TAB: Branding & Logo */}
          {activeTab === "branding" && (
            <div className="space-y-4">
              {/* Dual Surface Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  معاينة مظهر اللوغو في النظام:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* On Dark Header */}
                  <div className="p-3 rounded-xl bg-[#0b3b60] text-white flex items-center gap-3 border border-[#082a45]">
                    <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
                      {form.logoUrl ? (
                        <img
                          src={form.logoUrl}
                          alt="Logo preview dark"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-sky-200" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-sky-300 font-medium">على الشريط العلوي (الهيدر)</div>
                      <div className="text-xs font-bold truncate text-white">
                        {form.schoolName || "المدرسة الأهلية"}
                      </div>
                      <div className="text-[10px] text-sky-200/80 truncate">
                        {form.ministry || "وزارة التربية والتعليم"}
                      </div>
                    </div>
                  </div>

                  {/* On Light Document / Footer */}
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-3 border border-slate-200">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
                      {form.logoUrl ? (
                        <img
                          src={form.logoUrl}
                          alt="Logo preview light"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-sky-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-500 font-medium">على التقارير والفوتر (الورق)</div>
                      <div className="text-xs font-bold truncate text-slate-900">
                        {form.schoolName || "المدرسة الأهلية"}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {form.motto || "بالعلم نبني المستقبل"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload File Zone */}
              <div className="p-4 bg-sky-50/60 border-2 border-dashed border-sky-300 rounded-2xl text-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="modal-logo-file-input"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      رفع شعار / لوغو المدرسة من جهازك
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      يدعم صور PNG الشفافة، JPG، WebP، أو ملفات SVG المتجهة (حجم حتى 5 ميغابايت)
                    </p>
                  </div>
                </div>

                {uploadError && (
                  <div className="text-rose-600 text-[11px] font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {uploadError}
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>اختر ملف صورة من جهازك</span>
                  </button>

                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف اللوغو</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Logo URL Input (Alternative) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  أو أدخل رابط مباشر للوغو (Image URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.logoUrl.startsWith("data:") ? "تم رفع ملف من الجهاز بنجاح" : form.logoUrl}
                    onChange={(e) => {
                      if (!e.target.value.startsWith("تم رفع")) {
                        setForm({ ...form, logoUrl: e.target.value });
                      }
                    }}
                    placeholder="https://example.com/school-logo.png"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden font-mono text-left"
                    dir="ltr"
                    disabled={form.logoUrl.startsWith("data:")}
                  />
                  {form.logoUrl.startsWith("data:") && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      استبدال برابط
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Academic Crests */}
              <div className="border-t border-slate-200 pt-3">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  أو اختر شعاراً تعليمياً نموذجياً جاهزاً بنقرة واحدة:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_LOGOS.map((preset) => {
                    const isSelected = form.logoUrl === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setForm({ ...form, logoUrl: preset.url })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-sky-50 border-sky-600 ring-2 ring-sky-500/20 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="w-10 h-10 p-1 flex items-center justify-center">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 line-clamp-1">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] text-sky-700 font-extrabold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> تم الاختيار
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: School & Ministry Info */}
          {activeTab === "school" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المدرسة الرسمي
                </label>
                <input
                  type="text"
                  required
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  placeholder="مثال: مدرسة المستقبل النموذجية الأهلية"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الوزارة أو الهيئة المشرفة
                  </label>
                  <input
                    type="text"
                    value={form.ministry}
                    onChange={(e) => setForm({ ...form, ministry: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="مثال: وزارة التربية والتعليم"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    إدارة التعليم أو المديرية
                  </label>
                  <input
                    type="text"
                    value={form.directorate}
                    onChange={(e) => setForm({ ...form, directorate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="مثال: إدارة التعليم الأهلي والخاص"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الموقع والمقر (الترويسة والفوتر)
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="مثال: الإدارة العامة للتعليم"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    شعار المدرسة التعبيري (Motto)
                  </label>
                  <input
                    type="text"
                    value={form.motto}
                    onChange={(e) => setForm({ ...form, motto: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="مثال: بالعلم والمعرفة نبني أجيال المستقبل"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم مدير المدرسة
                  </label>
                  <input
                    type="text"
                    value={form.principalName}
                    onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف والتواصل
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  العنوان والتفاصيل الجغرافية
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB: Developer Info */}
          {activeTab === "developer" && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-400/30">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold">{form.developerName || "إدارة النظام"}</div>
                    <div className="text-[10.5px] text-sky-300">منظومة الإدارة المدرسية الموحدة</div>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-600/30 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/40">
                  شريط النظام العلوي
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم النظام أو الجهة المطورة
                </label>
                <input
                  type="text"
                  value={form.developerName}
                  onChange={(e) => setForm({ ...form, developerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط الموقع أو الدعم الفني
                </label>
                <input
                  type="url"
                  value={form.developerUrl || ""}
                  onChange={(e) => setForm({ ...form, developerUrl: e.target.value })}
                  placeholder="https://myschool.edu"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToStandardDefault}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الإعدادات الافتراضية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-700/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات في النظام</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
