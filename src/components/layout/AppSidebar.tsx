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
  Settings,
  Zap,
  Plus,
  Mail,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/contexts/BrandingContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/content-calendar", icon: Calendar, label: "Content Library" },
  { to: "/retention-kit", icon: Shield, label: "Social Planner" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

const libraryItems = [
  { to: "/branding", icon: Palette, label: "Branding" },
  { to: "/ebooks", icon: BookOpen, label: "Ebooks & Pamphlets" },
  { to: "/media-library", icon: Image, label: "Media Library" },
  { to: "/seo", icon: BarChart3, label: "SEO Toolkit" },
  { to: "/plans", icon: CreditCard, label: "Plans & Billing" },
];

const AppSidebar = () => {
  const { signOut } = useAuth();
  const { brand } = useBranding();
  const location = useLocation();
  const showBrand = !!brand?.branding_enabled;
  const studioName = showBrand && brand?.studio_name ? brand.studio_name : "powerKits";
  const tagline = showBrand && brand?.tagline ? brand.tagline : "Enterprise Retention";
  const logo = showBrand ? brand?.logo_url : null;

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = location.pathname === item.to;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="w-[18px] h-[18px] shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="flex flex-col h-screen w-[230px] bg-sidebar border-r border-sidebar-border sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 overflow-hidden">
          {logo ? (
            <img src={logo} alt={studioName} className="w-full h-full object-contain" />
          ) : (
            <Zap className="w-[18px] h-[18px] text-primary-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <span className="text-[15px] font-bold tracking-tight block leading-none text-foreground truncate">{studioName}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate block">{tagline}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        <div className="space-y-0.5">
          {navItems.map(renderNavItem)}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-3 mb-2">Library</p>
          <div className="space-y-0.5">
            {libraryItems.map(renderNavItem)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1.5 shrink-0">
        <Button
          className="w-full gap-2 text-xs h-9 rounded-lg"
          onClick={() => {}}
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
        <NavLink
          to="/help"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
            location.pathname === "/help"
              ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          <span>Support</span>
        </NavLink>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-all"
        >
          <Settings className="w-[18px] h-[18px] shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;