import React, { useState, useEffect } from "react";
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
  Search,
  Filter,
  Sparkles,
  Award,
  Check,
  Clock,
  School,
  X,
  AlertCircle,
  Copy,
  Library,
  BookCheck,
  CheckSquare,
} from "lucide-react";

interface SchoolStructureViewProps {
  initialSubTab?: "grades" | "sections" | "subjects" | "years" | "permissions" | "import_export";
}

export const SchoolStructureView: React.FC<SchoolStructureViewProps> = ({ initialSubTab }) => {
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
    updateStaff,
    exportDatabaseJson,
    importDatabaseJson,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<"grades" | "sections" | "subjects" | "years" | "permissions" | "import_export">(initialSubTab || "grades");

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Modals
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [gradeForm, setGradeForm] = useState({ name: "", code: "", stage: "primary" as Grade["stage"], annualTuition: 15000 });

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState({ name: "", gradeId: "", classroom: "", roomNumber: "", maxCapacity: 28, supervisorTeacherId: "" });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    gradeId: "",
    creditHours: 4,
    maxScore: 100,
    passScore: 50,
    teacherId: "",
    iconName: "📖",
    description: "",
  });
  const [applyToAllStageGrades, setApplyToAllStageGrades] = useState(false);
  const [showBatchCurriculumModal, setShowBatchCurriculumModal] = useState(false);
  const [batchGradeId, setBatchGradeId] = useState("");
  const [copySubjectModal, setCopySubjectModal] = useState<{ isOpen: boolean; subject: Subject | null; targetGradeId: string }>({
    isOpen: false,
    subject: null,
    targetGradeId: "",
  });

  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
  const [subjectFilterGrade, setSubjectFilterGrade] = useState("all");
  const [subjectFilterStage, setSubjectFilterStage] = useState<"all" | "primary" | "middle" | "high">("all");
  const [subjectToast, setSubjectToast] = useState<string | null>(null);

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const popularSubjectPresets = [
    { name: "القرآن الكريم والدراسات الإسلامية", code: "ISL-101", hours: 4, icon: "📖", desc: "تلاوة وحفظ القرآن الكريم، الفقه والحديث، والسيرة النبوية العطرة" },
    { name: "لغتي الجميلة (اللغة العربية)", code: "ARB-101", hours: 6, icon: "✍️", desc: "القراءة والاستيعاب، النحو والقواعد اللغوية، الإملاء والتعبير الكتابي" },
    { name: "الرياضيات والحساب الذهني", code: "MTH-101", hours: 5, icon: "📐", desc: "الجبر، الهندسة، الإحصاء، والعمليات الحسابية وحل المسائل الرياضية" },
    { name: "العلوم العامة واستكشاف الطبيعة", code: "SCI-101", hours: 4, icon: "🔬", desc: "علم الأحياء المبسط، الظواهر الفيزيائية، والتجارب العلمية الاستكشافية" },
    { name: "اللغة الإنجليزية (English World)", code: "ENG-101", hours: 5, icon: "🌐", desc: "English vocabulary, grammar, reading comprehension, and phonics" },
    { name: "الذكاء الاصطناعي والحاسوب", code: "AI-101", hours: 3, icon: "💻", desc: "مفاهيم التفكير الخوارزمي، البرمجة، والذكاء الاصطناعي وتطبيقات الحاسب" },
    { name: "الدراسات الاجتماعية والمواطنة", code: "SOC-101", hours: 3, icon: "🌍", desc: "جغرافيا وتاريخ الوطن، التربية الوطنية، وقيم المواطنة الإيجابية" },
    { name: "الفيزياء المتقدمة", code: "PHY-201", hours: 4, icon: "⚡", desc: "الميكانيكا، الكهرومغناطيسية، الديناميكا الحرارية، وتطبيقات الفيزياء" },
    { name: "الكيمياء وتجارب المختبر", code: "CHM-201", hours: 4, icon: "🧪", desc: "الجدول الدوري، التفاعلات الكيميائية، والمحاليل والتجارب المخبرية" },
    { name: "الأحياء والعلوم الحياتية", code: "BIO-201", hours: 4, icon: "🌱", desc: "تركيب الخلية، علم الوراثة، أجهزة جسم الإنسان، والتنوع البيئي" },
    { name: "اللغة الفرنسية (Français)", code: "FRN-101", hours: 3, icon: "🗼", desc: "Langue française: grammaire, vocabulaire et conversation" },
    { name: "التربية الفنية والتصميم", code: "ART-101", hours: 2, icon: "🎨", desc: "أساسيات الرسم والتلوين، التشكيل، والتربية البصرية والجمالية" },
    { name: "التربية البدنية والرياضية", code: "PED-101", hours: 2, icon: "⚽", desc: "اللياقة البدنية، الألعاب الجماعية، وقواعد الرياضة والصحة العامة" },
    { name: "المهارات الحياتية والأسرية", code: "LIF-101", hours: 2, icon: "💡", desc: "التفكير الناقد، إدارة الوقت، السلامة الشخصية، والتفاعل الإيجابي" },
  ];

  const presetIconsList = ["📖", "✍️", "📐", "🔬", "🌐", "💻", "⚡", "🧪", "🌱", "🌍", "🎨", "⚽", "🏛️", "💡", "🗼", "🧠", "📚", "🗣️"];

  const generateSubjectCode = (name: string, gradeId?: string) => {
    const clean = name.trim();
    let prefix = "SUB";
    if (clean.includes("رياضيات") || clean.includes("حساب")) prefix = "MTH";
    else if (clean.includes("عرب") || clean.includes("لغت")) prefix = "ARB";
    else if (clean.includes("إنجليز") || clean.includes("انجليز")) prefix = "ENG";
    else if (clean.includes("علوم")) prefix = "SCI";
    else if (clean.includes("فيزياء")) prefix = "PHY";
    else if (clean.includes("كيمياء")) prefix = "CHM";
    else if (clean.includes("أحياء") || clean.includes("احياء")) prefix = "BIO";
    else if (clean.includes("إسلام") || clean.includes("قرآن") || clean.includes("دين")) prefix = "ISL";
    else if (clean.includes("حاسب") || clean.includes("ذكاء") || clean.includes("برمج")) prefix = "AI";
    else if (clean.includes("فني") || clean.includes("رسم")) prefix = "ART";
    else if (clean.includes("بدني") || clean.includes("رياض")) prefix = "PED";
    else if (clean.includes("اجتماع") || clean.includes("تاريخ") || clean.includes("جغرافي") || clean.includes("مواطن")) prefix = "SOC";
    else if (clean.includes("فرنس")) prefix = "FRN";
    else if (clean.includes("مهارات")) prefix = "LIF";

    const g = grades.find((gr) => gr.id === (gradeId || subjectForm.gradeId));
    let num = "101";
    if (g) {
      const gIndex = Math.max(1, grades.indexOf(g) + 1);
      if (g.stage === "primary") num = `10${gIndex}`;
      else if (g.stage === "middle") num = `20${gIndex}`;
      else if (g.stage === "high") num = `30${gIndex}`;
    }
    return `${prefix}-${num}`;
  };

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
    if (!subjectForm.name.trim()) return;

    const g = grades.find((gr) => gr.id === subjectForm.gradeId) || grades[0];
    const t = staff.find((st) => st.id === subjectForm.teacherId);
    const cleanName = subjectForm.name.trim();
    const finalCode = subjectForm.code.trim() || generateSubjectCode(cleanName, subjectForm.gradeId);

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        ...subjectForm,
        name: cleanName,
        code: finalCode,
        gradeName: g?.name,
        teacherName: t?.fullName,
      });
      setSubjectToast(`تم تحديث المادة الدراسية "${cleanName}" بنجاح.`);
    } else {
      if (applyToAllStageGrades && g) {
        const stageGrades = grades.filter((gr) => gr.stage === g.stage);
        stageGrades.forEach((stgGrade, idx) => {
          const autoCode = generateSubjectCode(cleanName, stgGrade.id);
          addSubject({
            ...subjectForm,
            name: cleanName,
            code: autoCode,
            gradeId: stgGrade.id,
            gradeName: stgGrade.name,
            teacherName: t?.fullName,
          });
        });
        setSubjectToast(`تمت إضافة المادة "${cleanName}" بنجاح وتعميمها على جميع صفوف المرحلة (${stageGrades.length} صفوف)!`);
      } else {
        addSubject({
          ...subjectForm,
          name: cleanName,
          code: finalCode,
          gradeName: g?.name,
          teacherName: t?.fullName,
        });
        setSubjectToast(`تمت إضافة المادة الدراسية "${cleanName}" بنجاح!`);
      }
    }

    if (t && cleanName) {
      const currentSubs = t.teachingSubjects || [];
      if (!currentSubs.includes(cleanName)) {
        updateStaff(t.id, {
          teachingSubjects: [...currentSubs, cleanName],
        });
      }
    }

    setTimeout(() => setSubjectToast(null), 3500);
    setShowSubjectModal(false);
    setEditingSubject(null);
    setApplyToAllStageGrades(false);
  };

  // Duplicate / Copy Subject to another grade
  const handleDuplicateSubject = (targetGradeId: string) => {
    if (!copySubjectModal.subject) return;
    const targetGrade = grades.find((g) => g.id === targetGradeId);
    if (!targetGrade) return;

    const newCode = generateSubjectCode(copySubjectModal.subject.name, targetGradeId);
    const subName = copySubjectModal.subject.name;

    addSubject({
      ...copySubjectModal.subject,
      code: newCode,
      gradeId: targetGrade.id,
      gradeName: targetGrade.name,
    });

    setSubjectToast(`تم نسخ مقرر "${subName}" إلى ${targetGrade.name} بنجاح!`);
    setTimeout(() => setSubjectToast(null), 3500);
    setCopySubjectModal({ isOpen: false, subject: null, targetGradeId: "" });
  };

  // Batch Add Core Standard Curriculum to a Grade
  const handleBatchAddCoreCurriculum = (targetGradeId: string) => {
    const targetGrade = grades.find((g) => g.id === targetGradeId);
    if (!targetGrade) return;

    const coreItems = [
      { name: "القرآن الكريم والدراسات الإسلامية", prefix: "ISL", hours: 4, icon: "📖" },
      { name: "لغتي الجميلة (اللغة العربية)", prefix: "ARB", hours: 6, icon: "✍️" },
      { name: "الرياضيات والحساب الذهني", prefix: "MTH", hours: 5, icon: "📐" },
      { name: "العلوم العامة واستكشاف الطبيعة", prefix: "SCI", hours: 4, icon: "🔬" },
      { name: "اللغة الإنجليزية (English World)", prefix: "ENG", hours: 5, icon: "🌐" },
      { name: "الذكاء الاصطناعي والحاسوب", prefix: "AI", hours: 3, icon: "💻" },
      { name: "الدراسات الاجتماعية والمواطنة", prefix: "SOC", hours: 3, icon: "🌍" },
      { name: "التربية الفنية والتصميم", prefix: "ART", hours: 2, icon: "🎨" },
      { name: "التربية البدنية والرياضية", prefix: "PED", hours: 2, icon: "⚽" },
    ];

    let countAdded = 0;
    coreItems.forEach((c) => {
      const alreadyExists = subjects.some((s) => s.gradeId === targetGradeId && s.name.includes(c.name.slice(0, 7)));
      if (!alreadyExists) {
        const autoCode = generateSubjectCode(c.name, targetGradeId);
        addSubject({
          name: c.name,
          code: autoCode,
          gradeId: targetGrade.id,
          gradeName: targetGrade.name,
          creditHours: c.hours,
          maxScore: 100,
          passScore: 50,
          teacherId: staff.find((st) => st.role === "teacher")?.id || "",
          teacherName: staff.find((st) => st.role === "teacher")?.fullName || "",
          iconName: c.icon,
        });
        countAdded++;
      }
    });

    setSubjectToast(`تمت إضافة حزمة المناهج الوزارية (${countAdded} مواد) إلى ${targetGrade.name} بنجاح!`);
    setTimeout(() => setSubjectToast(null), 3500);
    setShowBatchCurriculumModal(false);
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
          {/* Notification Toast */}
          {subjectToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{subjectToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setSubjectToast(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* SubTab Header with Stats & Actions */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">المناهج والمقررات الدراسية</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  {subjects.length} مادة دراسية معتمدة
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {subjects.reduce((sum, s) => sum + (s.creditHours || 4), 0)} حصة أسبوعياً
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {subjects.filter((s) => s.teacherId).length} مادة بأساتذة معينين
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                إضافة المواد والمناهج الجديدة، توزيع الحصص الأسبوعية، ربط المقررات بالصفوف والمعلمين، وضبط معايير الدرجات والنجاح.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Batch Core Curriculum Button */}
              <button
                type="button"
                onClick={() => {
                  setBatchGradeId(grades[0]?.id || "");
                  setShowBatchCurriculumModal(true);
                }}
                className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>حزمة المناهج الأساسية لصف</span>
              </button>

              {/* Main Add Subject Button */}
              <button
                type="button"
                onClick={() => {
                  setEditingSubject(null);
                  const firstGradeId = grades[0]?.id || "grade-1";
                  const autoCode = generateSubjectCode("المادة", firstGradeId);
                  setSubjectForm({
                    name: "",
                    code: autoCode,
                    gradeId: firstGradeId,
                    creditHours: 4,
                    maxScore: 100,
                    passScore: 50,
                    teacherId: staff.find((s) => s.role === "teacher")?.id || "",
                    iconName: "📖",
                    description: "",
                  });
                  setApplyToAllStageGrades(false);
                  setShowSubjectModal(true);
                }}
                className="flex-1 lg:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مادة دراسية جديدة</span>
              </button>
            </div>
          </div>

          {/* Quick Presets Strip: Fast 1-Click Addition */}
          <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 p-3.5 rounded-2xl border border-blue-100/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-bold flex items-center gap-1.5 text-blue-950">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                نماذج مقررات شائعة جاهزة للإدراج الفوري بنقرة واحدة:
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">انقر على أي مادة لتعبئتها وتخصيصها فوراً</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {popularSubjectPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setEditingSubject(null);
                    const firstGradeId = grades[0]?.id || "grade-1";
                    const autoCode = generateSubjectCode(preset.name, firstGradeId);
                    setSubjectForm({
                      name: preset.name,
                      code: autoCode,
                      gradeId: firstGradeId,
                      creditHours: preset.hours,
                      maxScore: 100,
                      passScore: 50,
                      teacherId: staff.find((s) => s.role === "teacher")?.id || "",
                      iconName: preset.icon,
                      description: preset.desc,
                    });
                    setApplyToAllStageGrades(false);
                    setShowSubjectModal(true);
                  }}
                  className="shrink-0 px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer group"
                >
                  <span className="text-sm">{preset.icon}</span>
                  <span>{preset.name}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-100 font-mono">
                    ({preset.hours}h)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث باسم المادة، الرمز الأكاديمي، الصف، أو المعلم المعتمد..."
                value={subjectSearchQuery}
                onChange={(e) => setSubjectSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Stage Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl shrink-0 overflow-x-auto">
              {[
                { id: "all", label: "كل المراحل" },
                { id: "primary", label: "الابتدائية" },
                { id: "middle", label: "المتوسطة" },
                { id: "high", label: "الثانوية" },
              ].map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSubjectFilterStage(stage.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    subjectFilterStage === stage.id
                      ? "bg-white text-blue-700 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>

            {/* Grade Selector Filter */}
            <div className="w-full md:w-56 flex items-center gap-1.5 shrink-0">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={subjectFilterGrade}
                onChange={(e) => setSubjectFilterGrade(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">كل الصفوف الدراسية ({grades.length})</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subjects Grid Cards */}
          {(() => {
            const filteredSubjects = subjects.filter((sub) => {
              const query = subjectSearchQuery.trim().toLowerCase();
              const matchSearch =
                !query ||
                (sub.name || "").toLowerCase().includes(query) ||
                (sub.code || "").toLowerCase().includes(query) ||
                (sub.gradeName || "").toLowerCase().includes(query) ||
                (sub.teacherName || "").toLowerCase().includes(query);

              const subGrade = grades.find((g) => g.id === sub.gradeId);
              const matchStage =
                subjectFilterStage === "all" ||
                (subGrade && subGrade.stage === subjectFilterStage);

              const matchGrade =
                subjectFilterGrade === "all" || sub.gradeId === subjectFilterGrade;

              return matchSearch && matchStage && matchGrade;
            });

            if (filteredSubjects.length === 0) {
              return (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
                    📚
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">لا توجد مواد دراسية مطابقة للبحث</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    يمكنك إضافة مادة دراسية جديدة، مسح حقول الفلترة، أو استخدام النماذج السريعة المتاحة بالأعلى لإدراج المقررات فوراً.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectSearchQuery("");
                        setSubjectFilterGrade("all");
                        setSubjectFilterStage("all");
                        setEditingSubject(null);
                        const firstGradeId = grades[0]?.id || "grade-1";
                        setSubjectForm({
                          name: "",
                          code: generateSubjectCode("المادة", firstGradeId),
                          gradeId: firstGradeId,
                          creditHours: 4,
                          maxScore: 100,
                          passScore: 50,
                          teacherId: staff.find((s) => s.role === "teacher")?.id || "",
                          iconName: "📖",
                          description: "",
                        });
                        setShowSubjectModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      + إضافة مادة دراسية الآن
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectSearchQuery("");
                        setSubjectFilterGrade("all");
                        setSubjectFilterStage("all");
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      إعادة ضبط الفلترة
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((sub) => {
                  const subGrade = grades.find((g) => g.id === sub.gradeId);
                  const subTeacher = staff.find((s) => s.id === sub.teacherId);
                  const displayIcon = sub.iconName || (sub.name.includes("رياضيات") ? "📐" : sub.name.includes("قرآن") || sub.name.includes("إسلام") ? "📖" : sub.name.includes("علوم") ? "🔬" : sub.name.includes("حاسب") || sub.name.includes("ذكاء") ? "💻" : sub.name.includes("إنجليز") ? "🌐" : sub.name.includes("فيزياء") ? "⚡" : sub.name.includes("كيمياء") ? "🧪" : "📚");

                  return (
                    <div
                      key={sub.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center text-base border border-blue-200 shadow-2xs">
                              {displayIcon}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200">
                              {sub.code}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span>{sub.creditHours || 4} حصص أسبوعياً</span>
                          </span>
                        </div>

                        {/* Subject Title */}
                        <h4 className="text-sm font-bold text-slate-900 mt-3 flex items-center gap-1.5">
                          <span className="truncate">{sub.name}</span>
                        </h4>

                        {/* Description snippet if any */}
                        {sub.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-normal">
                            {sub.description}
                          </p>
                        )}

                        {/* Details Card Table */}
                        <div className="mt-3.5 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">الصف المستهدف:</span>
                            <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                              {sub.gradeName || subGrade?.name || "غير محدد"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">معلم المادة المعتمد:</span>
                            <span className="font-bold text-indigo-700 text-[11px]">
                              {sub.teacherName || subTeacher?.fullName ? (
                                <span className="flex items-center gap-1">
                                  <span>{sub.teacherName || subTeacher?.fullName}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 font-normal">لم يعين معلم بعد</span>
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">الدرجة الكبرى / النجاح:</span>
                            <span className="font-bold text-slate-900 font-mono text-[11px] bg-slate-100/70 px-2 py-0.5 rounded">
                              {sub.maxScore || 100} / {sub.passScore || 50}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-400 font-medium">معتمد في الخطة</span>
                        <div className="flex items-center gap-1">
                          {/* Copy to another grade button */}
                          <button
                            type="button"
                            onClick={() => {
                              const otherGrade = grades.find((g) => g.id !== sub.gradeId)?.id || grades[0]?.id || "";
                              setCopySubjectModal({
                                isOpen: true,
                                subject: sub,
                                targetGradeId: otherGrade,
                              });
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="نسخ المادة لصف دراسي آخر"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubject(sub);
                              setSubjectForm({
                                name: sub.name,
                                code: sub.code,
                                gradeId: sub.gradeId,
                                creditHours: sub.creditHours || 4,
                                maxScore: sub.maxScore || 100,
                                passScore: sub.passScore || 50,
                                teacherId: sub.teacherId || "",
                                iconName: sub.iconName || displayIcon,
                                description: sub.description || "",
                              });
                              setApplyToAllStageGrades(false);
                              setShowSubjectModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل بيانات المادة"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف مادة "${sub.name}"؟`)) {
                                deleteSubject(sub.id);
                                setSubjectToast(`تم حذف المادة "${sub.name}" بنجاح.`);
                                setTimeout(() => setSubjectToast(null), 3000);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف المادة من الخطة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-5 sm:p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-2xs text-lg">
                  {subjectForm.iconName || "📖"}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingSubject ? "تعديل بيانات المقرر الدراسي" : "إضافة مقرر دراسي جديد"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    أدخل تفاصيل المادة، الحصص الأسبوعية، الصف المستهدف، والمعلم المعتمد.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            {!editingSubject && (
              <div className="mt-3.5 p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
                <div className="text-[11px] font-bold text-blue-950 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>نماذج مقررات مقترحة جاهزة (انقر للاختيار والتعبئة الفورية):</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {popularSubjectPresets.slice(0, 8).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const autoCode = generateSubjectCode(preset.name, subjectForm.gradeId);
                        setSubjectForm({
                          ...subjectForm,
                          name: preset.name,
                          code: autoCode,
                          creditHours: preset.hours,
                          iconName: preset.icon,
                          description: preset.desc,
                        });
                      }}
                      className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg text-[11px] font-medium text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-3.5 mt-4 text-xs">
              {/* Subject Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  اسم المقرر الدراسي <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: الرياضيات والحساب الذهني، الفيزياء المتقدمة، لغتي الجميلة..."
                    value={subjectForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoCode = generateSubjectCode(val, subjectForm.gradeId);
                      setSubjectForm({
                        ...subjectForm,
                        name: val,
                        code: !subjectForm.code || subjectForm.code.startsWith("SUB-") ? autoCode : subjectForm.code,
                      });
                    }}
                    className="w-full pr-3 pl-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Emoji / Icon Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  أيقونة المادة التعبيرية (Emoji)
                </label>
                <div className="flex items-center gap-1.5 flex-wrap p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {presetIconsList.map((icon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSubjectForm({ ...subjectForm, iconName: icon })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-transform cursor-pointer ${
                        subjectForm.iconName === icon
                          ? "bg-blue-600 text-white shadow-xs scale-110"
                          : "hover:bg-slate-200 bg-white"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code & Target Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">
                      الرمز الأكاديمي (Code) <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const auto = generateSubjectCode(subjectForm.name || "مادة", subjectForm.gradeId);
                        setSubjectForm({ ...subjectForm, code: auto });
                      }}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                    >
                      توليد تلقائي 🔄
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="مثال: MTH-101"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    الصف الدراسي المستهدف <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={subjectForm.gradeId}
                    onChange={(e) => {
                      const newGradeId = e.target.value;
                      const autoCode = generateSubjectCode(subjectForm.name || "مادة", newGradeId);
                      setSubjectForm({ ...subjectForm, gradeId: newGradeId, code: autoCode });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stage-Wide Apply Toggle */}
              {!editingSubject && (
                <div
                  onClick={() => setApplyToAllStageGrades(!applyToAllStageGrades)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    applyToAllStageGrades
                      ? "bg-blue-50 border-blue-300 text-blue-900"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={applyToAllStageGrades}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold block">
                      تعميم المادة وتطبيقها على جميع صفوف المرحلة التعليمية
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {applyToAllStageGrades ? (
                        <span className="text-blue-700 font-semibold">
                          سيتم إنشاء المقرر تلقائياً لكافة صفوف (
                          {grades.find((g) => g.id === subjectForm.gradeId)?.stage === "primary"
                            ? "المرحلة الابتدائية"
                            : grades.find((g) => g.id === subjectForm.gradeId)?.stage === "middle"
                            ? "المرحلة المتوسطة"
                            : "المرحلة الثانوية"}
                          ) بأكواد متناسقة.
                        </span>
                      ) : (
                        "تطبيق المادة فقط على الصف المحدد أعلاه."
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Weekly Hours & Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Credit Hours */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الحصص أسبوعياً</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={subjectForm.creditHours}
                      onChange={(e) => setSubjectForm({ ...subjectForm, creditHours: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-center"
                    />
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[2, 3, 4, 5, 6].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSubjectForm({ ...subjectForm, creditHours: h })}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold ${
                          subjectForm.creditHours === h ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Score */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدرجة الكبرى</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={subjectForm.maxScore}
                    onChange={(e) => setSubjectForm({ ...subjectForm, maxScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-center"
                  />
                  <div className="flex gap-1 mt-1">
                    {[100, 60, 50, 20].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSubjectForm({ ...subjectForm, maxScore: s, passScore: Math.floor(s / 2) })}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold ${
                          subjectForm.maxScore === s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pass Score */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">درجة النجاح</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={subjectForm.passScore}
                    onChange={(e) => setSubjectForm({ ...subjectForm, passScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-center"
                  />
                  <div className="flex gap-1 mt-1">
                    {[50, 30, 25, 10].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSubjectForm({ ...subjectForm, passScore: p })}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold ${
                          subjectForm.passScore === p ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assigned Teacher */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">معلم المادة المعتمد</label>
                <select
                  value={subjectForm.teacherId}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">بدون تعيين حالياً (تحديد لاحقاً)</option>
                  {staff
                    .filter((s) => s.role === "teacher")
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} — تخصص: {s.specialization} ({s.employeeNumber})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 سيتم إسناد المقرر تلقائياً للمعلم ليتمكن من رصد الدرجات وإدارة تقييماتها فوراً في بوابة المعلم.
                </p>
              </div>

              {/* Description / Syllabus Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  وصف المنهج أو ملاحظات المقرر <span className="text-slate-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: يتضمن موضوعات الجبر، الهندسة المستوية، وحل المشكلات الرياضية..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSubject ? "تحديث المقرر" : "حفظ واعتماد المقرر الدراسي"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Core Curriculum Modal */}
      {showBatchCurriculumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">إضافة حزمة المناهج الوزارية الأساسية</h3>
                  <p className="text-[11px] text-slate-500">إدراج المقررات القياسية المعتمدة بضغطة زر واحدة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchCurriculumModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">اختر الصف الدراسي لإضافة الحزمة إليه:</label>
                <select
                  value={batchGradeId}
                  onChange={(e) => setBatchGradeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">
                  قائمة المقررات التي ستتم إضافتها تلقائياً (9 مواد أساسية):
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1.5">📖 القرآن والدراسات الإسلامية</span>
                  <span className="flex items-center gap-1.5">✍️ لغتي الجميلة (العربية)</span>
                  <span className="flex items-center gap-1.5">📐 الرياضيات والحساب</span>
                  <span className="flex items-center gap-1.5">🔬 العلوم العامة</span>
                  <span className="flex items-center gap-1.5">🌐 اللغة الإنجليزية</span>
                  <span className="flex items-center gap-1.5">💻 الحاسوب والذكاء الاصطناعي</span>
                  <span className="flex items-center gap-1.5">🌍 الدراسات الاجتماعية</span>
                  <span className="flex items-center gap-1.5">🎨 التربية الفنية</span>
                  <span className="flex items-center gap-1.5">⚽ التربية البدنية</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBatchCurriculumModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchAddCoreCurriculum(batchGradeId || grades[0]?.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>إضافة الحزمة لهذا الصف الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy / Duplicate Subject Modal */}
      {copySubjectModal.isOpen && copySubjectModal.subject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">نسخ المقرر لصف دراسي آخر</h3>
                  <p className="text-[11px] text-slate-500">إنشاء نسخة مطابقة من المادة لصف جديد</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCopySubjectModal({ isOpen: false, subject: null, targetGradeId: "" })}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">المادة المختارة للنسخ:</span>
                <span className="font-bold text-slate-900 text-sm">{copySubjectModal.subject.name}</span>
                <span className="text-[10px] text-blue-600 block mt-0.5">
                  كود المصدر: {copySubjectModal.subject.code} — {copySubjectModal.subject.creditHours} حصص أسبوعياً
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">اختر الصف الدراسي الجديد المراد نسخ المادة إليه:</label>
                <select
                  value={copySubjectModal.targetGradeId}
                  onChange={(e) => setCopySubjectModal({ ...copySubjectModal, targetGradeId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCopySubjectModal({ isOpen: false, subject: null, targetGradeId: "" })}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateSubject(copySubjectModal.targetGradeId)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>تأكيد نسخ المادة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
