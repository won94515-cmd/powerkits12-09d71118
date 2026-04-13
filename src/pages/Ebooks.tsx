import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Download, Search, Send, Star } from "lucide-react";
import { toast } from "sonner";

const ebooksData = [
  { id: 1, title: "30-Day Fitness Challenge Guide", category: "Challenges", pages: 24, downloads: 142, rating: 4.8, cover: "💪" },
  { id: 2, title: "Nutrition Basics for Gym Members", category: "Nutrition", pages: 36, downloads: 89, rating: 4.6, cover: "🥗" },
  { id: 3, title: "Building a Community Around Your Studio", category: "Business", pages: 18, downloads: 210, rating: 4.9, cover: "🏋️" },
  { id: 4, title: "Social Media for Fitness Studios", category: "Marketing", pages: 28, downloads: 167, rating: 4.7, cover: "📱" },
  { id: 5, title: "Member Retention Playbook", category: "Business", pages: 42, downloads: 305, rating: 4.9, cover: "🎯" },
  { id: 6, title: "Yoga Flow Sequences", category: "Workouts", pages: 20, downloads: 78, rating: 4.5, cover: "🧘" },
  { id: 7, title: "HIIT Programming Guide", category: "Workouts", pages: 32, downloads: 198, rating: 4.8, cover: "⚡" },
  { id: 8, title: "Studio Launch Checklist", category: "Business", pages: 15, downloads: 256, rating: 4.7, cover: "🚀" },
];

const categories = ["All", "Challenges", "Nutrition", "Business", "Marketing", "Workouts"];

const Ebooks = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = ebooksData.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ebooks & Pamphlets</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Browse and download ready-made content for your studio</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map((ebook) => (
          <Card key={ebook.id} className="group hover:shadow-md transition-all hover:border-primary/40 border-border/60 shadow-sm">
            <CardContent className="p-0">
              <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-4xl rounded-t-lg">
                {ebook.cover}
              </div>
              <div className="p-3 space-y-2.5">
                <div>
                  <Badge variant="outline" className="text-[10px] mb-1.5">{ebook.category}</Badge>
                  <h3 className="font-semibold text-sm leading-tight">{ebook.title}</h3>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ebook.pages} pages</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    <span>{ebook.rating}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" className="flex-1 gap-1 text-xs h-8" onClick={() => toast.success(`Downloading "${ebook.title}"`)}>
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => toast.info("Send to Discord coming soon")}>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No ebooks found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Ebooks;
