"use client";

import React from "react";
import { Flag, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-[65px] shrink-0 flex items-center justify-end gap-3 px-4 bg-[#FFFCF4] border-b border-[#F4F4F4]">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ECECD9]">
        <span className="text-sm font-black text-[#080808]">等级：Lv4</span>
      </div>

      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ECECD9] hover:bg-[#E0E0CC] transition-colors">
        <Flag className="w-4 h-4 text-[#080808]" />
        <span className="text-sm font-black text-[#080808]">任务中心</span>
      </button>

      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ECECD9] hover:bg-[#E0E0CC] transition-colors">
        <User className="w-4 h-4 text-[#080808]" />
        <span className="text-sm font-black text-[#080808]">Kv</span>
      </button>
    </header>
  );
}
