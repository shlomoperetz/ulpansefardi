import { useState, useEffect, useRef } from "react";
import { LOTES, ALL_CARDS, BINYAN_COLORS } from "../data/cards";
import { FRASES_POR_LOTE } from "../data/frases";
import { fonts } from "../theme";
import {
  getProgress, saveCardResult, markTodayDone, markLoteDone,
  isLoteUnlocked, saveCardSRS, isCardDue, getLoteNextReview,
} from "../utils/storage";

const MASTERY_FULL   = 3; // primera sesión
const MASTERY_REVIEW = 1; // repaso SRS

const KB_ROWS = [
  ["ק","ר","א","ט","ו","ן","ם","פ"],
  ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
  ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"],
];

const SIMILAR = {
  "ב":"כ","כ":"ב","ד":"ר","ר":"ד","ו":"ז","ז":"ו",
  "ה":"ח","ח":"ה","ת":"ח","מ":"ס","ס":"מ","י":"ו",
  "נ":"ג","ג":"נ","פ":"צ","צ":"פ","ק":"פ","ך":"ף",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function norm(str) {
  return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿¡]/g, "");
}

function stripNikud(str) {
  return str.replace(/[\u05B0-\u05C7]/g, "").trim();
}

function daysUntil(dateStr) {
  const today = new Date().toISOString().split("T")[0];
  return Math.ceil((new Date(dateStr) - new Date(today)) / 86400000);
}

function generateChoices(correctCard, cardPool) {
  const base    = stripNikud(correctCard.he);
  const letters = [...base];
  const seen    = new Set([base]);
  const opts    = [];

  for (let i = 0; i < 40 && opts.length < 2; i++) {
    const s = shuffle([...letters]).join("");
    if (!seen.has(s)) { seen.add(s); opts.push(s); }
  }
  for (let i = 0; i < letters.length && opts.length < 3; i++) {
    const sub = SIMILAR[letters[i]];
    if (sub) {
      const swapped = [...letters]; swapped[i] = sub;
      const s = swapped.join("");
      if (!seen.has(s)) { seen.add(s); opts.push(s); }
    }
  }
  const fallback = shuffle(cardPool).filter(c => !seen.has(stripNikud(c.he)));
  for (const c of fallback) {
    if (opts.length >= 3) break;
    seen.add(stripNikud(c.he)); opts.push(stripNikud(c.he));
  }
  return shuffle([base, ...opts.slice(0, 3)]);
}

export default function Anki({ t, loteId, onBack }) {
  const lote     = LOTES.find(l => l.id === loteId);
  const progress = getProgress();

  // ── Determinar tipo de sesión ──────────────────────────────────────────
  // isReview: todas las cartas ya tienen SRS y hay al menos una vencida
  const allHaveSRS = lote.cards.every(c => progress.cards[c.he]?.srsNextReview);
  const dueCards   = lote.cards.filter(c => isCardDue(progress.cards[c.he]));
  const isReview   = allHaveSRS && dueCards.length > 0;
  const nothingDue = allHaveSRS && dueCards.length === 0;

  const MASTERY    = isReview ? MASTERY_REVIEW : MASTERY_FULL;
  const initCards  = isReview ? dueCards : lote.cards;

  // ── Estado principal ───────────────────────────────────────────────────
  const [phase, setPhase]           = useState(isReview ? 3 : 1);
  const [cards, setCards]           = useState(() =>
    shuffle(initCards).map(c => ({ ...c, correct: 0 }))
  );
  const [index, setIndex]           = useState(0);
  const [input, setInput]           = useState("");
  const [feedback, setFeedback]     = useState(null);
  const [showTr, setShowTr]         = useState(false);
  const [transition, setTransition] = useState(false);
  const [done, setDone]             = useState(false);
  const [showKb, setShowKb]         = useState(false);
  const [lastInput, setLastInput]   = useState("");

  // Phase 1 (selección múltiple)
  const [p1Done, setP1Done]               = useState(() => new Set());
  const [choices, setChoices]             = useState(null);
  const [choiceFeedback, setChoiceFeedback] = useState(null);

  // SRS: errores por carta en esta sesión (para calcular calidad)
  const [sessionWrongs] = useState(() => new Map());

  const inputRef = useRef(null);

  const active    = cards.filter(c => c.correct < MASTERY);
  const current   = active[index % Math.max(active.length, 1)];
  const mastered  = cards.filter(c => c.correct >= MASTERY).length;
  const pct       = Math.round((mastered / cards.length) * 100);
  const cardCorrect = cards.find(c => c.he === current?.he)?.correct || 0;

  const p1Active  = cards.filter((_, i) => !p1Done.has(i));
  const p1Current = p1Active[index % Math.max(p1Active.length, 1)];
  const p1Pct     = Math.round((p1Done.size / cards.length) * 100);

  useEffect(() => {
    if (phase === 1 && p1Current) {
      setChoices(generateChoices(p1Current, ALL_CARDS));
      setChoiceFeedback(null);
    }
  }, [phase, index, p1Active.length]);

  useEffect(() => {
    if (!feedback) inputRef.current?.focus();
  }, [feedback, index, phase]);

  // Fin phase 1 → phase 2
  useEffect(() => {
    if (phase === 1 && p1Done.size > 0 && p1Active.length === 0) {
      markTodayDone();
      setTransition("1→2");
      setTimeout(() => {
        setPhase(2);
        setCards(shuffle(initCards).map(c => ({ ...c, correct: 0 })));
        setIndex(0); setFeedback(null); setInput(""); setTransition(false);
      }, 2000);
    }
  }, [p1Active.length]);

  // Fin phase 2 → phase 3
  useEffect(() => {
    if (phase === 2 && active.length === 0 && cards.length > 0) {
      markTodayDone();
      setTransition("2→3");
      setTimeout(() => {
        setPhase(3);
        setCards(shuffle(initCards).map(c => ({ ...c, correct: 0 })));
        setIndex(0); setFeedback(null); setInput(""); setTransition(false);
      }, 2000);
    }
  }, [active.length, phase]);

  // Fin phase 3 → done
  useEffect(() => {
    if (phase === 3 && active.length === 0 && cards.length > 0) {
      markTodayDone();
      if (!isReview) markLoteDone(loteId);
      setDone(true);
    }
  }, [active.length, phase]);

  // ── Phase 1: selección múltiple ─────────────────────────────────────────
  function handleChoice(chosen) {
    if (choiceFeedback) return;
    const correctBase = stripNikud(p1Current.he);
    const ok = chosen === correctBase;
    setChoiceFeedback({ chosen, correct: correctBase, ok });
    if (ok) {
      const origIdx = cards.indexOf(p1Current);
      setTimeout(() => { setP1Done(prev => new Set([...prev, origIdx])); setChoiceFeedback(null); setIndex(i => i + 1); }, 700);
    } else {
      setTimeout(() => { setChoiceFeedback(null); setIndex(i => i + 1); }, 1500);
    }
  }

  // ── Phases 2 y 3: escribir ──────────────────────────────────────────────
  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const answer = phase === 2 ? current.es : current.he;
    const ok = phase === 2
      ? norm(input) === norm(answer) ||
        answer.split("/").some(a => norm(input) === norm(a.trim())) ||
        answer.split("(")[0].trim().split(" ").some(w => norm(input) === norm(w))
      : stripNikud(input) === stripNikud(answer);

    saveCardResult(current.he, ok);

    if (ok) {
      setFeedback("correct");
      const updated = cards.map(c =>
        c.he === current.he ? { ...c, correct: Math.min(c.correct + 1, MASTERY) } : c
      );
      setCards(updated);

      // Al dominar en phase 3: guardar SRS
      if (phase === 3) {
        const newCorrect = (updated.find(c => c.he === current.he)?.correct || 0);
        if (newCorrect >= MASTERY) {
          const wrongs  = sessionWrongs.get(current.he) || 0;
          const quality = wrongs === 0 ? 5 : wrongs === 1 ? 3 : 2;
          saveCardSRS(current.he, quality);
        }
      }

      setTimeout(() => { setFeedback(null); setInput(""); setShowTr(false); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
      sessionWrongs.set(current.he, (sessionWrongs.get(current.he) || 0) + 1);
      setCards(cards.map(c =>
        c.he === current.he ? { ...c, correct: Math.max(0, c.correct - 1) } : c
      ));
    }
  }

  function next()        { setFeedback(null); setInput(""); setShowTr(false); setIndex(i => i + 1); }
  function kbType(char)  { setInput(v => v + char); inputRef.current?.focus(); }
  function kbBackspace() { setInput(v => [...v].slice(0, -1).join("")); }

  const keyStyle = {
    background: t.surface, border: "1px solid " + t.border, borderRadius: 6,
    color: t.text, fontSize: 16, fontFamily: fonts.serif,
    cursor: "pointer", width: 32, height: 36,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
  };

  // ── Sin nada para hoy ───────────────────────────────────────────────────
  if (nothingDue) {
    const nextDate = getLoteNextReview(lote.cards, getProgress().cards);
    const days     = nextDate ? daysUntil(nextDate) : null;
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 16px", fontFamily: fonts.serif, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <button onClick={() => onBack()} style={{ alignSelf: "flex-start", background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>← volver</button>
        <div style={{ fontSize: 48, color: t.gold, marginTop: 16 }}>✓</div>
        <h2 style={{ fontSize: 22, color: t.text, fontFamily: fonts.serif, margin: 0 }}>{lote.label}</h2>
        <p style={{ color: t.muted, fontFamily: fonts.ui, margin: 0 }}>
          {days === 1
            ? "Próxima revisión: mañana"
            : days
            ? `Próxima revisión: en ${days} días`
            : "Todas las cartas al día"}
        </p>
        <p style={{ color: t.subtle, fontFamily: fonts.ui, fontSize: 12, margin: 0 }}>
          {nextDate || ""}
        </p>
        <button
          onClick={() => {
            // Forzar repaso igualmente
            setCards(shuffle(lote.cards).map(c => ({ ...c, correct: 0 })));
            setPhase(3);
          }}
          style={{ marginTop: 8, background: "none", border: "1px solid " + t.border, borderRadius: 20, padding: "6px 20px", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}
        >
          Repasar de todos modos
        </button>
      </div>
    );
  }

  // ── Transición ──────────────────────────────────────────────────────────
  if (transition) {
    const msgs = {
      "1→2": { title: "Fase 1 completada", sub: "Ahora: hebreo → español" },
      "2→3": { title: "Fase 2 completada", sub: "Ahora: español → hebreo" },
    };
    const m = msgs[transition] || {};
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "80px 16px", fontFamily: fonts.serif, textAlign: "center" }}>
        <div style={{ fontSize: 48, color: t.gold }}>✦</div>
        <h2 style={{ color: t.text, fontSize: 24, marginTop: 16 }}>{m.title}</h2>
        <p style={{ color: t.muted }}>{m.sub}</p>
      </div>
    );
  }

  // ── Pantalla de fin ─────────────────────────────────────────────────────
  if (done) {
    const frases       = FRASES_POR_LOTE[loteId] || [];
    const freshProgress = getProgress();
    const nextLote     =
      LOTES.find(l => l.id > loteId && !freshProgress.loteDone[l.id] && isLoteUnlocked(l, freshProgress.loteDone)) ||
      LOTES.find(l => l.id !== loteId && !freshProgress.loteDone[l.id] && isLoteUnlocked(l, freshProgress.loteDone));

    // Mostrar cuándo es la próxima revisión
    const nextDate = getLoteNextReview(lote.cards, freshProgress.cards);
    const days     = nextDate ? daysUntil(nextDate) : null;

    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 16px 80px", fontFamily: fonts.serif, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 56, color: t.gold }}>{isReview ? "↺" : lote.isFinal ? "★" : "✦"}</div>
        <h2 style={{ color: t.text, fontSize: 28, margin: 0 }}>
          {isReview ? lote.label + " repasado" : lote.isFinal ? "Repaso final completado" : lote.label + " completado"}
        </h2>
        <p style={{ color: t.muted, margin: 0, fontFamily: fonts.ui }}>
          {isReview ? `${cards.length} cartas repasadas` : `${lote.cards.length} palabras dominadas`}
        </p>
        {days !== null && (
          <p style={{ color: t.subtle, fontSize: 12, fontFamily: fonts.ui, margin: 0 }}>
            Próxima revisión: {days === 1 ? "mañana" : `en ${days} días`}
          </p>
        )}

        {!isReview && frases.length > 0 && (
          <div style={{ width: "100%", marginTop: 8, borderTop: "1px solid " + t.border, paddingTop: 20 }}>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui, marginBottom: 16 }}>
              frases con estas palabras
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {frases.map((f, i) => (
                <div key={i} style={{ background: t.surface, borderRadius: 12, padding: "16px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: "bold", direction: "rtl", color: t.text, lineHeight: 1.4 }}>{f.he}</div>
                  <div style={{ fontSize: 12, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui, marginTop: 4 }}>{f.tr}</div>
                  <div style={{ fontSize: 15, color: t.text, fontFamily: fonts.ui, marginTop: 6 }}>{f.es}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320, marginTop: 8 }}>
          {!isReview && nextLote && (
            <button onClick={() => onBack(nextLote.id)}
              style={{ background: t.gold, border: "none", borderRadius: 10, padding: "13px 32px", color: t.bg, fontSize: 14, cursor: "pointer", fontFamily: fonts.ui, fontWeight: "bold" }}>
              Siguiente: {nextLote.label} →
            </button>
          )}
          <button onClick={() => onBack()}
            style={{ background: "none", border: "1px solid " + t.border, borderRadius: 10, padding: "12px 32px", color: t.muted, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 1: selección múltiple ─────────────────────────────────────────
  if (phase === 1) {
    const question = p1Current;
    return (
      <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", padding: "0 16px 60px", fontFamily: fonts.serif, color: t.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => onBack()} style={{ background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>← volver</button>
            <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{lote.label}</span>
          </div>
          <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{p1Done.size}/{cards.length}</span>
        </div>

        <div style={{ width: "100%", height: 6, background: t.surface, borderRadius: 3, marginBottom: 32, overflow: "hidden" }}>
          <div style={{ height: "100%", width: p1Pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 3, transition: "width 0.5s" }} />
        </div>

        <div style={{ background: t.card, border: "1px solid " + t.border, borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, boxShadow: "0 8px 40px #00000022" }}>
          <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>{p1Active.length} restantes</div>
          <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>¿cuál es la escritura correcta?</div>
          <div style={{ fontSize: 28, color: t.text, fontFamily: fonts.ui, fontWeight: "bold" }}>{question?.es}</div>
          {question?.tr && <div style={{ fontSize: 13, color: t.subtle, fontStyle: "italic", fontFamily: fonts.ui }}>{question.tr}</div>}
          {question?.binyan && (() => {
            const color = BINYAN_COLORS[question.binyan];
            return <span style={{ fontSize: 12, padding: "2px 12px", borderRadius: 12, fontFamily: fonts.serif, background: color + "22", color, border: "1px solid " + color + "55" }}>{question.binyan}</span>;
          })()}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", marginTop: 8 }}>
            {(choices || []).map((opt, i) => {
              const correctBase = stripNikud(question?.he || "");
              const isChosen    = choiceFeedback?.chosen === opt;
              const isCorrect   = opt === correctBase;
              const showCorrect = choiceFeedback && !choiceFeedback.ok && isCorrect;
              let borderColor = t.border, bgColor = t.surface, textColor = t.text;
              if (choiceFeedback) {
                if (isChosen && !choiceFeedback.ok)  { borderColor = t.wrong;   bgColor = t.wrong   + "22"; textColor = t.wrong; }
                else if (isChosen && choiceFeedback.ok) { borderColor = t.correct; bgColor = t.correct + "22"; textColor = t.correct; }
                else if (showCorrect)                { borderColor = t.correct + "88"; bgColor = t.correct + "11"; }
              }
              return (
                <button key={i} onClick={() => handleChoice(opt)}
                  style={{ background: bgColor, border: "1px solid " + borderColor, borderRadius: 12, padding: "18px 8px", cursor: choiceFeedback ? "default" : "pointer", textAlign: "center", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 28, fontFamily: fonts.serif, direction: "rtl", color: textColor, lineHeight: 1.2 }}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Phases 2 y 3: escribir ──────────────────────────────────────────────
  const question = current ? (phase === 2 ? current.he : current.es) : "";
  const answer   = current ? (phase === 2 ? current.es : current.he) : "";

  // Badge de sesión tipo
  const sessionLabel = isReview
    ? `↺ repaso · ${cards.length} cartas`
    : phase === 2 ? "fase 2 — escribe en español" : "fase 3 — escribe en hebreo";

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", padding: "0 16px 60px", fontFamily: fonts.serif, color: t.text }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => onBack()} style={{ background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>← volver</button>
          <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{lote.label}</span>
        </div>
        <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{mastered}/{cards.length}</span>
      </div>

      <div style={{ width: "100%", height: 6, background: t.surface, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ fontSize: 10, color: t.subtle, fontFamily: fonts.ui, textAlign: "right", marginBottom: 24, letterSpacing: 1, textTransform: "uppercase" }}>
        {sessionLabel}
      </div>

      <div style={{ background: t.card, border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border), borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022" }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>{active.length} restantes</div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{phase === 2 ? "¿Qué significa?" : "¿Cómo se dice en hebreo?"}</div>
        <div style={{ fontSize: 36, fontWeight: "bold", color: t.text, textAlign: "center", lineHeight: 1.3, direction: "auto" }}>{question}</div>

        {current?.binyan && (() => {
          const color = BINYAN_COLORS[current.binyan];
          return <span style={{ fontSize: 12, padding: "2px 12px", borderRadius: 12, fontFamily: fonts.serif, background: color + "22", color, border: "1px solid " + color + "55" }}>{current.binyan}</span>;
        })()}

        {phase === 2 && current && (
          <button style={{ background: "none", border: "1px solid " + t.border, color: t.muted, fontSize: 12, padding: "4px 14px", borderRadius: 20, cursor: "pointer", fontFamily: fonts.ui }} onClick={() => setShowTr(v => !v)}>
            {showTr ? current.tr : "ver transliteración"}
          </button>
        )}

        {!feedback ? (
          <>
            <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
                style={{ flex: 1, background: t.bg, border: "1px solid " + t.border, borderRadius: 10, padding: "12px 16px", color: t.text, fontSize: 16, fontFamily: fonts.serif, outline: "none" }}
                placeholder={phase === 2 ? "escribe en español..." : "escribe en hebreo..."}
                dir={phase === 3 ? "rtl" : "ltr"} autoComplete="off" autoCorrect="off" spellCheck="false"
              />
              <button onClick={submit} style={{ background: t.gold, border: "none", borderRadius: 10, padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer" }}>→</button>
            </div>

            {phase === 3 && (
              <button onClick={() => setShowKb(v => !v)} style={{ alignSelf: "flex-end", background: "none", border: "none", color: showKb ? t.gold : t.subtle, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui, padding: "2px 0" }}>
                {showKb ? "⌨ ocultar teclado" : "⌨ teclado hebreo"}
              </button>
            )}
            {phase === 3 && showKb && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                {KB_ROWS.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 4, direction: "ltr" }}>
                    {row.map(letter => (
                      <button key={letter} onMouseDown={e => { e.preventDefault(); kbType(letter); }} style={keyStyle}>{letter}</button>
                    ))}
                    {ri === 2 && <button onMouseDown={e => { e.preventDefault(); kbBackspace(); }} style={{ ...keyStyle, width: 44, fontSize: 14, color: t.muted }}>⌫</button>}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 8 }}>
            <div style={{ fontSize: 13, padding: "6px 20px", borderRadius: 20, border: "1px solid", letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui, background: feedback === "correct" ? t.correct + "22" : t.wrong + "22", color: feedback === "correct" ? t.correct : t.wrong, borderColor: feedback === "correct" ? t.correct + "55" : t.wrong + "55" }}>
              {feedback === "correct" ? "correcto" : "incorrecto"}
            </div>
            {feedback === "correct" && current?.tr && (
              <span style={{ fontSize: 13, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui }}>{current.tr}</span>
            )}
            {feedback === "wrong" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center" }}>
                <div style={{ width: "100%" }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Tu respuesta</span>
                  <div style={{ fontSize: 20, color: t.wrong, fontWeight: "bold", direction: "auto", marginTop: 4, textDecoration: "line-through", opacity: 0.8 }}>{lastInput}</div>
                </div>
                <div style={{ width: "100%", borderTop: "1px solid " + t.border, paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Correcto</span>
                  <div style={{ fontSize: 24, color: t.text, fontWeight: "bold", direction: "auto", marginTop: 4 }}>{answer}</div>
                  {phase === 2 && <span style={{ fontSize: 13, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui }}>{current.tr}</span>}
                </div>
              </div>
            )}
            {feedback === "wrong" && (
              <button style={{ background: "none", border: "1px solid " + t.border, borderRadius: 20, padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui }} onClick={next}>Continuar</button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
        {Array.from({ length: MASTERY }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < cardCorrect ? t.gold : t.border, transition: "background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}
