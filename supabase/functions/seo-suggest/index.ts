// Lovable AI - SEO suggestions for fitness studios
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      mode = "keywords", // "keywords" | "optimize" | "titles"
      topic = "fitness studio",
      location = "Europe",
      language = "English",
      caption = "",
    } = await req.json().catch(() => ({}));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Missing LOVABLE_API_KEY");

    let systemPrompt = "";
    let userPrompt = "";
    let tool: any = null;

    if (mode === "keywords") {
      systemPrompt = `You are an SEO strategist for fitness studios. Generate 8 high-intent keyword ideas localized for ${location} in ${language}. Each keyword must include realistic monthly search volume (e.g. "2.4K", "850") and difficulty (Low|Medium|High) and trend (up|stable|down).`;
      userPrompt = `Topic: ${topic}. Location: ${location}.`;
      tool = {
        type: "function",
        function: {
          name: "return_keywords",
          description: "Return keyword suggestions",
          parameters: {
            type: "object",
            properties: {
              keywords: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyword: { type: "string" },
                    volume: { type: "string" },
                    difficulty: { type: "string", enum: ["Low", "Medium", "High"] },
                    trend: { type: "string", enum: ["up", "stable", "down"] },
                  },
                  required: ["keyword", "volume", "difficulty", "trend"],
                  additionalProperties: false,
                },
              },
            },
            required: ["keywords"],
            additionalProperties: false,
          },
        },
      };
    } else if (mode === "titles") {
      systemPrompt = `You are an SEO copywriter for fitness studios in ${location}. Write 6 click-worthy, SEO-friendly content titles (under 60 chars) in ${language}, plus a meta description (under 155 chars) for each.`;
      userPrompt = `Topic: ${topic}.`;
      tool = {
        type: "function",
        function: {
          name: "return_titles",
          description: "Return SEO titles and meta descriptions",
          parameters: {
            type: "object",
            properties: {
              titles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    metaDescription: { type: "string" },
                  },
                  required: ["title", "metaDescription"],
                  additionalProperties: false,
                },
              },
            },
            required: ["titles"],
            additionalProperties: false,
          },
        },
      };
    } else if (mode === "optimize") {
      systemPrompt = `You are a social SEO expert for fitness studios in ${location}. Rewrite captions in ${language} to maximize reach: keep voice, add a strong hook, 2-3 emojis, a clear CTA, and 6-10 niche hashtags. Return only the optimized caption text.`;
      userPrompt = `Original caption:\n"""${caption}"""\nTopic context: ${topic}.`;
    } else {
      throw new Error("Invalid mode");
    }

    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };
    if (tool) {
      body.tools = [tool];
      body.tool_choice = { type: "function", function: { name: tool.function.name } };
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    const msg = data.choices?.[0]?.message;

    if (tool) {
      const args = msg?.tool_calls?.[0]?.function?.arguments;
      const parsed = args ? JSON.parse(args) : {};
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = msg?.content ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-suggest error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
