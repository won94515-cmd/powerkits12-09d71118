import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, Users, MessageSquare, Eye, ThumbsUp,
  ArrowUpRight, ArrowDownRight, Download
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const engagementData = [
  { day: "Mon", engagement: 120 },
  { day: "Tue", engagement: 98 },
  { day: "Wed", engagement: 186 },
  { day: "Thu", engagement: 65 },
  { day: "Fri", engagement: 142 },
  { day: "Sat", engagement: 95 },
  { day: "Sun", engagement: 78 },
];

const monthlyData = [
  { month: "Jan", members: 12 },
  { month: "Feb", members: 18 },
  { month: "Mar", members: 25 },
  { month: "Apr", members: 31 },
  { month: "May", members: 38 },
  { month: "Jun", members: 45 },
];

const contentPerformance = [
  { name: "Posts", value: 45, color: "hsl(216, 100%, 50%)" },
  { name: "Reels", value: 30, color: "hsl(170, 100%, 27%)" },
  { name: "Challenges", value: 25, color: "hsl(38, 92%, 50%)" },
];

const recentCampaigns = [
  { name: "Retention 2024 Phase 1", channel: "Email & Social", status: "Active", conversion: "4.8%", statusColor: "bg-success/10 text-success" },
  { name: "Customer Win-back Q4", channel: "Omnichannel", status: "Pending", conversion: "1.2%", statusColor: "bg-warning/10 text-warning" },
  { name: "Legacy Product Migration", channel: "Direct Mail", status: "Archived", conversion: "9.5%", statusColor: "bg-muted text-muted-foreground" },
];

const Analytics = () => {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track engagement and content performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-32 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Engagement", value: "784", change: "+12.5%", icon: ThumbsUp, up: true },
          { label: "Community Members", value: "45", change: "+8.2%", icon: Users, up: true },
          { label: "Content Views", value: "2,340", change: "+23.1%", icon: Eye, up: true },
          { label: "Messages", value: "156", change: "-3.2%", icon: MessageSquare, up: false },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Social Media Performance</CardTitle>
              <div className="flex bg-muted rounded-md p-0.5">
                <button className="px-2.5 py-1 text-xs font-medium rounded bg-card shadow-sm">7 Days</button>
                <button className="px-2.5 py-1 text-xs font-medium text-muted-foreground">30 Days</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="engagement" fill="hsl(216, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Member Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="hsl(170, 100%, 27%)" strokeWidth={2} dot={{ fill: "hsl(170, 100%, 27%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Campaigns</CardTitle>
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
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campaign Name</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Channel</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversion</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{c.channel}</td>
                    <td className="py-3 px-3">
                      <Badge className={`text-xs ${c.statusColor}`}>{c.status}</Badge>
                    </td>
                    <td className="py-3 px-3 font-medium">{c.conversion}</td>
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
    </div>
  );
};

export default Analytics;
