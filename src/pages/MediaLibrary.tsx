import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Video, Upload, Search, Download, Grid3X3, LayoutList, Folder, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const templates = [
  { id: 1, name: "Motivation Monday", type: "post", format: "1080x1080", category: "Social" },
  { id: 2, name: "Workout of the Day", type: "post", format: "1080x1080", category: "Social" },
  { id: 3, name: "Class Schedule", type: "story", format: "1080x1920", category: "Stories" },
  { id: 4, name: "Member Testimonial", type: "post", format: "1080x1080", category: "Social" },
  { id: 5, name: "Challenge Announcement", type: "reel", format: "1080x1920", category: "Reels" },
  { id: 6, name: "Nutrition Tip", type: "post", format: "1080x1080", category: "Social" },
  { id: 7, name: "Before & After", type: "post", format: "1080x1350", category: "Social" },
  { id: 8, name: "Event Promo", type: "story", format: "1080x1920", category: "Stories" },
];

interface MediaAsset {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  folder: string | null;
}

const MediaLibrary = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploads, setUploads] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchUploads = async () => {
    if (!user) return;
    const { data } = await supabase.from("media_assets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setUploads(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUploads(); }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
        const { error: insErr } = await supabase.from("media_assets").insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          folder: "uploads",
        });
        if (insErr) throw insErr;
      }
      toast.success(`Uploaded ${files.length} file(s)`);
      fetchUploads();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`Delete ${asset.file_name}?`)) return;
    try {
      const url = new URL(asset.file_url);
      const path = url.pathname.split("/media/")[1];
      if (path) await supabase.storage.from("media").remove([path]);
      await supabase.from("media_assets").delete().eq("id", asset.id);
      toast.success("Deleted");
      fetchUploads();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const filteredUploads = uploads.filter(u => u.file_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Templates, assets, and uploads for your studio</p>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleUpload} />
        <Button size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Asset
        </Button>
      </div>

      <Tabs defaultValue="uploads" className="space-y-5">
        <TabsList className="h-9">
          <TabsTrigger value="uploads" className="gap-1.5 text-sm"><Folder className="w-3.5 h-3.5" /> My Uploads</TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5 text-sm"><ImageIcon className="w-3.5 h-3.5" /> Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="uploads" className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search uploads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : filteredUploads.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-xl p-14 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold text-sm mb-1">No uploads yet</h3>
              <p className="text-xs text-muted-foreground mb-3">Click "Upload Asset" to add your first file</p>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                <Plus className="w-3.5 h-3.5" /> Browse Files
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredUploads.map((u) => (
                <Card key={u.id} className="group border-border/60 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-28 bg-muted flex items-center justify-center relative">
                      {u.file_type?.startsWith("image/") ? (
                        <img src={u.file_url} alt={u.file_name} className="w-full h-full object-cover" />
                      ) : u.file_type?.startsWith("video/") ? (
                        <Video className="w-7 h-7 text-muted-foreground" />
                      ) : (
                        <ImageIcon className="w-7 h-7 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <p className="text-xs font-medium truncate" title={u.file_name}>{u.file_name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{((u.file_size || 0) / 1024).toFixed(0)} KB</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(u)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-3">
          <div className="flex gap-2.5 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <div className="flex border border-border rounded-lg">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-3.5 h-3.5" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
                <LayoutList className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((t) => (
                <Card key={t.id} className="group hover:shadow-md hover:border-primary/40 transition-all cursor-pointer border-border/60 shadow-sm">
                  <CardContent className="p-0">
                    <div className="h-28 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-t-lg">
                      {t.type === "reel" ? <Video className="w-7 h-7 text-muted-foreground" /> : <ImageIcon className="w-7 h-7 text-muted-foreground" />}
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">{t.format}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    {t.type === "reel" ? <Video className="w-4 h-4 text-muted-foreground" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{t.format}</span>
                    <Button variant="ghost" size="sm" className="h-7" onClick={() => toast.success("Downloaded!")}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
