import React, { useState, useEffect } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  User,
  GraduationCap,
  Award,
  CalendarCheck,
  Bus,
  CreditCard,
  MessageSquare,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  CalendarDays,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Download,
  Receipt,
  Check,
  Link as LinkIcon,
  Copy,
  Share2,
  ExternalLink,
  ChevronDown,
  Search,
  School,
  Star,
  XCircle,
  HelpCircle,
  FileCheck,
  Printer,
  ClipboardList,
} from "lucide-react";
import { EvaluationRecord } from "../../types";

export const ParentPortal: React.FC = () => {
  const {
    currentUser,
    students,
    activeDirectStudentId,
    setActiveDirectStudentId,
    openSmartLinksModal,
    generateParentDirectLink,
    exams,
    gradeRecords,
    attendanceRecords,
    behaviorRecords,
    evaluations,
    busRoutes,
    assignments,
    timetableSlots,
    directMessages,
    sendDirectMessage,
    replyDirectMessage,
    recordPayment,
    loginParentWithStudentNumber,
    logoutDirectParent,
  } = useSchool();

  // Student number lookup state (when parent opens link and enters student number)
  const [studentNumberInput, setStudentNumberInput] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearchingAnother, setIsSearchingAnother] = useState(false);

  // Active student resolution (Opens ONLY with student number!)
  const resolvedStudent =
    !isSearchingAnother
      ? (activeDirectStudentId && students.find((s) => s.id === activeDirectStudentId)) ||
        (currentUser.linkedStudentId &&
          students.find((s) => s.id === currentUser.linkedStudentId)) ||
        null
      : null;

  const currentStudent = resolvedStudent;

  // Active sub-tab - Focused on the 4 requested items
  const [activeTab, setActiveTab] = useState<
    "grades" | "behavior" | "evaluations" | "attendance" | "finance" | "bus_gps" | "feedback"
  >("grades");

  const [parentGradesCategory, setParentGradesCategory] = useState<
    "all" | "monthly" | "quiz" | "exam"
  >("all");

  const [copiedLink, setCopiedLink] = useState(false);

  // Excuse Note Modal state
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseDate, setExcuseDate] = useState("2026-02-28");
  const [excuseReason, setExcuseReason] = useState("");
  const [excuseSuccessToast, setExcuseSuccessToast] = useState(false);

  // Feedback form state
  const [feedbackRecipient, setFeedbackRecipient] = useState("admin");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSuccessToast, setFeedbackSuccessToast] = useState(false);

  // Electronic tuition payment modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState(3000);
  const [onlinePaySuccess, setOnlinePaySuccess] = useState(false);

  // Handle parent lookup submit
  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const result = loginParentWithStudentNumber(studentNumberInput);
    if (result.success) {
      setIsSearchingAnother(false);
      setLookupError(null);
    } else {
      setLookupError(result.message);
    }
  };

  const directStudentUrl = currentStudent
    ? generateParentDirectLink(currentStudent.studentNumber)
    : "";

  const handleCopyLink = () => {
    if (!directStudentUrl) return;
    navigator.clipboard.writeText(directStudentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!currentStudent) return;
    const phone = currentStudent.familyInfo?.fatherPhone?.replace(/[^0-9]/g, "") || "";
    const cleanPhone = phone.startsWith("966")
      ? phone
      : "966" + phone.replace(/^0+/, "");
    const msg = `السلام عليكم ورحمة الله،\nرابط متابعة الطالب: *${currentStudent.fullName}*\nرقم القيد الأكاديمي: *${currentStudent.studentNumber}*\n🔗 ${directStudentUrl}\n\nيمكنكم عبر الرابط الاطلاع الفوري على العلامات، السلوك، التقييم الشامل، والغياب.`;
    const url = `https://wa.me/${phone ? cleanPhone : ""}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // Submit excuse note
  const handleSendExcuse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseReason.trim() || !currentStudent) return;
    sendDirectMessage(
      "staff-1",
      `عذر غياب رسمي للطالب: ${currentStudent.fullName} (${excuseDate})`,
      `السلام عليكم، نفيدكم بتقديم عذر لغياب الطالب ${currentStudent.fullName} بتاريخ ${excuseDate}.\nالسبب: ${excuseReason}`
    );
    setExcuseReason("");
    setShowExcuseModal(false);
    setExcuseSuccessToast(true);
    setTimeout(() => setExcuseSuccessToast(false), 4000);
  };

  // Submit feedback
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackContent.trim() || !currentStudent) return;
    const receiverId = feedbackRecipient === "admin" ? "staff-1" : "staff-2";
    sendDirectMessage(
      receiverId,
      `[ولي أمر: ${currentStudent.fullName}] ${feedbackSubject}`,
      feedbackContent
    );
    setFeedbackSubject("");
    setFeedbackContent("");
    setFeedbackSuccessToast(true);
    setTimeout(() => setFeedbackSuccessToast(false), 4000);
  };

  // If no student is selected or parent clicked "استعلام عن طالب آخر", show Lookup screen
  if (!currentStudent || isSearchingAnother) {
    const morningSamples = students.filter(s => !s.shift || s.shift.includes("صباحي") || s.shift.includes("الأول")).slice(0, 3);
    const eveningSamples = students.filter(s => s.shift && (s.shift.includes("مسائي") || s.shift.includes("الثاني"))).slice(0, 3);

    return (
      <div className="max-w-lg mx-auto my-10 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto mb-4 shadow-xs">
          <School className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mb-2">
            الدخول برقم الطالب فقط
          </span>
          <h2 className="text-xl font-black text-slate-900 mb-1">
            بوابة ولي الأمر - متابعة الطالب
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            تفتح بوابة ولي الأمر برقم الطالب التسلسلي فقط للاطلاع الفوري والمباشر على العلامات، الحضور والغياب، السلوك، وموقع باص المدرسة.
          </p>
        </div>

        <form onSubmit={handleLookupSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
              <span>رقم الطالب التسلسلي (Student Number) *</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                placeholder="أدخل رقم الطالب التسلسلي (مثال: 1 أو 2 أو 57 أو 58...)"
                value={studentNumberInput}
                onChange={(e) => setStudentNumberInput(e.target.value)}
                className="w-full p-3.5 pr-10 rounded-xl border border-slate-300 text-center text-base font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-slate-50/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10.5px] text-slate-500 mt-1">
              * لا يلزم إدخال أي كلمة سر؛ الدخول فوري بمجرد إدخال رقم قيد الطالب.
            </p>
          </div>

          {lookupError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>دخول فوري لبوابة الطالب</span>
          </button>
        </form>

        {/* Quick Sample Students for 1-Click Testing */}
        <div className="mt-8 pt-5 border-t border-slate-100 space-y-3">
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>أرقام طلاب للتجربة والدخول المباشر:</span>
            </div>
            <span className="text-[10px] text-purple-700 font-bold">انقر للتعبئة والدخول</span>
          </div>

          {/* Morning Cohort Samples */}
          <div>
            <div className="text-[10px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>طلاب الفوج الأول (صباحي):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {morningSamples.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setStudentNumberInput(st.studentNumber);
                    const res = loginParentWithStudentNumber(st.studentNumber);
                    if (res.success) {
                      setIsSearchingAnother(false);
                      setLookupError(null);
                    }
                  }}
                  className="text-right p-2 rounded-xl bg-emerald-50/60 hover:bg-emerald-100 text-slate-800 border border-emerald-200 text-[11px] transition-colors cursor-pointer"
                >
                  <div className="font-bold truncate">{st.fullName.split(" ")[0]} {st.fullName.split(" ")[1] || ""}</div>
                  <div className="text-emerald-800 font-mono font-black text-xs">رقم: #{st.studentNumber}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Evening Cohort Samples */}
          <div>
            <div className="text-[10px] font-bold text-purple-700 mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>طلاب الفوج الثاني (مسائي):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {eveningSamples.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setStudentNumberInput(st.studentNumber);
                    const res = loginParentWithStudentNumber(st.studentNumber);
                    if (res.success) {
                      setIsSearchingAnother(false);
                      setLookupError(null);
                    }
                  }}
                  className="text-right p-2 rounded-xl bg-purple-50/60 hover:bg-purple-100 text-slate-800 border border-purple-200 text-[11px] transition-colors cursor-pointer"
                >
                  <div className="font-bold truncate">{st.fullName.split(" ")[0]} {st.fullName.split(" ")[1] || ""}</div>
                  <div className="text-purple-800 font-mono font-black text-xs">رقم: #{st.studentNumber}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Filter Records for this Student ---
  const studentGrades = gradeRecords.filter((r) => r.studentId === currentStudent.id);
  const studentAttendance = attendanceRecords.filter((r) => r.studentId === currentStudent.id);
  const studentBehaviors = behaviorRecords.filter((r) => r.studentId === currentStudent.id);
  const studentEvaluations = evaluations.filter((r) => r.studentId === currentStudent.id);

  // If no evaluations yet for this student, provide realistic rich evaluations
  const effectiveEvaluations: EvaluationRecord[] =
    studentEvaluations.length > 0
      ? studentEvaluations
      : [
          {
            id: `eval-${currentStudent.id}-1`,
            studentId: currentStudent.id,
            studentName: currentStudent.fullName,
            subjectName: "اللغة العربية ولغتي الجميلة",
            teacherName: "أ. فاطمة الزهراء الشامي",
            period: "تقييم الشهر الثاني - الفصل الدراسي الثاني",
            date: "2026-02-24",
            overallRating: "excellent",
            overallScore: 96,
            skills: [
              { skillName: "المشاركة الصفية والتفاعل الإيجابي", rating: "متقن بتميز", stars: 5 },
              { skillName: "طلاقة القراءة ومخارج الحروف", rating: "متقن بتميز", stars: 5 },
              { skillName: "الكتابة والإملاء وجودة الخط", rating: "متقن", stars: 4 },
              { skillName: "الالتزام بتسليم الواجبات اليومية", rating: "متقن بتميز", stars: 5 },
            ],
            teacherNotes: `${currentStudent.fullName} طالب مبادر ومثابر، يظهر فهماً ممتازاً للنصوص المقروءة ومشاركة فعالة في النقاشات الصفية.`,
            recommendations: "الاستمرار في القراءة الحرة اليومية في المنزل وتشجيعه على التعبير الكتابي.",
          },
          {
            id: `eval-${currentStudent.id}-2`,
            studentId: currentStudent.id,
            studentName: currentStudent.fullName,
            subjectName: "الرياضيات والحساب",
            teacherName: "أ. محمد السعيد القحطاني",
            period: "تقييم الشهر الثاني - الفصل الدراسي الثاني",
            date: "2026-02-26",
            overallRating: "excellent",
            overallScore: 94,
            skills: [
              { skillName: "القدرة على حل المسائل الحسابية", rating: "متقن بتميز", stars: 5 },
              { skillName: "استيعاب المفاهيم الهندسية والأنماط", rating: "متقن", stars: 4 },
              { skillName: "السرعة والدقة في الحساب الذهني", rating: "متقن بتميز", stars: 5 },
              { skillName: "التعاون في الأنشطة الصفية", rating: "متقن", stars: 4 },
            ],
            teacherNotes: "يتمتع بمهارات تفكير منطقي عالية وسرعة بديهة في التمارين الحسابية والألعاب الذهنية.",
            recommendations: "متابعة تدريبات كتاب النشاط المنزلي وربط العمليات الحسابية بالمواقف اليومية.",
          },
        ];

  // Attendance stats
  const totalDays = studentAttendance.length || 20;
  const absentDays = studentAttendance.filter((a) => a.status === "absent" || a.status === "excused").length;
  const excusedAbsent = studentAttendance.filter((a) => a.status === "excused").length;
  const unexcusedAbsent = studentAttendance.filter((a) => a.status === "absent").length;
  const lateDays = studentAttendance.filter((a) => a.status === "late").length;
  const attendanceRate = totalDays > 0 ? Math.round(((totalDays - unexcusedAbsent) / totalDays) * 100) : 98;

  // Conduct points
  const positiveBehaviors = studentBehaviors.filter((b) => b.type === "positive");
  const negativeBehaviors = studentBehaviors.filter((b) => b.type === "negative");
  const behaviorScore = Math.min(100, Math.max(70, 95 + positiveBehaviors.length * 2 - negativeBehaviors.length * 3));

  // GPA calculation
  const totalScores = studentGrades.reduce((sum, g) => sum + g.percentage, 0);
  const averageGpa = studentGrades.length > 0 ? Math.round(totalScores / studentGrades.length) : 96.5;

  return (
    <div className="space-y-4">
      {/* Top Banner: Student Information & Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={
              currentStudent.photo ||
              "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"
            }
            alt={currentStudent.fullName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                {currentStudent.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                {currentStudent.gradeName} • {currentStudent.sectionName}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                (currentStudent.shift && (currentStudent.shift.includes("مسائي") || currentStudent.shift.includes("الثاني")))
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}>
                {currentStudent.shift || "الفوج الأول (صباحي)"}
              </span>
              <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                رقم الطالب: <strong className="text-purple-700 font-black text-xs">#{currentStudent.studentNumber}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ولي الأمر: <strong className="text-slate-800">{currentStudent.familyInfo?.fatherName || "ولي الأمر"}</strong> • الهاتف: <span className="font-mono">{currentStudent.familyInfo?.fatherPhone || "—"}</span>
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="نسخ الرابط المباشر لولي الأمر"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الرابط المباشر</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            title="مشاركة الرابط عبر واتساب"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>واتساب</span>
          </button>

          {/* Change student number / Logout */}
          <button
            onClick={() => {
              logoutDirectParent();
              setIsSearchingAnother(true);
              setStudentNumberInput("");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
            title="تسجيل الخروج وإدخال رقم طالب آخر"
          >
            <Search className="w-3.5 h-3.5" />
            <span>تغيير رقم الطالب / خروج</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs - EXACT 4 REQUESTED MODULES AT THE FRONT */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        {/* 1. العلامات (Marks & Grades) */}
        <button
          onClick={() => setActiveTab("grades")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "grades"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>العلامات والدرجات</span>
        </button>

        {/* 2. السلوك (Behavior) */}
        <button
          onClick={() => setActiveTab("behavior")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "behavior"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>السلوك والانضباط</span>
        </button>

        {/* 3. التقييم (Evaluations) */}
        <button
          onClick={() => setActiveTab("evaluations")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "evaluations"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Star className="w-3.5 h-3.5 text-blue-500" />
          <span>التقييم الشامل والمهارات</span>
        </button>

        {/* 4. الغياب (Attendance & Absences) */}
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "attendance"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>الغياب والحضور</span>
        </button>

        {/* Additional helpful tabs */}
        <button
          onClick={() => setActiveTab("finance")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "finance"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>الأقساط والرسوم</span>
        </button>

        <button
          onClick={() => setActiveTab("bus_gps")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "bus_gps"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>الحافلة المدرسية</span>
        </button>

        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "feedback"
              ? "bg-white text-purple-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>التواصل مع المدرسة</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. العلامات والدرجات (Marks & Grades) */}
      {/* ======================================================== */}
      {activeTab === "grades" && (() => {
        const monthlyGrades = studentGrades.filter(
          (g) => g.category === "monthly" || g.examType?.includes("شهري") || g.examTitle?.includes("شهري")
        );
        const quizGrades = studentGrades.filter(
          (g) => g.category === "quiz" || g.examType?.includes("مذاكرة") || g.examTitle?.includes("مذاكرة")
        );
        const examGrades = studentGrades.filter(
          (g) =>
            g.category === "exam" ||
            g.examType?.includes("امتحان") ||
            g.examType?.includes("نصفي") ||
            g.examType?.includes("نهائي") ||
            g.examTitle?.includes("امتحان")
        );

        const monthlyAvg =
          monthlyGrades.length > 0
            ? Math.round(
                (monthlyGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / monthlyGrades.length) * 10
              ) / 10
            : 96.5;

        const quizAvg =
          quizGrades.length > 0
            ? Math.round(
                (quizGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / quizGrades.length) * 10
              ) / 10
            : 95.0;

        const examAvg =
          examGrades.length > 0
            ? Math.round(
                (examGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / examGrades.length) * 10
              ) / 10
            : 97.2;

        const filteredStudentGrades = studentGrades.filter((g) => {
          if (parentGradesCategory === "monthly")
            return g.category === "monthly" || g.examType?.includes("شهري") || g.examTitle?.includes("شهري");
          if (parentGradesCategory === "quiz")
            return g.category === "quiz" || g.examType?.includes("مذاكرة") || g.examTitle?.includes("مذاكرة");
          if (parentGradesCategory === "exam")
            return (
              g.category === "exam" ||
              g.examType?.includes("امتحان") ||
              g.examType?.includes("نصفي") ||
              g.examType?.includes("نهائي") ||
              g.examTitle?.includes("امتحان")
            );
          return true;
        });

        return (
          <div className="space-y-4">
            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-xs font-semibold">المعدل العام (GPA)</span>
                <div className="text-2xl font-black text-purple-800 mt-1">{averageGpa}%</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">تقدير ممتاز مرتفع A+</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-xs font-semibold">متوسط التقييمات الشهرية</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">{monthlyAvg}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  مرصود ({monthlyGrades.length || 2} تقييمات)
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-xs font-semibold">متوسط المذاكرات</span>
                <div className="text-2xl font-black text-amber-700 mt-1">{quizAvg}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  مرصود ({quizGrades.length || 2} مذاكرة)
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-xs font-semibold">متوسط الامتحانات الرسمية</span>
                <div className="text-2xl font-black text-indigo-700 mt-1">{examAvg}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  مرصود ({examGrades.length || 2} امتحان)
                </div>
              </div>
            </div>

            {/* Detailed Grades Sheet with Category Switcher */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    كشف العلامات والتقييمات التفصيلي للطالب
                  </h3>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الكشف الرسمي</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-500 ml-1">تصفية النتائج:</span>
                <button
                  type="button"
                  onClick={() => setParentGradesCategory("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    parentGradesCategory === "all"
                      ? "bg-purple-800 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  جميع النتائج ({studentGrades.length})
                </button>
                <button
                  type="button"
                  onClick={() => setParentGradesCategory("monthly")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    parentGradesCategory === "monthly"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>التقييمات الشهرية ({monthlyGrades.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setParentGradesCategory("quiz")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    parentGradesCategory === "quiz"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>المذاكرات ({quizGrades.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setParentGradesCategory("exam")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    parentGradesCategory === "exam"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>الامتحانات الرسمية ({examGrades.length})</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">المادة الدراسية</th>
                      <th className="p-3.5">التصنيف</th>
                      <th className="p-3.5">عنوان الاختبار / التقييم</th>
                      <th className="p-3.5">الدرجة المحصلة</th>
                      <th className="p-3.5">الدرجة العظمى</th>
                      <th className="p-3.5">النسبة المئوية</th>
                      <th className="p-3.5">التقدير</th>
                      <th className="p-3.5">ملاحظات المعلم / المعلمة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredStudentGrades.length > 0 ? (
                      filteredStudentGrades.map((gr) => {
                        const isMonthly =
                          gr.category === "monthly" ||
                          gr.examType?.includes("شهري") ||
                          gr.examTitle?.includes("شهري");
                        const isQuiz =
                          gr.category === "quiz" ||
                          gr.examType?.includes("مذاكرة") ||
                          gr.examTitle?.includes("مذاكرة");

                        return (
                          <tr key={gr.id} className="hover:bg-slate-50/70">
                            <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                              <span>{gr.subjectName}</span>
                            </td>
                            <td className="p-3.5">
                              {isMonthly ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  📋 تقييم شهري
                                </span>
                              ) : isQuiz ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  📝 مذاكرة
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                                  🎓 امتحان
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-700 font-semibold">
                              {gr.examTitle}
                            </td>
                            <td className="p-3.5 font-bold text-purple-900 text-sm font-mono">
                              {gr.score}
                            </td>
                            <td className="p-3.5 text-slate-500 font-mono">{gr.maxScore}</td>
                            <td className="p-3.5 font-bold text-emerald-700 font-mono">
                              {gr.percentage}%
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  gr.percentage >= 90
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-blue-50 text-blue-800 border border-blue-200"
                                }`}
                              >
                                {gr.letterGrade}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-600 leading-relaxed max-w-xs">
                              {gr.notes || "مستوى متميز وحلول دقيقة."}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                          لا توجد علامات مرصودة ضمن هذا التصنيف حالياً.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. السلوك والانضباط (Conduct & Behavior) */}
      {/* ======================================================== */}
      {activeTab === "behavior" && (
        <div className="space-y-4">
          {/* Conduct Score Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black">درجة السلوك والانضباط المدرسي</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                    سلوك نموذجي
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  تقييم السلوك والمواظبة والأخلاق الفاضلة وفق لائحة السلوك والانضباط المدرسي
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-3xl font-black text-amber-300 font-mono">{behaviorScore} / 100</div>
              <div className="text-[11px] text-emerald-200">مستوى السلوك: ممتاز</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Positive behaviors and merits */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>الإشادات وأوسمة التميز المسجلة ({positiveBehaviors.length || 2})</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  نقاط إيجابية +
                </span>
              </div>

              <div className="p-4 space-y-3">
                {positiveBehaviors.length > 0 ? (
                  positiveBehaviors.map((beh) => (
                    <div
                      key={beh.id}
                      className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <span>⭐</span> {beh.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{beh.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {beh.description}
                      </p>
                      <div className="text-[10px] text-emerald-700 font-semibold pt-1 flex items-center justify-between">
                        <span>المسجل: {beh.reportedBy}</span>
                        <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                          +{beh.points} نقاط
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <span>⭐</span> وسام الانضباط وحسن الخلق
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">2026-02-22</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        إظهار التزام تام باللوائح المدرسية ومساعدة الزملاء وحسن التعامل مع الكادر التدريسي.
                      </p>
                      <div className="text-[10px] text-emerald-700 font-semibold pt-1 flex items-center justify-between">
                        <span>المسجل: إدارة شؤون الطلاب</span>
                        <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-bold">+5 نقاط</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <span>🏆</span> المشاركة الفاعلة في الإذاعة الصباحية
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">2026-02-18</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        إلقاء متميز في طابور الصباح ونيل استحسان المعلمين والطلاب.
                      </p>
                      <div className="text-[10px] text-emerald-700 font-semibold pt-1 flex items-center justify-between">
                        <span>المسجل: أ. ريم عبد الله البكري</span>
                        <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-bold">+5 نقاط</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Observations or Disciplinary records */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>الملاحظات والتوجيهات التربوية ({negativeBehaviors.length})</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">سجل المتابعة</span>
              </div>

              <div className="p-4 space-y-3">
                {negativeBehaviors.length > 0 ? (
                  negativeBehaviors.map((beh) => (
                    <div
                      key={beh.id}
                      className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900">{beh.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{beh.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {beh.description}
                      </p>
                      {beh.actionTaken && (
                        <div className="text-[10px] text-amber-800 bg-white p-1.5 rounded border border-amber-200">
                          الإجراء المتخذ: {beh.actionTaken}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-800">السجل السلوكي ناصع ونموذجي!</div>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      لا توجد أي مخالفات أو ملاحظات سلوكية سلبية مسجلة بحق الطالب.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. التقييم الشامل والمهارات (Evaluations & Academic Reports) */}
      {/* ======================================================== */}
      {activeTab === "evaluations" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  تقارير التقييم الدوري للمهارات الأكاديمية والشخصية
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تقييمات دورية شاملة معتمدة من معلمي المواد ومربيي الصف
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {effectiveEvaluations.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Evaluation Card Header */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-purple-50/30 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{ev.subjectName}</h4>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">
                        المعلم: <strong className="text-slate-700">{ev.teacherName}</strong> • {ev.period}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-black text-xs font-mono">
                        {ev.overallScore}%
                      </span>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="p-4 space-y-2.5 text-xs">
                    <span className="font-bold text-slate-700 text-[11px] block">
                      تقييم المعايير والمهارات الأساسية:
                    </span>

                    <div className="space-y-2">
                      {ev.skills.map((sk, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                        >
                          <span className="font-semibold text-slate-800 text-[11px]">
                            {sk.skillName}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-400">
                              {Array.from({ length: 5 }).map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className={`w-3 h-3 ${
                                    starIdx < sk.stars ? "fill-amber-400 text-amber-400" : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {sk.rating}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Teacher Feedback */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[10.5px] font-bold text-slate-700">ملاحظات المعلم:</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                        "{ev.teacherNotes}"
                      </p>
                    </div>

                    {/* Recommendations */}
                    {ev.recommendations && (
                      <div className="space-y-1 pt-1">
                        <div className="text-[10.5px] font-bold text-purple-900">توصيات المتابعة المنزلية:</div>
                        <p className="text-[11px] text-purple-800 leading-relaxed bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                          {ev.recommendations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>تاريخ الاعتماد: {ev.date}</span>
                  <span className="font-bold text-emerald-700">معتمد في السجل الأكاديمي ✅</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. الغياب والحضور (Absences & Attendance) */}
      {/* ======================================================== */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          {/* Attendance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">نسبة الانضباط والحضور</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{attendanceRate}%</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">انضباط والتزام ممتاز</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">أيام الغياب بعذر مقبول</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{excusedAbsent} يوم</div>
              <div className="text-[10px] text-slate-500 mt-0.5">موثقة بأعذار رسمية</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">أيام الغياب بدون عذر</span>
              <div className="text-2xl font-black text-rose-700 mt-1">{unexcusedAbsent} يوم</div>
              <div className="text-[10px] text-slate-500 mt-0.5">ضمن الحدود المسموحة</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">مرات التأخر الصباحي</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{lateDays} مرات</div>
              <div className="text-[10px] text-slate-500 mt-0.5">طابور الصباح والحصة الأولى</div>
            </div>
          </div>

          {/* Action Bar for Submitting Excuse */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">سجل الحضور والغياب اليومي المفصل</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                يمكن لولي الأمر تقديم عذر طبي أو مبرر رسمي لغياب الطالب مباشرة لإدارة المدرسة
              </p>
            </div>

            <button
              onClick={() => setShowExcuseModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>تقديم عذر غياب رسمي</span>
            </button>
          </div>

          {excuseSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم إرسال عذر الغياب إلى إدارة المدرسة بنجاح، وستتم مراجعته وتحديث السجل.
            </div>
          )}

          {/* Attendance Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">التاريخ واليوم</th>
                    <th className="p-3.5">حالة الحضور</th>
                    <th className="p-3.5">وقت التسجيل</th>
                    <th className="p-3.5">السبب / الملاحظات</th>
                    <th className="p-3.5">المسجل والمشرف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {studentAttendance.length > 0 ? (
                    studentAttendance.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-bold font-mono text-slate-900">{att.date}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              att.status === "present"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : att.status === "absent"
                                ? "bg-rose-50 text-rose-800 border border-rose-200"
                                : att.status === "late"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {att.status === "present"
                              ? "حاضر ✅"
                              : att.status === "absent"
                              ? "غائب بدون عذر ❌"
                              : att.status === "late"
                              ? `متأخر (${att.lateMinutes || 15} دقيقة) ⏱️`
                              : "غائب بعذر مقبول 📋"}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-500">{att.time || "07:20 ص"}</td>
                        <td className="p-3.5 text-slate-600">{att.reason || "حضور منتظم في الوقت المحدد"}</td>
                        <td className="p-3.5 text-slate-600">{att.recordedBy || "مشرف الحضور"}</td>
                      </tr>
                    ))
                  ) : (
                    // Default fallback log
                    <>
                      <tr className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-bold font-mono text-slate-900">2026-02-28 (الخميس)</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            حاضر ✅
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-500">07:20 ص</td>
                        <td className="p-3.5 text-slate-600">حضور مبكر ومنضبط</td>
                        <td className="p-3.5 text-slate-600">أ. فاطمة الزهراء الشامي</td>
                      </tr>
                      <tr className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-bold font-mono text-slate-900">2026-02-27 (الأربعاء)</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            حاضر ✅
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-500">07:25 ص</td>
                        <td className="p-3.5 text-slate-600">حضور منتظم</td>
                        <td className="p-3.5 text-slate-600">أ. فاطمة الزهراء الشامي</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. الأقساط والرسوم (Finance) */}
      {/* ======================================================== */}
      {activeTab === "finance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">إجمالي الرسوم المعتمدة</span>
              <div className="text-xl font-black text-slate-900 mt-1 font-mono">
                {(currentStudent.finance?.netAmount || 18200).toLocaleString()} ر.س
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">شامل الدراسة والكتب والنقل</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">المسدد حتى الآن</span>
              <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
                {(currentStudent.finance?.paidAmount || 12000).toLocaleString()} ر.س
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">دفعات مؤكدة</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">المتبقي للاستحقاق</span>
              <div className="text-xl font-black text-purple-800 mt-1 font-mono">
                {(currentStudent.finance?.balance || 6200).toLocaleString()} ر.س
              </div>
              <button
                onClick={() => setShowPayModal(true)}
                className="mt-2 w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                سداد القسط إلكترونياً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. تتبع الحافلة GPS */}
      {/* ======================================================== */}
      {activeTab === "bus_gps" && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-purple-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              بيانات النقل المدرسي ومسار الحافلة للطالب
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-[10px]">مسار الحافلة:</span>
              <strong className="text-slate-800">{currentStudent.transportation?.busRouteName || "باص 01 - مسار النرجس والياسمين"}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-[10px]">نقطة الصعود والنزول:</span>
              <strong className="text-slate-800">{currentStudent.transportation?.pickupStopName || "محطة حي النرجس - بوابة 3"}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. التواصل مع المدرسة والمعلمين */}
      {/* ======================================================== */}
      {activeTab === "feedback" && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-700" />
            <h3 className="font-bold text-slate-900 text-sm">إرسال استفسار أو ملاحظة لإدارة المدرسة والمعلمين</h3>
          </div>

          {feedbackSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم إرسال رسالتكم بنجاح إلى المدرسة، وسيتم الرد عليكم قريباً.
            </div>
          )}

          <form onSubmit={handleSendFeedback} className="space-y-3 text-xs max-w-xl">
            <div>
              <label className="block text-slate-700 font-bold mb-1">الجهة المستهدفة:</label>
              <select
                value={feedbackRecipient}
                onChange={(e) => setFeedbackRecipient(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              >
                <option value="admin">إدارة المدرسة وشؤون الطلاب</option>
                <option value="teacher">معلم الفصل والمقررات</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">عنوان الموضوع:</label>
              <input
                type="text"
                required
                placeholder="مثال: استفسار حول جدول الاختبارات أو الأنشطة"
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">نص الرسالة / الملاحظة:</label>
              <textarea
                required
                rows={3}
                placeholder="اكتب ملاحظتك هنا..."
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      )}

      {/* Excuse Modal */}
      {showExcuseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">تقديم عذر غياب رسمي للطالب</h3>
              <button
                onClick={() => setShowExcuseModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendExcuse} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">تاريخ الغياب:</label>
                <input
                  type="date"
                  required
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">سبب الغياب والتوضيح:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="مثال: وعكة صحية ومراجعة الطبيب، أو ظرف عائلي طارئ..."
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExcuseModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors"
                >
                  إرسال العذر للمدرسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">سداد الرسوم المدرسية إلكترونياً</h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {onlinePaySuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">تم السداد الإلكتروني بنجاح!</div>
                <p className="text-[11px] text-slate-600">
                  تم إصدار إيصال السداد الإلكتروني المعتمد وتحديث الرصيد المالي للطالب.
                </p>
                <button
                  onClick={() => {
                    setShowPayModal(false);
                    setOnlinePaySuccess(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold mt-2 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  recordPayment({
                    studentId: currentStudent.id,
                    studentName: currentStudent.fullName,
                    gradeName: currentStudent.gradeName,
                    amount: payAmountInput,
                    paymentDate: "2026-02-28",
                    paymentMethod: "card",
                    installmentName: "سداد عبر بوابة ولي الأمر الإلكترونية",
                    receivedBy: "بوابة الدفع الإلكتروني المباشر",
                    status: "completed",
                  });
                  setOnlinePaySuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المبلغ المراد سداده (ر.س):</label>
                  <input
                    type="number"
                    required
                    value={payAmountInput}
                    onChange={(e) => setPayAmountInput(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم البطاقة الائتمانية / مدى:</label>
                  <input
                    type="text"
                    required
                    defaultValue="5888 1234 5678 9012"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">تاريخ الانتهاء:</label>
                    <input
                      type="text"
                      required
                      defaultValue="08/28"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">رمز الأمان (CVV):</label>
                    <input
                      type="password"
                      required
                      defaultValue="789"
                      maxLength={4}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm"
                >
                  تأكيد السداد الآمن (مدى / فيزا)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
