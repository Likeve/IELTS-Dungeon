"use client";

import { useState } from "react";
import MatchingGame from "@/components/MatchingGame";
import Sidebar, { Category } from "@/components/Sidebar";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("writing");

  return (
    <div className="min-h-screen flex pb-14 md:pb-0">
      <Sidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 bg-gray-50">
        {activeCategory === "writing" ? (
          <MatchingGame />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-400 text-lg font-medium">
              即将推出
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
