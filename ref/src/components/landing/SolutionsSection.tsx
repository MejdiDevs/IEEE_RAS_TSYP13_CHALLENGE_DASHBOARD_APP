import { motion } from "framer-motion";
import { Truck, Plane, Crosshair, CheckCircle2 } from "lucide-react";

const solutions = [
  {
    icon: Truck,
    title: "Delivery Operations",
    description: "Optimize last-mile delivery with intelligent routing and capacity management for autonomous delivery vehicles.",
    capabilities: [
      "Dynamic route recalculation",
      "Time window optimization",
      "Load balancing algorithms",
      "Real-time delivery tracking",
    ],
    gradient: "from-blue-primary to-blue-light",
  },
  {
    icon: Plane,
    title: "Reconnaissance Missions",
    description: "Coordinate UAV fleets for surveillance and data collection with mesh communication protocols.",
    capabilities: [
      "Mesh network coordination",
      "Coverage optimization",
      "Energy-aware planning",
      "Data relay management",
    ],
    gradient: "from-accent to-blue-light",
  },
  {
    icon: Crosshair,
    title: "Task Coordination",
    description: "Advanced multi-vehicle task allocation with auction-based decision making and conflict resolution.",
    capabilities: [
      "Auction-based allocation",
      "Priority scheduling",
      "Capability matching",
      "Conflict resolution",
    ],
    gradient: "from-purple-primary to-accent",
  },
];

export const SolutionsSection = () => {
  return (
    <section id="solutions" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm uppercase tracking-widest text-accent mb-4 block">
            Use Cases
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Mission-Critical </span>
            <span className="gradient-text">Solutions</span>
          </h2>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-lg">
            Tailored fleet management for diverse autonomous vehicle operations.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="glass-strong rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-xl hover:shadow-blue-light/5">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="w-7 h-7 text-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-orbitron text-xl font-semibold text-foreground mb-4">
                  {solution.title}
                </h3>
                <p className="font-inter text-muted-foreground mb-6 leading-relaxed">
                  {solution.description}
                </p>

                {/* Capabilities */}
                <ul className="space-y-3">
                  {solution.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-3 font-inter text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-light flex-shrink-0" />
                      <span className="text-muted-foreground">{cap}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Gradient Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
