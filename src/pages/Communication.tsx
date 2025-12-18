import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar, DashboardHeader } from "@/components/Dashboard/DashboardLayout";
import { CommunicationLogs } from "@/components/Dashboard/CommunicationLogs";
import { useData } from "@/contexts/DataContext";

export function Communication() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-background font-inter flex flex-col overflow-hidden">
      <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <DashboardHeader collapsed={sidebarCollapsed} />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 pt-24 pb-6 px-6 overflow-hidden flex flex-col"
      >
        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col min-h-0">
          <CommunicationLogs fullHeight={true} />
        </div>
      </motion.main>
    </div>
  );
}
