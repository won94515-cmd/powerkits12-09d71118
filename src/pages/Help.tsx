import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  HelpCircle, Search, BookOpen, MessageSquare, Play,
  Palette, Shield, Calendar, CreditCard, BarChart3, Zap
} from "lucide-react";

const faqs = [
  { q: "How do I connect my Discord server?", a: "Go to Retention Kit → Connect tab. Paste your Discord server invite link and click Connect. Make sure the invite link has no expiration set." },
  { q: "Can I customize the branding?", a: "Yes! Go to Branding & Customization to set your logo, colors, typography, and brand voice. These settings apply across all generated content." },
  { q: "How does the content calendar work?", a: "The content calendar shows a weekly view with pre-made posts, reels, and challenges. You can schedule content, edit captions with AI, and publish directly to Discord." },
  { q: "What's included in each plan?", a: "Basic (€50/mo) includes brand customization and basic content. Pro (€99/mo) adds AI, Discord, and SEO. Pro Max (€119/mo) includes everything with white-label and priority support." },
  { q: "How do I cancel my subscription?", a: "Go to Plans & Billing, click Manage Subscription, then Cancel. You'll retain access until the end of your billing period." },
  { q: "Can I use my own images and templates?", a: "Yes! The Media Library lets you upload custom assets and use them alongside our template gallery." },
  { q: "How does the AI content generation work?", a: "Our AI uses your brand voice and settings to generate or customize post captions. You can toggle AI off if you prefer to write manually." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted at rest and in transit. We never share your data with third parties. Your Discord bot token is stored securely server-side." },
];

const guides = [
  { title: "Getting Started with powerKits", icon: Zap, category: "Basics", duration: "5 min" },
  { title: "Setting Up Your Brand Identity", icon: Palette, category: "Branding", duration: "10 min" },
  { title: "Connecting Discord", icon: Shield, category: "Retention", duration: "5 min" },
  { title: "Creating Your First Content Week", icon: Calendar, category: "Content", duration: "15 min" },
  { title: "Understanding Your Analytics", icon: BarChart3, category: "Analytics", duration: "8 min" },
  { title: "Managing Your Subscription", icon: CreditCard, category: "Billing", duration: "3 min" },
];

const Help = () => {
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Find answers, learn best practices, and get support</p>
        <div className="relative max-w-sm mx-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search help articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="hover:border-primary/40 transition-colors cursor-pointer border-border/60 shadow-sm">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-7 h-7 mx-auto text-primary mb-2" />
            <h3 className="font-semibold text-sm">Documentation</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Browse all guides</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/40 transition-colors cursor-pointer border-border/60 shadow-sm">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-7 h-7 mx-auto text-accent mb-2" />
            <h3 className="font-semibold text-sm">Community</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Join our Discord</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/40 transition-colors cursor-pointer border-border/60 shadow-sm">
          <CardContent className="p-4 text-center">
            <HelpCircle className="w-7 h-7 mx-auto text-warning mb-2" />
            <h3 className="font-semibold text-sm">Contact Support</h3>
            <p className="text-xs text-muted-foreground mt-0.5">We're here to help</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Best Practice Guides</CardTitle>
          <CardDescription className="text-xs">Step-by-step walkthroughs to get the most from powerKits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {guides.map((guide) => (
              <div key={guide.title} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <guide.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{guide.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-[10px]">{guide.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{guide.duration}</span>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filteredFaqs.length === 0 && (
            <p className="text-center py-5 text-muted-foreground text-sm">No results found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
