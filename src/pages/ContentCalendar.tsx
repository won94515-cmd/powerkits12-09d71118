import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Image, Video,
  Trophy, Send, Sparkles, Clock, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ContentType = "post" | "reel" | "challenge";

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  day: number;
  time: string;
  status: "draft" | "scheduled" | "published";
}

const mockContent: ContentItem[] = [
  { id: "1", type: "post", title: "Monday Motivation Quote", day: 0, time: "09:00", status: "scheduled" },
  { id: "2", type: "post", title: "Workout Tip Tuesday", day: 1, time: "10:00", status: "draft" },
  { id: "3", type: "reel", title: "30-Second HIIT Demo", day: 2, time: "12:00", status: "draft" },
  { id: "4", type: "challenge", title: "Plank Challenge Week 1", day: 2, time: "18:00", status: "scheduled" },
  { id: "5", type: "post", title: "Healthy Recipe Share", day: 3, time: "11:00", status: "draft" },
  { id: "6", type: "post", title: "Member Spotlight", day: 4, time: "09:00", status: "draft" },
  { id: "7", type: "post", title: "Weekend Workout Plan", day: 5, time: "08:00", status: "scheduled" },
];

const typeConfig: Record<ContentType, { icon: typeof Image; color: string; label: string }> = {
  post: { icon: Image, color: "bg-primary/10 text-primary border-primary/20", label: "Post" },
  reel: { icon: Video, color: "bg-accent/10 text-accent border-accent/20", label: "Reel" },
  challenge: { icon: Trophy, color: "bg-warning/10 text-warning border-warning/20", label: "Challenge" },
};

const statusConfig = {
  draft: { color: "bg-muted text-muted-foreground", label: "Draft" },
  scheduled: { color: "bg-primary/10 text-primary", label: "Scheduled" },
  published: { color: "bg-success/10 text-success", label: "Published" },
};

const ContentCalendar = () => {
  const [content] = useState<ContentItem[]>(mockContent);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDate = (dayIndex: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
    const date = new Date(monday);
    date.setDate(monday.getDate() + dayIndex);
    return date;
  };

  const weekLabel = () => {
    const start = getWeekDate(0);
    const end = getWeekDate(6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">Plan and schedule your weekly content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" /> AI Generate
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Content
          </Button>
        </div>
      </div>

      {/* Week Navigator */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <p className="font-semibold">{weekLabel()}</p>
            {weekOffset !== 0 && (
              <button className="text-xs text-primary" onClick={() => setWeekOffset(0)}>Back to this week</button>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {daysOfWeek.map((day, i) => {
          const date = getWeekDate(i);
          const isToday = new Date().toDateString() === date.toDateString();
          const dayContent = content.filter(c => c.day === i);

          return (
            <div key={day} className="min-h-[200px]">
              <div className={`text-center py-2 rounded-t-lg text-sm font-medium ${
                isToday ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <div>{day}</div>
                <div className="text-xs">{date.getDate()}</div>
              </div>
              <div className="border border-t-0 border-border rounded-b-lg p-1.5 space-y-1.5 min-h-[160px]">
                {dayContent.map((item) => {
                  const config = typeConfig[item.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-2 rounded-md border text-xs cursor-pointer hover:shadow-sm transition-shadow ${config.color}`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="w-3 h-3" />
                        <span className="font-medium">{config.label}</span>
                      </div>
                      <p className="truncate font-medium">{item.title}</p>
                      <div className="flex items-center gap-1 mt-1 opacity-70">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  );
                })}
                <button
                  className="w-full py-1.5 rounded border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  onClick={() => toast.info("Content creation modal coming soon")}
                >
                  <Plus className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <Image className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold">{content.filter(c => c.type === "post").length}</p>
              <p className="text-xs text-muted-foreground">Posts this week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
              <Video className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold">{content.filter(c => c.type === "reel").length}</p>
              <p className="text-xs text-muted-foreground">Reels this week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-warning/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-lg font-bold">{content.filter(c => c.type === "challenge").length}</p>
              <p className="text-xs text-muted-foreground">Challenges this week</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentCalendar;
