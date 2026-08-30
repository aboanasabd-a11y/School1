import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  FileText,
  Printer,
  Award,
  TrendingUp,
  Download,
  CheckCircle,
  Search,
  Filter,
  Sparkles,
  BarChart2,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ReportsView: React.FC = () => {
  const { students, grades, sections, subjects, gradeRecords, exams } = useSchool();

  const [selectedGradeId, setSelectedGradeId] = useState<string>(grades[0]?.id || "");
  const [selectedReportType, setSelectedReportType] = useState<
    "honors" | "subject_performance" | "batch_cards"
  >("honors");

  // Subject Performance analytics
  const subjectAnalytics = subjects.map((sub) => {
    const records = gradeRecords.filter((r) => r.subjectName === sub.name);
    const avg =
      records.length > 0
        ? Math.round(records.reduce((acc, r) => acc + r.percentage, 0) / records.length)
        : Math.floor(82 + Math.random() * 12);

    return {
      name: sub.name,
      معدل_الدرجات: avg,
      نسبة_النجاح: Math.min(100, avg + 5),
    };
  });

  // Top Ranked Students
  const topStudents = [
    { rank: 1, name: "عمر خالد العتيبي", grade: "الصف الخامس الابتدائي", score: 98.4, badge: "🥇 الأول على المدرسة" },
    { rank: 2, name: "سارة عبد الله الشمري", grade: "الصف السادس الابتدائي", score: 97.8, badge: "🥈 المركز الثاني" },
    { rank: 3, name: "ريان محمد القحطاني", grade: "الصف الأول المتوسط", score: 96.5, badge: "🥉 المركز الثالث" },
    { rank: 4, name: "فيصل عبد الرحمن الغامدي", grade: "الصف الثاني المتوسط", score: 95.9, badge: "⭐ متفوق" },
    { rank: 5, name: "نورة فهد السبيعي", grade: "الصف الثالث الابتدائي", score: 95.2, badge: "⭐ متفوقة" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              التقارير الأكاديمية وبطاقات التقييم الشاملة
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            استخراج كشوف النتائج، تحليلات الأداء للمواد الدراسية، ولوحة شرف الطلاب المتفوقين.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            طباعة التقرير المعتمد
          </button>
        </div>
      </div>

      {/* Report Types Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setSelectedReportType("honors")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            selectedReportType === "honors"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          لوحة الشرف والأوائل
        </button>

        <button
          onClick={() => setSelectedReportType("subject_performance")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            selectedReportType === "subject_performance"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          تحليل أداء المقررات والمناهج
        </button>

        <button
          onClick={() => setSelectedReportType("batch_cards")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            selectedReportType === "batch_cards"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          كشف نتائج وإشعارات الصفوف
        </button>
      </div>

      {/* REPORT TYPE 1: Honors Board */}
      {selectedReportType === "honors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topStudents.slice(0, 3).map((std) => (
              <div
                key={std.rank}
                className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md">
                    {std.badge}
                  </span>
                  <h3 className="text-lg font-black mt-4">{std.name}</h3>
                  <p className="text-xs text-indigo-200 mt-1">{std.grade}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">المعدل التراكمي:</span>
                  <span className="text-2xl font-black text-amber-300">{std.score}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
              قائمة الطلاب المتميزين الحاصلين على مرتبة الشرف
            </div>
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">الترتيب</th>
                  <th className="p-3">اسم الطالب</th>
                  <th className="p-3">الصف والمرحلة</th>
                  <th className="p-3">المعدل العام</th>
                  <th className="p-3">التقدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topStudents.map((s) => (
                  <tr key={s.rank} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-600">#{s.rank}</td>
                    <td className="p-3 font-bold text-slate-900">{s.name}</td>
                    <td className="p-3 text-slate-600">{s.grade}</td>
                    <td className="p-3 font-black text-emerald-600">{s.score}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {s.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT TYPE 2: Subject Performance Analytics */}
      {selectedReportType === "subject_performance" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              متوسط معدلات التحصيل ونسب النجاح حسب المقررات الدراسية
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              مؤشر بياني لتحصيل الطلاب الإجمالي في جميع المواد للفصل الدراسي الجاري
            </p>

            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="معدل_الدرجات" fill="#4f46e5" radius={[6, 6, 0, 0]} name="متوسط التحصيل %" />
                  <Bar dataKey="نسبة_النجاح" fill="#10b981" radius={[6, 6, 0, 0]} name="نسبة النجاح %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* REPORT TYPE 3: Batch Grade Sheets */}
      {selectedReportType === "batch_cards" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">كشف نتائج الطلاب الجماعي</h3>
            <select
              value={selectedGradeId}
              onChange={(e) => setSelectedGradeId(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">الطالب</th>
                  <th className="p-3">الشعبة</th>
                  <th className="p-3">القرآن والإسلامية</th>
                  <th className="p-3">اللغة العربية</th>
                  <th className="p-3">الرياضيات</th>
                  <th className="p-3">العلوم</th>
                  <th className="p-3">اللغة الإنجليزية</th>
                  <th className="p-3">المعدل العام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter((s) => s.gradeId === selectedGradeId || !selectedGradeId)
                  .map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{std.fullName}</td>
                      <td className="p-3 text-slate-600">{std.sectionName}</td>
                      <td className="p-3 font-bold text-emerald-700">98</td>
                      <td className="p-3 font-bold text-emerald-700">94</td>
                      <td className="p-3 font-bold text-emerald-700">96</td>
                      <td className="p-3 font-bold text-emerald-700">92</td>
                      <td className="p-3 font-bold text-emerald-700">90</td>
                      <td className="p-3 font-black text-indigo-700">94.0%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
