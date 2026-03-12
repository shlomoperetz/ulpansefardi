import { useState } from "react";
import { fonts } from "../theme";
import { getProgress, isLoteUnlocked } from "../utils/storage";
import { ALL_CARDS, LOTES } from "../data/cards";
import { FRASES_POR_LOTE } from "../data/frases";

export default function Landing({ t, onNavigate }) {
  const [showLotes, setShowLotes] = useState(false);
  const [showLilmod, setShowLilmod] = useState(false);
  const [showFrases, setShowFrases] = useState(false);
  const progress = getProgress();
  const mastered = Object.values(progress.cards).filter(c => c.mastered).length;
  const pct = Math.round((mastered / ALL_CARDS.length) * 100);
  const today = new Date().toISOString().split("T")[0];
  const practicedToday = progress.lastSession === today;

  // Frases acumuladas de todos los lotes completados
  const frasesDesbloqueadas = Object.entries(FRASES_POR_LOTE)
    .filter(([loteId]) => progress.loteDone[Number(loteId)])
    .flatMap(([, frases]) => frases);

  const niveles = [
    { nivel: 0, label: "Núcleo — palabras ancla" },
    { nivel: 1, label: "Verbos y adjetivos" },
    { nivel: 2, label: "Repaso por categoría" },
    { nivel: 3, label: "Repaso final" },
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
    const hasFrases = !!FRASES_POR_LOTE[lote.id];
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
          <div style={{ fontSize: 14, color: t.text, fontWeight: done ? "bold" : "normal", display: "flex", alignItems: "center", gap: 6 }}>
            {lote.label}
            {hasFrases && !done && (
              <span style={{ fontSize: 10, color: t.gold, fontFamily: fonts.ui, opacity: 0.7 }}>✦ frases</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 2, fontFamily: fonts.ui }}>{lote.cards.length} palabras</div>
          {hasFrases && !done && !locked && (
            <div style={{ fontSize: 11, color: t.subtle, marginTop: 3, direction: "rtl", fontFamily: fonts.serif }}>
              {FRASES_POR_LOTE[lote.id][0].he}
            </div>
          )}
        </div>
        <div style={{ fontSize: 16, color: done ? t.gold : locked ? t.subtle : t.muted, flexShrink: 0, marginLeft: 12 }}>
          {done ? "✦" : locked ? "⊗" : "→"}
        </div>
      </div>
    );
  }

  const sectionBtn = (onClick, hebrew, tr, title, sub, open) => (
    <button onClick={onClick} style={{
      width: "100%", background: t.card, border: "1px solid " + t.border,
      borderRadius: 14, padding: "20px 24px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: fonts.serif, color: t.text, marginBottom: 12,
    }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 20, color: t.gold }}>{hebrew} <span style={{ fontSize: 11, color: t.muted }}>{tr}</span></div>
        <div style={{ fontSize: 15, fontWeight: "bold", marginTop: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: t.muted, marginTop: 2, fontFamily: fonts.ui }}>{sub}</div>
      </div>
      <div style={{ fontSize: 20, color: t.gold }}>{open ? "↑" : "↓"}</div>
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: fonts.serif, color: t.text }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: "bold", color: t.gold, margin: 0, direction: "rtl" }}>אולפן ספרדי</h1>
        <p style={{ fontSize: 18, color: t.muted, marginTop: 8 }}>ulpan sefardi</p>

        <div style={{ marginTop: 40, background: t.card, border: "1px solid " + t.border, borderRadius: 16, padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui }}>Progreso total</span>
            <span style={{ fontSize: 13, color: t.gold, fontFamily: fonts.ui }}>{mastered}/{ALL_CARDS.length} palabras</span>
          </div>
          <div style={{ width: "100%", height: 6, background: t.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + t.gold + "," + t.goldLight + ")", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: t.text }}>{mastered}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>dominadas</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: t.text }}>{ALL_CARDS.length - mastered}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>pendientes</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: practicedToday ? t.correct : t.text }}>{progress.streak || 0}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.ui }}>dias seguidos</div>
            </div>
          </div>
          {practicedToday && (
            <div style={{ marginTop: 16, fontSize: 12, color: t.correct, textAlign: "center", fontFamily: fonts.ui }}>✓ has practicado hoy</div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── Frases que puedes decir ── */}
        {sectionBtn(
          () => setShowFrases(v => !v),
          "מִשְׁפָּטִים", "mishpatim",
          "Frases que puedes decir",
          frasesDesbloqueadas.length > 0
            ? `${frasesDesbloqueadas.length} frases desbloqueadas`
            : "Completa lotes para desbloquear frases",
          showFrases
        )}

        {showFrases && (
          <div style={{ marginBottom: 16 }}>
            {frasesDesbloqueadas.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: t.muted, fontSize: 13, fontFamily: fonts.ui, background: t.card, borderRadius: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🌱</div>
                Completa la Capa 0 y sigue adelante — las primeras frases aparecerán pronto.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {frasesDesbloqueadas.map((f, i) => (
                  <div key={i} style={{ background: t.card, borderRadius: 12, padding: "14px 20px", borderLeft: "3px solid " + t.gold + "55" }}>
                    <div style={{ fontSize: 20, fontWeight: "bold", direction: "rtl", color: t.text, lineHeight: 1.4 }}>{f.he}</div>
                    <div style={{ fontSize: 11, color: t.muted, fontStyle: "italic", fontFamily: fonts.ui, marginTop: 3 }}>{f.tr}</div>
                    <div style={{ fontSize: 13, color: t.muted, fontFamily: fonts.ui, marginTop: 5 }}>{f.es}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Jazara (repaso) ── */}
        {sectionBtn(
          () => setShowLotes(v => !v),
          "חֲזָרָה", "jazara",
          "Tarjetas de repaso",
          `${Object.keys(progress.loteDone).length}/${LOTES.length} lotes completados`,
          showLotes
        )}

        {showLotes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 16 }}>
            {niveles.map(n => (
              <div key={n.nivel}>
                <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, paddingLeft: 4, fontFamily: fonts.ui }}>
                  {n.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {LOTES.filter(l => l.nivel === n.nivel).map(l => <LoteBtn key={l.id} lote={l} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Lilmod (aprender) ── */}
        {sectionBtn(
          () => setShowLilmod(v => !v),
          "לִלְמֹד", "lilmod",
          "Aprender",
          "Estudia las palabras antes de repasar",
          showLilmod
        )}

        {showLilmod && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 16 }}>
            {niveles.map(n => (
              <div key={n.nivel}>
                <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, paddingLeft: 4, fontFamily: fonts.ui }}>
                  {n.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {LOTES.filter(l => l.nivel === n.nivel).map(l => (
                    <div
                      key={l.id}
                      onClick={() => onNavigate("lilmod", l.id)}
                      style={{
                        background: t.card, borderRadius: 12, padding: "14px 18px",
                        border: "1px solid " + t.border, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = t.gold}
                      onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                    >
                      <div>
                        <div style={{ fontSize: 14, color: t.text }}>{l.label}</div>
                        <div style={{ fontSize: 11, color: t.muted, marginTop: 2, fontFamily: fonts.ui }}>{l.cards.length} palabras</div>
                      </div>
                      <div style={{ fontSize: 16, color: t.muted }}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Dikduk (próximamente) ── */}
        <div style={{ background: t.card, border: "1px solid " + t.border, borderRadius: 14, padding: "20px 24px", opacity: 0.45, marginTop: 8 }}>
          <div style={{ fontSize: 20, color: t.gold }}>דִּקְדּוּק <span style={{ fontSize: 11, color: t.muted }}>dikduk</span></div>
          <div style={{ fontSize: 15, fontWeight: "bold", marginTop: 4 }}>Gramatica</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2, fontFamily: fonts.ui }}>Proximamente</div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: 24, fontSize: 12, color: t.subtle, borderTop: "1px solid " + t.border, fontFamily: fonts.ui }}>
        ulpansefardi.com · by <a href="https://shlomoperetz.com" style={{ color: t.gold, textDecoration: "none" }}>Shlomo Peretz</a>
      </div>
    </div>
  );
}
