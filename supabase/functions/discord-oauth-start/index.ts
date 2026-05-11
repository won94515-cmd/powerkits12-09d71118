// Returns the Discord OAuth authorize URL using the server-side Client ID.
// This prevents drift between frontend and backend client IDs.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCOPES = "bot applications.commands identify";
// VIEW_CHANNEL + SEND_MESSAGES + EMBED_LINKS + READ_MESSAGE_HISTORY + MANAGE_MESSAGES = 93184
const PERMISSIONS = "93184";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { redirect_uri } = await req.json();
    const clientId = Deno.env.get("DISCORD_CLIENT_ID")?.trim();
    if (!clientId) {
      return new Response(JSON.stringify({ error: "DISCORD_CLIENT_ID not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!redirect_uri) {
      return new Response(JSON.stringify({ error: "Missing redirect_uri" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const u = new URL("https://discord.com/api/oauth2/authorize");
    u.searchParams.set("client_id", clientId);
    u.searchParams.set("permissions", PERMISSIONS);
    u.searchParams.set("scope", SCOPES);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("redirect_uri", redirect_uri);
    return new Response(JSON.stringify({ url: u.toString(), client_id: clientId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
