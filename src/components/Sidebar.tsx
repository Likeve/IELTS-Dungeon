"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Mic,
  BookOpen,
  PenLine,
  Settings,
  ChevronDown,
} from "lucide-react";

export type Category = "listening" | "speaking" | "reading" | "writing";

export type GameMode = "words" | "phrases" | "sentences" | "dictation" | "chart";

type SidebarProps = {
  active: Category;
  onSelect: (category: Category) => void;
  activeGameMode: GameMode;
  onGameModeSelect: (mode: GameMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

const categories: {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    id: "listening",
    label: "听力岛屿",
    icon: Headphones,
    accent: "#A78BFA",
  },
  {
    id: "speaking",
    label: "口语战场",
    icon: Mic,
    accent: "#FB923C",
  },
  {
    id: "reading",
    label: "阅读山丘",
    icon: BookOpen,
    accent: "#4ADE80",
  },
  {
    id: "writing",
    label: "写作王国",
    icon: PenLine,
    accent: "#FACC15",
  },
];

const subMenuMap: Record<string, { mode: GameMode; label: string }[]> = {
  listening: [{ mode: "dictation", label: "听写作文" }],
  reading: [
    { mode: "words", label: "词汇消消乐" },
    { mode: "phrases", label: "同义替换" },
  ],
  writing: [
    { mode: "sentences", label: "长难句锻造" },
    { mode: "chart", label: "图表挑战赛" },
  ],
};

export default function Sidebar({
  active,
  onSelect,
  activeGameMode,
  onGameModeSelect,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<Category, boolean>>({
    listening: true,
    speaking: false,
    reading: true,
    writing: true,
  });

  const toggle = (id: Category) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {/* Desktop: Left Sidebar */}
      <aside
        className={`hidden md:flex shrink-0 flex-col bg-[#FAFFE9] h-screen sticky top-0 border-r border-black/5 overflow-hidden transition-all duration-300 ${
          collapsed ? "w-[72px] px-2 py-5" : "w-[220px] px-3 py-5"
        }`}>
        {collapsed ? (
          <>
            {/* Collapsed: icon-only */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#FCFF98] flex items-center justify-center">
                <img src="/logo2.svg" alt="Yasee" className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-2">
              {categories.map((cat) => {
                const isActive = active === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: isActive ? cat.accent : "transparent" }}
                    title={cat.label}
                  >
                    <cat.icon className="w-5 h-5 text-[#232323]" />
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                        style={{ backgroundColor: cat.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center mt-auto">
              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
                title="设置"
              >
                <Settings className="w-5 h-5 text-[#808771]" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#FCFF98] flex items-center justify-center">
                <img src="/logo2.svg" alt="Yasee" className="w-6 h-6" />
              </div>
              <span className="text-lg font-black text-[#1D2838]">Yasee</span>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-1 flex-1 overflow-y-auto px-1">
              {categories.map((cat) => {
                const isActive = active === cat.id;
                const isExpandable = !!subMenuMap[cat.id];
                const isExpanded = expanded[cat.id];
                const subItems = subMenuMap[cat.id] || [];

                return (
                  <div key={cat.id}>
                    <button
                      onClick={() => {
                        if (isExpandable) toggle(cat.id);
                        onSelect(cat.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive
                          ? "bg-white text-[#191919] font-bold"
                          : "text-[#64725D] font-medium hover:bg-white/60"
                      }`}
                    >
                      <cat.icon className="w-5 h-5 shrink-0" style={{ color: isActive ? cat.accent : "#808771" }} />
                      <span className="whitespace-nowrap text-left flex-1">
                        {cat.label}
                      </span>
                      {isExpandable && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 shrink-0 text-[#808771]" />
                        </motion.div>
                      )}
                    </button>

                    {/* Sub-menu */}
                    {isExpandable && (
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 ml-4 pl-4 mt-1 border-l border-[#D4D4C8]">
                              {subItems.map((item) => {
                                const isSubActive = activeGameMode === item.mode;
                                return (
                                  <button
                                    key={item.mode}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onGameModeSelect(item.mode);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                                      isSubActive
                                        ? "bg-[#FCFF98] text-[#191919] font-bold"
                                        : "text-[#64725D] hover:bg-white/60"
                                    }`}
                                  >
                                    {item.label}
                                  </button>
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
            <button className="mx-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64725D] hover:bg-white/60 transition-colors">
              <Settings className="w-5 h-5" />
              <span>设置</span>
            </button>
          </>
        )}
      </aside>

      {/* Mobile: Bottom Tab Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAFFE9] border-t border-[#D4D4C8] px-2 pb-safe">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-colors ${
                isActive ? "text-[#191919]" : "text-[#808771]"
              }`}
            >
              <cat.icon className="w-5 h-5" style={{ color: isActive ? cat.accent : "currentColor" }} />
              <span className="text-[10px] font-medium">{cat.label}</span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#191919]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
