"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, BarChart3, PieChart, Table2, Map, GitBranch, ChevronLeft, ChevronRight,
  Zap, CheckCircle2, XCircle, ArrowRight, Loader2, Send, RefreshCw,
  Lightbulb, Target, BookOpen, FileText, Sparkles, AlertCircle, Trophy, Copy, Eye
} from "lucide-react";
import {
  ChartItem, ChartType, CHART_TYPE_LABELS, CHART_TYPE_ORDER,
  LineChartData, BarChartData, PieChartData, TableData, FlowchartData,
} from "@/data/ieltsCharts";
import { ParagraphWritingData } from "@/data/ieltsChartsParagraphs";

const STORAGE_KEY = "ielts_writing_progress";

interface StoredProgress {
  unlocked: Record<string, number[]>;
  xp: number;
  weaknesses: string[];
}

function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.xp !== "number") return null;
    if (parsed.unlocked && typeof parsed.unlocked === "object") {
      for (const key of Object.keys(parsed.unlocked)) {
        const arr = parsed.unlocked[key];
        if (!Array.isArray(arr)) return null;
        if (arr.length > 0 && typeof arr[0] !== "number") return null;
      }
    }
    return parsed as StoredProgress;
  } catch { return null; }
}

function saveProgress(unlocked: Record<string, Set<number>>, xp: number, weaknesses: string[]) {
  try {
    const unlockedArray: Record<string, number[]> = {};
    for (const key of Object.keys(unlocked)) {
      unlockedArray[key] = Array.from(unlocked[key]).sort();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlocked: unlockedArray, xp, weaknesses }));
  } catch {}
}

const CHART_ICONS: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  line: TrendingUp, bar: BarChart3, pie: PieChart, table: Table2, map: Map, flowchart: GitBranch,
};

const XP_REWARDS: Record<number, number> = { 1: 10, 2: 20, 3: 30, 4: 40 };
const COMBO_BONUS = 15;
const DATA_PENALTY = 5;

const STAGE_NAMES: Record<number, { emoji: string; label: string; desc: string }> = {
  1: { emoji: "🧩", label: "Decode", desc: "改写题目" },
  2: { emoji: "📊", label: "Pattern", desc: "提取全局模式" },
  3: { emoji: "🔍", label: "Evidence A", desc: "主数据描述" },
  4: { emoji: "⚖️", label: "Evidence B", desc: "对比+剩余数据" },
};

interface StageData {
  prompt: string;
  instruction: string;
  questions: { id: string; question: string; options: string[]; correctAnswer: string }[];
  keywords: string[];
  tips: string[];
  source: "ai" | "local";
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

function LineChart({ data, xLabel, yLabel }: { data: LineChartData; xLabel?: string; yLabel?: string }) {
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const legendH = 24; const legendGap = 24; const w = 500; const h = 380;
  const bottomExtra = 16 + 18 + 6 + legendGap + legendH;
  const plotW = w - padding.left - padding.right; const plotH = h - padding.top - padding.bottom - bottomExtra;
  const allValues = data.series.flatMap((s) => s.values); const maxVal = Math.max(...allValues); const minVal = Math.min(...allValues); const range = maxVal - minVal || 1;
  const xScale = (i: number) => padding.left + (i / (data.labels.length - 1)) * plotW;
  const yScale = (v: number) => padding.top + plotH - ((v - minVal) / range) * plotH;
  const yTicks = 5; const step = range / (yTicks - 1);
  const plotBottom = padding.top + plotH; const labelY = plotBottom + 16; const xLabelY = labelY + 18;
  const legendTop = xLabelY + 6 + legendGap; const legendCenterY = legendTop + legendH / 2 + 4;
  const legendItemW = plotW / data.series.length;
  return (<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">{Array.from({ length: yTicks }).map((_, i) => { const val = minVal + step * i; const y = yScale(val); return (<g key={i}><line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" /><text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9CA3AF">{Math.round(val)}</text></g>); })}{data.labels.map((label, i) => (<text key={i} x={xScale(i)} y={labelY} textAnchor="middle" className="text-[10px]" fill="#6B7280">{label}</text>))}{xLabel && (<text x={w / 2} y={xLabelY} textAnchor="middle" className="text-[11px] font-semibold" fill="#4B5563">{xLabel}</text>)}{yLabel && (<text x={12} y={h / 2} textAnchor="middle" transform={`rotate(-90, 12, ${h / 2})`} className="text-[11px] font-semibold" fill="#4B5563">{yLabel}</text>)}{data.series.map((series) => { const pts = series.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" "); return (<g key={series.name}><polyline points={pts} fill="none" stroke={series.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />{series.values.map((v, i) => (<circle key={i} cx={xScale(i)} cy={yScale(v)} r="4" fill={series.color} stroke="#fff" strokeWidth="1.5" />))}</g>); })}{data.series.map((series, i) => { const lx = padding.left + i * legendItemW + legendItemW / 2; const tw = series.name.length * 6 + 20; return (<g key={`legend-${series.name}`}><line x1={lx - tw / 2} y1={legendCenterY} x2={lx - tw / 2 + 14} y2={legendCenterY} stroke={series.color} strokeWidth="2.5" strokeLinecap="round" /><circle cx={lx - tw / 2 + 7} cy={legendCenterY} r="3.5" fill={series.color} stroke="#fff" strokeWidth="1" /><text x={lx - tw / 2 + 20} y={legendCenterY + 4} textAnchor="start" className="text-[10px] font-bold" fill="#4B5563">{series.name}</text></g>); })}</svg>);
}

function BarChartSVG({ data, xLabel, yLabel }: { data: BarChartData; xLabel?: string; yLabel?: string }) {
  const padding = { top: 30, right: 20, bottom: 60, left: 60 }; const w = 500; const h = 300;
  const plotW = w - padding.left - padding.right; const plotH = h - padding.top - padding.bottom;
  const maxVal = Math.max(...data.values); const barWidth = Math.min(40, plotW / data.labels.length - 12);
  const yTicks = 5; const step = maxVal / (yTicks - 1);
  return (<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">{Array.from({ length: yTicks }).map((_, i) => { const val = step * i; const y = padding.top + plotH - (val / maxVal) * plotH; return (<g key={i}><line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" /><text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9CA3AF">{Math.round(val)}</text></g>); })}{data.labels.map((label, i) => { const x = padding.left + (i / data.labels.length) * plotW + (plotW / data.labels.length - barWidth) / 2; const val = data.values[i]; const barH = (val / maxVal) * plotH; const y = padding.top + plotH - barH; return (<g key={i}><rect x={x} y={y} width={barWidth} height={barH} rx="4" fill={data.color} opacity="0.85" /><text x={x + barWidth / 2} y={padding.top + plotH + 18} textAnchor="middle" className="text-[10px]" fill="#6B7280">{label}</text><text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[11px] font-bold" fill="#374151">{val}</text></g>); })}{xLabel && (<text x={w / 2} y={h - 6} textAnchor="middle" className="text-[11px] font-semibold" fill="#4B5563">{xLabel}</text>)}{yLabel && (<text x={12} y={h / 2} textAnchor="middle" transform={`rotate(-90, 12, ${h / 2})`} className="text-[11px] font-semibold" fill="#4B5563">{yLabel}</text>)}</svg>);
}

function PieChartSVG({ data }: { data: PieChartData }) {
  const cx = 160; const cy = 160; const r = 120;
  const total = data.segments.reduce((s, seg) => s + seg.value, 0); let cumulative = 0;
  return (<svg viewBox="0 0 400 320" className="w-full h-auto">{data.segments.map((seg, i) => { const startAngle = (cumulative / total) * 360; cumulative += seg.value; const endAngle = (cumulative / total) * 360; const large = endAngle - startAngle > 180 ? 1 : 0; const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180); const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180); const x2 = cx + r * Math.cos((endAngle - 90) * Math.PI / 180); const y2 = cy + r * Math.sin((endAngle - 90) * Math.PI / 180); const midAngle = (startAngle + endAngle) / 2 - 90; const lx = cx + (r + 30) * Math.cos(midAngle * Math.PI / 180); const ly = cy + (r + 30) * Math.sin(midAngle * Math.PI / 180); return (<g key={i}><path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={seg.color} stroke="#fff" strokeWidth="2" />{seg.value / total > 0.06 && (<><line x1={x1 + (x2 - x1) * 0.5} y1={y1 + (y2 - y1) * 0.5} x2={lx} y2={ly} stroke={seg.color} strokeWidth="1" opacity="0.6" /><text x={lx > cx ? lx + 4 : lx - 4} y={ly + 4} textAnchor={lx > cx ? "start" : "end"} className="text-[10px] font-semibold" fill="#374151">{seg.label} ({seg.value}%)</text></>)}</g>); })}</svg>);
}

function TableChart({ data }: { data: TableData }) {
  return (<div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-[#F3FAE3]">{data.headers.map((h, i) => (<th key={i} className="px-4 py-2.5 text-left font-black text-[#232323] border border-[#ECECD9] text-xs">{h}</th>))}</tr></thead><tbody>{data.rows.map((row, ri) => (<tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#FDFFF7]"}>{row.map((cell, ci) => (<td key={ci} className="px-4 py-2.5 border border-[#ECECD9] text-[#4B5563] font-medium text-xs">{cell}</td>))}</tr>))}</tbody></table></div>);
}

function MapChart({ data }: { data: FlowchartData }) {
  const viewW = 420; const viewH = 420;
  return (<svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full h-auto">{data.edges.map((edge, i) => { const fn = data.nodes.find((n) => n.id === edge.from); const tn = data.nodes.find((n) => n.id === edge.to); if (!fn || !tn) return null; const x1 = fn.x + fn.width / 2; const y1 = fn.y + fn.height / 2; const x2 = tn.x + tn.width / 2; const y2 = tn.y + tn.height / 2; return (<g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray={edge.label ? "6,3" : ""} />{edge.label && (<text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" className="text-[10px] font-bold" fill="#6B7280">{edge.label}</text>)}</g>); })}{data.nodes.map((node) => (<g key={node.id}><rect x={node.x} y={node.y} width={node.width} height={node.height} rx="8" fill={node.color} stroke="#232323" strokeWidth="1.5" opacity="0.9" /><foreignObject x={node.x} y={node.y} width={node.width} height={node.height}><div className="w-full h-full flex items-center justify-center text-center px-1"><span className="text-[10px] font-black text-[#1D2838] leading-tight whitespace-pre-line">{node.label}</span></div></foreignObject></g>))}</svg>);
}

const renderChart = (item: ChartItem) => {
  switch (item.type) {
    case "line": return <LineChart data={item.data as LineChartData} xLabel={item.xLabel} yLabel={item.yLabel} />;
    case "bar": return <BarChartSVG data={item.data as BarChartData} xLabel={item.xLabel} yLabel={item.yLabel} />;
    case "pie": return <PieChartSVG data={item.data as PieChartData} />;
    case "table": return <TableChart data={item.data as TableData} />;
    case "map": return <MapChart data={item.data as FlowchartData} />;
    case "flowchart": return <MapChart data={item.data as FlowchartData} />;
  }
};

export default function ChartChallenge() {
  const [charts, setCharts] = useState<ChartItem[] | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [activeType, setActiveType] = useState<ChartType>("line");
  const [activeIndex, setActiveIndex] = useState(0);

  const [unlockedParagraphs, setUnlockedParagraphs] = useState<Record<string, Set<number>>>(() => {
    const saved = loadProgress();
    if (saved?.unlocked) {
      const r: Record<string, Set<number>> = {};
      for (const k of Object.keys(saved.unlocked)) r[k] = new Set(saved.unlocked[k]);
      return r;
    }
    return {};
  });
  const [xp, setXp] = useState(() => loadProgress()?.xp || 0);
  const [weaknesses, setWeaknesses] = useState<string[]>(() => loadProgress()?.weaknesses || []);

  const [activeParagraph, setActiveParagraph] = useState(1);
  const [stageData, setStageData] = useState<StageData | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [questionFeedback, setQuestionFeedback] = useState<Record<string, "correct" | "incorrect">>({});
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [paragraphsData, setParagraphsData] = useState<Record<string, { paragraph1: ParagraphWritingData; paragraph2: ParagraphWritingData; paragraph3: ParagraphWritingData; paragraph4: ParagraphWritingData }> | null>(null);
  const [writtenText, setWrittenText] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [paragraphTexts, setParagraphTexts] = useState<Record<number, string>>({});
  const [showFinalEssay, setShowFinalEssay] = useState(false);
  const [xpAnimation, setXpAnimation] = useState<{ amount: number; key: number } | null>(null);

  const prevChartKeyRef = useRef("");
  const xpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/charts")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setCharts(Array.isArray(data) ? data : []))
      .catch(() => setCharts([]))
      .finally(() => setChartsLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/paragraphs")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setParagraphsData(data))
      .catch(() => setParagraphsData({}));
  }, []);

  useEffect(() => {
    saveProgress(unlockedParagraphs, xp, weaknesses);
  }, [unlockedParagraphs, xp, weaknesses]);

  const typeCharts = charts ? charts.filter((c) => c.type === activeType) : [];
  const currentChart = typeCharts[activeIndex];
  const chartKey = currentChart?.id || "";

  const completedParagraphs: Set<number> = useMemo(() => {
    const raw = unlockedParagraphs[chartKey];
    if (!raw) return new Set<number>();
    return new Set<number>(Array.from(raw).filter((v: unknown) => typeof v === "number") as number[]);
  }, [unlockedParagraphs, chartKey]);

  const unlockedParagraphNumbers = useMemo(() => {
    const s = new Set<number>([1]);
    for (let p = 1; p <= 4; p++) {
      if (completedParagraphs.has(p)) {
        s.add(p);
        if (p < 4) s.add(p + 1);
      }
    }
    return s;
  }, [completedParagraphs]);

  const allFourCompleted = useMemo(() => [1, 2, 3, 4].every((p) => completedParagraphs.has(p)), [completedParagraphs]);

  useEffect(() => {
    if (chartKey && chartKey !== prevChartKeyRef.current) {
      prevChartKeyRef.current = chartKey;
      const nums = Array.from(completedParagraphs).filter((v) => typeof v === "number") as number[];
      nums.sort((a, b) => b - a);
      const mc = nums.length > 0 ? nums[0] : 0;
      setActiveParagraph(Math.min(mc + 1, 4) || 1);
      setStage(0);
      setWrittenText("");
      setEvaluationResult(null);
      setQuestionAnswers({});
      setQuestionFeedback({});
      setParagraphTexts({});
      setShowFinalEssay(false);
    }
  }, [chartKey, unlockedParagraphs, completedParagraphs]);

  useEffect(() => {
    return () => { if (xpTimer.current) clearTimeout(xpTimer.current); };
  }, []);

  const addXp = useCallback((amount: number) => {
    setXp((p) => p + Math.max(0, amount));
    setXpAnimation({ amount, key: Date.now() });
    if (xpTimer.current) clearTimeout(xpTimer.current);
    xpTimer.current = setTimeout(() => setXpAnimation(null), 1500);
  }, []);

  const loadParagraphData = useCallback((paragraph: number) => {
    if (!currentChart || !paragraphsData) return;
    const chartParagraphs = paragraphsData[currentChart.id];
    if (!chartParagraphs) return;
    const key = `paragraph${paragraph}` as keyof typeof chartParagraphs;
    const pd = chartParagraphs[key];
    if (!pd) return;
    setStageData({
      prompt: pd.prompt,
      instruction: pd.instruction,
      questions: pd.questions,
      keywords: pd.keywords,
      tips: pd.tips,
      source: "local",
    });
    setStage(1);
  }, [currentChart, paragraphsData]);

  const handleParagraphSelect = (p: number) => {
    if (!unlockedParagraphNumbers.has(p)) return;
    setActiveParagraph(p);
    if (completedParagraphs.has(p)) {
      setStage(0);
      setWrittenText("");
      setEvaluationResult(null);
       setQuestionAnswers({});
       setQuestionFeedback({});
       return;
    }
    setStage(0);
    setStageData(null);
    setWrittenText("");
    setEvaluationResult(null);
    setQuestionAnswers({});
    loadParagraphData(p);
  };

  useEffect(() => {
    if (activeParagraph && !completedParagraphs.has(activeParagraph) && chartKey && paragraphsData) {
      loadParagraphData(activeParagraph);
    }
  }, [activeParagraph, chartKey, paragraphsData]);

  const handleAnswerChange = (qId: string, value: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [qId]: value }));
    if (stageData) {
      const q = stageData.questions.find((x) => x.id === qId);
      if (q) {
        setQuestionFeedback((prev) => ({
          ...prev,
          [qId]: value === q.correctAnswer ? "correct" : "incorrect",
        }));
      }
    }
  };

  const handleShowKeywords = () => {
    setStage(2);
  };

  const handleStartWriting = () => {
    setStage(3);
    setWrittenText(paragraphTexts[activeParagraph] || "");
    setEvaluationResult(null);
  };

  const handleSubmit = async () => {
    if (!currentChart || !stageData) return;
    setEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch("/api/evaluate-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paragraphNumber: activeParagraph,
          userText: writtenText,
          chartTitle: currentChart.title,
          chartQuestion: currentChart.question,
          keywords: stageData.keywords,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EvaluationResult = await res.json();
      setEvaluationResult(data);
      setParagraphTexts((prev) => ({ ...prev, [activeParagraph]: writtenText }));
      setStage(4);
    } catch {
      setEvaluationResult({
        band: 5, strengths: [], issues: ["评分失败，请重试"], suggestions: ["检查网络连接"],
        keywordUsage: { used: [], missing: [] }, errorTags: [], band8Rewrite: "",
        hasComparison: false, hasData: false, source: "local",
      });
      setStage(4);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRevise = () => {
    setStage(3);
    setEvaluationResult(null);
  };

  const handleMarkComplete = () => {
    if (!chartKey) return;

    let earnedXp = XP_REWARDS[activeParagraph] || 25;

    if (evaluationResult) {
      if (evaluationResult.hasComparison) earnedXp += COMBO_BONUS;
      if (!evaluationResult.hasData && activeParagraph >= 3) earnedXp -= DATA_PENALTY;
      if (evaluationResult.errorTags.length > 0) {
        setWeaknesses((prev) => {
          const newTags = evaluationResult.errorTags.filter((t) => !prev.includes(t));
          return newTags.length > 0 ? [...prev, ...newTags].slice(-10) : prev;
        });
      }
    }

    addXp(Math.max(0, earnedXp));

    setUnlockedParagraphs((prev) => {
      const existing = prev[chartKey] || new Set<number>();
      const s = new Set<number>(Array.from(existing).filter((v) => typeof v === "number") as number[]);
      s.add(activeParagraph);
      return { ...prev, [chartKey]: s };
    });

    if (activeParagraph < 4) {
      const next = activeParagraph + 1;
      setActiveParagraph(next);
      setStage(0);
      setStageData(null);
      setWrittenText("");
      setEvaluationResult(null);
      setQuestionAnswers({});
      setQuestionFeedback({});
    }
  };

  const finalEssay = useMemo(() => {
    if (!allFourCompleted) return "";
    return [1, 2, 3, 4].map((p) => paragraphTexts[p] || "").filter(Boolean).join("\n\n");
  }, [allFourCompleted, paragraphTexts]);

  const copyEssay = () => {
    navigator.clipboard.writeText(finalEssay).catch(() => {});
  };

  if (chartsLoading || !paragraphsData) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#232323] animate-spin" />
          <p className="text-sm font-bold text-[#6B7280]">加载图表数据...</p>
        </div>
      </div>
    );
  }

  if (!currentChart) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-bold text-[#9CA3AF]">暂无图表数据</p>
      </div>
    );
  }

  const allAnswered = stageData ? stageData.questions.every((q) => !!questionFeedback[q.id]) : false;
  const wordCount = writtenText.trim() ? writtenText.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl border-2 border-[#232323] bg-white flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-[#232323]" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <h1 className="text-[28px] font-normal text-[#232323] leading-tight [font-family:var(--font-langyuan)]">图表写作训练</h1>
          <p className="text-sm text-[#8C8C6D]">AI出题 · 4级闯关 · 数据驱动 · Band 9写作骨架</p>
        </div>
        <div className="relative flex items-center gap-2 px-4 py-2 border-2 border-[#232323] bg-white rounded-full">
          <Zap className="w-4 h-4 text-[#D97706]" />
          <span className="text-sm font-black text-[#232323]">{xp} XP</span>
          <AnimatePresence>
            {xpAnimation && (
              <motion.span
                key={xpAnimation.key}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 right-0 text-xs font-black text-[#D97706]"
              >
                +{xpAnimation.amount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chart type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CHART_TYPE_ORDER.map((type) => {
          const Icon = CHART_ICONS[type];
          return (
            <motion.button
              key={type}
              onClick={() => { setActiveType(type); setActiveIndex(0); }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                activeType === type ? "bg-[#232323] text-white border-[#232323]" : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#232323]"
              }`}
            >
              <Icon className="w-4 h-4" />{CHART_TYPE_LABELS[type]}
            </motion.button>
          );
        })}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Chart */}
        <div className="bg-white rounded-3xl border-2 border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#6B7280] bg-[#F3F4F6] px-3 py-1 rounded-full">
              {activeIndex + 1} / {typeCharts.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveIndex((prev) => (prev - 1 + typeCharts.length) % typeCharts.length)} className="w-8 h-8 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center hover:border-[#232323] transition-colors"><ChevronLeft className="w-4 h-4 text-[#6B7280]" /></button>
              <button onClick={() => setActiveIndex((prev) => (prev + 1) % typeCharts.length)} className="w-8 h-8 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center hover:border-[#232323] transition-colors"><ChevronRight className="w-4 h-4 text-[#6B7280]" /></button>
            </div>
          </div>
          <h2 className="text-lg font-black text-[#232323] mb-3">{currentChart.title}</h2>
          <div className="bg-[#F9FAFB] rounded-2xl p-4 mb-4 border border-[#E5E7EB]">
            <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
              <span className="font-black text-[#232323] mr-1">Task 1:</span>
              {currentChart.question}
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentChart.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
              {renderChart(currentChart)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Game panel */}
        <div className="bg-white rounded-3xl border-2 border-[#E5E7EB] p-6 flex flex-col">
          {/* Game level tabs */}
          <div className="flex items-center gap-1.5 mb-4">
            {[1, 2, 3, 4].map((p) => {
              const isLocked = !unlockedParagraphNumbers.has(p);
              const isActive = activeParagraph === p;
              const isCompleted = completedParagraphs.has(p);
              const info = STAGE_NAMES[p];

              return (
                <motion.button
                  key={p}
                  onClick={() => !isLocked && handleParagraphSelect(p)}
                  whileHover={isLocked ? {} : { scale: 1.04 }}
                  whileTap={isLocked ? {} : { scale: 0.96 }}
                  className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                    isLocked ? "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed" :
                    isActive ? "bg-[#232323] text-white border-[#232323]" :
                    isCompleted ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]" :
                    "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#232323]"
                  }`}
                >
                  <span className="text-base">{isLocked ? "🔒" : isCompleted ? "✅" : info.emoji}</span>
                  <span className="leading-tight text-center">{info.label}</span>
                  <span className="text-[10px] opacity-60">{XP_REWARDS[p]}XP</span>
                </motion.button>
              );
            })}
          </div>

          {/* Game content */}
          <AnimatePresence mode="wait">
            {completedParagraphs.has(activeParagraph) ? (
              <motion.div key={`done-${activeParagraph}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#34D399] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#059669]" />
                </div>
                <p className="text-lg font-black text-[#232323] mb-1">Level {activeParagraph} Complete!</p>
                <p className="text-sm text-[#6B7280] font-medium mb-4">{STAGE_NAMES[activeParagraph].desc} — +{XP_REWARDS[activeParagraph]} XP</p>
                {allFourCompleted && (
                  <motion.button
                    onClick={() => setShowFinalEssay(!showFinalEssay)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white rounded-full text-sm font-black"
                  >
                    <Trophy className="w-4 h-4" />{showFinalEssay ? "Hide Essay" : "View Full Essay"}
                  </motion.button>
                )}
              </motion.div>
            ) : !stageData ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
                <p className="text-sm text-[#9CA3AF]">Select a level to start</p>
              </motion.div>
            ) : (
              <motion.div key={`${chartKey}-p${activeParagraph}-s${stage}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-y-auto">
                {/* Stage 1: Questions */}
                {stage === 1 && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{STAGE_NAMES[activeParagraph].emoji}</span>
                        <h3 className="text-base font-black text-[#232323]">{stageData.prompt}</h3>
                      </div>
                      <p className="text-sm text-[#6B7280] font-medium">{stageData.instruction}</p>
                    </div>
                    <div className="flex-1 space-y-3 mb-4">
                      {stageData.questions.map((q) => (
                        <div key={q.id} className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB]">
                          <p className="text-sm font-bold text-[#232323] mb-3">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => {
                              const optKey = String.fromCharCode(65 + oi);
                              const selected = questionAnswers[q.id] === optKey;
                              const fb = questionFeedback[q.id];
                              const isCorrect = fb === "correct" && selected;
                              const isWrong = fb === "incorrect" && selected;
                              const isCorrectAnswer = fb && optKey === q.correctAnswer && !selected;
                              return (
                                <button
                                  key={oi}
                                  onClick={() => handleAnswerChange(q.id, optKey)}
                                  disabled={!!fb}
                                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                    isCorrect
                                      ? "bg-[#ECFDF5] text-[#065F46] border-[#34D399]"
                                      : isWrong
                                      ? "bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]"
                                      : isCorrectAnswer
                                      ? "bg-[#F0FDF4] text-[#166534] border-[#86EFAC]"
                                      : selected && !fb
                                      ? "bg-[#232323] text-white border-[#232323]"
                                      : fb
                                      ? "bg-white text-[#9CA3AF] border-[#E5E7EB]"
                                      : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#232323]"
                                  }`}
                                >
                                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 ${
                                    isCorrect
                                      ? "border-[#34D399] bg-[#D1FAE5]"
                                      : isWrong
                                      ? "border-[#FCA5A5] bg-[#FEE2E2]"
                                      : isCorrectAnswer
                                      ? "border-[#86EFAC] bg-[#DCFCE7]"
                                      : selected && !fb
                                      ? "border-white bg-white/20"
                                      : "border-[#D1D5DB]"
                                  }`}>{isCorrect ? "✓" : isWrong ? "✗" : isCorrectAnswer ? "✓" : optKey}</span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      onClick={handleShowKeywords} disabled={!allAnswered}
                      whileHover={allAnswered ? { scale: 1.02 } : {}}
                      whileTap={allAnswered ? { scale: 0.98 } : {}}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all ${
                        allAnswered ? "bg-[#232323] text-white hover:bg-[#1a1a1a] cursor-pointer" : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />查看关键词
                    </motion.button>
                  </>
                )}

                {/* Stage 2: Keywords */}
                {stage === 2 && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{STAGE_NAMES[activeParagraph].emoji}</span>
                        <h3 className="text-base font-black text-[#232323]">{stageData.prompt}</h3>
                      </div>
                      <p className="text-sm text-[#6B7280] font-medium">{stageData.instruction}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-black text-[#6B7280] mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />词汇工具箱
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stageData.keywords.map((kw) => (
                          <span key={kw} className="px-3 py-1.5 bg-[#EDE9FE] text-[#6D28D9] rounded-full text-xs font-bold border border-[#C4B5FD]">{kw}</span>
                        ))}
                      </div>
                    </div>
                    {stageData.tips.length > 0 && (
                      <div className="flex-1 mb-4">
                        <p className="text-xs font-black text-[#6B7280] mb-2 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />写作提示
                        </p>
                        <ul className="space-y-1.5">
                          {stageData.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563] font-medium">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#232323] shrink-0" />{tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <motion.button
                      onClick={handleStartWriting}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#232323] text-white rounded-full text-sm font-black hover:bg-[#1a1a1a] transition-colors"
                    >
                      <FileText className="w-4 h-4" />开始写作
                    </motion.button>
                  </>
                )}

                {/* Stage 3: Writing */}
                {stage === 3 && (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-black text-[#6B7280]">{STAGE_NAMES[activeParagraph].label} — 写下你的段落</p>
                      <span className="text-xs font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{wordCount} 词</span>
                    </div>
                    <textarea
                      value={writtenText}
                      onChange={(e) => setWrittenText(e.target.value)}
                      placeholder="在这里写出你的 Task 1 段落..."
                      className="flex-1 w-full min-h-[200px] p-4 rounded-2xl border-2 border-[#E5E7EB] bg-[#F9FAFB] text-sm font-medium text-[#232323] placeholder-[#9CA3AF] focus:border-[#232323] focus:bg-white focus:outline-none transition-all resize-none"
                    />
                    <motion.button
                      onClick={handleSubmit}
                      disabled={writtenText.trim().length < 10 || evaluating}
                      whileHover={writtenText.trim().length >= 10 && !evaluating ? { scale: 1.02 } : {}}
                      whileTap={writtenText.trim().length >= 10 && !evaluating ? { scale: 0.98 } : {}}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all mt-4 ${
                        writtenText.trim().length >= 10 && !evaluating
                          ? "bg-[#232323] text-white hover:bg-[#1a1a1a] cursor-pointer"
                          : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                      }`}
                    >
                      {evaluating ? <><Loader2 className="w-4 h-4 animate-spin" />AI 正在评分...</> : <><Send className="w-4 h-4" />提交评分</>}
                    </motion.button>
                  </>
                )}

                {/* Stage 4: Evaluation */}
                {stage === 4 && evaluationResult && (
                  <div className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex items-center justify-center mb-4">
                      {(() => {
                        const bc = evaluationResult.band >= 7 ? "border-[#34D399] bg-[#ECFDF5] text-[#059669]" :
                          evaluationResult.band >= 5 ? "border-[#FCD34D] bg-[#FFFBEB] text-[#D97706]" :
                          "border-[#FCA5A5] bg-[#FEF2F2] text-[#DC2626]";
                        return (
                          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${bc}`}>
                            <div className="text-center">
                              <span className="text-xl font-black">{evaluationResult.band.toFixed(1)}</span>
                              <span className="text-[9px] font-bold block -mt-0.5 opacity-70">BAND</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {evaluationResult.errorTags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {evaluationResult.errorTags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5] rounded-full text-[10px] font-black">⚠ {tagToLabel(tag)}</span>
                        ))}
                      </div>
                    )}

                    {evaluationResult.hasComparison && activeParagraph >= 3 && (
                      <div className="mb-3 px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs font-bold text-[#065F46] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />组合技加成 +{COMBO_BONUS} XP
                      </div>
                    )}

                    {!evaluationResult.hasData && activeParagraph >= 3 && (
                      <div className="mb-3 px-3 py-1.5 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl text-xs font-bold text-[#9A3412] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />缺少数据扣减 -{DATA_PENALTY} XP
                      </div>
                    )}

                    {evaluationResult.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-black text-[#059669] mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />优点</p>
                        {evaluationResult.strengths.map((s, i) => (
                          <p key={i} className="text-xs text-[#4B5563] font-medium flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0 mt-0.5" />{s}</p>
                        ))}
                      </div>
                    )}

                    {evaluationResult.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-black text-[#DC2626] mb-1 flex items-center gap-1"><XCircle className="w-3 h-3" />问题</p>
                        {evaluationResult.issues.map((s, i) => (
                          <p key={i} className="text-xs text-[#4B5563] font-medium flex items-start gap-1.5"><XCircle className="w-3 h-3 text-[#DC2626] shrink-0 mt-0.5" />{s}</p>
                        ))}
                      </div>
                    )}

                    {evaluationResult.suggestions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-black text-[#7C3AED] mb-1 flex items-center gap-1"><Lightbulb className="w-3 h-3" />建议</p>
                        {evaluationResult.suggestions.map((s, i) => (
                          <p key={i} className="text-xs text-[#4B5563] font-medium flex items-start gap-1.5"><Sparkles className="w-3 h-3 text-[#7C3AED] shrink-0 mt-0.5" />{s}</p>
                        ))}
                      </div>
                    )}

                    {evaluationResult.band8Rewrite && (
                      <div className="mb-4 p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl">
                        <p className="text-xs font-black text-[#0369A1] mb-1 flex items-center gap-1"><Trophy className="w-3 h-3" />Band 8+ 改写范例</p>
                        <p className="text-xs text-[#0C4A6E] font-medium leading-relaxed italic">{evaluationResult.band8Rewrite}</p>
                      </div>
                    )}

                    {evaluationResult.source === "local" && (
                      <div className="mb-3 flex items-center gap-1.5 px-3 py-2 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl">
                        <AlertCircle className="w-3 h-3 text-[#EA580C]" />
                        <span className="text-xs font-medium text-[#9A3412]">AI 评分不可用 — 使用本地评分</span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto pt-4 border-t border-[#E5E7EB]">
                      <motion.button onClick={handleRevise} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-xs font-bold border-2 border-[#E5E7EB] bg-white text-[#232323] hover:border-[#232323] transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />修改
                      </motion.button>
                      <motion.button onClick={handleMarkComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-black bg-[#232323] text-white hover:bg-[#1a1a1a] transition-colors">
                        {activeParagraph === 4 ? <><Trophy className="w-4 h-4" />完成！</> : <><CheckCircle2 className="w-4 h-4" />完成本关<ArrowRight className="w-4 h-4" /></>}
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Final Essay Modal */}
      <AnimatePresence>
        {showFinalEssay && allFourCompleted && (
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowFinalEssay(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[#D97706]" />
                  <h3 className="text-lg font-black text-[#232323]">完整 Task 1 作文</h3>
                </div>
                <button onClick={copyEssay} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors">
                  <Copy className="w-3.5 h-3.5" />复制
                </button>
              </div>
              <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-[#E5E7EB]">
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed whitespace-pre-wrap">{finalEssay}</p>
              </div>

              {weaknesses.length > 0 && (
                <div className="mt-4 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
                  <p className="text-xs font-black text-[#92400E] mb-2 flex items-center gap-1"><Eye className="w-3.5 h-3.5" />弱点跟踪</p>
                  <div className="flex flex-wrap gap-1.5">
                    {weaknesses.map((w, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full text-[10px] font-bold">{tagToLabel(w)}</span>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                onClick={() => setShowFinalEssay(false)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#232323] text-white rounded-full text-sm font-black"
              >
                关闭
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function tagToLabel(tag: string): string {
  const map: Record<string, string> = {
    data_missing: "缺少数据", weak_comparison: "缺少对比",
    weak_overview: "总览薄弱", grammar_issue: "语法错误",
    repetition: "词汇重复", off_topic: "偏离主题",
    too_short: "过短", no_paraphrase: "未改写",
  };
  return map[tag] || tag;
}
