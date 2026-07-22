"use client";

import { useState, useRef, useCallback } from "react";
import MatchingGame from "@/components/MatchingGame";
import Sidebar, { Category, GameMode } from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("writing");
  const [gameMode, setGameMode] = useState<GameMode>("words");
  const [insideCard, setInsideCard] = useState(false);
  const [chartView, setChartView] = useState<"list" | "detail">("list");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pendingNavRef = useRef<(() => void) | null>(null);

  const isChartDetail = (activeCategory === "writing" || activeCategory === "reading") && gameMode === "chart" && chartView === "detail";

  const handleCategoryChange = useCallback((cat: Category) => {
    if (isChartDetail && cat !== activeCategory) {
      pendingNavRef.current = () => setActiveCategory(cat);
      setShowExitConfirm(true);
      return;
    }
    setActiveCategory(cat);
  }, [isChartDetail, activeCategory]);

  const handleGameModeChange = useCallback((mode: GameMode) => {
    if (isChartDetail && mode !== gameMode) {
      pendingNavRef.current = () => setGameMode(mode);
      setShowExitConfirm(true);
      return;
    }
    setGameMode(mode);
  }, [isChartDetail, gameMode]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    pendingNavRef.current?.();
    pendingNavRef.current = null;
  }, []);

  const cancelExit = useCallback(() => {
    setShowExitConfirm(false);
    pendingNavRef.current = null;
  }, []);

  return (
    <div className="h-screen flex overflow-hidden pb-14 md:pb-0">
      <Sidebar
        active={activeCategory}
        onSelect={handleCategoryChange}
        activeGameMode={gameMode}
        onGameModeSelect={handleGameModeChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <Header chartDetail={isChartDetail ? { stage: 1 } : undefined} onBack={() => setChartView("list")} />

        {activeCategory === "writing" || activeCategory === "reading" || activeCategory === "listening" ? (
          <MatchingGame
            initialGameMode={gameMode}
            onInsideChange={setInsideCard}
            chartView={chartView}
            onChartViewChange={setChartView}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center bg-[#F0F6DB]">
            <p className="text-[#808771] text-lg font-medium">
              即将推出
            </p>
          </div>
        )}
      </div>

      {/* 离开确认弹窗 */}
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
    </div>
  );
}
