import { motion } from "framer-motion";

const integrations = [
  { name: "AWS", logo: "☁️" },
  { name: "Google Cloud", logo: "🌐" },
  { name: "Azure", logo: "⚡" },
  { name: "Kubernetes", logo: "🔷" },
  { name: "Terraform", logo: "🏗️" },
  { name: "Docker", logo: "🐳" },
  { name: "Grafana", logo: "📊" },
  { name: "Prometheus", logo: "🔥" },
];

export const IntegrationsSection = () => {
  return (
    <section className="py-16 relative overflow-hidden border-y border-border/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-inter text-sm text-muted-foreground uppercase tracking-wider">
            Seamlessly integrates with your favorite tools
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-12 items-center"
          >
            {[...integrations, ...integrations, ...integrations].map((integration, index) => (
              <div
                key={`${integration.name}-${index}`}
                className="flex items-center gap-3 glass px-6 py-3 rounded-xl flex-shrink-0"
              >
                <span className="text-2xl">{integration.logo}</span>
                <span className="font-inter font-medium text-foreground/70 whitespace-nowrap">
                  {integration.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
