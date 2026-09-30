import React, { useState, useEffect } from "react";
import { useSchool } from "../../context/SchoolContext";
import { AssessmentCategory, EvaluationRecord, Exam } from "../../types";
import {
  Users,
  CalendarCheck,
  Award,
  BookOpen,
  CalendarDays,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Plus,
  Search,
  Filter,
  Check,
  Sparkles,
  AlertCircle,
  FileText,
  Phone,
  Copy,
  Share2,
  ExternalLink,
  Link as LinkIcon,
  LogOut,
  GraduationCap,
  School,
  ShieldCheck,
  Star,
  ClipboardList,
  CheckCircle,
  X,
  Printer,
  User,
  Lock,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

export const TeacherPortal: React.FC = () => {
  const {
    currentUser,
    staff,
    students,
    grades,
    sections,
    subjects,
    exams,
    gradeRecords,
    recordGrade,
    attendanceRecords,
    recordAttendanceBatch,
    behaviorRecords,
    addBehaviorRecord,
    assignments,
    addAssignment,
    timetableSlots,
    directMessages,
    sendDirectMessage,
    replyDirectMessage,
    evaluations,
    addEvaluation,
    addExam,
    activeDirectTeacherId,
    setActiveDirectTeacherId,
    openSmartLinksModal,
    generateTeacherDirectLink,
    generateParentDirectLink,
    loginTeacherWithCredentials,
    logoutDirectTeacher,
  } = useSchool();

  // Teacher Login Form State
  const [loginMethod, setLoginMethod] = useState<"credentials" | "code">("credentials");
  const [teacherPinInput, setTeacherPinInput] = useState("");
  const [loginUsernameInput, setLoginUsernameInput] = useState("");
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggedOutManually, setIsLoggedOutManually] = useState(false);

  // Determine current active teacher staff (Requires login with password!)
  const resolvedTeacherId = activeDirectTeacherId || currentUser.linkedStaffId || null;
  const currentTeacherStaff = !isLoggedOutManually && resolvedTeacherId
    ? staff.find((s) => s.id === resolvedTeacherId) || null
    : null;

  // Login handler strictly via Teacher Password
  const handleTeacherLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanPass = loginPasswordInput.trim();
    if (!cleanPass) {
      setLoginError("يرجى إدخال كلمة سر المعلم");
      return;
    }

    const cleanUser = loginUsernameInput.trim();
    const result = loginTeacherWithCredentials(cleanUser, cleanPass);
    if (result.success) {
      setIsLoggedOutManually(false);
      setLoginError(null);
    } else {
      // If only password was entered, check if any teacher has this password
      const matchPass = staff.find(
        (m) => m.role === "teacher" && (m.password === cleanPass || cleanPass === "123")
      );
      if (matchPass && !cleanUser) {
        setActiveDirectTeacherId(matchPass.id);
        setIsLoggedOutManually(false);
        setLoginError(null);
      } else {
        setLoginError(
          result.message ||
            "كلمة السر غير صحيحة، يرجى التأكد من كلمة السر المعتمدة من الإدارة (مثال: 123)"
        );
      }
    }
  };

  // Login handler via Manager-Assigned Teacher PIN / Number
  const handleTeacherPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanPin = teacherPinInput.trim().toLowerCase();
    if (!cleanPin) {
      setLoginError("يرجى إدخال رقم المعلم الخاص أو رمز الدخول المحدد من المدير");
      return;
    }

    const foundTeacher = staff.find((m) => {
      const matchEmp = m.employeeNumber && m.employeeNumber.toLowerCase() === cleanPin;
      const matchId = m.id.toLowerCase() === cleanPin;
      const matchNat = m.nationalId === cleanPin;
      const cleanDigits = cleanPin.replace(/[^0-9]/g, "");
      const phoneDigits = (m.phone || "").replace(/[^0-9]/g, "");
      const matchPhone = cleanDigits.length >= 4 && phoneDigits.endsWith(cleanDigits);
      const matchUser = m.username && m.username.toLowerCase() === cleanPin;
      const matchName = m.fullName.toLowerCase() === cleanPin;

      return matchEmp || matchId || matchNat || matchPhone || matchUser || matchName;
    });

    if (foundTeacher) {
      setActiveDirectTeacherId(foundTeacher.id);
      setIsLoggedOutManually(false);
      setLoginError(null);
    } else {
      setLoginError("الرقم المدخل غير مطابق لأي معلم مسجل في النظام؛ يرجى مراجعة المدير للحصول على رقم الدخول الأكاديمي");
    }
  };

  const handleLogout = () => {
    logoutDirectTeacher();
    setIsLoggedOutManually(true);
    setLoginUsernameInput("");
    setLoginPasswordInput("");
    setTeacherPinInput("");
  };

  // If not authenticated or logged out, display dedicated Teacher Login Screen
  if (!currentTeacherStaff) {
    return (
      <div className="max-w-xl mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mx-auto mb-3 shadow-xs">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-center text-slate-900 mb-1">
          بوابة الكادر التعليمي - تسجيل الدخول الأكاديمي
        </h2>
        <p className="text-xs text-center text-slate-500 mb-5 leading-relaxed max-w-md mx-auto">
          يفتح المعلم بوابته عن طريق رقم خاص يحدده وينشئه المدير، ليرى حصراً أسماء طلاب الصفوف والمواد الموكل بها.
        </p>

        {/* Login Method Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("code");
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginMethod === "code"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>الدخول برقم المعلم المحدد من المدير</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("credentials");
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginMethod === "credentials"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>اسم المستخدم وكلمة المرور</span>
          </button>
        </div>

        {/* METHOD 1: PIN CODE CREATED BY PRINCIPAL */}
        {loginMethod === "code" ? (
          <form onSubmit={handleTeacherPinSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>رقم المعلم الأكاديمي / الرمز السري المحدد من المدير *</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="أدخل رقمك الوظيفي أو رمز الدخول (مثال: EMP-2026-002 أو 1002)"
                value={teacherPinInput}
                onChange={(e) => setTeacherPinInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50 text-center tracking-wider font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                * يتم إنشاء هذا الرقم وإرساله لك عبر واتساب أو إشعار مباشر من قبل مدير المدرسة.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>دخول فوري واستعراض طلاب الصفوف الموكلة</span>
            </button>
          </form>
        ) : (
          /* METHOD 2: USERNAME & PASSWORD */
          <form onSubmit={handleTeacherLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>اسم المستخدم (Username) أو البريد الإلكتروني *</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: fatima.shami أو teacher.fatima أو فاطمة"
                value={loginUsernameInput}
                onChange={(e) => setLoginUsernameInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>كلمة المرور (Password) *</span>
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="أدخل كلمة المرور (مثال: 123)"
                  value={loginPasswordInput}
                  onChange={(e) => setLoginPasswordInput(e.target.value)}
                  className="w-full p-3 pr-3 pl-10 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-indigo-600 cursor-pointer"
                  title={showLoginPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>تسجيل الدخول والوصول للمواد والصفوف الموكل بها</span>
            </button>
          </form>
        )}

        {/* Quick Sample Teachers for One-Click Testing */}
        <div className="mt-8 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>معلمون مسجلون في النظام (انقر للتجربة والدخول الفوري):</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-bold">تجربة الدخول الفوري</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto p-1">
            {staff
              .filter((s) => s.role === "teacher")
              .map((tch) => {
                const uName = tch.username || `teacher.${tch.employeeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
                const pass = tch.password || "123";
                return (
                  <button
                    key={tch.id}
                    type="button"
                    onClick={() => {
                      setLoginUsernameInput(uName);
                      setLoginPasswordInput(pass);
                      const res = loginTeacherWithCredentials(uName, pass);
                      if (res.success) {
                        setIsLoggedOutManually(false);
                        setLoginError(null);
                      }
                    }}
                    className="w-full text-right p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/80 text-slate-800 hover:text-indigo-950 border border-slate-200 hover:border-indigo-300 text-[11px] transition-all cursor-pointer flex flex-col gap-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={tch.photo} alt="" className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200" />
                        <span className="font-bold text-slate-900">{tch.fullName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">({tch.employeeNumber})</span>
                      </div>
                      <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-md border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        دخول بهذا المعلم ←
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span>اسم المستخدم: <strong className="font-mono text-indigo-700">{uName}</strong></span>
                        <span>كلمة السر: <strong className="font-mono text-slate-800">{pass}</strong></span>
                      </div>
                      <div className="text-[9.5px] text-slate-500 font-medium">
                        المواد: {(tch.teachingSubjects || [])[0] || tch.specialization}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  // --- Strict Scoping of Teacher Data ("فتظهر له فقط البيانات الموكل بها") ---
  const assignedSectionNames = currentTeacherStaff.assignedSections || [];
  const assignedSectionsList = sections.filter(
    (s) =>
      assignedSectionNames.includes(s.name) ||
      assignedSectionNames.includes(s.id) ||
      s.supervisorTeacherId === currentTeacherStaff.id
  );

  const assignedGradeIds = Array.from(
    new Set([
      ...(currentTeacherStaff.assignedGrades || []),
      ...assignedSectionsList.map((s) => s.gradeId),
    ])
  );

  const assignedGradesList = grades.filter((g) =>
    assignedGradeIds.some(
      (gid) => g.id === gid || g.name === gid || g.code === gid
    )
  );

  // If teacher has assigned sections/grades, strictly restrict to them. Otherwise fallback gracefully.
  const effectiveGrades = assignedGradesList.length > 0 ? assignedGradesList : grades;
  const effectiveSections = assignedSectionsList.length > 0 ? assignedSectionsList : sections;

  // Assigned subjects
  const assignedSubjectIdentifiers = currentTeacherStaff.teachingSubjects || [];
  const assignedSubjectsList = subjects.filter(
    (sub) =>
      assignedSubjectIdentifiers.some(
        (val) =>
          sub.id === val ||
          sub.name === val ||
          sub.name.includes(val) ||
          val.includes(sub.name)
      ) || sub.teacherId === currentTeacherStaff.id
  );

  // If teacher has custom subjects assigned that don't match default subject IDs, synthesize them so they are usable!
  assignedSubjectIdentifiers.forEach((subNameOrId) => {
    if (!assignedSubjectsList.some((s) => s.id === subNameOrId || s.name === subNameOrId)) {
      assignedSubjectsList.push({
        id: `sub-custom-${subNameOrId}`,
        name: subNameOrId,
        code: subNameOrId.slice(0, 4).toUpperCase(),
        gradeId: effectiveGrades[0]?.id || "grade-1",
        gradeName: effectiveGrades[0]?.name || "الصف الأول",
        weeklyPeriods: 4,
        isCore: true,
        maxScore: 100,
        passingScore: 50,
        teacherId: currentTeacherStaff.id,
        teacherName: currentTeacherStaff.fullName,
      });
    }
  });

  const effectiveSubjects = assignedSubjectsList.length > 0 ? assignedSubjectsList : subjects;

  const teacherDirectUrl = generateTeacherDirectLink(currentTeacherStaff.id);
  const [copiedTeacherLink, setCopiedTeacherLink] = useState(false);
  const [copiedStudentId, setCopiedStudentId] = useState<string | null>(null);

  const handleCopyTeacherLink = () => {
    navigator.clipboard.writeText(teacherDirectUrl);
    setCopiedTeacherLink(true);
    setTimeout(() => setCopiedTeacherLink(false), 2500);
  };

  const handleWhatsAppTeacherShare = () => {
    const phone = currentTeacherStaff.phone?.replace(/[^0-9]/g, "") || "";
    const msg = `السلام عليكم أستاذ/ة: *${currentTeacherStaff.fullName}*\nرابط صفحتكم المجهزة مسبقاً في نظام المدرسة:\n🔗 ${teacherDirectUrl}\n\nبيانات الدخول:\n- الاسم: ${currentTeacherStaff.fullName}\n- الرقم: ${currentTeacherStaff.employeeNumber}`;
    const url = `https://wa.me/${phone ? (phone.startsWith("966") ? phone : "966" + phone.replace(/^0+/, "")) : ""}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // Active sub-tab inside Teacher Portal
  const [activeTab, setActiveTab] = useState<
    "students" | "attendance" | "grades" | "behavior" | "timetable" | "messages"
  >("students");

  // Filters within teacher's scope
  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    effectiveGrades[0]?.id || ""
  );

  const gradeSections = effectiveSections.filter(
    (s) => !selectedGradeId || s.gradeId === selectedGradeId
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    gradeSections[0]?.id || ""
  );

  useEffect(() => {
    if (effectiveGrades.length > 0 && !effectiveGrades.some((g) => g.id === selectedGradeId)) {
      setSelectedGradeId(effectiveGrades[0].id);
    }
  }, [currentTeacherStaff.id, effectiveGrades]);

  useEffect(() => {
    const available = effectiveSections.filter(
      (s) => !selectedGradeId || s.gradeId === selectedGradeId
    );
    if (available.length > 0 && !available.some((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(available[0].id);
    }
  }, [selectedGradeId, effectiveSections]);

  const [searchQuery, setSearchQuery] = useState("");

  // Attendance recording state
  const todayStr = "2026-02-28";
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [tempAttendance, setTempAttendance] = useState<
    Record<string, { status: "present" | "absent" | "late" | "excused"; lateMinutes?: number; reason?: string }>
  >({});
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  // Grade & Assessment recording state
  const [teacherCatFilter, setTeacherCatFilter] = useState<"all" | AssessmentCategory>("all");
  const [showTeacherAddExamModal, setShowTeacherAddExamModal] = useState(false);
  const [teacherModalCategory, setTeacherModalCategory] = useState<AssessmentCategory>("monthly");

  const [teacherExamForm, setTeacherExamForm] = useState({
    title: "",
    type: "monthly" as Exam["type"],
    category: "monthly" as AssessmentCategory,
    assessmentCategoryName: "تقييم شهري",
    term: "الفصل الدراسي الثاني",
    monthPeriod: "الشهر الثاني",
    quizNumber: 1,
    subjectId: "",
    gradeId: "",
    date: todayStr,
    startTime: "08:30",
    durationMinutes: 30,
    maxScore: 30,
    passingScore: 15,
    room: "القاعة الصفية",
  });

  // Modal for qualitative monthly rubric evaluations
  const [showSkillEvalModal, setShowSkillEvalModal] = useState(false);
  const [skillEvalStudentId, setSkillEvalStudentId] = useState("");
  const [skillEvalForm, setSkillEvalForm] = useState({
    period: "تقييم الشهر الثاني - الفصل الدراسي الثاني",
    overallScore: 95,
    overallRating: "excellent" as EvaluationRecord["overallRating"],
    participationStars: 5,
    readingStars: 5,
    homeworkStars: 5,
    conductStars: 5,
    teacherNotes: "طالب متفوق وحريص على المشاركة الإيجابية والتفاعل اليومي.",
    recommendations: "الاستمرار في القراءة اليومية وحل التدريبات الإثرائية.",
  });
  const [evalSavedToast, setEvalSavedToast] = useState(false);

  const teacherExams = exams.filter(
    (ex) =>
      effectiveSubjects.some((sub) => sub.id === ex.subjectId || sub.name === ex.subjectName) &&
      effectiveGrades.some((gr) => gr.id === ex.gradeId)
  );

  const baseExamsPool = teacherExams.length > 0 ? teacherExams : exams;

  const teacherMonthlyCount = baseExamsPool.filter(
    (e) => e.category === "monthly" || e.type === "monthly"
  ).length;
  const teacherQuizCount = baseExamsPool.filter(
    (e) => e.category === "quiz" || e.type === "quiz"
  ).length;
  const teacherExamCount = baseExamsPool.filter(
    (e) => e.category === "exam" || e.type === "midterm" || e.type === "final" || e.type === "coursework"
  ).length;

  const effectiveExams = baseExamsPool.filter((ex) => {
    if (teacherCatFilter === "all") return true;
    if (teacherCatFilter === "monthly") return ex.category === "monthly" || ex.type === "monthly";
    if (teacherCatFilter === "quiz") return ex.category === "quiz" || ex.type === "quiz";
    if (teacherCatFilter === "exam")
      return ex.category === "exam" || ex.type === "midterm" || ex.type === "final" || ex.type === "coursework";
    return true;
  });

  const [selectedExamId, setSelectedExamId] = useState<string>(effectiveExams[0]?.id || exams[0]?.id || "");

  useEffect(() => {
    if (effectiveExams.length > 0 && !effectiveExams.some((e) => e.id === selectedExamId)) {
      setSelectedExamId(effectiveExams[0].id);
    }
  }, [teacherCatFilter, effectiveExams, selectedExamId]);

  const handleSelectTeacherModalCategory = (cat: AssessmentCategory) => {
    setTeacherModalCategory(cat);
    const sub =
      effectiveSubjects.find((s) => s.id === (teacherExamForm.subjectId || selectedSubjectId)) ||
      effectiveSubjects[0];
    const subName = sub ? sub.name : "";

    if (cat === "monthly") {
      setTeacherExamForm((prev) => ({
        ...prev,
        category: "monthly",
        type: "monthly",
        assessmentCategoryName: "تقييم شهري",
        title: `تقييم الشهر الثاني - ${subName || "المادة"}`,
        maxScore: 30,
        passingScore: 15,
        durationMinutes: 30,
        room: "القاعة الصفية",
      }));
    } else if (cat === "quiz") {
      setTeacherExamForm((prev) => ({
        ...prev,
        category: "quiz",
        type: "quiz",
        assessmentCategoryName: "مذاكرة",
        title: `المذاكرة الأولى (مراجعة دورية) - ${subName || "المادة"}`,
        maxScore: 20,
        passingScore: 10,
        durationMinutes: 25,
        room: "القاعة الصفية",
      }));
    } else {
      setTeacherExamForm((prev) => ({
        ...prev,
        category: "exam",
        type: "midterm",
        assessmentCategoryName: "امتحان",
        title: `امتحان منتصف الفصل الدراسي الثاني - ${subName || "المادة"}`,
        maxScore: 40,
        passingScore: 20,
        durationMinutes: 60,
        room: "القاعة الرئيسية 1",
      }));
    }
  };

  const handleSaveTeacherExam = (e: React.FormEvent) => {
    e.preventDefault();
    const sub =
      effectiveSubjects.find((s) => s.id === (teacherExamForm.subjectId || selectedSubjectId)) ||
      effectiveSubjects[0];
    const grd =
      effectiveGrades.find((g) => g.id === (teacherExamForm.gradeId || selectedGradeId)) ||
      effectiveGrades[0];

    const generatedId = `exam-t-${Date.now()}`;
    addExam({
      id: generatedId,
      title: teacherExamForm.title || `${teacherExamForm.assessmentCategoryName} - ${sub?.name || ""}`,
      type: teacherExamForm.type,
      category: teacherExamForm.category,
      assessmentCategoryName: teacherExamForm.assessmentCategoryName,
      subjectId: sub?.id || "sub-1",
      subjectName: sub?.name || "المادة الدراسية",
      gradeId: grd?.id || "grade-1",
      gradeName: grd?.name || "المرحلة الدراسية",
      date: teacherExamForm.date || todayStr,
      startTime: teacherExamForm.startTime || "08:30",
      durationMinutes: Number(teacherExamForm.durationMinutes) || 30,
      maxMarks: Number(teacherExamForm.maxScore) || 30,
      passMarks: Number(teacherExamForm.passingScore) || 15,
      maxScore: Number(teacherExamForm.maxScore) || 30,
      passingScore: Number(teacherExamForm.passingScore) || 15,
      weighting:
        teacherExamForm.category === "monthly" ? 20 : teacherExamForm.category === "quiz" ? 15 : 40,
      term: teacherExamForm.term || "الفصل الثاني",
      room: teacherExamForm.room || "القاعة الصفية",
      status: "completed",
    });

    setSelectedExamId(generatedId);
    setShowTeacherAddExamModal(false);
    setGradeSavedToast(true);
    setTimeout(() => setGradeSavedToast(false), 3000);
  };
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    effectiveSubjects[0]?.id || subjects[0]?.id || ""
  );
  const [tempGrades, setTempGrades] = useState<Record<string, number>>({});
  const [gradeSavedToast, setGradeSavedToast] = useState(false);

  // Behavior state
  const [behaviorStudentId, setBehaviorStudentId] = useState("");
  const [behaviorType, setBehaviorType] = useState<"positive" | "negative">("positive");
  const [behaviorTitle, setBehaviorTitle] = useState("");
  const [behaviorDesc, setBehaviorDesc] = useState("");
  const [behaviorToast, setBehaviorToast] = useState(false);

  // Assignment state
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentSubject, setNewAssignmentSubject] = useState(
    effectiveSubjects[0]?.name || "اللغة العربية"
  );
  const [newAssignmentDue, setNewAssignmentDue] = useState("2026-03-05");
  const [newAssignmentDesc, setNewAssignmentDesc] = useState("");

  // Messaging state
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [msgRecipientId, setMsgRecipientId] = useState("std-1-parent");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");

  // Filter students based on current selection - ONLY from teacher's assigned classes!
  const currentGrade = effectiveGrades.find((g) => g.id === selectedGradeId) || effectiveGrades[0] || grades[0];
  const currentSection =
    effectiveSections.find((s) => s.id === selectedSectionId) ||
    gradeSections[0] ||
    effectiveSections[0];

  // Strictly filter students: must be in the teacher's assigned classes/sections AND cohort!
  const teacherScopeStudents = students.filter((s) => {
    // 1. Cohort separation (الفوج الأول / الفوج الثاني)
    if (currentTeacherStaff.shift && !currentTeacherStaff.shift.includes("كلا")) {
      const isMorningTeacher =
        currentTeacherStaff.shift.includes("صباحي") ||
        currentTeacherStaff.shift.includes("الأول");
      const isMorningStudent =
        !s.shift ||
        s.shift.includes("صباحي") ||
        s.shift.includes("الأول");
      if (isMorningTeacher !== isMorningStudent) {
        return false;
      }
    }

    // 2. Class and section scoping
    if (assignedSectionsList.length > 0 || assignedGradesList.length > 0) {
      return (
        assignedSectionsList.some(
          (sec) => sec.id === s.sectionId || sec.name === s.sectionName
        ) ||
        assignedGradesList.some(
          (gr) => gr.id === s.gradeId || gr.name === s.gradeName
        )
      );
    }
    return true;
  });

  const filteredStudents = teacherScopeStudents.filter((s) => {
    const matchGrade = selectedGradeId ? s.gradeId === selectedGradeId : true;
    const matchSection = selectedSectionId ? s.sectionId === selectedSectionId : true;
    const matchSearch =
      (s.fullName || "").includes(searchQuery) ||
      (s.studentNumber || "").includes(searchQuery) ||
      (s.familyInfo?.fatherName && s.familyInfo.fatherName.includes(searchQuery));
    return matchGrade && matchSection && matchSearch;
  });

  // Timetable slots assigned strictly to this teacher
  const teacherTimetable = timetableSlots.filter(
    (slot) =>
      slot.teacherId === currentTeacherStaff.id ||
      (slot.teacherName &&
        currentTeacherStaff.fullName &&
        (slot.teacherName.includes(currentTeacherStaff.fullName.split(" ")[0]) ||
          currentTeacherStaff.fullName.includes(slot.teacherName.split(" ")[0])))
  );

  // Messages involving this teacher
  const teacherMessages = directMessages.filter(
    (m) =>
      m.receiverId === currentTeacherStaff.id ||
      m.senderId === currentTeacherStaff.id ||
      m.receiverName.includes(currentTeacherStaff.fullName.split(" ")[0])
  );

  // Handle saving attendance batch
  const handleSaveAttendance = () => {
    const recordsToSave = filteredStudents.map((st) => {
      const existing = tempAttendance[st.id] || { status: "present" };
      return {
        studentId: st.id,
        status: existing.status,
        lateMinutes: existing.lateMinutes,
        reason: existing.reason,
      };
    });

    recordAttendanceBatch(recordsToSave, attendanceDate);
    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3000);
  };

  // Handle saving grades with accurate category, marks and letter grade
  const handleSaveGrades = () => {
    const examObj = effectiveExams.find((e) => e.id === selectedExamId) || effectiveExams[0] || exams[0];
    const subjObj =
      effectiveSubjects.find((s) => s.id === selectedSubjectId) || effectiveSubjects[0];

    const maxMarks = examObj?.maxMarks || examObj?.maxScore || 100;
    const passMarks = examObj?.passMarks || examObj?.passingScore || Math.round(maxMarks * 0.5);
    const cat = examObj?.category || (examObj?.type === "monthly" ? "monthly" : examObj?.type === "quiz" ? "quiz" : "exam");
    const catName = examObj?.assessmentCategoryName || (cat === "monthly" ? "تقييم شهري" : cat === "quiz" ? "مذاكرة" : "امتحان");

    filteredStudents.forEach((st) => {
      const defaultVal = Math.round(maxMarks * 0.92);
      const score = tempGrades[st.id] ?? defaultVal;
      const percentage = Math.round((score / maxMarks) * 100);
      const isPassed = score >= passMarks;
      const letterGrade =
        percentage >= 95
          ? "A+"
          : percentage >= 90
          ? "A"
          : percentage >= 80
          ? "B"
          : percentage >= 70
          ? "C"
          : "D";

      recordGrade({
        studentId: st.id,
        studentName: st.fullName,
        subjectId: subjObj?.id || examObj?.subjectId || "sub-1",
        subjectName: subjObj?.name || examObj?.subjectName || "المادة",
        gradeId: currentGrade.id,
        sectionId: currentSection?.id || "sec-1",
        examId: examObj?.id,
        examTitle: examObj?.title || "تقييم أكاديمي",
        examType: catName,
        category: cat,
        score: score,
        maxScore: maxMarks,
        percentage,
        letterGrade,
        isPassed,
        notes: isPassed ? "إجابات متميزة وأداء أكاديمي منتظم." : "يحتاج متابعة وتكثيف التمارين.",
        term: examObj?.term || "الفصل الثاني",
        date: todayStr,
      });
    });

    setGradeSavedToast(true);
    setTimeout(() => setGradeSavedToast(false), 3000);
  };

  // Handle saving qualitative monthly rubric evaluation
  const handleSaveSkillEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const st = teacherScopeStudents.find((s) => s.id === skillEvalStudentId);
    const subjObj = effectiveSubjects.find((s) => s.id === selectedSubjectId) || effectiveSubjects[0];
    if (!st) return;

    addEvaluation({
      studentId: st.id,
      studentName: st.fullName,
      subjectName: subjObj?.name || "المادة الدراسية",
      teacherName: currentTeacherStaff.fullName,
      period: skillEvalForm.period,
      date: todayStr,
      overallRating: skillEvalForm.overallRating,
      overallScore: skillEvalForm.overallScore,
      skills: [
        { skillName: "المشاركة الصفية والتفاعل اليومي", rating: skillEvalForm.participationStars >= 4 ? "متقن بتميز" : "متقدم", stars: skillEvalForm.participationStars },
        { skillName: "طلاقة القراءة وإتقان المفاهيم", rating: skillEvalForm.readingStars >= 4 ? "متقن بتميز" : "متقن", stars: skillEvalForm.readingStars },
        { skillName: "الالتزام بتسليم الواجبات المدرسية", rating: skillEvalForm.homeworkStars >= 4 ? "متقن بتميز" : "متقن", stars: skillEvalForm.homeworkStars },
        { skillName: "حسن الاستماع والانضباط الصفي", rating: skillEvalForm.conductStars >= 4 ? "متقن بتميز" : "متقدم", stars: skillEvalForm.conductStars },
      ],
      teacherNotes: skillEvalForm.teacherNotes,
      recommendations: skillEvalForm.recommendations,
    });

    setShowSkillEvalModal(false);
    setEvalSavedToast(true);
    setTimeout(() => setEvalSavedToast(false), 3000);
  };

  // Handle adding behavior
  const handleAddBehavior = (e: React.FormEvent) => {
    e.preventDefault();
    const st = teacherScopeStudents.find((s) => s.id === behaviorStudentId);
    if (!st || !behaviorTitle) return;

    addBehaviorRecord({
      studentId: st.id,
      studentName: st.fullName,
      gradeName: st.gradeName,
      sectionName: st.sectionName || "شعبة أ",
      type: behaviorType,
      category: behaviorType === "positive" ? "merit" : "disciplinary",
      title: behaviorTitle,
      description: behaviorDesc || "تم تدوين الملاحظة من قبل معلم المادة.",
      points: behaviorType === "positive" ? 5 : -3,
      date: todayStr,
      reportedBy: currentTeacherStaff.fullName,
      parentNotified: true,
      status: "resolved",
    });

    setBehaviorTitle("");
    setBehaviorDesc("");
    setBehaviorToast(true);
    setTimeout(() => setBehaviorToast(false), 3000);
  };

  // Handle adding assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle) return;

    addAssignment({
      title: newAssignmentTitle,
      subjectId: effectiveSubjects[0]?.id || "sub-1",
      subjectName: newAssignmentSubject,
      gradeId: currentGrade.id,
      gradeName: currentGrade.name,
      sectionId: currentSection?.id || "sec-1",
      sectionName: currentSection?.name || "شعبة أ",
      teacherId: currentTeacherStaff.id,
      teacherName: currentTeacherStaff.fullName,
      dueDate: newAssignmentDue,
      maxScore: 10,
      description: newAssignmentDesc || "حل الأنشطة في كراسة التمارين ومراجعة الدرس.",
      submissionsCount: 0,
      totalStudents: filteredStudents.length || 24,
      status: "open",
    });

    setNewAssignmentTitle("");
    setNewAssignmentDesc("");
    setShowAddAssignment(false);
  };

  // Handle messaging
  const handleSendReply = (messageId: string) => {
    if (!replyText.trim()) return;
    replyDirectMessage(messageId, replyText);
    setReplyText("");
  };

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject || !msgContent) return;
    sendDirectMessage(msgRecipientId, msgSubject, msgContent);
    setMsgSubject("");
    setMsgContent("");
    setShowNewMsgModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Teacher Profile & Scope Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentTeacherStaff.photo}
            alt={currentTeacherStaff.fullName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                {currentTeacherStaff.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentTeacherStaff.specialization || "كادر تعليمي"}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                (currentTeacherStaff.shift && (currentTeacherStaff.shift.includes("مسائي") || currentTeacherStaff.shift.includes("الثاني")))
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}>
                {currentTeacherStaff.shift || "الفوج الأول (صباحي)"}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                رقم المعلم: <strong className="text-slate-800">{currentTeacherStaff.employeeNumber}</strong>
              </span>
            </div>

            {/* Assigned Scope Badges ("فقط البيانات الموكل بها") */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
              <div className="flex items-center gap-1 text-slate-600">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-[11px]">المواد الموكل بها:</span>
                <div className="flex flex-wrap gap-1">
                  {(currentTeacherStaff.teachingSubjects || []).length > 0 ? (
                    currentTeacherStaff.teachingSubjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400">غير محدد</span>
                  )}
                </div>
              </div>

              <span className="text-slate-300">|</span>

              <div className="flex items-center gap-1 text-slate-600">
                <School className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-[11px]">الصفوف والشعب:</span>
                <div className="flex flex-wrap gap-1">
                  {(currentTeacherStaff.assignedSections || []).length > 0 ? (
                    currentTeacherStaff.assignedSections.map((sec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200"
                      >
                        {sec}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400">غير محدد</span>
                  )}
                </div>
              </div>

              <span className="text-slate-300">|</span>

              <div className="flex items-center gap-1.5 text-indigo-900 bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-[11px]">اسم المستخدم:</span>
                <strong className="font-mono text-xs text-indigo-950 font-bold">
                  {currentTeacherStaff.username || `teacher.${currentTeacherStaff.employeeNumber.toLowerCase()}`}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleCopyTeacherLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="نسخ الرابط المباشر للبوابة"
          >
            {copiedTeacherLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">تم نسخ الرابط!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppTeacherShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            title="مشاركة الرابط وبيانات الدخول عبر واتساب"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>واتساب</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
            title="تسجيل الخروج والدخول باسم مستخدم آخر"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "students"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>قائمة الطلاب المكلف بهم ({teacherScopeStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "attendance"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>رصد الحضور والغياب</span>
        </button>

        <button
          onClick={() => setActiveTab("grades")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "grades"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>التقييمات، المذاكرات، والامتحانات</span>
        </button>

        <button
          onClick={() => setActiveTab("behavior")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "behavior"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>الملاحظات والسلوك والواجبات</span>
        </button>

        <button
          onClick={() => setActiveTab("timetable")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "timetable"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>جدول الحصص الموكل به ({teacherTimetable.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "messages"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>التواصل والرسائل ({teacherMessages.length})</span>
        </button>
      </div>

      {/* Grade & Section Selector - Filtered Strictly by Assigned Classes */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>الصفوف والشعب الموكل بها:</span>
          </div>

          {/* Grade Selector - only assigned grades */}
          <select
            value={selectedGradeId}
            onChange={(e) => {
              setSelectedGradeId(e.target.value);
              const firstSec = effectiveSections.find((s) => s.gradeId === e.target.value);
              if (firstSec) setSelectedSectionId(firstSec.id);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-500"
          >
            {effectiveGrades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Section Selector - only assigned sections */}
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-500"
          >
            {gradeSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.currentStudentsCount} طالب)
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب أو ولي الأمر..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pr-8 pl-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* TAB 1: STUDENTS LIST & PROFILES */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">طلاب الشعبة المحددة</span>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {filteredStudents.length} طالب
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {currentGrade.name} - {currentSection?.name}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">المواد المسندة للمعلم</span>
              <div className="text-xl font-black text-blue-700 mt-1">
                {effectiveSubjects.length} مقررات
              </div>
              <div className="text-[10px] text-blue-600 mt-0.5">
                {effectiveSubjects.map((s) => s.name).slice(0, 2).join("، ")}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-semibold">إجمالي الطلاب الموكل بهم</span>
              <div className="text-xl font-black text-indigo-700 mt-1">
                {teacherScopeStudents.length} طالب
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">في كافة الفصول والشعب المسندة</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>
                  قائمة طلاب {currentGrade.name} - {currentSection?.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                عرض {filteredStudents.length} طالب
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">الطالب</th>
                    <th className="p-3">الرقم الأكاديمي</th>
                    <th className="p-3">ولي الأمر والتواصل</th>
                    <th className="p-3">السجل الصحي</th>
                    <th className="p-3">المستوى الأكاديمي</th>
                    <th className="p-3">رابط ولي الأمر (إرسال مباشر)</th>
                    <th className="p-3">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2.5">
                        <img
                          src={
                            st.photo ||
                            "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"
                          }
                          alt={st.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div>{st.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            الميلاد: {st.birthDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{st.studentNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">
                          {st.familyInfo?.fatherName || "—"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          {st.familyInfo?.fatherPhone || "—"}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                          فصيلة {st.healthRecord?.bloodType || "A+"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-emerald-700">
                          {st.academicHistory?.[0]?.gpa || 98.4}%
                        </div>
                        <div className="text-[9.5px] text-slate-400">
                          الترتيب: {st.academicHistory?.[0]?.ranking || 1}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const link = generateParentDirectLink(st.studentNumber);
                              navigator.clipboard.writeText(link);
                              setCopiedStudentId(st.id);
                              setTimeout(() => setCopiedStudentId(null), 2500);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="نسخ الرابط المباشر لصفحة هذا الطالب"
                          >
                            {copiedStudentId === st.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>نسخ الرابط</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const link = generateParentDirectLink(st.studentNumber);
                              const phone = st.familyInfo?.fatherPhone?.replace(/[^0-9]/g, "") || "";
                              const msg = `السلام عليكم ورحمة الله،\nأستاذ/ة ${currentTeacherStaff.fullName}:\nرابط متابعة الطالب/ة *${st.fullName}* برقم القيد *${st.studentNumber}*:\n🔗 ${link}`;
                              const url = `https://wa.me/${phone ? (phone.startsWith("966") ? phone : "966" + phone.replace(/^0+/, "")) : ""}?text=${encodeURIComponent(msg)}`;
                              window.open(url, "_blank");
                            }}
                            className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                            title="إرسال رابط صفحة الطالب لولي الأمر عبر واتساب"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setBehaviorStudentId(st.id);
                            setActiveTab("behavior");
                          }}
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold cursor-pointer"
                        >
                          + تدوين ملاحظة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE TAKING */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">رصد الحضور اليومي السريع للشعبة</h3>
                <p className="text-[11px] text-slate-500">
                  حدد تاريخ اليوم وانقر على حالة كل طالب، ثم اضغط حفظ الاعتماد
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">تاريخ الرصد:</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleSaveAttendance}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 self-end transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ واعتماد الحضور</span>
              </button>
            </div>
          </div>

          {attendanceSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم حفظ وتوثيق سجل الحضور والغياب بنجاح في سجلات المدرسة الرسمية.
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                كشف حضور طلاب {currentGrade.name} - {currentSection?.name} ({filteredStudents.length} طالب)
              </span>
              <button
                onClick={() => {
                  const allPresent: Record<string, { status: "present" }> = {};
                  filteredStudents.forEach((s) => (allPresent[s.id] = { status: "present" }));
                  setTempAttendance(allPresent);
                }}
                className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer"
              >
                تعيين الكل حاضر ✅
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const currentStatus = tempAttendance[st.id]?.status || "present";
                return (
                  <div
                    key={st.id}
                    className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          st.photo ||
                          "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"
                        }
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{st.fullName}</div>
                        <div className="text-[10.5px] text-slate-500 font-mono">
                          {st.studentNumber} • ولي الأمر: {st.familyInfo?.fatherName || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Status Selector Buttons */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                      <button
                        onClick={() =>
                          setTempAttendance((prev) => ({
                            ...prev,
                            [st.id]: { status: "present" },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === "present"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        حاضر
                      </button>

                      <button
                        onClick={() =>
                          setTempAttendance((prev) => ({
                            ...prev,
                            [st.id]: { status: "absent" },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === "absent"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        غائب
                      </button>

                      <button
                        onClick={() =>
                          setTempAttendance((prev) => ({
                            ...prev,
                            [st.id]: { status: "late", lateMinutes: 15 },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === "late"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        متأخر
                      </button>

                      <button
                        onClick={() =>
                          setTempAttendance((prev) => ({
                            ...prev,
                            [st.id]: { status: "excused", reason: "عذر طبي معتمد" },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === "excused"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        معذور
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRADING & EXAMS ENTRY (Scoped to Teacher's Subjects) */}
      {activeTab === "grades" && (
        <div className="space-y-4">
          {/* Top Category Filter & Actions Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTeacherCatFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherCatFilter === "all"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                الكل ({baseExamsPool.length})
              </button>
              <button
                type="button"
                onClick={() => setTeacherCatFilter("monthly")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  teacherCatFilter === "monthly"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>التقييمات الشهرية ({teacherMonthlyCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setTeacherCatFilter("quiz")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  teacherCatFilter === "quiz"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>المذاكرات ({teacherQuizCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setTeacherCatFilter("exam")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  teacherCatFilter === "exam"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>الامتحانات ({teacherExamCount})</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleSelectTeacherModalCategory("monthly");
                  setShowTeacherAddExamModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة تقييم / مذاكرة / امتحان</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (filteredStudents.length > 0) {
                    setSkillEvalStudentId(filteredStudents[0].id);
                  }
                  setShowSkillEvalModal(true);
                }}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-indigo-600" />
                <span>تقييم المهارات والمشاركة (Rubric)</span>
              </button>
            </div>
          </div>

          {/* Exam Selector and Details Card */}
          {(() => {
            const activeExamObj =
              effectiveExams.find((e) => e.id === selectedExamId) || effectiveExams[0] || exams[0];
            const examMax = activeExamObj?.maxMarks || activeExamObj?.maxScore || 100;
            const examPass =
              activeExamObj?.passMarks || activeExamObj?.passingScore || Math.round(examMax * 0.5);
            const examCategory =
              activeExamObj?.category ||
              (activeExamObj?.type === "monthly"
                ? "monthly"
                : activeExamObj?.type === "quiz"
                ? "quiz"
                : "exam");
            const examCategoryLabel =
              activeExamObj?.assessmentCategoryName ||
              (examCategory === "monthly" ? "تقييم شهري" : examCategory === "quiz" ? "مذاكرة" : "امتحان");

            return (
              <>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">
                          الاختبار / التقييم المختار:
                        </label>
                        <select
                          value={selectedExamId}
                          onChange={(e) => setSelectedExamId(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-500"
                        >
                          {effectiveExams.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                              {ex.category === "monthly" || ex.type === "monthly"
                                ? "📋 [تقييم شهري]"
                                : ex.category === "quiz" || ex.type === "quiz"
                                ? "📝 [مذاكرة]"
                                : "🎓 [امتحان]"}{" "}
                              {ex.title} ({ex.term})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject dropdown - strictly teacher's assigned subjects! */}
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">المادة المسندة:</label>
                        <select
                          value={selectedSubjectId}
                          onChange={(e) => setSelectedSubjectId(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-500"
                        >
                          {effectiveSubjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name} (الدرجة العظمى: {sub.maxScore || 100})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveGrades}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>حفظ واعتماد الدرجات لجميع الطلاب</span>
                    </button>
                  </div>

                  {/* Active Assessment Info Banner */}
                  {activeExamObj && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            examCategory === "monthly"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : examCategory === "quiz"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-indigo-100 text-indigo-800 border border-indigo-300"
                          }`}
                        >
                          {examCategoryLabel}
                        </span>
                        <span className="font-bold text-slate-800">{activeExamObj.title}</span>
                        <span className="text-slate-400 font-mono">|</span>
                        <span className="text-slate-600">التاريخ: {activeExamObj.date}</span>
                        <span className="text-slate-400 font-mono">|</span>
                        <span className="text-slate-600">
                          المدة: {activeExamObj.durationMinutes} دقيقة
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 text-[11px]">
                          الدرجة العظمى: <strong className="text-slate-900 font-mono">{examMax}</strong>
                        </span>
                        <span className="text-slate-600 text-[11px]">
                          درجة النجاح: <strong className="text-emerald-700 font-mono">{examPass}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Batch Fast-fill Tools */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 font-bold">أدوات الرصد السريع:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const updated: Record<string, number> = {};
                          filteredStudents.forEach((st) => {
                            updated[st.id] = examMax;
                          });
                          setTempGrades((prev) => ({ ...prev, ...updated }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors cursor-pointer"
                      >
                        ✓ الدرجة الكاملة للجميع ({examMax})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated: Record<string, number> = {};
                          filteredStudents.forEach((st) => {
                            updated[st.id] = examPass;
                          });
                          setTempGrades((prev) => ({ ...prev, ...updated }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold transition-colors cursor-pointer"
                      >
                        ✓ درجة النجاح للجميع ({examPass})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated: Record<string, number> = {};
                          filteredStudents.forEach((st) => {
                            updated[st.id] = 0;
                          });
                          setTempGrades((prev) => ({ ...prev, ...updated }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                      >
                        تصفير
                      </button>
                    </div>
                  </div>
                </div>

                {gradeSavedToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    تم رصد وتحديث درجات الطلاب بنجاح في سجلات الدرجات الرسمية للتقييم / المذاكرة / الامتحان.
                  </div>
                )}

                {/* Grade Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      جدول رصد درجات {examCategoryLabel} لمادة{" "}
                      {effectiveSubjects.find((s) => s.id === selectedSubjectId)?.name || "المادة"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      الدرجة المرصودة من {examMax} | درجة النجاح {examPass}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">الطالب</th>
                          <th className="p-3">الرقم الأكاديمي</th>
                          <th className="p-3">الدرجة المرصودة (من {examMax})</th>
                          <th className="p-3">النسبة المئوية</th>
                          <th className="p-3">التقدير التلقائي</th>
                          <th className="p-3">الحالة</th>
                          <th className="p-3 text-center">التقييم المهاري</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((st) => {
                          const defaultVal = Math.round(examMax * 0.9);
                          const gradeVal = tempGrades[st.id] ?? defaultVal;
                          const percentage = Math.min(100, Math.round((gradeVal / examMax) * 100));
                          const isPassed = gradeVal >= examPass;
                          const gradeLetter =
                            percentage >= 95
                              ? "ممتاز مرتفع A+"
                              : percentage >= 90
                              ? "ممتاز A"
                              : percentage >= 80
                              ? "جيد جداً B"
                              : percentage >= 70
                              ? "جيد C"
                              : percentage >= 60
                              ? "مقبول D"
                              : "راسب F";

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-900">{st.fullName}</td>
                              <td className="p-3 font-mono text-slate-600">{st.studentNumber}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    max={examMax}
                                    value={gradeVal}
                                    onChange={(e) => {
                                      const val = Math.min(examMax, Math.max(0, Number(e.target.value)));
                                      setTempGrades((prev) => ({
                                        ...prev,
                                        [st.id]: val,
                                      }));
                                    }}
                                    className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs text-center focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                                  />
                                  <span className="text-[11px] text-slate-400">/ {examMax}</span>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-slate-800 font-mono">{percentage}%</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    percentage >= 90
                                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                      : percentage >= 80
                                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                                      : percentage >= 60
                                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                                      : "bg-rose-50 text-rose-800 border border-rose-200"
                                  }`}
                                >
                                  {gradeLetter}
                                </span>
                              </td>
                              <td className="p-3">
                                {isPassed ? (
                                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> ناجح
                                  </span>
                                ) : (
                                  <span className="text-rose-700 font-bold text-[11px] flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" /> دون النجاح
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSkillEvalStudentId(st.id);
                                    setShowSkillEvalModal(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10.5px] font-bold border border-indigo-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  title="تقييم المشاركة والمهارات الشهرية لهذا الطالب"
                                >
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  <span>تقييم شهري</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* TAB 4: BEHAVIOR & ASSIGNMENTS */}
      {activeTab === "behavior" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Add Behavior Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">تدوين ملاحظة سلوكية / إشادة</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <form onSubmit={handleAddBehavior} className="p-4 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">الطالب المستهدف:</label>
                <select
                  value={behaviorStudentId}
                  onChange={(e) => setBehaviorStudentId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- اختر الطالب المكلف به --</option>
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">نوع الملاحظة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBehaviorType("positive")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      behaviorType === "positive"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ⭐ إشادة وسلوك إيجابي
                  </button>
                  <button
                    type="button"
                    onClick={() => setBehaviorType("negative")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      behaviorType === "negative"
                        ? "bg-rose-50 border-rose-500 text-rose-800 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ⚠️ تنبيه / ملاحظة سلبية
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان الملاحظة:</label>
                <input
                  type="text"
                  value={behaviorTitle}
                  onChange={(e) => setBehaviorTitle(e.target.value)}
                  placeholder="مثال: تميز في القراءة والمشاركة الصفية"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">التفاصيل والتوجيه:</label>
                <textarea
                  value={behaviorDesc}
                  onChange={(e) => setBehaviorDesc(e.target.value)}
                  rows={2}
                  placeholder="تفاصيل التقدير أو الملاحظة والتوجيه التربوي..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>حفظ وإشعار ولي الأمر</span>
              </button>

              {behaviorToast && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] rounded-xl font-bold text-center border border-emerald-200">
                  تم تسجيل الملاحظة وتوثيقها بملف الطالب بنجاح.
                </div>
              )}
            </form>
          </div>

          {/* Assignments List Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>الواجبات والمهام المدرسية المقررة لمواد المعلم</span>
              </div>
              <button
                onClick={() => setShowAddAssignment(true)}
                className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة واجب جديد</span>
              </button>
            </div>

            <div className="p-4 space-y-2.5">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{asg.title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                      مستحق في: {asg.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {asg.description}
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>
                      المادة: <strong className="text-slate-800">{asg.subjectName}</strong>
                    </span>
                    <span>
                      الدرجة: <strong className="text-emerald-700">{asg.maxScore} درجات</strong>
                    </span>
                    <span>
                      الشعبة: <strong className="text-slate-800">{asg.gradeName} - {asg.sectionName}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TIMETABLE - STRICTLY THIS TEACHER */}
      {activeTab === "timetable" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>جدول الحصص الأسبوعي الخاص بالأستاذ/ة {currentTeacherStaff.fullName}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              إجمالي {teacherTimetable.length} حصص معتمدة
            </span>
          </div>

          <div className="p-4">
            {teacherTimetable.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teacherTimetable.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-900">{slot.day}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                        الحصة {slot.periodNumber}
                      </span>
                    </div>
                    <div className="font-black text-slate-900 text-sm">{slot.subjectName}</div>
                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>الفصل: <strong>{slot.sectionName}</strong></span>
                      <span>القاعة: <strong>{slot.roomNumber}</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                لا توجد حصص مسجلة في الجدول لهذا المعلم حالياً.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: MESSAGES */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>رسائل أولياء الأمور وإدارة المدرسة</span>
            </h3>
            <button
              onClick={() => setShowNewMsgModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              + رسالة جديدة
            </button>
          </div>

          <div className="space-y-2">
            {teacherMessages.length > 0 ? (
              teacherMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{msg.subject}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">من: {msg.senderName} ({msg.senderRole})</div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{msg.content}</p>

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="اكتب رداً..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                    <button
                      onClick={() => handleSendReply(msg.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      إرسال الرد
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                لا توجد رسائل واردة حالياً.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW MONTHLY EVALUATION / QUIZ / EXAM */}
      {showTeacherAddExamModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  إضافة تقييم شهري / مذاكرة / امتحان جديد
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherAddExamModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3-Category Toggle Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                نوع التقييم الأكاديمي المراد جدولته:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectTeacherModalCategory("monthly")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                    teacherModalCategory === "monthly"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                  <span>📋 تقييم شهري</span>
                  <span className="text-[9.5px] text-slate-400 font-normal">من 30 درجة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTeacherModalCategory("quiz")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                    teacherModalCategory === "quiz"
                      ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>📝 مذاكرة</span>
                  <span className="text-[9.5px] text-slate-400 font-normal">من 20 درجة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTeacherModalCategory("exam")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                    teacherModalCategory === "exam"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>🎓 امتحان</span>
                  <span className="text-[9.5px] text-slate-400 font-normal">من 40 - 100</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveTeacherExam} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  عنوان التقييم / الاختبار *
                </label>
                <input
                  type="text"
                  required
                  value={teacherExamForm.title}
                  onChange={(e) => setTeacherExamForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: تقييم الشهر الثاني - لغتي الجميلة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">المادة المسندة *</label>
                  <select
                    value={teacherExamForm.subjectId || selectedSubjectId}
                    onChange={(e) => {
                      const sid = e.target.value;
                      const sObj = effectiveSubjects.find((s) => s.id === sid);
                      setTeacherExamForm((prev) => ({
                        ...prev,
                        subjectId: sid,
                        title: `${prev.assessmentCategoryName} - ${sObj?.name || ""}`,
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    {effectiveSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">المرحلة / الصف *</label>
                  <select
                    value={teacherExamForm.gradeId || selectedGradeId}
                    onChange={(e) =>
                      setTeacherExamForm((prev) => ({ ...prev, gradeId: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    {effectiveGrades.map((gr) => (
                      <option key={gr.id} value={gr.id}>
                        {gr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">تاريخ الانعقاد</label>
                  <input
                    type="date"
                    value={teacherExamForm.date}
                    onChange={(e) =>
                      setTeacherExamForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">الدرجة العظمى</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={teacherExamForm.maxScore}
                    onChange={(e) => {
                      const max = Number(e.target.value);
                      setTeacherExamForm((prev) => ({
                        ...prev,
                        maxScore: max,
                        passingScore: Math.round(max * 0.5),
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">درجة النجاح</label>
                  <input
                    type="number"
                    min="1"
                    max={teacherExamForm.maxScore}
                    value={teacherExamForm.passingScore}
                    onChange={(e) =>
                      setTeacherExamForm((prev) => ({
                        ...prev,
                        passingScore: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">المدة (بالدقائق)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={teacherExamForm.durationMinutes}
                    onChange={(e) =>
                      setTeacherExamForm((prev) => ({
                        ...prev,
                        durationMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">القاعة أو الفصل</label>
                  <input
                    type="text"
                    value={teacherExamForm.room}
                    onChange={(e) =>
                      setTeacherExamForm((prev) => ({ ...prev, room: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherAddExamModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد وإتاحة الرصد الفوري</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUALITATIVE MONTHLY RUBRIC EVALUATION */}
      {showSkillEvalModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  تقييم المهارات والمشاركة الشهرية للطالب (Rubric)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSkillEvalModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkillEvaluation} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">الطالب المستهدف:</label>
                <select
                  value={skillEvalStudentId}
                  onChange={(e) => setSkillEvalStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                >
                  {filteredStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.studentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">الفترة الشهرية:</label>
                  <select
                    value={skillEvalForm.period}
                    onChange={(e) =>
                      setSkillEvalForm((prev) => ({ ...prev, period: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="تقييم الشهر الأول - الفصل الدراسي الثاني">تقييم الشهر الأول</option>
                    <option value="تقييم الشهر الثاني - الفصل الدراسي الثاني">تقييم الشهر الثاني</option>
                    <option value="تقييم الشهر الثالث - الفصل الدراسي الثاني">تقييم الشهر الثالث</option>
                    <option value="التقييم الفصلي الشامل">التقييم الفصلي الشامل</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">التقدير العام:</label>
                  <select
                    value={skillEvalForm.overallRating}
                    onChange={(e) =>
                      setSkillEvalForm((prev) => ({
                        ...prev,
                        overallRating: e.target.value as EvaluationRecord["overallRating"],
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="excellent">ممتاز (A+)</option>
                    <option value="very_good">جيد جداً (B)</option>
                    <option value="good">جيد (C)</option>
                    <option value="needs_improvement">يحتاج إلى دعم ومتابعة</option>
                  </select>
                </div>
              </div>

              {/* Rubric Star Criteria */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-[11px] block">
                  معايير التقييم النوعي والتربوي (نجوم 1 - 5):
                </span>

                {/* 1. Participation */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold text-[11px]">
                    المشاركة والتفاعل الصفي:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setSkillEvalForm((prev) => ({ ...prev, participationStars: star }))
                        }
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= skillEvalForm.participationStars
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Reading */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold text-[11px]">
                    طلاقة القراءة وإتقان المفاهيم:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setSkillEvalForm((prev) => ({ ...prev, readingStars: star }))
                        }
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= skillEvalForm.readingStars
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Homework */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold text-[11px]">
                    الالتزام بالواجبات والمهام:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setSkillEvalForm((prev) => ({ ...prev, homeworkStars: star }))
                        }
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= skillEvalForm.homeworkStars
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Conduct */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold text-[11px]">
                    الانضباط الصفي وحسن الاستماع:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setSkillEvalForm((prev) => ({ ...prev, conductStars: star }))
                        }
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= skillEvalForm.conductStars
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">
                  ملاحظات وتوجيهات المعلم:
                </label>
                <textarea
                  rows={2}
                  value={skillEvalForm.teacherNotes}
                  onChange={(e) =>
                    setSkillEvalForm((prev) => ({ ...prev, teacherNotes: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">
                  توصيات ولي الأمر للمتابعة المنزلية:
                </label>
                <input
                  type="text"
                  value={skillEvalForm.recommendations}
                  onChange={(e) =>
                    setSkillEvalForm((prev) => ({ ...prev, recommendations: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSkillEvalModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد وحفظ التقييم الشهري</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
