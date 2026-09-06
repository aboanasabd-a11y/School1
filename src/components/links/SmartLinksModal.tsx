import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Link,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Phone,
  QrCode,
  Search,
  User,
  GraduationCap,
  Users,
  Sparkles,
  ShieldCheck,
  X,
  Smartphone,
  Send,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle,
} from "lucide-react";

export const SmartLinksModal: React.FC = () => {
  const {
    isSmartLinksModalOpen,
    setIsSmartLinksModalOpen,
    smartLinksInitialTab,
    smartLinksTargetId,
    students,
    staff,
    grades,
    sections,
    generateParentDirectLink,
    generateTeacherDirectLink,
    applyDirectLinkAccess,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<"parent" | "teacher" | "tester">(
    smartLinksInitialTab || "parent"
  );

  // Parent Tab State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    smartLinksTargetId && students.some((s) => s.id === smartLinksTargetId)
      ? smartLinksTargetId
      : students[0]?.id || ""
  );
  const [studentSearch, setStudentSearch] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  // Teacher Tab State
  const teachersList = staff.filter((s) => s.role === "teacher" || s.id.startsWith("staff-"));
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    smartLinksTargetId && teachersList.some((t) => t.id === smartLinksTargetId)
      ? smartLinksTargetId
      : teachersList[0]?.id || "staff-2"
  );
  const [teacherSearch, setTeacherSearch] = useState("");

  // Tester Tab State
  const [testerInput, setTesterInput] = useState("STD-2026-001");
  const [testerResult, setTesterResult] = useState<string | null>(null);

  if (!isSmartLinksModalOpen) return null;

  // Selected Student Object
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentGrade = grades.find((g) => g.id === currentStudent?.gradeId);
  const studentSection = sections.find((s) => s.id === currentStudent?.sectionId);
  const studentLink = currentStudent ? generateParentDirectLink(currentStudent.studentNumber) : "";

  // Selected Teacher Object
  const currentTeacher = teachersList.find((t) => t.id === selectedTeacherId) || teachersList[0];
  const teacherLink = currentTeacher ? generateTeacherDirectLink(currentTeacher.id) : "";

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // WhatsApp share helper for Parent
  const handleWhatsAppParent = (student: typeof currentStudent) => {
    if (!student) return;
    const phone = student.familyInfo?.fatherPhone?.replace(/[^0-9]/g, "") || "";
    const link = generateParentDirectLink(student.studentNumber);
    const message = `السلام عليكم ورحمة الله،\nعزيزي ولي أمر الطالب: *${student.fullName}*\nرقم القيد الأكاديمي: *${student.studentNumber}*\n\nيسر إدارة مدرسة إتقان الأهلية تزويدكم بالرابط المباشر لصفحة الطالب لمتابعة الدرجات والغياب وحافلة المدرسة والأقساط دون الحاجة لكلمة مرور:\n🔗 ${link}\n\nنسعد بمتابعتكم وتواصلكم معنا.`;
    const waUrl = `https://wa.me/${phone ? (phone.startsWith("966") ? phone : "966" + phone.replace(/^0+/, "")) : ""}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // WhatsApp share helper for Teacher
  const handleWhatsAppTeacher = (teacher: typeof currentTeacher) => {
    if (!teacher) return;
    const phone = teacher.phone?.replace(/[^0-9]/g, "") || "";
    const link = generateTeacherDirectLink(teacher.id);
    const message = `السلام عليكم ورحمة الله أستاذ/ة: *${teacher.fullName}*،\nالرقم الوظيفي: *${teacher.employeeNumber}*\n\nتم إنشاء وتجهيز صفحتكم الأكاديمية مسبقاً في نظام إتقان التعليمي.\nيمكنكم الدخول المباشر لرصد الحضور، تسجيل درجات الاختبارات، وإدارة الواجبات والجدول عبر الرابط التالي:\n🔗 ${link}\n\nنتمنى لكم فصلاً دراسياً موفقاً ومليئاً بالإنجاز.`;
    const waUrl = `https://wa.me/${phone ? (phone.startsWith("966") ? phone : "966" + phone.replace(/^0+/, "")) : ""}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // Filtered lists
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.includes(studentSearch) ||
      s.studentNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.familyInfo?.fatherName && s.familyInfo.fatherName.includes(studentSearch)) ||
      (s.familyInfo?.fatherPhone && s.familyInfo.fatherPhone.includes(studentSearch))
  );

  const filteredTeachers = teachersList.filter(
    (t) =>
      t.fullName.includes(teacherSearch) ||
      t.employeeNumber.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      (t.specialization && t.specialization.includes(teacherSearch))
  );

  // Test custom code
  const handleTestCode = () => {
    const query = testerInput.trim();
    if (!query) return;

    // Check if student number
    const matchedStudent = students.find(
      (s) =>
        s.studentNumber.toLowerCase() === query.toLowerCase() ||
        s.id.toLowerCase() === query.toLowerCase() ||
        s.nationalId === query
    );

    if (matchedStudent) {
      setTesterResult(`طالب: ${matchedStudent.fullName} (${matchedStudent.studentNumber})`);
      return;
    }

    // Check if teacher
    const matchedTeacher = staff.find(
      (t) =>
        t.id.toLowerCase() === query.toLowerCase() ||
        t.employeeNumber.toLowerCase() === query.toLowerCase() ||
        t.fullName.includes(query)
    );

    if (matchedTeacher) {
      setTesterResult(`معلم: ${matchedTeacher.fullName} (${matchedTeacher.employeeNumber})`);
      return;
    }

    setTesterResult("لم يتم العثور على طالب أو معلم يطابق هذا الرمز.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header with High Density styling */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
              <Link className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">مركز إرسال الروابط الذكية والمباشرة</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold">
                  بدون كلمة مرور
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                توليد ومشاركة روابط الدخول المباشر المخصصة للمعلمين (صفحات منشأة مسبقاً) ولأولياء الأمور (حسب رقم الطالب)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSmartLinksModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab("parent");
              setShowQrCode(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === "parent"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>روابط أولياء الأمور (حسب رقم الطالب)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold">
              {students.length} طالب
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("teacher");
              setShowQrCode(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === "teacher"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>روابط المعلمين (الصفحات المنشأة مسبقاً)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              {teachersList.length} معلم
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tester")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === "tester"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>مُجرب الروابط المباشرة السريع</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto space-y-5">
          {/* TAB 1: PARENTS BY STUDENT NUMBER */}
          {activeTab === "parent" && (
            <div className="space-y-5">
              {/* Instructions banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  ℹ️
                </div>
                <div className="text-xs text-blue-900 leading-relaxed">
                  <p className="font-bold mb-0.5">آلية عمل رابط ولي الأمر حسب رقم الطالب:</p>
                  <p className="text-blue-800/90">
                    يحمل كل طالب رقماً أكاديمياً فريداً (مثل:{" "}
                    <span className="font-mono font-bold bg-blue-100 px-1 py-0.2 rounded">STD-2026-001</span>).
                    عند مشاركة الرابط مع ولي الأمر وفتحه، يتم تلقائياً الدخول المباشر إلى صفحة الطالب
                    المعني واستعراض درجاته، غيابه، رادار الحافلة المباشر، والأقساط فوراً!
                  </p>
                </div>
              </div>

              {/* Student Selector and Search */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    اختيار الطالب المراد إرسال رابطه:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="بحث بالاسم أو رقم الطالب..."
                      className="w-full text-xs pr-8 pl-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
                    {filteredStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setShowQrCode(false);
                        }}
                        className={`w-full text-right p-2 rounded-md text-xs transition-all flex items-center justify-between ${
                          selectedStudentId === s.id
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "hover:bg-white text-slate-700"
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate font-semibold">{s.fullName}</div>
                          <div
                            className={`text-[10px] ${
                              selectedStudentId === s.id ? "text-blue-100" : "text-slate-400"
                            } font-mono`}
                          >
                            {s.studentNumber} • {s.gradeName}
                          </div>
                        </div>
                        {selectedStudentId === s.id && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Student Active Card & Link Box */}
                {currentStudent && (
                  <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentStudent.photo}
                          alt={currentStudent.fullName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{currentStudent.fullName}</h3>
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                              {currentStudent.studentNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {studentGrade?.name} • {studentSection?.name} | ولي الأمر:{" "}
                            <span className="font-semibold text-slate-700">
                              {currentStudent.familyInfo?.fatherName}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left text-xs">
                        <span className="text-[10px] text-slate-400 block">رقم هاتف الأب</span>
                        <span className="font-mono font-bold text-slate-800" dir="ltr">
                          {currentStudent.familyInfo?.fatherPhone || "غير مسجل"}
                        </span>
                      </div>
                    </div>

                    {/* Direct URL Container */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>الرابط المباشر لصفحة الطالب:</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          مفعل ويوجّه مباشرة لصفحة ولي الأمر
                        </span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate select-all shadow-2xs">
                          {studentLink}
                        </div>
                        <button
                          onClick={() => handleCopy(studentLink, `student-${currentStudent.id}`)}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
                        >
                          {copiedLink === `student-${currentStudent.id}` ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                              <span>تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>نسخ الرابط</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quick Dispatch Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleWhatsAppParent(currentStudent)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>إرسال عبر واتساب 💬</span>
                      </button>

                      <button
                        onClick={() => {
                          applyDirectLinkAccess("parent", currentStudent.studentNumber);
                          setIsSmartLinksModalOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>تجربة وفتح الصفحة الآن 🚀</span>
                      </button>

                      <button
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>{showQrCode ? "إخفاء رمز QR" : "عرض رمز QR 📱"}</span>
                      </button>
                    </div>

                    {/* QR Code Display if toggled */}
                    {showQrCode && (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-3 bg-white rounded-lg border-2 border-slate-900 shadow-sm">
                          {/* Stylized high-contrast QR display */}
                          <svg
                            className="w-40 h-40 text-slate-900"
                            viewBox="0 0 29 29"
                            fill="currentColor"
                          >
                            <path d="M0,0 h7 v7 h-7 z M2,2 v3 h3 v-3 z M9,0 h2 v2 h-2 z M13,0 h3 v3 h-3 z M18,0 h2 v1 h-2 z M22,0 h7 v7 h-7 z M24,2 v3 h3 v-3 z M9,3 h1 v2 h-1 z M11,4 h2 v1 h-2 z M14,3 h2 v3 h-2 z M17,2 h2 v2 h-2 z M20,2 h1 v3 h-1 z M0,9 h2 v3 h-2 z M3,9 h2 v1 h-2 z M6,9 h1 v2 h-1 z M8,9 h2 v2 h-2 z M11,8 h2 v2 h-2 z M14,9 h2 v2 h-2 z M18,8 h3 v2 h-3 z M22,9 h2 v2 h-2 z M26,8 h3 v2 h-3 z M1,13 h3 v2 h-3 z M6,12 h2 v3 h-2 z M10,12 h4 v2 h-4 z M16,13 h2 v1 h-2 z M19,12 h3 v3 h-3 z M24,12 h4 v2 h-4 z M0,22 h7 v7 h-7 z M2,24 v3 h3 v-3 z M9,18 h2 v3 h-2 z M13,18 h2 v2 h-2 z M17,17 h4 v2 h-4 z M23,17 h2 v2 h-2 z M27,17 h2 v3 h-2 z M9,23 h3 v2 h-3 z M14,22 h2 v2 h-2 z M17,21 h2 v3 h-2 z M20,22 h3 v2 h-3 z M25,22 h2 v2 h-2 z M9,26 h2 v3 h-2 z M13,26 h3 v2 h-3 z M18,25 h2 v3 h-2 z M22,26 h4 v3 h-4 z M27,25 h2 v3 h-2 z" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          امسح الرمز بكاميرا الجوال للدخول المباشر لصفحة {currentStudent.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          رمز القيد: {currentStudent.studentNumber}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fast Bulk Table for all students */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>جدول الروابط السريعة لكافة الطلاب ({students.length} طالب)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    يمكنك النسخ أو الإرسال الفوري لولي الأمر بنقرة واحدة
                  </span>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 font-semibold">
                      <tr>
                        <th className="p-2.5">رقم الطالب (القيد)</th>
                        <th className="p-2.5">اسم الطالب</th>
                        <th className="p-2.5">الصف والشعبة</th>
                        <th className="p-2.5">ولي الأمر</th>
                        <th className="p-2.5">رقم الهاتف</th>
                        <th className="p-2.5 text-center">إجراءات سريعة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((st) => {
                        const sLink = generateParentDirectLink(st.studentNumber);
                        const isCopied = copiedLink === `tbl-${st.id}`;
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-2.5 font-mono font-bold text-blue-700">
                              {st.studentNumber}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-900">{st.fullName}</td>
                            <td className="p-2.5 text-slate-600">{st.gradeName}</td>
                            <td className="p-2.5 text-slate-700">
                              {st.familyInfo?.fatherName || "—"}
                            </td>
                            <td className="p-2.5 font-mono text-slate-600" dir="ltr">
                              {st.familyInfo?.fatherPhone || "—"}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleCopy(sLink, `tbl-${st.id}`)}
                                  title="نسخ الرابط المباشر"
                                  className={`p-1.5 rounded-md border text-xs transition-colors ${
                                    isCopied
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleWhatsAppParent(st)}
                                  title="إرسال واتساب لولي الأمر"
                                  className="p-1.5 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    applyDirectLinkAccess("parent", st.studentNumber);
                                    setIsSmartLinksModalOpen(false);
                                  }}
                                  title="فتح وتجربة صفحة الطالب الآن"
                                  className="p-1.5 rounded-md border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

          {/* TAB 2: TEACHERS WITH PRE-CREATED PAGES */}
          {activeTab === "teacher" && (
            <div className="space-y-5">
              {/* Instructions banner */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  👨‍🏫
                </div>
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <p className="font-bold mb-0.5">آلية عمل رابط المعلم لصفحته المنشأة مسبقاً:</p>
                  <p className="text-indigo-800/90">
                    تم إنشاء وتجهيز صفحات المعلمين مسبقاً في النظام وربط كل معلم بصفوفه ومواده وجدوله
                    الدراسي. بمجرد إرسال الرابط للمعلم وفتحه، يتم تسجيل دخوله مباشرة إلى مساحة عمله
                    الأكاديمية لرصد الدرجات، تسجيل الغياب اليومي، والواجبات والتواصل مع الطلاب!
                  </p>
                </div>
              </div>

              {/* Teacher Selector and Active Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    اختيار المعلم لإرسال رابطه:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={teacherSearch}
                      onChange={(e) => setTeacherSearch(e.target.value)}
                      placeholder="بحث باسم المعلم أو التخصص..."
                      className="w-full text-xs pr-8 pl-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
                    {filteredTeachers.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTeacherId(t.id);
                          setShowQrCode(false);
                        }}
                        className={`w-full text-right p-2 rounded-md text-xs transition-all flex items-center justify-between ${
                          selectedTeacherId === t.id
                            ? "bg-indigo-600 text-white font-bold shadow-xs"
                            : "hover:bg-white text-slate-700"
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate font-semibold">{t.fullName}</div>
                          <div
                            className={`text-[10px] ${
                              selectedTeacherId === t.id ? "text-indigo-100" : "text-slate-400"
                            }`}
                          >
                            {t.employeeNumber} • {t.specialization || "معلم"}
                          </div>
                        </div>
                        {selectedTeacherId === t.id && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Teacher Active Card */}
                {currentTeacher && (
                  <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentTeacher.photo}
                          alt={currentTeacher.fullName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{currentTeacher.fullName}</h3>
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                              {currentTeacher.employeeNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {currentTeacher.qualification} • {currentTeacher.specialization}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            البريد: {currentTeacher.email} | الهاتف:{" "}
                            <span dir="ltr" className="font-mono font-semibold">
                              {currentTeacher.phone}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Direct URL Container */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>الرابط المباشر لبوابة المعلم:</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          يفتح صفحة المعلم المنشأة مسبقاً
                        </span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate select-all shadow-2xs">
                          {teacherLink}
                        </div>
                        <button
                          onClick={() => handleCopy(teacherLink, `teacher-${currentTeacher.id}`)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
                        >
                          {copiedLink === `teacher-${currentTeacher.id}` ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                              <span>تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>نسخ الرابط</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quick Dispatch Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleWhatsAppTeacher(currentTeacher)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>إرسال واتساب للمعلم 💬</span>
                      </button>

                      <button
                        onClick={() => {
                          applyDirectLinkAccess("teacher", currentTeacher.id);
                          setIsSmartLinksModalOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>فتح صفحة المعلم الآن 🚀</span>
                      </button>

                      <button
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>{showQrCode ? "إخفاء رمز QR" : "عرض رمز QR 📱"}</span>
                      </button>
                    </div>

                    {/* QR Code */}
                    {showQrCode && (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-3 bg-white rounded-lg border-2 border-indigo-900 shadow-sm">
                          <svg
                            className="w-40 h-40 text-indigo-950"
                            viewBox="0 0 29 29"
                            fill="currentColor"
                          >
                            <path d="M0,0 h7 v7 h-7 z M2,2 v3 h3 v-3 z M9,0 h2 v2 h-2 z M13,0 h3 v3 h-3 z M18,0 h2 v1 h-2 z M22,0 h7 v7 h-7 z M24,2 v3 h3 v-3 z M9,3 h1 v2 h-1 z M11,4 h2 v1 h-2 z M14,3 h2 v3 h-2 z M17,2 h2 v2 h-2 z M20,2 h1 v3 h-1 z M0,9 h2 v3 h-2 z M3,9 h2 v1 h-2 z M6,9 h1 v2 h-1 z M8,9 h2 v2 h-2 z M11,8 h2 v2 h-2 z M14,9 h2 v2 h-2 z M18,8 h3 v2 h-3 z M22,9 h2 v2 h-2 z M26,8 h3 v2 h-3 z M1,13 h3 v2 h-3 z M6,12 h2 v3 h-2 z M10,12 h4 v2 h-4 z M16,13 h2 v1 h-2 z M19,12 h3 v3 h-3 z M24,12 h4 v2 h-4 z M0,22 h7 v7 h-7 z M2,24 v3 h3 v-3 z M9,18 h2 v3 h-2 z M13,18 h2 v2 h-2 z M17,17 h4 v2 h-4 z M23,17 h2 v2 h-2 z M27,17 h2 v3 h-2 z M9,23 h3 v2 h-3 z M14,22 h2 v2 h-2 z M17,21 h2 v3 h-2 z M20,22 h3 v2 h-3 z M25,22 h2 v2 h-2 z M9,26 h2 v3 h-2 z M13,26 h3 v2 h-3 z M18,25 h2 v3 h-2 z M22,26 h4 v3 h-4 z M27,25 h2 v3 h-2 z" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          امسح الرمز للدخول المباشر لبوابة المعلم: {currentTeacher.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          الرقم الوظيفي: {currentTeacher.employeeNumber}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fast Bulk Table for all teachers */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>جدول الروابط السريعة لجميع المعلمين ({teachersList.length} معلم)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    روابط الصفحات المنشأة مسبقاً والمجهزة بالمواد والصفوف
                  </span>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 font-semibold">
                      <tr>
                        <th className="p-2.5">الرقم الوظيفي</th>
                        <th className="p-2.5">اسم المعلم</th>
                        <th className="p-2.5">المؤهل والتخصص</th>
                        <th className="p-2.5">البريد الإلكتروني</th>
                        <th className="p-2.5">رقم الهاتف</th>
                        <th className="p-2.5 text-center">إجراءات سريعة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teachersList.map((tch) => {
                        const tLink = generateTeacherDirectLink(tch.id);
                        const isCopied = copiedLink === `tch-${tch.id}`;
                        return (
                          <tr key={tch.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-2.5 font-mono font-bold text-indigo-700">
                              {tch.employeeNumber}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-900">{tch.fullName}</td>
                            <td className="p-2.5 text-slate-600">{tch.specialization}</td>
                            <td className="p-2.5 text-slate-500 text-[11px]">{tch.email}</td>
                            <td className="p-2.5 font-mono text-slate-600" dir="ltr">
                              {tch.phone}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleCopy(tLink, `tch-${tch.id}`)}
                                  title="نسخ رابط صفحة المعلم"
                                  className={`p-1.5 rounded-md border text-xs transition-colors ${
                                    isCopied
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleWhatsAppTeacher(tch)}
                                  title="إرسال واتساب للمعلم"
                                  className="p-1.5 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    applyDirectLinkAccess("teacher", tch.id);
                                    setIsSmartLinksModalOpen(false);
                                  }}
                                  title="فتح وتجربة صفحة المعلم الآن"
                                  className="p-1.5 rounded-md border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

          {/* TAB 3: DIRECT LINK TESTER & INSPECTOR */}
          {activeTab === "tester" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>فحص واختبار أي رقم طالب أو معرف معلم يدوياً:</span>
                </h3>
                <p className="text-xs text-slate-600">
                  أدخل رقم الطالب الأكاديمي (مثل:{" "}
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-blue-700">STD-2026-001</code>
                  ) أو معرف المعلم (مثل:{" "}
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-indigo-700">staff-2</code>
                  ) للتأكد من الوجهة وصلاحية الرابط:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testerInput}
                    onChange={(e) => setTesterInput(e.target.value)}
                    placeholder="أدخل رقم الطالب أو المعلم..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-800"
                  />
                  <button
                    onClick={handleTestCode}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    فحص الوجهة
                  </button>
                </div>

                {testerResult && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{testerResult}</span>
                    <button
                      onClick={() => {
                        const q = testerInput.trim();
                        const isStudent = students.some(
                          (s) =>
                            s.studentNumber.toLowerCase() === q.toLowerCase() ||
                            s.id.toLowerCase() === q.toLowerCase()
                        );
                        if (isStudent) {
                          applyDirectLinkAccess("parent", q);
                        } else {
                          applyDirectLinkAccess("teacher", q);
                        }
                        setIsSmartLinksModalOpen(false);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors"
                    >
                      دخول مباشر الآن 🚀
                    </button>
                  </div>
                )}
              </div>

              {/* Sample Quick Test Buttons */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">أمثلة سريعة للتجربة الفورية:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      applyDirectLinkAccess("parent", "STD-2026-001");
                      setIsSmartLinksModalOpen(false);
                    }}
                    className="text-right p-3 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-blue-900">
                        تجربة ولي أمر الطالب: يوسف عمر (STD-2026-001)
                      </div>
                      <div className="text-[10px] text-blue-700">الصف الأول الابتدائي • شعبة أ</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    onClick={() => {
                      applyDirectLinkAccess("parent", "STD-2026-002");
                      setIsSmartLinksModalOpen(false);
                    }}
                    className="text-right p-3 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-blue-900">
                        تجربة ولي أمر الطالبة: ليان فيصل (STD-2026-002)
                      </div>
                      <div className="text-[10px] text-blue-700">الصف الأول الابتدائي • شعبة ب</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    onClick={() => {
                      applyDirectLinkAccess("teacher", "staff-2");
                      setIsSmartLinksModalOpen(false);
                    }}
                    className="text-right p-3 rounded-lg border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-indigo-900">
                        تجربة صفحة المعلمة: أ. فاطمة الزهراء الشامي
                      </div>
                      <div className="text-[10px] text-indigo-700">معلمة اللغة العربية والتربية الإسلامية</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                  </button>

                  <button
                    onClick={() => {
                      applyDirectLinkAccess("teacher", "staff-3");
                      setIsSmartLinksModalOpen(false);
                    }}
                    className="text-right p-3 rounded-lg border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-indigo-900">
                        تجربة صفحة المعلم: أ. محمد السعيد القحطاني
                      </div>
                      <div className="text-[10px] text-indigo-700">معلم الرياضيات والحساب</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>الروابط المباشرة آمنة ومخصصة لمطابقة صلاحيات كل مستخدم بدقة.</span>
          </div>
          <button
            onClick={() => setIsSmartLinksModalOpen(false)}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-2xs transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
