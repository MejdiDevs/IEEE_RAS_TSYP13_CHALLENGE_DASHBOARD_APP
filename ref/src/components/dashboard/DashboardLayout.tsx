import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  ListTodo,
  MessageSquare,
  Map,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Vehicles", url: "/dashboard/vehicles", icon: Car },
  { title: "Tasks", url: "/dashboard/tasks", icon: ListTodo },
  { title: "Fleet Map", url: "/dashboard/map", icon: Map },
  { title: "Communications", url: "/dashboard/comms", icon: MessageSquare },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const DashboardSidebar = ({ collapsed, setCollapsed }: DashboardSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen glass border-r border-border/50 flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-primary to-blue-light flex items-center justify-center">
              <span className="font-orbitron font-bold text-white text-sm">R</span>
            </div>
            <span className="font-orbitron font-bold text-foreground">RAS</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-primary to-blue-light flex items-center justify-center mx-auto">
            <span className="font-orbitron font-bold text-white text-sm">R</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/dashboard"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-sm transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-purple-primary/20 text-purple-light border border-purple-primary/30"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
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
      </div>
    </motion.aside>
  );
};

interface DashboardHeaderProps {
  collapsed: boolean;
}

export const DashboardHeader = ({ collapsed }: DashboardHeaderProps) => {
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
            <p className="font-inter text-sm font-medium">Commander</p>
            <p className="font-inter text-xs text-muted-foreground">Fleet Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-primary to-blue-light flex items-center justify-center">
            <span className="font-inter font-semibold text-white text-sm">C</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
