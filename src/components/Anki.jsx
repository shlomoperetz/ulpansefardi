import { useState, useEffect, useRef } from "react";
import { ALL_CARDS } from "../data/cards";
import { fonts } from "../theme";

const MASTERY = 3;

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

export default function Anki({ t }) {
  const [phase, setPhase] = useState(1);
  const [cards, setCards] = useState(() => shuffle(ALL_CARDS).map(c => ({ ...c, correct: 0 })));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [mastered, setMastered] = useState(0);
  const [showTr, setShowTr] = useState(false);
  const [transition, setTransition] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const active = cards.filter(c => c.correct < MASTERY);
  const current = active[index % Math.max(active.length, 1)];

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);

  useEffect(() => {
    if (active.length === 0 && cards.length > 0) {
      if (phase === 1) {
        setTransition(true);
        setTimeout(() => {
          setPhase(2); setCards(shuffle(ALL_CARDS).map(c => ({ ...c, correct: 0 })));
          setIndex(0); setMastered(0); setFeedback(null); setInput(""); setTransition(false);
        }, 2000);
      } else { setDone(true); }
    }
  }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    const answer = phase === 1 ? current.es : current.he;
    const ok = phase === 1
      ? norm(input) === norm(answer) || answer.split("/").some(a => norm(input) === norm(a.trim())) || answer.split("(")[0].trim().split(" ").some(w => norm(input) === norm(w))
      : input.trim() === answer;
    if (ok) {
      setFeedback("correct");
      const updated = cards.map(c => c.he === current.he ? { ...c, correct: c.correct + 1 } : c);
      setCards(updated);
      setMastered(updated.filter(c => c.correct >= MASTERY).length);
      setTimeout(() => { setFeedback(null); setInput(""); setShowTr(false); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
      setCards(cards.map(c => c.he === current.he ? { ...c, correct: Math.max(0, c.correct - 1) } : c));
    }
  }

  function next() { setFeedback(null); setInput(""); setShowTr(false); setIndex(i => i + 1); }

  function restart() {
    setPhase(1); setCards(shuffle(ALL_CARDS).map(c => ({ ...c, correct: 0 })));
    setIndex(0); setMastered(0); setFeedback(null); setInput(""); setDone(false);
  }

  const pct = Math.round((mastered / ALL_CARDS.length) * 100);
  const question = current ? (phase === 1 ? current.he : current.es) : "";
  const answer = current ? (phase === 1 ? current.es : current.he) : "";
  const cardCorrect = cards.find(c => c.he === current?.he)?.correct || 0;

  const wrap = { width: "100%", maxWidth: 520, margin: "0 auto", padding: "0 16px 60px", fontFamily: fonts.serif, color: t.text };
  const btn = (extra) => ({ background: "none", border: "1px solid " + t.border, borderRadius: 20, padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.serif, ...extra });

  if (transition) return (
    <div style={wrap}>
      <div style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: 48, color: t.gold }}>✦</div>
        <h2 style={{ color: t.text, fontSize: 24, marginTop: 16 }}>Fase 1 completada</h2>
        <p style={{ color: t.muted }}>Ahora espanol a hebreo</p>
      </div>
    </div>
  );

  if (done) return (
    <div style={wrap}>
      <div style={{ textAlign: "center", paddingTop: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 48, color: t.gold }}>✦</div>
        <h2 style={{ color: t.text, fontSize: 28, margin: 0 }}>Mazo dominado</h2>
        <p style={{ color: t.muted, margin: 0 }}>{ALL_CARDS.length} cartas en ambas direcciones</p>
        <button onClick={restart} style={{ background: t.gold, border: "none", borderRadius: 10, padding: "12px 32px", color: t.bg, fontSize: 14, cursor: "pointer", fontFamily: fonts.serif, marginTop: 8 }}>
          Volver a empezar
        </button>
      </div>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase" }}>
          {phase === 1 ? "He → Es" : "Es → He"}
        </span>
        <span style={{ fontSize: 13, color: t.muted }}>{mastered}/{ALL_CARDS.length} dominadas</span>
      </div>

      <div style={{ width: "100%", height: 2, background: t.surface, borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", transition: "width 0.5s" }} />
      </div>

      <div style={{ background: t.card, border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border), borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022" }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end" }}>{active.length} restantes</div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase" }}>{phase === 1 ? "¿Que significa?" : "¿Como se dice en hebreo?"}</div>
        <div style={{ fontSize: 36, fontWeight: "bold", color: t.text, textAlign: "center", lineHeight: 1.3, direction: "auto" }}>{question}</div>

        {phase === 1 && current && (
          <button style={{ background: "none", border: "1px solid " + t.border, color: t.muted, fontSize: 12, padding: "4px 14px", borderRadius: 20, cursor: "pointer", fontFamily: fonts.serif }} onClick={() => setShowTr(v => !v)}>
            {showTr ? current.tr : "ver transliteracion"}
          </button>
        )}

        {!feedback ? (
          <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              style={{ flex: 1, background: t.bg, border: "1px solid " + t.border, borderRadius: 10, padding: "12px 16px", color: t.text, fontSize: 16, fontFamily: fonts.serif, outline: "none" }}
              placeholder={phase === 1 ? "escribe en espanol..." : "escribe en hebreo..."}
              dir={phase === 2 ? "rtl" : "ltr"} autoComplete="off" autoCorrect="off" spellCheck="false"
            />
            <button onClick={submit} style={{ background: t.gold, border: "none", borderRadius: 10, padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer" }}>→</button>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 8 }}>
            <div style={{ fontSize: 13, padding: "6px 20px", borderRadius: 20, border: "1px solid", letterSpacing: 1, textTransform: "uppercase", background: feedback === "correct" ? t.correct + "22" : t.wrong + "22", color: feedback === "correct" ? t.correct : t.wrong, borderColor: feedback === "correct" ? t.correct + "55" : t.wrong + "55" }}>
              {feedback === "correct" ? "✓ correcto" : "✗ incorrecto"}
            </div>
            {feedback === "wrong" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center" }}>
                <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase" }}>Respuesta</span>
                <span style={{ fontSize: 24, color: t.text, fontWeight: "bold", direction: "auto" }}>{answer}</span>
                {phase === 1 && <span style={{ fontSize: 13, color: t.muted, fontStyle: "italic" }}>{current.tr}</span>}
              </div>
            )}
            {feedback === "wrong" && <button style={btn()} onClick={next}>Continuar →</button>}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
        {Array.from({ length: MASTERY }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < cardCorrect ? t.gold : t.border, transition: "background 0.3s" }} />
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, justifyContent: "center" }}>
        {[1, 2].map(n => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.muted, opacity: phase === n ? 1 : 0.4 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid " + (phase === n ? t.gold : t.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{n}</div>
            <span>{n === 1 ? "He → Es" : "Es → He"}</span>
            {n === 1 && <div style={{ width: 32, height: 1, background: t.border }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
