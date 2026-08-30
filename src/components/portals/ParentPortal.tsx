import React, { useState } from "react";
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
} from "lucide-react";

export const ParentPortal: React.FC = () => {
  const {
    currentUser,
    students,
    exams,
    gradeRecords,
    attendanceRecords,
    behaviorRecords,
    busRoutes,
    assignments,
    timetableSlots,
    directMessages,
    sendDirectMessage,
    replyDirectMessage,
    recordPayment,
  } = useSchool();

  // Find linked student for this parent
  // Default to first student (يوسف عمر عبد الرحيم) if linkedStudentId matches or default
  const linkedStudent =
    students.find((s) => s.id === currentUser.linkedStudentId) || students[0];

  const [selectedStudentId, setSelectedStudentId] = useState(linkedStudent.id);
  const currentStudent = students.find((s) => s.id === selectedStudentId) || linkedStudent;

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<
    "academic" | "grades" | "attendance" | "bus_gps" | "finance" | "feedback" | "homework"
  >("academic");

  // Feedback form state (sending note to administration or specific teacher)
  const [feedbackRecipient, setFeedbackRecipient] = useState("admin"); // 'admin' or 'teacher'
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSuccessToast, setFeedbackSuccessToast] = useState(false);
  const [selectedChatMsgId, setSelectedChatMsgId] = useState<string | null>(null);
  const [chatReplyText, setChatReplyText] = useState("");

  // Electronic tuition payment modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState(
    currentStudent.finance?.balance || 3000
  );
  const [payCardNumber, setPayCardNumber] = useState("5888 1234 5678 9012");
  const [payCardExpiry, setPayCardExpiry] = useState("08/28");
  const [payCardCvv, setPayCardCvv] = useState("789");
  const [onlinePaySuccess, setOnlinePaySuccess] = useState(false);

  // Student's grades
  const studentGrades = gradeRecords.filter((r) => r.studentId === currentStudent.id);

  // Student's attendance
  const studentAttendance = attendanceRecords.filter((r) => r.studentId === currentStudent.id);

  // Student's behaviors
  const studentBehaviors = behaviorRecords.filter((r) => r.studentId === currentStudent.id);

  // Student's bus route
  const studentBusRoute = busRoutes.find(
    (b) => b.id === currentStudent.transportation?.busRouteId
  ) || busRoutes[0];

  // Direct messages involving this parent
  const parentMessages = directMessages.filter(
    (m) =>
      m.senderId === `${currentStudent.id}-parent` ||
      m.senderId === "std-1-parent" ||
      m.receiverId === `${currentStudent.id}-parent` ||
      m.receiverId === "std-1-parent" ||
      m.senderName.includes(currentUser.fullName.split(" ")[0])
  );

  // Handle sending new feedback / note to administration or teachers
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackContent.trim()) return;

    const receiverId = feedbackRecipient === "admin" ? "staff-1" : "staff-2";
    sendDirectMessage(receiverId, feedbackSubject, feedbackContent);

    setFeedbackSubject("");
    setFeedbackContent("");
    setFeedbackSuccessToast(true);
    setTimeout(() => setFeedbackSuccessToast(false), 4000);
  };

  // Handle replying in conversation
  const handleSendChatReply = (messageId: string) => {
    if (!chatReplyText.trim()) return;
    replyDirectMessage(messageId, chatReplyText);
    setChatReplyText("");
  };

  // Handle Online Tuition Payment
  const handleExecuteOnlinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmountInput <= 0) return;

    recordPayment({
      invoiceNumber: `INV-ONLINE-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptNumber: `REC-MADA-${Math.floor(100000 + Math.random() * 900000)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      gradeName: currentStudent.gradeName,
      amount: payAmountInput,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "card",
      installmentName: "سداد قسط دراسي إلكتروني (بطاقة مدى)",
      receivedBy: "بوابة الدفع الإلكتروني (مدى / Apple Pay)",
      notes: "تمت المعاملة بنجاح وتوثيق العملية في سجل المحاسبة.",
      status: "completed",
    });

    setOnlinePaySuccess(true);
    setTimeout(() => {
      setOnlinePaySuccess(false);
      setShowPayModal(false);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner for Parent Portal */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">بوابة ولي أمر الطالب والمتابعة التربوية</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                بوابة ولي الأمر
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مرحباً {currentUser.fullName} • متابعة مستوى الطالب: <strong className="text-slate-800 font-bold">{currentStudent.fullName}</strong> ({currentStudent.gradeName} - {currentStudent.sectionName})
            </p>
          </div>
        </div>

        {/* Quick Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "academic"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ملف الطالب</span>
          </button>

          <button
            onClick={() => setActiveTab("grades")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "grades"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>كشف الدرجات والتقييم</span>
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "attendance"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>الحضور والانضباط</span>
          </button>

          <button
            onClick={() => setActiveTab("bus_gps")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "bus_gps"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>تتبع باص المدرسة GPS</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "finance"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>الأقساط والسداد</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === "feedback"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ملاحظات للإدارة والمعلمين</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>
        </div>
      </div>

      {/* TAB 1: ACADEMIC PROFILE & SUMMARY */}
      {activeTab === "academic" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Student ID Card */}
            <div className="wide-card">
              <div className="card-header">
                <span className="font-bold text-slate-800">بطاقة الطالب الأكاديمية</span>
                <span className="status-pill bg-success text-[10px]">طالب نشط ومسجل</span>
              </div>

              <div className="p-4 flex flex-col items-center text-center space-y-3">
                <img
                  src={currentStudent.photo || (currentStudent as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                  alt={currentStudent.fullName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-100 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{currentStudent.fullName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    الرقم الأكاديمي: <span className="font-mono font-bold text-slate-700">{currentStudent.studentNumber}</span>
                  </p>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-right">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">الصف الدراسي:</span>
                    <strong className="text-slate-800">{currentStudent.gradeName}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">الشعبة:</span>
                    <strong className="text-slate-800">{currentStudent.sectionName}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">فصيلة الدم:</span>
                    <strong className="text-emerald-700 font-bold">{currentStudent.healthRecord?.bloodType || "A+"}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">النقل المدرسي:</span>
                    <strong className="text-purple-700">{currentStudent.transportation?.usesBus ? "مشترك بالباص" : "خاص"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="stat-card">
                  <span className="stat-label">المعدل التراكمي العام</span>
                  <div className="stat-value text-purple-700">98.4%</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">ممتاز مرتفع (A+)</div>
                </div>

                <div className="stat-card">
                  <span className="stat-label">الترتيب على الصف</span>
                  <div className="stat-value text-blue-700">الأول 🥇</div>
                  <div className="text-[10px] text-slate-500 mt-1">من بين 26 طالباً</div>
                </div>

                <div className="stat-card">
                  <span className="stat-label">نسبة الحضور والالتزام</span>
                  <div className="stat-value text-emerald-700">100%</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">لا يوجد غياب مسجل</div>
                </div>
              </div>

              {/* Recent Honors and Notes */}
              <div className="wide-card">
                <div className="card-header">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>أحدث الإشادات وشهادات التقدير من المعلمين</span>
                  </div>
                  <span className="text-[11px] text-slate-500">الفصل الدراسي الحالي</span>
                </div>

                <div className="p-3 space-y-2.5">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-900">
                        ⭐ وسام التميز القرائي والإلقاء الإذاعي
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono">2026-02-27</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      "يوسف من الطلاب المتميزين خلقاً وعلماً، وقدم أداءً رائعاً في مسابقة القراءة الإثرائية للصف الأول الابتدائي."
                    </p>
                    <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                      المعلمة: أ. فاطمة الزهراء الشامي (معلمة اللغة العربية)
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-900">
                        🏆 التفوق في الرياضيات والحساب الذهني
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono">2026-02-15</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      "حصل يوسف على الدرجة الكاملة في الاختبار الشهري لمادة الرياضيات وسرعة بديهة في حل المسائل."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRADES & EXAMS RESULTS */}
      {activeTab === "grades" && (
        <div className="wide-card">
          <div className="card-header">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Award className="w-4 h-4 text-purple-600" />
              <span>كشف الدرجات والنتائج الرسمية للطالب {currentStudent.fullName}</span>
            </div>
            <button
              onClick={() => alert("جاري تحميل الشهادة وبطاقة التقرير بصيغة PDF معتمدة...")}
              className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 rounded font-bold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              تحميل الشهادة (PDF)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المادة الدراسية</th>
                  <th>الاختبار / التقييم</th>
                  <th>الدرجة المحرزة</th>
                  <th>الدرجة العظمى</th>
                  <th>النسبة المئوية</th>
                  <th>التقدير</th>
                  <th>ملاحظة المعلم</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { subj: "لغتي الجميلة", exam: "الاختبار النصفي الثاني", score: 99, max: 100, letter: "ممتاز (A+)", note: "متميز ومتقن لمهارات الإملاء والقراءة" },
                  { subj: "الرياضيات", exam: "الاختبار النصفي الثاني", score: 100, max: 100, letter: "ممتاز (A+)", note: "الدرجة الكاملة ماشاء الله" },
                  { subj: "القرآن الكريم والتجويد", exam: "الاختبار النصفي الثاني", score: 98, max: 100, letter: "ممتاز (A+)", note: "حفظ متقن ومخارج حروف سليمة" },
                  { subj: "العلوم والحياة", exam: "الاختبار النصفي الثاني", score: 97, max: 100, letter: "ممتاز (A+)", note: "مشاركة ممتازة في التجارب الصفية" },
                  { subj: "اللغة الإنجليزية (English)", exam: "الاختبار النصفي الثاني", score: 98, max: 100, letter: "ممتاز (A+)", note: "Excellent vocabulary & speaking" },
                  { subj: "التربية الفنية والبدنية", exam: "التقييم المستمر", score: 100, max: 100, letter: "ممتاز (A+)", note: "انضباط وروح رياضية عالية" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="font-bold text-slate-900">{row.subj}</td>
                    <td className="text-slate-600 text-xs">{row.exam}</td>
                    <td className="font-bold text-purple-700 text-sm font-mono">{row.score}</td>
                    <td className="font-mono text-slate-400 text-xs">{row.max}</td>
                    <td className="font-bold text-slate-800">{row.score}%</td>
                    <td>
                      <span className="status-pill bg-success text-[10px]">{row.letter}</span>
                    </td>
                    <td className="text-xs text-slate-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-800">إحصائيات الحضور لهذا الشهر</span>
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-800 font-semibold">أيام الحضور الفعلي</div>
                  <div className="text-xl font-bold text-emerald-900 font-mono">22 يوماً</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600 font-semibold">أيام الغياب بدون عذر</div>
                  <div className="text-xl font-bold text-slate-800 font-mono">0 أيام</div>
                </div>
                <span className="status-pill bg-success text-[10px]">منضبط تماماً</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-800 font-semibold">حالات التأخير الصباحي</div>
                  <div className="text-xl font-bold text-amber-900 font-mono">0 دقائق</div>
                </div>
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <span>سجل الحضور اليومي للأسبوع الحالي</span>
              <span className="text-[11px] text-slate-500">فبراير 2026</span>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { day: "الخميس 26 فبراير", time: "07:20 ص", status: "حاضر في الموعد", isOk: true },
                { day: "الأربعاء 25 فبراير", time: "07:18 ص", status: "حاضر في الموعد", isOk: true },
                { day: "الثلاثاء 24 فبراير", time: "07:22 ص", status: "حاضر في الموعد", isOk: true },
                { day: "الإثنين 23 فبراير", time: "07:15 ص", status: "حاضر في الموعد", isOk: true },
                { day: "الأحد 22 فبراير", time: "07:19 ص", status: "حاضر في الموعد", isOk: true },
              ].map((rec, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{rec.day}</div>
                      <div className="text-[10px] text-slate-400 font-mono">وقت تسجيل الدخول عبر البوابة: {rec.time}</div>
                    </div>
                  </div>
                  <span className="status-pill bg-success text-[10px]">{rec.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE GPS BUS TRACKING */}
      {activeTab === "bus_gps" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="wide-card">
              <div className="card-header">
                <span className="font-bold text-slate-800">بيانات حافلة الطالب</span>
                <span className="status-pill bg-success text-[10px]">الرحلة نشطة الآن 🟢</span>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-950 text-sm">{studentBusRoute.name}</div>
                    <div className="text-[11px] text-amber-800">رقم اللوحة: {studentBusRoute.plateNumber}</div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">السائق:</span>
                    <strong>{studentBusRoute.driverName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">المشرف:</span>
                    <strong>{studentBusRoute.supervisorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">هاتف السائق:</span>
                    <a
                      href={`tel:${studentBusRoute.driverPhone}`}
                      className="font-mono text-indigo-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Phone className="w-3 h-3" />
                      {studentBusRoute.driverPhone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">نقطة الالتقاط:</span>
                    <strong className="text-slate-900">{currentStudent.transportation?.pickupLocation || "أمام المنزل"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">وقت الوصول التقديري (ETA):</span>
                    <strong className="text-emerald-700 font-bold">4 دقائق (07:12 ص)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Live GPS Radar Mock Visualizer */}
            <div className="lg:col-span-2 wide-card">
              <div className="card-header">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>تتبع موقع الحافلة اللحظي على الخريطة (GPS Radar)</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">
                  سرعة الحافلة: {studentBusRoute.currentGps?.speed || 38} كم/س
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl m-3 text-white relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Radar Grid Circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-64 h-64 border border-emerald-500 rounded-full animate-ping" />
                  <div className="w-48 h-48 border border-emerald-400 rounded-full absolute" />
                  <div className="w-32 h-32 border border-emerald-300 rounded-full absolute" />
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-slate-800/80 backdrop-blur-xs p-2.5 rounded-lg border border-slate-700 text-xs">
                    <div className="text-slate-400 text-[10px]">الموقع الحالي للحافلة:</div>
                    <div className="font-bold text-emerald-400">{studentBusRoute.currentGps?.currentStop || "شارع الإمام الشافعي - قرب جامع الراجحي"}</div>
                  </div>

                  <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>اتصال الأقمار الصناعية مباشر (Live GPS)</span>
                  </div>
                </div>

                {/* Center Animated Bus Indicator */}
                <div className="relative z-10 my-8 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                    <Bus className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-bold text-amber-300 mt-2 bg-slate-800/90 px-3 py-1 rounded-full border border-amber-400/30">
                    حافلة #104 في طريقها إلى منزلك • باقي 800 متر
                  </div>
                </div>

                <div className="relative z-10 bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-xs flex items-center justify-between">
                  <span>تم تأكيد صعود الطالب صباحاً: <strong className="text-emerald-400">نعم (07:15 ص)</strong></span>
                  <span className="text-slate-400 text-[10px]">التحديث الأخير: منذ 12 ثانية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINANCE & TUITION PAYMENTS */}
      {activeTab === "finance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-800">الملخص المالي لرسوم الطالب</span>
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">الرسوم الدراسية السنوية:</span>
                  <strong className="text-slate-900 font-mono">{(currentStudent.finance?.annualTuition || 15000).toLocaleString()} ر.س</strong>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>خصم التفوق الممنوح:</span>
                  <strong className="font-mono">- {(currentStudent.finance?.discountAmount || 3000).toLocaleString()} ر.س</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-slate-800">إجمالي الرسوم الصافية:</span>
                  <strong className="text-slate-900 font-mono">{(currentStudent.finance?.netAmount || 12000).toLocaleString()} ر.س</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-emerald-800 block">المبلغ المسدد حتى الآن:</span>
                  <strong className="text-base text-emerald-900 font-mono font-bold">
                    {(currentStudent.finance?.paidAmount || 12000).toLocaleString()} ر.س
                  </strong>
                </div>
                <span className="status-pill bg-success text-[10px]">مسدد</span>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-purple-800 block">المتبقي المطلوب:</span>
                  <strong className="text-base text-purple-900 font-mono font-bold">
                    {(currentStudent.finance?.balance || 0).toLocaleString()} ر.س
                  </strong>
                </div>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs"
                >
                  سداد إلكتروني
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <span>سندات القبض وإيصالات السداد الصادرة</span>
              <span className="text-[11px] text-slate-500">موثقة ومعتمدة</span>
            </div>

            <div className="p-3 space-y-2.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-xs text-slate-900">سند قبض رقم: REC-994411</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    الدفعة الأولى (التسجيل والرسوم المدرسية) • تاريخ: 2025-08-25
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm font-mono block">12,000 ر.س</span>
                    <span className="text-[10px] text-slate-400">تحويل بنكي الراجحي</span>
                  </div>
                  <button
                    onClick={() => alert("جاري فتح الإيصال الإلكتروني للطباعة...")}
                    className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                    title="تحميل الإيصال"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FEEDBACK & NOTES TO ADMINISTRATION AND TEACHERS (KEY USER REQUEST) */}
      {activeTab === "feedback" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* New Feedback Form */}
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-900">إرسال ملاحظة أو استفسار جديد</span>
              <Send className="w-4 h-4 text-purple-600" />
            </div>

            <form onSubmit={handleSendFeedback} className="p-4 space-y-3">
              {feedbackSuccessToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  تم إرسال ملاحظتك بنجاح إلى المدرسة، وسيتم الرد عليك في أقرب وقت.
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">الجهة الموجه إليها الملاحظة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackRecipient("admin")}
                    className={`py-1.5 rounded-md text-xs font-bold border transition-all ${
                      feedbackRecipient === "admin"
                        ? "bg-purple-50 border-purple-500 text-purple-900 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🏛️ إدارة المدرسة
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackRecipient("teacher")}
                    className={`py-1.5 rounded-md text-xs font-bold border transition-all ${
                      feedbackRecipient === "teacher"
                        ? "bg-purple-50 border-purple-500 text-purple-900 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    👨‍🏫 المعلم المعني
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان الملاحظة / الاستفسار:</label>
                <input
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="مثال: استفسار بخصوص مشروع مادة العلوم"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">تفاصيل الملاحظة:</label>
                <textarea
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  rows={4}
                  placeholder="اكتب ملاحظتك أو مقترحك أو استفسارك بالتفصيل..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الملاحظة للإدارة / المعلم</span>
              </button>
            </form>
          </div>

          {/* Conversation & Replies History */}
          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>سجل الملاحظات والمحادثات مع الإدارة والمعلمين ({parentMessages.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">ردود رسمية مباشرة</span>
            </div>

            <div className="p-3 space-y-3 max-h-[550px] overflow-y-auto">
              {parentMessages.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  لا توجد ملاحظات مرسلة حالياً. يمكنك استخدام النموذج المجاور لإرسال أول ملاحظة.
                </div>
              ) : (
                parentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <div>
                        <span className="font-bold text-xs text-slate-900">{msg.subject}</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          إلى: {msg.receiverName} ({msg.receiverRole}) • {msg.timestamp}
                        </div>
                      </div>
                      <span className="status-pill bg-info text-[10px]">
                        {msg.replies && msg.replies.length > 0 ? "تم الرد ✓" : "قيد المتابعة"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                      {msg.content}
                    </p>

                    {/* Official Replies from School */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="space-y-2 pr-4 border-r-2 border-purple-500">
                        {msg.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-2.5 bg-purple-50/80 rounded-lg border border-purple-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-purple-900 text-[11px]">
                              <span>رد رسمي من: {rep.senderName}</span>
                              <span className="text-[9.5px] text-purple-600 font-mono font-normal">
                                {rep.timestamp}
                              </span>
                            </div>
                            <p className="text-slate-800 leading-relaxed">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Box */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={selectedChatMsgId === msg.id ? chatReplyText : ""}
                        onChange={(e) => {
                          setSelectedChatMsgId(msg.id);
                          setChatReplyText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendChatReply(msg.id);
                          }
                        }}
                        placeholder="اكتب رداً إضافياً على هذه المحادثة..."
                        className="flex-1 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:border-purple-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleSendChatReply(msg.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-xs font-bold"
                      >
                        إرسال
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Online Tuition Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-4 border border-slate-200 shadow-xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                سداد الرسوم الدراسية إلكترونياً (مدى / Visa)
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {onlinePaySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">تم السداد الإلكتروني بنجاح!</h4>
                <p className="text-xs text-emerald-700">
                  تم إصدار سند القبض الإلكتروني وتحديث رصيد الطالب فورياً.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteOnlinePayment} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">المبلغ المراد سداده (ر.س):</label>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    value={payAmountInput}
                    onChange={(e) => setPayAmountInput(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm font-bold text-purple-700 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">رقم بطاقة مدى / الائتمان:</label>
                  <input
                    type="text"
                    value={payCardNumber}
                    onChange={(e) => setPayCardNumber(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">تاريخ الانتهاء:</label>
                    <input
                      type="text"
                      value={payCardExpiry}
                      onChange={(e) => setPayCardExpiry(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">رمز الأمان (CVV):</label>
                    <input
                      type="password"
                      value={payCardCvv}
                      onChange={(e) => setPayCardCvv(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-[10.5px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>عملية دفع مشفرة وآمنة متوافقة مع معايير البنك المركزي السعودي (ساما).</span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md font-bold shadow-xs flex items-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>تأكيد ودفع {payAmountInput.toLocaleString()} ر.س</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
