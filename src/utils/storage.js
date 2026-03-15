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
  sentencesCorrect: 0,    // legacy — kept for backward compat
  frasesComp: 0,          // correct answers HE→ES (comprensión)
  frasesEsc: 0,           // correct answers ES→HE (escritura)
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

export function saveSentenceCorrect(type) {
  const p = getProgress();
  p.sentencesCorrect = (p.sentencesCorrect || 0) + 1; // legacy
  if (type === "comp") p.frasesComp = (p.frasesComp || 0) + 1;
  if (type === "esc")  p.frasesEsc  = (p.frasesEsc  || 0) + 1;
  save(p);
}

export function canUnlockNextGroup(p) {
  const compOk = (p.frasesComp || 0) >= 3;
  const escOk  = (p.frasesEsc  || 0) >= 3;
  const dialogueOk = Object.values(p.dialogues || {}).some(d => d.passed);
  return (compOk && escOk) || dialogueOk;
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
