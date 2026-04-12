import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Palette, Calendar, Shield, BarChart3, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickLinks = [
  { to: "/branding", icon: Palette, label: "Branding", desc: "Customize your brand" },
  { to: "/retention-kit", icon: Shield, label: "Retention Kit", desc: "Set up Discord community" },
  { to: "/content-calendar", icon: Calendar, label: "Content Calendar", desc: "Schedule your content" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", desc: "View performance" },
  { to: "/ebooks", icon: BookOpen, label: "Ebooks", desc: "Browse library" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {name} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your studio overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Content Published", value: "0", change: "+0 this week" },
          { label: "Community Members", value: "0", change: "Connect Discord" },
          { label: "Engagement Rate", value: "—", change: "No data yet" },
          { label: "Plan", value: "Free", change: "Upgrade now" },
        ].map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Card
              key={link.to}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate(link.to)}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
