import { useState } from "react";
import { fonts } from "../theme";
import { getProgress, isLoteUnlocked } from "../utils/storage";
import { ALL_CARDS, LOTES } from "../data/cards";

export default function Landing({ t, onNavigate }) {
  const [showLotes, setShowLotes] = useState(false);
  const progress = getProgress();
  const mastered = Object.values(progress.cards).filter(c => c.mastered).length;
  const pct = Math.round((mastered / ALL_CARDS.length) * 100);
  const today = new Date().toISOString().split("T")[0];
  const practicedToday = progress.lastSession === today;

  const niveles = [
    { nivel: 1, label: "Nivel 1 — Lotes base" },
    { nivel: 2, label: "Nivel 2 — Repaso por categoria" },
    { nivel: 3, label: "Nivel 3 — Repaso final" },
  ];

  function loteStatus(lote) {
    if (progress.loteDone[lote.id]) return "done";
    if (isLoteUnlocked(lote, progress.loteDone)) return "open";
    return "locked";
  }

  function LoteBtn({ lote }) {
    const status = loteStatus(lote);
    const locked = status === "locked";
    const done = status === "done";
    return (
      <div
        onClick={() => !locked && onNavigate("anki", lote.id)}
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
          <div style={{ fontSize: 14, color: t.text, fontWeight: done ? "bold" : "normal" }}>{lote.label}</div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{lote.cards.length} palabras</div>
        </div>
        <div style={{ fontSize: 16, color: done ? t.gold : locked ? t.subtle : t.muted }}>
          {done ? "✦" : locked ? "⊗" : "→"}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: fonts.serif, color: t.text }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: "bold", color: t.gold, margin: 0, direction: "rtl" }}>אולפן ספרדי</h1>
        <p style={{ fontSize: 18, color: t.muted, marginTop: 8 }}>ulpan sefardi</p>

        <div style={{ marginTop: 40, background: t.card, border: "1px solid " + t.border, borderRadius: 16, padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: t.muted }}>Progreso total</span>
            <span style={{ fontSize: 13, color: t.gold }}>{mastered}/{ALL_CARDS.length} palabras</span>
          </div>
          <div style={{ width: "100%", height: 6, background: t.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: t.text }}>{mastered}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>dominadas</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: t.text }}>{ALL_CARDS.length - mastered}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>pendientes</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: practicedToday ? t.correct : t.text }}>{progress.streak || 0}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>dias seguidos</div>
            </div>
          </div>
          {practicedToday && (
            <div style={{ marginTop: 16, fontSize: 12, color: t.correct, textAlign: "center" }}>✓ has practicado hoy</div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px" }}>
        <button onClick={() => setShowLotes(v => !v)} style={{
          width: "100%", background: t.card, border: "1px solid " + t.border,
          borderRadius: 14, padding: "20px 24px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: fonts.serif, color: t.text, marginBottom: 12,
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 20, color: t.gold }}>חֲזָרָה <span style={{ fontSize: 11, color: t.muted }}>jazara</span></div>
            <div style={{ fontSize: 15, fontWeight: "bold", marginTop: 4 }}>Tarjetas de repaso</div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
              {Object.keys(progress.loteDone).length}/{LOTES.length} lotes completados
            </div>
          </div>
          <div style={{ fontSize: 20, color: t.gold }}>{showLotes ? "↑" : "↓"}</div>
        </button>

        {showLotes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 16 }}>
            {niveles.map(n => (
              <div key={n.nivel}>
                <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
                  {n.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {LOTES.filter(l => l.nivel === n.nivel).map(l => <LoteBtn key={l.id} lote={l} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: t.card, border: "1px solid " + t.border, borderRadius: 14, padding: "20px 24px", opacity: 0.45, marginTop: 8 }}>
          <div style={{ fontSize: 20, color: t.gold }}>דִּקְדּוּק <span style={{ fontSize: 11, color: t.muted }}>dikduk</span></div>
          <div style={{ fontSize: 15, fontWeight: "bold", marginTop: 4 }}>Gramatica</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>Proximamente</div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: 24, fontSize: 12, color: t.subtle, borderTop: "1px solid " + t.border }}>
        ulpansefardi.com · ecosistema <a href="https://siddursefardi.com" style={{ color: t.gold, textDecoration: "none" }}>siddursefardi</a>
      </div>
    </div>
  );
}
