// Lovable AI - generate weekly content for fitness studios
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type = "post", topic = "fitness motivation", brandVoice = "energetic and supportive" } = await req.json().catch(() => ({}));
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Missing LOVABLE_API_KEY");

    const systemPrompt = `You are a content strategist for European fitness studios. Generate ${type} content in a ${brandVoice} tone. Return strict JSON: {"title": string, "body": string}. Body should be 2-4 sentences with 2-3 emojis and 3-5 hashtags. No markdown, no preamble.`;
    const userPrompt = `Create a ${type} about: ${topic}`;

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
    let parsed: { title: string; body: string };
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
