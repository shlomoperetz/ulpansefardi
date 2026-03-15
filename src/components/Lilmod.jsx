import { useState, useEffect, useRef, useCallback } from "react";
import { LOTES, BINYAN_COLORS } from "../data/cards";
import { FRASES_POR_LOTE } from "../data/frases";
import { fonts } from "../theme";

export default function Lilmod({ t, loteId, onBack }) {
  const lote = LOTES.find(l => l.id === loteId);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const card = lote.cards[index];
  const isLast = index === lote.cards.length - 1;

  // ── TTS ──────────────────────────────────────────────────────────────────
  const synthRef = useRef(null);
  const voiceRef = useRef(null);
  const [ttsOk, setTtsOk] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synthRef.current = synth;
    function loadVoices() {
      const v = synth.getVoices().find(v => v.lang.startsWith("he"));
      if (v) { voiceRef.current = v; setTtsOk(true); }
    }
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current || !voiceRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.voice = voiceRef.current;
    utt.lang  = "he-IL";
    utt.rate  = 0.85;
    synthRef.current.speak(utt);
  }, []);

  // Auto-play al cambiar de carta
  useEffect(() => {
    if (ttsOk && card?.he) speak(card.he);
  }, [index, ttsOk]);

  const SpeakBtn = ({ text, size = 15 }) => !ttsOk ? null : (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      title="Escuchar"
      style={{ background: "none", border: "none", cursor: "pointer", color: t.gold, fontSize: size, padding: "2px 4px", lineHeight: 1, flexShrink: 0 }}
    >🔊</button>
  );

  function goNext() { setIndex(i => i + 1); setRevealed(false); }
  function goPrev() { setIndex(i => i - 1); setRevealed(false); }

  const btnBase = {
    flex: 1, background: t.card, border: "1px solid " + t.border, borderRadius: 14,
    padding: "12px 0", color: t.muted, fontSize: 14, fontFamily: fonts.ui,
    cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px 60px", fontFamily: fonts.serif, color: t.text }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: fonts.ui }}>
          ← volver
        </button>
        <span style={{ fontSize: 11, padding: "3px 12px", border: "1px solid " + t.gold + "44", borderRadius: 20, color: t.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>
          {lote.label}
        </span>
        <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>{index + 1}/{lote.cards.length}</span>
      </div>

      <div
        onClick={() => !revealed && setRevealed(true)}
        style={{
          background: t.card, border: "1px solid " + t.border, borderRadius: 22,
          padding: "48px 32px", textAlign: "center",
          cursor: revealed ? "default" : "pointer",
          minHeight: 240, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
          boxShadow: "0 8px 40px rgba(0,80,200,0.10)", transition: "border-color 0.3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 48, fontWeight: "bold", direction: "rtl", lineHeight: 1.3 }}>{card.he}</div>
          <SpeakBtn text={card.he} size={22} />
        </div>
        <div style={{ fontSize: 14, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui }}>{card.tr}</div>

        {card.binyan && (() => {
          const color = BINYAN_COLORS[card.binyan];
          return (
            <span style={{
              fontSize: 12, padding: "2px 12px", borderRadius: 12, fontFamily: fonts.serif,
              background: color + "22", color, border: "1px solid " + color + "55",
            }}>
              {card.binyan}
            </span>
          );
        })()}

        {card.conj && revealed && (
          <div style={{ width: "100%", marginTop: 8, borderTop: "1px solid " + t.border, paddingTop: 12 }}>
            <div style={{ fontSize: 10, color: t.subtle, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui, marginBottom: 8, textAlign: "center" }}>הווה — presente</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { label: "הוא / אתה / אני ♂", form: card.conj.ms },
                { label: "היא / את / אני ♀",  form: card.conj.fs },
                { label: "הם / אתם ♂",         form: card.conj.mp },
                { label: "הן / אתן ♀",          form: card.conj.fp },
              ].map(({ label, form }) => (
                <div key={label} style={{ background: t.surface, borderRadius: 12, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: t.subtle, fontFamily: fonts.ui, marginBottom: 4, direction: "rtl", lineHeight: 1.2 }}>{label}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <div style={{ fontSize: 20, fontFamily: fonts.serif, color: t.text, direction: "rtl", lineHeight: 1.4 }}>{form}</div>
                    <SpeakBtn text={form} size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {revealed ? (
          <div style={{ fontSize: 26, color: t.text, marginTop: 12, fontFamily: fonts.ui }}>{card.es}</div>
        ) : (
          <div style={{ fontSize: 12, color: t.subtle, marginTop: 16, fontFamily: fonts.ui }}>
            toca para ver la traducción
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={goPrev} disabled={index === 0} style={{ ...btnBase, opacity: index === 0 ? 0.3 : 1 }}>
          ← anterior
        </button>
        {!isLast ? (
          <button onClick={goNext} style={{ ...btnBase, color: revealed ? t.gold : t.muted, borderColor: revealed ? t.gold + "66" : t.border }}>
            siguiente →
          </button>
        ) : (
          <button onClick={onBack} style={{ ...btnBase, color: t.gold, borderColor: t.gold + "66" }}>
            ✦ terminar
          </button>
        )}
      </div>

      {isLast && revealed && FRASES_POR_LOTE[loteId] && (
        <div style={{ marginTop: 28, borderTop: "1px solid " + t.border, paddingTop: 20 }}>
          <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui, marginBottom: 14, textAlign: "center" }}>
            con estas palabras puedes decir
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FRASES_POR_LOTE[loteId].map((f, i) => (
              <div key={i} style={{ background: t.card, borderRadius: 16, padding: "14px 20px", borderLeft: "3px solid " + t.gold + "88" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 20, fontWeight: "bold", direction: "rtl", color: t.text, lineHeight: 1.4, flex: 1, textAlign: "right" }}>{f.he}</div>
                  <SpeakBtn text={f.he} size={14} />
                </div>
                <div style={{ fontSize: 11, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui, marginTop: 3 }}>{f.tr}</div>
                <div style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui, marginTop: 5 }}>{f.es}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
