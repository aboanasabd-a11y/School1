import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { Exam, GradeRecord, Assignment, AssessmentCategory } from "../../types";
import {
  Award,
  Calendar,
  BookOpen,
  Plus,
  CheckCircle,
  FileCheck,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ClipboardList,
  Edit2,
  X,
  FileText,
  Clock,
  MapPin,
  Percent,
  CheckCircle2,
  AlertCircle,
  Users,
  Printer,
  ChevronRight,
} from "lucide-react";

export const ExamsManagerView: React.FC = () => {
  const {
    exams,
    students,
    grades,
    subjects,
    gradeRecords,
    assignments,
    addExam,
    recordGrade,
    addAssignment,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<"gradebook" | "exams" | "assignments">("gradebook");
  const [categoryFilter, setCategoryFilter] = useState<"all" | AssessmentCategory>("all");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("all");
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || "");
  const [searchStudent, setSearchStudent] = useState<string>("");

  // Counts of each category
  const monthlyCount = exams.filter((e) => e.category === "monthly" || e.type === "monthly").length;
  const quizCount = exams.filter((e) => e.category === "quiz" || e.type === "quiz").length;
  const examCount = exams.filter(
    (e) => e.category === "exam" || e.type === "midterm" || e.type === "final" || e.type === "coursework"
  ).length;

  // Filtered exams according to category and grade
  const filteredExams = exams.filter((e) => {
    const matchesCat =
      categoryFilter === "all" ||
      (categoryFilter === "monthly" && (e.category === "monthly" || e.type === "monthly")) ||
      (categoryFilter === "quiz" && (e.category === "quiz" || e.type === "quiz")) ||
      (categoryFilter === "exam" &&
        (e.category === "exam" || e.type === "midterm" || e.type === "final" || e.type === "coursework"));

    const matchesGrade = selectedGradeId === "all" || e.gradeId === selectedGradeId;
    return matchesCat && matchesGrade;
  });

  const currentExam = exams.find((e) => e.id === selectedExamId) || filteredExams[0] || exams[0];

  // Modals state
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState<AssessmentCategory>("monthly");

  const [examForm, setExamForm] = useState({
    title: "تقييم الشهر الثاني",
    type: "monthly" as Exam["type"],
    category: "monthly" as AssessmentCategory,
    assessmentCategoryName: "تقييم شهري",
    term: "الفصل الدراسي الثاني",
    monthPeriod: "الشهر الثاني",
    quizNumber: 1,
    subjectId: subjects[0]?.id || "",
    gradeId: grades[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:30",
    endTime: "09:15",
    durationMinutes: 45,
    maxScore: 30,
    passingScore: 15,
    weighting: 20,
    room: "القاعة الصفية",
  });

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subjectId: subjects[0]?.id || "",
    gradeId: grades[0]?.id || "",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    maxPoints: 10,
    description: "",
  });

  const [scoringStudent, setScoringStudent] = useState<{
    studentId: string;
    studentName: string;
    score: number;
    notes: string;
  } | null>(null);

  // Switch modal category and set smart defaults
  const handleSelectModalCategory = (cat: AssessmentCategory) => {
    setSelectedModalCategory(cat);
    const sub = subjects.find((s) => s.id === examForm.subjectId) || subjects[0];
    const subName = sub ? sub.name : "";

    if (cat === "monthly") {
      setExamForm((prev) => ({
        ...prev,
        category: "monthly",
        type: "monthly",
        assessmentCategoryName: "تقييم شهري",
        title: `تقييم الشهر الثاني - ${subName || "المادة"}`,
        maxScore: 30,
        passingScore: 15,
        durationMinutes: 30,
        weighting: 20,
      }));
    } else if (cat === "quiz") {
      setExamForm((prev) => ({
        ...prev,
        category: "quiz",
        type: "quiz",
        assessmentCategoryName: "مذاكرة",
        title: `المذاكرة الأولى (تحريرية) - ${subName || "المادة"}`,
        maxScore: 20,
        passingScore: 10,
        durationMinutes: 25,
        weighting: 15,
      }));
    } else {
      setExamForm((prev) => ({
        ...prev,
        category: "exam",
        type: "midterm",
        assessmentCategoryName: "امتحان",
        title: `امتحان منتصف الفصل الدراسي الثاني - ${subName || "المادة"}`,
        maxScore: 40,
        passingScore: 20,
        durationMinutes: 60,
        weighting: 40,
        room: "القاعة الكبرى 1",
      }));
    }
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grades.find((gr) => gr.id === examForm.gradeId);
    const s = subjects.find((sb) => sb.id === examForm.subjectId);

    addExam({
      ...examForm,
      gradeName: g?.name || "الصف",
      subjectName: s?.name || "المادة",
      maxMarks: examForm.maxScore,
      passMarks: examForm.passingScore,
      status: "scheduled",
    });

    setShowExamModal(false);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grades.find((gr) => gr.id === assignmentForm.gradeId);
    const s = subjects.find((sb) => sb.id === assignmentForm.subjectId);
    addAssignment({
      ...assignmentForm,
      gradeName: g?.name || "الصف",
      subjectName: s?.name || "المادة",
      maxScore: assignmentForm.maxPoints,
      sectionId: "sec-all",
      sectionName: "كافة الشعب",
      teacherId: s?.teacherId || "staff-1",
      teacherName: s?.teacherName || "معلم المادة",
      submissionsCount: 0,
      totalStudents: 25,
      status: "open",
    });
    setShowAssignmentModal(false);
  };

  const handleSaveStudentGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringStudent || !currentExam) return;

    const max = currentExam.maxMarks || currentExam.maxScore || 100;
    const pass = currentExam.passMarks || currentExam.passingScore || Math.round(max * 0.5);
    const percentage = Math.round((scoringStudent.score / max) * 100);
    const isPassed = scoringStudent.score >= pass;

    let letterGrade = "F";
    if (percentage >= 95) letterGrade = "A+";
    else if (percentage >= 90) letterGrade = "A";
    else if (percentage >= 80) letterGrade = "B";
    else if (percentage >= 70) letterGrade = "C";
    else if (percentage >= 60) letterGrade = "D";

    const cat =
      currentExam.category ||
      (currentExam.type === "monthly"
        ? "monthly"
        : currentExam.type === "quiz"
        ? "quiz"
        : "exam");

    const categoryLabel =
      cat === "monthly" ? "تقييم شهري" : cat === "quiz" ? "مذاكرة" : "امتحان";

    recordGrade({
      studentId: scoringStudent.studentId,
      studentName: scoringStudent.studentName,
      subjectId: currentExam.subjectId,
      subjectName: currentExam.subjectName,
      gradeId: currentExam.gradeId,
      sectionId: "sec-1",
      examId: currentExam.id,
      examTitle: currentExam.title,
      examType: categoryLabel,
      category: cat,
      score: scoringStudent.score,
      maxScore: max,
      percentage,
      letterGrade,
      isPassed,
      notes: scoringStudent.notes,
      term: currentExam.term,
      date: new Date().toISOString().split("T")[0],
      recordedDate: new Date().toISOString().split("T")[0],
    });

    setScoringStudent(null);
  };

  // Exam students list for Gradebook
  const examStudents = students
    .filter((s) => !currentExam || s.gradeId === currentExam.gradeId)
    .filter((s) => !searchStudent || s.fullName.includes(searchStudent) || s.studentNumber.includes(searchStudent));

  // Compute stats across records
  const monthlyRecords = gradeRecords.filter(
    (r) => r.category === "monthly" || r.examType?.includes("شهري")
  );
  const quizRecords = gradeRecords.filter(
    (r) => r.category === "quiz" || r.examType?.includes("مذاكرة")
  );
  const majorExamRecords = gradeRecords.filter(
    (r) => r.category === "exam" || r.examType?.includes("امتحان") || r.examType?.includes("نصفي")
  );

  const calcAverage = (records: GradeRecord[]) => {
    if (records.length === 0) return 94.5;
    const sum = records.reduce((acc, r) => acc + r.percentage, 0);
    return Math.round((sum / records.length) * 10) / 10;
  };

  return (
    <div className="space-y-6">
      {/* Top Main Banner with Title & Quick Category Badges */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              إدارة التقييمات الشهرية، المذاكرات، والامتحانات
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            منظومة متكاملة لجدولة ورصد كافة أنواع التقويم المدرسي: التقييمات الشهرية، المذاكرات التحريرية والشفهية، والامتحانات الرسمية.
          </p>
        </div>

        {/* Action Button: Add Assessment / Exam */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              handleSelectModalCategory("monthly");
              setShowExamModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة تقييم / مذاكرة / امتحان</span>
          </button>
        </div>
      </div>

      {/* 3 Top Category KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: التقييمات الشهرية */}
        <div
          onClick={() => {
            setCategoryFilter("monthly");
            setActiveTab("exams");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === "monthly"
              ? "bg-sky-50/70 border-sky-300 ring-2 ring-sky-400/20"
              : "bg-white border-slate-200 hover:border-sky-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-sky-600" />
              التقييمات الشهرية
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
              {monthlyCount} مجدول
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{calcAverage(monthlyRecords)}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>متوسط درجات الطلاب</span>
            <span className="text-sky-700 font-bold">عرض القائمة ←</span>
          </div>
        </div>

        {/* Card 2: المذاكرات */}
        <div
          onClick={() => {
            setCategoryFilter("quiz");
            setActiveTab("exams");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === "quiz"
              ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20"
              : "bg-white border-slate-200 hover:border-amber-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-600" />
              المذاكرات الدورية
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {quizCount} مذاكرات
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{calcAverage(quizRecords)}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>متوسط نتائج المذاكرات</span>
            <span className="text-amber-700 font-bold">عرض القائمة ←</span>
          </div>
        </div>

        {/* Card 3: الامتحانات الرسمية */}
        <div
          onClick={() => {
            setCategoryFilter("exam");
            setActiveTab("exams");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === "exam"
              ? "bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/20"
              : "bg-white border-slate-200 hover:border-purple-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              الامتحانات المعتمدة
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              {examCount} امتحانات
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{calcAverage(majorExamRecords)}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>معدل الامتحانات النصفية والنهائية</span>
            <span className="text-purple-700 font-bold">عرض القائمة ←</span>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("gradebook")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "gradebook"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            سجل رصد الدرجات (Gradebook)
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "exams"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            جدول التقييمات والمذاكرات والامتحانات ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "assignments"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الواجبات والتكليفات ({assignments.length})
          </button>
        </div>

        {/* Category Filters Quick Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 ml-1">تصفية النوع:</span>
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              categoryFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            الكل ({exams.length})
          </button>
          <button
            onClick={() => setCategoryFilter("monthly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              categoryFilter === "monthly"
                ? "bg-sky-600 text-white"
                : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200"
            }`}
          >
            📋 تقييمات شهرية ({monthlyCount})
          </button>
          <button
            onClick={() => setCategoryFilter("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              categoryFilter === "quiz"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            📝 مذاكرات ({quizCount})
          </button>
          <button
            onClick={() => setCategoryFilter("exam")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              categoryFilter === "exam"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            🎓 امتحانات ({examCount})
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GRADEBOOK */}
      {/* ========================================================= */}
      {activeTab === "gradebook" && (
        <div className="space-y-4">
          {/* Exam & Grade Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">
                  اختر الاختبار / التقييم المطلوب رصده:
                </label>
                <select
                  value={currentExam?.id || ""}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full sm:w-80 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {filteredExams.map((exam) => {
                    const catLabel =
                      exam.category === "monthly" || exam.type === "monthly"
                        ? "📋 تقييم شهري"
                        : exam.category === "quiz" || exam.type === "quiz"
                        ? "📝 مذاكرة"
                        : "🎓 امتحان";
                    return (
                      <option key={exam.id} value={exam.id}>
                        {catLabel}: {exam.title} - ({exam.gradeName})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search student */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">بحث عن طالب:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="اسم الطالب أو الرقم..."
                    className="w-48 py-2 pr-8 pl-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {currentExam && (
              <div className="flex flex-wrap items-center gap-2.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 self-stretch md:self-auto justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">نوع الاختبار:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      currentExam.category === "monthly" || currentExam.type === "monthly"
                        ? "bg-sky-100 text-sky-800"
                        : currentExam.category === "quiz" || currentExam.type === "quiz"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {currentExam.assessmentCategoryName ||
                      (currentExam.category === "monthly"
                        ? "تقييم شهري"
                        : currentExam.category === "quiz"
                        ? "مذاكرة"
                        : "امتحان")}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">المادة المقررة:</span>
                  <strong className="text-slate-800">{currentExam.subjectName}</strong>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">الدرجة الكبرى:</span>
                  <strong className="text-indigo-700 font-mono">
                    {currentExam.maxMarks || currentExam.maxScore || 100}
                  </strong>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">النجاح من:</span>
                  <strong className="text-emerald-700 font-mono">
                    {currentExam.passMarks || currentExam.passingScore || 50}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Gradebook Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                كشف رصد درجات الطلاب • {currentExam?.title || "الاختبار المحدد"} ({examStudents.length} طالب)
              </span>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الكشف</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3.5">الطالب / الرقم الأكاديمي</th>
                    <th className="p-3.5">الصف والشعبة</th>
                    <th className="p-3.5">نوع التقييم</th>
                    <th className="p-3.5">الدرجة المرصودة</th>
                    <th className="p-3.5">النسبة المئوية</th>
                    <th className="p-3.5">التقدير الحرفي</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5">ملاحظات المعلم</th>
                    <th className="p-3.5 text-left">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {examStudents.map((std) => {
                    const record = gradeRecords.find(
                      (r) => r.studentId === std.id && r.examId === currentExam?.id
                    );

                    const maxSc = currentExam?.maxMarks || currentExam?.maxScore || 100;
                    const passSc = currentExam?.passMarks || currentExam?.passingScore || Math.round(maxSc * 0.5);

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <img
                            src={
                              std.photo ||
                              "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"
                            }
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                            alt=""
                          />
                          <div>
                            <div>{std.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{std.studentNumber}</div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {std.gradeName} - {std.sectionName}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              currentExam?.category === "monthly" || currentExam?.type === "monthly"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : currentExam?.category === "quiz" || currentExam?.type === "quiz"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {currentExam?.assessmentCategoryName || "تقييم"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {record ? (
                            <span className="font-bold text-indigo-700 text-sm font-mono">
                              {record.score}{" "}
                              <span className="text-slate-400 text-xs font-normal">/ {record.maxScore}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">غير مرصود</span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono font-bold">
                          {record ? (
                            <span className="text-slate-900">{record.percentage}%</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3.5">
                          {record ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                record.percentage >= 90
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : record.percentage >= 80
                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {record.letterGrade}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3.5">
                          {record ? (
                            record.score >= passSc ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" /> ناجح
                              </span>
                            ) : (
                              <span className="text-rose-600 font-bold text-[11px]">دون المستوى</span>
                            )
                          ) : (
                            <span className="text-amber-600 text-[11px] font-medium">بانتظار الرصد</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate">
                          {record?.notes || "—"}
                        </td>
                        <td className="p-3.5 text-left">
                          <button
                            onClick={() =>
                              setScoringStudent({
                                studentId: std.id,
                                studentName: std.fullName,
                                score: record?.score ?? (currentExam ? Math.round(maxSc * 0.9) : 25),
                                notes: record?.notes || "مستوى متميز وإجابات نموذجية متقنة.",
                              })
                            }
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            {record ? "تعديل الدرجة" : "رصد الدرجة"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SCHEDULED EXAMS & ASSESSMENTS */}
      {/* ========================================================= */}
      {activeTab === "exams" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>جدول التقييمات الشهرية والمذاكرات والامتحانات المعتمدة</span>
              <span className="text-xs text-slate-400 font-normal">
                (عرض {filteredExams.length} من {exams.length})
              </span>
            </h3>

            <div className="flex items-center gap-2">
              {/* Grade Filter */}
              <select
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="all">كافة الصفوف الدراسية</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  handleSelectModalCategory(categoryFilter === "all" ? "monthly" : categoryFilter);
                  setShowExamModal(true);
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ جدولة جديدة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => {
              const isMonthly = exam.category === "monthly" || exam.type === "monthly";
              const isQuiz = exam.category === "quiz" || exam.type === "quiz";
              const isExam = !isMonthly && !isQuiz;

              const badgeColor = isMonthly
                ? "bg-sky-50 text-sky-800 border-sky-200"
                : isQuiz
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-purple-50 text-purple-800 border-purple-200";

              const typeText = isMonthly
                ? "📋 تقييم شهري"
                : isQuiz
                ? "📝 مذاكرة"
                : "🎓 امتحان رسمي";

              return (
                <div
                  key={exam.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                        {typeText}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{exam.term}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2">{exam.title}</h4>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                      {exam.subjectName} • {exam.gradeName}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" /> التاريخ:
                        </span>
                        <span className="font-bold text-slate-800">{exam.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" /> التوقيت والمدة:
                        </span>
                        <span className="font-bold text-slate-800">
                          {exam.durationMinutes || 45} دقيقة ({exam.startTime || "08:30"})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3" /> القاعة:
                        </span>
                        <span className="font-bold text-slate-800">{exam.room || "القاعة الصفية"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Percent className="w-3 h-3" /> الدرجة الكبرى / النجاح:
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          {exam.maxMarks || exam.maxScore || 100} /{" "}
                          {exam.passMarks || exam.passingScore || 50}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> معتمد رسمياً
                    </span>
                    <button
                      onClick={() => {
                        setSelectedExamId(exam.id);
                        setActiveTab("gradebook");
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>رصد الدرجات</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ASSIGNMENTS */}
      {/* ========================================================= */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">الواجبات والتكليفات المدرسية اليومية</h3>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة واجب مدرسي
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    استحقاق: {asg.dueDate}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {asg.maxScore || 10} نقاط
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{asg.title}</h4>
                <p className="text-xs text-indigo-600 font-medium">
                  {asg.subjectName} ({asg.gradeName})
                </p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{asg.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    تم التسليم: <strong className="text-slate-900">{asg.submissionsCount}</strong> /{" "}
                    {asg.totalStudents}
                  </span>
                  <span className="text-[11px] text-slate-400">بواسطة: {asg.teacherName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD EXAM / MONTHLY EVALUATION / QUIZ */}
      {/* ========================================================= */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">جدولة تقويم أكاديمي جديد</h3>
                <p className="text-xs text-slate-500">اختر نوع التقييم وحدد الصف والمقرر والمواعيد</p>
              </div>
              <button
                type="button"
                onClick={() => setShowExamModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Clickable Choice Cards to switch category */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => handleSelectModalCategory("monthly")}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  selectedModalCategory === "monthly"
                    ? "bg-sky-50 border-sky-400 ring-2 ring-sky-300/30 text-sky-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="text-base mb-1">📋</div>
                <div className="text-xs font-black">تقييم شهري</div>
                <div className="text-[10px] text-slate-500 mt-0.5">تقييم الشهر 1، 2، 3</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModalCategory("quiz")}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  selectedModalCategory === "quiz"
                    ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/30 text-amber-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="text-base mb-1">📝</div>
                <div className="text-xs font-black">مذاكرة</div>
                <div className="text-[10px] text-slate-500 mt-0.5">مذاكرة 1، 2، شفهية</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModalCategory("exam")}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  selectedModalCategory === "exam"
                    ? "bg-purple-50 border-purple-400 ring-2 ring-purple-300/30 text-purple-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="text-base mb-1">🎓</div>
                <div className="text-xs font-black">امتحان رسمي</div>
                <div className="text-[10px] text-slate-500 mt-0.5">نصفي أو نهائي رسمي</div>
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  عنوان {selectedModalCategory === "monthly" ? "التقييم الشهري" : selectedModalCategory === "quiz" ? "المذاكرة" : "الامتحان"}
                </label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الصف الدراسي</label>
                  <select
                    value={examForm.gradeId}
                    onChange={(e) => setExamForm({ ...examForm, gradeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المادة المقررة</label>
                  <select
                    value={examForm.subjectId}
                    onChange={(e) => {
                      const newSubId = e.target.value;
                      const s = subjects.find((sb) => sb.id === newSubId);
                      setExamForm({
                        ...examForm,
                        subjectId: newSubId,
                        title:
                          selectedModalCategory === "monthly"
                            ? `تقييم ${examForm.monthPeriod || "الشهر الثاني"} - ${s?.name || ""}`
                            : selectedModalCategory === "quiz"
                            ? `المذاكرة ${examForm.quizNumber || 1} - ${s?.name || ""}`
                            : `امتحان منتصف الفصل - ${s?.name || ""}`,
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Options by Category */}
              {selectedModalCategory === "monthly" && (
                <div className="grid grid-cols-2 gap-3 bg-sky-50/60 p-3 rounded-xl border border-sky-200">
                  <div>
                    <label className="block text-sky-900 font-bold mb-1">فترة الشهر التقييمي</label>
                    <select
                      value={examForm.monthPeriod}
                      onChange={(e) => {
                        const m = e.target.value;
                        const s = subjects.find((sb) => sb.id === examForm.subjectId);
                        setExamForm({
                          ...examForm,
                          monthPeriod: m,
                          title: `تقييم ${m} - ${s?.name || ""}`,
                        });
                      }}
                      className="w-full p-2 rounded-lg border border-sky-300 text-xs font-bold bg-white"
                    >
                      <option value="الشهر الأول">تقييم الشهر الأول</option>
                      <option value="الشهر الثاني">تقييم الشهر الثاني</option>
                      <option value="الشهر الثالث">تقييم الشهر الثالث</option>
                      <option value="تقييم مهاري دوري">تقييم مهاري دوري</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sky-900 font-bold mb-1">الفصل الدراسي</label>
                    <select
                      value={examForm.term}
                      onChange={(e) => setExamForm({ ...examForm, term: e.target.value })}
                      className="w-full p-2 rounded-lg border border-sky-300 text-xs font-bold bg-white"
                    >
                      <option value="الفصل الدراسي الأول">الفصل الأول</option>
                      <option value="الفصل الدراسي الثاني">الفصل الثاني</option>
                      <option value="الفصل الدراسي الثالث">الفصل الثالث</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedModalCategory === "quiz" && (
                <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <div>
                    <label className="block text-amber-900 font-bold mb-1">رقم أو نوع المذاكرة</label>
                    <select
                      value={examForm.quizNumber}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        const s = subjects.find((sb) => sb.id === examForm.subjectId);
                        const label = num === 1 ? "المذاكرة الأولى" : num === 2 ? "المذاكرة الثانية" : "مذاكرة شفهية";
                        setExamForm({
                          ...examForm,
                          quizNumber: num,
                          title: `${label} - ${s?.name || ""}`,
                        });
                      }}
                      className="w-full p-2 rounded-lg border border-amber-300 text-xs font-bold bg-white"
                    >
                      <option value={1}>المذاكرة الأولى (تحريرية)</option>
                      <option value={2}>المذاكرة الثانية (شاملة)</option>
                      <option value={3}>مذاكرة شفهية وإلقاء</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-amber-900 font-bold mb-1">وزن المذاكرة من المجموع</label>
                    <input
                      type="number"
                      value={examForm.weighting}
                      onChange={(e) => setExamForm({ ...examForm, weighting: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-amber-300 text-xs font-bold bg-white"
                      placeholder="مثال: 15%"
                    />
                  </div>
                </div>
              )}

              {selectedModalCategory === "exam" && (
                <div className="grid grid-cols-2 gap-3 bg-purple-50/60 p-3 rounded-xl border border-purple-200">
                  <div>
                    <label className="block text-purple-900 font-bold mb-1">نوع الامتحان الرسمي</label>
                    <select
                      value={examForm.type}
                      onChange={(e) => setExamForm({ ...examForm, type: e.target.value as Exam["type"] })}
                      className="w-full p-2 rounded-lg border border-purple-300 text-xs font-bold bg-white"
                    >
                      <option value="midterm">امتحان منتصف الفصل (نصفي)</option>
                      <option value="final">امتحان نهاية الفصل الدراسي (نهائي)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-900 font-bold mb-1">وزن الامتحان من المعدل</label>
                    <input
                      type="number"
                      value={examForm.weighting}
                      onChange={(e) => setExamForm({ ...examForm, weighting: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-purple-300 text-xs font-bold bg-white"
                      placeholder="مثال: 40%"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ الانعقاد</label>
                  <input
                    type="date"
                    required
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">من الساعة</label>
                  <input
                    type="time"
                    value={examForm.startTime}
                    onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">مدة الاختبار (دقيقة)</label>
                  <input
                    type="number"
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدرجة الكبرى</label>
                  <input
                    type="number"
                    value={examForm.maxScore}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        maxScore: Number(e.target.value),
                        passingScore: Math.round(Number(e.target.value) * 0.5),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">درجة النجاح</label>
                  <input
                    type="number"
                    value={examForm.passingScore}
                    onChange={(e) => setExamForm({ ...examForm, passingScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القاعة الامتحانية</label>
                  <input
                    type="text"
                    value={examForm.room}
                    onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  حفظ واعتماد الجدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SCORE STUDENT GRADE */}
      {/* ========================================================= */}
      {scoringStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              رصد درجة: {scoringStudent.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentExam?.title} (الدرجة القصوى: {currentExam?.maxMarks || currentExam?.maxScore || 100})
            </p>

            <form onSubmit={handleSaveStudentGrade} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الدرجة المحصلة للطالب</label>
                <input
                  type="number"
                  step="0.5"
                  max={currentExam?.maxMarks || currentExam?.maxScore || 100}
                  min={0}
                  required
                  value={scoringStudent.score}
                  onChange={(e) =>
                    setScoringStudent({ ...scoringStudent, score: Number(e.target.value) })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xl font-black text-indigo-700 text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  ملاحظات المعلم والتقييم النوعي
                </label>
                <textarea
                  rows={3}
                  value={scoringStudent.notes}
                  onChange={(e) =>
                    setScoringStudent({ ...scoringStudent, notes: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  placeholder="ملاحظات وتوجيهات للطالب وولي أمره..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScoringStudent(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  تأكيد وحفظ الدرجة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD ASSIGNMENT */}
      {/* ========================================================= */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">إضافة واجب مدرسي جديد</h3>
            <form onSubmit={handleSaveAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الواجب</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حل تمارين المعادلات ص 45"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الصف</label>
                  <select
                    value={assignmentForm.gradeId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, gradeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المادة</label>
                  <select
                    value={assignmentForm.subjectId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ الاستحقاق والتسليم</label>
                  <input
                    type="date"
                    required
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدرجة القصوى</label>
                  <input
                    type="number"
                    value={assignmentForm.maxPoints}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxPoints: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">تفاصيل وتوجيهات الواجب</label>
                <textarea
                  rows={3}
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  placeholder="اكتب التوجيهات الموجهة للطلاب..."
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  نشر التكليف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
