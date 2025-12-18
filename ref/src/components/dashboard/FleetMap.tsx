import { motion } from "framer-motion";
import { Car, MapPin, Target } from "lucide-react";

// Mock vehicles for map
const mapVehicles = [
  { id: "UAV-001", x: 35, y: 45, status: "active", type: "delivery" },
  { id: "UAV-002", x: 55, y: 25, status: "active", type: "reconnaissance" },
  { id: "UAV-003", x: 20, y: 70, status: "charging", type: "delivery" },
  { id: "UAV-004", x: 75, y: 55, status: "idle", type: "strike" },
  { id: "UAV-005", x: 60, y: 75, status: "active", type: "delivery" },
];

// Mock tasks for map
const mapTasks = [
  { id: "TSK-042", x: 40, y: 50, priority: 5 },
  { id: "TSK-038", x: 50, y: 30, priority: 4 },
  { id: "TSK-045", x: 65, y: 80, priority: 3 },
  { id: "TSK-051", x: 25, y: 35, priority: 5 },
  { id: "TSK-052", x: 80, y: 40, priority: 2 },
];

const getVehicleColor = (status: string) => {
  switch (status) {
    case "active":
      return "#22c55e";
    case "idle":
      return "#3b82f6";
    case "charging":
      return "#eab308";
    default:
      return "#6b7280";
  }
};

const getTaskColor = (priority: number) => {
  if (priority >= 4) return "#ef4444";
  if (priority >= 3) return "#eab308";
  return "#3b82f6";
};

export const FleetMap = () => {
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
            <h3 className="font-orbitron text-lg font-bold">Fleet Map</h3>
            <p className="font-inter text-sm text-muted-foreground">
              Real-time vehicle and task positions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-green-400" />
              <span className="font-inter text-xs text-muted-foreground">Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-red-400" />
              <span className="font-inter text-xs text-muted-foreground">Task</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-gradient-to-br from-background via-purple-primary/5 to-background">
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="hsl(240, 10%, 15%)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Tasks */}
        {mapTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute group"
            style={{ left: `${task.x}%`, top: `${task.y}%` }}
          >
            <div
              className="w-4 h-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2"
              style={{
                backgroundColor: `${getTaskColor(task.priority)}20`,
                borderColor: getTaskColor(task.priority),
              }}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="glass px-2 py-1 rounded text-xs whitespace-nowrap font-inter">
                {task.id} (P{task.priority})
              </div>
            </div>
          </motion.div>
        ))}

        {/* Vehicles */}
        {mapVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="absolute group"
            style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }}
          >
            <motion.div
              animate={vehicle.status === "active" ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative -translate-x-1/2 -translate-y-1/2"
            >
              {/* Glow effect for active vehicles */}
              {vehicle.status === "active" && (
                <div
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ backgroundColor: getVehicleColor(vehicle.status), opacity: 0.5 }}
                />
              )}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="relative z-10"
                style={{ filter: `drop-shadow(0 0 4px ${getVehicleColor(vehicle.status)})` }}
              >
                <polygon
                  points="12,2 22,20 12,16 2,20"
                  fill={getVehicleColor(vehicle.status)}
                  stroke={getVehicleColor(vehicle.status)}
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="glass px-2 py-1 rounded text-xs whitespace-nowrap font-inter">
                {vehicle.id} ({vehicle.status})
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
