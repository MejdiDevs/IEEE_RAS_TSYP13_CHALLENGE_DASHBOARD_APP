import { motion } from "framer-motion";
import { 
  Cpu, 
  Route, 
  Activity, 
  Bell, 
  Map, 
  BarChart2,
  Radio,
  Battery
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Smart Allocation",
    description: "Greedy algorithms optimize task assignment based on distance, capacity, and priority for maximum efficiency.",
  },
  {
    icon: Route,
    title: "Route Optimization",
    description: "Calculate optimal routes considering time windows, vehicle capabilities, and real-time constraints.",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    description: "Track vehicle status, battery levels, and task progress with sub-second latency updates.",
  },
  {
    icon: Bell,
    title: "Intelligent Alerts",
    description: "Automated notifications for overloaded vehicles, capacity warnings, and idle fleet members.",
  },
  {
    icon: Map,
    title: "Visual Fleet Map",
    description: "Interactive visualization showing vehicle positions, task locations, and route assignments.",
  },
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards with task distribution, route distances, and performance metrics.",
  },
  {
    icon: Radio,
    title: "Mesh Communication",
    description: "Monitor task announcements, winner decisions, and inter-vehicle messaging in real-time.",
  },
  {
    icon: Battery,
    title: "Energy Management",
    description: "Track energy consumption, remaining capacity, and optimize for battery efficiency.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-dark/10 via-transparent to-blue-dark/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm uppercase tracking-widest text-blue-light mb-4 block">
            Capabilities
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Powerful </span>
            <span className="gradient-text">Features</span>
          </h2>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to manage autonomous vehicle fleets with precision and intelligence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass-strong rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-light/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-primary/20 to-accent/20 flex items-center justify-center mb-5 group-hover:from-blue-primary/30 group-hover:to-accent/30 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-light" />
              </div>
              <h3 className="font-orbitron text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
