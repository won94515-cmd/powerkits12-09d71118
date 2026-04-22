// Lovable AI - generate brand-aware content (posts, ebooks, pamphlets) for fitness studios
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VOICE_DESCRIPTIONS: Record<string, string> = {
  motivational: "energetic, uplifting, action-oriented — push the reader to take the next step",
  professional: "clean, trustworthy, authoritative — facts first, expert tone",
  friendly: "approachable, casual, supportive — like a coach talking to a friend",
  bold: "strong, direct, challenging — no fluff, high-impact statements",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      type = "post",
      topic = "fitness motivation",
      brandVoice = "motivational",
      studioName = "",
      tagline = "",
      brandingEnabled = true,
      category = "",
    } = body as Record<string, any>;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Missing LOVABLE_API_KEY");

    const voiceDesc = brandingEnabled
      ? (VOICE_DESCRIPTIONS[brandVoice] || VOICE_DESCRIPTIONS.motivational)
      : "neutral, informative";

    const brandLine = brandingEnabled && studioName
      ? `The studio is "${studioName}"${tagline ? ` (tagline: "${tagline}")` : ""}. Naturally weave the studio name into the content where it fits.`
      : "";

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "ebook" || type === "pamphlet") {
      systemPrompt = `You are a content creator for European fitness studios writing a ${type}. Tone: ${voiceDesc}. ${brandLine}
Return STRICT JSON: {"title": string, "description": string, "body": string, "pages_count": number}.
- title: punchy, max 8 words.
- description: 1-2 sentence hook for the cover.
- body: full ${type} content, 600-1200 words, structured with markdown headings (## Section), bullet points, and 2-3 short paragraphs per section. Include an intro, 3-5 main sections, and a conclusion CTA.
- pages_count: realistic estimate (e.g. 6-14 for a pamphlet, 10-30 for an ebook).
No preamble, no markdown fences.`;
      userPrompt = `Write a ${type} about: ${topic}${category ? ` (category: ${category})` : ""}.`;
    } else {
      systemPrompt = `You are a content strategist for European fitness studios. Generate ${type} content. Tone: ${voiceDesc}. ${brandLine}
Return strict JSON: {"title": string, "body": string}. Body should be 2-4 sentences with 2-3 emojis and 3-5 hashtags. No markdown, no preamble.`;
      userPrompt = `Create a ${type} about: ${topic}`;
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      throw new Error(`AI gateway error: ${txt}`);
    }

    const data = await aiRes.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { title: `${type} idea`, body: raw };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
