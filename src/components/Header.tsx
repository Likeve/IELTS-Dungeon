"use client";

import React from "react";

export default function Header({ chartDetail, onBack }: { chartDetail?: { stage: number } | null; onBack?: () => void }) {
  return (
    <header className="h-[56px] shrink-0 flex items-center justify-between px-4 bg-[#F8FDE9] sticky top-0 z-30">
      {chartDetail ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 group"
          aria-label="返回图表列表"
        >
          <img src="/icons/arrow-left.svg" alt="返回" className="w-5 h-5" />
          <span
            className="text-[14px] font-bold text-[#191919]"
            style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
          >
            返回图表列表
          </span>
        </button>
      ) : (
        <div />
      )}

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{ backgroundColor: "#F0F6DB" }}
      >
        <img src="/icons/profile-circle.svg" alt="用户" className="w-6 h-6" />
        <span
          className="text-[14px] font-extrabold text-[#090909]"
          style={{ fontFamily: "var(--font-langyuan), sans-serif" }}
        >
          Kv
        </span>
      </div>
    </header>
  );
}
