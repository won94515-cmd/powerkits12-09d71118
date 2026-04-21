import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const body = await req.json();
    const { channel_id, message } = body;

    if (!channel_id || !message || typeof message !== "string" || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Invalid channel_id or message (max 2000 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Verify channel belongs to user's connected guild
    const { data: conn } = await supabase
      .from("discord_connections")
      .select("server_id, channels_cache")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!conn?.server_id) {
      return new Response(JSON.stringify({ error: "No Discord server connected" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cache = (conn.channels_cache as any[]) || [];
    const allowed = cache.some((c) => c.id === channel_id);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Channel not in your server's cached list. Refresh channels first." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const botToken = Deno.env.get("DISCORD_BOT_TOKEN")!;
    const dRes = await fetch(`https://discord.com/api/v10/channels/${channel_id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    });

    if (!dRes.ok) {
      const errText = await dRes.text();
      console.error("Discord send failed:", dRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Discord send failed", status: dRes.status, details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sent = await dRes.json();
    return new Response(JSON.stringify({ success: true, message_id: sent.id }), {
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
