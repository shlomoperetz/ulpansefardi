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

// ── SM-2 Spaced Repetition ────────────────────────────────────────────────
// quality: 5 = correcto sin errores, 3 = correcto con errores, 1 = incorrecto
export function saveCardSRS(he, quality) {
  const p = getProgress();
  if (!p.cards[he]) p.cards[he] = {};
  const c = p.cards[he];

  const reps        = c.srsReps     ?? 0;
  const ef          = c.srsEf       ?? 2.5;
  const prevInt     = c.srsInterval ?? 1;

  let interval, newEf, newReps;

  if (quality >= 3) {
    newReps  = reps + 1;
    if      (newReps === 1) interval = 1;
    else if (newReps === 2) interval = 6;
    else                    interval = Math.round(prevInt * ef);
    newEf = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  } else {
    newReps  = 0;
    interval = 1;
    newEf    = Math.max(1.3, ef - 0.2);
  }

  const nextReview = new Date(Date.now() + interval * 86400000)
    .toISOString().split("T")[0];

  c.srsReps       = newReps;
  c.srsEf         = newEf;
  c.srsInterval   = interval;
  c.srsNextReview = nextReview;
  c.mastered      = true;

  save(p);
}

export function isCardDue(cardData) {
  if (!cardData?.srsNextReview) return true; // nunca revisada = siempre pendiente
  const today = new Date().toISOString().split("T")[0];
  return cardData.srsNextReview <= today;
}

export function getLoteDueCount(loteCards, progressCards) {
  return loteCards.filter(c => isCardDue(progressCards[c.he])).length;
}

export function getLoteNextReview(loteCards, progressCards) {
  const today = new Date().toISOString().split("T")[0];
  return loteCards
    .map(c => progressCards[c.he]?.srsNextReview)
    .filter(d => d && d > today)
    .sort()[0] || null;
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
