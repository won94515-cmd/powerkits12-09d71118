import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, Type, MessageSquare, Eye, Save, Sparkles } from "lucide-react";
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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Branding & Customization</h1>
          <p className="text-muted-foreground mt-1">Define your studio's visual identity and voice</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identity" className="gap-2"><Palette className="w-4 h-4 hidden sm:block" /> Identity</TabsTrigger>
          <TabsTrigger value="colors" className="gap-2"><Palette className="w-4 h-4 hidden sm:block" /> Colors</TabsTrigger>
          <TabsTrigger value="typography" className="gap-2"><Type className="w-4 h-4 hidden sm:block" /> Typography</TabsTrigger>
          <TabsTrigger value="voice" className="gap-2"><MessageSquare className="w-4 h-4 hidden sm:block" /> Voice</TabsTrigger>
        </TabsList>

        {/* Identity */}
        <TabsContent value="identity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Studio Identity</CardTitle>
                <CardDescription>Basic information about your studio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Studio Name</Label>
                  <Input placeholder="FitStudio Berlin" value={studioName} onChange={(e) => setStudioName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input placeholder="Your journey starts here" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Brand Description</Label>
                  <Textarea placeholder="Describe your studio's mission and values..." value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Upload your studio logo (PNG, SVG recommended)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="max-h-32 mx-auto" />
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Drop your logo here</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Colors */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Choose colors that represent your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                        setAccentColor(preset.accent);
                      }}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <p className="text-xs font-medium">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
              </div>
              {/* Live Preview */}
              <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: secondaryColor }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: primaryColor }}>{studioName || "Your Studio Name"}</h3>
                <p className="text-sm mb-3" style={{ color: "#ffffff" }}>{tagline || "Your tagline goes here"}</p>
                <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: accentColor, color: "#ffffff" }}>
                  Join Now
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Select fonts for your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select value={headingFont} onValueChange={setHeadingFont}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select value={bodyFont} onValueChange={setBodyFont}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
              <div className="p-6 rounded-xl border border-border bg-muted/30">
                <h3 className="text-2xl font-bold mb-2">Preview Heading</h3>
                <p className="text-sm text-muted-foreground">This is how your body text will look across posts, reels, and community content.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice */}
        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
              <CardDescription>How should your content sound?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      {brandVoice === tone.value && <Badge variant="default" className="text-xs">Selected</Badge>}
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
