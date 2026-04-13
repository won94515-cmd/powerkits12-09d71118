import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Palette, Calendar, Shield, BarChart3, BookOpen,
  Image, CreditCard, Zap, ArrowRight, CheckCircle2,
  Circle, TrendingUp, Users, FileText, MessageSquare,
  ArrowUpRight, Sparkles
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Retention Performance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time health indicators for your studio campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-success/10 text-success border-success/20 gap-1">
            <ArrowUpRight className="w-3 h-3" /> 12.4% Growth
          </Badge>
          <Button onClick={() => navigate("/plans")} size="sm" className="gap-1.5">
            <CreditCard className="w-4 h-4" /> Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: "24", sub: "+3 New", icon: FileText, color: "text-primary" },
          { label: "Retention Rate", value: "98.2%", sub: "Optimal", icon: TrendingUp, color: "text-success" },
          { label: "Engagement", value: "12.5k", sub: "+8.2%", icon: Users, color: "text-accent" },
          { label: "Current Plan", value: "Free", sub: "Upgrade available", icon: Zap, color: "text-warning" },
        ].map((card) => (
          <Card key={card.label} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <Badge variant="outline" className="text-xs font-normal">{card.sub}</Badge>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insight Card */}
      <Card className="bg-secondary text-secondary-foreground border-0 shadow-lg">
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-secondary-foreground/50 font-semibold mb-1">Insight of the Day</p>
            <h3 className="text-lg font-bold mb-1">Churn risk identified in 'Mid-Market' segment.</h3>
            <p className="text-sm text-secondary-foreground/70">
              Engagement in your Southeast region has dropped 15% this week. We recommend triggering the "Renewal Loyalty" sequence.
            </p>
          </div>
          <Button variant="secondary" size="sm" className="shrink-0 gap-1.5">
            Run Auto-Fix <ArrowRight className="w-3 h-3" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup Wizard */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Quick Start Setup</CardTitle>
              <Badge variant="secondary" className="text-xs">{completedSteps}/{setupSteps.length}</Badge>
            </div>
            <Progress value={progress} className="mt-2 h-1.5" />
          </CardHeader>
          <CardContent className="space-y-1.5">
            {setupSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.done ? "bg-success/5" : "bg-muted/30 hover:bg-muted/60 cursor-pointer"
                }`}
                onClick={() => !step.done && step.to && navigate(step.to)}
              >
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm font-medium flex-1 ${step.done ? "line-through text-muted-foreground" : ""}`}>
                  {step.label}
                </span>
                {!step.done && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Card
              key={link.to}
              className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all border-border/60 shadow-sm"
              onClick={() => navigate(link.to)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${link.color}`}>
                  <link.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
