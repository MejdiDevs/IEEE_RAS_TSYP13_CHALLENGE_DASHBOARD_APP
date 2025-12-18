import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fleet Operations Director",
    company: "Autonomous Logistics Inc",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "RAS Challenge Dashboard transformed our fleet operations. The intelligent task allocation reduced our operational costs by 40%.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "CTO",
    company: "DroneFleet Systems",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "Real-time monitoring capabilities are unmatched. We now have complete visibility across our entire autonomous vehicle network.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Operations Manager",
    company: "Urban Mobility Solutions",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "The communication log analysis feature helped us identify and resolve network issues before they impacted our deliveries.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm font-medium text-blue-light uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mt-4 mb-4">
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
            See what fleet managers and operations teams say about their experience with our platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 relative group hover:border-purple-primary/50 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-purple-primary/20" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="font-inter text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-primary/30"
                />
                <div>
                  <div className="font-inter font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="font-inter text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
