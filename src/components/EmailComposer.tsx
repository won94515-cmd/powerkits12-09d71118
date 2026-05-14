import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Send, Mail } from "lucide-react";
import { toast } from "sonner";

interface GmailConnection {
  email: string;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject?: string;
  defaultBody?: string;
  contentItemId?: string;
  onSent?: () => void;
}

export const EmailComposer = ({ open, onOpenChange, defaultSubject = "", defaultBody = "", contentItemId, onSent }: Props) => {
  const [conn, setConn] = useState<GmailConnection | null>(null);
  const [loadingConn, setLoadingConn] = useState(true);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [isHtml, setIsHtml] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubject(defaultSubject); setBody(defaultBody);
    setLoadingConn(true);
    supabase.from("gmail_connections").select("email,is_active").maybeSingle()
      .then(({ data }) => { setConn(data as GmailConnection | null); setLoadingConn(false); });
  }, [open, defaultSubject, defaultBody]);

  const startConnect = async () => {
    const redirectUri = `${window.location.origin}/gmail/callback`;
    const { data, error } = await supabase.functions.invoke("gmail-oauth-start", { body: { redirectUri } });
    if (error || data?.error) { toast.error(data?.error || error?.message || "Failed to start OAuth"); return; }
    window.location.href = data.url;
  };

  const send = async () => {
    const recipients = to.split(",").map((s) => s.trim()).filter(Boolean);
    if (!recipients.length) return toast.error("Enter at least one recipient");
    if (!subject.trim()) return toast.error("Subject required");
    if (!body.trim()) return toast.error("Body required");

    setSending(true);
    const { data, error } = await supabase.functions.invoke("gmail-send", {
      body: { to: recipients, subject, body, isHtml, contentItemId },
    });
    setSending(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Send failed");
      if (data?.needsReconnect) setConn(null);
      return;
    }
    toast.success("Email sent");
    onSent?.();
    onOpenChange(false);
    setTo(""); setSubject(""); setBody("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Compose Email</DialogTitle></DialogHeader>
        {loadingConn ? (
          <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : !conn || !conn.is_active ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Connect your Gmail account to send emails from your own address.</p>
            <Button onClick={startConnect}>Connect Gmail</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">From: <span className="font-medium text-foreground">{conn.email}</span></p>
            <div>
              <Label>To (comma-separated)</Label>
              <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="alice@example.com, bob@example.com" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isHtml} onCheckedChange={setIsHtml} id="html-switch" />
              <Label htmlFor="html-switch" className="cursor-pointer">Send as HTML</Label>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {conn?.is_active && (
            <Button onClick={send} disabled={sending} className="gap-2">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
