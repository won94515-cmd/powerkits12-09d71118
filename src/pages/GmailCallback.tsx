import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const GmailCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your Gmail account…");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const errorDesc = url.searchParams.get("error_description");

    if (error) {
      setStatus("error");
      setMessage(errorDesc || error);
      return;
    }
    if (!code) {
      setStatus("error");
      setMessage("No authorization code returned from Google.");
      return;
    }

    const redirectUri = `${window.location.origin}/gmail/callback`;
    supabase.functions
      .invoke("gmail-oauth-callback", { body: { code, redirectUri } })
      .then(({ data, error }) => {
        if (error || data?.error) {
          setStatus("error");
          setMessage(data?.error || error?.message || "Failed to connect Gmail");
          return;
        }
        setEmail(data.email);
        setStatus("success");
        setMessage(`Connected to ${data.email}`);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          {status === "loading" && <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />}
          {status === "success" && <CheckCircle2 className="w-10 h-10 mx-auto text-success" />}
          {status === "error" && <AlertCircle className="w-10 h-10 mx-auto text-destructive" />}
          <h1 className="text-xl font-bold">
            {status === "success" ? "Gmail Connected" : status === "error" ? "Connection failed" : "Connecting…"}
          </h1>
          <p className="text-sm text-muted-foreground break-words">{message}</p>
          {email && <p className="text-xs text-muted-foreground">Emails will be sent from this address.</p>}
          <Button className="w-full" onClick={() => navigate("/campaigns")}>
            Go to Campaigns
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GmailCallback;
