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

  // Teacher Login Form State (when teacher opens link and enters name and number)
  const [loginNameInput, setLoginNameInput] = useState("");
  const [loginNumberInput, setLoginNumberInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggedOutManually, setIsLoggedOutManually] = useState(false);

  // Determine current active teacher staff
  const resolvedTeacherId = activeDirectTeacherId || currentUser.linkedStaffId || null;
  const currentTeacherStaff = !isLoggedOutManually
    ? staff.find((s) => s.id === resolvedTeacherId) ||
      (resolvedTeacherId ? null : staff.find((s) => s.role === "teacher") || staff[1])
    : null;

  // Login handler
  const handleTeacherLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = loginTeacherWithCredentials(loginNameInput, loginNumberInput);
    if (result.success) {
      setIsLoggedOutManually(false);
      setLoginError(null);
    } else {
      setLoginError(result.message);
    }
  };

  const handleLogout = () => {
    logoutDirectTeacher();
    setIsLoggedOutManually(true);
    setLoginNameInput("");
    setLoginNumberInput("");
  };

  // If not authenticated or logged out, display dedicated Teacher Verification Screen
  if (!currentTeacherStaff) {
    return (
      <div className="max-w-lg mx-auto my-10 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mx-auto mb-4 shadow-xs">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-center text-slate-900 mb-1">
          بوابة الكادر التعليمي - الدخول الأكاديمي
        </h2>
        <p className="text-xs text-center text-slate-500 mb-6 leading-relaxed">
          فضلاً أدخل اسمك ورقمك الوظيفي أو رقم الجوال المعتمد؛ ستظهر لك في البوابة فقط المواد والصفوف الموكل بها.
        </p>

        <form onSubmit={handleTeacherLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">اسم المعلم *</label>
            <input
              type="text"
              required
              placeholder="مثال: أ. فاطمة الزهراء الشامي"
              value={loginNameInput}
              onChange={(e) => setLoginNameInput(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              رقم المعلم الوظيفي أو رقم الجوال *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: EMP-2002 أو 0554567890"
              value={loginNumberInput}
              onChange={(e) => setLoginNumberInput(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            دخول واستعراض البيانات الموكل بها
          </button>
        </form>

        {/* Quick Sample Teachers for One-Click Testing */}
        <div className="mt-8 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>معلمون مسجلون في النظام (انقر للتجربة الفورية):</span>
          </div>

          <div className="space-y-1.5">
            {staff
              .filter((s) => s.role === "teacher")
              .slice(0, 4)
              .map((tch) => (
                <button
                  key={tch.id}
                  type="button"
                  onClick={() => {
                    setLoginNameInput(tch.fullName);
                    setLoginNumberInput(tch.employeeNumber);
                    const res = loginTeacherWithCredentials(tch.fullName, tch.employeeNumber);
                    if (res.success) {
                      setIsLoggedOutManually(false);
                      setLoginError(null);
                    }
                  }}
                  className="w-full text-right p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-950 border border-slate-200 text-[11px] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{tch.fullName}</span>
                    <span className="text-slate-400 font-mono">({tch.employeeNumber})</span>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-md border border-indigo-100">
                    {(tch.teachingSubjects || [])[0] || tch.specialization}
                  </span>
                </button>
              ))}
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

  const assignedGradesList = grades.filter((g) => assignedGradeIds.includes(g.id));

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

  const effectiveExams = (teacherExams.length > 0 ? teacherExams : exams).filter((ex) => {
    if (teacherCatFilter === "all") return true;
    if (teacherCatFilter === "monthly") return ex.category === "monthly" || ex.type === "monthly";
    if (teacherCatFilter === "quiz") return ex.category === "quiz" || ex.type === "quiz";
    if (teacherCatFilter === "exam")
      return ex.category === "exam" || ex.type === "midterm" || ex.type === "final" || ex.type === "coursework";
    return true;
  });

  const [selectedExamId, setSelectedExamId] = useState<string>(effectiveExams[0]?.id || exams[0]?.id || "");
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

  // Strictly filter students: must be in the teacher's assigned classes/sections!
  const teacherScopeStudents = students.filter((s) => {
    // If teacher has assigned sections, match them
    if (assignedSectionsList.length > 0) {
      return (
        assignedSectionsList.some(
          (sec) => sec.id === s.sectionId || sec.name === s.sectionName
        ) || assignedGradeIds.includes(s.gradeId)
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
            title="تبديل حساب المعلم والدخول باسم ورقم آخر"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تبديل المعلم</span>
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
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الاختبار / التقييم:</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {effectiveExams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
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
                      {sub.name} (الدرجة العظمى: {sub.maxScore})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveGrades}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>حفظ واعتماد الدرجات</span>
            </button>
          </div>

          {gradeSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم رصد وتحديث درجات الطلاب بنجاح في سجلات الدرجات الرسمية.
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                جدول رصد درجات مادة{" "}
                {effectiveSubjects.find((s) => s.id === selectedSubjectId)?.name || "المادة"}
              </span>
              <span className="text-[11px] text-slate-500">الدرجة من 100</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">الطالب</th>
                    <th className="p-3">الرقم الأكاديمي</th>
                    <th className="p-3">الدرجة المرصودة</th>
                    <th className="p-3">النسبة المئوية</th>
                    <th className="p-3">التقدير التلقائي</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const gradeVal = tempGrades[st.id] ?? 92;
                    const percentage = gradeVal;
                    const gradeLetter =
                      percentage >= 90
                        ? "ممتاز مرتفع A+"
                        : percentage >= 80
                        ? "جيد جداً B"
                        : percentage >= 70
                        ? "جيد C"
                        : "مقبول D";

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{st.fullName}</td>
                        <td className="p-3 font-mono text-slate-600">{st.studentNumber}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={gradeVal}
                            onChange={(e) =>
                              setTempGrades((prev) => ({
                                ...prev,
                                [st.id]: Number(e.target.value),
                              }))
                            }
                            className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs text-center focus:bg-white focus:ring-2 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="p-3 font-bold text-slate-800">{percentage}%</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              percentage >= 90
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : percentage >= 80
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {gradeLetter}
                          </span>
                        </td>
                        <td className="p-3">
                          {percentage >= 60 ? (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> ناجح
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold text-[11px] flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> غير مجتاز
                            </span>
                          )}
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
    </div>
  );
};
