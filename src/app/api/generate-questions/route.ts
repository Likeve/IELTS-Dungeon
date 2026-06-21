import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = process.env.AI_API_URL || "";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";

interface GeneratedStage {
  stage: number;
  label: string;
  prompt: string;
  instruction: string;
  questions: { id: string; question: string }[];
  keywords: string[];
  tips: string[];
}

const STAGE_CONFIG: Record<number, { label: string; goal: string; minQuestions: number; questionTypes: string }> = {
  1: {
    label: "Level 1: Decode",
    goal: "Train users to paraphrase the Task 1 question.",
    minQuestions: 2,
    questionTypes: `Generate 2-3 adaptive questions. Required question types:
  - What does the chart show?
  - What is being compared / what are the categories?
  - What is the time period or location?
  All questions must be based on the chart data.`,
  },
  2: {
    label: "Level 2: Pattern Detection",
    goal: "Extract global patterns. No specific numbers allowed in the overview.",
    minQuestions: 2,
    questionTypes: `Generate at least 2 questions:
  - Q1: Identify the MOST significant change / highest value / dominant trend
  - Q2: Identify the LEAST significant change / lowest value / stable element
  Optional (if chart complexity is high):
  - Q3: Overall trend direction (increase/decrease/fluctuation)
  - Q4: Any visible shift in ranking or dominance`,
  },
  3: {
    label: "Level 3: Evidence Block A",
    goal: "Describe the FIRST set of specific data points with numbers.",
    minQuestions: 2,
    questionTypes: `Select ONE meaningful cluster of data. Generate 2-3 questions:
  - Q1: Describe first key data point (value + time/category)
  - Q2: Compare it with another relevant point
  - Q3 (optional): Explain change direction or magnitude
  Must include at least: 1 exact data point question, 1 comparison question.`,
  },
  4: {
    label: "Level 4: Evidence Block B",
    goal: "Describe remaining important data with comparison structures.",
    minQuestions: 3,
    questionTypes: `Generate 3-4 adaptive questions:
  - Q1: Describe second major dataset
  - Q2: Compare with first dataset
  - Q3: Identify exceptions / anomalies / secondary trend
  - Q4 (optional): Highlight minor category behavior
  No repetition of Details 1 data. At least 1 comparison sentence required.`,
  },
};

function dataSummary(item: ChartInfo): string {
  const d = item.data;
  if (item.type === "line" && d?.series) {
    return `Line chart with ${d.labels.length} time points (${d.labels.join(", ")}). Series: ${d.series.map((s: any) => `${s.name} [${s.values.join(" → ")}]`).join("; ")}${item.xLabel ? ` (X: ${item.xLabel})` : ""}${item.yLabel ? ` (Y: ${item.yLabel})` : ""}`;
  }
  if (item.type === "bar" && d?.labels) {
    return `Bar chart with ${d.labels.length} categories: ${d.labels.map((l: string, i: number) => `${l}=${(d as any).values?.[i] ?? "?"}`).join(", ")}${item.xLabel ? ` (X: ${item.xLabel})` : ""}${item.yLabel ? ` (Y: ${item.yLabel})` : ""}`;
  }
  if (item.type === "pie" && d?.segments) {
    return `Pie chart with ${d.segments.length} segments: ${d.segments.map((s: any) => `${s.label}=${s.value}%`).join(", ")}`;
  }
  if (item.type === "table" && d?.headers) {
    return `Table: ${d.headers.join(" | ")}. ${d.rows.length} rows.`;
  }
  if ((item.type === "map" || item.type === "flowchart") && d?.nodes) {
    return `${item.type === "map" ? "Map" : "Flowchart"} with ${d.nodes.length} nodes: ${d.nodes.map((n: any) => n.label.replace(/\n/g, " ")).join(", ")}. ${d.edges?.length || 0} connections.`;
  }
  return "Chart data summary unavailable.";
}

interface ChartInfo {
  type: string;
  title: string;
  question: string;
  data: any;
  xLabel?: string;
  yLabel?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chartInfo, stage } = body as { chartInfo: ChartInfo; stage: number };

    if (!stage || stage < 1 || stage > 4 || !chartInfo?.title) {
      return NextResponse.json({ error: "Invalid request: chartInfo and stage required" }, { status: 400 });
    }

    const cfg = STAGE_CONFIG[stage];

    if (AI_API_URL && AI_API_KEY) {
      const prompt = `You are an IELTS Band 9 writing coach. Generate adaptive questions for a Task 1 chart writing game.

Chart type: ${chartInfo.type}
Chart title: "${chartInfo.title}"
Task question: "${chartInfo.question}"
Chart data summary: ${dataSummary(chartInfo)}

STAGE ${stage}: ${cfg.label}
Goal: ${cfg.goal}

${cfg.questionTypes}

Also provide:
- Keywords (4-6 chart-specific vocabulary/key terms for this stage)
- Tips (2-3 writing tips specific to this stage and chart)

Respond with ONLY a JSON object (no markdown, no extra text):
{
  "prompt": "short stage title in Chinese",
  "instruction": "one sentence describing what to do in Chinese",
  "questions": [{ "id": "q1", "question": "..." }, { "id": "q2", "question": "..." }],
  "keywords": ["word1", "word2", ...],
  "tips": ["tip1", "tip2", ...]
}

All questions MUST be in Chinese and SPECIFIC to this chart's data - no generic questions.
The prompt and instruction must also be in Chinese.`;

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
            temperature: 0.5,
            max_tokens: 1000,
            thinking: { type: "disabled" },
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || "";
          const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
          const jsonMatch = cleaned.match(/\{[\s\S]*"questions"[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed.questions) && parsed.questions.length >= cfg.minQuestions) {
              return NextResponse.json({
                ...parsed,
                stage,
                label: cfg.label,
                source: "ai",
              });
            }
          }
        }
      } catch {
        // fall back to local
      }
    }

    // Local fallback — generate from paragraph data
    const localKeywords = chartInfo.type === "line" ? ["趋势", "上升", "下降", "波动", "峰值", "稳定"] :
      chartInfo.type === "bar" ? ["最高", "最低", "差距", "排名", "显著", "对比"] :
      chartInfo.type === "pie" ? ["占比", "主要", "构成", "比例", "分别", "合计"] :
      ["数据", "对比", "变化", "特征", "情况", "趋势"];

    const localTips = stage === 1 ? ["用同义词改写原题", "必须包含图表类型、对象、时间"] :
      stage === 2 ? ["禁止写具体数字", "只写1-2句话概括全局"] :
      stage === 3 ? ["包含起点→终点数值", "描述峰值或大幅变化"] :
      ["使用对比结构（whereas/by contrast）", "覆盖剩余类别"];

    return NextResponse.json({
      prompt: cfg.label,
      instruction: cfg.goal,
      questions: [
        { id: "q1", question: stage === 1 ? "这个图表展示了什么内容？" : stage === 2 ? "图表中最显著的变化是什么？" : "第一组关键数据是什么？" },
        { id: "q2", question: stage === 1 ? "图表涉及的时间范围/地点是什么？" : stage === 2 ? "最低值/最稳定的部分是什么？" : "这组数据与其他数据相比如何？" },
        { id: "q3", question: stage < 3 ? "图表中的主要对比对象是什么？" : "如何描述这组数据的变化趋势？" },
      ],
      keywords: localKeywords.slice(0, 5),
      tips: localTips,
      stage,
      label: cfg.label,
      source: "local",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
