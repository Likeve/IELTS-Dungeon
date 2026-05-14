export type DictationTopic = "technology" | "environment" | "education";
export type DictationTask = "task1" | "task2";

export type DictationLevel = {
  id: string;
  task: DictationTask;
  topic: DictationTopic;
  title: string;
  /** Brief Chinese hint for topic */
  titleZh: string;
  /** Full text the player must reproduce */
  text: string;
  /** Optional outline for Gold badge flavour text */
  structureHint: string;
};

export const DICTATION_LEVELS: DictationLevel[] = [
  {
    id: "t2-tech-1",
    task: "task2",
    topic: "technology",
    title: "Technology and social relationships",
    titleZh: "科技与人际关系",
    structureHint: "Introduction → body (effects + examples) → conclusion with balanced view.",
    text: `It is often argued that modern technology has fundamentally changed the way people build and maintain social relationships. While some believe that digital communication weakens genuine human contact, others insist that it creates new opportunities for connection across distances.

On the one hand, excessive reliance on smartphones and social media can reduce face-to-face interaction. Many young adults spend hours scrolling through feeds instead of meeting friends in person, which may lead to feelings of isolation even when they appear socially active online. Furthermore, shallow conversations in chat applications rarely develop the empathy that deeper, in-person dialogue can foster.

On the other hand, technology enables families and colleagues separated by geography to stay in touch affordably. Video calls, collaborative documents, and instant messaging have supported remote work and long-distance education during challenging periods. When used deliberately, these tools can strengthen bonds rather than replace them.

In conclusion, technology itself is neither purely harmful nor purely beneficial. The key lies in how individuals balance screen time with real-world engagement, ensuring that digital tools serve relationships instead of dominating them.`,
  },
  {
    id: "t2-env-1",
    task: "task2",
    topic: "environment",
    title: "Individual responsibility for the environment",
    titleZh: "个人环保责任",
    structureHint: "Problem → why individuals matter → government role → conclusion.",
    text: `Environmental degradation is frequently presented as a problem that only governments and large industries can solve. However, I believe that individual choices also play a vital role in protecting the planet, although they must be supported by wider policy.

Firstly, everyday habits such as reducing plastic use, conserving energy, and choosing public transport can lower collective emissions significantly when millions of people participate. Consumer demand also influences companies to adopt greener packaging and cleaner production methods.

Nevertheless, personal action alone cannot address structural issues like illegal logging or outdated coal power plants. National regulations, carbon pricing, and international agreements remain essential to create a level playing field for sustainable business.

In my view, the most effective approach combines civic responsibility with strong governance. Citizens should not feel powerless, but they should also vote and campaign for leaders who take science-based environmental policies seriously.`,
  },
  {
    id: "t2-edu-1",
    task: "task2",
    topic: "education",
    title: "University education versus vocational training",
    titleZh: "大学教育与职业培训",
    structureHint: "Two views → your opinion with reasons.",
    text: `Some people claim that university degrees are overrated in today's economy, while others maintain that higher education remains the best route to a stable career. This essay will examine both perspectives before presenting my own view.

Advocates of vocational training argue that many well-paid jobs in technology, healthcare, and skilled trades require practical certificates rather than four-year degrees. Students who enter apprenticeships earlier can avoid large debts and gain experience while earning a salary.

By contrast, supporters of universities highlight the development of critical thinking, research skills, and adaptability. Graduates may switch fields several times during their lives, and broad academic foundations can make such transitions easier.

Personally, I believe the choice should depend on the individual's goals and learning style. Society needs both researchers and master electricians, and both paths deserve respect if they are rigorous and aligned with labour market realities.`,
  },
  {
    id: "t1-tech-1",
    task: "task1",
    topic: "technology",
    title: "Internet access by region (pie chart description)",
    titleZh: "各地区互联网接入比例",
    structureHint: "Overview → largest vs smallest → brief comparison.",
    text: `The pie chart illustrates the proportion of households with high-speed internet access in four regions in a single year. Overall, access was far more common in the North than in the South, while the East and West occupied intermediate positions.

The North accounted for the largest share at 42 percent of all connected households surveyed. This was almost double the figure for the South, which represented only 22 percent and was the smallest region shown.

Meanwhile, the East and West were relatively similar, at 20 and 16 percent respectively. Together, these two regions made up slightly more than a third of the total. The data suggest a clear digital divide between northern and southern areas, which policymakers may wish to investigate further.`,
  },
  {
    id: "t1-env-1",
    task: "task1",
    topic: "environment",
    title: "Household waste composition (pie chart description)",
    titleZh: "家庭垃圾构成",
    structureHint: "Overview → main categories → smaller segments.",
    text: `The pie chart presents how household waste was divided into five categories in one city during a given month. Organic food waste formed the largest component, while hazardous items were negligible.

Organic waste represented 38 percent of the total, more than any other single category. Plastic packaging was the second largest contributor at 26 percent, indicating substantial consumption of packaged goods.

Paper and glass together accounted for 23 percent, with paper slightly higher at 13 percent compared with 10 percent for glass. Metal waste made up 11 percent, whereas hazardous materials such as batteries composed only 2 percent. These figures highlight the importance of composting programmes alongside recycling plastics and paper.`,
  },
  {
    id: "t1-edu-1",
    task: "task1",
    topic: "education",
    title: "Average weekly study hours by age group (table description)",
    titleZh: "不同年龄每周学习时长",
    structureHint: "Introduce table → compare groups → note trend.",
    text: `The table compares average weekly hours spent on independent study by learners in three age groups. It is clear that study time peaked in middle age and was lowest among teenagers.

Teenagers aged 13 to 18 studied for only 6 hours per week on average. This figure rose sharply to 14 hours for adults between 19 and 35, who may be combining work with part-time courses.

Learners aged 36 and above devoted 11 hours each week, somewhat less than the younger adult group but still considerably more than teenagers. The pattern suggests that young professionals invest the most time in self-directed learning, possibly due to career pressure or online qualifications.`,
  },
];

const WEAK_KEY = "ielts_dictation_weakness";
const STREAK_KEY = "ielts_dictation_streak_95";
const GOLD_KEY = "ielts_dictation_gold_unlocked";

export function loadWeaknessWords(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WEAK_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.map((x) => String(x).toLowerCase()).slice(0, 200) : [];
  } catch {
    return [];
  }
}

export function saveWeaknessWords(words: string[]) {
  if (typeof window === "undefined") return;
  const prev = new Set(loadWeaknessWords());
  words.forEach((w) => {
    const t = w
      .replace(/^[^a-zA-Z0-9]+/i, "")
      .replace(/[^a-zA-Z0-9]+$/i, "")
      .toLowerCase();
    if (t.length > 2) prev.add(t);
  });
  localStorage.setItem(WEAK_KEY, JSON.stringify(Array.from(prev).slice(0, 200)));
}

export function loadStreak95(): number {
  if (typeof window === "undefined") return 0;
  const n = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

export function saveStreak95(streak: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_KEY, String(Math.max(0, streak)));
}

export function loadGoldUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GOLD_KEY) === "1";
}

export function saveGoldUnlocked() {
  if (typeof window === "undefined") return;
  localStorage.setItem(GOLD_KEY, "1");
}

/** Sort level ids: higher overlap with weakness words first. */
export function sortLevelsByWeakness(levels: DictationLevel[], weakness: Set<string>): DictationLevel[] {
  const score = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    let c = 0;
    for (const w of words) {
      const t = w.replace(/[^a-z']/gi, "").toLowerCase();
      if (t.length > 2 && weakness.has(t)) c += 1;
    }
    return c;
  };
  return [...levels].sort((a, b) => score(b.text) - score(a.text));
}
