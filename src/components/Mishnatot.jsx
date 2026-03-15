import { useState, useEffect, useRef } from "react";
import { fonts } from "../theme";
import { SENTENCES } from "../data/sentences";
import { getProgress } from "../utils/storage";
import { stripNikud } from "../utils/mana";

// ── Hebrew keyboard ───────────────────────────────────────────────────────────
const HE_ROWS = [
  ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
  ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
  ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"],
];

function HebrewKeyboard({ t, onKey, onDelete, onSpace }) {
  const btnStyle = (wide) => ({
    background: t.surface,
    border: "1px solid " + t.border,
    borderRadius: 8,
    padding: wide ? "10px 18px" : "10px 0",
    minWidth: wide ? 60 : 36,
    flex: wide ? "0 0 auto" : 1,
    color: t.text,
    fontSize: 18,
    fontFamily: fonts.serif,
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "manipulation",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
      {HE_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 5, justifyContent: "center" }}>
          {row.map(k => (
            <button key={k} onPointerDown={e => { e.preventDefault(); onKey(k); }} style={btnStyle(false)}>
              {k}
            </button>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
        <button onPointerDown={e => { e.preventDefault(); onDelete(); }} style={btnStyle(true)}>⌫</button>
        <button onPointerDown={e => { e.preventDefault(); onSpace(); }} style={{ ...btnStyle(false), flex: 3, minWidth: 100 }}>
          ␣
        </button>
      </div>
    </div>
  );
}

// ── Answer checking ───────────────────────────────────────────────────────────
function normalize(str) {
  return stripNikud(str).trim().toLowerCase()
    .replace(/[.,!?¿¡]/g, "")
    .replace(/\s+/g, " ");
}

function isCorrect(input, expected) {
  return normalize(input) === normalize(expected);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Mishnatot({ t, onBack }) {
  const p = getProgress();
  const groupsUnlocked = (p.unlockedGroups || [1]).length;

  const available = SENTENCES.filter(s => groupsUnlocked >= s.unlocksAtGroup);

  const [mode, setMode] = useState("es2he"); // "es2he" | "he2es"
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const inputRef = useRef(null);

  useEffect(() => {
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setIdx(0);
    setInput("");
    setResult(null);
  }, [mode]);

  useEffect(() => {
    if (result === null) inputRef.current?.focus();
  }, [idx, result]);

  const sentence = queue[idx];
  const question = sentence ? (mode === "es2he" ? sentence.es : sentence.he) : "";
  const answer   = sentence ? (mode === "es2he" ? sentence.he : sentence.es) : "";
  const hint     = sentence?.tr;

  function handleSubmit() {
    if (!sentence || result !== null) return;
    const ok = isCorrect(input, answer);
    setResult(ok ? "correct" : "wrong");
    setStats(s => ({ ...s, [ok ? "correct" : "wrong"]: s[ok ? "correct" : "wrong"] + 1 }));
  }

  function handleNext() {
    setInput("");
    setResult(null);
    if (idx + 1 >= queue.length) {
      // reshuffle
      setQueue(q => [...q].sort(() => Math.random() - 0.5));
      setIdx(0);
    } else {
      setIdx(i => i + 1);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      if (result !== null) handleNext();
      else handleSubmit();
    }
  }

  function appendChar(ch) {
    setInput(v => v + ch);
    inputRef.current?.focus();
  }

  if (available.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 16px", fontFamily: fonts.ui, textAlign: "center", color: t.text }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <p style={{ color: t.muted }}>Desbloquea más grupos en Peldaños para acceder a las frases.</p>
        <button onClick={onBack} style={{ marginTop: 20, background: t.gold, border: "none", borderRadius: 10, padding: "12px 28px", color: t.bg, fontSize: 14, cursor: "pointer" }}>
          ← Volver
        </button>
      </div>
    );
  }

  const total = stats.correct + stats.wrong;
  const pct = total > 0 ? Math.round(stats.correct / total * 100) : null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 80px", fontFamily: fonts.ui, color: t.text }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { v: "es2he", label: "ES → עב" },
            { v: "he2es", label: "עב → ES" },
          ].map(m => (
            <button
              key={m.v}
              onClick={() => setMode(m.v)}
              style={{
                background: mode === m.v ? t.gold : t.surface,
                color: mode === m.v ? t.bg : t.muted,
                border: "1px solid " + (mode === m.v ? t.gold : t.border),
                borderRadius: 20, padding: "6px 14px", fontSize: 12,
                cursor: "pointer", fontFamily: fonts.ui,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        {pct !== null && (
          <span style={{ fontSize: 12, color: t.gold }}>{pct}% · {total} frases</span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: t.surface, borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: (queue.length > 0 ? (idx / queue.length) * 100 : 0) + "%",
          background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")",
          borderRadius: 2, transition: "width 0.3s",
        }} />
      </div>

      {/* Question card */}
      <div style={{
        background: t.card, border: "1px solid " + t.border,
        borderRadius: 18, padding: "28px 24px", marginBottom: 20,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
          {mode === "es2he" ? "Escribe en hebreo" : "Traduce al español"}
        </div>
        <div style={{
          fontSize: mode === "he2es" ? 28 : 20,
          fontFamily: mode === "he2es" ? fonts.serif : fonts.ui,
          direction: mode === "he2es" ? "rtl" : "ltr",
          color: t.text, lineHeight: 1.4, marginBottom: mode === "he2es" ? 8 : 0,
        }}>
          {question}
        </div>
        {mode === "he2es" && hint && (
          <div style={{ fontSize: 13, color: t.gold, letterSpacing: 0.5 }}>{hint}</div>
        )}
      </div>

      {/* Input */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => result === null && setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          dir={mode === "es2he" ? "rtl" : "ltr"}
          placeholder={mode === "es2he" ? "כתוב כאן..." : "Escribe aquí..."}
          disabled={result !== null}
          style={{
            width: "100%",
            background: result === "correct"
              ? t.correct + "18"
              : result === "wrong"
                ? t.wrong + "18"
                : t.surface,
            border: "2px solid " + (
              result === "correct" ? t.correct :
              result === "wrong"   ? t.wrong   : t.border
            ),
            borderRadius: 12, padding: "14px 16px",
            fontSize: mode === "es2he" ? 22 : 16,
            fontFamily: mode === "es2he" ? fonts.serif : fonts.ui,
            color: t.text, outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
      </div>

      {/* Feedback */}
      {result === "wrong" && (
        <div style={{
          background: t.wrong + "15", border: "1px solid " + t.wrong + "44",
          borderRadius: 10, padding: "12px 16px", marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, color: t.wrong, marginBottom: 4 }}>Respuesta correcta:</div>
          <div style={{
            fontSize: mode === "es2he" ? 22 : 15,
            fontFamily: mode === "es2he" ? fonts.serif : fonts.ui,
            direction: mode === "es2he" ? "rtl" : "ltr",
            color: t.text,
          }}>
            {answer}
          </div>
          {mode === "es2he" && hint && (
            <div style={{ fontSize: 12, color: t.gold, marginTop: 4 }}>{hint}</div>
          )}
        </div>
      )}

      {result === "correct" && (
        <div style={{
          background: t.correct + "15", border: "1px solid " + t.correct + "44",
          borderRadius: 10, padding: "10px 16px", marginBottom: 12,
          fontSize: 13, color: t.correct,
        }}>
          ✓ ¡Correcto!
        </div>
      )}

      {/* Action button */}
      {result === null ? (
        <button
          onClick={handleSubmit}
          disabled={input.trim() === ""}
          style={{
            width: "100%", background: input.trim() ? t.gold : t.surface,
            border: "none", borderRadius: 12, padding: "14px",
            color: input.trim() ? t.bg : t.muted,
            fontSize: 14, cursor: input.trim() ? "pointer" : "default",
            fontFamily: fonts.ui, transition: "background 0.2s",
          }}
        >
          Comprobar →
        </button>
      ) : (
        <button
          onClick={handleNext}
          style={{
            width: "100%", background: t.gold, border: "none",
            borderRadius: 12, padding: "14px", color: t.bg,
            fontSize: 14, cursor: "pointer", fontFamily: fonts.ui,
          }}
        >
          Siguiente →
        </button>
      )}

      {/* Hebrew keyboard — only in ES→HE mode */}
      {mode === "es2he" && result === null && (
        <HebrewKeyboard
          t={t}
          onKey={k => appendChar(k)}
          onDelete={() => setInput(v => v.slice(0, -1))}
          onSpace={() => appendChar(" ")}
        />
      )}
    </div>
  );
}
