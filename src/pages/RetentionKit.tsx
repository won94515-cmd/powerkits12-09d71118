import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Link2, Hash, MessageSquare, Send, Users, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

const mockChannels = [
  { id: "general", name: "general" },
  { id: "announcements", name: "announcements" },
  { id: "challenges", name: "challenges" },
  { id: "motivation", name: "motivation" },
  { id: "nutrition", name: "nutrition" },
];

const RetentionKit = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [connected, setConnected] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "🎉 Welcome to our fitness community! We're thrilled to have you here.\n\n💪 Here you'll find daily motivation, workout challenges, and a supportive community of fitness enthusiasts.\n\nGet started by introducing yourself in #general!"
  );

  const handleConnect = () => {
    if (!inviteLink.includes("discord")) {
      toast.error("Please enter a valid Discord invite link");
      return;
    }
    setConnected(true);
    toast.success("Discord server connected successfully!");
  };

  const handleSendWelcome = () => {
    if (!selectedChannel) {
      toast.error("Please select a channel first");
      return;
    }
    toast.success(`Welcome message will be sent to #${selectedChannel}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Retention Kit</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Build and manage your Discord community engagement</p>
      </div>

      <Tabs defaultValue="connect" className="space-y-5">
        <TabsList className="h-9">
          <TabsTrigger value="connect" className="gap-1.5 text-sm"><Link2 className="w-3.5 h-3.5" /> Connect</TabsTrigger>
          <TabsTrigger value="welcome" className="gap-1.5 text-sm"><MessageSquare className="w-3.5 h-3.5" /> Welcome Message</TabsTrigger>
          <TabsTrigger value="overview" className="gap-1.5 text-sm"><Users className="w-3.5 h-3.5" /> Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-4 h-4 text-primary" />
                  Discord Connection
                </CardTitle>
                <CardDescription className="text-xs">Connect your Discord server to start building community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Server Invite Link</Label>
                  <div className="flex gap-2">
                    <Input placeholder="https://discord.gg/your-server" value={inviteLink} onChange={(e) => setInviteLink(e.target.value)} disabled={connected} className="h-9" />
                    <Button onClick={handleConnect} disabled={connected || !inviteLink} size="sm">
                      {connected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${connected ? "bg-success/10" : "bg-muted"}`}>
                  {connected ? (
                    <><CheckCircle2 className="w-4 h-4 text-success" /><span className="font-medium text-success">Server connected</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Not connected</span></>
                  )}
                </div>
                {connected && (
                  <div className="space-y-1.5">
                    <Label className="text-sm">Default Channel</Label>
                    <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select a channel" /></SelectTrigger>
                      <SelectContent>
                        {mockChannels.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>
                            <span className="flex items-center gap-2"><Hash className="w-3 h-3" /> {ch.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Setup Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { step: 1, text: "Create a Discord server for your studio", done: connected },
                    { step: 2, text: "Generate an invite link with no expiration", done: connected },
                    { step: 3, text: "Paste the link and connect", done: connected },
                    { step: 4, text: "Select your default channel", done: !!selectedChannel },
                    { step: 5, text: "Customize your welcome message", done: false },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        s.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {s.done ? "✓" : s.step}
                      </div>
                      <span className={`text-sm ${s.done ? "line-through text-muted-foreground" : ""}`}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="welcome" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Welcome Message</CardTitle>
                <CardDescription className="text-xs">This message is sent when new members join your server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={7} />
                <div className="flex gap-2">
                  <Button onClick={handleSendWelcome} size="sm" className="gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Send Test
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#36393f] rounded-lg p-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary-foreground">PK</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary text-sm">powerKits Bot</span>
                        <Badge className="text-[9px] px-1 py-0 bg-primary/20 text-primary">BOT</Badge>
                        <span className="text-[10px] text-gray-400">Today</span>
                      </div>
                      <div className="mt-1 whitespace-pre-wrap text-gray-200 text-xs">{welcomeMessage}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Members", value: "0", icon: Users },
              { label: "Active This Week", value: "0", icon: MessageSquare },
              { label: "Messages Today", value: "0", icon: Hash },
            ].map((stat) => (
              <Card key={stat.label} className="border-border/60 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetentionKit;
