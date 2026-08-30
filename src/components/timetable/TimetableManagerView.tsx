import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { TimetableSlot } from "../../types";
import {
  CalendarDays,
  Clock,
  Printer,
  Plus,
  BookOpen,
  User,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  X,
} from "lucide-react";

export const TimetableManagerView: React.FC = () => {
  const {
    sections,
    grades,
    subjects,
    staff,
    timetableSlots,
    saveTimetableSlot,
    deleteTimetableSlot,
  } = useSchool();

  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || "");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"by_section" | "by_teacher">("by_section");

  // Modal for editing/adding slot
  const [editingSlot, setEditingSlot] = useState<{
    day: TimetableSlot["day"];
    periodNumber: number;
    subjectId: string;
    teacherId: string;
    room: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const daysOfWeek: Array<{ key: TimetableSlot["day"]; label: string }> = [
    { key: "الأحد", label: "الأحد" },
    { key: "الإثنين", label: "الإثنين" },
    { key: "الثلاثاء", label: "الثلاثاء" },
    { key: "الأربعاء", label: "الأربعاء" },
    { key: "الخميس", label: "الخميس" },
  ];

  const periodTimes = [
    { period: 1, start: "07:30", end: "08:15" },
    { period: 2, start: "08:15", end: "09:00" },
    { period: 3, start: "09:00", end: "09:45" },
    { period: 4, start: "10:15", end: "11:00" }, // After 30m break
    { period: 5, start: "11:00", end: "11:45" },
    { period: 6, start: "11:45", end: "12:30" },
    { period: 7, start: "12:45", end: "01:30" }, // After prayer break
  ];

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleCellClick = (day: TimetableSlot["day"], periodNumber: number) => {
    const existing = timetableSlots.find(
      (s) =>
        s.day === day &&
        s.periodNumber === periodNumber &&
        (filterMode === "by_section" ? s.sectionId === selectedSectionId : s.teacherId === selectedTeacherId)
    );

    const timing = periodTimes.find((p) => p.period === periodNumber) || {
      start: "08:00",
      end: "08:45",
    };

    setEditingSlot({
      day,
      periodNumber,
      subjectId: existing?.subjectId || subjects[0]?.id || "",
      teacherId: existing?.teacherId || staff[0]?.id || "",
      room: existing?.room || currentSection?.roomNumber || "101",
      startTime: existing?.startTime || timing.start,
      endTime: existing?.endTime || timing.end,
    });
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    const sub = subjects.find((s) => s.id === editingSlot.subjectId);
    const teacher = staff.find((st) => st.id === editingSlot.teacherId);
    const sec = sections.find((s) => s.id === selectedSectionId);

    saveTimetableSlot({
      sectionId: selectedSectionId,
      sectionName: sec?.name || "شعبة",
      gradeId: sec?.gradeId || grades[0]?.id || "",
      day: editingSlot.day,
      periodNumber: editingSlot.periodNumber,
      subjectId: editingSlot.subjectId,
      subjectName: sub?.name || "مادة",
      teacherId: editingSlot.teacherId,
      teacherName: teacher?.fullName || "معلم",
      startTime: editingSlot.startTime,
      endTime: editingSlot.endTime,
      room: editingSlot.room,
    });

    setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              البرنامج الأسبوعي وجدول الحصص والدوام
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة توزيع الحصص الأسبوعية والمعلمين والقاعات الدراسية، وطباعة الجداول المعتمدة.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          طباعة الجدول الأسبوعي
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterMode("by_section")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === "by_section" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"
              }`}
            >
              جدول الشعبة والفصل
            </button>
            <button
              onClick={() => setFilterMode("by_teacher")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === "by_teacher" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"
              }`}
            >
              جدول المعلم
            </button>
          </div>

          {filterMode === "by_section" ? (
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.gradeName || "الصف"})
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="all">اختر المعلم</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.specialization})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          💡 انقر فوق أي حصة في الجدول لتعديل أو إضافة المادة والمعلم.
        </div>
      </div>

      {/* Weekly Grid Timetable Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse min-w-[800px]">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="p-3.5 border-l border-slate-800 text-center w-28">اليوم / الحصة</th>
                {periodTimes.map((p) => (
                  <th key={p.period} className="p-3.5 border-l border-slate-800 text-center">
                    <div>الحصة {p.period}</div>
                    <div className="text-[10px] text-slate-300 font-normal mt-0.5">
                      {p.start} - {p.end}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {daysOfWeek.map((d) => (
                <tr key={d.key} className="hover:bg-slate-50/50">
                  {/* Day Column */}
                  <td className="p-3.5 font-black text-slate-900 bg-slate-50 text-center border-l border-slate-200">
                    {d.label}
                  </td>

                  {/* Period Columns */}
                  {periodTimes.map((p) => {
                    const slot = timetableSlots.find(
                      (s) =>
                        s.day === d.key &&
                        s.periodNumber === p.period &&
                        (filterMode === "by_section"
                          ? s.sectionId === selectedSectionId
                          : s.teacherId === selectedTeacherId)
                    );

                    return (
                      <td
                        key={p.period}
                        onClick={() => handleCellClick(d.key, p.period)}
                        className="p-2 border-l border-slate-100 text-center cursor-pointer transition-colors hover:bg-indigo-50/50 group"
                      >
                        {slot ? (
                          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-right group-hover:border-indigo-400 transition-all shadow-2xs">
                            <div className="font-bold text-indigo-950 text-xs leading-tight">
                              {slot.subjectName}
                            </div>
                            <div className="text-[10px] text-indigo-700 font-medium mt-1 truncate">
                              {slot.teacherName}
                            </div>
                            <div className="text-[9px] text-slate-400 mt-0.5">
                              قاعة ({slot.room})
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-slate-300 group-hover:text-indigo-600 flex items-center justify-center">
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[11px] group-hover:hidden">-</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Timetable Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              تحديد الحصة {editingSlot.periodNumber} ({editingSlot.day})
            </h3>
            <p className="text-xs text-slate-500 mb-4">{currentSection?.name}</p>

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">المادة الدراسية</label>
                <select
                  value={editingSlot.subjectId}
                  onChange={(e) => setEditingSlot({ ...editingSlot, subjectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المعلم المسؤول</label>
                <select
                  value={editingSlot.teacherId}
                  onChange={(e) => setEditingSlot({ ...editingSlot, teacherId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القاعة</label>
                  <input
                    type="text"
                    value={editingSlot.room}
                    onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">من</label>
                  <input
                    type="time"
                    value={editingSlot.startTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">إلى</label>
                  <input
                    type="time"
                    value={editingSlot.endTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-3 py-1.5 text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  تثبيت الحصة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
