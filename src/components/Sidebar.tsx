"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Mic, BookOpen, PenLine, Settings, ChevronDown } from "lucide-react";

export type Category = "listening" | "speaking" | "reading" | "writing";

export type GameMode = "words" | "phrases" | "sentences" | "dictation" | "chart";

type SidebarProps = {
  active: Category;
  onSelect: (category: Category) => void;
  activeGameMode: GameMode;
  onGameModeSelect: (mode: GameMode) => void;
};

const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "listening", label: "听力岛屿", icon: Headphones },
  { id: "speaking", label: "口语战场", icon: Mic },
  { id: "reading", label: "阅读山丘", icon: BookOpen },
  { id: "writing", label: "写作王国", icon: PenLine },
];

const writingSubItems: { mode: GameMode; label: string }[] = [
  { mode: "words", label: "词汇消消乐" },
  { mode: "phrases", label: "同义替换" },
  { mode: "sentences", label: "长难句锻造" },
  { mode: "dictation", label: "听写作文" },
  { mode: "chart", label: "图表挑战赛" },
];

export default function Sidebar({ active, onSelect, activeGameMode, onGameModeSelect }: SidebarProps) {
  const [writingExpanded, setWritingExpanded] = useState(true);

  return (
    <>
      {/* Desktop: Left Sidebar */}
      <aside className="hidden md:flex w-fit shrink-0 flex-col border-r border-[#F4F4F4] bg-[#FFFCF4] px-4 py-6 gap-6 h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-0">
          <img src="/logo.svg" alt="Yasee" className="w-6 h-6" />
          <span className="text-2xl font-black text-[#1D2838]">Yasee</span>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-1 flex-1 items-start">
          {categories.map((cat) => {
            const isActive = active === cat.id;
            const isWriting = cat.id === "writing";

            return (
              <div key={cat.id}>
                <motion.button
                  onClick={() => {
                    if (isWriting) {
                      setWritingExpanded(!writingExpanded);
                    }
                    onSelect(cat.id);
                  }}
                  whileHover={isActive ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-fit flex items-center gap-3 px-4 py-3.5 rounded-full text-sm transition-all ${
                    isActive
                      ? "bg-[#F3FAE3] text-black font-black"
                      : "text-[#808771] font-medium hover:bg-[#F9F6ED]"
                  }`}
                >
                  <cat.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#232323]" : "text-[#808771]"}`} />
                  <span className="whitespace-nowrap text-left">{cat.label}</span>
                  {isWriting && (
                    <motion.div
                      animate={{ rotate: writingExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Writing Sub-menu */}
                {isWriting && (
                  <AnimatePresence initial={false}>
                    {writingExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-0.5 ml-11 mt-0.5 mb-0.5">
                          {writingSubItems.map((item) => {
                            const isSubActive = activeGameMode === item.mode;
                            return (
                              <motion.button
                                key={item.mode}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onGameModeSelect(item.mode);
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className={`w-fit text-left px-3 py-2 rounded-full text-xs transition-all whitespace-nowrap ${
                                  isSubActive
                                    ? "bg-[#ECECD9] text-[#080808] font-black"
                                    : "text-[#808771] font-medium hover:bg-[#F9F6ED]"
                                }`}
                              >
                                {item.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-2xl bg-[#F2F4F6] flex items-center justify-center mx-auto transition-colors hover:bg-[#EAECEE]"
        >
          <Settings className="w-6 h-6 text-[#808771]" />
        </motion.button>
      </aside>

      {/* Mobile: Bottom Tab Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFCF4] border-t border-[#F4F4F4]">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-all ${
                isActive
                  ? "text-black"
                  : "text-[#808771]"
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{cat.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute top-0 left-2 right-2 h-0.5 rounded-full bg-[#AFFF8A]"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
