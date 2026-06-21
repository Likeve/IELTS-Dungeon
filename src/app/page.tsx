"use client";

import { useState } from "react";
import MatchingGame from "@/components/MatchingGame";
import Sidebar, { Category, GameMode } from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("writing");
  const [gameMode, setGameMode] = useState<GameMode>("words");
  const [insideCard, setInsideCard] = useState(false);

  return (
    <div className="min-h-screen flex pb-14 md:pb-0">
      <Sidebar
        active={activeCategory}
        onSelect={setActiveCategory}
        activeGameMode={gameMode}
        onGameModeSelect={setGameMode}
      />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 bg-[#F7F6F0]">
          {activeCategory === "writing" ? (
            <MatchingGame
              initialGameMode={gameMode}
              onInsideChange={setInsideCard}
            />
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <p className="text-[#808771] text-lg font-medium">
                即将推出
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
