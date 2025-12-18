import { motion } from "framer-motion";
import { Car, MapPin, Battery, Zap, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for vehicles
const vehicles = [
  {
    id: "UAV-001",
    type: "delivery",
    status: "active",
    location: [40.7128, -74.006],
    battery: 85,
    capacity: 100,
    remainingCapacity: 45,
    currentTask: "TSK-042",
    speed: 45,
  },
  {
    id: "UAV-002",
    type: "reconnaissance",
    status: "active",
    location: [40.7589, -73.9851],
    battery: 62,
    capacity: 50,
    remainingCapacity: 50,
    currentTask: "TSK-038",
    speed: 60,
  },
  {
    id: "UAV-003",
    type: "delivery",
    status: "charging",
    location: [40.7484, -73.9857],
    battery: 23,
    capacity: 100,
    remainingCapacity: 100,
    currentTask: null,
    speed: 0,
  },
  {
    id: "UAV-004",
    type: "strike",
    status: "idle",
    location: [40.7614, -73.9776],
    battery: 94,
    capacity: 80,
    remainingCapacity: 80,
    currentTask: null,
    speed: 0,
  },
  {
    id: "UAV-005",
    type: "delivery",
    status: "active",
    location: [40.7282, -73.7949],
    battery: 71,
    capacity: 100,
    remainingCapacity: 30,
    currentTask: "TSK-045",
    speed: 52,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "idle":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "charging":
      return "bg-accent/20 text-accent border-accent/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: string) => {
  return <Car className="w-4 h-4" />;
};

const getBatteryColor = (level: number) => {
  if (level > 60) return "text-green-400";
  if (level > 30) return "text-accent";
  return "text-red-400";
};

export const VehicleTable = () => {
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
            <h3 className="font-orbitron text-lg font-bold">Fleet Vehicles</h3>
            <p className="font-inter text-sm text-muted-foreground">
              {vehicles.filter((v) => v.status === "active").length} active of {vehicles.length} total
            </p>
          </div>
          <Badge variant="outline" className="glass border-purple-primary/30 text-purple-light">
            Live Data
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-inter text-muted-foreground">Vehicle</TableHead>
              <TableHead className="font-inter text-muted-foreground">Type</TableHead>
              <TableHead className="font-inter text-muted-foreground">Status</TableHead>
              <TableHead className="font-inter text-muted-foreground">Battery</TableHead>
              <TableHead className="font-inter text-muted-foreground">Capacity</TableHead>
              <TableHead className="font-inter text-muted-foreground">Current Task</TableHead>
              <TableHead className="font-inter text-muted-foreground w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle, index) => (
              <motion.tr
                key={vehicle.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-inter font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-primary/20 flex items-center justify-center">
                      {getTypeIcon(vehicle.type)}
                    </div>
                    {vehicle.id}
                  </div>
                </TableCell>
                <TableCell className="font-inter capitalize text-muted-foreground">
                  {vehicle.type}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(vehicle.status)} capitalize`}>
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Battery className={`w-4 h-4 ${getBatteryColor(vehicle.battery)}`} />
                    <span className={`font-inter ${getBatteryColor(vehicle.battery)}`}>
                      {vehicle.battery}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-inter text-muted-foreground">
                  {vehicle.remainingCapacity}/{vehicle.capacity}
                </TableCell>
                <TableCell className="font-inter">
                  {vehicle.currentTask ? (
                    <span className="text-blue-light">{vehicle.currentTask}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};
