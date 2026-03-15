let KEY = "ulpan_8belts_v1";

export function enableDemoMode() { KEY = "ulpan_8belts_demo"; }

function load() {
  try {
    const r = localStorage.getItem(KEY);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

function save(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
}

const DEFAULTS = {
  words: {},              // wordId → { mana, lastReviewed, masteredAt, srsReps, srsEf, srsInterval, srsNextReview }
  unlockedGroups: [1],    // which groups are unlocked (start with group 1)
  dialogues: {},          // dialogueId → { phase: 1|2|3, passed: bool, lastSeen: date }
  elementalDone: {},      // bloqueId → bool (kept for Elemental.jsx compatibility)
  streak: 0,
  lastSession: null,
};

export function getProgress() {
  const stored = load();
  if (!stored) return { ...DEFAULTS };
  return { ...DEFAULTS, ...stored };
}

export function saveWordProgress(wordId, wordData) {
  const p = getProgress();
  p.words[wordId] = wordData;
  save(p);
}

export function unlockGroup(groupNum) {
  const p = getProgress();
  if (!p.unlockedGroups.includes(groupNum)) {
    p.unlockedGroups.push(groupNum);
    p.unlockedGroups.sort((a, b) => a - b);
  }
  save(p);
}

export function saveDialogueProgress(dialogueId, phase, passed) {
  const p = getProgress();
  const prev = p.dialogues[dialogueId] || { phase: 1, passed: false };
  p.dialogues[dialogueId] = {
    phase: passed ? Math.min(3, Math.max(prev.phase, phase)) : prev.phase,
    passed,
    lastSeen: new Date().toISOString().split("T")[0],
  };
  save(p);
}

export function markTodayDone() {
  const p = getProgress();
  const today = new Date().toISOString().split("T")[0];
  if (p.lastSession === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  p.streak = p.lastSession === yesterday ? p.streak + 1 : 1;
  p.lastSession = today;
  save(p);
}

// ── Elemental.jsx compatibility ─────────────────────────────────────────────
export function markElementalDone(bloqueId) {
  const p = getProgress();
  p.elementalDone[bloqueId] = true;
  save(p);
}

export function isElementalUnlocked(bloque, elementalDone) {
  if (!bloque.requires) return true;
  return bloque.requires.every(id => elementalDone[id]);
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
