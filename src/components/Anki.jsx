import { useState, useEffect, useRef } from "react";
import { LOTES } from "../data/cards";
import { fonts } from "../theme";
import { getProgress, saveCardResult, markTodayDone, markLoteDone, isLoteDone, isLoteUnlocked } from "../utils/storage";

const MASTERY = 3;

const KB_ROWS = [
  ["ק","ר","א","ט","ו","ן","ם","פ"],
  ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
  ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"],
];

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

export default function Anki({ t, loteId, onBack }) {
  const lote = LOTES.find(l => l.id === loteId);
  const progress = getProgress();

  const [cards, setCards] = useState(() =>
    shuffle(lote.cards).map(c => ({ ...c, correct: progress.cards[c.he]?.correct || 0 }))
  );
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showTr, setShowTr] = useState(false);
  const [phase, setPhase] = useState(1);
  const [transition, setTransition] = useState(false);
  const [done, setDone] = useState(false);
  const [showKb, setShowKb] = useState(false);
  const inputRef = useRef(null);

  const active = cards.filter(c => c.correct < MASTERY);
  const current = active[index % Math.max(active.length, 1)];
  const mastered = cards.filter(c => c.correct >= MASTERY).length;
  const pct = Math.round((mastered / lote.cards.length) * 100);
  const cardCorrect = cards.find(c => c.he === current?.he)?.correct || 0;

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);

  useEffect(() => {
    if (active.length === 0 && cards.length > 0) {
      markTodayDone();
      if (phase === 1) {
        setTransition(true);
        setTimeout(() => {
          setPhase(2);
          setCards(shuffle(lote.cards).map(c => ({ ...c, correct: 0 })));
          setIndex(0); setFeedback(null); setInput(""); setTransition(false);
        }, 2000);
      } else {
        markLoteDone(loteId);
        setDone(true);
      }
    }
  }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    const answer = phase === 1 ? current.es : current.he;
    const ok = phase === 1
      ? norm(input) === norm(answer) ||
        answer.split("/").some(a => norm(input) === norm(a.trim())) ||
        answer.split("(")[0].trim().split(" ").some(w => norm(input) === norm(w))
      : stripNikud(input) === stripNikud(answer);

    saveCardResult(current.he, ok);

    if (ok) {
      setFeedback("correct");
      const updated = cards.map(c => c.he === current.he ? { ...c, correct: Math.min(c.correct + 1, MASTERY) } : c);
      setCards(updated);
      setTimeout(() => { setFeedback(null); setInput(""); setShowTr(false); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
      setCards(cards.map(c => c.he === current.he ? { ...c, correct: Math.max(0, c.correct - 1) } : c));
    }
  }

  function next() { setFeedback(null); setInput(""); setShowTr(false); setIndex(i => i + 1); }

  function kbType(char) { setInput(v => v + char); inputRef.current?.focus(); }
  function kbBackspace() { setInput(v => [...v].slice(0, -1).join("")); }

  const question = current ? (phase === 1 ? current.he : current.es) : "";
  const answer = current ? (phase === 1 ? current.es : current.he) : "";

  const keyStyle = {
    background: t.surface, border: "1px solid " + t.border, borderRadius: 6,
    color: t.text, fontSize: 16, fontFamily: fonts.serif,
    cursor: "pointer", width: 32, height: 36,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 0,
  };

  if (transition) return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "80px 16px", fontFamily: fonts.serif, textAlign: "center" }}>
      <div style={{ fontSize: 48, color: t.gold }}>✦</div>
      <h2 style={{ color: t.text, fontSize: 24, marginTop: 16 }}>Fase 1 completada</h2>
      <p style={{ color: t.muted }}>Ahora espanol a hebreo</p>
    </div>
  );

  if (done) return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "80px 16px", fontFamily: fonts.serif, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 56, color: t.gold }}>{lote.isFinal ? "★" : "✦"}</div>
      <h2 style={{ color: t.text, fontSize: 28, margin: 0 }}>
        {lote.isFinal ? "Mazo completo dominado" : lote.label + " completado"}
      </h2>
      <p style={{ color: t.muted, margin: 0 }}>
        {lote.isFinal ? "Has dominado las 62 palabras" : lote.cards.length + " palabras dominadas"}
      </p>
      <button onClick={onBack} style={{ background: t.gold, border: "none", borderRadius: 10, padding: "12px 32px", color: t.bg, fontSize: 14, cursor: "pointer", fontFamily: fonts.serif, marginTop: 8 }}>
        Volver al inicio
      </button>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", padding: "0 16px 60px", fontFamily: fonts.serif, color: t.text }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>← volver</button>
          <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{lote.label}</span>
        </div>
        <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{mastered}/{lote.cards.length}</span>
      </div>

      <div style={{ width: "100%", height: 6, background: t.surface, borderRadius: 3, marginBottom: 32, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 3, transition: "width 0.5s" }} />
      </div>

      <div style={{ background: t.card, border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border), borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022" }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>{active.length} restantes</div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{phase === 1 ? "Que significa?" : "Como se dice en hebreo?"}</div>
        <div style={{ fontSize: 36, fontWeight: "bold", color: t.text, textAlign: "center", lineHeight: 1.3, direction: "auto" }}>{question}</div>

        {phase === 1 && current && (
          <button style={{ background: "none", border: "1px solid " + t.border, color: t.muted, fontSize: 12, padding: "4px 14px", borderRadius: 20, cursor: "pointer", fontFamily: fonts.ui }} onClick={() => setShowTr(v => !v)}>
            {showTr ? current.tr : "ver transliteracion"}
          </button>
        )}

        {!feedback ? (
          <>
            <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
                style={{ flex: 1, background: t.bg, border: "1px solid " + t.border, borderRadius: 10, padding: "12px 16px", color: t.text, fontSize: 16, fontFamily: fonts.serif, outline: "none" }}
                placeholder={phase === 1 ? "escribe en espanol..." : "escribe en hebreo..."}
                dir={phase === 2 ? "rtl" : "ltr"} autoComplete="off" autoCorrect="off" spellCheck="false"
              />
              <button onClick={submit} style={{ background: t.gold, border: "none", borderRadius: 10, padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer" }}>→</button>
            </div>

            {phase === 2 && (
              <button onClick={() => setShowKb(v => !v)} style={{
                alignSelf: "flex-end", background: "none", border: "none",
                color: showKb ? t.gold : t.subtle, fontSize: 12, cursor: "pointer",
                fontFamily: fonts.ui, padding: "2px 0",
              }}>
                {showKb ? "⌨ ocultar teclado" : "⌨ teclado hebreo"}
              </button>
            )}

            {phase === 2 && showKb && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                {KB_ROWS.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 4, direction: "ltr" }}>
                    {row.map(letter => (
                      <button key={letter} onMouseDown={e => { e.preventDefault(); kbType(letter); }} style={keyStyle}>
                        {letter}
                      </button>
                    ))}
                    {ri === 2 && (
                      <button onMouseDown={e => { e.preventDefault(); kbBackspace(); }} style={{ ...keyStyle, width: 44, fontSize: 14, color: t.muted }}>⌫</button>
                    )}
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
            {feedback === "wrong" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center" }}>
                <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Respuesta</span>
                <span style={{ fontSize: 24, color: t.text, fontWeight: "bold", direction: "auto" }}>{answer}</span>
                {phase === 1 && <span style={{ fontSize: 13, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui }}>{current.tr}</span>}
              </div>
            )}
            {feedback === "wrong" && <button style={{ background: "none", border: "1px solid " + t.border, borderRadius: 20, padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui }} onClick={next}>Continuar</button>}
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
