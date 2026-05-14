import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronLeft, ChevronRight, Plus, Image, Video,
  Trophy, Sparkles, Clock, Filter, Loader2, Trash2, Mail,
} from "lucide-react";
import { toast } from "sonner";
import { EmailComposer } from "@/components/EmailComposer";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ContentType = "post" | "reel" | "challenge";
type Status = "draft" | "scheduled" | "published";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  status: string;
  platform: string | null;
  scheduled_at: string | null;
}

const typeConfig: Record<ContentType, { icon: typeof Image; color: string; label: string }> = {
  post: { icon: Image, color: "bg-primary/10 text-primary border-primary/20", label: "Post" },
  reel: { icon: Video, color: "bg-accent/10 text-accent border-accent/20", label: "Reel" },
  challenge: { icon: Trophy, color: "bg-warning/10 text-warning border-warning/20", label: "Challenge" },
};

const statusBadge: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary",
  published: "bg-success/10 text-success",
};

const ContentCalendar = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<"Monthly" | "Weekly">("Weekly");
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<ContentItem> & { day?: number; time?: string }>({});

  const getWeekDate = (dayIndex: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
    const date = new Date(monday);
    date.setDate(monday.getDate() + dayIndex);
    return date;
  };

  const weekStart = getWeekDate(0);
  const weekEnd = getWeekDate(6);

  const loadContent = async () => {
    if (!user) return;
    setLoading(true);
    const start = new Date(weekStart); start.setHours(0, 0, 0, 0);
    const end = new Date(weekEnd); end.setHours(23, 59, 59, 999);
    const { data, error } = await supabase
      .from("content_items")
      .select("id,type,title,body,status,platform,scheduled_at")
      .eq("user_id", user.id)
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString())
      .order("scheduled_at", { ascending: true });
    if (error) toast.error(error.message);
    setContent(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadContent(); /* eslint-disable-next-line */ }, [user, weekOffset]);

  const openNew = (dayIdx: number) => {
    setEditing({ type: "post", title: "", body: "", status: "draft", platform: "instagram", day: dayIdx, time: "09:00" });
    setEditorOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    const dt = item.scheduled_at ? new Date(item.scheduled_at) : new Date();
    const day = (dt.getDay() + 6) % 7;
    const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    setEditing({ ...item, day, time });
    setEditorOpen(true);
  };

  const save = async () => {
    if (!user || !editing.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const day = editing.day ?? 0;
    const [h, m] = (editing.time ?? "09:00").split(":").map(Number);
    const dt = getWeekDate(day);
    dt.setHours(h, m, 0, 0);

    const payload = {
      user_id: user.id,
      title: editing.title,
      body: editing.body ?? null,
      type: editing.type ?? "post",
      status: editing.status ?? "draft",
      platform: editing.platform ?? "instagram",
      scheduled_at: dt.toISOString(),
    };

    const res = editing.id
      ? await supabase.from("content_items").update(payload).eq("id", editing.id)
      : await supabase.from("content_items").insert(payload);
    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success(editing.id ? "Updated" : "Created");
      setEditorOpen(false);
      loadContent();
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!editing.id) return;
    const { error } = await supabase.from("content_items").delete().eq("id", editing.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setEditorOpen(false); loadContent(); }
  };

  const aiGenerate = async () => {
    setAiLoading(true);
    const { data, error } = await supabase.functions.invoke("generate-content", {
      body: { type: editing.type ?? "post", topic: editing.title || "fitness motivation for studio members", brandVoice: "energetic and supportive" },
    });
    setAiLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data?.error) { toast.error(data.error); return; }
    setEditing((prev) => ({ ...prev, title: data.title ?? prev.title, body: data.body ?? prev.body }));
    toast.success("AI content generated");
  };

  const aiQuickGenerate = async () => {
    setAiLoading(true);
    const { data, error } = await supabase.functions.invoke("generate-content", {
      body: { type: "post", topic: "fitness motivation", brandVoice: "energetic and supportive" },
    });
    setAiLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data?.error) { toast.error(data.error); return; }
    setEditing({ type: "post", title: data.title, body: data.body, status: "draft", platform: "instagram", day: 0, time: "09:00" });
    setEditorOpen(true);
  };

  const weekLabel = () =>
    `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Timeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Plan, generate and schedule weekly content for your studio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {(["Monthly", "Weekly"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {v}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8"><Filter className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((w) => w - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold">{weekLabel()}</p>
          {weekOffset !== 0 && (
            <button className="text-xs text-primary font-medium" onClick={() => setWeekOffset(0)}>Back to this week</button>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((w) => w + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
        {daysOfWeek.map((day, i) => {
          const date = getWeekDate(i);
          const isToday = new Date().toDateString() === date.toDateString();
          const dayContent = content.filter((c) => {
            if (!c.scheduled_at) return false;
            const cd = new Date(c.scheduled_at);
            return cd.toDateString() === date.toDateString();
          });

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
                  const t = (item.type as ContentType) in typeConfig ? (item.type as ContentType) : "post";
                  const config = typeConfig[t];
                  return (
                    <div key={item.id} onClick={() => openEdit(item)}
                      className={`p-1.5 rounded border text-[11px] cursor-pointer hover:shadow-sm transition-shadow ${config.color}`}>
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 mb-1 ${statusBadge[item.status] ?? ""}`}>
                        {item.status}
                      </Badge>
                      <p className="truncate font-medium">{item.title}</p>
                      {item.scheduled_at && (
                        <div className="flex items-center gap-1 mt-0.5 opacity-60">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{new Date(item.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={() => openNew(i)}
                  className="w-full py-1 rounded border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                  <Plus className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" className="gap-2 text-sm" onClick={aiQuickGenerate} disabled={aiLoading}>
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Generate
        </Button>
        <Button className="gap-2 text-sm" onClick={() => openNew(0)}>
          <Plus className="w-4 h-4" /> Add Content
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Posts this week", value: content.filter((c) => c.type === "post").length, icon: Image, color: "text-primary bg-primary/10" },
          { label: "Reels this week", value: content.filter((c) => c.type === "reel").length, icon: Video, color: "text-accent bg-accent/10" },
          { label: "Challenges this week", value: content.filter((c) => c.type === "challenge").length, icon: Trophy, color: "text-warning bg-warning/10" },
        ].map((s) => (
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

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Edit content" : "New content"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={editing.type ?? "post"} onValueChange={(v) => setEditing((p) => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editing.status ?? "draft"} onValueChange={(v) => setEditing((p) => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={editing.title ?? ""} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))} placeholder="Topic or headline" />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea rows={5} value={editing.body ?? ""} onChange={(e) => setEditing((p) => ({ ...p, body: e.target.value }))} placeholder="Caption text…" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Day</Label>
                <Select value={String(editing.day ?? 0)} onValueChange={(v) => setEditing((p) => ({ ...p, day: Number(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((d, i) => <SelectItem key={d} value={String(i)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={editing.time ?? "09:00"} onChange={(e) => setEditing((p) => ({ ...p, time: e.target.value }))} />
              </div>
              <div>
                <Label>Platform</Label>
                <Select value={editing.platform ?? "instagram"} onValueChange={(v) => setEditing((p) => ({ ...p, platform: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={aiGenerate} disabled={aiLoading}>
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {editing.title ? "Improve with AI" : "Generate with AI"}
            </Button>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <div>
              {editing.id && (
                <Button variant="ghost" size="sm" onClick={remove} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentCalendar;
