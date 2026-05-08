"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, BookOpen, MessageCircle } from "lucide-react";
import { IELTS_WORDS } from "@/data/ieltsWords";
import { IELTS_PHRASES } from "@/data/ieltsPhrases";

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

// Helper: Shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper: Play text-to-speech audio
const speakText = (text: string, lang: string) => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    // Cancel any ongoing speech to avoid queuing up too many sounds
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    // Adjust rate slightly for better clarity if needed
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export default function MatchingGame() {
  const [leftItems, setLeftItems] = useState<GameItem[]>([]);
  const [rightItems, setRightItems] = useState<GameItem[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  
  const [errorPair, setErrorPair] = useState<{ left: string; right: string } | null>(null);
  const [successPair, setSuccessPair] = useState<{ left: string; right: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [gameMode, setGameMode] = useState<"words" | "phrases">("words");
  const [allPairs, setAllPairs] = useState<PairData[]>([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [wordPool, setWordPool] = useState<PairData[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  
  const WORDS_PER_STAGE = 50;
  const TOTAL_STAGES = 6;

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

  const startFullGame = (mode: "words" | "phrases") => {
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

  // Initialize game
  useEffect(() => {
    setIsMounted(true);
    startFullGame(gameMode);
  }, [gameMode]);

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
      speakText(item.text, "en-US");
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
      setSuccessPair({ left: leftId, right: rightId });
      setTimeout(() => {
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

        setMatchedPairs((prev) => new Set(prev).add(leftItem!.pairId));
        setSelectedLeft(null);
        setSelectedRight(null);
        setSuccessPair(null);
        setIsProcessing(false);
      }, 500);
    } else {
      // Match failed
      setErrorPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
        setIsProcessing(false);
      }, 800);
    }
  };

  const isStageComplete = matchedPairs.size === wordPool.length && wordPool.length > 0;
  const isGameComplete = isStageComplete && currentStage === TOTAL_STAGES;

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">雅思词汇消消乐</h1>
        
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setGameMode("words")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${
              gameMode === "words" 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            雅思词汇
          </button>
          <button
            onClick={() => setGameMode("phrases")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${
              gameMode === "phrases" 
                ? "bg-purple-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            雅思短语同义替换
          </button>
        </div>

        <p className="text-gray-500">
          {gameMode === "words" ? "点击左侧英文和右侧中文进行配对" : "点击左侧和右侧的同义短语进行配对"}
        </p>
        {wordPool.length > 0 && (
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

      {isGameComplete ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-green-50 rounded-3xl border-2 border-green-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-6">太棒了！你完成了所有 300 个单词！</h2>
          <button 
            onClick={() => startFullGame(gameMode)}
            className="px-8 py-3 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            重新开始
          </button>
        </motion.div>
      ) : isStageComplete ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-blue-50 rounded-3xl border-2 border-blue-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">阶段 {currentStage} 完成！</h2>
          <p className="text-blue-600 mb-8 font-medium">你已经掌握了这 50 个单词，继续挑战下一组吧！</p>
          <button 
            onClick={handleNextStage}
            className="px-8 py-3 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            进入阶段 {currentStage + 1}
          </button>
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
                    animate={{ 
                      opacity: 1, 
                      x: isError ? [-5, 5, -5, 5, 0] : 0,
                      transition: { x: { duration: 0.4 } }
                    }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleItemClick(item)}
                    className={`
                      p-4 rounded-2xl text-lg font-bold border-b-4 transition-colors duration-200 text-center
                      ${isSuccess
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : isError 
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : isSelected 
                            ? 'bg-blue-100 border-blue-400 text-blue-600' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {item.text}
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
                    animate={{ 
                      opacity: 1, 
                      x: isError ? [-5, 5, -5, 5, 0] : 0,
                      transition: { x: { duration: 0.4 } }
                    }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleItemClick(item)}
                    className={`
                      p-4 rounded-2xl text-lg font-bold border-b-4 transition-colors duration-200 text-center
                      ${isSuccess
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : isError 
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : isSelected 
                            ? 'bg-blue-100 border-blue-400 text-blue-600' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {item.text}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
