const KEY = "ulpan_progress";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function getProgress() {
  return load() || {
    cards: {},
    loteDone: {},
    streak: 0,
    lastSession: null,
    currentLote: 1,
  };
}

export function saveCardResult(he, wasCorrect) {
  const p = getProgress();
  if (!p.cards[he]) p.cards[he] = { correct: 0, mastered: false };
  if (wasCorrect) p.cards[he].correct += 1;
  else p.cards[he].correct = Math.max(0, (p.cards[he].correct || 0) - 1);
  if (p.cards[he].correct >= 3) p.cards[he].mastered = true;
  save(p);
}

export function isLoteDone(loteId, loteCards, progressCards) {
  return loteCards.every(c => progressCards[c.he]?.mastered);
}

export function isLoteUnlocked(lote, progressLoteDone) {
  if (!lote.requires) return lote.id === 1;
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

export function resetProgress() {
  localStorage.removeItem(KEY);
}
