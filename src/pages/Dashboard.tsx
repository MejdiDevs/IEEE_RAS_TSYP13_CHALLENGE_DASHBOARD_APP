import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { DashboardSidebar, DashboardHeader } from "@/components/Dashboard/DashboardLayout";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { VehicleTable } from "@/components/Dashboard/VehicleTable";
import { TaskList } from "@/components/Dashboard/TaskList";
import { CommunicationLogs } from "@/components/Dashboard/CommunicationLogs";
import { PerformanceChart, BatteryChart } from "@/components/Dashboard/Charts";
import { FleetMap } from "@/components/Dashboard/FleetMap";
import { VehicleForm } from "@/components/VehicleForm";
import { TaskForm } from "@/components/TaskForm";
import { useData } from "@/contexts/DataContext";
import { Vehicle, Task } from "@/types";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { vehicles, tasks, warnings, addVehicle, updateVehicle, deleteVehicle, addTask, updateTask, deleteTask } = useData();
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [location.hash]);

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleFormOpen(true);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
      toast.success('Vehicle deleted');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      toast.success('Task deleted');
    }
  };

  const handleSaveVehicle = async (vehicle: Vehicle) => {
    if (editingVehicle) {
      await updateVehicle(vehicle.id, vehicle);
      toast.success('Vehicle updated');
    } else {
      await addVehicle(vehicle);
      toast.success('Vehicle added');
    }
    setVehicleFormOpen(false);
    setEditingVehicle(null);
  };

  const handleSaveTask = async (task: Task) => {
    if (editingTask) {
      await updateTask(task.id, task);
      toast.success('Task updated');
    } else {
      await addTask(task);
      toast.success('Task added');
    }
    setTaskFormOpen(false);
    setEditingTask(null);
  };


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
          {warnings.length > 0 && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="font-semibold text-yellow-400 mb-2 font-inter">Warnings:</p>
              <ul className="list-disc list-inside space-y-1 text-sm font-inter">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats */}
          <div id="overview">
            <DashboardStats />
          </div>

          {/* Fleet Map */}
          <div id="fleet-map">
            <FleetMap />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <PerformanceChart />
            <BatteryChart />
          </div>

          {/* Tables Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div id="vehicles" className="lg:col-span-2 flex flex-col">
              <VehicleTable onEdit={handleEditVehicle} onDelete={handleDeleteVehicle} onAdd={handleAddVehicle} />
            </div>
            <div id="tasks" className="flex flex-col">
              <TaskList onEdit={handleEditTask} />
            </div>
          </div>

          {/* Communication Logs */}
          <CommunicationLogs />
        </div>
      </motion.main>

      <VehicleForm
        open={vehicleFormOpen}
        onOpenChange={(open) => {
          setVehicleFormOpen(open);
          if (!open) setEditingVehicle(null);
        }}
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
      />

      <TaskForm
        open={taskFormOpen}
        onOpenChange={(open) => {
          setTaskFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
