import * as XLSX from "xlsx";
import { Student } from "../types";
import { OFFICIAL_STUDENT_COLUMNS } from "../data/officialStudentSchema";

/**
 * Converts a Student record into a structured object matching the exact column order:
 * id, idcard, الاسم, النسبة, الكنية1, الأب, الجد, الأم, الجنس, تاريخ الولادة, مكان الولادة,
 * مكان الإقامة, العنوان, الحالة الصحية, الموهبة, ملاحظات, الصف الحالي, الشعبة, الفوج, اسم المدرسة,
 * المعدل, اسم ولي الامر, صلته بالطالب1, العمل1, رقم الهاتف1, اسم شخص اخر2, الكنية2, صلته بالطالب2,
 * العمل2, رقم الهاتف2, الدفعة الأولى, التاريخ1, الدفعة الثانية, التاريخ 2, مجموع الدفعات, الباقي,
 * ثمن المواصلات, اللباس المدرسي, الكتب المدرسية, syobis, المواصلات, تسليم لباس, تسليم كتب,
 * صورة عن اخر جلاء او شهادة, صورة عن الهوية الوجه الثاني, صورة عن الهوية الوجه الاول
 */
export function studentToOfficialRow(s: Student): Record<string, any> {
  const row: Record<string, any> = {};

  OFFICIAL_STUDENT_COLUMNS.forEach((col) => {
    let val: any = (s as any)[col.key];

    // Fallbacks and formatting
    if (col.key === "gender") {
      val = s.gender === "female" ? "انثى" : "ذكر";
    } else if (col.key === "firstName") {
      val = s.firstName || s.fullName.split(" ")[0] || "";
    } else if (col.key === "academicGradeText") {
      val = s.academicGradeText || s.gradeName || "";
    } else if (col.key === "sectionNameText") {
      val = s.sectionNameText || s.sectionName || "";
    } else if (col.key === "currentSchool") {
      val = s.currentSchool || s.previousSchool || "";
    } else if (col.key === "addressDetail") {
      val = s.addressDetail || s.address || "";
    } else if (col.key === "guardianName1") {
      val = s.guardianName1 || s.familyInfo?.fatherName || "";
    } else if (col.key === "guardianJob1") {
      val = s.guardianJob1 || s.familyInfo?.fatherJob || "";
    } else if (col.key === "guardianPhone1") {
      val = s.guardianPhone1 || s.familyInfo?.fatherPhone || "";
    } else if (col.key === "guardianRelation1") {
      val = s.guardianRelation1 || s.familyInfo?.guardianRelation || "والده";
    } else if (col.key === "firstPayment") {
      val = s.firstPayment !== undefined ? s.firstPayment : (s.finance?.paidAmount || 0);
    } else if (col.key === "remainingBalance") {
      val = s.remainingBalance !== undefined ? s.remainingBalance : (s.finance?.balance || 0);
    } else if (col.key === "transportationFee") {
      val = s.transportationFee !== undefined ? s.transportationFee : (s.finance?.busFee || 0);
    } else if (col.key === "booksFeeVal") {
      val = s.booksFeeVal !== undefined ? s.booksFeeVal : (s.finance?.booksFee || 0);
    } else if (col.key === "hasTransportation") {
      val = s.hasTransportation !== undefined ? (s.hasTransportation ? "TRUE" : "FALSE") : (s.transportation?.usesBus ? "TRUE" : "FALSE");
    } else if (col.key === "receivedUniform") {
      val = s.receivedUniform ? "TRUE" : "FALSE";
    } else if (col.key === "receivedBooks") {
      val = s.receivedBooks ? "TRUE" : "FALSE";
    } else if (col.key === "syobisStatus") {
      val = s.syobisStatus ? "TRUE" : "FALSE";
    }

    if (val === undefined || val === null) {
      val = "";
    }

    row[col.header] = val;
  });

  return row;
}

/**
 * Converts a raw imported row into a partial or full Student record
 */
export function officialRowToStudent(
  row: Record<string, any>,
  index: number,
  existingGrades: { id: string; name: string }[] = [],
  existingSections: { id: string; name: string }[] = []
): Student {
  const getVal = (keys: string[]): any => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && row[k] !== "") {
        return row[k];
      }
      // Also check normalized key
      const trimmedK = k.trim().replace(/\s+/g, " ");
      for (const rk of Object.keys(row)) {
        if (rk.trim().replace(/\s+/g, " ") === trimmedK && row[rk] !== undefined && row[rk] !== null && row[rk] !== "") {
          return row[rk];
        }
      }
    }
    return "";
  };

  const toBool = (val: any): boolean => {
    if (typeof val === "boolean") return val;
    const str = String(val).trim().toUpperCase();
    return str === "TRUE" || str === "1" || str === "نعم" || str === "صح";
  };

  const toNum = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const idVal = toNum(getVal(["id", "ID", "ت"])) || (index + 1);
  const idcardVal = String(getVal(["idcard", "id_card", "الهوية", "الرقم الوطني"])).trim();
  const firstName = String(getVal(["الاسم", "اسم الطالب"])).trim();
  const nisba = String(getVal(["النسبة"])).trim();
  const kunya1 = String(getVal(["الكنية1", "الكنية 1", "الكنية"])).trim();
  const fatherName = String(getVal(["الأب", "اسم الأب", "الاب"])).trim();
  const grandfatherName = String(getVal(["الجد", "اسم الجد"])).trim();
  const motherName = String(getVal(["الأم", "اسم الأم", "الام"])).trim();
  const genderRaw = String(getVal(["الجنس"])).trim().toLowerCase();
  const gender: "male" | "female" = genderRaw.includes("انث") || genderRaw.includes("أنث") || genderRaw === "female" ? "female" : "male";

  // Full Name synthesis if composite exists
  let fullName = firstName;
  if (!fullName) {
    fullName = `طالب رقم ${idVal}`;
  } else {
    // If only first name, check if we have father & nisba
    const parts = [firstName];
    if (fatherName && !firstName.includes(fatherName)) parts.push(fatherName);
    if (nisba && !firstName.includes(nisba)) parts.push(nisba);
    else if (kunya1 && !firstName.includes(kunya1)) parts.push(kunya1);
    fullName = parts.join(" ");
  }

  const birthDateRaw = String(getVal(["تاريخ الولادة", "تاريخ الميلاد"])).trim();
  const birthPlaceText = String(getVal(["مكان الولادة"])).trim();
  const residencePlace = String(getVal(["مكان الإقامة", "الاقامة", "مكان الاقامة"])).trim();
  const addressDetail = String(getVal(["العنوان", "العنوان التفصيلي", "السكن"])).trim();
  const healthStatus = String(getVal(["الحالة الصحية", "الصحة"])).trim();
  const talent = String(getVal(["الموهبة", "المواهب"])).trim();
  const notes = String(getVal(["ملاحظات", "الملاحظات"])).trim();

  const academicGradeText = String(getVal(["الصف الحالي", "الصف"])).trim();
  const sectionNameText = String(getVal(["الشعبة"])).trim();
  const shift = String(getVal(["الفوج"])).trim();
  const currentSchool = String(getVal(["اسم المدرسة", "المدرسة السابقة", "المدرسة"])).trim();
  const gpaScore = toNum(getVal(["المعدل", "الدرجة"]));

  const guardianName1 = String(getVal(["اسم ولي الامر", "اسم ولي الأمر", "ولي الأمر", "ولي الامر"])).trim();
  const guardianRelation1 = String(getVal(["صلته بالطالب1", "صلته بالطالب 1", "صلة القرابة1", "صلة القرابة"])).trim() || "والده";
  const guardianJob1 = String(getVal(["العمل1", "عمل ولي الأمر", "العمل"])).trim();
  const guardianPhone1 = String(getVal(["رقم الهاتف1", "الهاتف1", "رقم الهاتف"])).trim();

  const contactPerson2 = String(getVal(["اسم شخص اخر2", "اسم شخص آخر 2", "اسم شخص اخر 2"])).trim();
  const contactKunya2 = String(getVal(["الكنية2", "الكنية 2"])).trim();
  const contactRelation2 = String(getVal(["صلته بالطالب2", "صلته بالطالب 2"])).trim();
  const contactJob2 = String(getVal(["العمل2", "العمل 2"])).trim();
  const contactPhone2 = String(getVal(["رقم الهاتف2", "رقم الهاتف 2", "الهاتف2"])).trim();

  const firstPayment = toNum(getVal(["الدفعة الأولى", "الدفعة الاولى"]));
  const firstPaymentDate = String(getVal(["التاريخ1", "تاريخ الدفعة 1", "التاريخ 1"])).trim();
  const secondPayment = toNum(getVal(["الدفعة الثانية"]));
  const secondPaymentDate = String(getVal(["التاريخ 2", "تاريخ الدفعة 2", "التاريخ2"])).trim();
  const totalPayments = toNum(getVal(["مجموع الدفعات"])) || (firstPayment + secondPayment);
  const remainingBalance = toNum(getVal(["الباقي"]));
  const transportationFee = toNum(getVal(["ثمن المواصلات", "رسوم النقل"]));
  const uniformFee = toNum(getVal(["اللباس المدرسي", "رسوم اللباس"]));
  const booksFeeVal = toNum(getVal(["الكتب المدرسية", "رسوم الكتب"]));
  const syobisStatus = toBool(getVal(["syobis", "Syobis", "سيوبيس"]));

  const hasTransportation = toBool(getVal(["المواصلات", "اشتراك المواصلات"]));
  const receivedUniform = toBool(getVal(["تسليم لباس"]));
  const receivedBooks = toBool(getVal(["تسليم كتب"]));
  const lastReportCardCount = toNum(getVal(["صورة عن اخر جلاء او شهادة"]));
  const idCardFace2Count = toNum(getVal(["صورة عن الهوية الوجه الثاني"]));
  const idCardFace1Count = toNum(getVal(["صورة عن الهوية الوجه الاول"]));

  // Match or map Grade
  let matchedGrade = existingGrades.find(
    (g) =>
      g.name.includes(academicGradeText) ||
      (academicGradeText.includes("السابع") && g.name.includes("السابع")) ||
      (academicGradeText.includes("الثامن") && g.name.includes("الثامن")) ||
      (academicGradeText.includes("التاسع") && g.name.includes("التاسع")) ||
      (academicGradeText.includes("العاشر") && g.name.includes("العاشر")) ||
      (academicGradeText.includes("الحادي عشر") && g.name.includes("الحادي عشر")) ||
      (academicGradeText.includes("البكالوريا") && g.name.includes("البكالوريا")) ||
      (academicGradeText.includes("السادس") && g.name.includes("السادس"))
  );

  const gradeId = matchedGrade ? matchedGrade.id : "grade-7";
  const gradeName = academicGradeText || matchedGrade?.name || "الصف السابع";

  // Section match
  const sectionId = existingSections[0]?.id || "sec-7-a";
  const sectionName = sectionNameText ? `شعبة (${sectionNameText})` : "شعبة (أ)";

  // Format valid ISO birthDate if possible, or fallback
  let validBirthDate = "2010-01-01";
  if (birthDateRaw) {
    const parts = birthDateRaw.split(/[\/\-]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        validBirthDate = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
      } else if (parts[2].length === 4) {
        validBirthDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }
  }

  const studentNumber = `STD-2026-${String(idVal).padStart(3, "0")}`;

  const student: Student = {
    id: `std-row-${idVal}`,
    studentNumber,
    nationalId: idcardVal || `NAT-2026-${idVal}`,
    fullName,
    gender,
    birthDate: validBirthDate,
    birthPlace: birthPlaceText || "حلب",
    nationality: "سوري",
    photo:
      gender === "female"
        ? `https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces&q=80`
        : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&q=80`,
    address: addressDetail || residencePlace || "ريف حلب",
    bloodType: "A+",
    gradeId,
    gradeName,
    sectionId,
    sectionName,
    enrollmentDate: "2025-09-01",
    academicStatus: "active",
    previousSchool: currentSchool,

    // Official Form Exact Fields
    excelRowId: idVal,
    idcardNumber: idcardVal,
    firstName: firstName || fullName.split(" ")[0],
    nisba,
    kunya1,
    fatherNamePart: fatherName,
    grandfatherName,
    motherNamePart: motherName,
    academicGradeText: academicGradeText || gradeName,
    sectionNameText,
    shift: shift || "صباحي",
    birthDateRaw,
    birthPlaceText,
    residencePlace,
    addressDetail,
    currentSchool,
    gpaScore,
    notes,
    talent,
    healthStatus: healthStatus || "جيدة",

    guardianName1: guardianName1 || (fatherName ? `${fatherName} ${nisba || kunya1}` : ""),
    guardianRelation1,
    guardianJob1,
    guardianPhone1,

    contactPerson2,
    contactKunya2,
    contactRelation2,
    contactJob2,
    contactPhone2,

    firstPayment,
    firstPaymentDate,
    secondPayment,
    secondPaymentDate,
    totalPayments,
    remainingBalance,
    transportationFee,
    uniformFee,
    booksFeeVal,
    syobisStatus,

    hasTransportation,
    receivedUniform,
    receivedBooks,
    lastReportCardCount,
    idCardFace2Count,
    idCardFace1Count,

    healthRecord: {
      bloodType: "A+",
      allergies: [],
      chronicConditions: healthStatus && healthStatus !== "جيدة" ? [healthStatus] : [],
      emergencyMedicalNotes: healthStatus || "حالة صحية طبيعية وجيدة",
      healthInsuranceNo: idcardVal ? `INS-${idcardVal.slice(-6)}` : "INS-MED",
    },

    familyInfo: {
      fatherName: guardianName1 || fatherName || "ولي الأمر",
      fatherJob: guardianJob1 || "أعمال حرة",
      fatherPhone: guardianPhone1 || "0500000000",
      fatherEmail: "",
      motherName: motherName || "الأم",
      motherJob: contactJob2 || "ربة منزل",
      motherPhone: contactPhone2 || "",
      motherEmail: "",
      guardianRelation: guardianRelation1 || "والده",
      emergencyContactName: contactPerson2 || guardianName1 || fatherName || "جهة الطوارئ",
      emergencyContactPhone: contactPhone2 || guardianPhone1 || "0500000000",
      emergencyRelation: contactRelation2 || "قرابة",
      pickupAuthorizedPersons: [],
    },

    documents: [
      ...(receivedBooks
        ? [
            {
              id: `doc-${idVal}-books`,
              title: "إشعار استلام الكتب المدرسية",
              type: "transfer_cert" as const,
              uploadDate: "2025-09-01",
              fileSize: "1.2 MB",
              status: "verified" as const,
            },
          ]
        : []),
      ...(receivedUniform
        ? [
            {
              id: `doc-${idVal}-uniform`,
              title: "إيصال تسليم اللباس المدرسي",
              type: "other" as const,
              uploadDate: "2025-09-01",
              fileSize: "0.8 MB",
              status: "verified" as const,
            },
          ]
        : []),
      ...(idCardFace1Count > 0
        ? [
            {
              id: `doc-${idVal}-idcard`,
              title: "صورة البطاقة الشخصية (الوجه الأمامي)",
              type: "national_id" as const,
              uploadDate: "2025-09-01",
              fileSize: "1.5 MB",
              status: "verified" as const,
            },
          ]
        : []),
    ],

    academicHistory: [
      {
        year: "2024-2025",
        gradeName: currentSchool ? `السنة السابقة في: ${currentSchool}` : "الصف السابق",
        gpa: gpaScore || 85,
        ranking: 1,
        totalStudents: 30,
        conduct: "ممتاز",
        notes: notes || (talent ? `موهبة متميزة في: ${talent}` : "سجل أكاديمي نشط"),
      },
    ],

    transportation: {
      usesBus: hasTransportation,
      busRouteName: hasTransportation ? "مسار الحافلة المدرسي" : undefined,
      busTripType: shift === "مسائي" ? "afternoon_only" : shift === "صباحي" ? "morning_only" : "two_way",
      pickupStopName: residencePlace || addressDetail || "الموقف المعتمد",
      dropoffStopName: residencePlace || addressDetail || "الموقف المعتمد",
    },

    finance: {
      totalTuition: transportationFee + uniformFee + booksFeeVal || 700,
      busFee: transportationFee || 0,
      booksFee: booksFeeVal || 0,
      discountType: "لا يوجد",
      discountAmount: 0,
      netAmount: (transportationFee + uniformFee + booksFeeVal) || (firstPayment + remainingBalance) || 700,
      paidAmount: totalPayments || firstPayment || 0,
      balance: remainingBalance || Math.max(0, (transportationFee + uniformFee + booksFeeVal) - totalPayments),
      paymentPlan: secondPayment > 0 ? "two_installments" : "single",
      status: (remainingBalance === 0 && totalPayments > 0) ? "paid" : totalPayments > 0 ? "partial" : "pending",
    },
  };

  return student;
}

/**
 * Export students array to Excel (.xlsx) file with precise column order
 */
export function exportStudentsToExcel(students: Student[], fileName = "بيانات_الطلاب_الشاملة.xlsx") {
  const rows = students.map((s) => studentToOfficialRow(s));
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set RTL direction and reasonable column widths
  worksheet["!dir"] = "rtl";

  const colWidths = OFFICIAL_STUDENT_COLUMNS.map((col) => {
    if (["العنوان", "ملاحظات", "الموهبة", "الحالة الصحية"].includes(col.header)) return { wch: 30 };
    if (["الاسم", "اسم ولي الامر", "اسم شخص اخر2", "اسم المدرسة"].includes(col.header)) return { wch: 22 };
    if (["رقم الهاتف1", "رقم الهاتف2", "idcard"].includes(col.header)) return { wch: 16 };
    return { wch: 14 };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "سجل_الطلاب");

  XLSX.writeFile(workbook, fileName);
}

/**
 * Export students array to CSV with UTF-8 BOM for proper Arabic Excel rendering
 */
export function exportStudentsToCSV(students: Student[], fileName = "بيانات_الطلاب.csv") {
  const headers = OFFICIAL_STUDENT_COLUMNS.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(",");
  const rows = students.map((s) => {
    const rowObj = studentToOfficialRow(s);
    return OFFICIAL_STUDENT_COLUMNS.map((col) => {
      const val = rowObj[col.header];
      return `"${String(val ?? "").replace(/"/g, '""')}"`;
    }).join(",");
  });

  const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse an uploaded file (XLSX, XLS, CSV) into Student objects
 */
export async function parseUploadedStudentFile(
  file: File,
  existingGrades: { id: string; name: string }[] = [],
  existingSections: { id: string; name: string }[] = []
): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });

        const students: Student[] = jsonRows.map((row, idx) =>
          officialRowToStudent(row, idx, existingGrades, existingSections)
        );

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
