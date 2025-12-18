import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ref, get, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Play, 
  Zap, 
  Shield, 
  BarChart3,
  Cpu, 
  Route, 
  Activity, 
  Bell, 
  Map, 
  Radio,
  Battery,
  Truck,
  Plane,
  Crosshair,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Gauge,
  Check,
  Crown,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Solutions", href: "#solutions" },
  { name: "Analytics", href: "#analytics" },
  { name: "Contact", href: "#contact" },
];

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
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards with task distribution, route distances, and performance metrics.",
  },
  {
    icon: Radio,
    title: "Mesh Communication",
    description: "Monitor task announcements, winner decisions, and inter-vehicle messaging in real-time.",
  }
];

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

const footerLinks = {
  Product: ["Features", "Solutions", "Pricing", "Changelog"],
  Resources: ["Documentation", "API Reference", "Community", "Support"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security", "Compliance"],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState("https://www.youtube.com/embed/5RdoXUKnonA?si=TG8zp8NvzPdiKu4e");

  // Fetch demo link from Firebase once on component mount
  useEffect(() => {
    const fetchDemoLink = async () => {
      try {
        const demoLinkRef = ref(database, "/demoLink");
        const snapshot = await get(demoLinkRef);
        const defaultUrl = "https://www.youtube.com/embed/5RdoXUKnonA?si=TG8zp8NvzPdiKu4e";
        
        if (snapshot.exists()) {
          const link = snapshot.val();
          if (link && typeof link === "string" && link.trim() !== "") {
            setDemoVideoUrl(link);
          } else {
            // If exists but is empty, set the default value
            await set(demoLinkRef, defaultUrl);
            setDemoVideoUrl(defaultUrl);
          }
        } else {
          // If doesn't exist, create it with default value
          await set(demoLinkRef, defaultUrl);
          setDemoVideoUrl(defaultUrl);
        }
      } catch (error) {
        console.error("Error fetching demo link from Firebase:", error);
        // Keep default URL on error
      }
    };

    fetchDemoLink();
  }, []);

  return (
    <main className="min-h-screen bg-background font-inter overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-light to-accent">
                <img 
                  src={new URL("../logo.png", import.meta.url).href}
                  alt="BEE FAST Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    try {
                      target.src = new URL("../logo.jpg", import.meta.url).href;
                    } catch {
                      // Fallback to text if both fail
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.logo-fallback')) {
                        const fallback = document.createElement('span');
                        fallback.className = 'logo-fallback font-orbitron font-bold text-foreground text-sm';
                        fallback.textContent = 'R';
                        parent.appendChild(fallback);
                      }
                    }
                  }}
                />
              </div>
              <span className="font-orbitron font-semibold text-lg tracking-wider">
                BEE<span className="text-blue-light">FAST</span>
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-muted-foreground hover:text-foreground transition-colors font-inter text-sm"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {!currentUser && (
                <Button
                  variant="ghost"
                  className="font-inter text-sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Sign In
                </Button>
              )}
              <Button 
                className="font-inter text-sm bg-gradient-to-r from-blue-primary to-blue-light hover:opacity-90 transition-opacity border-0" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentUser) {
                    navigate('/dashboard');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                {currentUser ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </div>

            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden glass mt-2 rounded-2xl p-6"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-inter"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {!currentUser && (
                    <Button 
                      variant="ghost" 
                      className="w-full font-inter" 
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        navigate('/login');
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                  <Button 
                    className="w-full font-inter bg-gradient-to-r from-blue-primary to-blue-light border-0" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      if (currentUser) {
                        navigate('/dashboard');
                      } else {
                        navigate('/login');
                      }
                    }}
                  >
                    {currentUser ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 mt-14">
        <div className="absolute inset-0 bg-grid opacity-40" />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-purple-primary/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-blue-light/20 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[15%] w-20 h-20 glass rounded-2xl flex items-center justify-center opacity-60"
        >
          <Zap className="w-8 h-8 text-blue-light" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-[10%] w-16 h-16 glass rounded-xl flex items-center justify-center opacity-60"
        >
          <Shield className="w-6 h-6 text-accent" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-blue-light animate-pulse" />
              <span className="text-sm font-inter text-muted-foreground">
                Next-Generation Fleet Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-foreground">Command Your</span>
              <br />
              <span className="gradient-text">Autonomous Fleet</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-inter text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Intelligent task allocation, real-time monitoring, and advanced analytics 
              for managing autonomous vehicle fleets with unprecedented precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="font-inter text-base px-8 py-6 bg-gradient-to-r from-blue-primary to-blue-light hover:opacity-90 transition-all glow border-0 group"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentUser) {
                    navigate('/dashboard');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Launch Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-inter text-base px-8 py-6 glass border-border hover:bg-muted/30 group"
                onClick={() => setVideoDialogOpen(true)}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "< 50ms", label: "Response Time" },
                { value: "10K+", label: "Vehicles Managed" },
                { value: "24/7", label: "Real-time Monitoring" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-orbitron text-2xl md:text-3xl font-bold gradient-text-alt mb-1">
                    {stat.value}
                  </div>
                  <div className="font-inter text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        
        {/* Animated background gradients */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-primary/20 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-blue-light/15 via-transparent to-transparent rounded-full blur-3xl"
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-inter text-sm uppercase tracking-widest text-blue-light mb-3 block">
              Capabilities
            </span>
            <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-foreground">Powerful </span>
              <span className="gradient-text">Features</span>
            </h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to manage autonomous vehicle fleets with precision and intelligence.
            </p>
          </motion.div>

          {/* Creative Asymmetrical Layout */}
          <div className="relative max-w-7xl mx-auto">
            {/* Creative positioning with varied sizes and overlaps */}
            <div className="relative min-h-[900px] lg:min-h-[1100px] pb-20 lg:pb-32">
              {features.map((feature, index) => {
                // Creative positioning patterns - each card has unique placement
                const layouts = [
                  // Row 1: Large card on left, medium on right
                  { 
                    size: 'large', 
                    position: 'top-0 left-0', 
                    width: 'w-full lg:w-[55%]',
                    rotation: -2.5,
                    delay: 0
                  },
                  { 
                    size: 'medium', 
                    position: 'top-0 right-0 lg:top-12', 
                    width: 'w-full lg:w-[42%]',
                    rotation: 3.2,
                    delay: 0.15
                  },
                  // Row 2: Medium card on left, large on right
                  { 
                    size: 'medium', 
                    position: 'top-[280px] lg:top-[320px] left-0 lg:left-8', 
                    width: 'w-full lg:w-[45%]',
                    rotation: 1.8,
                    delay: 0.3
                  },
                  { 
                    size: 'large', 
                    position: 'top-[280px] lg:top-[280px] right-0', 
                    width: 'w-full lg:w-[52%]',
                    rotation: -1.5,
                    delay: 0.45
                  },
                  // Row 3: Two medium cards side by side
                  { 
                    size: 'medium', 
                    position: 'top-[560px] lg:top-[640px] left-0', 
                    width: 'w-full lg:w-[48%]',
                    rotation: -2.8,
                    delay: 0.6
                  },
                  { 
                    size: 'medium', 
                    position: 'top-[560px] lg:top-[680px] right-0 lg:right-4', 
                    width: 'w-full lg:w-[48%]',
                    rotation: 2.1,
                    delay: 0.75
                  },
                  // Row 4: One wide card spanning most of width
                  { 
                    size: 'wide', 
                    position: 'top-[840px] lg:top-[960px] left-0 lg:left-[8%]', 
                    width: 'w-full lg:w-[84%]',
                    rotation: 0.8,
                    delay: 0.9
                  },
                  // Row 5: Small card on right
                  { 
                    size: 'small', 
                    position: 'top-[1120px] lg:top-[1280px] right-0 lg:right-[10%]', 
                    width: 'w-full lg:w-[35%]',
                    rotation: -1.2,
                    delay: 1.05
                  },
                ];
                
                const layout = layouts[index] || {
                  size: 'medium',
                  position: 'top-0 left-0',
                  width: 'w-full',
                  rotation: 0,
                  delay: index * 0.1
                };
                
                const isLarge = layout.size === 'large';
                const isWide = layout.size === 'wide';
                const isSmall = layout.size === 'small';
                
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.8, rotate: layout.rotation * 2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: layout.rotation }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      delay: layout.delay, 
                      duration: 0.7,
                      type: "spring",
                      stiffness: 90,
                      damping: 15
                    }}
                    whileHover={{ 
                      rotate: layout.rotation * 0.5,
                      scale: 1.03,
                      zIndex: 30,
                      transition: { duration: 0.3 }
                    }}
                    className={`absolute ${layout.position} ${layout.width} group`}
                    style={{ zIndex: index + 1 }}
                  >
                    {/* Glow effect */}
                    <motion.div
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                      className="absolute -inset-1 bg-gradient-to-br from-blue-primary/30 via-purple-primary/30 to-blue-light/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Main card with varied sizes */}
                    <div className={`relative backdrop-blur-xl bg-gradient-to-br from-background/90 via-background/80 to-background/90 border border-white/10 rounded-3xl overflow-hidden ${
                      isLarge ? 'p-8 lg:p-10' : isWide ? 'p-7 lg:p-9' : isSmall ? 'p-5 lg:p-6' : 'p-6 lg:p-8'
                    }`}>
                      {/* Flowing gradient overlay */}
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-blue-primary/5 via-transparent to-purple-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* Creative decorative elements - varied per card */}
                      {index % 3 === 0 && (
                        <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-light/25 to-transparent rounded-full blur-3xl"
                          />
                        </div>
                      )}
                      {index % 3 === 1 && (
                        <div className="absolute bottom-0 left-0 w-36 h-36 overflow-hidden">
                          <motion.div
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className="absolute -bottom-8 -left-8 w-36 h-36 bg-gradient-to-tr from-purple-primary/25 to-transparent rounded-full blur-3xl"
                          />
                        </div>
                      )}
                      {index % 3 === 2 && (
                        <>
                          <div className="absolute top-1/2 left-0 w-24 h-24 overflow-hidden">
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                                opacity: [0.2, 0.4, 0.2],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-blue-primary/20 to-purple-primary/20 rounded-full blur-2xl"
                            />
                          </div>
                        </>
                      )}

                      {/* Content with creative layouts */}
                      <div className={`relative z-10 flex ${isWide ? 'flex-row items-center gap-8' : 'flex-col'} ${isSmall ? 'gap-4' : 'gap-6'}`}>
                        {/* Icon - creative positioning */}
                        <motion.div
                          whileHover={{ 
                            scale: 1.15,
                            rotate: [0, -10, 10, -10, 0],
                          }}
                          transition={{ 
                            rotate: { duration: 0.5 },
                            scale: { duration: 0.2 }
                          }}
                          className={`relative flex-shrink-0 ${isWide ? '' : 'self-start'}`}
                        >
                          {/* Pulsing rings */}
                          {[0, 1].map((ring) => (
                            <motion.div
                              key={ring}
                              animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.3, 0, 0.3],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: ring * 0.5,
                              }}
                              className="absolute inset-0 rounded-2xl border-2 border-blue-light/30"
                              style={{
                                transform: `scale(${1 + ring * 0.25})`,
                              }}
                            />
                          ))}
                          
                          <div className={`relative rounded-2xl bg-gradient-to-br from-blue-primary/25 via-purple-primary/20 to-blue-light/25 flex items-center justify-center border border-blue-light/30 ${
                            isLarge ? 'w-20 h-20 lg:w-24 lg:h-24' : isSmall ? 'w-14 h-14 lg:w-16 lg:h-16' : 'w-16 h-16 lg:w-20 lg:h-20'
                          }`}>
                            <feature.icon className={`text-blue-light ${
                              isLarge ? 'w-10 h-10 lg:w-12 lg:h-12' : isSmall ? 'w-7 h-7 lg:w-8 lg:h-8' : 'w-8 h-8 lg:w-10 lg:h-10'
                            }`} />
                          </div>
                        </motion.div>

                        {/* Text content */}
                        <div className={`flex-1 ${isWide ? '' : ''}`}>
                          <motion.h3
                            whileHover={{ x: 4 }}
                            className={`font-orbitron font-bold text-foreground mb-3 ${
                              isLarge ? 'text-2xl lg:text-3xl' : isSmall ? 'text-lg lg:text-xl' : 'text-xl lg:text-2xl'
                            }`}
                          >
                            {feature.title}
                          </motion.h3>
                          <p className={`font-inter text-muted-foreground leading-relaxed ${
                            isLarge ? 'text-base lg:text-lg' : isSmall ? 'text-sm' : 'text-sm lg:text-base'
                          }`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      {/* Animated border gradient */}
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          padding: "1px",
                          background: "linear-gradient(135deg, rgba(2, 62, 172, 0.5), rgba(87, 19, 92, 0.5), rgba(8, 95, 210, 0.5))",
                          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          backgroundSize: "200% 200%",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-primary/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-purple-primary/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="font-inter text-sm uppercase tracking-widest text-blue-light mb-4 block">
              Use Cases
            </span>
            <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Tailored </span>
              <span className="gradient-text">Solutions</span>
            </h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-lg">
              Specialized configurations for different autonomous vehicle operations.
            </p>
          </motion.div>

          {/* Organic layout: 2 cards in first row, 1 card in second row */}
          <div className="relative">
            {/* First row: Two cards side by side */}
            <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12 lg:mb-16">
              {solutions.slice(0, 2).map((solution, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, x: isEven ? -150 : 150, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      delay: index * 0.15, 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 70
                    }}
                    className={`relative flex-1 ${
                      isEven ? 'lg:pr-0 lg:pl-8 lg:-mt-4' : 'lg:pl-0 lg:pr-8 lg:mt-4'
                    }`}
                  >
                    <div className="relative group">
                    {/* Glow effect */}
                    <motion.div
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`absolute -inset-2 bg-gradient-to-r ${solution.gradient} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Main card */}
                    <div className={`relative backdrop-blur-xl bg-gradient-to-br from-background/90 via-background/70 to-background/90 border border-white/10 rounded-[2rem] overflow-hidden ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 lg:p-12`}>
                      {/* Animated background pattern */}
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(2, 62, 172, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(87, 19, 92, 0.1) 0%, transparent 50%)`,
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* Icon section with unique design */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, -5, 0],
                        }}
                        transition={{ 
                          rotate: { duration: 0.6 },
                          scale: { duration: 0.2 }
                        }}
                        className="relative flex-shrink-0"
                      >
                        {/* Animated gradient rings */}
                        {[0, 1, 2].map((ring) => (
                          <motion.div
                            key={ring}
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.4, 0, 0.4],
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              delay: ring * 0.7,
                              ease: "easeInOut",
                            }}
                            className={`absolute inset-0 rounded-full border-2 bg-gradient-to-r ${solution.gradient}`}
                            style={{
                              transform: `scale(${1 + ring * 0.25})`,
                              opacity: 0.3,
                            }}
                          />
                        ))}
                        
                        <div className={`relative w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center shadow-2xl`}>
                          <motion.div
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <solution.icon className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                          </motion.div>
                        </div>

                        {/* Decorative corner elements */}
                        <motion.div
                          animate={{
                            rotate: [0, 90, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-light/30 to-transparent rounded-full blur-md"
                        />
                        <motion.div
                          animate={{
                            rotate: [0, -90, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          }}
                          className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-tr from-purple-primary/30 to-transparent rounded-full blur-md"
                        />
                      </motion.div>

                      {/* Content section */}
                      <div className="flex-1 relative z-10">
                        <motion.h3
                          whileHover={{ x: isEven ? 5 : -5 }}
                          className="font-orbitron text-2xl lg:text-3xl font-bold text-foreground mb-4"
                        >
                          {solution.title}
                        </motion.h3>
                        <p className="font-inter text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
                          {solution.description}
                        </p>
                        
                        {/* Capabilities list with animated checkmarks */}
                        <div className="space-y-4">
                          {solution.capabilities.map((cap, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.15 + i * 0.1 }}
                              className="flex items-start gap-4 group/item"
                            >
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.4 }}
                                className="flex-shrink-0 mt-1"
                              >
                                <CheckCircle2 className="w-6 h-6 text-blue-light" />
                              </motion.div>
                              <span className="font-inter text-sm lg:text-base text-muted-foreground group-hover/item:text-foreground transition-colors">
                                {cap}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Decorative side element - only show on outer edges for first row cards */}
                      <div className={`hidden lg:block absolute right-0 top-0 bottom-0 w-1/4 overflow-hidden`}>
                        <motion.div
                          animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-primary/10 to-purple-primary/10 rounded-full blur-3xl opacity-10"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>

            {/* Second row: Third card */}
            {solutions[2] && (() => {
              const solution = solutions[2];
              const isEven = true; // Third card uses even styling
              
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, x: -150, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    delay: 0.3, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 70
                  }}
                  className="relative max-w-5xl mx-auto lg:pr-0 lg:pl-8"
                >
                  <div className="relative group">
                    {/* Glow effect */}
                    <motion.div
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`absolute -inset-2 bg-gradient-to-r ${solution.gradient} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Main card */}
                    <div className={`relative backdrop-blur-xl bg-gradient-to-br from-background/90 via-background/70 to-background/90 border border-white/10 rounded-[2rem] overflow-hidden ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 lg:p-12`}>
                      {/* Animated background pattern */}
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(2, 62, 172, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(87, 19, 92, 0.1) 0%, transparent 50%)`,
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* Icon section with unique design */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, -5, 0],
                        }}
                        transition={{ 
                          rotate: { duration: 0.6 },
                          scale: { duration: 0.2 }
                        }}
                        className="relative flex-shrink-0"
                      >
                        {/* Animated gradient rings */}
                        {[0, 1, 2].map((ring) => (
                          <motion.div
                            key={ring}
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.4, 0, 0.4],
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              delay: ring * 0.7,
                              ease: "easeInOut",
                            }}
                            className={`absolute inset-0 rounded-full border-2 bg-gradient-to-r ${solution.gradient}`}
                            style={{
                              transform: `scale(${1 + ring * 0.25})`,
                              opacity: 0.3,
                            }}
                          />
                        ))}
                        
                        <div className={`relative w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center shadow-2xl`}>
                          <motion.div
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <solution.icon className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                          </motion.div>
                        </div>

                        {/* Decorative corner elements */}
                        <motion.div
                          animate={{
                            rotate: [0, 90, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-light/30 to-transparent rounded-full blur-md"
                        />
                        <motion.div
                          animate={{
                            rotate: [0, -90, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          }}
                          className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-tr from-purple-primary/30 to-transparent rounded-full blur-md"
                        />
                      </motion.div>

                      {/* Content section */}
                      <div className="flex-1 relative z-10">
                        <motion.h3
                          whileHover={{ x: isEven ? 5 : -5 }}
                          className="font-orbitron text-2xl lg:text-3xl font-bold text-foreground mb-4"
                        >
                          {solution.title}
                        </motion.h3>
                        <p className="font-inter text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
                          {solution.description}
                        </p>
                        
                        {/* Capabilities list with animated checkmarks */}
                        <div className="space-y-4">
                          {solution.capabilities.map((cap, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className="flex items-start gap-4 group/item"
                            >
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.4 }}
                                className="flex-shrink-0 mt-1"
                              >
                                <CheckCircle2 className="w-6 h-6 text-blue-light" />
                              </motion.div>
                              <span className="font-inter text-sm lg:text-base text-muted-foreground group-hover/item:text-foreground transition-colors">
                                {cap}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Decorative side element */}
                      <div className={`hidden lg:block absolute ${isEven ? 'right-0' : 'left-0'} top-0 bottom-0 w-1/4 overflow-hidden`}>
                        <motion.div
                          animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`absolute ${isEven ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br ${solution.gradient} rounded-full blur-3xl opacity-10`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-border/30 rounded-full"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <metric.icon className="w-6 h-6 text-blue-light" />
                  </div>
                  <div className="font-orbitron text-3xl font-bold gradient-text-alt mb-2">
                    {metric.value}
                  </div>
                  <div className="font-inter text-sm font-semibold text-foreground mb-1">
                    {metric.label}
                  </div>
                  <div className="font-inter text-xs text-muted-foreground">
                    {metric.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Integration Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-primary/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-purple-primary/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="font-inter text-sm uppercase tracking-widest text-blue-light mb-4 block">
              Technology
            </span>
            <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Powered by </span>
              <span className="gradient-text">Innovation</span>
            </h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-lg">
              Built with cutting-edge technologies for maximum performance and reliability.
            </p>
          </motion.div>

          {/* Hexagonal grid layout */}
          <div className="relative max-w-7xl mx-auto">
            {/* Main featured card - center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mb-12 lg:mb-16"
            >
              <div className="relative group">
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-1 bg-gradient-to-r from-blue-primary/30 via-purple-primary/30 to-blue-light/30 rounded-[2.5rem] blur-xl"
                />
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-background/90 via-background/70 to-background/90 border border-white/10 rounded-[2rem] p-12 lg:p-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-light/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-primary/10 to-transparent rounded-full blur-3xl" />
                  
                  <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-blue-primary to-blue-light flex items-center justify-center shadow-2xl mb-8"
                      >
                        <Cpu className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </motion.div>
                      <h3 className="font-orbitron text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Real-Time Processing
                      </h3>
                      <p className="font-inter text-lg text-muted-foreground leading-relaxed mb-6">
                        Advanced algorithms process vehicle data, task assignments, and communication events in real-time with sub-second latency.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {["Firebase", "React", "TypeScript", "WebSockets"].map((tech, i) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ scale: 1.1 }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-primary/20 to-purple-primary/20 border border-blue-light/30 text-sm font-inter text-foreground"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-blue-primary/10 via-transparent to-purple-primary/10 rounded-2xl"
                        style={{ backgroundSize: "200% 200%" }}
                      />
                      <div className="relative backdrop-blur-sm bg-background/50 rounded-2xl p-8 border border-white/10">
                        <div className="space-y-4">
                          {[
                            { label: "Data Processing", value: "99.9%", color: "from-blue-primary to-blue-light" },
                            { label: "Uptime", value: "99.99%", color: "from-purple-primary to-accent" },
                            { label: "Response Time", value: "< 50ms", color: "from-blue-light to-blue-primary" },
                          ].map((stat, i) => (
                            <motion.div
                              key={stat.label}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border border-white/5"
                            >
                              <span className="font-inter text-sm text-muted-foreground">{stat.label}</span>
                              <span className={`font-orbitron text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                {stat.value}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Technology grid - 3 columns */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Shield,
                  title: "Secure Infrastructure",
                  description: "Enterprise-grade security with end-to-end encryption and secure authentication.",
                  gradient: "from-blue-primary to-blue-light",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Optimized for speed with efficient algorithms and real-time data synchronization.",
                  gradient: "from-purple-primary to-accent",
                },
                {
                  icon: Activity,
                  title: "Scalable Architecture",
                  description: "Built to handle fleets of any size, from small operations to enterprise deployments.",
                  gradient: "from-blue-light to-blue-primary",
                },
              ].map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full backdrop-blur-xl bg-gradient-to-br from-background/90 via-background/70 to-background/90 border border-white/10 rounded-2xl p-8 overflow-hidden"
                  >
                    {/* Animated background */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.gradient} flex items-center justify-center mb-6 shadow-lg`}
                      >
                        <tech.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="font-orbitron text-xl font-bold text-foreground mb-3">
                        {tech.title}
                      </h3>
                      <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Everything you need to know about the BEE FAST Dashboard.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-strong rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-orbitron font-semibold text-foreground">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-dark/20 to-blue-dark/20" />
        
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
                onClick={(e) => {
                  e.preventDefault();
                  if (currentUser) {
                    navigate('/dashboard');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                {currentUser ? 'Continue Monitoring' : 'Start Free Trial'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-inter text-base px-10 py-7 glass border-border hover:bg-muted/30 group"
                onClick={() => setVideoDialogOpen(true)}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

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

      {/* Footer */}
      <footer className="relative pt-16 pb-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-light to-accent">
                  <img 
                    src={new URL("../logo.png", import.meta.url).href}
                    alt="BEE FAST Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      try {
                        target.src = new URL("../logo.jpg", import.meta.url).href;
                      } catch {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.logo-fallback')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'logo-fallback font-orbitron font-bold text-foreground text-sm';
                          fallback.textContent = 'R';
                          parent.appendChild(fallback);
                        }
                      }
                    }}
                  />
                </div>
                <span className="font-orbitron font-semibold text-lg">
                  BEE<span className="text-blue-light">FAST</span>
                </span>
              </motion.div>
              <p className="font-inter text-sm text-muted-foreground mb-6 max-w-xs">
                Next-generation fleet management for autonomous vehicles. 
                Intelligent allocation, real-time monitoring, advanced analytics.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <h4 className="font-orbitron text-sm font-semibold text-foreground mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-inter text-sm text-muted-foreground">
              © 2024 BEE FAST. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Demo Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen} className="max-w-7xl">
        <DialogContent 
          onClose={() => setVideoDialogOpen(false)} 
          className="p-0 bg-background/95 backdrop-blur-xl border-border"
        >
          <div 
            className="relative w-full max-w-7xl mx-auto"
            style={{
              aspectRatio: '16 / 9'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={demoVideoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
