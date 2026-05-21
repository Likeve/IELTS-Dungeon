const COMMON_WORDS_TOP_1000 = new Set(
  "the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us".split(" ")
);

const ACADEMIC_WORD_FAMILIES = new Set<string[]>([
  ["analyse", "analysed", "analyser", "analysers", "analyses", "analysing", "analysis", "analyst", "analysts", "analytic", "analytical", "analytically", "analyze", "analyzed", "analyzes", "analyzing"],
  ["approach", "approachable", "approached", "approaches", "approaching", "unapproachable"],
  ["assess", "assessable", "assessed", "assesses", "assessing", "assessment", "assessments", "reassess", "reassessed", "reassessing", "reassessment", "unassessed"],
  ["assume", "assumed", "assumes", "assuming", "assumption", "assumptions"],
  ["authority", "authoritative", "authorities"],
  ["available", "availability", "unavailable"],
  ["benefit", "beneficial", "beneficiary", "beneficiaries", "benefited", "benefiting", "benefits"],
  ["concept", "conception", "concepts", "conceptual", "conceptualisation", "conceptualise", "conceptualised", "conceptualises", "conceptualising", "conceptually"],
  ["consist", "consisted", "consistency", "consistent", "consistently", "consisting", "consists", "inconsistencies", "inconsistency", "inconsistent"],
  ["context", "contexts", "contextual", "contextualise", "contextualised", "contextualising", "contextualize", "contextualized", "contextualizing", "uncontextualised"],
  ["contract", "contracted", "contracting", "contractor", "contractors", "contracts"],
  ["create", "created", "creates", "creating", "creation", "creations", "creative", "creatively", "creativity", "creator", "creators", "recreate", "recreated", "recreates", "recreating"],
  ["derive", "derivation", "derivations", "derivative", "derivatives", "derived", "derives", "deriving"],
  ["distribute", "distributed", "distributing", "distribution", "distributional", "distributions", "distributive", "distributor", "distributors", "redistribute", "redistributed", "redistributes", "redistributing", "redistribution"],
  ["economy", "economic", "economical", "economically", "economics", "economies", "economist", "economists", "uneconomical"],
  ["environment", "environmental", "environmentalist", "environmentalists", "environmentally", "environments"],
  ["establish", "disestablish", "disestablished", "disestablishes", "disestablishing", "disestablishment", "established", "establishes", "establishing", "establishment", "establishments"],
  ["estimate", "estimated", "estimates", "estimating", "estimation", "estimations", "overestimate", "overestimated", "overestimates", "overestimating", "underestimate", "underestimated", "underestimates", "underestimating"],
  ["evident", "evidenced", "evidence", "evidential", "evidently"],
  ["export", "exported", "exporter", "exporters", "exporting", "exports"],
  ["factor", "factored", "factoring", "factors"],
  ["finance", "financed", "finances", "financial", "financially", "financier", "financiers", "financing"],
  ["formula", "formulae", "formulas", "formulate", "formulated", "formulating", "formulation", "formulations", "reformulate", "reformulated", "reformulating", "reformulation", "reformulations"],
  ["function", "functional", "functionally", "functioned", "functioning", "functions"],
  ["identify", "identifiable", "identification", "identified", "identifies", "identifying", "identities", "identity", "unidentifiable"],
  ["indicate", "indicated", "indicates", "indicating", "indication", "indications", "indicative", "indicator", "indicators"],
  ["individual", "individualised", "individualism", "individualist", "individualistic", "individualists", "individuality", "individually", "individuals"],
  ["interpret", "interpretation", "interpretations", "interpretative", "interpreted", "interpreting", "interpretive", "interprets", "misinterpret", "misinterpretation", "misinterpretations", "misinterpreted", "misinterpreting", "misinterprets", "reinterpret", "reinterpretation", "reinterpretations", "reinterpreted", "reinterpreting", "reinterprets"],
  ["involve", "involved", "involvement", "involves", "involving", "uninvolved"],
  ["issue", "issued", "issues", "issuing"],
  ["labour", "laboured", "labouring", "labours"],
  ["legal", "illegal", "illegality", "illegally", "legality", "legally"],
  ["legislate", "legislated", "legislates", "legislating", "legislation", "legislative", "legislator", "legislators", "legislature"],
  ["major", "majorities", "majority"],
  ["method", "methodical", "methodological", "methodologies", "methodology", "methods"],
  ["occur", "occurred", "occurrence", "occurrences", "occurring", "occurs", "reoccur", "reoccurred", "reoccurring", "reoccurs"],
  ["percent", "percentage", "percentages"],
  ["period", "periodic", "periodical", "periodically", "periodicals", "periods"],
  ["policy", "policies"],
  ["principle", "principled", "principles", "unprincipled"],
  ["proceed", "procedural", "procedure", "procedures", "proceeded", "proceeding", "proceedings", "proceeds"],
  ["process", "processed", "processes", "processing"],
  ["require", "required", "requirement", "requirements", "requires", "requiring"],
  ["research", "researched", "researcher", "researchers", "researches", "researching"],
  ["respond", "responded", "respondent", "respondents", "responding", "responds", "response", "responses", "responsive", "responsiveness", "unresponsive"],
  ["role", "roles"],
  ["section", "sectioned", "sectioning", "sections"],
  ["sector", "sectors"],
  ["significant", "insignificant", "insignificantly", "significance", "significantly", "signified", "signifies", "signify"],
  ["similar", "dissimilar", "similarities", "similarity", "similarly"],
  ["source", "sourced", "sources", "sourcing"],
  ["specific", "specifically", "specification", "specifications", "specificity", "specifics"],
  ["structure", "restructure", "restructured", "restructures", "restructuring", "structural", "structurally", "structured", "structures", "structuring", "unstructured"],
  ["theory", "theoretical", "theoretically", "theories", "theorist", "theorists"],
  ["vary", "invariable", "invariably", "variability", "variable", "variables", "variably", "variance", "variant", "variants", "variation", "variations", "varied", "varies", "varying"],
]);

const ALL_ACADEMIC_LEMMAS = new Set<string>();
for (const family of ACADEMIC_WORD_FAMILIES) {
  for (const word of family) {
    ALL_ACADEMIC_LEMMAS.add(word);
  }
}

const SUBORDINATORS = /\b(although|though|even though|while|whereas|whereby|because|since|as|so that|in order that|if|unless|whether|when|whenever|after|before|until|till|once|as soon as|provided that|given that|now that|where|wherever)\b/gi;
const RELATIVES = /\b(who|whom|whose|which|that)\b/gi;
const PASSIVE_PATTERN = /\b(am|is|are|was|were|be|been|being)\s+(\w+ed|\w+en|\w+t)\b/gi;
const MODALS = /\b(can|could|may|might|must|shall|should|will|would|ought to|need to|have to|has to|had to)\b/gi;
const CONDITIONALS = /\b(if|unless|provided that|on condition that|supposing|in case|otherwise|or else)\b/gi;
const POSITION_MARKERS = /\b(in my opinion|i believe|i think|i agree|i disagree|i would argue|i contend|i am convinced|it seems to me|from my perspective|personally|i firmly believe|i strongly agree|i completely disagree|in my view)\b/gi;

const CONNECTOR_CATEGORIES: Record<string, RegExp> = {
  contrast: /\b(however|nevertheless|nonetheless|on the other hand|in contrast|conversely|on the contrary|whereas|while|although|though|even though|despite|in spite of|yet|still)\b/gi,
  addition: /\b(moreover|furthermore|in addition|additionally|also|besides|further|what is more|not only.*but also|as well as|similarly|likewise)\b/gi,
  cause_effect: /\b(therefore|thus|hence|consequently|accordingly|as a result|for this reason|owing to|due to|because of|this leads to|resulting in|thereby|so)\b/gi,
  exemplification: /\b(for example|for instance|such as|namely|specifically|to illustrate|as an illustration|in particular|a case in point|particularly)\b/gi,
  sequencing: /\b(firstly|secondly|finally|first of all|to begin with|next|then|subsequently|afterwards|meanwhile|lastly|primarily)\b/gi,
  conclusion: /\b(in conclusion|to conclude|to sum up|in summary|overall|on the whole|in brief|to summarise|to summarize|all in all)\b/gi,
};

const REFERENCE_WORDS = /\b(this|that|these|those|such|the former|the latter|the above|the following|it|they|them)\b/gi;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text: string): number {
  return text.split(/[.!?]\s+/).filter(Boolean).length;
}

function paragraphCount(text: string): number {
  return text.split(/\n{1,}/).filter((p) => p.trim().length > 0).length;
}

function sentences(text: string): string[] {
  return text.split(/[.!?]\s+/).filter((s) => s.trim().length > 0);
}

function allWords(text: string): string[] {
  return text.toLowerCase().replace(/[.,!?;:'"()\[\]{}…—–\u2018\u2019\u201c\u201d]/g, " ").split(/\s+/).filter(Boolean);
}

function uniqueWordSet(words: string[]): Set<string> {
  return new Set(words);
}

function wordLengthScore(words: string[]): number {
  if (words.length === 0) return 0;
  const longWords = words.filter((w) => w.length >= 7).length;
  return longWords / words.length;
}

function academicWordRatio(words: string[]): number {
  if (words.length === 0) return 0;
  let hits = 0;
  for (const w of words) {
    if (ALL_ACADEMIC_LEMMAS.has(w)) hits++;
  }
  return hits / words.length;
}

function commonWordRatio(words: string[]): number {
  if (words.length === 0) return 0;
  let hits = 0;
  for (const w of words) {
    if (COMMON_WORDS_TOP_1000.has(w)) hits++;
  }
  return hits / words.length;
}

function sentenceLengthVariation(sentList: string[]): number {
  const lengths = sentList.map((s) => s.trim().split(/\s+/).filter(Boolean).length).filter((l) => l > 0);
  if (lengths.length < 2) return 0;
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, l) => sum + (l - mean) ** 2, 0) / lengths.length;
  return Math.sqrt(variance);
}

function complexSentenceRatio(sentList: string[]): number {
  if (sentList.length === 0) return 0;
  let complex = 0;
  for (const s of sentList) {
    const subCount = (s.match(SUBORDINATORS) || []).length;
    const relCount = (s.match(RELATIVES) || []).length;
    if (subCount + relCount > 0) complex++;
  }
  return complex / sentList.length;
}

function passiveRatio(sentList: string[]): number {
  if (sentList.length === 0) return 0;
  let passives = 0;
  for (const s of sentList) {
    const matches = s.match(PASSIVE_PATTERN) || [];
    if (matches.length > 0) passives++;
  }
  return passives / sentList.length;
}

function connectorDiversity(text: string): number {
  let total = 0;
  let categoriesHit = 0;
  for (const regex of Object.values(CONNECTOR_CATEGORIES)) {
    const matches = text.match(regex) || [];
    if (matches.length > 0) categoriesHit++;
    total += matches.length;
  }
  if (total === 0) return 0;
  return (categoriesHit / Object.keys(CONNECTOR_CATEGORIES).length) * 0.4 + Math.min(total / 8, 1) * 0.6;
}

function referenceWordDensity(text: string): number {
  const refs = text.match(REFERENCE_WORDS) || [];
  const wc = wordCount(text);
  return wc > 0 ? (refs.length / wc) * 10 : 0;
}

function topicKeywordOverlap(text: string, prompt: string): number {
  const promptWords = new Set(prompt.toLowerCase().replace(/[?,.]/g, "").split(/\s+/).filter((w) => w.length > 3 && !COMMON_WORDS_TOP_1000.has(w)));
  const textWords = new Set(allWords(text));
  let overlap = 0;
  for (const pw of promptWords) {
    if (textWords.has(pw)) overlap++;
  }
  return promptWords.size > 0 ? overlap / promptWords.size : 0;
}

function thesisPresence(text: string): number {
  const paragraphs = text.split(/\n{1,}/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) return 0;
  const intro = paragraphs[0];
  const markers = intro.match(POSITION_MARKERS) || [];
  const hasMarker = markers.length > 0;
  const introSentences = intro.split(/[.!?]\s+/).filter(Boolean);
  const hasThesisLength = introSentences.length >= 2;
  const firstPersonCount = (intro.match(/\b(I|we)\b/gi) || []).length;

  let score = 0;
  if (hasMarker) score += 0.5;
  if (hasThesisLength) score += 0.3;
  if (firstPersonCount > 0) score += 0.2;
  return Math.min(1, score);
}

function balancedArgument(text: string): number {
  const forMarkers = /\b(on the one hand|advantages?|benefits?|positive|support|proponents?|argue in favou?r|merits?)\b/gi;
  const againstMarkers = /\b(on the other hand|disadvantages?|drawbacks?|negative|opponents?|critics?|against|however|nevertheless|conversely|limitations?)\b/gi;
  const forCount = (text.match(forMarkers) || []).length;
  const againstCount = (text.match(againstMarkers) || []).length;
  if (forCount === 0 && againstCount === 0) return 0.3;
  const total = forCount + againstCount;
  const balance = 1 - Math.abs(forCount - againstCount) / (total || 1);
  return Math.max(0, Math.min(1, balance * 0.7 + Math.min(total / 4, 1) * 0.3));
}

function paragraphCoherence(paragraphs: string[]): number {
  if (paragraphs.length < 2) return 0.2;
  let transitive = 0;
  for (let i = 1; i < paragraphs.length; i++) {
    const start = paragraphs[i].trim().slice(0, 60).toLowerCase();
    if (/^(however|moreover|furthermore|in addition|on the|first|second|finally|in conclusion|to conclude|nevertheless|conversely|meanwhile)/.test(start)) {
      transitive++;
    }
  }
  return Math.min(1, transitive / paragraphs.length);
}

function bandScoreFromRaw(raw: number): number {
  const r = Math.max(0, Math.min(100, raw));
  if (r >= 95) return 9;
  if (r >= 88) return 8.5;
  if (r >= 80) return 8;
  if (r >= 72) return 7.5;
  if (r >= 64) return 7;
  if (r >= 56) return 6.5;
  if (r >= 48) return 6;
  if (r >= 40) return 5.5;
  if (r >= 32) return 5;
  if (r >= 24) return 4.5;
  if (r >= 16) return 4;
  if (r >= 10) return 3.5;
  if (r >= 6) return 3;
  if (r >= 3) return 2.5;
  if (r >= 1) return 2;
  return 1.5;
}

export type BandResult = {
  band: number;
  subScores: {
    taskResponse: { score: number; band: number };
    coherenceCohesion: { score: number; band: number };
    lexicalResource: { score: number; band: number };
    grammaticalRange: { score: number; band: number };
  };
  diagnostics: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgSentenceLength: number;
    sentenceLengthSD: number;
    typeTokenRatio: number;
    academicWordPct: number;
    commonWordPct: number;
    complexSentencePct: number;
    passiveSentencePct: number;
    connectorCategories: number;
    connectorTotal: number;
    topicOverlap: number;
    hasThesis: number;
    balance: number;
  };
  tips: string[];
};

export function evaluateEssay(text: string, promptTitle: string = ""): BandResult {
  const stripped = text.trim();
  const wc = wordCount(stripped);
  const sc = sentenceCount(stripped);
  const pc = paragraphCount(stripped);
  const sentList = sentences(stripped);
  const words = allWords(stripped);
  const uniqueWords = uniqueWordSet(words);
  const pars = stripped.split(/\n{1,}/).filter((p) => p.trim().length > 0);

  const avgSentLen = sc > 0 ? wc / sc : 0;
  const sentLenSD = sentenceLengthVariation(sentList);
  const ttr = wc > 0 ? uniqueWords.size / wc : 0;
  const acPct = academicWordRatio(words);
  const commonPct = commonWordRatio(words);
  const wlScore = wordLengthScore(words);
  const complexPct = complexSentenceRatio(sentList);
  const passivePct = passiveRatio(sentList);
  const connDiv = connectorDiversity(stripped);
  const refDensity = referenceWordDensity(stripped);
  const topicOverlap = promptTitle ? topicKeywordOverlap(stripped, promptTitle) : 0.7;
  const thesis = thesisPresence(stripped);
  const balance = balancedArgument(stripped);
  const paraCoherence = paragraphCoherence(pars);
  const modalDensity = (stripped.match(MODALS) || []).length / Math.max(wc, 1) * 100;

  // ===== Task Response (0-100) =====
  let tr = 0;
  if (wc >= 250) {
    tr += 35;
  } else if (wc >= 200) {
    tr += 25;
  } else if (wc >= 150) {
    tr += 15;
  } else if (wc >= 100) {
    tr += 8;
  } else {
    tr += Math.max(0, (wc / 100) * 5);
  }
  tr += thesis * 20;
  tr += topicOverlap * 20;
  tr += balance * 15;
  if (pc >= 4) tr += 10; else if (pc >= 3) tr += 7; else if (pc >= 2) tr += 4;

  // ===== Coherence & Cohesion (0-100) =====
  let cc = 0;
  cc += connDiv * 50;
  cc += paraCoherence * 25;
  cc += Math.min(1, refDensity / 3) * 15;
  if (pc >= 4) cc += 10; else if (pc >= 3) cc += 7; else if (pc >= 2) cc += 3;

  // ===== Lexical Resource (0-100) =====
  let lr = 0;
  const ttrScore = Math.min(1, ttr * 2.2);
  lr += ttrScore * 35;
  lr += Math.min(1, acPct / 0.06) * 30;
  lr += Math.min(1, (1 - commonPct) / 0.55) * 20;
  lr += Math.min(1, wlScore / 0.3) * 15;

  // ===== Grammatical Range & Accuracy (0-100) =====
  let gra = 0;
  gra += Math.min(1, complexPct / 0.5) * 30;
  gra += Math.min(1, sentLenSD / 8) * 20;
  gra += Math.min(1, passivePct / 0.3) * 15;
  gra += Math.min(1, modalDensity / 2) * 10;
  gra += Math.min(1, avgSentLen / 20) * 10;
  gra += Math.min(1, ttr * 2) * 15;

  // === Severity penalties for extremely short / incomplete essays ===
  if (wc < 10) {
    tr = Math.min(tr, 3);
    cc = Math.min(cc, 3);
    lr = Math.min(lr, 15);
    gra = Math.min(gra, 3);
  }
  if (wc < 50) {
    tr = Math.min(tr, 15);
    cc = Math.min(cc, 12);
    gra = Math.min(gra, 10);
  }
  if (sc === 0) {
    tr = Math.min(tr, 10);
    cc = Math.min(cc, 5);
    gra = Math.min(gra, 3);
  }
  if (pc < 2) {
    cc = Math.min(cc, 10);
    tr = Math.min(tr, 20);
  }

  const trBand = bandScoreFromRaw(tr);
  const ccBand = bandScoreFromRaw(cc);
  const lrBand = bandScoreFromRaw(lr);
  const graBand = bandScoreFromRaw(gra);
  const overall = Math.round(((trBand + ccBand + lrBand + graBand) / 4) * 2) / 2;

  const tips: string[] = [];
  if (wc < 10) {
    tips.push("文章过短：几乎未作答，请先写够 250 词完成基本论证框架");
  } else if (wc < 50) {
    tips.push(`词数仅 ${wc}：低于 50 词将被判定为未完成作答（Band 2-3），Task 2 要求至少 250 词`);
  } else if (wc < 150) {
    tips.push(`词数仅 ${wc}：严重不足，Task 2 要求至少 250 词才能达 Band 6+，目前判为 Band 4 左右`);
  } else if (wc < 250) {
    tips.push(`词数 ${wc} / 250：缺 ${250 - wc} 词，Task 2 最低词数不足将直接限制 Band 上限`);
  }
  if (sc === 0 && wc >= 5) {
    tips.push("未检测到完整句子：请使用句号/问号/感叹号分隔句子以构建段落结构");
  }
  if (pc < 2 && wc >= 20) {
    tips.push(`仅 ${pc} 段：Task 2 建议 4 段结构（引言→主体段1→主体段2→结论），至少需要 2 段`);
  }
  if (tr < 55 && wc >= 50) tips.push("Task Response：请明确阐述立场（I believe / In my opinion）并回应题目关键词");
  if (cc < 55 && wc >= 50) tips.push("Coherence：多用连接词（however/therefore/moreover/for example）并确保段间逻辑衔接");
  if (lr < 55 && wc >= 50) tips.push("Lexical Resource：尝试使用同义替换和学术词汇，减少基础词汇重复");
  if (gra < 55 && wc >= 50) tips.push("Grammar：增加从句（which/who/although/because）和被动语态变化句式");
  if (complexPct < 0.3 && wc >= 50) tips.push(`复杂句占比仅 ${Math.round(complexPct * 100)}%，尝试用更多定语从句和状语从句`);
  if (ttr < 0.5 && wc >= 50 && uniqueWords.size > 10) tips.push("词汇重复度高，尝试用同义词替换（如 important → crucial / significant / vital）");
  if (tips.length === 0) tips.push("写作质量很高！继续磨练论证深度即可冲击 Band 8+");

  return {
    band: overall,
    subScores: {
      taskResponse: { score: tr, band: trBand },
      coherenceCohesion: { score: cc, band: ccBand },
      lexicalResource: { score: lr, band: lrBand },
      grammaticalRange: { score: gra, band: graBand },
    },
    diagnostics: {
      wordCount: wc,
      sentenceCount: sc,
      paragraphCount: pc,
      avgSentenceLength: Math.round(avgSentLen * 10) / 10,
      sentenceLengthSD: Math.round(sentLenSD * 10) / 10,
      typeTokenRatio: Math.round(ttr * 100),
      academicWordPct: Math.round(acPct * 100),
      commonWordPct: Math.round(commonPct * 100),
      complexSentencePct: Math.round(complexPct * 100),
      passiveSentencePct: Math.round(passivePct * 100),
      connectorCategories: connDiv > 0 ? Math.round(connDiv * Object.keys(CONNECTOR_CATEGORIES).length) : 0,
      connectorTotal: (stripped.match(/however|therefore|moreover|furthermore|nevertheless|consequently|on the one hand|in contrast|as a result|for instance|for example|in addition|on the other hand|in conclusion|to sum up|firstly|secondly|finally|specifically|similarly|likewise/gi) || []).length,
      topicOverlap: Math.round(topicOverlap * 100),
      hasThesis: Math.round(thesis * 100),
      balance: Math.round(balance * 100),
    },
    tips,
  };
}
