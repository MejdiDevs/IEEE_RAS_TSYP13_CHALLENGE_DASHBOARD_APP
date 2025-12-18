import { motion } from "framer-motion";
import { Clock, Flag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useData } from "@/contexts/DataContext";
import { Task } from "@/types";
import { greedyAllocation } from "@/lib/allocation";
import { useMemo } from "react";

interface TaskListProps {
  onEdit?: (task: Task) => void;
}

const getPriorityColor = (priority: number) => {
  if (priority >= 4) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (priority >= 3) return "bg-accent/20 text-accent border-accent/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const getStatusBadge = (task: Task, assignments: Record<string, string[]>) => {
  const isAssigned = Object.values(assignments).some(ids => ids.includes(task.id));
  if (isAssigned) {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Progress</Badge>;
  }
  return <Badge className="bg-purple-primary/20 text-purple-light border-purple-primary/30">Pending</Badge>;
};

const formatTime = (time: number) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const TaskList = ({ onEdit }: TaskListProps) => {
  const { vehicles, tasks } = useData();

  const assignments = useMemo(() => {
    if (vehicles.length === 0 || tasks.length === 0) return {};
    const vehiclesCopy = vehicles.map(v => ({ ...v, remaining_capacity: v.capacity }));
    return greedyAllocation(vehiclesCopy, tasks);
  }, [vehicles, tasks]);

  const assignedVehicle = (taskId: string) => {
    for (const [vehicleId, taskIds] of Object.entries(assignments)) {
      if (taskIds.includes(taskId)) {
        return vehicleId;
      }
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-xl flex flex-col h-full overflow-hidden"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron text-lg font-bold">Active Tasks</h3>
            <p className="font-inter text-sm text-muted-foreground">
              {tasks.filter((t) => !assignedVehicle(t.id)).length} pending allocation
            </p>
          </div>
          <button className="font-inter text-sm text-purple-light hover:text-purple-primary transition-colors">
            View All
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: '350px' }}>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-purple-primary/30 transition-colors cursor-pointer"
            onClick={() => onEdit?.(task)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-semibold text-foreground">{task.id}</span>
                <Badge className={getPriorityColor(task.priority)}>
                  P{task.priority}
                </Badge>
              </div>
              {getStatusBadge(task, assignments)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flag className="w-3.5 h-3.5" />
                <span className="capitalize">{task.task_type}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(task.time_window[0])} - {formatTime(task.time_window[1])}</span>
              </div>
            </div>

            {assignedVehicle(task.id) && (
              <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                <span className="font-inter text-xs text-muted-foreground">Assigned to</span>
                <span className="font-inter text-sm text-blue-light">{assignedVehicle(task.id)}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

