import { useState, useEffect, useRef, useCallback } from "react";
import { fonts } from "../theme";
import { WORDS, GROUPS, getWordsForGroup, BINYAN_COLORS } from "../data/words";
import {
  getProgress,
  saveWordProgress,
  unlockGroup,
  markTodayDone,
  canUnlockNextGroup,
} from "../utils/storage";
import {
  getStudyQueue,
  applyAssessment,
  getActiveMana,
  getMasteredCount,
  getCardMana,
} from "../utils/mana";

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

  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL";
    u.rate = 0.85;
    if (voiceRef.current) u.voice = voiceRef.current;
    synthRef.current.speak(u);
  }, []);

  return speak;
}

// ── Conjugation table ────────────────────────────────────────────────────────
function ConjTable({ t, conj, conjTr }) {
  if (!conj) return null;
  const cells = [
    { label: "m.s.", val: conj.ms, tr: conjTr?.ms },
    { label: "f.s.", val: conj.fs, tr: conjTr?.fs },
    { label: "m.p.", val: conj.mp, tr: conjTr?.mp },
    { label: "f.p.", val: conj.fp, tr: conjTr?.fp },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 6, width: "100%", marginTop: 8,
    }}>
      {cells.map(c => (
        <div key={c.label} style={{
          background: t.surface, borderRadius: 8,
          padding: "8px 10px", textAlign: "center",
        }}>
          <div style={{ fontSize: 10, color: t.muted, marginBottom: 2 }}>{c.label}</div>
          <div style={{ fontSize: 18, color: t.text, fontFamily: fonts.serif, direction: "rtl" }}>
            {c.val}
          </div>
          {c.tr && (
            <div style={{ fontSize: 11, color: t.gold, marginTop: 2, letterSpacing: 0.3 }}>
              {c.tr}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Mana bar ─────────────────────────────────────────────────────────────────
function ManaBar({ t, mana }) {
  const color = mana >= 70 ? t.correct : mana >= 40 ? t.gold : t.wrong;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: t.surface, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: mana + "%", borderRadius: 2,
          background: color, transition: "width 0.4s",
        }} />
      </div>
      <span style={{ fontSize: 11, color: t.muted, minWidth: 32, textAlign: "right" }}>{mana}%</span>
    </div>
  );
}

export default function Peldanos({ t, onBack, onManaChange }) {
  const speak = useTTS();
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ know: 0, partial: 0, dont: 0 });
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(() => getProgress());
  const [nextGroup, setNextGroup] = useState(null);
  const [unlockBanner, setUnlockBanner] = useState(null);

  // Build queue on mount
  useEffect(() => {
    const p = getProgress();
    setProgress(p);
    const q = getStudyQueue(p, WORDS);
    const shuffled = [...q].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    // Pre-compute next group
    const maxUnlocked = Math.max(...(p.unlockedGroups || [1]));
    if (maxUnlocked < 12) setNextGroup(maxUnlocked + 1);
  }, []);

  // Auto-play TTS on new card (front)
  useEffect(() => {
    if (!flipped && queue.length > 0 && currentIndex < queue.length) {
      const word = queue[currentIndex];
      if (word?.he) {
        const timer = setTimeout(() => speak(word.he), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, flipped, queue]);

  const currentWord = queue[currentIndex];

  function handleAssessment(assessment) {
    if (!currentWord) return;
    const p = getProgress();
    const wordData = p.words[currentWord.id] || { mana: 0 };
    const newData = applyAssessment(wordData, assessment);
    saveWordProgress(currentWord.id, newData);
    markTodayDone();
    onManaChange?.();

    setSessionStats(s => ({ ...s, [assessment]: s[assessment] + 1 }));

    if (currentIndex + 1 >= queue.length) {
      setProgress(getProgress());
      setDone(true);
    } else {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    }
  }

  function handleUnlock() {
    if (!nextGroup) return;
    unlockGroup(nextGroup);
    onManaChange?.();
    const unlockedNum = nextGroup;
    // Pre-compute the group after this one
    const p = getProgress();
    const maxUnlocked = Math.max(...(p.unlockedGroups || [1]), nextGroup);
    setNextGroup(maxUnlocked < 12 ? maxUnlocked + 1 : null);
    // Start new session with unlocked words
    const newWords = getWordsForGroup(unlockedNum).sort(() => Math.random() - 0.5);
    setQueue(newWords);
    setCurrentIndex(0);
    setFlipped(false);
    setDone(false);
    setSessionStats({ know: 0, partial: 0, dont: 0 });
    setUnlockBanner(unlockedNum);
    setTimeout(() => setUnlockBanner(null), 3000);
  }

  const groupNum = currentWord?.group;
  const groupWords = groupNum ? getWordsForGroup(groupNum) : [];
  const currentMana = currentWord
    ? getCardMana((getProgress().words || {})[currentWord.id] || {})
    : 0;

  // ── Empty queue ──────────────────────────────────────────────────────────
  if (queue.length === 0 && !done) {
    return (
      <div style={{
        maxWidth: 480, margin: "0 auto", padding: "0 16px 80px",
        fontFamily: fonts.ui, color: t.text,
      }}>
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
          <h2 style={{ fontSize: 22, color: t.text, fontFamily: fonts.serif, margin: "0 0 12px" }}>
            Todo al día
          </h2>
          <p style={{ color: t.muted, lineHeight: 1.6, marginBottom: 24 }}>
            No hay palabras pendientes para hoy.
          </p>
          {nextGroup && (
            <button
              onClick={handleUnlock}
              style={{
                width: "100%", background: t.gold, border: "none",
                borderRadius: 10, padding: "14px", color: t.bg,
                fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 10,
              }}
            >
              🔓 Empezar Grupo {nextGroup} — 5 palabras nuevas →
            </button>
          )}
          <button
            onClick={onBack}
            style={{
              width: "100%", background: "none",
              border: "1px solid " + t.border, borderRadius: 10,
              padding: "12px", color: t.muted, fontSize: 14, cursor: "pointer",
            }}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── Session complete ─────────────────────────────────────────────────────
  if (done) {
    const total = sessionStats.know + sessionStats.partial + sessionStats.dont;
    const activeMana = getActiveMana(progress, WORDS);
    const unlockAllowed = canUnlockNextGroup(progress);

    return (
      <div style={{
        maxWidth: 480, margin: "0 auto", padding: "0 16px 80px",
        fontFamily: fonts.ui, color: t.text,
      }}>
        <div style={{ textAlign: "center", paddingTop: 40, marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {sessionStats.dont === 0 ? "⭐" : "✦"}
          </div>
          <h2 style={{ fontSize: 22, color: t.text, fontFamily: fonts.serif, margin: "0 0 8px" }}>
            Sesión completada
          </h2>
          <p style={{ color: t.muted, fontSize: 13 }}>{total} palabras revisadas</p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10, marginBottom: 24,
        }}>
          {[
            { label: "Lo sé", count: sessionStats.know, color: t.correct },
            { label: "Más o menos", count: sessionStats.partial, color: t.gold },
            { label: "No lo sé", count: sessionStats.dont, color: t.wrong },
          ].map(s => (
            <div key={s.label} style={{
              background: t.card, border: "1px solid " + t.border,
              borderRadius: 10, padding: "14px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mana */}
        <div style={{
          background: t.card, border: "1px solid " + t.border,
          borderRadius: 10, padding: "14px 16px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.muted }}>Maná activo</span>
            <span style={{ fontSize: 12, color: t.gold, fontWeight: "bold" }}>{activeMana}%</span>
          </div>
          <div style={{ height: 6, background: t.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: activeMana + "%",
              background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")",
              borderRadius: 3,
            }} />
          </div>
        </div>

        {nextGroup && unlockAllowed && (
          <button
            onClick={handleUnlock}
            style={{
              width: "100%", background: t.gold, border: "none",
              borderRadius: 10, padding: "14px", color: t.bg,
              fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 10,
            }}
          >
            🔓 Continuar — Grupo {nextGroup} →
          </button>
        )}

        {nextGroup && !unlockAllowed && (
          <div style={{
            fontSize: 12, color: t.muted, textAlign: "center",
            padding: "8px 0", marginBottom: 10,
          }}>
            🔒 Practica en Frases o Diálogos primero
          </div>
        )}

        <button
          onClick={onBack}
          style={{
            width: "100%", background: "none",
            border: "1px solid " + t.border, borderRadius: 10,
            padding: "12px", color: t.muted, fontSize: 14, cursor: "pointer",
          }}
        >
          ← Volver al inicio
        </button>
      </div>
    );
  }

  // ── Main card ────────────────────────────────────────────────────────────
  return (
    <div style={{
      maxWidth: 480, margin: "0 auto", padding: "0 16px 80px",
      fontFamily: fonts.ui, color: t.text,
    }}>
      {/* Unlock banner */}
      {unlockBanner && (
        <div style={{
          background: t.gold + "22", border: "1px solid " + t.gold + "66",
          borderRadius: 10, padding: "10px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, color: t.gold,
        }}>
          🔓 ¡Grupo {unlockBanner} desbloqueado! Aquí van las palabras nuevas.
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16,
      }}>
        <span style={{ fontSize: 12, color: t.muted }}>
          Grupo {groupNum} · {groupWords.length} palabras
        </span>
        <span style={{ fontSize: 12, color: t.muted }}>
          {currentIndex + 1} / {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: t.surface, borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: ((currentIndex + (flipped ? 0.5 : 0)) / queue.length * 100) + "%",
          background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")",
          borderRadius: 2, transition: "width 0.3s",
        }} />
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        style={{
          background: t.card,
          border: "1px solid " + (flipped ? t.gold + "66" : t.border),
          borderRadius: 20,
          padding: "36px 28px",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          cursor: flipped ? "default" : "pointer",
          transition: "border-color 0.3s",
          boxShadow: "0 8px 40px #00000014",
          userSelect: "none",
        }}
      >
        {/* Binyan badge */}
        {currentWord?.type === "verb" && currentWord?.binyan && (
          <div style={{
            fontSize: 11, padding: "3px 10px",
            borderRadius: 20,
            background: (BINYAN_COLORS[currentWord.binyan] || "#666") + "22",
            color: BINYAN_COLORS[currentWord.binyan] || "#666",
            border: "1px solid " + (BINYAN_COLORS[currentWord.binyan] || "#666") + "44",
            fontFamily: fonts.serif, direction: "rtl",
            alignSelf: "flex-start",
          }}>
            {currentWord.binyan}
          </div>
        )}

        {/* Hebrew word */}
        <div style={{
          fontSize: currentWord?.he?.length > 8 ? 48 : 64,
          fontWeight: "bold",
          direction: "rtl",
          fontFamily: fonts.serif,
          color: t.text,
          lineHeight: 1.2,
          textAlign: "center",
        }}>
          {currentWord?.he}
        </div>

        {/* Verb details on front */}
        {!flipped && currentWord?.type === "verb" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {currentWord.root && (
              <div style={{ fontSize: 16, color: t.gold, fontFamily: fonts.serif, direction: "rtl" }}>
                {currentWord.root}
              </div>
            )}
            {currentWord.formula && (
              <div style={{ fontSize: 13, color: t.muted, fontFamily: fonts.serif, direction: "rtl" }}>
                {currentWord.formula}
              </div>
            )}
          </div>
        )}

        {/* TTS button */}
        <button
          onClick={e => { e.stopPropagation(); speak(currentWord?.he); }}
          style={{
            background: t.surface, border: "none", borderRadius: 20,
            padding: "6px 14px", color: t.muted, fontSize: 12,
            cursor: "pointer",
          }}
        >
          🔊 Escuchar
        </button>

        {/* Mana indicator */}
        <div style={{ width: "80%", maxWidth: 200 }}>
          <ManaBar t={t} mana={currentMana} />
        </div>

        {/* Back side */}
        {flipped && (
          <>
            <div style={{
              width: "100%", borderTop: "1px solid " + t.border,
              paddingTop: 20, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 10,
            }}>
              <div style={{ fontSize: 22, fontWeight: "bold", color: t.text }}>
                {currentWord?.es}
              </div>
              <div style={{ fontSize: 14, color: t.gold, letterSpacing: 1 }}>
                {currentWord?.tr}
              </div>
              {currentWord?.conj && (
                <ConjTable t={t} conj={currentWord.conj} conjTr={currentWord.conjTr} />
              )}
            </div>
          </>
        )}

        {!flipped && (
          <div style={{ fontSize: 12, color: t.subtle }}>
            Toca para ver la traducción
          </div>
        )}
      </div>

      {/* Assessment buttons */}
      {flipped && (
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={() => handleAssessment("dont")}
            style={{
              flex: 1, padding: "14px 8px",
              background: t.wrong + "15",
              border: "1px solid " + t.wrong + "44",
              borderRadius: 12, color: t.wrong,
              fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
            }}
          >
            ✗ No lo sé
          </button>
          <button
            onClick={() => handleAssessment("partial")}
            style={{
              flex: 1, padding: "14px 8px",
              background: t.gold + "15",
              border: "1px solid " + t.gold + "44",
              borderRadius: 12, color: t.gold,
              fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
            }}
          >
            ~ Más o menos
          </button>
          <button
            onClick={() => handleAssessment("know")}
            style={{
              flex: 1, padding: "14px 8px",
              background: t.correct + "15",
              border: "1px solid " + t.correct + "44",
              borderRadius: 12, color: t.correct,
              fontSize: 13, cursor: "pointer", fontFamily: fonts.ui,
            }}
          >
            ✓ Lo sé
          </button>
        </div>
      )}
    </div>
  );
}
