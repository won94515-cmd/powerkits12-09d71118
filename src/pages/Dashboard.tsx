import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard, Palette, Calendar, Shield, BarChart3, BookOpen,
  Image, HelpCircle, CreditCard, Zap, ArrowRight, CheckCircle2,
  Circle, TrendingUp, Users, FileText, MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickLinks = [
  { to: "/branding", icon: Palette, label: "Branding", desc: "Customize your studio brand", color: "bg-primary/10 text-primary" },
  { to: "/retention-kit", icon: Shield, label: "Retention Kit", desc: "Set up Discord community", color: "bg-accent/10 text-accent" },
  { to: "/content-calendar", icon: Calendar, label: "Content Calendar", desc: "Schedule weekly content", color: "bg-warning/10 text-warning" },
  { to: "/seo", icon: BarChart3, label: "SEO Toolkit", desc: "Optimize your reach", color: "bg-success/10 text-success" },
  { to: "/ebooks", icon: BookOpen, label: "Ebooks", desc: "Browse content library", color: "bg-destructive/10 text-destructive" },
  { to: "/media-library", icon: Image, label: "Media Library", desc: "Manage templates & assets", color: "bg-primary/10 text-primary" },
];

const setupSteps = [
  { label: "Create your account", done: true },
  { label: "Set up branding", done: false, to: "/branding" },
  { label: "Choose a plan", done: false, to: "/plans" },
  { label: "Connect Discord", done: false, to: "/retention-kit" },
  { label: "Schedule first content", done: false, to: "/content-calendar" },
];

const recentActivity = [
  { icon: CheckCircle2, text: "Account created successfully", time: "Just now", color: "text-success" },
  { icon: Zap, text: "Welcome to powerKits!", time: "Just now", color: "text-primary" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const completedSteps = setupSteps.filter(s => s.done).length;
  const progress = (completedSteps / setupSteps.length) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {name} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your studio overview</p>
        </div>
        <Button onClick={() => navigate("/plans")} className="gap-2">
          <CreditCard className="w-4 h-4" /> Upgrade Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Content Published", value: "0", icon: FileText, change: "+0 this week", trend: "neutral" },
          { label: "Community Members", value: "0", icon: Users, change: "Connect Discord", trend: "neutral" },
          { label: "Engagement Rate", value: "—", icon: TrendingUp, change: "No data yet", trend: "neutral" },
          { label: "Current Plan", value: "Free", icon: Zap, change: "Upgrade available", trend: "up" },
        ].map((card) => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <card.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup Wizard */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quick Start Setup</CardTitle>
              <Badge variant="secondary">{completedSteps}/{setupSteps.length}</Badge>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {setupSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.done ? "bg-success/5" : "bg-muted/50 hover:bg-muted cursor-pointer"
                }`}
                onClick={() => !step.done && step.to && navigate(step.to)}
              >
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm font-medium flex-1 ${step.done ? "line-through text-muted-foreground" : ""}`}>
                  {step.label}
                </span>
                {!step.done && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Card
              key={link.to}
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              onClick={() => navigate(link.to)}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
