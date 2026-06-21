"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ChartItem, CHART_TYPE_LABELS, CHART_TYPE_ORDER, ChartType, LEVEL_LABELS, ChartLevels, Level1Question, Level2Question, Level3Question, Level4Question, Level5Option, Level6Data, LineChartData, BarChartData, PieChartData, TableData, FlowchartData } from "@/data/ieltsCharts";
import type { ChartParagraphs, ParagraphWritingData, ParagraphQuestion } from "@/data/ieltsChartsParagraphs";
import { Save, CheckCircle2, AlertCircle, FileText, BarChart3 } from "lucide-react";

type LevelKey = keyof ChartLevels;
const LEVEL_ORDER: LevelKey[] = ["level1", "level2", "level3", "level4", "level5", "level6"];
const PARAGRAPH_KEYS = ["paragraph1", "paragraph2", "paragraph3", "paragraph4"] as const;
const PARAGRAPH_LABELS: Record<string, string> = {
  paragraph1: "P1: Introduction",
  paragraph2: "P2: Overview",
  paragraph3: "P3: Body 1",
  paragraph4: "P4: Body 2",
};

function InlineInput({ value, onChange, className = "", multiline = false }: { value: string; onChange: (v: string) => void; className?: string; multiline?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  if (editing) {
    const Component = multiline ? "textarea" : "input";
    return (<Component autoFocus value={local} onChange={(e: any) => setLocal(e.target.value)} onBlur={() => { onChange(local); setEditing(false); }} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Escape") { setLocal(value); setEditing(false); } if (!multiline && e.key === "Enter") { onChange(local); setEditing(false); } }} className={`${multiline ? "w-full rounded-lg resize-y min-h-[36px]" : "w-full rounded"} px-2 py-1 border-2 border-[#232323] text-sm outline-none ${className}`} rows={multiline ? 3 : undefined} />);
  }
  return (<span onClick={() => setEditing(true)} className={`cursor-pointer border-b border-dashed border-transparent hover:border-[#9CA3AF] transition-colors ${className}`} title="Click to edit">{value || <span className="text-[#D1D5DB] italic">empty</span>}</span>);
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
  const legendItemW = (w - padding.left - padding.right) / data.series.length;
  const plotBottom = padding.top + plotH; const labelY = plotBottom + 16; const xLabelY = labelY + 18;
  const legendTop = xLabelY + 6 + legendGap; const legendCenterY = legendTop + legendH / 2 + 4;
  return (<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">{Array.from({ length: yTicks }).map((_, i) => { const val = minVal + step * i; const y = yScale(val); return (<g key={i}><line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" /><text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9CA3AF">{Math.round(val)}</text></g>); })}{data.labels.map((label, i) => (<text key={i} x={xScale(i)} y={labelY} textAnchor="middle" className="text-[10px]" fill="#6B7280">{label}</text>))}{xLabel && (<text x={w / 2} y={xLabelY} textAnchor="middle" className="text-[11px] font-semibold" fill="#4B5563">{xLabel}</text>)}{yLabel && (<text x={12} y={h / 2} textAnchor="middle" transform={`rotate(-90, 12, ${h / 2})`} className="text-[11px] font-semibold" fill="#4B5563">{yLabel}</text>)}{data.series.map((series) => { const pts = series.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" "); return (<g key={series.name}><polyline points={pts} fill="none" stroke={series.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />{series.values.map((v, i) => (<circle key={i} cx={xScale(i)} cy={yScale(v)} r="4" fill={series.color} stroke="#fff" strokeWidth="1.5" />))}</g>); })}{data.series.map((series, i) => { const legendX = padding.left + i * legendItemW + legendItemW / 2; const textW = series.name.length * 6 + 20; return (<g key={`legend-${series.name}`}><line x1={legendX - textW / 2} y1={legendCenterY} x2={legendX - textW / 2 + 14} y2={legendCenterY} stroke={series.color} strokeWidth="2.5" strokeLinecap="round" /><circle cx={legendX - textW / 2 + 7} cy={legendCenterY} r="3.5" fill={series.color} stroke="#fff" strokeWidth="1" /><text x={legendX - textW / 2 + 20} y={legendCenterY + 4} textAnchor="start" className="text-[10px] font-bold" fill="#4B5563">{series.name}</text></g>); })}</svg>);
}

function BarChartSVG({ data, xLabel, yLabel }: { data: BarChartData; xLabel?: string; yLabel?: string }) {
  const padding = { top: 30, right: 20, bottom: 60, left: 60 }; const w = 500; const h = 300;
  const plotW = w - padding.left - padding.right; const plotH = h - padding.top - padding.bottom;
  const maxVal = Math.max(...data.values); const barWidth = Math.min(40, plotW / data.labels.length - 12);
  const yTicks = 5; const step = maxVal / (yTicks - 1);
  return (<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">{Array.from({ length: yTicks }).map((_, i) => { const val = step * i; const y = padding.top + plotH - (val / maxVal) * plotH; return (<g key={i}><line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" /><text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9CA3AF">{Math.round(val)}</text></g>); })}{data.labels.map((label, i) => { const x = padding.left + (i / data.labels.length) * plotW + (plotW / data.labels.length - barWidth) / 2; const val = data.values[i]; const barH = (val / maxVal) * plotH; const y = padding.top + plotH - barH; return (<g key={i}><rect x={x} y={y} width={barWidth} height={barH} rx="4" fill={data.color} opacity="0.85" /><text x={x + barWidth / 2} y={h - padding.bottom + 18} textAnchor="middle" className="text-[10px]" fill="#6B7280">{label}</text><text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-[11px] font-bold" fill="#374151">{typeof val === "number" && val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}</text></g>); })}{xLabel && (<text x={w / 2} y={h - 6} textAnchor="middle" className="text-[11px] font-semibold" fill="#4B5563">{xLabel}</text>)}{yLabel && (<text x={12} y={h / 2} textAnchor="middle" transform={`rotate(-90, 12, ${h / 2})`} className="text-[11px] font-semibold" fill="#4B5563">{yLabel}</text>)}</svg>);
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

const renderAdminChart = (item: ChartItem) => {
  switch (item.type) {
    case "line": return <LineChart data={item.data as LineChartData} xLabel={item.xLabel} yLabel={item.yLabel} />;
    case "bar": return <BarChartSVG data={item.data as BarChartData} xLabel={item.xLabel} yLabel={item.yLabel} />;
    case "pie": return <PieChartSVG data={item.data as PieChartData} />;
    case "table": return <TableChart data={item.data as TableData} />;
    case "map": return <MapChart data={item.data as FlowchartData} />;
    case "flowchart": return <MapChart data={item.data as FlowchartData} />;
  }
};

function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

export default function AdminPage() {
  const [mode, setMode] = useState<"charts" | "paragraphs">("charts");
  const [charts, setCharts] = useState<ChartItem[] | null>(null);
  const [paragraphsData, setParagraphsData] = useState<Record<string, ChartParagraphs> | null>(null);
  const [filterType, setFilterType] = useState<ChartType | "all">("all");
  const [expandedAll, setExpandedAll] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [paragraphsDirty, setParagraphsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/charts")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setCharts(Array.isArray(data) ? data : []))
      .catch(() => setCharts([]));
  }, []);

  useEffect(() => {
    fetch("/api/paragraphs")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setParagraphsData(data))
      .catch(() => setParagraphsData({}));
  }, []);

  const updateChart = useCallback((chartId: string, updater: (c: ChartItem) => ChartItem) => {
    setCharts((prev) => prev ? prev.map((c) => c.id === chartId ? updater(deepClone(c)) : c) : prev);
    setDirty(true);
    setSaveStatus("idle");
  }, []);

  const updateParagraphs = useCallback((chartId: string, updater: (p: ChartParagraphs) => ChartParagraphs) => {
    setParagraphsData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, [chartId]: updater(deepClone(prev[chartId])) };
      return newData;
    });
    setParagraphsDirty(true);
    setSaveStatus("idle");
  }, []);

  const handleSave = async () => {
    if (mode === "charts" && charts) {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/charts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(charts) });
        if (res.ok) { setSaveStatus("success"); setDirty(false); } else { setSaveStatus("error"); }
      } catch { setSaveStatus("error"); }
    } else if (mode === "paragraphs" && paragraphsData) {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/paragraphs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(paragraphsData) });
        if (res.ok) { setSaveStatus("success"); setParagraphsDirty(false); } else { setSaveStatus("error"); }
      } catch { setSaveStatus("error"); }
    }
  };

  const isDirty = mode === "charts" ? dirty : paragraphsDirty;

  const availableIds = charts ? charts.map((c) => c.id) : [];

  if (!charts || !paragraphsData) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><p className="text-[#6B7280]">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="sticky top-0 z-40 bg-white border-b-2 border-[#E5E7EB] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-[#232323]">Admin</h1>
            <div className="flex bg-[#F3F4F6] rounded-full p-0.5">
              <button onClick={() => { setMode("charts"); setSaveStatus("idle"); }} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === "charts" ? "bg-white text-[#232323] shadow-sm" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}><BarChart3 className="w-3.5 h-3.5" />Charts</button>
              <button onClick={() => { setMode("paragraphs"); setSaveStatus("idle"); }} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === "paragraphs" ? "bg-white text-[#232323] shadow-sm" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}><FileText className="w-3.5 h-3.5" />Paragraphs</button>
            </div>
            {isDirty && <span className="text-xs font-bold text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full">Unsaved changes</span>}
            {saveStatus === "success" && <span className="flex items-center gap-1 text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" />Saved</span>}
            {saveStatus === "error" && <span className="flex items-center gap-1 text-xs font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" />Save failed</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setExpandedAll(!expandedAll)} className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#E5E7EB] hover:border-[#232323] transition-colors">{expandedAll ? "Collapse" : "Expand"}</button>
            <button onClick={handleSave} disabled={saveStatus === "saving" || !isDirty} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black border-2 transition-all ${isDirty ? "bg-[#232323] text-white border-[#232323] hover:bg-[#1a1a1a]" : "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]"}`}><Save className="w-4 h-4" />Save All</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {mode === "charts" && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setFilterType("all")} className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${filterType === "all" ? "bg-[#232323] text-white border-[#232323]" : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#232323]"}`}>All ({charts.length})</button>
              {CHART_TYPE_ORDER.map((type) => { const count = charts.filter((c) => c.type === type).length; return (<button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${filterType === type ? "bg-[#232323] text-white border-[#232323]" : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#232323]"}`}>{CHART_TYPE_LABELS[type]} ({count})</button>); })}
            </div>
            <div className="space-y-6">
              {charts.filter((c) => filterType === "all" ? true : c.type === filterType).map((chart) => (<ChartSection key={chart.id} chart={chart} defaultExpanded={expandedAll} updateChart={updateChart} />))}
            </div>
          </>
        )}

        {mode === "paragraphs" && (
          <div className="space-y-6">
            {availableIds.map((id) => (
              <ParagraphsSection key={id} chartId={id} data={paragraphsData[id]} updateParagraphs={updateParagraphs} defaultExpanded={expandedAll} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartSection({ chart, defaultExpanded, updateChart }: { chart: ChartItem; defaultExpanded: boolean; updateChart: (id: string, fn: (c: ChartItem) => ChartItem) => void }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const totalQuestions = chart.levels.level1.questions.length + chart.levels.level2.questions.length + chart.levels.level3.questions.length + chart.levels.level4.questions.length + chart.levels.level5.options.length + chart.levels.level6.paragraphs.length;
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F9FAFB] transition-colors">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] uppercase">{CHART_TYPE_LABELS[chart.type]}</span><span className="text-xs text-[#9CA3AF] font-mono">{chart.id}</span></div>
            <h3 className="text-base font-black text-[#232323]"><InlineInput value={chart.title} onChange={(v) => updateChart(chart.id, (c) => { c.title = v; return c; })} /></h3>
            <p className="text-xs text-[#6B7280] mt-1" onClick={(e) => e.stopPropagation()}><InlineInput value={chart.question} onChange={(v) => updateChart(chart.id, (c) => { c.question = v; return c; })} multiline /></p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0"><span className="text-xs text-[#9CA3AF]">{totalQuestions}</span><span className="text-lg text-[#9CA3AF]">{expanded ? "▾" : "▸"}</span></div>
      </button>
      {expanded && (<div className="border-t border-[#E5E7EB]"><div className="p-5 bg-[#F9FAFB] text-xs text-[#6B7280]"><DataSummary chart={chart} updateChart={updateChart} /></div><div className="px-5 py-4 bg-white flex justify-center"><div className="w-full max-w-lg">{renderAdminChart(chart)}</div></div><div className="divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">{LEVEL_ORDER.map((lk) => (<LevelSection key={lk} chart={chart} levelKey={lk} updateChart={updateChart} />))}</div></div>)}
    </div>
  );
}

function DataSummary({ chart, updateChart }: { chart: ChartItem; updateChart: (id: string, fn: (c: ChartItem) => ChartItem) => void }) {
  switch (chart.type) {
    case "line": { const d = chart.data as LineChartData; return (<div><span className="font-black text-[#232323]">Labels:</span> <InlineInput value={d.labels.join(", ")} onChange={(v) => updateChart(chart.id, (c) => { (c.data as LineChartData).labels = v.split(",").map((s) => s.trim()); return c; })} />{" · "}{d.series.map((s, si) => (<span key={s.name} className="inline-flex items-center gap-1 mr-3"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }} /><span className="font-semibold"><InlineInput value={s.name} onChange={(v) => updateChart(chart.id, (c) => { (c.data as LineChartData).series[si].name = v; return c; })} />:</span> <InlineInput value={s.values.join(", ")} onChange={(v) => updateChart(chart.id, (c) => { (c.data as LineChartData).series[si].values = v.split(",").map((x) => parseFloat(x.trim()) || 0); return c; })} /></span>))}{chart.xLabel && <> · <span className="font-semibold">X:</span> <InlineInput value={chart.xLabel} onChange={(v) => updateChart(chart.id, (c) => { c.xLabel = v; return c; })} /></>}{chart.yLabel && <> · <span className="font-semibold">Y:</span> <InlineInput value={chart.yLabel} onChange={(v) => updateChart(chart.id, (c) => { c.yLabel = v; return c; })} /></>}</div>); }
    case "bar": { const d = chart.data as BarChartData; return (<div>{d.labels.map((l, i) => (<span key={l} className="mr-3"><span className="font-semibold"><InlineInput value={l} onChange={(v) => updateChart(chart.id, (c) => { (c.data as BarChartData).labels[i] = v; return c; })} />:</span> <InlineInput value={String(d.values[i])} onChange={(v) => updateChart(chart.id, (c) => { (c.data as BarChartData).values[i] = parseFloat(v) || 0; return c; })} /></span>))}{chart.xLabel && <> · <span className="font-semibold">X:</span> <InlineInput value={chart.xLabel} onChange={(v) => updateChart(chart.id, (c) => { c.xLabel = v; return c; })} /></>}{chart.yLabel && <> · <span className="font-semibold">Y:</span> <InlineInput value={chart.yLabel} onChange={(v) => updateChart(chart.id, (c) => { c.yLabel = v; return c; })} /></>}</div>); }
    case "pie": { const d = chart.data as PieChartData; return (<div>{d.segments.map((s, si) => (<span key={s.label} className="inline-flex items-center gap-1 mr-3"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }} /><span className="font-semibold"><InlineInput value={s.label} onChange={(v) => updateChart(chart.id, (c) => { (c.data as PieChartData).segments[si].label = v; return c; })} />:</span> <InlineInput value={String(s.value)} onChange={(v) => updateChart(chart.id, (c) => { (c.data as PieChartData).segments[si].value = parseFloat(v) || 0; return c; })} />%</span>))}</div>); }
    case "table": { const d = chart.data as TableData; return <div><span className="font-black text-[#232323]">Headers:</span> {d.headers.join(" | ")} · <span className="font-semibold">{d.rows.length} rows</span></div>; }
    case "map": case "flowchart": { const d = chart.data as FlowchartData; return <div><span className="font-black text-[#232323]">Nodes:</span> {d.nodes.map((n) => n.label.replace("\n", " ")).join(", ")} · <span className="font-semibold">{d.edges.length} edges</span></div>; }
    default: return null;
  }
}

function LevelSection({ chart, levelKey, updateChart }: { chart: ChartItem; levelKey: LevelKey; updateChart: (id: string, fn: (c: ChartItem) => ChartItem) => void }) {
  const [open, setOpen] = useState(true);
  const levelData: any = chart.levels[levelKey];
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#F9FAFB] transition-colors"><span className="text-xs">{open ? "▾" : "▸"}</span><span className="w-5 h-5 rounded bg-[#232323] text-white text-[10px] font-black flex items-center justify-center">{LEVEL_ORDER.indexOf(levelKey) + 1}</span><span className="text-sm font-black text-[#232323]">{LEVEL_LABELS[levelKey]}</span><span className="text-xs text-[#9CA3AF]" onClick={(e) => e.stopPropagation()}><InlineInput value={levelData.prompt} onChange={(v) => updateChart(chart.id, (c) => { (c.levels[levelKey] as any).prompt = v; return c; })} /></span></button>
      {open && (<div className="px-8 pb-4 space-y-3">
        {levelKey === "level1" && levelData.questions.map((q: Level1Question, qi: number) => (<div key={qi} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]"><p className="text-sm font-bold text-[#232323] mb-2">Q{qi + 1}. <InlineInput value={q.question} onChange={(v) => updateChart(chart.id, (c) => { (c.levels.level1.questions[qi] as Level1Question).question = v; return c; })} multiline /></p><div className="flex flex-wrap gap-1.5">{q.options.map((opt, oi) => (<div key={oi} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${opt === q.answer ? "bg-[#ECFDF5] border-[#34D399] text-[#065F46] font-black" : "bg-white border-[#E5E7EB] text-[#6B7280]"}`}><InlineInput value={opt} onChange={(v) => updateChart(chart.id, (c) => { (c.levels.level1.questions[qi] as Level1Question).options[oi] = v; if (q.answer === opt) { (c.levels.level1.questions[qi] as Level1Question).answer = v; } return c; })} />{opt === q.answer && " ✓"}</div>))}</div><p className="mt-1.5 text-[10px] text-[#9CA3AF]">Answer: <span className="font-black text-[#059669]">{q.answer}</span></p></div>))}
        {(levelKey === "level2" || levelKey === "level3" || levelKey === "level4") && levelData.questions.map((q: any, qi: number) => { const parts = q.sentence.split("_____"); return (<div key={qi} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]"><p className="text-sm font-bold text-[#232323] mb-2">Q{qi + 1}.{" "}{parts.map((part: string, pi: number) => (<span key={pi}><InlineInput value={part} onChange={(v) => { const newParts = [...parts]; newParts[pi] = v; updateChart(chart.id, (c) => { (c.levels[levelKey] as any).questions[qi].sentence = newParts.join("_____"); return c; }); }} />{pi < parts.length - 1 && (<span className="inline-block mx-1 px-2 py-0.5 bg-[#ECFDF5] border border-[#34D399] rounded text-xs font-black text-[#065F46]">{q.answer}</span>)}</span>))}</p><div className="flex flex-wrap gap-1.5">{q.options.map((opt: string, oi: number) => (<div key={oi} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${opt === q.answer ? "bg-[#ECFDF5] border-[#34D399] text-[#065F46] font-black" : "bg-white border-[#E5E7EB] text-[#6B7280]"}`}><InlineInput value={opt} onChange={(v) => updateChart(chart.id, (c) => { (c.levels[levelKey] as any).questions[qi].options[oi] = v; if (q.answer === opt) { (c.levels[levelKey] as any).questions[qi].answer = v; } return c; })} />{opt === q.answer && " ✓"}</div>))}</div><p className="mt-1.5 text-[10px] text-[#9CA3AF]">Answer: <span className="font-black text-[#059669]">{q.answer}</span></p></div>); })}
        {levelKey === "level5" && (<div className="space-y-3">{levelData.options.map((opt: Level5Option, oi: number) => (<div key={oi} className={`flex items-center gap-3 text-sm rounded-xl p-3 border ${opt.isCorrect ? "bg-[#ECFDF5] border-[#34D399]" : "bg-[#FEF2F2] border-[#F87171]"}`}><span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0 ${opt.isCorrect ? "bg-[#34D399] text-white" : "bg-[#F87171] text-white"}`}>{opt.isCorrect ? "✓" : "✗"}</span><span className={`flex-1 font-medium ${opt.isCorrect ? "text-[#065F46]" : "text-[#991B1B]"}`}><InlineInput value={opt.text} onChange={(v) => updateChart(chart.id, (c) => { (c.levels.level5.options[oi] as Level5Option).text = v; return c; })} multiline /></span><button onClick={() => updateChart(chart.id, (c) => { (c.levels.level5.options[oi] as Level5Option).isCorrect = !opt.isCorrect; return c; })} className="text-[10px] font-black px-2 py-1 rounded border text-xs">{opt.isCorrect ? "Correct" : "Wrong"}</button></div>))}<div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]"><span className="text-[10px] font-black text-[#9CA3AF] uppercase">Overview Text:</span><p className="text-sm font-bold text-[#232323] mt-1"><InlineInput value={levelData.overviewText} onChange={(v) => updateChart(chart.id, (c) => { (c.levels.level5 as any).overviewText = v; return c; })} multiline /></p></div></div>)}
        {levelKey === "level6" && levelData.paragraphs.map((p: Level6Data, pi: number) => (<div key={pi} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB] space-y-2"><div><span className="text-[10px] font-black text-[#9CA3AF] uppercase">Words:</span><div className="flex flex-wrap gap-1.5 mt-1">{p.words.map((w, wi) => (<span key={wi} className="text-xs px-2 py-0.5 bg-white border border-[#D1D5DB] rounded-full text-[#6B7280]"><InlineInput value={w} onChange={(v) => updateChart(chart.id, (c) => { (c.levels.level6.paragraphs[pi] as Level6Data).words[wi] = v; return c; })} /></span>))}</div></div><div><span className="text-[10px] font-black text-[#9CA3AF] uppercase">Target Sentence:</span><p className="text-sm font-bold text-[#065F46] bg-[#ECFDF5] rounded-lg p-2 mt-1 border border-[#34D399]"><InlineInput value={p.targetSentence} onChange={(v) => updateChart(chart.id, (c) => { (c.levels.level6.paragraphs[pi] as Level6Data).targetSentence = v; return c; })} multiline /></p></div></div>))}
      </div>)}
    </div>
  );
}

function ParagraphsSection({ chartId, data, updateParagraphs, defaultExpanded }: { chartId: string; data: ChartParagraphs; updateParagraphs: (id: string, fn: (p: ChartParagraphs) => ChartParagraphs) => void; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F9FAFB] transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9CA3AF] font-mono">{chartId}</span>
          <span className="text-sm font-black text-[#232323]">Writing Guide</span>
          <span className="text-xs text-[#9CA3AF]">4 paragraphs</span>
        </div>
        <span className="text-lg text-[#9CA3AF]">{expanded ? "▾" : "▸"}</span>
      </button>
      {expanded && (
        <div className="border-t border-[#E5E7EB] divide-y divide-[#E5E7EB]">
          {PARAGRAPH_KEYS.map((key) => (
            <ParagraphEdit key={key} paraKey={key} data={data[key]} updateParagraphs={updateParagraphs} chartId={chartId} />
          ))}
        </div>
      )}
    </div>
  );
}

function ParagraphEdit({ paraKey, data, updateParagraphs, chartId }: { paraKey: keyof ChartParagraphs; data: ParagraphWritingData; updateParagraphs: (id: string, fn: (p: ChartParagraphs) => ChartParagraphs) => void; chartId: string }) {
  const [open, setOpen] = useState(true);
  if (!data) return null;

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#F9FAFB] transition-colors">
        <span className="text-xs">{open ? "▾" : "▸"}</span>
        <span className="text-sm font-black text-[#232323]">{PARAGRAPH_LABELS[paraKey] || paraKey}</span>
        <span className="text-xs text-[#9CA3AF]">{data.questions.length} questions</span>
      </button>
      {open && (
        <div className="px-8 pb-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-[#F0F9FF] rounded-xl p-3 border border-[#BAE6FD]">
              <span className="text-[10px] font-black text-[#0369A1] uppercase">Prompt</span>
              <p className="text-sm font-bold text-[#0C4A6E] mt-1"><InlineInput value={data.prompt} onChange={(v) => updateParagraphs(chartId, (p) => { const updated = { ...p }; (updated as any)[paraKey] = { ...updated[paraKey], prompt: v }; return updated; })} multiline /></p>
            </div>
            <div className="bg-[#FFFBEB] rounded-xl p-3 border border-[#FDE68A]">
              <span className="text-[10px] font-black text-[#92400E] uppercase">Instruction</span>
              <p className="text-sm font-bold text-[#78350F] mt-1"><InlineInput value={data.instruction} onChange={(v) => updateParagraphs(chartId, (p) => { const updated = { ...p }; (updated as any)[paraKey] = { ...updated[paraKey], instruction: v }; return updated; })} multiline /></p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black text-[#6B7280] uppercase">Questions ({data.questions.length})</span>
            <div className="space-y-2 mt-2">
              {data.questions.map((q: ParagraphQuestion, qi: number) => (
                <div key={qi} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="text-sm font-bold text-[#232323]">
                    Q{qi + 1}. <InlineInput value={q.question} onChange={(v) => updateParagraphs(chartId, (p) => { const updated = { ...p }; const newQuestions = [...updated[paraKey].questions]; newQuestions[qi] = { ...newQuestions[qi], question: v }; (updated as any)[paraKey] = { ...updated[paraKey], questions: newQuestions }; return updated; })} multiline />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black text-[#6B7280] uppercase">Keywords</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {data.keywords.map((kw: string, ki: number) => (
                <span key={ki} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#ECFDF5] border border-[#34D399] rounded-full text-[#065F46] font-bold">
                  <InlineInput value={kw} onChange={(v) => updateParagraphs(chartId, (p) => { const updated = { ...p }; const newKw = [...updated[paraKey].keywords]; newKw[ki] = v; (updated as any)[paraKey] = { ...updated[paraKey], keywords: newKw }; return updated; })} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black text-[#6B7280] uppercase">Tips</span>
            <div className="space-y-1.5 mt-2">
              {data.tips.map((tip: string, ti: number) => (
                <div key={ti} className="flex items-start gap-2 bg-[#FFF7ED] rounded-lg p-2.5 border border-[#FED7AA]">
                  <span className="text-[#F97316] text-xs mt-0.5">💡</span>
                  <p className="text-xs font-medium text-[#9A3412] flex-1"><InlineInput value={tip} onChange={(v) => updateParagraphs(chartId, (p) => { const updated = { ...p }; const newTips = [...updated[paraKey].tips]; newTips[ti] = v; (updated as any)[paraKey] = { ...updated[paraKey], tips: newTips }; return updated; })} multiline /></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
