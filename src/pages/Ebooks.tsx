import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Download, Search, Send, Plus, Loader2, Trash2, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/contexts/BrandingContext";

const categories = ["All", "Challenges", "Nutrition", "Business", "Marketing", "Workouts", "general"];
const formCategories = ["Challenges", "Nutrition", "Business", "Marketing", "Workouts", "general"];

interface Ebook {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string | null;
  cover_url: string | null;
  pages_count: number | null;
  download_count: number | null;
  is_published: boolean | null;
  ai_body?: string | null;
}

const Ebooks = () => {
  const { user } = useAuth();
  const { brand } = useBranding();
  const fileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiType, setAiType] = useState<"ebook" | "pamphlet">("ebook");
  const [form, setForm] = useState({ title: "", description: "", category: "general", pages_count: 0 });
  const [file, setFile] = useState<File | null>(null);

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from("ebooks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setEbooks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.title) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      let file_url: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("ebooks").upload(path, file);
        if (upErr) throw upErr;
        file_url = path;
      }
      const { error } = await supabase.from("ebooks").insert({
        user_id: user.id,
        title: form.title,
        description: form.description || null,
        category: form.category,
        pages_count: Number(form.pages_count) || 0,
        file_url,
        is_published: true,
      });
      if (error) throw error;
      toast.success("Ebook added");
      setOpen(false);
      setForm({ title: "", description: "", category: "general", pages_count: 0 });
      setFile(null);
      fetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (ebook: Ebook) => {
    if (!ebook.file_url) { toast.error("No file attached"); return; }
    try {
      const { data, error } = await supabase.storage.from("ebooks").createSignedUrl(ebook.file_url, 60);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
      await supabase.from("ebooks").update({ download_count: (ebook.download_count || 0) + 1 }).eq("id", ebook.id);
      fetch();
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    }
  };

  const handleDelete = async (ebook: Ebook) => {
    if (!confirm(`Delete "${ebook.title}"?`)) return;
    try {
      if (ebook.file_url) await supabase.storage.from("ebooks").remove([ebook.file_url]);
      await supabase.from("ebooks").delete().eq("id", ebook.id);
      toast.success("Deleted");
      fetch();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const filtered = ebooks.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ebooks & Pamphlets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Browse and download ready-made content for your studio</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Ebook</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add new ebook</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Description</Label>
                <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{formCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Pages</Label>
                  <Input type="number" value={form.pages_count} onChange={(e) => setForm({ ...form, pages_count: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">PDF File (optional)</Label>
                <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ebooks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" className="text-xs h-8" onClick={() => setSelectedCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No ebooks yet. Click "Add Ebook" to upload your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map((ebook) => (
            <Card key={ebook.id} className="group hover:shadow-md transition-all hover:border-primary/40 border-border/60 shadow-sm">
              <CardContent className="p-0">
                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-4xl rounded-t-lg">
                  📘
                </div>
                <div className="p-3 space-y-2.5">
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1.5">{ebook.category}</Badge>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">{ebook.title}</h3>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ebook.pages_count || 0} pages</span>
                    <span>{ebook.download_count || 0} ↓</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" className="flex-1 gap-1 text-xs h-8" onClick={() => handleDownload(ebook)}>
                      <Download className="w-3 h-3" /> Download
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => handleDelete(ebook)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ebooks;
