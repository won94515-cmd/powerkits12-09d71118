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

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );
    const { data: conn } = await admin.from("discord_connections")
      .select("server_id").eq("user_id", userData.user.id).maybeSingle();
    if (!conn?.server_id) return new Response(JSON.stringify({ error: "Not connected" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

    const botToken = Deno.env.get("DISCORD_BOT_TOKEN")?.trim();
    if (!botToken) return new Response(JSON.stringify({ error: "Bot token not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

    const res = await fetch(`https://discord.com/api/v10/guilds/${conn.server_id}/channels`, {
      headers: { Authorization: `Bot ${botToken}` },
    });
    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: data?.message || "Discord API error" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

    // type 0 = text channel
    const channels = (data as any[])
      .filter((c) => c.type === 0)
      .map((c) => ({ id: c.id, name: c.name }));

    await admin.from("discord_connections").update({
      channels_cache: channels,
      channels_cached_at: new Date().toISOString(),
    }).eq("user_id", userData.user.id);

    return new Response(JSON.stringify({ channels }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
