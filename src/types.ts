export type ActiveModule =
  | 'dashboard'
  | 'school'
  | 'students'
  | 'staff'
  | 'exams'
  | 'attendance'
  | 'transport'
  | 'communication'
  | 'timetable'
  | 'reports'
  | 'finance'
  | 'settings';

export type UserRole = 
  | 'super_admin' 
  | 'principal' 
  | 'teacher' 
  | 'parent' 
  | 'accountant' 
  | 'bus_supervisor';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  avatar: string;
  permissions: string[];
  linkedStudentId?: string;
  linkedStaffId?: string;
  lastLogin?: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2025 - 2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: { id: string; name: string; isCurrent: boolean }[];
  status: 'active' | 'upcoming' | 'archived';
}

export interface Grade {
  id: string;
  name: string; // e.g. "الصف الأول الأساسي"
  code: string;
  stage: 'kg' | 'primary' | 'middle' | 'high';
  academicYearId: string;
  annualTuition: number;
  sectionsCount: number;
  studentsCount: number;
}

export interface Section {
  id: string;
  name: string; // e.g. "الشعبة أ", "الشعبة ب"
  gradeId: string;
  gradeName?: string;
  classroom: string;
  roomNumber: string;
  maxCapacity: number;
  currentStudentsCount: number;
  supervisorTeacherId: string;
  supervisorTeacherName?: string;
}

export interface Subject {
  id: string;
  name: string; // e.g. "اللغة العربية", "الرياضيات"
  code: string;
  gradeId: string;
  gradeName?: string;
  creditHours: number;
  maxScore: number;
  passScore: number;
  teacherId: string;
  teacherName?: string;
  iconName?: string;
}

export interface StudentDocument {
  id: string;
  title: string;
  type: 'birth_certificate' | 'passport' | 'immunization' | 'transfer_cert' | 'national_id' | 'other';
  uploadDate: string;
  fileSize: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface StudentAcademicHistory {
  year: string;
  gradeName: string;
  gpa: number;
  ranking: number;
  totalStudents: number;
  conduct: string;
  notes: string;
}

export interface Student {
  id: string;
  studentNumber: string; // e.g. "STD-2026-042"
  nationalId: string;
  fullName: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthPlace: string;
  nationality: string;
  photo: string;
  address: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  
  // Academic Placement
  gradeId: string;
  gradeName?: string;
  sectionId: string;
  sectionName?: string;
  enrollmentDate: string;
  academicStatus: 'active' | 'graduated' | 'transferred' | 'suspended';
  previousSchool?: string;
  
  // Medical & Health Record
  healthRecord: {
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
    emergencyMedicalNotes: string;
    healthInsuranceNo: string;
    doctorName?: string;
    doctorPhone?: string;
  };

  // Family & Emergency Contacts
  familyInfo: {
    fatherName: string;
    fatherJob: string;
    fatherPhone: string;
    fatherEmail: string;
    motherName: string;
    motherJob: string;
    motherPhone: string;
    motherEmail: string;
    guardianRelation: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyRelation: string;
    pickupAuthorizedPersons: { name: string; relation: string; phone: string; idNumber: string }[];
  };

  // Documents
  documents: StudentDocument[];

  // Academic History
  academicHistory: StudentAcademicHistory[];

  // Transportation
  transportation: {
    usesBus: boolean;
    busRouteId?: string;
    busRouteName?: string;
    busTripType: 'two_way' | 'morning_only' | 'afternoon_only' | 'none';
    pickupStopName?: string;
    dropoffStopName?: string;
  };

  // Financial Status
  finance: {
    totalTuition: number;
    busFee: number;
    booksFee: number;
    discountType: string;
    discountAmount: number;
    netAmount: number;
    paidAmount: number;
    balance: number;
    paymentPlan: 'single' | 'two_installments' | 'four_installments' | 'monthly';
    status: 'paid' | 'partial' | 'overdue' | 'pending';
  };
}

export interface StaffMember {
  id: string;
  employeeNumber: string;
  fullName: string;
  role: 'principal' | 'teacher' | 'admin' | 'accountant' | 'counselor' | 'bus_driver' | 'supervisor';
  email: string;
  phone: string;
  nationalId: string;
  hireDate: string;
  qualification: string;
  specialization: string;
  teachingSubjects: string[]; // Subject IDs or Names
  assignedSections: string[]; // Section IDs or Names
  salary: number;
  status: 'active' | 'on_leave' | 'resigned';
  photo: string;
  bio: string;
  emergencyPhone: string;
}

export interface Exam {
  id: string;
  title: string;
  type: 'midterm' | 'final' | 'monthly' | 'quiz' | 'coursework';
  subjectId: string;
  subjectName: string;
  gradeId: string;
  gradeName: string;
  sectionId?: string;
  date: string;
  durationMinutes: number;
  maxMarks: number;
  passMarks: number;
  weighting: number; // e.g. 20% or 40%
  term: 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث';
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  gradeId: string;
  sectionId: string;
  examId?: string;
  examTitle: string;
  examType: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  notes?: string;
  term: string;
  date: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  gradeId: string;
  gradeName: string;
  sectionId: string;
  sectionName: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  assignedDate: string;
  maxScore: number;
  description: string;
  submissionsCount: number;
  totalStudents: number;
  status: 'open' | 'closed' | 'graded';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeId: string;
  sectionId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  lateMinutes?: number;
  reason?: string;
  recordedBy: string;
  time?: string;
}

export interface BehaviorRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeName: string;
  sectionName: string;
  date: string;
  type: 'positive' | 'negative';
  category: 'honor' | 'merit' | 'warning' | 'disciplinary' | 'tardiness';
  points: number; // e.g. +5 or -3
  title: string;
  description: string;
  actionTaken?: string;
  reportedBy: string;
  parentNotified: boolean;
  status: 'resolved' | 'under_review' | 'pending';
}

export interface BusStop {
  id: string;
  name: string;
  estimatedMorningTime: string;
  estimatedAfternoonTime: string;
  lat: number;
  lng: number;
  studentsCount: number;
}

export interface BusRoute {
  id: string;
  routeNumber: string; // e.g. "باص 01 - مسار النرجس"
  busPlate: string;
  busModel: string;
  driverName: string;
  driverPhone: string;
  supervisorName: string;
  supervisorPhone: string;
  capacity: number;
  registeredStudentsCount: number;
  morningDepartureTime: string;
  afternoonDepartureTime: string;
  stops: BusStop[];
  currentGps: {
    lat: number;
    lng: number;
    speed: number;
    heading: string;
    lastUpdated: string;
    status: 'on_morning_route' | 'on_afternoon_route' | 'idle_at_school' | 'parked';
    currentStopIndex: number;
  };
  activeStudentsIds: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  targetAudience: 'all' | 'teachers' | 'parents' | 'grade' | 'section';
  targetGradeName?: string;
  targetSectionName?: string;
  priority: 'normal' | 'important' | 'urgent';
  attachments?: { name: string; url: string; size: string; type: string }[];
  likesCount: number;
  userLiked?: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  receiverAvatar: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  replies: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  }[];
}

export interface TimetableSlot {
  id: string;
  day: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  periodNumber: number; // 1 to 7
  startTime: string;
  endTime: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
  colorBg?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  gradeName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'cheque';
  receiptNumber: string;
  installmentName: string; // e.g. "الدفعة الأولى", "قسط الفصل الثاني"
  receivedBy: string;
  notes?: string;
  status: 'completed' | 'pending' | 'refunded';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SystemBackup {
  id: string;
  filename: string;
  timestamp: string;
  size: string;
  recordsCount: number;
  encrypted: boolean;
  cloudProvider: 'Microsoft Azure Cloud (Blob Storage)' | 'Local Secure Snapshot';
  checksum: string;
  status: 'synced' | 'pending' | 'verifying';
}
