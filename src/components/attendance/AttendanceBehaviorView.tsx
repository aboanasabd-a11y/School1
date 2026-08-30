import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { BehaviorRecord } from "../../types";
import {
  CalendarCheck,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Award,
  ShieldAlert,
  Plus,
  Save,
  Filter,
  Users,
  Search,
  Sparkles,
  X,
} from "lucide-react";

export const AttendanceBehaviorView: React.FC = () => {
  const {
    students,
    grades,
    sections,
    attendanceRecords,
    behaviorRecords,
    currentUser,
    recordAttendanceBatch,
    addBehaviorRecord,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<"attendance" | "behavior">("attendance");
  const [selectedDate, setSelectedDate] = useState<string>("2026-02-28");
  const [selectedGradeId, setSelectedGradeId] = useState<string>(grades[0]?.id || "");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  // In-memory attendance draft for the current view
  const [attendanceDraft, setAttendanceDraft] = useState<{
    [studentId: string]: {
      status: "present" | "absent" | "late" | "excused";
      lateMinutes?: number;
      reason?: string;
    };
  }>({});

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Behavior Modal
  const [showBehaviorModal, setShowBehaviorModal] = useState(false);
  const [behaviorForm, setBehaviorForm] = useState<{
    studentId: string;
    type: "positive" | "negative" | "warning";
    title: string;
    description: string;
    points: number;
    actionTaken: string;
    notifyParent: boolean;
  }>({
    studentId: students[0]?.id || "",
    type: "positive",
    title: "مشاركة صفية متميزة وتفوق في الحساب",
    description: "أظهر الطالب مهارة استثنائية في حل المسائل وروح التعاون مع زملائه.",
    points: 10,
    actionTaken: "منح نقاط تميز وشهادة شكر أسبوعية",
    notifyParent: true,
  });

  // Filter students for attendance
  const currentStudents = students.filter((s) => {
    const matchGrade = selectedGradeId === "all" || s.gradeId === selectedGradeId;
    const matchSection = selectedSectionId === "all" || s.sectionId === selectedSectionId;
    return matchGrade && matchSection;
  });

  // Initialize or get status for a student
  const getStudentStatus = (studentId: string) => {
    if (attendanceDraft[studentId]) {
      return attendanceDraft[studentId];
    }
    const existing = attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === selectedDate
    );
    if (existing) {
      return {
        status: existing.status,
        lateMinutes: existing.lateMinutes,
        reason: existing.reason,
      };
    }
    return { status: "present" as const };
  };

  const handleSetStudentStatus = (
    studentId: string,
    status: "present" | "absent" | "late" | "excused"
  ) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        lateMinutes: status === "late" ? prev[studentId]?.lateMinutes || 15 : undefined,
      },
    }));
  };

  const handleMarkAll = (status: "present" | "absent") => {
    const updated: any = {};
    currentStudents.forEach((s) => {
      updated[s.id] = { status };
    });
    setAttendanceDraft((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveAttendance = () => {
    const batchList = currentStudents.map((s) => {
      const current = getStudentStatus(s.id);
      return {
        studentId: s.id,
        status: current.status,
        lateMinutes: current.lateMinutes,
        reason: current.reason,
      };
    });

    recordAttendanceBatch(batchList, selectedDate);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleSaveBehavior = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === behaviorForm.studentId);
    addBehaviorRecord({
      studentId: behaviorForm.studentId,
      studentName: std?.fullName || "طالب",
      gradeName: std?.gradeName || "الصف",
      date: selectedDate,
      type: behaviorForm.type,
      title: behaviorForm.title,
      description: behaviorForm.description,
      points: Number(behaviorForm.points),
      recordedBy: currentUser.fullName,
      actionTaken: behaviorForm.actionTaken,
      parentNotified: behaviorForm.notifyParent,
    });
    setShowBehaviorModal(false);
  };

  // Quick stats
  const totalInView = currentStudents.length;
  const presentCount = currentStudents.filter(
    (s) => getStudentStatus(s.id).status === "present"
  ).length;
  const lateCount = currentStudents.filter(
    (s) => getStudentStatus(s.id).status === "late"
  ).length;
  const absentCount = currentStudents.filter(
    (s) => getStudentStatus(s.id).status === "absent"
  ).length;
  const excusedCount = currentStudents.filter(
    (s) => getStudentStatus(s.id).status === "excused"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              سجل الحضور اليومي والانضباط السلوكي
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            رصد حضور وغياب الطلاب اليومي مع إشعارات أولياء الأمور، وسجل التميز والملاحظات السلوكية.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "attendance"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            سجل الحضور والغياب اليومي
          </button>
          <button
            onClick={() => setActiveTab("behavior")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "behavior"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            سجل الانضباط والسلوك ({behaviorRecords.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Daily Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">تاريخ اليوم</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">الصف</label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => setSelectedGradeId(e.target.value)}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="all">كل المراحل</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">الشعبة</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="all">كل الشعب</option>
                  {sections
                    .filter((s) => selectedGradeId === "all" || s.gradeId === selectedGradeId)
                    .map((sec) => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Quick Actions & Save Button */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => handleMarkAll("present")}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                تحديد الكل حاضر
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                اعتماد وحفظ السجل
              </button>
            </div>
          </div>

          {/* Quick Attendance Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 block">الحاضرون</span>
                <span className="text-xl font-black text-emerald-900">{presentCount}</span>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 block">المتأخرون</span>
                <span className="text-xl font-black text-amber-900">{lateCount}</span>
              </div>
              <Clock className="w-6 h-6 text-amber-600" />
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-800 block">غياب بعذر</span>
                <span className="text-xl font-black text-indigo-900">{excusedCount}</span>
              </div>
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>

            <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-800 block">غياب بدون عذر</span>
                <span className="text-xl font-black text-rose-900">{absentCount}</span>
              </div>
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold text-center animate-in fade-in">
              تم حفظ واعتماد كشف الحضور بنجاح وإرسال الإشعارات لأولياء الأمور!
            </div>
          )}

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3.5">الطالب / الرقم الأكاديمي</th>
                  <th className="p-3.5">الشعبة</th>
                  <th className="p-3.5 text-center">حالة الحضور</th>
                  <th className="p-3.5">دقائق التأخير / سبب الغياب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {currentStudents.map((std) => {
                  const curr = getStudentStatus(std.id);
                  return (
                    <tr key={std.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <img src={std.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                        <div>
                          <div>{std.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{std.studentNumber}</div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">{std.sectionName}</td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSetStudentStatus(std.id, "present")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              curr.status === "present"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            حاضر
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetStudentStatus(std.id, "late")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              curr.status === "late"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                            }`}
                          >
                            متأخر
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetStudentStatus(std.id, "excused")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              curr.status === "excused"
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                            }`}
                          >
                            عذر طبي
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetStudentStatus(std.id, "absent")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              curr.status === "absent"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                            }`}
                          >
                            غائب
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5">
                        {curr.status === "late" && (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500">تأخر:</span>
                            <input
                              type="number"
                              value={curr.lateMinutes || 15}
                              onChange={(e) =>
                                setAttendanceDraft((prev) => ({
                                  ...prev,
                                  [std.id]: {
                                    ...prev[std.id],
                                    status: "late",
                                    lateMinutes: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-16 p-1 rounded-lg border border-slate-200 text-center font-bold"
                            />
                            <span className="text-slate-500">دقيقة</span>
                          </div>
                        )}
                        {(curr.status === "absent" || curr.status === "excused") && (
                          <input
                            type="text"
                            placeholder="ملاحظات العذر أو سبب الغياب..."
                            value={curr.reason || ""}
                            onChange={(e) =>
                              setAttendanceDraft((prev) => ({
                                ...prev,
                                [std.id]: {
                                  ...prev[std.id],
                                  status: curr.status,
                                  reason: e.target.value,
                                },
                              }))
                            }
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Behavior Records */}
      {activeTab === "behavior" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">سجل الملاحظات السلوكية وبطاقات التميز</h3>
            <button
              onClick={() => setShowBehaviorModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              تسجيل ملاحظة سلوكية / تميز
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {behaviorRecords.map((beh) => (
              <div
                key={beh.id}
                className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${
                  beh.type === "positive"
                    ? "border-emerald-200 hover:border-emerald-300"
                    : beh.type === "warning"
                    ? "border-amber-200 hover:border-amber-300"
                    : "border-rose-200 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        beh.type === "positive"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : beh.type === "warning"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {beh.type === "positive" ? "⭐ تميز ومكافأة" : beh.type === "warning" ? "⚠️ إنذار سلوكي" : "🚨 مخالفة"}
                    </span>
                    <span className="text-[11px] text-slate-400">{beh.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">{beh.title}</h4>
                  <div className="text-xs text-indigo-700 font-semibold mt-0.5">
                    الطالب: {beh.studentName} ({beh.gradeName})
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                    {beh.description}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>الإجراء المتخذ:</span>
                      <span className="font-bold text-slate-900">{beh.actionTaken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>النقاط الممنوحة/المخصومة:</span>
                      <span className={`font-black ${beh.points >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {beh.points > 0 ? `+${beh.points}` : beh.points} نقطة
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>الموثق: {beh.recordedBy}</span>
                  {beh.parentNotified && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> تم إشعار ولي الأمر
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Behavior Record */}
      {showBehaviorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">توثيق سلوك أو تميز طلابي</h3>
            <form onSubmit={handleSaveBehavior} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اختر الطالب</label>
                <select
                  value={behaviorForm.studentId}
                  onChange={(e) => setBehaviorForm({ ...behaviorForm, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.gradeName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">نوع السجل</label>
                  <select
                    value={behaviorForm.type}
                    onChange={(e) => setBehaviorForm({ ...behaviorForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="positive">مكافأة وتميز (+)</option>
                    <option value="warning">إنذار وتنبيه</option>
                    <option value="negative">مخالفة سلوكية (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">النقاط</label>
                  <input
                    type="number"
                    value={behaviorForm.points}
                    onChange={(e) => setBehaviorForm({ ...behaviorForm, points: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الملاحظة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تفوق أكاديمي، مساعدة الزملاء، تأخر متكرر..."
                  value={behaviorForm.title}
                  onChange={(e) => setBehaviorForm({ ...behaviorForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تفاصيل الموقف</label>
                <textarea
                  rows={3}
                  required
                  value={behaviorForm.description}
                  onChange={(e) => setBehaviorForm({ ...behaviorForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الإجراء المتخذ / المكافأة</label>
                <input
                  type="text"
                  value={behaviorForm.actionTaken}
                  onChange={(e) => setBehaviorForm({ ...behaviorForm, actionTaken: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-slate-700 font-bold">
                  <input
                    type="checkbox"
                    checked={behaviorForm.notifyParent}
                    onChange={(e) => setBehaviorForm({ ...behaviorForm, notifyParent: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>إرسال إشعار فوري لولي الأمر عبر التطبيق والرسائل</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBehaviorModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  حفظ السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
