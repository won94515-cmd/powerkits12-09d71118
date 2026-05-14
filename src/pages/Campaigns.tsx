import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, Unplug, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailComposer } from "@/components/EmailComposer";

interface Conn { email: string; is_active: boolean; last_error: string | null; created_at: string; }
interface Log {
  id: string; subject: string; to_emails: string[]; status: string;
  gmail_message_id: string | null; error_message: string | null; created_at: string;
}

const Campaigns = () => {
  const [conn, setConn] = useState<Conn | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: c }, { data: l }] = await Promise.all([
      supabase.from("gmail_connections").select("email,is_active,last_error,created_at").maybeSingle(),
      supabase.from("email_send_logs").select("id,subject,to_emails,status,gmail_message_id,error_message,created_at").order("created_at", { ascending: false }).limit(50),
    ]);
    setConn(c as Conn | null);
    setLogs((l ?? []) as Log[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const connect = async () => {
    setWorking(true);
    const redirectUri = `${window.location.origin}/gmail/callback`;
    const { data, error } = await supabase.functions.invoke("gmail-oauth-start", { body: { redirectUri } });
    setWorking(false);
    if (error || data?.error) return toast.error(data?.error || error?.message || "Failed");
    window.location.href = data.url;
  };

  const disconnect = async () => {
    if (!confirm("Disconnect Gmail? You'll need to re-authorize to send emails.")) return;
    setWorking(true);
    const { data, error } = await supabase.functions.invoke("gmail-disconnect");
    setWorking(false);
    if (error || data?.error) return toast.error(data?.error || error?.message || "Failed");
    toast.success("Gmail disconnected");
    load();
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Email Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Send emails to your members from your own Gmail address.</p>
        </div>
        <Button className="gap-2" onClick={() => setComposeOpen(true)} disabled={!conn?.is_active}>
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">Gmail connection</h2>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> :
                    conn?.is_active ? <Badge className="bg-success/10 text-success gap-1"><CheckCircle2 className="w-3 h-3" /> Connected</Badge> :
                    conn ? <Badge variant="outline" className="text-warning border-warning/40 gap-1"><AlertCircle className="w-3 h-3" /> Needs reconnect</Badge> :
                    <Badge variant="outline">Not connected</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {conn?.email ?? "Connect your Gmail account to send emails directly from your own address."}
                </p>
                {conn?.last_error && <p className="text-xs text-destructive mt-1 break-all">{conn.last_error}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              {conn ? (
                <>
                  <Button variant="outline" size="sm" className="gap-2" onClick={connect} disabled={working}>
                    <RefreshCw className="w-4 h-4" /> Reconnect
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive" onClick={disconnect} disabled={working}>
                    <Unplug className="w-4 h-4" /> Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={connect} disabled={working} className="gap-2">
                  {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Connect Gmail
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold mb-3">Send history</h2>
          {loading ? (
            <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No emails sent yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {logs.map((l) => (
                <div key={l.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{l.subject}</p>
                      <Badge variant="outline" className={l.status === "sent" ? "text-success border-success/30" : "text-destructive border-destructive/30"}>
                        {l.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">To: {l.to_emails.join(", ")}</p>
                    {l.error_message && <p className="text-xs text-destructive truncate">{l.error_message}</p>}
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">{new Date(l.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EmailComposer open={composeOpen} onOpenChange={setComposeOpen} onSent={load} />
    </div>
  );
};

export default Campaigns;
