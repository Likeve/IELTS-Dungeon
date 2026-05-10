"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { IELTS_SENTENCES, Chunk } from "@/data/ieltsSentences";

type ChunkWithId = Chunk & { id: string };

type ForgeProgress = {
  currentStage: number;
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

// Helper: Play success sound
const playSuccessSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
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
    playOscillator(523.25, 0, 0.3); // C5
    playOscillator(783.99, 0.1, 0.5); // G5
  } catch (e) {}
};

const playErrorSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
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
    playOscillator(150, 'square', 0, 0.15);
    playOscillator(100, 'square', 0.15, 0.2);
  } catch (e) {}
};

export default function SentenceForge() {
  const [currentStage, setCurrentStage] = useState(1);
  const [availableChunks, setAvailableChunks] = useState<ChunkWithId[]>([]);
  const [placedChunks, setPlacedChunks] = useState<ChunkWithId[]>([]);
  const [errorChunkId, setErrorChunkId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const TOTAL_STAGES = IELTS_SENTENCES.length;
  const currentSentence = IELTS_SENTENCES[currentStage - 1];

  const loadStage = (stage: number) => {
    const sentence = IELTS_SENTENCES[stage - 1];
    const chunksWithIds = sentence.chunks.map((chunk, index) => ({
      ...chunk,
      id: `chunk-${stage}-${index}-${Date.now()}`
    }));
    
    setAvailableChunks(shuffle(chunksWithIds));
    setPlacedChunks([]);
    setErrorChunkId(null);
  };

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('ielts_forge_progress');
    if (saved) {
      try {
        const progress: ForgeProgress = JSON.parse(saved);
        if (progress.currentStage >= 1 && progress.currentStage <= TOTAL_STAGES) {
          setCurrentStage(progress.currentStage);
          loadStage(progress.currentStage);
          return;
        }
      } catch (e) {}
    }
    loadStage(1);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('ielts_forge_progress', JSON.stringify({ currentStage }));
  }, [currentStage, isMounted]);

  const handleChunkClick = (clickedChunk: ChunkWithId) => {
    const expectedChunkText = currentSentence.chunks[placedChunks.length].text;
    
    if (clickedChunk.text === expectedChunkText) {
      playSuccessSound();
      setPlacedChunks(prev => [...prev, clickedChunk]);
      setAvailableChunks(prev => prev.filter(c => c.id !== clickedChunk.id));
    } else {
      playErrorSound();
      setErrorChunkId(clickedChunk.id);
      setTimeout(() => setErrorChunkId(null), 500);
    }
  };

  if (!isMounted) return null;

  const isStageComplete = placedChunks.length === currentSentence.chunks.length;
  const isGameComplete = isStageComplete && currentStage === TOTAL_STAGES;

  const handleNextStage = () => {
    setCurrentStage(prev => prev + 1);
    loadStage(currentStage + 1);
  };

  const restartGame = () => {
    setCurrentStage(1);
    loadStage(1);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-4 mt-4 mb-10">
        <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          关卡 {currentStage} / {TOTAL_STAGES}
        </span>
      </div>

      {isGameComplete ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-amber-50 rounded-3xl border-2 border-amber-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-amber-700 mb-6">太棒了！你通关了所有长难句锻造场！</h2>
          <button 
            onClick={restartGame}
            className="px-8 py-3 bg-amber-500 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            重新开始
          </button>
        </motion.div>
      ) : isStageComplete ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-green-50 rounded-3xl border-2 border-green-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">句子锻造成功！</h2>
          <div className="mb-8 px-6">
            <p className="text-xl font-bold text-gray-800 mb-2">{currentSentence.english}</p>
            <p className="text-lg text-gray-600 font-medium">{currentSentence.chinese}</p>
          </div>
          <button 
            onClick={handleNextStage}
            className="px-8 py-3 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            进入下一关
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Top Area: Constructed Sentence */}
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl p-6 min-h-[200px] border-2 border-dashed border-blue-200 shadow-inner flex flex-wrap content-start gap-3">
            <AnimatePresence>
              {placedChunks.map((chunk) => (
                <motion.div
                  key={chunk.id}
                  layoutId={chunk.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)"
                  }}
                  className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl text-lg font-bold bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-300 text-amber-900"
                >
                  <span>{chunk.text}</span>
                  <motion.span 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm font-medium text-amber-700 mt-1"
                  >
                    {chunk.meaning}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
            {placedChunks.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium py-10">
                点击下方的词块，按顺序拼出完整的句子
              </div>
            )}
          </div>

          {/* Bottom Area: Available Chunks */}
          <div className="bg-gray-50/80 rounded-3xl p-8 border-2 border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <AnimatePresence>
                {availableChunks.map((chunk) => (
                  <motion.button
                    key={chunk.id}
                    layoutId={chunk.id}
                    onClick={() => handleChunkClick(chunk)}
                    animate={
                      errorChunkId === chunk.id 
                        ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } } 
                        : {}
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      px-5 py-3 rounded-2xl text-lg font-bold border-2 transition-colors
                      ${errorChunkId === chunk.id 
                        ? 'bg-red-50 border-red-400 text-red-600' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md'}
                    `}
                  >
                    {chunk.text}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
