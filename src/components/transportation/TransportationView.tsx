import React, { useState, useEffect } from "react";
import { useSchool } from "../../context/SchoolContext";
import { BusRoute } from "../../types";
import {
  Bus,
  MapPin,
  Navigation,
  Phone,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Plus,
  Compass,
  Radio,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";

export const TransportationView: React.FC = () => {
  const { busRoutes, students, updateBusGps, addBusRoute } = useSchool();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.id || "");
  const [isSimulatingGps, setIsSimulatingGps] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Bus Form
  const [busForm, setBusForm] = useState({
    routeNumber: "",
    driverName: "",
    driverPhone: "0509988776",
    supervisorName: "",
    supervisorPhone: "0559988776",
    busPlateNumber: "أ ب ج 1234",
    capacity: 30,
    areaName: "حي النخيل والربيع",
    morningShiftTime: "06:30 ص",
    afternoonShiftTime: "01:30 م",
  });

  const currentRoute = busRoutes.find((r) => r.id === selectedRouteId) || busRoutes[0];
  const assignedStudents = students.filter(
    (s) => s.transportation?.usesBus && s.transportation?.busRouteId === currentRoute?.id
  );

  // GPS Simulation interval
  useEffect(() => {
    if (!isSimulatingGps || !currentRoute) return;

    const interval = setInterval(() => {
      const deltaLat = (Math.random() - 0.5) * 0.0008;
      const deltaLng = (Math.random() - 0.5) * 0.0008;
      const newSpeed = Math.floor(25 + Math.random() * 30);

      updateBusGps(currentRoute.id, {
        lat: currentRoute.currentGps.lat + deltaLat,
        lng: currentRoute.currentGps.lng + deltaLng,
        speedKmh: newSpeed,
        direction: (currentRoute.currentGps.direction + 10) % 360,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingGps, currentRoute, updateBusGps]);

  const handleSaveBus = (e: React.FormEvent) => {
    e.preventDefault();
    addBusRoute({
      ...busForm,
      currentStudentsCount: 0,
      currentGps: {
        lat: 24.774265,
        lng: 46.643875,
        speedKmh: 35,
        direction: 90,
        lastUpdated: "مباشر الآن",
        isMoving: true,
      },
      stops: [
        {
          id: `stop-${Date.now()}-1`,
          name: "محطة 1 - بداية المسار",
          scheduledTime: busForm.morningShiftTime,
          completed: true,
          studentsCount: 5,
        },
        {
          id: `stop-${Date.now()}-2`,
          name: "محطة 2 - التقاطع الرئيسي",
          scheduledTime: "06:45 ص",
          completed: false,
          studentsCount: 8,
        },
        {
          id: `stop-${Date.now()}-3`,
          name: "بوابة المدرسة الرئيسية",
          scheduledTime: "07:15 ص",
          completed: false,
          studentsCount: 15,
        },
      ],
      status: "en_route",
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-slate-900">
              المواصلات والنقل المدرسي وتتبع GPS الحي
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
              تتبع الأقمار الصناعية نشط
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة أسطول الحافلات المدرسية، المسارات، محطات الركوب والنزول، وتتبع حركة الحافلات لحظياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatingGps(!isSimulatingGps)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSimulatingGps
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isSimulatingGps ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>إيقاف محاكاة GPS</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>تشغيل محاكاة GPS</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            إضافة مسار حافلة
          </button>
        </div>
      </div>

      {/* Main Grid: Left GPS Radar Visualizer, Right Bus Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive GPS Visualizer Card (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Radar Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full border border-indigo-500/20 rounded-full scale-150 animate-ping duration-1000" />
            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          {/* Top Bar inside GPS Screen */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {currentRoute ? currentRoute.routeNumber : "حافلة"}
                </h3>
                <div className="text-[11px] text-slate-300">
                  لوحة: {currentRoute?.busPlateNumber} | المنطقة: {currentRoute?.areaName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-slate-400">السرعة: </span>
                <span className="font-mono font-bold text-amber-400">
                  {currentRoute?.currentGps.speedKmh} كم/س
                </span>
              </div>
              <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-slate-400">الحالة: </span>
                <span className="font-bold text-emerald-400">مباشر • يسير بالمسار</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Stage */}
          <div className="relative z-10 my-8 flex-1 flex flex-col items-center justify-center">
            {/* Route Map Vector Canvas Simulator */}
            <div className="relative w-full max-w-lg h-64 bg-slate-800/50 rounded-2xl border border-slate-700/80 p-4 flex flex-col justify-between">
              {/* Roads lines */}
              <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-slate-700 rounded-full" />
              <div className="absolute top-4 bottom-4 left-1/3 w-1.5 bg-slate-700 rounded-full" />
              <div className="absolute top-4 bottom-4 right-1/3 w-1.5 bg-slate-700 rounded-full" />

              {/* Waypoints Stops */}
              <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-lg shadow-emerald-500/50 ring-2 ring-white">
                  1
                </div>
                <span className="text-[10px] font-bold text-emerald-300 mt-1 bg-slate-900/80 px-1.5 rounded">
                  المحطة الأولى
                </span>
              </div>

              <div className="absolute top-1/3 right-1/3 -translate-y-1/2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg ring-2 ring-white">
                  2
                </div>
                <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/80 px-1.5 rounded">
                  نقطة حي الربيع
                </span>
              </div>

              <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-lg shadow-amber-500/50 ring-2 ring-white">
                  🏫
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-1 bg-slate-900/80 px-1.5 rounded">
                  بوابة المدرسة
                </span>
              </div>

              {/* Moving Bus Pin */}
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 flex flex-col items-center"
                style={{
                  left: `${45 + (Math.sin(Date.now() / 1000) * 15)}%`,
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-400 ring-4 ring-amber-300/30 animate-bounce">
                    <Bus className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-ping" />
                </div>
                <span className="text-[11px] font-bold text-amber-300 mt-2 bg-slate-900/90 px-2 py-0.5 rounded-md border border-amber-400/30">
                  الحافلة في المسار الآن
                </span>
              </div>
            </div>
          </div>

          {/* Bottom GPS Telemetry */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px]">إحداثيات العرض:</span>
              <span className="font-mono font-bold text-slate-200">
                {currentRoute?.currentGps.lat.toFixed(5)}° N
              </span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px]">إحداثيات الطول:</span>
              <span className="font-mono font-bold text-slate-200">
                {currentRoute?.currentGps.lng.toFixed(5)}° E
              </span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px]">السائق:</span>
              <span className="font-bold text-slate-200">{currentRoute?.driverName}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px]">المشرف:</span>
              <span className="font-bold text-slate-200">{currentRoute?.supervisorName}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet List & Stops Schedule */}
        <div className="space-y-4">
          {/* Fleet Selector List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">أسطول الحافلات المدرسية</h3>
            <div className="space-y-2">
              {busRoutes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedRouteId === route.id
                      ? "border-amber-400 bg-amber-50/50 shadow-xs"
                      : "border-slate-100 bg-slate-50/40 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{route.routeNumber}</h4>
                        <div className="text-[10px] text-slate-500">{route.areaName}</div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {route.currentStudentsCount} / {route.capacity} راكب
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                    <span>السائق: {route.driverName}</span>
                    <span className="font-mono text-slate-700">{route.driverPhone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stops Timeline */}
          {currentRoute && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">جدول محطات المسار</h3>
              <div className="space-y-2">
                {currentRoute.stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          stop.completed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{stop.name}</div>
                        <div className="text-[10px] text-slate-400">
                          الموعد المجدول: {stop.scheduledTime}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stop.completed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {stop.completed ? "تم الوصول" : "قادم"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Passengers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            قائمة الطلاب المشتركين بالحافلة: {currentRoute?.routeNumber} ({assignedStudents.length} طلاب)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">الطالب</th>
                <th className="p-3">الصف</th>
                <th className="p-3">نقطة الركوب والنزول</th>
                <th className="p-3">ولي الأمر ورقم الجوال</th>
                <th className="p-3 text-center">حالة الصعود الصباحي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {assignedStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <img
                      src={std.photo || (std as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                      className="w-7 h-7 rounded-lg object-cover"
                      alt=""
                    />
                    <span>{std.fullName}</span>
                  </td>
                  <td className="p-3 text-slate-600">{std.gradeName || "—"}</td>
                  <td className="p-3 text-slate-600">{std.transportation?.pickupLocation || "—"}</td>
                  <td className="p-3">
                    <div>{std.familyInfo?.fatherName || "—"}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{std.familyInfo?.fatherPhone || "—"}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> تم الركوب بأمان
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">إضافة حافلة ومسار نقل جديد</h3>
            <form onSubmit={handleSaveBus} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم / كود الحافلة</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حافلة 05 - حي الياسمين"
                    value={busForm.routeNumber}
                    onChange={(e) => setBusForm({ ...busForm, routeNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم اللوحة</label>
                  <input
                    type="text"
                    required
                    value={busForm.busPlateNumber}
                    onChange={(e) => setBusForm({ ...busForm, busPlateNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم السائق</label>
                  <input
                    type="text"
                    required
                    value={busForm.driverName}
                    onChange={(e) => setBusForm({ ...busForm, driverName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">جوال السائق</label>
                  <input
                    type="text"
                    required
                    value={busForm.driverPhone}
                    onChange={(e) => setBusForm({ ...busForm, driverPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم مشرف الحافلة</label>
                  <input
                    type="text"
                    required
                    value={busForm.supervisorName}
                    onChange={(e) => setBusForm({ ...busForm, supervisorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">جوال المشرف</label>
                  <input
                    type="text"
                    required
                    value={busForm.supervisorPhone}
                    onChange={(e) => setBusForm({ ...busForm, supervisorPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">السعة (المقاعد)</label>
                  <input
                    type="number"
                    value={busForm.capacity}
                    onChange={(e) => setBusForm({ ...busForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">انطلاق الصباح</label>
                  <input
                    type="text"
                    value={busForm.morningShiftTime}
                    onChange={(e) => setBusForm({ ...busForm, morningShiftTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">انطلاق المساء</label>
                  <input
                    type="text"
                    value={busForm.afternoonShiftTime}
                    onChange={(e) => setBusForm({ ...busForm, afternoonShiftTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  حفظ وتفعيل المسار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
