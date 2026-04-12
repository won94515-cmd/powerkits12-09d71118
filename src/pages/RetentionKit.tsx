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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Retention Kit</h1>
        <p className="text-muted-foreground mt-1">Build and manage your Discord community engagement</p>
      </div>

      <Tabs defaultValue="connect" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connect" className="gap-2"><Link2 className="w-4 h-4" /> Connect</TabsTrigger>
          <TabsTrigger value="welcome" className="gap-2"><MessageSquare className="w-4 h-4" /> Welcome Message</TabsTrigger>
          <TabsTrigger value="overview" className="gap-2"><Users className="w-4 h-4" /> Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Discord Connection
                </CardTitle>
                <CardDescription>Connect your Discord server to start building community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Server Invite Link</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://discord.gg/your-server"
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      disabled={connected}
                    />
                    <Button onClick={handleConnect} disabled={connected || !inviteLink}>
                      {connected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-lg ${connected ? "bg-success/10" : "bg-muted"}`}>
                  {connected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Server connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Not connected</span>
                    </>
                  )}
                </div>

                {connected && (
                  <div className="space-y-2">
                    <Label>Default Channel</Label>
                    <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockChannels.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>
                            <span className="flex items-center gap-2">
                              <Hash className="w-3 h-3" /> {ch.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Setup Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 1, text: "Create a Discord server for your studio", done: connected },
                    { step: 2, text: "Generate an invite link with no expiration", done: connected },
                    { step: 3, text: "Paste the link and connect", done: connected },
                    { step: 4, text: "Select your default channel", done: !!selectedChannel },
                    { step: 5, text: "Customize your welcome message", done: false },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
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

        <TabsContent value="welcome" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Message</CardTitle>
                <CardDescription>This message is sent when new members join your server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={8}
                  placeholder="Write your welcome message..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSendWelcome} className="gap-2">
                    <Send className="w-4 h-4" /> Send Test
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Sparkles className="w-4 h-4" /> AI Generate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#36393f] rounded-lg p-4 text-white text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">PK</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">powerKits Bot</span>
                        <Badge className="text-[10px] px-1 py-0 bg-primary/20 text-primary">BOT</Badge>
                        <span className="text-xs text-gray-400">Today</span>
                      </div>
                      <div className="mt-1 whitespace-pre-wrap text-gray-200">{welcomeMessage}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Members", value: "0", icon: Users },
              { label: "Active This Week", value: "0", icon: MessageSquare },
              { label: "Messages Today", value: "0", icon: Hash },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
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
