import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar, DashboardHeader } from "@/components/dashboard/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { TaskList } from "@/components/dashboard/TaskList";
import { CommunicationLogs } from "@/components/dashboard/CommunicationLogs";
import { PerformanceChart, BatteryChart } from "@/components/dashboard/Charts";
import { FleetMap } from "@/components/dashboard/FleetMap";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background font-inter">
      <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <DashboardHeader collapsed={sidebarCollapsed} />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pt-24 pb-8 px-6"
      >
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Stats */}
          <DashboardStats />

          {/* Fleet Map */}
          <FleetMap />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <PerformanceChart />
            <BatteryChart />
          </div>

          {/* Tables Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VehicleTable />
            </div>
            <TaskList />
          </div>

          {/* Communication Logs */}
          <CommunicationLogs />
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
