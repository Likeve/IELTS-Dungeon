"use client";

import React from "react";
import { Flag, User, ArrowLeft } from "lucide-react";

export default function Header({ chartDetail, onBack }: { chartDetail?: { stage: number } | null; onBack?: () => void }) {
  return (
    <header className="h-[65px] shrink-0 flex items-center gap-3 px-4 bg-[#FAFFE9] border-b border-black sticky top-0 z-30">
      {chartDetail ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={onBack} className="p-1 hover:opacity-70 transition-opacity" aria-label="返回题目列表">
            <ArrowLeft className="w-5 h-5 text-[#000000]" />
          </button>
          <h2
            className="text-[14px] text-[#000000] whitespace-nowrap"
            style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
          >
            第{chartDetail.stage}关 ：题目改写
          </h2>
          <span
            className="text-[14px] font-bold text-[#000000] whitespace-nowrap"
            style={{ fontFamily: "var(--font-edu-hand-bold), sans-serif" }}
          >
            Introduction
          </span>
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex items-center gap-2 shrink-0">
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
      </div>
    </header>
  );
}
