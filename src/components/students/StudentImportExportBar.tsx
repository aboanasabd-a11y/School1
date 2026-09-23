import React, { useRef, useState } from "react";
import { Student } from "../../types";
import {
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  FileDown,
  Layers,
} from "lucide-react";
import {
  exportStudentsToExcel,
  exportStudentsToCSV,
  parseUploadedStudentFile,
} from "../../utils/studentExcelService";
import { OFFICIAL_STUDENT_COLUMNS } from "../../data/officialStudentSchema";

interface StudentImportExportBarProps {
  students: Student[];
  grades: { id: string; name: string }[];
  sections: { id: string; name: string }[];
  onImportStudents: (imported: Student[], mode: "append" | "replace") => void;
  onResetOfficial: () => void;
}

export const StudentImportExportBar: React.FC<StudentImportExportBarProps> = ({
  students,
  grades,
  sections,
  onImportStudents,
  onResetOfficial,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
  const [pendingParsedStudents, setPendingParsedStudents] = useState<Student[]>([]);
  const [importMode, setImportMode] = useState<"append" | "replace">("replace");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: "info", message: "جارٍ قراءة الملف وتحليل الأعمدة بنفس الترتيب المعتمد..." });

    try {
      const parsed = await parseUploadedStudentFile(file, grades, sections);
      if (parsed.length === 0) {
        setImportStatus({
          type: "error",
          message: "لم يتم العثور على سجلات صالحة في الملف المرفوع.",
        });
        setIsImporting(false);
        return;
      }

      setPendingParsedStudents(parsed);
      setShowImportConfirmModal(true);
      setImportStatus(null);
    } catch (err: any) {
      console.error("Import error:", err);
      setImportStatus({
        type: "error",
        message: `حدث خطأ أثناء قراءة الملف: ${err.message || "تأكد من صيغة الملف"}`,
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleConfirmImport = () => {
    onImportStudents(pendingParsedStudents, importMode);
    setShowImportConfirmModal(false);
    setImportStatus({
      type: "success",
      message: `تم بنجاح استيراد ${pendingParsedStudents.length} طالباً وفق الترتيب المعتمد!`,
    });
    setPendingParsedStudents([]);
    setTimeout(() => setImportStatus(null), 5000);
  };

  const handleExportExcel = () => {
    exportStudentsToExcel(students, `بيانات_الطلاب_${new Date().toISOString().split("T")[0]}.xlsx`);
    setImportStatus({
      type: "success",
      message: `تم تصدير ملف Excel بجميع الأعمدة الـ 46 بنفس الترتيب المطلوب بنجاح!`,
    });
    setTimeout(() => setImportStatus(null), 4000);
  };

  const handleExportCSV = () => {
    exportStudentsToCSV(students, `سجل_الطلاب_${new Date().toISOString().split("T")[0]}.csv`);
    setImportStatus({
      type: "success",
      message: `تم تصدير ملف CSV مع ترميز UTF-8 لدعم الحروف العربية بنجاح!`,
    });
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-indigo-900/50">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and stats */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                نظام استيراد وتصدير بيانات الطلاب بنفس الترتيب المعتمد
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  46 عموداً رسمياً متطابقاً
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                تعبئة معلومات الطالب واستيراد وتصدير ملفات Excel و CSV بالترتيب الدقيق: (id, idcard, الاسم، النسبة، الكنية1، الأب، الجد، الأم، الجنس، تاريخ ومكان الولادة، السكن، الحالة الصحية، الموهبة، ملاحظات، الصف، الشعبة، الفوج، اسم المدرسة، المعدل، أولياء الأمور، الأقساط، الدفعات، المواصلات، والتسليمات).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="استيراد كشف طلاب من ملف Excel أو CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد ملف الطلاب</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="تصدير كشف كامل إلى Excel (.xlsx) بالترتيب الأصلي"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
            <span>تصدير Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95"
            title="تصدير CSV متوافق مع الحروف العربية"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={() => setShowColumnsModal(true)}
            className="px-2.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/80 transition-all flex items-center gap-1"
            title="عرض ترتيب ومسميات الأعمدة الرسمية"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>ترتيب الأعمدة ({OFFICIAL_STUDENT_COLUMNS.length})</span>
          </button>

          <button
            onClick={onResetOfficial}
            className="px-2.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs font-medium border border-amber-500/30 transition-all flex items-center gap-1"
            title="إعادة تحميل الكشف الرسمي الكامل المحفوظ"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>استعادة الكشف الأصلي</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {importStatus && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center justify-between border ${
            importStatus.type === "success"
              ? "bg-emerald-950/60 text-emerald-200 border-emerald-500/40"
              : importStatus.type === "error"
              ? "bg-rose-950/60 text-rose-200 border-rose-500/40"
              : "bg-blue-950/60 text-blue-200 border-blue-500/40"
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {importStatus.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {importStatus.type === "info" && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal: Confirm Import */}
      {showImportConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-right animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileDown className="w-5 h-5 text-emerald-600" />
                تأكيد استيراد ملف الطلاب ({pendingParsedStudents.length} طالباً)
              </h4>
              <button
                onClick={() => setShowImportConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              تم بنجاح قراءة الملف ومطابقة حقوله مع النموذج الرسمي الـ 46 عموداً. اختر طريقة الإدراج في قاعدة البيانات:
            </p>

            <div className="space-y-3 mb-5">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  importMode === "replace"
                    ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === "replace"}
                  onChange={() => setImportMode("replace")}
                  className="mt-1 text-indigo-600"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    استبدال السجل الحالي بالكامل (سجل نظيف مطابق للملف)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    يحل السجل المستورد محل قائمة الطلاب الحالية ويجعلها مطابقة تماماً للملف.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  importMode === "append"
                    ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="append"
                  checked={importMode === "append"}
                  onChange={() => setImportMode("append")}
                  className="mt-1 text-indigo-600"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    إلحاق الطلاب الجدد بالسجل الحالي
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    يحتفظ بالطلاب الحاليين ويضيف الطلاب الجدد فقط دون تكرار.
                  </div>
                </div>
              </label>
            </div>

            {/* Quick Preview of First 3 Students */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-5">
              <div className="text-[11px] font-bold text-slate-700 mb-2">معاينة أول 3 سجلات مستوردة:</div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                {pendingParsedStudents.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">#{s.excelRowId || idx + 1} - {s.fullName}</span>
                    <span className="text-slate-500">{s.academicGradeText || s.gradeName} | {s.addressDetail || s.address}</span>
                    <span className="font-mono text-emerald-700 font-bold">{s.guardianPhone1 || s.familyInfo.fatherPhone || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowImportConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                تأكيد الاستيراد الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Order of Columns */}
      {showColumnsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-right max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  ترتيب أعمدة التصدير والاستيراد المعتمد ({OFFICIAL_STUDENT_COLUMNS.length} عموداً)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  هذا الترتيب الدقيق محفوظ ومطابق في ملفات Excel و CSV المستوردة والمصدرة.
                </p>
              </div>
              <button
                onClick={() => setShowColumnsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto my-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {OFFICIAL_STUDENT_COLUMNS.map((col, idx) => (
                  <div
                    key={col.header}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center gap-2"
                  >
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800 truncate" title={col.header}>
                      {col.header}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                يدعم صيغ XLSX و XLS و CSV المشفر بترميز UTF-8
              </span>
              <button
                onClick={() => setShowColumnsModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
