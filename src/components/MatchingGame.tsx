"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, BookOpen, MessageCircle, X, Volume2, Headphones, PenLine, ArrowLeft, Sparkles } from "lucide-react";
import { IELTS_WORDS } from "@/data/ieltsWords";
import { IELTS_PHRASES, PhrasePair } from "@/data/ieltsPhrases";
import SentenceForge from "./SentenceForge";
import DictationGame from "./DictationGame";
import WritingForge from "./WritingForge";
import { speakText } from "@/lib/speech";
import { WORD_EXAMPLES } from "@/data/ieltsWordExamples";

// Types
type GameItem = {
  id: string;
  text: string;
  type: "left" | "right";
  pairId: string;
};

type PairData = {
  id: string;
  left: string;
  right: string;
};

type GameProgress = {
  allPairs: PairData[];
  currentStage: number;
  matchedPairs: string[];
  leftItems: GameItem[];
  rightItems: GameItem[];
  wordPool: PairData[];
};

// Helper: Shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Singleton AudioContext for mobile compatibility
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Helper: Play success sound
const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playOscillator = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Play a nice two-tone chime (e.g., C5 followed by G5)
    playOscillator(523.25, 0, 0.3); // C5
    playOscillator(783.99, 0.1, 0.5); // G5
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

// Helper: Play error sound
const playErrorSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playOscillator = (freq: number, type: OscillatorType, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Play a low "uh-oh" double beep
    playOscillator(150, 'square', 0, 0.15);
    playOscillator(100, 'square', 0.15, 0.2);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

// Helper: Highlight phrase in text
const highlightPhrase = (text: string, phrase1: string, phrase2: string) => {
  if (!phrase1 && !phrase2) return text;
  
  const buildRegexStr = (phrase: string) => {
    if (!phrase) return '';
    // Escape regex special characters except spaces
    let p = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    if (p.startsWith('be ')) {
      p = '(?:be|is|are|am|was|were|been|being)\\s+' + p.substring(3);
    } else {
      const firstWord = p.split(' ')[0];
      const irregulars: Record<string, string> = {
        'take': 't[a-z]+', 'give': 'g[a-z]+', 'come': 'c[a-z]+', 'go': 'g[a-z]+',
        'make': 'm[a-z]+', 'have': 'h[a-z]+', 'get': 'g[a-z]+', 'fall': 'f[a-z]+',
        'bring': 'b[a-z]+', 'catch': 'c[a-z]+', 'run': 'r[a-z]+', 'throw': 't[a-z]+',
        'draw': 'd[a-z]+', 'lead': 'l[a-z]+', 'leave': 'l[a-z]+', 'lose': 'l[a-z]+',
        'pay': 'p[a-z]+', 'stick': 's[a-z]+', 'think': 't[a-z]+', 'do': 'd[a-z]+',
        'die': 'd[a-z]+', 'lay': 'l[a-z]+', 'set': 'set[a-z]*', 'put': 'put[a-z]*',
        'cut': 'cut[a-z]*', 'stand': 'st[a-z]+', 'speed': 'sp[a-z]+', 'bear': 'b[a-z]+',
        'keep': 'k[a-z]+', 'hold': 'h[a-z]+', 'write': 'w[a-z]+', 'read': 'r[a-z]+',
        'meet': 'm[a-z]+', 'mean': 'm[a-z]+', 'hear': 'h[a-z]+', 'see': 's[a-z]+',
        'grow': 'g[a-z]+', 'know': 'k[a-z]+', 'understand': 'u[a-z]+', 'spend': 's[a-z]+',
        'win': 'w[a-z]+', 'let': 'let[a-z]*', 'begin': 'b[a-z]+', 'break': 'b[a-z]+',
        'quit': 'quit[a-z]*', 'cost': 'cost[a-z]*', 'hit': 'hit[a-z]*', 'hurt': 'hurt[a-z]*',
        'shut': 'shut[a-z]*', 'split': 'split[a-z]*', 'spread': 'spread[a-z]*'
      };
      
      if (irregulars[firstWord]) {
        p = irregulars[firstWord] + p.substring(firstWord.length);
      } else {
        p = firstWord + '[a-z]*' + p.substring(firstWord.length);
      }
    }
    return p;
  };

  const p1Regex = buildRegexStr(phrase1);
  const p2Regex = buildRegexStr(phrase2);
  
  try {
    const regex = new RegExp(`(${p1Regex}|${p2Regex})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (part.match(new RegExp(`^(${p1Regex}|${p2Regex})$`, 'i'))) {
        return <strong key={i} className="text-black font-bold bg-gray-200 px-1.5 py-0.5 rounded-md mx-0.5">{part}</strong>;
      }
      return part;
    });
  } catch (e) {
    return text;
  }
};

const SHARD_COLORS = ["#6EE7B7", "#34D399", "#10B981", "#A7F3D0", "#059669", "#047857"];

function ParticleBurst() {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ w: 140, h: 48 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ w: r.width, h: r.height });
    }
  }, []);

  const cols = 5;
  const rows = 4;
  const total = cols * rows;

  const particles = useMemo(() => {
    return Array.from({ length: total }).map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const startX = (col / (cols - 1) - 0.5) * rect.w * 0.85;
      const startY = (row / (rows - 1) - 0.5) * rect.h * 0.85;
      const outAngle = Math.atan2(startY, startX);
      const spreadAngle = outAngle + (Math.random() - 0.5) * 0.25;
      const baseDist = Math.max(rect.w, rect.h) * 0.5;
      const distance = baseDist + Math.random() * baseDist * 0.6;
      const endX = Math.cos(spreadAngle) * distance;
      const endY = Math.sin(spreadAngle) * distance;
      const w = 6 + Math.random() * 6;
      const h = 3 + Math.random() * 4;
      const rotation = outAngle * (180 / Math.PI) + (Math.random() - 0.5) * 30;
      return { startX, startY, endX, endY, w, h, rotation, color: SHARD_COLORS[i % SHARD_COLORS.length] };
    });
  }, [rect]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-visible z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: p.startX, y: p.startY, scale: 1, opacity: 1, rotate: 0 }}
          animate={{
            x: p.endX,
            y: p.endY,
            scale: 0.1,
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.1,
            ease: "easeOut",
          }}
          className="absolute inset-0 m-auto rounded-[2px]"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

const highlightWordInText = (text: string, word: string): React.ReactNode => {
  if (!word) return text;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const stem = escaped.length >= 4 ? escaped.substring(0, Math.min(escaped.length - 1, 5)) : escaped;
  const pattern = new RegExp(`(${escaped}\\w*|\\w*${stem}\\w*)`, 'gi');
  const parts = text.split(pattern);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const lowerPart = part.toLowerCase();
    const lowerWord = word.toLowerCase();
    if (lowerPart === lowerWord || (lowerPart.length >= lowerWord.length && lowerPart.startsWith(lowerWord))) {
      return <strong key={i} className="font-bold text-gray-900">{part}</strong>;
    }
    if (lowerPart.length >= 4 && lowerWord.length >= 4 && lowerPart.startsWith(lowerWord.substring(0, 4))) {
      return <strong key={i} className="font-bold text-gray-900">{part}</strong>;
    }
    return part;
  });
};

export default function MatchingGame({ onInsideChange }: { onInsideChange?: (inside: boolean) => void }) {
  const [leftItems, setLeftItems] = useState<GameItem[]>([]);
  const [rightItems, setRightItems] = useState<GameItem[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  
  const [errorPair, setErrorPair] = useState<{ left: string; right: string } | null>(null);
  const [successPair, setSuccessPair] = useState<{ left: string; right: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  
  const [gameMode, setGameMode] = useState<"words" | "phrases" | "sentences" | "dictation" | "writing">("words");
  const [isHome, setIsHome] = useState(true);
  const [allPairs, setAllPairs] = useState<PairData[]>([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [wordPool, setWordPool] = useState<PairData[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  
  const WORDS_PER_STAGE = 10;
  const TOTAL_STAGES = Math.ceil(allPairs.length / WORDS_PER_STAGE) || 1;

  const loadStage = (stage: number, pairs: PairData[]) => {
    setCurrentStage(stage);
    const stagePairs = pairs.slice((stage - 1) * WORDS_PER_STAGE, stage * WORDS_PER_STAGE);
    setWordPool(stagePairs);
    
    const initialPairs = stagePairs.slice(0, 6);

    const leftInitialItems: GameItem[] = initialPairs.map((p) => ({
      id: `left-${p.id}`,
      text: p.left,
      type: "left",
      pairId: p.id,
    }));
    
    const rightInitialItems: GameItem[] = initialPairs.map((p) => ({
      id: `right-${p.id}`,
      text: p.right,
      type: "right",
      pairId: p.id,
    }));

    setLeftItems(shuffle(leftInitialItems));
    setRightItems(shuffle(rightInitialItems));
    setMatchedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setErrorPair(null);
    setSuccessPair(null);
    setIsProcessing(false);
  };

  const startFullGame = (mode: "words" | "phrases" | "sentences" | "dictation" | "writing", forceFresh = false) => {
    if (mode === "sentences" || mode === "dictation" || mode === "writing") return;

    if (!forceFresh) {
      const saved = localStorage.getItem(`ielts_game_progress_${mode}`);
      if (saved) {
        try {
          const progress: GameProgress = JSON.parse(saved);
          setAllPairs(progress.allPairs);
          setCurrentStage(progress.currentStage);
          setMatchedPairs(new Set(progress.matchedPairs));
          setLeftItems(progress.leftItems);
          setRightItems(progress.rightItems);
          setWordPool(progress.wordPool);
          
          setSelectedLeft(null);
          setSelectedRight(null);
          setErrorPair(null);
          setSuccessPair(null);
          setIsProcessing(false);
          return;
        } catch (e) {
          console.error("Failed to parse saved progress", e);
        }
      }
    }

    let sourceData: PairData[];
    if (mode === "words") {
      sourceData = IELTS_WORDS.map(w => ({ id: w.id, left: w.english, right: w.chinese }));
    } else {
      sourceData = IELTS_PHRASES.map(p => ({ id: p.id, left: p.phrase1, right: p.phrase2 }));
    }
    
    const shuffledAll = shuffle(sourceData);
    setAllPairs(shuffledAll);
    loadStage(1, shuffledAll);
  };

  // Initialize game (matching modes only — avoids empty state when switching tabs)
  useEffect(() => {
    setIsMounted(true);
    if (gameMode === "words" || gameMode === "phrases") {
      startFullGame(gameMode);
    }
  }, [gameMode]);

  // Save progress (words / phrases only)
  useEffect(() => {
    if (!isMounted || gameMode === "sentences" || gameMode === "dictation" || gameMode === "writing" || allPairs.length === 0) return;
    
    const progress: GameProgress = {
      allPairs,
      currentStage,
      matchedPairs: Array.from(matchedPairs),
      leftItems,
      rightItems,
      wordPool,
    };
    
    localStorage.setItem(`ielts_game_progress_${gameMode}`, JSON.stringify(progress));
  }, [gameMode, allPairs, currentStage, matchedPairs, leftItems, rightItems, wordPool, isMounted]);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  const handleNextStage = () => {
    loadStage(currentStage + 1, allPairs);
  };

  const handleItemClick = (item: GameItem) => {
    if (isProcessing) return;

    // Play audio pronunciation
    // For "words" mode, only left side (English) is spoken.
    // For "phrases" mode, both sides (English) are spoken.
    if (gameMode === "phrases" || item.type === "left") {
      speakText(item.text);
    }

    if (item.type === "left") {
      if (selectedLeft === item.id) {
        setSelectedLeft(null); // Deselect
      } else {
        setSelectedLeft(item.id);
        if (selectedRight) {
          checkMatch(item.id, selectedRight, item.pairId);
        }
      }
    } else {
      if (selectedRight === item.id) {
        setSelectedRight(null); // Deselect
      } else {
        setSelectedRight(item.id);
        if (selectedLeft) {
          checkMatch(selectedLeft, item.id, item.pairId);
        }
      }
    }
  };

  const checkMatch = (leftId: string, rightId: string, currentPairId: string) => {
    setIsProcessing(true);
    
    const leftItem = leftItems.find((i) => i.id === leftId);
    const rightItem = rightItems.find((i) => i.id === rightId);

    if (leftItem?.pairId === rightItem?.pairId) {
      // Match successful
      playSuccessSound();
      setSuccessPair({ left: leftId, right: rightId });
      setTimeout(() => {
        if (gameMode === "phrases") {
          setModalData({ isMatch: true, leftId, rightId, pairId: leftItem!.pairId });
          setShowModal(true);
        } else {
          handleMatchSuccess(leftId, rightId, leftItem!.pairId);
        }
      }, 500);
    } else {
      // Match failed
      playErrorSound();
      setErrorPair({ left: leftId, right: rightId });
      setTimeout(() => {
        if (gameMode === "phrases") {
          setModalData({ isMatch: false, leftId, rightId, leftPairId: leftItem!.pairId, rightPairId: rightItem!.pairId });
          setShowModal(true);
        } else {
          handleMatchFail();
        }
      }, 800);
    }
  };

  const handleMatchSuccess = (leftId: string, rightId: string, pairId: string) => {
    const nextWordIndex = matchedPairs.size + 6;
    let nextEn: GameItem | null = null;
    let nextZh: GameItem | null = null;

    if (nextWordIndex < wordPool.length) {
      const nextPair = wordPool[nextWordIndex];
      nextEn = { id: `left-${nextPair.id}`, text: nextPair.left, type: "left", pairId: nextPair.id };
      nextZh = { id: `right-${nextPair.id}`, text: nextPair.right, type: "right", pairId: nextPair.id };
    }

    setLeftItems((prev) => {
      const arr = prev.filter((i) => i.id !== leftId);
      if (nextEn) {
        const insertPos = Math.floor(Math.random() * (arr.length + 1));
        arr.splice(insertPos, 0, nextEn);
      }
      return arr;
    });

    setRightItems((prev) => {
      const arr = prev.filter((i) => i.id !== rightId);
      if (nextZh) {
        const insertPos = Math.floor(Math.random() * (arr.length + 1));
        arr.splice(insertPos, 0, nextZh);
      }
      return arr;
    });

    setMatchedPairs((prev) => new Set(prev).add(pairId));
    setSelectedLeft(null);
    setSelectedRight(null);
    setSuccessPair(null);
    setIsProcessing(false);
  };

  const handleMatchFail = () => {
    setErrorPair(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsProcessing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalData.isMatch) {
      handleMatchSuccess(modalData.leftId, modalData.rightId, modalData.pairId);
    } else {
      handleMatchFail();
    }
  };

  const isStageComplete = matchedPairs.size === wordPool.length && wordPool.length > 0;
  const isGameComplete = isStageComplete && currentStage === TOTAL_STAGES;

  const appCards = [
    { mode: "words" as const, title: "雅思词汇", desc: "点击左侧英文和右侧中文进行配对", icon: BookOpen, color: "from-blue-400 to-blue-600", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { mode: "phrases" as const, title: "同义替换", desc: "点击左侧和右侧的同义短语进行配对", icon: MessageCircle, color: "from-purple-400 to-purple-600", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { mode: "sentences" as const, title: "长难句锻造", desc: "点击下方的词块，按顺序拼出完整的句子", icon: Sparkles, color: "from-amber-400 to-amber-600", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    { mode: "dictation" as const, title: "听写作文", desc: "听 AI 朗读范文，盲打全文后提交对比与评星", icon: Headphones, color: "from-teal-400 to-teal-600", bgColor: "bg-teal-50", iconColor: "text-teal-600" },
    { mode: "writing" as const, title: "写作训练", desc: "激活思维节点，实时评分反馈，快速提升写作能力", icon: PenLine, color: "from-violet-400 to-violet-600", bgColor: "bg-violet-50", iconColor: "text-violet-600" },
  ];

  const handleCardClick = (mode: "words" | "phrases" | "sentences" | "dictation" | "writing") => {
    setGameMode(mode);
    setIsHome(false);
    onInsideChange?.(true);
    if (mode === "words" || mode === "phrases") {
      startFullGame(mode);
    }
  };

  const handleBackHome = () => {
    setIsHome(true);
    onInsideChange?.(false);
  };

  if (isHome) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <img src="/logo.svg" alt="Logo" className="h-20 w-20 mx-auto mb-5" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            雅思写作修罗场
          </h1>
          <p className="text-gray-500 text-lg">选择一个模块开始训练</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {appCards.map((card) => (
            <motion.button
              key={card.mode}
              onClick={() => handleCardClick(card.mode)}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-shadow text-left group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-7 h-7 ${card.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-400">{card.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto p-6 ${gameMode === "writing" ? "max-w-6xl" : "max-w-3xl"}`}>
      {/* Back Button */}
      <button
        onClick={handleBackHome}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">返回主页</span>
      </button>

      <div className={`text-center ${gameMode === "sentences" || gameMode === "dictation" || gameMode === "writing" ? "" : "mb-10"}`}>
        {(() => {
          const active = appCards.find(c => c.mode === gameMode);
          if (!active) return null;
          return (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{active.title}</h1>
              <p className="text-gray-500">{active.desc}</p>
            </>
          );
        })()}
        {gameMode !== "sentences" && gameMode !== "dictation" && gameMode !== "writing" && wordPool.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold shadow-sm">
              阶段 {currentStage} / {TOTAL_STAGES}
            </span>
            <span className="text-sm text-blue-600 font-bold bg-blue-50 px-4 py-1.5 rounded-full shadow-sm">
              本组进度: {matchedPairs.size} / {wordPool.length}
            </span>
          </div>
        )}
      </div>

      {gameMode === "sentences" ? (
        <SentenceForge />
      ) : gameMode === "dictation" ? (
        <DictationGame />
      ) : gameMode === "writing" ? (
        <WritingForge />
      ) : isGameComplete ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-green-50 rounded-3xl border-2 border-green-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-6">太棒了！你完成了所有 {allPairs.length} 个{gameMode === "words" ? "单词" : "短语"}！</h2>
          <button 
            onClick={() => startFullGame(gameMode, true)}
            className="px-8 py-3 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            重新开始
          </button>
        </motion.div>
      ) : isStageComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mx-auto ${gameMode === "words" ? "max-w-3xl" : ""}`}
        >
          {gameMode === "words" ? (
            <div className="rounded-3xl border-2 border-blue-200 bg-white shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">阶段 {currentStage} 完成！</h2>
                <p className="text-blue-100 text-sm mt-1">
                  以下是你本阶段掌握的 {WORDS_PER_STAGE} 个单词及其例句
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {wordPool.map((pair, idx) => {
                  const examples = WORD_EXAMPLES[pair.id];
                  return (
                    <div key={pair.id} className="px-5 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-lg font-bold text-gray-900">{pair.left}</span>
                        <span className="text-base text-gray-500">{pair.right}</span>
                      </div>
                      {examples && (
                        <div className="ml-10 space-y-1.5">
                          {examples.map((ex, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                              <span className="text-blue-300 mt-0.5 shrink-0">•</span>
                              <span className="flex-1">{highlightWordInText(ex, pair.left)}</span>
                              <button
                                type="button"
                                onClick={() => speakText(ex)}
                                className="shrink-0 text-gray-300 hover:text-blue-500 transition-colors p-1"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
                >
                  进入阶段 {currentStage + 1}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-blue-50 rounded-3xl border-2 border-blue-200 shadow-sm">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">阶段 {currentStage} 完成！</h2>
              <p className="text-blue-600 mb-8 font-medium">你已经掌握了这 {WORDS_PER_STAGE} 个短语，继续挑战下一组吧！</p>
              <button
                onClick={handleNextStage}
                className="px-8 py-3 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
              >
                进入阶段 {currentStage + 1}
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:gap-12">
          {/* Left Column - English */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {leftItems.map((item) => {
                const isSelected = selectedLeft === item.id;
                const isError = errorPair?.left === item.id;
                const isSuccess = successPair?.left === item.id;

                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={isSuccess
                      ? { opacity: 0, scale: 0.2, x: 0 }
                      : { 
                          opacity: 1, 
                          x: isError ? [-5, 5, -5, 5, 0] : 0,
                        }
                    }
                    transition={isSuccess
                      ? { duration: 1.1, ease: "easeOut" }
                      : { x: { duration: 0.4 } }
                    }
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    whileHover={isSuccess ? undefined : { scale: 1.02 }}
                    whileTap={isSuccess ? undefined : { scale: 0.98 }}
                    onClick={() => handleItemClick(item)}
                    className={`
                      p-4 rounded-2xl text-lg font-bold border-b-4 transition-colors duration-200 text-center relative
                      ${isSuccess
                        ? 'bg-transparent border-transparent'
                        : isError 
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : isSelected 
                            ? 'bg-blue-100 border-blue-400 text-blue-600' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {isSuccess && <ParticleBurst />}
                    <span className={isSuccess ? "invisible" : ""}>{item.text}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Column - Chinese */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {rightItems.map((item) => {
                const isSelected = selectedRight === item.id;
                const isError = errorPair?.right === item.id;
                const isSuccess = successPair?.right === item.id;

                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={isSuccess
                      ? { opacity: 0, scale: 0.2, x: 0 }
                      : { 
                          opacity: 1, 
                          x: isError ? [-5, 5, -5, 5, 0] : 0,
                        }
                    }
                    transition={isSuccess
                      ? { duration: 1.1, ease: "easeOut" }
                      : { x: { duration: 0.4 } }
                    }
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    whileHover={isSuccess ? undefined : { scale: 1.02 }}
                    whileTap={isSuccess ? undefined : { scale: 0.98 }}
                    onClick={() => handleItemClick(item)}
                    className={`
                      p-4 rounded-2xl text-lg font-bold border-b-4 transition-colors duration-200 text-center relative
                      ${isSuccess
                        ? 'bg-transparent border-transparent'
                        : isError 
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : isSelected 
                            ? 'bg-blue-100 border-blue-400 text-blue-600' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {isSuccess && <ParticleBurst />}
                    <span className={isSuccess ? "invisible" : ""}>{item.text}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && modalData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {modalData.isMatch ? (
                (() => {
                  const phraseData = IELTS_PHRASES.find(p => p.id === modalData.pairId);
                  if (!phraseData) return null;
                  return (
                    <div className="space-y-6 mt-2">
                      <div className="flex items-center justify-center gap-3 text-green-600 mb-6">
                        <CheckCircle2 className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">配对成功！</h2>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                        <div className="flex items-center justify-center gap-4 text-xl font-bold text-gray-800">
                          <span className="text-indigo-700 bg-indigo-100 px-3 py-1 rounded-lg">{phraseData.phrase1}</span>
                          <span className="text-green-500">=</span>
                          <span className="text-indigo-700 bg-indigo-100 px-3 py-1 rounded-lg">{phraseData.phrase2}</span>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Meaning (English)</h3>
                          <p className="text-black font-bold text-lg">{phraseData.meaningEn}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">翻译 (Chinese)</h3>
                          <p className="text-black font-bold text-lg">{phraseData.meaningZh}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">IELTS Examples</h3>
                          <ul className="space-y-3">
                            {phraseData.examples.map((ex, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed">
                                <span className="font-bold text-blue-500 shrink-0 mt-0.5">{idx + 1}.</span>
                                <span className="font-medium flex-1">{highlightPhrase(ex, phraseData.phrase1, phraseData.phrase2)}</span>
                                <button 
                                  onClick={() => speakText(ex)}
                                  className="shrink-0 text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-100 active:scale-95"
                                  title="播放例句"
                                >
                                  <Volume2 className="w-5 h-5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button 
                        onClick={handleCloseModal}
                        className="w-full py-4 mt-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-md active:scale-[0.98]"
                      >
                        继续游戏
                      </button>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const leftPhrase = IELTS_PHRASES.find(p => p.id === modalData.leftPairId);
                  const rightPhrase = IELTS_PHRASES.find(p => p.id === modalData.rightPairId);
                  if (!leftPhrase || !rightPhrase) return null;
                  
                  return (
                    <div className="space-y-6 mt-2">
                      <div className="flex items-center justify-center gap-3 text-red-600 mb-6">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-bold text-xl">!</div>
                        <h2 className="text-2xl font-bold">配对失败</h2>
                      </div>
                      
                      <p className="text-gray-600 text-center">你选择的两个短语并不是同义词。请查看它们的正确含义：</p>

                      <div className="space-y-6">
                        {/* Left Phrase Info */}
                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                          <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                            <motion.span 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.4, delay: 0.5 }}
                              className="text-red-700 bg-red-100 px-2 py-1 rounded-lg inline-block"
                            >
                              {leftPhrase.phrase1}
                            </motion.span>
                            <span className="text-gray-500 text-sm font-normal">同义词应为:</span>
                            <motion.span 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.4, delay: 0.5 }}
                              className="text-green-700 bg-green-100 px-2 py-1 rounded-lg inline-block"
                            >
                              {leftPhrase.phrase2}
                            </motion.span>
                          </div>
                          <div className="space-y-2 mb-4">
                            <p className="text-black font-bold"><span className="font-semibold text-gray-500">Meaning:</span> {leftPhrase.meaningEn}</p>
                            <p className="text-black font-bold"><span className="font-semibold text-gray-500">翻译:</span> {leftPhrase.meaningZh}</p>
                          </div>
                          <div className="text-sm text-gray-600 bg-white/60 p-3 rounded-xl leading-relaxed font-medium flex items-start gap-2">
                            <span className="font-semibold text-blue-500 shrink-0 mt-0.5">Example: </span>
                            <span className="flex-1">{highlightPhrase(leftPhrase.examples[0], leftPhrase.phrase1, leftPhrase.phrase2)}</span>
                            <button 
                              onClick={() => speakText(leftPhrase.examples[0])}
                              className="shrink-0 text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50 active:scale-95"
                              title="播放例句"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Right Phrase Info */}
                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                          <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                            <motion.span 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.4, delay: 1.0 }}
                              className="text-red-700 bg-red-100 px-2 py-1 rounded-lg inline-block"
                            >
                              {rightPhrase.phrase2}
                            </motion.span>
                            <span className="text-gray-500 text-sm font-normal">同义词应为:</span>
                            <motion.span 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.4, delay: 1.0 }}
                              className="text-green-700 bg-green-100 px-2 py-1 rounded-lg inline-block"
                            >
                              {rightPhrase.phrase1}
                            </motion.span>
                          </div>
                          <div className="space-y-2 mb-4">
                            <p className="text-black font-bold"><span className="font-semibold text-gray-500">Meaning:</span> {rightPhrase.meaningEn}</p>
                            <p className="text-black font-bold"><span className="font-semibold text-gray-500">翻译:</span> {rightPhrase.meaningZh}</p>
                          </div>
                          <div className="text-sm text-gray-600 bg-white/60 p-3 rounded-xl leading-relaxed font-medium flex items-start gap-2">
                            <span className="font-semibold text-blue-500 shrink-0 mt-0.5">Example: </span>
                            <span className="flex-1">{highlightPhrase(rightPhrase.examples[0], rightPhrase.phrase1, rightPhrase.phrase2)}</span>
                            <button 
                              onClick={() => speakText(rightPhrase.examples[0])}
                              className="shrink-0 text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50 active:scale-95"
                              title="播放例句"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleCloseModal}
                        className="w-full py-4 mt-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors shadow-md active:scale-[0.98]"
                      >
                        我知道了
                      </button>
                    </div>
                  );
                })()
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
