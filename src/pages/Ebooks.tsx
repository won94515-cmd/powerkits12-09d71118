import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Download, Search, Send, Star, Plus } from "lucide-react";
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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ebooks & Pamphlets</h1>
        <p className="text-muted-foreground mt-1">Browse and download ready-made content for your studio</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ebooks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((ebook) => (
          <Card key={ebook.id} className="group hover:shadow-lg transition-all hover:border-primary/50">
            <CardContent className="p-0">
              <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-5xl rounded-t-lg">
                {ebook.cover}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">{ebook.category}</Badge>
                  <h3 className="font-semibold text-sm leading-tight">{ebook.title}</h3>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ebook.pages} pages</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    <span>{ebook.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-1 text-xs" onClick={() => toast.success(`Downloading "${ebook.title}"`)}>
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toast.info("Send to Discord coming soon")}>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No ebooks found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Ebooks;
