import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = process.env.AI_API_URL || "";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";

const PARAGRAPH_GOALS: Record<number, string> = {
  1: "Introduction — paraphrase the Task 1 question",
  2: "Overview — summarize main patterns",
  3: "Body Paragraph 1 — describe the most important group in detail",
  4: "Body Paragraph 2 — describe remaining groups with comparisons",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      paragraphNumber,
      chartTitle,
      chartQuestion,
      clues,
      keywords,
    } = body as {
      paragraphNumber: number;
      chartTitle: string;
      chartQuestion: string;
      clues: string[];
      keywords: string[];
    };

    if (!chartTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const goal = PARAGRAPH_GOALS[paragraphNumber] || "IELTS Task 1 paragraph";

    if (AI_API_URL && AI_API_KEY) {
      const prompt = `You are an IELTS Band 9 writing coach. Based on the chart below, generate exactly 10 useful words/phrases that would be appropriate for writing the "${goal}" paragraph of a Task 1 report.

Chart: "${chartTitle}"
Task question: "${chartQuestion}"
Keywords: ${(keywords || []).join(", ")}
Collected clues: ${(clues || []).join(", ")}

Respond with ONLY a JSON object (no markdown, no extra text):
{
  "expressions": string[] (exactly 10 English words or short phrases useful for this paragraph, mix of vocabulary, connectors, and expressions)
}

The expressions should be:
- Varied: include verbs, nouns, adverbs, connectors, and phrases
- Relevant to the specific chart data
- Appropriate for the paragraph type
- NOT basic/common words (skip "the", "a", "is", etc.)`;

      try {
        const res = await fetch(AI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 800,
            thinking: { type: "disabled" },
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || "";
          const parsed = parseAIResponse(content);
          if (parsed) return NextResponse.json(parsed);
        }
      } catch {
        // AI failed, fall through to local fallback
      }
    }

    // Local fallback — generic IELTS expressions
    const fallback = getFallbackExpressions(paragraphNumber, keywords, clues);
    return NextResponse.json({ expressions: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function parseAIResponse(text: string): { expressions: string[] } | null {
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*"expressions"[\s\S]*\}/);
    if (!jsonMatch) return null;
    const json = JSON.parse(jsonMatch[0]);
    if (Array.isArray(json.expressions) && json.expressions.length > 0) {
      return { expressions: json.expressions.slice(0, 10) };
    }
    return null;
  } catch {
    return null;
  }
}

function getFallbackExpressions(
  paragraphNumber: number,
  keywords: string[] = [],
  clues: string[] = []
): string[] {
  const allHints = [...new Set([...clues, ...keywords])];

  const byParagraph: Record<number, string[]> = {
    1: [
      "illustrates", "depicts", "shows", "presents",
      "information about", "regarding", "between ... and",
      "during the period", "overall trend", "measured in",
      "the chart compares", "data for",
    ],
    2: [
      "overall", "significant", "dramatic", "substantial",
      "while", "whereas", "in contrast", "the most notable",
      "experienced a decline", "saw an increase",
      "remained stable", "reached a peak",
    ],
    3: [
      "increased from", "decreased to", "rose sharply",
      "fell dramatically", "peaked at", "reached",
      "starting at", "ending at", "approximately",
      "accounted for", "followed by", "in terms of",
    ],
    4: [
      "whereas", "by contrast", "meanwhile", "similarly",
      "compared to", "however", "on the other hand",
      "a similar pattern", "slightly higher", "relatively lower",
      "remained constant", "followed a different trend",
    ],
  };

  let base = byParagraph[paragraphNumber] || byParagraph[1];
  if (!base) base = [];

  // Mix in some words from hints
  const hintWords = allHints.slice(0, 4);
  const combined = [...new Set([...base, ...hintWords])];

  // Shuffle and pick up to 10
  const shuffled = combined.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}
