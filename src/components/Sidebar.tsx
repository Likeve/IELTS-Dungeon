"use client";

import React from "react";
import { motion } from "framer-motion";
import { Headphones, Mic, BookOpen, PenLine, Settings } from "lucide-react";

export type Category = "listening" | "speaking" | "reading" | "writing";

type SidebarProps = {
  active: Category;
  onSelect: (category: Category) => void;
};

const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "listening", label: "听力岛屿", icon: Headphones },
  { id: "speaking", label: "口语战场", icon: Mic },
  { id: "reading", label: "阅读山丘", icon: BookOpen },
  { id: "writing", label: "写作王国", icon: PenLine },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <>
      {/* Desktop: Left Sidebar */}
      <aside className="hidden md:flex w-40 shrink-0 flex-col border-r border-[#F4F4F4] bg-[#FFFCF4] px-4 py-6 gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-0">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 11L12 19L4 11L12 3Z" fill="#AFFF8A" stroke="#232323" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="text-2xl font-black text-[#1D2838]">Yasee</span>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-1 flex-1">
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                whileHover={isActive ? {} : { scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-full text-sm transition-all ${
                  isActive
                    ? "bg-[#F3FAE3] text-black font-black"
                    : "text-[#808771] font-medium hover:bg-[#F9F6ED]"
                }`}
              >
                <cat.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#232323]" : "text-[#808771]"}`} />
                <span className="whitespace-nowrap">{cat.label}</span>
              </motion.button>
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
