import { NextRequest, NextResponse } from "next/server";
import { evaluateEssay } from "@/lib/ieltsBandEngine";

const AI_API_URL = process.env.AI_API_URL || "";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";

const PARAGRAPH_GOALS: Record<number, string> = {
  1: "Introduction — paraphrase the Task 1 question in your own words. Must include chart type, subject, time/place/units.",
  2: "Overview — 1-2 sentences summarizing the most important overall patterns. NO specific numbers allowed.",
  3: "Body Paragraph 1 — detailed description of the most significant data group. Include start, end, peak/dip, key figures.",
  4: "Body Paragraph 2 — description of remaining groups with comparison structures (whereas/by contrast/meanwhile).",
};

function buildAIPrompt(
  paragraphNumber: number,
  userText: string,
  chartTitle: string,
  chartQuestion: string,
  keywords: string[]
): string {
  const goal = PARAGRAPH_GOALS[paragraphNumber] || "IELTS Task 1 paragraph";
  return `You are an IELTS Band 9 writing coach. Evaluate this Task 1 paragraph.

Chart: "${chartTitle}"
Task question: "${chartQuestion}"
Paragraph type: ${goal}
Expected keywords: ${keywords.join(", ")}

Student's paragraph:
"""
${userText}
"""

Evaluate it and respond with ONLY a JSON object (no markdown, no extra text):
{
  "band": number (estimate 0-9, can be .5),
  "strengths": string[] (2-3 specific positives),
  "issues": string[] (2-3 specific problems),
  "suggestions": string[] (2-3 actionable fixes),
  "keywordUsage": { "used": string[], "missing": string[] }
}`;
}

function parseAIResponse(text: string): EvaluationResult | null {
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
      keywordUsage: {
        used: Array.isArray(json.keywordUsage?.used) ? json.keywordUsage.used : [],
        missing: Array.isArray(json.keywordUsage?.missing) ? json.keywordUsage.missing : [],
      },
      source: "ai",
    };
  } catch {
    return null;
  }
}

interface EvaluationResult {
  band: number;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  keywordUsage: { used: string[]; missing: string[] };
  source: "ai" | "local";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paragraphNumber, userText, chartTitle, chartQuestion, keywords } = body as {
      paragraphNumber: number;
      userText: string;
      chartTitle: string;
      chartQuestion: string;
      keywords: string[];
    };

    if (!paragraphNumber || !userText || userText.trim().length < 10) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (AI_API_URL && AI_API_KEY) {
      const prompt = buildAIPrompt(paragraphNumber, userText, chartTitle, chartQuestion, keywords || []);

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
            max_tokens: 500,
            thinking: { type: "disabled" },
          }),
          signal: AbortSignal.timeout(15000),
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

    const bandResult = evaluateEssay(userText, `Task 1: ${chartTitle}\n${chartQuestion}`);
    const localResult: EvaluationResult = {
      band: bandResult.band,
      strengths: [],
      issues: [],
      suggestions: bandResult.tips.slice(0, 4),
      keywordUsage: { used: [], missing: [] },
      source: "local",
    };

    if (bandResult.diagnostics.wordCount < 30) {
      localResult.issues.push("段落过短，需要展开描述");
    }
    if (bandResult.diagnostics.complexSentencePct < 10) {
      localResult.issues.push("缺少复杂句，尝试使用定语从句或状语从句");
    }
    if (bandResult.subScores.lexicalResource.band < 6) {
      localResult.issues.push("词汇单一，尝试使用同义词替换");
    }
    if (bandResult.subScores.coherenceCohesion.band >= 7) {
      localResult.strengths.push("逻辑连贯性不错");
    }
    if (bandResult.diagnostics.typeTokenRatio > 0.6) {
      localResult.strengths.push("词汇多样性较好");
    }

    return NextResponse.json(localResult);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
