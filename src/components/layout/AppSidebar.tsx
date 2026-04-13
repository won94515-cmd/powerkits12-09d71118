import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Palette,
  CreditCard,
  Shield,
  Calendar,
  BookOpen,
  Image,
  BarChart3,
  HelpCircle,
  LogOut,
  Settings,
  Zap,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/branding", icon: Palette, label: "Branding" },
  { to: "/content-calendar", icon: Calendar, label: "Content Calendar" },
  { to: "/retention-kit", icon: Shield, label: "Retention Kit" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

const libraryItems = [
  { to: "/ebooks", icon: BookOpen, label: "Ebooks & Pamphlets" },
  { to: "/media-library", icon: Image, label: "Media Library" },
  { to: "/seo", icon: BarChart3, label: "SEO Toolkit" },
  { to: "/plans", icon: CreditCard, label: "Plans & Billing" },
];

const AppSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = location.pathname === item.to;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="w-[18px] h-[18px] shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="flex flex-col h-screen w-[220px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-[18px] h-[18px] text-primary-foreground" />
        </div>
        <div>
          <span className="text-[15px] font-bold tracking-tight block leading-none">powerKits</span>
          <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Studio Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
        <div className="space-y-0.5">
          {navItems.map(renderNavItem)}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold px-3 mb-2">Library</p>
          <div className="space-y-0.5">
            {libraryItems.map(renderNavItem)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-3 space-y-1.5 shrink-0">
        <Button
          variant="default"
          className="w-full gap-2 text-xs h-9 bg-sidebar-primary hover:bg-sidebar-primary/90"
          onClick={() => {}}
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
        <NavLink
          to="/help"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
            location.pathname === "/help"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          <span>Support</span>
        </NavLink>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-colors"
        >
          <Settings className="w-[18px] h-[18px] shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
