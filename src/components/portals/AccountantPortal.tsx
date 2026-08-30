import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { PaymentRecord } from "../../types";
import {
  CreditCard,
  Receipt,
  Search,
  Filter,
  Plus,
  Printer,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Send,
  Download,
  Building,
  User,
  Calendar,
  Percent,
  Eye,
  Check,
} from "lucide-react";

export const AccountantPortal: React.FC = () => {
  const { currentUser, students, payments, recordPayment, grades } = useSchool();

  const [activeTab, setActiveTab] = useState<"tuition" | "new_receipt" | "receipts_log" | "discounts">("tuition");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "partial" | "unpaid">("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  // Payment creation modal / receipt record state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  const [payAmount, setPayAmount] = useState<number>(5000);
  const [payMethod, setPayMethod] = useState<PaymentRecord["paymentMethod"]>("bank_transfer");
  const [payInstallment, setPayInstallment] = useState("القسط الثاني - الفصل الدراسي الثاني");
  const [payNotes, setPayNotes] = useState("");
  const [printReceiptData, setPrintReceiptData] = useState<PaymentRecord | null>(null);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Stats
  const totalTargetTuition = students.reduce((sum, s) => sum + (s.finance?.netAmount || 0), 0);
  const totalCollectedRevenue = students.reduce((sum, s) => sum + (s.finance?.paidAmount || 0), 0);
  const totalOutstandingBalance = students.reduce((sum, s) => sum + (s.finance?.balance || 0), 0);
  const collectionRate = totalTargetTuition > 0 ? Math.round((totalCollectedRevenue / totalTargetTuition) * 100) : 0;

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.fullName.includes(searchQuery) ||
      s.studentNumber.includes(searchQuery) ||
      (s.familyInfo?.fatherName && s.familyInfo.fatherName.includes(searchQuery));
    const matchGrade = gradeFilter === "all" ? true : s.gradeId === gradeFilter;
    const balance = s.finance?.balance || 0;
    const paid = s.finance?.paidAmount || 0;
    let matchStatus = true;
    if (statusFilter === "paid") matchStatus = balance === 0;
    else if (statusFilter === "partial") matchStatus = paid > 0 && balance > 0;
    else if (statusFilter === "unpaid") matchStatus = paid === 0;

    return matchSearch && matchGrade && matchStatus;
  });

  // Handle Recording New Payment
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st || payAmount <= 0) return;

    const receiptNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPaymentRecord: Omit<PaymentRecord, "id"> = {
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      receiptNumber: receiptNo,
      studentId: st.id,
      studentName: st.fullName,
      gradeName: st.gradeName,
      amount: payAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: payMethod,
      installmentName: payInstallment,
      receivedBy: currentUser.fullName,
      notes: payNotes || "دفعة معتمدة ومسجلة في النظام المحاسبي",
      status: "completed",
    };

    recordPayment(newPaymentRecord);
    setPrintReceiptData({
      ...newPaymentRecord,
      id: `pay-${Date.now()}`,
    } as PaymentRecord);

    setPaymentSuccessToast(true);
    setTimeout(() => setPaymentSuccessToast(false), 4000);
  };

  // Handle sending SMS / WhatsApp reminder
  const handleSendPaymentReminder = (studentName: string, fatherPhone: string, balance: number) => {
    setReminderToast(`تم إرسال مطالبة سداد بقيمة ${balance.toLocaleString()} ر.س إلى ولي أمر ${studentName} (${fatherPhone})`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner for Accountant Portal */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">بوابة المحاسب المالي ومتابعة الأقساط</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                صلاحيات المحاسب
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مرحباً {currentUser.fullName} • إدارة الرسوم الدراسية، إصدار سندات القبض، متابعة الذمم والتحصيل
            </p>
          </div>
        </div>

        {/* Quick Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("tuition")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "tuition"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>متابعة الأقساط والذمم</span>
          </button>

          <button
            onClick={() => setActiveTab("new_receipt")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "new_receipt"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>إصدار سند قبض جديد</span>
          </button>

          <button
            onClick={() => setActiveTab("receipts_log")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "receipts_log"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>سجل المقبوضات ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("discounts")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "discounts"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>الخصومات والإعفاءات</span>
          </button>
        </div>
      </div>

      {/* Reminder notification toast */}
      {reminderToast && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-lg flex items-center gap-2 animate-in fade-in">
          <Send className="w-4 h-4 text-indigo-600" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <span className="stat-label">إجمالي الرسوم المقررة</span>
          <div className="stat-value text-slate-900">{totalTargetTuition.toLocaleString()} ر.س</div>
          <div className="text-[10px] text-slate-500 mt-1">{students.length} طالب مسجل</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">الإيرادات المحصلة فعلياً</span>
          <div className="stat-value text-emerald-700">{totalCollectedRevenue.toLocaleString()} ر.س</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">نسبة التحصيل: {collectionRate}%</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">الذمم والأقساط المتبقية</span>
          <div className="stat-value text-rose-700">{totalOutstandingBalance.toLocaleString()} ر.س</div>
          <div className="text-[10px] text-rose-600 mt-1">مستحقة للدفع في الدفعة الحالية</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">سندات القبض المعتمدة</span>
          <div className="stat-value text-indigo-700">{payments.length} سند</div>
          <div className="text-[10px] text-indigo-600 mt-1">موثقة ومطابقة للحسابات</div>
        </div>
      </div>

      {/* TAB 1: TUITION TRACKING & BALANCES */}
      {activeTab === "tuition" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>تصفية:</span>
              </div>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold"
              >
                <option value="all">جميع الصفوف الدراسية</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold"
              >
                <option value="all">جميع حالات السداد</option>
                <option value="paid">مسدد بالكامل ✅</option>
                <option value="partial">مسدد جزئياً (متبقي ذمم) ⚠️</option>
                <option value="unpaid">غير مسدد إطلاقاً ❌</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الطالب أو اسم الأب..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md pr-8 pl-3 py-1.5 focus:outline-hidden focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>كشف الأقساط والذمم المالية للطلاب</span>
              </div>
              <span className="text-[11px] text-slate-500">
                عرض {filteredStudents.length} سجل مالي
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الطالب والمرحلة</th>
                    <th>الرسوم السنوية</th>
                    <th>الخصم الممنوح</th>
                    <th>المبلغ الصافي</th>
                    <th>المسدد</th>
                    <th>المتبقي المطلوب</th>
                    <th>حالة السداد</th>
                    <th>إجراءات المحاسب</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st) => {
                    const balance = st.finance?.balance || 0;
                    const isPaidInFull = balance === 0;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70">
                        <td className="font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <img
                              src={st.photo || (st as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <div>{st.fullName}</div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {st.gradeName} • ولي الأمر: {st.familyInfo?.fatherName || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="font-mono text-slate-600">
                          {(st.finance?.annualTuition || 15000).toLocaleString()} ر.س
                        </td>
                        <td className="font-mono text-emerald-700">
                          {(st.finance?.discountAmount || 0).toLocaleString()} ر.س
                        </td>
                        <td className="font-bold text-slate-900">
                          {(st.finance?.netAmount || 0).toLocaleString()} ر.س
                        </td>
                        <td className="font-bold text-emerald-700">
                          {(st.finance?.paidAmount || 0).toLocaleString()} ر.س
                        </td>
                        <td className="font-bold text-rose-700">
                          {balance.toLocaleString()} ر.س
                        </td>
                        <td>
                          {isPaidInFull ? (
                            <span className="status-pill bg-success text-[10px]">
                              مسدد بالكامل
                            </span>
                          ) : (
                            <span className="status-pill bg-warning text-[10px]">
                              متبقي {balance.toLocaleString()} ر.س
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStudentId(st.id);
                                setPayAmount(balance > 0 ? balance : 3000);
                                setActiveTab("new_receipt");
                              }}
                              className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded font-semibold"
                            >
                              + سند قبض
                            </button>

                            {balance > 0 && (
                              <button
                                onClick={() =>
                                  handleSendPaymentReminder(
                                    st.fullName,
                                    st.familyInfo?.fatherPhone || "966500000000",
                                    balance
                                  )
                                }
                                title="إرسال تذكير سداد لولي الأمر"
                                className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-1 rounded font-semibold flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                تذكير
                              </button>
                            )}
                          </div>
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

      {/* TAB 2: ISSUE NEW RECEIPT VOUCHER */}
      {activeTab === "new_receipt" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Receipt className="w-4 h-4 text-indigo-600" />
                <span>إصدار سند قبض مالي إلكتروني جديد</span>
              </div>
              <span className="text-[11px] text-slate-500">رقم الفاتورة يتولد تلقائياً</span>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-4 space-y-3.5">
              {paymentSuccessToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  تم تسجيل سند القبض المالي بنجاح، وتحديث رصيد الطالب، وتوليد الإيصال للطباعة.
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">اختر الطالب:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    const st = students.find((s) => s.id === e.target.value);
                    if (st && st.finance?.balance) {
                      setPayAmount(st.finance.balance);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-bold focus:border-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.gradeName}) - المتبقي: {(s.finance?.balance || 0).toLocaleString()} ر.س
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">المبلغ المحصل (ر.س):</label>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm font-bold text-indigo-700 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">طريقة الدفع:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-semibold"
                  >
                    <option value="bank_transfer">تحويل بنكي (مصرف الراجحي / الأهلي)</option>
                    <option value="card">بطاقة مدى / ائتمانية (POS)</option>
                    <option value="cash">نقداً (خزينة المدرسة)</option>
                    <option value="cheque">شيك مصرفي مصدق</option>
                    <option value="online">سداد إلكتروني عبر المنصة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">بيان الدفعة / القسط:</label>
                <input
                  type="text"
                  value={payInstallment}
                  onChange={(e) => setPayInstallment(e.target.value)}
                  placeholder="مثال: القسط الدراسي الثاني للعام 2025-2026"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">ملاحظات التحصيل / المرجع البنكي:</label>
                <textarea
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  rows={2}
                  placeholder="رقم الحوالة البنكية، اسم المودع، أو تفاصيل الشيك..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  <span>اعتماد سند القبض وإصدار الإيصال</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Receipt Preview */}
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-800">معاينة سند القبض الرسمي</span>
              <button
                onClick={() => window.print()}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-semibold flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                طباعة
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl m-3 text-xs space-y-3 font-mono print:m-0 print:border-none">
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="font-bold text-sm text-slate-900 font-sans">مدارس الإتقان الأهلية النموذجية</div>
                <div className="text-[10px] text-slate-500 font-sans">قسم الإدارة المالية والمحاسبة</div>
                <div className="text-[10px] font-bold text-indigo-700 mt-1">سند قبض مالي إلكتروني (Receipt Voucher)</div>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>رقم السند: <strong>{printReceiptData?.receiptNumber || "REC-994411"}</strong></span>
                <span>التاريخ: {printReceiptData?.paymentDate || "2026-02-28"}</span>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[11px] font-sans">
                <div>استلمنا من: <strong>{printReceiptData?.studentName || "يوسف عمر عبد الرحيم"}</strong></div>
                <div>المرحلة: {printReceiptData?.gradeName || "الصف الأول الابتدائي"}</div>
                <div>مبلغ وقدره: <strong className="text-indigo-800 text-sm font-mono">{(printReceiptData?.amount || payAmount).toLocaleString()} ر.س</strong></div>
                <div>طريقة الدفع: {printReceiptData?.paymentMethod || payMethod}</div>
                <div>وذلك عن: {printReceiptData?.installmentName || payInstallment}</div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-dashed border-slate-300 font-sans">
                <div>المستلم: {printReceiptData?.receivedBy || currentUser.fullName}</div>
                <div className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ✓ معتمد رسمياً
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECEIPTS LOG */}
      {activeTab === "receipts_log" && (
        <div className="wide-card">
          <div className="card-header">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span>سجل سندات القبض والدفعات المعتمدة</span>
            </div>
            <button
              onClick={() => alert("تم تصدير كشف المقبوضات إلى ملف Excel بصيغة XLSX بنجاح.")}
              className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-bold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              تصدير Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>رقم السند</th>
                  <th>رقم الفاتورة</th>
                  <th>الطالب</th>
                  <th>المرحلة</th>
                  <th>المبلغ</th>
                  <th>تاريخ الدفع</th>
                  <th>طريقة الدفع</th>
                  <th>البيان</th>
                  <th>المستلم</th>
                  <th>الطباعة</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="font-mono font-bold text-indigo-700">{p.receiptNumber}</td>
                    <td className="font-mono text-slate-500 text-[11px]">{p.invoiceNumber}</td>
                    <td className="font-bold text-slate-900">{p.studentName}</td>
                    <td className="text-slate-600 text-xs">{p.gradeName}</td>
                    <td className="font-bold text-emerald-700">{p.amount.toLocaleString()} ر.س</td>
                    <td className="font-mono text-xs text-slate-500">{p.paymentDate}</td>
                    <td>
                      <span className="status-pill bg-info text-[10px]">
                        {p.paymentMethod === "bank_transfer"
                          ? "تحويل بنكي"
                          : p.paymentMethod === "card"
                          ? "بطاقة مدى"
                          : p.paymentMethod === "cash"
                          ? "نقداً"
                          : "شيك مصدق"}
                      </span>
                    </td>
                    <td className="text-xs text-slate-700 max-w-[200px] truncate">{p.installmentName}</td>
                    <td className="text-xs text-slate-500">{p.receivedBy}</td>
                    <td>
                      <button
                        onClick={() => {
                          setPrintReceiptData(p);
                          setActiveTab("new_receipt");
                        }}
                        className="text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-slate-100"
                        title="معاينة وطباعة"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DISCOUNTS & EXEMPTIONS */}
      {activeTab === "discounts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-800">سياسة الخصومات المعتمدة</span>
              <Percent className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="p-3.5 space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-indigo-800">خصم الأشقاء (Brother Discount)</div>
                <div className="text-slate-600">10% للأخ الثاني، و15% للأخ الثالث فما فوق.</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-emerald-800">منحة التفوق العلمي</div>
                <div className="text-slate-600">خصم 15% للطلاب الحاصلين على معدل 99% فما فوق.</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-amber-800">خصم أبناء الكادر التعليمي</div>
                <div className="text-slate-600">خصم 30% لأبناء المعلمين والموظفين بالمدرسة.</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-blue-800">خصم السداد المبكر الكامل</div>
                <div className="text-slate-600">خصم 5% عند سداد الرسوم السنوية دفعة واحدة قبل بدء العام.</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <span>الطلاب الحاصلين على خصومات ومنح</span>
              <span className="text-[11px] text-slate-500">محدثة تلقائياً في السجلات المالية</span>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الطالب</th>
                    <th>المرحلة</th>
                    <th>نوع الخصم</th>
                    <th>نسبة / قيمة الخصم</th>
                    <th>الرسوم قبل الخصم</th>
                    <th>الصافي المطلوب</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => (s.finance?.discountAmount || 0) > 0)
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70">
                        <td className="font-bold text-slate-900">{s.fullName}</td>
                        <td className="text-xs text-slate-600">{s.gradeName}</td>
                        <td>
                          <span className="status-pill bg-info text-[10px]">
                            {s.finance?.discountReason || "خصم تفوق / إخوة"}
                          </span>
                        </td>
                        <td className="font-bold text-emerald-700">
                          {(s.finance?.discountAmount || 0).toLocaleString()} ر.س
                        </td>
                        <td className="font-mono text-slate-500">
                          {(s.finance?.annualTuition || 0).toLocaleString()} ر.س
                        </td>
                        <td className="font-bold text-slate-900">
                          {(s.finance?.netAmount || 0).toLocaleString()} ر.س
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
