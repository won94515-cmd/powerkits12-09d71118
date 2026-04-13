import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Palette, Calendar, Shield, BarChart3, BookOpen,
  Image, CreditCard, Zap, ArrowRight, CheckCircle2,
  Circle, TrendingUp, Users, FileText, MessageSquare,
  ArrowUpRight, Sparkles, Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const weeklyData = [
  { day: "MON", value: 45 },
  { day: "TUE", value: 72 },
  { day: "WED", value: 58 },
  { day: "THU", value: 88 },
  { day: "FRI", value: 95 },
  { day: "SAT", value: 60 },
  { day: "SUN", value: 42 },
];

const queueItems = [
  { platform: "LinkedIn", time: "2:00 PM Today", title: "Maximizing Enterprise Valu...", tags: ["DRAFT", "VIDEO"] },
  { platform: "Twitter/X", time: "9:00 AM Tomorrow", title: "The 5 Rules of Modern...", tags: ["SCHEDULED", "THREAD"] },
  { platform: "Instagram", time: "Nov 14, 11:30 AM", title: "Case Study: Architectural...", tags: ["SCHEDULED", "STORIES"] },
];

const recentCampaigns = [
  { name: "Retention 2024 Phase 1", channel: "Email & Social", status: "Active", conversion: "4.8%", statusColor: "bg-success/15 text-success" },
  { name: "Customer Win-back Q4", channel: "Omnichannel", status: "Pending", conversion: "1.2%", statusColor: "bg-warning/15 text-warning" },
  { name: "Legacy Product Migration", channel: "Direct Mail", status: "Archived", conversion: "9.5%", statusColor: "bg-muted text-muted-foreground" },
];

const quickLinks = [
  { to: "/branding", icon: Palette, label: "Branding", desc: "Customize your studio brand" },
  { to: "/retention-kit", icon: Shield, label: "Retention Kit", desc: "Set up Discord community" },
  { to: "/content-calendar", icon: Calendar, label: "Content Calendar", desc: "Schedule weekly content" },
  { to: "/seo", icon: BarChart3, label: "SEO Toolkit", desc: "Optimize your reach" },
  { to: "/ebooks", icon: BookOpen, label: "Ebooks", desc: "Browse content library" },
  { to: "/media-library", icon: Image, label: "Media Library", desc: "Manage templates & assets" },
];

const setupSteps = [
  { label: "Create your account", done: true },
  { label: "Set up branding", done: false, to: "/branding" },
  { label: "Choose a plan", done: false, to: "/plans" },
  { label: "Connect Discord", done: false, to: "/retention-kit" },
  { label: "Schedule first content", done: false, to: "/content-calendar" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const completedSteps = setupSteps.filter(s => s.done).length;
  const progress = (completedSteps / setupSteps.length) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Retention Performance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time health indicators for Q3 Enterprise campaigns.</p>
        </div>
        <Badge className="bg-success/10 text-success border-success/20 gap-1.5 px-3 py-1 text-sm font-medium w-fit">
          <ArrowUpRight className="w-3.5 h-3.5" /> 12.4% Growth
        </Badge>
      </div>

      {/* Stats + Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stat cards */}
        {[
          { label: "Active Campaigns", value: "24", sub: "+3 New", icon: FileText },
          { label: "Retention Rate", value: "98.2%", sub: "Optimal", icon: TrendingUp },
          { label: "Engagement", value: "12.5k", sub: "+8.2%", icon: Users },
        ].map((card) => (
          <Card key={card.label} className="border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">{card.sub}</Badge>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{card.label}</p>
              <p className="text-3xl font-bold mt-0.5 text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}

        {/* Insight Card - dark navy */}
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50 font-semibold">Insight of the Day</p>
            <div className="mt-2">
              <h3 className="text-base font-bold leading-snug">Churn risk identified in 'Mid-Market' segment.</h3>
              <p className="text-xs text-primary-foreground/70 mt-2 leading-relaxed">
                Engagement in the Southeast region has dropped 15% this week. We recommend triggering the "Renewal Loyalty" sequence.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 gap-1.5 w-fit text-xs"
            >
              Run Auto-Fix <ArrowRight className="w-3 h-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Performance + Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Social Media Performance</CardTitle>
              <div className="flex bg-muted rounded-lg p-0.5">
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-card shadow-sm text-foreground">7 Days</button>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground">30 Days</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(210, 20%, 92%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(210, 12%, 50%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(210, 12%, 50%)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(210, 60%, 16%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Queue */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Queue</CardTitle>
              <button className="text-xs text-muted-foreground hover:text-foreground font-medium">View All</button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {queueItems.map((item, i) => (
              <div key={i} className="p-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                <p className="text-[10px] text-muted-foreground font-medium">{item.platform} • {item.time}</p>
                <p className="text-sm font-semibold mt-0.5 text-foreground">{item.title}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-3 rounded-lg border border-dashed border-border text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
              <p className="text-xs">Drag and drop assets to queue new posts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns Table */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Campaigns</CardTitle>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              <Download className="w-3.5 h-3.5" /> Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Campaign Name</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Channel</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Conversion</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{c.channel}</td>
                    <td className="py-3 px-3">
                      <Badge className={`text-xs font-medium ${c.statusColor}`}>{c.status}</Badge>
                    </td>
                    <td className="py-3 px-3 font-semibold">{c.conversion}</td>
                    <td className="py-3 px-3">
                      <Button variant="ghost" size="sm" className="text-xs h-7">•••</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Setup Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Quick Start Setup</CardTitle>
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

        {/* Quick Actions */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {quickLinks.slice(0, 5).map((link) => (
              <div
                key={link.to}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(link.to)}
              >
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <link.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{link.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{link.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2024 powerKits. All systems operational.</p>
        <div className="flex items-center justify-center gap-4 mt-1.5">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Privacy</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Terms</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">API Status</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;