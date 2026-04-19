// OpenRouter - generate weekly content for fitness studios
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type = "post", topic = "fitness motivation", brandVoice = "energetic and supportive" } = await req.json().catch(() => ({}));
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

    const systemPrompt = `You are a content strategist for European fitness studios. Generate ${type} content in a ${brandVoice} tone. Return STRICT JSON ONLY with this exact shape: {"title": string, "body": string}. Body must be 2-4 sentences with 2-3 emojis and 3-5 hashtags. No markdown, no preamble, no code fences — output JSON only.`;
    const userPrompt = `Create a ${type} about: ${topic}`;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://powerkits12.lovable.app",
        "X-Title": "powerKits",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "OpenRouter credits exhausted." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("OpenRouter error:", aiRes.status, txt);
      throw new Error(`OpenRouter error ${aiRes.status}: ${txt}`);
    }

    const data = await aiRes.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";

    // Strip code fences if model wraps JSON
    const cleaned = String(raw).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    let parsed: { title: string; body: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON object substring
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); }
        catch { parsed = { title: `${type} idea`, body: cleaned }; }
      } else {
        parsed = { title: `${type} idea`, body: cleaned };
      }
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
