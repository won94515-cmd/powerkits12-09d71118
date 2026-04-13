import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, MessageSquare } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const headerTabs = [
  { to: "/dashboard", label: "Overview" },
  { to: "/analytics", label: "Team" },
  { to: "/content-calendar", label: "History" },
];

const AppHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "PK";
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-5 gap-4 shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search scheduled posts..."
          className="pl-9 h-9 bg-background border-border text-sm w-56"
        />
      </div>

      {/* Center tabs */}
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {headerTabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              location.pathname === tab.to
                ? "text-foreground underline underline-offset-[18px] decoration-2 decoration-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 pl-3 border-l border-border">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold leading-none text-foreground">{name}</p>
          <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Head of Growth</p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;