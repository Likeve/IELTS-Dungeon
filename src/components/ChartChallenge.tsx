"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { TrendingUp, BarChart3, PieChart, Table2, Map, GitBranch, RefreshCw, X, Trophy, ChevronRight, Send, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ParametricMapChart from "./ParametricMapChart";
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
import { findAutocomplete } from "@/data/wordBank";


const STAGE_COMPLETE_MESSAGES = [
  "🎉 线索收集完成！现在试着把题目改写成你的 Introduction 吧！",
  "✍️ 太棒了！利用刚刚收集到的线索，写出你的雅思写作第一段 Introduction。",
  "🚀 准备就绪！现在开始改写题目，完成你的 Introduction 吧！",
  "💡 所有线索已解锁！用它们来完成你的 Introduction 第一段。",
  "🌟 线索已备齐！试着把题目换种说法，写出属于你的 Introduction。",
  "🎯 第一步完成！接下来，把题目改写成一个清晰自然的 Introduction。",
  "📚 你的素材已经准备好了，现在开始撰写 Introduction 吧！",
  "⚡ 线索收集成功！把它们组合起来，完成你的第一段 Introduction。",
  "🏆 干得漂亮！现在轮到你改写题目，写出雅思写作的开头啦！",
  "✨ 挑战开始！根据刚刚收集的线索，完成你的 Introduction。",
];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SHARD_COLORS = ["#AFFF8A", "#98E87A", "#82D46A", "#B8FF9E", "#6ECF54", "#5BB83F"];

function ParticleBurst({ size }: { size?: { w: number; h: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState(size || { w: 140, h: 48 });

  useEffect(() => {
    if (size) { setRect(size); return; }
    const el = ref.current?.parentElement;
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ w: r.width, h: r.height });
    }
  }, [size]);

  const cols = 5;
  const rows = 4;
  const total = cols * rows;

  const particles = useMemo(() => {
    return Array.from({ length: total }).map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const startX = (col / (cols - 1) - 0.5) * rect.w * 0.85;
      const startY = (row / (rows - 1) - 0.5) * rect.h * 0.85;
      const outAngle = Math.atan2(startY, startX);
      const spreadAngle = outAngle + (Math.random() - 0.5) * 0.25;
      const baseDist = Math.max(rect.w, rect.h) * 0.5;
      const distance = baseDist + Math.random() * baseDist * 0.6;
      const endX = Math.cos(spreadAngle) * distance;
      const endY = Math.sin(spreadAngle) * distance;
      const w = 6 + Math.random() * 6;
      const h = 3 + Math.random() * 4;
      const rotation = outAngle * (180 / Math.PI) + (Math.random() - 0.5) * 30;
      return { startX, startY, endX, endY, w, h, rotation, color: SHARD_COLORS[i % SHARD_COLORS.length] };
    });
  }, [rect]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-visible z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: p.startX, y: p.startY, scale: 1, opacity: 1, rotate: 0 }}
          animate={{
            x: p.endX,
            y: p.endY,
            scale: 0.1,
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.1,
            ease: "easeOut",
          }}
          className="absolute inset-0 m-auto rounded-[2px]"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

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

const CHART_ICONS: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  line: TrendingUp, bar: BarChart3, pie: PieChart, table: Table2, map: Map, flowchart: GitBranch,
};

const LINE_CHART_COLORS = ["#EFA92D", "#D04A49", "#1FCD90"];

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
    layout: { padding: 0 },
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
          font: { family: "var(--font-inter)", size: 12 },
        },
        border: { display: false },
      },
      y: {
        grid: { color: "#E8E8DA" },
        ticks: {
          color: "#64725D",
          font: { family: "var(--font-inter)", size: 12 },
        },
        border: { display: false, dash: [8, 8], dashOffset: 0 },
      },
    },
  }), []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {yLabel && (
        <span
          className="shrink-0 text-center text-[14px] leading-[22px]"
          style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 400, color: "#64725D" }}
        >
          {yLabel}
        </span>
      )}
      <div className="flex-1 min-h-0">
        <Line data={chartData} options={options} />
      </div>
      {data.series.length > 0 && (
        <div className="shrink-0 flex items-center justify-center gap-6">
          {data.series.map((series, i) => {
            const color = LINE_CHART_COLORS[i] || series.color;
            return (
              <div key={series.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span
                  className="text-[14px] font-bold text-[#232323] whitespace-nowrap leading-[20px]"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {series.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
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
              <text x={padding.left - 8} y={y + 4} textAnchor="end" style={{ fontSize: 12 }} fill="#64725D" fontFamily="var(--font-inter)" fontWeight={400}>{Math.round(val)}</text>
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
              <text x={x + barW / 2} y={padding.top + plotH + h * 0.05} textAnchor="middle" style={{ fontSize: 12 }} fill="#64725D" fontFamily="var(--font-inter)" fontWeight={400}>{label}</text>
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
                  <text x={lx > cx ? lx + 4 : lx - 4} y={ly + 4} textAnchor={lx > cx ? "start" : "end"} style={{ fontSize: 14 }} fill="#374151" fontFamily="var(--font-inter)" fontWeight={500}>{seg.label} ({seg.value}%)</text>
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
              <th key={i} className="px-3 py-2 text-left font-medium text-[#232323] border border-[#D4D4C8] text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#FDFFF7]"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 border border-[#D4D4C8] text-[#4B5563] font-normal text-[12px]" style={{ fontFamily: "var(--font-inter)" }}>{cell}</td>
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
              {edge.label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" style={{ fontSize: 12 }} fill="#6B7280" fontFamily="var(--font-inter)" fontWeight={400}>{edge.label}</text>}
            </g>
          );
        })}
        {data.nodes.map((node) => (
          <g key={node.id}>
            <rect x={node.x * sx} y={node.y * sy} width={node.width * sx} height={node.height * sy} rx="8" fill={node.color} stroke="#232323" strokeWidth="1" opacity="0.9" />
            <foreignObject x={node.x * sx} y={node.y * sy} width={node.width * sx} height={node.height * sy}>
              <div className="w-full h-full flex items-center justify-center text-center px-1">
                <span className="font-medium text-[#1D2838] leading-tight whitespace-pre-line" style={{ fontFamily: "var(--font-inter)", fontSize: 14 }}>{node.label}</span>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ChartCardPreview({ chart }: { chart: ChartItem }) {
  // Preload the chart but render at small scale — identical to renderChart but
  // the parent scales it down, so we just use the same renderer.
  return <ChartPreview chart={chart} />;
}

// ── Inline ghost suggestion component ───────────────────────────────

function GhostSuggestion({
  textareaRef,
  input,
  suggestion,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  input: string;
  suggestion: string;
}) {
  const [ghost, setGhost] = useState<string>("");

  useEffect(() => {
    const el = textareaRef.current;
    if (!el || el.selectionStart === null) {
      setGhost("");
      return;
    }
    const start = el.selectionStart;
    const textBeforeCursor = input.slice(0, start);
    const wordStart = textBeforeCursor.search(/\S+$/);
    const currentWord = wordStart === -1 ? "" : textBeforeCursor.slice(wordStart);
    const tail = suggestion.slice(currentWord.length);
    setGhost(textBeforeCursor + tail + input.slice(start));
  }, [textareaRef, input, suggestion]);

  return (
    <div
      className="absolute inset-0 pointer-events-none text-[14px] font-bold leading-[22px] whitespace-pre-wrap break-words overflow-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
      aria-hidden="true"
    >
      <span className="text-[#000000]">{ghost.slice(0, input.length)}</span>
      <span className="text-[#A7A794]" style={{ opacity: 0.6 }}>{ghost.slice(input.length)}</span>
    </div>
  );
}

// ── Stage card component ──────────────────────────────────────────────

type StageStatus = "done" | "in_progress" | "available" | "locked";

const STAGE_TITLES = ["题目改写", "概览", "主线细节一", "主线细节二"];
const STAGE_SUBTITLES = ["Introduction", "Overview", "Details 1", "Details 2"];
const STAGE_BADGES = ["段落一", "段落二", "段落三", "段落四"];
const STAGE_DESCRIPTIONS = [
  "把题目用自己的话重新表达，不加入任何分析或观点。",
  "用一句话概括图表的主要趋势或特征。",
  "挑选关键数据展开详细描述。",
  "对比不同类别，补充细节数据。",
];

function StageCard({
  stage,
  status,
  isActive,
  onClick,
  children,
}: {
  stage: number;
  status: StageStatus;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const isLocked = status === "locked";
  const isDone = status === "done";
  const isInProgress = status === "in_progress";
  const isClickable = !isLocked && onClick != null;

  if (stage > 4) {
    // Final scoring stage — simple button
    return (
      <motion.button
        onClick={onClick}
        disabled={!isClickable}

        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-[1.5px] border-dashed transition-all ${
          isClickable
            ? "bg-[#FCFF98] border-black cursor-pointer"
            : "bg-[#F5F5F0] border-[#D4D4C8] cursor-default"
        }`}
        style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
      >
        <Trophy className={`w-5 h-5 ${isLocked ? "text-[#9CA3AF]" : "text-[#232323]"}`} />
        <span className={`text-[14px] font-black ${isLocked ? "text-[#9CA3AF]" : "text-[#232323]"}`}>
          最终评分
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={false}
      onClick={isClickable ? onClick : undefined}
      className={`flex flex-col gap-4 px-4 py-[13px] rounded-2xl border-[1.5px] transition-colors ${
        isClickable ? "cursor-pointer" : ""
      } border-transparent`}
      style={{ backgroundColor: "#F0F6DB" }}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 group relative">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 p-2"
          style={{ backgroundColor: "#DBE3C2" }}
        >
          {isDone ? (
            <img src="/tick-circle.svg" alt="completed" className="w-6 h-6" />
          ) : isLocked ? (
            <img src="/lock.svg" alt="locked" className="w-6 h-6" />
          ) : (
            <img src="/unlock.svg" alt="unlock" className="w-6 h-6" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col">
          <span
            className="text-[14px] leading-[22px] text-[#191919] font-bold"
            style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
          >
            {STAGE_TITLES[stage - 1]}
          </span>
          <span className="text-[12px] leading-[20px] text-[#969A86] font-medium"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {STAGE_SUBTITLES[stage - 1]}
          </span>
        </div>

        {/* Badge */}
        <div
          className="rounded-lg shrink-0 flex items-center"
          style={{ backgroundColor: isInProgress ? "#56F7AC" : "#DBE3C2", padding: "4px 8px" }}
        >
          <span className="text-[12px] leading-[20px] font-medium text-[#191919]" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
            {STAGE_BADGES[stage - 1]}
          </span>
        </div>

        {/* Hover tooltip */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10"
        >
          <div
            className="px-3 py-2 rounded-xl text-[12px] leading-[18px] text-[#232323] whitespace-nowrap shadow-sm"
            style={{ backgroundColor: "#FFFCF4", fontFamily: "var(--font-langyuan), sans-serif" }}
          >
            <span className="font-bold">{STAGE_TITLES[stage - 1]}: </span>
            {STAGE_DESCRIPTIONS[stage - 1]}
          </div>
        </div>
      </div>

      {/* Active stage content */}
      {isActive && children}
    </motion.div>
  );
}

// Internal — separate from renderChart to avoid re-render coupling with the
// large detail chart.  Uses identical switch.
function ChartPreview({ chart }: { chart: ChartItem }) {
  switch (chart.type) {
    case "line": return <LineChart data={chart.data as LineChartData} yLabel={chart.yLabel} />;
    case "bar": return <BarChartSVG data={chart.data as BarChartData} />;
    case "pie": return <PieChartSVG data={chart.data as PieChartData} />;
    case "table": return <TableChart data={chart.data as TableData} />;
    case "map": return <ParametricMapChart data={chart.data as FlowchartData} />;
    case "flowchart": return <FlowChartSVG data={chart.data as FlowchartData} />;
  }
}

const renderChart = (item: ChartItem) => {
  switch (item.type) {
    case "line": return <LineChart data={item.data as LineChartData} yLabel={item.yLabel} />;
    case "bar": return <BarChartSVG data={item.data as BarChartData} />;
    case "pie": return <PieChartSVG data={item.data as PieChartData} />;
    case "table": return <TableChart data={item.data as TableData} />;
    case "map": return <ParametricMapChart data={item.data as FlowchartData} />;
    case "flowchart": return <FlowChartSVG data={item.data as FlowchartData} />;
  }
};

export default function ChartChallenge({ view: externalView, onViewChange }: { view?: "list" | "detail"; onViewChange?: (view: "list" | "detail") => void }) {
  const [internalView, setInternalView] = useState<"list" | "detail">("list");
  const isControlled = externalView !== undefined;
  const view = isControlled ? externalView : internalView;
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const pendingExitRef = useRef<(() => void) | null>(null);

  const setView = useCallback((next: "list" | "detail") => {
    // 从 detail 返回 list 时弹窗确认
    if (view === "detail" && next === "list") {
      pendingExitRef.current = () => {
        if (!isControlled) setInternalView(next);
        onViewChange?.(next);
      };
      setShowExitConfirm(true);
      return;
    }
    if (!isControlled) setInternalView(next);
    onViewChange?.(next);
  }, [isControlled, onViewChange, view]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    pendingExitRef.current?.();
    pendingExitRef.current = null;
  }, []);

  const cancelExit = useCallback(() => {
    setShowExitConfirm(false);
    pendingExitRef.current = null;
  }, []);

  // 浏览器刷新/关闭时提示
  useEffect(() => {
    if (view !== "detail") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [view]);

  const [charts, setCharts] = useState<ChartItem[] | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [activeType, setActiveType] = useState<ChartType>("line");
  const [activeIndex, setActiveIndex] = useState(0);

  const [paragraphsData, setParagraphsData] = useState<Record<string, {
    paragraph1: ParagraphWritingData; paragraph2: ParagraphWritingData;
    paragraph3: ParagraphWritingData; paragraph4: ParagraphWritingData;
  }> | null>(null);

  const [unlockedParagraphs, setUnlockedParagraphs] = useState<Record<string, Set<number>>>({});
  const [xp, setXp] = useState(0);

  const [activeParagraph, setActiveParagraph] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionFeedback, setQuestionFeedback] = useState<Record<string, "correct" | "incorrect">>({});
  const [shakeError, setShakeError] = useState(false);
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
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [stageCompleteMessage, setStageCompleteMessage] = useState("");
  const [expressions, setExpressions] = useState<string[]>([]);
  const [expressionsLoading, setExpressionsLoading] = useState(false);
  type ExprDetail = { translation: string; examples: string[] };
  const [exprDetails, setExprDetails] = useState<Record<string, ExprDetail>>({});
  const [hoveredExpr, setHoveredExpr] = useState<string | null>(null);
  const [showExpressionsModal, setShowExpressionsModal] = useState(false);

  const shuffledRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Reset stage and prepare new shuffled questions when chartKey changes
  useEffect(() => {
    setParagraphInput("");
    setParagraphEvaluations({});
    setCurrentQuestionIndex(0);
    setQuestionFeedback({});
    setDiscoveredClues([]);
    setStageComplete(false);
    setExpressions([]);
    setActiveParagraph(1);
    shuffledRef.current = false;
  }, [chartKey]);

  // Shuffle questions when currentStageData is ready
  useEffect(() => {
    if (currentStageData && !shuffledRef.current) {
      shuffledRef.current = true;
      const shuffled = shuffleQuestionsAndOptions(currentStageData.questions);
      setShuffledQuestions(shuffled);
    }
  }, [currentStageData]);

  useEffect(() => {
    // Restore saved paragraph input when entering a stage
    setParagraphInput(paragraphInputs[activeParagraph] || "");
  }, [activeParagraph, paragraphInputs, chartKey]);

  useEffect(() => {
    if (stageComplete) {
      setStageCompleteMessage(STAGE_COMPLETE_MESSAGES[Math.floor(Math.random() * STAGE_COMPLETE_MESSAGES.length)]);
      fetchExpressions();
    } else {
      setExpressions([]);
    }
  }, [stageComplete]);

  const fetchExpressions = useCallback(async () => {
    setExpressionsLoading(true);
    try {
      const res = await fetch("/api/generate-expressions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paragraphNumber: activeParagraph,
          chartTitle: currentChart?.title || "",
          chartQuestion: currentChart?.question || "",
          clues: discoveredClues,
          keywords: currentStageData?.keywords || [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.expressions) setExpressions(data.expressions);
      }
    } catch {
      // ignore
    } finally {
      setExpressionsLoading(false);
    }
  }, [activeParagraph, currentChart, discoveredClues, currentStageData]);

  const fetchExprDetail = useCallback(async (expr: string) => {
    if (exprDetails[expr]) return;
    try {
      const res = await fetch("/api/expression-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: expr }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translation) {
          setExprDetails((prev) => ({
            ...prev,
            [expr]: {
              translation: data.translation,
              examples: Array.isArray(data.examples) ? data.examples.slice(0, 2) : [],
            },
          }));
        }
      }
    } catch {
      // ignore
    }
  }, [exprDetails]);

  const totalQuestions = shuffledQuestions.length;
  const currentQ = shuffledQuestions[currentQuestionIndex] || null;

  const [burstOverlay, setBurstOverlay] = useState<{ w: number; h: number } | null>(null);

  const handleAnswer = (optKey: string) => {
    if (!currentQ || questionFeedback[currentQ.id] === "correct") return;
    const isCorrect = optKey === currentQ.correctAnswer;
    if (isCorrect) {
      setQuestionFeedback((prev) => ({ ...prev, [currentQ.id]: "correct" }));
      const textMatch = currentQ.options.find((o) => o.startsWith(optKey));
      const clue = textMatch ? textMatch.replace(/^[A-D]\s+/, "") : "";
      if (clue && !discoveredClues.includes(clue)) {
        setDiscoveredClues((prev) => [...prev, clue]);
      }
      try {
        const audio = new Audio("/Audios/matched.mp3");
        audio.volume = 0.6;
        audio.play().catch(() => {});
      } catch {
        // ignore
      }
      setBurstOverlay({ w: 140, h: 48 });
      setTimeout(() => setBurstOverlay(null), 1200);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setStageComplete(true);
      }
    } else {
      // 错误音效 + shake 动画，所有选项闪红，用户可以重新答题
      try {
        const audio = new Audio("/Audios/error.mp3");
        audio.volume = 0.6;
        audio.play().catch(() => {});
      } catch { /* ignore */ }
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
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
      // Save current paragraph input before switching
      setParagraphInputs((inputs) => ({ ...inputs, [activeParagraph]: paragraphInput }));
      setCurrentQuestionIndex(0);
      setQuestionFeedback({});
      setDiscoveredClues([]);
      setStageComplete(false);
      setExpressions([]);
      setParagraphInput("");
      shuffledRef.current = false;
      setActiveParagraph((prev) => prev + 1);
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
        unlockParagraph(activeParagraph);

        // Auto-advance to next stage after submission
        if (activeParagraph < 4) {
          setCurrentQuestionIndex(0);
          setQuestionFeedback({});
          setDiscoveredClues([]);
          setStageComplete(false);
          setExpressions([]);
          setParagraphInput("");
          shuffledRef.current = false;
          setActiveParagraph((prev) => prev + 1);
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

  // 点击闯关地图节点切换关卡
  const handleStageClick = (stage: number) => {
    if (stage === 5) {
      // 最终评分：如果4段都完成，触发评分
      if (completedParagraphs.size >= 4) {
        handleEvaluateEssay();
      }
      return;
    }
    if (stage === activeParagraph) return;
    // 只有已解锁的关卡才能切换（当前关卡始终可访问，其他关卡需提交上一段落后才解锁）
    if (!unlockedParagraphNumbers.has(stage)) return;
    // 保存当前段落输入
    setParagraphInputs((inputs) => ({ ...inputs, [activeParagraph]: paragraphInput }));
    // 切换到目标关卡
    setActiveParagraph(stage);

    if (completedParagraphs.has(stage)) {
      // 已完成关卡：加载已提交的段落，保留完成状态
      setParagraphInput(paragraphInputs[stage] || "");
      setStageComplete(true);
    } else {
      // 未完成关卡：重置答题相关状态
      setCurrentQuestionIndex(0);
      setQuestionFeedback({});
      setDiscoveredClues([]);
      setStageComplete(false);
      setExpressions([]);
      setParagraphInput("");
      shuffledRef.current = false;
    }
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

  if (!currentChart && view === "detail") return null;

  // ── Card click handler ────────────────────────────────────────────
  const handleCardClick = (type: ChartType, idx: number) => {
    setActiveType(type);
    setActiveIndex(idx);
    setView("detail");
  };

  return (
    <>
      {/* ── List view ── */}
      {view === "list" && (
        <div className="flex flex-col flex-1 p-6 min-h-0">
          {/* Type tabs */}
          <div className="flex items-center gap-2.5 flex-wrap mb-6 shrink-0">
            {CHART_TYPE_ORDER.map((type) => {
              const Icon = CHART_ICONS[type];
              const isActive = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#ECECE1] text-[#232323]"
                      : "bg-[#ECECE0] text-[#949481] hover:text-[#555]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <Icon className="w-4 h-4" />
                  {CHART_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>

          {/* Chart cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {(typeCharts ?? []).map((chart, idx) => {
              const Icon = CHART_ICONS[chart.type];
              return (
                <div
                  key={chart.id}
                  onClick={() => handleCardClick(chart.type, idx)}
                  className="bg-white rounded-3xl text-left flex flex-col gap-3 transition-all hover:brightness-[0.97] overflow-hidden h-fit p-4 cursor-pointer"
                >
                  {/* Chart preview thumbnail — 16:9 */}
                  <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: "#F0F6DB" }}>
                    <div className="w-full h-full pointer-events-none" style={{ transform: "scale(0.6)", transformOrigin: "top left", width: "167%", height: "167%" }}>
                      <ChartCardPreview chart={chart} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#ECECE1] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#232323]" />
                      </div>
                      <span className="text-[11px] font-bold text-[#949481]" style={{ fontFamily: "var(--font-inter)" }}>
                        {CHART_TYPE_LABELS[chart.type]}
                      </span>
                    </div>
                    <h4 className="text-[15px] font-bold text-[#232323] leading-snug" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      {chart.title}
                    </h4>
                    <p className="text-[12px] text-[#8B8B7E] leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      {chart.question}
                    </p>
                  </div>
                </div>
              );
            })}
            {typeCharts?.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-20">
                <p className="text-[14px] text-[#949478]" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                  暂无该类型的图表题目
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Detail view (challenge) ── */}
      {view === "detail" && currentChart && (
      <>
      <div className="flex flex-col flex-1 min-h-0 relative bg-[#F0F6DB]" >
        <div className="flex flex-col gap-4 flex-1 min-h-0 p-6">
          {/* Content split */}
          <div className="flex gap-4 flex-col lg:flex-row flex-1 min-h-0">
            {/* Left column: Unified Roadmap + Stage Task panel */}
            <div className="w-full lg:w-[30%] flex flex-col gap-4 min-h-0 h-full">
              {/* Roadmap card */}
              <div
                className="flex flex-col gap-3 p-4 rounded-3xl flex-1 min-h-0"
                style={{ backgroundColor: "#FAFFE9" }}
              >
                {/* Header */}
                <div className="flex items-center justify-start gap-3">
                  <img src="/map_icon.svg" alt="map" className="w-6 h-6" />
                  <span
                    className="text-[14px] text-[#000000] font-bold"
                    style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
                  >
                    闯关地图
                  </span>
                </div>

                {/* Stage cards list */}
                <div className="flex flex-col gap-2 flex-1 min-h-0">
                  {/* Stage 1 */}
                  <StageCard
                    stage={1}
                    status={completedParagraphs.has(1) ? "done" : activeParagraph === 1 ? "in_progress" : "available"}
                    isActive={activeParagraph === 1}
                    onClick={() => handleStageClick(1)}
                  >
                    {/* Description + Clues */}
                    <div className="flex flex-col gap-3">
                      {completedParagraphs.has(activeParagraph) ? (
                        <div className="flex flex-col gap-2 p-3 rounded-xl border-[1.5px] border-[#52B543]" style={{ backgroundColor: "#FAFFE9" }}>
                          <p className="text-[13px] leading-[22px] text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            {paragraphInputs[activeParagraph] || paragraphInput}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FAFFE9" }}>
                          {[0, 1, 2].map((idx) => {
                            const clue = discoveredClues[idx];
                            if (clue) {
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center px-3 py-3 min-h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                  style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                                >
                                  <span className="text-[14px] font-bold text-[#232323] leading-[22px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    {idx + 1}. {clue}
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <div
                                key={idx}
                                className="flex items-center px-3 h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                              >
                                <span
                                  className="text-[14px] font-normal"
                                  style={{ color: "#A1A68B", fontFamily: "var(--font-langyuan), sans-serif" }}
                                >
                                  待发现线索
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </StageCard>

                  {/* Stage 2 */}
                  <StageCard
                    stage={2}
                    status={completedParagraphs.has(2) ? "done" : activeParagraph === 2 ? "in_progress" : unlockedParagraphNumbers.has(2) ? "available" : "locked"}
                    isActive={activeParagraph === 2}
                    onClick={unlockedParagraphNumbers.has(2) ? () => handleStageClick(2) : undefined}
                  >
                    {/* Description + Clues */}
                    <div className="flex flex-col gap-3">
                      {completedParagraphs.has(activeParagraph) ? (
                        <div className="flex flex-col gap-2 p-3 rounded-xl border-[1.5px] border-[#52B543]" style={{ backgroundColor: "#FAFFE9" }}>
                          <p className="text-[13px] leading-[22px] text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            {paragraphInputs[activeParagraph] || paragraphInput}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FAFFE9" }}>
                          {[0, 1, 2].map((idx) => {
                            const clue = discoveredClues[idx];
                            if (clue) {
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center px-3 py-3 min-h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                  style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                                >
                                  <span className="text-[14px] font-bold text-[#232323] leading-[22px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    {idx + 1}. {clue}
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <div
                                key={idx}
                                className="flex items-center px-3 h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                              >
                                <span
                                  className="text-[14px] font-normal"
                                  style={{ color: "#A1A68B", fontFamily: "var(--font-langyuan), sans-serif" }}
                                >
                                  待发现线索
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </StageCard>

                  {/* Stage 3 */}
                  <StageCard
                    stage={3}
                    status={completedParagraphs.has(3) ? "done" : activeParagraph === 3 ? "in_progress" : unlockedParagraphNumbers.has(3) ? "available" : "locked"}
                    isActive={activeParagraph === 3}
                    onClick={unlockedParagraphNumbers.has(3) ? () => handleStageClick(3) : undefined}
                  >
                    {activeParagraph === 3 && (
                      <div className="flex flex-col gap-3">
                        {completedParagraphs.has(activeParagraph) ? (
                          <div className="flex flex-col gap-2 p-3 rounded-xl border-[1.5px] border-[#52B543]" style={{ backgroundColor: "#FAFFE9" }}>
                            <p className="text-[13px] leading-[22px] text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                              {paragraphInputs[activeParagraph] || paragraphInput}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FAFFE9" }}>
                            {[0, 1, 2].map((idx) => {
                              const clue = discoveredClues[idx];
                              if (clue) {
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center px-3 py-3 min-h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                    style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                                  >
                                    <span className="text-[14px] font-bold text-[#232323] leading-[22px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                      {idx + 1}. {clue}
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center px-3 h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                  style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                                >
                                  <span
                                    className="text-[14px] font-normal"
                                    style={{ color: "#A1A68B", fontFamily: "var(--font-langyuan), sans-serif" }}
                                  >
                                    待发现线索
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </StageCard>

                  {/* Stage 4 */}
                  <StageCard
                    stage={4}
                    status={completedParagraphs.has(4) ? "done" : activeParagraph === 4 ? "in_progress" : unlockedParagraphNumbers.has(4) ? "available" : "locked"}
                    isActive={activeParagraph === 4}
                    onClick={unlockedParagraphNumbers.has(4) ? () => handleStageClick(4) : undefined}
                  >
                    {activeParagraph === 4 && (
                      <div className="flex flex-col gap-3">
                        {completedParagraphs.has(activeParagraph) ? (
                          <div className="flex flex-col gap-2 p-3 rounded-xl border-[1.5px] border-[#52B543]" style={{ backgroundColor: "#FAFFE9" }}>
                            <p className="text-[13px] leading-[22px] text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                              {paragraphInputs[activeParagraph] || paragraphInput}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FAFFE9" }}>
                            {[0, 1, 2].map((idx) => {
                              const clue = discoveredClues[idx];
                              if (clue) {
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center px-3 py-3 min-h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                    style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                                  >
                                    <span className="text-[14px] font-bold text-[#232323] leading-[22px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                      {idx + 1}. {clue}
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center px-3 h-[46px] gap-2 rounded-2xl border-[1.5px] border-dashed"
                                  style={{ backgroundColor: "#F0F6DB", borderColor: "#C9CCBC" }}
                                >
                                  <span
                                    className="text-[14px] font-normal"
                                    style={{ color: "#A1A68B", fontFamily: "var(--font-langyuan), sans-serif" }}
                                  >
                                    待发现线索
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </StageCard>

                  {/* Final scoring */}
                  <StageCard
                    stage={5}
                    status={completedParagraphs.size >= 4 ? "available" : "locked"}
                    onClick={completedParagraphs.size >= 4 ? () => handleStageClick(5) : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Right: Question area */}
            <div
              className="w-full lg:w-[70%] flex flex-col min-w-0 min-h-0 h-full p-4 gap-3 rounded-3xl"
              style={{ backgroundColor: "#FAFFE9" }}
            >
              {/* Inner question column */}
              <div className="flex flex-col gap-3 flex-1 min-h-0 min-w-0">
                {/* Header row: star + question bubble */}
                <div className="flex items-center gap-3 shrink-0">
                  <img
                    src="/logo2.svg"
                    alt="Yasee"
                    className="w-12 h-12 shrink-0"
                  />
                  <AnimatePresence mode="wait">
                    {currentQ && !stageComplete ? (
                      <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 rounded-3xl shrink-0 self-start flex items-center gap-2.5"
                        style={{ backgroundColor: "#56F7AC" }}
                      >
                        <p className="text-[14px] font-bold text-[#100F0E] whitespace-nowrap" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          {currentQ.question}
                        </p>
                        <span className="text-[14px] font-medium text-[#100F0E] whitespace-nowrap opacity-60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
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
                        className="px-4 py-3 rounded-3xl shrink-0 self-start"
                        style={{ backgroundColor: "#56F7AC" }}
                      >
                        <p className="text-[14px] font-bold text-[#100F0E] whitespace-nowrap" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          {stageCompleteMessage}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Chart card */}
                <div
                  className="flex flex-col gap-4 flex-1 min-h-0 p-4 rounded-3xl"
                  style={{ backgroundColor: "#F0F6DB" }}
                >
                  {/* Title + Description */}
                  <div className="flex flex-col gap-1 shrink-0 text-left">
                    <h3 className="text-[16px] font-bold leading-[26px]" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#100F0E" }}>
                      {currentChart.title}
                    </h3>
                    <p className="text-[14px] leading-[22px]" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, color: "#696356" }}>
                      {currentChart.question}
                    </p>
                  </div>

                  {/* Chart area */}
                  <div
                    className="flex-1 min-h-0 p-4 rounded-3xl"
                    style={{ backgroundColor: "#FAFFE9" }}
                  >
                    {renderChart(currentChart)}
                  </div>
                </div>

                {/* Answer grid or paragraph input */}
                {!stageComplete && currentQ ? (
                  <motion.div
                    className="grid grid-cols-2 gap-3 shrink-0 relative"
                    animate={shakeError ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                    transition={{ x: { duration: 0.4 } }}
                  >
                    {/* Particle burst overlay */}
                    {burstOverlay && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <ParticleBurst size={burstOverlay} />
                      </div>
                    )}
                    {currentQ.options.map((opt, oi) => {
                      const optKey = String.fromCharCode(65 + oi);
                      const fb = questionFeedback[currentQ.id];
                      const isCorrectAnswer = fb === "correct" && optKey === currentQ.correctAnswer;

                      let bg = "#F0F6DB";
                      let textColor = "#222222";
                      let border = "1.5px solid transparent";
                      let shadow = "0px 4px 0px 0px rgba(217, 223, 193, 1)";
                      if (isCorrectAnswer) { bg = "#ECFDF5"; textColor = "#065F46"; border = "1.5px solid #065F46"; shadow = "0px 4px 0px #A7F3D0"; }
                      else if (fb === "correct" && !isCorrectAnswer) { bg = "#F5F5F0"; textColor = "#9CA3AF"; border = "1.5px solid #D4D4C8"; shadow = "none"; }
                      else if (shakeError) { bg = "#FEE2E2"; textColor = "#991B1B"; border = "1.5px solid #F87171"; shadow = "0px 4px 0px #FCA5A5"; }

                      return (
                        <button
                          key={oi}
                          onClick={() => handleAnswer(optKey)}
                          disabled={fb === "correct"}
                          className="flex flex-row justify-center items-center gap-2.5 px-4 py-4 rounded-[99px] text-center text-[14px] font-bold transition-all hover:brightness-95 disabled:cursor-default"
                          style={{ backgroundColor: bg, color: textColor, fontFamily: "var(--font-inter), sans-serif", border, boxShadow: shadow }}
                        >
                          {opt.replace(/^[A-D]\s+/, "")}
                        </button>
                      );
                    })}
                  </motion.div>
                ) : stageComplete ? (
                  <div className="flex flex-col gap-2.5 shrink-0">
                    <div
                      className="flex flex-col gap-2.5 p-4 rounded-3xl border-[1.5px] h-[140px] min-h-[140px] relative"
                      style={{ backgroundColor: "#FAFFE9", borderColor: "#000000", boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="relative flex-1 min-h-0">
                        <textarea
                          ref={textareaRef}
                          value={paragraphInput}
                          onChange={(e) => {
                            setParagraphInput(e.target.value);
                            // Update suggestion based on current word
                            const el = textareaRef.current;
                            if (!el || el.selectionStart === null) return;
                            const v = e.target.value;
                            const start = el.selectionStart;
                            const textBeforeCursor = v.slice(0, start);
                            const wordStart = textBeforeCursor.search(/\S+$/);
                            const currentWord = wordStart === -1 ? "" : textBeforeCursor.slice(wordStart);
                            const autocompleteContext = {
                              chartTitle: currentChart?.title,
                              chartQuestion: currentChart?.question,
                              chartType: currentChart?.type,
                              keywords: currentStageData?.keywords,
                              clues: discoveredClues,
                              paragraphNumber: activeParagraph,
                              textBeforeCursor: textBeforeCursor,
                            };
                            setSuggestion(currentWord ? findAutocomplete(currentWord, autocompleteContext) : null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Tab" && suggestion) {
                              e.preventDefault();
                              const el = textareaRef.current;
                              if (!el || el.selectionStart === null) return;
                              const start = el.selectionStart;
                              // Recompute current word at cursor
                              const textBeforeCursor = paragraphInput.slice(0, start);
                              const wordStart = textBeforeCursor.search(/\S+$/);
                              const currentWord = wordStart === -1 ? "" : textBeforeCursor.slice(wordStart);
                              const tail = suggestion.slice(currentWord.length);
                              const newText =
                                paragraphInput.slice(0, start) + tail + paragraphInput.slice(start);
                              setParagraphInput(newText);
                              setSuggestion(null);
                              setTimeout(() => {
                                const newCursor = start + tail.length;
                                el.setSelectionRange(newCursor, newCursor);
                              }, 0);
                            }
                          }}
                          placeholder="The line graph illustrates..."
                          className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none text-[14px] font-bold leading-[22px] text-[#000000] placeholder:text-[#A7A794]"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        />
                        {/* Inline ghost suggestion */}
                        {suggestion && (
                          <GhostSuggestion
                            textareaRef={textareaRef}
                            input={paragraphInput}
                            suggestion={suggestion}
                          />
                        )}
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <span className="text-[12px] font-medium leading-[22px]" style={{ color: "#A7A794", fontFamily: "var(--font-langyuan), sans-serif" }}>
                          字词数: <span style={{ color: "#2C2C2C" }}>{paragraphInput.trim().split(/\s+/).filter(Boolean).length}</span>
                        </span>
                        <div className="flex items-center gap-2.5 relative">
                          {stageComplete && (
                            <button
                              onClick={() => setShowExpressionsModal(!showExpressionsModal)}
                              className="px-4 py-2.5 rounded-full text-[14px] text-[#2C2C2C] transition-all hover:brightness-95 flex items-center justify-center gap-2 border-[1.5px] border-[#000000]"
                              style={{ backgroundColor: "#FCFF98", fontFamily: "var(--font-langyuan), sans-serif" }}
                            >
                              <RefreshCw className="w-4 h-4" />
                              推荐表达
                            </button>
                          )}

                          {/* Dropdown overlay */}
                          {showExpressionsModal && (
                            <div
                              className="absolute bottom-full right-0 mb-2 z-50 bg-[#F1F2F7] rounded-3xl p-4 shadow-2xl flex flex-col gap-3"
                              style={{ minWidth: 280, maxWidth: 420 }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[14px] font-bold text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                  推荐表达
                                </span>
                                <button
                                  onClick={() => setShowExpressionsModal(false)}
                                  className="p-1 rounded-full hover:bg-black/5 transition-colors"
                                >
                                  <X className="w-4 h-4 text-[#080808]" />
                                </button>
                              </div>

                              {expressionsLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <div className="w-5 h-5 border-2 border-[#838AB1] border-t-transparent rounded-full animate-spin" />
                                </div>
                              ) : expressions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {expressions.map((expr, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-2.5 rounded-2xl text-[13px] font-bold text-[#404663] leading-[20px] cursor-pointer transition-all hover:brightness-95 relative"
                                      style={{ backgroundColor: "#E0E3F0", fontFamily: "var(--font-inter), sans-serif" }}
                                      onMouseEnter={() => {
                                        setHoveredExpr(expr);
                                        fetchExprDetail(expr);
                                      }}
                                      onMouseLeave={() => setHoveredExpr(null)}
                                      onClick={() => {
                                        setParagraphInput((prev) => {
                                          const trimmed = prev.trimEnd();
                                          return trimmed ? `${trimmed} ${expr}` : expr;
                                        });
                                        textareaRef.current?.focus();
                                      }}
                                    >
                                      {expr}
                                      {hoveredExpr === expr && exprDetails[expr] && (
                                        <div
                                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-2 rounded-xl text-[11px] font-medium text-[#232323] z-20 shadow-sm w-56"
                                          style={{ backgroundColor: "#FFFCF4", fontFamily: "var(--font-langyuan), sans-serif" }}
                                        >
                                          <div className="font-bold mb-0.5">{exprDetails[expr].translation}</div>
                                          {exprDetails[expr].examples.length > 0 && (
                                            <ul className="list-disc pl-3 space-y-0.5 text-[10px] text-[#444444]">
                                              {exprDetails[expr].examples.map((ex, idx) => (
                                                <li key={idx}>{ex}</li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              ) : null}

                              <button
                                onClick={fetchExpressions}
                                disabled={expressionsLoading}
                                className="w-full px-4 py-2.5 rounded-full text-[13px] font-normal text-[#440044] bg-white transition-all hover:brightness-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{
                                  boxShadow: "0px 4px 0px 0px rgba(173, 173, 173, 0.25)",
                                  fontFamily: "var(--font-langyuan), sans-serif",
                                }}
                              >
                                <RefreshCw className={`w-4 h-4 ${expressionsLoading ? "animate-spin" : ""}`} />
                                换一组
                              </button>
                            </div>
                          )}

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

                  </div>
                ) : null}

              </div>
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
                  className="bg-white rounded-3xl p-6 w-full max-w-[720px] max-h-[80vh] overflow-y-auto shadow-2xl"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
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
                    const starRating = Math.max(1, Math.min(5, Math.round(ev.band / 9 * 5 * 2) / 2));
                    const passed = starRating > 2.5;
                    const fullStars = Math.floor(starRating);
                    const hasHalfStar = starRating % 1 >= 0.5;
                    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                    return (
                      <>
                        <div className="flex items-baseline gap-2 mb-5">
                          <span className="text-[14px] font-bold text-[#64725D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            得分:
                          </span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: fullStars }).map((_, i) => (
                              <Star key={`full-${i}`} className="w-6 h-6 text-[#F5C518] fill-[#F5C518]" />
                            ))}
                            {hasHalfStar && (
                              <div className="relative w-6 h-6">
                                <Star className="absolute inset-0 w-6 h-6 text-[#D4D4C8] fill-[#D4D4C8]" />
                                <div className="absolute inset-0 overflow-hidden w-[50%]">
                                  <Star className="w-6 h-6 text-[#F5C518] fill-[#F5C518]" />
                                </div>
                              </div>
                            )}
                            {Array.from({ length: emptyStars }).map((_, i) => (
                              <Star key={`empty-${i}`} className="w-6 h-6 text-[#D4D4C8] fill-[#D4D4C8]" />
                            ))}
                          </div>
                          <span className="text-[14px] text-[#64725D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            {starRating.toFixed(1)} / 5
                          </span>
                        </div>

                        {!passed && (
                          <p className="text-[13px] text-[#EF4444] mb-4" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                            需要达到 3 星以上才能进入下一关，请根据建议修改后重新提交。
                          </p>
                        )}

                        {/* User's original paragraph */}
                        <div className="mb-4">
                          <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>你的段落</h4>
                          <p className="text-[12px] font-bold text-[#232323] leading-relaxed p-3 rounded-xl bg-[#F0F6DB]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            {paragraphInputs[activeParagraph] || ""}
                          </p>
                        </div>

                        {ev.strengths.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>优点</h4>
                            <ul className="flex flex-col gap-1">
                              {ev.strengths.map((s, i) => (
                                <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ev.issues.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>问题</h4>
                            <ul className="flex flex-col gap-1">
                              {ev.issues.map((s, i) => (
                                <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ev.suggestions.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>改进建议</h4>
                            <ul className="flex flex-col gap-1">
                              {ev.suggestions.map((s, i) => (
                                <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ev.band8Rewrite && (
                          <div className="mb-2">
                            <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>Band 8+ 改写参考</h4>
                            <p className="text-[12px] font-bold text-[#232323] leading-relaxed p-3 rounded-xl bg-[#F0F6DB]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                              {ev.band8Rewrite}
                            </p>
                          </div>
                        )}

                        {passed && activeParagraph === 4 ? (
                          <button
                            onClick={() => { setShowParagraphResult(false); handleEvaluateEssay(); }}
                            disabled={evaluating}
                            className="mt-4 w-full px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                            style={{ backgroundColor: "#AFFF8A", fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {evaluating ? "评分中..." : "查看整篇评分 →"}
                          </button>
                        ) : passed ? (
                          <button
                            onClick={() => { setShowParagraphResult(false); handleNextStage(); }}
                            className="mt-4 w-full px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                            style={{ backgroundColor: "#AFFF8A", fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            进入下一关 →
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowParagraphResult(false)}
                            className="mt-4 w-full px-6 py-2.5 rounded-full text-sm font-bold text-[#232323] transition-colors"
                            style={{ backgroundColor: "#E5E5C2", fontFamily: "var(--font-inter), sans-serif" }}
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

      {/* ---- 整篇文章评分 弹窗 ---- */}
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
                  className="bg-white rounded-3xl p-6 w-full max-w-[720px] max-h-[80vh] overflow-y-auto shadow-2xl"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
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
                    <span className="text-[14px] font-bold text-[#64725D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      总得分:
                    </span>
                    <span className="text-[36px] font-black text-[#52B543]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      {essayEvaluation.band.toFixed(1)}
                    </span>
                    <span className="text-[14px] text-[#64725D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      / 9.0
                    </span>
                  </div>

                  {essayEvaluation.paragraphBands.length === 4 && (
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {essayEvaluation.paragraphBands.map((b, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#F0F6DB]">
                          <span className="text-[11px] text-[#64725D]" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                            段落 {i + 1}
                          </span>
                          <span className="text-[16px] font-bold text-[#232323]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            {b.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {essayEvaluation.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>优点</h4>
                      <ul className="flex flex-col gap-1">
                        {essayEvaluation.strengths.map((s, i) => (
                          <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                            • {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {essayEvaluation.suggestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>改进建议</h4>
                      <ul className="flex flex-col gap-1">
                        {essayEvaluation.suggestions.map((s, i) => (
                          <li key={i} className="text-[12px] text-[#64725D] leading-relaxed" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                            • {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {essayEvaluation.band8Rewrite && (
                    <div className="mb-2">
                      <h4 className="text-[13px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>Band 8+ 改写参考</h4>
                      <p className="text-[12px] font-bold text-[#232323] leading-relaxed p-3 rounded-xl bg-[#F0F6DB]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
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
                className="fixed top-0 right-0 z-50 h-full w-[360px] shadow-2xl flex flex-col"
                style={{ backgroundColor: "#FAFFE9" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 shrink-0">
                  <div className="flex items-center justify-center gap-3">
                    <img src="/map_icon.svg" alt="闯关地图" className="w-6 h-6" />
                    <h2
                      className="text-[14px] text-[#000000] font-bold"
                      style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
                    >
                      闯关地图
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowRoadmap(false)}
                    className="w-8 h-8 rounded-full bg-[#ECECD9] hover:bg-[#E0E0CC] flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-[#080808]" />
                  </button>
                </div>

                {/* XP */}
                <div className="px-5 pb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#AFFF8A] border border-[#232323] flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#232323]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#808771]" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>总经验值</p>
                      <p className="text-lg font-black text-[#1D2838]" style={{ fontFamily: "var(--font-inter)" }}>{xp} XP</p>
                    </div>
                  </div>
                </div>

                {/* Stage cards */}
                <div className="flex-1 px-4">
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((stage) => {
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

                      const isDone = completedParagraphs.has(stage);

                      return (
                        <StageCard
                          key={stage}
                          stage={stage}
                          status={isDone ? "done" : isCurrent ? "in_progress" : isLocked ? "locked" : "available"}
                          isActive={isCurrent}
                          onClick={isLocked ? undefined : () => { handleStageClick(stage); setShowRoadmap(false); }}
                        >
                          {isCurrent && (
                            <div className="flex flex-col gap-3">

                              {/* Progress for stage 1 (quiz completion) */}
                              {stage === 1 && !stageCompleteForThis && (
                                <div className="p-3 rounded-xl" style={{ backgroundColor: "#FAFFE9" }}>
                                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                                    <span className="text-[#808771]" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>答题进度</span>
                                    <span className="font-bold text-[#232323]" style={{ fontFamily: "var(--font-inter)" }}>{questionsDone}/{questionsTotal}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {stageQuestions?.map((q) => {
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
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              )}


                            </div>
                          )}
                        </StageCard>
                      );
                    })}

                    {/* Final scoring */}
                    <StageCard
                      stage={5}
                      status={completedParagraphs.size >= 4 ? "available" : "locked"}
                      onClick={completedParagraphs.size >= 4 ? () => { handleStageClick(5); setShowRoadmap(false); } : undefined}
                    />
                  </div>
                </div>

                {/* Bottom action */}
                <div className="px-4 py-4 shrink-0">
                  <button
                    onClick={() => setShowRoadmap(false)}
                    className="w-full py-3 rounded-full bg-[#AFFF8A] border-[1.5px] border-[#232323] text-sm font-black text-[#232323] hover:bg-[#98e87a] transition-colors flex items-center justify-center gap-2 shadow-[0_2px_0_#222222]"
                    style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
                  >
                    {completedParagraphs.size >= 4 ? "领取大奖" : "继续闯关"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Exit confirm dialog */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-[380px] shadow-2xl text-center">
              <p className="text-[16px] font-bold text-[#232323] mb-2" style={{ fontFamily: "var(--font-langyuan), sans-serif" }}>
                离开当前页面
              </p>
              <p className="text-[14px] text-[#6B7280] mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                离开该页面将不会保存当前进度，是否确定？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelExit}
                  className="flex-1 py-3 rounded-full border-[1.5px] border-[#232323] text-sm font-black text-[#232323]"
                  style={{ fontFamily: "var(--font-langyuan), sans-serif", backgroundColor: "#F5F5F0" }}
                >
                  取消
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 py-3 rounded-full bg-[#EF4444] border-[1.5px] border-[#232323] text-sm font-black text-white"
                  style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
                >
                  确认离开
                </button>
              </div>
            </div>
          </div>
        )}
      </>
      )}
    </>
  );
}
