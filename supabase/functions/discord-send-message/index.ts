import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
    );
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

    const { channel_id, message } = await req.json();
    if (!channel_id || !message) return new Response(JSON.stringify({ error: "Missing channel_id or message" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

    const botToken = Deno.env.get("DISCORD_BOT_TOKEN")?.trim();
    if (!botToken) return new Response(JSON.stringify({ error: "Bot token not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

    const res = await fetch(`https://discord.com/api/v10/channels/${channel_id}/messages`, {
      method: "POST",
      headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: data?.message || "Discord API error" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
