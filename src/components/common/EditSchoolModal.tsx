import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Building2,
  Image,
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
  HelpCircle,
  RotateCcw,
} from "lucide-react";

interface EditSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditSchoolModal: React.FC<EditSchoolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { schoolInfo, updateSchoolInfo } = useSchool();

  const [form, setForm] = useState({ ...schoolInfo });
  const [activeTab, setActiveTab] = useState<"school" | "branding" | "developer">("school");
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleResetToIraqDefault = () => {
    setForm({
      schoolName: "متوسطة الرافدين للبنين",
      directorate: "المديرية العامة لتربية بغداد",
      ministry: "جمهورية العراق - وزارة التربية",
      country: "جمهورية العراق",
      location: "وزارة التربية - بغداد",
      logoUrl: "",
      principalName: "أ. حيدر جاسم كاظم",
      phone: "+964 770 123 4567",
      email: "info@alrafidain-school.iq",
      address: "بغداد - الكرخ - حي الجامعة",
      motto: "بالعلم نبني المستقبل",
      developerName: "Ahmedpc",
      developerUrl: "https://ahmedpc.iq",
      developerSocials: {
        youtube: "https://youtube.com",
        facebook: "https://facebook.com",
        telegram: "https://t.me",
        tiktok: "https://tiktok.com",
        instagram: "https://instagram.com",
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-sky-800 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                تعديل معلومات المدرسة، الشعار، الموقع وهوية المطور
              </h2>
              <p className="text-[11px] text-sky-200">
                تخصيص كامل للهيدر والفوتر والترويسة بما يتطابق مع مدرستك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs shrink-0">
          <button
            onClick={() => setActiveTab("school")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "school"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>معلومات المدرسة والتربية</span>
          </button>

          <button
            onClick={() => setActiveTab("branding")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "branding"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>الشعار (Logo) وشعار الدولة</span>
          </button>

          <button
            onClick={() => setActiveTab("developer")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "developer"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>بيانات المطور (Developer)</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ وتحديث بيانات المدرسة والمطور بنجاح في كامل المنظومة!</span>
            </div>
          )}

          {/* TAB 1: School Info */}
          {activeTab === "school" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المدرسة (مثل: متوسطة الرافدين للبنين)
                </label>
                <input
                  type="text"
                  required
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  placeholder="مثال: متوسطة الرافدين للبنين"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المديرية العامة (مثل: المديرية العامة لتربية بغداد)
                  </label>
                  <input
                    type="text"
                    value={form.directorate}
                    onChange={(e) => setForm({ ...form, directorate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الوزارة والدولة (مثل: جمهورية العراق - وزارة التربية)
                  </label>
                  <input
                    type="text"
                    value={form.ministry}
                    onChange={(e) => setForm({ ...form, ministry: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الموقع في الترويسة والفوتر
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="مثال: وزارة التربية - بغداد"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    شعار الفوتر (Motto)
                  </label>
                  <input
                    type="text"
                    value={form.motto}
                    onChange={(e) => setForm({ ...form, motto: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="مثال: بالعلم نبني المستقبل"
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
                    رقم الهاتف
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

          {/* TAB 2: Logo and Branding */}
          {activeTab === "branding" && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-sky-600 flex items-center justify-center text-white shrink-0 font-bold">
                  {form.logoUrl ? (
                    <img
                      src={form.logoUrl}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    معاينة لوغو المدرسة
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    يمكنك إدخال رابط صورة مباشرة للوغو المدرسة أو تركه فارغاً لاستخدام أيقونة المدرسة الرسمية المتطابقة مع الصورة.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط صورة اللوغو (Logo Image URL) - اختياري
                </label>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden font-mono text-left"
                  dir="ltr"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  إذا تُرك فارغاً سيتم إظهار أيقونة مدرسة كحلي وسماوي عالية الدقة مطابقة للتصميم المرفق.
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  شعار النسر الجمهوري الرسمي (جمهورية العراق - وزارة التربية)
                </span>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {/* Emblem preview */}
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                    🦅
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">{form.ministry}</div>
                    <div className="text-slate-500 text-[11px]">{form.directorate}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Developer Info */}
          {activeTab === "developer" && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-400/30">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold">{form.developerName}</div>
                    <div className="text-[10.5px] text-sky-300">مطور ومبرمج المنظومة</div>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-600/30 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/40">
                  يظهر في الشريط العلوي وقائمة النظام
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المطور / اسم الشركة (مثل: Ahmedpc)
                </label>
                <input
                  type="text"
                  required
                  value={form.developerName}
                  onChange={(e) => setForm({ ...form, developerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط موقع المطور أو المعرض
                </label>
                <input
                  type="url"
                  value={form.developerUrl || ""}
                  onChange={(e) => setForm({ ...form, developerUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-hidden font-mono text-left"
                  dir="ltr"
                  placeholder="https://..."
                />
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  روابط التواصل الاجتماعي للمطور (تظهر في الهيدر والفوتر):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 mb-0.5 block">يوتيوب YouTube:</span>
                    <input
                      type="text"
                      value={form.developerSocials?.youtube || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          developerSocials: {
                            ...form.developerSocials,
                            youtube: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 mb-0.5 block">فيسبوك Facebook:</span>
                    <input
                      type="text"
                      value={form.developerSocials?.facebook || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          developerSocials: {
                            ...form.developerSocials,
                            facebook: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 mb-0.5 block">تيليغرام Telegram:</span>
                    <input
                      type="text"
                      value={form.developerSocials?.telegram || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          developerSocials: {
                            ...form.developerSocials,
                            telegram: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 mb-0.5 block">تيك توك TikTok:</span>
                    <input
                      type="text"
                      value={form.developerSocials?.tiktok || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          developerSocials: {
                            ...form.developerSocials,
                            tiktok: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToIraqDefault}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة نموذج الصورة الأصلي</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
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
