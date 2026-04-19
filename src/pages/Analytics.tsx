import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, MessageSquare, Eye, ThumbsUp,
  ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const rangeDays = { "7d": 7, "30d": 30, "90d": 90 } as const;
type RangeKey = keyof typeof rangeDays;

const Analytics = () => {
  const { user } = useAuth();
  const [range, setRange] = useState<RangeKey>("7d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0, contentItems: 0, mediaViews: 0, messages: 0,
    prevTotal: 0, prevContent: 0,
  });
  const [engagement, setEngagement] = useState<{ day: string; engagement: number }[]>([]);
  const [growth, setGrowth] = useState<{ month: string; members: number }[]>([]);
  const [recent, setRecent] = useState<{ name: string; channel: string; status: string; conversion: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const days = rangeDays[range];
      const since = new Date(); since.setDate(since.getDate() - (days - 1)); since.setHours(0, 0, 0, 0);
      const prevSince = new Date(since); prevSince.setDate(prevSince.getDate() - days);

      const [events, prevEvents, content, prevContent, recentContent] = await Promise.all([
        supabase.from("analytics_events").select("event_type,created_at").eq("user_id", user.id).gte("created_at", since.toISOString()),
        supabase.from("analytics_events").select("event_type,created_at").eq("user_id", user.id).gte("created_at", prevSince.toISOString()).lt("created_at", since.toISOString()),
        supabase.from("content_items").select("id,created_at,status").eq("user_id", user.id).gte("created_at", since.toISOString()),
        supabase.from("content_items").select("id").eq("user_id", user.id).gte("created_at", prevSince.toISOString()).lt("created_at", since.toISOString()),
        supabase.from("content_items").select("title,platform,status,type,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);

      const evList = events.data ?? [];
      const prevList = prevEvents.data ?? [];
      setStats({
        totalEvents: evList.length,
        contentItems: content.data?.length ?? 0,
        mediaViews: evList.filter((e) => e.event_type === "view").length,
        messages: evList.filter((e) => e.event_type === "message").length,
        prevTotal: prevList.length,
        prevContent: prevContent.data?.length ?? 0,
      });

      // Engagement by day
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayBuckets: { day: string; engagement: number }[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(since); d.setDate(since.getDate() + i);
        dayBuckets.push({ day: days <= 7 ? dayLabels[d.getDay()] : `${d.getMonth() + 1}/${d.getDate()}`, engagement: 0 });
      }
      evList.forEach((e) => {
        const d = new Date(e.created_at);
        const idx = Math.floor((d.getTime() - since.getTime()) / (1000 * 60 * 60 * 24));
        if (idx >= 0 && idx < days) dayBuckets[idx].engagement += 1;
      });
      setEngagement(dayBuckets);

      // Content growth (cumulative content items per month, last 6 months)
      const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); sixMonthsAgo.setDate(1); sixMonthsAgo.setHours(0,0,0,0);
      const allContent = await supabase.from("content_items").select("created_at").eq("user_id", user.id).gte("created_at", sixMonthsAgo.toISOString()).order("created_at", { ascending: true });
      const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const monthBuckets: { month: string; members: number }[] = [];
      let cumulative = 0;
      for (let i = 0; i < 6; i++) {
        const d = new Date(sixMonthsAgo); d.setMonth(sixMonthsAgo.getMonth() + i);
        const next = new Date(d); next.setMonth(d.getMonth() + 1);
        const monthCount = (allContent.data ?? []).filter((c) => {
          const cd = new Date(c.created_at);
          return cd >= d && cd < next;
        }).length;
        cumulative += monthCount;
        monthBuckets.push({ month: monthLabels[d.getMonth()], members: cumulative });
      }
      setGrowth(monthBuckets);

      setRecent((recentContent.data ?? []).map((c) => ({
        name: c.title,
        channel: c.platform ?? "—",
        status: c.status,
        conversion: c.type,
      })));

      setLoading(false);
    };
    load();
  }, [user, range]);

  const pct = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? "+100%" : "0%";
    const diff = ((curr - prev) / prev) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };
  const isUp = (curr: number, prev: number) => curr >= prev;

  const statusColor = (s: string) =>
    s === "published" ? "bg-success/10 text-success" :
    s === "scheduled" ? "bg-primary/10 text-primary" :
    "bg-muted text-muted-foreground";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track engagement and content performance</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="w-32 h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: loading ? "—" : String(stats.totalEvents), change: pct(stats.totalEvents, stats.prevTotal), icon: ThumbsUp, up: isUp(stats.totalEvents, stats.prevTotal) },
          { label: "Content Created", value: loading ? "—" : String(stats.contentItems), change: pct(stats.contentItems, stats.prevContent), icon: Users, up: isUp(stats.contentItems, stats.prevContent) },
          { label: "Views", value: loading ? "—" : String(stats.mediaViews), change: "", icon: Eye, up: true },
          { label: "Messages", value: loading ? "—" : String(stats.messages), change: "", icon: MessageSquare, up: true },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                {stat.change && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base">Engagement Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={engagement}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="engagement" fill="hsl(216, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base">Content Growth (6 months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="hsl(170, 100%, 27%)" strokeWidth={2} dot={{ fill: "hsl(170, 100%, 27%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Content</CardTitle>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground text-xs">No content yet.</td></tr>
                )}
                {recent.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground capitalize">{c.channel}</td>
                    <td className="py-3 px-3"><Badge className={`text-xs ${statusColor(c.status)}`}>{c.status}</Badge></td>
                    <td className="py-3 px-3 capitalize">{c.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
