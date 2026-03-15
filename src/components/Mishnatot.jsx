import { useState, useEffect, useRef, useCallback } from "react";
import { fonts } from "../theme";
import { SENTENCES } from "../data/sentences";
import { getProgress, saveSentenceCorrect } from "../utils/storage";
import { stripNikud } from "../utils/mana";

// ── TTS ───────────────────────────────────────────────────────────────────────
function useTTS() {
  const synthRef = useRef(null);
  const voiceRef = useRef(null);
  useEffect(() => {
    if (!window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;
    function load() {
      const v = synthRef.current.getVoices();
      voiceRef.current = v.find(x => x.lang === "he-IL") || v.find(x => x.lang.startsWith("he")) || null;
    }
    load();
    synthRef.current.addEventListener("voiceschanged", load);
    return () => synthRef.current?.removeEventListener("voiceschanged", load);
  }, []);
  return useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL"; u.rate = 0.85;
    if (voiceRef.current) u.voice = voiceRef.current;
    synthRef.current.speak(u);
  }, []);
}

// ── Hebrew keyboard ───────────────────────────────────────────────────────────
const HE_ROWS = [
  ["ק","ר","א","ט","ו","ן","ם","פ"],
  ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
  ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"],
];
function HebrewKeyboard({ t, onKey, onDelete, onSpace }) {
  const btn = (wide) => ({
    background: t.card, border: "1px solid " + t.border,
    borderRadius: 7, padding: wide ? "11px 18px" : "11px 0",
    minWidth: wide ? 56 : 34, flex: wide ? "0 0 auto" : 1,
    color: t.text, fontSize: 17, fontFamily: fonts.serif,
    cursor: "pointer", userSelect: "none", WebkitUserSelect: "none",
    touchAction: "manipulation",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 14 }}>
      {HE_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          {row.map(k => (
            <button key={k} onPointerDown={e => { e.preventDefault(); onKey(k); }} style={btn(false)}>{k}</button>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        <button onPointerDown={e => { e.preventDefault(); onDelete(); }} style={btn(true)}>⌫</button>
        <button onPointerDown={e => { e.preventDefault(); onSpace(); }} style={{ ...btn(false), flex: 3, minWidth: 100 }}>␣</button>
      </div>
    </div>
  );
}

// ── Answer checking ───────────────────────────────────────────────────────────
function normalize(str) {
  return stripNikud(str).trim().toLowerCase().replace(/[.,!?¿¡]/g, "").replace(/\s+/g, " ");
}
function isCorrect(a, b) { return normalize(a) === normalize(b); }

const GENDER_LABELS = {
  ms: { label: "m.s.", title: "masculino singular — אַתָּה / הוּא / אֲנִי" },
  fs: { label: "f.s.", title: "femenino singular — אַתְּ / הִיא / אֲנִי" },
  mp: { label: "m.pl.", title: "masculino plural — אֲנַחְנוּ / אַתֶּם / הֵם" },
  fp: { label: "f.pl.", title: "femenino plural — אֲנַחְנוּ / אַתֶּן / הֵן" },
};

// ── Progress mini-bar ─────────────────────────────────────────────────────────
function MiniProgress({ t, current, target, color }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: t.surface, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 2, transition: "width 0.4s" }} />
      </div>
      <span style={{ fontSize: 10, color, minWidth: 28, textAlign: "right" }}>
        {Math.min(current, target)}/{target}
      </span>
    </div>
  );
}

// ── MODE: Comprensión (HE → ES) ───────────────────────────────────────────────
function ModeComprehension({ t, sentences, frasesComp, onBack }) {
  const speak = useTTS();
  const [queue] = useState(() => [...sentences].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const inputRef = useRef(null);

  const sentence = queue[idx];

  // Auto-play TTS on new sentence
  useEffect(() => {
    if (sentence?.he && result === null) {
      const t = setTimeout(() => speak(sentence.he), 400);
      return () => clearTimeout(t);
    }
  }, [idx, sentence]);

  useEffect(() => {
    if (result === null) inputRef.current?.focus();
  }, [idx, result]);

  function handleSubmit() {
    if (!sentence || result !== null || !input.trim()) return;
    const ok = isCorrect(input, sentence.es);
    setResult(ok ? "correct" : "wrong");
    if (ok) {
      saveSentenceCorrect("comp");
      setSessionCorrect(n => n + 1);
    }
  }

  function handleNext() {
    setInput("");
    setResult(null);
    setIdx(i => (i + 1 >= queue.length ? 0 : i + 1));
  }

  function handleKey(e) {
    if (e.key === "Enter") result !== null ? handleNext() : handleSubmit();
  }

  const accent = t.correct;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 24px", fontFamily: fonts.ui, color: t.text }}>

      {/* Mode header */}
      <div style={{
        background: accent + "12", border: "1px solid " + accent + "33",
        borderRadius: 14, padding: "14px 18px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>👁 Comprensión</span>
            <span style={{ fontSize: 11, color: t.muted, marginLeft: 8 }}>Hebreo → Español</span>
          </div>
          {sessionCorrect > 0 && (
            <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>+{sessionCorrect} hoy</span>
          )}
        </div>
        <MiniProgress t={t} current={frasesComp} target={3} color={accent} />
      </div>

      {/* Hebrew card — big and clear */}
      <div style={{
        background: t.card, border: "2px solid " + accent + "33",
        borderRadius: 18, padding: "32px 24px 24px",
        textAlign: "center", marginBottom: 16,
      }}>
        <div style={{
          fontSize: 48, fontFamily: fonts.serif, direction: "rtl",
          color: t.text, lineHeight: 1.3, marginBottom: 10,
        }}>
          {sentence?.he}
        </div>
        <div style={{ fontSize: 14, color: accent, letterSpacing: 0.5, marginBottom: 14 }}>
          {sentence?.tr}
        </div>
        <button
          onClick={() => speak(sentence?.he)}
          style={{
            background: accent + "18", border: "1px solid " + accent + "44",
            borderRadius: 20, padding: "8px 20px",
            color: accent, fontSize: 13, cursor: "pointer",
          }}
        >
          🔊 Escuchar
        </button>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={input}
        onChange={e => result === null && setInput(e.target.value)}
        onKeyDown={handleKey}
        disabled={result !== null}
        placeholder="Escribe la traducción en español..."
        style={{
          width: "100%", boxSizing: "border-box",
          background: result === "correct" ? t.correct + "18" : result === "wrong" ? t.wrong + "18" : t.surface,
          border: "2px solid " + (result === "correct" ? t.correct : result === "wrong" ? t.wrong : t.border),
          borderRadius: 12, padding: "14px 16px", fontSize: 15,
          color: t.text, outline: "none", marginBottom: 10, transition: "border-color 0.2s",
        }}
      />

      {result === "wrong" && (
        <div style={{
          background: t.wrong + "12", border: "1px solid " + t.wrong + "33",
          borderRadius: 10, padding: "10px 14px", marginBottom: 10,
          fontSize: 13, color: t.text,
        }}>
          <span style={{ color: t.wrong, fontSize: 11 }}>Respuesta: </span>{sentence?.es}
        </div>
      )}
      {result === "correct" && (
        <div style={{
          background: t.correct + "12", border: "1px solid " + t.correct + "33",
          borderRadius: 10, padding: "10px 14px", marginBottom: 10,
          fontSize: 13, color: t.correct,
        }}>✓ ¡Correcto!</div>
      )}

      <button
        onClick={result !== null ? handleNext : handleSubmit}
        disabled={result === null && !input.trim()}
        style={{
          width: "100%", border: "none", borderRadius: 12, padding: "14px",
          background: (result !== null || input.trim()) ? accent : t.surface,
          color: (result !== null || input.trim()) ? "#fff" : t.muted,
          fontSize: 14, cursor: (result !== null || input.trim()) ? "pointer" : "default",
          transition: "background 0.2s",
        }}
      >
        {result !== null ? "Siguiente →" : "Comprobar →"}
      </button>
    </div>
  );
}

// ── MODE: Escritura (ES → HE) ─────────────────────────────────────────────────
function ModeWriting({ t, sentences, frasesEsc }) {
  const [queue] = useState(() => [...sentences].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const inputRef = useRef(null);

  const sentence = queue[idx];
  const genderInfo = sentence?.gender ? GENDER_LABELS[sentence.gender] : null;

  useEffect(() => {
    if (result === null) inputRef.current?.focus();
  }, [idx, result]);

  function handleSubmit() {
    if (!sentence || result !== null || !input.trim()) return;
    const ok = isCorrect(input, sentence.he);
    setResult(ok ? "correct" : "wrong");
    if (ok) {
      saveSentenceCorrect("esc");
      setSessionCorrect(n => n + 1);
    }
  }

  function handleNext() {
    setInput("");
    setResult(null);
    setIdx(i => (i + 1 >= queue.length ? 0 : i + 1));
  }

  const accent = t.gold;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 24px", fontFamily: fonts.ui, color: t.text }}>

      {/* Mode header */}
      <div style={{
        background: accent + "12", border: "1px solid " + accent + "33",
        borderRadius: 14, padding: "14px 18px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>✍️ Escritura</span>
            <span style={{ fontSize: 11, color: t.muted, marginLeft: 8 }}>Español → Hebreo</span>
          </div>
          {sessionCorrect > 0 && (
            <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>+{sessionCorrect} hoy</span>
          )}
        </div>
        <MiniProgress t={t} current={frasesEsc} target={3} color={accent} />
      </div>

      {/* Spanish card */}
      <div style={{
        background: t.card, border: "2px solid " + accent + "33",
        borderRadius: 18, padding: "28px 24px 20px",
        textAlign: "center", marginBottom: 16,
      }}>
        {genderInfo && (
          <span title={genderInfo.title} style={{
            display: "inline-block", marginBottom: 10,
            fontSize: 11, padding: "2px 10px", borderRadius: 20,
            background: accent + "22", color: accent,
            border: "1px solid " + accent + "44", cursor: "help",
          }}>
            {genderInfo.label}
          </span>
        )}
        <div style={{ fontSize: 22, color: t.text, lineHeight: 1.4 }}>
          {sentence?.es}
        </div>
      </div>

      {/* Hebrew input */}
      <input
        ref={inputRef}
        value={input}
        onChange={e => result === null && setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") result !== null ? handleNext() : handleSubmit(); }}
        disabled={result !== null}
        dir="rtl"
        placeholder="כתוב כאן..."
        style={{
          width: "100%", boxSizing: "border-box",
          background: result === "correct" ? t.correct + "18" : result === "wrong" ? t.wrong + "18" : t.surface,
          border: "2px solid " + (result === "correct" ? t.correct : result === "wrong" ? t.wrong : accent + "55"),
          borderRadius: 12, padding: "14px 16px",
          fontSize: 24, fontFamily: fonts.serif,
          color: t.text, outline: "none", marginBottom: 10, transition: "border-color 0.2s",
        }}
      />

      {result === "wrong" && (
        <div style={{
          background: t.wrong + "12", border: "1px solid " + t.wrong + "33",
          borderRadius: 10, padding: "12px 16px", marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, color: t.wrong, marginBottom: 4 }}>Respuesta correcta:</div>
          <div style={{ fontSize: 24, fontFamily: fonts.serif, direction: "rtl", color: t.text }}>{sentence?.he}</div>
          <div style={{ fontSize: 12, color: accent, marginTop: 4 }}>{sentence?.tr}</div>
        </div>
      )}
      {result === "correct" && (
        <div style={{
          background: t.correct + "12", border: "1px solid " + t.correct + "33",
          borderRadius: 10, padding: "10px 14px", marginBottom: 10,
          fontSize: 13, color: t.correct,
        }}>✓ ¡Correcto!</div>
      )}

      <button
        onClick={result !== null ? handleNext : handleSubmit}
        disabled={result === null && !input.trim()}
        style={{
          width: "100%", border: "none", borderRadius: 12, padding: "14px",
          background: (result !== null || input.trim()) ? accent : t.surface,
          color: (result !== null || input.trim()) ? t.bg : t.muted,
          fontSize: 14, cursor: (result !== null || input.trim()) ? "pointer" : "default",
          transition: "background 0.2s",
        }}
      >
        {result !== null ? "Siguiente →" : "Comprobar →"}
      </button>

      {/* Hebrew keyboard */}
      {result === null && (
        <HebrewKeyboard
          t={t}
          onKey={k => { setInput(v => v + k); inputRef.current?.focus(); }}
          onDelete={() => setInput(v => v.slice(0, -1))}
          onSpace={() => { setInput(v => v + " "); inputRef.current?.focus(); }}
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Mishnatot({ t, onBack, onNavigate }) {
  const p = getProgress();
  const groupsUnlocked = (p.unlockedGroups || [1]).length;
  const available = SENTENCES.filter(s => groupsUnlocked >= s.unlocksAtGroup);
  const frasesComp = p.frasesComp || 0;
  const frasesEsc  = p.frasesEsc  || 0;

  // Default to comprensión if not done, else escritura, else comprensión
  const [mode, setMode] = useState(() => frasesComp < 3 ? "comp" : "esc");

  if (available.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 16px", fontFamily: fonts.ui, textAlign: "center", color: t.text }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <p style={{ color: t.muted }}>Desbloquea más grupos en Pasos para acceder a las frases.</p>
        <button onClick={onBack} style={{ marginTop: 20, background: t.gold, border: "none", borderRadius: 10, padding: "12px 28px", color: t.bg, fontSize: 14, cursor: "pointer" }}>
          ← Volver
        </button>
      </div>
    );
  }

  const compDone = frasesComp >= 3;
  const escDone  = frasesEsc  >= 3;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 80px", fontFamily: fonts.ui }}>

      {/* Mode selector — two large tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "comp", icon: "👁", title: "Comprensión", sub: "HE → ES", done: compDone, color: t.correct },
          { id: "esc",  icon: "✍️", title: "Escritura",   sub: "ES → HE", done: escDone,  color: t.gold },
        ].map(m => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1, padding: "12px 10px",
                background: isActive ? m.color + "18" : t.surface,
                border: "2px solid " + (isActive ? m.color : t.border),
                borderRadius: 12, cursor: "pointer", textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                {m.done && <span style={{ fontSize: 11, color: t.correct }}>✓</span>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? m.color : t.text, marginTop: 4 }}>{m.title}</div>
              <div style={{ fontSize: 11, color: t.muted }}>{m.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Active mode content */}
      {mode === "comp" && (
        <ModeComprehension t={t} sentences={available} frasesComp={frasesComp} onBack={onBack} />
      )}
      {mode === "esc" && (
        <ModeWriting t={t} sentences={available} frasesEsc={frasesEsc} />
      )}

      {/* Both done banner */}
      {compDone && escDone && (
        <div style={{
          background: t.correct + "15", border: "1px solid " + t.correct + "44",
          borderRadius: 12, padding: "14px 18px", marginTop: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, color: t.correct, fontWeight: 600 }}>✓ Frases completadas</div>
            <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>Ya puedes continuar a Diálogos</div>
          </div>
          <button
            onClick={() => onNavigate?.("dialogos")}
            style={{
              background: t.correct, border: "none", borderRadius: 8,
              padding: "8px 14px", color: "#fff", fontSize: 13, cursor: "pointer",
            }}
          >
            💬 →
          </button>
        </div>
      )}
    </div>
  );
}
