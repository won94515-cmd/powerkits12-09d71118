import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, TrendingUp, Sparkles, CheckCircle2, AlertCircle, XCircle, Copy, BarChart3, Loader2, Type } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Keyword = { keyword: string; volume: string; difficulty: "Low" | "Medium" | "High"; trend: "up" | "stable" | "down" };
type TitleIdea = { title: string; metaDescription: string };

const auditItems = [
  { label: "Page title length", status: "pass", detail: "52 characters — optimal" },
  { label: "Meta description", status: "pass", detail: "148 characters — good" },
  { label: "Heading hierarchy", status: "warning", detail: "Missing H2 tags" },
  { label: "Image alt text", status: "fail", detail: "3 images missing alt text" },
  { label: "Mobile responsive", status: "pass", detail: "Fully responsive" },
  { label: "Page speed", status: "warning", detail: "2.8s — could improve" },
  { label: "SSL certificate", status: "pass", detail: "HTTPS enabled" },
  { label: "Sitemap", status: "fail", detail: "No sitemap.xml found" },
];

const SEO = () => {
  const [topic, setTopic] = useState("fitness studio");
  const [location, setLocation] = useState("Berlin, Germany");
  const [language, setLanguage] = useState("English");

  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loadingKw, setLoadingKw] = useState(false);

  const [titles, setTitles] = useState<TitleIdea[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(false);

  const [caption, setCaption] = useState("");
  const [optimizedCaption, setOptimizedCaption] = useState("");
  const [loadingOpt, setLoadingOpt] = useState(false);

  const callSeo = async (mode: "keywords" | "titles" | "optimize", extra: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("seo-suggest", {
      body: { mode, topic, location, language, ...extra },
    });
    if (error) throw error;
    if ((data as any)?.error) throw new Error((data as any).error);
    return data as any;
  };

  const fetchKeywords = async () => {
    setLoadingKw(true);
    try {
      const data = await callSeo("keywords");
      setKeywords(data.keywords ?? []);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load keywords");
    } finally {
      setLoadingKw(false);
    }
  };

  const fetchTitles = async () => {
    setLoadingTitles(true);
    try {
      const data = await callSeo("titles");
      setTitles(data.titles ?? []);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to generate titles");
    } finally {
      setLoadingTitles(false);
    }
  };

  const handleOptimize = async () => {
    if (!caption.trim()) { toast.error("Please enter a caption to optimize"); return; }
    setLoadingOpt(true);
    try {
      const data = await callSeo("optimize", { caption });
      setOptimizedCaption((data.text ?? "").trim());
      toast.success("Caption optimized!");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to optimize caption");
    } finally {
      setLoadingOpt(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "fail": return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO Toolkit</h1>
        <p className="text-sm text-muted-foreground mt-0.5">AI-powered keywords, titles, and caption optimization for your studio</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Topic</label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. HIIT classes" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Berlin, Germany" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Language</label>
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. German" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="keywords" className="space-y-5">
        <TabsList className="h-9">
          <TabsTrigger value="keywords" className="gap-1.5 text-sm"><Search className="w-3.5 h-3.5" /> Keywords</TabsTrigger>
          <TabsTrigger value="titles" className="gap-1.5 text-sm"><Type className="w-3.5 h-3.5" /> Titles</TabsTrigger>
          <TabsTrigger value="optimizer" className="gap-1.5 text-sm"><Sparkles className="w-3.5 h-3.5" /> Caption Optimizer</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5 text-sm"><BarChart3 className="w-3.5 h-3.5" /> Site Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Keyword Suggestions</CardTitle>
                <CardDescription className="text-xs">AI-generated keywords localized to your location</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={fetchKeywords} disabled={loadingKw}>
                {loadingKw ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate
              </Button>
            </CardHeader>
            <CardContent>
              {loadingKw && keywords.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating keywords...
                </div>
              ) : keywords.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No keywords yet. Click Generate.</div>
              ) : (
                <div className="space-y-1.5">
                  {keywords.map((kw) => (
                    <div key={kw.keyword} className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className={`w-3.5 h-3.5 ${kw.trend === "up" ? "text-success" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{kw.keyword}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{kw.volume}/mo</Badge>
                        <Badge variant={kw.difficulty === "Low" ? "default" : kw.difficulty === "Medium" ? "secondary" : "destructive"} className="text-[10px]">
                          {kw.difficulty}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { navigator.clipboard.writeText(kw.keyword); toast.success("Copied!"); }}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="titles" className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">SEO Titles & Meta</CardTitle>
                <CardDescription className="text-xs">Click-worthy titles with optimized meta descriptions</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={fetchTitles} disabled={loadingTitles}>
                {loadingTitles ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate
              </Button>
            </CardHeader>
            <CardContent>
              {titles.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">
                  {loadingTitles ? (<span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating...</span>) : "Click Generate to create title ideas."}
                </div>
              ) : (
                <div className="space-y-2">
                  {titles.map((t, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold">{t.title}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => { navigator.clipboard.writeText(t.title); toast.success("Title copied!"); }}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.metaDescription}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizer" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Caption</CardTitle>
                <CardDescription className="text-xs">Paste your post caption and we'll optimize it with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter your social media caption here..." rows={6} />
                <Button onClick={handleOptimize} size="sm" className="gap-1.5" disabled={loadingOpt}>
                  {loadingOpt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Optimize Caption
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Optimized Result</CardTitle>
              </CardHeader>
              <CardContent>
                {optimizedCaption ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <p className="text-sm whitespace-pre-wrap">{optimizedCaption}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { navigator.clipboard.writeText(optimizedCaption); toast.success("Copied to clipboard!"); }}>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground text-sm">Optimized caption will appear here</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Site Audit</CardTitle>
                  <CardDescription className="text-xs">SEO health check for your studio website</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">72</p>
                  <p className="text-[10px] text-muted-foreground">SEO Score</p>
                </div>
              </div>
              <Progress value={72} className="mt-2 h-1.5" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {auditItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg border border-border">
                    <div className="flex items-center gap-2.5">
                      {statusIcon(item.status)}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.detail}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEO;
