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

const MainContent: React.FC = () => {
  const { activeModule, setActiveModule } = useSchool();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeModule) {
      case "dashboard":
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
            {renderActiveView()}
          </div>
        </main>

        {/* High Density Footer Status Bar */}
        <FooterBar />
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
