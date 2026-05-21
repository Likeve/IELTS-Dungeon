"use client";

import React, { useState, useMemo } from "react";
import { Brain, Zap, Target, TrendingUp, Lightbulb } from "lucide-react";
import { evaluateEssay, BandResult } from "@/lib/ieltsBandEngine";

type ThoughtNode = {
  id: string;
  name: string;
  label: string;
  weight: number;
  ideas: string[];
  synergy: string[];
};

const THOUGHT_NODES: ThoughtNode[] = [
  {
    id: "education",
    name: "Education",
    label: "教育",
    weight: 0.82,
    ideas: ["equal opportunity", "critical thinking", "online learning", "teacher role"],
    synergy: ["technology", "society"],
  },
  {
    id: "technology",
    name: "Technology",
    label: "科技",
    weight: 0.91,
    ideas: ["AI automation", "privacy concern", "job displacement", "efficiency"],
    synergy: ["economy", "education"],
  },
  {
    id: "economy",
    name: "Economy",
    label: "经济",
    weight: 0.63,
    ideas: ["economic burden", "productivity growth", "labor market", "inequality"],
    synergy: ["technology", "government"],
  },
  {
    id: "environment",
    name: "Environment",
    label: "环境",
    weight: 0.58,
    ideas: ["sustainability", "climate change", "pollution control", "green policy"],
    synergy: ["government", "economy"],
  },
  {
    id: "society",
    name: "Society",
    label: "社会",
    weight: 0.71,
    ideas: ["social cohesion", "cultural shift", "public health", "urban planning"],
    synergy: ["education", "government"],
  },
  {
    id: "government",
    name: "Government",
    label: "政府",
    weight: 0.55,
    ideas: ["policy making", "regulation", "public funding", "international cooperation"],
    synergy: ["economy", "environment"],
  },
];

const WRITING_PROMPTS = [
  {
    question: "Should AI replace teachers in modern education?",
    topic: "Technology & Education",
  },
  {
    question: "Is globalization beneficial for developing countries?",
    topic: "Economy & Society",
  },
  {
    question: "To what extent should governments fund renewable energy?",
    topic: "Government & Environment",
  },
  {
    question: "Does social media have a negative impact on mental health?",
    topic: "Technology & Society",
  },
];

function bandColor(band: number): string {
  if (band >= 8) return "text-violet-600";
  if (band >= 7) return "text-emerald-600";
  if (band >= 6) return "text-amber-600";
  if (band >= 5) return "text-orange-600";
  if (band >= 3) return "text-rose-600";
  return "text-red-600";
}

function bandBg(band: number): string {
  if (band >= 8) return "bg-violet-50 border-violet-200";
  if (band >= 7) return "bg-emerald-50 border-emerald-200";
  if (band >= 6) return "bg-amber-50 border-amber-200";
  if (band >= 5) return "bg-orange-50 border-orange-200";
  if (band >= 3) return "bg-rose-50 border-rose-200";
  return "bg-red-50 border-red-200";
}

function bandBarColor(band: number): string {
  if (band >= 8) return "bg-violet-500";
  if (band >= 7) return "bg-emerald-500";
  if (band >= 6) return "bg-amber-500";
  if (band >= 5) return "bg-orange-500";
  if (band >= 3) return "bg-rose-500";
  return "bg-red-500";
}

function bandLabel(band: number): string {
  if (band >= 9) return "Expert";
  if (band >= 8) return "Very Good";
  if (band >= 7) return "Good";
  if (band >= 6) return "Competent";
  if (band >= 5) return "Modest";
  if (band >= 4) return "Limited";
  if (band >= 3) return "Extremely Limited";
  if (band >= 2) return "Incomplete";
  return "Virtually None";
}

const dimensionConfig: Record<string, { label: string; desc: string }> = {
  taskResponse: { label: "Task Response", desc: "题目回应 · 立场清晰 · 论证充分" },
  coherenceCohesion: { label: "Coherence & Cohesion", desc: "逻辑连贯 · 段间衔接 · 连接词" },
  lexicalResource: { label: "Lexical Resource", desc: "词汇多样性 · 学术词汇 · 搭配" },
  grammaticalRange: { label: "Grammatical Range", desc: "句式变化 · 复杂度 · 准确性" },
};

export default function WritingForge() {
  const [text, setText] = useState(
    "Artificial intelligence has significantly transformed modern education by introducing adaptive learning platforms that personalise content according to each student's unique needs. These systems analyse performance data in real time, allowing educators to identify learning gaps and intervene promptly.\n\nOn the one hand, AI-driven tools reduce administrative burdens and enable teachers to focus on creative pedagogy. For example, automated grading systems can evaluate essays within seconds, providing instant feedback that would otherwise take hours.\n\nHowever, the claim that AI should fully replace teachers overlooks the irreplaceable value of human connection. Education is not merely the transmission of knowledge; it is a deeply social process that involves mentorship, empathy, and the cultivation of critical thinking \u2014 qualities that no algorithm can authentically replicate."
  );
  const [activeNodes, setActiveNodes] = useState<Set<string>>(
    new Set(["education", "technology"])
  );
  const [promptIndex, setPromptIndex] = useState(0);
  const [showTips, setShowTips] = useState(true);

  const prompt = WRITING_PROMPTS[promptIndex];
  const result: BandResult = useMemo(() => evaluateEssay(text, prompt.question), [text, prompt.question]);

  const { subScores, diagnostics } = result;
  const criteria = [
    { key: "taskResponse" as const, ...subScores.taskResponse },
    { key: "coherenceCohesion" as const, ...subScores.coherenceCohesion },
    { key: "lexicalResource" as const, ...subScores.lexicalResource },
    { key: "grammaticalRange" as const, ...subScores.grammaticalRange },
  ];

  const toggleNode = (id: string) => {
    setActiveNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const cyclePrompt = () => {
    setPromptIndex((i) => (i + 1) % WRITING_PROMPTS.length);
  };

  const activeSynergies = useMemo(() => {
    const names = new Set<string>();
    for (const n of THOUGHT_NODES) {
      if (!activeNodes.has(n.id)) continue;
      for (const s of n.synergy) {
        if (!activeNodes.has(s)) names.add(s);
      }
    }
    return [...names];
  }, [activeNodes]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Thought Network */}
        <div className="lg:w-[280px] shrink-0 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-1">
              <Brain className="w-5 h-5 text-violet-500" />
              思维场
            </div>
            <p className="text-xs text-gray-400 mb-4">Cognitive Field · 激活思维节点</p>

            <div className="space-y-2">
              {THOUGHT_NODES.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                    activeNodes.has(node.id)
                      ? "bg-violet-50 border-violet-200 shadow-sm"
                      : "bg-gray-50/50 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-gray-800">
                      {node.name}
                      <span className="ml-1 text-xs text-gray-400 font-normal">{node.label}</span>
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        activeNodes.has(node.id) ? "text-violet-500" : "text-gray-400"
                      }`}
                    >
                      {Math.round(node.weight * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {node.ideas.slice(0, 2).map((idea) => (
                      <span
                        key={idea}
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          activeNodes.has(node.id)
                            ? "bg-white border-violet-200 text-violet-700"
                            : "bg-gray-100 border-gray-100 text-gray-400"
                        }`}
                      >
                        {idea}
                      </span>
                    ))}
                    {node.ideas.length > 2 && (
                      <span className="text-[10px] text-gray-300">+{node.ideas.length - 2}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {activeSynergies.length > 0 && (
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
              <div className="flex items-center gap-2 font-bold text-violet-800 mb-2 text-sm">
                <Zap className="w-4 h-4" />
                潜在连接
              </div>
              <p className="text-xs text-violet-600">
                激活以下维度可获得交叉论点：{activeSynergies.join("、")}
              </p>
            </div>
          )}
        </div>

        {/* Main Area */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Prompt Header */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{prompt.question}</h2>
                <p className="text-sm text-gray-500 mt-1">{prompt.topic}</p>
              </div>
              <button
                type="button"
                onClick={cyclePrompt}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all"
              >
                换题
              </button>
            </div>
          </div>

          {/* Band Score Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Band Score</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTips((v) => !v)}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                  showTips ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                {showTips ? "隐藏建议" : "显示建议"}
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-end gap-6 mb-5">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Overall Band</div>
                  <div className={`text-5xl font-black tracking-tight ${bandColor(result.band)}`}>
                    {result.band.toFixed(1)}
                  </div>
                  <div className={`text-sm font-bold mt-1 ${bandColor(result.band)}`}>
                    {bandLabel(result.band)}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {criteria.map((c) => {
                    const config = dimensionConfig[c.key];
                    return (
                      <div
                        key={c.key}
                        className={`rounded-xl border px-3 py-3 ${bandBg(c.band)}`}
                      >
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                          {config.label}
                        </div>
                        <div className={`text-xl font-black ${bandColor(c.band)}`}>
                          {c.band.toFixed(1)}
                        </div>
                        <div className="mt-1 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bandBarColor(c.band)} transition-all duration-500`}
                            style={{ width: `${Math.min(100, c.score)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Criterion Breakdown */}
              <details className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <summary className="font-bold cursor-pointer text-sm text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  四维详细诊断
                </summary>
                <div className="mt-4 space-y-4">
                  {criteria.map((c) => {
                    const config = dimensionConfig[c.key];
                    return (
                      <div key={c.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-gray-700">{config.label}</span>
                          <span className="text-xs text-gray-400">{config.desc}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bandBarColor(c.band)} transition-all duration-500`}
                            style={{ width: `${Math.min(100, c.score)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                          <span>0</span>
                          <span>Band {c.band.toFixed(1)}</span>
                          <span>9</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-4">
                {[
                  { label: "词数", value: diagnostics.wordCount, target: 250 },
                  { label: "句数", value: diagnostics.sentenceCount, target: null },
                  { label: "段落", value: diagnostics.paragraphCount, target: 4 },
                  { label: "词汇多样性", value: diagnostics.typeTokenRatio + "%", target: null },
                  { label: "学术词", value: diagnostics.academicWordPct + "%", target: null },
                  { label: "复杂句", value: diagnostics.complexSentencePct + "%", target: null },
                  { label: "平均句长", value: diagnostics.avgSentenceLength, target: null },
                  { label: "连接词", value: diagnostics.connectorTotal, target: null },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-gray-100 bg-gray-50/50 px-2 py-2 text-center"
                  >
                    <div className="text-[10px] text-gray-400">{stat.label}</div>
                    <div
                      className={`text-sm font-bold ${
                        stat.target && (stat.value as number) < stat.target
                          ? "text-rose-500"
                          : "text-gray-700"
                      }`}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Writing Area */}
          <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              className="w-full min-h-[360px] rounded-xl bg-white p-5 text-base leading-9 text-gray-800 placeholder:text-gray-300 focus:outline-none resize-y"
              placeholder="在此撰写你的雅思大作文…&#10;&#10;TIPS: 引言→主体段1→主体段2→结论"
            />
          </div>

          {/* Tips Panel */}
          {showTips && result.tips.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-amber-800 text-sm">提升建议</span>
              </div>
              <ul className="space-y-1.5">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Writing Guide */}
          <details className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <summary className="font-bold cursor-pointer text-gray-700 text-sm">
              写作指导
            </summary>
            <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
              <li>先激活左侧思维节点，获取相关论点词汇</li>
              <li>Task 2 建议 4 段结构：引言（含立场）→ 主体段1 → 主体段2 → 结论</li>
              <li>每段以主题句开头，然后用具体例子和解释支撑</li>
              <li>使用 however/therefore/moreover/for example 等连接词提升连贯性</li>
              <li>善用定语从句（which/who/that）和状语从句（because/although/while）增加句式变化</li>
              <li>Band 7+ 需要 250+ 词、清晰立场、多句式、学术词汇</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
