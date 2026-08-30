import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { Exam, GradeRecord, Assignment } from "../../types";
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

  const [activeTab, setActiveTab] = useState<"exams" | "gradebook" | "assignments">("gradebook");
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || "");
  const [filterGrade, setFilterGrade] = useState<string>("all");

  // Modals
  const [showExamModal, setShowExamModal] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    type: "midterm" as Exam["type"],
    term: "الفصل الدراسي الثاني",
    subjectId: subjects[0]?.id || "",
    gradeId: grades[0]?.id || "",
    date: "2026-03-15",
    startTime: "08:00",
    endTime: "09:30",
    maxScore: 100,
    passingScore: 50,
    room: "القاعة الكبرى",
  });

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subjectId: subjects[0]?.id || "",
    gradeId: grades[0]?.id || "",
    dueDate: "2026-03-05",
    maxPoints: 10,
    description: "",
  });

  const [scoringStudent, setScoringStudent] = useState<{
    studentId: string;
    studentName: string;
    score: number;
    notes: string;
  } | null>(null);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grades.find((gr) => gr.id === examForm.gradeId);
    const s = subjects.find((sb) => sb.id === examForm.subjectId);
    addExam({
      ...examForm,
      gradeName: g?.name || "الصف",
      subjectName: s?.name || "المادة",
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
      teacherName: s?.teacherName || "المعلم",
      submissionsCount: 0,
      totalStudents: 25,
    });
    setShowAssignmentModal(false);
  };

  const handleSaveStudentGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringStudent || !currentExam) return;

    const max = currentExam.maxScore;
    const percentage = Math.round((scoringStudent.score / max) * 100);
    const isPassed = scoringStudent.score >= currentExam.passingScore;
    let letterGrade = "F";
    if (percentage >= 95) letterGrade = "A+";
    else if (percentage >= 90) letterGrade = "A";
    else if (percentage >= 80) letterGrade = "B";
    else if (percentage >= 70) letterGrade = "C";
    else if (percentage >= 60) letterGrade = "D";

    recordGrade({
      studentId: scoringStudent.studentId,
      studentName: scoringStudent.studentName,
      examId: currentExam.id,
      examTitle: currentExam.title,
      subjectName: currentExam.subjectName,
      score: scoringStudent.score,
      maxScore: max,
      percentage,
      letterGrade,
      isPassed,
      notes: scoringStudent.notes,
      recordedDate: new Date().toISOString().split("T")[0],
    });

    setScoringStudent(null);
  };

  // Exam students list for Gradebook
  const examStudents = students.filter(
    (s) => !currentExam || s.gradeId === currentExam.gradeId
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              نظام الامتحانات والرصد والواجبات المدرسية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            جدولة الاختبارات، إدخال الدرجات ورصد المعدلات تلقائياً، ومتابعة الواجبات اليومية.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("gradebook")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "gradebook"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            سجل رصد الدرجات (Gradebook)
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "exams"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            جدول الامتحانات ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "assignments"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الواجبات والتكاليف ({assignments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Gradebook */}
      {activeTab === "gradebook" && (
        <div className="space-y-4">
          {/* Exam Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                اختر الاختبار للرصد:
              </span>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full sm:w-80 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} - ({exam.gradeName})
                  </option>
                ))}
              </select>
            </div>

            {currentExam && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">
                  المادة: <strong className="text-slate-900">{currentExam.subjectName}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  الدرجة الكبرى: <strong className="text-indigo-600">{currentExam.maxScore}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  النجاح من: <strong className="text-emerald-600">{currentExam.passingScore}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Gradebook Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3.5">الطالب / الرقم الأكاديمي</th>
                    <th className="p-3.5">الشعبة</th>
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

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <img src={std.avatar} className="w-7 h-7 rounded-lg object-cover" alt="" />
                          <div>
                            <div>{std.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{std.studentNumber}</div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">{std.sectionName}</td>
                        <td className="p-3.5">
                          {record ? (
                            <span className="font-bold text-indigo-700 text-sm">
                              {record.score} <span className="text-slate-400 text-xs font-normal">/ {record.maxScore}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">غير مرصود</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {record ? (
                            <span className="font-bold text-slate-900">{record.percentage}%</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-3.5">
                          {record ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-indigo-50 text-indigo-700">
                              {record.letterGrade}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-3.5">
                          {record ? (
                            record.isPassed ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> ناجح
                              </span>
                            ) : (
                              <span className="text-rose-600 font-bold">راسب (دور ثانٍ)</span>
                            )
                          ) : (
                            <span className="text-amber-600 text-[11px]">بانتظار الرصد</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate">
                          {record?.notes || "-"}
                        </td>
                        <td className="p-3.5 text-left">
                          <button
                            onClick={() =>
                              setScoringStudent({
                                studentId: std.id,
                                studentName: std.fullName,
                                score: record?.score ?? (currentExam ? currentExam.maxScore * 0.9 : 90),
                                notes: record?.notes || "مستوى ممتاز ومتميز في الإجابة",
                              })
                            }
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
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

      {/* TAB 2: Scheduled Exams List */}
      {activeTab === "exams" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">جدول ومواعيد الاختبارات المعتمدة</h3>
            <button
              onClick={() => setShowExamModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              جدولة امتحان جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {exam.type === "midterm" ? "اختبار نصفي" : exam.type === "final" ? "اختبار نهائي" : "اختبار فصلي"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{exam.term}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-2">{exam.title}</h4>
                  <p className="text-xs text-indigo-600 font-semibold mt-0.5">{exam.subjectName} - {exam.gradeName}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span>التاريخ والوقت:</span>
                      <span className="font-bold text-slate-800">{exam.date} ({exam.startTime} - {exam.endTime})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>القاعة الامتحانية:</span>
                      <span className="font-bold text-slate-800">{exam.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الدرجة الكبرى / النجاح:</span>
                      <span className="font-bold text-slate-900">{exam.maxScore} / {exam.passingScore}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> معتمد
                  </span>
                  <button
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setActiveTab("gradebook");
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    رصد درجات الصف ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Assignments */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">الواجبات والتكليفات المدرسية</h3>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
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
                  <span className="text-xs font-bold text-slate-700">{asg.maxPoints} نقاط</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{asg.title}</h4>
                <p className="text-xs text-indigo-600 font-medium">{asg.subjectName} ({asg.gradeName})</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{asg.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    تم التسليم: <strong className="text-slate-900">{asg.submissionsCount}</strong> / {asg.totalStudents}
                  </span>
                  <span className="text-[11px] text-slate-400">بواسطة: {asg.teacherName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Exam */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">جدولة اختبار جديد</h3>
            <form onSubmit={handleSaveExam} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الامتحان</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: اختبار منتصف الفصل - الرياضيات"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الصف</label>
                  <select
                    value={examForm.gradeId}
                    onChange={(e) => setExamForm({ ...examForm, gradeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المادة</label>
                  <select
                    value={examForm.subjectId}
                    onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
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
                  <label className="block text-slate-700 font-bold mb-1">إلى الساعة</label>
                  <input
                    type="time"
                    value={examForm.endTime}
                    onChange={(e) => setExamForm({ ...examForm, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدرجة الكبرى</label>
                  <input
                    type="number"
                    value={examForm.maxScore}
                    onChange={(e) => setExamForm({ ...examForm, maxScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">درجة النجاح</label>
                  <input
                    type="number"
                    value={examForm.passingScore}
                    onChange={(e) => setExamForm({ ...examForm, passingScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القاعة</label>
                  <input
                    type="text"
                    value={examForm.room}
                    onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  حفظ وجدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Score Student Grade */}
      {scoringStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              رصد درجة: {scoringStudent.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{currentExam?.title} (الدرجة القصوى: {currentExam?.maxScore})</p>

            <form onSubmit={handleSaveStudentGrade} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الدرجة المحصلة</label>
                <input
                  type="number"
                  step="0.5"
                  max={currentExam?.maxScore || 100}
                  min={0}
                  required
                  value={scoringStudent.score}
                  onChange={(e) =>
                    setScoringStudent({ ...scoringStudent, score: Number(e.target.value) })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-lg font-black text-indigo-700"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">ملاحظات المعلم والتقييم النوعي</label>
                <textarea
                  rows={3}
                  value={scoringStudent.notes}
                  onChange={(e) =>
                    setScoringStudent({ ...scoringStudent, notes: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScoringStudent(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  تأكيد ورصد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Assignment */}
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
                      <option key={g.id} value={g.id}>{g.name}</option>
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
                      <option key={s.id} value={s.id}>{s.name}</option>
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
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
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
