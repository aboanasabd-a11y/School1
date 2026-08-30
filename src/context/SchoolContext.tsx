import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AcademicYear,
  Grade,
  Section,
  Subject,
  Student,
  StaffMember,
  Exam,
  GradeRecord,
  Assignment,
  AttendanceRecord,
  BehaviorRecord,
  BusRoute,
  Announcement,
  DirectMessage,
  TimetableSlot,
  PaymentRecord,
  AuditLog,
  SystemBackup,
  UserAccount,
  UserRole,
  ActiveModule,
} from "../types";
import {
  initialAcademicYears,
  initialGrades,
  initialSections,
  initialSubjects,
  initialStudents,
  initialStaff,
  initialExams,
  initialGradeRecords,
  initialAssignments,
  initialAttendanceRecords,
  initialBehaviorRecords,
  initialBusRoutes,
  initialAnnouncements,
  initialDirectMessages,
  initialTimetableSlots,
  initialPayments,
  initialAuditLogs,
  initialBackups,
  userProfilesList,
} from "../data/initialData";

interface SchoolContextType {
  // Navigation
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;

  // State
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  userProfiles: UserAccount[];
  switchRole: (role: UserRole) => void;
  
  academicYears: AcademicYear[];
  grades: Grade[];
  sections: Section[];
  subjects: Subject[];
  students: Student[];
  staff: StaffMember[];
  exams: Exam[];
  gradeRecords: GradeRecord[];
  assignments: Assignment[];
  attendanceRecords: AttendanceRecord[];
  behaviorRecords: BehaviorRecord[];
  busRoutes: BusRoute[];
  announcements: Announcement[];
  directMessages: DirectMessage[];
  timetableSlots: TimetableSlot[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  backups: SystemBackup[];
  
  // Selected filter states
  selectedYear: string;
  setSelectedYear: (id: string) => void;
  selectedGradeId: string | null;
  setSelectedGradeId: (id: string | null) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;

  // Actions
  // Students
  addStudent: (student: Omit<Student, "id" | "studentNumber">) => void;
  updateStudent: (id: string, updatedData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addStudentDocument: (studentId: string, doc: { title: string; type: any; fileSize: string }) => void;
  
  // Staff
  addStaff: (member: Omit<StaffMember, "id" | "employeeNumber">) => void;
  updateStaff: (id: string, updatedData: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Academic Structure
  addGrade: (grade: Omit<Grade, "id">) => void;
  updateGrade: (id: string, data: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  addSection: (section: Omit<Section, "id">) => void;
  updateSection: (id: string, data: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Exams & Grading
  addExam: (exam: Omit<Exam, "id">) => void;
  recordGrade: (record: Omit<GradeRecord, "id">) => void;
  addAssignment: (assignment: Omit<Assignment, "id" | "assignedDate">) => void;

  // Attendance & Behavior
  recordAttendanceBatch: (records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; lateMinutes?: number; reason?: string }>, date: string) => void;
  addBehaviorRecord: (record: Omit<BehaviorRecord, "id">) => void;

  // Transportation
  updateBusGps: (routeId: string, gps: Partial<BusRoute["currentGps"]>) => void;
  addBusRoute: (route: Omit<BusRoute, "id">) => void;
  updateBusRoute: (id: string, data: Partial<BusRoute>) => void;

  // Communication
  addAnnouncement: (announcement: Omit<Announcement, "id" | "date" | "likesCount">) => void;
  toggleLikeAnnouncement: (id: string) => void;
  sendDirectMessage: (receiverId: string, subject: string, content: string) => void;
  replyDirectMessage: (messageId: string, content: string) => void;

  // Timetable
  saveTimetableSlot: (slot: Omit<TimetableSlot, "id">) => void;
  deleteTimetableSlot: (id: string) => void;

  // Finance
  recordPayment: (payment: Omit<PaymentRecord, "id" | "invoiceNumber" | "receiptNumber">) => void;

  // System, AI & Backup
  addAuditLog: (action: string, module: string, details: string, severity?: 'info' | 'warning' | 'critical') => void;
  createEncryptedBackup: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY = "PRIVATE_SCHOOL_MANAGEMENT_DATA_V1";

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>("dashboard");
  const [currentUser, setCurrentUser] = useState<UserAccount>(userProfilesList[0]);
  const [userProfiles] = useState<UserAccount[]>(userProfilesList);

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(initialAcademicYears);
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>(initialGradeRecords);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [behaviorRecords, setBehaviorRecords] = useState<BehaviorRecord[]>(initialBehaviorRecords);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(initialBusRoutes);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(initialDirectMessages);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(initialTimetableSlots);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [backups, setBackups] = useState<SystemBackup[]>(initialBackups);

  const [selectedYear, setSelectedYear] = useState<string>("year-2025-2026");
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.staff) setStaff(parsed.staff);
        if (parsed.grades) setGrades(parsed.grades);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.exams) setExams(parsed.exams);
        if (parsed.gradeRecords) setGradeRecords(parsed.gradeRecords);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.attendanceRecords) setAttendanceRecords(parsed.attendanceRecords);
        if (parsed.behaviorRecords) setBehaviorRecords(parsed.behaviorRecords);
        if (parsed.busRoutes) setBusRoutes(parsed.busRoutes);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.directMessages) setDirectMessages(parsed.directMessages);
        if (parsed.timetableSlots) setTimetableSlots(parsed.timetableSlots);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.backups) setBackups(parsed.backups);
      }
    } catch (e) {
      console.error("Failed loading stored data:", e);
    }
  }, []);

  // Save changes to local storage
  const persistState = () => {
    try {
      const stateToSave = {
        students,
        staff,
        grades,
        sections,
        subjects,
        exams,
        gradeRecords,
        assignments,
        attendanceRecords,
        behaviorRecords,
        busRoutes,
        announcements,
        directMessages,
        timetableSlots,
        payments,
        auditLogs,
        backups,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed saving state:", e);
    }
  };

  useEffect(() => {
    persistState();
  }, [
    students,
    staff,
    grades,
    sections,
    subjects,
    exams,
    gradeRecords,
    assignments,
    attendanceRecords,
    behaviorRecords,
    busRoutes,
    announcements,
    directMessages,
    timetableSlots,
    payments,
    auditLogs,
    backups,
  ]);

  const addAuditLog = (action: string, module: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString("en-GB", { timeZone: "Asia/Riyadh" }).replace(/\//g, "-"),
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      module,
      details,
      ipAddress: "192.168.1.10 (Azure UAE North)",
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const matched = userProfiles.find((u) => u.role === role) || userProfiles[0];
    setCurrentUser(matched);
    addAuditLog(`تبديل صلاحية المستخدم إلى ${role}`, "إدارة المستخدمين", `تم تسجيل الدخول بدور: ${matched.fullName}`);
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, "id" | "studentNumber">) => {
    const newId = `std-${Date.now()}`;
    const newStudentNumber = `STD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      studentNumber: newStudentNumber,
    };
    setStudents((prev) => [newStudent, ...prev]);
    // update grade and section count
    setGrades((prev) =>
      prev.map((g) => (g.id === newStudent.gradeId ? { ...g, studentsCount: g.studentsCount + 1 } : g))
    );
    setSections((prev) =>
      prev.map((s) => (s.id === newStudent.sectionId ? { ...s, currentStudentsCount: s.currentStudentsCount + 1 } : s))
    );
    addAuditLog("إضافة طالب جديد", "شؤون الطلاب", `تم تسجيل الطالب ${newStudent.fullName} بالرقم ${newStudentNumber}`);
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((std) => (std.id === id ? { ...std, ...updatedData } : std))
    );
    addAuditLog("تعديل بيانات طالب", "شؤون الطلاب", `تم تحديث ملف الطالب ID: ${id}`);
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addAuditLog("حذف ملف طالب", "شؤون الطلاب", `تم أرشفة/حذف ملف الطالب ${student.fullName}`, "warning");
  };

  const addStudentDocument = (studentId: string, doc: { title: string; type: any; fileSize: string }) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: doc.title,
      type: doc.type,
      uploadDate: new Date().toISOString().split("T")[0],
      fileSize: doc.fileSize,
      status: "verified" as const,
    };
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, documents: [...s.documents, newDoc] } : s
      )
    );
    addAuditLog("رفع وثيقة طالب", "إدارة الوثائق", `تمت إضافة وثيقة: ${doc.title}`);
  };

  // Staff Actions
  const addStaff = (memberData: Omit<StaffMember, "id" | "employeeNumber">) => {
    const newId = `staff-${Date.now()}`;
    const newEmpNo = `EMP-${Math.floor(2000 + Math.random() * 8000)}`;
    const newMember: StaffMember = {
      ...memberData,
      id: newId,
      employeeNumber: newEmpNo,
    };
    setStaff((prev) => [newMember, ...prev]);
    addAuditLog("إضافة موظف/معلم جديد", "الكادر التعليمي", `تم تعيين ${newMember.fullName} - ${newMember.specialization}`);
  };

  const updateStaff = (id: string, updatedData: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    addAuditLog("تحديث بيانات موظف", "الكادر التعليمي", `تم تعديل بيانات الموظف ID: ${id}`);
  };

  const deleteStaff = (id: string) => {
    const member = staff.find((s) => s.id === id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
    addAuditLog("حذف موظف", "الكادر التعليمي", `تم إنهاء خدمات الموظف ${member?.fullName || id}`, "warning");
  };

  // Academic Actions
  const addGrade = (gradeData: Omit<Grade, "id">) => {
    const newGrade: Grade = { ...gradeData, id: `grade-${Date.now()}` };
    setGrades((prev) => [...prev, newGrade]);
    addAuditLog("إضافة مرحلة/صف دراسي جديد", "إدارة الصفوف", `تم إنشاء: ${newGrade.name}`);
  };

  const updateGrade = (id: string, data: Partial<Grade>) => {
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const addSection = (secData: Omit<Section, "id">) => {
    const newSec: Section = { ...secData, id: `sec-${Date.now()}` };
    setSections((prev) => [...prev, newSec]);
    setGrades((prev) =>
      prev.map((g) => (g.id === newSec.gradeId ? { ...g, sectionsCount: g.sectionsCount + 1 } : g))
    );
    addAuditLog("إضافة شعبة جديدة", "إدارة الشعب", `تمت إضافة ${newSec.name}`);
  };

  const updateSection = (id: string, data: Partial<Section>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const addSubject = (subData: Omit<Subject, "id">) => {
    const newSub: Subject = { ...subData, id: `sub-${Date.now()}` };
    setSubjects((prev) => [...prev, newSub]);
    addAuditLog("إضافة مادة دراسية", "المقررات", `تم إنشاء المقرر ${newSub.name}`);
  };

  const updateSubject = (id: string, data: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Exams & Grading
  const addExam = (examData: Omit<Exam, "id">) => {
    const newExam: Exam = { ...examData, id: `exam-${Date.now()}` };
    setExams((prev) => [newExam, ...prev]);
    addAuditLog("جدولة امتحان جديد", "الامتحانات والتقييم", `تمت جدولة: ${newExam.title}`);
  };

  const recordGrade = (recordData: Omit<GradeRecord, "id">) => {
    const existingIndex = gradeRecords.findIndex(
      (r) => r.studentId === recordData.studentId && r.examId === recordData.examId
    );
    if (existingIndex >= 0) {
      setGradeRecords((prev) =>
        prev.map((r, i) => (i === existingIndex ? { ...r, ...recordData } : r))
      );
    } else {
      const newRec: GradeRecord = { ...recordData, id: `gr-${Date.now()}` };
      setGradeRecords((prev) => [newRec, ...prev]);
    }
    addAuditLog("رصد درجة امتحان", "الامتحانات والتقييم", `رصد علامة الطالب ${recordData.studentName} في ${recordData.subjectName}`);
  };

  const addAssignment = (asgData: Omit<Assignment, "id" | "assignedDate">) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      assignedDate: new Date().toISOString().split("T")[0],
    };
    setAssignments((prev) => [newAsg, ...prev]);
    addAuditLog("إضافة واجب مدرسي", "الواجبات والأنشطة", `تم تكليف واجب: ${newAsg.title}`);
  };

  // Attendance & Behavior
  const recordAttendanceBatch = (
    records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; lateMinutes?: number; reason?: string }>,
    date: string
  ) => {
    const newAttendanceList: AttendanceRecord[] = records.map((r) => {
      const std = students.find((s) => s.id === r.studentId);
      return {
        id: `att-${Date.now()}-${r.studentId}`,
        studentId: r.studentId,
        studentName: std?.fullName || "طالب",
        gradeId: std?.gradeId || "",
        sectionId: std?.sectionId || "",
        date,
        status: r.status,
        lateMinutes: r.lateMinutes,
        reason: r.reason,
        recordedBy: currentUser.fullName,
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      };
    });

    // Remove existing for this date & students then insert new
    const studentIds = new Set(records.map((r) => r.studentId));
    setAttendanceRecords((prev) => [
      ...newAttendanceList,
      ...prev.filter((item) => !(item.date === date && studentIds.has(item.studentId))),
    ]);
    addAuditLog("تسجيل حضور جماعي", "الحضور والسلوك", `تم رصد حضور ${records.length} طالباً بتاريخ ${date}`);
  };

  const addBehaviorRecord = (behData: Omit<BehaviorRecord, "id">) => {
    const newRec: BehaviorRecord = { ...behData, id: `beh-${Date.now()}` };
    setBehaviorRecords((prev) => [newRec, ...prev]);
    addAuditLog("توثيق ملاحظة سلوكية", "الحضور والسلوك", `${newRec.type === "positive" ? "مكافأة تميز" : "إجراء تأديبي"}: ${newRec.title} للطالب ${newRec.studentName}`);
  };

  // Transportation
  const updateBusGps = (routeId: string, gpsData: Partial<BusRoute["currentGps"]>) => {
    setBusRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId
          ? {
              ...r,
              currentGps: {
                ...r.currentGps,
                ...gpsData,
                lastUpdated: "مباشر الآن",
              },
            }
          : r
      )
    );
  };

  const addBusRoute = (routeData: Omit<BusRoute, "id">) => {
    const newRoute: BusRoute = { ...routeData, id: `bus-route-${Date.now()}` };
    setBusRoutes((prev) => [...prev, newRoute]);
    addAuditLog("إضافة مسار حافلة جديد", "المواصلات والنقل", `تمت إضافة ${newRoute.routeNumber}`);
  };

  const updateBusRoute = (id: string, data: Partial<BusRoute>) => {
    setBusRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  // Communication
  const addAnnouncement = (annData: Omit<Announcement, "id" | "date" | "likesCount">) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      likesCount: 0,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog("نشر إعلان مدرسي جديد", "التواصل والإعلانات", `تم نشر: ${newAnn.title}`);
  };

  const toggleLikeAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              likesCount: a.userLiked ? a.likesCount - 1 : a.likesCount + 1,
              userLiked: !a.userLiked,
            }
          : a
      )
    );
  };

  const sendDirectMessage = (receiverId: string, subject: string, content: string) => {
    const targetUser = userProfiles.find((u) => u.id === receiverId || u.linkedStaffId === receiverId || u.linkedStudentId === receiverId);
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      receiverId: receiverId,
      receiverName: targetUser?.fullName || "المستلم",
      receiverRole: targetUser?.role || "مستخدم",
      receiverAvatar: targetUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      subject,
      content,
      timestamp: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
      isRead: false,
      replies: [],
    };
    setDirectMessages((prev) => [newMsg, ...prev]);
    addAuditLog("إرسال رسالة مباشرة", "المراسلات والتواصل", `رسالة إلى ${newMsg.receiverName}: ${subject}`);
  };

  const replyDirectMessage = (messageId: string, content: string) => {
    const replyItem = {
      id: `rep-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content,
      timestamp: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
    };
    setDirectMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, replies: [...m.replies, replyItem] } : m
      )
    );
  };

  // Timetable
  const saveTimetableSlot = (slotData: Omit<TimetableSlot, "id">) => {
    const newSlot: TimetableSlot = { ...slotData, id: `tt-${Date.now()}` };
    setTimetableSlots((prev) => [
      ...prev.filter(
        (s) =>
          !(
            s.day === slotData.day &&
            s.periodNumber === slotData.periodNumber &&
            s.sectionId === slotData.sectionId
          )
      ),
      newSlot,
    ]);
    addAuditLog("تحديث البرنامج الأسبوعي", "البرنامج الأسبوعي", `حصة ${slotData.subjectName} يوم ${slotData.day} الحصة ${slotData.periodNumber}`);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetableSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Finance
  const recordPayment = (
    paymentData: Omit<PaymentRecord, "id" | "invoiceNumber" | "receiptNumber">
  ) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const receiptNumber = `REC-${Math.floor(900000 + Math.random() * 99999)}`;
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceNumber,
      receiptNumber,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Update student balance
    setStudents((prev) =>
      prev.map((std) => {
        if (std.id === paymentData.studentId) {
          const newPaid = std.finance.paidAmount + paymentData.amount;
          const newBalance = Math.max(0, std.finance.netAmount - newPaid);
          const newStatus = newBalance === 0 ? "paid" : "partial";
          return {
            ...std,
            finance: {
              ...std.finance,
              paidAmount: newPaid,
              balance: newBalance,
              status: newStatus,
            },
          };
        }
        return std;
      })
    );

    addAuditLog("سداد قسط مالي", "المالية والأقساط", `سداد مبلغ ${paymentData.amount} ر.س للطالب ${paymentData.studentName} بسند رقم ${receiptNumber}`);
  };

  // Backup & Import/Export
  const createEncryptedBackup = () => {
    const newBackup: SystemBackup = {
      id: `bk-${Date.now()}`,
      filename: `Azure_School_Encrypted_Backup_${new Date().toISOString().split("T")[0]}_${Math.floor(1000 + Math.random() * 9000)}.aes256`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      size: `${(45 + Math.random() * 5).toFixed(1)} MB`,
      recordsCount: students.length + staff.length + gradeRecords.length + payments.length,
      encrypted: true,
      cloudProvider: "Microsoft Azure Cloud (Blob Storage)",
      checksum: `sha256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status: "synced",
    };
    setBackups((prev) => [newBackup, ...prev]);
    addAuditLog("إنشاء نسخة احتياطية سحابية مشفرة", "الأمان والسحابة", `تم تصدير نسخة مشفرة AES-256 إلى Microsoft Azure Blob Storage`);
  };

  const exportDatabaseJson = () => {
    const fullDb = {
      exportDate: new Date().toISOString(),
      system: "Private School Management System - نظام إدارة المدرسة الخاصة",
      version: "2.5.0-Enterprise",
      cloudProvider: "Microsoft Azure GCC North",
      data: {
        academicYears,
        grades,
        sections,
        subjects,
        students,
        staff,
        exams,
        gradeRecords,
        assignments,
        attendanceRecords,
        behaviorRecords,
        busRoutes,
        announcements,
        directMessages,
        timetableSlots,
        payments,
        auditLogs,
      },
    };
    return JSON.stringify(fullDb, null, 2);
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      if (data.students) setStudents(data.students);
      if (data.staff) setStaff(data.staff);
      if (data.grades) setGrades(data.grades);
      if (data.sections) setSections(data.sections);
      if (data.subjects) setSubjects(data.subjects);
      if (data.exams) setExams(data.exams);
      if (data.gradeRecords) setGradeRecords(data.gradeRecords);
      if (data.assignments) setAssignments(data.assignments);
      if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
      if (data.behaviorRecords) setBehaviorRecords(data.behaviorRecords);
      if (data.busRoutes) setBusRoutes(data.busRoutes);
      if (data.announcements) setAnnouncements(data.announcements);
      if (data.directMessages) setDirectMessages(data.directMessages);
      if (data.timetableSlots) setTimetableSlots(data.timetableSlots);
      if (data.payments) setPayments(data.payments);
      addAuditLog("استيراد قاعدة بيانات", "إدارة النظام", "تم استيراد واستعادة قاعدة البيانات بنجاح");
      return true;
    } catch (e) {
      console.error("Failed to import JSON:", e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setAcademicYears(initialAcademicYears);
    setGrades(initialGrades);
    setSections(initialSections);
    setSubjects(initialSubjects);
    setStudents(initialStudents);
    setStaff(initialStaff);
    setExams(initialExams);
    setGradeRecords(initialGradeRecords);
    setAssignments(initialAssignments);
    setAttendanceRecords(initialAttendanceRecords);
    setBehaviorRecords(initialBehaviorRecords);
    setBusRoutes(initialBusRoutes);
    setAnnouncements(initialAnnouncements);
    setDirectMessages(initialDirectMessages);
    setTimetableSlots(initialTimetableSlots);
    setPayments(initialPayments);
    setAuditLogs(initialAuditLogs);
    setBackups(initialBackups);
    localStorage.removeItem(STORAGE_KEY);
    addAuditLog("إعادة ضبط المصنع", "إدارة النظام", "تمت استعادة البيانات الافتراضية النموذجية للمدرسة", "warning");
  };

  return (
    <SchoolContext.Provider
      value={{
        activeModule,
        setActiveModule,
        currentUser,
        setCurrentUser,
        userProfiles,
        switchRole,
        academicYears,
        grades,
        sections,
        subjects,
        students,
        staff,
        exams,
        gradeRecords,
        assignments,
        attendanceRecords,
        behaviorRecords,
        busRoutes,
        announcements,
        directMessages,
        timetableSlots,
        payments,
        auditLogs,
        backups,
        selectedYear,
        setSelectedYear,
        selectedGradeId,
        setSelectedGradeId,
        selectedSectionId,
        setSelectedSectionId,
        addStudent,
        updateStudent,
        deleteStudent,
        addStudentDocument,
        addStaff,
        updateStaff,
        deleteStaff,
        addGrade,
        updateGrade,
        deleteGrade,
        addSection,
        updateSection,
        deleteSection,
        addSubject,
        updateSubject,
        deleteSubject,
        addExam,
        recordGrade,
        addAssignment,
        recordAttendanceBatch,
        addBehaviorRecord,
        updateBusGps,
        addBusRoute,
        updateBusRoute,
        addAnnouncement,
        toggleLikeAnnouncement,
        sendDirectMessage,
        replyDirectMessage,
        saveTimetableSlot,
        deleteTimetableSlot,
        recordPayment,
        addAuditLog,
        createEncryptedBackup,
        exportDatabaseJson,
        importDatabaseJson,
        resetToDefaultData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
};
