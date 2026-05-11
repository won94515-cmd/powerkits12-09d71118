import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DiscordCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Finishing Discord connection…");

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error_description") || params.get("error");
      if (error) { setStatus("error"); setMessage(error); return; }
      if (!code) { setStatus("error"); setMessage("Missing authorization code."); return; }

      const redirect_uri = `${window.location.origin}/discord/callback`;
      const { data, error: fnErr } = await supabase.functions.invoke("discord-oauth-callback", {
        body: { code, redirect_uri },
      });
      if (fnErr || (data as any)?.error || (data as any)?.ok === false) {
        setStatus("error");
        setMessage((data as any)?.error || fnErr?.message || "Failed to connect Discord");
        return;
      }
      setStatus("success");
      setMessage(`Connected to ${(data as any)?.guild?.name || "your server"}`);
      setTimeout(() => navigate("/retention-kit"), 1200);
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-4 p-8 rounded-xl border border-border bg-card">
        {status === "loading" && <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />}
        {status === "success" && <CheckCircle2 className="w-10 h-10 mx-auto text-success" />}
        {status === "error" && <AlertCircle className="w-10 h-10 mx-auto text-destructive" />}
        <h1 className="text-lg font-semibold">{status === "success" ? "Discord connected" : status === "error" ? "Connection failed" : "Please wait"}</h1>
        <p className="text-sm text-muted-foreground break-words">{message}</p>
        {status === "error" && (
          <Button onClick={() => navigate("/retention-kit")}>Back to Retention Kit</Button>
        )}
      </div>
    </div>
  );
};

export default DiscordCallback;
