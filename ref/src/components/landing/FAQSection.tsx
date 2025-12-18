import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the intelligent task allocation work?",
    answer:
      "Our system uses a sophisticated greedy allocation algorithm that considers multiple factors: Euclidean distance between vehicles and tasks, vehicle capabilities, remaining capacity, time window constraints, and priority multipliers. This ensures optimal task distribution across your fleet.",
  },
  {
    question: "What types of vehicles are supported?",
    answer:
      "We support all types of autonomous vehicles including delivery drones, reconnaissance UAVs, and ground vehicles. Each vehicle can be configured with specific capabilities, capacity limits, and energy constraints to match your operational needs.",
  },
  {
    question: "Can I integrate with my existing systems?",
    answer:
      "Yes! Our Professional and Enterprise plans include full API access for seamless integration with your existing fleet management systems, ERP software, and third-party logistics platforms.",
  },
  {
    question: "How real-time is the monitoring?",
    answer:
      "Our platform provides true real-time monitoring with sub-50ms latency. You can track vehicle positions, battery levels, task progress, and communication status as it happens.",
  },
  {
    question: "What security measures are in place?",
    answer:
      "We implement enterprise-grade security including end-to-end encryption, role-based access control, audit logging, and compliance with industry standards. Your fleet data is always protected.",
  },
  {
    question: "Do you offer training and support?",
    answer:
      "All plans include comprehensive documentation and email support. Professional plans get priority support, while Enterprise customers receive dedicated account management and custom training sessions.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="faq">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm font-medium text-blue-light uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mt-4 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the RAS Challenge Dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl px-6 border-border/50 data-[state=open]:border-purple-primary/50 transition-colors"
              >
                <AccordionTrigger className="font-inter font-medium text-left hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-inter text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
