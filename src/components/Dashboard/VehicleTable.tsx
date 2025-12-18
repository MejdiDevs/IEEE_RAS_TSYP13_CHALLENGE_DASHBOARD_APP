import { motion } from "framer-motion";
import { Car, Battery, MoreVertical, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useData } from "@/contexts/DataContext";
import { Vehicle } from "@/types";
import { greedyAllocation } from "@/lib/allocation";
import { useMemo } from "react";

interface VehicleTableProps {
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

const getStatusColor = (vehicle: Vehicle, assignments: Record<string, string[]>) => {
  const hasTasks = assignments[vehicle.id]?.length > 0;
  if (hasTasks) return "bg-green-500/20 text-green-400 border-green-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const getBatteryColor = (level: number) => {
  if (level > 60) return "text-green-400";
  if (level > 30) return "text-accent";
  return "text-red-400";
};

export const VehicleTable = ({ onEdit, onDelete, onAdd }: VehicleTableProps) => {
  const { vehicles, tasks } = useData();
  
  const assignments = useMemo(() => {
    if (vehicles.length === 0 || tasks.length === 0) return {};
    const vehiclesCopy = vehicles.map(v => ({ ...v, remaining_capacity: v.capacity }));
    return greedyAllocation(vehiclesCopy, tasks);
  }, [vehicles, tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron text-lg font-bold">Fleet Vehicles</h3>
            <p className="font-inter text-sm text-muted-foreground">
              {vehicles.filter((v) => assignments[v.id]?.length > 0).length} active of {vehicles.length} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onAdd && (
              <Button
                onClick={onAdd}
                className="bg-purple-primary hover:bg-purple-primary/90 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            )}
            <Badge variant="outline" className="glass border-purple-primary/30 text-purple-light">
              Live Data
            </Badge>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-inter text-muted-foreground">Vehicle</TableHead>
              <TableHead className="font-inter text-muted-foreground">Type</TableHead>
              <TableHead className="font-inter text-muted-foreground">Status</TableHead>
              <TableHead className="font-inter text-muted-foreground">Battery</TableHead>
              <TableHead className="font-inter text-muted-foreground">Capacity</TableHead>
              <TableHead className="font-inter text-muted-foreground">Location</TableHead>
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
                className={`border-border/30 hover:bg-muted/30 transition-colors ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/30'
                }`}
              >
                <TableCell className="font-inter font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-primary/20 flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                    {vehicle.id}
                  </div>
                </TableCell>
                <TableCell className="font-inter capitalize text-muted-foreground">
                  {vehicle.vehicle_type || 'delivery'}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(vehicle, assignments)} capitalize`}>
                    {assignments[vehicle.id]?.length > 0 ? 'active' : 'idle'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Battery className={`w-4 h-4 ${getBatteryColor((vehicle as any).energy ?? 100)}`} />
                    <span className={`font-inter ${getBatteryColor((vehicle as any).energy ?? 100)}`}>
                      {(vehicle as any).energy ?? 100}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-inter text-muted-foreground">
                  {vehicle.capacity}
                </TableCell>
                <TableCell className="font-inter text-muted-foreground">
                  [{vehicle.location[0].toFixed(1)}, {vehicle.location[1].toFixed(1)}]
                </TableCell>
                <TableCell>
                  <button 
                    className="p-1 rounded hover:bg-muted/50 transition-colors"
                    onClick={() => onEdit?.(vehicle)}
                  >
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

