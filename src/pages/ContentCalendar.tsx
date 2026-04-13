import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, ChevronRight, Plus, Image, Video,
  Trophy, Sparkles, Clock, Filter
} from "lucide-react";
import { toast } from "sonner";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
  { id: "6", type: "post", title: "Member Spotlight", day: 4, time: "09:00", status: "published" },
  { id: "7", type: "post", title: "Weekend Workout Plan", day: 5, time: "08:00", status: "scheduled" },
];

const typeConfig: Record<ContentType, { icon: typeof Image; color: string; label: string }> = {
  post: { icon: Image, color: "bg-primary/10 text-primary border-primary/20", label: "Post" },
  reel: { icon: Video, color: "bg-accent/10 text-accent border-accent/20", label: "Reel" },
  challenge: { icon: Trophy, color: "bg-warning/10 text-warning border-warning/20", label: "Challenge" },
};

const statusBadge = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary",
  published: "bg-success/10 text-success",
};

const ContentCalendar = () => {
  const [content] = useState<ContentItem[]>(mockContent);
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<"Monthly" | "Weekly">("Weekly");

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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Timeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualizing your cross-channel content strategy. Every post is a building block.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {(["Monthly", "Weekly"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Filter className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold">{weekLabel()}</p>
          {weekOffset !== 0 && (
            <button className="text-xs text-primary font-medium" onClick={() => setWeekOffset(0)}>Back to this week</button>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, i) => {
          const date = getWeekDate(i);
          const isToday = new Date().toDateString() === date.toDateString();
          const dayContent = content.filter(c => c.day === i);

          return (
            <div key={day} className="min-h-[180px]">
              <div className={`text-center py-2 rounded-t-lg text-xs font-semibold uppercase tracking-wider ${
                isToday ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
              }`}>
                <div>{day.slice(0, 3)}</div>
              </div>
              <div className="text-center py-1 text-xs text-muted-foreground border-x border-border">
                {isToday && <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground mb-1">Today</Badge>}
                <span className="block font-medium text-foreground">{date.getDate()} {date.toLocaleDateString("en-US", { month: "short" })}</span>
              </div>
              <div className="border border-t-0 border-border rounded-b-lg p-1 space-y-1 min-h-[120px] bg-card">
                {dayContent.map((item) => {
                  const config = typeConfig[item.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-1.5 rounded border text-[11px] cursor-pointer hover:shadow-sm transition-shadow ${config.color}`}
                    >
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 mb-1 ${statusBadge[item.status]}`}>
                        {item.status}
                      </Badge>
                      <p className="truncate font-medium">{item.title}</p>
                      <div className="flex items-center gap-1 mt-0.5 opacity-60">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  );
                })}
                <button
                  className="w-full py-1 rounded border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  onClick={() => toast.info("Content creation modal coming soon")}
                >
                  <Plus className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" className="gap-2 text-sm">
          <Sparkles className="w-4 h-4" /> AI Generate
        </Button>
        <Button className="gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Content
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Posts this week", value: content.filter(c => c.type === "post").length, icon: Image, color: "text-primary bg-primary/10" },
          { label: "Reels this week", value: content.filter(c => c.type === "reel").length, icon: Video, color: "text-accent bg-accent/10" },
          { label: "Challenges this week", value: content.filter(c => c.type === "challenge").length, icon: Trophy, color: "text-warning bg-warning/10" },
        ].map(s => (
          <Card key={s.label} className="border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentCalendar;
