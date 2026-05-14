const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function splitText(text: string, maxLen: number): string[] {
  const result: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length + 1 <= maxLen) {
      current = current ? current + " " + sentence : sentence;
    } else {
      if (current) result.push(current);
      current = sentence;
    }
  }
  if (current) result.push(current);
  if (result.length === 0) result.push(text);
  return result;
}

async function synthesizeChunk(
  text: string,
  lang: string
): Promise<ArrayBuffer> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Empty text chunk");

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${lang}&client=tw-ob`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`TTS fetch failed: ${res.status}`);

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("audio")) {
    throw new Error(`Unexpected content type: ${contentType}`);
  }

  return res.arrayBuffer();
}

async function synthesize(text: string, lang: string): Promise<Uint8Array> {
  const chunks = splitText(text, 200);
  const buffers = await Promise.all(chunks.map((c) => synthesizeChunk(c, lang)));
  const totalLen = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  if (totalLen === 0) throw new Error("Empty audio");
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const voice = searchParams.get("voice") || "en-US";

  if (!text || text.trim().length === 0) {
    return new Response("Missing text parameter", { status: 400 });
  }

  if (text.length > 2000) {
    return new Response("Text too long (max 2000 chars)", { status: 400 });
  }

  const supportedVoices = new Set(["en-US", "en-GB", "en-AU", "en"]);
  const lang = supportedVoices.has(voice) ? voice : "en";

  try {
    const audio = await synthesize(text, lang);
    return new Response(Buffer.from(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audio.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return new Response("TTS synthesis failed", { status: 500 });
  }
}
