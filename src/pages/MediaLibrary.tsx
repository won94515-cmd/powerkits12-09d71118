import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, Upload, Search, Download, Grid3X3, LayoutList, Folder, Plus } from "lucide-react";
import { toast } from "sonner";

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

const MediaLibrary = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-1">Templates, assets, and uploads for your studio</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" /> Upload Asset
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates" className="gap-2"><Image className="w-4 h-4" /> Templates</TabsTrigger>
          <TabsTrigger value="uploads" className="gap-2"><Folder className="w-4 h-4" /> My Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex border border-border rounded-lg">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("list")}>
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((t) => (
                <Card key={t.id} className="group hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-0">
                    <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-t-lg">
                      {t.type === "reel" ? <Video className="w-8 h-8 text-muted-foreground" /> : <Image className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{t.category}</Badge>
                        <span className="text-xs text-muted-foreground">{t.format}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {t.type === "reel" ? <Video className="w-5 h-5 text-muted-foreground" /> : <Image className="w-5 h-5 text-muted-foreground" />}
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{t.category}</Badge>
                    <span className="text-xs text-muted-foreground">{t.format}</span>
                    <Button variant="ghost" size="sm" onClick={() => toast.success("Downloaded!")}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="uploads">
          <div className="border-2 border-dashed border-border rounded-xl p-16 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">Upload your assets</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag & drop files or click to browse</p>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Browse Files
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
