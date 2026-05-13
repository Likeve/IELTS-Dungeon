/** Web Speech API TTS — shared by MatchingGame & SentenceForge (mobile-safe pattern). */
export function speakText(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => v.lang.includes("en-") || v.lang.includes("en_") || v.lang === "en"
    );
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, 50);
}
