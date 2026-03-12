import { useState, useRef, useEffect } from "react";
import { fonts } from "../theme";
import { LETRAS_BASICAS, NIKUD_COMBOS, PALABRAS_PUENTE } from "../data/alefato";

// Teclado hebreo (mismo que Anki)
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

// ──────────────────────────────────────────────
// Fase A — ver y asociar (letras básicas)
// ──────────────────────────────────────────────
function FaseA({ t, onFinish }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const items = LETRAS_BASICAS;
  const item = items[index];
  const isLast = index === items.length - 1;

  const btnBase = {
    flex: 1, background: t.card, border: "1px solid " + t.border, borderRadius: 10,
    padding: "12px 0", color: t.muted, fontSize: 14, fontFamily: fonts.ui, cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 60px" }}>
      <Progress t={t} current={index + 1} total={items.length} label="Fase A — ver y asociar" />

      <div
        onClick={() => !revealed && setRevealed(true)}
        style={{
          background: t.card, border: "1px solid " + t.border, borderRadius: 16,
          padding: "64px 32px", textAlign: "center", cursor: revealed ? "default" : "pointer",
          minHeight: 240, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
          boxShadow: "0 8px 40px #00000014",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: "bold", direction: "rtl", lineHeight: 1, fontFamily: fonts.serif, color: t.text }}>
          {item.he}
        </div>

        {revealed ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 28, color: t.gold, fontFamily: fonts.ui, letterSpacing: 2 }}>
              {item.tr}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: t.subtle, fontFamily: fonts.ui }}>
            toca para ver el sonido
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={() => { setIndex(i => i - 1); setRevealed(false); }} disabled={index === 0}
          style={{ ...btnBase, opacity: index === 0 ? 0.3 : 1 }}>← anterior</button>
        {!isLast ? (
          <button onClick={() => { setIndex(i => i + 1); setRevealed(false); }}
            style={{ ...btnBase, color: revealed ? t.gold : t.muted, borderColor: revealed ? t.gold + "66" : t.border }}>
            siguiente →
          </button>
        ) : (
          <button onClick={onFinish}
            style={{ ...btnBase, color: t.gold, borderColor: t.gold + "66" }}>
            ✦ continuar
          </button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Fase B — ver sonido, escribir letra
// ──────────────────────────────────────────────
function FaseB({ t, onFinish }) {
  const [items] = useState(() => shuffle(LETRAS_BASICAS));
  const [index, setIndex] = useState(0);
  const [mastered, setMastered] = useState(() => new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null); // null | "correct" | "wrong"
  const [showKb, setShowKb] = useState(true);
  const [lastInput, setLastInput] = useState("");
  const inputRef = useRef(null);

  const active = items.filter((_, i) => !mastered.has(i));
  const current = active[index % Math.max(active.length, 1)];
  const currentOrigIdx = items.indexOf(current);

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);

  useEffect(() => {
    if (active.length === 0 && items.length > 0) onFinish();
  }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const typed = stripNikud(input.trim());
    const expected = stripNikud(current.he);
    const ok = typed === expected;

    if (ok) {
      setFeedback("correct");
      setMastered(prev => new Set([...prev, currentOrigIdx]));
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

  const pct = Math.round((mastered.size / items.length) * 100);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 60px" }}>
      <Progress t={t} current={mastered.size} total={items.length} label="Fase B — escribe la letra" pct={pct} />

      <div style={{
        background: t.card,
        border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border),
        borderRadius: 16, padding: "36px 32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022",
      }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>
          {active.length} restantes
        </div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          ¿cuál es la letra?
        </div>
        <div style={{ fontSize: 40, color: t.gold, fontFamily: fonts.ui, letterSpacing: 4, fontWeight: "bold" }}>
          {current?.tr}
        </div>

        {!feedback ? (
          <>
            <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
              <input
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{
                  flex: 1, background: t.bg, border: "1px solid " + t.border,
                  borderRadius: 10, padding: "12px 16px", color: t.text,
                  fontSize: 28, fontFamily: fonts.serif, outline: "none",
                  direction: "rtl", textAlign: "center",
                }}
                placeholder="א" autoComplete="off" autoCorrect="off" spellCheck="false" dir="rtl"
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
            {feedback === "wrong" && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center",
              }}>
                <div style={{ width: "100%" }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Tu respuesta</span>
                  <div style={{ fontSize: 36, color: t.wrong, fontWeight: "bold", direction: "rtl", marginTop: 4, textDecoration: "line-through", opacity: 0.8, fontFamily: fonts.serif }}>
                    {lastInput || "—"}
                  </div>
                </div>
                <div style={{ width: "100%", borderTop: "1px solid " + t.border, paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Correcto</span>
                  <div style={{ fontSize: 64, color: t.text, fontWeight: "bold", direction: "rtl", marginTop: 4, fontFamily: fonts.serif }}>
                    {current?.he}
                  </div>
                </div>
              </div>
            )}
            {feedback === "wrong" && (
              <button style={{
                background: "none", border: "1px solid " + t.border, borderRadius: 20,
                padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
              }} onClick={next}>Continuar</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Fase C — letra+nikud → transliteración
// ──────────────────────────────────────────────
function FaseC({ t, onFinish }) {
  const [items] = useState(() => shuffle(NIKUD_COMBOS));
  const [index, setIndex] = useState(0);
  const [mastered, setMastered] = useState(() => new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [lastInput, setLastInput] = useState("");
  const inputRef = useRef(null);

  const active = items.filter((_, i) => !mastered.has(i));
  const current = active[index % Math.max(active.length, 1)];
  const currentOrigIdx = items.indexOf(current);

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);
  useEffect(() => { if (active.length === 0 && items.length > 0) onFinish(); }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const ok = norm(input) === norm(current.tr) || (current.tr === "" && input.trim() === "");

    if (ok) {
      setFeedback("correct");
      setMastered(prev => new Set([...prev, currentOrigIdx]));
      setTimeout(() => { setFeedback(null); setInput(""); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
    }
  }

  function next() { setFeedback(null); setInput(""); setIndex(i => i + 1); }

  const pct = Math.round((mastered.size / items.length) * 100);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 60px" }}>
      <Progress t={t} current={mastered.size} total={items.length} label="Fase C — letra + nikud" pct={pct} />

      <div style={{
        background: t.card,
        border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border),
        borderRadius: 16, padding: "36px 32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022",
      }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>
          {active.length} restantes
        </div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          ¿cómo suena?
        </div>
        <div style={{ fontSize: 80, fontWeight: "bold", direction: "rtl", lineHeight: 1.2, fontFamily: fonts.serif, color: t.text }}>
          {current?.he}
        </div>
        {current?.nota && (
          <div style={{ fontSize: 11, color: t.subtle, fontFamily: fonts.ui }}>{current.nota}</div>
        )}

        {!feedback ? (
          <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
            <input
              ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                flex: 1, background: t.bg, border: "1px solid " + t.border,
                borderRadius: 10, padding: "12px 16px", color: t.text,
                fontSize: 18, fontFamily: fonts.ui, outline: "none",
              }}
              placeholder={current?.tr === "" ? "shva — escribe nada y pulsa →" : "escribe la transliteración..."}
              autoComplete="off" autoCorrect="off" spellCheck="false"
            />
            <button onClick={submit} style={{
              background: t.gold, border: "none", borderRadius: 10,
              padding: "12px 18px", color: t.bg, fontSize: 18, fontWeight: "bold", cursor: "pointer",
            }}>→</button>
          </div>
        ) : (
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
            {feedback === "wrong" && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center",
              }}>
                <div style={{ width: "100%" }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Tu respuesta</span>
                  <div style={{ fontSize: 22, color: t.wrong, fontWeight: "bold", marginTop: 4, textDecoration: "line-through", opacity: 0.8, fontFamily: fonts.ui }}>
                    {lastInput || "—"}
                  </div>
                </div>
                <div style={{ width: "100%", borderTop: "1px solid " + t.border, paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Correcto</span>
                  <div style={{ fontSize: 28, color: t.gold, fontWeight: "bold", marginTop: 4, fontFamily: fonts.ui, letterSpacing: 2 }}>
                    {current?.tr || "(shva mudo)"}
                  </div>
                </div>
              </div>
            )}
            {feedback === "wrong" && (
              <button style={{
                background: "none", border: "1px solid " + t.border, borderRadius: 20,
                padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
              }} onClick={next}>Continuar</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Fase D — palabras puente
// ──────────────────────────────────────────────
function FaseD({ t, onFinish }) {
  const [items] = useState(() => shuffle(PALABRAS_PUENTE));
  const [index, setIndex] = useState(0);
  const [mastered, setMastered] = useState(() => new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [lastInput, setLastInput] = useState("");
  const inputRef = useRef(null);

  const active = items.filter((_, i) => !mastered.has(i));
  const current = active[index % Math.max(active.length, 1)];
  const currentOrigIdx = items.indexOf(current);

  useEffect(() => { if (!feedback) inputRef.current?.focus(); }, [feedback, index]);
  useEffect(() => { if (active.length === 0 && items.length > 0) onFinish(); }, [active.length]);

  function submit() {
    if (!current || feedback) return;
    setLastInput(input);
    const ok = norm(input) === norm(current.tr);

    if (ok) {
      setFeedback("correct");
      setMastered(prev => new Set([...prev, currentOrigIdx]));
      setTimeout(() => { setFeedback(null); setInput(""); setIndex(i => i + 1); }, 900);
    } else {
      setFeedback("wrong");
    }
  }

  function next() { setFeedback(null); setInput(""); setIndex(i => i + 1); }

  const pct = Math.round((mastered.size / items.length) * 100);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 60px" }}>
      <Progress t={t} current={mastered.size} total={items.length} label="Fase D — primeras palabras" pct={pct} />

      <div style={{
        background: t.card,
        border: "1px solid " + (feedback === "correct" ? t.correct : feedback === "wrong" ? t.wrong : t.border),
        borderRadius: 16, padding: "36px 32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        transition: "border-color 0.3s", boxShadow: "0 8px 40px #00000022",
      }}>
        <div style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-end", fontFamily: fonts.ui }}>
          {active.length} restantes
        </div>
        <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          ¿cómo se lee?
        </div>
        <div style={{ fontSize: 56, fontWeight: "bold", direction: "rtl", lineHeight: 1.3, fontFamily: fonts.serif, color: t.text }}>
          {current?.he}
        </div>
        <div style={{ fontSize: 14, color: t.muted, fontFamily: fonts.ui }}>
          {current?.es}
        </div>

        {!feedback ? (
          <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
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
            {feedback === "correct" && (
              <div style={{ fontSize: 16, color: t.gold, fontFamily: fonts.ui, letterSpacing: 2 }}>
                {current?.tr}
              </div>
            )}
            {feedback === "wrong" && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                padding: "16px 24px", background: t.bg, borderRadius: 10, width: "100%", textAlign: "center",
              }}>
                <div style={{ width: "100%" }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Tu respuesta</span>
                  <div style={{ fontSize: 22, color: t.wrong, fontWeight: "bold", marginTop: 4, textDecoration: "line-through", opacity: 0.8, fontFamily: fonts.ui }}>
                    {lastInput || "—"}
                  </div>
                </div>
                <div style={{ width: "100%", borderTop: "1px solid " + t.border, paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>Correcto</span>
                  <div style={{ fontSize: 28, color: t.gold, fontWeight: "bold", marginTop: 4, fontFamily: fonts.ui, letterSpacing: 2 }}>
                    {current?.tr}
                  </div>
                </div>
              </div>
            )}
            {feedback === "wrong" && (
              <button style={{
                background: "none", border: "1px solid " + t.border, borderRadius: 20,
                padding: "6px 20px", color: t.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
              }} onClick={next}>Continuar</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Barra de progreso reutilizable
// ──────────────────────────────────────────────
function Progress({ t, current, total, label, pct }) {
  const p = pct !== undefined ? pct : Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>{label}</span>
        <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{current}/{total}</span>
      </div>
      <div style={{ width: "100%", height: 4, background: t.surface, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: p + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 2, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Pantalla de introducción por fase
// ──────────────────────────────────────────────
function Intro({ t, fase, onStart }) {
  const info = {
    A: {
      title: "Fase A — Ver y asociar",
      desc: "Verás cada letra con su sonido en transliteración. No tienes que escribir nada, solo familiarizarte.",
      items: LETRAS_BASICAS.length + " letras",
    },
    B: {
      title: "Fase B — Escribe la letra",
      desc: "Verás el sonido y tendrás que escribir la letra hebrea correspondiente con el teclado.",
      items: LETRAS_BASICAS.length + " letras",
    },
    C: {
      title: "Fase C — Letra + nikud",
      desc: "Verás una letra con vocales (nikud) y escribirás cómo suena en transliteración.",
      items: NIKUD_COMBOS.length + " combinaciones",
    },
    D: {
      title: "Fase D — Primeras palabras",
      desc: "Palabras reales con nikud completo. Escribe cómo suena cada una. ¡Ya puedes leer hebreo!",
      items: PALABRAS_PUENTE.length + " palabras",
    },
  }[fase];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 48, color: t.gold, marginBottom: 16 }}>✦</div>
      <h2 style={{ fontSize: 22, color: t.text, fontFamily: fonts.serif, margin: "0 0 12px" }}>{info.title}</h2>
      <p style={{ fontSize: 15, color: t.muted, fontFamily: fonts.ui, lineHeight: 1.6, margin: "0 0 8px" }}>{info.desc}</p>
      <p style={{ fontSize: 12, color: t.subtle, fontFamily: fonts.ui, marginBottom: 32 }}>{info.items}</p>
      <button onClick={onStart} style={{
        background: t.gold, border: "none", borderRadius: 12,
        padding: "14px 40px", color: t.bg, fontSize: 15, fontWeight: "bold",
        cursor: "pointer", fontFamily: fonts.ui,
      }}>
        Empezar →
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Pantalla de fin
// ──────────────────────────────────────────────
function Done({ t, onBack }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 64, color: t.gold }}>★</div>
      <h2 style={{ fontSize: 28, color: t.text, fontFamily: fonts.serif, margin: 0 }}>Alefato completado</h2>
      <p style={{ color: t.muted, fontFamily: fonts.ui, margin: 0, lineHeight: 1.6, maxWidth: 320 }}>
        Ya puedes leer hebreo con nikud. Ahora empieza con las palabras del Núcleo.
      </p>
      <button onClick={onBack} style={{
        background: t.gold, border: "none", borderRadius: 10,
        padding: "12px 32px", color: t.bg, fontSize: 14,
        cursor: "pointer", fontFamily: fonts.ui, marginTop: 8,
      }}>
        Ir al Núcleo →
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
const FASES = ["A", "B", "C", "D"];

export default function Elemental({ t, onBack }) {
  // step: "intro-A" | "A" | "intro-B" | "B" | "intro-C" | "C" | "intro-D" | "D" | "done"
  const [step, setStep] = useState("intro-A");

  function finishFase(fase) {
    const next = FASES[FASES.indexOf(fase) + 1];
    if (next) setStep("intro-" + next);
    else setStep("done");
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: fonts.serif, color: t.text }}>
      {/* Header */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, paddingBottom: 8 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>
          ← volver
        </button>
        <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          Nivel Elemental
        </span>
        {/* Indicador de fase */}
        <div style={{ display: "flex", gap: 4 }}>
          {FASES.map(f => {
            const done = FASES.indexOf(f) < FASES.indexOf(step.replace("intro-", "")) || step === "done";
            const active = step === f || step === "intro-" + f;
            return (
              <div key={f} style={{
                width: 20, height: 4, borderRadius: 2,
                background: done ? t.gold : active ? t.gold + "88" : t.border,
                transition: "background 0.3s",
              }} />
            );
          })}
        </div>
      </div>

      {step === "intro-A" && <Intro t={t} fase="A" onStart={() => setStep("A")} />}
      {step === "A"       && <FaseA t={t} onFinish={() => finishFase("A")} />}
      {step === "intro-B" && <Intro t={t} fase="B" onStart={() => setStep("B")} />}
      {step === "B"       && <FaseB t={t} onFinish={() => finishFase("B")} />}
      {step === "intro-C" && <Intro t={t} fase="C" onStart={() => setStep("C")} />}
      {step === "C"       && <FaseC t={t} onFinish={() => finishFase("C")} />}
      {step === "intro-D" && <Intro t={t} fase="D" onStart={() => setStep("D")} />}
      {step === "D"       && <FaseD t={t} onFinish={() => finishFase("D")} />}
      {step === "done"    && <Done t={t} onBack={onBack} />}
    </div>
  );
}
