// Paragraph-specific IELTS Writing Task 1 word priorities.
const BASE_WORDS = [
  // Trend verbs
  "increased", "decreased", "rose", "fell", "dropped", "grew", "declined", "fluctuated",
  "peaked", "plateaued", "stabilized", "surged", "plummeted", "soared", "dipped",
  "recovered", "leveled", "remained", "outpaced", "experienced", "witnessed",

  // Trend nouns
  "increase", "decrease", "rise", "fall", "drop", "growth", "decline", "fluctuation",
  "peak", "plateau", "stabilization", "surge", "recovery", "trend", "upward", "downward",

  // Comparison
  "compared", "comparison", "contrast", "whereas", "while", "unlike", "similarly",
  "likewise", "correspondingly", "differently", "higher", "lower", "greater", "smaller",
  "largest", "smallest", "lowest", "highest", "more", "less", "exceeded", "surpassed",
  "outnumbered", "accounted", "constituted", "represented",

  // Proportion
  "percentage", "proportion", "ratio", "share", "segment", "fraction", "majority",
  "minority", "quarter", "half", "third",

  // Numbers / amounts
  "approximately", "around", "roughly", "nearly", "about", "almost", "exactly",
  "precisely", "respectively", "total", "overall", "amounted", "reached", "stood",
  "measured", "recorded", "registered", "figure", "number", "value",

  // Time
  "between", "during", "over", "period", "throughout", "initially", "subsequently",
  "eventually", "finally", "afterward", "meanwhile", "thereafter", "prior", "following",

  // Chart types
  "chart", "graph", "table", "diagram", "figure", "illustrates", "depicts", "shows",
  "presents", "displays", "demonstrates", "indicates", "reveals", "provides", "compares",
  "summarizes", "outlines",

  // Description
  "significant", "considerable", "substantial", "noticeable", "marked", "slight",
  "gradual", "steady", "sharp", "dramatic", "rapid", "slow", "constant", "stable",
  "volatile", "consistent", "moderate", "modest", "marginal", "negligible",

  // Connectors
  "however", "furthermore", "moreover", "additionally", "consequently", "therefore",
  "thus", "hence", "nevertheless", "nonetheless", "although", "despite", "regarding",
  "concerning", "notably", "specifically", "particularly", "namely", "overall",
  "generally", "broadly", "relatively",
];

const PARAGRAPH_BOOSTS: Record<number, string[]> = {
  1: [
    "illustrates", "depicts", "shows", "presents", "provides", "information",
    "regarding", "concerning", "between", "during", "period", "measured", "units",
  ],
  2: [
    "overall", "generally", "dominant", "significant", "dramatic", "substantial",
    "while", "whereas", "increase", "decrease", "rose", "fell", "trend", "pattern",
  ],
  3: [
    "increased", "decreased", "rose", "fell", "dropped", "grew", "peaked", "reached",
    "starting", "ending", "value", "approximately", "million", "percentage",
  ],
  4: [
    "whereas", "while", "by contrast", "meanwhile", "similarly", "however",
    "compared", "greater", "smaller", "higher", "lower", "remained", "stable",
  ],
};

export type AutocompleteContext = {
  chartTitle?: string;
  chartQuestion?: string;
  chartType?: string;
  keywords?: string[];
  clues?: string[];
  paragraphNumber?: number;
  textBeforeCursor?: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Common bigrams/trigrams in IELTS Task 1 introductions
const COLLOCATIONS: Record<string, string[]> = {
  "the": ["line", "bar", "pie", "chart", "graph", "table", "diagram", "figure"],
  "line": ["chart", "graph"],
  "bar": ["chart"],
  "pie": ["chart"],
  "the chart": ["illustrates", "shows", "depicts", "presents", "displays"],
  "the graph": ["illustrates", "shows", "depicts", "presents", "displays"],
  "the line": ["chart", "graph"],
  "the bar": ["chart"],
  "the pie": ["chart"],
  "the table": ["illustrates", "shows", "depicts", "presents", "provides"],
  "the diagram": ["illustrates", "shows", "depicts", "presents"],
  "the figure": ["illustrates", "shows", "depicts", "presents"],
  "illustrates": ["the", "how", "information", "data"],
  "shows": ["the", "how", "information", "data"],
  "depicts": ["the", "how", "information", "data"],
  "presents": ["information", "data"],
  "provides": ["information", "data"],
  "information": ["about", "regarding", "concerning", "on"],
  "data": ["about", "regarding", "concerning", "on"],
  "about": ["the", "how"],
  "regarding": ["the"],
  "concerning": ["the"],
  "overall": ["the", "it", "there"],
  "the overall": ["trend", "pattern"],
  "in": ["contrast", "comparison", "particular", "general"],
  "by": ["contrast"],
  "in contrast": ["to"],
  "the most": ["significant", "dramatic", "noticeable", "striking", "marked"],
  "most": ["significant", "dramatic", "noticeable", "striking", "marked"],
  "a": ["significant", "dramatic", "substantial", "slight", "gradual", "steady", "sharp"],
  "an": ["increase", "decrease", "overall"],
  "of": ["the", "approximately", "about"],
};

export function findAutocomplete(prefix: string, context?: AutocompleteContext): string | null {
  if (!prefix || prefix.length < 1) return null;
  const lower = prefix.toLowerCase();

  const chartTokens = new Set<string>();
  const clueTokens = new Set<string>();

  if (context?.chartTitle) tokenize(context.chartTitle).forEach((t) => chartTokens.add(t));
  if (context?.chartQuestion) tokenize(context.chartQuestion).forEach((t) => chartTokens.add(t));
  if (context?.keywords) context.keywords.forEach((k) => tokenize(k).forEach((t) => chartTokens.add(t)));
  if (context?.clues) context.clues.forEach((c) => tokenize(c).forEach((t) => clueTokens.add(t)));

  // Combine base words + context tokens into candidate set
  const candidates = new Set<string>(BASE_WORDS);
  chartTokens.forEach((t) => candidates.add(t));
  clueTokens.forEach((t) => candidates.add(t));

  // Remove the exact prefix itself from candidates
  const matches = Array.from(candidates).filter((w) => w.startsWith(lower) && w !== lower);

  if (matches.length === 0) return null;

  // Build context n-grams from text before cursor
  const prevText = (context?.textBeforeCursor || "").toLowerCase().trim();
  const prevWords = tokenize(prevText);
  const lastWord = prevWords[prevWords.length - 1] || "";
  const lastTwo = prevWords.slice(-2).join(" ");
  const lastThree = prevWords.slice(-3).join(" ");

  // Collocation triggers
  const collocatedWords = new Set<string>();
  [lastThree, lastTwo, lastWord].forEach((key) => {
    const arr = COLLOCATIONS[key];
    if (arr) arr.forEach((w) => collocatedWords.add(w));
  });

  const paragraphBoost = context?.paragraphNumber ? PARAGRAPH_BOOSTS[context.paragraphNumber] ?? [] : [];

  const scored = matches.map((w) => {
    let score = 0;
    // Strongly boost words appearing in clues
    if (clueTokens.has(w)) score += 100;
    // Boost words appearing in chart metadata/keywords
    if (chartTokens.has(w)) score += 50;
    // Boost words typical for the current paragraph
    if (paragraphBoost.includes(w)) score += 30;
    // Strongly boost collocated words based on preceding context
    if (collocatedWords.has(w)) score += 120;
    // Prefer shorter suggestions slightly
    score -= w.length * 0.1;
    return { word: w, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].word;
}
