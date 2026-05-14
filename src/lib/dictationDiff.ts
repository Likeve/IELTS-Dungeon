/** Word-level dictation diff: correct (green), spelling (red), wrong, missing (yellow), extra (orange). */

export type WordDiffKind = "correct" | "spelling" | "wrong" | "missing" | "extra";

export type AlignedToken = {
  kind: WordDiffKind;
  /** Surface form shown (reference or student) */
  text: string;
  refNorm?: string;
  stuNorm?: string;
};

function stripWord(s: string): string {
  return s.replace(/^[^a-zA-Z0-9']+/i, "").replace(/[^a-zA-Z0-9']+$/i, "");
}

function norm(s: string): string {
  return stripWord(s).toLowerCase();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

type Op = "match" | "sub" | "del" | "ins";

/** Align reference and student word sequences with weighted edit distance. */
export function alignDictation(reference: string, student: string): {
  tokens: AlignedToken[];
  accuracy: number;
  weaknessWords: string[];
} {
  const refWords = tokenize(reference);
  const stuWords = tokenize(student);
  const R = refWords.length;
  const S = stuWords.length;
  if (R === 0) {
    return {
      tokens: stuWords.map((t) => ({ kind: "extra" as const, text: t })),
      accuracy: S === 0 ? 100 : 0,
      weaknessWords: [],
    };
  }

  const INF = 1e9;
  const costMatch = 0;
  const costSub = 2;
  const costDel = 3;
  const costIns = 2;

  const dp: number[][] = Array.from({ length: R + 1 }, () => Array(S + 1).fill(INF));
  const back: (Op | null)[][] = Array.from({ length: R + 1 }, () => Array(S + 1).fill(null));
  dp[0][0] = 0;

  for (let i = 0; i <= R; i++) {
    for (let j = 0; j <= S; j++) {
      if (dp[i][j] >= INF) continue;
      if (i < R && j < S) {
        const rn = norm(refWords[i]);
        const sn = norm(stuWords[j]);
        if (rn === sn && rn.length > 0) {
          const c = dp[i][j] + costMatch;
          if (c < dp[i + 1][j + 1]) {
            dp[i + 1][j + 1] = c;
            back[i + 1][j + 1] = "match";
          }
        } else {
          const c = dp[i][j] + costSub;
          if (c < dp[i + 1][j + 1]) {
            dp[i + 1][j + 1] = c;
            back[i + 1][j + 1] = "sub";
          }
        }
      }
      if (i < R) {
        const c = dp[i][j] + costDel;
        if (c < dp[i + 1][j]) {
          dp[i + 1][j] = c;
          back[i + 1][j] = "del";
        }
      }
      if (j < S) {
        const c = dp[i][j] + costIns;
        if (c < dp[i][j + 1]) {
          dp[i][j + 1] = c;
          back[i][j + 1] = "ins";
        }
      }
    }
  }

  const ops: { op: Op; i: number; j: number }[] = [];
  let i = R;
  let j = S;
  let guard = 0;
  while ((i > 0 || j > 0) && guard++ < R + S + 10) {
    const b = back[i][j];
    if (!b) break;
    if (b === "match" || b === "sub") {
      ops.push({ op: b, i: i - 1, j: j - 1 });
      i -= 1;
      j -= 1;
    } else if (b === "del") {
      ops.push({ op: "del", i: i - 1, j });
      i -= 1;
    } else {
      ops.push({ op: "ins", i, j: j - 1 });
      j -= 1;
    }
  }
  ops.reverse();

  const tokens: AlignedToken[] = [];
  let correct = 0;
  const weakness = new Set<string>();

  for (const { op, i: ri, j: sj } of ops) {
    if (op === "match") {
      const rw = refWords[ri];
      tokens.push({ kind: "correct", text: rw, refNorm: norm(rw), stuNorm: norm(stuWords[sj]) });
      correct += 1;
    } else if (op === "sub") {
      const rw = refWords[ri];
      const sw = stuWords[sj];
      const rn = norm(rw);
      const sn = norm(sw);
      if (rn.length >= 2 && sn.length >= 2 && rn !== sn) {
        const d = levenshtein(rn, sn);
        const maxLen = Math.max(rn.length, sn.length);
        const isSpelling = d <= 2 && d < maxLen * 0.4;
        if (isSpelling) {
          tokens.push({ kind: "spelling", text: `${sw} → ${rw}`, refNorm: rn, stuNorm: sn });
          weakness.add(rw);
        } else {
          tokens.push({ kind: "wrong", text: `${sw} / ${rw}`, refNorm: rn, stuNorm: sn });
          weakness.add(rw);
          weakness.add(sw);
        }
      } else {
        tokens.push({ kind: "wrong", text: `${sw} / ${rw}`, refNorm: rn, stuNorm: sn });
        weakness.add(rw);
      }
    } else if (op === "del") {
      const rw = refWords[ri];
      tokens.push({ kind: "missing", text: rw, refNorm: norm(rw) });
      weakness.add(rw);
    } else {
      const sw = stuWords[sj];
      tokens.push({ kind: "extra", text: sw, stuNorm: norm(sw) });
      weakness.add(sw);
    }
  }

  const accuracy = Math.round((100 * correct) / R);

  return {
    tokens,
    accuracy: Math.min(100, Math.max(0, accuracy)),
    weaknessWords: Array.from(weakness).filter((w) => stripWord(w).length > 1),
  };
}
