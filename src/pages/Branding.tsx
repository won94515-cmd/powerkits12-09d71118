import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, Type, MessageSquare, Save } from "lucide-react";
import { toast } from "sonner";

const colorPresets = [
  { name: "Ocean Blue", primary: "#0062FF", secondary: "#1B263B", accent: "#00897B" },
  { name: "Sunset Energy", primary: "#FF6B35", secondary: "#2D2D2D", accent: "#FFD700" },
  { name: "Forest Calm", primary: "#2D6A4F", secondary: "#1B4332", accent: "#95D5B2" },
  { name: "Berry Power", primary: "#7B2D8B", secondary: "#2D1B4E", accent: "#E040FB" },
];

const fontOptions = [
  { value: "inter", label: "Inter", style: "Clean & Modern" },
  { value: "poppins", label: "Poppins", style: "Friendly & Round" },
  { value: "montserrat", label: "Montserrat", style: "Bold & Strong" },
  { value: "playfair", label: "Playfair Display", style: "Elegant & Classic" },
];

const voiceTones = [
  { value: "motivational", label: "Motivational", desc: "Energetic, uplifting, action-oriented" },
  { value: "professional", label: "Professional", desc: "Clean, trustworthy, authoritative" },
  { value: "friendly", label: "Friendly & Warm", desc: "Approachable, casual, supportive" },
  { value: "bold", label: "Bold & Edgy", desc: "Strong, direct, challenging" },
];

const Branding = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0062FF");
  const [secondaryColor, setSecondaryColor] = useState("#1B263B");
  const [accentColor, setAccentColor] = useState("#00897B");
  const [headingFont, setHeadingFont] = useState("inter");
  const [bodyFont, setBodyFont] = useState("inter");
  const [brandVoice, setBrandVoice] = useState("motivational");
  const [studioName, setStudioName] = useState("");
  const [tagline, setTagline] = useState("");
  const [brandDescription, setBrandDescription] = useState("");

  const handleSave = () => {
    toast.success("Brand settings saved! These will apply across all your content.");
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branding & Customization</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Define your studio's visual identity and voice</p>
        </div>
        <Button onClick={handleSave} size="sm" className="gap-1.5">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="identity" className="space-y-5">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="identity" className="gap-1.5 text-sm"><Palette className="w-3.5 h-3.5 hidden sm:block" /> Identity</TabsTrigger>
          <TabsTrigger value="colors" className="gap-1.5 text-sm"><Palette className="w-3.5 h-3.5 hidden sm:block" /> Colors</TabsTrigger>
          <TabsTrigger value="typography" className="gap-1.5 text-sm"><Type className="w-3.5 h-3.5 hidden sm:block" /> Typography</TabsTrigger>
          <TabsTrigger value="voice" className="gap-1.5 text-sm"><MessageSquare className="w-3.5 h-3.5 hidden sm:block" /> Voice</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Studio Identity</CardTitle>
                <CardDescription className="text-xs">Basic information about your studio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Studio Name</Label>
                  <Input placeholder="FitStudio Berlin" value={studioName} onChange={(e) => setStudioName(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Tagline</Label>
                  <Input placeholder="Your journey starts here" value={tagline} onChange={(e) => setTagline(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Brand Description</Label>
                  <Textarea placeholder="Describe your studio's mission and values..." value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Logo</CardTitle>
                <CardDescription className="text-xs">Upload your studio logo (PNG, SVG recommended)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="max-h-32 mx-auto" />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="font-medium text-sm">Drop your logo here</p>
                      <p className="text-xs text-muted-foreground">or click to browse</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Color Palette</CardTitle>
              <CardDescription className="text-xs">Choose colors that represent your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium mb-2.5 block">Quick Presets</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => { setPrimaryColor(preset.primary); setSecondaryColor(preset.secondary); setAccentColor(preset.accent); }}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <p className="text-xs font-medium">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Primary", value: primaryColor, setter: setPrimaryColor },
                  { label: "Secondary", value: secondaryColor, setter: setSecondaryColor },
                  { label: "Accent", value: accentColor, setter: setAccentColor },
                ].map(c => (
                  <div key={c.label} className="space-y-1.5">
                    <Label className="text-sm">{c.label} Color</Label>
                    <div className="flex gap-2">
                      <input type="color" value={c.value} onChange={(e) => c.setter(e.target.value)} className="w-9 h-9 rounded cursor-pointer border-0" />
                      <Input value={c.value} onChange={(e) => c.setter(e.target.value)} className="font-mono text-sm h-9" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl border border-border" style={{ backgroundColor: secondaryColor }}>
                <h3 className="text-lg font-bold mb-1.5" style={{ color: primaryColor }}>{studioName || "Your Studio Name"}</h3>
                <p className="text-sm mb-3" style={{ color: "#ffffff" }}>{tagline || "Your tagline goes here"}</p>
                <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: accentColor, color: "#ffffff" }}>
                  Join Now
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Typography</CardTitle>
              <CardDescription className="text-xs">Select fonts for your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">Heading Font</Label>
                  <Select value={headingFont} onValueChange={setHeadingFont}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(f => (
                        <SelectItem key={f.value} value={f.value}>
                          <span className="font-medium">{f.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">— {f.style}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Body Font</Label>
                  <Select value={bodyFont} onValueChange={setBodyFont}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(f => (
                        <SelectItem key={f.value} value={f.value}>
                          <span className="font-medium">{f.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">— {f.style}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-5 rounded-xl border border-border bg-muted/30">
                <h3 className="text-xl font-bold mb-1.5">Preview Heading</h3>
                <p className="text-sm text-muted-foreground">This is how your body text will look across posts, reels, and community content.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand Voice</CardTitle>
              <CardDescription className="text-xs">How should your content sound?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {voiceTones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setBrandVoice(tone.value)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      brandVoice === tone.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{tone.label}</p>
                      {brandVoice === tone.value && <Badge variant="default" className="text-[10px] px-1.5">Selected</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{tone.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Branding;
