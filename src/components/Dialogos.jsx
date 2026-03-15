import { useState, useEffect, useRef, useCallback } from "react";
import { fonts } from "../theme";
import { DIALOGUES } from "../data/dialogues";
import { getProgress, saveDialogueProgress } from "../utils/storage";

// ── TTS ──────────────────────────────────────────────────────────────────────
function useTTS() {
  const synthRef = useRef(null);
  const voiceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;
    function loadVoices() {
      const voices = synthRef.current.getVoices();
      voiceRef.current =
        voices.find(v => v.lang === "he-IL") ||
        voices.find(v => v.lang.startsWith("he")) ||
        null;
    }
    loadVoices();
    synthRef.current.addEventListener("voiceschanged", loadVoices);
    return () => synthRef.current?.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!synthRef.current) { onEnd?.(); return; }
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL";
    u.rate = 0.85;
    if (voiceRef.current) u.voice = voiceRef.current;
    if (onEnd) u.onend = onEnd;
    synthRef.current.speak(u);
  }, []);

  const cancel = useCallback(() => {
    synthRef.current?.cancel();
  }, []);

  return { speak, cancel };
}

// ── Phase 1 — Read mode ──────────────────────────────────────────────────────
function Phase1({ t, dialogue, onAdvance, tts }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 16, fontFamily: fonts.ui }}>
        Fase 1 — Lee el diálogo y escucha cada línea
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {dialogue.lines.map((line, i) => (
          <div key={i} style={{
            background: t.card,
            border: "1px solid " + t.border,
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: line.speaker === "א" ? t.gold + "22" : t.surface,
              border: "1px solid " + (line.speaker === "א" ? t.gold + "66" : t.border),
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontFamily: fonts.serif, fontSize: 13, color: t.gold,
            }}>
              {line.speaker}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 18, fontFamily: fonts.serif,
                direction: "rtl", color: t.text, lineHeight: 1.5, marginBottom: 4,
              }}>
                {line.he}
              </div>
              <div style={{ fontSize: 12, color: t.gold, marginBottom: 3 }}>{line.tr}</div>
              <div style={{ fontSize: 12, color: t.muted }}>{line.es}</div>
            </div>
            <button
              onClick={() => tts.speak(line.he)}
              style={{
                background: "none", border: "none",
                color: t.muted, cursor: "pointer", fontSize: 16,
                flexShrink: 0, padding: "4px",
              }}
              title="Escuchar"
            >
              🔊
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAdvance}
        style={{
          width: "100%", background: t.gold, border: "none",
          borderRadius: 10, padding: "14px", color: t.bg,
          fontSize: 14, cursor: "pointer", fontFamily: fonts.ui,
        }}
      >
        Entendido — Siguiente fase →
      </button>
    </div>
  );
}

// ── Phase 2 — Listen mode ────────────────────────────────────────────────────
function Phase2({ t, dialogue, onAdvance, tts }) {
  const [revealed, setRevealed] = useState([]);

  function revealLine(i) {
    setRevealed(prev => prev.includes(i) ? prev : [...prev, i]);
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 16, fontFamily: fonts.ui }}>
        Fase 2 — Solo audio. Pulsa para revelar cada línea.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {dialogue.lines.map((line, i) => (
          <div key={i} style={{
            background: t.card,
            border: "1px solid " + t.border,
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: line.speaker === "א" ? t.gold + "22" : t.surface,
              border: "1px solid " + (line.speaker === "א" ? t.gold + "66" : t.border),
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontFamily: fonts.serif, fontSize: 13, color: t.gold,
            }}>
              {line.speaker}
            </div>
            <div style={{ flex: 1 }}>
              {revealed.includes(i) ? (
                <>
                  <div style={{
                    fontSize: 18, fontFamily: fonts.serif,
                    direction: "rtl", color: t.text, lineHeight: 1.5, marginBottom: 4,
                  }}>
                    {line.he}
                  </div>
                  <div style={{ fontSize: 12, color: t.gold, marginBottom: 3 }}>{line.tr}</div>
                  <div style={{ fontSize: 12, color: t.muted }}>{line.es}</div>
                </>
              ) : (
                <button
                  onClick={() => revealLine(i)}
                  style={{
                    background: t.surface, border: "1px dashed " + t.border,
                    borderRadius: 8, padding: "8px 14px",
                    color: t.subtle, fontSize: 12, cursor: "pointer",
                    fontFamily: fonts.ui,
                  }}
                >
                  Mostrar texto
                </button>
              )}
            </div>
            <button
              onClick={() => { tts.speak(line.he); revealLine(i); }}
              style={{
                background: "none", border: "none",
                color: t.muted, cursor: "pointer", fontSize: 16,
                flexShrink: 0, padding: "4px",
              }}
              title="Escuchar"
            >
              🔊
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAdvance}
        style={{
          width: "100%", background: t.gold, border: "none",
          borderRadius: 10, padding: "14px", color: t.bg,
          fontSize: 14, cursor: "pointer", fontFamily: fonts.ui,
        }}
      >
        Siguiente fase →
      </button>
    </div>
  );
}

// ── Phase 3 — Quiz mode ──────────────────────────────────────────────────────
function Phase3({ t, dialogue, onComplete, tts }) {
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);
  const [quizIndex, setQuizIndex] = useState(null);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  function playDialogue() {
    tts.cancel();
    setPlaying(true);
    setPlayIndex(0);
    playLine(0);
  }

  function playLine(i) {
    if (i >= dialogue.lines.length) {
      setPlaying(false);
      setPlayIndex(-1);
      setQuizIndex(0);
      return;
    }
    setPlayIndex(i);
    tts.speak(dialogue.lines[i].he, () => {
      timerRef.current = setTimeout(() => playLine(i + 1), 1200);
    });
  }

  useEffect(() => {
    return () => {
      tts.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleAnswer(qIdx, optIdx) {
    if (answers[qIdx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleNext() {
    if (quizIndex + 1 < dialogue.questions.length) {
      setQuizIndex(i => i + 1);
    } else {
      setDone(true);
    }
  }

  // Done screen
  if (done) {
    const correct = dialogue.questions.filter((q, i) => answers[i] === q.answer).length;
    return (
      <div style={{ textAlign: "center", paddingTop: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {correct === dialogue.questions.length ? "⭐" : "✦"}
        </div>
        <h3 style={{ fontSize: 18, color: t.text, fontFamily: fonts.serif, margin: "0 0 8px" }}>
          Diálogo completado
        </h3>
        <p style={{ color: t.muted, fontSize: 13, marginBottom: 24 }}>
          {correct} / {dialogue.questions.length} preguntas correctas
        </p>
        <button
          onClick={onComplete}
          style={{
            background: t.gold, border: "none", borderRadius: 10,
            padding: "12px 32px", color: t.bg, fontSize: 14,
            cursor: "pointer", fontFamily: fonts.ui,
          }}
        >
          ← Volver a los diálogos
        </button>
      </div>
    );
  }

  // Quiz view
  if (quizIndex !== null) {
    const q = dialogue.questions[quizIndex];
    const chosen = answers[quizIndex];
    return (
      <div>
        <div style={{ fontSize: 12, color: t.muted, marginBottom: 20, fontFamily: fonts.ui }}>
          Pregunta {quizIndex + 1} de {dialogue.questions.length}
        </div>
        <div style={{
          background: t.card, border: "1px solid " + t.border,
          borderRadius: 12, padding: "20px", marginBottom: 20,
        }}>
          <p style={{ fontSize: 15, color: t.text, margin: "0 0 20px", lineHeight: 1.5 }}>{q.q}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, i) => {
              let bg = t.surface;
              let border = t.border;
              let color = t.text;
              if (chosen !== undefined) {
                if (i === q.answer) { bg = t.correct + "22"; border = t.correct; color = t.correct; }
                else if (i === chosen && chosen !== q.answer) { bg = t.wrong + "22"; border = t.wrong; color = t.wrong; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(quizIndex, i)}
                  style={{
                    background: bg, border: "1px solid " + border,
                    borderRadius: 10, padding: "12px 16px",
                    color, fontSize: 16, fontFamily: fonts.serif,
                    direction: "rtl", textAlign: "right",
                    cursor: chosen !== undefined ? "default" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        {chosen !== undefined && (
          <button
            onClick={handleNext}
            style={{
              width: "100%", background: t.gold, border: "none",
              borderRadius: 10, padding: "14px", color: t.bg,
              fontSize: 14, cursor: "pointer", fontFamily: fonts.ui,
            }}
          >
            {quizIndex + 1 < dialogue.questions.length ? "Siguiente pregunta →" : "Terminar →"}
          </button>
        )}
      </div>
    );
  }

  // Playback view
  return (
    <div>
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 16, fontFamily: fonts.ui }}>
        Fase 3 — Escucha el diálogo completo y responde las preguntas
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {dialogue.lines.map((line, i) => (
          <div key={i} style={{
            background: t.card,
            border: "1px solid " + (playIndex === i ? t.gold : t.border),
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex", gap: 10, alignItems: "center",
            transition: "border-color 0.3s",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: line.speaker === "א" ? t.gold + "22" : t.surface,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontFamily: fonts.serif, fontSize: 12, color: t.gold,
            }}>
              {line.speaker}
            </div>
            <div style={{
              fontSize: 16, fontFamily: fonts.serif, direction: "rtl",
              color: playIndex === i ? t.text : t.muted, flex: 1, lineHeight: 1.4,
            }}>
              {line.he}
            </div>
            {playIndex === i && (
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: t.gold, animation: "pulse 1s infinite",
                flexShrink: 0,
              }} />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={playDialogue}
        disabled={playing}
        style={{
          width: "100%", background: playing ? t.surface : t.gold,
          border: "none", borderRadius: 10, padding: "14px",
          color: playing ? t.muted : t.bg, fontSize: 14,
          cursor: playing ? "default" : "pointer", fontFamily: fonts.ui,
          marginBottom: 10,
        }}
      >
        {playing ? "▶ Reproduciendo..." : "▶ Reproducir diálogo"}
      </button>
      {!playing && (
        <button
          onClick={() => setQuizIndex(0)}
          style={{
            width: "100%", background: "none",
            border: "1px solid " + t.border, borderRadius: 10,
            padding: "12px", color: t.muted, fontSize: 14,
            cursor: "pointer", fontFamily: fonts.ui,
          }}
        >
          Ir a las preguntas →
        </button>
      )}
    </div>
  );
}

// ── Dialogue Detail ──────────────────────────────────────────────────────────
function DialogueDetail({ t, dialogue, onBack, masteredCount }) {
  const tts = useTTS();
  const progress = getProgress();
  const dProg = progress.dialogues?.[dialogue.id] || { phase: 1, passed: false };
  const [currentPhase, setCurrentPhase] = useState(dProg.phase || 1);

  function advancePhase() {
    const next = Math.min(3, currentPhase + 1);
    saveDialogueProgress(dialogue.id, next, false);
    setCurrentPhase(next);
  }

  function completePhase3() {
    saveDialogueProgress(dialogue.id, 3, true);
    onBack();
  }

  const isLocked = masteredCount < dialogue.unlocksAt;

  return (
    <div style={{
      maxWidth: 600, margin: "0 auto", padding: "0 16px 80px",
      fontFamily: fonts.ui, color: t.text,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <h2 style={{
            fontSize: 20, fontFamily: fonts.serif, direction: "rtl",
            color: t.text, margin: 0,
          }}>
            {dialogue.title}
          </h2>
          <span style={{ fontSize: 13, color: t.muted }}>{dialogue.titleEs}</span>
        </div>
        {/* Phase tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[1, 2, 3].map(ph => (
            <div key={ph} style={{
              flex: 1, padding: "6px 0", textAlign: "center",
              borderRadius: 8, fontSize: 12,
              background: ph === currentPhase ? t.gold : t.surface,
              color: ph === currentPhase ? t.bg : t.muted,
              border: "1px solid " + (ph === currentPhase ? t.gold : t.border),
            }}>
              Fase {ph}
              {ph < currentPhase && " ✓"}
            </div>
          ))}
        </div>
      </div>

      {currentPhase === 1 && (
        <Phase1 t={t} dialogue={dialogue} onAdvance={advancePhase} tts={tts} />
      )}
      {currentPhase === 2 && (
        <Phase2 t={t} dialogue={dialogue} onAdvance={advancePhase} tts={tts} />
      )}
      {currentPhase === 3 && (
        <Phase3 t={t} dialogue={dialogue} onComplete={completePhase3} tts={tts} />
      )}
    </div>
  );
}

// ── Main Dialogos component ──────────────────────────────────────────────────
export default function Dialogos({ t, onBack }) {
  const [selected, setSelected] = useState(null);
  const progress = getProgress();
  const masteredCount = Object.values(progress.words || {}).filter(w => w.masteredAt).length;

  if (selected) {
    return (
      <DialogueDetail
        t={t}
        dialogue={selected}
        onBack={() => setSelected(null)}
        masteredCount={masteredCount}
      />
    );
  }

  return (
    <div style={{
      maxWidth: 600, margin: "0 auto", padding: "0 16px 80px",
      fontFamily: fonts.ui, color: t.text,
    }}>
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 20 }}>
        {masteredCount} palabras dominadas · Desbloquea diálogos aprendiendo más
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DIALOGUES.map(d => {
          const isLocked = masteredCount < d.unlocksAt;
          const dProg = progress.dialogues?.[d.id];
          const phase = dProg?.phase || 1;
          const passed = dProg?.passed;

          return (
            <div
              key={d.id}
              onClick={() => !isLocked && setSelected(d)}
              style={{
                background: t.card,
                border: "1px solid " + (passed ? t.gold + "66" : t.border),
                borderRadius: 14,
                padding: "18px 20px",
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.5 : 1,
                transition: "border-color 0.2s",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={e => { if (!isLocked) e.currentTarget.style.borderColor = t.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = passed ? t.gold + "66" : t.border; }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 17, fontFamily: fonts.serif,
                    direction: "rtl", color: t.text,
                  }}>
                    {d.title}
                  </span>
                  <span style={{ fontSize: 13, color: t.muted }}>{d.titleEs}</span>
                </div>
                <div style={{ fontSize: 12, color: t.muted }}>
                  {isLocked
                    ? "Necesitas " + d.unlocksAt + " palabras para desbloquear"
                    : passed
                      ? "✓ completado · Fase " + phase + "/3"
                      : dProg
                        ? "En curso · Fase " + phase + "/3"
                        : "Disponible · " + d.lines.length + " líneas"}
                </div>
              </div>
              <div style={{ fontSize: 20, color: isLocked ? t.subtle : passed ? t.gold : t.muted, flexShrink: 0, marginLeft: 16 }}>
                {isLocked ? "🔒" : passed ? "✦" : "→"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
