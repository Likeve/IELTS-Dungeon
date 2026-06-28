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

function detectComparisonStructures(text: string): string[] {
  const patterns = [
    /\bwhereas\b/i,
    /\bby contrast\b/i,
    /\bmeanwhile\b/i,
    /\bin comparison\b/i,
    /\bcompared to\b/i,
    /\bcompared with\b/i,
    /\bsimilarly\b/i,
    /\bon the other hand\b/i,
    /\bhowever\b/i,
    /\bwhile\b/i,
  ];
  return patterns.filter((p) => p.test(text)).map((p) => p.source.replace(/\\b/g, "").replace(/\/i$/, ""));
}

function buildAIPrompt(
  paragraphNumber: number,
  userText: string,
  chartTitle: string,
  chartQuestion: string,
  keywords: string[]
): string {
  const goal = PARAGRAPH_GOALS[paragraphNumber] || "IELTS Task 1 paragraph";
  const comparisonStructures = detectComparisonStructures(userText);

  return `You are an IELTS Band 9 writing coach. Evaluate this Task 1 paragraph. IMPORTANT: strengths, issues, and suggestions MUST be written in Chinese (简体中文). The band8Rewrite MUST be in English.

Chart: "${chartTitle}"
Task question: "${chartQuestion}"
Paragraph type: ${goal}
Expected keywords: ${keywords.join(", ")}
Detected comparison structures: ${comparisonStructures.join(", ") || "none"}

Student's paragraph:
"""
${userText}
"""

Evaluate it and respond with ONLY a JSON object (no markdown, no extra text):
{
  "band": number (estimate 0-9, can be .5),
  "strengths": string[] (2-3 specific positives, write in Chinese),
  "issues": string[] (2-3 specific problems, write in Chinese),
  "suggestions": string[] (2-3 actionable fixes, write in Chinese),
  "keywordUsage": { "used": string[], "missing": string[] },
  "errorTags": string[] (choose from: ["data_missing", "weak_comparison", "weak_overview", "grammar_issue", "repetition", "off_topic", "too_short", "no_paraphrase"]),
  "band8Rewrite": string (a Band 8+ rewritten version of this paragraph in English, keeping the same information but improving vocabulary, grammar, and structure),
  "hasComparison": boolean (true if user used comparison structures correctly),
  "hasData": boolean (true if user included specific data/numbers)
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
      errorTags: Array.isArray(json.errorTags) ? json.errorTags : [],
      band8Rewrite: typeof json.band8Rewrite === "string" ? json.band8Rewrite : "",
      hasComparison: json.hasComparison === true,
      hasData: json.hasData === true,
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
  errorTags: string[];
  band8Rewrite: string;
  hasComparison: boolean;
  hasData: boolean;
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

    const comparisonStructures = detectComparisonStructures(userText);
    const hasData = /\b\d+(\.\d+)?%?\b/.test(userText);

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
            max_tokens: 2000,
            thinking: { type: "disabled" },
          }),
          signal: AbortSignal.timeout(20000),
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

    // Local evaluation fallback
    const bandResult = evaluateEssay(userText, `Task 1: ${chartTitle}\n${chartQuestion}`);
    const errorTags: string[] = [];
    if (userText.trim().split(/\s+/).length < 20) errorTags.push("too_short");
    if (!hasData && paragraphNumber >= 3) errorTags.push("data_missing");
    if (comparisonStructures.length === 0 && paragraphNumber === 4) errorTags.push("weak_comparison");
    if (paragraphNumber === 1 && userText.toLowerCase().includes(chartTitle.toLowerCase().slice(0, 15))) errorTags.push("no_paraphrase");

    const localResult: EvaluationResult = {
      band: bandResult.band,
      strengths: [],
      issues: errorTags.map(tagToIssue),
      suggestions: bandResult.tips.slice(0, 4),
      keywordUsage: { used: [], missing: [] },
      errorTags,
      band8Rewrite: "",
      hasComparison: comparisonStructures.length > 0,
      hasData,
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

function tagToIssue(tag: string): string {
  const map: Record<string, string> = {
    data_missing: "缺少具体数据支撑",
    weak_comparison: "缺少对比结构",
    weak_overview: "Overview 段落缺少全局概括",
    grammar_issue: "存在语法错误",
    repetition: "词汇或句式重复",
    off_topic: "偏离图表主题",
    too_short: "段落过短，需要展开",
    no_paraphrase: "未改写原题，请用同义词替换",
  };
  return map[tag] || tag;
}
