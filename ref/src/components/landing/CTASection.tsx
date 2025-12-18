import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-dark/20 to-blue-dark/20" />
      
      {/* Animated Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.8,
          }}
          className="absolute w-1 h-1 bg-blue-light rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            bottom: "20%",
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-light" />
            <span className="text-sm font-inter text-muted-foreground">
              Start Your Journey Today
            </span>
          </motion.div>

          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Ready to Transform </span>
            <br />
            <span className="gradient-text">Your Fleet Operations?</span>
          </h2>
          
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join the next generation of autonomous vehicle management. 
            Experience intelligent allocation, real-time monitoring, and 
            data-driven decision making.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="font-inter text-base px-10 py-7 bg-gradient-to-r from-blue-primary to-blue-light hover:opacity-90 transition-all glow border-0 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-inter text-base px-10 py-7 glass border-border hover:bg-muted/30"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2 font-inter text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2 font-inter text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2 font-inter text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Cancel anytime
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
