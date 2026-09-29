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
  Link as LinkIcon,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  School,
  CheckSquare,
  Square,
  Lock,
  Key,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export const StaffManagerView: React.FC = () => {
  const {
    staff,
    grades,
    sections,
    subjects,
    addSubject,
    addStaff,
    updateStaff,
    deleteStaff,
    generateTeacherDirectLink,
    applyDirectLinkAccess,
    setActiveModule,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");

  const [showModal, setShowModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Teacher Link Share Modal state
  const [shareTeacherModal, setShareTeacherModal] = useState<StaffMember | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
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
    assignedGrades: string[];
    username: string;
    password: string;
    photo: string;
    bio: string;
    emergencyPhone: string;
  }>({
    fullName: "",
    nationalId: "",
    role: "teacher",
    specialization: "الرياضيات والحساب",
    qualification: "بكالوريوس رياضيات تربوي",
    phone: "0501112233",
    email: "teacher@school.edu.sa",
    hireDate: "2023-08-20",
    salary: 12000,
    teachingSubjects: [subjects[0]?.name || "الرياضيات والحساب"],
    assignedSections: [sections[0]?.name || "شعبة (أ) - الأول الابتدائي"],
    assignedGrades: [grades[0]?.id || "grade-1"],
    username: "",
    password: "123",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "معلم متميز ذو خبرة تربوية تزيد عن 8 سنوات",
    emergencyPhone: "0509998877",
  });

  const [customSubjectInput, setCustomSubjectInput] = useState("");

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

  // Distinct subjects list from school
  const allAvailableSubjects = Array.from(
    new Set([
      ...subjects.map((s) => s.name),
      "لغتي الجميلة (اللغة العربية)",
      "الرياضيات والحساب",
      "العلوم العامة",
      "التربية الإسلامية والقرآن الكريم",
      "اللغة الإنجليزية (English World)",
      "الفيزياء المتقدمة",
      "الكيمياء العامة",
      "الحاسب الآلي والذكاء الاصطناعي",
      "التربية الفنية والمهنية",
      "التربية البدنية",
      "الاجتماعيات والمواطنة",
    ])
  );

  const filteredStaff = staff.filter((member) => {
    const matchQuery =
      (member.fullName || "").includes(searchQuery) ||
      (member.employeeNumber || "").includes(searchQuery) ||
      (member.specialization || "").includes(searchQuery) ||
      (member.teachingSubjects || []).some((sub) => sub.includes(searchQuery));

    const matchRole = filterRole === "all" || member.role === filterRole;
    const matchSpec =
      filterSpecialization === "all" || member.specialization === filterSpecialization;

    return matchQuery && matchRole && matchSpec;
  });

  const handleOpenAdd = () => {
    setEditingStaffId(null);
    setShowPassword(false);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
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
      teachingSubjects: [allAvailableSubjects[0]],
      assignedSections: [sections[0]?.name || "شعبة (أ) - الأول الابتدائي"],
      assignedGrades: [grades[0]?.id || "grade-1"],
      username: `teacher.${randomSuffix}`,
      password: "123",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      bio: "كادر تعليمي معتمد ومؤهل",
      emergencyPhone: "0509998877",
    });
    setCustomSubjectInput("");
    setShowModal(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setShowPassword(false);
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
      teachingSubjects: member.teachingSubjects || [],
      assignedSections: member.assignedSections || [],
      assignedGrades: member.assignedGrades || [],
      username: member.username || `teacher.${member.employeeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      password: member.password || "123",
      photo: member.photo,
      bio: member.bio,
      emergencyPhone: member.emergencyPhone,
    });
    setCustomSubjectInput("");
    setShowModal(true);
  };

  const handleToggleSubject = (subjectName: string) => {
    setStaffForm((prev) => {
      const exists = prev.teachingSubjects.includes(subjectName);
      if (exists) {
        return {
          ...prev,
          teachingSubjects: prev.teachingSubjects.filter((s) => s !== subjectName),
        };
      } else {
        return {
          ...prev,
          teachingSubjects: [...prev.teachingSubjects, subjectName],
        };
      }
    });
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSubjectInput.trim();
    if (!trimmed) return;
    if (!staffForm.teachingSubjects.includes(trimmed)) {
      setStaffForm((prev) => ({
        ...prev,
        teachingSubjects: [...prev.teachingSubjects, trimmed],
      }));
    }
    // Also officially register it as a school subject if not existing
    if (!subjects.some((s) => s.name === trimmed)) {
      const targetGradeId = staffForm.assignedGrades[0] || grades[0]?.id || "grade-1";
      const targetGrade = grades.find((g) => g.id === targetGradeId);
      addSubject({
        name: trimmed,
        code: `SUB-${Math.floor(100 + Math.random() * 900)}`,
        gradeId: targetGradeId,
        gradeName: targetGrade?.name || "الصف الدراسي",
        creditHours: 4,
        maxScore: 100,
        passScore: 50,
        teacherId: editingStaffId || "",
        teacherName: staffForm.fullName,
      });
    }
    setCustomSubjectInput("");
  };

  const handleToggleSection = (sectionName: string, gradeId: string) => {
    setStaffForm((prev) => {
      const exists = prev.assignedSections.includes(sectionName);
      let updatedSections: string[];
      if (exists) {
        updatedSections = prev.assignedSections.filter((s) => s !== sectionName);
      } else {
        updatedSections = [...prev.assignedSections, sectionName];
      }

      // Recompute assigned grades
      const updatedGradesSet = new Set(prev.assignedGrades || []);
      if (!exists) {
        updatedGradesSet.add(gradeId);
      }
      return {
        ...prev,
        assignedSections: updatedSections,
        assignedGrades: Array.from(updatedGradesSet),
      };
    });
  };

  const handleToggleAllSectionsForGrade = (gradeId: string) => {
    const gradeSecs = sections.filter((s) => s.gradeId === gradeId);
    const gradeSecNames = gradeSecs.map((s) => s.name);
    const allSelected = gradeSecNames.every((name) =>
      staffForm.assignedSections.includes(name)
    );

    setStaffForm((prev) => {
      let nextSections = [...prev.assignedSections];
      let nextGrades = new Set(prev.assignedGrades || []);

      if (allSelected) {
        // Deselect all for this grade
        nextSections = nextSections.filter((s) => !gradeSecNames.includes(s));
        nextGrades.delete(gradeId);
      } else {
        // Select all
        gradeSecNames.forEach((n) => {
          if (!nextSections.includes(n)) nextSections.push(n);
        });
        nextGrades.add(gradeId);
      }

      return {
        ...prev,
        assignedSections: nextSections,
        assignedGrades: Array.from(nextGrades),
      };
    });
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

  // Helper to open link modal
  const handleOpenShare = (member: StaffMember) => {
    setShareTeacherModal(member);
    setCopiedLink(false);
  };

  const teacherDirectUrl = shareTeacherModal
    ? generateTeacherDirectLink(shareTeacherModal.id)
    : "";

  const generalTeacherPortalUrl = `${window.location.origin}${window.location.pathname}?portal=teacher`;

  const copyTeacherCredentials = () => {
    if (!shareTeacherModal) return;
    const username =
      shareTeacherModal.username ||
      `teacher.${shareTeacherModal.employeeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const password = shareTeacherModal.password || "123";
    const text = `السلام عليكم ورحمة الله، أستاذ/ة: ${shareTeacherModal.fullName}\nرابط بوابتك التعليمية الخاصة بنظام المدرسة:\n🔗 ${teacherDirectUrl}\n\nبيانات تسجيل الدخول الرسمية:\n- اسم المستخدم: ${username}\n- كلمة المرور: ${password}\n- رقم المعلم الوظيفي: ${shareTeacherModal.employeeNumber}\n\nالمواد المكلف بها: ${(shareTeacherModal.teachingSubjects || []).join("، ")}\nالصفوف والشعب المسندة: ${(shareTeacherModal.assignedSections || []).join("، ")}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareViaWhatsApp = () => {
    if (!shareTeacherModal) return;
    const username =
      shareTeacherModal.username ||
      `teacher.${shareTeacherModal.employeeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const password = shareTeacherModal.password || "123";
    const phone = (shareTeacherModal.phone || "").replace(/[^0-9]/g, "");
    const cleanPhone = phone.startsWith("966")
      ? phone
      : "966" + phone.replace(/^0+/, "");
    const msg = `السلام عليكم أستاذ/ة: *${shareTeacherModal.fullName}*\nرابط بوابتك التعليمية المباشرة:\n🔗 ${teacherDirectUrl}\n\nبيانات تسجيل الدخول:\n- اسم المستخدم: *${username}*\n- كلمة المرور: *${password}*\n- الرقم الوظيفي: ${shareTeacherModal.employeeNumber}\n\nستظهر لك في البوابة فقط المواد والصفوف الموكل بها.`;
    const waUrl = `https://wa.me/${phone ? cleanPhone : ""}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const testLoginAsTeacher = () => {
    if (!shareTeacherModal) return;
    applyDirectLinkAccess("teacher", shareTeacherModal.id);
    setActiveModule("portal_teacher");
    setShareTeacherModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              الكادر التعليمي وتخصيص المواد والصفوف
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              {staff.length} معلماً وموظفاً
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة المعلمين، إسناد المواد والصفوف بدقة، وتوليد روابط دخول المعلمين برقمهم واسمهم لاستعراض بياناتهم الموكلين بها فقط.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          إضافة معلم / موظف وتحديد الصفوف والمواد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="بحث باسم المعلم، الرقم الوظيفي، المادة، أو الصف..."
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
              <option key={spec} value={spec}>
                {spec}
              </option>
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
              {/* Header profile info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.photo}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{member.fullName}</h3>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <span>رقم المعلم:</span>
                      <strong className="text-slate-800">{member.employeeNumber}</strong>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {member.role === "teacher"
                    ? "معلم"
                    : member.role === "principal"
                    ? "مدير"
                    : "موظف"}
                </span>
              </div>

              {/* Specialization & Qualification */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50/70 px-3 py-1.5 rounded-xl font-bold">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>{member.specialization}</span>
                </div>

                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {member.qualification}
                </div>

                {/* Assigned Subjects */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>المواد المكلف بتدريسها ({member.teachingSubjects?.length || 0}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.teachingSubjects && member.teachingSubjects.length > 0 ? (
                      member.teachingSubjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold"
                        >
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400">لم يتم تحديد مواد بعد</span>
                    )}
                  </div>
                </div>

                {/* Assigned Classes & Sections */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-emerald-600" />
                    <span>الصفوف والشعب الموكل بها ({member.assignedSections?.length || 0}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.assignedSections && member.assignedSections.length > 0 ? (
                      member.assignedSections.map((sec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                        >
                          {sec}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400">لم يتم تحديد صفوف بعد</span>
                    )}
                  </div>
                </div>

                {/* Contact phone */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-slate-700 font-bold">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[130px]">{member.email}</span>
                  </div>
                </div>

                {/* Login Credentials Badge (Username & Password) */}
                {member.role === "teacher" && (
                  <div className="pt-2 border-t border-slate-100 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-950 font-bold">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>اسم المستخدم:</span>
                        <strong className="font-mono text-xs text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                          {member.username || `teacher.${member.employeeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 font-mono">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        <span>كلمة السر:</span>
                        <strong className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-900 font-bold">
                          {member.password || "123"}
                        </strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-indigo-100/80 text-[10px] text-indigo-800">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>يدخل للصفوف والمواد الموكل بها فقط</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          applyDirectLinkAccess("teacher", member.id);
                          setActiveModule("portal_teacher");
                        }}
                        className="text-indigo-700 hover:text-indigo-900 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                        title="تجربة الدخول الفوري بحساب هذا المعلم"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>دخول كمعلم</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {/* Send Teacher Link Button */}
              <button
                onClick={() => handleOpenShare(member)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="إرسال رابط المعلم مع اسمه ورقمه للدخول"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>إرسال رابط المعلم</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="تعديل المواد والصفوف والبيانات"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteStaff(member.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Link / Credentials Share Modal */}
      {shareTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <LinkIcon className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">إرسال رابط بوابة المعلم وبيانات الدخول</h3>
                  <p className="text-[11px] text-sky-200">
                    رابط مخصص للمعلم يتيح له الدخول ورؤية بياناته الموكل بها فقط
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShareTeacherModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Teacher Summary Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={shareTeacherModal.photo}
                  alt={shareTeacherModal.fullName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-200"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {shareTeacherModal.fullName}
                  </h4>
                  <div className="text-[11px] text-slate-600 flex items-center gap-3 mt-0.5">
                    <span>
                      رقم المعلم:{" "}
                      <strong className="text-blue-700">{shareTeacherModal.employeeNumber}</strong>
                    </span>
                    <span>
                      الجوال:{" "}
                      <strong className="text-slate-800 font-mono">{shareTeacherModal.phone}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Credentials Box required by user prompt */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 text-slate-800 space-y-2.5">
                <div className="font-bold text-indigo-950 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>بيانات الدخول الرسمية وحساب المعلم للموقع:</span>
                  </div>
                  <span className="text-[10px] bg-white text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                    دخول محدد بالصفوف والمواد
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-2xs">
                    <span className="text-slate-500 block text-[10px] font-bold">1. اسم المستخدم (Username):</span>
                    <strong className="text-indigo-900 text-xs block mt-1 font-mono bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                      {shareTeacherModal.username || `teacher.${shareTeacherModal.employeeNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-2xs">
                    <span className="text-slate-500 block text-[10px] font-bold">
                      2. كلمة المرور (Password):
                    </span>
                    <strong className="text-slate-900 text-xs block mt-1 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      {shareTeacherModal.password || "123"}
                    </strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-indigo-900 font-medium bg-white/70 p-2 rounded-lg border border-indigo-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    عند دخول المعلم باسم المستخدم وكلمة المرور هذه، ستظهر له حصراً الصفوف والمواد المكلف بها أدناه.
                  </span>
                </div>
              </div>

              {/* Assigned Scope Summary */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    المواد المسندة للمعلم:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(shareTeacherModal.teachingSubjects || []).map((sub, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-[11px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    الصفوف والشعب الموكل بها:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(shareTeacherModal.assignedSections || []).map((sec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px]"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Link Input with Copy */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  رابط المعلم المباشر:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={teacherDirectUrl}
                    className="flex-1 p-2.5 bg-slate-100 rounded-xl text-slate-700 font-mono text-[11px] border border-slate-300 select-all"
                  />
                  <button
                    onClick={copyTeacherCredentials}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط والبيانات</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={shareViaWhatsApp}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر واتساب للمعلم</span>
                </button>

                <button
                  type="button"
                  onClick={testLoginAsTeacher}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>دخول واستعراض كمعلم الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingStaffId
                    ? "تعديل بيانات المعلم وتعيين المواد والصفوف"
                    : "إضافة معلم / كادر تعليمي وتحديد المواد والصفوف"}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  حدد المواد والصفوف التي يدرسها لتخصيص بوابة مستقلة له يظهر بها عمله فقط
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:opacity-80 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    الاسم الرباعي للمعلم / الموظف *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أ. فاطمة الزهراء الشامي"
                    value={staffForm.fullName}
                    onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    الهوية الوطنية / الإقامة *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10 أرقام"
                    value={staffForm.nationalId}
                    onChange={(e) => setStaffForm({ ...staffForm, nationalId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Role & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المسمى الوظيفي</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="teacher">معلم / كادر تعليمي (له بوابة تدريس ومواد)</option>
                    <option value="principal">مدير / إدارة مدرسية</option>
                    <option value="counselor">مرشد طلابي</option>
                    <option value="accountant">محاسب مالي</option>
                    <option value="supervisor">مشرف حافلات ونقل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاختصاص الأكاديمي</label>
                  <select
                    value={staffForm.specialization}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, specialization: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Core Feature Request: 1. SUBJECTS SELECTION */}
              {staffForm.role === "teacher" && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-700" />
                      <label className="font-black text-blue-900 text-xs">
                        تحديد المواد التي يدرسها المعلم (المقررات المسندة):
                      </label>
                    </div>
                    <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {staffForm.teachingSubjects.length} مادة مختارة
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    انقر على المواد التي سيتولى المعلم تدريسها ورصد درجاتها وتقييم طلابها:
                  </p>

                  {/* Badges of subjects */}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-blue-100">
                    {allAvailableSubjects.map((subName) => {
                      const isSelected = staffForm.teachingSubjects.includes(subName);
                      return (
                        <button
                          key={subName}
                          type="button"
                          onClick={() => handleToggleSubject(subName)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-2xs scale-102"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{subName}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Subject */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="إضافة مادة مخصصة أخرى..."
                      value={customSubjectInput}
                      onChange={(e) => setCustomSubjectInput(e.target.value)}
                      className="flex-1 p-2 bg-white rounded-xl border border-blue-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSubject}
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      إضافة للمواد
                    </button>
                  </div>
                </div>
              )}

              {/* Core Feature Request: 2. GRADES AND SECTIONS SELECTION */}
              {staffForm.role === "teacher" && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-emerald-700" />
                      <label className="font-black text-emerald-900 text-xs">
                        تحديد الصفوف والشعب الموكل بتدريسها (الفصول الدراسية):
                      </label>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      {staffForm.assignedSections.length} شعبة موكلة
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    اختر الفصول والشعب التي يدخلها المعلم؛ لن تظهر له سوى بيانات طلاب هذه الصفوف:
                  </p>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto p-1">
                    {grades.map((grade) => {
                      const gradeSecs = sections.filter((s) => s.gradeId === grade.id);
                      const allSelected =
                        gradeSecs.length > 0 &&
                        gradeSecs.every((s) => staffForm.assignedSections.includes(s.name));

                      return (
                        <div
                          key={grade.id}
                          className="bg-white p-2.5 rounded-xl border border-emerald-100 space-y-2"
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <span className="font-bold text-slate-900 text-xs">
                              {grade.name}
                            </span>
                            {gradeSecs.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleToggleAllSectionsForGrade(grade.id)}
                                className="text-[10px] text-emerald-700 hover:underline font-bold"
                              >
                                {allSelected ? "إلغاء تحديد كل الشعب" : "تحديد كافة الشعب"}
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {gradeSecs.length > 0 ? (
                              gradeSecs.map((sec) => {
                                const isChecked = staffForm.assignedSections.includes(sec.name);
                                return (
                                  <button
                                    key={sec.id}
                                    type="button"
                                    onClick={() => handleToggleSection(sec.name, grade.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isChecked
                                        ? "bg-emerald-600 text-white shadow-2xs scale-102"
                                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                                    }`}
                                  >
                                    {isChecked ? (
                                      <CheckSquare className="w-3.5 h-3.5" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span>{sec.name}</span>
                                  </button>
                                );
                              })
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                لا توجد شعب مسجلة لهذا الصف
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Core Feature Request: 3. USERNAME AND PASSWORD (بيانات تسجيل دخول المعلم) */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="font-black text-indigo-950 text-xs block">
                        بيانات تسجيل الدخول وحساب المعلم للموقع *
                      </label>
                      <span className="text-[10.5px] text-indigo-700">
                        اكتب اسم المستخدم وكلمة المرور التي سيستخدمها المعلم للدخول
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    دخول فوري معتمد
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Username Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-bold text-[11px] flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>اسم المستخدم للدخول (Username) *</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const clean = staffForm.fullName
                            ? staffForm.fullName.replace(/^أ\.\s*/, "").split(" ")[0].trim()
                            : "teacher";
                          const random = Math.floor(100 + Math.random() * 900);
                          setStaffForm({
                            ...staffForm,
                            username: `teacher.${clean.toLowerCase().replace(/[^a-z0-9]/g, "") || "user"}${random}`,
                          });
                        }}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                      >
                        توليد تلقائي
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="مثال: teacher.fatima أو ahmad2026"
                      value={staffForm.username}
                      onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-indigo-200 bg-white font-mono text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-bold text-[11px] flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        <span>كلمة المرور (Password) *</span>
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setStaffForm({ ...staffForm, password: "123" })}
                          className="text-slate-500 hover:text-indigo-700 font-mono font-bold hover:underline cursor-pointer"
                        >
                          123
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setStaffForm({ ...staffForm, password: "123456" })}
                          className="text-slate-500 hover:text-indigo-700 font-mono font-bold hover:underline cursor-pointer"
                        >
                          123456
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="أدخل كلمة المرور"
                        value={staffForm.password}
                        onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                        className="w-full p-2.5 pr-3 pl-9 rounded-xl border border-indigo-200 bg-white font-mono text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-2.5 top-2.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                        title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white/80 rounded-xl border border-indigo-100 text-[10.5px] text-indigo-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    يستطيع المعلم الدخول للموقع باسم المستخدم وكلمة المرور هذه، وسيُسمح له بالدخول فقط للصفوف والمواد الموكل بها.
                  </span>
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  المؤهل العلمي والجامعة
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.qualification}
                  onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    رقم الجوال (يستخدم للدخول إلى البوابة) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="05xxxxxxxx"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Salary & Hire Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الراتب الشهري (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={staffForm.salary}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, salary: Number(e.target.value) })
                    }
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

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors shadow-sm"
                >
                  {editingStaffId ? "تحديث وحفظ التكليفات" : "حفظ المعلم وإصدار الرابط"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
