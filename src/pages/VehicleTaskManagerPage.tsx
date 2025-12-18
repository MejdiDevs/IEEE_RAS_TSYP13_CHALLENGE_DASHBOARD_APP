import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar, DashboardHeader } from "@/components/Dashboard/DashboardLayout";
import { VehicleTaskManager } from "@/components/Dashboard/VehicleTaskManager";

export function VehicleTaskManagerPage() {
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
        <div className="max-w-[1600px] mx-auto">
          <VehicleTaskManager />
        </div>
      </motion.main>
    </div>
  );
}

