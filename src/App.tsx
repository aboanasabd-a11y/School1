import React, { useState } from "react";
import { SchoolProvider, useSchool } from "./context/SchoolContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { FooterBar } from "./components/layout/FooterBar";
import { DashboardOverview } from "./components/dashboard/DashboardOverview";
import { SchoolStructureView } from "./components/school/SchoolStructureView";
import { StudentsManagerView } from "./components/students/StudentsManagerView";
import { StaffManagerView } from "./components/staff/StaffManagerView";
import { ExamsManagerView } from "./components/exams/ExamsManagerView";
import { AttendanceBehaviorView } from "./components/attendance/AttendanceBehaviorView";
import { TransportationView } from "./components/transportation/TransportationView";
import { CommunicationView } from "./components/communication/CommunicationView";
import { TimetableManagerView } from "./components/timetable/TimetableManagerView";
import { ReportsView } from "./components/reports/ReportsView";
import { FinancialsView } from "./components/finance/FinancialsView";
import { SettingsManagerView } from "./components/settings/SettingsManagerView";
import { GeneralManagerPortal } from "./components/portals/GeneralManagerPortal";
import { TeacherPortal } from "./components/portals/TeacherPortal";
import { AccountantPortal } from "./components/portals/AccountantPortal";
import { ParentPortal } from "./components/portals/ParentPortal";
import { BusSupervisorPortal } from "./components/portals/BusSupervisorPortal";
import { SmartLinksModal } from "./components/links/SmartLinksModal";

const MainContent: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    currentUser,
    directLinkNotification,
    clearDirectLinkNotification,
    openSmartLinksModal,
  } = useSchool();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeModule) {
      // 5 Independent Role Portals
      case "portal_super_admin":
        return <GeneralManagerPortal />;
      case "portal_teacher":
        return <TeacherPortal />;
      case "portal_accountant":
        return <AccountantPortal />;
      case "portal_parent":
        return <ParentPortal />;
      case "portal_bus_supervisor":
        return <BusSupervisorPortal />;

      // Core System Modules
      case "dashboard":
        if (currentUser.role === "teacher") return <TeacherPortal />;
        if (currentUser.role === "accountant") return <AccountantPortal />;
        if (currentUser.role === "parent") return <ParentPortal />;
        if (currentUser.role === "bus_supervisor") return <BusSupervisorPortal />;
        return <DashboardOverview setActiveTab={setActiveModule} />;
      case "school":
        return <SchoolStructureView />;
      case "students":
        return <StudentsManagerView />;
      case "staff":
        return <StaffManagerView />;
      case "exams":
        return <ExamsManagerView />;
      case "attendance":
        return <AttendanceBehaviorView />;
      case "transport":
      case "transportation" as any:
        return <TransportationView />;
      case "communication":
        return <CommunicationView />;
      case "timetable":
        return <TimetableManagerView />;
      case "reports":
      case "ai" as any:
        return <ReportsView />;
      case "finance":
      case "financials" as any:
        return <FinancialsView />;
      case "settings":
      case "tech" as any:
        return <SettingsManagerView />;
      default:
        return <DashboardOverview setActiveTab={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900" dir="rtl">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Content View Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 w-full">
          <div className="max-w-[1600px] mx-auto">
            {directLinkNotification && (
              <div className="mb-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3.5 rounded-xl border border-blue-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2.5 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 font-bold">
                    🔗
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span>{directLinkNotification.message}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                        رابط مباشر موثق
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      تم تفعيل الصلاحيات الخاصة بالصفحة وتأكيد المعرف: <strong className="font-mono text-white">{directLinkNotification.targetCode}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => openSmartLinksModal(directLinkNotification.type)}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-bold border border-white/20 transition-colors"
                  >
                    مشاركة روابط أخرى
                  </button>
                  <button
                    onClick={clearDirectLinkNotification}
                    className="p-1 rounded text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="إغلاق التنبيه"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {renderActiveView()}
          </div>
        </main>

        {/* High Density Footer Status Bar */}
        <FooterBar />

        {/* Global Smart Links Modal */}
        <SmartLinksModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainContent />
    </SchoolProvider>
  );
}
