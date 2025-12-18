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

const performanceData = [
  { time: "00:00", allocations: 12, efficiency: 85 },
  { time: "04:00", allocations: 8, efficiency: 78 },
  { time: "08:00", allocations: 24, efficiency: 92 },
  { time: "12:00", allocations: 32, efficiency: 88 },
  { time: "16:00", allocations: 28, efficiency: 91 },
  { time: "20:00", allocations: 18, efficiency: 86 },
  { time: "24:00", allocations: 14, efficiency: 82 },
];

const batteryData = [
  { time: "00:00", avg: 75, min: 45, max: 95 },
  { time: "04:00", avg: 68, min: 38, max: 88 },
  { time: "08:00", avg: 82, min: 55, max: 98 },
  { time: "12:00", avg: 71, min: 42, max: 92 },
  { time: "16:00", avg: 65, min: 35, max: 85 },
  { time: "20:00", avg: 78, min: 50, max: 95 },
  { time: "24:00", avg: 74, min: 48, max: 90 },
];

export const PerformanceChart = () => {
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
