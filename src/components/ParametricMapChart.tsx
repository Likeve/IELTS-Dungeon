"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { MapNode, MapEdge } from "@/data/ieltsCharts";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface MapChartProps {
  data: { nodes: MapNode[]; edges: MapEdge[] };
  title?: string;
}

// ─── geometry helpers ──────────────────────────────────────────────

function generateIrregularPolygon(
  x: number, y: number, w: number, h: number, seed: number, scale: number
): string {
  const corners = [
    { x,           y },
    { x: x + w,    y },
    { x: x + w,    y: y + h },
    { x,           y: y + h },
  ];
  const jitter = scale * 6;
  const midJitter = scale * 10;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const c = corners[i];
    const nc = corners[(i + 1) % 4];
    const mx = (c.x + nc.x) / 2 + Math.sin(seed * 7 + i * 3) * midJitter;
    const my = (c.y + nc.y) / 2 + Math.cos(seed * 7 + i * 3) * midJitter;
    points.push(
      { x: c.x + Math.sin(seed + i * 2.3) * jitter, y: c.y + Math.cos(seed + i * 2.3) * jitter },
      { x: mx, y: my },
    );
  }
  return points.map(p => `${p.x},${p.y}`).join(" ");
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ─── decorative icons ──────────────────────────────────────────────

function TreeIcon({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <>
      <circle cx={x} cy={y - s * 0.25} r={s * 0.4} fill="#6B9E6B" opacity={0.8} />
      <circle cx={x - s * 0.2} cy={y - s * 0.1} r={s * 0.3} fill="#5A8E5A" opacity={0.8} />
      <circle cx={x + s * 0.2} cy={y - s * 0.1} r={s * 0.3} fill="#7BAE7B" opacity={0.8} />
      <rect x={x - s * 0.08} y={y + s * 0.1} width={s * 0.16} height={s * 0.3} fill="#8B6914" rx={s * 0.02} />
    </>
  );
}

function BuildingIcon({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <>
      <rect x={x - s * 0.25} y={y - s * 0.5} width={s * 0.5} height={s * 0.55} fill={color} rx={s * 0.04} />
      <polygon
        points={`${x - s * 0.3},${y - s * 0.5} ${x},${y - s * 0.75} ${x + s * 0.3},${y - s * 0.5}`}
        fill={color} opacity={0.7}
      />
      <rect x={x - s * 0.12} y={y - s * 0.35} width={s * 0.1} height={s * 0.1} fill="white" opacity={0.8} rx={s * 0.01} />
      <rect x={x + s * 0.03} y={y - s * 0.35} width={s * 0.1} height={s * 0.1} fill="white" opacity={0.8} rx={s * 0.01} />
    </>
  );
}

// ─── SVG textures ──────────────────────────────────────────────────

function GrassTexture({ id }: { id: string }) {
  return (
    <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
      <line x1="3" y1="18" x2="3" y2="12" stroke="#81C784" strokeWidth={0.8} opacity={0.5} />
      <line x1="7" y1="19" x2="6" y2="14" stroke="#A5D6A7" strokeWidth={0.7} opacity={0.4} />
      <line x1="10" y1="17" x2="10" y2="11" stroke="#66BB6A" strokeWidth={0.6} opacity={0.3} />
      <line x1="14" y1="18" x2="13" y2="13" stroke="#81C784" strokeWidth={0.7} opacity={0.5} />
      <line x1="17" y1="19" x2="17" y2="14" stroke="#A5D6A7" strokeWidth={0.8} opacity={0.4} />
      <circle cx="5" cy="5" r={0.6} fill="#A5D6A7" opacity={0.3} />
      <circle cx="15" cy="8" r={0.5} fill="#81C784" opacity={0.25} />
      <circle cx="8" cy="15" r={0.4} fill="#C8E6C9" opacity={0.3} />
    </pattern>
  );
}

function PavedTexture({ id }: { id: string }) {
  return (
    <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="#ECEFF1" />
      <rect x="0" y="0" width={0.5} height="12" fill="#CFD8DC" opacity={0.4} />
      <rect x="0" y="0" width="12" height={0.5} fill="#CFD8DC" opacity={0.4} />
    </pattern>
  );
}

function WaterTexture({ id }: { id: string }) {
  return (
    <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M0,10 Q7,5 15,10 Q22,15 30,10" fill="none" stroke="#90CAF9" strokeWidth={0.8} opacity={0.4} />
      <path d="M0,20 Q7,15 15,20 Q22,25 30,20" fill="none" stroke="#64B5F6" strokeWidth={0.6} opacity={0.3} />
      <path d="M0,28 Q8,25 18,28 Q25,31 30,28" fill="none" stroke="#90CAF9" strokeWidth={0.7} opacity={0.35} />
    </pattern>
  );
}

// ─── colour / decor maps ───────────────────────────────────────────

const MAP_FILLS: Record<string, string> = {
  park: "#C8E6C9", library: "#FFE0B2", shops: "#FFCCBC", hotel: "#BBDEFB",
  station: "#CE93D8", mall: "#B2DFDB", main: "#FFCCBC", lab: "#C8E6C9",
  sports: "#FFE082", dorms: "#E1BEE7", cafe: "#B3E5FC", checkin: "#FFAB91",
  security: "#90CAF9", dutyfree: "#FFE082", gates: "#A5D6A7", gates2: "#A5D6A7",
  lounge: "#CE93D8", food: "#BCAAA4", housing: "#EF9A9A", parking: "#B0BEC5",
  school: "#F48FB1", hospital: "#EF9A9A", office: "#90CAF9", retail: "#FFCCBC",
  industry: "#BCAAA4", river: "#64B5F6", playground: "#AED581", garden: "#C8E6C9",
  pond: "#64B5F6", car_park: "#B0BEC5",
};

function getMapFill(id: string) { return MAP_FILLS[id] || "#E8E8E8"; }

type Decor = "none" | "building" | "trees" | "water";
function getNodeDecor(node: MapNode): Decor {
  const l = (node.label || "").toLowerCase();
  if (/pond|lake|river/i.test(l)) return "water";
  if (/park|garden|playground|sports/i.test(l)) return "trees";
  return "building";
}

// ─── main component ────────────────────────────────────────────────

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.15;

export default function ParametricMapChart({ data }: MapChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 400, h: 400 });

  // pan / zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // pointer tracking for drag
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // ── resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setContainerSize({ w: Math.max(r.width, 200), h: Math.max(r.height, 200) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── data geometry (painted coords, zoom-independent) ────────────────

  const { nodes, edges } = data;
  if (!nodes || nodes.length === 0) return null;

  const minX = Math.min(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxX = Math.max(...nodes.map(n => n.x + n.width));
  const maxY = Math.max(...nodes.map(n => n.y + n.height));
  const contentW = maxX - minX;
  const contentH = maxY - minY;
  // Force the map paper to 16:9 — expand the shorter dimension
  let mapW = contentW + 80;
  let mapH = contentH + 80;
  const targetRatio = 16 / 9;
  if (mapW / mapH > targetRatio) {
    // too wide → increase height
    mapH = mapW / targetRatio;
  } else {
    // too tall (or square) → increase width
    mapW = mapH * targetRatio;
  }
  const dataW = mapW;
  const dataH = mapH;
  // Content offset to keep it centred in the expanded canvas
  const contentOffsetX = (mapW - contentW) / 2;
  const contentOffsetY = (mapH - contentH) / 2;

  // Base scale that fits the data into the container (before zoom)
  const baseScale = Math.min(containerSize.w / dataW, containerSize.h / dataH) || 1;
  const S = baseScale;

  // canvas logical dimensions (the "paper")
  const canvasW = dataW * S;
  const canvasH = dataH * S;

  const tx = (x: number) => (x - minX + contentOffsetX) * S;
  const ty = (y: number) => (y - minY + contentOffsetY) * S;
  const ts = (s: number) => s * S;

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const majorEdges = edges.filter(e => e.label);
  const minorEdges = edges.filter(e => !e.label);

  const roadColor = "#8D99AE";
  const minorRoadColor = "#BDC3C7";
  const borderColor = "#6B7B8D";
  const bgColor = "#F5F0E8";

  const legendItems = useMemo(
    () => nodes.filter(n => !["roads", "paths", "railway"].includes(n.id)).slice(0, 8),
    [nodes],
  );

  // ── auto-fit + centre on mount / data change ───────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const fit = Math.min((r.width - 40) / canvasW, (r.height - 40) / canvasH) || 1;
    const z = Math.min(1, fit);
    setZoom(z);
    // Centre the canvas in the container
    setPan({
      x: (r.width - canvasW * z) / 2,
      y: (r.height - canvasH * z) / 2,
    });
  }, [canvasW, canvasH]);

  // ── pan / zoom handlers ────────────────────────────────────────────
  const constrainZoom = useCallback((z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z)), []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1 + ZOOM_STEP : 1 - ZOOM_STEP;
      const newZoom = constrainZoom(zoom * factor);
      // zoom towards cursor
      const ratio = newZoom / zoom;
      setPan(p => ({
        x: mx - ratio * (mx - p.x),
        y: my - ratio * (my - p.y),
      }));
      setZoom(newZoom);
    },
    [zoom, constrainZoom],
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
  }, []);

  // ── zoom button actions ────────────────────────────────────────────
  const zoomIn = useCallback(() => {
    setZoom(z => constrainZoom(z + ZOOM_STEP));
  }, [constrainZoom]);

  const zoomOut = useCallback(() => {
    setZoom(z => constrainZoom(z - ZOOM_STEP));
  }, [constrainZoom]);

  const resetView = useCallback(() => {
    const el = containerRef.current;
    let z = 1;
    if (el) {
      const r = el.getBoundingClientRect();
      const fit = Math.min((r.width - 40) / canvasW, (r.height - 40) / canvasH) || 1;
      z = Math.min(1, fit);
      setZoom(z);
      setPan({
        x: (r.width - canvasW * z) / 2,
        y: (r.height - canvasH * z) / 2,
      });
    } else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [canvasW, canvasH]);

  // ── render ─────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[2px] relative overflow-hidden select-none"
      style={{ background: "#EDE8DC", cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* ── zoom controls (top-right) ── */}
      <div className="absolute top-2 right-2 z-30 flex flex-col gap-1">
        <button
          onClick={zoomIn}
          className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors"
          title="放大"
        >
          <ZoomIn className="w-4 h-4 text-[#4A5568]" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors"
          title="重置视图"
        >
          <Maximize className="w-4 h-4 text-[#4A5568]" />
        </button>
        <button
          onClick={zoomOut}
          className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-4 h-4 text-[#4A5568]" />
        </button>

        {/* Compass */}
        <div className="mt-1 flex flex-col items-center" style={{ opacity: 0.6 }}>
          <span className="text-[9px] font-black text-[#8B9A8B]" style={{ fontFamily: "Nunito, sans-serif" }}>N</span>
          <div className="w-4 h-4 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#8B9A8B]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#B0B8B0]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[3px] border-b-[3px] border-r-[4px] border-t-transparent border-b-transparent border-r-[#B0B8B0]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[3px] border-b-[3px] border-l-[4px] border-t-transparent border-b-transparent border-l-[#B0B8B0]" />
          </div>
        </div>
      </div>

      {/* ── pan / zoom layer ── */}
      <div
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 z-10"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute"
          style={{
            transformOrigin: "0 0",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <svg
            width={canvasW}
            height={canvasH}
            viewBox={`0 0 ${canvasW} ${canvasH}`}
            style={{ filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.08))" }}
          >
            <defs>
              <GrassTexture id="grass-texture" />
              <PavedTexture id="paved-texture" />
              <WaterTexture id="water-texture" />
            </defs>

            {/* background */}
            <rect x={0} y={0} width={canvasW} height={canvasH} fill={bgColor} rx={ts(16)} />
            <rect x={0} y={0} width={canvasW} height={canvasH} fill="url(#grass-texture)" rx={ts(16)} opacity={0.5} />

            {/* zones */}
            {nodes.map(node => {
              const seed = hashId(node.id);
              const poly = generateIrregularPolygon(
                tx(node.x - minX + contentOffsetX), ty(node.y - minY + contentOffsetY),
                ts(node.width), ts(node.height), seed, S,
              );
              return (
                <polygon
                  key={`zone-${node.id}`}
                  points={poly}
                  fill={getMapFill(node.id)}
                  stroke={borderColor}
                  strokeWidth={ts(1.8)}
                  strokeLinejoin="round"
                  opacity={0.85}
                />
              );
            })}

            {/* pavement overlay */}
            {nodes.filter(n => getNodeDecor(n) === "building").map(node => {
              const seed = hashId(node.id);
              const poly = generateIrregularPolygon(
                tx(node.x - minX + contentOffsetX), ty(node.y - minY + contentOffsetY),
                ts(node.width), ts(node.height), seed, S,
              );
              return <polygon key={`paved-${node.id}`} points={poly} fill="url(#paved-texture)" opacity={0.3} />;
            })}

            {/* water overlay */}
            {nodes.filter(n => getNodeDecor(n) === "water").map(node => {
              const seed = hashId(node.id);
              const poly = generateIrregularPolygon(
                tx(node.x - minX + contentOffsetX), ty(node.y - minY + contentOffsetY),
                ts(node.width), ts(node.height), seed, S,
              );
              return <polygon key={`water-${node.id}`} points={poly} fill="url(#water-texture)" opacity={0.6} />;
            })}

            {/* minor roads */}
            {minorEdges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              return (
                <line
                  key={`minor-${i}`}
                  x1={tx(from.x + from.width / 2 - minX + contentOffsetX)}
                  y1={ty(from.y + from.height / 2 - minY + contentOffsetY)}
                  x2={tx(to.x + to.width / 2 - minX + contentOffsetX)}
                  y2={ty(to.y + to.height / 2 - minY + contentOffsetY)}
                  stroke={minorRoadColor}
                  strokeWidth={ts(2)}
                  strokeLinecap="round"
                  strokeDasharray={`${ts(5)},${ts(4)}`}
                />
              );
            })}

            {/* major roads */}
            {majorEdges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const x1 = tx(from.x + from.width / 2 - minX + contentOffsetX);
              const y1 = ty(from.y + from.height / 2 - minY + contentOffsetY);
              const x2 = tx(to.x + to.width / 2 - minX + contentOffsetX);
              const y2 = ty(to.y + to.height / 2 - minY + contentOffsetY);
              return (
                <g key={`major-${i}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={borderColor} strokeWidth={ts(6)} strokeLinecap="round" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={roadColor} strokeWidth={ts(4)} strokeLinecap="round" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={ts(0.8)} strokeLinecap="round" strokeDasharray={`${ts(6)},${ts(6)}`} opacity={0.7} />
                </g>
              );
            })}

            {/* road labels */}
            {majorEdges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to || !edge.label) return null;
              const mx = tx((from.x + from.width / 2 + to.x + to.width / 2) / 2 - minX + contentOffsetX);
              const my = ty((from.y + from.height / 2 + to.y + to.height / 2) / 2 - minY + contentOffsetY);
              const dx = to.x + to.width / 2 - (from.x + from.width / 2);
              const dy = to.y + to.height / 2 - (from.y + from.height / 2);
              const len = Math.sqrt(dx * dx + dy * dy) || 1;
              const px = (-dy / len) * ts(8);
              const py = (dx / len) * ts(8);
              return (
                <g key={`road-label-${i}`}>
                  <rect
                    x={mx + px - ts((edge.label.length * 4) + 6)}
                    y={my + py - ts(10)}
                    width={ts(edge.label.length * 8 + 12)}
                    height={ts(20)}
                    rx={ts(10)}
                    fill="white"
                    stroke="#ACB6B0"
                    strokeWidth={ts(0.8)}
                  />
                  <text
                    x={mx + px}
                    y={my + py}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={ts(9)}
                    fontWeight={700}
                    fill="#4A5568"
                    fontFamily="Nunito, sans-serif"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* zone labels */}
            {nodes.map(node => (
              <text
                key={`label-${node.id}`}
                x={tx(node.x + node.width / 2 - minX + contentOffsetX)}
                y={ty(node.y + node.height / 2 - minY + contentOffsetY)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={ts(11)}
                fontWeight={800}
                fill="#2C3E50"
                fontFamily="Nunito, sans-serif"
                style={{ textShadow: `0 0 ${ts(4)}px rgba(255,255,255,0.8)` }}
              >
                {node.label}
              </text>
            ))}

            {/* trees */}
            {nodes.filter(n => getNodeDecor(n) === "trees").map(node => {
              const seed = hashId(node.id);
              const count = Math.max(3, Math.floor((node.width * node.height) / 800));
              return Array.from({ length: count }, (_, i) => (
                <TreeIcon
                  key={`tree-${node.id}-${i}`}
                  x={tx(node.x + 10 + (node.width / (count + 1)) * (i + 1) + Math.sin(seed + i * 3) * 6 - minX + contentOffsetX)}
                  y={ty(node.y + node.height * 0.35 + Math.cos(seed + i * 5) * 8 - minY + contentOffsetY)}
                  s={ts(12)}
                />
              ));
            })}

            {/* buildings */}
            {nodes.filter(n => getNodeDecor(n) === "building").map(node => (
              <BuildingIcon
                key={`building-${node.id}`}
                x={tx(node.x + node.width / 2 - minX + contentOffsetX)}
                y={ty(node.y + node.height * 0.65 - minY + contentOffsetY)}
                s={ts(20)}
                color={getMapFill(node.id)}
              />
            ))}

            {/* scale bar */}
            <g transform={`translate(${ts(16)}, ${canvasH - ts(20)})`}>
              <rect x={0} y={0} width={ts(60)} height={ts(4)} fill="#2C3E50" rx={ts(2)} />
              <rect x={0} y={ts(4)} width={ts(1)} height={ts(6)} fill="#2C3E50" />
              <rect x={ts(60)} y={ts(4)} width={ts(1)} height={ts(6)} fill="#2C3E50" />
              <text x={ts(30)} y={ts(14)} textAnchor="middle" fontSize={ts(7)} fill="#7F8C8D" fontFamily="Nunito, sans-serif">
                NTS
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Legend (stays fixed, outside pan/zoom) */}
      {legendItems.length > 3 && (
        <div className="absolute bottom-2 left-3 flex flex-wrap gap-1.5 z-30 pointer-events-none" style={{ maxWidth: containerSize.w * 0.6 }}>
          {legendItems.map(item => (
            <div key={`leg-${item.id}`} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.75)" }}>
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0 border border-[#7F8C8D]/30" style={{ background: getMapFill(item.id) }} />
              <span className="text-[8px] font-semibold text-[#4A5568] leading-none" style={{ fontFamily: "Nunito, sans-serif" }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zoom % indicator */}
      <div className="absolute bottom-2 right-3 z-30 text-[10px] font-bold text-[#7F8C8D]" style={{ fontFamily: "Nunito, sans-serif" }}>
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
