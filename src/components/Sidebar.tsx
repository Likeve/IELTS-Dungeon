"use client";

import React from "react";
import { motion } from "framer-motion";
import { Headphones, Mic, BookOpen, PenLine } from "lucide-react";

export type Category = "listening" | "speaking" | "reading" | "writing";

type SidebarProps = {
  active: Category;
  onSelect: (category: Category) => void;
};

const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "listening", label: "听", icon: Headphones, color: "from-teal-400 to-teal-600" },
  { id: "speaking", label: "说", icon: Mic, color: "from-rose-400 to-rose-600" },
  { id: "reading", label: "读", icon: BookOpen, color: "from-amber-400 to-amber-600" },
  { id: "writing", label: "写", icon: PenLine, color: "from-violet-400 to-violet-600" },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <>
      {/* Desktop: Left Sidebar */}
      <aside className="hidden md:flex w-20 shrink-0 flex-col items-center gap-1 pt-6 border-r border-gray-200 bg-white">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b ${cat.color}`}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <cat.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{cat.label}</span>
            </motion.button>
          );
        })}
      </aside>

      {/* Mobile: Bottom Tab Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-bottom">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all ${
                isActive
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className={`absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b-full bg-gradient-to-r ${cat.color}`}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <cat.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{cat.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
