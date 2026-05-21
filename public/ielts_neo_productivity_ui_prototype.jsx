import { useMemo, useState } from "react"

export default function IELTSNeoWorkspace() {
  const [text, setText] = useState(
    "Artificial intelligence is reshaping modern education systems by introducing adaptive learning environments and automated evaluation systems."
  )

  // lightweight heuristic scoring (UI prototype level)
  const score = useMemo(() => {
    const words = text.trim().split(/\s+/)
    const sentences = text.split(/[.!?]/).filter(Boolean)

    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const vocab = Math.min(100, (uniqueWords.size / (words.length || 1)) * 120)

    const grammar = Math.min(100, 70 + sentences.length * 3 - (text.includes(",,") ? 5 : 0))

    const connectors = (text.match(/however|therefore|moreover|on the one hand|in contrast/gi) || []).length
    const cohesion = Math.min(100, 60 + connectors * 10 + sentences.length * 2)

    const argumentDepth = Math.min(100, sentences.length * 12 + uniqueWords.size * 0.3)

    const band = (grammar + vocab + cohesion + argumentDepth) / 4 / 10

    return {
      Grammar: Math.round(grammar),
      Vocabulary: Math.round(vocab),
      Cohesion: Math.round(cohesion),
      ArgumentDepth: Math.round(argumentDepth),
      Band: Math.max(4.5, Math.min(9, band)).toFixed(1),
    }
  }, [text])

  const thoughtNodes = [
    {
      id: "education",
      name: "Education",
      weight: 0.82,
      active: true,
      ideas: ["equal opportunity", "critical thinking", "online learning", "teacher role"],
      synergy: ["technology", "society"],
    },
    {
      id: "technology",
      name: "Technology",
      weight: 0.91,
      active: true,
      ideas: ["AI automation", "privacy concern", "job displacement", "efficiency"],
      synergy: ["economy", "education"],
    },
    {
      id: "economy",
      name: "Economy",
      weight: 0.63,
      active: false,
      ideas: ["economic burden", "productivity growth", "labor market", "inequality"],
      synergy: ["technology", "government"],
    },
    {
      id: "environment",
      name: "Environment",
      weight: 0.58,
      active: false,
      ideas: ["sustainability", "climate change", "pollution control", "green policy"],
      synergy: ["government", "economy"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B1020] text-white overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.15),transparent_30%)]" />

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-[300px] border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-lg" />
              <div>
                <h1 className="text-lg font-semibold tracking-tight">IELTS Nexus</h1>
                <p className="text-xs text-white/40">Thought Network 2.0</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
                Cognitive Field
              </p>

              {thoughtNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/85">{node.name}</span>
                    <span className="text-xs text-white/40">{Math.round(node.weight * 100)}%</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {node.ideas.slice(0, 2).map((idea) => (
                      <span key={idea} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                        {idea}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3">
              Active Build
            </p>
            <div className="text-sm text-cyan-200 font-medium">
              Futurist Argument System
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <div className="h-[76px] border-b border-white/10 bg-white/[0.03] px-8 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white/90">
              Should AI replace teachers in modern education?
            </h2>
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-medium">
              Generate Insight
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto">

                {/* BAND DISPLAY */}
                <div className="mb-6 flex gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                    <div className="text-xs text-white/40">Estimated Band</div>
                    <div className="text-2xl font-semibold text-cyan-300">
                      {score.Band}
                    </div>
                  </div>

                  {Object.entries(score).filter(([k]) => k !== "Band").map(([k, v]) => (
                    <div key={k} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="text-xs text-white/40">{k}</div>
                      <div className="text-lg text-white/80">{v}</div>
                    </div>
                  ))}
                </div>

                {/* TEXT AREA */}
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full min-h-[500px] rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-white/80 leading-9 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
