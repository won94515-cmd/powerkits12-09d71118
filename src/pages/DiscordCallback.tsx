import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const DiscordCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ranRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your Discord server…");

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const code = params.get("code");
    const error = params.get("error");
    const error_description = params.get("error_description");
    const redirect_uri = `${window.location.origin}/discord/callback`;

    const saveDiag = (diag: any) => {
      try {
        sessionStorage.setItem(
          "discord_oauth_diagnostic",
          JSON.stringify({ ...diag, at: new Date().toISOString(), redirect_uri }),
        );
      } catch {}
    };

    if (error) {
      setStatus("error");
      setMessage(`Discord authorization failed: ${error}`);
      saveDiag({ stage: "discord_redirect", error, error_description });
      return;
    }
    if (!code) {
      setStatus("error");
      setMessage("Missing authorization code.");
      saveDiag({ stage: "discord_redirect", error: "missing_code" });
      return;
    }

    (async () => {
      const { data, error: invokeErr } = await supabase.functions.invoke("discord-oauth-callback", {
        body: { code, redirect_uri },
      });
      const payload = data as any;
      if (invokeErr || payload?.ok === false || payload?.error) {
        setStatus("error");
        const detailMsg =
          payload?.details?.error_description ||
          payload?.details?.error ||
          payload?.error ||
          invokeErr?.message ||
          "Failed to connect.";
        setMessage(detailMsg);
        console.error("Discord OAuth error:", { invokeErr, payload });
        saveDiag({
          stage: "token_exchange",
          error: payload?.error || invokeErr?.message,
          details: payload?.details,
          status: payload?.status,
        });
        return;
      }
      try { sessionStorage.removeItem("discord_oauth_diagnostic"); } catch {}
      setStatus("success");
      setMessage(`Connected to ${payload?.guild?.name ?? "your server"}!`);
      setTimeout(() => navigate("/retention-kit"), 1500);
    })();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          {status === "loading" && <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />}
          {status === "success" && <CheckCircle2 className="w-10 h-10 mx-auto text-success" />}
          {status === "error" && <AlertCircle className="w-10 h-10 mx-auto text-destructive" />}
          <h1 className="text-lg font-semibold">{message}</h1>
          {status === "error" && (
            <button
              onClick={() => navigate("/retention-kit")}
              className="text-sm text-primary hover:underline"
            >
              Back to Retention Kit
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscordCallback;
