import { Student } from "../types";

export interface OfficialColumnDef {
  key: keyof Student | string;
  header: string;
  category: "personal" | "academic" | "family" | "finance" | "documents" | "contact2";
  width?: string;
}

export const OFFICIAL_STUDENT_COLUMNS: OfficialColumnDef[] = [
  // 1. التعريف والمعلومات الأساسية
  { key: "excelRowId", header: "id", category: "personal" },
  { key: "idcardNumber", header: "idcard", category: "personal" },
  { key: "firstName", header: "الاسم", category: "personal" },
  { key: "nisba", header: "النسبة", category: "personal" },
  { key: "kunya1", header: "الكنية1", category: "personal" },
  { key: "fatherNamePart", header: "الأب", category: "personal" },
  { key: "grandfatherName", header: "الجد", category: "personal" },
  { key: "motherNamePart", header: "الأم", category: "personal" },
  { key: "gender", header: "الجنس", category: "personal" },
  { key: "birthDateRaw", header: "تاريخ الولادة", category: "personal" },
  { key: "birthPlaceText", header: "مكان الولادة", category: "personal" },
  { key: "residencePlace", header: "مكان الإقامة", category: "personal" },
  { key: "addressDetail", header: "العنوان", category: "personal" },
  { key: "healthStatus", header: "الحالة الصحية", category: "personal" },
  { key: "talent", header: "الموهبة", category: "personal" },
  { key: "notes", header: "ملاحظات", category: "personal" },

  // 2. المعلومات الأكاديمية
  { key: "academicGradeText", header: "الصف الحالي", category: "academic" },
  { key: "sectionNameText", header: "الشعبة", category: "academic" },
  { key: "shift", header: "الفوج", category: "academic" },
  { key: "currentSchool", header: "اسم المدرسة", category: "academic" },
  { key: "gpaScore", header: "المعدل", category: "academic" },

  // 3. ولي الأمر وجهات الاتصال الأولى
  { key: "guardianName1", header: "اسم ولي الامر", category: "family" },
  { key: "guardianRelation1", header: "صلته بالطالب1", category: "family" },
  { key: "guardianJob1", header: "العمل1", category: "family" },
  { key: "guardianPhone1", header: "رقم الهاتف1", category: "family" },

  // 4. جهة الاتصال الثانية
  { key: "contactPerson2", header: "اسم شخص اخر2", category: "contact2" },
  { key: "contactKunya2", header: "الكنية2", category: "contact2" },
  { key: "contactRelation2", header: "صلته بالطالب2", category: "contact2" },
  { key: "contactJob2", header: "العمل2", category: "contact2" },
  { key: "contactPhone2", header: "رقم الهاتف2", category: "contact2" },

  // 5. الأقساط والرسوم المالية
  { key: "firstPayment", header: "الدفعة الأولى", category: "finance" },
  { key: "firstPaymentDate", header: "التاريخ1", category: "finance" },
  { key: "secondPayment", header: "الدفعة الثانية", category: "finance" },
  { key: "secondPaymentDate", header: "التاريخ 2", category: "finance" },
  { key: "totalPayments", header: "مجموع الدفعات", category: "finance" },
  { key: "remainingBalance", header: "الباقي", category: "finance" },
  { key: "transportationFee", header: "ثمن المواصلات", category: "finance" },
  { key: "uniformFee", header: "اللباس المدرسي", category: "finance" },
  { key: "booksFeeVal", header: "الكتب المدرسية", category: "finance" },
  { key: "syobisStatus", header: "syobis", category: "finance" },

  // 6. التسليمات والمستندات
  { key: "hasTransportation", header: "المواصلات", category: "documents" },
  { key: "receivedUniform", header: "تسليم لباس", category: "documents" },
  { key: "receivedBooks", header: "تسليم كتب", category: "documents" },
  { key: "lastReportCardCount", header: "صورة عن اخر جلاء او شهادة", category: "documents" },
  { key: "idCardFace2Count", header: "صورة عن الهوية الوجه الثاني", category: "documents" },
  { key: "idCardFace1Count", header: "صورة عن الهوية الوجه الاول", category: "documents" },
];
