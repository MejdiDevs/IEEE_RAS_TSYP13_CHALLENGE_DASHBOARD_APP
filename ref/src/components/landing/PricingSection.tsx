import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "299",
    description: "Perfect for small fleets getting started",
    features: [
      "Up to 25 vehicles",
      "Basic task allocation",
      "Real-time monitoring",
      "Email support",
      "7-day data retention",
    ],
    popular: false,
  },
  {
    name: "Professional",
    icon: Shield,
    price: "799",
    description: "For growing operations that need more power",
    features: [
      "Up to 100 vehicles",
      "Advanced allocation algorithms",
      "Priority routing optimization",
      "Communication logs analysis",
      "30-day data retention",
      "24/7 priority support",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "Custom",
    description: "For large-scale fleet operations",
    features: [
      "Unlimited vehicles",
      "Custom allocation models",
      "Multi-region support",
      "Advanced analytics & AI",
      "Unlimited data retention",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm font-medium text-blue-light uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mt-4 mb-4">
            Plans for <span className="gradient-text">Every Scale</span>
          </h2>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your fleet size and operational needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "glass border-purple-primary/50 glow-purple"
                  : "glass"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-primary to-blue-light text-white text-xs font-inter font-semibold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${plan.popular ? "bg-purple-primary/20" : "bg-muted/50"}`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-purple-primary" : "text-blue-light"}`} />
                </div>
                <h3 className="font-orbitron text-xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="font-orbitron text-4xl font-bold">
                  {plan.price === "Custom" ? "" : "$"}
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="font-inter text-muted-foreground">/month</span>
                )}
              </div>

              <p className="font-inter text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-inter text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-inter ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-primary to-blue-light hover:opacity-90 border-0"
                    : "glass border-border hover:bg-muted/30"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
