import { motion } from "framer-motion";
import { Car, ListTodo, Activity, Battery, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useMemo } from "react";
import { greedyAllocation } from "@/lib/allocation";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}

const StatCard = ({ title, value, change, icon: Icon, color, delay = 0 }: StatCardProps) => {
  const getTrendIcon = () => {
    if (!change) return <Minus className="w-3 h-3" />;
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground";
    if (change > 0) return "text-green-400";
    return "text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-xl p-6 hover:border-purple-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-inter text-sm text-muted-foreground mb-1">{title}</p>
          <p className="font-orbitron text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 font-inter text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(change)}% from last hour</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export const DashboardStats = () => {
  const { vehicles, tasks, warnings } = useData();

  const avgBattery = useMemo(() => {
    if (vehicles.length === 0) return 0;
    
    // Calculate battery levels similar to BatteryChart
    // Use greedyAllocation to determine vehicle activity
    const assignments = greedyAllocation(
      vehicles.map((v) => ({ ...v, remaining_capacity: v.capacity })),
      []
    );
    
    const batteries = vehicles.map((v) => {
      // If vehicle has energy property, use it; otherwise calculate based on activity
      if ((v as any).energy !== undefined) {
        return (v as any).energy;
      }
      
      // Simulate battery based on vehicle activity
      const taskCount = assignments[v.id]?.length || 0;
      const baseBattery = 85 + Math.random() * 15; // Start between 85-100%
      const drainFromTasks = Math.min(taskCount * 8, 40); // Each task drains ~8%
      const randomVariation = (Math.random() - 0.5) * 10; // ±5% variation
      
      return Math.max(20, Math.min(100, baseBattery - drainFromTasks + randomVariation));
    });
    
    const sum = batteries.reduce((acc, b) => acc + b, 0);
    return Math.round(sum / batteries.length);
  }, [vehicles]);

  const stats = [
    {
      title: "Active Vehicles",
      value: vehicles.length,
      change: 4.5,
      icon: Car,
      color: "bg-purple-primary/20 text-purple-light",
    },
    {
      title: "Pending Tasks",
      value: tasks.length,
      change: -12,
      icon: ListTodo,
      color: "bg-blue-light/20 text-blue-light",
    },
    {
      title: "System Status",
      value: warnings.length === 0 ? "Optimal" : "Warning",
      icon: Activity,
      color: warnings.length === 0 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400",
    },
    {
      title: "Avg Battery",
      value: `${avgBattery}%`,
      change: 2,
      icon: Battery,
      color: "bg-accent/20 text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
};

