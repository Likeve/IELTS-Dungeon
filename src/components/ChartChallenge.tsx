"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart3, PieChart, Table2, Map, GitBranch, ChevronLeft, ChevronRight, Zap, CheckCircle2, XCircle, Lock, ArrowRight, Loader2, Send, RefreshCw, Lightbulb, Target, BookOpen, FileText, Sparkles, AlertCircle } from "lucide-react";
import {
  ChartItem,
  ChartType,
  CHART_TYPE_LABELS,
  CHART_TYPE_ORDER,
  LineChartData,
  BarChartData,
  PieChartData,
  TableData,
  FlowchartData,
} from "@/data/ieltsCharts";
import { PARAGRAPHS_DATA, ChartParagraphs, ParagraphWritingData } from "@/data/ieltsChartsParagraphs";

const CHART_ICONS: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  line: TrendingUp,
  bar: BarChart3,
  pie: PieChart,
  table: Table2,
  map: Map,
  flowchart: GitBranch,
};

const STORAGE_KEY = "ielts_writing_progress";

interface StoredProgress {
  unlocked: Record<string, number[]>;
  xp: number;
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
  } catch {
    return null;
  }
}

function saveProgress(unlocked: Record<string, Set<number>>, xp: number) {
  try {
    const unlockedArray: Record<string, number[]> = {};
    for (const key of Object.keys(unlocked)) {
      unlockedArray[key] = Array.from(unlocked[key]).sort();
    }
    const data: StoredProgress = { unlocked: unlockedArray, xp };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function LineChart({ data, xLabel, yLabel }: { data: LineChartData; xLabel?: string; yLabel?: string }) {
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const legendH = 24;
  const legendGap = 24;
  const w = 500;
  const h = 380;
  const bottomExtra = 16 + 18 + 6 + legendGap + legendH;
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom - bottomExtra;
  const allValues = data.series.flatMap((s) => s.values);
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);
  const range = maxVal - minVal || 1;
  const xScale = (i: number) => padding.left + (i / (data.labels.length - 1)) * plotW;
  const yScale = (v: number) => padding.top + plotH - ((v - minVal) / range) * plotH;
  const yTicks = 5;
  const step = range / (yTicks - 1);
  const legendItemW = (w - padding.left - padding.right) / data.series.length;
  const plotBottom = padding.top + plotH;
  const labelY = plotBottom + 16;
  const xLabelY = labelY + 18;
  const legendTop = xLabelY + 6 + legendGap;
  const legendCenterY = legendTop + legendH / 2 + 4;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {Array.from({ length: yTicks }).map((_, i) => {
        const val = minVal + step * i;
        const y = yScale(val);
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9CA3AF">{Math.round(val)}</text>
          </g>
        );
      })}
      {data.labels.map((label, i) => (<text key={i} x={xScale(i)} y={labelY} textAnchor="middle" className="text-[10px]" fill="#6B7280">{label}</text>))}
      {xLabel && (<text x={w / 2} y={xLabelY} textAnchor="middle" className="text-[11px] font-semibold" fill="#4B5563">{xLabel}</text>)}
      {yLabel && (<text x={12} y={h / 2} textAnchor="middle" transform={`rotate(-90, 12, ${h / 2})`} className="text-[11px] font-semibold" fill="#4B5563">{yLabel}</text>)}
      {data.series.map((series) => {
        const pts = series.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
        return (
          <g key={series.name}>
            <polyline points={pts} fill="none" stroke={series.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {series.values.map((v, i) => (<circle key={i} cx={xScale(i)} cy={yScale(v)} r="4" fill={series.color} stroke="#fff" strokeWidth="1.5" />))}
          </g>
        );
      })}
      {data.series.map((series, i) => {
        const legendX = padding.left + i * legendItemW + legendItemW / 2;
        const textW = series.name.length * 6 + 20;
        return (
          <g key={`legend-${series.name}`}>
            <line x1={legendX - textW / 2} y1={legendCenterY} x2={legendX - textW / 2 + 14} y2={legendCenterY} stroke={series.color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={legendX - textW / 2 + 7} cy={legendCenterY} r="3.5" fill={series.color} stroke="#fff" strokeWidth="1" />
            <text x={legendX - textW / 2 + 20} y={legendCenterY + 4} textAnchor="start" className="text-[10px] font-bold" fill="#4B5563">{series.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function BarChartSVG({ data, xLabel, yLabel }: { data: BarChartData; xLabel?: string; yLabel?: string }) {
  const padding = { top: 30, right: 20, bottom: 60, left: 60 };
  const w = 500;
  const h = 300;
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;
  const maxVal = Math.max(...data.values);
  const barWidth = Math.min(40, plotW / data.labels.length - 12);
  const yTicks = 5;
  const step = maxVal / (yTicks - 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {Array.from({ length: yTicks }).map((_, i) => {
        const val = step * i;
        const y = padding.top + plotH - (val / maxVal) * plotH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9CA3AF">{Math.round(val)}</text>
          </g>
        );
      })}
      {data.labels.map((label, i) => {
        const x = padding.left + (i / data.labels.length) * plotW + (plotW / data.labels.length - barWidth) / 2;
        const val = data.values[i];
        const barH = (val / maxVal) * plotH;
        const y = padding.top + plotH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx="4" fill={data.color} opacity="0.85" />
            <text x={x + barWidth / 2} y={h - padding.bottom + 18} textAnchor="middle" className="text-[10px]" fill="#6B7280">{label}</text>
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-[11px] font-bold" fill="#374151">{typeof val === "number" && val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}</text>
          </g>
        );
      })}
      {xLabel && (<text x={w / 2} y={h - 6} textAnchor="middle" className="text-[11px] font-semibold" fill="#4B5563">{xLabel}</text>)}
      {yLabel && (<text x={12} y={h / 2} textAnchor="middle" transform={`rotate(-90, 12, ${h / 2})`} className="text-[11px] font-semibold" fill="#4B5563">{yLabel}</text>)}
    </svg>
  );
}

function PieChartSVG({ data }: { data: PieChartData }) {
  const cx = 160;
  const cy = 160;
  const r = 120;
  const total = data.segments.reduce((s, seg) => s + seg.value, 0);
  const segmentsWithAngles = useMemo(() => {
    return data.segments.reduce<{ seg: PieChartData["segments"][number]; startAngle: number; endAngle: number }[]>(
      (acc, seg) => {
        const cumulative = acc.length > 0 ? acc[acc.length - 1].endAngle * total / 360 : 0;
        const startAngle = (cumulative / total) * 360;
        const endAngle = ((cumulative + seg.value) / total) * 360;
        return [...acc, { seg, startAngle, endAngle }];
      },
      []
    );
  }, [data.segments, total]);
  return (
    <svg viewBox="0 0 400 320" className="w-full h-auto">
      {segmentsWithAngles.map(({ seg, startAngle, endAngle }, i) => {
        const large = endAngle - startAngle > 180 ? 1 : 0;
        const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = cx + r * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = cy + r * Math.sin((endAngle - 90) * Math.PI / 180);
        const midAngle = (startAngle + endAngle) / 2 - 90;
        const lx = cx + (r + 30) * Math.cos(midAngle * Math.PI / 180);
        const ly = cy + (r + 30) * Math.sin(midAngle * Math.PI / 180);
        return (
          <g key={i}>
            <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={seg.color} stroke="#fff" strokeWidth="2" />
            {seg.value / total > 0.06 && (
              <>
                <line x1={x1 + (x2 - x1) * 0.5} y1={y1 + (y2 - y1) * 0.5} x2={lx} y2={ly} stroke={seg.color} strokeWidth="1" opacity="0.6" />
                <text x={lx > cx ? lx + 4 : lx - 4} y={ly + 4} textAnchor={lx > cx ? "start" : "end"} className="text-[10px] font-semibold" fill="#374151">{seg.label} ({seg.value}%)</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TableChart({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#F3FAE3]">
            {data.headers.map((h, i) => (<th key={i} className="px-4 py-2.5 text-left font-black text-[#232323] border border-[#ECECD9] text-xs">{h}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#FDFFF7]"}>
              {row.map((cell, ci) => (<td key={ci} className="px-4 py-2.5 border border-[#ECECD9] text-[#4B5563] font-medium text-xs">{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapChart({ data }: { data: FlowchartData }) {
  const viewW = 420;
  const viewH = 420;
  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full h-auto">
      {data.edges.map((edge, i) => {
        const fn = data.nodes.find((n) => n.id === edge.from);
        const tn = data.nodes.find((n) => n.id === edge.to);
        if (!fn || !tn) return null;
        const x1 = fn.x + fn.width / 2;
        const y1 = fn.y + fn.height / 2;
        const x2 = tn.x + tn.width / 2;
        const y2 = tn.y + tn.height / 2;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray={edge.label ? "6,3" : ""} />
            {edge.label && (<text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" className="text-[10px] font-bold" fill="#6B7280">{edge.label}</text>)}
          </g>
        );
      })}
      {data.nodes.map((node) => (
        <g key={node.id}>
          <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="8" fill={node.color} stroke="#232323" strokeWidth="1.5" opacity="0.9" />
          <foreignObject x={node.x} y={node.y} width={node.width} height={node.height}>
            <div className="w-full h-full flex items-center justify-center text-center px-1">
              <span className="text-[10px] font-black text-[#1D2838] leading-tight whitespace-pre-line">{node.label}</span>
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}

function FlowchartChart({ data }: { data: FlowchartData }) { return <MapChart data={data} />; }

const renderChart = (item: ChartItem) => {
  switch (item.type) {
    case "line": return <LineChart data={item.data as LineChartData} xLabel={item.xLabel} yLabel={item.yLabel} />;
    case "bar": return <BarChartSVG data={item.data as BarChartData} xLabel={item.xLabel} yLabel={item.yLabel} />;
    case "pie": return <PieChartSVG data={item.data as PieChartData} />;
    case "table": return <TableChart data={item.data as TableData} />;
    case "map": return <MapChart data={item.data as FlowchartData} />;
    case "flowchart": return <FlowchartChart data={item.data as FlowchartData} />;
  }
};

interface EvaluationResult {
  band: number;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  keywordUsage: { used: string[]; missing: string[] };
  source: "ai" | "local";
}

const PARAGRAPH_LABELS: Record<number, string> = {
  1: "Introduction",
  2: "Overview",
  3: "Body 1",
  4: "Body 2",
};

function ParagraphTabs({
  activeParagraph,
  completedParagraphs,
  unlockedParagraphs,
  onSelect,
}: {
  activeParagraph: number;
  completedParagraphs: Set<number>;
  unlockedParagraphs: Set<number>;
  onSelect: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-4">
      {[1, 2, 3, 4].map((p) => {
        const isLocked = !unlockedParagraphs.has(p);
        const isActive = activeParagraph === p;
        const isCompleted = completedParagraphs.has(p);

        return (
          <motion.button
            key={p}
            onClick={() => !isLocked && onSelect(p)}
            whileHover={isLocked ? {} : { scale: 1.04 }}
            whileTap={isLocked ? {} : { scale: 0.96 }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap ${
              isLocked
                ? "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed"
                : isActive
                  ? "bg-[#232323] text-white border-[#232323]"
                  : isCompleted
                    ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                    : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#232323]"
            }`}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            P{p}
          </motion.button>
        );
      })}
    </div>
  );
}

function QuestionStage({
  paragraphData,
  questionAnswers,
  onAnswerChange,
  onShowKeywords,
}: {
  paragraphData: ParagraphWritingData;
  questionAnswers: Record<string, string>;
  onAnswerChange: (qId: string, value: string) => void;
  onShowKeywords: () => void;
}) {
  const allAnswered = paragraphData.questions.every((q) => (questionAnswers[q.id] || "").trim().length > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1">
      <div className="mb-4">
        <h3 className="text-base font-black text-[#232323] mb-1">{paragraphData.prompt}</h3>
        <p className="text-sm text-[#6B7280] font-medium">{paragraphData.instruction}</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {paragraphData.questions.map((q) => (
          <div key={q.id} className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB]">
            <p className="text-sm font-bold text-[#232323] mb-2">{q.question}</p>
            <input
              type="text"
              value={questionAnswers[q.id] || ""}
              onChange={(e) => onAnswerChange(q.id, e.target.value)}
              placeholder="Type your answer..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E7EB] bg-white text-sm font-medium text-[#232323] placeholder-[#9CA3AF] focus:border-[#232323] focus:outline-none transition-colors"
            />
          </div>
        ))}
      </div>
      <motion.button
        onClick={onShowKeywords}
        disabled={!allAnswered}
        whileHover={allAnswered ? { scale: 1.02 } : {}}
        whileTap={allAnswered ? { scale: 0.98 } : {}}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all ${
          allAnswered
            ? "bg-[#232323] text-white hover:bg-[#1a1a1a] cursor-pointer"
            : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        <Lightbulb className="w-4 h-4" />
        Show Keywords
      </motion.button>
    </motion.div>
  );
}

function KeywordsStage({
  paragraphData,
  onStartWriting,
}: {
  paragraphData: ParagraphWritingData;
  onStartWriting: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1">
      <div className="mb-4">
        <h3 className="text-base font-black text-[#232323] mb-1">{paragraphData.prompt}</h3>
        <p className="text-sm text-[#6B7280] font-medium">{paragraphData.instruction}</p>
      </div>
      <div className="mb-5">
        <p className="text-xs font-black text-[#6B7280] mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Key Vocabulary
        </p>
        <div className="flex flex-wrap gap-2">
          {paragraphData.keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1.5 bg-[#EDE9FE] text-[#6D28D9] rounded-full text-xs font-bold border border-[#C4B5FD]"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 mb-4">
        <p className="text-xs font-black text-[#6B7280] mb-2 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          Writing Tips
        </p>
        <ul className="space-y-1.5">
          {paragraphData.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563] font-medium">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#232323] shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <motion.button
        onClick={onStartWriting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#232323] text-white rounded-full text-sm font-black hover:bg-[#1a1a1a] transition-colors"
      >
        <FileText className="w-4 h-4" />
        Start Writing
      </motion.button>
    </motion.div>
  );
}

function WritingStage({
  writtenText,
  onTextChange,
  onSubmit,
  evaluating,
}: {
  writtenText: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  evaluating: boolean;
}) {
  const wordCount = writtenText.trim() ? writtenText.trim().split(/\s+/).length : 0;
  const canSubmit = writtenText.trim().length >= 10 && !evaluating;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black text-[#6B7280]">Write your paragraph below</p>
        <span className="text-xs font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
          {wordCount} words
        </span>
      </div>
      <textarea
        value={writtenText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Start writing your Task 1 paragraph here..."
        className="flex-1 w-full min-h-[200px] p-4 rounded-2xl border-2 border-[#E5E7EB] bg-[#F9FAFB] text-sm font-medium text-[#232323] placeholder-[#9CA3AF] focus:border-[#232323] focus:bg-white focus:outline-none transition-all resize-none"
      />
      <motion.button
        onClick={onSubmit}
        disabled={!canSubmit}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all mt-4 ${
          canSubmit
            ? "bg-[#232323] text-white hover:bg-[#1a1a1a] cursor-pointer"
            : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        {evaluating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Evaluating...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit for Evaluation
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

function EvaluationStage({
  result,
  onRevise,
  onMarkComplete,
  isLastParagraph,
}: {
  result: EvaluationResult;
  onRevise: () => void;
  onMarkComplete: () => void;
  isLastParagraph: boolean;
}) {
  const bandColor =
    result.band >= 7 ? "text-[#059669] bg-[#ECFDF5] border-[#34D399]" :
    result.band >= 5 ? "text-[#D97706] bg-[#FFFBEB] border-[#FCD34D]" :
    "text-[#DC2626] bg-[#FEF2F2] border-[#FCA5A5]";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex items-center justify-center mb-5">
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${bandColor}`}>
          <div className="text-center">
            <span className="text-2xl font-black">{result.band.toFixed(1)}</span>
            <span className="text-[10px] font-bold block -mt-0.5 opacity-70">BAND</span>
          </div>
        </div>
      </div>

      {result.strengths.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-black text-[#059669] mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
          </p>
          <ul className="space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.issues.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-black text-[#DC2626] mb-1.5 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Issues
          </p>
          <ul className="space-y-1">
            {result.issues.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563] font-medium">
                <XCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-black text-[#7C3AED] mb-1.5 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> Suggestions
          </p>
          <ul className="space-y-1">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(result.keywordUsage.used.length > 0 || result.keywordUsage.missing.length > 0) && (
        <div className="mb-4 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
          <p className="text-xs font-black text-[#6B7280] mb-2">Keyword Usage</p>
          {result.keywordUsage.used.length > 0 && (
            <div className="mb-1.5">
              <span className="text-[10px] font-bold text-[#059669] mr-1">Used:</span>
              {result.keywordUsage.used.map((kw) => (
                <span key={kw} className="inline-block px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded-full text-[10px] font-bold border border-[#A7F3D0] mr-1 mb-1">{kw}</span>
              ))}
            </div>
          )}
          {result.keywordUsage.missing.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#DC2626] mr-1">Missing:</span>
              {result.keywordUsage.missing.map((kw) => (
                <span key={kw} className="inline-block px-2 py-0.5 bg-[#FEF2F2] text-[#991B1B] rounded-full text-[10px] font-bold border border-[#FCA5A5] mr-1 mb-1">{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {result.source === "local" && (
        <div className="mb-4 flex items-center gap-1.5 px-3 py-2 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 text-[#EA580C]" />
          <span className="text-xs font-medium text-[#9A3412]">AI evaluation unavailable - using local scoring</span>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-4 border-t border-[#E5E7EB]">
        <motion.button
          onClick={onRevise}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 border-[#E5E7EB] bg-white text-[#232323] hover:border-[#232323] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Revise
        </motion.button>
        <motion.button
          onClick={onMarkComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-black bg-[#232323] text-white hover:bg-[#1a1a1a] transition-colors"
        >
          {isLastParagraph ? (
            <>
              🎉 All Complete!
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ChartChallenge() {
  const [charts, setCharts] = useState<ChartItem[] | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [activeType, setActiveType] = useState<ChartType>("line");
  const [activeIndex, setActiveIndex] = useState(0);

  const [unlockedParagraphs, setUnlockedParagraphs] = useState<Record<string, Set<number>>>(() => {
    const saved = loadProgress();
    if (saved?.unlocked) {
      const result: Record<string, Set<number>> = {};
      for (const key of Object.keys(saved.unlocked)) {
        result[key] = new Set(saved.unlocked[key]);
      }
      return result;
    }
    return {};
  });
  const [xp, setXp] = useState(() => {
    const saved = loadProgress();
    return saved?.xp || 0;
  });

  const [activeParagraph, setActiveParagraph] = useState(1);

  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [writtenText, setWrittenText] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const prevChartKeyRef = useRef<string>("");

  useEffect(() => {
    fetch("/api/charts")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setCharts(Array.isArray(data) ? data : []))
      .catch(() => setCharts([]))
      .finally(() => setChartsLoading(false));
  }, []);

  useEffect(() => {
    saveProgress(unlockedParagraphs, xp);
  }, [unlockedParagraphs, xp]);

  const typeCharts = charts ? charts.filter((c) => c.type === activeType) : [];
  const currentChart = typeCharts[activeIndex];
  const chartKey = currentChart?.id || "";

  const chartParagraphs: ChartParagraphs | undefined = chartKey ? PARAGRAPHS_DATA[chartKey] : undefined;
  const paragraphData: ParagraphWritingData | undefined = chartParagraphs
    ? chartParagraphs[`paragraph${activeParagraph}` as keyof ChartParagraphs] as ParagraphWritingData
    : undefined;

  const completedParagraphs: Set<number> = useMemo(() => {
    const raw = unlockedParagraphs[chartKey];
    if (!raw) return new Set<number>();
    return new Set<number>(Array.from(raw).filter((v: unknown) => typeof v === "number") as number[]);
  }, [unlockedParagraphs, chartKey]);
  const unlockedParagraphNumbers = useMemo(() => {
    const s = new Set<number>();
    s.add(1);
    for (let p = 1; p <= 4; p++) {
      if (completedParagraphs.has(p)) {
        s.add(p);
        if (p < 4) s.add(p + 1);
      }
    }
    return s;
  }, [completedParagraphs]);

  useEffect(() => {
    if (chartKey && chartKey !== prevChartKeyRef.current) {
      prevChartKeyRef.current = chartKey;
      const nums = Array.from(completedParagraphs).filter((v: unknown) => typeof v === "number") as number[];
      nums.sort((a: number, b: number) => b - a);
      const maxCompleted = nums.length > 0 ? nums[0] : 0;
      const nextParagraph = Math.min(maxCompleted + 1, 4) || 1;
      setActiveParagraph(nextParagraph);
      setStage(0);
      setWrittenText("");
      setEvaluationResult(null);
      setQuestionAnswers({});
    }
  }, [chartKey, unlockedParagraphs, completedParagraphs]);

  const handleTypeChange = (type: ChartType) => {
    setActiveType(type);
    setActiveIndex(0);
  };

  const handleChartNav = (dir: "prev" | "next") => {
    setActiveIndex((prev) => {
      if (dir === "prev") return (prev - 1 + typeCharts.length) % typeCharts.length;
      return (prev + 1) % typeCharts.length;
    });
  };

  const handleParagraphSelect = (p: number) => {
    if (!unlockedParagraphNumbers.has(p)) return;
    setActiveParagraph(p);
    setStage(0);
    setWrittenText("");
    setEvaluationResult(null);

    const existing = completedParagraphs.has(p);
    if (existing) return;
    setQuestionAnswers({});
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleShowKeywords = () => {
    setStage(1);
  };

  const handleStartWriting = () => {
    setStage(2);
    setWrittenText("");
    setEvaluationResult(null);
  };

  const handleSubmit = async () => {
    if (!currentChart || !paragraphData) return;
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
          keywords: paragraphData.keywords,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EvaluationResult = await res.json();
      setEvaluationResult(data);
      setStage(3);
    } catch {
      setEvaluationResult({
        band: 5,
        strengths: [],
        issues: ["Evaluation request failed. Please try again."],
        suggestions: ["Check your internet connection and retry."],
        keywordUsage: { used: [], missing: [] },
        source: "local",
      });
      setStage(3);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRevise = () => {
    setStage(2);
    setEvaluationResult(null);
  };

  const handleMarkComplete = () => {
    if (!chartKey) return;

    setUnlockedParagraphs((prev) => {
      const existing = prev[chartKey] || new Set<number>();
      const s = new Set<number>(Array.from(existing).filter((v: unknown) => typeof v === "number") as number[]);
      s.add(activeParagraph);
      return { ...prev, [chartKey]: s };
    });
    setXp((p) => p + 25);

    if (activeParagraph < 4) {
      const next = activeParagraph + 1;
      setActiveParagraph(next);
      setStage(0);
      setWrittenText("");
      setEvaluationResult(null);
      setQuestionAnswers({});
    }
  };

  if (chartsLoading) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#232323] animate-spin" />
          <p className="text-sm font-bold text-[#6B7280]">加载图表数据...</p>
        </div>
      </div>
    );
  }

  if (!currentChart || !paragraphData) {
    return (
      <div className="w-full mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-bold text-[#9CA3AF]">暂无图表数据</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl border-2 border-[#232323] bg-white flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-[#232323]" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-normal text-[#232323] leading-tight [font-family:var(--font-langyuan)]">图表写作训练</h1>
          <p className="text-sm text-[#8C8C6D]">4段式结构 · 引导问题 → 关键词 → 自由写作 → AI评分</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4 py-2 border-2 border-[#232323] bg-white rounded-full">
          <Zap className="w-4 h-4 text-[#232323]" />
          <span className="text-sm font-black text-[#232323]">{xp} XP</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CHART_TYPE_ORDER.map((type) => {
          const Icon = CHART_ICONS[type];
          const isActive = activeType === type;
          return (
            <motion.button
              key={type}
              onClick={() => handleTypeChange(type)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                isActive ? "bg-[#232323] text-white border-[#232323]" : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#232323]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {CHART_TYPE_LABELS[type]}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border-2 border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#6B7280] bg-[#F3F4F6] px-3 py-1 rounded-full">
              {activeIndex + 1} / {typeCharts.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleChartNav("prev")} className="w-8 h-8 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center hover:border-[#232323] transition-colors"><ChevronLeft className="w-4 h-4 text-[#6B7280]" /></button>
              <button onClick={() => handleChartNav("next")} className="w-8 h-8 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center hover:border-[#232323] transition-colors"><ChevronRight className="w-4 h-4 text-[#6B7280]" /></button>
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

        <div className="bg-white rounded-3xl border-2 border-[#E5E7EB] p-6 flex flex-col">
          <ParagraphTabs
            activeParagraph={activeParagraph}
            completedParagraphs={completedParagraphs}
            unlockedParagraphs={unlockedParagraphNumbers}
            onSelect={handleParagraphSelect}
          />

          <AnimatePresence mode="wait">
            {completedParagraphs.has(activeParagraph) ? (
              <motion.div
                key={`done-${activeParagraph}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#34D399] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#059669]" />
                </div>
                <p className="text-lg font-black text-[#232323] mb-1">Paragraph {activeParagraph} Completed!</p>
                <p className="text-sm text-[#6B7280] font-medium">
                  {PARAGRAPH_LABELS[activeParagraph]} — +25 XP earned
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${chartKey}-p${activeParagraph}-s${stage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                {stage === 0 && (
                  <QuestionStage
                    paragraphData={paragraphData}
                    questionAnswers={questionAnswers}
                    onAnswerChange={handleAnswerChange}
                    onShowKeywords={handleShowKeywords}
                  />
                )}
                {stage === 1 && (
                  <KeywordsStage
                    paragraphData={paragraphData}
                    onStartWriting={handleStartWriting}
                  />
                )}
                {stage === 2 && (
                  <WritingStage
                    writtenText={writtenText}
                    onTextChange={setWrittenText}
                    onSubmit={handleSubmit}
                    evaluating={evaluating}
                  />
                )}
                {stage === 3 && evaluationResult && (
                  <EvaluationStage
                    result={evaluationResult}
                    onRevise={handleRevise}
                    onMarkComplete={handleMarkComplete}
                    isLastParagraph={activeParagraph === 4}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
