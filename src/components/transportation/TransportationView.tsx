import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSchool } from "../../context/SchoolContext";
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
  Search,
  ChevronRight,
  Send,
  Eye,
  Zap,
} from "lucide-react";

export const TransportationView: React.FC = () => {
  const { busRoutes, students, updateBusGps, addBusRoute } = useSchool();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.id || "");
  const [isSimulatingGps, setIsSimulatingGps] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"live_map" | "students_manifest" | "stops">("live_map");
  const [notifiedStudentId, setNotifiedStudentId] = useState<string | null>(null);

  // New Bus form
  const [busForm, setBusForm] = useState({
    routeNumber: "باص 04 - مسار الكرخ وحي الجامعة",
    driverName: "أبو أحمد الجبوري",
    driverPhone: "07709876543",
    supervisorName: "أ. ماجد العبيدي",
    supervisorPhone: "07711223344",
    busPlateNumber: "بغداد 54321 فحص",
    capacity: 32,
    areaName: "حي الجامعة وحي الخضراء",
    morningShiftTime: "06:45 ص",
    afternoonShiftTime: "01:30 م",
  });

  const currentRoute = useMemo(
    () => busRoutes.find((r) => r.id === selectedRouteId) || busRoutes[0],
    [busRoutes, selectedRouteId]
  );

  // Assigned students for selected bus
  const assignedStudents = useMemo(() => {
    return students.filter(
      (s) => s.transportation?.usesBus && s.transportation?.busRouteId === currentRoute?.id
    );
  }, [students, currentRoute]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return assignedStudents;
    return assignedStudents.filter(
      (s) =>
        s.fullName.includes(studentSearch) ||
        s.studentNumber.includes(studentSearch) ||
        s.gradeName?.includes(studentSearch)
    );
  }, [assignedStudents, studentSearch]);

  // High-performance Smooth GPS progress simulator
  const [progressRatio, setProgressRatio] = useState(0.45);

  useEffect(() => {
    if (!isSimulatingGps || !currentRoute) return;

    const interval = setInterval(() => {
      setProgressRatio((prev) => {
        const next = prev + 0.04;
        return next > 0.95 ? 0.05 : next;
      });

      const deltaLat = (Math.random() - 0.5) * 0.0004;
      const deltaLng = (Math.random() - 0.5) * 0.0004;
      const newSpeed = Math.floor(30 + Math.random() * 25);

      updateBusGps(currentRoute.id, {
        lat: (currentRoute.currentGps?.lat || 33.3152) + deltaLat,
        lng: (currentRoute.currentGps?.lng || 44.3661) + deltaLng,
        speedKmh: newSpeed,
        direction: Math.floor(Math.random() * 360),
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulatingGps, currentRoute, updateBusGps]);

  const handleNotifyParent = useCallback((studentName: string, id: string) => {
    setNotifiedStudentId(id);
    setTimeout(() => setNotifiedStudentId(null), 3000);
  }, []);

  const handleSaveBus = (e: React.FormEvent) => {
    e.preventDefault();
    addBusRoute({
      ...busForm,
      currentStudentsCount: 0,
      currentGps: {
        lat: 33.3152,
        lng: 44.3661,
        speedKmh: 42,
        direction: 90,
        lastUpdated: "مباشر الآن",
        isMoving: true,
      },
      stops: [
        {
          id: `stop-${Date.now()}-1`,
          name: "محطة 1 - ساحة قحطان",
          scheduledTime: busForm.morningShiftTime,
          completed: true,
          studentsCount: 6,
        },
        {
          id: `stop-${Date.now()}-2`,
          name: "محطة 2 - تقاطع حي الجامعة",
          scheduledTime: "07:05 ص",
          completed: false,
          studentsCount: 9,
        },
        {
          id: `stop-${Date.now()}-3`,
          name: "بوابة متوسطة الرافدين",
          scheduledTime: "07:35 ص",
          completed: false,
          studentsCount: 17,
        },
      ],
      status: "en_route",
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Bar with School & Fleet Stats */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>أسطول النقل المدرسي وتتبع GPS الحي الفعلي</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  أقمار صناعية متصلة
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                متابعة دقيقة لمسارات الحافلات، أوقات الوصول المقدرة لمحطات الطلاب، وتنبيهات أولياء الأمور الفورية.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsSimulatingGps(!isSimulatingGps)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulatingGps
                ? "bg-amber-100/80 text-amber-900 border border-amber-300"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isSimulatingGps ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-700" />
                <span>إيقاف محاكاة GPS</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-700" />
                <span>تشغيل محاكاة GPS</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة حافلة ومسار</span>
          </button>
        </div>
      </div>

      {/* Main Container: Map and Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Actual Interactive Map & Route Stage */}
        <div className="lg:col-span-8 space-y-3">
          {/* Tactical GPS Satellite Map View Screen */}
          <div className="bg-[#0b192c] rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-[#1e3e62] relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Visual Vector Grid Map representing Baghdad City Routes */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="w-[800px] h-[800px] border border-sky-500/20 rounded-full absolute -top-40 -right-40 animate-pulse duration-1000" />
            </div>

            {/* Top Telemetry Header inside Map */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[#1e3e62]/70 backdrop-blur-md p-3 rounded-xl border border-sky-400/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
                  🚌
                </div>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>{currentRoute?.routeNumber || "باص 01"}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      مباشر الآن
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-200">
                    رقم اللوحة: <strong className="font-mono text-white">{currentRoute?.busPlateNumber}</strong> • المنطقة: {currentRoute?.areaName}
                  </div>
                </div>
              </div>

              {/* Speed & Direction Telemetry Badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-[#0b192c]/90 px-2.5 py-1 rounded-lg border border-sky-400/30 text-center">
                  <span className="text-[10px] text-sky-300 block">السرعة الحالية</span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    {currentRoute?.currentGps?.speedKmh || 38} كم/س
                  </span>
                </div>

                <div className="bg-[#0b192c]/90 px-2.5 py-1 rounded-lg border border-sky-400/30 text-center">
                  <span className="text-[10px] text-sky-300 block">وقت الوصول للمدرسة</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    07:35 ص (12 د)
                  </span>
                </div>
              </div>
            </div>

            {/* Real Visual Vector Bus Route Canvas with Stops */}
            <div className="relative z-10 my-4 flex-1 flex flex-col justify-center">
              <div className="relative w-full max-w-2xl mx-auto h-52 bg-[#12233b]/80 rounded-xl border border-sky-500/30 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Baghdad Map Roads Simulation */}
                <div className="absolute top-1/2 left-6 right-6 h-2 bg-slate-700/80 rounded-full" />
                <div className="absolute top-6 bottom-6 left-1/4 w-1.5 bg-slate-700/60 rounded-full" />
                <div className="absolute top-6 bottom-6 right-1/4 w-1.5 bg-slate-700/60 rounded-full" />

                {/* Road Progress Glow */}
                <div
                  className="absolute top-1/2 left-6 h-2 bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400 rounded-full transition-all duration-1000 shadow-sm shadow-sky-400"
                  style={{ width: `${progressRatio * 85}%` }}
                />

                {/* Stop 1: بداية المسار (حي الجامعة) */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black ring-4 ring-emerald-500/30 shadow-lg">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                    محطة 1 - تم الركوب
                  </span>
                </div>

                {/* Stop 2: المحطة الوسطى (تقاطع النسور / اليرموك) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-black ring-4 ring-sky-500/30 shadow-lg">
                    2
                  </div>
                  <span className="text-[10px] font-bold text-sky-200 mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded border border-sky-500/30 whitespace-nowrap">
                    محطة 2 - التقاطع القادم
                  </span>
                </div>

                {/* Stop 3: بوابة المدرسة (متوسطة الرافدين للبنين) */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-sm font-black ring-4 ring-amber-500/30 shadow-lg">
                    🏫
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                    متوسطة الرافدين
                  </span>
                </div>

                {/* Actual Moving Bus Pin according to Progress */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 flex flex-col items-center z-20"
                  style={{
                    left: `${Math.min(Math.max(progressRatio * 82, 12), 85)}%`,
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl ring-4 ring-amber-300/40 animate-bounce">
                      <Bus className="w-6 h-6 fill-current text-slate-900" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-ping" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full mt-1 font-mono shadow-md border border-amber-200">
                    مباشر GPS
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Coordinates Data Row */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#12233b]/90 p-2.5 rounded-xl border border-sky-500/20">
                <span className="text-sky-300 block text-[10px]">إحداثيات خط العرض</span>
                <span className="font-mono font-bold text-white text-xs">
                  {currentRoute?.currentGps?.lat?.toFixed(5) || "33.31520"}° N
                </span>
              </div>

              <div className="bg-[#12233b]/90 p-2.5 rounded-xl border border-sky-500/20">
                <span className="text-sky-300 block text-[10px]">إحداثيات خط الطول</span>
                <span className="font-mono font-bold text-white text-xs">
                  {currentRoute?.currentGps?.lng?.toFixed(5) || "44.36610"}° E
                </span>
              </div>

              <div className="bg-[#12233b]/90 p-2.5 rounded-xl border border-sky-500/20">
                <span className="text-sky-300 block text-[10px]">السائق المسؤول</span>
                <span className="font-bold text-white text-xs flex items-center gap-1">
                  <span>{currentRoute?.driverName}</span>
                </span>
              </div>

              <div className="bg-[#12233b]/90 p-2.5 rounded-xl border border-sky-500/20">
                <span className="text-sky-300 block text-[10px]">مشرف الحافلة</span>
                <span className="font-bold text-white text-xs flex items-center gap-1">
                  <span>{currentRoute?.supervisorName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Manifest & Stops */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("live_map")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "live_map"
                      ? "bg-sky-100 text-sky-900"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  قائمة طلاب الحافلة ({assignedStudents.length})
                </button>
                <button
                  onClick={() => setActiveTab("stops")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "stops"
                      ? "bg-sky-100 text-sky-900"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  محطات الوقوف وأوقات الوصول ({currentRoute?.stops?.length || 3})
                </button>
              </div>

              <div className="relative w-48 hidden sm:block">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="بحث عن طالب بالباص..."
                  className="w-full text-xs px-2.5 py-1 pr-7 border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Tab: Student Passengers List */}
            {activeTab === "live_map" && (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2 px-3">الطالب</th>
                      <th className="py-2 px-3">الصف</th>
                      <th className="py-2 px-3">المحطة</th>
                      <th className="py-2 px-3">حالة الصعود</th>
                      <th className="py-2 px-3 text-center">إشعار ولي الأمر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                              {st.fullName.charAt(0)}
                            </div>
                            <span>{st.fullName}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{st.gradeName}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {st.transportation?.pickupPoint || "محطة 1 - حي الجامعة"}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              على متن الحافلة
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {notifiedStudentId === st.id ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                تم إرسال الإشعار لولي الأمر ✓
                              </span>
                            ) : (
                              <button
                                onClick={() => handleNotifyParent(st.fullName, st.id)}
                                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[11px] font-bold border border-sky-200 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>إشعار وصول</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          لا يوجد طلاب مسجلون بهذا الباص حالياً. يمكنك تعيين طلاب من شاشة ملفات الطلاب.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Stops */}
            {activeTab === "stops" && (
              <div className="space-y-2">
                {currentRoute?.stops?.map((stop, idx) => (
                  <div
                    key={stop.id || idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{stop.name}</div>
                        <div className="text-[11px] text-slate-500">
                          عدد الطلاب المسجلين بالوقوف: {stop.studentsCount || 8} طلاب
                        </div>
                      </div>
                    </div>
                    <div className="text-left font-mono font-bold text-sky-800 text-xs">
                      {stop.scheduledTime || stop.estimatedMorningTime || "07:10 ص"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Fleet Selector Cards and Driver Info */}
        <div className="lg:col-span-4 space-y-3">
          {/* Fleet Selector List */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-black text-xs sm:text-sm text-slate-900">
                حافلات الأسطول المدرسي ({busRoutes.length})
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                جميع الحافلات نشطة
              </span>
            </div>

            <div className="space-y-2">
              {busRoutes.map((route) => {
                const isSelected = route.id === currentRoute?.id;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? "border-sky-500 bg-sky-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-black text-slate-900 flex items-center gap-1.5">
                        <Bus className={`w-4 h-4 ${isSelected ? "text-sky-600" : "text-slate-500"}`} />
                        <span>{route.routeNumber}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {route.busPlateNumber}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>المسار: {route.areaName || "الكرخ - المنصور - حي الجامعة"}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span>السائق: {route.driverName}</span>
                        <span className="text-emerald-700 font-bold font-mono">
                          {route.currentGps?.speedKmh || 35} كم/س
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supervisor & Driver Communication Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
            <h4 className="font-black text-xs text-slate-900 border-b border-slate-100 pb-2">
              بيانات التواصل مع طاقم الحافلة
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{currentRoute?.driverName}</div>
                  <div className="text-[10px] text-slate-500">سائق الحافلة</div>
                </div>
                <a
                  href={`tel:${currentRoute?.driverPhone}`}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال</span>
                </a>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{currentRoute?.supervisorName}</div>
                  <div className="text-[10px] text-slate-500">مشرف ركوب الطلاب</div>
                </div>
                <a
                  href={`tel:${currentRoute?.supervisorPhone}`}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0b3b60] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm">إضافة مسار حافلة جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBus} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم المسار / رقم الباص</label>
                <input
                  type="text"
                  required
                  value={busForm.routeNumber}
                  onChange={(e) => setBusForm({ ...busForm, routeNumber: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم السائق</label>
                  <input
                    type="text"
                    required
                    value={busForm.driverName}
                    onChange={(e) => setBusForm({ ...busForm, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم هاتف السائق</label>
                  <input
                    type="text"
                    value={busForm.driverPhone}
                    onChange={(e) => setBusForm({ ...busForm, driverPhone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المشرف</label>
                  <input
                    type="text"
                    value={busForm.supervisorName}
                    onChange={(e) => setBusForm({ ...busForm, supervisorName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم لوحة الحافلة</label>
                  <input
                    type="text"
                    value={busForm.busPlateNumber}
                    onChange={(e) => setBusForm({ ...busForm, busPlateNumber: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">المنطقة الجغرافية المخدومة</label>
                <input
                  type="text"
                  value={busForm.areaName}
                  onChange={(e) => setBusForm({ ...busForm, areaName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0b3b60] text-white rounded-lg font-bold"
                >
                  حفظ الحافلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
