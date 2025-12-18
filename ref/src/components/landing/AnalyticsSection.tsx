import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, Gauge } from "lucide-react";

const metrics = [
  {
    icon: TrendingUp,
    value: "40%",
    label: "Efficiency Gain",
    description: "Average improvement in task completion rates",
  },
  {
    icon: Clock,
    value: "3x",
    label: "Faster Allocation",
    description: "Compared to manual assignment methods",
  },
  {
    icon: Target,
    value: "95%",
    label: "Task Success",
    description: "On-time delivery and mission completion",
  },
  {
    icon: Gauge,
    value: "60%",
    label: "Cost Reduction",
    description: "In fleet operational expenses",
  },
];

export const AnalyticsSection = () => {
  return (
    <section id="analytics" className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-border/30 rounded-full"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-blue-light mb-4 block">
              Performance
            </span>
            <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Data-Driven </span>
              <span className="gradient-text">Insights</span>
            </h2>
            <p className="font-inter text-muted-foreground text-lg mb-8 leading-relaxed">
              Make informed decisions with comprehensive analytics dashboards. 
              Track key performance indicators, identify bottlenecks, and optimize 
              your fleet operations with real-time data visualization.
            </p>

            <div className="space-y-4">
              {["Task distribution per vehicle", "Route efficiency analysis", "Priority queue management", "Capacity utilization tracking"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-light to-accent" />
                  <span className="font-inter text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-strong rounded-2xl p-6 text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <metric.icon className="w-5 h-5 text-blue-light" />
                </div>
                <div className="font-orbitron text-3xl font-bold gradient-text-alt mb-1">
                  {metric.value}
                </div>
                <div className="font-orbitron text-sm font-medium text-foreground mb-2">
                  {metric.label}
                </div>
                <div className="font-inter text-xs text-muted-foreground">
                  {metric.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
