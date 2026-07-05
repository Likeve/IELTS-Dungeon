"use client";

import { useState } from "react";
import MatchingGame from "@/components/MatchingGame";
import Sidebar, { Category, GameMode } from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("writing");
  const [gameMode, setGameMode] = useState<GameMode>("words");
  const [insideCard, setInsideCard] = useState(false);
  const [chartView, setChartView] = useState<"list" | "detail">("list");

  const isChartDetail = activeCategory === "writing" && gameMode === "chart" && chartView === "detail";

  return (
    <div className="h-screen flex overflow-hidden pb-14 md:pb-0">
      <Sidebar
        active={activeCategory}
        onSelect={setActiveCategory}
        activeGameMode={gameMode}
        onGameModeSelect={setGameMode}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <Header chartDetail={isChartDetail ? { stage: 1 } : undefined} onBack={() => setChartView("list")} />

        {activeCategory === "writing" ? (
          <MatchingGame
            initialGameMode={gameMode}
            onInsideChange={setInsideCard}
            chartView={chartView}
            onChartViewChange={setChartView}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center bg-[#F7F6F0]">
            <p className="text-[#808771] text-lg font-medium">
              即将推出
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
