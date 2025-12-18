import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, GripVertical, Target } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { greedyAllocation } from "@/lib/allocation";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

export const VehicleTaskManager = () => {
  const { vehicles, tasks, customTaskOrders, setCustomTaskOrder } = useData();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  // Get assignments from greedy allocation
  const assignments = useMemo(() => {
    if (vehicles.length === 0 || tasks.length === 0) return {};
    const vehiclesCopy = vehicles.map(v => ({ ...v, remaining_capacity: v.capacity }));
    return greedyAllocation(vehiclesCopy, tasks);
  }, [vehicles, tasks]);

  // Auto-select first vehicle when component mounts or vehicles change
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  // Get tasks for selected vehicle (use custom order if available, otherwise use greedy allocation)
  const vehicleTasks = useMemo(() => {
    if (!selectedVehicleId) return [];
    
    const customOrder = customTaskOrders[selectedVehicleId];
    const greedyOrder = assignments[selectedVehicleId] || [];
    
    // Use custom order if it exists and has tasks, otherwise use greedy allocation
    const taskIds = customOrder && customOrder.length > 0 ? customOrder : greedyOrder;
    
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    return taskIds
      .map(id => taskMap.get(id))
      .filter(Boolean) as typeof tasks;
  }, [selectedVehicleId, assignments, customTaskOrders, tasks]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTasks = [...vehicleTasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(dragOverIndex, 0, removed);

    // Update custom order
    const newTaskIds = newTasks.map(t => t.id);
    setCustomTaskOrder(selectedVehicleId, newTaskIds);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron text-lg font-bold">Vehicle Task Manager</h3>
            <p className="font-inter text-sm text-muted-foreground">
              Reorder tasks for selected vehicle
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Vehicle Selector */}
        <div className="space-y-2">
          <label className="font-inter text-sm font-medium text-foreground">
            Select Vehicle
          </label>
          <Select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full"
          >
            <option value="">-- Select a vehicle --</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.id} ({assignments[vehicle.id]?.length || 0} tasks)
              </option>
            ))}
          </Select>
        </div>

        {/* Vehicle Info */}
        {selectedVehicle && (
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-purple-primary/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-purple-light" />
            </div>
            <div className="flex-1">
              <div className="font-inter font-semibold">{selectedVehicle.id}</div>
              <div className="font-inter text-xs text-muted-foreground capitalize">
                {selectedVehicle.vehicle_type || 'delivery'} • Capacity: {selectedVehicle.capacity}
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {vehicleTasks.length} {vehicleTasks.length === 1 ? 'task' : 'tasks'}
            </Badge>
          </div>
        )}

        {/* Task List */}
        {selectedVehicleId && (
          <div className="space-y-2">
            <label className="font-inter text-sm font-medium text-foreground">
              Task Order (drag to reorder)
            </label>
            {vehicleTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-inter">
                No tasks assigned to this vehicle
              </div>
            ) : (
              <div className="space-y-2">
                {vehicleTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragLeave={handleDragLeave}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border transition-all cursor-move
                      ${draggedIndex === index ? 'opacity-50 bg-purple-primary/10 border-purple-primary/50' : ''}
                      ${dragOverIndex === index && draggedIndex !== index ? 'bg-purple-primary/20 border-purple-primary/50 scale-105' : ''}
                      ${draggedIndex !== index && dragOverIndex !== index ? 'bg-muted/30 border-border/50 hover:bg-muted/50' : ''}
                    `}
                    style={{
                      transform: draggedIndex === index ? 'rotate(2deg)' : undefined,
                    }}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-inter font-semibold text-sm">Task {task.id}</div>
                        <div className="font-inter text-xs text-muted-foreground">
                          Priority: {task.priority} • Demand: {task.demand} • Location: [{task.location[0].toFixed(1)}, {task.location[1].toFixed(1)}]
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          className={
                            task.priority >= 4
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : task.priority >= 3
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }
                        >
                          P{task.priority}
                        </Badge>
                        <div className="font-inter text-xs text-muted-foreground w-8 text-center">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedVehicleId && (
          <div className="p-12 text-center text-muted-foreground font-inter">
            Select a vehicle to manage its task order
          </div>
        )}
      </div>
    </motion.div>
  );
};

