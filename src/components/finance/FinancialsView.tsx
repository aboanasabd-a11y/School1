import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { PaymentRecord } from "../../types";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  Printer,
  Receipt,
  FileCheck,
  X,
  TrendingUp,
} from "lucide-react";

export const FinancialsView: React.FC = () => {
  const { students, payments, recordPayment } = useSchool();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  // Payment Recording Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [payAmount, setPayAmount] = useState<number>(3000);
  const [payMethod, setPayMethod] = useState<"cash" | "card" | "bank_transfer" | "cheque">("card");
  const [installmentName, setInstallmentName] = useState("الدفعة الثانية - الرسوم الدراسية");
  const [notes, setNotes] = useState("سداد نقدي / إلكتروني معتمد");

  // Selected Receipt for Printable view
  const [receiptRecord, setReceiptRecord] = useState<PaymentRecord | null>(null);

  // Stats calculation
  const totalTuitionExpected = students.reduce((acc, s) => acc + (s.finance?.netAmount || 0), 0);
  const totalPaidRevenue = students.reduce((acc, s) => acc + (s.finance?.paidAmount || 0), 0);
  const totalOutstandingBalance = students.reduce((acc, s) => acc + (s.finance?.balance || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const matchQuery =
      p.studentName.includes(searchQuery) ||
      p.receiptNumber.includes(searchQuery) ||
      p.invoiceNumber.includes(searchQuery);
    const matchMethod = filterMethod === "all" || p.paymentMethod === filterMethod;
    return matchQuery && matchMethod;
  });

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === selectedStudentId);
    if (!std) return;

    recordPayment({
      studentId: std.id,
      studentName: std.fullName,
      gradeName: std.gradeName || "المرحلة الدراسية",
      amount: payAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: payMethod,
      installmentName,
      receivedBy: "قسم المالية والمحاسبة",
      notes,
      status: "completed",
    });

    setShowPayModal(false);
  };

  const getMethodLabel = (method: PaymentRecord["paymentMethod"]) => {
    switch (method) {
      case "card":
        return "بطاقة مدى / ائتمانية";
      case "bank_transfer":
        return "تحويل بنكي مباشر";
      case "cash":
        return "سداد نقدي (كاش)";
      case "cheque":
        return "شيك مصدق";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              الشؤون المالية وإدارة الأقساط والرسوم المدرسية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة الرسوم الدراسية، تسجيل المدفوعات، وإصدار سندات القبض المعتمدة.
          </p>
        </div>

        <button
          onClick={() => setShowPayModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          تسجيل دفعة / سند قبض جديد
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">إجمالي الرسوم المعتمدة</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalTuitionExpected.toLocaleString()} <span className="text-xs font-normal text-slate-400">ر.س</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">بعد تطبيق كافة الخصومات</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/30">
          <span className="text-xs font-bold text-emerald-700 block">المبالغ المحصلة (الإيرادات)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {totalPaidRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">ر.س</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            نسبة التحصيل: {Math.round((totalPaidRevenue / (totalTuitionExpected || 1)) * 100)}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/30">
          <span className="text-xs font-bold text-amber-700 block">المتبقيات والذمم المدينة</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {totalOutstandingBalance.toLocaleString()} <span className="text-xs font-normal text-slate-400">ر.س</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-2">أقساط مستحقة للتحصيل</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">عدد عمليات السداد المسجلة</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{payments.length}</div>
          <div className="text-[11px] text-slate-400 mt-2">سندات قبض مرقمة</div>
        </div>
      </div>

      {/* Payments Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">سجل سندات القبض والمدفوعات الإلكترونية</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث برقم السند أو اسم الطالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 pl-3 py-1.5 rounded-xl border border-slate-200 text-xs w-56 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs"
            >
              <option value="all">كل طرق الدفع</option>
              <option value="card">بطاقة مدى / ائتمانية</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="cash">نقدي</option>
            </select>
          </div>
        </div>

        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
            <tr>
              <th className="p-3.5">رقم السند / الفاتورة</th>
              <th className="p-3.5">الطالب / المرحلة</th>
              <th className="p-3.5">البيان / القسط</th>
              <th className="p-3.5">طريقة الدفع</th>
              <th className="p-3.5">المبلغ المدفوع</th>
              <th className="p-3.5">تاريخ السداد</th>
              <th className="p-3.5">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono">
                  <div className="font-bold text-indigo-700">{p.receiptNumber}</div>
                  <div className="text-[10px] text-slate-400">{p.invoiceNumber}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{p.studentName}</div>
                  <div className="text-[10px] text-slate-500">{p.gradeName}</div>
                </td>
                <td className="p-3.5 font-medium">{p.installmentName}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {getMethodLabel(p.paymentMethod)}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-emerald-700">
                  {p.amount.toLocaleString()} ر.س
                </td>
                <td className="p-3.5 text-slate-500 font-mono">{p.paymentDate}</td>
                <td className="p-3.5">
                  <button
                    onClick={() => setReceiptRecord(p)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    طباعة السند
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">تسجيل دفعة جديدة وإصدار سند قبض</h3>
              <button onClick={() => setShowPayModal(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اختر الطالب</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} - {s.gradeName} (المتبقي: {s.finance.balance} ر.س)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المبلغ المسدد (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">طريقة السداد</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="card">بطاقة مدى / فيزا</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="cash">نقدي (كاش)</option>
                    <option value="cheque">شيك</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">بيان السند</label>
                <input
                  type="text"
                  value={installmentName}
                  onChange={(e) => setInstallmentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات المحاسب</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  تأكيد وسداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">سند قبض مالي رسمي</h3>
                <span className="text-xs text-slate-500 font-mono">رقم السند: {receiptRecord.receiptNumber}</span>
              </div>
              <button onClick={() => setReceiptRecord(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">اسم الطالب:</span>
                <span className="font-bold text-slate-900">{receiptRecord.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المرحلة الدراسية:</span>
                <span className="font-bold text-slate-900">{receiptRecord.gradeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">البيان:</span>
                <span className="font-bold text-slate-900">{receiptRecord.installmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المبلغ المقبوض:</span>
                <span className="font-black text-indigo-700 text-sm">{receiptRecord.amount.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">طريقة القبض:</span>
                <span className="font-bold text-slate-900">{getMethodLabel(receiptRecord.paymentMethod)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">تاريخ المعاملة:</span>
                <span className="font-mono text-slate-700">{receiptRecord.paymentDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                طباعة السند
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
