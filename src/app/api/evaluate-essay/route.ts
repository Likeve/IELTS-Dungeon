import { NextRequest, NextResponse } from "next/server";
import { evaluateEssay } from "@/lib/ieltsBandEngine";

const AI_API_URL = process.env.AI_API_URL || "";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";

function buildFullEssayPrompt(
  paragraphs: string[],
  chartTitle: string,
  chartQuestion: string
): string {
  const essay = paragraphs.filter(Boolean).join("\n\n");
  return `You are an IELTS Band 9 writing coach. Evaluate this complete IELTS Task 1 report.

Chart: "${chartTitle}"
Task question: "${chartQuestion}"

Student's full report:
"""
${essay}
"""

Evaluate the complete report and respond with ONLY a JSON object (no markdown, no extra text):
{
  "band": number (overall band 0-9, can be .5),
  "strengths": string[] (3-4 specific positives),
  "issues": string[] (3-4 specific problems),
  "suggestions": string[] (3-4 actionable fixes in Chinese),
  "errorTags": string[] (choose from: ["data_missing", "weak_comparison", "weak_overview", "grammar_issue", "repetition", "off_topic", "too_short", "no_paraphrase", "poor_cohesion"]),
  "band8Rewrite": string (a Band 8+ rewritten version of the full report, keeping the same information but improving vocabulary, grammar, and structure),
  "paragraphBands": number[] (band score for each of the 4 paragraphs in order)
}`;
}

function parseAIResponse(text: string): EssayEvaluationResult | null {
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*"band"[\s\S]*\}/);
    if (!jsonMatch) return null;
    const json = JSON.parse(jsonMatch[0]);
    if (typeof json.band !== "number") return null;
    return {
      band: json.band,
      strengths: Array.isArray(json.strengths) ? json.strengths : [],
      issues: Array.isArray(json.issues) ? json.issues : [],
      suggestions: Array.isArray(json.suggestions) ? json.suggestions : [],
      errorTags: Array.isArray(json.errorTags) ? json.errorTags : [],
      band8Rewrite: typeof json.band8Rewrite === "string" ? json.band8Rewrite : "",
      paragraphBands: Array.isArray(json.paragraphBands) ? json.paragraphBands : [],
      source: "ai",
    };
  } catch {
    return null;
  }
}

interface EssayEvaluationResult {
  band: number;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  errorTags: string[];
  band8Rewrite: string;
  paragraphBands: number[];
  source: "ai" | "local";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paragraphs, chartTitle, chartQuestion } = body as {
      paragraphs: string[];
      chartTitle: string;
      chartQuestion: string;
    };

    if (!Array.isArray(paragraphs) || paragraphs.length < 4 || paragraphs.some((p) => !p || p.trim().length < 10)) {
      return NextResponse.json({ error: "All four paragraphs are required" }, { status: 400 });
    }

    const fullText = paragraphs.filter(Boolean).join("\n\n");

    if (AI_API_URL && AI_API_KEY) {
      const prompt = buildFullEssayPrompt(paragraphs, chartTitle, chartQuestion);

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
              { role: "user", content: `You are an IELTS writing coach. Always respond with valid JSON only.\n\n${prompt}` },
            ],
            temperature: 0.3,
            max_tokens: 3000,
            thinking: { type: "disabled" },
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || "";
          const result = parseAIResponse(content);
          if (result) return NextResponse.json(result);
        }
      } catch {
        // AI call failed, fall back to local
      }
    }

    const localResult = evaluateEssay(fullText, `Task 1: ${chartTitle}\n${chartQuestion}`);
    const essayResult: EssayEvaluationResult = {
      band: localResult.band,
      strengths: localResult.subScores.lexicalResource.band >= 6 ? ["词汇多样性较好"] : [],
      issues: localResult.tips.slice(0, 4),
      suggestions: localResult.tips.slice(0, 4),
      errorTags: [],
      band8Rewrite: "",
      paragraphBands: paragraphs.map((p) => evaluateEssay(p, chartQuestion).band),
      source: "local",
    };

    return NextResponse.json(essayResult);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
