import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useData } from "@/contexts/DataContext";
import { useMemo } from "react";
import { greedyAllocation } from "@/lib/allocation";
import { Vehicle } from "@/types";

export const PerformanceChart = () => {
  const { vehicles, tasks } = useData();

  const assignments = useMemo(() => {
    if (vehicles.length === 0 || tasks.length === 0) return {};
    const vehiclesCopy = vehicles.map((v: Vehicle) => ({ ...v, remaining_capacity: v.capacity }));
    return greedyAllocation(vehiclesCopy, tasks);
  }, [vehicles, tasks]);

  const performanceData = useMemo(() => {
    const baseAllocatedCount = new Set(Object.values(assignments).flatMap(ids => ids)).size;
    const baseEfficiency = tasks.length > 0 ? Math.round((baseAllocatedCount / tasks.length) * 100) : 0;
    
    // Simulate realistic variation throughout the day
    // Peak hours (08:00-16:00) have higher activity, off-peak hours are lower
    const timeVariations = [
      { time: "00:00", multiplier: 0.3 }, // Night - low activity
      { time: "04:00", multiplier: 0.4 }, // Early morning - low activity
      { time: "08:00", multiplier: 0.8 }, // Morning rush - increasing
      { time: "12:00", multiplier: 1.0 }, // Midday peak - highest
      { time: "16:00", multiplier: 0.9 }, // Afternoon - still high
      { time: "20:00", multiplier: 0.6 }, // Evening - decreasing
      { time: "24:00", multiplier: 0.3 }, // Night - low activity
    ];
    
    return timeVariations.map(({ time, multiplier }) => {
      // Add some randomness for realism (±10%)
      const randomFactor = 0.9 + Math.random() * 0.2;
      const allocations = Math.max(0, Math.round(baseAllocatedCount * multiplier * randomFactor));
      const efficiency = Math.max(0, Math.min(100, Math.round(baseEfficiency * multiplier * randomFactor)));
      
      return { time, allocations, efficiency };
    });
  }, [assignments, tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="font-orbitron text-lg font-bold">Fleet Performance</h3>
        <p className="font-inter text-sm text-muted-foreground">
          Task allocations and efficiency over time
        </p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorAllocations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(270, 95%, 65%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(270, 95%, 65%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "hsl(0, 0%, 60%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(0, 0%, 30%)" }}
            />
            <YAxis
              tick={{ fill: "hsl(0, 0%, 60%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(0, 0%, 30%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 10%, 10%)",
                border: "1px solid hsl(240, 10%, 20%)",
                borderRadius: "8px",
                fontFamily: "Inter",
              }}
            />
            <Area
              type="monotone"
              dataKey="allocations"
              stroke="hsl(270, 95%, 65%)"
              fillOpacity={1}
              fill="url(#colorAllocations)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="efficiency"
              stroke="hsl(210, 100%, 60%)"
              fillOpacity={1}
              fill="url(#colorEfficiency)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-primary" />
          <span className="font-inter text-sm text-muted-foreground">Allocations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-light" />
          <span className="font-inter text-sm text-muted-foreground">Efficiency %</span>
        </div>
      </div>
    </motion.div>
  );
};

export const BatteryChart = () => {
  const { vehicles, tasks } = useData();

  const batteryData = useMemo(() => {
    if (vehicles.length === 0) {
      return [
        { time: "00:00", avg: 0, min: 0, max: 0 },
        { time: "04:00", avg: 0, min: 0, max: 0 },
        { time: "08:00", avg: 0, min: 0, max: 0 },
        { time: "12:00", avg: 0, min: 0, max: 0 },
        { time: "16:00", avg: 0, min: 0, max: 0 },
        { time: "20:00", avg: 0, min: 0, max: 0 },
        { time: "24:00", avg: 0, min: 0, max: 0 },
      ];
    }

    // Calculate initial battery levels based on vehicle activity
    // Vehicles with more tasks assigned have lower battery (simulating usage)
    const assignments = tasks.length > 0 
      ? greedyAllocation(
          vehicles.map((v: Vehicle) => ({ ...v, remaining_capacity: v.capacity })),
          tasks
        )
      : {};
    
    const taskCounts = new Map<string, number>();
    vehicles.forEach((v: Vehicle) => {
      // Use actual task assignments if available, otherwise estimate
      const actualTaskCount = assignments[v.id]?.length || 0;
      const estimatedTasks = actualTaskCount > 0 
        ? actualTaskCount 
        : Math.floor(Math.random() * 3); // 0-2 tasks if no assignments
      taskCounts.set(v.id, estimatedTasks);
    });
    
    const initialBatteries = vehicles.map((v: Vehicle) => {
      // If vehicle has energy property, use it; otherwise calculate based on activity
      if ((v as any).energy !== undefined) {
        return (v as any).energy;
      }
      
      // Simulate battery based on vehicle activity and energy capacity
      // More active vehicles (with tasks) have lower battery
      const taskCount = taskCounts.get(v.id) || 0;
      const baseBattery = 85 + Math.random() * 15; // Start between 85-100%
      const drainFromTasks = Math.min(taskCount * 8, 40); // Each task drains ~8%
      const randomVariation = (Math.random() - 0.5) * 10; // ±5% variation
      
      return Math.max(20, Math.min(100, baseBattery - drainFromTasks + randomVariation));
    });

    const baseAvg = Math.round(initialBatteries.reduce((a: number, b: number) => a + b, 0) / initialBatteries.length);
    const baseMin = Math.min(...initialBatteries);
    const baseMax = Math.max(...initialBatteries);

    // Simulate battery drain throughout the day
    // Battery decreases during active hours (08:00-20:00) and stabilizes at night
    const timePoints = [
      { time: "00:00", drainFactor: 0 }, // Night - minimal drain
      { time: "04:00", drainFactor: 0.1 }, // Early morning - slight drain
      { time: "08:00", drainFactor: 0.3 }, // Morning - active, draining
      { time: "12:00", drainFactor: 0.5 }, // Midday - peak drain
      { time: "16:00", drainFactor: 0.7 }, // Afternoon - continued drain
      { time: "20:00", drainFactor: 0.9 }, // Evening - high drain
      { time: "24:00", drainFactor: 1.0 }, // End of day - maximum drain
    ];

    return timePoints.map(({ time, drainFactor }) => {
      // Calculate drain: more drain during active hours
      const totalDrain = drainFactor * 25; // Up to 25% drain over the day
      const randomVariation = (Math.random() - 0.5) * 4; // ±2% variation
      
      const avg = Math.max(0, Math.min(100, Math.round(baseAvg - totalDrain + randomVariation)));
      const min = Math.max(0, Math.min(100, Math.round(baseMin - totalDrain * 0.8 + randomVariation)));
      const max = Math.max(0, Math.min(100, Math.round(baseMax - totalDrain * 1.2 + randomVariation)));
      
      return { time, avg, min, max };
    });
  }, [vehicles, tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="font-orbitron text-lg font-bold">Fleet Battery Levels</h3>
        <p className="font-inter text-sm text-muted-foreground">
          Average, minimum, and maximum battery across fleet
        </p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={batteryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "hsl(0, 0%, 60%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(0, 0%, 30%)" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "hsl(0, 0%, 60%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(0, 0%, 30%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 10%, 10%)",
                border: "1px solid hsl(240, 10%, 20%)",
                borderRadius: "8px",
                fontFamily: "Inter",
              }}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke="hsl(142, 76%, 45%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="min"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="font-inter text-sm text-muted-foreground">Max</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="font-inter text-sm text-muted-foreground">Avg</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="font-inter text-sm text-muted-foreground">Min</span>
        </div>
      </div>
    </motion.div>
  );
};
