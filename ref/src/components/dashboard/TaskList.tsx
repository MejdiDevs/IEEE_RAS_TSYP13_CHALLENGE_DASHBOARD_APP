import { motion } from "framer-motion";
import { Clock, MapPin, Flag, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock tasks data
const tasks = [
  {
    id: "TSK-042",
    type: "delivery",
    priority: 5,
    location: [40.7128, -74.006],
    demand: 25,
    timeWindow: [1200, 1400],
    status: "in_progress",
    assignedTo: "UAV-001",
  },
  {
    id: "TSK-038",
    type: "reconnaissance",
    priority: 4,
    location: [40.7589, -73.9851],
    demand: 10,
    timeWindow: [1100, 1300],
    status: "in_progress",
    assignedTo: "UAV-002",
  },
  {
    id: "TSK-045",
    type: "delivery",
    priority: 3,
    location: [40.7282, -73.7949],
    demand: 45,
    timeWindow: [1300, 1600],
    status: "in_progress",
    assignedTo: "UAV-005",
  },
  {
    id: "TSK-051",
    type: "delivery",
    priority: 5,
    location: [40.7484, -73.9857],
    demand: 30,
    timeWindow: [1400, 1500],
    status: "pending",
    assignedTo: null,
  },
  {
    id: "TSK-052",
    type: "reconnaissance",
    priority: 2,
    location: [40.7614, -73.9776],
    demand: 15,
    timeWindow: [1500, 1800],
    status: "pending",
    assignedTo: null,
  },
];

const getPriorityColor = (priority: number) => {
  if (priority >= 4) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (priority >= 3) return "bg-accent/20 text-accent border-accent/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in_progress":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Progress</Badge>;
    case "pending":
      return <Badge className="bg-purple-primary/20 text-purple-light border-purple-primary/30">Pending</Badge>;
    case "completed":
      return <Badge className="bg-muted text-muted-foreground">Completed</Badge>;
    default:
      return null;
  }
};

const formatTime = (time: number) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const TaskList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-xl"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron text-lg font-bold">Active Tasks</h3>
            <p className="font-inter text-sm text-muted-foreground">
              {tasks.filter((t) => t.status === "pending").length} pending allocation
            </p>
          </div>
          <button className="font-inter text-sm text-purple-light hover:text-purple-primary transition-colors">
            View All
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-purple-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-semibold text-foreground">{task.id}</span>
                <Badge className={getPriorityColor(task.priority)}>
                  P{task.priority}
                </Badge>
              </div>
              {getStatusBadge(task.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flag className="w-3.5 h-3.5" />
                <span className="capitalize">{task.type}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(task.timeWindow[0])} - {formatTime(task.timeWindow[1])}</span>
              </div>
            </div>

            {task.assignedTo && (
              <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                <span className="font-inter text-xs text-muted-foreground">Assigned to</span>
                <span className="font-inter text-sm text-blue-light">{task.assignedTo}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
