"use client";

import React from "react";
import { Flag, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-[65px] shrink-0 flex items-center justify-end gap-3 px-4 bg-[#F6E9C5] border-b border-black sticky top-0 z-30">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-[1.5px] border-black bg-[#DCCEA7]">
        <span className="text-sm font-black text-[#080808]">等级：Lv4</span>
      </div>

      <button className="flex items-center gap-2 px-3 py-2 rounded-xl border-[1.5px] border-black bg-[#DCCEA7] hover:brightness-[0.97] transition-all">
        <Flag className="w-4 h-4 text-[#080808]" />
        <span className="text-sm font-black text-[#080808]">任务中心</span>
      </button>

      <button className="flex items-center gap-2 px-3 py-2 rounded-xl border-[1.5px] border-black bg-[#DCCEA7] hover:brightness-[0.97] transition-all">
        <User className="w-4 h-4 text-[#080808]" />
        <span className="text-sm font-black text-[#080808]">Kv</span>
      </button>
    </header>
  );
}
