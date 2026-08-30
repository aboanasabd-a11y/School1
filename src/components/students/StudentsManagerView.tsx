import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { Student } from "../../types";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  HeartPulse,
  FileText,
  Bus,
  CreditCard,
  Printer,
  CheckCircle,
  AlertCircle,
  Calendar,
  X,
  ShieldCheck,
  Award,
} from "lucide-react";

export const StudentsManagerView: React.FC = () => {
  const {
    students,
    grades,
    sections,
    busRoutes,
    addStudent,
    updateStudent,
    deleteStudent,
    addStudentDocument,
    recordPayment,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [filterBus, setFilterBus] = useState<string>("all");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<
    "personal" | "health" | "documents" | "academic" | "transport" | "finance" | "report_card"
  >("personal");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // New Doc upload modal
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [docForm, setDocForm] = useState({ title: "", type: "other" as any, fileSize: "1.2 MB" });

  // Quick payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(3000);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer" | "cash" | "cheque">("card");

  // Form State for Add / Edit
  const [studentForm, setStudentForm] = useState<{
    fullName: string;
    nationalId: string;
    birthDate: string;
    birthPlace: string;
    gender: "male" | "female";
    nationality: string;
    photo: string;
    address: string;
    bloodType: Student["bloodType"];
    gradeId: string;
    sectionId: string;
    enrollmentDate: string;
    academicStatus: Student["academicStatus"];
    previousSchool: string;
    healthRecord: Student["healthRecord"];
    familyInfo: Student["familyInfo"];
    transportation: Student["transportation"];
    finance: Student["finance"];
  }>({
    fullName: "",
    nationalId: "",
    birthDate: "2015-05-12",
    birthPlace: "الرياض",
    gender: "male",
    nationality: "سعودي",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
    address: "حي النرجس، شارع رقم 14، الرياض",
    bloodType: "O+",
    gradeId: grades[0]?.id || "",
    sectionId: sections[0]?.id || "",
    enrollmentDate: "2024-09-01",
    academicStatus: "active",
    previousSchool: "روضة الأجيال الأهلية",
    healthRecord: {
      bloodType: "O+",
      allergies: [],
      chronicConditions: [],
      emergencyMedicalNotes: "سليم ولله الحمد، لا توجد أمراض مزمنة",
      healthInsuranceNo: "INS-992014-KSA",
      doctorName: "د. خالد السالم",
      doctorPhone: "0501234567",
    },
    familyInfo: {
      fatherName: "عبد العزيز بن صالح المقرن",
      fatherJob: "مهندس اتصالات",
      fatherPhone: "0551234567",
      fatherEmail: "father@example.com",
      motherName: "نورة بنت عبد الله",
      motherJob: "أستاذة جامعية",
      motherPhone: "0559876543",
      motherEmail: "mother@example.com",
      guardianRelation: "الأب",
      emergencyContactName: "صالح المقرن (العم)",
      emergencyContactPhone: "0504445566",
      emergencyRelation: "العم",
      pickupAuthorizedPersons: [
        { name: "السائق كومار", relation: "سائق خاص", phone: "0556667788", idNumber: "2498765432" },
      ],
    },
    transportation: {
      usesBus: false,
      busTripType: "two_way",
      pickupStopName: "محطة حي النرجس 1",
      dropoffStopName: "محطة حي النرجس 1",
    },
    finance: {
      totalTuition: 18000,
      busFee: 3000,
      booksFee: 1200,
      discountType: "لا يوجد",
      discountAmount: 0,
      netAmount: 22200,
      paidAmount: 5000,
      balance: 17200,
      paymentPlan: "two_installments",
      status: "partial",
    },
  });

  const filteredStudents = students.filter((s) => {
    const matchQuery =
      s.fullName.includes(searchQuery) ||
      s.studentNumber.includes(searchQuery) ||
      s.nationalId.includes(searchQuery);

    const matchGrade = filterGrade === "all" || s.gradeId === filterGrade;
    const matchSection = filterSection === "all" || s.sectionId === filterSection;
    const matchBus =
      filterBus === "all" ||
      (filterBus === "uses_bus" ? s.transportation.usesBus : !s.transportation.usesBus);

    return matchQuery && matchGrade && matchSection && matchBus;
  });

  const handleOpenAdd = () => {
    setEditingStudentId(null);
    setStudentForm({
      fullName: "",
      nationalId: "",
      birthDate: "2016-04-10",
      birthPlace: "الرياض",
      gender: "male",
      nationality: "سعودي",
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop",
      address: "حي الياسمين، الرياض",
      bloodType: "A+",
      gradeId: grades[0]?.id || "",
      sectionId: sections[0]?.id || "",
      enrollmentDate: new Date().toISOString().split("T")[0],
      academicStatus: "active",
      previousSchool: "",
      healthRecord: {
        bloodType: "A+",
        allergies: [],
        chronicConditions: [],
        emergencyMedicalNotes: "سليم",
        healthInsuranceNo: "INS-2026-MED",
      },
      familyInfo: {
        fatherName: "",
        fatherJob: "موظف",
        fatherPhone: "05",
        fatherEmail: "",
        motherName: "",
        motherJob: "ربة منزل",
        motherPhone: "05",
        motherEmail: "",
        guardianRelation: "الأب",
        emergencyContactName: "",
        emergencyContactPhone: "05",
        emergencyRelation: "القرابة",
        pickupAuthorizedPersons: [],
      },
      transportation: {
        usesBus: false,
        busTripType: "two_way",
        pickupStopName: "",
        dropoffStopName: "",
      },
      finance: {
        totalTuition: 18000,
        busFee: 0,
        booksFee: 1000,
        discountType: "لا يوجد",
        discountAmount: 0,
        netAmount: 19000,
        paidAmount: 0,
        balance: 19000,
        paymentPlan: "two_installments",
        status: "pending",
      },
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setStudentForm({
      fullName: student.fullName,
      nationalId: student.nationalId,
      birthDate: student.birthDate,
      birthPlace: student.birthPlace,
      gender: student.gender,
      nationality: student.nationality,
      photo: student.photo,
      address: student.address,
      bloodType: student.bloodType,
      gradeId: student.gradeId,
      sectionId: student.sectionId,
      enrollmentDate: student.enrollmentDate,
      academicStatus: student.academicStatus,
      previousSchool: student.previousSchool || "",
      healthRecord: { ...student.healthRecord },
      familyInfo: { ...student.familyInfo },
      transportation: { ...student.transportation },
      finance: { ...student.finance },
    });
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grades.find((gr) => gr.id === studentForm.gradeId);
    const s = sections.find((sc) => sc.id === studentForm.sectionId);

    const net = studentForm.finance.totalTuition + studentForm.finance.busFee + studentForm.finance.booksFee - studentForm.finance.discountAmount;
    const balance = Math.max(0, net - studentForm.finance.paidAmount);
    const status = balance === 0 ? "paid" : studentForm.finance.paidAmount > 0 ? "partial" : "pending";

    if (editingStudentId) {
      updateStudent(editingStudentId, {
        ...studentForm,
        gradeName: g?.name,
        sectionName: s?.name,
        finance: {
          ...studentForm.finance,
          netAmount: net,
          balance,
          status,
        },
      });
    } else {
      addStudent({
        ...studentForm,
        gradeName: g?.name || "الصف الأول",
        sectionName: s?.name || "شعبة أ",
        documents: [
          {
            id: `doc-${Date.now()}-1`,
            title: "شهادة الميلاد وبطاقة العائلة",
            type: "birth_certificate",
            uploadDate: new Date().toISOString().split("T")[0],
            fileSize: "2.1 MB",
            status: "verified",
          },
          {
            id: `doc-${Date.now()}-2`,
            title: "كارت التطعيمات المعتمد",
            type: "immunization",
            uploadDate: new Date().toISOString().split("T")[0],
            fileSize: "1.4 MB",
            status: "verified",
          },
        ],
        academicHistory: [
          {
            year: "2024-2025",
            gradeName: "الصف التمهيدي",
            gpa: 98.5,
            ranking: 1,
            totalStudents: 25,
            conduct: "ممتاز",
            notes: "طالب متفوق ونشط",
          },
        ],
        finance: {
          ...studentForm.finance,
          netAmount: net,
          balance,
          status,
        },
      });
    }
    setShowAddModal(false);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    addStudentDocument(selectedStudent.id, {
      title: docForm.title,
      type: docForm.type,
      fileSize: docForm.fileSize,
    });
    setDocForm({ title: "", type: "other", fileSize: "1.2 MB" });
    setShowDocUploadModal(false);
  };

  const handleRecordQuickPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    recordPayment({
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      gradeName: selectedStudent.gradeName || "المرحلة",
      amount: paymentAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: paymentMethod,
      installmentName: "سداد دفعة من الرسوم الدراسية",
      receivedBy: "الاستقبال المالي",
      status: "completed",
    });

    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              إدارة شؤون الطلاب والملفات الأكاديمية الشاملة
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {students.length} طالباً مسجلاً
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            الملفات الشخصية، السجل الصحي، بيانات الأسرة والطوارئ، الأرشيف الرقمي، وتتبع الأقساط.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            تسجيل طالب جديد
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="بحث باسم الطالب، الرقم الأكاديمي، أو الهوية الوطنية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كل المراحل والصفوف</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كل الشعب الدراسية</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.roomNumber})</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={filterBus}
            onChange={(e) => setFilterBus(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كل خدمات النقل</option>
            <option value="uses_bus">مشترك بالحافلة</option>
            <option value="no_bus">نقل خاص / عائلي</option>
          </select>
        </div>
      </div>

      {/* Students List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
            <tr>
              <th className="p-3.5">الطالب</th>
              <th className="p-3.5">الرقم الأكاديمي</th>
              <th className="p-3.5">الصف / الشعبة</th>
              <th className="p-3.5">ولي الأمر والتواصل</th>
              <th className="p-3.5">الحالة الصحية</th>
              <th className="p-3.5">النقل المدرسي</th>
              <th className="p-3.5">الحالة المالية</th>
              <th className="p-3.5">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold flex items-center gap-2.5">
                  <img
                    src={student.photo}
                    alt={student.fullName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="text-slate-900">{student.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {student.gender === "male" ? "طالب" : "طالبة"} • {student.nationality}
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-mono font-semibold text-slate-700">
                  {student.studentNumber}
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{student.gradeName}</div>
                  <div className="text-[10px] text-slate-500">{student.sectionName}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{student.familyInfo?.fatherName || "—"}</div>
                  <div className="text-[10px] font-mono text-slate-500">{student.familyInfo?.fatherPhone || "—"}</div>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    فصيلة الدم {student.healthRecord?.bloodType || student.bloodType || "—"}
                  </span>
                </td>
                <td className="p-3.5">
                  {student.transportation?.usesBus ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                      <Bus className="w-3 h-3" />
                      مشترك بالباص
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">نقل خاص</span>
                  )}
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      student.finance.status === "paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : student.finance.status === "partial"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {student.finance.status === "paid"
                      ? "مسدد بالكامل"
                      : student.finance.status === "partial"
                      ? `مسدد جزئياً (متبقي: ${student.finance.balance} ر.س)`
                      : `مستحق السداد (${student.finance.balance} ر.س)`}
                  </span>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setProfileActiveTab("personal");
                      }}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="عرض الملف الشامل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(student)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStudent(student.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="أرشفة / حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Full Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black">{selectedStudent.fullName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      {selectedStudent.academicStatus === "active" ? "طالب مقيد ونشط" : "أرشيف"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-3 mt-1 font-mono">
                    <span>رقم الطالب: {selectedStudent.studentNumber}</span>
                    <span>•</span>
                    <span>الهوية: {selectedStudent.nationalId}</span>
                    <span>•</span>
                    <span>{selectedStudent.gradeName} - {selectedStudent.sectionName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tab Switcher */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
              <button
                onClick={() => setProfileActiveTab("personal")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  profileActiveTab === "personal"
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                البيانات الشخصية والأسرة
              </button>
              <button
                onClick={() => setProfileActiveTab("health")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  profileActiveTab === "health"
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                السجل الصحي والطبي
              </button>
              <button
                onClick={() => setProfileActiveTab("documents")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  profileActiveTab === "documents"
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                الوثائق والمستندات ({selectedStudent.documents.length})
              </button>
              <button
                onClick={() => setProfileActiveTab("academic")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  profileActiveTab === "academic"
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                التاريخ الأكاديمي والشهادات
              </button>
              <button
                onClick={() => setProfileActiveTab("transport")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  profileActiveTab === "transport"
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                النقل والمواصلات
              </button>
              <button
                onClick={() => setProfileActiveTab("finance")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  profileActiveTab === "finance"
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                الرسوم والأقساط
              </button>
            </div>

            {/* Profile Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {profileActiveTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">بيانات الطالب الشخصية</h4>
                    <div className="space-y-1.5 text-slate-600">
                      <div>تاريخ الميلاد: <strong className="text-slate-900 font-mono">{selectedStudent.birthDate}</strong> ({selectedStudent.birthPlace})</div>
                      <div>الجنسية: <strong className="text-slate-900">{selectedStudent.nationality}</strong></div>
                      <div>العنوان السكني: <strong className="text-slate-900">{selectedStudent.address}</strong></div>
                      <div>تاريخ التسجيل: <strong className="text-slate-900 font-mono">{selectedStudent.enrollmentDate}</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">بيانات الأسرة والتواصل</h4>
                    <div className="space-y-1.5 text-slate-600">
                      <div>اسم الأب: <strong className="text-slate-900">{selectedStudent.familyInfo?.fatherName || "—"}</strong> ({selectedStudent.familyInfo?.fatherJob || "—"})</div>
                      <div>جوال الأب: <strong className="text-slate-900 font-mono">{selectedStudent.familyInfo?.fatherPhone || "—"}</strong></div>
                      <div>اسم الأم: <strong className="text-slate-900">{selectedStudent.familyInfo?.motherName || "—"}</strong> ({selectedStudent.familyInfo?.motherJob || "—"})</div>
                      <div>جوال الأم: <strong className="text-slate-900 font-mono">{selectedStudent.familyInfo?.motherPhone || "—"}</strong></div>
                      <div>جهة الاتصال في الطوارئ: <strong className="text-rose-700">{selectedStudent.familyInfo?.emergencyContactName || "—"} ({selectedStudent.familyInfo?.emergencyContactPhone || "—"})</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {profileActiveTab === "health" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 font-bold">
                    <HeartPulse className="w-5 h-5" />
                    <span>السجل الطبي والإسعافي المعتمد</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-slate-700">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">فصيلة الدم</span>
                      <strong className="text-base text-slate-900">{selectedStudent.healthRecord?.bloodType || selectedStudent.bloodType || "—"}</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">رقم التأمين الصحي</span>
                      <strong className="text-slate-900 font-mono">{selectedStudent.healthRecord?.healthInsuranceNo || "—"}</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">طبيب العائلة</span>
                      <strong className="text-slate-900">{selectedStudent.healthRecord?.doctorName || "غير محدد"}</strong>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                    <span className="text-[10px] text-slate-400 block mb-1">ملاحظات طبية طارئة</span>
                    <p className="leading-relaxed">{selectedStudent.healthRecord?.emergencyMedicalNotes || "لا توجد ملاحظات طبية خاصة"}</p>
                  </div>
                </div>
              )}

              {profileActiveTab === "documents" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">الأرشيف الرقمي لوثائق الطالب</span>
                    <button
                      onClick={() => setShowDocUploadModal(true)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إرفاق وثيقة جديدة
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedStudent.documents.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          <div>
                            <div className="font-bold text-slate-900">{doc.title}</div>
                            <div className="text-[10px] text-slate-400">{doc.uploadDate} • {doc.fileSize}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          معتمد وموثق
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileActiveTab === "academic" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">السجل الأكاديمي والتحصيل السابق</h4>
                  <div className="space-y-2">
                    {selectedStudent.academicHistory.map((hist, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{hist.gradeName} ({hist.year})</div>
                          <div className="text-[10px] text-slate-500">الترتيب: {hist.ranking} من أصل {hist.totalStudents} طالباً • السلوك: {hist.conduct}</div>
                        </div>
                        <div className="text-left font-mono font-black text-indigo-700 text-sm">
                          {hist.gpa}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileActiveTab === "transport" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold">
                    <Bus className="w-5 h-5" />
                    <span>تفاصيل النقل والمواصلات</span>
                  </div>
                  <div className="text-slate-700 space-y-1.5">
                    <div>حالة الاشتراك: <strong>{selectedStudent.transportation.usesBus ? "مشترك في خدمة الحافلات المدرسية" : "نقل خاص"}</strong></div>
                    {selectedStudent.transportation.usesBus && (
                      <>
                        <div>نقطة الركوب الصباحية: <strong>{selectedStudent.transportation.pickupStopName}</strong></div>
                        <div>نقطة النزول المسائية: <strong>{selectedStudent.transportation.dropoffStopName}</strong></div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {profileActiveTab === "finance" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                      <CreditCard className="w-5 h-5" />
                      <span>الحساب المالي والأقساط</span>
                    </div>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[11px]"
                    >
                      تسجيل سداد فوري
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-slate-700">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">إجمالي الرسوم الصافية</span>
                      <strong className="text-slate-900">{(selectedStudent.finance?.netAmount ?? 0).toLocaleString()} ر.س</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">المبلغ المسدد</span>
                      <strong className="text-emerald-700">{(selectedStudent.finance?.paidAmount ?? 0).toLocaleString()} ر.س</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">المتبقي المطلوب</span>
                      <strong className="text-rose-700">{(selectedStudent.finance?.balance ?? 0).toLocaleString()} ر.س</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                طباعة الملف الشامل (PDF)
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingStudentId ? "تعديل بيانات الطالب" : "تسجيل وقبول طالب جديد"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الرباعي للطالب</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهوية الوطنية / الإقامة</label>
                  <input
                    type="text"
                    required
                    value={studentForm.nationalId}
                    onChange={(e) => setStudentForm({ ...studentForm, nationalId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ الميلاد</label>
                  <input
                    type="date"
                    required
                    value={studentForm.birthDate}
                    onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الجنس</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">فصيلة الدم</label>
                  <select
                    value={studentForm.bloodType}
                    onChange={(e) => setStudentForm({ ...studentForm, bloodType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المرحلة والصف الدراسي</label>
                  <select
                    value={studentForm.gradeId}
                    onChange={(e) => setStudentForm({ ...studentForm, gradeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الشعبة الدراسية</label>
                  <select
                    value={studentForm.sectionId}
                    onChange={(e) => setStudentForm({ ...studentForm, sectionId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.roomNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم الأب</label>
                  <input
                    type="text"
                    required
                    value={studentForm.familyInfo.fatherName}
                    onChange={(e) => setStudentForm({
                      ...studentForm,
                      familyInfo: { ...studentForm.familyInfo, fatherName: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم جوال الأب</label>
                  <input
                    type="text"
                    required
                    value={studentForm.familyInfo.fatherPhone}
                    onChange={(e) => setStudentForm({
                      ...studentForm,
                      familyInfo: { ...studentForm.familyInfo, fatherPhone: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  حفظ وتسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doc Upload Modal */}
      {showDocUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">إرفاق مستند جديد لملف الطالب</h3>
            <form onSubmit={handleUploadDoc} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الوثيقة</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: كشف درجات مصدق، شهادة نقل..."
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDocUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  رفع المستند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Pay Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">تسجيل سداد قسط للطالب: {selectedStudent.fullName}</h3>
            <form onSubmit={handleRecordQuickPayment} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المراد سداده (ر.س)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="card">بطاقة مدى / ائتمانية</option>
                  <option value="bank_transfer">تحويل بنكي</option>
                  <option value="cash">نقدي (كاش)</option>
                  <option value="cheque">شيك مصدق</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  تأكيد وسداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
