const KEY = "ulpan_progress_v3";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

const DEFAULTS = {
  cards: {},
  loteDone: {},
  elementalDone: {},
  streak: 0,
  lastSession: null,
  currentLote: 1,
};

export function getProgress() {
  const stored = load();
  if (!stored) return { ...DEFAULTS };
  return { ...DEFAULTS, ...stored };
}

export function saveCardResult(he, wasCorrect) {
  const p = getProgress();
  if (!p.cards[he]) p.cards[he] = { correct: 0, mastered: false };
  if (wasCorrect) p.cards[he].correct += 1;
  else p.cards[he].correct = Math.max(0, (p.cards[he].correct || 0) - 1);
  if (p.cards[he].correct >= 3) p.cards[he].mastered = true;
  save(p);
}

export function isLoteDone(loteCards, progressCards) {
  return loteCards.every(c => progressCards[c.he]?.mastered);
}

export function isLoteUnlocked(lote, progressLoteDone) {
  if (!lote.requires) return true;
  return lote.requires.every(id => progressLoteDone[id]);
}

export function markLoteDone(loteId) {
  const p = getProgress();
  p.loteDone[loteId] = true;
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
