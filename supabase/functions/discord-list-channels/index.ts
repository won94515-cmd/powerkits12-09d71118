import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Discord text channel types
const TEXT_CHANNEL_TYPES = new Set([0, 5]); // 0 = GUILD_TEXT, 5 = GUILD_ANNOUNCEMENT

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: conn } = await supabase
      .from("discord_connections")
      .select("server_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!conn?.server_id) {
      return new Response(JSON.stringify({ error: "No Discord server connected" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const botToken = Deno.env.get("DISCORD_BOT_TOKEN")!;
    const dRes = await fetch(`https://discord.com/api/v10/guilds/${conn.server_id}/channels`, {
      headers: { Authorization: `Bot ${botToken}` },
    });

    if (!dRes.ok) {
      const errText = await dRes.text();
      console.error("Discord channels fetch failed:", dRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch channels", status: dRes.status, details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const allChannels = await dRes.json();
    const channels = allChannels
      .filter((c: any) => TEXT_CHANNEL_TYPES.has(c.type))
      .map((c: any) => ({ id: c.id, name: c.name, position: c.position, parent_id: c.parent_id }))
      .sort((a: any, b: any) => a.position - b.position);

    // Cache
    await supabase
      .from("discord_connections")
      .update({
        channels_cache: channels,
        channels_cached_at: new Date().toISOString(),
      })
      .eq("user_id", userData.user.id);

    return new Response(JSON.stringify({ channels }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
