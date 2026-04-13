import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, MessageSquare } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/branding": "Branding",
  "/plans": "Plans & Billing",
  "/retention-kit": "Retention Kit",
  "/content-calendar": "Content Calendar",
  "/seo": "SEO Toolkit",
  "/ebooks": "Ebooks & Pamphlets",
  "/media-library": "Media Library",
  "/analytics": "Analytics",
  "/help": "Help & Support",
};

const AppHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "PK";
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-5 gap-4 shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-9 h-9 bg-muted/50 border-transparent focus:border-border text-sm"
        />
      </div>

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
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs text-muted-foreground leading-none mt-0.5">Studio Owner</p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
