import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, Users, MessageSquare, Eye, ThumbsUp,
  ArrowUpRight, ArrowDownRight
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

const topContent = [
  { title: "Monday Motivation: Start Strong 💪", type: "Post", engagement: 342, trend: "up" },
  { title: "30-Day Plank Challenge", type: "Challenge", engagement: 289, trend: "up" },
  { title: "Quick HIIT Session", type: "Reel", engagement: 256, trend: "down" },
  { title: "Healthy Meal Prep Tips", type: "Post", engagement: 198, trend: "up" },
  { title: "Member Spotlight: Sarah", type: "Post", engagement: 175, trend: "stable" },
];

const Analytics = () => {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track engagement and content performance</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Engagement", value: "784", change: "+12.5%", icon: ThumbsUp, up: true },
          { label: "Community Members", value: "45", change: "+8.2%", icon: Users, up: true },
          { label: "Content Views", value: "2,340", change: "+23.1%", icon: Eye, up: true },
          { label: "Messages", value: "156", change: "-3.2%", icon: MessageSquare, up: false },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="engagement" fill="hsl(216, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="hsl(170, 100%, 27%)" strokeWidth={2} dot={{ fill: "hsl(170, 100%, 27%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Mix</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={contentPerformance} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {contentPerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContent.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <Badge variant="outline" className="text-xs mt-0.5">{item.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.engagement}</span>
                    {item.trend === "up" && <ArrowUpRight className="w-4 h-4 text-success" />}
                    {item.trend === "down" && <ArrowDownRight className="w-4 h-4 text-destructive" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
