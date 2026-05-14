"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Play,
  ListFilter,
  Sparkles,
  Trophy,
  BookMarked,
  Check,
  X,
  SkipForward,
  ChevronRight,
} from "lucide-react";
import {
  DICTATION_LEVELS,
  DictationLevel,
  DictationTask,
  DictationTopic,
  loadWeaknessWords,
  saveWeaknessWords,
  loadStreak95,
  saveStreak95,
  loadGoldUnlocked,
  saveGoldUnlocked,
  sortLevelsByWeakness,
} from "@/data/ieltsDictation";
import { speakText, stopSpeech, splitTextIntoCombatChunks, getTTSVoice, setTTSVoice, TTS_VOICES } from "@/lib/speech";

function accuracyToStars(accuracy: number): number {
  if (accuracy >= 98) return 5;
  if (accuracy >= 95) return 4;
  if (accuracy >= 90) return 3;
  if (accuracy >= 80) return 2;
  if (accuracy >= 65) return 1;
  return 0;
}

type ChunkResult = {
  expected: string;
  user: string;
  correct: boolean;
};

type DictationProgress = {
  levelId: string;
  currentChunkIndex: number;
  chunkResults: ChunkResult[];
};

const DICTATION_PROGRESS_KEY = "ielts_dictation_progress";

const translationCache = new Map<string, string>();

async function translateToChinese(text: string): Promise<string> {
  const cached = translationCache.get(text);
  if (cached) return cached;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return "";
    const data = await res.json();
    const translation = (data[0] as [string][])
      .map((s) => s[0])
      .join("");
    translationCache.set(text, translation);
    return translation;
  } catch {
    return "";
  }
}

export default function DictationGame() {
  const [phase, setPhase] = useState<"pick" | "play" | "result">("pick");
  const [taskFilter, setTaskFilter] = useState<DictationTask | "all">("all");
  const [topicFilter, setTopicFilter] = useState<DictationTopic | "all">("all");
  const [levelId, setLevelId] = useState<string | null>(null);
  const [goldMode, setGoldMode] = useState(false);
  const [weaknessList, setWeaknessList] = useState<string[]>([]);
  const [goldUnlocked, setGoldUnlocked] = useState(false);
  const [streak95, setStreak95] = useState(0);
  const [showGoldToast, setShowGoldToast] = useState(false);
  const [ttsVoice, setTTSVoiceState] = useState("en-US");

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [input, setInput] = useState("");
  const [chunkResults, setChunkResults] = useState<ChunkResult[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showChunkHint, setShowChunkHint] = useState(false);
  const [showChinese, setShowChinese] = useState(false);
  const [chunkTranslations, setChunkTranslations] = useState<Record<number, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const level = useMemo(
    () => DICTATION_LEVELS.find((l) => l.id === levelId) ?? null,
    [levelId]
  );

  const chunks = useMemo(
    () => (level ? splitTextIntoCombatChunks(level.text) : []),
    [level]
  );

  const currentChunk = chunks[currentChunkIndex] ?? "";

  const prediction = useMemo(() => {
    if (!currentChunk || !input) return "";
    const typedWords = input.trimEnd().split(/\s+/);
    const expectedWords = currentChunk.trim().split(/\s+/);
    const lastFragment = typedWords[typedWords.length - 1] ?? "";
    if (!lastFragment) return "";
    const completedCount = typedWords.length - 1;
    const targetWord = expectedWords[completedCount];
    if (!targetWord) return "";
    if (!targetWord.toLowerCase().startsWith(lastFragment.toLowerCase())) return "";
    return targetWord.slice(lastFragment.length);
  }, [input, currentChunk]);

  useEffect(() => {
    setWeaknessList(loadWeaknessWords());
    setGoldUnlocked(loadGoldUnlocked());
    setStreak95(loadStreak95());
  }, [phase]);

  useEffect(() => {
    setTTSVoiceState(getTTSVoice());
  }, []);

  useEffect(() => {
    if (!showChinese || chunkResults.length === 0) return;
    let cancelled = false;
    const translateMissing = async () => {
      const newTranslations: Record<number, string> = { ...chunkTranslations };
      for (let i = 0; i < chunkResults.length; i++) {
        if (newTranslations[i]) continue;
        const trans = await translateToChinese(chunkResults[i].expected);
        if (!cancelled) {
          newTranslations[i] = trans;
          setChunkTranslations({ ...newTranslations });
        }
      }
    };
    translateMissing();
    return () => { cancelled = true; };
  }, [showChinese, chunkResults]);

  useEffect(() => {
    if (phase === "play" && levelId && currentChunkIndex > 0) {
      localStorage.setItem(
        DICTATION_PROGRESS_KEY,
        JSON.stringify({ levelId, currentChunkIndex, chunkResults })
      );
    }
  }, [phase, levelId, currentChunkIndex, chunkResults]);

  const savedProgress = useMemo((): DictationProgress | null => {
    try {
      const raw = localStorage.getItem(DICTATION_PROGRESS_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as DictationProgress;
    } catch {
      return null;
    }
  }, [phase]);

  const resumeGame = () => {
    if (!savedProgress) return;
    setLevelId(savedProgress.levelId);
    setCurrentChunkIndex(savedProgress.currentChunkIndex);
    setChunkResults(savedProgress.chunkResults);
    setInput("");
    setFeedback(null);
    setShowChunkHint(false);
    loopRef.current = false;
    stopSpeech();
    setIsPlaying(false);
    setPhase("play");
  };

  const handleTTSVoiceChange = (voice: string) => {
    setTTSVoiceState(voice);
    setTTSVoice(voice);
  };

  const filteredLevels = useMemo(() => {
    return DICTATION_LEVELS.filter((l) => {
      if (taskFilter !== "all" && l.task !== taskFilter) return false;
      if (topicFilter !== "all" && l.topic !== topicFilter) return false;
      return true;
    });
  }, [taskFilter, topicFilter]);

  const sortedLevels = useMemo(() => {
    const w = new Set(weaknessList.map((x) => x.toLowerCase()));
    return sortLevelsByWeakness(filteredLevels, w);
  }, [filteredLevels, weaknessList]);

  const startLevel = (l: DictationLevel) => {
    localStorage.removeItem(DICTATION_PROGRESS_KEY);
    setLevelId(l.id);
    setCurrentChunkIndex(0);
    setInput("");
    setChunkResults([]);
    setFeedback(null);
    setShowChunkHint(false);
    loopRef.current = false;
    stopSpeech();
    setIsPlaying(false);
    setPhase("play");
  };

  const loopRef = useRef(true);
  const [loopKey, setLoopKey] = useState(0);

  const playLoop = useCallback(async (chunk: string) => {
    loopRef.current = true;
    while (loopRef.current) {
      stopSpeech();
      setIsPlaying(true);
      try {
        await speakText(chunk);
      } catch {}
      setIsPlaying(false);
      if (!loopRef.current) break;
      await new Promise((r) => setTimeout(r, 600));
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (phase !== "play" || chunks.length === 0) return;
    const chunk = chunks[currentChunkIndex];
    if (!chunk) return;
    const timer = setTimeout(() => playLoop(chunk), 300);
    return () => {
      clearTimeout(timer);
      loopRef.current = false;
    };
  }, [phase, currentChunkIndex, chunks, loopKey]);

  const togglePlayback = () => {
    if (isPlaying) {
      loopRef.current = false;
      stopSpeech();
      setIsPlaying(false);
    } else {
      setLoopKey((k) => k + 1);
    }
  };

  const submitChunk = () => {
    if (!input.trim()) return;
    const trimmed = input.trim();
    const expected = currentChunk;
    const correct = trimmed.toLowerCase() === expected.toLowerCase();

    setFeedback(correct ? "correct" : "wrong");
    setChunkResults((prev) => [...prev, { expected, user: trimmed, correct }]);

    if (correct) {
      setTimeout(() => advanceToNext(true), 180);
    }
  };

  const advanceToNext = (wasCorrect: boolean) => {
    loopRef.current = false;
    stopSpeech();
    setIsPlaying(false);
    const nextIndex = currentChunkIndex + 1;
    if (nextIndex >= chunks.length) {
      finishGame(wasCorrect);
      return;
    }
    setCurrentChunkIndex(nextIndex);
    setInput("");
    setFeedback(null);
    setShowChunkHint(false);
    inputRef.current?.focus();
  };

  const skipChunk = () => {
    setChunkResults((prev) => [...prev, { expected: currentChunk, user: "(跳过)", correct: false }]);
    advanceToNext(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (feedback === "wrong") {
        advanceToNext(false);
        return;
      }
      submitChunk();
      return;
    }

    if (e.key === "ArrowRight" && prediction) {
      const inputEl = e.currentTarget;
      if (inputEl.selectionStart === inputEl.value.length) {
        e.preventDefault();
        setInput(inputEl.value.trimEnd() + prediction + " ");
      }
    }
  };

  const toggleHint = () => {
    setShowChunkHint((prev) => !prev);
  };

  const finishGame = (lastCorrect: boolean) => {
    loopRef.current = false;
    setIsPlaying(false);
    stopSpeech();
    if (lastCorrect) {
      setChunkResults((prev) => {
        const total = chunks.length;
        const correct = prev.filter((r) => r.correct).length;
        const acc = total > 0 ? Math.round((100 * correct) / total) : 0;
        processResult(acc);
        return prev;
      });
    } else {
      const correct = chunkResults.filter((r) => r.correct).length;
      const total = chunks.length;
      const acc = total > 0 ? Math.round((100 * correct) / total) : 0;
      processResult(acc);
    }
  };

  const processResult = (acc: number) => {
    localStorage.removeItem(DICTATION_PROGRESS_KEY);
    const weaknessWords = chunkResults
      .flatMap((r) => r.expected.split(/\s+/))
      .filter((w) => w.length > 2);
    saveWeaknessWords(weaknessWords);
    setWeaknessList(loadWeaknessWords());

    const prev = loadStreak95();
    let nextStreak = prev;
    if (acc >= 95) {
      nextStreak = prev + 1;
      if (nextStreak >= 3 && !loadGoldUnlocked()) {
        saveGoldUnlocked();
        setGoldUnlocked(true);
        setShowGoldToast(true);
        setTimeout(() => setShowGoldToast(false), 5000);
      }
    } else {
      nextStreak = 0;
    }
    saveStreak95(nextStreak);
    setStreak95(nextStreak);
    setPhase("result");
  };

  const backToPick = () => {
    localStorage.removeItem(DICTATION_PROGRESS_KEY);
    loopRef.current = false;
    stopSpeech();
    setIsPlaying(false);
    setPhase("pick");
    setLevelId(null);
    setCurrentChunkIndex(0);
    setInput("");
    setChunkResults([]);
    setFeedback(null);
  };

  const replaySame = () => {
    localStorage.removeItem(DICTATION_PROGRESS_KEY);
    loopRef.current = false;
    stopSpeech();
    setIsPlaying(false);
    setCurrentChunkIndex(0);
    setInput("");
    setChunkResults([]);
    setFeedback(null);
    setShowChunkHint(false);
    setPhase("play");
  };

  const totalChunks = chunks.length;
  const completedChunks = chunkResults.length;

  const resultAccuracy = useMemo(() => {
    if (chunkResults.length === 0) return 0;
    const correct = chunkResults.filter((r) => r.correct).length;
    return Math.round((100 * correct) / totalChunks);
  }, [chunkResults, totalChunks]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-6">
        <span className="px-4 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
          <Headphones className="w-4 h-4" />
          听写作文 · 语块战斗
        </span>
        {goldUnlocked && (
          <span className="px-4 py-1.5 bg-yellow-100 text-yellow-900 rounded-full text-sm font-bold shadow-sm flex items-center gap-1 border border-yellow-300">
            <Trophy className="w-4 h-4" />
            Gold · 段落结构徽章
          </span>
        )}
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          95%+ 连胜 {streak95}/3
        </span>
      </div>

      <AnimatePresence>
        {showGoldToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 text-center font-bold text-amber-900"
          >
            <Sparkles className="inline w-5 h-5 mr-1 align-text-bottom" />
            已解锁 Gold 难度与「段落结构」徽章！
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "pick" && (
        <div className="space-y-6">
          {savedProgress && savedProgress.currentChunkIndex > 0 && (() => {
              const savedLevel = DICTATION_LEVELS.find((l) => l.id === savedProgress.levelId);
              const savedChunks = savedLevel ? splitTextIntoCombatChunks(savedLevel.text) : [];
              return (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-bold text-amber-900 text-lg">有未完成的训练</p>
                  <p className="text-sm text-amber-700 mt-1">
                    {savedLevel ? savedLevel.title : ""} · 进度：{savedProgress.currentChunkIndex} / {savedChunks.length} 语块
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resumeGame}
                    className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all"
                  >
                    继续上次
                  </button>
                  <button
                    type="button"
                    onClick={() => localStorage.removeItem(DICTATION_PROGRESS_KEY)}
                    className="px-4 py-2.5 rounded-xl font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all text-sm"
                  >
                    放弃
                  </button>
                </div>
              </div>
            </div>
              );
            })()}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-3">
              <ListFilter className="w-5 h-5 text-teal-600" />
              选关卡
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="text-sm text-gray-500 w-full">题型</span>
              {(["all", "task1", "task2"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTaskFilter(t)}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    taskFilter === t ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t === "all" ? "全部" : t === "task1" ? "Task 1" : "Task 2"}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="text-sm text-gray-500 w-full">话题</span>
              {(["all", "technology", "environment", "education"] as const).map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setTopicFilter(tp)}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    topicFilter === tp ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tp === "all" ? "全部" : tp === "technology" ? "科技" : tp === "environment" ? "环境" : "教育"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
              <BookMarked className="w-5 h-5" />
              弱点本（优先复现）
            </div>
            <p className="text-sm text-indigo-800 mb-2">
              拼写错误、漏词与多余词会自动加入；下方列表已按与你弱点词的匹配度排序推荐关卡。
            </p>
            {weaknessList.length === 0 ? (
              <p className="text-sm text-gray-500">暂无记录，完成一局后会生成。</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {weaknessList.slice(0, 24).map((w) => (
                  <span
                    key={w}
                    className="px-2 py-1 rounded-lg bg-white text-indigo-900 text-xs font-medium border border-indigo-100"
                  >
                    {w}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            {sortedLevels.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => startLevel(l)}
                className="text-left rounded-2xl border-2 border-gray-200 bg-white p-4 hover:border-teal-400 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-teal-600">{l.task}</span>
                  <span className="text-xs font-bold text-gray-500">
                    {l.topic === "technology" ? "科技" : l.topic === "environment" ? "环境" : "教育"}
                  </span>
                </div>
                <div className="font-bold text-gray-900">{l.title}</div>
                <div className="text-sm text-gray-500 mt-1">{l.titleZh}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "play" && level && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{level.title}</h2>
                <p className="text-sm text-gray-500">{level.titleZh}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-teal-600">
                  {completedChunks}
                  <span className="text-sm text-gray-400">/{totalChunks}</span>
                </div>
                <div className="text-xs text-gray-400">语块进度</div>
              </div>
            </div>
          </div>

          {chunkResults.length > 0 && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 shadow-sm relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                  范文拼图（{chunkResults.filter(r => r.correct).length}/{totalChunks} 正确）
                </p>
                <button
                  type="button"
                  onClick={() => setShowChinese((v) => !v)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                    showChinese
                      ? "bg-emerald-500 text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {showChinese ? "隐藏中文" : "显示中文"}
                </button>
              </div>
              <div className="text-sm leading-relaxed font-mono space-y-2">
                {chunks.map((chunk, i) => {
                  const result = chunkResults[i];
                  if (result) {
                    const translation = showChinese ? chunkTranslations[i] : "";
                    const correct = result.correct;
                    return (
                      <div key={i} className="border-b border-emerald-100 pb-2 last:border-0 last:pb-0">
                        <p className="text-black font-bold">{result.expected}</p>
                        {correct ? (
                          <p className="text-emerald-600">{result.user}</p>
                        ) : (
                          <p className="text-rose-500">{result.user}</p>
                        )}
                        {showChinese && (
                          <p className="text-gray-500 font-sans text-xs mt-0.5">
                            {translation || "翻译中…"}
                          </p>
                        )}
                      </div>
                    );
                  }
                  if (i === currentChunkIndex) {
                    return (
                      <div key={i} className="text-teal-300 animate-pulse">...</div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/30 p-6 min-h-[140px] flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-xs text-teal-600 font-bold uppercase tracking-wider mb-2">
                第 {currentChunkIndex + 1} 个语块（共 {totalChunks} 个）
              </p>
              <p className="text-sm text-gray-500">
                自动循环播放 → 快速记忆 → 输入 → Enter 提交
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayback}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all active:scale-95 ${
                  isPlaying ? "bg-teal-600" : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {isPlaying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    暂停循环
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    播放语块
                  </>
                )}
              </button>

              {showChunkHint && (
                <span className="text-sm font-mono text-teal-800 bg-teal-100 px-3 py-1.5 rounded-lg animate-in fade-in">
                  {currentChunk}
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (feedback) setFeedback(null);
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={`输入你听到的语块，按 Enter 提交…`}
              className={`w-full rounded-xl border-2 bg-white px-5 py-4 text-lg font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                feedback === "correct"
                  ? "border-emerald-400 focus:ring-emerald-300 bg-emerald-50/50"
                  : feedback === "wrong"
                    ? "border-rose-400 focus:ring-rose-300 bg-rose-50/50"
                    : "border-gray-200 focus:ring-teal-400"
              }`}
              autoFocus
            />

            {prediction && !feedback && (
              <span className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-lg font-mono text-gray-300">
                <span className="opacity-0">{input}</span>
                {prediction}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">→</kbd>
            接受预测
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd>
            提交
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submitChunk}
              disabled={!input.trim() || feedback !== null}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Check className="w-5 h-5" />
              提交
            </button>

            {feedback === "wrong" && (
              <button
                type="button"
                onClick={() => advanceToNext(false)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 animate-in fade-in"
              >
                <ChevronRight className="w-5 h-5" />
                看下一块
              </button>
            )}

            <button
              type="button"
              onClick={toggleHint}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                showChunkHint
                  ? "bg-teal-100 text-teal-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              提示
            </button>

            <button
              type="button"
              onClick={skipChunk}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <SkipForward className="w-4 h-4" />
              跳过
            </button>

            <button
              type="button"
              onClick={backToPick}
              className="px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
            >
              返回选题
            </button>
          </div>

          <details className="rounded-2xl border border-gray-200 bg-white p-4">
            <summary className="font-bold cursor-pointer text-gray-700 flex items-center gap-2 text-sm">
              更多设置
            </summary>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">口音</span>
                <select
                  value={ttsVoice}
                  onChange={(e) => handleTTSVoiceChange(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {TTS_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              {goldUnlocked && (
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-yellow-900 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 w-fit">
                  <input type="checkbox" checked={goldMode} onChange={(e) => setGoldMode(e.target.checked)} />
                  Gold 模式（更快语速）
                </label>
              )}
            </div>
          </details>

        </div>
      )}

      {phase === "result" && level && (
        <div className="space-y-6">
          <div className="text-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">准确率</p>
            <p className="text-4xl font-black text-teal-600">{resultAccuracy}%</p>
            <div className="mt-3 text-2xl tracking-widest text-amber-400">
              {"★".repeat(accuracyToStars(resultAccuracy))}
              {"☆".repeat(5 - accuracyToStars(resultAccuracy))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {totalChunks} 个语块 · {chunkResults.filter((r) => r.correct).length} 正确
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">语块对照</h3>
            <div className="space-y-2">
              {chunkResults.map((r, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-xl font-mono text-sm flex items-center gap-3 ${
                    r.correct ? "bg-emerald-50" : "bg-rose-50"
                  }`}
                >
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    {r.correct ? (
                      <span className="text-emerald-800">{r.expected}</span>
                    ) : (
                      <div>
                        <div className="text-rose-600 line-through">{r.user}</div>
                        <div className="text-emerald-700 font-bold">{r.expected}</div>
                      </div>
                    )}
                  </div>
                  {r.correct ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <X className="w-5 h-5 text-rose-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <details className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <summary className="font-bold cursor-pointer text-gray-800">参考范文</summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{level.text}</p>
            <p className="mt-2 text-xs text-gray-500">结构提示：{level.structureHint}</p>
          </details>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={replaySame}
              className="px-5 py-3 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600"
            >
              再练本篇
            </button>
            <button
              type="button"
              onClick={backToPick}
              className="px-5 py-3 rounded-xl font-bold bg-gray-200 text-gray-800"
            >
              下一关 / 选题
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
