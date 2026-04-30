import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, Hash, MessageSquare, Send, Users, CheckCircle2, AlertCircle,
  Sparkles, RefreshCw, LogOut, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { buildDiscordOAuthUrl, DISCORD_CLIENT_ID, DISCORD_OAUTH_SCOPES, DISCORD_BOT_PERMISSIONS } from "@/lib/discord";

interface DiscordChannel { id: string; name: string; }
interface DiscordConnection {
  server_id: string | null;
  server_name: string | null;
  guild_icon: string | null;
  bot_installed: boolean | null;
  is_active: boolean | null;
  welcome_channel_id: string | null;
  selected_channel_name: string | null;
  welcome_message: string | null;
  channels_cache: DiscordChannel[] | null;
}

const DEFAULT_WELCOME =
  "🎉 Welcome to our fitness community! We're thrilled to have you here.\n\n💪 Daily motivation, workout challenges, and a supportive community.\n\nIntroduce yourself in #general!";

const RetentionKit = () => {
  const { user } = useAuth();
  const [conn, setConn] = useState<DiscordConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [refreshingChannels, setRefreshingChannels] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/discord/callback` : "";
  const oauthUrl = redirectUri ? buildDiscordOAuthUrl(redirectUri) : "";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("discord_oauth_diagnostic");
      if (raw) setDiagnostic(JSON.parse(raw));
    } catch {}
  }, []);

  const clearDiagnostic = () => {
    try { sessionStorage.removeItem("discord_oauth_diagnostic"); } catch {}
    setDiagnostic(null);
  };

  const copyDiagnostic = async () => {
    const payload = {
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: redirectUri,
      scopes: DISCORD_OAUTH_SCOPES,
      permissions: DISCORD_BOT_PERMISSIONS,
      oauth_url: oauthUrl,
      last_error: diagnostic,
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const connected = !!conn?.bot_installed && !!conn?.server_id;

  const loadConnection = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("discord_connections")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setConn(data as any);
      setChannels(((data as any).channels_cache as DiscordChannel[]) || []);
      setSelectedChannel(data.welcome_channel_id || "");
      setWelcomeMessage(data.welcome_message || DEFAULT_WELCOME);
    } else {
      setConn(null);
    }
    setLoading(false);
  };

  useEffect(() => { loadConnection(); }, [user]);

  const handleConnect = () => {
    const redirectUri = `${window.location.origin}/discord/callback`;
    window.location.href = buildDiscordOAuthUrl(redirectUri);
  };

  const handleRefreshChannels = async () => {
    setRefreshingChannels(true);
    const { data, error } = await supabase.functions.invoke("discord-list-channels");
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Failed to load channels");
    } else {
      setChannels((data as any).channels || []);
      toast.success(`Loaded ${(data as any).channels?.length || 0} channels`);
    }
    setRefreshingChannels(false);
  };

  // Auto-load channels first time after connecting
  useEffect(() => {
    if (connected && channels.length === 0 && !refreshingChannels) {
      handleRefreshChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    const channelName = channels.find((c) => c.id === selectedChannel)?.name || null;
    const { error } = await supabase
      .from("discord_connections")
      .update({
        welcome_channel_id: selectedChannel || null,
        selected_channel_name: channelName,
        welcome_message: welcomeMessage,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); loadConnection(); }
  };

  const handleSendWelcome = async () => {
    if (!selectedChannel) return toast.error("Select a channel first");
    setSending(true);
    const { data, error } = await supabase.functions.invoke("discord-send-message", {
      body: { channel_id: selectedChannel, message: welcomeMessage },
    });
    setSending(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Failed to send");
    } else {
      toast.success("Message sent to Discord!");
    }
  };

  const handleDisconnect = async () => {
    const { error } = await supabase.functions.invoke("discord-disconnect");
    if (error) toast.error(error.message);
    else { toast.success("Disconnected"); setConn(null); setChannels([]); setSelectedChannel(""); }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Retention Kit</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Build and manage your Discord community engagement
        </p>
      </div>

      <Tabs defaultValue="connect" className="space-y-5">
        <TabsList className="h-9">
          <TabsTrigger value="connect" className="gap-1.5 text-sm">
            <Shield className="w-3.5 h-3.5" /> Connect
          </TabsTrigger>
          <TabsTrigger value="welcome" className="gap-1.5 text-sm" disabled={!connected}>
            <MessageSquare className="w-3.5 h-3.5" /> Welcome Message
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-1.5 text-sm">
            <Users className="w-3.5 h-3.5" /> Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-4 h-4 text-primary" /> Discord Connection
                </CardTitle>
                <CardDescription className="text-xs">
                  Install the powerKits bot into your Discord server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {!connected ? (
                  <>
                    <div className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Click below to authorize. You'll choose which Discord
                        server to install the powerKits bot into. You need the
                        <strong> Manage Server</strong> permission on that server.
                      </p>
                    </div>
                    <Button onClick={handleConnect} className="w-full gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white">
                      <Shield className="w-4 h-4" /> Connect with Discord
                    </Button>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg text-sm bg-muted">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Not connected</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                      {conn?.guild_icon && conn?.server_id ? (
                        <img
                          src={`https://cdn.discordapp.com/icons/${conn.server_id}/${conn.guild_icon}.png?size=64`}
                          alt={conn.server_name || "server"}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{conn?.server_name}</div>
                        <div className="text-xs text-success">Bot installed & connected</div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={handleDisconnect} className="gap-1.5">
                        <LogOut className="w-3.5 h-3.5" /> Disconnect
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Default Channel</Label>
                        <Button
                          variant="ghost" size="sm" onClick={handleRefreshChannels}
                          disabled={refreshingChannels} className="h-7 gap-1.5 text-xs"
                        >
                          <RefreshCw className={`w-3 h-3 ${refreshingChannels ? "animate-spin" : ""}`} />
                          Refresh
                        </Button>
                      </div>
                      <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder={channels.length ? "Select a channel" : "Loading channels…"} />
                        </SelectTrigger>
                        <SelectContent>
                          {channels.map((ch) => (
                            <SelectItem key={ch.id} value={ch.id}>
                              <span className="flex items-center gap-2">
                                <Hash className="w-3 h-3" /> {ch.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleSaveSettings} disabled={saving} size="sm" className="w-full mt-2">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Settings"}
                      </Button>
                    </div>
                  </>
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
                    { step: 1, text: "Click 'Connect with Discord' above", done: connected },
                    { step: 2, text: "Choose your server in Discord's popup", done: connected },
                    { step: 3, text: "Authorize the powerKits bot", done: connected },
                    { step: 4, text: "Select a default channel", done: !!selectedChannel },
                    { step: 5, text: "Customize your welcome message", done: !!conn?.welcome_message && conn.welcome_message !== DEFAULT_WELCOME },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        s.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {s.done ? "✓" : s.step}
                      </div>
                      <span className={`text-sm ${s.done ? "line-through text-muted-foreground" : ""}`}>
                        {s.text}
                      </span>
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
                <CardDescription className="text-xs">
                  Sent to <span className="font-mono">#{channels.find(c => c.id === selectedChannel)?.name || "—"}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={7}
                  maxLength={2000}
                />
                <div className="text-xs text-muted-foreground text-right">{welcomeMessage.length}/2000</div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSettings} disabled={saving} variant="outline" size="sm">
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button onClick={handleSendWelcome} disabled={sending || !selectedChannel} size="sm" className="gap-1.5">
                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send Now
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" disabled>
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
              { label: "Server", value: conn?.server_name || "—", icon: Shield },
              { label: "Channels Available", value: String(channels.length), icon: Hash },
              { label: "Default Channel", value: conn?.selected_channel_name ? `#${conn.selected_channel_name}` : "—", icon: MessageSquare },
            ].map((stat) => (
              <Card key={stat.label} className="border-border/60 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold truncate">{stat.value}</p>
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
