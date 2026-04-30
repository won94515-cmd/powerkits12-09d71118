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

    if (error) {
      setStatus("error");
      setMessage(`Discord authorization failed: ${error}`);
      return;
    }
    if (!code) {
      setStatus("error");
      setMessage("Missing authorization code.");
      return;
    }

    const redirect_uri = `${window.location.origin}/discord/callback`;

    (async () => {
      // Wait for Supabase auth session to be restored from storage before invoking.
      // Without this, the function call goes out without a JWT and returns 401.
      let { data: sessionData } = await supabase.auth.getSession();
      let session = sessionData.session;
      if (!session) {
        // Give storage hydration a brief window, then re-check once.
        await new Promise((r) => setTimeout(r, 400));
        const retry = await supabase.auth.getSession();
        session = retry.data.session;
      }
      if (!session) {
        setStatus("error");
        setMessage("You need to be signed in to connect Discord. Please log in and try again.");
        return;
      }

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
        return;
      }
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
