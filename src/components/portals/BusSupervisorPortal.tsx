import React, { useState, useEffect } from "react";
import { useSchool } from "../../context/SchoolContext";
import {
  Bus,
  MapPin,
  Users,
  Phone,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  Square,
  Sparkles,
  ShieldCheck,
  Search,
  MessageSquare,
  Navigation,
  ExternalLink,
  Compass,
  LocateFixed,
  RefreshCw,
} from "lucide-react";

export const BusSupervisorPortal: React.FC = () => {
  const {
    currentUser,
    busRoutes,
    students,
    updateBusGps,
    activeDirectDriverId,
    loginDriverWithNumber,
    logoutDirectDriver,
  } = useSchool();

  // Driver Login & Authentication State
  const [driverNumberInput, setDriverNumberInput] = useState("");
  const [driverLoginError, setDriverLoginError] = useState<string | null>(null);
  const [isDriverLoggedOut, setIsDriverLoggedOut] = useState(false);

  // Authenticated route resolution
  const authenticatedRoute =
    !isDriverLoggedOut
      ? (activeDirectDriverId && busRoutes.find((r) => r.id === activeDirectDriverId)) ||
        (currentUser.role === "bus_supervisor" && busRoutes[0]) ||
        null
      : null;

  // Active route
  const [selectedRouteId, setSelectedRouteId] = useState(authenticatedRoute?.id || busRoutes[0]?.id || "");

  useEffect(() => {
    if (authenticatedRoute && authenticatedRoute.id !== selectedRouteId) {
      setSelectedRouteId(authenticatedRoute.id);
    }
  }, [authenticatedRoute]);

  const currentRoute = busRoutes.find((r) => r.id === selectedRouteId) || authenticatedRoute || busRoutes[0];

  const handleDriverLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDriverLoginError(null);
    const result = loginDriverWithNumber(driverNumberInput);
    if (result.success && result.route) {
      setSelectedRouteId(result.route.id);
      setIsDriverLoggedOut(false);
      setDriverLoginError(null);
    } else {
      setDriverLoginError(result.message);
    }
  };

  const handleDriverLogout = () => {
    logoutDirectDriver();
    setIsDriverLoggedOut(true);
    setDriverNumberInput("");
  };

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<"passengers" | "radar" | "trip_status" | "broadcast">("passengers");

  // Trip stage status
  const [tripStage, setTripStage] = useState<"ready" | "in_transit" | "arrived_school" | "return_trip">("in_transit");

  // Student boarding status state for today's trip
  const [boardingStatus, setBoardingStatus] = useState<
    Record<string, { boarded: boolean; dropoff: boolean; time?: string }>
  >({
    "std-1": { boarded: true, dropoff: false, time: "07:15 ص" },
    "std-2": { boarded: true, dropoff: false, time: "07:20 ص" },
  });

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-GPS Geolocation Tracking
  const [isAutoGps, setIsAutoGps] = useState(true);
  const [gpsSource, setGpsSource] = useState<"auto" | "device">("auto");
  const [liveGpsCoords, setLiveGpsCoords] = useState({
    lat: currentRoute?.currentGps?.lat || 24.7136,
    lng: currentRoute?.currentGps?.lng || 46.6753,
    speed: currentRoute?.currentGps?.speed || 42,
    heading: "شمال شرق ↗",
    lastUpdated: "الآن",
  });
  const [gpsUpdateTick, setGpsUpdateTick] = useState(0);

  // Request actual hardware device geolocation if supported
  const requestDeviceLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          const speed = pos.coords.speed
            ? Math.round(pos.coords.speed * 3.6)
            : Math.floor(35 + Math.random() * 15);
          const timeStr = new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          setLiveGpsCoords({
            lat,
            lng,
            speed,
            heading: "تحديد آلي دقيق",
            lastUpdated: timeStr,
          });
          setGpsSource("device");
          if (currentRoute) {
            updateBusGps(currentRoute.id, {
              lat,
              lng,
              speed,
              heading: "تحديد آلي دقيق",
              lastUpdated: timeStr,
            });
          }
          setToastMessage(`تم تحديد موقع الحافلة الجغرافي آلياً عبر GPS بنجاح (${lat}, ${lng})`);
          setTimeout(() => setToastMessage(null), 3000);
        },
        () => {
          // Fallback to simulated live telemetry
          simulateNextGpsStep();
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      simulateNextGpsStep();
    }
  };

  // Simulate smooth progression on route
  const simulateNextGpsStep = () => {
    const deltaLat = (Math.random() - 0.48) * 0.0006;
    const deltaLng = (Math.random() - 0.48) * 0.0006;
    const newSpeed = Math.floor(35 + Math.random() * 20);
    const timeStr = new Date().toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setLiveGpsCoords((prev) => {
      const nextLat = parseFloat((prev.lat + deltaLat).toFixed(6));
      const nextLng = parseFloat((prev.lng + deltaLng).toFixed(6));
      if (currentRoute) {
        updateBusGps(currentRoute.id, {
          lat: nextLat,
          lng: nextLng,
          speed: newSpeed,
          heading: "شمال شرق ↗",
          lastUpdated: timeStr,
        });
      }
      return {
        lat: nextLat,
        lng: nextLng,
        speed: newSpeed,
        heading: "شمال شرق ↗",
        lastUpdated: timeStr,
      };
    });
  };

  // Automatic GPS update interval (determines location automatically every 3.5s)
  useEffect(() => {
    if (!isAutoGps) return;
    const interval = setInterval(() => {
      setGpsUpdateTick((t) => t + 1);
      if (gpsSource === "device" && typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = parseFloat(pos.coords.latitude.toFixed(6));
            const lng = parseFloat(pos.coords.longitude.toFixed(6));
            const speed = pos.coords.speed
              ? Math.round(pos.coords.speed * 3.6)
              : Math.floor(35 + Math.random() * 15);
            const timeStr = new Date().toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            setLiveGpsCoords({
              lat,
              lng,
              speed,
              heading: "تحديد آلي دقيق",
              lastUpdated: timeStr,
            });
            if (currentRoute) {
              updateBusGps(currentRoute.id, {
                lat,
                lng,
                speed,
                heading: "تحديد آلي دقيق",
                lastUpdated: timeStr,
              });
            }
          },
          () => {
            simulateNextGpsStep();
          },
          { enableHighAccuracy: false, timeout: 3000 }
        );
      } else {
        simulateNextGpsStep();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoGps, gpsSource, currentRoute?.id]);
  const [searchQuery, setSearchQuery] = useState("");

  // Broadcast message to parents
  const [broadcastText, setBroadcastText] = useState("");

  // Assigned students to this bus route matching the bus's cohort
  const assignedStudents = students.filter((s) => {
    if (currentRoute?.shift) {
      const isMorningRoute = currentRoute.shift.includes("صباحي") || currentRoute.shift.includes("الأول");
      const isMorningStudent = !s.shift || s.shift.includes("صباحي") || s.shift.includes("الأول");
      if (isMorningRoute !== isMorningStudent) return false;
    }
    return (
      (s.transportation?.usesBus && s.transportation?.busRouteId === currentRoute?.id) ||
      (currentRoute?.activeStudentsIds &&
        (currentRoute.activeStudentsIds.includes(s.id) ||
          currentRoute.activeStudentsIds.includes(s.studentNumber)))
    );
  });

  const filteredAssigned = assignedStudents.filter(
    (s) =>
      s.fullName.includes(searchQuery) ||
      (s.familyInfo?.fatherName && s.familyInfo.fatherName.includes(searchQuery)) ||
      (s.transportation?.pickupLocation && s.transportation.pickupLocation.includes(searchQuery))
  );

  const boardedCount = Object.values(boardingStatus).filter((b: any) => b?.boarded).length;

  // Handle toggling student boarding
  const handleToggleBoarding = (studentId: string, studentName: string, fatherPhone: string) => {
    const current = boardingStatus[studentId];
    const newBoarded = !current?.boarded;
    const nowTime = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

    setBoardingStatus((prev) => ({
      ...prev,
      [studentId]: {
        boarded: newBoarded,
        dropoff: newBoarded ? false : prev[studentId]?.dropoff || false,
        time: newBoarded ? nowTime : undefined,
      },
    }));

    if (newBoarded) {
      setToastMessage(`تم تأكيد صعود الطالب ${studentName} وإرسال إشعار SMS لولي الأمر (${fatherPhone})`);
    } else {
      setToastMessage(`تم إلغاء تسجيل صعود الطالب ${studentName}`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle student school dropoff
  const handleStudentDropoff = (studentId: string, studentName: string) => {
    setBoardingStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        dropoff: true,
      },
    }));

    setToastMessage(`تم تأكيد نزول الطالب ${studentName} بأمان في المدرسة.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Trip Stage Update
  const handleUpdateTripStage = (stage: "ready" | "in_transit" | "arrived_school" | "return_trip") => {
    setTripStage(stage);
    let msg = "";
    if (stage === "ready") msg = "تم تجهيز الحافلة وبدء الفحص الفني اليومي.";
    if (stage === "in_transit") msg = "انطلقت الحافلة في المسار الصباحي وتفعيل نظام GPS.";
    if (stage === "arrived_school") msg = "وصلت الحافلة إلى حرم المدرسة وتم نزول الطلاب بأمان.";
    if (stage === "return_trip") msg = "بدأت رحلة العودة المسائية لتوصيل الطلاب للمنازل.";

    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Broadcast Alert to Parents
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setToastMessage(`تم بث التنبيه الفوري لجميع أولياء أمور حافلة (${currentRoute.name}) بنجاح!`);
    setBroadcastText("");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // If driver is not authenticated, show Driver Login Screen
  if (!authenticatedRoute) {
    return (
      <div className="max-w-lg mx-auto my-10 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-xs">
          <Bus className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-2">
            الدخول برقم السائق فقط
          </span>
          <h2 className="text-xl font-black text-slate-900 mb-1">
            بوابة السائق والنقل المدرسي
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            تفتح بوابة السائقين برقم السائق المعتمد لعرض مسار الحافلة، كشف ركاب الفوج، التتبع الآلي GPS، وتسجيل الصعود والنزول.
          </p>
        </div>

        <form onSubmit={handleDriverLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
              <span>رقم السائق المعتمد (Driver Number) *</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                placeholder="أدخل رقم السائق (مثال: 1 أو 2)"
                value={driverNumberInput}
                onChange={(e) => setDriverNumberInput(e.target.value)}
                className="w-full p-3.5 pr-10 rounded-xl border border-slate-300 text-center text-base font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-slate-50/50"
              />
              <Bus className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10.5px] text-slate-500 mt-1">
              * لكل سائق وحافلة رقم معتمد من إدارة المدرسة؛ أدخل رقم السائق للانتقال الفوري لرحلتك.
            </p>
          </div>

          {driverLoginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{driverLoginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>دخول لبوابة السائق والرحلة</span>
          </button>
        </form>

        {/* Quick Sample Drivers for 1-Click Testing */}
        <div className="mt-8 pt-5 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>سائقو الحافلات المسجلون (انقر للتجربة والدخول المباشر):</span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold">تجربة الدخول الفوري</span>
          </div>

          <div className="space-y-1.5">
            {busRoutes.map((rt) => (
              <button
                key={rt.id}
                type="button"
                onClick={() => {
                  setDriverNumberInput(rt.driverNumber || "1");
                  const res = loginDriverWithNumber(rt.driverNumber || "1");
                  if (res.success && res.route) {
                    setSelectedRouteId(res.route.id);
                    setIsDriverLoggedOut(false);
                    setDriverLoginError(null);
                  }
                }}
                className="w-full text-right p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/90 text-slate-800 border border-amber-200 text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">{rt.driverName}</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">
                    {rt.name || rt.routeNumber} • لوحة: <span className="font-mono text-slate-700">{rt.busPlate}</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black font-mono text-xs">
                    رقم السائق: #{rt.driverNumber || "1"}
                  </span>
                  <div className="text-[10px] font-bold text-amber-800 mt-0.5">{rt.shift || "الفوج الأول (صباحي)"}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner for Bus Supervisor Portal */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-xs">
            🚌
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900">{currentRoute?.driverName || "سائق الحافلة"}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 font-mono">
                رقم السائق: #{currentRoute?.driverNumber || "1"}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                (currentRoute?.shift && (currentRoute.shift.includes("مسائي") || currentRoute.shift.includes("الثاني")))
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}>
                {currentRoute?.shift || "الفوج الأول (صباحي)"}
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                لوحة: <strong className="text-slate-800">{currentRoute?.busPlate}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مسار الرحلة: <strong className="text-slate-800">{currentRoute?.name || currentRoute?.routeNumber}</strong> • المشرف: {currentRoute?.supervisorName} ({currentRoute?.supervisorPhone})
            </p>
          </div>
        </div>

        {/* Action: Driver Logout button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDriverLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
            title="تسجيل خروج السائق والعودة لشاشة الدخول"
          >
            <span>خروج السائق / تبديل الحافلة</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("passengers")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "passengers"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>كشف صعود الطلاب ({assignedStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "radar"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>رادار GPS المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab("trip_status")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "trip_status"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>التحكم بالرحلة</span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "broadcast"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>تنبيهات أولياء الأمور</span>
          </button>
        </div>
      </div>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Automatic GPS Location Telemetry Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 border border-amber-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            📡
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm text-amber-300">
                التحديد الآلي لموقع الحافلة (Auto-GPS Live Telemetry)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>تحديث تلقائي لحظة بلحظة</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-1 flex-wrap font-mono">
              <span>📍 العرض: <strong className="text-white">{liveGpsCoords.lat}° N</strong></span>
              <span>📍 الطول: <strong className="text-white">{liveGpsCoords.lng}° E</strong></span>
              <span>⚡ السرعة: <strong className="text-emerald-400">{liveGpsCoords.speed} كم/س</strong></span>
              <span>🧭 الاتجاه: <strong className="text-amber-200">{liveGpsCoords.heading}</strong></span>
              <span className="text-[11px] text-slate-400">آخر إشارة: {liveGpsCoords.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={requestDeviceLocation}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            title="تحديد موقع الحافلة الجغرافي آلياً الآن عبر GPS الجهاز"
          >
            <LocateFixed className="w-4 h-4" />
            <span>تحديد موقعي الآن آلياً</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAutoGps(!isAutoGps)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoGps
                ? "bg-emerald-600/30 text-emerald-200 border-emerald-500/40 hover:bg-emerald-600/40"
                : "bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoGps ? "animate-spin" : ""}`} />
            <span>{isAutoGps ? "التتبع الآلي: مفعل" : "التتبع الآلي: معطل"}</span>
          </button>
        </div>
      </div>

      {/* Route Info & Trip Status Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <span className="stat-label">الحافلة النشطة</span>
          <div className="stat-value text-slate-900 text-base">{currentRoute?.name || "حافلة #104"}</div>
          <div className="text-[10px] text-slate-500 mt-1">لوحة: {currentRoute?.plateNumber || "أ ب ج 104"}</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">الطلاب المصاحبين للرحلة</span>
          <div className="stat-value text-amber-700">{assignedStudents.length} طالب</div>
          <div className="text-[10px] text-slate-500 mt-1">السعة: {currentRoute?.capacity || 28} مقعد</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">عدد الطلاب الصاعدين</span>
          <div className="stat-value text-emerald-700">{boardedCount} طالب</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            {assignedStudents.length - boardedCount} طالب قيد الصعود
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">حالة الرحلة الحالية</span>
          <div className="stat-value text-blue-700 text-sm mt-1">
            {tripStage === "ready"
              ? "جاهزة للانطلاق"
              : tripStage === "in_transit"
              ? "في المسار الصباحي 🟢"
              : tripStage === "arrived_school"
              ? "وصلت المدرسة 🏫"
              : "رحلة العودة 🏠"}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">نظام الملاحة نشط</div>
        </div>
      </div>

      {/* TAB 1: PASSENGERS & BOARDING CHECK-IN (KEY FEATURE) */}
      {activeTab === "passengers" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">اختر خط السير:</span>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 font-bold"
              >
                {busRoutes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.assignedStudentsCount} طالب)
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث باسم الطالب أو موقع المنزل..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md pr-8 pl-3 py-1.5 focus:border-amber-500 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Users className="w-4 h-4 text-amber-600" />
                <span>كشف صعود ونزول الطلاب (الرحلة الصباحية والمسائية)</span>
              </div>
              <span className="text-[11px] text-slate-500">
                انقر على الزر لتسجيل صعود الطالب وإرسال إشعار فوري لولي أمره
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAssigned.map((st, index) => {
                const bInfo = boardingStatus[st.id] || { boarded: false, dropoff: false };
                const studentAddress =
                  st.address ||
                  (st as any).residencePlace ||
                  st.transportation?.pickupLocation ||
                  "حي الروضة، شارع الأمير نايف";
                const estimatedDistanceMeters = 650 + (index * 420);

                return (
                  <div
                    key={st.id}
                    className="p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <img
                        src={st.photo || (st as any).avatar || "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&crop=faces"}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2 flex-wrap">
                          <span>{st.fullName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                            {st.gradeName} • {st.sectionName || "شعبة (أ)"}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                            ~{estimatedDistanceMeters} م عن الحافلة
                          </span>
                        </div>

                        {/* Student Exact Home Location */}
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            <span>موقع المنزل والالتقاط:</span>
                          </span>
                          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {studentAddress}
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studentAddress)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10.5px] text-blue-600 hover:text-blue-800 font-bold underline flex items-center gap-0.5"
                            title="فتح موقع منزل الطالب على Google Maps"
                          >
                            <span>خريطة المنزل</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        <div className="text-[10.5px] text-slate-500 font-mono">
                          ولي الأمر: <strong className="text-slate-700">{st.familyInfo?.fatherName || "—"}</strong> • هاتف: {st.familyInfo?.fatherPhone || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Fast Action Buttons for Bus Supervisor */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                      {/* Emergency Call to Parent */}
                      <a
                        href={`tel:${st.familyInfo?.fatherPhone || "966500000000"}`}
                        title="اتصال سريع بولي الأمر"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-[11px]">اتصال</span>
                      </a>

                      {/* Open Maps Navigation */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(studentAddress)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="بدء الملاحة والاتجاهات لمنزل الطالب"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px]">توجيه GPS</span>
                      </a>

                      {/* Boarding Status Toggle Button */}
                      <button
                        onClick={() =>
                          handleToggleBoarding(
                            st.id,
                            st.fullName,
                            st.familyInfo?.fatherPhone || "966500000000"
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          bInfo.boarded
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-slate-200 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800"
                        }`}
                      >
                        {bInfo.boarded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>صعد الحافلة ({bInfo.time || "07:15"})</span>
                          </>
                        ) : (
                          <>
                            <Bus className="w-3.5 h-3.5" />
                            <span>تسجيل صعود 🚌</span>
                          </>
                        )}
                      </button>

                      {/* Dropoff at School Button */}
                      {bInfo.boarded && (
                        <button
                          onClick={() => handleStudentDropoff(st.id, st.fullName)}
                          disabled={bInfo.dropoff}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            bInfo.dropoff
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                          }`}
                        >
                          {bInfo.dropoff ? "نزل بالمدرسة ✓" : "تأكيد النزول 🏫"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE GPS RADAR */}
      {activeTab === "radar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="wide-card">
            <div className="card-header">
              <span className="font-bold text-slate-800">بيانات التتبع الملاحي</span>
              <Navigation className="w-4 h-4 text-emerald-600 animate-spin" />
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">إحداثيات العرض:</span>
                  <strong className="font-mono">24.7136° N</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">إحداثيات الطول:</span>
                  <strong className="font-mono">46.6753° E</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">السرعة الحالية:</span>
                  <strong className="font-mono text-emerald-700 font-bold">
                    {currentRoute?.currentGps?.speed || 42} كم/ساعة
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">نقطة التوقف التالية:</span>
                  <strong className="text-amber-800 font-bold">
                    {currentRoute?.currentGps?.currentStop || "حي الروضة - شارع المدارس"}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>سلامة القيادة والسرعة النظامية</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  الحافلة تسير ضمن السرعة المحددة (أقل من 60 كم/س) مع التزام كامل بإشارات الأمان وتنبيهات الطلاب.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 wide-card">
            <div className="card-header">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>شاشة الرادار وموقع الحافلة الفعلي على الخريطة</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono font-bold">LIVE TELEMETRY</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl m-3 text-white relative min-h-[320px] flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 text-xs">
                  <div className="text-slate-400 text-[10px]">المسار الحالي:</div>
                  <div className="font-bold text-amber-400">{currentRoute?.name} • مسار الروضة والحمراء</div>
                </div>

                <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>تحديث كل 3 ثوانٍ</span>
                </div>
              </div>

              {/* Animated Center Bus */}
              <div className="relative z-10 my-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                  <Bus className="w-10 h-10" />
                </div>
                <div className="text-xs font-bold text-amber-300 mt-2 bg-slate-800/90 px-3 py-1 rounded-full border border-amber-400/30">
                  الحافلة تسير في شارع الملك عبد الله باتجاه المدرسة
                </div>
              </div>

              <div className="relative z-10 bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 text-xs flex items-center justify-between">
                <span>الطلاب المتواجدين على متن الحافلة: <strong className="text-emerald-400">{boardedCount} طلاب</strong></span>
                <span className="text-slate-400 text-[10px]">إشارة GPS قوية (5G IoT)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRIP CONTROL */}
      {activeTab === "trip_status" && (
        <div className="wide-card">
          <div className="card-header">
            <span className="font-bold text-slate-800">التحكم بمراحل رحلة الحافلة اليومية</span>
            <Play className="w-4 h-4 text-amber-600" />
          </div>

          <div className="p-4 space-y-4">
            <p className="text-xs text-slate-600">
              قم بتحديث مرحلة الرحلة لإرسال إشعارات تلقائية لأولياء أمور الطلاب على تطبيق الجوال.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleUpdateTripStage("ready")}
                className={`p-4 rounded-xl border text-right transition-all space-y-2 ${
                  tripStage === "ready"
                    ? "bg-slate-100 border-slate-400 ring-2 ring-slate-400"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  1
                </div>
                <div className="font-bold text-sm text-slate-900">جاهزة للانطلاق</div>
                <p className="text-[11px] text-slate-500">فحص الحافلة وجاهزية السائق</p>
              </button>

              <button
                onClick={() => handleUpdateTripStage("in_transit")}
                className={`p-4 rounded-xl border text-right transition-all space-y-2 ${
                  tripStage === "in_transit"
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div className="font-bold text-sm text-emerald-900">انطلقت في المسار 🟢</div>
                <p className="text-[11px] text-emerald-700">جمع الطلاب من نقاط التوقف</p>
              </button>

              <button
                onClick={() => handleUpdateTripStage("arrived_school")}
                className={`p-4 rounded-xl border text-right transition-all space-y-2 ${
                  tripStage === "arrived_school"
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div className="font-bold text-sm text-blue-900">وصلت المدرسة 🏫</div>
                <p className="text-[11px] text-blue-700">نزول الطلاب بأمان ودخول الفصول</p>
              </button>

              <button
                onClick={() => handleUpdateTripStage("return_trip")}
                className={`p-4 rounded-xl border text-right transition-all space-y-2 ${
                  tripStage === "return_trip"
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div className="font-bold text-sm text-amber-900">رحلة العودة المسائية 🏠</div>
                <p className="text-[11px] text-amber-700">توصيل الطلاب للمنازل بعد الدوام</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST ALERT TO PARENTS */}
      {activeTab === "broadcast" && (
        <div className="wide-card">
          <div className="card-header">
            <span className="font-bold text-slate-800">إرسال تنبيه جماعي فوري لأولياء أمور الحافلة</span>
            <Send className="w-4 h-4 text-amber-600" />
          </div>

          <form onSubmit={handleSendBroadcast} className="p-4 space-y-3 max-w-xl">
            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم إرسال هذا التنبيه الفوري كإشعار عاجل ورسالة SMS لجميع أولياء أمور الطلاب المسجلين في حافلة {currentRoute.name} ({assignedStudents.length} ولي أمر).
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">رسائل سريعة جاهزة:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "الحافلة ستتأخر 10 دقائق بسبب الازدحام المروري.",
                  "الحافلة وصلت الآن إلى نقطة التجمع المعتادة.",
                  "نرجو تواجد الطالب عند مدخل المنزل لاستلامه.",
                  "تم تعديل مسار الحافلة لوجود أعمال صيانة بالطريق.",
                ].map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBroadcastText(tmpl)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">نص التنبيه:</label>
              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                rows={3}
                placeholder="اكتب التنبيه هنا..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال التنبيه الفوري للجميع</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
