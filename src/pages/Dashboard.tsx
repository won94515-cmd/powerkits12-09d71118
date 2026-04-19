import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  Palette, Calendar, Shield, BarChart3, BookOpen,
  Image, ArrowRight, CheckCircle2, Circle,
  TrendingUp, Users, FileText, ArrowUpRight, Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const quickLinks = [
  { to: "/branding", icon: Palette, label: "Branding", desc: "Customize your studio brand" },
  { to: "/retention-kit", icon: Shield, label: "Retention Kit", desc: "Set up Discord community" },
  { to: "/content-calendar", icon: Calendar, label: "Content Calendar", desc: "Schedule weekly content" },
  { to: "/seo", icon: BarChart3, label: "SEO Toolkit", desc: "Optimize your reach" },
  { to: "/ebooks", icon: BookOpen, label: "Ebooks", desc: "Browse content library" },
  { to: "/media-library", icon: Image, label: "Media Library", desc: "Manage templates & assets" },
];

interface DashboardData {
  contentCount: number;
  publishedCount: number;
  scheduledCount: number;
  mediaCount: number;
  weeklyEvents: { day: string; value: number }[];
  recentContent: { id: string; title: string; type: string; status: string; platform: string | null; scheduled_at: string | null }[];
  hasBranding: boolean;
  hasDiscord: boolean;
  hasSubscription: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    contentCount: 0, publishedCount: 0, scheduledCount: 0, mediaCount: 0,
    weeklyEvents: [], recentContent: [], hasBranding: false, hasDiscord: false, hasSubscription: false,
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);

      // Past 7 days
      const since = new Date();
      since.setDate(since.getDate() - 6);
      since.setHours(0, 0, 0, 0);

      const [content, media, events, brand, discord, sub] = await Promise.all([
        supabase.from("content_items").select("id,title,type,status,platform,scheduled_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("media_assets").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("analytics_events").select("created_at").eq("user_id", user.id).gte("created_at", since.toISOString()),
        supabase.from("brand_settings").select("id").eq("user_id", user.id).maybeSingle(),
        supabase.from("discord_connections").select("id").eq("user_id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("id,status").eq("user_id", user.id).maybeSingle(),
      ]);

      const items = content.data ?? [];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekly: { day: string; value: number }[] = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(since);
        d.setDate(since.getDate() + i);
        return { day: days[d.getDay()], value: 0 };
      });
      (events.data ?? []).forEach((e) => {
        const d = new Date(e.created_at);
        const idx = Math.floor((d.getTime() - since.getTime()) / (1000 * 60 * 60 * 24));
        if (idx >= 0 && idx < 7) weekly[idx].value += 1;
      });

      setData({
        contentCount: items.length,
        publishedCount: items.filter((i) => i.status === "published").length,
        scheduledCount: items.filter((i) => i.status === "scheduled").length,
        mediaCount: media.count ?? 0,
        weeklyEvents: weekly,
        recentContent: items.slice(0, 5),
        hasBranding: !!brand.data,
        hasDiscord: !!discord.data,
        hasSubscription: !!sub.data && sub.data.status === "active",
      });
      setLoading(false);
    };
    load();
  }, [user]);

  const setupSteps = [
    { label: "Create your account", done: true },
    { label: "Set up branding", done: data.hasBranding, to: "/branding" },
    { label: "Choose a plan", done: data.hasSubscription, to: "/plans" },
    { label: "Connect Discord", done: data.hasDiscord, to: "/retention-kit" },
    { label: "Schedule first content", done: data.contentCount > 0, to: "/content-calendar" },
  ];
  const completedSteps = setupSteps.filter((s) => s.done).length;
  const progress = (completedSteps / setupSteps.length) * 100;
  const totalEvents = data.weeklyEvents.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Studio Performance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time overview of your content and community.</p>
        </div>
        <Badge className="bg-success/10 text-success border-success/20 gap-1.5 px-3 py-1 text-sm font-medium w-fit">
          <ArrowUpRight className="w-3.5 h-3.5" /> {totalEvents} events / 7 days
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Content", value: loading ? "—" : String(data.contentCount), sub: `${data.publishedCount} published`, icon: FileText },
          { label: "Scheduled", value: loading ? "—" : String(data.scheduledCount), sub: "Upcoming", icon: TrendingUp },
          { label: "Media Assets", value: loading ? "—" : String(data.mediaCount), sub: "In library", icon: Users },
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

        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50 font-semibold">Insight of the Day</p>
            <div className="mt-2">
              <h3 className="text-base font-bold leading-snug">
                {data.contentCount === 0 ? "Create your first piece of content." : `You have ${data.scheduledCount} scheduled posts.`}
              </h3>
              <p className="text-xs text-primary-foreground/70 mt-2 leading-relaxed">
                {data.contentCount === 0
                  ? "Use AI to generate weekly content ideas in seconds."
                  : "Keep momentum — consistent posting drives community growth."}
              </p>
            </div>
            <Button variant="secondary" size="sm" className="mt-3 gap-1.5 w-fit text-xs" onClick={() => navigate("/content-calendar")}>
              Open Calendar <ArrowRight className="w-3 h-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Activity (last 7 days)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.weeklyEvents} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(210, 20%, 92%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(210, 12%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(210, 12%, 50%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(210, 60%, 16%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Queue</CardTitle>
              <button className="text-xs text-muted-foreground hover:text-foreground font-medium" onClick={() => navigate("/content-calendar")}>View All</button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentContent.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground py-4 text-center">No content yet. Create your first post.</p>
            )}
            {data.recentContent.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">{item.platform ?? "platform"} • {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : "unscheduled"}</p>
                <p className="text-sm font-semibold mt-0.5 text-foreground truncate">{item.title}</p>
                <div className="flex gap-1.5 mt-1.5">
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{item.status.toUpperCase()}</Badge>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{item.type.toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Content</CardTitle>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => navigate("/content-calendar")}>
              <Download className="w-3.5 h-3.5" /> Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Platform</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentContent.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground text-xs">No content yet.</td></tr>
                )}
                {data.recentContent.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      {c.title}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground capitalize">{c.type}</td>
                    <td className="py-3 px-3 text-muted-foreground capitalize">{c.platform ?? "—"}</td>
                    <td className="py-3 px-3">
                      <Badge className={`text-xs font-medium ${
                        c.status === "published" ? "bg-success/15 text-success" :
                        c.status === "scheduled" ? "bg-primary/15 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
                {step.done ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                <span className={`text-sm font-medium flex-1 ${step.done ? "line-through text-muted-foreground" : ""}`}>
                  {step.label}
                </span>
                {!step.done && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
            ))}
          </CardContent>
        </Card>

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
    </div>
  );
};

export default Dashboard;
