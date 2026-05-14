import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const RATE_LIMIT_PER_HOUR = 50;
const RATE_LIMIT_PER_DAY = 200;

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function base64Url(str: string) {
  // UTF-8 safe base64url
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildMime(opts: {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml: boolean;
}) {
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to.join(", ")}`,
    opts.cc?.length ? `Cc: ${opts.cc.join(", ")}` : null,
    opts.bcc?.length ? `Bcc: ${opts.bcc.join(", ")}` : null,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(opts.subject)))}?=`,
    "MIME-Version: 1.0",
    `Content-Type: ${opts.isHtml ? "text/html" : "text/plain"}; charset=UTF-8`,
    "Content-Transfer-Encoding: 7bit",
  ].filter(Boolean).join("\r\n");
  return `${headers}\r\n\r\n${opts.body}`;
}

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || "Token refresh failed");
  return { access_token: data.access_token as string, expires_in: data.expires_in as number };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { to, cc, bcc, subject, body: emailBody, isHtml, contentItemId } = body ?? {};

    const toArr: string[] = Array.isArray(to) ? to : typeof to === "string" ? [to] : [];
    const ccArr: string[] = Array.isArray(cc) ? cc : cc ? [cc] : [];
    const bccArr: string[] = Array.isArray(bcc) ? bcc : bcc ? [bcc] : [];

    if (!toArr.length || !subject || !emailBody) {
      return new Response(JSON.stringify({ error: "to, subject and body are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    for (const e of [...toArr, ...ccArr, ...bccArr]) {
      if (!isValidEmail(e)) {
        return new Response(JSON.stringify({ error: `Invalid email: ${e}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    if (subject.length > 998 || emailBody.length > 500_000) {
      return new Response(JSON.stringify({ error: "Subject or body too long" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Rate limiting
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: hourCount } = await admin
      .from("email_send_logs").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).eq("status", "sent").gte("created_at", oneHourAgo);
    const { count: dayCount } = await admin
      .from("email_send_logs").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).eq("status", "sent").gte("created_at", oneDayAgo);
    if ((hourCount ?? 0) >= RATE_LIMIT_PER_HOUR || (dayCount ?? 0) >= RATE_LIMIT_PER_DAY) {
      return new Response(JSON.stringify({ error: "Send limit reached. Try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: conn, error: connErr } = await admin
      .from("gmail_connections").select("*").eq("user_id", user.id).maybeSingle();
    if (connErr || !conn || !conn.is_active) {
      return new Response(JSON.stringify({ error: "Gmail not connected" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let accessToken = conn.access_token as string;
    if (new Date(conn.token_expires_at).getTime() <= Date.now()) {
      try {
        const refreshed = await refreshAccessToken(conn.refresh_token);
        accessToken = refreshed.access_token;
        await admin.from("gmail_connections").update({
          access_token: accessToken,
          token_expires_at: new Date(Date.now() + (refreshed.expires_in - 60) * 1000).toISOString(),
        }).eq("user_id", user.id);
      } catch (e) {
        await admin.from("gmail_connections").update({
          is_active: false, last_error: (e as Error).message,
        }).eq("user_id", user.id);
        return new Response(JSON.stringify({ error: "Gmail access expired. Please reconnect.", needsReconnect: true }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const mime = buildMime({
      from: conn.email, to: toArr, cc: ccArr, bcc: bccArr, subject, body: emailBody, isHtml: !!isHtml,
    });
    const raw = base64Url(mime);

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw }),
    });
    const sendData = await sendRes.json();

    if (!sendRes.ok) {
      await admin.from("email_send_logs").insert({
        user_id: user.id, from_email: conn.email,
        to_emails: toArr, cc_emails: ccArr, bcc_emails: bccArr,
        subject, body_preview: emailBody.slice(0, 500), is_html: !!isHtml,
        status: "failed", error_message: JSON.stringify(sendData), content_item_id: contentItemId ?? null,
      });
      const needsReconnect = sendRes.status === 401 || sendRes.status === 403;
      if (needsReconnect) {
        await admin.from("gmail_connections").update({ is_active: false, last_error: JSON.stringify(sendData) }).eq("user_id", user.id);
      }
      return new Response(JSON.stringify({ error: sendData.error?.message || "Gmail send failed", details: sendData, needsReconnect }), {
        status: sendRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("email_send_logs").insert({
      user_id: user.id, from_email: conn.email,
      to_emails: toArr, cc_emails: ccArr, bcc_emails: bccArr,
      subject, body_preview: emailBody.slice(0, 500), is_html: !!isHtml,
      status: "sent", gmail_message_id: sendData.id, content_item_id: contentItemId ?? null,
    });

    return new Response(JSON.stringify({ success: true, messageId: sendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
