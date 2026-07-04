import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = process.env.AI_API_URL || "";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expression } = body as { expression?: string };

    if (!expression || expression.trim().length === 0) {
      return NextResponse.json({ error: "Missing expression" }, { status: 400 });
    }

    const trimmed = expression.trim();

    if (AI_API_URL && AI_API_KEY) {
      const prompt = `You are an IELTS Band 9 writing coach.

Expression: "${trimmed}"

Provide the following in ONLY a JSON object (no markdown, no extra text):
{
  "translation": "Chinese translation of the expression",
  "examples": [
    "First example sentence using the expression (outside any specific chart topic).",
    "Second example sentence using the expression (outside any specific chart topic)."
  ]
}

Requirements:
- The examples should be general IELTS-style sentences, not tied to any specific chart.
- Each example must naturally use the expression.`;

      try {
        const res = await fetch(AI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 600,
            thinking: { type: "disabled" },
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || "";
          const parsed = parseAIResponse(content, trimmed);
          if (parsed) return NextResponse.json(parsed);
        }
      } catch {
        // AI failed, fall through to fallback
      }
    }

    // Fallback using MyMemory translation + generic examples
    const fallback = await getFallbackDetail(trimmed);
    return NextResponse.json(fallback);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

interface DetailResponse {
  translation: string;
  examples: string[];
}

function parseAIResponse(text: string, expression: string): DetailResponse | null {
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*"translation"[\s\S]*"examples"[\s\S]*\}/);
    if (!jsonMatch) return null;
    const json = JSON.parse(jsonMatch[0]);
    const translation = json.translation;
    const examples = Array.isArray(json.examples) ? json.examples : [];
    if (typeof translation === "string" && examples.length > 0) {
      return {
        translation,
        examples: examples.slice(0, 2),
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function getFallbackDetail(expression: string): Promise<DetailResponse> {
  let translation = "";
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(expression)}&langpair=en|zh&de=`,
      { signal: AbortSignal.timeout(10000) }
    );
    const data = await res.json();
    translation = data.responseData?.translatedText || "";
  } catch {
    translation = "";
  }

  if (!translation) {
    translation = expression;
  }

  const examples = [
    `Using "${expression}" in a sentence can make your writing more academic and precise.`,
    `Many IELTS candidates find that "${expression}" helps them compare ideas clearly.`,
  ];

  return { translation, examples };
}
