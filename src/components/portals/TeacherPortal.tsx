import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
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
  HelpCircle,
  UserCheck,
} from "lucide-react";

export const TeacherPortal: React.FC = () => {
  const {
    currentUser,
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
  } = useSchool();

  // Active sub-tab inside Teacher Portal
  const [activeTab, setActiveTab] = useState<
    "students" | "attendance" | "grades" | "behavior" | "timetable" | "messages"
  >("students");

  // Filters
  const [selectedGradeId, setSelectedGradeId] = useState<string>(grades[1]?.id || grades[0]?.id || "");
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sections.find((s) => s.gradeId === selectedGradeId)?.id || sections[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Attendance recording state
  const todayStr = "2026-02-28";
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [tempAttendance, setTempAttendance] = useState<
    Record<string, { status: "present" | "absent" | "late" | "excused"; lateMinutes?: number; reason?: string }>
  >({});
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  // Grade recording state
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || "");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || "");
  const [tempGrades, setTempGrades] = useState<Record<string, number>>({});
  const [gradeSavedToast, setGradeSavedToast] = useState(false);

  // Behavior state
  const [behaviorStudentId, setBehaviorStudentId] = useState("");
  const [behaviorType, setBehaviorType] = useState<"positive" | "negative">("positive");
  const [behaviorTitle, setBehaviorTitle] = useState("");
  const [behaviorDesc, setBehaviorDesc] = useState("");
  const [behaviorToast, setBehaviorToast] = useState(false);

  // Assignment modal/form state
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentSubject, setNewAssignmentSubject] = useState(subjects[0]?.name || "اللغة العربية");
  const [newAssignmentDue, setNewAssignmentDue] = useState("2026-03-05");
  const [newAssignmentDesc, setNewAssignmentDesc] = useState("");

  // Messaging state
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [msgRecipientId, setMsgRecipientId] = useState("std-1-parent");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");

  // Filter students based on current selection
  const currentGrade = grades.find((g) => g.id === selectedGradeId) || grades[0];
  const gradeSections = sections.filter((s) => s.gradeId === selectedGradeId);
  const currentSection = sections.find((s) => s.id === selectedSectionId) || gradeSections[0];

  const filteredStudents = students.filter((s) => {
    const matchGrade = selectedGradeId ? s.gradeId === selectedGradeId : true;
    const matchSection = selectedSectionId ? s.sectionId === selectedSectionId : true;
    const matchSearch =
      s.fullName.includes(searchQuery) ||
      s.studentNumber.includes(searchQuery) ||
      (s.familyInfo?.fatherName && s.familyInfo.fatherName.includes(searchQuery));
    return matchGrade && matchSection && matchSearch;
  });

  // Current Teacher's timetable slots
  const teacherTimetable = timetableSlots.filter((slot) => slot.teacherName?.includes("فاطمة") || slot.teacherId === "staff-2");

  // Messages involving this teacher
  const teacherMessages = directMessages.filter(
    (m) => m.receiverId === "staff-2" || m.senderId === "staff-2" || m.receiverName.includes("فاطمة")
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

  // Handle saving grades
  const handleSaveGrades = () => {
    const examObj = exams.find((e) => e.id === selectedExamId) || exams[0];
    const subjObj = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

    Object.entries(tempGrades).forEach(([studentId, score]) => {
      const studentObj = students.find((s) => s.id === studentId);
      if (studentObj && score !== undefined) {
        const numericScore = Number(score);
        const percentage = Math.round((numericScore / (subjObj?.maxScore || 100)) * 100);
        let gradeLetter = "A";
        if (percentage < 60) gradeLetter = "F";
        else if (percentage < 70) gradeLetter = "D";
        else if (percentage < 80) gradeLetter = "C";
        else if (percentage < 90) gradeLetter = "B";

        recordGrade({
          examId: examObj.id,
          studentId: studentObj.id,
          studentName: studentObj.fullName,
          subjectId: subjObj.id,
          subjectName: subjObj.name,
          score: numericScore,
          maxScore: subjObj.maxScore || 100,
          percentage,
          gradeLetter,
          isPassed: numericScore >= (subjObj?.passScore || 50),
          recordedDate: todayStr,
        });
      }
    });

    setGradeSavedToast(true);
    setTimeout(() => setGradeSavedToast(false), 3000);
  };

  // Handle adding behavior
  const handleAddBehavior = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === behaviorStudentId);
    if (!st || !behaviorTitle) return;

    addBehaviorRecord({
      studentId: st.id,
      studentName: st.fullName,
      gradeName: st.gradeName,
      type: behaviorType,
      category: behaviorType === "positive" ? "تفوق ومشاركة صفية متميزة" : "تأخر عن الحصة / عدم إحضار الواجب",
      title: behaviorTitle,
      description: behaviorDesc || "تم تدوين الملاحظة من قبل معلم المادة.",
      points: behaviorType === "positive" ? 5 : -3,
      date: todayStr,
      recordedBy: currentUser.fullName,
      actionTaken: behaviorType === "positive" ? "منح شارة تميز دراسي" : "تنبيه وتوجيه تربوي",
      notifiedParent: true,
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
      subjectName: newAssignmentSubject,
      gradeName: currentGrade.name,
      sectionName: currentSection?.name || "شعبة أ",
      dueDate: newAssignmentDue,
      maxScore: 10,
      description: newAssignmentDesc || "حل الأنشطة في كراسة التمارين ومراجعة الدرس.",
      submissionsCount: 0,
      totalStudents: filteredStudents.length || 24,
    });

    setNewAssignmentTitle("");
    setNewAssignmentDesc("");
    setShowAddAssignment(false);
  };

  // Handle sending reply
  const handleSendReply = (messageId: string) => {
    if (!replyText.trim()) return;
    replyDirectMessage(messageId, replyText);
    setReplyText("");
  };

  // Handle sending new message
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
      {/* Header Banner for Teacher Portal */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">بوابة المعلم والكادر التعليمي</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                صلاحيات المعلم
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مرحباً {currentUser.fullName} • متابعة طلاب الشعب، رصد الحضور والغياب، تسجيل الدرجات، والواجبات المدرسية
            </p>
          </div>
        </div>

        {/* Quick Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "students"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>قائمة الطلاب</span>
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "attendance"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>رصد الحضور</span>
          </button>

          <button
            onClick={() => setActiveTab("grades")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "grades"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>رصد الدرجات</span>
          </button>

          <button
            onClick={() => setActiveTab("behavior")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "behavior"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الملاحظات والسلوك</span>
          </button>

          <button
            onClick={() => setActiveTab("timetable")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "timetable"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>جدول الحصص</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === "messages"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>الرسائل والملاحظات</span>
            {teacherMessages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Global Grade & Section Selector Filter Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>تصفية الصفوف المسندة:</span>
          </div>

          <select
            value={selectedGradeId}
            onChange={(e) => {
              setSelectedGradeId(e.target.value);
              const firstSec = sections.find((s) => s.gradeId === e.target.value);
              if (firstSec) setSelectedSectionId(firstSec.id);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold focus:outline-hidden focus:border-emerald-500"
          >
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold focus:outline-hidden focus:border-emerald-500"
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
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md pr-8 pl-3 py-1.5 focus:outline-hidden focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* TAB 1: STUDENTS LIST & PROFILES */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="stat-card">
              <span className="stat-label">إجمالي طلاب الشعبة</span>
              <div className="stat-value text-emerald-700">{filteredStudents.length} طالب</div>
              <div className="text-[10px] text-slate-500 mt-1">الصف: {currentGrade.name}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">نسبة الحضور التراكمية</span>
              <div className="stat-value text-emerald-600">97.8%</div>
              <div className="text-[10px] text-emerald-600 mt-1">ممتاز وانضباط عالي</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">المتوسط العام للشعبة</span>
              <div className="stat-value text-blue-600">92.4%</div>
              <div className="text-[10px] text-blue-600 mt-1">تقدير ممتاز مرتفع</div>
            </div>
          </div>

          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>قائمة الطلاب المسجلين في {currentGrade.name} - {currentSection?.name}</span>
              </div>
              <span className="text-[11px] text-slate-500">
                عرض {filteredStudents.length} طالب
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الطالب</th>
                    <th>الرقم الأكاديمي</th>
                    <th>ولي الأمر والتواصل</th>
                    <th>السجل الصحي / فصيلة الدم</th>
                    <th>المستوى الأكاديمي</th>
                    <th>ملاحظات المعلم</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70">
                      <td className="font-bold text-slate-900 flex items-center gap-2">
                        <img
                          src={st.photo || (st as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                          alt={st.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div>{st.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            تاريخ الميلاد: {st.birthDate}
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-slate-600">{st.studentNumber}</td>
                      <td>
                        <div className="font-semibold text-slate-800">{st.familyInfo?.fatherName || "—"}</div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          {st.familyInfo?.fatherPhone || "—"}
                        </div>
                      </td>
                      <td>
                        <span className="status-pill bg-info text-[10px]">
                          فصيلة الدم {st.healthRecord?.bloodType || "A+"}
                        </span>
                        {st.healthRecord?.chronicDiseases && st.healthRecord.chronicDiseases !== "لا يوجد" && (
                          <div className="text-[9.5px] text-rose-600 mt-0.5">
                            ⚠️ {st.healthRecord.chronicDiseases}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-bold text-emerald-700">
                          {st.academicHistory?.[0]?.gpa || 98.4}%
                        </div>
                        <div className="text-[9.5px] text-slate-400">
                          الترتيب: {st.academicHistory?.[0]?.ranking || 1} على الشعبة
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setBehaviorStudentId(st.id);
                            setActiveTab("behavior");
                          }}
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 font-semibold"
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
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">رصد الحضور اليومي السريع للحصة</h3>
                <p className="text-xs text-slate-500">
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
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleSaveAttendance}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 self-end transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ واعتماد الحضور</span>
              </button>
            </div>
          </div>

          {attendanceSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم حفظ وتوثيق سجل الحضور والغياب بنجاح وإرسال التنبيهات للأهالي.
            </div>
          )}

          <div className="wide-card">
            <div className="card-header">
              <span>كشف طلاب الشعبة ({filteredStudents.length} طالب)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const allPresent: Record<string, { status: "present" }> = {};
                    filteredStudents.forEach((s) => (allPresent[s.id] = { status: "present" }));
                    setTempAttendance(allPresent);
                  }}
                  className="text-[11px] text-emerald-700 hover:underline font-bold"
                >
                  تعيين الكل حاضر ✅
                </button>
              </div>
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
                        src={st.photo || (st as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
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

                    {/* Fast Status Selector Buttons */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                      <button
                        onClick={() =>
                          setTempAttendance((prev) => ({
                            ...prev,
                            [st.id]: { status: "present" },
                          }))
                        }
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
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
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
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
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
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
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
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

      {/* TAB 3: GRADING & EXAMS ENTRY */}
      {activeTab === "grades" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الاختبار / التقييم:</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold focus:outline-hidden focus:border-emerald-500"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} ({ex.term})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">المادة الدراسية:</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold focus:outline-hidden focus:border-emerald-500"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} (الدرجة العظمى: {sub.maxScore})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveGrades}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>حفظ واعتماد الدرجات</span>
            </button>
          </div>

          {gradeSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم رصد وتحديث درجات الطلاب بنجاح في سجلات الدرجات الرسمية.
            </div>
          )}

          <div className="wide-card">
            <div className="card-header">
              <span>جدول رصد درجات الطلاب</span>
              <span className="text-[11px] text-slate-500">الدرجة من 100</span>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الطالب</th>
                    <th>الرقم الأكاديمي</th>
                    <th>الدرجة المرصودة</th>
                    <th>النسبة المئوية</th>
                    <th>التقدير التلقائي</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st) => {
                    const currentScore =
                      tempGrades[st.id] !== undefined
                        ? tempGrades[st.id]
                        : gradeRecords.find(
                            (r) =>
                              r.studentId === st.id &&
                              (r.examId === selectedExamId || r.subjectId === selectedSubjectId)
                          )?.score ?? 95;

                    const percentage = Math.min(100, Math.max(0, currentScore));
                    let gradeLetter = "ممتاز (A+)";
                    if (percentage < 60) gradeLetter = "راسب (F)";
                    else if (percentage < 70) gradeLetter = "مقبول (D)";
                    else if (percentage < 80) gradeLetter = "جيد (C)";
                    else if (percentage < 90) gradeLetter = "جيد جداً (B)";

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70">
                        <td className="font-bold text-slate-900 flex items-center gap-2">
                          <img
                            src={st.photo || (st as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span>{st.fullName}</span>
                        </td>
                        <td className="font-mono text-slate-600">{st.studentNumber}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentScore}
                            onChange={(e) =>
                              setTempGrades((prev) => ({
                                ...prev,
                                [st.id]: Number(e.target.value),
                              }))
                            }
                            className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-xs text-center focus:bg-white focus:border-emerald-500"
                          />
                        </td>
                        <td className="font-bold text-slate-800">{percentage}%</td>
                        <td>
                          <span
                            className={`status-pill ${
                              percentage >= 90
                                ? "bg-success"
                                : percentage >= 75
                                ? "bg-info"
                                : percentage >= 60
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {gradeLetter}
                          </span>
                        </td>
                        <td>
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
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-900">تدوين ملاحظة سلوكية / إشادة</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <form onSubmit={handleAddBehavior} className="p-3.5 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">الطالب المستهدف:</label>
                <select
                  value={behaviorStudentId}
                  onChange={(e) => setBehaviorStudentId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs font-semibold focus:border-emerald-500"
                >
                  <option value="">-- اختر الطالب --</option>
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
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
                    className={`py-1.5 rounded-md text-xs font-bold border transition-all ${
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
                    className={`py-1.5 rounded-md text-xs font-bold border transition-all ${
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">التفاصيل والتوجيه:</label>
                <textarea
                  value={behaviorDesc}
                  onChange={(e) => setBehaviorDesc(e.target.value)}
                  rows={2}
                  placeholder="تفاصيل التقدير أو الملاحظة والتوجيه التربوي..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>حفظ وإشعار ولي الأمر</span>
              </button>

              {behaviorToast && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] rounded font-bold text-center">
                  تم تسجيل الملاحظة وتوثيقها بملف الطالب بنجاح.
                </div>
              )}
            </form>
          </div>

          {/* Assignments List Card */}
          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>الواجبات والمهام المدرسية المقررة</span>
              </div>
              <button
                onClick={() => setShowAddAssignment(true)}
                className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة واجب جديد</span>
              </button>
            </div>

            <div className="p-3 space-y-2.5">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{asg.title}</span>
                    <span className="status-pill bg-info text-[10px]">
                      مستحق في: {asg.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {asg.description}
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>المادة: <strong className="text-slate-700">{asg.subjectName}</strong></span>
                    <span>الدرجة: <strong className="text-emerald-700">{asg.maxScore} درجات</strong></span>
                    <span>الشعبة: <strong className="text-slate-700">{asg.gradeName} - {asg.sectionName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TIMETABLE */}
      {activeTab === "timetable" && (
        <div className="wide-card">
          <div className="card-header">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>جدول الحصص الأسبوعي للأستاذة {currentUser.fullName}</span>
            </div>
            <span className="text-[11px] text-slate-500">العام الدراسي 2025 - 2026</span>
          </div>

          <div className="overflow-x-auto p-3">
            <table className="w-full border-collapse text-xs text-center">
              <thead>
                <tr className="bg-slate-100 border border-slate-200 text-slate-700">
                  <th className="p-2 border border-slate-200">اليوم / الحصة</th>
                  <th className="p-2 border border-slate-200">الحصة الأولى (07:30)</th>
                  <th className="p-2 border border-slate-200">الحصة الثانية (08:15)</th>
                  <th className="p-2 border border-slate-200">الحصة الثالثة (09:00)</th>
                  <th className="p-2 border border-slate-200 bg-amber-50 text-amber-800">استراحة (09:45)</th>
                  <th className="p-2 border border-slate-200">الحصة الرابعة (10:15)</th>
                  <th className="p-2 border border-slate-200">الحصة الخامسة (11:00)</th>
                </tr>
              </thead>
              <tbody>
                {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => (
                  <tr key={day} className="border border-slate-200 hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-slate-800">
                      {day}
                    </td>
                    <td className="p-2 border border-slate-200">
                      <div className="font-bold text-emerald-800">لغتي الجميلة</div>
                      <div className="text-[10px] text-slate-500">أول ابتدائي (أ) • قاعة 101</div>
                    </td>
                    <td className="p-2 border border-slate-200">
                      <div className="font-bold text-emerald-800">لغتي الجميلة</div>
                      <div className="text-[10px] text-slate-500">أول ابتدائي (ب) • قاعة 102</div>
                    </td>
                    <td className="p-2 border border-slate-200">
                      <div className="font-bold text-blue-800">القرآن الكريم</div>
                      <div className="text-[10px] text-slate-500">أول ابتدائي (أ) • قاعة 101</div>
                    </td>
                    <td className="p-2 border border-slate-200 bg-amber-50/50 text-[11px] font-semibold text-amber-700">
                      فترة الإفطار
                    </td>
                    <td className="p-2 border border-slate-200">
                      <div className="font-bold text-purple-800">نشاط قرائي</div>
                      <div className="text-[10px] text-slate-500">المكتبة المدرسية</div>
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-400 text-[11px]">
                      حصة احتياط / مكتبية
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MESSAGES & PARENT NOTES */}
      {activeTab === "messages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-900">ملاحظات ورسائل أولياء الأمور</span>
              <button
                onClick={() => setShowNewMsgModal(true)}
                className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>رسالة جديدة</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {teacherMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedMessageId === msg.id
                      ? "bg-emerald-50/70 border-r-4 border-emerald-600"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{msg.senderName}</span>
                    <span className="text-[9.5px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <div className="font-semibold text-xs text-emerald-800 mt-1 line-clamp-1">
                    {msg.subject}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {msg.content}
                  </p>
                  {msg.replies?.length > 0 && (
                    <div className="mt-1 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> تم الرد ({msg.replies.length})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <span>تفاصيل المحادثة والملاحظة</span>
              <span className="text-[11px] text-slate-400">رد فوري</span>
            </div>

            {selectedMessageId ? (
              (() => {
                const activeMsg = directMessages.find((m) => m.id === selectedMessageId);
                if (!activeMsg) return null;

                return (
                  <div className="p-4 space-y-4 flex flex-col h-[500px]">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={activeMsg.senderAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              {activeMsg.senderName} ({activeMsg.senderRole})
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {activeMsg.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 font-bold text-xs text-slate-800">
                        الموضوع: {activeMsg.subject}
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {activeMsg.content}
                      </p>
                    </div>

                    {/* Replies Thread */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {activeMsg.replies?.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mr-6 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-emerald-900 font-bold text-[11px]">
                            <span>{rep.senderName}</span>
                            <span className="text-[9.5px] text-emerald-600 font-mono font-normal">
                              {rep.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-800 leading-relaxed">{rep.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input Box */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendReply(activeMsg.id)}
                        placeholder="اكتب ردك التربوي المباشر لولي الأمر..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleSendReply(activeMsg.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال الرد</span>
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                اختر رسالة أو ملاحظة من القائمة لاستعراض تفاصيلها والرد عليها
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: New Assignment */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-4 border border-slate-200 shadow-xl space-y-3 animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              إضافة واجب مدرسي جديد
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">عنوان الواجب:</label>
                <input
                  type="text"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  placeholder="مثال: واجب نص الاستماع ص 45"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">المادة:</label>
                  <select
                    value={newAssignmentSubject}
                    onChange={(e) => setNewAssignmentSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-semibold"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">تاريخ التسليم:</label>
                  <input
                    type="date"
                    value={newAssignmentDue}
                    onChange={(e) => setNewAssignmentDue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">تعليمات الواجب:</label>
                <textarea
                  value={newAssignmentDesc}
                  onChange={(e) => setNewAssignmentDesc(e.target.value)}
                  rows={2}
                  placeholder="تعليمات حل الواجب وإرشادات المراجعة..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssignment(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold shadow-xs"
                >
                  نشر الواجب للطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Message */}
      {showNewMsgModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-4 border border-slate-200 shadow-xl space-y-3 animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              إرسال ملاحظة أو رسالة لولي الأمر
            </h3>

            <form onSubmit={handleSendNewMessage} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">المستلم (ولي أمر الطالب):</label>
                <select
                  value={msgRecipientId}
                  onChange={(e) => setMsgRecipientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-semibold"
                >
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={`${s.id}-parent`}>
                      ولي أمر الطالب: {s.fullName} ({s.familyInfo?.fatherName || "—"})
                    </option>
                  ))}
                  <option value="staff-1">إدارة المدرسة (د. عبد العزيز الراجحي)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">موضوع الرسالة:</label>
                <input
                  type="text"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="مثال: متابعة مستوى الطالب في القراءة الإثرائية"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">نص الملاحظة:</label>
                <textarea
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  rows={3}
                  placeholder="اكتب ملاحظتك التوجيهية لولي الأمر..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewMsgModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>إرسال الرسالة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
