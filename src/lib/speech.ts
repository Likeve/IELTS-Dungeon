const TTS_VOICE_KEY = "ielts-tts-voice";

export type TTSVoice = {
  id: string;
  label: string;
};

export const TTS_VOICES: TTSVoice[] = [
  { id: "en-US", label: "美式英语 (US)" },
  { id: "en-GB", label: "英式英语 (UK)" },
  { id: "en-AU", label: "澳式英语 (AU)" },
];

export function getTTSVoice(): string {
  if (typeof window === "undefined") return "en-US";
  return localStorage.getItem(TTS_VOICE_KEY) || "en-US";
}

export function setTTSVoice(voice: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TTS_VOICE_KEY, voice);
}

let activeAudio: HTMLAudioElement | null = null;

export function stopSpeech() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio = null;
  }
}

async function fetchCloudAudio(text: string, voice: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({ text, voice });
    const res = await fetch(`/api/tts?${params.toString()}`);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("audio")) return null;

    const blob = await res.blob();
    if (blob.size === 0) return null;

    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

function playAudio(url: string, rate = 1.0): Promise<void> {
  return new Promise((resolve) => {
    stopSpeech();
    const audio = new Audio(url);
    audio.playbackRate = rate;
    activeAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (activeAudio === audio) activeAudio = null;
      resolve();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      if (activeAudio === audio) activeAudio = null;
      resolve();
    };

    audio.play().catch(() => {
      URL.revokeObjectURL(url);
      if (activeAudio === audio) activeAudio = null;
      resolve();
    });
  });
}

export async function speakText(text: string, rate = 1.0): Promise<void> {
  const voice = getTTSVoice();
  const url = await fetchCloudAudio(text, voice);
  if (url) {
    await playAudio(url, rate);
  }
}

const COMBAT_CHUNK_BREAK = /\b(which|who|that|where|when|while|because|although|though|unless|whereas|whereby|thereby|thus|hence|therefore|however|moreover|furthermore|nevertheless|meanwhile|consequently|additionally|in order to|so that|such that|as well as|along with|together with|rather than|instead of)\b/gi;

/** Split essay into combat chunks (3-7 words each, for Chunk Combat mode). */
export function splitTextIntoCombatChunks(text: string): string[] {
  const sentences = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const result: string[] = [];

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    if (words.length <= 7) {
      result.push(sentence);
      continue;
    }

    let i = 0;
    while (i < words.length) {
      let end = Math.min(i + 7, words.length);
      const remaining = words.length - end;

      if (remaining === 1) {
        end = words.length;
      } else if (remaining === 2 && end + 1 <= words.length) {
        const chunk5 = end - i;
        if (chunk5 <= 5) {
          end = Math.min(end + 1, words.length);
        }
      }

      if (end - i < 3 && i + 3 <= words.length) {
        end = i + 3;
      }

      const slice = words.slice(i, end);
      const chunkText = slice.join(" ");

      if (result.length > 0) {
        const prev = result[result.length - 1];
        const prevWords = prev.split(/\s+/);
        if (prevWords.length < 3 && prevWords.length + slice.length <= 7) {
          result[result.length - 1] = prev + " " + chunkText;
          i = end;
          continue;
        }
      }

      result.push(chunkText);
      i = end;
    }
  }

  return result;
}

/** Split essay into speakable chunks (roughly sentences). */
export function splitEssayIntoChunks(text: string): string[] {
  const parts = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return [text.trim()];
  return parts;
}

export type EssaySpeakController = {
  cancel: () => void;
  getCurrentChunkIndex: () => number;
};

export function speakEssayChunks(
  chunks: string[],
  startChunkIndex: number,
  onChunkBoundary?: (finishedIndex: number) => void,
  onAllComplete?: () => void
): EssaySpeakController {
  stopSpeech();

  let currentIndex = Math.max(0, Math.min(startChunkIndex, chunks.length));
  let cancelled = false;
  const voice = getTTSVoice();

  const advanceAndNext = () => {
    if (cancelled) return;
    onChunkBoundary?.(currentIndex);
    currentIndex += 1;
    speakNext();
  };

  const speakNext = () => {
    if (cancelled) return;
    if (currentIndex >= chunks.length) {
      onAllComplete?.();
      return;
    }

    const piece = chunks[currentIndex];
    fetchCloudAudio(piece, voice)
      .then((url) => {
        if (cancelled || !url) {
          if (url) URL.revokeObjectURL(url);
          advanceAndNext();
          return;
        }

        const audio = new Audio(url);
        activeAudio = audio;

        let ended = false;
        const cleanup = () => {
          if (ended) return;
          ended = true;
          URL.revokeObjectURL(url);
          if (activeAudio === audio) activeAudio = null;
          audio.onended = null;
          audio.onerror = null;
        };

        audio.onended = () => {
          cleanup();
          advanceAndNext();
        };

        audio.onerror = () => {
          cleanup();
          advanceAndNext();
        };

        audio.play().catch(() => {
          cleanup();
          advanceAndNext();
        });
      });
  };

  speakNext();

  return {
    cancel: () => {
      cancelled = true;
      stopSpeech();
    },
    getCurrentChunkIndex: () => currentIndex,
  };
}
