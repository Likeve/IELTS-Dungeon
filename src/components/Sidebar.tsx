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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
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
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    id: "listening",
    label: "听力岛屿",
    subtitle: "Listening Isle",
    icon: Headphones,
    accent: "#A78BFA",
  },
  {
    id: "speaking",
    label: "口语战场",
    subtitle: "Speaking Arena",
    icon: Mic,
    accent: "#FB923C",
  },
  {
    id: "reading",
    label: "阅读山丘",
    subtitle: "Reading Hills",
    icon: BookOpen,
    accent: "#4ADE80",
  },
  {
    id: "writing",
    label: "写作王国",
    subtitle: "Writing Kingdom",
    icon: PenLine,
    accent: "#FACC15",
  },
];

const subMenuMap: Record<string, { mode: GameMode; label: string; emoji: string }[]> = {
  listening: [{ mode: "dictation", label: "听写作文", emoji: "🎧" }],
  reading: [
    { mode: "words", label: "词汇消消乐", emoji: "🧩" },
    { mode: "phrases", label: "同义替换", emoji: "🔄" },
  ],
  writing: [
    { mode: "sentences", label: "长难句锻造", emoji: "⚒️" },
    { mode: "chart", label: "图表挑战赛", emoji: "📊" },
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
        className={`hidden md:flex shrink-0 flex-col bg-[#FAFFE9] h-screen sticky top-0 border-r-[1.5px] border-black/5 overflow-hidden transition-all duration-300 ${
          collapsed ? "w-[72px] px-1 py-5" : "w-[240px] px-4 py-5"
        }`}>
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border-[1.5px] border-[#D4D4C8] flex items-center justify-center z-10 hover:bg-[#F5F5F0] transition-colors shadow-sm"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-[#64725D]" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-[#64725D]" />
          )}
        </button>

        {collapsed ? (
          <>
            {/* Collapsed: compact icon-only mode */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#FCFF98] flex items-center justify-center">
                <img src="/logo2.svg" alt="Yasee" className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-2 py-2">
              {categories.map((cat) => {
                const isActive = active === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: isActive ? cat.accent : "#F5F5F0" }}
                    title={`${cat.label} · ${cat.subtitle}`}
                  >
                    <cat.icon className="w-4 h-4 text-[#232323]" />
                    {isActive && (
                      <motion.div
                        layoutId="collapsedActive"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                        style={{ backgroundColor: cat.accent }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3 mt-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center hover:bg-[#EAECEE] transition-colors"
                title="设置"
              >
                <Settings className="w-4 h-4 text-[#808771]" />
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Expanded: full sidebar */}
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#FCFF98] flex items-center justify-center">
                <img src="/logo2.svg" alt="Yasee" className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#1D2838] leading-none">Yasee</span>
                <span className="text-[10px] font-bold text-[#808771] leading-none mt-0.5">
                  雅思修炼场
                </span>
              </div>
            </div>

            {/* Player mini card */}
            <div className="mx-2 mb-5 rounded-2xl p-3 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#AFFF8A] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#232323]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[#232323] truncate">Lv.4 烤鸭勇士</span>
                  <div className="w-full h-1.5 bg-[#E5E5D8] rounded-full mt-1 overflow-hidden">
                    <div className="h-full w-[60%] bg-[#AFFF8A] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto px-2">
              {categories.map((cat) => {
                const isActive = active === cat.id;
                const isExpandable = !!subMenuMap[cat.id];
                const isExpanded = expanded[cat.id];
                const subItems = subMenuMap[cat.id] || [];

                return (
                  <div key={cat.id}>
                    <motion.button
                      onClick={() => {
                        if (isExpandable) toggle(cat.id);
                        onSelect(cat.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm transition-all border-[1.5px] ${
                        isActive
                          ? "bg-white border-[#D4D4C8] text-black font-black"
                          : "bg-transparent border-transparent text-[#64725D] font-medium hover:bg-white/60"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: isActive ? cat.accent : "#F5F5F0" }}
                      >
                        <cat.icon className="w-4 h-4 text-[#232323]" />
                      </div>
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="whitespace-nowrap text-left leading-none">
                          {cat.label}
                        </span>
                        <span className="text-[9px] font-bold text-[#808771] mt-0.5">
                          {cat.subtitle}
                        </span>
                      </div>
                      {isExpandable && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 shrink-0 text-[#808771]" />
                        </motion.div>
                      )}
                    </motion.button>

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
                            <div className="flex flex-col gap-1 ml-5 pl-5 mt-1 mb-1 border-l-2 border-dashed border-[#D4D4C8]">
                              {subItems.map((item) => {
                                const isSubActive = activeGameMode === item.mode;
                                return (
                                  <motion.button
                                    key={item.mode}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onGameModeSelect(item.mode);
                                    }}
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all whitespace-nowrap flex items-center gap-2 border-[1.5px] ${
                                      isSubActive
                                        ? "bg-[#FCFF98] border-[#D4D4C8] text-[#232323] font-black"
                                        : "bg-white/40 border-transparent text-[#64725D] font-medium hover:bg-white"
                                    }`}
                                  >
                                    <span>{item.emoji}</span>
                                    <span>{item.label}</span>
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

            {/* Daily quest hint */}
            <div className="mx-2 mt-3 mb-3 rounded-2xl border-[1.5px] border-[#AFFF8A] bg-[#F3FAE3] p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#52B543]" />
                <span className="text-[11px] font-black text-[#232323]">今日目标</span>
              </div>
              <p className="text-[10px] text-[#64725D] leading-relaxed">
                完成 1 篇图表写作，冲击 7 分小作文！
              </p>
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-2 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F2F4F6] hover:bg-[#EAECEE] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#808771]" />
              <span className="text-xs font-bold text-[#64725D]">设置</span>
            </motion.button>
          </>
        )}
      </aside>

      {/* Mobile: Bottom Tab Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAFFE9] border-t border-[#D4D4C8] px-2 pb-safe">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-all ${
                isActive ? "text-black" : "text-[#808771]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center`}
                style={{ backgroundColor: isActive ? cat.accent : "transparent" }}
              >
                <cat.icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold">{cat.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-black"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
