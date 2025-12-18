import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  ListTodo,
  MessageSquare,
  Map,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  Bell,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import logoImage from "@/logo.jpg";

interface NavItem {
  title: string;
  url: string;
  hash: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    hash: "",
    icon: LayoutDashboard,
    children: [
      { title: "Fleet Map", url: "/dashboard", hash: "#fleet-map", icon: Map },
      { title: "Vehicles", url: "/dashboard", hash: "#vehicles", icon: Car },
      { title: "Tasks", url: "/dashboard", hash: "#tasks", icon: ListTodo },
    ],
  },
  { title: "Task Manager", url: "/task-manager", hash: "", icon: ClipboardList },
  { title: "Communications", url: "/communication", hash: "", icon: MessageSquare },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const DashboardSidebar = ({ collapsed, setCollapsed }: DashboardSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnOverview = location.pathname === "/dashboard" && !location.hash;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(isOnOverview ? ["Overview"] : [])
  );

  // Auto-expand Overview when on overview tab, collapse when not
  useEffect(() => {
    if (isOnOverview) {
      setExpandedSections((prev) => new Set([...prev, "Overview"]));
    } else {
      setExpandedSections((prev) => {
        const newSet = new Set(prev);
        newSet.delete("Overview");
        return newSet;
      });
    }
  }, [isOnOverview]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.url === location.pathname) {
      if (item.hash) {
        e.preventDefault();
        // Small delay to ensure navigation happens first
        setTimeout(() => {
          const element = document.querySelector(item.hash);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // If no hash, scroll to top
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOnOverview = location.pathname === "/dashboard" && !location.hash;
    const shouldShowChildren = hasChildren && isOnOverview;
    const isExpanded = expandedSections.has(item.title) && shouldShowChildren;
    const isActive = location.pathname === item.url && 
      (item.hash ? location.hash === item.hash : !location.hash);

    // When collapsed, show parent items as regular nav items
    if (collapsed) {
      return (
        <NavLink
          key={item.title}
          to={`${item.url}${item.hash || (hasChildren && item.children?.[0]?.hash) || ""}`}
          end={item.url === "/dashboard" && !item.hash}
          onClick={(e) => {
            if (hasChildren && item.children?.[0]) {
              handleNavClick(e, item.children[0]);
            } else {
              handleNavClick(e, item);
            }
          }}
          className={cn(
            "flex items-center justify-center px-2 py-2.5 rounded-lg font-inter text-sm transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          activeClassName="bg-purple-primary/20 text-purple-light border border-purple-primary/30"
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
        </NavLink>
      );
    }

    // When expanded, show hierarchical structure
    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <div className="flex items-center gap-1">
            <NavLink
              to={item.url}
              end={item.url === "/dashboard"}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-sm transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                isActive && "bg-purple-primary/20 text-purple-light border border-purple-primary/30"
              )}
              activeClassName="bg-purple-primary/20 text-purple-light border border-purple-primary/30"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.title}</span>
            </NavLink>
            {shouldShowChildren && (
              <button
                onClick={() => toggleSection(item.title)}
                className={cn(
                  "px-2 py-2.5 rounded-lg font-inter text-sm transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronUp className="w-4 h-4 flex-shrink-0 rotate-180" />
                )}
              </button>
            )}
          </div>
          {isExpanded && shouldShowChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-6 mt-1.5 relative"
            >
              {/* Vertical line spanning all sub-tabs */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-primary/20" />
              
              <div className="space-y-0.5 pl-4">
                {item.children!.map((child) => {
                  const isChildActive = location.pathname === child.url && location.hash === child.hash;
                  return (
                    <NavLink
                      key={child.title}
                      to={`${child.url}${child.hash}`}
                      end={child.url === "/dashboard" && !child.hash}
                      onClick={(e) => handleNavClick(e, child)}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 rounded-md font-inter text-xs transition-all duration-200",
                        "group",
                        isChildActive
                          ? "text-purple-light/90 bg-purple-primary/10"
                          : "text-muted-foreground/70 hover:text-foreground/80 hover:bg-muted/20"
                      )}
                      activeClassName="text-purple-light/90 bg-purple-primary/10"
                    >
                      <child.icon className={cn(
                        "flex-shrink-0 transition-colors duration-200",
                        isChildActive ? "w-3.5 h-3.5 text-purple-light/80" : "w-3.5 h-3.5"
                      )} />
                      <span className="truncate flex-1">{child.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={`${item.url}${item.hash}`}
        end={item.url === "/dashboard" && !item.hash}
        onClick={(e) => handleNavClick(e, item)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-sm transition-all duration-200",
          "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        activeClassName="bg-purple-primary/20 text-purple-light border border-purple-primary/30"
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span>{item.title}</span>
      </NavLink>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen glass border-r border-border/50 flex flex-col fixed left-0 top-0 z-40"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-primary to-blue-light">
              <img 
                src={logoImage}
                alt="BEE FAST Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fallback = document.createElement('span');
                    fallback.className = 'logo-fallback font-orbitron font-bold text-white text-sm';
                    fallback.textContent = 'R';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <span className="font-orbitron font-bold text-foreground">BEE<span className="text-blue-light">FAST</span></span>
          </motion.div>
        )}
        {collapsed && (
          <div 
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center mx-auto bg-gradient-to-br from-purple-primary to-blue-light cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img 
              src={logoImage}
              alt="BEE FAST Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('span');
                  fallback.className = 'logo-fallback font-orbitron font-bold text-white text-sm';
                  fallback.textContent = 'R';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>


      <div className="p-3 border-t border-border/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="font-inter text-sm">Collapse</span>
            </>
          )}
        </button>
        {!collapsed && (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-inter text-sm">Logout</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
};

interface DashboardHeaderProps {
  collapsed: boolean;
}

export const DashboardHeader = ({ collapsed }: DashboardHeaderProps) => {
  const { currentUser } = useAuth();
  
  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-16 glass border-b border-border/50 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-30"
    >
      <div>
        <h1 className="font-orbitron text-lg font-bold">Fleet Command Center</h1>
        <p className="font-inter text-xs text-muted-foreground">Real-time fleet management</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-inter text-sm font-medium">{currentUser?.email || 'Commander'}</p>
            <p className="font-inter text-xs text-muted-foreground">Fleet Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-primary to-blue-light flex items-center justify-center">
            <span className="font-inter font-semibold text-white text-sm">{(currentUser?.email?.[0] || 'C').toUpperCase()}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
