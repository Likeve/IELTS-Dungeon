"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { TrendingUp, BarChart3, PieChart, Table2, Map, GitBranch, RefreshCw, X, Trophy, ChevronRight, CheckCircle2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ChartItem, ChartType, CHART_TYPE_LABELS, CHART_TYPE_ORDER,
  LineChartData, BarChartData, PieChartData, TableData, FlowchartData,
} from "@/data/ieltsCharts";
import { ParagraphWritingData } from "@/data/ieltsChartsParagraphs";

const STORAGE_KEY = "ielts_writing_progress";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function useSvgScale(viewBoxW: number, viewBoxH: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: viewBoxW, height: viewBoxH, scale: 1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.max(rect.width, 200);
      const height = Math.max(rect.height, 150);
      setSize({ width, height, scale: Math.min(width / viewBoxW, height / viewBoxH) || 1 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewBoxW, viewBoxH]);

  return { ref, ...size };
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffleQuestionsAndOptions(
  questions: { id: string; question: string; options: string[]; correctAnswer: string }[]
): { id: string; question: string; options: string[]; correctAnswer: string }[] {
  const letters = ["A", "B", "C", "D"];
  const shuffledQuestions = shuffleArray(questions);
  return shuffledQuestions.map((q) => {
    const optionTexts = q.options.map((opt) => {
      const match = opt.match(/^[A-D]\s+(.+)$/);
      return match ? match[1] : opt;
    });
    const correctIdx = letters.indexOf(q.correctAnswer);
    const correctText = correctIdx >= 0 ? optionTexts[correctIdx] : optionTexts[0];
    const shuffledTexts = shuffleArray(optionTexts);
    const newCorrectIdx = shuffledTexts.indexOf(correctText);
    const newCorrect = newCorrectIdx >= 0 ? letters[newCorrectIdx] : q.correctAnswer;
    const newOptions = shuffledTexts.map((text, i) => `${letters[i]} ${text}`);
    return { ...q, options: newOptions, correctAnswer: newCorrect };
  });
}

interface StoredProgress {
  unlocked: Record<string, number[]>;
  xp: number;
}

interface ParagraphEvaluation {
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

interface EssayEvaluation {
  band: number;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  errorTags: string[];
  band8Rewrite: string;
  paragraphBands: number[];
  source: "ai" | "local";
}

function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.xp !== "number") return null;
    return parsed as StoredProgress;
  } catch { return null; }
}

function saveProgress(unlocked: Record<string, Set<number>>, xp: number) {
  try {
    const unlockedArray: Record<string, number[]> = {};
    for (const key of Object.keys(unlocked)) {
      unlockedArray[key] = Array.from(unlocked[key]).sort();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlocked: unlockedArray, xp }));
  } catch {}
}

const CHART_ICONS: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  line: TrendingUp, bar: BarChart3, pie: PieChart, table: Table2, map: Map, flowchart: GitBranch,
};

const STAGE_LABELS = ["题目改写", "总览概括", "主体段落一", "主体段落二"];
const STAGE_ENGLISH = ["Introduction", "Overview", "Details 1", "Details 2"];

const LINE_CHART_COLORS = ["#3F72E3", "#0DD6FF", "#0DFF9E"];

function LineChart({ data, yLabel }: { data: LineChartData; yLabel?: string }) {
  const chartData = useMemo(() => ({
    labels: data.labels,
    datasets: data.series.map((s, i) => ({
      label: s.name,
      data: s.values,
      borderColor: LINE_CHART_COLORS[i] || s.color,
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.45,
      pointRadius: 0,
      pointHoverRadius: 4,
    })),
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#E5E7EB",
        padding: 12,
        displayColors: false,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64725D",
          font: { family: "Nunito", size: 12 },
        },
        border: { display: false },
      },
      y: {
        grid: { color: "#E8E8DA" },
        ticks: {
          color: "#64725D",
          font: { family: "Nunito", size: 12 },
        },
        border: { display: false, dash: [8, 8], dashOffset: 0 },
      },
    },
  }), []);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {(yLabel || data.series.length > 0) && (
        <div className="shrink-0 flex items-center gap-2.5">
          {yLabel && (
            <span className="text-[14px] text-[#64725D] leading-[22px] tracking-wide" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 400 }}>
              {yLabel}
            </span>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            {data.series.map((series, i) => {
              const color = LINE_CHART_COLORS[i] || series.color;
              return (
                <div key={series.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[14px] font-bold text-[#232323] whitespace-nowrap" style={{ fontFamily: "Nunito, sans-serif" }}>{series.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

function BarChartSVG({ data }: { data: BarChartData }) {
  const { ref, width: w, height: h } = useSvgScale(500, 250);
  const padding = { top: h * 0.08, right: w * 0.05, bottom: h * 0.18, left: w * 0.11 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;
  const maxVal = Math.max(...data.values);
  const barW = Math.min(36, plotW / data.labels.length - 16);
  const yTicks = 5;
  const step = maxVal / (yTicks - 1);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
        {Array.from({ length: yTicks }).map((_, i) => {
          const val = step * i;
          const y = padding.top + plotH - (val / maxVal) * plotH;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E8E8DA" strokeWidth="1" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" style={{ fontSize: 12 }} fill="#64725D" fontFamily="Nunito" fontWeight={400}>{Math.round(val)}</text>
            </g>
          );
        })}
        {data.labels.map((label, i) => {
          const x = padding.left + (i / data.labels.length) * plotW + (plotW / data.labels.length - barW) / 2;
          const val = data.values[i];
          const barH = (val / maxVal) * plotH;
          const y = padding.top + plotH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx="4" fill="#3F72E3" opacity="0.85" />
              <text x={x + barW / 2} y={padding.top + plotH + h * 0.05} textAnchor="middle" style={{ fontSize: 12 }} fill="#64725D" fontFamily="Nunito" fontWeight={400}>{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function PieChartSVG({ data }: { data: PieChartData }) {
  const { ref, width: w, height: h } = useSvgScale(380, 300);
  const cx = w * 0.4; const cy = h * 0.5; const r = Math.min(w, h) * 0.32;
  const total = data.segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const pieColors = ["#3F72E3", "#0DD6FF", "#0DFF9E", "#FF9F43", "#EE5A24", "#A78BFA"];

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
        {data.segments.map((seg, i) => {
          const startAngle = (cumulative / total) * 360;
          cumulative += seg.value;
          const endAngle = (cumulative / total) * 360;
          const large = endAngle - startAngle > 180 ? 1 : 0;
          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (endAngle - 90) * Math.PI / 180;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const midAngle = (startAngle + endAngle) / 2 - 90;
          const lx = cx + (r + 25) * Math.cos(midAngle * Math.PI / 180);
          const ly = cy + (r + 25) * Math.sin(midAngle * Math.PI / 180);
          const color = pieColors[i] || seg.color;
          return (
            <g key={i}>
              <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={color} stroke="#fff" strokeWidth="1.5" />
              {seg.value / total > 0.04 && (
                <>
                  <line x1={x1 + (x2 - x1) * 0.5} y1={y1 + (y2 - y1) * 0.5} x2={lx} y2={ly} stroke="#9CA3AF" strokeWidth="0.5" />
                  <text x={lx > cx ? lx + 4 : lx - 4} y={ly + 4} textAnchor={lx > cx ? "start" : "end"} style={{ fontSize: 14 }} fill="#374151" fontFamily="Nunito" fontWeight={500}>{seg.label} ({seg.value}%)</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TableChart({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#ECECE1]">
            {data.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-medium text-[#232323] border border-[#D4D4C8] text-[14px]" style={{ fontFamily: "Nunito" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#FDFFF7]"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 border border-[#D4D4C8] text-[#4B5563] font-normal text-[12px]" style={{ fontFamily: "Nunito" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlowChartSVG({ data }: { data: FlowchartData }) {
  const { ref, width: w, height: h } = useSvgScale(400, 360);
  const sx = w / 400;
  const sy = h / 360;

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
        {data.edges.map((edge, i) => {
          const fn = data.nodes.find((n) => n.id === edge.from);
          const tn = data.nodes.find((n) => n.id === edge.to);
          if (!fn || !tn) return null;
          const x1 = (fn.x + fn.width / 2) * sx;
          const y1 = (fn.y + fn.height / 2) * sy;
          const x2 = (tn.x + tn.width / 2) * sx;
          const y2 = (tn.y + tn.height / 2) * sy;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray={edge.label ? "6,3" : ""} />
              {edge.label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" style={{ fontSize: 12 }} fill="#6B7280" fontFamily="Nunito" fontWeight={400}>{edge.label}</text>}
            </g>
          );
        })}
        {data.nodes.map((node) => (
          <g key={node.id}>
            <rect x={node.x * sx} y={node.y * sy} width={node.width * sx} height={node.height * sy} rx="8" fill={node.color} stroke="#232323" strokeWidth="1" opacity="0.9" />
            <foreignObject x={node.x * sx} y={node.y * sy} width={node.width * sx} height={node.height * sy}>
              <div className="w-full h-full flex items-center justify-center text-center px-1">
                <span className="font-medium text-[#1D2838] leading-tight whitespace-pre-line" style={{ fontFamily: "Nunito", fontSize: 14 }}>{node.label}</span>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}

const renderChart = (item: ChartItem) => {
  switch (item.type) {
    case "line": return <LineChart data={item.data as LineChartData} yLabel={item.yLabel} />;
    case "bar": return <BarChartSVG data={item.data as BarChartData} />;
    case "pie": return <PieChartSVG data={item.data as PieChartData} />;
    case "table": return <TableChart data={item.data as TableData} />;
    case "map": case "flowchart": return <FlowChartSVG data={item.data as FlowchartData} />;
  }
};

function GreenStar() {
  return <img src="/logo.svg" alt="" className="w-10 h-10 shrink-0" />;
}

function GrayStar() {
  return <img src="/logo.svg" alt="" className="w-10 h-10 shrink-0 opacity-40" />;
}

export default function ChartChallenge() {
  const [charts, setCharts] = useState<ChartItem[] | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [activeType, setActiveType] = useState<ChartType>("line");
  const [activeIndex, setActiveIndex] = useState(0);

  const [paragraphsData, setParagraphsData] = useState<Record<string, {
    paragraph1: ParagraphWritingData; paragraph2: ParagraphWritingData;
    paragraph3: ParagraphWritingData; paragraph4: ParagraphWritingData;
  }> | null>(null);

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

  const [activeParagraph, setActiveParagraph] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionFeedback, setQuestionFeedback] = useState<Record<string, "correct" | "incorrect">>({});
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);

  const [showRoadmap, setShowRoadmap] = useState(false);

  const [shuffledQuestions, setShuffledQuestions] = useState<{ id: string; question: string; options: string[]; correctAnswer: string }[]>([]);
  const [stageComplete, setStageComplete] = useState(false);
  const [paragraphInput, setParagraphInput] = useState("");
  const [paragraphInputs, setParagraphInputs] = useState<Record<number, string>>({});
  const [paragraphEvaluations, setParagraphEvaluations] = useState<Record<number, ParagraphEvaluation>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [essayEvaluation, setEssayEvaluation] = useState<EssayEvaluation | null>(null);
  const [showEssayResult, setShowEssayResult] = useState(false);
  const [showParagraphResult, setShowParagraphResult] = useState(false);

  const shuffledRef = useRef(false);

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
    saveProgress(unlockedParagraphs, xp);
  }, [unlockedParagraphs, xp]);

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
      if (completedParagraphs.has(p)) { s.add(p); if (p < 4) s.add(p + 1); }
    }
    return s;
  }, [completedParagraphs]);

  const currentStageData = useMemo(() => {
    if (!currentChart || !paragraphsData) return null;
    const cp = paragraphsData[currentChart.id];
    if (!cp) return null;
    const key = `paragraph${activeParagraph}` as keyof typeof cp;
    return cp[key] || null;
  }, [currentChart, paragraphsData, activeParagraph]);

  const resetStage = useCallback(() => {
    setCurrentQuestionIndex(0);
    setQuestionFeedback({});
    setDiscoveredClues([]);
    setShuffledQuestions([]);
    setStageComplete(false);
    setParagraphInput((prev) => {
      // Save current paragraph input before switching
      if (activeParagraph && prev.trim()) {
        setParagraphInputs((inputs) => ({ ...inputs, [activeParagraph]: prev }));
      }
      return "";
    });
    shuffledRef.current = false;
  }, [activeParagraph]);

  useEffect(() => {
    if (currentStageData && !shuffledRef.current) {
      shuffledRef.current = true;
      const shuffled = shuffleQuestionsAndOptions(currentStageData.questions);
      setShuffledQuestions(shuffled);
    }
  }, [currentStageData, chartKey, activeParagraph]);

  useEffect(() => {
    resetStage();
    setActiveParagraph(1);
  }, [chartKey]);

  useEffect(() => {
    // Restore saved paragraph input when entering a stage
    setParagraphInput(paragraphInputs[activeParagraph] || "");
  }, [activeParagraph, paragraphInputs]);

  const totalQuestions = shuffledQuestions.length;
  const currentQ = shuffledQuestions[currentQuestionIndex] || null;

  const handleAnswer = (optKey: string) => {
    if (!currentQ || questionFeedback[currentQ.id]) return;
    const isCorrect = optKey === currentQ.correctAnswer;
    setQuestionFeedback((prev) => ({ ...prev, [currentQ.id]: isCorrect ? "correct" : "incorrect" }));
    if (isCorrect) {
      const textMatch = currentQ.options.find((o) => o.startsWith(optKey));
      const clue = textMatch ? textMatch.replace(/^[A-D]\s+/, "") : "";
      if (clue && !discoveredClues.includes(clue)) {
        setDiscoveredClues((prev) => [...prev, clue]);
      }
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          setStageComplete(true);
        }
      }, 800);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStageComplete(true);
    }
  };

  const handleNextStage = () => {
    const evaluation = paragraphEvaluations[activeParagraph];
    if (!evaluation || evaluation.band <= 4.5) return;
    if (activeParagraph < 4) {
      setActiveParagraph((prev) => prev + 1);
      resetStage();
    }
  };

  const unlockParagraph = useCallback((paragraph: number) => {
    const newXp = (paragraph === 1 ? 10 : paragraph === 2 ? 20 : paragraph === 3 ? 30 : 40);
    setXp((prev) => prev + newXp);
    setUnlockedParagraphs((prev) => {
      const existing = prev[chartKey] || new Set<number>();
      const s = new Set<number>(Array.from(existing).filter((v) => typeof v === "number") as number[]);
      s.add(paragraph);
      return { ...prev, [chartKey]: s };
    });
  }, [chartKey]);

  const handleEvaluateParagraph = async () => {
    if (!currentChart || !currentStageData || !paragraphInput.trim()) return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/evaluate-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paragraphNumber: activeParagraph,
          userText: paragraphInput,
          chartTitle: currentChart.title,
          chartQuestion: currentChart.question,
          keywords: currentStageData.keywords || [],
        }),
      });
      const data = await res.json();
      if (res.ok && data.band !== undefined) {
        setParagraphEvaluations((prev) => ({ ...prev, [activeParagraph]: data as ParagraphEvaluation }));
        setParagraphInputs((prev) => ({ ...prev, [activeParagraph]: paragraphInput }));
        setShowParagraphResult(true);
        if (data.band > 4.5) {
          unlockParagraph(activeParagraph);
        }
      }
    } catch {
      // ignore
    } finally {
      setEvaluating(false);
    }
  };

  const handleEvaluateEssay = async () => {
    if (!currentChart) return;
    const paragraphs = [1, 2, 3, 4].map((n) => paragraphInputs[n] || "");
    if (paragraphs.some((p) => !p.trim())) return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/evaluate-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paragraphs,
          chartTitle: currentChart.title,
          chartQuestion: currentChart.question,
        }),
      });
      const data = await res.json();
      if (res.ok && data.band !== undefined) {
        setEssayEvaluation(data as EssayEvaluation);
        setShowEssayResult(true);
      }
    } catch {
      // ignore
    } finally {
      setEvaluating(false);
    }
  };

  const handleChartNav = (dir: "prev" | "next") => {
    if (dir === "prev") setActiveIndex((p) => (p - 1 + typeCharts.length) % typeCharts.length);
    else setActiveIndex((p) => (p + 1) % typeCharts.length);
  };

  if (chartsLoading || !paragraphsData) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#232323] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#6B7280]">加载中...</p>
        </div>
      </div>
    );
  }

  if (!currentChart) return null;

  return (
    <>
      <div className="flex flex-col flex-1 p-6 min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            {CHART_TYPE_ORDER.map((type) => {
              const Icon = CHART_ICONS[type];
              const isActive = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setActiveIndex(0); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#ECECE1] text-[#232323]"
                      : "bg-[#ECECE0] text-[#949481] hover:text-[#555]"
                  }`}
                  style={{ fontFamily: "Arial" }}
                >
                  <Icon className="w-4 h-4" />
                  {CHART_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleChartNav("next")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#413F2D] text-sm hover:bg-[#f0f0e8] transition-colors"
              style={{ fontFamily: "yixinshanshanti, sans-serif" }}
            >
              <RefreshCw className="w-4 h-4" />
              更换题目
            </button>
            <button
              onClick={() => setShowRoadmap(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#41402D] transition-colors hover:brightness-95"
              style={{ backgroundColor: "#AFFF8A", fontFamily: "yixinshanshanti, sans-serif" }}
            >
              <img src="/map.svg" alt="闯关地图" className="w-[18px] h-[15px]" />
              闯关地图
            </button>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-3xl p-4 flex flex-col flex-1 min-h-0" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          {/* Title */}
          <div className="flex items-baseline gap-2 mb-4 shrink-0">
            <h2 className="text-[14px] text-[#232323] w-full" style={{ fontFamily: "zixiaohunlangyuanti, sans-serif" }}>
              第{activeParagraph}关 ：{STAGE_LABELS[activeParagraph - 1]}
            </h2>
            <span className="text-[14px] font-bold text-[#232323]" style={{ fontFamily: "var(--font-edu-hand-bold)" }}>{STAGE_ENGLISH[activeParagraph - 1]}</span>
          </div>

          {/* Content split */}
          <div className="flex gap-4 flex-col lg:flex-row flex-1 min-h-0">
            {/* Left: Question area */}
            <div className="flex-1 bg-[#F7F7F1] rounded-3xl p-4 flex flex-col min-w-0 min-h-0">

              {/* Star + Question + Chart card wrapper */}
              <div className="flex gap-3 flex-1 min-h-0">
                <div className="shrink-0 self-start">
                  {currentQ ? <GreenStar /> : <GrayStar />}
                </div>

                <div className="flex flex-col gap-3 flex-1 min-h-0 min-w-0">
                <AnimatePresence mode="wait">
                  {currentQ && !stageComplete ? (
                    <motion.div
                      key={currentQ.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 py-3 rounded-full shrink-0 self-start inline-flex items-center gap-2 border-[1.5px] border-[#262626]"
                      style={{ backgroundColor: "#AFFF8A" }}
                    >
                      <p className="text-[14px] font-bold text-[#232323] whitespace-nowrap" style={{ fontFamily: "Nunito, sans-serif" }}>
                        {currentQ.question}
                      </p>
                      <span className="text-[14px] font-medium whitespace-nowrap" style={{ color: "rgba(35, 35, 35, 0.6)", fontFamily: "Nunito, sans-serif" }}>
                        {currentQuestionIndex + 1}/{totalQuestions}
                      </span>
                    </motion.div>
                  ) : stageComplete ? (
                    <motion.div
                      key="stage-complete"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 py-3 rounded-2xl bg-[#ECFDF5] shrink-0 self-start inline-block"
                    >
                      <p className="text-[14px] font-bold text-[#065F46] whitespace-nowrap" style={{ fontFamily: "Nunito, sans-serif" }}>
                        🎉 Stage Complete — 所有线索已收集！
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Chart card */}
                <div className="flex flex-col gap-3 flex-1 min-h-0 bg-white rounded-3xl p-4">
                  {/* Title + Description */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <h3 className="text-[14px] font-medium text-[#232323] leading-[22px]" style={{ fontFamily: "Nunito, sans-serif" }}>
                      {currentChart.title}
                    </h3>
                    <p className="text-[14px] text-[#64725D] leading-[22px]" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 400 }}>
                      {currentChart.question}
                    </p>
                  </div>

                  {/* Chart area */}
                  <div className="bg-[#F7F7F1] rounded-3xl p-4 flex-1 min-h-0">
                    {renderChart(currentChart)}
                  </div>

                  {/* Answer grid or paragraph input */}
                  {!stageComplete && currentQ ? (
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                      {currentQ.options.map((opt, oi) => {
                        const optKey = String.fromCharCode(65 + oi);
                        const fb = questionFeedback[currentQ.id];
                        const isCorrectAnswer = fb && optKey === currentQ.correctAnswer;

                        let bg = "#F7F7F1";
                        let textColor = "#262626";
                        let border = "2px solid #262626";
                        let shadow = "0px 4px 0px #ECECE1";
                        if (fb && isCorrectAnswer) { bg = "#ECFDF5"; textColor = "#065F46"; border = "2px solid #065F46"; shadow = "0px 4px 0px #A7F3D0"; }
                        else if (fb) { bg = "#F5F5F0"; textColor = "#9CA3AF"; border = "2px solid #D4D4C8"; shadow = "none"; }

                        return (
                          <button
                            key={oi}
                            onClick={() => handleAnswer(optKey)}
                            disabled={!!fb}
                            className="flex flex-row justify-center items-center gap-3 px-4 py-3 rounded-full text-center text-[14px] font-bold transition-all hover:brightness-95 disabled:cursor-default"
                            style={{ backgroundColor: bg, color: textColor, fontFamily: "Nunito, sans-serif", border, boxShadow: shadow }}
                          >
                            {opt.replace(/^[A-D]\s+/, "")}
                          </button>
                        );
                      })}
                    </div>
                  ) : stageComplete ? (
                    <div className="flex flex-col gap-2.5 shrink-0">
                      <div className="flex flex-col gap-2.5 p-4 rounded-3xl border-[1.5px] h-[140px] min-h-[140px]" style={{ backgroundColor: "#F7F7F1", borderColor: "#363636", boxShadow: "0px 4px 0px 0px rgba(232, 232, 220, 1)" }}>
                        <textarea
                          value={paragraphInput}
                          onChange={(e) => setParagraphInput(e.target.value)}
                          placeholder="The line graph illustrates..."
                          className="w-full flex-1 min-h-0 bg-transparent resize-none outline-none text-[14px] font-bold leading-[22px] text-[#000000] placeholder:text-[#A7A794]"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        />
                        <div className="flex items-end justify-between gap-3">
                          <span className="text-[12px] font-medium leading-[22px]" style={{ color: "#A7A794", fontFamily: "PingFang SC, sans-serif" }}>
                            字词数: <span style={{ color: "#2C2C2C" }}>{paragraphInput.trim().split(/\s+/).filter(Boolean).length}</span>
                          </span>
                          <button
                            onClick={handleEvaluateParagraph}
                            disabled={evaluating || !paragraphInput.trim()}
                            className="p-2 rounded-2xl flex items-center justify-center transition-colors hover:brightness-95 disabled:opacity-50"
                            style={{ backgroundColor: "#E5E5C2" }}
                          >
                            {evaluating ? (
                              <div className="w-6 h-6 border-2 border-[#232323] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Send className="w-6 h-6 text-[#232323]" />
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : null}

                  {/* Continue button */}
                </div>
                {currentQ && questionFeedback[currentQ.id] === "incorrect" && !stageComplete && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                      style={{ backgroundColor: "#AFFF8A", fontFamily: "Nunito, sans-serif" }}
                    >
                      {currentQuestionIndex < totalQuestions - 1 ? "下一题 →" : "完成本关 ✓"}
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Right: Clues panel */}
            <div className="w-full lg:w-[399px] shrink-0 bg-[#F7F7F1] rounded-3xl p-4 flex flex-col gap-3 min-h-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] whitespace-nowrap" style={{ fontFamily: "zixiaohunlangyuanti, sans-serif", color: "#64725D" }}>
                  🧩 已发现线索
                </span>
              </div>

              {discoveredClues.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {discoveredClues.map((clue, i) => (
                    <div key={i} className="p-3 rounded-2xl h-fit self-start" style={{ backgroundColor: "#EAEADE" }}>
                      <p className="text-[13px] font-bold text-[#2D2D2D] leading-relaxed" style={{ fontFamily: "Nunito, sans-serif" }}>
                        {clue}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 flex-1">
                  <GrayStar />
                  <p className="text-[11px] text-center" style={{ color: "#949478", fontFamily: "PingFang SC, sans-serif" }}>
                    选择答案<br />期待你发现线索哦～
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
          {showParagraphResult && paragraphEvaluations[activeParagraph] && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                onClick={() => setShowParagraphResult(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#232323]" style={{ fontFamily: "Nunito, sans-serif" }}>
                      段落评分
                    </h3>
                    <button
                      onClick={() => setShowParagraphResult(false)}
                      className="w-8 h-8 rounded-full bg-[#ECECD9] hover:bg-[#E0E0CC] flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-[#080808]" />
                    </button>
                  </div>

                  {(() => {
                    const ev = paragraphEvaluations[activeParagraph];
                    const passed = ev.band > 4.5;
                    return (
                      <>
                        <div className="flex items-baseline gap-2 mb-5">
                          <span className="text-[14px] font-bold text-[#64725D]" style={{ fontFamily: "Nunito, sans-serif" }}>
                            得分:
                          </span>
                          <span className={`text-[36px] font-black ${passed ? "text-[#52B543]" : "text-[#EF4444]"}`} style={{ fontFamily: "Nunito, sans-serif" }}>
                            {ev.band.toFixed(1)}
                          </span>
                          <span className="text-[14px] text-[#64725D]" style={{ fontFamily: "Nunito, sans-serif" }}>
                            / 9.0
                          </span>
                        </div>

                        {!passed && (
                          <p className="text-[13px] text-[#EF4444] mb-4" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                            需要高于 4.5 分才能进入下一关，请根据建议修改后重新提交。
                          </p>
                        )}

                        {ev.strengths.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>优点</h4>
                            <ul className="flex flex-col gap-1">
                              {ev.strengths.map((s, i) => (
                                <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ev.issues.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>问题</h4>
                            <ul className="flex flex-col gap-1">
                              {ev.issues.map((s, i) => (
                                <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ev.suggestions.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>改进建议</h4>
                            <ul className="flex flex-col gap-1">
                              {ev.suggestions.map((s, i) => (
                                <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ev.band8Rewrite && (
                          <div className="mb-2">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>Band 8+ 改写参考</h4>
                            <p className="text-[12px] text-[#64725D] leading-relaxed p-3 rounded-xl bg-[#F7F7F1]" style={{ fontFamily: "Nunito, sans-serif" }}>
                              {ev.band8Rewrite}
                            </p>
                          </div>
                        )}

                        {passed && activeParagraph === 4 ? (
                          <button
                            onClick={() => { setShowParagraphResult(false); handleEvaluateEssay(); }}
                            disabled={evaluating}
                            className="mt-4 w-full px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                            style={{ backgroundColor: "#AFFF8A", fontFamily: "Nunito, sans-serif" }}
                          >
                            {evaluating ? "评分中..." : "查看整篇评分 →"}
                          </button>
                        ) : passed ? (
                          <button
                            onClick={() => { setShowParagraphResult(false); handleNextStage(); }}
                            className="mt-4 w-full px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                            style={{ backgroundColor: "#AFFF8A", fontFamily: "Nunito, sans-serif" }}
                          >
                            进入下一关 →
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowParagraphResult(false)}
                            className="mt-4 w-full px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                            style={{ backgroundColor: "#E5E5C2", fontFamily: "Nunito, sans-serif" }}
                          >
                            继续修改
                          </button>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      <AnimatePresence>
          {showEssayResult && essayEvaluation && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                onClick={() => setShowEssayResult(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#232323]" style={{ fontFamily: "Nunito, sans-serif" }}>
                      整篇文章评分
                    </h3>
                    <button
                      onClick={() => setShowEssayResult(false)}
                      className="w-8 h-8 rounded-full bg-[#ECECD9] hover:bg-[#E0E0CC] flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-[#080808]" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-[14px] font-bold text-[#64725D]" style={{ fontFamily: "Nunito, sans-serif" }}>
                      总得分:
                    </span>
                    <span className="text-[36px] font-black text-[#52B543]" style={{ fontFamily: "Nunito, sans-serif" }}>
                      {essayEvaluation.band.toFixed(1)}
                    </span>
                    <span className="text-[14px] text-[#64725D]" style={{ fontFamily: "Nunito, sans-serif" }}>
                      / 9.0
                    </span>
                  </div>

                  {essayEvaluation.paragraphBands.length === 4 && (
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {essayEvaluation.paragraphBands.map((b, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#F7F7F1]">
                          <span className="text-[11px] text-[#64725D]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                            段落 {i + 1}
                          </span>
                          <span className="text-[16px] font-bold text-[#232323]" style={{ fontFamily: "Nunito, sans-serif" }}>
                            {b.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {essayEvaluation.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>优点</h4>
                      <ul className="flex flex-col gap-1">
                        {essayEvaluation.strengths.map((s, i) => (
                          <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                            • {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {essayEvaluation.suggestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>改进建议</h4>
                      <ul className="flex flex-col gap-1">
                        {essayEvaluation.suggestions.map((s, i) => (
                          <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                            • {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {essayEvaluation.band8Rewrite && (
                    <div className="mb-2">
                      <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "PingFang SC, sans-serif" }}>Band 8+ 改写参考</h4>
                      <p className="text-[12px] text-[#64725D] leading-relaxed p-3 rounded-xl bg-[#F7F7F1]" style={{ fontFamily: "Nunito, sans-serif" }}>
                        {essayEvaluation.band8Rewrite}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      <AnimatePresence>
          {showRoadmap && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/30"
                onClick={() => setShowRoadmap(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 z-50 h-full w-[360px] bg-[#FFFCF4] shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E5D8] shrink-0">
                  <div className="flex items-center gap-3">
                    <img src="/map.svg" alt="闯关地图" className="w-5 h-4" />
                    <h2 className="text-lg font-black text-[#1D2838]" style={{ fontFamily: "zixiaohunlangyuanti, sans-serif" }}>闯关地图</h2>
                  </div>
                  <button
                    onClick={() => setShowRoadmap(false)}
                    className="w-8 h-8 rounded-full bg-[#ECECD9] hover:bg-[#E0E0CC] flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-[#080808]" />
                  </button>
                </div>

                <div className="px-6 py-5 border-b border-[#E8E5D8] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#AFFF8A] border border-[#232323] flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#232323]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#808771]" style={{ fontFamily: "PingFang SC, sans-serif" }}>总经验值</p>
                      <p className="text-lg font-black text-[#1D2838]" style={{ fontFamily: "var(--font-nunito)" }}>{xp} XP</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="relative pl-8">
                    <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[#E0E0D5]" />

                    {[1, 2, 3, 4].map((stage, i) => {
                      const isDone = completedParagraphs.has(stage);
                      const isCurrent = activeParagraph === stage;
                      const isLocked = !unlockedParagraphNumbers.has(stage);
                      const stageQuestions = stage === 1 && currentStageData
                        ? currentStageData.questions
                        : null;
                      const questionsDone = stage === 1
                        ? Object.keys(questionFeedback).length
                        : 0;
                      const questionsTotal = stageQuestions
                        ? stageQuestions.length
                        : 4;
                      const stageCompleteForThis = stageComplete && activeParagraph === stage;

                      return (
                        <div key={stage} className={`relative pb-5 ${i === 3 ? "pb-0" : ""}`}>
                          <div className={`absolute left-[-23px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                            isDone
                              ? "bg-[#AFFF8A] border-[#52B543]"
                              : isCurrent
                              ? "bg-white border-[#AFFF8A]"
                              : "bg-white border-[#D4D4C8]"
                          }`}>
                            {isDone ? (
                              <CheckCircle2 className="w-3 h-3 text-[#52B543]" />
                            ) : isCurrent ? (
                              <div className="w-2 h-2 rounded-full bg-[#AFFF8A]" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-[#D4D4C8]" />
                            )}
                          </div>

                          <div className="mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${
                                isLocked ? "text-[#9CA3AF]" : "text-[#232323]"
                              }`} style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                {STAGE_LABELS[stage - 1]}
                              </span>
                              <span className={`text-xs font-bold ${
                                isLocked ? "text-[#9CA3AF]" : "text-[#232323]"
                              }`} style={{ fontFamily: "var(--font-edu-hand-bold)" }}>
                                {STAGE_ENGLISH[stage - 1]}
                              </span>
                            </div>
                          </div>

                          {/* Stage detail card */}
                          {isCurrent && !isLocked ? (
                            <div className="rounded-xl p-3 bg-[#F3FAE3] border border-[#AFFF8A]">
                              {stage === 1 && !stageCompleteForThis ? (
                                <>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold text-[#52B543] px-2 py-0.5 rounded-full bg-[#AFFF8A]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                      进行中
                                    </span>
                                    <span className="text-[10px] font-bold text-[#808771]" style={{ fontFamily: "var(--font-nunito)" }}>
                                      第 {currentQuestionIndex + 1}/{questionsTotal} 题
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-2">
                                    {stageQuestions?.map((q, qi) => {
                                      const fb = questionFeedback[q.id];
                                      return (
                                        <div
                                          key={q.id}
                                          className={`flex-1 h-1.5 rounded-full ${
                                            fb
                                              ? fb === "correct"
                                                ? "bg-[#52B543]"
                                                : "bg-[#EF4444]"
                                              : "bg-[#E5E5D8]"
                                          }`}
                                          title={`第 ${qi + 1} 题${fb ? (fb === "correct" ? " ✅" : " ❌") : ""}`}
                                        />
                                      );
                                    })}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-[#808771]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                      问题回答
                                    </span>
                                    <span className="text-[10px] font-bold text-[#808771]" style={{ fontFamily: "var(--font-nunito)" }}>
                                      {questionsDone}/{questionsTotal}
                                    </span>
                                  </div>
                                </>
                              ) : isDone || stageCompleteForThis ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-[#065F46] px-2 py-0.5 rounded-full bg-[#A7F3D0]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                    已完成
                                  </span>
                                  <span className="text-[10px] text-[#808771]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                    {stage === 1 ? "问题 + 段落写作" : "段落写作"}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-[#52B543] px-2 py-0.5 rounded-full bg-[#AFFF8A]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                    进行中
                                  </span>
                                  <span className="text-[10px] text-[#808771]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                    {stage === 1 ? "问题 + 段落写作" : "段落写作"}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : isDone ? (
                            <div className="rounded-xl p-3 bg-[#ECFDF5] border border-[#A7F3D0]">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[#065F46] px-2 py-0.5 rounded-full bg-[#A7F3D0]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                  已完成
                                </span>
                                <span className="text-[10px] text-[#808771]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                  {stage === 1 ? "问题 + 段落写作" : "段落写作"}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl p-3 bg-[#F5F5F0] border border-[#E5E5D8]">
                              <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full border border-[#D4D4C8] flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4D4C8]" />
                                </div>
                                <span className="text-[10px] text-[#9CA3AF]" style={{ fontFamily: "PingFang SC, sans-serif" }}>
                                  未解锁
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#E8E5D8] shrink-0">
                  <button
                    onClick={() => setShowRoadmap(false)}
                    className="w-full py-3 rounded-full bg-[#AFFF8A] border border-[#232323] text-sm font-black text-[#232323] hover:bg-[#98e87a] transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: "PingFang SC, sans-serif" }}
                  >
                    继续闯关
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </>
  );
}
