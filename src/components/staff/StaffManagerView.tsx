import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { StaffMember } from "../../types";
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Award,
  BookOpen,
  CheckCircle,
  Briefcase,
  Layers,
  X,
} from "lucide-react";

export const StaffManagerView: React.FC = () => {
  const { staff, grades, subjects, addStaff, updateStaff, deleteStaff } = useSchool();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");

  const [showModal, setShowModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [staffForm, setStaffForm] = useState<{
    fullName: string;
    nationalId: string;
    role: StaffMember["role"];
    specialization: string;
    qualification: string;
    phone: string;
    email: string;
    hireDate: string;
    salary: number;
    teachingSubjects: string[];
    assignedSections: string[];
    photo: string;
    bio: string;
    emergencyPhone: string;
  }>({
    fullName: "",
    nationalId: "",
    role: "teacher",
    specialization: "الرياضيات والحساب",
    qualification: "بكالوريوس رياضيات - جامعة الملك سعود",
    phone: "0501112233",
    email: "teacher@school.edu.sa",
    hireDate: "2023-08-20",
    salary: 12000,
    teachingSubjects: ["الرياضيات"],
    assignedSections: [grades[0]?.name || "الصف الأول"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "معلم متميز ذو خبرة تربوية تزيد عن 8 سنوات",
    emergencyPhone: "0509998877",
  });

  const specializations = [
    "القرآن الكريم والدراسات الإسلامية",
    "اللغة العربية وآدابها",
    "الرياضيات والحساب",
    "العلوم العامة والفيزياء",
    "اللغة الإنجليزية",
    "تقنية المعلومات والحاسب",
    "التربية البدنية والرياضية",
    "الإرشاد الطلابي والتوجيه",
    "الإدارة والقيادة المدرسية",
  ];

  const filteredStaff = staff.filter((member) => {
    const matchQuery =
      member.fullName.includes(searchQuery) ||
      member.employeeNumber.includes(searchQuery) ||
      member.specialization.includes(searchQuery);

    const matchRole = filterRole === "all" || member.role === filterRole;
    const matchSpec = filterSpecialization === "all" || member.specialization === filterSpecialization;

    return matchQuery && matchRole && matchSpec;
  });

  const handleOpenAdd = () => {
    setEditingStaffId(null);
    setStaffForm({
      fullName: "",
      nationalId: "",
      role: "teacher",
      specialization: "الرياضيات والحساب",
      qualification: "بكالوريوس تربوي",
      phone: "050",
      email: "staff@school.edu.sa",
      hireDate: new Date().toISOString().split("T")[0],
      salary: 10000,
      teachingSubjects: ["الرياضيات"],
      assignedSections: [grades[0]?.name || "الصف الأول"],
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      bio: "كادر تعليمي معتمد",
      emergencyPhone: "0509998877",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setStaffForm({
      fullName: member.fullName,
      nationalId: member.nationalId,
      role: member.role,
      specialization: member.specialization,
      qualification: member.qualification,
      phone: member.phone,
      email: member.email,
      hireDate: member.hireDate,
      salary: member.salary,
      teachingSubjects: member.teachingSubjects,
      assignedSections: member.assignedSections,
      photo: member.photo,
      bio: member.bio,
      emergencyPhone: member.emergencyPhone,
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaffId) {
      updateStaff(editingStaffId, staffForm);
    } else {
      addStaff({
        ...staffForm,
        status: "active",
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              الكادر التعليمي ونظام الاختصاصات الأكاديمية
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              {staff.length} معلماً وموظفاً
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة المعلمين، الاختصاصات العلمية، المؤهلات والأنصبة التدريسية، وملفات التواصل.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          إضافة معلم / موظف جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="بحث باسم المعلم، الرقم الوظيفي، أو الاختصاص..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كل الأدوار الوظيفية</option>
            <option value="teacher">كادر تعليمي (معلم)</option>
            <option value="principal">إدارة مدرسية</option>
            <option value="counselor">إرشاد طلابي</option>
            <option value="accountant">محاسب مالي</option>
            <option value="supervisor">إشراف ونقل</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كل الاختصاصات الأكاديمية</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.photo}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{member.fullName}</h3>
                    <div className="text-[11px] text-slate-400 font-mono">{member.employeeNumber}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {member.role === "teacher" ? "معلم" : member.role === "principal" ? "مدير" : "موظف"}
                </span>
              </div>

              {/* Specialization & Qualification */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50/60 px-3 py-1.5 rounded-xl font-bold">
                  <Award className="w-4 h-4" />
                  <span>{member.specialization}</span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {member.qualification}
                </div>

                <div className="border-t border-slate-100 pt-2 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-slate-700">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>المقررات: {member.teachingSubjects.join("، ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                الراتب: <strong className="text-slate-700">{member.salary.toLocaleString()} ر.س</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="تعديل البيانات"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteStaff(member.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingStaffId ? "تعديل بيانات المعلم/الموظف" : "تعيين موظف أو كادر تعليمي جديد"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الرباعي</label>
                  <input
                    type="text"
                    required
                    value={staffForm.fullName}
                    onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الهوية الوطنية / الإقامة</label>
                  <input
                    type="text"
                    required
                    value={staffForm.nationalId}
                    onChange={(e) => setStaffForm({ ...staffForm, nationalId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المسمى الوظيفي</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="teacher">معلم / كادر تعليمي</option>
                    <option value="principal">مدير / إدارة</option>
                    <option value="counselor">مرشد طلابي</option>
                    <option value="accountant">محاسب</option>
                    <option value="supervisor">مشرف نقل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاختصاص الأكاديمي</label>
                  <select
                    value={staffForm.specialization}
                    onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المؤهل العلمي والجامعة</label>
                <input
                  type="text"
                  required
                  value={staffForm.qualification}
                  onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الجوال</label>
                  <input
                    type="text"
                    required
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الراتب الشهري (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={staffForm.salary}
                    onChange={(e) => setStaffForm({ ...staffForm, salary: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ المباشرة</label>
                  <input
                    type="date"
                    required
                    value={staffForm.hireDate}
                    onChange={(e) => setStaffForm({ ...staffForm, hireDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
