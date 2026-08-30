import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { Grade, Section, Subject, AcademicYear } from "../../types";
import {
  Building2,
  Calendar,
  Layers,
  BookOpen,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Upload,
  Shield,
} from "lucide-react";

export const SchoolStructureView: React.FC = () => {
  const {
    academicYears,
    grades,
    sections,
    subjects,
    staff,
    userProfiles,
    selectedYear,
    addGrade,
    updateGrade,
    deleteGrade,
    addSection,
    updateSection,
    deleteSection,
    addSubject,
    updateSubject,
    deleteSubject,
    exportDatabaseJson,
    importDatabaseJson,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<"grades" | "sections" | "subjects" | "years" | "permissions" | "import_export">("grades");

  // Modals
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [gradeForm, setGradeForm] = useState({ name: "", code: "", stage: "primary" as Grade["stage"], annualTuition: 15000 });

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState({ name: "", gradeId: "", classroom: "", roomNumber: "", maxCapacity: 28, supervisorTeacherId: "" });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", gradeId: "", creditHours: 4, maxScore: 100, passScore: 50, teacherId: "" });

  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Grade Save
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGrade) {
      updateGrade(editingGrade.id, gradeForm);
    } else {
      addGrade({
        ...gradeForm,
        academicYearId: selectedYear,
        sectionsCount: 0,
        studentsCount: 0,
      });
    }
    setShowGradeModal(false);
    setEditingGrade(null);
    setGradeForm({ name: "", code: "", stage: "primary", annualTuition: 15000 });
  };

  // Section Save
  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grades.find((gr) => gr.id === sectionForm.gradeId);
    const t = staff.find((st) => st.id === sectionForm.supervisorTeacherId);
    if (editingSection) {
      updateSection(editingSection.id, {
        ...sectionForm,
        gradeName: g?.name,
        supervisorTeacherName: t?.fullName,
      });
    } else {
      addSection({
        ...sectionForm,
        gradeName: g?.name,
        supervisorTeacherName: t?.fullName,
        currentStudentsCount: 0,
      });
    }
    setShowSectionModal(false);
    setEditingSection(null);
  };

  // Subject Save
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grades.find((gr) => gr.id === subjectForm.gradeId);
    const t = staff.find((st) => st.id === subjectForm.teacherId);
    if (editingSubject) {
      updateSubject(editingSubject.id, {
        ...subjectForm,
        gradeName: g?.name,
        teacherName: t?.fullName,
      });
    } else {
      addSubject({
        ...subjectForm,
        gradeName: g?.name,
        teacherName: t?.fullName,
      });
    }
    setShowSubjectModal(false);
    setEditingSubject(null);
  };

  const handleExportJson = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `School_Database_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importDatabaseJson(content);
      if (ok) {
        setImportStatus("تم استيراد واستعادة البيانات بنجاح!");
      } else {
        setImportStatus("فشل استيراد الملف، تأكد من صحة تنسيق JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            الهيكل التنظيمي والمدرسي
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة الأعوام والصفوف والشعب الدراسية، المقررات، والصلاحيات مع استيراد وتصدير البيانات.
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveSubTab("grades")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "grades" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المراحل والصفوف ({grades.length})
          </button>
          <button
            onClick={() => setActiveSubTab("sections")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "sections" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الشعب الدراسية ({sections.length})
          </button>
          <button
            onClick={() => setActiveSubTab("subjects")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "subjects" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المواد والمناهج ({subjects.length})
          </button>
          <button
            onClick={() => setActiveSubTab("years")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "years" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الأعوام الدراسية
          </button>
          <button
            onClick={() => setActiveSubTab("permissions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "permissions" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المستخدمين والصلاحيات
          </button>
          <button
            onClick={() => setActiveSubTab("import_export")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "import_export" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            استيراد وتصدير
          </button>
        </div>
      </div>

      {/* SubTab 1: Grades Management */}
      {activeSubTab === "grades" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">قائمة الصفوف والمراحل الدراسية</h3>
            <button
              onClick={() => {
                setEditingGrade(null);
                setGradeForm({ name: "", code: "", stage: "primary", annualTuition: 15000 });
                setShowGradeModal(true);
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة صف دراسي
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      كود: {grade.code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {grade.stage === "kg" ? "رياض الأطفال" : grade.stage === "primary" ? "ابتدائي" : grade.stage === "middle" ? "متوسط" : "ثانوي"}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{grade.name}</h4>
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>الرسوم السنوية:</span>
                      <span className="font-bold text-slate-900">{grade.annualTuition.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الشعب المفتوحة:</span>
                      <span className="font-bold text-slate-900">{sections.filter((s) => s.gradeId === grade.id).length} شعب</span>
                    </div>
                    <div className="flex justify-between">
                      <span>عدد الطلاب المقيدين:</span>
                      <span className="font-bold text-indigo-600">{grade.studentsCount} طالب</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingGrade(grade);
                      setGradeForm({
                        name: grade.name,
                        code: grade.code,
                        stage: grade.stage,
                        annualTuition: grade.annualTuition,
                      });
                      setShowGradeModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteGrade(grade.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Sections Management */}
      {activeSubTab === "sections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">إدارة الشعب والفصول الدراسية</h3>
            <button
              onClick={() => {
                setEditingSection(null);
                setSectionForm({
                  name: "",
                  gradeId: grades[0]?.id || "",
                  classroom: "مبنى الابتدائي",
                  roomNumber: "101",
                  maxCapacity: 28,
                  supervisorTeacherId: staff[0]?.id || "",
                });
                setShowSectionModal(true);
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة شعبة جديدة
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3.5">اسم الشعبة</th>
                  <th className="p-3.5">الصف التابع</th>
                  <th className="p-3.5">القاعة / الغرفة</th>
                  <th className="p-3.5">رائد الفصل (المشرف)</th>
                  <th className="p-3.5">الطلاب / السعة</th>
                  <th className="p-3.5 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {sections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{sec.name}</td>
                    <td className="p-3.5 text-slate-600">{sec.gradeName || grades.find((g) => g.id === sec.gradeId)?.name}</td>
                    <td className="p-3.5 text-slate-600">{sec.classroom} - غرفة ({sec.roomNumber})</td>
                    <td className="p-3.5 text-indigo-700 font-medium">{sec.supervisorTeacherName || "غير محدد"}</td>
                    <td className="p-3.5">
                      <span className="font-bold">{sec.currentStudentsCount}</span> / {sec.maxCapacity}
                    </td>
                    <td className="p-3.5 text-left">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingSection(sec);
                            setSectionForm({
                              name: sec.name,
                              gradeId: sec.gradeId,
                              classroom: sec.classroom,
                              roomNumber: sec.roomNumber,
                              maxCapacity: sec.maxCapacity,
                              supervisorTeacherId: sec.supervisorTeacherId,
                            });
                            setShowSectionModal(true);
                          }}
                          className="p-1.5 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSection(sec.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg"
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
      )}

      {/* SubTab 3: Subjects Management */}
      {activeSubTab === "subjects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">المناهج والمقررات الدراسية</h3>
            <button
              onClick={() => {
                setEditingSubject(null);
                setSubjectForm({
                  name: "",
                  code: "",
                  gradeId: grades[0]?.id || "",
                  creditHours: 4,
                  maxScore: 100,
                  passScore: 50,
                  teacherId: staff.find((s) => s.role === "teacher")?.id || "",
                });
                setShowSubjectModal(true);
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة مادة دراسية
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {sub.code}
                  </span>
                  <span className="text-xs text-slate-500">{sub.creditHours} حصص أسبوعياً</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{sub.name}</h4>
                <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span>الصف:</span>
                    <span className="font-semibold text-slate-800">{sub.gradeName || grades.find((g) => g.id === sub.gradeId)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معلم المادة:</span>
                    <span className="font-semibold text-indigo-600">{sub.teacherName || "غير محدد"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الدرجة الكبرى / النجاح:</span>
                    <span className="font-bold text-slate-900">{sub.maxScore} / {sub.passScore}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingSubject(sub);
                      setSubjectForm({
                        name: sub.name,
                        code: sub.code,
                        gradeId: sub.gradeId,
                        creditHours: sub.creditHours,
                        maxScore: sub.maxScore,
                        passScore: sub.passScore,
                        teacherId: sub.teacherId,
                      });
                      setShowSubjectModal(true);
                    }}
                    className="p-1 text-slate-500 hover:text-indigo-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSubject(sub.id)}
                    className="p-1 text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Academic Years */}
      {activeSubTab === "years" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">إدارة الأعوام الدراسية والفصول</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicYears.map((year) => (
              <div
                key={year.id}
                className={`p-4 rounded-xl border ${
                  year.isCurrent ? "border-indigo-300 bg-indigo-50/30" : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{year.name}</h4>
                  {year.isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                      العام النشط الحالي
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  الفترة: من {year.startDate} إلى {year.endDate}
                </p>
                <div className="mt-3 space-y-1 text-xs">
                  <span className="font-bold text-slate-700">الفصول الدراسية:</span>
                  {year.terms.map((t) => (
                    <div key={t.id} className="flex items-center justify-between px-2 py-1 bg-white rounded border border-slate-100">
                      <span>{t.name}</span>
                      {t.isCurrent && <span className="text-[10px] font-bold text-emerald-600">الفصل الجاري</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 5: Permissions Matrix */}
      {activeSubTab === "permissions" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">مصفوفة المستخدمين والأدوار والصلاحيات (RBAC)</h3>
            <span className="text-xs text-slate-500">نظام أمني متوافق مع معايير الحماية</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">المستخدم</th>
                  <th className="p-3">الدور الوظيفي</th>
                  <th className="p-3">البريد الإلكتروني</th>
                  <th className="p-3">الصلاحيات الممنوحة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userProfiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <img src={user.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                      <span>{user.fullName}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{user.email}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((perm) => (
                          <span key={perm} className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 6: Import / Export */}
      {activeSubTab === "import_export" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">استيراد وتصدير بيانات المدرسة</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              يدعم النظام التصدير الكامل بتنسيق JSON واستيراد السجلات واستعادتها بأمان تام.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Download className="w-5 h-5" />
                <span>تصدير قاعدة البيانات كاملة</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                تنزيل نسخة احتياطية شاملة لجميع الطلاب، الكادر التعليمي، الدرجات، الحضور، الحافلات، والبيانات المالية.
              </p>
              <button
                onClick={handleExportJson}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Download className="w-4 h-4" />
                تحميل النسخة الاحتياطية (JSON)
              </button>
            </div>

            {/* Import Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Upload className="w-5 h-5" />
                <span>استيراد ملف قاعدة بيانات</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                رفع ملف JSON لاستعادة أو دمج سجلات وبيانات المدرسة في المنظومة.
              </p>
              <label className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all">
                <Upload className="w-4 h-4" />
                <span>اختيار ملف JSON للاستيراد</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              {importStatus && (
                <div className="p-2 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg text-center">
                  {importStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingGrade ? "تعديل بيانات الصف" : "إضافة مرحلة / صف جديد"}
            </h3>
            <form onSubmit={handleSaveGrade} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم الصف</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الصف الخامس الابتدائي"
                  value={gradeForm.name}
                  onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الكود المختصر</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: G5"
                    value={gradeForm.code}
                    onChange={(e) => setGradeForm({ ...gradeForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المرحلة</label>
                  <select
                    value={gradeForm.stage}
                    onChange={(e) => setGradeForm({ ...gradeForm, stage: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="kg">رياض أطفال (KG)</option>
                    <option value="primary">ابتدائي</option>
                    <option value="middle">متوسط</option>
                    <option value="high">ثانوي</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">القسط السنوي المعتمد (ر.س)</label>
                <input
                  type="number"
                  required
                  value={gradeForm.annualTuition}
                  onChange={(e) => setGradeForm({ ...gradeForm, annualTuition: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingSection ? "تعديل بيانات الشعبة" : "إضافة شعبة دراسية جديدة"}
            </h3>
            <form onSubmit={handleSaveSection} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم الشعبة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شعبة (أ) - الأول الابتدائي"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">الصف التابع</label>
                <select
                  value={sectionForm.gradeId}
                  onChange={(e) => setSectionForm({ ...sectionForm, gradeId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المبنى / الجناح</label>
                  <input
                    type="text"
                    value={sectionForm.classroom}
                    onChange={(e) => setSectionForm({ ...sectionForm, classroom: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم القاعة</label>
                  <input
                    type="text"
                    value={sectionForm.roomNumber}
                    onChange={(e) => setSectionForm({ ...sectionForm, roomNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الطاقة الاستيعابية</label>
                  <input
                    type="number"
                    value={sectionForm.maxCapacity}
                    onChange={(e) => setSectionForm({ ...sectionForm, maxCapacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رائد الفصل (المشرف)</label>
                  <select
                    value={sectionForm.supervisorTeacherId}
                    onChange={(e) => setSectionForm({ ...sectionForm, supervisorTeacherId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingSubject ? "تعديل المادة" : "إضافة مقرر دراسي جديد"}
            </h3>
            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المقرر الدراسي</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الرياضيات والحساب"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">كود المادة</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: MTH-101"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الصف</label>
                  <select
                    value={subjectForm.gradeId}
                    onChange={(e) => setSubjectForm({ ...subjectForm, gradeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الحصص أسبوعياً</label>
                  <input
                    type="number"
                    value={subjectForm.creditHours}
                    onChange={(e) => setSubjectForm({ ...subjectForm, creditHours: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدرجة الكبرى</label>
                  <input
                    type="number"
                    value={subjectForm.maxScore}
                    onChange={(e) => setSubjectForm({ ...subjectForm, maxScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">درجة النجاح</label>
                  <input
                    type="number"
                    value={subjectForm.passScore}
                    onChange={(e) => setSubjectForm({ ...subjectForm, passScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">معلم المادة المعتمد</label>
                <select
                  value={subjectForm.teacherId}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.specialization})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
