import { useState, useRef, useEffect } from "react";
import { fonts } from "../theme";
import { BLOQUES_ALEFATO } from "../data/alefato";
import { getProgress, markElementalDone, isElementalUnlocked } from "../utils/storage";

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

function stripNikud(str) {
  return str.replace(/[\u05B0-\u05C7]/g, "").trim();
}

function norm(str) {
  return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ── Shared: progress bar ────────────────────────────────────────────────────
function Bar({ t, current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{label}</span>
        <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{current}/{total}</span>
      </div>
      <div style={{ width: "100%", height: 4, background: t.surface, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 2, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// ── Shared: feedback card ───────────────────────────────────────────────────
function FeedbackBlock({ t, feedback, lastInput, correct, onNext, showCorrectAlways }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 8 }}>
      <div style={{
        fontSize: 13, padding: "6px 20px", borderRadius: 20, border: "1px solid",
        letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui,
        background: feedback === "correct" ? t.correct + "22" : t.wrong + "22",
        color: feedback === "correct" ? t.correct : t.wrong,
        borderColor: feedback === "correct" ? t.correct + "55" : t.wrong + "55",
      }}>
        {feedback === "correct" ? "correcto" : "incorrecto"}
      </div>
      {(feedback === "wrong" || showCorrectAlways) && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center",
        }}>
          {feedback === "wrong" && (
            <div style={{ width: "100%" }}>
              <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Tu respuesta</span>
              <div style={{ fontSize: 22, color: t.wrong, fontWeight: "bold", marginTop: 4, textDecoration: "line-through", opacity: 0.8, fontFamily: fonts.ui }}>
                {lastInput || "—"}
              </div>
            </div>
          )}
          <div style={{ width: "100%", borderTop: feedback === "wrong" ? "1px solid " + t.border : "none", paddingTop: feedback === "wrong" ? 12 : 0 }}>
            {feedback === "wrong" && <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Correcto</span>}
            {correct}
          </div>
        </div>
      )}
      {feedback === "wrong" && (
        <button style={{
          background: "none", border: "1px solid " + t.border, borderRadius: 20,
          padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
        }} onClick={onNext}>Continuar</button>
      )}
    </div>
  );
}

// ── Fase A — ver y asociar ──────────────────────────────────────────────────
function FaseA({ t, items, onFinish }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = items[index];
  const isLast = index === items.length - 1;

  const btn = {
    flex: 1, background: t.card, border: "1px solid " + t.border, borderRadius: 10,
    padding: "12px 0", color: t.muted, fontSize: 14, fontFamily: fonts.ui, cursor: "pointer",
  };

  return (
    <div>
      <Bar t={t} current={index + 1} total={items.length} label="ver y asociar" />
      <div
        onClick={() => !revealed && setRevealed(true)}
        style={{
          background: t.card, border: "1px solid " + t.border, borderRadius: 16,
          padding: "60px 32px", textAlign: "center", cursor: revealed ? "default" : "pointer",
          minHeight: 220, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 20,
          boxShadow: "0 8px 40px #00000014",
        }}
      >
        <div style={{ fontSize: 108, fontWeight: "bold", direction: "rtl", lineHeight: 1, fontFamily: fonts.serif, color: t.text }}>
          {item.he}
        </div>
        {revealed ? (
          <div style={{ fontSize: 30, color: t.gold, fontFamily: fonts.ui, letterSpacing: 3 }}>
            {item.tr}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: t.subtle, fontFamily: fonts.ui }}>toca para ver el sonido</div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={() => { setIndex(i => i - 1); setRevealed(false); }} disabled={index === 0}
          style={{ ...btn, opacity: index === 0 ? 0.3 : 1 }}>← anterior</button>
        {!isLast ? (
          <button onClick={() => { setIndex(i => i + 1); setRevealed(false); }}
            style={{ ...btn, color: revealed ? t.gold : t.muted, borderColor: revealed ? t.gold + "66" : t.border }}>
            siguiente →
          </button>
        ) : (
          <button onClick={onFinish} style={{ ...btn, color: t.gold, borderColor: t.gold + "66" }}>
            ✦ practicar →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Fase B — ver sonido, escribir letra ────────────────────────────────────
function FaseB({ t, items, onFinish }) {
  const [queue, setQueue] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [lastInput, setLastInput] = useState("");
  const [showKb, setShowKb] = useState(true);
  const inputRef = useRef(null);

  const active = queue.filter((_, i) => !done.has(i));
  const current = active[index % Math.max(active.length, 1)];
  const origIdx = queue.indexOf(current);

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);
  useEffect(() => { if (active.length === 0 && queue.length > 0) onFinish(); }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const ok = stripNikud(input.trim()) === stripNikud(current.he);
    if (ok) {
      setFeedback("correct");
      setDone(prev => new Set([...prev, origIdx]));
      setTimeout(() => { setFeedback(null); setInput(""); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
    }
  }

  function kbType(char) { setInput(v => v + char); inputRef.current?.focus(); }
  function kbBackspace() { setInput(v => [...v].slice(0, -1).join("")); }
  function next() { setFeedback(null); setInput(""); setIndex(i => i + 1); }

  const keyStyle = {
    background: t.surface, border: "1px solid " + t.border, borderRadius: 6,
    color: t.text, fontSize: 16, fontFamily: fonts.serif,
    cursor: "pointer", width: 32, height: 36,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
  };

  return (
    <div>
      <Bar t={t} current={done.size} total={queue.length} label="escribe la letra" />
      <div style={{
        background: t.card,
        border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border),
        borderRadius: 16, padding: "32px 28px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022",
      }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>
          {active.length} restantes
        </div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          ¿cuál es la letra?
        </div>
        <div style={{ fontSize: 44, color: t.gold, fontFamily: fonts.ui, letterSpacing: 4, fontWeight: "bold" }}>
          {current?.tr}
        </div>

        {!feedback ? (
          <>
            <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 4 }}>
              <input
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{
                  flex: 1, background: t.bg, border: "1px solid " + t.border,
                  borderRadius: 10, padding: "12px 16px", color: t.text,
                  fontSize: 32, fontFamily: fonts.serif, outline: "none",
                  direction: "rtl", textAlign: "center",
                }}
                autoComplete="off" autoCorrect="off" spellCheck="false" dir="rtl"
              />
              <button onClick={submit} style={{
                background: t.gold, border: "none", borderRadius: 10,
                padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer",
              }}>→</button>
            </div>

            <button onClick={() => setShowKb(v => !v)} style={{
              alignSelf: "flex-end", background: "none", border: "none",
              color: showKb ? t.gold : t.subtle, fontSize: 12, cursor: "pointer",
              fontFamily: fonts.ui, padding: "2px 0",
            }}>
              {showKb ? "⌨ ocultar teclado" : "⌨ teclado hebreo"}
            </button>

            {showKb && (
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
          <FeedbackBlock t={t} feedback={feedback} lastInput={lastInput} onNext={next}
            correct={
              <div style={{ fontSize: 80, color: t.text, fontWeight: "bold", direction: "rtl", marginTop: 4, fontFamily: fonts.serif }}>
                {current?.he}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

// ── Fase C — letra+nikud → transliteración ─────────────────────────────────
function FaseC({ t, items, onFinish }) {
  const [queue] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [lastInput, setLastInput] = useState("");
  const inputRef = useRef(null);

  const active = queue.filter((_, i) => !done.has(i));
  const current = active[index % Math.max(active.length, 1)];
  const origIdx = queue.indexOf(current);

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);
  useEffect(() => { if (active.length === 0 && queue.length > 0) onFinish(); }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const ok = norm(input) === norm(current.tr) || (current.tr === "" && input.trim() === "");
    if (ok) {
      setFeedback("correct");
      setDone(prev => new Set([...prev, origIdx]));
      setTimeout(() => { setFeedback(null); setInput(""); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
    }
  }

  function next() { setFeedback(null); setInput(""); setIndex(i => i + 1); }

  return (
    <div>
      <Bar t={t} current={done.size} total={queue.length} label="¿cómo suena?" />
      <div style={{
        background: t.card,
        border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border),
        borderRadius: 16, padding: "32px 28px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022",
      }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>
          {active.length} restantes
        </div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          ¿cómo suena?
        </div>
        <div style={{ fontSize: 88, fontWeight: "bold", direction: "rtl", lineHeight: 1.2, fontFamily: fonts.serif, color: t.text }}>
          {current?.he}
        </div>
        {current?.nota && (
          <div style={{ fontSize: 11, color: t.subtle, fontFamily: fonts.ui }}>{current.nota}</div>
        )}

        {!feedback ? (
          <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 4 }}>
            <input
              ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                flex: 1, background: t.bg, border: "1px solid " + t.border,
                borderRadius: 10, padding: "12px 16px", color: t.text,
                fontSize: 18, fontFamily: fonts.ui, outline: "none",
              }}
              placeholder={current?.tr === "" ? "shva mudo — pulsa → sin escribir" : "escribe la transliteración..."}
              autoComplete="off" autoCorrect="off" spellCheck="false"
            />
            <button onClick={submit} style={{
              background: t.gold, border: "none", borderRadius: 10,
              padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer",
            }}>→</button>
          </div>
        ) : (
          <FeedbackBlock t={t} feedback={feedback} lastInput={lastInput} onNext={next}
            correct={
              <div style={{ fontSize: 32, color: t.gold, fontWeight: "bold", marginTop: 4, fontFamily: fonts.ui, letterSpacing: 2 }}>
                {current?.tr || "(mudo)"}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

// ── Fase D — palabras puente ────────────────────────────────────────────────
function FaseD({ t, items, onFinish }) {
  const [queue] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [lastInput, setLastInput] = useState("");
  const inputRef = useRef(null);

  const active = queue.filter((_, i) => !done.has(i));
  const current = active[index % Math.max(active.length, 1)];
  const origIdx = queue.indexOf(current);

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);
  useEffect(() => { if (active.length === 0 && queue.length > 0) onFinish(); }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const ok = norm(input) === norm(current.tr);
    if (ok) {
      setFeedback("correct");
      setDone(prev => new Set([...prev, origIdx]));
      setTimeout(() => { setFeedback(null); setInput(""); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
    }
  }

  function next() { setFeedback(null); setInput(""); setIndex(i => i + 1); }

  return (
    <div>
      <Bar t={t} current={done.size} total={queue.length} label="¿cómo se lee?" />
      <div style={{
        background: t.card,
        border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border),
        borderRadius: 16, padding: "32px 28px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022",
      }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>
          {active.length} restantes
        </div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          ¿cómo se lee?
        </div>
        <div style={{ fontSize: 52, fontWeight: "bold", direction: "rtl", lineHeight: 1.3, fontFamily: fonts.serif, color: t.text }}>
          {current?.he}
        </div>
        <div style={{ fontSize: 14, color: t.muted, fontFamily: fonts.ui }}>{current?.es}</div>

        {!feedback ? (
          <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 4 }}>
            <input
              ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                flex: 1, background: t.bg, border: "1px solid " + t.border,
                borderRadius: 10, padding: "12px 16px", color: t.text,
                fontSize: 18, fontFamily: fonts.ui, outline: "none",
              }}
              placeholder="escribe cómo suena..." autoComplete="off" autoCorrect="off" spellCheck="false"
            />
            <button onClick={submit} style={{
              background: t.gold, border: "none", borderRadius: 10,
              padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer",
            }}>→</button>
          </div>
        ) : (
          <FeedbackBlock t={t} feedback={feedback} lastInput={lastInput} onNext={next}
            showCorrectAlways
            correct={
              <div style={{ fontSize: 28, color: t.gold, fontWeight: "bold", marginTop: 4, fontFamily: fonts.ui, letterSpacing: 2 }}>
                {current?.tr}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

// ── Práctica de un bloque (A+B, C, o D) ────────────────────────────────────
function BloqueSession({ t, bloque, onDone, onBack }) {
  // letras: step "A" → "B" → done
  // nikud / palabras: step "main" → done
  const initStep = bloque.type === "letras" ? "A" : "main";
  const [step, setStep] = useState(initStep);

  if (bloque.type === "letras") {
    if (step === "A") return (
      <FaseA t={t} items={bloque.items} onFinish={() => setStep("B")} />
    );
    if (step === "B") return (
      <FaseB t={t} items={bloque.items} onFinish={onDone} />
    );
  }

  if (bloque.type === "nikud") return (
    <FaseC t={t} items={bloque.items} onFinish={onDone} />
  );

  if (bloque.type === "palabras") return (
    <FaseD t={t} items={bloque.items} onFinish={onDone} />
  );

  return null;
}

// ── Menú principal de bloques ───────────────────────────────────────────────
function Menu({ t, onSelect, elementalDone }) {
  return (
    <div>
      <div style={{ marginBottom: 20, fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>
        Completa cada bloque para desbloquear el siguiente.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BLOQUES_ALEFATO.map(b => {
          const done = !!elementalDone[b.id];
          const unlocked = isElementalUnlocked(b, elementalDone);
          const locked = !unlocked;
          return (
            <div
              key={b.id}
              onClick={() => !locked && onSelect(b)}
              style={{
                background: t.card, borderRadius: 12, padding: "14px 18px",
                border: "1px solid " + (done ? t.gold : t.border),
                cursor: locked ? "not-allowed" : "pointer",
                opacity: locked ? 0.35 : 1,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => { if (!locked) e.currentTarget.style.borderColor = t.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = done ? t.gold : t.border; }}
            >
              <div>
                <div style={{ fontSize: 14, color: t.text, fontWeight: done ? "bold" : "normal" }}>{b.label}</div>
                <div style={{ fontSize: 12, color: t.muted, marginTop: 3, direction: "rtl", fontFamily: fonts.serif }}>{b.sub}</div>
              </div>
              <div style={{ fontSize: 16, color: done ? t.gold : locked ? t.subtle : t.muted, flexShrink: 0, marginLeft: 12 }}>
                {done ? "✦" : locked ? "⊗" : "→"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Done screen ─────────────────────────────────────────────────────────────
function BloqueComplete({ t, bloque, onBack }) {
  const allDone = BLOQUES_ALEFATO.every(b => {
    const p = getProgress();
    return !!p.elementalDone[b.id];
  });

  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 40 }}>
      <div style={{ fontSize: 56, color: t.gold }}>{allDone ? "★" : "✦"}</div>
      <h2 style={{ fontSize: 24, color: t.text, fontFamily: fonts.serif, margin: 0 }}>{bloque.label} completado</h2>
      {allDone && (
        <p style={{ color: t.muted, fontFamily: fonts.ui, margin: 0, lineHeight: 1.6, maxWidth: 280 }}>
          Alefato completo. Ya puedes pasar al Núcleo.
        </p>
      )}
      <button onClick={onBack} style={{
        background: t.gold, border: "none", borderRadius: 10,
        padding: "12px 32px", color: t.bg, fontSize: 14,
        cursor: "pointer", fontFamily: fonts.ui, marginTop: 8,
      }}>
        {allDone ? "Ir al Núcleo →" : "← volver"}
      </button>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────────────────────
export default function Elemental({ t, onBack }) {
  const [activeBloque, setActiveBloque] = useState(null);
  const [justDone, setJustDone] = useState(null);
  const [progress, setProgress] = useState(() => getProgress());

  function handleDone() {
    markElementalDone(activeBloque.id);
    setJustDone(activeBloque);
    setActiveBloque(null);
    setProgress(getProgress());
  }

  function handleBack() {
    setActiveBloque(null);
    setJustDone(null);
  }

  const doneCount = BLOQUES_ALEFATO.filter(b => progress.elementalDone[b.id]).length;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: fonts.serif, color: t.text }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <button onClick={activeBloque ? () => setActiveBloque(null) : onBack}
            style={{ background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>
            ← volver
          </button>
          <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
            Nivel Elemental
          </span>
          <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{doneCount}/{BLOQUES_ALEFATO.length}</span>
        </div>

        {/* Contenido */}
        {justDone && !activeBloque ? (
          <BloqueComplete t={t} bloque={justDone} onBack={handleBack} />
        ) : activeBloque ? (
          <BloqueSession t={t} bloque={activeBloque} onDone={handleDone} onBack={handleBack} />
        ) : (
          <Menu t={t} onSelect={setActiveBloque} elementalDone={progress.elementalDone} />
        )}
      </div>
    </div>
  );
}
